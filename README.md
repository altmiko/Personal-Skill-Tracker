# SkillTrack

A local-first 12-week SWE and applied AI/ML career sprint dashboard. Track daily work and actual time, milestones, portfolio projects, interview practice and applications. Roadmap goals are suggestions, not recorded achievements.

Weeks 1–4 use a concise OpsFlow path: brief Python and Git refreshers, an early API deployment, a database-backed API, a hosted frontend, and a security-focused launch. Daily suggestions provide one primary outcome and optional targeted practice; the 42-hour setting is adjustable, not a quota. Weeks 5–12 retain the AI/ML curriculum.

Existing generated daily tasks are not replaced. Completed tasks from the earlier first four weeks remain visible under “Previous roadmap progress” and in backups, separate from revised tasks. Existing milestone statuses and notes are preserved; review them against the revised gates.

The workspace uses a task-first learning-journal design and adapts to desktop and mobile screens. Choose light, dark, or system theme in Settings. See `DESIGN.md` for the visual system.

The home page shows the current local date and a seven-day record of completed tasks and logged time. Select a day in the record to open it in Today. Task counts are grouped by the task's date, not by a completion timestamp. In Skills & Resources, search by skill, project, or resource, set a self-assessment, and expand a skill for its resources and project tasks. On Today, use “Back to today” after selecting a different date.

The dashboard's primary buttons adapt the [Neobrutalism Button](https://21st.dev/@ekmas/library/neobrutalism) by Samuel Breznjak, distributed under the MIT license in `LICENSE-neobrutalism.txt`.

## Run locally

Requires Node.js 20 or newer and npm.

```bash
npm install
npm run dev
npm run test
npm run lint
npm run typecheck
npm run build
npm run preview
```

Open the URL printed by Vite. The production build is in `dist/`. The app is static and does not require an account, backend, API key or paid service.

## Your data and backups

Progress is stored in this browser's localStorage, on this device and origin only. It does not sync between devices or browsers and may be cleared by browser settings, private browsing or site-data removal. Export a JSON backup regularly and keep it somewhere safe. Backups contain personal journal and application information; do not publish them. Import validates the file before accepting it; an unsupported schema version or malformed data is rejected. Reset removes local progress after confirmation. Changing the start date changes the calendar, not completed work.

## Vercel

Import the repository into Vercel, select the Vite framework preset, use `npm run build`, and publish `dist`. The default base is `/`. Data remains in the individual browser, not on Vercel; use JSON export/import to transfer it.
