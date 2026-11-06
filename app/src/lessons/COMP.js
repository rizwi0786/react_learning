export default {
  "COMP-001": {
    tldr: "A component is a JavaScript function that returns UI (JSX). You write it once, then use it like a custom HTML tag: `<ProductCard />`.",
    analogy: { icon: "🧱", text: "LEGO bricks for a screen. Each brick (component) is a small, self-contained piece; you snap bricks together to build a whole shop page." },
    visual: { type: "flow", title: "From function to pixels", steps: [
      { label: "Write a function", detail: "`function Greeting() { ... }` with a **capital** first letter." },
      { label: "Return JSX", detail: "It returns a description of the UI: `<h1>Hi!</h1>`." },
      { label: "Use it as a tag", detail: "Another component renders `<Greeting />`." },
      { label: "React calls it", detail: "React runs `Greeting()` and gets the JSX back." },
      { label: "Screen updates", detail: "React turns that JSX into real DOM nodes." }
    ]},
    points: [
      "A component = a **function that returns JSX** (or `null` for nothing).",
      "Name it in **PascalCase** so React knows it's a component, not an HTML tag.",
      "Use it like a tag: `<Greeting />`. Never call it yourself as `Greeting()`.",
      "A React app is just components inside components, starting from `App`.",
      "Components can also hold memory (state) and receive inputs (props); later modules cover both."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function Greeting() {
  return <h1>Welcome to the shop!</h1>;
}

function SaleBanner() {
  return <p>🔥 20% off all mugs today</p>;
}

export default function App() {
  return (
    <main>
      <Greeting />
      <SaleBanner />
      <SaleBanner />
    </main>
  );
}`, walk: [
      { lines: [1, 2, 3], note: "A component is just a function. It returns JSX describing a heading." },
      { lines: [5, 6, 7], note: "A second small component for the sale banner." },
      { lines: [9], note: "`App` is the top (root) component. Vite's `main.jsx` renders it." },
      { lines: [12, 13, 14], note: "Use components like tags. `SaleBanner` is written once, used twice." }
    ]},
    output: "A heading “Welcome to the shop!” followed by the sale banner shown twice.",
    mistakes: [
      { bad: `function greeting() {\n  return <h1>Hi</h1>;\n}\n<greeting />`, good: `function Greeting() {\n  return <h1>Hi</h1>;\n}\n<Greeting />`, why: "Lowercase tags are treated as HTML elements. `<greeting />` renders an unknown HTML tag, not your component." },
      { bad: `function Banner() {\n  <p>Sale!</p>;\n}`, good: `function Banner() {\n  return <p>Sale!</p>;\n}`, why: "Without `return`, the function returns `undefined` and nothing shows up." }
    ],
    practice: [
      { level: "B", q: "Write a `Footer` component that shows “© 2026 Mug Shop” and render it in `App`.", a: "Define `function Footer()` returning a `<footer>`, then add `<Footer />` inside `App`.", code: `function Footer() {\n  return <footer>© 2026 Mug Shop</footer>;\n}` },
      { level: "B", q: "Make a `WeatherIcon` component that returns ☀️ and use it three times.", a: "Write it once, render `<WeatherIcon />` three times." },
      { level: "I", q: "Can a component return nothing? How?", a: "Yes, return `null`. React renders nothing for that spot." },
      { level: "C", q: "Why should you write `<Greeting />` and not `{Greeting()}`?", a: "As a tag, React manages it as its own component (own hooks, own place in the tree). Calling it directly just inlines its JSX into the parent and breaks hooks rules." }
    ],
    quiz: [
      { q: "What is a React component?", options: ["An HTML file", "A function that returns UI (JSX)", "A CSS class", "A special React object you must register"], answer: 1, why: "Modern components are plain functions that return JSX." },
      { q: "Why must `ProductCard` start with a capital letter?", options: ["It's only a style preference", "Lowercase tags are treated as HTML elements", "Vite requires it", "To make it faster"], answer: 1, why: "JSX treats `<productCard>` as a DOM tag; capitalised names are components." },
      { q: "What does a component return to show nothing?", options: ["`undefined`", "`false` only", "`null`", "An empty string is required"], answer: 2, why: "Returning `null` is the clear, standard way to render nothing." }
    ],
    rev: {
      sec30: "A component is a function that returns JSX. Name it in PascalCase and use it as a tag (`<Cart />`). React calls it for you and turns the JSX into DOM. Apps are trees of components starting at `App`. Components can take props and hold state.",
      interview: [
        { level: "basic", q: "What is a component in React?", a: "A reusable, self-contained piece of UI. In modern React it's a function that takes props and returns JSX." },
        { level: "basic", q: "Why must component names be capitalised?", a: "JSX uses the first letter to decide: lowercase is an HTML tag string, capitalised is a variable reference to a component." },
        { level: "intermediate", q: "What can a component return?", a: "JSX, `null`, strings, numbers, arrays of elements or fragments. Not plain objects, and not `undefined` by mistake." },
        { level: "tricky", q: "Is `{Card()}` the same as `<Card />`?", a: "No. `<Card />` creates an element React renders as its own component with its own hooks. `Card()` just runs the function inside the parent, so its hooks belong to the parent." }
      ],
      predict: [
        { code: `function hello() {\n  return <b>Hi</b>;\n}\nexport default function App() {\n  return <hello />;\n}`, answer: "Nothing visible; React renders an unknown `<hello>` HTML tag and warns in the console.", why: "Lowercase JSX tags are HTML element names, not components." }
      ],
      cheat: [
        "Component = function that returns JSX",
        "PascalCase name: `ProductCard`, not `productCard`",
        "Use as a tag: `<ProductCard />`; don't call it as a function",
        "Return `null` to render nothing",
        "Every app is a tree of components rooted at `App`"
      ]
    },
    related: ["COMP-003", "COMP-005", "JSX-001", "PROPS-001"]
  },

  "COMP-002": {
    tldr: "Splitting the UI into components lets you **reuse** pieces, keep each piece **isolated** (a bug stays in one place), and let a **team** work on different parts at the same time.",
    analogy: { icon: "🍱", text: "A bento box vs one big pot of stew. Each compartment (component) holds one thing; you can swap the rice without touching the sushi." },
    visual: { type: "compare", title: "One big page vs components", left: { label: "One giant file", tone: "bad", points: [
      "2,000 lines of mixed markup and logic",
      "Same product card copied 5 times",
      "A change in one place breaks another",
      "Two devs edit the same file and clash"
    ]}, right: { label: "Component-based", tone: "good", points: [
      "Small files: `Header`, `ProductCard`, `Cart`",
      "Write `ProductCard` once, reuse everywhere",
      "Each piece is isolated and easy to test",
      "Devs own different components in parallel"
    ]}},
    points: [
      "**Reuse**: build a `ProductCard` once and use it on the home, search and wishlist pages.",
      "**Isolation**: each component owns its markup, logic and state; bugs stay local.",
      "**Team scale**: people work on separate components with fewer merge conflicts.",
      "**Testing**: small components are easy to render and check one at a time.",
      "Like splitting a big C# class into focused classes: same idea, applied to UI."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function Header() {
  return <header>☕ Mug Shop</header>;
}

function ProductCard() {
  return (
    <article className="card">
      <h3>Blue Mug</h3>
      <p>£8</p>
    </article>
  );
}

function Cart() {
  return <aside>🛒 0 items</aside>;
}

export default function App() {
  return (
    <>
      <Header />
      <ProductCard />
      <ProductCard />
      <Cart />
    </>
  );
}`, walk: [
      { lines: [1, 2, 3], note: "`Header` only knows about the header. Change it without touching anything else." },
      { lines: [5, 6, 7, 8, 9, 10, 11, 12], note: "`ProductCard` is a self-contained unit, ready to reuse (props will make each card different)." },
      { lines: [14, 15, 16], note: "`Cart` is isolated too; a teammate could own this file." },
      { lines: [21, 22, 23, 24], note: "`App` just assembles the pieces. Reading it tells you the page layout at a glance." }
    ]},
    output: "A header, two product cards and a cart summary.",
    mistakes: [
      { bad: `// copy-pasted card markup 5 times\n<article><h3>Blue Mug</h3>...</article>\n<article><h3>Red Mug</h3>...</article>`, good: `<ProductCard name="Blue Mug" />\n<ProductCard name="Red Mug" />`, why: "Copy-paste means a design change must be made in 5 places. One component plus props changes everywhere at once." }
    ],
    practice: [
      { level: "B", q: "Look at a news site. Name 4 components you'd split it into.", a: "e.g. `NavBar`, `ArticleCard`, `Sidebar`, `Footer`." },
      { level: "I", q: "Your teammate fixes a bug in `Cart`. Which other components should be affected?", a: "None, ideally. Isolation means the fix stays inside `Cart` (unless others depend on its output)." },
      { level: "I", q: "Give one reason components make testing easier.", a: "You can render one small component alone and check its output, without the whole app." },
      { level: "C", q: "When can splitting too much hurt?", a: "Dozens of tiny one-line components add jumping between files and prop passing with no real reuse. Split for a reason." }
    ],
    quiz: [
      { q: "Which is NOT a main benefit of components?", options: ["Reuse", "Isolation", "Automatically faster page loads", "Parallel team work"], answer: 2, why: "Components help organisation and reuse; speed depends on what you render, not on splitting itself." },
      { q: "You need the same card on 3 pages. Best approach?", options: ["Copy the markup into each page", "One `Card` component used on all 3", "An iframe", "A global HTML string"], answer: 1, why: "Write once, reuse everywhere; fixes apply to all pages." },
      { q: "What does 'isolation' mean here?", options: ["Each component runs in its own thread", "A component's logic and markup are self-contained", "Components can't talk to each other", "Each component needs its own CSS file"], answer: 1, why: "Isolation is about self-contained pieces, not threads or a ban on communication." }
    ],
    rev: {
      sec30: "Component-based architecture splits UI into small, self-contained pieces. Benefits: reuse (write once, use everywhere), isolation (bugs and changes stay local), testability, and team scale (people own different components). Don't over-split: split when it adds clarity or reuse.",
      interview: [
        { level: "basic", q: "Why does React use components?", a: "To build UIs from reusable, isolated pieces. It cuts duplication, makes code easier to reason about and test, and lets teams work in parallel." },
        { level: "intermediate", q: "How do components help large teams?", a: "Clear ownership boundaries: each team or person owns components with a small API (props), so changes rarely collide." },
        { level: "intermediate", q: "How are components like classes in OOP?", a: "Both encapsulate a responsibility behind an interface. Components use props as the interface and favour composition over inheritance." },
        { level: "tricky", q: "Can you over-componentise?", a: "Yes. Too many tiny wrappers add indirection and prop passing without reuse. Split by responsibility, not by line count." }
      ],
      scenario: [
        { q: "A product page file is 1,500 lines and every change breaks something. What do you do?", a: "Identify distinct UI areas (gallery, price box, reviews, related items), extract each into its own component, and pass data down as props." }
      ],
      cheat: [
        "Reuse: write once, render many times",
        "Isolation: markup + logic + state live together",
        "Team scale: clear ownership, fewer conflicts",
        "Small components are easy to test",
        "Composition over copy-paste",
        "Split by responsibility, not by line count"
      ]
    },
    related: ["COMP-001", "COMP-006", "COMP-010", "INTRO-002"]
  },

  "COMP-003": {
    tldr: "Write every component as a **function** (function component). Class components (`class X extends React.Component`) are legacy: they still work, but hooks made functions do everything classes did with less code.",
    analogy: { icon: "📝", text: "A recipe card vs a thick cookbook chapter. The function is the short card: ingredients in, dish out. The class is the same dish with pages of ceremony." },
    visual: { type: "compare", title: "Function vs class component", left: { label: "Class (legacy)", tone: "bad", points: [
      "`class Cart extends React.Component`",
      "`render()` method + `this.props`",
      "`this.state` and `this.setState`",
      "Lifecycle methods split related logic"
    ]}, right: { label: "Function (modern)", tone: "good", points: [
      "`function Cart(props)`: just return JSX",
      "Props are a plain parameter",
      "`useState`, `useEffect` and other hooks",
      "Related logic grouped and reusable via custom hooks"
    ]}},
    points: [
      "A function component takes **props** as its parameter and **returns JSX**.",
      "Arrow functions work too: `const Cart = () => <aside>…</aside>;`",
      "Hooks (`useState`, `useEffect`…) work **only** in function components and custom hooks.",
      "Classes are legacy: you'll meet them in old codebases, but don't write new ones.",
      "One exception: **error boundaries** still need a class (or a library like `react-error-boundary`)."
    ],
    code: { file: "LikeButton.jsx", lang: "jsx", src: `import { useState } from 'react';

// Modern: function component
export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes}
    </button>
  );
}

// Legacy equivalent (for reading old code only)
// class LikeButton extends React.Component {
//   state = { likes: 0 };
//   render() {
//     return (
//       <button onClick={() =>
//         this.setState({ likes: this.state.likes + 1 })}>
//         ❤️ {this.state.likes}
//       </button>
//     );
//   }
// }`, walk: [
      { lines: [4], note: "A plain function. React calls it every render." },
      { lines: [5], note: "Memory (state) comes from the `useState` hook, not `this.state`." },
      { lines: [6, 7, 8, 9, 10], note: "Return JSX directly; no `render()` method needed." },
      { lines: [14, 15, 16], note: "The class version: `extends`, `state` field, `render()`, `this` everywhere." }
    ]},
    output: "A button “❤️ 0” that counts up on each click.",
    mistakes: [
      { bad: `class Profile extends React.Component {\n  render() { return <h2>Hi</h2>; }\n}`, good: `function Profile() {\n  return <h2>Hi</h2>;\n}`, why: "New code should be function components; they're shorter and can use hooks." },
      { bad: `class Cart extends React.Component {\n  render() {\n    const [n] = useState(0); // ❌\n  }\n}`, good: `function Cart() {\n  const [n] = useState(0);\n}`, why: "Hooks don't work inside class components." }
    ],
    practice: [
      { level: "B", q: "Rewrite `class Title extends React.Component { render() { return <h1>Notes</h1>; } }` as a function.", a: "`function Title() { return <h1>Notes</h1>; }`" },
      { level: "B", q: "Write the same component as an arrow function.", a: "`const Title = () => <h1>Notes</h1>;`" },
      { level: "I", q: "In a class, props are `this.props.name`. In a function?", a: "The first parameter: `function Hello(props)` then `props.name`, or destructure `function Hello({ name })`." },
      { level: "C", q: "Which React feature still requires a class component today?", a: "Error boundaries (`componentDidCatch` / `getDerivedStateFromError`). Most teams use `react-error-boundary` to avoid writing one." }
    ],
    quiz: [
      { q: "Which is the recommended way to write new components?", options: ["Class components", "Function components", "`React.createClass`", "Mixins"], answer: 1, why: "React docs teach function components with hooks; classes are legacy." },
      { q: "Can you call `useState` inside a class component?", options: ["Yes", "No", "Only in `render()`", "Only with a polyfill"], answer: 1, why: "Hooks only work in function components and custom hooks." },
      { q: "What still needs a class component?", options: ["Forms", "Lists", "Error boundaries", "Context"], answer: 2, why: "Error boundaries have no hook equivalent yet." }
    ],
    rev: {
      sec30: "Function components are functions that take props and return JSX. With hooks they handle state, effects, context and refs, so class components are legacy. Read classes in old code, write functions. Exception: error boundaries still need a class or `react-error-boundary`.",
      interview: [
        { level: "basic", q: "What's a function component?", a: "A JavaScript function that accepts props and returns JSX. It can use hooks for state and side effects." },
        { level: "intermediate", q: "Why are class components considered legacy?", a: "Hooks give functions all the same abilities with less code, no `this` confusion, and logic reuse via custom hooks. Lifecycle methods also scattered related logic." },
        { level: "intermediate", q: "Map `componentDidMount` to hooks.", a: "`useEffect(() => { ... }, [])`, roughly. Effects sync with external systems rather than mapping 1:1 to lifecycle methods." },
        { level: "advanced", q: "Is there anything functions can't do yet?", a: "Catching render errors: error boundaries still need a class (`getDerivedStateFromError`, `componentDidCatch`)." },
        { level: "tricky", q: "Are arrow and `function` declarations different as components?", a: "Not to React. Differences are JS ones: hoisting and the default display name. Both are fine." }
      ],
      compare: { cols: ["", "Function", "Class"], rows: [
        ["Props", "parameter", "`this.props`"],
        ["State", "`useState`", "`this.state` / `setState`"],
        ["Side effects", "`useEffect`", "lifecycle methods"],
        ["Hooks", "yes", "no"],
        ["Status", "recommended", "legacy"]
      ]},
      cheat: [
        "`function Cart(props) { return <aside /> }`",
        "Arrow form: `const Cart = () => <aside />`",
        "Hooks only in function components",
        "Classes = legacy; read them, don't write them",
        "Error boundaries still need a class (or `react-error-boundary`)"
      ]
    },
    related: ["COMP-001", "HOOKS-003", "ADV-004", "STATE-004"]
  },

  "COMP-004": {
    tldr: "Name components in **PascalCase** (`ProductCard`), name the file the same (`ProductCard.jsx`), and keep **one main component per file**.",
    analogy: { icon: "🏷️", text: "Labels on spice jars. If the jar says “Paprika”, you expect paprika inside. A file called `CartItem.jsx` should hold the `CartItem` component." },
    visual: { type: "tree", title: "A tidy, well-named folder", root: { label: "src/components", children: [
      { label: "ProductCard.jsx", note: "export default function ProductCard" },
      { label: "CartItem.jsx", note: "one main component" },
      { label: "SearchBar.jsx", note: "PascalCase file = component" },
      { label: "useCart.js", note: "hooks: camelCase starting with use" },
      { label: "formatPrice.js", note: "helpers: camelCase" }
    ]}},
    points: [
      "**PascalCase** for components: `ShoppingCart`, `UserAvatar`. Required: lowercase means HTML tag.",
      "File name matches the component: `ShoppingCart.jsx` exports `ShoppingCart`.",
      "**One main component per file.** Tiny private helpers in the same file are fine.",
      "Use `.jsx` for files with JSX (Vite's default template does this).",
      "Name by **what it is**, not how it looks: `PriceTag`, not `RedBoldText`.",
      "Hooks are camelCase starting with `use` (`useCart`); helpers are camelCase (`formatPrice`)."
    ],
    code: { file: "CartItem.jsx", lang: "jsx", src: `// File: src/components/CartItem.jsx

function formatPrice(pence) {
  return '£' + (pence / 100).toFixed(2);
}

export default function CartItem() {
  return (
    <li className="cart-item">
      <span>Blue Mug</span>
      <strong>{formatPrice(800)}</strong>
    </li>
  );
}`, walk: [
      { lines: [1], note: "File name `CartItem.jsx` matches the component name." },
      { lines: [3, 4, 5], note: "A small private helper in camelCase. Not exported; only this file uses it." },
      { lines: [7], note: "The one main component, PascalCase, exported from the file." },
      { lines: [11], note: "Use the helper inside JSX: shows “£8.00”." }
    ]},
    output: "A list item: “Blue Mug £8.00”.",
    mistakes: [
      { bad: `// cart-item.jsx\nexport default function cartItem() {...}`, good: `// CartItem.jsx\nexport default function CartItem() {...}`, why: "A lowercase component name breaks when used as `<cartItem />`; matching file and component names makes code easy to find." },
      { bad: `// Components.jsx holds Header, Footer, Cart, Modal...`, good: `// Header.jsx, Footer.jsx, Cart.jsx, Modal.jsx`, why: "One giant file of unrelated components is hard to navigate and causes merge conflicts." }
    ],
    practice: [
      { level: "B", q: "Fix the names: `navbar`, `user_profile`, `Btn1`.", a: "`NavBar`, `UserProfile`, and something meaningful like `SubmitButton`." },
      { level: "B", q: "What file should the `RecipeList` component live in?", a: "`RecipeList.jsx`." },
      { level: "I", q: "Is it OK to put a small `Star` component inside `Rating.jsx`?", a: "Yes, if only `Rating` uses it. Define it at the **top level** of the file (not inside `Rating`) and don't export it." },
      { level: "C", q: "Name a component that shows an avatar, name and online dot for a chat user.", a: "`UserPresence` or `ChatUserBadge`: say what it is, not `GreenDotThing`." }
    ],
    quiz: [
      { q: "Which is a valid component name?", options: ["`productCard`", "`ProductCard`", "`product-card`", "`PRODUCT_CARD`"], answer: 1, why: "PascalCase. Lowercase becomes an HTML tag; hyphens aren't valid identifiers." },
      { q: "Where should `ShoppingCart` live?", options: ["`shopping_cart.js`", "`ShoppingCart.jsx`", "`components.jsx` with everything else", "`index.html`"], answer: 1, why: "Match the file name to the component." },
      { q: "A custom hook for cart logic should be called:", options: ["`CartHook`", "`useCart`", "`cart`", "`UseCart`"], answer: 1, why: "Hooks are camelCase and must start with `use` so lint rules can check them." }
    ],
    rev: {
      sec30: "Components use PascalCase (required, because lowercase JSX means an HTML tag). Name files after their component (`CartItem.jsx`) and keep one main component per file; small private helpers can sit alongside at top level. Hooks are `useSomething`, helpers camelCase.",
      interview: [
        { level: "basic", q: "Why PascalCase for components?", a: "JSX treats lowercase tags as HTML elements and capitalised tags as component references. It's a rule, not just style." },
        { level: "basic", q: "Why one component per file?", a: "Easy to find, easy to review, fewer merge conflicts, and file name = component name." },
        { level: "intermediate", q: "When can a file contain more than one component?", a: "When small helper components are used only by the main one. Keep them at top level and unexported." },
        { level: "tricky", q: "Does a `.js` extension break JSX?", a: "Vite expects JSX in `.jsx`/`.tsx` by default; `.js` files with JSX fail to parse unless you configure it. Use `.jsx`." }
      ],
      cheat: [
        "Components: PascalCase (`ProductCard`)",
        "File = component: `ProductCard.jsx`",
        "One main component per file",
        "Hooks: `useSomething`; helpers: camelCase",
        "Name by meaning, not appearance",
        "JSX files use `.jsx` in Vite"
      ]
    },
    related: ["COMP-001", "COMP-012", "COMP-015", "HOOKS-024"]
  },

  "COMP-005": {
    tldr: "Composition means building bigger components out of smaller ones. A `ProductPage` is just `<Gallery />`, `<PriceBox />` and `<Reviews />` placed together.",
    analogy: { icon: "🍔", text: "A burger is bun + patty + lettuce + sauce. Each part is made separately; the burger is the composition. Swap the patty and the rest still works." },
    visual: { type: "tree", title: "Composing a recipe page", root: { label: "RecipePage", children: [
      { label: "RecipeHeader", children: [{ label: "Title" }, { label: "RatingStars" }] },
      { label: "IngredientList", children: [{ label: "IngredientRow ×n" }] },
      { label: "StepList", children: [{ label: "Step ×n" }] },
      { label: "Card", note: "wraps anything via children", children: [{ label: "NutritionInfo" }] }
    ]}},
    points: [
      "Small components snap together into bigger ones, all the way up to `App`.",
      "A parent **renders** children in its JSX: `<Header />` inside `<Page>`.",
      "**Wrapper** components accept any content via the `children` prop: `<Card>…</Card>`.",
      "React prefers **composition over inheritance**: you never `extend` a component.",
      "Composition keeps each piece simple; complexity comes from combining, not from one huge function."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function Card({ children }) {
  return <section className="card">{children}</section>;
}

function Ingredients() {
  return (
    <ul>
      <li>2 eggs</li>
      <li>100g flour</li>
    </ul>
  );
}

function Steps() {
  return <ol><li>Whisk</li><li>Fry</li></ol>;
}

export default function App() {
  return (
    <main>
      <h1>🥞 Pancakes</h1>
      <Card><Ingredients /></Card>
      <Card><Steps /></Card>
    </main>
  );
}`, walk: [
      { lines: [1, 2, 3], note: "`Card` is a wrapper: it draws a box and puts whatever it's given (`children`) inside." },
      { lines: [5, 6, 7, 8, 9, 10, 11, 12], note: "`Ingredients` is a small, focused piece." },
      { lines: [14, 15, 16], note: "`Steps` is another focused piece." },
      { lines: [22, 23], note: "Compose: the same `Card` wraps different content. No inheritance needed." }
    ]},
    output: "A “🥞 Pancakes” heading and two boxed cards: an ingredient list and a numbered step list.",
    mistakes: [
      { bad: `class SpecialCard extends Card { ... }`, good: `function SpecialCard() {\n  return <Card><Badge /> ...</Card>;\n}`, why: "React uses composition, not inheritance. Wrap and combine components instead of extending them." },
      { bad: `function Card() {\n  return <section><Ingredients /></section>;\n}`, good: `function Card({ children }) {\n  return <section>{children}</section>;\n}`, why: "Hard-coding the content makes `Card` single-use. Accept `children` so it can wrap anything." }
    ],
    practice: [
      { level: "B", q: "Compose a `TodoApp` from `TodoInput`, `TodoList` and `TodoFooter`.", a: "Write each as its own function, then return all three inside `TodoApp`.", code: `function TodoApp() {\n  return (\n    <div>\n      <TodoInput />\n      <TodoList />\n      <TodoFooter />\n    </div>\n  );\n}` },
      { level: "I", q: "Make a `Panel` wrapper with a title and any content.", a: "Accept `title` and `children`.", code: `function Panel({ title, children }) {\n  return (\n    <section>\n      <h2>{title}</h2>\n      {children}\n    </section>\n  );\n}` },
      { level: "I", q: "Why is `<Card><Steps /></Card>` better than `<StepsCard />` and `<IngredientsCard />`?", a: "One `Card` handles the box styling; content varies. Two near-identical components duplicate the box code." },
      { level: "C", q: "A `Layout` needs a sidebar and main area. How do you compose two slots?", a: "Pass JSX as props: `<Layout sidebar={<Filters />}>` plus `children` for the main area." }
    ],
    quiz: [
      { q: "React's recommended way to share UI between components is:", options: ["Inheritance (`extends`)", "Composition", "Global variables", "Mixins"], answer: 1, why: "React docs recommend composition; inheritance hierarchies aren't used for components." },
      { q: "How does a wrapper receive the JSX placed between its tags?", options: ["`props.content`", "`props.children`", "`this.inner`", "It can't"], answer: 1, why: "Anything between `<Card>` and `</Card>` arrives as `children`." },
      { q: "`<Card><Steps /></Card>`: which is the parent?", options: ["`Steps`", "`Card` (it renders `children`)", "Neither", "`App` only"], answer: 1, why: "`Card` decides where `Steps` appears. (`App` creates both, so it's also an ancestor.)" }
    ],
    rev: {
      sec30: "Composition = building complex UI by combining simple components. Parents render children in JSX; generic wrappers accept `children` (or JSX props for multiple slots). React favours composition over inheritance: you never extend components.",
      interview: [
        { level: "basic", q: "What is component composition?", a: "Building larger components by combining smaller ones in JSX, like `Page` rendering `Header`, `Content` and `Footer`." },
        { level: "intermediate", q: "Why composition over inheritance in React?", a: "Composition with props and `children` covers every reuse case more flexibly. Inheritance creates rigid hierarchies and tight coupling." },
        { level: "intermediate", q: "How do you build a component with multiple content slots?", a: "Pass JSX through named props, e.g. `<Layout header={<Nav />} sidebar={<Filters />}>{main}</Layout>`." },
        { level: "advanced", q: "How can composition reduce prop drilling?", a: "Instead of passing data through layers, let the top component build the deep child and pass it down as `children`, so middle layers don't need the data." }
      ],
      cheat: [
        "Big UI = small components combined",
        "Wrapper: `function Card({ children })`",
        "Multiple slots: pass JSX as props",
        "Composition over inheritance: never `extends`",
        "Composition can cut prop drilling"
      ]
    },
    related: ["COMP-007", "PROPS-010", "COMM-013", "PROPS-009"]
  },

  "COMP-006": {
    tldr: "Instead of copy-pasting a component and tweaking it, make **one** component and pass in what changes as props. `<ProductCard name=\"Mug\" price={8} />` covers every product.",
    analogy: { icon: "🍪", text: "A cookie cutter. One cutter (component), many cookies. Change the dough or icing (props) and each cookie looks different, but you never carve a new cutter." },
    visual: { type: "compare", title: "Copy-paste vs configurable", left: { label: "Copy-paste", tone: "bad", points: [
      "`BlueMugCard`, `RedMugCard`, `TeaPotCard`…",
      "Same markup repeated in each",
      "A design change = edit every copy",
      "Copies slowly drift apart"
    ]}, right: { label: "One component + props", tone: "good", points: [
      "`<ProductCard name price emoji />`",
      "Markup lives in one place",
      "Change once, every card updates",
      "Render a whole list with `.map()`"
    ]}},
    points: [
      "Spot the **differences** between copies; those become props.",
      "Keep the **same parts** inside the component.",
      "Give sensible **defaults** for optional props (`tone = 'info'`).",
      "Combine with `.map()` to render a card per item in an array.",
      "Don't add a prop for every possible tweak; a few clear props beat 20 flags."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function ProductCard({ name, price, emoji = '📦' }) {
  return (
    <article className="card">
      <span>{emoji}</span>
      <h3>{name}</h3>
      <p>£{price}</p>
    </article>
  );
}

const products = [
  { id: 1, name: 'Blue Mug', price: 8, emoji: '☕' },
  { id: 2, name: 'Tea Pot', price: 20, emoji: '🫖' },
  { id: 3, name: 'Gift Box', price: 5 },
];

export default function App() {
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} name={p.name} price={p.price} emoji={p.emoji} />
      ))}
    </div>
  );
}`, walk: [
      { lines: [1], note: "The parts that change are props. `emoji` has a default for items without one." },
      { lines: [2, 3, 4, 5, 6, 7, 8], note: "The shared markup lives in exactly one place." },
      { lines: [11, 12, 13, 14, 15], note: "Data for three products. The third has no emoji, so it gets 📦." },
      { lines: [20, 21, 22], note: "One component, rendered once per product. `key` helps React track list items." }
    ]},
    output: "Three cards: ☕ Blue Mug £8, 🫖 Tea Pot £20, 📦 Gift Box £5.",
    mistakes: [
      { bad: `function BlueMugCard() {...}\nfunction TeaPotCard() {...} // same markup`, good: `<ProductCard name="Blue Mug" />\n<ProductCard name="Tea Pot" />`, why: "Copies drift apart and each bug fix must be repeated. Make one component and pass the differences in." },
      { bad: `<Button isRed isBig isRounded hasIcon isBold isWide />`, good: `<Button variant="danger" size="lg" icon={<TrashIcon />} />`, why: "A pile of boolean flags gets confusing and allows impossible combos. Group options into a few clear props." }
    ],
    practice: [
      { level: "B", q: "Make an `Alert` that takes `message` and shows it in a box.", a: "`function Alert({ message }) { return <div className=\"alert\">{message}</div>; }`" },
      { level: "I", q: "Add a `tone` prop (`info` | `error`) with default `info`, used as a CSS class.", a: "Destructure with a default and build the class name.", code: `function Alert({ message, tone = 'info' }) {\n  return <div className={'alert ' + tone}>{message}</div>;\n}` },
      { level: "I", q: "Render a `SongRow` for each song in a playlist array.", a: "`songs.map(s => <SongRow key={s.id} title={s.title} artist={s.artist} />)`" },
      { level: "C", q: "Two cards are 90% the same but one has a ‘Sale’ ribbon. New component or prop?", a: "A prop (e.g. `badge=\"Sale\"`, render it only if set). Make a new component only if structure and behaviour truly differ." }
    ],
    quiz: [
      { q: "Three near-identical cards differ only in text. Best fix?", options: ["Keep three components", "One component with props for the text", "Use `innerHTML`", "Put them all in one file"], answer: 1, why: "What differs becomes props; what's shared stays in one component." },
      { q: "How do you give a prop a default value?", options: ["`props.tone ||= 'info'` after render", "Destructure with a default: `{ tone = 'info' }`", "`defaultProps` is the only way", "You can't"], answer: 1, why: "Default parameters are the modern way. `defaultProps` on function components was removed in React 19." },
      { q: "Signs a component has too many props?", options: ["It has 2 props", "Many boolean flags that combine oddly", "It uses `children`", "It renders a list"], answer: 1, why: "Lots of flags means the component is doing too much; group options or split it." }
    ],
    rev: {
      sec30: "Reuse = one configurable component instead of copies. Find what differs between copies and turn it into props; keep shared markup inside. Use default parameters for optional props and `.map()` for lists. Avoid flag explosions: prefer a few clear props like `variant` and `size`.",
      interview: [
        { level: "basic", q: "How do you make a component reusable?", a: "Move the varying parts (text, data, handlers) into props and keep the shared structure inside the component." },
        { level: "intermediate", q: "How do you set default prop values in modern React?", a: "Default values in destructuring: `function Btn({ size = 'md' })`. `defaultProps` for function components was removed in React 19." },
        { level: "advanced", q: "When does making a component more reusable go too far?", a: "When it gains many props and branches for every use case. Split it or use composition (children/slots) instead of more flags." },
        { level: "tricky", q: "`variant` prop vs several booleans: which and why?", a: "`variant=\"primary\" | \"danger\"`. Booleans like `isPrimary isDanger` allow impossible combos and are harder to read." }
      ],
      cheat: [
        "Differences become props; shared markup stays inside",
        "Defaults: `{ size = 'md' }` in the parameter",
        "`defaultProps` on function components: removed in React 19",
        "Lists: `items.map(i => <Card key={i.id} {...} />)`",
        "Prefer `variant`/`size` over many booleans"
      ]
    },
    related: ["COMP-002", "COMP-011", "PROPS-006", "COND-008"]
  },

  "COMP-007": {
    tldr: "If component A renders component B in its JSX, A is the **parent** and B is the **child**. Data flows down from parent to child (props); children tell parents things by calling functions they were given.",
    analogy: { icon: "👨‍👧", text: "A restaurant manager (parent) hands each waiter (child) a table number. The waiter doesn't pick their own table; when something happens, they report back to the manager." },
    visual: { type: "tree", title: "Who is parent of whom?", root: { label: "App", note: "parent of NavBar and Playlist", children: [
      { label: "NavBar", note: "child of App" },
      { label: "Playlist", note: "child of App, parent of SongRow", children: [
        { label: "SongRow", note: "child of Playlist" },
        { label: "SongRow" },
        { label: "SongRow" }
      ]}
    ]}},
    points: [
      "**Parent** = the component that renders another in its JSX. **Child** = the one rendered.",
      "A component can be both: `Playlist` is a child of `App` and a parent of `SongRow`.",
      "**Siblings** share a parent (the three `SongRow`s).",
      "Parent → child: pass data as **props**. Child → parent: call a **function prop** (e.g. `onPlay`).",
      "A child can't reach up and change its parent's data directly."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState } from 'react';

function SongRow({ title, onPlay }) {
  return (
    <li>
      {title} <button onClick={() => onPlay(title)}>▶</button>
    </li>
  );
}

export default function Playlist() {
  const [nowPlaying, setNowPlaying] = useState('nothing');
  const songs = ['Sunrise', 'Lo-fi Beats', 'Rainy Day'];

  return (
    <section>
      <p>Now playing: {nowPlaying}</p>
      <ul>
        {songs.map((s) => (
          <SongRow key={s} title={s} onPlay={setNowPlaying} />
        ))}
      </ul>
    </section>
  );
}`, walk: [
      { lines: [3], note: "The child receives data (`title`) and a callback (`onPlay`) from its parent." },
      { lines: [6], note: "Child → parent: the child calls the function it was given." },
      { lines: [12], note: "The parent owns the data `nowPlaying`." },
      { lines: [20], note: "Parent → child: pass data and the setter down as props." }
    ]},
    output: "“Now playing: nothing”, then three songs. Clicking ▶ on “Rainy Day” changes it to “Now playing: Rainy Day”.",
    mistakes: [
      { bad: `function SongRow({ title, nowPlaying }) {\n  nowPlaying = title; // ❌\n}`, good: `function SongRow({ title, onPlay }) {\n  return <button onClick={() => onPlay(title)}>▶</button>;\n}`, why: "Props are read-only. A child changes parent data by calling a function the parent passed down." }
    ],
    practice: [
      { level: "B", q: "In `<Cart><CartItem /></Cart>` rendered by `App`, name the parent of `CartItem`.", a: "`Cart` decides where `CartItem` shows. `App` created the element, so it's an ancestor too." },
      { level: "B", q: "Are two `SongRow`s parent and child?", a: "No, they're siblings: same parent, `Playlist`." },
      { level: "I", q: "A `TodoItem` needs to delete itself. How does it tell `TodoList`?", a: "`TodoList` passes `onDelete`; the item calls `onDelete(id)`.", code: `<TodoItem key={t.id} todo={t} onDelete={removeTodo} />` },
      { level: "C", q: "Two sibling components need the same data. Where should it live?", a: "In their closest common parent, which passes it to both (lifting state up)." }
    ],
    quiz: [
      { q: "Which direction do props flow?", options: ["Child to parent", "Parent to child", "Between siblings directly", "Both ways automatically"], answer: 1, why: "One-way data flow: parents pass props down." },
      { q: "How does a child notify its parent?", options: ["Edits `props` directly", "Calls a function passed as a prop", "Uses `this.parent`", "It can't"], answer: 1, why: "Callback props like `onPlay` are the standard child-to-parent channel." },
      { q: "Can a component be both a parent and a child?", options: ["No", "Yes, most components are", "Only `App`", "Only with context"], answer: 1, why: "Every component except the root is a child; any that render others are parents." }
    ],
    rev: {
      sec30: "A parent renders a child in its JSX. Data goes down as props; events come up when the child calls a function prop. Components are usually both parent and child. Siblings share a parent and communicate through it. Children never mutate parent data.",
      interview: [
        { level: "basic", q: "What makes a component a parent?", a: "It renders another component in its JSX output." },
        { level: "intermediate", q: "How does a child send data to a parent?", a: "The parent passes a callback prop; the child calls it with the data, and the parent updates its own state." },
        { level: "intermediate", q: "How do siblings share data?", a: "Lift the state to their closest common parent and pass it down to both, with setters as callbacks." },
        { level: "tricky", q: "In `<Card><Steps /></Card>` inside `App`, who is the parent of `Steps`?", a: "In the rendered tree, `Card`, since `Steps` appears where `Card` puts `children`. `App` is the owner that created the element." }
      ],
      cheat: [
        "Parent renders child in JSX",
        "Down: props. Up: callback props (`onX`)",
        "Siblings talk via their common parent",
        "Props are read-only in the child",
        "Most components are both parent and child"
      ]
    },
    related: ["COMP-009", "COMM-001", "COMM-002", "STATE-021"]
  },

  "COMP-008": {
    tldr: "Nesting means rendering components inside other components. Do it freely in JSX, but **never define** a component function inside another component: it gets recreated each render and loses its state.",
    analogy: { icon: "🪆", text: "Russian dolls are fine: one inside another. But carving a brand-new inner doll every time you open the outer one means the old doll (and anything inside it) is thrown away." },
    visual: { type: "timeline", title: "Defining a component inside another", frames: [
      { label: "Render 1", state: "Form creates Input#A", note: "User types “milk” into the input." },
      { label: "Type a key", state: "Form state changes", note: "Form re-renders." },
      { label: "Render 2", state: "Form creates Input#B (new function)", note: "React sees a different component type." },
      { label: "Result", state: "Input#A destroyed, focus + text lost", note: "Fix: move `Input` to the top level of the file." }
    ]},
    points: [
      "**Nesting in JSX** is normal: `<List><Item /></List>`.",
      "**Defining** `function Item()` *inside* `function List()` creates a new component type each render.",
      "React compares types by reference; a new type means **unmount + remount**: state, focus and DOM are lost.",
      "Fix: declare every component at the **top level** of a module and pass data via props.",
      "Symptoms: input loses focus after each keystroke, state resets, effects re-run."
    ],
    code: { file: "SearchBox.jsx", lang: "jsx", src: `import { useState } from 'react';

// ✅ Defined at top level: same type every render
function SearchInput({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

export default function SearchBox() {
  const [query, setQuery] = useState('');

  // ❌ Don't do this:
  // function SearchInput() { return <input ... /> }

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <p>Searching for: {query}</p>
    </div>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "Top-level component: React sees the same `SearchInput` type on every render." },
      { lines: [9], note: "The parent owns the state and passes it down." },
      { lines: [11, 12], note: "Defining it here would make a **new** function each render, so React remounts it." },
      { lines: [16], note: "Nesting in JSX is fine. Data goes in via props." }
    ]},
    output: "Typing “milk” keeps focus in the input and shows “Searching for: milk”.",
    mistakes: [
      { bad: `function TodoList() {\n  const [text, setText] = useState('');\n  function Row() {\n    return <input value={text} onChange={e => setText(e.target.value)} />;\n  }\n  return <Row />;\n}`, good: `function Row({ text, setText }) {\n  return <input value={text} onChange={e => setText(e.target.value)} />;\n}\nfunction TodoList() {\n  const [text, setText] = useState('');\n  return <Row text={text} setText={setText} />;\n}`, why: "The inner `Row` is a new type each render, so the input is recreated and loses focus after every keystroke." }
    ],
    practice: [
      { level: "B", q: "Is `<Menu><MenuItem /></Menu>` safe?", a: "Yes. That's nesting in JSX; both are defined at top level." },
      { level: "I", q: "Why does an inner component lose its state?", a: "Each parent render creates a new function, so React sees a different type at that spot and unmounts the old one." },
      { level: "I", q: "An inner component reads the parent's `theme` variable. How do you move it out?", a: "Move it to top level and pass `theme` as a prop." },
      { level: "C", q: "Is calling a render helper `{renderRow(item)}` inside the parent also a problem?", a: "No remount issue: it's a plain function returning JSX, not a component. But it can't use its own hooks; prefer a real top-level component if it grows." }
    ],
    quiz: [
      { q: "What happens to a component defined inside another on each parent render?", options: ["Nothing, React caches it", "It's a new type, so it remounts and loses state", "It becomes faster", "React throws an error"], answer: 1, why: "A new function identity = a new component type = remount." },
      { q: "Common symptom of this bug?", options: ["Input loses focus after each keystroke", "CSS doesn't load", "Build fails", "Console says 'missing key'"], answer: 0, why: "The input DOM node is replaced on every render." },
      { q: "The fix is to:", options: ["Wrap it in `useMemo`", "Move it to the top level and pass props", "Add a `key`", "Use a class"], answer: 1, why: "Top-level definitions keep a stable identity. Data the inner one used becomes props." }
    ],
    rev: {
      sec30: "Nest components in JSX freely, but define them at module top level. A component defined inside another gets a new identity every render, so React unmounts and remounts it: state resets, inputs lose focus, effects re-run. Move it out and pass what it needs as props.",
      interview: [
        { level: "basic", q: "What's the difference between nesting and defining inside?", a: "Nesting is rendering `<Child />` in JSX: fine. Defining `function Child()` inside the parent's body creates a new component type every render: bug." },
        { level: "intermediate", q: "Why does defining inside cause state loss?", a: "React reconciles by element type. A new function each render is a different type, so React destroys the old subtree and mounts a fresh one." },
        { level: "advanced", q: "Could `useCallback` or `useMemo` fix an inner component?", a: "Technically it stabilises the reference, but it's a hack. The correct fix is a top-level component with props." },
        { level: "tricky", q: "Is a render helper function `renderItem()` inside a component OK?", a: "It doesn't remount because it's called, not used as a type. But it can't hold hooks; extract a component if it grows." }
      ],
      debug: [
        { code: `function Chat() {\n  const [msg, setMsg] = useState('');\n  const Box = () => <input value={msg} onChange={e => setMsg(e.target.value)} />;\n  return <Box />;\n}`, fix: `function Box({ msg, setMsg }) {\n  return <input value={msg} onChange={e => setMsg(e.target.value)} />;\n}\nfunction Chat() {\n  const [msg, setMsg] = useState('');\n  return <Box msg={msg} setMsg={setMsg} />;\n}`, why: "`Box` was recreated each render, so the input lost focus on every keystroke." }
      ],
      cheat: [
        "Nest in JSX: fine",
        "Define inside another component: never",
        "New function each render = new type = remount",
        "Symptom: input loses focus, state resets",
        "Fix: top-level component + props"
      ]
    },
    related: ["COMP-005", "RENDER-008", "RENDER-005", "STATE-020"]
  },

  "COMP-009": {
    tldr: "Every React app is a **tree** of components with `App` at the root. Drawing it shows who renders whom, where data should live, and what re-renders when something changes.",
    analogy: { icon: "🌳", text: "A family tree for your UI. `App` is the grandparent; pages are parents; buttons and rows are the grandchildren. Data is handed down the branches." },
    visual: { type: "tree", title: "Component tree of a weather app", root: { label: "App", children: [
      { label: "Header", children: [{ label: "SearchBar" }, { label: "UnitToggle", note: "°C / °F" }] },
      { label: "WeatherPage", note: "shows weather for App's city", children: [
        { label: "CurrentWeather" },
        { label: "Forecast", children: [{ label: "DayCard ×7" }] }
      ]},
      { label: "Footer" }
    ]}},
    points: [
      "**Root** = `App` (rendered by `createRoot` in `main.jsx`). **Leaves** = components that render no other components.",
      "Draw it by boxing each UI area on a screenshot, then nesting the boxes.",
      "The tree shows **where state belongs**: in the closest common parent of everything that uses it.",
      "When a component re-renders, its **whole subtree** re-renders by default.",
      "React DevTools' **Components** tab shows the live tree of any running app."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function SearchBar() { return <input placeholder="City…" />; }
function UnitToggle() { return <button>°C / °F</button>; }
function Header() {
  return <header><SearchBar /><UnitToggle /></header>;
}

function DayCard({ day }) { return <li>{day}: ☀️ 21°</li>; }
function Forecast() {
  const days = ['Mon', 'Tue', 'Wed'];
  return <ul>{days.map((d) => <DayCard key={d} day={d} />)}</ul>;
}
function CurrentWeather() { return <h2>London 🌦️ 18°</h2>; }
function WeatherPage() {
  return <main><CurrentWeather /><Forecast /></main>;
}

export default function App() {
  return (
    <>
      <Header />
      <WeatherPage />
    </>
  );
}`, walk: [
      { lines: [3, 4, 5], note: "`Header` branch: two leaf children, `SearchBar` and `UnitToggle`." },
      { lines: [8, 9, 10, 11], note: "`Forecast` renders one `DayCard` leaf per day." },
      { lines: [13, 14, 15], note: "`WeatherPage` branch groups the weather pieces." },
      { lines: [17, 18, 19, 20, 21, 22, 23, 24], note: "`App` is the root; its JSX is the top level of the tree." }
    ]},
    output: "A header with a city input and unit toggle, then “London 🌦️ 18°” and three forecast rows.",
    mistakes: [
      { bad: `// state for the city kept inside SearchBar,\n// but Forecast also needs it`, good: `// keep city state in App (the closest common\n// parent of Header and WeatherPage) and pass it down`, why: "State must live at or above every component that reads it. Draw the tree to find the closest common parent." }
    ],
    practice: [
      { level: "B", q: "Draw the tree for a todo app: input, list of items, footer with count.", a: "`App → TodoInput, TodoList → TodoItem ×n, TodoFooter`." },
      { level: "I", q: "In the weather tree, `SearchBar` and `Forecast` both need `city`. Where does it live?", a: "Their closest common parent is `App`, so `city` state lives in `App`." },
      { level: "I", q: "`Forecast` re-renders. Which components re-render with it by default?", a: "Its subtree: every `DayCard`. Not its siblings or parent." },
      { level: "C", q: "Open React DevTools on any React site. What do you see?", a: "The Components tab shows the live tree; selecting a node shows its props, state and hooks." }
    ],
    quiz: [
      { q: "What is the root of a typical React tree?", options: ["`index.html`", "`App`", "The first `<div>`", "`main.css`"], answer: 1, why: "`createRoot(...).render(<App />)` makes `App` the root component." },
      { q: "When a parent re-renders, by default:", options: ["Only it re-renders", "Its whole subtree re-renders", "The whole app re-renders", "Only its siblings re-render"], answer: 1, why: "Children re-render with their parent unless memoised." },
      { q: "Two components need the same state. Where should it live?", options: ["In both", "In their closest common parent", "Always in `App`", "In a global variable"], answer: 1, why: "Closest common parent: high enough to share, low enough to avoid extra re-renders." }
    ],
    rev: {
      sec30: "A React app is a tree of components rooted at `App`. Draw it by boxing UI areas and nesting them. The tree tells you where state lives (closest common parent of its readers) and what re-renders (a component and its subtree). React DevTools shows the live tree.",
      interview: [
        { level: "basic", q: "What is the component tree?", a: "The hierarchy of components an app renders, starting from the root (`App`), with each parent rendering its children." },
        { level: "intermediate", q: "How do you decide where state lives using the tree?", a: "Find every component that reads it and put the state in their closest common ancestor." },
        { level: "intermediate", q: "What re-renders when state changes?", a: "The component that owns the state and its entire subtree, unless children are memoised." },
        { level: "advanced", q: "How does the component tree relate to the DOM tree?", a: "Components render to DOM elements but aren't DOM nodes themselves. Many components (and fragments) can map to a flatter DOM tree." }
      ],
      cheat: [
        "Root: `App`; leaves render no components",
        "Box the screenshot, nest the boxes",
        "State lives in the closest common parent",
        "Re-render = component + its subtree",
        "React DevTools → Components tab shows the tree"
      ]
    },
    related: ["COMP-007", "STATE-021", "ENV-014", "RENDER-019"]
  },

  "COMP-010": {
    tldr: "Split a component when one part has its **own job**, is **repeated**, has **its own state**, or the file is getting hard to read. Don't split just to make files smaller.",
    analogy: { icon: "✂️", text: "Cutting a pizza. Slice where it makes eating easier, not into 200 crumbs. One slice = one job you can pick up on its own." },
    visual: { type: "flow", title: "Should I split this part out?", steps: [
      { label: "Own job?", detail: "Can you name it in 1-2 words (`PriceTag`, `ReviewList`)? Good sign." },
      { label: "Repeated?", detail: "Same markup in 2+ places, or rendered in a `.map()`? Extract it." },
      { label: "Own state/logic?", detail: "Has its own `useState` or effect unrelated to the rest? Extract it." },
      { label: "Hard to read?", detail: "Scrolling past 150+ lines of JSX? Split along the visible sections." },
      { label: "Otherwise keep it", detail: "A tiny one-off piece is fine inline. Split for a reason." }
    ]},
    points: [
      "**Single responsibility**: one component, one job.",
      "Extract anything rendered in a **loop** into its own component (`CartRow`).",
      "Moving state **down** into the part that uses it means fewer re-renders elsewhere.",
      "Keep the split component in the **same file** if only one parent uses it; move it to its own file when reused.",
      "Over-splitting costs too: prop-passing chains and jumping between files."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

// Split out: repeated + its own job
function CartRow({ item }) {
  return <li>{item.name} × {item.qty}</li>;
}

// Split out: has its own state, unrelated to the list
function PromoCode() {
  const [code, setCode] = useState('');
  return <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" />;
}

export default function Cart({ items }) {
  return (
    <section>
      <h2>🛒 Your cart</h2>
      <ul>
        {items.map((i) => <CartRow key={i.id} item={i} />)}
      </ul>
      <PromoCode />
    </section>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "`CartRow` is rendered in a loop and has one clear job, so it gets its own component." },
      { lines: [9, 10, 11, 12], note: "`PromoCode` keeps its own state. Typing only re-renders `PromoCode`, not the whole cart." },
      { lines: [14], note: "`Cart` now reads like an outline of the UI." },
      { lines: [19, 21], note: "The parent just composes the pieces." }
    ]},
    output: "A cart heading, one line per item (e.g. “Blue Mug × 2”) and a promo code input.",
    mistakes: [
      { bad: `function Checkout() {\n  // 400 lines: address form, card form,\n  // order summary, promo code, all state mixed\n}`, good: `function Checkout() {\n  return (<>\n    <AddressForm /><PaymentForm />\n    <OrderSummary /><PromoCode />\n  </>);\n}`, why: "One huge component is hard to read, test and change. Split along the clear sections of the UI." },
      { bad: `function Price({ value }) { return <>{value}</>; }\nfunction PriceWrapper({ value }) { return <Price value={value} />; }`, good: `<span>£{value}</span>`, why: "Wrappers that add nothing just add indirection. Split only when the piece has a real job." }
    ],
    practice: [
      { level: "B", q: "A `NotesApp` renders a list of notes with a `.map()` and inline JSX for each. What do you extract?", a: "A `NoteCard` component for each item." },
      { level: "I", q: "Typing in a search box inside a big `Dashboard` re-renders charts. How can splitting help?", a: "Move the search input's state into a small `SearchBox` component so typing only re-renders that." },
      { level: "I", q: "`ReviewList` is used only by `ProductPage`. Same file or new file?", a: "Either is fine. Same file is OK while it's private; move it out once something else needs it." },
      { level: "C", q: "Name two costs of splitting too much.", a: "More props to pass through layers, and harder navigation (jumping across many tiny files)." }
    ],
    quiz: [
      { q: "Best reason to extract a component?", options: ["The file has more than 20 lines", "A piece has its own job or is repeated", "To use more files", "Every `div` should be a component"], answer: 1, why: "Split by responsibility and reuse, not by size alone." },
      { q: "Moving state into a small child component can:", options: ["Break React", "Reduce re-renders of unrelated parts", "Make state global", "Remove the need for props"], answer: 1, why: "Only the component owning the state (and its subtree) re-renders when it changes." },
      { q: "A helper component used by one parent only:", options: ["Must have its own file", "Can live in the same file, at top level", "Must be defined inside the parent", "Should be a class"], answer: 1, why: "Same file is fine; just never define it inside the parent." }
    ],
    rev: {
      sec30: "Split when a piece has its own job, is repeated (loops), owns separate state, or the component is hard to read. Moving state down into the piece that uses it limits re-renders. Keep private helpers in the same file; move them out when reused. Don't create empty wrappers.",
      interview: [
        { level: "basic", q: "When should you split a component?", a: "When a part has a distinct responsibility, is reused or rendered in a list, has its own state, or the component is too big to read." },
        { level: "intermediate", q: "How can splitting improve performance?", a: "Pushing state down into a small child means updates re-render only that child, not its big parent and siblings." },
        { level: "advanced", q: "How do you split without causing prop drilling?", a: "Use composition: pass prepared JSX as `children` or slot props, so middle components don't forward data they don't use." },
        { level: "tricky", q: "Is a 300-line component always wrong?", a: "Not always. If it's one cohesive form with shared state, splitting may add more props than clarity. Judge by responsibilities, not length." }
      ],
      cheat: [
        "Own job, repeated, own state, hard to read → split",
        "Loop body → its own component",
        "Push state down to cut re-renders",
        "Private helper: same file, top level",
        "No empty wrapper components"
      ]
    },
    related: ["COMP-002", "COMP-017", "RENDER-020", "STATE-021"]
  },

  "COMP-011": {
    tldr: "A small UI kit is a set of generic building blocks (`Button`, `Card`, `Input`, `Modal`) with **small, consistent props**. Pages are built from the kit instead of raw HTML each time.",
    analogy: { icon: "🧰", text: "A chef's knife set. A few good, standard knives cover every recipe. You don't forge a new knife for each dish." },
    visual: { type: "layers", title: "Kit → features → pages", items: [
      { label: "Pages", detail: "`CheckoutPage`, `NotesPage`: arrange feature components." },
      { label: "Feature components", detail: "`CartSummary`, `NoteEditor`: know about your data." },
      { label: "UI kit", detail: "`Button`, `Card`, `Input`, `Modal`: generic, no business data." },
      { label: "HTML + CSS", detail: "`<button>`, `<input>`, `<dialog>` and your design tokens." }
    ]},
    points: [
      "Kit components are **generic**: a `Button` knows nothing about carts or notes.",
      "Keep APIs **small and consistent**: `variant`, `size`, `children`, plus native props passed through.",
      "**Pass through** native props with rest: `{...rest}` so `onClick`, `type`, `disabled` just work.",
      "Use `children` for content so the kit stays flexible.",
      "Build accessibility in once: labels on `Input`, focus and Esc handling in `Modal`. Every page benefits."
    ],
    code: { file: "ui.jsx", lang: "jsx", src: `export function Button({ variant = 'primary', children, ...rest }) {
  return <button className={'btn btn-' + variant} {...rest}>{children}</button>;
}

export function Card({ title, children }) {
  return (
    <section className="card">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}

export function Input({ label, id, ...rest }) {
  return (
    <label htmlFor={id}>
      {label}
      <input id={id} {...rest} />
    </label>
  );
}

export function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}`, walk: [
      { lines: [1, 2, 3], note: "`variant` picks the style; `...rest` forwards `onClick`, `type`, `disabled` to the real `<button>`." },
      { lines: [5, 6, 7, 8, 9, 10, 11, 12], note: "`Card` shows an optional title and wraps any content." },
      { lines: [14, 15, 16, 17, 18, 19, 20, 21], note: "`Input` always has a label linked by `htmlFor`/`id` (accessible by default)." },
      { lines: [23, 24], note: "`Modal` renders nothing when closed." },
      { lines: [26, 27], note: "Clicks inside the dialog don't bubble to the backdrop, so only outside clicks close it." }
    ]},
    output: "Usage: `<Card title=\"New note\"><Input id=\"t\" label=\"Title\" /><Button>Save</Button></Card>` renders a titled card with a labelled input and a button.",
    mistakes: [
      { bad: `function Button({ text, onClick }) {\n  return <button onClick={onClick}>{text}</button>;\n}`, good: `function Button({ children, ...rest }) {\n  return <button {...rest}>{children}</button>;\n}`, why: "Without rest props, every native attribute (`type`, `disabled`, `aria-*`) needs a new prop. Forward them instead." },
      { bad: `function Button({ cartId }) {\n  // calls the cart API itself\n}`, good: `<Button onClick={() => addToCart(id)}>Add</Button>`, why: "Kit components stay generic. Business logic lives in feature components that use the kit." }
    ],
    practice: [
      { level: "B", q: "Add a `size` prop (`sm` | `md` | `lg`, default `md`) to `Button`.", a: "Destructure `size = 'md'` and add it to the class name.", code: `export function Button({ variant = 'primary', size = 'md', children, ...rest }) {\n  return <button className={'btn btn-' + variant + ' btn-' + size} {...rest}>{children}</button>;\n}` },
      { level: "I", q: "Why is `type=\"button\"` worth defaulting in a kit `Button`?", a: "Inside a `<form>`, a plain `<button>` defaults to `submit`. Defaulting `type=\"button\"` avoids accidental submits; callers pass `type=\"submit\"` when needed." },
      { level: "I", q: "Make `Modal` close on the Escape key.", a: "Add a `useEffect` that listens for `keydown` and calls `onClose` when `e.key === 'Escape'`, cleaning up the listener." },
      { level: "C", q: "How could `Modal` avoid being clipped by a parent's `overflow: hidden`?", a: "Render it with `createPortal(…, document.body)` from `react-dom`, or use the native `<dialog>` element with `showModal()`." }
    ],
    quiz: [
      { q: "What should a kit `Button` know about?", options: ["The cart API", "Only how to look and behave like a button", "The current user", "Routing"], answer: 1, why: "Kit components are generic; feature components add business meaning." },
      { q: "Why spread `...rest` onto the native element?", options: ["It's faster", "So native props like `disabled` and `aria-label` work without new props", "React requires it", "To copy state"], answer: 1, why: "Rest props keep the API small while supporting every HTML attribute." },
      { q: "Best way to pass content into `Card`?", options: ["A `html` string prop", "`children`", "A global variable", "`innerHTML`"], answer: 1, why: "`children` lets callers put any JSX inside." }
    ],
    rev: {
      sec30: "A UI kit is a layer of generic components (`Button`, `Card`, `Input`, `Modal`) with small, consistent APIs: `variant`, `size`, `children`, and native props forwarded via `...rest`. No business logic inside. Bake in accessibility once. Feature components and pages are built on top.",
      interview: [
        { level: "basic", q: "What makes a component part of a UI kit?", a: "It's generic and reusable across features, with no knowledge of app data, like `Button` or `Modal`." },
        { level: "intermediate", q: "How do you keep a kit component's API small?", a: "Few semantic props (`variant`, `size`), `children` for content, and forward the rest to the native element." },
        { level: "advanced", q: "How would you build an accessible `Modal`?", a: "`role=\"dialog\"` + `aria-modal`, move focus in and trap it, close on Esc, return focus on close, and render in a portal or use native `<dialog>`." },
        { level: "tricky", q: "Your `Button` has 25 props. What went wrong?", a: "It absorbed feature-specific cases. Move those into wrapper/feature components and keep the base small, using composition." }
      ],
      cheat: [
        "Kit = generic: no business data",
        "API: `variant`, `size`, `children`, `...rest`",
        "Forward native props to the real element",
        "`Input` always labelled; `Modal` handles Esc + focus",
        "Pages → features → kit → HTML",
        "Libraries: shadcn/ui, Radix, MUI do this at scale"
      ]
    },
    related: ["COMP-006", "STYLE-015", "ADV-005", "COMP-017"]
  },

  "COMP-012": {
    tldr: "`export default` marks the **one main thing** a file exports. Importers pick any name: `import Cart from './Cart'`. Simple, but names can drift and tooling helps less.",
    analogy: { icon: "📦", text: "A parcel with one item inside and no label on the item. Whoever opens it can call it whatever they like; handy, but two people might call the same thing different names." },
    visual: { type: "compare", title: "Default export trade-offs", left: { label: "Pros", tone: "good", points: [
      "Clear “main thing” of the file",
      "Short import: `import Cart from './Cart'`",
      "Required by `React.lazy(() => import(...))`",
      "Common convention for one component per file"
    ]}, right: { label: "Cons", tone: "bad", points: [
      "Importer can rename freely: names drift",
      "Only one default per file",
      "Find-and-rename across files is weaker",
      "Typos in the name still import fine"
    ]}},
    points: [
      "Write `export default function Cart() {}`: one per file.",
      "Import **without braces** and with any name: `import Cart from './Cart.jsx'`.",
      "`React.lazy` expects a module whose **default** export is a component.",
      "You can mix: one default + many named exports in the same file.",
      "Many teams pick one style (often named) for consistency; just be consistent."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `// Cart.jsx
export default function Cart() {
  return <aside>🛒 Cart</aside>;
}

// App.jsx
import Cart from './Cart.jsx';
import MyBasket from './Cart.jsx'; // same component, other name!
import { lazy, Suspense } from 'react';

const Checkout = lazy(() => import('./Checkout.jsx')); // needs a default export

export default function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Cart />
      <MyBasket />
      <Checkout />
    </Suspense>
  );
}`, walk: [
      { lines: [2], note: "`export default` before the function: this is the file's main export." },
      { lines: [7], note: "No braces when importing a default." },
      { lines: [8], note: "The importer chooses the name, so the same thing can appear under different names." },
      { lines: [11], note: "`lazy` loads `Checkout.jsx` on demand and uses its default export." }
    ]},
    output: "“Loading…” while `Checkout.jsx` downloads (the whole `Suspense` area waits), then two “🛒 Cart” panels (same component, two names) and the Checkout.",
    mistakes: [
      { bad: `export default function Cart() {}\nexport default function Badge() {}`, good: `export default function Cart() {}\nexport function Badge() {}`, why: "A module can have only one default export. Make the others named." },
      { bad: `import { Cart } from './Cart.jsx'; // Cart is a default export`, good: `import Cart from './Cart.jsx';`, why: "Braces import a named export. For a default export, drop the braces." }
    ],
    practice: [
      { level: "B", q: "Export `NoteList` as the default from `NoteList.jsx` and import it in `App.jsx`.", a: "`export default function NoteList() {}` then `import NoteList from './NoteList.jsx';`" },
      { level: "I", q: "Can you write `export default const Cart = () => …`?", a: "No, that's a syntax error. Write `const Cart = () => …;` then `export default Cart;`." },
      { level: "I", q: "Import a default and a named export from one file.", a: "`import Cart, { CartBadge } from './Cart.jsx';`" },
      { level: "C", q: "Your page lazy-loads `Reports.jsx`, which only has a named export. Fix it without changing that file.", a: "Map it: `lazy(() => import('./Reports.jsx').then(m => ({ default: m.Reports })))`." }
    ],
    quiz: [
      { q: "How many default exports can a file have?", options: ["Any number", "One", "Two", "None in React"], answer: 1, why: "Only one default per module." },
      { q: "Correct import of a default export `Cart`?", options: ["`import { Cart } from './Cart'`", "`import Cart from './Cart'`", "`import * Cart from './Cart'`", "`require Cart`"], answer: 1, why: "Defaults are imported without braces." },
      { q: "Main downside of default exports?", options: ["They're slower", "Importers can rename them freely, so names drift", "They break JSX", "They can't be components"], answer: 1, why: "Nothing forces a consistent name across the codebase." }
    ],
    rev: {
      sec30: "`export default` exports a module's single main value; import it without braces under any name. Good for one-component-per-file and required by `React.lazy`. Downsides: names drift, only one per file, weaker auto-rename. Mix with named exports as needed.",
      interview: [
        { level: "basic", q: "What's a default export?", a: "The one main value a module exports, imported without braces and with any local name." },
        { level: "intermediate", q: "Why do some teams avoid default exports?", a: "Names aren't enforced, so the same component gets different names across files, and refactoring tools rename less reliably." },
        { level: "intermediate", q: "Which React API relies on default exports?", a: "`React.lazy`, which expects the dynamic import to resolve to a module with a default component." },
        { level: "tricky", q: "Why is `export default const X = 1` invalid?", a: "`export default` takes an expression or a function/class declaration, not a `const` declaration. Declare first, then `export default X`." }
      ],
      compare: { cols: ["", "Default", "Named"], rows: [
        ["Per file", "one", "many"],
        ["Import syntax", "`import X from`", "`import { X } from`"],
        ["Name fixed?", "no, importer picks", "yes (or `as`)"],
        ["`React.lazy`", "works directly", "needs `.then` mapping"]
      ]},
      cheat: [
        "`export default function Cart() {}`",
        "`import Cart from './Cart.jsx'` (no braces)",
        "One default per file",
        "`React.lazy` needs a default export",
        "Mix: `import Cart, { Badge } from './Cart.jsx'`"
      ]
    },
    related: ["COMP-013", "COMP-014", "WEB-027", "ADV-002"]
  },

  "COMP-013": {
    tldr: "Named exports (`export function Button`) let a file export many things under **fixed names**, imported with braces. A **barrel file** (`index.js`) re-exports a folder so you import from one place.",
    analogy: { icon: "🏪", text: "Labelled shelves in a shop. Each product has a fixed name tag. A barrel file is the shop's front counter: ask there for any item instead of walking to each shelf." },
    visual: { type: "flow", title: "From files to one import line", steps: [
      { label: "Button.jsx", detail: "`export function Button() {}`" },
      { label: "Card.jsx", detail: "`export function Card() {}`" },
      { label: "ui/index.js (barrel)", detail: "`export { Button } from './Button.jsx';` and the same for `Card`." },
      { label: "Page.jsx", detail: "`import { Button, Card } from './ui';`: one tidy line." }
    ]},
    points: [
      "Named export: `export function Card() {}`. Import with **braces and the exact name**: `import { Card } from './Card.jsx'`.",
      "Many per file; editors auto-import and rename them reliably.",
      "Rename on import with `as`: `import { Card as ProductCard }`.",
      "**Barrel** = `index.js` that re-exports a folder: `export { Button } from './Button.jsx'`.",
      "Barrels tidy imports but can slow dev tools and cause circular imports in big apps; use them for small, stable folders like a UI kit."
    ],
    code: { file: "ui/*.jsx", lang: "jsx", src: `// ui/Button.jsx
export function Button({ children, ...rest }) {
  return <button {...rest}>{children}</button>;
}

// ui/Card.jsx
export function Card({ children }) {
  return <section className="card">{children}</section>;
}

// ui/index.js  (barrel)
export { Button } from './Button.jsx';
export { Card } from './Card.jsx';

// NotesPage.jsx
import { Button, Card } from './ui';

export default function NotesPage() {
  return (
    <Card>
      <p>📝 Buy milk</p>
      <Button onClick={() => alert('Done!')}>Done</Button>
    </Card>
  );
}`, walk: [
      { lines: [2], note: "Named export: the name `Button` is part of the contract." },
      { lines: [7], note: "Another named export from its own file." },
      { lines: [12, 13], note: "The barrel re-exports both. It holds no logic of its own." },
      { lines: [16], note: "One import from the folder. Vite resolves `./ui` to `./ui/index.js`." }
    ]},
    output: "A card showing “📝 Buy milk” and a Done button that pops an alert.",
    mistakes: [
      { bad: `import Button from './ui/Button.jsx'; // it's a named export`, good: `import { Button } from './ui/Button.jsx';`, why: "Without braces you're asking for the default export, which doesn't exist here." },
      { bad: `import { button } from './ui';`, good: `import { Button } from './ui';`, why: "Named imports must match the exported name exactly, including case." }
    ],
    practice: [
      { level: "B", q: "Export `formatPrice` and `formatDate` from `format.js` and import both.", a: "`export function formatPrice…` / `export function formatDate…`, then `import { formatPrice, formatDate } from './format.js';`" },
      { level: "I", q: "Import `Card` but call it `RecipeCard` locally.", a: "`import { Card as RecipeCard } from './ui';`" },
      { level: "I", q: "Write a barrel for `Input` and `Modal`.", a: "Re-export each.", code: `export { Input } from './Input.jsx';\nexport { Modal } from './Modal.jsx';` },
      { level: "C", q: "Re-export a default export `Avatar` as a named one in the barrel.", a: "`export { default as Avatar } from './Avatar.jsx';`" }
    ],
    quiz: [
      { q: "How do you import a named export `Card`?", options: ["`import Card from './Card'`", "`import { Card } from './Card'`", "`import Card() from './Card'`", "`import * from './Card'`"], answer: 1, why: "Named exports use braces and the exact name." },
      { q: "What is a barrel file?", options: ["A file with all app state", "An `index.js` that re-exports a folder's modules", "A CSS reset", "A test setup file"], answer: 1, why: "Barrels gather exports so imports come from one path." },
      { q: "A risk of large barrel files?", options: ["They break JSX", "Circular imports and slower dev tooling", "They disable Vite", "They make names change"], answer: 1, why: "Importing one thing can pull the whole folder graph, and cycles get easier to create." }
    ],
    rev: {
      sec30: "Named exports give fixed names, many per file, imported with braces (`import { Card }`), renamable with `as`. Tooling auto-imports and refactors them well. Barrel files (`index.js`) re-export a folder for tidy imports, but big barrels can cause cycles and slower dev tooling.",
      interview: [
        { level: "basic", q: "Named vs default export?", a: "Named: many per file, fixed name, braces on import. Default: one per file, importer chooses the name, no braces." },
        { level: "intermediate", q: "What's a barrel file and why use it?", a: "An `index.js` that re-exports a folder's modules so consumers import from one path, hiding internal file layout." },
        { level: "advanced", q: "Downsides of barrels?", a: "They can create circular dependencies, make dev servers and tests load more modules, and hurt tree shaking with side-effectful files." },
        { level: "tricky", q: "How do you re-export a default as named?", a: "`export { default as Avatar } from './Avatar.jsx';`" }
      ],
      cheat: [
        "`export function Card() {}`",
        "`import { Card } from './Card.jsx'`",
        "Rename: `import { Card as RecipeCard }`",
        "Barrel: `export { Card } from './Card.jsx'`",
        "Default → named: `export { default as X } from`",
        "Keep barrels small (UI kit), avoid one giant barrel"
      ]
    },
    related: ["COMP-012", "COMP-014", "WEB-026", "PERF-011"]
  },

  "COMP-014": {
    tldr: "Import components with a **relative path** (`./Cart.jsx`, `../ui/Button.jsx`) or set up a **path alias** like `@/` so deep files import `@/components/ui` instead of `../../../components/ui`.",
    analogy: { icon: "🗺️", text: "Directions vs an address. “Two doors down, then upstairs” (relative path) depends on where you stand. “12 Baker Street” (alias) works from anywhere." },
    visual: { type: "compare", title: "Relative paths vs alias", left: { label: "Relative", tone: "neutral", points: [
      "`./` = this folder, `../` = one folder up",
      "Works with zero setup",
      "Deep files: `../../../ui/Button.jsx`",
      "Breaks when you move the importing file"
    ]}, right: { label: "Alias `@/` → `src/`", tone: "good", points: [
      "`import { Button } from '@/ui'`",
      "Same path from any file",
      "Moving a file doesn't break its imports",
      "Needs `resolve.alias` in `vite.config.js`"
    ]}},
    points: [
      "Relative imports start with `./` or `../`. Bare names (`'react'`) come from `node_modules`.",
      "Path and file name are **case-sensitive** on Linux servers, even if Windows/macOS let it slide.",
      "Vite resolves `./ui` to `./ui/index.js` and lets you omit `.js`/`.jsx` extensions.",
      "Set up `@` in `vite.config.js` with `resolve.alias`; add `jsconfig.json`/`tsconfig.json` `paths` so the editor understands it too.",
      "TypeScript projects: Vite 8 can read `tsconfig.json` `paths` itself with `resolve.tsconfigPaths: true` (off by default).",
      "Import order convention: packages first, then aliases, then relative files, then CSS."
    ],
    code: { file: "vite.config.js", lang: "js", src: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

// jsconfig.json (so VS Code autocompletes '@/...')
// { "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }

// src/features/cart/CartPage.jsx
// import { useState } from 'react';            // package
// import { Button } from '@/components/ui';    // alias
// import CartRow from './CartRow.jsx';          // relative
// import './CartPage.css';                      // styles`, walk: [
      { lines: [3], note: "Node helpers to build an absolute path to `src` from this config file." },
      { lines: [7, 8, 9, 10, 11], note: "`@` now means the `src` folder for every import." },
      { lines: [14, 15], note: "Tell the editor about the alias too, or autocomplete and go-to-definition won't follow it." },
      { lines: [18, 19, 20, 21], note: "Typical import order: packages, aliases, relative files, CSS." }
    ]},
    mistakes: [
      { bad: `import Cart from './cart.jsx'; // file is Cart.jsx`, good: `import Cart from './Cart.jsx';`, why: "Works on Windows/macOS but fails on Linux CI or hosting, where paths are case-sensitive." },
      { bad: `import { Button } from '../../../../components/ui/Button.jsx';`, good: `import { Button } from '@/components/ui';`, why: "Long `../` chains are hard to read and break when files move. Use an alias for deep imports." }
    ],
    practice: [
      { level: "B", q: "`App.jsx` and `Header.jsx` are both in `src/`. Write the import.", a: "`import Header from './Header.jsx';`" },
      { level: "B", q: "From `src/pages/Home.jsx`, import `src/components/Card.jsx` (default export) relatively.", a: "`import Card from '../components/Card.jsx';`" },
      { level: "I", q: "Rewrite that import using the `@` alias.", a: "`import Card from '@/components/Card.jsx';`" },
      { level: "C", q: "The build works locally but CI says “Cannot find module './navbar'”. Likely cause?", a: "Case mismatch: the file is `NavBar.jsx`. Linux file systems are case-sensitive." }
    ],
    quiz: [
      { q: "What does `../` mean in an import path?", options: ["The `src` folder", "One folder up from this file", "`node_modules`", "The project root"], answer: 1, why: "`../` goes up one directory relative to the importing file." },
      { q: "`import { useState } from 'react'` resolves to:", options: ["`./react.js`", "The `react` package in `node_modules`", "A CDN", "`src/react`"], answer: 1, why: "Bare specifiers resolve to installed packages." },
      { q: "You added `@` in `vite.config.js`, but VS Code shows red squiggles. Fix?", options: ["Restart the browser", "Add `paths` in `jsconfig.json`/`tsconfig.json`", "Rename files to `.ts`", "Remove the alias"], answer: 1, why: "Vite and the editor are separate; the editor reads `paths` from its config." }
    ],
    rev: {
      sec30: "Relative imports (`./`, `../`) work with no setup but get long and fragile in deep folders. A path alias (`@` → `src`) via `resolve.alias` in `vite.config.js`, mirrored in `jsconfig`/`tsconfig` `paths`, gives stable imports. Bare names come from `node_modules`. Mind case sensitivity on Linux.",
      interview: [
        { level: "basic", q: "Relative vs bare import?", a: "Relative starts with `./` or `../` and points to a file. Bare (`'react'`) resolves to a package in `node_modules`." },
        { level: "intermediate", q: "How do you set up a path alias in Vite?", a: "Add `resolve.alias: { '@': path-to-src }` in `vite.config.js` and matching `paths` in `jsconfig.json`/`tsconfig.json` for the editor." },
        { level: "intermediate", q: "Why might imports work locally but fail in CI?", a: "Case sensitivity: Linux treats `Cart.jsx` and `cart.jsx` as different files." },
        { level: "advanced", q: "Do aliases affect the production bundle?", a: "No. The bundler resolves them at build time; the output contains no alias paths." }
      ],
      cheat: [
        "`./` this folder, `../` one up",
        "Bare `'react'` → `node_modules`",
        "Alias: `resolve.alias` in `vite.config.js`",
        "Mirror it in `jsconfig`/`tsconfig` `paths`",
        "Paths are case-sensitive on Linux",
        "Order: packages, aliases, relative, CSS"
      ]
    },
    related: ["COMP-012", "COMP-013", "COMP-015", "ENV-004"]
  },

  "COMP-015": {
    tldr: "Organise **by type** (`components/`, `hooks/`, `pages/`) for small apps, and **by feature** (`features/cart/`, `features/notes/`) as the app grows, so everything for one feature lives together.",
    analogy: { icon: "🗄️", text: "A kitchen sorted by type puts all knives in one drawer, all pans in another. A meal-kit box puts everything for one recipe together. Big kitchens use meal kits." },
    visual: { type: "tree", title: "Feature-based folders", root: { label: "src", children: [
      { label: "app", note: "App.jsx, routes, providers" },
      { label: "features", children: [
        { label: "cart", note: "CartPage, CartRow, useCart, cart.css" },
        { label: "products", note: "ProductList, ProductCard, api.js" },
        { label: "auth", note: "LoginForm, useAuth" }
      ]},
      { label: "components/ui", note: "shared kit: Button, Card, Modal" },
      { label: "lib", note: "shared helpers: formatPrice, http" },
      { label: "main.jsx" }
    ]}},
    points: [
      "**By type**: simple, but a single feature's files are spread across 4 folders.",
      "**By feature**: everything for `cart` (components, hooks, API calls, styles, tests) sits in one folder.",
      "Truly shared things go in `components/ui` and `lib`; everything else belongs to a feature.",
      "Features import shared code, but avoid features importing deep into **other** features.",
      "Start simple; move to features when you notice you're hopping folders for every change."
    ],
    code: { file: "features/cart/CartPage.jsx", lang: "jsx", src: `// src/features/cart/
//   CartPage.jsx   CartRow.jsx   useCart.js   cart.css   CartPage.test.jsx

import { Button } from '@/components/ui';   // shared kit
import { formatPrice } from '@/lib/format';  // shared helper
import { useCart } from './useCart.js';       // same feature
import CartRow from './CartRow.jsx';          // same feature
import './cart.css';

export default function CartPage() {
  const { items, total, clear } = useCart();
  return (
    <section>
      <h1>🛒 Cart</h1>
      <ul>{items.map((i) => <CartRow key={i.id} item={i} />)}</ul>
      <p>Total: {formatPrice(total)}</p>
      <Button variant="ghost" onClick={clear}>Empty cart</Button>
    </section>
  );
}`, walk: [
      { lines: [1, 2], note: "All cart files, including the test, live in one folder." },
      { lines: [4, 5], note: "Shared code comes from `components/ui` and `lib`." },
      { lines: [6, 7, 8], note: "Feature-local files are imported relatively: short and obvious." },
      { lines: [11], note: "The feature's own hook holds its logic." }
    ]},
    mistakes: [
      { bad: `import { useCart } from '@/features/cart/hooks/internal/useCart';\n// from inside features/products`, good: `// export what others need from features/cart/index.js\nimport { useCart } from '@/features/cart';`, why: "Reaching deep into another feature couples them. Expose a small public entry point instead." }
    ],
    practice: [
      { level: "B", q: "Sort these into type folders: `Navbar.jsx`, `useFetch.js`, `HomePage.jsx`, `formatDate.js`.", a: "`components/Navbar.jsx`, `hooks/useFetch.js`, `pages/HomePage.jsx`, `utils/formatDate.js`." },
      { level: "I", q: "Reorganise a notes app by feature.", a: "`features/notes/` (NoteList, NoteEditor, useNotes), `features/auth/`, plus `components/ui/` for shared parts." },
      { level: "I", q: "`Button` is used by cart and notes. Where does it go?", a: "`components/ui/`: it's shared, not owned by a feature." },
      { level: "C", q: "When is by-type fine forever?", a: "Small apps, demos and courses with a handful of screens; the overhead of features isn't worth it there." }
    ],
    quiz: [
      { q: "Main benefit of by-feature folders?", options: ["Fewer files", "Everything for one feature lives together", "Faster builds", "No imports needed"], answer: 1, why: "Changes to one feature stay in one folder." },
      { q: "Where does a `Modal` used across the app go?", options: ["`features/cart`", "Shared `components/ui`", "`node_modules`", "`public/`"], answer: 1, why: "Shared, generic UI belongs in a shared folder." },
      { q: "By-type works best for:", options: ["Large apps with 10 teams", "Small apps with few screens", "Never", "Only TypeScript"], answer: 1, why: "It's simple and fine until features multiply." }
    ],
    rev: {
      sec30: "By type (`components/`, `hooks/`, `pages/`) is simple and good for small apps. By feature (`features/cart/` holding its components, hooks, API, styles, tests) scales better: changes stay local. Shared kit and helpers live in `components/ui` and `lib`. Avoid deep imports across features.",
      interview: [
        { level: "basic", q: "Two ways to organise React folders?", a: "By type (components, hooks, pages) or by feature (cart, products, auth), each holding all its own files." },
        { level: "intermediate", q: "Why does feature-based scale better?", a: "Related files stay together, so one change touches one folder, ownership is clear, and deleting a feature is easy." },
        { level: "advanced", q: "How do you stop features getting tangled?", a: "Give each feature a small public `index.js`, share only via `components/ui` and `lib`, and use lint rules to forbid deep cross-feature imports." },
        { level: "tricky", q: "Does React have an official folder structure?", a: "No. React docs say it's up to you; frameworks like Next.js impose routing folders only." }
      ],
      compare: { cols: ["", "By type", "By feature"], rows: [
        ["Best for", "small apps", "growing apps"],
        ["One change touches", "many folders", "one folder"],
        ["Shared code", "everywhere", "`components/ui`, `lib`"],
        ["Ownership", "unclear", "per feature"]
      ]},
      cheat: [
        "Small app: by type is fine",
        "Growing app: `features/<name>/` holds everything",
        "Shared: `components/ui`, `lib`",
        "No deep imports across features",
        "React has no official structure"
      ]
    },
    related: ["COMP-004", "COMP-014", "COMP-011", "ENV-004"]
  },

  "COMP-016": {
    tldr: "A **container** gets and manages data; a **presentational** component just shows what it's given via props. Today a **custom hook** usually plays the container role, so you rarely need separate container components.",
    analogy: { icon: "🍽️", text: "The kitchen (container) cooks the food; the waiter (presentational) just carries the plate to the table. Today the kitchen is often a recipe (custom hook) any waiter can use." },
    visual: { type: "flow", title: "Data logic → display", steps: [
      { label: "Data source", detail: "An API, `localStorage` or app state holds the weather data." },
      { label: "Logic (hook)", detail: "`useWeather(city)` fetches and returns `{ data, loading, error }`." },
      { label: "Page component", detail: "`WeatherPage` calls the hook and decides what to show." },
      { label: "Display component", detail: "`WeatherCard({ temp, icon })`: props in, JSX out, no fetching." }
    ]},
    points: [
      "**Presentational**: props in, JSX out. No fetching, easy to reuse and test.",
      "**Container**: owns data, state and effects, then passes results down.",
      "**Hooks changed this**: pull logic into `useSomething()`, and the component calling it is a thin wrapper.",
      "Don't make it a strict rule; split when the display is reusable or the logic is complex.",
      "In real apps, data fetching usually uses **TanStack Query** (`useQuery`) or router loaders."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

// Logic: a custom hook (the modern "container")
function useWeather(city) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch('/api/weather?city=' + city)
      .then((r) => r.json())
      .then((json) => { if (!ignore) setData(json); });
    return () => { ignore = true; };
  }, [city]);
  return data;
}

// Display: presentational, props only
function WeatherCard({ city, temp, icon }) {
  return <article>{icon} {city}: {temp}°C</article>;
}

export default function WeatherPage({ city }) {
  const weather = useWeather(city);
  if (!weather) return <p>Loading…</p>;
  return <WeatherCard city={city} temp={weather.temp} icon={weather.icon} />;
}`, walk: [
      { lines: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], note: "All data logic lives in the hook. `ignore` prevents a stale response from overwriting a newer city." },
      { lines: [17, 18, 19], note: "`WeatherCard` just renders props. Reuse it in a list, a widget or a test with fake data." },
      { lines: [22], note: "The page calls the hook: that's the whole container role now." },
      { lines: [23, 24], note: "Choose what to show, then hand plain values to the display component." }
    ]},
    output: "“Loading…” first, then e.g. “🌦️ London: 18°C”.",
    mistakes: [
      { bad: `function WeatherCard({ city }) {\n  // fetches inside the card\n  useEffect(() => { fetch(...) }, [city]);\n}`, good: `function WeatherCard({ city, temp, icon }) {\n  return <article>{icon} {city}: {temp}°C</article>;\n}`, why: "A display card that fetches can't be reused with other data or tested without mocking the network." },
      { bad: `class WeatherContainer extends React.Component { ... }`, good: `function useWeather(city) { ... }`, why: "Container classes are the old pattern. A custom hook shares the same logic with less code and across components." }
    ],
    practice: [
      { level: "B", q: "Is `function Price({ amount }) { return <b>£{amount}</b>; }` presentational?", a: "Yes: props in, JSX out, no data logic." },
      { level: "I", q: "Turn a `NotesList` that reads `localStorage` itself into hook + display.", a: "Move reading into `useNotes()`; `NotesList({ notes })` only renders.", code: `function NotesPage() {\n  const notes = useNotes();\n  return <NotesList notes={notes} />;\n}` },
      { level: "I", q: "How does this split help testing?", a: "Render `WeatherCard` with fake props, with no network mocks. Test `useWeather` separately (e.g. with MSW)." },
      { level: "C", q: "Replace `useWeather` with TanStack Query.", a: "Use `useQuery` with a cache key and fetcher.", code: `const { data, isPending } = useQuery({\n  queryKey: ['weather', city],\n  queryFn: () => fetch('/api/weather?city=' + city).then(r => r.json()),\n});` }
    ],
    quiz: [
      { q: "A presentational component:", options: ["Fetches its own data", "Renders only what it receives via props", "Must be a class", "Can't have children"], answer: 1, why: "Display-only: props in, UI out." },
      { q: "In modern React, what usually replaces container components?", options: ["Higher-order classes", "Custom hooks", "Redux only", "Global variables"], answer: 1, why: "Hooks extract stateful logic so any component can use it." },
      { q: "Main benefit of separating logic from display?", options: ["Smaller bundle", "Reusable, easily tested display components", "No re-renders", "No need for props"], answer: 1, why: "Display components work with any data source and test with fake props." }
    ],
    rev: {
      sec30: "Container components own data and logic; presentational ones render props. The pattern came from class days. With hooks, logic moves into custom hooks (`useWeather`), and the page calling it is a thin container. Keep display components pure and reusable; use the split when it helps, not as dogma.",
      interview: [
        { level: "basic", q: "Presentational vs container component?", a: "Presentational renders UI from props. Container fetches or manages data and passes it down." },
        { level: "intermediate", q: "How did hooks change this pattern?", a: "Custom hooks extract the container's logic, so you no longer need wrapper components just to hold state." },
        { level: "advanced", q: "Where does data fetching usually live in a modern React app?", a: "In a data library hook like TanStack Query's `useQuery`, router loaders, or Server Components in frameworks, not inside display components." },
        { level: "tricky", q: "Is a component that uses `useState` for an open/closed toggle still presentational?", a: "Yes, in practice. Local UI state is fine; the line is about app data and side effects, not any state at all." }
      ],
      cheat: [
        "Presentational: props in, JSX out",
        "Container: data, state, effects",
        "Modern container = custom hook (`useX`)",
        "Display components test with fake props",
        "Local UI state (open/closed) is fine in display components",
        "Real fetching: TanStack Query or loaders"
      ]
    },
    related: ["HOOKS-021", "HOOKS-025", "STORE-020", "COMP-017"]
  },

  "COMP-017": {
    tldr: "Good components do **one job**, render **purely** (same props + state → same output, no side effects while rendering), and have a **small, clear API** of props.",
    analogy: { icon: "🧮", text: "A good calculator key. It does one thing, gives the same result every time you press it, and you don't need a manual to use it." },
    visual: { type: "layers", title: "Three principles", items: [
      { label: "Small API", detail: "Few, well-named props: `variant`, `size`, `onSelect`, `children`." },
      { label: "Pure rendering", detail: "Same inputs → same JSX. No fetching, mutating or timers while rendering." },
      { label: "Single responsibility", detail: "One reason to change. `CartRow` shows a row; it doesn't compute tax." }
    ]},
    points: [
      "**Single responsibility**: if you describe it with “and”, consider splitting.",
      "**Pure render**: no changing outside variables, props or DOM during render. Side effects go in **event handlers** or `useEffect`.",
      "Strict Mode **double-renders in development** to catch impure components; production renders once.",
      "**Small API**: prefer `variant=\"danger\"` over 5 booleans; name callbacks `onX`.",
      "**Derive, don't duplicate**: compute values like totals during render instead of storing extra state."
    ],
    code: { file: "CartTotal.jsx", lang: "jsx", src: `let renders = 0;

// ❌ Impure: changes an outside variable while rendering
function BadTotal({ items }) {
  renders++;
  items.sort((a, b) => a.price - b.price); // mutates props!
  return <p>Total: £{items.reduce((s, i) => s + i.price, 0)} (render {renders})</p>;
}

// ✅ Pure, one job, small API
export default function CartTotal({ items, currency = '£' }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return <p>Total: {currency}{total.toFixed(2)}</p>;
}

export function App() {
  const items = [
    { id: 1, name: 'Mug', price: 8, qty: 2 },
    { id: 2, name: 'Tea', price: 4.5, qty: 1 },
  ];
  return <CartTotal items={items} />;
}`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "Changing `renders` and sorting props in place make output depend on how often React renders. In Strict Mode dev you'd see it jump by 2." },
      { lines: [11], note: "Small API: `items` plus an optional `currency` with a default." },
      { lines: [12], note: "Total is derived from props during render: no extra state to keep in sync." },
      { lines: [13], note: "Same `items` in → same output, every time." }
    ]},
    output: "“Total: £20.50”.",
    mistakes: [
      { bad: `function List({ items }) {\n  items.push({ id: 99 });\n  return items.map(i => <li key={i.id} />);\n}`, good: `function List({ items }) {\n  const all = [...items, { id: 99 }];\n  return all.map(i => <li key={i.id} />);\n}`, why: "Mutating props during render is impure: it changes the parent's data and breaks with double renders." },
      { bad: `function Cart({ items }) {\n  const [total, setTotal] = useState(0);\n  useEffect(() => setTotal(sum(items)), [items]);\n}`, good: `function Cart({ items }) {\n  const total = sum(items);\n}`, why: "Storing derived values in state adds an extra render and can go out of sync. Compute it during render." }
    ],
    practice: [
      { level: "B", q: "Is `function Clock() { return <p>{new Date().toLocaleTimeString()}</p>; }` pure?", a: "No: same inputs give different output each render. Keep the time in state updated by an effect/interval, or pass it in as a prop." },
      { level: "I", q: "A `ProductCard` shows the product AND manages the wishlist API. Apply single responsibility.", a: "Keep `ProductCard` display-only with an `onWishlist` callback; move API logic to a hook like `useWishlist`." },
      { level: "I", q: "Simplify this API: `<Badge isSale isNew isSoldOut />`.", a: "`<Badge status=\"sale\" />` with `status` as one of `sale | new | soldOut`." },
      { level: "C", q: "Why does React 19 Strict Mode render components twice in dev?", a: "To expose impure render logic: if two renders give different results or side effects, you have a bug. Production renders once." }
    ],
    quiz: [
      { q: "Which is allowed during render?", options: ["`fetch()` a URL", "Computing `total` from props", "Mutating a prop array", "`document.title = 'x'`"], answer: 1, why: "Pure calculation is fine; side effects belong in handlers or effects." },
      { q: "Why does Strict Mode double-render in development?", options: ["It's a bug", "To catch impure rendering", "To speed up the app", "It also happens in production"], answer: 1, why: "Calling render twice reveals hidden side effects. Production renders once." },
      { q: "Best sign a component breaks single responsibility?", options: ["It has 3 props", "You describe it with “and … and …”", "It uses `children`", "It's under 30 lines"], answer: 1, why: "Multiple jobs usually mean multiple reasons to change." }
    ],
    rev: {
      sec30: "Design components with single responsibility (one reason to change), pure rendering (same props/state → same JSX, no side effects in the body), and a small, clear API (few semantic props, `onX` callbacks, defaults). Derive values instead of duplicating state. Strict Mode double-renders in dev to catch impurity.",
      interview: [
        { level: "basic", q: "What does it mean for a component to be pure?", a: "Given the same props, state and context, it returns the same JSX and doesn't change anything outside itself during render." },
        { level: "intermediate", q: "Where do side effects go if not in render?", a: "In event handlers first; in `useEffect` when syncing with an external system after render." },
        { level: "intermediate", q: "What makes a good component API?", a: "Few, well-named props, enums over boolean piles, `children` for content, `onX` callbacks, sensible defaults and forwarding native props." },
        { level: "advanced", q: "Why does purity matter for concurrent rendering and the React Compiler?", a: "React may render, pause, discard or repeat work. The Compiler auto-memoises assuming purity. Impure renders produce wrong or inconsistent results." },
        { level: "tricky", q: "Is local mutation during render ever OK?", a: "Yes, mutating a variable or array you created in that same render is fine. Mutating props, state or outside variables is not." }
      ],
      predict: [
        { code: `let n = 0;\nfunction Hello() {\n  n++;\n  return <p>{n}</p>;\n}\n// rendered once inside <StrictMode> in dev`, answer: "Shows 2 (dev)", why: "Strict Mode calls the component twice in development and keeps the second result, exposing the outside mutation. In production it shows 1." }
      ],
      cheat: [
        "One job: if it needs “and”, split it",
        "Pure: same inputs → same JSX",
        "No side effects in render; use handlers or `useEffect`",
        "Strict Mode double-renders in dev only",
        "Derive values; don't mirror props into state",
        "Small API: `variant`, `size`, `onX`, `children`"
      ]
    },
    related: ["COMP-010", "RENDER-015", "STATE-022", "ADV-021"]
  }
};
