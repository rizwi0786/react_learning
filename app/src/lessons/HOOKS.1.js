export default {
  "HOOKS-001": {
    tldr: "Hooks are special functions starting with `use` that let a plain function component plug into React features: memory (state), side effects, refs, context and more.",
    analogy: { icon: "🔌", text: "A kitchen counter with power sockets. Your component is the counter; each hook is a plug-in appliance: a fridge for memory, a timer for effects, a label maker for refs." },
    visual: { type: "tree", title: "One component, many plug-ins", root: { label: "NoteEditor()", note: "a plain function", children: [
      { label: "useState", note: "remember the note text" },
      { label: "useEffect", note: "sync the tab title" },
      { label: "useRef", note: "grab the textarea to focus it" },
      { label: "useContext", note: "read the app theme" },
      { label: "useMyHook", note: "your own reusable combo (custom hook)" }
    ] } },
    points: [
      "A hook is just a function whose name starts with **`use`**; React keeps its data **outside** your function between renders.",
      "Built-in hooks give access to: **state** (`useState`, `useReducer`), **effects** (`useEffect`), **refs** (`useRef`), **context** (`useContext`), **performance** (`useMemo`, `useTransition`).",
      "Hooks only work inside **function components** or **custom hooks**, never in plain functions or class components.",
      "You can combine hooks into your own **custom hook** (e.g. `useLocalStorage`) to reuse logic, not UI.",
      "C#/.NET picture: like dependency injection for React features, but resolved by **call order**, not by type."
    ],
    code: { file: "NoteEditor.jsx", lang: "jsx", src: `import { useState, useEffect, useRef } from 'react';

export default function NoteEditor() {
  // 1. Memory: survives re-renders
  const [text, setText] = useState('');

  // 2. A handle to a real DOM node
  const boxRef = useRef(null);

  // 3. Sync with something outside React (the tab title)
  useEffect(() => {
    document.title = text ? 'Editing note...' : 'Notes';
  }, [text]);

  return (
    <div>
      <textarea
        ref={boxRef}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => boxRef.current.focus()}>Focus</button>
      <p>{text.length} characters</p>
    </div>
  );
}`, walk: [
      { lines: [1], note: "Hooks are imported from `react` like any function." },
      { lines: [5], note: "`useState` plugs in **memory**: `text` is kept between renders." },
      { lines: [8], note: "`useRef` plugs in a **box** that will hold the textarea DOM node." },
      { lines: [11, 12, 13], note: "`useEffect` plugs in **side effects**: run after render when `text` changes." },
      { lines: [22], note: "Use the ref in an event handler to focus the real DOM node." }
    ]},
    output: "A textarea, a Focus button and a live character count. The browser tab title switches to “Editing note...” once you type.",
    mistakes: [
      { bad: `class Notes extends React.Component {\n  render() {\n    const [t, setT] = useState('');\n  }\n}`, good: `function Notes() {\n  const [t, setT] = useState('');\n}`, why: "Hooks don't work in class components. Use a function component." },
      { bad: `function formatNote(n) {\n  const [x] = useState(n); // plain helper\n}`, good: `function useFormattedNote(n) {\n  const [x] = useState(n); // custom hook\n}`, why: "Only components and functions named `useSomething` may call hooks. The name tells React (and the linter) the rules apply." }
    ],
    practice: [
      { level: "B", q: "Name the hook you'd use to remember whether a recipe card is expanded.", a: "`useState`: `const [open, setOpen] = useState(false)`." },
      { level: "B", q: "Which hook syncs a component with something outside React, like a chat connection?", a: "`useEffect`." },
      { level: "I", q: "Add a hook that remembers how many times Focus was clicked **without** re-rendering.", a: "`const clicks = useRef(0)` and do `clicks.current++` in the handler. Refs don't trigger renders.", code: `const clicks = useRef(0);\n<button onClick={() => { clicks.current++; boxRef.current.focus(); }}>Focus</button>` },
      { level: "C", q: "Turn the title logic into a custom hook `useDocumentTitle(title)`.", a: "Move the effect into a function starting with `use` and call it from the component.", code: `function useDocumentTitle(title) {\n  useEffect(() => { document.title = title; }, [title]);\n}\n// in NoteEditor:\nuseDocumentTitle(text ? 'Editing note...' : 'Notes');` }
    ],
    quiz: [
      { q: "What makes a function a hook?", options: ["It returns JSX", "Its name starts with `use` and it calls React features", "It is wrapped in `React.hook()`", "It is a class method"], answer: 1, why: "Hooks are plain functions named `use...` that tap into React features." },
      { q: "Where can you call `useState`?", options: ["In any JS function", "In class components", "In function components and custom hooks", "Only in `main.jsx`"], answer: 2, why: "Hooks only work while React is rendering a function component (or a custom hook it calls)." },
      { q: "Custom hooks let you share...", options: ["Stateful logic", "The same state value between components", "CSS styles"], answer: 0, why: "Each component calling a custom hook gets its **own** state; only the logic is shared." }
    ],
    rev: {
      sec30: "Hooks are functions named `use...` that let function components use React features: state, effects, refs, context, memoisation and concurrency. React stores hook data per component instance and matches it by call order. You can compose hooks into custom hooks to reuse stateful logic.",
      interview: [
        { level: "basic", q: "What is a hook?", a: "A function starting with `use` that lets a function component hook into React features like state, lifecycle-style effects and context." },
        { level: "basic", q: "Name five built-in hooks.", a: "`useState`, `useEffect`, `useContext`, `useRef`, `useReducer` (plus `useMemo`, `useCallback`, `useTransition`, `useId`...)." },
        { level: "intermediate", q: "Where does hook state actually live?", a: "Not in your function. React keeps a list of hook slots on the component's fiber; each render reads them back in the same order." },
        { level: "advanced", q: "Do two components using the same custom hook share state?", a: "No. A custom hook shares logic. Each call creates its own state slots. To share data, lift state up or use context/a store." },
        { level: "tricky", q: "Is `use` (React 19) a hook?", a: "It's a React API that reads a promise or context. Unlike other hooks it **can** be called inside `if` and loops, but still only in components or hooks." }
      ],
      cheat: [
        "Hook = function named `use...` that taps into React features",
        "Only in function components and custom hooks",
        "State: `useState`, `useReducer`. Effects: `useEffect`",
        "Refs: `useRef`. Shared values: `useContext`",
        "Hook data lives with React, matched by call order",
        "Custom hooks share logic, not state"
      ]
    },
    related: ["HOOKS-002", "HOOKS-003", "HOOKS-021", "STATE-004"]
  },

  "HOOKS-002": {
    tldr: "Call hooks only at the **top level** of function components or custom hooks. Never inside `if`, loops, nested functions or after an early `return`, because React matches hooks by call order.",
    analogy: { icon: "🧺", text: "A row of numbered lockers at the gym. You always use locker 1 for shoes, 2 for your bag. Skip one on a day and your bag ends up in the shoe locker." },
    visual: { type: "compare", title: "React matches hooks by position", left: { label: "Top level (safe)", tone: "good", points: [
      "Render 1: slot 1 = name, slot 2 = cart",
      "Render 2: slot 1 = name, slot 2 = cart",
      "Same order every time, data lines up"
    ] }, right: { label: "Inside an if (broken)", tone: "bad", points: [
      "Render 1: slot 1 = name, slot 2 = cart",
      "Render 2 (if false): slot 1 = cart",
      "Cart reads name's data: wrong value or crash"
    ] } },
    points: [
      "**Rule 1**: only call hooks at the **top level**: not in conditions, loops, nested functions, `try/catch` or after an early `return`.",
      "**Rule 2**: only call hooks from **function components** or **custom hooks** (`useX`), never from plain JS functions or event handlers.",
      "Why: React stores hook data as an ordered list. The **Nth hook call** reads **slot N**. The order must never change.",
      "Need a condition? Put it **inside** the hook (`useEffect(() => { if (open) ... })`) or render a different component.",
      "Install **`eslint-plugin-react-hooks`** (included in Vite's React template): it catches both rules plus missing effect deps.",
      "Exception: the React 19 **`use`** API may be called inside `if` and loops."
    ],
    code: { file: "Checkout.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

export default function Checkout({ cart }) {
  // ✅ All hooks first, same order every render
  const [coupon, setCoupon] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // ✅ The condition lives INSIDE the hook
    if (cart.length > 0) {
      document.title = cart.length + ' items in cart';
    }
  }, [cart.length]);

  // ✅ Early return comes AFTER every hook
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <form>
      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon" />
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Gift note" />
    </form>
  );
}`, walk: [
      { lines: [5, 6], note: "Hooks at the top: React sees `coupon` as slot 1 and `note` as slot 2 every render." },
      { lines: [8, 9, 10], note: "Need a condition? Put it inside the effect body, not around `useEffect`." },
      { lines: [16, 17, 18], note: "Early return is fine **after** all hooks have run." },
      { lines: [22, 23], note: "Calling setters in event handlers is fine. Only **hook calls** have rules." }
    ]},
    output: "With an empty cart: “Your cart is empty.” With items: a coupon box, a gift-note box, and the tab title shows the item count.",
    mistakes: [
      { bad: `if (isLoggedIn) {\n  const [name, setName] = useState('');\n}`, good: `const [name, setName] = useState('');\n// use name only when isLoggedIn`, why: "When `isLoggedIn` flips, the hook count changes and every later hook reads the wrong slot." },
      { bad: `if (!product) return null;\nconst [qty, setQty] = useState(1);`, good: `const [qty, setQty] = useState(1);\nif (!product) return null;`, why: "A hook after an early return runs on some renders but not others. React throws “Rendered more hooks than during the previous render”." },
      { bad: `<button onClick={() => {\n  const [x] = useState(0);\n}}>`, good: `const [x, setX] = useState(0);\n<button onClick={() => setX(x + 1)}>`, why: "Hooks can't be called in event handlers; call them during render and use the setter in the handler." }
    ],
    practice: [
      { level: "B", q: "Is `for (const t of todos) useState(t)` allowed?", a: "No. The number of calls depends on the list length. Make a `<TodoItem />` component and call `useState` inside it." },
      { level: "B", q: "Fix: `if (show) useEffect(() => {...})`.", a: "Always call the effect; check `show` inside it.", code: `useEffect(() => {\n  if (!show) return;\n  // ...\n}, [show]);` },
      { level: "I", q: "Why can a custom hook call other hooks but a helper `formatPrice()` can't?", a: "Names starting with `use` are treated as hooks, so they are only called at the top level of components or other hooks. That keeps the order stable." },
      { level: "C", q: "Explain the error “Rendered fewer hooks than expected”.", a: "This render called fewer hooks than the last one, usually an early `return` or condition placed before a hook. Move all hooks above it." }
    ],
    quiz: [
      { q: "How does React know which state belongs to which `useState`?", options: ["By the variable name", "By the order of hook calls", "By a hidden key prop", "By the initial value"], answer: 1, why: "React stores hooks in a list and reads them back by position." },
      { q: "Which is allowed?", options: ["`useState` inside `if`", "`useEffect` inside a loop", "An `if` inside `useEffect`", "`useRef` in an onClick handler"], answer: 2, why: "Conditions belong inside the hook, not around it." },
      { q: "Where can you call hooks?", options: ["Any function", "Function components and custom hooks", "Class components"], answer: 1, why: "Those are the only two places React guarantees a stable call order." }
    ],
    rev: {
      sec30: "Two rules: call hooks at the top level only (no conditions, loops, nested functions or after early returns), and only from function components or custom hooks. React tracks hook state by call order; changing the order mixes up the data. The ESLint plugin `react-hooks` enforces this.",
      interview: [
        { level: "basic", q: "What are the rules of hooks?", a: "Only call hooks at the top level, and only from React function components or custom hooks." },
        { level: "intermediate", q: "Why can't hooks be conditional?", a: "React has no names for hooks; it matches them by call order. Skipping one shifts every later hook onto the wrong stored value." },
        { level: "intermediate", q: "How do you run an effect only sometimes?", a: "Always call `useEffect`, and put the `if` inside the effect body, or move the logic into a child component you render conditionally." },
        { level: "advanced", q: "How are the rules enforced?", a: "Statically by `eslint-plugin-react-hooks`, and at runtime React throws when the hook count changes between renders." },
        { level: "tricky", q: "Can you call any hook-like API conditionally?", a: "Yes, React 19's `use(promise | context)` can go inside `if` or loops. All `useX` hooks still follow the rules." }
      ],
      debug: [
        { code: `function Product({ item }) {\n  if (!item) return <p>Loading</p>;\n  const [qty, setQty] = useState(1);\n  return <p>{item.name} x {qty}</p>;\n}`, fix: `function Product({ item }) {\n  const [qty, setQty] = useState(1);\n  if (!item) return <p>Loading</p>;\n  return <p>{item.name} x {qty}</p>;\n}`, why: "When `item` arrives, a new hook appears. Hooks must run before any early return." }
      ],
      cheat: [
        "Top level only: no `if`, loops, nested functions, after `return`",
        "Only in function components or `useX` custom hooks",
        "React matches hooks by call order",
        "Put conditions inside the hook body",
        "Lists: one component per item, hook inside it",
        "`eslint-plugin-react-hooks` catches violations",
        "`use()` is the one API allowed conditionally"
      ]
    },
    related: ["HOOKS-001", "HOOKS-021", "HOOKS-024", "STATE-004"]
  },

  "HOOKS-003": {
    tldr: "Before hooks (React 16.8), state and lifecycles needed class components, and related logic was split across `componentDidMount`, `DidUpdate` and `WillUnmount`. Hooks group logic by purpose and let you reuse it with custom hooks.",
    analogy: { icon: "🍳", text: "Classes sort a recipe by time of day: all morning steps, all evening steps. Hooks sort it by dish: everything for the soup together, everything for the cake together." },
    visual: { type: "compare", title: "Class lifecycles vs hooks", left: { label: "Class component", tone: "bad", points: [
      "Connect chat in `componentDidMount`",
      "Reconnect in `componentDidUpdate`",
      "Disconnect in `componentWillUnmount`",
      "Reuse via HOCs or render props (wrapper hell)",
      "`this` binding and confusing `this.state`"
    ] }, right: { label: "Function + hooks", tone: "good", points: [
      "One `useEffect` holds connect + disconnect",
      "Deps array handles updates automatically",
      "Reuse via `useChatRoom()` custom hook",
      "No `this`, just variables and functions",
      "Less code, easier to test and split"
    ] } },
    points: [
      "**Problem 1: scattered logic.** One feature (a chat connection) was split over three lifecycle methods, mixed with unrelated code.",
      "**Problem 2: hard reuse.** Sharing stateful logic needed HOCs or render props, which nested wrappers deeply.",
      "**Problem 3: classes are confusing.** `this` binding, `bind` in constructors, and lifecycle edge cases.",
      "Hooks group code **by feature**: setup and cleanup sit together in one `useEffect`.",
      "Classes still work, but new code uses function components. Error boundaries are the one place you still need a class (or a library like `react-error-boundary`)."
    ],
    code: { file: "ChatRoom.jsx", lang: "jsx", src: `// ❌ Before: class, logic split over 3 methods
class ChatRoomClass extends React.Component {
  componentDidMount() {
    this.conn = connect(this.props.roomId);
  }
  componentDidUpdate(prev) {
    if (prev.roomId !== this.props.roomId) {
      this.conn.close();
      this.conn = connect(this.props.roomId);
    }
  }
  componentWillUnmount() {
    this.conn.close();
  }
  render() {
    return <h2>Room: {this.props.roomId}</h2>;
  }
}

// ✅ After: one effect, grouped by purpose
import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const conn = connect(roomId);   // setup
    return () => conn.close();      // cleanup
  }, [roomId]);                      // re-sync when room changes

  return <h2>Room: {roomId}</h2>;
}`, walk: [
      { lines: [3, 4, 5], note: "Class: connect on mount..." },
      { lines: [6, 7, 8, 9, 10, 11], note: "...remember to reconnect manually when the room changes (easy to forget)..." },
      { lines: [12, 13, 14], note: "...and disconnect on unmount, in a third place." },
      { lines: [24, 25, 26, 27], note: "Hooks: setup, cleanup and “when to re-run” all in one block." }
    ]},
    mistakes: [
      { bad: `useEffect(() => {\n  // "componentDidMount"\n  connect(roomId);\n}, []);`, good: `useEffect(() => {\n  const c = connect(roomId);\n  return () => c.close();\n}, [roomId]);`, why: "Don't translate lifecycles one-to-one. Think “keep in sync with `roomId`”, include cleanup, and list real dependencies." },
      { bad: `// rewrite every class now`, good: `// keep working classes; write new code with hooks`, why: "Classes are still supported. Migrate gradually when you touch a component." }
    ],
    practice: [
      { level: "B", q: "Which three class methods does one `useEffect` with cleanup replace?", a: "`componentDidMount`, `componentDidUpdate` (via deps) and `componentWillUnmount` (via the cleanup)." },
      { level: "I", q: "How would you reuse the chat logic in two components?", a: "Extract a custom hook.", code: `function useChatRoom(roomId) {\n  useEffect(() => {\n    const c = connect(roomId);\n    return () => c.close();\n  }, [roomId]);\n}` },
      { level: "I", q: "What replaces `this.setState({ open: true })`?", a: "`const [open, setOpen] = useState(false)` and `setOpen(true)`. Note hooks replace state instead of merging objects." },
      { level: "C", q: "Name one thing you still need a class for.", a: "Error boundaries (`componentDidCatch` / `getDerivedStateFromError`), unless you use a library like `react-error-boundary`." }
    ],
    quiz: [
      { q: "Main reason hooks were introduced?", options: ["Classes were removed from React", "To reuse stateful logic and group related code", "To make React faster than Vue", "To replace JSX"], answer: 1, why: "Hooks fix logic reuse and scattered lifecycle code. Classes were not removed." },
      { q: "Hooks arrived in which React version?", options: ["15", "16.8", "18", "19"], answer: 1, why: "React 16.8 (Feb 2019)." },
      { q: "Which still requires a class component?", options: ["State", "Side effects", "Error boundaries", "Context"], answer: 2, why: "There's no hook for catching render errors yet." }
    ],
    rev: {
      sec30: "Hooks (React 16.8) solved three class problems: related logic scattered across lifecycle methods, awkward reuse via HOCs/render props, and `this` confusion. Hooks group code by purpose (one effect = setup + cleanup) and share logic through custom hooks. Classes still run; error boundaries still need one.",
      interview: [
        { level: "basic", q: "Why were hooks introduced?", a: "To use state and effects without classes, keep related logic together, and reuse stateful logic via custom hooks instead of HOCs." },
        { level: "intermediate", q: "Map class lifecycles to hooks.", a: "Mount/update/unmount side effects become one `useEffect` with deps and cleanup. `this.state` becomes `useState`/`useReducer`. `shouldComponentUpdate` is roughly `React.memo`." },
        { level: "intermediate", q: "What is “wrapper hell”?", a: "Deeply nested HOCs and render-prop components used to share logic. Custom hooks share logic without extra tree layers." },
        { level: "advanced", q: "Is `useEffect(fn, [])` the same as `componentDidMount`?", a: "Not exactly. Effects run after paint, in Strict Mode dev they mount-cleanup-mount, and the mental model is syncing, not lifecycle events." },
        { level: "tricky", q: "Are class components deprecated?", a: "No, they're supported, but not recommended for new code. Some legacy APIs on them (string refs, `contextTypes`) were removed in React 19." }
      ],
      compare: { cols: ["", "Class", "Hooks"], rows: [
        ["State", "`this.state` + `setState` (merges)", "`useState` (replaces)"],
        ["Side effects", "3 lifecycle methods", "`useEffect` + cleanup"],
        ["Logic reuse", "HOCs, render props", "Custom hooks"],
        ["Error boundaries", "Yes", "Not yet (need a class)"]
      ] },
      cheat: [
        "Hooks: React 16.8, 2019",
        "Fixed: scattered lifecycles, hard reuse, `this` confusion",
        "One `useEffect` = mount + update + unmount logic",
        "Custom hooks replace most HOCs/render props",
        "Classes still supported, not recommended for new code",
        "Error boundaries still need a class"
      ]
    },
    related: ["HOOKS-001", "HOOKS-005", "ADV-008", "ADV-004"]
  },

  "HOOKS-004": {
    tldr: "`useState` queues updates and applies them on the next render. React skips the render if the new value is identical (`Object.is`), so objects and arrays must be **new copies** to show changes.",
    analogy: { icon: "🧾", text: "A café order slip. Each setter call adds a line to the slip; the barista (React) works through the whole slip before handing over the next drink (render)." },
    visual: { type: "timeline", title: "One click, three queued updates", frames: [
      { label: "Render", state: "likes = 0", note: "Handler reads the snapshot: `likes` is 0." },
      { label: "setLikes(likes + 1)", state: "queue: [replace 1]", note: "Uses snapshot 0, so: 1." },
      { label: "setLikes(n => n + 1)", state: "queue: [1, n+1]", note: "Updater function: uses the queued result." },
      { label: "setLikes(n => n + 1)", state: "queue: [1, n+1, n+1]", note: "Another updater." },
      { label: "Next render", state: "likes = 3", note: "React runs the queue in order: 0 → 1 → 2 → 3." }
    ]},
    points: [
      "Setters **queue** updates; React batches all of them in an event into **one** re-render.",
      "Pass an **updater** (`n => n + 1`) when the next value depends on the previous one.",
      "React compares with **`Object.is`**: same value or same object reference means **no re-render**.",
      "So never mutate: `items.push(x); setItems(items)` does nothing. Use `setItems([...items, x])`.",
      "Expensive start value? Use **lazy init**: `useState(() => loadDraft())` runs only on the first render.",
      "To store a **function** in state, wrap it: `setFn(() => myFn)`, otherwise React calls it as an updater."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState } from 'react';

function loadSongs() {
  console.log('reading saved playlist');
  return JSON.parse(localStorage.getItem('songs') ?? '[]');
}

export default function Playlist() {
  // Lazy init: loadSongs runs once, not every render
  const [songs, setSongs] = useState(loadSongs);
  const [plays, setPlays] = useState(0);

  function addSong(title) {
    // New array = new identity = React re-renders
    setSongs(prev => [...prev, { id: crypto.randomUUID(), title }]);
  }

  function playThree() {
    // Updaters chain correctly: +3
    setPlays(p => p + 1);
    setPlays(p => p + 1);
    setPlays(p => p + 1);
  }

  return (
    <div>
      <button onClick={() => addSong('New track')}>Add</button>
      <button onClick={playThree}>Play 3x ({plays})</button>
      <ul>
        {songs.map(s => <li key={s.id}>{s.title}</li>)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [10], note: "Pass the function itself (not `loadSongs()`) so it runs only on the first render." },
      { lines: [15], note: "Updater + spread: a **new** array, built from the latest queued value." },
      { lines: [20, 21, 22], note: "Three updaters in the queue: plays goes up by 3 in a single re-render." },
      { lines: [30], note: "Stable `id` keys so React tracks each song row." }
    ]},
    output: "Console logs “reading saved playlist” once (twice in Strict Mode dev). Add appends a track; Play 3x jumps the counter by 3.",
    mistakes: [
      { bad: `cart.items.push(item);\nsetCart(cart);`, good: `setCart({ ...cart, items: [...cart.items, item] });`, why: "Same object reference: `Object.is` says nothing changed, so React skips the render." },
      { bad: `const [list] = useState(expensiveParse(raw));`, good: `const [list] = useState(() => expensiveParse(raw));`, why: "The argument is evaluated on every render even though React only uses it once. Pass a function for lazy init." },
      { bad: `const [onDone, setOnDone] = useState(handler); // handler is a function`, good: `const [onDone, setOnDone] = useState(() => handler);`, why: "React treats a function argument as an initializer/updater and calls it. Wrap it to store the function itself." }
    ],
    practice: [
      { level: "B", q: "Remove a song by `id` without mutating.", a: "Filter into a new array.", code: `setSongs(prev => prev.filter(s => s.id !== id));` },
      { level: "I", q: "Rename one song (object in array) immutably.", a: "Map and copy only the changed item.", code: `setSongs(prev => prev.map(s => s.id === id ? { ...s, title } : s));` },
      { level: "I", q: "`setUser(user)` after `user.name = 'Ana'`: why no update?", a: "Same object reference. Create a new object: `setUser({ ...user, name: 'Ana' })`." },
      { level: "C", q: "Reset a form's state when the `noteId` prop changes, without an effect.", a: "Give the form a key: `<NoteForm key={noteId} />`. A new key creates a fresh instance with fresh state." }
    ],
    quiz: [
      { q: "`setN(n + 1)` three times in one click (n = 0). Next render shows?", options: ["3", "1", "0", "An error"], answer: 1, why: "Each call reads the same snapshot `n = 0`, so all three set 1." },
      { q: "You mutate an array then call `setItems(items)`. What happens?", options: ["Re-render with the new item", "Nothing; same reference", "React throws an error", "Infinite loop"], answer: 1, why: "React bails out when `Object.is(old, new)` is true." },
      { q: "When does `useState(() => load())` call `load`?", options: ["Every render", "Only the first render", "On every setter call"], answer: 1, why: "A function initializer runs once (twice in Strict Mode dev to catch impurities)." }
    ],
    rev: {
      sec30: "`useState` returns a snapshot value and a setter. Setters queue updates that React batches into one render. Use updater functions for values based on the previous one. React bails out if `Object.is` says the value is unchanged, so always create new objects/arrays. Use lazy init for expensive initial values.",
      interview: [
        { level: "basic", q: "What does `useState` return?", a: "An array: the current state value for this render and a stable setter function." },
        { level: "intermediate", q: "When should you use the updater form?", a: "When the next state depends on the previous one, especially with multiple updates in one event or in async callbacks." },
        { level: "intermediate", q: "Why must state be treated as immutable?", a: "React compares with `Object.is`. Mutating keeps the same reference, so React may skip the re-render and memoised children won't see changes." },
        { level: "advanced", q: "Is the setter function stable?", a: "Yes, its identity never changes between renders, so it's safe to omit from effect deps (the linter knows this)." },
        { level: "tricky", q: "Why does my initializer log twice?", a: "Strict Mode in development calls initializers and updaters twice to expose impure code. Production calls them once." }
      ],
      predict: [
        { code: `const [n, setN] = useState(0);\nfunction click() {\n  setN(n + 5);\n  setN(x => x + 1);\n}`, answer: "6 after one click", why: "Queue: replace with 5, then updater 5 → 6." }
      ],
      debug: [
        { code: `function addTodo(text) {\n  todos.push({ id: Date.now(), text });\n  setTodos(todos);\n}`, fix: `function addTodo(text) {\n  setTodos(prev => [...prev, { id: Date.now(), text }]);\n}`, why: "Mutation keeps the same array reference; React bails out. Create a new array." }
      ],
      cheat: [
        "Setter queues; React batches into one render",
        "`setX(prev => next)` when based on previous value",
        "`Object.is` equal → no re-render",
        "Copy, don't mutate: `[...arr]`, `{ ...obj }`",
        "Lazy init: `useState(() => heavy())`",
        "Store a function: `setFn(() => fn)`",
        "Setter identity is stable",
        "Reset state with a new `key`"
      ]
    },
    related: ["STATE-010", "STATE-016", "STATE-019", "HOOKS-008"]
  },

  "HOOKS-005": {
    tldr: "`useEffect` keeps a component **in sync with something outside React** (a server, a chat socket, a timer, the tab title). It runs after render (usually after paint), re-runs when its dependencies change, and cleans up before re-running or unmounting.",
    analogy: { icon: "📡", text: "A radio tuned to a station (your deps). Change the station and it first stops the old one (cleanup), then tunes in the new one (setup). Turn the radio off and it stops for good." },
    visual: { type: "cycle", title: "The effect lifecycle", steps: [
      { label: "Render + paint", detail: "React renders with `city = 'Paris'` and the browser paints the screen." },
      { label: "Setup runs", detail: "Effect starts: fetch Paris weather, open a socket, start a timer." },
      { label: "Deps change", detail: "`city` becomes `'Rome'`. React compares deps with `Object.is`: different, so re-sync." },
      { label: "Cleanup old", detail: "The previous effect's cleanup runs: abort the Paris fetch, close the socket." },
      { label: "Setup again", detail: "New effect runs for Rome. On unmount, only cleanup runs." }
    ]},
    points: [
      "**Deps array** decides when to re-run: none = after **every** render; `[]` = once after mount; `[a, b]` = when `a` or `b` change.",
      "Return a **cleanup** function to undo setup (abort fetch, clear interval, unsubscribe). It runs before the next effect and on unmount.",
      "**Strict Mode (dev only)** runs setup → cleanup → setup once on mount to prove your cleanup works. Production runs it once.",
      "**Race conditions**: a slow old fetch can finish last. Guard with an `ignore` flag or `AbortController` in cleanup.",
      "**Infinite loop**: setting state the effect depends on, or a new object/function in deps every render.",
      "**You might not need an effect**: compute derived values during render, and handle user actions in event handlers."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

export default function Weather({ city }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;                  // race guard
    const controller = new AbortController();
    const url = '/api/weather?city=' + encodeURIComponent(city);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!ignore) setWeather(data);   // only the latest city wins
      })
      .catch(err => {
        if (!ignore && err.name !== 'AbortError') setError(err.message);
      });

    return () => {                       // cleanup
      ignore = true;
      controller.abort();
    };
  }, [city]);                            // re-sync when city changes

  if (error) return <p>⚠️ {error}</p>;
  if (!weather) return <p>Loading {city}...</p>;
  return <p>{city}: {weather.temp}°C, {weather.summary}</p>;
}`, walk: [
      { lines: [7], note: "The effect runs **after** React commits the render (usually after paint), never during render." },
      { lines: [8, 9], note: "Per-run guards: each run of the effect gets its own `ignore` flag and controller." },
      { lines: [17, 18], note: "If the user switched city meanwhile, `ignore` is true and the stale result is dropped." },
      { lines: [24, 25, 26, 27], note: "Cleanup: runs before the next `city` effect and on unmount. Also runs once in Strict Mode dev." },
      { lines: [28], note: "Every reactive value used inside (`city`) must be listed. The linter enforces this." }
    ]},
    output: "“Loading Paris...” then “Paris: 18°C, Sunny”. Switch quickly to Rome: a late Paris response is ignored, so it can never overwrite Rome's weather.",
    mistakes: [
      { bad: `const [total, setTotal] = useState(0);\nuseEffect(() => {\n  setTotal(price * qty);\n}, [price, qty]);`, good: `const total = price * qty; // just compute it`, why: "Derived data doesn't need an effect. The effect version renders twice and briefly shows the wrong total." },
      { bad: `useEffect(() => {\n  setCount(count + 1);\n}); // no deps`, good: `useEffect(() => {\n  // sync with something external only\n}, [roomId]);`, why: "No deps = run after every render. Setting state triggers another render, which runs the effect again: infinite loop." },
      { bad: `const options = { room };\nuseEffect(() => {\n  connect(options);\n}, [options]);`, good: `useEffect(() => {\n  const options = { room };\n  connect(options);\n}, [room]);`, why: "A new object each render is never `Object.is` equal, so the effect re-runs every render. Create it inside the effect and depend on primitives." }
    ],
    practice: [
      { level: "B", q: "Set the tab title to the number of unread chat messages.", a: "Depend on the count.", code: `useEffect(() => {\n  document.title = unread + ' unread';\n}, [unread]);` },
      { level: "B", q: "Start a clock that ticks every second and stops on unmount.", a: "Use `setInterval` with an updater and clear it in cleanup.", code: `useEffect(() => {\n  const id = setInterval(() => setSecs(s => s + 1), 1000);\n  return () => clearInterval(id);\n}, []);` },
      { level: "I", q: "Listen to `window` resize and remove the listener on unmount.", a: "Add in setup, remove the same function in cleanup.", code: `useEffect(() => {\n  const onResize = () => setW(window.innerWidth);\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []);` },
      { level: "I", q: "A “Buy” button POSTs an order. Effect or handler?", a: "Event handler. It's caused by a specific user action, not by the component being on screen. In an effect it would fire twice in Strict Mode." },
      { level: "C", q: "Why does Strict Mode connect, disconnect, connect in dev? How do you fix duplicate side effects?", a: "It simulates unmount/remount to test cleanup. Don't block it; write a cleanup that fully undoes setup (close, abort, unsubscribe)." }
    ],
    quiz: [
      { q: "`useEffect(fn, [])` runs...", options: ["Before the first render", "After every render", "Once after mount (setup + cleanup + setup in Strict Mode dev)", "Only on unmount"], answer: 2, why: "Empty deps = after mount. Dev Strict Mode adds one extra cleanup/setup cycle." },
      { q: "When does the cleanup function run?", options: ["Only on unmount", "Before the next effect run and on unmount", "Before every render", "Never in production"], answer: 1, why: "Cleanup undoes the previous setup before re-syncing, and on unmount." },
      { q: "Best way to show `fullName` from `first` and `last` state?", options: ["`useEffect` that sets `fullName` state", "`const fullName = first + ' ' + last`", "`useRef` updated in an effect", "`useLayoutEffect`"], answer: 1, why: "Derived values should be calculated during render. No effect needed." }
    ],
    rev: {
      sec30: "`useEffect(setup, deps)` syncs a component with an external system after paint. Deps control re-runs (none = every render, `[]` = mount, `[x]` = when x changes). Cleanup undoes setup before re-runs and on unmount. Guard fetches against races. Strict Mode dev runs mount twice to test cleanup. Don't use effects for derived data or user events.",
      interview: [
        { level: "basic", q: "What is `useEffect` for?", a: "Synchronising with systems outside React (network, subscriptions, timers, DOM APIs) after render. Not for calculating values." },
        { level: "intermediate", q: "Explain the three dependency array forms.", a: "Omitted: runs after every render. `[]`: runs once after mount. `[a, b]`: runs after mount and whenever `a` or `b` change by `Object.is`." },
        { level: "intermediate", q: "How do you prevent a fetch race condition?", a: "In the effect, create an `ignore` flag or `AbortController`; in cleanup set `ignore = true` / call `abort()`. Only the latest request updates state. Libraries like TanStack Query handle this for you." },
        { level: "advanced", q: "Why does my effect run twice in development?", a: "`<StrictMode>` remounts components once in dev (setup, cleanup, setup) to surface missing cleanup. Production runs it once. Fix the cleanup, don't remove Strict Mode." },
        { level: "advanced", q: "What is a stale closure in an effect?", a: "The effect captured values from an old render, e.g. an interval reading `count` with `[]` deps always sees 0. Fix with correct deps, an updater `setCount(c => c + 1)`, or `useEffectEvent` (React 19.2)." },
        { level: "tricky", q: "When should you NOT use an effect?", a: "To transform data for rendering (compute it), to handle user events (use handlers), to reset state on prop change (use a `key`), or to chain state updates." }
      ],
      predict: [
        { code: `const [count, setCount] = useState(0);\nuseEffect(() => {\n  const id = setInterval(() => {\n    setCount(count + 1);\n  }, 1000);\n  return () => clearInterval(id);\n}, []);`, answer: "Shows 1 and stays at 1 forever", why: "The interval closes over `count = 0` from the first render, so it keeps setting 0 + 1. Use `setCount(c => c + 1)`." },
        { code: `useEffect(() => {\n  console.log('setup');\n  return () => console.log('cleanup');\n}, []);\n// Strict Mode, development`, answer: "setup, cleanup, setup", why: "Dev Strict Mode simulates an unmount/remount once." }
      ],
      debug: [
        { code: `useEffect(() => {\n  fetch('/api/notes').then(r => r.json()).then(setNotes);\n}, [notes]);`, fix: `useEffect(() => {\n  let ignore = false;\n  fetch('/api/notes').then(r => r.json())\n    .then(d => { if (!ignore) setNotes(d); });\n  return () => { ignore = true; };\n}, []);`, why: "Depending on `notes` while setting `notes` (a new array each time) loops forever. Fetch once and guard with cleanup." }
      ],
      scenario: [
        { q: "Search box fetches results per keystroke; old results sometimes overwrite new ones.", a: "Race condition. Abort or ignore stale requests in cleanup, and debounce the query. In real apps prefer TanStack Query or a framework loader." }
      ],
      compare: { cols: ["", "Event handler", "useEffect"], rows: [
        ["Triggered by", "A specific user action", "Component showing / deps changing"],
        ["Example", "Submit order, add to cart", "Connect chat, sync title, subscribe"],
        ["Strict Mode dev", "Runs once per click", "Setup runs twice on mount"]
      ] },
      cheat: [
        "Effect = sync with an external system, after paint",
        "No deps: every render. `[]`: mount. `[x]`: when x changes",
        "Return cleanup: abort, clear, unsubscribe",
        "Strict Mode dev: setup → cleanup → setup",
        "Race guard: `ignore` flag or `AbortController`",
        "Objects/functions in deps re-run every render",
        "Derived data: compute in render. User actions: handlers",
        "Prefer TanStack Query / loaders for real data fetching"
      ]
    },
    related: ["HOOKS-011", "HOOKS-020", "API-030", "RENDER-015"]
  },

  "HOOKS-006": {
    tldr: "`useContext(SomeContext)` reads a value provided higher up the tree, so you don't pass props through every layer (prop drilling). When the provided value changes, every reader re-renders.",
    analogy: { icon: "📻", text: "Shop background music. The shop plays one station; any aisle can listen in without running a cable from the till to every shelf." },
    visual: { type: "tree", title: "Provide once, read anywhere below", root: { label: "<CartContext value={cart}>", note: "provider", children: [
      { label: "Header", children: [ { label: "CartBadge", note: "useContext(CartContext) → 3 items" } ] },
      { label: "ProductList", children: [ { label: "ProductCard", children: [ { label: "AddButton", note: "useContext(CartContext) → add()" } ] } ] },
      { label: "Footer", note: "doesn't read context, not affected" }
    ] } },
    points: [
      "Three steps: **create** (`createContext(default)`), **provide** (`<Ctx value={...}>`), **read** (`useContext(Ctx)`).",
      "React 19: render the context itself as the provider: `<CartContext value={cart}>`. `<CartContext.Provider>` still works.",
      "`useContext` returns the value of the **nearest provider above**; with no provider you get the **default** from `createContext`.",
      "When `value` changes (`Object.is`), **all** readers re-render, even through `memo`. Memoise object values with `useMemo`.",
      "Good for app-wide, rarely-changing data: theme, current user, language, cart. Not a replacement for all state."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { createContext, useContext, useState, useMemo } from 'react';

// 1. Create (default used only when there is no provider)
const CartContext = createContext({ items: [], add: () => {} });

function CartBadge() {
  const { items } = useContext(CartContext);   // 3. Read
  return <span>🛒 {items.length}</span>;
}

function AddButton({ product }) {
  const { add } = useContext(CartContext);
  return <button onClick={() => add(product)}>Add {product}</button>;
}

export default function App() {
  const [items, setItems] = useState([]);

  // Stable object: readers only re-render when items change
  const cart = useMemo(() => ({
    items,
    add: p => setItems(prev => [...prev, p]),
  }), [items]);

  return (
    // 2. Provide (React 19 syntax)
    <CartContext value={cart}>
      <CartBadge />
      <AddButton product="Coffee" />
      <AddButton product="Bagel" />
    </CartContext>
  );
}`, walk: [
      { lines: [4], note: "Create the context once, outside components. The default is a fallback." },
      { lines: [7], note: "Any component inside the provider can read it, no matter how deep." },
      { lines: [20, 21, 22, 23], note: "`useMemo` keeps the same object until `items` changes, avoiding pointless re-renders." },
      { lines: [27], note: "React 19: `<CartContext value>` is the provider. Older code uses `.Provider`." }
    ]},
    output: "“🛒 0” and two buttons. Clicking Add Coffee updates the badge to “🛒 1”, though the badge never received a prop.",
    mistakes: [
      { bad: `function App() {\n  const theme = useContext(ThemeContext);\n  return <ThemeContext value="dark">...</ThemeContext>;\n}`, good: `// read it in a CHILD of the provider\nfunction Toolbar() {\n  const theme = useContext(ThemeContext);\n}`, why: "`useContext` looks **above** the calling component. A component never sees the provider it renders itself." },
      { bad: `<UserContext value={{ user, logout }}>`, good: `const value = useMemo(() => ({ user, logout }), [user, logout]);\n<UserContext value={value}>`, why: "A new object on every render makes every reader re-render whenever the parent renders." }
    ],
    practice: [
      { level: "B", q: "Create a `ThemeContext` with default `'light'` and read it in a `Button`.", a: "`createContext('light')` then `useContext(ThemeContext)`.", code: `const ThemeContext = createContext('light');\nfunction Button() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Save</button>;\n}` },
      { level: "I", q: "Write a `useCart()` helper that throws if used outside the provider.", a: "Use `null` as the default and check it.", code: `const CartContext = createContext(null);\nexport function useCart() {\n  const ctx = useContext(CartContext);\n  if (!ctx) throw new Error('useCart must be inside <CartProvider>');\n  return ctx;\n}` },
      { level: "I", q: "Can you nest two `ThemeContext` providers? What does a reader get?", a: "Yes. A reader gets the value from the **nearest** provider above it." },
      { level: "C", q: "A huge context holds `user` and `cart`; adding to cart re-renders the profile page. Fix?", a: "Split into `UserContext` and `CartContext` (or use a store with selectors like Zustand)." }
    ],
    quiz: [
      { q: "With no provider above, `useContext(Ctx)` returns...", options: ["`undefined` always", "The default passed to `createContext`", "An error", "The last provided value"], answer: 1, why: "The default value is used only when no provider is found." },
      { q: "In React 19, which provides a context?", options: ["`<Ctx value={v}>`", "`<Ctx.Consumer>`", "`Ctx.provide(v)`", "`useContext(Ctx, v)`"], answer: 0, why: "React 19 lets you render the context as the provider; `.Provider` still works." },
      { q: "A provider's value changes. Which components re-render?", options: ["Only direct children", "All components reading that context", "Nothing until refresh", "Only components wrapped in memo"], answer: 1, why: "Every consumer re-renders, even if a parent is memoised." }
    ],
    rev: {
      sec30: "Context passes data deep without prop drilling. `createContext(default)` → provide with `<Ctx value>` (React 19) or `<Ctx.Provider>` → read with `useContext(Ctx)`. Readers get the nearest provider's value or the default. Any value change re-renders all readers, so memoise object values and split unrelated contexts.",
      interview: [
        { level: "basic", q: "What problem does `useContext` solve?", a: "Prop drilling: passing data through many components that don't use it, just to reach a deep child." },
        { level: "intermediate", q: "What happens when the context value changes?", a: "Every component that reads that context re-renders, regardless of `memo` on intermediate components." },
        { level: "intermediate", q: "How do you avoid unnecessary context re-renders?", a: "Memoise the value object with `useMemo`/`useCallback`, split contexts by concern, or move fast-changing state to a store with selectors." },
        { level: "advanced", q: "Context vs Redux/Zustand?", a: "Context is a transport for values, not a state manager. Fine for low-frequency data; stores add selectors, devtools and avoid re-rendering every consumer." },
        { level: "tricky", q: "Can you read context conditionally?", a: "Not with `useContext`. React 19's `use(Ctx)` can be called inside `if` or after an early return." }
      ],
      cheat: [
        "`createContext(default)` outside components",
        "React 19: `<Ctx value={v}>` is the provider",
        "`useContext(Ctx)`: nearest provider above, else default",
        "Value change → all readers re-render",
        "Memoise object values; split unrelated contexts",
        "Wrap in a `useX()` hook that throws outside the provider"
      ]
    },
    related: ["COMM-006", "COMM-008", "PROPS-011", "STORE-002"]
  },

  "HOOKS-007": {
    tldr: "`useRef` gives you a box (`ref.current`) that survives re-renders but **doesn't trigger** one when changed. Use it for DOM nodes (focus, scroll, measure) and for values like timer IDs.",
    analogy: { icon: "📌", text: "A sticky note on your fridge. You can rewrite it any time and it stays there, but nobody gets an alert when it changes. State is the doorbell; a ref is the sticky note." },
    visual: { type: "compare", title: "useRef vs useState", left: { label: "useState", tone: "neutral", points: [
      "Change it → React re-renders",
      "Value is a snapshot per render",
      "Use for anything shown on screen",
      "Update via setter"
    ] }, right: { label: "useRef", tone: "neutral", points: [
      "Change it → nothing re-renders",
      "Same mutable object every render",
      "DOM nodes, timer IDs, latest values",
      "Update by assigning `ref.current = x`"
    ] } },
    points: [
      "`const ref = useRef(initial)` returns `{ current: initial }`, the **same object** every render.",
      "**DOM ref**: `<input ref={inputRef} />` then `inputRef.current.focus()` in a handler or effect.",
      "**Mutable value**: store interval IDs, a previous value, or a click counter that shouldn't redraw the UI.",
      "Don't read or write `ref.current` **during render** (except lazy init). Use it in handlers and effects.",
      "React 19: `ref` is a normal **prop** on function components (no `forwardRef`), and ref callbacks can return a **cleanup**.",
      "Previous value: React docs prefer storing it in **state** and comparing during render; the `useRef` + effect version is common in interviews."
    ],
    code: { file: "RecipeTimer.jsx", lang: "jsx", src: `import { useState, useRef } from 'react';

export default function RecipeTimer() {
  const [secs, setSecs] = useState(0);
  const intervalRef = useRef(null);   // timer ID, not shown on screen
  const noteRef = useRef(null);       // DOM node

  function start() {
    if (intervalRef.current) return;  // already running
    intervalRef.current = setInterval(() => {
      setSecs(s => s + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    noteRef.current.focus();          // jump to the notes box
  }

  return (
    <div>
      <h2>⏱️ {secs}s</h2>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <input ref={noteRef} placeholder="Notes: pasta al dente?" />
    </div>
  );
}`, walk: [
      { lines: [5], note: "The interval ID must survive renders but never needs to be displayed: a ref." },
      { lines: [6], note: "Starts as `null`; React fills `noteRef.current` with the input after mount." },
      { lines: [9, 10], note: "Read and write the ref freely inside event handlers. No re-render." },
      { lines: [18], note: "Use the DOM node imperatively: focus it." },
      { lines: [26], note: "Attach the ref with the `ref` prop." }
    ]},
    output: "Start counts up every second; Stop freezes the timer and puts the cursor in the Notes box.",
    mistakes: [
      { bad: `const count = useRef(0);\n<button onClick={() => count.current++}>\n  {count.current}\n</button>`, good: `const [count, setCount] = useState(0);\n<button onClick={() => setCount(c => c + 1)}>\n  {count}\n</button>`, why: "Changing a ref doesn't re-render, so the screen shows a stale number. Anything displayed belongs in state." },
      { bad: `function Search() {\n  const inputRef = useRef(null);\n  inputRef.current.focus(); // during render\n}`, good: `useEffect(() => {\n  inputRef.current.focus();\n}, []);`, why: "During the first render the DOM node doesn't exist yet (`current` is `null`). Touch DOM refs in effects or handlers." }
    ],
    practice: [
      { level: "B", q: "Focus a search input when the page loads.", a: "Ref + effect (or the `autoFocus` attribute).", code: `const ref = useRef(null);\nuseEffect(() => { ref.current.focus(); }, []);\nreturn <input ref={ref} />;` },
      { level: "I", q: "Scroll a chat list to the newest message when `messages` changes.", a: "Ref on a bottom element, `scrollIntoView` in an effect.", code: `const endRef = useRef(null);\nuseEffect(() => {\n  endRef.current?.scrollIntoView({ behavior: 'smooth' });\n}, [messages]);\n// <div ref={endRef} /> at the bottom` },
      { level: "I", q: "Write `usePrevious(value)`.", a: "Store the value in a ref in an effect. It reads the ref during render, which React discourages; the docs prefer the state version.", code: `function usePrevious(value) {\n  const ref = useRef();\n  useEffect(() => { ref.current = value; }, [value]);\n  return ref.current; // value from the previous render\n}` },
      { level: "C", q: "Pass a ref to a custom `<TextField>` in React 19.", a: "Accept `ref` as a normal prop and put it on the input.", code: `function TextField({ ref, ...props }) {\n  return <input ref={ref} {...props} />;\n}` }
    ],
    quiz: [
      { q: "Changing `ref.current` causes...", options: ["A re-render", "No re-render", "An error", "A remount"], answer: 1, why: "Refs are plain mutable boxes React doesn't watch." },
      { q: "When is a DOM ref's `current` set?", options: ["Before the first render", "After React commits the DOM", "Only after a click", "During render"], answer: 1, why: "React assigns DOM nodes in the commit phase, so effects and handlers can use them." },
      { q: "Best place for a `setInterval` ID?", options: ["`useState`", "`useRef`", "A module-level variable shared by all instances", "`useContext`"], answer: 1, why: "It must persist per instance and not cause renders." }
    ],
    rev: {
      sec30: "`useRef(init)` returns a stable `{ current }` object that persists across renders and doesn't trigger re-renders when mutated. Use it for DOM access (focus, scroll, measure), timer IDs and other non-visual values. Don't read/write it during render. React 19 passes `ref` as a regular prop and supports ref-callback cleanup.",
      interview: [
        { level: "basic", q: "Difference between `useRef` and `useState`?", a: "Both persist across renders. Updating state re-renders; mutating a ref doesn't. Use refs for values that don't affect the output." },
        { level: "intermediate", q: "Why not a normal `let` variable instead of a ref?", a: "A local variable is recreated every render. A module variable is shared by all instances. A ref is per instance and persists." },
        { level: "intermediate", q: "How do you track the previous value of a prop?", a: "A `usePrevious` hook storing the value in a ref inside an effect, or (React's recommendation) keep `prev` in state and update it during render when the value changes." },
        { level: "advanced", q: "How do you pass a ref to a child component in React 19?", a: "Just pass `ref` as a prop; function components receive it in props. `forwardRef` is no longer needed and will be deprecated." },
        { level: "tricky", q: "Why is reading `ref.current` during render discouraged?", a: "It makes render impure and unpredictable: React won't re-render when it changes, and concurrent renders may see different values." }
      ],
      predict: [
        { code: `const renders = useRef(0);\nrenders.current++;\nconsole.log(renders.current);\n// component renders 3 times, Strict Mode off`, answer: "Logs 1, 2, 3", why: "The same ref object persists; mutating it doesn't cause extra renders. (Mutating during render is discouraged, but it shows persistence.)" }
      ],
      cheat: [
        "`useRef(init)` → `{ current }`, same object every render",
        "Mutating `current` never re-renders",
        "DOM: `<input ref={r} />` → `r.current.focus()`",
        "Store timer IDs, previous values, flags",
        "Don't read/write during render",
        "Shown on screen? Use state instead",
        "React 19: `ref` is a plain prop, no `forwardRef`"
      ]
    },
    related: ["HOOKS-012", "ADV-007", "HOOKS-004", "EVT-011"]
  },

  "HOOKS-008": {
    tldr: "`useReducer` moves state changes into one pure function: `reducer(state, action) → newState`. Components just `dispatch({ type: 'added' })`. Great when many actions change the same state.",
    analogy: { icon: "🧑‍🍳", text: "Waiters don't cook. They hand the kitchen an order ticket (action); the kitchen (reducer) follows the recipe and sends out the new plate (state)." },
    visual: { type: "cycle", title: "The reducer loop", steps: [
      { label: "Event", detail: "User clicks **Add Coffee**." },
      { label: "dispatch(action)", detail: "`dispatch({ type: 'added', item })`: describe **what happened**." },
      { label: "reducer(state, action)", detail: "Pure function returns a **new** state object. No fetches, no mutation." },
      { label: "Re-render", detail: "React stores the new state and re-renders with it." }
    ]},
    points: [
      "`const [state, dispatch] = useReducer(reducer, initialState)`.",
      "The **reducer** is pure: same input → same output; return new objects, never mutate, no side effects.",
      "Actions describe **what happened** (`'added'`, `'removed'`), usually `{ type, ...data }`.",
      "Pick it over `useState` when the next state depends on several values, or many handlers update the same object.",
      "`dispatch` is **stable** (same identity every render), so it's safe to pass down or omit from deps.",
      "Strict Mode (dev) calls the reducer **twice** to catch impure reducers. Same idea as Redux, but local to one component."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useReducer } from 'react';

function cartReducer(state, action) {
  switch (action.type) {
    case 'added': {
      const found = state.find(i => i.id === action.item.id);
      if (found) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'removed':
      return state.filter(i => i.id !== action.id);
    case 'cleared':
      return [];
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

const coffee = { id: 1, name: 'Coffee', price: 3 };

export default function Cart() {
  const [items, dispatch] = useReducer(cartReducer, []);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'added', item: coffee })}>Add coffee</button>
      <button onClick={() => dispatch({ type: 'cleared' })}>Clear</button>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.name} x {i.qty}
            <button onClick={() => dispatch({ type: 'removed', id: i.id })}>✕</button>
          </li>
        ))}
      </ul>
      <p>Total: £{total}</p>
    </div>
  );
}`, walk: [
      { lines: [3, 4], note: "The reducer lives outside the component: easy to unit test with no React." },
      { lines: [8, 9, 11], note: "Always return **new** arrays/objects: `map`, spread, `filter`." },
      { lines: [18], note: "Unknown actions throw, so typos surface fast." },
      { lines: [25], note: "Hook it up: `items` is the state, `dispatch` sends actions." },
      { lines: [26], note: "Derived total is calculated during render, not stored." },
      { lines: [30, 36], note: "Handlers only describe what happened. The logic lives in one place." }
    ]},
    output: "Add coffee twice → “Coffee x 2”, “Total: £6”. ✕ removes the line; Clear empties the cart.",
    mistakes: [
      { bad: `case 'added':\n  state.push(action.item);\n  return state;`, good: `case 'added':\n  return [...state, action.item];`, why: "Mutating returns the same reference, so React skips the re-render." },
      { bad: `case 'saved':\n  fetch('/api/cart', { method: 'POST' });\n  return state;`, good: `// handler: dispatch, then call the API\nasync function save() {\n  await fetch('/api/cart', { method: 'POST' });\n  dispatch({ type: 'saved' });\n}`, why: "Reducers must be pure. Side effects in them run twice in Strict Mode and break predictability." }
    ],
    practice: [
      { level: "B", q: "Add a `'decremented'` action that lowers qty and removes the item at 0.", a: "Map qty down, then filter zeros.", code: `case 'decremented':\n  return state\n    .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)\n    .filter(i => i.qty > 0);` },
      { level: "I", q: "Load the initial cart from `localStorage` lazily.", a: "Use the third `init` argument.", code: `const [items, dispatch] = useReducer(\n  cartReducer,\n  'cart',\n  key => JSON.parse(localStorage.getItem(key) ?? '[]')\n);` },
      { level: "I", q: "Write a Vitest test for `cartReducer`.", a: "It's a plain function: call it and assert.", code: `test('adds item', () => {\n  const next = cartReducer([], { type: 'added', item: { id: 1, price: 3 } });\n  expect(next).toEqual([{ id: 1, price: 3, qty: 1 }]);\n});` },
      { level: "C", q: "Share `items` and `dispatch` with deep children without props.", a: "Put them in two contexts (`CartContext`, `CartDispatchContext`). `dispatch` is stable, so its context never changes." }
    ],
    quiz: [
      { q: "What should a reducer do?", options: ["Fetch data and return it", "Return the next state from state + action, purely", "Mutate state for speed", "Call `setState`"], answer: 1, why: "Reducers are pure calculations." },
      { q: "When is `useReducer` a better fit than `useState`?", options: ["A single boolean toggle", "Many related actions updating one object", "Storing a DOM node", "Reading context"], answer: 1, why: "Centralising many transitions is the reducer's strength." },
      { q: "Your reducer logs twice per action in dev. Why?", options: ["A bug in React", "Strict Mode double-calls reducers to catch impurity", "You dispatched twice", "The reducer is defined inside the component"], answer: 1, why: "Development only; production calls it once." }
    ],
    rev: {
      sec30: "`useReducer(reducer, initial)` returns `[state, dispatch]`. Components dispatch actions describing what happened; a pure reducer returns the next state. It centralises complex transitions, is easy to test, and `dispatch` is stable. Never mutate or run side effects in the reducer.",
      interview: [
        { level: "basic", q: "What does `useReducer` return?", a: "`[state, dispatch]`: the current state and a function to send actions to the reducer." },
        { level: "intermediate", q: "`useState` vs `useReducer`?", a: "`useState` for simple, independent values. `useReducer` when many actions update related state, or update logic is complex enough to test separately." },
        { level: "intermediate", q: "Why must reducers be pure?", a: "React may call them more than once (Strict Mode, concurrent rendering). Side effects or mutation would duplicate work or skip renders." },
        { level: "advanced", q: "`useReducer` + Context vs Redux Toolkit?", a: "Reducer + context is fine for a feature's state. Redux Toolkit adds a global store, devtools, middleware, selectors that avoid re-rendering every consumer, and RTK Query." },
        { level: "tricky", q: "Is `useState` built on `useReducer`?", a: "Conceptually yes: `useState` is a reducer whose action is the new value or an updater function." }
      ],
      debug: [
        { code: `function reducer(state, action) {\n  if (action.type === 'renamed') {\n    state.name = action.name;\n  }\n  return state;\n}`, fix: `function reducer(state, action) {\n  if (action.type === 'renamed') {\n    return { ...state, name: action.name };\n  }\n  return state;\n}`, why: "Mutation keeps the same object, so the UI doesn't update." }
      ],
      cheat: [
        "`const [state, dispatch] = useReducer(reducer, initial, init?)`",
        "Reducer: `(state, action) => newState`, pure",
        "Actions: `{ type: 'added', ...payload }`",
        "Never mutate; no fetches or timers inside",
        "`dispatch` identity is stable",
        "Strict Mode dev calls reducers twice",
        "Test reducers as plain functions"
      ]
    },
    related: ["HOOKS-004", "STORE-007", "STATE-014", "HOOKS-006"]
  },

  "HOOKS-009": {
    tldr: "`useMemo(fn, deps)` caches a calculated value between renders and recalculates only when deps change. Use it for genuinely slow work, or to keep an object's identity stable for memoised children and effect deps.",
    analogy: { icon: "🧮", text: "A receipt total you've already added up. If the basket hasn't changed, you just read the old total instead of adding every item again." },
    visual: { type: "flow", title: "What useMemo does each render", steps: [
      { label: "Render starts", detail: "React reaches `useMemo(() => filter(products, query), [products, query])`." },
      { label: "Compare deps", detail: "Each dep is compared to last render with `Object.is`." },
      { label: "Same → reuse", detail: "Return the cached result. The function is not called." },
      { label: "Changed → recompute", detail: "Call the function, store the new result and deps." },
      { label: "Same reference out", detail: "Unchanged result keeps the same identity: `memo` children and effects don't re-run." }
    ]},
    points: [
      "**Two reasons** to use it: skip a **slow calculation** (measure first: about 1ms or more), or keep **referential equality** for `memo` children / effect deps.",
      "Plain objects and arrays are **new every render**, so `{} !== {}`. `useMemo` returns the same reference while deps are equal.",
      "Usually **unnecessary**: cheap math, string building, or values not passed to memoised components.",
      "It's a **performance hint**, not a guarantee. React may drop the cache, so your code must still work without it.",
      "Strict Mode (dev) calls your function **twice**. Keep it pure.",
      "The **React Compiler** memoises automatically; with it on, most manual `useMemo` can go."
    ],
    code: { file: "ProductSearch.jsx", lang: "jsx", src: `import { useState, useMemo, memo } from 'react';

function filterProducts(products, query) {
  console.log('filtering', products.length, 'products');
  const q = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(q));
}

const ProductList = memo(function ProductList({ items }) {
  return <ul>{items.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
});

export default function ProductSearch({ products }) {
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);

  // Recalculate only when products or query change
  const visible = useMemo(
    () => filterProducts(products, query),
    [products, query]
  );

  return (
    <div className={dark ? 'dark' : ''}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={() => setDark(d => !d)}>Toggle theme</button>
      <ProductList items={visible} />
    </div>
  );
}`, walk: [
      { lines: [3, 4], note: "Pretend this is slow (10,000 products). The log shows when it really runs." },
      { lines: [9], note: "`memo` skips re-rendering if `items` is the **same reference** as last time." },
      { lines: [18, 19, 20, 21], note: "Cached result + deps. Typing changes `query`, so it recomputes." },
      { lines: [26], note: "Toggling the theme re-renders the parent, but `visible` is reused: no filtering, and `ProductList` skips." }
    ]},
    output: "Typing logs “filtering ...” per keystroke (twice in Strict Mode dev). Clicking Toggle theme logs nothing and the list doesn't re-render.",
    mistakes: [
      { bad: `const label = useMemo(() => 'Hi ' + name, [name]);`, good: `const label = 'Hi ' + name;`, why: "Cheap work costs more to memoise (deps array + comparison) than to redo. Memoise only slow or identity-sensitive values." },
      { bad: `const sorted = useMemo(() => items.sort(byPrice), [items]);`, good: `const sorted = useMemo(() => [...items].sort(byPrice), [items]);`, why: "`sort` mutates the original (props/state). Copy first; memoised functions must be pure." },
      { bad: `useMemo(() => {\n  fetch('/api/stats');\n}, [id]);`, good: `useEffect(() => {\n  fetch('/api/stats');\n}, [id]);`, why: "`useMemo` runs during render and must be pure. Side effects belong in effects or handlers." }
    ],
    practice: [
      { level: "B", q: "Is `useMemo` needed for `const total = price * qty`?", a: "No. It's trivial to compute; just calculate it in render." },
      { level: "I", q: "Memoise an options object so an effect with `[options]` doesn't re-run every render.", a: "Better: create it inside the effect and depend on primitives. Or memoise it.", code: `const options = useMemo(() => ({ room, server }), [room, server]);\nuseEffect(() => {\n  const c = connect(options);\n  return () => c.close();\n}, [options]);` },
      { level: "I", q: "How do you check if a calculation is slow enough to memoise?", a: "Wrap it with `console.time`/`console.timeEnd`, or use the React Profiler. Test with CPU throttling; about 1ms+ is worth memoising." },
      { level: "C", q: "Why does `useMemo` without `memo` on the child often not help?", a: "The child re-renders anyway when its parent does. Stable props only matter if the child is memoised (or the value is an effect dep)." }
    ],
    quiz: [
      { q: "`useMemo` returns...", options: ["A memoised function", "The cached result of calling the function", "A ref", "A promise"], answer: 1, why: "It caches a **value**. `useCallback` caches a function." },
      { q: "When does the calculation re-run?", options: ["Every render", "When any dependency changes (`Object.is`)", "Only on mount", "When the parent unmounts"], answer: 1, why: "Same deps → cached value reused." },
      { q: "Which is a good use?", options: ["Memoising `a + b`", "Filtering 20,000 products passed to a `memo` list", "Fetching data", "Wrapping every value \"just in case\""], answer: 1, why: "Slow work + identity for a memoised child: both reasons apply." }
    ],
    rev: {
      sec30: "`useMemo(calc, deps)` caches a calculation's result across renders, recomputing only when deps change. Use it for slow calculations or to keep referential equality for `memo` children and effect deps. Skip it for cheap work. It must be pure and is only a hint: React may discard the cache. The React Compiler can do this automatically.",
      interview: [
        { level: "basic", q: "What does `useMemo` do?", a: "Caches a computed value and returns it again until a dependency changes." },
        { level: "intermediate", q: "What is referential equality and why does it matter?", a: "Objects are equal only if they're the same reference. A new object each render breaks `memo` and re-runs effects; `useMemo` keeps the same reference." },
        { level: "intermediate", q: "When is `useMemo` unnecessary?", a: "For cheap calculations, values not passed to memoised children or deps, or when the React Compiler is enabled." },
        { level: "advanced", q: "Can you rely on `useMemo` for correctness?", a: "No. React may throw the cache away (e.g. offscreen). Your code must work without it; use state or a ref for guaranteed persistence." },
        { level: "tricky", q: "`useMemo` vs `React.memo`?", a: "`useMemo` caches a value inside a component. `React.memo` wraps a component to skip re-rendering when its props are shallowly equal. They're often used together." }
      ],
      predict: [
        { code: `const a = useMemo(() => ({ n: 1 }), []);\nconst b = { n: 1 };\n// on the second render:\nconsole.log(a === prevA, b === prevB);`, answer: "true false", why: "`a` is cached with empty deps; `b` is a brand new object each render." }
      ],
      cheat: [
        "`useMemo(() => calc(a, b), [a, b])` caches a value",
        "Two reasons: slow calc, stable reference",
        "Pair with `memo` children or effect deps",
        "Cheap work? Don't memoise",
        "Must be pure; Strict Mode dev runs it twice",
        "A hint, not a guarantee",
        "React Compiler auto-memoises"
      ]
    },
    related: ["HOOKS-010", "PERF-005", "ADV-001", "ADV-021"]
  },

  "HOOKS-010": {
    tldr: "`useCallback(fn, deps)` returns the **same function** across renders until deps change. It only helps when that function is passed to a `memo` child or used as an effect/hook dependency.",
    analogy: { icon: "📇", text: "Handing your barista the same loyalty card every visit. A new card each time looks like a new customer; the same card says “nothing changed, carry on”." },
    visual: { type: "timeline", title: "Function identity across renders", frames: [
      { label: "Render 1", state: "plain: fn#1   memo'd: fn#A", note: "Both created fresh on the first render." },
      { label: "Render 2 (theme)", state: "plain: fn#2   memo'd: fn#A", note: "Plain function is new; `useCallback` returns the cached one." },
      { label: "Render 3 (theme)", state: "plain: fn#3   memo'd: fn#A", note: "`memo` child with `fn#A` skips rendering." },
      { label: "Render 4 (cartId)", state: "plain: fn#4   memo'd: fn#B", note: "A dep changed, so `useCallback` makes a new function." }
    ]},
    points: [
      "Every render creates **new function objects**: `() => {}` !== `() => {}`.",
      "`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`: it caches the **function**, not its result.",
      "Only useful when identity matters: props of a **`memo`** child, or a dependency of `useEffect` / `useMemo` / custom hooks.",
      "Use **updater functions** (`setItems(prev => ...)`) so the callback needs fewer deps.",
      "Without a `memo` child, wrapping handlers in `useCallback` just adds overhead. The **React Compiler** handles this automatically."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useState, useCallback, memo } from 'react';

const ProductRow = memo(function ProductRow({ product, onAdd }) {
  console.log('render row', product.name);
  return (
    <li>
      {product.name}
      <button onClick={() => onAdd(product)}>Add</button>
    </li>
  );
});

const products = [{ id: 1, name: 'Tea' }, { id: 2, name: 'Scone' }];

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [dark, setDark] = useState(false);

  // Same function every render: no deps thanks to the updater
  const handleAdd = useCallback(product => {
    setCart(prev => [...prev, product]);
  }, []);

  return (
    <div className={dark ? 'dark' : ''}>
      <button onClick={() => setDark(d => !d)}>Theme</button>
      <p>Cart: {cart.length}</p>
      <ul>
        {products.map(p => <ProductRow key={p.id} product={p} onAdd={handleAdd} />)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [3], note: "`memo` re-renders the row only if `product` or `onAdd` change identity." },
      { lines: [20, 21, 22], note: "Cached function. Updater form means it never needs `cart` as a dep." },
      { lines: [26], note: "Theme toggle re-renders `Shop`..." },
      { lines: [29], note: "...but `handleAdd` is the same reference, so rows don't log." }
    ]},
    output: "First render logs both rows. Toggling Theme logs nothing. Adding to cart updates “Cart: N” and the rows still don't re-render.",
    mistakes: [
      { bad: `const onClick = useCallback(() => setOpen(true), []);\nreturn <button onClick={onClick}>Open</button>;`, good: `return <button onClick={() => setOpen(true)}>Open</button>;`, why: "A plain DOM `<button>` doesn't care about identity. `useCallback` here is pure overhead." },
      { bad: `const add = useCallback(item => {\n  setCart([...cart, item]);\n}, []);`, good: `const add = useCallback(item => {\n  setCart(prev => [...prev, item]);\n}, []);`, why: "With `[]` deps the callback keeps the first render's `cart` (stale closure). Use an updater or list `cart` in deps." }
    ],
    practice: [
      { level: "B", q: "What's the `useMemo` equivalent of `useCallback(fn, [a])`?", a: "`useMemo(() => fn, [a])`." },
      { level: "I", q: "A child effect re-subscribes every render because `onMessage` changes. Fix in the parent.", a: "Wrap it in `useCallback` with its real deps.", code: `const onMessage = useCallback(msg => {\n  setMessages(prev => [...prev, msg]);\n}, []);` },
      { level: "I", q: "You wrapped `onAdd` in `useCallback` but rows still re-render. Why?", a: "The child isn't wrapped in `memo`, or another prop (like an inline object) changes each render." },
      { level: "C", q: "Return a stable `save(note)` from a custom hook `useNotes()`.", a: "Wrap returned functions in `useCallback` so consumers can use them in deps.", code: `function useNotes() {\n  const [notes, setNotes] = useState([]);\n  const save = useCallback(note => setNotes(n => [...n, note]), []);\n  return { notes, save };\n}` }
    ],
    quiz: [
      { q: "`useCallback` caches...", options: ["The return value of the function", "The function itself", "The component", "The props"], answer: 1, why: "It returns the same function reference while deps are unchanged." },
      { q: "When does `useCallback` actually help?", options: ["On every `onClick` of a `<button>`", "When passing a function to a `memo` child or as a dep", "When the function is slow", "Never"], answer: 1, why: "Identity only matters to things that compare it." },
      { q: "`useCallback(() => setN(n + 1), [])`: what's the bug?", options: ["None", "Stale `n`: always uses the first render's value", "Infinite loop", "It throws"], answer: 1, why: "Missing dep. Use `setN(x => x + 1)`." }
    ],
    rev: {
      sec30: "`useCallback(fn, deps)` keeps a function's identity stable between renders, recreating it only when deps change. It matters for `memo` children and dependency arrays; elsewhere it's overhead. Use updater functions to keep deps small and avoid stale closures. The React Compiler can memoise automatically.",
      interview: [
        { level: "basic", q: "What does `useCallback` do?", a: "Returns a memoised function that keeps the same reference until one of its dependencies changes." },
        { level: "intermediate", q: "`useCallback` vs `useMemo`?", a: "`useCallback(fn, d)` caches the function; `useMemo(() => x, d)` caches a value. `useCallback(fn, d)` equals `useMemo(() => fn, d)`." },
        { level: "intermediate", q: "Does `useCallback` make a function faster?", a: "No. The function still runs normally. It only prevents a new function being created as a new identity, which helps `memo` children skip renders." },
        { level: "advanced", q: "How do you avoid stale closures in a memoised callback?", a: "List every value it reads in deps, or use updater functions/refs so it needs none. For effect callbacks in React 19.2, `useEffectEvent` reads the latest values." },
        { level: "tricky", q: "Should you wrap every handler in `useCallback`?", a: "No. It adds memory and comparison cost and clutters code. Use it when identity matters, or let the React Compiler handle it." }
      ],
      compare: { cols: ["", "useMemo", "useCallback"], rows: [
        ["Caches", "A value (result)", "A function"],
        ["Signature", "`useMemo(() => calc(), deps)`", "`useCallback(fn, deps)`"],
        ["Typical use", "Filtered list, derived object", "Handler passed to `memo` child"]
      ] },
      cheat: [
        "`useCallback(fn, deps)` = `useMemo(() => fn, deps)`",
        "Keeps function identity stable",
        "Helps only with `memo` children or deps",
        "Updater functions shrink deps",
        "Missing deps → stale closure",
        "Plain DOM elements don't need it",
        "React Compiler makes most manual use unnecessary"
      ]
    },
    related: ["HOOKS-009", "PERF-006", "ADV-001", "HOOKS-020"]
  },

  "HOOKS-011": {
    tldr: "`useLayoutEffect` runs **after React updates the DOM but before the browser paints**. Use it to measure layout (size, position) and adjust it, so the user never sees a flicker. It blocks painting, so prefer `useEffect` otherwise.",
    analogy: { icon: "🪞", text: "Checking your outfit in the mirror before leaving home, not after you're out. You fix the crooked collar before anyone sees it." },
    visual: { type: "flow", title: "Where each effect runs", steps: [
      { label: "Render", detail: "React calls your component and works out the changes." },
      { label: "Commit DOM", detail: "React updates the real DOM. Refs are attached." },
      { label: "useLayoutEffect", detail: "Measure with `getBoundingClientRect()`; set state. React re-renders **synchronously**." },
      { label: "Browser paints", detail: "The user sees the final, corrected layout. No flicker." },
      { label: "useEffect", detail: "Runs after paint: fetching, subscriptions, logging." }
    ]},
    points: [
      "Same API as `useEffect`: `useLayoutEffect(setup, deps)` with optional cleanup.",
      "Runs **synchronously before paint**, so state set inside it updates the screen in the same frame.",
      "Use it for: tooltip/popover positioning, measuring an element's height, scroll position restore.",
      "It **blocks** the browser from painting; heavy work here makes the app feel slow.",
      "It does nothing useful on the server (no layout during SSR). Default to **`useEffect`** and switch only if you see flicker."
    ],
    code: { file: "Tooltip.jsx", lang: "jsx", src: `import { useState, useRef, useLayoutEffect } from 'react';

export default function Tooltip({ text, targetRect }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    // Measure BEFORE the browser paints
    const { height } = ref.current.getBoundingClientRect();
    setHeight(height);
  }, [text]);

  // Not enough room above? Show below instead
  let top = targetRect.top - height;
  if (top < 0) top = targetRect.bottom;

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', left: targetRect.left, top }}
      className="tooltip"
    >
      {text}
    </div>
  );
}`, walk: [
      { lines: [5], note: "First render: height unknown (0). The tooltip would appear in the wrong place." },
      { lines: [7, 8, 9, 10], note: "DOM exists now. Measure, then set state. React re-renders before the browser paints." },
      { lines: [14, 15], note: "Second render uses the real height to flip above/below." },
      { lines: [18, 19, 20], note: "The user only ever sees the final position." }
    ]},
    output: "A tooltip that sits above its button, or flips below when there's no room, without ever flashing in the wrong spot.",
    mistakes: [
      { bad: `useLayoutEffect(() => {\n  fetch('/api/products').then(...);\n}, []);`, good: `useEffect(() => {\n  fetch('/api/products').then(...);\n}, []);`, why: "Nothing visual to fix before paint. `useLayoutEffect` only delays the first paint." },
      { bad: `useEffect(() => {\n  setTop(ref.current.offsetHeight);\n}, []);\n// tooltip jumps visibly`, good: `useLayoutEffect(() => {\n  setTop(ref.current.offsetHeight);\n}, []);`, why: "With `useEffect`, the wrong position is painted first, then corrected: a visible flicker." }
    ],
    practice: [
      { level: "B", q: "Which runs first after a commit: `useEffect` or `useLayoutEffect`?", a: "`useLayoutEffect` (before paint). `useEffect` runs after paint." },
      { level: "I", q: "Measure a note card's height and show it.", a: "Ref + layout effect.", code: `const ref = useRef(null);\nconst [h, setH] = useState(0);\nuseLayoutEffect(() => {\n  setH(ref.current.offsetHeight);\n}, [note]);\nreturn <div ref={ref}>{note} ({h}px)</div>;` },
      { level: "I", q: "Keep a chat scrolled to the bottom without a visible jump when messages arrive.", a: "Set `scrollTop = scrollHeight` in a `useLayoutEffect` on `[messages]`." },
      { level: "C", q: "On a server-rendered page, why does the tooltip first appear unmeasured?", a: "Layout effects don't run on the server; the server HTML has the unmeasured layout. Render a fallback, or render the measured part only on the client." }
    ],
    quiz: [
      { q: "`useLayoutEffect` runs...", options: ["Before render", "After DOM update, before paint", "After paint", "Only on the server"], answer: 1, why: "That's the window where you can measure and fix layout invisibly." },
      { q: "Main downside?", options: ["Can't return cleanup", "Blocks the browser from painting", "Runs only once", "Can't set state"], answer: 1, why: "Heavy work delays what the user sees." },
      { q: "Best choice for fetching products?", options: ["`useLayoutEffect`", "`useEffect`"], answer: 1, why: "Fetching has nothing to do with layout before paint." }
    ],
    rev: {
      sec30: "`useLayoutEffect` has the same signature as `useEffect` but fires synchronously after DOM mutations and before paint. Use it to measure layout and apply corrections (tooltips, popovers, scroll), avoiding flicker. It blocks paint and doesn't run on the server, so use `useEffect` by default.",
      interview: [
        { level: "basic", q: "Difference between `useEffect` and `useLayoutEffect`?", a: "Timing. `useLayoutEffect` runs before the browser paints and blocks it; `useEffect` runs after paint." },
        { level: "intermediate", q: "When would you reach for `useLayoutEffect`?", a: "When you must read layout (size/position) and update the UI before the user sees it, e.g. positioning a tooltip." },
        { level: "advanced", q: "What happens when you set state inside `useLayoutEffect`?", a: "React re-renders synchronously and flushes it before painting, so the user only sees the final result." },
        { level: "advanced", q: "Why is it a performance risk?", a: "The browser can't paint until it finishes, including any synchronous re-render it triggers. Slow code here causes jank." },
        { level: "tricky", q: "Does `useLayoutEffect` run during SSR?", a: "No. There's no layout on the server, so it only runs after hydration on the client." }
      ],
      compare: { cols: ["", "useEffect", "useLayoutEffect"], rows: [
        ["Timing", "After paint", "After DOM update, before paint"],
        ["Blocks paint", "No", "Yes"],
        ["Use for", "Fetch, subscribe, log", "Measure + adjust layout"],
        ["Default?", "Yes", "Only to fix flicker"]
      ] },
      cheat: [
        "Same API as `useEffect`",
        "Runs after DOM commit, before paint",
        "State set inside re-renders before paint",
        "Use for measuring/positioning (tooltips)",
        "Blocks paint: keep it fast",
        "Not run on the server",
        "Default to `useEffect`"
      ]
    },
    related: ["HOOKS-005", "HOOKS-007", "RENDER-004", "HOOKS-017"]
  },

  "HOOKS-012": {
    tldr: "`useImperativeHandle` lets a component decide **what a parent's ref sees**: instead of the whole DOM node, expose a small custom API like `focus()` and `clear()`.",
    analogy: { icon: "🎛️", text: "A TV remote. You get play, pause and volume buttons, not a screwdriver to open the TV. The component hands out the remote, not its insides." },
    visual: { type: "compare", title: "What the parent's ref gets", left: { label: "Plain ref on <input>", tone: "neutral", points: [
      "The whole DOM node",
      "Parent can change styles, value, anything",
      "Tight coupling to the child's markup"
    ] }, right: { label: "With useImperativeHandle", tone: "good", points: [
      "Only `{ focus, clear }`",
      "Child keeps control of its internals",
      "Markup can change; the API stays"
    ] } },
    points: [
      "Signature: `useImperativeHandle(ref, () => ({ ...methods }), deps)`.",
      "React 19: the child receives `ref` as a **normal prop**, so no `forwardRef` wrapper is needed.",
      "Inside, keep your own `useRef` for the real DOM node and expose methods that use it.",
      "Use it for **imperative actions** only: focus, scroll, play/pause, reset. Not for data that props can describe.",
      "Prefer props first: `<Modal isOpen>` beats `modalRef.current.open()`."
    ],
    code: { file: "ChatBox.jsx", lang: "jsx", src: `import { useRef, useImperativeHandle } from 'react';

// Child: ref arrives as a normal prop (React 19)
function MessageInput({ ref, placeholder }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    clear() {
      inputRef.current.value = '';
    },
  }), []);

  return <input ref={inputRef} placeholder={placeholder} />;
}

// Parent: only sees { focus, clear }
export default function ChatBox() {
  const msgRef = useRef(null);

  function send() {
    // ...send the message
    msgRef.current.clear();
    msgRef.current.focus();
  }

  return (
    <div>
      <MessageInput ref={msgRef} placeholder="Say hi 👋" />
      <button onClick={send}>Send</button>
    </div>
  );
}`, walk: [
      { lines: [4], note: "React 19: destructure `ref` from props like any other prop." },
      { lines: [5], note: "The child keeps its own private ref to the real input." },
      { lines: [7, 8, 9, 10, 11, 12, 13, 14], note: "Build the handle object the parent will see. `[]` deps: create it once." },
      { lines: [25, 26], note: "The parent calls the custom methods. It can't touch `style` or other DOM internals." }
    ]},
    output: "Typing and clicking Send empties the input and puts the cursor back in it, ready for the next message.",
    mistakes: [
      { bad: `useImperativeHandle(ref, () => ({\n  setText: t => setText(t)\n}));\n// parent: ref.current.setText('hi')`, good: `<MessageInput text={text} onTextChange={setText} />`, why: "If a prop can express it, use a prop. Imperative handles are for actions like focus/scroll, not for data flow." },
      { bad: `const MessageInput = forwardRef((props, ref) => { ... });\n// in new React 19 code`, good: `function MessageInput({ ref, ...props }) { ... }`, why: "In React 19 `ref` is a regular prop for function components. `forwardRef` still works but is no longer needed." }
    ],
    practice: [
      { level: "B", q: "Expose only `scrollToBottom()` from a `ChatLog` component.", a: "Keep a ref on the list div and expose one method.", code: `function ChatLog({ ref, messages }) {\n  const listRef = useRef(null);\n  useImperativeHandle(ref, () => ({\n    scrollToBottom() {\n      listRef.current.scrollTop = listRef.current.scrollHeight;\n    }\n  }), []);\n  return <div ref={listRef}>{/* messages */}</div>;\n}` },
      { level: "I", q: "Expose `play()` and `pause()` for a custom `<AudioPlayer>`.", a: "Wrap the `<audio>` element's methods.", code: `useImperativeHandle(ref, () => ({\n  play: () => audioRef.current.play(),\n  pause: () => audioRef.current.pause(),\n}), []);` },
      { level: "C", q: "When do the `deps` matter?", a: "When exposed methods read props/state. List them so the handle is rebuilt with fresh values, otherwise methods see stale data." }
    ],
    quiz: [
      { q: "What does `useImperativeHandle` control?", options: ["The child's state", "The value a parent's ref receives", "When the child re-renders", "The DOM structure"], answer: 1, why: "It customises `ref.current` for the parent." },
      { q: "React 19: how does a function component receive a ref?", options: ["Only via `forwardRef`", "As a normal `ref` prop", "Through context", "It can't"], answer: 1, why: "`ref` is now a regular prop on function components." },
      { q: "Good use case?", options: ["Passing a list of products", "Exposing `focus()` on a custom input", "Changing the theme", "Fetching data"], answer: 1, why: "Imperative actions that props can't express well." }
    ],
    rev: {
      sec30: "`useImperativeHandle(ref, createHandle, deps)` replaces what a parent's ref points to with a custom object, e.g. `{ focus, clear }`, hiding the DOM node. In React 19 the child takes `ref` as a regular prop. Use it sparingly, for imperative actions only; prefer props for data.",
      interview: [
        { level: "basic", q: "What is `useImperativeHandle` for?", a: "Exposing a limited, custom API to a parent's ref instead of the raw DOM node." },
        { level: "intermediate", q: "How did this work before React 19?", a: "The child had to be wrapped in `forwardRef((props, ref) => ...)`. Now `ref` is just a prop." },
        { level: "intermediate", q: "Why not expose the DOM node directly?", a: "Encapsulation: the parent can't depend on or mess with internal markup, and you can change implementation without breaking callers." },
        { level: "advanced", q: "What do the deps do?", a: "They control when the handle object is recreated. Without correct deps, exposed methods may close over stale props or state." },
        { level: "tricky", q: "Is `useImperativeHandle` an anti-pattern?", a: "Not by itself, but overusing it fights React's declarative model. Use it for focus/scroll/media controls; use props and state for everything else." }
      ],
      cheat: [
        "`useImperativeHandle(ref, () => ({ ... }), deps)`",
        "Parent's `ref.current` = your custom object",
        "React 19: `ref` is a regular prop, no `forwardRef`",
        "Keep a private `useRef` for the real DOM node",
        "For actions: focus, scroll, play, reset",
        "Data flow? Use props instead"
      ]
    },
    related: ["HOOKS-007", "ADV-007", "ADV-012", "ADV-005"]
  },

  "HOOKS-013": {
    tldr: "`useId()` generates a unique ID per component instance that matches between server and client rendering. Use it to link labels, inputs and ARIA attributes. Never use it for list keys.",
    analogy: { icon: "🏷️", text: "Name tags at a cooking class. Every student gets a unique tag, so the teacher's “pass the whisk to Sam” always reaches the right person, even with two Sams." },
    visual: { type: "tree", title: "Each instance gets its own ID", root: { label: "SignupForm", children: [
      { label: "PasswordField #1", note: "useId() → id A", children: [
        { label: "<input id=A aria-describedby=A-hint>" },
        { label: "<p id=A-hint>" }
      ] },
      { label: "PasswordField #2", note: "useId() → id B", children: [
        { label: "<input id=B aria-describedby=B-hint>" },
        { label: "<p id=B-hint>" }
      ] }
    ] } },
    points: [
      "`const id = useId()` returns a string that is unique per instance and **stable across re-renders**.",
      "**SSR-safe**: based on the component's position in the tree, so server HTML and client hydration produce the same ID (no mismatch).",
      "Hard-coded IDs break when a component renders twice; `Math.random()` breaks hydration. `useId` fixes both.",
      "One call per component is enough: derive more with suffixes, e.g. `id + '-hint'`.",
      "**Not for list keys**: keys should come from your data (`todo.id`). Don't rely on the ID's exact format.",
      "Status: stable since React 18."
    ],
    code: { file: "PasswordField.jsx", lang: "jsx", src: `import { useId } from 'react';

function PasswordField({ label }) {
  const id = useId();
  const hintId = id + '-hint';

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="password" aria-describedby={hintId} />
      <p id={hintId}>At least 8 characters, one number.</p>
    </div>
  );
}

export default function SignupForm() {
  return (
    <form>
      <PasswordField label="Password" />
      <PasswordField label="Confirm password" />
    </form>
  );
}`, walk: [
      { lines: [4], note: "One unique ID for this instance, same on server and client." },
      { lines: [5], note: "Derive related IDs with a suffix instead of calling `useId` again." },
      { lines: [9, 10, 11], note: "Clicking the label focuses the input; screen readers read the hint." },
      { lines: [19, 20], note: "Two instances, two different IDs: no duplicate `id` attributes." }
    ]},
    output: "Two password fields. Clicking “Confirm password” focuses the second input, not the first.",
    mistakes: [
      { bad: `<label htmlFor="email">Email</label>\n<input id="email" />`, good: `const id = useId();\n<label htmlFor={id}>Email</label>\n<input id={id} />`, why: "If the component renders twice on a page, both inputs share `id=\"email\"` and labels point to the wrong field." },
      { bad: `{todos.map(t => <Todo key={useId()} />)}`, good: `{todos.map(t => <Todo key={t.id} />)}`, why: "Hooks can't run in loops, and keys must come from data so React can track items." }
    ],
    practice: [
      { level: "B", q: "Link a newsletter checkbox to its label with `useId`.", a: "Use the same id on `htmlFor` and the input.", code: `const id = useId();\nreturn (<>\n  <input id={id} type="checkbox" />\n  <label htmlFor={id}>Email me recipes</label>\n</>);` },
      { level: "I", q: "Why not `const id = 'f' + Math.random()`?", a: "It changes every render and differs between server and client, causing hydration mismatches and broken label links." },
      { level: "C", q: "Two separate React apps on one page produce clashing IDs. Fix?", a: "Pass a different `identifierPrefix` option to each `createRoot` (or `hydrateRoot`)." }
    ],
    quiz: [
      { q: "Main purpose of `useId`?", options: ["List keys", "Unique, SSR-stable IDs for accessibility attributes", "Database IDs", "Random numbers"], answer: 1, why: "It links labels, inputs and ARIA attributes safely." },
      { q: "Why is `useId` SSR-safe?", options: ["It uses a timestamp", "It's derived from the component's position in the tree", "It reads a cookie", "It isn't"], answer: 1, why: "Same tree on server and client → same IDs." },
      { q: "Need IDs for an input and its hint. Best approach?", options: ["Call `useId` once and add a suffix", "Call `useId` in a loop", "Use `Date.now()`"], answer: 0, why: "One call, derived IDs." }
    ],
    rev: {
      sec30: "`useId()` returns a unique, stable string per component instance that matches between server render and hydration. Use it for `htmlFor`/`id` and `aria-*` links. Call once and add suffixes. Not for list keys. Use `identifierPrefix` on roots when multiple React apps share a page.",
      interview: [
        { level: "basic", q: "What does `useId` return?", a: "A unique string ID for this component instance, stable across re-renders." },
        { level: "intermediate", q: "Why not hard-code IDs?", a: "Reusable components can render many times; duplicate IDs break label association and accessibility." },
        { level: "intermediate", q: "Why not use `Math.random()` or a counter?", a: "They change between renders and between server and client, causing hydration mismatches." },
        { level: "advanced", q: "How does `useId` stay consistent between server and client?", a: "It's derived from the component's path in the tree, which is the same during SSR and hydration." },
        { level: "tricky", q: "Can `useId` be used as a React key?", a: "No. Keys must be derived from the data items; `useId` is per component, and hooks can't be called in a `map` anyway." }
      ],
      cheat: [
        "`const id = useId()` per component instance",
        "Stable across renders, same on server and client",
        "For `htmlFor`, `id`, `aria-describedby`, `aria-labelledby`",
        "Derive more: `id + '-hint'`",
        "Never for list keys",
        "Multiple roots: `identifierPrefix`",
        "Don't depend on the ID's format"
      ]
    },
    related: ["EVT-012", "PROD-016", "RENDER-017", "HOOKS-001"]
  },

  "HOOKS-014": {
    tldr: "`useTransition` marks a state update as **non-urgent**. React keeps the UI responsive (typing, clicks), renders the slow update in the background, and gives you `isPending` to show a hint.",
    analogy: { icon: "🍽️", text: "A restaurant. Pouring water (urgent) happens right away; the main course (transition) cooks in the back. If you change your order, the kitchen drops the old dish and starts the new one." },
    visual: { type: "flow", title: "Urgent vs transition updates", steps: [
      { label: "Click “Albums” tab", detail: "Handler calls `startTransition(() => setTab('albums'))`." },
      { label: "isPending = true", detail: "React re-renders urgently first: old tab still shown, a spinner appears." },
      { label: "Background render", detail: "React renders the slow Albums list in chunks, yielding to the browser." },
      { label: "User clicks “Songs”", detail: "New input interrupts. React throws away the half-done Albums render." },
      { label: "Commit", detail: "The latest transition finishes; screen updates, `isPending` becomes false." }
    ]},
    points: [
      "`const [isPending, startTransition] = useTransition()`; wrap state updates: `startTransition(() => setTab(next))`.",
      "Transition renders are **interruptible**: urgent updates (typing, clicks) go first, stale work is discarded.",
      "**Don't** use it for controlled input values: the text box must update urgently.",
      "React 19: `startTransition` accepts **async** functions (Actions); `isPending` stays true until they finish. Wrap state updates after `await` in another `startTransition`.",
      "It doesn't make the slow component faster; it keeps the rest of the app usable meanwhile.",
      "Status: stable since React 18. Standalone `startTransition` exists for use outside components."
    ],
    code: { file: "MusicTabs.jsx", lang: "jsx", src: `import { useState, useTransition, memo } from 'react';

function SlowAlbum({ n }) {
  const end = performance.now() + 1;       // fake 1ms of work per row
  while (performance.now() < end) {}
  return <li>Album #{n}</li>;
}

const SlowAlbums = memo(function SlowAlbums() {
  const rows = Array.from({ length: 300 }, (_, i) => i + 1);
  return <ul>{rows.map(n => <SlowAlbum key={n} n={n} />)}</ul>;
});

export default function MusicTabs() {
  const [tab, setTab] = useState('songs');
  const [isPending, startTransition] = useTransition();

  function select(next) {
    startTransition(() => {
      setTab(next);                       // non-urgent update
    });
  }

  return (
    <div>
      <button onClick={() => select('songs')}>Songs</button>
      <button onClick={() => select('albums')}>Albums (slow)</button>
      <button onClick={() => select('artists')}>Artists</button>
      {isPending && <span> ⏳ loading...</span>}
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {tab === 'songs' && <p>🎵 Your top 10 songs</p>}
        {tab === 'albums' && <SlowAlbums />}
        {tab === 'artists' && <p>🎤 Artists you follow</p>}
      </div>
    </div>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], note: "300 rows x 1ms = a slow tab. Many small components let React pause between them." },
      { lines: [16], note: "`isPending` tells you a transition is in progress." },
      { lines: [19, 20, 21], note: "Mark the tab change as non-urgent. React may interrupt it." },
      { lines: [29, 30], note: "Keep showing the old tab, dimmed, with a hint, instead of freezing." }
    ]},
    output: "Click Albums then immediately Artists: the UI never freezes; Artists appears right away and the half-rendered Albums is abandoned.",
    mistakes: [
      { bad: `<input value={text} onChange={e =>\n  startTransition(() => setText(e.target.value))\n} />`, good: `<input value={text} onChange={e => {\n  setText(e.target.value);              // urgent\n  startTransition(() => setQuery(e.target.value));\n}} />`, why: "Controlled input values must update urgently or typing lags/drops characters. Transition only the expensive state." },
      { bad: `startTransition(async () => {\n  const data = await save();\n  setResult(data); // not a transition anymore\n});`, good: `startTransition(async () => {\n  const data = await save();\n  startTransition(() => setResult(data));\n});`, why: "In React 19, updates after an `await` lose the transition context. Wrap them again." }
    ],
    practice: [
      { level: "B", q: "Show a spinner while a slow tab renders.", a: "Read `isPending` from `useTransition` and render `{isPending && <Spinner />}`." },
      { level: "I", q: "Search: keep the input instant but filter 10,000 recipes as a transition.", a: "Two pieces of state: `text` (urgent) and `query` (transition).", code: `function onChange(e) {\n  setText(e.target.value);\n  startTransition(() => setQuery(e.target.value));\n}` },
      { level: "I", q: "Save a note with an async Action and disable the button while saving.", a: "Pass an async function; `isPending` covers the whole await.", code: `<button disabled={isPending} onClick={() =>\n  startTransition(async () => {\n    await saveNote(note);\n  })\n}>Save</button>` },
      { level: "C", q: "`useTransition` vs debouncing the search?", a: "Debounce delays by a fixed time and works for network calls. Transitions start immediately, adapt to device speed, and get interrupted; they don't reduce network requests." }
    ],
    quiz: [
      { q: "What does `startTransition` do to an update?", options: ["Makes it synchronous", "Marks it non-urgent and interruptible", "Runs it on a web worker", "Delays it by 300ms"], answer: 1, why: "React can pause or abandon transition renders for urgent work." },
      { q: "Should a controlled input's `value` update in a transition?", options: ["Yes, always", "No, it must be urgent", "Only in production"], answer: 1, why: "Typing must feel instant." },
      { q: "In React 19, `isPending` with an async function stays true...", options: ["Only for the first render", "Until the async function completes", "Forever", "Never becomes true"], answer: 1, why: "Async transitions (Actions) keep pending until they finish." }
    ],
    rev: {
      sec30: "`useTransition` returns `[isPending, startTransition]`. Updates inside `startTransition` are non-urgent: React renders them interruptibly in the background so typing and clicks stay responsive, and shows the old UI meanwhile. Don't use it for input values. React 19 adds async Actions: `isPending` stays true until they resolve.",
      interview: [
        { level: "basic", q: "What does `useTransition` return?", a: "`[isPending, startTransition]`: a flag for pending transitions and a function that marks updates as non-urgent." },
        { level: "intermediate", q: "What problem does it solve?", a: "A slow re-render (big list, heavy tab) blocking user input. Transitions let urgent updates jump the queue and keep the old UI visible." },
        { level: "intermediate", q: "`useTransition` vs `useDeferredValue`?", a: "`useTransition` wraps the **update** when you own the setter. `useDeferredValue` defers a **value** you receive (e.g. a prop) when you can't wrap its setter." },
        { level: "advanced", q: "What changed in React 19?", a: "`startTransition` accepts async functions (Actions). `isPending` covers the async work; updates after `await` need wrapping again. Forms and `useActionState` build on this." },
        { level: "tricky", q: "Does a transition make the slow component render faster?", a: "No. Total work is the same (or more). It just keeps the app responsive and can skip stale renders." }
      ],
      scenario: [
        { q: "Switching to a heavy Reports tab freezes the nav bar for half a second.", a: "Wrap `setTab` in `startTransition`, dim the old tab using `isPending`, and memoise or virtualise the heavy list." }
      ],
      cheat: [
        "`const [isPending, startTransition] = useTransition()`",
        "Wrap non-urgent updates: `startTransition(() => setX(v))`",
        "Interruptible; stale renders discarded",
        "Never for controlled input values",
        "React 19: async Actions; wrap updates after `await`",
        "Doesn't speed up the component itself",
        "Stable since React 18"
      ]
    },
    related: ["HOOKS-015", "RENDER-013", "RENDER-014", "HOOKS-018"]
  },

  "HOOKS-015": {
    tldr: "`useDeferredValue(value)` gives you a copy of a value that **lags behind** during busy moments. Feed it to a slow part of the UI so the fast part (like a text box) stays instant.",
    analogy: { icon: "📺", text: "Live sports subtitles. The picture (input) is live; the subtitles (slow list) catch up a moment later. Nobody wants the picture to freeze while subtitles are typed." },
    visual: { type: "timeline", title: "Typing “tea” in a recipe search", frames: [
      { label: "Type t", state: "query = 't'  deferred = ''", note: "Input updates instantly. React starts a background render with 't'." },
      { label: "Type e", state: "query = 'te'  deferred = ''", note: "New keystroke interrupts the background render." },
      { label: "Type a", state: "query = 'tea'  deferred = ''", note: "Still typing: list keeps showing old results, dimmed." },
      { label: "Pause", state: "query = 'tea'  deferred = 'tea'", note: "Background render completes; slow list shows results for 'tea'." }
    ]},
    points: [
      "`const deferred = useDeferredValue(value)`: on urgent renders it returns the **old** value, then re-renders in the background with the new one.",
      "Wrap the slow child in **`memo`**, otherwise it re-renders with the parent anyway and nothing is gained.",
      "Show staleness with `value !== deferred` (e.g. dim the list).",
      "Use it when you **receive** a value (prop, URL param) and can't wrap its setter in `startTransition`.",
      "No fixed delay like debounce: fast devices catch up almost instantly. It doesn't reduce network requests.",
      "React 19: optional `initialValue`: `useDeferredValue(query, '')` for the first render. Stable since React 18."
    ],
    code: { file: "RecipeSearch.jsx", lang: "jsx", src: `import { useState, useDeferredValue, memo } from 'react';

const allRecipes = Array.from({ length: 5000 }, (_, i) => 'Recipe ' + i);

function SlowItem({ name }) {
  const end = performance.now() + 1;   // pretend each row is slow (1ms)
  while (performance.now() < end) {}
  return <li>{name}</li>;
}

const SlowResults = memo(function SlowResults({ query }) {
  const hits = allRecipes.filter(r => r.includes(query)).slice(0, 200);
  return <ul>{hits.map(r => <SlowItem key={r} name={r} />)}</ul>;
});

export default function RecipeSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search recipes"
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SlowResults query={deferredQuery} />
      </div>
    </div>
  );
}`, walk: [
      { lines: [11], note: "`memo` is essential: it lets the slow list skip renders while `deferredQuery` hasn't changed." },
      { lines: [17], note: "`query` updates urgently, so the input never lags." },
      { lines: [18], note: "`deferredQuery` lags behind while React is busy." },
      { lines: [19, 28], note: "Dim old results while the new ones render in the background." },
      { lines: [29], note: "The slow part reads the deferred value; the input reads the live one." }
    ]},
    output: "Typing feels instant even though the list takes about 200ms to render; the list dims, then updates when you pause.",
    mistakes: [
      { bad: `function SlowResults({ query }) { ... }\n// no memo`, good: `const SlowResults = memo(function SlowResults({ query }) { ... });`, why: "Without `memo`, the list re-renders on every parent render with the same deferred value, so typing still lags." },
      { bad: `const deferred = useDeferredValue({ q: query });`, good: `const deferred = useDeferredValue(query);`, why: "A new object each render is always \"different\", so every render schedules a wasted background re-render. Pass primitives or memoised values." }
    ],
    practice: [
      { level: "B", q: "Show “Updating...” while results are stale.", a: "Compare live and deferred values.", code: `{query !== deferredQuery && <p>Updating...</p>}` },
      { level: "I", q: "A `<ProductGrid filter={filter} />` receives `filter` as a prop and is slow. Defer it inside the grid.", a: "Call `useDeferredValue(filter)` in the parent of the slow part and pass the deferred value to a memoised child." },
      { level: "I", q: "`useDeferredValue` vs debounce for an API search?", a: "Debounce reduces requests by waiting. `useDeferredValue` only defers rendering; it doesn't stop requests. Use debounce (or TanStack Query) for network calls." },
      { level: "C", q: "Combine with Suspense: why does the old list stay visible instead of a fallback?", a: "While the deferred render suspends, React keeps showing the previous content instead of the Suspense fallback." }
    ],
    quiz: [
      { q: "What does `useDeferredValue` return during an urgent render?", options: ["The new value", "The previous value", "`undefined`", "A promise"], answer: 1, why: "It lags behind, then a background render uses the new value." },
      { q: "What must the slow child usually be wrapped in?", options: ["`useMemo`", "`memo`", "`Suspense`", "`useCallback`"], answer: 1, why: "`memo` lets it skip re-rendering while the deferred value is unchanged." },
      { q: "When prefer `useDeferredValue` over `useTransition`?", options: ["When you own the state setter", "When you only receive the value (prop) and can't wrap the update", "For controlled inputs", "Never"], answer: 1, why: "`useTransition` wraps updates; `useDeferredValue` defers values." }
    ],
    rev: {
      sec30: "`useDeferredValue(value)` returns a lagging copy of a value. Urgent renders use the old value; React re-renders with the new one in an interruptible background render. Pass it to a `memo`-wrapped slow component and compare `value !== deferred` to show staleness. No fixed delay; doesn't reduce network calls. React 19 adds `initialValue`.",
      interview: [
        { level: "basic", q: "What does `useDeferredValue` do?", a: "It returns a version of a value that may lag behind, so slow UI can update later while urgent UI stays responsive." },
        { level: "intermediate", q: "Why is `memo` needed?", a: "The parent re-renders on every keystroke. Without `memo`, the slow child re-renders each time too, even with the old deferred value." },
        { level: "intermediate", q: "How is it different from debouncing?", a: "Debounce waits a fixed time and can cut requests. Deferred values start rendering immediately in the background, adapt to device speed, and are interruptible." },
        { level: "advanced", q: "`useDeferredValue` vs `useTransition`?", a: "Same mechanism (low-priority render). `useTransition` wraps a state update you control; `useDeferredValue` wraps a value you receive." },
        { level: "tricky", q: "What happens if the deferred render suspends?", a: "React keeps showing the old content rather than the Suspense fallback, so results don't flash away." }
      ],
      predict: [
        { code: `const [q, setQ] = useState('');\nconst d = useDeferredValue(q);\n// user types 'a' on a slow device\nconsole.log(q, d); // first log after the keystroke`, answer: "a (empty string)", why: "The urgent render sees the new `q` but the old deferred value; a background render follows with `d = 'a'`." }
      ],
      cheat: [
        "`const d = useDeferredValue(value)` lags behind",
        "Slow child must be wrapped in `memo`",
        "Stale check: `value !== d`",
        "For values you receive; `useTransition` for updates you own",
        "Interruptible, no fixed delay",
        "Not a network debounce",
        "React 19: `useDeferredValue(v, initialValue)`"
      ]
    },
    related: ["HOOKS-014", "ADV-001", "PERF-013", "ADV-003"]
  }
};
