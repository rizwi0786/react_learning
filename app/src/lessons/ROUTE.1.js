export default {
  "ROUTE-001": {
    tldr: "Routing means picking which screen to show for the current URL. `/cart` shows the cart, `/products/7` shows product 7. The URL becomes the app's address book.",
    analogy: { icon: "🏬", text: "A shopping mall directory. You say \"Shoe shop, level 2\" and get taken there. A URL is the address; the router is the directory that finds the right shop (screen)." },
    visual: { type: "flow", title: "From URL to screen", steps: [
      { label: "User changes URL", detail: "Types `/cart`, clicks a link, or presses Back." },
      { label: "Router reads URL", detail: "It looks at the path part (pathname): `/cart`." },
      { label: "Match a route", detail: "Compares the path with your list of patterns (routes) and finds the best match." },
      { label: "Render the screen", detail: "Shows the component for that route: `<Cart />`." }
    ]},
    points: [
      "A **route** = a URL pattern + the screen (element) to show for it.",
      "Patterns can have **placeholders** (params): `/products/:id` matches `/products/7`.",
      "The URL is **state you can share**: bookmark it, paste it in chat, refresh, and you land on the same screen.",
      "In .NET terms it's like endpoint routing (`MapGet(\"/products/{id}\")`), but it runs in the browser.",
      "React has no built-in router; most apps use **React Router** (package `react-router`)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `// The idea, without any library: URL -> screen
const routes = {
  '/': () => <h1>Shop home</h1>,
  '/cart': () => <h1>Your cart</h1>,
  '/orders': () => <h1>Past orders</h1>,
};

function NotFound() {
  return <h1>Page not found</h1>;
}

export default function App() {
  const path = window.location.pathname;   // e.g. "/cart"
  const Screen = routes[path] ?? NotFound; // look up the screen
  return <Screen />;
}`, walk: [
      { lines: [2, 3, 4, 5, 6], note: "A route table: each path maps to a screen." },
      { lines: [13], note: "Read the current path from the browser's address bar." },
      { lines: [14], note: "Pick the matching screen, or fall back to a 404 screen." },
      { lines: [15], note: "Render it. A real router also handles params, links, Back/Forward and nesting." }
    ]},
    output: "Visiting /cart shows “Your cart”; /oops shows “Page not found”.",
    mistakes: [
      { bad: `const [page, setPage] = useState('cart');\n{page === 'cart' && <Cart />}`, good: `<Route path="/cart" element={<Cart />} />`, why: "Screens kept only in state have no URL: refresh loses the page, Back doesn't work and you can't share a link." }
    ],
    practice: [
      { level: "B", q: "Which part of `https://shop.dev/products/7?color=red` does the router mainly match on?", a: "The pathname `/products/7`. `?color=red` is the query string, read separately." },
      { level: "B", q: "Add an `/about` screen to the route table above.", a: "Add `'/about': () => <h1>About us</h1>` to `routes`." },
      { level: "I", q: "Why doesn't the hand-written router above update when you change the page with JS?", a: "It only reads `window.location` once per render and nothing re-renders it. Real routers listen to URL changes (History API) and re-render." },
      { level: "C", q: "Sketch the routes for a recipe app: list, one recipe, favourites, 404.", a: "`/recipes`, `/recipes/:id`, `/favourites`, `*` (catch-all)." }
    ],
    quiz: [
      { q: "What does a route connect?", options: ["A URL pattern and a screen", "A component and its state", "A server and a database", "A link and a CSS class"], answer: 0, why: "Routing maps URLs to the UI that should show." },
      { q: "Biggest benefit of putting the current screen in the URL?", options: ["Faster renders", "Shareable, bookmarkable, refresh-safe pages", "Less JavaScript", "No need for components"], answer: 1, why: "The URL survives refresh and can be sent to someone else." },
      { q: "Does React include a router out of the box?", options: ["Yes, `react` exports `Router`", "No, you add a library like React Router", "Only in Strict Mode"], answer: 1, why: "React is a UI library; routing comes from packages such as `react-router` or a framework." }
    ],
    rev: {
      sec30: "Routing maps URLs to screens. A route is a path pattern plus an element. The router reads the current URL, finds the best matching route and renders its component. Keeping the screen in the URL makes pages shareable, bookmarkable and Back-button friendly. React itself has no router; React Router is the standard choice.",
      interview: [
        { level: "basic", q: "What is routing in a React app?", a: "Choosing which component tree to render based on the URL, so each screen has its own address." },
        { level: "basic", q: "Why not just switch screens with a `useState` flag?", a: "No URL means no deep links, no refresh safety and no Back/Forward history." },
        { level: "intermediate", q: "What parts of a URL can drive UI?", a: "Path segments (`/products/7`, read as params), the query string (`?sort=price`, for filters) and the hash. React Router reads them with `useParams`, `useSearchParams` and `useLocation`." },
        { level: "tricky", q: "Is routing client-side or server-side?", a: "Either. MPAs route on the server (each URL returns a new HTML page). SPAs route in the browser. Frameworks often do both: server renders the first page, the client takes over." }
      ],
      cheat: [
        "Route = path pattern + element",
        "Router reads the URL, matches a route, renders its element",
        "`:id` in a path = dynamic segment (param)",
        "URL state = shareable + bookmarkable + refresh-safe",
        "React has no router: use `react-router` (v7) or a framework",
        "Always add a catch-all `*` route for 404"
      ]
    },
    related: ["ROUTE-002", "ROUTE-006", "INTRO-009"]
  },

  "ROUTE-002": {
    tldr: "Client-side routing swaps the screen in JavaScript instead of asking the server for a new page. The URL still changes, so links stay shareable, but the app never fully reloads.",
    analogy: { icon: "🎵", text: "A music app that changes the song without restarting the app. The playlist, volume and queue stay put; only the \"now playing\" part changes." },
    visual: { type: "compare", title: "Full reload vs client-side navigation",
      left: { label: "Full page reload (MPA)", tone: "bad", points: [
        "Browser requests a new HTML page from the server",
        "Screen goes blank, everything re-downloads",
        "All JS state is lost (cart drawer, form input)",
        "Simple, works with zero JavaScript"
      ]},
      right: { label: "Client-side routing (SPA)", tone: "good", points: [
        "JS updates the URL with the History API (`pushState`)",
        "Only the changed part of the UI re-renders",
        "App state survives the navigation",
        "Back/Forward and refresh still work"
      ]}
    },
    points: [
      "The router changes the address bar with `history.pushState` (no request sent) and re-renders.",
      "It also listens for **Back/Forward** (`popstate`) and shows the matching screen.",
      "URLs stay **real**: refresh or open a link in a new tab and the same screen appears.",
      "Needs a server/host **fallback**: unknown paths must return `index.html`, or refresh on `/cart` gives a 404.",
      "Vite's dev server already does this fallback; configure it on your host for production."
    ],
    code: { file: "history-demo.js", lang: "js", src: `// What a router does under the hood (simplified)
function render() {
  const path = window.location.pathname;
  document.querySelector('#app').textContent =
    path === '/cart' ? 'Your cart' : 'Shop home';
}

// 1. Navigate: change the URL WITHOUT a server request
function navigate(to) {
  history.pushState({}, '', to);
  render();
}

// 2. Back / Forward buttons
window.addEventListener('popstate', render);

// 3. Intercept link clicks
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="/"]');
  if (!a) return;
  e.preventDefault();          // stop the full reload
  navigate(a.getAttribute('href'));
});

render();`, walk: [
      { lines: [2, 3, 4, 5], note: "Draw the screen for whatever the URL is right now." },
      { lines: [9, 10, 11], note: "`pushState` changes the address bar and adds a history entry. No network request." },
      { lines: [15], note: "`popstate` fires on Back/Forward; just re-render for the new URL." },
      { lines: [18, 19, 20, 21, 22], note: "Catch link clicks and stop the browser's full reload. React Router's `<Link>` does exactly this." }
    ]},
    output: "Clicking a /cart link changes the URL and text instantly; the Network tab shows no new document request.",
    mistakes: [
      { bad: `// Host serves only files that exist\n/cart -> 404 Not Found`, good: `// Host rewrites unknown paths\n/*  ->  /index.html  (200)`, why: "On refresh the browser asks the server for `/cart`. Without an SPA fallback the host has no such file and returns 404." },
      { bad: `<a href="/cart">Cart</a>  // inside a React Router app`, good: `<Link to="/cart">Cart</Link>`, why: "A plain anchor triggers a full reload and wipes app state." }
    ],
    practice: [
      { level: "B", q: "Name two things lost on a full page reload that client routing keeps.", a: "In-memory state (e.g. cart drawer open, typed text) and already-loaded JS/CSS." },
      { level: "I", q: "Refreshing `/orders` on your deployed SPA gives 404. Why, and how do you fix it?", a: "The host has no `/orders` file. Add a rewrite so all unknown paths serve `index.html` (e.g. a `_redirects` or `vercel.json` rewrite)." },
      { level: "I", q: "Does `history.pushState` fire `popstate`?", a: "No. `popstate` fires only on Back/Forward (or `history.back()`), so routers re-render themselves after `pushState`." },
      { level: "C", q: "When is a full page load still the right choice?", a: "Leaving your app (external sites), downloads, or switching to a different app on the same domain. In React Router use a plain `<a>` or `reloadDocument`." }
    ],
    quiz: [
      { q: "What does `history.pushState({}, '', '/cart')` do?", options: ["Loads /cart from the server", "Changes the URL and adds a history entry, no request", "Reloads the page", "Opens a new tab"], answer: 1, why: "It only updates the address bar and history stack." },
      { q: "Refresh on `/cart` in production shows the host's 404. Most likely cause?", options: ["React Router bug", "Missing SPA fallback to index.html", "Wrong React version", "Route order"], answer: 1, why: "The server must serve `index.html` for client-side paths." },
      { q: "Which event lets a router react to the Back button?", options: ["`hashchange` only", "`popstate`", "`beforeunload`", "`click`"], answer: 1, why: "`popstate` fires when the user moves through history." }
    ],
    rev: {
      sec30: "Client-side routing updates the URL with the History API and re-renders only what changed, so there's no white flash and app state survives. URLs remain real, so Back, refresh and sharing work, but the server must fall back to `index.html` for unknown paths. Trade-off: first load ships more JS and SEO needs SSR or prerendering.",
      interview: [
        { level: "basic", q: "Why use client-side routing?", a: "Instant navigation without full reloads, state kept between screens, while URLs stay shareable." },
        { level: "intermediate", q: "How does it work under the hood?", a: "Links are intercepted, `history.pushState` updates the URL, the router matches the new path and re-renders. `popstate` handles Back/Forward." },
        { level: "intermediate", q: "Why does refresh 404 on some deployments?", a: "The server looks for a real file at that path. Configure a rewrite so every non-file path returns `index.html`." },
        { level: "advanced", q: "Downsides of client-side routing?", a: "Bigger initial JS, blank page until JS runs, weaker SEO without SSR, and you must manage focus/scroll and page titles yourself." }
      ],
      compare: { cols: ["", "Full reload (MPA)", "Client routing (SPA)"], rows: [
        ["Server request per page", "Yes, new HTML", "No (data only, if any)"],
        ["App state kept", "No", "Yes"],
        ["Works without JS", "Yes", "No"],
        ["Needs server fallback", "No", "Yes, to index.html"]
      ]},
      cheat: [
        "`history.pushState` = change URL, no request",
        "`popstate` = Back/Forward happened",
        "Links must `preventDefault()` the full reload",
        "Host must rewrite unknown paths to `index.html`",
        "Vite dev server already has SPA fallback",
        "Trade-offs: bigger first load, SEO needs SSR/prerender"
      ]
    },
    related: ["ROUTE-001", "ROUTE-007", "INTRO-009", "INTRO-010"]
  },

  "ROUTE-003": {
    tldr: "React Router v7 is the standard router for React. It comes in three modes that build on each other: **declarative** (just routes), **data** (routes that also load and save data) and **framework** (a full Vite-based framework).",
    analogy: { icon: "☕", text: "A coffee order: plain coffee (declarative), coffee with milk and sugar (data mode adds loaders/actions), or the full café meal deal (framework mode adds SSR, file routes and bundling)." },
    visual: { type: "layers", title: "Three modes, each adds more", items: [
      { label: "Framework mode", detail: "Vite plugin, `routes.ts`, SSR/prerender, type-safe route modules, code splitting." },
      { label: "Data mode", detail: "`createBrowserRouter` + `RouterProvider`: loaders, actions, pending UI, errorElement." },
      { label: "Declarative mode", detail: "`<BrowserRouter>` + `<Routes>`/`<Route>`: matching, links, params, navigation." },
      { label: "Your React app", detail: "Components, hooks, state. The router sits on top and picks which ones to render." }
    ]},
    points: [
      "Everything is imported from **`react-router`** in v7. The old v6 `-dom` package is now just a re-export kept for upgrades.",
      "**Declarative**: simplest. Good for adding routing to an existing app or a small SPA.",
      "**Data**: routes define `loader`/`action`, so data loads before the screen renders. Good for data-heavy SPAs.",
      "**Framework** (framework-only features): SSR, file-based route config, automatic code splitting. Think Next.js-style.",
      "Pick one mode per app. You can start declarative and move up later; the components and hooks are shared."
    ],
    code: { file: "modes.jsx", lang: "jsx", src: `// 1. Declarative mode
import { BrowserRouter, Routes, Route } from 'react-router';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>;

// 2. Data mode
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

const router = createBrowserRouter([
  { path: '/', element: <Home />, loader: loadProducts },
]);
<RouterProvider router={router} />;

// 3. Framework mode (framework-only): app/routes.ts
import { index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('cart', 'routes/cart.tsx'),
];`, walk: [
      { lines: [2, 4, 5, 6, 7, 8], note: "Declarative: routes are JSX inside a `<BrowserRouter>`." },
      { lines: [11, 12, 14, 15, 16], note: "Data: routes are objects, so they can carry a `loader` that fetches before rendering." },
      { lines: [17], note: "`RouterProvider` for the DOM comes from `react-router/dom`." },
      { lines: [20, 22, 23, 24, 25], note: "Framework: a route config file points at route modules; the Vite plugin does the rest." }
    ]},
    mistakes: [
      { bad: `// Mixing modes in one app
<BrowserRouter>
  <RouterProvider router={router} />
</BrowserRouter>`, good: `// Pick one
<RouterProvider router={router} />`, why: "Each mode brings its own router. Nesting routers throws; choose declarative OR data mode for the app." },
      { bad: `// Using a loader inside <BrowserRouter>\n<Route path="/" loader={load} element={<Home />} />`, good: `createBrowserRouter([{ path: '/', loader: load, element: <Home /> }])`, why: "Loaders and actions only run in data or framework mode. `<BrowserRouter>` ignores them." }
    ],
    practice: [
      { level: "B", q: "Which mode for a small notes app with 4 screens and no SSR?", a: "Declarative mode: `<BrowserRouter>` + `<Routes>`. Simple and enough." },
      { level: "I", q: "A shop SPA wants product data loaded before each page shows, with no SSR. Which mode?", a: "Data mode: `createBrowserRouter` with `loader` per route." },
      { level: "I", q: "Which mode gives server rendering and file-based route modules?", a: "Framework mode (the successor to Remix), via `npx create-react-router@latest`." },
      { level: "C", q: "List two things that change from v6 to v7 for a declarative app.", a: "Import from `react-router` instead of the old `-dom` package; the v6 `future` flags (e.g. `startTransition` wrapping, relative splat paths) become default behaviour." }
    ],
    quiz: [
      { q: "Which package do you import from in React Router v7?", options: ["`react-dom/router`", "`react-router`", "`@remix-run/router`", "`react/router`"], answer: 1, why: "v7 merged everything into `react-router`." },
      { q: "Which mode supports `loader` and `action` without a framework?", options: ["Declarative", "Data", "None"], answer: 1, why: "`createBrowserRouter` (data mode) adds loaders/actions to a plain SPA." },
      { q: "SSR and file-based route modules come from…", options: ["Declarative mode", "Data mode", "Framework mode", "Any mode"], answer: 2, why: "They need the Vite plugin and a server: framework mode." }
    ],
    rev: {
      sec30: "React Router v7 has three modes. Declarative: `<BrowserRouter>` + `<Routes>`, just matching and navigation. Data: `createBrowserRouter` + `RouterProvider`, adds loaders, actions, pending and error UI. Framework: a Vite plugin with route modules, SSR and code splitting (the old Remix). Everything is imported from `react-router`.",
      interview: [
        { level: "basic", q: "What are the three React Router v7 modes?", a: "Declarative (`BrowserRouter`), data (`createBrowserRouter` with loaders/actions) and framework (Vite plugin, SSR, route modules)." },
        { level: "intermediate", q: "When would you choose data mode over declarative?", a: "When screens need data loaded before render, form mutations with revalidation, or route-level error handling, without needing SSR." },
        { level: "intermediate", q: "What changed from v6 to v7?", a: "Packages merged into `react-router`, v6 future flags became defaults, and Remix's framework features became framework mode. Upgrading from v6 with flags on is mostly non-breaking." },
        { level: "advanced", q: "How does framework mode relate to Remix?", a: "Remix v2 was merged into React Router v7 framework mode: route modules with `loader`/`action`/`default` exports, SSR and Vite integration." }
      ],
      compare: { cols: ["", "Declarative", "Data", "Framework"], rows: [
        ["Setup", "`<BrowserRouter>`", "`createBrowserRouter`", "Vite plugin + routes.ts"],
        ["Loaders/actions", "No", "Yes", "Yes"],
        ["SSR", "No", "No (SPA)", "Yes"],
        ["Best for", "Small/existing apps", "Data-heavy SPAs", "Full apps"]
      ]},
      cheat: [
        "Import from `react-router` (v7)",
        "Declarative = `BrowserRouter` + `Routes` + `Route`",
        "Data = `createBrowserRouter` + `RouterProvider` (from `react-router/dom`)",
        "Framework = `@react-router/dev` Vite plugin, SSR, route modules",
        "Loaders/actions need data or framework mode",
        "Same hooks (`useParams`, `useNavigate`…) across modes"
      ]
    },
    related: ["ROUTE-004", "ROUTE-005", "ROUTE-018"]
  },

  "ROUTE-004": {
    tldr: "Install one package, `react-router`, then wrap your app in a router at the entry point (`main.jsx`). After that, any component can use routes, links and router hooks.",
    analogy: { icon: "📦", text: "Setting up a new phone's maps app: install it once, give it location access at the top level, and every screen can now ask \"where am I?\" and \"take me there\"." },
    visual: { type: "flow", title: "Install and wire up", steps: [
      { label: "Create a Vite app", detail: "`npm create vite@latest shop -- --template react`" },
      { label: "Install the router", detail: "`npm i react-router` (one package in v7)." },
      { label: "Wrap the app", detail: "In `main.jsx`, put `<BrowserRouter>` around `<App />`." },
      { label: "Add routes", detail: "In `App.jsx`, declare `<Routes>` and `<Route>`s." },
      { label: "Run it", detail: "`npm run dev` and visit `/` and `/cart`." }
    ]},
    points: [
      "Only **one** package in v7: `react-router`. No separate `-dom` package needed.",
      "Needs React 18 or newer (React 19.2 is fine) and Node 20+.",
      "Put the router **once**, at the top. Router hooks throw outside it.",
      "For a framework-mode project, start with `npx create-react-router@latest` instead (framework-only).",
      "Vite's dev server already serves `index.html` for every path, so deep links work locally."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function Home() {
  return <h1>🛍️ Shop home</h1>;
}

function Cart() {
  return <h1>🛒 Your cart</h1>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);`, walk: [
      { lines: [3], note: "Everything comes from `react-router` after `npm i react-router`." },
      { lines: [15], note: "Wrap the whole tree once so every component can use the router." },
      { lines: [16, 17, 18, 19], note: "Declare which element shows for each path." }
    ]},
    output: "http://localhost:5173/ shows “🛍️ Shop home”; /cart shows “🛒 Your cart”.",
    mistakes: [
      { bad: `npm i react-router@6`, good: `npm i react-router`, why: "Pinning v6 gives you the old API and the separate DOM package. Install the current v7." },
      { bad: `function App() {\n  const nav = useNavigate(); // App is outside <BrowserRouter>\n}`, good: `<BrowserRouter><App /></BrowserRouter>\n// now App can call useNavigate()`, why: "Router hooks need a router above them in the tree, otherwise they throw." }
    ],
    practice: [
      { level: "B", q: "Write the install command.", a: "`npm i react-router`" },
      { level: "B", q: "Add an `/orders` route showing “Past orders”.", a: "Add `<Route path=\"/orders\" element={<h1>Past orders</h1>} />` inside `<Routes>`." },
      { level: "I", q: "You see “useNavigate() may be used only in the context of a <Router> component”. Fix?", a: "Move the router higher so the component using the hook is rendered inside it (usually in `main.jsx`)." },
      { level: "C", q: "Rewrite the setup in data mode.", a: "Build `createBrowserRouter([{ path: '/', element: <Home /> }, { path: '/cart', element: <Cart /> }])` and render `<RouterProvider router={router} />` from `react-router/dom`." }
    ],
    quiz: [
      { q: "Which command installs React Router v7?", options: ["`npm i react-router`", "`npm i react-router-v7`", "`npm i @react/router`", "`npm i router`"], answer: 0, why: "One package: `react-router`." },
      { q: "Where should `<BrowserRouter>` usually go?", options: ["Inside each page", "Around the whole app, once", "Inside `<Routes>`"], answer: 1, why: "One router at the top serves the whole tree." },
      { q: "Calling `useNavigate()` in a component outside the router…", options: ["Works fine", "Throws an error", "Reloads the page"], answer: 1, why: "Router hooks read router context; without it they throw." }
    ],
    rev: {
      sec30: "`npm i react-router`, then wrap the app once in `<BrowserRouter>` (declarative) or render `<RouterProvider router={createBrowserRouter(...)} />` (data mode). Router hooks and `<Link>` only work inside the router. For framework mode, scaffold with `npx create-react-router@latest`.",
      interview: [
        { level: "basic", q: "How do you add React Router to a Vite app?", a: "`npm i react-router`, then wrap `<App />` in `<BrowserRouter>` in `main.jsx` and declare `<Routes>`." },
        { level: "intermediate", q: "Do you still need the separate v6 DOM package in v7?", a: "No. It's kept as a re-export so v6 code keeps working, but new code imports from `react-router`." },
        { level: "intermediate", q: "Why do router hooks throw outside the router?", a: "They read router context provided by `<BrowserRouter>`/`<RouterProvider>`. No provider, no location to read." },
        { level: "tricky", q: "Deep links work in dev but 404 after deploy. Why?", a: "Vite dev serves `index.html` for any path; your static host doesn't until you add a rewrite rule." }
      ],
      cheat: [
        "`npm i react-router`",
        "Wrap once: `<BrowserRouter><App /></BrowserRouter>`",
        "Data mode: `<RouterProvider router={router} />`",
        "Hooks/`<Link>` must be inside the router",
        "Framework mode: `npx create-react-router@latest`",
        "Never Create React App; use Vite"
      ]
    },
    related: ["ROUTE-003", "ROUTE-005", "ENV-003"]
  },

  "ROUTE-005": {
    tldr: "`<BrowserRouter>` keeps the UI in sync with the real browser URL. Use it for **declarative** mode. Use `createBrowserRouter` + `<RouterProvider>` instead when you want **data** mode (loaders, actions, errorElement).",
    analogy: { icon: "📻", text: "`<BrowserRouter>` is a radio that just plays what's on the station (URL). `createBrowserRouter` is a smart speaker: it also fetches the playlist before the song starts." },
    visual: { type: "compare", title: "Two ways to create a browser router",
      left: { label: "<BrowserRouter> (declarative)", tone: "neutral", points: [
        "A component: wrap `<App />` with it",
        "Routes declared as JSX with `<Routes>`",
        "Fetch data yourself (effects, TanStack Query)",
        "Easiest to add to an existing app"
      ]},
      right: { label: "createBrowserRouter (data)", tone: "good", points: [
        "A function: build the route list once, outside components",
        "Render with `<RouterProvider router={router} />`",
        "Routes can have `loader`, `action`, `errorElement`",
        "Unlocks `useLoaderData`, `useNavigation`, `<Form>`"
      ]}
    },
    points: [
      "Both use the **History API**: clean URLs like `/cart` (no `#`).",
      "`<BrowserRouter>` = declarative mode. Hooks like `useParams` and `useNavigate` work; data APIs don't.",
      "`createBrowserRouter` = data mode. Call it **once at module level**, not inside a component, or it re-creates on every render.",
      "`createHashRouter` / `<HashRouter>` (`/#/cart`) only for hosts where you can't add an `index.html` fallback.",
      "`<MemoryRouter>` / `createMemoryRouter` keep the URL in memory: handy in tests."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

async function loadWeather() {
  const res = await fetch('/api/weather?city=London');
  return res.json();
}

function Weather() {
  return <h1>Weather page</h1>;
}

// Created ONCE, outside any component
const router = createBrowserRouter([
  { path: '/', element: <h1>Home</h1> },
  {
    path: '/weather',
    element: <Weather />,
    loader: loadWeather,        // runs before <Weather> renders
    errorElement: <p>Could not load weather.</p>,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);`, walk: [
      { lines: [2, 3], note: "`createBrowserRouter` from `react-router`; the DOM `RouterProvider` from `react-router/dom`." },
      { lines: [15], note: "Build the router once at module level. Routes are plain objects." },
      { lines: [20, 21], note: "Data-mode extras: a loader that fetches first and an element shown if it fails." },
      { lines: [26], note: "`RouterProvider` replaces `<BrowserRouter>`; no `<Routes>` needed." }
    ]},
    mistakes: [
      { bad: `function App() {\n  const router = createBrowserRouter(routes);\n  return <RouterProvider router={router} />;\n}`, good: `const router = createBrowserRouter(routes);\nfunction App() {\n  return <RouterProvider router={router} />;\n}`, why: "Creating the router inside a component builds a new one on every render, losing state and re-running loaders." },
      { bad: `<BrowserRouter>\n  <Routes><Route path="/" loader={load} element={<Home />} /></Routes>\n</BrowserRouter>`, good: `createBrowserRouter([{ path: '/', loader: load, element: <Home /> }])`, why: "`<BrowserRouter>` silently ignores `loader`/`action`. They need data mode." }
    ],
    practice: [
      { level: "B", q: "Convert `<Route path=\"/cart\" element={<Cart />} />` to a data-mode route object.", a: "`{ path: '/cart', element: <Cart /> }` inside the `createBrowserRouter([...])` array." },
      { level: "I", q: "When would you pick `<HashRouter>`?", a: "Only when the host can't rewrite unknown paths to `index.html` (e.g. some static file hosts). URLs look like `/#/cart`." },
      { level: "I", q: "Which router would you use in a Vitest test that starts on `/cart`?", a: "`<MemoryRouter initialEntries={['/cart']}>` (or `createMemoryRouter`)." },
      { level: "C", q: "Read the weather data inside `<Weather>`.", a: "`const data = useLoaderData();` (data mode only).", code: `import { useLoaderData } from 'react-router';\nfunction Weather() {\n  const data = useLoaderData();\n  return <h1>{data.temp}°C</h1>;\n}` }
    ],
    quiz: [
      { q: "Which setup supports `loader` functions?", options: ["`<BrowserRouter>`", "`createBrowserRouter` + `<RouterProvider>`", "Both equally"], answer: 1, why: "Loaders are a data-mode feature." },
      { q: "Where should `createBrowserRouter` be called?", options: ["Inside `App` on each render", "Once at module level", "Inside a `useEffect`"], answer: 1, why: "The router is a long-lived object; create it once." },
      { q: "What do `<BrowserRouter>` URLs look like?", options: ["`/#/cart`", "`/cart`", "`?page=cart`"], answer: 1, why: "It uses the History API, giving clean paths. Hash routers add `#`." }
    ],
    rev: {
      sec30: "`<BrowserRouter>` is the declarative-mode router: a component that syncs with the browser URL, with routes as JSX. `createBrowserRouter(routes)` is the data-mode router: created once outside components, rendered via `<RouterProvider>`, and its routes can have loaders, actions and errorElement. Hash and memory variants exist for special hosting and tests.",
      interview: [
        { level: "basic", q: "What does `<BrowserRouter>` do?", a: "It provides routing context and keeps React in sync with the browser URL using the History API." },
        { level: "intermediate", q: "`BrowserRouter` vs `createBrowserRouter`?", a: "Same URL handling, but `createBrowserRouter` is data mode: route objects with loaders, actions and error elements, rendered by `RouterProvider`." },
        { level: "intermediate", q: "Why create the data router outside components?", a: "It holds navigation state and caches loader data. Re-creating it each render resets all of that." },
        { level: "advanced", q: "When use `MemoryRouter`?", a: "Tests, Storybook or embedded widgets where you don't want to touch the real address bar; set `initialEntries` to start on a path." },
        { level: "tricky", q: "Does `useLoaderData` work under `<BrowserRouter>`?", a: "No. There are no loaders in declarative mode, so it throws. Switch to `createBrowserRouter`." }
      ],
      compare: { cols: ["", "BrowserRouter", "createBrowserRouter"], rows: [
        ["Mode", "Declarative", "Data"],
        ["Routes as", "JSX `<Route>`", "Objects (or `createRoutesFromElements`)"],
        ["Loaders/actions", "No", "Yes"],
        ["Render", "Wrap `<App />`", "`<RouterProvider router />`"]
      ]},
      cheat: [
        "`<BrowserRouter>` = declarative mode",
        "`createBrowserRouter([...])` + `<RouterProvider>` = data mode",
        "Create the data router once, at module level",
        "`RouterProvider` for the DOM: `react-router/dom`",
        "Hash router only when you can't add an SPA fallback",
        "`MemoryRouter` for tests"
      ]
    },
    related: ["ROUTE-003", "ROUTE-004", "ROUTE-018"]
  },

  "ROUTE-006": {
    tldr: "`<Routes>` looks at the URL and renders the **one best-matching** `<Route>`. Each `<Route>` pairs a `path` with an `element`. Add `index` for the default child and `path=\"*\"` for “anything else”.",
    analogy: { icon: "🍽️", text: "A restaurant menu (Routes) with dishes (Route). You order by name (URL) and the kitchen serves exactly one matching dish (element)." },
    visual: { type: "tree", title: "A shop's route tree", root: { label: "<Routes>", note: "picks the best match", children: [
      { label: "/  →  <Home />" },
      { label: "/products  →  <Products />" },
      { label: "/products/:id  →  <Product />", note: "dynamic segment" },
      { label: "/cart  →  <Cart />" },
      { label: "/account", children: [
        { label: "index  →  <Profile />", note: "/account itself" },
        { label: "orders  →  <Orders />", note: "/account/orders" }
      ]},
      { label: "*  →  <NotFound />", note: "catch-all" }
    ]}},
    points: [
      "`<Route path=\"/cart\" element={<Cart />} />`: pass the **element** (JSX), not the component name.",
      "`<Routes>` ranks routes by **specificity**, not order: `/products/new` beats `/products/:id` wherever it's written.",
      "Paths match **whole segments**: `/cart` does not match `/carts`. Case-insensitive by default.",
      "`index` route = what shows at the parent's own path (no `path` prop).",
      "`path=\"*\"` catches every unmatched URL: your 404 page."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { Routes, Route } from 'react-router';

const Home = () => <h1>Home</h1>;
const Products = () => <h1>All products</h1>;
const NewProduct = () => <h1>Add a product</h1>;
const Product = () => <h1>One product</h1>;
const Cart = () => <h1>Cart</h1>;
const NotFound = () => <h1>404: nothing here</h1>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/products/new" element={<NewProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}`, walk: [
      { lines: [12], note: "`<Routes>` renders only the single best match for the current URL." },
      { lines: [13, 14], note: "Each `<Route>` = a path + the JSX to show." },
      { lines: [15, 16], note: "`/products/new` wins over `/products/:id` because a static segment is more specific, even though it's listed second." },
      { lines: [18], note: "`*` matches anything not matched above: the 404 screen." }
    ]},
    output: "/products/new → “Add a product”; /products/42 → “One product”; /xyz → “404: nothing here”.",
    mistakes: [
      { bad: `<Route path="/cart" element={Cart} />`, good: `<Route path="/cart" element={<Cart />} />`, why: "`element` takes a React element (JSX). Passing the function itself renders nothing useful." },
      { bad: `<Route path="/" element={<Home />} />\n// outside any <Routes>`, good: `<Routes>\n  <Route path="/" element={<Home />} />\n</Routes>`, why: "A `<Route>` must be a direct child of `<Routes>` (or another `<Route>`); on its own it throws." }
    ],
    practice: [
      { level: "B", q: "Add a `/favourites` route for a recipe app.", a: "`<Route path=\"/favourites\" element={<Favourites />} />`" },
      { level: "B", q: "Add a 404 page.", a: "`<Route path=\"*\" element={<NotFound />} />` as the last route (order doesn't matter, but it reads well)." },
      { level: "I", q: "Make `/account` show `<Profile />` and `/account/orders` show `<Orders />`.", a: "Nest them with an index route.", code: `<Route path="/account">\n  <Route index element={<Profile />} />\n  <Route path="orders" element={<Orders />} />\n</Route>` },
      { level: "C", q: "URL is `/products/new`. Which of `/products/:id` and `/products/new` renders, and why?", a: "`/products/new`. React Router ranks static segments above dynamic ones, regardless of order." }
    ],
    quiz: [
      { q: "How many routes does `<Routes>` render for one URL?", options: ["All that match", "The single best match", "The first one listed"], answer: 1, why: "It ranks matches and renders the best one (plus its parents when nested)." },
      { q: "What does `path=\"*\"` match?", options: ["Only `/`", "Any URL no other route matched", "Nothing; it's invalid"], answer: 1, why: "It's a splat/catch-all, perfect for 404." },
      { q: "Does `/cart` match `/cart/items`?", options: ["Yes, it's a prefix", "No, routes match whole paths unless nested or `/*`"], answer: 1, why: "A leaf route matches the full path. Use nested routes or `/cart/*` for children." }
    ],
    rev: {
      sec30: "`<Routes>` is the switchboard: it ranks every `<Route>` against the URL and renders the best match. Each `<Route>` has a `path` and an `element`. Static segments outrank dynamic `:params`, which outrank `*`. `index` routes render at the parent's path; `*` catches the rest. Order in JSX doesn't decide the winner.",
      interview: [
        { level: "basic", q: "What's the role of `<Routes>` vs `<Route>`?", a: "`<Route>` declares a path-to-element pair; `<Routes>` reads the location and renders the best-matching one." },
        { level: "intermediate", q: "How does React Router pick between overlapping routes?", a: "It scores paths by specificity: static > dynamic `:param` > splat `*`. Declaration order doesn't matter (unlike v5's `<Switch>`)." },
        { level: "intermediate", q: "What is an index route?", a: "A child route without a path that renders at the parent's URL, like a default tab." },
        { level: "tricky", q: "Why is `element={Cart}` wrong?", a: "`element` expects a rendered element (`<Cart />`). Passing the function gives React a function as a child, which it won't render." }
      ],
      predict: [
        { code: `<Routes>\n  <Route path="/notes/:id" element={<p>Note</p>} />\n  <Route path="/notes/today" element={<p>Today</p>} />\n</Routes>\n// URL: /notes/today`, answer: "Shows “Today”", why: "The static `today` segment is more specific than `:id`." }
      ],
      cheat: [
        "`<Route path element={<X />} />` inside `<Routes>`",
        "Best match wins: static > `:param` > `*`",
        "Order in JSX doesn't matter",
        "`index` = default child at parent's path",
        "`path=\"*\"` = catch-all / 404",
        "Matching is case-insensitive by default"
      ]
    },
    related: ["ROUTE-010", "ROUTE-014", "ROUTE-021"]
  },

  "ROUTE-007": {
    tldr: "`<Link to=\"/cart\">` renders a normal `<a href>` but intercepts the click, so the URL changes **without a full page reload**. Use it for every link inside your app.",
    analogy: { icon: "📱", text: "Switching tabs inside a chat app vs closing and reopening the whole app. `<Link>` switches the tab; a plain `<a>` restarts everything." },
    visual: { type: "compare", title: "<a href> vs <Link to>",
      left: { label: "<a href=\"/cart\">", tone: "bad", points: [
        "Browser asks the server for a whole new page",
        "JS reloads, app state is wiped",
        "Screen flashes white",
        "Fine for external sites"
      ]},
      right: { label: "<Link to=\"/cart\">", tone: "good", points: [
        "Renders a real `<a href>` (SEO, Cmd+click, copy link)",
        "Click is intercepted, URL updated via History API",
        "Only the matched route re-renders, state kept",
        "Supports `replace`, `state`, relative paths"
      ]}
    },
    points: [
      "Import from `react-router`: `import { Link } from 'react-router'`.",
      "Still a real anchor: Cmd/Ctrl+click opens a new tab, right-click → copy link works, accessible by default.",
      "`replace` swaps the current history entry instead of adding one (Back skips it).",
      "`state={{ from: 'cart' }}` passes hidden data to the next page (read with `useLocation`).",
      "Paths without a leading `/` are **relative** to the current route: `to=\"reviews\"`, `to=\"..\"` (add `relative=\"path\"` to go up a URL segment).",
      "Use a plain `<a>` (or `reloadDocument`) for external sites and downloads."
    ],
    code: { file: "Nav.jsx", lang: "jsx", src: `import { Link } from 'react-router';

export function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">🛒 Cart</Link>

      {/* Relative: resolved from the route that renders this link */}
      <Link to="reviews">Reviews</Link>

      {/* Replace history entry + pass hidden state */}
      <Link to="/checkout" replace state={{ from: 'nav' }}>
        Checkout
      </Link>

      {/* Leaving the app: plain anchor */}
      <a href="https://help.example.com">Help centre</a>
    </nav>
  );
}`, walk: [
      { lines: [6, 7, 8], note: "Absolute links: `to` starts with `/`. No reload when clicked." },
      { lines: [11], note: "No leading slash = relative to the **route** that renders the link (inside `/products/:id` → `/products/7/reviews`)." },
      { lines: [14], note: "`replace` avoids a new Back entry; `state` travels with the navigation, not in the URL." },
      { lines: [19], note: "External URL: a normal `<a>` is correct here." }
    ]},
    mistakes: [
      { bad: `<a href="/cart">Cart</a>`, good: `<Link to="/cart">Cart</Link>`, why: "An internal plain anchor reloads the whole app and loses in-memory state." },
      { bad: `<button onClick={() => navigate('/cart')}>Cart</button>`, good: `<Link to="/cart">Cart</Link>`, why: "If it just goes somewhere, it's a link. Buttons don't support Cmd+click, middle-click or copy link." },
      { bad: `<Link href="/cart">Cart</Link>`, good: `<Link to="/cart">Cart</Link>`, why: "The prop is `to`, not `href` (that's Next.js `<Link>`)." }
    ],
    practice: [
      { level: "B", q: "Link to the orders page.", a: "`<Link to=\"/orders\">Orders</Link>`" },
      { level: "B", q: "On `/recipes/5`, link to `/recipes` with a relative path.", a: "`<Link to=\"..\" relative=\"path\">All recipes</Link>`. Plain `..` goes up one **route**; if `recipes/:id` isn't nested under `recipes`, that's `/`." },
      { level: "I", q: "After choosing a shipping option, go to `/payment` so Back skips the option page.", a: "`<Link to=\"/payment\" replace>Continue</Link>`" },
      { level: "C", q: "Link to products filtered by colour red and sorted by price.", a: "Put it in the query string.", code: `<Link to="/products?color=red&sort=price">Red, cheapest first</Link>\n// or\n<Link to={{ pathname: '/products', search: '?color=red&sort=price' }}>…</Link>` }
    ],
    quiz: [
      { q: "What does `<Link>` render in the DOM?", options: ["A `<button>`", "An `<a href>`", "A `<div>` with onClick"], answer: 1, why: "A real anchor, so it's accessible and works with browser link features." },
      { q: "What does the `replace` prop do?", options: ["Reloads the page", "Replaces the current history entry", "Replaces the component"], answer: 1, why: "Back won't return to the page you navigated from." },
      { q: "When is a plain `<a href>` correct?", options: ["Never in React", "For external URLs and downloads", "For every link"], answer: 1, why: "Leaving the app needs a real navigation." }
    ],
    rev: {
      sec30: "`<Link to>` renders an `<a href>` but prevents the full reload and navigates with the History API, so app state survives. It supports `replace`, `state` and relative paths. Use it for in-app navigation; use plain `<a>` for external links. Prefer links over buttons + `navigate` when the action is just “go there”.",
      interview: [
        { level: "basic", q: "Why use `<Link>` instead of `<a>`?", a: "`<a>` triggers a full reload and wipes state; `<Link>` changes the URL client-side and only re-renders the matched route." },
        { level: "intermediate", q: "Does `<Link>` hurt accessibility or SEO?", a: "No. It renders a real `<a href>`, so crawlers, screen readers and Cmd+click all work." },
        { level: "intermediate", q: "Link vs `useNavigate`?", a: "Link for user-clicked navigation; `useNavigate` for code-driven navigation after an event like saving a form." },
        { level: "advanced", q: "How do relative links resolve?", a: "Relative to the route hierarchy (the route that rendered the link), not the raw URL. `..` goes up one route level; `relative=\"path\"` switches to URL segments." }
      ],
      cheat: [
        "`<Link to=\"/cart\">` = in-app link, no reload",
        "Renders a real `<a href>`",
        "`replace` = don't add a Back entry",
        "`state={{...}}` = hidden data, read via `useLocation().state`",
        "No leading `/` = relative path",
        "External URL → plain `<a>`"
      ]
    },
    related: ["ROUTE-002", "ROUTE-008", "ROUTE-009"]
  },

  "ROUTE-008": {
    tldr: "`<NavLink>` is a `<Link>` that **knows if it's active**. It adds an `active` class and `aria-current=\"page\"` when its path matches the URL, so you can highlight the current tab.",
    analogy: { icon: "🎧", text: "A music app's bottom bar: the tab you're on (Library) is lit up. NavLink does the lighting for you based on the URL." },
    visual: { type: "timeline", title: "Which link is lit?", frames: [
      { label: "URL /", state: "Home ✅  Products  Cart", note: "`to=\"/\"` with `end` only matches exactly `/`." },
      { label: "URL /products", state: "Home  Products ✅  Cart", note: "Products gets `class=\"active\"` and `aria-current=\"page\"`." },
      { label: "URL /products/7", state: "Home  Products ✅  Cart", note: "Still active: NavLink matches child paths too (unless `end`)." },
      { label: "URL /cart", state: "Home  Products  Cart ✅", note: "Active moves automatically; no state of your own." }
    ]},
    points: [
      "Same props as `<Link>`, plus active awareness.",
      "Default: adds `class=\"active\"` when matched. Style `.active` in CSS and you're done.",
      "`className`, `style` and `children` can be **functions** receiving `{ isActive, isPending }`.",
      "Active for the path **and its children**. Add `end` to match exactly (vital for `to=\"/\"`).",
      "Sets `aria-current=\"page\"` for screen readers automatically."
    ],
    code: { file: "TabBar.jsx", lang: "jsx", src: `import { NavLink } from 'react-router';
import './TabBar.css';

export function TabBar() {
  return (
    <nav className="tabs">
      <NavLink to="/" end>Home</NavLink>

      <NavLink to="/playlists">Playlists</NavLink>

      <NavLink
        to="/liked"
        className={({ isActive }) => (isActive ? 'tab tab-on' : 'tab')}
      >
        {({ isActive }) => (isActive ? '💚 Liked' : '🤍 Liked')}
      </NavLink>
    </nav>
  );
}

/* TabBar.css
.tabs a.active { font-weight: 700; border-bottom: 2px solid; }
*/`, walk: [
      { lines: [7], note: "`end`: Home is only active on exactly `/`, not on every page." },
      { lines: [9], note: "Default behaviour: gets `class=\"active\"` on `/playlists` and `/playlists/12`." },
      { lines: [13], note: "Function `className`: choose your own classes from `isActive`." },
      { lines: [15], note: "Function children: change the label/icon when active." },
      { lines: [22], note: "Style the default `.active` class." }
    ]},
    output: "On /liked the third tab shows “💚 Liked” with class “tab tab-on”; on / only Home is bold.",
    mistakes: [
      { bad: `<NavLink to="/">Home</NavLink>`, good: `<NavLink to="/" end>Home</NavLink>`, why: "Every URL starts with `/`, so without `end` Home stays highlighted on every page." },
      { bad: `const [tab, setTab] = useState('home');\n<Link className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')}>`, good: `<NavLink to="/">Home</NavLink>`, why: "Tracking the active tab in state duplicates the URL and breaks on refresh or Back." }
    ],
    practice: [
      { level: "B", q: "Make the active link red with CSS only.", a: "`nav a.active { color: red; }`" },
      { level: "B", q: "Stop `/` being active everywhere.", a: "Add `end`: `<NavLink to=\"/\" end>`." },
      { level: "I", q: "Use inline style: bold when active.", a: "Pass a function to `style`.", code: `<NavLink to="/notes" style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400 })}>Notes</NavLink>` },
      { level: "C", q: "Show a spinner dot while the link's page is loading (data mode).", a: "Use `isPending` from the render function: `{({ isPending }) => <>Orders {isPending && '⏳'}</>}`." }
    ],
    quiz: [
      { q: "What does NavLink add when matched (by default)?", options: ["`class=\"active\"` and `aria-current=\"page\"`", "`style=\"color:blue\"`", "`disabled`"], answer: 0, why: "Default class plus accessibility attribute." },
      { q: "`<NavLink to=\"/products\">` on URL `/products/9` is…", options: ["Active", "Not active"], answer: 0, why: "NavLink matches descendants unless you add `end`." },
      { q: "What does `className` receive when it's a function?", options: ["The event", "`{ isActive, isPending, isTransitioning }`", "The URL string"], answer: 1, why: "Use these flags to pick classes." }
    ],
    rev: {
      sec30: "`<NavLink>` is `<Link>` plus active state. When its `to` matches the URL (including child paths), it gets `class=\"active\"` and `aria-current=\"page\"`. `className`, `style` and `children` accept functions of `{ isActive, isPending }`. Use `end` to match exactly, especially for `/`.",
      interview: [
        { level: "basic", q: "Link vs NavLink?", a: "NavLink is a Link that knows whether it matches the current URL and exposes that for styling." },
        { level: "intermediate", q: "Why is the Home link always active?", a: "`/` is a prefix of every path. Add `end` so it only matches exactly." },
        { level: "intermediate", q: "How do you use Tailwind classes with NavLink?", a: "Pass a function: `className={({ isActive }) => isActive ? 'font-bold' : 'text-gray-500'}`." },
        { level: "advanced", q: "What is `isPending` for?", a: "In data mode, it's true while navigation to that link's route is loading, so you can show pending UI on the link." }
      ],
      cheat: [
        "`<NavLink>` = `<Link>` + active state",
        "Default `class=\"active\"` + `aria-current=\"page\"`",
        "`end` = exact match (use on `to=\"/\"`)",
        "`className={({ isActive }) => ...}`",
        "Function `style` and `children` work too",
        "`isPending` in data mode while loading"
      ]
    },
    related: ["ROUTE-007", "ROUTE-015", "STYLE-001"]
  },

  "ROUTE-009": {
    tldr: "`useNavigate()` gives you a `navigate` function to change pages **from code**: after saving a note, finishing checkout, or pressing a custom Back button.",
    analogy: { icon: "🚕", text: "A taxi app: when your order is confirmed, the app itself drives you to the \"Order tracking\" screen. You didn't tap a link; the code decided." },
    visual: { type: "flow", title: "Save, then go", steps: [
      { label: "User submits form", detail: "“Save note” clicked; `onSubmit` handler runs." },
      { label: "Do the work", detail: "`await saveNote(note)` returns the new note's id." },
      { label: "navigate(...)", detail: "`navigate('/notes/' + id)` pushes the new URL." },
      { label: "Router re-renders", detail: "The note detail route matches and shows the saved note." }
    ]},
    points: [
      "`const navigate = useNavigate();` at the top of the component, then call `navigate(...)` in handlers or effects.",
      "`navigate('/cart')`: go to a path. `navigate(-1)`: Back. `navigate(1)`: Forward.",
      "Options: `{ replace: true }` (no new history entry), `{ state: {...} }` (hidden data).",
      "**Never call it during render**. To redirect while rendering, return `<Navigate to=\"/login\" />`.",
      "If the user just clicks to go somewhere, use `<Link>` instead; `navigate` is for logic-driven moves."
    ],
    code: { file: "NewNote.jsx", lang: "jsx", src: `import { useState } from 'react';
import { useNavigate } from 'react-router';

async function saveNote(text) {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json(); // { id: 12, text: "..." }
}

export function NewNote() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const note = await saveNote(text);
    navigate(\`/notes/\${note.id}\`, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button>Save</button>
      <button type="button" onClick={() => navigate(-1)}>Cancel</button>
    </form>
  );
}`, walk: [
      { lines: [15], note: "Get the `navigate` function (top level, like every hook)." },
      { lines: [19, 20], note: "Save first, then go to the new note. `replace` means Back won't return to the empty form." },
      { lines: [27], note: "`navigate(-1)` = browser Back. `type=\"button\"` stops it submitting the form." }
    ]},
    output: "After Save, the URL becomes /notes/12 and the note page shows. Cancel returns to the previous page.",
    mistakes: [
      { bad: `function Page({ user }) {\n  const navigate = useNavigate();\n  if (!user) navigate('/login'); // during render\n  return <Dashboard />;\n}`, good: `function Page({ user }) {\n  if (!user) return <Navigate to="/login" replace />;\n  return <Dashboard />;\n}`, why: "Navigating during render is a side effect; React Router warns and it can loop. `<Navigate>` is the render-time redirect." },
      { bad: `<div onClick={() => navigate('/cart')}>Cart</div>`, good: `<Link to="/cart">Cart</Link>`, why: "Plain go-there clicks should be links: keyboard, Cmd+click and copy link all work." }
    ],
    practice: [
      { level: "B", q: "Add a “Back” button.", a: "`<button onClick={() => navigate(-1)}>Back</button>`" },
      { level: "B", q: "After checkout succeeds, go to `/thanks`.", a: "Call `navigate('/thanks')` after the payment request resolves." },
      { level: "I", q: "Pass the order total to `/thanks` without putting it in the URL.", a: "`navigate('/thanks', { state: { total } })`, then read `useLocation().state?.total`." },
      { level: "C", q: "Redirect to `/login` if `token` is missing when the page mounts. Use a hook, not `<Navigate>`.", a: "Call it in an effect.", code: `useEffect(() => {\n  if (!token) navigate('/login', { replace: true });\n}, [token, navigate]);` }
    ],
    quiz: [
      { q: "What does `navigate(-1)` do?", options: ["Goes to `/-1`", "Goes back one history entry", "Reloads the page", "Throws"], answer: 1, why: "Numbers move through history like the Back/Forward buttons." },
      { q: "Where is it safe to call `navigate()`?", options: ["Directly in the component body", "In event handlers and effects", "Inside JSX"], answer: 1, why: "Navigation is a side effect; for render-time redirects use `<Navigate>`." },
      { q: "What does `{ replace: true }` change?", options: ["Replaces the current history entry", "Replaces the page component", "Clears all history"], answer: 0, why: "Back skips the page you came from." }
    ],
    rev: {
      sec30: "`useNavigate()` returns `navigate(to, { replace, state })` for code-driven navigation: after a save, on cancel, after logout. Numbers move through history (`-1` = Back). Call it in handlers or effects, never during render; use `<Navigate>` to redirect while rendering. Prefer `<Link>` for plain clicks.",
      interview: [
        { level: "basic", q: "How do you navigate programmatically?", a: "Call `const navigate = useNavigate()` and then `navigate('/path')` in an event handler or effect." },
        { level: "intermediate", q: "`navigate` vs `<Navigate>`?", a: "`navigate` is imperative, for handlers/effects. `<Navigate>` is a component that redirects as soon as it renders, for render-time decisions." },
        { level: "intermediate", q: "When would you use `replace: true`?", a: "When the current page shouldn't be revisited with Back: after login, after submitting a form, or for redirects." },
        { level: "advanced", q: "In data mode, is `navigate` the best way to redirect after a form submit?", a: "Often not: return `redirect('/notes/12')` from the route `action` so data loading and navigation stay in the router." },
        { level: "tricky", q: "A redirect in `useEffect` fires twice in dev. Why?", a: "Strict Mode runs effects twice in development only. With `replace: true` the second call is harmless; production runs it once." }
      ],
      debug: [
        { code: `<form onSubmit={() => navigate('/done')}>\n  <button>Send</button>\n</form>`, fix: `<form onSubmit={(e) => { e.preventDefault(); navigate('/done'); }}>\n  <button>Send</button>\n</form>`, why: "Without `preventDefault`, the browser does a full form submit and reload." }
      ],
      cheat: [
        "`const navigate = useNavigate()`",
        "`navigate('/path')`, `navigate(-1)` (Back)",
        "`navigate(to, { replace: true, state })`",
        "Call in handlers/effects, never during render",
        "Render-time redirect: `<Navigate to replace />`",
        "Plain click to go somewhere: use `<Link>`"
      ]
    },
    related: ["ROUTE-007", "ROUTE-022", "ROUTE-011", "EVT-005"]
  },

  "ROUTE-010": {
    tldr: "`useParams()` reads the placeholder parts of the URL. For route `/recipes/:id` and URL `/recipes/42`, it returns `{ id: \"42\" }`. Values are always **strings**.",
    analogy: { icon: "🎟️", text: "A cinema ticket: the hall is fixed (`/screen/`), the seat number changes (`:seat`). `useParams` reads the seat number off your ticket." },
    visual: { type: "flow", title: "From URL to params", steps: [
      { label: "Route pattern", detail: "`<Route path=\"/recipes/:id\" element={<Recipe />} />`" },
      { label: "URL visited", detail: "User opens `/recipes/42`." },
      { label: "Router matches", detail: "`:id` lines up with `42` and is captured." },
      { label: "useParams()", detail: "Inside `<Recipe />`: `{ id: \"42\" }` (a string)." },
      { label: "Use it", detail: "`fetch('/api/recipes/' + id)` and render the recipe." }
    ]},
    points: [
      "Declare with a colon in the path: `/users/:userId/notes/:noteId`. Names become object keys.",
      "Values are **strings** (and decoded). Convert when needed: `Number(id)`.",
      "Optional segment: `/:lang?/about` matches `/about` and `/fr/about` (`lang` may be `undefined`).",
      "Splat `/files/*`: the rest of the path is in `params['*']`.",
      "Going from `/recipes/1` to `/recipes/2` **reuses** the same component: depend on `id` in effects."
    ],
    code: { file: "Recipe.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router';

function Recipe() {
  const { id } = useParams();          // "42"
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(\`/api/recipes/\${id}\`)
      .then((r) => r.json())
      .then((data) => { if (!ignore) setRecipe(data); });
    return () => { ignore = true; };
  }, [id]);                             // refetch when id changes

  if (!recipe) return <p>Loading…</p>;
  return (
    <>
      <h1>{recipe.title}</h1>
      <Link to={\`/recipes/\${Number(id) + 1}\`}>Next recipe</Link>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/recipes/:id" element={<Recipe />} />
    </Routes>
  );
}`, walk: [
      { lines: [28], note: "`:id` in the path declares a URL parameter." },
      { lines: [5], note: "Read it: the key matches the name after the colon. It's a string." },
      { lines: [8, 9, 10, 11, 12, 13, 14], note: "`[id]` refetches when only the param changes. `ignore` drops stale replies (and the dev-only Strict Mode double fetch)." },
      { lines: [20], note: "Convert to a number before doing maths, or `\"42\" + 1` becomes `\"421\"`." }
    ]},
    output: "/recipes/42 shows recipe 42's title; “Next recipe” goes to /recipes/43 and the title updates.",
    mistakes: [
      { bad: `const { id } = useParams();\nconst next = id + 1; // "421"`, good: `const { id } = useParams();\nconst next = Number(id) + 1; // 43`, why: "Params are strings. `+` on a string concatenates." },
      { bad: `useEffect(() => {\n  fetch(\`/api/recipes/\${id}\`).then(...);\n}, []);`, good: `useEffect(() => {\n  fetch(\`/api/recipes/\${id}\`).then(...);\n}, [id]);`, why: "The component stays mounted when only the param changes. With `[]` it shows the old recipe." },
      { bad: `<Route path="/recipes/id" element={<Recipe />} />`, good: `<Route path="/recipes/:id" element={<Recipe />} />`, why: "Without the colon, `id` is a literal word, not a parameter." }
    ],
    practice: [
      { level: "B", q: "Write a route for a user profile at `/users/7` and read the id.", a: "`<Route path=\"/users/:userId\" element={<User />} />` and `const { userId } = useParams();`" },
      { level: "B", q: "What is `typeof useParams().id` for `/recipes/42`?", a: "`\"string\"`." },
      { level: "I", q: "Read both ids from `/playlists/3/songs/9`.", a: "Path `/playlists/:playlistId/songs/:songId`; `const { playlistId, songId } = useParams();`" },
      { level: "C", q: "Show “Invalid id” if the param isn't a positive number.", a: "Validate before using it.", code: `const { id } = useParams();\nconst n = Number(id);\nif (!Number.isInteger(n) || n < 1) return <p>Invalid id</p>;` }
    ],
    quiz: [
      { q: "Route `/shop/:category`, URL `/shop/shoes`. `useParams()` returns…", options: ["`{ shoes: 'category' }`", "`{ category: 'shoes' }`", "`'shoes'`", "`['shoes']`"], answer: 1, why: "Key = the name after `:`, value = the URL segment." },
      { q: "Navigating `/recipes/1` → `/recipes/2` does what to `<Recipe>`?", options: ["Unmounts and mounts a new one", "Re-renders the same instance with new params", "Nothing"], answer: 1, why: "Same route, same position: React keeps the instance, so effects need `[id]`." },
      { q: "Type of every param value?", options: ["Number when it looks numeric", "String (or undefined if optional and missing)", "Any JSON type"], answer: 1, why: "URLs are text; convert yourself." }
    ],
    rev: {
      sec30: "`useParams()` returns an object of the dynamic segments from the current route match: `/recipes/:id` + `/recipes/42` → `{ id: \"42\" }`. Values are strings; convert and validate. Changing only the param re-renders the same component, so effects or queries must depend on it. Optional `:x?` and splat `*` params exist too.",
      interview: [
        { level: "basic", q: "How do you read `:id` from the URL?", a: "`const { id } = useParams();` inside a component rendered by that route." },
        { level: "intermediate", q: "Why is my detail page showing stale data after clicking “next”?", a: "The component isn't remounted when only the param changes. Add `id` to the effect deps or the query key." },
        { level: "intermediate", q: "Params vs query string?", a: "Params identify **which** resource (`/recipes/42`); query strings tune **how** you view it (`?sort=rating`). Use `useSearchParams` for the latter." },
        { level: "advanced", q: "How would you force a full remount per id?", a: "Give the element a key: `<Recipe key={id} />` from a small wrapper. All state resets for each id." },
        { level: "tricky", q: "What does `useParams` return in a parent layout of `/recipes/:id`?", a: "The params of the deepest match, so the parent sees `id` too. Params flow to all routes in the matched branch." }
      ],
      predict: [
        { code: `// Route: /cart/:qty   URL: /cart/2\nconst { qty } = useParams();\nconsole.log(qty * 2, qty + 2);`, answer: "Logs `4 \"22\"`", why: "`*` coerces the string to a number; `+` concatenates strings." }
      ],
      cheat: [
        "Declare: `path=\"/recipes/:id\"`",
        "Read: `const { id } = useParams()`",
        "Values are strings: `Number(id)`",
        "Optional: `/:lang?/about`; splat: `params['*']`",
        "Same component reused when only params change",
        "Effects/queries must depend on the param"
      ]
    },
    related: ["ROUTE-006", "ROUTE-012", "ROUTE-013", "HOOKS-005"]
  },

  "ROUTE-011": {
    tldr: "`useLocation()` returns where you are right now: `pathname`, `search`, `hash`, the hidden `state` passed by a link, and a unique `key`. It updates on every navigation.",
    analogy: { icon: "📍", text: "The blue dot in a maps app: it tells you the street (pathname), the details (query string) and a sticky note a friend left you on the way (state)." },
    visual: { type: "timeline", title: "The location object as you browse", frames: [
      { label: "Open /products", state: "pathname: '/products', search: '', state: null", note: "A fresh visit has no state." },
      { label: "Filter red", state: "pathname: '/products', search: '?color=red'", note: "Query string lives in `search`." },
      { label: "Click product 7", state: "pathname: '/products/7', state: { from: 'list' }", note: "`<Link state>` passed hidden data." },
      { label: "Open in new tab", state: "pathname: '/products/7', state: null", note: "State isn't in the URL, so a new tab doesn't get it." }
    ]},
    points: [
      "`const location = useLocation();` returns `{ pathname, search, hash, state, key }`.",
      "**`state`** comes from `<Link state>` or `navigate(to, { state })`. Hidden from the URL, survives refresh in the same tab, lost in a new tab.",
      "Always handle missing state: `location.state?.from ?? '/'`.",
      "`useEffect(..., [location])` runs on **every** navigation: analytics, scroll to top, close menus.",
      "For params use `useParams`; for query values prefer `useSearchParams` (parses `search` for you)."
    ],
    code: { file: "Product.jsx", lang: "jsx", src: `import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';

// In the list: <Link to="/products/7" state={{ from: '/products?color=red' }}>

export function Product() {
  const location = useLocation();
  const backTo = location.state?.from ?? '/products';

  return (
    <>
      <p>You are on {location.pathname}</p>
      <Link to={backTo}>← Back to results</Link>
    </>
  );
}

// Runs on every navigation
export function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    console.log('page view:', location.pathname + location.search);
  }, [location]);
  return null;
}`, walk: [
      { lines: [4], note: "The list page passes where the user came from as hidden `state`." },
      { lines: [7, 8], note: "Read it with optional chaining and a fallback: state is `null` on a direct visit." },
      { lines: [13], note: "Back link returns to the filtered list, even though the product URL has no filter." },
      { lines: [20, 21, 22, 23], note: "`location` is a new object on each navigation, so this effect fires per page view. Dev Strict Mode logs twice on mount." }
    ]},
    output: "Arriving from the red filter: “← Back to results” links to /products?color=red. Pasting the URL directly: it links to /products.",
    mistakes: [
      { bad: `const { from } = useLocation().state;`, good: `const from = useLocation().state?.from ?? '/';`, why: "State is `null` on direct visits, new tabs and shared links. Destructuring `null` crashes." },
      { bad: `const path = window.location.pathname; // in a component`, good: `const { pathname } = useLocation();`, why: "Reading `window.location` doesn't subscribe to changes; the component won't re-render on navigation." },
      { bad: `navigate('/cart', { state: { items } }) // the only copy`, good: `// keep cart in app state/store; pass only small hints`, why: "State disappears for shared links and new tabs. Don't put required data only in location state." }
    ],
    practice: [
      { level: "B", q: "Show the current path in a footer.", a: "`const { pathname } = useLocation();` then `<footer>{pathname}</footer>`." },
      { level: "B", q: "On `/search?q=pizza#top`, what are `search` and `hash`?", a: "`search` = `\"?q=pizza\"`, `hash` = `\"#top\"`." },
      { level: "I", q: "Scroll to the top on every page change.", a: "Effect on `pathname`.", code: `const { pathname } = useLocation();\nuseEffect(() => { window.scrollTo(0, 0); }, [pathname]);` },
      { level: "C", q: "Close a mobile menu whenever the route changes.", a: "Keep `open` state and run `setOpen(false)` in an effect depending on `location.key` (or `pathname`)." }
    ],
    quiz: [
      { q: "Where does `location.state` come from?", options: ["The query string", "`<Link state>` or `navigate(to, { state })`", "localStorage", "The server"], answer: 1, why: "It's attached to the history entry by the navigation." },
      { q: "User pastes a product URL into a new tab. `location.state` is…", options: ["The same as before", "`null`", "The query string"], answer: 1, why: "State lives in that tab's history entry, not in the URL." },
      { q: "Why use `useLocation` over `window.location`?", options: ["It's shorter", "It re-renders your component when the location changes", "It works on the server only"], answer: 1, why: "The hook subscribes to router updates." }
    ],
    rev: {
      sec30: "`useLocation()` returns the current location object: `pathname`, `search`, `hash`, `state` and `key`. It changes on every navigation, so it's the dependency for page-view tracking, scroll reset or closing menus. `state` is invisible data passed by links/navigate; it's absent on direct visits, so always use a fallback.",
      interview: [
        { level: "basic", q: "What does `useLocation` return?", a: "The current location: `pathname`, `search`, `hash`, `state` and a unique `key`." },
        { level: "intermediate", q: "How would you send users back to the page they came from after login?", a: "Pass `state={{ from: location }}` when redirecting to `/login`, then `navigate(state?.from?.pathname ?? '/', { replace: true })` after success." },
        { level: "intermediate", q: "Is `location.state` safe for important data?", a: "No. It's missing on shared links and new tabs. Use it for hints (where you came from), not required data." },
        { level: "advanced", q: "How do you track page views in an SPA?", a: "A component with `useEffect(() => track(location.pathname + location.search), [location])`. Beware Strict Mode double effects in dev." },
        { level: "tricky", q: "Same URL clicked twice: does `location` change?", a: "Yes. `<Link>` replaces the entry (same URL), but the new location gets a new `key`, so effects on `location` re-run; effects on `pathname` don't." }
      ],
      scenario: [
        { q: "A product page should show “← Back to results” with the user's filters. How?", a: "List page links with `state={{ from: pathname + search }}`; product page links to `location.state?.from ?? '/products'`." }
      ],
      cheat: [
        "`useLocation()` → `{ pathname, search, hash, state, key }`",
        "Updates on every navigation; re-renders subscribers",
        "`state` from `<Link state>` / `navigate(to, { state })`",
        "State is null on direct visits/new tabs: use `?.` + fallback",
        "Effect on `[location]` = per-navigation logic",
        "Query values: prefer `useSearchParams`"
      ]
    },
    related: ["ROUTE-009", "ROUTE-012", "ROUTE-017"]
  }
};
