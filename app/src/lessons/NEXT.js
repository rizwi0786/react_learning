// Module NEXT: Next.js and React Ecosystem (Next.js 16 App Router). Everything here is framework-only.
export default {
  "NEXT-001": {
    tldr: "Next.js is a full-stack framework built on React (framework-only). React draws the UI; Next.js adds routing, server rendering, data fetching, caching and API endpoints so you can ship a whole app.",
    analogy: { icon: "🍱", text: "React is a great chef. Next.js is the whole restaurant: menu (routes), kitchen on the server, delivery (rendering) and a till (API endpoints) around that chef." },
    visual: { type: "layers", title: "What Next.js adds on top of React", items: [
      { label: "Deploy & optimise", detail: "Images, fonts, metadata, bundling with Turbopack, one-command builds." },
      { label: "Server features", detail: "Server Components, Server Actions, route handlers (API endpoints), proxy." },
      { label: "Rendering & caching", detail: "Prerender at build, render per request, stream, cache with `'use cache'`." },
      { label: "Routing", detail: "Folders in `app/` become URLs. Layouts, loading and error screens built in." },
      { label: "React", detail: "Components, props, state, hooks. Same React 19.2 you already know." }
    ]},
    points: [
      "**Framework-only**: Next.js decides folder layout, routing and where code runs. React alone decides none of that.",
      "Current major is **Next.js 16** with the **App Router** (`app/` folder). The older `pages/` router still exists for legacy apps.",
      "Components are **Server Components by default**; add `'use client'` only where you need clicks, state or browser APIs.",
      "Start with `npx create-next-app@latest` (needs **Node.js 20.9+**). Turbopack is the default bundler for `dev` and `build`.",
      "Like ASP.NET Core MVC for React: routing, server code and views live in one project."
    ],
    code: { file: "Terminal", lang: "bash", src: `# Create a new Next.js 16 app (TypeScript, App Router, Tailwind by default)
npx create-next-app@latest recipe-box
cd recipe-box

# Start the dev server (Turbopack) on http://localhost:3000
npm run dev

# What you get:
# app/
#   layout.tsx   -> shared shell (<html>, <body>)
#   page.tsx     -> the "/" route
# public/        -> static files (images, icons)
# next.config.ts -> framework settings

# Production build + server
npm run build
npm run start`, walk: [
      { lines: [2], note: "The official starter. Answer the prompts or accept the recommended defaults." },
      { lines: [6], note: "`next dev` runs with Turbopack and hot reload. No extra flag needed in v16." },
      { lines: [9, 10, 11], note: "Every app has a **root layout** and pages. A file named `page` makes a route public." },
      { lines: [16, 17], note: "`next build` prerenders what it can; `next start` serves the app on a Node.js server." }
    ]},
    output: "Visiting http://localhost:3000 shows the starter home page rendered from `app/page.tsx`.",
    mistakes: [
      { bad: `npx create-react-app my-app   # then add a router, SSR, an API...`, good: `npx create-next-app@latest my-app`, why: "Create React App is deprecated (Feb 2025). For a full-stack React app, start from a framework like Next.js; for a pure SPA, use Vite." },
      { bad: `// "Next.js is a different UI library from React"`, good: `// Next.js uses React for the UI and adds\n// routing, rendering and server features`, why: "You still write React components and hooks. Next.js is the framework around them, not a replacement." }
    ],
    practice: [
      { level: "B", q: "Create a Next.js app and change the home page heading to “My Recipes”.", a: "Run `npx create-next-app@latest`, open `app/page.tsx`, edit the JSX and save. The browser hot-reloads." },
      { level: "B", q: "Name three things Next.js gives you that plain React does not.", a: "File-based routing, server rendering/prerendering, and server code such as Server Actions or route handlers (API endpoints)." },
      { level: "I", q: "Which Node.js version does Next.js 16 need and which bundler does it use by default?", a: "Node.js 20.9 or newer. Turbopack is the default for both `next dev` and `next build`." },
      { level: "C", q: "Explain to a .NET colleague where your API code would live in a Next.js app.", a: "In the same project: Server Actions for form mutations and `app/api/.../route.ts` route handlers for HTTP endpoints, similar to controllers next to Razor views." }
    ],
    quiz: [
      { q: "What is Next.js?", options: ["A replacement for React", "A full-stack framework built on React", "A state management library", "A CSS framework"], answer: 1, why: "Next.js uses React for UI and adds routing, rendering, data and server features." },
      { q: "In the App Router, components are ___ by default.", options: ["Client Components", "Server Components", "Class components"], answer: 1, why: "You opt into the browser with `'use client'`." },
      { q: "Which command starts a new Next.js app?", options: ["npx create-react-app", "npm create vite@latest", "npx create-next-app@latest"], answer: 2, why: "`create-next-app` scaffolds the App Router project. Vite is for client-only React apps." }
    ],
    rev: {
      sec30: "Next.js is a React framework (framework-only features). It adds file-based routing in `app/`, Server Components by default, prerendering, request-time rendering, streaming, caching, Server Actions and route handlers. v16 uses Turbopack by default and needs Node 20.9+. You still write normal React components.",
      interview: [
        { level: "basic", q: "What is Next.js in one sentence?", a: "A full-stack React framework that adds routing, server rendering, data fetching, caching and backend endpoints on top of React." },
        { level: "basic", q: "What is the App Router?", a: "The `app/` directory routing system where folders define URLs and special files (`page`, `layout`, `loading`, `error`) define the UI for each segment. It's built on Server Components." },
        { level: "intermediate", q: "Why would a team pick Next.js over a plain Vite SPA?", a: "When they need SEO, fast first paint, server-side data access or backend endpoints in the same codebase. Next.js gives those without wiring up a separate server." },
        { level: "advanced", q: "What changed in Next.js 16 that you'd mention in an interview?", a: "Turbopack is default, `middleware` is renamed `proxy`, request APIs like `params` and `cookies()` are async only, and Cache Components (`'use cache'`) give explicit caching." },
        { level: "tricky", q: "Is a Server Component a Next.js feature?", a: "It's a React feature, but you need a framework like Next.js to run it. In a plain Vite app you don't get Server Components." }
      ],
      cheat: [
        "Next.js = React + routing + rendering + server features (framework-only)",
        "Current major: v16, App Router (`app/`)",
        "Default: Server Components; opt in with `'use client'`",
        "`npx create-next-app@latest`, Node 20.9+",
        "Turbopack is default for `next dev` and `next build`",
        "`next build` then `next start` for production"
      ]
    },
    related: ["NEXT-002", "INTRO-006", "INTRO-014", "ADV-015"]
  },

  "NEXT-002": {
    tldr: "React is a **library**: it only draws UI and you pick everything else. Next.js is a **framework** (framework-only): it decides routing, rendering, data loading and where code runs, then calls your components.",
    analogy: { icon: "🧺", text: "React is buying ingredients and cooking any way you like. Next.js is a meal kit: recipe card, portions and steps decided for you, you still do the cooking." },
    visual: { type: "compare", title: "Who is responsible for what?",
      left: { label: "React + Vite (library)", tone: "neutral", points: [
        "You pick a router (React Router 7)",
        "Data: `useEffect` or TanStack Query in the browser",
        "Renders in the browser (CSR) by default",
        "Backend is a separate project (e.g. ASP.NET Core)",
        "Deploy static files anywhere"
      ]},
      right: { label: "Next.js (framework)", tone: "good", points: [
        "Routing from folders in `app/`",
        "Data: `await` in Server Components",
        "Prerender, request-time render and streaming built in",
        "Server Actions + route handlers in the same app",
        "Needs a Node server (or a static export with limits)"
      ]}
    },
    points: [
      "**You call a library; a framework calls you.** In Next.js you write `page.jsx` and the framework decides when to run it.",
      "React alone: maximum freedom, more decisions, simpler hosting (just static files).",
      "Next.js: conventions and server features, but more concepts (server vs client, caching) and a server to run.",
      "Both use the same React: components, props, state, hooks, JSX.",
      "Server Components, Server Actions and streaming SSR need a framework; plain Vite React doesn't provide them."
    ],
    code: { file: "app/products/[id]/page.jsx", lang: "jsx", src: `// Next.js (framework-only): routing + data + server rendering in one file
import Link from 'next/link';

async function getProduct(id) {
  const res = await fetch(\`https://dummyjson.com/products/\${id}\`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export default async function ProductPage({ params }) {
  const { id } = await params;          // URL /products/3 -> id = "3"
  const product = await getProduct(id); // runs on the server

  return (
    <main>
      <Link href="/products">← All products</Link>
      <h1>{product.title}</h1>
      <p>\${product.price}</p>
    </main>
  );
}

// React + Vite would need: React Router <Route path="/products/:id">,
// useParams(), useEffect + useState (or TanStack Query) for the fetch,
// a loading state, and the HTML would be empty until JS runs.`, walk: [
      { lines: [1], note: "The file path itself is the route: `/products/:id`. No router config." },
      { lines: [10, 11], note: "The page is an `async` Server Component. `params` is a Promise in Next.js 16, so `await` it." },
      { lines: [12], note: "Fetch directly with `await`. No `useEffect`, no loading flag; the HTML arrives filled in." },
      { lines: [16], note: "`Link` from `next/link` does client-side navigation, like React Router's `Link`." },
      { lines: [23, 24, 25], note: "The same page in plain React needs a router, a client fetch hook and a loading state." }
    ]},
    output: "Visiting /products/3 returns HTML that already contains the product title and price.",
    mistakes: [
      { bad: `// page.jsx in Next.js\nexport default function Page() {\n  const [p, setP] = useState(null);\n  useEffect(() => { fetch(url).then(r => r.json()).then(setP); }, []);\n}`, good: `export default async function Page() {\n  const p = await fetch(url).then(r => r.json());\n  return <h1>{p.title}</h1>;\n}`, why: "Copying SPA habits into Next.js throws away the server: the page ships empty and needs `'use client'`. Fetch in a Server Component instead." }
    ],
    practice: [
      { level: "B", q: "List two responsibilities Next.js takes over from you compared with React alone.", a: "Routing (folders become URLs) and rendering strategy (prerender, request-time render, streaming)." },
      { level: "I", q: "A product page must show prices to Google on first load. Which fits better and why?", a: "Next.js: the server sends HTML with the price already in it. A CSR React app sends an empty shell first." },
      { level: "I", q: "Rewrite a `useEffect` fetch into a Next.js Server Component.", a: "Make the component `async`, `await fetch(...)`, and render the data directly. Remove state and effect.", code: `export default async function Weather() {\n  const w = await fetch('https://api.example.com/weather').then(r => r.json());\n  return <p>{w.temp}°C</p>;\n}` },
      { level: "C", q: "Name one cost of choosing Next.js.", a: "More concepts (server/client boundary, caching rules) and you need a server runtime or a platform for full features." }
    ],
    quiz: [
      { q: "Which is a framework responsibility in Next.js that React itself does not handle?", options: ["Rendering JSX", "Managing component state", "Mapping folders to URLs", "Running hooks"], answer: 2, why: "File-based routing is a Next.js convention. JSX, state and hooks are core React." },
      { q: "“A library is called by you; a framework calls your code.” In Next.js this means...", options: ["You call `render(page)` yourself", "Next.js runs your `page.jsx` when a route is requested", "You must write a router"], answer: 1, why: "You export a page; Next.js decides when and where to render it." },
      { q: "Can a plain Vite React app use Server Components out of the box?", options: ["Yes", "No, you need a framework that supports them"], answer: 1, why: "Server Components need a server bundler and runtime, which frameworks like Next.js provide." }
    ],
    rev: {
      sec30: "React is a UI library: components, state, hooks. You choose router, data fetching and hosting. Next.js is a framework built on React: file-based routing, Server Components by default, prerendering, streaming, caching, Server Actions and route handlers. Trade-off: more conventions and a server to run, in exchange for SEO, fast first paint and full-stack in one repo.",
      interview: [
        { level: "basic", q: "Is React a library or a framework?", a: "A library. It handles rendering UI; routing, data fetching and build setup are your choice." },
        { level: "intermediate", q: "What's the main practical difference between React+Vite and Next.js?", a: "Vite React renders in the browser and needs a separate backend. Next.js renders on the server, routes from folders and can hold backend code in the same app." },
        { level: "intermediate", q: "Do you still use hooks in Next.js?", a: "Yes, in Client Components (`'use client'`). Server Components can't use state or effect hooks." },
        { level: "advanced", q: "When does Next.js make an app harder?", a: "When it's a pure logged-in dashboard with no SEO needs: you take on server/client boundaries and caching rules for little gain. A Vite SPA is simpler there." },
        { level: "tricky", q: "Is Next.js required for SSR with React?", a: "No. React has server rendering APIs and other frameworks (React Router framework mode) do SSR too. Next.js just packages it well." }
      ],
      compare: { cols: ["", "React + Vite", "Next.js"], rows: [
        ["Type", "Library + build tool", "Full-stack framework"],
        ["Routing", "React Router 7", "Folders in `app/`"],
        ["Default render", "Browser (CSR)", "Server (prerender / request)"],
        ["Backend", "Separate project", "Server Actions, route handlers"],
        ["Hosting", "Any static host", "Node server, Docker or platform"]
      ]},
      cheat: [
        "Library: you call it. Framework: it calls you",
        "React = UI only; Next.js = UI + routing + rendering + server",
        "Same components and hooks in both",
        "Server Components need a framework",
        "Vite SPA = simplest hosting (static files)",
        "Next.js = SEO + fast first paint + full-stack repo"
      ]
    },
    related: ["NEXT-001", "NEXT-018", "INTRO-006", "INTRO-011"]
  },

  "NEXT-003": {
    tldr: "In Next.js (framework-only) a folder inside `app/` is a URL segment, and a `page.jsx` inside it makes that URL visible. `[id]` folders are dynamic and `(group)` folders organise without changing the URL.",
    analogy: { icon: "🗂️", text: "A recipe binder: each tab is a folder (Desserts › Cakes). A tab only shows a recipe when there's an actual page in it." },
    visual: { type: "tree", title: "Folders become URLs", root: { label: "app/", children: [
      { label: "page.jsx", note: "/" },
      { label: "about/page.jsx", note: "/about" },
      { label: "products/", children: [
        { label: "page.jsx", note: "/products" },
        { label: "[id]/page.jsx", note: "/products/42 (dynamic)" }
      ]},
      { label: "(shop)/cart/page.jsx", note: "/cart (group not in URL)" },
      { label: "docs/[...slug]/page.jsx", note: "/docs/a/b (catch-all)" },
      { label: "_components/", note: "private: never a route" }
    ]}},
    points: [
      "A route is public only when the folder has a **`page.jsx`** (or `route.js` for an API endpoint).",
      "**`[id]`** = dynamic segment; read it from `params` (a Promise in v16: `await params`). With Cache Components, add `generateStaticParams` or a `loading.jsx`.",
      "**`[...slug]`** catches many segments (`slug` is an array). **`[[...slug]]`** also matches the empty path.",
      "**`(group)`** folders group routes or share a layout without adding to the URL. **`_folder`** is private.",
      "Navigate with `<Link href=\"/cart\">` from `next/link`; read the URL in Client Components with `usePathname()` from `next/navigation`."
    ],
    code: { file: "app/recipes/[slug]/page.jsx", lang: "jsx", src: `import Link from 'next/link';
import { notFound } from 'next/navigation';

const recipes = {
  pancakes: { name: 'Fluffy Pancakes', minutes: 20 },
  'tomato-soup': { name: 'Tomato Soup', minutes: 35 },
};

// URL: /recipes/pancakes -> params resolves to { slug: 'pancakes' }
export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = recipes[slug];

  if (!recipe) notFound(); // shows the nearest not-found.jsx

  return (
    <article>
      <h1>{recipe.name}</h1>
      <p>Ready in {recipe.minutes} minutes</p>
      <Link href="/recipes/tomato-soup">Try the soup next</Link>
    </article>
  );
}`, walk: [
      { lines: [9], note: "The `[slug]` folder name becomes the key in `params`." },
      { lines: [10, 11], note: "In Next.js 16 `params` is a Promise. Make the page `async` and `await` it." },
      { lines: [14], note: "Unknown slug? `notFound()` renders the nearest `not-found.jsx` with a 404 status." },
      { lines: [20], note: "`Link` navigates on the client and prefetches the target route." }
    ]},
    output: "/recipes/pancakes shows “Fluffy Pancakes, Ready in 20 minutes”. /recipes/cake shows the 404 page.",
    mistakes: [
      { bad: `export default function Page({ params }) {\n  return <h1>{params.slug}</h1>;\n}`, good: `export default async function Page({ params }) {\n  const { slug } = await params;\n  return <h1>{slug}</h1>;\n}`, why: "Next.js 16 removed synchronous access. `params` and `searchParams` are Promises; reading `params.slug` directly is undefined." },
      { bad: `app/products/ProductCard.jsx  // expecting it to be private\napp/products/list.jsx         // expecting /products/list`, good: `app/products/_components/ProductCard.jsx\napp/products/list/page.jsx`, why: "Only `page` files create routes. Put helpers in a `_private` folder so intent is clear; a route needs its own folder + `page.jsx`." }
    ],
    practice: [
      { level: "B", q: "Create the route `/playlists`.", a: "Add `app/playlists/page.jsx` exporting a default component." },
      { level: "B", q: "Create `/playlists/:id` and show the id.", a: "Add `app/playlists/[id]/page.jsx`, make it async and `await params`.", code: `export default async function Page({ params }) {\n  const { id } = await params;\n  return <h1>Playlist {id}</h1>;\n}` },
      { level: "I", q: "Put `/login` and `/register` under one auth layout without `/auth` in the URL.", a: "Use a route group: `app/(auth)/layout.jsx`, `app/(auth)/login/page.jsx`, `app/(auth)/register/page.jsx`." },
      { level: "C", q: "Build `/docs/getting-started/install` with one page file. What is `slug`?", a: "`app/docs/[...slug]/page.jsx`; `slug` is `['getting-started', 'install']`." }
    ],
    quiz: [
      { q: "Which file makes `app/about/` a visible route?", options: ["about/index.jsx", "about/page.jsx", "about/route.jsx", "about/layout.jsx"], answer: 1, why: "`page` makes the segment public. `layout` alone doesn't create a route." },
      { q: "What URL does `app/(shop)/cart/page.jsx` serve?", options: ["/shop/cart", "/(shop)/cart", "/cart"], answer: 2, why: "Parentheses mark a route group, which is left out of the URL." },
      { q: "In Next.js 16, how do you read `[id]`?", options: ["`params.id`", "`const { id } = await params`", "`useParams()` in a Server Component"], answer: 1, why: "`params` is a Promise; await it. `useParams` is a client hook." }
    ],
    rev: {
      sec30: "Folders in `app/` are URL segments; `page.jsx` makes one public. `[id]` is dynamic, `[...slug]` catch-all, `[[...slug]]` optional catch-all. `(group)` folders don't appear in the URL; `_private` folders are never routes. In Next.js 16 `params` and `searchParams` are Promises you `await`.",
      interview: [
        { level: "basic", q: "How do you create a route in the App Router?", a: "Make a folder in `app/` and add a `page.jsx` that default-exports a component." },
        { level: "intermediate", q: "What are route groups for?", a: "Organising routes or sharing a layout without changing the URL, e.g. `(marketing)` and `(shop)` with different layouts." },
        { level: "intermediate", q: "Difference between `[...slug]` and `[[...slug]]`?", a: "Both catch many segments; the double-bracket version also matches the parent path with no segments." },
        { level: "advanced", q: "Why are `params` async in Next.js 16?", a: "So the framework can prerender the parts of a page that don't depend on the URL and only wait for params where they're read." },
        { level: "tricky", q: "Can `page.jsx` and `route.js` live in the same folder?", a: "No. A segment is either a UI page or an API endpoint; both would claim the same URL and Next.js errors." }
      ],
      predict: [
        { code: `// app/(shop)/products/[id]/page.jsx\n// Which URL renders it for product 7?`, answer: "/products/7", why: "The `(shop)` group is removed from the URL; `[id]` matches `7`." }
      ],
      cheat: [
        "Folder = URL segment, `page.jsx` = visible route",
        "`[id]` dynamic, `[...slug]` catch-all, `[[...slug]]` optional",
        "`(group)` not in URL, `_folder` private",
        "`const { id } = await params` (Next.js 16)",
        "`notFound()` from `next/navigation` -> 404",
        "`<Link>` from `next/link` for navigation"
      ]
    },
    related: ["NEXT-004", "ROUTE-013", "ROUTE-006", "ROUTE-021"]
  },

  "NEXT-004": {
    tldr: "Each route folder can hold special files (framework-only): `layout` (shared frame that stays), `page` (the screen), `loading` (shown while waiting) and `error` (shown if it breaks). Next.js nests them for you.",
    analogy: { icon: "🍕", text: "A pizza box: the box (layout) stays the same, the pizza (page) changes, a “baking…” sticker (loading) shows while you wait, and a “sorry, burnt” note (error) appears if it fails." },
    visual: { type: "layers", title: "How one segment's files wrap each other", items: [
      { label: "layout.jsx", detail: "Outermost. Shared nav/sidebar. Keeps state when you move between child pages." },
      { label: "error.jsx", detail: "Error boundary (`'use client'`). Catches crashes below it, shows a retry button." },
      { label: "loading.jsx", detail: "Suspense fallback. Shows instantly while the page's data loads." },
      { label: "not-found.jsx", detail: "Shown when `notFound()` is called in this segment." },
      { label: "page.jsx", detail: "The actual screen for this URL. Innermost." }
    ]},
    points: [
      "The **root** `app/layout.jsx` is required and must render `<html>` and `<body>`.",
      "Layouts **don't re-render or lose state** on navigation between their children; they receive `children`.",
      "`loading.jsx` wraps the page in `<Suspense>` automatically, so users see a skeleton instantly.",
      "`error.jsx` **must be a Client Component**. It gets `error` and `retry` (stable in 16.3; older 16.x: `reset` / `unstable_retry`).",
      "`error.jsx` doesn't catch errors in the layout of the same folder; for the root layout use `global-error.jsx`."
    ],
    code: { file: "app/notes/ (4 files)", lang: "jsx", src: `// app/notes/layout.jsx: frame shared by every /notes page
export default function NotesLayout({ children }) {
  return (
    <section>
      <nav>📝 My Notes</nav>
      {children}
    </section>
  );
}

// app/notes/loading.jsx: shown while page.jsx awaits data
export default function Loading() {
  return <p>Loading notes…</p>;
}

// app/notes/error.jsx: must be a Client Component
'use client';
export default function NotesError({ error, retry }) {
  return (
    <div>
      <p>Couldn't load notes.</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  );
}

// app/notes/page.jsx: the screen itself
export default async function NotesPage() {
  const notes = await fetch('https://dummyjson.com/todos?limit=3')
    .then((r) => r.json());
  return (
    <ul>
      {notes.todos.map((n) => <li key={n.id}>{n.todo}</li>)}
    </ul>
  );
}`, walk: [
      { lines: [2, 6], note: "Four separate files shown together. The layout wraps every page under `/notes` via `children`." },
      { lines: [12, 13], note: "`loading.jsx` becomes the `<Suspense>` fallback for the page." },
      { lines: [17, 22], note: "In a real `error.jsx`, `'use client'` is the first line. `retry()` re-fetches and re-renders the segment." },
      { lines: [28, 29, 30], note: "The page awaits data. Until it's ready, users see “Loading notes…” inside the layout." }
    ]},
    output: "On /notes the nav shows at once, “Loading notes…” appears, then the list replaces it. If the fetch throws, “Couldn't load notes.” with a Try again button.",
    mistakes: [
      { bad: `// app/notes/error.jsx\nexport default function Error({ error }) {\n  return <p>{error.message}</p>;\n}`, good: `'use client';\nexport default function Error({ error, retry }) {\n  return <button onClick={() => retry()}>Try again</button>;\n}`, why: "Error boundaries run in the browser, so `error.jsx` needs `'use client'`. Also, production hides server error messages; show friendly text and log `error.digest`." },
      { bad: `// app/layout.jsx\nexport default function Root({ children }) {\n  return <main>{children}</main>;\n}`, good: `export default function Root({ children }) {\n  return (<html lang=\"en\"><body>{children}</body></html>);\n}`, why: "The root layout must render `<html>` and `<body>`; Next.js doesn't add them for you." }
    ],
    practice: [
      { level: "B", q: "Add a shared header to every page under `/shop`.", a: "Create `app/shop/layout.jsx` that renders the header and `{children}`." },
      { level: "B", q: "Show “Fetching cart…” while `/cart` loads.", a: "Add `app/cart/loading.jsx` returning that text." },
      { level: "I", q: "Why does a counter in a layout keep its value when you go from `/shop/a` to `/shop/b`?", a: "Layouts persist across navigations between their children; only the `page` part re-renders." },
      { level: "C", q: "The root layout throws. Which file shows a fallback, and what must it include?", a: "`app/global-error.jsx` (Client Component). It replaces the root layout, so it must render its own `<html>` and `<body>`." }
    ],
    quiz: [
      { q: "Which special file must be a Client Component?", options: ["layout.jsx", "page.jsx", "error.jsx", "loading.jsx"], answer: 2, why: "Error boundaries are client-side; `error.jsx` needs `'use client'`." },
      { q: "What does `loading.jsx` do under the hood?", options: ["Delays the page by 1s", "Wraps the page in a `<Suspense>` boundary", "Shows a browser spinner"], answer: 1, why: "It's the Suspense fallback shown while the segment's content streams in." },
      { q: "A layout's local state on navigation between its child pages...", options: ["Resets every time", "Is preserved", "Is saved to localStorage"], answer: 1, why: "Layouts stay mounted; only the changing child segment re-renders." }
    ],
    rev: {
      sec30: "App Router special files per segment: `layout` (persistent frame, gets `children`), `page` (the route UI), `loading` (auto `<Suspense>` fallback), `error` (Client Component error boundary with `error` and `retry`), `not-found` (for `notFound()`). Nesting order: layout > error > loading > not-found > page. Root layout needs `<html>`/`<body>`; root-layout errors need `global-error.jsx`.",
      interview: [
        { level: "basic", q: "What's the difference between `layout.jsx` and `page.jsx`?", a: "`page` is the unique UI for a URL; `layout` is shared UI that wraps child pages and persists across navigation." },
        { level: "intermediate", q: "How does `loading.jsx` relate to Suspense?", a: "Next.js wraps the segment's page in `<Suspense fallback={<Loading />}>`, so the fallback streams immediately while data loads." },
        { level: "intermediate", q: "Why must `error.jsx` be a Client Component?", a: "It's a React error boundary that needs to recover and re-render in the browser, e.g. via `retry()`." },
        { level: "advanced", q: "Why doesn't `app/shop/error.jsx` catch an error thrown in `app/shop/layout.jsx`?", a: "The error boundary is rendered inside that layout, so it can only catch errors below it. The parent segment's `error.jsx` catches it." },
        { level: "tricky", q: "When would you use `template.jsx` instead of `layout.jsx`?", a: "When you want the wrapper to remount on every navigation, e.g. to reset state or replay an enter animation." }
      ],
      debug: [
        { code: `// app/cart/error.jsx\nexport default function CartError({ retry }) {\n  return <button onClick={retry}>Retry</button>;\n}`, fix: `'use client';\nexport default function CartError({ retry }) {\n  return <button onClick={() => retry()}>Retry</button>;\n}`, why: "Without `'use client'` the error boundary can't run in the browser and the build errors." }
      ],
      cheat: [
        "`layout` persists, `page` is the route, `loading` = Suspense fallback",
        "`error.jsx` needs `'use client'`; props `error`, `retry`",
        "Root layout must render `<html>` and `<body>`",
        "`global-error.jsx` catches root layout errors",
        "`not-found.jsx` pairs with `notFound()`",
        "`template.jsx` = layout that remounts each navigation"
      ]
    },
    related: ["NEXT-003", "NEXT-010", "ADV-004", "ROUTE-015"]
  },

  "NEXT-005": {
    tldr: "Server Components run only on the server (framework-only in Next.js). They can be `async`, `await` a database or API directly, keep secrets safe, and send finished UI with zero JavaScript for themselves.",
    analogy: { icon: "👨‍🍳", text: "The kitchen plates the meal before it leaves. The customer gets a ready dish, never sees the pantry (database) or the recipe secrets (API keys)." },
    visual: { type: "flow", title: "A Server Component request", steps: [
      { label: "Request /weather", detail: "Browser asks for the page. Next.js finds `app/weather/page.jsx`." },
      { label: "Run on server", detail: "React calls the `async` component on the server. It can read `process.env` secrets." },
      { label: "await data", detail: "`await fetch(...)` or a DB query, right inside the component. No `useEffect`." },
      { label: "Render to payload", detail: "Output becomes HTML + an RSC payload (serialised UI tree)." },
      { label: "Browser shows it", detail: "Finished HTML appears. No JS is shipped for this component." }
    ]},
    points: [
      "In the App Router every component is a **Server Component by default**. No directive needed.",
      "Can be **`async`**: `const data = await getData()`. Can't use `useState`, `useEffect`, event handlers or `window`.",
      "Secrets stay on the server. Add `import 'server-only'` to data files so a client import fails the build.",
      "Start independent requests together with **`Promise.all`** to avoid a slow waterfall.",
      "`fetch` calls with the same URL are deduplicated in one render; wrap DB helpers in React's `cache()` for the same effect."
    ],
    code: { file: "app/weather/page.jsx", lang: "jsx", src: `import 'server-only';

async function getForecast(city) {
  const res = await fetch(
    \`https://api.weather.example/v1/forecast?city=\${city}\`,
    { headers: { Authorization: \`Bearer \${process.env.WEATHER_KEY}\` } }
  );
  if (!res.ok) throw new Error('Weather service down');
  return res.json();
}

export default async function WeatherPage() {
  // Two independent requests: start both, then wait once
  const [london, paris] = await Promise.all([
    getForecast('london'),
    getForecast('paris'),
  ]);

  return (
    <main>
      <h1>Today</h1>
      <p>London: {london.temp}°C</p>
      <p>Paris: {paris.temp}°C</p>
    </main>
  );
}`, walk: [
      { lines: [1], note: "`server-only` makes the build fail if a Client Component ever imports this file." },
      { lines: [6], note: "The API key is read on the server. Without `NEXT_PUBLIC_` it never reaches the browser." },
      { lines: [12], note: "An `async` component: allowed only for Server Components." },
      { lines: [14, 15, 16, 17], note: "`Promise.all` runs both fetches in parallel instead of one after another." },
      { lines: [22, 23], note: "Data is already here; render it directly. No loading state in this component." }
    ]},
    output: "The page HTML arrives with “London: 14°C” and “Paris: 17°C” already filled in. The browser downloads no JS for WeatherPage.",
    mistakes: [
      { bad: `export default async function Page() {\n  const [likes, setLikes] = useState(0);\n  const data = await getData();\n}`, good: `export default async function Page() {\n  const data = await getData();\n  return <LikeButton initial={data.likes} />; // 'use client' file\n}`, why: "Server Components have no state or effects. Move the interactive part into a small Client Component and pass data as props." },
      { bad: `const a = await getUser();\nconst b = await getOrders(); // waits for a first`, good: `const [a, b] = await Promise.all([getUser(), getOrders()]);`, why: "Sequential awaits on independent data create a waterfall; total time = sum. In parallel, total time = the slowest one." }
    ],
    practice: [
      { level: "B", q: "Show a list of 5 recipes from `https://dummyjson.com/recipes?limit=5` in a Server Component.", a: "Make the page `async`, await the fetch, map over `data.recipes`.", code: `export default async function Page() {\n  const data = await fetch('https://dummyjson.com/recipes?limit=5').then(r => r.json());\n  return <ul>{data.recipes.map(r => <li key={r.id}>{r.name}</li>)}</ul>;\n}` },
      { level: "B", q: "Why is it safe to use `process.env.DB_PASSWORD` here?", a: "The code runs only on the server; non-`NEXT_PUBLIC_` env vars are never bundled for the browser." },
      { level: "I", q: "The header and the page both call `getCart()`. How do you avoid two DB queries?", a: "Wrap it: `export const getCart = cache(async () => db.cart.find(...))` with `cache` from `react`. Same render = one query." },
      { level: "C", q: "A page awaits user, then orders, then reviews (all independent). Fix it.", a: "Start all three with `Promise.all`, or split into separate components inside `<Suspense>` so each streams on its own." }
    ],
    quiz: [
      { q: "Which can a Server Component do?", options: ["useState", "onClick handler", "await a database query", "read window.innerWidth"], answer: 2, why: "Server Components run on the server and can be async. State, events and browser APIs need a Client Component." },
      { q: "How much JavaScript does a Server Component add to the browser bundle?", options: ["The same as a Client Component", "None for its own code", "Only its hooks"], answer: 1, why: "Its rendered output is sent; its code stays on the server." },
      { q: "What does `import 'server-only'` do?", options: ["Speeds up fetch", "Fails the build if a Client Component imports the file", "Turns on SSR"], answer: 1, why: "It's a guard against leaking server code and secrets to the client." }
    ],
    rev: {
      sec30: "Server Components (default in the App Router) run only on the server, can be `async`, and fetch from APIs or databases directly. They keep secrets server-side and ship no JS for themselves. They can't use state, effects, events or browser APIs. Use `Promise.all` to avoid waterfalls, `cache()` to dedupe, and `server-only` to guard data modules.",
      interview: [
        { level: "basic", q: "What is a Server Component?", a: "A React component that renders only on the server. Its output is sent to the browser but its code and data access stay on the server." },
        { level: "intermediate", q: "How do you fetch data in a Server Component?", a: "Make it `async` and `await` the fetch or DB call directly in the component body. No `useEffect` or loading state is needed there." },
        { level: "intermediate", q: "What can't a Server Component do?", a: "Use state, effects, context consumers, event handlers or browser APIs. Those belong in Client Components." },
        { level: "advanced", q: "How do you avoid duplicate DB calls across layout and page?", a: "Wrap the data function in React's `cache()`. Calls with the same args in one request share the result; `fetch` is already memoized." },
        { level: "tricky", q: "Is the RSC payload the same as HTML?", a: "No. It's a serialised React tree with placeholders for Client Components. It's used for first-load hydration and client navigations." }
      ],
      scenario: [
        { q: "The product page takes 3s because it awaits product, reviews and stock one after another.", a: "Fetch in parallel with `Promise.all`, or move slow parts (reviews) into their own async component inside `<Suspense>` so the product shows first." }
      ],
      cheat: [
        "Default in `app/`: Server Component",
        "Can be `async`; `await` fetch or DB directly",
        "No state, effects, events or `window`",
        "Secrets safe; guard with `import 'server-only'`",
        "`Promise.all` for parallel data",
        "`cache()` from React dedupes per request"
      ]
    },
    related: ["NEXT-006", "ADV-015", "NEXT-011", "NEXT-010"]
  },

  "NEXT-006": {
    tldr: "Add `'use client'` at the top of a file to make it a Client Component (framework-only boundary). It renders on the server for the first HTML, then hydrates in the browser so state, effects and clicks work.",
    analogy: { icon: "🛎️", text: "Most of a shop window is a printed poster (server). The little bell you press to call staff (a button) is the only part wired up with electricity (client JS)." },
    visual: { type: "tree", title: "Keep the client part small (leaves)", root: { label: "page.jsx", note: "Server", children: [
      { label: "ProductInfo", note: "Server: title, price" },
      { label: "Reviews", note: "Server: awaits DB" },
      { label: "AddToCart", note: "'use client': useState + onClick", children: [
        { label: "QuantityPicker", note: "Client (imported by AddToCart)" }
      ]},
      { label: "Modal", note: "'use client'", children: [
        { label: "<CartSummary /> as children", note: "Still Server" }
      ]}
    ]}},
    points: [
      "`'use client'` goes on the **first line** of the file. It marks a **boundary**: that file and everything it imports join the browser bundle.",
      "Use it for **state, effects, event handlers, browser APIs** (`localStorage`, `window`) and most hooks.",
      "Client Components still **prerender to HTML on the server**, then hydrate. Don't read `window` during render.",
      "Props from Server to Client must be **serialisable** (strings, numbers, plain objects, Dates, Promises). Not functions, except Server Actions.",
      "Pass Server Components as **`children`** into a Client Component; they stay server-rendered."
    ],
    code: { file: "app/ui/add-to-cart.jsx", lang: "jsx", src: `'use client';

import { useState } from 'react';

export default function AddToCart({ productName, stock }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
      <span>{qty}</span>
      <button onClick={() => setQty((q) => Math.min(stock, q + 1))}>+</button>
      <button onClick={() => setAdded(true)}>
        Add {qty} × {productName}
      </button>
      {added && <p>✅ Added to cart</p>}
    </div>
  );
}

// Used from a Server Component (app/products/[id]/page.jsx):
//   const product = await getProduct(id);
//   <AddToCart productName={product.title} stock={product.stock} />`, walk: [
      { lines: [1], note: "First line, before imports. Marks this module (and its imports) as client code." },
      { lines: [6, 7], note: "State works here because this component hydrates in the browser." },
      { lines: [11, 13], note: "Event handlers need client JS. Updater functions keep qty between 1 and stock." },
      { lines: [22, 23, 24], note: "The server page fetches data and passes plain, serialisable props down." }
    ]},
    output: "The page shows “− 1 +” and “Add 1 × Lavender Soap”. Clicking + updates the count; Add shows “✅ Added to cart”.",
    mistakes: [
      { bad: `// app/layout.jsx\n'use client';\nexport default function RootLayout({ children }) { ... }`, good: `// keep layout on the server\nimport ThemeToggle from './theme-toggle'; // 'use client' file\nexport default function RootLayout({ children }) { ... }`, why: "Putting `'use client'` high up moves the whole subtree to the browser: bigger bundles, no server data fetching. Push it down to the interactive leaves." },
      { bad: `'use client';\nconst saved = localStorage.getItem('qty'); // during render`, good: `'use client';\nuseEffect(() => {\n  setQty(Number(localStorage.getItem('qty') ?? 1));\n}, []);`, why: "Client Components also render on the server, where `localStorage` doesn't exist. Read browser APIs in an effect or event." }
    ],
    practice: [
      { level: "B", q: "Make a like button with a counter.", a: "Create a file with `'use client'`, `useState`, and an `onClick` that increments." },
      { level: "I", q: "A server page wants to put server-fetched `<CartSummary />` inside a client `<Drawer>` that toggles open. How?", a: "Make `Drawer` accept `children` and render `<Drawer><CartSummary /></Drawer>` in the server page. CartSummary stays a Server Component." },
      { level: "I", q: "You pass `onAdd={() => save()}` from a Server Component to a Client Component. What happens?", a: "Error: functions aren't serialisable. Pass a Server Action (`'use server'`) or move the handler into the client file." },
      { level: "C", q: "A third-party carousel uses `useState` but has no `'use client'`. How do you use it in a server page?", a: "Create `carousel.jsx` with `'use client'` that re-exports it: `export { Carousel as default } from 'acme-carousel';`." }
    ],
    quiz: [
      { q: "Where does `'use client'` go?", options: ["In every component that uses props", "At the top of the file, before imports", "Inside the component body", "In next.config.js"], answer: 1, why: "It's a module-level directive marking the server-to-client boundary." },
      { q: "Do Client Components render on the server?", options: ["Never", "Yes, for the initial HTML, then they hydrate", "Only in development"], answer: 1, why: "They prerender to HTML, then React attaches handlers in the browser." },
      { q: "A Server Component is passed as `children` to a Client Component. It is...", options: ["Converted to a Client Component", "Still rendered on the server", "Not allowed"], answer: 1, why: "It's rendered on the server and passed as output, not imported into the client bundle." }
    ],
    rev: {
      sec30: "`'use client'` at the top of a file marks the boundary into the browser bundle. Client Components can use state, effects, events and browser APIs. They still prerender to HTML on the server, then hydrate. Keep them small (leaves), pass serialisable props from the server, and pass Server Components through `children` to keep them on the server.",
      interview: [
        { level: "basic", q: "When do you need `'use client'`?", a: "When a component uses state, effects, event handlers, browser APIs or client-only hooks." },
        { level: "intermediate", q: "Does `'use client'` mean the component skips SSR?", a: "No. It's still prerendered to HTML on the server; the directive means its code is also sent to the browser to hydrate." },
        { level: "intermediate", q: "Do you add `'use client'` to every child of a Client Component?", a: "No. Everything a client file imports is already client code. Add it only at the entry of the client subtree." },
        { level: "advanced", q: "How can a Client Component contain a Server Component?", a: "Not by importing it, but by receiving it as a prop like `children`. The server renders it and React slots the output in." },
        { level: "tricky", q: "How do you use React Context in the App Router?", a: "Create a `'use client'` provider component that takes `children`, and render it from the (server) layout as deep as possible." }
      ],
      predict: [
        { code: `'use client';\nexport default function Size() {\n  return <p>{window.innerWidth}px</p>;\n}`, answer: "Crashes during server prerender: window is not defined", why: "Client Components render on the server first. Read `window` in an effect." }
      ],
      cheat: [
        "`'use client'` = first line, marks a boundary",
        "Needed for state, effects, events, browser APIs",
        "Still prerendered on server, then hydrated",
        "Imports of a client file are client too",
        "Props must be serialisable (no plain functions)",
        "Server Components can go in via `children`",
        "Push `'use client'` down to leaves"
      ]
    },
    related: ["NEXT-005", "ADV-016", "ADV-019", "NEXT-012"]
  },

  "NEXT-007": {
    tldr: "Server-side rendering per request (request-time or dynamic rendering, framework-only) builds the HTML fresh for each visitor. Use it when the page depends on who is asking: cookies, headers or live data.",
    analogy: { icon: "☕", text: "A barista makes each coffee to order with your name on the cup, instead of handing out pre-made bottles from the fridge." },
    visual: { type: "flow", title: "One request, rendered just for you", steps: [
      { label: "Request arrives", detail: "Browser asks for /cart with the `session` cookie." },
      { label: "Send the shell", detail: "Static parts and `<Suspense>` fallbacks stream out at once." },
      { label: "Read request data", detail: "`await cookies()` finds the user; the server loads their cart." },
      { label: "Stream the rest", detail: "The personalised HTML replaces the fallback in the same response." },
      { label: "Hydrate", detail: "Client Components (like a Remove button) become interactive." }
    ]},
    points: [
      "Reading **`cookies()`, `headers()`, `searchParams`** or calling `connection()` means the work must happen at request time.",
      "In Next.js 16 these are all **async**: `const store = await cookies()`.",
      "Wrap request-time parts in **`<Suspense>`** so the rest of the page can be sent first (required with Cache Components, the default for new apps).",
      "Cost: the server works on **every request**, so time-to-first-byte depends on your data. Cache what isn't personal.",
      "Like a Razor page rendered per request in ASP.NET Core, but with React components and streaming."
    ],
    code: { file: "app/cart/page.jsx", lang: "jsx", src: `import { Suspense } from 'react';
import { cookies } from 'next/headers';

async function getCart(sessionId) {
  const res = await fetch(\`https://shop.example/api/cart/\${sessionId}\`);
  return res.json();
}

async function CartItems() {
  const store = await cookies();                // request-time data
  const sessionId = store.get('session')?.value;
  if (!sessionId) return <p>Your cart is empty.</p>;

  const cart = await getCart(sessionId);
  return (
    <ul>
      {cart.items.map((item) => (
        <li key={item.id}>{item.name} × {item.qty}</li>
      ))}
    </ul>
  );
}

export default function CartPage() {
  return (
    <main>
      <h1>🛒 Your cart</h1>
      <Suspense fallback={<p>Loading your cart…</p>}>
        <CartItems />
      </Suspense>
    </main>
  );
}`, walk: [
      { lines: [2, 10], note: "`cookies()` is async in Next.js 16. Reading it ties this component to the request." },
      { lines: [11, 12], note: "Each visitor has a different cookie, so each gets different HTML." },
      { lines: [14], note: "Fetch per request; this data is personal and shouldn't be shared via cache." },
      { lines: [27, 28, 29], note: "The heading streams immediately. The cart replaces the fallback when ready." }
    ]},
    output: "“🛒 Your cart” and “Loading your cart…” appear first, then e.g. “Bananas × 6, Oat milk × 1” for this visitor.",
    mistakes: [
      { bad: `const theme = cookies().get('theme');`, good: `const theme = (await cookies()).get('theme');`, why: "Next.js 16 removed sync access. `cookies()`, `headers()`, `params` and `searchParams` must be awaited." },
      { bad: `export default async function Page() {\n  const user = (await cookies()).get('user');\n  // whole page waits for this\n}`, good: `<Suspense fallback={<Skeleton />}>\n  <UserPanel />\n</Suspense>`, why: "Awaiting request data at the top blocks the whole page. Move it into a child inside `<Suspense>` so the shell is sent first." }
    ],
    practice: [
      { level: "B", q: "Greet the user by the `name` cookie, or “Guest”.", a: "In an async component: `const name = (await cookies()).get('name')?.value ?? 'Guest';` and wrap it in `<Suspense>`." },
      { level: "I", q: "Show search results for `/search?q=pizza`.", a: "Await `searchParams` in the page and pass `q` to a results component inside `<Suspense>`.", code: `export default function Page({ searchParams }) {\n  return (\n    <Suspense fallback={<p>Searching…</p>}>\n      <Results searchParams={searchParams} />\n    </Suspense>\n  );\n}\nasync function Results({ searchParams }) {\n  const { q } = await searchParams;\n  return <p>Results for {q}</p>;\n}` },
      { level: "I", q: "Read the visitor's language from the `accept-language` header.", a: "`const lang = (await headers()).get('accept-language');` from `next/headers`." },
      { level: "C", q: "Why is per-request rendering slower to first byte than serving a prebuilt page?", a: "The server must run code and wait for data for each request, while a prerendered page is just a file served from a CDN." }
    ],
    quiz: [
      { q: "Which makes rendering happen per request?", options: ["Importing `Link`", "Reading `await cookies()`", "Using CSS modules", "Exporting `metadata`"], answer: 1, why: "Cookies differ per visitor, so the output can't be built ahead of time." },
      { q: "In Next.js 16, `headers()` is...", options: ["Synchronous", "Async: `await headers()`", "Only available in Client Components"], answer: 1, why: "All request APIs became async-only in v16." },
      { q: "Why wrap the request-time part in `<Suspense>`?", options: ["To cache it forever", "So the rest of the page streams first", "To make it a Client Component"], answer: 1, why: "The shell and fallback go out immediately; the personal part streams in." }
    ],
    rev: {
      sec30: "Request-time (dynamic) rendering builds HTML per request. It's triggered by request data: `cookies()`, `headers()`, `searchParams`, `connection()` or uncached data. All are async in v16. Wrap those parts in `<Suspense>` so the static shell streams first. Trade-off: fresh, personal pages vs server work and slower first byte on each request.",
      interview: [
        { level: "basic", q: "What is server-side rendering?", a: "Generating the page's HTML on the server when a request arrives, so the browser gets content before JS runs." },
        { level: "intermediate", q: "What triggers request-time rendering in Next.js?", a: "Using request data like `cookies()`, `headers()`, `searchParams`, `connection()`, or fetching data that isn't cached." },
        { level: "intermediate", q: "SSR vs CSR for a cart page?", a: "SSR sends the filled cart in the HTML (fast first paint). CSR sends a shell, then fetches in the browser. SSR costs server time per request." },
        { level: "advanced", q: "How do you keep a page mostly static while one part is personal?", a: "Put the personal part in its own async component inside `<Suspense>`. The rest is prerendered into a static shell and the personal part streams in." },
        { level: "tricky", q: "Does SSR make a page interactive immediately?", a: "No. HTML shows first; Client Components become interactive only after their JS loads and hydrates." }
      ],
      cheat: [
        "Request-time render = new HTML per request",
        "Triggers: `cookies()`, `headers()`, `searchParams`, `connection()`",
        "All async in v16: `await cookies()`",
        "Wrap in `<Suspense>` to stream the shell first",
        "Good for personal or live data",
        "Cost: server work every request"
      ]
    },
    related: ["NEXT-008", "NEXT-009", "INTRO-012", "ADV-018"]
  },

  "NEXT-008": {
    tldr: "Static rendering (prerendering, framework-only) builds a page's HTML once at `next build`. Every visitor gets the same ready file, served fast from a CDN. Ideal for blogs, docs, menus and product pages.",
    analogy: { icon: "📰", text: "A newspaper is printed overnight and handed to everyone in the morning. Fast and cheap, but the same for every reader until the next print run." },
    visual: { type: "timeline", title: "Static page lifecycle", frames: [
      { label: "next build", state: "generateStaticParams() → ['pancakes', 'soup']", note: "Next.js learns which URLs to prerender." },
      { label: "Prerender", state: "pancakes.html, soup.html", note: "Each page runs once on the build machine." },
      { label: "Visit 1..1000", state: "Same HTML from CDN", note: "No server rendering per request." },
      { label: "Unknown slug", state: "/recipes/curry → built on first visit", note: "Generated, then cached for the next visitor (ISR)." },
      { label: "Revalidate", state: "cacheLife / updateTag → rebuild", note: "Data changed? The cached page is refreshed." }
    ]},
    points: [
      "A component that uses **no request data** (no cookies, headers, searchParams) is prerendered automatically at build time.",
      "For dynamic routes, **`generateStaticParams()`** lists which `[slug]` values to build ahead of time.",
      "With Cache Components (default in new apps), mark data with **`'use cache'`** + `cacheLife()` so it becomes part of the static shell.",
      "`next build` prints route symbols: **○ Static**, **◐ Partial Prerender**, **ƒ Dynamic**.",
      "Same idea as SSG: static HTML, but Next.js can refresh it later without a full rebuild (revalidation)."
    ],
    code: { file: "app/recipes/[slug]/page.jsx", lang: "jsx", src: `import { cacheLife } from 'next/cache';

async function getRecipe(slug) {
  'use cache';               // requires cacheComponents: true
  cacheLife('days');         // refresh at most about daily
  const res = await fetch(\`https://cms.example/recipes/\${slug}\`);
  return res.json();
}

// Build these pages at next build time
export async function generateStaticParams() {
  const res = await fetch('https://cms.example/recipes');
  const recipes = await res.json();
  return recipes.map((r) => ({ slug: r.slug }));
}

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  return (
    <article>
      <h1>{recipe.title}</h1>
      <ol>
        {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
    </article>
  );
}`, walk: [
      { lines: [4, 5], note: "`'use cache'` caches the result; `cacheLife('days')` sets how long it stays fresh." },
      { lines: [11, 14], note: "Return one `{ slug }` object per page to prerender. Runs during `next build`." },
      { lines: [17, 18, 19], note: "Known slugs are built ahead; their params are known, so the whole page is static." },
      { lines: [22, 23, 24, 25, 26], note: "Plain markup, no request data: becomes a static HTML file." }
    ]},
    output: "`next build` lists /recipes/[slug] with prerendered paths like /recipes/pancakes. Visiting them returns HTML instantly with no server rendering.",
    mistakes: [
      { bad: `// "static" recipe page\nconst user = (await cookies()).get('user');`, good: `// keep the page static; read cookies in a\n// separate component inside <Suspense>`, why: "Reading request data at the page level stops it being fully prerendered. Isolate personal bits so the rest stays static." },
      { bad: `export async function generateStaticParams() {\n  return ['pancakes', 'soup'];\n}`, good: `export async function generateStaticParams() {\n  return [{ slug: 'pancakes' }, { slug: 'soup' }];\n}`, why: "It must return an array of objects whose keys match the folder name (`[slug]` -> `slug`)." }
    ],
    practice: [
      { level: "B", q: "Make an `/about` page static.", a: "Just write it without request data. Plain JSX in `app/about/page.jsx` is prerendered at build." },
      { level: "I", q: "Prerender `/products/1` to `/products/3`.", a: "Return `[{ id: '1' }, { id: '2' }, { id: '3' }]` from `generateStaticParams` in `app/products/[id]/page.jsx`." },
      { level: "I", q: "Cache a menu fetch for an hour with Cache Components.", a: "Put `'use cache'` and `cacheLife('hours')` at the top of the async data function.", code: `export async function getMenu() {\n  'use cache';\n  cacheLife('hours');\n  return fetch('https://cafe.example/menu').then(r => r.json());\n}` },
      { level: "C", q: "You have 50,000 products. Should `generateStaticParams` return all of them?", a: "Usually no: build the popular ones and let the rest be generated on first visit and cached (ISR). Faster builds, same result." }
    ],
    quiz: [
      { q: "When is a static page's HTML created?", options: ["On every request", "At `next build` (or first visit, then cached)", "In the browser"], answer: 1, why: "Prerendering happens ahead of time; visitors get the stored result." },
      { q: "What does `generateStaticParams` return for `app/blog/[slug]`?", options: ["`['a', 'b']`", "`[{ slug: 'a' }, { slug: 'b' }]`", "A React component"], answer: 1, why: "An array of param objects keyed by the segment name." },
      { q: "Which breaks full static rendering of a page?", options: ["A `'use cache'` fetch", "Reading `await headers()` in the page", "Using `Link`"], answer: 1, why: "Headers are per request, so that part must render at request time." }
    ],
    rev: {
      sec30: "Static rendering prerenders HTML at build time (or on first visit, then caches it). Pages with no request data are static automatically. `generateStaticParams` lists dynamic params to build. With Cache Components, `'use cache'` + `cacheLife` put data into the static shell. Build output: ○ static, ◐ partial, ƒ dynamic. Fast and cheap; refreshed by revalidation.",
      interview: [
        { level: "basic", q: "What is static rendering?", a: "Rendering a page to HTML ahead of time, at build, so every request gets the same prebuilt file." },
        { level: "intermediate", q: "What does `generateStaticParams` do?", a: "It returns the list of dynamic segment values to prerender at build time, like every blog slug." },
        { level: "intermediate", q: "How does a static page get new data?", a: "Through revalidation: a time-based `cacheLife`, or on-demand `updateTag`/`revalidateTag`/`revalidatePath` after a change." },
        { level: "advanced", q: "What is Partial Prerendering?", a: "One route with a static shell (prerendered) plus dynamic holes inside `<Suspense>` that stream at request time. It's the default with Cache Components." },
        { level: "tricky", q: "Is a page in `next dev` cached like in production?", a: "No. In development pages render on demand so you see changes; test caching with `next build && next start`." }
      ],
      compare: { cols: ["", "Static", "Request-time"], rows: [
        ["HTML built", "At build / first visit", "Every request"],
        ["Same for everyone", "Yes", "Can be personal"],
        ["Speed", "CDN-fast", "Depends on data"],
        ["Fresh data", "Via revalidation", "Always"]
      ]},
      cheat: [
        "No request data = prerendered at build",
        "`generateStaticParams` -> `[{ slug }]` list",
        "`'use cache'` + `cacheLife()` (Cache Components)",
        "Build symbols: ○ static, ◐ partial, ƒ dynamic",
        "Unlisted params: built on first visit, then cached",
        "Test with `next build && next start`, not `next dev`"
      ]
    },
    related: ["NEXT-007", "NEXT-009", "NEXT-011", "INTRO-013"]
  },

  "NEXT-009": {
    tldr: "A route (or part of it) becomes dynamic (framework-only) when it needs something only known at request time: cookies, headers, search params, unknown URL params, uncached data, or the current time/random values.",
    analogy: { icon: "🥪", text: "A sandwich shop pre-makes the bread and sauce (static). Only the filling you choose at the counter (request data) is made on the spot." },
    visual: { type: "compare", title: "Stays static vs needs the request",
      left: { label: "Prerendered (static)", tone: "good", points: [
        "Plain JSX, imports, pure maths",
        "`'use cache'` data (with a long enough cacheLife)",
        "`params` listed by `generateStaticParams`",
        "`<Suspense>` fallback UI"
      ]},
      right: { label: "Request-time (dynamic)", tone: "neutral", points: [
        "`await cookies()` / `await headers()`",
        "`await searchParams` (e.g. `?q=pizza`)",
        "Uncached `fetch` or DB query",
        "`await connection()` before `Date.now()` / `Math.random()`",
        "`params` not known at build time"
      ]}
    },
    points: [
      "With **Cache Components** (default for new apps) dynamic is per component: dynamic parts stream inside `<Suspense>`, the rest stays a static shell (**Partial Prerendering**).",
      "Forget the `<Suspense>` around request-time data and the dev overlay shows a **blocking-route** error that tells you to wrap or cache it.",
      "Previous model (Cache Components off): one dynamic API makes the **whole route** dynamic. `export const dynamic = 'force-dynamic'` forces it.",
      "**`connection()`** from `next/server` says “render this per request” when no other request API is used.",
      "Check the result in `next build` output: ○ static, ◐ partial prerender, ƒ dynamic."
    ],
    code: { file: "app/menu/page.jsx", lang: "jsx", src: `import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { cacheLife } from 'next/cache';

async function Menu() {                 // static: cached for everyone
  'use cache';
  cacheLife('hours');
  const res = await fetch('https://cafe.example/menu');
  const items = await res.json();
  return <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}

async function Favourite() {            // dynamic: reads a cookie
  const fav = (await cookies()).get('fav')?.value;
  return <p>Your usual: {fav ?? 'pick one!'}</p>;
}

async function OrderTime() {            // dynamic: current time
  await connection();
  return <p>Ordered at {new Date().toLocaleTimeString()}</p>;
}

export default function MenuPage() {
  return (
    <main>
      <h1>☕ Café menu</h1>
      <Menu />
      <Suspense fallback={<p>…</p>}><Favourite /></Suspense>
      <Suspense fallback={<p>…</p>}><OrderTime /></Suspense>
    </main>
  );
}`, walk: [
      { lines: [6, 7, 8], note: "Cached data joins the static shell, prerendered at build." },
      { lines: [14, 15], note: "Reading a cookie makes this component request-time." },
      { lines: [19, 20, 21], note: "`connection()` defers to request time, so the time is real, not the build time." },
      { lines: [27, 28, 29, 30], note: "Heading + menu are static (◐ route). Each dynamic part streams inside its own `<Suspense>`." }
    ]},
    output: "The heading and menu appear instantly from the static shell; “Your usual: Flat white” and the order time stream in a moment later.",
    mistakes: [
      { bad: `export default async function Page() {\n  const now = new Date().toLocaleTimeString();\n  return <p>{now}</p>;\n}`, good: `async function Now() {\n  await connection();\n  return <p>{new Date().toLocaleTimeString()}</p>;\n}\n// render <Now /> inside <Suspense>`, why: "Without `connection()` the time would be frozen at build. With Cache Components, Next.js flags it and asks you to defer or cache it." },
      { bad: `// one cookie read at the top of the layout\nconst theme = (await cookies()).get('theme');`, good: `// read it in a small component inside <Suspense>\n<Suspense><ThemeBadge /></Suspense>`, why: "Awaiting request data high in the tree makes everything below wait. Read it as deep as possible." }
    ],
    practice: [
      { level: "B", q: "Is a page that only renders `<h1>About us</h1>` static or dynamic?", a: "Static. It uses no request data, so it's prerendered at build." },
      { level: "I", q: "A recipe list page reads `?sort=` from `searchParams`. What happens to it?", a: "The part that awaits `searchParams` is request-time. Wrap it in `<Suspense>` so the heading and filters stay in the static shell." },
      { level: "I", q: "Show a random tip of the day that changes per request.", a: "In an async component call `await connection()` first, then pick `Math.random()`, and render it inside `<Suspense>`." },
      { level: "C", q: "Without Cache Components, how do you force a route to always render per request?", a: "`export const dynamic = 'force-dynamic'` in the page or layout (not used with Cache Components)." }
    ],
    quiz: [
      { q: "Which makes a component request-time?", options: ["`import Image from 'next/image'`", "`await searchParams`", "`'use cache'`", "A `<Suspense>` boundary"], answer: 1, why: "Query strings are known only when a request arrives." },
      { q: "With Cache Components, one cookie read in a child component makes...", options: ["The whole route dynamic", "Only that part request-time; the rest stays static", "The build fail always"], answer: 1, why: "Partial Prerendering keeps a static shell and streams the dynamic hole." },
      { q: "`await connection()` is for...", options: ["Opening a DB connection", "Marking work as request-time when no other request API is used", "Speeding up fetch"], answer: 1, why: "It tells Next.js to wait for a real request, e.g. before `Date.now()`." }
    ],
    rev: {
      sec30: "Dynamic = needs the request. Triggers: `cookies()`, `headers()`, `searchParams`, unknown `params`, uncached data, and time/random without caching (use `connection()`). With Cache Components each dynamic part streams inside `<Suspense>` while the rest is a static shell (Partial Prerendering). Previous model: one trigger made the whole route dynamic; `dynamic = 'force-dynamic'` forced it.",
      interview: [
        { level: "basic", q: "What makes a Next.js route dynamic?", a: "Using request-time information: cookies, headers, search params, params not known at build, or uncached data." },
        { level: "intermediate", q: "What is Partial Prerendering?", a: "A route split into a prerendered static shell and dynamic holes inside `<Suspense>` that stream per request. It's the default with Cache Components." },
        { level: "intermediate", q: "Why does `new Date()` need special handling?", a: "During prerender it would freeze the build time. Call `await connection()` to render it per request, or cache it deliberately." },
        { level: "advanced", q: "How did the previous model differ?", a: "Rendering was decided per route: any dynamic API made the whole route dynamic. Config like `export const dynamic` and `revalidate` tuned it." },
        { level: "tricky", q: "Does wrapping something in `<Suspense>` make it dynamic?", a: "No. Suspense only gives a fallback; a component with no request data still finishes during prerender." }
      ],
      cheat: [
        "Dynamic triggers: `cookies()`, `headers()`, `searchParams`",
        "Also: uncached data, unknown `params`, `connection()`",
        "Time/random: `await connection()` or `'use cache'`",
        "Cache Components: dynamic per component (PPR)",
        "Wrap dynamic parts in `<Suspense>`",
        "Old model: `export const dynamic = 'force-dynamic'`",
        "Check `next build`: ○ ◐ ƒ"
      ]
    },
    related: ["NEXT-007", "NEXT-008", "NEXT-010", "NEXT-011"]
  },

  "NEXT-010": {
    tldr: "Streaming (framework-only in Next.js) sends the page in pieces: the shell and loading placeholders arrive first, and each slow part pops in as soon as its data is ready. Use `loading.jsx` for a whole page or `<Suspense>` for a single part.",
    analogy: { icon: "🍣", text: "A sushi conveyor belt: dishes arrive as each one is ready, instead of waiting for the whole order to be finished before anything leaves the kitchen." },
    visual: { type: "timeline", title: "A product page streaming in", frames: [
      { label: "0 ms", state: "Header + 'Loading reviews…' + 'Loading picks…'", note: "Shell and fallbacks sent at once. User sees something immediately." },
      { label: "150 ms", state: "Product title, price, photo", note: "Fast, cached data in the shell." },
      { label: "600 ms", state: "Reviews replace their fallback", note: "Streamed in the same HTTP response." },
      { label: "1.4 s", state: "'You may also like' replaces fallback", note: "The slowest part doesn't block the rest." },
      { label: "Hydrate", state: "Add-to-cart button works", note: "Client Components hydrate as their HTML arrives." }
    ]},
    points: [
      "**`loading.jsx`** in a folder = `<Suspense>` around that whole page. Quick win for any slow route.",
      "**`<Suspense fallback={...}>`** around one async component streams just that part. More precise.",
      "Each boundary resolves **independently**: the slowest request no longer decides when users see anything.",
      "Place boundaries around **slow or request-time** parts; keep the important content (title, price) outside.",
      "Pass a Promise to a Client Component and read it with React's **`use()`** to stream data into the client."
    ],
    code: { file: "app/products/[id]/page.jsx", lang: "jsx", src: `import { Suspense } from 'react';

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function Reviews({ params }) {
  const { id } = await params;  // runtime data: awaited inside the boundary
  const data = await getJson(\`https://dummyjson.com/comments/post/\${id}\`);
  return <ul>{data.comments.map((c) => <li key={c.id}>{c.body}</li>)}</ul>;
}

async function Recommendations() {
  const data = await getJson('https://dummyjson.com/products?limit=3');
  return <p>Also try: {data.products.map((p) => p.title).join(', ')}</p>;
}

export default function ProductPage({ params }) {
  // Don't await params here: it would hold back the whole page
  return (
    <main>
      <h1>🛍️ Product details</h1>
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews params={params} />
      </Suspense>
      <Suspense fallback={<p>Loading picks…</p>}>
        <Recommendations />
      </Suspense>
    </main>
  );
}`, walk: [
      { lines: [8, 9, 10], note: "Each slow section is its own async Server Component. It awaits `params` and its data inside the boundary." },
      { lines: [19, 20], note: "Pass the `params` Promise down unawaited. With Cache Components, awaiting it here (no `generateStaticParams`) blocks the shell." },
      { lines: [23], note: "This heading is outside any boundary, so it's sent first." },
      { lines: [24, 25, 26], note: "Fallback shows until Reviews resolves; then React swaps in the real HTML." },
      { lines: [27, 28, 29], note: "A separate boundary: recommendations stream on their own schedule." }
    ]},
    output: "“🛍️ Product details”, “Loading reviews…”, “Loading picks…” show instantly. Reviews and “Also try: …” replace their placeholders as each finishes.",
    mistakes: [
      { bad: `<Suspense fallback={<Spinner />}>\n  <Header />\n  <Price />\n  <Reviews />\n</Suspense>`, good: `<Header />\n<Price />\n<Suspense fallback={<Spinner />}>\n  <Reviews />\n</Suspense>`, why: "One big boundary means the fastest content waits for the slowest. Wrap only the slow part." },
      { bad: `// page awaits slow data at the top\nconst reviews = await getReviews(id);\nreturn <><h1/><Reviews data={reviews}/></>;`, good: `return (<><h1/>\n  <Suspense fallback={<p>…</p>}><Reviews id={id} /></Suspense>\n</>);`, why: "An `await` before the return blocks the whole page. Move the fetch into the child so the boundary can stream it." }
    ],
    practice: [
      { level: "B", q: "Show “Loading playlists…” while `/playlists` loads.", a: "Add `app/playlists/loading.jsx` returning that text." },
      { level: "I", q: "Only the weather widget on the home page is slow. Stream just that.", a: "Make `<Weather />` an async Server Component and render `<Suspense fallback={<p>☁️ …</p>}><Weather /></Suspense>`." },
      { level: "I", q: "Use a skeleton instead of text for the fallback.", a: "Pass any JSX: `fallback={<div className=\"skeleton h-24\" />}`." },
      { level: "C", q: "Stream a Promise into a Client Component chart.", a: "In the server page create `const stats = getStats()` (no await) and pass it as a prop inside `<Suspense>`; in the client file `const data = use(stats)`.", code: `'use client';\nimport { use } from 'react';\nexport default function Chart({ stats }) {\n  const data = use(stats);\n  return <p>{data.total} plays</p>;\n}` }
    ],
    quiz: [
      { q: "What does `loading.jsx` create?", options: ["A spinner in the browser tab", "A Suspense boundary around the page", "A client-side fetch"], answer: 1, why: "Next.js wraps the segment's page in `<Suspense fallback={<Loading />}>`." },
      { q: "Two sibling `<Suspense>` boundaries resolve...", options: ["Together, when both are done", "Independently", "In source order only"], answer: 1, why: "Each boundary reveals its content as soon as its own data is ready." },
      { q: "Where should the product title go on a streamed page?", options: ["Inside the reviews boundary", "Outside slow boundaries so it arrives first", "In loading.jsx"], answer: 1, why: "Keep key content out of slow boundaries so it shows immediately." }
    ],
    rev: {
      sec30: "Streaming sends HTML in chunks over one response. `loading.jsx` = Suspense around a page; `<Suspense>` around a component streams just that part. Boundaries resolve independently, so slow data doesn't block fast data. Keep key content outside, push `await` into the children, and stream Promises into Client Components with `use()`.",
      interview: [
        { level: "basic", q: "What is streaming in Next.js?", a: "Sending the page progressively: the shell and fallbacks first, then each section's HTML when its data resolves." },
        { level: "intermediate", q: "`loading.jsx` vs `<Suspense>`?", a: "`loading.jsx` wraps the whole page segment automatically. `<Suspense>` lets you choose exactly which component streams and what its fallback looks like." },
        { level: "intermediate", q: "How does streaming help Core Web Vitals?", a: "Users see content sooner (better FCP/LCP) because the server doesn't wait for every request before sending HTML." },
        { level: "advanced", q: "How do you stream data into a Client Component?", a: "Create the Promise in a Server Component without awaiting, pass it as a prop inside `<Suspense>`, and unwrap it with `use()` in the client." },
        { level: "tricky", q: "Why might a page with `loading.jsx` still feel slow?", a: "If the layout above it awaits slow data, nothing streams until the layout finishes. `loading.jsx` only covers the page below its layout." }
      ],
      debug: [
        { code: `export default async function Page() {\n  const recs = await getRecs(); // 2s\n  return (\n    <Suspense fallback={<p>…</p>}>\n      <Recs data={recs} />\n    </Suspense>\n  );\n}`, fix: `export default function Page() {\n  return (\n    <Suspense fallback={<p>…</p>}>\n      <Recs /> {/* awaits getRecs() inside */}\n    </Suspense>\n  );\n}`, why: "The await happens before the boundary, so the whole page waits 2s. Await inside the suspended child." }
      ],
      cheat: [
        "Streaming = shell first, sections as they're ready",
        "`loading.jsx` = `<Suspense>` around the page",
        "`<Suspense fallback>` around one slow component",
        "Boundaries resolve independently",
        "Await inside the child, not above the boundary",
        "Stream to client: pass a Promise + `use()`"
      ]
    },
    related: ["NEXT-004", "ADV-003", "ADV-018", "NEXT-009"]
  },

  "NEXT-011": {
    tldr: "In Next.js (framework-only) you fetch in Server Components, cache results with `'use cache'` + `cacheLife()`, label them with `cacheTag()`, and refresh after a change with `updateTag()` or `revalidateTag()`.",
    analogy: { icon: "🥫", text: "A café keeps soup in a warmer (cache) and labels the pot “tomato” (tag). Fresh soup made? Swap that labelled pot (revalidate) instead of throwing away the whole kitchen." },
    visual: { type: "cycle", title: "Fetch → cache → revalidate", steps: [
      { label: "Fetch", detail: "First request runs `getProducts()` against the API or DB." },
      { label: "Cache", detail: "`'use cache'` stores the result, keyed by its arguments, tagged `products`." },
      { label: "Serve", detail: "Next requests reuse it instantly until `cacheLife` says it's stale." },
      { label: "Change", detail: "Admin edits a price in a Server Action." },
      { label: "Revalidate", detail: "`updateTag('products')` expires it; the next render fetches fresh data." }
    ]},
    points: [
      "**`fetch` is not cached by default.** Opt in: `'use cache'` (Cache Components) or, in the previous model, `{ cache: 'force-cache' }` / `{ next: { revalidate: 3600 } }`.",
      "`'use cache'` works on **any async function** (fetch, ORM, DB). Arguments become part of the cache key.",
      "**`cacheLife('minutes' | 'hours' | 'days' | 'max')`** sets freshness; **`cacheTag('products')`** names it for refresh.",
      "**`updateTag(tag)`** (Server Actions only) = the user sees their change now. **`revalidateTag(tag, 'max')`** = refresh in background (stale-while-revalidate).",
      "Never cache personal data in a shared cache. Read cookies outside and pass only safe values in, or use `'use cache: private'`."
    ],
    code: { file: "app/lib/products.js", lang: "js", src: `import 'server-only';
import { cacheLife, cacheTag, updateTag, revalidateTag } from 'next/cache';

// Cached read: shared by everyone, refreshed hourly
export async function getProducts(category) {
  'use cache';
  cacheLife('hours');
  cacheTag('products', \`products-\${category}\`);

  const res = await fetch(\`https://shop.example/api/products?cat=\${category}\`);
  if (!res.ok) throw new Error('Could not load products');
  return res.json();
}

// Write: called from a form (Server Action)
export async function updatePrice(formData) {
  'use server';            // check auth here too (NEXT-012)
  const id = formData.get('id');
  const price = Number(formData.get('price'));
  await fetch(\`https://shop.example/api/products/\${id}\`, {
    method: 'PATCH',
    body: JSON.stringify({ price }),
  });
  updateTag('products'); // admin sees the new price immediately
}

// From a CMS webhook (route handler): background refresh is fine
export function onCmsPublish() {
  revalidateTag('products', 'max');
}`, walk: [
      { lines: [6, 7], note: "`'use cache'` caches this function's result. Needs `cacheComponents: true` (on in new apps)." },
      { lines: [8], note: "Tags let you refresh just this data later. Several tags allowed." },
      { lines: [5, 10], note: "`category` is an argument, so 'shoes' and 'hats' get separate cache entries." },
      { lines: [24], note: "`updateTag` expires and refreshes in the same request: read-your-own-writes." },
      { lines: [28, 29], note: "`revalidateTag` needs a profile in v16. `'max'` serves stale while fetching fresh." }
    ]},
    output: "The first visit to /shop?cat=shoes calls the API; later visits reuse the cached list. After updatePrice runs, the next render shows the new price.",
    mistakes: [
      { bad: `// expecting this to be cached (old Next.js 14 habit)\nconst res = await fetch(url);`, good: `async function getData() {\n  'use cache';\n  cacheLife('hours');\n  return (await fetch(url)).json();\n}`, why: "Since Next.js 15 `fetch` isn't cached by default. Opt in explicitly so caching is visible in the code." },
      { bad: `revalidateTag('products');`, good: `revalidateTag('products', 'max');\n// or in a Server Action: updateTag('products');`, why: "In v16 the one-argument form is deprecated. Pass a cacheLife profile, or use `updateTag` for instant read-your-writes." },
      { bad: `async function getOrders() {\n  'use cache';\n  const user = (await cookies()).get('user');\n}`, good: `async function OrdersPage() {\n  const user = (await cookies()).get('user')?.value;\n  return <Orders userId={user} />; // cached fn takes userId\n}`, why: "Request APIs can't be read inside a shared `'use cache'` scope. Read them outside and pass the value in as an argument (it becomes part of the key)." }
    ],
    practice: [
      { level: "B", q: "Cache a recipe list for a day.", a: "Add `'use cache'` and `cacheLife('days')` at the top of `getRecipes()`." },
      { level: "I", q: "After adding a recipe, the list should update straight away for the author. What do you call?", a: "`updateTag('recipes')` in the Server Action (with `cacheTag('recipes')` on the read)." },
      { level: "I", q: "In an app without Cache Components, cache a fetch for 10 minutes.", a: "`fetch(url, { next: { revalidate: 600 } })`." },
      { level: "C", q: "Two components render `getUser(id)` in one request. With no `'use cache'`, how do you avoid two DB hits?", a: "Wrap it in React's `cache()`: `export const getUser = cache(async (id) => db.user.find(id))`. That dedupes within one request only." }
    ],
    quiz: [
      { q: "In Next.js 16, is a plain `fetch()` cached by default?", options: ["Yes, forever", "No, you opt in", "Only GET requests"], answer: 1, why: "Caching is explicit: `'use cache'` (or `force-cache`/`revalidate` in the previous model)." },
      { q: "A user edits their profile and must see it instantly. Use...", options: ["`revalidateTag('user', 'max')`", "`updateTag('user')` in a Server Action", "Reload the page"], answer: 1, why: "`updateTag` expires and refreshes within the same request (read-your-writes)." },
      { q: "What is part of a `'use cache'` key?", options: ["Only the function name", "The function and its arguments", "The user's cookies automatically"], answer: 1, why: "Arguments and captured values create separate entries. Cookies aren't read inside a shared cache." }
    ],
    rev: {
      sec30: "Fetch in Server Components. `fetch` isn't cached by default. With Cache Components: `'use cache'` on a function/component, `cacheLife()` for freshness, `cacheTag()` for labels. Refresh with `updateTag` (Server Action, instant) or `revalidateTag(tag, 'max')` (background), or `revalidatePath`. Previous model: `cache: 'force-cache'`, `next: { revalidate }`, `next: { tags }`. `React.cache` dedupes per request.",
      interview: [
        { level: "basic", q: "Where do you fetch data in the App Router?", a: "Mostly in Server Components with `await`. Client-side fetching (TanStack Query) is still fine for highly interactive, user-driven data." },
        { level: "intermediate", q: "What does `'use cache'` do?", a: "Caches the return value of an async function or component, keyed by its arguments, with a lifetime from `cacheLife` and labels from `cacheTag`." },
        { level: "intermediate", q: "`updateTag` vs `revalidateTag`?", a: "`updateTag` (Server Actions only) expires and refreshes immediately so the user sees their write. `revalidateTag(tag, 'max')` marks it stale and refreshes in the background." },
        { level: "advanced", q: "`React.cache` vs `'use cache'`?", a: "`React.cache` dedupes calls within one request render. `'use cache'` persists results across requests and users until revalidated." },
        { level: "tricky", q: "Why might cached data look stale after deploy?", a: "It usually won't: cache keys include the build id, so a new deploy starts fresh. Within a deploy, data stays until its cacheLife or a revalidation." }
      ],
      compare: { cols: ["", "Cache Components", "Previous model"], rows: [
        ["Opt in", "`'use cache'`", "`cache: 'force-cache'`"],
        ["Time-based", "`cacheLife('hours')`", "`next: { revalidate: 3600 }`"],
        ["Label", "`cacheTag('x')`", "`next: { tags: ['x'] }`"],
        ["Refresh", "`updateTag` / `revalidateTag(x, 'max')`", "`revalidateTag` / `revalidatePath`"]
      ]},
      cheat: [
        "`fetch` not cached by default",
        "`'use cache'` + `cacheLife()` + `cacheTag()`",
        "`updateTag(tag)`: instant, Server Actions only",
        "`revalidateTag(tag, 'max')`: background refresh",
        "`revalidatePath('/shop')`: refresh a route",
        "`React.cache()`: dedupe within one request",
        "Never put personal data in a shared cache"
      ]
    },
    related: ["NEXT-005", "NEXT-012", "API-029", "PERF-016"]
  },

  "NEXT-012": {
    tldr: "A Server Action (framework-only) is an async function marked `'use server'` that you pass to `<form action>`. The form posts to the server, the function changes data, then you refresh the cache or redirect. No API route needed.",
    analogy: { icon: "📮", text: "Dropping a filled-in order slip into the shop's post box. You don't need to know the back office address; the slip goes straight to the right desk." },
    visual: { type: "flow", title: "Submit a todo with a Server Action", steps: [
      { label: "Submit form", detail: "`<form action={addTodo}>` sends a POST with `FormData`. Works even before JS loads." },
      { label: "Run on server", detail: "`addTodo(formData)` runs on the server. Read fields with `formData.get('title')`." },
      { label: "Check & validate", detail: "Verify the user and validate input. Actions are public endpoints." },
      { label: "Save", detail: "Write to the database." },
      { label: "Refresh UI", detail: "`updateTag()` / `revalidatePath()` or `redirect()`. The page re-renders with new data." }
    ]},
    points: [
      "Mark with **`'use server'`**: at the top of a file (all exports become actions) or the top of an async function.",
      "Pass to **`<form action={fn}>`** or a `<button formAction>`; it receives **`FormData`**. Also callable from Client Components.",
      "**Progressive enhancement**: forms in Server Components submit even before JavaScript has loaded.",
      "Pair with React's **`useActionState`** for errors and pending state, or `useFormStatus` for a submit button spinner.",
      "**Security**: every action is a public POST endpoint. Always check auth and validate input inside the action itself."
    ],
    code: { file: "app/todos/actions.js + page.jsx", lang: "jsx", src: `// app/todos/actions.js
'use server';
import { updateTag } from 'next/cache';
import { db } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function addTodo(prevState, formData) {
  const user = await getUser();
  if (!user) return { error: 'Please sign in' };

  const title = String(formData.get('title') ?? '').trim();
  if (title.length < 2) return { error: 'Title is too short' };

  await db.todo.create({ data: { title, userId: user.id } });
  updateTag(\`todos-\${user.id}\`);
  return { error: null };
}

// app/todos/add-todo-form.jsx
'use client';
import { useActionState } from 'react';
import { addTodo } from './actions';

export default function AddTodoForm() {
  const [state, formAction, pending] = useActionState(addTodo, { error: null });
  return (
    <form action={formAction}>
      <input name="title" placeholder="Buy oat milk" />
      <button disabled={pending}>{pending ? 'Adding…' : 'Add'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}`, walk: [
      { lines: [2], note: "File-level `'use server'`: every export is a Server Action callable from the client." },
      { lines: [8, 9], note: "Check who is calling. Never trust that only your form can hit this." },
      { lines: [11, 12], note: "Validate `FormData` on the server; return an error object instead of throwing." },
      { lines: [14, 15], note: "Save, then `updateTag` so this user's cached list refreshes right away." },
      { lines: [25], note: "`useActionState` gives the last result, a wrapped action and a `pending` flag." },
      { lines: [27, 28, 29, 30], note: "`name=\"title\"` is the key the action reads. Button shows pending; errors render below." }
    ]},
    output: "Typing “Buy oat milk” and pressing Add shows “Adding…”, then the todo appears in the list. Submitting “a” shows “Title is too short”.",
    mistakes: [
      { bad: `export async function deleteNote(id) {\n  'use server';\n  await db.note.delete({ where: { id } });\n}`, good: `export async function deleteNote(id) {\n  'use server';\n  const user = await getUser();\n  const note = await db.note.findUnique({ where: { id } });\n  if (!user || note?.userId !== user.id) throw new Error('Forbidden');\n  await db.note.delete({ where: { id } });\n}`, why: "Anyone can POST to an action with any argument. Authenticate and authorise inside every action, not just in the UI or proxy." },
      { bad: `<form onSubmit={addTodo}>`, good: `<form action={addTodo}>`, why: "Server Actions go in `action`. `onSubmit` passes a browser event, not `FormData`, and loses progressive enhancement." }
    ],
    practice: [
      { level: "B", q: "Create an action that logs a newsletter email.", a: "`'use server'` async function reading `formData.get('email')`, used as `<form action={subscribe}>`." },
      { level: "I", q: "After creating a note, go to its page.", a: "Call `redirect(`/notes/${note.id}`)` from `next/navigation` at the end of the action (after revalidating)." },
      { level: "I", q: "Show a spinner in a reusable submit button.", a: "In a Client Component use `const { pending } = useFormStatus()` from `react-dom` inside the form.", code: `'use client';\nimport { useFormStatus } from 'react-dom';\nexport function Submit() {\n  const { pending } = useFormStatus();\n  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;\n}` },
      { level: "C", q: "Pass the todo id to a delete action without a hidden input.", a: "Use `bind`: `const del = deleteTodo.bind(null, todo.id)` then `<form action={del}>`. The id arrives as the first argument." }
    ],
    quiz: [
      { q: "What marks a function as a Server Action?", options: ["`'use client'`", "`'use server'`", "`export const action = true`", "Naming it `action`"], answer: 1, why: "`'use server'` turns an async function into a server endpoint callable from the client." },
      { q: "A form in a Server Component with `action={save}`, before JS loads...", options: ["Does nothing", "Still submits to the server", "Throws an error"], answer: 1, why: "Progressive enhancement: it's a real HTML form POST." },
      { q: "Where must you check permissions?", options: ["Only in the button's disabled state", "Only in proxy.ts", "Inside the action itself"], answer: 2, why: "Actions are public endpoints. Proxy matchers can miss them; the UI can be bypassed." }
    ],
    rev: {
      sec30: "Server Actions are async functions marked `'use server'`. Pass them to `<form action>` (they get `FormData`) or call them from Client Components. They run on the server, so you can write to the DB, then `updateTag`/`revalidatePath` or `redirect`. Forms work before JS (progressive enhancement). Use `useActionState` for results/pending. Always authenticate and validate inside each action.",
      interview: [
        { level: "basic", q: "What is a Server Action?", a: "An async server function marked `'use server'` that the client can call, usually via a form's `action`, to mutate data." },
        { level: "intermediate", q: "Server Action vs route handler?", a: "Actions are for your own UI's mutations, with form integration and cache refresh built in. Route handlers are HTTP endpoints for webhooks, mobile apps or third parties." },
        { level: "intermediate", q: "How do you show validation errors from an action?", a: "Return an object like `{ error }` and read it with `useActionState` in a Client Component." },
        { level: "advanced", q: "How does the UI update after an action?", a: "Call `updateTag`, `revalidateTag` or `revalidatePath` in the action. Next.js re-renders affected Server Components and sends the new UI in the same response." },
        { level: "tricky", q: "Is hiding the delete button enough to protect a delete action?", a: "No. The action has a reachable endpoint; anyone can call it. Check the session and ownership inside the action." }
      ],
      scenario: [
        { q: "Users double-click Save and create duplicate recipes.", a: "Disable the button while pending (`useActionState` or `useFormStatus`), and make the server side idempotent or check for duplicates." }
      ],
      cheat: [
        "`'use server'` at file or function top",
        "`<form action={fn}>` -> `fn(formData)`",
        "With `useActionState`: `fn(prevState, formData)`",
        "Refresh: `updateTag`, `revalidatePath`; or `redirect()`",
        "Works before JS loads (progressive enhancement)",
        "Auth + validate inside every action",
        "Extra args: `fn.bind(null, id)`"
      ]
    },
    related: ["ADV-017", "HOOKS-018", "NEXT-011", "NEXT-015"]
  },

  "NEXT-013": {
    tldr: "Metadata (framework-only API) is the page's title, description and share-card info in `<head>`. Export a `metadata` object for fixed text, or `generateMetadata()` when it depends on data, like a product name.",
    analogy: { icon: "🏷️", text: "The label on a jar. Before anyone opens it (clicks the link), the label says what's inside: name, short description and a photo." },
    visual: { type: "flow", title: "How a page's <head> is built", steps: [
      { label: "Root layout", detail: "Defaults: `title.template: '%s | Recipe Box'`, `metadataBase`, site description." },
      { label: "Segment layout", detail: "Optional overrides for a section, e.g. `/recipes`." },
      { label: "Page", detail: "`generateMetadata()` awaits params, fetches the recipe, returns `title` + `openGraph`." },
      { label: "Merge", detail: "Deeper values win. Title becomes “Pancakes | Recipe Box”." },
      { label: "<head> tags", detail: "`<title>`, `<meta name=\"description\">`, `og:title`, `og:image` rendered for you." }
    ]},
    points: [
      "**Static**: `export const metadata = { title, description }` in a `layout` or `page` (Server Components only).",
      "**Dynamic**: `export async function generateMetadata({ params })`; `await params`, fetch, return the object.",
      "**`title.template`** in the root layout (`'%s | Shop'`) formats every child page title.",
      "**`openGraph`** and **`twitter`** fields control link previews in chat apps and social sites; set `metadataBase` for absolute image URLs.",
      "Data fetched in `generateMetadata` and the page is shared: `fetch` is memoised, or wrap DB calls in React `cache()`."
    ],
    code: { file: "app/recipes/[slug]/page.jsx", lang: "jsx", src: `import { cache } from 'react';

const getRecipe = cache(async (slug) => {
  const res = await fetch(\`https://cms.example/recipes/\${slug}\`);
  return res.json();
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  return {
    title: recipe.title,                   // -> "Pancakes | Recipe Box"
    description: recipe.summary,
    openGraph: {
      title: recipe.title,
      description: recipe.summary,
      images: [{ url: recipe.photo, width: 1200, height: 630 }],
    },
  };
}

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);    // reused, not fetched twice
  return <h1>{recipe.title}</h1>;
}

// app/layout.jsx (root) sets the defaults:
// export const metadata = {
//   metadataBase: new URL('https://recipebox.example'),
//   title: { template: '%s | Recipe Box', default: 'Recipe Box' },
// };`, walk: [
      { lines: [3, 4, 5, 6], note: "`cache()` lets metadata and page share one result per request." },
      { lines: [8, 9, 10], note: "`generateMetadata` is async; `params` is a Promise in v16." },
      { lines: [13], note: "Only the page part; the root layout's template adds “| Recipe Box”." },
      { lines: [15, 16, 17, 18, 19], note: "Open Graph fields build the share card (title, text, 1200×630 image)." },
      { lines: [29, 30, 31, 32], note: "`metadataBase` turns relative image paths into full URLs; `default` is used when a page sets no title." }
    ]},
    output: "<title>Fluffy Pancakes | Recipe Box</title>, a meta description and og:title/og:image tags. Sharing the link in a chat shows a card with the photo.",
    mistakes: [
      { bad: `'use client';\nexport const metadata = { title: 'Cart' };`, good: `// page.jsx (Server Component)\nexport const metadata = { title: 'Cart' };\n// move interactive parts to a client child`, why: "`metadata` and `generateMetadata` only work in Server Components. Keep the page on the server." },
      { bad: `useEffect(() => { document.title = 'Cart'; }, []);`, good: `export const metadata = { title: 'Cart' };`, why: "Setting the title in an effect happens after JS runs; crawlers and share previews often miss it. Metadata is in the HTML." }
    ],
    practice: [
      { level: "B", q: "Give `/about` the title “About us” and a description.", a: "In `app/about/page.jsx`: `export const metadata = { title: 'About us', description: 'Who we are' }`." },
      { level: "I", q: "Make every page title end with “ | Playlist Pal”.", a: "Root layout: `title: { template: '%s | Playlist Pal', default: 'Playlist Pal' }`." },
      { level: "I", q: "Set the title to the product name on `/products/[id]`.", a: "Add `generateMetadata({ params })`, await params, fetch the product, return `{ title: product.name }`." },
      { level: "C", q: "Generate a share image per recipe without designing files.", a: "Add `app/recipes/[slug]/opengraph-image.jsx` that returns `new ImageResponse(<div>...</div>)` from `next/og`; Next.js wires up `og:image`." }
    ],
    quiz: [
      { q: "Which export sets metadata that depends on fetched data?", options: ["`export const metadata`", "`export async function generateMetadata()`", "`export const head`"], answer: 1, why: "`generateMetadata` can await params and data before returning the object." },
      { q: "Root layout has `title.template: '%s | Shop'`; the page sets `title: 'Cart'`. Result?", options: ["Cart", "Shop", "Cart | Shop"], answer: 2, why: "The template wraps child titles." },
      { q: "Can a Client Component export `metadata`?", options: ["Yes", "No"], answer: 1, why: "Metadata APIs are Server Component only." }
    ],
    rev: {
      sec30: "Metadata = `<head>` info (title, description, Open Graph). Static: `export const metadata`. Dynamic: `export async function generateMetadata({ params })`. Server Components only. Root layout sets `metadataBase` and `title.template`; deeper segments override. Share data between metadata and page with memoised `fetch` or `cache()`. `opengraph-image` files generate share images.",
      interview: [
        { level: "basic", q: "How do you set a page title in the App Router?", a: "Export `metadata = { title: '...' }` from the page or layout, or return it from `generateMetadata`." },
        { level: "intermediate", q: "What is Open Graph?", a: "Meta tags (`og:title`, `og:image`, ...) that chat apps and social sites read to show link preview cards." },
        { level: "intermediate", q: "Why not set `document.title` in `useEffect`?", a: "It only runs after hydration, so crawlers and link previewers may see the wrong title. Metadata is in the server HTML." },
        { level: "advanced", q: "Does `generateMetadata` double your data fetching?", a: "No if you reuse the same `fetch` (memoised) or a `cache()`-wrapped function; both calls share one result per request." },
        { level: "tricky", q: "Why set `metadataBase`?", a: "So relative URLs like `/og.png` become absolute; share-card scrapers need full URLs." }
      ],
      cheat: [
        "Static: `export const metadata = { title, description }`",
        "Dynamic: `export async function generateMetadata({ params })`",
        "Server Components only",
        "`title: { template: '%s | Site', default: 'Site' }`",
        "`openGraph: { title, images }` for share cards",
        "`metadataBase` for absolute URLs",
        "`opengraph-image.jsx` + `ImageResponse` from `next/og`"
      ]
    },
    related: ["PROD-015", "NEXT-008", "NEXT-005", "NEXT-014"]
  },

  "NEXT-014": {
    tldr: "`<Image>` from `next/image` (framework-only) is a smarter `<img>`: it resizes, converts to modern formats (WebP/AVIF), lazy-loads by default and reserves space so the page doesn't jump.",
    analogy: { icon: "🖼️", text: "A photo shop that prints your picture at the exact frame size and lighter paper for each customer, instead of handing everyone the giant original." },
    visual: { type: "flow", title: "What happens to one product photo", steps: [
      { label: "<Image src width height>", detail: "You give the size (or `fill` + `sizes`). Space is reserved: no layout shift." },
      { label: "srcset generated", detail: "The browser picks the right width for the screen and pixel density." },
      { label: "Lazy by default", detail: "Off-screen images load only as you scroll near them." },
      { label: "/_next/image", detail: "Server resizes and converts to WebP/AVIF on first request." },
      { label: "Cached", detail: "Optimised file is cached (4 hours minimum by default in v16)." }
    ]},
    points: [
      "**`src` and `alt` are required.** Give `width` + `height`, or use `fill` with a positioned parent and a `sizes` hint.",
      "**Static imports** (`import photo from './cake.jpg'`) fill in width, height and a blur placeholder automatically.",
      "Remote images must be allowed in `next.config` with **`images.remotePatterns`** (`domains` is deprecated).",
      "For the main above-the-fold image (LCP), use **`loading=\"eager\"`** or **`fetchPriority=\"high\"`**. `priority` is deprecated in v16 (now `preload`).",
      "v16 defaults: only quality **75** allowed unless you add `images.qualities`; local `src` with query strings needs `localPatterns`."
    ],
    code: { file: "app/products/page.jsx", lang: "jsx", src: `import Image from 'next/image';
import heroCake from './hero-cake.jpg'; // static import

export default function ProductsPage() {
  return (
    <main>
      {/* Above the fold: load it first */}
      <Image
        src={heroCake}
        alt="Chocolate cake with berries"
        placeholder="blur"
        loading="eager" fetchPriority="high"
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />

      {/* Remote image: width/height required, lazy by default */}
      <Image
        src="https://images.example.com/teapot.jpg"
        alt="Blue ceramic teapot"
        width={400}
        height={300}
      />
    </main>
  );
}

// next.config.js
// module.exports = {
//   images: {
//     remotePatterns: [new URL('https://images.example.com/**')],
//   },
// };`, walk: [
      { lines: [2], note: "Static import: Next.js knows the real size and can make a tiny blur preview." },
      { lines: [11, 12], note: "Blur while loading. `loading=\"eager\"` skips lazy loading; `fetchPriority=\"high\"` marks the key image." },
      { lines: [13, 14], note: "`sizes` tells the browser how wide it will display, so it picks a smaller file on phones." },
      { lines: [19, 21, 22], note: "Remote file: give the size so space is reserved. It lazy-loads when scrolled near." },
      { lines: [28, 29, 30, 31], note: "Allow-list remote hosts. Anything not listed is refused (prevents abuse of your optimiser)." }
    ]},
    output: "The hero cake shows a blurred preview then sharpens; the teapot loads as you scroll. DevTools shows WebP/AVIF files sized for your screen.",
    mistakes: [
      { bad: `<Image src="https://cdn.shop.example/mug.jpg" alt="Mug" />`, good: `<Image src="https://cdn.shop.example/mug.jpg" alt="Mug"\n  width={300} height={300} />\n// + remotePatterns for cdn.shop.example`, why: "Remote images need a size (or `fill`) and an allowed host in `remotePatterns`, otherwise Next.js throws." },
      { bad: `<Image src={hero} alt="" priority />  // v16`, good: `<Image src={hero} alt="Summer sale banner" fetchPriority="high" />`, why: "`priority` is deprecated in Next.js 16. Use `fetchPriority=\"high\"` or `loading=\"eager\"`; and write real `alt` text for content images." }
    ],
    practice: [
      { level: "B", q: "Show a local `logo.png` 120×40.", a: "`import logo from './logo.png'` then `<Image src={logo} alt=\"Recipe Box\" width={120} />` (height comes from the file ratio)." },
      { level: "I", q: "Make a cover image fill a 16:9 card.", a: "Parent `position: relative; aspect-ratio: 16/9`; `<Image fill src=... alt=... sizes=\"(max-width: 768px) 100vw, 33vw\" style={{ objectFit: 'cover' }} />`." },
      { level: "I", q: "Allow album art from `https://i.scdn.example`.", a: "`images: { remotePatterns: [new URL('https://i.scdn.example/**')] }` in `next.config`." },
      { level: "C", q: "Your designers want `quality={90}` on hero shots. What else must you change in v16?", a: "Add `images.qualities: [75, 90]`; otherwise the value is coerced to the nearest allowed quality (75)." }
    ],
    quiz: [
      { q: "Which props are always required on `next/image`?", options: ["`src` and `alt`", "`width` only", "`priority`"], answer: 0, why: "`src` and `alt` are required; size comes from props, `fill`, or a static import." },
      { q: "By default, off-screen images are...", options: ["Loaded immediately", "Lazy-loaded", "Never loaded"], answer: 1, why: "`loading=\"lazy\"` is the default." },
      { q: "How do you allow images from another domain?", options: ["`images.domains`", "`images.remotePatterns`", "Nothing needed"], answer: 1, why: "`remotePatterns` is the supported, stricter option; `domains` is deprecated." }
    ],
    rev: {
      sec30: "`next/image` resizes, serves WebP/AVIF, builds `srcset`, lazy-loads and reserves space (no CLS). Required: `src`, `alt`, and a size (`width`/`height`, `fill`, or static import). Remote hosts go in `remotePatterns`. For the LCP image use `fetchPriority=\"high\"` or `loading=\"eager\"`; `priority` is deprecated in v16. Default quality list is `[75]`.",
      interview: [
        { level: "basic", q: "Why use `next/image` over `<img>`?", a: "Automatic resizing, modern formats, lazy loading and reserved space, which improve LCP and CLS without manual work." },
        { level: "intermediate", q: "When do you use `fill`?", a: "When the image should cover a container of unknown pixel size. The parent needs `position: relative` and you should pass `sizes`." },
        { level: "intermediate", q: "What does `sizes` do?", a: "Tells the browser how wide the image will be at different breakpoints, so it downloads the smallest suitable file." },
        { level: "advanced", q: "How do you optimise the LCP hero image?", a: "Mark it `fetchPriority=\"high\"` (or `loading=\"eager\"`), give correct `sizes`, and don't lazy-load it." },
        { level: "tricky", q: "Why is `remotePatterns` a security setting?", a: "The optimiser fetches and processes URLs on your server; an allow-list stops people using it to process arbitrary images." }
      ],
      cheat: [
        "`import Image from 'next/image'`",
        "Required: `src`, `alt` + size (or `fill`/static import)",
        "Lazy by default; WebP/AVIF; srcset",
        "`fill` + `sizes` + parent `position: relative`",
        "Remote: `images.remotePatterns`",
        "LCP: `fetchPriority=\"high\"`; `priority` deprecated in v16",
        "v16: `qualities` default `[75]`"
      ]
    },
    related: ["PERF-012", "PERF-020", "NEXT-013", "NEXT-001"]
  },

  "NEXT-015": {
    tldr: "A route handler (framework-only) is an API endpoint in a `route.js` file. Export functions named after HTTP methods (`GET`, `POST`...) that take a `Request` and return a `Response`. Great for webhooks and mobile apps.",
    analogy: { icon: "🚪", text: "The shop's back door for deliveries. Customers use the front (pages); suppliers and apps knock on the back door (API) and get boxes of data, not a shop window." },
    visual: { type: "flow", title: "GET /api/playlists/7", steps: [
      { label: "Request", detail: "A mobile app calls `GET /api/playlists/7`." },
      { label: "Match route.js", detail: "Next.js finds `app/api/playlists/[id]/route.js`." },
      { label: "Run GET()", detail: "`GET(request, { params })` runs on the server; `await params` gives `{ id: '7' }`." },
      { label: "Load data", detail: "Query the DB, check auth headers, read `request.nextUrl.searchParams`." },
      { label: "Response", detail: "`return Response.json(data, { status: 200 })` back to the caller." }
    ]},
    points: [
      "File **`app/.../route.js`**. Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.",
      "Uses **web standard** `Request`/`Response` (`NextRequest`/`NextResponse` add helpers like `nextUrl` and `cookies`).",
      "Dynamic segments come as the 2nd argument: **`{ params }`**, a Promise in v16.",
      "A folder can't have both `page.jsx` and `route.js`; that's why APIs usually live under `app/api/`.",
      "For your own forms, prefer **Server Actions**. Use route handlers for webhooks, public/mobile APIs, file downloads.",
      "Like a minimal ASP.NET Core API endpoint: one function per verb, returns a typed response."
    ],
    code: { file: "app/api/playlists/[id]/route.js", lang: "js", src: `import { db } from '@/lib/db';

// GET /api/playlists/7?include=songs
export async function GET(request, { params }) {
  const { id } = await params;
  const include = request.nextUrl.searchParams.get('include');

  const playlist = await db.playlist.findUnique({
    where: { id: Number(id) },
    include: { songs: include === 'songs' },
  });

  if (!playlist) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json(playlist);
}

// PATCH /api/playlists/7   body: { "name": "Road trip" }
export async function PATCH(request, { params }) {
  const token = request.headers.get('authorization');
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const { name } = await request.json();
  if (!name) return Response.json({ error: 'Name required' }, { status: 400 });

  const updated = await db.playlist.update({ where: { id: Number(id) }, data: { name } });
  return Response.json(updated);
}`, walk: [
      { lines: [4, 5], note: "Function name = HTTP method. `params` is a Promise, as in pages." },
      { lines: [6], note: "`request.nextUrl.searchParams` reads the query string (`NextRequest` helper)." },
      { lines: [13, 14, 15, 16], note: "`Response.json(body, { status })` sets JSON content type and status code." },
      { lines: [21, 22], note: "Check credentials yourself; the endpoint is public by default." },
      { lines: [25, 26], note: "Read the JSON body with `await request.json()` and validate it before writing." }
    ]},
    output: "GET /api/playlists/7 -> 200 {\"id\":7,\"name\":\"Chill\"}. GET /api/playlists/999 -> 404 {\"error\":\"Not found\"}. PATCH without a token -> 401.",
    mistakes: [
      { bad: `app/cart/page.jsx\napp/cart/route.js`, good: `app/cart/page.jsx\napp/api/cart/route.js`, why: "A segment is either a page or an endpoint. Both in one folder conflict; keep APIs under `app/api/`." },
      { bad: `// page.jsx (Server Component)\nconst res = await fetch('http://localhost:3000/api/products');`, good: `// page.jsx\nimport { getProducts } from '@/lib/products';\nconst products = await getProducts();`, why: "Server Components already run on the server. Calling your own API adds a pointless HTTP hop and breaks at build time. Call the data function directly." }
    ],
    practice: [
      { level: "B", q: "Create `GET /api/health` returning `{ ok: true }`.", a: "`app/api/health/route.js`: `export function GET() { return Response.json({ ok: true }); }`" },
      { level: "I", q: "Add `POST /api/notes` that reads `{ text }` and returns 201.", a: "Export `POST(request)`, `const { text } = await request.json()`, save, then `Response.json(note, { status: 201 })`." },
      { level: "I", q: "Handle a payment webhook that must refresh the orders cache.", a: "In `POST`, verify the signature header, update the DB, then `revalidateTag('orders', 'max')`." },
      { level: "C", q: "Return a CSV download of the shopping list.", a: "Return `new Response(csvText, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=list.csv' } })`." }
    ],
    quiz: [
      { q: "How do you define a POST endpoint at `/api/orders`?", options: ["`app/api/orders/page.js` with `onPost`", "`app/api/orders/route.js` exporting `POST`", "`pages/api/orders.js` only"], answer: 1, why: "In the App Router, `route.js` with a function named after the method." },
      { q: "In v16, dynamic params in a route handler are...", options: ["`request.params`", "The 2nd argument `{ params }`, a Promise", "Unavailable"], answer: 1, why: "`const { id } = await params`." },
      { q: "Your own form saves a todo. Best default?", options: ["Route handler + fetch from client", "Server Action", "Proxy"], answer: 1, why: "Server Actions integrate with forms and cache refresh; route handlers suit external callers." }
    ],
    rev: {
      sec30: "Route handlers are HTTP endpoints in `route.js`: export `GET`, `POST`, etc. They take a web `Request` (or `NextRequest`) and return a `Response` (`Response.json(...)`). Dynamic params are `await`ed from the 2nd argument. Can't share a folder with `page.jsx`. Use for webhooks, public/mobile APIs and downloads; use Server Actions for your own UI's mutations. Don't fetch your own API from Server Components.",
      interview: [
        { level: "basic", q: "What is a route handler?", a: "A `route.js` file exporting HTTP-method functions that act as an API endpoint inside the Next.js app." },
        { level: "intermediate", q: "Route handler or Server Action for a newsletter form?", a: "Server Action: it's your own UI, works with `<form action>` and progressive enhancement. A route handler fits if a mobile app or third party also calls it." },
        { level: "intermediate", q: "How do you read query params and JSON body?", a: "`request.nextUrl.searchParams.get('q')` (or `new URL(request.url)`) and `await request.json()`." },
        { level: "advanced", q: "Are GET route handlers cached?", a: "Not by default for request-dependent code. With Cache Components, a GET that reads no request data can be prerendered like a page; reading the request makes it run per call." },
        { level: "tricky", q: "Why shouldn't a Server Component `fetch('/api/...')` from its own app?", a: "It's already on the server, so it adds latency, needs an absolute URL and fails during build. Import the data function instead." }
      ],
      cheat: [
        "`app/api/x/route.js` -> `/api/x`",
        "`export async function GET(request, { params })`",
        "`Response.json(data, { status })`",
        "`await request.json()`, `request.nextUrl.searchParams`",
        "No `page.jsx` and `route.js` in the same folder",
        "Webhooks / mobile / public API: route handler",
        "Own forms: Server Action"
      ]
    },
    related: ["NEXT-012", "API-002", "API-003", "NEXT-016"]
  },

  "NEXT-016": {
    tldr: "Proxy (formerly Middleware, renamed in Next.js 16, framework-only) is one `proxy.js` file that runs before a request reaches your routes. Use it to redirect, rewrite, or set headers and cookies.",
    analogy: { icon: "💂", text: "A doorman at the shop entrance. He glances at your wristband and points you to the right floor, but the cashier still checks your card before you pay." },
    visual: { type: "flow", title: "Where proxy sits", steps: [
      { label: "Request /account", detail: "Browser asks for a page (or a prefetch)." },
      { label: "Matcher check", detail: "`config.matcher` decides if proxy runs for this path." },
      { label: "proxy(request)", detail: "Reads cookies/headers. Fast checks only: no slow DB work." },
      { label: "Decide", detail: "`NextResponse.redirect()`, `.rewrite()`, `.next()` with headers, or a direct `Response`." },
      { label: "Route renders", detail: "The page or route handler runs, and still checks auth itself." }
    ]},
    points: [
      "File: **`proxy.js`** in the project root (or `src/`), next to `app/`. Export **`function proxy(request)`** and optional `config.matcher`.",
      "v16 rename: `middleware.js` + `export function middleware` are **deprecated**. Codemod: `npx @next/codemod@canary middleware-to-proxy .`",
      "Proxy runs on the **Node.js runtime** (can't be changed). Need the Edge runtime? Keep the deprecated `middleware` file for now.",
      "Without a matcher it runs on **every request**, including `_next/static` and images. Always narrow it.",
      "Good for: redirects, locale/A-B rewrites, quick “has session cookie?” checks. **Not** a full auth layer: verify in pages, actions and handlers too."
    ],
    code: { file: "proxy.js", lang: "js", src: `import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  // 1. Optimistic auth check: no cookie -> go to login
  if (pathname.startsWith('/account') && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Old URL moved
  if (pathname === '/specials') {
    return NextResponse.redirect(new URL('/deals', request.url), 308);
  }

  // 3. Let it through, tagging the request
  const response = NextResponse.next();
  response.headers.set('x-shop-region', 'eu');
  return response;
}

export const config = {
  // run for everything except API, static files and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};`, walk: [
      { lines: [3], note: "v16 naming: the exported function is `proxy` (not `middleware`)." },
      { lines: [5], note: "Read cookies from the incoming request. Only check presence; real verification happens later." },
      { lines: [8, 9, 10, 11], note: "Redirect to login and remember where the user wanted to go." },
      { lines: [20, 21, 22], note: "`NextResponse.next()` continues to the route; here we add a response header." },
      { lines: [25, 26, 27, 28], note: "Matcher keeps proxy off static assets so CSS, JS and images aren't blocked or slowed." }
    ]},
    output: "Visiting /account without a session cookie redirects to /login?next=/account. /specials permanently redirects to /deals. Other pages load with an x-shop-region header.",
    mistakes: [
      { bad: `// middleware.js (Next.js 16)\nexport function middleware(request) { ... }`, good: `// proxy.js\nexport function proxy(request) { ... }`, why: "`middleware` is deprecated in v16 and renamed to `proxy`. Keep middleware only if you specifically need the Edge runtime." },
      { bad: `// proxy.js is my only auth check\nif (!session) return NextResponse.redirect(loginUrl);`, good: `// proxy: optimistic redirect\n// plus in every Server Action / handler:\nconst user = await verifySession();\nif (!user) throw new Error('Unauthorised');`, why: "Matchers can miss paths and Server Actions post to the page URL. Proxy is a first filter; check auth again where data is read or changed." }
    ],
    practice: [
      { level: "B", q: "Redirect `/home` to `/`.", a: "`if (request.nextUrl.pathname === '/home') return NextResponse.redirect(new URL('/', request.url));`" },
      { level: "I", q: "Run proxy only for `/dashboard` and its sub-pages.", a: "`export const config = { matcher: '/dashboard/:path*' }`." },
      { level: "I", q: "Show `/fr/menu` content for French visitors visiting `/menu` without changing the URL.", a: "Read `accept-language`; if French, `return NextResponse.rewrite(new URL('/fr/menu', request.url))`." },
      { level: "C", q: "Migrate an existing `middleware.ts` to v16.", a: "Run `npx @next/codemod@canary middleware-to-proxy .` (renames file and function). Check it doesn't rely on the Edge runtime; if it does, keep middleware for now." }
    ],
    quiz: [
      { q: "In Next.js 16, Middleware was renamed to...", options: ["Gateway", "Proxy", "Interceptor", "Guard"], answer: 1, why: "`middleware.js` -> `proxy.js`, `export function proxy`." },
      { q: "What runtime does `proxy.js` use?", options: ["Edge only", "Node.js (not configurable)", "The browser"], answer: 1, why: "Proxy defaults to Node.js and setting `runtime` throws." },
      { q: "Why add a `matcher`?", options: ["It's required syntax", "To stop proxy running on every request including static files", "To enable caching"], answer: 1, why: "Without it, proxy runs for all requests, which can block or slow assets." }
    ],
    rev: {
      sec30: "Proxy (`proxy.js`, formerly `middleware.js`, renamed in v16) runs before routes. Export `proxy(request)` and a `config.matcher`. Return `NextResponse.redirect`, `.rewrite`, `.next()` (with headers/cookies) or a `Response`. Node.js runtime only; Edge users stay on deprecated middleware for now. Keep it fast, narrow the matcher, and never rely on it as the only auth check.",
      interview: [
        { level: "basic", q: "What does proxy (middleware) do in Next.js?", a: "Runs code before a request is handled, so you can redirect, rewrite or modify headers and cookies." },
        { level: "intermediate", q: "What changed with middleware in Next.js 16?", a: "The file and function were renamed to `proxy`, and proxy runs on Node.js. `middleware` still works but is deprecated." },
        { level: "intermediate", q: "Redirect vs rewrite?", a: "Redirect changes the URL in the browser (new request). Rewrite serves a different route's content while the URL stays the same." },
        { level: "advanced", q: "Why isn't proxy enough for authentication?", a: "It's an optimistic, coarse filter. Matchers can skip paths and Server Actions; real checks must happen next to the data, in actions, handlers and data functions." },
        { level: "tricky", q: "Should proxy query the database for each request?", a: "Avoid it: proxy runs on many requests and adds latency to all of them. Read a cookie or token; do the heavy check in the route." }
      ],
      compare: { cols: ["", "Next.js 15", "Next.js 16"], rows: [
        ["File", "`middleware.ts`", "`proxy.ts`"],
        ["Export", "`middleware()`", "`proxy()`"],
        ["Runtime", "Edge (default) or Node", "Node.js only"],
        ["Status", "Current", "middleware deprecated"]
      ]},
      cheat: [
        "`proxy.js` at root/src; `export function proxy(request)`",
        "`middleware` deprecated in v16 (codemod available)",
        "Node.js runtime only; Edge -> keep middleware",
        "`NextResponse.redirect / rewrite / next`",
        "Always set `config.matcher`",
        "Fast checks only; re-check auth near the data"
      ]
    },
    related: ["NEXT-015", "AUTH-006", "ROUTE-016", "NEXT-012"]
  },

  "NEXT-017": {
    tldr: "Deploy Next.js (framework-only) by pushing to Vercel, running `next build` + `next start` on any Node.js server, or shipping a Docker image with `output: 'standalone'`. A static export works on any host but loses server features.",
    analogy: { icon: "🚚", text: "Opening your bakery: rent a fully serviced unit (Vercel), run your own shop (Node server), ship a ready-made food truck (Docker), or just sell boxed cakes from a shelf (static export)." },
    visual: { type: "compare", title: "Managed platform vs self-host",
      left: { label: "Vercel (managed)", tone: "good", points: [
        "Connect Git; every push builds and deploys",
        "Preview URL for each pull request",
        "CDN, caching and image optimisation set up for you",
        "Pay per usage; less control"
      ]},
      right: { label: "Self-host (Node / Docker)", tone: "neutral", points: [
        "`next build` then `next start` (all features work)",
        "Docker: `output: 'standalone'` for a small image",
        "You run scaling, CDN, logs and the cache store",
        "Any cloud: Azure, AWS, Railway, Fly.io..."
      ]}
    },
    points: [
      "**Node.js server and Docker support every feature.** Static export (`output: 'export'`) has no Server Actions, request-time rendering, proxy or image optimiser.",
      "**`output: 'standalone'`** copies only the needed files into `.next/standalone`; run it with `node server.js`.",
      "Env vars: server values are read at runtime; **`NEXT_PUBLIC_*`** values are baked into the client bundle at **build** time.",
      "Need **Node.js 20.9+** on the build and run machines. Build once and promote the same image across staging and prod.",
      "Other platforms use **adapters** (Vercel, Bun verified; Netlify, Cloudflare offer their own integrations)."
    ],
    code: { file: "Dockerfile", lang: "bash", src: `# next.config.js must include:  output: 'standalone'
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]`, walk: [
      { lines: [1], note: "`standalone` makes `next build` output a minimal server plus only the needed `node_modules`." },
      { lines: [2, 3, 4, 5], note: "Install dependencies in their own stage so Docker can cache this layer." },
      { lines: [11], note: "`npm run build` = `next build` (Turbopack). `NEXT_PUBLIC_*` must be set by now." },
      { lines: [18, 19, 20], note: "Copy the standalone server, then static assets and `public/`; they aren't included automatically." },
      { lines: [21, 23], note: "Run as a non-root user and start the bundled `server.js`." }
    ]},
    output: "`docker build -t recipe-box .` then `docker run -p 3000:3000 recipe-box` serves the app at http://localhost:3000 with all features working.",
    mistakes: [
      { bad: `# set at container start, expecting the browser to see it\ndocker run -e NEXT_PUBLIC_API_URL=https://api.shop.example app`, good: `# pass at build time\ndocker build --build-arg NEXT_PUBLIC_API_URL=https://api.shop.example .\n# (ARG + ENV in the build stage)`, why: "`NEXT_PUBLIC_*` values are inlined into client JS during `next build`. Setting them at runtime doesn't change the bundle." },
      { bad: `// next.config.js\nmodule.exports = { output: 'export' };\n// app uses Server Actions + cookies()`, good: `// keep a server: next start, Docker or Vercel\nmodule.exports = { output: 'standalone' };`, why: "Static export only produces HTML/CSS/JS files. Features needing a server fail at build. Use it only for fully static sites." }
    ],
    practice: [
      { level: "B", q: "Deploy a Next.js repo to Vercel.", a: "Import the Git repo in Vercel, accept detected settings, add env vars, deploy. Each push redeploys; PRs get preview URLs." },
      { level: "B", q: "Run a production build locally.", a: "`npm run build` then `npm run start` and open http://localhost:3000." },
      { level: "I", q: "Make a Docker image small.", a: "Set `output: 'standalone'`, use a multi-stage Dockerfile and copy only `.next/standalone`, `.next/static` and `public`." },
      { level: "C", q: "You run 3 Docker containers behind a load balancer. What about caching?", a: "Each instance has its own in-memory cache by default. Configure a shared cache handler (e.g. Redis) so revalidation and `'use cache: remote'` work across instances." }
    ],
    quiz: [
      { q: "Which deployment supports every Next.js feature?", options: ["Static export", "Node.js server or Docker", "GitHub Pages"], answer: 1, why: "A running Next.js server is needed for actions, request-time rendering, proxy and images." },
      { q: "What does `output: 'standalone'` do?", options: ["Disables SSR", "Creates a minimal server bundle for containers", "Exports static HTML"], answer: 1, why: "It traces dependencies and emits `.next/standalone/server.js`." },
      { q: "When are `NEXT_PUBLIC_*` variables read?", options: ["At request time", "At build time", "Never"], answer: 1, why: "They're inlined into the client bundle by `next build`." }
    ],
    rev: {
      sec30: "Options: Vercel (Git push, previews, managed CDN), Node server (`next build` + `next start`), Docker (`output: 'standalone'`, run `node server.js`), static export (`output: 'export'`, no server features), or adapters. Node/Docker support everything. `NEXT_PUBLIC_*` is build-time. Node 20.9+. Multiple instances need a shared cache handler.",
      interview: [
        { level: "basic", q: "How do you run Next.js in production without Vercel?", a: "`next build` then `next start` on a Node.js 20.9+ server, typically behind a reverse proxy or in a container." },
        { level: "intermediate", q: "What is `output: 'standalone'` for?", a: "It produces a minimal folder with a `server.js` and only the required dependencies, ideal for small Docker images." },
        { level: "intermediate", q: "What do you lose with a static export?", a: "Anything that needs a server: Server Actions, request-time rendering, proxy, route handlers that read the request, and default image optimisation." },
        { level: "advanced", q: "Why build once and promote the image?", a: "Same artefact in staging and prod means what you tested is what ships. Keep server config in runtime env vars; only `NEXT_PUBLIC_*` is fixed at build." },
        { level: "tricky", q: "Why might ISR or `revalidateTag` seem broken across several containers?", a: "Each instance keeps its own cache by default. Use a shared cache handler so all instances see the same revalidations." }
      ],
      cheat: [
        "Vercel: Git push, previews, managed",
        "Self-host: `next build` + `next start` (Node 20.9+)",
        "Docker: `output: 'standalone'` -> `node server.js`",
        "Copy `.next/static` + `public` into the image",
        "Static export: `output: 'export'`, no server features",
        "`NEXT_PUBLIC_*` baked in at build",
        "Many instances -> shared cache handler"
      ]
    },
    related: ["PROD-005", "PROD-009", "PROD-002", "PROD-004"]
  },

  "NEXT-018": {
    tldr: "Use React alone (Vite + React Router) for apps behind a login with no SEO needs. Use Next.js (framework-only) when you need search-friendly pages, fast first paint, or backend code in the same project.",
    analogy: { icon: "🚲", text: "A bike (Vite SPA) is perfect for quick trips around the block. A car (Next.js) is worth it for long trips with luggage, but you need fuel, parking and a licence." },
    visual: { type: "flow", title: "Quick decision path", steps: [
      { label: "Need SEO / link previews?", detail: "Public shop, blog, recipes, docs → lean **Next.js** (HTML with content)." },
      { label: "Logged-in tool only?", detail: "Admin panel, internal dashboard, chat client → **Vite SPA** is simpler." },
      { label: "Backend already exists?", detail: "Mature ASP.NET Core API? A Vite SPA calling it keeps one backend." },
      { label: "Can you run a server?", detail: "Only static hosting allowed → Vite SPA (or Next.js static export)." },
      { label: "Team & scale", detail: "New to server/client split? Start simple; add a framework when needs appear." }
    ]},
    points: [
      "**Vite + React Router 7**: simplest mental model, static hosting, great for dashboards and tools behind auth.",
      "**Next.js**: SEO, fast LCP, Server Components, Server Actions, streaming, image optimisation. More concepts to learn.",
      "React docs recommend starting new full apps with a **framework**; a Vite SPA is still a fine choice when you don't need server features.",
      "Other options: **React Router framework mode** (SSR, loaders/actions) is a middle path.",
      "Interview tip: justify with **requirements** (SEO, data location, hosting, team), not hype."
    ],
    code: { file: "choose-stack.js", lang: "js", src: `// A tiny "decision helper" you can talk through in an interview
function chooseStack(project) {
  const reasons = [];

  if (project.needsSeo) reasons.push('public pages must be indexed');
  if (project.needsFastFirstPaint) reasons.push('LCP matters on mobile');
  if (project.wantsBackendInRepo) reasons.push('API + UI in one codebase');

  if (!project.canRunServer) {
    return { pick: 'Vite + React Router (SPA)', reasons: ['static hosting only'] };
  }
  if (reasons.length > 0) {
    return { pick: 'Next.js (App Router)', reasons };
  }
  return { pick: 'Vite + React Router (SPA)', reasons: ['behind login, no SEO'] };
}

console.log(chooseStack({ needsSeo: true, canRunServer: true }));
// { pick: 'Next.js (App Router)', reasons: ['public pages must be indexed'] }

console.log(chooseStack({ needsSeo: false, canRunServer: true }));
// { pick: 'Vite + React Router (SPA)', reasons: ['behind login, no SEO'] }`, walk: [
      { lines: [5, 6, 7], note: "Collect requirements that only a server-rendering framework satisfies well." },
      { lines: [9, 10, 11], note: "Hard constraint first: no server means no Server Components or Actions." },
      { lines: [12, 13, 14], note: "Any server-side need tips it toward Next.js." },
      { lines: [15], note: "Otherwise the simpler SPA wins: fewer moving parts." },
      { lines: [18, 21], note: "A public recipe site gets Next.js; an internal admin tool gets a Vite SPA." }
    ]},
    output: "{ pick: 'Next.js (App Router)', reasons: ['public pages must be indexed'] }\n{ pick: 'Vite + React Router (SPA)', reasons: ['behind login, no SEO'] }",
    mistakes: [
      { bad: `// "We use Next.js for everything"\n// internal admin panel, all pages 'use client'`, good: `// Admin panel behind login: Vite + React Router\n// Public storefront: Next.js`, why: "If every page is a Client Component and SEO doesn't matter, Next.js adds server cost and complexity for little benefit." },
      { bad: `// public blog as a Vite SPA, content fetched in useEffect`, good: `// Next.js: prerendered posts with metadata`, why: "Crawlers and link previews get an empty shell first. Prerendered HTML with metadata is better for discovery." }
    ],
    practice: [
      { level: "B", q: "A recipe-sharing site that should show up in Google. Pick a stack.", a: "Next.js: prerender recipe pages with metadata and Open Graph images." },
      { level: "B", q: "An internal tool for staff to manage shop orders, behind SSO. Pick a stack.", a: "Vite + React Router SPA calling the existing API; no SEO need, simple static hosting." },
      { level: "I", q: "You have a big ASP.NET Core API. Does Next.js still make sense?", a: "Yes if you need SEO/fast first paint: Server Components can call the .NET API. If not, a Vite SPA avoids running a second server." },
      { level: "C", q: "Argue for React Router framework mode instead of Next.js.", a: "Already using React Router, want SSR + loaders/actions with a smaller conceptual jump and fewer Next.js-specific caching rules." }
    ],
    quiz: [
      { q: "Best fit for a public online shop that needs SEO?", options: ["Vite SPA with useEffect fetching", "Next.js", "Plain HTML only"], answer: 1, why: "Server-rendered/prerendered HTML with metadata helps search and link previews." },
      { q: "Best fit for an internal chat client behind login, static hosting only?", options: ["Next.js with Server Actions", "Vite + React Router SPA"], answer: 1, why: "No SEO, no server: a SPA is simpler and fits the hosting." },
      { q: "What's the strongest reason to choose a stack in an interview answer?", options: ["It's trending", "Project requirements: SEO, hosting, data, team", "Fewest files"], answer: 1, why: "Interviewers want trade-offs tied to needs." }
    ],
    rev: {
      sec30: "Choose by requirements. Vite + React Router SPA: logged-in apps, no SEO, static hosting, existing backend, simplest model. Next.js: public pages needing SEO and fast first paint, server data access, Server Actions, streaming and images, at the cost of more concepts and a server. React Router framework mode is a middle option.",
      interview: [
        { level: "basic", q: "When would you use plain React (Vite) instead of Next.js?", a: "For SPAs behind a login with no SEO needs, especially when a separate backend already exists and static hosting is preferred." },
        { level: "intermediate", q: "When is Next.js clearly better?", a: "Public, content-heavy or e-commerce pages where SEO, link previews and fast first load matter, or when you want backend code in the same repo." },
        { level: "intermediate", q: "Does choosing Next.js mean no client-side data fetching?", a: "No. You can still use TanStack Query in Client Components for very interactive, user-driven data." },
        { level: "advanced", q: "What hidden costs does Next.js add?", a: "Server hosting and scaling, caching behaviour to understand, the server/client boundary, and framework upgrade work (like v16's async APIs and proxy rename)." },
        { level: "tricky", q: "Can you migrate from a Vite SPA to Next.js later?", a: "Yes, incrementally: components carry over; you move routes into `app/`, start with Client Components, then shift data fetching to the server." }
      ],
      scenario: [
        { q: "Startup wants a marketing site, a blog and a logged-in dashboard.", a: "Next.js for the whole thing works well: static marketing/blog pages plus a dashboard section of mostly Client Components. Or split: Next.js public site + Vite SPA dashboard." }
      ],
      compare: { cols: ["", "Vite + React Router", "Next.js"], rows: [
        ["Best for", "Apps behind login", "Public, SEO-heavy sites"],
        ["Hosting", "Static files", "Node server / platform"],
        ["Data", "Client fetch (TanStack Query)", "Server Components + client"],
        ["Learning curve", "Lower", "Higher (server/client, caching)"]
      ]},
      cheat: [
        "Decide by requirements, not hype",
        "SEO / link previews / fast LCP -> Next.js",
        "Behind login + static hosting -> Vite SPA",
        "Existing big API -> SPA is fine; Next.js if SEO",
        "Middle path: React Router framework mode",
        "Create React App is deprecated: never pick it"
      ]
    },
    related: ["NEXT-002", "INTRO-009", "INTRO-011", "NEXT-001"]
  }
};
