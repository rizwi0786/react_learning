export default {
  "RENDER-001": {
    tldr: "Every screen update in React goes through three steps: something **triggers** a render, React **renders** (calls your components to see what the UI should be), then React **commits** (changes the real DOM).",
    analogy: { icon: "🍽️", text: "A restaurant: a guest places an order (trigger), the kitchen cooks it (render), the waiter puts the plate on the table (commit). Nothing reaches the table until it's cooked." },
    visual: { type: "flow", title: "Trigger → Render → Commit", steps: [
      { label: "Trigger", detail: "First mount (`root.render`) or a state update (`setCart(...)`) asks React for a new screen." },
      { label: "Render", detail: "React calls your component functions. They return JSX describing what the UI **should** look like." },
      { label: "Compare", detail: "React compares the new description with the previous one to find what changed (reconciliation)." },
      { label: "Commit", detail: "React applies only the changes to the real DOM, then runs effects." },
      { label: "Paint", detail: "The browser draws the updated pixels. The user sees the new cart badge." }
    ]},
    points: [
      "**Rendering** means React calling your component. It does **not** mean the DOM changed.",
      "Render is pure calculation: same props and state in, same JSX out.",
      "**Commit** is the only step that touches the DOM.",
      "If the render result is identical, React commits nothing to the DOM.",
      "Like Razor building HTML, except React re-runs the function and patches the page instead of reloading it."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

function CartBadge() {
  const [count, setCount] = useState(0);
  console.log('1. render: count =', count);

  useEffect(() => {
    console.log('3. effect after commit: count =', count);
  }, [count]);

  return (
    <button onClick={() => {
      console.log('0. trigger');
      setCount(count + 1);
    }}>
      🛒 {count}
    </button>
  );
}

export default function App() {
  return <CartBadge />;
}`, walk: [
      { lines: [13, 14], note: "**Trigger**: the click calls the setter, which queues a render." },
      { lines: [5], note: "**Render**: React calls `CartBadge()` again. It only calculates JSX." },
      { lines: [11, 16], note: "The returned JSX is the new description of the UI." },
      { lines: [7, 8, 9], note: "**Commit** done: React updated the button text, then runs the effect." }
    ]},
    output: "Click once → console: `0. trigger`, `1. render: count = 1`, `3. effect after commit: count = 1`. (In dev Strict Mode the first mount logs twice.)",
    mistakes: [
      { bad: `function List() {\n  document.title = 'Items';  // DOM work in render\n  return <ul />;\n}`, good: `function List() {\n  useEffect(() => { document.title = 'Items'; }, []);\n  return <ul />;\n}`, why: "Render should only calculate. Touching the DOM belongs after commit, in an effect or event handler." }
    ],
    practice: [
      { level: "B", q: "Name the three steps of a React update in order.", a: "Trigger, render, commit." },
      { level: "B", q: "Does 're-render' mean the DOM changed?", a: "No. It means React called the component. The DOM changes only if the output differs." },
      { level: "I", q: "Add a log to a child of `CartBadge`. When does it print?", a: "Every time `CartBadge` renders, because a parent render renders its children by default." },
      { level: "C", q: "Put `console.log` in render and in `useLayoutEffect` and `useEffect`. Predict the order.", a: "Render → layout effect (after DOM update, before paint) → effect (after paint, usually)." }
    ],
    quiz: [
      { q: "Which step changes the real DOM?", options: ["Trigger", "Render", "Commit", "All three"], answer: 2, why: "Render only calculates; commit applies changes." },
      { q: "A component re-rendered but returned the same JSX. What happens to the DOM?", options: ["It is rebuilt", "Nothing changes", "The page reloads"], answer: 1, why: "React compares and finds no difference, so it skips DOM work." },
      { q: "When does `useEffect` run?", options: ["Before render", "During render", "After commit"], answer: 2, why: "Effects run after React has updated the DOM." }
    ],
    rev: {
      sec30: "React updates happen in three steps. **Trigger**: initial mount or a state update. **Render**: React calls components to get new JSX and diffs it with the old tree. **Commit**: React applies the minimal DOM changes and then runs effects. Rendering is not the same as updating the DOM.",
      interview: [
        { level: "basic", q: "What are the phases of a React update?", a: "Trigger, render and commit. Render calculates the new UI; commit applies it to the DOM and runs effects." },
        { level: "intermediate", q: "Is a re-render expensive?", a: "Not by itself. It's a function call plus a diff. It gets expensive only when components do heavy work or the tree is very large." },
        { level: "advanced", q: "Why does React split render and commit?", a: "Render is pure, so React can pause, restart or throw it away (concurrent rendering). Commit is synchronous so the user never sees a half-updated UI." },
        { level: "tricky", q: "Can a component render without its DOM changing?", a: "Yes. If the returned JSX matches the previous output, the commit has nothing to do for it." }
      ],
      predict: [
        { code: `function A() {\n  console.log('render');\n  useEffect(() => console.log('effect'));\n  return <p>Hi</p>;\n}`, answer: "`render` then `effect`. Dev Strict Mode: `render`, `render`, `effect`, `effect`.", why: "Effects run after commit, so always after the render log. Strict Mode (dev only) doubles both; this effect has no cleanup to log." }
      ],
      cheat: [
        "Trigger → Render → Commit → Paint",
        "Render = React calls your component",
        "Commit = React touches the DOM",
        "Same output → no DOM change",
        "Effects run after commit",
        "Render must be pure; commit is all-at-once"
      ]
    },
    related: ["RENDER-002", "RENDER-003", "RENDER-004", "STATE-008"]
  },

  "RENDER-002": {
    tldr: "A component renders for four reasons: it **mounts** for the first time, its own **state** changes, its **parent** renders, or a **context** it reads changes.",
    analogy: { icon: "🔔", text: "A shop display gets redone when the shop opens (mount), when the owner changes stock (state), when head office redoes the whole store (parent), or when a store-wide sale begins (context)." },
    visual: { type: "tree", title: "What triggers a render", root: { label: "Render triggers", children: [
      { label: "Initial mount", note: "`createRoot(el).render(<App />)`" },
      { label: "Own state update", note: "`setItems(...)` with a new value" },
      { label: "Parent rendered", note: "children render by default" },
      { label: "Context changed", note: "nearest Provider `value` changed" }
    ]}},
    points: [
      "Props changing is **not** a separate trigger: props change because the parent rendered.",
      "Setting state to the **same** value (`Object.is`) usually skips the render.",
      "A parent render renders **all** its children, even if their props didn't change (unless wrapped in `memo`).",
      "Context consumers render when the Provider's `value` changes, even if a `memo` parent sits in between.",
      "Changing a `ref` or a normal variable never triggers a render."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState, createContext, useContext } from 'react';

const Theme = createContext('light');

function Price({ amount }) {
  console.log('Price render');
  return <p>£{amount}</p>;
}

function Label() {
  const theme = useContext(Theme);
  console.log('Label render');
  return <p>Theme: {theme}</p>;
}

export default function Shop() {
  const [qty, setQty] = useState(1);
  const [theme, setTheme] = useState('light');

  return (
    <Theme value={theme}>
      <button onClick={() => setQty(qty + 1)}>Qty {qty}</button>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <Price amount={9.99} />
      <Label />
    </Theme>
  );
}`, walk: [
      { lines: [17], note: "**State trigger**: clicking Qty updates `Shop`'s own state." },
      { lines: [26], note: "**Parent trigger**: `Price` re-renders on every `Shop` render, even though `amount` never changes." },
      { lines: [21], note: "React 19: `<Theme value>` works as a Provider (no `.Provider` needed)." },
      { lines: [11], note: "**Context trigger**: `Label` reads the context, so a new `value` renders it." }
    ]},
    output: "Click **Qty** → logs `Price render` and `Label render` (both are children of `Shop`).",
    mistakes: [
      { bad: `const total = useRef(0);\ntotal.current += 1; // expect screen to update`, good: `const [total, setTotal] = useState(0);\nsetTotal(t => t + 1);`, why: "Refs are memory React doesn't watch. Only state setters (and context/parent renders) schedule a render." },
      { bad: `// "Price re-rendered, so its props changed"`, good: `// Price re-rendered because its parent did`, why: "Children render with the parent by default, whether or not their props changed." }
    ],
    practice: [
      { level: "B", q: "List the four render triggers.", a: "Initial mount, own state update, parent render, context change." },
      { level: "I", q: "`setName('Ana')` when `name` is already `'Ana'`. Re-render?", a: "Usually no. React bails out when `Object.is(old, new)` is true (it may run the component once before bailing out)." },
      { level: "I", q: "How do you stop `Price` re-rendering on every Qty click?", a: "Wrap it in `memo`, or move the Qty state into its own component so `Price` isn't under it.", code: `const Price = memo(function Price({ amount }) { ... });` },
      { level: "C", q: "`Label` is inside a `memo` wrapper. Does a theme change still render it?", a: "Yes. Context updates reach consumers directly, skipping `memo` on the way." }
    ],
    quiz: [
      { q: "Which is NOT a render trigger on its own?", options: ["State update", "Parent render", "Changing `ref.current`", "Context change"], answer: 2, why: "Refs are mutable boxes React does not watch." },
      { q: "A child's props didn't change but the parent rendered. Does the child render?", options: ["Yes, by default", "No, never", "Only if it has state"], answer: 0, why: "React renders the whole subtree unless a child is memoized." },
      { q: "Does `memo` block context updates?", options: ["Yes", "No"], answer: 1, why: "Components that read a context re-render when its value changes, memo or not." }
    ],
    rev: {
      sec30: "Four triggers: **mount**, **own state update**, **parent render**, **context change**. Props changes are a side effect of parent renders. Same-value state updates bail out. `memo` can skip parent-triggered renders but not context or own-state renders.",
      interview: [
        { level: "basic", q: "What causes a React component to render?", a: "Initial mount, its own state changing, its parent rendering, or a context it uses changing." },
        { level: "intermediate", q: "Do props changes cause re-renders?", a: "Indirectly. Props only change when the parent renders, and a parent render already renders the child." },
        { level: "advanced", q: "Why does `memo` not stop context-triggered renders?", a: "React propagates context changes straight to the consuming fibers, so the component renders even if its memoized parent bailed out." },
        { level: "tricky", q: "You call `setUser(user)` after mutating `user.name`. What happens?", a: "Nothing renders. Same object reference means `Object.is` is true and React bails out. Create a new object instead." }
      ],
      cheat: [
        "Triggers: mount, state, parent, context",
        "Props change = parent rendered",
        "Same value (`Object.is`) → bail out",
        "Children render with parent by default",
        "`memo` skips parent renders, not context",
        "Refs and plain variables never trigger"
      ]
    },
    related: ["RENDER-019", "RENDER-020", "STATE-008", "COMM-008"]
  },

  "RENDER-003": {
    tldr: "In the render phase React calls your components to work out the new UI. That code must be **pure** (no side effects), because React may call it more than once, pause it, or throw the result away.",
    analogy: { icon: "📝", text: "Writing a recipe draft on paper. You can rewrite it as often as you like and nobody eats anything. Cooking (side effects) happens only once the final recipe is chosen." },
    visual: { type: "compare", title: "Pure render vs impure render", left: { label: "Impure (bug)", tone: "bad", points: [
      "Mutates a variable outside the component", "Calls `fetch` or `setTimeout`", "Writes to the DOM or `localStorage`", "Sets state unconditionally"
    ]}, right: { label: "Pure (correct)", tone: "good", points: [
      "Reads props, state, context", "Calculates derived values", "Returns JSX", "Side effects go in handlers or effects"
    ]}},
    points: [
      "**Pure** = same inputs (props, state, context) give the same JSX, and nothing outside changes.",
      "React may render a component **more than once** for one commit: Strict Mode (dev), concurrent interruptions, Suspense retries.",
      "Rendered output can be **discarded** if a newer update arrives before commit.",
      "Mutating local variables you just created inside render is fine (local mutation).",
      "Side effects belong in **event handlers** first, `useEffect` second."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `// ❌ Impure: changes something outside on every render
let guestCount = 0;
function BadTicket() {
  guestCount = guestCount + 1;
  return <p>Ticket #{guestCount}</p>;
}

// ✅ Pure: output depends only on props
function Ticket({ number }) {
  return <p>Ticket #{number}</p>;
}

// ✅ Local mutation is fine: the array is created in this render
function Playlist({ songs }) {
  const items = [];
  for (const s of songs) items.push(<li key={s.id}>{s.title}</li>);
  return <ul>{items}</ul>;
}

export default function App() {
  const songs = [{ id: 1, title: 'Song A' }, { id: 2, title: 'Song B' }];
  return (
    <>
      <BadTicket /><BadTicket />
      <Ticket number={1} /><Ticket number={2} />
      <Playlist songs={songs} />
    </>
  );
}`, walk: [
      { lines: [2, 4], note: "Render changes an outside variable. In Strict Mode (dev) you'll see #2 and #4 instead of #1 and #2." },
      { lines: [9, 10], note: "Pure: the number comes in as a prop. Rendering twice gives the same result." },
      { lines: [15, 16], note: "`items` is created fresh each render, so pushing into it is safe." }
    ]},
    output: "Dev (Strict Mode): `Ticket #2`, `Ticket #4` for BadTicket. Pure tickets always show #1 and #2.",
    mistakes: [
      { bad: `function Feed() {\n  fetch('/api/posts'); // runs every render\n  return <List />;\n}`, good: `function Feed() {\n  useEffect(() => { fetch('/api/posts'); }, []);\n  return <List />;\n}`, why: "Render may run many times. Network calls in render fire repeatedly and can't be cancelled." },
      { bad: `function Cart({ items }) {\n  items.sort(byPrice); // mutates props\n  ...`, good: `function Cart({ items }) {\n  const sorted = items.toSorted(byPrice);\n  ...`, why: "Props are read-only. Sorting in place changes the parent's data. Copy first (`toSorted`, `[...items].sort`)." }
    ],
    practice: [
      { level: "B", q: "Is `const total = items.reduce(...)` in render pure?", a: "Yes. It only reads props and calculates a value." },
      { level: "I", q: "Why does Strict Mode render components twice in development?", a: "To expose impure renders: if output changes between the two calls, you have a side effect in render." },
      { level: "I", q: "Fix: `function Clock() { return <p>{new Date().toLocaleTimeString()}</p> }`.", a: "Reading the clock is non-deterministic. Store time in state and update it from an effect with `setInterval`." },
      { level: "C", q: "Name three reasons React may call your component without committing.", a: "Strict Mode double render (dev), a transition interrupted by an urgent update, a Suspense boundary retrying after data loads." }
    ],
    quiz: [
      { q: "Why must render be pure?", options: ["It runs faster", "React may run it many times or discard it", "Hooks require it"], answer: 1, why: "Concurrent rendering and Strict Mode rely on being able to re-run render safely." },
      { q: "Which is allowed during render?", options: ["`localStorage.setItem`", "Pushing into an array created in that render", "Changing a global counter"], answer: 1, why: "Local mutation of values you just created is fine." },
      { q: "Does Strict Mode double render happen in production?", options: ["Yes", "No, development only"], answer: 1, why: "It's a dev-only check." }
    ],
    rev: {
      sec30: "The render phase calls components to compute JSX. It must be **pure**: no DOM writes, network calls, timers or outside mutations. React can call render multiple times, pause it, or throw it away (Strict Mode, transitions, Suspense). Side effects go in event handlers or effects.",
      interview: [
        { level: "basic", q: "What happens in the render phase?", a: "React calls components to get JSX and diffs it with the previous tree. No DOM changes happen yet." },
        { level: "intermediate", q: "What makes a component impure?", a: "Changing anything that existed before the render: globals, props, the DOM, storage, or starting network requests." },
        { level: "advanced", q: "Why can React run render more than once per commit?", a: "Concurrent rendering can interrupt and restart work; Suspense retries; Strict Mode deliberately double-invokes in dev to catch impurity." },
        { level: "tricky", q: "Is calling `setState` during render ever OK?", a: "Only conditionally, to adjust state from changed props (e.g. `if (prev !== prop) setX(...)`). Unconditionally it causes an infinite loop." }
      ],
      cheat: [
        "Render = calculate JSX, nothing else",
        "Pure: same inputs → same output, no outside changes",
        "May run more than once, may be discarded",
        "Local mutation is OK; mutating props/globals is not",
        "Side effects → event handlers, then `useEffect`",
        "Strict Mode double render (dev only) exposes impurity"
      ]
    },
    related: ["RENDER-001", "RENDER-015", "RENDER-013", "HOOKS-005"]
  },

  "RENDER-004": {
    tldr: "In the commit phase React takes the finished render result and applies it to the real DOM in one go, attaches refs, then runs layout effects and (after paint) regular effects.",
    analogy: { icon: "🪧", text: "A shop swapping its window display. Everything is prepared behind a curtain, then the curtain drops at once. Customers never see a half-dressed window." },
    visual: { type: "flow", title: "Inside the commit", steps: [
      { label: "Mutate DOM", detail: "Insert, update and remove only the nodes that changed." },
      { label: "Attach refs", detail: "`ref.current` now points at the real DOM node (or `null` for removed ones)." },
      { label: "Layout effects", detail: "`useLayoutEffect` runs synchronously: measure the DOM before the browser paints." },
      { label: "Browser paints", detail: "The user sees the new UI." },
      { label: "Effects", detail: "`useEffect` cleanups from the last render run, then the new effects." }
    ]},
    points: [
      "Commit is **synchronous** and can't be interrupted, so the UI never shows a half-applied update.",
      "React touches **only** the DOM nodes that differ from the last commit.",
      "Refs are set during commit, so they're `null` during the first render.",
      "`useLayoutEffect` blocks paint (good for measuring); `useEffect` runs after paint (good for fetching, subscriptions).",
      "Cleanup functions from the previous effects run before the new effects."
    ],
    code: { file: "Note.jsx", lang: "jsx", src: `import { useRef, useState, useLayoutEffect, useEffect } from 'react';

export default function Note({ text }) {
  const boxRef = useRef(null);
  const [height, setHeight] = useState(0);
  console.log('render, ref =', boxRef.current);

  useLayoutEffect(() => {
    // DOM is updated but not yet painted
    setHeight(boxRef.current.getBoundingClientRect().height);
  }, [text]);

  useEffect(() => {
    console.log('painted, saving draft');
    localStorage.setItem('draft', text);
  }, [text]);

  return (
    <div>
      <p ref={boxRef}>{text}</p>
      <small>Note height: {Math.round(height)}px</small>
    </div>
  );
}`, walk: [
      { lines: [6], note: "On first render the ref is still `null`: commit hasn't happened." },
      { lines: [8, 10], note: "Layout effect: the `<p>` is in the DOM, so we can measure it before the user sees anything." },
      { lines: [13, 15], note: "Regular effect: runs after paint. Good place for storage or network work." },
      { lines: [20], note: "During commit React attaches `boxRef.current` to this `<p>`." }
    ]},
    output: "Console: `render, ref = null` → (layout effect sets height, re-render) → `painted, saving draft`. Screen shows the note and its measured height without a flicker.",
    mistakes: [
      { bad: `function Search() {\n  const input = useRef(null);\n  input.current.focus(); // crash on first render\n  return <input ref={input} />;\n}`, good: `function Search() {\n  const input = useRef(null);\n  useEffect(() => { input.current.focus(); }, []);\n  return <input ref={input} />;\n}`, why: "Refs are attached during commit. During render they're still `null`." }
    ],
    practice: [
      { level: "B", q: "Which hook runs before the browser paints?", a: "`useLayoutEffect`." },
      { level: "I", q: "Order these: paint, DOM mutation, `useEffect`, `useLayoutEffect`.", a: "DOM mutation → `useLayoutEffect` → paint → `useEffect`." },
      { level: "I", q: "When would you pick `useLayoutEffect` over `useEffect`?", a: "When you must measure or adjust the DOM before paint, e.g. positioning a tooltip, to avoid a visible flicker." },
      { level: "C", q: "Why can't the commit phase be interrupted like render?", a: "The DOM is shared and visible. A partly applied commit would show an inconsistent UI, so React applies it all at once." }
    ],
    quiz: [
      { q: "When is `ref.current` first set to the DOM node?", options: ["During the first render", "During commit", "After `useEffect`"], answer: 1, why: "React attaches refs while committing DOM changes." },
      { q: "Can React pause halfway through a commit?", options: ["Yes", "No"], answer: 1, why: "Commit is synchronous so the UI stays consistent." },
      { q: "Which runs first?", options: ["`useEffect`", "`useLayoutEffect`"], answer: 1, why: "Layout effects run right after DOM mutation, before paint; effects run after." }
    ],
    rev: {
      sec30: "Commit applies the render result to the DOM in one synchronous pass: mutate changed nodes, attach refs, run `useLayoutEffect`, let the browser paint, then run `useEffect` (cleanups first). It can't be interrupted, so users never see half an update.",
      interview: [
        { level: "basic", q: "What does React do in the commit phase?", a: "Applies the minimal DOM changes from render, attaches refs and runs effects." },
        { level: "intermediate", q: "Difference between `useLayoutEffect` and `useEffect` timing?", a: "Layout effects run after DOM mutation but before paint and block it; regular effects usually run after paint." },
        { level: "advanced", q: "Why is render interruptible but commit is not?", a: "Render is pure and invisible, so it can be thrown away. Commit mutates the visible DOM; stopping halfway would show a broken UI." },
        { level: "tricky", q: "Can `useEffect` ever run before paint?", a: "Yes, if the update came from a discrete user event like a click, React may flush effects synchronously before paint. Don't rely on either order for visual work; use a layout effect." }
      ],
      cheat: [
        "Commit: DOM mutations → refs → layout effects → paint → effects",
        "Synchronous, never interrupted",
        "Only changed nodes are touched",
        "Refs are `null` during first render",
        "`useLayoutEffect` = measure before paint",
        "Old effect cleanup runs before the new effect"
      ]
    },
    related: ["RENDER-001", "RENDER-010", "HOOKS-011", "HOOKS-007"]
  },

  "RENDER-005": {
    tldr: "Reconciliation (diffing) is how React compares the new element tree with the old one. A few simple rules decide whether to **update** a node in place or **throw it away and build a new one**.",
    analogy: { icon: "🧺", text: "Checking a shopping list against yesterday's: same item in the same spot, just tweak the quantity. Different item, cross it out and write a new one." },
    visual: { type: "flow", title: "The diffing rules", steps: [
      { label: "Compare same position", detail: "React walks both trees level by level, comparing the element at each spot." },
      { label: "Different type?", detail: "`<div>` → `<section>` or `<Cart>` → `<Wishlist>`: destroy the old subtree (state lost), build new." },
      { label: "Same DOM type", detail: "Same `<input>`: keep the DOM node, update only changed attributes." },
      { label: "Same component", detail: "Same `<Cart>`: keep the instance and its state, render it with new props." },
      { label: "Lists use keys", detail: "Children with `key` are matched by key, not by index." }
    ]},
    points: [
      "React does **not** do a perfect tree diff (that's O(n³)). Its heuristic is O(n): compare by type and position.",
      "Changing an element's **type** anywhere up the tree resets all state below it.",
      "Same type → **update**; different type → **replace**.",
      "`key` lets React match list items that moved, were added or removed.",
      "Reconciliation happens in the render phase; the resulting changes are applied in commit."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function Counter({ label }) {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{label}: {n}</button>;
}

export default function App() {
  const [vip, setVip] = useState(false);
  return (
    <>
      <label>
        <input type="checkbox" checked={vip} onChange={e => setVip(e.target.checked)} />
        VIP mode
      </label>
      {vip ? (
        <div><Counter label="VIP likes" /></div>
      ) : (
        <section><Counter label="Likes" /></section>
      )}
    </>
  );
}`, walk: [
      { lines: [13], note: "Same `<input>` every render: React keeps the node and only updates `checked`." },
      { lines: [17, 19], note: "Wrapper type flips between `<div>` and `<section>`: React destroys the old subtree, so the `Counter` resets to 0." },
      { lines: [5], note: "If both wrappers were `<div>`, the `Counter` would keep its count and just show the new label." }
    ]},
    output: "Click Likes 3 times, tick VIP → button shows `VIP likes: 0`. The count was lost because the parent type changed.",
    mistakes: [
      { bad: `{isEditing ? <div><Editor /></div> : <Editor />}`, good: `<div><Editor /></div>  // same structure both ways`, why: "Different wrapping changes the tree shape, so React sees a different element and resets the editor's state." }
    ],
    practice: [
      { level: "B", q: "`<p>` changes to `<h2>` at the same spot. Update or replace?", a: "Replace. Different type means a new DOM node." },
      { level: "I", q: "`<img src=\"a.png\">` becomes `<img src=\"b.png\">`. What does React do?", a: "Keeps the same `<img>` node and only changes `src`." },
      { level: "I", q: "Why is React's diff O(n) and not a perfect tree diff?", a: "It assumes different types make different trees and uses keys for lists, so it never searches for moved subtrees." },
      { level: "C", q: "Make the VIP example keep the count when toggling.", a: "Use the same wrapper element for both branches.", code: `<div><Counter label={vip ? 'VIP likes' : 'Likes'} /></div>` }
    ],
    quiz: [
      { q: "`<Cart />` is replaced by `<Wishlist />` at the same spot. What happens to `Cart`'s state?", options: ["Kept", "Destroyed", "Moved to Wishlist"], answer: 1, why: "Different component type → old subtree unmounted." },
      { q: "How does React match reordered list items?", options: ["By index only", "By `key`", "By text content"], answer: 1, why: "Keys give list children a stable identity." },
      { q: "Same `<input>` type, new `className`. React...", options: ["Recreates the input", "Updates the attribute", "Ignores it"], answer: 1, why: "Same DOM type → patch changed attributes." }
    ],
    rev: {
      sec30: "Reconciliation compares old and new element trees with an O(n) heuristic. **Different type** → unmount the old subtree (state lost) and mount new. **Same DOM type** → patch attributes. **Same component type** → keep state, re-render with new props. **Keys** match list children across renders.",
      interview: [
        { level: "basic", q: "What is reconciliation?", a: "The process of comparing the new element tree with the previous one to work out the minimal DOM changes." },
        { level: "intermediate", q: "What are React's two diffing assumptions?", a: "Elements of different types produce different trees, and keys identify stable children in a list." },
        { level: "advanced", q: "Why does wrapping a component in a conditional `<div>` reset it?", a: "The tree shape changes, so at that position React sees a different type and unmounts the old subtree." },
        { level: "tricky", q: "Does reconciliation happen in render or commit?", a: "In render. Commit only applies the list of changes reconciliation produced." }
      ],
      compare: { cols: ["", "Same type", "Different type"], rows: [["DOM node", "Kept, attributes patched", "Removed and recreated"], ["Component state", "Kept", "Lost"], ["Effects", "Re-run if deps change", "Cleanup, then fresh mount"]] },
      cheat: [
        "Diff by type + position, O(n)",
        "Different type → replace subtree, state lost",
        "Same DOM type → patch attributes",
        "Same component → keep state, new props",
        "Lists matched by `key`",
        "Reconcile in render, apply in commit"
      ]
    },
    related: ["RENDER-006", "RENDER-008", "RENDER-009", "STATE-020"]
  },

  "RENDER-006": {
    tldr: "JSX turns into plain JavaScript objects (React elements) describing the UI. This in-memory tree is often called the **virtual DOM**. Comparing objects is cheap; touching the real DOM is not.",
    analogy: { icon: "🗺️", text: "A floor plan of a shop on paper. Rearranging the plan is quick; moving real shelves is slow. You compare plans first, then move only the shelves that changed." },
    visual: { type: "flow", title: "From JSX to the screen", steps: [
      { label: "JSX", detail: "`<li className=\"item\">Milk</li>` in your component." },
      { label: "jsx() call", detail: "The compiler turns it into `jsx()` from `react/jsx-runtime` (older setups: `React.createElement`)." },
      { label: "Element object", detail: "`{ type: 'li', props: { className: 'item', children: 'Milk' } }` — just data." },
      { label: "Diff objects", detail: "React compares new objects with the previous ones in memory." },
      { label: "Patch DOM", detail: "Only the differences are written to the real DOM." }
    ]},
    points: [
      "A React **element** is an immutable plain object: `type`, `props`, `key`. Creating thousands is cheap.",
      "The real DOM is heavy: every change can trigger style, layout and paint work.",
      "React compares element trees in memory and writes only the differences.",
      "\"Virtual DOM\" is a nickname, not an API. React docs talk about **elements** and the **render tree**.",
      "The virtual DOM isn't magic speed; it makes **declarative** UI fast enough without manual DOM code."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `export default function App() {
  const element = (
    <li className="item">Milk</li>
  );
  console.log(element);
  // { type: 'li', key: null, props: { className: 'item', children: 'Milk' }, ... }

  const list = <ul>{['Milk', 'Eggs'].map(i => <li key={i}>{i}</li>)}</ul>;
  console.log(list.props.children.length); // 2

  return list;
}`, walk: [
      { lines: [2, 3, 4], note: "JSX creates an element object. Nothing is on the screen yet." },
      { lines: [5, 6], note: "Log it: it's plain data with `type` and `props`." },
      { lines: [8, 9], note: "Nested JSX becomes nested objects: `children` holds the two `<li>` elements." },
      { lines: [11], note: "React turns the returned tree into DOM on first commit, and diffs it on later renders." }
    ]},
    output: "Console shows an object like `{ type: 'li', props: {...} }` and `2`. The page shows a list: Milk, Eggs.",
    mistakes: [
      { bad: `const el = <p>Hi</p>;\nel.props.children = 'Bye'; // mutate element`, good: `const el = <p>{greeting}</p>; // make a new element`, why: "Elements are immutable snapshots. To change the UI, render a new element (usually by updating state)." },
      { bad: `// "React is fast because the virtual DOM is faster than the DOM"`, good: `// "React batches and minimises DOM writes"`, why: "Diffing is extra work. The win is that React does only the necessary DOM writes, so declarative code stays fast." }
    ],
    practice: [
      { level: "B", q: "What does `<button>Buy</button>` become at runtime?", a: "A plain object: `{ type: 'button', props: { children: 'Buy' } }`." },
      { level: "I", q: "What is `type` for `<CartItem />`?", a: "The `CartItem` function itself, not a string." },
      { level: "I", q: "Why is comparing element trees cheap?", a: "They're small JS objects in memory. No styles, layout or painting are involved until commit." },
      { level: "C", q: "Is hand-written DOM code always slower than React?", a: "No. Perfect manual DOM updates can be faster; React trades a little overhead for simpler, declarative code." }
    ],
    quiz: [
      { q: "A React element is...", options: ["A real DOM node", "A plain JS object describing UI", "A class instance with state"], answer: 1, why: "Elements are lightweight descriptions." },
      { q: "Why does React diff before touching the DOM?", options: ["DOM changes are costly", "JS can't read the DOM", "Browsers require it"], answer: 0, why: "Each DOM write may cause layout and paint, so React minimises them." },
      { q: "Can you change an element after creating it?", options: ["Yes, via `props`", "No, elements are immutable"], answer: 1, why: "You create new elements on each render instead." }
    ],
    rev: {
      sec30: "JSX compiles to `jsx()` calls that return immutable element objects (`type`, `props`, `key`). The tree of these objects is the \"virtual DOM\". On each render React diffs the new tree against the old in memory, then writes only the changes to the real DOM, which is the expensive part.",
      interview: [
        { level: "basic", q: "What is the virtual DOM?", a: "An in-memory tree of React elements (plain objects) that describes the UI. React diffs it to decide what real DOM to change." },
        { level: "intermediate", q: "Is the virtual DOM faster than the real DOM?", a: "Not inherently. It lets React compute the minimal set of DOM writes, so declarative updates stay efficient." },
        { level: "advanced", q: "How do elements relate to fibers?", a: "Elements are short-lived descriptions made each render. Fibers are long-lived nodes that hold state and are updated from those elements." },
        { level: "tricky", q: "What's `type` for `<Cart />` vs `<div />`?", a: "The `Cart` function reference vs the string `'div'`. That's how React tells component and DOM elements apart." }
      ],
      cheat: [
        "JSX → `jsx()` → element object",
        "Element = `{ type, props, key }`, immutable",
        "\"Virtual DOM\" = element tree in memory",
        "Diff in memory, write minimal DOM",
        "Component element `type` = the function",
        "Elements are recreated every render; fibers persist"
      ]
    },
    related: ["RENDER-005", "RENDER-007", "JSX-004", "RENDER-010"]
  },

  "RENDER-007": {
    tldr: "Fiber is React's internal engine (React 16+). Each component and element in your tree gets a **fiber**: a small work record. React processes fibers one at a time, so it can **pause**, let the browser breathe, and **resume**.",
    analogy: { icon: "🧾", text: "A café with order tickets. The barista makes one ticket at a time and can stop to serve an urgent customer, then pick up the next ticket where they left off." },
    visual: { type: "cycle", title: "The fiber work loop", steps: [
      { label: "Pick next fiber", detail: "Start at the root, or where work stopped last time." },
      { label: "beginWork", detail: "Call the component (or read the DOM type) and diff its children." },
      { label: "Move on", detail: "Go to `child`; if none, complete and go to `sibling`, else back up via `return`." },
      { label: "Time check", detail: "Concurrent render only: if the time slice is used up, `shouldYield()` → pause." },
      { label: "Resume / commit", detail: "Continue later. When all fibers are done, commit the whole tree at once." }
    ]},
    points: [
      "A **fiber** is a JS object per node: `type`, `props`, hook state, and `child`/`sibling`/`return` links.",
      "The old engine (stack reconciler) recursed the whole tree in one go and couldn't stop.",
      "Fibers turn recursion into a loop, so work can be split into small **units**.",
      "React keeps two trees: **current** (on screen) and **work-in-progress**. They swap on commit (double buffering).",
      "Your hook state lives on the fiber; that's why it survives between renders."
    ],
    code: { file: "fiber-sketch.js", lang: "js", src: `// Simplified: what a fiber holds (not the real source)
const fiber = {
  type: CartItem,          // component function or 'div'
  key: 'item-42',
  pendingProps: { name: 'Milk' },
  memoizedState: null,     // linked list of hooks (useState slots)
  child: null,             // first child fiber
  sibling: null,           // next fiber at the same level
  return: null,            // parent fiber
  alternate: null,         // twin in the other tree (current vs work-in-progress)
  lanes: 0,                // pending update priorities
};

// Simplified concurrent work loop
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
  // exits when done, or when the browser needs the main thread
}

function performUnitOfWork(fiber) {
  beginWork(fiber);                 // render component, diff children
  if (fiber.child) return fiber.child;
  let next = fiber;
  while (next) {
    completeWork(next);
    if (next.sibling) return next.sibling;
    next = next.return;
  }
  return null;
}`, walk: [
      { lines: [3, 5], note: "Each fiber knows what it is and its latest props." },
      { lines: [6], note: "Hook state (`useState`, `useRef`...) is stored on the fiber as a list, in call order." },
      { lines: [7, 8, 9], note: "Links form a tree you can walk with a loop instead of recursion." },
      { lines: [10], note: "`alternate` points to the copy in the other tree: current ↔ work-in-progress." },
      { lines: [16, 17], note: "One unit of work per loop. `shouldYield()` lets React stop and give the thread back." }
    ]},
    mistakes: [
      { bad: `// "Fiber makes each render faster"`, good: `// "Fiber makes rendering interruptible and prioritisable"`, why: "Fiber's goal is scheduling: splitting work, pausing it and doing urgent updates first, not raw speed." }
    ],
    practice: [
      { level: "B", q: "What is a fiber?", a: "React's internal record for one node in the tree: its type, props, state and links to parent, child and sibling." },
      { level: "I", q: "Why are `child`, `sibling` and `return` pointers useful?", a: "They let React walk the tree in a loop and remember where it stopped, so work can pause and resume." },
      { level: "I", q: "What are the current and work-in-progress trees?", a: "Current is what's on screen. Work-in-progress is being built. On commit, it becomes the new current." },
      { level: "C", q: "Why does hook order matter, given what you know about fibers?", a: "Hooks are stored as a linked list on the fiber. React reads them back by position, so the call order must not change." }
    ],
    quiz: [
      { q: "Main benefit of the Fiber architecture?", options: ["Smaller bundle", "Interruptible, prioritised rendering", "No more virtual DOM"], answer: 1, why: "Fibers split rendering into units that can pause and resume." },
      { q: "Where is a component's `useState` value stored?", options: ["In the DOM", "On its fiber", "In a global object"], answer: 1, why: "Each fiber's `memoizedState` holds its hook list." },
      { q: "Can the commit phase be split across frames?", options: ["Yes", "No"], answer: 1, why: "Only render work is interruptible; commit runs in one go." }
    ],
    rev: {
      sec30: "Fiber (React 16+) represents each node as a fiber object with type, props, hook state and child/sibling/return links. React walks fibers in a loop, one unit at a time, so concurrent rendering can yield to the browser and resume. Two trees (current and work-in-progress) swap on commit.",
      interview: [
        { level: "basic", q: "What is React Fiber?", a: "The reconciliation engine since React 16. It models the tree as linked fiber nodes so rendering can be split into small units of work." },
        { level: "intermediate", q: "What problem did Fiber solve?", a: "The old stack reconciler rendered the whole tree recursively without stopping, blocking input on big updates. Fiber can pause and prioritise." },
        { level: "advanced", q: "Explain double buffering in React.", a: "React builds a work-in-progress fiber tree from the current tree via `alternate` links, then swaps pointers on commit, reusing objects between renders." },
        { level: "tricky", q: "Does Fiber mean all rendering is concurrent?", a: "No. Normal updates still render synchronously; only concurrent features like transitions use the yielding work loop." }
      ],
      cheat: [
        "Fiber = unit of work per node",
        "Fields: type, props, memoizedState, child, sibling, return",
        "Loop instead of recursion → pausable",
        "`shouldYield()` gives the thread back",
        "Current tree ↔ work-in-progress tree",
        "Hooks live on the fiber, in call order"
      ]
    },
    related: ["RENDER-006", "RENDER-013", "RENDER-018", "HOOKS-002"]
  },

  "RENDER-008": {
    tldr: "React keeps a component's state as long as the **same type** is rendered at the **same position** in the tree. Change the type or the position and React treats it as a new component, so state resets.",
    analogy: { icon: "🪑", text: "A reserved café seat. Your coffee stays as long as you're in the same seat. Move seats or swap with someone else and the table is cleared." },
    visual: { type: "compare", title: "Identity = type + position", left: { label: "State kept", tone: "good", points: [
      "Same component type at the same spot", "Only props changed", "`{a ? <Field label=\"A\" /> : <Field label=\"B\" />}`"
    ]}, right: { label: "State reset", tone: "bad", points: [
      "Different type at that spot", "Moved to another position or parent", "Different `key`", "Component defined inside another component"
    ]}},
    points: [
      "State belongs to the **position in the tree**, not to the JSX tag you wrote.",
      "Two branches of a ternary returning the same type at the same spot **share** state.",
      "`{show && <A />}` keeps later siblings in stable slots (the `false` holds the place).",
      "Never define a component **inside** another: each render makes a new function type → state lost every time.",
      "A different `key` forces a new identity (next lesson)."
    ],
    code: { file: "Checkout.jsx", lang: "jsx", src: `import { useState } from 'react';

function Field({ label }) {
  const [text, setText] = useState('');
  return <label>{label} <input value={text} onChange={e => setText(e.target.value)} /></label>;
}

export default function Checkout() {
  const [isGift, setIsGift] = useState(false);
  return (
    <div>
      <button onClick={() => setIsGift(!isGift)}>Gift? {String(isGift)}</button>
      {isGift ? <Field label="Gift note" /> : <Field label="Delivery note" />}
    </div>
  );
}`, walk: [
      { lines: [13], note: "Both branches render `Field` at the same spot, so React sees **one** component whose label changed." },
      { lines: [4], note: "The typed text survives the toggle: it's tied to that position." },
      { lines: [12], note: "Toggle: the label switches, but your delivery note now appears as the gift note." }
    ]},
    output: "Type \"Leave at door\", click Gift → label says `Gift note` but still contains \"Leave at door\".",
    mistakes: [
      { bad: `function Shop() {\n  function Search() { /* useState */ }\n  return <Search />;\n}`, good: `function Search() { /* useState */ }\nfunction Shop() {\n  return <Search />;\n}`, why: "A nested definition creates a new function each render. New type → React remounts it and loses its state and focus." }
    ],
    practice: [
      { level: "B", q: "What two things decide component identity?", a: "Its type and its position in the tree (plus `key` when given)." },
      { level: "I", q: "Make the gift note and delivery note keep separate text.", a: "Render them in different positions or give them different keys.", code: `{isGift ? <Field key="gift" label="Gift note" /> : <Field key="delivery" label="Delivery note" />}` },
      { level: "I", q: "`{isGift && <Field label=\"Gift\" />}<Field label=\"Delivery\" />`. Does Delivery keep its state when toggling?", a: "Yes. The `false` holds the first slot, so Delivery stays in the second slot." },
      { level: "C", q: "Why does a nested component lose input focus on every keystroke?", a: "Each render creates a new function type, React unmounts the old input and mounts a new one." }
    ],
    quiz: [
      { q: "`{x ? <Cart /> : <Cart />}` toggles x. State?", options: ["Reset", "Kept"], answer: 1, why: "Same type, same position → same component." },
      { q: "Why is defining a component inside another a bug?", options: ["Syntax error", "New type every render resets state", "Hooks are banned there"], answer: 1, why: "React compares types by reference; a new function is a new type." },
      { q: "State is attached to...", options: ["The variable name", "The position in the render tree", "The DOM node id"], answer: 1, why: "React tracks state by tree position (and key)." }
    ],
    rev: {
      sec30: "Identity = **type + position** (+ key). Same type at the same spot keeps state even if props change; different type, moved position or new key resets it. Classic bugs: a ternary that unexpectedly shares state, and components defined inside other components that remount every render.",
      interview: [
        { level: "basic", q: "When does React keep a component's state?", a: "While the same component type stays at the same position in the tree." },
        { level: "intermediate", q: "Why do two branches of a ternary share state?", a: "They produce the same type at the same position, so React sees one component with new props." },
        { level: "advanced", q: "Why is `const Inner = () => ...` inside a component harmful?", a: "It's a new function each render, so its type differs from last time; React remounts it, losing state, effects rerun and focus is lost." },
        { level: "tricky", q: "How does `{cond && <A />}` keep siblings stable?", a: "When false it still occupies a child slot (as `false`), so the following siblings keep their positions." }
      ],
      cheat: [
        "Identity = type + position + key",
        "Same type, same spot → state kept",
        "Different type or spot → state reset",
        "Ternary with same type shares state",
        "Never define components inside components",
        "`false`/`null` still hold a slot"
      ]
    },
    related: ["RENDER-009", "RENDER-005", "STATE-020", "COMP-008"]
  },

  "RENDER-009": {
    tldr: "A `key` is a component's name tag. In lists it lets React **keep** the right state with the right item when items move. On any component, changing the key **resets** it to a fresh instance.",
    analogy: { icon: "🏷️", text: "Coat check tickets. With a ticket number (key) you always get your own coat back, even if the rack is reshuffled. Hand in a new ticket and you get a fresh, empty peg." },
    visual: { type: "timeline", title: "Index keys vs id keys when adding to the top", frames: [
      { label: "Start", state: "key 0: Milk [note: 2L] · key 1: Bread", note: "You typed \"2L\" in Milk's note box." },
      { label: "Add 'Eggs' on top (index keys)", state: "key 0: Eggs [note: 2L] · key 1: Milk · key 2: Bread", note: "Key 0 now means Eggs, so Eggs inherits Milk's note. Bug." },
      { label: "Same add (id keys)", state: "id 3: Eggs · id 1: Milk [note: 2L] · id 2: Bread", note: "React matches by id, so the note stays with Milk and Eggs is new." },
      { label: "Reset with key", state: "<Chat key=\"Ben\" /> after \"Ana\"", note: "Different key → old Chat unmounted, new one mounted with an empty draft." }
    ]},
    points: [
      "Keys must be **stable** and **unique among siblings**: use database ids, not `Math.random()`.",
      "Array **index** as key is only safe if the list never reorders, filters or inserts.",
      "Keys aren't passed as props; `props.key` is `undefined`.",
      "`<Form key={userId} />` is the clean way to **reset** all state when the user changes.",
      "A random key each render remounts every item every time: slow and loses input."
    ],
    code: { file: "Messenger.jsx", lang: "jsx", src: `import { useState } from 'react';

function Chat({ contact }) {
  const [draft, setDraft] = useState('');
  return (
    <div>
      <h3>Chat with {contact}</h3>
      <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Message" />
    </div>
  );
}

export default function Messenger() {
  const [contact, setContact] = useState('Ana');
  const [todos, setTodos] = useState([{ id: 1, text: 'Milk' }, { id: 2, text: 'Bread' }]);

  return (
    <>
      {['Ana', 'Ben'].map(name => (
        <button key={name} onClick={() => setContact(name)}>{name}</button>
      ))}
      <Chat key={contact} contact={contact} />

      <button onClick={() => setTodos([{ id: Date.now(), text: 'New' }, ...todos])}>Add on top</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>{t.text} <input placeholder="note" /></li>
        ))}
      </ul>
    </>
  );
}`, walk: [
      { lines: [22], note: "**Reset**: switching contact changes the key, so the draft for Ana never leaks into Ben's chat." },
      { lines: [24], note: "New items get an id when created, not during render." },
      { lines: [26, 27], note: "**Keep**: `key={t.id}` keeps each typed note attached to its own todo when items are added on top." },
      { lines: [19, 20], note: "Names are unique here, so they work as keys for the buttons." }
    ]},
    output: "Type a draft to Ana, click Ben → empty box. Type a note on Milk, click Add on top → the note stays on Milk.",
    mistakes: [
      { bad: `{todos.map((t, i) => <Todo key={i} todo={t} />)}`, good: `{todos.map(t => <Todo key={t.id} todo={t} />)}`, why: "Index keys follow the position, not the item. Insert, delete or sort and state ends up on the wrong row." },
      { bad: `<Todo key={crypto.randomUUID()} />`, good: `// create the id once, when the todo is added\n<Todo key={todo.id} />`, why: "A new key every render forces React to remount every item on every render." }
    ],
    practice: [
      { level: "B", q: "Why do lists need keys?", a: "So React can match each child to the same item across renders, even when the order changes." },
      { level: "I", q: "When is the index an acceptable key?", a: "When the list is static: never reordered, filtered or inserted into, and items have no state." },
      { level: "I", q: "Reset an `EditProfile` form when the selected user changes, without an effect.", a: "Give it the user's id as key.", code: `<EditProfile key={user.id} user={user} />` },
      { level: "C", q: "Do keys need to be unique across the whole app?", a: "No, only among siblings in the same list." }
    ],
    quiz: [
      { q: "Best key for a todo list from a database?", options: ["Array index", "`Math.random()`", "The todo's id"], answer: 2, why: "Stable and unique per item." },
      { q: "Changing `<Cart key=\"a\">` to `key=\"b\"` does what?", options: ["Updates props", "Unmounts and mounts a fresh Cart", "Nothing"], answer: 1, why: "A new key is a new identity." },
      { q: "Can a child read `props.key`?", options: ["Yes", "No"], answer: 1, why: "`key` is used by React and not passed down. Pass the id as a separate prop if needed." }
    ],
    rev: {
      sec30: "Keys give children stable identity. In lists, use stable unique ids so state follows the item when the list changes; index keys break on insert, delete or sort. On any element, changing the key remounts it, a clean way to reset state (`<Form key={id} />`).",
      interview: [
        { level: "basic", q: "What are keys for?", a: "Identifying list children across renders so React can reuse the right element and state when items move." },
        { level: "intermediate", q: "What goes wrong with index keys?", a: "When items are inserted, removed or reordered, the key follows the position, so state and DOM (like input text) attach to the wrong item." },
        { level: "advanced", q: "How can you reset a component's state from the parent?", a: "Change its `key`. React treats it as a new component, unmounts the old one and mounts a fresh one." },
        { level: "tricky", q: "Is `key={Math.random()}` a valid fix for the duplicate-key warning?", a: "It silences the warning but remounts every item each render, losing state and hurting performance." }
      ],
      cheat: [
        "Keys: stable + unique among siblings",
        "Use ids, not index (unless static list)",
        "Never random keys",
        "`key` isn't a prop",
        "New key = fresh instance (reset)",
        "Create ids when data is created, not in render"
      ]
    },
    related: ["RENDER-008", "RENDER-005", "JSX-014", "STATE-020"]
  },

  "RENDER-010": {
    tldr: "After diffing, React changes **only** the DOM nodes that actually differ, often a single text node or attribute. Everything else, including focus, scroll and typed input, is left alone.",
    analogy: { icon: "🌤️", text: "A weather board where you only flip the temperature digits. You don't repaint the whole board or take down the city name." },
    visual: { type: "tree", title: "Temperature +1: what gets touched", root: { label: "<article>", note: "untouched", children: [
      { label: "<h2> London", note: "untouched" },
      { label: "<img>", note: "untouched, no reload" },
      { label: "<p>", note: "`className` patched (cool → warm)", children: [
        { label: "text \"21°C\"", note: "text updated" }
      ]},
      { label: "<button>", note: "untouched" }
    ]}},
    points: [
      "React re-renders the whole component in memory but writes to the DOM **surgically**.",
      "Unchanged nodes keep their state: focus, cursor position, scroll, image loads.",
      "Same element type → React patches only changed attributes and text.",
      "See it: Chrome DevTools **Elements** panel flashes only the nodes that changed.",
      "React DevTools \"Highlight updates\" shows which **components rendered** (not DOM writes)."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Weather() {
  const [temp, setTemp] = useState(18);
  return (
    <article className="card">
      <h2>London</h2>
      <img src="/sun.svg" alt="Sunny" />
      <p className={temp > 20 ? 'warm' : 'cool'}>{temp}°C</p>
      <button onClick={() => setTemp(t => t + 1)}>+1°</button>
    </article>
  );
}`, walk: [
      { lines: [10], note: "Click → state update → `Weather` re-renders." },
      { lines: [6, 7, 8], note: "Same JSX as last time: React leaves these DOM nodes alone. The image isn't reloaded." },
      { lines: [9], note: "Only the text node changes, and the `class` attribute when it crosses 20°." }
    ]},
    output: "Each click only updates the `<p>` text. In DevTools Elements, only that line flashes.",
    mistakes: [
      { bad: `const ref = useRef();\nuseEffect(() => {\n  ref.current.innerHTML = \`<p>\${temp}°C</p>\`;\n});`, good: `<p>{temp}°C</p>`, why: "Manually replacing HTML throws away nodes React manages and recreates everything. Let React patch the DOM." }
    ],
    practice: [
      { level: "B", q: "Count is updated. Does React recreate the `<button>`?", a: "No. Same type and same position, so it only updates its text if that changed." },
      { level: "I", q: "Why doesn't typing in an uncontrolled `<input>` get lost when the parent re-renders?", a: "React keeps the same DOM input node, so the browser keeps its value." },
      { level: "I", q: "How can you see which DOM nodes changed?", a: "Chrome DevTools Elements panel highlights mutated nodes as they change." },
      { level: "C", q: "\"The component rendered 50 times\" — does that mean 50 DOM updates?", a: "No. Renders that produce identical output make zero DOM writes." }
    ],
    quiz: [
      { q: "State changes one number in a big card. React...", options: ["Rebuilds the card's DOM", "Updates just the changed text node", "Reloads the page"], answer: 1, why: "React writes only the differences." },
      { q: "React DevTools \"Highlight updates\" shows...", options: ["DOM mutations", "Components that rendered", "Network calls"], answer: 1, why: "It flashes rendered components, which may not have changed the DOM." },
      { q: "An `<img>` with the same `src` after re-render...", options: ["Reloads", "Is left as is"], answer: 1, why: "No attribute changed, so the node isn't touched." }
    ],
    rev: {
      sec30: "React re-renders in memory, then commits only the differences: changed text, attributes or inserted/removed nodes. Untouched nodes keep focus, scroll and input values. Rendering a component doesn't mean its DOM changed.",
      interview: [
        { level: "basic", q: "Does React rewrite the whole DOM on every update?", a: "No. It diffs and writes only the nodes and attributes that changed." },
        { level: "intermediate", q: "Why does React's minimal update matter beyond speed?", a: "It preserves browser state on untouched nodes: focus, selection, scroll and uncontrolled input values." },
        { level: "advanced", q: "How does React update a changed `style` object?", a: "It compares old and new style keys and sets or removes only the changed CSS properties on the node." },
        { level: "tricky", q: "Can a render cause zero DOM writes?", a: "Yes, whenever the output is identical. The cost then is just the render and diff." }
      ],
      cheat: [
        "Render everything in memory, write only the diff",
        "Same type → patch attributes/text",
        "Focus, scroll, input value preserved",
        "Render ≠ DOM change",
        "Elements panel shows DOM writes",
        "React DevTools highlights renders"
      ]
    },
    related: ["RENDER-004", "RENDER-006", "RENDER-005", "PERF-003"]
  },

  "RENDER-011": {
    tldr: "Every render is a **snapshot**. Its props, state and event handlers are frozen with the values from that render. Calling a setter doesn't change the value you're holding; it asks for a new render with a new snapshot.",
    analogy: { icon: "📸", text: "A photo of your shopping cart. Even after you add more items, the photo still shows what was in the cart when you took it." },
    visual: { type: "timeline", title: "Send a message, then change contact", frames: [
      { label: "Render 1", state: "to = 'Ana', msg = 'Hello'", note: "`handleSend` from this render captures Ana and Hello." },
      { label: "Click Send", state: "timer started (3s)", note: "The timeout callback closes over render 1's values." },
      { label: "Pick Ben (render 2)", state: "to = 'Ben'", note: "A new snapshot. Render 1's values didn't change." },
      { label: "3s later", state: "alert: Sent \"Hello\" to Ana", note: "Correct! The message goes to who you chose when you clicked." }
    ]},
    points: [
      "`state` is a plain constant inside one render; the setter can't change it in place.",
      "Event handlers and timers **close over** (capture) the values from the render that created them.",
      "After `setCount(count + 1)`, reading `count` on the next line still shows the old value.",
      "Use the **updater** `setCount(c => c + 1)` when you need the latest value.",
      "Need the latest value in an old callback? Read it from a `ref` (or `useEffectEvent` for effects)."
    ],
    code: { file: "Chat.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Chat() {
  const [to, setTo] = useState('Ana');
  const [msg, setMsg] = useState('Hello');

  function handleSend() {
    setTimeout(() => {
      alert(\`Sent "\${msg}" to \${to}\`);
    }, 3000);
  }

  return (
    <>
      <select value={to} onChange={e => setTo(e.target.value)}>
        <option>Ana</option>
        <option>Ben</option>
      </select>
      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </>
  );
}`, walk: [
      { lines: [4, 5], note: "In this render `to` and `msg` are fixed constants." },
      { lines: [7, 8, 9], note: "The timeout callback captures this render's `to` and `msg`." },
      { lines: [15], note: "Changing the contact starts a **new** render; the old callback still holds the old values." }
    ]},
    output: "Click Send, switch to Ben within 3 seconds → alert says `Sent \"Hello\" to Ana`.",
    mistakes: [
      { bad: `setCount(count + 1);\nconsole.log(count); // expect new value`, good: `const next = count + 1;\nsetCount(next);\nconsole.log(next);`, why: "`count` is the snapshot for this render. Calculate the next value in a variable if you need it now." }
    ],
    practice: [
      { level: "B", q: "`count` is 0. `setCount(5); alert(count);` What shows?", a: "0. The alert reads this render's snapshot." },
      { level: "I", q: "Why does a `setInterval` in an effect with `[]` deps keep reading the first value?", a: "It closes over the first render's state. Use `setX(x => x + 1)` or include the value in deps." },
      { level: "I", q: "You want the alert to use the contact selected **at alert time**. How?", a: "Store it in a ref too and read `ref.current` in the timeout.", code: `const toRef = useRef(to);\nuseEffect(() => { toRef.current = to; }, [to]);\n// in handleSend:\nsetTimeout(() => alert(toRef.current), 3000);` },
      { level: "C", q: "Explain why snapshots make the default behaviour safer.", a: "Async work uses the values the user saw when acting, so a message isn't sent to someone they picked later." }
    ],
    quiz: [
      { q: "Inside one render, can `count` change after `setCount`?", options: ["Yes, immediately", "No, it's a constant for that render"], answer: 1, why: "Each render has its own fixed values." },
      { q: "A timeout created in render 1 runs after render 3. It sees...", options: ["Render 3's state", "Render 1's state", "undefined"], answer: 1, why: "Closures capture the render that created them." },
      { q: "Best way to add 1 based on the latest value?", options: ["`setN(n + 1)`", "`setN(prev => prev + 1)`", "`n++`"], answer: 1, why: "The updater receives the latest queued value." }
    ],
    rev: {
      sec30: "Each render has its own fixed props and state. Handlers, effects and timers created in a render capture that render's values (closures). Setters request a new render; they don't mutate the current one. Use updater functions for the latest state, refs for latest values in old callbacks.",
      interview: [
        { level: "basic", q: "Why doesn't state update right after calling the setter?", a: "The current render's state is a snapshot. The new value appears in the next render." },
        { level: "intermediate", q: "What is a stale closure in React?", a: "A callback from an old render still reading that render's state, e.g. an interval set up once with `[]` deps." },
        { level: "advanced", q: "How do you read the latest state inside a long-lived callback?", a: "Use an updater (`setX(prev => ...)`), mirror the value in a ref, or for effects use `useEffectEvent`." },
        { level: "tricky", q: "Is the snapshot behaviour a bug?", a: "No, it's by design. Async work stays consistent with what the user saw when they acted." }
      ],
      predict: [
        { code: `const [n, setN] = useState(0);\n<button onClick={() => {\n  setN(n + 1);\n  setTimeout(() => alert(n), 1000);\n}}>+</button>`, answer: "Alerts 0 on the first click", why: "The timeout captured `n` from the render where the click happened." }
      ],
      cheat: [
        "Each render = fixed props + state",
        "Setter → next render, not this one",
        "Handlers/timers capture their render",
        "Updater `prev => ...` for latest state",
        "Ref for latest value in old callbacks",
        "Stale closure = old snapshot in a long-lived callback"
      ]
    },
    related: ["RENDER-012", "STATE-009", "STATE-010", "HOOKS-020"]
  },

  "RENDER-012": {
    tldr: "React **batches** state updates: several `setState` calls in one event are queued and processed together, giving **one** render. Updater functions in the queue run in order on the latest value.",
    analogy: { icon: "🧑‍🍳", text: "A waiter writes down every dish at your table before going to the kitchen, instead of running back after each one. One trip, the full order." },
    visual: { type: "timeline", title: "Tracing the update queue (start qty = 0)", frames: [
      { label: "setQty(qty + 5)", state: "queue: [replace with 5]", note: "`qty` is the snapshot 0, so this means \"set to 5\"." },
      { label: "setQty(q => q + 1)", state: "queue: [5, q => q + 1]", note: "An updater: will run on whatever the previous step gives." },
      { label: "setQty(42)", state: "queue: [5, q => q + 1, 42]", note: "Replace with 42." },
      { label: "Handler ends", state: "process: 0 → 5 → 6 → 42", note: "React works through the queue in order." },
      { label: "One render", state: "qty = 42", note: "Only one render and one commit for all three calls." }
    ]},
    points: [
      "Updates inside one event handler are **queued**; React renders once after the handler finishes.",
      "`setX(value)` means \"replace with value\"; `setX(fn)` means \"apply fn to the previous result\".",
      "Queue rule: process items in order, starting from the current state.",
      "Batching avoids half-updated UI (e.g. new qty with old total) and wasted renders.",
      "Need the DOM updated right now (rare)? Wrap the update in `flushSync` from `react-dom`."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Cart() {
  const [qty, setQty] = useState(0);
  const [note, setNote] = useState('');
  console.log('render', qty, note);

  function addThree() {
    setQty(q => q + 1);
    setQty(q => q + 1);
    setQty(q => q + 1);
    setNote('Added 3');
  }

  function puzzle() {
    setQty(qty + 5);
    setQty(q => q + 1);
    setQty(42);
  }

  return (
    <>
      <p>{qty} items. {note}</p>
      <button onClick={addThree}>Add 3</button>
      <button onClick={puzzle}>Puzzle</button>
    </>
  );
}`, walk: [
      { lines: [9, 10, 11], note: "Three updaters queued: 0 → 1 → 2 → 3." },
      { lines: [12], note: "A different state variable, same batch." },
      { lines: [6], note: "Logs **once** per click: `render 3 Added 3`. Four setter calls, one render." },
      { lines: [16, 17, 18], note: "Mixed queue: replace 5, then +1 = 6, then replace 42. Final: 42." }
    ]},
    output: "Add 3 → `3 items. Added 3`, console logs one render. Puzzle (from 3) → 42.",
    mistakes: [
      { bad: `setQty(qty + 1);\nsetQty(qty + 1);\nsetQty(qty + 1); // expect +3`, good: `setQty(q => q + 1);\nsetQty(q => q + 1);\nsetQty(q => q + 1);`, why: "All three read the same snapshot, so each says \"set to 1\". Updaters chain on the queued result." }
    ],
    practice: [
      { level: "B", q: "Two different setters called in one click: how many renders?", a: "One. They're batched." },
      { level: "I", q: "From 0: `setN(n + 1); setN(n + 1); setN(q => q * 10);` Result?", a: "10. Replace 1, replace 1, then 1 × 10." },
      { level: "I", q: "From 0: `setN(q => q + 2); setN(7); setN(q => q - 1);` Result?", a: "6. 0 → 2 → 7 → 6." },
      { level: "C", q: "When would you use `flushSync`?", a: "When you must read the updated DOM immediately, e.g. scrolling to a just-added chat message.", code: `import { flushSync } from 'react-dom';\nflushSync(() => setMessages([...messages, m]));\nlistRef.current.lastChild.scrollIntoView();` }
    ],
    quiz: [
      { q: "From 0: `setN(n + 1)` three times. Result?", options: ["3", "1", "0"], answer: 1, why: "Each call replaces with snapshot 0 + 1." },
      { q: "From 0: `setN(5); setN(q => q + 1)`. Result?", options: ["6", "1", "5"], answer: 0, why: "Replace with 5, then the updater adds 1." },
      { q: "Why batch updates?", options: ["Fewer renders and no half-updated UI", "To make state immutable", "Required by hooks rules"], answer: 0, why: "One consistent render per event." }
    ],
    rev: {
      sec30: "React queues all state updates from an event and renders once after the handler finishes. Values replace; updater functions transform the previous queued result, in order. This avoids extra renders and inconsistent UI. `flushSync` forces an immediate update when needed.",
      interview: [
        { level: "basic", q: "What is batching?", a: "Grouping several state updates into a single re-render." },
        { level: "intermediate", q: "Why does `setN(n + 1)` three times only add 1?", a: "Each reads the same snapshot `n`, so they all queue \"set to n + 1\". Use `setN(p => p + 1)`." },
        { level: "advanced", q: "How does React process the update queue?", a: "It starts from the current state and applies each queued item in order: values replace, functions receive the previous result." },
        { level: "tricky", q: "From 0: `setN(n + 5); setN(p => p + 1); setN(42)`. Result?", a: "42. 0 → 5 → 6 → 42; the last replace wins." }
      ],
      cheat: [
        "Many setState calls → one render",
        "Value = replace; function = transform previous",
        "Queue processed in order",
        "Updaters: pure, no side effects",
        "Batching works across different state variables",
        "`flushSync` = opt out (rare)"
      ]
    },
    related: ["RENDER-016", "RENDER-011", "STATE-019", "STATE-010"]
  },

  "RENDER-013": {
    tldr: "Concurrent rendering lets React **prepare a new screen in the background** while the current one stays visible and responsive. You opt in per update with transitions, `useDeferredValue` or Suspense.",
    analogy: { icon: "🍳", text: "A chef prepping the next course while you're still eating this one. You keep enjoying your plate; the new dish appears only when it's fully ready." },
    visual: { type: "compare", title: "Blocking vs concurrent render", left: { label: "Blocking (default)", tone: "bad", points: [
      "Starts rendering and can't stop until done", "Clicks and typing wait", "A slow tab freezes the page", "Used for normal `setState`"
    ]}, right: { label: "Concurrent (opt-in)", tone: "good", points: [
      "Renders in small chunks, yields to the browser", "Old UI stays on screen and interactive", "Can be interrupted or thrown away", "`startTransition`, `useDeferredValue`, Suspense"
    ]}},
    points: [
      "Concurrency is about **rendering**, not threads: it still runs on the main thread, in small pieces.",
      "The new tree is built in memory; the screen switches only at **commit**, all at once.",
      "Mark non-urgent updates with `startTransition` (or `useTransition` for an `isPending` flag).",
      "Urgent updates (typing, clicking) stay synchronous; transitions wait their turn.",
      "Requires `createRoot` (React 18+), and pure render functions, since work may be repeated."
    ],
    code: { file: "Tabs.jsx", lang: "jsx", src: `import { useState, useTransition } from 'react';

function SlowRecipe({ n }) {
  const start = performance.now();
  while (performance.now() - start < 1) {} // 1ms of fake work
  return <li>Recipe #{n}</li>;
}

function RecipeList() {
  const items = [];
  for (let i = 1; i <= 300; i++) items.push(<SlowRecipe key={i} n={i} />);
  return <ul>{items}</ul>;
}

export default function Tabs() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  function select(next) {
    startTransition(() => setTab(next));
  }

  return (
    <>
      <button onClick={() => select('home')}>Home</button>
      <button onClick={() => select('recipes')}>Recipes</button>
      <button onClick={() => select('about')}>About</button>
      {isPending && <p>Loading…</p>}
      {tab === 'home' && <p>Welcome!</p>}
      {tab === 'recipes' && <RecipeList />}
      {tab === 'about' && <p>About us</p>}
    </>
  );
}`, walk: [
      { lines: [3, 4, 5], note: "Each recipe takes 1ms to render, ~300ms total. Many small components = places React can pause." },
      { lines: [17], note: "`useTransition` gives `isPending` and `startTransition`." },
      { lines: [20], note: "The tab change is marked **non-urgent**: React renders the recipes in the background." },
      { lines: [28], note: "Meanwhile the old tab stays on screen with a hint. Clicking About cancels the recipe render." }
    ]},
    output: "Click Recipes then About quickly → no freeze; About appears immediately. Without the transition, the page locks for ~300ms.",
    mistakes: [
      { bad: `startTransition(() => setQuery(e.target.value)); // controlled input`, good: `setQuery(e.target.value);              // urgent\nstartTransition(() => setFilter(e.target.value));`, why: "Input values must update urgently, or typing lags. Put only the slow, derived update in the transition." }
    ],
    practice: [
      { level: "B", q: "Does concurrent rendering use extra threads?", a: "No. It splits rendering into chunks on the main thread and yields between them." },
      { level: "I", q: "Why does the slow list have to be many components?", a: "React can only yield **between** components. One giant 300ms component can't be paused." },
      { level: "I", q: "Which features opt into concurrent rendering?", a: "`startTransition`/`useTransition`, `useDeferredValue`, and Suspense (with transitions)." },
      { level: "C", q: "Why must render be pure for concurrency to work?", a: "React may render a tree, abandon it and render again. Side effects in render would run multiple times." }
    ],
    quiz: [
      { q: "What stays on screen while a transition renders?", options: ["A blank page", "The previous UI", "A spinner always"], answer: 1, why: "The current tree stays committed until the new one is ready." },
      { q: "Is a normal `setState` in a click concurrent?", options: ["Yes", "No, it's urgent and synchronous"], answer: 1, why: "Only updates you mark (transitions, deferred values) are interruptible." },
      { q: "Concurrent rendering runs on...", options: ["A Web Worker", "The main thread, in chunks", "The server"], answer: 1, why: "It yields to the browser between units of work." }
    ],
    rev: {
      sec30: "Concurrent rendering lets React build a new UI in memory in interruptible chunks while the old UI stays interactive. It's opt-in via `startTransition`, `useTransition`, `useDeferredValue` and Suspense. Urgent updates still render synchronously. It needs `createRoot` and pure components.",
      interview: [
        { level: "basic", q: "What is concurrent rendering?", a: "React's ability to prepare multiple versions of the UI and work on a render in the background without blocking user input." },
        { level: "intermediate", q: "How do you use it?", a: "Wrap non-urgent state updates in `startTransition`, or defer a value with `useDeferredValue`. Everything else stays urgent." },
        { level: "advanced", q: "Why does concurrency depend on Fiber?", a: "Fiber splits work into units with saved progress, so React can yield, resume, or discard a render." },
        { level: "tricky", q: "Does `startTransition` make a slow component faster?", a: "No. Total work is the same; it keeps the page responsive while that work happens, and can skip outdated renders." }
      ],
      cheat: [
        "Background render, old UI stays live",
        "Opt-in: `startTransition`, `useDeferredValue`, Suspense",
        "Same main thread, yields between components",
        "Commit is still all-at-once",
        "Never put controlled input updates in a transition",
        "Needs `createRoot` + pure render"
      ]
    },
    related: ["RENDER-014", "RENDER-018", "HOOKS-014", "HOOKS-015"]
  },

  "RENDER-014": {
    tldr: "When a slow, non-urgent render is in progress and the user types, React **drops** the slow work, handles the keystroke first, then starts the slow render again with the newest value.",
    analogy: { icon: "📞", text: "Writing a long email when the phone rings. You stop, answer the call, and then rewrite the email with whatever you learned on the call." },
    visual: { type: "timeline", title: "Typing \"jazz\" while a slow list renders", frames: [
      { label: "Type 'j'", state: "input = 'j' (urgent) → list render starts for 'j'", note: "Input updates at once; the slow list renders in the background." },
      { label: "Type 'a' mid-render", state: "list render for 'j' interrupted", note: "React pauses and handles the urgent keystroke first." },
      { label: "Restart", state: "input = 'ja' → list render for 'ja'", note: "The half-done 'j' work is thrown away, never shown." },
      { label: "Typing stops", state: "list render for 'jazz' completes", note: "Only the final result is committed." }
    ]},
    points: [
      "**Urgent**: typing, clicks, presses. **Non-urgent**: transitions and deferred values.",
      "A newer update **interrupts** an in-progress transition render; outdated work is discarded.",
      "`useDeferredValue(value)` shows the old value while rendering the new one in the background.",
      "Wrap the slow child in `memo`, or the deferred value doesn't help (it re-renders with the parent anyway).",
      "Show staleness with `value !== deferredValue` (e.g. dim the list)."
    ],
    code: { file: "Search.jsx", lang: "jsx", src: `import { useState, useDeferredValue, memo } from 'react';

const SONGS = Array.from({ length: 250 }, (_, i) => \`Song \${i + 1}\`);

function SlowSong({ title }) {
  const start = performance.now();
  while (performance.now() - start < 1) {} // 1ms fake work
  return <li>{title}</li>;
}

const Results = memo(function Results({ query }) {
  const hits = SONGS.filter(s => s.toLowerCase().includes(query.toLowerCase()));
  return <ul>{hits.map(s => <SlowSong key={s} title={s} />)}</ul>;
});

export default function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const stale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search songs" />
      <div style={{ opacity: stale ? 0.5 : 1 }}>
        <Results query={deferredQuery} />
      </div>
    </>
  );
}`, walk: [
      { lines: [23], note: "Urgent: the input always updates instantly." },
      { lines: [18], note: "`deferredQuery` lags behind; React renders it at low priority." },
      { lines: [11], note: "`memo` lets the urgent render skip `Results` (its prop is still the old deferred value)." },
      { lines: [19, 24], note: "While the background render is pending, dim the old results." }
    ]},
    output: "Type fast: letters appear instantly, the list fades and catches up when you pause. No dropped keystrokes.",
    mistakes: [
      { bad: `function Results({ query }) { ... } // no memo\n<Results query={deferredQuery} />`, good: `const Results = memo(function Results({ query }) { ... });`, why: "Without `memo`, the urgent render re-renders `Results` anyway, so the slow work blocks typing." }
    ],
    practice: [
      { level: "B", q: "Which is urgent: typing in an input or filtering a 5,000-item list?", a: "Typing. The filtered list can lag behind." },
      { level: "I", q: "What happens to a half-finished transition render when a new update arrives?", a: "It's discarded. React renders again using the latest state." },
      { level: "I", q: "`useTransition` or `useDeferredValue` when you don't own the state setter (value is a prop)?", a: "`useDeferredValue`: it defers a value you receive instead of wrapping the setter." },
      { level: "C", q: "Can React interrupt a component in the middle of its function body?", a: "No. It can only yield between components. A single slow component still blocks; split or memoize the work." }
    ],
    quiz: [
      { q: "The user types during a transition render. React...", options: ["Finishes the transition first", "Handles the keystroke, then restarts the transition", "Ignores the keystroke"], answer: 1, why: "Urgent updates win; outdated background work is thrown away." },
      { q: "Is interrupted render work ever shown on screen?", options: ["Yes, partially", "No"], answer: 1, why: "Only completed renders are committed." },
      { q: "What does `query !== deferredQuery` tell you?", options: ["A bug", "A background render is pending", "The input is empty"], answer: 1, why: "The deferred value is behind the latest one." }
    ],
    rev: {
      sec30: "Interruptible rendering: non-urgent renders (transitions, deferred values) yield between components. If an urgent update arrives, React pauses, handles it, discards the stale work and restarts with fresh state. Pair `useDeferredValue` with a `memo`ized slow child.",
      interview: [
        { level: "basic", q: "What makes a render interruptible?", a: "Being marked non-urgent with `startTransition` or `useDeferredValue`." },
        { level: "intermediate", q: "Why does `useDeferredValue` need `memo` on the slow child?", a: "The urgent render passes the old deferred value; `memo` lets React skip the child, so only the background render does the slow work." },
        { level: "advanced", q: "What happens to discarded work?", a: "The work-in-progress fiber tree is thrown away. Effects never ran because nothing was committed." },
        { level: "tricky", q: "Does debouncing do the same as `useDeferredValue`?", a: "No. Debounce waits a fixed time; deferred rendering starts immediately and adapts to device speed, and can be interrupted." }
      ],
      compare: { cols: ["", "useTransition", "useDeferredValue"], rows: [["Wraps", "The state update", "A value"], ["Needs the setter", "Yes", "No"], ["Pending flag", "`isPending`", "`value !== deferred`"]] },
      cheat: [
        "Urgent updates interrupt transitions",
        "Stale background work is discarded",
        "Yields only between components",
        "`useDeferredValue` + `memo` child",
        "`value !== deferred` = show stale hint",
        "Not a debounce: no fixed delay"
      ]
    },
    related: ["RENDER-013", "RENDER-018", "HOOKS-015", "PERF-013"]
  },

  "RENDER-015": {
    tldr: "`<StrictMode>` is a **development-only** checker. It renders components twice and runs effects mount → cleanup → mount, so impure renders and missing cleanups show up early. Production runs everything once.",
    analogy: { icon: "🧪", text: "A test kitchen that cooks every recipe twice. If the two dishes taste different, something in the recipe is unreliable. Customers (production) only get one dish." },
    visual: { type: "flow", title: "What Strict Mode does on mount (dev)", steps: [
      { label: "Render × 2", detail: "Component body, `useState`/`useMemo` initialisers and updaters run twice. Second log is dimmed (not hidden)." },
      { label: "Commit", detail: "DOM is updated once." },
      { label: "Effect setup", detail: "`useEffect` runs: e.g. connect to chat." },
      { label: "Simulated unmount", detail: "React runs the cleanup: disconnect." },
      { label: "Effect setup again", detail: "Connect again. If your cleanup is right, the user sees no difference." }
    ]},
    points: [
      "**Dev only.** `npm run build` output never double-invokes.",
      "Double render catches impure render code (mutations, randomness used as state).",
      "Mount → unmount → mount catches effects without cleanup (double subscriptions, leaking timers).",
      "React 19 also double-runs **ref callbacks** (setup → cleanup → setup).",
      "Fetching twice in dev is expected: add cleanup (`AbortController` or an `ignore` flag) or use a data library."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function ChatRoom({ roomId }) {
  console.log('render');
  useEffect(() => {
    console.log('✅ connect', roomId);
    return () => console.log('❌ disconnect', roomId);
  }, [roomId]);
  return <h2>Room: {roomId}</h2>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatRoom roomId="music" />
  </StrictMode>
);`, walk: [
      { lines: [14, 16], note: "Wrap the app (Vite's template already does this in `main.jsx`)." },
      { lines: [5], note: "Logs twice in dev; the second one is dimmed in the console." },
      { lines: [7, 8], note: "Dev: connect → disconnect → connect. Proves the cleanup works." }
    ]},
    output: "Dev: `render`, `render`, `✅ connect music`, `❌ disconnect music`, `✅ connect music`. Production: `render`, `✅ connect music`.",
    mistakes: [
      { bad: `useEffect(() => {\n  const id = setInterval(tick, 1000);\n}, []); // no cleanup`, good: `useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);`, why: "Strict Mode shows the timer running twice (clock ticks 2× speed). The fix is a cleanup, not removing Strict Mode." },
      { bad: `// Remove <StrictMode> to stop double fetches`, good: `useEffect(() => {\n  const ctrl = new AbortController();\n  fetch(url, { signal: ctrl.signal });\n  return () => ctrl.abort();\n}, [url]);`, why: "The double run reveals a real bug: the same race happens when props change fast. Clean up instead." }
    ],
    practice: [
      { level: "B", q: "Does Strict Mode affect production?", a: "No. It only runs extra checks in development." },
      { level: "I", q: "Your chat connects twice in dev. Is that a problem?", a: "Only if it stays connected twice. With a correct cleanup it connects, disconnects, and connects once more." },
      { level: "I", q: "What else runs twice besides the component body?", a: "`useState`/`useMemo`/`useReducer` initialisers and updater functions, effects (setup+cleanup+setup) and ref callbacks." },
      { level: "C", q: "Why simulate unmount/remount at all?", a: "React can remount components (Activity, Fast Refresh, back navigation). Effects must survive setup → cleanup → setup." }
    ],
    quiz: [
      { q: "Strict Mode double renders in...", options: ["Development and production", "Development only", "Production only"], answer: 1, why: "It's a dev-time checker." },
      { q: "Effect logs: connect, disconnect, connect. What does that mean?", options: ["A bug in React", "Strict Mode checking your cleanup", "The component crashed"], answer: 1, why: "Expected dev behaviour." },
      { q: "Best response to a doubled fetch in dev?", options: ["Remove Strict Mode", "Add cleanup/abort or use a data library", "Use a global flag"], answer: 1, why: "Fix the effect so it's safe to re-run." }
    ],
    rev: {
      sec30: "Strict Mode (dev only) double-invokes component bodies, initialisers and updaters, runs effects setup → cleanup → setup, and in React 19 does the same for ref callbacks. It surfaces impure renders and missing cleanups. Production is unaffected. Fix the code, don't remove Strict Mode.",
      interview: [
        { level: "basic", q: "What is Strict Mode?", a: "A dev-only wrapper that enables extra checks, like double rendering and re-running effects, to find bugs early." },
        { level: "intermediate", q: "Why does my `useEffect` run twice?", a: "Strict Mode in development mounts, unmounts and remounts to check your cleanup. It runs once in production." },
        { level: "advanced", q: "What bugs does the double render catch?", a: "Impure render logic: mutating props or globals, or side effects in render that give different results on each call." },
        { level: "tricky", q: "Can you use a `useRef` flag to stop the effect running twice?", a: "You can, but it hides the bug. The effect should be safe to set up, clean up and set up again." }
      ],
      cheat: [
        "Dev only, zero production cost",
        "Double: render, initialisers, updaters",
        "Effects: setup → cleanup → setup",
        "React 19: ref callbacks too",
        "Second render log is dimmed",
        "Fix with cleanups, don't remove StrictMode"
      ]
    },
    related: ["RENDER-003", "HOOKS-005", "ENV-004", "RENDER-004"]
  },

  "RENDER-016": {
    tldr: "React 17 batched updates only inside React event handlers. From React 18 (with `createRoot`), **automatic batching** groups updates everywhere: timeouts, promises, `fetch` callbacks and native events.",
    analogy: { icon: "📦", text: "An online shop that used to ship every item in its own box if you ordered by phone. Now every order, however it arrives, ships in one box." },
    visual: { type: "compare", title: "Two setState calls after `await fetch`", left: { label: "React 17 (`ReactDOM.render`)", tone: "bad", points: [
      "Click handler: batched → 1 render", "After `await`, `setTimeout`, native event: **not** batched", "2 setters = 2 renders, brief inconsistent UI", "Workaround: `unstable_batchedUpdates`"
    ]}, right: { label: "React 18+ (`createRoot`)", tone: "good", points: [
      "Batched everywhere by default", "After `await`: 2 setters = 1 render", "Timeouts, promises, native events too", "Opt out with `flushSync`"
    ]}},
    points: [
      "Automatic batching needs `createRoot` (React 18+). Legacy `ReactDOM.render` was removed in React 19.",
      "Batching is per **tick**: updates scheduled in the same synchronous run are grouped.",
      "Updates in **separate** events or separate ticks still render separately.",
      "`flushSync(() => setX(...))` forces an immediate render when you must read the DOM right away.",
      "Upgrading from 17 rarely breaks anything; it mostly removes extra renders."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Weather() {
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log('render');

  async function refresh() {
    setLoading(true);
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current=temperature_2m');
    const data = await res.json();
    // After await: React 17 = 2 renders here, React 18+ = 1
    setTemp(data.current.temperature_2m);
    setLoading(false);
  }

  return (
    <>
      <button onClick={refresh} disabled={loading}>Refresh</button>
      <p>{loading ? 'Loading…' : temp === null ? '—' : \`\${temp}°C\`}</p>
    </>
  );
}`, walk: [
      { lines: [9], note: "Before the `await`: one render shows Loading…" },
      { lines: [10, 11], note: "The `await` ends the click handler's synchronous run. The rest runs later in a promise." },
      { lines: [13, 14], note: "React 17 rendered after each setter (an extra render with the new temp but still loading). React 18+ batches into one render." },
      { lines: [6], note: "Count the logs: 2 per click in React 18+, 3 in React 17." }
    ]},
    output: "React 19: click Refresh → `render` (loading), then one `render` with the temperature, e.g. `14.2°C`.",
    mistakes: [
      { bad: `import { unstable_batchedUpdates } from 'react-dom';\nunstable_batchedUpdates(() => { setA(1); setB(2); });`, good: `setA(1);\nsetB(2); // batched automatically in React 18+`, why: "The manual wrapper is no longer needed with `createRoot`." }
    ],
    practice: [
      { level: "B", q: "In React 19, two setters inside `setTimeout`: how many renders?", a: "One. Automatic batching covers timeouts." },
      { level: "I", q: "What did React 17 do with two setters after an `await`?", a: "It rendered twice, once per setter, because batching only applied to React event handlers." },
      { level: "I", q: "Two separate clicks, one setter each. Batched together?", a: "No. Each click is a separate event and gets its own render." },
      { level: "C", q: "Scroll a chat to the newest message right after adding it. How in React 18+?", a: "Use `flushSync` so the DOM updates before you scroll.", code: `flushSync(() => setMessages(m => [...m, msg]));\nlistRef.current.lastElementChild.scrollIntoView();` }
    ],
    quiz: [
      { q: "React 18+ batches updates in...", options: ["Only React event handlers", "Handlers, timeouts, promises, native events", "Only async functions"], answer: 1, why: "Automatic batching applies everywhere with `createRoot`." },
      { q: "What enables automatic batching?", options: ["`ReactDOM.render`", "`createRoot`", "`<StrictMode>`"], answer: 1, why: "It's a feature of the concurrent root." },
      { q: "How do you opt out for one update?", options: ["`flushSync`", "`useEffect`", "`setTimeout`"], answer: 0, why: "`flushSync` renders and commits synchronously." }
    ],
    rev: {
      sec30: "React 17 batched only inside React event handlers; updates in timeouts, promises or native listeners each caused a render. React 18+ with `createRoot` batches all updates in the same tick automatically. `flushSync` opts out. React 19 removed `ReactDOM.render`, so batching is always automatic.",
      interview: [
        { level: "basic", q: "What is automatic batching?", a: "React 18+ grouping state updates into one render no matter where they happen: handlers, timeouts, promises or native events." },
        { level: "intermediate", q: "How did React 17 differ?", a: "It only batched inside React synthetic event handlers. After an `await` or in a `setTimeout`, each setter rendered separately." },
        { level: "advanced", q: "When would you use `flushSync`?", a: "When you must read or act on the updated DOM immediately, like scrolling to or focusing a just-rendered element. Use sparingly; it hurts performance." },
        { level: "tricky", q: "Are updates from two different clicks batched?", a: "No. React batches within one event/tick; separate user events are processed separately." }
      ],
      compare: { cols: ["", "React 17", "React 18+"], rows: [["Event handlers", "Batched", "Batched"], ["setTimeout / promises", "Not batched", "Batched"], ["Native listeners", "Not batched", "Batched"], ["Opt out", "n/a", "`flushSync`"]] },
      cheat: [
        "React 18+: batching everywhere",
        "Requires `createRoot`",
        "React 17: only inside React handlers",
        "Same tick → one render",
        "`flushSync` forces sync render",
        "`unstable_batchedUpdates` no longer needed"
      ]
    },
    related: ["RENDER-012", "STATE-019", "HOOKS-005", "RENDER-013"]
  },

  "RENDER-017": {
    tldr: "Hydration is React **attaching itself to HTML the server already sent**: it renders the same tree in the browser, matches it to the existing DOM and wires up event handlers, instead of rebuilding the page.",
    analogy: { icon: "🌱", text: "Instant noodles: the shape is there (server HTML), but you add water (JavaScript) to make it come alive. Add the wrong ingredient and it doesn't match the picture on the pack." },
    visual: { type: "flow", title: "Server HTML → interactive page", steps: [
      { label: "Server renders", detail: "React renders `<App />` to HTML on the server (framework or `renderToPipeableStream`)." },
      { label: "Browser shows HTML", detail: "The user sees content fast, but buttons don't work yet." },
      { label: "JS loads", detail: "The client bundle downloads and runs `hydrateRoot(root, <App />)`." },
      { label: "Match & attach", detail: "React renders in memory, walks the existing DOM and attaches listeners. No DOM is recreated." },
      { label: "Interactive", detail: "Clicks work. If something didn't match, React reports it and re-renders that part on the client." }
    ]},
    points: [
      "Use `hydrateRoot` (not `createRoot`) when the HTML came from React on the server.",
      "The first client render must produce **exactly** the server HTML.",
      "Mismatch causes: `Date.now()`, `Math.random()`, `typeof window` checks, locale formatting, invalid nesting like `<div>` inside `<p>`.",
      "Fix: render the same on both, then set client-only values in `useEffect`. For unavoidable text (timestamps) use `suppressHydrationWarning`.",
      "React 19 logs one clear diff for a mismatch and falls back to client rendering for that part. Usually set up by a framework (Next.js, React Router framework mode)."
    ],
    code: { file: "entry.client.jsx", lang: "jsx", src: `// Simplified: a framework usually writes this file for you
import { hydrateRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';

function LastUpdated() {
  // ❌ new Date() differs between server and browser → mismatch
  // return <p>Updated {new Date().toLocaleTimeString()}</p>;

  // ✅ render the same on both, fill in on the client
  const [time, setTime] = useState(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <p>Updated {time ?? '…'}</p>;
}

function Weather() {
  const [temp, setTemp] = useState(18);
  return (
    <>
      <button onClick={() => setTemp(t => t + 1)}>{temp}°C</button>
      <LastUpdated />
    </>
  );
}

hydrateRoot(document.getElementById('root'), <Weather />);`, walk: [
      { lines: [25], note: "Attach to the server HTML inside `#root` instead of building new DOM." },
      { lines: [6, 7], note: "The server's clock and the browser's clock differ, so the text wouldn't match." },
      { lines: [10, 11, 12], note: "Server and first client render both show `…`. After hydration the effect fills in the real time." },
      { lines: [19], note: "The button was visible from the start; after hydration its `onClick` works." }
    ]},
    output: "Page shows `18°C` and `Updated …` instantly from HTML, then `Updated 10:42:07` once hydrated. Clicking the button works after JS loads.",
    mistakes: [
      { bad: `function Greeting() {\n  const isClient = typeof window !== 'undefined';\n  return <p>{isClient ? 'Browser' : 'Server'}</p>;\n}`, good: `function Greeting() {\n  const [isClient, setIsClient] = useState(false);\n  useEffect(() => setIsClient(true), []);\n  return <p>{isClient ? 'Browser' : 'Server'}</p>;\n}`, why: "Branching on `window` during render gives different output on server and client. Switch after hydration with an effect." },
      { bad: `<p>Price: <div>£4</div></p>`, good: `<p>Price: <span>£4</span></p>`, why: "Invalid HTML nesting is \"fixed\" by the browser's parser, so the DOM no longer matches React's tree." }
    ],
    practice: [
      { level: "B", q: "What does hydration add to server-rendered HTML?", a: "Event handlers and React's state/fiber tree, making the static page interactive." },
      { level: "I", q: "`createRoot` or `hydrateRoot` for a Vite SPA with an empty `#root`?", a: "`createRoot`. Hydration only applies when the HTML was rendered by React on the server." },
      { level: "I", q: "Show a user's local timezone without a mismatch.", a: "Render a placeholder, then set the formatted time in `useEffect` after hydration." },
      { level: "C", q: "Why can a big page feel \"frozen\" even though it's visible?", a: "The HTML is shown before JS loads and hydrates. Until then clicks do nothing. Streaming SSR with Suspense lets parts hydrate early." }
    ],
    quiz: [
      { q: "Which causes a hydration mismatch?", options: ["Rendering `{user.name}` from the same data", "Rendering `{Math.random()}`", "Using `useEffect`"], answer: 1, why: "Random values differ between server and client renders." },
      { q: "During hydration, does React recreate the DOM?", options: ["Yes, always", "No, it reuses the existing nodes"], answer: 1, why: "It matches its tree to the server HTML and attaches listeners." },
      { q: "Where should browser-only values like `localStorage` be read?", options: ["In render", "In `useEffect` after hydration", "In the server HTML"], answer: 1, why: "Effects don't run on the server, so the first render stays identical." }
    ],
    rev: {
      sec30: "Hydration (`hydrateRoot`) makes server HTML interactive: React renders in the browser, matches the existing DOM and attaches events without recreating nodes. The first client render must equal the server output. Mismatches (dates, random values, `window` checks, bad nesting) are fixed by moving client-only values into effects or `suppressHydrationWarning` for unavoidable text.",
      interview: [
        { level: "basic", q: "What is hydration?", a: "Attaching React to server-rendered HTML: reusing the DOM and adding event handlers so the page becomes interactive." },
        { level: "intermediate", q: "What causes hydration errors?", a: "The client's first render differs from the server HTML: time, randomness, browser-only checks, locale differences or invalid HTML nesting." },
        { level: "advanced", q: "What does React do on a mismatch?", a: "In React 19 it logs a single error with a diff and client-renders the affected part up to the nearest Suspense boundary, which costs performance." },
        { level: "tricky", q: "Is `suppressHydrationWarning` a general fix?", a: "No. It only works one level deep, for unavoidable cases like timestamps. Real fixes make both renders identical." }
      ],
      cheat: [
        "`hydrateRoot` = attach to server HTML",
        "First client render must match the server",
        "No `Date.now()`, `Math.random()`, `window` checks in render",
        "Client-only values → `useEffect`",
        "`suppressHydrationWarning`: text, one level, last resort",
        "Frameworks (Next.js, RR framework mode) handle setup"
      ]
    },
    related: ["ADV-019", "ADV-018", "NEXT-007", "RENDER-001"]
  },

  "RENDER-018": {
    tldr: "React tags every update with a priority called a **lane**. Urgent lanes (clicks, typing) are rendered first; lower lanes (data arrival, transitions) wait and can be interrupted. Same-lane updates are batched together.",
    analogy: { icon: "🛒", text: "Supermarket checkouts: an express lane for one item, a normal lane for full trolleys, and online orders packed when staff are free. Everyone gets served, urgent first." },
    visual: { type: "layers", title: "Update priorities (highest first)", items: [
      { label: "Sync lane", detail: "Discrete events: click, keydown, input change. Rendered right away, can't be interrupted." },
      { label: "Continuous input", detail: "Mouse move, scroll, drag events." },
      { label: "Default lane", detail: "Updates outside events: `setTimeout`, fetch results, subscriptions." },
      { label: "Transition lanes", detail: "`startTransition` / `useTransition` / `useDeferredValue`. Interruptible." },
      { label: "Idle / offscreen", detail: "Lowest: hidden content such as `<Activity mode=\"hidden\">`." }
    ]},
    points: [
      "**Lanes** are bits in a number, so React can quickly combine and compare sets of priorities.",
      "React picks the highest-priority pending lanes and renders those updates together.",
      "A higher lane arriving mid-render **interrupts** lower lane work, which restarts later.",
      "React's scheduler works in ~5ms slices and yields to the browser between them.",
      "You don't set lanes directly. You choose priority by **where** you update (event vs timer) and by using transitions."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState, useTransition, useEffect } from 'react';

export default function Playlist({ songs }) {
  const [query, setQuery] = useState('');        // Sync lane (typing)
  const [filter, setFilter] = useState('');      // Transition lane
  const [likes, setLikes] = useState(0);         // Default lane (timer)
  const [, startTransition] = useTransition();

  useEffect(() => {
    const id = setTimeout(() => setLikes(42), 1000); // not a user event
    return () => clearTimeout(id);
  }, []);

  function onType(e) {
    setQuery(e.target.value);                        // urgent: render first
    startTransition(() => setFilter(e.target.value)); // can wait, can be interrupted
  }

  const shown = songs.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
  return (
    <>
      <input value={query} onChange={onType} placeholder="Filter songs" />
      <p>❤️ {likes}</p>
      <ul>{shown.map(s => <li key={s}>{s}</li>)}</ul>
    </>
  );
}`, walk: [
      { lines: [15], note: "Inside a discrete input event → **Sync lane**. The textbox updates immediately." },
      { lines: [16], note: "Wrapped in a transition → **Transition lane**. Rendered after urgent work, interruptible." },
      { lines: [10], note: "From a timer, outside any event → **Default lane**." },
      { lines: [19], note: "The filtered list uses the transition value, so slow filtering never blocks typing." }
    ]},
    output: "Typing updates the box instantly; the list follows a moment later. After 1s the likes show ❤️ 42.",
    mistakes: [
      { bad: `// Expecting setTimeout to make an update "low priority"\nsetTimeout(() => setResults(big), 0);`, good: `startTransition(() => setResults(big));`, why: "A timeout only delays the update; it still renders as a blocking default-lane update. Transitions are what make it interruptible." }
    ],
    practice: [
      { level: "B", q: "Which gets rendered first: a click update or a transition update?", a: "The click. It's in the sync lane." },
      { level: "I", q: "What lane does a `setState` after `await fetch()` get?", a: "Default lane, because it's not inside a user event (unless wrapped in a transition)." },
      { level: "I", q: "Why are lanes stored as bitmasks?", a: "Bitwise operations make it cheap to merge, check and remove groups of priorities." },
      { level: "C", q: "Two transitions are pending and the user clicks. What happens?", a: "The click (sync lane) renders and commits first. The transition work restarts afterwards with the latest state." }
    ],
    quiz: [
      { q: "A lane is...", options: ["A thread", "A priority tag on an update", "A type of hook"], answer: 1, why: "Lanes group updates by priority." },
      { q: "Can you assign a lane number yourself?", options: ["Yes, via `setState(v, lane)`", "No, React infers it"], answer: 1, why: "Priority comes from context (event type) and APIs like `startTransition`." },
      { q: "Which is lowest priority here?", options: ["Keydown", "Fetch result", "Transition"], answer: 2, why: "Transition lanes sit below default and sync lanes." }
    ],
    rev: {
      sec30: "Every update gets a lane (a priority bit). Sync lane for discrete events, continuous for drag/scroll, default for timers and fetches, transition lanes for `startTransition`, idle/offscreen lowest. React renders the highest pending lanes first, batches same-lane updates and interrupts lower-lane renders. The scheduler yields every ~5ms.",
      interview: [
        { level: "basic", q: "What does React scheduling do?", a: "Decides which pending updates to render first, so urgent interactions aren't blocked by less important work." },
        { level: "intermediate", q: "What are lanes?", a: "Bitmask priorities attached to updates. React processes the highest-priority lanes first and batches updates in the same lane." },
        { level: "advanced", q: "How does an update's lane get chosen?", a: "From the current event priority (discrete, continuous or default) unless it's inside `startTransition`, which assigns a transition lane." },
        { level: "tricky", q: "Does a transition update ever get dropped?", a: "Intermediate renders can be discarded, but the final state always renders. Starvation is prevented: lanes waiting too long are expired and rendered synchronously." }
      ],
      cheat: [
        "Lane = priority bit on an update",
        "Sync > continuous > default > transition > idle",
        "Same lane → batched",
        "Higher lane interrupts lower-lane render",
        "Priority comes from event type or `startTransition`",
        "Scheduler yields every ~5ms"
      ]
    },
    related: ["RENDER-013", "RENDER-014", "RENDER-007", "HOOKS-014"]
  },

  "RENDER-019": {
    tldr: "When a component re-renders, it's always one of four reasons: its **state** changed, its **parent** rendered, a **context** it reads changed, or a **hook** it uses changed internally. Find which one before optimising.",
    analogy: { icon: "🕵️", text: "A detective with four suspects. Before changing anything, check who actually did it: the component itself, its parent, the shared context or a hook." },
    visual: { type: "flow", title: "Diagnosis checklist", steps: [
      { label: "Measure", detail: "React DevTools Profiler → settings → \"Record why each component rendered\"." },
      { label: "1. State?", detail: "Did this component's own `useState`/`useReducer` change?" },
      { label: "2. Parent?", detail: "Did the parent render? Children render with it, props changed or not." },
      { label: "3. Context?", detail: "Did a Provider `value` this component reads get a new value or object?" },
      { label: "4. Hook?", detail: "Did a custom hook's internal state or context change (e.g. `useOnlineStatus`)?" }
    ]},
    points: [
      "\"Props changed\" isn't a root cause; it's the parent rendering. Ask why the **parent** rendered.",
      "A custom hook's state is the component's state: if the hook updates, the component renders.",
      "A new object or function as a Provider `value` re-renders **every** consumer.",
      "React DevTools **Highlight updates** flashes components as they render.",
      "Re-renders are normal. Only fix ones that are **slow** or cause visible lag."
    ],
    code: { file: "ChatBox.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}

function SendButton() {
  const online = useOnlineStatus(); // reason 4: hook state
  console.log('SendButton render');
  return <button disabled={!online}>{online ? 'Send' : 'Offline'}</button>;
}

export default function ChatBox() {
  const [text, setText] = useState(''); // reason 1: own state
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SendButton /> {/* reason 2: parent rendered */}
    </>
  );
}`, walk: [
      { lines: [24, 27], note: "**State**: every keystroke updates `ChatBox`'s own state." },
      { lines: [28], note: "**Parent**: `SendButton` has no props, but still renders on every keystroke." },
      { lines: [4, 6], note: "**Hook**: going offline updates state inside the custom hook..." },
      { lines: [18], note: "...which belongs to `SendButton`, so it re-renders on its own." }
    ]},
    output: "Type \"hi\" → `SendButton render` logs twice, once per keystroke (parent; dev Strict Mode doubles each log). Turn Wi-Fi off → logs once more (hook).",
    mistakes: [
      { bad: `<CartContext value={{ items, add }}>`, good: `const value = useMemo(() => ({ items, add }), [items, add]);\n<CartContext value={value}>`, why: "A new object each render changes the context value, so every consumer renders even if `items` didn't change." }
    ],
    practice: [
      { level: "B", q: "Name the four reasons a component re-renders.", a: "Own state change, parent render, context change, hook change." },
      { level: "I", q: "How do you make React DevTools tell you why something rendered?", a: "Profiler tab → gear icon → enable \"Record why each component rendered while profiling\", then record." },
      { level: "I", q: "Stop `SendButton` rendering on each keystroke without `memo`.", a: "Move the text state into its own `MessageInput` component so `ChatBox` doesn't re-render.", code: `function MessageInput() {\n  const [text, setText] = useState('');\n  return <input value={text} onChange={e => setText(e.target.value)} />;\n}` },
      { level: "C", q: "DevTools says \"Hook 3 changed\". What does that mean?", a: "The third hook call in that component (possibly inside a custom hook) produced a new value, e.g. its state or context changed." }
    ],
    quiz: [
      { q: "A child with no props re-renders. Most likely reason?", options: ["Its props changed", "Its parent rendered", "The DOM changed"], answer: 1, why: "Children render with their parent by default." },
      { q: "A custom hook updates its internal state. Who re-renders?", options: ["Nobody", "The component that called the hook", "The whole app"], answer: 1, why: "Hook state is part of the calling component's state." },
      { q: "When should you fix a re-render?", options: ["Always", "When it's measured to be slow", "Never"], answer: 1, why: "Most re-renders are cheap; optimise what the Profiler shows is slow." }
    ],
    rev: {
      sec30: "Four reasons: **state**, **parent render**, **context change**, **hook change**. \"Props changed\" means the parent rendered. Diagnose with the React DevTools Profiler (\"Record why each component rendered\") and Highlight updates, then fix only renders that are measurably slow.",
      interview: [
        { level: "basic", q: "Why does a component re-render?", a: "Its state changed, its parent rendered, a context it uses changed, or a hook it calls changed." },
        { level: "intermediate", q: "How do you find out why a component re-rendered?", a: "React DevTools Profiler with \"Record why each component rendered\" shows the reason per commit, such as \"Hook 2 changed\" or \"Parent rendered\"." },
        { level: "advanced", q: "Why can a context consumer re-render even if the data looks the same?", a: "The Provider got a new object or function reference each render, so `Object.is` sees a change. Memoize the value." },
        { level: "tricky", q: "Is a re-render with identical output a problem?", a: "Usually not. It skips DOM work; it only matters if the render itself is expensive or happens very often." }
      ],
      cheat: [
        "4 reasons: state, parent, context, hook",
        "Props change = parent rendered",
        "Hook state = component state",
        "New Provider object → all consumers render",
        "Profiler: \"Record why each component rendered\"",
        "Measure first, then fix slow ones only"
      ]
    },
    related: ["RENDER-002", "RENDER-020", "PERF-002", "PERF-003"]
  },

  "RENDER-020": {
    tldr: "Before reaching for `memo`, change the structure: **keep state close** to where it's used, and **pass slow content as `children`** so it isn't re-created. Use `memo` (or let React Compiler do it) for what's left.",
    analogy: { icon: "🎵", text: "A playlist app: changing the volume shouldn't reload the whole song library. Put the volume knob in its own little box so only that box changes." },
    visual: { type: "flow", title: "Try these in order", steps: [
      { label: "Measure", detail: "Profile first. Only fix renders that are slow or frequent." },
      { label: "Colocate state", detail: "Move state down into the small component that uses it (search box, theme toggle)." },
      { label: "Children as props", detail: "A wrapper with state receives `children` from above, so those children don't re-render." },
      { label: "memo", detail: "`memo(Component)` skips renders when props are equal. Keep props stable (`useMemo`, `useCallback`)." },
      { label: "React Compiler", detail: "Auto-memoizes components and values at build time. Often removes the need for manual memo." }
    ]},
    points: [
      "**Colocation**: state lives in the lowest component that needs it; fewer components re-render on change.",
      "**Children as props**: `<Panel><SlowList /></Panel>` → `SlowList` is created by the parent, so `Panel`'s state changes don't re-render it.",
      "`memo` compares props with `Object.is`; a new object or arrow function each render breaks it.",
      "Context consumers still re-render through `memo` when the context changes.",
      "Don't memo everything: comparison has a cost and adds noise. Measure first."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState, memo } from 'react';

function SlowRecipeList() {
  console.log('SlowRecipeList render'); // pretend this is expensive
  return <ul><li>Pancakes</li><li>Curry</li></ul>;
}

// 1. Colocate: the search state lives only where it's used
function SearchBox() {
  const [q, setQ] = useState('');
  return <input value={q} onChange={e => setQ(e.target.value)} />;
}

// 2. Children as props: content made by the parent isn't re-rendered
function ThemePanel({ children }) {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? 'dark' : ''}>
      <button onClick={() => setDark(!dark)}>Theme</button>
      {children}
    </div>
  );
}

// 3. memo: skip when props are the same
const Cart = memo(function Cart({ count }) {
  console.log('Cart render');
  return <p>🛒 {count}</p>;
});

export default function App() {
  const [likes, setLikes] = useState(0);
  return (
    <>
      <button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>
      <Cart count={2} />
      <ThemePanel>
        <SearchBox />
        <SlowRecipeList />
      </ThemePanel>
    </>
  );
}`, walk: [
      { lines: [9, 10, 11], note: "Typing re-renders only `SearchBox`, not the recipes." },
      { lines: [15, 16, 20], note: "Toggling theme re-renders `ThemePanel`, but `children` are the same elements from `App`, so `SlowRecipeList` is skipped." },
      { lines: [26], note: "`memo`: when `App` re-renders for ❤️, `Cart` sees `count` still 2 and skips." },
      { lines: [35, 39], note: "But ❤️ does re-render `SlowRecipeList`: `App` creates it fresh. Memo it too if it's really slow." }
    ]},
    output: "Type in search → no logs. Toggle theme → no logs. Click ❤️ → `SlowRecipeList render` only (Cart skipped).",
    mistakes: [
      { bad: `const Cart = memo(CartView);\n<Cart items={items} onAdd={() => add(id)} />`, good: `const onAdd = useCallback(() => add(id), [id]);\n<Cart items={items} onAdd={onAdd} />`, why: "A new arrow function every render is a changed prop, so `memo` never skips. Stabilise it (or use React Compiler)." },
      { bad: `function App() {\n  const [q, setQ] = useState(''); // used only by the search box\n  return <><Search q={q} setQ={setQ} /><Recipes /></>;\n}`, good: `function App() {\n  return <><Search /><Recipes /></>; // Search owns q\n}`, why: "State held too high re-renders everything below it on each keystroke." }
    ],
    practice: [
      { level: "B", q: "What is state colocation?", a: "Keeping state in the lowest component that needs it, so changes re-render as little as possible." },
      { level: "I", q: "Why doesn't `SlowRecipeList` re-render when `ThemePanel`'s state changes?", a: "It was created by `App` and passed in as `children`. `ThemePanel` re-rendering doesn't recreate that element." },
      { level: "I", q: "`memo(Item)` still re-renders. List two likely causes.", a: "An inline object/array/function prop that's new every render, or a context it reads changed." },
      { level: "C", q: "Stop ❤️ from re-rendering `SlowRecipeList`.", a: "Wrap it in `memo` (no props, so it always skips), or move the likes state into its own `LikeButton` component.", code: `function LikeButton() {\n  const [likes, setLikes] = useState(0);\n  return <button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>;\n}` }
    ],
    quiz: [
      { q: "First step before optimising re-renders?", options: ["Add `memo` everywhere", "Measure with the Profiler", "Use `useCallback` for every function"], answer: 1, why: "Fix only what's actually slow." },
      { q: "`<Panel><Slow /></Panel>`: Panel's state changes. Does `Slow` render?", options: ["Yes", "No"], answer: 1, why: "`children` is the same element created by the parent." },
      { q: "`memo(Card)` with `style={{ color: 'red' }}` prop. Skips renders?", options: ["Yes", "No, the object is new each render"], answer: 1, why: "`Object.is` sees a new object every time." }
    ],
    rev: {
      sec30: "Prevent unnecessary renders by structure first: **colocate state** in the smallest component that uses it, and **pass content as `children`** through stateful wrappers. Then use `memo` with stable props (`useMemo`/`useCallback`) for measured slow components. React Compiler can auto-memoize. Always profile first.",
      interview: [
        { level: "basic", q: "How do you prevent unnecessary re-renders?", a: "Move state down to where it's used, pass slow subtrees as `children`, and use `memo` with stable props for components that are slow." },
        { level: "intermediate", q: "Why does the children-as-props pattern work?", a: "The children elements are created by the parent; when the wrapper's state changes, React sees the same element references and skips them." },
        { level: "advanced", q: "When does `memo` fail to help?", a: "When props are new references each render (inline objects, arrays, arrow functions) or when a consumed context changes." },
        { level: "tricky", q: "Should you wrap every component in `memo`?", a: "No. It adds comparison cost and complexity; structural fixes or React Compiler are usually better. Memo what profiling shows is slow." }
      ],
      compare: { cols: ["", "Colocation", "Children as props", "memo"], rows: [["Idea", "State moves down", "Content moves up", "Skip if props equal"], ["Code change", "Small refactor", "Small refactor", "Wrapper + stable props"], ["Breaks when", "State needed higher", "Content needs wrapper state", "Props are new refs"]] },
      cheat: [
        "Measure first (Profiler)",
        "Colocate state: lowest component that needs it",
        "Pass slow content as `children`",
        "`memo` + stable props (`useMemo`/`useCallback`)",
        "Context changes bypass `memo`",
        "React Compiler can auto-memoize"
      ]
    },
    related: ["RENDER-019", "PERF-004", "PERF-019", "ADV-001"]
  },
};
