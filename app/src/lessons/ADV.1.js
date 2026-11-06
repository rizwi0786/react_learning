export default {
  "ADV-001": {
    tldr: "`React.memo` wraps a component so React can **skip re-rendering it** when its props are the same as last time (shallow equal). Use it for slow components whose parent re-renders often.",
    analogy: { icon: "🧾", text: "A cashier who sees the same shopping list as last time and hands back yesterday's receipt instead of scanning every item again." },
    visual: { type: "flow", title: "Parent re-renders: does the memo child?", steps: [
      { label: "Parent re-renders", detail: "`Shop` state changes (e.g. the search box), so React walks into its children." },
      { label: "Reach memo child", detail: "`ProductList` is wrapped in `memo`, so React checks its props first." },
      { label: "Shallow compare", detail: "Each prop is compared with `Object.is`: old `items` vs new `items`, old `onAdd` vs new `onAdd`." },
      { label: "All equal? Skip", detail: "React reuses the last output. `ProductList` function is not called." },
      { label: "Any different? Render", detail: "A new object, array or function prop counts as different, so it renders as normal." }
    ]},
    points: [
      "`const Fast = memo(Slow)` returns a new component; use it exactly like the original.",
      "Comparison is **shallow**: `{}` !== `{}`, so new objects, arrays or arrow functions each render break the memo.",
      "Pair with `useMemo` for objects/arrays and `useCallback` for functions you pass down.",
      "A memo component **still re-renders** when its own state or a context it reads changes.",
      "It's a performance hint, not a guarantee. With **React Compiler** on, most manual `memo` is unnecessary."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { memo, useCallback, useState } from 'react';

const ProductList = memo(function ProductList({ items, onAdd }) {
  console.log('ProductList rendered');
  return (
    <ul>
      {items.map(p => (
        <li key={p.id}>
          {p.name} <button onClick={() => onAdd(p)}>Add</button>
        </li>
      ))}
    </ul>
  );
});

const PRODUCTS = [{ id: 1, name: 'Apples' }, { id: 2, name: 'Bread' }];

export default function Shop() {
  const [note, setNote] = useState('');
  const [cart, setCart] = useState([]);

  const handleAdd = useCallback(p => setCart(c => [...c, p]), []);

  return (
    <>
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Order note" />
      <p>Cart: {cart.length}</p>
      <ProductList items={PRODUCTS} onAdd={handleAdd} />
    </>
  );
}` , walk: [
      { lines: [3], note: "Wrap the component in `memo`. Naming the inner function keeps a nice name in DevTools." },
      { lines: [16], note: "`PRODUCTS` lives outside the component, so it's the same array every render." },
      { lines: [22], note: "`useCallback` keeps `handleAdd` the same function between renders." },
      { lines: [26, 28], note: "Typing a note re-renders `Shop`, but `ProductList` props are unchanged, so it's skipped." }
    ]},
    output: "“ProductList rendered” logs once on mount (twice in dev: Strict Mode). Typing a note or clicking Add re-renders `Shop` but logs nothing more: the list's props never changed.",
    mistakes: [
      { bad: `<ProductList items={PRODUCTS} onAdd={p => addToCart(p)} />`, good: `const onAdd = useCallback(p => addToCart(p), []);\n<ProductList items={PRODUCTS} onAdd={onAdd} />`, why: "An inline arrow is a brand-new function every render, so the shallow compare fails and `memo` does nothing." },
      { bad: `<ProductList filter={{ inStock: true }} />`, good: `const filter = useMemo(() => ({ inStock: true }), []);\n<ProductList filter={filter} />`, why: "An object literal is a new reference each render. Memoize it or move it outside the component." }
    ],
    practice: [
      { level: "B", q: "Wrap a `Avatar({ url })` component with `memo`.", a: "Import `memo` and export the wrapped version.", code: `import { memo } from 'react';\nexport default memo(function Avatar({ url }) {\n  return <img src={url} alt="" />;\n});` },
      { level: "I", q: "A memo `Chart` still re-renders on every keystroke. Its props are `data={rows.filter(r => r.ok)}`. Fix it.", a: "`filter` makes a new array each render. Wrap it: `const okRows = useMemo(() => rows.filter(r => r.ok), [rows])`." },
      { level: "I", q: "Write a custom comparison so `Song` only re-renders when `song.id` changes.", a: "Pass a second argument that returns **true to skip**.", code: `const Song = memo(SongRow, (prev, next) => prev.song.id === next.song.id);` },
      { level: "C", q: "A memo child reads `useContext(ThemeContext)`. The theme changes. Does it re-render? Why?", a: "Yes. `memo` only skips renders caused by the parent with equal props. Context changes always re-render consumers." }
    ],
    quiz: [
      { q: "How does `memo` compare props by default?", options: ["Deep equality, like JSON.stringify", "Shallow: each prop with `Object.is`", "It doesn't compare; it caches forever", "Only compares `children`"], answer: 1, why: "Each prop is compared by reference/value with `Object.is`. Nested contents are not inspected." },
      { q: "A memo child gets `onClick={() => save()}`. Parent re-renders. What happens?", options: ["Child skips", "Child re-renders: new function each render", "React throws a warning"], answer: 1, why: "Inline functions are new references, so props are never equal." },
      { q: "The custom compare function `(prev, next) => ...` should return true when...", options: ["The component should re-render", "Props are equal and rendering can be skipped", "An error occurred"], answer: 1, why: "It's `arePropsEqual`: true means equal, so skip. It's the opposite of the old `shouldComponentUpdate`." }
    ],
    rev: {
      sec30: "`memo(Component)` lets React skip a re-render when the parent re-renders but the props are shallowly equal. It's broken by new object/array/function props each render, so pair it with `useMemo`/`useCallback`. Own state and context changes still re-render. React Compiler auto-memoizes, so manual `memo` is mostly for code without the compiler.",
      interview: [
        { level: "basic", q: "What does `React.memo` do?", a: "It memoizes a component's output and skips re-rendering it when its props are shallowly equal to the previous render's props." },
        { level: "intermediate", q: "Why might a `memo` component still re-render?", a: "A prop is a new reference (inline object, array, arrow function), its own state changed, or a context it reads changed." },
        { level: "intermediate", q: "Should you wrap every component in `memo`?", a: "No. The compare has a cost and most renders are cheap. Measure with the Profiler and memo only slow components that re-render with the same props." },
        { level: "advanced", q: "How does React Compiler change the advice on `memo`?", a: "The compiler automatically memoizes components and values at build time, so most hand-written `memo`, `useMemo` and `useCallback` become unnecessary." },
        { level: "tricky", q: "Does `memo` help if the parent passes `children` JSX?", a: "Usually not. `<Card><Title /></Card>` creates new `children` elements each render, so the prop always differs." }
      ],
      predict: [
        { code: `const Row = memo(({ item }) => { console.log('row'); return <li>{item.name}</li>; });\nfunction List() {\n  const [n, setN] = useState(0);\n  return <>\n    <button onClick={() => setN(n + 1)}>+</button>\n    <Row item={{ name: 'Milk' }} />\n  </>;\n}`, answer: "Logs “row” on every click", why: "`{ name: 'Milk' }` is a new object each render, so the shallow compare fails." }
      ],
      cheat: [
        "`export default memo(MyComponent)`",
        "Skips render when every prop is `Object.is` equal",
        "Breakers: inline `{}`, `[]`, `() => {}` props",
        "Fix with `useMemo` / `useCallback` or hoist constants",
        "Custom compare: `memo(C, (prev, next) => true /* skip */)`",
        "Own state + context changes still re-render",
        "React Compiler makes most manual memo unnecessary"
      ]
    },
    related: ["PERF-004", "RENDER-019", "HOOKS-010", "ADV-022"]
  },

  "ADV-002": {
    tldr: "`React.lazy` loads a component's code **only when it's first rendered**, so the first page download is smaller. Wrap it in `<Suspense>` to show something while it loads.",
    analogy: { icon: "🍽️", text: "A restaurant doesn't cook every dish on the menu when you sit down. It cooks the dessert only when you order it, and shows “coming soon” meanwhile." },
    visual: { type: "flow", title: "First time a lazy component renders", steps: [
      { label: "Declare", detail: "`const Chart = lazy(() => import('./Chart.jsx'))` at the top of the file. Nothing downloads yet." },
      { label: "Render <Chart />", detail: "React calls the loader. Vite already split `Chart.jsx` into its own chunk at build time." },
      { label: "Suspend", detail: "The code isn't here yet, so React shows the nearest `<Suspense fallback>`." },
      { label: "Chunk arrives", detail: "The browser downloads the chunk; the module's **default export** becomes the component." },
      { label: "Render for real", detail: "React swaps the fallback for `Chart`. Later renders reuse the cached module instantly." }
    ]},
    points: [
      "`lazy(() => import('./File.jsx'))` needs the file to have a **default export** that is a component.",
      "Declare lazy components at **module top level**, never inside another component (state would reset each render).",
      "Must sit under a `<Suspense fallback={...}>` somewhere above it.",
      "Named export? `lazy(() => import('./Charts.jsx').then(m => ({ default: m.PieChart })))`.",
      "Best for big, not-always-needed UI: admin pages, charts, editors, modals. Route-level splitting is the usual first win."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { lazy, Suspense, useState } from 'react';

// Downloaded only when first rendered
const RecipeEditor = lazy(() => import('./RecipeEditor.jsx'));

export default function App() {
  const [editing, setEditing] = useState(false);

  return (
    <main>
      <h1>My Recipes</h1>
      <button onClick={() => setEditing(true)}>New recipe</button>

      {editing && (
        <Suspense fallback={<p>Loading editor…</p>}>
          <RecipeEditor onClose={() => setEditing(false)} />
        </Suspense>
      )}
    </main>
  );
}

// RecipeEditor.jsx
// export default function RecipeEditor({ onClose }) { ... }` , walk: [
      { lines: [4], note: "`lazy` takes a function returning `import()`. Vite turns this into a separate JS chunk." },
      { lines: [14, 15], note: "Only after the click do we render the editor, which triggers the download." },
      { lines: [15], note: "`Suspense` shows the fallback while the chunk is in flight." },
      { lines: [16], note: "Props pass through to the real component as normal." }
    ]},
    output: "Page loads without the editor code. Clicking “New recipe” briefly shows “Loading editor…”, then the editor. A second open is instant.",
    mistakes: [
      { bad: `function Page() {\n  const Editor = lazy(() => import('./Editor.jsx'));\n  return <Editor />;\n}`, good: `const Editor = lazy(() => import('./Editor.jsx'));\nfunction Page() {\n  return <Editor />;\n}`, why: "Inside a component, every render creates a new lazy type, so React remounts it and loses its state." },
      { bad: `// Editor.jsx\nexport function Editor() {}\n// App.jsx\nlazy(() => import('./Editor.jsx'))`, good: `lazy(() => import('./Editor.jsx').then(m => ({ default: m.Editor })))`, why: "`lazy` reads the module's `default` export. With only a named export you get an error." }
    ],
    practice: [
      { level: "B", q: "Lazy-load a `Weather.jsx` widget with a “Loading weather…” fallback.", a: "Declare with `lazy` at top level and wrap in `Suspense`.", code: `const Weather = lazy(() => import('./Weather.jsx'));\n<Suspense fallback={<p>Loading weather…</p>}><Weather /></Suspense>` },
      { level: "I", q: "Preload the editor chunk when the user hovers the button.", a: "Call the same `import()` early; the browser caches the module so `lazy` resolves instantly.", code: `const load = () => import('./RecipeEditor.jsx');\nconst RecipeEditor = lazy(load);\n<button onMouseEnter={load} onClick={open}>New recipe</button>` },
      { level: "I", q: "How do you check that a separate chunk was created?", a: "Run `npm run build` and look in `dist/assets/` for a `RecipeEditor-*.js` file, or watch the Network tab when you click." },
      { level: "C", q: "The chunk fails to load (offline). What does the user see and how do you handle it?", a: "The `lazy` promise rejects and the error is thrown during render. Put an **error boundary** around the `Suspense` to show a retry message." }
    ],
    quiz: [
      { q: "What must the imported module provide for `lazy`?", options: ["A named export called `Component`", "A default export that is a component", "Any export; React finds it", "A JSON file"], answer: 1, why: "`lazy` awaits the promise and uses `module.default`." },
      { q: "When does the lazy component's code download?", options: ["At page load", "When the `lazy()` line runs", "The first time it's rendered", "At build time only"], answer: 2, why: "The loader function is called on first render, not on declaration." },
      { q: "What happens if no `<Suspense>` is above a lazy component that is loading?", options: ["It renders nothing silently", "React suspends up to the root, no fallback to show", "It renders synchronously"], answer: 1, why: "React needs a Suspense boundary to know what to show. Without one the whole root has nothing to display while loading." }
    ],
    rev: {
      sec30: "`React.lazy(() => import('./X.jsx'))` turns a component into a code-split chunk loaded on first render. It must be a default export, declared at module top level, and rendered inside `<Suspense>`. Handle load failures with an error boundary. Common targets: routes, modals, charts, editors.",
      interview: [
        { level: "basic", q: "What is `React.lazy` for?", a: "Code splitting at the component level: the component's code is downloaded only when it's first rendered, shrinking the initial bundle." },
        { level: "intermediate", q: "Why must lazy components be declared outside other components?", a: "Each `lazy()` call makes a new component type. Inside a render it changes every time, so React remounts it and resets state." },
        { level: "intermediate", q: "How do you lazy-load a named export?", a: "Map it to default: `lazy(() => import('./x').then(m => ({ default: m.Named })))`." },
        { level: "advanced", q: "How would you avoid a loading flash when the user is likely to open a lazy view?", a: "Preload by calling the same `import()` on hover/focus or after idle, and wrap the navigation in `startTransition` so the old UI stays until it's ready." },
        { level: "tricky", q: "Does `lazy` work for server-rendered HTML?", a: "Yes in React 18+ streaming SSR with Suspense; in a client-only Vite app it's purely a client download optimisation." }
      ],
      debug: [
        { code: `function Dashboard() {\n  const Stats = lazy(() => import('./Stats.jsx'));\n  return <Suspense fallback="…"><Stats /></Suspense>;\n}`, fix: `const Stats = lazy(() => import('./Stats.jsx'));\nfunction Dashboard() {\n  return <Suspense fallback="…"><Stats /></Suspense>;\n}`, why: "Moving `lazy` to module scope gives a stable component type, so it loads once and keeps its state." }
      ],
      cheat: [
        "`const X = lazy(() => import('./X.jsx'))`",
        "Module must `export default` the component",
        "Declare at top level, not inside a component",
        "Needs a `<Suspense fallback>` above it",
        "Named export: `.then(m => ({ default: m.Name }))`",
        "Preload by calling `import()` early",
        "Wrap in an error boundary for failed chunk loads"
      ]
    },
    related: ["ADV-003", "ADV-013", "ADV-014", "ROUTE-020"]
  },

  "ADV-003": {
    tldr: "`<Suspense>` shows a **fallback** (spinner, skeleton) while something inside it is not ready yet: lazy code, or data read with a Suspense-enabled source. When it's ready, React swaps in the real UI.",
    analogy: { icon: "🎵", text: "A playlist app shows grey placeholder tiles while album covers load. The page layout stays put; each tile fills in when its cover arrives." },
    visual: { type: "timeline", title: "A Suspense boundary over time", frames: [
      { label: "Render", state: "<Suspense> → <Playlist />", note: "React tries to render the children." },
      { label: "Child suspends", state: "Playlist: data not ready", note: "A lazy component or `use(promise)` signals “not ready”." },
      { label: "Fallback shown", state: "UI = <Skeleton />", note: "React shows the nearest boundary's `fallback` instead of the whole subtree." },
      { label: "Data ready", state: "promise resolved", note: "React retries rendering the children automatically." },
      { label: "Reveal", state: "UI = <Playlist />", note: "The whole boundary appears at once, never half-filled." }
    ]},
    points: [
      "`<Suspense fallback={<Spinner />}>children</Suspense>`: the boundary catches “not ready” from **any** child below.",
      "What triggers it: `lazy` components, `use(promise)` with a cached promise, and Suspense-enabled libraries (TanStack Query `useSuspenseQuery`, frameworks).",
      "Fetching in `useEffect` does **not** trigger Suspense.",
      "Nest boundaries to reveal parts independently; one boundary = one loading unit.",
      "Updates wrapped in `startTransition` keep showing old content instead of flipping back to the fallback."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { Suspense, use } from 'react';

// Create the promise once, outside render (or get it from a cache/library)
const forecastPromise = fetch('https://api.example.com/weather?city=Lahore')
  .then(r => r.json());

function Forecast() {
  const forecast = use(forecastPromise); // suspends until resolved
  return <p>{forecast.city}: {forecast.tempC}°C</p>;
}

function Skeleton() {
  return <p className="skeleton">Loading forecast…</p>;
}

export default function App() {
  return (
    <main>
      <h1>Weather</h1>
      <Suspense fallback={<Skeleton />}>
        <Forecast />
      </Suspense>
    </main>
  );
}` , walk: [
      { lines: [4, 5], note: "The promise is created once. Creating it inside the component would make a new one every render (infinite suspend)." },
      { lines: [8], note: "`use(promise)` returns the value if resolved, otherwise suspends this component." },
      { lines: [20], note: "The boundary decides what to show while any child is suspended." },
      { lines: [19], note: "The heading is outside the boundary, so it shows immediately." }
    ]},
    output: "“Weather” appears at once with “Loading forecast…”, then it is replaced by e.g. “Lahore: 31°C”.",
    mistakes: [
      { bad: `function Forecast() {\n  const data = use(fetch('/api/weather').then(r => r.json()));\n  return <p>{data.tempC}</p>;\n}`, good: `const weatherPromise = fetch('/api/weather').then(r => r.json());\nfunction Forecast() {\n  const data = use(weatherPromise);\n  return <p>{data.tempC}</p>;\n}`, why: "A promise created during render is new every time, so React suspends forever. Cache it outside or use a library." },
      { bad: `<Suspense fallback={<Spinner />}>\n  <Header /><Sidebar /><Feed /><Footer />\n</Suspense>`, good: `<Header />\n<Suspense fallback={<FeedSkeleton />}>\n  <Feed />\n</Suspense>\n<Footer />`, why: "One boundary around everything hides the whole page for one slow part. Wrap only what's actually loading." }
    ],
    practice: [
      { level: "B", q: "Give a lazy `Chat` panel a “Connecting…” fallback.", a: "Wrap it in Suspense.", code: `<Suspense fallback={<p>Connecting…</p>}><Chat /></Suspense>` },
      { level: "I", q: "A page has a profile and a slow order list. Show the profile as soon as it's ready, independently of orders.", a: "Use two sibling boundaries, one per section, each with its own skeleton." },
      { level: "I", q: "Switching tabs flips the content back to a spinner. How do you keep the old tab visible until the new one loads?", a: "Wrap the state update in `startTransition(() => setTab(next))`. React keeps the already-revealed UI instead of showing the fallback." },
      { level: "C", q: "Why doesn't a component that fetches in `useEffect` show the Suspense fallback?", a: "It never suspends: it renders immediately with empty state and fetches after commit. Only render-time “not ready” signals (lazy, `use`, Suspense libraries) trigger Suspense." }
    ],
    quiz: [
      { q: "Which of these triggers a Suspense fallback?", options: ["`useEffect(() => fetch(...))`", "A `lazy()` component still downloading", "`setTimeout` in an event handler", "A slow `map()` over 10,000 items"], answer: 1, why: "Suspense reacts to components that suspend during render: lazy code, `use(promise)`, Suspense-enabled data sources." },
      { q: "Two children inside one boundary; one is ready, one is loading. What shows?", options: ["The ready child plus a spinner", "Only the fallback", "Both children, one empty"], answer: 1, why: "A boundary reveals its contents together. Split into two boundaries for independent reveal." },
      { q: "How do you stop already-visible content being replaced by a fallback on navigation?", options: ["Remove the boundary", "Wrap the update in `startTransition`", "Use `useLayoutEffect`"], answer: 1, why: "Transitions tell React to keep showing the old UI while the new one prepares." }
    ],
    rev: {
      sec30: "Suspense is a boundary that shows a fallback while children suspend. Suspending sources: `lazy`, `use(cachedPromise)`, Suspense-enabled libraries/frameworks, not `useEffect` fetching. Boundaries reveal their content together; nest them to control loading order. `startTransition` keeps already-shown content instead of flashing the fallback. On the server, boundaries also enable streaming SSR.",
      interview: [
        { level: "basic", q: "What is Suspense?", a: "A component that shows a fallback UI while anything inside it is waiting for code or data, then shows the real content when ready." },
        { level: "intermediate", q: "Does Suspense fetch data?", a: "No. It only coordinates loading UI. The data source (`use`, TanStack Query suspense mode, a framework) has to suspend." },
        { level: "intermediate", q: "How do nested boundaries behave?", a: "The nearest boundary above a suspending component shows its fallback. Inner boundaries let parts appear progressively while outer content stays." },
        { level: "advanced", q: "Why does `startTransition` change Suspense behaviour?", a: "In a transition React won't hide already-revealed content; it keeps the old UI on screen (you can show `isPending`) until the new tree is ready." },
        { level: "tricky", q: "Why must the promise passed to `use` be cached?", a: "If it's created in render, each retry makes a new pending promise, so the component suspends forever." }
      ],
      compare: { cols: ["", "useEffect fetch", "Suspense + use / library"], rows: [
        ["When data loads", "After first paint", "Can start before render"],
        ["Loading UI", "Manual `isLoading` flags", "Declarative `fallback`"],
        ["Shows fallback?", "No", "Yes"]
      ]},
      cheat: [
        "`<Suspense fallback={<X />}>…</Suspense>`",
        "Triggers: `lazy`, `use(promise)`, Suspense libraries",
        "`useEffect` fetching never suspends",
        "Nearest boundary wins; contents reveal together",
        "Nest boundaries for progressive loading",
        "`startTransition` keeps old UI, no fallback flash",
        "Cache promises; never create them in render"
      ]
    },
    related: ["ADV-002", "ADV-018", "HOOKS-014", "STORE-020"]
  },

  "ADV-004": {
    tldr: "An **error boundary** is a component that catches errors thrown while rendering its children and shows a backup UI instead of a blank page. Write one as a class, or use the `react-error-boundary` package.",
    analogy: { icon: "🧯", text: "One broken shelf label in a shop shouldn't close the whole shop. The manager covers that shelf with a “Sorry, back soon” sign and the rest stays open." },
    visual: { type: "flow", title: "An error during render", steps: [
      { label: "Child throws", detail: "`<Comments />` crashes during render, e.g. reading `post.author.name` on `null`." },
      { label: "Bubble up", detail: "React looks up the tree for the nearest error boundary." },
      { label: "getDerivedState…", detail: "`static getDerivedStateFromError(error)` sets `hasError: true` so the fallback renders." },
      { label: "componentDidCatch", detail: "Runs after commit with `error` and `info.componentStack`: log it to Sentry etc." },
      { label: "Fallback shown", detail: "Only that subtree is replaced. No boundary at all? React unmounts the whole app." }
    ]},
    points: [
      "Still **class-only** in React 19: there's no hook version. Most apps use `react-error-boundary` instead of writing the class.",
      "Catches errors in **render, lifecycle methods and effects** of children. Also failed `lazy` chunks.",
      "Does **not** catch: event handlers, `setTimeout`/async code, errors in the boundary itself, or server rendering.",
      "For async/handler errors: catch them and store in state, or use `showBoundary(error)` from `useErrorBoundary`.",
      "Place boundaries around independent widgets (feed, chat, chart) plus one at the top. Reset with a key or `resetErrorBoundary`."
    ],
    code: { file: "Notes.jsx", lang: "jsx", src: `import { Component } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 1) Hand-written class boundary
class SimpleBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// 2) Library version with retry
function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Notes failed to load: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default function App() {
  return (
    <SimpleBoundary fallback={<p>Something broke.</p>}>
      <ErrorBoundary FallbackComponent={Fallback} onReset={() => console.log('retry')}>
        <NotesList />
      </ErrorBoundary>
    </SimpleBoundary>
  );
}

function NotesList() {
  const notes = null;
  return <ul>{notes.map(n => <li key={n.id}>{n.text}</li>)}</ul>; // throws
}` , walk: [
      { lines: [7, 8, 9], note: "Called during render after a child throws; return the new state that shows the fallback." },
      { lines: [10, 11, 12], note: "Side effects (logging) go here, not in `getDerivedStateFromError`." },
      { lines: [19, 23], note: "`react-error-boundary` passes `error` and `resetErrorBoundary` to your fallback." },
      { lines: [31], note: "`FallbackComponent` + `onReset`: clicking “Try again” re-renders the children." },
      { lines: [39, 40], note: "`null.map` throws during render, so the inner boundary catches it." }
    ]},
    output: "“Notes failed to load: Cannot read properties of null (reading 'map')” with a Try again button. React also logs the caught error to the console.",
    mistakes: [
      { bad: `<ErrorBoundary fallback={<p>Oops</p>}>\n  <button onClick={() => { throw new Error('x'); }}>Pay</button>\n</ErrorBoundary>`, good: `const { showBoundary } = useErrorBoundary();\n<button onClick={async () => {\n  try { await pay(); } catch (e) { showBoundary(e); }\n}}>Pay</button>`, why: "Boundaries don't catch errors from event handlers or async code. Catch them yourself, then pass them to the boundary." },
      { bad: `<ErrorBoundary fallback={<p>Oops</p>}>\n  <WholeApp />\n</ErrorBoundary>`, good: `<Layout>\n  <ErrorBoundary fallback={<p>Chat unavailable</p>}><Chat /></ErrorBoundary>\n  <ErrorBoundary fallback={<p>Feed unavailable</p>}><Feed /></ErrorBoundary>\n</Layout>`, why: "A single top boundary replaces everything. Smaller boundaries keep the rest of the page usable." }
    ],
    practice: [
      { level: "B", q: "Install the library and wrap a `Weather` widget with a simple fallback.", a: "`npm i react-error-boundary`, then wrap it.", code: `<ErrorBoundary fallback={<p>Weather unavailable</p>}>\n  <Weather />\n</ErrorBoundary>` },
      { level: "I", q: "Reset a boundary automatically when the selected city changes.", a: "Pass `resetKeys={[city]}` to `ErrorBoundary` (or give the boundary `key={city}`)." },
      { level: "I", q: "Show a failed `fetch` inside a `useEffect` in the nearest boundary.", a: "Catch in the effect and call `showBoundary(err)` from `useErrorBoundary()`; the boundary then renders its fallback." },
      { level: "C", q: "Write a class boundary that also accepts an `onError(error)` prop for logging.", a: "Call the prop in `componentDidCatch`.", code: `componentDidCatch(error, info) {\n  this.props.onError?.(error, info);\n}` }
    ],
    quiz: [
      { q: "Which error does an error boundary catch?", options: ["A `throw` inside `onClick`", "A failed `fetch` in `setTimeout`", "A `TypeError` while a child renders", "An error in the boundary's own render"], answer: 2, why: "Boundaries catch errors during rendering, lifecycles and effects of their children only." },
      { q: "Why do we still need a class (or library) for this?", options: ["Hooks are slower", "There's no hook equivalent of `getDerivedStateFromError`/`componentDidCatch` yet", "Classes are required for all state"], answer: 1, why: "React has not shipped a hook for catching render errors; libraries wrap the class for you." },
      { q: "An app has no error boundary and a component throws in render. Result?", options: ["Only that component disappears", "React unmounts the whole root", "The error is ignored in production"], answer: 1, why: "Uncaught render errors remove the entire tree, leaving a blank page." }
    ],
    rev: {
      sec30: "Error boundaries catch errors thrown while rendering children (plus lifecycles/effects and failed lazy loads) and render a fallback. They're class components using `getDerivedStateFromError` (show fallback) and `componentDidCatch` (log). They don't catch event handler, async or SSR errors. In practice use `react-error-boundary` for `FallbackComponent`, `resetErrorBoundary`, `resetKeys` and `useErrorBoundary`.",
      interview: [
        { level: "basic", q: "What's an error boundary?", a: "A component that catches JavaScript errors in its child tree during rendering and shows a fallback UI instead of crashing the whole app." },
        { level: "intermediate", q: "What can't error boundaries catch?", a: "Errors in event handlers, async code like timeouts or promises, server-side rendering, and errors thrown by the boundary itself." },
        { level: "intermediate", q: "`getDerivedStateFromError` vs `componentDidCatch`?", a: "The first runs during render and returns state to show the fallback; the second runs after commit for side effects like logging." },
        { level: "advanced", q: "How do you surface an async error to a boundary?", a: "Catch it and either set state that you throw during render, or call `showBoundary(error)` from `react-error-boundary`'s `useErrorBoundary`." },
        { level: "tricky", q: "After the fallback shows, how does the user recover?", a: "Reset the boundary: `resetErrorBoundary`, `resetKeys`, or changing its `key` remounts the children with fresh state." }
      ],
      scenario: [
        { q: "A chart library sometimes crashes on bad data and blanks the whole dashboard. What do you do?", a: "Wrap each chart in its own error boundary with a small “Chart unavailable” fallback and log errors in `onError`, so other widgets keep working." }
      ],
      cheat: [
        "Class: `getDerivedStateFromError` + `componentDidCatch`",
        "Or `react-error-boundary`: `<ErrorBoundary FallbackComponent>`",
        "Catches render, lifecycle, effect errors in children",
        "Misses: event handlers, async, SSR, itself",
        "`useErrorBoundary().showBoundary(err)` for async errors",
        "Reset: `resetErrorBoundary`, `resetKeys`, or `key`",
        "No boundary = whole app unmounts"
      ]
    },
    related: ["ROUTE-019", "ADV-003", "API-014", "COND-017"]
  },

  "ADV-005": {
    tldr: "A **portal** (`createPortal`) renders a component's JSX into a **different DOM node**, like `document.body`, while it stays in the same place in the React tree. Perfect for modals, tooltips and toasts.",
    analogy: { icon: "📮", text: "You write a note at your desk, but it's pinned on the shop's front noticeboard. It's still your note (you can edit it), it just shows up somewhere else." },
    visual: { type: "compare", title: "Where the modal lives", left: { label: "React tree (logic)", tone: "neutral", points: [
      "`App > Cart > CheckoutModal`",
      "Modal reads Cart's props, state and context",
      "Events bubble to `Cart`'s `onClick`",
      "Unmounts when `Cart` unmounts"
    ]}, right: { label: "DOM tree (pixels)", tone: "good", points: [
      "`<body> > <div id=\"modal-root\">`",
      "Outside `.cart { overflow: hidden }`",
      "Not trapped by parent `z-index`",
      "Can sit above everything on the page"
    ]}},
    points: [
      "`createPortal(children, domNode)` comes from **`react-dom`**, not `react`.",
      "Use it to escape parent CSS: `overflow: hidden`, `z-index` stacking, `transform` clipping.",
      "Context, state and props work exactly as if it rendered in place.",
      "Events bubble through the **React tree**, not the DOM tree: a click in the modal reaches the parent's handlers.",
      "You still own accessibility: `role=\"dialog\"`, `aria-modal`, focus the dialog, close on Escape. The native `<dialog>` element with `showModal()` is a solid alternative."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title}
           className="modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose} autoFocus>Close</button>
      </div>
    </div>,
    document.body
  );
}

export default function Cart() {
  const [open, setOpen] = useState(false);
  return (
    <section className="cart" style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(true)}>Checkout</button>
      {open && (
        <Modal title="Confirm order" onClose={() => setOpen(false)}>
          <p>3 items, total $24.00</p>
        </Modal>
      )}
    </section>
  );
}` , walk: [
      { lines: [2], note: "`createPortal` is a `react-dom` API." },
      { lines: [11, 20], note: "First argument is the JSX, second is the target DOM node." },
      { lines: [14], note: "Stop clicks inside the box from reaching the backdrop's close handler." },
      { lines: [5, 6, 7, 8, 9], note: "Close on Escape; clean up the listener on unmount." },
      { lines: [27, 30], note: "Rendered inside an `overflow: hidden` section, yet the modal isn't clipped." }
    ]},
    output: "Clicking Checkout shows a full-screen modal on top of everything. In DevTools Elements it sits at the end of `<body>`; in React DevTools it sits under `Cart`.",
    mistakes: [
      { bad: `import { createPortal } from 'react';`, good: `import { createPortal } from 'react-dom';`, why: "Portals are a DOM renderer feature, exported from `react-dom`." },
      { bad: `<div onClick={closeMenu}>\n  <Menu />  {/* portal inside */}\n</div>\n// surprised: clicks in the menu call closeMenu`, good: `// Stop propagation inside the portal, or check e.target\n<div className="menu" onClick={e => e.stopPropagation()}>`, why: "Portal events bubble through React ancestors even though the DOM is elsewhere." }
    ],
    practice: [
      { level: "B", q: "Render a toast message into `<div id=\"toasts\">` from `index.html`.", a: "Pass that node as the portal target.", code: `createPortal(<p className="toast">Saved!</p>, document.getElementById('toasts'))` },
      { level: "I", q: "Your modal shows behind a sticky header with `z-index: 10`. Why, and how does a portal help?", a: "The modal is inside a parent with a lower stacking context. Rendering it into `body` escapes that context so its own `z-index` applies." },
      { level: "I", q: "Return focus to the Checkout button when the modal closes.", a: "Keep a ref to the button and call `buttonRef.current.focus()` in the close handler (or the modal's effect cleanup)." },
      { level: "C", q: "Name two things a native `<dialog>` with `showModal()` gives you that a hand-built portal modal doesn't.", a: "It renders in the browser's **top layer** (no z-index fights), makes the page behind inert, and closes on Escape automatically." }
    ],
    quiz: [
      { q: "A click inside a portal modal bubbles to...", options: ["Only `document.body`", "The React parent components' handlers", "Nowhere; portals stop events"], answer: 1, why: "React propagates synthetic events along the React tree, regardless of where the DOM node is." },
      { q: "Does a portal child see the parent's context?", options: ["Yes", "No, it's a separate React root", "Only if you pass `context` to createPortal"], answer: 0, why: "It's part of the same React tree, so context, state and props work normally." },
      { q: "Main reason to use a portal for a tooltip?", options: ["Faster rendering", "Escape parent `overflow` and `z-index` clipping", "SEO", "Required for event handlers"], answer: 1, why: "Portals solve CSS containment problems, not performance." }
    ],
    rev: {
      sec30: "`createPortal(jsx, domNode)` from `react-dom` renders into another DOM node (often `document.body`) while staying in the same React tree. So it escapes CSS clipping/stacking but keeps context and state, and events bubble to React parents. Used for modals, tooltips, dropdowns, toasts. Accessibility (role, focus, Escape) is your job, or use native `<dialog>`.",
      interview: [
        { level: "basic", q: "What is a portal?", a: "A way to render children into a DOM node outside the parent component's DOM hierarchy, using `createPortal` from `react-dom`." },
        { level: "intermediate", q: "Why not just render the modal in place?", a: "Parent styles like `overflow: hidden`, `transform` or a low `z-index` stacking context can clip or bury it. A portal moves the DOM out of that container." },
        { level: "intermediate", q: "How do events behave in a portal?", a: "They bubble through React ancestors, not DOM ancestors, so a parent's `onClick` fires for clicks inside the portal." },
        { level: "advanced", q: "What does an accessible modal need beyond a portal?", a: "`role=\"dialog\"`, `aria-modal`, a label, focus moved in and trapped, Escape to close, background inert, and focus returned to the trigger." },
        { level: "tricky", q: "Does a portal work with server rendering?", a: "No, `createPortal` needs a real DOM node, so render portals only on the client (e.g. after mount)." }
      ],
      cheat: [
        "`createPortal(jsx, domNode)` from `react-dom`",
        "DOM moves; React tree position stays",
        "Context, state, props all work normally",
        "Events bubble via the React tree",
        "Escapes `overflow: hidden` and `z-index` traps",
        "Add `role=\"dialog\"`, `aria-modal`, focus, Escape",
        "Native `<dialog>.showModal()` uses the top layer"
      ]
    },
    related: ["EVT-008", "HOOKS-007", "ADV-007", "COMM-006"]
  },

  "ADV-006": {
    tldr: "A **keyed fragment** (`<Fragment key={id}>`) lets each list item return several sibling elements with no wrapper `<div>`, while still giving React the key it needs. The short `<>` syntax can't take a key.",
    analogy: { icon: "🍳", text: "A recipe card lists “ingredient: amount” pairs. Each pair is two words side by side, not inside a box, but each pair still needs its own label so you can find it." },
    visual: { type: "compare", title: "Two cells per row, no wrapper", left: { label: "<>...</> in a map", tone: "bad", points: [
      "No way to add `key`",
      "Warning: each child should have a unique key",
      "Wrapping in `<div>` breaks `<dl>`, `<table>`, grid"
    ]}, right: { label: "<Fragment key={id}>", tone: "good", points: [
      "Import `Fragment` from `react`",
      "`key` goes on the Fragment",
      "Renders only `<dt>` and `<dd>`, valid HTML",
      "React tracks each pair correctly on reorder"
    ]}},
    points: [
      "`import { Fragment } from 'react'`, then `<Fragment key={item.id}>...</Fragment>` inside `map`.",
      "`<>...</>` is the same thing but **cannot** take a key or any attribute.",
      "Use it when HTML structure forbids a wrapper: `<dl>` pairs, table rows' cells, CSS grid/flex children.",
      "In stable React 19.2, `key` is the only prop a Fragment takes.",
      "Fragments add nothing to the DOM, so CSS selectors like `dl > dt` keep working."
    ],
    code: { file: "Ingredients.jsx", lang: "jsx", src: `import { Fragment } from 'react';

const ingredients = [
  { id: 'flour', name: 'Flour', amount: '200 g' },
  { id: 'milk', name: 'Milk', amount: '300 ml' },
  { id: 'eggs', name: 'Eggs', amount: '2' },
];

export default function Ingredients() {
  return (
    <dl className="ingredients">
      {ingredients.map(item => (
        <Fragment key={item.id}>
          <dt>{item.name}</dt>
          <dd>{item.amount}</dd>
        </Fragment>
      ))}
    </dl>
  );
}` , walk: [
      { lines: [1], note: "The long form must be imported; `<>` needs no import." },
      { lines: [13], note: "The key goes on the outermost element returned from `map`: the Fragment." },
      { lines: [14, 15], note: "Two siblings per item, which is exactly what `<dl>` expects." }
    ]},
    output: "DOM: `<dl><dt>Flour</dt><dd>200 g</dd><dt>Milk</dt><dd>300 ml</dd>...</dl>`, with no extra elements and no key warning.",
    mistakes: [
      { bad: `{items.map(i => (\n  <>\n    <dt>{i.name}</dt>\n    <dd>{i.amount}</dd>\n  </>\n))}`, good: `{items.map(i => (\n  <Fragment key={i.id}>\n    <dt>{i.name}</dt>\n    <dd>{i.amount}</dd>\n  </Fragment>\n))}`, why: "`<>` can't carry a key, so React warns and can't match items correctly on reorder." },
      { bad: `<Fragment key={i.id}>\n  <dt key={i.id}>...</dt>\n</Fragment>`, good: `<Fragment key={i.id}>\n  <dt>...</dt>\n</Fragment>`, why: "Only the outermost element in the `map` needs the key. Inner keys aren't wrong, but they're noise." }
    ],
    practice: [
      { level: "B", q: "Render a playlist as table cells: each song gives `<td>{title}</td><td>{length}</td>` inside one shared `<tr>`. Which wrapper?", a: "`<Fragment key={song.id}>` around the two `<td>`s." },
      { level: "I", q: "In a CSS grid with 2 columns, why would a wrapper `<div>` per item break the layout?", a: "The grid places direct children. A wrapper makes one grid cell per item instead of two." },
      { level: "I", q: "Add a divider `<hr />` after each chat message except the last, keyed.", a: "Return both from a keyed Fragment.", code: `{messages.map((m, i) => (\n  <Fragment key={m.id}>\n    <p>{m.text}</p>\n    {i < messages.length - 1 && <hr />}\n  </Fragment>\n))}` }
    ],
    quiz: [
      { q: "Which can take a `key`?", options: ["`<>`", "`<Fragment>`", "Both", "Neither"], answer: 1, why: "Only the long form accepts attributes; `key` is its one stable prop." },
      { q: "What does `<Fragment>` add to the DOM?", options: ["A `<div>`", "A comment node", "Nothing"], answer: 2, why: "Fragments group children in React only; the DOM gets just the children." },
      { q: "Where does the key go when `map` returns a Fragment with two children?", options: ["On each child", "On the Fragment", "On the parent `<dl>`"], answer: 1, why: "The key belongs on the outermost element returned by each iteration." }
    ],
    rev: {
      sec30: "When each list item renders multiple siblings, wrap them in `<Fragment key={id}>` (imported from `react`). The short `<>` syntax can't take a key. Fragments add no DOM, so they keep `<dl>`, `<table>` and CSS grid structures valid. `key` is the only stable Fragment prop.",
      interview: [
        { level: "basic", q: "What's the difference between `<>` and `<Fragment>`?", a: "Same behaviour, but only `<Fragment>` can take a `key`. `<>` is shorthand with no attributes." },
        { level: "intermediate", q: "When do you need a keyed Fragment?", a: "When `map` returns several sibling elements per item and a wrapper element would break the HTML or layout, like `<dt>/<dd>` pairs." },
        { level: "intermediate", q: "Why not just wrap in a `<div>`?", a: "Extra DOM can create invalid HTML (`<div>` inside `<dl>` or `<tr>`), break grid/flex layout and CSS child selectors." },
        { level: "tricky", q: "Does a Fragment's key affect state of the children?", a: "Yes. Changing the Fragment's key remounts its children, just like keys on any element." }
      ],
      cheat: [
        "`import { Fragment } from 'react'`",
        "`<Fragment key={id}>` inside `map`",
        "`<>` can't take a key",
        "Fragments add no DOM nodes",
        "Use for `<dl>`, table cells, grid children",
        "Key goes on the outermost element per item"
      ]
    },
    related: ["JSX-012", "COND-011", "RENDER-009", "JSX-014"]
  },

  "ADV-007": {
    tldr: "In React 19 a function component can take **`ref` as a normal prop** and pass it to a DOM element. Older code used `forwardRef` to do the same; you'll still read it, but new code doesn't need it.",
    analogy: { icon: "🔑", text: "A hotel guest hands their room key to the concierge, who passes it straight to the right room door. In React 19 the concierge just takes it; before, you needed a special form (`forwardRef`)." },
    visual: { type: "compare", title: "Exposing an input to the parent", left: { label: "React 18: forwardRef", tone: "neutral", points: [
      "`forwardRef((props, ref) => ...)`",
      "`ref` is a second argument, not in props",
      "Anonymous arrows show as `ForwardRef` in DevTools",
      "Still works in 19; planned to be deprecated"
    ]}, right: { label: "React 19: ref as a prop", tone: "good", points: [
      "`function Input({ ref, ...props })`",
      "Just pass it on: `<input ref={ref} />`",
      "Plain function, normal name",
      "Codemod can convert old forwardRef code"
    ]}},
    points: [
      "Parent: `const ref = useRef(null)` then `<SearchBox ref={ref} />`; `ref.current` becomes the inner `<input>`.",
      "Child (React 19): destructure `ref` from props and attach it to a DOM element or another component.",
      "**Ref callbacks** can now return a **cleanup function**, run when the element is removed.",
      "Expose a limited API (just `focus()`) with `useImperativeHandle(ref, () => ({ focus }))`.",
      "Class components still don't receive `ref` as a prop: there it points at the instance."
    ],
    code: { file: "Search.jsx", lang: "jsx", src: `import { useRef, forwardRef } from 'react';

// ✅ React 19: ref is just a prop
function SearchBox({ ref, ...props }) {
  return <input ref={ref} type="search" {...props} />;
}

// 📜 Older code you'll still see (React 18 and earlier)
const OldSearchBox = forwardRef(function OldSearchBox(props, ref) {
  return <input ref={ref} type="search" {...props} />;
});

export default function Notes() {
  const searchRef = useRef(null);

  return (
    <>
      <SearchBox ref={searchRef} placeholder="Search notes" />
      <button onClick={() => searchRef.current.focus()}>Focus search</button>

      {/* Ref callback with cleanup (React 19) */}
      <div ref={node => {
        console.log('mounted', node);
        return () => console.log('removed');
      }} />
      <OldSearchBox placeholder="Legacy box" />
    </>
  );
}` , walk: [
      { lines: [4, 5], note: "React 19: `ref` arrives in props. Forward it to the real `<input>`." },
      { lines: [9, 10, 11], note: "Legacy `forwardRef`: `ref` is a separate second argument. Same result." },
      { lines: [14, 18], note: "The parent creates the ref and passes it like any prop." },
      { lines: [19], note: "After commit, `searchRef.current` is the `<input>` DOM node." },
      { lines: [22, 23, 24, 25], note: "Return a cleanup from a ref callback instead of handling a `null` call." }
    ]},
    output: "Clicking “Focus search” puts the cursor in the search box. Console: “mounted <div>” on mount, “removed” on unmount. In dev, Strict Mode runs the ref callback twice (mounted, removed, mounted).",
    mistakes: [
      { bad: `function SearchBox(props) {\n  return <input {...props} ref={props.innerRef} />;\n}\n<SearchBox innerRef={r} />`, good: `function SearchBox({ ref, ...props }) {\n  return <input ref={ref} {...props} />;\n}\n<SearchBox ref={r} />`, why: "Custom names like `innerRef` were a workaround. In React 19 the standard `ref` prop just works." },
      { bad: `<div ref={n => (listRef.current = n)} />`, good: `<div ref={n => { listRef.current = n; }} />`, why: "With cleanup support, React treats a returned value as a cleanup. Implicit returns from arrow functions are rejected by the types, so use a block body." }
    ],
    practice: [
      { level: "B", q: "Make a `PriceInput` component accept a `ref` that points to its `<input>` (React 19).", a: "Destructure and forward it.", code: `function PriceInput({ ref, ...rest }) {\n  return <input ref={ref} type="number" step="0.01" {...rest} />;\n}` },
      { level: "I", q: "Convert this to React 19 style: `const Btn = forwardRef((p, ref) => <button ref={ref} {...p} />)`.", a: "Drop `forwardRef` and read `ref` from props.", code: `function Btn({ ref, ...p }) {\n  return <button ref={ref} {...p} />;\n}` },
      { level: "I", q: "Expose only `focus()` and `clear()` from a chat input instead of the whole DOM node.", a: "Use `useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus(), clear: () => { inputRef.current.value = ''; } }))` with an inner `inputRef`." },
      { level: "C", q: "Use a ref callback with cleanup to observe when a playlist row scrolls into view.", a: "Create an `IntersectionObserver` in the callback and disconnect it in the returned cleanup.", code: `<li ref={node => {\n  const io = new IntersectionObserver(([e]) => e.isIntersecting && markSeen(id));\n  io.observe(node);\n  return () => io.disconnect();\n}} />` }
    ],
    quiz: [
      { q: "In React 19, how does a function component receive a ref?", options: ["Only via `forwardRef`", "As the `ref` prop", "Via `this.ref`", "It can't"], answer: 1, why: "React 19 passes `ref` as a regular prop to function components." },
      { q: "In `forwardRef((props, ref) => ...)`, is `ref` inside `props`?", options: ["Yes", "No, it's the second argument"], answer: 1, why: "In the legacy API React strips `ref` from props and passes it separately." },
      { q: "What can a React 19 ref callback return?", options: ["Nothing; returns are ignored", "A cleanup function run on detach", "A new ref object"], answer: 1, why: "Returning a function makes React call it when the node is removed, instead of calling the callback with `null`." }
    ],
    rev: {
      sec30: "React 19 lets function components take `ref` as an ordinary prop, so `forwardRef` is no longer needed (it still works and appears in older code, with deprecation planned). Ref callbacks can return a cleanup function. Use `useImperativeHandle` to expose a limited API instead of the raw DOM node. Class components still get the instance, not a ref prop.",
      interview: [
        { level: "basic", q: "Why would a parent need a ref to a child's input?", a: "For imperative DOM actions like focus, scroll, select text or measuring size, which aren't expressed through props." },
        { level: "intermediate", q: "What changed about refs in React 19?", a: "`ref` is now a normal prop for function components, so `forwardRef` isn't required, and ref callbacks can return cleanup functions." },
        { level: "intermediate", q: "How did `forwardRef` work?", a: "It wrapped a render function that received `(props, ref)`; React passed the parent's ref as the second argument so you could attach it to a DOM node." },
        { level: "advanced", q: "When would you use `useImperativeHandle`?", a: "When you want the parent to call a few methods (like `focus` or `reset`) without exposing the whole DOM node or internals." },
        { level: "tricky", q: "Why might `<div ref={n => (x = n)} />` cause a TypeScript error in React 19?", a: "Ref callbacks can now return cleanup functions, so the types reject implicitly returning a non-function value. Use a block body." }
      ],
      compare: { cols: ["", "forwardRef (legacy)", "ref prop (React 19)"], rows: [
        ["Where ref arrives", "2nd argument", "`props.ref`"],
        ["Wrapper needed", "Yes", "No"],
        ["Status", "Works, deprecation planned", "Recommended"]
      ]},
      cheat: [
        "React 19: `function C({ ref }) { return <input ref={ref} /> }`",
        "Legacy: `forwardRef((props, ref) => ...)`",
        "Parent: `const r = useRef(null); <C ref={r} />`",
        "`r.current` is set after commit",
        "Ref callback may return a cleanup function",
        "`useImperativeHandle` exposes a custom API",
        "Class components: ref = instance, not a prop"
      ]
    },
    related: ["HOOKS-007", "HOOKS-012", "EVT-011", "ADV-005"]
  },

  "ADV-008": {
    tldr: "A **higher-order component** (HOC) is a function that takes a component and returns a new one with extra powers (`withAuth(Page)`). Modern code mostly uses **custom hooks** instead, but you'll meet HOCs in older code and libraries.",
    analogy: { icon: "🎁", text: "Gift-wrapping a present: the gift inside is unchanged, the wrapper adds a bow and a card. Stack many wrappers and it gets hard to find the gift." },
    visual: { type: "compare", title: "Same feature, two shapes", left: { label: "HOC: withOnline(Chat)", tone: "neutral", points: [
      "Wraps the component in another component",
      "Injects `isOnline` as a prop",
      "Stacks into wrapper hell in DevTools",
      "Prop name collisions are possible"
    ]}, right: { label: "Hook: useOnline()", tone: "good", points: [
      "Call it inside the component",
      "Returns `isOnline`: you name the variable",
      "No extra tree layers",
      "Easy to combine and type"
    ]}},
    points: [
      "Shape: `const withX = Component => function WithX(props) { ...; return <Component {...props} extra={...} /> }`.",
      "Always **pass through** the other props (`{...props}`) and create HOCs at **module level**, never inside render.",
      "Downsides: wrapper hell, hidden prop sources, name clashes, awkward TypeScript.",
      "Prefer a **custom hook** for shared logic; prefer a wrapper component for shared UI.",
      "Still fine for: cross-cutting wrappers like `memo(C)`, route guards, or library APIs (legacy Redux `connect`)."
    ],
    code: { file: "Chat.jsx", lang: "jsx", src: `import { useSyncExternalStore } from 'react';

function subscribe(cb) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}

// ✅ Modern: custom hook
export function useOnline() {
  return useSyncExternalStore(subscribe, () => navigator.onLine);
}

// 📜 Same logic as a HOC
export function withOnline(Component) {
  function WithOnline(props) {
    const isOnline = useOnline();
    return <Component {...props} isOnline={isOnline} />;
  }
  WithOnline.displayName = 'withOnline(' + (Component.displayName || Component.name) + ')';
  return WithOnline;
}

// Using the hook
export function ChatStatus() {
  const isOnline = useOnline();
  return <p>{isOnline ? '🟢 Online' : '🔴 Offline'}</p>;
}

// Using the HOC
function SendButton({ isOnline }) {
  return <button disabled={!isOnline}>Send</button>;
}
export const SmartSendButton = withOnline(SendButton);` , walk: [
      { lines: [13, 14, 15], note: "A hook: shared logic, returned as a value the component names itself." },
      { lines: [18, 19, 20, 21], note: "A HOC: wraps `Component` and injects `isOnline` as a prop." },
      { lines: [21], note: "`{...props}` passes everything else through untouched." },
      { lines: [23], note: "Set `displayName` so DevTools shows `withOnline(SendButton)`." },
      { lines: [37], note: "Apply the HOC once at module level to get the enhanced component." }
    ]},
    output: "Both show live connection state: `ChatStatus` prints 🟢 Online / 🔴 Offline, and `SmartSendButton` is disabled while offline.",
    mistakes: [
      { bad: `function Page() {\n  const Safe = withAuth(Profile);\n  return <Safe />;\n}`, good: `const SafeProfile = withAuth(Profile);\nfunction Page() {\n  return <SafeProfile />;\n}`, why: "Calling a HOC during render creates a new component type each time, so React remounts it and drops its state." },
      { bad: `const withTheme = C => () => <C theme="dark" />;`, good: `const withTheme = C => props => <C {...props} theme="dark" />;`, why: "Forgetting `{...props}` silently swallows every prop the parent passed." }
    ],
    practice: [
      { level: "B", q: "Write `withLoading(C)` that shows “Loading…” when `isLoading` is true, else renders `C`.", a: "Check the prop and pass the rest through.", code: `const withLoading = C => function WithLoading({ isLoading, ...rest }) {\n  return isLoading ? <p>Loading…</p> : <C {...rest} />;\n};` },
      { level: "I", q: "Rewrite a `withCart(C)` HOC that injects `cart` from context as a hook.", a: "`function useCart() { return useContext(CartContext); }` then `const cart = useCart()` inside the component." },
      { level: "I", q: "Two HOCs both inject a prop called `data`. What goes wrong?", a: "The outer one's value is overwritten by the inner one (or vice versa), and the component can't tell which it got. Hooks avoid this because you name the variables." },
      { level: "C", q: "When is a wrapper still a reasonable choice over a hook?", a: "When it adds UI or behaviour around rendering itself, e.g. `memo(C)`, an error-boundary wrapper, or a route guard that renders `<Navigate>` instead of `C`." }
    ],
    quiz: [
      { q: "What does a HOC return?", options: ["JSX", "A new component", "A hook", "A promise"], answer: 1, why: "A HOC is a function from component to component." },
      { q: "Main reason hooks replaced most HOCs?", options: ["HOCs don't work in React 19", "Hooks share logic without extra wrapper layers or hidden props", "Hooks render faster"], answer: 1, why: "HOCs still work; hooks are just clearer and compose better." },
      { q: "Where should you call `withAuth(Profile)`?", options: ["Inside `Profile`'s render", "At module top level", "In `useEffect`"], answer: 1, why: "Creating it once keeps a stable component type." }
    ],
    rev: {
      sec30: "A HOC is `Component => EnhancedComponent`, used before hooks to share logic (data, auth, subscriptions). It must pass props through and be created at module level. Problems: wrapper hell, prop collisions, unclear prop origins, hard typing. Today: custom hooks for logic, wrapper components for UI, HOCs mainly in legacy code and a few APIs like `memo`.",
      interview: [
        { level: "basic", q: "What is a higher-order component?", a: "A function that takes a component and returns a new component that adds behaviour or props, like `withAuth(Page)`." },
        { level: "intermediate", q: "What problems do HOCs have?", a: "Deep wrapper trees, props injected from unclear places, name collisions between HOCs, static methods not copied over (and refs, before React 19), and painful types." },
        { level: "intermediate", q: "How would you replace a HOC with a hook?", a: "Move the logic into `useSomething()` that returns the values, then call it directly inside the components that need it." },
        { level: "advanced", q: "Is `React.memo` a HOC?", a: "It has the same shape: it takes a component and returns a new memoized component type. It's one of the remaining good uses of the pattern." },
        { level: "tricky", q: "Why set `displayName` on a HOC's inner component?", a: "Otherwise DevTools and error stacks show a generic name, making it hard to tell which wrapped component you're looking at." }
      ],
      compare: { cols: ["", "HOC", "Custom hook"], rows: [
        ["Shares", "Logic + rendering", "Logic only"],
        ["Tree depth", "+1 per HOC", "No change"],
        ["Naming", "Injected prop names", "You choose"],
        ["Typing", "Harder", "Easy"]
      ]},
      cheat: [
        "HOC = `Component => NewComponent`",
        "Name convention: `withSomething`",
        "Always spread `{...props}` through",
        "Create at module level, not in render",
        "Set `displayName` for DevTools",
        "Prefer custom hooks for shared logic",
        "Still seen: `memo`, legacy `connect`, guards"
      ]
    },
    related: ["COMM-012", "HOOKS-022", "HOOKS-023", "ADV-009"]
  },

  "ADV-009": {
    tldr: "A **render prop** is a prop that is a **function returning JSX**. The component does the work (state, data, events) and calls your function to decide what to draw. Spot it in libraries as `render={...}` or `{(data) => ...}` children.",
    analogy: { icon: "🍕", text: "A pizza shop bakes the base and handles the oven; you hand them a card saying which toppings to put on. They do the hard part and follow your instructions for the look." },
    visual: { type: "flow", title: "Who does what", steps: [
      { label: "You pass a function", detail: "`<Controller render={({ field }) => <input {...field} />} />`" },
      { label: "Component does the work", detail: "It owns state, subscriptions, validation or data loading." },
      { label: "Calls your function", detail: "On each render it calls `render(data)` with the current values." },
      { label: "Your JSX appears", detail: "You fully control markup and styling; the component never guesses." }
    ]},
    points: [
      "Two spellings: a named prop (`render={fn}`, `renderItem={fn}`) or **children as a function** (`{value => ...}`).",
      "Mostly replaced by **custom hooks** for sharing logic; still common where a library must control *when and where* your UI renders.",
      "Where you'll see it: React Hook Form `<Controller render>`, Formik `<Formik>{props => ...}</Formik>`, React Router `<Await>{data => ...}</Await>`, legacy `<Context.Consumer>`.",
      "Also a clean API for lists: `renderItem={item => ...}` lets callers customise each row.",
      "Inline render functions are new each render, which breaks `memo` on the receiver. Usually fine; measure first."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState } from 'react';

// A list component that owns filtering, but lets the caller draw each row
function FilterableList({ items, renderItem, renderEmpty }) {
  const [query, setQuery] = useState('');
  const shown = items.filter(i =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter songs" />
      {shown.length === 0
        ? renderEmpty(query)
        : <ul>{shown.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>}
    </>
  );
}

const songs = [
  { id: 1, title: 'Blue Skies', mins: 3 },
  { id: 2, title: 'Night Drive', mins: 4 },
];

export default function Playlist() {
  return (
    <FilterableList
      items={songs}
      renderItem={song => <span>🎵 {song.title} · {song.mins} min</span>}
      renderEmpty={q => <p>No songs match “{q}”.</p>}
    />
  );
}` , walk: [
      { lines: [4], note: "`renderItem` and `renderEmpty` are functions the caller provides." },
      { lines: [5, 6, 7, 8], note: "The component owns the logic: query state and filtering." },
      { lines: [14, 15], note: "It calls the caller's functions with data to get JSX back." },
      { lines: [29, 30], note: "The caller decides exactly how a row and the empty state look." }
    ]},
    output: "A filter box above “🎵 Blue Skies · 3 min” and “🎵 Night Drive · 4 min”. Typing “xyz” shows “No songs match “xyz”.”",
    mistakes: [
      { bad: `<FilterableList renderItem={<SongRow />} />`, good: `<FilterableList renderItem={song => <SongRow song={song} />} />`, why: "A render prop must be a function. Passing an element gives the component nothing to call with data." },
      { bad: `<Controller name="email" control={control}\n  render={({ field }) => <input />} />`, good: `<Controller name="email" control={control}\n  render={({ field }) => <input {...field} />} />`, why: "The library hands you `field` (value, onChange, onBlur, ref). If you don't spread it, the input isn't connected." }
    ],
    practice: [
      { level: "B", q: "Is `<Formik>{({ values }) => <p>{values.name}</p>}</Formik>` a render prop? Which kind?", a: "Yes: children as a function. Formik calls it with its form state." },
      { level: "I", q: "Wire a custom `DatePicker` into React Hook Form.", a: "Use `Controller` and map `field` to the picker's props.", code: `<Controller name="date" control={control}\n  render={({ field }) => (\n    <DatePicker selected={field.value} onChange={field.onChange} />\n  )} />` },
      { level: "I", q: "Rewrite `<WindowSize>{({ width }) => <p>{width}</p>}</WindowSize>` with a hook.", a: "`const { width } = useWindowSize(); return <p>{width}</p>;`, which is simpler and adds no extra component." },
      { level: "C", q: "Give one case where a render prop is better than a hook.", a: "When the library must render around or at a specific place (virtualised rows, `<Await>` inside Suspense, a form field wrapper) so it controls when your function runs." }
    ],
    quiz: [
      { q: "What is a render prop?", options: ["A prop holding a JSX element", "A prop that's a function returning JSX", "The `render()` method of a class", "A prop named `children`"], answer: 1, why: "The receiver calls the function with its data to produce UI." },
      { q: "Which of these is a render-prop API?", options: ["`useForm()`", "`<Controller render={({ field }) => ...} />`", "`memo(Row)`", "`createPortal()`"], answer: 1, why: "`Controller` calls your `render` function with field props." },
      { q: "What largely replaced render props for sharing stateful logic?", options: ["Class components", "Custom hooks", "Portals", "Fragments"], answer: 1, why: "Hooks share logic without changing the component tree." }
    ],
    rev: {
      sec30: "Render props pass a function that returns JSX: `render={data => ...}` or children as a function. The component owns logic and calls your function to render. Hooks replaced most uses, but you'll still recognise it in React Hook Form `Controller`, Formik, React Router `<Await>`, `Context.Consumer`, and list APIs like `renderItem`.",
      interview: [
        { level: "basic", q: "What's a render prop?", a: "A prop whose value is a function the component calls to know what to render, passing in its internal data." },
        { level: "intermediate", q: "Name libraries that use render props.", a: "React Hook Form's `Controller`, Formik's children function, React Router's `<Await>`, and the legacy `Context.Consumer`." },
        { level: "intermediate", q: "Render props vs custom hooks?", a: "Hooks share logic with less nesting. Render props still fit when the provider must control where or when the UI renders." },
        { level: "tricky", q: "Can render props hurt performance?", a: "An inline function is new each render, so a memoized receiver re-renders. Usually negligible; stabilise with `useCallback` only if profiling shows a problem." }
      ],
      cheat: [
        "Render prop = function prop returning JSX",
        "Two shapes: `render={fn}` or `{(data) => ...}` children",
        "Component owns logic; caller owns markup",
        "RHF `<Controller render>`: spread `field`",
        "React Router `<Await>{data => ...}</Await>`",
        "Hooks replaced most render-prop logic sharing"
      ]
    },
    related: ["COMM-011", "ADV-008", "EVT-022", "PROPS-008"]
  },

  "ADV-010": {
    tldr: "**Compound components** are a set of parts that work together through shared hidden state, like `<Tabs>`, `<TabList>`, `<Tab>`, `<TabPanel>`. The parent shares state via **context**; each part adds the right ARIA roles and keyboard handling.",
    analogy: { icon: "📻", text: "A car radio's preset buttons: press one and the others pop up. You never wire them to each other; they all talk to the same radio unit inside." },
    visual: { type: "tree", title: "Tabs: one context, many parts", root: { label: "<Tabs>", note: "owns `active` + id, provides context", children: [
      { label: "<TabList>", note: "role=tablist, arrow keys", children: [
        { label: "<Tab value=ingredients>", note: "role=tab, aria-selected" },
        { label: "<Tab value=steps>", note: "tabIndex -1 when not active" }
      ]},
      { label: "<TabPanel value=ingredients>", note: "role=tabpanel, aria-labelledby" },
      { label: "<TabPanel value=steps>", note: "hidden until selected" }
    ]}},
    points: [
      "The root holds state and provides it with context; parts read it with `use(TabsContext)` (or `useContext`).",
      "Users compose freely: reorder, add icons, put panels anywhere inside `<Tabs>`.",
      "ARIA: `role=\"tablist\"` / `\"tab\"` / `\"tabpanel\"`, `aria-selected`, and `aria-controls` ↔ `aria-labelledby` linked with ids from `useId`.",
      "Keyboard: **roving tabindex** (only the active tab has `tabIndex=0`); Left/Right arrows move between tabs.",
      "React 19: render `<TabsContext value={...}>` directly; `.Provider` is no longer needed."
    ],
    code: { file: "Tabs.jsx", lang: "jsx", src: `import { createContext, use, useId, useState } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  const id = useId();
  return <TabsContext value={{ active, setActive, id }}>{children}</TabsContext>;
}

export function TabList({ label, children }) {
  function onKeyDown(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tabs = [...e.currentTarget.querySelectorAll('[role="tab"]')];
    const step = e.key === 'ArrowRight' ? 1 : -1;
    const i = tabs.indexOf(document.activeElement);
    const next = tabs[(i + step + tabs.length) % tabs.length];
    next.focus();
    next.click();
  }
  return <div role="tablist" aria-label={label} onKeyDown={onKeyDown}>{children}</div>;
}

export function Tab({ value, children }) {
  const { active, setActive, id } = use(TabsContext);
  const selected = active === value;
  return (
    <button type="button" role="tab" id={id + '-tab-' + value}
      aria-selected={selected} aria-controls={id + '-panel-' + value}
      tabIndex={selected ? 0 : -1} onClick={() => setActive(value)}>
      {children}
    </button>
  );
}

export function TabPanel({ value, children }) {
  const { active, id } = use(TabsContext);
  return (
    <div role="tabpanel" id={id + '-panel-' + value} tabIndex={0}
      aria-labelledby={id + '-tab-' + value} hidden={active !== value}>
      {children}
    </div>
  );
}` , walk: [
      { lines: [5, 6, 7, 8], note: "The root owns the active tab and a unique id prefix, and shares them via context." },
      { lines: [12, 13, 14, 15, 16, 17, 18, 19], note: "Arrow keys move focus to the previous/next tab and activate it, wrapping around." },
      { lines: [24, 25], note: "Each part reads the shared state; no props threaded through by the user." },
      { lines: [28, 29, 30], note: "ARIA wiring: selected state, panel link, and roving `tabIndex`." },
      { lines: [39, 40, 41], note: "Panels are labelled by their tab and stay mounted but `hidden` when inactive." }
    ]},
    output: "Usage: `<Tabs defaultValue=\"ingredients\"><TabList label=\"Recipe\"><Tab value=\"ingredients\">Ingredients</Tab><Tab value=\"steps\">Steps</Tab></TabList><TabPanel value=\"ingredients\">200 g flour…</TabPanel><TabPanel value=\"steps\">Mix and bake.</TabPanel></Tabs>`. Tab key lands on the active tab; arrows switch.",
    mistakes: [
      { bad: `<Tabs tabs={[{ label: 'Steps', content: <Steps />, icon: '🍳', badge: 3 }]}\n  tabClassName="..." panelClassName="..." />`, good: `<Tabs defaultValue="steps">\n  <TabList label="Recipe"><Tab value="steps">🍳 Steps <Badge n={3} /></Tab></TabList>\n  <TabPanel value="steps"><Steps /></TabPanel>\n</Tabs>`, why: "A giant config prop grows a new option for every need. Compound parts let callers compose markup directly." },
      { bad: `<button onClick={() => setActive(v)}>{label}</button>`, good: `<button role="tab" aria-selected={selected}\n  aria-controls={panelId} tabIndex={selected ? 0 : -1}>`, why: "Plain buttons look like tabs but screen readers don't announce them as tabs, and Tab key stops on every one." }
    ],
    practice: [
      { level: "B", q: "Use the Tabs to show a weather app's “Today” and “Week” views.", a: "Two `Tab`s and two `TabPanel`s with matching `value`s inside `<Tabs defaultValue=\"today\">`." },
      { level: "I", q: "Make a `Tab` throw a helpful error when used outside `<Tabs>`.", a: "Check the context value.", code: `const ctx = use(TabsContext);\nif (!ctx) throw new Error('<Tab> must be used inside <Tabs>');` },
      { level: "I", q: "Add Home and End key support to `TabList`.", a: "On `Home` focus `tabs[0]`, on `End` focus `tabs[tabs.length - 1]`, then click to activate." },
      { level: "C", q: "Let the parent control the active tab (`value` + `onValueChange`) while keeping `defaultValue` working.", a: "Use the controlled value when it's defined, else internal state; always call `onValueChange` on change.", code: `const [inner, setInner] = useState(defaultValue);\nconst active = value ?? inner;\nconst setActive = v => { if (value === undefined) setInner(v); onValueChange?.(v); };` }
    ],
    quiz: [
      { q: "How do compound parts share state?", options: ["Global variables", "Context provided by the root component", "Each part fetches it", "Props the user must pass to each part"], answer: 1, why: "The root provides context; parts consume it, so the user doesn't thread props." },
      { q: "With roving tabindex, which tab has `tabIndex={0}`?", options: ["All tabs", "Only the selected tab", "None", "The first tab always"], answer: 1, why: "Tab key enters the list at the selected tab; arrows move within it." },
      { q: "Which attribute links a tab panel back to its tab?", options: ["`aria-controls`", "`aria-labelledby`", "`aria-selected`", "`htmlFor`"], answer: 1, why: "The panel uses `aria-labelledby` = tab id; the tab uses `aria-controls` = panel id." }
    ],
    rev: {
      sec30: "Compound components split one widget into parts (`Tabs`, `TabList`, `Tab`, `TabPanel`) that share state through context from the root. Callers compose freely instead of passing config objects. An accessible Tabs needs tablist/tab/tabpanel roles, `aria-selected`, `aria-controls`/`aria-labelledby` ids from `useId`, roving tabindex and arrow-key navigation.",
      interview: [
        { level: "basic", q: "What are compound components?", a: "A group of components designed to be used together, like `<select>` and `<option>`, sharing implicit state through context." },
        { level: "intermediate", q: "Why prefer them over one component with many props?", a: "They avoid prop explosion and give callers control over structure, order and markup while keeping behaviour in one place." },
        { level: "intermediate", q: "How do you implement the shared state?", a: "The root keeps state and provides it with a context; each part reads it via `use`/`useContext`, ideally with a guard that throws if used outside the root." },
        { level: "advanced", q: "What makes a tabs widget accessible?", a: "Correct roles, `aria-selected`, linked ids, only the active tab in the tab order, arrow/Home/End keys, and panels labelled by their tab." },
        { level: "tricky", q: "Why `useId` instead of `Math.random()` for ids?", a: "`useId` is stable across renders and matches between server and client, avoiding hydration mismatches; random ids change every render." }
      ],
      cheat: [
        "Root owns state, shares via context",
        "Parts: `use(Ctx)`; throw if ctx is null",
        "React 19: `<Ctx value={...}>` (no `.Provider`)",
        "Roles: tablist, tab, tabpanel",
        "`aria-selected`, `aria-controls` ↔ `aria-labelledby`",
        "Roving tabindex + arrow keys",
        "Ids from `useId`"
      ]
    },
    related: ["COMM-009", "HOOKS-006", "HOOKS-013", "ADV-011"]
  },

  "ADV-011": {
    tldr: "A **controlled component** API takes `value` and `onChange` from its parent: the parent owns the state, the component only displays it and **reports** changes. Same contract as `<input value onChange>`.",
    analogy: { icon: "📺", text: "A TV and its remote. The TV shows the channel it's told; pressing a button on the TV only sends a request. The remote (parent) decides the actual channel." },
    visual: { type: "cycle", title: "One round trip of a controlled stepper", steps: [
      { label: "Parent renders", detail: "`<QuantityStepper value={qty} onChange={setQty} />` with `qty = 1`." },
      { label: "User clicks +", detail: "Stepper doesn't change itself; it calls `onChange(2)`." },
      { label: "Parent decides", detail: "Parent sets state (it could also refuse, e.g. max stock reached)." },
      { label: "Re-render", detail: "New `value={2}` flows down; the stepper shows 2." }
    ]},
    points: [
      "**Single source of truth**: the parent's state. The component keeps no copy of `value`.",
      "Call `onChange` with the **next value** (not the event) for custom widgets; document whichever you choose.",
      "Parent can **validate, clamp or sync** (save to URL, share with siblings) before accepting a change.",
      "`value` without `onChange` makes it read-only; React warns for native inputs.",
      "Copying `value` into local `useState` breaks it: the copy goes stale when the parent changes."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

function QuantityStepper({ value, onChange, min = 0, max = 99, label }) {
  return (
    <div role="group" aria-label={label}>
      <button type="button" disabled={value <= min}
        onClick={() => onChange(value - 1)} aria-label="Decrease">−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" disabled={value >= max}
        onClick={() => onChange(value + 1)} aria-label="Increase">+</button>
    </div>
  );
}

export default function Cart() {
  const [qty, setQty] = useState(1);
  const stock = 5;

  return (
    <section>
      <h2>Coffee beans · $8.00</h2>
      <QuantityStepper
        label="Quantity"
        value={qty}
        max={stock}
        onChange={next => setQty(Math.min(next, stock))}
      />
      <p>Total: \${(qty * 8).toFixed(2)}</p>
      <button onClick={() => setQty(1)}>Reset</button>
    </section>
  );
}` , walk: [
      { lines: [3], note: "The API: `value` in, `onChange` out. No `useState` inside the stepper." },
      { lines: [7, 10], note: "Clicks only **report** the desired next value." },
      { lines: [8], note: "What you see is always the parent's `value`." },
      { lines: [16], note: "The parent owns the state." },
      { lines: [26], note: "The parent can clamp or reject changes before accepting them." },
      { lines: [29], note: "Because the parent owns it, Reset from outside just works." }
    ]},
    output: "“Coffee beans · $8.00”, a − 1 + stepper and “Total: $8.00”. + goes up to 5 then disables; Reset jumps back to 1.",
    mistakes: [
      { bad: `function Stepper({ value, onChange }) {\n  const [n, setN] = useState(value);\n  return <button onClick={() => { setN(n + 1); onChange(n + 1); }}>{n}</button>;\n}`, good: `function Stepper({ value, onChange }) {\n  return <button onClick={() => onChange(value + 1)}>{value}</button>;\n}`, why: "The local copy only reads `value` once. When the parent resets or changes it, the stepper shows a stale number." },
      { bad: `<input value={name} />`, good: `<input value={name} onChange={e => setName(e.target.value)} />`, why: "A `value` without `onChange` is read-only. React warns: add `onChange`, or use `defaultValue` / `readOnly`." }
    ],
    practice: [
      { level: "B", q: "Build a controlled `Toggle({ checked, onChange })` for “Dark mode”.", a: "Render a button that reports the opposite value.", code: `function Toggle({ checked, onChange, label }) {\n  return (\n    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}>\n      {label}: {checked ? 'On' : 'Off'}\n    </button>\n  );\n}` },
      { level: "I", q: "Make a controlled `StarRating({ value, onChange })` with 5 stars.", a: "Map 1..5 to buttons; clicking star `n` calls `onChange(n)`; fill stars where `n <= value`." },
      { level: "I", q: "Keep a notes search box's value in the URL (`?q=`) instead of `useState`.", a: "Use `useSearchParams` from `react-router`: `value={params.get('q') ?? ''}` and `onChange={e => setParams({ q: e.target.value })}`. The URL is the parent state." },
      { level: "C", q: "Two `QuantityStepper`s for the same item should always show the same number. How?", a: "Lift the state to a common parent and pass the same `value` and `onChange` to both. Controlled components make syncing trivial." }
    ],
    quiz: [
      { q: "In a controlled component, who owns the value?", options: ["The component itself", "The parent, passed as `value`", "The DOM", "The browser's localStorage"], answer: 1, why: "The parent holds state; the component just displays and reports." },
      { q: "A controlled stepper's `+` is clicked but the parent's `onChange` ignores it. What shows?", options: ["The new number", "The old number", "An error"], answer: 1, why: "The display is driven only by `value`, which didn't change." },
      { q: "What's wrong with `const [v, setV] = useState(props.value)` in a controlled component?", options: ["Nothing", "It goes stale when the parent changes `value`", "Hooks can't read props", "It causes an infinite loop"], answer: 1, why: "The initial value is read once; later prop changes are ignored." }
    ],
    rev: {
      sec30: "Controlled APIs take `value` + `onChange`: the parent owns state, the component renders `value` and reports the next value via `onChange`. This gives one source of truth, so the parent can validate, reset, sync and share state. Never copy `value` into local state. Native inputs with `value` need `onChange` or `readOnly`.",
      interview: [
        { level: "basic", q: "What makes a component controlled?", a: "Its displayed value comes entirely from props (`value`) and changes are reported up through a callback (`onChange`) instead of stored internally." },
        { level: "intermediate", q: "Why design a component as controlled?", a: "The parent can validate or reject changes, reset it, sync it with other UI or the URL, and save it, because it owns the state." },
        { level: "intermediate", q: "Should `onChange` pass the event or the value?", a: "For custom widgets pass the next value, it's simpler and not tied to DOM events. Wrappers around native inputs often forward the event to match the native API. Be consistent." },
        { level: "advanced", q: "How can one component support both controlled and uncontrolled use?", a: "Accept `value` and `defaultValue`; if `value !== undefined` use it, otherwise keep internal state seeded from `defaultValue`, and always call `onChange`." },
        { level: "tricky", q: "React warns “A component is changing an uncontrolled input to be controlled”. Why?", a: "`value` started as `undefined` (uncontrolled) and later became a string. Initialise state to `''` so it's controlled from the first render." }
      ],
      debug: [
        { code: `const [name, setName] = useState();\n<input value={name} onChange={e => setName(e.target.value)} />`, fix: `const [name, setName] = useState('');\n<input value={name} onChange={e => setName(e.target.value)} />`, why: "`undefined` makes the first render uncontrolled; switching later triggers the warning." }
      ],
      cheat: [
        "Controlled = `value` in, `onChange` out",
        "Parent is the single source of truth",
        "Component holds no copy of `value`",
        "Custom widgets: `onChange(nextValue)`",
        "Parent can clamp, reject, reset, sync",
        "`value` without `onChange` = read-only",
        "Init to `''`, not `undefined`, to avoid switching"
      ]
    },
    related: ["STATE-023", "EVT-010", "COMM-010", "ADV-012"]
  },
};
