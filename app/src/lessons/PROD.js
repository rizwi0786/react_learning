export default {
  "PROD-001": {
    tldr: "A production build (release build) turns your source into small, fast files in `dist/`. Always **preview** that exact output locally and run a quick checklist before you ship it.",
    analogy: { icon: "🍰", text: "A bakery tastes the cake from the **actual oven batch** before it goes in the shop window, not the raw batter they tasted while mixing." },
    visual: { type: "flow", title: "From source to a verified release", steps: [
      { label: "npm ci", detail: "Install the **exact** versions from `package-lock.json`. Same deps as CI." },
      { label: "npm run build", detail: "`vite build` bundles, minifies and hashes files into `dist/`." },
      { label: "npm run preview", detail: "Serves `dist/` at `localhost:4173`, like a real static server." },
      { label: "Verify", detail: "Click key flows, refresh deep links, check console, env values and bundle sizes." },
      { label: "Ship", detail: "Upload `dist/` (or build in CI). Same files you just tested." }
    ]},
    points: [
      "`npm run dev` is **not** production: no minifying, extra warnings, Strict Mode double renders and effects (dev only).",
      "Build output: `index.html` + `assets/` with **hashed** names like `index-Bk3a9Q.js`, so browsers can cache them forever.",
      "`vite preview` is for checking the build locally. It is **not** a production server.",
      "Verify checklist: no console errors, deep-link refresh works, API URL is the prod one, sizes look sane.",
      "Like `dotnet publish -c Release`: a different output from what you debug with."
    ],
    code: { file: "terminal", lang: "bash", src: `# 1. Clean install, exactly as the lockfile says
npm ci

# 2. Build the release into dist/
npm run build
# dist/index.html                 0.46 kB
# dist/assets/index-D8f2c1.css    4.10 kB │ gzip: 1.4 kB
# dist/assets/index-Bk3a9Q.js   192.30 kB │ gzip: 61.2 kB

# 3. Serve dist/ locally like a static host
npm run preview
#  ➜  Local: http://localhost:4173/

# 4. Check: open /cart directly and refresh,
#    watch the console, check the Network tab`, walk: [
      { lines: [2], note: "`npm ci` deletes `node_modules` and installs exactly the locked versions. Use it in CI too." },
      { lines: [5], note: "Runs `vite build`. Output goes to `dist/` (change with `build.outDir`)." },
      { lines: [6, 7, 8], note: "Vite prints each file with its gzip size. A sudden jump means a heavy import slipped in." },
      { lines: [11, 12], note: "`vite preview` serves the built files on port 4173." },
      { lines: [14, 15], note: "Refresh a deep link and watch the console: the two things dev mode hides most often." }
    ]},
    output: "A `dist/` folder with `index.html` and an `assets/` folder of hashed `.js` and `.css` files, served at http://localhost:4173/.",
    mistakes: [
      { bad: `# Testing only in dev, then deploying\nnpm run dev\n# looks fine, ship it!`, good: `npm run build\nnpm run preview\n# test the real output, then ship`, why: "Minifying, env values, base paths and tree-shaking only happen in the build. Bugs there never show in `npm run dev`." },
      { bad: `# Using preview as the live server\nnpm run preview -- --host`, good: `# Upload dist/ to a static host\n# (Vercel, Netlify, Nginx, S3...)`, why: "`vite preview` is a local check tool, not hardened or tuned for real traffic." }
    ],
    practice: [
      { level: "B", q: "Build your shop app and find the main JS file. What is odd about its name?", a: "It has a content hash (e.g. `index-Bk3a9Q.js`). The hash changes only when the content changes, so it can be cached for a long time." },
      { level: "B", q: "Which port does `npm run preview` use by default?", a: "4173 (dev uses 5173)." },
      { level: "I", q: "Write a 5-item release checklist for a todo app.", a: "Add/complete/delete a todo; refresh `/todos/3` directly; no console errors; Network calls go to the prod API; bundle size close to last release." },
      { level: "C", q: "Add an npm script that builds and previews in one go.", a: "Chain them with `&&`.", code: `"scripts": {\n  "release:check": "vite build && vite preview"\n}` }
    ],
    quiz: [
      { q: "Why do built files have names like `index-Bk3a9Q.js`?", options: ["To hide the source code", "So browsers can cache them safely; a new build gets a new name", "Vite adds random names for security", "It is the git commit id"], answer: 1, why: "The hash comes from the file content. Changed content means a new URL, so long caching is safe." },
      { q: "Strict Mode double-renders components in production too.", options: ["True", "False"], answer: 1, why: "The double render and double effect run only in development." },
      { q: "What is `vite preview` for?", options: ["Serving the app to real users", "Hot reloading while coding", "Checking the built `dist/` locally", "Running unit tests"], answer: 2, why: "It serves the production output locally. Use a real host for users." }
    ],
    rev: {
      sec30: "`npm run build` (vite build) creates an optimised `dist/` folder: minified, tree-shaken, with content-hashed asset names. Use `npm ci` for repeatable installs, `npm run preview` to test the real output locally, and a short checklist (deep links, console, env, sizes) before deploying the same files.",
      interview: [
        { level: "basic", q: "What does `vite build` produce?", a: "A `dist/` folder with `index.html` and hashed, minified JS/CSS in `assets/`, ready for any static host." },
        { level: "intermediate", q: "How is the dev server different from the production build?", a: "Dev serves unbundled ES modules with HMR and extra warnings, plus Strict Mode double renders. The build bundles, minifies, tree-shakes and hashes. Some bugs only appear in the build." },
        { level: "intermediate", q: "Why `npm ci` instead of `npm install` for releases?", a: "`npm ci` installs exactly what the lockfile says and fails if `package.json` and the lockfile disagree, so every build uses identical dependencies." },
        { level: "advanced", q: "Why content hashes in file names?", a: "They allow `Cache-Control: immutable` for a year on assets. A new deploy changes the hash, so users get new files while `index.html` (not cached) points to them." },
        { level: "tricky", q: "The app works in dev but shows a blank page after deploy. First checks?", a: "Open the console and Network tab: usually a wrong `base` path (assets 404), a missing `VITE_` env value, or the host not falling back to `index.html`." }
      ],
      scenario: [
        { q: "QA says the build is fine locally but a route 404s on refresh in production. Why did preview not catch it?", a: "`vite preview` already falls back to `index.html`; the real host doesn't. Configure an SPA fallback on the host (rewrite to `index.html`)." }
      ],
      cheat: [
        "`npm ci` → `npm run build` → `npm run preview` → verify → ship",
        "Output in `dist/`; assets have content hashes",
        "Preview runs on port 4173; dev on 5173",
        "`vite preview` is for local checks, not real traffic",
        "Strict Mode double render/effect: dev only",
        "Check deep-link refresh, console, env values, bundle size"
      ]
    },
    related: ["ENV-010", "PROD-002", "PROD-003", "PROD-010"]
  },

  "PROD-002": {
    tldr: "One codebase, several places to run (dev, staging, production). Vite reads a different `.env` file per **mode**, and only `VITE_` values reach the browser. They are baked in at **build time**, so never put secrets there.",
    analogy: { icon: "🍕", text: "One pizza recipe, three kitchens: home, test kitchen, restaurant. The recipe stays the same; only the address for deliveries and the oven setting change per kitchen." },
    visual: { type: "layers", title: "Which .env wins (top beats bottom)", items: [
      { label: ".env.[mode].local", detail: "Your machine only, for this mode. Git-ignored." },
      { label: ".env.[mode]", detail: "e.g. `.env.staging`, `.env.production`. Committed. No secrets." },
      { label: ".env.local", detail: "Your machine only, all modes. Git-ignored." },
      { label: ".env", detail: "Shared defaults for every mode." }
    ]},
    points: [
      "`vite` uses mode `development`; `vite build` uses `production`; `vite build --mode staging` loads `.env.staging`.",
      "Only variables starting with `VITE_` are exposed, via `import.meta.env.VITE_*`.",
      "Values are **replaced into the bundle at build time**. Change one = rebuild. Anyone can read them in DevTools.",
      "Built-ins: `import.meta.env.MODE`, `.DEV`, `.PROD`, `.BASE_URL`.",
      "Need one build for many environments? Load runtime config (e.g. `fetch('/config.json')`) at startup.",
      "Like `appsettings.{Environment}.json`, except the result ships to the browser, so it's public."
    ],
    code: { file: "src/config.js", lang: "js", src: `// .env.staging  →  VITE_API_URL=https://staging-api.myshop.test
// .env.production → VITE_API_URL=https://api.myshop.test

const env = import.meta.env;

export const config = {
  apiUrl: env.VITE_API_URL,
  shopName: env.VITE_SHOP_NAME ?? 'My Shop',
  mode: env.MODE,   // 'development' | 'staging' | 'production'
  isProd: env.PROD, // true in any 'vite build'
};

// Fail loudly at startup instead of calling "undefined/products"
if (!config.apiUrl) {
  throw new Error('VITE_API_URL is missing. Check your .env files.');
}

// package.json scripts:
// "build": "vite build",
// "build:staging": "vite build --mode staging"`, walk: [
      { lines: [1, 2], note: "One file per mode. Same variable name, different value." },
      { lines: [4, 7], note: "Read env in **one** module; the rest of the app imports `config`." },
      { lines: [9, 10], note: "`MODE` is the mode name; `PROD` is true for builds, even with `--mode staging`." },
      { lines: [14, 15, 16], note: "Validate early so a missing value fails fast, not on the first fetch." },
      { lines: [19, 20], note: "`--mode staging` makes Vite load `.env.staging`." }
    ]},
    output: "In a staging build, `config.apiUrl` is `https://staging-api.myshop.test` and `config.mode` is `staging`.",
    mistakes: [
      { bad: `# .env\nVITE_STRIPE_SECRET_KEY=sk_live_123`, good: `# .env (public, ends up in the bundle)\nVITE_STRIPE_PUBLISHABLE_KEY=pk_live_123\n# secret key lives only on the server`, why: "Every `VITE_` value is inlined into the JS that users download. Secrets belong on a backend." },
      { bad: `const url = process.env.REACT_APP_API_URL;`, good: `const url = import.meta.env.VITE_API_URL;`, why: "`process.env.REACT_APP_*` is the old Create React App (deprecated) style. Vite uses `import.meta.env` and the `VITE_` prefix." }
    ],
    practice: [
      { level: "B", q: "Add `VITE_SHOP_NAME=Corner Shop` and show it in the header.", a: "Put it in `.env`, restart dev, render `{import.meta.env.VITE_SHOP_NAME}`." },
      { level: "B", q: "Why is `import.meta.env.DB_PASSWORD` undefined?", a: "It lacks the `VITE_` prefix, so Vite doesn't expose it (that's a safety feature)." },
      { level: "I", q: "Add a `build:staging` script and a `.env.staging` file.", a: "`\"build:staging\": \"vite build --mode staging\"` plus `.env.staging` with the staging API URL." },
      { level: "C", q: "Ship one build to staging and prod with different API URLs.", a: "Serve a `config.json` per environment and fetch it before rendering.", code: `const cfg = await fetch('/config.json').then(r => r.json());\ncreateRoot(document.getElementById('root')).render(<App config={cfg} />);` }
    ],
    quiz: [
      { q: "You change `VITE_API_URL` on the server after deploying. What happens?", options: ["The app picks it up on next page load", "Nothing until you rebuild", "Vite hot-reloads it in production"], answer: 1, why: "Values are replaced into the bundle at build time." },
      { q: "Which variable can the browser code read?", options: ["`API_SECRET`", "`VITE_API_URL`", "`REACT_APP_API_URL`", "All of them"], answer: 1, why: "Only `VITE_`-prefixed vars are exposed by default." },
      { q: "`vite build --mode staging` loads which file on top of `.env`?", options: ["`.env.production`", "`.env.staging`", "`.env.development`"], answer: 1, why: "The mode name picks the `.env.[mode]` file." }
    ],
    rev: {
      sec30: "Vite modes select env files: `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local` (more specific wins). Only `VITE_` vars are exposed through `import.meta.env`, and they're inlined at build time, so they're public and need a rebuild to change. Use runtime config if one build must serve many environments.",
      interview: [
        { level: "basic", q: "How do you read an env variable in a Vite app?", a: "`import.meta.env.VITE_NAME`. Only `VITE_`-prefixed variables are exposed to client code." },
        { level: "intermediate", q: "How do you build for staging?", a: "Create `.env.staging` and run `vite build --mode staging`. `MODE` becomes `staging`; `PROD` is still true." },
        { level: "advanced", q: "Build-time vs runtime config?", a: "Build-time is simple but needs one build per environment. Runtime config (a fetched `config.json` or injected script) lets one tested artifact move from staging to prod unchanged." },
        { level: "tricky", q: "Is it safe to put an API key in `.env.local` since it's git-ignored?", a: "Not if it's `VITE_`-prefixed: git-ignored only keeps it out of the repo; the build still inlines it into public JS." }
      ],
      compare: { cols: ["", "Build-time (`.env`)", "Runtime (`config.json`)"], rows: [
        ["Change a value", "Rebuild", "Edit file, reload"],
        ["Builds needed", "One per environment", "One for all"],
        ["Setup", "Built into Vite", "Fetch before render"]
      ]},
      cheat: [
        "`VITE_` prefix = exposed to the browser",
        "Read with `import.meta.env.VITE_*`",
        "Order: `.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local`",
        "`vite build --mode staging` → `.env.staging`",
        "Inlined at build time: public, rebuild to change",
        "Never put secrets in client env vars"
      ]
    },
    related: ["ENV-011", "SEC-010", "API-019", "PROD-001"]
  },

  "PROD-003": {
    tldr: "Build optimisation means shipping fewer, smaller, better-cached bytes. **Measure** the bundle, split code users don't need yet, keep vendor code in its own long-lived chunk, and tune Vite's `build` options.",
    analogy: { icon: "🧳", text: "Packing for a trip: weigh the suitcase first, leave out what you won't use on day one, and keep toiletries in their own bag so you don't repack them every trip." },
    visual: { type: "flow", title: "The optimisation loop", steps: [
      { label: "Measure", detail: "Read `vite build` sizes; open a bundle visualiser treemap." },
      { label: "Find the heavy part", detail: "A huge chart lib on the home page? A whole icon set for 3 icons?" },
      { label: "Split", detail: "`lazy(() => import(...))` routes and rarely used widgets." },
      { label: "Group vendors", detail: "Put `node_modules` in a `vendor` chunk that changes rarely and stays cached." },
      { label: "Re-measure", detail: "Compare gzip sizes and LCP. Keep only changes that helped." }
    ]},
    points: [
      "Vite 8 bundles with **Rolldown** and minifies with **Oxc** by default. Configure it via `build.rolldownOptions` (`rollupOptions` is a deprecated alias).",
      "Biggest win is usually **code splitting**: dynamic `import()` for routes and heavy widgets.",
      "Manual chunking: `output.codeSplitting.groups` (Rolldown). The old `manualChunks` object form is gone in Vite 8.",
      "Import only what you use (`import debounce from 'lodash-es/debounce'`) so tree-shaking can drop the rest.",
      "`build.target` defaults to Baseline widely-available browsers; `sourcemap: 'hidden'` gives maps without exposing them.",
      "The 500 kB chunk warning is a hint to split, not an error to silence."
    ],
    code: { file: "vite.config.js", lang: "js", src: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'hidden',          // maps for error tools, no public link
    chunkSizeWarningLimit: 500,   // kB, uncompressed
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // React rarely changes → long-cached chunk
            { name: 'react', test: /node_modules[\\\\/](react|react-dom|scheduler)[\\\\/]/, priority: 20 },
            // other libraries
            { name: 'vendor', test: /node_modules/, priority: 10 },
          ],
        },
      },
    },
  },
});`, walk: [
      { lines: [7], note: "`'hidden'` emits `.map` files but no `sourceMappingURL` comment. Upload them to your error tool." },
      { lines: [8], note: "Keep the default warning. If it fires, split code instead of raising the limit." },
      { lines: [9, 10, 11], note: "Vite 8 passes these options to Rolldown." },
      { lines: [14], note: "Higher `priority` wins: React and friends get their own chunk before the `vendor` catch-all." },
      { lines: [16], note: "Everything else from `node_modules` lands in `vendor`. Your app code changes; vendor stays cached." }
    ]},
    output: "`dist/assets/` now contains `react-[hash].js`, `vendor-[hash].js` and smaller app chunks instead of one large `index-[hash].js`.",
    mistakes: [
      { bad: `build: { chunkSizeWarningLimit: 5000 }`, good: `const Charts = lazy(() => import('./Charts.jsx'));`, why: "Raising the limit hides the problem. Split the heavy code so the first page loads less." },
      { bad: `import _ from 'lodash';\n_.debounce(save, 300);`, good: `import debounce from 'lodash-es/debounce';\ndebounce(save, 300);`, why: "Importing the whole CommonJS library ships all of it. ES module imports of one function tree-shake." }
    ],
    practice: [
      { level: "B", q: "Run `npm run build`. Which file is the largest (gzip)?", a: "Read the size table Vite prints; usually the main `index-*.js` or a vendor chunk." },
      { level: "I", q: "Make the admin reports page load only when visited.", a: "Use `lazy` + `Suspense`.", code: `const Reports = lazy(() => import('./pages/Reports.jsx'));\n<Suspense fallback={<p>Loading…</p>}><Reports /></Suspense>` },
      { level: "I", q: "See what's inside your bundle visually.", a: "Add a visualiser plugin (e.g. `rollup-plugin-visualizer`) or run `npx vite-bundle-visualizer`, then look for big unexpected boxes." },
      { level: "C", q: "Why can a single `vendor` chunk sometimes be worse?", a: "If any library updates, the whole vendor chunk's hash changes and every user re-downloads it. Splitting stable libs (React) from fast-changing ones keeps more cache hits." }
    ],
    quiz: [
      { q: "In Vite 8, where do bundler output options go?", options: ["`build.rolldownOptions`", "`build.webpack`", "`server.output`", "`optimizeDeps`"], answer: 0, why: "Vite 8 uses Rolldown; `rollupOptions` still works as a deprecated alias." },
      { q: "What usually gives the biggest first-load win?", options: ["Raising `chunkSizeWarningLimit`", "Lazy-loading routes and heavy widgets", "Turning off minification", "Inline sourcemaps"], answer: 1, why: "Code users don't need for the first screen shouldn't be in the first download." },
      { q: "Why give React its own chunk?", options: ["React requires it", "It changes rarely, so browsers keep it cached across deploys", "It makes React run faster"], answer: 1, why: "Stable chunk = stable hash = cache hit on every new release." }
    ],
    rev: {
      sec30: "Measure first (Vite size table, visualiser). Then lazy-load routes and heavy widgets, import only what you use for tree-shaking, and group vendor code into stable chunks via `build.rolldownOptions.output.codeSplitting` in Vite 8. Use `sourcemap: 'hidden'` for error tools. Re-measure after every change.",
      interview: [
        { level: "basic", q: "How do you find what makes a bundle big?", a: "Read the `vite build` size output and use a bundle visualiser treemap to spot large or duplicate dependencies." },
        { level: "intermediate", q: "What is tree-shaking and what breaks it?", a: "Dropping unused exports at build time. CommonJS modules, side-effectful imports and importing whole libraries (`import _ from 'lodash'`) block it." },
        { level: "advanced", q: "How do you split vendor code in Vite 8?", a: "Rolldown's `output.codeSplitting.groups` with `name` and `test` regex, under `build.rolldownOptions`. The `manualChunks` object form was removed and the function form is deprecated." },
        { level: "advanced", q: "Trade-off of many small chunks?", a: "Better caching and less unused code, but more requests and possible waterfalls. HTTP/2 helps; preload critical chunks and avoid splitting tiny pieces." },
        { level: "tricky", q: "The chunk warning fires. Is raising the limit fine?", a: "Rarely. It's a signal that the first load is heavy; fix it with code splitting unless the chunk is genuinely needed up front." }
      ],
      cheat: [
        "Measure → split → group vendors → re-measure",
        "Vite 8: Rolldown bundler, Oxc minifier",
        "`build.rolldownOptions` (`rollupOptions` = deprecated alias)",
        "Manual chunks: `output.codeSplitting.groups`",
        "`lazy(() => import())` for routes and heavy widgets",
        "`sourcemap: 'hidden'` for error tools",
        "Import single functions, not whole libraries"
      ]
    },
    related: ["PERF-011", "PERF-010", "ADV-013", "PROD-001"]
  },

  "PROD-004": {
    tldr: "Where your app lives decides how it's served. **Static** hosting serves pre-built files from a CDN; **server** hosting runs Node to render pages per request; **edge** runs small functions in data centres close to each user.",
    analogy: { icon: "🥪", text: "Static = pre-made sandwiches on a shelf (instant). Server = a cook makes each order (fresh, slower). Edge = small kiosks in every neighbourhood doing quick custom touches." },
    visual: { type: "compare", title: "Static vs server hosting", left: { label: "Static / CDN", tone: "good", points: [
      "Serves `dist/` files as-is",
      "Cheap, fast, scales by itself",
      "Perfect for Vite SPAs",
      "Needs an SPA fallback to `index.html`",
      "No per-request code"
    ]}, right: { label: "Server (Node) / Edge", tone: "neutral", points: [
      "Runs code on each request",
      "Needed for SSR, streaming, Server Actions",
      "Fresh HTML per user = better SEO",
      "More cost and ops; cold starts",
      "Edge: near users, limited runtime"
    ]}},
    points: [
      "A Vite + React SPA is just files: **static hosting** is the default choice (Vercel, Netlify, GitHub Pages, S3 + CloudFront, Nginx).",
      "**Server hosting** is needed when HTML is rendered per request (SSR in Next.js or React Router framework mode: framework-only).",
      "**Edge** functions run in many regions: great for redirects, auth checks, A/B tests, light SSR. Limited APIs (no full Node in some).",
      "All static hosts need the **SPA fallback**: unknown paths return `index.html` so the router can handle `/cart`.",
      "Cache rule: hashed assets cached long; `index.html` revalidated every time."
    ],
    code: { file: "decide-hosting.js", lang: "js", src: `// A tiny decision helper for a new project
function pickHosting(app) {
  if (app.usesServerRendering || app.usesServerActions) {
    return 'server (Node) or a platform that runs your framework';
  }
  if (app.needsPerRequestLogicNearUsers) {
    return 'static + edge functions';
  }
  return 'static hosting / CDN';
}

console.log(pickHosting({ name: 'todo SPA (Vite)' }));
// → 'static hosting / CDN'

console.log(pickHosting({ name: 'recipe blog', usesServerRendering: true }));
// → 'server (Node) or a platform that runs your framework'

console.log(pickHosting({ name: 'shop', needsPerRequestLogicNearUsers: true }));
// → 'static + edge functions'`, walk: [
      { lines: [3, 4, 5], note: "SSR and Server Actions need running server code (framework-only features)." },
      { lines: [6, 7, 8], note: "Geo redirects, auth gates or A/B tests can run at the edge in front of static files." },
      { lines: [9], note: "Everything else: plain static files. Cheapest and fastest." },
      { lines: [12, 13], note: "A Vite SPA is the classic static case." }
    ]},
    output: "static hosting / CDN\nserver (Node) or a platform that runs your framework\nstatic + edge functions",
    mistakes: [
      { bad: `// Express server just to serve dist/\napp.use(express.static('dist'));`, good: `// Upload dist/ to a static host / CDN\n// (plus SPA fallback to index.html)`, why: "A Node server for plain files adds cost and ops for no benefit. A CDN is faster and scales automatically." },
      { bad: `# Static host, no fallback\n/cart  → 404 on refresh`, good: `# Rewrite unknown paths\n/*  → /index.html (200)`, why: "The host looks for a `cart` file and fails. The fallback lets React Router handle the path." }
    ],
    practice: [
      { level: "B", q: "Your weather app is a Vite SPA. Which hosting type?", a: "Static hosting/CDN with an SPA fallback." },
      { level: "I", q: "A recipe site needs fresh HTML for SEO on every page. Which hosting?", a: "Server (or a platform that runs your SSR framework), or prerender pages at build time if they don't change per request." },
      { level: "I", q: "Name two good edge use cases for a shop.", a: "Redirect by country to the right store; block unauthenticated users from `/admin` before files load; A/B test headers." },
      { level: "C", q: "Why not cache `index.html` for a year like the assets?", a: "It isn't hashed. A long cache would keep users on old asset URLs after a deploy. Use `no-cache` so it revalidates." }
    ],
    quiz: [
      { q: "A Vite React SPA needs what kind of hosting?", options: ["A Node server", "Static file hosting", "A database server", "An edge function per page"], answer: 1, why: "The build is plain HTML, CSS and JS files." },
      { q: "Which feature needs server hosting?", options: ["Client-side routing", "Server-side rendering per request", "CSS modules", "`useState`"], answer: 1, why: "SSR runs code to make HTML for each request." },
      { q: "Main strength of edge functions?", options: ["Unlimited CPU time", "Running close to users with low latency", "Full Node.js APIs everywhere", "Free databases"], answer: 1, why: "They run in many regions, but with runtime limits." }
    ],
    rev: {
      sec30: "Static hosting serves pre-built files from a CDN: cheap, fast, ideal for Vite SPAs, but needs an SPA fallback. Server hosting runs code per request for SSR/Server Actions (framework-only). Edge runs lightweight functions near users for redirects, auth and personalisation. Pick the simplest that meets your needs.",
      interview: [
        { level: "basic", q: "Where would you host a Vite React SPA?", a: "On a static host or CDN (Vercel, Netlify, S3 + CloudFront, Nginx) with a fallback to `index.html`." },
        { level: "intermediate", q: "When do you need a server instead of static hosting?", a: "When HTML is rendered per request: SSR, streaming, Server Components or Server Actions in a framework like Next.js." },
        { level: "advanced", q: "Edge vs regional server: trade-offs?", a: "Edge has lower latency worldwide and fast starts but restricted runtimes and data far away. A regional server has full Node and sits near the database." },
        { level: "tricky", q: "Can a static site still have dynamic data?", a: "Yes. The SPA fetches data from APIs at runtime; only the HTML/JS files are static." }
      ],
      compare: { cols: ["", "Static", "Server", "Edge"], rows: [
        ["Runs code per request", "No", "Yes", "Yes (small)"],
        ["Best for", "SPAs, docs", "SSR apps", "Redirects, auth, A/B"],
        ["Cost / ops", "Lowest", "Highest", "Medium"]
      ]},
      cheat: [
        "Vite SPA = static files → static host / CDN",
        "SSR / Server Actions → server hosting (framework-only)",
        "Edge = small functions near users",
        "Static hosts need an SPA fallback to `index.html`",
        "Hashed assets: cache a year; `index.html`: no-cache"
      ]
    },
    related: ["INTRO-011", "INTRO-012", "NEXT-017", "PROD-007"]
  },

  "PROD-005": {
    tldr: "Vercel detects a Vite app, runs `npm run build`, and serves `dist/` from its CDN. Every push gets a **preview URL**; the main branch goes to **production**. Add one rewrite so client routes survive a refresh.",
    analogy: { icon: "📮", text: "A postal service that picks up your parcel from the door (git push), checks it, and delivers copies to every town. You get a tracking link for each parcel." },
    visual: { type: "flow", title: "Git push to live site", steps: [
      { label: "Import repo", detail: "Connect GitHub on vercel.com. Framework preset: **Vite** (auto-detected)." },
      { label: "Push a branch", detail: "Vercel builds it and posts a unique **preview URL** on the PR." },
      { label: "Build", detail: "Runs `npm run build`, takes `dist/` as output." },
      { label: "Merge to main", detail: "The same steps run for the **production** domain." },
      { label: "Roll back", detail: "One click promotes an older deployment if something breaks." }
    ]},
    points: [
      "Defaults for Vite: build command `npm run build`, output directory `dist`. Usually nothing to configure.",
      "Set `VITE_*` variables in **Project Settings → Environment Variables**, per environment (Production / Preview / Development).",
      "SPA routing: add `vercel.json` with a rewrite of all paths to `/index.html`.",
      "CLI: `vercel` makes a preview deploy; `vercel --prod` deploys to production.",
      "Changing an env var needs a **redeploy**, because Vite inlines it at build time."
    ],
    code: { file: "vercel.json", lang: "json", src: `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`, walk: [
      { lines: [2], note: "`rewrites` serve a different file without changing the URL in the address bar." },
      { lines: [3], note: "Any path that isn't a real file (like `/cart/42`) returns `index.html`. React Router then shows the right page." },
      { lines: [3], note: "Real files in `dist/` (like `/assets/index-*.js`) are still served directly first." }
    ]},
    output: "Refreshing https://my-shop.vercel.app/cart/42 shows the cart page instead of a 404.",
    mistakes: [
      { bad: `// Env var added in the dashboard,\n// site still shows the old API URL`, good: `// Add/change VITE_API_URL\n// → then Redeploy`, why: "Vite bakes env values into the bundle during the build. Only a new build picks up the change." },
      { bad: `// No vercel.json\n// /recipes/7 → 404 on refresh`, good: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`, why: "Without the rewrite, Vercel looks for a `recipes/7` file that doesn't exist." }
    ],
    practice: [
      { level: "B", q: "Deploy your todo app from the CLI as a preview.", a: "`npm i -g vercel`, then run `vercel` in the project folder and follow the prompts." },
      { level: "B", q: "Promote it to production.", a: "`vercel --prod`, or merge to the production branch if git is connected." },
      { level: "I", q: "Use a different API for preview deploys.", a: "Set `VITE_API_URL` with scope **Preview** to the staging API, and with scope **Production** to the live API." },
      { level: "C", q: "A bad release is live. Fastest fix?", a: "Instant rollback: promote the previous good deployment in the dashboard, then fix forward on a branch." }
    ],
    quiz: [
      { q: "What does Vercel give each pull request?", options: ["A new database", "A unique preview URL", "A Docker image", "Nothing until merged"], answer: 1, why: "Preview deployments let reviewers click through the real build." },
      { q: "Why add a rewrite to `/index.html`?", options: ["To speed up the build", "So deep links like `/cart` load the SPA on refresh", "To enable HTTPS", "To hide source maps"], answer: 1, why: "The router runs in the browser; the server must hand it `index.html` first." },
      { q: "You changed `VITE_API_URL` in settings. What else?", options: ["Nothing", "Clear your browser cache", "Redeploy"], answer: 2, why: "The value is inlined at build time." }
    ],
    rev: {
      sec30: "Connect the repo; Vercel auto-detects Vite (build `npm run build`, output `dist`). Branches and PRs get preview URLs, the production branch deploys live, and rollbacks are instant. Add a `vercel.json` rewrite to `/index.html` for client routing, and redeploy after env var changes.",
      interview: [
        { level: "basic", q: "How do you deploy a Vite app to Vercel?", a: "Import the Git repo; Vercel detects Vite and builds with `npm run build` into `dist`. Or run `vercel` / `vercel --prod` from the CLI." },
        { level: "intermediate", q: "What are preview deployments good for?", a: "Every branch/PR gets its own live URL, so QA and designers can test real builds before merging." },
        { level: "intermediate", q: "How do you fix 404s on refresh for client routes?", a: "Add a rewrite in `vercel.json` sending all paths to `/index.html`; static files still win." },
        { level: "tricky", q: "Env var updated but the site didn't change. Why?", a: "Vite inlines `VITE_*` at build time; you must trigger a new deployment." }
      ],
      cheat: [
        "Vite preset: `npm run build` → `dist`",
        "Every PR = preview URL; main = production",
        "`vercel` = preview, `vercel --prod` = production",
        "SPA fallback: `vercel.json` rewrite `/(.*)` → `/index.html`",
        "Env vars per scope; redeploy after changes",
        "Instant rollback by promoting an old deployment"
      ]
    },
    related: ["PROD-004", "PROD-006", "PROD-002", "NEXT-017"]
  },

  "PROD-006": {
    tldr: "Netlify builds your repo and serves `dist/` from its CDN. For an SPA, one redirect rule, `/* /index.html 200`, sends every unknown path to your app so React Router can take over.",
    analogy: { icon: "🗺️", text: "A shopping-centre info desk: whatever shop name you ask for, they send you to the one map at the entrance (`index.html`), and the map shows you the way." },
    visual: { type: "flow", title: "A refresh on /playlists/9", steps: [
      { label: "Browser asks", detail: "GET `/playlists/9` hits the Netlify CDN." },
      { label: "No such file", detail: "There is no `dist/playlists/9`. Normally this would be a 404." },
      { label: "Rule matches", detail: "`/* /index.html 200` rewrites the request (URL stays the same)." },
      { label: "App boots", detail: "`index.html` loads the JS bundle." },
      { label: "Router renders", detail: "React Router reads `/playlists/9` and shows that playlist." }
    ]},
    points: [
      "Settings: build command `npm run build`, publish directory `dist`.",
      "Put rules in `public/_redirects` (Vite copies `public/` into `dist/`) or in `netlify.toml`.",
      "Status **200** = rewrite (URL kept). **301/302** = real redirect (URL changes). SPAs need 200.",
      "Netlify serves real files first, so `/assets/*.js` are not rewritten.",
      "Deploy previews for PRs, env vars per context, and `netlify deploy --prod` from the CLI."
    ],
    code: { file: "netlify.toml", lang: "text", src: `[build]
  command = "npm run build"
  publish = "dist"

# SPA fallback: every unknown path → index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Same rule as a one-line public/_redirects file:
# /*    /index.html   200`, walk: [
      { lines: [1, 2, 3], note: "Tell Netlify how to build and which folder to publish." },
      { lines: [6, 7, 8], note: "Match any path and serve `index.html`." },
      { lines: [9], note: "`200` keeps the URL in the address bar (a rewrite), so the router sees `/playlists/9`." },
      { lines: [11, 12], note: "Alternative: a `_redirects` file in `public/`. Use one style, not both." }
    ]},
    output: "Refreshing https://my-music.netlify.app/playlists/9 shows playlist 9 instead of “Page not found”.",
    mistakes: [
      { bad: `/*    /index.html   301`, good: `/*    /index.html   200`, why: "A 301 changes the URL to `/index.html`, so the router loses the real path and every deep link goes home." },
      { bad: `# _redirects at the project root\n./_redirects`, good: `# Put it where Vite copies it to dist/\n./public/_redirects`, why: "Netlify reads `_redirects` from the published folder. Files in `public/` end up in `dist/`." }
    ],
    practice: [
      { level: "B", q: "Write the `_redirects` line for an SPA.", a: "`/*    /index.html   200`" },
      { level: "I", q: "Proxy `/api/*` to your backend to avoid CORS.", a: "Add a rule above the SPA one; rules are matched top to bottom.", code: `/api/*  https://api.myshop.test/:splat  200\n/*      /index.html                    200` },
      { level: "I", q: "Why must the `/api/*` rule come first?", a: "Netlify uses the first matching rule. `/*` would catch API calls and return HTML." },
      { level: "C", q: "Show a real 404 page for unknown routes with a 200 rewrite in place.", a: "The server always returns `index.html`, so render a `path=\"*\"` route in React Router with a not-found page." }
    ],
    quiz: [
      { q: "Which status code makes a rewrite on Netlify?", options: ["301", "302", "200", "404"], answer: 2, why: "200 serves the target but keeps the original URL." },
      { q: "Where should `_redirects` live in a Vite project?", options: ["`src/`", "`public/`", "`node_modules/`", "Project root only"], answer: 1, why: "`public/` is copied as-is into `dist/`, which Netlify publishes." },
      { q: "Does `/* /index.html 200` break loading `/assets/app.js`?", options: ["Yes, JS gets HTML", "No, existing files are served first"], answer: 1, why: "Netlify only applies the rule when no real file matches (unless you force it with `!`)." }
    ],
    rev: {
      sec30: "Netlify: build `npm run build`, publish `dist`. Add `/* /index.html 200` in `public/_redirects` or a `[[redirects]]` block in `netlify.toml`. 200 means rewrite (URL kept), which SPAs need; real files are served first. Order rules top to bottom, e.g. API proxy before the SPA fallback.",
      interview: [
        { level: "basic", q: "How do you deploy an SPA on Netlify?", a: "Connect the repo, set build `npm run build` and publish `dist`, and add the `/* /index.html 200` rule." },
        { level: "intermediate", q: "Rewrite vs redirect?", a: "A redirect (301/302) tells the browser to go to a new URL. A rewrite (200) serves different content at the same URL." },
        { level: "advanced", q: "How do you avoid CORS with Netlify?", a: "Add a proxy rewrite like `/api/* https://api.example.com/:splat 200` so the browser calls the same origin." },
        { level: "tricky", q: "With the SPA rule, does a missing page return HTTP 404?", a: "No, it returns 200 with `index.html`. The app must render its own not-found UI; for SEO you may want SSR or prerendering." }
      ],
      cheat: [
        "Build `npm run build`, publish `dist`",
        "`public/_redirects`: `/*  /index.html  200`",
        "200 = rewrite (URL kept); 301/302 = redirect",
        "Real files win over rules (unless forced with `!`)",
        "Rules match top to bottom: API proxy first",
        "Deploy previews per PR; `netlify deploy --prod`"
      ]
    },
    related: ["PROD-005", "PROD-007", "ROUTE-021", "API-020"]
  },

  "PROD-007": {
    tldr: "Plain file hosts like **GitHub Pages** and **S3** don't know about client routes. Set Vite's `base` for sub-folder sites, and add an SPA fallback: a `404.html` copy on Pages, or an error rule to `index.html` on S3/CloudFront.",
    analogy: { icon: "📚", text: "A library shelf only finds books by exact title. Ask for a chapter (`/notes/3`) and it says “not found”, unless the librarian is told: if in doubt, hand them the main book." },
    visual: { type: "compare", title: "Two static hosts, two fallbacks", left: { label: "GitHub Pages", tone: "neutral", points: [
      "Lives at `user.github.io/repo/`",
      "Set `base: '/repo/'` in Vite",
      "Router `basename` = `import.meta.env.BASE_URL`",
      "Fallback: copy `index.html` → `404.html`",
      "Deep links return HTTP 404 status (but render)"
    ]}, right: { label: "S3 + CloudFront", tone: "good", points: [
      "Upload `dist/` to a bucket",
      "CloudFront CDN in front, HTTPS",
      "Custom error response: 403/404 → `/index.html`, 200",
      "Set Cache-Control per file type",
      "Invalidate `/index.html` after deploy"
    ]}},
    points: [
      "Sub-folder hosting? Set `base: '/repo/'` in `vite.config.js`, or all assets 404.",
      "Pass `basename={import.meta.env.BASE_URL}` to `BrowserRouter` so routes match under `/repo/`.",
      "GitHub Pages trick: copy `dist/index.html` to `dist/404.html`; Pages shows it for unknown paths.",
      "S3 private bucket + CloudFront returns **403** for missing keys, so map both 403 and 404 to `/index.html` (200).",
      "No server config at all? `HashRouter` (`/#/notes/3`) always works, but URLs are uglier and worse for SEO."
    ],
    code: { file: "vite.config.js + main.jsx", lang: "jsx", src: `// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/notes-app/', // https://me.github.io/notes-app/
});

// src/main.jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
);

// package.json: copy index.html as the 404 fallback
// "build": "vite build && cp dist/index.html dist/404.html"`, walk: [
      { lines: [7], note: "All asset URLs get the `/notes-app/` prefix. Without it the page loads blank." },
      { lines: [12], note: "React Router 7 imports from `react-router`." },
      { lines: [16], note: "`BASE_URL` equals `base`, so routes like `/notes/3` match under `/notes-app/`." },
      { lines: [21, 22], note: "GitHub Pages serves `404.html` for unknown paths; it boots the same app." }
    ]},
    output: "https://me.github.io/notes-app/notes/3 loads the app and shows note 3, even on refresh.",
    mistakes: [
      { bad: `export default defineConfig({ plugins: [react()] });\n// deployed to me.github.io/notes-app/`, good: `export default defineConfig({\n  plugins: [react()],\n  base: '/notes-app/',\n});`, why: "Without `base`, the HTML asks for `/assets/...` at the domain root, which doesn't exist." },
      { bad: `CloudFront error page: 404 → /index.html\n(bucket is private)`, good: `403 → /index.html (200)\n404 → /index.html (200)`, why: "Private S3 origins answer missing keys with 403 Access Denied, so the 404 rule never fires." }
    ],
    practice: [
      { level: "B", q: "Your repo is `recipe-box`. What `base` do you set?", a: "`base: '/recipe-box/'` (slashes on both sides)." },
      { level: "I", q: "Add the 404 fallback to the build script (cross-platform).", a: "Use Node to copy.", code: `"build": "vite build && node -e \\"require('fs').copyFileSync('dist/index.html','dist/404.html')\\""` },
      { level: "I", q: "Which files need a CloudFront invalidation after deploy?", a: "Mainly `/index.html` (and other un-hashed files). Hashed assets have new names anyway." },
      { level: "C", q: "When is `HashRouter` the right choice?", a: "When you can't configure fallbacks at all (some intranet file servers). The server only ever sees `/`." }
    ],
    quiz: [
      { q: "Site at `me.github.io/shop/` loads blank; console shows 404 for `/assets/index.js`. Fix?", options: ["Use HashRouter", "Set `base: '/shop/'`", "Rename the repo", "Disable minify"], answer: 1, why: "Assets are requested from the domain root without the base path." },
      { q: "Why map 403 to `/index.html` on CloudFront + private S3?", options: ["S3 returns 403 for missing objects when listing isn't allowed", "403 means slow", "It enables HTTPS"], answer: 0, why: "A private bucket hides whether a key exists by returning 403." },
      { q: "How does the GitHub Pages `404.html` trick work?", options: ["Pages redirects to the home page", "Pages serves `404.html` for unknown paths; it's a copy of your app", "It disables routing"], answer: 1, why: "The copied app boots and the router reads the URL." }
    ],
    rev: {
      sec30: "Static file hosts need two things for SPAs: the right `base` (for sub-paths like GitHub Pages project sites) plus a matching router `basename`, and a fallback to `index.html` for unknown paths: `404.html` copy on Pages, CloudFront custom error responses (403 and 404 → `/index.html`, 200) on S3. Invalidate `index.html` after deploys.",
      interview: [
        { level: "basic", q: "Why does a GitHub Pages project site need `base`?", a: "It's served from `/repo/`, so asset URLs must include that prefix." },
        { level: "intermediate", q: "How do you host an SPA on S3?", a: "Upload `dist/`, put CloudFront in front, add custom error responses mapping 403/404 to `/index.html` with 200, and set cache headers." },
        { level: "advanced", q: "Downside of the `404.html` trick?", a: "Deep links return HTTP 404 status while rendering fine, which hurts SEO and monitoring. Fine for demos and portfolios." },
        { level: "tricky", q: "Deployed a new version to S3 but users still see the old one. Why?", a: "CloudFront (or the browser) cached `index.html`. Invalidate it and serve it with `Cache-Control: no-cache`." }
      ],
      cheat: [
        "Sub-path host → `base: '/repo/'`",
        "Router: `basename={import.meta.env.BASE_URL}`",
        "GitHub Pages fallback: copy `index.html` → `404.html`",
        "S3 + CloudFront: 403 & 404 → `/index.html`, 200",
        "Invalidate `/index.html` after each deploy",
        "No config possible → `HashRouter`"
      ]
    },
    related: ["PROD-004", "PROD-006", "ROUTE-005", "PROD-011"]
  },

  "PROD-008": {
    tldr: "Nginx is a fast web server that can serve your `dist/` folder. `try_files $uri $uri/ /index.html` gives the SPA fallback, and smart **cache headers** keep hashed assets cached for a year while `index.html` is always fresh.",
    analogy: { icon: "🧑‍🍳", text: "A waiter: “Have we got that dish? Serve it. No? Bring the menu (`index.html`).” Bread rolls (hashed assets) never change, so the table can keep them; the menu is checked fresh every visit." },
    visual: { type: "flow", title: "try_files for GET /recipes/7", steps: [
      { label: "$uri", detail: "Is there a file `dist/recipes/7`? No." },
      { label: "$uri/", detail: "Is there a folder `dist/recipes/7/` with an index? No." },
      { label: "/index.html", detail: "Serve `index.html` with status 200." },
      { label: "Browser", detail: "Loads JS; React Router renders recipe 7." }
    ]},
    points: [
      "`root` points at the built files; `try_files` tries each option left to right.",
      "Hashed files under `/assets/`: `Cache-Control: public, max-age=31536000, immutable`.",
      "`index.html`: `Cache-Control: no-cache` so a new deploy is picked up on next load.",
      "Turn on `gzip` (or Brotli) for text assets; HTTP/2 needs TLS.",
      "Real 404 for missing files under `/assets/` avoids returning HTML for a missing JS file.",
      "Same job as IIS URL Rewrite for SPAs in the .NET world."
    ],
    code: { file: "nginx.conf", lang: "text", src: `server {
  listen 80;
  server_name shop.example.com;
  root /usr/share/nginx/html;   # contents of dist/
  index index.html;

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  # Hashed assets: cache for a year, never revalidate
  location /assets/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  # index.html: always check for a new version
  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  # SPA fallback: unknown paths → index.html
  location / {
    try_files $uri $uri/ /index.html;
  }
}`, walk: [
      { lines: [4, 5], note: "Serve the files Vite put in `dist/`." },
      { lines: [7, 8], note: "Compress text responses. HTML is gzipped by default." },
      { lines: [11, 12, 13], note: "Missing asset = real 404, not HTML. Found asset = cached for a year." },
      { lines: [17, 18, 19], note: "`no-cache` means “revalidate before using”, not “never store”." },
      { lines: [22, 23, 24], note: "File? Folder? Otherwise hand over `index.html` and let React Router decide." }
    ]},
    output: "`/assets/index-Bk3a9Q.js` → 200 with a 1-year cache. `/recipes/7` → 200 `index.html`. `/assets/missing.js` → 404.",
    mistakes: [
      { bad: `location / {\n  try_files $uri /index.html;\n  add_header Cache-Control "max-age=31536000";\n}`, good: `location /assets/ { ...immutable... }\nlocation = /index.html { add_header Cache-Control "no-cache"; }`, why: "Caching `index.html` for a year keeps users on the old version, pointing at asset files that may be gone." },
      { bad: `location / {\n  try_files $uri $uri/ =404;\n}`, good: `location / {\n  try_files $uri $uri/ /index.html;\n}`, why: "`=404` breaks every deep link refresh in an SPA." }
    ],
    practice: [
      { level: "B", q: "What does `try_files $uri $uri/ /index.html` do for `/about`?", a: "Looks for file `/about`, then folder `/about/`, then serves `/index.html`." },
      { level: "I", q: "Proxy `/api/` to a backend on port 5000.", a: "Add a `location` with `proxy_pass`.", code: `location /api/ {\n  proxy_pass http://localhost:5000/;\n}` },
      { level: "I", q: "Check the headers you set.", a: "`curl -I http://localhost/assets/index-xyz.js` and look for `Cache-Control`." },
      { level: "C", q: "Why can `add_header` in a nested `location` drop headers from `server`?", a: "Nginx only inherits `add_header` if the inner block defines none. Repeat shared security headers in each block (or use an include file)." }
    ],
    quiz: [
      { q: "Best cache header for `assets/index-Bk3a9Q.js`?", options: ["`no-store`", "`no-cache`", "`public, max-age=31536000, immutable`"], answer: 2, why: "Hashed names change on every content change, so long caching is safe." },
      { q: "Best cache header for `index.html`?", options: ["1 year immutable", "`no-cache`", "No header ever"], answer: 1, why: "It must revalidate so users get the new asset links after a deploy." },
      { q: "What does the last item in `try_files` do?", options: ["It's a fallback used if nothing earlier matched", "It's always served first", "It's ignored"], answer: 0, why: "Options are tried left to right; the last is the fallback (URI or `=code`)." }
    ],
    rev: {
      sec30: "Serve `dist/` with `root`, add `try_files $uri $uri/ /index.html` for the SPA fallback, cache `/assets/` (hashed) for a year with `immutable`, and send `index.html` with `no-cache`. Enable gzip, return real 404s for missing assets, and proxy `/api/` if you want same-origin calls.",
      interview: [
        { level: "basic", q: "How do you serve a React SPA with Nginx?", a: "Point `root` at the build output and use `try_files $uri $uri/ /index.html;` so unknown paths load the app." },
        { level: "intermediate", q: "What caching strategy do you use?", a: "Hashed assets: `max-age=31536000, immutable`. `index.html`: `no-cache`. A deploy changes asset names, and the fresh HTML points to them." },
        { level: "advanced", q: "`no-cache` vs `no-store`?", a: "`no-cache` allows storing but requires revalidation (cheap 304s). `no-store` forbids storing at all; overkill for `index.html`." },
        { level: "tricky", q: "After deploy some users get a blank page and 404 on a JS chunk. Why?", a: "They hold an old `index.html` (or an open tab) pointing to deleted chunks. Use `no-cache` for HTML, keep old assets for a while, and retry or reload on chunk-load errors." }
      ],
      cheat: [
        "`root` = your `dist/` contents",
        "`try_files $uri $uri/ /index.html;`",
        "`/assets/`: `max-age=31536000, immutable`",
        "`index.html`: `no-cache`",
        "Missing assets: `try_files $uri =404;`",
        "`gzip on;` + `gzip_types` for text",
        "`proxy_pass` `/api/` to avoid CORS"
      ]
    },
    related: ["PROD-009", "PROD-004", "PERF-016", "WEB-003"]
  },

  "PROD-009": {
    tldr: "A container (Docker image) packs your app with everything needed to run it. A **multi-stage** Dockerfile builds with Node in stage 1, then copies only `dist/` into a tiny Nginx image in stage 2.",
    analogy: { icon: "🍱", text: "Cooking in a big kitchen (Node, all tools), then packing only the finished meal into a small lunchbox (Nginx + `dist/`). The pots and pans stay behind." },
    visual: { type: "layers", title: "What ends up in the final image", items: [
      { label: "Your nginx.conf", detail: "SPA fallback + cache headers." },
      { label: "dist/ files", detail: "Copied from the build stage with `COPY --from=build`." },
      { label: "nginx:alpine", detail: "Small base image (~20 MB compressed)." },
      { label: "Left behind: build stage", detail: "Node, `node_modules`, source code. Hundreds of MB you don't ship." }
    ]},
    points: [
      "**Image** = packaged template; **container** = a running image. Like a class vs an object.",
      "Copy `package*.json` and run `npm ci` **before** copying the source, so Docker caches the install layer.",
      "Add a `.dockerignore` (`node_modules`, `dist`, `.git`, `.env*`) to keep the build context small and secret-free.",
      "`VITE_*` values are baked in during `npm run build`: pass them as `--build-arg`, or use runtime config.",
      "Same idea as a .NET multi-stage `sdk` → `aspnet` image."
    ],
    code: { file: "Dockerfile", lang: "text", src: `# ---- Stage 1: build with Node ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: serve with Nginx ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Build & run:
# docker build --build-arg VITE_API_URL=https://api.myshop.test -t shop-web .
# docker run -p 8080:80 shop-web   → http://localhost:8080`, walk: [
      { lines: [2, 3], note: "Stage 1 is named `build` and uses a Node image with npm." },
      { lines: [4, 5], note: "Dependencies first: this layer is reused until the lockfile changes." },
      { lines: [7, 8, 9], note: "The build arg becomes an env var so Vite can inline it during the build." },
      { lines: [12, 13, 14], note: "Stage 2 starts fresh; only `dist/` and the Nginx config are copied in." },
      { lines: [16], note: "Run Nginx in the foreground so the container keeps running." },
      { lines: [19, 20], note: "Map host port 8080 to container port 80." }
    ]},
    output: "`docker run -p 8080:80 shop-web` serves the shop at http://localhost:8080, with deep links working thanks to nginx.conf.",
    mistakes: [
      { bad: `FROM node:22\nCOPY . .\nRUN npm install && npm run build\nCMD ["npx", "vite", "preview"]`, good: `# multi-stage: build with node,\n# serve dist/ with nginx:alpine`, why: "A 1 GB image with dev tools and source, served by a tool not meant for production." },
      { bad: `COPY . .\nRUN npm ci`, good: `COPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .`, why: "Copying source first busts the cache on every code change, so `npm ci` reruns every build." }
    ],
    practice: [
      { level: "B", q: "Write a `.dockerignore` for a Vite app.", a: "Exclude bulky and secret files.", code: `node_modules\ndist\n.git\n.env*\n*.log` },
      { level: "B", q: "What's the difference between an image and a container?", a: "An image is the packaged template; a container is a running instance of it." },
      { level: "I", q: "Check the final image size.", a: "`docker images shop-web`: it should be tens of MB, not hundreds." },
      { level: "C", q: "Build once, run in staging and prod with different API URLs.", a: "Don't bake the URL. At container start, write a `config.json` (or `env.js`) from env vars into the html folder, and have the app fetch it before rendering." }
    ],
    quiz: [
      { q: "Why use a multi-stage build?", options: ["It builds faster on every run", "The final image keeps only what's needed to serve", "Docker requires it for React"], answer: 1, why: "Node and `node_modules` stay in the build stage." },
      { q: "Why copy `package*.json` before the rest of the source?", options: ["Docker layer caching of `npm ci`", "npm needs it alphabetically", "It's required by Nginx"], answer: 0, why: "Layers rebuild only when their inputs change." },
      { q: "`docker run -e VITE_API_URL=...` on the final image changes the API URL.", options: ["True", "False"], answer: 1, why: "The value was inlined at build time; runtime env doesn't touch built JS." }
    ],
    rev: {
      sec30: "Multi-stage Dockerfile: stage 1 `node:22-alpine` runs `npm ci` (cached by copying lockfiles first) and `npm run build`; stage 2 `nginx:alpine` copies `dist/` and an SPA-aware `nginx.conf`. Use `.dockerignore`. `VITE_*` values are build-time: use `--build-arg`, or runtime config to reuse one image across environments.",
      interview: [
        { level: "basic", q: "Why containerise a React app?", a: "Same image runs identically on every machine and platform (Kubernetes, ECS, App Service), and it fits existing container pipelines." },
        { level: "intermediate", q: "Explain a multi-stage Dockerfile for React.", a: "Build in a Node stage, then copy only the static output into a small web-server image. Smaller, safer, faster to pull." },
        { level: "advanced", q: "How do you handle environment config in one image?", a: "Generate a runtime `config.json` or `window.__ENV` script from container env vars at startup, and read it in the app instead of `import.meta.env`." },
        { level: "tricky", q: "Do you need Node in the final image?", a: "No, for a static SPA. Only if you run SSR (a framework server) do you need a Node runtime stage." }
      ],
      cheat: [
        "Stage 1: `node:22-alpine` → `npm ci` → `npm run build`",
        "Stage 2: `nginx:alpine` + `COPY --from=build /app/dist`",
        "Copy lockfiles before source for cache hits",
        "`.dockerignore`: node_modules, dist, .git, .env*",
        "`VITE_*` = build arg, not runtime env",
        "`docker run -p 8080:80 image`"
      ]
    },
    related: ["PROD-008", "PROD-002", "PROD-010", "ENV-007"]
  },

  "PROD-010": {
    tldr: "CI (continuous integration) checks every push automatically: install, lint, test, build. CD (continuous delivery/deployment) ships the build that passed. Machines do the boring checks every time, so broken code can't reach users.",
    analogy: { icon: "🍳", text: "A restaurant pass: every plate is checked (temperature, garnish, order number) before a waiter takes it out. A plate that fails goes back to the kitchen, not to the table." },
    visual: { type: "flow", title: "A typical React pipeline", steps: [
      { label: "Push / PR", detail: "A developer pushes a branch or opens a pull request." },
      { label: "Install", detail: "`npm ci` with a cached npm folder. Same deps every time." },
      { label: "Lint + types", detail: "`eslint .` and `tsc --noEmit` catch mistakes in seconds." },
      { label: "Test", detail: "Vitest + RTL unit tests; Playwright E2E on key flows." },
      { label: "Build", detail: "`vite build` must succeed; keep `dist/` as the artifact." },
      { label: "Deploy", detail: "Preview for PRs; production after merge to `main`." }
    ]},
    points: [
      "**Fail fast**: cheapest checks first (lint, types), slow ones later (E2E).",
      "Any failed step stops the pipeline and blocks the merge (branch protection).",
      "**Continuous delivery** = always ready to deploy (a person presses the button). **Continuous deployment** = auto-deploy on merge.",
      "**Build once, deploy that artifact**: don't rebuild different code for prod.",
      "Make CI reproducible: pinned Node version, `npm ci`, lockfile committed, secrets in the CI secret store."
    ],
    code: { file: "package.json", lang: "json", src: `{
  "scripts": {
    "dev": "vite",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "build": "vite build",
    "ci": "npm run lint && npm run typecheck && npm run test && npm run build"
  },
  "engines": {
    "node": ">=22.12"
  }
}`, walk: [
      { lines: [4, 5], note: "Fast static checks: style and type errors." },
      { lines: [6], note: "`vitest run` runs once and exits (no watch mode), right for CI." },
      { lines: [7], note: "Playwright E2E: slower, so it usually runs as a separate CI job." },
      { lines: [9], note: "One command that runs everything in fail-fast order. CI and your laptop run the same thing." },
      { lines: [11, 12, 13], note: "Vite 8 needs Node 20.19+ or 22.12+. Pin the same version in CI." }
    ]},
    output: "`npm run ci` stops at the first failing step with a non-zero exit code, which marks the CI run red.",
    mistakes: [
      { bad: `"test": "vitest"`, good: `"test": "vitest run"`, why: "Plain `vitest` starts watch mode locally. Use `vitest run` so the command always exits (Vitest also detects CI, but be explicit)." },
      { bad: `# Build in CI, then rebuild on the server\nssh prod "git pull && npm run build"`, good: `# Upload the dist/ artifact that passed CI`, why: "A second build can differ (deps, env, time). Ship exactly what you tested." }
    ],
    practice: [
      { level: "B", q: "Put these in fail-fast order: build, E2E, lint, unit test.", a: "lint → unit test → build → E2E." },
      { level: "I", q: "Delivery vs deployment: which needs a manual approval?", a: "Continuous delivery keeps every build deployable but a human triggers production. Continuous deployment ships automatically." },
      { level: "I", q: "How do you stop broken PRs from being merged?", a: "Branch protection: require the CI checks to pass (and a review) before merge." },
      { level: "C", q: "CI is slow (12 min). Three ideas?", a: "Cache npm, run lint/test/E2E as parallel jobs, shard Playwright tests, run E2E only on affected apps or before merge." }
    ],
    quiz: [
      { q: "What should CI do on every pull request?", options: ["Deploy to production", "Install, lint, test and build", "Only run the dev server", "Nothing until merge"], answer: 1, why: "CI verifies every change before it can be merged." },
      { q: "Continuous **deployment** means…", options: ["Every passing merge goes live automatically", "Someone deploys once a month", "Builds are never kept"], answer: 0, why: "Delivery stops at ready-to-deploy; deployment goes all the way." },
      { q: "Why run lint before E2E tests?", options: ["Lint is required by Playwright", "Fail fast: cheap checks catch errors sooner", "E2E needs lint output"], answer: 1, why: "No point waiting minutes for E2E if a 5-second check already fails." }
    ],
    rev: {
      sec30: "CI runs on every push/PR: `npm ci`, lint, type-check, tests, build, failing fast and blocking merges. CD takes the passing artifact and deploys it: previews for PRs, production after merge (automatic = continuous deployment, manual button = continuous delivery). Build once, deploy the same artifact, pin Node and keep secrets in the CI store.",
      interview: [
        { level: "basic", q: "What is CI/CD?", a: "CI automatically verifies each change (lint, test, build). CD automatically delivers or deploys the verified build." },
        { level: "intermediate", q: "What does your React pipeline look like?", a: "`npm ci` with cache, ESLint, `tsc`, Vitest/RTL, `vite build`, Playwright on key flows, then deploy a preview per PR and production on merge." },
        { level: "advanced", q: "Why “build once, deploy many”?", a: "Rebuilding per environment risks shipping something different from what was tested. Promote the same artifact and inject environment config at runtime." },
        { level: "tricky", q: "Tests pass locally but fail in CI. Common causes?", a: "Different Node version, `npm install` vs `npm ci` drift, timezone/locale, missing env vars, or tests relying on order or real network." }
      ],
      cheat: [
        "CI = verify every change; CD = ship verified builds",
        "Order: install → lint → types → test → build → E2E → deploy",
        "`npm ci` + pinned Node version",
        "`vitest run` exits; plain `vitest` watches",
        "Branch protection: required checks",
        "Build once, deploy the same artifact"
      ]
    },
    related: ["PROD-011", "TEST-001", "TEST-015", "PROD-001"]
  },

  "PROD-011": {
    tldr: "GitHub Actions runs your CI/CD from a YAML file in `.github/workflows/`. A workflow has **triggers** (`on`), **jobs** and **steps**. This one tests every PR and deploys `main` to GitHub Pages.",
    analogy: { icon: "📋", text: "A recipe card pinned in the kitchen: “When an order comes in (trigger), the prep cook (job) does these steps in order. Only if prep passes does the server (deploy job) take it out.”" },
    visual: { type: "tree", title: "Anatomy of a workflow", root: { label: "ci.yml", children: [
      { label: "on", note: "push to main, pull_request", children: [] },
      { label: "jobs", children: [
        { label: "build", note: "runs-on: ubuntu-latest", children: [
          { label: "checkout" }, { label: "setup-node + cache" }, { label: "npm ci → lint → test → build" }, { label: "upload artifact" }
        ]},
        { label: "deploy", note: "needs: build, only on main", children: [
          { label: "deploy-pages" }
        ]}
      ]}
    ]}},
    points: [
      "**Workflow** (file) → **jobs** (run in parallel unless `needs:`) → **steps** (run in order).",
      "`uses:` runs a published action; `run:` runs a shell command.",
      "`setup-node` with `cache: npm` caches downloads keyed on the lockfile.",
      "Secrets: `\${{ secrets.NAME }}`; non-secret config: `\${{ vars.NAME }}`. Set them in repo settings.",
      "`permissions:` gives the token only what it needs (Pages deploy needs `pages: write`, `id-token: write`).",
      "`if:` keeps deploys to `main`; PRs only get the checks."
    ],
    code: { file: ".github/workflows/ci.yml", lang: "text", src: `name: CI
on:
  push: { branches: [main] }
  pull_request:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx vitest run
      - run: npm run build
        env:
          VITE_API_URL: \${{ vars.VITE_API_URL }}
      - uses: actions/upload-pages-artifact@v5
        if: github.ref == 'refs/heads/main'
        with: { path: dist }

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5`, walk: [
      { lines: [2, 3, 4], note: "Run on pushes to `main` and on every pull request." },
      { lines: [6, 7, 8, 9], note: "Least-privilege token: read code, write Pages, get an OIDC token for the deploy." },
      { lines: [16, 17], note: "Install Node 22 and cache npm downloads." },
      { lines: [18, 19, 20, 21], note: "Same fail-fast checks as `npm run ci`. Any failure turns the run red." },
      { lines: [22, 23], note: "Public build config from repository **variables**, inlined by Vite." },
      { lines: [29, 30, 37], note: "Deploy waits for `build` and only runs on `main`." }
    ]},
    output: "On a PR: a green or red “CI / build” check. On merge to main: the site is published to GitHub Pages and the job shows its URL.",
    mistakes: [
      { bad: `- run: npm install\n- run: npm test`, good: `- run: npm ci\n- run: npx vitest run`, why: "`npm install` can update the lockfile; `npm ci` is exact. Make sure tests don't start watch mode." },
      { bad: `env:\n  API_KEY: sk_live_abc123`, good: `env:\n  API_KEY: \${{ secrets.API_KEY }}`, why: "Anything in YAML is in your git history. Use encrypted secrets." }
    ],
    practice: [
      { level: "B", q: "Where do workflow files live?", a: "`.github/workflows/*.yml` in the repo." },
      { level: "I", q: "Run unit tests and E2E in parallel.", a: "Make two jobs with no `needs:` between them; add `needs: [unit, e2e]` on deploy." },
      { level: "I", q: "Test on Node 22 and 24.", a: "Use a matrix.", code: `strategy:\n  matrix:\n    node: [22, 24]\nsteps:\n  - uses: actions/setup-node@v7\n    with: { node-version: \${{ matrix.node }}, cache: npm }` },
      { level: "C", q: "Cancel old runs when you push again to the same PR.", a: "Add a concurrency group.", code: `concurrency:\n  group: ci-\${{ github.ref }}\n  cancel-in-progress: true` }
    ],
    quiz: [
      { q: "Two jobs without `needs:` run…", options: ["One after another", "In parallel", "Only if both are on main"], answer: 1, why: "Jobs are parallel by default; `needs:` creates order." },
      { q: "`uses:` vs `run:`?", options: ["`uses` runs an action; `run` runs a shell command", "They're the same", "`run` is for Windows only"], answer: 0, why: "Actions are reusable packaged steps." },
      { q: "Where should an API secret go?", options: ["In the YAML file", "In repo Secrets, read with `secrets.NAME`", "In `package.json`"], answer: 1, why: "Secrets are encrypted and masked in logs." }
    ],
    rev: {
      sec30: "A GitHub Actions workflow in `.github/workflows/` defines triggers (`on`), jobs (parallel unless `needs`) and steps (`uses` actions or `run` commands). Typical React CI: checkout, setup-node with npm cache, `npm ci`, lint, `vitest run`, build, upload artifact; a deploy job gated by `needs` and `if: main`. Use secrets/vars and least-privilege `permissions`.",
      interview: [
        { level: "basic", q: "What triggers a workflow?", a: "Events in `on:` like `push`, `pull_request`, `schedule` or `workflow_dispatch` (manual)." },
        { level: "intermediate", q: "How do you speed up a slow workflow?", a: "Cache npm via `setup-node`, run independent jobs in parallel, shard E2E tests, and cancel superseded runs with `concurrency`." },
        { level: "advanced", q: "Why set `permissions:` explicitly?", a: "It limits what the `GITHUB_TOKEN` can do, so a compromised step or action can't push code or tamper with releases." },
        { level: "tricky", q: "Do PRs from forks get your secrets?", a: "No. Secrets aren't passed to `pull_request` runs from forks, so deploy steps that need them must be skipped for forks." }
      ],
      cheat: [
        "File: `.github/workflows/ci.yml`",
        "`on` → `jobs` → `steps`",
        "`uses:` action, `run:` shell",
        "`setup-node` + `cache: npm`",
        "`needs:` orders jobs; `if:` gates them",
        "`secrets.X` encrypted; `vars.X` plain config",
        "Least-privilege `permissions:`"
      ]
    },
    related: ["PROD-010", "PROD-007", "WEB-041", "TEST-006"]
  },

  "PROD-012": {
    tldr: "Error monitoring tells you when users hit crashes you never saw. **Sentry** catches errors in the browser, groups them, adds the release, browser and steps that led there, and maps minified stack traces back to your source.",
    analogy: { icon: "🚨", text: "A smoke alarm in every customer's kitchen that texts you the room, the time and what was cooking. You don't wait for someone to phone and complain." },
    visual: { type: "flow", title: "From crash to fix", steps: [
      { label: "Error in browser", detail: "A render throws or a promise rejects on a user's phone." },
      { label: "SDK captures", detail: "`@sentry/react` grabs the stack, breadcrumbs, URL, release." },
      { label: "Sent & grouped", detail: "Same bug from 500 users = one issue with a count." },
      { label: "Source maps", detail: "Uploaded maps turn `a.js:1:9831` into `Cart.jsx:42`." },
      { label: "Alert → fix", detail: "Slack/email alert; fix, release, watch the count drop." }
    ]},
    points: [
      "`Sentry.init` once in `main.jsx`, before rendering. The DSN is public by design.",
      "React 19 root hooks: `onUncaughtError`, `onCaughtError`, `onRecoverableError` on `createRoot`, using `Sentry.reactErrorHandler()`.",
      "`Sentry.ErrorBoundary` reports render errors **and** shows a fallback instead of a blank page.",
      "Tag every event with `environment` and `release` so you know which deploy broke.",
      "Privacy: keep `sendDefaultPii: false`, scrub emails/tokens in `beforeSend`.",
      "Event handler and async errors aren't caught by boundaries; the SDK's global handlers catch them."
    ],
    code: { file: "src/main.jsx", lang: "jsx", src: `import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_RELEASE, // e.g. git SHA
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,   // 10% performance traces
  sendDefaultPii: false,
});

createRoot(document.getElementById('root'), {
  // errors no boundary caught
  onUncaughtError: Sentry.reactErrorHandler(),
  // errors React recovered from (e.g. hydration)
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <Sentry.ErrorBoundary fallback={<p>Sorry, the shop hit a snag. Please reload.</p>}>
    <App />
  </Sentry.ErrorBoundary>
);`, walk: [
      { lines: [5, 6, 7, 8], note: "Init before rendering. `environment` and `release` let you filter by deploy." },
      { lines: [9, 10], note: "Optional performance tracing; sample it to control cost." },
      { lines: [11], note: "Don't send IPs or cookies by default." },
      { lines: [14, 15, 16, 17, 18], note: "React 19 root error hooks forward errors React reports to Sentry." },
      { lines: [20, 21, 22], note: "The boundary reports the error itself and shows a friendly fallback." }
    ]},
    output: "A thrown error in `<Cart />` shows the fallback message, and Sentry shows a new issue: “TypeError: items.map is not a function” in Cart.jsx, release `a1b2c3`, Chrome 140, 23 users.",
    mistakes: [
      { bad: `window.onerror = (m) => console.log(m);`, good: `Sentry.init({ dsn, release, environment });`, why: "Console logs on users' devices are invisible to you. Send errors somewhere you can see, group and alert on." },
      { bad: `Sentry.setUser({ email: user.email, cardLast4 });`, good: `Sentry.setUser({ id: user.id });`, why: "Use an opaque id. Personal data in error tools creates privacy and compliance risk." }
    ],
    practice: [
      { level: "B", q: "Install the SDK.", a: "`npm install @sentry/react`, then add `Sentry.init` in `main.jsx`." },
      { level: "I", q: "Report a handled error from a failed checkout fetch.", a: "Capture it yourself with context.", code: `try {\n  await placeOrder(cart);\n} catch (err) {\n  Sentry.captureException(err, { tags: { step: 'checkout' } });\n  setError('Payment failed, try again');\n}` },
      { level: "I", q: "Strip email addresses before sending.", a: "Use `beforeSend(event) { /* scrub */ return event; }`; return `null` to drop an event." },
      { level: "C", q: "Why might a click-handler error not hit your ErrorBoundary?", a: "Boundaries only catch errors during render, lifecycle and effects. Handler/async errors reach Sentry through its global `error`/`unhandledrejection` handlers or `captureException`." }
    ],
    quiz: [
      { q: "Main value of error monitoring?", options: ["Makes the app faster", "You learn about real users' crashes with context", "Replaces tests"], answer: 1, why: "It shows what broke, where, for whom and in which release." },
      { q: "Is the Sentry DSN a secret?", options: ["Yes, keep it server-side", "No, it only allows sending events"], answer: 1, why: "It's designed to live in client code; use rate limits and allowed domains." },
      { q: "Without uploaded source maps, stack traces show…", options: ["Your original JSX lines", "Minified file names and columns", "Nothing at all"], answer: 1, why: "Maps are needed to translate minified positions back to source." }
    ],
    rev: {
      sec30: "Use `@sentry/react`: `Sentry.init` with DSN, `environment`, `release` and sampling; wire React 19 root hooks (`onUncaughtError`, `onRecoverableError`) with `Sentry.reactErrorHandler()` and wrap the app in `Sentry.ErrorBoundary` for a fallback. Upload source maps per release, scrub PII, and alert on new or spiking issues.",
      interview: [
        { level: "basic", q: "Why add error monitoring to a React app?", a: "Users rarely report errors. Monitoring captures real crashes with stack, browser, release and breadcrumbs so you can fix them fast." },
        { level: "intermediate", q: "What errors do error boundaries miss?", a: "Event handlers, async code (timers, promises), SSR, and errors in the boundary itself. Global handlers or `captureException` cover those." },
        { level: "advanced", q: "How does React 19 help error reporting?", a: "`createRoot` accepts `onUncaughtError`, `onCaughtError` and `onRecoverableError`, so every error React handles can be sent to a monitoring tool in one place." },
        { level: "tricky", q: "Sentry shows one issue with 10,000 events. Good or bad?", a: "One bug hitting many users, likely a top priority. Grouping keeps it as one issue; check the release and browser breakdown to find the cause." }
      ],
      cheat: [
        "`npm i @sentry/react` → `Sentry.init({ dsn, release, environment })`",
        "React 19: `createRoot(el, { onUncaughtError, onCaughtError, onRecoverableError })`",
        "`Sentry.reactErrorHandler()` for those hooks",
        "`Sentry.ErrorBoundary` = report + fallback UI",
        "`captureException(err)` for handled errors",
        "Upload source maps per release",
        "No PII: `sendDefaultPii: false`, `beforeSend` scrub"
      ]
    },
    related: ["ADV-004", "PROD-017", "PROD-013", "ROUTE-019"]
  },

  "PROD-013": {
    tldr: "Client logs record **what happened** (events like `checkout_started`) so you can understand issues later. Log a few meaningful events with levels, batch them to your server, and **never** log passwords, tokens or personal data.",
    analogy: { icon: "📓", text: "A ship's logbook: short entries like “10:02 left port, 10:40 storm”. It never records the passengers' passport numbers." },
    visual: { type: "flow", title: "The life of a log entry", steps: [
      { label: "Event", detail: "`log('info', 'cart_checkout_started', { items: 3 })`." },
      { label: "Level filter", detail: "Prod keeps `info`+; `debug` stays on your machine." },
      { label: "Scrub", detail: "Keys like `password`, `token`, `email` become `[redacted]`." },
      { label: "Batch", detail: "Queue entries; send 20 at a time, not one request per log." },
      { label: "Send", detail: "`navigator.sendBeacon` on page hide, so logs survive tab close." }
    ]},
    points: [
      "Log **events and context** (step, ids, counts, release), not whole objects or form values.",
      "Use levels: `debug` (dev only), `info` (milestones), `warn` (recovered), `error` (failed).",
      "Redact by key **and** don't collect sensitive fields in the first place (data minimisation).",
      "Batch and use `sendBeacon` so logging never slows the UI or gets lost on close.",
      "Errors go to the error tool (Sentry); logs give the story around them (breadcrumbs).",
      "Strip noisy `console.log` from prod; like `ILogger` with levels, not `Console.WriteLine`."
    ],
    code: { file: "src/logger.js", lang: "js", src: `const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN = import.meta.env.PROD ? LEVELS.info : LEVELS.debug;
const SENSITIVE = /pass|token|card|email|phone|address/i;

const scrub = (data = {}) =>
  Object.fromEntries(Object.entries(data).map(
    ([k, v]) => [k, SENSITIVE.test(k) ? '[redacted]' : v]
  ));

let queue = [];
function flush() {
  if (!queue.length) return;
  navigator.sendBeacon('/api/logs', JSON.stringify(queue));
  queue = [];
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});

export function log(level, event, data) {
  if (LEVELS[level] < MIN) return;
  const entry = {
    level, event, data: scrub(data),
    path: location.pathname,
    release: import.meta.env.VITE_RELEASE,
    ts: Date.now(),
  };
  if (import.meta.env.DEV) console[level](event, entry.data);
  queue.push(entry);
  if (queue.length >= 20) flush();
}

// log('info', 'checkout_started', { items: 3, total: 42.5 });
// log('warn', 'payment_retry', { attempt: 2, cardNumber: '4242…' });
//   → data: { attempt: 2, cardNumber: '[redacted]' }`, walk: [
      { lines: [1, 2], note: "Production drops `debug` noise; dev shows everything." },
      { lines: [3, 5, 6, 7, 8], note: "Any key that looks sensitive is replaced before it leaves the device." },
      { lines: [11, 12, 13, 14, 15], note: "Send a batch in one cheap, non-blocking request." },
      { lines: [16, 17, 18], note: "Flush when the tab is hidden (closing, switching apps) so nothing is lost." },
      { lines: [22, 23, 24, 25, 26, 27], note: "Each entry carries context: page, release, time." },
      { lines: [34, 35], note: "The card number never reaches your server." }
    ]},
    output: "Server receives: [{ level: 'warn', event: 'payment_retry', data: { attempt: 2, cardNumber: '[redacted]' }, path: '/checkout', release: 'a1b2c3' }]",
    mistakes: [
      { bad: `console.log('login', { email, password });`, good: `log('info', 'login_submitted', { method: 'password' });`, why: "Credentials and personal data in logs leak to anyone with log access and may break GDPR." },
      { bad: `items.forEach(i => fetch('/api/logs', { method: 'POST', body: JSON.stringify(i) }));`, good: `log('info', 'cart_loaded', { count: items.length });`, why: "One request per item floods the network. Log a summary and batch." }
    ],
    practice: [
      { level: "B", q: "Pick a level: payment failed after 3 retries.", a: "`error`. A retry that later succeeded would be `warn`." },
      { level: "I", q: "What 3 events would you log in a notes app?", a: "`note_created`, `note_sync_failed` (with error code), `offline_mode_entered`. Not note contents." },
      { level: "I", q: "Add a session id to every log without personal data.", a: "Generate `crypto.randomUUID()` once per session and include it in each entry." },
      { level: "C", q: "Why scrub on the client **and** the server?", a: "Defence in depth: the client scrubber may miss a field, and old app versions keep sending. The server should also redact before storing." }
    ],
    quiz: [
      { q: "Which is safe to log?", options: ["`{ password }`", "`{ authToken }`", "`{ step: 'shipping', items: 3 }`", "`{ email }`"], answer: 2, why: "Steps and counts describe behaviour without identifying or exposing users." },
      { q: "Why use `navigator.sendBeacon`?", options: ["It's encrypted", "It queues data that's still sent when the page is closing", "It's synchronous"], answer: 1, why: "Normal fetches can be cancelled on unload." },
      { q: "`debug` logs in production should…", options: ["Be sent to the server", "Be filtered out", "Show alerts"], answer: 1, why: "They're noisy and costly; keep them for development." }
    ],
    rev: {
      sec30: "Client logging captures meaningful events with context (path, release, ids, counts), using levels and a production filter. Scrub sensitive keys and avoid collecting personal data at all. Batch entries and send with `sendBeacon` on page hide. Logs complement error monitoring by telling the story around a failure.",
      interview: [
        { level: "basic", q: "What should you never log in the client?", a: "Passwords, tokens, card numbers, and personal data like emails or addresses." },
        { level: "intermediate", q: "How do you ship logs without hurting performance?", a: "Filter by level, batch in memory, send with `sendBeacon` or a background `fetch` with `keepalive`, and flush on `visibilitychange`." },
        { level: "advanced", q: "Logs vs error monitoring vs analytics?", a: "Errors: crashes with stacks. Logs: technical event trail for debugging. Analytics: product usage, aggregated. Different tools, retention and privacy rules." },
        { level: "tricky", q: "Is `console.log` in production harmful?", a: "It's invisible to you, can leak data to anyone opening DevTools, and costs a little performance. Use a logger with levels and strip stray logs." }
      ],
      cheat: [
        "Log events + context, not objects or form values",
        "Levels: debug < info < warn < error; prod keeps info+",
        "Redact `password|token|card|email`…",
        "Batch + `sendBeacon` on `visibilitychange` hidden",
        "Include `release`, `path`, a random session id",
        "Errors → Sentry; logs → breadcrumbs/story"
      ]
    },
    related: ["PROD-012", "PROD-014", "SEC-008", "PROD-017"]
  },

  "PROD-014": {
    tldr: "Analytics shows how people use your app: which pages, which buttons, where they drop off. Track a few **named events**, ask for consent where the law needs it, and send no personal data.",
    analogy: { icon: "🛍️", text: "A shop counting how many people walk into each aisle and how many reach the till, without writing down anyone's name or following them home." },
    visual: { type: "compare", title: "Tracking done badly vs well", left: { label: "Privacy-hostile", tone: "bad", points: [
      "Tracks before consent",
      "Sends emails, names, full URLs with tokens",
      "Hundreds of auto-captured events",
      "Third-party cookies everywhere"
    ]}, right: { label: "Privacy-friendly", tone: "good", points: [
      "Asks first; respects Global Privacy Control",
      "Opaque ids, no PII, clean paths",
      "A short list of named events (`add_to_cart`)",
      "Cookieless or first-party tools"
    ]}},
    points: [
      "SPAs don't reload pages, so send a **page view on route change** (`useLocation` + effect).",
      "Define an event plan: `add_to_cart`, `checkout_started`, `order_placed`, with small props.",
      "Gate tracking behind consent (GDPR/ePrivacy) and honour `navigator.globalPrivacyControl`.",
      "Strip query strings that may hold tokens or emails before sending paths.",
      "Strict Mode runs effects twice in **dev**, so you may see double page views locally; production fires once.",
      "Privacy-first tools (Plausible, Umami, self-hosted) or GA4 with consent mode."
    ],
    code: { file: "src/analytics.jsx", lang: "jsx", src: `import { useEffect } from 'react';
import { useLocation } from 'react-router';

let allowed = false;
export const setConsent = (yes) => { allowed = yes; };

export function track(event, props = {}) {
  if (!allowed || navigator.globalPrivacyControl) return;
  navigator.sendBeacon('/api/events', JSON.stringify({
    event,
    props,
    path: location.pathname, // no ?query, no #hash
    ts: Date.now(),
  }));
}

// Mount once inside the router: <PageViews />
export function PageViews() {
  const { pathname } = useLocation();
  useEffect(() => {
    track('page_view', { path: pathname });
  }, [pathname]);
  return null;
}

// Usage in a product card:
// <button onClick={() => track('add_to_cart', { productId: 'p_42' })}>
//   Add to cart
// </button>`, walk: [
      { lines: [4, 5], note: "Nothing is sent until the user accepts (wire this to your consent banner)." },
      { lines: [8], note: "Respect the browser's Global Privacy Control signal." },
      { lines: [12], note: "Send only the path: query strings often carry search terms, emails or tokens." },
      { lines: [18, 19, 20, 21, 22], note: "A page view each time the route path changes. React Router 7 imports from `react-router`." },
      { lines: [26, 27], note: "Explicit, named events with tiny props: easy to query, nothing personal." }
    ]},
    output: "After consent, visiting /products then /cart sends: page_view /products, page_view /cart. Clicking “Add to cart” sends add_to_cart { productId: 'p_42' }.",
    mistakes: [
      { bad: `track('signup', { email: form.email, name: form.name });`, good: `track('signup_completed', { plan: 'free' });`, why: "Personal data in analytics needs a legal basis and often breaks the tool's terms. Track behaviour, not identity." },
      { bad: `useEffect(() => { track('page_view'); }, []);`, good: `const { pathname } = useLocation();\nuseEffect(() => { track('page_view', { path: pathname }); }, [pathname]);`, why: "In an SPA the root mounts once, so `[]` logs only the first page." }
    ],
    practice: [
      { level: "B", q: "Name 3 events for a recipe app.", a: "`recipe_viewed`, `recipe_saved`, `shopping_list_created`." },
      { level: "I", q: "Measure the checkout funnel.", a: "Track `cart_viewed` → `checkout_started` → `order_placed`; compare counts at each step to find the drop-off." },
      { level: "I", q: "Remove query strings from a URL in JS.", a: "`new URL(location.href).pathname`, or `location.pathname`." },
      { level: "C", q: "Load a third-party analytics script only after consent.", a: "Inject the `<script>` tag inside `setConsent(true)`, never in `index.html` by default." }
    ],
    quiz: [
      { q: "Why do SPAs need manual page view tracking?", options: ["Browsers block them", "Route changes don't reload the page", "React removes them"], answer: 1, why: "The analytics script sees only the first load unless you report route changes." },
      { q: "Which event prop is OK?", options: ["`{ email }`", "`{ productId: 'p_42' }`", "`{ password }`", "`{ fullAddress }`"], answer: 1, why: "An internal product id isn't personal data." },
      { q: "You see two page views per navigation in dev only. Why?", options: ["Bug in React Router", "Strict Mode double-runs effects in development", "The analytics server duplicates"], answer: 1, why: "Strict Mode mounts, unmounts and re-mounts effects in dev; production runs once." }
    ],
    rev: {
      sec30: "Track a small plan of named events plus route-change page views (`useLocation` + `useEffect`). Ask consent where required, honour Global Privacy Control, send no personal data or query strings, and prefer privacy-first or first-party tools. Expect double page views in dev from Strict Mode only.",
      interview: [
        { level: "basic", q: "How do you track page views in a React SPA?", a: "A component inside the router reads `useLocation()` and fires a page view in an effect whenever `pathname` changes." },
        { level: "intermediate", q: "How do you keep analytics privacy-friendly?", a: "Consent first, no PII, strip query strings, aggregate data, minimal events, and cookieless or first-party tooling." },
        { level: "advanced", q: "How do you avoid analytics hurting performance?", a: "Load scripts after consent and after the page is interactive, use `sendBeacon`, batch events, and avoid heavy tag managers on the critical path." },
        { level: "tricky", q: "Is a hashed email anonymous?", a: "No. It's still a stable identifier (pseudonymous) and can be matched against other data, so it's still personal data under GDPR." }
      ],
      cheat: [
        "Page view on `pathname` change (`useLocation`)",
        "Short named event list: `add_to_cart`, `order_placed`",
        "Consent first; respect `navigator.globalPrivacyControl`",
        "No PII, no query strings",
        "`sendBeacon` for fire-and-forget",
        "Dev double page view = Strict Mode, not a bug"
      ]
    },
    related: ["PROD-013", "ROUTE-011", "PERF-020", "SEC-011"]
  },

  "PROD-015": {
    tldr: "SEO (search engine optimisation) means search engines can find, read and show your pages. A plain SPA sends an almost empty HTML file, so give each page its own **title, description and real URL**, and use **SSR or prerendering** for pages that must rank.",
    analogy: { icon: "📖", text: "A cookbook in a shop window: if the cover is blank (empty `index.html`), passers-by can't tell what's inside. Print the title and a blurb on the cover of every book." },
    visual: { type: "compare", title: "What a crawler first receives", left: { label: "SPA (client-rendered)", tone: "bad", points: [
      "`<div id=\"root\"></div>` + a JS file",
      "Content appears only after JS runs",
      "Google renders later; many bots never do",
      "Social previews show the default title"
    ]}, right: { label: "SSR / prerendered", tone: "good", points: [
      "Full HTML with headings and text",
      "Title, description, Open Graph in the HTML",
      "Every bot can read it immediately",
      "Framework-only (Next.js, RR framework mode) or a build step"
    ]}},
    points: [
      "React 19 lets you render `<title>`, `<meta>` and `<link>` inside components; React moves them into `<head>`.",
      "Use real paths (`/recipes/lasagne`) with `BrowserRouter`, not `#/` hashes. One canonical URL per page.",
      "Social bots (link previews) don't run JS: Open Graph tags need SSR or prerendered HTML.",
      "Add `robots.txt` and `sitemap.xml` in `public/`; return real 404s for missing content where you can.",
      "Semantic HTML (`h1`, `nav`, `article`, `a href`) and fast pages (Core Web Vitals) both help ranking.",
      "Private apps (dashboards behind login) usually don't need SEO at all."
    ],
    code: { file: "RecipePage.jsx", lang: "jsx", src: `export default function RecipePage({ recipe }) {
  const url = \`https://recipebox.example/recipes/\${recipe.slug}\`;

  return (
    <article>
      {/* React 19 hoists these into <head> */}
      <title>{\`\${recipe.name} | Recipe Box\`}</title>
      <meta name="description" content={recipe.summary} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={recipe.name} />
      <meta property="og:image" content={recipe.photoUrl} />

      <h1>{recipe.name}</h1>
      <p>{recipe.summary}</p>
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}`, walk: [
      { lines: [2], note: "One clean, canonical URL per recipe." },
      { lines: [7], note: "`<title>` needs a **single string** child, so build it with a template literal." },
      { lines: [8, 9], note: "Description shows under the search result; canonical prevents duplicate URLs competing." },
      { lines: [10, 11], note: "Open Graph for link previews. Only reliable when the HTML is server-rendered or prerendered." },
      { lines: [13, 15], note: "One `h1`, real headings and lists: crawlers understand the structure." }
    ]},
    output: "The browser tab reads “Lasagne | Recipe Box” and `<head>` contains the description, canonical link and og: tags.",
    mistakes: [
      { bad: `<div onClick={() => navigate('/recipes/7')}>Lasagne</div>`, good: `<Link to="/recipes/7">Lasagne</Link>`, why: "Crawlers follow `<a href>` links, not click handlers. `Link` renders a real anchor." },
      { bad: `<title>{recipe.name} | Recipe Box</title>`, good: `<title>{\`\${recipe.name} | Recipe Box\`}</title>`, why: "Several children make an array; React expects a single string for `<title>`." }
    ],
    practice: [
      { level: "B", q: "Write a `robots.txt` that allows all and points to the sitemap.", a: "Put it in `public/`.", code: `User-agent: *\nAllow: /\nSitemap: https://recipebox.example/sitemap.xml` },
      { level: "I", q: "Which pages of a shop need SEO, and which don't?", a: "Need: home, category, product pages. Don't: cart, checkout, account (add `noindex`)." },
      { level: "I", q: "Social previews show the default title on Slack. Why?", a: "Their bots read the initial HTML without running JS. Prerender or server-render those pages." },
      { level: "C", q: "Recipes change weekly. SSR or prerender?", a: "Prerender at build time (static generation) and rebuild on change; it's cheaper. Use SSR if content is per request or changes constantly." }
    ],
    quiz: [
      { q: "What's the core SEO weakness of a plain SPA?", options: ["No CSS", "The first HTML has almost no content", "It can't use links", "It's always slow"], answer: 1, why: "Content appears only after JS runs, which some bots never do." },
      { q: "How does React 19 handle `<title>` inside a component?", options: ["Ignores it", "Renders it in the body", "Hoists it into `<head>`"], answer: 2, why: "Built-in document metadata support." },
      { q: "Link preview bots read Open Graph tags set by client-side JS.", options: ["True", "False"], answer: 1, why: "They usually don't execute JavaScript." }
    ],
    rev: {
      sec30: "SPAs ship near-empty HTML, so bots may not see content. Give pages real URLs, unique titles, descriptions and canonicals (React 19 hoists `<title>`/`<meta>` to `<head>`), semantic HTML and real links, plus `robots.txt`/`sitemap.xml`. For pages that must rank or have rich link previews, prerender or SSR (framework-only: Next.js, React Router framework mode).",
      interview: [
        { level: "basic", q: "Why are SPAs harder for SEO?", a: "The initial HTML is a shell; content and meta tags appear only after JavaScript runs, which some crawlers skip or delay." },
        { level: "intermediate", q: "How do you set page titles in React 19?", a: "Render `<title>` and `<meta>` in the component; React hoists them to `<head>`. Libraries like react-helmet are no longer required." },
        { level: "advanced", q: "SSR vs prerendering (SSG) for SEO?", a: "Both send full HTML. Prerendering builds HTML once at build time (cheap, fast, CDN). SSR renders per request (fresh or personalised content, needs a server)." },
        { level: "tricky", q: "Does Google index client-rendered React?", a: "Usually, via a later rendering pass, but slower and less reliable; other search engines and social bots often don't. Don't rely on it for important pages." }
      ],
      cheat: [
        "SPA first HTML = empty shell",
        "React 19: `<title>`, `<meta>`, `<link>` hoist to `<head>`",
        "`<title>` child must be one string",
        "Real URLs + `<a href>` (`Link`), canonical per page",
        "`robots.txt` + `sitemap.xml` in `public/`",
        "Must rank or preview? SSR / prerender (framework-only)"
      ]
    },
    related: ["INTRO-009", "INTRO-013", "NEXT-013", "PROD-004"]
  },

  "PROD-016": {
    tldr: "Accessibility (a11y) means everyone can use your app: keyboard users, screen-reader users, people with low vision. The WCAG basics: use real elements (**roles**), name every control (**labels**), manage **focus**, and keep enough **contrast**.",
    analogy: { icon: "♿", text: "A café with a ramp, a menu in large print and staff who can read it aloud. It costs little when planned and helps far more people than you'd expect." },
    visual: { type: "layers", title: "The four basics", items: [
      { label: "Contrast", detail: "Text at least **4.5:1** (3:1 for large text and UI parts). Don't use colour alone." },
      { label: "Focus", detail: "Everything works with Tab/Enter/Esc; focus is visible; move it into dialogs and back." },
      { label: "Labels (names)", detail: "`<label htmlFor>`, `alt` text, `aria-label` for icon-only buttons." },
      { label: "Roles (semantics)", detail: "`<button>`, `<a href>`, `<nav>`, `<main>`, headings. Native first, ARIA second." }
    ]},
    points: [
      "**Native elements first**: `<button>` gives role, focus and Enter/Space for free; a clickable `<div>` gives nothing.",
      "Every input needs a visible `<label>`; link errors with `aria-describedby` and mark `aria-invalid`.",
      "Announce async updates (cart updated, saved) with `role=\"status\"` (polite live region).",
      "Never remove focus outlines without a replacement (`:focus-visible`).",
      "`useId()` makes unique ids for label/description pairs.",
      "Test: keyboard only, a screen reader, `eslint-plugin-jsx-a11y`, axe / Lighthouse, RTL `getByRole`."
    ],
    code: { file: "NewsletterForm.jsx", lang: "jsx", src: `import { useId, useState } from 'react';

export default function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter an email like name@example.com');
      return;
    }
    setError('');
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id}>Email</label>
      <input
        id={id}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? \`\${id}-err\` : undefined}
      />
      {error && <p id={\`\${id}-err\`}>{error}</p>}
      <button type="submit">Subscribe</button>
      <p role="status">{done ? 'Thanks! Check your inbox.' : ''}</p>
    </form>
  );
}`, walk: [
      { lines: [4], note: "`useId` gives a stable unique id, safe with several forms on one page." },
      { lines: [21, 23], note: "`htmlFor` + `id` connect the label: clicking it focuses the input, screen readers read “Email”." },
      { lines: [27, 28, 30], note: "Invalid state and the error text are tied to the input, so the error is read with it." },
      { lines: [31], note: "A real `<button>`: keyboard and screen-reader support built in." },
      { lines: [32], note: "The live region is always in the DOM; changing its text gets announced." }
    ]},
    output: "Submitting “bob” shows the error; on the field a screen reader reads “Email, invalid entry, Enter an email like name@example.com”. A valid email announces “Thanks! Check your inbox.”",
    mistakes: [
      { bad: `<div className="btn" onClick={addToCart}>Add</div>`, good: `<button type="button" onClick={addToCart}>Add</button>`, why: "A `div` isn't focusable, has no role and ignores Enter/Space. `<button>` has it all." },
      { bad: `<button onClick={close}><XIcon /></button>`, good: `<button onClick={close} aria-label="Close dialog"><XIcon aria-hidden="true" /></button>`, why: "An icon-only button has no accessible name; screen readers just say “button”." },
      { bad: `*:focus { outline: none; }`, good: `:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; }`, why: "Keyboard users lose track of where they are. Style focus, don't remove it." }
    ],
    practice: [
      { level: "B", q: "Give a product photo good `alt` text.", a: "Describe what matters: `alt=\"Red cotton T-shirt, front view\"`. Decorative images get `alt=\"\"`." },
      { level: "I", q: "Find accessibility issues automatically.", a: "Add `eslint-plugin-jsx-a11y`, run axe DevTools or Lighthouse, and query by role in tests (`getByRole('button', { name: /subscribe/i })`)." },
      { level: "I", q: "Announce “Added to cart” after clicking Add.", a: "Keep `<p role=\"status\">` mounted and set its text when the item is added." },
      { level: "C", q: "Make a modal accessible.", a: "Use `<dialog>` with `showModal()` (focus trap and Esc built in) or a library; label it with `aria-labelledby`, return focus to the opener on close." }
    ],
    quiz: [
      { q: "Minimum contrast for normal body text (WCAG AA)?", options: ["2:1", "3:1", "4.5:1", "7:1"], answer: 2, why: "4.5:1 for normal text; 3:1 for large text and UI components." },
      { q: "Best way to make a clickable control?", options: ["`<div onClick>`", "`<span role=\"button\">`", "`<button>`"], answer: 2, why: "Native buttons are focusable and keyboard-operable for free." },
      { q: "How do you name an icon-only button?", options: ["`title` only", "`aria-label`", "A CSS class", "Nothing needed"], answer: 1, why: "`aria-label` gives it an accessible name for screen readers." }
    ],
    rev: {
      sec30: "WCAG basics: semantic native elements (roles), accessible names (labels, alt, aria-label), keyboard and focus management (visible focus, dialogs move and return focus), and contrast (4.5:1 text). Use ARIA only to fill gaps, live regions for async messages, `useId` for label ids, and test with keyboard, screen reader, jsx-a11y and axe.",
      interview: [
        { level: "basic", q: "Why prefer `<button>` over a clickable `<div>`?", a: "It's focusable, announced as a button, and works with Enter and Space; a div needs `tabIndex`, `role` and key handlers to fake it." },
        { level: "intermediate", q: "How do you make form errors accessible?", a: "Visible label, `aria-invalid` on the field, error text linked with `aria-describedby`, and move focus to the first error on submit." },
        { level: "advanced", q: "What's the first rule of ARIA?", a: "Don't use ARIA if a native element does the job. Wrong ARIA is worse than none because it lies to assistive tech." },
        { level: "intermediate", q: "How do SPAs break accessibility on navigation?", a: "No page load means no announcement or focus reset. Move focus to the new page's `h1` (or announce the title) on route change." },
        { level: "tricky", q: "Is `placeholder` a label?", a: "No. It disappears while typing, often has low contrast, and isn't reliably announced. Use a real `<label>`." }
      ],
      cheat: [
        "Native elements first; ARIA only to fill gaps",
        "Every input: `<label htmlFor>`; images: `alt`",
        "Icon buttons: `aria-label`",
        "Visible focus with `:focus-visible`, never just remove outlines",
        "Contrast 4.5:1 text, 3:1 large text/UI",
        "Async messages: `role=\"status\"` live region",
        "Test: keyboard, screen reader, jsx-a11y, axe"
      ]
    },
    related: ["WEB-006", "HOOKS-013", "EVT-017", "TEST-007"]
  },

  "PROD-017": {
    tldr: "Production bugs come with minified stack traces and vague reports. Turn the stack into real file and line numbers with **source maps**, collect exact **repro steps** (release, browser, URL, actions), reproduce locally, then fix with a test.",
    analogy: { icon: "🔍", text: "A detective with a smudged fingerprint (minified stack) uses a lookup card (source map) to find the suspect, then re-enacts the scene (repro steps) to prove it." },
    visual: { type: "flow", title: "Debugging a production bug", steps: [
      { label: "Gather", detail: "Release/commit, browser, URL, user actions, error id, breadcrumbs." },
      { label: "Map the stack", detail: "`index-Bk3.js:1:9831` → `Cart.jsx:42` via uploaded source maps." },
      { label: "Reproduce", detail: "Same build (`vite preview`), same data, same steps. Write them down." },
      { label: "Fix + test", detail: "A failing test first, then the fix. Prevents the bug coming back." },
      { label: "Verify", detail: "Ship, then watch the error count for that release drop to zero." }
    ]},
    points: [
      "**Source maps** (`.map`) link minified code to your source. Generate with `build.sourcemap`.",
      "Use `'hidden'` maps and **upload** them to your error tool, then delete them from `dist/`, so the public can't read your source easily.",
      "Maps must match the **exact release**: upload per build, tagged with the same `release` id.",
      "A good repro: version, browser + OS, account type, URL, numbered steps, expected vs actual.",
      "Reproduce against the **build**, not dev: some bugs only exist after minify or with prod env values.",
      "Common culprits: stale chunks after deploy, missing env values, real-world data shapes, timezones."
    ],
    code: { file: "vite.config.js", lang: "js", src: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: {
    sourcemap: 'hidden', // .map files, no public link comment
  },
  plugins: [
    react(),
    // keep the Sentry plugin last
    sentryVitePlugin({
      org: 'my-shop',
      project: 'web',
      authToken: process.env.SENTRY_AUTH_TOKEN, // CI secret
      release: { name: process.env.GITHUB_SHA },
      sourcemaps: {
        filesToDeleteAfterUpload: ['./dist/**/*.map'],
      },
    }),
  ],
});`, walk: [
      { lines: [6, 7, 8], note: "Emit maps without the `sourceMappingURL` comment in the shipped JS." },
      { lines: [12, 13, 14, 15], note: "The plugin uploads maps during `vite build`; the token is a CI secret, never a `VITE_` var." },
      { lines: [16], note: "Release = commit SHA. Init the SDK with the same value so events match the maps." },
      { lines: [17, 18, 19], note: "Remove `.map` files from `dist/` after upload, so they're never deployed." }
    ]},
    output: "Before: TypeError at index-Bk3a9Q.js:1:9831. After: TypeError: Cannot read properties of undefined (reading 'price') at CartTotal (src/Cart.jsx:42:18).",
    mistakes: [
      { bad: `// "It crashes sometimes on checkout"\n// → start guessing and changing code`, good: `// Release a1b2c3, Safari 18 iOS, /checkout\n// 1. add 2 items 2. apply code SAVE10 3. tap Pay\n// Expected: order. Actual: blank screen`, why: "Without exact steps and version you can't reproduce, and without reproducing you can't confirm the fix." },
      { bad: `build: { sourcemap: true }\n// .map files deployed publicly`, good: `build: { sourcemap: 'hidden' }\n// upload to error tool, delete from dist/`, why: "Public maps expose your full original source. Hidden maps give you readable stacks without that." }
    ],
    practice: [
      { level: "B", q: "What does a source map do?", a: "Maps positions in minified output back to the original file, line and column." },
      { level: "I", q: "Write a bug report template for your team.", a: "Release/commit · Environment · Browser/OS/device · URL · Steps (numbered) · Expected · Actual · Error id/screenshot · Frequency." },
      { level: "I", q: "Users see “Failed to fetch dynamically imported module” after a deploy. Why?", a: "Their open tab references chunk files from the old build that were deleted. Keep old assets for a while and reload on that error (Vite fires `vite:preloadError`)." },
      { level: "C", q: "Reload once when a chunk fails to load.", a: "Listen for Vite's event.", code: `window.addEventListener('vite:preloadError', (event) => {\n  event.preventDefault();\n  window.location.reload();\n});` }
    ],
    quiz: [
      { q: "Why `sourcemap: 'hidden'`?", options: ["Maps are smaller", "Maps exist for tools, but browsers aren't pointed to them", "It disables maps"], answer: 1, why: "No `sourceMappingURL` comment; upload maps privately." },
      { q: "Maps uploaded for release A, error comes from release B. Result?", options: ["Stack is mapped fine", "Stack can be wrong or unmapped", "Sentry rebuilds the code"], answer: 1, why: "Maps only match the exact build they came from." },
      { q: "Best place to reproduce a prod-only bug first?", options: ["`npm run dev`", "A production build (`vite build` + `preview`) with prod-like config", "Directly in production code"], answer: 1, why: "Dev differs (no minify, different env, Strict Mode)." }
    ],
    rev: {
      sec30: "Collect context (release, browser, URL, steps, breadcrumbs), map minified stacks with source maps (`sourcemap: 'hidden'`, uploaded per release, deleted from `dist/`), reproduce on a production build with prod-like data, write a failing test, fix, and watch the error rate for the new release. Watch for stale chunks, env gaps and real-world data.",
      interview: [
        { level: "basic", q: "Why are production stack traces unreadable?", a: "Code is minified and bundled; names and lines are gone. Source maps translate them back." },
        { level: "intermediate", q: "How do you use source maps without exposing your code?", a: "Build with `sourcemap: 'hidden'`, upload maps to the error tool tagged with the release, and delete them from the deploy." },
        { level: "advanced", q: "Walk through debugging a crash only some users see.", a: "Filter the issue by browser/release/route, read breadcrumbs, map the stack, recreate their data and steps on a prod build, add a failing test, fix, release, confirm the count drops." },
        { level: "tricky", q: "Bug only in production, not in dev. Usual suspects?", a: "Env values, base path, minification-sensitive code (relying on function names), stale chunks after deploy, Strict Mode masking, or real data shapes." }
      ],
      cheat: [
        "`build.sourcemap: 'hidden'` + upload + delete from `dist/`",
        "Maps must match the exact release id",
        "Repro: release, browser, URL, steps, expected vs actual",
        "Reproduce on `vite build` + `preview`, not dev",
        "Failing test before the fix",
        "Chunk load error after deploy → `vite:preloadError` reload"
      ]
    },
    related: ["PROD-012", "PROD-003", "ENV-015", "ENV-013"]
  },

  "PROD-018": {
    tldr: "Apps rot if you never update them. Keep dependencies fresh in **small, regular steps**: check what's outdated or vulnerable, take minor updates often, and do each **major** upgrade (like React 19) on its own branch with codemods and tests.",
    analogy: { icon: "🚲", text: "Servicing a bike: oil the chain every few weeks and it runs for years. Ignore it for three years and every part needs replacing at once." },
    visual: { type: "cycle", title: "The maintenance loop", steps: [
      { label: "Check", detail: "`npm outdated`, `npm audit`, bot PRs (Dependabot / Renovate)." },
      { label: "Patch & minor", detail: "Batch small updates; CI must stay green." },
      { label: "One major", detail: "Own branch. Read the upgrade guide and changelog. Run codemods." },
      { label: "Test", detail: "Unit + E2E + manual smoke test on a preview deploy." },
      { label: "Release & watch", detail: "Ship, monitor errors for that release, roll back if needed." }
    ]},
    points: [
      "Semver: `^19.2.0` allows minor/patch updates; a **major** (20.x) may break things.",
      "Commit the lockfile; `npm ci` in CI keeps installs identical.",
      "Upgrade **one major at a time** (React, then Router, then Vite), never all at once.",
      "React 19 upgrade: follow react.dev's guide, run `npx codemod@latest react/19/migration-recipe`, update `@types/react`.",
      "Remove unused deps (fewer updates, smaller attack surface). Check Node version requirements (Vite 8 needs modern Node).",
      "Good tests are what make upgrades boring. No tests = scary upgrades."
    ],
    code: { file: "terminal", lang: "bash", src: `# 1. What's behind, and what's vulnerable?
npm outdated
npm audit

# 2. Safe updates inside your ^ ranges
npm update
npm run ci

# 3. One major upgrade, on its own branch
git switch -c upgrade/react-19
npm install react@^19.2.0 react-dom@^19.2.0
npm install -D @types/react@^19 @types/react-dom@^19
npx codemod@latest react/19/migration-recipe

# 4. Prove it still works
npm run ci
npm run test:e2e
git commit -am "Upgrade to React 19.2"`, walk: [
      { lines: [2, 3], note: "`outdated` shows current / wanted / latest; `audit` lists known vulnerabilities." },
      { lines: [6, 7], note: "`npm update` stays within semver ranges, then the full check runs." },
      { lines: [10], note: "A separate branch makes the upgrade easy to review and revert." },
      { lines: [11, 12], note: "Upgrade React and its types together so versions match." },
      { lines: [13], note: "The official codemod rewrites removed APIs (e.g. `ReactDOM.render`, removed in 19, → `createRoot`)." },
      { lines: [16, 17], note: "Unit and E2E tests must pass before merging." }
    ]},
    output: "`npm outdated` prints a table like: react 18.3.1 | wanted 18.3.1 | latest 19.2.x. After the branch passes CI, the upgrade merges as one reviewed PR.",
    mistakes: [
      { bad: `npx npm-check-updates -u && npm install\n# 14 majors at once`, good: `# one major per branch/PR\nnpm install react@^19.2.0 react-dom@^19.2.0`, why: "When everything breaks at once you can't tell which upgrade caused what." },
      { bad: `npm audit fix --force`, good: `npm audit\n# read each advisory, update the package, run tests`, why: "`--force` can install breaking majors silently. Many advisories also affect only dev tools, not shipped code." }
    ],
    practice: [
      { level: "B", q: "What does `^5.2.1` allow?", a: "Any 5.x.x version at or above 5.2.1, but not 6.0.0." },
      { level: "I", q: "Set up automatic weekly update PRs.", a: "Add Dependabot.", code: `# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: weekly` },
      { level: "I", q: "Find packages you no longer use.", a: "Run `npx knip` or `npx depcheck`, review the list, uninstall what's truly unused." },
      { level: "C", q: "Plan a React 18 → 19 upgrade for a big shop app.", a: "Upgrade to 18.3 first and fix its warnings, then React 19 + types on a branch, run codemods, fix removed APIs (`propTypes`, string refs, legacy context), test, ship behind monitoring." }
    ],
    quiz: [
      { q: "Safest way to handle many outdated packages?", options: ["Update all to latest at once", "Minors together, majors one by one with tests", "Never update"], answer: 1, why: "Small steps make failures easy to trace and revert." },
      { q: "What does `npm audit fix --force` risk?", options: ["Nothing", "Installing breaking major versions", "Deleting your lockfile"], answer: 1, why: "It will cross major versions to resolve advisories." },
      { q: "Recommended path from React 18 to 19?", options: ["Go via 18.3, then 19 with the official codemods", "Rewrite in class components", "Switch to Create React App"], answer: 0, why: "React 18.3 adds warnings for APIs removed in 19; codemods automate the rest. (Create React App is deprecated.)" }
    ],
    rev: {
      sec30: "Maintain continuously: `npm outdated` and `npm audit` (plus Dependabot/Renovate), batch patch/minor updates under green CI, and do each major on its own branch using the official upgrade guide and codemods (React 19: `npx codemod@latest react/19/migration-recipe`, update types). Commit the lockfile, remove unused deps, test, release and monitor.",
      interview: [
        { level: "basic", q: "How do you check for outdated or vulnerable packages?", a: "`npm outdated` for versions and `npm audit` for advisories, usually automated with Dependabot or Renovate." },
        { level: "intermediate", q: "How do you upgrade a major dependency safely?", a: "Separate branch, read the changelog and migration guide, run codemods, fix type and test failures, test on a preview deploy, then merge and monitor." },
        { level: "advanced", q: "What changed in React 19 that affects upgrades?", a: "Removed legacy APIs like `ReactDOM.render`, `hydrate`, string refs, `propTypes` checks and legacy context; `ref` became a regular prop for function components. Codemods handle most of it." },
        { level: "tricky", q: "`npm audit` reports 30 high issues. Panic?", a: "Not yet. Check whether they're in shipped runtime code or just build tools, and whether the vulnerable path is reachable. Fix the real ones by updating the package, not blindly with `--force`." }
      ],
      cheat: [
        "`npm outdated` · `npm audit` · Dependabot/Renovate",
        "`^1.2.3` = minor/patch ok, major blocked",
        "Commit the lockfile; `npm ci` in CI",
        "One major per branch/PR",
        "React 19: `npx codemod@latest react/19/migration-recipe`",
        "Avoid `npm audit fix --force`",
        "Tests make upgrades boring"
      ]
    },
    related: ["SEC-009", "WEB-040", "ENV-006", "PROD-010"]
  },
};
