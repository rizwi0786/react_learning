// Generated from index.html by scripts/extract-curriculum.mjs. Never reorder lessons: IDs come from position.
export const MODULES = [
 {
  "code": "WEB",
  "n": 1,
  "stage": 1,
  "name": "Web Development Foundations",
  "pre": [],
  "note": "Why JavaScript first: React is plain JavaScript. Every hook is a closure, every list is map(), every update is an immutable copy with spread. Weak JS shows up as React bugs, so this module is not optional.",
  "lessons": [
   {
    "id": "WEB-001",
    "title": "How the web works",
    "objective": "Trace what happens from typing a URL to seeing a page (DNS, TCP, rendering)",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-002",
    "title": "Client-server architecture",
    "objective": "Identify the roles of browser, server, and database in a web app",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-003",
    "title": "HTTP and HTTPS",
    "objective": "Explain HTTP messages and headers, and why TLS encryption matters",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-004",
    "title": "Request-response lifecycle",
    "objective": "Follow one request from DNS lookup to browser paint",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-005",
    "title": "HTML fundamentals",
    "objective": "Build a page with elements, attributes, links, images, and forms",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "WEB-006",
    "title": "Semantic HTML",
    "objective": "Use header, nav, main, article, and section for accessibility and SEO",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-007",
    "title": "CSS fundamentals",
    "objective": "Apply selectors, the box model, specificity, and the cascade",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-008",
    "title": "Flexbox",
    "objective": "Lay out rows and columns with direction, alignment, and wrapping",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-009",
    "title": "CSS Grid",
    "objective": "Build two-dimensional layouts with templates and areas",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-010",
    "title": "Responsive design",
    "objective": "Adapt layouts with media queries, relative units, and mobile-first CSS",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-011",
    "title": "JavaScript fundamentals",
    "objective": "Run JS in the browser and Node; know statements vs expressions",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-012",
    "title": "Variables: var, let, const",
    "objective": "Pick the right declaration and explain block vs function scope",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-013",
    "title": "Data types",
    "objective": "Tell primitives from objects and use typeof correctly",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-014",
    "title": "Operators",
    "objective": "Use arithmetic, comparison (== vs ===), logical, and ?? operators",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-015",
    "title": "Conditions and loops",
    "objective": "Control flow with if/else, switch, for, while, and for...of",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "WEB-016",
    "title": "Functions",
    "objective": "Declare, call, and return from functions; parameters and defaults",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-017",
    "title": "Arrow functions",
    "objective": "Write arrow functions and explain their lexical this",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-018",
    "title": "Scope",
    "objective": "Trace global, function, and block scope and the scope chain",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-019",
    "title": "Hoisting",
    "objective": "Predict hoisting of var, let/const (temporal dead zone), and functions",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-020",
    "title": "Closures",
    "objective": "Use closures for private state and spot them inside React hooks",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-021",
    "title": "Arrays and objects",
    "objective": "Create, read, and update arrays and objects; reference vs value",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-022",
    "title": "Array methods: map, filter, reduce, find, some, every",
    "objective": "Transform data the way React lists do",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-023",
    "title": "Destructuring",
    "objective": "Unpack arrays and objects, including nested values and defaults",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-024",
    "title": "Spread and rest operators",
    "objective": "Copy and merge immutably; collect arguments with rest",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-025",
    "title": "Template literals",
    "objective": "Build strings with interpolation and multiple lines",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "WEB-026",
    "title": "ES6 modules",
    "objective": "Explain module scope and why bundlers rely on ES modules",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-027",
    "title": "Import and export",
    "objective": "Use named, default, and namespace imports correctly",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-028",
    "title": "Promises",
    "objective": "Create and chain promises; handle rejection; Promise.all and allSettled",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-029",
    "title": "Async/await",
    "objective": "Write async code that reads top to bottom, with try/catch",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-030",
    "title": "Fetch API",
    "objective": "Call a REST API, parse JSON, and check response.ok",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-031",
    "title": "Event loop",
    "objective": "Explain how a single thread runs async work",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-032",
    "title": "Call stack",
    "objective": "Trace calls on the stack and read stack traces",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-033",
    "title": "Microtasks and macrotasks",
    "objective": "Predict output order of promises vs setTimeout",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-034",
    "title": "DOM manipulation",
    "objective": "Select, create, and update DOM nodes with vanilla JS",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-035",
    "title": "Event bubbling and capturing",
    "objective": "Trace event phases and stop propagation correctly",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "WEB-036",
    "title": "Event delegation",
    "objective": "Handle events for many children with one parent listener",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-037",
    "title": "LocalStorage and SessionStorage",
    "objective": "Persist small data in the browser and know the limits",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-038",
    "title": "JSON",
    "objective": "Serialise and parse data with JSON.stringify and JSON.parse",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-039",
    "title": "Error handling",
    "objective": "Use try/catch/finally, custom errors, and async error paths",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-040",
    "title": "npm and package management",
    "objective": "Install, update, and audit packages; semantic versioning",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "WEB-041",
    "title": "Git and GitHub basics",
    "objective": "Commit, branch, merge, and open a pull request",
    "level": "B",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "INTRO",
  "n": 2,
  "stage": 1,
  "name": "React Introduction",
  "pre": [
   "WEB"
  ],
  "note": "",
  "lessons": [
   {
    "id": "INTRO-001",
    "title": "What is React?",
    "objective": "Describe React as a library for building UIs from components",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-002",
    "title": "Why React?",
    "objective": "List the problems React solves: keeping UI in sync with data, reuse, scale",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-003",
    "title": "Problems with traditional DOM manipulation",
    "objective": "See how manual DOM updates drift out of sync with data",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "INTRO-004",
    "title": "React vs Vanilla JavaScript",
    "objective": "Build the same counter both ways and compare",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "INTRO-005",
    "title": "React vs Angular vs Vue",
    "objective": "Compare scope, learning curve, and ecosystem",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "INTRO-006",
    "title": "Library vs framework",
    "objective": "Explain inversion of control and where React sits",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-007",
    "title": "Features of React",
    "objective": "Summarise components, JSX, one-way data flow, virtual DOM, hooks",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-008",
    "title": "Declarative vs imperative programming",
    "objective": "Describe UI as a function of state instead of step-by-step DOM edits",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-009",
    "title": "Single Page Applications",
    "objective": "Explain how SPAs swap views without full page reloads",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-010",
    "title": "Multi Page Applications",
    "objective": "Compare MPAs with SPAs on SEO, speed, and complexity",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "INTRO-011",
    "title": "Client-side rendering",
    "objective": "Trace a CSR page load and its trade-offs",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-012",
    "title": "Server-side rendering",
    "objective": "Explain how SSR sends HTML first, then hydrates",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "INTRO-013",
    "title": "Static site generation",
    "objective": "Explain build-time HTML and when it beats SSR",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "INTRO-014",
    "title": "React ecosystem overview",
    "objective": "Map routing, data, state, styling, testing, and frameworks",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "INTRO-015",
    "title": "Understanding React architecture",
    "objective": "See how react, react-dom, components, and the reconciler fit together",
    "level": "I",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "ENV",
  "n": 3,
  "stage": 1,
  "name": "Development Environment",
  "pre": [
   "WEB"
  ],
  "note": "Vite is the primary setup. Create React App was deprecated in February 2025; alternatives covered: Next.js, React Router framework mode, Rsbuild, Parcel.",
  "lessons": [
   {
    "id": "ENV-001",
    "title": "Installing Node.js",
    "objective": "Install an LTS release and verify node and npm",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ENV-002",
    "title": "Understanding npm",
    "objective": "Use npm install, npx, and the registry",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-003",
    "title": "Creating a React application using Vite",
    "objective": "Scaffold with npm create vite@latest and run it",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ENV-004",
    "title": "Understanding project structure",
    "objective": "Know what index.html, main.jsx, App.jsx, and public/ do",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-005",
    "title": "package.json",
    "objective": "Read dependencies, devDependencies, scripts, and version ranges",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-006",
    "title": "package-lock.json",
    "objective": "Explain why lock files give reproducible installs",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-007",
    "title": "node_modules",
    "objective": "Know why it is never committed and how to rebuild it",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ENV-008",
    "title": "npm scripts",
    "objective": "Run dev, build, preview, lint, and custom scripts",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-009",
    "title": "Starting the development server",
    "objective": "Use Vite's dev server and hot module replacement",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-010",
    "title": "Production build",
    "objective": "Create and preview an optimised dist/ build",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ENV-011",
    "title": "Environment variables",
    "objective": "Use .env files and import.meta.env.VITE_* safely",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ENV-012",
    "title": "VS Code setup",
    "objective": "Configure extensions, Prettier, ESLint, and snippets",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ENV-013",
    "title": "Browser developer tools",
    "objective": "Use the Elements, Console, Network, and Sources panels",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-014",
    "title": "React Developer Tools",
    "objective": "Inspect component trees, props, state, and the Profiler",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ENV-015",
    "title": "Debugging React applications",
    "objective": "Use breakpoints, logging patterns, and error overlays",
    "level": "I",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "JSX",
  "n": 4,
  "stage": 1,
  "name": "JSX Fundamentals",
  "pre": [
   "INTRO",
   "ENV"
  ],
  "note": "Every JSX lesson shows an incorrect example, the corrected version, and the expected output.",
  "lessons": [
   {
    "id": "JSX-001",
    "title": "What is JSX?",
    "objective": "Read JSX as JavaScript that describes UI",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-002",
    "title": "Why JSX?",
    "objective": "Compare JSX with React.createElement calls",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "JSX-003",
    "title": "JSX vs HTML",
    "objective": "Spot the differences: camelCase, className, self-closing tags",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-004",
    "title": "JSX transformation",
    "objective": "See how JSX compiles to jsx() calls with the automatic runtime",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-005",
    "title": "Babel and modern compilation concepts",
    "objective": "Know what Babel, esbuild, SWC, and Oxc do in a build",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "JSX-006",
    "title": "Embedding JavaScript in JSX",
    "objective": "Use curly braces to insert values and call functions",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-007",
    "title": "JSX expressions",
    "objective": "Know which expressions work in JSX and why statements do not",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-008",
    "title": "JSX attributes",
    "objective": "Pass strings, expressions, and spread attributes",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "JSX-009",
    "title": "className",
    "objective": "Apply CSS classes, including conditional class strings",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "JSX-010",
    "title": "htmlFor",
    "objective": "Link labels to inputs for accessibility",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "JSX-011",
    "title": "Inline styles",
    "objective": "Use style objects with camelCase properties",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "JSX-012",
    "title": "JSX fragments",
    "objective": "Return several elements without extra DOM wrappers",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-013",
    "title": "Conditional expressions",
    "objective": "Use ternaries and && inside JSX",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-014",
    "title": "Rendering lists",
    "objective": "Map arrays to elements with keys",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "JSX-015",
    "title": "JSX restrictions",
    "objective": "Know the single-root rule, reserved words, and closing tags",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "JSX-016",
    "title": "Common JSX errors",
    "objective": "Fix the most frequent JSX compile and runtime errors",
    "level": "B",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "COMP",
  "n": 5,
  "stage": 1,
  "name": "Components",
  "pre": [
   "JSX"
  ],
  "note": "",
  "lessons": [
   {
    "id": "COMP-001",
    "title": "What are components?",
    "objective": "Define a component as a function that returns UI",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMP-002",
    "title": "Why component-based architecture?",
    "objective": "Explain reuse, isolation, and team scale",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMP-003",
    "title": "Functional components",
    "objective": "Write function components and know why class components are legacy",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMP-004",
    "title": "Component naming conventions",
    "objective": "Use PascalCase names and one main component per file",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-005",
    "title": "Component composition",
    "objective": "Build bigger UIs by combining small components",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMP-006",
    "title": "Component reuse",
    "objective": "Make a component configurable instead of copy-pasting it",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-007",
    "title": "Parent and child components",
    "objective": "Identify parent and child roles in a tree",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-008",
    "title": "Nested components",
    "objective": "Nest safely and never define a component inside another",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMP-009",
    "title": "Component tree",
    "objective": "Draw the component tree of a real app",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-010",
    "title": "Component separation",
    "objective": "Decide when and where to split a component",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-011",
    "title": "Reusable UI architecture",
    "objective": "Design a small UI kit: Button, Card, Modal, Input",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-012",
    "title": "Default exports",
    "objective": "Use export default and know its trade-offs",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-013",
    "title": "Named exports",
    "objective": "Use named exports and barrel files",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-014",
    "title": "Importing components",
    "objective": "Import with relative paths and path aliases",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "COMP-015",
    "title": "Component organization",
    "objective": "Organise folders by feature vs by type",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-016",
    "title": "Presentational vs container components",
    "objective": "Separate data logic from display; see how hooks changed this",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMP-017",
    "title": "Component design principles",
    "objective": "Apply single responsibility, pure rendering, and small APIs",
    "level": "I",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "PROPS",
  "n": 6,
  "stage": 1,
  "name": "Props",
  "pre": [
   "COMP"
  ],
  "note": "Builds reusable Card, Button, UserProfile and Product components that later projects reuse.",
  "lessons": [
   {
    "id": "PROPS-001",
    "title": "What are props?",
    "objective": "Explain props as read-only inputs to a component",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-002",
    "title": "Passing props",
    "objective": "Pass data from parent to child as attributes",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-003",
    "title": "Reading props",
    "objective": "Access the props object in a child",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROPS-004",
    "title": "Multiple props",
    "objective": "Pass and use several props together",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "PROPS-005",
    "title": "Props destructuring",
    "objective": "Destructure props in the parameter list",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROPS-006",
    "title": "Default values",
    "objective": "Set defaults with destructuring defaults (defaultProps is removed for functions in React 19)",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROPS-007",
    "title": "Passing strings, numbers, arrays and objects",
    "objective": "Pass each data type correctly with quotes or braces",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROPS-008",
    "title": "Passing functions as props",
    "objective": "Let children call parent callbacks",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-009",
    "title": "Passing JSX as props",
    "objective": "Pass elements as props for flexible layouts (slots)",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROPS-010",
    "title": "children prop",
    "objective": "Wrap content with the children prop",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-011",
    "title": "Props drilling",
    "objective": "Recognise drilling and its pain points",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-012",
    "title": "Props vs state",
    "objective": "Choose props or state for a given piece of data",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-013",
    "title": "One-way data flow",
    "objective": "Trace data flowing down and events flowing up",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-014",
    "title": "Immutable props",
    "objective": "Explain why components must never change their props",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROPS-015",
    "title": "Common mistakes",
    "objective": "Fix the frequent props mistakes",
    "level": "B",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "STATE",
  "n": 7,
  "stage": 1,
  "name": "State Management Fundamentals",
  "pre": [
   "PROPS"
  ],
  "note": "Worked examples across the module: counter, todo list, shopping cart, and a multi-field form.",
  "lessons": [
   {
    "id": "STATE-001",
    "title": "What is state?",
    "objective": "Define state as data a component remembers between renders",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-002",
    "title": "Local component state",
    "objective": "Keep state inside the component that owns it",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STATE-003",
    "title": "Why state is required",
    "objective": "See why a normal variable cannot update the screen",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-004",
    "title": "useState",
    "objective": "Declare state and update it with the setter",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-005",
    "title": "State initialization",
    "objective": "Choose good initial values for each data type",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STATE-006",
    "title": "Updating state",
    "objective": "Trigger a re-render by calling the setter",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-007",
    "title": "State vs normal variables",
    "objective": "Compare lifetime and re-render behaviour",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-008",
    "title": "State update scheduling",
    "objective": "Understand that updates are queued for the next render",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-009",
    "title": "Asynchronous-looking state behavior",
    "objective": "Explain why state still shows the old value right after set",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-010",
    "title": "Functional state updates",
    "objective": "Use setX(prev => …) when the next value depends on the previous one",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-011",
    "title": "Updating numbers",
    "objective": "Increment, decrement, and clamp numeric state",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "STATE-012",
    "title": "Updating strings",
    "objective": "Bind a text input to string state",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "STATE-013",
    "title": "Updating arrays",
    "objective": "Add, remove, and update items without mutation",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-014",
    "title": "Updating objects",
    "objective": "Update object fields with spread",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-015",
    "title": "Nested state updates",
    "objective": "Update nested objects and arrays immutably",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-016",
    "title": "State immutability",
    "objective": "Explain why mutation breaks re-renders",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-017",
    "title": "Multiple state variables",
    "objective": "Split or group state sensibly",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STATE-018",
    "title": "Lazy initialization",
    "objective": "Pass an initializer function for expensive initial state",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STATE-019",
    "title": "Batching",
    "objective": "See how React groups several updates into one render",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-020",
    "title": "State preservation and reset",
    "objective": "Know when React keeps or resets state, by tree position and key",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-021",
    "title": "Lifting state up",
    "objective": "Move shared state to the closest common parent",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-022",
    "title": "Derived state",
    "objective": "Calculate values during render instead of storing them",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STATE-023",
    "title": "Controlled components",
    "objective": "Drive input values from state",
    "level": "I",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "EVT",
  "n": 8,
  "stage": 2,
  "name": "Events and Forms",
  "pre": [
   "STATE"
  ],
  "note": "",
  "lessons": [
   {
    "id": "EVT-001",
    "title": "Event handling",
    "objective": "Attach handlers with onClick={fn}, not onClick={fn()}",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-002",
    "title": "Synthetic events",
    "objective": "Explain React's cross-browser event wrapper and root delegation",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-003",
    "title": "onClick",
    "objective": "Handle clicks and pass arguments",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-004",
    "title": "onChange",
    "objective": "Read input values on every keystroke",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-005",
    "title": "onSubmit",
    "objective": "Handle form submission in one place",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-006",
    "title": "onMouseEnter",
    "objective": "Build hover interactions (and why it does not bubble)",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "EVT-007",
    "title": "Event objects",
    "objective": "Use target, currentTarget, key, and preventDefault",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-008",
    "title": "Event propagation",
    "objective": "Stop propagation in nested handlers",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-009",
    "title": "Preventing default behavior",
    "objective": "Stop page reloads on submit and link navigation",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-010",
    "title": "Controlled forms",
    "objective": "Build forms whose values live in state",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-011",
    "title": "Uncontrolled forms",
    "objective": "Read values with refs or FormData",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-012",
    "title": "Input handling",
    "objective": "Handle text, number, and date inputs",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-013",
    "title": "Textarea",
    "objective": "Control multi-line text",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "EVT-014",
    "title": "Select",
    "objective": "Control single and multiple select menus",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "EVT-015",
    "title": "Checkbox",
    "objective": "Control checked state and checkbox groups",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-016",
    "title": "Radio buttons",
    "objective": "Control a radio group with one state value",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "EVT-017",
    "title": "Form validation",
    "objective": "Validate on change, blur, and submit with clear messages",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-018",
    "title": "Dynamic forms",
    "objective": "Add and remove fields at runtime",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-019",
    "title": "Multiple input handling",
    "objective": "Handle many inputs with one change handler",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-020",
    "title": "Form submission",
    "objective": "Submit to an API with loading, success, and error states",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "EVT-021",
    "title": "Form libraries overview",
    "objective": "Compare manual forms, React Hook Form, Formik, and React 19 form Actions",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-022",
    "title": "React Hook Form",
    "objective": "Build a validated form with useForm and a Zod schema",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "EVT-023",
    "title": "Formik overview",
    "objective": "Read and maintain existing Formik code",
    "level": "I",
    "freq": "L",
    "api": "leg"
   }
  ]
 },
 {
  "code": "COND",
  "n": 9,
  "stage": 2,
  "name": "Conditional Rendering and Lists",
  "pre": [
   "STATE"
  ],
  "note": "",
  "lessons": [
   {
    "id": "COND-001",
    "title": "Conditional rendering",
    "objective": "Show different UI based on state",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-002",
    "title": "if/else",
    "objective": "Return early with if/else",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-003",
    "title": "Ternary operator",
    "objective": "Pick between two elements inline",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-004",
    "title": "Logical AND",
    "objective": "Render or skip with && and avoid the stray 0 bug",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-005",
    "title": "Rendering nothing",
    "objective": "Return null to hide a component",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-006",
    "title": "Dynamic components",
    "objective": "Choose a component from a lookup map at runtime",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-007",
    "title": "Array rendering",
    "objective": "Render arrays of data as elements",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-008",
    "title": "map()",
    "objective": "Map data to JSX with keys",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-009",
    "title": "Filtering data",
    "objective": "Filter lists before rendering",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-010",
    "title": "Sorting data",
    "objective": "Sort a copy (toSorted), never the state array itself",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-011",
    "title": "Unique keys",
    "objective": "Give each list item a stable, unique key",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-012",
    "title": "Why keys are important",
    "objective": "See how keys let React match items between renders",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-013",
    "title": "Index as key problems",
    "objective": "Reproduce the input-mismatch bug caused by index keys",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-014",
    "title": "Reconciliation and list updates",
    "objective": "Trace how React inserts, moves, and removes list items",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COND-015",
    "title": "Empty states",
    "objective": "Design helpful no-data screens",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-016",
    "title": "Loading states",
    "objective": "Show spinners and skeletons while data loads",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COND-017",
    "title": "Error states",
    "objective": "Show recoverable error messages with retry",
    "level": "B",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "HOOKS",
  "n": 10,
  "stage": 2,
  "name": "React Hooks",
  "pre": [
   "STATE",
   "EVT",
   "COND"
  ],
  "note": "HOOKS-005 (useEffect) is the deepest lesson in the course: dependency arrays, cleanup, infinite loops, stale closures, data fetching, race conditions, effect lifecycle, Strict Mode double-run, and when not to use an effect. Each advanced hook carries its API status.",
  "lessons": [
   {
    "id": "HOOKS-001",
    "title": "What are hooks?",
    "objective": "Explain hooks as functions that plug into React features",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-002",
    "title": "Rules of hooks",
    "objective": "Call hooks only at the top level of components and custom hooks",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-003",
    "title": "Why hooks were introduced",
    "objective": "Compare class lifecycles with hooks and logic reuse",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-004",
    "title": "useState",
    "objective": "Revisit useState: update queues, identity, and pitfalls",
    "level": "I",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-005",
    "title": "useEffect",
    "objective": "Sync with external systems: deps, cleanup, races, Strict Mode, when NOT to use it",
    "level": "I",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-006",
    "title": "useContext",
    "objective": "Read shared values without prop drilling",
    "level": "I",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-007",
    "title": "useRef",
    "objective": "DOM refs, mutable values, previous values, avoiding re-renders",
    "level": "I",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-008",
    "title": "useReducer",
    "objective": "Manage complex state transitions with a reducer",
    "level": "I",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-009",
    "title": "useMemo",
    "objective": "Memoisation, referential equality, and when it is unnecessary",
    "level": "A",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-010",
    "title": "useCallback",
    "objective": "Keep function identity stable for memoised children",
    "level": "A",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-011",
    "title": "useLayoutEffect",
    "objective": "Measure layout before the browser paints",
    "level": "A",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-012",
    "title": "useImperativeHandle",
    "objective": "Expose a custom imperative API through a ref",
    "level": "A",
    "freq": "M",
    "api": "s18"
   },
   {
    "id": "HOOKS-013",
    "title": "useId",
    "objective": "Generate stable, SSR-safe IDs for accessibility",
    "level": "I",
    "freq": "M",
    "api": "s18"
   },
   {
    "id": "HOOKS-014",
    "title": "useTransition",
    "objective": "Mark updates as non-urgent to keep typing responsive",
    "level": "A",
    "freq": "H",
    "api": "s18"
   },
   {
    "id": "HOOKS-015",
    "title": "useDeferredValue",
    "objective": "Defer re-rendering of a slow part of the UI",
    "level": "A",
    "freq": "M",
    "api": "s18"
   },
   {
    "id": "HOOKS-016",
    "title": "useSyncExternalStore",
    "objective": "Subscribe to external stores without tearing",
    "level": "A",
    "freq": "M",
    "api": "s18"
   },
   {
    "id": "HOOKS-017",
    "title": "useInsertionEffect",
    "objective": "Know it exists for CSS-in-JS library authors only",
    "level": "A",
    "freq": "L",
    "api": "s18"
   },
   {
    "id": "HOOKS-018",
    "title": "useActionState",
    "objective": "Manage form Action state, pending flag, and result",
    "level": "A",
    "freq": "M",
    "api": "s19"
   },
   {
    "id": "HOOKS-019",
    "title": "useOptimistic",
    "objective": "Show optimistic UI while an Action runs",
    "level": "A",
    "freq": "M",
    "api": "s19"
   },
   {
    "id": "HOOKS-020",
    "title": "useEffectEvent",
    "objective": "Read the latest values inside effects without re-running them",
    "level": "A",
    "freq": "M",
    "api": "s192"
   },
   {
    "id": "HOOKS-021",
    "title": "What are custom hooks?",
    "objective": "Explain custom hooks as reusable stateful logic",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-022",
    "title": "Creating custom hooks",
    "objective": "Extract logic from a component into a hook",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-023",
    "title": "Reusing logic",
    "objective": "Share logic, not state, across components",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "HOOKS-024",
    "title": "Custom hook naming",
    "objective": "Name hooks useSomething so the lint rules apply",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "HOOKS-025",
    "title": "useFetch",
    "objective": "Build a fetch hook with loading, error, and abort",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-026",
    "title": "useLocalStorage",
    "objective": "Sync state with localStorage safely",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "HOOKS-027",
    "title": "useDebounce",
    "objective": "Debounce a fast-changing value",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "HOOKS-028",
    "title": "useWindowSize",
    "objective": "Track window size with cleanup",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "HOOKS-029",
    "title": "useAuth",
    "objective": "Wrap auth context in a hook",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "HOOKS-030",
    "title": "useForm",
    "objective": "Build a small form-state hook",
    "level": "I",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "RENDER",
  "n": 11,
  "stage": 3,
  "name": "React Rendering and Internals",
  "pre": [
   "HOOKS"
  ],
  "note": "Diagram-heavy module: trigger → render → commit, fiber trees, lanes, and hydration drawn step by step.",
  "lessons": [
   {
    "id": "RENDER-001",
    "title": "React rendering process",
    "objective": "See trigger, render, and commit as three steps",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-002",
    "title": "Triggering a render",
    "objective": "List what causes a render: mount, state, parent render, context",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-003",
    "title": "Render phase",
    "objective": "Know that render must be pure and may run more than once",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-004",
    "title": "Commit phase",
    "objective": "See how React applies changes to the DOM and runs effects",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-005",
    "title": "Reconciliation",
    "objective": "Explain the diffing rules React uses",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-006",
    "title": "Virtual DOM",
    "objective": "Describe the element tree and why comparing it is cheap",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-007",
    "title": "Fiber architecture",
    "objective": "Explain fibers as units of work that can pause and resume",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-008",
    "title": "Component identity",
    "objective": "Know that identity comes from type and position",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-009",
    "title": "Keys and reconciliation",
    "objective": "Use keys to keep or reset component identity",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-010",
    "title": "DOM updates",
    "objective": "See that React touches only changed DOM nodes",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "RENDER-011",
    "title": "State snapshots",
    "objective": "Explain why each render sees fixed state values",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-012",
    "title": "Batching updates",
    "objective": "Trace several setState calls into one render",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-013",
    "title": "Concurrent rendering",
    "objective": "Explain rendering that can be prepared in the background",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-014",
    "title": "Interruptible rendering",
    "objective": "See how urgent updates interrupt slow ones",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "RENDER-015",
    "title": "Strict Mode",
    "objective": "Know why Strict Mode double-invokes renders and effects in development",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-016",
    "title": "Automatic batching",
    "objective": "Compare batching in React 17 with React 18+",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-017",
    "title": "Hydration",
    "objective": "Explain attaching React to server HTML and fixing mismatches",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-018",
    "title": "React scheduling",
    "objective": "Explain lanes and update priorities at a high level",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "RENDER-019",
    "title": "Why components re-render",
    "objective": "Diagnose the four reasons a component re-renders",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "RENDER-020",
    "title": "Preventing unnecessary rendering",
    "objective": "Use state colocation, children-as-props, and memo",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "COMM",
  "n": 12,
  "stage": 2,
  "name": "Component Communication",
  "pre": [
   "HOOKS"
  ],
  "note": "",
  "lessons": [
   {
    "id": "COMM-001",
    "title": "Parent to child communication",
    "objective": "Pass data down with props",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-002",
    "title": "Child to parent communication",
    "objective": "Send data up with callback props",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-003",
    "title": "Sibling communication",
    "objective": "Share data through a common parent",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-004",
    "title": "Props drilling",
    "objective": "Measure drilling pain and decide when to fix it",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-005",
    "title": "Lifting state",
    "objective": "Apply lifting state in a multi-component feature",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-006",
    "title": "Context API",
    "objective": "Provide and consume context (<Context> as provider in React 19)",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-007",
    "title": "Multiple contexts",
    "objective": "Split context by concern: theme, auth, locale",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMM-008",
    "title": "Context performance",
    "objective": "Avoid re-rendering every consumer on each change",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-009",
    "title": "Compound components",
    "objective": "Build Tabs or Accordion APIs with shared implicit state",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMM-010",
    "title": "Controlled vs uncontrolled components",
    "objective": "Design components that support both modes",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "COMM-011",
    "title": "Render props",
    "objective": "Share behaviour through a function prop",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMM-012",
    "title": "Higher-order components",
    "objective": "Wrap components to add behaviour, and know the drawbacks",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "COMM-013",
    "title": "Component composition patterns",
    "objective": "Choose between children, slots, compound components, and hooks",
    "level": "A",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "ROUTE",
  "n": 13,
  "stage": 2,
  "name": "Routing",
  "pre": [
   "HOOKS",
   "COMM"
  ],
  "note": "Uses React Router v7 (package: react-router). Covers its three modes: declarative (BrowserRouter), data (createBrowserRouter + loaders/actions), and framework (Vite plugin). v6 → v7 differences are flagged where they matter.",
  "lessons": [
   {
    "id": "ROUTE-001",
    "title": "What is routing?",
    "objective": "Map URLs to screens",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-002",
    "title": "Why client-side routing?",
    "objective": "Navigate without full reloads while keeping URLs shareable",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-003",
    "title": "React Router introduction",
    "objective": "Know the v7 modes and pick one",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-004",
    "title": "Installation",
    "objective": "Install react-router and set up a router",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ROUTE-005",
    "title": "BrowserRouter",
    "objective": "Use BrowserRouter (declarative) vs createBrowserRouter (data mode)",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-006",
    "title": "Routes and Route",
    "objective": "Define routes and their elements",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-007",
    "title": "Link",
    "objective": "Navigate with Link instead of a plain anchor",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-008",
    "title": "NavLink",
    "objective": "Style the active link",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ROUTE-009",
    "title": "useNavigate",
    "objective": "Navigate from code",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-010",
    "title": "useParams",
    "objective": "Read URL parameters like /users/:id",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-011",
    "title": "useLocation",
    "objective": "Read the current location and its state",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-012",
    "title": "useSearchParams",
    "objective": "Read and update query strings for filters",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-013",
    "title": "Dynamic routes",
    "objective": "Build detail pages from route params",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-014",
    "title": "Nested routes",
    "objective": "Nest child routes with Outlet",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-015",
    "title": "Layout routes",
    "objective": "Share headers and sidebars across pages",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-016",
    "title": "Protected routes",
    "objective": "Guard pages behind login",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-017",
    "title": "Authentication-based routing",
    "objective": "Redirect by auth status and send users back afterwards",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ROUTE-018",
    "title": "Route loaders and actions",
    "objective": "Load data and handle mutations at the route level",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-019",
    "title": "Error boundaries in routing",
    "objective": "Show route-level errors with ErrorBoundary / errorElement",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-020",
    "title": "Lazy-loaded routes",
    "objective": "Split routes into separate chunks with route.lazy",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ROUTE-021",
    "title": "404 pages",
    "objective": "Catch unknown URLs with a splat route",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ROUTE-022",
    "title": "Programmatic navigation",
    "objective": "Redirect after login, submit, or logout",
    "level": "I",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "API",
  "n": 14,
  "stage": 2,
  "name": "API Integration",
  "pre": [
   "HOOKS",
   "EVT"
  ],
  "note": "Module capstone: a complete CRUD app (contacts manager) against a REST API, built up lesson by lesson.",
  "lessons": [
   {
    "id": "API-001",
    "title": "What is an API?",
    "objective": "Explain APIs as contracts between programs",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-002",
    "title": "REST APIs",
    "objective": "Use resources, URLs, and verbs",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-003",
    "title": "HTTP methods",
    "objective": "Pick GET, POST, PUT, PATCH, or DELETE",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-004",
    "title": "Status codes",
    "objective": "Read 2xx, 3xx, 4xx, 5xx and react to each",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-005",
    "title": "JSON",
    "objective": "Send and receive JSON bodies",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-006",
    "title": "Fetch API",
    "objective": "Call APIs with fetch inside React",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-007",
    "title": "Axios",
    "objective": "Use axios instances, defaults, and error objects",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-008",
    "title": "GET requests",
    "objective": "Load lists and detail records",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-009",
    "title": "POST requests",
    "objective": "Create records",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-010",
    "title": "PUT and PATCH",
    "objective": "Replace vs partially update records",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-011",
    "title": "DELETE",
    "objective": "Remove records with confirmation",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "API-012",
    "title": "Async/await",
    "objective": "Write clean async handlers and effects",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-013",
    "title": "Loading states",
    "objective": "Track loading per request",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-014",
    "title": "Error handling",
    "objective": "Handle network, HTTP, and parsing errors",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-015",
    "title": "API authentication",
    "objective": "Send credentials with requests",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-016",
    "title": "Bearer tokens",
    "objective": "Attach Authorization: Bearer headers",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-017",
    "title": "JWT basics",
    "objective": "Read JWT parts and know what the client must not trust",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-018",
    "title": "Refresh tokens",
    "objective": "Renew sessions without forcing a new login",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-019",
    "title": "Environment variables",
    "objective": "Keep API base URLs per environment",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-020",
    "title": "CORS",
    "objective": "Explain preflight requests and fix CORS at the server",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-021",
    "title": "Request interceptors",
    "objective": "Add tokens and headers globally",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-022",
    "title": "Response interceptors",
    "objective": "Handle 401s and errors globally",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-023",
    "title": "Cancellation using AbortController",
    "objective": "Cancel stale requests on unmount or new input",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-024",
    "title": "Pagination",
    "objective": "Build page-based and cursor-based lists",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-025",
    "title": "Search and filtering",
    "objective": "Sync filters with query params and the API",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-026",
    "title": "Debouncing API requests",
    "objective": "Cut requests while the user types",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "API-027",
    "title": "Optimistic updates",
    "objective": "Update the UI first and roll back on failure",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-028",
    "title": "Retry strategies",
    "objective": "Retry with exponential backoff, only when safe",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-029",
    "title": "API caching",
    "objective": "Avoid refetching unchanged data",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "API-030",
    "title": "Race condition handling",
    "objective": "Make sure only the latest response wins",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "STORE",
  "n": 15,
  "stage": 2,
  "name": "State Management Libraries",
  "pre": [
   "API",
   "COMM"
  ],
  "note": "Decision guide: local state → lift it → Context for rarely-changing values → TanStack Query for server data → Zustand or Redux Toolkit for large shared client state.",
  "lessons": [
   {
    "id": "STORE-001",
    "title": "State management fundamentals",
    "objective": "Classify state: local, shared, server, URL, form",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-002",
    "title": "Context API",
    "objective": "Use context as dependency injection, not as a fast store",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-003",
    "title": "Redux introduction",
    "objective": "Know what problem Redux solves and what it costs",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-004",
    "title": "Redux architecture",
    "objective": "Trace action → reducer → store → UI",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-005",
    "title": "Store",
    "objective": "Create a single store",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-006",
    "title": "Actions",
    "objective": "Describe events as plain objects",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-007",
    "title": "Reducers",
    "objective": "Write pure reducers",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-008",
    "title": "Dispatch",
    "objective": "Send actions to the store",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-009",
    "title": "Selectors",
    "objective": "Read derived data efficiently",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-010",
    "title": "Redux Toolkit",
    "objective": "Use RTK as the standard way to write Redux",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-011",
    "title": "createSlice",
    "objective": "Generate actions and reducers with Immer",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-012",
    "title": "configureStore",
    "objective": "Set up a store with good defaults",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-013",
    "title": "useSelector",
    "objective": "Subscribe components to store slices",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-014",
    "title": "useDispatch",
    "objective": "Dispatch from components",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-015",
    "title": "createAsyncThunk",
    "objective": "Handle async logic in Redux",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-016",
    "title": "RTK Query",
    "objective": "Fetch and cache server data with Redux",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STORE-017",
    "title": "Zustand",
    "objective": "Build a small store with a hook API",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-018",
    "title": "Jotai",
    "objective": "Use atomic state for fine-grained updates",
    "level": "A",
    "freq": "L",
    "api": ""
   },
   {
    "id": "STORE-019",
    "title": "Recoil overview",
    "objective": "Recognise Recoil in older code (project archived in 2025)",
    "level": "A",
    "freq": "L",
    "api": "leg"
   },
   {
    "id": "STORE-020",
    "title": "TanStack Query",
    "objective": "Fetch, cache, and sync server state",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-021",
    "title": "Server state vs client state",
    "objective": "Separate cached API data from UI state",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STORE-022",
    "title": "Caching and invalidation",
    "objective": "Invalidate queries after mutations",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "STYLE",
  "n": 16,
  "stage": 2,
  "name": "Styling in React",
  "pre": [
   "COMP",
   "PROPS"
  ],
  "note": "",
  "lessons": [
   {
    "id": "STYLE-001",
    "title": "CSS in React",
    "objective": "Survey styling options and their trade-offs",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-002",
    "title": "External stylesheets",
    "objective": "Import global CSS files",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "STYLE-003",
    "title": "CSS modules",
    "objective": "Scope class names per component",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STYLE-004",
    "title": "Inline styling",
    "objective": "Use style objects for dynamic values",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-005",
    "title": "CSS-in-JS",
    "objective": "Know runtime vs zero-runtime CSS-in-JS",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-006",
    "title": "Styled Components",
    "objective": "Read and write styled-components (in maintenance mode since 2025)",
    "level": "I",
    "freq": "L",
    "api": "leg"
   },
   {
    "id": "STYLE-007",
    "title": "Emotion",
    "objective": "Use the css prop and styled API",
    "level": "I",
    "freq": "L",
    "api": ""
   },
   {
    "id": "STYLE-008",
    "title": "Tailwind CSS",
    "objective": "Style with utility classes using Tailwind v4 and its Vite plugin",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "STYLE-009",
    "title": "Bootstrap",
    "objective": "Use Bootstrap or React-Bootstrap in existing apps",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "STYLE-010",
    "title": "Conditional styling",
    "objective": "Toggle classes from state",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-011",
    "title": "Dynamic classes",
    "objective": "Compose class names with clsx",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-012",
    "title": "Responsive components",
    "objective": "Adapt with breakpoints and container queries",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-013",
    "title": "Theme management",
    "objective": "Share theme tokens through CSS variables and context",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-014",
    "title": "Dark mode",
    "objective": "Support system preference plus a manual toggle",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-015",
    "title": "Design systems",
    "objective": "Know tokens, primitives, and libraries such as shadcn/ui and MUI",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "STYLE-016",
    "title": "Component styling architecture",
    "objective": "Pick a styling strategy for a large codebase",
    "level": "A",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "ADV",
  "n": 17,
  "stage": 3,
  "name": "Advanced React Concepts",
  "pre": [
   "HOOKS",
   "RENDER"
  ],
  "note": "Three worlds kept apart: (1) client-only React with Vite, (2) framework server rendering (Next.js, React Router framework mode), (3) React Server Components, which need a framework or bundler that supports them.",
  "lessons": [
   {
    "id": "ADV-001",
    "title": "React.memo",
    "objective": "Skip re-renders when props are equal",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ADV-002",
    "title": "Lazy loading",
    "objective": "Load components on demand with React.lazy",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ADV-003",
    "title": "Suspense",
    "objective": "Show fallbacks while code or data loads",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ADV-004",
    "title": "Error boundaries",
    "objective": "Catch render errors with a class boundary or react-error-boundary",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ADV-005",
    "title": "Portals",
    "objective": "Render modals and tooltips outside the parent DOM node",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-006",
    "title": "Fragments",
    "objective": "Use keyed fragments in lists",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ADV-007",
    "title": "Forwarding refs and modern ref patterns",
    "objective": "Pass ref as a normal prop in React 19; read forwardRef in older code",
    "level": "A",
    "freq": "H",
    "api": "s19"
   },
   {
    "id": "ADV-008",
    "title": "Higher-order components",
    "objective": "Compare HOCs with hooks in modern code",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-009",
    "title": "Render props",
    "objective": "Recognise render props in libraries",
    "level": "A",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ADV-010",
    "title": "Compound components",
    "objective": "Build an accessible Tabs component",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-011",
    "title": "Controlled component patterns",
    "objective": "Build value / onChange component APIs",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-012",
    "title": "Uncontrolled component patterns",
    "objective": "Build defaultValue APIs with internal state",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-013",
    "title": "Code splitting",
    "objective": "Split bundles by route and feature",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ADV-014",
    "title": "Dynamic imports",
    "objective": "Use import() for on-demand modules",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-015",
    "title": "React Server Components",
    "objective": "Explain components that run only on the server",
    "level": "A",
    "freq": "H",
    "api": "s19"
   },
   {
    "id": "ADV-016",
    "title": "Client Components",
    "objective": "Mark interactive parts with 'use client'",
    "level": "A",
    "freq": "H",
    "api": "s19"
   },
   {
    "id": "ADV-017",
    "title": "Server Functions and Actions",
    "objective": "Call server code from forms with 'use server'",
    "level": "A",
    "freq": "M",
    "api": "s19"
   },
   {
    "id": "ADV-018",
    "title": "Streaming SSR",
    "objective": "Send HTML in chunks with Suspense boundaries",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-019",
    "title": "Hydration",
    "objective": "Fix hydration mismatches; understand selective hydration",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "ADV-020",
    "title": "Progressive enhancement",
    "objective": "Make forms work before JavaScript loads",
    "level": "A",
    "freq": "L",
    "api": ""
   },
   {
    "id": "ADV-021",
    "title": "React Compiler",
    "objective": "Know what React Compiler 1.0 does and how to enable it in Vite",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "ADV-022",
    "title": "Compiler-driven memoization",
    "objective": "Decide when manual useMemo and useCallback are still needed",
    "level": "A",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "PERF",
  "n": 18,
  "stage": 3,
  "name": "Performance Optimization",
  "pre": [
   "RENDER",
   "ADV"
  ],
  "note": "Every lesson has a before/after with a measured number (render count, ms in Profiler, KB of bundle, or a Web Vitals score).",
  "lessons": [
   {
    "id": "PERF-001",
    "title": "Understanding performance",
    "objective": "Define load, runtime, and perceived performance",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-002",
    "title": "React Profiler",
    "objective": "Record and read flame graphs",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-003",
    "title": "Identifying unnecessary renders",
    "objective": "Find wasted renders with the Profiler and render highlights",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-004",
    "title": "React.memo",
    "objective": "Measure the before/after impact of memo",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-005",
    "title": "useMemo",
    "objective": "Measure what a cached calculation saves",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-006",
    "title": "useCallback",
    "objective": "Stabilise callbacks for memoised lists",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-007",
    "title": "Virtualization",
    "objective": "Render 10,000 rows smoothly with TanStack Virtual",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-008",
    "title": "List optimization",
    "objective": "Optimise keys, row components, and pagination",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-009",
    "title": "Lazy loading",
    "objective": "Defer below-the-fold components and images",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-010",
    "title": "Code splitting",
    "objective": "Cut initial bundle size by route",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-011",
    "title": "Bundle optimization",
    "objective": "Analyse bundles and remove heavy dependencies",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-012",
    "title": "Image optimization",
    "objective": "Use modern formats, sizes, and lazy loading",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-013",
    "title": "Debouncing",
    "objective": "Debounce input-driven work",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-014",
    "title": "Throttling",
    "objective": "Throttle scroll and resize handlers",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-015",
    "title": "Network optimization",
    "objective": "Cut requests with caching, prefetching, and compression",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-016",
    "title": "Caching",
    "objective": "Cache at HTTP, query, and memo levels",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-017",
    "title": "Avoiding expensive calculations",
    "objective": "Move heavy work out of render or into a Web Worker",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-018",
    "title": "Optimizing context",
    "objective": "Split and memoise context values",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PERF-019",
    "title": "React Compiler",
    "objective": "Measure the compiler's effect on a real app",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PERF-020",
    "title": "Core Web Vitals",
    "objective": "Improve LCP, INP, and CLS",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "AUTH",
  "n": 19,
  "stage": 3,
  "name": "Authentication and Authorization",
  "pre": [
   "ROUTE",
   "API"
  ],
  "note": "",
  "lessons": [
   {
    "id": "AUTH-001",
    "title": "Authentication vs authorization",
    "objective": "Separate who you are from what you may do",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-002",
    "title": "Login flow",
    "objective": "Build login with validation and error states",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-003",
    "title": "Registration flow",
    "objective": "Build sign-up with confirmation",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "AUTH-004",
    "title": "JWT authentication",
    "objective": "Implement JWT login end to end",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-005",
    "title": "Token storage",
    "objective": "Compare memory, localStorage, and httpOnly cookies",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-006",
    "title": "Protected routes",
    "objective": "Guard routes using auth state",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-007",
    "title": "Role-based access control",
    "objective": "Show and hide features by role",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-008",
    "title": "Permission-based access",
    "objective": "Check fine-grained permissions",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "AUTH-009",
    "title": "Logout",
    "objective": "Clear tokens, caches, and state",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "AUTH-010",
    "title": "Refresh token flow",
    "objective": "Rotate tokens silently with interceptors",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-011",
    "title": "Auth context",
    "objective": "Provide the user and auth actions app-wide",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-012",
    "title": "Auth custom hooks",
    "objective": "Build useAuth and useRequireRole",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "AUTH-013",
    "title": "Secure API integration",
    "objective": "Send credentials safely and never trust the client",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-014",
    "title": "XSS and CSRF considerations",
    "objective": "Know how each threat affects token choices",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "AUTH-015",
    "title": "Common authentication vulnerabilities",
    "objective": "Avoid the usual auth mistakes in SPAs",
    "level": "A",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "TEST",
  "n": 20,
  "stage": 3,
  "name": "Testing React Applications",
  "pre": [
   "HOOKS",
   "API"
  ],
  "note": "Stack: Vitest + React Testing Library + user-event + MSW for unit and integration; Playwright for end-to-end. Jest and Cypress taught for existing codebases.",
  "lessons": [
   {
    "id": "TEST-001",
    "title": "Why testing?",
    "objective": "Explain the cost of bugs and the testing trophy",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-002",
    "title": "Unit testing",
    "objective": "Test small functions and components in isolation",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-003",
    "title": "Integration testing",
    "objective": "Test components working together",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-004",
    "title": "End-to-end testing",
    "objective": "Test full user flows in a real browser",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-005",
    "title": "Jest",
    "objective": "Read and maintain Jest suites",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-006",
    "title": "Vitest",
    "objective": "Set up Vitest with Vite and jsdom",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-007",
    "title": "React Testing Library",
    "objective": "Query by role and test like a user",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-008",
    "title": "Rendering components in tests",
    "objective": "Render with providers and routers",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-009",
    "title": "Testing props",
    "objective": "Assert output for different props",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-010",
    "title": "Testing state",
    "objective": "Assert the UI after state changes",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-011",
    "title": "Testing events",
    "objective": "Simulate users with user-event",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-012",
    "title": "Testing hooks",
    "objective": "Test custom hooks with renderHook",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-013",
    "title": "Mocking APIs",
    "objective": "Mock network calls with MSW",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-014",
    "title": "Async testing",
    "objective": "Use findBy and waitFor correctly",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TEST-015",
    "title": "Playwright",
    "objective": "Write cross-browser end-to-end tests",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-016",
    "title": "Cypress",
    "objective": "Read and write Cypress tests",
    "level": "A",
    "freq": "L",
    "api": ""
   },
   {
    "id": "TEST-017",
    "title": "Test coverage",
    "objective": "Measure coverage without chasing 100%",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TEST-018",
    "title": "Best practices",
    "objective": "Write tests that survive refactors",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "TS",
  "n": 21,
  "stage": 2,
  "name": "TypeScript with React",
  "pre": [
   "HOOKS"
  ],
  "note": "",
  "lessons": [
   {
    "id": "TS-001",
    "title": "TypeScript introduction",
    "objective": "Set up a React + TypeScript project with Vite",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-002",
    "title": "Why TypeScript?",
    "objective": "See bugs TypeScript catches before runtime",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-003",
    "title": "Type annotations",
    "objective": "Annotate variables, parameters, and returns",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-004",
    "title": "Interfaces",
    "objective": "Describe object shapes",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-005",
    "title": "Types",
    "objective": "Use type aliases and know interface vs type",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-006",
    "title": "Union types",
    "objective": "Model variants and narrow them",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-007",
    "title": "Generics",
    "objective": "Write reusable typed functions",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-008",
    "title": "Props typing",
    "objective": "Type component props",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-009",
    "title": "State typing",
    "objective": "Type useState, including null and unions",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-010",
    "title": "Event typing",
    "objective": "Type change, click, and submit events",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-011",
    "title": "Form typing",
    "objective": "Type form values and validation errors",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-012",
    "title": "API response typing",
    "objective": "Type fetch results and validate them with Zod",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-013",
    "title": "Component typing",
    "objective": "Know why React.FC is optional and what to use instead",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-014",
    "title": "Children typing",
    "objective": "Use React.ReactNode for children",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-015",
    "title": "Custom hook typing",
    "objective": "Type hook inputs and returned tuples",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-016",
    "title": "Context typing",
    "objective": "Type context with safe defaults",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-017",
    "title": "Reducer typing",
    "objective": "Use discriminated unions for actions",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-018",
    "title": "Generic components",
    "objective": "Build a typed generic Table or Select",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "TS-019",
    "title": "Utility types",
    "objective": "Use Partial, Pick, Omit, Record, and ComponentProps",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "TS-020",
    "title": "TypeScript best practices",
    "objective": "Turn on strict mode and avoid any",
    "level": "A",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "SEC",
  "n": 22,
  "stage": 3,
  "name": "React Security",
  "pre": [
   "AUTH"
  ],
  "note": "",
  "lessons": [
   {
    "id": "SEC-001",
    "title": "XSS",
    "objective": "Explain how React escapes output and where XSS still gets in",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-002",
    "title": "CSRF",
    "objective": "Explain CSRF and SameSite cookies",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-003",
    "title": "Unsafe HTML rendering",
    "objective": "Spot unsafe sinks such as javascript: URLs and innerHTML",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-004",
    "title": "dangerouslySetInnerHTML",
    "objective": "Sanitise HTML with DOMPurify before rendering it",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-005",
    "title": "Input validation",
    "objective": "Validate on the client for UX and on the server for security",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-006",
    "title": "Output encoding",
    "objective": "Encode for HTML, URL, and attribute contexts",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "SEC-007",
    "title": "Secure authentication",
    "objective": "Apply secure session patterns",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-008",
    "title": "Token handling",
    "objective": "Limit token exposure and lifetime",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-009",
    "title": "Dependency vulnerabilities",
    "objective": "Audit and update dependencies",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "SEC-010",
    "title": "Environment variables",
    "objective": "Know that every VITE_ variable ships to the browser",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "SEC-011",
    "title": "API security",
    "objective": "Rely on server-side authorisation and rate limits",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "SEC-012",
    "title": "Content Security Policy",
    "objective": "Write a CSP that blocks injected scripts",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "SEC-013",
    "title": "Common React security mistakes",
    "objective": "Fix the frequent security bugs in React code",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "NEXT",
  "n": 23,
  "stage": 3,
  "name": "Next.js and React Ecosystem",
  "pre": [
   "ADV",
   "ROUTE"
  ],
  "note": "Next.js App Router (current major is v16). Next.js-only features are labelled so they are not confused with core React.",
  "lessons": [
   {
    "id": "NEXT-001",
    "title": "What is Next.js?",
    "objective": "Explain Next.js as a full-stack React framework",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-002",
    "title": "React vs Next.js",
    "objective": "Compare library and framework responsibilities",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-003",
    "title": "File-based routing",
    "objective": "Create routes from folders",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-004",
    "title": "App Router",
    "objective": "Use layout, page, loading, and error files",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-005",
    "title": "Server Components",
    "objective": "Fetch data inside server components",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-006",
    "title": "Client Components",
    "objective": "Add interactivity with 'use client'",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-007",
    "title": "Server-side rendering",
    "objective": "Render per request",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-008",
    "title": "Static rendering",
    "objective": "Pre-render at build time",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-009",
    "title": "Dynamic rendering",
    "objective": "Know what makes a route dynamic",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-010",
    "title": "Streaming",
    "objective": "Stream UI with loading.js and Suspense",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-011",
    "title": "Data fetching",
    "objective": "Fetch, cache, and revalidate data",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-012",
    "title": "Server Actions",
    "objective": "Change data from forms",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "NEXT-013",
    "title": "Metadata",
    "objective": "Set page titles and Open Graph tags",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-014",
    "title": "Image optimization",
    "objective": "Use next/image",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-015",
    "title": "Route handlers",
    "objective": "Build API endpoints in route.ts",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-016",
    "title": "Middleware",
    "objective": "Run code before requests (renamed proxy in Next.js 16)",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-017",
    "title": "Deployment",
    "objective": "Deploy to Vercel or self-host with Node or Docker",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "NEXT-018",
    "title": "When to use React alone vs Next.js",
    "objective": "Pick the right tool for a project",
    "level": "I",
    "freq": "H",
    "api": ""
   }
  ]
 },
 {
  "code": "PROD",
  "n": 24,
  "stage": 4,
  "name": "Production and Deployment",
  "pre": [
   "TEST",
   "PERF"
  ],
  "note": "",
  "lessons": [
   {
    "id": "PROD-001",
    "title": "Production builds",
    "objective": "Build, preview, and verify a release",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROD-002",
    "title": "Environment configuration",
    "objective": "Manage dev, staging, and production config",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-003",
    "title": "Build optimization",
    "objective": "Tune Vite build output",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-004",
    "title": "Hosting",
    "objective": "Compare static, server, and edge hosting",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-005",
    "title": "Vercel",
    "objective": "Deploy a Vite app to Vercel",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-006",
    "title": "Netlify",
    "objective": "Deploy with SPA redirects",
    "level": "B",
    "freq": "L",
    "api": ""
   },
   {
    "id": "PROD-007",
    "title": "Static hosting",
    "objective": "Host on GitHub Pages or S3 with an SPA fallback",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-008",
    "title": "Nginx",
    "objective": "Serve an SPA with try_files and cache headers",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-009",
    "title": "Docker basics",
    "objective": "Containerise a React build with a multi-stage Dockerfile",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-010",
    "title": "CI/CD",
    "objective": "Automate lint, test, build, and deploy",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROD-011",
    "title": "GitHub Actions",
    "objective": "Write a workflow that tests and deploys",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROD-012",
    "title": "Error monitoring",
    "objective": "Capture production errors with Sentry",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-013",
    "title": "Logging",
    "objective": "Log useful client events without leaking data",
    "level": "I",
    "freq": "L",
    "api": ""
   },
   {
    "id": "PROD-014",
    "title": "Analytics",
    "objective": "Track usage with privacy in mind",
    "level": "I",
    "freq": "L",
    "api": ""
   },
   {
    "id": "PROD-015",
    "title": "SEO",
    "objective": "Improve discoverability of SPA and SSR apps",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROD-016",
    "title": "Accessibility",
    "objective": "Meet WCAG basics: roles, labels, focus, contrast",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROD-017",
    "title": "Production debugging",
    "objective": "Debug with source maps and repro steps",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROD-018",
    "title": "Application maintenance",
    "objective": "Upgrade React and dependencies safely",
    "level": "A",
    "freq": "M",
    "api": ""
   }
  ]
 },
 {
  "code": "PROJ",
  "n": 25,
  "stage": 4,
  "name": "Real-World Projects",
  "pre": [
   "see each project"
  ],
  "note": "Projects are spread across stages (see the stage column); this module collects them. Each has requirements, architecture, folders, component tree, data flow, full code, tests, deployment, and interview questions.",
  "lessons": [
   {
    "id": "PROJ-001",
    "title": "Counter application",
    "objective": "State, events, and conditional styling",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-002",
    "title": "Todo application",
    "objective": "Array state, keys, filters, and localStorage",
    "level": "B",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-003",
    "title": "Calculator",
    "objective": "Keyboard events and a reducer-based state machine",
    "level": "B",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-004",
    "title": "Weather application",
    "objective": "Fetch, loading and error states, debounced search",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-005",
    "title": "Expense tracker",
    "objective": "Forms, derived totals, and charts",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-006",
    "title": "Notes application",
    "objective": "Routing, search, and persistence",
    "level": "I",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-007",
    "title": "Product listing and filtering",
    "objective": "URL filters, sorting, and pagination",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-008",
    "title": "Shopping cart",
    "objective": "Context + useReducer and price totals",
    "level": "I",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-009",
    "title": "E-commerce application",
    "objective": "Router, TanStack Query, cart, and checkout",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-010",
    "title": "Authentication dashboard",
    "objective": "JWT, refresh tokens, protected routes",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-011",
    "title": "Employee management system",
    "objective": "CRUD tables, forms, and role-based access",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-012",
    "title": "Admin dashboard",
    "objective": "Charts, virtualised tables, and theming",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-013",
    "title": "Blog application",
    "objective": "Next.js, static and dynamic rendering, metadata",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-014",
    "title": "Real-time chat application",
    "objective": "WebSockets, optimistic UI, presence",
    "level": "A",
    "freq": "H",
    "api": ""
   },
   {
    "id": "PROJ-015",
    "title": "Kanban task management system",
    "objective": "Drag and drop, reducers, persistence",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-016",
    "title": "Job portal",
    "objective": "Search, filters, roles, and applications",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-017",
    "title": "Social media application",
    "objective": "Infinite feed, uploads, and notifications",
    "level": "A",
    "freq": "M",
    "api": ""
   },
   {
    "id": "PROJ-018",
    "title": "Full-stack enterprise management system",
    "objective": "TypeScript, Next.js, auth, RBAC, tests, CI/CD",
    "level": "A",
    "freq": "H",
    "api": ""
   }
  ]
 }
];
export const PROJ_STAGE = [1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4];
export const PROJ_AFTER = ["STATE","STATE","STATE","API","EVT","ROUTE","ROUTE","STORE","STORE","AUTH","AUTH","PERF","NEXT","ADV","STORE","AUTH","PERF","PROD"];
export const STAGES = [
 {
  "n": 1,
  "name": "Foundation",
  "sub": "Web basics to state",
  "obj": [
   "Explain how a browser loads and renders a page",
   "Write modern JavaScript fluently: closures, array methods, async",
   "Set up a Vite project and debug it",
   "Build UIs from components, props, and state"
  ],
  "check": [
   "Comfortable with HTML and CSS basics",
   "Can write a JS function and loop (else start at WEB-011)"
  ],
  "assign": [
   "Rebuild a static landing page in React components",
   "Product grid from a JSON array with props",
   "Counter and todo with immutable updates"
  ],
  "project": "PROJ-002 Todo application (plus PROJ-001 and PROJ-003 warm-ups)",
  "assess": "30 questions (JS output, JSX fixes, props vs state) + build a filterable list in 45 minutes"
 },
 {
  "n": 2,
  "name": "Professional React",
  "sub": "Hooks, routing, data, TypeScript",
  "obj": [
   "Use every core hook correctly, especially useEffect",
   "Build multi-page apps with React Router 7",
   "Integrate REST APIs with loading, errors, and cancellation",
   "Choose between Context, Zustand, Redux Toolkit, and TanStack Query",
   "Type React code with TypeScript"
  ],
  "check": [
   "Stage 1 assessment ≥ 70%",
   "Can explain closures and promises without notes"
  ],
  "assign": [
   "Five custom hooks with tests",
   "Multi-page notes app with nested routes",
   "Contacts CRUD against a REST API"
  ],
  "project": "PROJ-008 Shopping cart and PROJ-007 Product listing (TypeScript)",
  "assess": "40 questions (hooks output, effect debugging, routing) + a timed CRUD feature"
 },
 {
  "n": 3,
  "name": "Advanced Engineering",
  "sub": "Internals, performance, testing, security, Next.js",
  "obj": [
   "Explain render/commit, fiber, and reconciliation with diagrams",
   "Profile and fix slow renders with measured results",
   "Test with Vitest, RTL, MSW, and Playwright",
   "Secure auth flows and HTML rendering",
   "Build with Server Components and Next.js"
  ],
  "check": [
   "Stage 2 project complete and typed",
   "Comfortable with useEffect cleanup and race conditions"
  ],
  "assign": [
   "Profile and speed up a 10,000-row table",
   "Reach 80% meaningful test coverage on the cart",
   "Security review of an auth dashboard"
  ],
  "project": "PROJ-009 E-commerce application",
  "assess": "50 questions (internals, performance scenarios, security) + a 60-minute performance debug task"
 },
 {
  "n": 4,
  "name": "Industry Readiness",
  "sub": "Deploy, architect, interview",
  "obj": [
   "Ship with CI/CD, monitoring, and accessibility checks",
   "Architect a large app: folders, state, data, auth",
   "Explain project decisions in interviews",
   "Clear React interview rounds: concepts, coding, system design"
  ],
  "check": [
   "Stage 3 assessment ≥ 70%",
   "At least one deployed project"
  ],
  "assign": [
   "GitHub Actions pipeline with tests and preview deploys",
   "Write an architecture decision record for your enterprise app",
   "Three mock interviews using the -REV lessons"
  ],
  "project": "PROJ-018 Full-stack enterprise management system",
  "assess": "Full mock interview: 45-min concepts, 60-min live coding, 30-min frontend system design"
 }
];
export const WEEKS = [
 {
  "w": "Week 1",
  "t": "JavaScript that interviewers test",
  "items": [
   "WEB-018 → WEB-024 scope, hoisting, closures, array methods",
   "WEB-028 → WEB-033 promises and the event loop",
   "Daily: 10 output-based questions"
  ]
 },
 {
  "w": "Week 2",
  "t": "React core",
  "items": [
   "JSX, COMP, PROPS, STATE -REV lessons",
   "Props vs state, keys, batching, derived state",
   "Coding: todo, counter, filterable list under 30 min each"
  ]
 },
 {
  "w": "Week 3",
  "t": "Hooks deep dive",
  "items": [
   "HOOKS-004 → HOOKS-020 -REV",
   "useEffect scenarios: loops, stale closures, races",
   "Write useFetch, useDebounce, useLocalStorage from memory"
  ]
 },
 {
  "w": "Week 4",
  "t": "Rendering and performance",
  "items": [
   "RENDER and PERF -REV lessons",
   "Why did this re-render? debugging drills",
   "useMemo vs useCallback vs React.memo vs Compiler"
  ]
 },
 {
  "w": "Week 5",
  "t": "Ecosystem",
  "items": [
   "ROUTE, API, STORE, AUTH -REV",
   "Context vs Redux vs Zustand vs TanStack Query",
   "CSR vs SSR vs SSG vs RSC; React vs Next.js"
  ]
 },
 {
  "w": "Week 6",
  "t": "Mock interviews and system design",
  "items": [
   "Frontend system design: feed, dashboard, chat",
   "Walk through two of your projects using their interview questions",
   "Two full mock interviews, then review weak IDs"
  ]
 }
];
export const CHECKLIST = ["Requirements","Architecture","Folder structure","Component tree","Data flow","Full code","API integration","Error handling","Responsive UI","Testing","Deployment","Interview questions"];
