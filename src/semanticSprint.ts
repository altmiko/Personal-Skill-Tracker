// IDs are specific to Research Library v0.1; previous sprint progress remains in backups.
export const sprintStages: {
  id: string;
  title: string;
  outcome: string;
  tasks: { id: string; title: string; steps: string[]; doneWhen: string; resources: { name: string; url: string }[] }[];
}[] = [
  {
    id: 'library-foundation', title: '1. Set up the local project',
    outcome: 'A reproducible Windows development environment with a Flask API, React frontend and local data directory.',
    tasks: [
      {
        id: 'rl-setup', title: 'Initialize the repository and tools',
        steps: ['Install Python 3.12, Node.js LTS, Git, uv and Tesseract with English language data; check that Tesseract and its language data are available.', 'Create a research-library repository with uv-managed backend and Vite React/TypeScript frontend. Install the Flask, SQLAlchemy, Alembic, PyMuPDF, NumPy and Sentence Transformers dependencies; commit the lockfiles.', 'Add pytest and frontend tooling, ignore environments, secrets and private papers, and document Windows setup and startup commands.'],
        doneWhen: 'A fresh checkout installs both projects from their lockfiles and the test commands run on Windows.',
        resources: [{ name: 'uv project guide', url: 'https://docs.astral.sh/uv/guides/projects/' }, { name: 'Vite getting started', url: 'https://vite.dev/guide/' }, { name: 'Tesseract Windows builds', url: 'https://github.com/UB-Mannheim/tesseract/wiki' }],
      },
      {
        id: 'rl-app-data', title: 'Start the API and protect local data',
        steps: ['Create a Flask application factory with /api/v1/health and bind to 127.0.0.1 by default; configure the Vite /api proxy for development.', 'Create the database, papers, models, exports and backups directories under %LOCALAPPDATA%\\ResearchLibrary, outside the repository.', 'Check OCR availability on startup and report actionable errors; restrict paths and avoid remote calls unless the user opts in.'],
        doneWhen: 'The frontend reaches the local health endpoint, the data directories are outside Git, and a missing OCR installation is reported clearly.',
        resources: [{ name: 'Flask application factories', url: 'https://flask.palletsprojects.com/en/stable/patterns/appfactories/' }, { name: 'Vite server proxy', url: 'https://vite.dev/config/server-options#server-proxy' }],
      },
    ],
  },
  {
    id: 'library-ingestion', title: '2. Import and process papers',
    outcome: 'Native and scanned PDFs are safely copied, extracted and processed through recoverable local jobs.',
    tasks: [
      {
        id: 'rl-schema', title: 'Create the SQLite schema and migrations',
        steps: ['Use SQLAlchemy and Alembic for papers, pages, chunks, embeddings, jobs and settings; add notes and paper links for the later milestones.', 'Enable foreign keys on every connection, enforce unique paper hashes and page/chunk constraints, and index foreign keys and job status.', 'Add SQLite FTS5 for chunk text with insert, update and delete synchronization triggers and an initial rebuild.'],
        doneWhen: 'Migrations create a fresh database, foreign keys are enforced on new connections, and FTS stays in sync after chunk edits and deletion.',
        resources: [{ name: 'SQLAlchemy SQLite dialect', url: 'https://docs.sqlalchemy.org/en/20/dialects/sqlite.html' }, { name: 'Alembic tutorial', url: 'https://alembic.sqlalchemy.org/en/latest/tutorial.html' }, { name: 'SQLite FTS5', url: 'https://www.sqlite.org/fts5.html' }],
      },
      {
        id: 'rl-import', title: 'Import and deduplicate PDFs',
        steps: ['Implement POST /api/v1/papers for one or more files; validate type and size, compute SHA-256 and reject duplicate content.', 'Copy originals to UUID-managed filenames inside the papers directory; retain original filenames and extracted metadata, not user-provided paths as storage paths.', 'Create paper and queued job records safely; clean up failed imports and keep originals intact.'],
        doneWhen: 'Uploading the same PDF bytes twice identifies the existing paper; the managed copy and metadata survive removal of the original file.',
        resources: [{ name: 'Flask file uploads', url: 'https://flask.palletsprojects.com/en/stable/patterns/fileuploads/' }, { name: 'OWASP file upload guidance', url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html' }],
      },
      {
        id: 'rl-worker', title: 'Run recoverable import jobs',
        steps: ['Create a persisted job table and one local worker thread; return paper and job IDs immediately and expose status and retry endpoints.', 'Record queued, processing, ready and failed states with useful errors; recover interrupted work to a retriable state on startup.', 'Make reprocessing idempotent: transactionally replace affected derived data without duplicating pages, chunks or vectors.'],
        doneWhen: 'Ten imports finish or report actionable errors; interrupting and retrying a job leaves no duplicate derived records.',
        resources: [{ name: 'Python threading', url: 'https://docs.python.org/3/library/threading.html' }, { name: 'SQLAlchemy transactions', url: 'https://docs.sqlalchemy.org/en/20/orm/session_transaction.html' }],
      },
      {
        id: 'rl-extract-ocr', title: 'Extract native text and OCR scanned pages',
        steps: ['Extract PDF metadata and individual pages with PyMuPDF; preserve page numbers and native, OCR or empty extraction method.', 'On each page with insufficient or unusable native text, run English Tesseract OCR at approximately 200–300 DPI; handle mixed native/scanned PDFs and missing language data.', 'Preserve usable pages when another page fails; surface errors without claiming perfect equations, tables or multi-column reconstruction.'],
        doneWhen: 'Native and scanned fixture pages yield searchable text with correct page numbers, while OCR or page failures remain visible.',
        resources: [{ name: 'PyMuPDF text extraction', url: 'https://pymupdf.readthedocs.io/en/latest/recipes-text.html' }, { name: 'PyMuPDF OCR', url: 'https://pymupdf.readthedocs.io/en/latest/recipes-ocr.html' }],
      },
      {
        id: 'rl-chunks', title: 'Make page-aware searchable chunks',
        steps: ['Normalize text conservatively and prefer paragraph and sentence boundaries; target 200–220 words with roughly 30 words of overlap.', 'Store chunk order, document, source page range and section when identifiable; transactionally replace chunks during reprocessing.', 'Test boundaries, short or empty pages, overlapping chunks and references across pages.'],
        doneWhen: 'Repeat processing yields traceable chunks without duplicates, and each result points to its source page range.',
        resources: [{ name: 'PyMuPDF text extraction', url: 'https://pymupdf.readthedocs.io/en/latest/recipes-text.html' }, { name: 'pytest', url: 'https://docs.pytest.org/en/stable/getting-started.html' }],
      },
    ],
  },
  {
    id: 'library-search', title: '3. Build and evaluate hybrid search',
    outcome: 'Local semantic and keyword retrieval find paper passages and survive a restart.',
    tasks: [
      {
        id: 'rl-embeddings', title: 'Embed and persist chunks locally',
        steps: ['Define embed_documents and embed_query interfaces with model ID, dimensions and formatting metadata; default to all-MiniLM-L6-v2 on CPU.', 'Normalize vectors, save float32 blobs and load a NumPy index; validate dimensions and model IDs before comparing vectors.', 'On model changes, re-embed stored chunks without reparsing PDFs; make any cloud provider an explicit opt-in with an off-device text warning.'],
        doneWhen: 'After restart, locally stored vectors can be searched offline after provisioning; vectors from different models are never mixed.',
        resources: [{ name: 'Sentence Transformers semantic search', url: 'https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html' }, { name: 'NumPy dot product', url: 'https://numpy.org/doc/stable/reference/generated/numpy.dot.html' }],
      },
      {
        id: 'rl-hybrid-search', title: 'Combine semantic and FTS5 retrieval',
        steps: ['Implement /api/v1/search with semantic, keyword and hybrid modes; retrieve semantic cosine and FTS5 keyword candidates independently.', 'Fuse rankings, for example with reciprocal rank fusion, and group matching chunks by paper with excerpts and page numbers.', 'Treat scores as ranking signals, not probabilities; expose model/index readiness and handle empty queries or unavailable indexes clearly.'],
        doneWhen: 'A concept query and an exact acronym retrieve relevant paper passages with source pages using the selected search mode.',
        resources: [{ name: 'SQLite FTS5', url: 'https://www.sqlite.org/fts5.html' }, { name: 'Reciprocal rank fusion', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html' }],
      },
      {
        id: 'rl-evaluate', title: 'Evaluate retrieval on your papers',
        steps: ['Create about 20 realistic queries with manually labeled relevant papers or chunks, including paraphrases and exact terms; protect private papers and queries.', 'Compare keyword, semantic and hybrid results before changing chunking or models; record representative successes and failures.', 'Run native PDF, scanned PDF, duplicate, ten-file import, restart, interruption/retry and offline-after-provisioning acceptance scenarios.'],
        doneWhen: 'A repeatable quality check documents relevant results and limitations, and the milestone import, search, recovery and offline scenarios pass.',
        resources: [{ name: 'Information retrieval evaluation', url: 'https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-in-information-retrieval-1.html' }, { name: 'pytest', url: 'https://docs.pytest.org/en/stable/getting-started.html' }],
      },
      {
        id: 'rl-library-ui', title: 'Add the minimal library and search UI',
        steps: ['Build the React library screen for multi-file upload, processing status, errors and retry; poll the job API while work is running.', 'Show global search results grouped by paper, with excerpts and source pages, and communicate index readiness.', 'Verify that imports and search still work after restarting the local app and disconnecting the internet after setup.'],
        doneWhen: 'A user can import a native or scanned paper and find its source pages from the local browser without external services.',
        resources: [{ name: 'React learn', url: 'https://react.dev/learn' }, { name: 'Flask testing', url: 'https://flask.palletsprojects.com/en/stable/testing/' }],
      },
    ],
  },
  {
    id: 'library-reader', title: '4. Read and take notes',
    outcome: 'Open source pages beside durable paper-specific and global Markdown notes.',
    tasks: [
      {
        id: 'rl-reader', title: 'Build the PDF reading workspace',
        steps: ['Serve original PDFs through the local API and create /papers/:id using react-pdf/PDF.js with scroll, zoom and page navigation.', 'Navigate a search result to its paper and matching page; show a PDF pane and a notes pane with collapsible or resizable sections.', 'Collapse the panes into tabs on narrow screens; test page navigation and reader errors.'],
        doneWhen: 'Selecting a search passage opens the correct PDF page, and reading and notes remain usable on narrow screens.',
        resources: [{ name: 'react-pdf', url: 'https://github.com/wojtekmaj/react-pdf' }, { name: 'PDF.js', url: 'https://mozilla.github.io/pdf.js/' }],
      },
      {
        id: 'rl-notes', title: 'Implement Markdown notes and autosave',
        steps: ['Provide global and paper-specific note CRUD through /api/v1/notes, with paper_id null for global notes.', 'Use CodeMirror 6 for Markdown editing and debounced autosave; show saving, saved and error states and protect unsaved edits.', 'Test note isolation, failed saves and persistence after restarting.'],
        doneWhen: 'Global and paper notes can be edited and reopened after restart, with visible feedback and no silent loss on save failure.',
        resources: [{ name: 'CodeMirror documentation', url: 'https://codemirror.net/docs/' }, { name: 'React effects', url: 'https://react.dev/learn/synchronizing-with-effects' }],
      },
      {
        id: 'rl-backup', title: 'Export notes and restore the library',
        steps: ['Export individual notes as Markdown and bulk notes as a ZIP.', 'Back up the database, managed PDFs and settings together using a consistent snapshot; validate restore inputs and protect existing data before replacing it.', 'Test backup and restore in a separate data directory, including notes, paper files, settings and searchable content.'],
        doneWhen: 'An exported backup restores a usable library with its PDFs and notes, and the Markdown ZIP contains the expected notes.',
        resources: [{ name: 'SQLite backup API', url: 'https://www.sqlite.org/backup.html' }, { name: 'Python zipfile', url: 'https://docs.python.org/3/library/zipfile.html' }],
      },
    ],
  },
  {
    id: 'library-release', title: '5. Organize, verify and release',
    outcome: 'A local v0.1 library manages papers, relationships and recoverable data on a CPU-only Windows machine.',
    tasks: [
      {
        id: 'rl-organize', title: 'Finish imports and metadata editing',
        steps: ['Add safe directory import from explicitly allowed or user-selected roots, plus multi-file and batch status; reject paths outside allowed roots.', 'Provide paper browsing and manual title, author and year correction while retaining original file metadata.', 'Test duplicate detection and useful batch errors, including inaccessible files.'],
        doneWhen: 'A user can import a folder, inspect per-paper status and correct metadata without exposing arbitrary filesystem paths.',
        resources: [{ name: 'Flask file uploads', url: 'https://flask.palletsprojects.com/en/stable/patterns/fileuploads/' }, { name: 'Python pathlib', url: 'https://docs.python.org/3/library/pathlib.html' }],
      },
      {
        id: 'rl-relations', title: 'Link papers and suggest related work',
        steps: ['Implement manual paper-to-paper links with descriptions, uniqueness and no self-links; allow creation, editing, display and deletion.', 'Aggregate normalized chunk vectors into paper summaries and show nearest papers as suggestions, separate from explicit links.', 'Test link persistence, duplicate handling and model-compatible suggestions.'],
        doneWhen: 'Manual links survive restart and suggested neighbors are visibly distinct from user-created links.',
        resources: [{ name: 'SQLAlchemy relationships', url: 'https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html' }, { name: 'NumPy arrays', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html' }],
      },
      {
        id: 'rl-release', title: 'Verify the local v0.1 release',
        steps: ['Exercise the full workflow with 50–100 papers on a CPU-only Windows machine: imports, OCR, hybrid search, reader, notes, links and recovery.', 'Verify backup/restore and offline operation after provisioning; document limitations, OCR/model installation, data location, startup, troubleshooting and safe data handling.', 'Serve the compiled frontend from Flask for a one-process local launch; bind to localhost and document a repeatable release procedure.'],
        doneWhen: 'The documented local release passes the v0.1 checklist without accounts, containers, a database server or required cloud services.',
        resources: [{ name: 'Flask deployment', url: 'https://flask.palletsprojects.com/en/stable/deploying/' }, { name: 'Vite production build', url: 'https://vite.dev/guide/build' }, { name: 'PyMuPDF OCR', url: 'https://pymupdf.readthedocs.io/en/latest/recipes-ocr.html' }],
      },
    ],
  },
];
