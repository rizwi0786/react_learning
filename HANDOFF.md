# React Mastery: handoff brief

## Goal
A complete beginner-to-advanced React course, "React Mastery". Each topic has two views:
- **Learn:** an animated, concise lesson.
- **Interview & Revision:** the question-first version of the same topic.

Lesson IDs look like `HOOKS-005`; the revision view is `HOOKS-005-REV`.

The learner is Ajit Kumar, a developer with about 3 years' experience in ASP.NET Core and PostgreSQL. Preferences:
- Plain English first, with the technical term in brackets after it.
- Concise and practical, with lots of code. No walls of text.
- Everyday examples only (shops, todos, weather, chat). No construction or infrastructure examples.

## Current state (2026-11-05)

| What | Status |
|---|---|
| React app (`app/`) | Done: Vite 8 + React 19 |
| Lessons | **497 of 497 written**, all pass `validate.mjs`, all 994 views render with no errors at desktop and phone width |
| Published | https://claude.ai/artifact/BXg23PK6TXjCrJmfakXzVe (version 4). Private until the owner shares it. |

The old static page (`index.html`) and the old full-length HTML lessons (`lessons/`) are superseded. They are kept only as source material: the INTRO and JSX lessons were condensed from them.

## Layout

```
app/
  LESSON_SCHEMA.md          the lesson data format + style rules + technical baseline (read first)
  src/data/curriculum.js    25 modules / 497 lessons (generated from index.html by scripts/extract-curriculum.mjs)
  src/data/ready.js         generated list of IDs that have content
  src/lessons/<CODE>.js     lesson data; big modules split into <CODE>.1.js, <CODE>.2.js (…)
  src/components/           Visual (6 animated diagram types), Code (highlighter + step walkthrough), Study (quiz, flashcards, practice…)
  src/pages/                Home (course list, filters, progress), Lesson (Learn / Interview tabs), Roadmap
  scripts/validate.mjs      checks every lesson object against the schema
  scripts/artifact.mjs      turns dist/index.html into dist/artifact.html for publishing
```

## 2-day interview sprint (`#sprint`)

A 15-hour crash plan: 14 timed blocks over 2 days of 7.5 h each, with 123 hand-picked, mostly high-frequency topics.
- **Plan data:** in `src/data/sprint.js`.
- **Each topic** opens in either its Interview tab (~6 min) or its Learn tab (~12 min).
- **Each block** has:
  - "say it out loud" self-checks;
  - a focus timer;
  - a clock timetable built from a chosen start time, with breaks and lunch.
- **The final block** is a mock interview: 3 timed live-coding drills, then 32 rapid-fire questions marked "got it" or "again".
- **Lesson strip:** when a lesson is opened from the sprint, the lesson page shows a sprint strip with "Next in sprint →". The ✕ hides it.
- **Saved state:**
  - The sprint's own state (start times, self-checks, rapid-fire marks, strip on/off) is in localStorage under `rm-sprint`.
  - Topic ticks reuse `rm-done-d` and `rm-done-r`.

## Commands (run inside `app/`)

- `npm run dev`: local dev server.
- `npm run build`: regenerates `ready.js`, builds `dist/`, writes `dist/artifact.html` and `dist/artifact-files.json`.
- `node scripts/validate.mjs [CODE]`: validates all lessons or one module.

## How lessons work

- Lessons are **data**, not HTML. The app renders each one: big idea + analogy → animated diagram → key points → code walkthrough (step-highlighted lines) → output → mistakes (wrong vs right) → practice → 3-question quiz → related lessons. PROJ lessons add a build plan.
- The Interview tab shows: 30-second summary, cheat sheet, flip-card interview questions (basic, intermediate, advanced, tricky), predict-the-output, debug-it, scenarios, comparison table, code to remember, and a rapid quiz.
- Never reorder lessons in `curriculum.js`: IDs come from position.
- Links use plain hashes: `#HOOKS-005`, `#HOOKS-005-rev`, `#roadmap`, `#m-HOOKS`.
- Progress uses the same localStorage keys as the old page (`rm-done-d`, `rm-done-r`), so existing ticks carry over. Backup is by copy-text or by loading a file.

## Republishing
Run `npm run build`, then publish `app/dist/artifact.html` with `root: app/dist` and every `assets/*` file from `dist/artifact-files.json`. Asset names are hashed, so send the full new list each time.

## Points to verify (flagged by reviewers, all minor)
- NEXT: `'use cache: private'` and `'use cache: remote'` may still be experimental. NEXT-002 awaits `params` without `generateStaticParams`.
- TEST: confirm the Vitest 4.x minor that supports Vite 8.
- STYLE: confirm that `@tailwindcss/vite` officially supports Vite 8.
- RENDER-015: Strict Mode log dimming needs React DevTools installed.
- TS: `React.SubmitEvent` needs a recent `@types/react` 19.2.x.
- STORE-009: the Reselect output assumes RTK 2.x (Reselect 5.1+).
- Older items: INTRO-012 SSR example on Vite 8; INTRO-005 Angular/Vue snippets were never run.
