// Stable IDs keep completion checks attached to the same tasks across updates.
export const sprintStages: {
  id: string;
  title: string;
  outcome: string;
  tasks: { id: string; title: string; steps: string[]; doneWhen: string; resources: { name: string; url: string }[] }[];
}[] = [
  {
    id: 'setup',
    title: '1. Reproducible EvidenceLab setup',
    outcome: 'A small, repeatable local Python project ready for a PDF retrieval experiment.',
    tasks: [
      {
        id: 'setup-project',
        title: 'Create and lock the project with uv',
        steps: [
          'Create a separate EvidenceLab project with uv; select a supported Python version and commit pyproject.toml, the Python version file, and uv.lock.',
          'Add pytest as a development dependency; use uv sync and uv run rather than relying on a global environment.',
          'Ignore virtual environments, secrets, generated indexes, and private documents; keep a small redistributable PDF fixture separately.',
        ],
        doneWhen: 'A fresh checkout can sync from the lockfile and run a trivial pytest test without global package installs; private inputs and secrets are not tracked.',
        resources: [
          { name: 'uv projects', url: 'https://docs.astral.sh/uv/guides/projects/' },
          { name: 'uv dependencies', url: 'https://docs.astral.sh/uv/concepts/projects/dependencies/' },
          { name: 'Git ignore', url: 'https://git-scm.com/docs/gitignore' },
        ],
      },
    ],
  },
  {
    id: 'pdf-chunks',
    title: '2. Extract and chunk PDFs',
    outcome: 'Reproducible text chunks retain enough provenance to locate their source pages.',
    tasks: [
      {
        id: 'pdf-extract',
        title: 'Extract page-level text safely',
        steps: [
          'After setup, add pypdf and extract text page by page from an authorized, text-based PDF; record document ID and human-readable page number.',
          'Handle empty pages and extraction errors explicitly; report image-only pages as needing OCR rather than treating missing text as successful extraction.',
          'Use a small fixture with known page content and avoid logging or committing private document text.',
        ],
        doneWhen: 'A test identifies known text on its correct page and covers an empty or unreadable page without silently inventing content.',
        resources: [
          { name: 'pypdf text extraction', url: 'https://pypdf.readthedocs.io/en/stable/user/extract-text.html' },
          { name: 'pytest', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
        ],
      },
      {
        id: 'pdf-chunk',
        title: 'Create page-aware chunks',
        steps: [
          'Split each extracted page into bounded, overlapping chunks; retain document ID, page number, chunk ID, and text.',
          'Choose and record chunk size and overlap; make chunk IDs deterministic for unchanged input and parameters.',
          'Test boundaries, short and empty pages, overlap, and traceability back to the fixture page.',
        ],
        doneWhen: 'Repeated ingestion produces the same nonempty chunks and IDs, each with the correct document and page reference.',
        resources: [
          { name: 'Python text processing', url: 'https://docs.python.org/3/library/text.html' },
          { name: 'pytest assertions', url: 'https://docs.pytest.org/en/stable/how-to/assert.html' },
        ],
      },
    ],
  },
  {
    id: 'local-search',
    title: '3. Local semantic search',
    outcome: 'A CPU-friendly embedding baseline returns ranked, cited chunks.',
    tasks: [
      {
        id: 'local-embed-search',
        title: 'Embed chunks and rank by cosine similarity',
        steps: [
          'After chunking, add sentence-transformers and select a small pretrained model such as all-MiniLM-L6-v2; pin and record its revision and embedding dimension.',
          'Encode chunks in batches on CPU, normalize vectors, and encode queries with the same model; rank by cosine similarity and return top-k text, score, document, and page.',
          'Cache embeddings keyed by source, chunking parameters, and model revision; rebuild when these change. Download model files only from a trusted source and do not send private text to a hosted API.',
        ],
        doneWhen: 'A local query returns ranked chunks with page references, and a test verifies cosine ranking on fixed vectors; the workflow runs without a paid GPU.',
        resources: [
          { name: 'Sentence Transformers semantic search', url: 'https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html' },
          { name: 'all-MiniLM-L6-v2 model card', url: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2' },
        ],
      },
    ],
  },
  {
    id: 'evaluation',
    title: '4. Evaluate against keyword retrieval',
    outcome: 'A labeled, repeatable comparison exposes where semantic retrieval helps or fails.',
    tasks: [
      {
        id: 'evaluation-labels',
        title: 'Build a small labeled query set',
        steps: [
          'Using the same authorized corpus and chunk IDs, write diverse realistic questions and label relevant chunks independently of either ranker; include paraphrases and exact-term queries.',
          'Record queries with no relevant evidence separately, and keep a held-out subset for final comparison rather than tuning on every example.',
          'Document corpus, labeling criteria, and known limitations; do not commit sensitive queries or documents.',
        ],
        doneWhen: 'A versioned, non-sensitive evaluation fixture maps multiple varied queries to reviewed relevant chunk IDs and identifies no-answer cases.',
        resources: [
          { name: 'Information retrieval evaluation', url: 'https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-in-information-retrieval-1.html' },
        ],
      },
      {
        id: 'evaluation-compare',
        title: 'Compare keyword and semantic rankings',
        steps: [
          'After labels and local search exist, implement a TF-IDF keyword baseline over the identical chunks and evaluate both rankers on identical queries and k.',
          'Report recall@k and reciprocal rank for answerable queries, state how no-answer queries are handled, and inspect examples where each ranker fails.',
          'Record model, chunk settings, data split, metrics, and results; use the held-out set for the final report.',
        ],
        doneWhen: 'One repeatable evaluation produces both baselines and per-query evidence, with metric definitions and a short error analysis rather than an unsupported quality claim.',
        resources: [
          { name: 'scikit-learn TF-IDF', url: 'https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting' },
          { name: 'Ranked retrieval evaluation', url: 'https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html' },
        ],
      },
    ],
  },
  {
    id: 'api',
    title: '5. Tested Flask API',
    outcome: 'A local HTTP interface exposes the evaluated retrieval pipeline with clear failure behavior.',
    tasks: [
      {
        id: 'api-search',
        title: 'Expose and test search',
        steps: [
          'After local retrieval and evaluation, add Flask and implement a JSON search endpoint returning ranked snippets, scores, document IDs, and page numbers.',
          'Validate query and bounded top-k inputs; return clear client errors for invalid requests and avoid exposing private paths or exception details.',
          'Use Flask’s test client to cover a successful query, invalid input, no results, and a retrieval failure; inject a small deterministic test index.',
        ],
        doneWhen: 'The endpoint returns the documented response shape and status codes, and automated tests exercise success and failure paths without downloading a model.',
        resources: [
          { name: 'Flask quickstart', url: 'https://flask.palletsprojects.com/en/stable/quickstart/' },
          { name: 'Testing Flask applications', url: 'https://flask.palletsprojects.com/en/stable/testing/' },
        ],
      },
    ],
  },
  {
    id: 'persistence-deploy',
    title: '6. Persist and deploy',
    outcome: 'PostgreSQL and pgvector preserve searchable evidence across restarts in a deployable service.',
    tasks: [
      {
        id: 'persistence-pgvector',
        title: 'Store chunks and vectors in PostgreSQL',
        steps: [
          'After the API works locally, provision PostgreSQL with pgvector and create a migration for documents, page-aware chunks, model metadata, and vectors with the selected model’s dimension.',
          'Use parameterized queries and an idempotent ingestion/upsert strategy; query by cosine distance with deterministic tie handling and retain source references.',
          'Test ingestion, search, restart persistence, and re-ingestion on a disposable database; rebuild embeddings when the model or chunking configuration changes.',
        ],
        doneWhen: 'A fresh migrated database can ingest the fixture twice without duplicate chunks and return the expected cited result after reconnection.',
        resources: [
          { name: 'pgvector installation and querying', url: 'https://github.com/pgvector/pgvector' },
          { name: 'PostgreSQL parameterized execution', url: 'https://www.postgresql.org/docs/current/libpq-exec.html#LIBPQ-EXEC-PARAMS' },
        ],
      },
      {
        id: 'security-review',
        title: 'Review deployment and data safety',
        steps: [
          'Review the deployed API’s intended users and access controls; require authentication and authorization where documents are not public, including for every retrieval request.',
          'Limit request sizes and query rates, enforce TLS, restrict database privileges and network access, and avoid logging document contents, credentials, or sensitive queries.',
          'Exercise unauthorized access and malformed input, review dependency advisories, and document retention, deletion, backup access, and residual risks.',
        ],
        doneWhen: 'A documented review and tests show protected documents cannot be retrieved by unauthorized users, invalid requests are rejected, and secrets and sensitive text are absent from application logs.',
        resources: [
          { name: 'OWASP API Security Top 10', url: 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/' },
          { name: 'Flask security considerations', url: 'https://flask.palletsprojects.com/en/stable/web-security/' },
        ],
      },
      {
        id: 'deploy-service',
        title: 'Deploy with a production server',
        steps: [
          'After database-backed search passes locally, configure the database URL and other secrets through environment variables, and apply migrations before starting the service.',
          'Deploy Flask behind a production WSGI server using the hosting platform’s instructions; do not expose PostgreSQL publicly or use Flask’s development server.',
          'Document startup, migration, backup and restore, and a rollback path; check a non-sensitive search request after deployment.',
        ],
        doneWhen: 'The deployed API serves a fixture query after a restart, uses persistent database storage, and has documented recovery steps without committed credentials.',
        resources: [
          { name: 'Deploying Flask', url: 'https://flask.palletsprojects.com/en/stable/deploying/' },
          { name: 'PostgreSQL backup and restore', url: 'https://www.postgresql.org/docs/current/backup.html' },
        ],
      },
    ],
  },
  {
    id: 'grounding-security',
    title: '7. Grounded answers',
    outcome: 'If generation is added, answers are evidence-linked and evaluated against retrieved passages.',
    tasks: [
      {
        id: 'grounded-generation',
        title: 'Optionally generate cited answers',
        steps: [
          'Only after retrieval evaluation, add an optional local or approved-provider generator that receives the top retrieved chunks and returns an answer with document and page citations.',
          'Instruct it to abstain when evidence is insufficient; treat retrieved text as untrusted data, not instructions, and check citations against returned chunks.',
          'Evaluate supported answers, missing evidence, and prompt-injection examples; disclose that citations do not by themselves prove correctness. Do not send private documents to a provider without authorization.',
        ],
        doneWhen: 'Representative answers cite retrieved pages, unsupported questions trigger abstention, and the documented adversarial cases are tested and their outcomes recorded.',
        resources: [
          { name: 'OWASP prompt injection prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html' },
          { name: 'NIST generative AI risk management profile', url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence' },
        ],
      },
    ],
  },
];
