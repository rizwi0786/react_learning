export default {
  "INTRO-001": {
    tldr: "React is a JavaScript library (a toolkit, not a full framework) for building user interfaces out of small, reusable pieces called components. You describe the screen for the current data; React updates the page.",
    analogy: { icon: "🧱", text: "LEGO for screens. Each brick (component) is built once, like a product card, and snapped together many times to make a whole shop page." },
    visual: { type: "tree", title: "A shop page is a tree of components", root: { label: "App", note: "the root component", children: [
      { label: "Header", children: [{ label: "Logo" }, { label: "CartBadge" }] },
      { label: "ProductList", children: [{ label: "ProductCard" }, { label: "ProductCard" }, { label: "ProductCard" }] },
      { label: "Footer" }
    ]}},
    points: [
      "React handles the **view layer** only: what the user sees and clicks.",
      "A **component** is a JavaScript function that returns UI written in **JSX** (HTML-like syntax).",
      "Components take inputs (**props**) and can remember data (**state**).",
      "You write **what** the UI should look like; React works out **how** to change the DOM (declarative).",
      "Built and maintained by Meta and the open-source community. Current version: **React 19.2**.",
      "`react` defines components and hooks; `react-dom` puts them in the browser (`createRoot`)."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';

function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>₹{price}</p>
    </div>
  );
}

function App() {
  return (
    <main>
      <h1>Mini Shop</h1>
      <ProductCard name="Coffee mug" price={299} />
      <ProductCard name="Notebook" price={149} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);`, walk: [
      { lines: [1], note: "`createRoot` comes from `react-dom/client`: it connects React to a DOM element." },
      { lines: [3, 4, 5, 6, 7, 8, 9, 10], note: "A component: a function with a **Capitalised** name that returns JSX." },
      { lines: [16, 17], note: "Reuse the same component twice with different props." },
      { lines: [22], note: "Render the root component into `<div id=\"root\">` in index.html." }
    ]},
    output: "A heading “Mini Shop” and two product cards: Coffee mug ₹299 and Notebook ₹149.",
    mistakes: [
      { bad: `function productCard() { ... }\n<productCard />`, good: `function ProductCard() { ... }\n<ProductCard />`, why: "Lowercase tags are treated as HTML elements. Component names must start with a capital letter." },
      { bad: `return (\n  <h1>Shop</h1>\n  <p>Welcome</p>\n);`, good: `return (\n  <>\n    <h1>Shop</h1>\n    <p>Welcome</p>\n  </>\n);`, why: "A component returns one root. Wrap siblings in a fragment `<>...</>` or a `<div>`." },
      { bad: `ReactDOM.render(<App />, root); // legacy, removed in React 19`, good: `createRoot(root).render(<App />);`, why: "`ReactDOM.render` was removed in React 19. Use `createRoot` from `react-dom/client`." }
    ],
    practice: [
      { level: "B", q: "Add a third `ProductCard` for “Water bottle” at ₹399.", a: "Add `<ProductCard name=\"Water bottle\" price={399} />` inside `<main>`." },
      { level: "B", q: "Make a `Header` component that shows the shop name and use it in `App`.", a: "Write `function Header() { return <h1>Mini Shop</h1>; }` and replace the `<h1>` with `<Header />`.", code: `function Header() {\n  return <h1>Mini Shop</h1>;\n}` },
      { level: "I", q: "Store products in an array and render them with `map`.", a: "`products.map(p => <ProductCard key={p.id} {...p} />)`. Give each item a unique `key`." },
      { level: "C", q: "Draw the component tree for a chat app (sidebar, message list, input box).", a: "App → Sidebar (ChatItem × n), ChatWindow → MessageList (Message × n), MessageInput." }
    ],
    quiz: [
      { q: "What is React?", options: ["A full framework with routing and a database layer", "A library for building UIs from components", "A CSS framework", "A new programming language"], answer: 1, why: "React focuses on the view layer. Routing, data and server rendering come from other libraries or frameworks." },
      { q: "What does a React component return?", options: ["A DOM node", "An HTML string", "A description of UI (JSX / React elements)", "Nothing; it edits the page directly"], answer: 2, why: "Components return elements. React turns those into real DOM updates." },
      { q: "Where does `createRoot` come from?", options: ["`react`", "`react-dom/client`", "`react-router`", "`vite`"], answer: 1, why: "The browser renderer lives in `react-dom`; `createRoot` is in `react-dom/client`." }
    ],
    rev: {
      sec30: "React is a JavaScript library for building UIs from components. A component is a function that returns JSX. You describe the UI for the current data and React updates the DOM. `react` holds components and hooks; `react-dom` renders them in the browser via `createRoot`.",
      interview: [
        { level: "basic", q: "Is React a library or a framework?", a: "A library focused on the view layer. Frameworks like Next.js or React Router framework mode add routing, data loading and server rendering on top." },
        { level: "basic", q: "What is a component?", a: "A reusable JavaScript function that returns JSX describing part of the UI. It can receive props and hold state." },
        { level: "intermediate", q: "Element vs component?", a: "A component is the function (`Card`). An element is the plain object `<Card />` creates, describing what to render." },
        { level: "intermediate", q: "Difference between `react` and `react-dom`?", a: "`react` has components, elements and hooks. `react-dom` is the browser renderer; `createRoot` lives in `react-dom/client`." },
        { level: "tricky", q: "Can you use React without JSX?", a: "Yes. JSX compiles to function calls (`jsx()` / `createElement()`). You can call them directly; JSX is just more readable." }
      ],
      predict: [
        { code: `function menu() { return <ul><li>Tea</li></ul>; }\nfunction App() { return <menu />; }`, answer: "An empty `<menu>` HTML element; the list does not show.", why: "Lowercase `menu` is treated as the built-in HTML `<menu>` tag, not your component." }
      ],
      scenario: [
        { q: "A shop shows 500 product tiles that look the same. How does React help?", a: "Write one `ProductTile` component, keep products in an array and `map` over it. A design change happens in one place." }
      ],
      cheat: [
        "React = UI library built on components",
        "Component = function returning JSX, name starts with a capital",
        "Declarative: describe the UI for the data, React updates the DOM",
        "`createRoot(el).render(<App />)` from `react-dom/client`",
        "`ReactDOM.render` was removed in React 19",
        "Return one root element, or a fragment `<>...</>`"
      ]
    },
    related: ["INTRO-006", "INTRO-007", "COMP-001", "JSX-001"]
  },

  "INTRO-002": {
    tldr: "React solves three problems: keeping the screen in sync with changing data, reusing UI instead of copy-pasting it, and keeping big apps organised as they grow.",
    analogy: { icon: "📋", text: "A restaurant menu board linked to the kitchen. When a dish sells out, the board updates itself. Nobody runs around rubbing out every copy by hand." },
    visual: { type: "compare", title: "Before React vs with React", left: { label: "Hand-written DOM code", tone: "bad", points: [
      "Every data change needs manual DOM edits",
      "Easy to forget one place: badge says 3, list shows 2",
      "Same card HTML copied in many files",
      "Logic and markup scattered as the app grows"
    ]}, right: { label: "React", tone: "good", points: [
      "Change the data; React redraws what changed",
      "UI is always calculated from one source of data",
      "Build a component once, reuse it everywhere",
      "App splits into small, testable components"
    ]}},
    points: [
      "**Sync**: UI = function of data. Update state, React updates the screen.",
      "**Reuse**: one `<ProductCard />` used 100 times; fix a bug once.",
      "**Scale**: small components with clear inputs (props) keep big teams productive.",
      "**Ecosystem**: routing, data fetching, testing and frameworks (Next.js) are all built around React.",
      "**Skills transfer**: the same model powers web, mobile (React Native) and desktop apps."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Cart() {
  const [items, setItems] = useState(['Apples']);

  function addBread() {
    setItems([...items, 'Bread']);
  }

  return (
    <section>
      <p>🛒 {items.length} items</p>
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
      <button onClick={addBread}>Add bread</button>
    </section>
  );
}`, walk: [
      { lines: [4], note: "One source of truth: the `items` array in state." },
      { lines: [7], note: "Change the data only. No `document.querySelector`, no `innerHTML`." },
      { lines: [12, 14], note: "The badge and the list both read `items`, so they can never disagree." }
    ]},
    output: "“🛒 1 items” and a list with Apples. Clicking “Add bread” shows 2 items and adds Bread to the list.",
    mistakes: [
      { bad: `setItems([...items, 'Bread']);\ndocument.querySelector('#count').textContent = items.length + 1;`, good: `setItems([...items, 'Bread']);\n// JSX shows {items.length} automatically`, why: "Don't hand-edit DOM that React renders. React will overwrite it, and you lose the single source of truth." },
      { bad: `items.push('Bread');\nsetItems(items);`, good: `setItems([...items, 'Bread']);`, why: "Mutating the same array means React sees no change. Create a new array." }
    ],
    practice: [
      { level: "B", q: "Name the three main problems React solves.", a: "Keeping UI in sync with data, reusing UI pieces, and scaling large apps." },
      { level: "B", q: "Add a “Clear cart” button.", a: "`<button onClick={() => setItems([])}>Clear</button>`; both the badge and list update." },
      { level: "I", q: "Extract a `CartBadge` component that receives `count` as a prop.", a: "`function CartBadge({ count }) { return <p>🛒 {count} items</p>; }` and render `<CartBadge count={items.length} />`." },
      { level: "C", q: "Name one case where React is overkill.", a: "A mostly static page (a simple landing page or blog) with little interactivity; plain HTML or a static site generator is enough." }
    ],
    quiz: [
      { q: "What is React's core answer to “UI out of sync with data”?", options: ["Faster DOM APIs", "UI is computed from state; change state and React re-renders", "Two-way binding on every input", "Automatic page reloads"], answer: 1, why: "React re-derives the UI from state, so all views of the same data agree." },
      { q: "Why does reuse matter?", options: ["It makes files bigger", "A fix in one component applies everywhere it is used", "It removes the need for CSS", "It disables re-renders"], answer: 1, why: "Write once, use many times, fix once." },
      { q: "React is the best choice for every website.", options: ["True", "False"], answer: 1, why: "Static content-heavy pages may not need it. Pick React when the UI is interactive and data-driven." }
    ],
    rev: {
      sec30: "React keeps UI in sync with data (UI is a function of state), lets you reuse components instead of copy-pasting markup, and scales to large teams by splitting apps into small pieces. It also has the biggest ecosystem and skills transfer to React Native.",
      interview: [
        { level: "basic", q: "Why would you use React over plain JavaScript?", a: "Plain JS needs manual DOM updates for every change, which drift out of sync. React derives the UI from state and updates the DOM for you." },
        { level: "intermediate", q: "What does “UI is a function of state” mean?", a: "For the same state, a component always renders the same UI. You change state, not the DOM." },
        { level: "intermediate", q: "How do components help large teams?", a: "Each component has clear inputs (props) and owns its logic, so teams can build, test and change parts independently." },
        { level: "advanced", q: "When would you not pick React?", a: "Mostly static content with little interactivity, or very tight bundle budgets. Static HTML, a static site generator or a lighter library may fit better." }
      ],
      cheat: [
        "Problem 1: UI drifting out of sync with data",
        "Problem 2: copy-pasted markup; fix: reusable components",
        "Problem 3: scaling; fix: small components with clear props",
        "UI = f(state)",
        "Big ecosystem: Router, TanStack Query, Next.js, testing tools",
        "Same model in React Native for mobile"
      ]
    },
    related: ["INTRO-001", "INTRO-003", "INTRO-008", "COMP-002"]
  },

  "INTRO-003": {
    tldr: "With plain DOM code you update every piece of the screen by hand. Each new feature adds more places to update, and sooner or later one is missed and the page shows the wrong data.",
    analogy: { icon: "📝", text: "A to-do list copied on three sticky notes. Tick a task on one note and forget the others: now your notes disagree about what is done." },
    visual: { type: "timeline", title: "How manual updates drift", frames: [
      { label: "Start", state: "data: 2 todos · list: 2 · badge: 2", note: "Everything matches." },
      { label: "Add todo", state: "data: 3 · list: 3 · badge: 3", note: "You remembered to update both the list and the badge." },
      { label: "Delete todo", state: "data: 2 · list: 2 · badge: 3", note: "The delete handler forgot the badge. The UI now lies." },
      { label: "New feature", state: "data: 2 · list: 2 · badge: 3 · footer: 2", note: "Every new view of the data is one more place to forget." }
    ]},
    points: [
      "Manual DOM code mixes **what changed** with **how to redraw it**.",
      "Each data change must update **every** element that shows that data.",
      "Event listeners, `innerHTML` and query selectors pile up as features grow.",
      "Rebuilding with `innerHTML` throws away focus, typed text and listeners.",
      "React fixes this: keep data in one place, describe the UI, let React update the DOM."
    ],
    code: { file: "todos.js", lang: "js", src: `// Plain DOM: every change must touch every view
const todos = ['Buy milk', 'Call mom'];
const list = document.querySelector('#list');
const badge = document.querySelector('#badge');

function addTodo(text) {
  todos.push(text);
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
  badge.textContent = todos.length; // remembered
}

function removeTodo(index) {
  todos.splice(index, 1);
  list.children[index].remove();
  // forgot: badge.textContent = todos.length;
}

addTodo('Water plants');
removeTodo(0);`, walk: [
      { lines: [2, 3, 4], note: "Data lives in an array, but the screen is separate DOM nodes you must keep in step." },
      { lines: [7, 8, 9, 10, 11], note: "Adding a todo needs three manual steps: change data, create the node, update the badge." },
      { lines: [15, 16, 17], note: "Removing forgets the badge. This is the classic out-of-sync bug." },
      { lines: [20, 21], note: "After both calls: 2 todos in the list, but the badge still says 3." }
    ]},
    output: "List shows “Call mom” and “Water plants”; the badge wrongly shows 3.",
    mistakes: [
      { bad: `list.innerHTML = todos.map(t => '<li>' + t + '</li>').join('');`, good: `// React: render from data\n<ul>{todos.map(t => <li key={t}>{t}</li>)}</ul>`, why: "Rebuilding with `innerHTML` wipes listeners and input focus, and risks XSS with user text. React updates only what changed and escapes text." }
    ],
    practice: [
      { level: "B", q: "Fix `removeTodo` so the badge stays correct.", a: "Add `badge.textContent = todos.length;` after removing the node." },
      { level: "I", q: "Write one `render()` function that redraws list and badge from `todos`. What problem remains?", a: "It keeps things in sync, but rebuilding everything loses focus and listeners and gets slow. React does this idea efficiently." },
      { level: "C", q: "Add a “3 left” footer. How many functions must change in the plain version vs React?", a: "Plain: every function that changes `todos`. React: only the JSX, since the footer reads the same state." }
    ],
    quiz: [
      { q: "Main reason manual DOM code drifts out of sync?", options: ["The DOM is slow", "Every change must update every view by hand, and one gets missed", "JavaScript arrays are buggy", "Browsers cache old HTML"], answer: 1, why: "The data and the screen are kept in step by your code, so any missed update creates a bug." },
      { q: "What does `element.innerHTML = ...` do to an input the user is typing in?", options: ["Keeps the cursor", "Replaces the input, losing focus and typed text", "Nothing", "Throws an error"], answer: 1, why: "`innerHTML` destroys the old nodes and creates new ones." },
      { q: "How does React avoid the drift?", options: ["It bans the DOM", "UI is derived from one source of state; React updates the DOM", "It reloads the page", "It uses two-way binding everywhere"], answer: 1, why: "Every view reads the same state, so they can't disagree." }
    ],
    rev: {
      sec30: "Imperative DOM code keeps data and screen in step by hand. Every change must update every element that shows that data, so features multiply the update paths and bugs appear. Rebuilding with innerHTML loses state and is unsafe. React derives the UI from state and patches only what changed.",
      interview: [
        { level: "basic", q: "What problem does manual DOM manipulation cause?", a: "UI and data drift out of sync, because each change needs hand-written updates in every place the data shows." },
        { level: "intermediate", q: "Why not just re-render everything with `innerHTML`?", a: "It wipes focus, scroll and listeners, is slow for big lists, and inserting user text is an XSS risk." },
        { level: "intermediate", q: "How does React avoid full rebuilds?", a: "It compares the new element tree with the previous one (reconciliation) and applies only the needed DOM changes." },
        { level: "tricky", q: "Is direct DOM access ever fine in React?", a: "Yes, through refs for focus, measuring or third-party widgets. Just don't change DOM content that React renders." }
      ],
      debug: [
        { code: `function clearAll() {\n  todos.length = 0;\n  list.innerHTML = '';\n}`, fix: `function clearAll() {\n  todos.length = 0;\n  list.innerHTML = '';\n  badge.textContent = 0;\n}`, why: "The badge was not updated, so it still shows the old count." }
      ],
      cheat: [
        "Manual DOM = you sync data and screen yourself",
        "More views of the same data = more places to forget",
        "`innerHTML` rebuilds lose focus, listeners; XSS risk",
        "React: single source of truth in state",
        "React diffs and patches only what changed",
        "Use refs only for focus, measuring, third-party widgets"
      ]
    },
    related: ["INTRO-004", "INTRO-008", "WEB-034", "RENDER-005"]
  },

  "INTRO-004": {
    tldr: "Build a counter twice. In vanilla JS you change the number, then find and update the DOM yourself. In React you change state and the JSX shows the new number automatically.",
    analogy: { icon: "☕", text: "Vanilla JS is making coffee by hand: grind, heat, pour, every time. React is a coffee machine: you pick the drink (state) and it handles the steps." },
    visual: { type: "compare", title: "Same counter, two ways", left: { label: "Vanilla JavaScript", tone: "neutral", points: [
      "Write HTML, then query elements by id",
      "Add listeners with `addEventListener`",
      "Update the variable AND the `textContent`",
      "No build step; fine for tiny widgets"
    ]}, right: { label: "React", tone: "good", points: [
      "Write one component with JSX",
      "Attach handlers with `onClick={...}`",
      "Only call `setCount`; the UI follows",
      "Scales: reuse `<Counter />` many times"
    ]}},
    points: [
      "Vanilla: **imperative** – you list each step to change the page.",
      "React: **declarative** – you say what the page looks like for `count`.",
      "In React, markup and behaviour live together in one component.",
      "Two vanilla counters need duplicated ids/code; two React counters are just `<Counter /><Counter />`.",
      "React adds a library and a build step (Vite). Worth it once the UI has real interactivity."
    ],
    code: { file: "Counter.jsx", lang: "jsx", src: `// Vanilla version (for comparison)
// <span id="n">0</span> <button id="plus">+</button>
// let n = 0;
// document.getElementById('plus').addEventListener('click', () => {
//   n++;
//   document.getElementById('n').textContent = n;
// });

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <p>
      Likes: {count}{' '}
      <button onClick={() => setCount(count + 1)}>👍 +1</button>
    </p>
  );
}

// Reuse: <Counter /> <Counter /> gives two independent counters`, walk: [
      { lines: [3, 4, 5, 6], note: "Vanilla: change the variable, then manually write it into the DOM." },
      { lines: [12], note: "React: ask for state. `count` is the value, `setCount` changes it." },
      { lines: [16], note: "JSX reads `count`. No DOM lookup needed." },
      { lines: [17], note: "Click calls the setter; React re-renders and the number updates." },
      { lines: [22], note: "Each `<Counter />` gets its own state, no extra ids or code." }
    ]},
    output: "“Likes: 0 👍 +1”. Each click increases the number by 1.",
    mistakes: [
      { bad: `let count = 0;\n<button onClick={() => count++}>`, good: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>`, why: "A plain variable resets each render and changing it doesn't re-render. Use state." },
      { bad: `<button onClick={setCount(count + 1)}>`, good: `<button onClick={() => setCount(count + 1)}>`, why: "Without the arrow, `setCount` runs during render, causing an infinite re-render loop." }
    ],
    practice: [
      { level: "B", q: "Add a −1 button to the React counter.", a: "`<button onClick={() => setCount(count - 1)}>−1</button>`" },
      { level: "B", q: "Add a Reset button in the vanilla version.", a: "Add a listener that sets `n = 0` and also writes `0` into `#n.textContent`. Note you must do both steps." },
      { level: "I", q: "Render three counters labelled Coffee, Tea, Juice.", a: "Add a `label` prop: `<Counter label=\"Coffee\" />` and show `{label}: {count}`.", code: `function Counter({ label }) {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{label}: {count}</button>;\n}` },
      { level: "C", q: "Show a “Popular!” badge when likes reach 10, in both versions. Compare.", a: "React: `{count >= 10 && <b>Popular!</b>}`. Vanilla: add show/hide code in every place that changes `n`." }
    ],
    quiz: [
      { q: "In the vanilla counter, what must you do after `n++`?", options: ["Nothing", "Write the new value into the DOM yourself", "Call `render()` from React", "Reload the page"], answer: 1, why: "Vanilla JS doesn't know the variable is shown on screen." },
      { q: "In React, what updates the number on screen?", options: ["`document.getElementById`", "Calling `setCount`, which re-renders the component", "A `MutationObserver`", "`innerHTML`"], answer: 1, why: "The setter schedules a re-render; JSX reads the new value." },
      { q: "What does `onClick={setCount(count + 1)}` do?", options: ["Increments on click", "Calls `setCount` during render, causing an infinite loop", "Nothing", "Increments twice"], answer: 1, why: "You must pass a function, not call it." }
    ],
    rev: {
      sec30: "Vanilla JS: query DOM nodes, add listeners, update the variable and the DOM yourself (imperative). React: hold the value in state, return JSX that reads it, call the setter on click (declarative). React scales better because components are reusable and the UI can't drift from the data.",
      interview: [
        { level: "basic", q: "Main difference between a React and a vanilla counter?", a: "Vanilla updates the DOM by hand after changing the value. React only changes state and re-renders the JSX." },
        { level: "intermediate", q: "Is React faster than vanilla JS?", a: "No. Well-written vanilla can be faster. React's value is maintainability and correctness as the UI grows, with good-enough speed." },
        { level: "intermediate", q: "Why pass `() => setCount(count + 1)` instead of `setCount(count + 1)`?", a: "`onClick` needs a function to call later. Calling the setter during render triggers a re-render loop." },
        { level: "tricky", q: "One click handler calls `setCount(count + 1)` three times. Result?", a: "+1, because all three read the same snapshot. Use `setCount(c => c + 1)` for +3." }
      ],
      compare: { cols: ["", "Vanilla JS", "React"], rows: [
        ["Style", "Imperative", "Declarative"],
        ["Update UI", "Edit DOM by hand", "Change state"],
        ["Reuse", "Copy code / ids", "`<Counter />` again"],
        ["Setup", "None", "Vite + npm"]
      ]},
      cheat: [
        "Vanilla: change value + update DOM yourself",
        "React: `setCount(...)` and the JSX follows",
        "`onClick={() => fn()}` – pass a function, don't call it",
        "Each component instance has its own state",
        "React isn't faster than good vanilla; it's easier to keep correct"
      ]
    },
    related: ["INTRO-003", "INTRO-008", "STATE-004", "PROJ-001"]
  },

  "INTRO-005": {
    tldr: "React, Angular and Vue all build component-based UIs. React is a focused library (you pick extras), Angular is a full framework with everything built in, and Vue sits in between with official add-ons.",
    analogy: { icon: "🍽️", text: "React is à la carte: pick each dish. Angular is a fixed set menu: everything included, one way to eat it. Vue is a combo meal: sensible defaults, swap a side if you like." },
    visual: { type: "layers", title: "How much each one gives you out of the box", items: [
      { label: "Angular: full framework", detail: "Router, forms, HTTP client, DI, CLI, TypeScript by default. One official way." },
      { label: "Vue: progressive framework", detail: "Core + official Vue Router and Pinia. Single-file `.vue` components with templates." },
      { label: "React: UI library", detail: "Components, JSX, hooks. Routing, data and state come from the ecosystem or a framework (Next.js)." }
    ]},
    points: [
      "**Scope**: React = view library; Angular = all-in-one framework; Vue = core + official libraries.",
      "**Templates**: React uses JSX (JavaScript); Angular and Vue use HTML templates with directives (`*ngFor`, `v-for`).",
      "**Learning curve**: Vue is gentlest; React is small but you must choose extras; Angular is steepest (RxJS, DI, decorators).",
      "**Reactivity**: React re-renders on `setState`; Vue and Angular (signals) track dependencies automatically.",
      "**Ecosystem & jobs**: React has the largest ecosystem and job market; Angular is common in enterprise (feels familiar to .NET devs)."
    ],
    code: { file: "TodoList.jsx", lang: "jsx", src: `// React: loops and conditions are plain JavaScript
export default function TodoList({ todos }) {
  if (todos.length === 0) return <p>All done!</p>;

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// Vue template:      <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
// Angular template:  @for (todo of todos; track todo.id) { <li>{{ todo.text }}</li> }`, walk: [
      { lines: [3], note: "React: a normal `if`. No special template syntax." },
      { lines: [7, 8, 9], note: "React: lists use the array `map` method plus a `key`." },
      { lines: [14], note: "Vue: the `v-for` directive inside an HTML template." },
      { lines: [15], note: "Angular: the built-in `@for` control-flow block with `track`." }
    ]},
    mistakes: [
      { bad: `"React is a framework like Angular."`, good: `"React is a UI library; Next.js or React Router framework mode are React frameworks."`, why: "React itself has no router, HTTP client or forms module. Mixing these up is a common interview slip." }
    ],
    practice: [
      { level: "B", q: "Which of the three includes a router and HTTP client in its core package set?", a: "Angular. React and Vue rely on separate libraries (Vue's are official)." },
      { level: "I", q: "A team of C# developers wants strict structure and one official way. Which would you suggest?", a: "Angular fits well: TypeScript-first, dependency injection, opinionated structure. React + TypeScript also works with agreed conventions." },
      { level: "C", q: "Write a React `WeatherList` that shows “No data” when empty, else each city and temperature.", a: "Use an early return for empty, else `map` to `<li key={c.city}>{c.city}: {c.temp}°</li>`." }
    ],
    quiz: [
      { q: "Which is a library rather than a full framework?", options: ["Angular", "React", "Both", "Neither"], answer: 1, why: "React focuses on UI; you add routing and data tools yourself or use a React framework." },
      { q: "How does React render lists?", options: ["`v-for` directive", "`*ngFor` / `@for`", "JavaScript `array.map()` in JSX", "A `<list>` tag"], answer: 2, why: "JSX is JavaScript, so you use normal array methods." },
      { q: "Which usually has the steepest learning curve?", options: ["React", "Vue", "Angular"], answer: 2, why: "Angular brings DI, RxJS, decorators and more concepts up front." }
    ],
    rev: {
      sec30: "All three are component-based. React: a UI library with JSX and hooks, huge ecosystem, you choose routing/state or use Next.js. Angular: full TypeScript framework with router, forms, HTTP and DI built in; steep curve, popular in enterprise. Vue: progressive, HTML templates, official router and Pinia, gentlest curve.",
      interview: [
        { level: "basic", q: "React vs Angular in one line?", a: "React is a flexible UI library; Angular is an opinionated, batteries-included framework." },
        { level: "intermediate", q: "JSX vs templates: trade-off?", a: "JSX gives the full power of JavaScript and types; templates are closer to HTML and easier for designers, but need directive syntax." },
        { level: "intermediate", q: "How does change detection differ?", a: "React re-renders a component when its state changes and diffs the output. Vue and Angular signals track which values are read and update precisely." },
        { level: "advanced", q: "What is the downside of React's flexibility?", a: "Decision fatigue and inconsistency: each team picks its own router, state and styling, so conventions must be agreed." }
      ],
      compare: { cols: ["", "React", "Angular", "Vue"], rows: [
        ["Type", "UI library", "Full framework", "Progressive framework"],
        ["Templates", "JSX", "HTML + directives", "HTML + directives"],
        ["Language", "JS or TS", "TypeScript", "JS or TS"],
        ["Routing", "React Router / Next.js", "Built in", "Official Vue Router"],
        ["Learning curve", "Medium", "Steep", "Gentle"]
      ]},
      cheat: [
        "React = library; Angular = framework; Vue = progressive framework",
        "React: JSX, hooks, biggest ecosystem",
        "Angular: TypeScript, DI, router, forms, HTTP built in",
        "Vue: templates, Vue Router, Pinia",
        "All three are component-based",
        "React frameworks: Next.js, React Router framework mode"
      ]
    },
    related: ["INTRO-006", "INTRO-014", "NEXT-002"]
  },

  "INTRO-006": {
    tldr: "Your code calls a library; a framework calls your code (inversion of control). React is a UI library, but for rendering it calls your components, so it feels a bit like a framework.",
    analogy: { icon: "🎵", text: "A library is a music app you play songs from when you choose. A framework is a radio station: it plays your song when it decides the slot is right." },
    visual: { type: "compare", title: "Who is in control?", left: { label: "Library (you call it)", tone: "neutral", points: [
      "`format(date)` – you decide when it runs",
      "You choose structure and other tools",
      "Examples: Lodash, date-fns, React (for UI)"
    ]}, right: { label: "Framework (it calls you)", tone: "neutral", points: [
      "You fill in the slots it provides",
      "It owns routing, data loading, project layout",
      "Examples: Angular, Next.js, React Router framework mode"
    ]}},
    points: [
      "**Inversion of control (IoC)**: “Don't call us, we'll call you.” Like ASP.NET calling your controller.",
      "React applies IoC to **rendering**: you write `App`; React decides when to call it and re-call it.",
      "React leaves **routing, data fetching and structure** to you → it's a library.",
      "Never call a component as a function (`App()`); render it as `<App />` so hooks work.",
      "Need routing + SSR + data loading? Use a React **framework**: Next.js or React Router framework mode."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { format } from 'date-fns'; // a normal library

function Greeting() {
  // React calls this function, not you
  const today = format(new Date(), 'EEEE'); // you call date-fns
  return <h1>Happy {today}!</h1>;
}

const root = createRoot(document.getElementById('root'));
root.render(<Greeting />); // hand control to React`, walk: [
      { lines: [2, 6], note: "Library style: you call `format` exactly when you want." },
      { lines: [4, 5], note: "IoC: you never call `Greeting()`. React does, on every render." },
      { lines: [11], note: "You describe what to render; React decides when and how often to run it." }
    ]},
    output: "“Happy Monday!” (whatever today's weekday is).",
    mistakes: [
      { bad: `root.render(Greeting());`, good: `root.render(<Greeting />);`, why: "Calling it yourself skips React: hooks inside break and React can't track the component." },
      { bad: `function update() {\n  createRoot(el).render(<App />);\n}`, good: `const root = createRoot(el);\nroot.render(<App />);\n// later updates come from state`, why: "Create the root once. Let state changes trigger re-renders instead of re-creating roots." }
    ],
    practice: [
      { level: "B", q: "Library or framework control: `const total = sum([10, 20]);`?", a: "Library. Your code calls `sum` directly." },
      { level: "B", q: "In a Vite React app, who calls `App`?", a: "React, after `root.render(<App />)`, and again whenever state changes." },
      { level: "I", q: "Name the slots where React calls your code.", a: "Rendering components, running effects (`useEffect`), and calling event handlers you pass (`onClick`)." },
      { level: "C", q: "When would you pick Next.js over plain React + Vite?", a: "When you need SEO, server rendering, file-based routing with data loading, e.g. a public recipe site." }
    ],
    quiz: [
      { q: "What is inversion of control?", options: ["You call the tool's functions", "The tool calls your code at defined points", "Reversing an array", "Running code on the server"], answer: 1, why: "A framework owns the flow and calls your code." },
      { q: "Where does React use IoC?", options: ["Routing", "Rendering components and calling handlers/effects", "Database access", "Nowhere"], answer: 1, why: "React decides when to call your components." },
      { q: "Which is a React framework?", options: ["Redux", "Next.js", "Lodash", "Vite"], answer: 1, why: "Next.js adds routing, SSR and data loading on top of React. Vite is a build tool." }
    ],
    rev: {
      sec30: "Library: you call it. Framework: it calls you (inversion of control). React is a UI library, but applies IoC to rendering: it calls your components, effects and handlers. It leaves routing, data and structure to you; React frameworks like Next.js or React Router framework mode add those.",
      interview: [
        { level: "basic", q: "Is React a library or a framework?", a: "A library for building UIs. It controls rendering but leaves routing, data fetching and app structure to you." },
        { level: "intermediate", q: "Why does React feel framework-like?", a: "Because React, not you, decides when components run, and hooks only work inside that React-controlled flow." },
        { level: "advanced", q: "Why do hooks require React to call the component?", a: "Hooks store data in React's record for the component currently rendering. Calling it yourself means there's no such record." },
        { level: "tricky", q: "Is React Router a library or framework?", a: "Both. React Router 7 works as a library (declarative/data mode) or as a framework (framework mode with loaders and SSR)." }
      ],
      predict: [
        { code: `function A() { console.log('a'); return null; }\nconsole.log('x');\nroot.render(<A />);\nconsole.log('y');`, answer: "x, y, a", why: "`render` schedules the work; React calls `A` after the current script finishes." }
      ],
      cheat: [
        "Library: you call it. Framework: it calls you",
        "IoC = “don't call us, we'll call you”",
        "React = UI library, IoC for rendering",
        "Render `<App />`, never call `App()`",
        "React frameworks: Next.js, React Router framework mode",
        "Create the root once"
      ]
    },
    related: ["INTRO-001", "INTRO-005", "NEXT-001", "ROUTE-003"]
  },

  "INTRO-007": {
    tldr: "React's main features: components (reusable pieces), JSX (HTML-like syntax in JS), one-way data flow (data goes down via props), a virtual DOM with smart diffing, and hooks (state and side effects in functions).",
    analogy: { icon: "🍕", text: "A pizza shop: recipes are components, the order slip is JSX, orders flow one way from counter to kitchen (props), and the chef only remakes the pizza that changed (diffing)." },
    visual: { type: "flow", title: "How the features work together", steps: [
      { label: "Components", detail: "The UI is split into functions like `Cart` and `CartItem`." },
      { label: "JSX", detail: "Each component describes its UI with HTML-like syntax inside JS." },
      { label: "Props (one-way)", detail: "Parents pass data down: `<CartItem item={item} />`." },
      { label: "Hooks", detail: "`useState`, `useEffect` add memory and side effects." },
      { label: "Virtual DOM diff", detail: "React compares new vs old UI and updates only changed DOM nodes." }
    ]},
    points: [
      "**Components**: functions that return UI; compose them like building blocks.",
      "**JSX**: compiles to JavaScript function calls; you can use `{expressions}` inside.",
      "**One-way data flow**: data flows parent → child as props; children ask parents to change it via callbacks.",
      "**Virtual DOM / reconciliation**: React keeps a lightweight copy of the UI and patches only differences.",
      "**Hooks**: `useState`, `useEffect`, `useContext`… state and logic without classes.",
      "Bonus: **declarative** style, huge ecosystem, React Native for mobile."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState } from 'react';

function Song({ title, liked, onLike }) {
  return (
    <li>
      {title}{' '}
      <button onClick={onLike}>{liked ? '❤️' : '🤍'}</button>
    </li>
  );
}

export default function Playlist() {
  const [liked, setLiked] = useState([]);
  const songs = ['Sunrise', 'Rainy Day', 'Night Drive'];

  function toggle(title) {
    setLiked(liked.includes(title)
      ? liked.filter(t => t !== title)
      : [...liked, title]);
  }

  return (
    <ul>
      {songs.map(s => (
        <Song key={s} title={s} liked={liked.includes(s)} onLike={() => toggle(s)} />
      ))}
    </ul>
  );
}`, walk: [
      { lines: [3], note: "**Component** receiving **props**. It can't change them; it calls `onLike` to ask." },
      { lines: [7], note: "**JSX** with a JavaScript expression inside `{}`." },
      { lines: [13], note: "**Hook**: `useState` gives Playlist memory of liked songs." },
      { lines: [25], note: "**One-way data flow**: data down as props, events up via `onLike`." },
      { lines: [17, 18, 19], note: "New array on change → re-render → **diff** updates only the clicked heart." }
    ]},
    output: "Three songs with 🤍 buttons. Clicking one turns it ❤️; clicking again turns it back.",
    mistakes: [
      { bad: `function Song({ liked }) {\n  liked = true; // change a prop\n}`, good: `<button onClick={onLike}>...</button>\n// parent updates state`, why: "Props are read-only. One-way flow: only the owner of the state changes it." }
    ],
    practice: [
      { level: "B", q: "List the five core features of React.", a: "Components, JSX, one-way data flow, virtual DOM (reconciliation), hooks." },
      { level: "I", q: "Show the number of liked songs above the list.", a: "`<p>{liked.length} liked</p>`; it reads the same state, so it stays in sync." },
      { level: "C", q: "Explain which feature makes clicking one heart not re-create the other `<li>` DOM nodes.", a: "Reconciliation: React diffs the new tree with the old using `key`s and only updates the changed button text." }
    ],
    quiz: [
      { q: "Data flow in React is…", options: ["Two-way by default", "One-way: parent to child via props", "Child to parent via props", "Global by default"], answer: 1, why: "Children change parent data only by calling callbacks passed as props." },
      { q: "What does the virtual DOM help with?", options: ["Styling", "Working out the minimal DOM changes", "Routing", "Storing data on the server"], answer: 1, why: "React diffs element trees and patches only what changed." },
      { q: "What are hooks?", options: ["CSS helpers", "Functions like `useState` that add state and effects to function components", "Browser APIs", "Build plugins"], answer: 1, why: "Hooks replaced most uses of class components." }
    ],
    rev: {
      sec30: "Components split the UI into reusable functions. JSX describes UI inside JavaScript. Data flows one way, down through props; events go up via callbacks. React keeps a virtual tree and reconciles it to patch only changed DOM. Hooks add state and side effects to functions.",
      interview: [
        { level: "basic", q: "What are the main features of React?", a: "Components, JSX, one-way data flow, virtual DOM with reconciliation, and hooks, all in a declarative style." },
        { level: "intermediate", q: "Why one-way data flow?", a: "It makes changes predictable: you can trace any value to the one component that owns it." },
        { level: "intermediate", q: "Is the virtual DOM what makes React fast?", a: "Not by itself. It makes declarative re-rendering affordable by limiting real DOM writes; hand-written DOM code can still be faster." },
        { level: "advanced", q: "What is the React Compiler?", a: "A build-time tool (stable since late 2025) that auto-memoizes components and values, reducing the need for `useMemo`/`useCallback`." }
      ],
      cheat: [
        "Components: reusable UI functions",
        "JSX: HTML-like syntax compiled to JS calls",
        "One-way flow: props down, callbacks up",
        "Virtual DOM + reconciliation: patch only changes",
        "Hooks: `useState`, `useEffect`, `useContext`…",
        "Props are read-only"
      ]
    },
    related: ["COMP-001", "JSX-001", "PROPS-013", "HOOKS-001"]
  },

  "INTRO-008": {
    tldr: "Imperative code lists the steps to change the screen. Declarative code describes what the screen should look like for the current data (UI = f(state)), and React does the steps.",
    analogy: { icon: "🚕", text: "Imperative: tell the taxi driver every turn. Declarative: give the address and let the driver work out the route." },
    visual: { type: "compare", title: "Showing a “sold out” label", left: { label: "Imperative (how)", tone: "neutral", points: [
      "Find the button element",
      "If stock is 0, set `disabled` and change text",
      "Else remove `disabled` and restore text",
      "Repeat in every place stock changes"
    ]}, right: { label: "Declarative (what)", tone: "good", points: [
      "`disabled={stock === 0}`",
      "`{stock === 0 ? 'Sold out' : 'Buy'}`",
      "Written once; correct for any `stock`",
      "React works out the DOM edits"
    ]}},
    points: [
      "**UI = f(state)**: the same state always produces the same UI.",
      "Imperative = **how** (DOM steps). Declarative = **what** (the result).",
      "SQL is declarative too: `SELECT` says what you want, not how to scan tables.",
      "Declarative code has fewer bugs because there are no forgotten update paths.",
      "React still runs imperative DOM code; it just does it for you."
    ],
    code: { file: "BuyButton.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function BuyButton() {
  const [stock, setStock] = useState(2);

  return (
    <div>
      <p>Pizza slices left: {stock}</p>
      <button
        disabled={stock === 0}
        onClick={() => setStock(stock - 1)}
      >
        {stock === 0 ? 'Sold out' : 'Buy a slice'}
      </button>
    </div>
  );
}

// Imperative equivalent, for each change:
// btn.disabled = stock === 0;
// btn.textContent = stock === 0 ? 'Sold out' : 'Buy a slice';
// label.textContent = 'Pizza slices left: ' + stock;`, walk: [
      { lines: [4], note: "The only thing that changes is `stock`." },
      { lines: [10, 13], note: "Describe the button for any `stock`: disabled and label are derived from data." },
      { lines: [11], note: "Events change data, never the DOM directly." },
      { lines: [20, 21, 22], note: "The imperative version must repeat all of this on every change." }
    ]},
    output: "“Pizza slices left: 2” and “Buy a slice”. After two clicks: 0 left and a disabled “Sold out” button.",
    mistakes: [
      { bad: `function sell() {\n  setStock(stock - 1);\n  if (stock - 1 === 0) btnRef.current.disabled = true;\n}`, good: `<button disabled={stock === 0}>`, why: "Mixing imperative DOM edits into React duplicates logic and can conflict with React's own updates." },
      { bad: `const [isSoldOut, setIsSoldOut] = useState(false); // kept in sync manually`, good: `const isSoldOut = stock === 0; // derived`, why: "Don't store what you can calculate. Derived values can't drift out of sync." }
    ],
    practice: [
      { level: "B", q: "Is `arr.filter(x => x > 2)` declarative or imperative?", a: "Declarative: you say what you want, not how to loop." },
      { level: "I", q: "Show “Only 1 left!” in red when stock is 1.", a: "`{stock === 1 && <p style={{ color: 'red' }}>Only 1 left!</p>}`" },
      { level: "C", q: "Rewrite this declaratively: a loop that pushes `<li>` for each done todo into a list.", a: "`<ul>{todos.filter(t => t.done).map(t => <li key={t.id}>{t.text}</li>)}</ul>`" }
    ],
    quiz: [
      { q: "Declarative UI means…", options: ["Writing every DOM step", "Describing the UI for the current state", "Using classes", "Avoiding JavaScript"], answer: 1, why: "You describe the result; React handles the steps." },
      { q: "Which is declarative?", options: ["`el.classList.add('active')`", "`<li className={active ? 'active' : ''}>`", "`el.appendChild(li)`", "`el.remove()`"], answer: 1, why: "It describes the class for any value of `active`." },
      { q: "Should you store `isSoldOut` in state if `stock` is already in state?", options: ["Yes, always", "No, derive it: `stock === 0`"], answer: 1, why: "Derived values stay correct automatically." }
    ],
    rev: {
      sec30: "Imperative code says how: find nodes, set properties, step by step. Declarative code says what: the UI for the current state. React is declarative; UI = f(state). You change state, React computes and applies the DOM changes. Derive values instead of storing duplicates.",
      interview: [
        { level: "basic", q: "Declarative vs imperative?", a: "Imperative lists steps to reach a result; declarative describes the result and lets the system do the steps." },
        { level: "intermediate", q: "Why is declarative UI less buggy?", a: "There is one description for every state, so no update path can be forgotten." },
        { level: "intermediate", q: "Give a non-React declarative example.", a: "SQL `SELECT`, CSS rules, or LINQ in C#: you state what you want, the engine decides how." },
        { level: "tricky", q: "Is React code ever imperative?", a: "Yes: event handlers and effects are imperative steps, and refs touch the DOM directly. The render output is declarative." }
      ],
      cheat: [
        "Imperative = how; declarative = what",
        "UI = f(state)",
        "Change state, not the DOM",
        "Derive values instead of syncing them in state",
        "Handlers/effects are imperative; JSX is declarative",
        "SQL, CSS, LINQ are declarative too"
      ]
    },
    related: ["INTRO-003", "INTRO-004", "STATE-001", "COND-001"]
  },

  "INTRO-009": {
    tldr: "A Single Page Application (SPA) loads one HTML page once. After that, JavaScript swaps views and fetches data as JSON, so moving between pages happens without a full reload.",
    analogy: { icon: "📱", text: "A music app: tap Library, Search or Playlist and only the middle of the screen changes. The player bar keeps playing; nothing restarts." },
    visual: { type: "flow", title: "Navigating inside an SPA", steps: [
      { label: "First load", detail: "Browser gets one `index.html` + the JS bundle. React draws the app." },
      { label: "Click a link", detail: "The router stops the normal page load (no request for new HTML)." },
      { label: "URL updates", detail: "The History API changes the address bar, e.g. `/cart`." },
      { label: "Swap the view", detail: "React renders the `Cart` component; header and state stay." },
      { label: "Fetch data", detail: "Only JSON is requested from the API if the view needs it." }
    ]},
    points: [
      "One HTML document; views are **components** chosen by the URL (client-side routing).",
      "Uses the browser **History API** (`pushState`) so back/forward buttons still work.",
      "**Pros**: fast, app-like navigation; state (cart, player) survives page changes.",
      "**Cons**: bigger first download, weaker SEO without SSR, and the server must return `index.html` for every route.",
      "In React, use **React Router** (`react-router`) for SPA routing."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { BrowserRouter, Routes, Route, Link } from 'react-router';

function Home() { return <h2>🍳 Recipes</h2>; }
function Favourites() { return <h2>⭐ Favourites</h2>; }

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/favourites">Favourites</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </BrowserRouter>
  );
}`, walk: [
      { lines: [1], note: "React Router 7: everything is imported from the single `react-router` package." },
      { lines: [8], note: "`BrowserRouter` connects React to the URL using the History API." },
      { lines: [10], note: "`Link` changes the URL without reloading the page." },
      { lines: [12, 13, 14, 15], note: "`Routes` picks which component to show for the current path." }
    ]},
    output: "A nav bar. Clicking “Favourites” changes the URL to /favourites and swaps the heading instantly, with no page reload.",
    mistakes: [
      { bad: `<a href="/favourites">Favourites</a>`, good: `<Link to="/favourites">Favourites</Link>`, why: "A plain `<a>` reloads the whole page, wiping state and re-downloading the app." },
      { bad: `// Server returns 404 for /favourites on refresh`, good: `// Configure the host to serve index.html for all routes (SPA fallback)`, why: "On refresh, the server is asked for /favourites. Without a fallback rule it has no such file." }
    ],
    practice: [
      { level: "B", q: "Add a `/shopping-list` route.", a: "Create a component and add `<Route path=\"/shopping-list\" element={<ShoppingList />} />` plus a `Link`." },
      { level: "I", q: "Open DevTools → Network, click a `Link`. What requests appear?", a: "No new HTML document. Maybe JSON or lazy-loaded JS chunks only." },
      { level: "C", q: "Why might a recipe SPA rank badly on Google, and what fixes it?", a: "Initial HTML is an empty `<div id=\"root\">`. Use SSR or static generation (e.g. Next.js, React Router framework mode)." }
    ],
    quiz: [
      { q: "What happens when you click a router `Link` in an SPA?", options: ["The browser requests a new HTML page", "JavaScript updates the URL and swaps the view", "The page reloads from cache", "A new tab opens"], answer: 1, why: "Client-side routing avoids full reloads." },
      { q: "Which browser API lets SPAs change the URL without reloading?", options: ["Fetch API", "History API (`pushState`)", "localStorage", "Web Workers"], answer: 1, why: "`pushState` updates the address bar and history entries." },
      { q: "Biggest SEO risk of a pure SPA?", options: ["Too many HTML files", "Initial HTML has little content until JS runs", "URLs can't change", "Images don't load"], answer: 1, why: "Crawlers and slow devices see an empty shell first." }
    ],
    rev: {
      sec30: "An SPA loads one HTML page plus a JS bundle. A client-side router intercepts link clicks, updates the URL with the History API and renders a different component. Pros: fast navigation, persistent state. Cons: bigger initial load, weaker SEO, needs a server fallback to index.html.",
      interview: [
        { level: "basic", q: "What is an SPA?", a: "A web app that loads one HTML page and updates views with JavaScript instead of loading new pages from the server." },
        { level: "intermediate", q: "How does client-side routing work?", a: "The router listens to link clicks and the History API, prevents the default navigation, and renders the component matching the URL." },
        { level: "intermediate", q: "Why do SPAs 404 on refresh in production?", a: "The server looks for a file at that path. Configure it to serve `index.html` for unknown routes." },
        { level: "advanced", q: "How do you reduce an SPA's large initial bundle?", a: "Code splitting with `lazy()` and dynamic `import()` per route, so each page's code loads on demand." }
      ],
      cheat: [
        "SPA = one HTML page, views swapped by JS",
        "Client-side routing uses the History API",
        "React Router 7: import from `react-router`",
        "Use `<Link>`, not `<a>`, for internal links",
        "Need server fallback to `index.html`",
        "SEO weak without SSR/SSG"
      ]
    },
    related: ["INTRO-010", "INTRO-011", "ROUTE-001", "ROUTE-002"]
  },

  "INTRO-010": {
    tldr: "A Multi Page Application (MPA) asks the server for a brand-new HTML page on every navigation. It is simple and great for SEO, but each click reloads the page and loses in-page state.",
    analogy: { icon: "📚", text: "A recipe book: turning to another recipe means flipping to a whole new page. An SPA is a recipe app where only the card in the middle changes." },
    visual: { type: "compare", title: "MPA vs SPA", left: { label: "Multi Page App", tone: "neutral", points: [
      "Every link = new HTML from the server",
      "Full reload; JS state is lost",
      "Great SEO: content in the HTML",
      "Simple: classic ASP.NET MVC / Razor Pages",
      "Fast first view, slower next clicks"
    ]}, right: { label: "Single Page App", tone: "neutral", points: [
      "One HTML; JS swaps views",
      "No reload; state survives",
      "SEO needs SSR or SSG",
      "More client complexity (routing, bundles)",
      "Slower first load, fast next clicks"
    ]}},
    points: [
      "MPA: the **server** builds each page (e.g. ASP.NET Razor, PHP, Rails).",
      "**SEO**: MPAs ship full HTML, so crawlers see content immediately.",
      "**Speed**: MPAs are fast to first view; SPAs feel faster after the first load.",
      "**Complexity**: MPAs keep logic on the server; SPAs need client routing, state and an API.",
      "Modern frameworks (Next.js) blend both: server HTML first, then SPA-style navigation."
    ],
    code: { file: "index.html", lang: "html", src: `<!-- MPA: each page is its own HTML document -->
<!-- /index.html -->
<nav>
  <a href="/index.html">Shop</a>
  <a href="/cart.html">Cart</a>  <!-- full page load -->
</nav>
<h1>Shop</h1>
<ul>
  <li>Coffee mug – ₹299</li>
  <li>Notebook – ₹149</li>
</ul>

<!-- /cart.html: a separate file with its own nav copy -->
<!-- Any JS variables (e.g. a "recently viewed" list) are gone -->
<!-- after the reload unless saved to the server or localStorage -->`, walk: [
      { lines: [4, 5], note: "Plain links: the browser requests a new document from the server." },
      { lines: [7, 8, 9, 10, 11], note: "Content is already in the HTML: great for SEO and first paint." },
      { lines: [13, 14, 15], note: "Each page reloads, so in-memory state must be persisted elsewhere." }
    ]},
    mistakes: [
      { bad: `"SPAs are always better than MPAs."`, good: `"Pick by need: content sites → MPA/SSG; app-like dashboards → SPA; mixed → Next.js."`, why: "A blog or docs site gains little from an SPA and loses SEO and simplicity." }
    ],
    practice: [
      { level: "B", q: "Is a classic ASP.NET MVC site an MPA or SPA?", a: "MPA: each action returns a new HTML view." },
      { level: "I", q: "Pick MPA or SPA: a recipe blog; a chat app; an online shop.", a: "Blog: MPA/SSG. Chat: SPA. Shop: hybrid (SSR/SSG pages + client interactivity, e.g. Next.js)." },
      { level: "C", q: "How can an MPA keep the cart between pages?", a: "Store it on the server (session/DB) or in a cookie/localStorage and render it into each page." }
    ],
    quiz: [
      { q: "In an MPA, clicking a link…", options: ["Swaps a component", "Loads a new HTML page from the server", "Only changes the URL", "Does nothing"], answer: 1, why: "Every navigation is a full document request." },
      { q: "Which is usually better for SEO out of the box?", options: ["MPA", "Pure client-rendered SPA"], answer: 0, why: "MPA HTML already contains the content." },
      { q: "What is lost on an MPA page change?", options: ["Cookies", "In-memory JavaScript state", "The server database", "localStorage"], answer: 1, why: "The page and its JS are thrown away and reloaded." }
    ],
    rev: {
      sec30: "MPAs request a new server-rendered HTML page for every navigation. Strengths: SEO, simple model, fast first view. Weaknesses: full reloads, lost client state, slower subsequent navigation. SPAs are the opposite. Frameworks like Next.js combine server HTML with SPA navigation.",
      interview: [
        { level: "basic", q: "What is an MPA?", a: "An app where each page is a separate HTML document fetched from the server on navigation." },
        { level: "intermediate", q: "MPA vs SPA for SEO?", a: "MPAs send full HTML, so they're crawlable by default. SPAs need SSR or static generation for the same result." },
        { level: "intermediate", q: "When would you choose an MPA?", a: "Content-heavy sites with little interactivity: blogs, docs, marketing pages." },
        { level: "advanced", q: "How do modern frameworks blur MPA and SPA?", a: "They server-render the first page (MPA-like), then hydrate and handle later navigation on the client (SPA-like)." }
      ],
      compare: { cols: ["", "MPA", "SPA"], rows: [
        ["Navigation", "Full reload", "View swap"],
        ["SEO", "Strong", "Needs SSR/SSG"],
        ["First load", "Fast", "Slower (JS bundle)"],
        ["Later clicks", "Slower", "Fast"],
        ["State", "Lost on reload", "Kept in memory"]
      ]},
      cheat: [
        "MPA = new HTML from server per page",
        "Good SEO and simple server model",
        "Full reloads lose JS state",
        "SPA = fast navigation, weaker default SEO",
        "Next.js blends both"
      ]
    },
    related: ["INTRO-009", "INTRO-012", "INTRO-013", "WEB-004"]
  },

  "INTRO-011": {
    tldr: "Client-side rendering (CSR): the server sends an almost empty HTML page plus JavaScript. The browser downloads and runs the JS, fetches data, and only then draws the content.",
    analogy: { icon: "🥡", text: "A meal kit: the box (HTML + JS) arrives fast, but it's just ingredients. You only get dinner (content) after you cook it at home (the browser)." },
    visual: { type: "timeline", title: "A CSR page load (weather app)", frames: [
      { label: "HTML arrives", state: "<div id=\"root\"></div>", note: "Screen is blank. Nothing useful in the HTML." },
      { label: "JS downloads", state: "main.js (200 KB) loading…", note: "Big bundles = longer blank screen, worse on slow phones." },
      { label: "React renders", state: "“Loading weather…” spinner", note: "React runs and draws the shell." },
      { label: "Data fetched", state: "GET /api/weather → JSON", note: "A second round trip, after the JS is running." },
      { label: "Content shown", state: "☀️ Delhi 31°", note: "Now visible and interactive at the same time." }
    ]},
    points: [
      "Default for a **Vite + React** app: all rendering happens in the browser.",
      "**Pros**: cheap static hosting (CDN), rich interactivity, simple mental model, fast later navigation.",
      "**Cons**: blank first screen, slower on weak devices, weaker SEO and link previews.",
      "Data is fetched **after** JS runs → request waterfall (HTML → JS → data).",
      "Good for dashboards and apps behind a login, where SEO doesn't matter."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function Weather() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current=temperature_2m')
      .then(res => res.json())
      .then(json => setData(json.current));
  }, []);

  if (!data) return <p>Loading weather…</p>;
  return <h1>☀️ Delhi {data.temperature_2m}°C</h1>;
}

createRoot(document.getElementById('root')).render(<Weather />);`, walk: [
      { lines: [17], note: "Everything starts here, in the browser, after the JS bundle has loaded." },
      { lines: [13], note: "First paint is a loading state: the HTML had no content." },
      { lines: [7, 8, 9, 10, 11], note: "Data is fetched only after the component mounts: the CSR waterfall." },
      { lines: [14], note: "Real content appears after the second round trip." }
    ]},
    output: "“Loading weather…” then e.g. “☀️ Delhi 31°C”. View Page Source shows only `<div id=\"root\"></div>`.",
    mistakes: [
      { bad: `// Public recipe site built as pure CSR\n// Google sees: <div id="root"></div>`, good: `// Use SSR or SSG (Next.js / React Router framework mode)`, why: "Content that must rank in search or show link previews should be in the initial HTML." },
      { bad: `if (!data) return null; // blank screen`, good: `if (!data) return <p>Loading weather…</p>;`, why: "Always show a loading state; a blank screen looks broken." }
    ],
    practice: [
      { level: "B", q: "Open View Page Source on a Vite app. What do you see?", a: "Mostly `<div id=\"root\"></div>` and a `<script type=\"module\">` tag. The content comes from JS." },
      { level: "I", q: "Add an error message if the fetch fails.", a: "Add `error` state, `.catch(e => setError(e.message))`, and render it before the loading check." },
      { level: "C", q: "Name two ways to shorten the CSR blank screen.", a: "Code splitting (`lazy`) to shrink the bundle; start data fetching earlier (router loaders / TanStack Query prefetch); or move to SSR." }
    ],
    quiz: [
      { q: "In CSR, what does the first HTML response contain?", options: ["The full page content", "An almost empty shell plus script tags", "Only CSS", "JSON data"], answer: 1, why: "Content is generated by JS in the browser." },
      { q: "Which is a CSR strength?", options: ["Best SEO", "Can be hosted as static files on a CDN", "No JavaScript needed", "Fastest first paint"], answer: 1, why: "No server rendering, so any static host works." },
      { q: "Why is CSR data often slow to appear?", options: ["JSON is large", "Waterfall: HTML → JS → render → fetch", "Browsers block fetch", "React waits 1 second"], answer: 1, why: "Data fetching starts only after JS has loaded and run." }
    ],
    rev: {
      sec30: "CSR sends an empty HTML shell and a JS bundle. The browser runs React, renders, then fetches data. Pros: static hosting, rich interactivity, fast later navigation. Cons: blank first screen, slow on weak devices, weak SEO, request waterfalls. Vite React apps are CSR by default.",
      interview: [
        { level: "basic", q: "What is client-side rendering?", a: "The browser builds the page with JavaScript after downloading an empty HTML shell." },
        { level: "intermediate", q: "Trade-offs of CSR?", a: "Cheap hosting and great interactivity, but slower first content, worse SEO, and dependence on the user's device speed." },
        { level: "intermediate", q: "What is a request waterfall in CSR?", a: "Steps that wait on each other: HTML, then JS, then render, then data fetch, then maybe more fetches in child components." },
        { level: "advanced", q: "When is CSR the right choice?", a: "Logged-in apps like dashboards or admin panels where SEO doesn't matter and users stay long." }
      ],
      cheat: [
        "CSR: empty HTML + JS → browser renders",
        "Vite React = CSR by default",
        "Pros: static hosting, interactivity",
        "Cons: blank screen, SEO, slow devices",
        "Waterfall: HTML → JS → render → fetch",
        "Fix: code splitting, early fetching, or SSR"
      ]
    },
    related: ["INTRO-012", "INTRO-009", "API-013", "PERF-010"]
  },

  "INTRO-012": {
    tldr: "Server-side rendering (SSR): the server runs React for each request and sends ready HTML, so content appears fast. Then the JS loads and React hydrates the page, attaching click handlers to make it interactive.",
    analogy: { icon: "🍱", text: "A ready-made lunch box: you can see the food straight away. The cutlery (JavaScript) arrives a moment later; only then can you actually eat (click)." },
    visual: { type: "flow", title: "SSR request to interactive page", steps: [
      { label: "Request", detail: "Browser asks for `/recipes/biryani`." },
      { label: "Server renders", detail: "React runs on the server, fetches data, produces HTML." },
      { label: "HTML shown", detail: "Browser paints content immediately. Buttons don't work yet." },
      { label: "JS loads", detail: "The same components download to the browser." },
      { label: "Hydrate", detail: "`hydrateRoot` attaches handlers and state to the existing HTML." }
    ]},
    points: [
      "Better **first content** and **SEO**: the HTML already contains the content.",
      "**Hydration**: React reuses the server HTML instead of rebuilding it (`hydrateRoot`).",
      "Server and first client render must output the **same HTML**, or you get a hydration mismatch.",
      "Costs: a running server, compute per request, and a gap between **seeing** and **using** the page.",
      "In practice you get SSR from a **framework**: Next.js or React Router framework mode. APIs live in `react-dom/server`."
    ],
    code: { file: "server.jsx", lang: "jsx", src: `// Simplified SSR (frameworks do this for you)
// --- shared: Recipe.jsx ---
import { useState } from 'react';
export function Recipe({ name }) {
  const [likes, setLikes] = useState(0);
  return (
    <article>
      <h1>{name}</h1>
      <button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>
    </article>
  );
}

// --- server ---
import { renderToString } from 'react-dom/server';
const html = renderToString(<Recipe name="Veg Biryani" />);
// send: <div id="root">\${html}</div> + <script src="/client.js">

// --- client.jsx ---
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <Recipe name="Veg Biryani" />);`, walk: [
      { lines: [4, 5, 6, 7, 8, 9, 10, 11, 12], note: "One component, used on both the server and the client." },
      { lines: [15, 16], note: "Server turns the component into an HTML string (no handlers run)." },
      { lines: [17], note: "That HTML is inside the response, so users and crawlers see the recipe at once." },
      { lines: [20, 21], note: "`hydrateRoot` (not `createRoot`) attaches events to the existing HTML. Same props as the server." }
    ]},
    output: "The recipe title and “❤️ 0” appear instantly in the HTML. The button starts counting only after hydration.",
    mistakes: [
      { bad: `function Theme() {\n  const t = localStorage.getItem('theme');\n  return <p>{t}</p>;\n}`, good: `const [t, setT] = useState('light');\nuseEffect(() => {\n  setT(localStorage.getItem('theme') ?? 'light');\n}, []);`, why: "`localStorage` and `window` don't exist on the server. Read browser-only APIs in an effect." },
      { bad: `<p>Now: {new Date().toLocaleTimeString()}</p>`, good: `// render a placeholder, set the time in useEffect`, why: "Server and client times differ, causing a hydration mismatch." },
      { bad: `createRoot(rootEl).render(<App />); // on SSR HTML`, good: `hydrateRoot(rootEl, <App />);`, why: "`createRoot` throws away the server HTML and re-renders from scratch." }
    ],
    practice: [
      { level: "B", q: "What does hydration do?", a: "Attaches React's event handlers and state to server-rendered HTML, making it interactive without rebuilding the DOM." },
      { level: "I", q: "Click a button the instant an SSR page appears on slow 4G. What happens?", a: "Nothing until the JS loads. Once hydration has started, React can replay clicks on parts still hydrating (inside `Suspense`)." },
      { level: "C", q: "Show a “Welcome back, Asha” greeting from localStorage without a mismatch.", a: "Render “Welcome!” on both sides; in `useEffect` read the name and update state.", code: `const [name, setName] = useState(null);\nuseEffect(() => setName(localStorage.getItem('name')), []);\nreturn <p>{name ? 'Welcome back, ' + name : 'Welcome!'}</p>;` }
    ],
    quiz: [
      { q: "What is hydration?", options: ["Re-fetching data", "Attaching React to existing server HTML", "Compressing HTML", "Rendering on the server"], answer: 1, why: "`hydrateRoot` makes server HTML interactive." },
      { q: "Which causes a hydration mismatch?", options: ["Using props", "`Math.random()` in render output", "Using `useState`", "CSS modules"], answer: 1, why: "Server and client produce different values." },
      { q: "Does SSR make the page interactive sooner than CSR?", options: ["Always", "Not necessarily: content shows sooner, interactivity still waits for JS"], answer: 1, why: "Hydration still needs the JS bundle." }
    ],
    rev: {
      sec30: "SSR renders React on the server per request and sends HTML, so content and SEO are immediate. The client then loads the same components and hydrates with `hydrateRoot`. Output must match on both sides. Costs: server compute, complexity, and a see-but-can't-click gap. Use a framework (Next.js, React Router framework mode).",
      interview: [
        { level: "basic", q: "What is SSR?", a: "Rendering components to HTML on the server for each request so the browser gets ready-to-show content." },
        { level: "intermediate", q: "What causes a hydration mismatch?", a: "Different output on server vs first client render: `Date.now()`, `Math.random()`, `window` checks in render, locale differences, invalid HTML nesting." },
        { level: "intermediate", q: "Costs of SSR?", a: "A running server, compute per request, two environments to code for, and a delay between visible and interactive." },
        { level: "advanced", q: "What does streaming SSR improve?", a: "`renderToString` waits for everything. Streaming (`renderToPipeableStream`) sends the shell first and streams each Suspense boundary as data resolves." },
        { level: "tricky", q: "Why does a button not respond right after SSR content appears?", a: "The HTML is visible but hydration hasn't attached handlers yet; the JS is still loading." }
      ],
      compare: { cols: ["", "CSR", "SSR"], rows: [
        ["HTML on arrival", "Empty shell", "Full content"],
        ["SEO", "Weak", "Strong"],
        ["Hosting", "Static files", "Server needed"],
        ["Interactive after", "JS + render", "JS + hydrate"]
      ]},
      cheat: [
        "SSR: HTML rendered per request on the server",
        "Client: `hydrateRoot`, not `createRoot`",
        "Server/client output must match",
        "Browser APIs only in `useEffect`",
        "Server APIs: `react-dom/server`",
        "Usually via Next.js or React Router framework mode"
      ]
    },
    related: ["INTRO-011", "INTRO-013", "NEXT-007", "NEXT-010"]
  },

  "INTRO-013": {
    tldr: "Static site generation (SSG): pages are rendered to HTML once, at build time, and served as plain files from a CDN. Fastest and cheapest, but the content is only as fresh as the last build.",
    analogy: { icon: "🖨️", text: "Printing restaurant menus in advance. Handing one out is instant and costs nothing extra. Change a price? You reprint (rebuild)." },
    visual: { type: "compare", title: "When is the HTML made?", left: { label: "SSG: at build time", tone: "good", points: [
      "Rendered once during `npm run build`",
      "Served as files from a CDN: very fast",
      "No server needed per request",
      "Data frozen until the next build"
    ]}, right: { label: "SSR: at request time", tone: "neutral", points: [
      "Rendered for every visitor",
      "Always fresh, can be personalised",
      "Needs a running server",
      "Slower and costlier under load"
    ]}},
    points: [
      "Build step: fetch data → render each page → write `.html` files.",
      "Pages still **hydrate** in the browser for interactivity.",
      "Best for content that rarely changes: blogs, docs, recipe pages, marketing.",
      "Not for per-user or second-by-second data (cart, inbox, stock prices).",
      "Middle ground: **ISR / revalidation** (Next.js, framework-only) rebuilds a page in the background after N seconds.",
      "Tools: Next.js static rendering, React Router framework mode `prerender`, Astro."
    ],
    code: { file: "build.jsx", lang: "jsx", src: `// Minimal SSG build script (frameworks automate this)
import { writeFileSync, mkdirSync } from 'node:fs';
import { renderToString } from 'react-dom/server';

const recipes = [
  { slug: 'pancakes', title: 'Fluffy Pancakes', mins: 20 },
  { slug: 'dal', title: 'Yellow Dal', mins: 35 },
];

function RecipePage({ recipe }) {
  return (
    <article>
      <h1>{recipe.title}</h1>
      <p>⏱️ {recipe.mins} minutes</p>
    </article>
  );
}

mkdirSync('dist/recipes', { recursive: true });
for (const r of recipes) {
  const html = renderToString(<RecipePage recipe={r} />);
  writeFileSync('dist/recipes/' + r.slug + '.html', '<!doctype html>' + html);
}`, walk: [
      { lines: [5, 6, 7, 8], note: "Data is read at build time (a CMS, files or an API)." },
      { lines: [20], note: "One page per recipe. A new recipe means running the build again (or revalidation)." },
      { lines: [21], note: "Each page is rendered to an HTML string once." },
      { lines: [22], note: "Written to disk as a static file; a CDN serves it to every visitor." }
    ]},
    output: "dist/recipes/pancakes.html and dist/recipes/dal.html, each containing the full recipe HTML.",
    mistakes: [
      { bad: `// SSG page shows "Hello, {user.name}" and cart count`, good: `// Static shell + fetch user/cart on the client, or use SSR`, why: "Build-time HTML is the same for everyone. Per-user data must be loaded at request time or in the browser." },
      { bad: `// Stock price page statically generated once a day`, good: `// SSR, revalidation, or client fetching for live data`, why: "SSG content goes stale between builds." }
    ],
    practice: [
      { level: "B", q: "SSG or SSR: a cooking blog; a logged-in order history page?", a: "Blog: SSG. Order history: SSR or CSR (per-user, changing data)." },
      { level: "I", q: "Add a third recipe to the build script. What must happen for users to see it?", a: "Add it to `recipes` and rerun the build, then deploy the new files." },
      { level: "C", q: "A product catalogue with 50,000 items changes prices hourly. Pure SSG?", a: "Not ideal: builds get slow and prices go stale. Use incremental/on-demand revalidation (framework feature) or SSR with caching." }
    ],
    quiz: [
      { q: "When is HTML produced in SSG?", options: ["On every request", "At build time", "In the browser", "Never"], answer: 1, why: "SSG renders once during the build." },
      { q: "Main SSG advantage over SSR?", options: ["Personalised pages", "Speed and low cost: static files on a CDN", "Real-time data", "No build step"], answer: 1, why: "No server work per visitor." },
      { q: "Do SSG pages still use JavaScript?", options: ["No, never", "Yes, they can hydrate for interactivity"], answer: 1, why: "SSG controls how HTML is produced; React still hydrates it." }
    ],
    rev: {
      sec30: "SSG renders pages to HTML at build time and serves them from a CDN: fastest, cheapest, great SEO. Content is frozen until rebuilt, and it's the same for every user. Use it for blogs, docs and recipes; use SSR or client fetching for personalised or live data. Revalidation (ISR) is a framework middle ground.",
      interview: [
        { level: "basic", q: "What is SSG?", a: "Generating each page's HTML once at build time and serving it as static files." },
        { level: "intermediate", q: "When does SSG beat SSR?", a: "When content is the same for everyone and changes rarely: it's faster, cheaper and more reliable under traffic." },
        { level: "intermediate", q: "What's the main drawback?", a: "Stale data until rebuild, and long build times for very large sites." },
        { level: "advanced", q: "What is ISR / revalidation?", a: "A framework feature (e.g. Next.js) that serves the static page but regenerates it in the background after a time or on demand." }
      ],
      compare: { cols: ["", "SSG", "SSR", "CSR"], rows: [
        ["HTML made", "Build time", "Each request", "In browser"],
        ["Speed", "Fastest", "Medium", "Slow first load"],
        ["Fresh data", "Until rebuild", "Always", "Always"],
        ["Hosting", "CDN", "Server", "CDN"]
      ]},
      cheat: [
        "SSG = HTML at build time",
        "Served from CDN: fast and cheap",
        "Same HTML for all users",
        "Stale until rebuild",
        "ISR/revalidation = framework-only middle ground",
        "Great for blogs, docs, recipes"
      ]
    },
    related: ["INTRO-012", "INTRO-010", "NEXT-008", "PROD-007"]
  },

  "INTRO-014": {
    tldr: "React only draws the UI, so real apps add tools around it: a router for pages, a data-fetching library, state management, styling, testing, and often a full framework that bundles these together.",
    analogy: { icon: "🧳", text: "React is the suitcase. For a trip you still pack chargers (router), snacks (data), a wallet (state) and clothes (styling). A framework is a pre-packed travel kit." },
    visual: { type: "tree", title: "The React ecosystem map", root: { label: "React app", children: [
      { label: "Build: Vite 8" },
      { label: "Routing", children: [{ label: "React Router 7" }] },
      { label: "Server data", children: [{ label: "TanStack Query v5" }] },
      { label: "Client state", children: [{ label: "Redux Toolkit / Zustand" }] },
      { label: "Styling", children: [{ label: "CSS Modules / Tailwind" }] },
      { label: "Testing", children: [{ label: "Vitest + RTL + Playwright" }] },
      { label: "Frameworks", note: "bundle many of these", children: [{ label: "Next.js 16 / RR framework" }] }
    ]}},
    points: [
      "**Build**: Vite 8 (`npm create vite@latest`). Create React App is deprecated (Feb 2025).",
      "**Routing**: React Router 7 (`react-router`). **Server data**: TanStack Query (caching, refetching).",
      "**Client state**: built-in `useState`/Context first; Redux Toolkit or Zustand for larger shared state.",
      "**Styling**: plain CSS, CSS Modules, Tailwind; **Types**: TypeScript.",
      "**Testing**: Vitest + React Testing Library, MSW for API mocks, Playwright for end-to-end.",
      "**Frameworks**: Next.js (App Router, Server Components) or React Router framework mode."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Notes() {
  const { data, isPending, error } = useQuery({
    queryKey: ['notes'],
    queryFn: () => fetch('/api/notes').then(r => r.json()),
  });
  if (isPending) return <p>Loading notes…</p>;
  if (error) return <p>Could not load notes.</p>;
  return <ul>{data.map(n => <li key={n.id}>{n.title}</li>)}</ul>;
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);`, walk: [
      { lines: [2], note: "Routing library: React Router 7." },
      { lines: [3, 5], note: "Server-data library: TanStack Query, with one shared client cache." },
      { lines: [8, 9, 10, 11], note: "`useQuery` fetches, caches and tracks loading/error for you." },
      { lines: [18, 19], note: "Libraries plug in as providers that wrap the app." }
    ]},
    mistakes: [
      { bad: `npx create-react-app notes`, good: `npm create vite@latest notes -- --template react`, why: "Create React App is deprecated (Feb 2025). Use Vite or a framework." },
      { bad: `// Redux store for every fetched API list`, good: `// TanStack Query for server data; Redux/Zustand only for shared client state`, why: "Server data needs caching and refetching, which a query library handles. Don't hand-roll it in a global store." }
    ],
    practice: [
      { level: "B", q: "Match: routing, server data, testing → which tools?", a: "React Router; TanStack Query; Vitest + React Testing Library (+ Playwright for E2E)." },
      { level: "I", q: "Pick a stack for a small notes app with 3 pages and an API.", a: "Vite + React Router + TanStack Query + CSS Modules + Vitest. No Redux needed yet." },
      { level: "C", q: "A public shop needs SEO and fast first load. What changes in the stack?", a: "Use a framework with SSR/SSG: Next.js App Router or React Router framework mode." }
    ],
    quiz: [
      { q: "Recommended way to start a new client-side React app?", options: ["Create React App", "Vite", "Webpack by hand", "jQuery"], answer: 1, why: "CRA is deprecated; Vite is the standard build tool." },
      { q: "Which library is designed for server data (caching, refetch)?", options: ["Zustand", "TanStack Query", "Tailwind", "Playwright"], answer: 1, why: "TanStack Query manages server state." },
      { q: "Which is a React framework?", options: ["Next.js", "Vitest", "Redux Toolkit", "MSW"], answer: 0, why: "Next.js adds routing, rendering modes and data loading." }
    ],
    rev: {
      sec30: "React handles the view. Around it: Vite to build, React Router for routes, TanStack Query for server data, useState/Context then Redux Toolkit or Zustand for client state, CSS Modules or Tailwind for styles, TypeScript, Vitest + RTL + MSW + Playwright for tests. Next.js or React Router framework mode bundle routing, SSR and data loading.",
      interview: [
        { level: "basic", q: "Why does React need an ecosystem?", a: "React is only a UI library; routing, data fetching, state and testing come from other tools." },
        { level: "intermediate", q: "Server state vs client state?", a: "Server state is remote data you cache (TanStack Query). Client state is UI-only data like a modal or theme (useState, Zustand, Redux)." },
        { level: "intermediate", q: "Why not Create React App?", a: "It was deprecated in Feb 2025. Vite is faster and maintained; frameworks cover SSR needs." },
        { level: "advanced", q: "When choose a framework over Vite + libraries?", a: "When you need SSR/SSG, SEO, server data loading or Server Components; otherwise Vite keeps things simpler." }
      ],
      cheat: [
        "Build: Vite 8 (CRA deprecated)",
        "Routing: React Router 7 (`react-router`)",
        "Server data: TanStack Query v5",
        "Client state: useState/Context → Zustand / Redux Toolkit",
        "Styling: CSS Modules, Tailwind",
        "Tests: Vitest, RTL, MSW, Playwright",
        "Frameworks: Next.js 16, React Router framework mode"
      ]
    },
    related: ["ENV-003", "ROUTE-003", "STORE-001", "NEXT-001"]
  },

  "INTRO-015": {
    tldr: "`react` defines components, elements and hooks. Your components return elements (a description of UI). The reconciler compares new and old trees, and a renderer like `react-dom` applies the changes to the real screen.",
    analogy: { icon: "🍳", text: "A recipe (component) produces an order ticket (elements). The head chef (reconciler) spots what's new versus the last ticket. The kitchen staff (react-dom) only cook what changed." },
    visual: { type: "layers", title: "React's layers, top to bottom", items: [
      { label: "Your components", detail: "`function TempLabel()` returning JSX. Pure: same input → same output." },
      { label: "react", detail: "Elements, hooks (`useState`), `Suspense`. Platform-independent." },
      { label: "Reconciler (Fiber)", detail: "Diffs new vs old element trees by type and key; schedules work by priority." },
      { label: "Renderer: react-dom", detail: "Commits DOM changes. `createRoot`, `hydrateRoot`. React Native is another renderer." },
      { label: "Browser DOM", detail: "The real nodes the user sees and clicks." }
    ]},
    points: [
      "**Render phase**: React calls components to get elements. Must be pure; may run twice in dev Strict Mode.",
      "**Reconciliation**: compares trees; same type + key → update; different type → destroy and rebuild (state lost).",
      "**Commit phase**: the renderer applies minimal DOM changes, then effects run.",
      "**Fiber**: the internal unit of work per component; lets React pause, prioritise and resume rendering.",
      "Package split: `react` (what UI is) + `react-dom` / React Native (where it is drawn)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';            // core: hooks, elements
import { createRoot } from 'react-dom/client'; // renderer

function TempLabel({ temp }) {
  return <p className="temp">🌡️ {temp}°C</p>;
}

function App() {
  const [temp, setTemp] = useState(20);
  return (
    <main>
      <h1>Weather</h1>
      <TempLabel temp={temp} />
      <button onClick={() => setTemp(temp + 1)}>Warmer</button>
    </main>
  );
}

const el = <TempLabel temp={20} />;
console.log(el.type === TempLabel, el.props); // true { temp: 20 }

createRoot(document.getElementById('root')).render(<App />);`, walk: [
      { lines: [1, 2], note: "Two packages: `react` (core) and `react-dom` (browser renderer)." },
      { lines: [19, 20], note: "An element is a plain object: `type` points to the component, plus `props`." },
      { lines: [9, 14], note: "Click → state update → render phase calls `App` and `TempLabel` again." },
      { lines: [5], note: "Reconciler sees the same `<p>`; commit changes only its text node." },
      { lines: [22], note: "The renderer owns the root and commits changes to the DOM." }
    ]},
    output: "Console: `true { temp: 20 }`. Page: “🌡️ 20°C”; each “Warmer” click updates only that text.",
    mistakes: [
      { bad: `function Counter({ count }) {\n  fetch('/api/log?c=' + count); // in render\n  return <p>{count}</p>;\n}`, good: `useEffect(() => {\n  fetch('/api/log?c=' + count);\n}, [count]);`, why: "Render can run many times (Strict Mode, transitions). Side effects belong in effects or handlers." },
      { bad: `// react@19 with react-dom@18`, good: `// keep react and react-dom on the same version`, why: "Mismatched versions or duplicate React copies break hooks (“Invalid hook call”)." }
    ],
    practice: [
      { level: "B", q: "Which package: `useState`, `createRoot`, `hydrateRoot`, `Suspense`?", a: "`react`: useState, Suspense. `react-dom/client`: createRoot, hydrateRoot." },
      { level: "I", q: "Click “Warmer” 3 times. How many DOM nodes change per click?", a: "One text node inside `<p>`. Check with DevTools → Elements (it flashes)." },
      { level: "C", q: "Swap `<p>` for `<span>` in `TempLabel` based on a flag. What happens to state inside it?", a: "Different element type → React unmounts the old subtree and mounts a new one, so any state inside resets." }
    ],
    quiz: [
      { q: "What does a component return?", options: ["DOM nodes", "React elements (descriptions of UI)", "HTML strings", "Fibers"], answer: 1, why: "The renderer turns elements into DOM changes." },
      { q: "Which part decides what changed between renders?", options: ["react-dom/server", "The reconciler", "Vite", "The browser"], answer: 1, why: "Reconciliation diffs old and new trees." },
      { q: "Why must components be pure?", options: ["For CSS", "Render may run more than once or be thrown away", "To use JSX", "For TypeScript"], answer: 1, why: "Strict Mode, transitions and Suspense can re-run renders." }
    ],
    rev: {
      sec30: "Components return elements. `react` holds elements and hooks. On a state change, the render phase calls components; the reconciler (Fiber) diffs the new tree against the old by type and key; the commit phase lets the renderer (`react-dom`) apply minimal DOM changes, then effects run. Keep render pure.",
      interview: [
        { level: "basic", q: "Why are `react` and `react-dom` separate?", a: "`react` defines what UI is, independent of platform. `react-dom` renders to the browser; React Native renders to mobile." },
        { level: "intermediate", q: "What is reconciliation?", a: "Comparing the new element tree with the previous one, using type and key, to decide which nodes to create, update or delete." },
        { level: "intermediate", q: "Render phase vs commit phase?", a: "Render calls components and computes changes (pure, can be interrupted). Commit applies them to the DOM and runs effects." },
        { level: "advanced", q: "What is Fiber?", a: "React's internal structure since v16: one unit of work per component, so rendering can be split, prioritised, paused and resumed." },
        { level: "tricky", q: "What happens if an element's type changes from `<div>` to `<section>`?", a: "React destroys the old subtree, including state, and builds a new one." }
      ],
      predict: [
        { code: `function App() {\n  console.log('render');\n  return <p>Hi</p>;\n}\n// main.jsx: <StrictMode><App /></StrictMode>`, answer: "“render” logs twice in development, once in production.", why: "Strict Mode double-invokes render in dev to catch impure components." }
      ],
      cheat: [
        "Component → elements → reconciler → renderer → DOM",
        "`react`: hooks, elements; `react-dom/client`: createRoot",
        "Render phase must be pure",
        "Same type + key = update; different type = remount",
        "Commit: DOM changes, then effects",
        "Fiber = interruptible unit of work",
        "Keep `react` and `react-dom` versions equal"
      ]
    },
    related: ["RENDER-001", "RENDER-005", "RENDER-007", "INTRO-007"]
  }
};
