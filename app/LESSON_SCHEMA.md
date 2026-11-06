# Lesson data format (React Mastery app)

Lessons are **data, not prose pages**. The React app turns each lesson object into an animated,
study-friendly page with two tabs: **Learn** (detailed) and **Interview** (revision, the `-REV` view).

Goal: only the important information. Short sentences. Show, don't tell: a diagram, a code
walkthrough, a quiz. If a field would just repeat another field, keep it short or leave it out.

## File layout

- One file per module: `app/src/lessons/<CODE>.js` (e.g. `HOOKS.js`).
- A module split between writers uses `<CODE>.1.js`, `<CODE>.2.js` (same format, each holds its own IDs).
- Each file: `export default { "HOOKS-001": {...}, "HOOKS-002": {...} }`.
- Lesson IDs, titles, objectives, levels and order come from `app/src/data/curriculum.js`. Do not
  repeat title/objective in the lesson object; the app reads them from the curriculum.
- Code goes in JS template literals. Escape backticks as \` and `${` as `\${` inside them.
- Check your file: `node app/scripts/validate.mjs <CODE>` (from the project root). It must print `OK`.

## Learner & style rules

- Learner: developer with ~3 years of ASP.NET Core + PostgreSQL. Comparisons to C#/.NET are welcome
  when they genuinely help (one line, not a paragraph).
- **Plain English first, technical term in brackets**: "component memory (state)".
- Everyday examples only: shops, carts, todos, weather, chat, notes, recipes, music playlists.
  **No construction or infrastructure examples.**
- Concise. Every string should be scannable. Use `**bold**` and `` `code` `` inline (the only
  inline markup supported in text fields).

## Technical baseline (must be correct)

- React 19.2, function components and hooks only. `createRoot` from `react-dom/client`.
- Vite 8 for setup (`npm create vite@latest`). Create React App is deprecated (Feb 2025): never recommend it.
- React Router 7, imported from `react-router` (not `react-router-dom`).
- Label framework-only features (Next.js App Router, React Router framework mode, Server Components,
  Server Actions) as framework-only.
- When dev and prod output differ (Strict Mode double render/double effect), say so.
- Testing: Vitest + React Testing Library + MSW + Playwright. Data fetching: TanStack Query v5.
  State: Redux Toolkit, Zustand. Next.js 16 App Router. TypeScript 5.x.
- If unsure about an API detail, check the official docs (WebFetch react.dev, vite.dev,
  reactrouter.com, nextjs.org, tanstack.com) rather than guessing.

## Lesson object

```js
"STATE-001": {
  // ── Learn tab ─────────────────────────────────────────────
  tldr: "string, 1-2 sentences, <= 240 chars",          // REQUIRED. The whole idea in plain English.
  analogy: { icon: "🛒", text: "<= 220 chars" },        // REQUIRED. Everyday-life picture.
  visual: { ... },                                       // REQUIRED. One animated diagram (see types below).
  points: ["3-6 key points, each <= 200 chars"],         // REQUIRED.
  code: {                                                // REQUIRED for every lesson (WEB HTML/CSS/JS too).
    file: "App.jsx",                                     // file name shown on the tab
    lang: "jsx",                                         // jsx | js | ts | tsx | html | css | bash | json
    src: `...`,                                          // <= 45 lines, runnable where it makes sense
    walk: [ { lines: [3, 4], note: "<= 160 chars" } ]   // 2-6 steps; line numbers are 1-based into src
  },
  output: "what appears on screen / console (<= 400 chars)",   // optional
  mistakes: [ { bad: `code`, good: `code`, why: "<= 200 chars" } ],  // REQUIRED, 1-3 items
  practice: [ { level: "B" | "I" | "C", q: "string", a: "string", code: `optional solution code` } ],
                                                         // REQUIRED, 3-5 items (B = beginner, I = intermediate, C = challenge)
  quiz: [ { q: "string", options: ["a","b","c","d"], answer: 0, why: "string" } ],
                                                         // REQUIRED, exactly 3, 2-4 options each, answer = index
  // ── Interview tab (the -REV view) ──────────────────────────
  rev: {
    sec30: "the concept in 30 seconds, <= 400 chars",              // REQUIRED
    interview: [ { level: "basic"|"intermediate"|"advanced"|"tricky", q: "string", a: "string" } ],
                                                                    // REQUIRED, 4-6, at least 3 different levels
    predict: [ { code: `...`, answer: "string", why: "string" } ], // 0-2 output-based questions
    debug: [ { code: `buggy code`, fix: `fixed code`, why: "string" } ],  // 0-2
    scenario: [ { q: "string", a: "string" } ],                    // 0-2
    compare: { cols: ["", "A", "B"], rows: [["Aspect", "x", "y"]] },  // optional comparison table
    cheat: ["5-8 one-line facts, <= 140 chars each"]               // REQUIRED
  },
  related: ["HOOKS-004", "STATE-002"]    // REQUIRED, 2-4 valid lesson IDs from the curriculum
}
```

### Visual types (pick the one that best SHOWS the idea; the app animates it)

```js
// Steps that light up one after another with arrows (lifecycles, request flows, "what happens when").
{ type: "flow", title: "string", steps: [ { label: "<= 28 chars", detail: "<= 120 chars" } ] }   // 3-6 steps

// A loop (render cycle, event loop, re-render on state change). Same fields as flow; drawn as a circle.
{ type: "cycle", title: "string", steps: [ { label, detail } ] }                                   // 3-6 steps

// Side-by-side contrast (props vs state, controlled vs uncontrolled, CSR vs SSR).
{ type: "compare", title: "string",
  left:  { label: "string", tone: "bad" | "good" | "neutral", points: ["<= 90 chars", "..."] },   // 2-5 points
  right: { label: "string", tone: "bad" | "good" | "neutral", points: ["..."] } }

// A tree that grows node by node (component trees, DOM trees, folder structures, routes).
{ type: "tree", title: "string",
  root: { label: "App", note: "optional <= 60 chars", children: [ { label: "Header" }, { label: "Cart", children: [...] } ] } }
                                                                    // <= 14 nodes total, depth <= 4

// Stacked layers that build up bottom to top (browser rendering, app architecture, the stack).
{ type: "layers", title: "string", items: [ { label: "string", detail: "<= 100 chars" } ] }        // 3-6 items, top first

// A value changing over time (state snapshots, closure values, reducer steps).
{ type: "timeline", title: "string", frames: [ { label: "click 1", state: "count = 1", note: "<= 100 chars" } ] }  // 3-6 frames
```

### Projects (PROJ module)

Same object. Use `visual.type: "tree"` for the component tree, `code` for the core component, and add:

```js
build: {
  features: ["requirement 1", "..."],                 // 4-8
  folders: `src/\n  components/\n  ...`,             // plain-text folder tree
  steps: [ { title: "string", detail: "string", code: `optional` } ],   // 4-8 build milestones
  stretch: ["extra idea", "..."]                      // 2-4
}
```
Project `code.src` may be up to 80 lines.

## Example (a complete, correctly sized lesson)

```js
export default {
  "STATE-001": {
    tldr: "State (component memory) is data a component remembers between renders. When you change it with the setter, React draws the component again with the new value.",
    analogy: { icon: "🛒", text: "A shop's basket counter. The counter remembers how many items you added; every time it changes, the badge on the screen updates." },
    visual: { type: "cycle", title: "The state loop", steps: [
      { label: "Render", detail: "React calls `Counter()` and reads `count` (0)." },
      { label: "Click", detail: "User clicks **Add**; the handler calls `setCount(count + 1)`." },
      { label: "Schedule", detail: "React stores the new value and queues a re-render (it doesn't change the variable in place)." },
      { label: "Re-render", detail: "React calls `Counter()` again; now `count` is 1 and the screen updates." }
    ]},
    points: [
      "Declare with `const [value, setValue] = useState(initial)` at the **top level** of the component.",
      "A normal variable resets every render; state survives between renders.",
      "Calling the setter **schedules** a re-render; `value` stays the same until the next render (snapshot).",
      "Each component instance has its **own** state; two `<Counter />`s count separately."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function Basket() {
  const [items, setItems] = useState(0);

  return (
    <button onClick={() => setItems(items + 1)}>
      🛒 Basket: {items}
    </button>
  );
}

export default function App() {
  return <Basket />;
}`, walk: [
      { lines: [1], note: "Import the `useState` hook from React." },
      { lines: [4], note: "Ask React for memory: `items` starts at 0, `setItems` changes it." },
      { lines: [7], note: "On click, ask for the next value. React re-renders `Basket`." },
      { lines: [8], note: "JSX reads the current snapshot of `items`." }
    ]},
    output: "A button reading “🛒 Basket: 0”. Each click adds 1.",
    mistakes: [
      { bad: `let items = 0;\n<button onClick={() => items++}>`, good: `const [items, setItems] = useState(0);\n<button onClick={() => setItems(items + 1)}>`, why: "Changing a normal variable doesn't tell React to re-render, and the value resets on the next render anyway." }
    ],
    practice: [
      { level: "B", q: "Add a **Remove** button that lowers the count.", a: "Call `setItems(items - 1)` in a second button.", code: `<button onClick={() => setItems(items - 1)}>Remove</button>` },
      { level: "B", q: "Stop the count going below 0.", a: "Use `Math.max(0, items - 1)` or disable the button when `items === 0`." },
      { level: "I", q: "Show “Basket is empty” when the count is 0.", a: "`{items === 0 ? 'Basket is empty' : items}`" },
      { level: "C", q: "Render two `<Basket />`s. Do they share a count? Why?", a: "No. Each instance has its own state slot, tied to its position in the tree." }
    ],
    quiz: [
      { q: "What does calling `setItems(5)` do?", options: ["Changes `items` immediately", "Schedules a re-render where `items` is 5", "Reloads the page"], answer: 1, why: "Setters queue an update; the new value appears on the next render." },
      { q: "Where can you call `useState`?", options: ["Inside a loop", "At the top level of a component", "Inside an event handler"], answer: 1, why: "Hooks must be called in the same order every render." },
      { q: "Two `<Basket />` on a page share state.", options: ["True", "False"], answer: 1, why: "State is per component instance." }
    ],
    rev: {
      sec30: "`useState` gives a component memory. It returns the current value and a setter. Calling the setter schedules a re-render; the value is a snapshot for that render. State is per instance and must be updated, never mutated.",
      interview: [
        { level: "basic", q: "Why not use a normal variable instead of state?", a: "It resets on every render and changing it doesn't trigger a re-render." },
        { level: "intermediate", q: "What is a state snapshot?", a: "Each render sees fixed state values. Handlers created in that render read those values, even after calling the setter." },
        { level: "advanced", q: "How does React know which state belongs to which `useState` call?", a: "By call order. Each component has a list of hook slots; the Nth call reads slot N. That's why hooks can't be conditional." },
        { level: "tricky", q: "`setItems(items + 1)` called 3 times in one click: result?", a: "+1, not +3. All three read the same snapshot. Use `setItems(n => n + 1)` to add 3." }
      ],
      predict: [
        { code: `const [n, setN] = useState(0);\nfunction click() {\n  setN(n + 1);\n  console.log(n);\n}`, answer: "Logs 0 on the first click", why: "`n` is the snapshot from the current render." }
      ],
      cheat: [
        "`const [v, setV] = useState(init)`",
        "Setter schedules a re-render; doesn't change `v` now",
        "Top level only: no loops, conditions or nested functions",
        "State is per component instance",
        "Use `setV(prev => ...)` when the next value depends on the previous one"
      ]
    },
    related: ["STATE-002", "HOOKS-002", "EVT-001"]
  }
};
```
