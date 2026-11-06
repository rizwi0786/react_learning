export default {
  "ENV-001": {
    tldr: "Node.js runs JavaScript outside the browser. React tools (Vite, npm, linters) are Node programs, so install the **LTS** (long-term support) release and check `node -v` and `npm -v`.",
    analogy: { icon: "🍳", text: "Node is the kitchen stove. You don't serve the stove to diners, but you can't cook (build) the meal without it. npm comes in the box like a set of pans." },
    visual: { type: "flow", title: "From download to a working toolchain", steps: [
      { label: "Pick LTS", detail: "On nodejs.org choose the **LTS** version (even numbers like 24 or 26), not \"Current\"." },
      { label: "Install", detail: "Run the installer, or use a version manager (`nvm`, `fnm`) to switch versions per project." },
      { label: "Open a new terminal", detail: "A fresh terminal picks up the new `PATH` so `node` is found." },
      { label: "Verify", detail: "`node -v` prints e.g. `v24.x`; `npm -v` prints the npm version that ships with it." },
      { label: "Ready", detail: "You can now run `npm create vite@latest` and other dev tools." }
    ]},
    points: [
      "React code runs in the **browser**; Node runs the **tools** that build and serve it on your machine.",
      "Choose **LTS** (long-term support): stable and patched for years. \"Current\" is for trying new features.",
      "Vite 8 needs Node **20.19+ or 22.12+**; an old Node gives confusing install or start errors.",
      "**npm** (the package manager) is installed with Node. `npx` comes too.",
      "A version manager (`nvm`, `nvm-windows`, `fnm`) lets each project use the Node version it expects."
    ],
    code: { file: "terminal", lang: "bash", src: `# 1. Check what you have
node -v
npm -v

# 2. (optional) install/switch with a version manager
nvm install --lts
nvm use --lts

# 3. Quick sanity check: run JavaScript with Node
node -e "console.log('Hello from Node', process.version)"`, walk: [
      { lines: [2, 3], note: "Both commands must print a version. \"not recognized\" means Node isn't installed or the terminal needs reopening." },
      { lines: [6, 7], note: "With `nvm` you install the latest LTS and switch to it; handy when projects need different versions." },
      { lines: [10], note: "`node -e` runs a line of JS outside the browser: proof Node itself works." }
    ]},
    output: "v24.11.0\n11.6.2\nHello from Node v24.11.0  (your numbers will differ)",
    mistakes: [
      { bad: `# installed years ago, never updated\nnode -v  # v14.x\nnpm create vite@latest`, good: `nvm install --lts\nnode -v  # v22+ / v24+\nnpm create vite@latest`, why: "Modern tools drop old Node versions. Check the version first when a fresh install fails with odd syntax errors." },
      { bad: `# installed Node, same terminal still open\nnode -v  # 'node' is not recognized`, good: `# close and reopen the terminal (or VS Code)\nnode -v`, why: "The installer updates `PATH`, but already-open terminals keep the old one." }
    ],
    practice: [
      { level: "B", q: "Print your Node and npm versions.", a: "`node -v` and `npm -v` in a terminal." },
      { level: "B", q: "Is your Node version an LTS release?", a: "Even major numbers (22, 24, 26) become LTS. Compare with the LTS shown on nodejs.org." },
      { level: "I", q: "Run a one-line Node script that prints today's date.", a: "Use `node -e` with `new Date()`.", code: `node -e "console.log(new Date().toDateString())"` },
      { level: "C", q: "How can a project tell teammates which Node version to use?", a: "Add a `.nvmrc` file (e.g. `24`) and/or `\"engines\": { \"node\": \">=22\" }` in package.json." }
    ],
    quiz: [
      { q: "Why does a React developer need Node.js?", options: ["React components run on Node in the browser", "Build tools like Vite and npm are Node programs", "Browsers can't run JavaScript without it"], answer: 1, why: "The browser runs your app; Node runs the tooling on your computer." },
      { q: "Which release should you install for everyday work?", options: ["Current", "LTS", "Nightly"], answer: 1, why: "LTS gets long-term fixes and is what tools target." },
      { q: "`npm` must be installed separately from Node.", options: ["True", "False"], answer: 1, why: "npm ships with the Node installer." }
    ],
    rev: {
      sec30: "Node.js is a JavaScript runtime outside the browser. React apps don't need Node in production (for a plain SPA), but the toolchain (npm, Vite, ESLint, tests) does. Install the LTS release, verify with `node -v` / `npm -v`, and pin a version per project with `.nvmrc` or `engines`.",
      interview: [
        { level: "basic", q: "What is Node.js?", a: "A JavaScript runtime built on Chrome's V8 engine that runs JS outside the browser, with access to files, network and processes." },
        { level: "basic", q: "Does a deployed Vite React app need Node on the server?", a: "No. A client-rendered build is static files; any static host serves them. Node is needed only for SSR frameworks or your own API." },
        { level: "intermediate", q: "LTS vs Current?", a: "LTS is stable with long-term security fixes; Current has the newest features and a short support window. Use LTS for real projects." },
        { level: "intermediate", q: "How do you keep a team on the same Node version?", a: "A `.nvmrc` (or `.node-version`) file plus an `engines` field in package.json, and the same version in CI." },
        { level: "tricky", q: "A teammate's `npm install` works but yours fails with a syntax error in a dependency. First check?", a: "`node -v`. Packages often require a newer Node; an old runtime can't parse their code." }
      ],
      cheat: [
        "Node = JS runtime outside the browser (V8 engine)",
        "Install **LTS**; verify with `node -v` and `npm -v`",
        "npm and npx ship with Node",
        "Vite 8 needs Node 20.19+ / 22.12+",
        "Reopen the terminal after installing",
        "Pin versions: `.nvmrc` + `engines` in package.json"
      ]
    },
    related: ["ENV-002", "ENV-003", "WEB-040"]
  },

  "ENV-002": {
    tldr: "npm (Node package manager) downloads code other people published (packages) from the **npm registry** into your project. `npm install` adds packages; `npx` runs a package's command without installing it globally.",
    analogy: { icon: "🛍️", text: "The registry is a giant online shop of free ingredients. `npm install` puts them in your pantry (node_modules); `npx` borrows a tool just for one recipe." },
    visual: { type: "flow", title: "What `npm install zustand` does", steps: [
      { label: "Ask the registry", detail: "npm looks up `zustand` on registry.npmjs.org and picks a version." },
      { label: "Resolve deps", detail: "It works out every package that `zustand` itself needs (the dependency tree)." },
      { label: "Download", detail: "Packages land in `node_modules/` (from cache if already downloaded)." },
      { label: "Record", detail: "Adds `\"zustand\": \"^5.x\"` to package.json and exact versions to package-lock.json." }
    ]},
    points: [
      "`npm install` (or `npm i`) with no name installs **everything** listed in package.json.",
      "`npm i <pkg>` adds a runtime dependency; `npm i -D <pkg>` adds a **dev-only** one (tests, linters).",
      "`npm uninstall <pkg>` removes it from node_modules and package.json.",
      "`npx <cmd>` runs a package's command, downloading it temporarily if needed. `npm create vite` = `npx create-vite`.",
      "Avoid global installs (`-g`) for project tools; local versions keep every teammate in sync.",
      "Like **NuGet** for .NET: package.json ≈ the `.csproj` package references."
    ],
    code: { file: "terminal", lang: "bash", src: `# install everything in package.json
npm install

# add a runtime dependency (shipped to users)
npm install react-router

# add a dev-only dependency (tools)
npm install -D vitest

# remove one
npm uninstall vitest

# run a tool without installing it globally
npx prettier --check src

# see what's installed / outdated
npm ls --depth=0
npm outdated`, walk: [
      { lines: [2], note: "Fresh clone? This rebuilds `node_modules` from package.json + lock file." },
      { lines: [5], note: "Goes into `dependencies`: code your app imports at runtime." },
      { lines: [8], note: "`-D` = `--save-dev`: goes into `devDependencies`, only needed while developing." },
      { lines: [14], note: "`npx` uses the local copy in node_modules/.bin, or fetches one temporarily." },
      { lines: [17, 18], note: "Top-level installed packages, and which ones have newer versions." }
    ]},
    mistakes: [
      { bad: `npm install -g vite\nvite`, good: `npm install -D vite\nnpm run dev`, why: "A global tool is a different version on every machine. Keep it local in devDependencies and run it through scripts." },
      { bad: `npm install vitest   # test runner`, good: `npm install -D vitest`, why: "Tools only used while developing belong in devDependencies, so the intent is clear." }
    ],
    practice: [
      { level: "B", q: "Add `date-fns` to a project. Where does it appear?", a: "`npm i date-fns`: in `dependencies` in package.json, with exact versions in package-lock.json." },
      { level: "B", q: "Add ESLint as a dev dependency.", a: "`npm i -D eslint`" },
      { level: "I", q: "Run `cowsay` once without installing it.", a: "`npx cowsay hello` downloads it temporarily and runs it." },
      { level: "C", q: "What's the difference between `npm create vite@latest` and `npx create-vite@latest`?", a: "None in effect: `npm create <name>` runs the `create-<name>` package via npx." }
    ],
    quiz: [
      { q: "Where are packages downloaded from by default?", options: ["GitHub", "The npm registry", "nodejs.org"], answer: 1, why: "npm fetches from registry.npmjs.org unless configured otherwise." },
      { q: "Which command adds a test library as a dev dependency?", options: ["npm install vitest", "npm install -D vitest", "npx vitest --save"], answer: 1, why: "`-D` saves it under devDependencies." },
      { q: "What does `npx` do?", options: ["Installs a package globally", "Runs a package's command, installing temporarily if needed", "Publishes a package"], answer: 1, why: "It executes binaries without a permanent global install." }
    ],
    rev: {
      sec30: "npm is Node's package manager and the public registry of JS packages. `npm install` reads package.json; `npm i pkg` / `npm i -D pkg` add runtime / dev dependencies; `npx` runs package binaries without global installs. pnpm and Yarn are alternatives with the same idea.",
      interview: [
        { level: "basic", q: "What is npm?", a: "Node's package manager: a CLI plus the public registry. It installs packages into node_modules and records them in package.json." },
        { level: "basic", q: "npm vs npx?", a: "npm installs and manages packages; npx executes a package's binary, using the local copy or a temporary download." },
        { level: "intermediate", q: "When would you use `-D`?", a: "For tools only used during development or build: Vite, ESLint, Prettier, Vitest, TypeScript." },
        { level: "intermediate", q: "Name alternatives to npm.", a: "pnpm (fast, disk-efficient via a shared store) and Yarn. They use the same registry and package.json." },
        { level: "tricky", q: "Why prefer local tools over `npm install -g`?", a: "Global versions differ per machine and aren't recorded in package.json; local ones are pinned by the lock file so everyone runs the same version." }
      ],
      compare: { cols: ["", "npm install", "npx"], rows: [
        ["Purpose", "Add packages to the project", "Run a package's command"],
        ["Saves to package.json", "Yes", "No"],
        ["Typical use", "`npm i react-router`", "`npx prettier --check .`"]
      ]},
      cheat: [
        "`npm i` installs everything from package.json",
        "`npm i pkg` → dependencies; `npm i -D pkg` → devDependencies",
        "`npm uninstall pkg` removes it",
        "`npx cmd` runs a package binary without global install",
        "`npm create vite` = `npx create-vite`",
        "`npm outdated` lists packages with newer versions"
      ]
    },
    related: ["ENV-005", "ENV-006", "WEB-040"]
  },

  "ENV-003": {
    tldr: "`npm create vite@latest` scaffolds a ready-to-run React project in seconds. Install, then `npm run dev` opens it at `http://localhost:5173`. (Create React App is deprecated: don't use it.)",
    analogy: { icon: "📦", text: "A meal kit: the box arrives with the recipe card, measured ingredients and the pan. You just open it and start cooking instead of shopping for every item." },
    visual: { type: "flow", title: "Zero to running app", steps: [
      { label: "Scaffold", detail: "`npm create vite@latest notes-app -- --template react` copies the starter files." },
      { label: "Enter folder", detail: "`cd notes-app`" },
      { label: "Install", detail: "`npm install` downloads React, Vite and the React plugin into node_modules." },
      { label: "Run", detail: "`npm run dev` starts the dev server on port 5173." },
      { label: "Open browser", detail: "Visit `http://localhost:5173` and edit `src/App.jsx`: the page updates instantly." }
    ]},
    points: [
      "Vite is the **default** way to start a client-side React app. Create React App was **deprecated** in Feb 2025.",
      "Templates: `react` (JavaScript) or `react-ts` (TypeScript). Run without flags to pick from a menu.",
      "The `--` passes flags through npm to `create-vite`.",
      "Need routing, SSR or data loading built in? Start with a **framework** (Next.js, React Router framework mode) instead.",
      "Other bundlers exist (Rsbuild, Parcel), but Vite is the common choice."
    ],
    code: { file: "terminal", lang: "bash", src: `# 1. Scaffold (JavaScript template)
npm create vite@latest notes-app -- --template react

# or TypeScript
# npm create vite@latest notes-app -- --template react-ts

# 2. Install and run
cd notes-app
npm install
npm run dev

#  VITE v8.x  ready in 300 ms
#  ➜  Local:   http://localhost:5173/`, walk: [
      { lines: [2], note: "Creates `notes-app/` from the React template. `@latest` makes sure you get the newest scaffolder." },
      { lines: [5], note: "Same thing with TypeScript (`.tsx` files and a tsconfig)." },
      { lines: [8, 9], note: "Move into the folder and download the dependencies listed in package.json." },
      { lines: [10, 13], note: "Starts Vite's dev server. Open the Local URL in your browser." }
    ]},
    output: "VITE v8.x ready in ~300 ms\n➜ Local: http://localhost:5173/\nThe browser shows the Vite + React starter page with a counter button.",
    mistakes: [
      { bad: `npx create-react-app notes-app`, good: `npm create vite@latest notes-app -- --template react`, why: "Create React App is deprecated (Feb 2025) and unmaintained. Vite is faster and actively maintained." },
      { bad: `npm create vite@latest notes-app\nnpm run dev   # still in the parent folder`, good: `npm create vite@latest notes-app\ncd notes-app\nnpm install\nnpm run dev`, why: "Scripts run from the folder with package.json, and dependencies must be installed first." }
    ],
    practice: [
      { level: "B", q: "Create a project called `todo-app` with the React template and run it.", a: "`npm create vite@latest todo-app -- --template react`, then `cd todo-app`, `npm install`, `npm run dev`." },
      { level: "B", q: "Change the heading in `src/App.jsx` to \"My Todos\". What happens in the browser?", a: "It updates instantly without a reload (hot module replacement)." },
      { level: "I", q: "Scaffold a TypeScript version instead.", a: "Use `--template react-ts`." },
      { level: "C", q: "You need SEO-friendly server-rendered product pages for a shop. Is plain Vite the right start?", a: "Probably not: pick a framework with SSR such as Next.js or React Router framework mode." }
    ],
    quiz: [
      { q: "What is the recommended way to start a new client-side React app?", options: ["npx create-react-app", "npm create vite@latest", "npm install react and write a webpack config"], answer: 1, why: "CRA is deprecated; Vite is the standard lightweight setup." },
      { q: "Default Vite dev server port?", options: ["3000", "5173", "8080", "4173"], answer: 1, why: "5173 is dev; 4173 is `vite preview`." },
      { q: "Why is there a `--` before `--template react`?", options: ["It's a typo", "It passes the flag through npm to create-vite", "It makes the install silent"], answer: 1, why: "Without it npm may treat the flag as its own option." }
    ],
    rev: {
      sec30: "Start client-side React apps with `npm create vite@latest my-app -- --template react` (or `react-ts`), then `npm install` and `npm run dev` (port 5173). Create React App is deprecated since Feb 2025. If you need SSR, routing and data loading built in, start from a framework like Next.js or React Router framework mode.",
      interview: [
        { level: "basic", q: "How do you create a new React app today?", a: "`npm create vite@latest` with the react or react-ts template, or a framework like Next.js if I need SSR." },
        { level: "intermediate", q: "Why did the community move from CRA to Vite?", a: "CRA was slow (webpack bundling everything on start) and unmaintained; it was officially deprecated in 2025. Vite starts instantly by serving native ES modules and has fast HMR." },
        { level: "intermediate", q: "Vite vs Next.js?", a: "Vite is a build tool for a client-rendered SPA. Next.js is a full framework with routing, SSR/SSG and Server Components." },
        { level: "advanced", q: "What does the Vite React template's plugin do?", a: "`@vitejs/plugin-react` transforms JSX and enables React Fast Refresh so edits keep component state." },
        { level: "tricky", q: "Is Vite only for React?", a: "No. It's framework-agnostic: templates exist for Vue, Svelte, Solid, vanilla JS and more." }
      ],
      cheat: [
        "`npm create vite@latest app -- --template react` (or `react-ts`)",
        "`cd app && npm install && npm run dev`",
        "Dev server: http://localhost:5173",
        "Create React App: **deprecated** (Feb 2025)",
        "Need SSR/routing built in → Next.js or React Router framework mode",
        "Alternatives: Rsbuild, Parcel"
      ]
    },
    related: ["ENV-004", "ENV-009", "INTRO-014"]
  },

  "ENV-004": {
    tldr: "A Vite React app starts at `index.html`, which loads `src/main.jsx`; that file mounts `<App />` into the `#root` div. `public/` holds files copied as-is.",
    analogy: { icon: "🏪", text: "A shop: `index.html` is the empty shop floor, `main.jsx` unlocks the door and turns on the lights, `App.jsx` is the shelves of products, `public/` is the sign in the window that never changes." },
    visual: { type: "tree", title: "The Vite React starter", root: { label: "notes-app/", children: [
      { label: "index.html", note: "entry page with <div id=\"root\">" },
      { label: "public/", note: "copied as-is, served from /", children: [{ label: "favicon.svg" }] },
      { label: "src/", children: [
        { label: "main.jsx", note: "createRoot(...).render(<App />)" },
        { label: "App.jsx", note: "your first component" },
        { label: "index.css / App.css" },
        { label: "assets/", note: "imported files, get hashed names" }
      ]},
      { label: "package.json" },
      { label: "vite.config.js" },
      { label: ".oxlintrc.json", note: "lint rules (or eslint.config.js)" }
    ]}},
    points: [
      "`index.html` sits at the **project root** (not in public/). It's the real entry: it loads `/src/main.jsx` as a module.",
      "`main.jsx` calls `createRoot(document.getElementById('root')).render(...)` inside `<StrictMode>`.",
      "`App.jsx` is the root **component**; build your UI from here.",
      "`public/` files are served unchanged at `/name` (favicon, robots.txt). Files in `src/assets` are **imported** and get hashed names.",
      "`vite.config.js` adds plugins (React) and settings; `.oxlintrc.json` (or `eslint.config.js`) sets lint rules."
    ],
    code: { file: "src/main.jsx", lang: "jsx", src: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/* index.html (project root) contains:
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
*/`, walk: [
      { lines: [2], note: "`createRoot` comes from `react-dom/client`: it connects React to a real DOM node." },
      { lines: [3], note: "Global CSS imported once; Vite injects it into the page." },
      { lines: [6], note: "Find the empty `#root` div from index.html and let React own everything inside it." },
      { lines: [7, 8, 9], note: "`StrictMode` adds dev-only checks (double render/effects). It does nothing in production." },
      { lines: [14, 15], note: "index.html loads this file as an ES module. That's how the whole app starts." }
    ]},
    mistakes: [
      { bad: `// App.jsx\n<img src="/src/assets/logo.png" />`, good: `import logo from './assets/logo.png';\n<img src={logo} alt="Logo" />`, why: "Files in `src/` should be imported so Vite bundles and hashes them. Only `public/` files are referenced by absolute path." },
      { bad: `<!-- index.html -->\n<div id="app"></div>`, good: `<div id="root"></div>`, why: "`main.jsx` looks up `#root`. If the ids don't match, `createRoot` gets null and throws." }
    ],
    practice: [
      { level: "B", q: "Which file decides the page `<title>`?", a: "`index.html` at the project root." },
      { level: "B", q: "Add a `favicon.png` that must keep its exact URL. Where?", a: "In `public/`, then reference it as `/favicon.png`." },
      { level: "I", q: "Render a `<RecipeList />` component instead of `<App />` as the root.", a: "Import it in main.jsx and pass it to `render`.", code: `import RecipeList from './RecipeList.jsx';\ncreateRoot(document.getElementById('root')).render(<RecipeList />);` },
      { level: "C", q: "Why does an imported image end up as `/assets/logo-a1b2c3.png` in the build?", a: "Vite adds a content hash so browsers can cache it forever and get a new URL when it changes." }
    ],
    quiz: [
      { q: "Which file is the true entry point that the browser loads first?", options: ["src/App.jsx", "index.html", "src/main.jsx", "vite.config.js"], answer: 1, why: "The browser loads index.html, which then loads main.jsx." },
      { q: "Where should a `robots.txt` go?", options: ["src/assets/", "public/", "node_modules/"], answer: 1, why: "public/ files are copied unchanged to the site root." },
      { q: "`<StrictMode>` affects the production build.", options: ["True", "False"], answer: 1, why: "Its extra checks only run in development." }
    ],
    rev: {
      sec30: "Vite's entry is `index.html` at the root; it loads `/src/main.jsx` as a module. main.jsx uses `createRoot(...).render(<StrictMode><App /></StrictMode>)` to mount into `#root`. `App.jsx` is the root component. `public/` is copied untouched; `src/assets` files are imported and hashed.",
      interview: [
        { level: "basic", q: "What does main.jsx do?", a: "It imports global CSS and the App component, then mounts App into the `#root` div with `createRoot`." },
        { level: "intermediate", q: "Why is index.html at the root in Vite, not in public/?", a: "Vite treats index.html as source: it parses it, follows the module script and transforms imports. public/ is only for files copied as-is." },
        { level: "intermediate", q: "public/ vs src/assets?", a: "public: fixed URLs, no processing. src/assets: imported, optimised and given hashed filenames for caching." },
        { level: "advanced", q: "What changed in mounting from React 17 to 18+?", a: "`ReactDOM.render` (legacy, removed in React 19) was replaced by `createRoot` from `react-dom/client`, which enables concurrent features." },
        { level: "tricky", q: "Why might effects run twice in dev but once in prod?", a: "`StrictMode` in main.jsx deliberately mounts, unmounts and remounts components in development to surface missing cleanup." }
      ],
      cheat: [
        "`index.html` (root) → `/src/main.jsx` → `<App />`",
        "`createRoot(el).render(<App />)` from `react-dom/client`",
        "`<StrictMode>`: dev-only double render/effects",
        "`public/`: copied as-is, use `/file.png`",
        "`src/assets/`: import it, gets hashed name",
        "`vite.config.js`: plugins and settings"
      ]
    },
    related: ["ENV-003", "ENV-005", "RENDER-015"]
  },

  "ENV-005": {
    tldr: "package.json is the project's ID card: its name, the packages it needs (`dependencies` vs `devDependencies`), the commands it runs (`scripts`) and which versions are allowed (`^`, `~`).",
    analogy: { icon: "📝", text: "A recipe card: the ingredient list (dependencies), the kitchen tools (devDependencies) and the steps (scripts). \"Any brand of flour from 2.x\" is a version range." },
    visual: { type: "compare", title: "Two kinds of dependencies", left: { label: "dependencies", tone: "neutral", points: [
      "Code your app **imports at runtime**",
      "`react`, `react-dom`, `react-router`",
      "Ends up in the bundle users download",
      "Add with `npm i pkg`"
    ]}, right: { label: "devDependencies", tone: "neutral", points: [
      "Tools used only while **building/testing**",
      "`vite`, `oxlint`/`eslint`, `vitest`, `typescript`",
      "Not shipped to the browser",
      "Add with `npm i -D pkg`"
    ]}},
    points: [
      "`\"type\": \"module\"` means `.js` files use ES `import`/`export`.",
      "`scripts` are named commands: `npm run dev` runs whatever `\"dev\"` says (here `vite`).",
      "`^19.2.0` (caret) = any **19.x.x** at or above 19.2.0. Minor and patch updates allowed.",
      "`~19.2.0` (tilde) = any **19.2.x**. Patch updates only. `19.2.0` (no symbol) = exactly that.",
      "Versions are **SemVer**: MAJOR.MINOR.PATCH. A major bump may break your code.",
      "Like a `.csproj` file: it lists package references and build settings."
    ],
    code: { file: "package.json", lang: "json", src: `{
  "name": "notes-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.89.0",
    "vite": "^8.3.0"
  }
}`, walk: [
      { lines: [3], note: "`private: true` stops you accidentally publishing your app to the npm registry." },
      { lines: [5], note: "Treat `.js` files as ES modules (`import`/`export`)." },
      { lines: [6, 7, 8, 9, 10], note: "Named commands. `npm run build` runs `vite build`." },
      { lines: [12, 13, 14], note: "Runtime packages. `^19.2.0` accepts 19.2.1, 19.3.0, but not 20.0.0." },
      { lines: [16, 17, 18, 19], note: "Build/lint tools. Needed on your machine and in CI, not in the browser." }
    ]},
    mistakes: [
      { bad: `// edited by hand, typo and trailing comma\n"dependencies": { "react": "^19.2.0", }`, good: `npm install react\n// let npm write the entry`, why: "package.json must be strict JSON (no comments, no trailing commas). Use npm commands so the lock file stays in sync too." },
      { bad: `"devDependencies": { "react-router": "^7.9.0" }`, good: `"dependencies": { "react-router": "^7.9.0" }`, why: "Your app imports the router at runtime, so it's a dependency. Bundlers still include it, but the intent becomes misleading." }
    ],
    practice: [
      { level: "B", q: "Which range does `^7.9.0` allow: 7.9.4? 7.12.0? 8.0.0?", a: "7.9.4 yes, 7.12.0 yes, 8.0.0 no." },
      { level: "B", q: "Which section should `prettier` go in?", a: "devDependencies: it's a development tool." },
      { level: "I", q: "Add a script `\"format\"` that runs Prettier on the project.", a: "Add it under `scripts`, then `npm run format`.", code: `"scripts": {\n  "format": "prettier --write ."\n}` },
      { level: "C", q: "What does `^0.4.2` allow, and why is it different?", a: "Only 0.4.x (>=0.4.2 <0.5.0). Below 1.0, npm treats the minor number as breaking." }
    ],
    quiz: [
      { q: "`\"react\": \"~19.2.0\"` allows which version?", options: ["19.3.0", "19.2.5", "20.0.0"], answer: 1, why: "Tilde allows patch updates only within 19.2.x." },
      { q: "Where does `vitest` belong?", options: ["dependencies", "devDependencies", "scripts"], answer: 1, why: "Tests run in development and CI, never in the browser." },
      { q: "What does `npm run build` execute in the file above?", options: ["`vite build`", "`node build.js`", "`npm install`"], answer: 0, why: "npm looks up the `build` key in `scripts`." }
    ],
    rev: {
      sec30: "package.json describes the project: metadata, `scripts`, `dependencies` (runtime) and `devDependencies` (tools). Version ranges follow SemVer: `^1.2.3` allows minor+patch (<2.0.0), `~1.2.3` allows patch only (<1.3.0), a bare version is exact. The lock file records what was actually installed.",
      interview: [
        { level: "basic", q: "dependencies vs devDependencies?", a: "dependencies are imported by the app at runtime; devDependencies are only needed to build, lint or test it." },
        { level: "intermediate", q: "Explain `^` vs `~`.", a: "Caret allows minor and patch updates within the same major; tilde allows only patch updates within the same minor." },
        { level: "intermediate", q: "What is SemVer?", a: "MAJOR.MINOR.PATCH: major = breaking changes, minor = new features, patch = bug fixes." },
        { level: "advanced", q: "What are peerDependencies?", a: "Packages a library expects the host app to provide, e.g. a component library declares `react` as a peer so the app's single React copy is used." },
        { level: "tricky", q: "Two devs both have `\"vite\": \"^8.0.0\"` but different Vite versions installed. How?", a: "The range allows any 8.x. Without a committed lock file each install picks the latest matching version." }
      ],
      compare: { cols: ["Range", "Means", "Example matches"], rows: [
        ["`^19.2.0`", ">=19.2.0 <20.0.0", "19.2.3, 19.4.0"],
        ["`~19.2.0`", ">=19.2.0 <19.3.0", "19.2.3"],
        ["`19.2.0`", "exactly", "19.2.0"]
      ]},
      cheat: [
        "`dependencies` = runtime, `devDependencies` = tools",
        "`scripts`: `npm run <name>`",
        "SemVer: MAJOR.MINOR.PATCH",
        "`^` allows minor + patch; `~` allows patch only",
        "Below 1.0, `^0.4.2` means 0.4.x only",
        "Strict JSON: no comments, no trailing commas",
        "`\"private\": true` blocks accidental publishing"
      ]
    },
    related: ["ENV-006", "ENV-008", "ENV-002"]
  },

  "ENV-006": {
    tldr: "package-lock.json records the **exact** version of every installed package (including packages of packages). Commit it, so every machine and CI server installs the identical set.",
    analogy: { icon: "🧾", text: "package.json says \"any tomato sauce\". The lock file is the receipt: \"Brand X, 500 g, batch 42\". Re-buy from the receipt and the dish tastes the same every time." },
    visual: { type: "timeline", title: "Why the lock file matters", frames: [
      { label: "Monday", state: "package.json: \"vite\": \"^8.0.0\"", note: "You install. Lock file records vite **8.0.2** exactly." },
      { label: "Wednesday", state: "vite 8.1.0 released", note: "Still matches `^8.0.0`." },
      { label: "Teammate, no lock", state: "installs vite 8.1.0", note: "Different version from yours: \"works on my machine\" bugs." },
      { label: "Teammate, with lock", state: "installs vite 8.0.2", note: "Identical tree to yours." },
      { label: "CI: npm ci", state: "installs vite 8.0.2", note: "Exact install; fails if lock and package.json disagree." }
    ]},
    points: [
      "package.json holds **ranges**; the lock file holds the **resolved exact** versions and download URLs/hashes.",
      "It covers the **whole tree**: your 15 packages may pull in hundreds of nested ones.",
      "**Always commit** it. Never edit it by hand: npm rewrites it.",
      "`npm ci` (clean install) deletes node_modules and installs exactly from the lock file. Use it in CI.",
      "Upgrading on purpose: `npm update` or `npm i pkg@latest`, then commit the changed lock file.",
      "pnpm uses `pnpm-lock.yaml`, Yarn uses `yarn.lock`. Stick to one tool per project."
    ],
    code: { file: "terminal", lang: "bash", src: `# Local development: respects the lock, may update it
npm install

# CI / fresh clone: exact, reproducible, never edits the lock
npm ci

# Upgrade deliberately, then review and commit
npm update
git add package.json package-lock.json
git commit -m "chore: update dependencies"

# Snippet of package-lock.json (generated, do not edit)
# "node_modules/vite": {
#   "version": "8.0.2",
#   "resolved": "https://registry.npmjs.org/vite/-/vite-8.0.2.tgz",
#   "integrity": "sha512-..."
# }`, walk: [
      { lines: [2], note: "Installs what the lock says; adds entries when you add packages." },
      { lines: [5], note: "Removes node_modules, installs exactly from the lock. Errors if it's out of sync with package.json." },
      { lines: [8, 9, 10], note: "Upgrades within your ranges. Commit both files together." },
      { lines: [14, 15, 16], note: "Exact version, where it came from, and a hash to detect tampering." }
    ]},
    mistakes: [
      { bad: `# .gitignore\npackage-lock.json`, good: `# .gitignore\nnode_modules\ndist`, why: "Ignoring the lock file throws away reproducibility. Teammates and CI may install different versions." },
      { bad: `# merge conflict in package-lock.json\n# fixed by hand-editing the JSON`, good: `git checkout --theirs package-lock.json\nnpm install`, why: "Let npm regenerate it: take one side, then `npm install` re-resolves and writes a valid lock." }
    ],
    practice: [
      { level: "B", q: "Should package-lock.json be committed to Git?", a: "Yes, always (for apps and libraries alike)." },
      { level: "B", q: "Which command should a CI pipeline use to install?", a: "`npm ci`." },
      { level: "I", q: "`npm ci` fails with \"package.json and package-lock.json are not in sync\". Fix?", a: "Someone changed package.json without reinstalling. Run `npm install` locally and commit the updated lock file." },
      { level: "C", q: "A repo has both `package-lock.json` and `yarn.lock`. Problem?", a: "Two tools resolve different trees. Pick one package manager and delete the other lock file." }
    ],
    quiz: [
      { q: "What does the lock file store that package.json doesn't?", options: ["Script commands", "Exact resolved versions of every package", "The app's name"], answer: 1, why: "package.json has ranges; the lock pins exact versions for the whole tree." },
      { q: "`npm ci` vs `npm install`:", options: ["`npm ci` may change the lock file", "`npm ci` installs exactly from the lock and never edits it", "They're identical"], answer: 1, why: "`npm ci` is the strict, reproducible install." },
      { q: "You should hand-edit package-lock.json to change a version.", options: ["True", "False"], answer: 1, why: "Use npm commands; they rewrite the lock consistently." }
    ],
    rev: {
      sec30: "package-lock.json pins the exact version, source URL and integrity hash of every package in the dependency tree. Commit it so installs are reproducible. Use `npm ci` in CI: it wipes node_modules and installs exactly from the lock, failing if it's out of sync with package.json.",
      interview: [
        { level: "basic", q: "What is package-lock.json for?", a: "Reproducible installs: it records the exact versions of all direct and nested dependencies." },
        { level: "intermediate", q: "npm install vs npm ci?", a: "`install` can add/update the lock; `ci` deletes node_modules, installs exactly what the lock says, and errors if package.json disagrees. `ci` is for pipelines." },
        { level: "intermediate", q: "Should you commit the lock file?", a: "Yes. Without it, ranges like `^8.0.0` resolve to different versions over time." },
        { level: "advanced", q: "What's the `integrity` field?", a: "A SHA hash of the package tarball; npm verifies downloads against it to detect corruption or tampering." },
        { level: "tricky", q: "How do you resolve a lock file merge conflict?", a: "Don't hand-merge. Resolve package.json, take one lock version, then run `npm install` to regenerate a consistent lock." }
      ],
      cheat: [
        "Lock file = exact versions of the whole tree",
        "**Commit it**; never hand-edit",
        "`npm ci` = clean, exact install for CI",
        "`npm ci` fails if lock ≠ package.json",
        "Upgrade with `npm update` / `npm i pkg@latest`, then commit",
        "One package manager per repo (one lock file)"
      ]
    },
    related: ["ENV-005", "ENV-007", "PROD-010"]
  },

  "ENV-007": {
    tldr: "`node_modules/` is the folder where npm puts every downloaded package. It's huge and can be rebuilt any time from package.json + the lock file, so **never commit it**.",
    analogy: { icon: "🥫", text: "The pantry full of ingredients. You share the shopping list and receipt (package.json + lock), not the whole stocked pantry. Anyone can restock it in a minute." },
    visual: { type: "flow", title: "Rebuild node_modules when things go weird", steps: [
      { label: "Strange errors", detail: "\"Cannot find module\", wrong versions, or tools crashing after switching branches." },
      { label: "Delete node_modules", detail: "Remove the folder (it's safe; it's only downloaded copies)." },
      { label: "Clean install", detail: "`npm ci` reinstalls exactly from the lock file." },
      { label: "Restart dev server", detail: "`npm run dev` picks up the fresh packages." }
    ]},
    points: [
      "Contains your packages **and** all their nested dependencies: often hundreds of MB.",
      "Add `node_modules` to **.gitignore** (Vite's template already does).",
      "Rebuild with `npm install` or `npm ci`; it's 100% derived from package.json + lock.",
      "Packages with native/OS-specific parts install differently per platform: another reason not to copy it between machines.",
      "`node_modules/.bin` holds package commands (vite, eslint) that npm scripts and npx use.",
      "Like .NET's `bin/` and `obj/` folders: build output you regenerate, not source."
    ],
    code: { file: "terminal", lang: "bash", src: `# .gitignore (already in the Vite template)
# node_modules
# dist
# .env.local

# Reset dependencies: macOS / Linux / Git Bash
rm -rf node_modules
npm ci

# Reset dependencies: Windows PowerShell
Remove-Item -Recurse -Force node_modules
npm ci

# Where do package commands live?
ls node_modules/.bin`, walk: [
      { lines: [2, 3, 4], note: "These folders/files never go in Git: downloaded packages, build output, local secrets." },
      { lines: [7, 8], note: "Delete the folder, then reinstall exactly from the lock file." },
      { lines: [11, 12], note: "Same reset in PowerShell." },
      { lines: [15], note: "`vite`, `eslint` etc. live here; npm scripts find them automatically." }
    ]},
    mistakes: [
      { bad: `git add .\n# commits 40,000 files from node_modules`, good: `echo node_modules >> .gitignore\ngit rm -r --cached node_modules\ngit commit -m "stop tracking node_modules"`, why: "It bloats the repo, causes platform-specific breakage and noisy diffs. Ignore it and untrack it." },
      { bad: `# edit a bug in node_modules/some-lib/index.js`, good: `# upgrade the package, or use patch-package\nnpm i some-lib@latest`, why: "Hand edits vanish on the next install. Upgrade, fork, or record a patch instead." }
    ],
    practice: [
      { level: "B", q: "A teammate cloned the repo and the app won't start: \"vite: not found\". Why?", a: "They haven't installed dependencies. Run `npm install` (or `npm ci`)." },
      { level: "B", q: "Which line in .gitignore keeps the folder out of Git?", a: "`node_modules`" },
      { level: "I", q: "After switching branches you get \"Cannot find module 'zustand'\". Fix?", a: "The other branch added a dependency. Run `npm install` to sync node_modules with package.json." },
      { level: "C", q: "node_modules was committed long ago. How do you stop tracking it without deleting your local copy?", a: "Add it to .gitignore, then `git rm -r --cached node_modules` and commit." }
    ],
    quiz: [
      { q: "Why isn't node_modules committed?", options: ["It contains secrets", "It's large and fully rebuildable from package.json + lock", "Git can't store JavaScript"], answer: 1, why: "It's derived output; the lock file is enough to recreate it." },
      { q: "Safest way to rebuild it exactly?", options: ["Copy it from a teammate", "Delete it and run `npm ci`", "Run `npm update`"], answer: 1, why: "`npm ci` installs exactly what the lock file lists." },
      { q: "Editing a file inside node_modules is a durable fix.", options: ["True", "False"], answer: 1, why: "The next install overwrites it." }
    ],
    rev: {
      sec30: "node_modules holds every installed package and their nested dependencies. It's generated from package.json + package-lock.json, so it goes in .gitignore. When things break mysteriously, delete it and run `npm ci`. Commands like vite live in `node_modules/.bin`.",
      interview: [
        { level: "basic", q: "What is node_modules?", a: "The local folder where npm installs all project packages and their dependencies." },
        { level: "basic", q: "Why is it in .gitignore?", a: "It's huge, platform-specific in places, and fully reproducible from the lock file." },
        { level: "intermediate", q: "How do you fix a corrupted install?", a: "Delete node_modules and run `npm ci` for an exact clean install." },
        { level: "advanced", q: "How does pnpm's approach differ?", a: "pnpm stores each package version once in a global store and links it into node_modules, saving disk space and preventing access to undeclared dependencies." },
        { level: "tricky", q: "Your code imports a package that isn't in package.json but it works. Why, and is it a problem?", a: "It's hoisted into node_modules as someone else's dependency (a phantom dependency). Yes: it can disappear on upgrade. Add it explicitly." }
      ],
      cheat: [
        "node_modules = installed packages + nested deps",
        "Always in `.gitignore`",
        "Rebuild: delete it, then `npm ci`",
        "PowerShell: `Remove-Item -Recurse -Force node_modules`",
        "`node_modules/.bin` holds package commands",
        "Never patch files inside it by hand"
      ]
    },
    related: ["ENV-006", "ENV-002", "WEB-041"]
  },

  "ENV-008": {
    tldr: "npm scripts are named shortcuts in package.json. `npm run dev`, `npm run build`, `npm run preview` and `npm run lint` run the Vite and ESLint commands; you can add your own.",
    analogy: { icon: "🎛️", text: "Buttons on a coffee machine: \"latte\" runs a fixed series of steps. You press `dev` or `build` instead of typing the full recipe each time." },
    visual: { type: "flow", title: "What `npm run build` does", steps: [
      { label: "Read scripts", detail: "npm finds `\"build\": \"vite build\"` in package.json." },
      { label: "Run pre-hook", detail: "If a `prebuild` script exists, it runs first." },
      { label: "Find the binary", detail: "Adds `node_modules/.bin` to `PATH`, so `vite` is found locally." },
      { label: "Execute", detail: "Runs `vite build`, then `postbuild` if defined." }
    ]},
    points: [
      "`npm run <name>` runs `scripts.<name>`. `npm run` alone lists them all.",
      "`start` and `test` have shortcuts: `npm start`, `npm test` (no `run` needed).",
      "Scripts see local tools in `node_modules/.bin`, so no global installs.",
      "Pass extra flags after `--`: `npm run dev -- --port 3000`.",
      "Chain commands with `&&` (stops on failure): `\"check\": \"npm run lint && npm run build\"`.",
      "Vite template scripts: `dev` (dev server), `build` (production bundle), `preview` (serve the build), `lint` (Oxlint in the newest template, or ESLint)."
    ],
    code: { file: "package.json", lang: "json", src: `{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write src",
    "test": "vitest",
    "check": "npm run lint && npm run build"
  }
}`, walk: [
      { lines: [3], note: "`npm run dev`: start the dev server with hot reload." },
      { lines: [4, 5], note: "`build` makes `dist/`; `preview` serves that folder locally to test it." },
      { lines: [6], note: "`lint` runs ESLint over the project to catch bugs and hook mistakes." },
      { lines: [7, 8], note: "Custom scripts. `npm test` works without `run`." },
      { lines: [9], note: "`&&` runs build only if lint passes: a simple pre-push check." }
    ]},
    output: "> notes-app@0.0.0 check\n> npm run lint && npm run build\n... ✓ built in 1.2s",
    mistakes: [
      { bad: `npm dev`, good: `npm run dev`, why: "Only `start`, `test` and a few built-ins skip `run`. Custom scripts need `npm run <name>`." },
      { bad: `npm run dev --port 3000`, good: `npm run dev -- --port 3000`, why: "Without `--`, npm keeps the flag for itself instead of passing it to Vite." }
    ],
    practice: [
      { level: "B", q: "List all scripts in a project without opening package.json.", a: "Run `npm run` with no name." },
      { level: "B", q: "Start the dev server on port 3000.", a: "`npm run dev -- --port 3000`" },
      { level: "I", q: "Add a `typecheck` script for a TypeScript project.", a: "Run the compiler without emitting files.", code: `"typecheck": "tsc --noEmit"` },
      { level: "C", q: "Make `npm run build` automatically lint first, without changing the `build` line.", a: "Add a `prebuild` script; npm runs `pre<name>` before `<name>`.", code: `"prebuild": "npm run lint"` }
    ],
    quiz: [
      { q: "Which runs the `build` script?", options: ["npm build", "npm run build", "npx build"], answer: 1, why: "Custom scripts need `npm run`." },
      { q: "How do you pass `--open` to Vite through `npm run dev`?", options: ["npm run dev --open", "npm run dev -- --open", "npm --open run dev"], answer: 1, why: "`--` forwards everything after it to the script." },
      { q: "Why can a script call `vite` without a global install?", options: ["npm adds node_modules/.bin to PATH for scripts", "Vite is part of Node", "It downloads Vite each time"], answer: 0, why: "Scripts see locally installed binaries." }
    ],
    rev: {
      sec30: "npm scripts are named commands in package.json run with `npm run <name>`. They use local binaries from node_modules/.bin. Vite apps use `dev`, `build`, `preview` and `lint`. Pass flags after `--`, chain with `&&`, and use `pre`/`post` hooks for automatic steps.",
      interview: [
        { level: "basic", q: "What does `npm run dev` do in a Vite app?", a: "Runs the `dev` script, which is `vite`: it starts the dev server with HMR on port 5173." },
        { level: "intermediate", q: "What's the difference between `build` and `preview`?", a: "`build` creates the optimised `dist/` folder; `preview` serves that folder locally so you can check the production output." },
        { level: "intermediate", q: "Why use scripts instead of typing commands?", a: "They're documented, shared with the team, use local tool versions and are what CI calls." },
        { level: "advanced", q: "What are pre and post scripts?", a: "`prebuild`/`postbuild` run automatically before/after `build`. Useful for linting or generating files." },
        { level: "tricky", q: "`\"check\": \"npm run lint & npm run build\"`: what's wrong?", a: "Single `&` runs in background/parallel (on Unix) and doesn't stop on failure. Use `&&`." }
      ],
      cheat: [
        "`npm run <name>`; `npm run` lists all",
        "`npm start`, `npm test` skip `run`",
        "`dev` / `build` / `preview` / `lint` in Vite apps",
        "Forward flags: `npm run dev -- --port 3000`",
        "`&&` chains and stops on failure",
        "`pre<name>` / `post<name>` hooks run automatically"
      ]
    },
    related: ["ENV-009", "ENV-010", "ENV-005"]
  },

  "ENV-009": {
    tldr: "`npm run dev` starts Vite's dev server at `localhost:5173`. Save a file and **hot module replacement** (HMR) swaps just that module in the browser, usually keeping your component state.",
    analogy: { icon: "🎨", text: "Repainting one cupcake's icing while the rest of the tray stays put, instead of baking the whole batch again. You see the change instantly and nothing else is lost." },
    visual: { type: "cycle", title: "Edit → see it, without a reload", steps: [
      { label: "You save App.jsx", detail: "The file watcher notices the change." },
      { label: "Vite transforms it", detail: "Only that file is re-compiled (JSX → JS). No full rebundle." },
      { label: "WebSocket message", detail: "The server tells the browser \"App.jsx changed\"." },
      { label: "Fast Refresh", detail: "React swaps the new component code in; `useState` values are kept." },
      { label: "Keep editing", detail: "Errors appear in an overlay; fix and save to continue." }
    ]},
    points: [
      "Dev mode serves your files as native **ES modules**: the browser requests them one by one, so startup is fast.",
      "**React Fast Refresh** (via `@vitejs/plugin-react`) keeps state when you edit a component file.",
      "Edit a file that also exports **non-components** (e.g. a helper function) and state resets / page reloads.",
      "Flags: `--port 3000`, `--open` (open browser), `--host` (reach it from your phone on the same Wi-Fi).",
      "The dev server is **for development only**: unminified, extra checks. Never deploy it.",
      "Strict Mode double-renders and double-runs effects **in dev only**; don't panic at duplicate logs."
    ],
    code: { file: "src/App.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function App() {
  const [likes, setLikes] = useState(0);

  // Click a few times, then change the emoji below and save.
  // The count stays: Fast Refresh kept the state.
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes} likes
    </button>
  );
}

// terminal:
// npm run dev -- --open --host`, walk: [
      { lines: [4], note: "State lives in React, not in the file. Fast Refresh swaps code but keeps this slot." },
      { lines: [9, 10], note: "Change the emoji or text and save: the button updates, `likes` keeps its number." },
      { lines: [3], note: "Files that export only components keep Fast Refresh reliable." },
      { lines: [16], note: "`--open` launches the browser; `--host` prints a network URL for other devices." }
    ]},
    output: "VITE v8.x ready in 280 ms\n➜ Local:   http://localhost:5173/\n➜ Network: http://192.168.1.20:5173/\n[vite] hmr update /src/App.jsx",
    mistakes: [
      { bad: `// App.jsx\nexport function formatPrice(p) { ... }\nexport default function App() { ... }`, good: `// format.js\nexport function formatPrice(p) { ... }\n// App.jsx\nimport { formatPrice } from './format.js';`, why: "A file exporting helpers next to components can't be Fast-Refreshed; state resets. Move helpers to their own file (simple constants are OK in Vite)." },
      { bad: `# deploy by running on the server\nnpm run dev`, good: `npm run build\n# upload dist/ to a static host`, why: "The dev server is slow, unminified and not hardened. Production uses the built `dist/` folder." }
    ],
    practice: [
      { level: "B", q: "Start the dev server and open the browser automatically.", a: "`npm run dev -- --open`" },
      { level: "B", q: "Test the app on your phone on the same Wi-Fi.", a: "Run `npm run dev -- --host` and open the Network URL on the phone." },
      { level: "I", q: "Port 5173 is busy. What does Vite do, and how do you force a port?", a: "It tries the next free port (5174…). Set one with `--port 3000` or `server.port` in vite.config.js." },
      { level: "C", q: "Set the port permanently in vite.config.js.", a: "Use the `server` option.", code: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 3000, open: true },\n});` }
    ],
    quiz: [
      { q: "What does HMR do when you save a component?", options: ["Reloads the whole page", "Replaces just the changed module, usually keeping state", "Rebuilds dist/"], answer: 1, why: "Only the edited module is swapped in the running app." },
      { q: "Why does Vite's dev server start so fast?", options: ["It skips JSX", "It serves source files as native ES modules on demand", "It caches the production build"], answer: 1, why: "No full bundle upfront; files are transformed when the browser asks." },
      { q: "Effects running twice in `npm run dev` means production will run them twice too.", options: ["True", "False"], answer: 1, why: "That's Strict Mode's dev-only check." }
    ],
    rev: {
      sec30: "Vite's dev server (`npm run dev`, port 5173) serves source as native ES modules and transforms files on demand, so it starts fast. HMR pushes changed modules over a WebSocket; React Fast Refresh swaps components while keeping state. It's dev-only: deploy the `vite build` output instead.",
      interview: [
        { level: "basic", q: "What is HMR?", a: "Hot module replacement: updating changed modules in the running app without a full page reload." },
        { level: "intermediate", q: "How is Fast Refresh different from plain HMR?", a: "It's React-aware: it re-renders edited components and preserves their hook state; it falls back to a full reload when it can't do that safely." },
        { level: "intermediate", q: "Why is Vite's dev start faster than webpack-era tools?", a: "It doesn't bundle the app upfront. It serves native ESM and only transforms the files the browser actually requests." },
        { level: "advanced", q: "When does Fast Refresh lose state?", a: "When a file exports non-components, for class components, or when you edit hook order (add/remove hooks)." },
        { level: "tricky", q: "Your console logs appear twice in dev. Bug?", a: "Usually not: Strict Mode renders twice in development to catch impure renders. It doesn't happen in production." }
      ],
      cheat: [
        "`npm run dev` → http://localhost:5173",
        "HMR: swap changed modules, no reload",
        "Fast Refresh keeps `useState` values on edit",
        "Keep component files exporting components only",
        "`--port`, `--open`, `--host` flags",
        "Dev server ≠ production; deploy `dist/`"
      ]
    },
    related: ["ENV-010", "ENV-015", "RENDER-015"]
  },

  "ENV-010": {
    tldr: "`npm run build` turns your source into an optimised `dist/` folder: minified, bundled and with hashed filenames. `npm run preview` serves that folder locally so you can test it before deploying.",
    analogy: { icon: "🥡", text: "The dev server is cooking in your kitchen with ingredients everywhere. The build is the packed takeaway box: compact, sealed and labelled, ready to send out." },
    visual: { type: "flow", title: "`vite build` pipeline", steps: [
      { label: "Start at index.html", detail: "Vite follows every import from `/src/main.jsx` outward." },
      { label: "Transform", detail: "JSX → JS, CSS gathered, assets processed." },
      { label: "Bundle & split", detail: "Modules combined into chunks; lazy `import()`s become separate files." },
      { label: "Minify & hash", detail: "Whitespace and long names stripped; names like `index-B3k9x.js` for caching." },
      { label: "Write dist/", detail: "Static files ready for any host (Netlify, Vercel, S3, GitHub Pages)." }
    ]},
    points: [
      "Output is **static files**: `dist/index.html` + `dist/assets/*.js|css`. No Node server needed to host a SPA.",
      "**Hashed filenames** change when content changes, so browsers can cache assets forever.",
      "Production React is smaller and faster: no dev warnings, no Strict Mode double-checks.",
      "`npm run preview` serves `dist/` at `localhost:4173`. Always check the real build before shipping.",
      "Hosting under a sub-path (e.g. `/shop/`)? Set `base: '/shop/'` in vite.config.js.",
      "SPA with client routing: configure the host to send unknown paths to `index.html`."
    ],
    code: { file: "terminal", lang: "bash", src: `npm run build

# vite v8.x building for production...
# ✓ 34 modules transformed.
# dist/index.html                   0.46 kB
# dist/assets/index-D8f2kQ1x.css    1.39 kB │ gzip:  0.71 kB
# dist/assets/index-Bx3k9LmT.js   194.20 kB │ gzip: 61.05 kB
# ✓ built in 640ms

npm run preview
# ➜  Local: http://localhost:4173/`, walk: [
      { lines: [1], note: "Runs `vite build` (production mode, `NODE_ENV=production`)." },
      { lines: [5], note: "The HTML page, rewritten to point at the hashed bundles." },
      { lines: [6, 7], note: "Hashed CSS and JS. Watch the gzip size: that's roughly what users download." },
      { lines: [10, 11], note: "Serve `dist/` locally on 4173 to test the actual production output." }
    ]},
    mistakes: [
      { bad: `# open the file directly\nstart dist/index.html`, good: `npm run preview`, why: "Opening via `file://` breaks module scripts and absolute asset paths. Serve it over HTTP." },
      { bad: `# deployed to example.com/shop/, page is blank\nexport default defineConfig({ plugins: [react()] })`, good: `export default defineConfig({\n  plugins: [react()],\n  base: '/shop/',\n})`, why: "Assets are linked from `/` by default. On a sub-path the browser can't find them until you set `base`." }
    ],
    practice: [
      { level: "B", q: "Build the app and list what's inside dist/.", a: "`npm run build`; you'll see `index.html` and an `assets/` folder with hashed JS/CSS." },
      { level: "B", q: "Test the production build locally.", a: "`npm run preview`, then open http://localhost:4173." },
      { level: "I", q: "Why do filenames contain random-looking hashes?", a: "The hash is based on content. New content = new URL, so long-term caching never serves stale code." },
      { level: "C", q: "Refreshing `/cart` on the deployed app gives a 404. Why?", a: "The host looks for a `/cart` file. Add a rewrite/fallback so all routes serve `index.html` and the client router takes over." }
    ],
    quiz: [
      { q: "What does `npm run build` produce?", options: ["A running Node server", "A `dist/` folder of static optimised files", "An updated node_modules"], answer: 1, why: "Vite writes minified, hashed static assets to dist/." },
      { q: "Default `vite preview` port?", options: ["5173", "4173", "3000"], answer: 1, why: "Dev is 5173; preview is 4173." },
      { q: "Why hash asset filenames?", options: ["Security", "Safe long-term caching: new content gets a new URL", "Smaller files"], answer: 1, why: "Browsers cache old hashes forever and fetch new ones on change." }
    ],
    rev: {
      sec30: "`vite build` bundles from index.html, transforms JSX, splits chunks, minifies and writes hashed files to `dist/`. The result is static and can be hosted anywhere. `vite preview` (port 4173) serves it locally. Set `base` for sub-paths and an index.html fallback for client-side routes.",
      interview: [
        { level: "basic", q: "How do you create a production build in a Vite app?", a: "`npm run build`; it writes optimised static files to `dist/`." },
        { level: "intermediate", q: "What optimisations does the build apply?", a: "Bundling, tree-shaking unused code, minification, code splitting for dynamic imports, and content-hashed filenames." },
        { level: "intermediate", q: "Why test with `preview` instead of `dev`?", a: "Dev and prod differ: bundling, env mode, Strict Mode checks, asset paths. Preview runs the real output." },
        { level: "advanced", q: "Why does a deep link 404 on a static host?", a: "Client routes don't exist as files. Configure a fallback that serves index.html for unknown paths." },
        { level: "tricky", q: "Is production React just the dev build minified?", a: "No. It also strips dev-only warnings and checks (like Strict Mode's double invoke), so it behaves and performs differently." }
      ],
      compare: { cols: ["", "npm run dev", "npm run build + preview"], rows: [
        ["Port", "5173", "4173"],
        ["Bundled/minified", "No (native ESM)", "Yes"],
        ["HMR", "Yes", "No"],
        ["Use for", "Writing code", "Checking what ships"]
      ]},
      cheat: [
        "`npm run build` → `dist/` (static files)",
        "Minified, tree-shaken, code-split, hashed names",
        "`npm run preview` → localhost:4173",
        "Don't open dist/index.html via file://",
        "Sub-path hosting: set `base` in vite.config.js",
        "Client routes need an index.html fallback on the host"
      ]
    },
    related: ["ENV-009", "PROD-001", "PERF-010"]
  },

  "ENV-011": {
    tldr: "Put config like an API URL in `.env` files. Vite exposes only variables starting with `VITE_` as `import.meta.env.VITE_*`, and **bakes them into the bundle**, so never put secrets there.",
    analogy: { icon: "🏷️", text: "Price stickers printed on a product box at the factory. Anyone holding the box can read them. Great for \"which store URL\", terrible for the safe's combination." },
    visual: { type: "flow", title: "From .env to your bundle", steps: [
      { label: "Write .env", detail: "`VITE_API_URL=https://api.weather.dev` and `DB_PASSWORD=...`" },
      { label: "Vite loads files", detail: "`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local` (later ones win)." },
      { label: "Filter by prefix", detail: "Only `VITE_*` is exposed. `DB_PASSWORD` is never sent to the client." },
      { label: "Replace at build", detail: "`import.meta.env.VITE_API_URL` becomes the literal string in the JS file." },
      { label: "Ships to users", detail: "Anyone can see it in DevTools. Treat it as public." }
    ]},
    points: [
      "Read with `import.meta.env.VITE_NAME` (not `process.env`). Values are always **strings**.",
      "Built-ins: `import.meta.env.MODE`, `DEV`, `PROD`, `BASE_URL`.",
      "`.env.local` is for machine-specific values; keep `*.local` in `.gitignore` (the Vite template does).",
      "`.env.production` applies to `vite build`; `.env.staging` to `vite build --mode staging`.",
      "Real secrets (API keys with spending power, DB passwords) belong on a **server**, not in a front-end env file.",
      "After editing a `.env` file, **restart the dev server** (the Vite docs advise it)."
    ],
    code: { file: "src/weather.js", lang: "js", src: `// .env               VITE_API_URL=https://api.weather.dev
// .env.local         VITE_API_URL=http://localhost:7071
// .env.production    VITE_API_URL=https://api.myweather.app

const API_URL = import.meta.env.VITE_API_URL;

export async function getForecast(city) {
  const res = await fetch(\`\${API_URL}/forecast?city=\${encodeURIComponent(city)}\`);
  if (!res.ok) throw new Error(\`Forecast failed: \${res.status}\`);
  return res.json();
}

if (import.meta.env.DEV) {
  console.log('Mode:', import.meta.env.MODE, 'API:', API_URL);
}

// Numbers/booleans arrive as strings:
export const pageSize = Number(import.meta.env.VITE_PAGE_SIZE ?? 20);
export const showBeta = import.meta.env.VITE_SHOW_BETA === 'true';`, walk: [
      { lines: [1, 2, 3], note: "Same key, different files. `.env.local` overrides `.env` on your machine; `.env.production` is used by `vite build`." },
      { lines: [5], note: "Exposed because of the `VITE_` prefix. Replaced with the literal string at build time." },
      { lines: [13, 14], note: "`DEV` is true in `npm run dev`, false in the build. This log is removed from production." },
      { lines: [18, 19], note: "Everything is a string. Convert explicitly; `'false'` is truthy!" }
    ]},
    mistakes: [
      { bad: `# .env\nVITE_STRIPE_SECRET_KEY=sk_live_...`, good: `# keep it on your server/API\nSTRIPE_SECRET_KEY=sk_live_...\n# front end only gets the public key\nVITE_STRIPE_PUBLIC_KEY=pk_live_...`, why: "Anything `VITE_` is embedded in the JS users download. Secret keys must stay server-side." },
      { bad: `const url = process.env.REACT_APP_API_URL;`, good: `const url = import.meta.env.VITE_API_URL;`, why: "`process.env` and `REACT_APP_` are Create React App (deprecated) conventions. Vite uses `import.meta.env` and `VITE_`." },
      { bad: `if (import.meta.env.VITE_SHOW_BETA) { ... }`, good: `if (import.meta.env.VITE_SHOW_BETA === 'true') { ... }`, why: "The string `'false'` is truthy, so the feature would always show." }
    ],
    practice: [
      { level: "B", q: "Expose `API_URL=https://api.notes.dev` to your React code.", a: "Rename it `VITE_API_URL` in `.env` and read `import.meta.env.VITE_API_URL`." },
      { level: "B", q: "Show a \"DEV\" badge only in development.", a: "`{import.meta.env.DEV && <span>DEV</span>}`" },
      { level: "I", q: "Use a different API URL for a staging build.", a: "Create `.env.staging` and build with `vite build --mode staging`." },
      { level: "C", q: "Your weather API key must stay secret. How should the React app call the weather API?", a: "Call your own backend/serverless function, which holds the key in a server env var and forwards the request." }
    ],
    quiz: [
      { q: "Which variable can your React code read in a Vite app?", options: ["API_URL", "VITE_API_URL", "REACT_APP_API_URL"], answer: 1, why: "Only `VITE_`-prefixed variables are exposed to client code." },
      { q: "Is `import.meta.env.VITE_KEY` safe for secrets?", options: ["Yes, .env files are private", "No, the value is embedded in the shipped JS", "Only in production"], answer: 1, why: "It's replaced with a literal string in the bundle." },
      { q: "`VITE_LIMIT=10`: what is `typeof import.meta.env.VITE_LIMIT`?", options: ["number", "string", "undefined"], answer: 1, why: "Env values are always strings; convert them yourself." }
    ],
    rev: {
      sec30: "Vite loads `.env`, `.env.local`, `.env.[mode]` and `.env.[mode].local`. Only `VITE_`-prefixed vars reach client code via `import.meta.env`, and they're statically replaced in the bundle, so they're public. Values are strings. Built-ins: MODE, DEV, PROD, BASE_URL. Secrets stay on a server.",
      interview: [
        { level: "basic", q: "How do you read env variables in a Vite React app?", a: "`import.meta.env.VITE_NAME`, defined in a `.env` file with the `VITE_` prefix." },
        { level: "intermediate", q: "Why the `VITE_` prefix?", a: "It's an allow-list so server-only variables on your machine or CI don't accidentally leak into the client bundle." },
        { level: "intermediate", q: "How do you set different values per environment?", a: "Mode-specific files like `.env.production` or `.env.staging`, selected with `--mode`; `.local` files override locally and are git-ignored." },
        { level: "advanced", q: "Can you change a VITE_ variable after deploying without rebuilding?", a: "No. It's inlined at build time. For runtime config, fetch a `config.json` or have the server inject values." },
        { level: "tricky", q: "Is hiding an API key in `.env` (not committed) enough to keep it secret?", a: "No. Git-ignoring only keeps it out of the repo; the build still embeds it in public JS. Proxy through a backend." }
      ],
      cheat: [
        "Read: `import.meta.env.VITE_NAME`",
        "Only `VITE_*` reaches the client",
        "Inlined at build time → **public**, never secrets",
        "Values are strings: convert numbers/booleans",
        "Files: `.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local`",
        "Built-ins: `MODE`, `DEV`, `PROD`, `BASE_URL`",
        "`process.env.REACT_APP_*` is the old CRA way"
      ]
    },
    related: ["API-019", "SEC-010", "PROD-002"]
  },

  "ENV-012": {
    tldr: "Set up VS Code once: **ESLint** flags bugs as you type, **Prettier** formats on save, and **snippets** type boilerplate for you. Share the settings in `.vscode/` so the whole team matches.",
    analogy: { icon: "🔪", text: "A tidy kitchen station: a sharp knife (ESLint catches mistakes), a self-cleaning counter (Prettier tidies on save) and pre-measured spice jars (snippets)." },
    visual: { type: "layers", title: "Your editor toolkit", items: [
      { label: "Snippets", detail: "Type `rfc` + Tab → a component skeleton." },
      { label: "Prettier (format)", detail: "Fixes spacing, quotes and line breaks on every save." },
      { label: "ESLint (lint)", detail: "Red squiggles for bugs: unused vars, missing hook deps, hook rules." },
      { label: "Workspace settings", detail: "`.vscode/settings.json` + `extensions.json`, committed for the team." },
      { label: "VS Code", detail: "Built-in JS/TS IntelliSense, Emmet in JSX, integrated terminal." }
    ]},
    points: [
      "Install extensions: **ESLint** (`dbaeumer.vscode-eslint`) and **Prettier** (`esbenp.prettier-vscode`).",
      "ESLint finds **bugs**; Prettier handles **looks**. Add `eslint-config-prettier` so they don't fight.",
      "ESLint + `eslint-plugin-react-hooks` checks rules of hooks and deps. The newest Vite template uses **Oxlint** (a faster ESLint-compatible linter) instead.",
      "Turn on `editor.formatOnSave` and set Prettier as the default formatter.",
      "Snippets: **Configure Snippets** → `javascriptreact.json`, or install a snippet extension.",
      "Commit `.vscode/extensions.json` so VS Code suggests the same extensions to teammates."
    ],
    code: { file: ".vscode/settings.json", lang: "json", src: `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "emmet.includeLanguages": { "javascript": "javascriptreact" },
  "files.exclude": { "**/node_modules": true }
}

// .vscode/extensions.json
// { "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"] }

// .prettierrc
// { "singleQuote": true, "semi": true, "trailingComma": "all" }

// User snippet (javascriptreact.json): type "rfc" + Tab
// "React component": {
//   "prefix": "rfc",
//   "body": ["export default function \${1:Name}() {", "  return <div>$0</div>;", "}"]
// }`, walk: [
      { lines: [2, 3], note: "Prettier formats every file when you save. No more style debates in code review." },
      { lines: [4, 5, 6], note: "Also apply ESLint auto-fixes on save (e.g. remove unused imports where fixable)." },
      { lines: [7], note: "Emmet abbreviations (`div.card` + Tab) inside `.js` files too." },
      { lines: [12], note: "Teammates opening the repo get prompted to install these extensions." },
      { lines: [18, 19, 20, 21], note: "A snippet: `rfc` + Tab writes a component; `$1` is the first cursor stop." }
    ]},
    mistakes: [
      { bad: `// ESLint stylistic rules + Prettier both on\n// save → code flips between two styles`, good: `npm i -D eslint-config-prettier\n// add it last in eslint.config.js`, why: "Let Prettier own formatting and ESLint own correctness. `eslint-config-prettier` turns off clashing rules." },
      { bad: `// ignoring the yellow squiggle:\n// "React Hook useEffect has a missing dependency"`, good: `useEffect(() => { load(city); }, [city]);`, why: "The react-hooks lint rule catches real stale-data bugs. Fix the deps instead of silencing it." }
    ],
    practice: [
      { level: "B", q: "Make VS Code format with Prettier whenever you save.", a: "Set `\"editor.formatOnSave\": true` and `\"editor.defaultFormatter\": \"esbenp.prettier-vscode\"`." },
      { level: "B", q: "Run ESLint from the terminal across the project.", a: "`npm run lint` (runs `eslint .`)." },
      { level: "I", q: "Add a Prettier check script for CI.", a: "Use `--check` so it fails without rewriting.", code: `"format:check": "prettier --check ."` },
      { level: "C", q: "Write a snippet `ust` that expands to a `useState` line.", a: "Add it to `javascriptreact.json`.", code: `"useState": {\n  "prefix": "ust",\n  "body": ["const [\${1:value}, set\${1/(.*)/\${1:/capitalize}/}] = useState(\${2:null});"]\n}` }
    ],
    quiz: [
      { q: "ESLint vs Prettier?", options: ["Both only format code", "ESLint finds code problems; Prettier formats", "Prettier finds bugs; ESLint formats"], answer: 1, why: "Linting = correctness rules; formatting = consistent style." },
      { q: "Why commit `.vscode/extensions.json`?", options: ["VS Code needs it to run", "Teammates get prompted to install the same extensions", "It installs node_modules"], answer: 1, why: "It's a shared recommendation list." },
      { q: "Which plugin warns about missing `useEffect` dependencies?", options: ["eslint-plugin-react-hooks", "Prettier", "Emmet"], answer: 0, why: "Its `exhaustive-deps` rule checks dependency arrays." }
    ],
    rev: {
      sec30: "VS Code + ESLint (correctness, including react-hooks rules) + Prettier (formatting on save) is the standard setup. Use `eslint-config-prettier` to stop conflicts. Share `.vscode/settings.json` and `extensions.json` in the repo, and add `lint` / `format:check` scripts so CI enforces the same rules.",
      interview: [
        { level: "basic", q: "What's the difference between a linter and a formatter?", a: "A linter (ESLint) reports likely bugs and bad patterns; a formatter (Prettier) rewrites code to a consistent style." },
        { level: "intermediate", q: "Which ESLint plugin matters most for React?", a: "`eslint-plugin-react-hooks`: it enforces the rules of hooks and checks effect dependency arrays." },
        { level: "intermediate", q: "How do you keep a team's formatting consistent?", a: "Shared Prettier config, format-on-save in committed workspace settings, and a `prettier --check` step in CI." },
        { level: "advanced", q: "What's ESLint's flat config?", a: "The `eslint.config.js` format (default since ESLint 9): an exported array of config objects instead of `.eslintrc` cascading." },
        { level: "tricky", q: "Editor settings are committed. Is that enough to enforce lint rules?", a: "No. Settings only help people who use VS Code. Enforce with `npm run lint` in CI or a pre-commit hook." }
      ],
      cheat: [
        "Extensions: ESLint + Prettier",
        "`editor.formatOnSave: true` + Prettier as default formatter",
        "`eslint-config-prettier` stops lint/format clashes",
        "ESLint flat config: `eslint.config.js` + react-hooks plugin",
        "Snippets: Configure Snippets → `javascriptreact.json`",
        "Commit `.vscode/settings.json` + `extensions.json`",
        "Enforce in CI: `npm run lint`, `prettier --check .`"
      ]
    },
    related: ["ENV-008", "HOOKS-002", "ENV-015"]
  },

  "ENV-013": {
    tldr: "Browser DevTools (F12) are four tools in one: **Elements** (the live DOM and CSS), **Console** (logs and errors), **Network** (every request) and **Sources** (your code with breakpoints).",
    analogy: { icon: "🔍", text: "A shop's back office: the shelf map (Elements), the complaints desk (Console), the delivery log (Network) and the CCTV you can pause and rewind (Sources)." },
    visual: { type: "layers", title: "The four panels you'll use daily", items: [
      { label: "Elements", detail: "Live DOM React produced. Edit CSS, see box model, check classes." },
      { label: "Console", detail: "`console.log` output, React warnings, errors with stack traces; run JS live." },
      { label: "Network", detail: "Each fetch: URL, status, timing, headers, response body. Throttle to slow 4G." },
      { label: "Sources", detail: "Original `.jsx` files (via source maps). Set breakpoints, step through code." }
    ]},
    points: [
      "Open with **F12** or **Ctrl+Shift+I** (Cmd+Opt+I on Mac). Right-click → **Inspect** jumps to an element.",
      "**Elements** shows real DOM, not components. Use it for layout and CSS bugs.",
      "**Console**: filter by level (errors/warnings); `console.table(rows)` shows arrays as a grid.",
      "**Network**: tick **Disable cache** while developing; filter **Fetch/XHR** to see API calls only.",
      "**Sources**: Vite serves source maps, so you debug your own JSX, not compiled code.",
      "Device toolbar (Ctrl+Shift+M) previews phone sizes."
    ],
    code: { file: "src/Products.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=5')
      .then((res) => res.json())
      .then((data) => {
        console.table(data.products, ['title', 'price']);
        setProducts(data.products);
      })
      .catch((err) => console.error('Products failed', err));
  }, []);

  return (
    <ul className="product-list">
      {products.map((p) => (
        <li key={p.id}>{p.title}: \${p.price}</li>
      ))}
    </ul>
  );
}`, walk: [
      { lines: [7], note: "**Network**: see the request, status (200), timing and JSON. In dev, Strict Mode runs the effect twice: 2 requests." },
      { lines: [10], note: "**Console**: a neat table of title and price columns." },
      { lines: [13], note: "Errors show in red in the Console with a clickable stack trace." },
      { lines: [17], note: "**Elements**: find `ul.product-list`, tweak its CSS live." },
      { lines: [9], note: "**Sources**: click this line number to set a breakpoint and inspect `data`." }
    ]},
    mistakes: [
      { bad: `// "my CSS change isn't showing"\n// Network: cache enabled`, good: `// Network tab → tick "Disable cache"\n// (only while DevTools is open)`, why: "A cached old file can hide your fix. Disabling cache during dev removes the guesswork." },
      { bad: `// API returns 401, but you only look at the UI\n// "the list is empty, React is broken"`, good: `// Network → click the request → Status, Response\n// 401 → check auth token, not React`, why: "Check the Network panel first for data bugs: status code and response body tell you if it's the front end or the API." }
    ],
    practice: [
      { level: "B", q: "Find which CSS rule makes a button blue.", a: "Right-click → Inspect, then read the **Styles** pane in Elements; crossed-out rules are overridden." },
      { level: "B", q: "See the JSON your weather API returned.", a: "Network → Fetch/XHR → click the request → **Response** or **Preview** tab." },
      { level: "I", q: "Test how your shop loads on a slow phone connection.", a: "Network → throttling dropdown → **Slow 4G**, then reload." },
      { level: "C", q: "A fetch fails with a CORS error. Where do you confirm what's wrong?", a: "Console shows the CORS message; Network shows the response headers (missing `Access-Control-Allow-Origin`). The fix is on the server." }
    ],
    quiz: [
      { q: "Which panel shows the status code of an API call?", options: ["Elements", "Console", "Network", "Sources"], answer: 2, why: "Network lists every request with status, timing and payload." },
      { q: "Elements panel shows React components.", options: ["True", "False"], answer: 1, why: "It shows the real DOM. Components are in React DevTools." },
      { q: "Why can you set breakpoints in your `.jsx` files in Sources?", options: ["Browsers run JSX", "Source maps link compiled code back to your files", "Vite disables compilation"], answer: 1, why: "Source maps map the transformed JS to your original source." }
    ],
    rev: {
      sec30: "Browser DevTools: Elements for DOM/CSS, Console for logs, errors and running JS, Network for request status/timing/payload with cache-disable and throttling, Sources for breakpoints in original files via source maps. For data bugs check Network first; for layout bugs, Elements.",
      interview: [
        { level: "basic", q: "How do you check what an API returned?", a: "Network tab, filter Fetch/XHR, select the request and read Status and Response/Preview." },
        { level: "intermediate", q: "What are source maps?", a: "Files that map bundled/transformed JS back to the original source, so DevTools shows and breaks on your real code." },
        { level: "intermediate", q: "A style isn't applied. How do you debug it?", a: "Inspect the element; check if the class is present and whether the rule is crossed out (overridden by specificity or order)." },
        { level: "advanced", q: "How do you simulate a slow network or offline user?", a: "Network throttling presets (Slow 4G, Offline) or custom profiles." },
        { level: "tricky", q: "The UI shows stale data after a deploy, but the code is fixed. First check?", a: "Network: is the old JS file served from cache? Disable cache / hard reload and confirm the hashed filename changed." }
      ],
      cheat: [
        "F12 / Ctrl+Shift+I; right-click → Inspect",
        "Elements = real DOM + CSS",
        "Console: logs, errors, `console.table`",
        "Network: status, timing, payload; Disable cache; throttle",
        "Sources: breakpoints via source maps",
        "Ctrl+Shift+M: device toolbar"
      ]
    },
    related: ["ENV-014", "ENV-015", "WEB-034"]
  },

  "ENV-014": {
    tldr: "React Developer Tools is a browser extension that adds **Components** (the component tree with live props, state and hooks) and **Profiler** (which components rendered, why, and how long it took).",
    analogy: { icon: "🧺", text: "Elements shows the groceries on the shelf. React DevTools shows the recipe cards behind them: which recipe made each dish and what ingredients (props, state) it used." },
    visual: { type: "tree", title: "What the Components tab shows", root: { label: "App", children: [
      { label: "Header", note: "props: { user: \"Sam\" }" },
      { label: "CartProvider", note: "context value", children: [
        { label: "ProductList", note: "state: filter = \"fruit\"", children: [
          { label: "ProductCard", note: "props: { name, price }" },
          { label: "ProductCard" }
        ]},
        { label: "CartBadge", note: "hooks: useContext → 3 items" }
      ]}
    ]}},
    points: [
      "Install for Chrome, Edge or Firefox from the official store. New **⚛️ Components** and **⚛️ Profiler** tabs appear.",
      "**Components**: select a component to see props, state, hooks and context; **edit them live** to test UI.",
      "Search by name; the **eye** icon jumps to the matching DOM node; **rendered by** shows the owner chain.",
      "Settings → **Highlight updates when components render** flashes components as they re-render.",
      "**Profiler**: record an interaction, then see each commit, render times and \"Why did this render?\" (enable in settings).",
      "React 19.2 adds **Performance Tracks** to Chrome's Performance panel (dev and profiling builds)."
    ],
    code: { file: "src/Shop.jsx", lang: "jsx", src: `import { useState } from 'react';

function ProductCard({ name, price, onAdd }) {
  return (
    <li>
      {name}: £{price} <button onClick={onAdd}>Add</button>
    </li>
  );
}

export default function Shop() {
  const [count, setCount] = useState(0);
  const products = [
    { id: 1, name: 'Apples', price: 2 },
    { id: 2, name: 'Bread', price: 1.5 },
  ];

  return (
    <>
      <p>🛒 {count} items</p>
      <ul>
        {products.map((p) => (
          <ProductCard key={p.id} {...p} onAdd={() => setCount(count + 1)} />
        ))}
      </ul>
    </>
  );
}`, walk: [
      { lines: [12], note: "Select **Shop** in Components: hooks show `State: 0`. Double-click to change it to 5 and watch the UI update." },
      { lines: [3], note: "Select a **ProductCard** to read props `name`, `price` and the `onAdd` function." },
      { lines: [23], note: "`key` shows next to each card in the tree, handy for list bugs." },
      { lines: [20], note: "Profiler: record a click. Shop re-renders (state changed), and each card because its parent rendered." }
    ]},
    mistakes: [
      { bad: `// "I'll guess why it re-renders"\nconsole.log('render', props);`, good: `// Profiler → settings → "Record why each\n// component rendered" → record a click`, why: "The Profiler tells you exactly which props, state or hooks changed. Measure before you optimise." },
      { bad: `// Profiling in npm run dev and trusting the ms numbers`, good: `// Use the timings to compare relative cost;\n// confirm real speed with a production build`, why: "Dev builds are slower (extra checks, Strict Mode double render). Treat dev timings as relative, not absolute." }
    ],
    practice: [
      { level: "B", q: "Find the current value of a component's `useState`.", a: "Components tab → select the component → **hooks** section shows `State`." },
      { level: "B", q: "Which component renders the `<li>` you clicked in Elements?", a: "With the element selected, open the Components tab: it selects the owning component. Or use the picker icon." },
      { level: "I", q: "See which components re-render when you type in a search box.", a: "Enable **Highlight updates when components render**, then type; flashing boxes are re-rendering components." },
      { level: "C", q: "A cart page feels slow when adding items. How do you find the culprit?", a: "Profiler: record the click, open the flame chart, sort by render time, check \"why did this render\" for the slowest component." }
    ],
    quiz: [
      { q: "Which tab shows props and state?", options: ["Elements", "Components (React DevTools)", "Network"], answer: 1, why: "React DevTools reads React's internal tree, not the DOM." },
      { q: "What does the Profiler measure?", options: ["Bundle size", "Which components rendered in each commit and how long they took", "API response times"], answer: 1, why: "It records render commits and timings." },
      { q: "You can edit a component's state in DevTools to test the UI.", options: ["True", "False"], answer: 0, why: "Props, state and hook values are editable live." }
    ],
    rev: {
      sec30: "React DevTools adds Components (tree, props, state, hooks, context, owners, live editing, highlight updates) and Profiler (record interactions, see commits, render durations, why each component rendered). Use it to find wrong data and unnecessary renders; confirm absolute speed with a production build.",
      interview: [
        { level: "basic", q: "What can you inspect with React DevTools?", a: "The component tree with each component's props, state, hooks and context, plus render profiling." },
        { level: "intermediate", q: "How do you find unnecessary re-renders?", a: "Turn on highlight updates, then use the Profiler with \"record why each component rendered\" to see which prop or state changed." },
        { level: "intermediate", q: "Elements panel vs Components tab?", a: "Elements shows the DOM output; Components shows the React tree that produced it, including components that render no DOM." },
        { level: "advanced", q: "What do flame chart and ranked chart show?", a: "Flame: the whole tree for one commit, width = render time. Ranked: components sorted by how long they took." },
        { level: "tricky", q: "The Profiler shows a component rendering twice per click in dev. Real problem?", a: "Possibly not: Strict Mode double-renders in development. Check in a profiling/production build before acting." }
      ],
      cheat: [
        "Extension: ⚛️ Components + ⚛️ Profiler tabs",
        "Components: props, state, hooks, context; edit live",
        "Eye icon → DOM node; \"rendered by\" → owner chain",
        "Settings: Highlight updates when components render",
        "Profiler: record → commits → flame/ranked → why rendered",
        "Dev timings are inflated; verify in production",
        "React 19.2: Performance Tracks in Chrome Performance panel"
      ]
    },
    related: ["ENV-013", "PERF-002", "PERF-003"]
  },

  "ENV-015": {
    tldr: "Debug in a loop: **read the error** (Vite overlay or console), **reproduce**, **pause** with a breakpoint or `debugger`, **inspect** values, fix. Log with labels, and remember Strict Mode doubles renders in dev.",
    analogy: { icon: "🕵️", text: "A detective with a recipe gone wrong: read the complaint, cook it again step by step, taste at each step (breakpoints) until you find the salt that went in twice." },
    visual: { type: "cycle", title: "The debugging loop", steps: [
      { label: "Read the error", detail: "Message + file:line + component stack. The red Vite overlay shows build/runtime errors." },
      { label: "Reproduce", detail: "Find the exact clicks/input that trigger it every time." },
      { label: "Pause", detail: "`debugger;` or a breakpoint in Sources. Execution stops; hover values." },
      { label: "Inspect", detail: "Check variables, call stack, props/state in React DevTools, requests in Network." },
      { label: "Fix & verify", detail: "Change the code, save (HMR), repeat the steps. Add a test so it stays fixed." }
    ]},
    points: [
      "**Vite error overlay**: syntax/import/runtime errors cover the page with the file and line. Fix and save to dismiss.",
      "`debugger;` pauses when DevTools is open. **Conditional breakpoints** (right-click a line) pause only when e.g. `item.id === 3`.",
      "Log with labels and objects: `console.log('cart', { items, total })`. Use `console.table`, `console.trace`.",
      "A log in the component body runs **every render** (twice in dev with Strict Mode). Log in handlers/effects for one-off events.",
      "React 19 logs uncaught errors with a **component stack**; `createRoot(el, { onUncaughtError, onCaughtError })` lets you report them.",
      "Rendering crashes blank the page: wrap risky parts in an **error boundary**."
    ],
    code: { file: "src/Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk', price: 1.2, qty: 1 },
    { id: 2, name: 'Eggs', price: 2.5, qty: 2 },
  ]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  console.log('[Cart render]', { count: items.length, total });

  function addOne(id) {
    debugger; // pauses here when DevTools is open
    setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  }

  return (
    <ul>
      {items.map((i) => (
        <li key={i.id}>
          {i.name} × {i.qty} <button onClick={() => addOne(i.id)}>+</button>
        </li>
      ))}
      <li>Total: £{total.toFixed(2)}</li>
    </ul>
  );
}`, walk: [
      { lines: [9], note: "Derived value: put a breakpoint here to check the maths for each render." },
      { lines: [10], note: "Labelled log with an object. Runs every render, and twice in dev (Strict Mode)." },
      { lines: [13], note: "`debugger` stops in Sources. Hover `id` and `items`, step over with F10. Remove before committing." },
      { lines: [14], note: "Immutable update: new array, new item object. A mutation here would be a classic \"UI didn't update\" bug." }
    ]},
    output: "[Cart render] { count: 2, total: 6.2 }\n[Cart render] { count: 2, total: 6.2 }   ← dev only (Strict Mode)\nClick + on Milk → paused in debugger → resume → total 7.40",
    mistakes: [
      { bad: `setItems([...items, newItem]);\nconsole.log(items); // "still old value?!"`, good: `const next = [...items, newItem];\nsetItems(next);\nconsole.log(next);`, why: "State is a snapshot: logging right after the setter shows the old value. Log the value you computed, or log in the next render." },
      { bad: `console.log(cart);\n// expand later: shows today's values, not then`, good: `console.log(JSON.stringify(cart));\n// or structuredClone(cart)`, why: "The console shows a live reference to objects; expanding later can show values mutated after the log." },
      { bad: `// dismiss the overlay and keep clicking`, good: `// read the first line + file:line, fix it, save`, why: "The first error is usually the cause; later ones are side effects. The overlay points at the exact line." }
    ],
    practice: [
      { level: "B", q: "Pause your code when the **Add** button is clicked.", a: "Put `debugger;` at the start of the click handler (DevTools open) or click the line number in Sources." },
      { level: "B", q: "Why does your render log print twice in dev?", a: "Strict Mode renders components twice in development to catch impure code. Production prints once." },
      { level: "I", q: "Pause only when the item with id 7 is updated.", a: "Right-click the line number → **Add conditional breakpoint** → `id === 7`." },
      { level: "C", q: "Report uncaught React errors to a monitoring service.", a: "Pass error callbacks to `createRoot` (React 19+).", code: `createRoot(document.getElementById('root'), {\n  onUncaughtError(error, info) {\n    sendToMonitoring(error, info.componentStack);\n  },\n}).render(<App />);` }
    ],
    quiz: [
      { q: "What does `debugger;` do?", options: ["Prints the call stack", "Pauses execution when DevTools is open", "Throws an error"], answer: 1, why: "It acts as a breakpoint written in code." },
      { q: "A `console.log` in the component body prints twice per change in dev. Why?", options: ["A bug in your code", "Strict Mode double-renders in development", "HMR duplicates logs"], answer: 1, why: "Strict Mode intentionally renders twice in dev only." },
      { q: "Where should you look first when a list shows no data?", options: ["Rewrite the component", "Network tab: status and response of the fetch", "Clear node_modules"], answer: 1, why: "Confirm the data arrived before debugging rendering." }
    ],
    rev: {
      sec30: "Read the error (Vite overlay / console with component stack), reproduce, pause with breakpoints or `debugger`, inspect variables, the call stack, React DevTools and Network, then fix and verify. Log with labels; body logs run every render and twice in dev. Error boundaries and `createRoot` error callbacks handle crashes in production.",
      interview: [
        { level: "basic", q: "How do you set a breakpoint in a React app?", a: "Click a line number in DevTools Sources (source maps show the original JSX) or add `debugger;` in the code." },
        { level: "intermediate", q: "State didn't update after `setX`, according to my log. Why?", a: "State is a snapshot per render; the variable keeps its old value until the next render. Log in the next render or log the computed value." },
        { level: "intermediate", q: "What's a conditional breakpoint?", a: "A breakpoint with an expression; it pauses only when the expression is true, e.g. a specific item id in a loop." },
        { level: "advanced", q: "How do you capture React errors in production?", a: "Error boundaries for render errors in subtrees, plus React 19's `onUncaughtError` / `onCaughtError` root options, sending to a monitoring tool like Sentry." },
        { level: "tricky", q: "Your effect fetches twice in dev. Bug or not?", a: "Strict Mode mounts, unmounts and remounts in dev. It's a check that your cleanup works; production runs once. Add an abort cleanup or use a data library." }
      ],
      debug: [
        { code: `function addItem(item) {\n  items.push(item);\n  setItems(items);\n}`, fix: `function addItem(item) {\n  setItems([...items, item]);\n}`, why: "Mutating and passing the same array reference makes React skip the update. Create a new array." }
      ],
      cheat: [
        "Read the first error + file:line before anything else",
        "`debugger;` or click a line number in Sources",
        "Conditional breakpoint: right-click line → expression",
        "Label logs: `console.log('cart', { items })`",
        "Body logs run every render (twice in dev)",
        "Logs after `setX` show the old snapshot",
        "React 19: `createRoot(el, { onUncaughtError })`"
      ]
    },
    related: ["ENV-013", "ENV-014", "ADV-004"]
  }
};
