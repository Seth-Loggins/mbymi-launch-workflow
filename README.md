# MBYMI Launch Workflow

A guided launch workbook for BBD members running the MBYMI (Monetize Before You Make It) launch process. React + Vite + Tailwind, fully client-side — no backend, no accounts.

**Live demo:** https://seth-loggins.github.io/mbymi-launch-workflow/

## What's in v1

- **6 macro-phases** at the top — PLAN / BUILD / NURTURE / SELL / CLOSE / DEBRIEF. Locked until prior phase is complete.
- **Guided workbook** — one prompt at a time, with structured inputs (text / number / date / acknowledge / note), helper text, and an optional "see an example" expander.
- **Live build panel** on the right with three views:
  - **Playbook** — a printable one-page launch plan that fills in section by section
  - **Funnel** — the prospect-journey diagram (Opt-in → Confirmation → Nurture → Webinar → Sales Page → Checkout → Thank You) lighting up as each step lands
  - **Links** — all the URLs you paste into note-type tasks (opt-in page, sales page, checkout, etc.) collected in one place with copy/open buttons
- **AI Assist button** on writing-heavy steps — opens a popup with a Mindpal embed slot (URLs are wired in per-task via `src/data/mbymiTaskConfig.js`)
- **Metrics drawer** — bonus panel accessed from the top-right button. Has the original metrics grid, recovery calculator, and risk alerts. Milestone tasks (flash sale, webinar, follow-up, close day) prompt the user to open it.

## Run locally

```
npm install
npm run dev
```

Opens at http://localhost:5173 — refresh resets state (in-memory only for v1).

## Deploy

The repo deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

## What's intentionally out of scope

Auth, persistence, real integrations (Kajabi/Stripe), working bots, multi-launch support. Seams are kept clean — see `src/state/LaunchContext.jsx` for the single source of truth and `src/data/mbymiTaskConfig.js` for the per-task knobs (input type, example, AI bot URL, playbook field).
