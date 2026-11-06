export default {
  "COMM-001": {
    tldr: "A parent talks to its child by passing **props** (inputs) in JSX. Data flows one way: down the tree. The child reads them; it never changes them.",
    analogy: { icon: "🍳", text: "A recipe card handed to a cook. The head chef (parent) writes the dish and servings; the cook (child) follows the card but doesn't rewrite it." },
    visual: { type: "flow", title: "Props travel down", steps: [
      { label: "Parent owns data", detail: "`App` has `product = { name: 'Mug', price: 9 }`." },
      { label: "Pass as attribute", detail: "`<ProductCard name={product.name} price={product.price} />`" },
      { label: "React bundles props", detail: "React calls `ProductCard({ name: 'Mug', price: 9 })`." },
      { label: "Child renders", detail: "The card shows **Mug - $9**. New props from the parent = new render." }
    ]},
    points: [
      "Props are the **function arguments** of a component: `function Card({ name, price })`.",
      "Any value works: strings, numbers, arrays, objects, functions, JSX.",
      "Props are **read-only** (immutable). To change them, the parent re-renders with new values.",
      "When the parent re-renders (e.g. its state changes), its children re-render with the fresh props."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function ProductCard({ name, price, onSale = false }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>\${price} {onSale && '🔥 Sale'}</p>
    </div>
  );
}

export default function App() {
  const [price, setPrice] = useState(9);

  return (
    <>
      <ProductCard name="Coffee mug" price={price} onSale={price < 9} />
      <button onClick={() => setPrice(price - 1)}>Discount</button>
    </>
  );
}`, walk: [
      { lines: [3], note: "Child destructures its props. `onSale` gets a default value." },
      { lines: [13], note: "The parent owns the data as state." },
      { lines: [17], note: "Data goes down as JSX attributes. Strings in quotes, anything else in `{}`." },
      { lines: [18], note: "Parent changes its state; the card re-renders with the new `price` automatically." }
    ]},
    output: "“Coffee mug $9”. Click Discount: “$8 🔥 Sale”.",
    mistakes: [
      { bad: `function Card(props) {\n  props.price = props.price * 0.9;\n}`, good: `function Card({ price }) {\n  const salePrice = price * 0.9;\n}`, why: "Props are read-only. Compute a new local value instead of mutating the prop." },
      { bad: `<ProductCard price="9" />`, good: `<ProductCard price={9} />`, why: "Quotes always pass a **string**. Use braces for numbers, booleans, objects." }
    ],
    practice: [
      { level: "B", q: "Pass a `stock` number to `ProductCard` and show “Only N left”.", a: "Add `stock={3}` on the parent and read `{ stock }` in the child.", code: `<p>Only {stock} left</p>` },
      { level: "B", q: "Give `onSale` a default of `false`. What renders if the parent omits it?", a: "The default kicks in, so no 🔥 label." },
      { level: "I", q: "Render a list of 3 products from an array using the same card.", a: "`products.map(p => <ProductCard key={p.id} {...p} />)`" },
      { level: "C", q: "Why doesn't the child need its own state for `price`?", a: "The parent owns it. Copying a prop into state creates two sources of truth that drift apart." }
    ],
    quiz: [
      { q: "How does a child get new data from its parent?", options: ["It edits `props`", "The parent re-renders and passes new props", "It calls `setProps`"], answer: 1, why: "Data only flows down; the parent is the one that changes." },
      { q: "`<Card qty=\"2\" />`: what type is `qty`?", options: ["number", "string", "boolean"], answer: 1, why: "Quoted attribute values are strings. Use `qty={2}` for a number." },
      { q: "Can a child pass data to its parent through props alone?", options: ["Yes, by mutating them", "No, it needs a callback prop from the parent", "Yes, with `return`"], answer: 1, why: "Upward communication needs a function the parent passes down (next lesson)." }
    ],
    rev: {
      sec30: "Parents send data to children as props in JSX. Props are the component's arguments: any JS value, read-only, flowing one way (down). When the parent's state changes, children re-render with new props. Never mutate props; derive new values instead.",
      interview: [
        { level: "basic", q: "What are props?", a: "Inputs a parent passes to a child component, like function arguments. They're read-only." },
        { level: "basic", q: "What is one-way data flow?", a: "Data moves from parent to child only. Children can't change props; they ask the parent via callbacks." },
        { level: "intermediate", q: "Why are props immutable?", a: "So rendering stays predictable: the parent is the single owner, and React can compare old and new props to decide what changed." },
        { level: "tricky", q: "Should you copy a prop into `useState`?", a: "Usually not. The state only takes the first value and ignores later prop changes. Use the prop directly or derive from it. Only do it when the prop is explicitly an `initialX`." }
      ],
      predict: [
        { code: `function Tag({ label = 'New' }) {\n  return <b>{label}</b>;\n}\n<Tag label={undefined} />`, answer: "Renders **New**", why: "Defaults apply when the value is `undefined` (not when it's `null`)." }
      ],
      cheat: [
        "Pass: `<Child name=\"x\" count={3} />`",
        "Read: `function Child({ name, count })`",
        "Props are read-only; never assign to them",
        "Quotes = string, braces = any JS value",
        "Default values: `{ size = 'md' }` (applies to `undefined` only)",
        "New props from parent = child re-renders"
      ]
    },
    related: ["PROPS-001", "PROPS-013", "COMM-002"]
  },

  "COMM-002": {
    tldr: "A child can't change its parent's data, but it can **call a function** the parent passed down (a callback prop). The parent decides what to do with the value.",
    analogy: { icon: "🔔", text: "A restaurant table buzzer. The kitchen (parent) hands you the buzzer; you press it (call the callback) and the kitchen reacts. You never walk into the kitchen yourself." },
    visual: { type: "flow", title: "Data goes down, events go up", steps: [
      { label: "Parent defines handler", detail: "`function addToCart(item) { setCart([...cart, item]) }`" },
      { label: "Pass it as a prop", detail: "`<ProductCard onAdd={addToCart} />`" },
      { label: "Child calls it", detail: "On click: `onAdd(product)`. The child sends data **up** as an argument." },
      { label: "Parent updates state", detail: "Parent's state changes and React re-renders the tree with the new cart." }
    ]},
    points: [
      "Name callback props `onSomething` (`onAdd`, `onChange`); name the parent's function `handleSomething`.",
      "Pass the **function**, don't call it: `onAdd={addToCart}`, not `onAdd={addToCart()}`.",
      "The child sends data up as **arguments**: `onAdd(item)`.",
      "The child stays reusable: it says **what happened**, the parent decides **what to do**."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      {product.name}
      <button onClick={() => onAdd(product)}>Add</button>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  function handleAdd(item) {
    setCart(prev => [...prev, item]);
  }

  return (
    <>
      <p>🛒 {cart.length} items</p>
      <ProductCard product={{ id: 1, name: 'Tea' }} onAdd={handleAdd} />
      <ProductCard product={{ id: 2, name: 'Mug' }} onAdd={handleAdd} />
    </>
  );
}`, walk: [
      { lines: [3], note: "The child receives a function `onAdd` like any other prop." },
      { lines: [7], note: "On click it calls the parent's function and passes the product **up**." },
      { lines: [15, 16, 17], note: "The parent owns the cart and decides how to update it." },
      { lines: [22, 23], note: "Same child, same callback; each card sends its own product." }
    ]},
    output: "“🛒 0 items”. Each Add click raises the count.",
    mistakes: [
      { bad: `<ProductCard onAdd={handleAdd(product)} />`, good: `<ProductCard onAdd={handleAdd} />`, why: "`handleAdd(product)` runs during render (and may loop forever). Pass the function itself." },
      { bad: `function ProductCard({ cart }) {\n  cart.push(item);\n}`, good: `function ProductCard({ onAdd }) {\n  onAdd(item);\n}`, why: "Mutating the parent's array doesn't trigger a re-render. Ask the parent to update via a callback." }
    ],
    practice: [
      { level: "B", q: "Add an `onRemove` callback that removes an item by id.", a: "Parent: `setCart(prev => prev.filter(i => i.id !== id))`; child: `onRemove(product.id)`." },
      { level: "B", q: "A `SearchBox` should tell the parent what the user typed. Sketch it.", a: "`<input onChange={e => onSearch(e.target.value)} />`; parent stores it in state." },
      { level: "I", q: "Send two values up: the product and a quantity.", a: "`onAdd(product, qty)` or one object `onAdd({ product, qty })`. An object is easier to extend." },
      { level: "C", q: "Why is `onAdd` better than passing `setCart` directly?", a: "`setCart` exposes the parent's internals; the child would need to know the cart shape. `onAdd(item)` keeps the child ignorant and reusable." }
    ],
    quiz: [
      { q: "How does a child send data to its parent?", options: ["Return it from the component", "Call a function prop with the data", "Write to `props`", "Use `this.parent`"], answer: 1, why: "The parent passes a callback; the child calls it with arguments." },
      { q: "What's wrong with `onClick={onAdd(item)}`?", options: ["Nothing", "It calls `onAdd` during render instead of on click", "Arrow functions are required by React"], answer: 1, why: "Parentheses run the function immediately. Wrap it: `() => onAdd(item)`." },
      { q: "Who should own the cart state?", options: ["Each product card", "The parent that shows the total", "The button"], answer: 1, why: "Whoever needs to read it (the total) and coordinates children owns it." }
    ],
    rev: {
      sec30: "Children communicate upward by calling callback props. The parent defines a handler (`handleAdd`), passes it as `onAdd`, and the child calls `onAdd(data)`. The parent updates its state, and React re-renders. Data down, events up.",
      interview: [
        { level: "basic", q: "How do you pass data from child to parent?", a: "The parent passes a function prop; the child calls it with the data as arguments." },
        { level: "intermediate", q: "Why the `onX` / `handleX` naming?", a: "`onX` is the prop name (the event the child exposes), `handleX` is the parent's implementation. It mirrors built-ins like `onClick` and makes the direction obvious." },
        { level: "intermediate", q: "Does passing a new arrow function each render hurt performance?", a: "Rarely. It only matters when the child is wrapped in `memo`; then use `useCallback` or rely on the React Compiler." },
        { level: "tricky", q: "Can a child call a parent's setter directly?", a: "Yes if you pass it, but prefer an intent-named callback. It hides the parent's state shape and keeps the child reusable." }
      ],
      debug: [
        { code: `<button onClick={onDelete(note.id)}>Delete</button>`, fix: `<button onClick={() => onDelete(note.id)}>Delete</button>`, why: "Without the arrow, `onDelete` runs during render for every note, not on click (and the state update can loop)." }
      ],
      cheat: [
        "Parent: `<Child onAdd={handleAdd} />`",
        "Child: `onAdd(item)` inside an event handler",
        "Pass the function, don't call it",
        "Data down (props), events up (callbacks)",
        "Prefer intent callbacks (`onAdd`) over raw setters",
        "Mutating parent data in a child never re-renders"
      ]
    },
    related: ["PROPS-008", "EVT-001", "COMM-001", "COMM-003"]
  },

  "COMM-003": {
    tldr: "Siblings can't talk directly. Move the shared data to their **closest common parent**; one sibling sends updates up via a callback, the other receives them as props.",
    analogy: { icon: "💬", text: "Two friends in a group chat. They don't text each other privately; one posts to the group (parent) and everyone in it sees the message." },
    visual: { type: "tree", title: "Sharing through the common parent", root: {
      label: "ShopPage", note: "owns `cart` state", children: [
        { label: "ProductList", note: "calls `onAdd(item)` ⬆" },
        { label: "CartBadge", note: "reads `count` prop ⬇" }
      ]
    }},
    points: [
      "React data only flows down, so siblings share via a **common parent**.",
      "Find the **closest** component above both. Don't jump to the top of the app.",
      "Sibling A: gets a callback (`onAdd`). Sibling B: gets the value (`count`).",
      "Both stay in sync because there's **one source of truth**.",
      "If the common parent is far away, consider context or a store (later lessons)."
    ],
    code: { file: "ShopPage.jsx", lang: "jsx", src: `import { useState } from 'react';

function ProductList({ onAdd }) {
  const products = ['Tea', 'Mug', 'Cookies'];
  return products.map(p => (
    <button key={p} onClick={() => onAdd(p)}>Add {p}</button>
  ));
}

function CartBadge({ items }) {
  return <p>🛒 {items.length}: {items.join(', ')}</p>;
}

export default function ShopPage() {
  const [items, setItems] = useState([]);

  return (
    <>
      <CartBadge items={items} />
      <ProductList onAdd={p => setItems(prev => [...prev, p])} />
    </>
  );
}`, walk: [
      { lines: [15], note: "Shared state lives in the closest common parent." },
      { lines: [20], note: "Sibling A gets a callback to send changes up." },
      { lines: [6], note: "Clicking a product calls the parent's callback." },
      { lines: [19, 11], note: "Sibling B receives the updated array as a prop and re-renders." }
    ]},
    output: "Click “Add Tea”, then “Add Mug”: the badge shows “🛒 2: Tea, Mug”.",
    mistakes: [
      { bad: `// ProductList\nwindow.cart.push(p);\n// CartBadge reads window.cart`, good: `// parent owns state\n<ProductList onAdd={add} />\n<CartBadge items={items} />`, why: "Globals don't trigger re-renders, so the badge never updates." },
      { bad: `// both siblings\nconst [items, setItems] = useState([]);`, good: `// only the parent\nconst [items, setItems] = useState([]);`, why: "Two separate states = two sources of truth that never sync." }
    ],
    practice: [
      { level: "B", q: "A `TempInput` and a `WeatherAdvice` (\"Bring a jacket\") must share a temperature. Where does the state go?", a: "In their common parent, e.g. `WeatherPanel`. Input gets `onChange`, advice gets `temp`." },
      { level: "I", q: "Add a **Clear** button inside `CartBadge`.", a: "Pass `onClear={() => setItems([])}` to `CartBadge` too. It both reads and sends up." },
      { level: "I", q: "A playlist `SongList` and a `NowPlaying` bar. Design the props.", a: "Parent holds `currentSong`. `SongList onPlay={setCurrent}`; `NowPlaying song={currentSong}`." },
      { level: "C", q: "Siblings are 4 levels apart. What are your options?", a: "Lift to the common ancestor and pass props, use composition (children) to cut levels, or use context / a store if many components need it." }
    ],
    quiz: [
      { q: "How do two sibling components share data in plain React?", options: ["Direct refs to each other", "Through state in their common parent", "Using `props.sibling`"], answer: 1, why: "Lift the state to the common parent and pass it down to both." },
      { q: "Where should the shared state live?", options: ["At the root `App`, always", "In the closest common parent", "In the sibling that changes it"], answer: 1, why: "As low as possible while still above both. Fewer re-renders, simpler code." },
      { q: "If each sibling has its own `useState` for the same data, what happens?", options: ["React merges them", "They drift out of sync", "It throws an error"], answer: 1, why: "Separate state slots are independent." }
    ],
    rev: {
      sec30: "Siblings communicate through their closest common parent. The parent owns the state, passes a callback to the sibling that changes it and the value to the sibling that shows it. One source of truth keeps both in sync. If the common parent is far, use composition, context or a store.",
      interview: [
        { level: "basic", q: "How do siblings communicate in React?", a: "Lift the shared state to their closest common parent and pass value and callback down as props." },
        { level: "intermediate", q: "Why not put the state at the app root?", a: "Every state change would re-render a huge subtree, and unrelated code would depend on it. Keep it as low as possible." },
        { level: "advanced", q: "When does common-parent sharing stop scaling?", a: "When many distant components need the data or you drill through many layers. Then use context, or a store like Zustand/Redux for frequent updates." },
        { level: "tricky", q: "Could you use an event emitter between siblings?", a: "You can, but it bypasses React's data flow; you'd still need state in each to re-render. It's harder to trace. Prefer lifting state." }
      ],
      scenario: [
        { q: "A notes app: `NoteList` on the left, `NoteEditor` on the right. Selecting a note must open it in the editor.", a: "Parent `NotesPage` holds `selectedId`. `NoteList onSelect={setSelectedId}`; `NoteEditor note={notes.find(n => n.id === selectedId)}`." }
      ],
      cheat: [
        "Siblings never talk directly",
        "State lives in the closest common parent",
        "Changer gets a callback, reader gets a value",
        "One source of truth = always in sync",
        "Far apart? composition, context, or a store"
      ]
    },
    related: ["STATE-021", "COMM-002", "COMM-005", "COMM-004"]
  },

  "COMM-004": {
    tldr: "**Props drilling** means passing a prop through components that don't use it, just to reach a deep child. A little is fine; it hurts when many layers just forward props.",
    analogy: { icon: "📦", text: "Passing a parcel hand to hand down a long queue. Two people is fine. Ten people who don't care about it, and every one is a chance to drop or rename it." },
    visual: { type: "tree", title: "`user` drilled 3 levels", root: {
      label: "App", note: "owns `user`", children: [
        { label: "Layout", note: "forwards `user` (unused)", children: [
          { label: "Sidebar", note: "forwards `user` (unused)", children: [
            { label: "Avatar", note: "actually uses `user` ✅" }
          ]}
        ]}
      ]
    }},
    points: [
      "Drilling is **not a bug**: it's explicit and easy to trace. 1-2 levels is normal.",
      "Pain signals: 3+ pass-through layers, adding a prop means editing many files, middle components just forward.",
      "Fix 1: **composition**. Pass `<Avatar user={user} />` as `children` so middle layers don't see `user`.",
      "Fix 2: **context** for app-wide data (theme, current user, locale).",
      "Fix 3: a **store** (Zustand, Redux Toolkit) for big, frequently changing shared state."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `// ❌ Drilling: Layout and Sidebar only forward user
function Layout({ user }) {
  return <Sidebar user={user} />;
}
function Sidebar({ user }) {
  return <nav><Avatar user={user} /></nav>;
}

// ✅ Composition: pass the finished element down
function Layout2({ children }) {
  return <div className="layout">{children}</div>;
}
function Sidebar2({ children }) {
  return <nav>{children}</nav>;
}

function Avatar({ user }) {
  return <img src={user.photo} alt={user.name} />;
}

export default function App() {
  const user = { name: 'Sam', photo: '/sam.png' };
  return (
    <Layout2>
      <Sidebar2>
        <Avatar user={user} />
      </Sidebar2>
    </Layout2>
  );
}`, walk: [
      { lines: [2, 3, 4, 5, 6, 7], note: "Middle layers take `user` only to pass it on: classic drilling." },
      { lines: [10, 11, 13, 14], note: "With `children`, middle layers render whatever they're given and know nothing about `user`." },
      { lines: [26], note: "`App` connects `user` straight to `Avatar`. Zero pass-through props." }
    ]},
    mistakes: [
      { bad: `// 1 level of passing\n// "Too much drilling, add context!"`, good: `// pass the prop; it's fine\n<Header user={user} />`, why: "Context adds indirection and re-renders. Don't use it to avoid one or two props." },
      { bad: `function Sidebar(props) {\n  return <Avatar {...props} />;\n}`, good: `function Sidebar({ children }) {\n  return <nav>{children}</nav>;\n}`, why: "Spreading everything hides what's drilled and leaks unknown props. Composition is cleaner." }
    ],
    practice: [
      { level: "B", q: "Count the pass-through layers in the visual. Which components don't use `user`?", a: "Two: `Layout` and `Sidebar` only forward it." },
      { level: "I", q: "A `theme` prop goes through 6 components to style buttons everywhere. Best fix?", a: "Context: it's app-wide, read in many places, and changes rarely." },
      { level: "I", q: "Refactor `<Page user={user} />` → `Header` → `UserMenu` using composition.", a: "`<Page header={<Header><UserMenu user={user} /></Header>} />` or pass `UserMenu` as children." },
      { level: "C", q: "List 3 costs of fixing drilling with context.", a: "Implicit dependency (harder to trace), every consumer re-renders on change, and components become harder to reuse outside the provider." }
    ],
    quiz: [
      { q: "What is props drilling?", options: ["Passing props through components that don't use them", "Mutating props deep in the tree", "Passing too many props to one component"], answer: 0, why: "It's about pass-through layers, not prop count." },
      { q: "Which is usually the first fix to try?", options: ["Redux", "Component composition (children)", "Global variables"], answer: 1, why: "Composition removes layers without new tools or hidden dependencies." },
      { q: "Is 2-level drilling a problem?", options: ["Yes, always use context", "Usually no, it's explicit and fine"], answer: 1, why: "Drilling is only a problem when it becomes painful to maintain." }
    ],
    rev: {
      sec30: "Props drilling is passing props through components that don't need them. A few levels is fine and explicit. When many layers just forward, fix with composition first (pass elements as children), then context for app-wide rarely-changing data, then a store for large frequently-updated state.",
      interview: [
        { level: "basic", q: "What is prop drilling?", a: "Passing data through intermediate components that don't use it, just so a deeply nested child can." },
        { level: "intermediate", q: "Is prop drilling bad?", a: "Not inherently. It's explicit and traceable. It becomes a problem when many pass-through layers make changes and refactors painful." },
        { level: "advanced", q: "How does composition reduce drilling?", a: "The parent creates the deep element itself and passes it as `children` or a slot prop, so middle components render it without knowing its props." },
        { level: "tricky", q: "Why not always use context instead?", a: "Context hides dependencies, re-renders all consumers on change, and couples components to a provider. Use it for truly global data." }
      ],
      compare: { cols: ["", "Composition", "Context", "Store"], rows: [
        ["Best for", "Layout layers", "Theme, auth, locale", "Large, fast-changing state"],
        ["Extra tools", "None", "Built in", "Zustand / RTK"],
        ["Traceability", "High", "Medium", "Medium"]
      ]},
      cheat: [
        "Drilling = forwarding props you don't use",
        "1-2 levels: fine, keep it",
        "Pain: 3+ layers, many files per prop change",
        "Fix 1: composition via `children` / slots",
        "Fix 2: context for global, rarely-changing data",
        "Fix 3: store for big, frequent shared state"
      ]
    },
    related: ["PROPS-011", "PROPS-010", "COMM-006", "COMM-013"]
  },

  "COMM-005": {
    tldr: "When several components need the same data, **lift the state** up to their closest common parent. The parent owns it; children get the value and callbacks as props.",
    analogy: { icon: "📋", text: "A shared shopping list on the fridge. Instead of everyone keeping their own copy, one list hangs in the kitchen and everyone reads and writes to it." },
    visual: { type: "flow", title: "Lifting state in 5 moves", steps: [
      { label: "Spot the shared data", detail: "Search box, filter chips and result list all need `query`." },
      { label: "Find common parent", detail: "`RecipePage` sits above all three." },
      { label: "Move the state up", detail: "Delete `useState` from children; add it once in `RecipePage`." },
      { label: "Pass value + callback", detail: "`<SearchBox query={query} onQueryChange={setQuery} />`" },
      { label: "Derive the rest", detail: "Compute `filtered` from `query` during render. No extra state." }
    ]},
    points: [
      "Lifted children become **controlled**: they show props and report changes via callbacks.",
      "Lift only **as high as needed**: the closest common parent.",
      "**Derive**, don't duplicate: filtered lists and counts are computed, not stored.",
      "Keep state that only one child needs **inside that child** (colocation).",
      "C# view: like moving a field from two views into a shared view model."
    ],
    code: { file: "RecipePage.jsx", lang: "jsx", src: `import { useState } from 'react';

const RECIPES = [
  { id: 1, name: 'Pancakes', veg: true },
  { id: 2, name: 'Chicken curry', veg: false },
  { id: 3, name: 'Veg soup', veg: true },
];

function SearchBox({ query, onQueryChange }) {
  return <input value={query} onChange={e => onQueryChange(e.target.value)} />;
}

function VegToggle({ vegOnly, onToggle }) {
  return (
    <label>
      <input type="checkbox" checked={vegOnly} onChange={onToggle} /> Veg only
    </label>
  );
}

export default function RecipePage() {
  const [query, setQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = RECIPES.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) && (!vegOnly || r.veg)
  );

  return (
    <>
      <SearchBox query={query} onQueryChange={setQuery} />
      <VegToggle vegOnly={vegOnly} onToggle={() => setVegOnly(v => !v)} />
      <p>{filtered.length} recipes</p>
      <ul>{filtered.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}`, walk: [
      { lines: [9, 10, 11], note: "`SearchBox` owns nothing: shows `query`, reports typing via `onQueryChange`." },
      { lines: [22, 23], note: "Both pieces of state are lifted into the common parent." },
      { lines: [25, 26, 27], note: "The filtered list is **derived** every render. No `useState` for it." },
      { lines: [31, 32], note: "Each child gets the value and a callback." },
      { lines: [33, 34], note: "Count and list read the same source, so they never disagree." }
    ]},
    output: "Type “soup”: “1 recipes, Veg soup”. Tick Veg only with empty search: Pancakes, Veg soup.",
    mistakes: [
      { bad: `const [filtered, setFiltered] = useState(RECIPES);\nuseEffect(() => setFiltered(...), [query]);`, good: `const filtered = RECIPES.filter(...);`, why: "Storing derived data needs syncing, adds an extra render and can go stale. Compute it during render." },
      { bad: `function SearchBox() {\n  const [query, setQuery] = useState('');\n  ...\n}`, good: `function SearchBox({ query, onQueryChange }) { ... }`, why: "If the list needs `query`, it can't live inside `SearchBox`: the parent can't read child state." }
    ],
    practice: [
      { level: "B", q: "Add a **Clear** button in the parent that resets the search.", a: "`<button onClick={() => setQuery('')}>Clear</button>`. The input updates because it's controlled." },
      { level: "I", q: "Add a `SortSelect` (A-Z / Z-A). Where does `sort` live?", a: "In `RecipePage`, then sort the derived list: `[...filtered].sort(...)`." },
      { level: "I", q: "Only `RecipeCard` needs an `expanded` flag. Lift it?", a: "No. Keep it local in each card; nothing else reads it." },
      { level: "C", q: "Two accordion panels: only one may be open. Lift what?", a: "`openId` in the parent. Each panel gets `isOpen={openId === id}` and `onOpen={() => setOpenId(id)}`." }
    ],
    quiz: [
      { q: "When should you lift state?", options: ["Always, to the root", "When two or more components need the same data", "Whenever a component has state"], answer: 1, why: "Lift only to share. Otherwise keep it local." },
      { q: "The result count should be...", options: ["Its own `useState`", "Derived from the list during render", "Stored in a ref"], answer: 1, why: "Derived values can't go out of sync." },
      { q: "After lifting, `SearchBox` is a...", options: ["controlled component", "uncontrolled component", "higher-order component"], answer: 0, why: "Its value comes from props and changes are reported up." }
    ],
    rev: {
      sec30: "Lifting state: move shared state to the closest common parent, pass the value and a callback down, delete the children's copies, and derive everything else during render. Lift only as high as needed; keep single-use state local.",
      interview: [
        { level: "basic", q: "What does lifting state up mean?", a: "Moving state from children to their closest common parent so they can share it via props." },
        { level: "intermediate", q: "What's the downside of lifting too high?", a: "Every update re-renders a larger subtree and couples unrelated components. Colocate state as low as possible." },
        { level: "intermediate", q: "Should derived data be in state?", a: "No. Compute it during render (use `useMemo` only if it's expensive). Extra state means syncing bugs." },
        { level: "advanced", q: "How do you lift state for a large form with many fields?", a: "One object or `useReducer` in the parent, with a generic `onFieldChange(name, value)` callback, or a form library for big forms." }
      ],
      cheat: [
        "Lift to the **closest** common parent",
        "Children: value prop + `onChange`-style callback",
        "Derive filtered lists and counts during render",
        "Single-use state stays local (colocation)",
        "Lifted children are controlled components"
      ]
    },
    related: ["STATE-021", "STATE-022", "COMM-003", "COMM-010"]
  },

  "COMM-006": {
    tldr: "**Context** lets a parent share a value with every component below it, without passing props through each layer. Create it, wrap with `<MyContext value={...}>`, read with `useContext`.",
    analogy: { icon: "📻", text: "A radio station. The station (provider) broadcasts; any radio (consumer) inside its range tunes in. Nobody hands the signal person to person." },
    visual: { type: "tree", title: "Provider broadcasts, consumers tune in", root: {
      label: "<ThemeContext value=\"dark\">", note: "provider (React 19 syntax)", children: [
        { label: "Layout", note: "doesn't touch theme", children: [
          { label: "Header", children: [{ label: "ThemeButton", note: "useContext → 'dark'" }] },
          { label: "NoteList", children: [{ label: "NoteCard", note: "useContext → 'dark'" }] }
        ]}
      ]
    }},
    points: [
      "`createContext(default)` makes it. The default is used only when **no provider** is above.",
      "React 19: render `<ThemeContext value={...}>` directly. `<ThemeContext.Provider>` still works but is on its way out.",
      "Read with `useContext(ThemeContext)` or `use(ThemeContext)` (`use` can be called inside `if`).",
      "The **nearest** provider above wins; you can nest providers to override.",
      "When the value changes, **every** consumer below re-renders (see COMM-008)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function ThemeButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Theme: {theme}</button>;
}

function Header() {
  return <header><ThemeButton /></header>;
}

export default function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={theme}>
      <Header />
      <button onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
        Toggle
      </button>
    </ThemeContext>
  );
}`, walk: [
      { lines: [3], note: "Create the context once, at module level. `'light'` is the fallback." },
      { lines: [6], note: "Any descendant reads the nearest value. No props needed." },
      { lines: [11], note: "`Header` knows nothing about theme: no drilling." },
      { lines: [18], note: "React 19: the context itself is the provider. Put state in `value` so it can change." }
    ]},
    output: "“Theme: light”. Click Toggle: “Theme: dark”.",
    mistakes: [
      { bad: `function App() {\n  const Ctx = createContext(null);\n  ...\n}`, good: `const Ctx = createContext(null);\nfunction App() { ... }`, why: "Creating context inside a component makes a new context every render; consumers lose the link." },
      { bad: `<ThemeButton />\n<ThemeContext value="dark">...</ThemeContext>`, good: `<ThemeContext value="dark">\n  <ThemeButton />\n</ThemeContext>`, why: "Consumers must be **inside** the provider, or they get the default value." }
    ],
    practice: [
      { level: "B", q: "Create a `UserContext` and show the user's name in a deep `Greeting`.", a: "`const UserContext = createContext(null)`; wrap with `<UserContext value={user}>`; `useContext(UserContext).name`." },
      { level: "I", q: "Let consumers toggle the theme too.", a: "Pass an object: `value={{ theme, toggle }}`. Consumers call `toggle()`." },
      { level: "I", q: "Write a `useTheme()` custom hook that throws if no provider.", a: "Read the context; if `null`, throw a helpful error.", code: `export function useTheme() {\n  const ctx = useContext(ThemeContext);\n  if (!ctx) throw new Error('useTheme needs <ThemeProvider>');\n  return ctx;\n}` },
      { level: "C", q: "Make one card section always light, inside a dark app.", a: "Nest a second `<ThemeContext value=\"light\">` around it. The nearest provider wins." }
    ],
    quiz: [
      { q: "In React 19, how do you provide a context?", options: ["`<Ctx value={v}>`", "`<Ctx.Consumer value={v}>`", "`provide(Ctx, v)`"], answer: 0, why: "React 19 lets you render the context directly. `.Provider` still works; React plans to deprecate it later." },
      { q: "When is the `createContext` default used?", options: ["Always on first render", "When no provider is above the consumer", "When value is `null`"], answer: 1, why: "A provider with `value={null}` gives `null`, not the default." },
      { q: "Two nested providers of the same context: which value does a consumer get?", options: ["The outermost", "The nearest one above it", "Both merged"], answer: 1, why: "Lookup walks up the tree and stops at the first provider." }
    ],
    rev: {
      sec30: "Context shares a value with a whole subtree without drilling. `createContext(default)` at module level, provide with `<Ctx value={v}>` (React 19; `.Provider` still works but will be deprecated), read with `useContext(Ctx)` or `use(Ctx)`. Nearest provider wins; default only when none exists. Every consumer re-renders when the value changes.",
      interview: [
        { level: "basic", q: "What problem does Context solve?", a: "Passing data deep without drilling props through every layer, for things like theme, auth or locale." },
        { level: "intermediate", q: "What changed with context in React 19?", a: "You can render `<Ctx value>` as the provider instead of `<Ctx.Provider>`, and read it with `use(Ctx)`, which works conditionally." },
        { level: "intermediate", q: "Is Context a state management tool?", a: "No, it's a transport. State still lives in `useState`/`useReducer`; context just delivers it down the tree." },
        { level: "advanced", q: "Why wrap `useContext` in a custom hook?", a: "One import, a clear name, and you can throw a helpful error when the provider is missing." },
        { level: "tricky", q: "Provider `value={undefined}`: does the consumer get the default?", a: "No. With a provider present, the consumer gets `undefined`. The default only applies with no provider." }
      ],
      predict: [
        { code: `const Ctx = createContext('🍎');\nfunction Fruit() { return useContext(Ctx); }\n<>\n  <Fruit />\n  <Ctx value="🍌"><Fruit /></Ctx>\n</>`, answer: "🍎🍌", why: "The first `Fruit` has no provider (default); the second reads the nearest provider." }
      ],
      cheat: [
        "`const Ctx = createContext(default)` at module level",
        "React 19 provider: `<Ctx value={v}>...</Ctx>`",
        "Read: `useContext(Ctx)` or `use(Ctx)`",
        "Nearest provider wins",
        "Default only when there's no provider at all",
        "Value change re-renders all consumers"
      ]
    },
    related: ["HOOKS-006", "STORE-002", "COMM-007", "COMM-008"]
  },

  "COMM-007": {
    tldr: "Use **one context per concern** (theme, auth, locale) instead of one giant AppContext. Each piece changes on its own schedule, so splitting stops unrelated re-renders and keeps code clear.",
    analogy: { icon: "📺", text: "Separate TV channels for news, sport and weather. If all were one channel, sports fans would sit through every weather update." },
    visual: { type: "compare", title: "One big context vs one per concern", left: { label: "One AppContext", tone: "bad", points: [
      "`{ user, theme, locale, cart }` in one value",
      "Theme toggle re-renders every user and cart consumer",
      "Everyone imports everything",
      "Hard to test one piece alone"
    ]}, right: { label: "Split by concern", tone: "good", points: [
      "`ThemeContext`, `AuthContext`, `LocaleContext`",
      "Theme toggle re-renders only theme consumers",
      "Each has its own provider + `useX()` hook",
      "Easy to mock one in tests"
    ]}},
    points: [
      "Split by **what changes together** and who reads it.",
      "Give each one a provider component and a hook: `<AuthProvider>` + `useAuth()`.",
      "Nest providers at the app root; order matters only if one **reads** another (auth inside locale, etc.).",
      "Many providers is fine. If it looks noisy, group them in one `AppProviders` component.",
      "Don't over-split: a value read by one component doesn't need context at all."
    ],
    code: { file: "providers.jsx", lang: "jsx", src: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const AuthContext = createContext(null);
const LocaleContext = createContext('en');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = name => setUser({ name });
  const logout = () => setUser(null);
  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
}

export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);
export const useLocale = () => useContext(LocaleContext);

export function AppProviders({ children }) {
  return (
    <LocaleContext value="en-GB">
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </LocaleContext>
  );
}

// Anywhere below: const { user } = useAuth();`, walk: [
      { lines: [3, 4, 5], note: "One context per concern." },
      { lines: [7, 8, 9], note: "Each provider owns its own state." },
      { lines: [12, 13, 14, 15, 16], note: "Auth exposes data **and** actions. Theme changes never touch it." },
      { lines: [19, 20, 21], note: "Small hooks hide which context is used." },
      { lines: [23, 24, 25, 26, 27, 28, 29, 30], note: "One wrapper composes all providers. Wrap `<App />` with it in `main.jsx`." }
    ]},
    mistakes: [
      { bad: `<AppContext value={{ user, theme, cart, locale }}>`, good: `<AuthContext value={auth}>\n  <ThemeContext value={theme}>...`, why: "One mega value means any change re-renders every consumer of anything." },
      { bad: `<AuthProvider>  // uses useLocale()\n  <LocaleContext value="fr">`, good: `<LocaleContext value="fr">\n  <AuthProvider>`, why: "A provider that **reads** another context must be nested inside it." }
    ],
    practice: [
      { level: "B", q: "Show “Hi, Sam” in the header using `useAuth()`.", a: "`const { user } = useAuth(); return user ? <p>Hi, {user.name}</p> : <button>Log in</button>;`" },
      { level: "I", q: "Should the shopping cart get its own context?", a: "Yes if many distant components read it (badge, checkout, product pages). It changes often, so keep it separate from theme/auth." },
      { level: "I", q: "Add a `useLocale()` date formatter for a weather card.", a: "`new Intl.DateTimeFormat(useLocale()).format(date)`." },
      { level: "C", q: "Write a test that renders `Header` with a fake logged-in user only.", a: "Wrap in `<AuthContext value={{ user: { name: 'Sam' } }}>`. No need for theme or locale providers if `Header` doesn't use them (export the context for tests)." }
    ],
    quiz: [
      { q: "Why split context by concern?", options: ["React allows only one value type", "Changes to one concern won't re-render consumers of others", "It makes bundles smaller"], answer: 1, why: "Consumers subscribe to the whole value of one context." },
      { q: "When does provider order matter?", options: ["Never", "When a provider reads another context", "Always alphabetical"], answer: 1, why: "A component can only read providers above it." },
      { q: "Is having 5 nested providers a problem?", options: ["Yes, React slows down a lot", "No, it's normal; wrap them in one component if noisy"], answer: 1, why: "Providers are cheap. Readability is the only concern." }
    ],
    rev: {
      sec30: "Split context by concern: theme, auth, locale, cart. Each has its own provider and `useX()` hook. Consumers only re-render when their context changes. Compose providers in one `AppProviders` wrapper; nest a provider inside any context it reads.",
      interview: [
        { level: "basic", q: "Can you use multiple contexts in one component?", a: "Yes, call `useContext` once per context: `useTheme()`, `useAuth()` and so on." },
        { level: "intermediate", q: "Why not one global AppContext?", a: "Every consumer re-renders when any field changes, and everything is coupled. Separate contexts isolate updates." },
        { level: "intermediate", q: "How do you avoid 'provider hell'?", a: "Group them in one `AppProviders` component. It's cosmetic; nested providers are cheap." },
        { level: "advanced", q: "How would you split a context that has both fast and slow-changing data?", a: "Separate them, e.g. `CartItemsContext` and `CartActionsContext`, so components that only dispatch don't re-render." }
      ],
      cheat: [
        "One context per concern: theme, auth, locale",
        "Each: provider component + `useX()` hook",
        "Consumers re-render only for their context",
        "Nest a provider inside contexts it reads",
        "Group providers in `AppProviders`",
        "Single-reader data doesn't need context"
      ]
    },
    related: ["COMM-006", "COMM-008", "HOOKS-029", "PERF-018"]
  },

  "COMM-008": {
    tldr: "When a context value changes, **every** component that reads it re-renders. Keep the value stable, split fast and slow data, and keep consumers small to avoid needless work.",
    analogy: { icon: "📢", text: "A shop's loudspeaker. Announcing every single sale to all staff wastes time. Better: separate channels, and only announce when something really changed." },
    visual: { type: "flow", title: "Why a toggle re-renders everyone", steps: [
      { label: "Provider re-renders", detail: "`CartProvider` state changes (or its parent re-renders)." },
      { label: "New value object", detail: "`value={{ items, add }}` creates a **new object** each render." },
      { label: "React compares", detail: "`Object.is(old, new)` is false, so the context counts as changed." },
      { label: "All consumers re-render", detail: "Even `memo` children re-render if they read this context." },
      { label: "Fix", detail: "Memoize the value, split state from actions, read in small leaf components." }
    ]},
    points: [
      "Context compares values with `Object.is`. A new object every render = **every** consumer re-renders.",
      "**Memoize** the value: `useMemo(() => ({ items, add }), [items])` with `add` from `useCallback`. (React Compiler can do this automatically.)",
      "**Split** state and actions into two contexts: buttons that only call `add` stop re-rendering.",
      "Read context in **small leaf components**, not in a big parent.",
      "Many fast updates (typing, mouse position)? Use a store with selectors (Zustand, Redux Toolkit, `useSyncExternalStore`)."
    ],
    code: { file: "CartContext.jsx", lang: "jsx", src: `import { createContext, useContext, useMemo, useReducer } from 'react';

const CartItemsContext = createContext([]);
const CartActionsContext = createContext(null);

function reducer(items, action) {
  if (action.type === 'add') return [...items, action.item];
  if (action.type === 'clear') return [];
  return items;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  const actions = useMemo(() => ({
    add: item => dispatch({ type: 'add', item }),
    clear: () => dispatch({ type: 'clear' }),
  }), []);

  return (
    <CartActionsContext value={actions}>
      <CartItemsContext value={items}>{children}</CartItemsContext>
    </CartActionsContext>
  );
}

export const useCartItems = () => useContext(CartItemsContext);
export const useCartActions = () => useContext(CartActionsContext);

// Re-renders only when items change
export function CartBadge() {
  return <span>🛒 {useCartItems().length}</span>;
}

// Never re-renders because of cart changes
export function AddButton({ product }) {
  const { add } = useCartActions();
  return <button onClick={() => add(product)}>Add</button>;
}`, walk: [
      { lines: [3, 4], note: "Two contexts: data that changes vs actions that don't." },
      { lines: [13], note: "`dispatch` from `useReducer` is stable across renders." },
      { lines: [15, 16, 17, 18], note: "Actions object is created **once** (empty deps), so its context never changes." },
      { lines: [21, 22], note: "Each context gets its own value." },
      { lines: [31, 32, 33], note: "Small leaf consumer: only this tiny badge re-renders on add." },
      { lines: [36, 37, 38, 39], note: "Reads only actions, so it skips cart re-renders (wrap the parent list in `memo` for full effect)." }
    ]},
    mistakes: [
      { bad: `<CartContext value={{ items, add }}>`, good: `const value = useMemo(\n  () => ({ items, add }), [items, add]\n);\n<CartContext value={value}>`, why: "An inline object is new every render, so all consumers re-render even if nothing changed." },
      { bad: `<ThemeContext value={{ theme, mouseX, mouseY }}>`, good: `// fast-changing data in a store\nconst x = useMouseStore(s => s.x);`, why: "Context has no selectors: every mouse move re-renders every theme consumer." }
    ],
    practice: [
      { level: "B", q: "Why does `memo(Child)` still re-render when it calls `useContext(Ctx)`?", a: "`memo` only skips for unchanged props. A context change always re-renders its readers." },
      { level: "I", q: "Memoize an `AuthContext` value of `{ user, login, logout }`.", a: "Wrap `login`/`logout` in `useCallback`, then `useMemo(() => ({ user, login, logout }), [user, login, logout])`." },
      { level: "I", q: "Find the waste: a big `ProductPage` reads `useCart()` just to show a badge.", a: "The whole page re-renders on cart changes. Move the read into a small `<CartBadge />`." },
      { level: "C", q: "A chat app context holds `messages` (updates every second) and `currentUser`. Redesign.", a: "Split into `UserContext` and a messages store with selectors (Zustand or `useSyncExternalStore`), so the header doesn't re-render per message." }
    ],
    quiz: [
      { q: "How does React decide a context value changed?", options: ["Deep equality", "`Object.is` on the value", "JSON comparison"], answer: 1, why: "Same as state: reference identity. A new object always counts as changed." },
      { q: "A `memo` component reads a context that changes. Does it re-render?", options: ["No, memo blocks it", "Yes"], answer: 1, why: "Context updates bypass `memo`." },
      { q: "Best tool for state that changes 60 times a second and is read by a few components?", options: ["One big context", "A store with selectors", "Prop drilling"], answer: 1, why: "Selectors let each component subscribe only to the slice it needs." }
    ],
    rev: {
      sec30: "Every consumer re-renders when a context value changes, compared by `Object.is`; `memo` doesn't help. Fixes: memoize the value (or let the React Compiler do it), split state from actions and fast from slow data, read context in small leaves, and move high-frequency shared state to a store with selectors.",
      interview: [
        { level: "basic", q: "Why can context cause performance issues?", a: "All consumers re-render whenever the value changes, and an inline object value changes every render." },
        { level: "intermediate", q: "How do you stop needless re-renders from a provider?", a: "Memoize the value with `useMemo`/`useCallback` and split state from actions into separate contexts." },
        { level: "advanced", q: "Why do stores like Zustand scale better than context?", a: "They use `useSyncExternalStore` with selectors: a component re-renders only when its selected slice changes. Context has no selectors." },
        { level: "tricky", q: "Does `memo` on a consumer prevent context re-renders?", a: "No. `memo` checks props only; a changed context re-renders the reader anyway." },
        { level: "advanced", q: "Does the React Compiler fix context performance?", a: "Partly: it memoizes an inline `value={{...}}` so it only changes when its inputs do. It can't add selectors, so splitting contexts still matters." }
      ],
      debug: [
        { code: `function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;\n}`, fix: `function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const value = useMemo(() => ({ user, setUser }), [user]);\n  return <AuthContext value={value}>{children}</AuthContext>;\n}`, why: "Stable value: consumers re-render only when `user` changes, not on every provider render." }
      ],
      cheat: [
        "All consumers re-render on value change (`Object.is`)",
        "Inline `{{...}}` value = new object every render",
        "`useMemo` the value, `useCallback` the functions",
        "Split state vs actions into two contexts",
        "Read context in small leaf components",
        "`memo` doesn't block context updates",
        "High-frequency shared state → store with selectors"
      ]
    },
    related: ["PERF-018", "COMM-007", "STORE-017", "RENDER-019"]
  },

  "COMM-009": {
    tldr: "**Compound components** are a family of parts used together, like `<Tabs>`, `<Tabs.Tab>`, `<Tabs.Panel>`. The parent holds the shared state and passes it to the parts through context, so users never wire it up.",
    analogy: { icon: "🎛️", text: "A music playlist app's play controls. Play, Next and the progress bar are separate buttons, but they share one hidden player. You just place them; they already know about each other." },
    visual: { type: "tree", title: "Implicit state through context", root: {
      label: "<Tabs>", note: "owns `active` + provides context", children: [
        { label: "<Tabs.Tab value=\"ingredients\">", note: "reads + sets `active`" },
        { label: "<Tabs.Tab value=\"steps\">", note: "reads + sets `active`" },
        { label: "<Tabs.Panel value=\"ingredients\">", note: "shows if active" },
        { label: "<Tabs.Panel value=\"steps\">", note: "hidden" }
      ]
    }},
    points: [
      "The user composes **parts** freely; the parent's state is **implicit** (no props wiring).",
      "Shared state travels through a **private context** created by the parent.",
      "Attach parts as statics (`Tabs.Tab = Tab`) or export them by name.",
      "Guard parts with a hook that throws if used outside the parent.",
      "Real examples: `<select>/<option>`, Radix UI, Headless UI, React Aria."
    ],
    code: { file: "Tabs.jsx", lang: "jsx", src: `import { createContext, use, useState } from 'react';

const TabsContext = createContext(null);

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
}

export function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}

function Tab({ value, children }) {
  const { active, setActive } = useTabs();
  return (
    <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>
      {children}
    </button>
  );
}

function Panel({ value, children }) {
  const { active } = useTabs();
  return active === value ? <div role="tabpanel">{children}</div> : null;
}

Tabs.Tab = Tab;
Tabs.Panel = Panel;

export default function RecipeTabs() {
  return (
    <Tabs defaultValue="ingredients">
      <Tabs.Tab value="ingredients">Ingredients</Tabs.Tab>
      <Tabs.Tab value="steps">Steps</Tabs.Tab>
      <Tabs.Panel value="ingredients">Flour, eggs, milk</Tabs.Panel>
      <Tabs.Panel value="steps">Mix, rest, fry</Tabs.Panel>
    </Tabs>
  );
}`, walk: [
      { lines: [3], note: "A private context, not exported. Only the parts can read it." },
      { lines: [5, 6, 7, 8, 9], note: "Guard hook: a clear error if someone uses a `Tab` on its own." },
      { lines: [11, 12, 13, 14], note: "The parent owns `active` and shares it with any descendant." },
      { lines: [17, 19], note: "Each `Tab` reads and sets the shared state. No props from the user." },
      { lines: [30, 31], note: "Attach parts as statics for the `Tabs.Tab` API." },
      { lines: [35, 36, 37, 38, 39, 40], note: "Users just arrange parts in any order or layout." }
    ]},
    output: "Two tab buttons; “Flour, eggs, milk” shows. Click Steps: “Mix, rest, fry”.",
    mistakes: [
      { bad: `{React.Children.map(children, child =>\n  cloneElement(child, { active }))}`, good: `<TabsContext value={{ active, setActive }}>\n  {children}\n</TabsContext>`, why: "`cloneElement` only reaches direct children and breaks if a part is wrapped in a `div`. Context reaches any depth." },
      { bad: `export const TabsContext = createContext(null);`, good: `const TabsContext = createContext(null);\n// export only Tabs, Tab, Panel`, why: "Exporting the context leaks internals; keep the public API to the parts." }
    ],
    practice: [
      { level: "B", q: "Add a third tab, “Nutrition”.", a: "Add one `<Tabs.Tab value=\"nutrition\">` and one matching `<Tabs.Panel>`. No other changes." },
      { level: "I", q: "Build `<Accordion>` with `<Accordion.Item>`, `.Header`, `.Body`, where only one item opens.", a: "Accordion context holds `openId`; Item provides its own `id` via a second context; Header toggles, Body renders if open." },
      { level: "I", q: "Group the tab buttons in a `<Tabs.List>` with `role=\"tablist\"`.", a: "`function List({ children }) { return <div role=\"tablist\">{children}</div>; }` Context still reaches the tabs inside." },
      { level: "C", q: "Let the parent control `Tabs` (pass `value` + `onChange`).", a: "Support both modes: use `value` if given, else internal state; call `onChange` on every switch (see COMM-010)." }
    ],
    quiz: [
      { q: "How do compound parts share state?", options: ["Global variables", "Through a context provided by the parent", "Each part has its own copy"], answer: 1, why: "Context lets parts at any depth read the parent's state implicitly." },
      { q: "Why prefer context over `cloneElement` here?", options: ["It's faster to type", "It works when parts are nested inside other elements", "cloneElement was removed"], answer: 1, why: "`cloneElement` only touches direct children." },
      { q: "Which HTML pair is a native compound component?", options: ["`<div>` / `<span>`", "`<select>` / `<option>`", "`<img>` / `<a>`"], answer: 1, why: "`<option>`s share the parent `<select>`'s selected value." }
    ],
    rev: {
      sec30: "Compound components: a parent plus parts (`Tabs`, `Tabs.Tab`, `Tabs.Panel`) that share implicit state through a private context. Users compose parts freely without wiring props. Use a guard hook to throw outside the parent; prefer context over `cloneElement`. Seen in Radix, Headless UI, `<select>`.",
      interview: [
        { level: "basic", q: "What is the compound components pattern?", a: "A set of components that work together, where the parent owns state and the children read it implicitly, like `<select>` and `<option>`." },
        { level: "intermediate", q: "How do you implement it?", a: "The parent creates state and provides it via a private context; each part reads it with `useContext`/`use`. Attach parts as statics or named exports." },
        { level: "advanced", q: "Why not `React.Children.map` + `cloneElement`?", a: "It only reaches direct children, breaks with wrappers or fragments, and is fragile. React docs list it as a legacy approach; context is preferred." },
        { level: "advanced", q: "What are the benefits over a config prop like `tabs={[...]}`?", a: "Flexible layout and markup, no giant prop API, and users can insert any element between parts." },
        { level: "tricky", q: "What happens if someone renders `<Tabs.Tab>` outside `<Tabs>`?", a: "Context is `null`. Without a guard it crashes on destructuring; with a guard it throws a clear error." }
      ],
      cheat: [
        "Parent owns state, parts read it implicitly",
        "Share via a private (unexported) context",
        "`Tabs.Tab = Tab` for dot-notation API",
        "Guard hook throws outside the parent",
        "Context > `cloneElement` (any depth)",
        "Used by Radix, Headless UI, React Aria"
      ]
    },
    related: ["ADV-010", "COMM-006", "COMM-010", "COMM-013"]
  },

  "COMM-010": {
    tldr: "A **controlled** component gets its value from props and reports changes up. An **uncontrolled** one keeps its own state. Good reusable components support both: `value` + `onChange` or `defaultValue`.",
    analogy: { icon: "🌡️", text: "A thermostat. In manual mode you set it yourself on the wall (uncontrolled). Linked to a phone app, the app decides and the wall just shows it (controlled)." },
    visual: { type: "compare", title: "Who owns the value?", left: { label: "Uncontrolled", tone: "neutral", points: [
      "Component keeps its own state",
      "Parent sets only the start: `defaultValue`",
      "Parent can't reset or change it later",
      "Less code; great for simple cases"
    ]}, right: { label: "Controlled", tone: "neutral", points: [
      "Parent owns the value: `value` prop",
      "Changes reported via `onChange`",
      "Parent can reset, validate, sync",
      "Single source of truth"
    ]}},
    points: [
      "Same idea as inputs: `<input value onChange>` vs `<input defaultValue>`.",
      "Support both: if `value !== undefined`, you're **controlled**; otherwise use internal state from `defaultValue`.",
      "Always call `onChange`, in both modes, so parents can listen.",
      "Don't switch modes during a component's life (React warns for inputs).",
      "`value` without `onChange` = frozen UI. Read-only? say so (`readOnly`)."
    ],
    code: { file: "StarRating.jsx", lang: "jsx", src: `import { useState } from 'react';

function useControllable({ value, defaultValue, onChange }) {
  const [inner, setInner] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : inner;

  function setValue(next) {
    if (!isControlled) setInner(next);
    onChange?.(next);
  }
  return [current, setValue];
}

export function StarRating({ value, defaultValue = 0, onChange }) {
  const [stars, setStars] = useControllable({ value, defaultValue, onChange });
  return (
    <div>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => setStars(n)}>
          {n <= stars ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [rating, setRating] = useState(3);
  return (
    <>
      {/* Uncontrolled: manages itself */}
      <StarRating defaultValue={2} />
      {/* Controlled: parent owns the value */}
      <StarRating value={rating} onChange={setRating} />
      <p>Parent sees: {rating}</p>
    </>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "Internal state as backup. If `value` is passed, it wins: controlled mode." },
      { lines: [8, 9, 10, 11], note: "Update internal state only when uncontrolled; always notify the parent." },
      { lines: [16], note: "The component itself doesn't care which mode it's in." },
      { lines: [33], note: "Uncontrolled: starts at 2 and manages itself." },
      { lines: [35, 36], note: "Controlled: the parent's state is the truth and stays in sync." }
    ]},
    output: "Two rows of stars. Clicking the second row updates “Parent sees: N”.",
    mistakes: [
      { bad: `<StarRating value={3} />`, good: `<StarRating value={rating} onChange={setRating} />`, why: "Controlled without `onChange`: clicks fire but the parent never updates, so the stars never move." },
      { bad: `function Rating({ value }) {\n  const [v, setV] = useState(value);\n}`, good: `// controlled: use value directly\n// or name it defaultValue`, why: "State copies the first `value` and ignores later changes. Name it `defaultValue` or read the prop." }
    ],
    practice: [
      { level: "B", q: "Make a search input uncontrolled and read its value on submit.", a: "`<input name=\"q\" defaultValue=\"\" />` and read `new FormData(e.target).get('q')`." },
      { level: "I", q: "Add a parent **Reset** button for the controlled rating.", a: "`<button onClick={() => setRating(0)}>Reset</button>`. Only possible because it's controlled." },
      { level: "I", q: "Turn a `Toggle` switch into a dual-mode component with `checked`/`defaultChecked`/`onChange`.", a: "Same `useControllable` hook with `value: checked`, `defaultValue: defaultChecked`." },
      { level: "C", q: "Why is `value !== undefined` better than `'value' in props`?", a: "A wrapper often forwards `value={undefined}` when it isn't controlling. `'value' in props` would wrongly treat that as controlled. Keep the mode fixed for the whole lifetime." }
    ],
    quiz: [
      { q: "What makes a component controlled?", options: ["It uses `useRef`", "Its value comes from a prop owned by the parent", "It has no state at all"], answer: 1, why: "Controlled = the parent is the source of truth." },
      { q: "`<input value=\"hi\" />` with no `onChange`. What happens?", options: ["User can type freely", "Input is stuck at “hi” and React warns", "It becomes uncontrolled"], answer: 1, why: "React keeps resetting it to the controlled value." },
      { q: "In a dual-mode component, when should you call `onChange`?", options: ["Only when controlled", "Only when uncontrolled", "In both modes"], answer: 2, why: "Parents may listen even without controlling the value." }
    ],
    rev: {
      sec30: "Controlled: the parent owns the value (`value` + `onChange`). Uncontrolled: the component owns it (`defaultValue`). Reusable components support both: if `value` is defined use it, otherwise internal state; always call `onChange`. Don't switch modes mid-life; never pass `value` without `onChange`.",
      interview: [
        { level: "basic", q: "Controlled vs uncontrolled input?", a: "Controlled: React state drives `value` and `onChange` updates it. Uncontrolled: the DOM keeps the value; you read it with a ref or `FormData`." },
        { level: "intermediate", q: "When choose uncontrolled?", a: "Simple forms read on submit, file inputs, or when performance matters for huge forms. React 19 form actions work well with uncontrolled inputs." },
        { level: "advanced", q: "How do you design a component that supports both modes?", a: "Accept `value`, `defaultValue` and `onChange`. If `value !== undefined` use it, else internal state seeded from `defaultValue`. Always call `onChange`." },
        { level: "tricky", q: "Why does React warn about switching from uncontrolled to controlled?", a: "Usually `value` starts `undefined` then becomes a string. Ownership changes mid-life; initialise with `''` instead." }
      ],
      predict: [
        { code: `const [name, setName] = useState();\n<input value={name} onChange={e => setName(e.target.value)} />`, answer: "Works, but React warns: uncontrolled → controlled after first keystroke", why: "`undefined` starts it uncontrolled. Use `useState('')`." }
      ],
      cheat: [
        "Controlled: `value` + `onChange` (parent owns it)",
        "Uncontrolled: `defaultValue` (component owns it)",
        "Dual mode: `value !== undefined` → controlled",
        "Always call `onChange` in both modes",
        "Don't switch modes; start with `''` not `undefined`",
        "`value` without `onChange` = frozen field"
      ]
    },
    related: ["ADV-011", "ADV-012", "COMM-005", "COMM-009"]
  },

  "COMM-011": {
    tldr: "A **render prop** is a function prop that returns JSX. The component handles the behaviour (hover, data, sorting) and calls your function so **you** decide what it looks like.",
    analogy: { icon: "🍕", text: "A pizza shop that bakes the base and lets you choose the toppings. The shop does the hard part; you call the shots on how it ends up." },
    visual: { type: "flow", title: "Behaviour in, markup out", steps: [
      { label: "Component owns logic", detail: "`Hoverable` tracks `hovered` with state + mouse events." },
      { label: "Calls your function", detail: "It renders `children(hovered)` instead of fixed markup." },
      { label: "You return JSX", detail: "`{hovered => <p>{hovered ? '▶ Play' : 'Hover me'}</p>}`" },
      { label: "Re-render on change", detail: "State changes, React calls your function again with the new value." }
    ]},
    points: [
      "Two styles: a named prop (`renderItem={item => ...}`) or **children as a function**.",
      "Splits **what it does** (component) from **how it looks** (caller).",
      "Today most behaviour-sharing is done with **custom hooks**; render props are less common.",
      "Still great for **list/item rendering** (`renderItem`, virtual lists) and libraries.",
      "Too many nested render props = callback pyramid. Reach for a hook instead."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function Hoverable({ children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children(hovered)}
    </div>
  );
}

function List({ items, renderItem }) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}

const songs = [
  { id: 1, title: 'Sunrise' },
  { id: 2, title: 'Night drive' },
];

export default function App() {
  return (
    <>
      <Hoverable>
        {hovered => <p>{hovered ? '▶ Play preview' : 'Hover me'}</p>}
      </Hoverable>
      <List items={songs} renderItem={song => <b>🎵 {song.title}</b>} />
    </>
  );
}`, walk: [
      { lines: [4, 7, 8], note: "The behaviour: hover tracking lives here, once." },
      { lines: [10], note: "Instead of fixed JSX, call the caller's function with the current value." },
      { lines: [15, 16, 17], note: "`List` handles looping and keys; `renderItem` decides each row's look." },
      { lines: [27, 28, 29], note: "Children as a function: you get `hovered` and return any markup." },
      { lines: [30], note: "Named render prop: same list, any item design." }
    ]},
    output: "“Hover me” turns into “▶ Play preview” on hover. Below: 🎵 Sunrise, 🎵 Night drive.",
    mistakes: [
      { bad: `<Hoverable>\n  <p>Hover me</p>\n</Hoverable>`, good: `<Hoverable>\n  {hovered => <p>{hovered ? 'Hi' : 'Hover me'}</p>}\n</Hoverable>`, why: "`Hoverable` calls `children(...)`. Passing JSX instead of a function crashes: “children is not a function”." },
      { bad: `<Mouse>{p => <Theme>{t => <Auth>{u => ...}</Auth>}</Theme>}</Mouse>`, good: `const p = useMouse();\nconst t = useTheme();\nconst u = useAuth();`, why: "Nested render props become a pyramid. Hooks share the same logic flat." }
    ],
    practice: [
      { level: "B", q: "Change `List` so an empty array shows a custom message via `renderEmpty`.", a: "`if (!items.length) return renderEmpty();`" },
      { level: "I", q: "Rewrite `Hoverable` as a `useHover()` hook.", a: "Return `[hovered, { onMouseEnter, onMouseLeave }]` and spread the handlers on any element.", code: `function useHover() {\n  const [hovered, setHovered] = useState(false);\n  return [hovered, {\n    onMouseEnter: () => setHovered(true),\n    onMouseLeave: () => setHovered(false),\n  }];\n}` },
      { level: "I", q: "Build `<Fetch url>{({ data, loading }) => ...}</Fetch>` for a weather API.", a: "State for `data`/`loading`, `useEffect` fetches `url`, render `children({ data, loading })`." },
      { level: "C", q: "When would you still pick a render prop over a hook?", a: "When the component must also own markup or position (a list, virtualized grid, or a portal) and only part of the rendering is customised." }
    ],
    quiz: [
      { q: "What is a render prop?", options: ["A prop holding a component class", "A function prop that returns JSX", "A prop named `render` only"], answer: 1, why: "Any function prop used to render is a render prop; the name doesn't matter." },
      { q: "What largely replaced render props for sharing logic?", options: ["HOCs", "Custom hooks", "Class components"], answer: 1, why: "Hooks share stateful logic without changing the tree." },
      { q: "Where are render props still common?", options: ["`renderItem` in list components", "Defining state", "Routing config only"], answer: 0, why: "The list owns iteration; the caller owns item markup." }
    ],
    rev: {
      sec30: "A render prop is a function prop (`renderItem`, or children-as-function) that the component calls with its internal data to get JSX. It separates behaviour from markup. Custom hooks now cover most logic sharing; render props remain useful for lists and components that own layout but let you customise parts.",
      interview: [
        { level: "basic", q: "What is the render props pattern?", a: "Passing a function that returns JSX; the component calls it with its own state so the caller decides the UI." },
        { level: "intermediate", q: "Render props vs custom hooks?", a: "Hooks share logic without extra components or nesting. Render props are better when the component also controls structure, like lists." },
        { level: "advanced", q: "Downsides of render props?", a: "Callback nesting pyramids, an extra component layer, and inline functions that defeat `memo` on the child." },
        { level: "tricky", q: "Is `children` as a function a render prop?", a: "Yes. `children` is just a prop; when it's a function the component calls it." }
      ],
      compare: { cols: ["", "Render prop", "Custom hook"], rows: [
        ["Shares", "Logic + some markup", "Logic only"],
        ["Tree", "Adds a component", "No extra component"],
        ["Nesting", "Can pyramid", "Flat calls"],
        ["Best for", "Lists, layout owners", "Most logic reuse"]
      ]},
      cheat: [
        "Render prop = function prop returning JSX",
        "`renderItem={x => ...}` or `{value => ...}` children",
        "Component: behaviour. Caller: markup",
        "Hooks replaced most use cases",
        "Still great for lists and virtualized grids",
        "Nested render props → switch to hooks"
      ]
    },
    related: ["ADV-009", "PROPS-008", "HOOKS-021", "COMM-012"]
  },

  "COMM-012": {
    tldr: "A **higher-order component (HOC)** is a function that takes a component and returns a new one with extra behaviour: `withLoading(WeatherCard)`. Useful to know, but hooks are the modern default.",
    analogy: { icon: "🎁", text: "Gift wrapping. The gift (component) stays the same; the wrapper adds a bow and a tag (loading, auth checks) on the outside." },
    visual: { type: "layers", title: "A HOC wraps from the outside", items: [
      { label: "withAuth(...)", detail: "Outer wrapper: shows “Please log in” if no user." },
      { label: "withLoading(...)", detail: "Shows a spinner while `isLoading` is true." },
      { label: "WeatherCard", detail: "The original component. Unaware it was wrapped." }
    ]},
    points: [
      "Shape: `const Enhanced = withX(Component)`. A function, not a component.",
      "Pass through all other props with `{...rest}`.",
      "Create HOCs **outside** components. Inside render = new type each time = state reset.",
      "Set `displayName` so DevTools shows `withLoading(WeatherCard)`.",
      "Drawbacks: wrapper nesting, hidden props, name collisions. Prefer **custom hooks** for logic."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function withLoading(Component) {
  function WithLoading({ isLoading, ...rest }) {
    if (isLoading) return <p>⏳ Loading...</p>;
    return <Component {...rest} />;
  }
  WithLoading.displayName = \`withLoading(\${Component.displayName || Component.name})\`;
  return WithLoading;
}

function WeatherCard({ city, temp }) {
  return <p>{city}: {temp}°C</p>;
}

const WeatherCardWithLoading = withLoading(WeatherCard);

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <WeatherCardWithLoading isLoading={loading} city="Paris" temp={18} />
      <button onClick={() => setLoading(l => !l)}>Toggle</button>
    </>
  );
}`, walk: [
      { lines: [3], note: "A HOC is a plain function: component in, component out." },
      { lines: [4, 5, 6], note: "Takes its own prop (`isLoading`), forwards the rest untouched." },
      { lines: [8], note: "A readable name in React DevTools." },
      { lines: [16], note: "Wrap once at module level, never inside a component." },
      { lines: [22], note: "Use it like any component. `city` and `temp` pass through." }
    ]},
    output: "“⏳ Loading...”. Click Toggle: “Paris: 18°C”.",
    mistakes: [
      { bad: `function Page() {\n  const Card = withLoading(WeatherCard);\n  return <Card />;\n}`, good: `const Card = withLoading(WeatherCard);\nfunction Page() {\n  return <Card />;\n}`, why: "Inside render, each call makes a new component type, so React unmounts and remounts it every render, losing state." },
      { bad: `function WithLoading({ isLoading }) {\n  return <Component />;\n}`, good: `function WithLoading({ isLoading, ...rest }) {\n  return <Component {...rest} />;\n}`, why: "Forgetting to forward props silently drops everything the wrapped component needs." }
    ],
    practice: [
      { level: "B", q: "Write `withBorder(Component)` that wraps output in a styled `div`.", a: "`return props => <div className=\"border\"><Component {...props} /></div>;` (add a displayName)." },
      { level: "I", q: "Write `withAuth` that shows “Please log in” when `useAuth().user` is null.", a: "Call the hook inside the returned component, then render the fallback or `<Component {...props} />`." },
      { level: "I", q: "Replace `withLoading` with a hook-based approach.", a: "Fetch with a hook (`useWeather()` or TanStack Query) and do `if (isLoading) return <Spinner />` inside the component." },
      { level: "C", q: "Two HOCs both inject a `data` prop. What goes wrong?", a: "The outer one's `data` is overwritten by the inner one (prop collision). Hooks avoid this because you name each result." }
    ],
    quiz: [
      { q: "What is a HOC?", options: ["A component with many children", "A function that takes a component and returns a new one", "A hook that returns JSX"], answer: 1, why: "Like a decorator in C#: it wraps without editing the original." },
      { q: "Why must HOCs not be applied inside render?", options: ["Syntax error", "A new component type each render causes remounts and lost state", "Hooks can't run"], answer: 1, why: "React compares types by reference; a new type means a new subtree." },
      { q: "Main modern replacement for HOCs?", options: ["Custom hooks", "Class components", "Portals"], answer: 0, why: "Hooks share logic without wrapper layers or prop collisions." }
    ],
    rev: {
      sec30: "A HOC is `withX(Component)`: a function returning a new component that adds behaviour (auth gate, loading, tracking) and forwards other props. Apply at module level, set `displayName`. Drawbacks: wrapper hell, hidden and colliding props. Custom hooks are the modern default; HOCs remain in older code and some libraries.",
      interview: [
        { level: "basic", q: "What is a higher-order component?", a: "A function that takes a component and returns an enhanced component, like `withAuth(Profile)`." },
        { level: "intermediate", q: "What are the drawbacks of HOCs?", a: "Deep wrapper trees, implicit props you can't see at the call site, prop name collisions, and remount bugs if created in render." },
        { level: "intermediate", q: "Why did hooks replace most HOCs?", a: "Hooks share stateful logic inside the component with explicit names, no extra tree layers, and better TypeScript inference." },
        { level: "advanced", q: "Do refs pass through a HOC in React 19?", a: "Yes, `ref` is now a normal prop for function components, so `{...rest}` forwards it. Before 19 you needed `forwardRef`." },
        { level: "tricky", q: "Where might you still write a HOC today?", a: "Cross-cutting wrappers applied to many route components (auth gate, error boundary wrapper, analytics), or when integrating legacy class components." }
      ],
      compare: { cols: ["", "HOC", "Custom hook"], rows: [
        ["Form", "`withX(Comp)`", "`useX()`"],
        ["Tree", "Adds wrapper layers", "No extra layers"],
        ["Data visible?", "Hidden props", "Named variables"],
        ["Collisions", "Possible", "None"]
      ]},
      cheat: [
        "HOC = function(Component) → new Component",
        "Forward props: `{...rest}`",
        "Apply at module level, never in render",
        "Set `displayName` for DevTools",
        "Drawbacks: wrapper hell, hidden/colliding props",
        "Prefer custom hooks for logic reuse"
      ]
    },
    related: ["ADV-008", "COMM-011", "HOOKS-023", "COMM-013"]
  },

  "COMM-013": {
    tldr: "Composition means building components by **plugging pieces together**. Pick the lightest tool: `children` for one hole, slots for several, compound components for related parts, custom hooks to share logic only.",
    analogy: { icon: "🥪", text: "A sandwich bar. The bread is the layout (`children`), named fillings go in set places (slots), a combo meal has parts that belong together (compound), and the recipe card is reusable know-how (hook)." },
    visual: { type: "flow", title: "Which pattern? Ask in order", steps: [
      { label: "One area of content?", detail: "Use `children`: `<Card>...</Card>`." },
      { label: "Several named areas?", detail: "Use **slots** (JSX props): `<Page header={...} sidebar={...}>`." },
      { label: "Parts sharing state?", detail: "Use **compound components**: `<Tabs>` + `<Tabs.Tab>` via context." },
      { label: "Only logic to share?", detail: "Use a **custom hook**: `useToggle()`, the caller writes the markup." },
      { label: "Caller renders your data?", detail: "Use a **render prop**: `renderItem={item => ...}`." }
    ]},
    points: [
      "Prefer **composition over inheritance**. React never needs class inheritance for UI.",
      "Slots are just props holding JSX: `header={<h1>Notes</h1>}`.",
      "Composition also **cuts drilling**: the parent builds the deep element itself.",
      "Hooks share **behaviour**; components share **UI**. Don't mix the jobs.",
      "HOCs and render props still exist but are rarely the first choice today."
    ],
    code: { file: "NotesApp.jsx", lang: "jsx", src: `import { useState } from 'react';

// 1. children: one hole for content
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// 2. slots: several named holes
function Page({ header, sidebar, children }) {
  return (
    <div className="page">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

// 3. custom hook: share logic, caller owns the markup
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn(o => !o)];
}

export default function NotesApp() {
  const [showDone, toggleDone] = useToggle();
  return (
    <Page
      header={<h1>📝 Notes</h1>}
      sidebar={<button onClick={toggleDone}>{showDone ? 'Hide' : 'Show'} done</button>}
    >
      <Card>Buy milk</Card>
      {showDone && <Card>✅ Call mum</Card>}
    </Page>
  );
}`, walk: [
      { lines: [4, 5], note: "`Card` doesn't know what it holds: any content fits." },
      { lines: [9, 12, 13, 14], note: "`Page` has three named holes. Each is just a prop with JSX." },
      { lines: [20, 21, 22], note: "Logic only, no UI. Any component can reuse it." },
      { lines: [29, 30], note: "Fill the slots with any elements you like." },
      { lines: [32, 33], note: "Everything between the tags becomes `children`." }
    ]},
    output: "A page with a “📝 Notes” header, a “Show done” button and a “Buy milk” card. Clicking reveals “✅ Call mum”.",
    mistakes: [
      { bad: `<Page title="Notes" showSearch showAvatar avatarSize="sm" />`, good: `<Page header={<Header><Search /><Avatar size="sm" /></Header>} />`, why: "Boolean/config props for every variation explode. Let callers pass the elements (slots)." },
      { bad: `function useCardUI() {\n  return <div className="card">...</div>;\n}`, good: `function Card({ children }) {\n  return <div className="card">{children}</div>;\n}`, why: "Hooks returning JSX lose component identity and props. Use components for UI, hooks for logic." }
    ],
    practice: [
      { level: "B", q: "Add a `footer` slot to `Page`.", a: "Accept `footer` and render `<footer>{footer}</footer>`." },
      { level: "I", q: "A `Modal` needs a title, body and action buttons. Which pattern?", a: "Slots (`title`, `actions`) plus `children` for the body. Compound (`Modal.Title`) works if parts need shared state like `close`." },
      { level: "I", q: "Several components need online/offline status. Which pattern?", a: "A custom hook `useOnlineStatus()`. It's logic only; each component renders its own UI." },
      { level: "C", q: "Pick a pattern for: (a) a weather widget frame, (b) a `<Select>` with `<Option>`s, (c) debounced search logic.", a: "(a) `children`, (b) compound components, (c) custom hook `useDebounce`." }
    ],
    quiz: [
      { q: "You need a layout with header, sidebar and main content areas. Best pattern?", options: ["HOC", "Slots (JSX props) + children", "Inheritance"], answer: 1, why: "Named JSX props map directly to named areas." },
      { q: "You only need to share stateful logic, not UI. Best pattern?", options: ["Custom hook", "Compound components", "children"], answer: 0, why: "Hooks share logic without adding components." },
      { q: "React recommends for code reuse between components...", options: ["Class inheritance", "Composition", "Global mixins"], answer: 1, why: "Composition (props, children, hooks) covers every case inheritance would." }
    ],
    rev: {
      sec30: "Composition over inheritance. Choose the lightest pattern: `children` for one content area, slots (JSX props) for several, compound components for parts sharing state, custom hooks for logic only, render props when the caller renders your data. Composition also removes prop drilling.",
      interview: [
        { level: "basic", q: "What is component composition?", a: "Building UIs by combining components and passing elements through `children` or props, instead of inheritance." },
        { level: "intermediate", q: "What is a slot in React?", a: "A prop that holds JSX, like `header={<Title />}`. React has no special slot syntax; any prop can carry elements." },
        { level: "advanced", q: "How do you choose between compound components and slots?", a: "Slots for fixed, independent areas. Compound when parts are many, repeatable and need shared state (tabs, accordions, menus)." },
        { level: "advanced", q: "Hooks vs components for reuse?", a: "Hooks reuse behaviour (state, effects); components reuse UI. Combine: a headless hook plus a styled component." },
        { level: "tricky", q: "Why doesn't React use inheritance for components?", a: "Composition handles every case more flexibly: specialise by passing props, wrap by passing children. React docs found no use case needing inheritance." }
      ],
      compare: { cols: ["", "Use when", "Example"], rows: [
        ["children", "One content area", "`<Card>`"],
        ["Slots", "Several named areas", "`<Page header sidebar>`"],
        ["Compound", "Parts share state", "`<Tabs.Tab>`"],
        ["Custom hook", "Logic only", "`useToggle()`"],
        ["Render prop", "Caller renders your data", "`renderItem`"]
      ]},
      cheat: [
        "Composition over inheritance",
        "`children` = one hole; slots = named JSX props",
        "Compound = parts + shared context",
        "Hooks share logic; components share UI",
        "Render props for caller-drawn items",
        "Composition also fixes prop drilling"
      ]
    },
    related: ["PROPS-010", "PROPS-009", "COMM-009", "COMM-004"]
  }
};
