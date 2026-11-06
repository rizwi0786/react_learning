# React Mastery Curriculum

A beginner-to-advanced React course with 497 short, animated lessons and an interview revision view for every topic. It also has a 15-hour, 2-day interview sprint.

**Live site:** https://rizwi0786.github.io/react_learning/

## Run it on your computer

You need Node 20.19 or later.

```bash
cd app
npm install
npm run dev        # local dev server
npm run build      # production build into app/dist
npm run validate   # check every lesson against the schema
```

## Deployment

Every push to `main` starts the GitHub Actions workflow in `.github/workflows/deploy.yml`. The workflow checks every lesson against the schema, builds `app/`, and publishes `app/dist` to GitHub Pages.

## Project layout

- `app/`: the React app (Vite 8 + React 19).
  - Lessons are data files in `app/src/lessons/`.
  - Their format is described in `app/LESSON_SCHEMA.md`.
- `HANDOFF.md`: the full project brief.
- `index.html` and `lessons/`: the original static version. It is kept as source material and is not deployed.
