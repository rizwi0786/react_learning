export default {
  "ADV-012": {
    tldr: "An uncontrolled component keeps its own state. The parent only gives a starting value (`defaultValue`) and maybe listens with `onChange`, but never drives the value.",
    analogy: { icon: "🎚️", text: "A hotel room thermostat. Reception sets it to 21° before you arrive (default), then you change it yourself. Reception can hear about changes, but it doesn't turn the dial." },
    visual: { type: "timeline", title: "Who owns the value?", frames: [
      { label: "mount", state: "parent: defaultValue=1 → child state = 1", note: "The default is read **once**, on the first render." },
      { label: "click +", state: "child state = 2 → onChange(2)", note: "The child updates itself, then tells the parent (optional)." },
      { label: "parent re-renders", state: "defaultValue=5 → child state still 2", note: "Later default changes are **ignored**. That's the contract." },
      { label: "key changes", state: "new instance → child state = 5", note: "To reset, give it a new `key`: React remounts and reads the default again." }
    ]},
    points: [
      "API shape: `defaultValue` (start value) + optional `onChange` (notify). Mirrors native `<input defaultValue>`.",
      "Inside: `useState(defaultValue)`. The default only matters on the **first render**.",
      "Parent writes less code: drop it in and it just works. Trade-off: the parent can't set or reset the value directly.",
      "Reset it by changing its `key`, or expose a reset via a ref handle (`useImperativeHandle`).",
      "Library pattern: support **both** modes. If `value` is passed, be controlled; otherwise use internal state."
    ],
    code: { file: "QuantityPicker.jsx", lang: "jsx", src: `import { useState } from 'react';

function QuantityPicker({ defaultValue = 1, onChange }) {
  const [qty, setQty] = useState(defaultValue);

  function change(next) {
    if (next < 1) return;
    setQty(next);
    onChange?.(next);
  }

  return (
    <div>
      <button onClick={() => change(qty - 1)}>−</button>
      <span> {qty} </span>
      <button onClick={() => change(qty + 1)}>+</button>
    </div>
  );
}

export default function Cart() {
  const [cartId, setCartId] = useState(0);
  return (
    <>
      <QuantityPicker
        key={cartId}
        defaultValue={2}
        onChange={(q) => console.log('qty now', q)}
      />
      <button onClick={() => setCartId(cartId + 1)}>Reset</button>
    </>
  );
}`, walk: [
      { lines: [3, 4], note: "`defaultValue` seeds internal state once. The component owns `qty` from then on." },
      { lines: [6, 9], note: "Update own state first, then notify the parent with optional chaining `onChange?.()`." },
      { lines: [25, 28], note: "The parent only sets the start value and listens. It never passes `value`." },
      { lines: [22, 30], note: "Changing `key` remounts the picker, so it reads `defaultValue` again: a clean reset." }
    ]},
    output: "A − 2 + picker. Clicks change the number and log “qty now 3”. Reset puts it back to 2.",
    mistakes: [
      { bad: `const [qty, setQty] = useState(defaultValue);\nuseEffect(() => setQty(defaultValue), [defaultValue]);`, good: `// let the parent reset with a key\n<QuantityPicker key={cartId} defaultValue={2} />`, why: "Syncing state to a prop in an effect causes an extra render and blurs who owns the value. Use `key` to reset." },
      { bad: `<QuantityPicker value={qty} />  // no onChange, no state`, good: `<QuantityPicker defaultValue={qty} />`, why: "Passing `value` signals controlled mode. If you don't want to own the value, pass `defaultValue` instead." }
    ],
    practice: [
      { level: "B", q: "Add a `max` prop so the picker can't go above it.", a: "Add `if (next > max) return;` inside `change`." },
      { level: "I", q: "Turn a `StarRating` that takes `value`/`onChange` into one that also works with just `defaultValue`.", a: "Keep internal state from `defaultValue`; use `value` when it's defined, else the internal state.", code: `const [inner, setInner] = useState(defaultValue);\nconst isControlled = value !== undefined;\nconst current = isControlled ? value : inner;\nfunction set(v) { if (!isControlled) setInner(v); onChange?.(v); }` },
      { level: "I", q: "Why does changing `defaultValue` from 2 to 5 not change the picker?", a: "`useState` only uses its argument on the first render. Later renders ignore it." },
      { level: "C", q: "Expose a `reset()` method without remounting.", a: "In React 19 accept `ref` as a prop and use `useImperativeHandle(ref, () => ({ reset: () => setQty(defaultValue) }))`." }
    ],
    quiz: [
      { q: "A parent re-renders with a new `defaultValue`. What does an uncontrolled child show?", options: ["The new default", "Its current internal value", "It crashes", "An empty value"], answer: 1, why: "The default only seeds state on mount. After that the child owns the value." },
      { q: "Simplest way for a parent to reset an uncontrolled component?", options: ["Change its `key`", "Pass `value={undefined}`", "Call `forceUpdate`", "Change `defaultValue`"], answer: 0, why: "A new key means a new instance, which reads the default again." },
      { q: "In the dual-mode pattern, how does the component know it's controlled?", options: ["`onChange` is passed", "`value !== undefined`", "`defaultValue` is missing", "A `controlled` prop"], answer: 1, why: "Same rule as native inputs: a defined `value` means the parent owns it." }
    ],
    rev: {
      sec30: "Uncontrolled = the component owns its state. The parent passes `defaultValue` (read once, via `useState(defaultValue)`) and may listen with `onChange`. Less parent code, but the parent can't drive or reset the value; reset by changing `key` or a ref handle. Good libraries support both modes: controlled when `value` is defined.",
      interview: [
        { level: "basic", q: "What's the difference between `value` and `defaultValue`?", a: "`value` makes the parent the owner on every render. `defaultValue` just sets the starting value; the component owns it afterwards." },
        { level: "intermediate", q: "When would you design a component as uncontrolled?", a: "When most callers only need a starting value and a change event, like a quantity picker or accordion. It keeps the call site tiny." },
        { level: "advanced", q: "How do you support both controlled and uncontrolled use?", a: "Keep internal state from `defaultValue`, treat `value !== undefined` as controlled, read `value` then, and only update internal state when uncontrolled. Always call `onChange`." },
        { level: "tricky", q: "Can a component switch from uncontrolled to controlled mid-life?", a: "It shouldn't. React warns for native inputs; for your own components, pick the mode on mount and warn in dev if it changes." }
      ],
      debug: [
        { code: `function Notes({ defaultText }) {\n  const [text, setText] = useState('');\n  return <textarea value={text} onChange={e => setText(e.target.value)} />;\n}`, fix: `function Notes({ defaultText = '' }) {\n  const [text, setText] = useState(defaultText);\n  return <textarea value={text} onChange={e => setText(e.target.value)} />;\n}`, why: "The default prop was never used to seed state, so the note always started empty." }
      ],
      compare: { cols: ["", "Controlled", "Uncontrolled"], rows: [
        ["Who owns value", "Parent", "Component"],
        ["Props", "`value` + `onChange`", "`defaultValue` (+ `onChange`)"],
        ["Reset", "Parent sets value", "Change `key` / ref handle"],
        ["Call-site code", "More", "Less"]
      ]},
      cheat: [
        "Uncontrolled: `defaultValue` + internal `useState`",
        "Default is read **once**, on mount",
        "Notify with `onChange?.(next)`; parent listens, doesn't drive",
        "Reset with a new `key`",
        "Dual mode: controlled when `value !== undefined`",
        "Don't sync props to state in an effect"
      ]
    },
    related: ["ADV-011", "COMM-010", "EVT-011", "HOOKS-007"]
  },

  "ADV-013": {
    tldr: "Code splitting breaks one big JavaScript bundle into smaller chunks. Users download only the code for the page or feature they actually open.",
    analogy: { icon: "🍽️", text: "A restaurant brings courses as you order them, instead of putting the whole menu on your table at once. You start eating sooner." },
    visual: { type: "compare", title: "One bundle vs split chunks", left: { label: "Single bundle", tone: "bad", points: ["Home, Cart, Admin, Charts all in `index.js`", "First visit downloads everything", "Any change busts the whole cache"] }, right: { label: "Split by route + feature", tone: "good", points: ["`index.js` holds the shell + Home", "`Cart-[hash].js` loads when you open /cart", "Heavy chart loads only when shown", "Small chunks cache independently"] } },
    points: [
      "Every `import()` (dynamic import) tells Vite to make a **separate chunk**.",
      "**Route-level** split first: each page is a natural boundary. Users rarely visit every page.",
      "**Feature-level** split next: big, rarely used things (chart, rich editor, emoji picker, admin panel).",
      "React Router 7 data mode: route `lazy: () => import('./pages/Cart')`. Or `React.lazy` + `<Suspense>`.",
      "Don't over-split: dozens of tiny chunks mean extra requests. Measure with `vite build` output or a bundle visualizer."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './Layout';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    HydrateFallback: () => <p>Loading…</p>,
    children: [
      { index: true, Component: Home },
      // pages/Cart.jsx exports: export function Component() {...}
      { path: 'cart', lazy: () => import('./pages/Cart') },
      { path: 'admin', lazy: () => import('./pages/Admin') },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);`, walk: [
      { lines: [4, 12], note: "Home is imported normally: it's in the main bundle because almost everyone sees it." },
      { lines: [14], note: "`lazy` returns a module whose `Component` (and `loader`, etc.) become the route. Vite makes `Cart-[hash].js`." },
      { lines: [15], note: "Admin is a separate chunk too: most shoppers never download it." },
      { lines: [10], note: "Fallback UI shown if the first route is still loading on startup." }
    ]},
    output: "`vite build` lists `index-[hash].js`, `Cart-[hash].js`, `Admin-[hash].js`. Network tab: Cart chunk loads on first visit to /cart.",
    mistakes: [
      { bad: `import Cart from './pages/Cart';\nconst LazyCart = lazy(() => import('./pages/Cart'));`, good: `const LazyCart = lazy(() => import('./pages/Cart'));`, why: "A static import of the same module anywhere pulls it back into the main bundle, so the split does nothing." },
      { bad: `function Shop() {\n  const Cart = lazy(() => import('./Cart'));\n  return <Cart />;\n}`, good: `const Cart = lazy(() => import('./Cart'));\nfunction Shop() { return <Cart />; }`, why: "Declaring `lazy` inside a component creates a new component every render, which resets its state." }
    ],
    practice: [
      { level: "B", q: "Which should you split first: a page or a 2 KB button?", a: "The page. Split big, rarely used code; tiny shared bits belong in the main bundle." },
      { level: "I", q: "Split a heavy `SalesChart` that only shows after clicking “Show stats”.", a: "Use `React.lazy` and render it inside `<Suspense>` only when the toggle is on.", code: `const SalesChart = lazy(() => import('./SalesChart'));\n{show && (\n  <Suspense fallback={<p>Loading chart…</p>}>\n    <SalesChart />\n  </Suspense>\n)}` },
      { level: "I", q: "How do you check the split worked?", a: "Run `npm run build` and look for the new chunk file, then open the route with the Network tab and watch it load." },
      { level: "C", q: "Make the Cart chunk start downloading when the user hovers the Cart link.", a: "Call the same `import('./pages/Cart')` in `onMouseEnter`. The browser caches the module, so the later lazy load is instant. (React Router `<Link prefetch>` exists in framework mode.)" }
    ],
    quiz: [
      { q: "What creates a separate chunk in a Vite build?", options: ["Every `.jsx` file", "A dynamic `import()`", "Every component", "`export default`"], answer: 1, why: "Bundlers split at dynamic import points." },
      { q: "Best first place to split a shop app?", options: ["Each button", "Each route/page", "Each CSS file", "Each hook"], answer: 1, why: "Routes are big, natural boundaries; users visit few of them." },
      { q: "You lazy-load `Cart` but the chunk never appears. Likely cause?", options: ["Missing Suspense", "Another file statically imports `Cart`", "Vite doesn't support splitting", "Production mode"], answer: 1, why: "One static import keeps the module in the main bundle." }
    ],
    rev: {
      sec30: "Code splitting = many smaller chunks instead of one bundle, so the first load ships less JS. Each dynamic `import()` is a split point. Split by route first (React Router `lazy`, or `React.lazy` + `Suspense`), then heavy features. Avoid static imports of split modules and over-splitting; verify in build output and the Network tab.",
      interview: [
        { level: "basic", q: "What is code splitting and why do it?", a: "Breaking the bundle into chunks loaded on demand, so the first page downloads and runs less JavaScript and becomes interactive sooner." },
        { level: "intermediate", q: "Route-based vs component-based splitting?", a: "Route-based splits per page and is the biggest, easiest win. Component-based splits heavy widgets like charts or editors that may not be shown at all." },
        { level: "advanced", q: "What are the costs of splitting too much?", a: "More requests, loading spinners on navigation (waterfalls), and duplicated shared code if chunks are badly grouped. Prefetch likely-next chunks to hide latency." },
        { level: "tricky", q: "Why might a lazy route still be in the main bundle?", a: "Something imports it statically, e.g. a barrel `index.js` that re-exports every page." }
      ],
      scenario: [
        { q: "Your shop's main bundle is 900 KB and 400 KB is an admin dashboard. What do you do?", a: "Lazy-load the admin route so shoppers never download it, then check the build output to confirm the main bundle shrank." }
      ],
      cheat: [
        "Split point = dynamic `import()`",
        "Split routes first, heavy features second",
        "RR7: `{ path, lazy: () => import('./Page') }`",
        "Or `lazy()` + `<Suspense fallback>`",
        "Declare `lazy()` at module top level",
        "One static import undoes the split",
        "Verify: `npm run build` + Network tab"
      ]
    },
    related: ["ADV-002", "ADV-014", "ROUTE-020", "PERF-010"]
  },

  "ADV-014": {
    tldr: "`import('./file')` loads a module at runtime, only when your code reaches that line. It returns a Promise of the module, and Vite puts that module in its own chunk.",
    analogy: { icon: "🧾", text: "A recipe app only fetches the printer-friendly layout when you tap **Print**. Most visitors never print, so they never download it." },
    visual: { type: "flow", title: "What happens on click", steps: [
      { label: "User clicks Export", detail: "The handler runs `await import('./exportPdf.js')`." },
      { label: "Browser fetches chunk", detail: "First time only: `exportPdf-[hash].js` downloads. Later calls reuse the cached module." },
      { label: "Promise resolves", detail: "You get the module object: `{ default, ...namedExports }`." },
      { label: "Use it", detail: "Call `mod.exportPdf(recipe)` like any import." }
    ]},
    points: [
      "Static `import x from` loads at startup; `import()` loads **on demand** and returns a Promise.",
      "Read exports from the module object: `const { exportPdf } = await import('./pdf.js')`, or `mod.default`.",
      "Great in **event handlers**: export, confetti, a date or markdown library, a big locale file.",
      "`React.lazy` is just `import()` wrapped for components; use plain `import()` for non-component code.",
      "Vite variable paths must be relative with an extension, e.g. ``import(`./locales/${lang}.js`)``.",
      "Handle failure (offline, new deploy) with `try/catch` and show a retry message."
    ],
    code: { file: "RecipeCard.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function RecipeCard({ recipe }) {
  const [status, setStatus] = useState('idle');

  async function handleExport() {
    setStatus('loading');
    try {
      const { exportPdf } = await import('./exportPdf.js');
      await exportPdf(recipe);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <article>
      <h2>{recipe.title}</h2>
      <button onClick={handleExport} disabled={status === 'loading'}>
        {status === 'loading' ? 'Preparing…' : 'Export PDF'}
      </button>
      {status === 'error' && <p>Couldn't load exporter. Try again.</p>}
    </article>
  );
}`, walk: [
      { lines: [6, 7], note: "Nothing PDF-related is downloaded until the click." },
      { lines: [9], note: "`import()` returns a Promise of the module; destructure the named export." },
      { lines: [10, 11], note: "Use the loaded function like a normal import." },
      { lines: [12, 14], note: "Chunk loads can fail (network, old deploy). Catch and show a message." },
      { lines: [20], note: "Disable the button while loading so it isn't double-clicked." }
    ]},
    output: "Network tab: `exportPdf-[hash].js` appears only after the first click on Export PDF.",
    mistakes: [
      { bad: `const pdf = await import('./exportPdf.js');\npdf(recipe);`, good: `const { exportPdf } = await import('./exportPdf.js');\nexportPdf(recipe);`, why: "`import()` resolves to the module object, not the function. Pick `default` or a named export from it." },
      { bad: `import(\`\${folder}/\${name}\`);`, good: `import(\`./locales/\${lang}.js\`);`, why: "Bundlers need a static, relative start and an extension to know which files could be loaded." }
    ],
    practice: [
      { level: "B", q: "What does `import('./math.js')` return?", a: "A Promise that resolves to the module object (`{ default, ...named }`)." },
      { level: "I", q: "Load a locale file for the chosen language.", a: "Use a template path Vite can analyse.", code: `async function loadMessages(lang) {\n  const mod = await import(\`./locales/\${lang}.js\`);\n  return mod.default;\n}` },
      { level: "I", q: "Is the module downloaded again on the second click?", a: "No. Modules are cached; the second `import()` resolves immediately." },
      { level: "C", q: "Start loading the exporter when the user hovers the button.", a: "Call `import('./exportPdf.js')` in `onMouseEnter` and ignore the result. The click then gets the cached module." }
    ],
    quiz: [
      { q: "When is a dynamically imported module downloaded?", options: ["At app startup", "When the `import()` line runs", "At build time only", "On every render"], answer: 1, why: "It loads on demand, the first time that code path runs." },
      { q: "`const m = await import('./a.js')`: how do you get the default export?", options: ["`m`", "`m.default`", "`m()`", "`m.exports`"], answer: 1, why: "The module object holds `default` plus named exports." },
      { q: "Which is a good use of plain `import()` (not `React.lazy`)?", options: ["A page component", "A PDF library used in a click handler", "A CSS reset", "`useState`"], answer: 1, why: "`React.lazy` is for components; plain `import()` suits functions and libraries." }
    ],
    rev: {
      sec30: "`import()` is a standard JS function-like expression that loads a module at runtime and returns a Promise of the module object. Bundlers make it a split point. Use it in handlers for heavy, rarely used code; `React.lazy` wraps it for components. Modules are cached after the first load. Handle errors; keep paths static or relative with an extension.",
      interview: [
        { level: "basic", q: "Static vs dynamic import?", a: "Static imports load before the module runs and are bundled together. `import()` loads at runtime when reached and returns a Promise." },
        { level: "intermediate", q: "How does `React.lazy` relate to `import()`?", a: "`React.lazy` takes a function returning `import()` of a module with a default-exported component, and suspends until it resolves." },
        { level: "advanced", q: "What can go wrong with chunk loading after a deploy?", a: "Old tabs may request chunk hashes that no longer exist. Catch the error, offer a reload, or keep old assets for a while." },
        { level: "tricky", q: "Does `import()` inside a component body run every render?", a: "The expression runs each render, but the module is fetched once and cached. Still, put it in handlers or effects, not render." }
      ],
      predict: [
        { code: `console.log('A');\nimport('./b.js').then(() => console.log('C'));\nconsole.log('B');\n// b.js: console.log('b loaded')`, answer: "A, B, b loaded, C", why: "`import()` is async: the current code finishes first, then the module runs, then `.then` fires." }
      ],
      cheat: [
        "`await import('./x.js')` → module object",
        "Get exports: `mod.default` or `{ named }`",
        "Each `import()` = separate Vite chunk",
        "Cached after first load",
        "Best in event handlers for heavy libs",
        "Wrap in `try/catch`: chunk loads can fail"
      ]
    },
    related: ["ADV-013", "ADV-002", "WEB-027", "PERF-011"]
  },

  "ADV-015": {
    tldr: "React Server Components (RSC) run only on the server. They can read the database directly and send finished UI to the browser, with **zero** of their own JavaScript shipped. Framework-only.",
    analogy: { icon: "👨‍🍳", text: "The kitchen cooks the dish and sends out a plated meal. You get the food, not the recipe, the pans or the raw ingredients." },
    visual: { type: "flow", title: "One request in a Server Components app", steps: [
      { label: "Request /products", detail: "The framework (e.g. Next.js App Router) calls your server component tree." },
      { label: "Server component runs", detail: "`async function Page()` awaits `db.products.findMany()` directly. No API route needed." },
      { label: "Render to RSC payload", detail: "Output is serialised UI plus **holes** where client components go." },
      { label: "Browser builds UI", detail: "React turns the payload into DOM. Only client components' JS is downloaded and hydrated." }
    ]},
    points: [
      "**Framework-only**: Next.js App Router (default there), or another RSC-capable framework/bundler. Plain Vite + React can't run them.",
      "Can be `async` and `await` data, secrets, files, the DB. Their code never reaches the browser.",
      "Cannot use state, effects, refs, event handlers or browser APIs. No `useState`, no `onClick`.",
      "Need interactivity? Render a **client component** (`'use client'`) inside, and pass it serialisable props.",
      "Not the same as SSR: SSR makes HTML from any components; RSC are components that never hydrate. They're often used together."
    ],
    code: { file: "app/products/page.jsx", lang: "jsx", src: `// Next.js App Router: files are Server Components by default
import { db } from '@/lib/db';
import AddToCartButton from './AddToCartButton'; // 'use client'

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <main>
      <h1>Shop</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} · £{p.price}
            <AddToCartButton productId={p.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}`, walk: [
      { lines: [1], note: "No directive needed: in the App Router every component is a server component unless marked otherwise." },
      { lines: [5, 8], note: "An `async` component awaiting the database directly. DB credentials stay on the server." },
      { lines: [14, 19], note: "Plain markup is sent as finished UI. No JS for this list ships to the browser." },
      { lines: [3, 17], note: "The interactive button is a client component; the server passes it a plain `productId`." }
    ]},
    output: "The page shows the product list. The browser's JS bundle contains `AddToCartButton` but not `ProductsPage` or the DB client.",
    mistakes: [
      { bad: `export default async function Page() {\n  const [q, setQ] = useState('');\n  ...\n}`, good: `// move interactive bits to a client component\n<SearchBox />  // file starts with 'use client'`, why: "Server components run once on the server and never re-render in the browser, so hooks like `useState` aren't allowed." },
      { bad: `<AddToCartButton onAdd={() => addToCart(p.id)} />`, good: `<AddToCartButton productId={p.id} />`, why: "Props from server to client must be serialisable. Plain functions can't cross; pass data (or a Server Function)." }
    ],
    practice: [
      { level: "B", q: "Can a server component have an `onClick`?", a: "No. Event handlers need browser JS. Put the button in a client component." },
      { level: "I", q: "Where should a weather widget that reads an API key live?", a: "In a server component: fetch with the key on the server, render the result. The key never reaches the browser." },
      { level: "I", q: "Name two things RSC reduce.", a: "Client JS bundle size (their code isn't shipped) and client-server waterfalls (data is fetched close to the source)." },
      { level: "C", q: "Fetch the user's profile and recent orders in parallel in a server component.", a: "Start both promises, then await them together.", code: `const [user, orders] = await Promise.all([\n  getUser(id),\n  getOrders(id),\n]);` }
    ],
    quiz: [
      { q: "Which can a Server Component do?", options: ["`useState`", "`await` a DB query", "`onClick`", "Read `window`"], answer: 1, why: "They run on the server, can be async, and have no browser or state." },
      { q: "Can you use Server Components in a plain Vite SPA?", options: ["Yes, by default", "No, they need an RSC-capable framework/bundler", "Only in dev", "Only with Strict Mode"], answer: 1, why: "They need server rendering infrastructure such as Next.js App Router." },
      { q: "Server Components vs SSR:", options: ["The same thing", "RSC never hydrate; SSR renders HTML for components that then hydrate", "SSR is client-only", "RSC replace HTML"], answer: 1, why: "Different features that are often combined." }
    ],
    rev: {
      sec30: "Server Components run only on the server (framework-only: Next.js App Router, other RSC frameworks). They can be `async`, read DB/secrets directly, and ship no JS. No state, effects or handlers. Interactive parts are client components rendered inside, with serialisable props. RSC is not SSR: SSR is HTML for the first load; RSC are components that never hydrate.",
      interview: [
        { level: "basic", q: "What is a React Server Component?", a: "A component that renders only on the server. Its output is sent to the client, but its code and dependencies are not." },
        { level: "intermediate", q: "What are their limitations?", a: "No hooks like `useState`/`useEffect`, no event handlers, no browser APIs. They can't re-render on the client; you refresh or navigate to get new output." },
        { level: "advanced", q: "How is RSC different from SSR?", a: "SSR turns components into HTML for the first paint, then all of them hydrate. RSC produce a payload for components that never hydrate, can refetch on navigation, and keep their code off the client." },
        { level: "tricky", q: "Can a client component import a server component?", a: "No: importing it makes it client code. But a server component can be passed to a client component as `children` or another prop." },
        { level: "intermediate", q: "Why do RSC help performance?", a: "Less JS to download and hydrate, and data fetching happens next to the database instead of browser-to-API waterfalls." }
      ],
      compare: { cols: ["", "Server Component", "Client Component"], rows: [
        ["Runs", "Server only", "Server (SSR) + browser"],
        ["async / DB / secrets", "Yes", "No"],
        ["State, effects, handlers", "No", "Yes"],
        ["JS shipped", "None", "Yes"]
      ]},
      cheat: [
        "Framework-only (Next.js App Router default)",
        "Can be `async`; `await` DB/fetch directly",
        "Zero client JS for the component itself",
        "No `useState`, `useEffect`, `onClick`, `window`",
        "Interactive bits → `'use client'` components",
        "Server → client props must be serialisable",
        "RSC ≠ SSR; often used together"
      ]
    },
    related: ["ADV-016", "ADV-017", "NEXT-005", "INTRO-012"]
  },

  "ADV-016": {
    tldr: "`'use client'` at the top of a file marks it as a Client Component boundary. That file and everything it imports ship to the browser, so it can use state, effects and event handlers.",
    analogy: { icon: "🚪", text: "A shop door marked **Customers only**. Behind it, shoppers can touch and try things. Stock in the back room (server) stays out of reach." },
    visual: { type: "tree", title: "Where the boundary sits", root: { label: "ProductsPage", note: "server", children: [
      { label: "Header", note: "server" },
      { label: "ProductList", note: "server: reads DB", children: [
        { label: "AddToCartButton", note: "'use client' boundary", children: [ { label: "Spinner", note: "client (imported)" } ] }
      ]},
      { label: "CartDrawer", note: "'use client'", children: [ { label: "CartSummary", note: "server, passed as children" } ] }
    ]}},
    points: [
      "Put `'use client'` as the **first line** of the file. It marks a module boundary, not a single component.",
      "Everything that file imports also becomes client code. Push the boundary **down** to small interactive leaves.",
      "Client components still render on the server for the first HTML (SSR), then **hydrate** in the browser.",
      "Server → client props must be **serialisable**: plain data, Dates, Promises, JSX, Server Functions. Not plain functions or class instances.",
      "Server components can still appear inside: pass them as `children` from a server parent."
    ],
    code: { file: "app/products/AddToCartButton.jsx", lang: "jsx", src: `'use client';

import { useState } from 'react';

export default function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);

  async function handleClick() {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setAdded(true);
  }

  return (
    <button onClick={handleClick} disabled={added}>
      {added ? 'Added ✓' : 'Add to cart'}
    </button>
  );
}`, walk: [
      { lines: [1], note: "Directive first, before imports. Now this module and its imports are bundled for the browser." },
      { lines: [3, 6], note: "Hooks are allowed because this runs in the browser." },
      { lines: [5], note: "`productId` arrives from a server component, so it must be serialisable (a string/number here)." },
      { lines: [17], note: "Event handlers work only in client components." }
    ]},
    output: "Server-rendered HTML shows “Add to cart” instantly; after hydration the click works and switches to “Added ✓”.",
    mistakes: [
      { bad: `// app/layout.jsx\n'use client';\nexport default function Layout({ children }) { ... }`, good: `// keep layout on the server\n// mark only <ThemeToggle /> with 'use client'`, why: "A boundary high up makes the whole subtree (and its imports) client code, losing the zero-JS benefit." },
      { bad: `'use client';\nimport { db } from '@/lib/db';`, good: `// read the DB in a server component,\n// pass the data down as props`, why: "Client files ship to the browser. Server-only code (DB clients, secrets) must not be imported there." }
    ],
    practice: [
      { level: "B", q: "Which needs `'use client'`: a static footer or a dark-mode toggle?", a: "The toggle (state + onClick). The footer can stay a server component." },
      { level: "I", q: "A client `Tabs` needs server-rendered content inside each tab. How?", a: "Render the server content in the server parent and pass it as `children` or props like `<Tabs details={<Details />} />`." },
      { level: "I", q: "Do client components render on the server?", a: "Yes, for the initial HTML (SSR). Then they hydrate in the browser and become interactive." },
      { level: "C", q: "Protect a module from ever being imported into client code.", a: "Add `import 'server-only';` at the top. The build fails if a client file imports it." }
    ],
    quiz: [
      { q: "Where does `'use client'` go?", options: ["Above each component", "First line of the file", "In `package.json`", "Inside `useEffect`"], answer: 1, why: "It's a module-level directive and must come before imports." },
      { q: "A `'use client'` file imports `Chart.jsx` (no directive). `Chart` is:", options: ["Server", "Client", "Both separately", "An error"], answer: 1, why: "Imports from a client module become part of the client bundle." },
      { q: "Can a server pass `onSelect={() => ...}` to a client component?", options: ["Yes", "No, plain functions aren't serialisable", "Only in dev", "Only arrow functions"], answer: 1, why: "Only serialisable values (or Server Functions) can cross the boundary." }
    ],
    rev: {
      sec30: "`'use client'` (first line of a file) marks a Client Component boundary in an RSC framework. That module and its imports go to the browser, can use hooks and handlers, still SSR for first HTML, then hydrate. Keep boundaries low on interactive leaves; pass serialisable props; nest server components via `children`.",
      interview: [
        { level: "basic", q: "What does `'use client'` do?", a: "Marks a file as the entry to client code. It and its imports get bundled for the browser, so hooks and event handlers work." },
        { level: "intermediate", q: "Do Client Components only run in the browser?", a: "No. They're pre-rendered to HTML on the server too, then hydrated. 'Client' means they also run in the browser." },
        { level: "advanced", q: "How do you render a server component inside a client component?", a: "You can't import it there, but a server parent can pass it as `children` or a prop; React slots the server output into the client tree." },
        { level: "tricky", q: "Do you need `'use client'` on every interactive component?", a: "No, only on the boundary file. Components imported from it are already client code." }
      ],
      debug: [
        { code: `// SearchBox.jsx\nimport { useState } from 'react';\nexport default function SearchBox() {\n  const [q, setQ] = useState('');\n  return <input value={q} onChange={e => setQ(e.target.value)} />;\n}`, fix: `'use client';\nimport { useState } from 'react';\nexport default function SearchBox() {\n  const [q, setQ] = useState('');\n  return <input value={q} onChange={e => setQ(e.target.value)} />;\n}`, why: "Imported from a server page without the directive, it's treated as a server component and `useState` errors." }
      ],
      cheat: [
        "`'use client'` = first line of the file",
        "Marks a boundary; imports become client too",
        "Still SSR'd, then hydrated",
        "Push boundaries down to interactive leaves",
        "Props must be serialisable (no plain functions)",
        "Server content inside client → pass as `children`",
        "`import 'server-only'` guards server modules"
      ]
    },
    related: ["ADV-015", "ADV-019", "NEXT-006", "ADV-017"]
  },

  "ADV-017": {
    tldr: "A Server Function is an async function marked `'use server'`. The browser can call it like a normal function; React sends a request and runs it on the server. Pass one to `<form action>` and it becomes a Server Action. Framework-only.",
    analogy: { icon: "🛎️", text: "A service bell at a café counter. You ring it (call the function) from your table; the barista in the back does the work and hands you the result." },
    visual: { type: "flow", title: "Submitting a Server Action", steps: [
      { label: "Form submits", detail: "`<form action={addNote}>`: React intercepts and calls the function with `FormData`." },
      { label: "POST to server", detail: "The framework sends the form data to a hidden endpoint for `addNote`." },
      { label: "Runs on server", detail: "`addNote` validates, checks auth, writes to the DB." },
      { label: "UI refreshes", detail: "Return value goes to `useActionState`; `revalidatePath` (Next.js) re-renders server data." }
    ]},
    points: [
      "Mark with `'use server'`: at the top of a file (all exports) or as the first line inside an async function in a server component.",
      "Client components **import** Server Functions from a `'use server'` file; they can't define them inline.",
      "`<form action={fn}>` passes `FormData`. Add `useActionState` for result + pending, `useFormStatus` for a submit button's pending state.",
      "Every Server Function is a **public endpoint**. Always validate input and check the user's permissions.",
      "Arguments and return values must be serialisable. Naming: React says **Server Function**; one used as a form `action` is a **Server Action** (Next.js's usual term)."
    ],
    code: { file: "app/notes/actions.js + NoteForm.jsx", lang: "jsx", src: `// app/notes/actions.js
'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addNote(prevState, formData) {
  const text = String(formData.get('text') ?? '').trim();
  if (!text) return { error: 'Note is empty' };
  await db.note.create({ data: { text } });
  revalidatePath('/notes');
  return { error: null };
}

// app/notes/NoteForm.jsx
'use client';
import { useActionState } from 'react';
import { addNote } from './actions';

export default function NoteForm() {
  const [state, formAction, isPending] = useActionState(addNote, { error: null });
  return (
    <form action={formAction}>
      <input name="text" placeholder="New note" />
      <button disabled={isPending}>{isPending ? 'Saving…' : 'Add'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}`, walk: [
      { lines: [2], note: "File-level `'use server'`: every export here is a Server Function." },
      { lines: [6, 8], note: "Read and validate `FormData` on the server. Never trust the client." },
      { lines: [9, 11], note: "Write to the DB, refresh the cached `/notes` page (Next.js API), return a result." },
      { lines: [17, 20], note: "The client imports the function and wraps it with `useActionState` for result + pending." },
      { lines: [22, 24], note: "Pass `formAction` to the form; the button shows the pending state." }
    ]},
    output: "Typing a note and pressing Add shows “Saving…”, then the list refreshes. Submitting empty shows “Note is empty”.",
    mistakes: [
      { bad: `export async function deleteNote(id) {\n  'use server';\n  await db.note.delete({ where: { id } });\n}`, good: `export async function deleteNote(id) {\n  'use server';\n  const user = await getUser();\n  if (!user) throw new Error('Not signed in');\n  await db.note.delete({ where: { id, ownerId: user.id } });\n}`, why: "Anyone can call a Server Function's endpoint directly. Check auth and ownership inside it." },
      { bad: `'use client';\nasync function save() {\n  'use server';\n}`, good: `// actions.js\n'use server';\nexport async function save() { ... }`, why: "Server Functions can't be defined inside client files. Put them in a `'use server'` module and import them." }
    ],
    practice: [
      { level: "B", q: "What argument does a form action receive?", a: "A `FormData` object. With `useActionState`, it gets `(prevState, formData)`." },
      { level: "I", q: "Show a pending label on a submit button nested inside the form.", a: "Use `useFormStatus` from `react-dom` in a child component of the `<form>`.", code: `'use client';\nimport { useFormStatus } from 'react-dom';\nfunction SaveButton() {\n  const { pending } = useFormStatus();\n  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;\n}` },
      { level: "I", q: "Call a Server Function outside a form, e.g. a like button.", a: "Import it in a client component and call it in a handler, ideally inside `startTransition` so React tracks pending state." },
      { level: "C", q: "Bind a recipe id to a delete action in a list.", a: "Use `.bind`: `<form action={deleteRecipe.bind(null, recipe.id)}>`; the function gets `(id, formData)`." }
    ],
    quiz: [
      { q: "Where can `'use server'` go?", options: ["Top of a file or first line of an async function", "Only in `package.json`", "Inside any client component", "In JSX"], answer: 0, why: "Those are the two valid placements." },
      { q: "Is a Server Function private to your app?", options: ["Yes, only your UI can call it", "No, it's a reachable endpoint; validate and authorise", "Only in production", "Only if not exported"], answer: 1, why: "Treat each one like a public API route." },
      { q: "Which hook gives you the action's returned value and pending flag?", options: ["`useEffect`", "`useActionState`", "`useMemo`", "`useRef`"], answer: 1, why: "`useActionState(fn, initial)` returns `[state, formAction, isPending]`." }
    ],
    rev: {
      sec30: "Server Functions (`'use server'`) are async functions that run on the server but are callable from the client; React handles the network call. Passed to `<form action>` they're Server Actions and receive `FormData`. Pair with `useActionState` and `useFormStatus`. They are public endpoints: validate and authorise every call. Framework-only (Next.js App Router, RSC frameworks).",
      interview: [
        { level: "basic", q: "What is a Server Action?", a: "A Server Function used as a form `action` or called from a client: async code that runs on the server, invoked over the network by React." },
        { level: "intermediate", q: "How do you show errors and loading with them?", a: "`useActionState(action, initial)` gives the returned state and `isPending`; `useFormStatus` gives pending to a nested submit button." },
        { level: "advanced", q: "What are the security implications?", a: "Each creates an endpoint anyone can POST to. Validate inputs (e.g. Zod), check session and ownership, and never trust ids from the client." },
        { level: "tricky", q: "Does `'use server'` mark Server Components?", a: "No. Server Components need no directive. `'use server'` only marks Server Functions." }
      ],
      compare: { cols: ["", "API route + fetch", "Server Function"], rows: [
        ["You write", "Route, fetch, JSON parse", "One async function"],
        ["Works with `<form action>`", "Manually", "Built in"],
        ["Security checks", "Needed", "Still needed"]
      ]},
      cheat: [
        "`'use server'`: file top or first line of async function",
        "Client imports them; can't define inline",
        "`<form action={fn}>` → `fn(formData)`",
        "`useActionState` → `[state, action, isPending]`",
        "`useFormStatus` (react-dom) → `pending` in child",
        "Public endpoint: validate + authorise",
        "`'use server'` ≠ Server Component marker"
      ]
    },
    related: ["ADV-015", "HOOKS-018", "NEXT-012", "ADV-020"]
  },

  "ADV-018": {
    tldr: "Streaming SSR sends the page's HTML in pieces. The ready parts (the shell) arrive at once; each slow part wrapped in `<Suspense>` streams in later, replacing its fallback.",
    analogy: { icon: "🍕", text: "A pizza place brings garlic bread and drinks right away, then each pizza as it leaves the oven. You aren't kept waiting for the slowest order." },
    visual: { type: "timeline", title: "One product page, streamed", frames: [
      { label: "0 ms", state: "request /product/42", note: "Server starts rendering. Reviews query is slow." },
      { label: "40 ms", state: "shell sent: header, product, “Loading reviews…”", note: "`onShellReady` fires; the browser paints straight away." },
      { label: "60 ms", state: "JS starts loading, shell hydrates", note: "Users can click Add to cart before reviews exist." },
      { label: "900 ms", state: "<template> with reviews HTML + tiny script", note: "React swaps the fallback for real reviews in place." },
      { label: "950 ms", state: "reviews hydrate", note: "Response ends. No full-page wait for the slowest data." }
    ]},
    points: [
      "Old SSR (`renderToString`): wait for **all** data, then send everything. Slowest query = slowest page.",
      "Streaming: `renderToPipeableStream` (Node) or `renderToReadableStream` (Web streams, Edge/Deno/Bun).",
      "**Suspense boundaries** are the cut lines: content outside is the shell; content inside streams when ready.",
      "Frameworks do this for you: Next.js App Router (`loading.js` + Suspense) and React Router framework mode.",
      "Place boundaries around slow, non-critical parts (reviews, recommendations), not around the main content users came for."
    ],
    code: { file: "server.jsx", lang: "jsx", src: `import { createServer } from 'node:http';
import { Suspense } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import Product from './Product';
import Reviews from './Reviews'; // suspends while loading

function App() {
  return (
    <html>
      <body>
        <Product id={42} />
        <Suspense fallback={<p>Loading reviews…</p>}>
          <Reviews productId={42} />
        </Suspense>
      </body>
    </html>
  );
}

createServer((req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
    onShellError() {
      res.statusCode = 500;
      res.end('<h1>Something went wrong</h1>');
    },
    onError(err) {
      console.error(err);
    },
  });
  setTimeout(() => abort(), 10_000);
}).listen(3000);`, walk: [
      { lines: [11], note: "Product is outside any boundary, so it's part of the shell sent first." },
      { lines: [12, 14], note: "Reviews suspends; the fallback goes out in the shell and the real HTML streams later." },
      { lines: [21, 22], note: "Start streaming and tell the browser which script hydrates the page." },
      { lines: [23, 26], note: "As soon as the shell is ready, pipe it. Remaining chunks follow on the same response." },
      { lines: [27, 30], note: "If the shell itself fails, send an error page instead." },
      { lines: [35], note: "Stop waiting after 10 s; unfinished boundaries fall back to client rendering." }
    ]},
    output: "View source over a slow connection: the product HTML arrives first, then a later chunk with the reviews and an inline script that moves them into place.",
    mistakes: [
      { bad: `<Suspense fallback={<Spinner />}>\n  <App />  {/* whole page */}\n</Suspense>`, good: `<Header />\n<Product />\n<Suspense fallback={<ReviewsSkeleton />}>\n  <Reviews />\n</Suspense>`, why: "One boundary around everything means the shell is just a spinner. Wrap only the slow, secondary parts." },
      { bad: `const html = renderToString(<App />);\nres.end(html);`, good: `const { pipe } = renderToPipeableStream(<App />, {\n  onShellReady() { pipe(res); },\n});`, why: "`renderToString` can't wait for Suspense data or stream; it renders fallbacks and sends one blob." }
    ],
    practice: [
      { level: "B", q: "What decides what goes in the first chunk?", a: "Everything not inside a suspended `<Suspense>` boundary: the shell." },
      { level: "I", q: "Which API for Cloudflare Workers or Deno?", a: "`renderToReadableStream`, which returns a Web `ReadableStream` you can put in a `Response`." },
      { level: "I", q: "In Next.js App Router, how do you stream a slow page section?", a: "Wrap the async server component in `<Suspense fallback>` or add a `loading.js` for the whole route segment." },
      { level: "C", q: "A search-engine crawler should get the complete HTML. What option helps?", a: "Use `onAllReady` instead of `onShellReady` for bots, so you pipe only once everything has rendered." }
    ],
    quiz: [
      { q: "What marks where streaming splits the HTML?", options: ["`useEffect`", "`<Suspense>` boundaries", "`<div>` tags", "Route files only"], answer: 1, why: "Each boundary can stream its content later." },
      { q: "When does `onShellReady` fire?", options: ["After all data loads", "When everything outside pending Suspense boundaries has rendered", "After hydration", "On the client"], answer: 1, why: "That's the earliest moment useful HTML can be sent." },
      { q: "Main benefit over `renderToString`?", options: ["Smaller JS bundle", "First paint isn't blocked by the slowest data", "No hydration needed", "Works without a server"], answer: 1, why: "Fast parts reach the user immediately; slow parts follow." }
    ],
    rev: {
      sec30: "Streaming SSR sends HTML progressively. `renderToPipeableStream` (Node) / `renderToReadableStream` (Web) send the shell (everything outside pending Suspense boundaries) at `onShellReady`, then stream each boundary's HTML plus a small inline script that swaps out the fallback. Faster first paint and earlier hydration. Frameworks (Next.js, React Router framework mode) wire it up.",
      interview: [
        { level: "basic", q: "What is streaming SSR?", a: "Sending server-rendered HTML in chunks as it becomes ready instead of waiting for the whole page." },
        { level: "intermediate", q: "How do Suspense boundaries relate to streaming?", a: "They define the chunks. The shell includes fallbacks; when a boundary's data resolves, its HTML streams in and replaces the fallback." },
        { level: "advanced", q: "`onShellReady` vs `onAllReady`?", a: "`onShellReady` lets you start streaming early for users. `onAllReady` waits for everything, useful for crawlers or static generation." },
        { level: "tricky", q: "Once streaming starts, can you change the HTTP status to 404?", a: "No. Headers are sent with the shell. Decide status before `pipe`, or render the not-found UI inside the stream." }
      ],
      scenario: [
        { q: "A product page takes 2 s because of the recommendations query. Users complain.", a: "Wrap recommendations in `<Suspense>` with a skeleton so the product and buy button stream immediately and recommendations arrive later." }
      ],
      cheat: [
        "Node: `renderToPipeableStream`; Web: `renderToReadableStream`",
        "Shell = everything outside pending Suspense",
        "Pipe in `onShellReady`; bots: `onAllReady`",
        "Each boundary streams HTML + swap script",
        "Wrap slow, secondary parts, not the whole page",
        "`renderToString` can't stream or wait for data",
        "Headers/status are locked once the shell is sent"
      ]
    },
    related: ["ADV-003", "ADV-019", "NEXT-010", "INTRO-012"]
  },

  "ADV-019": {
    tldr: "Hydration attaches React to server-made HTML so it becomes interactive. The first client render must produce exactly the same HTML, or you get a mismatch error.",
    analogy: { icon: "🧩", text: "A printed jigsaw picture arrives first; then the real pieces are laid on top. If a piece shows a different picture, it won't fit and has to be redone." },
    visual: { type: "flow", title: "Hydration, and where it breaks", steps: [
      { label: "Server HTML arrives", detail: "User sees the page, but buttons don't work yet." },
      { label: "JS loads", detail: "`hydrateRoot(document, <App />)` starts." },
      { label: "Client renders", detail: "React renders the same tree and compares it with the existing DOM." },
      { label: "Match → attach", detail: "React reuses the DOM nodes and attaches event handlers." },
      { label: "Mismatch → error", detail: "Text or tags differ: React logs an error and re-renders that part on the client." }
    ]},
    points: [
      "Use `hydrateRoot` (from `react-dom/client`) for SSR HTML, not `createRoot`.",
      "Common mismatches: `new Date()`, `Math.random()`, `typeof window` in render, locale formatting, invalid nesting (`<div>` in `<p>`).",
      "Fix: render the same thing on both sides, then switch to client-only values in **`useEffect`** after hydration.",
      "Use `useId` for matching ids; `suppressHydrationWarning` only for one unavoidable text difference (like a timestamp).",
      "**Selective hydration**: each `<Suspense>` boundary hydrates on its own, and React hydrates the part the user clicks **first**."
    ],
    code: { file: "LastUpdated.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

// ❌ Server and client print different times
function LastUpdatedBad() {
  return <p>Updated {new Date().toLocaleTimeString()}</p>;
}

// ✅ Same HTML on both, then update after hydration
export default function LastUpdated({ isoTime }) {
  const [label, setLabel] = useState(isoTime);

  useEffect(() => {
    setLabel(new Date(isoTime).toLocaleTimeString());
  }, [isoTime]);

  return <p>Updated {label}</p>;
}

// client.jsx
// import { hydrateRoot } from 'react-dom/client';
// hydrateRoot(document.getElementById('root'), <App />);`, walk: [
      { lines: [4, 6], note: "Server time ≠ client time, and server locale ≠ user's locale: guaranteed mismatch." },
      { lines: [9, 10], note: "Start from a value both sides agree on: the ISO string from the data." },
      { lines: [12, 14], note: "Effects don't run on the server, so the local time is only shown after hydration." },
      { lines: [20, 21], note: "Hydrate onto existing HTML with `hydrateRoot`, not `createRoot`." }
    ]},
    output: "No hydration error. The page first shows the ISO time, then immediately the user's local time.",
    mistakes: [
      { bad: `function Price({ p }) {\n  if (typeof window === 'undefined') return <span>{p}</span>;\n  return <span>{format(p)}</span>;\n}`, good: `function Price({ p }) {\n  const [ready, setReady] = useState(false);\n  useEffect(() => setReady(true), []);\n  return <span>{ready ? format(p) : p}</span>;\n}`, why: "Branching on `window` in render gives different server and client output. Switch after hydration in an effect." },
      { bad: `<p>Weather: <div>Sunny</div></p>`, good: `<div>Weather: <div>Sunny</div></div>`, why: "Invalid HTML nesting is repaired by the browser parser, so the DOM no longer matches what React expects." }
    ],
    practice: [
      { level: "B", q: "Which function hydrates SSR HTML?", a: "`hydrateRoot(container, <App />)` from `react-dom/client`." },
      { level: "I", q: "A cart badge reads `localStorage` and mismatches. Fix it.", a: "Render 0 (or nothing) on the server and first client render, then read `localStorage` in `useEffect` and set state." },
      { level: "I", q: "When is `suppressHydrationWarning` acceptable?", a: "For a single element whose text must differ, like a timestamp. It only works one level deep and doesn't fix logic bugs." },
      { level: "C", q: "With selective hydration, what happens if a user clicks the comments box before it hydrates?", a: "React records the event, prioritises hydrating that Suspense boundary, then replays the click." }
    ],
    quiz: [
      { q: "Which causes a hydration mismatch?", options: ["`useState(0)`", "Rendering `Math.random()`", "An `onClick` handler", "Using `useId`"], answer: 1, why: "Random values differ between server and client renders." },
      { q: "Best place for browser-only values like `window.innerWidth`?", options: ["In render", "In `useEffect` after hydration", "In the server function", "In a CSS file"], answer: 1, why: "Effects run only in the browser, after hydration." },
      { q: "Selective hydration lets React:", options: ["Skip hydration", "Hydrate boundaries independently and prioritise what the user interacts with", "Hydrate on the server", "Avoid sending HTML"], answer: 1, why: "Suspense boundaries are hydration units too." }
    ],
    rev: {
      sec30: "Hydration makes server HTML interactive: `hydrateRoot` renders the same tree and attaches handlers to existing DOM. The first client render must match the server. Avoid dates, randomness, `window` checks, locale formatting and invalid nesting in render; switch in `useEffect`, use `useId`. Selective hydration: Suspense boundaries hydrate separately, prioritising the one the user touches.",
      interview: [
        { level: "basic", q: "What is hydration?", a: "React running on the client against server-rendered HTML, reusing the DOM and attaching event handlers so the page becomes interactive." },
        { level: "intermediate", q: "What causes hydration mismatches and how do you fix them?", a: "Non-deterministic or environment-dependent render output: dates, random, `window`, locale, bad HTML nesting. Render identically, then update in `useEffect`." },
        { level: "advanced", q: "Explain selective hydration.", a: "With streaming and Suspense, each boundary hydrates independently, so the page needn't hydrate all at once. If the user interacts with an unhydrated part, React hydrates it first and replays the event." },
        { level: "tricky", q: "Why not just add `suppressHydrationWarning` everywhere?", a: "It only silences text differences one level deep. React won't patch attributes, so the UI can stay wrong, and real bugs get hidden." }
      ],
      debug: [
        { code: `function Greeting() {\n  const name = localStorage.getItem('name') ?? 'guest';\n  return <h1>Hi {name}</h1>;\n}`, fix: `function Greeting() {\n  const [name, setName] = useState('guest');\n  useEffect(() => {\n    setName(localStorage.getItem('name') ?? 'guest');\n  }, []);\n  return <h1>Hi {name}</h1>;\n}`, why: "`localStorage` doesn't exist on the server (crash) and differs on the client (mismatch). Read it after hydration." }
      ],
      cheat: [
        "`hydrateRoot(container, <App />)` for SSR HTML",
        "First client render must equal server HTML",
        "Avoid in render: `Date`, `Math.random`, `window`, locale",
        "Client-only values → `useEffect` + state",
        "Matching ids → `useId`",
        "`suppressHydrationWarning`: one text node, last resort",
        "Selective hydration: per Suspense boundary, clicks first"
      ]
    },
    related: ["RENDER-017", "ADV-018", "ADV-016", "INTRO-012"]
  },

  "ADV-020": {
    tldr: "Progressive enhancement means the basic feature works with plain HTML first, and JavaScript makes it nicer. A real `<form>` with a server action still submits even before (or without) JS.",
    analogy: { icon: "🛗", text: "A lift with stairs beside it. When the lift works it's faster; when it's down, you can still reach the shop on the next floor." },
    visual: { type: "layers", title: "Build up in layers", items: [
      { label: "Enhanced UX (JS loaded)", detail: "Pending spinners, instant UI updates, no full page reload." },
      { label: "Framework form handling", detail: "`<Form>` / Server Action intercepts submit and posts via fetch." },
      { label: "Server action", detail: "A server function or route `action` handles the POST and returns or redirects." },
      { label: "Plain HTML form", detail: "`<form method=\"post\">` with `name`d inputs: works with zero JS." }
    ]},
    points: [
      "Start with a real `<form>`, `name` on every input, and a `<button type=\"submit\">`. No `onClick` + `fetch` only.",
      "Needs server rendering + a server handler, so it's a **framework** feature: React Router framework mode `action`, Next.js Server Actions.",
      "Before hydration the browser does a normal POST; after hydration the framework intercepts it and avoids a reload.",
      "Server Actions passed to `<form action>` work before JS. `useActionState(fn, init, permalink)` can keep it working pre-hydration too.",
      "Why care: slow phones and networks, JS errors, flaky chunk loads. The checkout or comment box still works."
    ],
    code: { file: "app/routes/newsletter.jsx", lang: "jsx", src: `// React Router 7 framework mode route module
import { Form, useNavigation } from 'react-router';
import { subscribe } from '../newsletter.server';

export async function action({ request }) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '');
  if (!email.includes('@')) {
    return { error: 'Please enter a valid email' };
  }
  await subscribe(email);
  return { ok: true };
}

export default function Newsletter({ actionData }) {
  const navigation = useNavigation();
  const busy = navigation.state === 'submitting';

  if (actionData?.ok) return <p>Thanks for subscribing!</p>;

  return (
    <Form method="post">
      <input type="email" name="email" required />
      <button type="submit" disabled={busy}>
        {busy ? 'Subscribing…' : 'Subscribe'}
      </button>
      {actionData?.error && <p role="alert">{actionData.error}</p>}
    </Form>
  );
}`, walk: [
      { lines: [5, 13], note: "The route `action` runs on the server for POSTs, with or without JS." },
      { lines: [6, 10], note: "Validate on the server; client validation is just a bonus." },
      { lines: [22, 23], note: "`<Form method=\"post\">` renders a real `<form>` and a `name`d input, so the browser can submit it alone." },
      { lines: [16, 17], note: "Once JS is loaded, the submit is intercepted and you get a pending state." },
      { lines: [15, 19], note: "`actionData` holds the action's return value in both modes." }
    ]},
    output: "With JS disabled, submitting reloads the page showing “Thanks for subscribing!”. With JS, the same happens without a reload and the button shows “Subscribing…”.",
    mistakes: [
      { bad: `<div>\n  <input value={email} onChange={...} />\n  <button onClick={() => fetch('/api/sub', ...)}>Go</button>\n</div>`, good: `<Form method="post">\n  <input type="email" name="email" />\n  <button type="submit">Go</button>\n</Form>`, why: "A click handler + fetch does nothing until JS loads. A real form posts on its own and is enhanced later." },
      { bad: `<input type="email" />  // no name`, good: `<input type="email" name="email" />`, why: "Without `name`, the value isn't included in the form data, so the server never receives it." }
    ],
    practice: [
      { level: "B", q: "How do you test progressive enhancement?", a: "Disable JavaScript in DevTools and use the feature. It should still work, just with full page loads." },
      { level: "I", q: "Make a Next.js comment form progressively enhanced.", a: "Use a Server Action as the form `action`.", code: `// server component\nimport { addComment } from './actions';\n<form action={addComment}>\n  <textarea name="body" required />\n  <button type="submit">Post</button>\n</form>` },
      { level: "I", q: "Does a plain Vite SPA get this for free?", a: "No. Without server-rendered HTML and a server handler, there's nothing to submit to before JS runs." },
      { level: "C", q: "What does the third argument of `useActionState` do?", a: "A permalink URL: if the form is submitted before hydration, the browser navigates there so the framework can render the result." }
    ],
    quiz: [
      { q: "What must an input have to be sent with a plain form POST?", options: ["`id`", "`name`", "`onChange`", "`value`"], answer: 1, why: "Form data is keyed by `name`." },
      { q: "Before JS loads, a React Router framework `<Form method=\"post\">`:", options: ["Does nothing", "Submits as a normal HTML form to the route action", "Throws", "Uses fetch"], answer: 1, why: "It renders a real `<form>`; the browser submits it." },
      { q: "Which setup can't offer this?", options: ["Next.js App Router", "React Router framework mode", "Client-only Vite SPA", "Remix-style SSR"], answer: 2, why: "No server HTML or handler exists before the JS bundle runs." }
    ],
    rev: {
      sec30: "Progressive enhancement: build on HTML that works without JS, then layer on JS. Use real `<form>`s with `name`d inputs posting to a server handler (React Router framework `action`, Next.js Server Action). Pre-hydration it's a normal POST; post-hydration it's intercepted for a smoother UX. Framework feature; test with JS disabled.",
      interview: [
        { level: "basic", q: "What is progressive enhancement?", a: "Building a baseline that works with plain HTML, then adding JavaScript for a better experience without breaking the baseline." },
        { level: "intermediate", q: "How do React 19 forms support it?", a: "A Server Action passed to `<form action>` produces a real form that posts to the server even before hydration; after hydration React handles it client-side." },
        { level: "advanced", q: "Why does it matter if most users have JS?", a: "Everyone has no JS while it's downloading. Slow networks, failed chunks or errors would otherwise break critical flows like checkout." },
        { level: "tricky", q: "Is a client-only `onSubmit` with `preventDefault` progressive?", a: "Only if the form also has a working `action`/`method` to a server. Otherwise, without JS, the browser does a native submit (GET to the current URL by default) that nothing handles." }
      ],
      cheat: [
        "Baseline: real `<form method=\"post\">` + `name`d inputs",
        "Handler on the server: route `action` or Server Action",
        "Framework-only (needs SSR + server)",
        "Pre-hydration: normal POST; after: intercepted",
        "`useActionState(fn, init, permalink)`",
        "Test: disable JS in DevTools",
        "Always validate on the server"
      ]
    },
    related: ["ADV-017", "ROUTE-018", "EVT-020", "HOOKS-018"]
  },

  "ADV-021": {
    tldr: "React Compiler (stable 1.0, Oct 2025) is a build-time tool that adds memoization for you. It rewrites components and hooks so values, callbacks and JSX are reused when their inputs haven't changed.",
    analogy: { icon: "🧑‍🍳", text: "A sous-chef who notices you're chopping the same onions every order and keeps a prepped bowl ready, swapping it only when the recipe changes." },
    visual: { type: "flow", title: "From your code to optimised output", steps: [
      { label: "You write plain React", detail: "No `useMemo`, `useCallback` or `memo` needed." },
      { label: "Build runs the compiler", detail: "A Babel plugin runs first in the pipeline, inside Vite." },
      { label: "Analyse + check rules", detail: "It tracks which values depend on which props/state. Rule-breaking code is skipped, not broken." },
      { label: "Emit cached code", detail: "Inserts cache slots: recompute a value or JSX only when its inputs change." },
      { label: "Fewer re-renders", detail: "Children get stable props, so unchanged subtrees are skipped. DevTools shows a **Memo ✨** badge." }
    ]},
    points: [
      "Works at **build time**; no runtime API to call. Your component code stays the same.",
      "Memoizes **finer** than you would by hand, including conditional values and JSX elements.",
      "Requires code that follows the **Rules of React** (pure render, no mutating props/state, hooks rules). It skips components it can't prove safe.",
      "Vite (plugin-react 6+): install `babel-plugin-react-compiler` + `@rolldown/plugin-babel`, add `babel({ presets: [reactCompilerPreset()] })`.",
      "Use `eslint-plugin-react-hooks` (recommended config) to catch rule violations; opt one component out with `'use no memo'`.",
      "Targets React 19 by default; React 17/18 need `react-compiler-runtime` and a `target` option."
    ],
    code: { file: "vite.config.js", lang: "js", src: `// npm install -D babel-plugin-react-compiler@latest @rolldown/plugin-babel
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});

// Older @vitejs/plugin-react (< 6):
// react({ babel: { plugins: ['babel-plugin-react-compiler'] } })`, walk: [
      { lines: [1], note: "Two dev dependencies: the compiler itself and the Babel plugin for Vite 8's Rolldown bundler." },
      { lines: [3], note: "`@vitejs/plugin-react` 6+ exports a ready-made `reactCompilerPreset`." },
      { lines: [9, 11], note: "Run Babel with the preset. The compiler must run first among Babel transforms." },
      { lines: [15, 16], note: "Plugin-react before v6 took Babel options inline instead." }
    ]},
    output: "After `npm run dev`, React DevTools shows a **Memo ✨** badge next to components the compiler optimised.",
    mistakes: [
      { bad: `function Playlist({ songs }) {\n  songs.sort(byTitle); // mutates a prop\n  return <List items={songs} />;\n}`, good: `function Playlist({ songs }) {\n  const sorted = songs.toSorted(byTitle);\n  return <List items={sorted} />;\n}`, why: "Mutating props breaks the Rules of React. The compiler may skip the component, and memoized output could go stale." },
      { bad: `// "The compiler will fix my slow list"\n<List items={tenThousandRows} />`, good: `// memoization + virtualization\n<VirtualList items={tenThousandRows} />`, why: "The compiler avoids repeat work; it can't make one big render cheap. Rendering 10,000 rows still needs virtualization." }
    ],
    practice: [
      { level: "B", q: "Does the compiler run in the browser?", a: "No. It transforms your code during the build; the browser runs the already-optimised output." },
      { level: "I", q: "How do you check a component was compiled?", a: "Look for the **Memo ✨** badge in React DevTools, or check the compiled output in the build." },
      { level: "I", q: "A component misbehaves after enabling the compiler. Quick workaround?", a: "Add `'use no memo'` as the first line of its function body, then fix the underlying rule violation." },
      { level: "C", q: "How would you roll it out to a big existing app?", a: "Enable the ESLint rules first and fix violations, then turn the compiler on (optionally for some directories via `sources`), test, and expand." }
    ],
    quiz: [
      { q: "What does React Compiler do?", options: ["Replaces the virtual DOM", "Automatically memoizes components and hooks at build time", "Converts JSX to WebAssembly", "Adds server rendering"], answer: 1, why: "It's an optimising compiler for memoization." },
      { q: "What happens with code that breaks the Rules of React?", options: ["Build fails", "The compiler skips optimising it", "It runs on the server", "It's rewritten correctly"], answer: 1, why: "It bails out safely for components it can't prove pure." },
      { q: "Opt a single component out:", options: ["`'use client'`", "`'use no memo'`", "`React.noCompile()`", "`// eslint-disable`"], answer: 1, why: "`'use no memo'` is the compiler's opt-out directive." }
    ],
    rev: {
      sec30: "React Compiler 1.0 is a build-time Babel plugin that auto-memoizes components and hooks: it caches values, callbacks and JSX and recomputes only when inputs change. It relies on the Rules of React and skips code it can't verify. Vite: `babel-plugin-react-compiler` + `@rolldown/plugin-babel` with `reactCompilerPreset()`. Lint with `eslint-plugin-react-hooks`; opt out with `'use no memo'`.",
      interview: [
        { level: "basic", q: "What problem does React Compiler solve?", a: "Manual memoization is tedious and easy to get wrong. The compiler adds it automatically so components skip unnecessary work." },
        { level: "intermediate", q: "How does it decide what to memoize?", a: "It analyses data flow in each component and hook, groups values by their dependencies, and caches each group, recomputing only when a dependency changes." },
        { level: "advanced", q: "What does it need from your code?", a: "Purity and the Rules of React: no side effects in render, no mutating props/state, consistent hook calls. It bails out on code that violates them." },
        { level: "tricky", q: "Does enabling it mean you can delete every `useMemo`?", a: "Not blindly. It works alongside existing memoization; removing some can change behaviour like effect firing. New code can rely on it; remove old memo carefully, with tests." },
        { level: "intermediate", q: "Is it tied to React 19?", a: "It targets 19 by default, but works with 17 and 18 using `react-compiler-runtime` and the `target` option." }
      ],
      cheat: [
        "Build-time, automatic memoization (1.0 stable, Oct 2025)",
        "Vite: `babel({ presets: [reactCompilerPreset()] })`",
        "Deps: `babel-plugin-react-compiler`, `@rolldown/plugin-babel`",
        "Must run first among Babel plugins",
        "Needs Rules of React; skips unsafe code",
        "Opt out: `'use no memo'`",
        "DevTools: **Memo ✨** badge"
      ]
    },
    related: ["ADV-022", "ADV-001", "PERF-019", "HOOKS-009"]
  },

  "ADV-022": {
    tldr: "With React Compiler on, write plain code and let it memoize. Reach for `useMemo` / `useCallback` only as an escape hatch: when you need precise control, the compiler skipped a component, or the compiler is off.",
    analogy: { icon: "🎵", text: "A music app auto-builds playlists for you. You still pin a song by hand when it must stay in a fixed spot, but you stop curating every track yourself." },
    visual: { type: "compare", title: "Manual memo: when to keep it", left: { label: "Let the compiler do it", tone: "good", points: ["Filtering/sorting a cart list", "Callbacks passed to children", "Wrapping children in `memo`", "New code in a compiled project"] }, right: { label: "Still write it by hand", tone: "neutral", points: ["A value used as an effect dependency you must keep stable", "Compiler is off, or bailed out on that component", "Library code that isn't compiled", "Existing memo you haven't tested removing"] } },
    points: [
      "Default for new code: **no** `useMemo`, `useCallback` or `memo`. The compiler adds finer memoization.",
      "Keep manual memo as an **escape hatch** when you need control, e.g. a memoized object used as a `useEffect` dependency.",
      "If the compiler **skipped** a component (Rules of React violation, no ✨ badge), fix the violation first; manual memo is the fallback.",
      "Not compiled = no auto memo: projects without the compiler, and most packages in `node_modules`.",
      "Don't mass-delete existing `useMemo`/`useCallback`: removing them can change compiled output. Remove with tests and profiling."
    ],
    code: { file: "WeatherWidget.jsx", lang: "jsx", src: `import { useEffect, useMemo, useState } from 'react';

export default function WeatherWidget({ city, units }) {
  const [forecast, setForecast] = useState(null);

  // Compiler handles this: no useMemo needed
  const hotDays = forecast?.days.filter((d) => d.max > 25) ?? [];

  // Escape hatch: we want the effect to depend on a stable object
  const query = useMemo(() => ({ city, units }), [city, units]);

  useEffect(() => {
    let ignore = false;
    fetchForecast(query).then((data) => {
      if (!ignore) setForecast(data);
    });
    return () => { ignore = true; };
  }, [query]);

  return (
    <section>
      <h2>{city}</h2>
      <p>{hotDays.length} hot days this week</p>
    </section>
  );
}`, walk: [
      { lines: [6, 7], note: "Derived data: the compiler caches it automatically, so leave it plain." },
      { lines: [9, 10], note: "Explicit `useMemo` documents and guarantees the effect only refetches when `city` or `units` change." },
      { lines: [12, 18], note: "The effect depends on `query`; manual memo gives you precise control over when it fires." },
      { lines: [13, 17], note: "Cleanup ignores stale responses if the city changes mid-request." }
    ]},
    output: "Shows the city and “N hot days this week”. Changing `city` refetches once; unrelated parent re-renders don't.",
    mistakes: [
      { bad: `const total = useMemo(\n  () => cart.reduce((s, i) => s + i.price, 0),\n  [cart]\n);  // in a compiled project, new code`, good: `const total = cart.reduce((s, i) => s + i.price, 0);`, why: "In compiled code this manual memo adds noise; the compiler already caches it." },
      { bad: `// removed every useCallback in one PR,\n// shipped without testing`, good: `// remove gradually; check effects\n// and Profiler before/after`, why: "Some memo keeps effect dependencies stable. Removing it can make effects run more often or change behaviour." }
    ],
    practice: [
      { level: "B", q: "Compiler is on. Do you wrap a new `onAdd` callback in `useCallback`?", a: "No. The compiler gives it a stable identity when its inputs don't change." },
      { level: "I", q: "No ✨ badge on `NotesList`. What do you do first?", a: "Run the React Hooks ESLint rules to find the violation (e.g. mutating props), fix it, and let the compiler optimise it." },
      { level: "I", q: "Your app doesn't use the compiler. Is manual memo still useful?", a: "Yes. Then `useMemo`, `useCallback` and `memo` are the only memoization, used where profiling shows a benefit." },
      { level: "C", q: "A chart library re-initialises whenever its `options` object changes identity. Compiler on: anything to do?", a: "Usually the compiler stabilises it, but if you need a guarantee across refactors, memoize `options` explicitly with `useMemo` and its real dependencies." }
    ],
    quiz: [
      { q: "With the compiler on, new code should usually:", options: ["Wrap everything in `useMemo`", "Skip manual memo and stay plain", "Use `memo` on every component", "Avoid hooks"], answer: 1, why: "The compiler memoizes automatically; manual memo is an escape hatch." },
      { q: "A good reason to keep a manual `useMemo`:", options: ["Habit", "A value used as an effect dependency needing precise control", "Every array literal", "To speed up the build"], answer: 1, why: "React docs list effect dependencies as a case for explicit control." },
      { q: "Safest way to treat existing `useMemo` after enabling the compiler?", options: ["Delete it all", "Leave it, remove gradually with tests", "Convert to `useCallback`", "Move it to effects"], answer: 1, why: "Removing it can change compiled output and effect behaviour." }
    ],
    rev: {
      sec30: "Compiler on: write plain code; it memoizes values, callbacks and JSX. Keep `useMemo`/`useCallback` as escape hatches for precise control (stable effect dependencies), for components the compiler skipped, and where the compiler isn't running (off, or uncompiled libraries). Leave existing memo in place and remove gradually with tests and profiling.",
      interview: [
        { level: "basic", q: "Do we still need `useMemo` with React Compiler?", a: "Rarely in new code. It's an escape hatch for when you need explicit control over a value's identity." },
        { level: "intermediate", q: "Give concrete cases for manual memo with the compiler on.", a: "A memoized value used as an effect dependency, components the compiler bailed out on, and code paths outside compilation, like un-compiled libraries." },
        { level: "advanced", q: "Why not just remove existing memoization?", a: "The compiler respects it and its output can differ without it; effects may fire more often. Remove deliberately, with tests and Profiler checks." },
        { level: "tricky", q: "Is `React.memo` still useful with the compiler?", a: "Mostly no: the compiler stabilises props and JSX so children skip work. It remains useful in projects or files that aren't compiled." }
      ],
      compare: { cols: ["", "No compiler", "Compiler on"], rows: [
        ["Default", "Plain; memo where profiling shows need", "Plain; compiler memoizes"],
        ["`useMemo`/`useCallback`", "Your main tool", "Escape hatch"],
        ["`React.memo`", "For costly children", "Rarely needed"],
        ["Existing memo", "Keep", "Keep; remove gradually"]
      ]},
      cheat: [
        "Compiler on → write plain code first",
        "Manual memo = escape hatch, not default",
        "Keep it for stable effect dependencies",
        "No ✨ badge → fix the Rules of React violation",
        "Uncompiled code still needs manual memo",
        "Don't mass-delete old memo; test + profile"
      ]
    },
    related: ["ADV-021", "HOOKS-010", "PERF-005", "PERF-006"]
  },
};
