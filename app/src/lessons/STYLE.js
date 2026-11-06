export default {
  "STYLE-001": {
    tldr: "React doesn't force one way to style. You can use plain CSS files, CSS Modules, inline `style` objects, CSS-in-JS libraries or utility classes (Tailwind). Each trades off scoping, speed and convenience.",
    analogy: { icon: "👕", text: "Dressing for the day. A school uniform (global CSS) fits everyone, a name-tagged locker (CSS Modules) keeps your stuff yours, and a quick accessory (inline style) changes one detail." },
    visual: { type: "tree", title: "The styling menu", root: { label: "Styling in React", children: [
      { label: "Plain CSS", note: "build time, zero JS", children: [ { label: "Global stylesheet" }, { label: "CSS Modules", note: "scoped per file" } ] },
      { label: "Inline style", note: "dynamic values only" },
      { label: "CSS-in-JS", children: [ { label: "Runtime", note: "styled-components, Emotion" }, { label: "Zero-runtime", note: "vanilla-extract, Panda" } ] },
      { label: "Utility classes", note: "Tailwind CSS" },
      { label: "Component libraries", note: "MUI, Bootstrap, shadcn/ui" }
    ]}},
    points: [
      "React only sets attributes: `className` (not `class`) for CSS classes and `style` for inline styles.",
      "**Global CSS**: easy, but class names can clash across components.",
      "**CSS Modules**: plain CSS with names scoped per file. A safe default in Vite.",
      "**Tailwind**: utility classes right in JSX. Today's most popular choice for new apps.",
      "**Runtime CSS-in-JS** (styled-components, Emotion) costs JS at runtime and fits poorly with Server Components.",
      "Pick **one main approach** per app; inline styles only for truly dynamic values."
    ],
    code: { file: "ProductCard.jsx", lang: "jsx", src: `import './index.css';                    // global stylesheet
import styles from './Card.module.css';  // CSS Module

// Demo only: a real app picks ONE main approach.
export default function ProductCard({ name, stock }) {
  const low = stock < 5;

  return (
    <article className={styles.card}>
      <h2 className="title">{name}</h2>
      <p style={{ color: low ? 'crimson' : 'green' }}>
        {stock} left
      </p>
      <button className="rounded bg-blue-600 px-3 py-1 text-white">
        Add to cart
      </button>
    </article>
  );
}`, walk: [
      { lines: [1], note: "A plain CSS import applies to the **whole page** (global)." },
      { lines: [2, 9], note: "A CSS Module returns an object of scoped class names: `styles.card`." },
      { lines: [10], note: "A normal global class. Works, but `.title` could clash with another file." },
      { lines: [11], note: "Inline `style` object: good for a value computed from props or state." },
      { lines: [14], note: "Tailwind utility classes (needs the Tailwind Vite plugin set up)." }
    ]},
    output: "A product card: heading, stock line in green (or red when fewer than 5 left), and a blue Add to cart button.",
    mistakes: [
      { bad: `<div class="card">`, good: `<div className="card">`, why: "`class` is a reserved word in JS. React uses `className` (React warns about `class` in dev)." },
      { bad: `// every component has its own global .title\nimport './Header.css';\nimport './Card.css';`, good: `import styles from './Card.module.css';\n<h2 className={styles.title}>`, why: "All global CSS lands in one page. Two `.title` rules fight; the one loaded last wins." }
    ],
    practice: [
      { level: "B", q: "Which attribute does React use for CSS classes?", a: "`className`. Its value is a string of space-separated class names." },
      { level: "B", q: "Name one approach that scopes class names per component without any library.", a: "CSS Modules: name the file `*.module.css`; Vite supports it out of the box." },
      { level: "I", q: "When is an inline `style` object the right tool?", a: "For values computed at runtime, e.g. a progress bar width from state. Not for whole designs: no hover, no media queries." },
      { level: "C", q: "A team plans to move to Next.js Server Components. Which styling approach should they avoid for new code and why?", a: "Runtime CSS-in-JS (e.g. Emotion): it relies on context and browser style injection, so it needs Client Components. Prefer CSS Modules, Tailwind or zero-runtime CSS-in-JS." }
    ],
    quiz: [
      { q: "What does `import './index.css'` in a component do?", options: ["Scopes the CSS to that component", "Adds the CSS globally to the whole page", "Turns CSS into inline styles"], answer: 1, why: "Plain CSS imports are global. Only `*.module.css` files are scoped." },
      { q: "Which approach adds JavaScript work at runtime?", options: ["CSS Modules", "Tailwind CSS", "styled-components", "A global stylesheet"], answer: 2, why: "Runtime CSS-in-JS generates and injects styles in the browser. The others compile to static CSS." },
      { q: "Inline styles can express `:hover` and media queries.", options: ["True", "False"], answer: 1, why: "The `style` attribute only sets properties on one element. Use a class for states and breakpoints." }
    ],
    rev: {
      sec30: "React styles with `className` and `style`. Options: global CSS (simple, clashes), CSS Modules (scoped, zero runtime), Tailwind (utilities in JSX, very popular), runtime CSS-in-JS (dynamic, but runtime cost and poor Server Component fit), zero-runtime CSS-in-JS, and component libraries. Choose one main approach; inline for dynamic values.",
      interview: [
        { level: "basic", q: "Why `className` instead of `class`?", a: "JSX is JavaScript and `class` is a reserved word, so React maps the DOM property name `className`." },
        { level: "intermediate", q: "Compare CSS Modules and Tailwind.", a: "CSS Modules keep normal CSS in separate files with auto-scoped names. Tailwind puts small utility classes in JSX, so you rarely write CSS but markup gets longer. Both compile to static CSS." },
        { level: "advanced", q: "Why has runtime CSS-in-JS fallen out of favour?", a: "It serialises and injects styles during render, which costs CPU and bundle size, and it relies on context, so most libraries need Client Components. Static options avoid both." },
        { level: "tricky", q: "Is inline `style` faster than classes?", a: "Not meaningfully, and it scales worse: no caching, no pseudo-classes or media queries, and a new object each render. Use it only for truly dynamic values." }
      ],
      compare: { cols: ["", "Global CSS", "CSS Modules", "Tailwind", "Runtime CSS-in-JS"], rows: [
        ["Scoped", "No", "Yes", "N/A (utilities)", "Yes"],
        ["Runtime cost", "None", "None", "None", "Some"],
        ["Server Components", "Yes", "Yes", "Yes", "Mostly client only"]
      ]},
      cheat: [
        "`className` for classes, `style={{...}}` for inline styles",
        "Plain `.css` imports are global",
        "`*.module.css` = scoped class names",
        "Tailwind = utility classes, static CSS output",
        "Runtime CSS-in-JS = JS cost, poor Server Component fit",
        "One main approach per app; inline only for dynamic values"
      ]
    },
    related: ["STYLE-003", "STYLE-008", "STYLE-016", "JSX-009"]
  },

  "STYLE-002": {
    tldr: "Write normal `.css` files and `import` them in JavaScript. Vite bundles them and adds them to the page. The rules are **global**: they apply everywhere, not just in the importing component.",
    analogy: { icon: "📢", text: "A shop-wide announcement. Once it's on the speaker, every aisle hears it, no matter which aisle the announcer stood in." },
    visual: { type: "flow", title: "From .css file to the page", steps: [
      { label: "Write CSS", detail: "`index.css` holds resets, fonts and shared classes like `.btn`." },
      { label: "Import in JS", detail: "`import './index.css'` in `main.jsx` (once, at the entry)." },
      { label: "Vite bundles", detail: "Dev: injected as a `<style>` tag with hot reload. Build: one hashed `.css` file." },
      { label: "Browser applies", detail: "Rules match **every** element on the page with that selector." }
    ]},
    points: [
      "Import global CSS once, in `main.jsx` or `App.jsx`: `import './index.css'`.",
      "Importing a CSS file inside a component does **not** scope it; it is still global.",
      "Import order = cascade order. Later files win ties: put library CSS first, your overrides after.",
      "Good for resets, fonts, CSS variables and base element styles (`body`, `h1`, `a`).",
      "Library styles import the same way: `import 'bootstrap/dist/css/bootstrap.min.css'`."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'modern-normalize/modern-normalize.css'; // library reset first
import './index.css';                           // your globals after
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/* index.css
:root { --brand: #2563eb; font-family: system-ui, sans-serif; }
body  { margin: 0; background: #f8fafc; }
.btn  { background: var(--brand); color: white; border-radius: 6px; }
*/`, walk: [
      { lines: [3], note: "Third-party CSS from `node_modules` imports by package path." },
      { lines: [4], note: "Your global stylesheet comes **after**, so it can override the library." },
      { lines: [7, 8, 9, 10, 11], note: "Standard Vite entry: CSS imports run before the app renders." },
      { lines: [14, 15, 16], note: "Good global content: variables, base `body` styles, a shared `.btn` class." }
    ]},
    output: "Every `<button className=\"btn\">` anywhere in the app is blue with white text.",
    mistakes: [
      { bad: `// Cart.jsx\nimport './Cart.css'; // .title { color: red }\n// Menu.jsx\nimport './Menu.css'; // .title { color: blue }`, good: `import styles from './Cart.module.css';\n<h2 className={styles.title}>`, why: "Both files are global; `.title` clashes and the last loaded wins. Use CSS Modules for component styles." },
      { bad: `<link rel="stylesheet" href="/src/index.css">\n<!-- plus import './index.css' -->`, good: `import './index.css'; // once, in main.jsx`, why: "Loading the same CSS twice duplicates rules. Let Vite handle CSS through imports." }
    ],
    practice: [
      { level: "B", q: "Add a global font for the whole notes app.", a: "In `index.css`: `body { font-family: 'Inter', system-ui, sans-serif; }`, imported once in `main.jsx`." },
      { level: "B", q: "Where should Bootstrap's CSS import go relative to your own CSS?", a: "Before it, so your rules can override Bootstrap's when specificity is equal." },
      { level: "I", q: "You import `Modal.css` only inside `Modal.jsx`. Is it applied when the modal isn't rendered?", a: "Yes, once the module is loaded its CSS is global. If `Modal.jsx` is lazy-loaded, the CSS arrives when that chunk loads." },
      { level: "C", q: "Two global files both define `.card`. How do you fix it without renaming everything?", a: "Move component styles to `Card.module.css` (scoped), or use a naming convention like BEM (`.cart-card`) to avoid collisions." }
    ],
    quiz: [
      { q: "`import './Header.css'` inside `Header.jsx` applies its rules to...", options: ["Only the Header component", "The whole page", "Nothing until you call a function"], answer: 1, why: "Plain CSS imports are global regardless of where they're imported." },
      { q: "Two equally specific rules in different files. Which wins?", options: ["The file imported first", "The file imported last", "Random"], answer: 1, why: "The cascade: later rules win ties, and Vite keeps import order." },
      { q: "What does `vite build` do with your imported CSS?", options: ["Leaves it as inline `<style>` tags", "Extracts it into hashed `.css` files", "Converts it to inline styles"], answer: 1, why: "In production Vite extracts and minifies CSS into cacheable files." }
    ],
    rev: {
      sec30: "External stylesheets are plain `.css` files imported in JS (`import './index.css'`). Vite injects them in dev and extracts hashed files in build. They are global: import order decides ties. Use them for resets, fonts, variables and base styles; use CSS Modules or Tailwind for component styles.",
      interview: [
        { level: "basic", q: "How do you add a global stylesheet in a Vite React app?", a: "Import it once at the entry: `import './index.css'` in `main.jsx`." },
        { level: "intermediate", q: "Does importing CSS in a component scope it?", a: "No. Plain CSS is always global; the import only makes sure it's bundled. Scoping needs CSS Modules or similar." },
        { level: "advanced", q: "How do you control which of two global rules wins?", a: "Import order (later wins ties) and specificity. Modern CSS also has `@layer` to order whole groups, e.g. `@layer reset, library, app;`." },
        { level: "tricky", q: "Why might styles look different after `vite build` than in dev?", a: "Code splitting can change the order CSS chunks load in, so order-dependent overrides break. Avoid relying on cross-file order for component styles." }
      ],
      cheat: [
        "`import './index.css'` once in `main.jsx`",
        "Plain CSS imports are **global**",
        "Later import wins equal-specificity ties",
        "Library CSS first, your overrides after",
        "Use for resets, fonts, variables, base element styles",
        "`@layer` orders groups of rules explicitly"
      ]
    },
    related: ["STYLE-001", "STYLE-003", "WEB-007", "ENV-004"]
  },

  "STYLE-003": {
    tldr: "A CSS Module is a CSS file named `*.module.css`. Importing it gives an object of class names that the build makes **unique**, so `.title` in one component can never clash with `.title` in another.",
    analogy: { icon: "🏷️", text: "Name labels on lunchboxes in the office fridge. Everyone may have a box called \"lunch\", but the label (hash) makes sure you only grab your own." },
    visual: { type: "flow", title: "How a class name gets scoped", steps: [
      { label: "Write .module.css", detail: "`Button.module.css` contains `.primary { ... }`." },
      { label: "Import as object", detail: "`import styles from './Button.module.css'`." },
      { label: "Build renames", detail: "Vite turns `.primary` into something like `._primary_x7k2a_1`." },
      { label: "Use in JSX", detail: "`className={styles.primary}` puts the unique name on the element." },
      { label: "No clashes", detail: "Another file's `.primary` gets a different hash. Both live happily." }
    ]},
    points: [
      "File must end in **`.module.css`** (or `.module.scss`). Vite supports it with zero setup.",
      "`styles.primary` is just a string: the generated class name.",
      "Kebab-case names need brackets: `styles['add-btn']`. Or use camelCase class names.",
      "Combine classes with a template string or `clsx`: `clsx(styles.btn, styles.big)`.",
      "`:global(.dark)` opts one selector out of scoping; `composes: base;` reuses another class.",
      "Plain CSS, zero runtime, works with Server Components."
    ],
    code: { file: "AddToCart.jsx", lang: "jsx", src: `import styles from './AddToCart.module.css';

export default function AddToCart({ inCart, onClick }) {
  return (
    <button
      className={\`\${styles.btn} \${inCart ? styles.added : ''}\`}
      onClick={onClick}
    >
      {inCart ? '✓ In cart' : 'Add to cart'}
    </button>
  );
}

/* AddToCart.module.css
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  background: #2563eb;
  color: white;
}
.btn:hover { background: #1d4ed8; }
.added { background: #16a34a; }
*/`, walk: [
      { lines: [1], note: "Import the module. `styles` = `{ btn: '_btn_a1b2c_1', added: '_added_a1b2c_9' }`." },
      { lines: [6], note: "Always apply `btn`; add `added` only when `inCart` is true." },
      { lines: [15, 16, 17, 18, 19, 20], note: "Ordinary CSS. The class name is local to this file." },
      { lines: [21, 22], note: "Pseudo-classes and modifiers work like normal CSS." }
    ]},
    output: "A blue “Add to cart” button. Once added it turns green and reads “✓ In cart”. In DevTools the class looks like `_btn_a1b2c_1`.",
    mistakes: [
      { bad: `import './Card.module.css';\n<div className="card">`, good: `import styles from './Card.module.css';\n<div className={styles.card}>`, why: "The real class is hashed. A literal `\"card\"` matches nothing." },
      { bad: `<div className={styles.product-card}>`, good: `<div className={styles['product-card']}>`, why: "`styles.product - card` is subtraction in JS. Use bracket access or camelCase names." },
      { bad: `<div className={styles.titel}> // typo`, good: `<div className={styles.title}>`, why: "A missing key gives `undefined`, so no class and no error. Check spelling (TypeScript plugins can catch it)." }
    ],
    practice: [
      { level: "B", q: "Create a `Note.module.css` with `.note` and apply it to a note card.", a: "`import styles from './Note.module.css'` then `<div className={styles.note}>`." },
      { level: "I", q: "Style a pinned note differently using a second class.", a: "Add `.pinned` to the module and use `className={clsx(styles.note, pinned && styles.pinned)}`." },
      { level: "I", q: "Make `.note` change colour when `<body class=\"dark\">` is set.", a: "Use `:global`: `:global(.dark) .note { background: #1e293b; }`." },
      { level: "C", q: "Share base button styles between `.primary` and `.danger` without duplicating CSS.", a: "Use `composes`.", code: `.base { padding: 8px 16px; border-radius: 6px; }\n.primary { composes: base; background: #2563eb; }\n.danger { composes: base; background: #dc2626; }` }
    ],
    quiz: [
      { q: "What does `import styles from './X.module.css'` give you?", options: ["A string of CSS", "An object mapping class names to unique generated names", "A React component"], answer: 1, why: "Each key is your class name; each value is the scoped name to put in `className`." },
      { q: "Two modules both define `.title`. What happens?", options: ["The last one overrides the first", "Each gets its own unique name, no clash", "Build error"], answer: 1, why: "Scoping is the whole point of CSS Modules." },
      { q: "Which file is treated as a CSS Module by Vite?", options: ["card.css", "card.module.css", "card.scoped.css"], answer: 1, why: "Only the `.module.` suffix triggers scoping." }
    ],
    rev: {
      sec30: "CSS Modules = `*.module.css` files whose class names are rewritten to unique names at build time. Import as an object (`styles.btn`) and pass to `className`. Zero runtime, plain CSS, no clashes. Use `:global()` to escape scoping and `composes` to reuse classes.",
      interview: [
        { level: "basic", q: "What problem do CSS Modules solve?", a: "Global name collisions. Each file's class names are made unique, so components can't accidentally style each other." },
        { level: "intermediate", q: "How do CSS Modules differ from CSS-in-JS?", a: "They're plain CSS compiled at build time with no runtime cost. CSS-in-JS writes styles in JS and may generate them at runtime, which allows prop-based styles but costs performance." },
        { level: "intermediate", q: "How do you apply two module classes conditionally?", a: "Join strings or use `clsx(styles.btn, active && styles.active)`." },
        { level: "advanced", q: "How do you style a child component's internals from a parent module?", a: "You generally don't: pass a `className` prop the child merges onto its root. Reaching in with `:global` couples the two." },
        { level: "tricky", q: "`className={styles.Btn}` renders no class and no error. Why?", a: "Keys are case-sensitive; `Btn` is undefined, and React omits an undefined className silently." }
      ],
      cheat: [
        "File name: `Name.module.css`",
        "`import styles from './Name.module.css'`",
        "`className={styles.card}`; kebab-case → `styles['add-btn']`",
        "Missing key = `undefined` = silent no-style",
        "`:global(.x)` escapes scoping",
        "`composes: base;` reuses a class",
        "Zero runtime; works with Server Components"
      ]
    },
    related: ["STYLE-002", "STYLE-011", "STYLE-001", "STYLE-016"]
  },

  "STYLE-004": {
    tldr: "The `style` prop takes a **JavaScript object**, not a string. Use it for values that change at runtime, like a progress bar width, and keep everything else in classes.",
    analogy: { icon: "🎚️", text: "A music player's volume slider. The player's design is fixed (classes); only the fill level moves with your finger (inline style)." },
    visual: { type: "compare", title: "Inline style vs class", left: { label: "style={{ ... }}", tone: "neutral", points: [
      "Values computed from state or props",
      "camelCase keys: `backgroundColor`",
      "Numbers get `px` for most properties",
      "No `:hover`, media queries or animations",
      "Highest priority over class rules"
    ]}, right: { label: "className", tone: "good", points: [
      "The design itself: colours, spacing, layout",
      "Pseudo-classes and breakpoints work",
      "Cached by the browser, reusable",
      "Switch between fixed variants"
    ]}},
    points: [
      "Double braces: outer `{}` = JSX expression, inner `{}` = the object: `style={{ color: 'red' }}`.",
      "Keys are **camelCase**: `fontSize`, `backgroundColor`. Values are strings or numbers.",
      "`width: 50` becomes `50px`; unitless properties like `opacity`, `zIndex`, `flex` stay as numbers.",
      "Best trick: set a **CSS variable** inline and let a class use it: `style={{ '--pct': pct }}`.",
      "For a few fixed variants (small/large), toggle classes instead of building style objects."
    ],
    code: { file: "Progress.jsx", lang: "jsx", src: `import { useState } from 'react';
import './progress.css';

export default function PlaylistProgress() {
  const [played, setPlayed] = useState(30); // percent

  return (
    <div>
      <div className="track">
        <div className="fill" style={{ width: \`\${played}%\` }} />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={played}
        onChange={e => setPlayed(Number(e.target.value))}
      />
      <p style={{ opacity: played === 100 ? 0.5 : 1 }}>
        {played}% played
      </p>
    </div>
  );
}

/* progress.css
.track { height: 8px; background: #e5e7eb; border-radius: 4px; }
.fill  { height: 100%; background: #8b5cf6; border-radius: 4px;
         transition: width 0.2s; }
*/`, walk: [
      { lines: [5], note: "The dynamic value lives in state." },
      { lines: [9, 10], note: "Fixed look comes from classes; only `width` is inline, computed from state." },
      { lines: [12, 13, 14, 15, 16, 17, 18], note: "Dragging the slider updates `played`, which re-renders with a new width." },
      { lines: [19], note: "`opacity` is unitless, so a plain number is fine." },
      { lines: [27, 28, 29], note: "The transition lives in CSS, so the bar animates smoothly." }
    ]},
    output: "A purple progress bar at 30% with a slider below. Dragging the slider grows the bar smoothly; at 100% the text fades.",
    mistakes: [
      { bad: `<p style="color: red">`, good: `<p style={{ color: 'red' }}>`, why: "React requires an object for `style`. A string throws an error." },
      { bad: `style={{ background-color: 'red' }}`, good: `style={{ backgroundColor: 'red' }}`, why: "Object keys are camelCase JS identifiers; the hyphen is a syntax error." },
      { bad: `style={{ ':hover': { color: 'blue' } }}`, good: `.link:hover { color: blue; }`, why: "Inline styles can't do pseudo-classes or media queries. Use a class." }
    ],
    practice: [
      { level: "B", q: "Show a weather temperature in red above 30°C and blue otherwise, inline.", a: "`<span style={{ color: temp > 30 ? 'red' : 'blue' }}>{temp}°C</span>`" },
      { level: "B", q: "What CSS does `style={{ marginTop: 12, lineHeight: 1.5 }}` produce?", a: "`margin-top: 12px; line-height: 1.5`. `lineHeight` is unitless." },
      { level: "I", q: "Pass a dynamic value to CSS via a custom property.", a: "Set the variable inline and use it in a class.", code: `<div className="bar" style={{ '--pct': \`\${pct}%\` }} />\n/* .bar { width: var(--pct); } */` },
      { level: "C", q: "Why might `const s = { color: 'red' }` outside the component be better than writing the object inline?", a: "A constant object is created once instead of every render. It matters only when passed to memoised children; for plain DOM elements the difference is negligible." }
    ],
    quiz: [
      { q: "Which is valid JSX?", options: ["`style=\"color: red\"`", "`style={{ color: 'red' }}`", "`style={color: 'red'}`"], answer: 1, why: "The outer braces open JSX, the inner braces are the object literal." },
      { q: "`style={{ width: 200 }}` renders as...", options: ["width: 200", "width: 200px", "An error"], answer: 1, why: "React adds `px` to numbers for length properties." },
      { q: "Best use of inline styles?", options: ["The whole design system", "A value computed at runtime, like a bar width", "Hover effects"], answer: 1, why: "Keep static design in classes; inline is for dynamic values." }
    ],
    rev: {
      sec30: "`style` takes a camelCase object: `style={{ backgroundColor: 'red', width: 120 }}`. Numbers get `px` except unitless props. No pseudo-classes, media queries or keyframes. Use it for runtime values, ideally by setting a CSS variable (`'--pct'`) that a class consumes.",
      interview: [
        { level: "basic", q: "Why double curly braces in `style={{}}`?", a: "The outer pair embeds a JS expression in JSX; the inner pair is the object literal." },
        { level: "intermediate", q: "When would you choose inline styles over classes?", a: "For truly dynamic values like a position, width or user-picked colour. Fixed variants should be classes." },
        { level: "advanced", q: "How do you combine dynamic values with hover states or breakpoints?", a: "Set a CSS custom property inline (`style={{ '--accent': color }}`) and reference `var(--accent)` in a class that also has `:hover` and media queries." },
        { level: "tricky", q: "Why doesn't `style={{ zIndex: '10px' }}` work?", a: "`z-index` is unitless; `10px` is invalid CSS so the browser ignores it. Use `zIndex: 10`." }
      ],
      cheat: [
        "`style={{ fontSize: 16 }}` → object, camelCase",
        "Numbers → `px` (except `opacity`, `zIndex`, `flex`, `lineHeight`...)",
        "No `:hover`, `@media`, `@keyframes`",
        "Inline beats class rules (except `!important`)",
        "Dynamic value? Set `'--var'` inline, use it in CSS",
        "Fixed variants → toggle classes instead"
      ]
    },
    related: ["JSX-011", "STYLE-010", "STYLE-013", "STYLE-001"]
  },

  "STYLE-005": {
    tldr: "CSS-in-JS means writing styles in JavaScript files. **Runtime** libraries (styled-components, Emotion) build CSS in the browser while rendering. **Zero-runtime** ones (vanilla-extract, Panda, Linaria) turn it into a static `.css` file at build time.",
    analogy: { icon: "🍕", text: "Runtime is a pizza made to order while you wait at the counter. Zero-runtime is the same recipe baked ahead of time: less flexible, but it's ready the moment you walk in." },
    visual: { type: "compare", title: "When does the CSS get made?", left: { label: "Runtime (in the browser)", tone: "neutral", points: [
      "styled-components, Emotion",
      "Styles generated during render",
      "Any prop can change any style",
      "Extra JS and CPU on every page load",
      "Usually needs Client Components"
    ]}, right: { label: "Zero-runtime (at build)", tone: "good", points: [
      "vanilla-extract, Panda CSS, Linaria, StyleX",
      "Compiled to a static `.css` file",
      "Dynamic values via variants or CSS variables",
      "No style JS shipped to the browser",
      "Works with Server Components"
    ]}},
    points: [
      "Shared upside: styles live next to the component, are **scoped** and can be typed with TypeScript.",
      "Runtime cost: the library parses styles and injects `<style>` tags while React renders.",
      "React 19 / Server Components favour static CSS; runtime CSS-in-JS mostly needs Client Components (`'use client'`, framework-only).",
      "Zero-runtime trade-off: styles can't read arbitrary props at runtime; use **variants** or set a CSS variable.",
      "For new apps, most teams pick Tailwind, CSS Modules or a zero-runtime library."
    ],
    code: { file: "button.css.js", lang: "js", src: `// button.css.js — vanilla-extract runs this at BUILD time
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style({
  padding: '8px 16px',
  borderRadius: 6,
  color: 'white',
  ':hover': { opacity: 0.9 },
});

export const tone = styleVariants({
  primary: { background: '#2563eb' },
  danger: { background: '#dc2626' },
});

// CheckoutButton.jsx
import { base, tone } from './button.css.js';

export function CheckoutButton({ danger, children }) {
  const variant = danger ? 'danger' : 'primary';
  return (
    <button className={\`\${base} \${tone[variant]}\`}>
      {children}
    </button>
  );
}

// vite.config.js: plugins: [react(), vanillaExtractPlugin()]`, walk: [
      { lines: [1, 2], note: "A `.css.js` file is evaluated by the build plugin, not shipped as JS." },
      { lines: [4, 5, 6, 7, 8, 9], note: "`style()` returns a generated class name; the CSS goes into a static file." },
      { lines: [11, 12, 13, 14], note: "Variants are pre-built classes: the zero-runtime way to handle \"props\"." },
      { lines: [20, 22], note: "At runtime the component only picks class names. No CSS generated in the browser." },
      { lines: [28], note: "Needs `@vanilla-extract/vite-plugin` in the Vite config." }
    ]},
    output: "A blue Checkout button (red when `danger`). DevTools shows normal classes from a static CSS file.",
    mistakes: [
      { bad: `// vanilla-extract\nexport const price = style({ color: props.color });`, good: `// set a CSS variable at runtime instead\n<span className={price} style={assignInlineVars({ [colorVar]: c })} />`, why: "Zero-runtime styles are fixed at build time; there are no props there. Use variants or CSS variables (`createVar` + `assignInlineVars`)." },
      { bad: `// app/page.jsx (Next.js Server Component)\nimport styled from '@emotion/styled';\nconst Box = styled.div\`padding: 8px\`;`, good: `'use client';\nimport styled from '@emotion/styled';\nconst Box = styled.div\`padding: 8px\`;`, why: "Emotion needs client React (context). In a Server Component it fails; mark the file `'use client'` or switch to static CSS." }
    ],
    practice: [
      { level: "B", q: "Name two runtime and two zero-runtime CSS-in-JS libraries.", a: "Runtime: styled-components, Emotion. Zero-runtime: vanilla-extract, Panda CSS (also Linaria, StyleX)." },
      { level: "I", q: "A cart badge's colour depends on the item count (any value). How do you do it zero-runtime?", a: "Define a CSS variable in the style and set it inline per render, e.g. `style={{ '--badge': color }}`." },
      { level: "I", q: "Why does runtime CSS-in-JS slow down rendering?", a: "Each render it serialises style objects/strings, hashes them and may insert new `<style>` rules, all on the main thread." },
      { level: "C", q: "You inherit a large Emotion app and want to adopt Server Components. What's your plan?", a: "Keep Emotion in Client Components for now; write new UI with CSS Modules/Tailwind or a zero-runtime library; migrate leaf components gradually." }
    ],
    quiz: [
      { q: "When does a zero-runtime CSS-in-JS library produce CSS?", options: ["During each render", "At build time", "When the user hovers"], answer: 1, why: "It extracts styles into static CSS files during the build." },
      { q: "Which is a downside of runtime CSS-in-JS?", options: ["Class names can clash", "Extra JS work in the browser and poor Server Component support", "Cannot use props"], answer: 1, why: "Scoping and props are its strengths; runtime cost is its weakness." },
      { q: "How does a zero-runtime library usually handle a prop-driven style?", options: ["It can't at all", "Pre-built variants or CSS variables", "It falls back to runtime"], answer: 1, why: "Variants cover known cases; CSS variables cover any value." }
    ],
    rev: {
      sec30: "CSS-in-JS = styles authored in JS, scoped to components. Runtime (styled-components, Emotion) generates CSS in the browser during render: flexible, but costs JS/CPU and mostly needs Client Components. Zero-runtime (vanilla-extract, Panda, Linaria, StyleX) extracts static CSS at build: fast and Server Component friendly; dynamic values via variants or CSS variables.",
      interview: [
        { level: "basic", q: "What is CSS-in-JS?", a: "Writing component styles in JavaScript, usually scoped automatically and able to use JS values or props." },
        { level: "intermediate", q: "Runtime vs zero-runtime: what's the difference?", a: "Runtime generates and injects CSS in the browser during render. Zero-runtime compiles the same authoring style into static CSS at build time, so no styling JS ships." },
        { level: "advanced", q: "Why do Server Components and runtime CSS-in-JS clash?", a: "Runtime libraries rely on React context and client-side style injection. Server Components can't use context or run in the browser, so those styles usually need Client Components (styled-components 6.3+ is a partial exception)." },
        { level: "tricky", q: "Is zero-runtime CSS-in-JS completely free of JS?", a: "Almost: the CSS is static, but the component still ships a few lines that pick class names or set CSS variables." }
      ],
      cheat: [
        "Runtime: styled-components, Emotion → CSS made in the browser",
        "Zero-runtime: vanilla-extract, Panda, Linaria, StyleX → static CSS",
        "Runtime = JS cost + mostly Client Components",
        "Zero-runtime props → variants or CSS variables",
        "Both: scoped, colocated, typeable styles",
        "New apps: Tailwind, CSS Modules or zero-runtime"
      ]
    },
    related: ["STYLE-006", "STYLE-007", "STYLE-001", "ADV-016"]
  },

  "STYLE-006": {
    tldr: "styled-components lets you create React components with CSS attached: `styled.button` followed by a CSS template. It's common in older codebases, but it has been in **maintenance mode since 2025**, so learn to read it rather than adopt it for new apps.",
    analogy: { icon: "🎁", text: "A gift that comes pre-wrapped. You don't get a plain box plus paper (element plus class); you get a `<Button>` with its wrapping already on." },
    visual: { type: "flow", title: "What `styled.button` does", steps: [
      { label: "Tagged template", detail: "`styled.button` + a backtick template stores your CSS plus any `${fn}` slots." },
      { label: "Render <Button>", detail: "You use it like any component and pass props like `$variant`." },
      { label: "Run interpolations", detail: "Each `${props => ...}` function runs with the props to fill in values." },
      { label: "Hash & inject", detail: "The final CSS gets a unique class and is injected into a `<style>` tag." },
      { label: "Real <button>", detail: "A normal `<button class=\"sc-x1 abc\">` lands in the DOM." }
    ]},
    points: [
      "`styled.tag` + a CSS template returns a component; nesting `&:hover`, `&:disabled` works like Sass.",
      "Read props in `${props => ...}` slots. Prefix style-only props with `$` (**transient props**) so they don't reach the DOM.",
      "`styled(OtherComponent)` extends a component, which must pass `className` to its root.",
      "`<ThemeProvider theme={...}>` + `${p => p.theme.colors.brand}` shares a theme via context.",
      "**Maintenance mode** (March 2025): fixes only, no big new features. Still runtime CSS-in-JS."
    ],
    code: { file: "CartButton.jsx", lang: "jsx", src: `import styled from 'styled-components';

const Button = styled.button\`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  color: white;
  background: \${p => (p.$variant === 'danger' ? '#dc2626' : '#2563eb')};

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
\`;

const BigButton = styled(Button)\`
  padding: 14px 28px;
  font-size: 1.1rem;
\`;

export default function CartActions({ empty }) {
  return (
    <div>
      <BigButton disabled={empty}>Checkout</BigButton>
      <Button $variant="danger">Empty cart</Button>
    </div>
  );
}`, walk: [
      { lines: [3], note: "`styled.button` + backticks creates a `<Button>` component with these styles." },
      { lines: [8], note: "Interpolation reads the transient prop `$variant` to pick a colour." },
      { lines: [10, 11], note: "`&` = this element. Pseudo-classes nest right inside." },
      { lines: [14, 15, 16, 17], note: "`styled(Button)` extends it: same styles plus bigger padding." },
      { lines: [22, 23], note: "Use them like normal components. `$variant` never reaches the DOM." }
    ]},
    output: "A large blue Checkout button (faded and disabled when the cart is empty) and a red Empty cart button.",
    mistakes: [
      { bad: `function Cart() {\n  const Button = styled.button\`padding: 8px;\`;\n  return <Button />;\n}`, good: `const Button = styled.button\`padding: 8px;\`;\n\nfunction Cart() {\n  return <Button />;\n}`, why: "Defining a styled component **inside** render creates a new component type every render, so React remounts it and loses state and focus." },
      { bad: `<Button variant="danger">`, good: `<Button $variant="danger">`, why: "Without `$`, the unknown `variant` attribute is forwarded to the DOM and React warns. Transient `$` props stay style-only." }
    ],
    practice: [
      { level: "B", q: "Create a styled `Card` div with padding and a shadow.", a: "Use a tagged template on `styled.div`.", code: `const Card = styled.div\`\n  padding: 16px;\n  box-shadow: 0 1px 4px rgb(0 0 0 / 0.1);\n\`;` },
      { level: "I", q: "Make a `Tag` that is green when `$inStock` and grey otherwise.", a: "`background: ${p => p.$inStock ? '#16a34a' : '#9ca3af'};` and render `<Tag $inStock={stock > 0}>`." },
      { level: "I", q: "Style your own `<Link>` component with `styled(Link)`. What must `Link` do?", a: "Accept a `className` prop and put it on its root element, or the styles never apply." },
      { level: "C", q: "Your team asks whether to adopt styled-components for a new app in 2026. What do you say?", a: "No: it's in maintenance mode and adds runtime cost. Choose Tailwind, CSS Modules or a zero-runtime library; keep styled-components only where it already exists." }
    ],
    quiz: [
      { q: "What does `styled.a` with a CSS template (e.g. `color: red;`) return?", options: ["A CSS string", "A React component rendering a styled `<a>`", "A class name"], answer: 1, why: "styled-components returns components with styles attached." },
      { q: "Why prefix a style prop with `$` (e.g. `$size`)?", options: ["It makes it reactive", "It stops the prop being passed to the DOM", "It's required for all props"], answer: 1, why: "Transient props are consumed by styles only." },
      { q: "What's the 2025 status of styled-components?", options: ["Actively adding features", "Maintenance mode: fixes only", "Built into React"], answer: 1, why: "Its maintainer announced maintenance mode in 2025; prefer other options for new projects." }
    ],
    rev: {
      sec30: "styled-components creates styled React components with tagged templates on `styled.button`. Props flow into `${p => ...}` interpolations; `$` transient props stay off the DOM; `styled(Comp)` extends; `ThemeProvider` shares a theme. It's runtime CSS-in-JS in maintenance mode since March 2025: read and maintain it, don't start new apps with it.",
      interview: [
        { level: "basic", q: "How do you create a styled component?", a: "Call `styled.h1` with a backtick template of CSS, assign it to `Title`, then render `<Title>`." },
        { level: "intermediate", q: "What are transient props?", a: "Props prefixed with `$` that styled-components uses for styling but doesn't forward to the underlying DOM element." },
        { level: "intermediate", q: "How do you theme with styled-components?", a: "Wrap the app in `<ThemeProvider theme={theme}>` and read `${p => p.theme.colors.brand}` in any styled component." },
        { level: "advanced", q: "Why shouldn't you define a styled component inside another component?", a: "A new component type is created every render, so React unmounts and remounts it, losing state and focus, and styles are regenerated." },
        { level: "tricky", q: "Would you choose styled-components for a new Next.js App Router project?", a: "No. It's in maintenance mode and adds runtime cost; Server Component support only arrived in v6.3. Tailwind or CSS Modules fit better." }
      ],
      cheat: [
        "`styled.button` + CSS template → a component",
        "`${p => p.$variant}` reads props; `$` = transient",
        "`styled(Comp)` needs `Comp` to accept `className`",
        "`&:hover` nesting like Sass",
        "`ThemeProvider` + `p.theme`",
        "Define at module level, never inside render",
        "Maintenance mode since March 2025; runtime cost"
      ]
    },
    related: ["STYLE-005", "STYLE-007", "STYLE-013", "COMP-001"]
  },

  "STYLE-007": {
    tldr: "Emotion is a runtime CSS-in-JS library with two styles of API: the **`css` prop** to style any element inline-like (but with full CSS), and **`styled`** to make styled components like styled-components.",
    analogy: { icon: "🏷️", text: "Sticky notes vs pre-printed labels. The `css` prop is a sticky note you slap on one jar; `styled` is a printed label for a whole product line." },
    visual: { type: "compare", title: "Two Emotion APIs", left: { label: "css prop", tone: "neutral", points: [
      "`<div css={card}>` on any element",
      "Objects or `css` tagged templates",
      "Needs the Emotion JSX runtime",
      "Great for one-off styles"
    ]}, right: { label: "styled", tone: "neutral", points: [
      "`styled.div` + template returns a component",
      "Props drive values: `p => p.sale`",
      "From `@emotion/styled`",
      "Great for reusable pieces"
    ]}},
    points: [
      "Install: `npm i @emotion/react @emotion/styled`.",
      "The `css` prop needs Emotion's JSX: add `/** @jsxImportSource @emotion/react */` at the top, or `react({ jsxImportSource: '@emotion/react' })` in `vite.config.js`.",
      "Unlike `style`, `css` supports `&:hover`, media queries and nesting, and becomes a real class.",
      "Pass an **array** to merge: `css={[base, active && activeStyle]}`; later entries win.",
      "Runtime library that relies on context: Client Components only. MUI uses it by default."
    ],
    code: { file: "RecipeCard.jsx", lang: "jsx", src: `/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const card = css\`
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.1);
  &:hover { box-shadow: 0 4px 12px rgb(0 0 0 / 0.15); }
\`;

const favourite = css({ outline: '2px solid gold' });

const Time = styled.span(({ quick }) => ({
  fontSize: 14,
  color: quick ? '#16a34a' : '#6b7280',
}));

export default function RecipeCard({ title, minutes, fav }) {
  return (
    <article css={[card, fav && favourite]}>
      <h3>{title}</h3>
      <Time quick={minutes <= 15}>⏱ {minutes} min</Time>
    </article>
  );
}`, walk: [
      { lines: [1], note: "Pragma: use Emotion's JSX so the `css` prop works (or set it once in Vite config)." },
      { lines: [5, 6, 7, 8, 9, 10, 11], note: "The `css` tag holds full CSS, including `&:hover`." },
      { lines: [13], note: "Object syntax works too: camelCase keys, like `style`." },
      { lines: [15, 16, 17, 18], note: "`styled.span` with a function of props returns an object of styles." },
      { lines: [22], note: "Array merges styles; `fav && favourite` adds a gold outline only for favourites." },
      { lines: [24], note: "`quick` drives the colour. Emotion doesn't forward it to the DOM since it's not a valid HTML attribute." }
    ]},
    output: "A white recipe card with a shadow that deepens on hover. Recipes of 15 minutes or less show a green time; favourites get a gold outline.",
    mistakes: [
      { bad: `import { css } from '@emotion/react';\n<div css={card}>  // no pragma or config`, good: `/** @jsxImportSource @emotion/react */\nimport { css } from '@emotion/react';\n<div css={card}>`, why: "Without Emotion's JSX runtime, React's JSX passes `css` as an unknown attribute and nothing is styled." },
      { bad: `<div css={{ ...base, ...active }}>  // with css\`\` objects`, good: `<div css={[base, active]}>`, why: "Results of the `css` tag are serialised objects, not plain style maps. Merge them with an array." }
    ],
    practice: [
      { level: "B", q: "Configure Vite so you don't need the pragma in every file.", a: "In `vite.config.js`: `plugins: [react({ jsxImportSource: '@emotion/react' })]`." },
      { level: "B", q: "Style a chat bubble with the `css` prop using object syntax.", a: "`<p css={{ padding: 8, borderRadius: 12, background: '#e0f2fe' }}>`" },
      { level: "I", q: "Make a `Badge` with `styled` whose background depends on a `tone` prop.", a: "`styled.span(({ tone }) => ({ background: tone === 'sale' ? '#dc2626' : '#2563eb' }))`" },
      { level: "C", q: "Add a mobile breakpoint inside a `css` block.", a: "Media queries nest directly.", code: `const grid = css\`\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  @media (max-width: 600px) { grid-template-columns: 1fr; }\n\`;` }
    ],
    quiz: [
      { q: "What must be set up for the `css` prop to work?", options: ["Nothing", "Emotion's JSX import source (pragma or Vite config)", "A ThemeProvider"], answer: 1, why: "The `css` prop is handled by Emotion's JSX runtime, not React's." },
      { q: "How do you combine two Emotion styles on one element?", options: ["`css={[a, b]}`", "`className={a + b}`", "`style={[a, b]}`"], answer: 0, why: "Arrays merge in order; later styles override earlier ones." },
      { q: "Compared with the `style` prop, the `css` prop can...", options: ["Only set colours", "Use pseudo-classes and media queries", "Avoid any runtime cost"], answer: 1, why: "It generates a real class, so all CSS features work. It still has runtime cost." }
    ],
    rev: {
      sec30: "Emotion is runtime CSS-in-JS with a `css` prop (needs `jsxImportSource: '@emotion/react'`) and a `styled` API from `@emotion/styled`. Styles can be templates or objects, support nesting and media queries, and merge with arrays. Runtime cost, Client Components only; it's the default engine under MUI.",
      interview: [
        { level: "basic", q: "What are Emotion's two main APIs?", a: "The `css` prop for styling elements directly, and `styled` for creating styled components." },
        { level: "intermediate", q: "Why does the `css` prop need a pragma or config?", a: "React's JSX doesn't know `css`. Emotion's JSX runtime converts it into a generated `className` before rendering." },
        { level: "intermediate", q: "`css` prop vs `style` prop?", a: "`style` sets inline properties only. `css` creates a real class, so hover, media queries and nesting work." },
        { level: "advanced", q: "Where will you meet Emotion even if you never install it directly?", a: "In MUI, which uses Emotion as its default styling engine for `sx` and `styled`." },
        { level: "tricky", q: "Does Emotion forward every prop on `styled.div` to the DOM?", a: "No. For HTML tags it filters with `@emotion/is-prop-valid`, so only valid attributes are forwarded; you can override with `shouldForwardProp`." }
      ],
      cheat: [
        "`npm i @emotion/react @emotion/styled`",
        "`/** @jsxImportSource @emotion/react */` or Vite `jsxImportSource`",
        "`css` prop takes a `css` tagged template or an object",
        "Merge: `css={[base, cond && extra]}`",
        "`styled.div(props => ({ ... }))`",
        "Runtime CSS-in-JS; powers MUI"
      ]
    },
    related: ["STYLE-005", "STYLE-006", "STYLE-015", "JSX-004"]
  },

  "STYLE-008": {
    tldr: "Tailwind CSS gives you thousands of tiny single-purpose classes (`p-4`, `bg-blue-600`, `md:flex`). You style by combining them in `className`. Tailwind v4 sets up with one Vite plugin and one CSS line, and ships only the classes you use.",
    analogy: { icon: "🧂", text: "A spice rack instead of ready-made sauces. Each jar does one thing (salt, pepper, chili); you mix exactly the flavour you want right in the pan." },
    visual: { type: "flow", title: "Tailwind v4 in a Vite app", steps: [
      { label: "Install", detail: "`npm i tailwindcss @tailwindcss/vite`" },
      { label: "Add Vite plugin", detail: "`plugins: [react(), tailwindcss()]` in `vite.config.js`." },
      { label: "Import in CSS", detail: "`@import \"tailwindcss\";` at the top of `index.css`. No config file needed." },
      { label: "Write classes", detail: "`className=\"rounded-lg p-4 shadow hover:shadow-lg\"`" },
      { label: "Build scans", detail: "Tailwind finds class names in your files and outputs only those rules." }
    ]},
    points: [
      "Pattern: `property-value`. `p-4` = padding 1rem, `text-sm`, `bg-red-500`, `gap-2`.",
      "**Variants** prefix a class: `hover:`, `focus:`, `disabled:`, `md:` (breakpoint), `dark:`.",
      "v4 is **CSS-first**: customise in CSS with `@theme { --color-brand: #2563eb; }` → `bg-brand`.",
      "Write **full class names**. Building `bg-${color}-500` from a variable won't be detected; map to complete strings.",
      "Long class lists? Extract a component (`<Button>`), not a CSS class. Use `clsx` + `tailwind-merge` for conditions."
    ],
    code: { file: "RecipeCard.jsx", lang: "jsx", src: `export default function RecipeCard({ title, minutes, vegan }) {
  return (
    <article className="max-w-sm rounded-xl bg-white p-4 shadow
                        transition hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">⏱ {minutes} min</p>
      {vegan && (
        <span className="mt-2 inline-block rounded-full bg-green-100
                         px-2 py-0.5 text-xs text-green-700">
          Vegan
        </span>
      )}
      <button className="mt-4 w-full rounded-lg bg-brand py-2 text-white
                         hover:bg-brand/90 disabled:opacity-50 md:w-auto md:px-6">
        Save recipe
      </button>
    </article>
  );
}

/* index.css
@import "tailwindcss";
@theme { --color-brand: #2563eb; }
*/`, walk: [
      { lines: [3, 4], note: "Card look: width, rounded corners, white, padding, shadow that grows on `hover:`." },
      { lines: [5, 8], note: "Typography utilities: size, weight, colour, margin-top." },
      { lines: [10, 11], note: "A pill badge built from small utilities, shown only for vegan recipes." },
      { lines: [15, 16], note: "`bg-brand` comes from your `@theme`; `/90` = 90% opacity; `md:` = from 768px up." },
      { lines: [24, 25], note: "The whole v4 CSS setup: import Tailwind, add your own design tokens." }
    ]},
    output: "A white rounded recipe card with title, cook time, a green “Vegan” pill and a full-width blue Save button that shrinks to auto width on screens 768px and wider.",
    mistakes: [
      { bad: `<p className={\`text-\${color}-600\`}>`, good: `const tone = { red: 'text-red-600', green: 'text-green-600' };\n<p className={tone[color]}>`, why: "Tailwind finds classes by scanning source text. Built-up names never appear in full, so their CSS isn't generated." },
      { bad: `// v3 habit\nnpx tailwindcss init -p\n@tailwind base; @tailwind components; @tailwind utilities;`, good: `npm i tailwindcss @tailwindcss/vite\n@import "tailwindcss";`, why: "Tailwind v4 needs no `tailwind.config.js` or PostCSS setup in Vite; one plugin and one `@import` line." }
    ],
    practice: [
      { level: "B", q: "Center a weather icon horizontally and vertically in a box.", a: "`className=\"flex items-center justify-center h-32\"`" },
      { level: "B", q: "Make a todo list 1 column on phones and 3 from `lg`.", a: "`className=\"grid grid-cols-1 gap-4 lg:grid-cols-3\"`" },
      { level: "I", q: "Add a custom brand font and colour in v4.", a: "Use `@theme` in your CSS.", code: `@import "tailwindcss";\n@theme {\n  --font-display: "Poppins", sans-serif;\n  --color-brand: #8b5cf6;\n}\n/* use: font-display bg-brand */` },
      { level: "C", q: "A `Button` accepts `className` from callers, but `px-2` from a caller doesn't beat your `px-4`. Fix it.", a: "Merge with `tailwind-merge`, which removes conflicting utilities so the last wins: `twMerge('px-4 py-2', className)`." }
    ],
    quiz: [
      { q: "What does `md:flex` mean?", options: ["Always flex", "Flex from the `md` breakpoint (768px) and up", "Flex only below 768px"], answer: 1, why: "Tailwind is mobile-first: breakpoint prefixes apply at that width and above." },
      { q: "In Tailwind v4 with Vite, where do you add custom colours?", options: ["`tailwind.config.js` only", "`@theme` in your CSS", "`package.json`"], answer: 1, why: "v4 is CSS-first; `@theme` variables create matching utilities." },
      { q: "A class built at runtime as `bg-${c}-500` shows no colour. Why?", options: ["Tailwind doesn't support template literals at all", "The full class name never appears in source, so no CSS is generated", "React strips it"], answer: 1, why: "Write complete class names and map values to them." }
    ],
    rev: {
      sec30: "Tailwind = utility classes composed in `className`. v4 setup in Vite: install `tailwindcss` + `@tailwindcss/vite`, add the plugin, `@import \"tailwindcss\"`. Customise with `@theme` CSS variables. Variants: `hover:`, `md:`, `dark:`. Classes are found by scanning source, so always write full names. Zero runtime, static CSS.",
      interview: [
        { level: "basic", q: "What is utility-first CSS?", a: "Styling with many small single-purpose classes directly in markup instead of writing custom class names and CSS rules." },
        { level: "intermediate", q: "What changed in Tailwind v4 setup?", a: "It's CSS-first: a Vite plugin plus `@import \"tailwindcss\"`, automatic content detection, and theme tokens in `@theme` instead of a JS config file." },
        { level: "intermediate", q: "Why can't you build class names dynamically?", a: "Tailwind generates CSS only for class strings it finds in source files. A built-up `bg-${c}-500` never appears in full." },
        { level: "advanced", q: "How do you avoid unreadable, repeated class lists?", a: "Extract React components for repeated UI, use `clsx` for conditions and `tailwind-merge` (a `cn()` helper) to resolve conflicts. Avoid heavy `@apply`." },
        { level: "tricky", q: "Does Tailwind bloat the CSS bundle?", a: "No, it's usually smaller than hand-written CSS: only used utilities are generated and they're reused across the whole app." }
      ],
      cheat: [
        "`npm i tailwindcss @tailwindcss/vite`",
        "Vite: `plugins: [react(), tailwindcss()]`",
        "CSS: `@import \"tailwindcss\";`",
        "Tokens: `@theme { --color-brand: ... }` → `bg-brand`",
        "Variants: `hover:` `focus:` `md:` `dark:` `disabled:`",
        "Mobile-first: `md:` = 768px and up",
        "Full class names only; no string building"
      ]
    },
    related: ["STYLE-011", "STYLE-012", "STYLE-015", "STYLE-001"]
  },

  "STYLE-009": {
    tldr: "Bootstrap is a classic CSS framework of ready-made classes (`btn btn-primary`, `row`, `col-md-4`). In React, use its CSS plus **React-Bootstrap** components (`<Button>`, `<Modal>`) instead of Bootstrap's own jQuery-style JavaScript.",
    analogy: { icon: "🏪", text: "A furnished rental flat. Sofa, table and lamps are already there and match; you move in fast, but every flat in the building looks a bit alike." },
    visual: { type: "compare", title: "Two ways to use Bootstrap in React", left: { label: "Bootstrap CSS classes", tone: "neutral", points: [
      "`npm i bootstrap`, import the CSS",
      "`<button className=\"btn btn-primary\">`",
      "Fine for layout, buttons, cards",
      "Interactive parts (modal, dropdown) need JS"
    ]}, right: { label: "React-Bootstrap", tone: "good", points: [
      "`npm i react-bootstrap bootstrap`",
      "`<Button variant=\"primary\">`, `<Modal show>`",
      "Modals and dropdowns driven by React state",
      "No jQuery, no direct DOM fiddling"
    ]}},
    points: [
      "Import the CSS once: `import 'bootstrap/dist/css/bootstrap.min.css'` in `main.jsx`.",
      "Grid: `<Container>` → `<Row>` → `<Col md={4}>` (12 columns, mobile-first breakpoints).",
      "Avoid Bootstrap's `bootstrap.bundle.js` in React: it edits the DOM behind React's back. Use React-Bootstrap.",
      "Customise with Sass variables or CSS variables (`--bs-primary`); dark mode via `data-bs-theme=\"dark\"`.",
      "Common in older or admin apps. New projects usually pick Tailwind or a headless library."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';

const products = [
  { id: 1, name: 'Coffee mug', price: 12 },
  { id: 2, name: 'Tea pot', price: 30 },
  { id: 3, name: 'Water bottle', price: 18 },
];

export default function Shop() {
  const [picked, setPicked] = useState(null);

  return (
    <Container className="py-4">
      <Row xs={1} md={3} className="g-3">
        {products.map(p => (
          <Col key={p.id}>
            <Card>
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>\${p.price}</Card.Text>
                <Button onClick={() => setPicked(p)}>Quick view</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={picked !== null} onHide={() => setPicked(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{picked?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Only \${picked?.price}. Free shipping!</Modal.Body>
      </Modal>
    </Container>
  );
}`, walk: [
      { lines: [1], note: "Bootstrap's CSS powers everything; React-Bootstrap only provides components." },
      { lines: [3], note: "Import ready-made components instead of writing class strings." },
      { lines: [16], note: "Grid: 1 column on phones, 3 from `md` up; `g-3` = gutter spacing." },
      { lines: [23], note: "`<Button>` renders `btn btn-primary` (primary is the default variant)." },
      { lines: [30], note: "The modal is controlled by React state: `show` opens it, `onHide` closes it." }
    ]},
    output: "Three product cards in a row on desktop (stacked on phones). “Quick view” opens a modal with the product name and price.",
    mistakes: [
      { bad: `import 'bootstrap/dist/js/bootstrap.bundle.min.js';\n<button data-bs-toggle="modal" data-bs-target="#cart">`, good: `import { Modal } from 'react-bootstrap';\n<Modal show={open} onHide={() => setOpen(false)}>`, why: "Bootstrap's JS changes the DOM directly, fighting React's rendering. Drive modals from state with React-Bootstrap." },
      { bad: `<div class="row">`, good: `<div className="row">`, why: "Copy-pasted Bootstrap HTML uses `class`; JSX needs `className`." }
    ],
    practice: [
      { level: "B", q: "Show a green “Order placed” alert with React-Bootstrap.", a: "`<Alert variant=\"success\">Order placed</Alert>` after `import { Alert } from 'react-bootstrap'`." },
      { level: "B", q: "Make a notes grid: 1 column on phones, 2 on tablets, 4 on desktops.", a: "`<Row xs={1} md={2} lg={4}>` with a `<Col>` per note." },
      { level: "I", q: "Turn on Bootstrap's dark mode for the whole app.", a: "Set `data-bs-theme=\"dark\"` on `<html>` (e.g. `document.documentElement.dataset.bsTheme = 'dark'`)." },
      { level: "C", q: "Change Bootstrap's primary colour to purple without editing its files.", a: "Override CSS variables after the import (`:root { --bs-primary: #7c3aed; --bs-primary-rgb: 124,58,237; }`) or recompile with Sass `$primary`. Some component colours are compiled in, so Sass is the complete fix." }
    ],
    quiz: [
      { q: "Why prefer React-Bootstrap over Bootstrap's own JS in React?", options: ["It's smaller CSS", "It drives interactive widgets with React state instead of direct DOM changes", "Bootstrap JS doesn't exist anymore"], answer: 1, why: "Two systems editing the same DOM leads to bugs; React-Bootstrap keeps React in control." },
      { q: "How many columns does Bootstrap's grid use?", options: ["10", "12", "16"], answer: 1, why: "Bootstrap is a 12-column grid: `col-md-4` = one third." },
      { q: "Does React-Bootstrap include the CSS automatically?", options: ["Yes", "No, import Bootstrap's CSS yourself"], answer: 1, why: "React-Bootstrap ships components only; you import `bootstrap/dist/css/bootstrap.min.css`." }
    ],
    rev: {
      sec30: "Bootstrap = ready-made CSS classes and a 12-column grid. In React, import its CSS once and use React-Bootstrap components (`<Button>`, `<Row>`, `<Modal show>`), which replace Bootstrap's DOM-manipulating JS with state-driven components. Theme via Sass or `--bs-*` variables; dark mode via `data-bs-theme`. Common in existing/admin apps.",
      interview: [
        { level: "basic", q: "How do you add Bootstrap to a React app?", a: "`npm i bootstrap react-bootstrap`, import `bootstrap/dist/css/bootstrap.min.css` once, then use React-Bootstrap components or Bootstrap classes." },
        { level: "intermediate", q: "Why not use Bootstrap's JavaScript plugins with React?", a: "They manipulate the DOM directly; React may re-render and undo or conflict with those changes. React-Bootstrap reimplements them as React components." },
        { level: "advanced", q: "Bootstrap vs Tailwind for a new product?", a: "Bootstrap gives finished components fast but a recognisable look and heavier overrides. Tailwind gives building blocks for a custom design with no unused CSS. Most new custom UIs pick Tailwind." },
        { level: "tricky", q: "Your `<Button variant=\"primary\">` looks unstyled. Why?", a: "Bootstrap's CSS wasn't imported. React-Bootstrap only outputs class names; the styles come from Bootstrap's stylesheet." }
      ],
      cheat: [
        "`npm i bootstrap react-bootstrap`",
        "`import 'bootstrap/dist/css/bootstrap.min.css'` once",
        "Grid: `Container` → `Row` → `Col md={4}` (12 cols)",
        "Use React-Bootstrap, not `bootstrap.bundle.js`",
        "`variant=\"primary\"` → `btn-primary`",
        "Dark: `data-bs-theme=\"dark\"`; theme: Sass or `--bs-*`"
      ]
    },
    related: ["STYLE-008", "STYLE-015", "STYLE-002", "INTRO-003"]
  },

  "STYLE-010": {
    tldr: "Store a fact in state (done, active, open), then let the render pick the class from it: `className={done ? 'item done' : 'item'}`. You never add or remove classes by hand; React updates them when state changes.",
    analogy: { icon: "💡", text: "A light switch. You flip the switch (state); the lamp (class) follows by itself. You never unscrew the bulb directly." },
    visual: { type: "timeline", title: "A todo item's class follows its state", frames: [
      { label: "Render", state: "done = false → class=\"todo\"", note: "Plain item, normal text." },
      { label: "Click", state: "setDone(true)", note: "The handler only changes state." },
      { label: "Re-render", state: "done = true → class=\"todo done\"", note: "React updates the class on the same `<button>`." },
      { label: "Click again", state: "done = false → class=\"todo\"", note: "Strike-through disappears. No DOM code written." }
    ]},
    points: [
      "Ternary for either/or: `className={open ? 'menu open' : 'menu'}`.",
      "Base + optional: a template string like `todo ${done ? 'done' : ''}`; mind the space.",
      "Use `&&` only inside a list/`clsx`; `className={done && 'done'}` gives `false` when not done.",
      "Alternatives: `data-state={status}` or `aria-pressed={on}` and style with `[data-state=\"done\"]` in CSS.",
      "Many conditions? Switch to `clsx` (next lesson). Avoid `classList.add` in React."
    ],
    code: { file: "TodoItem.jsx", lang: "jsx", src: `import { useState } from 'react';
import './todo.css';

export default function TodoItem({ text, urgent }) {
  const [done, setDone] = useState(false);

  return (
    <button
      className={\`todo \${done ? 'done' : ''} \${urgent ? 'urgent' : ''}\`}
      onClick={() => setDone(d => !d)}
      aria-pressed={done}
      type="button"
    >
      {done ? '✅' : '⬜'} {text}
    </button>
  );
}

/* todo.css
.todo   { cursor: pointer; padding: 6px; }
.done   { text-decoration: line-through; opacity: 0.6; }
.urgent { border-left: 4px solid crimson; }
*/`, walk: [
      { lines: [5], note: "The single source of truth: is this todo done?" },
      { lines: [9], note: "Always `todo`; add `done` from state and `urgent` from a prop." },
      { lines: [10], note: "The click only flips state. React re-renders and the class follows." },
      { lines: [11, 12], note: "A real `<button>` is keyboard-friendly; `aria-pressed` announces the same state to screen readers." },
      { lines: [21, 22], note: "CSS decides what `done` and `urgent` look like." }
    ]},
    output: "A todo row. Clicking it toggles a ✅, strike-through and fade. Urgent todos have a red left border.",
    mistakes: [
      { bad: `<li className={done && 'done'}>`, good: `<li className={done ? 'done' : undefined}>`, why: "When `done` is false the value is `false`; React warns about a non-boolean attribute. Use a ternary or `clsx`." },
      { bad: `className={'todo' + (done ? 'done' : '')}`, good: `className={'todo' + (done ? ' done' : '')}`, why: "Without a space you get `tododone`, a class that matches nothing." },
      { bad: `e.currentTarget.classList.add('done');`, good: `setDone(true); // class comes from render`, why: "Manual DOM edits are lost on the next render and get out of sync with state." }
    ],
    practice: [
      { level: "B", q: "Highlight the active tab in a playlist's tab bar.", a: "`className={tab === current ? 'tab active' : 'tab'}`" },
      { level: "B", q: "Show a cart badge in red only when items > 9.", a: "Template string: `badge ${count > 9 ? 'badge-hot' : ''}`, or `clsx('badge', count > 9 && 'badge-hot')`." },
      { level: "I", q: "Style a weather card by condition (sunny/rainy/snowy) without many ternaries.", a: "Use the value as a data attribute and target it in CSS.", code: `<div className="weather" data-sky={sky}>\n/* .weather[data-sky="rainy"] { background: #cbd5e1; } */` },
      { level: "C", q: "A like button should look pressed and announce it to screen readers. One attribute for both?", a: "`aria-pressed={liked}` on a `<button>`, styled with `button[aria-pressed=\"true\"] { ... }`." }
    ],
    quiz: [
      { q: "How should a class change when a todo is completed?", options: ["Call `classList.add` in the handler", "Change state; compute `className` in render", "Reload the component"], answer: 1, why: "Render is a function of state; classes follow automatically." },
      { q: "`className={'card' + (sel ? 'selected' : '')}` with `sel = true` gives...", options: ["`card selected`", "`cardselected`", "`card`"], answer: 1, why: "String concatenation adds no space." },
      { q: "Best for many mutually exclusive variants (sunny/rainy/snowy)?", options: ["Nested ternaries", "A `data-*` attribute or a lookup map", "Inline styles"], answer: 1, why: "One value maps cleanly to one CSS rule or class name." }
    ],
    rev: {
      sec30: "Conditional styling = derive `className` (or `data-*`/`aria-*` attributes) from state and props during render. Use ternaries for either/or, template strings for base + optional (mind spaces), and `clsx` when it grows. Never mutate `classList` in React; avoid `className={cond && 'x'}`.",
      interview: [
        { level: "basic", q: "How do you toggle a class in React?", a: "Keep a boolean in state and compute the class in JSX: `className={open ? 'menu open' : 'menu'}`." },
        { level: "intermediate", q: "Why not use `element.classList.toggle()`?", a: "React owns the DOM. On the next render it sets `className` from your JSX, overwriting manual changes, and state and UI drift apart." },
        { level: "advanced", q: "When would you use data attributes instead of classes?", a: "For state-like values (`data-state=\"open\"`, `data-sky=\"rainy\"`): one attribute, many values, easy CSS selectors. Headless libraries like Radix expose state this way." },
        { level: "tricky", q: "What does `className={isActive && 'active'}` render when false?", a: "React receives `false` for a string attribute, drops it and warns in dev. Use a ternary returning `undefined` or `clsx`." }
      ],
      cheat: [
        "State changes → render recomputes `className`",
        "`cond ? 'a b' : 'a'` for either/or",
        "Template strings: remember the space",
        "No `classList` edits in React",
        "`data-state` / `aria-pressed` for state styling",
        "Many conditions → `clsx`"
      ]
    },
    related: ["STYLE-011", "STATE-004", "COND-003", "JSX-009"]
  },

  "STYLE-011": {
    tldr: "`clsx` is a tiny helper that builds a `className` string from strings, objects and arrays, dropping anything falsy: `clsx('btn', { active: isOn }, size && 'btn-lg')`. With Tailwind, pair it with `tailwind-merge` in a `cn()` helper.",
    analogy: { icon: "🥗", text: "A salad bar with a smart bowl. You point at every topping you might want; the bowl keeps only the ones you said yes to and drops the rest." },
    visual: { type: "flow", title: "What clsx does with its arguments", steps: [
      { label: "Strings", detail: "`'btn'` is always kept." },
      { label: "Objects", detail: "`{ active: isOn, disabled }` keeps keys whose value is truthy." },
      { label: "Falsy values", detail: "`false`, `null`, `undefined`, `0`, `''` are skipped." },
      { label: "Arrays", detail: "Nested arrays are flattened and filtered the same way." },
      { label: "Result", detail: "One clean space-separated string: `\"btn active\"`." }
    ]},
    points: [
      "Install `npm i clsx`, then `import clsx from 'clsx'` (named `{ clsx }` also works).",
      "Object syntax reads nicely: `{ 'is-done': done, 'is-urgent': urgent }`.",
      "Works with CSS Modules: `clsx(styles.tab, active && styles.active)`.",
      "**Tailwind conflicts**: `clsx('px-4', 'px-2')` keeps both. `twMerge` removes the loser so the last wins.",
      "The common `cn()` helper (shadcn/ui): `cn(...inputs) => twMerge(clsx(inputs))`."
    ],
    code: { file: "PlaylistTab.jsx", lang: "jsx", src: `import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PlaylistTab({ label, active, disabled, className }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'rounded-full px-4 py-1 text-sm',
        {
          'bg-violet-600 text-white': active,
          'bg-gray-100 text-gray-700 hover:bg-gray-200': !active,
          'cursor-not-allowed opacity-50': disabled,
        },
        className
      )}
    >
      {label}
    </button>
  );
}

// <PlaylistTab label="Chill" active className="px-6" />
// → "rounded-full py-1 text-sm bg-violet-600 text-white px-6"`, walk: [
      { lines: [4, 5, 6], note: "`cn` = clsx (handle conditions) + twMerge (resolve Tailwind conflicts)." },
      { lines: [13], note: "Base classes: always applied." },
      { lines: [14, 15, 16, 17, 18], note: "Object form: each key is added only when its value is truthy." },
      { lines: [19], note: "Caller's `className` goes last so it can override, e.g. `px-6`." },
      { lines: [27, 28], note: "`twMerge` dropped `px-4` because `px-6` came later." }
    ]},
    output: "A violet pill tab for the active playlist, grey pills for the rest, faded when disabled. Extra classes from the parent override the defaults.",
    mistakes: [
      { bad: `className={\`btn \${active && 'active'}\`}`, good: `className={clsx('btn', active && 'active')}`, why: "In a template string `false` becomes the text `\"false\"`: you get `btn false`. clsx drops falsy values." },
      { bad: `cn('px-4', className) // using only clsx`, good: `twMerge(clsx('px-4', className))`, why: "With plain clsx, `px-4 px-2` both stay and CSS order, not your intent, decides the winner." }
    ],
    practice: [
      { level: "B", q: "What does `clsx('a', false, 'b', null, { c: true, d: 0 })` return?", a: "`\"a b c\"`" },
      { level: "B", q: "Rewrite with clsx: a note card with `note`, plus `pinned` when pinned and `archived` when archived.", a: "`clsx('note', { pinned, archived })` (shorthand keys use the variable names)." },
      { level: "I", q: "Use clsx with a CSS Module for an active nav link.", a: "`className={clsx(styles.link, isActive && styles.active)}`" },
      { level: "C", q: "Build a `Button` with `variant` (primary/ghost) and `size` (sm/lg) maps using `cn`.", a: "Map each option to classes and combine.", code: `const variants = { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' };\nconst sizes = { sm: 'px-2 py-1 text-sm', lg: 'px-6 py-3' };\nexport function Button({ variant = 'primary', size = 'sm', className, ...props }) {\n  return <button className={cn('rounded', variants[variant], sizes[size], className)} {...props} />;\n}` }
    ],
    quiz: [
      { q: "`clsx('btn', { active: false, big: true })` returns...", options: ["`btn active big`", "`btn big`", "`btn false big`"], answer: 1, why: "Object keys are included only when their value is truthy." },
      { q: "Why add `tailwind-merge` on top of clsx?", options: ["To minify classes", "To remove conflicting Tailwind utilities so the last one wins", "To support CSS Modules"], answer: 1, why: "clsx doesn't understand Tailwind; twMerge knows `px-2` and `px-4` conflict." },
      { q: "Where should a component put the caller's `className` in `cn(...)`?", options: ["First", "Last", "It doesn't matter"], answer: 1, why: "Last lets the caller override defaults when merged with twMerge." }
    ],
    rev: {
      sec30: "`clsx` joins class names from strings, objects (`{ cls: condition }`) and arrays, skipping falsy values. It removes manual string building and stray `false`/spaces. With Tailwind, `cn = (...i) => twMerge(clsx(i))` also resolves conflicting utilities, letting a caller's `className` override defaults.",
      interview: [
        { level: "basic", q: "What problem does clsx solve?", a: "Building `className` strings from conditions without messy concatenation, missing spaces or `false` leaking into the string." },
        { level: "intermediate", q: "What's the `cn()` helper?", a: "A tiny wrapper, `twMerge(clsx(inputs))`, used by shadcn/ui: clsx handles conditions, tailwind-merge removes conflicting Tailwind classes." },
        { level: "advanced", q: "How do you design a reusable component's `className` prop?", a: "Merge it last with your base classes (via `cn`) so callers can tweak spacing or layout without fighting specificity." },
        { level: "tricky", q: "`clsx('p-4', 'p-2')` → which padding applies?", a: "Both classes are present; whichever rule comes later in Tailwind's generated CSS wins, not the order you wrote. That's why twMerge exists." }
      ],
      cheat: [
        "`npm i clsx` → `clsx('a', cond && 'b', { c: flag })`",
        "Falsy values are dropped",
        "Objects: key added when value truthy",
        "Works with CSS Modules: `clsx(styles.x, on && styles.on)`",
        "`cn = (...i) => twMerge(clsx(i))` for Tailwind",
        "Caller's `className` goes last"
      ]
    },
    related: ["STYLE-010", "STYLE-008", "STYLE-003", "STYLE-015"]
  },

  "STYLE-012": {
    tldr: "Responsive components change layout to fit the space. **Media queries** react to the screen width; **container queries** react to the width of the box the component sits in, so the same card works in a wide page and a narrow sidebar.",
    analogy: { icon: "🍱", text: "A lunchbox that rearranges itself to fit the bag it's put in, not the size of the kitchen. That's a container query." },
    visual: { type: "compare", title: "Media query vs container query", left: { label: "@media (viewport)", tone: "neutral", points: [
      "Asks: how wide is the **screen**?",
      "Great for page layout: nav, columns",
      "Same card looks the same everywhere",
      "Tailwind: `md:flex`"
    ]}, right: { label: "@container (parent box)", tone: "good", points: [
      "Asks: how wide is **my container**?",
      "Great for reusable components",
      "Card adapts in sidebar vs main area",
      "Tailwind v4: `@container` + `@md:flex`"
    ]}},
    points: [
      "Design **mobile-first**: base styles for small, then `min-width` queries add complexity.",
      "Container query: parent gets `container-type: inline-size`; child uses `@container (min-width: 400px)`.",
      "Prefer CSS over JS. Only use `matchMedia` in JS when you must render **different components**.",
      "Fluid layouts need fewer breakpoints: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`.",
      "Container queries are supported in all modern browsers."
    ],
    code: { file: "ProductCard.jsx", lang: "jsx", src: `import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <div className={styles.wrap}>
      <article className={styles.card}>
        <img src={product.image} alt="" className={styles.img} />
        <div>
          <h3>{product.name}</h3>
          <p>\${product.price}</p>
        </div>
      </article>
    </div>
  );
}

/* ProductCard.module.css */
/* .wrap { container-type: inline-size; }

   .card { display: grid; gap: 8px; }
   .img  { width: 100%; aspect-ratio: 4/3; object-fit: cover; }

   @container (min-width: 420px) {
     .card { grid-template-columns: 160px 1fr; }
   }

   @media (min-width: 1024px) {
     .card { padding: 16px; }
   } */`, walk: [
      { lines: [5, 18], note: "The wrapper becomes a **query container**: children can ask how wide it is." },
      { lines: [20, 21], note: "Mobile-first default: image on top, text below." },
      { lines: [23, 24, 25], note: "When the **container** is 420px+, switch to image-left layout, even on a big screen's narrow sidebar." },
      { lines: [27, 28, 29], note: "A classic media query still works for page-wide decisions." }
    ]},
    output: "In a wide product grid each card shows image left, text right. Drop the same card into a 300px sidebar and it stacks image on top. Nothing in the JSX changes.",
    mistakes: [
      { bad: `const isMobile = window.innerWidth < 600;\nreturn isMobile ? <Stacked /> : <Row />;`, good: `/* CSS */\n@media (min-width: 600px) { .card { display: flex; } }`, why: "Reading `innerWidth` in render doesn't update on resize and breaks server rendering. Let CSS handle layout." },
      { bad: `.card { container-type: inline-size; }\n@container (min-width: 400px) { .card { display: flex; } }`, good: `.wrap { container-type: inline-size; }\n@container (min-width: 400px) { .card { display: flex; } }`, why: "An element can't query itself. Put `container-type` on the parent and style the child." }
    ],
    practice: [
      { level: "B", q: "Make a recipe grid that fits as many 220px cards as possible per row with no media queries.", a: "`display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;`" },
      { level: "B", q: "Tailwind: hide a sidebar on phones, show it from `lg`.", a: "`className=\"hidden lg:block\"`" },
      { level: "I", q: "Tailwind v4: make a chat message card switch to a row at its container's `md` size.", a: "Parent `className=\"@container\"`, child `className=\"flex flex-col @md:flex-row\"`." },
      { level: "C", q: "You need to render a bottom sheet on phones but a modal on desktop (different components). How?", a: "Subscribe to `matchMedia('(min-width: 768px)')` with `useSyncExternalStore` (or a `useMediaQuery` hook) so it updates on change, then render the right component." }
    ],
    quiz: [
      { q: "A card should change layout depending on the sidebar it's placed in. Use...", options: ["A media query", "A container query", "`window.innerWidth`"], answer: 1, why: "Container queries respond to the parent's size, not the screen's." },
      { q: "Mobile-first means...", options: ["Base styles for small screens; `min-width` queries add larger layouts", "Use `max-width` queries for everything", "Build the mobile app first"], answer: 0, why: "It's the default in Tailwind and most CSS strategies." },
      { q: "Where does `container-type: inline-size` go?", options: ["On the element being styled", "On its parent/ancestor", "On `<html>` only"], answer: 1, why: "The child queries an ancestor container; it can't query itself." }
    ],
    rev: {
      sec30: "Responsive components adapt to available space. Media queries respond to the viewport (page layout); container queries (`container-type: inline-size` on a parent, `@container (min-width: ...)` on children) respond to the component's own box, ideal for reusable cards. Go mobile-first, prefer CSS and fluid grids, and use `matchMedia` in JS only to swap components.",
      interview: [
        { level: "basic", q: "What is a media query?", a: "A CSS rule that applies when the viewport matches a condition, e.g. `@media (min-width: 768px)`." },
        { level: "intermediate", q: "Why are container queries good for component libraries?", a: "A component doesn't know where it'll be placed. Container queries let it adapt to its actual slot, so one card works in a grid, a sidebar or a modal." },
        { level: "advanced", q: "When is JS-based responsiveness justified?", a: "When you render different trees (bottom sheet vs modal) or load different data. Use `matchMedia` via `useSyncExternalStore`, and pick a server default to avoid hydration mismatches." },
        { level: "tricky", q: "Why does a component using `window.innerWidth` in render break on resize?", a: "Render doesn't re-run on resize; nothing in state changed. You need a subscription to resize/matchMedia that updates state." }
      ],
      cheat: [
        "`@media` = viewport; `@container` = parent box",
        "Parent: `container-type: inline-size`",
        "Child: `@container (min-width: 420px) { ... }`",
        "Mobile-first: base small, `min-width` adds",
        "`repeat(auto-fill, minmax(200px, 1fr))` = fluid grid",
        "Tailwind v4: `@container` + `@md:` variants",
        "JS `matchMedia` only to swap components"
      ]
    },
    related: ["WEB-010", "HOOKS-028", "STYLE-008", "STYLE-016"]
  },

  "STYLE-013": {
    tldr: "Put design values (colours, radius, spacing) in **CSS variables** (theme tokens) and switch them with one attribute like `data-brand=\"berry\"`. Use React **context** only to share *which* theme is active and a way to change it.",
    analogy: { icon: "🎨", text: "A café changing its seasonal menu boards. The layout stays; only the board's colour scheme is swapped, and every table sees the new look at once." },
    visual: { type: "layers", title: "How a theme flows", items: [
      { label: "Components", detail: "`.btn { background: var(--color-primary) }`: they only read tokens." },
      { label: "Theme attribute", detail: "`<div data-brand=\"berry\">` picks which token values apply." },
      { label: "Context", detail: "`ThemeContext` shares `brand` + `setBrand` with a picker anywhere in the tree." },
      { label: "Token definitions", detail: "CSS variables per theme: `[data-brand=\"berry\"] { --color-primary: #be185d }`." }
    ]},
    points: [
      "**Tokens** = named design values: `--color-primary`, `--radius`, `--space-2`. Components never hard-code colours.",
      "Switching a theme changes **one attribute**; the browser repaints via the cascade, no prop drilling.",
      "Context holds the *choice*; CSS holds the *values*. Only context consumers re-render on change.",
      "React 19: render `<ThemeContext value={...}>` directly; `.Provider` still works but is no longer needed.",
      "Wrap `useContext` in a `useTheme()` hook that throws outside the provider."
    ],
    code: { file: "theme.jsx", lang: "jsx", src: `import { createContext, useContext, useState } from 'react';
import './theme.css';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [brand, setBrand] = useState('ocean');
  return (
    <ThemeContext value={{ brand, setBrand }}>
      <div data-brand={brand}>{children}</div>
    </ThemeContext>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export function BrandPicker() {
  const { brand, setBrand } = useTheme();
  return (
    <select value={brand} onChange={e => setBrand(e.target.value)}>
      <option value="ocean">🌊 Ocean</option>
      <option value="berry">🍓 Berry</option>
    </select>
  );
}

/* theme.css
[data-brand="ocean"] { --color-primary: #0284c7; --radius: 8px; }
[data-brand="berry"] { --color-primary: #be185d; --radius: 16px; }
.btn {
  background: var(--color-primary);
  border-radius: var(--radius);
  color: white;
}
*/`, walk: [
      { lines: [4], note: "Context carries the current theme choice, not the colours themselves." },
      { lines: [9, 10], note: "React 19 renders the context as provider. The attribute switches the token set." },
      { lines: [15, 16, 17, 18, 19], note: "A small hook gives a clear error if used outside the provider." },
      { lines: [21, 22, 24], note: "Any component can read and change the theme without prop drilling." },
      { lines: [32, 33, 35], note: "Two token sets; `.btn` just reads `var(--color-primary)` and adapts." }
    ]},
    output: "A shop with a theme picker. Switching to 🍓 Berry turns every `.btn` pink with rounder corners instantly.",
    mistakes: [
      { bad: `<Button color={theme === 'berry' ? '#be185d' : '#0284c7'} />\n// repeated in every component`, good: `.btn { background: var(--color-primary); }`, why: "Hard-coded colours spread theme logic everywhere. Tokens keep it in one place." },
      { bad: `<ThemeContext value={{ brand, setBrand }}>  // new object each render\n  <HugeTree />`, good: `const value = useMemo(() => ({ brand, setBrand }), [brand]);\n<ThemeContext value={value}>`, why: "A new object every render re-renders all consumers when the provider's parent re-renders. Memoise it (or rely on React Compiler)." }
    ],
    practice: [
      { level: "B", q: "Add a `--space` token and use it for card padding.", a: "`:root { --space: 12px }` and `.card { padding: var(--space); }`." },
      { level: "I", q: "Add a third theme \"forest\" to the picker.", a: "Add `[data-brand=\"forest\"] { --color-primary: #15803d; --radius: 4px; }` and a new `<option value=\"forest\">`." },
      { level: "I", q: "Read a token in JS (e.g. for a chart colour).", a: "`getComputedStyle(el).getPropertyValue('--color-primary').trim()` after mount, e.g. in an effect." },
      { level: "C", q: "Persist the chosen brand across reloads.", a: "Initialise state lazily from `localStorage` and save in an effect.", code: `const [brand, setBrand] = useState(() => localStorage.getItem('brand') ?? 'ocean');\nuseEffect(() => localStorage.setItem('brand', brand), [brand]);` }
    ],
    quiz: [
      { q: "Where should theme colour values live?", options: ["In React state in every component", "In CSS variables (tokens)", "In inline styles"], answer: 1, why: "CSS variables cascade to every element; switching a set is one attribute change." },
      { q: "What does the context hold in this pattern?", options: ["Every colour value", "The active theme name and a setter", "The CSS file"], answer: 1, why: "Context shares the choice; CSS supplies the values." },
      { q: "In React 19, how do you provide a context value?", options: ["`<ThemeContext value={v}>`", "`ThemeContext.set(v)`", "Only `<ThemeContext.Provider value={v}>`"], answer: 0, why: "React 19 lets you render the context itself as the provider; `.Provider` still works." }
    ],
    rev: {
      sec30: "Theme management: define tokens as CSS variables per theme (`[data-brand=\"x\"] { --color-primary: ... }`), have components read only `var(--token)`, and switch themes by changing one attribute. Context (`<ThemeContext value>` in React 19 + a `useTheme` hook) shares the active theme and setter. Values in CSS, choice in React.",
      interview: [
        { level: "basic", q: "What are design tokens?", a: "Named design values like `--color-primary` or `--space-2` that components use instead of raw hex codes and pixels." },
        { level: "intermediate", q: "Why combine CSS variables with context instead of putting colours in context?", a: "CSS variables update everything via the cascade with no re-renders. Context only needs to hold the theme name so a picker can change it." },
        { level: "advanced", q: "How do you avoid unnecessary re-renders from a theme context?", a: "Keep the value stable (`useMemo` or React Compiler), split rarely-changing and frequently-changing contexts, and keep colours in CSS so most components don't consume the context at all." },
        { level: "tricky", q: "Can a nested part of the page use a different theme?", a: "Yes. Put another `data-brand` on a subtree; CSS variables re-resolve for its descendants." }
      ],
      cheat: [
        "Tokens = CSS variables: `--color-primary`, `--radius`",
        "Theme switch = one attribute (`data-brand`)",
        "Components read `var(--token)` only",
        "Context = theme name + setter",
        "React 19: `<Ctx value={v}>` as provider",
        "`useTheme()` hook throws outside provider",
        "Nested themes work via the cascade"
      ]
    },
    related: ["STYLE-014", "COMM-006", "HOOKS-006", "STYLE-015"]
  },

  "STYLE-014": {
    tldr: "Good dark mode offers **System / Light / Dark**. Default to the OS setting (`prefers-color-scheme`), let users override it, save the choice, and set a `data-theme` attribute on `<html>` that swaps your colour tokens.",
    analogy: { icon: "🌙", text: "Phone screen brightness on auto: it follows the room's light, but you can grab the slider and it remembers your choice." },
    visual: { type: "flow", title: "Deciding light or dark", steps: [
      { label: "Read saved choice", detail: "`localStorage.theme`: `'system'`, `'light'` or `'dark'` (default `'system'`)." },
      { label: "Check the OS", detail: "`matchMedia('(prefers-color-scheme: dark)').matches`" },
      { label: "Resolve", detail: "Dark if choice is `'dark'`, or `'system'` and the OS is dark." },
      { label: "Apply", detail: "`<html data-theme=\"dark\">` swaps CSS variables; `color-scheme` fixes scrollbars and inputs." },
      { label: "Keep listening", detail: "OS switches at sunset? The `change` event updates the page live." }
    ]},
    points: [
      "CSS-only start: `@media (prefers-color-scheme: dark) { :root { --bg: #0f172a } }`.",
      "Manual toggle needs JS: store the choice, set `data-theme` on `document.documentElement`.",
      "Set `color-scheme: dark` so native controls and scrollbars match. `light-dark(#fff, #111)` picks a value per scheme.",
      "Avoid the **white flash**: a tiny inline `<script>` in `index.html` sets `data-theme` before React loads.",
      "Tailwind v4: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` then `dark:bg-slate-900`."
    ],
    code: { file: "ThemeSwitch.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

const media = window.matchMedia('(prefers-color-scheme: dark)');

function useDarkMode() {
  const [choice, setChoice] = useState(
    () => localStorage.getItem('theme') ?? 'system'
  );
  const [systemDark, setSystemDark] = useState(media.matches);

  useEffect(() => {
    const onChange = e => setSystemDark(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const dark = choice === 'dark' || (choice === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', choice);
  }, [dark, choice]);

  return [choice, setChoice];
}

export default function ThemeSwitch() {
  const [choice, setChoice] = useDarkMode();
  return (
    <select value={choice} onChange={e => setChoice(e.target.value)}>
      <option value="system">🖥 System</option>
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
    </select>
  );
}

/* index.css
:root { color-scheme: light; --bg: #ffffff; --text: #111827; }
:root[data-theme="dark"] { color-scheme: dark; --bg: #0f172a; --text: #e2e8f0; }
body { background: var(--bg); color: var(--text); }
*/`, walk: [
      { lines: [3], note: "One media query object for the OS preference (client-only code: `window` exists)." },
      { lines: [6, 7, 8], note: "The user's choice, lazily read from `localStorage`; defaults to following the system." },
      { lines: [11, 12, 13, 14, 15], note: "Subscribe to OS changes; clean up on unmount." },
      { lines: [17], note: "Derived value: no extra state needed for the final light/dark answer." },
      { lines: [19, 20, 21, 22], note: "Sync to the outside world: the `<html>` attribute and storage." },
      { lines: [39, 40], note: "Tokens per theme; `color-scheme` makes form controls match." }
    ]},
    output: "A select with System / Light / Dark. On System the page follows the OS live; picking Dark or Light overrides it and survives a reload.",
    mistakes: [
      { bad: `// theme applied only after React mounts\nuseEffect(() => { html.dataset.theme = saved; }, []);`, good: `<!-- index.html, in <head> -->\n<script>\n  const t = localStorage.theme ?? 'system';\n  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);\n  document.documentElement.dataset.theme = dark ? 'dark' : 'light';\n</script>`, why: "The page paints light first, then flips: a white flash. A blocking inline script sets the theme before first paint." },
      { bad: `const [dark, setDark] = useState(false); // ignores the OS`, good: `useState(() => localStorage.getItem('theme') ?? 'system')`, why: "Users who set dark mode in their OS expect your app to follow it by default." }
    ],
    practice: [
      { level: "B", q: "Make the page dark for OS dark-mode users with CSS only.", a: "`@media (prefers-color-scheme: dark) { :root { --bg: #0f172a; --text: #e2e8f0; color-scheme: dark; } }`" },
      { level: "B", q: "Use `light-dark()` for a card background.", a: "With `:root { color-scheme: light dark; }`: `.card { background: light-dark(#fff, #1e293b); }`." },
      { level: "I", q: "Turn the select into a single 🌙/☀️ toggle button.", a: "`<button onClick={() => setChoice(dark ? 'light' : 'dark')}>{dark ? '☀️' : '🌙'}</button>`, returning `dark` from the hook too." },
      { level: "C", q: "This hook reads `window` at module level. What breaks with server rendering, and how do you fix it?", a: "`window` doesn't exist on the server. Create the media query inside effects (or use `useSyncExternalStore` with a server snapshot) and rely on the inline script for the first paint." }
    ],
    quiz: [
      { q: "Which CSS media feature reads the OS theme?", options: ["`prefers-contrast`", "`prefers-color-scheme`", "`color-mode`"], answer: 1, why: "`(prefers-color-scheme: dark)` matches when the OS/browser is in dark mode." },
      { q: "How do you prevent a light flash on load for dark-mode users?", options: ["Set the theme in `useEffect`", "An inline script in `index.html` sets `data-theme` before paint", "Add a CSS transition"], answer: 1, why: "Effects run after the first paint; a blocking head script runs before it." },
      { q: "Why store `'system'` as a choice instead of just true/false?", options: ["It's shorter", "So the app keeps following OS changes until the user overrides", "localStorage needs strings"], answer: 1, why: "Three states = follow the OS, or a fixed manual override." }
    ],
    rev: {
      sec30: "Dark mode = tokens per theme + a resolved theme on `<html data-theme>`. Offer System/Light/Dark, default to `prefers-color-scheme`, listen for OS changes with `matchMedia`, persist the choice in `localStorage`, set `color-scheme`, and block the white flash with an inline head script. Tailwind v4 maps `dark:` to the attribute via `@custom-variant`.",
      interview: [
        { level: "basic", q: "How do you detect the user's OS theme?", a: "CSS `@media (prefers-color-scheme: dark)`, or in JS `matchMedia('(prefers-color-scheme: dark)').matches`." },
        { level: "intermediate", q: "How do you support both the OS setting and a manual toggle?", a: "Store a three-state choice (system/light/dark). Resolve to dark when the choice is dark, or system and the OS is dark, and set an attribute on `<html>` that swaps CSS variables." },
        { level: "advanced", q: "What causes the dark-mode flash and how do you fix it?", a: "The first paint happens before React effects run, so the default (light) theme shows. A small inline script in `<head>` applies the saved theme synchronously before paint." },
        { level: "tricky", q: "Dark mode is on but inputs and scrollbars stay white. Why?", a: "Only your variables changed. Set `color-scheme: dark` so the browser renders native controls in dark style." }
      ],
      cheat: [
        "`prefers-color-scheme: dark` = OS setting",
        "Three states: system / light / dark",
        "Apply via `document.documentElement.dataset.theme`",
        "Listen: `media.addEventListener('change', ...)`",
        "`color-scheme: dark` fixes native controls",
        "Inline head script prevents the flash",
        "Tailwind v4: `@custom-variant dark (...)`"
      ]
    },
    related: ["STYLE-013", "WEB-037", "HOOKS-016", "STYLE-008"]
  },

  "STYLE-015": {
    tldr: "A design system is a shared set of **tokens** (colours, spacing), **primitives** (accessible building blocks) and **components** (Button, Dialog) so every screen matches. Libraries: **MUI** (install and theme) or **shadcn/ui** (copy source into your repo).",
    analogy: { icon: "🍳", text: "A restaurant chain's recipe book. Same ingredients (tokens), same base sauces (primitives), same dishes (components): every branch serves food that tastes the same." },
    visual: { type: "layers", title: "Layers of a design system", items: [
      { label: "Patterns & pages", detail: "Checkout form, product grid: built only from components below." },
      { label: "Components", detail: "`<Button variant=\"outline\">`, `<Dialog>`, `<Select>` with your styling." },
      { label: "Primitives (headless)", detail: "Radix UI, React Aria, Base UI: behaviour + accessibility, no looks." },
      { label: "Tokens", detail: "`--primary`, `--radius`, `--space-4`, font scale: the single source of truth." }
    ]},
    points: [
      "**Tokens** keep values consistent and make theming/dark mode one switch.",
      "**Headless primitives** solve the hard parts: focus traps, keyboard nav, ARIA. Don't hand-roll a dialog.",
      "**shadcn/ui**: `npx shadcn@latest add button` copies code into `components/ui/`. You own and edit it. Built on Tailwind + Radix.",
      "**MUI**: an installed package of ready Material-style components; customise with `createTheme` and the `sx` prop. Uses Emotion by default.",
      "Variants, not overrides: components expose `variant` / `size` props instead of accepting any style."
    ],
    code: { file: "components/ui/button.jsx", lang: "jsx", src: `// The shadcn/ui pattern (simplified)
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center rounded-md text-sm font-medium disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3',
        default: 'h-9 px-4',
        lg: 'h-10 px-6',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// <Button>Checkout</Button>
// <Button variant="outline" size="sm">Save for later</Button>
// <Button variant="destructive">Remove item</Button>`, walk: [
      { lines: [2, 3], note: "`cva` maps variant props to classes; `cn` is the clsx + tailwind-merge helper." },
      { lines: [10, 11, 12], note: "`bg-primary` etc. are **tokens** (CSS variables) wired into Tailwind's theme." },
      { lines: [14, 15, 16, 17, 18], note: "A small, fixed set of sizes keeps every screen consistent." },
      { lines: [24, 25, 26, 27, 28, 29, 30], note: "The API: `variant`, `size`, an optional `className`, and normal button props." },
      { lines: [33, 34, 35], note: "Teams pick from approved options instead of inventing new buttons." }
    ]},
    output: "Three consistent buttons: a filled Checkout, a small outlined Save for later, and a red Remove item, all sharing radius, font and focus behaviour.",
    mistakes: [
      { bad: `<button style={{ background: '#2563eb', padding: 9 }}>\n// a new one-off button in every feature`, good: `<Button size="sm">Save</Button>`, why: "One-offs drift in colour, spacing and accessibility. Reuse the system component." },
      { bad: `// hand-rolled modal\n<div className="modal" onClick={close}>...</div>`, good: `import * as Dialog from '@radix-ui/react-dialog';\n// or shadcn's <Dialog> built on it`, why: "Dialogs need focus trapping, Escape to close, ARIA roles and scroll lock. Headless primitives do this correctly." }
    ],
    practice: [
      { level: "B", q: "What's the difference between a token and a component?", a: "A token is a named value (`--primary`); a component is reusable UI (`<Button>`) that uses tokens." },
      { level: "I", q: "Add a `ghost` variant to the Button above.", a: "Add `ghost: 'bg-transparent hover:bg-accent'` to `variants.variant`, then use `<Button variant=\"ghost\">`." },
      { level: "I", q: "With MUI, change the primary colour for the whole app.", a: "Create and provide a theme.", code: `import { createTheme, ThemeProvider } from '@mui/material/styles';\nconst theme = createTheme({ palette: { primary: { main: '#7c3aed' } } });\n<ThemeProvider theme={theme}><App /></ThemeProvider>` },
      { level: "C", q: "MUI or shadcn/ui for a startup with a custom brand and Tailwind already in place?", a: "shadcn/ui: it uses Tailwind, you own the code to match the brand, and it's built on accessible Radix primitives. MUI shines when you want a complete, ready Material-style kit fast." }
    ],
    quiz: [
      { q: "How is shadcn/ui delivered?", options: ["An npm package you import from", "A CLI that copies component source into your project", "A CDN stylesheet"], answer: 1, why: "You own the copied code and can edit it freely." },
      { q: "What do headless primitives (Radix, React Aria) provide?", options: ["Colours and fonts", "Behaviour and accessibility without styling", "Server rendering"], answer: 1, why: "You add the look; they handle focus, keyboard and ARIA." },
      { q: "Best way for a design system Button to allow customisation?", options: ["Accept any `style` object", "Expose `variant` and `size` props (plus `className` for layout)", "Ask teams to copy it"], answer: 1, why: "Constrained variants keep consistency while covering real needs." }
    ],
    rev: {
      sec30: "Design system = tokens (CSS variables) + headless primitives (Radix, React Aria, Base UI) + styled components with constrained variants + docs. shadcn/ui copies Tailwind + Radix components into your repo (you own them, `cva` + `cn`). MUI is an installed, themeable Material component library (`createTheme`, `sx`, Emotion). Goal: consistency, accessibility, speed.",
      interview: [
        { level: "basic", q: "What is a design system?", a: "A shared set of tokens, components and guidelines that makes UI consistent across an app or company." },
        { level: "intermediate", q: "shadcn/ui vs MUI?", a: "shadcn/ui copies source into your repo (Tailwind + Radix), so you fully own and restyle it. MUI is a dependency with a complete Material-style kit, themed via `createTheme`; faster start, harder to make look non-Material." },
        { level: "advanced", q: "Why build on headless primitives?", a: "Accessibility details like focus management, keyboard support and ARIA are hard to get right. Primitives solve them once, leaving styling to you." },
        { level: "advanced", q: "How do you keep a design system adopted across teams?", a: "Tokens as the single source, documented components in Storybook, lint rules against raw colours, and visual regression tests." },
        { level: "tricky", q: "Is shadcn/ui a component library?", a: "Not in the usual sense: it's a collection of copy-in components and a CLI. There's no versioned package to upgrade; you update code yourself." }
      ],
      compare: { cols: ["", "shadcn/ui", "MUI"], rows: [
        ["Delivery", "Copied into repo", "npm dependency"],
        ["Styling", "Tailwind + CSS variables", "Emotion + theme object"],
        ["Look", "Neutral, fully yours", "Material Design by default"],
        ["Customise", "Edit the source", "`createTheme`, `sx`, overrides"]
      ]},
      cheat: [
        "Tokens → primitives → components → patterns",
        "Headless: Radix UI, React Aria, Base UI",
        "shadcn/ui: `npx shadcn@latest add button`, you own the code",
        "MUI: `createTheme` + `ThemeProvider` + `sx`",
        "`cva` = variant props → class names",
        "Variants over arbitrary overrides",
        "Storybook documents the system"
      ]
    },
    related: ["STYLE-013", "STYLE-011", "STYLE-016", "COMP-011"]
  },

  "STYLE-016": {
    tldr: "In a large codebase, choose **one primary styling approach**, make **tokens** the single source of truth, colocate component styles, order global CSS with `@layer`, and enforce it with lint rules and shared components.",
    analogy: { icon: "📚", text: "A big library's shelving system. One cataloguing rule for everyone, a fixed place for each genre, and librarians who reshelve strays: that's what keeps thousands of books findable." },
    visual: { type: "layers", title: "A scalable styling stack", items: [
      { label: "Feature components", detail: "`features/cart/CartSummary` + its own `.module.css` or Tailwind classes." },
      { label: "UI components", detail: "`components/ui/` Button, Input, Dialog with variants: the only place raw styles live." },
      { label: "Base styles", detail: "Reset, typography, `body`, links, in a named `@layer`." },
      { label: "Tokens", detail: "`tokens.css`: colours, spacing, radius, fonts, light/dark values." },
      { label: "Decision & guardrails", detail: "One approach, documented; stylelint/ESLint rules; Storybook; visual tests." }
    ]},
    points: [
      "Pick one main approach: **Tailwind** or **CSS Modules** are the safe defaults; plus inline styles for dynamic values only.",
      "Server rendering or Server Components ahead? Avoid **runtime** CSS-in-JS for new code.",
      "Colocate: `Card.jsx` + `Card.module.css` side by side; delete them together.",
      "Use `@layer reset, tokens, base, components, utilities;` so cascade order is explicit, not import luck.",
      "Shared components take `variant`/`size` and a `className` for layout only. Lint against raw hex colours.",
      "Migrating? Do it incrementally: new code in the new approach, convert leaf components first."
    ],
    code: { file: "src/styles/index.css", lang: "css", src: `/* src/styles/index.css — the ONE global entry, imported in main.jsx */
@layer reset, tokens, base, components, utilities;

@import "./reset.css" layer(reset);
@import "./tokens.css" layer(tokens);

@layer base {
  body {
    font-family: var(--font-sans);
    color: var(--text);
    background: var(--bg);
  }
  a { color: var(--color-primary); }
}

/* src/styles/tokens.css
:root {
  --color-primary: #2563eb;
  --space-2: 8px; --space-4: 16px;
  --bg: #ffffff; --text: #111827;
  --radius-md: 8px;
  --font-sans: "Inter", system-ui, sans-serif;
}
:root[data-theme="dark"] { --bg: #0f172a; --text: #e2e8f0; }
*/

/* Folder layout
src/
  styles/            index.css, reset.css, tokens.css
  components/ui/     Button.jsx + Button.module.css, Dialog.jsx ...
  features/cart/     CartSummary.jsx + CartSummary.module.css
  features/recipes/  RecipeCard.jsx + RecipeCard.module.css
*/`, walk: [
      { lines: [2], note: "Declare layer order once. Later layers win regardless of selector specificity or file order." },
      { lines: [4, 5], note: "Pull files into named layers, so a reset can never override your components." },
      { lines: [7, 8, 9, 10, 11, 12, 13, 14], note: "Base styles read tokens only; no raw values here." },
      { lines: [17, 18, 19, 20, 21, 22, 23, 24], note: "Tokens: the single source of truth for every colour, space and font." },
      { lines: [27, 28, 29, 30, 31, 32], note: "Each component owns its styles beside it; shared UI lives in `components/ui/`." }
    ]},
    output: "One predictable cascade: reset < tokens < base < components < utilities. Every feature styles itself locally and pulls values from tokens.",
    mistakes: [
      { bad: `// one codebase, five approaches\nimport styled from 'styled-components';\nimport './Cart.css';\n<div className="p-4" style={{ color: '#333' }} sx={{ m: 2 }}>`, good: `// one primary approach + tokens\nimport styles from './Cart.module.css';\n<div className={styles.cart}>`, why: "Mixed systems mean mixed specificity rules, bigger bundles and nobody knowing where a style comes from." },
      { bad: `.cart .title { color: red !important; }`, good: `@layer components { .title { color: var(--color-danger); } }`, why: "`!important` wars escalate. Fix ordering with `@layer` and values with tokens." }
    ],
    practice: [
      { level: "B", q: "Where should a `RecipeCard`'s styles live in this structure?", a: "Next to it: `features/recipes/RecipeCard.module.css` (or Tailwind classes in the JSX)." },
      { level: "I", q: "A third-party library's CSS keeps overriding your components. Fix it with layers.", a: "Import it into a lower layer: `@import \"lib.css\" layer(library);` with `@layer reset, library, base, components;`." },
      { level: "I", q: "How do you stop developers adding raw hex colours?", a: "A stylelint rule (e.g. `color-no-hex` or a token-only plugin) in CI, plus Tailwind theme-only colours." },
      { level: "C", q: "Plan a migration from styled-components to Tailwind in a 300-component app.", a: "Freeze new styled-components usage, set up Tailwind tokens matching the old theme, migrate shared UI components first, then leaf features; delete the ThemeProvider when the last usage is gone. Visual regression tests guard each step." }
    ],
    quiz: [
      { q: "What does `@layer reset, base, components;` guarantee?", options: ["Files load faster", "Rules in `components` beat `reset` regardless of specificity", "Styles are scoped per component"], answer: 1, why: "Layer order is checked before specificity in the cascade." },
      { q: "Best default for a new large React + SSR codebase?", options: ["Runtime CSS-in-JS everywhere", "Tailwind or CSS Modules with shared tokens", "Inline styles only"], answer: 1, why: "Static CSS, no runtime cost, works with Server Components." },
      { q: "A shared Button should let callers...", options: ["Override any style", "Pick from `variant`/`size` and adjust layout via `className`", "Copy and edit it per feature"], answer: 1, why: "Constrained APIs keep the design consistent." }
    ],
    rev: {
      sec30: "Large-codebase styling: one primary approach (Tailwind or CSS Modules; avoid runtime CSS-in-JS with SSR/RSC), tokens as the single source of truth, colocated component styles, a shared `components/ui` layer with variant APIs, explicit cascade via `@layer`, and guardrails: lint rules, Storybook, visual regression tests. Migrate incrementally.",
      interview: [
        { level: "basic", q: "Why pick a single styling approach?", a: "Consistency: one mental model, predictable specificity, smaller bundles and easier onboarding." },
        { level: "intermediate", q: "How would you choose between Tailwind and CSS Modules for a team?", a: "Tailwind for speed and built-in consistency via its scale; CSS Modules if the team prefers writing real CSS or has strong existing CSS skills. Both are static and scale well with shared tokens." },
        { level: "advanced", q: "What does `@layer` solve?", a: "It makes cascade order explicit by group, so resets, libraries and components don't depend on import order or specificity hacks." },
        { level: "advanced", q: "How do you enforce the strategy?", a: "Shared UI components with variant props, lint rules banning raw colours, code review checklists, Storybook docs and visual regression tests in CI." },
        { level: "tricky", q: "Should a design-system Button accept a `style` prop?", a: "Usually only pass-through for rare dynamic cases. Prefer variants for visuals and `className` for layout, or consistency erodes." }
      ],
      scenario: [
        { q: "Your team is moving a client-side Vite app with Emotion to Next.js App Router. What's the styling plan?", a: "Keep Emotion components as Client Components for now, introduce Tailwind or CSS Modules with shared tokens for all new code, migrate shared UI first, and remove Emotion once nothing depends on it." }
      ],
      cheat: [
        "One primary approach + inline for dynamic values",
        "Tokens = single source of truth",
        "Colocate `X.jsx` + `X.module.css`",
        "`@layer reset, tokens, base, components, utilities;`",
        "Shared UI: `variant`/`size` + `className` for layout",
        "Guardrails: stylelint, Storybook, visual tests",
        "Avoid runtime CSS-in-JS for SSR/RSC"
      ]
    },
    related: ["STYLE-001", "STYLE-015", "COMP-015", "STYLE-013"]
  }
};
