# MBYMI Launch Command Center

Local-only v1. Single-page React + Vite + Tailwind app — the AI-assisted launch workflow dashboard for BBD members running the MBYMI (Monetize Before You Make It) launch process.

## Run it

```
npm install
npm run dev
```

That's it. The app opens in the browser and is fully client-side — no backend, no accounts, no database. A page refresh resets state.

## What's in v1

- Setup screen → dashboard flow (one MBYMI launch at a time)
- The 50-task / 15-process-group MBYMI checklist (James's verbatim wording)
- Manual metric entry, live launch math, risk alerts, recovery calculator
- BotHub shown as a placeholder — real bots are wired in later via the `bot` field on each task

Brand colors + Bebas Neue / Montserrat typography are pulled from the BBD style guide and centralized in `tailwind.config.js` + `src/index.css`.
