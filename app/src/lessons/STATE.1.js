export default {
  "STATE-001": {
    tldr: "State (component memory) is data a component remembers between renders, like whether a song is liked. Change it and React redraws that part of the screen.",
    analogy: { icon: "🎵", text: "The heart icon on a playlist song. The app remembers you tapped it, and the icon stays red until you tap again. That remembered fact is state." },
    visual: { type: "cycle", title: "UI = f(state)", steps: [
      { label: "State", detail: "The component remembers `liked = false`." },
      { label: "Render", detail: "React calls the component; it returns UI that reads state: 🤍 Like." },
      { label: "Event", detail: "User taps the heart; the handler calls `setLiked(true)`." },
      { label: "New state", detail: "React stores `true` and renders again: ❤️ Liked." }
    ]},
    points: [
      "State is data that **changes over time** and **affects what you see**: liked, cart count, search text, open/closed.",
      "The screen is a function of state (**UI = f(state)**). You change state; React works out the screen.",
      "State lives **with the component instance**: two `<SongRow />`s each remember their own `liked`.",
      "If a value never changes, or can be calculated from props/other state, it is **not** state.",
      "In .NET terms: closer to a field on an object than a local variable, but you never assign it directly."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function SongRow({ title }) {
  const [liked, setLiked] = useState(false);

  return (
    <li>
      {title}
      <button onClick={() => setLiked(!liked)}>
        {liked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </li>
  );
}

export default function App() {
  return (
    <ul>
      <SongRow title="Blinding Lights" />
      <SongRow title="Levitating" />
    </ul>
  );
}`, walk: [
      { lines: [4], note: "Ask React to remember `liked` for this row, starting at `false`." },
      { lines: [9], note: "Clicking flips the value via the setter. React re-renders this row." },
      { lines: [10], note: "The UI is just a description of the current state." },
      { lines: [19, 20], note: "Two instances, two separate memories. Liking one doesn't like the other." }
    ]},
    output: "Two songs, each with a 🤍 Like button. Clicking one turns only that row to ❤️ Liked.",
    mistakes: [
      { bad: `const [total, setTotal] = useState(price * qty);`, good: `const total = price * qty; // calculated each render`, why: "Values you can compute from props or other state aren't state. Storing them creates two sources of truth that drift apart." },
      { bad: `const [shopName] = useState('Bean Shop'); // never changes`, good: `const SHOP_NAME = 'Bean Shop';`, why: "Data that never changes is a constant, not state." }
    ],
    practice: [
      { level: "B", q: "List 3 pieces of state in a todo app.", a: "The list of todos, the text in the \"new todo\" box, and the current filter (all/active/done)." },
      { level: "B", q: "Is a todo's `id` state?", a: "No by itself. It's part of the todos array (state), but the id of a single item never changes." },
      { level: "I", q: "Cart has `items` and `itemCount`. Which should be state?", a: "Only `items`. `itemCount` is `items.length`, calculated during render." },
      { level: "C", q: "Add a \"Played 0 times\" counter to each `SongRow`.", a: "Add a second `useState(0)` and a Play button calling `setPlays(plays + 1)`.", code: `const [plays, setPlays] = useState(0);\n<button onClick={() => setPlays(plays + 1)}>▶ {plays}</button>` }
    ],
    quiz: [
      { q: "Which is best described as state?", options: ["The app's name", "Whether a dropdown is open", "A tax rate constant", "`items.length`"], answer: 1, why: "It changes over time because of the user and changes the screen. The others are constants or derived." },
      { q: "What does \"UI = f(state)\" mean?", options: ["You edit the DOM after each change", "The screen is calculated from the current state", "State is stored in the HTML"], answer: 1, why: "You describe the UI for a given state; React updates the DOM to match." },
      { q: "Two `<SongRow />` components share one `liked` value.", options: ["True", "False"], answer: 1, why: "Each instance gets its own state." }
    ],
    rev: {
      sec30: "State is a component's memory: data that changes over time and drives the UI. React keeps it between renders, per component instance. You change it through a setter, which makes React re-render. Constants and values computed from other data are not state.",
      interview: [
        { level: "basic", q: "What is state in React?", a: "Data a component remembers between renders that changes over time and affects the output, managed with hooks like `useState`." },
        { level: "basic", q: "Give examples of state.", a: "Form input text, whether a modal is open, the items in a cart, the selected tab." },
        { level: "intermediate", q: "How do you decide if something should be state?", a: "It must change over time and not be computable from props or other state. If it's passed from a parent and unchanged, it's a prop." },
        { level: "advanced", q: "Where does React actually keep state?", a: "Not in the function. React stores it on the component's node in its internal tree (fiber), tied to the component's position." },
        { level: "tricky", q: "Is a prop ever state?", a: "It's the parent's state seen from the child. The child receives it read-only; only the owner can change it." }
      ],
      cheat: [
        "State = memory that survives re-renders",
        "Changes over time + affects UI → state",
        "Never changes → constant; computable → derive it",
        "State is per component instance",
        "UI = f(state): change state, React updates the DOM"
      ]
    },
    related: ["STATE-003", "STATE-004", "PROPS-012"]
  },

  "STATE-002": {
    tldr: "Put state in the component that uses it. If only one product card needs to know it's expanded, that card owns the state, not the page.",
    analogy: { icon: "🛍️", text: "Each shopper holds their own basket. The shop doesn't need to know what's in it until checkout. Keep things where they're used." },
    visual: { type: "tree", title: "Who owns the state?", root: {
      label: "Shop", note: "no state: just lists products",
      children: [
        { label: "ProductCard (coffee)", note: "open = true", children: [ { label: "button" }, { label: "details <p>" } ] },
        { label: "ProductCard (tea)", note: "open = false", children: [ { label: "button" } ] }
      ]
    }},
    points: [
      "**Local state** (owned state) is declared inside the component that reads and changes it.",
      "Each instance gets **its own copy**: expanding one card doesn't expand the others.",
      "Local state is **private**: parents and siblings can't read it. Pass it down as props if a child needs it.",
      "Start local. Move it up only when **two siblings** need the same data (lifting state up).",
      "Local state keeps re-renders small: only the owning component and its children re-render."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useState } from 'react';

const products = [
  { id: 1, name: 'Coffee beans', info: 'Dark roast, 500 g' },
  { id: 2, name: 'Green tea', info: 'Loose leaf, 100 g' },
];

function ProductCard({ product }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <button onClick={() => setOpen(!open)}>
        {open ? 'Hide details' : 'Show details'}
      </button>
      {open && <p>{product.info}</p>}
    </div>
  );
}

export default function Shop() {
  return products.map(p => <ProductCard key={p.id} product={p} />);
}`, walk: [
      { lines: [9], note: "The card owns `open`. Nobody else needs it, so it lives here." },
      { lines: [14], note: "Only this card re-renders when its button is clicked." },
      { lines: [17], note: "Conditional rendering driven by local state." },
      { lines: [23], note: "`Shop` has no state: it just renders one card per product." }
    ]},
    output: "Two cards. Clicking \"Show details\" on Coffee beans reveals only its details.",
    mistakes: [
      { bad: `// Shop.jsx\nconst [openId, setOpenId] = useState(null);\n// passed to every card just to toggle details`, good: `// ProductCard.jsx\nconst [open, setOpen] = useState(false);`, why: "Hoisting state nobody else needs makes the parent re-render every card on each toggle and adds props for no reason." },
      { bad: `let open = false; // outside the component\nfunction ProductCard() { ... }`, good: `function ProductCard() {\n  const [open, setOpen] = useState(false);\n}`, why: "A module-level variable is shared by every instance and React doesn't re-render when it changes." }
    ],
    practice: [
      { level: "B", q: "Add a third product. Does it need new state code?", a: "No. Add it to `products`; each card instance gets its own `open` automatically." },
      { level: "I", q: "Add a \"♥ Save\" toggle to each card.", a: "A second local state in `ProductCard`: `const [saved, setSaved] = useState(false)`." },
      { level: "I", q: "The page header must show how many cards are open. Can `open` stay local?", a: "No. The parent now needs it, so lift it up (e.g. store open ids in `Shop`) and pass it down." },
      { level: "C", q: "Make it an accordion: only one card open at a time.", a: "Siblings must coordinate, so `Shop` owns `openId`; each card gets `isOpen={openId === p.id}` and `onToggle`." }
    ],
    quiz: [
      { q: "Where should a card's \"expanded\" flag live if nothing else uses it?", options: ["In the card", "In the root App", "In a global store", "In localStorage"], answer: 0, why: "Keep state in the lowest component that needs it." },
      { q: "Can a parent read a child's local state?", options: ["Yes, via `child.state`", "No, it must be lifted up or passed back with a callback", "Yes, with `this.props`"], answer: 1, why: "Local state is private to the instance." },
      { q: "When do you move local state up?", options: ["Always, to be safe", "When a sibling or parent also needs it", "When the component gets longer than 50 lines"], answer: 1, why: "Lift only when sharing is required." }
    ],
    rev: {
      sec30: "Local state lives in the component that uses it. It's private and per instance, so each card or row tracks itself. Start local and only lift state to a common parent when siblings must share it; this keeps components simple and re-renders cheap.",
      interview: [
        { level: "basic", q: "What is local component state?", a: "State declared with `useState` inside a component, private to each instance of it." },
        { level: "intermediate", q: "How do you decide where state should live?", a: "Find every component that reads it; put it in their closest common parent. If only one uses it, keep it there." },
        { level: "intermediate", q: "What happens to local state when the component unmounts?", a: "It's thrown away. Mount it again and it starts from the initial value." },
        { level: "advanced", q: "Why not put all state in a global store?", a: "Global state makes every change visible app-wide, causes wider re-renders and coupling. Most UI state (open, hover, draft text) is local." },
        { level: "tricky", q: "Can two instances of the same component share local state?", a: "No. Each instance has its own. To share, lift it up or use context/a store." }
      ],
      scenario: [
        { q: "A chat app has a message box. The send button and the typing indicator both need the draft text. Where does it live?", a: "In their closest common parent (e.g. `ChatInput`), passed down as props." }
      ],
      cheat: [
        "Keep state in the lowest component that needs it",
        "Local state is private and per instance",
        "Children get it via props; parents don't see it",
        "Siblings need it → lift to common parent",
        "Unmount = local state lost"
      ]
    },
    related: ["STATE-001", "STATE-021", "PROPS-013"]
  },

  "STATE-003": {
    tldr: "A normal variable can change, but React isn't told, so the screen doesn't update. And on the next render it resets anyway. State fixes both problems.",
    analogy: { icon: "📝", text: "Scribbling a new price on your own receipt doesn't change the shop's till. You have to tell the cashier (the setter) so they ring it up." },
    visual: { type: "flow", title: "What happens with `let items = 0`", steps: [
      { label: "Click", detail: "Handler runs `items = items + 1`." },
      { label: "Variable changes", detail: "`items` is now 1 in memory, but React has no idea." },
      { label: "No re-render", detail: "Nothing told React to redraw, so the screen still shows 0." },
      { label: "Something re-renders", detail: "The function runs again and `let items = 0` resets it." },
      { label: "Fix: useState", detail: "State survives renders and the setter tells React to redraw." }
    ]},
    points: [
      "Problem 1: changing a local variable **doesn't trigger a render**. React only redraws when state (or props/context) changes.",
      "Problem 2: a component is a function. Every render runs it again, so **local variables reset**.",
      "`useState` solves both: React **stores** the value outside the function and the setter **schedules a re-render**.",
      "Module-level variables (outside the component) survive, but they're **shared by every instance** and still don't re-render.",
      "Plain variables are still fine for values **calculated during render** (like `total = price * qty`)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function BrokenCart() {
  let items = 0;
  function add() {
    items = items + 1;
    console.log(items); // 1, 2, 3… but the screen stays 0
  }
  return <button onClick={add}>Broken: {items}</button>;
}

function WorkingCart() {
  const [items, setItems] = useState(0);
  return (
    <button onClick={() => setItems(items + 1)}>
      Working: {items}
    </button>
  );
}

export default function App() {
  return (
    <>
      <BrokenCart />
      <WorkingCart />
    </>
  );
}`, walk: [
      { lines: [4], note: "A plain variable, recreated as 0 on every render." },
      { lines: [6, 7], note: "It does change, and the log proves it, but React isn't notified." },
      { lines: [9], note: "The JSX was produced once with 0 and is never recalculated." },
      { lines: [13, 15], note: "State + setter: React keeps the value and re-renders on each click." }
    ]},
    output: "Broken: 0 never changes (console logs 1, 2, 3). Working: counts up 1, 2, 3 on screen.",
    mistakes: [
      { bad: `let count = 0;\nfunction Counter() {\n  return <button onClick={() => count++}>{count}</button>;\n}`, good: `function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}`, why: "A module variable survives but is shared by all counters and never causes a re-render." }
    ],
    practice: [
      { level: "B", q: "In `BrokenCart`, why does the console show 1, 2, 3?", a: "No re-render happens, so the same `add` function keeps updating the same `items` variable. React just never redraws." },
      { level: "I", q: "Make `BrokenCart` re-render by clicking a button in it that sets some state. What does `items` show?", a: "0. The re-render runs `let items = 0` again, so the old value is lost." },
      { level: "I", q: "Is `const label = items === 1 ? 'item' : 'items'` a problem?", a: "No. It's calculated from state during render; it's meant to be recomputed each time." },
      { level: "C", q: "Fix `BrokenCart` with the smallest change.", a: "Replace `let items = 0` with `const [items, setItems] = useState(0)` and call `setItems(items + 1)` in `add`." }
    ],
    quiz: [
      { q: "Why doesn't `items++` update the screen?", options: ["JSX is read-only", "React isn't told to re-render", "Variables can't hold numbers in JSX", "It needs `await`"], answer: 1, why: "Only setters (and new props/context) trigger a render." },
      { q: "After a re-render, a `let` variable inside the component is…", options: ["Kept", "Reset to its initial value", "Undefined"], answer: 1, why: "The function runs from the top again." },
      { q: "When is a plain variable correct inside a component?", options: ["For anything that changes on click", "For values calculated from props/state during render", "Never"], answer: 1, why: "Derived values should be recalculated each render." }
    ],
    rev: {
      sec30: "A normal variable fails for two reasons: changing it doesn't tell React to re-render, and every render runs the component function again so it resets. `useState` stores the value inside React between renders and its setter schedules a new render.",
      interview: [
        { level: "basic", q: "Why can't you use `let` to store a counter?", a: "Mutating it doesn't trigger a re-render, and it resets to its initial value every render." },
        { level: "intermediate", q: "What triggers a React re-render?", a: "A state update (setter), new props from a re-rendering parent, or a context value change." },
        { level: "intermediate", q: "Why not a variable outside the component?", a: "It persists, but it's shared by every instance and changes still don't re-render anything." },
        { level: "advanced", q: "If you need to remember a value without re-rendering, what do you use?", a: "`useRef`. It persists across renders but changing `.current` doesn't trigger a render." },
        { level: "tricky", q: "`let x = 0; x++` in a handler logs 1, 2, 3. Is it working?", a: "The variable changes, but the UI won't show it and the next render will reset it." }
      ],
      predict: [
        { code: `function Likes() {\n  let likes = 0;\n  return <button onClick={() => { likes++; }}>{likes}</button>;\n}\n// clicked 3 times`, answer: "The button still shows 0", why: "No setter was called, so React never re-renders." }
      ],
      cheat: [
        "Changing a variable ≠ telling React",
        "Every render re-runs the function: locals reset",
        "State persists + setter triggers re-render",
        "Module variables are shared and don't re-render",
        "Remember without re-render → `useRef`",
        "Derived values → plain `const` in render"
      ]
    },
    related: ["STATE-007", "STATE-004", "RENDER-002"]
  },

  "STATE-004": {
    tldr: "`useState(initial)` returns a pair: the current value and a setter function. Read the value in JSX, call the setter to change it.",
    analogy: { icon: "🌡️", text: "A weather app's °C/°F switch. The display reads the current unit; pressing the switch asks for the other one, and the screen redraws." },
    visual: { type: "flow", title: "Anatomy of `useState`", steps: [
      { label: "Call", detail: "`useState('C')` at the top of the component." },
      { label: "First render", detail: "React creates a slot and stores `'C'`." },
      { label: "Returns a pair", detail: "`[unit, setUnit]`: array destructuring names them." },
      { label: "Call the setter", detail: "`setUnit('F')` stores the new value and queues a render." },
      { label: "Next render", detail: "`useState('C')` now returns `'F'`; the initial value is ignored." }
    ]},
    points: [
      "Syntax: `const [thing, setThing] = useState(initial)`. Naming convention: `x` / `setX`.",
      "The **initial value is only used on the first render**. Later renders return the stored value.",
      "Call hooks at the **top level** of a component (not in `if`, loops or handlers).",
      "Use **one `useState` per independent value**; a component can have many.",
      "The setter **replaces** the value (no merging like old class `setState`). The setter function itself is stable."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Weather() {
  const [unit, setUnit] = useState('C');
  const [tempC, setTempC] = useState(21);

  const shown = unit === 'C' ? tempC : Math.round(tempC * 9 / 5 + 32);

  return (
    <div>
      <h2>London: {shown}°{unit}</h2>
      <button onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}>
        Switch to °{unit === 'C' ? 'F' : 'C'}
      </button>
      <button onClick={() => setTempC(tempC + 1)}>Warmer</button>
    </div>
  );
}`, walk: [
      { lines: [1], note: "`useState` is a named import from `react`." },
      { lines: [4, 5], note: "Two independent pieces of state, each with its own setter." },
      { lines: [7], note: "`shown` is derived during render, not stored." },
      { lines: [12], note: "Setter with a new value: React re-renders `Weather`." },
      { lines: [15], note: "Changing temperature keeps the current unit." }
    ]},
    output: "\"London: 21°C\". Switch → \"70°F\". Warmer → 22°C (or 72°F).",
    mistakes: [
      { bad: `if (isLoggedIn) {\n  const [name, setName] = useState('');\n}`, good: `const [name, setName] = useState('');\nif (!isLoggedIn) return null;`, why: "Hooks must run in the same order every render. React matches state to calls by order." },
      { bad: `const unit = useState('C');\n<p>{unit}</p>`, good: `const [unit, setUnit] = useState('C');\n<p>{unit}</p>`, why: "`useState` returns an array `[value, setter]`; destructure it." }
    ],
    practice: [
      { level: "B", q: "Add a `city` state starting at `'London'` and show it in the heading.", a: "`const [city, setCity] = useState('London')` and render `{city}` instead of the hard-coded name." },
      { level: "B", q: "Add a **Colder** button.", a: "`<button onClick={() => setTempC(tempC - 1)}>Colder</button>`" },
      { level: "I", q: "Add a Paris/London toggle button.", a: "Flip `city` between the two names with the setter.", code: `<button onClick={() => setCity(city === 'London' ? 'Paris' : 'London')}>\n  Show {city === 'London' ? 'Paris' : 'London'}\n</button>` },
      { level: "C", q: "Why is `shown` not a third `useState`?", a: "It's always calculable from `unit` and `tempC`. Storing it would need extra updates and could go out of sync." }
    ],
    quiz: [
      { q: "What does `useState(0)` return?", options: ["The number 0", "An object `{ value, set }`", "An array `[value, setter]`", "A Promise"], answer: 2, why: "A two-item array you destructure." },
      { q: "On the 5th render, what does `useState(21)` do with 21?", options: ["Resets the value to 21", "Ignores it and returns the stored value", "Adds 21"], answer: 1, why: "The initial value only matters on the first render." },
      { q: "Where may you call `useState`?", options: ["Top level of a component or custom hook", "Inside an `if`", "Inside an onClick handler"], answer: 0, why: "Rules of hooks: same order every render." }
    ],
    rev: {
      sec30: "`useState(initial)` returns `[value, setValue]`. The initial value is used once, on first render. The setter replaces the value and queues a re-render; on the next render `useState` returns the new value. Call it at the top level, one call per independent value.",
      interview: [
        { level: "basic", q: "What does `useState` return?", a: "An array: the current state value and a setter function." },
        { level: "basic", q: "Why array destructuring and not an object?", a: "So you can name the pair anything (`[unit, setUnit]`) without renaming syntax." },
        { level: "intermediate", q: "Does the setter merge objects like class `setState`?", a: "No. It replaces the whole value. Spread the old object yourself: `setUser({ ...user, name })`." },
        { level: "advanced", q: "How does React map `useState` calls to values?", a: "By call order in each render. Each call reads the next hook slot on the component's fiber, so order must be stable." },
        { level: "tricky", q: "Is the setter a new function each render?", a: "No. React guarantees the setter identity is stable, so it's safe to omit from effect dependencies." }
      ],
      compare: { cols: ["", "useState", "Class setState (legacy)"], rows: [
        ["Shape", "One value per call", "One object for all state"],
        ["Update", "Replaces", "Shallow-merges"],
        ["Where", "Function components", "Class components"]
      ]},
      cheat: [
        "`const [x, setX] = useState(initial)`",
        "Initial value used on first render only",
        "Setter replaces; it does not merge",
        "Setter identity is stable",
        "Top level only, same order every render",
        "Many `useState` calls per component is fine"
      ]
    },
    related: ["HOOKS-004", "HOOKS-002", "STATE-005", "STATE-006"]
  },

  "STATE-005": {
    tldr: "Start state with an empty value of the type you'll use later: `0`, `''`, `false`, `[]`, `{}`. Use `null` for \"nothing yet\". The initial value is only read on the first render.",
    analogy: { icon: "🍳", text: "A blank recipe card: empty title line, an empty ingredients list, servings set to 2. The shape is ready before you fill anything in." },
    visual: { type: "tree", title: "Pick the starting value by type", root: {
      label: "useState(…)", note: "match the type you'll use later",
      children: [
        { label: "Number → 0", note: "servings, quantity, score" },
        { label: "Text → ''", note: "input value, search query" },
        { label: "Yes/no → false", note: "isOpen, isVegan" },
        { label: "List → []", note: "so `.map()` works on render 1" },
        { label: "Form → { … }", note: "every field present: `{ name: '', email: '' }`" },
        { label: "Not loaded → null", note: "selected item, fetched data" }
      ]
    }},
    points: [
      "**Same type from the start**: a list starts as `[]`, so `items.map()` works before anything is added.",
      "`''` (not `undefined`) for text inputs; `undefined` makes the input uncontrolled and React warns when it switches.",
      "`null` means **\"nothing yet\"** (no photo, no selection). Check it before use: `photo ? … : …`.",
      "The initial value is used **once**. If it comes from a prop, later prop changes are ignored; name it `initialX`.",
      "Expensive start value (parse a big list, read storage)? Pass a function: `useState(() => load())` (lazy initialization)."
    ],
    code: { file: "RecipeEditor.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function RecipeEditor() {
  const [title, setTitle] = useState('');             // text
  const [servings, setServings] = useState(2);        // number
  const [isVegan, setIsVegan] = useState(false);      // yes/no
  const [ingredients, setIngredients] = useState([]); // list
  const [photoUrl, setPhotoUrl] = useState(null);     // nothing yet

  return (
    <form>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Recipe name" />
      <label>
        <input type="checkbox" checked={isVegan} onChange={e => setIsVegan(e.target.checked)} />
        Vegan
      </label>
      <button type="button" onClick={() => setServings(servings + 1)}>Serves {servings}</button>
      <button type="button" onClick={() => setIngredients([...ingredients, 'Salt'])}>Add salt</button>
      <button type="button" onClick={() => setPhotoUrl('/img/soup.jpg')}>Add photo</button>

      <p>{ingredients.length} ingredients</p>
      <ul>{ingredients.map((x, i) => <li key={i}>{x}</li>)}</ul>
      {photoUrl ? <img src={photoUrl} alt={title} /> : <p>No photo yet</p>}
    </form>
  );
}`, walk: [
      { lines: [4], note: "Text inputs start as `''` so the input is controlled from render 1." },
      { lines: [7], note: "`[]` means `.length` and `.map()` work before any item exists." },
      { lines: [8], note: "`null` = nothing chosen yet." },
      { lines: [22], note: "Safe to `.map()` immediately because the start value is an array." },
      { lines: [23], note: "Branch on `null` before using the value." }
    ]},
    output: "A form with an empty name box, \"Serves 2\", \"0 ingredients\" and \"No photo yet\".",
    mistakes: [
      { bad: `const [todos, setTodos] = useState();\nreturn todos.map(t => <li>{t}</li>);`, good: `const [todos, setTodos] = useState([]);\nreturn todos.map(t => <li key={t}>{t}</li>);`, why: "`undefined.map` crashes on the first render. Start with an empty array." },
      { bad: `function Greeting({ name }) {\n  const [label, setLabel] = useState(name);\n  // parent changes name → label stays old\n}`, good: `function Greeting({ name }) {\n  const label = name; // just use the prop\n}`, why: "Initial state is read once. Copying a prop into state means it won't follow later prop changes." }
    ],
    practice: [
      { level: "B", q: "Pick initial values: search text, unread count, menu open, chat messages.", a: "`''`, `0`, `false`, `[]`." },
      { level: "B", q: "A user profile that is fetched later: initial value?", a: "`null`, then render a loading message while it's `null`." },
      { level: "I", q: "A sign-up form with name and email in one state object: initial value?", a: "`{ name: '', email: '' }`: every field present so inputs are controlled and nothing is `undefined`." },
      { level: "C", q: "`<Counter start={5} />` uses `useState(start)`. The parent changes `start` to 10. What shows?", a: "Still the old count. Rename the prop `initialCount` to make that clear, or pass a `key` to reset the counter." }
    ],
    quiz: [
      { q: "Best initial value for a list of cart items?", options: ["`undefined`", "`null`", "`[]`", "`0`"], answer: 2, why: "An empty array keeps `.map()` and `.length` working." },
      { q: "Best initial value for a text input's state?", options: ["`''`", "`undefined`", "`null`"], answer: 0, why: "`undefined`/`null` make React treat the input as uncontrolled." },
      { q: "`useState(props.price)` and the price prop later changes. State…", options: ["Updates automatically", "Keeps the first value", "Throws an error"], answer: 1, why: "The argument is only used on the first render." }
    ],
    rev: {
      sec30: "Initialize state with a value of the type you'll use: `0`, `''`, `false`, `[]`, or a complete object. Use `null` for \"not chosen/loaded yet\". The initial value is read only on mount, so state seeded from a prop won't track it. For expensive defaults use a lazy initializer function.",
      interview: [
        { level: "basic", q: "Why initialize a list as `[]`?", a: "So render code like `items.map()` works before data arrives instead of crashing on `undefined`." },
        { level: "intermediate", q: "When is `null` a good initial value?", a: "When \"no value yet\" is meaningful, like no selected item or data not loaded, and you render a different UI for it." },
        { level: "intermediate", q: "Why does an input warn about switching from uncontrolled to controlled?", a: "Its `value` started as `undefined` (uncontrolled) and later became a string. Start with `''`." },
        { level: "advanced", q: "Is copying a prop into state ever right?", a: "Only as a starting point you intend to diverge from (name it `initialX`). Otherwise read the prop directly or reset with a `key`." },
        { level: "tricky", q: "`useState(loadNotes())` vs `useState(loadNotes)`?", a: "The first calls `loadNotes` on every render (result ignored after the first). The second passes a function React calls only once." }
      ],
      cheat: [
        "number → `0`, text → `''`, flag → `false`",
        "list → `[]`, form → `{ every: '' }`",
        "nothing yet → `null` (and check it)",
        "Initial value is read once, on mount",
        "Seeding from a prop won't track prop changes",
        "Expensive start → `useState(() => compute())`"
      ]
    },
    related: ["STATE-004", "STATE-018", "STATE-020", "STATE-023"]
  },

  "STATE-006": {
    tldr: "Calling the setter is how you ask React to re-render. React stores the new value, re-runs the component, and updates only the DOM that changed.",
    analogy: { icon: "💬", text: "Changing your chat status to Busy. You tap the option; the app records it and repaints your badge. Tapping Busy again changes nothing." },
    visual: { type: "flow", title: "From `setStatus('Busy')` to the screen", steps: [
      { label: "Setter called", detail: "In a click handler: `setStatus('Busy')`." },
      { label: "Same value?", detail: "React compares with `Object.is`. Same value → it usually skips the render." },
      { label: "Queue render", detail: "Different value → React marks this component to re-render." },
      { label: "Render", detail: "`ChatStatus()` runs again; `status` is now `'Busy'`. Children re-render too." },
      { label: "Commit", detail: "React updates only the changed DOM text: the badge." }
    ]},
    points: [
      "The setter is the **only** way to change state. It triggers a re-render of that component **and its children**.",
      "Setting the **same value** (by `Object.is`) lets React skip the re-render.",
      "Call setters in **event handlers** or effects, never directly in the render body (infinite loop).",
      "The setter **replaces** the value. For objects/arrays pass a **new** one; a mutated old one looks unchanged, so React skips it.",
      "In dev, **Strict Mode** calls your component twice per render, so a `console.log` there prints twice. Prod renders once."
    ],
    code: { file: "ChatStatus.jsx", lang: "jsx", src: `import { useState } from 'react';

const STATUSES = ['Online', 'Away', 'Busy'];

export default function ChatStatus() {
  const [status, setStatus] = useState('Online');
  console.log('render:', status);

  return (
    <div>
      <p>You are: <strong>{status}</strong></p>
      {STATUSES.map(s => (
        <button key={s} onClick={() => setStatus(s)} disabled={s === status}>
          {s}
        </button>
      ))}
    </div>
  );
}`, walk: [
      { lines: [6], note: "The current snapshot of `status` for this render." },
      { lines: [7], note: "Logs once per render (twice in dev Strict Mode)." },
      { lines: [13], note: "Arrow function: the setter runs on click, not during render." },
      { lines: [11], note: "Next render reads the new value; React patches just this text." }
    ]},
    output: "\"You are: Online\". Click Busy → \"You are: Busy\" and a new \"render: Busy\" log.",
    mistakes: [
      { bad: `<button onClick={setStatus('Busy')}>Busy</button>`, good: `<button onClick={() => setStatus('Busy')}>Busy</button>`, why: "The first calls the setter during render, which triggers another render… \"Too many re-renders\"." },
      { bad: `const [todos, setTodos] = useState([]);\ntodos.push('Milk');\nsetTodos(todos);`, good: `setTodos([...todos, 'Milk']);`, why: "Same array reference → `Object.is` says nothing changed, so React may skip the render." }
    ],
    practice: [
      { level: "B", q: "Add a \"Reset\" button that sets status back to Online.", a: "`<button onClick={() => setStatus('Online')}>Reset</button>`" },
      { level: "B", q: "Remove `disabled` and click \"Away\" twice. How many extra renders?", a: "One. The second click sets the same value, so React bails out (it may call the component once more, but nothing commits)." },
      { level: "I", q: "Show a coloured dot: green Online, amber Away, red Busy.", a: "Derive it in render: `const color = { Online: 'green', Away: 'orange', Busy: 'red' }[status]`." },
      { level: "C", q: "Why does `setStatus` not need to be in a `useEffect` dependency list?", a: "React guarantees setter functions are stable between renders." }
    ],
    quiz: [
      { q: "What does calling a setter with a different value do?", options: ["Mutates the variable right now", "Queues a re-render of the component", "Reloads the page", "Re-renders the whole app"], answer: 1, why: "React schedules that component (and its children) to render again." },
      { q: "`setStatus('Online')` when it's already `'Online'`?", options: ["Always re-renders", "React can skip re-rendering", "Throws an error"], answer: 1, why: "React compares with `Object.is` and bails out on equal values." },
      { q: "`onClick={setOpen(true)}` causes…", options: ["Opens on click", "\"Too many re-renders\" error", "Nothing"], answer: 1, why: "It calls the setter during render, which loops." }
    ],
    rev: {
      sec30: "Calling a setter is how you trigger a render. React compares the new value with `Object.is`; if it differs, it re-renders the component and its children and commits only DOM changes. Call setters from handlers or effects, never in the render body, and pass new objects/arrays rather than mutated ones.",
      interview: [
        { level: "basic", q: "How do you trigger a re-render?", a: "Call a state setter with a different value (or a parent re-renders, or context changes)." },
        { level: "intermediate", q: "What happens when you set state to the same value?", a: "React compares with `Object.is` and skips re-rendering the children. It may still call the component once before bailing out." },
        { level: "intermediate", q: "Does a re-render rewrite the whole DOM?", a: "No. React diffs the new output with the old and commits only what changed." },
        { level: "advanced", q: "Why does my log print twice?", a: "In development Strict Mode renders components twice to catch impure code. Production renders once." },
        { level: "tricky", q: "Why might `push` then `setItems(items)` not update the UI?", a: "The array reference is the same, so React thinks nothing changed. Create a new array." }
      ],
      debug: [
        { code: `function Menu() {\n  const [open, setOpen] = useState(false);\n  setOpen(true);\n  return <nav>{open && 'Menu'}</nav>;\n}`, fix: `function Menu() {\n  const [open, setOpen] = useState(false);\n  return (\n    <nav>\n      <button onClick={() => setOpen(true)}>☰</button>\n      {open && 'Menu'}\n    </nav>\n  );\n}`, why: "Setting state during render triggers an endless render loop. Move it to an event." }
      ],
      cheat: [
        "Setter → re-render of component + children",
        "Same value (`Object.is`) → React can skip",
        "Call in handlers/effects, never during render",
        "`onClick={() => set(x)}`, not `onClick={set(x)}`",
        "New object/array, never mutate",
        "Strict Mode double-renders in dev only"
      ]
    },
    related: ["RENDER-002", "STATE-008", "STATE-016", "EVT-001"]
  },

  "STATE-007": {
    tldr: "A normal variable lives for one render and changing it does nothing. State lives as long as the component is on screen and changing it re-renders. Use plain variables for values you calculate from state.",
    analogy: { icon: "🗒️", text: "Your notes app's saved notes are state: they're kept. The \"3 of 10 shown\" label is scratch maths you redo each time you look." },
    visual: { type: "compare", title: "Lifetime and re-render behaviour", left: {
      label: "Normal variable (`let`/`const`)", tone: "neutral",
      points: ["Recreated on **every** render", "Changing it does **not** re-render", "Perfect for values derived from state/props", "Forgotten when the function returns"]
    }, right: {
      label: "State (`useState`)", tone: "good",
      points: ["Kept by React **between** renders", "Setter **triggers** a re-render", "For data that changes over time", "Lost only when the component unmounts"]
    }},
    points: [
      "**Lifetime**: a variable lasts one render; state lasts until the component unmounts.",
      "**Re-render**: assigning a variable is silent; calling a setter tells React to redraw.",
      "Compute things like filtered lists, totals and labels as **plain `const`s** in render. Don't mirror them in state.",
      "Need to remember something **without** re-rendering (timer id, previous value)? That's `useRef`, not state.",
      "Rule of thumb: the **minimal** state is the raw input; everything else is calculated."
    ],
    code: { file: "Notes.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Notes() {
  const [notes, setNotes] = useState(['Buy milk', 'Call Sam']);
  const [query, setQuery] = useState('');

  // Plain variables: recalculated every render (that's the point)
  const visible = notes.filter(n => n.toLowerCase().includes(query.toLowerCase()));
  const countLabel = \`\${visible.length} of \${notes.length} notes\`;

  function addNote() {
    setNotes([...notes, \`Note \${notes.length + 1}\`]);
  }

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
      <p>{countLabel}</p>
      <ul>{visible.map(n => <li key={n}>{n}</li>)}</ul>
      <button onClick={addNote}>Add note</button>
    </div>
  );
}`, walk: [
      { lines: [4, 5], note: "State: the raw data that changes (notes, search text)." },
      { lines: [8, 9], note: "Plain variables, rebuilt each render from state. Always in sync." },
      { lines: [12], note: "Change state; `visible` and `countLabel` update by themselves next render." },
      { lines: [17], note: "Typing updates `query` → re-render → new `visible` list." }
    ]},
    output: "\"2 of 2 notes\". Type \"milk\" → \"1 of 2 notes\" showing only Buy milk.",
    mistakes: [
      { bad: `const [visible, setVisible] = useState(notes);\n// must remember to update it whenever notes or query change`, good: `const visible = notes.filter(n => n.includes(query));`, why: "Derived data in state goes stale. A plain variable is always correct." },
      { bad: `const [renders, setRenders] = useState(0);\nuseEffect(() => setRenders(r => r + 1));`, good: `const renders = useRef(0);\nuseEffect(() => { renders.current++; });`, why: "Counting renders in state causes an endless loop. Use a ref, and change it in an effect, not during render." }
    ],
    practice: [
      { level: "B", q: "In a cart, which are state: items, subtotal, item count, coupon code?", a: "`items` and `couponCode`. Subtotal and count are calculated from items." },
      { level: "I", q: "Add a \"Clear search\" button.", a: "`<button onClick={() => setQuery('')}>Clear</button>`; the list recomputes itself." },
      { level: "I", q: "Show \"No matches\" when the filter is empty.", a: "`{visible.length === 0 && <p>No matches</p>}`, derived, no new state." },
      { level: "C", q: "Filtering 10,000 notes is slow on each keystroke. Store `visible` in state?", a: "No. Keep it derived; wrap it in `useMemo(() => …, [notes, query])` if profiling shows it's slow." }
    ],
    quiz: [
      { q: "How long does a `const` inside a component live?", options: ["Until unmount", "One render", "Forever"], answer: 1, why: "Each render is a new function call with fresh locals." },
      { q: "A filtered list based on `items` and `query` should be…", options: ["Its own state", "A plain variable computed in render", "A ref"], answer: 1, why: "It can always be calculated, so storing it risks stale data." },
      { q: "Remember a timer id without re-rendering:", options: ["`useState`", "`let` inside the component", "`useRef`"], answer: 2, why: "Refs persist across renders without triggering one; a `let` resets." }
    ],
    rev: {
      sec30: "Normal variables are recreated every render and changing them never re-renders. State persists until unmount and its setter triggers a render. Keep state minimal (the raw inputs) and compute everything else as plain variables during render. For persistent values that shouldn't re-render, use a ref.",
      interview: [
        { level: "basic", q: "Difference between state and a normal variable?", a: "State persists across renders and its setter triggers a re-render; a variable resets each render and changing it is invisible to React." },
        { level: "intermediate", q: "What is minimal state?", a: "The smallest set of values you can't compute from anything else. Totals, filtered lists and labels are derived." },
        { level: "intermediate", q: "When would you use `useRef` instead of state?", a: "For values that must persist but don't affect the output: timer ids, DOM nodes, previous values." },
        { level: "advanced", q: "Isn't recomputing derived values every render wasteful?", a: "Usually negligible. If profiling shows a hot spot, memoize with `useMemo` instead of copying into state." },
        { level: "tricky", q: "Can mutating a plain variable ever show on screen?", a: "Only by accident if something else re-renders before it resets; never rely on it." }
      ],
      compare: { cols: ["", "let/const", "useState", "useRef"], rows: [
        ["Survives re-render", "No", "Yes", "Yes"],
        ["Change triggers render", "No", "Yes", "No"],
        ["Typical use", "Derived values", "UI data", "Timer ids, DOM nodes"]
      ]},
      cheat: [
        "Variable: one render. State: until unmount",
        "Only setters trigger a re-render",
        "Derive totals/filters as plain `const`s",
        "Don't mirror derived data in state",
        "Persist without re-render → `useRef`",
        "Slow derivation → `useMemo`, not state"
      ]
    },
    related: ["STATE-003", "STATE-022", "HOOKS-007", "PROPS-012"]
  },

  "STATE-008": {
    tldr: "A setter doesn't change state right away. It adds an update to a queue. When your handler finishes, React works through the queue in order and renders once with the result.",
    analogy: { icon: "🧾", text: "A waiter writes your orders on a pad and takes them to the kitchen when you're done ordering, not after each dish. The kitchen cooks them in order." },
    visual: { type: "timeline", title: "The update queue during one click", frames: [
      { label: "Click starts", state: "qty = 0 · queue: []", note: "The handler runs with the snapshot `qty = 0`." },
      { label: "setQty(10)", state: "queue: [replace with 10]", note: "Nothing on screen changes yet." },
      { label: "setQty(q => q + 1)", state: "queue: [10, q => q + 1]", note: "An updater function is queued too." },
      { label: "console.log(qty)", state: "logs 0", note: "Still the old snapshot inside this handler." },
      { label: "Handler ends", state: "10 → 10 + 1 = 11", note: "React processes the queue in order." },
      { label: "Render", state: "qty = 11 (one render)", note: "The component runs once with the final value." }
    ]},
    points: [
      "Setters **enqueue** an update for the **next render**; they don't change the variable you're holding.",
      "React waits until the event handler finishes, then processes **all** queued updates in **call order**.",
      "A value (`setQty(10)`) means **replace**; a function (`setQty(q => q + 1)`) means **update from the previous result**.",
      "Several updates → **one render** (batching). That's why the UI never flashes intermediate values.",
      "Read the result in the next render, not on the line after the setter."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Cart() {
  const [qty, setQty] = useState(0);

  function bulkOrder() {
    setQty(10);         // queue: replace with 10
    setQty(q => q + 1); // queue: add 1 to the previous result
    console.log(qty);   // still the old snapshot
  }

  console.log('render, qty =', qty);

  return (
    <>
      <p>Quantity: {qty}</p>
      <button onClick={bulkOrder}>Bulk order</button>
    </>
  );
}`, walk: [
      { lines: [7], note: "Queues \"replace with 10\". `qty` in this handler is unchanged." },
      { lines: [8], note: "Queues an updater; it will receive 10 when the queue is processed." },
      { lines: [9], note: "Logs the old value: the update hasn't been applied yet." },
      { lines: [12], note: "Runs once after the click, showing `qty = 11`." }
    ]},
    output: "Click → console: \"0\" then \"render, qty = 11\" (logged twice in dev Strict Mode). Screen: \"Quantity: 11\".",
    mistakes: [
      { bad: `setQty(qty + 1);\nif (qty > 5) alert('Bulk discount!');`, good: `const next = qty + 1;\nsetQty(next);\nif (next > 5) alert('Bulk discount!');`, why: "`qty` is still the old value on the next line. Compute the next value once and use it." }
    ],
    practice: [
      { level: "B", q: "`setQty(5); setQty(7);` What renders?", a: "7. Both are \"replace\" updates processed in order; the last wins. One render." },
      { level: "I", q: "`setQty(qty + 5); setQty(q => q + 1);` starting at 0?", a: "6. The first queues \"replace with 5\", then the updater adds 1." },
      { level: "I", q: "`setQty(q => q + 1); setQty(0);` starting at 3?", a: "0. The last update is a replace." },
      { level: "C", q: "Write a handler that adds 3 and shows the final quantity in an alert.", a: "Compute it first, then set and use the local.", code: `function addThree() {\n  const next = qty + 3;\n  setQty(next);\n  alert(\`Now \${next}\`);\n}` }
    ],
    quiz: [
      { q: "When are queued updates applied?", options: ["Immediately on each setter call", "After the event handler finishes, during the next render", "After 1 second"], answer: 1, why: "React processes the queue when it renders next." },
      { q: "`setN(n + 5); setN(n => n + 1); setN(42);` from 0. Result?", options: ["6", "42", "48"], answer: 1, why: "Processed in order: 5, then 6, then replaced with 42." },
      { q: "How many renders does a handler with 3 setter calls cause?", options: ["3", "1", "0"], answer: 1, why: "React batches them into one render." }
    ],
    rev: {
      sec30: "Setters queue updates instead of changing state immediately. After the handler completes, React processes the queue in the order you called them: values replace, updater functions transform the previous result. All of it produces a single render with the final state.",
      interview: [
        { level: "basic", q: "Does `setState` update the value immediately?", a: "No. It queues an update; the new value is visible on the next render." },
        { level: "intermediate", q: "How does React process multiple updates in one handler?", a: "In order. A value replaces the pending state; an updater function receives the pending state and returns the next one." },
        { level: "intermediate", q: "Why queue instead of rendering on each call?", a: "Performance and consistency: one render with the final state, no half-updated UI." },
        { level: "advanced", q: "Where can you see the queue's result?", a: "In the next render's state value, or compute the next value in a local variable before calling the setter." },
        { level: "tricky", q: "`setN(n => n + 1); setN(n + 1);` from 0. Result?", a: "1. The updater gives 1, then `n + 1` uses the snapshot 0 and replaces it with 1." }
      ],
      predict: [
        { code: `const [n, setN] = useState(0);\nfunction click() {\n  setN(n + 5);\n  setN(m => m * 2);\n}`, answer: "10", why: "Queue: replace with 5, then double the result." }
      ],
      cheat: [
        "Setter = enqueue, not assign",
        "Queue runs after the handler, in call order",
        "Value → replace; function → transform previous",
        "Many updates → one render",
        "Need the new value now? Compute it in a local",
        "Detail of grouping updates: see Batching"
      ]
    },
    related: ["STATE-009", "STATE-010", "STATE-019", "RENDER-002"]
  },

  "STATE-009": {
    tldr: "Right after `setText('')`, `text` still holds the old value. It isn't async: each render gets a fixed snapshot of state, and your handler belongs to that render.",
    analogy: { icon: "📸", text: "A photo of your fridge. You buy milk, but the photo in your hand still shows no milk. The next photo (next render) will show it." },
    visual: { type: "timeline", title: "One render, one snapshot", frames: [
      { label: "Render 1", state: "text = 'Hi Sam'", note: "The handler created here sees `'Hi Sam'`." },
      { label: "Click Send", state: "setText('') queued", note: "Asks for an empty box next render." },
      { label: "console.log(text)", state: "'Hi Sam'", note: "Same snapshot: the variable never changes inside a render." },
      { label: "Render 2", state: "text = ''", note: "A new function call with a new snapshot; the box clears." },
      { label: "2 s later", state: "alert: 'Sent: Hi Sam'", note: "The timer was made in render 1, so it still sees render 1's text." }
    ]},
    points: [
      "Every render is a **snapshot**: props, state and handlers are fixed for that render.",
      "`text` is a `const` in that function call. The setter can't reach in and change it.",
      "It only **looks** async. The setter returns nothing (no Promise), so `await setText('')` does nothing.",
      "Timers and callbacks created in a render see **that render's** values (closures), even after the screen moves on.",
      "Need the next value now? Compute it in a local. Need the latest in a timer? Use an updater `s => …` or a ref."
    ],
    code: { file: "ChatBox.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function ChatBox() {
  const [text, setText] = useState('');

  function send() {
    setText('');            // ask for an empty box next render
    console.log(text);      // still the typed message
    setTimeout(() => {
      alert('Sent: ' + text); // this render's snapshot
    }, 2000);
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </>
  );
}`, walk: [
      { lines: [4], note: "`text` is a constant for this render." },
      { lines: [7], note: "Queues an update; the current `text` doesn't change." },
      { lines: [8], note: "Logs the message you typed, not `''`." },
      { lines: [9, 10, 11], note: "The timer closes over this render's `text`. Handy here: we send what was typed." }
    ]},
    output: "Type \"Hi Sam\", click Send: the box clears, console logs \"Hi Sam\", and 2 s later the alert says \"Sent: Hi Sam\".",
    mistakes: [
      { bad: `await setText('');\nconsole.log(text); // expecting ''`, good: `const next = '';\nsetText(next);\nconsole.log(next);`, why: "Setters don't return a Promise. Awaiting them changes nothing; the snapshot stays the same." },
      { bad: `setTimeout(() => setCount(count + 1), 1000);\n// clicked 3 times fast → 1`, good: `setTimeout(() => setCount(c => c + 1), 1000);\n// → 3`, why: "Each timer saw the same old `count`. An updater uses the latest queued value." }
    ],
    practice: [
      { level: "B", q: "`setLikes(likes + 1); console.log(likes);` with likes = 4. What logs?", a: "4. The log reads this render's snapshot." },
      { level: "I", q: "Show \"Sending…\" until the alert. Which state do you need?", a: "`const [sending, setSending] = useState(false)`: set true in `send`, false inside the timeout." },
      { level: "I", q: "Run code after the state actually changed on screen.", a: "Put it in the next render's logic, or in a `useEffect` that depends on that state (only for syncing with outside systems)." },
      { level: "C", q: "Make the alert show the **latest** typed text instead of the snapshot.", a: "Store the text in a ref too, and read `ref.current` in the timeout.", code: `const latest = useRef('');\nlatest.current = text;\n// in the timer: alert(latest.current)` }
    ],
    quiz: [
      { q: "Why does state look stale right after `set`?", options: ["The setter is slow", "The handler reads the current render's snapshot", "React ignores the first update"], answer: 1, why: "State is fixed per render; the new value arrives in the next render." },
      { q: "`await setCount(5)` makes `count` equal 5 on the next line.", options: ["True", "False"], answer: 1, why: "Setters return `undefined`; there's nothing to await and the snapshot can't change." },
      { q: "A `setTimeout` created in render 1 reads state from…", options: ["The latest render", "Render 1", "The initial value always"], answer: 1, why: "Closures capture the values of the render that created them." }
    ],
    rev: {
      sec30: "State behaves like a snapshot. Each render's props, state and handlers are fixed, so after calling a setter the variable in your handler still has the old value. It's not truly async: the setter returns nothing to await. The new value appears in the next render. Use a local variable, an updater function or a ref when you need the next or latest value.",
      interview: [
        { level: "basic", q: "Why does `console.log(state)` after `setState` show the old value?", a: "The handler belongs to the current render, whose state is a constant snapshot. The update applies on the next render." },
        { level: "intermediate", q: "Is `setState` asynchronous?", a: "Not in the Promise sense. It queues an update synchronously; the re-render happens later. You can't await it." },
        { level: "intermediate", q: "What is a stale closure?", a: "A callback (timer, listener) created in an old render still reading that render's state." },
        { level: "advanced", q: "How do you read the latest state inside an interval?", a: "Use an updater `setX(x => …)` for updates, or mirror the value in a ref for reading." },
        { level: "tricky", q: "Is the snapshot behaviour ever helpful?", a: "Yes: a delayed \"send\" sends what was on screen when the user clicked, even if they keep typing." }
      ],
      predict: [
        { code: `const [n, setN] = useState(0);\nfunction click() {\n  setN(n + 1);\n  setTimeout(() => console.log(n), 1000);\n}`, answer: "Logs 0 after one second", why: "The timer closes over render 0's `n`." }
      ],
      cheat: [
        "Each render = fixed snapshot of state",
        "After `set`, your variable is still old",
        "Setters return nothing: don't `await` them",
        "Closures (timers) keep their render's values",
        "Next value now → compute a local",
        "Latest value later → updater or ref"
      ]
    },
    related: ["STATE-008", "STATE-010", "HOOKS-007", "HOOKS-005"]
  },

  "STATE-010": {
    tldr: "When the next value depends on the previous one, pass a function: `setReps(r => r + 1)`. React feeds it the latest queued value, so repeated or delayed updates don't get lost.",
    analogy: { icon: "🏋️", text: "Writing \"add one more set\" on the gym log instead of \"set count = 4\". However many notes stack up, each adds to the latest total." },
    visual: { type: "compare", title: "Three updates in one click (start: 0)", left: {
      label: "setReps(reps + 1) ×3", tone: "bad",
      points: ["Each reads the snapshot `reps = 0`", "Queue: replace 1, replace 1, replace 1", "Result: **1**"]
    }, right: {
      label: "setReps(r => r + 1) ×3", tone: "good",
      points: ["Each gets the previous queued result", "Queue: 0→1, 1→2, 2→3", "Result: **3**"]
    }},
    points: [
      "**Updater function**: `setX(prev => next)`. React calls it with the latest pending value.",
      "Use it when the next value is **computed from** the current one: counters, toggles, appending to arrays.",
      "Essential in **timers, intervals and async callbacks**, where the snapshot may be stale.",
      "Keep updaters **pure** (no side effects). In dev Strict Mode React calls them twice to check.",
      "Naming: first letter (`r => r + 1`) or `prev`. Setting an unrelated value (`setText('')`) doesn't need one."
    ],
    code: { file: "Workout.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

export default function Workout() {
  const [seconds, setSeconds] = useState(0);
  const [reps, setReps] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1); // always the latest value
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function addThreeReps() {
    setReps(r => r + 1);
    setReps(r => r + 1);
    setReps(r => r + 1);
  }

  return (
    <>
      <p>⏱ {seconds}s · 💪 {reps} reps</p>
      <button onClick={addThreeReps}>+3 reps</button>
      <button onClick={() => setReps(0)}>Reset</button>
    </>
  );
}`, walk: [
      { lines: [8, 9], note: "The interval is created once. `seconds` there would stay 0 forever; the updater gets the real latest value." },
      { lines: [11], note: "Cleanup stops the timer (also handles Strict Mode's dev double effect)." },
      { lines: [15, 16, 17], note: "Each updater receives the result of the one before: 0→1→2→3." },
      { lines: [24], note: "Reset doesn't depend on the old value, so a plain value is fine." }
    ]},
    output: "The timer ticks up every second. \"+3 reps\" adds 3 per click; Reset sets reps to 0.",
    mistakes: [
      { bad: `useEffect(() => {\n  const id = setInterval(() => setSeconds(seconds + 1), 1000);\n  return () => clearInterval(id);\n}, []);`, good: `useEffect(() => {\n  const id = setInterval(() => setSeconds(s => s + 1), 1000);\n  return () => clearInterval(id);\n}, []);`, why: "The interval captured `seconds = 0`, so it keeps setting 1. The updater always uses the latest value." },
      { bad: `setCart(c => {\n  c.push(item);\n  return c;\n});`, good: `setCart(c => [...c, item]);`, why: "Updaters must return a new value without mutating; mutation breaks re-renders and runs twice in Strict Mode." }
    ],
    practice: [
      { level: "B", q: "Toggle a dark mode flag safely.", a: "`setDark(d => !d)`" },
      { level: "B", q: "Add a song to a playlist array with an updater.", a: "`setSongs(s => [...s, song])`" },
      { level: "I", q: "`setN(n => n + 1); setN(n + 1);` from 0?", a: "1. The updater gives 1, then `n + 1` uses the snapshot (0) and replaces it with 1." },
      { level: "C", q: "A \"like\" button sends a request and adds 1 when it succeeds. Users click fast. Write the update.", a: "Use an updater in the async callback so overlapping responses each add 1.", code: `async function like() {\n  await api.like(postId);\n  setLikes(l => l + 1);\n}` }
    ],
    quiz: [
      { q: "`setScore(s => s + 2)` twice from 0. Result?", options: ["2", "4", "0"], answer: 1, why: "The second updater receives 2 and returns 4." },
      { q: "When is an updater function needed?", options: ["Always", "When the next value is based on the previous one", "Only for strings"], answer: 1, why: "If you're setting an unrelated value, a plain value is fine." },
      { q: "Why do updaters run twice in development?", options: ["A React bug", "Strict Mode checks they're pure", "To batch updates"], answer: 1, why: "Strict Mode double-invokes updaters in dev to expose side effects. Prod runs them once." }
    ],
    rev: {
      sec30: "Pass a function to a setter (`setX(prev => …)`) when the next value depends on the current one. React queues it and calls it with the latest pending state, so multiple updates in one event and updates from timers or async code don't use stale snapshots. Updaters must be pure; Strict Mode calls them twice in dev.",
      interview: [
        { level: "basic", q: "What is a functional state update?", a: "Passing a function to the setter that receives the previous state and returns the next one." },
        { level: "intermediate", q: "Why does `setCount(count + 1)` three times only add 1?", a: "All three read the same snapshot. Updaters chain off each other's results instead." },
        { level: "intermediate", q: "Why use updaters in `setInterval`?", a: "The interval callback closes over the first render's state; an updater always gets the latest value." },
        { level: "advanced", q: "Do updaters help with effect dependencies?", a: "Yes. Using `setX(x => …)` means the effect doesn't read `x`, so `x` can be left out of the deps." },
        { level: "tricky", q: "Should you always use updaters?", a: "Not required. It's a safe habit for increments, but setting a value from an event (like `e.target.value`) doesn't need one." }
      ],
      debug: [
        { code: `function addTwo() {\n  setQty(qty + 1);\n  setQty(qty + 1);\n}`, fix: `function addTwo() {\n  setQty(q => q + 1);\n  setQty(q => q + 1);\n}`, why: "Both lines read the same snapshot, so the result is +1. Updaters chain." }
      ],
      cheat: [
        "`setX(prev => next)` when next depends on prev",
        "Updaters chain within one event",
        "Fixes stale values in timers/async code",
        "Pure only: no mutation, no side effects",
        "Strict Mode calls updaters twice in dev",
        "Unrelated new value → plain `setX(value)`"
      ]
    },
    related: ["STATE-008", "STATE-009", "STATE-019", "HOOKS-005"]
  },

  "STATE-011": {
    tldr: "Numbers in state go up with `n => n + 1`, down with `n => n - 1`, and stay in range with `Math.min`/`Math.max` (clamping). Inputs give strings, so convert with `Number()`.",
    analogy: { icon: "🛒", text: "The − / + quantity picker on a shop page: it won't go below 1 or above the 10 in stock, however hard you tap." },
    visual: { type: "timeline", title: "Clamping a cart quantity (1 to 10)", frames: [
      { label: "Start", state: "qty = 1", note: "The − button is disabled at the minimum." },
      { label: "Tap + ×3", state: "qty = 4", note: "`q => clamp(q + 1)` each time." },
      { label: "Type 25", state: "clamp(25) → 10", note: "`Math.min(10, …)` caps it at stock." },
      { label: "Type 0", state: "clamp(0) → 1", note: "`Math.max(1, …)` keeps it valid." },
      { label: "Tap +", state: "qty = 2", note: "Total recalculates: 2 × £4.50 = £9.00." }
    ]},
    points: [
      "**Increment/decrement** with updaters: `setQty(q => q + 1)` so fast taps never get lost.",
      "**Clamp** to a range: `Math.min(MAX, Math.max(MIN, n))`. Also disable buttons at the limits.",
      "`e.target.value` is **always a string**: `'1' + 1` is `'11'`. Convert with `Number()` or `e.target.valueAsNumber`.",
      "Guard bad input: `Number('')` is **0** (not NaN) and `Number('abc')` is NaN.",
      "Money: store **whole pence/cents** as integers, format with `toFixed(2)` only for display."
    ],
    code: { file: "QuantityPicker.jsx", lang: "jsx", src: `import { useState } from 'react';

const MIN = 1;
const MAX = 10;
const PRICE_PENCE = 450;
const clamp = n => Math.min(MAX, Math.max(MIN, n));

export default function QuantityPicker() {
  const [qty, setQty] = useState(1);

  function handleType(e) {
    const n = Number(e.target.value);
    setQty(Number.isNaN(n) ? MIN : clamp(n));
  }

  return (
    <div>
      <button onClick={() => setQty(q => clamp(q - 1))} disabled={qty === MIN}>−</button>
      <input type="number" value={qty} onChange={handleType} />
      <button onClick={() => setQty(q => clamp(q + 1))} disabled={qty === MAX}>+</button>
      <p>Total: £{(qty * PRICE_PENCE / 100).toFixed(2)}</p>
    </div>
  );
}`, walk: [
      { lines: [6], note: "One tiny helper keeps every update inside 1-10." },
      { lines: [12, 13], note: "Input text → number, with a fallback for invalid input." },
      { lines: [18], note: "Decrement with an updater, clamped, and disabled at the minimum." },
      { lines: [21], note: "Price kept in pence (integer); converted to pounds only for display." }
    ]},
    output: "\"− 1 +\" with \"Total: £4.50\". Taps change the quantity between 1 and 10; typing 25 snaps to 10.",
    mistakes: [
      { bad: `onChange={e => setQty(e.target.value)}\n// later: qty + 1 → '41'`, good: `onChange={e => setQty(Number(e.target.value))}`, why: "Input values are strings, so `+` joins text instead of adding." },
      { bad: `const [price, setPrice] = useState(0.1 + 0.2); // 0.30000000000000004`, good: `const [pricePence, setPricePence] = useState(30);`, why: "Floating-point decimals drift. Integers in the smallest unit are exact." }
    ],
    practice: [
      { level: "B", q: "Add a \"+5\" button that still respects the max.", a: "`setQty(q => clamp(q + 5))`" },
      { level: "B", q: "Show \"Only 10 in stock\" at the max.", a: "`{qty === MAX && <p>Only {MAX} in stock</p>}`" },
      { level: "I", q: "A recipe scales servings by 0.5 steps between 0.5 and 8. Write the increment.", a: "Use step and clamp, rounding to avoid float drift.", code: `setServings(s => Math.min(8, Math.round((s + 0.5) * 2) / 2))` },
      { level: "C", q: "Make `QuantityPicker` reusable with `min`, `max` and `onChange` props.", a: "Move `qty` to the parent (controlled), compute `clamp` from props, and call `onChange(clamp(next))`." }
    ],
    quiz: [
      { q: "`'3' + 1` in JavaScript gives…", options: ["4", "'31'", "NaN"], answer: 1, why: "A string plus a number concatenates. Convert input values first." },
      { q: "Clamp `n` between 1 and 10:", options: ["`Math.max(10, Math.min(1, n))`", "`Math.min(10, Math.max(1, n))`", "`Math.round(n, 1, 10)`"], answer: 1, why: "Raise to at least 1, then cap at 10." },
      { q: "Best way to store a £4.50 price?", options: ["`4.5`", "`'4.50'`", "`450` (pence)"], answer: 2, why: "Integers avoid floating-point rounding errors." }
    ],
    rev: {
      sec30: "Update numeric state with updaters (`n => n + 1`), clamp with `Math.min(max, Math.max(min, n))`, and disable controls at the limits. Inputs return strings, so convert with `Number()` and guard against `NaN`. Store money as integer minor units and format only when displaying.",
      interview: [
        { level: "basic", q: "How do you increment a counter in state?", a: "`setCount(c => c + 1)`, the updater form, so multiple quick updates all count." },
        { level: "basic", q: "How do you keep a number within a range?", a: "Clamp it: `Math.min(max, Math.max(min, value))`, and disable the buttons at the edges." },
        { level: "intermediate", q: "Why does my number input concatenate?", a: "`e.target.value` is a string. Convert with `Number()` or `valueAsNumber` before storing." },
        { level: "advanced", q: "How should you handle money in state?", a: "As integers in the smallest unit (pence) to avoid float errors; format with `Intl.NumberFormat` for display." },
        { level: "tricky", q: "`Number('')` returns?", a: "0, not NaN. An emptied input becomes 0 unless you handle the empty string explicitly." }
      ],
      cheat: [
        "Up: `setN(n => n + 1)`; down: `setN(n => n - 1)`",
        "Clamp: `Math.min(MAX, Math.max(MIN, n))`",
        "Disable buttons at the limits",
        "Inputs give strings → `Number()`",
        "`Number('')` = 0, `Number('x')` = NaN",
        "Money as integer pence; format on display"
      ]
    },
    related: ["STATE-010", "STATE-012", "EVT-004"]
  },

  "STATE-012": {
    tldr: "Bind a text box to string state: `value={text}` shows the state and `onChange={e => setText(e.target.value)}` saves each keystroke. React is now the source of truth for the text.",
    analogy: { icon: "💬", text: "A chat box that mirrors what you type into the app's memory, so the app can count characters, block empty sends and clear the box after sending." },
    visual: { type: "cycle", title: "Every keystroke", steps: [
      { label: "Type a letter", detail: "The browser fires `onChange` with the new text." },
      { label: "setText", detail: "`setText(e.target.value)` stores the whole new string." },
      { label: "Re-render", detail: "`text` is the new string; counters and checks recalculate." },
      { label: "value={text}", detail: "The input displays exactly what state holds." }
    ]},
    points: [
      "Two parts: `value={text}` (state → input) and `onChange` (input → state). Together: a **controlled input**.",
      "Start with `''`. `value` without `onChange` makes a read-only box (React warns).",
      "Derive extras during render: `text.length`, `text.trim() === ''`, characters left.",
      "Transform as you store: `setCode(e.target.value.toUpperCase())` for a coupon code.",
      "**Trim on submit**, not on every keystroke (or users can't type spaces). Clear with `setText('')`."
    ],
    code: { file: "StatusUpdate.jsx", lang: "jsx", src: `import { useState } from 'react';

const LIMIT = 140;

export default function StatusUpdate() {
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);

  const left = LIMIT - text.length;
  const canPost = text.trim() !== '' && left >= 0;

  function handleSubmit(e) {
    e.preventDefault();
    setPosts([{ id: crypto.randomUUID(), body: text.trim() }, ...posts]);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's cooking?"
      />
      <p style={{ color: left < 0 ? 'red' : 'gray' }}>{left} characters left</p>
      <button disabled={!canPost}>Post</button>
      <ul>{posts.map(p => <li key={p.id}>{p.body}</li>)}</ul>
    </form>
  );
}`, walk: [
      { lines: [6], note: "String state starts as `''`." },
      { lines: [9, 10], note: "Derived from the string each render: no extra state." },
      { lines: [14, 15], note: "Trim when saving, then clear the box by setting `''`." },
      { lines: [21, 22], note: "The binding: state drives the box, every keystroke updates state." },
      { lines: [26], note: "Empty or too-long text disables the button." }
    ]},
    output: "A textarea with \"140 characters left\". Typing counts down; Post adds the message to the list and clears the box.",
    mistakes: [
      { bad: `<input value={name} />`, good: `<input value={name} onChange={e => setName(e.target.value)} />`, why: "Without `onChange` the box is frozen at the state value and React warns it's read-only." },
      { bad: `onChange={e => setName(e.target.value.trim())}`, good: `onChange={e => setName(e.target.value)}\n// trim when submitting`, why: "Trimming on each keystroke removes the space you just typed, so \"Ana Lopez\" becomes impossible." }
    ],
    practice: [
      { level: "B", q: "Bind a search box to `query` state.", a: "String state plus the `value`/`onChange` pair.", code: `const [query, setQuery] = useState('');\n<input value={query} onChange={e => setQuery(e.target.value)} />` },
      { level: "B", q: "Add a \"Clear\" button.", a: "`<button type=\"button\" onClick={() => setText('')}>Clear</button>`" },
      { level: "I", q: "Coupon box that always shows uppercase with no spaces.", a: "`setCode(e.target.value.toUpperCase().replace(/\\s/g, ''))`" },
      { level: "C", q: "Stop typing at 140 characters instead of going negative.", a: "Add `maxLength={LIMIT}` to the textarea, or ignore updates longer than the limit in `onChange`." }
    ],
    quiz: [
      { q: "What makes an input \"controlled\"?", options: ["`value` from state + `onChange` that sets it", "A `ref`", "`defaultValue`"], answer: 0, why: "State is the single source of truth for what the input shows." },
      { q: "`<input value={text} />` with no `onChange`:", options: ["Works normally", "Can't be typed into", "Crashes the app"], answer: 1, why: "React keeps resetting it to `text`, which never changes." },
      { q: "Where should you trim user text?", options: ["On every keystroke", "When you submit or save", "Never"], answer: 1, why: "Trimming while typing eats spaces between words." }
    ],
    rev: {
      sec30: "To bind text, give the input `value={text}` and `onChange={e => setText(e.target.value)}`. The state starts as `''` and becomes the single source of truth, so you can derive counts and validation in render, transform as you store, trim on submit and clear by setting `''`.",
      interview: [
        { level: "basic", q: "How do you bind an input to state?", a: "`value={text}` plus `onChange={e => setText(e.target.value)}`." },
        { level: "intermediate", q: "Why does React warn about a read-only field?", a: "You passed `value` without `onChange` (or `readOnly`), so the user's typing can never change it." },
        { level: "intermediate", q: "How would you show remaining characters?", a: "Derive it in render: `LIMIT - text.length`. No extra state needed." },
        { level: "advanced", q: "Does every keystroke re-render the component?", a: "Yes. That's normally cheap; if the subtree is heavy, move the input into a smaller component or defer the slow part with `useDeferredValue`." },
        { level: "tricky", q: "Why might an input warn about switching from uncontrolled to controlled?", a: "Its state started as `undefined`/`null` and later became a string. Initialize with `''`." }
      ],
      cheat: [
        "`value={text}` + `onChange={e => setText(e.target.value)}`",
        "Start string state with `''`",
        "`value` without `onChange` = frozen box",
        "Derive length/validation in render",
        "Trim on submit, clear with `setText('')`",
        "Transform as you store (e.g. `toUpperCase()`)"
      ]
    },
    related: ["STATE-023", "EVT-004", "STATE-005", "STATE-011"]
  }
};
