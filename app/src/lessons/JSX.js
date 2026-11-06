// JSX Fundamentals (JSX-001 to JSX-016)
export default {
  "JSX-001": {
    tldr: "JSX is JavaScript that looks like HTML. You write tags to describe the UI; the build tool turns each tag into a function call that returns a plain object (a React element).",
    analogy: { icon: "🧾", text: "A food-order shorthand: you write “1× Dosa, extra chutney”. The kitchen (build tool) rewrites it into a full order ticket (function calls) before cooking. The browser never sees the shorthand." },
    visual: { type: "flow", title: "From JSX to pixels", steps: [
      { label: "You write JSX", detail: "`<h1 className=\"title\">Hi, {name}</h1>` in `App.jsx`." },
      { label: "Vite compiles it", detail: "The tag becomes a call: `jsxs('h1', { className: 'title', children: [...] })`." },
      { label: "Call returns an object", detail: "A React element: `{ type: 'h1', props: {...} }`. It only describes UI." },
      { label: "react-dom draws it", detail: "React reads the object and creates a real `<h1>` in the page." }
    ]},
    points: [
      "JSX (JavaScript XML) is a **syntax extension**: not HTML, not a string, not a template language.",
      "Browsers can't run JSX. Vite **compiles** it to plain JavaScript first.",
      "Each tag becomes a **React element** (a plain object describing what to show).",
      "Curly braces `{ }` drop JavaScript values into the markup: `{name}`, `{price * qty}`.",
      "Lowercase tag = HTML element (`<div>`); Capitalised tag = your component (`<CartItem />`).",
      "JSX is a value: store it in a variable, return it, pass it as a prop."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `const dishes = [
  { id: 1, name: 'Masala Dosa', price: 120 },
  { id: 2, name: 'Paneer Wrap', price: 160 },
];

function DishRow({ dish }) {
  return (
    <li className="dish">
      <b>{dish.name}</b> - Rs {dish.price}
    </li>
  );
}

export default function App() {
  const shop = 'Spice Corner';
  const heading = <h1>Order from {shop.toUpperCase()}</h1>;

  return (
    <main>
      {heading}
      <ul>
        {dishes.map(d => <DishRow key={d.id} dish={d} />)}
      </ul>
    </main>
  );
}`, walk: [
      { lines: [6, 7, 8, 9, 10, 11], note: "A component is a function that **returns JSX**. `className` and `{dish.name}` are JSX features." },
      { lines: [16], note: "JSX is just a value: build an element and keep it in a variable." },
      { lines: [19, 20], note: "One root element (`<main>`) wraps everything; `{heading}` inserts the stored element." },
      { lines: [22], note: "`map()` turns data into a list of elements. Capitalised `DishRow` means React calls your function." }
    ]},
    output: "A heading “Order from SPICE CORNER” and a list: “Masala Dosa - Rs 120”, “Paneer Wrap - Rs 160”.",
    mistakes: [
      { bad: `const title = "<h1>Menu</h1>"; // a string\nreturn <div>{title}</div>;`, good: `const title = <h1>Menu</h1>; // JSX, no quotes\nreturn <div>{title}</div>;`, why: "With quotes it's just text: React prints the angle brackets literally. JSX is written **without** quotes." },
      { bad: `<div class="card">`, good: `<div className="card">`, why: "JSX attributes are JavaScript property names; `class` is a reserved word in JS, so use `className`." }
    ],
    practice: [
      { level: "B", q: "Render your name in an `<h2>` using a variable.", a: "Store it in a const and use braces.", code: `const name = 'Asha';\nreturn <h2>Hello, {name}!</h2>;` },
      { level: "B", q: "Show today's date inside a `<p>`.", a: "Call a function inside braces: `<p>{new Date().toDateString()}</p>`." },
      { level: "I", q: "Store a `<span>` badge in a variable and render it twice.", a: "`const badge = <span>New</span>;` then `<p>{badge} Tea {badge}</p>`. Elements are reusable values." },
      { level: "C", q: "`console.log(<p>Hi</p>)`: what do you see?", a: "An object like `{ type: 'p', key: null, props: { children: 'Hi' } }`, not a DOM node." }
    ],
    quiz: [
      { q: "What is JSX at runtime?", options: ["HTML the browser parses", "Plain objects created by function calls", "A string of markup", "A separate template language"], answer: 1, why: "JSX is compiled away; each tag becomes a call that returns a React element object." },
      { q: "Who turns JSX into JavaScript in a Vite app?", options: ["The browser", "React DOM at runtime", "The build tool (Vite's React plugin)"], answer: 2, why: "The compiler runs before the browser sees your code." },
      { q: "`<cartItem />` (lowercase) is treated as…", options: ["Your CartItem component", "An unknown HTML tag", "A syntax error"], answer: 1, why: "Lowercase tags are HTML element names; components must start with a capital letter." }
    ],
    rev: {
      sec30: "JSX is a syntax extension that lets you describe UI with HTML-like tags inside JavaScript. The compiler turns each tag into a `jsx()` call that returns a React element (a plain object `{ type, props, key }`). Braces insert JS expressions. It's optional but universal.",
      interview: [
        { level: "basic", q: "What is JSX?", a: "A JavaScript syntax extension for describing UI. It compiles to function calls that return React elements; the browser never runs JSX directly." },
        { level: "basic", q: "Is JSX required to use React?", a: "No. You can call `createElement` yourself, but JSX is far more readable, so practically every project uses it." },
        { level: "intermediate", q: "What does a JSX expression evaluate to?", a: "A React element: an immutable plain object with `type`, `props` (including `children`) and `key`. It describes UI; React DOM turns it into real nodes later." },
        { level: "intermediate", q: "Why can JSX contain variables and `map()` but templates in other frameworks need special syntax?", a: "Because JSX is JavaScript. Any expression works inside braces, so there's no template language with its own loops and conditionals." },
        { level: "tricky", q: "Is JSX safe from XSS when inserting user text?", a: "Yes for text: values in `{ }` are escaped before rendering. The risk is `dangerouslySetInnerHTML` and `javascript:` URLs." }
      ],
      predict: [
        { code: `const el = <p className="note">Buy milk</p>;\nconsole.log(el.type, el.props.children);`, answer: "p Buy milk", why: "The element is an object; `type` is the tag name, text sits in `props.children`." }
      ],
      cheat: [
        "JSX = JavaScript XML, a syntax extension",
        "Compiled to `jsx()` calls; browser never sees JSX",
        "Result: React element `{ type, props, key }`",
        "`{ }` inserts any JS expression",
        "Lowercase tag = HTML, Capitalised = component",
        "Put JSX in `.jsx` / `.tsx` files in Vite"
      ]
    },
    related: ["JSX-002", "JSX-004", "INTRO-001", "COMP-001"]
  },

  "JSX-002": {
    tldr: "JSX and `createElement` produce the same elements. JSX wins because nested UI reads like the screen it draws; hand-written calls turn into a pile of brackets.",
    analogy: { icon: "🗺️", text: "Directions as a map vs as a list of coordinates. Both get you to the café, but the map shows the shape at a glance." },
    visual: { type: "compare", title: "Same card, two ways", left: { label: "createElement", tone: "bad", points: [
      "`h('div', { className: 'card' }, h('h2', null, title), ...)`",
      "Nesting hidden in commas and brackets",
      "Easy to misplace a closing parenthesis",
      "Hard to see the UI shape"
    ]}, right: { label: "JSX", tone: "good", points: [
      "`<div className=\"card\"><h2>{title}</h2></div>`",
      "Nesting looks like the page",
      "Closing tags show where blocks end",
      "Compiles to the same elements"
    ]}},
    points: [
      "`createElement(type, props, ...children)` is the plain-JS way to build an element.",
      "JSX is **sugar** (shorter syntax) for those calls; the output elements are identical.",
      "JSX keeps markup and the logic that drives it in the same component.",
      "Compile-time checks catch typos like unclosed tags before the app runs.",
      "`createElement` still exists and is handy when the element type is chosen at runtime."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { createElement as h } from 'react';

// Without JSX
function RecipeCardPlain({ recipe }) {
  return h('div', { className: 'card' },
    h('h2', null, recipe.title),
    h('p', null, 'Ready in ', recipe.minutes, ' min'),
    h('button', { onClick: () => alert('Saved!') }, 'Save')
  );
}

// With JSX (same result)
function RecipeCard({ recipe }) {
  return (
    <div className="card">
      <h2>{recipe.title}</h2>
      <p>Ready in {recipe.minutes} min</p>
      <button onClick={() => alert('Saved!')}>Save</button>
    </div>
  );
}

const pasta = { title: 'Tomato Pasta', minutes: 20 };

export default function App() {
  return (
    <>
      <RecipeCardPlain recipe={pasta} />
      <RecipeCard recipe={pasta} />
    </>
  );
}`, walk: [
      { lines: [5, 6, 7, 8, 9], note: "`createElement`: type, props (or `null`), then children. Nesting = calls inside calls." },
      { lines: [15, 16, 17, 18, 19], note: "JSX version: the structure is visible at a glance." },
      { lines: [28, 29], note: "Both render identical cards: JSX is only a nicer way to write the same calls." }
    ]},
    output: "Two identical cards: “Tomato Pasta”, “Ready in 20 min” and a Save button.",
    mistakes: [
      { bad: `h('ul', null, items.map(i => h('li', null, i)))`, good: `h('ul', null, items.map(i => h('li', { key: i }, i)))`, why: "Keys are still required without JSX: pass `key` in the props object for list items." },
      { bad: `h('div', 'card', 'Hi')`, good: `h('div', { className: 'card' }, 'Hi')`, why: "The second argument is the **props object** (or `null`), never a class string." }
    ],
    practice: [
      { level: "B", q: "Rewrite `<p>Hello</p>` with `createElement`.", a: "`createElement('p', null, 'Hello')`" },
      { level: "I", q: "Rewrite `<button disabled onClick={buy}>Buy</button>` without JSX.", a: "Props go in the object.", code: `createElement('button', { disabled: true, onClick: buy }, 'Buy')` },
      { level: "I", q: "Render a heading whose tag (`h1`/`h2`) comes from a variable.", a: "With JSX use a capitalised variable: `const Tag = big ? 'h1' : 'h2'; <Tag>Menu</Tag>`. Or `createElement(tag, null, 'Menu')`." },
      { level: "C", q: "Name one real reason to use `createElement` directly today.", a: "Libraries or code generators that build elements from data (e.g. a schema-driven form) without a JSX compile step." }
    ],
    quiz: [
      { q: "Do JSX and `createElement` produce different elements?", options: ["Yes, JSX elements are faster", "No, they're the same objects", "Yes, JSX creates DOM nodes"], answer: 1, why: "JSX is syntax sugar; the resulting React elements are the same shape." },
      { q: "In `createElement('a', X, 'Shop')`, what is X?", options: ["The children", "The props object or null", "The CSS class", "The key"], answer: 1, why: "Signature: `createElement(type, props, ...children)`." },
      { q: "Main benefit of JSX?", options: ["It runs without a build step", "Readability: markup looks like the UI", "It removes the need for React DOM"], answer: 1, why: "JSX still needs compiling; its win is readability and catching syntax errors early." }
    ],
    rev: {
      sec30: "JSX is syntax sugar over element-creation calls. `createElement(type, props, ...children)` gives the same result but nested UI becomes unreadable. JSX shows structure, keeps markup next to logic, and errors appear at compile time. `createElement` is still useful when generating UI from data.",
      interview: [
        { level: "basic", q: "Why use JSX instead of `createElement`?", a: "Readability. Nested UI written as calls is hard to scan; JSX looks like the output and compiles to the same elements." },
        { level: "intermediate", q: "Does JSX compile to `React.createElement` today?", a: "Not with the automatic runtime (React 17+). It compiles to `jsx()`/`jsxs()` from `react/jsx-runtime`; the classic runtime used `createElement`." },
        { level: "intermediate", q: "Is JSX a templating language like Razor?", a: "No. Razor mixes C# into HTML; JSX is the reverse: markup inside JS, so you use normal JS for loops and conditions." },
        { level: "advanced", q: "When would you skip JSX?", a: "In a no-build script, or when building elements from data where the type is dynamic. Even then, a capitalised variable in JSX often works." }
      ],
      compare: { cols: ["", "JSX", "createElement"], rows: [
        ["Readability", "High, looks like UI", "Low for nested UI"],
        ["Build step", "Required", "Not required"],
        ["Output", "React element", "React element"],
        ["Keys", "`key={id}`", "`{ key: id }` in props"]
      ]},
      cheat: [
        "`createElement(type, props, ...children)`",
        "JSX = sugar; same elements out",
        "Props arg is an object or `null`",
        "Keys still needed without JSX",
        "Automatic runtime emits `jsx()`, not `createElement`"
      ]
    },
    related: ["JSX-001", "JSX-004", "INTRO-008"]
  },

  "JSX-003": {
    tldr: "JSX looks like HTML but follows JavaScript rules: attributes are camelCase, `class` becomes `className`, `for` becomes `htmlFor`, and every tag must close.",
    analogy: { icon: "✈️", text: "British vs American English. Mostly the same words, but “colour” is “color” and “lift” is “elevator”. Learn the handful of differences and you're fluent." },
    visual: { type: "compare", title: "HTML habit → JSX rule", left: { label: "HTML", tone: "neutral", points: [
      "`class=\"card\"`, `for=\"email\"`",
      "`onclick=\"buy()\"` (a string)",
      "`<img src=\"x.png\">`, `<br>`",
      "`style=\"color: red\"`",
      "`<!-- comment -->`"
    ]}, right: { label: "JSX", tone: "good", points: [
      "`className=\"card\"`, `htmlFor=\"email\"`",
      "`onClick={buy}` (a function)",
      "`<img src=\"x.png\" />`, `<br />`",
      "`style={{ color: 'red' }}`",
      "`{/* comment */}`"
    ]}},
    points: [
      "Attributes are **camelCase**: `onClick`, `tabIndex`, `maxLength`, `autoFocus`.",
      "`class` and `for` are JS reserved words, so JSX uses `className` and `htmlFor`.",
      "Every tag closes; empty ones **self-close**: `<input />`, `<img />`.",
      "`aria-*` and `data-*` attributes keep their dashes.",
      "Events get a **function**, `style` gets an **object**, numbers/booleans go in braces: `maxLength={20}`."
    ],
    code: { file: "Signup.jsx", lang: "jsx", src: `export default function Signup() {
  function join() {
    alert('Welcome to the newsletter!');
  }

  return (
    <form className="signup">
      {/* label linked to input */}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        maxLength={40}
        autoFocus
      />
      <br />
      <button
        type="button"
        onClick={join}
        aria-label="Join newsletter"
        style={{ backgroundColor: 'teal', color: 'white' }}
      >
        Join
      </button>
    </form>
  );
}`, walk: [
      { lines: [7, 9], note: "`className` and `htmlFor` replace the JS reserved words `class` and `for`." },
      { lines: [8], note: "JSX comments live inside braces: `{/* ... */}`." },
      { lines: [13, 14, 15, 16], note: "camelCase names, numbers in braces, a bare attribute means `true`, and `<input />` self-closes." },
      { lines: [19, 20, 21], note: "`onClick` takes the function itself; `aria-label` keeps its dash; `style` is an object." }
    ]},
    output: "An Email field (focused on load, max 40 chars) and a teal Join button that shows an alert.",
    mistakes: [
      { bad: `<button onclick="join()">Join</button>`, good: `<button onClick={join}>Join</button>`, why: "JSX events are camelCase and take a function. A string handler does nothing (React warns in dev)." },
      { bad: `<img src="logo.png">`, good: `<img src="logo.png" alt="Shop logo" />`, why: "HTML lets void tags stay open; JSX doesn't. Unclosed tags are a compile error." }
    ],
    practice: [
      { level: "B", q: "Convert: `<div class=\"note\" tabindex=\"0\">`", a: "`<div className=\"note\" tabIndex={0}>`" },
      { level: "B", q: "Convert: `<label for=\"qty\">Qty</label><input id=\"qty\" maxlength=\"2\">`", a: "Rename and close.", code: `<label htmlFor="qty">Qty</label>\n<input id="qty" maxLength={2} />` },
      { level: "I", q: "Which attributes keep dashes in JSX?", a: "`aria-*` and `data-*` (e.g. `aria-label`, `data-id`). Everything else is camelCase." },
      { level: "C", q: "Convert `<p style=\"font-size:18px; margin-top:4px\">`.", a: "`<p style={{ fontSize: 18, marginTop: 4 }}>`; numbers become px automatically." }
    ],
    quiz: [
      { q: "Why `className` instead of `class`?", options: ["React prefers longer names", "`class` is a reserved word in JavaScript", "HTML5 renamed it"], answer: 1, why: "JSX is JavaScript; it uses the DOM property name `className`." },
      { q: "Which is valid JSX?", options: ["`<br>`", "`<br />`", "`<br></br/>`"], answer: 1, why: "Void elements must self-close." },
      { q: "`<div data-id=\"7\">` in JSX is…", options: ["An error, must be `dataId`", "Valid as written", "Converted to `dataset`"], answer: 1, why: "`data-*` and `aria-*` keep their dashes." }
    ],
    rev: {
      sec30: "JSX is JavaScript, so HTML attributes become DOM property names: camelCase (`onClick`, `tabIndex`), `className`, `htmlFor`. All tags close, `style` takes an object, events take functions, comments are `{/* */}`. `aria-*` and `data-*` stay dashed.",
      interview: [
        { level: "basic", q: "Name three differences between JSX and HTML.", a: "`className` instead of `class`, camelCase attributes like `onClick`, and every tag must be closed (`<img />`)." },
        { level: "intermediate", q: "Why is it `htmlFor`, not `for`?", a: "`for` is a JS keyword. JSX uses the DOM property name, which is `htmlFor`." },
        { level: "intermediate", q: "How do you pass a number or boolean attribute?", a: "In braces: `maxLength={20}`, `disabled={false}`. A bare attribute like `disabled` means `true`." },
        { level: "tricky", q: "Does `class=\"x\"` work in React 19?", a: "React renders it with a dev warning, but `className` is the correct, expected form. Don't rely on `class`." }
      ],
      debug: [
        { code: `<input type="checkbox" checked="false" />`, fix: `<input type="checkbox" defaultChecked={false} />`, why: "The string \"false\" is truthy, so the box shows checked. Pass a boolean in braces." }
      ],
      cheat: [
        "`class` → `className`, `for` → `htmlFor`",
        "camelCase: `onClick`, `tabIndex`, `maxLength`",
        "Close everything: `<img />`, `<br />`, `<input />`",
        "`style={{ fontSize: 18 }}`",
        "`aria-*`, `data-*` keep dashes",
        "Comments: `{/* ... */}`"
      ]
    },
    related: ["JSX-009", "JSX-010", "JSX-011", "WEB-005"]
  },

  "JSX-004": {
    tldr: "The compiler rewrites each JSX tag into a `jsx()` call imported automatically from `react/jsx-runtime`. Attributes and children go into one props object; `key` is passed separately.",
    analogy: { icon: "🍽️", text: "A waiter hears “two dosas, no onion” and writes a standard order slip the kitchen understands. The compiler is the waiter: same order, kitchen-ready format." },
    visual: { type: "flow", title: "What the compiler emits", steps: [
      { label: "Your tag", detail: "`<li key={t.id} className=\"todo\">{t.text}</li>`" },
      { label: "Auto import", detail: "`import { jsx } from 'react/jsx-runtime'` is added for you." },
      { label: "Type", detail: "Lowercase → string `'li'`. Capitalised → your function `TodoItem`." },
      { label: "Props + children", detail: "`{ className: 'todo', children: t.text }`" },
      { label: "Key separate", detail: "`jsx('li', {...}, t.id)`: key is the 3rd argument, not a prop." }
    ]},
    points: [
      "**Automatic runtime** (React 17+): no `import React` needed in JSX files.",
      "`jsx()` for zero/one child, `jsxs()` for several static children, `jsxDEV()` in dev builds (adds file/line info).",
      "`<>...</>` compiles to `jsx(Fragment, ...)`.",
      "`key` is pulled out of props; reading `props.key` in a component gives `undefined` (dev warns).",
      "In React 19, `ref` is a normal prop for function components (no `forwardRef` needed).",
      "Old **classic runtime** emitted `React.createElement`, so forgetting `import React` caused `React is not defined`."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { jsx } from 'react/jsx-runtime'; // learning only

// Written in JSX
const fromJsx = <li key="t1" className="todo">Buy milk</li>;

// Same element built by hand
const byHand = jsx('li', { className: 'todo', children: 'Buy milk' }, 't1');

console.log(fromJsx.type);   // 'li'
console.log(fromJsx.key);    // 't1'
console.log(fromJsx.props);  // { className: 'todo', children: 'Buy milk' }

export default function App() {
  return <ul>{fromJsx}{byHand}</ul>;
}`, walk: [
      { lines: [1], note: "Normally the compiler adds this import. Here we use it by hand to see what JSX becomes." },
      { lines: [4, 7], note: "Two ways to build the same element: tag syntax vs the call the compiler would emit." },
      { lines: [9, 10, 11], note: "Elements are plain objects. `children` lives in props; `key` sits beside them, not inside." },
      { lines: [14], note: "Both render identically (React warns about the duplicate key `t1`; it's a demo)." }
    ]},
    output: "Console: `li`, `t1`, `{ className: 'todo', children: 'Buy milk' }`. Screen: “Buy milk” twice (plus a duplicate-key warning in dev).",
    mistakes: [
      { bad: `function Item(props) {\n  return <li>{props.key}</li>;\n}`, good: `function Item({ id }) {\n  return <li>{id}</li>;\n}\n// <Item key={t.id} id={t.id} />`, why: "`key` is consumed by React and never reaches your component. Pass the value again under another name." },
      { bad: `// tsconfig.json\n"jsx": "react"`, good: `// tsconfig.json\n"jsx": "react-jsx"`, why: "`react` is the classic runtime (needs `import React`). `react-jsx` is the automatic runtime." }
    ],
    practice: [
      { level: "B", q: "What does `<p>Hello</p>` compile to?", a: "`jsx('p', { children: 'Hello' })`" },
      { level: "I", q: "Compile `<p>Hi {user}!</p>`.", a: "Several children → `jsxs` with an array.", code: `jsxs('p', { children: ['Hi ', user, '!'] })` },
      { level: "I", q: "Compile `<Cart items={list} key=\"c1\" />`.", a: "`jsx(Cart, { items: list }, 'c1')`: type is the function, key is the 3rd argument." },
      { level: "C", q: "Why does `<button {...props} disabled>` put `disabled` after the spread?", a: "Props are merged in order: `{ ...props, disabled: true }`, so later attributes win." }
    ],
    quiz: [
      { q: "With the automatic runtime, where does `jsx` come from?", options: ["`react-dom`", "`react/jsx-runtime`, added by the compiler", "A global variable"], answer: 1, why: "The compiler injects the import for you." },
      { q: "In the compiled call, where does `key` go?", options: ["Inside props", "As a separate argument", "It's dropped"], answer: 1, why: "`jsx(type, props, key)`: React keeps key outside props." },
      { q: "`<Menu.Item />` compiles with type…", options: ["The string 'Menu.Item'", "The member expression `Menu.Item`", "A syntax error"], answer: 1, why: "Dotted names are JS member access, so the type is the component on `Menu`." }
    ],
    rev: {
      sec30: "Modern JSX uses the automatic runtime: the compiler imports `jsx`/`jsxs` from `react/jsx-runtime` and turns `<Tag a={1}>x</Tag>` into `jsx(Tag, { a: 1, children: 'x' }, key)`. Children live in props, key is separate, dev builds use `jsxDEV`. The classic runtime used `React.createElement`.",
      interview: [
        { level: "basic", q: "Why don't you need `import React` in JSX files anymore?", a: "Since React 17 the automatic runtime makes the compiler import `jsx` from `react/jsx-runtime` itself." },
        { level: "intermediate", q: "Difference between `jsx` and `jsxs`?", a: "`jsxs` is used when there are several static children (an array written in source); `jsx` for zero or one. It helps React skip some key checks." },
        { level: "intermediate", q: "Why can't a component read `props.key`?", a: "The compiler passes key as a separate argument and React uses it for reconciliation; it's not forwarded as a prop." },
        { level: "advanced", q: "What's in a React element object?", a: "`$$typeof` (a Symbol marking it as an element), `type`, `key`, `props`, plus dev-only debug info. It's immutable." },
        { level: "tricky", q: "Does JSX compilation render anything?", a: "No. It only produces objects. Rendering happens later when React DOM processes the element tree." }
      ],
      predict: [
        { code: `function Tag(props) {\n  console.log(props);\n  return null;\n}\n<Tag key="a" label="Tea" />`, answer: "`{ label: 'Tea' }`", why: "`key` is stripped from props by the runtime." }
      ],
      cheat: [
        "`<x a={1}>y</x>` → `jsx('x', { a: 1, children: 'y' })`",
        "Several static children → `jsxs`, children array",
        "`key` = 3rd argument, not a prop",
        "`<>` → `jsx(Fragment, ...)`",
        "Dev builds: `jsxDEV` from `react/jsx-dev-runtime`",
        "tsconfig `\"jsx\": \"react-jsx\"` = automatic runtime"
      ]
    },
    related: ["JSX-005", "JSX-002", "RENDER-006", "COND-012"]
  },

  "JSX-005": {
    tldr: "Browsers can't run JSX or TypeScript. Build tools (compilers) parse your code, transform it to plain JS, bundle files together and minify them. Babel, esbuild, SWC and Oxc are tools that do those jobs.",
    analogy: { icon: "🥡", text: "A takeaway kitchen: read the order (parse), cook it (transform), pack the bag (bundle), squeeze out the air (minify). Different chefs can work each station; Vite is the manager who assigns them." },
    visual: { type: "flow", title: "The build pipeline", steps: [
      { label: "Parse", detail: "Text → AST (a tree describing your code). Every tool does this first." },
      { label: "Transform", detail: "JSX → `jsx()` calls, strip TS types, newer JS → older JS. Vite 8 uses **Oxc**." },
      { label: "Bundle", detail: "Follow imports, join files, drop unused code (tree-shaking). Vite 8 uses **Rolldown**." },
      { label: "Minify", detail: "Remove whitespace, shorten names. Vite 8 uses **Oxc** by default." },
      { label: "dist/", detail: "Small, browser-ready files from `npm run build`." }
    ]},
    points: [
      "**Babel**: the classic JS-written transpiler (source-to-source compiler). Huge plugin ecosystem, slower.",
      "**esbuild** (Go) and **SWC** (Rust): fast native transpilers. SWC powers Next.js.",
      "**Oxc** (Rust): parser, transformer, minifier and linter (`oxlint`). Vite 8's default transform.",
      "Native tools are typically **many times faster** than Babel on large projects.",
      "You rarely configure them: `@vitejs/plugin-react` wires up JSX and Fast Refresh (hot reload that keeps state).",
      "Babel still appears for special transforms, e.g. the React Compiler's Babel plugin, or Jest setups."
    ],
    code: { file: "vite.config.js", lang: "js", src: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite 8 + React setup.
// Oxc transforms JSX/TS, Rolldown bundles, Oxc minifies.
export default defineConfig({
  plugins: [react()],
});

// Terminal:
// npm create vite@latest notes-app -- --template react
// cd notes-app && npm install
// npm run dev    -> transforms each file on request
// npm run build  -> bundles + minifies into dist/`, walk: [
      { lines: [2, 7], note: "One plugin adds the automatic JSX runtime and Fast Refresh. No Babel config needed." },
      { lines: [4, 5], note: "Who does what in Vite 8: Oxc for transform and minify, Rolldown for bundling." },
      { lines: [13], note: "Dev server: compiles files on demand as the browser asks for them." },
      { lines: [14], note: "Production build: the full pipeline, output in `dist/`." }
    ]},
    output: "`npm run build` prints the files written to `dist/` (an `index.html`, one or more hashed `.js` chunks and `.css`) with their sizes.",
    mistakes: [
      { bad: `<!-- index.html -->\n<script src="/src/App.jsx"></script>\n<!-- opened directly in the browser -->`, good: `npm run dev   # let Vite compile JSX\nnpm run build # then serve dist/`, why: "The raw browser throws `Unexpected token '<'`. JSX must be compiled first." },
      { bad: `npm i -D @babel/core @babel/preset-react\n# added to a Vite app \"to make JSX work\"`, good: `npm i -D @vitejs/plugin-react\n# plugins: [react()]`, why: "Vite already compiles JSX. Extra Babel only slows builds unless you need a specific Babel plugin." }
    ],
    practice: [
      { level: "B", q: "Put the steps in order: minify, parse, bundle, transform.", a: "Parse → transform → bundle → minify." },
      { level: "B", q: "Which tool does each job in Vite 8? (transform, bundle, minify)", a: "Oxc transforms, Rolldown bundles, Oxc minifies." },
      { level: "I", q: "What does a transpiler do to `const n: number = 1`?", a: "Strips the type: `const n = 1`. It doesn't type-check; run `tsc --noEmit` for that." },
      { level: "C", q: "Why might a team still keep Babel in 2026?", a: "For a Babel-only plugin (e.g. React Compiler via `babel-plugin-react-compiler`, or a custom code transform) or an older Jest setup." }
    ],
    quiz: [
      { q: "What is an AST?", options: ["A minified bundle", "A tree-shaped data structure of your code", "A type of CSS file"], answer: 1, why: "Tools parse source text into an Abstract Syntax Tree, change the tree, then print new code." },
      { q: "Why are esbuild, SWC and Oxc faster than Babel?", options: ["They skip parsing", "They're written in native languages (Go/Rust)", "They don't support JSX"], answer: 1, why: "Compiled native code with parallelism beats a JavaScript-written tool." },
      { q: "Does transpiling TypeScript check your types?", options: ["Yes, always", "No, it only removes them", "Only in dev mode"], answer: 1, why: "Transform tools strip types for speed. Type checking is `tsc`'s job (or your editor)." }
    ],
    rev: {
      sec30: "A build pipeline parses code into an AST, transforms it (JSX, TypeScript, syntax lowering), bundles imports and minifies. Babel is the original JS-based transpiler; esbuild (Go), SWC and Oxc (Rust) are much faster. Vite 8 uses Oxc for transforms/minify and Rolldown for bundling.",
      interview: [
        { level: "basic", q: "Why do React apps need a build step?", a: "Browsers can't run JSX or TypeScript, and shipping hundreds of unminified files is slow. The build compiles, bundles and minifies." },
        { level: "intermediate", q: "Transpiler vs bundler vs minifier?", a: "Transpiler converts source to other JS; bundler follows imports and joins files; minifier shrinks code without changing behaviour." },
        { level: "intermediate", q: "Where would you still meet Babel?", a: "Custom transforms, the React Compiler's Babel plugin, some Jest configs and older projects. New Vite apps don't need it." },
        { level: "advanced", q: "What changed in Vite 8's toolchain?", a: "Rolldown (Rust) replaced the esbuild + Rollup split for bundling, and Oxc handles transforms and minification, so dev and prod use one fast pipeline." },
        { level: "tricky", q: "Your build passes but has type errors. How?", a: "The transformer only strips types. Add `tsc --noEmit` (or `tsc -b`) to the build or CI to actually check them." }
      ],
      compare: { cols: ["", "Babel", "esbuild", "SWC", "Oxc"], rows: [
        ["Written in", "JavaScript", "Go", "Rust", "Rust"],
        ["Speed", "Slowest", "Fast", "Fast", "Fast"],
        ["Known for", "Plugins", "Vite 7 and earlier", "Next.js", "Vite 8, oxlint"]
      ]},
      cheat: [
        "Pipeline: parse → transform → bundle → minify",
        "AST = tree form of your code",
        "Babel = JS-written, plugin-rich, slow",
        "esbuild = Go; SWC, Oxc = Rust",
        "Vite 8: Oxc transform + minify, Rolldown bundle",
        "Transpiling TS doesn't type-check"
      ]
    },
    related: ["JSX-004", "ENV-003", "ENV-010", "ADV-021"]
  },

  "JSX-006": {
    tldr: "Curly braces `{ }` open a window from JSX into JavaScript. Put a variable, a sum or a function call inside, and React shows the result.",
    analogy: { icon: "🪟", text: "A shop receipt template with blanks: “Total: ___”. The braces are the blanks; JavaScript fills them in each time the receipt prints." },
    visual: { type: "flow", title: "How a brace gets filled", steps: [
      { label: "Data", detail: "`const item = { name: 'Latte', price: 3.5 }` and `qty = 2`." },
      { label: "Brace in JSX", detail: "`<p>{item.name} × {qty} = {formatPrice(item.price * qty)}</p>`" },
      { label: "JS runs", detail: "Each brace is evaluated: 'Latte', 2, '$7.00'." },
      { label: "Text on screen", detail: "“Latte × 2 = $7.00”. Change the data, the text follows on next render." }
    ]},
    points: [
      "Braces work in two places: as **children** `<p>{name}</p>` and as **attribute values** `src={url}`.",
      "Strings and numbers render as text. `true`, `false`, `null`, `undefined` render **nothing**.",
      "Arrays render each item; that's how `map()` lists work.",
      "Plain objects can't be rendered: pick a field (`{user.name}`).",
      "Text inside braces is **escaped**, so user input can't inject HTML.",
      "`src=\"{url}\"` is a literal string. Use quotes **or** braces, never both."
    ],
    code: { file: "Receipt.jsx", lang: "jsx", src: `const item = { name: 'Latte', price: 3.5, image: '/latte.png' };
const qty = 2;

function formatPrice(n) {
  return '$' + n.toFixed(2);
}

export default function Receipt() {
  const shop = 'Bean There';

  return (
    <div className="receipt">
      <h2>{shop.toUpperCase()}</h2>
      <img src={item.image} alt={item.name} width={80} />
      <p>
        {item.name} × {qty} = {formatPrice(item.price * qty)}
      </p>
      <p>Printed {new Date().toLocaleDateString()}</p>
    </div>
  );
}`, walk: [
      { lines: [13], note: "Call a method on a variable right inside the braces." },
      { lines: [14], note: "Braces as attribute values: a string from data, and a number `{80}`." },
      { lines: [16], note: "Several braces in one line; maths and your own function calls work." },
      { lines: [18], note: "Any expression that returns a value, including `new Date()` calls." }
    ]},
    output: "“BEAN THERE”, a latte image, “Latte × 2 = $7.00” and “Printed …” followed by today's date in your locale.",
    mistakes: [
      { bad: `<p>{user}</p>\n// Error: Objects are not valid as a React child`, good: `<p>{user.name}</p>`, why: "React can render strings, numbers, elements and arrays, but not a plain object. Pick the field you want." },
      { bad: `<img src="{item.image}" />`, good: `<img src={item.image} />`, why: "Quotes make it the literal text `{item.image}`. Braces evaluate the expression." }
    ],
    practice: [
      { level: "B", q: "Show “Hello, Sam” using a `name` variable.", a: "`<h1>Hello, {name}</h1>`" },
      { level: "B", q: "Show the total of `price * qty` with 2 decimals.", a: "`<p>{(price * qty).toFixed(2)}</p>`" },
      { level: "I", q: "Show a playlist's song count from an array.", a: "Use `.length`.", code: `<p>{songs.length} songs</p>` },
      { level: "C", q: "What renders: `<p>{[1, 2, 3]}</p>` and `<p>{true}</p>`?", a: "“123” (arrays render each item) and an empty `<p>` (booleans render nothing)." }
    ],
    quiz: [
      { q: "What does `<p>{null}</p>` show?", options: ["“null”", "Nothing", "An error"], answer: 1, why: "`null`, `undefined`, `true`, `false` render nothing." },
      { q: "`<img src=\"{url}\" />` sets src to…", options: ["The value of `url`", "The text `{url}`", "Nothing"], answer: 1, why: "Inside quotes, braces are just characters." },
      { q: "Is `<p>{userComment}</p>` safe if the comment contains `<script>`?", options: ["No, it runs the script", "Yes, React escapes text", "Only in production"], answer: 1, why: "JSX escapes values, so the tag shows as text." }
    ],
    rev: {
      sec30: "Curly braces switch from markup to JavaScript. Use them for children (`{name}`) and attribute values (`src={url}`). Strings/numbers show as text, arrays render each item, booleans/null/undefined render nothing, plain objects throw. Content is escaped, which protects against XSS.",
      interview: [
        { level: "basic", q: "What do curly braces do in JSX?", a: "They embed a JavaScript expression. Its value is rendered as a child or used as an attribute value." },
        { level: "intermediate", q: "Which values render nothing?", a: "`true`, `false`, `null` and `undefined`. `0` and `NaN` **do** render, which causes the `&&` zero bug." },
        { level: "intermediate", q: "Why does rendering an object throw?", a: "React doesn't know how to show an arbitrary object. Render a field, `JSON.stringify` it for debugging, or map it to elements." },
        { level: "tricky", q: "Is JSX interpolation vulnerable to XSS?", a: "No for text: React escapes it. Risks are `dangerouslySetInnerHTML` and user-controlled `href` like `javascript:`." }
      ],
      predict: [
        { code: `const cart = [];\nreturn <p>{cart.length && 'Items in cart'}</p>;`, answer: "Shows “0”", why: "`0 && ...` returns 0, and numbers render. Use `cart.length > 0 && ...`." }
      ],
      cheat: [
        "`{expr}` as child or attribute value",
        "string/number → text; array → each item",
        "`true/false/null/undefined` → nothing",
        "Object as child → error",
        "Quotes OR braces, never `\"{x}\"`",
        "Values are escaped (XSS-safe text)"
      ]
    },
    related: ["JSX-007", "JSX-008", "JSX-013", "SEC-001"]
  },

  "JSX-007": {
    tldr: "Braces accept **expressions** (code that produces a value), not **statements** (instructions like `if`, `for`, `const`). Use ternaries, `&&` and `map()` instead.",
    analogy: { icon: "🪙", text: "A vending-machine slot takes coins, not instructions. “2 + 2” is a coin (a value). “If hungry, give chips” is an instruction: it doesn't fit." },
    visual: { type: "compare", title: "What fits in `{ }`", left: { label: "Expressions ✔", tone: "good", points: [
      "`count + 1`, `user.name`",
      "`isOpen ? 'Open' : 'Closed'`",
      "`items.length > 0 && <Cart />`",
      "`todos.map(t => <li key={t.id}>{t.text}</li>)`",
      "`user?.name ?? 'Guest'`"
    ]}, right: { label: "Statements ✘", tone: "bad", points: [
      "`if (x) { ... } else { ... }`",
      "`for (const t of todos) { ... }`",
      "`const total = 5;`",
      "`switch (day) { ... }`"
    ]}},
    points: [
      "Test: could it go after `const x = ___`? Then it's an expression.",
      "Why: `{ }` becomes an **argument** in a function call, and arguments must be values.",
      "Decisions: ternary `a ? b : c`, `cond && <X />`, `value ?? 'fallback'`.",
      "Loops: `array.map()` (and `filter()` before it).",
      "Need `if`/`switch`? Run it **above** the `return` and store the result in a variable."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `const forecast = [
  { day: 'Mon', temp: 18, rain: true },
  { day: 'Tue', temp: 24, rain: false },
];

export default function Weather({ city }) {
  // Statements go ABOVE the return
  let tip;
  if (forecast.some(f => f.rain)) {
    tip = 'Take an umbrella ☔';
  } else {
    tip = 'Sunglasses day 😎';
  }

  return (
    <section>
      <h2>{city ?? 'Unknown city'}</h2>
      <p>{tip}</p>
      <ul>
        {forecast.map(f => (
          <li key={f.day}>
            {f.day}: {f.temp}°C {f.rain ? '🌧️' : '☀️'}
          </li>
        ))}
      </ul>
      {forecast.length === 0 && <p>No data yet.</p>}
    </section>
  );
}`, walk: [
      { lines: [8, 9, 10, 11, 12, 13], note: "`if/else` is a statement, so it runs before `return`; the result goes into `tip`." },
      { lines: [17], note: "`??` gives a fallback when `city` is null or undefined." },
      { lines: [20, 21, 22, 23, 24, 25], note: "`map()` is the expression version of a loop. The ternary picks an icon." },
      { lines: [26], note: "`&&` shows the paragraph only when the condition is true." }
    ]},
    output: "“Unknown city” (no prop passed), “Take an umbrella ☔”, then “Mon: 18°C 🌧️” and “Tue: 24°C ☀️”.",
    mistakes: [
      { bad: `<button>\n  {if (inStock) { 'Add' } else { 'Sold out' }}\n</button>`, good: `<button>\n  {inStock ? 'Add' : 'Sold out'}\n</button>`, why: "`if` is a statement: compile error “Unexpected token”. The ternary is an expression with the same meaning." },
      { bad: `<ul>{for (const t of todos) { <li>{t}</li> }}</ul>`, good: `<ul>{todos.map(t => <li key={t}>{t}</li>)}</ul>`, why: "`for` doesn't return anything. `map()` returns a new array of elements." }
    ],
    practice: [
      { level: "B", q: "Show “Open” or “Closed” from `isOpen`.", a: "`<p>{isOpen ? 'Open' : 'Closed'}</p>`" },
      { level: "B", q: "Is `user.age >= 18` an expression?", a: "Yes, it produces `true` or `false`." },
      { level: "I", q: "Pick a label from a `switch` on `status` (`'new'`, `'paid'`, `'sent'`).", a: "Do it above the return, or use a lookup object.", code: `const labels = { new: 'New', paid: 'Paid', sent: 'Shipped' };\nreturn <span>{labels[status] ?? 'Unknown'}</span>;` },
      { level: "C", q: "Can you use an IIFE `{(() => { if (x) return 'A'; return 'B'; })()}`?", a: "Yes, a function call is an expression. It works but is hard to read; prefer a variable or a small component." }
    ],
    quiz: [
      { q: "Which can go inside `{ }`?", options: ["`if (a) b`", "`const x = 1`", "`a ? b : c`", "`for (...)`"], answer: 2, why: "Only the ternary produces a value." },
      { q: "Why are statements not allowed?", options: ["React bans them for performance", "Braces become function arguments, which must be values", "They work only in class components"], answer: 1, why: "JSX compiles to calls; arguments must be expressions." },
      { q: "Where do you put a `switch`?", options: ["Inside JSX braces", "Above the `return`, storing the result", "Nowhere, React can't use switch"], answer: 1, why: "Normal JS runs fine in the component body." }
    ],
    rev: {
      sec30: "JSX braces take expressions only, because each brace becomes a function argument. Use ternary, `&&`, `??` and `map()` in JSX; put `if`, `switch` and loops above the return and keep the result in a variable, or extract a component.",
      interview: [
        { level: "basic", q: "Expression vs statement?", a: "An expression produces a value (`a + b`, `x ? y : z`); a statement performs an action (`if`, `for`, `const`)." },
        { level: "intermediate", q: "Why can't you write `if` inside JSX?", a: "JSX compiles to `jsx(type, props)`; braces become argument values, and JavaScript arguments must be expressions." },
        { level: "intermediate", q: "How do you render complex branching cleanly?", a: "Compute it before `return`, use an early return, a lookup object, or split into small components." },
        { level: "tricky", q: "Is a `do` expression or IIFE inside JSX a good idea?", a: "An IIFE works but hurts readability; `do` expressions aren't standard JS. Prefer variables or components." }
      ],
      debug: [
        { code: `{todos.map(t => {\n  <li key={t.id}>{t.text}</li>\n})}`, fix: `{todos.map(t => (\n  <li key={t.id}>{t.text}</li>\n))}`, why: "With `{ }` the arrow body needs `return`. Without it, map returns `undefined` and nothing shows." }
      ],
      cheat: [
        "Braces = expressions only",
        "Test: fits after `const x =`?",
        "Decisions: `?:`, `&&`, `??`",
        "Loops: `map()` (+ `filter()`)",
        "`if`/`switch`/`for` go above `return`",
        "Arrow with `{}` needs `return`"
      ]
    },
    related: ["JSX-006", "JSX-013", "JSX-014", "COND-002"]
  },

  "JSX-008": {
    tldr: "Attributes configure an element. Use quotes for fixed text, braces for any JS value, and `{...obj}` to spread many attributes at once.",
    analogy: { icon: "🍕", text: "A pizza order form: some fields are fixed words (“Large”), some are worked out (a price), and sometimes you hand over a whole pre-filled form at once (spread)." },
    visual: { type: "flow", title: "Attributes become one props object", steps: [
      { label: "String", detail: "`type=\"search\"` → `type: 'search'`" },
      { label: "Expression", detail: "`maxLength={30}` → `maxLength: 30` (a number, not '30')" },
      { label: "Boolean shorthand", detail: "`disabled` alone → `disabled: true`" },
      { label: "Spread", detail: "`{...extra}` copies every key of `extra`" },
      { label: "Merged in order", detail: "Later attributes win: `{...a} id=\"x\"` overrides `a.id`." }
    ]},
    points: [
      "**String literal**: `title=\"Hello\"`. Fixed text only.",
      "**Expression**: `price={249}`, `onClick={buy}`, `items={['a','b']}`: any JS value.",
      "A bare attribute means `true`: `<input disabled />`.",
      "**Spread** `{...props}` passes many props at once; order decides who wins.",
      "Mixed text from data: put a **template literal** inside braces (see the `alt` in the code below)."
    ],
    code: { file: "SearchBox.jsx", lang: "jsx", src: `function SearchBox({ placeholder, ...rest }) {
  return (
    <input
      type="search"
      placeholder={placeholder}
      maxLength={30}
      autoComplete="off"
      {...rest}
    />
  );
}

export default function App() {
  const recipe = { id: 7, title: 'Pancakes', photo: '/pancakes.jpg' };
  const extra = { autoFocus: true, 'aria-label': 'Search recipes' };

  return (
    <div>
      <SearchBox placeholder="Search recipes" {...extra} />
      <img
        src={recipe.photo}
        alt={\`Photo of \${recipe.title}\`}
        width={160}
      />
      <button disabled>Saved</button>
    </div>
  );
}`, walk: [
      { lines: [1], note: "Rest syntax collects every other prop into `rest`." },
      { lines: [4, 5, 6, 7], note: "Strings in quotes, values from JS in braces. `maxLength={30}` is a real number." },
      { lines: [8], note: "Spread last, so the caller's props can override the defaults above." },
      { lines: [19], note: "Spread an object of attributes; keys with dashes are quoted in the object." },
      { lines: [22], note: "A template literal builds mixed text from data." },
      { lines: [25], note: "Bare `disabled` is shorthand for `disabled={true}`." }
    ]},
    output: "A focused search box (“Search recipes”, max 30 chars), a pancake photo with alt “Photo of Pancakes”, and a greyed-out Saved button.",
    mistakes: [
      { bad: `<input maxLength="30" disabled="false" />`, good: `<input maxLength={30} disabled={false} />`, why: "Quotes make strings. \"false\" is a non-empty string, so React treats it as truthy and the input is disabled." },
      { bad: `<input {...rest} placeholder="Default" />\n// caller's placeholder is ignored`, good: `<input placeholder="Default" {...rest} />`, why: "Later attributes win. Put defaults first and the spread after so callers can override them." }
    ],
    practice: [
      { level: "B", q: "Give an `<a>` a fixed `href` and open it in a new tab.", a: "`<a href=\"/menu\" target=\"_blank\" rel=\"noreferrer\">Menu</a>`" },
      { level: "B", q: "Disable a button when `cart.length === 0`.", a: "`<button disabled={cart.length === 0}>Checkout</button>`" },
      { level: "I", q: "Pass every field of `song` as props to `<SongRow />`.", a: "`<SongRow {...song} />`; inside, destructure `{ title, artist }`." },
      { level: "C", q: "What is `<input {...a} {...b} />` when both have `value`?", a: "`b.value` wins: props are merged left to right." }
    ],
    quiz: [
      { q: "`<input maxLength=\"10\" />` passes maxLength as…", options: ["The number 10", "The string '10'", "Nothing"], answer: 1, why: "Quoted values are always strings. Use `{10}` for a number." },
      { q: "`<Cart {...p} open={false} />` where `p.open` is true. Final `open`?", options: ["true", "false", "error"], answer: 1, why: "The later attribute overrides the spread." },
      { q: "`<input required />` means…", options: ["`required={true}`", "`required=\"\"`, ignored", "A syntax error"], answer: 0, why: "A bare attribute is boolean shorthand for true." }
    ],
    rev: {
      sec30: "JSX attributes become one props object. Quotes give strings, braces give any JS value (numbers, booleans, functions, objects), a bare name means `true`, and `{...obj}` spreads many keys. Merge is left to right, so later attributes override earlier ones.",
      interview: [
        { level: "basic", q: "Quotes vs braces for attributes?", a: "Quotes pass a fixed string; braces pass the result of any JS expression, keeping its type." },
        { level: "intermediate", q: "What does spreading props do, and what's the risk?", a: "It copies every key as a prop. Risk: forwarding unknown props to DOM elements (warnings) or accidentally overriding values." },
        { level: "intermediate", q: "How do you let callers override defaults?", a: "Put defaults first and `{...rest}` after; to force a value, put it after the spread." },
        { level: "tricky", q: "Why is `disabled=\"false\"` still disabled?", a: "It's the non-empty string \"false\", which is truthy. Use `disabled={false}`." }
      ],
      predict: [
        { code: `const base = { id: 'a', title: 'Tea' };\n<p {...base} id="b" />`, answer: "`id` is \"b\", title \"Tea\"", why: "The later `id` attribute overrides the spread value." }
      ],
      cheat: [
        "`a=\"text\"` → string; `a={expr}` → any value",
        "Bare `disabled` → `true`",
        "`{...obj}` spreads every key",
        "Later attribute wins",
        "Numbers: `maxLength={30}`, not `\"30\"`",
        "Mixed text: template literal in braces"
      ]
    },
    related: ["JSX-006", "PROPS-002", "PROPS-005", "WEB-024"]
  },

  "JSX-009": {
    tldr: "`className` sets CSS classes in JSX. Because it takes a JavaScript string, you can build it from state: add `done` when a todo is finished, `active` on the selected tab.",
    analogy: { icon: "🏷️", text: "Name badges at a café: “staff”, “manager”, “on-break”. One person can wear several, and badges change with their status. CSS classes are badges for elements." },
    visual: { type: "timeline", title: "Class string follows state", frames: [
      { label: "render 1", state: "done = false → \"todo\"", note: "Plain todo item." },
      { label: "click ✓", state: "setDone(true)", note: "State changes; React re-renders." },
      { label: "render 2", state: "done = true → \"todo done\"", note: "CSS `.todo.done` adds a line-through." },
      { label: "click ✓", state: "done = false → \"todo\"", note: "Class removed automatically. No `classList` juggling." }
    ]},
    points: [
      "Write `className=\"card\"`; several classes are **space-separated**: `\"card featured\"`.",
      "Static: quotes. Dynamic: braces with a ternary or template literal.",
      "The class string is **recalculated every render**, so it can't drift out of sync with state.",
      "Use a `filter(Boolean).join(' ')` pattern (or the tiny `clsx` library) for many optional classes.",
      "Import the stylesheet once (`import './App.css'`); Vite bundles it."
    ],
    code: { file: "TodoItem.jsx", lang: "jsx", src: `import { useState } from 'react';
import './TodoItem.css';
// .todo { padding: 8px; }
// .todo.done { text-decoration: line-through; opacity: .6; }
// .urgent { border-left: 4px solid crimson; }

export default function TodoItem({ text, urgent }) {
  const [done, setDone] = useState(false);

  const classes = ['todo', done && 'done', urgent && 'urgent']
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classes}>
      <button
        className={\`check \${done ? 'check--on' : ''}\`}
        onClick={() => setDone(!done)}
      >
        ✓
      </button>
      {text}
    </li>
  );
}`, walk: [
      { lines: [2, 3, 4, 5], note: "Normal CSS file, imported once. Class names in JSX must match it." },
      { lines: [10, 11, 12], note: "Build a list, drop `false` values, join with spaces → \"todo done urgent\"." },
      { lines: [15], note: "Braces because the value comes from JavaScript." },
      { lines: [17], note: "Template literal for one optional class." },
      { lines: [18], note: "Flip state; next render recomputes both class strings." }
    ]},
    output: "A todo row with a ✓ button. Clicking it adds a line-through (class `todo done`); clicking again removes it. Urgent todos get a red left border.",
    mistakes: [
      { bad: `<li class="todo">`, good: `<li className="todo">`, why: "`class` is a JS reserved word. React warns in dev; `className` is the correct prop." },
      { bad: `<li className={done && 'done'}>`, good: `<li className={done ? 'done' : undefined}>`, why: "When `done` is false React receives `false`, warns in dev and drops the attribute. A ternary or filter/join states the intent clearly." },
      { bad: `className="todo {done ? 'done' : ''}"`, good: `className={\`todo \${done ? 'done' : ''}\`}`, why: "Inside quotes the braces are plain text. Use braces with a template literal." }
    ],
    practice: [
      { level: "B", q: "Give a `<div>` both `card` and `featured` classes.", a: "`<div className=\"card featured\">`" },
      { level: "B", q: "Add `active` to a tab when `selected` is true.", a: "`className={selected ? 'tab active' : 'tab'}`" },
      { level: "I", q: "Mark a product card `sold-out` when `stock === 0`.", a: "Template literal.", code: `<div className={\`product \${stock === 0 ? 'sold-out' : ''}\`}>` },
      { level: "C", q: "Write a tiny `cx(...args)` helper.", a: "Filter falsy values and join.", code: `const cx = (...c) => c.filter(Boolean).join(' ');\n<li className={cx('todo', done && 'done')} />` }
    ],
    quiz: [
      { q: "How do you set two classes?", options: ["`className={['a','b']}`", "`className=\"a b\"`", "`class=\"a\" class=\"b\"`"], answer: 1, why: "`className` takes one space-separated string." },
      { q: "A template literal `card ${isNew && 'new'}` with `isNew` false gives…", options: ["class=\"card\"", "class=\"card false\"", "An error"], answer: 1, why: "Inside a template literal, `false` becomes the text \"false\". Use a ternary there." },
      { q: "Why don't you need `classList.toggle` in React?", options: ["React bans the DOM", "The class string is derived from state each render", "CSS handles it"], answer: 1, why: "UI is a function of state, so the class is always correct." }
    ],
    rev: {
      sec30: "`className` is JSX's name for the `class` attribute. Use a static string or build one from state with a ternary, template literal, or `filter(Boolean).join(' ')` / `clsx`. It's recomputed every render, so classes never drift out of sync like manual `classList` code.",
      interview: [
        { level: "basic", q: "Why `className`, not `class`?", a: "JSX is JavaScript and `class` is a reserved word. `className` matches the DOM property." },
        { level: "intermediate", q: "How do you apply conditional classes?", a: "Ternary or template literal for one or two; for many, an array with `filter(Boolean).join(' ')` or `clsx`." },
        { level: "intermediate", q: "className vs inline style: which is preferred?", a: "Classes: reusable, cacheable, support hover/media queries. Inline style for values computed at runtime like a progress width." },
        { level: "tricky", q: "Can `className` take an array?", a: "No. An array is converted to a comma-joined string (\"a,b\"), which is wrong. Join with spaces yourself." }
      ],
      predict: [
        { code: `const active = false;\n<p className={\`tab \${active && 'on'}\`} />`, answer: "class=\"tab false\"", why: "`false` inside a template literal becomes the text \"false\"." }
      ],
      cheat: [
        "`className=\"a b\"`: space-separated",
        "Dynamic: `className={cond ? 'a' : 'b'}`",
        "Many: `[...].filter(Boolean).join(' ')` or `clsx`",
        "`cond && 'x'` can leak \"false\"",
        "Recomputed every render from state",
        "Import CSS once: `import './App.css'`"
      ]
    },
    related: ["JSX-003", "JSX-011", "STYLE-002", "STYLE-011"]
  },

  "JSX-010": {
    tldr: "`htmlFor` on a `<label>` links it to the input with the matching `id`. Clicking the label focuses the field, and screen readers announce the field's name.",
    analogy: { icon: "📦", text: "A name tag on a parcel at the pickup counter: “Order #42” points to exactly one bag. A label's `htmlFor` points to exactly one field by its id." },
    visual: { type: "flow", title: "Label association", steps: [
      { label: "Label", detail: "`<label htmlFor=\"email\">Email</label>`" },
      { label: "Matching id", detail: "`<input id=\"email\" />`: same text, case-sensitive." },
      { label: "Click the word", detail: "Tapping “Email” focuses the input; a checkbox label toggles the box." },
      { label: "Screen reader", detail: "Announces “Email, edit text” instead of just “edit text”." }
    ]},
    points: [
      "`for` is a JS keyword, so JSX uses `htmlFor`; the page gets a normal `for` attribute.",
      "The value must **exactly match** one element's `id`.",
      "Ids must be **unique** on the page. Reusing a component twice with a hard-coded id breaks it.",
      "Use `useId()` to generate unique ids in reusable components.",
      "Alternative: wrap the input inside the label (`<label>Email <input /></label>`); no ids needed."
    ],
    code: { file: "Field.jsx", lang: "jsx", src: `import { useId } from 'react';

function Field({ label, type = 'text' }) {
  const id = useId(); // unique per Field instance
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

export default function Login() {
  return (
    <form>
      <Field label="Email" type="email" />
      <Field label="Password" type="password" />
      <label>
        <input type="checkbox" /> Remember me
      </label>
    </form>
  );
}`, walk: [
      { lines: [4], note: "`useId()` gives each Field its own id, so two Fields never clash." },
      { lines: [7, 8], note: "`htmlFor` and `id` share the same value: that's the link." },
      { lines: [16, 17], note: "The same component used twice, still unique ids." },
      { lines: [18, 19, 20], note: "Wrapping pattern: the label contains the checkbox, so no id is needed." }
    ]},
    output: "Email and Password fields with labels, plus a “Remember me” checkbox. Clicking a label text focuses or toggles its field.",
    mistakes: [
      { bad: `<label for="email">Email</label>`, good: `<label htmlFor="email">Email</label>`, why: "`for` is reserved in JS. React warns and suggests `htmlFor`." },
      { bad: `function Field() {\n  return <><label htmlFor="name">Name</label><input id="name" /></>;\n}\n// used twice on one page`, good: `const id = useId();\n<label htmlFor={id}>Name</label><input id={id} />`, why: "Duplicate ids: the second label points at the first input. `useId` makes each instance unique." }
    ],
    practice: [
      { level: "B", q: "Link a “Quantity” label to a number input.", a: "Matching values.", code: `<label htmlFor="qty">Quantity</label>\n<input id="qty" type="number" />` },
      { level: "B", q: "Make a “Subscribe” checkbox toggle when its text is clicked, without ids.", a: "`<label><input type=\"checkbox\" /> Subscribe</label>`" },
      { level: "I", q: "A `<select>` for pizza size: label it.", a: "`<label htmlFor=\"size\">Size</label><select id=\"size\">...</select>`" },
      { level: "C", q: "Why not use `Math.random()` for ids?", a: "It changes every render and differs between server and client (hydration mismatch). `useId` is stable." }
    ],
    quiz: [
      { q: "What must `htmlFor` match?", options: ["The input's `name`", "The input's `id`", "The input's `type`"], answer: 1, why: "Labels point at ids, not names." },
      { q: "Best way to get unique ids in a reusable component?", options: ["`Math.random()`", "A hard-coded string", "`useId()`"], answer: 2, why: "Stable across renders and consistent with server rendering." },
      { q: "Does a label wrapping its input need `htmlFor`?", options: ["Yes, always", "No, nesting creates the link"], answer: 1, why: "Implicit association works when the input is inside the label." }
    ],
    rev: {
      sec30: "`htmlFor` is JSX's `for`. It links a label to the element whose `id` matches, giving a bigger click target and an accessible name for screen readers. Ids must be unique, so reusable components use `useId()`. Wrapping the input in the label also works.",
      interview: [
        { level: "basic", q: "Why `htmlFor`?", a: "`for` is a JavaScript keyword; `htmlFor` is the DOM property name." },
        { level: "intermediate", q: "Why do labels matter for accessibility?", a: "They give the input an accessible name, so screen readers announce it, and they enlarge the click area." },
        { level: "intermediate", q: "How do you avoid duplicate ids in reusable form fields?", a: "Generate them with `useId()`, which is unique per instance and stable across server and client." },
        { level: "advanced", q: "How does labelling help testing?", a: "React Testing Library's `getByLabelText('Email')` finds fields the way users do; it fails if the label isn't linked." }
      ],
      cheat: [
        "`<label htmlFor=\"x\">` + `<input id=\"x\" />`",
        "Match is exact and case-sensitive",
        "Ids unique per page",
        "Reusable components: `useId()`",
        "Or wrap: `<label>Text <input /></label>`",
        "Test with `getByLabelText`"
      ]
    },
    related: ["JSX-003", "HOOKS-013", "EVT-012", "PROD-016"]
  },

  "JSX-011": {
    tldr: "The `style` attribute takes a JavaScript **object**, not a string. Property names are camelCase (`backgroundColor`), and plain numbers mean pixels.",
    analogy: { icon: "🎨", text: "A paint order form with labelled boxes (colour: red, size: 18) instead of one scribbled sentence. React reads the boxes; it can't read the scribble." },
    visual: { type: "compare", title: "HTML style vs JSX style", left: { label: "HTML", tone: "bad", points: [
      "`style=\"background-color: gold\"`",
      "One string of CSS",
      "kebab-case names",
      "`font-size: 18px`"
    ]}, right: { label: "JSX", tone: "good", points: [
      "`style={{ backgroundColor: 'gold' }}`",
      "An object: outer braces = JS, inner = object",
      "camelCase names",
      "`fontSize: 18` (px added for you)"
    ]}},
    points: [
      "`style={{ ... }}`: the outer braces enter JS, the inner braces are the object.",
      "camelCase keys: `backgroundColor`, `marginTop`, `zIndex`. Vendor prefixes: `WebkitTransition`.",
      "Numbers become `px` for length properties; unitless ones (`opacity`, `zIndex`, `lineHeight`) stay as numbers.",
      "Other units need a string: `width: '50%'`, `padding: '1rem'`.",
      "Use it for runtime values (a progress width). Classes for the rest: inline has no `:hover` or media queries.",
      "CSS variables work: `style={{ '--accent': color }}`."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `const songs = [
  { id: 1, title: 'Sunrise', played: 75, color: '#f59e0b' },
  { id: 2, title: 'Night Drive', played: 30, color: '#6366f1' },
];

const rowStyle = { display: 'flex', gap: 8, marginBottom: 12 };

export default function Playlist() {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {songs.map(s => (
        <li key={s.id} style={rowStyle}>
          <span style={{ width: 120, fontWeight: 'bold' }}>{s.title}</span>
          <div style={{ flex: 1, background: '#eee', borderRadius: 4 }}>
            <div
              style={{
                width: s.played + '%',
                height: 8,
                backgroundColor: s.color,
                borderRadius: 4,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}`, walk: [
      { lines: [6], note: "A style object stored once and reused. `gap: 8` means 8px." },
      { lines: [10], note: "Inline object: double braces. Strings for keyword values like `'none'`." },
      { lines: [16, 17, 18, 19, 20, 21], note: "The width comes from data: the one thing a class can't easily do. `'%'` needs a string." }
    ]},
    output: "Two songs, each with a progress bar: “Sunrise” bar 75% full in amber, “Night Drive” 30% full in indigo.",
    mistakes: [
      { bad: `<p style="color: red; font-size: 18px">Sale</p>`, good: `<p style={{ color: 'red', fontSize: 18 }}>Sale</p>`, why: "A string `style` throws an error in React. It must be an object with camelCase keys." },
      { bad: `<div style={{ width: '50' }} />`, good: `<div style={{ width: 50 }} />  // or '50px'`, why: "A string with no unit is invalid CSS and ignored. Use a number (px) or include the unit." }
    ],
    practice: [
      { level: "B", q: "Make a heading blue and 24px.", a: "`<h1 style={{ color: 'blue', fontSize: 24 }}>Menu</h1>`" },
      { level: "B", q: "Convert `style=\"margin-top: 4px; z-index: 10\"`.", a: "`style={{ marginTop: 4, zIndex: 10 }}`" },
      { level: "I", q: "Fade out a sold-out product to 50% opacity.", a: "Conditional value in the object.", code: `<div style={{ opacity: stock === 0 ? 0.5 : 1 }}>...</div>` },
      { level: "C", q: "Set a CSS variable `--accent` from a prop and use it in CSS.", a: "Custom property keys are quoted.", code: `<div className="card" style={{ '--accent': color }} />\n/* .card { border-color: var(--accent); } */` }
    ],
    quiz: [
      { q: "Valid JSX style?", options: ["`style=\"color: red\"`", "`style={{ color: 'red' }}`", "`style={color: 'red'}`"], answer: 1, why: "Outer braces for JS, inner braces for the object." },
      { q: "`fontSize: 16` renders as…", options: ["16", "16px", "16em"], answer: 1, why: "React adds px to unitless numbers for length properties." },
      { q: "Can you write `:hover` in an inline style?", options: ["Yes, `style={{ ':hover': {...} }}`", "No, use a CSS class"], answer: 1, why: "Inline styles have no pseudo-classes or media queries." }
    ],
    rev: {
      sec30: "In JSX, `style` is an object: `style={{ backgroundColor: 'gold', fontSize: 18 }}`. Keys are camelCase, numbers mean px (except unitless properties), other units are strings. Use it for runtime values; prefer classes for reusable styling, hover states and media queries.",
      interview: [
        { level: "basic", q: "Why the double braces in `style={{ }}`?", a: "The outer pair switches to JavaScript; the inner pair is an object literal." },
        { level: "intermediate", q: "When should you use inline styles?", a: "For values computed at runtime: positions, widths, user-picked colours. Everything else belongs in classes." },
        { level: "intermediate", q: "Limits of inline styles?", a: "No pseudo-classes, pseudo-elements or media queries, harder to override, and they mix styling into markup." },
        { level: "advanced", q: "Does a new style object each render hurt performance?", a: "Rarely noticeable for DOM elements. It matters only when passed to memoized children, where a new object breaks equality." }
      ],
      debug: [
        { code: `<div style={{ background-color: 'gold' }} />`, fix: `<div style={{ backgroundColor: 'gold' }} />`, why: "`background-color` isn't a valid object key without quotes; React expects camelCase." }
      ],
      cheat: [
        "`style={{ key: value }}`",
        "camelCase keys: `backgroundColor`",
        "Number → px (not for `opacity`, `zIndex`)",
        "Other units: `'50%'`, `'2rem'`",
        "No `:hover` / media queries inline",
        "CSS vars: `{ '--accent': c }`"
      ]
    },
    related: ["JSX-009", "STYLE-004", "STYLE-010"]
  },

  "JSX-012": {
    tldr: "A component returns one thing. A Fragment `<>...</>` groups several elements without adding an extra `<div>` to the page.",
    analogy: { icon: "🛍️", text: "A clear shopping bag you can see straight through: it lets you carry three items as one, but when you put them on the shelf, only the items show." },
    visual: { type: "compare", title: "Wrapper div vs Fragment", left: { label: "<div> wrapper", tone: "bad", points: [
      "Adds a real `<div>` to the DOM",
      "Breaks `<table>`: `<tr><div><td>` is invalid",
      "Can break flex/grid layouts",
      "Extra nesting in DevTools"
    ]}, right: { label: "<> Fragment", tone: "good", points: [
      "Groups children, adds nothing to the DOM",
      "`<tr><><td/><td/></></tr>` stays valid",
      "Children sit directly in the flex/grid parent",
      "Long form `<Fragment key={id}>` in lists"
    ]}},
    points: [
      "Why one root: JSX compiles to a function call, and a function returns **one** value.",
      "Short syntax `<>...</>` covers most cases.",
      "Need a `key` (in a list)? Use `<Fragment key={id}>` imported from `react`.",
      "The short syntax can't take any attributes, including `key`.",
      "Fragments are ideal for table cells, list items and flex/grid children."
    ],
    code: { file: "OrderTable.jsx", lang: "jsx", src: `import { Fragment } from 'react';

const orders = [
  { id: 1, item: 'Coffee', qty: 2, note: 'Oat milk' },
  { id: 2, item: 'Bagel', qty: 1, note: '' },
];

function Cells({ order }) {
  return (
    <>
      <td>{order.item}</td>
      <td>{order.qty}</td>
    </>
  );
}

export default function OrderTable() {
  return (
    <table>
      <tbody>
        {orders.map(o => (
          <Fragment key={o.id}>
            <tr><Cells order={o} /></tr>
            {o.note && <tr><td colSpan={2}>Note: {o.note}</td></tr>}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}`, walk: [
      { lines: [10, 11, 12, 13], note: "Return two `<td>`s with no wrapper. A `<div>` here would be invalid inside `<tr>`." },
      { lines: [22], note: "In a list the group needs a key, so use the long `<Fragment key>` form." },
      { lines: [23, 24], note: "Each order outputs one or two rows, directly inside `<tbody>`." }
    ]},
    output: "A table: “Coffee | 2”, then “Note: Oat milk”, then “Bagel | 1”. DevTools shows no extra wrapper elements.",
    mistakes: [
      { bad: `return (\n  <h1>Menu</h1>\n  <ul>...</ul>\n);`, good: `return (\n  <>\n    <h1>Menu</h1>\n    <ul>...</ul>\n  </>\n);`, why: "“Adjacent JSX elements must be wrapped in an enclosing tag.” Wrap siblings in a Fragment." },
      { bad: `{items.map(i => (\n  <key={i.id}>...</>\n))}`, good: `{items.map(i => (\n  <Fragment key={i.id}>...</Fragment>\n))}`, why: "The short syntax can't hold attributes. Use `Fragment` when you need a key." }
    ],
    practice: [
      { level: "B", q: "Return a `<h2>` and a `<p>` from a component with no wrapper.", a: "`return <><h2>Notes</h2><p>3 notes</p></>;`" },
      { level: "I", q: "Render a glossary: each term gives a `<dt>` and a `<dd>` inside `<dl>`.", a: "Keyed Fragment.", code: `<dl>\n  {terms.map(t => (\n    <Fragment key={t.id}>\n      <dt>{t.word}</dt>\n      <dd>{t.meaning}</dd>\n    </Fragment>\n  ))}\n</dl>` },
      { level: "I", q: "Why might a wrapper `<div>` break a flex row of cards?", a: "The div becomes the only flex child, so the cards stop being laid out as flex items." },
      { level: "C", q: "What does `<>A</>` compile to?", a: "`jsx(Fragment, { children: 'A' })` with `Fragment` imported from `react/jsx-runtime`." }
    ],
    quiz: [
      { q: "What does a Fragment add to the DOM?", options: ["A `<div>`", "A `<fragment>` tag", "Nothing"], answer: 2, why: "Fragments group children without a DOM node." },
      { q: "How do you give a Fragment a key?", options: ["`<key={id}>`", "`<Fragment key={id}>`", "You can't"], answer: 1, why: "Only the long form accepts attributes." },
      { q: "Why must a component have one root?", options: ["CSS needs it", "A function can return only one value", "Browsers require it"], answer: 1, why: "JSX compiles to a call; the component returns that one element." }
    ],
    rev: {
      sec30: "Components return one element because JSX compiles to one function call. Fragments (`<>...</>`) group siblings without adding DOM nodes, keeping tables, lists and flex/grid layouts valid. Use `<Fragment key={id}>` when the group is in a list.",
      interview: [
        { level: "basic", q: "What is a Fragment?", a: "A wrapper that groups children without creating a DOM element: `<>...</>` or `<Fragment>`." },
        { level: "intermediate", q: "When is a Fragment better than a div?", a: "When an extra node is invalid or harmful: table rows/cells, `<dl>` pairs, flex/grid children, or simply to avoid div soup." },
        { level: "intermediate", q: "Short vs long syntax?", a: "Same result. Only `<Fragment>` accepts a `key`; the short form takes no attributes." },
        { level: "tricky", q: "Can a component return an array instead of a Fragment?", a: "Yes, `return [<li key=\"a\" />, <li key=\"b\" />]` works, but every item needs a key. A Fragment is cleaner." }
      ],
      cheat: [
        "`<>...</>` groups without a DOM node",
        "Fixes “Adjacent JSX elements must be wrapped”",
        "Keyed: `<Fragment key={id}>`",
        "Short form: no attributes",
        "Great in tables, `<dl>`, flex/grid",
        "`import { Fragment } from 'react'`"
      ]
    },
    related: ["JSX-015", "ADV-006", "COND-011"]
  },

  "JSX-013": {
    tldr: "Inside JSX, decide what to show with expressions: a ternary `a ? b : c` picks one of two things, `cond && <X />` shows something or nothing.",
    analogy: { icon: "🚦", text: "A shop door sign. Ternary: it always shows something, “Open” or “Closed”. `&&`: a “Sale!” sticker that's either on the door or not there at all." },
    visual: { type: "flow", title: "How `&&` and `?:` decide", steps: [
      { label: "Check the condition", detail: "`cart.length > 0`, `isLoggedIn`, `weather.rain`…" },
      { label: "Ternary `? :`", detail: "true → first value, false → second. Always renders one of them." },
      { label: "AND `&&`", detail: "true → the right side. false → the left value itself (renders nothing if boolean)." },
      { label: "The 0 trap", detail: "`0 && <X />` returns **0**, and React prints “0”. Compare: `count > 0 && ...`" }
    ]},
    points: [
      "Two outcomes → **ternary**: `{isOpen ? 'Open' : 'Closed'}`.",
      "Show or hide → **`&&`**: `{hasSale && <Banner />}`.",
      "Left side of `&&` must be a real boolean. `0` and `NaN` render as text.",
      "Fallback for missing values → `??`: `{user.nickname ?? user.name}`.",
      "Bigger branches: compute above `return`, or use an early `return`. Nested ternaries get unreadable fast."
    ],
    code: { file: "CartSummary.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function CartSummary() {
  const [items, setItems] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const total = items.length * 4;

  return (
    <div>
      <h2>{items.length > 0 ? \`\${items.length} items\` : 'Cart is empty'}</h2>

      {items.length > 0 && <p>Total: \${total}</p>}

      {isMember ? (
        <p>⭐ Member price applied</p>
      ) : (
        <button onClick={() => setIsMember(true)}>Join for discount</button>
      )}

      <button onClick={() => setItems([...items, 'Muffin'])}>
        Add muffin
      </button>
    </div>
  );
}`, walk: [
      { lines: [10], note: "Ternary: always shows one of two texts." },
      { lines: [12], note: "`&&` with a real boolean (`> 0`), so an empty cart shows nothing, not “0”." },
      { lines: [14, 15, 16, 17, 18], note: "Ternary that switches between two elements. Wrap multi-line branches in `( )`." },
      { lines: [20], note: "Adding an item re-renders and every condition is re-checked." }
    ]},
    output: "“Cart is empty” and a “Join for discount” button. After one Add muffin: “1 items” and “Total: $4”. After Join: “⭐ Member price applied”.",
    mistakes: [
      { bad: `{items.length && <p>Total: {total}</p>}`, good: `{items.length > 0 && <p>Total: {total}</p>}`, why: "With an empty cart, `0 && ...` evaluates to 0 and React renders the digit “0”." },
      { bad: `{a ? <A /> : b ? <B /> : c ? <C /> : <D />}`, good: `let panel = <D />;\nif (a) panel = <A />;\nelse if (b) panel = <B />;\nelse if (c) panel = <C />;\n// then: {panel}`, why: "Nested ternaries are hard to read. Move multi-branch logic above the return." }
    ],
    practice: [
      { level: "B", q: "Show “Logged in” or a Login button from `user`.", a: "`{user ? <p>Logged in</p> : <button>Login</button>}`" },
      { level: "B", q: "Show a “🌧️ Bring an umbrella” note only when `rain` is true.", a: "`{rain && <p>🌧️ Bring an umbrella</p>}`" },
      { level: "I", q: "Show the unread count badge only when `unread` (a number) is above 0.", a: "Compare first.", code: `{unread > 0 && <span className="badge">{unread}</span>}` },
      { level: "C", q: "Fix `{notes.length && <NoteList notes={notes} />}` two ways.", a: "`notes.length > 0 && ...` or `!!notes.length && ...` (or a ternary returning `null`)." }
    ],
    quiz: [
      { q: "`{0 && <p>Hi</p>}` renders…", options: ["Nothing", "“0”", "“Hi”"], answer: 1, why: "`&&` returns the falsy left value, and numbers render." },
      { q: "Which always renders one of two things?", options: ["`&&`", "Ternary `? :`", "`||`"], answer: 1, why: "The ternary has both a true and a false branch." },
      { q: "`{false && <Banner />}` renders…", options: ["“false”", "Nothing", "An error"], answer: 1, why: "Booleans render nothing." }
    ],
    rev: {
      sec30: "In JSX use expressions for conditions: ternary for either/or, `&&` for show/hide, `??` for fallbacks. `&&` returns its left side when falsy, so `0` prints; always compare (`> 0`). For complex branching, compute a variable before `return` or return early.",
      interview: [
        { level: "basic", q: "How do you conditionally render in JSX?", a: "Ternary for two outcomes, `&&` to show or hide, or compute the element in a variable before returning." },
        { level: "intermediate", q: "Why does `{count && <X />}` sometimes show 0?", a: "`&&` returns the left value when it's falsy. `0` is a number, and React renders numbers. Use `count > 0`." },
        { level: "intermediate", q: "Ternary returning `null` vs `&&`?", a: "Same result. `cond ? <X /> : null` is explicit and avoids the 0 trap; `&&` is shorter with real booleans." },
        { level: "advanced", q: "Does hiding with `&&` keep the component's state?", a: "No. When it's removed, React unmounts it and its state is lost. To keep state, hide it with CSS or `<Activity mode=\"hidden\">` (React 19.2)." }
      ],
      predict: [
        { code: `const msgs = [];\nreturn <div>{msgs.length && <b>New!</b>}</div>;`, answer: "<div>0</div>", why: "Empty array length is 0, which renders as text." }
      ],
      cheat: [
        "Either/or: `{c ? <A /> : <B />}`",
        "Show/hide: `{c && <A />}`",
        "Left of `&&` must be boolean (`> 0`)",
        "Fallback: `{a ?? 'default'}`",
        "No nested ternaries; use variables",
        "Hidden with `&&` = unmounted, state lost"
      ]
    },
    related: ["JSX-007", "COND-003", "COND-004", "COND-005"]
  },

  "JSX-014": {
    tldr: "Turn an array into elements with `map()`. Give each element a `key` that's unique and stable (usually the item's id) so React can track it.",
    analogy: { icon: "🎵", text: "A playlist: each song has a track id. Reorder the songs and the player still knows which is which by the id, not by the slot number." },
    visual: { type: "flow", title: "Array → elements", steps: [
      { label: "Data", detail: "`[{ id: 'a', title: 'Sunrise' }, { id: 'b', title: 'Rain' }]`" },
      { label: "`map()`", detail: "`songs.map(s => <li key={s.id}>{s.title}</li>)`" },
      { label: "Array of elements", detail: "`[<li key=\"a\">, <li key=\"b\">]`. React renders arrays in place." },
      { label: "Next render", detail: "React matches old and new items **by key**: keeps, moves, adds or removes." }
    ]},
    points: [
      "`map()` returns a new array; React renders each element in it.",
      "Every item needs a `key` on the **outermost** element returned from `map()`.",
      "Keys must be **unique among siblings** and **stable**: use the database id.",
      "Avoid the array index as a key if items can be added, removed or reordered.",
      "`filter()` first, then `map()`: `todos.filter(t => !t.done).map(...)`.",
      "Keys aren't props: the child can't read `props.key`."
    ],
    code: { file: "TodoList.jsx", lang: "jsx", src: `import { useState } from 'react';

const initial = [
  { id: 101, text: 'Buy milk', done: false },
  { id: 102, text: 'Call mum', done: true },
  { id: 103, text: 'Water plants', done: false },
];

export default function TodoList() {
  const [todos, setTodos] = useState(initial);
  const [hideDone, setHideDone] = useState(false);

  const visible = hideDone ? todos.filter(t => !t.done) : todos;

  return (
    <>
      <label>
        <input type="checkbox" onChange={e => setHideDone(e.target.checked)} />
        Hide done
      </label>
      <ul>
        {visible.map(todo => (
          <li key={todo.id}>
            {todo.done ? '✅' : '⬜'} {todo.text}
          </li>
        ))}
      </ul>
      <p>{visible.length} of {todos.length} shown</p>
    </>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7], note: "Each todo has a stable `id`: perfect for keys." },
      { lines: [13], note: "Filter before mapping. Derived from state, not stored separately." },
      { lines: [22, 23, 24, 25, 26], note: "`map()` turns each todo into an `<li>`. The `key` goes on that outer `<li>`." },
      { lines: [28], note: "Counts update automatically when the filter changes." }
    ]},
    output: "Three todos: ⬜ Buy milk, ✅ Call mum, ⬜ Water plants, and “3 of 3 shown”. Tick “Hide done” → Call mum disappears, “2 of 3 shown”.",
    mistakes: [
      { bad: `{todos.map(t => <li>{t.text}</li>)}`, good: `{todos.map(t => <li key={t.id}>{t.text}</li>)}`, why: "Console warning: “Each child in a list should have a unique key prop.” Without keys React can mix up items." },
      { bad: `{todos.map((t, i) => <TodoRow key={i} todo={t} />)}\n// list can be reordered or deleted`, good: `{todos.map(t => <TodoRow key={t.id} todo={t} />)}`, why: "Index keys shift when items move, so state (like a typed input) sticks to the wrong row." },
      { bad: `{todos.map(t => (\n  <TodoRow todo={t}>\n    <li key={t.id}>...</li>\n  </TodoRow>\n))}`, good: `{todos.map(t => (\n  <TodoRow key={t.id} todo={t} />\n))}`, why: "The key belongs on the outermost element that `map()` returns, not a nested one." }
    ],
    practice: [
      { level: "B", q: "Render `['Tea', 'Coffee', 'Juice']` as a list.", a: "Strings are unique here, so they can be keys.", code: `<ul>{drinks.map(d => <li key={d}>{d}</li>)}</ul>` },
      { level: "B", q: "Render products as `name - $price`.", a: "`{products.map(p => <li key={p.id}>{p.name} - \${p.price}</li>)}`" },
      { level: "I", q: "Show only recipes under 30 minutes.", a: "`recipes.filter(r => r.minutes < 30).map(r => <li key={r.id}>{r.title}</li>)`" },
      { level: "C", q: "When is an index key acceptable?", a: "When the list is static: never reordered, filtered or edited, and items have no state." }
    ],
    quiz: [
      { q: "Best key for a chat message?", options: ["The array index", "`Math.random()`", "The message's id"], answer: 2, why: "Unique and stable across renders." },
      { q: "Where does the key go?", options: ["On the outermost element returned by map", "On the `<ul>`", "On any inner element"], answer: 0, why: "React compares siblings in the array, so the key belongs on each array item." },
      { q: "Why is `key={Math.random()}` bad?", options: ["It's slow to generate", "A new key every render forces React to remount every item", "Keys must be strings"], answer: 1, why: "Changing keys mean “new item”, so state is lost and DOM is rebuilt." }
    ],
    rev: {
      sec30: "Render lists with `array.map()` returning elements. Each needs a `key` unique among siblings and stable over time, ideally the item's id, placed on the outermost returned element. Keys let React match items between renders; index or random keys cause bugs and lost state.",
      interview: [
        { level: "basic", q: "How do you render a list in React?", a: "Call `map()` on the array inside JSX, returning an element per item with a unique `key`." },
        { level: "intermediate", q: "Why do lists need keys?", a: "Keys tell React which item is which between renders, so it can keep, move or remove the right DOM nodes and state." },
        { level: "intermediate", q: "Why is index-as-key risky?", a: "When items are inserted, removed or reordered, indexes shift, so React reuses the wrong component and its state." },
        { level: "advanced", q: "Do keys have to be globally unique?", a: "No, only among siblings in the same array. Two different lists can reuse the same ids." },
        { level: "tricky", q: "Can you read `key` inside the child?", a: "No. React reserves it. Pass the id as a separate prop if the child needs it." }
      ],
      debug: [
        { code: `{notes.map(n => {\n  <li key={n.id}>{n.title}</li>;\n})}`, fix: `{notes.map(n => (\n  <li key={n.id}>{n.title}</li>\n))}`, why: "Curly-brace arrow body without `return` returns undefined. Use parentheses or add `return`." }
      ],
      cheat: [
        "`{arr.map(x => <li key={x.id}>...</li>)}`",
        "Key on the outermost returned element",
        "Unique among siblings, stable over time",
        "Use ids; avoid index for dynamic lists",
        "Never `Math.random()` as a key",
        "`filter()` then `map()`"
      ]
    },
    related: ["JSX-012", "COND-008", "COND-012", "COND-013"]
  },

  "JSX-015": {
    tldr: "JSX is stricter than HTML: return one root, close every tag, use `className`/`htmlFor` instead of reserved words, and start component names with a capital letter.",
    analogy: { icon: "🧳", text: "Airline baggage rules: one bag per passenger (one root), every zip closed (every tag closed), and some items must be relabelled (`class` → `className`)." },
    visual: { type: "layers", title: "The JSX rulebook", items: [
      { label: "One root", detail: "Return one element or a Fragment `<>...</>`." },
      { label: "Close every tag", detail: "`<p>...</p>`, `<img />`, `<br />`. Even `<div />` may self-close." },
      { label: "Renamed words", detail: "`class` → `className`, `for` → `htmlFor`." },
      { label: "camelCase attributes", detail: "`onClick`, `tabIndex`. Dashes only for `aria-*` and `data-*`." },
      { label: "Expressions only in { }", detail: "No `if`, `for`, `const` inside braces." },
      { label: "Capital = component", detail: "`<Cart />` calls your function; `<cart />` is an HTML tag." }
    ]},
    points: [
      "Single root: a function returns **one** value, and JSX compiles to one call.",
      "HTML auto-closes `<li>`, `<br>`; JSX doesn't. Unclosed tags are compile errors.",
      "`class` and `for` are JS keywords, so the DOM property names are used instead.",
      "Comments: `{/* ... */}`. HTML `<!-- -->` is a syntax error.",
      "Events take **functions** and `style` takes an **object**, never strings."
    ],
    code: { file: "WeatherCard.jsx", lang: "jsx", src: `export default function WeatherCard({ onToggle }) {
  return (
    <section className="weather">
      {/* one root: <section> wraps everything */}
      <h2>Lisbon</h2>
      <img src="/sun.png" alt="Sunny" />
      <p>
        Sunny, 24°C<br />
        Humidity 40%
      </p>
      <label htmlFor="unit">Show °F</label>
      <input id="unit" type="checkbox" onChange={onToggle} />
      <button aria-label="Refresh" data-city="lisbon" tabIndex={0}>
        ↻
      </button>
    </section>
  );
}`, walk: [
      { lines: [3, 4], note: "One root element; comments use `{/* */}`." },
      { lines: [6, 8], note: "Void tags self-close: `<img />`, `<br />`." },
      { lines: [11, 12], note: "`htmlFor` and an event that takes a function." },
      { lines: [13], note: "Dashes stay for `aria-*`/`data-*`; `tabIndex` is camelCase with a number." }
    ]},
    output: "A weather card: “Lisbon”, a sun image, “Sunny, 24°C / Humidity 40%”, a “Show °F” checkbox and a ↻ refresh button.",
    mistakes: [
      { bad: `return (\n  <h2 class="title">Lisbon</h2>\n  <img src="sun.png">\n);`, good: `return (\n  <>\n    <h2 className="title">Lisbon</h2>\n    <img src="sun.png" alt="Sunny" />\n  </>\n);`, why: "Three errors in one: two roots, `class`, and an unclosed `<img>`. Fix all three." },
      { bad: `function weatherCard() { ... }\n<weatherCard />`, good: `function WeatherCard() { ... }\n<WeatherCard />`, why: "Lowercase tags are treated as HTML elements; React warns the tag is unrecognized and your function never runs." },
      { bad: `<!-- refresh button -->`, good: `{/* refresh button */}`, why: "HTML comments are a syntax error in JSX." }
    ],
    practice: [
      { level: "B", q: "Fix: `return <h1>Notes</h1><p>2 saved</p>;`", a: "Wrap in a Fragment: `return <><h1>Notes</h1><p>2 saved</p></>;`" },
      { level: "B", q: "Fix: `<input type=\"text\">`", a: "`<input type=\"text\" />`" },
      { level: "I", q: "Fix: `<div class=\"row\" onclick=\"save()\" tabindex=\"0\">`", a: "`<div className=\"row\" onClick={save} tabIndex={0}>`" },
      { level: "C", q: "Why may `<div />` self-close in JSX but not in HTML?", a: "JSX follows XML-style rules: any element with no children can self-close. HTML only allows it for void elements." }
    ],
    quiz: [
      { q: "Valid JSX comment?", options: ["`<!-- x -->`", "`{/* x */}`", "`// x` between tags"], answer: 1, why: "Comments must be JS comments inside braces." },
      { q: "`<profileCard />` does what?", options: ["Renders your ProfileCard", "Creates an unknown HTML element", "Throws a compile error"], answer: 1, why: "Lowercase names are treated as DOM tags." },
      { q: "Is `<span />` valid JSX?", options: ["Yes", "No, only void tags self-close"], answer: 0, why: "Any element without children can self-close in JSX." }
    ],
    rev: {
      sec30: "JSX rules: one root (or Fragment), every tag closed (any element can self-close), `className`/`htmlFor` for reserved words, camelCase attributes except `aria-*`/`data-*`, expressions only in braces, `{/* */}` comments, and capitalised component names.",
      interview: [
        { level: "basic", q: "Why must JSX have one root?", a: "It compiles to a function call, and a component returns a single value. Use a Fragment to avoid an extra node." },
        { level: "basic", q: "Why must component names be capitalised?", a: "The compiler treats lowercase tags as strings (HTML elements) and capitalised ones as variables (components)." },
        { level: "intermediate", q: "How do you write comments in JSX?", a: "`{/* comment */}` between tags; normal `//` works inside attribute expressions or above the return." },
        { level: "tricky", q: "Can a component name be a dotted lowercase expression like `<ui.button />`?", a: "Yes, dotted names are treated as member expressions, so `<ui.button />` refers to the `ui.button` variable." }
      ],
      compare: { cols: ["", "HTML", "JSX"], rows: [
        ["Root", "Any number", "One (or Fragment)"],
        ["Void tags", "`<br>` OK", "`<br />` required"],
        ["Class", "`class`", "`className`"],
        ["Events", "`onclick=\"f()\"`", "`onClick={f}`"],
        ["Comments", "`<!-- -->`", "`{/* */}`"]
      ]},
      cheat: [
        "One root or `<>...</>`",
        "Close every tag; any element may self-close",
        "`className`, `htmlFor`",
        "camelCase; `aria-*`/`data-*` keep dashes",
        "`{/* comment */}`",
        "Capital first letter = component"
      ]
    },
    related: ["JSX-003", "JSX-012", "JSX-016", "COMP-004"]
  },

  "JSX-016": {
    tldr: "Most JSX errors repeat. Learn to tell **compile errors** (bad syntax, Vite overlay) from **runtime errors** (bad values, red console) and **warnings** (dev-only hints), and read the first line of the message.",
    analogy: { icon: "📮", text: "A parcel can fail at the counter (wrong form: compile error), on the road (bad address: runtime error), or arrive with a sticky note “please label better next time” (warning)." },
    visual: { type: "flow", title: "Where an error shows up", steps: [
      { label: "Compile (Vite)", detail: "Two roots, unclosed tag, `if` in braces, JSX in a `.js` file. Overlay; nothing runs." },
      { label: "Runtime (browser)", detail: "Object as child, `undefined.map`, too many re-renders. Red console, blank area." },
      { label: "Dev warnings", detail: "Missing key, `class`/`for`, unknown tag. App works; warnings vanish in prod builds." },
      { label: "Silent bugs", detail: "`0 &&` printing 0, map arrow with `{}` and no `return`. No message at all." }
    ]},
    points: [
      "Read the **first line** and the **file:line** first. The message usually names the fix.",
      "“Adjacent JSX elements must be wrapped” → add a Fragment.",
      "“Objects are not valid as a React child” → render a field, not the object.",
      "“Cannot read properties of undefined (reading 'map')” → start state as `[]` or guard with `?.`.",
      "“Too many re-renders” → `onClick={fn}` or `onClick={() => fn(x)}`, not `onClick={fn(x)}`.",
      "Wording varies by tool (Oxc in Vite 8, Babel, ESLint); the meaning is the same."
    ],
    code: { file: "Menu.jsx", lang: "jsx", src: `import { useState } from 'react';

// Each line marked FIX was a classic error
export default function Menu() {
  const [dishes] = useState([          // FIX: start with an array, not undefined
    { id: 1, name: 'Pad Thai', price: 9 },
    { id: 2, name: 'Green Curry', price: 11 },
  ]);
  const [qty, setQty] = useState(0);

  return (
    <>                                   {/* FIX: one root */}
      <h1 className="title">Menu</h1>    {/* FIX: className */}
      <ul>
        {dishes.map(d => (
          <li key={d.id}>                {/* FIX: key */}
            {d.name} - \${d.price}        {/* FIX: fields, not {d} */}
          </li>
        ))}
      </ul>
      <button onClick={() => setQty(qty + 1)}>   {/* FIX: pass a function */}
        Order ({qty})
      </button>
      {qty > 0 && <p>Thanks!</p>}        {/* FIX: no stray 0 */}
    </>
  );
}`, walk: [
      { lines: [5], note: "`undefined.map` crash avoided: state starts as an array." },
      { lines: [12, 13], note: "One root (Fragment) and `className`." },
      { lines: [16, 17], note: "Key on each item; render fields, never the whole object." },
      { lines: [21], note: "`onClick={setQty(qty + 1)}` would run during render → “Too many re-renders”." },
      { lines: [24], note: "Compare to 0 so an empty order doesn't print “0”." }
    ]},
    output: "“Menu” with “Pad Thai - $9” and “Green Curry - $11”, and an “Order (0)” button. Clicking shows “Order (1)” and “Thanks!”. Console: no errors or warnings.",
    mistakes: [
      { bad: `<button onClick={setQty(qty + 1)}>+</button>`, good: `<button onClick={() => setQty(qty + 1)}>+</button>`, why: "The first calls `setQty` during render, which triggers another render, forever: “Too many re-renders”." },
      { bad: `const [movies, setMovies] = useState();\n...\n{movies.map(m => ...)}`, good: `const [movies, setMovies] = useState([]);\n...\n{movies.map(m => ...)}`, why: "Before data loads, `movies` is undefined: “Cannot read properties of undefined (reading 'map')”." },
      { bad: `<p>{Header}</p>  // Header is a component`, good: `<Header />`, why: "“Functions are not valid as a React child.” Render the component as a tag." }
    ],
    practice: [
      { level: "B", q: "Error: “Adjacent JSX elements must be wrapped in an enclosing tag”. Fix?", a: "Wrap the sibling elements in `<>...</>`." },
      { level: "B", q: "Error: “Objects are not valid as a React child (found: object with keys {name, price})”.", a: "You rendered a whole object. Render `{item.name}` and `{item.price}` instead." },
      { level: "I", q: "Vite says the file “contains invalid JS syntax… name the file with the .jsx extension”.", a: "Rename `App.js` to `App.jsx` (and update the import if it includes the extension)." },
      { level: "C", q: "A list shows nothing, no errors. `items.map(i => { <li key={i.id}>{i.name}</li> })`. Why?", a: "Braces make a function body with no `return`, so every item is undefined. Use `( )` or add `return`." }
    ],
    quiz: [
      { q: "“Too many re-renders” usually means…", options: ["Your component is too big", "A state setter is called during render", "Missing keys"], answer: 1, why: "Typically `onClick={setX(v)}` instead of `onClick={() => setX(v)}`." },
      { q: "Missing-key messages appear…", options: ["In production builds only", "In development only, as warnings", "As compile errors"], answer: 1, why: "React's dev checks are stripped from production builds." },
      { q: "“Cannot read properties of undefined (reading 'map')”: best first fix?", options: ["Wrap everything in try/catch", "Initialise state as `[]`", "Use an index key"], answer: 1, why: "The array doesn't exist yet on first render; give it a safe default." }
    ],
    rev: {
      sec30: "Sort JSX errors by when they appear: compile (syntax: two roots, unclosed tags, statements in braces, JSX in `.js`), runtime (object or function as child, `undefined.map`, setter called in render), dev warnings (keys, `class`), and silent bugs (`0 &&`, missing `return`). Read the first line and file:line.",
      interview: [
        { level: "basic", q: "What causes “Adjacent JSX elements must be wrapped”?", a: "Returning two sibling elements. Wrap them in a Fragment or a parent element." },
        { level: "intermediate", q: "Why does `onClick={handle(id)}` loop or misfire?", a: "It calls `handle` during render and passes its return value. Use `onClick={() => handle(id)}`." },
        { level: "intermediate", q: "Compile error vs runtime error in React?", a: "Compile errors are syntax problems caught by the build (nothing runs). Runtime errors happen with real values in the browser." },
        { level: "advanced", q: "How do you stop one runtime error blanking the whole app?", a: "Wrap sections in an error boundary so a crash shows fallback UI instead of unmounting the entire tree." },
        { level: "tricky", q: "Your list shows “0” under it. Why?", a: "`{list.length && <List />}` with an empty list returns 0, which React renders. Use `list.length > 0`." }
      ],
      debug: [
        { code: `function Price({ item }) {\n  return <p>{item}</p>;\n}`, fix: `function Price({ item }) {\n  return <p>{item.name}: \${item.price}</p>;\n}`, why: "Objects can't be rendered as children; pick the fields." },
        { code: `function Cart() {\n  return (\n    <h2>Cart</h2>\n    <CartList />\n  );\n}`, fix: `function Cart() {\n  return (\n    <>\n      <h2>Cart</h2>\n      <CartList />\n    </>\n  );\n}`, why: "Two roots: wrap them in a Fragment." }
      ],
      cheat: [
        "Read line 1 + file:line first",
        "Two roots → `<>...</>`",
        "Object as child → render a field",
        "`undefined.map` → `useState([])`",
        "Too many re-renders → `onClick={() => f(x)}`",
        "JSX in `.js` → rename to `.jsx`",
        "Stray 0 → `length > 0 &&`"
      ]
    },
    related: ["JSX-015", "ENV-015", "ADV-004", "PROPS-015"]
  },
};
