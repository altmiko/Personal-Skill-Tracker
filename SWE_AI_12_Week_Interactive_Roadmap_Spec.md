# SWE + AI/ML Career Speedrun — Interactive Website Build Specification

> **Handoff instruction for a new ChatGPT chat / coding agent**
>
> Build a complete, polished, responsive **interactive learning and execution dashboard** from this document. The site is meant to be hosted on **GitHub Pages or Vercel** and used **daily** for 12 weeks. This is a functional product, **not** a static Markdown renderer or a mockup. Implement the application, populate its roadmap data from this specification, test it, and provide local-development and deployment instructions. If possible, deliver a ready-to-run source project as a ZIP. Do not omit the detailed roadmap, features, or progress persistence.

---

## 1. Product brief

**Working name:** Forge12 — SWE + AI/ML Career Sprint

**Audience:** A CS learner with programming fundamentals and limited experience shipping complete applications. Wants both junior SWE/backend and applied AI/ML roles, including Dhaka, Bangladesh and eligible remote roles.

**Timeframe:** 12 weeks; **42 focused hours weekly**, six days, seven hours each day (**504 hours** total). The website must allow the start date to be set by the user, so weeks and daily dates are computed dynamically rather than hardcoded. Use the browser's local timezone; dates are calendar-based, not elapsed 24-hour intervals.

**Outcome:** Ship three portfolio-grade, deployed products with measurable impact; strengthen DSA/interview readiness; begin applying for suitable jobs from Week 4.

**Experience assumptions:** Comfortable with introductory programming ideas; not yet comfortable designing/deploying full projects. Avoid skipping fundamentals.

**Core philosophy:** Build > passive consumption; each week must end with tangible evidence. Track **actual** hours and milestone completion, not only checkboxes. AI-assisted coding is allowed but the learner must explain and debug the critical code.

### Non-negotiable functionality

1. Daily plan and journal, with editable tasks, time tracking, blockers, and reflection.
2. Complete 12-week curriculum, expandable daily subplans, week-specific milestone gates and progress indicators.
3. Detailed specifications for all three projects, with feature checklists, evaluation requirements, and links to user's GitHub/demo.
4. DSA/interview practice tracker (problem, pattern, difficulty, solution URL, time, confidence, reattempt date).
5. Application tracker (company, position, URL, job type, location, date, stage, follow-up date, notes).
6. Statistics dashboard showing **planned versus completed** hours, weekly progress, project completion, DSA solved, applications, and milestone pass rate.
7. Persist edits across reloads. **Local-first** using localStorage or IndexedDB; provide **Export JSON**, **Import JSON** with validation, and **Reset with confirmation**. Explain honestly that browser storage is device-specific and can be cleared. Do not falsely promise cloud sync.
8. Responsive, accessible design, usable on desktop and mobile, with keyboard-accessible controls and light/dark mode.
9. No backend, accounts, API key, or paid service required for the base version; fully functional as a static SPA on GitHub Pages. Vercel also supported.
10. Let user change start date, weekly target, daily tasks, links, notes, and planned hours without modifying source code. Preserve completed tasks across such edits.

### Nice-to-have, only after core features work

- Calendar/heatmap of activity and streaks (avoid shaming language).
- Search across resources, project tasks and notes.
- Pomodoro/focus timer, weekly review wizard and printable weekly summary.
- Markdown notes and CSV job export.
- Optional GitHub sync through user-managed workflow only if secure and clearly optional; **never** embed a GitHub personal access token in the deployed frontend.
- Optional browser reminders only with explicit permission; no claims of reminders when tab is closed unless supported by real notifications/service worker.

---

## 2. Recommended implementation stack

- **Vite + React + TypeScript**; single-page static application.
- **Tailwind CSS** for styling; Lucide icons; clean, professional dashboard, not neon or gimmicky.
- **React Router** if needed, with HashRouter for hassle-free GitHub Pages static hosting (or an equivalent static-safe route strategy). Respect the Vite `base` setting for `https://username.github.io/repo/` deployments. Vercel can use normal SPA rewrites.
- **IndexedDB** (e.g. `idb`) or versioned localStorage schema for persistence. JSON exports include `schemaVersion`, `exportedAt`, user settings, roadmap task states, time entries, project links, DSA, applications, and journal entries.
- Small reusable chart library, if necessary, and an accessible date picker.
- Vitest/React Testing Library for storage migration, progress math, and critical interaction tests. ESLint and typecheck scripts.
- Static bundled roadmap seed data should be separate from dynamic user data, so app updates do not erase progress.

**Deliverable files:** project source; README; package scripts (`dev`, `build`, `preview`, `test`, `lint`); deploy guidance for GitHub Pages and Vercel; optionally GitHub Actions Pages workflow. No placeholders pretending to be functioning integrations.

---

## 3. Information architecture / pages

### A. Overview dashboard (default home)

Top summary: Current calendar date, program day, Week X of 12, days left, start/end dates, target hours, actual tracked hours.

Prominent cards: Today's tasks (with checkbox/progress), current week's focus, next deadline/milestone, progress toward 3 projects, cumulative DSA solved, applications submitted, hours this week vs 42.

Visuals: weekly hours bar chart, 12-week roadmap progress track, activity heatmap; do not equate page visits with productive work.

Quick actions: **Start focus session**, **Log study time**, **Add task**, **Add journal entry**, **Add DSA problem**, **Add application**, **Export backup**.

### B. Today / Daily execution

- Show exact tasks for selected date, grouped: Learn, Build, DSA, Review/Applications. Generate suggested tasks from current week's plan, with editable titles and hour estimates.
- Checkbox per task; optional actual time entered manually or via start/stop timer; no hidden time tracking.
- Day note fields: **What I built**, **What I learned**, **Blocker**, **Next action**.
- Manual custom task creation, edit/reorder/delete, carry unfinished tasks forward manually; avoid silently rewriting historical logs.
- A day is “done” by user choice or all mandatory tasks complete, not simply because hours were logged.

**Default six-day schedule (7 focused hours/day; breaks outside the 7h):**

| Local time | Length | Focus |
|---|---:|---|
| 09:00–10:30 | 1.5h | Study one concept and practice |
| 10:45–13:45 | 3h | Implement project features |
| 14:45–16:15 | 1.5h | Debug, test, refactor, integrate |
| 16:30–17:30 | 1h | DSA, CS fundamentals, or interviews |

Six days weekly. Sunday rest/optional catch-up. Weekly allocation is approximately 21h initial building + 10.5h related implementation/debugging + 9h learning + 6h DSA? This schedule totals 42h as stated: **9h concept study + 27h project building/debugging + 6h DSA**. Documentation, review and applications should be **integrated within** these blocks or swap in for some time rather than added as fictitious extra hours. Allow users to customize the allocation.

### C. Roadmap / 12-week planner

- Week list or timeline, each week with learning objectives, specific tasks, DSA topics, links, project deliverable and milestone gate.
- Week progress by checked tasks and hours, both reported separately.
- Ability to record milestone as **Not started / In progress / Evidence submitted / Passed** plus proof link and notes.
- “Gate check” requires deliberate user confirmation; mark delayed weeks separately without losing their tasks.
- Clicking a week opens detailed syllabus and resources.

### D. Projects (three detailed project workspaces)

For each: problem, users, scope, stack, architecture, feature checklist, nonfunctional expectations, security notes, evaluation methods, acceptance criteria, repo/demo URLs, screenshots and final resume bullets **with metric placeholders until measured**.

### E. Practice / DSA + interviews

Filter by patterns and difficulty. Fields: title, platform URL, date, time spent, result (solved with help / solved independently / revisit), notes, next review date. Weekly target distribution supplied below. Show actual counts, not just prescribed counts. Add technical-interview topics and mock interview log.

### F. Job applications

Kanban stages: Saved, Applied, Assessment, Interview, Offer, Rejected, Withdrawn. Fields: employer, role, SWE/AI classification, location, remote/hybrid/on-site, job URL, date applied, next action date, notes, salary if known. Allow editing stage, filtering, and CSV/JSON export. **Do not populate fake live vacancies**; user enters real postings. Seed optional *search destinations* such as Bdjobs and LinkedIn, clearly labeled as search links rather than current openings.

### G. Resources / skill map

Prioritized skill graph with **Foundation / Working / Interview-ready** self-assessment; each skill linked to project tasks and authoritative tutorials. Make self-assessed skill levels clearly subjective.

### H. Settings / data management

Start date, name or pseudonym optional, daily/weekly hour targets, theme, export/import/reset, storage warning, optional hosted repo links.

---

## 4. Skill priorities and depth

### Priority 1 — Production backend + full stack

Python, debugging, OOP and type hints; Git/CLI/Linux basics; HTTP/REST; PostgreSQL/SQL; FastAPI/Pydantic/ORM/migrations; JavaScript/TypeScript; React/forms/state; API integrations; secure authentication/authorization. **Target depth:** independently build a multi-user, database-backed app with working tests and deployment.

### Priority 2 — Applied AI/ML + LLM engineering

Numpy/Pandas/scikit-learn, model evaluation and leakage; PyTorch; embeddings and vector similarity; Transformers and Hugging Face; document ingestion; semantic/keyword/hybrid retrieval; RAG with citations; structured outputs; tool calling; evaluation and cost/latency tracking. **Target depth:** build an AI system with reproducible metrics and evidence-grounded output.

### Priority 3 — Production reliability + deployment

Docker/Compose, GitHub Actions, tests, environment configuration, logging, basic monitoring, versioning, CI/CD, deployment, secure handling of secrets, model serving and experiment tracking. **Target depth:** projects can be launched by another person with documented commands and reliable behavior.

### Parallel daily DSA / CS fundamentals

Arrays, strings, hash maps, stacks, two pointers, sliding windows, sorting, binary search, recursion, linked lists, trees, BFS/DFS, graphs, heaps, greedy, intro DP. Explain Big-O, tradeoffs, and code. Also refresh HTTP/TCP, processes vs threads, database indexes/transactions, and basic OOP.

---

## 5. Full 12-week curriculum — treat as seeded roadmap data

Every week: **42 planned hours**, daily updates, weekly retrospective and explicit evidence check. Suggested milestones below represent goals, not automatically achieved outcomes.

### Week 1 — Python engineering + CLI
- **Learn:** Python data structures, functions, OOP, type hints, modules, exceptions, virtual environments, file I/O, Git branches/commits, terminal, HTTP fundamentals.
- **Build:** CLI request tracker storing JSON records with add/list/update/delete, search, sorting and validation.
- **Practice:** Arrays, strings, hash maps, Big-O.
- **Gate:** Run tool from README; independently explain code; 8–10 meaningful passing tests; clean Git history.
- **Proof:** CLI screencast, README, test output.

### Week 2 — SQL + FastAPI
- **Learn:** SQL queries, joins, normalized tables, constraints, transactions, basic indexes; PostgreSQL; HTTP status codes, FastAPI, Pydantic, SQLAlchemy, migrations.
- **Build:** Upgrade request tracker into REST CRUD API with Postgres, filters, pagination and error responses.
- **Practice:** Two pointers, sliding windows, stacks.
- **Gate:** Reproduce database via migrations; endpoints work; 10+ API/DB tests; clear API docs.
- **Proof:** API URL or local OpenAPI screenshots, test report.

### Week 3 — TypeScript + React
- **Learn:** HTML/CSS essentials; JS functions, promises, async/await; TypeScript types; React components, hooks, state, forms, router, fetch.
- **Build:** OpsFlow frontend for login shell, ticket list/create/edit/detail, loading/error states, API integration.
- **Practice:** Binary search, sorting, recursion.
- **Gate:** Create ticket via browser, refresh and verify persistence; no TypeScript compile errors.
- **Proof:** frontend demo.

### Week 4 — OpsFlow launch
- **Learn:** Authentication and sessions/JWT tradeoffs, authorization, RBAC, web security basics, pytest integration tests, Docker, GitHub Actions, hosting.
- **Build:** Multi-org permissions, authentication, audit log, analytics view, tests, deployed demo.
- **Practice:** Linked lists, tree traversals; articulate code choices.
- **Gate:** Hosted usable demo; cross-organization authorization test; CI passes; 3–5 pilot users invited.
- **Proof:** Demo URL, GitHub URL, security test, feedback notes.
- **Career:** Begin 5–8 relevant applications/week; tailor SWE resume.

### Week 5 — ML + embeddings
- **Learn:** Train/validation/test, preprocessing, leakage, classification precision/recall/F1, vector math, embeddings, cosine similarity, transformer embedding models.
- **Build:** EvidenceLab PDF ingestion with source/page metadata, chunking, embeddings and top-k semantic retrieval.
- **Practice:** Trees, BFS/DFS.
- **Gate:** Top-k retrieval returns relevant chunks and correct source references on a test document set.
- **Proof:** documented retrieval examples.

### Week 6 — RAG application
- **Learn:** Tokenization, LLM API use, context windows, structured outputs, prompts, retrieval-augmented generation, hallucination risks, rate limits, costs.
- **Build:** Grounded Q&A, source links, hybrid keyword/vector search, search/chat frontend, abstention policy.
- **Practice:** Heaps, priority queues, graphs.
- **Gate:** Manually review 30 Q&A cases, citations resolve to valid source pages, missing-evidence cases abstain reasonably.
- **Proof:** 30-case mini-evaluation table.

### Week 7 — RAG evaluation and safety
- **Learn:** Recall@k, MRR, citation accuracy, answer-support scoring, simple reranking, prompt injection defenses, access control, scoped tool calling.
- **Build:** 100 labeled question/evidence pairs; keyword vs vector vs hybrid comparison; limited source-search tool; authorization tests.
- **Practice:** Graphs, topological sort.
- **Gate:** Reproducible evaluation script, metrics table, user-document isolation tests.
- **Proof:** dataset schema + results report.
- **Career:** Expand to relevant AI/ML and applied LLM roles.

### Week 8 — EvidenceLab launch
- **Learn:** Background jobs, timeouts/retries, caching, logging, LLM latency and cost measurement, deployment.
- **Build:** Deploy the product; implement evaluation dashboard; write case study; gather feedback from at least 3 testers.
- **Practice:** Introduction to dynamic programming.
- **Gate:** Working demo; tested on 50 documents; 100-question evaluation; 3 external usability testers.
- **Proof:** Demo URL, metrics report, anonymized usability feedback.

### Week 9 — ML pipelines
- **Learn:** Pandas, scikit-learn, PyTorch foundation, experiment reproducibility, dataset shift, class imbalance, normalization, leakage safeguards, confusion matrices.
- **Build:** FlowGuard dataset loader, features, deterministic preprocessing/split, baseline classifier, evaluation notebook/script.
- **Practice:** DP and review.
- **Gate:** Reproducible baseline training and per-class held-out metrics; document dataset limitations.
- **Proof:** training logs, environment specification, metrics table.

### Week 10 — Deep learning + serving
- **Learn:** PyTorch Dataset/DataLoader, training loop, optimizer/loss, checkpoints, model testing, batch prediction, inference latency and throughput.
- **Build:** Neural classifier and baseline comparison, model inference API and alert dashboard.
- **Practice:** Timed medium problems.
- **Gate:** Successful prediction API, model comparisons, p50/p95 latency on specified hardware.
- **Proof:** API demo, benchmark script/report.

### Week 11 — MLOps + system reliability
- **Learn:** MLflow, versioning, drift/data quality, monitoring, integration tests, calibration, safe input handling, Docker release process.
- **Build:** Versioned artifacts, batch import, prediction logs, basic drift check, robust failure handling, end-to-end tests.
- **Practice:** Mixed timed interviews and SQL practice.
- **Gate:** One-command local start, two tracked model versions, drift report and CI tests.
- **Proof:** reproducible run instructions, dashboard screenshots.

### Week 12 — Launch + job readiness
- **Learn:** SWE architecture discussion, tradeoffs, technical communication, behavioral STAR examples, fundamental system design, interview rehearsal.
- **Build:** Polish and release all three repositories; diagrams, screenshots, demos, test instructions, benchmark reports; prepare **two** targeted resumes (SWE and AI/ML).
- **Practice:** Review previously missed problems; complete two mock interviews.
- **Gate:** 3 functional project demos, 3 case studies, 3 well-documented repos, 2 resumes, 2 mock interviews.
- **Proof:** links and final portfolio checklist.
- **Career:** 10–15 targeted applications/week by this phase, adjusted for actual availability.

---

## 6. Detailed project requirements

### Project A — OpsFlow: Multi-tenant operations / request-management app

**Schedule:** Weeks 1–4. **Role fit:** Backend, full-stack, junior SWE.

**Actual user problem:** Small teams coordinate internal requests via scattered chats and spreadsheets. App consolidates request intake, assignment, updates and reporting. Pilot with a club, volunteer team or small business if possible.

**Tech:** FastAPI, Python, PostgreSQL, SQLAlchemy, Alembic, React, TypeScript, Tailwind, Docker, GitHub Actions, pytest.

**Data entities:** `users`, `organizations`, `memberships`, `tickets`, `comments`, `audit_events`.

**Must-have features:**
- [ ] Login/logout and secure session/token handling; never store sensitive secrets in frontend code.
- [ ] Organizations and role-based memberships.
- [ ] Tickets: create, read, update, status, priority, assignee, due date.
- [ ] Search, filter, sort, pagination.
- [ ] Comments and audit history.
- [ ] Dashboard counts, overdue/turnaround analytics.
- [ ] Server-side validation and organization-scoped access control.
- [ ] Docker setup and database migrations.
- [ ] Unit/integration tests, CI pipeline, deployed demo.
- [ ] GitHub README, screenshots, architecture and ER diagrams.

**Security acceptance:** User from Organization A must not retrieve or mutate Organization B's records, including by guessing IDs. Cover with tests. Do not claim secure authentication merely because there is a login screen.

**Impact evidence:** 3–5 pilot testers; collect workflow friction feedback and optionally baseline vs new completion/assignment time; never invent results.

**Portfolio outputs:** repo URL, demo URL, brief recorded walkthrough, test report, measured usability metrics.

**Resume bullet template:** “Built and deployed a multi-tenant workflow system using FastAPI, PostgreSQL and React, serving [measured N] pilot users with role-based access, audit logging and automated tests.”

### Project B — EvidenceLab: Source-grounded research assistant

**Schedule:** Weeks 5–8. **Role fit:** AI/LLM engineer, applied ML, Python backend.

**Actual user problem:** Researchers/students need reliable evidence finding and document search, with trustworthy source navigation.

**Tech:** FastAPI, PyMuPDF, sentence-transformers, PostgreSQL/pgvector, keyword search, React, LLM API of choice (configurable, optional paid key). Avoid expensive default architecture. If API key is absent, search and evaluation should still work; gracefully disable generated answers or support an explicitly configured local model.

**Must-have features:**
- [ ] Upload PDFs; extract text and page metadata.
- [ ] Chunk documents reproducibly, track document IDs/chunk IDs.
- [ ] Embed and index text; vector retrieval.
- [ ] Keyword search and hybrid retrieval.
- [ ] Answer user queries citing document/page/chunk.
- [ ] Show source passage and page context in UI.
- [ ] Abstain or indicate uncertainty for unsupported questions.
- [ ] User/document access controls if multi-user.
- [ ] 100 human-labeled evaluation questions and ground-truth citations.
- [ ] Compare keyword, vector and hybrid using Recall@5 and MRR.
- [ ] Evaluate citation correctness, groundedness, latency, and LLM cost.
- [ ] Deploy and publish benchmark methodology and limitations.

**Security note:** Retrieved documents are untrusted; their content cannot dictate system instructions, expose others' documents, or trigger unrestricted actions. Do not expose API keys to browser clients.

**Impact evidence:** 3–5 research users or students complete evidence-finding tasks, measure correctness and task time compared with manual workflow. Metrics must be from real trials, not theoretical claims.

**Resume bullet template:** “Engineered an evidence-grounded research assistant with hybrid retrieval and verifiable PDF citations; evaluated on [N] labeled questions, achieving [measured Recall@5] and [measured citation accuracy].”

### Project C — FlowGuard: ML-based network-flow alerting and monitoring

**Schedule:** Weeks 9–12. **Role fit:** ML engineer, Python backend, cybersecurity-focused AI.

**Actual user problem:** Analysts need searchable, interpretable prioritization of network-flow alerts, rather than an opaque classification output.

**Tech:** PyTorch, scikit-learn, Pandas, FastAPI, PostgreSQL, MLflow, Docker, pytest; monitoring charts as practical.

**Must-have features:**
- [ ] Ingest authorized/synthetic network-flow CSV data with explicit schema validation.
- [ ] Reproducible preprocessing and leakage-resistant train/validation/test splits.
- [ ] Classical baseline model and neural model; held-out comparison.
- [ ] Class-wise recall, precision, F1, macro-F1, false-positive rate and confusion matrix.
- [ ] Export/record preprocessor plus model version and dependencies.
- [ ] FastAPI inference and batch prediction.
- [ ] Dashboard of alerts, classes, confidence/calibration caveats and filtering.
- [ ] Inference logs, p50/p95 latency, throughput benchmark with hardware noted.
- [ ] Basic data-quality checks and distribution/drift reporting.
- [ ] MLflow experiment tracking (local is acceptable), Docker and tests.
- [ ] Write documentation honestly distinguishing benchmark evaluation from real deployment outcomes.

**Relationship to prior thesis:** User previously worked on PrimAttack, a constraint-aware adversarial evaluation method for flow-based NIDS. Relevant domain knowledge, evaluation rigor and independently permitted code/data may help. This project must remain a standalone *engineering product*, not just a thesis result repackaged with a new title. A robustness-testing extension is optional after core work.

**Impact evidence:** Use consented/synthetic test flows and document whether analysts can triage scenarios faster or more accurately. Never imply it reliably protects live networks without operational evidence.

**Resume bullet template:** “Developed a reproducible network-flow threat classification and alerting service using PyTorch and FastAPI; benchmarked [held-out macro-F1], [false-positive rate] and [p95 latency] with model versioning and drift monitoring.”

---

## 7. DSA goals and review intervals

Target **~100 independently understood** problems, including reattempts and two mock interviews. Suggested weekly targets:

| Weeks | Topic | New problems |
|---|---|---:|
| 1–2 | Arrays/strings/hash maps, two pointers, sliding windows | 18 |
| 3–4 | Binary search, sorting, stacks, recursion, linked lists | 18 |
| 5–6 | Trees, BFS/DFS, heaps, graph representation | 18 |
| 7–8 | Graphs, greedy, introductory DP | 18 |
| 9–10 | Mixed, SQL, debugging | 18 |
| 11–12 | Timed problems/review | 12 + 2 mocks |

Sum is **102** new problems. Display targets as suggestions, not fabricated accomplishments. Use tags and spaced review; count “solved independently” separately from “solved with help.” Include short Big-O explanation field.

---

## 8. Job search workflow and goal tracking

- **Weeks 1–3:** Setup GitHub, LinkedIn, resume and portfolio; shortlist 30 companies/employers.
- **Weeks 4–6:** Apply to 5–8 suitable junior SWE/backend roles weekly; point recruiters to OpsFlow.
- **Weeks 7–9:** Apply to 8–12 relevant SWE/Python/AI/LLM roles weekly; EvidenceLab becomes AI portfolio lead.
- **Weeks 10–12:** Apply to 10–15 suitable roles weekly; refine resumes, conduct interview practice, get feedback.
- Track **quality and stage**, not only application count. A role requiring 5+ professional years is a low priority for an entry-level applicant unless there is a special reason.
- Maintain two resume variants. **SWE:** OpsFlow, APIs, DB, tests, deployment. **AI/ML:** EvidenceLab, FlowGuard, PrimAttack research and reproducibility.
- Search destinations (not verified live openings): [Bdjobs](https://bdjobs.com/), [LinkedIn Jobs](https://www.linkedin.com/jobs/), employer career sites, relevant Bangladesh-eligible remote job boards.

---

## 9. Learning resource directory

Link resources contextually from the roadmap rather than presenting a giant disconnected bookmark list.

- Python: https://docs.python.org/3/tutorial/
- Git: https://git-scm.com/book/en/v2
- HTTP/REST: https://developer.mozilla.org/en-US/docs/Web/HTTP
- SQL basics: https://sqlbolt.com/
- PostgreSQL: https://www.postgresql.org/docs/current/tutorial.html
- FastAPI: https://fastapi.tiangolo.com/tutorial/
- SQLAlchemy: https://docs.sqlalchemy.org/en/20/tutorial/
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- TypeScript: https://www.typescriptlang.org/docs/handbook/intro.html
- React: https://react.dev/learn
- pytest: https://docs.pytest.org/en/stable/getting-started.html
- Docker: https://docs.docker.com/get-started/
- GitHub Actions: https://docs.github.com/en/actions
- scikit-learn: https://scikit-learn.org/stable/user_guide.html
- PyTorch: https://docs.pytorch.org/tutorials/
- Hugging Face: https://huggingface.co/learn
- pgvector: https://github.com/pgvector/pgvector
- MLflow: https://mlflow.org/docs/latest/index.html
- DSA: https://neetcode.io/roadmap

---

## 10. Data and interaction model

Seed plan definitions (weeks, tasks, projects, resources, skills) are read-only versioned app content; user custom tasks are separately editable. Generate stable identifiers. Suggested user data model:

```ts
type AppData = {
  schemaVersion: number;
  settings: {
    startDate: string; // local YYYY-MM-DD
    weeklyHourGoal: number; // default 42
    studyDays: number[]; // Mon-Sat default
    theme: 'light' | 'dark' | 'system';
  };
  roadmap: Record<string, {
    completedTaskIds: string[];
    milestoneStatus: 'not_started'|'in_progress'|'evidence_submitted'|'passed';
    milestoneEvidenceUrl?: string;
    milestoneNotes?: string;
  }>;
  dailyTasks: Array<{
    id: string; date: string; title: string; category: 'learn'|'build'|'dsa'|'career'|'review';
    estimatedMinutes: number; completed: boolean; sourceWeek?: number;
  }>;
  timeLogs: Array<{ id: string; date: string; category: string; minutes: number; note?: string }>;
  journals: Record<string, { built: string; learned: string; blocker: string; next: string }>;
  projectProgress: Record<string, { completedFeatureIds: string[]; repoUrl?: string; demoUrl?: string; evidenceUrls?: string[]; notes?: string }>;
  dsaEntries: Array<{ id: string; date: string; name: string; pattern: string; difficulty: string; url?: string; minutes: number; status: string; notes?: string; nextReviewDate?: string }>;
  applications: Array<{ id: string; company: string; role: string; track: 'swe'|'ai_ml'|'both'; location?: string; workMode?: string; url?: string; appliedDate?: string; stage: string; nextActionDate?: string; notes?: string }>;
};
```

**Important implementation behaviors:**
- Initialize sensible defaults on first run; never overwrite existing data on app update.
- Support migration to future schema versions and reject malformed imports with clear errors.
- Avoid duplicate daily task generation upon refresh; stable IDs keyed by week/task/date.
- Progress math: completed tasks / available tasks; actual logged minutes / user-configured target, clearly separate from estimated task time; no misleading percentage capped to hide overtime.
- Treat future dates and rest days correctly; allow manual plan adjustment for missed days.
- Preserve privacy: data is stored locally by default; no analytics/telemetry without explicit choice.
- Export and import should round-trip all state; test this.
- Include empty/loading/error states, keyboard controls and mobile layout.

---

## 11. User experience and design direction

**Look and feel:** high-quality engineering cockpit, restrained modern design, generous spacing, precise typography, calm dark/light mode, useful charts and progress indicators. Avoid cartoon gamification. On desktop: compact left navigation + top status header + main content; on mobile: collapsible nav and stacked cards.

**Suggested navigation:** Overview · Today · Roadmap · Projects · DSA · Applications · Skills/Resources · Settings.

**Landing experience:** First-run wizard with start date, target hours and optional existing progress. Make setup skippable. Show **“Continue today”** rather than a generic marketing home page.

**Engagement patterns:** weekly milestone celebration may be restrained, but no pressure/streak shame; actionable next steps, explicit blockers, time logging. Show motivational claims only when supported by actual user data.

---

## 12. Build order and acceptance tests for the website developer

**Stage 1 — Foundation:** Scaffold app, layouts/navigation, static week/project data, settings, storage schema, dark/light mode.

**Stage 2 — Daily usage:** Today dashboard, editable tasks, completion, hour logging, notes and live progress; robust persistence.

**Stage 3 — Full roadmap + projects:** 12 weeks, seeded requirements, milestone gates, project feature checklists, repo/demo links.

**Stage 4 — Career support:** DSA log, application tracker, skill map, resource links.

**Stage 5 — Polish and reliability:** Charts, filters, mobile, export/import, schema validation/migration, tests, accessibility, docs and deployment.

### Acceptance checklist

- [ ] All **12 weeks** and **3 full projects** from this specification are visible and navigable.
- [ ] Clicking daily task completion immediately updates dashboard totals and survives a page reload.
- [ ] Actual hours are tracked independently of checklist completion.
- [ ] User can add/edit/delete tasks and record daily progress.
- [ ] Milestone evidence and status are editable.
- [ ] DSA log supports topic filters and reattempt dates.
- [ ] Application kanban supports create/edit/update and filtering.
- [ ] Project checklists, repository links and demo links persist.
- [ ] Import/export round-trip works and bad imports are safely rejected.
- [ ] Start-date changes correctly recompute calendar weeks without erasing user progress.
- [ ] Site builds with `npm run build` and works in static preview.
- [ ] GitHub Pages instructions account for repository subpath; Vercel instructions are present.
- [ ] Mobile usability, keyboard navigation, and color contrast checked.
- [ ] No default paid service, hard-coded API secrets, fabricated live vacancies, or fake cloud sync.

---

## 13. Suggested README and deployment instructions to include in finished project

```bash
npm install
npm run dev
npm run test
npm run build
npm run preview
```

**GitHub Pages:** publish `dist/` through GitHub Actions; configure Vite `base` for repository URL and ensure static-safe routing. Provide workflow and exact settings. Explain how to update the live site when code changes.

**Vercel:** import GitHub repo, framework Vite, build `npm run build`, output `dist`; configure SPA rewrite only if using BrowserRouter. Explain that project progress resides on the user's current browser unless they import an exported backup.

**Backup:** Export JSON weekly and store it somewhere safe (e.g. private personal drive). An exported backup contains journal and job-application details; warn users before sharing it publicly.

---

## 14. Instructions to the coding assistant

1. Use this file as the **single source of truth** for content and requirements.
2. Make implementation choices pragmatically; do not ask basic preference questions if sensible defaults exist.
3. Deliver a working MVP with every primary navigation page, not a static prototype.
4. Make weekly/daily tasks actually editable and persistent; fake buttons and inert charts are unacceptable.
5. Make the three projects distinctive and measurable. Never convert example metric placeholders into fake achievements.
6. Include complete installation and hosting documentation, and run typecheck/build/tests before presenting the result.
7. If time is constrained, prioritize daily tracking, full curriculum, three projects, backup and deployability over animations and aesthetic extras.

**Success condition:** I can open Forge12 every morning, see exactly what I need to do, log real work, update project and job progress, check my milestones, and return tomorrow without losing my data.
