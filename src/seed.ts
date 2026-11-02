// Versioned, read-only curriculum. Learner progress is stored separately by stable IDs.
export type Category = 'learn' | 'build' | 'dsa' | 'review' | 'career';
export type Resource = { name: string; url: string };
export type SeedTask = { id: string; title: string; category: Category };
export type DailySuggestion = { title: string; category: Category; estimatedMinutes: number };
export type WeekSeed = {
  number: number; title: string; learn: string[]; build: string[]; practice: string[];
  gate: string; proof: string; career?: string; tasks: SeedTask[];
  daily: { day: number; tasks: DailySuggestion[] }[]; resources: Resource[];
};
export type ProjectSeed = {
  id: string; name: string; schedule: string; roleFit: string; problem: string; users: string;
  stack: string[]; architecture: string; features: { id: string; title: string }[];
  security: string; evaluation: string; acceptance: string; impact: string; outputs: string[]; resume: string;
};
export type SkillSeed = { name: string; priority: string; depth: string; projects: string[]; resources: Resource[] };

export const resources: Resource[] = [
  { name: 'Python tutorial', url: 'https://docs.python.org/3/tutorial/' },
  { name: 'uv projects', url: 'https://docs.astral.sh/uv/guides/projects/' },
  { name: 'Flask quickstart', url: 'https://flask.palletsprojects.com/en/stable/quickstart/' },
  { name: 'Flask testing', url: 'https://flask.palletsprojects.com/en/stable/testing/' },
  { name: 'scikit-learn getting started', url: 'https://scikit-learn.org/stable/getting_started.html' },
  { name: 'Git book', url: 'https://git-scm.com/book/en/v2' },
  { name: 'HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
  { name: 'SQLBolt', url: 'https://sqlbolt.com/' },
  { name: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
  { name: 'FastAPI tutorial', url: 'https://fastapi.tiangolo.com/tutorial/' },
  { name: 'SQLAlchemy tutorial', url: 'https://docs.sqlalchemy.org/en/20/tutorial/' },
  { name: 'JavaScript guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
  { name: 'TypeScript handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
  { name: 'React learn', url: 'https://react.dev/learn' },
  { name: 'pytest', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
  { name: 'Docker', url: 'https://docs.docker.com/get-started/' },
  { name: 'GitHub Actions', url: 'https://docs.github.com/en/actions' },
  { name: 'scikit-learn', url: 'https://scikit-learn.org/stable/user_guide.html' },
  { name: 'PyTorch tutorials', url: 'https://docs.pytorch.org/tutorials/' },
  { name: 'Hugging Face learn', url: 'https://huggingface.co/learn' },
  { name: 'pgvector', url: 'https://github.com/pgvector/pgvector' },
  { name: 'MLflow', url: 'https://mlflow.org/docs/latest/index.html' },
  { name: 'DSA roadmap', url: 'https://neetcode.io/roadmap' },
];

// Targets are recommendations, never a record of completed work.
export const dsaTargets = [
  { weeks: '1–2', topic: 'Diagnostic and targeted review of weak patterns', newProblems: null },
  { weeks: '3–4', topic: 'Targeted practice and reattempts, with complexity explanations', newProblems: null },
  { weeks: '5–6', topic: 'Trees, BFS/DFS, heaps and graph representation', newProblems: 18 },
  { weeks: '7–8', topic: 'Graphs, greedy and introductory dynamic programming', newProblems: 18 },
  { weeks: '9–10', topic: 'Mixed problems, SQL and debugging', newProblems: 18 },
  { weeks: '11–12', topic: 'Timed problems and review; two mock interviews', newProblems: 12 },
];
export const dailySchedule = [
  { time: '09:00–10:30', focus: 'Study one concept and practice', minutes: 90 },
  { time: '10:45–13:45', focus: 'Implement project features', minutes: 180 },
  { time: '14:45–16:15', focus: 'Debug, test, refactor and integrate', minutes: 90 },
  { time: '16:30–17:30', focus: 'DSA, CS fundamentals or interviews', minutes: 60 },
];
export const jobSearchLinks: Resource[] = [
  { name: 'Bdjobs (search destination)', url: 'https://bdjobs.com/' },
  { name: 'LinkedIn Jobs (search destination)', url: 'https://www.linkedin.com/jobs/' },
];
const r = (...names: string[]) => names.map(name => resources.find(resource => resource.name === name)!).filter(Boolean);

type WeekInput = Omit<WeekSeed, 'tasks' | 'daily'> & { days: ([string, string] | [string, string, string, string])[] };
function week(input: WeekInput): WeekSeed {
  const { days, ...rest } = input;
  const prefix = rest.number <= 4 ? `w${rest.number}-journal` : `w${rest.number}`;
  const tasks: SeedTask[] = (['learn', 'build', 'practice'] as const).flatMap(section => rest[section].map((title, i) => ({ id: `${prefix}-${section}-${i + 1}`, title, category: section === 'practice' ? 'dsa' as const : section })));
  tasks.push({ id: `w${rest.number}-review-1`, title: 'Complete a weekly retrospective and collect milestone evidence', category: 'review' });
  if (rest.career) tasks.push({ id: `w${rest.number}-career-1`, title: rest.career, category: 'career' });
  return { ...rest, tasks, daily: days.map((day, i) => ({ day: i + 1, tasks: day.length === 2 ? [
    { title: day[0], category: 'build', estimatedMinutes: rest.number === 1 && i < 2 ? 60 : 180 },
    { title: day[1], category: i === 5 ? 'review' : 'dsa', estimatedMinutes: 45 },
  ] : [
    { title: day[0], category: 'learn', estimatedMinutes: 90 },
    { title: day[1], category: 'build', estimatedMinutes: 180 },
    { title: day[2], category: 'build', estimatedMinutes: 90 },
    { title: day[3], category: i === 5 ? 'review' : 'dsa', estimatedMinutes: 60 },
  ] })) };
}

// Original task labels remain available for completed progress from the earlier curriculum.
export const previousRoadmapTasks: Record<number, Record<string, string[]>> = {
  1: { learn: ['Python data structures, functions, OOP and type hints', 'Modules, exceptions, virtual environments and file I/O', 'Git branches and commits, terminal and HTTP fundamentals'], build: ['Build a JSON-backed CLI request tracker with add, list, update and delete', 'Add search, sorting and validation', 'Write 8–10 meaningful tests and a runnable README'], practice: ['Arrays, strings, hash maps and Big-O'] },
  2: { learn: ['SQL queries, joins, normalized tables, constraints, transactions and basic indexes', 'PostgreSQL, HTTP status codes, FastAPI, Pydantic, SQLAlchemy and migrations'], build: ['Upgrade the tracker to a PostgreSQL REST CRUD API', 'Implement filters, pagination and error responses', 'Write 10+ API/database tests and clear API documentation'], practice: ['Two pointers, sliding windows and stacks'] },
  3: { learn: ['HTML/CSS essentials, JavaScript functions, promises and async/await', 'TypeScript types; React components, hooks, state, forms, routing and fetch'], build: ['Build OpsFlow login shell and ticket list, create, edit and detail views', 'Integrate the API with loading and error states'], practice: ['Binary search, sorting and recursion'] },
  4: { learn: ['Authentication, session/JWT tradeoffs, authorization, RBAC and web security basics', 'pytest integration tests, Docker, GitHub Actions and hosting'], build: ['Implement authentication, multi-organization permissions, audit log and analytics', 'Add tests, CI and deploy a usable demo', 'Invite 3–5 pilot users'], practice: ['Linked lists and tree traversals; articulate code choices'] },
};

export const weeks: WeekSeed[] = [
  week({ number: 1, title: 'Python project systems + first deployment', learn: ['Use uv to manage Python versions, dependencies, lockfiles and reproducible environments for an ML project', 'Learn HTTP interfaces and build and test a small Flask API; compare its request handling with FastAPI', 'Use Git, environment configuration and deployment logs to ship and redeploy an API'], build: ['Set up a reproducible ML project and a small Flask API exercise', 'Create and deploy the OpsFlow FastAPI health endpoint, then verify a committed change redeploys'], practice: ['Diagnose DSA gaps with a few familiar problems and explain time and space complexity'], gate: 'Recreate the ML environment from its lockfile, test a Flask endpoint, open the hosted OpsFlow API and verify a redeployed change.', proof: 'ML project lockfile and run instructions, Flask test, OpsFlow repository and hosted API URL.', career: 'Set up GitHub, LinkedIn, resume and portfolio; begin shortlisting employers.', resources: r('uv projects','scikit-learn getting started','Flask quickstart','Flask testing','Git book','HTTP','FastAPI tutorial','pytest','DSA roadmap'), days: [
    ['Install uv; initialize an ML project, add scikit-learn, commit pyproject.toml and uv.lock, and run a small dataset-loading script with uv run', 'Optional: identify a DSA topic to review'],
    ['Build a separate Flask health endpoint; run it locally, inspect its HTTP response, and write a test using the Flask test client', 'Optional: solve a familiar problem and explain its complexity'],
    ['Create the OpsFlow Git repository and a minimal FastAPI health endpoint; compare its request and response interface with the Flask exercise', 'Optional: review a diagnostic DSA gap'],
    ['Choose a Python-capable host and deploy the API; inspect build and application logs', 'Optional: practice a weak DSA pattern'],
    ['Commit a change, redeploy and verify the live endpoint; practice diagnosing configuration errors', 'Optional: revisit a missed problem'],
    ['Document the local setup, hosted URL and deployment steps; review what remains unclear', 'Retrospective and employer shortlist'],
  ] }),
  week({ number: 2, title: 'OpsFlow API + PostgreSQL', learn: ['Learn SQL queries, joins, constraints, transactions and indexes as needed', 'Use PostgreSQL, FastAPI, validation, SQLAlchemy and migrations'], build: ['Extend the deployed OpsFlow API with PostgreSQL-backed CRUD, filters, pagination and errors', 'Add meaningful API/database tests, documentation and a hosted database'], practice: ['Practice DSA gaps identified in the diagnostic'], gate: 'A hosted API creates and retrieves persistent PostgreSQL records, migrations recreate the schema and critical tests pass.', proof: 'Hosted API URL, migration instructions and test report.', career: 'Continue GitHub, LinkedIn, resume and portfolio setup and employer shortlist.', resources: r('SQLBolt','PostgreSQL tutorial','FastAPI tutorial','SQLAlchemy tutorial','pytest','DSA roadmap'), days: [
    ['Design request tables and practice the SQL queries and constraints they need', 'Optional: practice a diagnostic DSA gap'],
    ['Connect PostgreSQL and SQLAlchemy; create and apply the initial migration', 'Optional: revisit a missed problem'],
    ['Add validated create and read endpoints', 'Optional: practice explaining complexity'],
    ['Add update and delete endpoints with clear errors', 'Optional: practice a weak pattern'],
    ['Add filtering, pagination and tests for critical API and database behavior', 'Optional: reattempt a missed problem'],
    ['Deploy with a hosted database, configure secrets, verify persistence and document setup', 'Retrospective and employer shortlist'],
  ] }),
  week({ number: 3, title: 'OpsFlow frontend + deployment', learn: ['Learn the HTML, CSS, JavaScript, TypeScript and React needed for the frontend', 'Connect frontend and API using fetch, environment configuration and CORS'], build: ['Build request list, detail, create and edit views with loading, validation and error states', 'Deploy the frontend and verify the end-to-end flow on desktop and mobile'], practice: ['Practice identified DSA gaps and explain solutions'], gate: 'Create and edit a request through the hosted frontend, refresh and verify persistence; the TypeScript build passes.', proof: 'Hosted frontend and API URLs, plus a short demo.', career: 'Finish initial GitHub, LinkedIn, resume and portfolio setup and employer shortlist.', resources: r('JavaScript guide','TypeScript handbook','React learn','HTTP','DSA roadmap'), days: [
    ['Set up the React and TypeScript frontend and learn the essentials needed for its layout', 'Optional: practice a weak DSA pattern'],
    ['Build request list and detail views with loading and error states', 'Optional: explain a previous solution'],
    ['Build the request creation form and connect it to the API', 'Optional: reattempt a missed problem'],
    ['Build editing and validation; verify updates persist', 'Optional: practice a diagnostic gap'],
    ['Deploy the frontend, configure the API URL and CORS, and check the flow on desktop and mobile', 'Optional: review complexity'],
    ['Resolve build issues, document the hosted flow and record a demo', 'Retrospective and employer shortlist'],
  ] }),
  week({ number: 4, title: 'OpsFlow security + launch', learn: ['Learn authentication, authorization, RBAC and web security in the context of OpsFlow', 'Learn Docker and CI when needed for the release'], build: ['Add authentication, organization permissions, audit log and analytics', 'Add critical tests and CI, document the demo and invite 3–5 pilot users'], practice: ['Practice identified DSA gaps and explain project choices'], gate: 'Hosted demo, passing CI, cross-organization authorization test and 3–5 pilot users invited.', proof: 'Demo and repository URLs, security test and feedback notes.', career: 'Begin 5–8 relevant applications per week and tailor the SWE resume.', resources: r('FastAPI tutorial','pytest','Docker','GitHub Actions','DSA roadmap'), days: [
    ['Implement login and logout; test authentication and configuration', 'Optional: practice a weak DSA pattern'],
    ['Add organization membership and authorization; test cross-organization access', 'Optional: explain a previous solution'],
    ['Add the audit log and analytics view; verify reporting', 'Optional: reattempt a missed problem'],
    ['Use Docker and integration tests to make the app reproducible', 'Optional: review complexity'],
    ['Set up CI, verify the hosted demo and document deployment and security tradeoffs', 'Optional: practice explaining project decisions'],
    ['Invite 3–5 pilot users and document feedback and release evidence', 'Retrospective; tailor SWE resume and apply to suitable roles'],
  ] }),
  week({ number: 5, title: 'ML + embeddings', learn: ['Train/validation/test splits, preprocessing, leakage and classification precision/recall/F1', 'Vector math, embeddings, cosine similarity and transformer embedding models'], build: ['Build EvidenceLab PDF ingestion with source and page metadata', 'Implement reproducible chunking, embeddings and top-k semantic retrieval'], practice: ['Trees and BFS/DFS'], gate: 'Top-k retrieval returns relevant chunks and correct source references on a test document set.', proof: 'Documented retrieval examples.', career: 'Continue 5–8 suitable junior SWE/backend applications weekly.', resources: r('scikit-learn','Hugging Face learn','pgvector','DSA roadmap'), days: [
    ['Study splits, preprocessing and leakage', 'Set up EvidenceLab with uv and a locked project environment', 'Extract PDF text and page metadata', 'Practice trees'],
    ['Study precision, recall and F1', 'Create reproducible chunking with IDs', 'Test chunk boundaries and source references', 'Practice BFS'],
    ['Learn vectors and cosine similarity', 'Set up embedding model and index', 'Test embedding and similarity calculations', 'Practice DFS'],
    ['Study transformer embedding models', 'Implement top-k semantic retrieval', 'Inspect relevance and metadata', 'Practice trees'],
    ['Review retrieval and evaluation', 'Build test document set and query examples', 'Fix source/page attribution', 'Practice BFS/DFS'],
    ['Review leakage and embedding tradeoffs', 'Document retrieval examples', 'Check top-k relevance and evidence', 'Retrospective and targeted applications'],
  ] }),
  week({ number: 6, title: 'RAG application', learn: ['Tokenization, LLM APIs, context windows, structured outputs and prompts', 'RAG, hallucination risks, rate limits and costs'], build: ['Implement grounded Q&A, source links, hybrid keyword/vector search and search/chat frontend', 'Add abstention for missing evidence'], practice: ['Heaps, priority queues and graphs'], gate: 'Manually review 30 Q&A cases, verify citations resolve to source pages and check reasonable abstention for missing evidence.', proof: '30-case mini-evaluation table.', career: 'Continue 5–8 suitable junior SWE/backend applications weekly.', resources: r('Hugging Face learn','pgvector','FastAPI tutorial','React learn','DSA roadmap'), days: [
    ['Study tokenization and context windows', 'Implement keyword search', 'Test keyword retrieval and metadata', 'Practice heaps'],
    ['Study hybrid retrieval and ranking', 'Combine keyword and vector search', 'Compare sample retrieval results', 'Practice priority queues'],
    ['Learn LLM APIs and structured outputs', 'Build grounded answer generation with citations', 'Handle absent API keys and model configuration', 'Practice graphs'],
    ['Study hallucination and abstention', 'Implement missing-evidence policy', 'Test unsupported questions and source links', 'Practice graph representation'],
    ['Study rate limits and costs', 'Build search and chat frontend', 'Integrate source passages and page context', 'Practice heaps and graphs'],
    ['Review RAG failure modes', 'Review 30 Q&A cases manually', 'Publish mini-evaluation and verify source pages', 'Retrospective and targeted applications'],
  ] }),
  week({ number: 7, title: 'RAG evaluation and safety', learn: ['Recall@k, MRR, citation accuracy, answer-support scoring and reranking', 'Prompt injection defenses, access control and scoped tool calling'], build: ['Create 100 labeled question/evidence pairs', 'Compare keyword, vector and hybrid retrieval', 'Implement limited source-search tool and authorization tests'], practice: ['Graphs and topological sort'], gate: 'Reproducible evaluation script, metrics table and user-document isolation tests.', proof: 'Dataset schema and results report.', career: 'Expand to relevant AI/ML and applied LLM roles; target 8–12 suitable roles per week.', resources: r('scikit-learn','Hugging Face learn','pgvector','DSA roadmap'), days: [
    ['Study Recall@k and MRR', 'Design labeled question/evidence schema', 'Label initial questions and citations', 'Practice graphs'],
    ['Study citation accuracy and answer support', 'Expand labeled dataset', 'Implement evaluation metrics', 'Practice topological sort'],
    ['Study reranking and retrieval comparisons', 'Complete 100 labeled question/evidence pairs', 'Run keyword, vector and hybrid baselines', 'Practice graphs'],
    ['Study prompt injection defenses', 'Implement limited source-search tool', 'Test untrusted document instructions', 'Practice topological sort'],
    ['Study access control', 'Implement document isolation', 'Test cross-user access and scoped tools', 'Practice graphs'],
    ['Review reproducibility and limitations', 'Publish metrics table and dataset schema', 'Re-run evaluation and document isolation evidence', 'Retrospective and apply to suitable SWE/AI roles'],
  ] }),
  week({ number: 8, title: 'EvidenceLab launch', learn: ['Background jobs, timeouts/retries, caching and logging', 'LLM latency and cost measurement and deployment'], build: ['Deploy EvidenceLab and implement evaluation dashboard', 'Write case study and gather feedback from at least 3 testers'], practice: ['Introduction to dynamic programming'], gate: 'Working demo tested on 50 documents, 100-question evaluation and 3 external usability testers.', proof: 'Demo URL, metrics report and anonymized usability feedback.', career: 'Apply to 8–12 relevant SWE/Python/AI/LLM roles weekly.', resources: r('FastAPI tutorial','Docker','GitHub Actions','DSA roadmap'), days: [
    ['Study background jobs and timeouts', 'Implement ingestion job handling', 'Test failure and timeout behavior', 'Learn introductory DP'],
    ['Study retries and caching', 'Improve retrieval and ingestion reliability', 'Test retries and cache behavior', 'Practice DP'],
    ['Study logging, latency and costs', 'Add measurement and evaluation dashboard', 'Record latency and configurable LLM costs', 'Practice DP'],
    ['Study deployment configuration', 'Deploy EvidenceLab', 'Test search without an API key and verify citations', 'Practice DP'],
    ['Review evaluation methodology', 'Test with 50 documents and 100 questions', 'Invite at least 3 external usability testers', 'Review missed problems'],
    ['Review feedback and limitations', 'Write case study and document benchmarks', 'Publish demo and anonymized feedback', 'Retrospective and targeted applications'],
  ] }),
  week({ number: 9, title: 'ML pipelines', learn: ['Pandas, scikit-learn and PyTorch foundations', 'Experiment reproducibility, dataset shift, class imbalance, normalization, leakage safeguards and confusion matrices'], build: ['Build FlowGuard dataset loader, features and deterministic preprocessing/split', 'Train baseline classifier and create evaluation notebook or script'], practice: ['Dynamic programming and review'], gate: 'Reproducible baseline training and per-class held-out metrics; document dataset limitations.', proof: 'Training logs, environment specification and metrics table.', career: 'Apply to 8–12 relevant SWE/Python/AI/LLM roles weekly.', resources: r('scikit-learn','PyTorch tutorials','DSA roadmap'), days: [
    ['Study Pandas and network-flow schemas', 'Build authorized/synthetic dataset loader', 'Validate data schema and document provenance', 'Practice DP'],
    ['Study dataset shift and leakage', 'Implement deterministic train/validation/test splits', 'Check split isolation and limitations', 'Practice DP'],
    ['Study normalization and class imbalance', 'Build reproducible preprocessing and features', 'Test preprocessing on held-out data', 'Review missed problems'],
    ['Learn scikit-learn baselines', 'Train classical classifier', 'Save training configuration and logs', 'Practice DP'],
    ['Study confusion matrices and per-class metrics', 'Implement held-out evaluation script', 'Report precision, recall, F1 and limitations', 'Review missed problems'],
    ['Review reproducibility and PyTorch foundations', 'Reproduce baseline training', 'Publish environment, logs and metrics table', 'Retrospective and targeted applications'],
  ] }),
  week({ number: 10, title: 'Deep learning + serving', learn: ['PyTorch Dataset/DataLoader, training loop, optimizer/loss, checkpoints and model testing', 'Batch prediction, inference latency and throughput'], build: ['Build neural classifier and compare it with baseline', 'Implement model inference API and alert dashboard'], practice: ['Timed medium problems'], gate: 'Successful prediction API, model comparisons and p50/p95 latency on specified hardware.', proof: 'API demo and benchmark script/report.', career: 'Apply to 10–15 suitable roles weekly, refine resumes and practice interviews.', resources: r('PyTorch tutorials','FastAPI tutorial','scikit-learn','DSA roadmap'), days: [
    ['Study Dataset and DataLoader', 'Create neural model data pipeline', 'Test batches and preprocessing parity', 'Solve a timed medium problem'],
    ['Study optimizer, loss and training loops', 'Train neural classifier', 'Save checkpoints and training metadata', 'Solve a timed medium problem'],
    ['Study model testing and comparison', 'Evaluate neural and classical models', 'Compare held-out class metrics', 'Solve a timed medium problem'],
    ['Study inference and batch prediction', 'Implement FastAPI prediction endpoint', 'Test validation and model loading', 'Solve a timed medium problem'],
    ['Study latency and throughput', 'Build alert dashboard', 'Benchmark p50/p95 and throughput with hardware noted', 'Solve a timed medium problem'],
    ['Review model serving tradeoffs', 'Polish dashboard and API demo', 'Publish benchmark script and comparison', 'Retrospective and targeted applications'],
  ] }),
  week({ number: 11, title: 'MLOps + system reliability', learn: ['MLflow, versioning, drift/data quality and monitoring', 'Integration tests, calibration, safe input handling and Docker release process'], build: ['Add versioned artifacts, batch import, prediction logs and basic drift check', 'Implement robust failure handling and end-to-end tests'], practice: ['Mixed timed interviews and SQL practice'], gate: 'One-command local start, two tracked model versions, drift report and passing CI tests.', proof: 'Reproducible run instructions and dashboard screenshots.', career: 'Apply to 10–15 suitable roles weekly and seek interview feedback.', resources: r('MLflow','Docker','pytest','GitHub Actions','SQLBolt','DSA roadmap'), days: [
    ['Study MLflow and artifact versioning', 'Track two model versions and preprocessors', 'Test loading versioned artifacts', 'Practice SQL'],
    ['Study data quality and drift', 'Implement data-quality and distribution checks', 'Create drift report', 'Practice timed interview problems'],
    ['Study monitoring and calibration', 'Add prediction logs and confidence caveats', 'Test logs and dashboard filters', 'Practice SQL'],
    ['Study safe input handling', 'Implement batch import and failure handling', 'Test invalid CSV and inference failures', 'Practice timed interview problems'],
    ['Study integration testing and Docker releases', 'Build one-command local start and CI', 'Add end-to-end tests', 'Practice mixed interviews'],
    ['Review reproducibility and reliability', 'Complete run instructions and screenshots', 'Verify versions, drift report and CI evidence', 'Retrospective and targeted applications'],
  ] }),
  week({ number: 12, title: 'Launch + job readiness', learn: ['SWE architecture, tradeoffs, technical communication and fundamental system design', 'Behavioral STAR examples and interview rehearsal'], build: ['Polish and release all three repositories with diagrams, screenshots, demos, test instructions and benchmark reports', 'Prepare two targeted resumes: SWE and AI/ML'], practice: ['Review previously missed problems and complete two mock interviews'], gate: 'Three functional project demos, three case studies, three well-documented repositories, two resumes and two mock interviews.', proof: 'Links and final portfolio checklist.', career: 'Apply to 10–15 targeted roles per week, adjusted for actual availability.', resources: r('Git book','GitHub Actions','DSA roadmap'), days: [
    ['Study architecture discussions and tradeoffs', 'Polish OpsFlow repository and demo', 'Finalize diagrams, tests and case study', 'Review missed problems'],
    ['Study system design fundamentals', 'Polish EvidenceLab repository and demo', 'Finalize benchmark report and case study', 'Review missed problems'],
    ['Study technical communication', 'Polish FlowGuard repository and demo', 'Finalize reproducibility, benchmarks and case study', 'Complete first mock interview'],
    ['Prepare behavioral STAR examples', 'Draft SWE resume focused on APIs, databases, tests and deployment', 'Tailor resume to real roles', 'Review mock feedback'],
    ['Review ML evaluation and reproducibility', 'Draft AI/ML resume featuring EvidenceLab, FlowGuard and PrimAttack', 'Tailor resume and portfolio links', 'Complete second mock interview'],
    ['Review interview and project explanations', 'Verify three demos, three case studies and three repos', 'Finish final portfolio checklist and evidence links', 'Retrospective and apply to suitable roles'],
  ] }),
];

const features = (id: string, titles: string[]) => titles.map((title, i) => ({ id: `${id}-${i + 1}`, title }));
export const projects: ProjectSeed[] = [
  { id: 'opsflow', name: 'OpsFlow', schedule: 'Weeks 1–4', roleFit: 'Backend, full-stack, junior SWE', problem: 'Small teams coordinate internal requests through scattered chats and spreadsheets; consolidate intake, assignment, updates and reporting.', users: 'Small teams, clubs, volunteer organizations and small businesses.', stack: ['FastAPI','Python','PostgreSQL','SQLAlchemy','Alembic','React','TypeScript','Tailwind','Docker','GitHub Actions','pytest'], architecture: 'React client talks to a FastAPI service backed by PostgreSQL; organizations and memberships scope tickets, comments and audit events. Entities: users, organizations, memberships, tickets, comments, audit_events.', features: features('opsflow', ['Login/logout and secure session/token handling; never put sensitive secrets in frontend code','Organizations and role-based memberships','Tickets: create, read, update, status, priority, assignee and due date','Search, filter, sort and pagination','Comments and audit history','Dashboard counts, overdue and turnaround analytics','Server-side validation and organization-scoped access control','Docker setup and database migrations','Unit/integration tests, CI pipeline and deployed demo','GitHub README, screenshots, architecture and ER diagrams']), security: 'A user from Organization A must not retrieve or mutate Organization B records, including by guessing IDs. Cover this with tests; a login screen alone does not establish secure authentication.', evaluation: 'Run unit and integration tests, cross-organization authorization tests and CI; collect workflow friction feedback from 3–5 pilot testers and optionally compare baseline vs new completion or assignment time.', acceptance: 'Hosted usable demo, passing CI, verified cross-organization isolation and 3–5 pilot users invited.', impact: 'Measure real pilot-user outcomes; never invent results.', outputs: ['Repository URL','Demo URL','Brief recorded walkthrough','Test report','Measured usability metrics'], resume: 'Built and deployed a multi-tenant workflow system using FastAPI, PostgreSQL and React, serving [measured N] pilot users with role-based access, audit logging and automated tests.' },
  { id: 'evidencelab', name: 'EvidenceLab', schedule: 'Weeks 5–8', roleFit: 'AI/LLM engineer, applied ML, Python backend', problem: 'Researchers and students need reliable evidence finding and document search with trustworthy source navigation.', users: 'Researchers and students searching their own documents.', stack: ['FastAPI','PyMuPDF','sentence-transformers','PostgreSQL/pgvector','keyword search','React','configurable LLM API or local model'], architecture: 'Ingest PDFs into reproducible page-aware chunks, index embeddings and keywords, retrieve hybrid evidence and present grounded answers and source passages. Search and evaluation remain usable without an API key; generated answers are disabled or use an explicitly configured local model.', features: features('evidencelab', ['Upload PDFs; extract text and page metadata','Chunk documents reproducibly and track document IDs and chunk IDs','Embed and index text for vector retrieval','Keyword search and hybrid retrieval','Answer queries citing document, page and chunk','Show source passage and page context in the UI','Abstain or indicate uncertainty for unsupported questions','User/document access controls if multi-user','100 human-labeled evaluation questions and ground-truth citations','Compare keyword, vector and hybrid using Recall@5 and MRR','Evaluate citation correctness, groundedness, latency and LLM cost','Deploy and publish benchmark methodology and limitations']), security: 'Retrieved documents are untrusted: their content must not override system instructions, expose others’ documents or trigger unrestricted actions. Never expose API keys to browser clients.', evaluation: 'Reproducibly compare keyword, vector and hybrid retrieval on 100 labeled questions using Recall@5 and MRR; evaluate citation correctness, groundedness, latency and cost. Review 30 Q&A cases, test on 50 documents and test user-document isolation.', acceptance: 'Working demo, valid source-page citations, reasonable abstention, 100-question evaluation, 50-document test and at least 3 external usability testers.', impact: 'Have 3–5 research users or students complete evidence-finding tasks; measure correctness and task time against manual workflow using real trials.', outputs: ['Demo and repository URLs','Evaluation dataset schema and metrics report','Benchmark methodology and limitations','Anonymized usability feedback','Case study'], resume: 'Engineered an evidence-grounded research assistant with hybrid retrieval and verifiable PDF citations; evaluated on [N] labeled questions, achieving [measured Recall@5] and [measured citation accuracy].' },
  { id: 'flowguard', name: 'FlowGuard', schedule: 'Weeks 9–12', roleFit: 'ML engineer, Python backend, cybersecurity-focused AI', problem: 'Analysts need searchable, interpretable prioritization of network-flow alerts rather than opaque classification output.', users: 'Analysts triaging authorized or synthetic network-flow scenarios.', stack: ['PyTorch','scikit-learn','Pandas','FastAPI','PostgreSQL','MLflow','Docker','pytest'], architecture: 'Validate flow CSVs, apply a versioned preprocessing pipeline, serve classical and neural model predictions through FastAPI, and display alerts, logs and drift monitoring. Track experiments and artifacts in MLflow.', features: features('flowguard', ['Ingest authorized/synthetic network-flow CSV data with explicit schema validation','Reproducible preprocessing and leakage-resistant train/validation/test splits','Classical baseline model and neural model with held-out comparison','Class-wise recall, precision, F1, macro-F1, false-positive rate and confusion matrix','Export/record preprocessor plus model version and dependencies','FastAPI inference and batch prediction','Alert dashboard with classes, confidence/calibration caveats and filtering','Inference logs, p50/p95 latency and throughput benchmark with hardware noted','Data-quality checks and distribution/drift reporting','MLflow experiment tracking (local is acceptable), Docker and tests','Document benchmark evaluation separately from real deployment outcomes']), security: 'Use only authorized or synthetic network-flow data and validate input schemas; avoid claims of protecting live networks without operational evidence.', evaluation: 'Reproduce baseline and neural training, compare held-out per-class metrics, macro-F1 and false-positive rate, report confusion matrix and calibration caveats; measure p50/p95 and throughput on specified hardware and report drift.', acceptance: 'One-command local start, two tracked model versions, inference API, drift report, passing CI tests and reproducible training and benchmarks.', impact: 'Use consented/synthetic test flows and document whether analysts triage scenarios faster or more accurately. Do not imply reliable live-network protection without evidence. PrimAttack domain knowledge and independently permitted code/data may help, but this must be a standalone engineering product; robustness testing is optional after core work.', outputs: ['Repository and demo URLs','Training logs and environment specification','Held-out metrics and benchmark report','Drift report and dashboard screenshots','Case study and reproducible run instructions'], resume: 'Developed a reproducible network-flow threat classification and alerting service using PyTorch and FastAPI; benchmarked [held-out macro-F1], [false-positive rate] and [p95 latency] with model versioning and drift monitoring.' },
];

export const skills: SkillSeed[] = [
  { name: 'Python, Git and debugging', priority: 'Production backend + full stack', depth: 'Data structures, OOP, type hints, modules, CLI/Linux and debugging.', projects: ['opsflow','evidencelab','flowguard'], resources: r('Python tutorial','Git book') },
  { name: 'HTTP, APIs and databases', priority: 'Production backend + full stack', depth: 'HTTP/REST, PostgreSQL, SQL, FastAPI, Pydantic, ORM, migrations and secure authorization.', projects: ['opsflow'], resources: r('HTTP','PostgreSQL tutorial','SQLBolt','FastAPI tutorial','SQLAlchemy tutorial') },
  { name: 'TypeScript and React', priority: 'Production backend + full stack', depth: 'Components, forms, state, routing and API integrations; independently build a multi-user database-backed application.', projects: ['opsflow','evidencelab'], resources: r('JavaScript guide','TypeScript handbook','React learn') },
  { name: 'ML foundations and evaluation', priority: 'Applied AI/ML + LLM engineering', depth: 'NumPy, Pandas, scikit-learn, PyTorch, leakage prevention and reproducible held-out evaluation.', projects: ['flowguard'], resources: r('scikit-learn','PyTorch tutorials') },
  { name: 'Embeddings and grounded retrieval', priority: 'Applied AI/ML + LLM engineering', depth: 'Transformers, embeddings, vector similarity, ingestion, hybrid retrieval, RAG citations, structured outputs, tool calling and cost/latency evaluation.', projects: ['evidencelab'], resources: r('Hugging Face learn','pgvector') },
  { name: 'Production reliability and deployment', priority: 'Production reliability + deployment', depth: 'Docker, CI/CD, tests, configuration, logs, monitoring, versioning, secret handling, model serving and experiment tracking.', projects: ['opsflow','evidencelab','flowguard'], resources: r('Docker','GitHub Actions','pytest','MLflow') },
  { name: 'DSA and CS fundamentals', priority: 'Parallel practice', depth: 'Arrays, strings, maps, stacks, two pointers, windows, sorting, binary search, recursion, lists, trees, BFS/DFS, graphs, heaps, greedy, introductory DP, Big-O, HTTP/TCP, processes vs threads, indexes, transactions and OOP.', projects: [], resources: r('DSA roadmap','HTTP','SQLBolt') },
];
