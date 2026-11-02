# Research Library — v0.1 MVP Specification & Implementation Plan

**Status:** Architecture finalized  
**Target:** Local-first, single-user, open-source-ready research library  
**Platform:** Windows, CPU-only laptop/desktop  
**Expected scale:** ~50–100 papers (design comfortably for up to 500)  
**Primary goals:** PDF storage, searchable extracted text, semantic retrieval, Markdown notes, and basic paper relationships

## 1. Vision

Build a lightweight research-paper management application combining the useful elements of a PDF library, semantic search engine, Markdown notes workspace, and connected-paper discovery system. Users should be able to import existing PDF collections (including scanned papers), find research ideas across documents even when terminology differs, read papers alongside notes, and manually link papers.

The MVP should run on one computer without accounts, subscriptions, containers, or external services. A cloud embedding provider may be configured optionally; the default workflow must run offline after initial installation/model download.

### Core workflow

1. Import one PDF, multiple PDFs, or a directory of PDFs.
2. Store original files under stable internal names and reject duplicate content.
3. Extract text from native PDFs; OCR scanned or poorly extracted pages.
4. Split text into searchable chunks, retaining page references.
5. Embed chunks and index text locally.
6. Search concepts using combined vector and keyword retrieval.
7. Open a result in the PDF reader at its source page.
8. Create/edit paper-specific and global Markdown notes.
9. Manually link papers and view algorithmically suggested related papers.

## 2. Locked technical stack

| Layer | Choice | Rationale |
|---|---|---|
| Backend | Python 3.12, Flask | Small, understandable local API |
| Python environment | `uv` | Fast reproducible dependencies |
| Frontend | React, TypeScript, Vite | Responsive split-pane PDF/notes UI |
| Styling | Tailwind CSS, Lucide icons | Precise minimal UI |
| Database | SQLite, SQLAlchemy, Alembic | One local database; migrations |
| Semantic retrieval | NumPy cosine similarity | Sufficient for 50–100 papers; no vector server |
| Keyword retrieval | SQLite FTS5 | Fast literal matching/acronyms |
| Default embeddings | Sentence Transformers, `all-MiniLM-L6-v2` | Lightweight 384-dimensional embeddings |
| Alternate embeddings | Pluggable cloud provider | Opt-in; no provider lock-in |
| PDF parser | PyMuPDF | Native extraction with page references |
| OCR | Tesseract via PyMuPDF | Scanned PDF support from v0.1 |
| PDF UI | PDF.js via `react-pdf` | Scroll, zoom, page navigation |
| Notes | Markdown + CodeMirror 6 | Obsidian-like editable notes |
| Processing | Single local worker thread + persisted job table | No Redis/Celery |
| Graph | Cytoscape.js (v0.2) | Interactive relationships later |

**Explicitly excluded:** Docker requirement, PostgreSQL, Redis, Celery, Neo4j, Elasticsearch, dedicated vector DB, authentication, multiuser synchronization, chatbot/RAG, and automatic concept graph in v0.1.

At the expected scale, even ~10,000 chunk embeddings of 384 float32 values occupy ~15 MB for the raw vectors. A simple NumPy matrix search is adequate; benchmark later before adding more infrastructure.

## 3. Feature scope

### Required for v0.1

- Import one or multiple PDFs, plus whole directories.
- SHA-256-based duplicate detection; stable UUID-managed filenames.
- PDF metadata extraction and manual title/author/year correction.
- Page-level text extraction and OCR fallback for scanned pages.
- Paragraph-aware chunking, embedding, and persistent indexing.
- Global hybrid semantic + full-text search across all papers.
- Results grouped by paper, with excerpts and source pages.
- Browser PDF reader with scrolling, zoom and page navigation.
- Two-column reading workspace: PDF left; paper notes/global notes right.
- Global and paper-specific Markdown notes with autosave.
- Markdown export, including bulk note export as a ZIP.
- Manual paper-to-paper links with optional descriptions.
- Related-paper suggestions based on embeddings.
- Import status, error reporting, retry, restart recovery.
- Library backup/restore (database + PDFs + settings).

### Deferred to v0.2+

- Interactive Obsidian-like paper/concept graph.
- Automated concept extraction and paper-to-concept nodes.
- Citation-network extraction/enrichment.
- PDF passage highlights and exact anchored notes.
- Advanced scientific layout parsing and reranking.
- Chat/Q&A over papers, cloud sync, collaboration, user accounts.

**Important distinction:** v0.1 OCR means scanned pages become *searchable*, not that complex equations, tables, figures, or multi-column layouts are perfectly reconstructed.

## 4. Local architecture

```text
Browser (React + PDF.js + Markdown editor)
                 |
            localhost /api/v1
                 |
             Flask API
          /            \
    Processing worker   SQLite + FTS5
      |                  |  
 PyMuPDF + OCR         paper metadata, notes,
      |                chunks, embeddings, jobs
 Chunking + Embeddings        |
      \_______________________/
                 |
       Managed local PDF files
```

Development: Vite and Flask are separate processes. Later: Flask serves the compiled frontend as a one-process local app. Bind to `127.0.0.1` by default.

### Data directory

Keep user data outside the Git checkout:

```text
%LOCALAPPDATA%\ResearchLibrary\
├── library.db
├── papers\
│   └── <paper-uuid>.pdf
├── models\
├── exports\
└── backups\
```

Imported PDFs are **copied** to managed storage so that external folder changes cannot break the library. Preserve original filenames as metadata. Allow configurable data root later.

## 5. PDF ingestion pipeline

1. **Import:** Validate PDF file type/size, compute SHA-256, check for duplicate, copy to managed path, create `papers` record and `jobs` entry.
2. **Extract:** Read pages using PyMuPDF; retain individual page numbers/text and metadata.
3. **OCR fallback:** Run Tesseract on pages with empty/insufficient/unusable native text, at approximately 200–300 DPI; initially support English. Handle mixed native/scanned PDFs page-by-page.
4. **Normalize:** Clean extraction artifacts conservatively; preserve paragraphs and headings where possible.
5. **Chunk:** Target ~200–220 words per chunk with ~30-word overlap. Prefer paragraph and sentence boundaries; keep source page ranges and section labels when identifiable.
6. **Embed:** Use configured provider; normalize embeddings before cosine retrieval.
7. **Persist:** Store `pages`, `chunks`, `embeddings`; populate FTS5. Update an in-memory NumPy index or rebuild it when needed.
8. **Complete:** Mark paper ready; publish status to UI. Failures remain inspectable and retryable.

A processing failure on one page should not erase usable extraction from others. Reprocessing should be idempotent: delete/replace affected derived records transactionally rather than create duplicates.

### Swappable embedding providers

Define a minimal interface with `embed_documents(texts)` and `embed_query(text)`, and metadata such as `model_id`, `dimensions`, normalization, and query/document formatting. Local MiniLM is the default; remote providers are explicit opt-ins. Warn before sending text off-device.

**Never mix vectors from different model IDs in a similarity calculation.** Switching providers/models triggers a re-embedding job using the already stored chunks; do not needlessly reparse PDFs. If a model download is required, report it clearly; the rest of local operation should work offline after provisioning.

## 6. Search and related-paper retrieval

### Global hybrid search

1. Embed user query using the active model.
2. Score stored chunk vectors by cosine similarity using NumPy (normalized dot product).
3. Independently retrieve keyword hits using SQLite FTS5.
4. Fuse ranked results (e.g. reciprocal rank fusion).
5. Group best chunk hits by paper and return excerpts and page numbers.
6. Selecting a result opens `/papers/:id` at the matching page.

Start with retrieving the top 30–50 semantic and lexical chunk candidates. Search API should return paper-level entries with nested matching passages. Treat fusion scores as ranking signals, **not** calibrated probabilities.

### Similar papers

Construct paper-level embedding summaries by aggregating normalized chunk vectors, then find nearest papers. Use this for **suggestions**, not permanent authoritative links. Explicit user-created links remain separate records with descriptions/provenance.

### Search quality checks

Maintain ~20 realistic queries and manually annotated relevant results from the research library (e.g. *constraint-valid perturbations*, *network intrusion detection robustness*, *feature mutability*). Compare search relevance before changing chunking or embedding models.

## 7. Database schema (SQLite)

Use SQLAlchemy models and Alembic migration files. A representative initial schema:

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE papers (
    id TEXT PRIMARY KEY,
    sha256 TEXT NOT NULL UNIQUE,
    original_filename TEXT NOT NULL,
    storage_filename TEXT NOT NULL,
    title TEXT NOT NULL,
    authors_json TEXT NOT NULL DEFAULT '[]',
    publication_year INTEGER,
    doi TEXT,
    abstract TEXT,
    page_count INTEGER,
    status TEXT NOT NULL DEFAULT 'queued'
        CHECK (status IN ('queued', 'processing', 'ready', 'failed')),
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE pages (
    id INTEGER PRIMARY KEY,
    paper_id TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    text TEXT NOT NULL DEFAULT '',
    extraction_method TEXT NOT NULL
        CHECK (extraction_method IN ('native', 'ocr', 'empty')),
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    UNIQUE(paper_id, page_number)
);

CREATE TABLE chunks (
    id INTEGER PRIMARY KEY,
    paper_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    page_start INTEGER NOT NULL,
    page_end INTEGER NOT NULL,
    section TEXT,
    content TEXT NOT NULL,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    UNIQUE(paper_id, chunk_index)
);

CREATE TABLE embeddings (
    chunk_id INTEGER NOT NULL,
    model_id TEXT NOT NULL,
    dimensions INTEGER NOT NULL,
    vector BLOB NOT NULL,
    PRIMARY KEY (chunk_id, model_id),
    FOREIGN KEY (chunk_id) REFERENCES chunks(id) ON DELETE CASCADE
);

CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    paper_id TEXT,
    title TEXT NOT NULL,
    content_md TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
);

CREATE TABLE paper_links (
    id INTEGER PRIMARY KEY,
    source_paper_id TEXT NOT NULL,
    target_paper_id TEXT NOT NULL,
    relation TEXT NOT NULL DEFAULT 'related',
    description TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (source_paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    FOREIGN KEY (target_paper_id) REFERENCES papers(id) ON DELETE CASCADE,
    CHECK (source_paper_id != target_paper_id)
);

CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    paper_id TEXT NOT NULL,
    job_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    attempts INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TEXT NOT NULL,
    started_at TEXT,
    finished_at TEXT,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
);

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL
);

CREATE VIRTUAL TABLE chunks_fts USING fts5(
    content,
    content='chunks',
    content_rowid='id'
);
```

**Implementation notes:**

- Enable foreign keys on every SQLite connection, not only during schema creation.
- Add indexes on common foreign keys and job status.
- Create insert/update/delete triggers to keep `chunks_fts` synchronized with `chunks` and rebuild FTS once during migration.
- Store vectors as float32 BLOBs, validate model and dimensions when loading.
- `notes.paper_id IS NULL` denotes a global note; non-null denotes paper-specific.
- Enforce logical link uniqueness/canonicalization in the application or a database index.
- Prefer safe, transactional deletion and an explicit backup before destructive operations.
- Directory import must validate/limit import roots; browser folder uploads can use regular file-upload API instead.

## 8. REST API

Base path: `/api/v1`.

### Paper and import endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/papers` | Multipart upload, one or more PDFs; returns paper IDs and job IDs |
| `POST` | `/papers/import` | Import a permitted local directory |
| `GET` | `/papers` | List/filter papers |
| `GET` | `/papers/{id}` | Metadata and processing status |
| `PATCH` | `/papers/{id}` | Edit metadata |
| `DELETE` | `/papers/{id}` | Delete paper and managed file |
| `GET` | `/papers/{id}/file` | Stream original PDF, supporting browser viewer |
| `GET` | `/papers/{id}/chunks` | Extracted chunks |
| `GET` | `/papers/{id}/related` | Suggested semantic neighbors |

### Search endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/search` | Semantic/keyword/hybrid search |
| `GET` | `/search/status` | Active model/index readiness |

Example:

```json
{
  "query": "realizable adversarial perturbations",
  "mode": "hybrid",
  "limit": 10
}
```

```json
{
  "query": "realizable adversarial perturbations",
  "results": [
    {
      "paper_id": "paper-uuid",
      "title": "Example research paper",
      "score": 0.82,
      "matches": [
        {
          "chunk_id": 15,
          "page_start": 4,
          "page_end": 4,
          "excerpt": "Relevant extracted passage..."
        }
      ]
    }
  ]
}
```

The scores above are *illustrative* and should be documented by the chosen ranking algorithm.

### Notes, links, jobs, settings

| Method | Path | Purpose |
|---|---|---|
| `GET`, `POST` | `/notes` | List/create global or paper notes |
| `GET`, `PATCH`, `DELETE` | `/notes/{id}` | Read/edit/delete a note |
| `GET` | `/notes/export` | Markdown ZIP export |
| `GET`, `POST` | `/paper-links` | List/create manual links |
| `DELETE` | `/paper-links/{id}` | Remove manual link |
| `GET` | `/jobs/{id}` | Track import state and errors |
| `POST` | `/jobs/{id}/retry` | Retry failed processing |
| `GET`, `PATCH` | `/settings` | App/model/OCR settings |
| `GET` | `/health` | Local backend health |

Long-running ingestion should return immediately with a job ID; the UI polls the job endpoint. On startup, recover interrupted jobs to a retriable state.

## 9. Frontend routes and UI

| Route | Screen |
|---|---|
| `/` | Paper library, imports, global search |
| `/papers/:id` | PDF reader left; Markdown notes/sidebar right |
| `/notes` | Global notes workspace |
| `/settings` | Data location, embedding provider, OCR configuration |

### Visual language

- Sharp, rectangular components; little or no shadow.
- Cream canvas `#F5F2E9`, white cards `#FFFFFF`, ink `#191919`.
- Thin border `#D9D5CC`.
- Restrained red `#C95345`, green `#648573`, yellow `#D7AE57` highlights.
- Border radius roughly 2–6 px; generous whitespace.
- Neutral sans-serif typography (e.g. Inter).
- Favor function and clarity over decorative dashboards.

### Reading workspace

- Left (~60–65%): PDF.js viewer with scroll, zoom, page navigation, file/search controls.
- Right (~35–40%): distinct paper-note and global-note sections, preferably resizable/collapsible.
- Related papers visible in a compact sidebar section.
- Clicking a search result navigates to the correct paper/page.
- Markdown autosave should have visible saving/saved/error feedback and protect against lost edits.
- Responsive behavior: collapse side panels into tabs on narrow screens.

## 10. Repository structure

```text
research-library/
├── backend/
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── migrations/
│   ├── src/
│   │   └── research_library/
│   │       ├── __init__.py
│   │       ├── app.py
│   │       ├── config.py
│   │       ├── database.py
│   │       ├── api/
│   │       │   ├── papers.py
│   │       │   ├── notes.py
│   │       │   ├── search.py
│   │       │   └── graph.py
│   │       ├── models/
│   │       ├── services/
│   │       │   ├── storage.py
│   │       │   ├── parser.py
│   │       │   ├── ocr.py
│   │       │   ├── chunker.py
│   │       │   ├── embeddings.py
│   │       │   ├── retrieval.py
│   │       │   └── importer.py
│   │       └── worker.py
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
├── docs/
├── scripts/
├── .gitignore
└── README.md
```

## 11. Windows setup (PowerShell)

### Prerequisites

Install Python 3.12, Node.js LTS, `uv`, Git and Tesseract OCR with English language data. Relevant documentation:

- uv: https://docs.astral.sh/uv/getting-started/installation/
- Node.js: https://nodejs.org/en/download
- Tesseract Windows builds: https://github.com/UB-Mannheim/tesseract/wiki

### A. Initialize

```powershell
mkdir research-library
cd research-library
git init

uv init --package --python 3.12 backend
npm create vite@latest frontend -- --template react-ts

mkdir docs
mkdir scripts
```

### B. Backend dependencies

```powershell
cd backend
uv add flask flask-cors flask-sqlalchemy `
  sqlalchemy alembic pymupdf `
  sentence-transformers numpy python-dotenv
uv add --dev pytest pytest-cov ruff httpx
cd ..
```

### C. Tesseract check

```powershell
& "C:\Program Files\Tesseract-OCR\tesseract.exe" --version
$env:TESSDATA_PREFIX = "C:\Program Files\Tesseract-OCR\tessdata"
cd backend
uv run python -c "import pymupdf; print(pymupdf.VersionBind)"
cd ..
```

Set `TESSDATA_PREFIX` persistently through the app configuration or Windows environment variables for later sessions. The application must check OCR availability at startup and show actionable errors when language data is missing.

### D. Frontend dependencies

```powershell
cd frontend
npm install
npm install react-router-dom react-pdf `
  lucide-react @uiw/react-codemirror `
  @codemirror/lang-markdown cytoscape
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Configure Vite's `/api` proxy to `http://127.0.0.1:5000` and configure Tailwind per its Vite integration.

### E. Development launch (after implementing the application factory)

**Terminal 1:**

```powershell
cd research-library\backend
uv run flask --app research_library.app:create_app run --host 127.0.0.1 --port 5000
```

**Terminal 2:**

```powershell
cd research-library\frontend
npm run dev
```

Then open http://localhost:5173. The scaffolding commands only create project skeletons; the application factory, migrations, routes and screens must be implemented.

## 12. Build roadmap

### Milestone 1 — Functional ingestion and search (first implementation target)

**Goal:** Upload a native or scanned PDF, process it locally, search its content, and preserve everything after restart.

1. [ ] Initialize repository, backend app factory, Vite frontend, config and local data root.
2. [ ] Implement SQLite connection, migrations, core paper/page/chunk/embedding/job models.
3. [ ] Implement `POST /papers`: validation, managed storage, hashing, duplicate detection.
4. [ ] Add a persisted job queue and single worker with restart recovery.
5. [ ] Implement page-level PyMuPDF extraction.
6. [ ] Implement conditional Tesseract OCR and surface OCR errors.
7. [ ] Implement paragraph-aware chunking and page references.
8. [ ] Implement the embedding provider interface and local MiniLM provider.
9. [ ] Persist float32 vectors and load them into a NumPy search index.
10. [ ] Add FTS5 synchronization and basic hybrid search.
11. [ ] Add minimal library upload/status/search UI.
12. [ ] Test native, scanned, duplicate and interrupted imports.

**Acceptance tests:**

| Test | Expected result |
|---|---|
| Upload a native PDF | File stored, page text extracted |
| Upload a scanned PDF | OCR produces searchable text |
| Upload duplicate bytes | Existing paper recognized |
| Import ten PDFs | Every job finishes or reports an actionable error |
| Search a concept | Relevant chunks and source pages returned |
| Restart application | Data and embeddings persist |
| Interrupt processing | Job can be retried without corruption |
| Disconnect internet after provisioning | Local import/OCR/search continue working |

### Milestone 2 — Reading and notes

1. [ ] PDF.js reading route and page navigation.
2. [ ] Search-result-to-PDF page navigation.
3. [ ] Split reading workspace with resizable/collapsible notes panels.
4. [ ] Paper-specific and global Markdown note CRUD.
5. [ ] Debounced autosave with visible status.
6. [ ] Markdown export and backup/restore.

### Milestone 3 — Organization and relations

1. [ ] Metadata correction and improved library browsing.
2. [ ] Directory import UX and batch import status.
3. [ ] Similar-paper recommendations from paper embeddings.
4. [ ] Manual paper link creation, editing, display and deletion.
5. [ ] Performance, error-handling and security cleanup.
6. [ ] Documentation and first local release.

### v0.2 — Knowledge discovery

1. [ ] Interactive paper graph (Cytoscape.js).
2. [ ] Lightweight concept extraction from abstracts/headings.
3. [ ] Paper-to-concept edges with manual corrections.
4. [ ] Citation parsing/enrichment.
5. [ ] PDF highlighted passages and anchored notes.
6. [ ] Layout-aware scientific PDF extraction and quality evaluation.

## 13. Engineering and safety principles

- **Local-first by default:** Bind the server to localhost; no remote calls unless explicitly enabled.
- **Preserve originals:** Never replace uploaded PDFs with extracted text or embeddings.
- **Keep modules replaceable:** Parser, OCR, embeddings and retrieval should have narrow interfaces.
- **Avoid accidental data loss:** Atomic writes, SQLite transactions, backups and export paths.
- **Handle untrusted PDFs defensively:** Validate uploads, impose limits, avoid trusting filenames, keep paths within controlled directories, and surface parser failures.
- **Avoid arbitrary path access:** Directory imports must use user-selected or explicitly allowed folders.
- **Use versioned schema and model identifiers:** Prevent silent incompatibilities after upgrades.
- **Reproducible tests:** Include a few small text/scanned PDF fixtures and expected queries.
- **Measure before optimizing:** Evaluate search relevance on real papers; don't add a dedicated vector server prematurely.
- **No chatbot in MVP:** Search + source references + notes should work before more AI features.

## 14. MVP release checklist

- [ ] Manage 50–100 papers on a CPU-only Windows desktop without a database server.
- [ ] Import individual files and directories; detect duplicates.
- [ ] Process native and scanned PDFs; display meaningful failures.
- [ ] Search across PDFs semantically and by keywords.
- [ ] Open matching excerpts at their paper/page.
- [ ] Read PDFs beside local and global Markdown notes.
- [ ] Persist notes and export them as Markdown.
- [ ] Create manual paper links and view recommended similar papers.
- [ ] Backup and restore the complete library.
- [ ] Operate offline once the app, OCR data and embedding model are installed.

**Recommended first coding task:** Implement upload → store → parse/OCR → chunk → embed → search on a sample collection of 10 research PDFs. Build the complete polished reader and graph only after this pipeline works reliably.
