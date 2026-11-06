export default {
  "PERF-001": {
    tldr: "Performance has three faces: how fast the page **loads** (load), how fast it **reacts** to clicks and typing (runtime), and how fast it **feels** (perceived). Measure first, then fix the slowest one.",
    analogy: { icon: "☕", text: "A coffee shop: how long until the door opens (load), how long each order takes (runtime), and whether the barista says “coming right up!” so the wait feels short (perceived)." },
    visual: { type: "layers", title: "Three kinds of fast", items: [
      { label: "Perceived", detail: "Skeletons, instant feedback, optimistic UI. The wait feels shorter." },
      { label: "Runtime", detail: "Clicks and typing respond fast. Measured by **INP** and Profiler ms." },
      { label: "Load", detail: "First screen appears fast. Measured by **LCP**, bundle KB, request count." }
    ]},
    points: [
      "**Load** performance: bytes downloaded, requests, time to first meaningful paint (LCP).",
      "**Runtime** performance: how long a click or keystroke takes to update the screen (INP, render ms).",
      "**Perceived** performance: spinners, skeletons and instant feedback make the same wait feel shorter.",
      "Rule of thumb: a response under **100 ms** feels instant; one frame at 60 fps is **16 ms**.",
      "**Measure before you optimise.** Guessing wastes time and adds complexity (`memo` everywhere is not free)."
    ],
    code: { file: "measure.js", lang: "js", src: `// 1. Load: how long until the largest content painted?
new PerformanceObserver((list) => {
  const last = list.getEntries().at(-1);
  console.log('LCP', Math.round(last.startTime), 'ms');
}).observe({ type: 'largest-contentful-paint', buffered: true });

// 2. Runtime: time a slow piece of work
performance.mark('filter-start');
const results = products.filter((p) => p.name.includes(query));
performance.mark('filter-end');
const m = performance.measure('filter', 'filter-start', 'filter-end');
console.log('filter took', m.duration.toFixed(1), 'ms');

// 3. Perceived: show feedback immediately, load later
button.textContent = 'Adding…';`, walk: [
      { lines: [2, 5], note: "A `PerformanceObserver` reports **LCP** (load) as the browser measures it. `buffered: true` includes entries from before the code ran." },
      { lines: [8, 12], note: "`performance.mark` / `measure` time any block of runtime work, like a `Stopwatch` in .NET." },
      { lines: [15], note: "Perceived speed: change the UI at once, even before the real work finishes." }
    ]},
    output: "Console: “LCP 2840 ms” then “filter took 48.3 ms”. Those two numbers are your baseline: fix, re-measure, compare.",
    mistakes: [
      { bad: `// "It feels slow" → wrap every component in memo()`, good: `// Record a Profiler session or Lighthouse run first,\n// then fix the slowest thing it shows`, why: "Without a number you can't tell if a change helped. Most slowness comes from one or two hot spots." },
      { bad: `// Test speed only on a fast laptop in dev mode`, good: `// npm run build && npm run preview\n// + DevTools CPU 4x slowdown, Fast 4G`, why: "Dev builds are slower (extra checks, Strict Mode double render) and your laptop is faster than users' phones." }
    ],
    practice: [
      { level: "B", q: "Classify: a 2 MB bundle, a laggy search box, a blank screen while loading.", a: "Load, runtime, perceived (a skeleton would help the blank screen)." },
      { level: "I", q: "Time how long sorting a 5,000-item playlist takes.", a: "Wrap the sort in `performance.mark` and `performance.measure`, log `duration`." },
      { level: "I", q: "Why test with `npm run build && npm run preview` instead of `npm run dev`?", a: "Production builds are minified and skip dev-only checks; dev numbers are misleading." },
      { level: "C", q: "A page loads in 1 s but the Add to cart button takes 400 ms to respond. Which metric and which tool?", a: "Runtime: INP. Use the React Profiler / Chrome Performance panel to find the slow render." }
    ],
    quiz: [
      { q: "A search box lags while typing. Which kind of performance is it?", options: ["Load", "Runtime", "Perceived only", "Network"], answer: 1, why: "It's about responding to input after the page loaded." },
      { q: "What should you do first when an app feels slow?", options: ["Add `memo` everywhere", "Measure to find the slowest part", "Rewrite in another framework", "Upgrade the server"], answer: 1, why: "Measure, fix the hot spot, measure again." },
      { q: "A skeleton screen makes data arrive faster.", options: ["True", "False"], answer: 1, why: "It doesn't change load time; it improves **perceived** performance." }
    ],
    rev: {
      sec30: "Load performance is how fast the first screen appears (bundle size, requests, LCP). Runtime performance is how fast interactions respond (INP, render time). Perceived performance is how fast it feels (skeletons, instant feedback). Always measure in a production build on a throttled device, fix the biggest problem, then re-measure.",
      interview: [
        { level: "basic", q: "What's the difference between load and runtime performance?", a: "Load is how quickly the app becomes visible and usable; runtime is how quickly it responds to interactions after that." },
        { level: "intermediate", q: "What is perceived performance? Give an example.", a: "How fast the app feels. Skeletons, optimistic updates and instant button feedback make waits feel shorter without changing the real time." },
        { level: "advanced", q: "How do you approach a performance problem?", a: "Reproduce in a production build with CPU/network throttling, measure (Profiler, Lighthouse, Web Vitals), find the biggest hot spot, fix it, and measure again." },
        { level: "tricky", q: "Why are numbers from `npm run dev` misleading?", a: "Dev builds include extra warnings, unminified code and Strict Mode double renders, so they're slower and shaped differently from production." }
      ],
      compare: { cols: ["", "Load", "Runtime", "Perceived"], rows: [
        ["Question", "How fast does it appear?", "How fast does it respond?", "How fast does it feel?"],
        ["Metric", "LCP, bundle KB", "INP, render ms", "User feedback"],
        ["Typical fix", "Code splitting, images", "memo, virtualization", "Skeletons, optimistic UI"]
      ]},
      cheat: [
        "Load = first screen; runtime = interactions; perceived = feeling",
        "Under 100 ms feels instant; one 60 fps frame = 16 ms",
        "Measure in `vite build` + `vite preview`, not dev",
        "Throttle CPU and network in DevTools to mimic phones",
        "Fix the biggest hot spot first, then re-measure",
        "`performance.mark` / `measure` time any block of code"
      ]
    },
    related: ["PERF-002", "PERF-020", "RENDER-019"]
  },

  "PERF-002": {
    tldr: "The React Profiler records what rendered, why, and how long it took. Its **flame graph** shows each commit as bars: wide bars are slow components, grey bars didn't render.",
    analogy: { icon: "🎥", text: "A slow-motion replay of a football match. You pause on each moment (commit) and see exactly which player (component) moved and for how long." },
    visual: { type: "flow", title: "A Profiler session", steps: [
      { label: "Record", detail: "React DevTools → **Profiler** tab → press the blue record button." },
      { label: "Interact", detail: "Do the slow thing: type in the search box, add to cart." },
      { label: "Stop", detail: "Stop recording. The bar chart at the top lists every **commit**." },
      { label: "Pick a commit", detail: "Tall/yellow commit bars are slow. Click one to open its flame graph." },
      { label: "Read the graph", detail: "Width = render time. Yellow = slow, blue = fast, grey = did not render." }
    ]},
    points: [
      "One **commit** = one time React updated the DOM. Each has its own flame graph.",
      "**Flame graph**: tree of components; bar width is render time, colour shows slow (yellow) vs fast (blue/green).",
      "**Ranked** view sorts components by time, slowest at the top: quickest way to find the hot spot.",
      "Turn on ⚙️ **“Record why each component rendered”** to see “props changed: onAdd”, “hook 2 changed”, etc.",
      "The `<Profiler id onRender>` component measures in code; React 19.2 also adds **React tracks** to the Chrome Performance panel."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { Profiler } from 'react';
import ProductList from './ProductList';

function onRender(id, phase, actualDuration, baseDuration) {
  console.log(
    \`\${id} \${phase}: \${actualDuration.toFixed(1)} ms\`,
    \`(without memo: \${baseDuration.toFixed(1)} ms)\`
  );
}

export default function App() {
  return (
    <Profiler id="ProductList" onRender={onRender}>
      <ProductList />
    </Profiler>
  );
}`, walk: [
      { lines: [1], note: "`Profiler` is built into React; no install needed." },
      { lines: [4], note: "`phase` is `\"mount\"`, `\"update\"` or `\"nested-update\"`. `actualDuration` is the time spent rendering this commit." },
      { lines: [7], note: "`baseDuration` estimates a full re-render with no memoisation: compare the two to see what memo saves." },
      { lines: [13, 15], note: "Wrap only the part you want to measure. Profiling adds a little overhead." }
    ]},
    output: "Console after one keystroke: “ProductList update: 42.7 ms (without memo: 45.1 ms)”. After fixing: “ProductList update: 3.2 ms”.",
    mistakes: [
      { bad: `// Profile the dev server and report 42 ms as the real cost`, good: `// Use dev to find WHICH component is slow;\n// confirm real ms with a production profiling build`, why: "Dev is slower and Strict Mode doubles renders. Compare relative widths in dev; use a profiling build for absolute numbers." },
      { bad: `<Profiler onRender={log}>\n  <App />\n</Profiler>`, good: `<Profiler id="App" onRender={log}>\n  <App />\n</Profiler>`, why: "`id` is required; it tells you which tree the measurement belongs to." }
    ],
    practice: [
      { level: "B", q: "Record typing one letter in a search box. How many commits appear?", a: "Usually one per keystroke (more if effects set state after render)." },
      { level: "I", q: "Which Profiler view shows the slowest component first?", a: "The **Ranked** chart." },
      { level: "I", q: "Log only updates slower than 16 ms.", a: "Check `actualDuration` in `onRender`.", code: `function onRender(id, phase, ms) {\n  if (ms > 16) console.warn(id, phase, ms.toFixed(1));\n}` },
      { level: "C", q: "Grey bars fill most of the graph but one wide yellow bar remains. What does that tell you?", a: "Most of the tree was skipped; one component is genuinely expensive. Optimise its work (useMemo, virtualization), not its re-renders." }
    ],
    quiz: [
      { q: "In a flame graph, what does a grey bar mean?", options: ["It errored", "It did not render in this commit", "It is the slowest", "It is a Server Component"], answer: 1, why: "Grey = skipped this commit." },
      { q: "What does bar width represent?", options: ["Number of props", "Render time", "DOM nodes created", "Bundle size"], answer: 1, why: "Wider bar = more time rendering that component (and its children)." },
      { q: "Which setting shows WHY a component rendered?", options: ["Highlight updates", "Record why each component rendered while profiling", "Strict Mode", "Hide host components"], answer: 1, why: "It records “props changed”, “state changed”, “parent rendered”." }
    ],
    rev: {
      sec30: "React DevTools Profiler records commits. Each commit has a flame graph: bar width = render time, yellow = slow, grey = not rendered. The Ranked view lists the slowest components. Enable “record why each component rendered”. In code, `<Profiler id onRender>` gives `actualDuration` and `baseDuration`. Use a production profiling build for real numbers.",
      interview: [
        { level: "basic", q: "What is the React Profiler used for?", a: "To record renders during an interaction and see which components rendered, why, and how long each took." },
        { level: "intermediate", q: "What's the difference between `actualDuration` and `baseDuration`?", a: "`actualDuration` is time spent rendering this commit; `baseDuration` estimates rendering the whole subtree without memoisation. A big gap means memo is working." },
        { level: "advanced", q: "How do you profile in production?", a: "Use React's profiling build (alias `react-dom/client` to `react-dom/profiling`) so `Profiler` and DevTools timings work in a minified build." },
        { level: "tricky", q: "Why might the Profiler show double renders in dev?", a: "Strict Mode renders components twice in development to catch impure code; production renders once." }
      ],
      cheat: [
        "DevTools → Profiler → record → interact → stop",
        "One commit = one DOM update; each has a flame graph",
        "Wide/yellow = slow, grey = didn't render",
        "Ranked view = slowest first",
        "Enable “record why each component rendered”",
        "`<Profiler id onRender>` measures in code",
        "Dev numbers are inflated; use a profiling build for real ms"
      ]
    },
    related: ["PERF-003", "PERF-001", "RENDER-001"]
  },

  "PERF-003": {
    tldr: "A wasted render is when a component renders but produces the **same output**. Find them with the Profiler's “why did this render” and DevTools **highlight updates**, then fix the cause.",
    analogy: { icon: "🔔", text: "A waiter who walks to every table each time one person orders. Most trips change nothing. You want only the table that ordered to get a visit." },
    visual: { type: "tree", title: "Typing in search re-renders everything", root: { label: "App", note: "query state lives here", children: [
      { label: "SearchBox", note: "changed: needed" },
      { label: "Header", note: "same output: wasted" },
      { label: "ProductList", note: "same output: wasted", children: [
        { label: "ProductCard ×500", note: "wasted ×500" }
      ]},
      { label: "Footer", note: "same output: wasted" }
    ]}},
    points: [
      "React DevTools ⚙️ → **“Highlight updates when components render”**: boxes flash around every component that renders.",
      "In the Profiler, enable **record why** and click a component: “The parent component rendered” with no prop changes = likely wasted.",
      "Common causes: state placed **too high**, new object/array/function props each render, one big context value.",
      "First fix: **move state down** (colocation) or pass components as `children`; only then reach for `memo`.",
      "Wasted renders only matter when they're **slow**. 200 cheap renders in 1 ms is fine."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

// ❌ Before: query in App re-renders ProductList on every key
// export default function App() {
//   const [query, setQuery] = useState('');
//   return (<>
//     <input value={query} onChange={e => setQuery(e.target.value)} />
//     <ProductList />
//   </>);
// }

// ✅ After: state moved into the component that uses it
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

export default function App() {
  return (
    <>
      <SearchBox />
      <ProductList />
    </>
  );
}`, walk: [
      { lines: [4, 9], note: "Before: `query` lives in `App`, so every keystroke re-renders `App` and every child, including the 500-card `ProductList`." },
      { lines: [13, 16], note: "After: `query` lives in `SearchBox`. Typing only re-renders the input." },
      { lines: [18, 24], note: "`App` no longer has state, so `ProductList` stays still while you type. No `memo` needed." }
    ]},
    output: "Profiler per keystroke: before 501 components rendered, 38 ms. After 1 component rendered, 0.4 ms.",
    mistakes: [
      { bad: `// Profiler says "parent rendered"\n// → wrap the child in memo()`, good: `// Ask: does the parent NEED this state?\n// Move state down or pass the child as children first`, why: "Colocation removes the render entirely; `memo` adds a props comparison on every render and breaks easily." },
      { bad: `// Count every flash as a bug`, good: `// Only optimise renders that show up as slow\n// in the Profiler (wide bars, > 16 ms commits)`, why: "Re-rendering is normal and usually cheap. Optimise what is measurably slow." }
    ],
    practice: [
      { level: "B", q: "Turn on highlight updates and type in a search box. What flashes?", a: "Every component under the state owner. That's the list of candidates." },
      { level: "I", q: "The Profiler says “Props changed: style”. The style looks the same. Why?", a: "`style={{ color: 'red' }}` creates a new object each render, so it's a new reference." },
      { level: "I", q: "Name two fixes that don't use `memo`.", a: "Move state down to where it's used; lift content up and pass it as `children`." },
      { level: "C", q: "A `<Modal>` with `isOpen` state in `App` re-renders the whole page. Fix it.", a: "Move `isOpen` and the button into a small `ModalTrigger` component that owns the state." }
    ],
    quiz: [
      { q: "What makes a render “wasted”?", options: ["It took longer than 1 ms", "It produced the same output as before", "It happened in Strict Mode", "It used hooks"], answer: 1, why: "Wasted = work done, nothing changed on screen." },
      { q: "Best first fix when typing re-renders an unrelated list?", options: ["`useMemo` on everything", "Move the input's state down into its own component", "Use a class component", "Add keys"], answer: 1, why: "Colocating state stops the list from rendering at all." },
      { q: "`style={{ margin: 4 }}` counts as a changed prop every render.", options: ["True", "False"], answer: 0, why: "A new object literal = new reference each render." }
    ],
    rev: {
      sec30: "A wasted render produces identical output. Find them with DevTools “highlight updates” and the Profiler's “why did this render”. Causes: state too high, new object/function props, broad context. Fix with state colocation and children-as-props first, `memo` second. Only fix renders that are measurably slow.",
      interview: [
        { level: "basic", q: "How do you see which components re-render?", a: "Enable “Highlight updates when components render” in React DevTools, or record with the Profiler." },
        { level: "intermediate", q: "What are common causes of unnecessary renders?", a: "State owned too high in the tree, inline objects/functions passed as props, and context values that change often or hold too much." },
        { level: "advanced", q: "How can `children` prevent re-renders?", a: "Elements passed as `children` are created by the parent's parent. When the wrapper's state changes, those elements are the same references, so React skips them." },
        { level: "tricky", q: "Are unnecessary renders always a problem?", a: "No. Rendering is cheap for small components. They matter only when the Profiler shows slow commits or janky input." }
      ],
      cheat: [
        "Wasted render = same output, work for nothing",
        "DevTools: highlight updates + Profiler “why”",
        "Cause #1: state lives too high",
        "Inline `{}` / `[]` / `() => {}` props are new every render",
        "Fix order: colocate → children-as-props → memo",
        "Only optimise what is measurably slow"
      ]
    },
    related: ["PERF-002", "PERF-004", "RENDER-020", "RENDER-019"]
  },

  "PERF-004": {
    tldr: "`memo(Component)` skips re-rendering when every prop is the **same** as last time (compared with `Object.is`). Measure the before/after: it helps for slow components that often get the same props.",
    analogy: { icon: "📋", text: "A recipe card printer that checks: “same recipe, same servings as last time?” If yes, it hands you the card it already printed instead of printing again." },
    visual: { type: "flow", title: "What memo does on each parent render", steps: [
      { label: "Parent renders", detail: "`App` re-renders because `cartCount` changed." },
      { label: "Compare props", detail: "React checks each prop of `ProductList` with `Object.is` against the last render." },
      { label: "All same?", detail: "`products` and `onAdd` are the same references → **skip** (grey in Profiler)." },
      { label: "Any changed?", detail: "One new reference → render normally. The compare was wasted work." }
    ]},
    points: [
      "`const Fast = memo(Slow)` returns a component that skips renders when props are shallow-equal.",
      "Shallow = `Object.is` per prop. A new `{}`, `[]` or arrow function every render **defeats** memo.",
      "Pair with `useMemo` (objects/arrays) and `useCallback` (functions) or React Compiler to keep references stable.",
      "memo does **not** stop renders caused by the component's own state or a context it reads.",
      "Worth it for **slow** components (big lists, charts) re-rendered by a parent with the **same** props."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { memo, useState } from 'react';

const ProductList = memo(function ProductList({ products }) {
  console.count('ProductList render');
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
});

const PRODUCTS = Array.from({ length: 2000 }, (_, i) => ({
  id: i, name: \`Item \${i}\`,
}));

export default function App() {
  const [cart, setCart] = useState(0);
  return (
    <>
      <button onClick={() => setCart(cart + 1)}>Cart: {cart}</button>
      <ProductList products={PRODUCTS} />
    </>
  );
}`, walk: [
      { lines: [3], note: "Wrap the slow component in `memo`. Using a named function keeps its name in DevTools." },
      { lines: [4], note: "`console.count` gives a render count to compare before/after." },
      { lines: [12, 14], note: "`PRODUCTS` is defined outside the component, so it's the same array every render." },
      { lines: [20, 21], note: "Clicking changes `cart`; `App` re-renders, but `ProductList` gets the same `products` and is skipped." }
    ]},
    output: "10 clicks without memo: “ProductList render: 11”, ~9 ms per click. With memo: “ProductList render: 1”, ~0.3 ms per click.",
    mistakes: [
      { bad: `<ProductList\n  products={PRODUCTS}\n  filter={{ inStock: true }}\n/>`, good: `const FILTER = { inStock: true }; // outside\n<ProductList products={PRODUCTS} filter={FILTER} />`, why: "An inline object is a new reference every render, so memo compares, finds a change, and renders anyway." },
      { bad: `export default memo(Button); // tiny <button>`, good: `export default Button; // memo only slow parts`, why: "For cheap components the prop comparison costs about as much as the render, and it adds noise." }
    ],
    practice: [
      { level: "B", q: "Wrap a `Chart` component in `memo`.", a: "`export default memo(Chart);` or `const Chart = memo(function Chart(props) { ... })`." },
      { level: "I", q: "You pass `onSelect={() => select(id)}` to a memo row. Does memo work?", a: "No. A new function each render. Use `useCallback` or let React Compiler stabilise it." },
      { level: "I", q: "When does a memo component still re-render?", a: "When a prop changes by reference, its own state changes, or a context it uses changes." },
      { level: "C", q: "Write a custom compare that only re-renders when `product.id` or `product.price` changes.", a: "Pass a second argument to `memo`.", code: `const Card = memo(ProductCard, (prev, next) =>\n  prev.product.id === next.product.id &&\n  prev.product.price === next.product.price\n);` }
    ],
    quiz: [
      { q: "How does `memo` compare props by default?", options: ["Deep equality", "`Object.is` per prop (shallow)", "JSON.stringify", "It doesn't compare"], answer: 1, why: "Shallow, reference-based comparison of each prop." },
      { q: "A memo component reads a context that changes. What happens?", options: ["It's skipped", "It re-renders", "It throws", "It renders twice"], answer: 1, why: "memo only checks props; context changes still re-render consumers." },
      { q: "Which prop breaks memo every render?", options: ["`count={5}`", "`items={ITEMS}` defined outside", "`onClick={() => buy()}` inline", "`label=\"Buy\"`"], answer: 2, why: "Inline arrow functions are new references each render." }
    ],
    rev: {
      sec30: "`memo` wraps a component and skips its render when all props are shallow-equal (`Object.is`). It only helps if references stay stable, so pair it with `useMemo`/`useCallback` or React Compiler. It doesn't block state or context updates. Measure: render count and Profiler ms before and after.",
      interview: [
        { level: "basic", q: "What does `React.memo` do?", a: "It memoises a component so React skips re-rendering it when its props haven't changed (shallow compare)." },
        { level: "intermediate", q: "Why does `memo` often “not work”?", a: "Because a prop is a new object, array or function each render, so the shallow comparison sees a change." },
        { level: "advanced", q: "When would you pass a custom comparison function?", a: "Rarely: when only some prop fields affect output. It's risky because ignoring a prop that matters causes stale UI." },
        { level: "tricky", q: "Should you wrap every component in `memo`?", a: "No. The comparison has a cost, it adds complexity, and it fails silently with unstable props. Use it where the Profiler shows a slow, often-skippable component. React Compiler can do it automatically." }
      ],
      predict: [
        { code: `const Row = memo(({ item }) => {\n  console.log('row');\n  return <li>{item.name}</li>;\n});\n// parent re-renders with:\n<Row item={{ name: 'Tea' }} />`, answer: "Logs “row” on every parent render", why: "`{ name: 'Tea' }` is a new object each time, so memo sees a changed prop." }
      ],
      cheat: [
        "`memo(Component)` skips render if props are shallow-equal",
        "Comparison is `Object.is` per prop",
        "Inline `{}`, `[]`, arrow functions defeat it",
        "Doesn't block own state or context changes",
        "Optional 2nd arg: `(prev, next) => boolean` (true = skip)",
        "Use for slow components; measure render count before/after"
      ]
    },
    related: ["ADV-001", "PERF-005", "PERF-006", "PERF-019"]
  },

  "PERF-005": {
    tldr: "`useMemo(fn, deps)` caches the **result** of a calculation and only recomputes when a dependency changes. Measure it: if the calculation takes under ~1 ms, the cache saves nothing.",
    analogy: { icon: "🧮", text: "Totting up a long shopping receipt once and writing the total on a sticky note. You only add it up again when an item on the receipt changes." },
    visual: { type: "timeline", title: "Filtering 20,000 products", frames: [
      { label: "Render 1", state: "query='tea' → compute (25 ms)", note: "First render always runs the function." },
      { label: "Theme toggle", state: "deps same → cached (0 ms)", note: "Unrelated state changed; result reused." },
      { label: "Cart +1", state: "deps same → cached (0 ms)", note: "Still the same `products` and `query`." },
      { label: "Type 'tea b'", state: "query changed → compute (25 ms)", note: "A dependency changed, so it runs again." }
    ]},
    points: [
      "`const visible = useMemo(() => filter(products, query), [products, query]);`",
      "Runs on the first render, then only when a dependency changes (`Object.is` compare).",
      "Use it for **slow** work (> ~1 ms: filtering/sorting thousands of items) or to keep an object **reference stable** for a `memo` child.",
      "Time it: `console.time('filter')` / `console.timeEnd('filter')` before and after.",
      "React may drop the cache (e.g. in dev on edit). Your code must still work without it: a cache, not a guarantee."
    ],
    code: { file: "ProductSearch.jsx", lang: "jsx", src: `import { useMemo, useState } from 'react';

function filterProducts(products, query) {
  console.time('filter');
  const q = query.toLowerCase();
  const result = products
    .filter((p) => p.name.toLowerCase().includes(q))
    .sort((a, b) => a.price - b.price);
  console.timeEnd('filter');
  return result;
}

export default function ProductSearch({ products }) {
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);

  const visible = useMemo(
    () => filterProducts(products, query),
    [products, query]
  );

  return (
    <div className={dark ? 'dark' : ''}>
      <button onClick={() => setDark(!dark)}>Theme</button>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>{visible.length} products</p>
    </div>
  );
}`, walk: [
      { lines: [4, 9], note: "`console.time` prints how long the filter + sort takes, so you have a real number." },
      { lines: [17, 20], note: "The function runs only when `products` or `query` changes." },
      { lines: [24], note: "Toggling the theme re-renders, but `filter` is not logged: the cached array is reused." }
    ]},
    output: "20,000 products, 10 theme toggles. Without useMemo: “filter: 24.8 ms” ×10. With useMemo: no filter logs, each toggle ~1 ms.",
    mistakes: [
      { bad: `const total = useMemo(() => a + b, [a, b]);`, good: `const total = a + b;`, why: "Trivial maths is faster than the memo bookkeeping. Only cache work that measures slow." },
      { bad: `const sorted = useMemo(() => items.sort(byPrice), [items]);`, good: `const sorted = useMemo(() => items.toSorted(byPrice), [items]);`, why: "`sort` mutates the original prop array. Render (and memo functions) must be pure." }
    ],
    practice: [
      { level: "B", q: "Memoise sorting a playlist by title.", a: "Wrap in `useMemo` with `[songs]` as deps.", code: `const sorted = useMemo(\n  () => songs.toSorted((a, b) => a.title.localeCompare(b.title)),\n  [songs]\n);` },
      { level: "I", q: "You forget `query` in the deps. What happens?", a: "The list never updates when you type: a stale cached result. The `react-hooks/exhaustive-deps` lint rule catches it." },
      { level: "I", q: "How do you check if a `useMemo` is worth keeping?", a: "Time the calculation with `console.time`; if it's well under 1 ms, remove it." },
      { level: "C", q: "Typing in the input still feels slow even with `useMemo`. Why, and what next?", a: "`query` is a dependency, so it recomputes every keystroke. Use `useDeferredValue(query)`, debounce, or virtualise the result list." }
    ],
    quiz: [
      { q: "What does `useMemo` cache?", options: ["The function itself", "The function's return value", "The component's JSX output", "Network responses"], answer: 1, why: "It stores the result. `useCallback` stores the function." },
      { q: "When does a `useMemo` with `[query]` recompute?", options: ["Every render", "When `query` changes", "Never after the first render", "When any state changes"], answer: 1, why: "Only when a dependency changes by `Object.is`." },
      { q: "React promises it will never throw away a `useMemo` cache.", options: ["True", "False"], answer: 1, why: "It's a performance hint. Code must still be correct if it recomputes." }
    ],
    rev: {
      sec30: "`useMemo(fn, deps)` caches a computed value between renders and recomputes when a dependency changes. Use it for slow calculations (measure: > ~1 ms) and to keep object/array references stable for `memo` children. Keep the function pure. React Compiler can add it automatically.",
      interview: [
        { level: "basic", q: "What is `useMemo` for?", a: "Caching the result of an expensive calculation so it isn't recomputed on every render." },
        { level: "intermediate", q: "Difference between `useMemo` and `useCallback`?", a: "`useMemo` caches a value returned by a function; `useCallback(fn)` caches the function itself, like `useMemo(() => fn)`." },
        { level: "advanced", q: "How do you decide whether to add `useMemo`?", a: "Measure the calculation in a production-like build. If it's under ~1 ms or deps change every render, it doesn't help. Also use it when a memo child needs a stable object." },
        { level: "tricky", q: "Can `useMemo` make things slower?", a: "Yes, slightly: it compares deps and holds memory every render. On cheap work or deps that always change, it's pure overhead." }
      ],
      predict: [
        { code: `const list = useMemo(() => {\n  console.log('compute');\n  return items.filter(i => i.done);\n}, [items]);\n// parent passes items={[...todos]} every render`, answer: "Logs “compute” on every render", why: "`[...todos]` is a new array each time, so the dependency always changes." }
      ],
      cheat: [
        "`useMemo(() => calc(a, b), [a, b])` caches the result",
        "Recomputes only when a dep changes (`Object.is`)",
        "Worth it when calc > ~1 ms or a memo child needs a stable ref",
        "Measure with `console.time` / Profiler",
        "Keep it pure: `toSorted` not `sort`",
        "React may drop the cache; code must still work"
      ]
    },
    related: ["HOOKS-009", "PERF-004", "PERF-017", "PERF-019"]
  },

  "PERF-006": {
    tldr: "`useCallback(fn, deps)` keeps the **same function** between renders. Its job: let `memo` list rows skip renders when the parent passes them handlers like `onToggle`.",
    analogy: { icon: "📞", text: "Giving every shop assistant the same phone number for the manager. If you printed a new number every morning, everyone would have to update their contact cards (re-render)." },
    visual: { type: "compare", title: "Handler passed to 500 memo rows", left: { label: "New function each render", tone: "bad", points: [
      "`onToggle={(id) => ...}` inline",
      "New reference every parent render",
      "memo sees a changed prop",
      "All 500 rows re-render (~30 ms)"
    ]}, right: { label: "useCallback", tone: "good", points: [
      "`useCallback((id) => ..., [])`",
      "Same reference across renders",
      "memo sees equal props",
      "Only the changed row renders (~1 ms)"
    ]}},
    points: [
      "Only useful when the function goes to a **`memo` child** or into another hook's deps (e.g. `useEffect`).",
      "Use the **updater form** `setTodos(prev => ...)` so the callback needs no `todos` dependency and stays stable.",
      "Pass the row's `id` to the handler instead of creating a per-row closure: `onToggle(todo.id)`.",
      "Without a memo child, `useCallback` changes nothing about rendering.",
      "React Compiler stabilises callbacks automatically; manual `useCallback` is for code it doesn't compile."
    ],
    code: { file: "TodoList.jsx", lang: "jsx", src: `import { memo, useCallback, useState } from 'react';

const TodoRow = memo(function TodoRow({ todo, onToggle }) {
  console.count('row');
  return (
    <li onClick={() => onToggle(todo.id)}>
      {todo.done ? '✅' : '⬜'} {todo.text}
    </li>
  );
});

export default function TodoList({ initial }) {
  const [todos, setTodos] = useState(initial);

  const toggle = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  return (
    <ul>
      {todos.map((t) => (
        <TodoRow key={t.id} todo={t} onToggle={toggle} />
      ))}
    </ul>
  );
}`, walk: [
      { lines: [3], note: "`TodoRow` is memoised, so it skips rendering when `todo` and `onToggle` are unchanged." },
      { lines: [15, 19], note: "`useCallback` with `[]` keeps one `toggle` function for the component's lifetime." },
      { lines: [16, 18], note: "The updater form reads `prev`, so `todos` isn't a dependency. Unchanged todos keep their object reference." },
      { lines: [24], note: "Every row gets the same `toggle`. Clicking one re-renders only the row whose `todo` object changed." }
    ]},
    output: "500 todos, click one. Without useCallback: “row: 500”, ~28 ms commit. With useCallback: “row: 1”, ~1.2 ms commit.",
    mistakes: [
      { bad: `const toggle = useCallback((id) => {\n  setTodos(todos.map(...));\n}, [todos]);`, good: `const toggle = useCallback((id) => {\n  setTodos(prev => prev.map(...));\n}, []);`, why: "Depending on `todos` makes a new function after every change, so all rows re-render anyway." },
      { bad: `const onClick = useCallback(() => save(), []);\n<button onClick={onClick}>`, good: `<button onClick={() => save()}>`, why: "A plain DOM `<button>` isn't memoised. `useCallback` here only adds overhead." }
    ],
    practice: [
      { level: "B", q: "Wrap a `removeSong(id)` handler so it stays stable.", a: "Use `useCallback` + the updater form.", code: `const removeSong = useCallback((id) => {\n  setSongs(prev => prev.filter(s => s.id !== id));\n}, []);` },
      { level: "I", q: "Your rows are `memo` and the handler uses `useCallback`, but all rows still re-render. What else could change?", a: "The `todo` objects: e.g. `map` creates new objects for every item, or the parent passes a fresh `style` object." },
      { level: "I", q: "When is `useCallback` needed for `useEffect`?", a: "When a function is a dependency of an effect; otherwise the effect re-runs every render. Often better: define the function inside the effect." },
      { level: "C", q: "Rewrite `onToggle={() => toggle(t.id)}` in the parent so memo works.", a: "Pass `onToggle={toggle}` and let the row call `onToggle(todo.id)` itself." }
    ],
    quiz: [
      { q: "What does `useCallback` return?", options: ["The function's result", "The same function reference while deps don't change", "A Promise", "A memo component"], answer: 1, why: "It caches the function, not its result." },
      { q: "When does `useCallback` actually reduce renders?", options: ["Always", "When passed to a `memo` child (or used as a hook dep)", "When used on a `<button>`", "Never"], answer: 1, why: "Stability only matters if something compares the reference." },
      { q: "Why use `setTodos(prev => ...)` inside a `useCallback`?", options: ["It's faster to type", "So `todos` isn't a dependency and the callback stays stable", "It's required by React", "It avoids batching"], answer: 1, why: "The updater reads fresh state, so deps can be `[]`." }
    ],
    rev: {
      sec30: "`useCallback` returns the same function between renders until its deps change. It matters only when a `memo` child or a hook dependency compares the reference. Use the state updater form to keep deps empty, pass ids instead of per-row closures, and measure render counts. React Compiler does this for you.",
      interview: [
        { level: "basic", q: "What does `useCallback` do?", a: "It memoises a function so the same reference is returned across renders until its dependencies change." },
        { level: "intermediate", q: "Why does `useCallback` without `memo` usually do nothing?", a: "Non-memo children re-render with their parent anyway; nothing compares the function reference." },
        { level: "advanced", q: "How do you keep a list handler stable when it needs current state?", a: "Use the functional updater (`setX(prev => ...)`) so the handler doesn't capture state, or `useEffectEvent` inside effects." },
        { level: "tricky", q: "Is `useCallback(fn, [])` free?", a: "No. A new arrow is still created each render (then discarded), plus a deps check. It pays off only when it saves child renders." }
      ],
      debug: [
        { code: `const select = useCallback((id) => {\n  setSelected(id);\n  log(filter);\n}, []);`, fix: `const select = useCallback((id) => {\n  setSelected(id);\n  log(filter);\n}, [filter]);`, why: "Missing `filter` dep: the callback keeps reading the first render's `filter` (stale closure)." }
      ],
      cheat: [
        "`useCallback(fn, deps)` = stable function reference",
        "Equal to `useMemo(() => fn, deps)`",
        "Only helps with `memo` children or hook deps",
        "Use `setX(prev => ...)` to keep deps `[]`",
        "Pass ids: row calls `onToggle(todo.id)`",
        "React Compiler adds it automatically"
      ]
    },
    related: ["HOOKS-010", "PERF-004", "PERF-008", "PERF-019"]
  },

  "PERF-007": {
    tldr: "Virtualization (windowing) renders **only the rows you can see** plus a few extra, instead of all 10,000. TanStack Virtual does the maths; you render the visible slice.",
    analogy: { icon: "🎞️", text: "A cinema shows you one frame at a time through a small window, not the whole film reel laid out on the floor. Scroll = move the reel, the window stays the same size." },
    visual: { type: "flow", title: "How a virtual list scrolls", steps: [
      { label: "Measure viewport", detail: "Container is 400px tall, each row ~35px → about 12 rows fit." },
      { label: "Fake full height", detail: "An inner div is `10,000 × 35px` tall so the scrollbar looks real." },
      { label: "Pick visible rows", detail: "From `scrollTop`, compute rows 120–132 (+ overscan of 5 each side)." },
      { label: "Render ~22 rows", detail: "Each row is absolutely positioned with `translateY(start)`." },
      { label: "On scroll", detail: "Recompute the slice; React swaps a handful of rows. DOM stays ~22 nodes." }
    ]},
    points: [
      "Install: `npm i @tanstack/react-virtual`. Hook: `useVirtualizer({ count, getScrollElement, estimateSize })`.",
      "The scroll container needs a **fixed height** and `overflow: auto`.",
      "`getTotalSize()` sizes the inner spacer; `getVirtualItems()` gives `{ key, index, start, size }` for rows to draw.",
      "`overscan` renders extra rows above/below so fast scrolling doesn't flash blank.",
      "Trade-offs: browser Find (Ctrl+F) can't see off-screen rows, and screen readers see fewer items. Use it for big lists (≈ 500+)."
    ],
    code: { file: "BigList.jsx", lang: "jsx", src: `import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const songs = Array.from({ length: 10000 }, (_, i) => \`Song #\${i + 1}\`);

export default function BigList() {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: songs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%',
              height: row.size,
              transform: \`translateY(\${row.start}px)\`,
            }}
          >
            {songs[row.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`, walk: [
      { lines: [9, 14], note: "Tell the virtualizer how many rows, which element scrolls, and a row height guess (px)." },
      { lines: [17], note: "The outer div is the fixed-height scroll window." },
      { lines: [18], note: "The inner div fakes the full list height so the scrollbar is the right size." },
      { lines: [19, 29], note: "Render only the visible items, each moved into place with `translateY(start)`." }
    ]},
    output: "10,000 songs. Plain `map`: ~10,000 DOM nodes, ~900 ms first render, janky scroll. Virtualised: ~22 DOM nodes, ~15 ms first render, smooth 60 fps scroll.",
    mistakes: [
      { bad: `<div ref={parentRef}>\n  {/* no height, no overflow */}`, good: `<div ref={parentRef}\n  style={{ height: 400, overflow: 'auto' }}>`, why: "Without a fixed height the container grows to fit everything, so every row counts as “visible” and nothing is saved." },
      { bad: `<div key={row.index} ...>`, good: `<div key={row.key} ...>`, why: "Use the virtualizer's `key` (or your item id) so React keeps row identity stable while scrolling." }
    ],
    practice: [
      { level: "B", q: "Change the list to 50,000 items. What changes in the DOM?", a: "Nothing visible: still ~22 rows. Only the spacer height grows." },
      { level: "I", q: "Rows have different heights (chat messages). What do you add?", a: "Attach `ref={virtualizer.measureElement}` and `data-index={row.index}` to each row so real heights are measured." },
      { level: "I", q: "Scroll to song #5,000 from a button.", a: "`virtualizer.scrollToIndex(4999)`." },
      { level: "C", q: "When is virtualization the wrong fix?", a: "For short lists (< a few hundred), when users need Ctrl+F across all rows, or when pagination fits the UX better." }
    ],
    quiz: [
      { q: "What does virtualization render?", options: ["All rows, but hidden", "Only visible rows plus overscan", "Rows in a Web Worker", "A canvas image of the list"], answer: 1, why: "Off-screen rows don't exist in the DOM." },
      { q: "Why does the inner div use `getTotalSize()` as its height?", options: ["For SEO", "So the scrollbar matches the full list length", "To load images", "It's required by React"], answer: 1, why: "It's a spacer that makes scrolling feel like the full list." },
      { q: "What does `overscan` do?", options: ["Renders extra rows outside the view to avoid blank flashes", "Fetches the next page", "Zooms the list", "Disables scrolling"], answer: 0, why: "A small buffer above and below the viewport." }
    ],
    rev: {
      sec30: "Virtualization renders only the rows in (and just around) the viewport. With TanStack Virtual: a fixed-height scroll container, `useVirtualizer({ count, getScrollElement, estimateSize })`, a spacer sized by `getTotalSize()`, and absolutely positioned rows from `getVirtualItems()`. DOM stays tiny no matter the list length. Downsides: Ctrl+F and accessibility.",
      interview: [
        { level: "basic", q: "What is list virtualization?", a: "Rendering only the visible part of a long list, so the DOM holds a few dozen rows instead of thousands." },
        { level: "intermediate", q: "How does a virtual list keep the scrollbar correct?", a: "An inner spacer element is set to the total height of all rows; visible rows are absolutely positioned at their offset." },
        { level: "advanced", q: "How do you handle variable row heights?", a: "Give an `estimateSize`, then measure real rows with `measureElement` so the virtualizer corrects offsets as rows render." },
        { level: "tricky", q: "What are the downsides of virtualization?", a: "Browser find-in-page and screen readers can't see off-screen rows, scroll position restore is harder, and it adds complexity. Use it only for genuinely large lists." }
      ],
      scenario: [
        { q: "A 5,000-row order table takes 2 s to open and scrolls badly. What do you do?", a: "Profile to confirm render/DOM cost, then virtualise the rows with TanStack Virtual (or paginate). Memo the row component and keep keys stable." }
      ],
      cheat: [
        "Render only visible rows + overscan",
        "`npm i @tanstack/react-virtual`",
        "`useVirtualizer({ count, getScrollElement, estimateSize })`",
        "Container: fixed height + `overflow: auto`",
        "Spacer height = `getTotalSize()`",
        "Rows: `translateY(row.start)`, key = `row.key`",
        "Variable heights: `measureElement`"
      ]
    },
    related: ["PERF-008", "PERF-003", "PERF-020"]
  },

  "PERF-008": {
    tldr: "Fast lists need three things: **stable keys** (an id, not the index), a small **memoised row** component with simple props, and **fewer rows** at once (pagination or Load more).",
    analogy: { icon: "🏷️", text: "A playlist where each song wears a name tag. Reorder the songs and the DJ recognises each one by its tag instead of re-learning every song from scratch." },
    visual: { type: "compare", title: "Insert one item at the top of 1,000", left: { label: "key = index", tone: "bad", points: [
      "Every row's index shifts by 1",
      "React thinks all 1,000 rows changed",
      "Input text and focus jump to the wrong row",
      "~1,000 DOM updates"
    ]}, right: { label: "key = item.id", tone: "good", points: [
      "Existing ids keep their identity",
      "React inserts 1 new row",
      "Row state stays with the right item",
      "1 DOM insert"
    ]}},
    points: [
      "Use a **stable, unique id** as `key`. Index keys break when items are inserted, removed or sorted.",
      "Never `key={Math.random()}`: every render remounts every row.",
      "Extract a `Row` component, wrap in `memo`, and pass **primitives or stable references** (`id`, `title`, `onToggle`).",
      "Keep unchanged items as the **same object** when updating (`map` returning `t` for untouched items).",
      "Show fewer rows: pagination, Load more, or infinite scroll. Over ~1,000 rows on screen → virtualise (PERF-007)."
    ],
    code: { file: "Inbox.jsx", lang: "jsx", src: `import { memo, useState } from 'react';

const PAGE = 50;

const MessageRow = memo(function MessageRow({ from, subject, unread }) {
  return (
    <li className={unread ? 'unread' : ''}>
      <b>{from}</b> {subject}
    </li>
  );
});

export default function Inbox({ messages }) {
  const [shown, setShown] = useState(PAGE);
  const page = messages.slice(0, shown);

  return (
    <>
      <ul>
        {page.map((m) => (
          <MessageRow key={m.id} from={m.from}
            subject={m.subject} unread={m.unread} />
        ))}
      </ul>
      {shown < messages.length && (
        <button onClick={() => setShown(shown + PAGE)}>Load more</button>
      )}
    </>
  );
}`, walk: [
      { lines: [5], note: "A small, memoised row. Primitive props compare cheaply and reliably." },
      { lines: [14, 15], note: "Render only the first 50 messages; the rest wait for **Load more**." },
      { lines: [21, 22], note: "`key={m.id}` keeps each row's identity stable across inserts and sorting." },
      { lines: [25, 27], note: "Each click adds another 50 rows. Old rows are skipped by `memo`." }
    ]},
    output: "3,000 messages. All at once with index keys: ~420 ms first render, ~180 ms when a new mail arrives. 50 per page + id keys + memo rows: ~12 ms first render, ~2 ms for a new mail.",
    mistakes: [
      { bad: `{todos.map((t, i) => <Todo key={i} todo={t} />)}`, good: `{todos.map((t) => <Todo key={t.id} todo={t} />)}`, why: "Index keys shift on insert/delete/sort, so React reuses the wrong component and its state." },
      { bad: `setItems(items.map(i => ({ ...i })))`, good: `setItems(items.map(i =>\n  i.id === id ? { ...i, read: true } : i))`, why: "Copying every item gives every memo row a new prop, so all of them re-render. Copy only what changed." }
    ],
    practice: [
      { level: "B", q: "Items have no id. How do you get a stable key?", a: "Create the id when the item is created (`crypto.randomUUID()`), not during render." },
      { level: "I", q: "Turn Load more into page numbers (1, 2, 3…).", a: "Store `page` in state (or the URL `?page=`) and render `messages.slice((page-1)*PAGE, page*PAGE)`." },
      { level: "I", q: "Why pass `from` and `subject` instead of the whole `message` object?", a: "Primitive props stay equal even if the parent creates a new message object with the same values." },
      { level: "C", q: "Pagination vs infinite scroll vs virtualization: pick one for a product grid, a chat log and a 20,000-row admin table.", a: "Product grid: pagination/Load more (shareable URLs). Chat: virtualised infinite scroll. Admin table: virtualization (+ server pagination)." }
    ],
    quiz: [
      { q: "Best key for a todo list?", options: ["Array index", "`Math.random()`", "The todo's id", "The todo text"], answer: 2, why: "A stable, unique id. Text can repeat; index shifts; random changes every render." },
      { q: "What happens with `key={Math.random()}`?", options: ["Faster renders", "Every row remounts on every render", "Nothing", "React warns and ignores it"], answer: 1, why: "New key = new identity = unmount + mount." },
      { q: "Updating one todo, which approach keeps other memo rows from re-rendering?", options: ["Copy every todo object", "Return the same object for untouched todos", "Use index keys", "Wrap the list in a Fragment"], answer: 1, why: "Unchanged references let `memo` skip them." }
    ],
    rev: {
      sec30: "Optimise lists with stable id keys (never index for changing lists, never random), small memoised row components that receive primitives or stable callbacks, immutable updates that keep untouched items' references, and fewer visible rows via pagination, Load more, or virtualization for very long lists.",
      interview: [
        { level: "basic", q: "Why do lists need keys?", a: "Keys tell React which item is which between renders, so it can update, move or remove the right DOM nodes and state." },
        { level: "intermediate", q: "When is using the index as key OK?", a: "Only for static lists that never reorder, insert or delete items, and whose rows have no state." },
        { level: "advanced", q: "How do you make a list row cheap to re-render?", a: "Extract it, wrap in `memo`, pass primitives and stable callbacks (`useCallback` or compiler), and keep untouched items' object references in updates." },
        { level: "tricky", q: "A list uses `memo` rows and id keys but all rows still re-render on any change. Why?", a: "Usually a new prop reference per row: inline handler, inline style, or an update that copies every item object." }
      ],
      cheat: [
        "`key` = stable unique id; not index, not random",
        "Index keys break on insert/delete/sort",
        "Extract `Row`, wrap in `memo`, pass primitives",
        "Update only changed items: `i.id === id ? {...i} : i`",
        "Paginate or Load more for medium lists",
        "Virtualise very long lists (PERF-007)"
      ]
    },
    related: ["RENDER-009", "PERF-007", "PERF-006", "API-024"]
  },

  "PERF-009": {
    tldr: "Lazy loading means **don't load what the user can't see yet**. Images get `loading=\"lazy\"`; heavy below-the-fold components load with `lazy()` when they scroll near the screen.",
    analogy: { icon: "🍽️", text: "A restaurant brings the dessert menu when you finish your main course, not stacked on the table when you sit down." },
    visual: { type: "flow", title: "Reviews load only when scrolled near", steps: [
      { label: "Page opens", detail: "Hero image + title load. Reviews code (120 KB) is **not** downloaded." },
      { label: "Placeholder", detail: "An empty `<section>` with a min-height waits below the fold." },
      { label: "Near screen", detail: "`IntersectionObserver` fires 200px before the section is visible." },
      { label: "Fetch chunk", detail: "`lazy(() => import('./Reviews'))` downloads the chunk; `<Suspense>` shows a fallback." },
      { label: "Show", detail: "Reviews render. Users who never scroll never pay for them." }
    ]},
    points: [
      "Images below the fold: `<img loading=\"lazy\" width height>`. The browser fetches them near the viewport.",
      "**Never** lazy-load the hero / first image: it delays LCP. Give it `fetchPriority=\"high\"` instead.",
      "Components: `const Reviews = lazy(() => import('./Reviews'))` + `<Suspense fallback>`.",
      "Trigger the import when needed: on scroll (`IntersectionObserver`), on click (open a modal), or on hover (prefetch).",
      "Reserve space (`min-height`, `width`/`height`) so lazy content doesn't push the page around (CLS)."
    ],
    code: { file: "ProductPage.jsx", lang: "jsx", src: `import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const Reviews = lazy(() => import('./Reviews'));

function useNearScreen(ref) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return near;
}

export default function ProductPage({ product }) {
  const reviewsRef = useRef(null);
  const showReviews = useNearScreen(reviewsRef);

  return (
    <main>
      <img src={product.hero} alt={product.name}
        width="800" height="600" fetchPriority="high" />
      <h1>{product.name}</h1>
      <img src={product.closeUp} alt="Close-up"
        width="800" height="600" loading="lazy" />
      <section ref={reviewsRef} style={{ minHeight: 300 }}>
        {showReviews && (
          <Suspense fallback={<p>Loading reviews…</p>}>
            <Reviews productId={product.id} />
          </Suspense>
        )}
      </section>
    </main>
  );
}`, walk: [
      { lines: [3], note: "`lazy` + dynamic `import()` puts `Reviews` in its own chunk. Nothing downloads until it renders." },
      { lines: [5, 15], note: "A tiny hook: `IntersectionObserver` flips `near` to true 200px before the section appears, then stops watching." },
      { lines: [23, 24], note: "The hero image is above the fold: load it eagerly with high priority (good for LCP)." },
      { lines: [26, 27], note: "Below-the-fold image: `loading=\"lazy\"` lets the browser wait. `width`/`height` reserve space." },
      { lines: [28, 34], note: "Only when near the screen does `Reviews` render, triggering the chunk download behind `<Suspense>`." }
    ]},
    output: "Network on first load: before 14 requests / 1.9 MB (all images + reviews chunk). After 6 requests / 420 KB. Reviews chunk (118 KB) loads only after scrolling.",
    mistakes: [
      { bad: `<img src={hero} loading="lazy" />  // top of page`, good: `<img src={hero} width="800" height="600"\n  fetchPriority="high" />`, why: "Lazy-loading the main image delays it, which makes LCP worse. Lazy-load only what starts off-screen." },
      { bad: `function Page() {\n  const Reviews = lazy(() => import('./Reviews'));\n}`, good: `const Reviews = lazy(() => import('./Reviews'));\nfunction Page() { /* ... */ }`, why: "Declaring `lazy` inside a component creates a new component each render, so it remounts and loses state." }
    ],
    practice: [
      { level: "B", q: "Make a gallery of 40 recipe photos load lazily.", a: "Add `loading=\"lazy\"` plus `width` and `height` to each `<img>` except the first row." },
      { level: "I", q: "Load a heavy `MapView` only when the user clicks **Show map**.", a: "`const MapView = lazy(() => import('./MapView'))`; render it inside `<Suspense>` only when `showMap` is true." },
      { level: "I", q: "Start downloading a lazy chunk on hover so the click feels instant.", a: "Call the same import early; the browser caches the module.", code: `const load = () => import('./MapView');\nconst MapView = lazy(load);\n<button onMouseEnter={load} onClick={() => setShow(true)}>Show map</button>` },
      { level: "C", q: "Why `rootMargin: '200px'` rather than `0px`?", a: "It starts loading slightly before the section is visible, hiding the network delay from the user." }
    ],
    quiz: [
      { q: "Which image should NOT be lazy-loaded?", options: ["A footer logo", "The hero image at the top", "Photo #30 in a gallery", "A review avatar far down"], answer: 1, why: "It's visible immediately and is usually the LCP element." },
      { q: "What does `lazy(() => import('./Reviews'))` change in the build?", options: ["Nothing", "Reviews goes into a separate chunk loaded on demand", "Reviews renders on the server", "Reviews is deleted from the bundle"], answer: 1, why: "Dynamic `import()` creates a split point." },
      { q: "Why give lazy images `width` and `height`?", options: ["SEO only", "So the browser reserves space and the layout doesn't jump", "It's required for lazy loading to work", "To resize the file"], answer: 1, why: "Reserved space prevents layout shift (CLS)." }
    ],
    rev: {
      sec30: "Lazy loading defers what isn't visible yet. Images: `loading=\"lazy\"` with `width`/`height`, but never on the hero (give it `fetchPriority=\"high\"`). Components: `lazy(() => import())` in `<Suspense>`, triggered by scroll (IntersectionObserver), click or hover-prefetch. Reserve space to avoid layout shifts.",
      interview: [
        { level: "basic", q: "How do you lazy-load an image?", a: "Add `loading=\"lazy\"` to the `<img>`; the browser fetches it as it nears the viewport." },
        { level: "intermediate", q: "How do you lazy-load a component below the fold?", a: "Wrap it in `lazy(() => import())` and render it inside `<Suspense>` only once an IntersectionObserver says the area is near the screen." },
        { level: "advanced", q: "How can lazy loading hurt performance?", a: "Lazy-loading above-the-fold content delays LCP, and loading too late causes visible spinners. Prefetch on hover or with a root margin." },
        { level: "tricky", q: "Why must `lazy()` be called at module level?", a: "Calling it during render creates a new component type every render, so React remounts it and loses its state." }
      ],
      cheat: [
        "Off-screen images: `loading=\"lazy\"` + `width`/`height`",
        "Hero image: eager + `fetchPriority=\"high\"`",
        "`const X = lazy(() => import('./X'))` at module level",
        "Wrap lazy components in `<Suspense fallback>`",
        "Trigger by scroll (IntersectionObserver), click or hover",
        "Reserve space to avoid layout shift"
      ]
    },
    related: ["ADV-002", "PERF-010", "PERF-012", "ADV-003"]
  },

  "PERF-010": {
    tldr: "Code splitting breaks one big JavaScript file into **chunks per route**, so the home page doesn't download the admin dashboard. Measure the win in the `vite build` output.",
    analogy: { icon: "📚", text: "A recipe book split into chapters you download when needed. Want breakfast? You get the breakfast chapter, not all 600 pages." },
    visual: { type: "compare", title: "Initial download for the home page", left: { label: "One bundle", tone: "bad", points: [
      "`index.js` 812 KB (248 KB gzip)",
      "Contains Home, Shop, Checkout, Admin, charts",
      "Every visitor downloads everything",
      "Slow LCP on phones"
    ]}, right: { label: "Split by route", tone: "good", points: [
      "`index.js` 196 KB (64 KB gzip)",
      "`Admin-*.js` 410 KB loads only on /admin",
      "`Checkout-*.js` loads only at checkout",
      "Home is interactive much sooner"
    ]}},
    points: [
      "Routes are the best split points: users visit one page at a time.",
      "`const Admin = lazy(() => import('./pages/Admin'))` + a `<Suspense>` around the routes.",
      "Vite (Rolldown) turns every dynamic `import()` into a separate hashed chunk automatically.",
      "Read the numbers: `npm run build` prints each chunk's size and gzip size. Compare before/after.",
      "React Router data mode has `route.lazy` for the same idea plus loaders (ROUTE-020)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> <Link to="/shop">Shop</Link>
      </nav>
      <Suspense fallback={<p>Loading page…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`, walk: [
      { lines: [2], note: "React Router 7 imports come from `react-router`." },
      { lines: [3], note: "Home is the landing page: import it normally so it's in the main bundle." },
      { lines: [5, 7], note: "Each `lazy(() => import())` becomes its own chunk, downloaded the first time that route renders." },
      { lines: [15], note: "One `<Suspense>` shows a fallback while a route's chunk downloads." }
    ]},
    output: "`vite build` before: dist/assets/index-a1b2.js 812.4 kB │ gzip: 248.1 kB. After: index-c3d4.js 196.0 kB │ gzip: 64.3 kB, Shop-e5f6.js 88.2 kB, Checkout-g7h8.js 61.5 kB, Admin-i9j0.js 410.7 kB.",
    mistakes: [
      { bad: `const Home = lazy(() => import('./pages/Home'));\n// the page everyone lands on`, good: `import Home from './pages/Home';`, why: "Splitting the landing page adds an extra round trip before anything shows. Split what most visitors don't need first." },
      { bad: `import Admin from './pages/Admin';\nconst AdminLazy = lazy(() => import('./pages/Admin'));`, good: `const Admin = lazy(() => import('./pages/Admin'));`, why: "A static import anywhere pulls the module into the main bundle, so the split does nothing." }
    ],
    practice: [
      { level: "B", q: "Split a `/settings` route into its own chunk.", a: "`const Settings = lazy(() => import('./pages/Settings'))` and use it in a `<Route>` inside `<Suspense>`." },
      { level: "I", q: "How do you check the split worked?", a: "Run `npm run build` and look for a new `Settings-*.js` chunk; in DevTools Network, it loads only when you visit /settings." },
      { level: "I", q: "Navigating shows a blank flash. Improve it.", a: "Use a skeleton fallback, or wrap navigation in a transition so the old page stays while the new chunk loads." },
      { level: "C", q: "Prefetch the Checkout chunk when the user adds the first item to the cart.", a: "Call the same `import('./pages/Checkout')` in the add-to-cart handler; the chunk is cached for later." }
    ],
    quiz: [
      { q: "What creates a new chunk in a Vite build?", options: ["A `<Route>`", "A dynamic `import()`", "A `useEffect`", "Any new file"], answer: 1, why: "Dynamic imports are split points." },
      { q: "Which route is usually best to keep in the main bundle?", options: ["Admin", "The landing/home page", "Settings", "Reports"], answer: 1, why: "Most users need it immediately." },
      { q: "Where do you see each chunk's gzip size?", options: ["React DevTools", "The `vite build` terminal output", "`package.json`", "The browser console"], answer: 1, why: "Vite prints every output file with its raw and gzip size." }
    ],
    rev: {
      sec30: "Code splitting puts rarely-needed code into separate chunks loaded on demand. Split by route with `lazy(() => import('./pages/X'))` and a `<Suspense>` around `<Routes>`; keep the landing page eager. Vite makes a chunk per dynamic import. Verify with `vite build` sizes and the Network tab.",
      interview: [
        { level: "basic", q: "What is code splitting?", a: "Breaking the bundle into smaller chunks that load on demand, so the first page downloads less JavaScript." },
        { level: "intermediate", q: "Why split by route?", a: "Users view one route at a time, so each route's code is a natural chunk with a clear moment to load it." },
        { level: "advanced", q: "What can make a lazy import not split?", a: "A static `import` of the same module elsewhere, or re-exporting it from a barrel file the main bundle imports." },
        { level: "tricky", q: "Can code splitting make things slower?", a: "Yes: too many tiny chunks add request overhead, and splitting the first page adds a round trip. Prefetch likely-next chunks." }
      ],
      cheat: [
        "Split by route: `lazy(() => import('./pages/X'))`",
        "Wrap routes in `<Suspense fallback>`",
        "Keep the landing page eager",
        "Each dynamic `import()` = one chunk",
        "Verify with `vite build` output (gzip sizes)",
        "A static import of the same file cancels the split",
        "Data mode: `route.lazy` (ROUTE-020)"
      ]
    },
    related: ["ADV-013", "ROUTE-020", "PERF-011", "PERF-009"]
  },

  "PERF-011": {
    tldr: "Bundle optimisation: **see** what's inside your bundle with a visualiser, then **remove or replace** the heavy parts (whole-library imports, big date/chart libraries, duplicates).",
    analogy: { icon: "🧳", text: "Packing for a weekend trip. Tip the suitcase out, spot the hair dryer and three pairs of boots, and leave them home. The bag gets light fast." },
    visual: { type: "flow", title: "Bundle diet", steps: [
      { label: "Build", detail: "`npm run build` → note total and gzip size (baseline)." },
      { label: "Visualise", detail: "Treemap shows each package's share. Big boxes = targets." },
      { label: "Spot heavy deps", detail: "e.g. `moment` + locales 290 KB, full `lodash` 70 KB, a chart lib on one page." },
      { label: "Replace or split", detail: "Use `Intl`, `lodash-es` named imports, or lazy-load the chart page." },
      { label: "Re-measure", detail: "Build again and compare gzip numbers." }
    ]},
    points: [
      "`rollup-plugin-visualizer` in `vite.config.js` writes a `stats.html` treemap after each build.",
      "Prefer native APIs: `Intl.DateTimeFormat`, `Intl.NumberFormat`, `structuredClone`, `Array.prototype.toSorted`.",
      "Import only what you use: `import debounce from 'lodash-es/debounce'` or named ESM imports that tree-shake.",
      "Check a package's size before installing (bundlephobia.com / pkg-size.dev).",
      "Heavy features used on one page (charts, editors, PDF) → lazy-load them (PERF-010)."
    ],
    code: { file: "vite.config.js", lang: "js", src: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      open: true,
    }),
  ],
});

// Then in the app:
// ❌ import moment from 'moment';          // ~290 KB with locales
//    moment(date).format('D MMM YYYY');
// ✅ new Intl.DateTimeFormat('en-GB', {     // 0 KB, built into browsers
//      day: 'numeric', month: 'short', year: 'numeric',
//    }).format(date);`, walk: [
      { lines: [3], note: "Install with `npm i -D rollup-plugin-visualizer`. Its README lists Vite and Rolldown support." },
      { lines: [8, 12], note: "After `npm run build`, it opens `stats.html`: a treemap with gzip sizes for every module." },
      { lines: [17, 18], note: "A classic heavy dependency: `moment` plus all its locales." },
      { lines: [19, 21], note: "`Intl.DateTimeFormat` does the same job with zero bundle cost." }
    ]},
    output: "Shop app gzip JS: before 312 KB (moment 72 KB, lodash 25 KB, chart lib 95 KB in main). After Intl + lodash-es + lazy chart page: 118 KB main, 95 KB chart chunk on /reports only.",
    mistakes: [
      { bad: `import _ from 'lodash';\n_.debounce(save, 300);`, good: `import debounce from 'lodash-es/debounce';\ndebounce(save, 300);`, why: "Importing the default `lodash` object pulls in the whole library. Per-function or named ESM imports tree-shake." },
      { bad: `// Barrel file re-exports everything\nimport { Button } from './components';`, good: `import Button from './components/Button';`, why: "Big barrel files with side effects can stop tree-shaking and drag unused components (and their CSS) into the bundle." }
    ],
    practice: [
      { level: "B", q: "Find the three largest packages in your bundle.", a: "Add the visualizer, run `npm run build`, read the biggest boxes in `stats.html`." },
      { level: "I", q: "Replace `numeral(price).format('$0,0.00')`.", a: "Use `Intl.NumberFormat`.", code: `const money = new Intl.NumberFormat('en-US', {\n  style: 'currency', currency: 'USD',\n});\nmoney.format(price); // "$1,299.00"` },
      { level: "I", q: "The same library appears twice in the treemap (two versions). Fix?", a: "Run `npm ls <pkg>` to see who needs which version, then align versions (update deps or use `overrides`)." },
      { level: "C", q: "Set a budget so the build warns above 300 KB per chunk.", a: "In `vite.config.js`: `build: { chunkSizeWarningLimit: 300 }` (in kB). Track gzip sizes in CI too." }
    ],
    quiz: [
      { q: "What does a bundle visualiser show?", options: ["Render times", "Which modules take up space in each chunk", "Network latency", "Memory leaks"], answer: 1, why: "It's a size map of your built JavaScript." },
      { q: "Best replacement for formatting dates with `moment`?", options: ["jQuery", "`Intl.DateTimeFormat`", "A bigger date library", "Server-side only"], answer: 1, why: "Built into the browser, so zero KB added." },
      { q: "Which import is most likely to pull in a whole library?", options: ["`import debounce from 'lodash-es/debounce'`", "`import { debounce } from 'lodash-es'`", "`import _ from 'lodash'`"], answer: 2, why: "The CommonJS default object can't be tree-shaken." }
    ],
    rev: {
      sec30: "Measure the bundle (`vite build` sizes + `rollup-plugin-visualizer` treemap), then cut: replace heavy libs with native `Intl`/ES features, import per function from ESM packages, remove duplicates, avoid side-effectful barrel files, and lazy-load page-specific heavy features. Re-measure gzip size after each change.",
      interview: [
        { level: "basic", q: "How do you find out what's making your bundle big?", a: "Build and open a bundle visualiser treemap (e.g. `rollup-plugin-visualizer`) to see each module's size." },
        { level: "intermediate", q: "What is tree shaking?", a: "The bundler removing exports that are never imported. It works with ES modules and side-effect-free code." },
        { level: "advanced", q: "Why might tree shaking fail?", a: "CommonJS packages, imports of a whole default object, or modules marked as having side effects (or barrel files that run code)." },
        { level: "tricky", q: "Is a smaller gzip size always faster?", a: "Mostly, but parse/execute time matters too, and splitting into too many chunks adds requests. Measure LCP and INP, not just KB." }
      ],
      cheat: [
        "Baseline: `npm run build` gzip sizes",
        "`rollup-plugin-visualizer` → `stats.html` treemap",
        "Native first: `Intl`, `structuredClone`, `toSorted`",
        "Per-function imports: `lodash-es/debounce`",
        "Check size before install (bundlephobia / pkg-size.dev)",
        "Lazy-load page-only heavy libs",
        "`build.chunkSizeWarningLimit` as a budget"
      ]
    },
    related: ["PERF-010", "PROD-003", "PERF-020"]
  },

  "PERF-012": {
    tldr: "Images are usually the heaviest part of a page. Serve **modern formats** (AVIF/WebP), the **right size** for the screen (`srcSet` + `sizes`), always set `width`/`height`, and lazy-load off-screen ones.",
    analogy: { icon: "🖼️", text: "Sending a holiday photo to a friend's phone: you shrink it first. Nobody needs a 12 MB poster-size file for a thumbnail." },
    visual: { type: "layers", title: "One product photo, four upgrades", items: [
      { label: "Lazy if off-screen", detail: "`loading=\"lazy\"` below the fold; `fetchPriority=\"high\"` for the hero." },
      { label: "Reserve space", detail: "`width` + `height` stop the layout jumping (CLS)." },
      { label: "Right size", detail: "`srcSet` 400w/800w/1600w + `sizes`; phones get 400w." },
      { label: "Modern format", detail: "AVIF/WebP via `<picture>`: often 50-80% smaller than JPEG." },
      { label: "Original", detail: "photo.jpg, 2400px, 1.8 MB." }
    ]},
    points: [
      "`<picture>` + `<source type=\"image/avif\">` lets the browser pick the best format it supports, with a JPEG fallback.",
      "`srcSet=\"a-400.jpg 400w, a-800.jpg 800w\"` + `sizes=\"(max-width: 600px) 100vw, 400px\"` = right file for the screen.",
      "Always set `width` and `height` (the aspect ratio); CSS can still make it responsive.",
      "Hero/LCP image: eager, `fetchPriority=\"high\"`, maybe a `<link rel=\"preload\">`. Others: `loading=\"lazy\"`.",
      "Generate sizes at build time or via an image CDN. Next.js does this with `next/image` (framework-only, NEXT-014)."
    ],
    code: { file: "ProductImage.jsx", lang: "jsx", src: `export default function ProductImage({ name, slug, priority = false }) {
  const base = \`/img/\${slug}\`;
  const widths = [400, 800, 1600];
  const set = (ext) => widths.map((w) => \`\${base}-\${w}.\${ext} \${w}w\`).join(', ');
  const sizes = '(max-width: 600px) 100vw, 400px';

  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={\`\${base}-800.jpg\`}
        srcSet={set('jpg')}
        sizes={sizes}
        alt={name}
        width="800"
        height="800"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </picture>
  );
}`, walk: [
      { lines: [3, 4], note: "Build a `srcSet` string like `/img/mug-400.avif 400w, /img/mug-800.avif 800w, ...`." },
      { lines: [5], note: "`sizes` tells the browser how wide the image will display, so it can choose before layout." },
      { lines: [9, 10], note: "The browser takes the first `<source>` whose `type` it supports: AVIF, then WebP." },
      { lines: [11, 15], note: "`<img>` is the JPEG fallback and carries `alt` and the size attributes." },
      { lines: [16, 19], note: "`width`/`height` reserve space; the hero passes `priority` to load eagerly with high priority." }
    ]},
    output: "Product grid, 24 images on a phone. Before: JPEG 2400px, 24 × ~1.8 MB = 43 MB, LCP 6.1 s. After: AVIF 400w lazy, ~35 KB each, ~280 KB above the fold, LCP 1.9 s.",
    mistakes: [
      { bad: `<img src="/img/mug-2400.jpg" alt="Mug" />`, good: `<img src="/img/mug-800.jpg"\n  srcSet="/img/mug-400.jpg 400w, /img/mug-800.jpg 800w"\n  sizes="(max-width: 600px) 100vw, 400px"\n  width="800" height="800" alt="Mug" />`, why: "One huge file for every screen wastes data on phones, and no dimensions means the layout jumps when it loads." },
      { bad: `<img src={src} />`, good: `<img src={src} alt="Blue ceramic mug" />`, why: "Missing `alt` hurts accessibility. Use `alt=\"\"` for purely decorative images." }
    ],
    practice: [
      { level: "B", q: "Add the missing attributes to `<img src=\"pizza.jpg\">` in a menu list.", a: "`alt`, `width`, `height`, and `loading=\"lazy\"` (if it's below the fold)." },
      { level: "I", q: "Write `sizes` for an image that is full width on phones and 33vw on desktop.", a: "`sizes=\"(max-width: 768px) 100vw, 33vw\"`." },
      { level: "I", q: "How do you find your LCP image?", a: "Lighthouse or DevTools Performance panel highlights the LCP element; make sure it isn't lazy-loaded." },
      { level: "C", q: "Users upload 4000px avatars. Fix it end-to-end.", a: "Resize/convert on upload (server or image CDN) to 64/128/256px WebP/AVIF; render with `srcSet`, `width`/`height` and lazy loading." }
    ],
    quiz: [
      { q: "Why add `width` and `height` to images?", options: ["To resize the file", "So the browser reserves space and avoids layout shift", "SEO only", "They're required for `srcSet`"], answer: 1, why: "It gives the aspect ratio before the image arrives (better CLS)." },
      { q: "What does `sizes` tell the browser?", options: ["The file sizes in KB", "How wide the image will be displayed", "Which format to use", "The image's natural size"], answer: 1, why: "With `srcSet` widths, it picks the smallest file that looks sharp." },
      { q: "In `<picture>`, which source is used?", options: ["The last one", "The first whose `type` the browser supports", "The smallest", "All of them"], answer: 1, why: "Order matters: list AVIF first, then WebP, with `<img>` as fallback." }
    ],
    rev: {
      sec30: "Optimise images with modern formats (AVIF/WebP via `<picture>`), responsive sizes (`srcSet` + `sizes`), explicit `width`/`height` to prevent CLS, `loading=\"lazy\"` for off-screen images, and `fetchPriority=\"high\"` for the LCP image. Generate variants at build/upload time or with an image CDN.",
      interview: [
        { level: "basic", q: "Name three ways to make images load faster.", a: "Use WebP/AVIF, serve sizes that match the display with `srcSet`, and lazy-load images below the fold." },
        { level: "intermediate", q: "How do `srcSet` and `sizes` work together?", a: "`srcSet` lists files with their widths; `sizes` says how wide the image renders. The browser multiplies by pixel density and picks the best file." },
        { level: "advanced", q: "How do you optimise the LCP image?", a: "Serve it in a modern format at the right size, load it eagerly with `fetchPriority=\"high\"`, and preload it if it's discovered late (e.g. a CSS background)." },
        { level: "tricky", q: "Why can `loading=\"lazy\"` on every image hurt?", a: "Above-the-fold images, including the LCP image, get delayed until layout, which worsens LCP." }
      ],
      cheat: [
        "`<picture>`: AVIF → WebP → JPEG fallback",
        "`srcSet` with `w` widths + `sizes`",
        "Always `width` + `height` (prevents CLS)",
        "Off-screen: `loading=\"lazy\"`",
        "LCP image: eager + `fetchPriority=\"high\"`",
        "Resize at build/upload time or via an image CDN",
        "`alt` always (empty for decorative)"
      ]
    },
    related: ["PERF-009", "PERF-020", "NEXT-014"]
  },

  "PERF-013": {
    tldr: "Debouncing waits until the user **stops** for a moment (e.g. 400 ms), then runs the work **once**. Perfect for search-as-you-type, autosave and validation.",
    analogy: { icon: "🛗", text: "A lift waits a few seconds after the last person steps in before closing the doors. Each new person resets the wait. It leaves once, with everyone." },
    visual: { type: "timeline", title: "Typing “pasta” into a recipe search", frames: [
      { label: "p", state: "timer starts (400 ms)", note: "No search yet." },
      { label: "pa · pas · past", state: "timer reset ×3", note: "Each key cancels the previous timer." },
      { label: "pasta", state: "timer reset", note: "Last key." },
      { label: "+400 ms quiet", state: "search('pasta') runs once", note: "1 request instead of 5." }
    ]},
    points: [
      "Debounce = **reset a timer on every event**; run only when the timer finishes.",
      "In React: an effect with `setTimeout` and a **cleanup** `clearTimeout`. The cleanup is what resets the timer.",
      "Keep the input itself instant (state updates every key); debounce only the **expensive** work.",
      "Typical waits: 300-500 ms for search, ~1 s for autosave.",
      "Not the same as `useDeferredValue`: that defers a re-render, debounce delays **side effects** like requests and saves."
    ],
    code: { file: "NoteEditor.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

export default function NoteEditor({ saveNote }) {
  const [text, setText] = useState('');
  const [savedText, setSavedText] = useState('');

  useEffect(() => {
    if (text === savedText) return;
    const timer = setTimeout(async () => {
      await saveNote(text);
      setSavedText(text);
    }, 800);
    return () => clearTimeout(timer);
  }, [text, savedText, saveNote]);

  return (
    <>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <small>{text === savedText ? 'Saved' : 'Typing…'}</small>
    </>
  );
}`, walk: [
      { lines: [4, 5], note: "`text` updates on every key so typing stays instant. `savedText` remembers what was last saved." },
      { lines: [9, 12], note: "Schedule the save 800 ms after the latest change." },
      { lines: [13], note: "The cleanup runs before the next effect: each keystroke cancels the pending save. That **is** the debounce." },
      { lines: [18, 19], note: "The input stays instant. The status is derived: “Typing…” while `text` differs from `savedText`." }
    ]},
    output: "Typing a 60-character note: without debounce 60 saves (60 requests). With an 800 ms debounce: 1 save after you pause. Status shows “Typing…” then “Saved”.",
    mistakes: [
      { bad: `useEffect(() => {\n  setTimeout(() => search(q), 400);\n}, [q]);`, good: `useEffect(() => {\n  const t = setTimeout(() => search(q), 400);\n  return () => clearTimeout(t);\n}, [q]);`, why: "Without the cleanup every timer still fires, so you get one search per key, just 400 ms late." },
      { bad: `const onChange = debounce((e) =>\n  setText(e.target.value), 400);`, good: `onChange={(e) => setText(e.target.value)}\n// debounce the search/save, not the input`, why: "Debouncing a controlled input's state makes typing lag and drops characters. Only debounce the expensive work." }
    ],
    practice: [
      { level: "B", q: "Change the autosave delay to 1.5 s.", a: "Change `800` to `1500` in `setTimeout`." },
      { level: "I", q: "Extract a `useDebouncedValue(value, ms)` hook.", a: "Store a delayed copy in state.", code: `function useDebouncedValue(value, ms) {\n  const [v, setV] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setV(value), ms);\n    return () => clearTimeout(t);\n  }, [value, ms]);\n  return v;\n}` },
      { level: "I", q: "The parent passes `saveNote={(t) => api.save(t)}` inline. What goes wrong?", a: "A new function each parent render re-runs the effect and resets the timer. Wrap it in `useCallback` (or let React Compiler stabilise it)." },
      { level: "C", q: "Save immediately when the user leaves the page with unsaved text.", a: "Listen for `visibilitychange`/`pagehide` and send the latest text with `navigator.sendBeacon` or `fetch(..., { keepalive: true })`." }
    ],
    quiz: [
      { q: "With a 400 ms debounce, how many searches for typing “cake” quickly?", options: ["4", "1", "0", "2"], answer: 1, why: "Each key resets the timer; one search runs after the pause." },
      { q: "In the React version, what resets the timer?", options: ["`setTimeout`", "The effect cleanup `clearTimeout`", "React batching", "`useMemo`"], answer: 1, why: "Cleanup cancels the previous timer before the next effect runs." },
      { q: "What should you NOT debounce?", options: ["API search", "Autosave", "The input's own `value` state", "Validation messages"], answer: 2, why: "The text field must update immediately or typing feels broken." }
    ],
    rev: {
      sec30: "Debouncing delays work until events stop for N ms, then runs it once. In React, put `setTimeout` in an effect keyed on the value and `clearTimeout` in the cleanup. Keep the input instant; debounce the search, save or validation. 300-500 ms for search, ~1 s for autosave.",
      interview: [
        { level: "basic", q: "What is debouncing?", a: "Delaying a function until a burst of events stops for a set time, so it runs once at the end." },
        { level: "intermediate", q: "How do you debounce in a React component?", a: "An effect that sets a timeout with the latest value and clears it in cleanup, or a `useDebouncedValue` hook." },
        { level: "advanced", q: "Debounce vs `useDeferredValue`?", a: "Debounce waits a fixed time and is for side effects like requests. `useDeferredValue` has no delay; it lets React render the slow part at lower priority." },
        { level: "tricky", q: "Why can a debounced callback created in render fail?", a: "A new debounced function every render has its own timer, so nothing is ever cancelled. Keep it in `useRef`/`useMemo` or use the effect pattern." }
      ],
      compare: { cols: ["", "Debounce", "Throttle"], rows: [
        ["Runs", "Once, after the events stop", "At most once every N ms"],
        ["Best for", "Search, autosave, validation", "Scroll, resize, mousemove"],
        ["During a burst", "Nothing runs", "Runs regularly"]
      ]},
      cheat: [
        "Debounce = run once after N ms of quiet",
        "Effect: `setTimeout` + cleanup `clearTimeout`",
        "Keep input state instant; debounce the expensive work",
        "Search 300-500 ms; autosave ~1 s",
        "Stable deps or the timer keeps resetting",
        "Request debouncing + abort: API-026"
      ]
    },
    related: ["HOOKS-027", "API-026", "PERF-014", "HOOKS-015"]
  },

  "PERF-014": {
    tldr: "Throttling runs a handler **at most once every N ms**, however often the event fires. Use it for scroll, resize and mousemove, which can fire 60-120 times a second.",
    analogy: { icon: "🚰", text: "A water dispenser that gives one cup every few seconds, however many times you press the button. Pressing harder doesn't pour faster." },
    visual: { type: "timeline", title: "1 second of scrolling a long recipe page", frames: [
      { label: "0 ms", state: "scroll → handler runs", note: "First event runs immediately." },
      { label: "8-99 ms", state: "12 scroll events → ignored", note: "Inside the 100 ms window." },
      { label: "100 ms", state: "handler runs", note: "Next window opens." },
      { label: "1000 ms", state: "~10 runs total", note: "Instead of ~120. Final position still handled." }
    ]},
    points: [
      "Throttle = run now, then **ignore** calls until the window passes (plus a **trailing** call for the final value).",
      "For visual updates, `requestAnimationFrame` is a natural throttle: at most once per frame.",
      "Add listeners in `useEffect` with `{ passive: true }` and **remove** them (and pending timers) in cleanup.",
      "Only call `setState` when the value actually changes (e.g. `showTop` flips), to avoid extra renders.",
      "Often you don't need a handler: CSS `position: sticky`, IntersectionObserver or ResizeObserver can replace scroll/resize maths."
    ],
    code: { file: "BackToTop.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

function throttle(fn, ms) {
  let last = 0, timer;
  const run = () => { last = Date.now(); fn(); };
  const throttled = () => {
    const wait = ms - (Date.now() - last);
    clearTimeout(timer);
    if (wait <= 0) run();
    else timer = setTimeout(run, wait);
  };
  throttled.cancel = () => clearTimeout(timer);
  return throttled;
}

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => setShow(window.scrollY > 600), 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      onScroll.cancel();
    };
  }, []);

  return show && (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      ↑ Top
    </button>
  );
}`, walk: [
      { lines: [3, 14], note: "A small throttle: run if 100 ms have passed, otherwise schedule one trailing run for the final position." },
      { lines: [20], note: "The handler runs at most every 100 ms. `setShow` with the same boolean doesn't re-render." },
      { lines: [21], note: "`passive: true` promises we won't `preventDefault`, so the browser can scroll without waiting for JS." },
      { lines: [22, 25], note: "Cleanup removes the listener and any pending trailing call (important on unmount and in Strict Mode)." }
    ]},
    output: "Scrolling for 2 s on a phone: unthrottled handler 236 calls, ~14 ms of scripting per second. Throttled at 100 ms: 21 calls, ~1 ms per second. Button appears after 600px.",
    mistakes: [
      { bad: `useEffect(() => {\n  window.addEventListener('scroll', onScroll);\n}, []);`, good: `useEffect(() => {\n  window.addEventListener('scroll', onScroll, { passive: true });\n  return () => window.removeEventListener('scroll', onScroll);\n}, []);`, why: "Without cleanup, listeners pile up on every mount (twice in Strict Mode dev) and leak after unmount." },
      { bad: `const onScroll = () => setY(window.scrollY);`, good: `const onScroll = throttle(\n  () => setShow(window.scrollY > 600), 100);`, why: "Storing raw scroll position re-renders 100+ times a second. Throttle, and store only the derived value you show." }
    ],
    practice: [
      { level: "B", q: "Change the throttle window to 200 ms. What's the trade-off?", a: "Fewer calls (cheaper) but the button reacts up to 200 ms late." },
      { level: "I", q: "Throttle with `requestAnimationFrame` instead of a timer.", a: "Skip calls while a frame is pending.", code: `let frame = 0;\nconst onScroll = () => {\n  if (frame) return;\n  frame = requestAnimationFrame(() => {\n    frame = 0;\n    setShow(window.scrollY > 600);\n  });\n};\n// cleanup: cancelAnimationFrame(frame)` },
      { level: "I", q: "Track window width on resize for a responsive layout. Throttle or debounce?", a: "Throttle if the layout must follow live; debounce if you only need the final size. Often a CSS media query or ResizeObserver is better." },
      { level: "C", q: "Replace the scroll handler with an IntersectionObserver.", a: "Put a 1px sentinel element at 600px; observe it and `setShow(!entry.isIntersecting)`. No scroll events at all." }
    ],
    quiz: [
      { q: "A scroll handler throttled to 100 ms runs at most how often?", options: ["Every scroll event", "10 times per second", "Once after scrolling stops", "Once per page load"], answer: 1, why: "1000 ms / 100 ms = 10." },
      { q: "Why add `{ passive: true }` to a scroll listener?", options: ["It throttles automatically", "Tells the browser it can scroll without waiting for the handler", "It removes the listener", "It enables `preventDefault`"], answer: 1, why: "Passive listeners can't block scrolling, so scrolling stays smooth." },
      { q: "Which is best handled by debounce rather than throttle?", options: ["Sticky header shadow while scrolling", "Search after the user stops typing", "Drag-to-resize panel", "Scroll progress bar"], answer: 1, why: "You want one run after the burst ends." }
    ],
    rev: {
      sec30: "Throttling caps a handler at once per N ms (or per frame with requestAnimationFrame), with a trailing call for the final value. Use it for scroll, resize and pointer moves. In React: add the listener in `useEffect` with `{ passive: true }`, remove it and cancel timers in cleanup, and store only derived state. Prefer IntersectionObserver/ResizeObserver/CSS when possible.",
      interview: [
        { level: "basic", q: "What is throttling?", a: "Limiting a function to run at most once in a fixed time window, no matter how many events fire." },
        { level: "intermediate", q: "When would you throttle instead of debounce?", a: "When you need regular updates during continuous activity, like scroll position or drag, rather than one update at the end." },
        { level: "advanced", q: "Why is `requestAnimationFrame` a good throttle for visual updates?", a: "It runs once per frame, right before paint, so you never compute more often than the screen can show." },
        { level: "tricky", q: "Your throttled handler misses the final scroll position. Why?", a: "It has no trailing call: events in the last window were dropped. Schedule a trailing run with the latest value." }
      ],
      cheat: [
        "Throttle = at most once per N ms",
        "Use for scroll, resize, mousemove, drag",
        "Add a trailing call for the final value",
        "`requestAnimationFrame` = once per frame",
        "Listener with `{ passive: true }`",
        "Cleanup: remove listener + cancel timer/frame",
        "IntersectionObserver / ResizeObserver often beat scroll maths"
      ]
    },
    related: ["PERF-013", "HOOKS-028", "HOOKS-005"]
  },

  "PERF-015": {
    tldr: "The fastest request is the one you **don't make**. Cut network cost by caching responses, deduplicating requests, prefetching what the user will need next, and compressing what you send.",
    analogy: { icon: "🛍️", text: "One big weekly shop with a list beats ten trips to the corner store. And grabbing tomorrow's bread while you're already out means it's there when you need it." },
    visual: { type: "flow", title: "Opening a recipe from a list", steps: [
      { label: "Preconnect", detail: "`preconnect('https://img.cdn…')` warms up DNS + TLS before images are needed." },
      { label: "Hover", detail: "`queryClient.prefetchQuery` fetches the recipe while the mouse is on the link." },
      { label: "Click", detail: "Data is already in the cache: the page renders instantly, 0 new requests." },
      { label: "Revisit", detail: "Within `staleTime` (60 s) the cached recipe is used without refetching." },
      { label: "Transfer", detail: "Server sends Brotli/gzip JSON: ~70% fewer bytes." }
    ]},
    points: [
      "**Deduplicate**: TanStack Query shares one request between every component using the same `queryKey`.",
      "**Cache**: set `staleTime` so data isn't refetched on every mount or window focus.",
      "**Prefetch** likely-next data on hover/focus (`prefetchQuery`) or next pages in a list.",
      "React 19 resource hints from `react-dom`: `preconnect`, `prefetchDNS`, `preload`, `preinit`.",
      "**Compression** (Brotli/gzip) is a server/CDN setting. Check `content-encoding` in DevTools Network. Also avoid waterfalls: fetch in parallel."
    ],
    code: { file: "RecipeList.jsx", lang: "jsx", src: `import { preconnect } from 'react-dom';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const recipeQuery = (id) => ({
  queryKey: ['recipe', id],
  queryFn: async () => {
    const res = await fetch(\`/api/recipes/\${id}\`);
    if (!res.ok) throw new Error('Failed to load recipe');
    return res.json();
  },
  staleTime: 60_000,
});

export default function RecipeList() {
  preconnect('https://img.recipes-cdn.example');
  const queryClient = useQueryClient();
  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => fetch('/api/recipes').then((r) => r.json()),
    staleTime: 60_000,
  });

  return (
    <ul>
      {recipes.map((r) => (
        <li key={r.id}>
          <Link to={\`/recipes/\${r.id}\`}
            onMouseEnter={() => queryClient.prefetchQuery(recipeQuery(r.id))}>
            {r.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}`, walk: [
      { lines: [5, 13], note: "One shared query definition. The detail page calls `useQuery(recipeQuery(id))` and finds the prefetched data." },
      { lines: [12], note: "`staleTime: 60_000`: data counts as fresh for 60 s, so remounts and tab focus don't refetch." },
      { lines: [16], note: "React 19 `preconnect` opens the connection to the image CDN early. React dedupes repeated calls." },
      { lines: [29], note: "Hovering a link starts the fetch ~200-300 ms before the click lands." }
    ]},
    output: "Browsing 10 recipes and back. Before (plain fetch in useEffect): 38 requests, 1.2 MB, ~450 ms spinner per page. After: 11 requests, 310 KB with Brotli, recipe pages open with no spinner.",
    mistakes: [
      { bad: `const user = await getUser();\nconst orders = await getOrders();\n// two sequential round trips`, good: `const [user, orders] = await Promise.all([\n  getUser(), getOrders(),\n]);`, why: "Independent requests in sequence form a waterfall. Run them in parallel." },
      { bad: `useQuery({ queryKey: ['recipes'], queryFn })\n// staleTime defaults to 0`, good: `useQuery({ queryKey: ['recipes'], queryFn,\n  staleTime: 60_000 })`, why: "With `staleTime: 0`, data refetches on every new mount and window focus. Pick a freshness that fits the data." }
    ],
    practice: [
      { level: "B", q: "Check whether your API responses are compressed.", a: "DevTools → Network → click a request → Response Headers: look for `content-encoding: br` or `gzip`." },
      { level: "I", q: "Prefetch page 2 of a product list while page 1 is shown.", a: "`queryClient.prefetchQuery({ queryKey: ['products', page + 1], queryFn: () => getPage(page + 1) })` in an effect or on render of page 1." },
      { level: "I", q: "Three components each need the logged-in user. How many requests with TanStack Query?", a: "One: they share the `['user']` key, so the request is deduplicated and cached." },
      { level: "C", q: "A product page fetches product → then reviews → then related items, one after another. Fix it.", a: "If reviews and related only need the product id from the URL, start all three in parallel (`useQueries`, or a route loader with `Promise.all`)." }
    ],
    quiz: [
      { q: "What does `prefetchQuery` on hover do?", options: ["Blocks navigation until loaded", "Starts loading data into the cache before the click", "Disables caching", "Compresses the response"], answer: 1, why: "The click then finds the data ready." },
      { q: "Where is response compression configured?", options: ["In React components", "On the server or CDN", "In `useEffect`", "In `package.json`"], answer: 1, why: "The server encodes; the browser decodes automatically." },
      { q: "Two components call `useQuery` with the same key at once. How many requests?", options: ["Two", "One, shared", "None", "Depends on Strict Mode"], answer: 1, why: "TanStack Query deduplicates in-flight requests by key." }
    ],
    rev: {
      sec30: "Network optimisation: avoid requests (cache with `staleTime`, dedupe by query key), start them earlier (prefetch on hover, `preconnect`/`preload` from `react-dom`), run independent ones in parallel (no waterfalls), and send fewer bytes (Brotli/gzip at the server, smaller payloads). Measure request count and KB in DevTools Network.",
      interview: [
        { level: "basic", q: "Name three ways to reduce network requests.", a: "Cache responses, deduplicate identical requests, and combine or avoid unneeded calls." },
        { level: "intermediate", q: "What is a request waterfall and how do you fix it?", a: "Requests that wait on each other unnecessarily. Start independent requests in parallel, e.g. `Promise.all` or route loaders." },
        { level: "advanced", q: "How does prefetching improve perceived speed?", a: "Data or code for the likely next screen is fetched during idle time or hover, so navigation renders from cache without a spinner." },
        { level: "tricky", q: "Can prefetching hurt?", a: "Yes: prefetching too much wastes bandwidth and server load, especially on mobile data. Prefetch on clear intent signals." }
      ],
      cheat: [
        "Best request = no request (cache + dedupe)",
        "TanStack Query: same `queryKey` = one request",
        "`staleTime` stops refetch on every mount/focus",
        "Prefetch on hover: `queryClient.prefetchQuery`",
        "`preconnect` / `preload` from `react-dom` (React 19)",
        "Parallel, not waterfall: `Promise.all`",
        "Brotli/gzip at the server; check `content-encoding`"
      ]
    },
    related: ["PERF-016", "STORE-020", "API-029"]
  },

  "PERF-016": {
    tldr: "Cache at three levels: the **browser** keeps files (HTTP cache), the **query cache** keeps API data (TanStack Query), and **memo** keeps calculations and renders (useMemo, memo). Each level needs a rule for when it's stale.",
    analogy: { icon: "🥫", text: "A kitchen: the pantry holds tins for months (HTTP cache), the fridge holds today's shopping for a few days (query cache), and a chopped onion on the board is reused only for this recipe (memo)." },
    visual: { type: "layers", title: "Where a cached value lives", items: [
      { label: "Memo (component)", detail: "`useMemo` / `memo`: lasts while the component is mounted and deps match." },
      { label: "Query cache (app memory)", detail: "TanStack Query: fresh for `staleTime`, kept for `gcTime` after unused." },
      { label: "HTTP cache (browser/CDN)", detail: "`Cache-Control` headers: hashed JS/CSS for a year; HTML and APIs revalidate." }
    ]},
    points: [
      "**HTTP**: Vite's hashed files (`index-a1b2.js`) can use `Cache-Control: public, max-age=31536000, immutable`; `index.html` must use `no-cache`.",
      "**HTTP for APIs**: `ETag` + `If-None-Match` lets the server answer `304 Not Modified` with no body.",
      "**Query**: `staleTime` = how long data is fresh (no refetch); `gcTime` = how long unused data stays in memory (default 5 min).",
      "**Invalidate** after changes: `queryClient.invalidateQueries({ queryKey: ['notes'] })` after a mutation.",
      "**Memo**: `useMemo` for derived values, `memo` for components. Shortest-lived, per component instance."
    ],
    code: { file: "Notes.jsx", lang: "jsx", src: `import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const getNotes = () => fetch('/api/notes').then((r) => r.json());
const addNote = (text) =>
  fetch('/api/notes', { method: 'POST', body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' } });

export default function Notes({ tag }) {
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    staleTime: 30_000,
    gcTime: 10 * 60_000,
  });

  const add = useMutation({
    mutationFn: addNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const tagged = useMemo(() => notes.filter((n) => n.tags.includes(tag)), [notes, tag]);

  return (
    <>
      <button onClick={() => add.mutate('New idea')}>Add note</button>
      <ul>{tagged.map((n) => <li key={n.id}>{n.text}</li>)}</ul>
    </>
  );
}`, walk: [
      { lines: [12, 17], note: "Query cache: fresh for 30 s (no refetch), kept in memory for 10 min after the last user unmounts." },
      { lines: [19, 22], note: "After a successful add, mark `['notes']` stale so it refetches. The cache stays correct." },
      { lines: [24], note: "Memo cache: filtering by tag reruns only when `notes` or `tag` changes." }
    ]},
    output: "Switching between Notes and Settings 10 times in 30 s: no cache 10 requests (~180 ms spinner each). With staleTime: 1 request, instant tab switches. Repeat visit: JS/CSS from disk cache (0 bytes), API returns 304 (~200 B).",
    mistakes: [
      { bad: `# all files\nCache-Control: max-age=31536000`, good: `# assets/*-[hash].js|css\nCache-Control: public, max-age=31536000, immutable\n# index.html\nCache-Control: no-cache`, why: "If `index.html` is cached for a year, users never see new releases: it keeps pointing to old hashed files." },
      { bad: `onSuccess: () => {} // after adding a note`, good: `onSuccess: () =>\n  queryClient.invalidateQueries({ queryKey: ['notes'] })`, why: "Without invalidation the cached list stays fresh for `staleTime` and the new note doesn't appear." }
    ],
    practice: [
      { level: "B", q: "Which files from `vite build` can be cached for a year?", a: "Hashed files in `dist/assets/`. Not `index.html`." },
      { level: "I", q: "Exchange rates update every hour. Pick `staleTime`.", a: "Around `60 * 60_000` (1 hour). Shorter if being out of date costs money." },
      { level: "I", q: "What's the difference between `staleTime` and `gcTime`?", a: "`staleTime`: how long data is used without refetching. `gcTime`: how long unused data stays in memory before removal." },
      { level: "C", q: "Show the new note instantly instead of waiting for the refetch.", a: "Update the cache directly in `onSuccess` with `setQueryData(['notes'], old => [...old, newNote])`, or use an optimistic update with rollback." }
    ],
    quiz: [
      { q: "Why can `index-a1b2.js` be cached “forever”?", options: ["JS never changes", "Its name changes when its content changes", "Browsers ignore cache headers for JS", "Vite deletes old files"], answer: 1, why: "Content hash in the filename = new URL for new code." },
      { q: "With `staleTime: 30_000`, a component remounts after 10 s. What happens?", options: ["Refetch", "Uses cached data, no request", "Error", "Clears the cache"], answer: 1, why: "Data is still fresh." },
      { q: "Which cache lasts the shortest?", options: ["HTTP cache", "Query cache", "`useMemo` in a component"], answer: 2, why: "It's tied to one mounted component instance." }
    ],
    rev: {
      sec30: "Cache at three levels. HTTP: long `immutable` caching for hashed assets, `no-cache` for `index.html`, `ETag`/304 for APIs. Query: TanStack Query `staleTime` (fresh) and `gcTime` (kept), invalidate after mutations. Memo: `useMemo`/`memo` inside components. Every cache needs an invalidation rule.",
      interview: [
        { level: "basic", q: "What caching layers exist in a React app?", a: "Browser/CDN HTTP cache, an in-memory server-state cache like TanStack Query, and component-level memoisation." },
        { level: "intermediate", q: "How should a Vite SPA set cache headers?", a: "Hashed assets: `max-age=31536000, immutable`. `index.html`: `no-cache` so new deploys are picked up." },
        { level: "advanced", q: "Explain `staleTime` vs `gcTime`.", a: "`staleTime` controls when cached data needs a background refetch; `gcTime` controls how long inactive data stays in memory before garbage collection." },
        { level: "tricky", q: "“There are only two hard things in computer science…” How do you handle cache invalidation in the UI?", a: "Tie caches to keys, invalidate the affected keys after mutations, use short `staleTime` for volatile data, and content-hash static files." }
      ],
      compare: { cols: ["", "HTTP", "Query", "Memo"], rows: [
        ["Stores", "Files, API responses", "API data", "Values, render output"],
        ["Lives", "Browser/CDN, survives reloads", "App memory", "One component instance"],
        ["Invalidate by", "New hash / ETag", "`invalidateQueries`", "Deps change"]
      ]},
      cheat: [
        "Hashed assets: `max-age=31536000, immutable`",
        "`index.html`: `no-cache`",
        "APIs: `ETag` → `304 Not Modified`",
        "`staleTime` = fresh window; `gcTime` = memory window",
        "Mutation → `invalidateQueries({ queryKey })`",
        "`useMemo`/`memo` = per-component cache",
        "Every cache needs an invalidation rule"
      ]
    },
    related: ["STORE-022", "PERF-015", "API-029", "PROD-008"]
  },

  "PERF-017": {
    tldr: "Rendering must be quick. Heavy work belongs **outside render**: compute once, cache it, do it in the event handler, or send it to a **Web Worker** so the main thread (and your UI) never freezes.",
    analogy: { icon: "👨‍🍳", text: "A chef who stops taking orders to bake a three-hour cake leaves customers waiting. Hand the cake to a second cook in the back (worker) and keep serving." },
    visual: { type: "compare", title: "Summarising 300,000 shop sales", left: { label: "In render (main thread)", tone: "bad", points: [
      "Runs on every render: 420 ms each time",
      "Clicks and typing freeze (long task)",
      "INP ~450 ms: feels broken",
      "Spinner can't even animate"
    ]}, right: { label: "In a Web Worker", tone: "good", points: [
      "Runs in a background thread",
      "Main thread stays free: UI responsive",
      "Result arrives via `postMessage`",
      "INP ~40 ms while it works"
    ]}},
    points: [
      "A **long task** is main-thread work over **50 ms**. During it, the page ignores clicks and typing.",
      "Ladder of fixes: don't redo it (`useMemo`, compute once at module level) → do it on the **event**, not every render → keep input urgent (`useTransition` / `useDeferredValue`) → move it to a **Worker**.",
      "Vite workers: `new Worker(new URL('./x.worker.js', import.meta.url), { type: 'module' })`.",
      "Workers can't touch the DOM or React state. Send plain data in, get plain data back.",
      "Always `terminate()` the worker (or ignore stale results) in the effect cleanup."
    ],
    code: { file: "SalesReport.jsx", lang: "jsx", src: `// stats.worker.js
// self.onmessage = (e) => {
//   const sales = e.data;
//   let total = 0;
//   const byProduct = {};
//   for (const s of sales) {
//     total += s.amount;
//     byProduct[s.product] = (byProduct[s.product] ?? 0) + s.amount;
//   }
//   self.postMessage({ total, byProduct });
// };

import { useEffect, useState } from 'react';

export default function SalesReport({ sales }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const worker = new Worker(
      new URL('./stats.worker.js', import.meta.url),
      { type: 'module' }
    );
    worker.onmessage = (e) => setStats(e.data);
    worker.postMessage(sales);
    return () => worker.terminate();
  }, [sales]);

  if (!stats) return <p>Crunching {sales.length.toLocaleString()} sales…</p>;
  return <h2>Total: £{stats.total.toFixed(2)}</h2>;
}`, walk: [
      { lines: [2, 11], note: "The worker file: a plain loop over the data, then `postMessage` sends the result back." },
      { lines: [19, 22], note: "Vite bundles the worker from `new URL(..., import.meta.url)`; `type: 'module'` allows `import` inside it." },
      { lines: [23, 24], note: "Send the sales in; receive stats as a message and store them in state." },
      { lines: [25], note: "Cleanup stops the worker if `sales` changes or the component unmounts, so stale results never land. (Strict Mode dev starts it twice; cleanup handles it.)" }
    ]},
    output: "300,000 sales on a mid-range phone. In render: 420 ms long task on every render, typing frozen. In a Worker: main thread busy ~6 ms (copying data), result after ~380 ms in the background, input stays smooth.",
    mistakes: [
      { bad: `function Report({ sales }) {\n  const stats = summarise(sales); // 420 ms\n  const [q, setQ] = useState('');`, good: `function Report({ sales }) {\n  const stats = useMemo(() => summarise(sales), [sales]);\n  const [q, setQ] = useState('');`, why: "Heavy work in the render body reruns on every keystroke in `q`. At minimum, cache it; if it's still slow, use a Worker." },
      { bad: `worker.postMessage({ sales, onDone: setStats });`, good: `worker.postMessage(sales);\nworker.onmessage = (e) => setStats(e.data);`, why: "Functions and DOM nodes can't be sent to a worker (structured clone). Send data, receive data." }
    ],
    practice: [
      { level: "B", q: "Is sorting 50 todos in render a problem?", a: "No. It takes microseconds. Only move work that measures as slow (> a few ms)." },
      { level: "I", q: "A filter over 20,000 products makes typing lag. Name a fix without Workers.", a: "Keep the input urgent and defer the list: `const deferred = useDeferredValue(query)` and filter with `deferred` (plus `useMemo`)." },
      { level: "I", q: "Find long tasks on your page.", a: "DevTools Performance panel: record, then look for red-cornered tasks over 50 ms on the Main track." },
      { level: "C", q: "Run a CSV import (parsing 5 MB) without freezing the page.", a: "Read the file, transfer it to a worker, parse there (in chunks with progress messages), then `postMessage` the parsed rows back." }
    ],
    quiz: [
      { q: "What is a long task?", options: ["A request over 1 s", "Main-thread work over 50 ms", "A component over 100 lines", "An effect without cleanup"], answer: 1, why: "Long tasks block input handling and hurt INP." },
      { q: "What can a Web Worker NOT do?", options: ["Loop over big arrays", "Use `fetch`", "Update the DOM or call `setState` directly", "Receive messages"], answer: 2, why: "Workers have no DOM; they send results back with `postMessage`." },
      { q: "First thing to try for a slow calculation in render?", options: ["A Web Worker", "Cache it with `useMemo` or compute it once", "A class component", "`setTimeout(0)`"], answer: 1, why: "Avoid repeating work before moving it to another thread." }
    ],
    rev: {
      sec30: "Render must be fast and pure. Heavy work over ~50 ms is a long task that blocks input. Fixes in order: compute less often (`useMemo`, module level), do it in the event handler, keep input urgent with `useTransition`/`useDeferredValue`, and finally move it to a Web Worker (`new Worker(new URL(...), { type: 'module' })`), terminating it in cleanup.",
      interview: [
        { level: "basic", q: "Why is heavy work inside render a problem?", a: "Render runs often and on the main thread, so slow work there delays every update and blocks user input." },
        { level: "intermediate", q: "When would you use a Web Worker in React?", a: "For CPU-heavy work like parsing, image processing or big aggregations that still takes too long after caching, so the main thread stays responsive." },
        { level: "advanced", q: "How do `useTransition` and Workers differ for slow work?", a: "`useTransition` makes the slow re-render interruptible but it still runs on the main thread. A Worker runs the computation in parallel on another thread." },
        { level: "tricky", q: "Is posting data to a Worker free?", a: "No. Data is copied by structured clone; huge objects take time. Use transferable objects (`ArrayBuffer`) or send smaller pieces." }
      ],
      cheat: [
        "Long task = main thread busy > 50 ms",
        "Don't redo it: `useMemo` / module-level constant",
        "Do it on the event, not every render",
        "Keep input urgent: `useDeferredValue` / `useTransition`",
        "Worker: `new Worker(new URL('./x.worker.js', import.meta.url), { type: 'module' })`",
        "Data in/out via `postMessage`; no DOM in workers",
        "Cleanup: `worker.terminate()`"
      ]
    },
    related: ["PERF-005", "HOOKS-014", "HOOKS-015", "PERF-020"]
  },

  "PERF-018": {
    tldr: "When a context value changes, **every** component that reads it re-renders. Keep that small: **split** context by how often it changes (data vs actions), and **memoise** the value object.",
    analogy: { icon: "📢", text: "A shop's loudspeaker. If every announcement goes to every department, the bakery hears about shoe sales all day. Separate channels: each team only hears what concerns them." },
    visual: { type: "tree", title: "Cart context split in two", root: { label: "CartProvider", note: "items state + actions", children: [
      { label: "CartItemsContext", note: "changes on every add", children: [
        { label: "CartBadge", note: "re-renders: needs count" },
        { label: "CartDrawer", note: "re-renders: shows items" }
      ]},
      { label: "CartActionsContext", note: "stable, never changes", children: [
        { label: "ProductCard ×200", note: "only needs addItem: skipped" }
      ]}
    ]}},
    points: [
      "React compares the context `value` with `Object.is`. A new object every render = every consumer re-renders.",
      "Wrap the value in `useMemo` (and functions in `useCallback`) so it only changes when the data does.",
      "**Split** fast-changing data from stable actions: components that only call `addItem` stop re-rendering.",
      "React 19: render `<CartContext value={...}>` directly as the provider (`.Provider` still works).",
      "Still too many updates? Use a store with **selectors** (Zustand, Redux `useSelector`) that only re-renders on the slice you read."
    ],
    code: { file: "CartContext.jsx", lang: "jsx", src: `import { createContext, use, useCallback, useMemo, useState } from 'react';

const CartItemsContext = createContext([]);
const CartActionsContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems((prev) => [...prev, product]);
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const actions = useMemo(() => ({ addItem, clear }), [addItem, clear]);

  return (
    <CartActionsContext value={actions}>
      <CartItemsContext value={items}>
        {children}
      </CartItemsContext>
    </CartActionsContext>
  );
}

export const useCartItems = () => use(CartItemsContext);
export const useCartActions = () => use(CartActionsContext);

// ProductCard only needs the action, so adding items doesn't re-render it:
// const { addItem } = useCartActions();`, walk: [
      { lines: [3, 4], note: "Two contexts: one for data that changes often, one for actions that never change." },
      { lines: [9, 12], note: "`useCallback` + the updater form keep both functions stable for the provider's lifetime." },
      { lines: [14], note: "`useMemo` keeps the actions object the same reference, so its consumers aren't notified." },
      { lines: [17, 21], note: "React 19 syntax: the context itself is the provider." },
      { lines: [25, 26], note: "Small hooks hide which context is which. `use(Context)` works like `useContext`." }
    ]},
    output: "200 product cards + badge. One context with `{ items, addItem }` created inline: adding to cart renders 202 components, ~24 ms. Split + memoised: 2 components (badge, drawer), ~1.5 ms.",
    mistakes: [
      { bad: `<CartContext value={{ items, addItem }}>`, good: `const value = useMemo(\n  () => ({ items, addItem }), [items, addItem]);\n<CartContext value={value}>`, why: "An inline object is new every time the provider renders, so every consumer re-renders even when nothing changed." },
      { bad: `// One AppContext with user, theme, cart, toasts`, good: `// UserContext, ThemeContext, CartContext...\n// each changes on its own schedule`, why: "A toast changing every few seconds would re-render every component that reads only the theme." }
    ],
    practice: [
      { level: "B", q: "Memoise `{ theme, toggleTheme }` for a ThemeContext.", a: "`useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])` with `toggleTheme` in `useCallback`." },
      { level: "I", q: "Why doesn't wrapping a consumer in `memo` stop context re-renders?", a: "`memo` only checks props. A component that reads a context re-renders whenever that context value changes." },
      { level: "I", q: "A badge needs only the item count. How can it avoid re-rendering when a quantity changes but count doesn't?", a: "Plain context can't select a slice. Use a store with selectors (Zustand `useStore(s => s.items.length)`)." },
      { level: "C", q: "Measure the split: what do you compare?", a: "Profiler: number of components rendered and commit ms when clicking Add to cart, before and after splitting." }
    ],
    quiz: [
      { q: "How does React decide context consumers must update?", options: ["Deep compare of value", "`Object.is` on the value", "Every render, always", "Only when props change"], answer: 1, why: "Reference comparison, so a new object always counts as a change." },
      { q: "Why split actions into their own context?", options: ["Required by React 19", "Actions are stable, so components using only them stop re-rendering", "It makes the bundle smaller", "To avoid prop drilling"], answer: 1, why: "Their value never changes, so their consumers are never notified." },
      { q: "In React 19, which is the provider?", options: ["`<Ctx.Consumer>`", "`<Ctx value={v}>`", "`useContext(Ctx, v)`", "`<Provider ctx={Ctx}>`"], answer: 1, why: "The context object renders as a provider; `.Provider` still works." }
    ],
    rev: {
      sec30: "Every consumer re-renders when the context value changes (`Object.is`). Memoise the value with `useMemo`/`useCallback`, split contexts by concern and by change rate (state vs actions), and keep providers low in the tree. For high-frequency or slice-based reads, use a store with selectors. Measure with the Profiler.",
      interview: [
        { level: "basic", q: "When do context consumers re-render?", a: "Whenever the provider's `value` changes by reference, regardless of `memo` on the consumer." },
        { level: "intermediate", q: "How do you stop a context from re-rendering everything?", a: "Memoise the value, split state and actions into separate contexts, and split unrelated concerns into separate providers." },
        { level: "advanced", q: "Why split state and dispatch into two contexts?", a: "Dispatch/actions are stable, so components that only trigger updates don't re-render when the state changes." },
        { level: "tricky", q: "Is context a good tool for a value that changes 60 times a second?", a: "No. Every consumer re-renders each time. Use local state, a ref, or an external store with selectors." }
      ],
      cheat: [
        "Consumers re-render when `value` changes (`Object.is`)",
        "`useMemo` the value, `useCallback` the functions",
        "Split: data context + actions context",
        "Split by concern: user, theme, cart",
        "`memo` does not block context updates",
        "React 19: `<Ctx value={v}>` is the provider",
        "Slices / high frequency → store with selectors"
      ]
    },
    related: ["COMM-008", "COMM-007", "STORE-017", "PERF-006"]
  },

  "PERF-019": {
    tldr: "React Compiler adds memoisation for you at build time, so components and values skip work automatically. Turn it on, then **measure** render counts and Profiler ms before and after on real screens.",
    analogy: { icon: "🤖", text: "A smart kitchen assistant who notices which ingredients haven't changed and keeps them prepped, so you stop writing “reuse the chopped onions” on every recipe." },
    visual: { type: "flow", title: "Trying the compiler on a shop app", steps: [
      { label: "Baseline", detail: "Profile 3 key flows (search, add to cart, open product). Note render counts and ms." },
      { label: "Lint first", detail: "Fix `eslint-plugin-react-hooks` errors: the compiler skips code that breaks the rules." },
      { label: "Enable", detail: "Add the Babel preset in `vite.config.js` (all files, or opt-in with annotations)." },
      { label: "Verify", detail: "DevTools shows a **Memo ✨** badge on compiled components." },
      { label: "Re-measure", detail: "Same flows, same device. Compare numbers; test for behaviour changes." }
    ]},
    points: [
      "React Compiler (1.0, stable) is a **build-time** plugin. It memoises components, JSX and values like `memo` + `useMemo` + `useCallback` would.",
      "Vite 8 + `@vitejs/plugin-react` v6: `npm i -D babel-plugin-react-compiler @rolldown/plugin-babel @babel/core`, then `babel({ presets: [reactCompilerPreset()] })`.",
      "It only compiles code that follows the **Rules of React** (pure render, no mutating props/state). Lint rules show what it skips.",
      "Opt out one component with `'use no memo'`; adopt gradually with `compilationMode: 'annotation'` + `'use memo'`.",
      "It doesn't fix slow algorithms, huge lists or big bundles: you still need virtualization, workers and code splitting."
    ],
    code: { file: "vite.config.js", lang: "js", src: `import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
      // gradual rollout: only components marked 'use memo'
      // presets: [reactCompilerPreset({ compilationMode: 'annotation' })],
    }),
  ],
});

// ProductList.jsx: no manual memo needed any more
// export default function ProductList({ products, query, onAdd }) {
//   const visible = products.filter((p) => p.name.includes(query));
//   return visible.map((p) => (
//     <ProductCard key={p.id} product={p} onAdd={() => onAdd(p.id)} />
//   ));
// }

// Opt a single component out if it misbehaves:
// function LegacyChart() { 'use no memo'; /* ... */ }`, walk: [
      { lines: [2, 3], note: "Plugin-react v6 has no built-in Babel; React Compiler runs through `@rolldown/plugin-babel` with the exported preset." },
      { lines: [8, 12], note: "`reactCompilerPreset()` compiles every component; switch to `annotation` mode to roll out file by file." },
      { lines: [17, 22], note: "Plain code: the compiler caches `visible` and the per-row `onAdd` closures, so unchanged cards are skipped." },
      { lines: [25], note: "`'use no memo'` excludes one component while you investigate." }
    ]},
    output: "Shop app, Add to cart on a 300-card page. Before: 302 components rendered, 31 ms commit. After the compiler (no code changes): 3 components, 2.4 ms. Search typing: 18 ms → 9 ms (the filter itself still runs). Bundle +~2 KB gzip.",
    mistakes: [
      { bad: `function Cart({ items }) {\n  items.push(freeGift); // mutates a prop\n  return <List items={items} />;\n}`, good: `function Cart({ items }) {\n  const all = [...items, freeGift];\n  return <List items={all} />;\n}`, why: "Code that breaks the Rules of React is skipped by the compiler (or can behave differently once memoised). Fix lint errors first." },
      { bad: `// Enabled the compiler → removed every useMemo\n// without measuring`, good: `// Keep existing useMemo/useCallback for now;\n// remove them gradually, measuring each flow`, why: "The compiler works alongside manual memo. Removing it blindly can change effect dependencies and behaviour." }
    ],
    practice: [
      { level: "B", q: "How do you confirm a component was compiled?", a: "React DevTools shows a **Memo ✨** badge next to its name." },
      { level: "I", q: "Roll the compiler out to one feature folder only.", a: "Use `compilationMode: 'annotation'` and add `'use memo'` to components in that folder." },
      { level: "I", q: "After enabling, a chart stops updating. First step?", a: "Add `'use no memo'` to that component to confirm, then look for a Rules of React violation (mutation, reading a ref during render)." },
      { level: "C", q: "Design a before/after measurement plan.", a: "Production build, same device/throttling, 3 key flows, record render count + commit ms in the Profiler and INP. Compare medians of several runs." }
    ],
    quiz: [
      { q: "When does React Compiler do its work?", options: ["At runtime in the browser", "At build time", "On the server per request", "Only in development"], answer: 1, why: "It transforms your code during the build, adding caching." },
      { q: "What happens to a component that breaks the Rules of React?", options: ["Build fails", "The compiler skips optimising it", "It's deleted", "It runs twice"], answer: 1, why: "It bails out on code it can't safely memoise." },
      { q: "Which problem does the compiler NOT solve?", options: ["Unstable callback props", "Re-rendering unchanged children", "A 10,000-row list in the DOM"], answer: 2, why: "That's a DOM-size problem: use virtualization." }
    ],
    rev: {
      sec30: "React Compiler 1.0 is a build-time plugin that auto-memoises components, values and callbacks. In Vite 8 use `@rolldown/plugin-babel` with `reactCompilerPreset()` from `@vitejs/plugin-react`. It skips code that breaks the Rules of React, so fix lint errors first. Opt out with `'use no memo'`. Measure renders and ms before/after; it won't fix big lists, slow algorithms or bundle size.",
      interview: [
        { level: "basic", q: "What does React Compiler do?", a: "It analyses components at build time and inserts memoisation automatically, so you rarely need `memo`, `useMemo` or `useCallback`." },
        { level: "intermediate", q: "Do you still need `useMemo` and `useCallback` with the compiler?", a: "Rarely. Mainly as an escape hatch for precise control, e.g. a value used as an effect dependency, or in code the compiler skips." },
        { level: "advanced", q: "How would you adopt the compiler in a large existing app?", a: "Fix react-hooks lint errors, enable in annotation mode or per folder, measure key flows, roll out wider, and use `'use no memo'` for problem components." },
        { level: "tricky", q: "Your app got no faster after enabling the compiler. Why might that be?", a: "The bottleneck wasn't re-rendering: maybe a slow calculation, a huge DOM, network waterfalls or bundle size. Profile to find the real cost." }
      ],
      cheat: [
        "Build-time auto-memoisation (React Compiler 1.0)",
        "Vite 8: `@rolldown/plugin-babel` + `reactCompilerPreset()`",
        "DevTools badge: **Memo ✨**",
        "Follows Rules of React; skips code that breaks them",
        "Opt out: `'use no memo'`; opt in: `'use memo'` (annotation mode)",
        "Doesn't fix big lists, slow loops or bundle size",
        "Measure before/after in a production build"
      ]
    },
    related: ["ADV-021", "ADV-022", "PERF-004", "PERF-002"]
  },

  "PERF-020": {
    tldr: "Core Web Vitals are Google's three user-experience scores: **LCP** (how fast the main content appears), **INP** (how fast the page reacts) and **CLS** (how much the layout jumps). Measure them from real users and fix the worst.",
    analogy: { icon: "🍕", text: "Ordering pizza: how fast it arrives (LCP), how fast the staff respond when you ask for extra napkins (INP), and whether the box gets bumped so the toppings slide (CLS)." },
    visual: { type: "flow", title: "One visit, three scores", steps: [
      { label: "Page loads", detail: "**LCP**: biggest image/text block painted. Good ≤ **2.5 s**." },
      { label: "Ads/images arrive", detail: "**CLS**: unexpected layout movement. Good ≤ **0.1**." },
      { label: "User clicks Add", detail: "**INP**: input until next paint. Good ≤ **200 ms**." },
      { label: "Page hidden", detail: "`web-vitals` reports final values; send them to analytics." },
      { label: "Judge at p75", detail: "Pass if 75% of real visits are “good”." }
    ]},
    points: [
      "**LCP** fixes: optimise and prioritise the hero image (`fetchPriority=\"high\"`, AVIF), smaller initial JS (code splitting), SSR/static HTML for content.",
      "**INP** fixes: break up long tasks, keep handlers light, `useTransition`/`useDeferredValue`, virtualise big lists, Workers for heavy work.",
      "**CLS** fixes: `width`/`height` on images, reserve space for ads/embeds/lazy content, avoid inserting banners above content, `font-display` choices.",
      "Lab data (Lighthouse, DevTools) helps debug; **field data** (real users via `web-vitals`, CrUX) is what counts.",
      "Measure in a production build. INP replaced FID as a Core Web Vital in March 2024."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { onCLS, onINP, onLCP } from 'web-vitals';
import App from './App';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,        // 'LCP' | 'INP' | 'CLS'
    value: metric.value,      // ms for LCP/INP, unitless for CLS
    rating: metric.rating,    // 'good' | 'needs-improvement' | 'poor'
    page: location.pathname,
  });
  navigator.sendBeacon('/api/vitals', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);`, walk: [
      { lines: [3], note: "`npm i web-vitals`: Google's tiny library that measures the metrics the same way Chrome does." },
      { lines: [7, 12], note: "Each metric has a name, value and a ready-made rating against the thresholds." },
      { lines: [13], note: "`sendBeacon` still delivers when the tab is closing, which is when final INP/CLS are reported." },
      { lines: [16, 18], note: "Register once at startup. Callbacks fire when values are final (often on page hide)." }
    ]},
    output: "Shop product page, p75 on mobile. Before: LCP 4.1 s, INP 380 ms, CLS 0.24 (all poor). After hero AVIF + priority, route splitting, virtualised reviews, image dimensions: LCP 2.1 s, INP 140 ms, CLS 0.03 (all good).",
    mistakes: [
      { bad: `<div>{banner && <PromoBanner />}</div>\n<ProductGrid />`, good: `<div style={{ minHeight: 60 }}>\n  {banner && <PromoBanner />}\n</div>\n<ProductGrid />`, why: "A banner that appears after load pushes the grid down: a layout shift (CLS). Reserve its space." },
      { bad: `// Lighthouse 98 on my laptop → done`, good: `// Track field data (web-vitals / CrUX) at p75\n// on real phones and networks`, why: "Lab tests use one device and network. Real users on slower phones decide your actual scores." }
    ],
    practice: [
      { level: "B", q: "Give the “good” thresholds for LCP, INP and CLS.", a: "LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, measured at the 75th percentile." },
      { level: "I", q: "INP is 400 ms when filtering a list. Name two fixes.", a: "Wrap the list update in `useTransition` (or `useDeferredValue`), memoise/virtualise the list, or move the filtering to a Worker." },
      { level: "I", q: "LCP element is a CSS background image. What helps?", a: "Use an `<img>` with `fetchPriority=\"high\"`, or preload it (`preload(url, { as: 'image' })` from `react-dom`) so it's discovered early." },
      { level: "C", q: "Log which element caused the LCP in production.", a: "Use the attribution build: `import { onLCP } from 'web-vitals/attribution'` and read `metric.attribution.target`." }
    ],
    quiz: [
      { q: "Which metric measures responsiveness to clicks and typing?", options: ["LCP", "CLS", "INP", "TTFB"], answer: 2, why: "Interaction to Next Paint." },
      { q: "What is a good CLS score?", options: ["≤ 0.1", "≤ 1 s", "≤ 200 ms", "≥ 90"], answer: 0, why: "CLS is unitless; ≤ 0.1 is good." },
      { q: "Images without `width`/`height` mostly hurt which metric?", options: ["INP", "CLS", "Bundle size", "TTFB"], answer: 1, why: "The page reflows when they load, shifting content." }
    ],
    rev: {
      sec30: "Core Web Vitals: LCP (main content shown, ≤ 2.5 s), INP (interaction to next paint, ≤ 200 ms) and CLS (layout stability, ≤ 0.1), judged at p75 of real visits. Measure with the `web-vitals` library and send to analytics; debug with Lighthouse/DevTools. LCP: hero image + less JS. INP: break long tasks, transitions, virtualization. CLS: reserve space.",
      interview: [
        { level: "basic", q: "What are the three Core Web Vitals?", a: "LCP for loading, INP for interactivity, and CLS for visual stability." },
        { level: "intermediate", q: "How do you measure Web Vitals in a React app?", a: "Use the `web-vitals` library (`onLCP`, `onINP`, `onCLS`) in the entry file and send results to analytics; use Lighthouse and DevTools for lab debugging." },
        { level: "advanced", q: "How would you improve INP in a React app?", a: "Find long tasks in the Performance panel, then reduce render work (memo, compiler, virtualization), mark slow updates as transitions, and move heavy computation to Workers." },
        { level: "tricky", q: "Lighthouse says 95 but Search Console says “poor”. Why?", a: "Lighthouse is lab data on one simulated device. Search Console uses field data from real users at p75, often on slower phones and networks." }
      ],
      compare: { cols: ["", "LCP", "INP", "CLS"], rows: [
        ["Measures", "Loading", "Responsiveness", "Visual stability"],
        ["Good", "≤ 2.5 s", "≤ 200 ms", "≤ 0.1"],
        ["Top React fix", "Hero image + code splitting", "Transitions, less render work", "Reserve space"]
      ]},
      cheat: [
        "LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1",
        "Judged at the 75th percentile of real visits",
        "`npm i web-vitals` → `onLCP`, `onINP`, `onCLS`",
        "Field data (users) beats lab data (Lighthouse)",
        "LCP: prioritise hero image, ship less JS",
        "INP: break long tasks, `useTransition`, virtualise",
        "CLS: `width`/`height`, reserve space for late content",
        "INP replaced FID in March 2024"
      ]
    },
    related: ["PERF-001", "PERF-012", "PERF-017", "PROD-014"]
  }
};
