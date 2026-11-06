export default {
  "ROUTE-012": {
    tldr: "`useSearchParams` reads and writes the part of the URL after `?` (the query string). Put filters there and the page becomes shareable, bookmarkable and Back-button friendly.",
    analogy: { icon: "🔎", text: "A shop link like `/shoes?size=42&color=red`. Send it to a friend and they see the exact same filtered list, because the filters live in the address, not in your browser's memory." },
    visual: { type: "timeline", title: "Filters living in the URL", frames: [
      { label: "open page", state: "/shop", note: "No query string: `params.get('cat')` is `null`, show everything." },
      { label: "pick Fruit", state: "/shop?cat=fruit", note: "`setSearchParams({ cat: 'fruit' })` adds a history entry and re-renders." },
      { label: "sort by price", state: "/shop?cat=fruit&sort=price", note: "Functional update keeps `cat` and adds `sort`." },
      { label: "press Back", state: "/shop?cat=fruit", note: "The browser restores the previous URL, so the filter UI follows." },
      { label: "share link", state: "same URL, same list", note: "A friend opening the link gets identical filters." }
    ]},
    points: [
      "`const [params, setParams] = useSearchParams()` gives a `URLSearchParams` object and a setter.",
      "Values are **always strings or `null`**: convert with `Number()` and give defaults: `params.get('page') ?? '1'`.",
      "`setParams({ q: 'milk' })` **replaces** the whole query; use `setParams(prev => { prev.set('q', 'milk'); return prev; })` to keep the others.",
      "Each set pushes a history entry. Pass `{ replace: true }` for keystroke-by-keystroke search so Back isn't flooded.",
      "The URL is the **single source of truth**: derive the filtered list during render, don't copy params into `useState`."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useSearchParams } from 'react-router';

const ITEMS = [
  { id: 1, name: 'Apple', cat: 'fruit', price: 2 },
  { id: 2, name: 'Milk', cat: 'dairy', price: 1 },
  { id: 3, name: 'Mango', cat: 'fruit', price: 3 },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') ?? 'all';
  const q = params.get('q') ?? '';

  function update(key, value) {
    setParams(prev => {
      value ? prev.set(key, value) : prev.delete(key);
      return prev;
    }, { replace: key === 'q' });
  }

  const shown = ITEMS.filter(i =>
    (cat === 'all' || i.cat === cat) &&
    i.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <input value={q} onChange={e => update('q', e.target.value)} placeholder="Search" />
      <select value={cat} onChange={e => update('cat', e.target.value === 'all' ? '' : e.target.value)}>
        <option value="all">All</option>
        <option value="fruit">Fruit</option>
        <option value="dairy">Dairy</option>
      </select>
      <ul>{shown.map(i => <li key={i.id}>{i.name} - \${i.price}</li>)}</ul>
    </>
  );
}` , walk: [
      { lines: [10], note: "Get the current query string as `URLSearchParams` plus a setter." },
      { lines: [11, 12], note: "Read values with defaults. Missing keys return `null`, never `undefined`." },
      { lines: [14, 15, 16, 17, 18, 19], note: "Functional update keeps other params. Empty values are removed so the URL stays clean." },
      { lines: [18], note: "Typing in search **replaces** the history entry; changing the category pushes a new one." },
      { lines: [21, 22, 23, 24], note: "The list is **derived** from the URL during render. No extra state to sync." }
    ]},
    output: "Picking Fruit changes the URL to `/shop?cat=fruit` and shows Apple and Mango. Typing `man` makes it `/shop?cat=fruit&q=man` and shows only Mango.",
    mistakes: [
      { bad: `setParams({ sort: 'price' });\n// URL was ?cat=fruit`, good: `setParams(prev => {\n  prev.set('sort', 'price');\n  return prev;\n});`, why: "Passing an object replaces the whole query string, so `cat=fruit` is lost." },
      { bad: `const page = params.get('page');\nif (page === 2) { ... }`, good: `const page = Number(params.get('page') ?? 1);\nif (page === 2) { ... }`, why: "Query values are strings. `'2' === 2` is false." },
      { bad: `const [cat, setCat] = useState(params.get('cat'));`, good: `const cat = params.get('cat') ?? 'all';`, why: "Copying into state goes stale when Back/Forward changes the URL. Read it straight from params." }
    ],
    practice: [
      { level: "B", q: "Read a `?page=` param and default it to 1 as a number.", a: "`const page = Number(params.get('page') ?? 1);`" },
      { level: "B", q: "Add a **Clear filters** button.", a: "Call `setParams({})` (or `setParams(new URLSearchParams())`) to remove every param." },
      { level: "I", q: "Support multiple tags like `?tag=vegan&tag=quick`.", a: "Read with `params.getAll('tag')`; add with `prev.append('tag', t)`; remove by rebuilding the list without it." },
      { level: "C", q: "Build Next/Prev pagination that keeps the current filters.", a: "Functional update: `setParams(p => { p.set('page', String(page + 1)); return p; })`.", code: `<button onClick={() => setParams(p => {\n  p.set('page', String(page + 1));\n  return p;\n})}>Next</button>` }
    ],
    quiz: [
      { q: "URL is `/shop?cat=fruit`. What does `params.get('sort')` return?", options: ["`undefined`", "`null`", "`''`", "It throws"], answer: 1, why: "`URLSearchParams.get` returns `null` for a missing key." },
      { q: "URL is `?cat=fruit`. You call `setParams({ q: 'apple' })`. New URL?", options: ["`?cat=fruit&q=apple`", "`?q=apple`", "`?cat=fruit`"], answer: 1, why: "An object replaces the whole query. Use the functional form to merge." },
      { q: "Why put a product filter in the URL instead of `useState`?", options: ["It's faster", "Links can be shared and Back/Forward restore it", "State can't hold strings"], answer: 1, why: "The URL survives reloads, sharing and history navigation; component state doesn't." }
    ],
    rev: {
      sec30: "`useSearchParams()` returns `[URLSearchParams, setSearchParams]`. Values are strings or `null`. Setting with an object replaces the query; the functional form merges. Each set navigates (pushes history) unless `{ replace: true }`. Keep filters, search, sort and page in the URL and derive the UI from it.",
      interview: [
        { level: "basic", q: "When would you use search params instead of route params?", a: "Route params identify **which** resource (`/recipes/42`). Search params describe **how** to view it: filters, sort, page, search text. They're optional and can combine freely." },
        { level: "intermediate", q: "How do you update one param without losing the others?", a: "Use the functional setter: `setSearchParams(prev => { prev.set('sort', 'price'); return prev; })`. An object argument replaces the whole query." },
        { level: "intermediate", q: "Why not mirror search params into `useState`?", a: "You'd have two sources of truth. Back/Forward changes the URL but not your copied state, so the UI drifts. Derive values from params each render." },
        { level: "advanced", q: "A live search box fills history with every keystroke. Fix?", a: "Pass `{ replace: true }` when setting the search param so typing replaces the current entry; optionally debounce the update." },
        { level: "tricky", q: "`params.get('inStock') === true` is never true. Why?", a: "Query values are strings. Compare with `'true'` or parse: `params.get('inStock') === 'true'`." }
      ],
      predict: [
        { code: `// URL: /notes?tag=work&tag=home\nconst [p] = useSearchParams();\nconsole.log(p.get('tag'), p.getAll('tag'));`, answer: "`work ['work', 'home']`", why: "`get` returns the first value; `getAll` returns every value for that key." }
      ],
      compare: { cols: ["", "Route params", "Search params"], rows: [
        ["Example", "`/recipes/:id`", "`/recipes?diet=vegan`"],
        ["Hook", "`useParams()`", "`useSearchParams()`"],
        ["Required?", "Yes, part of the path match", "No, always optional"],
        ["Use for", "Which item", "Filters, sort, page, search"]
      ]},
      cheat: [
        "`const [params, setParams] = useSearchParams()`",
        "`params.get(k)` returns string or `null`; `getAll(k)` for repeats",
        "Object setter replaces everything; functional setter merges",
        "`setParams(next, { replace: true })` avoids history spam",
        "Convert types yourself: `Number()`, `=== 'true'`",
        "Derive UI from the URL; don't copy params into state"
      ]
    },
    related: ["ROUTE-010", "ROUTE-011", "API-025", "COND-009"]
  },

  "ROUTE-013": {
    tldr: "A dynamic route has a placeholder in its path (`/recipes/:recipeId`). One route and one component serve every detail page; the component reads the id and loads that item.",
    analogy: { icon: "🍝", text: "A recipe book's index says \"see page N\". One rule finds any recipe once you know its number; `:recipeId` is that N." },
    visual: { type: "flow", title: "From URL to detail page", steps: [
      { label: "URL", detail: "User opens `/recipes/42`." },
      { label: "Match", detail: "Router matches `path=\"/recipes/:recipeId\"` and captures `recipeId = '42'`." },
      { label: "Read", detail: "`RecipePage` calls `useParams()` and gets `{ recipeId: '42' }`." },
      { label: "Load", detail: "An effect (or loader) fetches recipe 42. Show loading meanwhile." },
      { label: "Render", detail: "Show the recipe, or a \"not found\" message if it doesn't exist." }
    ]},
    points: [
      "Define once: `<Route path=\"recipes/:recipeId\" element={<RecipePage />} />`. The `:name` segment matches anything.",
      "Params are **strings**. Convert when comparing to numeric ids: `Number(recipeId)`.",
      "Going from `/recipes/1` to `/recipes/2` **reuses the same component instance**: put the id in effect deps, or add `key={recipeId}` to reset state.",
      "Always handle **not found** and loading states; any id can be typed into the address bar.",
      "Optional segments use `?`: `path=\"/:lang?/recipes\"`. In data mode, a loader can fetch by `params.recipeId` before rendering."
    ],
    code: { file: "RecipePage.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

export default function RecipePage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    fetch(\`/api/recipes/\${recipeId}\`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => { if (!ignore) { setRecipe(data); setStatus('done'); } })
      .catch(() => { if (!ignore) setStatus('missing'); });
    return () => { ignore = true; };
  }, [recipeId]);

  if (status === 'loading') return <p>Loading…</p>;
  if (status === 'missing') return <p>No recipe #{recipeId}. <Link to="/recipes">Back</Link></p>;

  return (
    <article>
      <h1>{recipe.title}</h1>
      <p>{recipe.minutes} min</p>
      <Link to={\`/recipes/\${Number(recipeId) + 1}\`}>Next recipe →</Link>
    </article>
  );
}

// In App.jsx:
// <Route path="recipes/:recipeId" element={<RecipePage />} />`, walk: [
      { lines: [5], note: "Grab the dynamic segment. The key name matches `:recipeId` in the route path." },
      { lines: [9, 10, 11, 12], note: "Fetch whenever the id changes. The same component stays mounted between recipes." },
      { lines: [14, 15, 16], note: "The `ignore` flag drops stale responses: fast clicks, and the dev-only Strict Mode double effect run." },
      { lines: [17], note: "`recipeId` in deps: without it, clicking **Next** would keep showing the old recipe." },
      { lines: [19, 20], note: "Handle loading and not-found; users can type any id." },
      { lines: [26], note: "Params are strings: convert before doing maths." }
    ]},
    output: "`/recipes/42` shows \"Loading…\", then the recipe. Clicking **Next recipe** goes to `/recipes/43` and loads it. A missing id shows \"No recipe #999\".",
    mistakes: [
      { bad: `useEffect(() => {\n  fetch(\`/api/recipes/\${recipeId}\`)...\n}, []);`, good: `useEffect(() => {\n  fetch(\`/api/recipes/\${recipeId}\`)...\n}, [recipeId]);`, why: "The component isn't remounted when only the param changes. Empty deps means it never refetches." },
      { bad: `const recipe = recipes.find(r => r.id === recipeId);`, good: `const recipe = recipes.find(r => r.id === Number(recipeId));`, why: "`recipeId` is the string `'42'`; your ids are numbers, so nothing matches." }
    ],
    practice: [
      { level: "B", q: "Add a route for `/products/:productId` and show the id on screen.", a: "`<Route path=\"products/:productId\" element={<Product />} />` and `const { productId } = useParams();`" },
      { level: "I", q: "A comment draft on recipe 1 still shows on recipe 2. Fix it.", a: "Reset the component per id: render `<RecipePage key={recipeId} />` from a small wrapper, or reset the draft in an effect on `recipeId`." },
      { level: "I", q: "Support `/users/:userId/orders/:orderId`.", a: "`useParams()` returns both: `const { userId, orderId } = useParams();`" },
      { level: "C", q: "Move the fetch into a data-mode loader.", a: "Add `loader: ({ params }) => fetch('/api/recipes/' + params.recipeId).then(r => r.json())` to the route object (with `Component: RecipePage`) and read the data with `useLoaderData()`. See ROUTE-018." }
    ],
    quiz: [
      { q: "You navigate `/recipes/1` → `/recipes/2`. What happens to `RecipePage`?", options: ["It unmounts and remounts", "It re-renders with a new `recipeId`; state is kept", "Nothing re-renders"], answer: 1, why: "Same route, same position in the tree, so React reuses the instance." },
      { q: "`useParams().recipeId` for `/recipes/7` is:", options: ["`7`", "`'7'`", "`['7']`"], answer: 1, why: "URL params are always strings." },
      { q: "Which path matches both `/recipes` and `/fr/recipes`?", options: ["`/:lang/recipes`", "`/:lang?/recipes`", "`/*/recipes`"], answer: 1, why: "A trailing `?` makes a dynamic segment optional." }
    ],
    rev: {
      sec30: "A dynamic segment (`:recipeId`) lets one route serve every detail page. Read it with `useParams()` (always a string). Because navigating between ids reuses the component, fetch with the id in deps (or use a loader) and reset per-item state with `key`. Always handle loading and not-found.",
      interview: [
        { level: "basic", q: "What is a dynamic route?", a: "A route whose path has a placeholder like `/products/:id`. One definition matches every id and the component reads it with `useParams()`." },
        { level: "intermediate", q: "Why does my detail page show stale data after clicking to the next item?", a: "The component isn't remounted, only re-rendered. If the fetch effect doesn't list the id in its deps it never runs again." },
        { level: "intermediate", q: "How do you reset local state when the id changes?", a: "Give the component `key={id}` so React treats each id as a new instance, or reset in an effect keyed on the id." },
        { level: "advanced", q: "Effect fetch vs loader for a detail page?", a: "An effect fetches after render (waterfall, manual loading/race handling). A data-mode loader fetches during navigation, in parallel with code loading, and handles races for you." },
        { level: "tricky", q: "Can `/recipes/:id` match `/recipes/new`?", a: "Yes, unless a static `recipes/new` route exists. React Router ranks static segments above dynamic ones, so define `recipes/new` and it wins." }
      ],
      debug: [
        { code: `const { id } = useParams();\n// route: path="notes/:noteId"\nfetch(\`/api/notes/\${id}\`);`, fix: `const { noteId } = useParams();\nfetch(\`/api/notes/\${noteId}\`);`, why: "The param key must match the name in the path; `id` is `undefined` here." }
      ],
      cheat: [
        "`path=\"items/:itemId\"` + `const { itemId } = useParams()`",
        "Params are strings: `Number(itemId)`",
        "Same route, new id = re-render, not remount",
        "Put the id in effect deps; use `key={id}` to reset state",
        "Optional segment: `:lang?`",
        "Static segments beat dynamic ones: `new` beats `:id`"
      ]
    },
    related: ["ROUTE-010", "ROUTE-018", "API-006", "ROUTE-021"]
  },

  "ROUTE-014": {
    tldr: "Nested routes put child routes inside a parent route. The parent renders shared UI plus an `<Outlet />`, and the matching child appears in that hole. URLs and UI nest the same way.",
    analogy: { icon: "📒", text: "A notes app: the left panel with your notebook list never changes; clicking a note just swaps the right-hand panel. The left panel is the parent, the right panel is the `<Outlet />`." },
    visual: { type: "tree", title: "Route tree = UI tree", root: { label: "/ App", note: "renders <Outlet />", children: [
      { label: "index → Home" },
      { label: "notes → NotesLayout", note: "list + <Outlet />", children: [
        { label: "index → \"Pick a note\"" },
        { label: ":noteId → Note" },
        { label: "new → NewNote" }
      ]},
      { label: "settings → Settings" }
    ]}},
    points: [
      "Nest `<Route>`s inside a parent `<Route>`. Child paths are **relative**: `notes` + `:noteId` = `/notes/:noteId`.",
      "The parent's element must render `<Outlet />` or the children never show.",
      "An **index route** (`<Route index element={...} />`) renders in the outlet when the URL matches the parent exactly.",
      "Relative links inside a nested route: `<Link to=\"new\">` goes to `/notes/new`, `to=\"..\"` goes up one route.",
      "Pass data down to children with `<Outlet context={value} />` and read it with `useOutletContext()`."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { BrowserRouter, Routes, Route, Outlet, Link, useParams } from 'react-router';

const NOTES = [{ id: '1', text: 'Buy milk' }, { id: '2', text: 'Call mum' }];

function NotesLayout() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <nav>
        {NOTES.map(n => <p key={n.id}><Link to={n.id}>{n.text}</Link></p>)}
        <Link to="new">+ New note</Link>
      </nav>
      <main><Outlet /></main>
    </div>
  );
}

function Note() {
  const { noteId } = useParams();
  const note = NOTES.find(n => n.id === noteId);
  return <h2>{note ? note.text : 'Note not found'}</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="notes" element={<NotesLayout />}>
          <Route index element={<p>Pick a note</p>} />
          <Route path=":noteId" element={<Note />} />
          <Route path="new" element={<p>New note form</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`, walk: [
      { lines: [9, 10], note: "Relative links: `to={n.id}` resolves to `/notes/1` because we're inside the `notes` route." },
      { lines: [12], note: "The hole where the matching child route renders." },
      { lines: [27], note: "Parent route: matches `/notes` and anything under it." },
      { lines: [28], note: "Index route: shown at exactly `/notes`." },
      { lines: [29, 30], note: "Children paths are relative: `/notes/:noteId` and `/notes/new`. Static `new` beats `:noteId`." }
    ]},
    output: "At `/notes` the list shows with \"Pick a note\" on the right. Clicking \"Buy milk\" changes only the right side to \"Buy milk\" (URL `/notes/1`).",
    mistakes: [
      { bad: `function NotesLayout() {\n  return <nav>...</nav>;\n}`, good: `function NotesLayout() {\n  return <><nav>...</nav><Outlet /></>;\n}`, why: "Without `<Outlet />` the URL changes but the child never appears." },
      { bad: `<Route path="notes" element={<NotesLayout />}>\n  <Route path="/notes/:noteId" ... />`, good: `<Route path="notes" element={<NotesLayout />}>\n  <Route path=":noteId" ... />`, why: "Child paths are relative to the parent. Repeating the full path is noisy and easy to get wrong." }
    ],
    practice: [
      { level: "B", q: "Add a `/notes/archive` child route.", a: "Inside the `notes` route add `<Route path=\"archive\" element={<Archive />} />`." },
      { level: "I", q: "Share the notes array with children without prop drilling.", a: "`<Outlet context={{ notes }} />` in the layout; `const { notes } = useOutletContext();` in the child." },
      { level: "I", q: "Add a \"Back to list\" link inside `Note` without hardcoding `/notes`.", a: "`<Link to=\"..\">Back</Link>` goes up one route level." },
      { level: "C", q: "Nest three levels: `/shop/:category/:productId`, each with its own panel.", a: "`shop` → `ShopLayout` (Outlet) → `:category` → `CategoryLayout` (Outlet) → `:productId` → `Product`. Each layout renders an `<Outlet />`." }
    ],
    quiz: [
      { q: "URL is `/notes`. Which child renders in the outlet?", options: ["`:noteId`", "The index route", "Nothing"], answer: 1, why: "The index route is the default child when the URL matches the parent exactly." },
      { q: "Inside the `notes` route, `<Link to=\"new\">` goes to:", options: ["`/new`", "`/notes/new`", "`/notes/:noteId/new`"], answer: 1, why: "Links resolve relative to the route they're rendered in." },
      { q: "A parent route forgets `<Outlet />`. What happens at `/notes/1`?", options: ["Error thrown", "Only the parent UI shows", "Only the child shows"], answer: 1, why: "The route matches, but there's nowhere for the child to render." }
    ],
    rev: {
      sec30: "Nested routes mirror nested UI. A parent route renders shared UI plus `<Outlet />`; the matching child renders inside it. Child paths are relative, an `index` route is the default child, relative links (`to=\"new\"`, `to=\"..\"`) resolve against the current route, and `useOutletContext()` passes data down.",
      interview: [
        { level: "basic", q: "What does `<Outlet />` do?", a: "It marks where the matching child route renders inside the parent's element." },
        { level: "intermediate", q: "What is an index route?", a: "A child with `index` instead of a path. It renders in the parent's outlet when the URL matches the parent exactly, like a default tab." },
        { level: "intermediate", q: "How do you pass data from a parent route to its children?", a: "`<Outlet context={data} />` and `useOutletContext()` in the child. For app-wide data, Context or a loader is better." },
        { level: "advanced", q: "Why do nested routes help performance?", a: "Navigating between siblings only re-renders the outlet's subtree; the parent layout stays mounted with its state. In data mode, parent and child loaders run in parallel." },
        { level: "tricky", q: "Does a nested parent route remount when you switch between `/notes/1` and `/notes/2`?", a: "No. The parent and the `Note` element both stay mounted; only `noteId` changes." }
      ],
      cheat: [
        "Parent renders `<Outlet />`; child appears there",
        "Child paths are relative to the parent",
        "`<Route index element={...} />` = default child",
        "`to=\"new\"` relative; `to=\"..\"` up one route",
        "`<Outlet context={x} />` + `useOutletContext()`",
        "Parent stays mounted while children swap"
      ]
    },
    related: ["ROUTE-015", "ROUTE-006", "ROUTE-013", "COMM-006"]
  },

  "ROUTE-015": {
    tldr: "A layout route is a parent route that only adds shared UI (header, sidebar, footer) around its children. Leave out `path` and it wraps pages without adding anything to the URL.",
    analogy: { icon: "🖼️", text: "A picture frame in a shop window. The frame (header + footer) stays put; staff just swap the poster inside. The frame has no price tag of its own: it adds nothing to the address." },
    visual: { type: "layers", title: "One layout, many pages", items: [
      { label: "Page in <Outlet />", detail: "`/`, `/menu`, `/cart`: only this part changes when you navigate." },
      { label: "Sidebar", detail: "Category links, rendered once by the layout." },
      { label: "Header + cart badge", detail: "Stays mounted, so its state (open menu, badge animation) survives navigation." },
      { label: "Layout route (no path)", detail: "`<Route element={<ShopLayout />}>` wraps children; URL unchanged." }
    ]},
    points: [
      "A layout route = `<Route element={<Layout />}>` with **no `path`**. Its children keep their own URLs.",
      "The layout renders shared UI + `<Outlet />`. It stays **mounted** across child navigations, so its state persists.",
      "Use several layouts for different areas: a `ShopLayout` for public pages, an `AccountLayout` for the logged-in area, none for `/login`.",
      "Data mode: `{ Component: ShopLayout, children: [...] }` (no `path`). Framework mode uses `layout()` in `routes.ts` (framework-only).",
      "Difference from a nested route: a nested parent adds a URL segment (`/notes`); a layout route adds **only UI**."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { BrowserRouter, Routes, Route, Outlet, NavLink } from 'react-router';

function ShopLayout() {
  return (
    <>
      <header>
        <NavLink to="/">Home</NavLink> | <NavLink to="/menu">Menu</NavLink> |{' '}
        <NavLink to="/cart">Cart 🛒</NavLink>
      </header>
      <main><Outlet /></main>
      <footer>© Corner Café</footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopLayout />}>
          <Route index element={<h1>Welcome</h1>} />
          <Route path="menu" element={<h1>Menu</h1>} />
          <Route path="cart" element={<h1>Your cart</h1>} />
        </Route>
        <Route path="login" element={<h1>Log in (no header)</h1>} />
      </Routes>
    </BrowserRouter>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9], note: "The layout draws the shared header once." },
      { lines: [10], note: "Whatever child route matches renders here." },
      { lines: [20], note: "No `path`: this route only wraps, it doesn't change URLs." },
      { lines: [21, 22, 23], note: "Children keep their normal URLs: `/`, `/menu`, `/cart`." },
      { lines: [25], note: "Outside the layout: `/login` gets no header or footer." }
    ]},
    output: "`/`, `/menu` and `/cart` all show the same header and footer with different headings. `/login` shows only \"Log in (no header)\".",
    mistakes: [
      { bad: `function Menu() {\n  return <><Header /><h1>Menu</h1><Footer /></>;\n}\n// repeated in every page`, good: `<Route element={<ShopLayout />}>\n  <Route path="menu" element={<Menu />} />\n</Route>`, why: "Copying the header into each page remounts it on every navigation and duplicates code. A layout renders it once." },
      { bad: `<Route path="/" element={<ShopLayout />}>\n  <Route path="login" ... />`, good: `<Route element={<ShopLayout />}>...</Route>\n<Route path="login" ... />`, why: "Any page you put inside the layout gets its UI. Keep pages that shouldn't have it (login, print view) outside." }
    ],
    practice: [
      { level: "B", q: "Add an `/about` page that uses the shop header.", a: "Add `<Route path=\"about\" element={<About />} />` inside the layout route." },
      { level: "I", q: "Create an `AccountLayout` with a sidebar for `/account/orders` and `/account/profile`.", a: "`<Route path=\"account\" element={<AccountLayout />}>` with `orders` and `profile` children; the sidebar + `<Outlet />` live in `AccountLayout`." },
      { level: "I", q: "Show a cart count in the header that pages can update.", a: "Keep the count in the layout (or Context) and pass a setter via `<Outlet context={{ addToCart }} />`." },
      { level: "C", q: "Write the same routes in data mode.", a: "`createBrowserRouter([{ Component: ShopLayout, children: [{ index: true, Component: Home }, { path: 'menu', Component: Menu }] }, { path: 'login', Component: Login }])`" }
    ],
    quiz: [
      { q: "What URL does `<Route element={<ShopLayout />}>` add?", options: ["`/`", "Nothing", "`/shop-layout`"], answer: 1, why: "A route without `path` only adds UI around its children." },
      { q: "You go from `/menu` to `/cart`. What happens to `ShopLayout`?", options: ["It remounts", "It stays mounted and keeps its state", "It unmounts"], answer: 1, why: "Same layout route still matches, so React keeps the instance." },
      { q: "How do you give `/login` no header?", options: ["Hide the header with CSS on that page", "Put the login route outside the layout route", "Use two `BrowserRouter`s"], answer: 1, why: "Only children of the layout route get its UI." }
    ],
    rev: {
      sec30: "A layout route is a route with an `element` but no `path`. It renders shared UI and an `<Outlet />`, wraps its children without changing their URLs, and stays mounted while children swap. Group pages by which layout they need; keep pages like `/login` outside.",
      interview: [
        { level: "basic", q: "What is a layout route?", a: "A parent route with no `path` whose element renders shared UI plus `<Outlet />`. It groups pages under one header/sidebar." },
        { level: "intermediate", q: "Layout route vs nested route with a path?", a: "Both render an outlet. A layout route adds no URL segment; a nested parent like `path=\"account\"` adds `/account` to every child." },
        { level: "intermediate", q: "Why not just import `<Header />` in every page?", a: "It duplicates code and the header remounts on every navigation, losing its state and re-running its effects." },
        { level: "advanced", q: "How would you use layout routes for different app areas?", a: "Sibling layout routes: public `MarketingLayout`, logged-in `AppLayout` (often also an auth guard), and bare routes like `/login`. Each wraps only its pages." },
        { level: "tricky", q: "Can a layout route (no path) have its own loader or error boundary?", a: "Yes, in data mode. A pathless route can load data its header needs (e.g. the current user) and catch errors for all its children." }
      ],
      cheat: [
        "Layout route = `<Route element={<Layout />}>` with no `path`",
        "Layout renders shared UI + `<Outlet />`",
        "Adds UI, not URL segments",
        "Stays mounted across child navigations",
        "Data mode: `{ Component: Layout, children: [...] }`",
        "Keep `/login` etc. outside the layout"
      ]
    },
    related: ["ROUTE-014", "ROUTE-016", "ROUTE-008", "COMP-005"]
  },

  "ROUTE-016": {
    tldr: "A protected route checks if the user is logged in before showing a page. If not, it redirects to `/login` with `<Navigate>`. Wrap all private pages in one guard layout route.",
    analogy: { icon: "🎟️", text: "A cinema usher checks your ticket at the screen door. No ticket? You're sent to the box office. One usher guards every screen, so each film doesn't need its own check." },
    visual: { type: "flow", title: "What the guard does", steps: [
      { label: "Visit /orders", detail: "Router matches the `RequireAuth` layout, then its `orders` child." },
      { label: "Still checking?", detail: "Auth is loading (e.g. reading the session). Show a spinner, don't redirect yet." },
      { label: "Logged in?", detail: "Yes: render `<Outlet />`, so the Orders page appears." },
      { label: "Not logged in", detail: "Render `<Navigate to=\"/login\" replace />`; the URL changes to `/login`." },
      { label: "Server checks too", detail: "The API still verifies the token. The guard is UX, not security." }
    ]},
    points: [
      "Make a `RequireAuth` component: `user ? <Outlet /> : <Navigate to=\"/login\" replace />`. Use it as a **layout route** around private pages.",
      "Use `replace` so the blocked URL isn't left in history (Back won't bounce the user into the redirect again).",
      "Handle a **loading** state: while the session is being checked, render a spinner, not a redirect.",
      "Client guards only hide UI. **The server must authorize every request**; anyone can edit JS in the browser.",
      "Data mode alternative: check auth in a parent `loader` and `throw redirect('/login')` before anything renders."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { useAuth, AuthProvider } from './auth';

function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) return <p>Checking your session…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Shop home</h1>} />
          <Route path="login" element={<h1>Log in</h1>} />

          <Route element={<RequireAuth />}>
            <Route path="orders" element={<h1>My orders</h1>} />
            <Route path="wishlist" element={<h1>My wishlist</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}`, walk: [
      { lines: [2], note: "`useAuth` is your own hook over an auth Context (see the AUTH module)." },
      { lines: [7], note: "Don't decide while the session is still loading, or logged-in users get kicked out on refresh." },
      { lines: [8], note: "`<Navigate>` redirects during render. `replace` swaps the history entry." },
      { lines: [10], note: "Allowed: render whatever private child route matched." },
      { lines: [21, 22, 23, 24], note: "One guard wraps every private page. Add a page here and it's protected automatically." }
    ]},
    output: "Logged out: visiting `/orders` lands on `/login`. Logged in: `/orders` shows \"My orders\". Home and login are always public.",
    mistakes: [
      { bad: `if (!user) {\n  navigate('/login');\n}\nreturn <Outlet />;`, good: `if (!user) return <Navigate to="/login" replace />;\nreturn <Outlet />;`, why: "Calling `navigate()` during render is a side effect and still briefly renders the private page. Return `<Navigate>` instead." },
      { bad: `const { user } = useAuth();\nif (!user) return <Navigate to="/login" />;\n// user is null while loading`, good: `if (loading) return <Spinner />;\nif (!user) return <Navigate to="/login" replace />;`, why: "On refresh the user is unknown for a moment. Without a loading check, logged-in users get bounced to login." },
      { bad: `// Only hiding the page in React\n// API returns orders to anyone`, good: `// API checks the token on every request\n// React guard just improves UX`, why: "Client code can be bypassed. Real protection is on the server." }
    ],
    practice: [
      { level: "B", q: "Protect a new `/account` page.", a: "Put `<Route path=\"account\" element={<Account />} />` inside the `RequireAuth` route." },
      { level: "I", q: "Add an admin-only guard.", a: "`function RequireRole({ role }) { const { user } = useAuth(); return user?.roles.includes(role) ? <Outlet /> : <Navigate to=\"/\" replace />; }` and nest it inside `RequireAuth`." },
      { level: "I", q: "Why use `replace` on the redirect?", a: "So `/orders` isn't left in history; pressing Back from `/login` won't re-trigger the redirect loop." },
      { level: "C", q: "Write the guard as a data-mode loader.", a: "A pathless parent route with `loader: async () => { if (!(await getUser())) throw redirect('/login'); return null; }`.", code: `{\n  loader: async () => {\n    if (!(await getUser())) throw redirect('/login');\n    return null;\n  },\n  children: [{ path: 'orders', Component: Orders }],\n}` }
    ],
    quiz: [
      { q: "Best way to redirect inside a guard component's render?", options: ["`window.location.href = '/login'`", "Return `<Navigate to=\"/login\" replace />`", "Call `navigate('/login')` directly in the body"], answer: 1, why: "`<Navigate>` is the render-safe redirect. `window.location` reloads the whole app." },
      { q: "A logged-in user refreshes `/orders` and lands on `/login`. Likely cause?", options: ["Missing `replace`", "The guard redirects while auth is still loading", "Wrong route order"], answer: 1, why: "The user is `null` until the session check finishes; wait for it." },
      { q: "Does a React protected route secure your data?", options: ["Yes, users can't reach it", "No, the server must check permissions too"], answer: 1, why: "Anyone can call the API directly or change client code." }
    ],
    rev: {
      sec30: "A protected route is a guard layout route: it reads auth state, shows a loader while checking, returns `<Navigate to=\"/login\" replace />` if logged out, otherwise `<Outlet />`. One guard wraps all private pages. In data mode, a loader can `throw redirect()`. The guard is UX; the server enforces security.",
      interview: [
        { level: "basic", q: "How do you build a protected route in React Router 7?", a: "A `RequireAuth` component used as a pathless layout route: `user ? <Outlet /> : <Navigate to=\"/login\" replace />`, with private routes as its children." },
        { level: "intermediate", q: "Why `<Navigate>` instead of `useNavigate()` in the guard?", a: "`<Navigate>` is declarative and safe in render. `navigate()` is for events and effects; calling it during render is a side effect and flashes the page." },
        { level: "intermediate", q: "How do you avoid kicking logged-in users out on refresh?", a: "Track a `loading` flag while the session is restored and render a spinner until it's known." },
        { level: "advanced", q: "Component guard vs loader guard?", a: "A component guard runs after the route's code and loaders already started. A loader guard runs first and `throw redirect()` prevents loading private data or rendering at all." },
        { level: "tricky", q: "Is a protected route enough to keep admin data secret?", a: "No. The JS bundle and API are public. The server must authenticate and authorize every request; the route only controls what the UI shows." }
      ],
      cheat: [
        "Guard = pathless layout route rendering `<Outlet />` or `<Navigate>`",
        "`<Navigate to=\"/login\" replace />` in render",
        "Wait for auth `loading` before deciding",
        "Nest role guards inside the auth guard",
        "Data mode: `throw redirect('/login')` in a loader",
        "Client guard = UX; server = real security"
      ]
    },
    related: ["ROUTE-017", "ROUTE-015", "AUTH-006", "HOOKS-029"]
  },

  "ROUTE-017": {
    tldr: "Auth-based routing sends users to the right place for their login status: guests to `/login`, logged-in users away from `/login`, and after login **back to the page they wanted**.",
    analogy: { icon: "🧥", text: "A cloakroom ticket. When the shop asks you to sign in, it keeps a note of where you were heading. After you sign in, it walks you straight back there instead of to the front door." },
    visual: { type: "timeline", title: "Sending the user back", frames: [
      { label: "guest opens", state: "/orders/12", note: "Guard sees no user." },
      { label: "redirect", state: "/login  state.from = /orders/12", note: "`<Navigate to=\"/login\" state={{ from: location }} replace />`" },
      { label: "submit login", state: "user = Sam", note: "Login form reads `location.state?.from?.pathname`." },
      { label: "go back", state: "/orders/12", note: "`navigate(from, { replace: true })`; Back won't return to the login form." },
      { label: "visit /login", state: "→ /orders", note: "Guest-only guard redirects logged-in users away." }
    ]},
    points: [
      "In the guard, pass where they came from: `<Navigate to=\"/login\" state={{ from: location }} replace />`.",
      "After login: `navigate(location.state?.from?.pathname ?? '/', { replace: true })`. Always have a **fallback**.",
      "Add a **guest-only** guard for `/login` and `/register`: logged-in users get redirected to the app.",
      "Location state isn't in the URL, so it's gone in a new tab or a copied link. For durability use `?redirectTo=/orders/12`.",
      "Only redirect to **your own paths** (starting with `/`, not `//`). Never trust a full URL from the query (open redirect)."
    ],
    code: { file: "auth-routes.jsx", lang: "jsx", src: `import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from './auth';

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/orders" replace /> : <Outlet />;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/orders';

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await login(form.get('email'), form.get('password'));
    navigate(from, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button>Log in</button>
    </form>
  );
}

// <Route element={<GuestOnly />}><Route path="login" element={<LoginPage />} /></Route>
// <Route element={<RequireAuth />}><Route path="orders/*" element={<Orders />} /></Route>`, walk: [
      { lines: [6, 7], note: "Remember the blocked location in navigation state while redirecting." },
      { lines: [11, 12, 13, 14], note: "Guest-only guard: logged-in users never see the login form." },
      { lines: [20], note: "Read where they wanted to go, with a fallback for direct visits." },
      { lines: [25, 26], note: "After a successful login, go back there. `replace` drops `/login` from history." },
      { lines: [38, 39], note: "Wire it up: login inside `GuestOnly`, app pages inside `RequireAuth`." }
    ]},
    output: "Guest opens `/orders/12` → sent to `/login`. After logging in → lands on `/orders/12`. Pressing Back doesn't show the login form again.",
    mistakes: [
      { bad: `await login(email, pw);\nnavigate('/');`, good: `await login(email, pw);\nnavigate(from, { replace: true });`, why: "Dumping users on the home page loses the deep link they clicked (e.g. from an email)." },
      { bad: `const to = params.get('redirectTo');\nwindow.location.href = to;`, good: `const to = params.get('redirectTo');\nnavigate(to?.startsWith('/') && !to.startsWith('//') ? to : '/');`, why: "An attacker can send `?redirectTo=https://evil.example` (open redirect). Only allow in-app paths." }
    ],
    practice: [
      { level: "B", q: "What's the fallback if `location.state` is `null`?", a: "A sensible default page: `location.state?.from?.pathname ?? '/'`." },
      { level: "I", q: "Keep the query string too (`/orders?tab=open`).", a: "Use `from.pathname + from.search` (and `from.hash` if needed) when navigating back." },
      { level: "I", q: "Make the return path survive being opened in a new tab.", a: "Redirect to `/login?redirectTo=${encodeURIComponent(location.pathname)}` and read it with `useSearchParams()`." },
      { level: "C", q: "After logout, send users to `/login` and make Back not reopen private pages.", a: "`await logout(); navigate('/login', { replace: true });` and the guard redirects any private page they reach via history." }
    ],
    quiz: [
      { q: "Why `replace: true` when navigating after login?", options: ["It's faster", "So Back doesn't return to the login form", "It's required by `navigate`"], answer: 1, why: "Without it, history holds `/login` and Back shows the form to a logged-in user." },
      { q: "The user copies the `/login` URL into a new tab. Is `location.state.from` there?", options: ["Yes, state travels with the URL", "No, state belongs to the original tab's history entry", "Only in production"], answer: 1, why: "Location state isn't in the URL. Use a `?redirectTo=` param when it must survive copying or new tabs." },
      { q: "Safest way to handle `?redirectTo=`?", options: ["Redirect to it directly", "Allow only paths starting with a single `/`", "Base64-encode it"], answer: 1, why: "Restricting to in-app paths prevents open-redirect phishing." }
    ],
    rev: {
      sec30: "Guards redirect by auth status: guests to `/login` with `state={{ from: location }}`, logged-in users away from guest pages. After login, `navigate(from ?? '/', { replace: true })`. For shareable, new-tab-proof deep links use `?redirectTo=` and allow only in-app paths.",
      interview: [
        { level: "basic", q: "How do you return a user to their original page after login?", a: "The guard redirects with `state={{ from: location }}`; the login page reads it and calls `navigate(from.pathname, { replace: true })` after success." },
        { level: "intermediate", q: "Why should logged-in users not see `/login`?", a: "It's confusing and can create duplicate sessions. A guest-only guard redirects them to the app." },
        { level: "intermediate", q: "Location state vs `?redirectTo` query?", a: "State is hidden and per history entry but lost in new tabs or links. A query param survives copy-paste and server redirects but must be validated." },
        { level: "advanced", q: "What is an open redirect and how do you prevent it?", a: "Redirecting to a user-supplied URL lets attackers bounce victims to phishing sites via your domain. Only accept relative paths starting with one `/`." },
        { level: "tricky", q: "Why does Back after login sometimes loop between `/login` and the page?", a: "The redirects pushed entries instead of replacing them. Use `replace` both in the guard's `<Navigate>` and after login." }
      ],
      scenario: [
        { q: "A user clicks an email link to `/orders/12` while logged out. Describe the flow.", a: "Guard redirects to `/login` with `from`; user logs in; login page navigates to `/orders/12` with `replace`; Back goes to wherever they were before the email link." }
      ],
      cheat: [
        "Guard: `<Navigate to=\"/login\" state={{ from: location }} replace />`",
        "Login: `navigate(state?.from?.pathname ?? '/', { replace: true })`",
        "`GuestOnly` guard for `/login`, `/register`",
        "Shareable return path: `?redirectTo=` + `useSearchParams`",
        "Allow only `/path`, never `//` or full URLs",
        "Logout: `navigate('/login', { replace: true })`"
      ]
    },
    related: ["ROUTE-016", "ROUTE-011", "ROUTE-022", "AUTH-002"]
  },

  "ROUTE-018": {
    tldr: "In data mode, each route can have a **loader** (fetch data before the page renders) and an **action** (handle a form submit). After an action, React Router re-runs loaders so the page shows fresh data.",
    analogy: { icon: "🍽️", text: "A restaurant table that's set before you sit down (loader). When you order (action), the kitchen updates and the waiter refreshes your table (revalidation). You never wait at an empty table." },
    visual: { type: "cycle", title: "Load → submit → revalidate", steps: [
      { label: "Navigate", detail: "User opens `/todos`; the router calls the route's `loader` first." },
      { label: "Render", detail: "Page reads the result with `useLoaderData()`. No loading effect needed." },
      { label: "Submit", detail: "`<Form method=\"post\">` sends `FormData` to the route's `action`." },
      { label: "Action", detail: "Action saves (POST to API), then returns data or a `redirect()`." },
      { label: "Revalidate", detail: "Loaders on the page re-run automatically, so the list updates." }
    ]},
    points: [
      "Data mode only: `createBrowserRouter([{ path, loader, action, Component }])` + `<RouterProvider router={router} />`.",
      "`loader({ params, request })` runs **before render**, in parallel for nested routes. Read it with `useLoaderData()`.",
      "`<Form method=\"post\">` (from `react-router`) calls the route's `action({ request, params })`; read fields with `await request.formData()`.",
      "Return plain objects (v7 dropped the need for `json()`); `return redirect('/todos/5')` or `throw redirect()` to move on.",
      "`useNavigation().state` is `'loading'` / `'submitting'` for pending UI. `useFetcher()` submits without navigating (e.g. a like button)."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Form, useLoaderData, useNavigation } from 'react-router';
import { RouterProvider } from 'react-router/dom';

async function todosLoader() {
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Response('Could not load todos', { status: res.status });
  return res.json();
}

async function todosAction({ request }) {
  const form = await request.formData();
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: form.get('title') }),
  });
  return { ok: true };
}

function Todos() {
  const todos = useLoaderData();
  const navigation = useNavigation();
  const saving = navigation.state === 'submitting';

  return (
    <>
      <Form method="post">
        <input name="title" required placeholder="New todo" />
        <button disabled={saving}>{saving ? 'Adding…' : 'Add'}</button>
      </Form>
      <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>
    </>
  );
}

const router = createBrowserRouter([
  { path: '/todos', loader: todosLoader, action: todosAction, Component: Todos },
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);`, walk: [
      { lines: [3], note: "In v7 the DOM `RouterProvider` comes from `react-router/dom` (the `react-router` export also works)." },
      { lines: [5, 6, 7, 8, 9], note: "Loader runs before the page renders. Throwing sends the error to the route's error boundary." },
      { lines: [11, 12], note: "The action gets a standard `Request`; `formData()` reads the inputs by `name`." },
      { lines: [22], note: "Data is ready on first render. No `useEffect`, no loading flag, no race conditions." },
      { lines: [23, 24, 30], note: "Pending UI while the action runs." },
      { lines: [37, 38, 39], note: "Wire loader + action + component on one route object." }
    ]},
    output: "`/todos` renders with the list already loaded. Typing \"Buy bread\" and pressing **Add** shows \"Adding…\", then the list re-renders with the new todo (the loader re-ran).",
    mistakes: [
      { bad: `<form method="post">`, good: `<Form method="post">`, why: "A lowercase `<form>` does a full browser POST and reload. `Form` from `react-router` routes the submit to your action." },
      { bad: `<Route path="todos" loader={todosLoader} element={<Todos />} />\n// inside <BrowserRouter>`, good: `createBrowserRouter([\n  { path: '/todos', loader: todosLoader, Component: Todos },\n]);`, why: "Loaders and actions only run in data (or framework) mode. `BrowserRouter` ignores them." },
      { bad: `// after action\nsetTodos([...todos, newTodo]);`, good: `// after action\nreturn { ok: true }; // loaders revalidate`, why: "Don't hand-sync a copy. After an action, React Router re-runs the loaders for fresh server data." }
    ],
    practice: [
      { level: "B", q: "Write a loader for `/recipes/:id`.", a: "`loader: ({ params }) => fetch('/api/recipes/' + params.id).then(r => r.json())`, then `useLoaderData()` in the component." },
      { level: "I", q: "After creating a note, go to its page.", a: "In the action: `const note = await res.json(); return redirect('/notes/' + note.id);`" },
      { level: "I", q: "Show validation errors from the action.", a: "Return `{ errors: { title: 'Required' } }` from the action and read it with `useActionData()`." },
      { level: "C", q: "Add a ⭐ button per todo that doesn't change the URL.", a: "Use `const fetcher = useFetcher()` and `<fetcher.Form method=\"post\" action=\"/todos/5/star\">`; loaders still revalidate.", code: `const fetcher = useFetcher();\n<fetcher.Form method="post" action={\`/todos/\${t.id}/star\`}>\n  <button>⭐</button>\n</fetcher.Form>` }
    ],
    quiz: [
      { q: "When does a route loader run?", options: ["After the component mounts", "Before the route renders, during navigation", "Only on the server"], answer: 1, why: "Loaders run as part of navigation, so data is ready on first render." },
      { q: "What happens after an action finishes?", options: ["Nothing; you refetch manually", "Loaders for the current page re-run", "The page reloads"], answer: 1, why: "React Router revalidates loader data automatically after actions." },
      { q: "Which setup supports loaders?", options: ["`<BrowserRouter>` + `<Routes>`", "`createBrowserRouter` + `<RouterProvider>`", "Both"], answer: 1, why: "Loaders/actions are data-mode (and framework-mode) features." }
    ],
    rev: {
      sec30: "Data mode moves fetching and mutations into route objects. `loader` fetches before render (`useLoaderData`), `action` handles `<Form>` submits (`request.formData()`), returns data or `redirect()`, and loaders revalidate afterwards. `useNavigation` gives pending state; `useFetcher` mutates without navigating. Not available in `<BrowserRouter>`.",
      interview: [
        { level: "basic", q: "What is a route loader?", a: "A function on a route that fetches the data it needs before rendering. The component reads it with `useLoaderData()`." },
        { level: "intermediate", q: "Why loaders instead of `useEffect` fetching?", a: "No render-then-fetch waterfall: nested loaders run in parallel during navigation, data is there on first render, and races and loading states are handled by the router." },
        { level: "intermediate", q: "How does an action update the page?", a: "`<Form>` posts to the action; after it completes, React Router re-runs active loaders so the UI shows fresh data. Or the action returns `redirect()`." },
        { level: "advanced", q: "`useFetcher` vs `<Form>`?", a: "`<Form>` navigates (adds a history entry, may change URL). `useFetcher` calls loaders/actions in the background with its own `state`, ideal for likes, inline edits, search-as-you-type." },
        { level: "tricky", q: "Loaders vs TanStack Query: pick one?", a: "They can combine: the loader warms the cache with `queryClient.ensureQueryData`, components read with `useQuery` for caching, background refresh and dedupe." }
      ],
      compare: { cols: ["", "useEffect fetch", "Route loader"], rows: [
        ["When", "After render", "Before render, during navigation"],
        ["Loading state", "Manual flag", "`useNavigation()`"],
        ["Race conditions", "Manual `ignore` flag", "Handled by router"],
        ["Works in", "Any mode", "Data / framework mode"]
      ]},
      cheat: [
        "`loader({ params, request })` → `useLoaderData()`",
        "`action({ request })` + `<Form method=\"post\">`",
        "`await request.formData()` reads inputs by `name`",
        "Return plain objects; `redirect('/x')` to move on",
        "Loaders revalidate after actions",
        "`useNavigation().state`: idle / loading / submitting",
        "`useActionData()` for errors; `useFetcher()` for no-navigation"
      ]
    },
    related: ["ROUTE-005", "ROUTE-019", "API-006", "EVT-020"]
  },

  "ROUTE-019": {
    tldr: "In data mode, give a route an `ErrorBoundary` (or `errorElement`). If its loader, action or component throws, that boundary renders instead of the page, while parent layouts stay on screen.",
    analogy: { icon: "🧯", text: "One burnt dish doesn't close the restaurant. The waiter apologises at that table (route error boundary) while the rest of the room (header, menu) carries on as normal." },
    visual: { type: "flow", title: "How a route error bubbles", steps: [
      { label: "Throw", detail: "Loader for `/recipes/99` throws `data('Recipe not found', { status: 404 })`." },
      { label: "Find boundary", detail: "Router looks at the route itself, then its parents, for the nearest `ErrorBoundary`." },
      { label: "Render boundary", detail: "That route's slot shows the boundary; parent layouts above it keep rendering." },
      { label: "Read error", detail: "Boundary calls `useRouteError()`; `isRouteErrorResponse()` tells 404s from crashes." },
      { label: "Recover", detail: "Navigating to another URL clears the error automatically." }
    ]},
    points: [
      "Add `ErrorBoundary: MyError` (or `errorElement: <MyError />`) to a route object. **Data mode only**; `<BrowserRouter>` has no route error boundaries.",
      "Catches errors thrown in that route's **loader, action and rendering**. Not in event handlers (use try/catch there).",
      "Errors **bubble up** to the nearest boundary. Always put one on the root route, or users see React Router's default dev screen.",
      "Throw expected errors with a status: `throw data('Not found', { status: 404 })`. Check them with `isRouteErrorResponse(error)`.",
      "Put boundaries on detail routes so a broken recipe keeps the app header and navigation working."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter, data, isRouteErrorResponse,
  Link, Outlet, useLoaderData, useRouteError,
} from 'react-router';
import { RouterProvider } from 'react-router/dom';

async function recipeLoader({ params }) {
  const res = await fetch(\`/api/recipes/\${params.id}\`);
  if (res.status === 404) throw data('Recipe not found', { status: 404 });
  if (!res.ok) throw new Error('Kitchen is down, try later');
  return res.json();
}

function Recipe() {
  const recipe = useLoaderData();
  return <h1>{recipe.title}</h1>;
}

function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <p>{error.status}: {error.data} <Link to="/">Home</Link></p>;
  }
  return <p>Oops: {error instanceof Error ? error.message : 'Unknown error'}</p>;
}

function Root() {
  return <><header>🍳 Recipes</header><Outlet /></>;
}

const router = createBrowserRouter([
  {
    path: '/', Component: Root, ErrorBoundary: RouteError,
    children: [
      { path: 'recipes/:id', loader: recipeLoader, Component: Recipe, ErrorBoundary: RouteError },
    ],
  },
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);`, walk: [
      { lines: [10], note: "Expected problem: throw a response-like error with a status. `data` comes from `react-router`." },
      { lines: [11], note: "Unexpected problem: a normal `Error` also goes to the boundary." },
      { lines: [21, 22, 23, 24], note: "`useRouteError()` gives what was thrown; `isRouteErrorResponse` spots the 404 kind." },
      { lines: [34], note: "Root boundary: the last safety net for anything below." },
      { lines: [36], note: "Route-level boundary: the error renders inside `Root`'s outlet, so the header stays." }
    ]},
    output: "`/recipes/99` (missing) shows the 🍳 Recipes header and \"404: Recipe not found Home\". If the API is down: header + \"Oops: Kitchen is down, try later\".",
    mistakes: [
      { bad: `createBrowserRouter([\n  { path: '/', Component: Root, children: [...] },\n]);`, good: `createBrowserRouter([\n  { path: '/', Component: Root, ErrorBoundary: RootError, children: [...] },\n]);`, why: "Without any boundary, a thrown loader error shows the default developer error screen to real users." },
      { bad: `<button onClick={() => { throw new Error('x'); }}>`, good: `<button onClick={async () => {\n  try { await save(); } catch (e) { setError(e.message); }\n}}>`, why: "Error boundaries (route or React) don't catch event handler errors. Handle them yourself." },
      { bad: `const error = useRouteError();\nreturn <p>{error.message}</p>;`, good: `if (isRouteErrorResponse(error)) return <p>{error.status}</p>;\nreturn <p>{error?.message}</p>;`, why: "Thrown `data()`/`Response` errors have `status` and `data`, not `message`." }
    ],
    practice: [
      { level: "B", q: "Add a root error boundary that shows \"Something went wrong\".", a: "`{ path: '/', Component: Root, ErrorBoundary: () => <h1>Something went wrong</h1>, children: [...] }`" },
      { level: "I", q: "Show a friendly 403 page when a loader finds the user lacks access.", a: "`throw data('No access', { status: 403 })` in the loader; in the boundary check `error.status === 403`." },
      { level: "I", q: "Where do errors from an action go?", a: "To the same nearest `ErrorBoundary`. For validation errors, **return** them instead and read with `useActionData()`." },
      { level: "C", q: "In declarative mode (`<BrowserRouter>`), how do you get route-level error UI?", a: "Wrap the route element in your own React error boundary (class component or the `react-error-boundary` package)." }
    ],
    quiz: [
      { q: "A child route's loader throws. Its route has no `ErrorBoundary`, the root does. What renders?", options: ["A blank page", "The root `ErrorBoundary`", "The child component with undefined data"], answer: 1, why: "Errors bubble to the nearest ancestor boundary." },
      { q: "`throw data('Gone', { status: 404 })`. In the boundary, `isRouteErrorResponse(error)` is:", options: ["`true`", "`false`"], answer: 0, why: "`data()` (and thrown `Response`s) produce route error responses with `status` and `data`." },
      { q: "Which error is NOT caught by a route error boundary?", options: ["Loader throws", "Component throws while rendering", "`onClick` handler throws"], answer: 2, why: "Event handlers run outside React's render, so boundaries can't catch them." }
    ],
    rev: {
      sec30: "Route error boundaries (`ErrorBoundary` / `errorElement`, data mode) catch errors from a route's loader, action and render. Errors bubble to the nearest boundary, which renders in that route's place while parents keep rendering. Read with `useRouteError()`; distinguish expected `data(..., { status })` errors with `isRouteErrorResponse()`. Always add a root boundary.",
      interview: [
        { level: "basic", q: "What is `errorElement` / `ErrorBoundary` on a route?", a: "UI rendered instead of the route's component when its loader, action or render throws." },
        { level: "intermediate", q: "Why put boundaries on nested routes, not just the root?", a: "The error renders in that route's outlet, so the shared layout and navigation stay usable. A root-only boundary replaces the whole app." },
        { level: "intermediate", q: "How do you tell a 404 from a crash in the boundary?", a: "`isRouteErrorResponse(error)` is true for thrown `data()`/`Response` errors with `status`; otherwise it's a regular `Error`." },
        { level: "advanced", q: "Route error boundary vs React error boundary?", a: "React boundaries catch render errors only. Route boundaries also catch async loader/action errors and know about status codes. Both miss event handler errors." },
        { level: "tricky", q: "The error boundary itself throws. What happens?", a: "The error bubbles to the next boundary up the route tree. Keep boundaries simple and defensive." }
      ],
      cheat: [
        "Route: `ErrorBoundary: Comp` or `errorElement: <Comp />` (data mode)",
        "Catches loader, action and render errors",
        "Bubbles to nearest ancestor boundary",
        "`useRouteError()` + `isRouteErrorResponse()`",
        "Expected errors: `throw data('msg', { status })`",
        "Always add a root boundary",
        "Event handler errors: try/catch yourself"
      ]
    },
    related: ["ROUTE-018", "ROUTE-021", "ADV-004", "API-014"]
  },

  "ROUTE-020": {
    tldr: "`route.lazy` loads a route's code (component, loader, action) only when someone visits it. The first download is smaller, so the app opens faster.",
    analogy: { icon: "📦", text: "An online shop doesn't ship you the whole warehouse. It sends the item you clicked. Lazy routes send the admin page's code only to people who actually open the admin page." },
    visual: { type: "flow", title: "Visiting a lazy route", steps: [
      { label: "First load", detail: "Browser downloads `main.js` only: home, layout, router config." },
      { label: "Click Admin", detail: "Router sees `/admin` has `lazy` and calls it." },
      { label: "Fetch chunk", detail: "`import('./pages/Admin.jsx')` downloads a separate chunk Vite created." },
      { label: "Run loader", detail: "The lazy module's `loader` runs; `useNavigation().state` is `'loading'`." },
      { label: "Render", detail: "The Admin component shows. Next visit uses the cached chunk." }
    ]},
    points: [
      "Data mode: `lazy: async () => { const m = await import('./Admin.jsx'); return { Component: m.Component, loader: m.loader }; }`.",
      "Matching fields (`path`, `index`, `children`) **stay in the route config**; only the route's code and handlers are lazy.",
      "Dynamic `import()` tells Vite to split that file into its **own chunk**. Static imports of the same file undo the split.",
      "The current page stays visible while the chunk loads; show a global spinner using `useNavigation().state === 'loading'`.",
      "Declarative mode alternative: `React.lazy(() => import('./Admin'))` wrapped in `<Suspense fallback>`."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Link, Outlet, useNavigation } from 'react-router';
import { RouterProvider } from 'react-router/dom';

function Root() {
  const navigation = useNavigation();
  return (
    <>
      <nav><Link to="/">Shop</Link> | <Link to="/admin">Admin</Link></nav>
      {navigation.state === 'loading' && <p>Loading page…</p>}
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: () => <h1>Shop home</h1> },
      {
        path: 'admin',
        lazy: async () => {
          const { Component, loader } = await import('./pages/Admin.jsx');
          return { Component, loader };
        },
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);

// pages/Admin.jsx
// export async function loader() { return (await fetch('/api/orders')).json(); }
// export function Component() {
//   const orders = useLoaderData();
//   return <h1>{orders.length} orders today</h1>;
// }`, walk: [
      { lines: [6, 10], note: "While a lazy chunk (and its loader) loads, the old page stays and this message shows." },
      { lines: [21], note: "Home is in the main bundle: small and loads instantly." },
      { lines: [23], note: "`path` stays here so the router can match `/admin` without downloading anything." },
      { lines: [24, 25, 26, 27], note: "On first visit, download the Admin chunk and hand back its `Component` and `loader`." },
      { lines: [35, 36, 37, 38, 39], note: "The lazy module exports route pieces by name: `Component`, `loader` (also `action`, `ErrorBoundary`)." }
    ]},
    output: "The Network tab shows only the main bundle at first. Clicking **Admin** shows \"Loading page…\", downloads an `Admin-[hash].js` chunk, then renders \"12 orders today\".",
    mistakes: [
      { bad: `import Admin from './pages/Admin.jsx';\n// ...\n{ path: 'admin', lazy: () => import('./pages/Admin.jsx') }`, good: `// no static import of Admin anywhere\n{ path: 'admin', lazy: async () => {\n  const m = await import('./pages/Admin.jsx');\n  return { Component: m.Component };\n} }`, why: "A static import puts the file in the main bundle, so there's nothing left to split." },
      { bad: `lazy: async () => {\n  const m = await import('./Admin.jsx');\n  return { path: 'admin', Component: m.Component };\n}`, good: `{ path: 'admin', lazy: async () => {\n  const m = await import('./Admin.jsx');\n  return { Component: m.Component };\n} }`, why: "The router needs `path` before loading to match the URL. Matching fields can't be lazy." }
    ],
    practice: [
      { level: "B", q: "Make a `/reports` route lazy.", a: "`{ path: 'reports', lazy: async () => ({ Component: (await import('./pages/Reports.jsx')).Component }) }`" },
      { level: "I", q: "How do you check the split worked?", a: "Run `npm run build`: Vite lists a separate `Reports-[hash].js`. Or watch the Network tab when you first visit the page." },
      { level: "I", q: "Which routes are good candidates for lazy loading?", a: "Big, rarely visited pages: admin, settings, charts, editors. Keep the landing page and layout in the main bundle." },
      { level: "C", q: "Do the same in declarative mode.", a: "`const Admin = lazy(() => import('./pages/Admin.jsx'));` and `<Route path=\"admin\" element={<Suspense fallback={<p>Loading…</p>}><Admin /></Suspense>} />` (needs a default export)." }
    ],
    quiz: [
      { q: "Which property must stay outside `lazy`?", options: ["`Component`", "`loader`", "`path`"], answer: 2, why: "The router needs `path` to match the URL before it downloads anything." },
      { q: "When does the lazy function run?", options: ["At app start", "The first time the route matches", "On every render"], answer: 1, why: "It runs on first match; the result is cached afterwards." },
      { q: "What decides that a file becomes its own chunk?", options: ["The `lazy` keyword alone", "A dynamic `import()` the bundler can see", "File size"], answer: 1, why: "Vite (Rollup) splits at dynamic `import()` boundaries." }
    ],
    rev: {
      sec30: "`route.lazy` (data mode) returns route pieces (`Component`, `loader`, `action`, `ErrorBoundary`) from a dynamic `import()`, so Vite builds a separate chunk downloaded on first visit. Matching fields like `path` stay static. Pending UI via `useNavigation()`. In declarative mode use `React.lazy` + `Suspense`.",
      interview: [
        { level: "basic", q: "Why lazy-load routes?", a: "To shrink the initial bundle. Users download a page's code only when they visit it, so first load is faster." },
        { level: "intermediate", q: "`route.lazy` vs `React.lazy`?", a: "`React.lazy` lazy-loads a component and needs Suspense. `route.lazy` can also lazy-load the loader and action, and the router loads them before rendering, with no Suspense fallback. (v7.5+ object form `lazy: { loader, Component }` loads each piece separately.)" },
        { level: "intermediate", q: "Why can't `path` be lazy?", a: "Matching happens before any code loads. The router must know the full route tree upfront to decide which lazy routes to load." },
        { level: "advanced", q: "How do you avoid a delay on the first click?", a: "Prefetch: call the same `import()` on hover/focus of the link, or let framework mode's `<Link prefetch>` do it. The module is cached afterwards." },
        { level: "tricky", q: "You added `lazy` but the bundle didn't shrink. Why?", a: "The page is still statically imported somewhere (e.g. a barrel `index.js`), so it's already in the main chunk." }
      ],
      cheat: [
        "`lazy: async () => ({ Component, loader })` from `import()`",
        "`path`, `index`, `children` stay static",
        "Dynamic `import()` = new Vite chunk",
        "No static import of the same file anywhere",
        "Pending UI: `useNavigation().state === 'loading'`",
        "Declarative mode: `React.lazy` + `<Suspense>`"
      ]
    },
    related: ["ROUTE-018", "PERF-010", "ADV-002", "ADV-003"]
  },

  "ROUTE-021": {
    tldr: "A splat route (`path=\"*\"`) matches any URL no other route matched. Point it at a friendly **Not found** page so typos and old links don't show a blank screen.",
    analogy: { icon: "🗺️", text: "A supermarket's \"Can't find it? Ask here\" desk. Every aisle has a sign, and anyone who wanders somewhere unexpected ends up at the help desk instead of a dead end." },
    visual: { type: "tree", title: "Where `*` catches", root: { label: "/ Layout", children: [
      { label: "index → Home" },
      { label: "menu → Menu" },
      { label: "orders → OrdersLayout", children: [
        { label: ":orderId → Order" },
        { label: "* → \"No such order page\"" }
      ]},
      { label: "* → NotFound (everything else)" }
    ]}},
    points: [
      "Add `<Route path=\"*\" element={<NotFound />} />` anywhere: order doesn't matter, `*` always ranks **lowest**.",
      "Put it **inside your layout route** so the 404 page keeps the header and navigation.",
      "Nested splats give section-specific 404s: `orders/*` catches `/orders/anything/unknown`.",
      "The unmatched part is in `useParams()['*']`, e.g. to show \"No page at /piza\".",
      "Data mode: unmatched URLs also throw a 404 to the root `ErrorBoundary`. A client 404 still returns HTTP 200; real 404 status needs a server (framework mode)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router';

function Layout() {
  return (
    <>
      <header><Link to="/">🍕 Pizza Place</Link></header>
      <Outlet />
    </>
  );
}

function NotFound() {
  const { pathname } = useLocation();
  return (
    <section>
      <h1>404: page not found</h1>
      <p>Nothing lives at <code>{pathname}</code>.</p>
      <Link to="/menu">See the menu</Link>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<h1>Welcome</h1>} />
          <Route path="menu" element={<h1>Menu</h1>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`, walk: [
      { lines: [13, 17], note: "Show the URL the user tried, so they can spot the typo." },
      { lines: [18], note: "Give a way forward: a link to a real page." },
      { lines: [27], note: "Layout route wraps everything, including the 404." },
      { lines: [30], note: "The splat: matches any path the other routes didn't. Ranked last automatically." }
    ]},
    output: "`/piza` shows the 🍕 header and \"404: page not found. Nothing lives at /piza.\" with a link to the menu. `/menu` still shows Menu.",
    mistakes: [
      { bad: `<Routes>\n  <Route path="*" element={<NotFound />} />\n  <Route element={<Layout />}>...</Route>\n</Routes>`, good: `<Route element={<Layout />}>\n  ...\n  <Route path="*" element={<NotFound />} />\n</Route>`, why: "Outside the layout, the 404 page loses the header and navigation, so users feel lost." },
      { bad: `<Route path="*" element={<Navigate to="/" />} />`, good: `<Route path="*" element={<NotFound />} />`, why: "Silently redirecting hides broken links and confuses users. Tell them the page doesn't exist." }
    ],
    practice: [
      { level: "B", q: "Add a 404 route to an existing app.", a: "Inside the top layout route: `<Route path=\"*\" element={<NotFound />} />`." },
      { level: "I", q: "Show \"Order not found\" for `/orders/x/y` but the main 404 elsewhere.", a: "Add `<Route path=\"*\" element={<OrderNotFound />} />` inside the `orders` route. The deeper splat wins under `/orders`." },
      { level: "I", q: "Production refresh on `/menu` gives the host's own 404. Why?", a: "The static host has no `/menu` file. Configure an SPA fallback that serves `index.html` for unknown paths." },
      { level: "C", q: "In data mode, handle unknown URLs without a splat route.", a: "Add a root `ErrorBoundary`; unmatched URLs throw a 404 route error. Check `isRouteErrorResponse(error) && error.status === 404`." }
    ],
    quiz: [
      { q: "You put `path=\"*\"` as the **first** route. What does `/menu` show?", options: ["NotFound", "Menu", "Both"], answer: 1, why: "React Router ranks routes by specificity, not order. `*` is always last." },
      { q: "URL `/docs/old/page` with route `docs/*`. `useParams()['*']` is:", options: ["`'docs/old/page'`", "`'old/page'`", "`undefined`"], answer: 1, why: "The splat holds the part after the matched prefix." },
      { q: "What HTTP status does a client-side 404 page return?", options: ["404", "200 (the server sent `index.html`)", "500"], answer: 1, why: "The server served the SPA shell successfully; React draws the 404. A real status needs server rendering." }
    ],
    rev: {
      sec30: "`<Route path=\"*\">` is a catch-all that matches whatever nothing else did; it always ranks lowest. Put it inside the layout so the 404 keeps navigation, use nested splats for section 404s, read the rest of the URL with `params['*']`. Data mode can also handle 404s in the root `ErrorBoundary`. Client 404s are HTTP 200.",
      interview: [
        { level: "basic", q: "How do you add a 404 page in React Router?", a: "A splat route `<Route path=\"*\" element={<NotFound />} />`, usually inside the main layout." },
        { level: "intermediate", q: "Does it matter where the `*` route sits in the list?", a: "No. Routes are ranked by specificity, so the splat only matches when nothing else does. Nesting level does matter." },
        { level: "intermediate", q: "Why does refreshing a deep URL 404 on Netlify or S3?", a: "The host looks for a real file at that path. Add a rewrite that serves `index.html` for all routes so React Router can take over." },
        { level: "advanced", q: "How do you send a real 404 status for SEO?", a: "Render on the server (React Router framework mode or Next.js) and set the status there, e.g. `throw data(null, { status: 404 })` in a loader." },
        { level: "tricky", q: "`/recipes/999` shows a blank recipe, not your 404. Why?", a: "The URL **matched** `recipes/:id`; only the data is missing. Handle not-found in the detail page or throw a 404 from its loader." }
      ],
      cheat: [
        "`<Route path=\"*\" element={<NotFound />} />`",
        "Splat ranks lowest; list order doesn't matter",
        "Place inside the layout to keep the header",
        "Nested `section/*` for section 404s",
        "`useParams()['*']` = unmatched remainder",
        "Missing data on a matched route ≠ 404 route",
        "Hosts need an SPA fallback to `index.html`"
      ]
    },
    related: ["ROUTE-006", "ROUTE-019", "ROUTE-013", "ROUTE-015"]
  },

  "ROUTE-022": {
    tldr: "Programmatic navigation means moving the user from code after something happens: after login, after saving a form, after logout. Use `navigate()` in handlers, `<Navigate>` in render, and `redirect()` in loaders and actions.",
    analogy: { icon: "🧾", text: "After you pay at a checkout, the till sends you to the receipt screen by itself. You didn't click a link: the result of an action decided where you go next." },
    visual: { type: "compare", title: "Which tool, where", left: { label: "Inside components", tone: "neutral", points: [
      "`const navigate = useNavigate()`",
      "Call in event handlers or effects",
      "`navigate('/notes/7')`, `navigate(-1)`",
      "`<Navigate to=\"/login\" replace />` during render"
    ]}, right: { label: "Loaders & actions (data mode)", tone: "good", points: [
      "`return redirect('/notes/7')`",
      "`throw redirect('/login')` to stop early",
      "Runs before any UI renders",
      "No hooks needed; plain functions"
    ]}},
    points: [
      "**After login:** `navigate(from ?? '/', { replace: true })` so Back doesn't show the login form.",
      "**After submit:** go to the thing you created: `navigate('/notes/' + note.id)`. Use `replace` if the form page shouldn't stay in history.",
      "**After logout:** clear auth, then `navigate('/login', { replace: true })`.",
      "**Cancel / Back:** `navigate(-1)`. Only safe if the user came from inside your app; otherwise fall back to a fixed path.",
      "Never call `navigate()` directly in the component body. Use a handler, an effect, or `<Navigate>`."
    ],
    code: { file: "NoteEditor.jsx", lang: "jsx", src: `import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './auth';

export default function NoteEditor() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: new FormData(e.currentTarget).get('text') }),
    });
    if (!res.ok) return setSaving(false);
    const note = await res.json();
    navigate(\`/notes/\${note.id}\`, { replace: true, state: { justSaved: true } });
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <form onSubmit={handleSave}>
      <textarea name="text" required />
      <button disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      <button type="button" onClick={handleLogout}>Log out</button>
    </form>
  );
}`, walk: [
      { lines: [6], note: "Get the navigate function once, at the top level (it's a hook)." },
      { lines: [19, 20], note: "After saving, go to the new note. `replace` keeps the empty editor out of history; `state` can trigger a \"Saved!\" toast." },
      { lines: [23, 24, 25, 26], note: "Logout: clear the session first, then replace history so Back can't reopen private pages." },
      { lines: [32], note: "Cancel goes back one step, like the browser Back button." }
    ]},
    output: "Saving \"Buy milk\" lands on `/notes/42` (Back skips the editor). **Cancel** returns to the previous page. **Log out** goes to `/login`.",
    mistakes: [
      { bad: `function Page() {\n  const navigate = useNavigate();\n  if (!user) navigate('/login');\n  ...`, good: `function Page() {\n  if (!user) return <Navigate to="/login" replace />;\n  ...`, why: "Navigating during render is a side effect; React Router warns and the page flashes. Use `<Navigate>` or an effect." },
      { bad: `navigate('/login');\nawait logout();`, good: `await logout();\nnavigate('/login', { replace: true });`, why: "Navigate after the async work finishes, or a guard may see the old user and bounce them back." },
      { bad: `window.location.href = '/notes/42';`, good: `navigate('/notes/42');`, why: "`window.location` reloads the whole app and wipes in-memory state." }
    ],
    practice: [
      { level: "B", q: "After a successful checkout, go to `/orders/:id`.", a: "`navigate('/orders/' + order.id)` in the submit handler once the API responds." },
      { level: "I", q: "Make **Cancel** safe when the user opened the editor from a bookmark.", a: "`location.key === 'default'` means it's the first entry: `navigate(location.key === 'default' ? '/notes' : -1)`." },
      { level: "I", q: "Show a \"Saved!\" banner on the note page after redirect.", a: "Pass `state: { justSaved: true }` and read `useLocation().state?.justSaved` on the note page." },
      { level: "C", q: "Rewrite the save as a data-mode action.", a: "`action: async ({ request }) => { const f = await request.formData(); const note = await createNote(f.get('text')); return redirect('/notes/' + note.id); }` with `<Form method=\"post\">`." }
    ],
    quiz: [
      { q: "Where should you call `navigate()`?", options: ["Directly in the component body", "In event handlers or effects", "Inside JSX"], answer: 1, why: "It's a side effect. In render, use `<Navigate>` instead." },
      { q: "After logout, why `replace: true`?", options: ["It's faster", "So Back doesn't land on a private page entry", "It clears cookies"], answer: 1, why: "Replacing the current entry avoids returning to the page you were on as a logged-in user." },
      { q: "In a data-mode action, how do you send the user to the new item?", options: ["`useNavigate()`", "`return redirect('/notes/7')`", "`window.location.assign`"], answer: 1, why: "Actions aren't components, so hooks don't work. `redirect()` returns a redirect response." }
    ],
    rev: {
      sec30: "Move users from code with `navigate(to, { replace, state })` in handlers/effects, `<Navigate>` during render, and `redirect()` in loaders/actions. Use `replace` after login, logout and create-forms so Back behaves. `navigate(-1)` for Cancel with a fallback. Finish async work before navigating; never `window.location` for in-app moves.",
      interview: [
        { level: "basic", q: "How do you redirect after a form submit?", a: "Call `navigate('/items/' + id)` in the submit handler after the request succeeds, or return `redirect()` from a data-mode action." },
        { level: "intermediate", q: "When should you use `replace: true`?", a: "When the current page shouldn't be reachable with Back: login forms, logout, a create form after saving, redirects from guards." },
        { level: "intermediate", q: "`navigate()` vs `<Navigate>` vs `redirect()`?", a: "`navigate()` for events/effects in components, `<Navigate>` to redirect while rendering, `redirect()` in loaders/actions before anything renders." },
        { level: "advanced", q: "What's risky about `navigate(-1)`?", a: "If the user arrived via a bookmark or new tab, Back leaves your site. Check `location.key === 'default'` and fall back to a known path." },
        { level: "tricky", q: "A `navigate('/home')` in `useEffect` runs twice in dev. Bug?", a: "Strict Mode runs effects twice in development only. Navigating to the same place twice is harmless; production runs it once." }
      ],
      compare: { cols: ["", "After login", "After create", "After logout"], rows: [
        ["Where to", "`from` or `/`", "`/notes/:id`", "`/login`"],
        ["replace?", "Yes", "Usually", "Yes"],
        ["Data mode", "`redirect()` in action", "`redirect()` in action", "`redirect()` in action"]
      ]},
      cheat: [
        "`navigate(to, { replace, state })` in handlers/effects",
        "`<Navigate to replace />` during render",
        "`redirect()` in loaders/actions",
        "`replace` after login, logout, create",
        "`navigate(-1)` = Back; add a fallback",
        "Await the async work, then navigate",
        "No `window.location` for in-app moves"
      ]
    },
    related: ["ROUTE-009", "ROUTE-017", "ROUTE-018", "AUTH-009"]
  },
};
