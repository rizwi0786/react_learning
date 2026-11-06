export default {
  "COND-001": {
    tldr: "Conditional rendering means showing different UI depending on the data (state or props). It's plain JavaScript: `if`, `? :` and `&&` decide which JSX React draws.",
    analogy: { icon: "🌦️", text: "A weather app: sunny shows sunglasses, rainy shows an umbrella. Same screen, different picture, chosen by today's data." },
    visual: { type: "flow", title: "From state to the right UI", steps: [
      { label: "State changes", detail: "User clicks **Log in**; `setIsLoggedIn(true)` runs." },
      { label: "Re-render", detail: "React calls the component again with the new value." },
      { label: "JS decides", detail: "`if`, `? :` or `&&` picks which JSX to return." },
      { label: "Screen updates", detail: "React swaps the old UI for the new one in the DOM." }
    ]},
    points: [
      "There's no special template syntax: you use **normal JavaScript** to choose JSX.",
      "Three tools: `if/else` (whole blocks), `cond ? a : b` (inline either/or), `cond && a` (inline show/hide).",
      "JSX `{ }` only accepts **expressions**, so use `? :` or `&&` inside it; `if` lives outside the JSX.",
      "The condition is re-checked on **every render**, so the UI always matches the current state.",
      "Use `null` (or `false`) when you want nothing on screen."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cartCount = 2;

  return (
    <header>
      {isLoggedIn ? <p>Welcome back, Sam!</p> : <p>Please log in.</p>}

      {isLoggedIn && <span>🛒 {cartCount} items</span>}

      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Log out' : 'Log in'}
      </button>
    </header>
  );
}`, walk: [
      { lines: [4], note: "The deciding data: a boolean in state." },
      { lines: [9], note: "Ternary: pick one of two elements inline." },
      { lines: [11], note: "`&&`: show the cart badge only when logged in." },
      { lines: [13, 14, 15], note: "Clicking flips state; React re-renders and every condition is re-checked." }
    ]},
    output: "“Please log in.” and a **Log in** button. After clicking: “Welcome back, Sam!”, “🛒 2 items” and a **Log out** button.",
    mistakes: [
      { bad: `return (\n  <div>\n    {if (isLoggedIn) { <p>Hi</p> }}\n  </div>\n);`, good: `return (\n  <div>\n    {isLoggedIn ? <p>Hi</p> : null}\n  </div>\n);`, why: "`if` is a statement, not an expression, so it can't go inside JSX braces. Use a ternary or `&&`, or move the `if` above the `return`." }
    ],
    practice: [
      { level: "B", q: "Show “Open now” or “Closed” for a shop based on an `isOpen` boolean.", a: "`{isOpen ? 'Open now' : 'Closed'}`" },
      { level: "B", q: "Show a “Sale!” badge only when `onSale` is true.", a: "`{onSale && <span>Sale!</span>}`" },
      { level: "I", q: "A todo has `done`. Strike through the text only when done.", a: "Conditionally pick a style or class.", code: `<li style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>\n  {todo.text}\n</li>` },
      { level: "C", q: "Show three different weather icons for `'sun'`, `'rain'` and `'snow'`. Which tool fits best?", a: "More than two options: use `if/else` or a lookup object like `{ sun: '☀️', rain: '🌧️', snow: '❄️' }[weather]` rather than nested ternaries." }
    ],
    quiz: [
      { q: "Which of these can go directly inside JSX `{ }`?", options: ["`if (x) {...}`", "`x ? <A /> : <B />`", "`switch (x) {...}`", "`for (...) {...}`"], answer: 1, why: "JSX braces take expressions. A ternary is an expression; `if`, `switch` and `for` are statements." },
      { q: "When is the condition evaluated?", options: ["Once, when the component mounts", "On every render", "Only when props change"], answer: 1, why: "The component function runs on every render, so every condition is re-checked." },
      { q: "What does React draw for `{false}`?", options: ["The text “false”", "Nothing", "An error"], answer: 1, why: "`false`, `null`, `undefined` and `true` render nothing." }
    ],
    rev: {
      sec30: "React has no `v-if`/`*ngIf`. You choose JSX with plain JS: `if/else` before the return, `? :` for either/or inside JSX, `&&` for show-or-nothing. Conditions re-run every render, so UI always reflects current state. `null`/`false` render nothing.",
      interview: [
        { level: "basic", q: "How do you conditionally render in React?", a: "With plain JavaScript: `if/else` outside JSX, or a ternary or `&&` inside JSX braces. Return `null` to render nothing." },
        { level: "intermediate", q: "Why can't you use `if` inside JSX?", a: "JSX compiles to function calls, and braces accept only expressions. `if` is a statement, so it has no value to pass." },
        { level: "intermediate", q: "Hiding with CSS vs not rendering: what's the difference?", a: "Not rendering removes the element and **unmounts** it (its state is lost). CSS hiding keeps it mounted and keeps its state." },
        { level: "tricky", q: "Toggling `{show ? <Form /> : null}` loses the form's typed text. Why?", a: "When `show` goes false, `<Form />` unmounts and its state is destroyed. Keep it mounted (CSS hide) or lift the state up." }
      ],
      compare: { cols: ["", "if/else", "? :", "&&"], rows: [
        ["Where", "Before `return`", "Inside JSX", "Inside JSX"],
        ["Options", "Any number", "Two", "Show or nothing"],
        ["Watch out", "Can't go in `{ }`", "Nesting gets messy", "`0 && x` renders 0"]
      ]},
      cheat: [
        "No template directives: just JavaScript",
        "`if/else` for big blocks or early returns",
        "`cond ? <A /> : <B />` for either/or",
        "`cond && <A />` for show-or-nothing",
        "`null`, `false`, `undefined`, `true` render nothing",
        "Not rendering = unmount = state lost"
      ]
    },
    related: ["COND-002", "COND-003", "COND-004", "JSX-013"]
  },

  "COND-002": {
    tldr: "Use `if/else` before the `return` to pick a whole chunk of UI. An **early return** handles the special case first (loading, empty, not allowed) so the main JSX stays clean.",
    analogy: { icon: "🍽️", text: "A restaurant host: “Kitchen closed? Sorry, come back later.” That's checked first at the door; only then are you shown to a table." },
    visual: { type: "flow", title: "Early-return checks, top to bottom", steps: [
      { label: "Not logged in?", detail: "`if (!user) return <Login />;` and stop here." },
      { label: "Cart empty?", detail: "`if (items.length === 0) return <p>Cart is empty</p>;`" },
      { label: "Main UI", detail: "Only the normal case reaches the final `return` with the full cart." }
    ]},
    points: [
      "`if/else` is a **statement**, so it goes in the function body, not inside JSX braces.",
      "**Early return** (guard clause): handle the special case and `return` immediately.",
      "Great for **more than two** cases, or when each branch is a big block of JSX.",
      "You can store JSX in a variable: `let content; if (...) content = <A />; else content = <B />;`",
      "Call **all hooks before** any early return, never after it (Rules of Hooks)."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

function Cart({ user, items }) {
  const [coupon, setCoupon] = useState('');

  if (!user) {
    return <p>Please log in to see your cart.</p>;
  }

  if (items.length === 0) {
    return <p>Your cart is empty 🛒</p>;
  }

  return (
    <div>
      <h2>{user.name}'s cart ({items.length})</h2>
      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon" />
    </div>
  );
}

export default function App() {
  return <Cart user={{ name: 'Sam' }} items={['Apples', 'Milk']} />;
}`, walk: [
      { lines: [4], note: "Hooks first, before any early return, so they run in the same order every render." },
      { lines: [6, 7, 8], note: "Guard clause: no user, show a message and stop." },
      { lines: [10, 11, 12], note: "Second guard: an empty cart gets its own simple screen." },
      { lines: [14, 15, 16, 17, 18, 19], note: "Only the happy path reaches the main JSX. No nesting needed." }
    ]},
    output: "“Sam's cart (2)” with a coupon input. With `items={[]}` it shows “Your cart is empty 🛒”.",
    mistakes: [
      { bad: `if (!user) return <Login />;\nconst [coupon, setCoupon] = useState('');`, good: `const [coupon, setCoupon] = useState('');\nif (!user) return <Login />;`, why: "A hook after an early return is skipped on some renders, so hook order changes and React throws. Call hooks first." }
    ],
    practice: [
      { level: "B", q: "Return “Loading…” while `isLoading` is true, otherwise the recipe title.", a: "Early return.", code: `if (isLoading) return <p>Loading…</p>;\nreturn <h1>{recipe.title}</h1>;` },
      { level: "B", q: "Show “Admin panel” for `role === 'admin'` and “Dashboard” for everyone else using a variable.", a: "Assign JSX to a variable.", code: `let content;\nif (role === 'admin') content = <AdminPanel />;\nelse content = <Dashboard />;\nreturn <main>{content}</main>;` },
      { level: "I", q: "A playlist can be `'loading'`, `'error'` or `'ready'`. Write the checks.", a: "Two guard clauses then the main return: `if (status === 'loading') return ...; if (status === 'error') return ...; return <List />;`" },
      { level: "C", q: "Your component calls `useEffect` after `if (!user) return null;`. What goes wrong and how do you fix it?", a: "React errors: “Rendered more hooks than during the previous render”. Move the `useEffect` above the `if` and check `user` inside the effect." }
    ],
    quiz: [
      { q: "Where can an `if` statement go in a component?", options: ["Inside JSX braces", "In the function body before `return`", "Only in event handlers"], answer: 1, why: "Statements live in the function body; braces take only expressions." },
      { q: "What is an early return?", options: ["Returning before hooks run", "Handling a special case first and returning straight away", "Returning a Promise"], answer: 1, why: "A guard clause exits early for the special case so the main code stays flat." },
      { q: "A `useState` call placed after `if (!data) return null;` will…", options: ["Work fine", "Break the Rules of Hooks", "Run twice"], answer: 1, why: "On renders that return early the hook is skipped, so the hook order changes." }
    ],
    rev: {
      sec30: "Use `if/else` in the body to pick big chunks of UI or handle many cases. Guard clauses (early returns) handle loading/empty/unauthorised first so the main JSX stays flat. All hooks must be called before the first early return.",
      interview: [
        { level: "basic", q: "When would you use `if/else` over a ternary?", a: "When there are more than two cases, or each branch is a big block of JSX. It reads better than nested ternaries." },
        { level: "intermediate", q: "What's a guard clause in a component?", a: "An early `return` for a special case (no data, not logged in) before the main JSX, which avoids deep nesting." },
        { level: "advanced", q: "Why must hooks come before an early return?", a: "React tracks hooks by call order. Skipping one on some renders shifts every later slot and breaks state, so React throws." },
        { level: "tricky", q: "Can a component return early with `undefined`?", a: "In React 18+ it no longer throws, but return `null` explicitly: it's clearer and lints cleanly." }
      ],
      debug: [
        { code: `function Notes({ notes }) {\n  if (!notes) return null;\n  const [q, setQ] = useState('');\n  return <input value={q} onChange={e => setQ(e.target.value)} />;\n}`, fix: `function Notes({ notes }) {\n  const [q, setQ] = useState('');\n  if (!notes) return null;\n  return <input value={q} onChange={e => setQ(e.target.value)} />;\n}`, why: "The hook was conditional. Move it above the early return." }
      ],
      cheat: [
        "`if/else` goes in the body, never in `{ }`",
        "Guard clause: `if (!x) return <Fallback />;`",
        "Best for 3+ cases or large branches",
        "Store JSX in a variable, render `{content}`",
        "Hooks before any early return"
      ]
    },
    related: ["COND-001", "COND-005", "HOOKS-002", "COND-016"]
  },

  "COND-003": {
    tldr: "The ternary `cond ? a : b` picks one of two things **inside JSX**. Use it for either/or: open or closed, liked or not, Log in or Log out.",
    analogy: { icon: "💡", text: "A light switch: it's always one of two states, on or off. A ternary always shows exactly one of its two options." },
    visual: { type: "compare", title: "One condition, two outcomes", left: { label: "isFav = true", tone: "good", points: ["`isFav ? '❤️' : '🤍'`", "Shows ❤️", "Button text: “Remove”"] }, right: { label: "isFav = false", tone: "neutral", points: ["`isFav ? '❤️' : '🤍'`", "Shows 🤍", "Button text: “Add to favourites”"] } },
    points: [
      "Syntax: `condition ? whenTrue : whenFalse`. It's an **expression**, so it works inside `{ }`.",
      "Works for elements, text, class names, styles, even props: `className={done ? 'done' : ''}`.",
      "Use `: null` when the false side should show nothing.",
      "**Avoid nesting** ternaries; for 3+ options use `if/else` or a lookup object.",
      "Same component type in both branches keeps its state; different types remount."
    ],
    code: { file: "Song.jsx", lang: "jsx", src: `import { useState } from 'react';

function Song({ title }) {
  const [isFav, setIsFav] = useState(false);

  return (
    <li className={isFav ? 'song fav' : 'song'}>
      {isFav ? '❤️' : '🤍'} {title}
      <button onClick={() => setIsFav(!isFav)}>
        {isFav ? 'Remove' : 'Add to favourites'}
      </button>
    </li>
  );
}

export default function App() {
  return (
    <ul>
      <Song title="Blue Monday" />
      <Song title="Yellow" />
    </ul>
  );
}`, walk: [
      { lines: [7], note: "Ternary picks a class name: attributes take expressions too." },
      { lines: [8], note: "Ternary picks an icon inline." },
      { lines: [10], note: "Ternary picks button text. All three re-check `isFav` on each render." }
    ]},
    output: "Two songs with 🤍 and “Add to favourites”. Clicking one shows ❤️ and “Remove” for that song only.",
    mistakes: [
      { bad: `{status === 'loading' ? <Spinner /> : status === 'error' ? <Error /> : status === 'empty' ? <Empty /> : <List />}`, good: `if (status === 'loading') return <Spinner />;\nif (status === 'error') return <Error />;\nif (status === 'empty') return <Empty />;\nreturn <List />;`, why: "Nested ternaries are hard to read and easy to break. Use early returns or a lookup map for 3+ cases." }
    ],
    practice: [
      { level: "B", q: "Show “In stock” or “Sold out” for a product's `stock` number.", a: "`{stock > 0 ? 'In stock' : 'Sold out'}`" },
      { level: "B", q: "Make a todo's text grey when `done`, black otherwise.", a: "`style={{ color: done ? 'grey' : 'black' }}`" },
      { level: "I", q: "Show an edit `<input>` when `isEditing`, otherwise the note text.", a: "Ternary between two elements.", code: `{isEditing\n  ? <input value={text} onChange={e => setText(e.target.value)} />\n  : <p>{text}</p>}` },
      { level: "C", q: "`{isAdmin ? <Panel key=\"a\" /> : <Panel key=\"b\" />}` — does the Panel keep its state when `isAdmin` flips?", a: "No. Different keys tell React they're different components, so it remounts and resets. Without keys (same type, same spot) state would be kept." }
    ],
    quiz: [
      { q: "What does `{cartCount > 0 ? cartCount : null}` show when the count is 0?", options: ["0", "Nothing", "null"], answer: 1, why: "The false branch is `null`, which renders nothing." },
      { q: "Best choice for 4 different order statuses?", options: ["Nested ternaries", "`if/else` or a lookup object", "Four `&&`s in a row"], answer: 1, why: "Nested ternaries hurt readability. Early returns or a map scale cleanly." },
      { q: "`{on ? <Input /> : <Input />}` — flipping `on` keeps the input's text?", options: ["Yes, same type in the same position", "No, it always remounts"], answer: 0, why: "React sees the same component type at the same position and keeps its state." }
    ],
    rev: {
      sec30: "`cond ? a : b` is the inline either/or for JSX: elements, text, classes or props. Use `: null` for nothing. Don't nest it; switch to `if/else` or a lookup map at 3+ options. Same type in both branches keeps state; different type or key remounts.",
      interview: [
        { level: "basic", q: "Why use a ternary instead of `if` in JSX?", a: "JSX braces need an expression. A ternary is an expression that returns one of two values." },
        { level: "intermediate", q: "Ternary vs `&&`: when do you pick each?", a: "Ternary when both sides show something; `&&` when the false side is nothing. A ternary with `: null` is the safer `&&`." },
        { level: "advanced", q: "Do both ternary branches keep component state when you switch?", a: "Only if both branches render the same type at the same position (and same key). Different types unmount and remount." },
        { level: "tricky", q: "How do you force two same-type branches to reset when toggling?", a: "Give them different `key`s, e.g. `key=\"login\"` and `key=\"signup\"`. A key change means a new instance." }
      ],
      predict: [
        { code: `const items = 0;\nreturn <p>{items ? items + ' items' : 'Empty'}</p>;`, answer: "Empty", why: "0 is falsy, so the false branch runs. A ternary never leaks the 0." }
      ],
      cheat: [
        "`cond ? <A /> : <B />` for either/or",
        "Works in attributes: `className={x ? 'a' : 'b'}`",
        "`: null` means render nothing",
        "No nesting; 3+ options use `if` or a map",
        "Same type + same spot = state kept",
        "Different key = fresh instance"
      ]
    },
    related: ["COND-001", "COND-004", "STATE-020", "COND-006"]
  },

  "COND-004": {
    tldr: "`cond && <X />` shows X when the condition is truthy, and nothing otherwise. Careful: if the condition is the number **0**, React renders a stray “0”.",
    analogy: { icon: "🎟️", text: "A gift voucher: you only get the gift **if** you have the voucher. No voucher, no gift. But a voucher worth £0 is still printed on your receipt as “0”." },
    visual: { type: "timeline", title: "How `items.length && <Badge />` behaves", frames: [
      { label: "3 items", state: "3 && <Badge /> → <Badge />", note: "3 is truthy, so JS returns the right side. Badge shows." },
      { label: "1 item", state: "1 && <Badge /> → <Badge />", note: "Still truthy. Badge shows." },
      { label: "0 items", state: "0 && <Badge /> → 0", note: "0 is falsy, so JS returns **0 itself**. React prints “0”. Bug!" },
      { label: "Fixed", state: "items.length > 0 && <Badge /> → false", note: "A real boolean. `false` renders nothing." }
    ]},
    points: [
      "JS `a && b` returns `a` if it's falsy, otherwise `b`. React renders whatever comes back.",
      "`false`, `null`, `undefined` render nothing, but **`0` and `NaN` render as text**.",
      "Fix: make the left side a true boolean: `count > 0 &&`, `!!count &&` or `Boolean(count) &&`.",
      "Or use a ternary: `count ? <Badge /> : null`.",
      "Empty string `''` renders nothing visible, so it's harmless but still avoid relying on it."
    ],
    code: { file: "CartIcon.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function CartIcon() {
  const [items, setItems] = useState([]);

  return (
    <div>
      <span>🛒</span>

      {/* ❌ Bug: shows "0" when the cart is empty */}
      {items.length && <b>{items.length}</b>}

      {/* ✅ Fixed: left side is a real boolean */}
      {items.length > 0 && <b>{items.length}</b>}

      <button onClick={() => setItems([...items, 'Milk'])}>Add milk</button>
      <button onClick={() => setItems([])}>Empty cart</button>
    </div>
  );
}`, walk: [
      { lines: [11], note: "With an empty cart `items.length` is 0, so `&&` returns 0 and React prints it." },
      { lines: [14], note: "`items.length > 0` is `false` when empty, and `false` renders nothing." },
      { lines: [16, 17], note: "Add and empty the cart to watch the stray 0 appear and vanish." }
    ]},
    output: "Empty cart: “🛒 0” (the stray 0 from line 11). After adding milk: “🛒 1 1” (both badges).",
    mistakes: [
      { bad: `{messages.length && <Unread count={messages.length} />}`, good: `{messages.length > 0 && <Unread count={messages.length} />}`, why: "When there are no messages, `0` is returned and rendered as text. Compare to get a boolean." },
      { bad: `{user.name && <p>Hi {user.name}</p>}\n// user is undefined`, good: `{user?.name && <p>Hi {user.name}</p>}`, why: "`&&` doesn't protect against reading a property of `undefined`. Use optional chaining." }
    ],
    practice: [
      { level: "B", q: "Show “Free delivery!” only when `total >= 50`.", a: "`{total >= 50 && <p>Free delivery!</p>}`" },
      { level: "B", q: "Why does `{0 && <p>Hi</p>}` print 0, but `{false && <p>Hi</p>}` prints nothing?", a: "`&&` returns the falsy left value. React renders numbers (even 0) but skips `false`." },
      { level: "I", q: "Fix: `{todos.length && <TodoList todos={todos} />}`", a: "Make it a boolean.", code: `{todos.length > 0 && <TodoList todos={todos} />}` },
      { level: "C", q: "Can the stray 0 happen in React Native? What happens there?", a: "Yes, and it's worse: a raw `0` outside a `<Text>` crashes the app (“Text strings must be rendered within a <Text>”). Always use booleans with `&&`." }
    ],
    quiz: [
      { q: "What renders for `{0 && <Badge />}`?", options: ["Nothing", "The text “0”", "<Badge />"], answer: 1, why: "`&&` returns 0, and React renders numbers." },
      { q: "Which is a safe fix?", options: ["`{count && <Badge />}`", "`{count > 0 && <Badge />}`", "`{count || <Badge />}`"], answer: 1, why: "A comparison returns `true`/`false`, never a stray number." },
      { q: "`{'' && <p>x</p>}` renders…", options: ["Nothing visible", "The text “''”", "<p>x</p>"], answer: 0, why: "It returns an empty string, which shows nothing." }
    ],
    rev: {
      sec30: "`cond && <X />` renders X if `cond` is truthy, else whatever `cond` is. React skips `false/null/undefined` but prints numbers, so `0 && ...` shows “0”. Always use a boolean on the left (`n > 0`, `!!n`) or a ternary with `: null`.",
      interview: [
        { level: "basic", q: "What does `&&` do in JSX?", a: "Shows the right side when the left is truthy; otherwise renders the left value, which is usually nothing." },
        { level: "intermediate", q: "Explain the stray 0 bug.", a: "`list.length && <X />` returns `0` when the list is empty. React renders numbers, so “0” appears. Use `list.length > 0`." },
        { level: "intermediate", q: "Which values does React render nothing for?", a: "`null`, `undefined`, `true` and `false`. Numbers including 0, and strings, are rendered." },
        { level: "tricky", q: "Is `{count || <Empty />}` a good empty-state pattern?", a: "No. When `count` is 5 it renders “5”, not a component. Use a ternary to choose between two UIs." }
      ],
      predict: [
        { code: `const likes = 0;\nreturn <p>Likes: {likes && '🔥'}</p>;`, answer: "Likes: 0", why: "`0 && '🔥'` evaluates to 0, which React renders." },
        { code: `const items = [];\nreturn <p>{items.length > 0 && 'Has items'}</p>;`, answer: "An empty <p>", why: "The comparison is `false`, which renders nothing." }
      ],
      cheat: [
        "`cond && <X />` = show X or nothing",
        "`a && b` returns `a` when it's falsy",
        "React prints `0` and `NaN`, skips `false/null/undefined`",
        "Fix: `n > 0 &&`, `!!n &&`, or `n ? <X /> : null`",
        "`&&` doesn't stop `undefined.prop` crashes: use `?.`"
      ]
    },
    related: ["COND-001", "COND-003", "COND-015", "JSX-013"]
  },

  "COND-005": {
    tldr: "A component can `return null` to draw nothing. It's still **mounted**: its state is kept and its hooks and effects still run.",
    analogy: { icon: "🔕", text: "A phone on silent: it's still on and still receiving messages, it just isn't making a sound. `return null` keeps the component alive but silent." },
    visual: { type: "compare", title: "Two ways to hide a toast", left: { label: "Child returns null", tone: "neutral", points: ["`if (!visible) return null;` inside Toast", "Toast stays mounted", "Its state and effects keep running", "Parent always renders `<Toast />`"] }, right: { label: "Parent skips it", tone: "neutral", points: ["`{visible && <Toast />}` in the parent", "Toast unmounts when hidden", "Its state is destroyed", "Effects clean up"] } },
    points: [
      "`return null` renders **nothing** in the DOM; no wrapper element is left behind.",
      "Hooks still run before the `return null`, so the component keeps its state.",
      "Use it when the component **itself** knows when to hide (a banner with no message, a closed modal).",
      "If the parent decides, skipping with `&&` is often clearer and fully unmounts the child.",
      "Returning `undefined` no longer throws (React 18+), but `null` is explicit and preferred."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

function SaleBanner({ discount }) {
  if (discount === 0) {
    return null;
  }
  return <div className="banner">🎉 {discount}% off today!</div>;
}

export default function App() {
  const [discount, setDiscount] = useState(0);

  return (
    <main>
      <SaleBanner discount={discount} />
      <h1>Fresh Fruit Shop</h1>
      <button onClick={() => setDiscount(20)}>Start sale</button>
      <button onClick={() => setDiscount(0)}>End sale</button>
    </main>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "No discount? Render nothing. The banner decides for itself." },
      { lines: [7], note: "Otherwise render the banner normally." },
      { lines: [15], note: "The parent always renders `<SaleBanner />` and doesn't need to know the rule." }
    ]},
    output: "Only the heading and buttons at first. “Start sale” shows “🎉 20% off today!” above the heading.",
    mistakes: [
      { bad: `function Modal({ open }) {\n  if (!open) return <div></div>;\n  ...\n}`, good: `function Modal({ open }) {\n  if (!open) return null;\n  ...\n}`, why: "An empty `<div>` still lands in the DOM and can break layouts (gaps, flex children). `null` leaves nothing behind." }
    ],
    practice: [
      { level: "B", q: "Write `<Greeting name>` that renders nothing when `name` is empty.", a: "Guard and return null.", code: `function Greeting({ name }) {\n  if (!name) return null;\n  return <p>Hello, {name}!</p>;\n}` },
      { level: "I", q: "A `<Timer>` returns `null` while hidden. Does its `setInterval` effect keep ticking?", a: "Yes. It's still mounted, so effects keep running. Unmount it (parent `&&`) to stop and clean up." },
      { level: "I", q: "Hide a chat “typing…” indicator when no one is typing.", a: "`if (typingUsers.length === 0) return null;` at the top of `TypingIndicator`." },
      { level: "C", q: "You need to hide a form but keep its typed text. Child `return null` or parent `&&`?", a: "Child `return null` (or CSS hiding). The parent `&&` unmounts the form and loses its state. Note: with `return null` the input DOM is gone, so only state survives, not focus." }
    ],
    quiz: [
      { q: "A component returns `null`. What's in the DOM?", options: ["An empty <div>", "Nothing", "A comment node with “null”"], answer: 1, why: "`null` renders nothing at all." },
      { q: "Does a component that returns `null` keep its state?", options: ["Yes, it's still mounted", "No, it's unmounted"], answer: 0, why: "React still calls it and keeps its hook slots; it just has no output." },
      { q: "`{show && <Chat />}` with `show` false: is `Chat`'s effect cleaned up?", options: ["Yes, Chat unmounts", "No, it keeps running"], answer: 0, why: "The parent stops rendering Chat, so React unmounts it and runs cleanups." }
    ],
    rev: {
      sec30: "`return null` makes a component render nothing while staying mounted: hooks run, state is kept, effects keep going. A parent skipping the child with `&&` unmounts it instead. Use `null`, not an empty `<div>`, so nothing lands in the DOM.",
      interview: [
        { level: "basic", q: "How do you make a component render nothing?", a: "Return `null` from it." },
        { level: "intermediate", q: "Child `return null` vs parent `{show && <Child />}`?", a: "`return null` keeps the child mounted with its state and effects. The parent condition unmounts it, losing state and running cleanup." },
        { level: "advanced", q: "Does a component returning `null` still re-render?", a: "Yes. React still calls it when its parent renders or its state changes; it just produces no DOM." },
        { level: "tricky", q: "Can you return `false` or `undefined` from a component?", a: "Both render nothing in React 18+. `null` is the convention and the clearest intent." }
      ],
      compare: { cols: ["", "Child returns null", "Parent uses &&"], rows: [
        ["Mounted?", "Yes", "No"],
        ["State kept?", "Yes", "No, reset"],
        ["Effects", "Keep running", "Cleaned up"],
        ["Who decides", "The child", "The parent"]
      ]},
      cheat: [
        "`return null` = render nothing",
        "Still mounted: state and effects stay",
        "Hooks must run before the `return null`",
        "Parent `&&` = unmount instead",
        "Prefer `null` over an empty `<div>`"
      ]
    },
    related: ["COND-002", "COND-004", "STATE-020", "HOOKS-005"]
  },

  "COND-006": {
    tldr: "When many options exist, store **components in an object** and pick one by key: `const View = views[tab]; return <View />`. No long `if` chains.",
    analogy: { icon: "📻", text: "A radio with preset buttons: press 1 for news, 2 for music, 3 for sport. The button number looks up which station plays." },
    visual: { type: "flow", title: "Looking up a component at runtime", steps: [
      { label: "State: method = 'card'", detail: "The user picks a payment method." },
      { label: "Lookup", detail: "`const Form = forms[method]` gives the `CardForm` function." },
      { label: "Capital variable", detail: "JSX needs a **capitalised** name to treat it as a component." },
      { label: "Render <Form />", detail: "React renders `CardForm`. Change `method` and a different form appears." }
    ]},
    points: [
      "Map keys to **components** (not elements): `{ card: CardForm, paypal: PayPalForm }`.",
      "The variable must start with a **capital letter**: `<Form />` works, `<form />` is an HTML tag.",
      "Add a **fallback** for unknown keys: `forms[method] ?? Unknown`.",
      "Define components and the map **outside** the component; creating them during render remounts every time.",
      "Switching to a different component type **resets** its state (new type = new instance)."
    ],
    code: { file: "Checkout.jsx", lang: "jsx", src: `import { useState } from 'react';

function CardForm()   { return <input placeholder="Card number" />; }
function PayPalForm() { return <button>Continue with PayPal</button>; }
function CashInfo()   { return <p>Pay when your groceries arrive.</p>; }
function Unknown()    { return <p>Choose a payment method.</p>; }

const FORMS = { card: CardForm, paypal: PayPalForm, cash: CashInfo };

export default function Checkout() {
  const [method, setMethod] = useState('card');
  const Form = FORMS[method] ?? Unknown;

  return (
    <section>
      <select value={method} onChange={e => setMethod(e.target.value)}>
        <option value="card">Card</option>
        <option value="paypal">PayPal</option>
        <option value="cash">Cash</option>
      </select>
      <Form />
    </section>
  );
}`, walk: [
      { lines: [3, 4, 5, 6], note: "Each option is its own small component, defined at module level." },
      { lines: [8], note: "The lookup map: key → component function (no JSX here)." },
      { lines: [12], note: "Pick by key into a **capitalised** variable, with a fallback." },
      { lines: [21], note: "Render it like any component. Props work too: `<Form total={42} />`." }
    ]},
    output: "A dropdown and a card number input. Choosing PayPal swaps in the PayPal button; Cash shows a message.",
    mistakes: [
      { bad: `const form = FORMS[method];\nreturn <form />;`, good: `const Form = FORMS[method];\nreturn <Form />;`, why: "Lowercase JSX tags are treated as HTML elements. `<form />` renders a real `<form>`, not your component." },
      { bad: `function Checkout() {\n  const FORMS = { card: () => <input /> };\n  const Form = FORMS[method];\n  return <Form />;\n}`, good: `function CardForm() { return <input />; }\nconst FORMS = { card: CardForm };\nfunction Checkout() { ... }`, why: "Inline arrow components are new functions every render, so React sees a new type and remounts, losing input text and focus." }
    ],
    practice: [
      { level: "B", q: "Map weather `'sun' | 'rain' | 'snow'` to `<Sunny />`, `<Rainy />`, `<Snowy />`.", a: "Lookup map then render.", code: `const ICONS = { sun: Sunny, rain: Rainy, snow: Snowy };\nconst Icon = ICONS[weather] ?? Cloudy;\nreturn <Icon />;` },
      { level: "I", q: "Render tab panels for `'songs' | 'albums' | 'artists'` and pass `query` to each.", a: "`const Panel = PANELS[tab]; return <Panel query={query} />;`" },
      { level: "I", q: "Should the map hold `CardForm` or `<CardForm />`?", a: "Either works, but components (`CardForm`) let you pass props at render time. Elements are fixed when the map is created." },
      { level: "C", q: "The user switches from Card to PayPal and back. Is the typed card number still there?", a: "No. Switching type unmounts `CardForm`. Lift the value into `Checkout` state and pass it down to keep it." }
    ],
    quiz: [
      { q: "Why must the variable be `Form`, not `form`?", options: ["Style guide only", "Lowercase JSX tags mean HTML elements", "React can't import lowercase files"], answer: 1, why: "JSX treats lowercase tags as strings (DOM tags) and capitalised ones as component references." },
      { q: "Where should the lookup map live?", options: ["Inside the component, recreated each render", "Outside the component (module level)", "In state"], answer: 1, why: "It never changes, and defining components inside render causes remounts." },
      { q: "Unknown key `FORMS['crypto']` with no fallback renders…", options: ["Nothing, safely", "An error: element type is invalid (got undefined)", "The first form"], answer: 1, why: "`<undefined />` is not a valid element type. Add `?? Fallback`." }
    ],
    rev: {
      sec30: "Replace long `if`/ternary chains with a lookup object of components: `const View = VIEWS[key] ?? Fallback; <View {...props} />`. The variable must be capitalised. Keep the map and components at module level, or React remounts them every render.",
      interview: [
        { level: "basic", q: "How do you render a component chosen at runtime?", a: "Put components in an object, look one up by key into a capitalised variable, and render `<Comp />`." },
        { level: "intermediate", q: "Why does `<comp />` fail when `comp` holds a component?", a: "JSX treats lowercase names as DOM tag strings. It needs a capitalised identifier to reference a variable." },
        { level: "advanced", q: "What happens to state when the chosen component changes?", a: "React sees a different element type at that spot, unmounts the old one and mounts the new one with fresh state." },
        { level: "tricky", q: "Why not define the components inline in the map inside render?", a: "Each render creates new function identities, so React thinks the type changed and remounts every time, losing state and focus." }
      ],
      debug: [
        { code: `const PAGES = { home: Home, cart: Cart };\nfunction App({ page }) {\n  const current = PAGES[page];\n  return <current />;\n}`, fix: `const PAGES = { home: Home, cart: Cart };\nfunction App({ page }) {\n  const Current = PAGES[page] ?? NotFound;\n  return <Current />;\n}`, why: "Lowercase is read as an HTML tag. Capitalise it and add a fallback for unknown keys." }
      ],
      cheat: [
        "`const MAP = { a: CompA, b: CompB }` at module level",
        "`const Comp = MAP[key] ?? Fallback;`",
        "Capitalised variable: `<Comp />`",
        "Pass props normally: `<Comp total={t} />`",
        "New type = remount = state reset",
        "Never create components during render"
      ]
    },
    related: ["COND-003", "COMP-004", "RENDER-008", "ADV-014"]
  },

  "COND-007": {
    tldr: "React can render an **array** of elements directly. Turn your data (an array of objects) into an array of JSX, put it in `{ }`, and React draws each one in order.",
    analogy: { icon: "🧾", text: "A shopping receipt: the till takes your list of items and prints one line per item, in order." },
    visual: { type: "flow", title: "Data array → JSX array → screen", steps: [
      { label: "Data", detail: "`[{ id: 1, name: 'Milk' }, { id: 2, name: 'Bread' }]`" },
      { label: "Transform", detail: "Each object becomes `<li key={id}>{name}</li>`." },
      { label: "JSX array", detail: "`[<li>Milk</li>, <li>Bread</li>]` inside `{ }`." },
      { label: "Screen", detail: "React renders each element in order, like writing them by hand." }
    ]},
    points: [
      "`{[<li key=\"a\">A</li>, <li key=\"b\">B</li>]}` renders both items. Arrays are valid children.",
      "Arrays of **strings or numbers** render joined together: `{['a', 'b']}` shows “ab”.",
      "**Objects can't** be rendered: “Objects are not valid as a React child”. Render a field instead.",
      "Every element in an array needs a **`key`** so React can tell items apart.",
      "In practice you build the array with `.map()` (next lesson)."
    ],
    code: { file: "Groceries.jsx", lang: "jsx", src: `const groceries = [
  { id: 'g1', name: 'Milk', qty: 2 },
  { id: 'g2', name: 'Bread', qty: 1 },
  { id: 'g3', name: 'Apples', qty: 6 },
];

export default function Groceries() {
  const rows = [];
  for (const item of groceries) {
    rows.push(
      <li key={item.id}>
        {item.name} × {item.qty}
      </li>
    );
  }

  return (
    <ul>
      {rows}
    </ul>
  );
}`, walk: [
      { lines: [1, 2, 3, 4, 5], note: "Plain data: an array of objects with unique ids." },
      { lines: [8, 9, 10, 11, 12, 13, 14, 15], note: "Build an array of `<li>` elements by hand (`.map` does this in one line)." },
      { lines: [11], note: "Each element gets a stable `key` from the data." },
      { lines: [19], note: "Drop the whole array into `{ }`. React renders every element." }
    ]},
    output: "A bullet list: “Milk × 2”, “Bread × 1”, “Apples × 6”.",
    mistakes: [
      { bad: `<p>{user}</p>\n// user = { name: 'Sam' }`, good: `<p>{user.name}</p>`, why: "React can render strings, numbers, elements and arrays of them, but not plain objects. Pick the field you want to show." }
    ],
    practice: [
      { level: "B", q: "What does `<p>{[1, 2, 3]}</p>` show?", a: "“123”: arrays of numbers render side by side with no separator." },
      { level: "B", q: "Show tags `['vegan', 'quick']` separated by commas.", a: "`{tags.join(', ')}` gives one string: “vegan, quick”." },
      { level: "I", q: "Render a list of chat messages `{ id, from, text }` with a `for` loop.", a: "Push `<li key={m.id}><b>{m.from}</b>: {m.text}</li>` into an array, then render it." },
      { level: "C", q: "Why does React warn about keys for a hand-built array but not for `<li>A</li><li>B</li>` written in JSX?", a: "Hand-written siblings have a fixed position React can rely on. Array items can be added, removed or reordered, so React needs keys to match them." }
    ],
    quiz: [
      { q: "`<div>{['Hi', ' ', 'there']}</div>` renders…", options: ["Hi there", "An error", "Hi, ,there"], answer: 0, why: "String arrays render their items next to each other." },
      { q: "`<div>{{ name: 'Sam' }}</div>` …", options: ["Shows “Sam”", "Throws “Objects are not valid as a React child”", "Shows [object Object]"], answer: 1, why: "Plain objects aren't renderable. Render `obj.name`." },
      { q: "What do elements inside an array need?", options: ["A `key` prop", "An `id` prop", "A wrapper `<div>`"], answer: 0, why: "Keys let React match array items between renders." }
    ],
    rev: {
      sec30: "Arrays are valid React children: React renders each item in order. Strings and numbers join together; elements need `key`s; plain objects throw. Build the array of JSX from data, usually with `.map()`, and drop it into `{ }`.",
      interview: [
        { level: "basic", q: "Can JSX render an array?", a: "Yes. An array of elements, strings or numbers renders each item in order." },
        { level: "intermediate", q: "What error do you get rendering an object, and why?", a: "“Objects are not valid as a React child”. React doesn't know how to display an arbitrary object; render a field or convert it to elements." },
        { level: "intermediate", q: "Why do array items need keys but static siblings don't?", a: "Static children are matched by position, which never changes. Array items can move, so keys identify them." },
        { level: "tricky", q: "How do you show a `Date` object in JSX?", a: "Convert it: `{date.toLocaleDateString()}`. A raw `Date` is an object and throws." }
      ],
      predict: [
        { code: `return <p>{[true, null, 'tea', 0]}</p>;`, answer: "tea0", why: "`true` and `null` render nothing; the string and the number render." }
      ],
      cheat: [
        "Arrays are valid children: `{[<A key=\"1\" />, <B key=\"2\" />]}`",
        "String/number arrays render joined",
        "Objects throw: render `obj.field`",
        "Array elements need a `key`",
        "Build arrays with `.map()` in real code"
      ]
    },
    related: ["COND-008", "COND-011", "JSX-014", "JSX-006"]
  },

  "COND-008": {
    tldr: "`array.map(item => <Row key={item.id} ... />)` turns each data item into JSX in one line. It's the standard way to render lists in React.",
    analogy: { icon: "🍪", text: "A cookie cutter: you press the same cutter on every bit of dough. `map` applies the same JSX shape to every item." },
    visual: { type: "timeline", title: "map() building a playlist", frames: [
      { label: "Start", state: "songs = [Yellow, Clocks, Fix You]", note: "Three data objects." },
      { label: "Item 1", state: "→ <Song key=\"s1\" title=\"Yellow\" />", note: "The callback runs for the first song." },
      { label: "Item 2", state: "→ <Song key=\"s2\" title=\"Clocks\" />", note: "Same shape, next data." },
      { label: "Item 3", state: "→ <Song key=\"s3\" title=\"Fix You\" />", note: "Last item." },
      { label: "Result", state: "[<Song/>, <Song/>, <Song/>]", note: "A new array of elements, rendered in order." }
    ]},
    points: [
      "`map` returns a **new array**, perfect inside `{ }`. `forEach` returns `undefined` and renders nothing.",
      "Put `key` on the **outermost element** returned by the callback, not on its children.",
      "Use a stable id from the data as the key: `key={song.id}`.",
      "Arrow body with `{ }` needs an explicit `return`; with `( )` it returns automatically.",
      "Extract a component per row (`<Song />`) when the row grows: cleaner and reusable."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `const songs = [
  { id: 's1', title: 'Yellow', artist: 'Coldplay', mins: 4 },
  { id: 's2', title: 'Clocks', artist: 'Coldplay', mins: 5 },
  { id: 's3', title: 'Fix You', artist: 'Coldplay', mins: 5 },
];

function Song({ title, artist, mins }) {
  return (
    <li>
      🎵 <b>{title}</b>, {artist} ({mins} min)
    </li>
  );
}

export default function Playlist() {
  return (
    <ol>
      {songs.map(song => (
        <Song
          key={song.id}
          title={song.title}
          artist={song.artist}
          mins={song.mins}
        />
      ))}
    </ol>
  );
}`, walk: [
      { lines: [7, 8, 9, 10, 11, 12, 13], note: "One row component. It doesn't receive or need the key." },
      { lines: [18], note: "`map` with `( )` body: the JSX is returned automatically." },
      { lines: [20], note: "The key goes on the element the callback returns: `<Song>`, using a stable id." },
      { lines: [21, 22, 23], note: "Pass the data each row needs as props." }
    ]},
    output: "A numbered list: “🎵 Yellow, Coldplay (4 min)”, “🎵 Clocks, Coldplay (5 min)”, “🎵 Fix You, Coldplay (5 min)”.",
    mistakes: [
      { bad: `{songs.map(song => {\n  <Song key={song.id} title={song.title} />;\n})}`, good: `{songs.map(song => (\n  <Song key={song.id} title={song.title} />\n))}`, why: "With curly braces the arrow function needs `return`. Without it every item is `undefined` and nothing shows." },
      { bad: `{songs.map(song => (\n  <li>\n    <Song key={song.id} />\n  </li>\n))}`, good: `{songs.map(song => (\n  <li key={song.id}>\n    <Song />\n  </li>\n))}`, why: "The key belongs on the outermost element returned from `map`, which is the `<li>` here." }
    ],
    practice: [
      { level: "B", q: "Render `todos` (`{ id, text }`) as `<li>`s.", a: "Map with a key.", code: `<ul>\n  {todos.map(t => <li key={t.id}>{t.text}</li>)}\n</ul>` },
      { level: "B", q: "Why doesn't `{todos.forEach(t => <li>{t.text}</li>)}` show anything?", a: "`forEach` returns `undefined`. Use `map`, which returns a new array." },
      { level: "I", q: "Pass the whole song object as one prop.", a: "`<Song key={s.id} song={s} />` or spread: `<Song key={s.id} {...s} />`." },
      { level: "C", q: "Each recipe row needs a `<dt>` and `<dd>` with no wrapper. How do you key it?", a: "Use a keyed `Fragment` (short `<>` can't take a key).", code: `import { Fragment } from 'react';\n\n{recipes.map(r => (\n  <Fragment key={r.id}>\n    <dt>{r.name}</dt>\n    <dd>{r.time} min</dd>\n  </Fragment>\n))}` }
    ],
    quiz: [
      { q: "Where does the `key` go?", options: ["On the element returned by the `map` callback", "On the parent `<ul>`", "On the deepest child"], answer: 0, why: "React matches the items of the array, so the key goes on each array item." },
      { q: "Can the `Song` component read `props.key`?", options: ["Yes", "No, `key` is reserved for React"], answer: 1, why: "`key` is used by React and not passed down. Pass `id` as a separate prop if needed." },
      { q: "`items.map(i => { <li>{i}</li> })` renders…", options: ["The list", "Nothing", "An error"], answer: 1, why: "No `return` in a block body, so each item maps to `undefined`." }
    ],
    rev: {
      sec30: "`data.map(item => <Row key={item.id} {...} />)` is how React renders lists. `map` returns a new array; `forEach` doesn't. Key goes on the outermost element in the callback, using a stable id. `key` isn't passed as a prop. Use `<Fragment key>` for multi-element rows.",
      interview: [
        { level: "basic", q: "How do you render a list in React?", a: "Call `.map()` on the data array inside JSX, return an element per item, and give each a unique stable `key`." },
        { level: "intermediate", q: "Why `map` and not `forEach`?", a: "`map` returns a new array of elements that JSX can render. `forEach` returns `undefined`." },
        { level: "intermediate", q: "Can a child component access its `key`?", a: "No. `key` is consumed by React. Pass the id again under another prop name if the child needs it." },
        { level: "advanced", q: "How do you key a row that returns two sibling elements?", a: "Wrap them in `<Fragment key={id}>`. The `<>` shorthand doesn't accept keys." }
      ],
      predict: [
        { code: `const nums = [1, 2, 3];\nreturn <p>{nums.map(n => n * 2)}</p>;`, answer: "246", why: "`map` returns `[2, 4, 6]`; number arrays render joined. (No warning: keys are needed only for elements.)" }
      ],
      cheat: [
        "`{list.map(x => <Item key={x.id} {...x} />)}`",
        "`map` returns an array; `forEach` returns nothing",
        "Key on the outermost returned element",
        "`( )` arrow body returns; `{ }` needs `return`",
        "`key` isn't a readable prop",
        "Multi-element rows: `<Fragment key>`"
      ]
    },
    related: ["COND-007", "COND-011", "COND-009", "JSX-014"]
  },

  "COND-009": {
    tldr: "Use `.filter()` to keep only the items you want, then `.map()` them to JSX. Compute the filtered list **during render** from state; don't store it in a second state.",
    analogy: { icon: "🔍", text: "A recipe site's “Vegetarian only” tick box: the full cookbook stays on the shelf, you just see the matching pages." },
    visual: { type: "flow", title: "Search box → filtered list", steps: [
      { label: "Full list", detail: "`recipes` (6 items) never changes." },
      { label: "User types", detail: "`setQuery('pasta')` triggers a re-render." },
      { label: "Filter in render", detail: "`recipes.filter(r => r.name.includes(query))` gives 2 items." },
      { label: "Map", detail: "`.map(r => <li key={r.id}>…</li>)` draws only the matches." }
    ]},
    points: [
      "`filter` returns a **new array** and never changes the original.",
      "Keep the **source** list and the **query** in state; derive the visible list each render (derived state).",
      "Storing `filtered` in its own state goes **out of sync** when the source changes.",
      "Chain freely: `items.filter(...).map(...)`.",
      "Huge list and slow filtering? Wrap in `useMemo`, or let the React Compiler do it."
    ],
    code: { file: "RecipeSearch.jsx", lang: "jsx", src: `import { useState } from 'react';

const RECIPES = [
  { id: 1, name: 'Tomato pasta', veggie: true },
  { id: 2, name: 'Chicken curry', veggie: false },
  { id: 3, name: 'Pesto pasta', veggie: true },
  { id: 4, name: 'Beef tacos', veggie: false },
];

export default function RecipeSearch() {
  const [query, setQuery] = useState('');
  const [veggieOnly, setVeggieOnly] = useState(false);

  const visible = RECIPES
    .filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    .filter(r => !veggieOnly || r.veggie);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
      <label>
        <input type="checkbox" checked={veggieOnly} onChange={e => setVeggieOnly(e.target.checked)} />
        Vegetarian only
      </label>
      <ul>
        {visible.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [11, 12], note: "State holds only what the user controls: the search text and the checkbox." },
      { lines: [14, 15, 16], note: "Derive the visible list every render. Case-insensitive match, then the veggie rule." },
      { lines: [16], note: "`!veggieOnly || r.veggie`: when the box is off, everything passes." },
      { lines: [26], note: "Map only the filtered items." }
    ]},
    output: "All 4 recipes. Typing “pasta” leaves Tomato pasta and Pesto pasta. Ticking Vegetarian with no search hides the curry and tacos.",
    mistakes: [
      { bad: `const [filtered, setFiltered] = useState(recipes);\nuseEffect(() => {\n  setFiltered(recipes.filter(r => r.name.includes(query)));\n}, [query, recipes]);`, good: `const filtered = recipes.filter(r => r.name.includes(query));`, why: "Copying derived data into state adds an extra render and can drift out of sync. Just compute it during render." }
    ],
    practice: [
      { level: "B", q: "Show only todos that aren't done.", a: "`todos.filter(t => !t.done).map(t => <li key={t.id}>{t.text}</li>)`" },
      { level: "B", q: "Show products under £10.", a: "`products.filter(p => p.price < 10)`" },
      { level: "I", q: "Add All / Active / Done tabs to a todo list.", a: "Keep `filter` in state and derive.", code: `const visible = todos.filter(t =>\n  filter === 'all' ? true : filter === 'done' ? t.done : !t.done\n);` },
      { level: "C", q: "Show “3 of 10 recipes” above the results.", a: "Both numbers are derived: `{visible.length} of {RECIPES.length} recipes`. No extra state." }
    ],
    quiz: [
      { q: "Does `filter` change the original array?", options: ["Yes", "No, it returns a new array"], answer: 1, why: "`filter` is non-mutating, safe to use on state." },
      { q: "Best place to compute the filtered list?", options: ["In a `useEffect` that sets state", "Directly in the component body during render", "In the event handler only"], answer: 1, why: "Derived data should be calculated from state during render." },
      { q: "`items.filter(i => i.price > 5)` when nothing matches returns…", options: ["`undefined`", "`[]`", "`null`"], answer: 1, why: "An empty array, so `.map` safely renders nothing. Show an empty state for it." }
    ],
    rev: {
      sec30: "Filter before you map: `items.filter(test).map(toJSX)`. Keep the source list and the filter inputs in state; compute the visible list during render. Don't mirror it into another state with an effect: extra render, sync bugs. `filter` is non-mutating.",
      interview: [
        { level: "basic", q: "How do you show only some items of a list?", a: "Call `.filter()` with a test, then `.map()` the result to JSX." },
        { level: "intermediate", q: "Should the filtered list be in state?", a: "No. It's derived from the list and the query, so compute it during render. Storing it duplicates data and drifts." },
        { level: "advanced", q: "Filtering 10,000 items lags while typing. Options?", a: "Memoise with `useMemo`, keep input responsive with `useDeferredValue`, or virtualise the list. The React Compiler can auto-memoise." },
        { level: "tricky", q: "Why is `useEffect(() => setFiltered(...), [query])` worse than computing inline?", a: "It renders once with stale data, then again with the new list, so you get a flash of wrong results and an extra render." }
      ],
      cheat: [
        "`list.filter(test).map(toJSX)`",
        "`filter` returns a new array (non-mutating)",
        "State = source + query; visible list = derived",
        "No `useEffect` to sync filtered state",
        "Empty result is `[]`: show an empty state",
        "Slow? `useMemo` / `useDeferredValue`"
      ]
    },
    related: ["COND-008", "COND-010", "STATE-022", "COND-015"]
  },

  "COND-010": {
    tldr: "`array.sort()` **changes the array in place**, which mutates state. Sort a copy instead with `toSorted()` (or `[...arr].sort()`), during render.",
    analogy: { icon: "🗂️", text: "Sorting a photocopy of a playlist, not the original sheet. Everyone else still sees the original order; you get your sorted copy." },
    visual: { type: "compare", title: "sort() vs toSorted()", left: { label: "products.sort(...)", tone: "bad", points: ["Reorders the **original** array", "Mutates state behind React's back", "Same array reference: may not re-render", "Other components see the change too"] }, right: { label: "products.toSorted(...)", tone: "good", points: ["Returns a **new** sorted array", "State is untouched", "Safe in render", "ES2023, in all modern browsers"] } },
    points: [
      "Numbers: `(a, b) => a.price - b.price` (ascending). Swap to `b - a` for descending.",
      "Strings: `(a, b) => a.name.localeCompare(b.name)` handles case and accents.",
      "Default `sort()` with no compare function sorts **as text**: `[10, 9, 1]` becomes `[1, 10, 9]`.",
      "Keep `sortBy` in state and derive the sorted list each render.",
      "Older targets: `[...items].sort(fn)` or `items.slice().sort(fn)` makes the copy first."
    ],
    code: { file: "Products.jsx", lang: "jsx", src: `import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Bananas', price: 1.2 },
  { id: 2, name: 'apples', price: 2.5 },
  { id: 3, name: 'Cherries', price: 4.0 },
];

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name),
  priceUp: (a, b) => a.price - b.price,
  priceDown: (a, b) => b.price - a.price,
};

export default function Products() {
  const [sortBy, setSortBy] = useState('name');
  const sorted = PRODUCTS.toSorted(SORTERS[sortBy]);

  return (
    <div>
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="name">Name A–Z</option>
        <option value="priceUp">Price: low to high</option>
        <option value="priceDown">Price: high to low</option>
      </select>
      <ul>
        {sorted.map(p => <li key={p.id}>{p.name}: £{p.price.toFixed(2)}</li>)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [9, 10, 11, 12, 13], note: "Compare functions in a lookup: strings with `localeCompare`, numbers by subtraction." },
      { lines: [16], note: "Only the chosen sort key lives in state." },
      { lines: [17], note: "`toSorted` returns a new array; `PRODUCTS` keeps its order." },
      { lines: [27], note: "Keys are ids, so React moves the rows instead of rebuilding them." }
    ]},
    output: "“apples: £2.50, Bananas: £1.20, Cherries: £4.00”. Choosing “Price: low to high” reorders to Bananas, apples, Cherries.",
    mistakes: [
      { bad: `const [items, setItems] = useState(data);\nfunction sortByPrice() {\n  items.sort((a, b) => a.price - b.price);\n  setItems(items);\n}`, good: `function sortByPrice() {\n  setItems(items.toSorted((a, b) => a.price - b.price));\n}`, why: "`sort` mutates and keeps the same reference, so `setItems(items)` sees no change and React may skip the re-render." },
      { bad: `[10, 9, 1].toSorted()`, good: `[10, 9, 1].toSorted((a, b) => a - b)`, why: "Without a compare function, values are compared as strings: result `[1, 10, 9]`." }
    ],
    practice: [
      { level: "B", q: "Sort notes newest first by `createdAt` (a timestamp number).", a: "`notes.toSorted((a, b) => b.createdAt - a.createdAt)`" },
      { level: "B", q: "Sort contacts by name, ignoring case.", a: "`contacts.toSorted((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))`" },
      { level: "I", q: "Filter to in-stock products, then sort by price.", a: "Chain them; `filter` already returns a new array.", code: `const shown = products\n  .filter(p => p.stock > 0)\n  .toSorted((a, b) => a.price - b.price);` },
      { level: "C", q: "Add a column header that toggles ascending/descending on each click.", a: "State `{ key, dir }`; derive with `toSorted((a, b) => dir * compare(a, b))` where `dir` is `1` or `-1`." }
    ],
    quiz: [
      { q: "What's wrong with `items.sort(fn)` on state?", options: ["Nothing", "It mutates the state array in place", "It's slower"], answer: 1, why: "State must be treated as immutable; `sort` changes the original." },
      { q: "`[3, 20, 100].toSorted()` returns…", options: ["[3, 20, 100]", "[100, 20, 3]", "An error: mixed digits"], answer: 1, why: "Default sort compares as text: “100” < “20” < “3”. The numbers stay numbers." },
      { q: "Which compare sorts by price, high to low?", options: ["`(a, b) => a.price - b.price`", "`(a, b) => b.price - a.price`", "`(a, b) => a.price > b.price`"], answer: 1, why: "A negative result puts `a` first. `b - a` puts bigger prices first. Returning a boolean is unreliable." }
    ],
    rev: {
      sec30: "`sort()` mutates; never call it on state or props. Use `toSorted(fn)` (ES2023) or `[...arr].sort(fn)`. Numbers: `a - b`; strings: `localeCompare`. Default sort compares as strings. Keep only the sort key in state and derive the sorted list in render.",
      interview: [
        { level: "basic", q: "How do you sort a list in React without mutating state?", a: "Use `toSorted(compareFn)`, or copy first with `[...arr].sort(compareFn)`." },
        { level: "intermediate", q: "Why might `arr.sort(); setArr(arr)` not re-render?", a: "Same reference. React compares with `Object.is`, sees no change, and can bail out." },
        { level: "intermediate", q: "How do you sort strings correctly?", a: "`a.localeCompare(b)`. It handles case and accents; `<`/`>` compare by char code." },
        { level: "tricky", q: "Why does `[10, 1, 5].sort()` give `[1, 10, 5]`?", a: "With no compare function, JS converts to strings and sorts them as text. Pass `(a, b) => a - b`." }
      ],
      compare: { cols: ["", "Mutates", "Copy version"], rows: [
        ["Sort", "`sort()`", "`toSorted()`"],
        ["Reverse", "`reverse()`", "`toReversed()`"],
        ["Splice", "`splice()`", "`toSpliced()`"],
        ["Set index", "`arr[i] = x`", "`with(i, x)`"]
      ]},
      cheat: [
        "`sort()` mutates; `toSorted()` copies",
        "Numbers: `(a, b) => a - b`",
        "Strings: `a.localeCompare(b)`",
        "Default sort = text sort (`10` before `9`)",
        "Store `sortBy` in state, derive the list",
        "Fallback: `[...arr].sort(fn)`"
      ]
    },
    related: ["COND-009", "STATE-013", "STATE-016", "STATE-022"]
  },

  "COND-011": {
    tldr: "Each list item needs a `key` that is **unique among its siblings** and **stable** (the same item keeps the same key forever). Use an id from your data.",
    analogy: { icon: "🏷️", text: "Name tags at a party. If everyone keeps their own tag all night, you always know who's who, even when they swap seats." },
    visual: { type: "compare", title: "Good keys vs bad keys", left: { label: "Good keys", tone: "good", points: ["Database id: `todo.id`", "Generated once, on create: `crypto.randomUUID()`", "Unique natural value: an ISBN or email", "Same item → same key every render"] }, right: { label: "Bad keys", tone: "bad", points: ["`Math.random()` in render: new every time", "Array index on a list that changes", "A name that might repeat", "Missing: React warns and falls back to index"] } },
    points: [
      "**Unique** among siblings only; two different lists can reuse the same keys.",
      "**Stable**: generate ids when the item is **created** (or loaded), never during render.",
      "Prefer ids from the database or API; they're already unique and stable.",
      "Keys are strings or numbers. They're not passed as a prop to the child.",
      "Index as key is OK **only** for static lists that never reorder, insert or delete."
    ],
    code: { file: "Todos.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState(() => [
    { id: crypto.randomUUID(), text: 'Buy milk' },
    { id: crypto.randomUUID(), text: 'Call mum' },
  ]);
  const [text, setText] = useState('');

  function add() {
    const todo = { id: crypto.randomUUID(), text };
    setTodos([todo, ...todos]);
    setText('');
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={add} disabled={!text}>Add</button>
      <ul>
        {todos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [4, 5, 6, 7], note: "A lazy initializer (`() => [...]`) runs only on the first render, so the starting ids are made once." },
      { lines: [11], note: "A new id is created **when the todo is created**, inside the event handler." },
      { lines: [12], note: "New todo goes on top. Existing todos keep their ids." },
      { lines: [21], note: "`key={t.id}`: unique and stable, so React tracks each todo correctly." }
    ]},
    output: "“Buy milk” and “Call mum”. Typing “Water plants” and clicking Add puts it at the top.",
    mistakes: [
      { bad: `{todos.map(t => <li key={Math.random()}>{t.text}</li>)}`, good: `{todos.map(t => <li key={t.id}>{t.text}</li>)}`, why: "A random key changes every render, so React destroys and recreates every row each time: slow, and inputs lose focus and state." },
      { bad: `{users.map(u => <li key={u.firstName}>{u.firstName}</li>)}`, good: `{users.map(u => <li key={u.id}>{u.firstName}</li>)}`, why: "Two users named “Sam” collide. Duplicate keys cause a warning and mixed-up rows." }
    ],
    practice: [
      { level: "B", q: "Your API returns `{ productId, title }`. What's the key?", a: "`key={p.productId}`" },
      { level: "B", q: "Is it fine to use the same keys in two different `<ul>`s?", a: "Yes. Keys only need to be unique among siblings in the same array." },
      { level: "I", q: "Data from a CSV has no ids. Where do you add them?", a: "Once, when you load it: `rows.map(r => ({ ...r, id: crypto.randomUUID() }))`, then store that in state. Never during render." },
      { level: "C", q: "Can a key be a combination?", a: "Yes, if the combination is unique and stable, e.g. `key={order.id + '-' + line.sku}` for order lines." }
    ],
    quiz: [
      { q: "Keys must be unique…", options: ["Across the whole app", "Among siblings in the same list", "Per component file"], answer: 1, why: "React only compares keys within one list of siblings." },
      { q: "When should you generate a new id for a todo?", options: ["Inside `.map()` during render", "When the todo is created", "On every click"], answer: 1, why: "Generated once and stored, it stays stable across renders." },
      { q: "What does React do if you omit keys?", options: ["Throws an error", "Warns and uses the index", "Generates random keys"], answer: 1, why: "Dev warning: “Each child in a list should have a unique key prop”. It falls back to position." }
    ],
    rev: {
      sec30: "A key identifies a list item across renders. It must be unique among siblings and stable: the same item, the same key, every render. Use data ids; create ids when items are created, never in render. No `Math.random()`. Index is fine only for static lists.",
      interview: [
        { level: "basic", q: "What makes a good key?", a: "A value unique among siblings that never changes for that item, typically the database id." },
        { level: "intermediate", q: "Why is `Math.random()` a bad key?", a: "It changes every render, so React thinks every item is new and remounts them all: lost state, lost focus, wasted work." },
        { level: "intermediate", q: "Do keys need to be globally unique?", a: "No, only among siblings in the same array." },
        { level: "advanced", q: "Data arrives without ids. What do you do?", a: "Add ids once at load or creation time (e.g. `crypto.randomUUID()`) and store them, or use a unique natural field." },
        { level: "tricky", q: "Can a child read `props.key`?", a: "No. It's `undefined` in the child. Pass the id under another prop name." }
      ],
      cheat: [
        "Key = unique among siblings + stable",
        "Best: id from the database/API",
        "Generate ids on create, never in render",
        "Never `Math.random()` or `Date.now()` in render",
        "Index only for static, never-changing lists",
        "Missing key = dev warning + index fallback"
      ]
    },
    related: ["COND-008", "COND-012", "COND-013", "RENDER-009"]
  },

  "COND-012": {
    tldr: "Keys are how React **matches** list items between renders. Same key = same component (keep its state, update it). New key = create. Missing key = remove.",
    analogy: { icon: "🧥", text: "A cloakroom ticket: hand in ticket #42 and you get **your** coat back, even if the coats were moved around on the rail." },
    visual: { type: "flow", title: "React matching by key after inserting “Eggs” at the top", steps: [
      { label: "Before", detail: "Keys: `milk`, `bread`." },
      { label: "After", detail: "Keys: `eggs`, `milk`, `bread`." },
      { label: "Match", detail: "`milk` and `bread` found: **reuse** them, keep their state and DOM." },
      { label: "New key", detail: "`eggs` wasn't there before: **create** one new `<li>`." },
      { label: "Commit", detail: "One DOM insert. Nothing else is rebuilt." }
    ]},
    points: [
      "Without keys React matches by **position**: item 1 to item 1, item 2 to item 2.",
      "Position matching breaks when you insert, delete or reorder: state sticks to the **wrong** item.",
      "With keys, each component's **state and DOM** follow its data wherever it moves.",
      "Keys also mean less DOM work: React moves existing nodes instead of rewriting them.",
      "Changing a key on purpose **resets** a component: `<Profile key={userId} />`."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

function CartRow({ name }) {
  const [qty, setQty] = useState(1);
  return (
    <li>
      {name} × {qty}
      <button onClick={() => setQty(qty + 1)}>+</button>
    </li>
  );
}

export default function Cart() {
  const [items, setItems] = useState([
    { id: 'milk', name: 'Milk' },
    { id: 'bread', name: 'Bread' },
  ]);

  return (
    <div>
      <button onClick={() => setItems([{ id: 'eggs', name: 'Eggs' }, ...items])}>
        Add eggs on top
      </button>
      <ul>
        {items.map(item => <CartRow key={item.id} name={item.name} />)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [4], note: "Each row has its own state: the quantity." },
      { lines: [21], note: "Insert a new item at the **start** of the list, the tricky case for position matching." },
      { lines: [25], note: "Keyed by id: Milk's qty stays with Milk after Eggs is added above it." }
    ]},
    output: "Press + on Milk (Milk × 2), then “Add eggs on top”: Eggs × 1, Milk × 2, Bread × 1. The quantity stays with Milk.",
    mistakes: [
      { bad: `{items.map((item, i) => <CartRow key={i} name={item.name} />)}`, good: `{items.map(item => <CartRow key={item.id} name={item.name} />)}`, why: "With index keys, after inserting Eggs at index 0 the row at key 0 (which had Milk's qty 2) now shows “Eggs × 2”." }
    ],
    practice: [
      { level: "B", q: "In one sentence, what does React use a key for?", a: "To tell which item in the new list is the same as which item in the old list." },
      { level: "I", q: "You remove “Bread” from `[milk, bread, jam]` (keyed by id). What does React do?", a: "Keeps `milk` and `jam` as they are and unmounts only the `bread` row." },
      { level: "I", q: "Reset a recipe editor whenever the selected recipe changes.", a: "Give it the recipe id as a key.", code: `<RecipeEditor key={recipe.id} recipe={recipe} />` },
      { level: "C", q: "Reorder (drag) a keyed list of 1,000 rows. Does React recreate them?", a: "No. It matches by key and moves the existing DOM nodes, keeping each row's state." }
    ],
    quiz: [
      { q: "Without keys, how does React match list items?", options: ["By content", "By position (index)", "Randomly"], answer: 1, why: "It compares children slot by slot, which breaks when items shift." },
      { q: "An item's key stays the same but it moves from position 3 to 1. React…", options: ["Destroys and recreates it", "Moves it and keeps its state", "Ignores the move"], answer: 1, why: "Same key means same component, just in a new place." },
      { q: "`<Chat key={roomId} />` and `roomId` changes. What happens?", options: ["Chat updates its props", "Chat remounts with fresh state", "Nothing"], answer: 1, why: "A new key means a new identity: old instance unmounts, new one mounts." }
    ],
    rev: {
      sec30: "On re-render React compares the old and new children of a list. Keys give each one an identity: same key → reuse and update (state kept), new key → mount, gone key → unmount. Without keys it matches by position, so inserts and reorders attach state to the wrong item. Changing a key resets a component.",
      interview: [
        { level: "basic", q: "Why does React need keys?", a: "To identify which list items stayed, moved, were added or removed between renders, so it reuses the right components." },
        { level: "intermediate", q: "What goes wrong without stable keys?", a: "State and DOM (input text, focus, checkbox) stay attached to a position instead of an item, so they appear on the wrong row." },
        { level: "advanced", q: "How can you use `key` outside lists?", a: "To reset a component: `<Form key={userId} />` remounts it with fresh state whenever `userId` changes." },
        { level: "advanced", q: "Do keys make React faster?", a: "For dynamic lists, yes: React moves existing nodes instead of re-rendering and rewriting every item after a change." },
        { level: "tricky", q: "Same key but different component type: kept or remounted?", a: "Remounted. React needs both the same type and the same key to keep an instance." }
      ],
      scenario: [
        { q: "Switching between users in a profile editor shows the old user's unsaved text.", a: "The editor is the same type at the same spot, so its state is kept. Add `key={user.id}` to reset it per user." }
      ],
      cheat: [
        "Key = identity across renders",
        "Same key → reuse, keep state",
        "New key → mount; missing key → unmount",
        "No keys → matched by position",
        "Moves keep DOM nodes and state",
        "`key` change on purpose = reset"
      ]
    },
    related: ["COND-011", "COND-013", "COND-014", "RENDER-009"]
  },

  "COND-013": {
    tldr: "With `key={index}`, keys belong to **positions**, not items. Insert or delete near the top and each row's state (typed text, checkbox) slides onto the **wrong** item.",
    analogy: { icon: "🪑", text: "Cinema seats numbered by row order. Add a seat at the front and everyone's ticket now points to the person sitting one seat further along." },
    visual: { type: "timeline", title: "Index keys: adding “Eggs” at the top", frames: [
      { label: "Start", state: "key 0: Milk [note: 'semi']  ·  key 1: Bread", note: "You type “semi” in Milk's note input." },
      { label: "Insert Eggs", state: "data: Eggs, Milk, Bread", note: "New item at index 0." },
      { label: "React matches", state: "key 0 → Eggs, key 1 → Milk, key 2 → new", note: "Key 0 already existed, so React **reuses** that row." },
      { label: "Result 🐞", state: "Eggs [note: 'semi']  ·  Milk [ ]  ·  Bread [ ]", note: "The typed text stayed with key 0 and is now on Eggs." },
      { label: "With id keys", state: "Eggs [ ]  ·  Milk [note: 'semi']  ·  Bread [ ]", note: "Keys follow the items. Correct." }
    ]},
    points: [
      "The bug only shows when rows have **their own state**: uncontrolled inputs, local `useState`, focus, animations.",
      "Triggers: inserting at the start/middle, deleting, sorting, filtering.",
      "Appending to the **end** happens to work, which is why the bug hides in demos.",
      "Index keys are fine **only** for static lists that never change order or length.",
      "Fix: use a stable id (`key={item.id}`). Linters (`react/no-array-index-key`) flag this."
    ],
    code: { file: "Shopping.jsx", lang: "jsx", src: `import { useState } from 'react';

let nextId = 3;

export default function Shopping() {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk' },
    { id: 2, name: 'Bread' },
  ]);
  const [useIndex, setUseIndex] = useState(true);

  function addToTop() {
    setItems([{ id: nextId, name: 'Item ' + nextId++ }, ...items]);
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={useIndex} onChange={e => setUseIndex(e.target.checked)} />
        Use index as key
      </label>
      <button onClick={addToTop}>Add to top</button>
      <ul>
        {items.map((item, i) => (
          <li key={useIndex ? i : item.id}>
            {item.name} <input placeholder="Note" />
          </li>
        ))}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [3], note: "A simple id counter outside the component, so ids stay stable." },
      { lines: [12, 13, 14], note: "New items go to the **top**: the case that exposes index keys." },
      { lines: [25], note: "Toggle between index keys (buggy) and id keys (correct)." },
      { lines: [26], note: "An uncontrolled `<input>` holds its own DOM state, which follows the key." }
    ]},
    output: "Type “semi” in Milk's note and click “Add to top”. With index keys, “semi” now sits next to the new item. Untick the box, retry: the note stays with Milk.",
    mistakes: [
      { bad: `{todos.map((t, i) => (\n  <li key={i}>\n    <input type="checkbox" /> {t.text}\n  </li>\n))}`, good: `{todos.map(t => (\n  <li key={t.id}>\n    <input type="checkbox" /> {t.text}\n  </li>\n))}`, why: "Delete the first todo and its ticked checkbox jumps to the next todo, because key 0 now belongs to a different item." }
    ],
    practice: [
      { level: "B", q: "Is `key={i}` fine for the static footer links “About, Contact, Help”?", a: "Yes. The list never reorders, inserts or deletes, so positions never change meaning." },
      { level: "I", q: "Reproduce the bug: delete the first row of a todo list where row 2 is ticked. What do you see?", a: "With index keys, the tick now appears on what was row 3, which has moved up into slot 2. React kept the DOM checkbox of key 1." },
      { level: "I", q: "Your list items have no ids and the user can delete them. Fix it.", a: "Add ids when items are created or loaded: `{ id: crypto.randomUUID(), text }`. Then `key={item.id}`." },
      { level: "C", q: "With index keys, the inputs are **controlled** from parent state `items[i].note`. Is there still a bug?", a: "The text follows the data, so values look right. But row-local state (focus, local `useState`, animation) still sticks to positions, and React updates more rows than needed. Still use ids." }
    ],
    quiz: [
      { q: "Index keys break visibly when you…", options: ["Append to the end", "Insert at the start", "Re-render with the same data"], answer: 1, why: "Inserting at the start shifts every index, so every key now points to a different item." },
      { q: "Which rows are affected by the bug?", options: ["Rows with their own state (inputs, local state)", "Only rows with images", "Every row, always"], answer: 0, why: "Pure display rows re-render with the right text. State held inside rows is what goes to the wrong item." },
      { q: "When is index as key acceptable?", options: ["Never", "For static lists that never change order or length", "Whenever there are fewer than 10 items"], answer: 1, why: "If positions never change, the index is a stable identity." }
    ],
    rev: {
      sec30: "Index keys tie identity to position. After an insert, delete, sort or filter, React reuses row N for a different item, so row-local state (uncontrolled inputs, checkboxes, useState, focus) shows on the wrong item. Appending to the end hides the bug. Use stable ids; index only for static lists.",
      interview: [
        { level: "basic", q: "Why is using the index as key discouraged?", a: "Indexes change when the list changes, so React matches the wrong items and row state ends up on the wrong row." },
        { level: "intermediate", q: "Describe a concrete index-key bug.", a: "A todo list with checkboxes: tick todo 2, delete todo 1, and the tick moves to the old todo 3 because key 1 now belongs to it." },
        { level: "advanced", q: "Why does appending work but prepending doesn't?", a: "Appending keeps existing indexes for existing items. Prepending shifts every index by one, so every key changes owner." },
        { level: "tricky", q: "React falls back to index when keys are missing. Why not just accept that?", a: "It has the same bug, plus a warning. It's only safe for lists whose order and length never change." }
      ],
      debug: [
        { code: `{notes.map((n, i) => (\n  <NoteEditor key={i} note={n} onDelete={() => remove(n.id)} />\n))}`, fix: `{notes.map(n => (\n  <NoteEditor key={n.id} note={n} onDelete={() => remove(n.id)} />\n))}`, why: "Deleting a note shifts indexes, so each `NoteEditor`'s draft state ends up on the next note." }
      ],
      cheat: [
        "Index key = identity by position",
        "Breaks on insert, delete, sort, filter",
        "Appending to the end hides the bug",
        "Hits row-local state: inputs, checkboxes, focus",
        "OK only for static lists",
        "Fix: `key={item.id}`"
      ]
    },
    related: ["COND-011", "COND-012", "COND-014", "EVT-011"]
  },

  "COND-014": {
    tldr: "When a list changes, React compares the old and new children by **key** and type, then does the minimum DOM work: **insert** new keys, **move** reordered ones, **remove** missing ones, and **update** the rest.",
    analogy: { icon: "📋", text: "A teacher taking the register against yesterday's list: who's still here (keep), who's new (add a desk), who left (clear a desk), who changed seats (move)." },
    visual: { type: "timeline", title: "Old [A, B, C, D] → new [D, A, C, E]", frames: [
      { label: "Map old keys", state: "A, B, C, D indexed by key", note: "React looks up old children by key." },
      { label: "D", state: "found → reuse D", note: "Same key + same type: reuse, keep its state." },
      { label: "A, C", state: "found → reuse, move DOM nodes", note: "Props updated if needed; nodes moved so the order matches. State kept." },
      { label: "E", state: "not found → mount E", note: "New component, new DOM node, effects run." },
      { label: "Leftovers", state: "B unused → unmount B", note: "Cleanup effects run, DOM node removed." }
    ]},
    points: [
      "React keeps the decision cheap (roughly linear) with two rules: **different type → rebuild**, **keys identify siblings**.",
      "Same key + same type → **update** (re-render with new props, state kept).",
      "Same key + different type → old one **unmounts**, new one **mounts**.",
      "All of this is the **render phase** (diffing); real DOM changes happen in one **commit**.",
      "Reused items still **re-render** with their parent; `memo` can skip the ones whose props didn't change."
    ],
    code: { file: "Queue.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

function Track({ title }) {
  useEffect(() => {
    console.log('mount', title);
    return () => console.log('unmount', title);
  }, []);
  return <li>{title}</li>;
}

let next = 1;
const make = () => ({ id: next, title: 'Song ' + next++ });
const INITIAL = [make(), make(), make()];
export default function Queue() {
  const [tracks, setTracks] = useState(INITIAL);

  return (
    <div>
      <button onClick={() => setTracks([make(), ...tracks])}>Insert at top</button>
      <button onClick={() => setTracks(tracks.slice(1))}>Remove first</button>
      <button onClick={() => setTracks(tracks.toReversed())}>Reverse</button>
      <ol>
        {tracks.map(t => <Track key={t.id} title={t.title} />)}
      </ol>
    </div>
  );
}`, walk: [
      { lines: [4, 5, 6, 7], note: "Log when a row is created and destroyed, so you can watch reconciliation." },
      { lines: [13, 15], note: "3 starting tracks made once at module level (ids 1-3), so Strict Mode's double call can't skip ids." },
      { lines: [19], note: "Insert: only one `mount` logs. Existing rows are reused." },
      { lines: [20], note: "Remove: one `unmount`. Nothing else is recreated." },
      { lines: [21], note: "Reverse: **no** logs. Same keys, so React just moves DOM nodes." }
    ]},
    output: "Console: mount Song 1-3. Insert → “mount Song 4”. Remove first → “unmount Song 4”. Reverse → nothing logged. (Dev Strict Mode also logs an extra mount/unmount/mount on first load.)",
    mistakes: [
      { bad: `{tracks.map(t => {\n  function Row() { return <li>{t.title}</li>; }\n  return <Row key={t.id} />;\n})}`, good: `function Row({ title }) { return <li>{title}</li>; }\n...\n{tracks.map(t => <Row key={t.id} title={t.title} />)}`, why: "`Row` is a new function each render, so its type always differs and React remounts every row, despite the stable keys." }
    ],
    practice: [
      { level: "B", q: "Old keys `[a, b]`, new keys `[a, b, c]`. What does React do?", a: "Keeps `a` and `b` (updates them if props changed) and mounts `c`." },
      { level: "I", q: "Old `[a, b, c]`, new `[c, a]`. List the operations.", a: "Move `c` before `a`, keep `a`, unmount `b`." },
      { level: "I", q: "A row switches from `<TextRow key=\"x\" />` to `<ImageRow key=\"x\" />`. Kept or recreated?", a: "Recreated: the type changed, so the old row unmounts and the new one mounts, even with the same key." },
      { level: "C", q: "Reversing a 500-row list is slow even with keys. Why, and what helps?", a: "Keys avoid remounts, but every row still re-renders with the parent. Wrap the row in `memo` (or rely on the React Compiler) so unchanged rows skip rendering; virtualise very long lists." }
    ],
    quiz: [
      { q: "Old `[A, B, C]` → new `[A, C]` (keyed). What happens to C?", options: ["Remounted", "Kept and moved up", "Duplicated"], answer: 1, why: "Same key, so React reuses C and only B is unmounted." },
      { q: "When does React apply the DOM changes?", options: ["During diffing, one by one", "In the commit phase, after the render phase", "On the next browser idle"], answer: 1, why: "Rendering computes the changes; commit applies them all at once." },
      { q: "Same key, different component type. Result?", options: ["Update in place", "Unmount old, mount new", "Error"], answer: 1, why: "Identity needs both the same type and the same key." }
    ],
    rev: {
      sec30: "Reconciliation for lists: React matches new children to old ones by key (and type). Matched → update, state kept; moved → DOM node moved; new key → mount; leftover → unmount and cleanup. Different type = rebuild the subtree. Diffing happens in render; DOM changes happen in a single commit.",
      interview: [
        { level: "basic", q: "What is reconciliation?", a: "React comparing the new element tree with the previous one to work out the minimal DOM changes." },
        { level: "intermediate", q: "How does React handle a reordered keyed list?", a: "It finds each key's old fiber, reuses it, and moves the existing DOM node. No remounts, state kept." },
        { level: "advanced", q: "What heuristics keep diffing fast?", a: "Elements of different types produce different trees (rebuild instead of deep compare), and keys identify siblings. That avoids an expensive general tree diff." },
        { level: "advanced", q: "Does reusing an item mean it doesn't re-render?", a: "No. Reused items still re-render when the parent does. `memo` or the React Compiler can skip ones with unchanged props." },
        { level: "tricky", q: "Why does a component declared inside another component remount every render?", a: "Its function identity is new each render, so React sees a different type and rebuilds it." }
      ],
      predict: [
        { code: `// keys before: [1, 2, 3]\n// keys after:  [3, 2, 1]\n// Track logs on mount and unmount`, answer: "Nothing logs", why: "All keys still exist, so React only moves DOM nodes. No mounts or unmounts." }
      ],
      cheat: [
        "Match by key + type",
        "Same key & type → update, state kept",
        "New key → mount; missing key → unmount",
        "Reorder → DOM nodes moved, not rebuilt",
        "Different type → subtree rebuilt",
        "Diff in render, apply in one commit",
        "Reused ≠ skipped: `memo` to skip"
      ]
    },
    related: ["COND-012", "RENDER-005", "RENDER-009", "PERF-008"]
  },

  "COND-015": {
    tldr: "An empty state is the screen for **no data**. Don't show a blank box: say what's missing, why, and give a **next step** (add, clear filters, browse).",
    analogy: { icon: "🛍️", text: "An empty shop basket page that says “Your basket is empty, see today's deals” with a button, instead of a blank white page." },
    visual: { type: "compare", title: "Two kinds of empty", left: { label: "Nothing yet", tone: "neutral", points: ["`notes.length === 0`", "“No notes yet”", "Action: **Create your first note**", "Friendly icon or illustration"] }, right: { label: "No matches", tone: "neutral", points: ["`notes.length > 0` but `visible.length === 0`", "“No notes match ‘pasta’”", "Action: **Clear search**", "Keep the search box visible"] } },
    points: [
      "Check emptiness with `list.length === 0`, not `!list` (an empty array is truthy).",
      "Tell apart **no data at all** and **no results for this filter**: different message, different action.",
      "Always offer one clear **next action** button.",
      "Keep the page layout (headings, filters) so the user isn't lost.",
      "Empty is not loading: only show the empty state **after** data has loaded."
    ],
    code: { file: "Notes.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const visible = notes.filter(n => n.toLowerCase().includes(query.toLowerCase()));

  function addNote() {
    setNotes([...notes, 'Note ' + (notes.length + 1)]);
  }

  let body;
  if (notes.length === 0) {
    body = (
      <div className="empty">
        <p>📝 No notes yet</p>
        <button onClick={addNote}>Create your first note</button>
      </div>
    );
  } else if (visible.length === 0) {
    body = (
      <div className="empty">
        <p>No notes match “{query}”</p>
        <button onClick={() => setQuery('')}>Clear search</button>
      </div>
    );
  } else {
    body = <ul>{visible.map(n => <li key={n}>{n}</li>)}</ul>;
  }

  return (
    <section>
      <h1>My notes</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
      {body}
      {notes.length > 0 && <button onClick={addNote}>+ New note</button>}
    </section>
  );
}`, walk: [
      { lines: [6], note: "Derive the visible list from notes + query." },
      { lines: [13, 14, 15, 16, 17, 18, 19], note: "Truly empty: explain and offer to create one." },
      { lines: [20, 21, 22, 23, 24, 25, 26], note: "Has data but the filter hides everything: offer to clear it." },
      { lines: [27, 28], note: "Normal case. (Names are unique here, so they work as keys.)" },
      { lines: [32, 33, 34], note: "Heading and search stay put; only the body changes." }
    ]},
    output: "“📝 No notes yet” with a “Create your first note” button. After adding, the list appears; searching “xyz” shows “No notes match “xyz”” with Clear search.",
    mistakes: [
      { bad: `{!notes && <p>No notes yet</p>}`, good: `{notes.length === 0 && <p>No notes yet</p>}`, why: "`[]` is truthy, so `!notes` is false and the message never shows." },
      { bad: `if (notes.length === 0) return <p>No notes</p>;\n// while still loading`, good: `if (isLoading) return <Spinner />;\nif (notes.length === 0) return <EmptyNotes />;`, why: "Checking empty before loading finishes flashes “No notes” to users who actually have notes." }
    ],
    practice: [
      { level: "B", q: "Show “Your cart is empty” with a “Browse products” link when `cart` has no items.", a: "`{cart.length === 0 ? <p>Your cart is empty. <a href=\"/shop\">Browse products</a></p> : <CartList items={cart} />}`" },
      { level: "I", q: "Make a reusable `<EmptyState icon title action />` component.", a: "Props for the icon, text and an action element.", code: `function EmptyState({ icon, title, action }) {\n  return (\n    <div className=\"empty\">\n      <p>{icon} {title}</p>\n      {action}\n    </div>\n  );\n}` },
      { level: "I", q: "A todo list filtered to “Done” has no done items. What should it say?", a: "“Nothing done yet” with a “Show all” button, not the first-time “Add your first todo” message." },
      { level: "C", q: "Order the checks for a playlist page.", a: "Loading → error → empty → no matches → list. Each is a guard clause." }
    ],
    quiz: [
      { q: "`const list = []; if (!list) ...` — does the `if` run?", options: ["Yes", "No, `[]` is truthy"], answer: 1, why: "Every array is truthy. Check `.length === 0`." },
      { q: "Filter returns no results but the user has data. Best action?", options: ["“Create your first item”", "“Clear filters”", "Show nothing"], answer: 1, why: "The data exists; the filter is hiding it." },
      { q: "When should the empty state appear?", options: ["Before the request starts", "While loading", "After loading succeeds with zero items"], answer: 2, why: "Otherwise users briefly see “nothing here” while data is still coming." }
    ],
    rev: {
      sec30: "Empty states replace blank screens: explain what's missing and offer one next action. Distinguish “no data yet” (create) from “no matches” (clear filters). Check `length === 0`, not `!arr`. Show it only after loading succeeds, keep headings and filters on screen.",
      interview: [
        { level: "basic", q: "How do you check if a list is empty in JSX?", a: "`list.length === 0`. An empty array is truthy, so `!list` doesn't work." },
        { level: "intermediate", q: "What makes a good empty state?", a: "A clear message, a reason, and one call to action, inside the normal page layout." },
        { level: "intermediate", q: "Why distinguish “no data” from “no results”?", a: "They need different actions: create something vs clear the search or filters." },
        { level: "tricky", q: "Users briefly see “No orders” before their orders appear. Why?", a: "The empty check runs before loading finishes. Track loading status and check it first." }
      ],
      cheat: [
        "Check `list.length === 0`, never `!list`",
        "Message + reason + one action",
        "No data → “Create”; no matches → “Clear filters”",
        "Keep headings and filters visible",
        "Loading first, then empty",
        "Reusable `<EmptyState />` component"
      ]
    },
    related: ["COND-009", "COND-016", "COND-004", "COND-002"]
  },

  "COND-016": {
    tldr: "While data is on its way, show that something is happening: a **spinner** for small waits, a **skeleton** (grey placeholder shapes) for page content. Track it with a status in state.",
    analogy: { icon: "🍕", text: "A pizza tracker: “Your order is in the oven” beats a blank screen. A skeleton is like the empty plates already laid on the table, showing where the food will go." },
    visual: { type: "flow", title: "The loading lifecycle", steps: [
      { label: "Mount", detail: "`status = 'loading'` → render the skeleton." },
      { label: "Fetch starts", detail: "An effect requests the weather forecast." },
      { label: "Data arrives", detail: "`setDays(data)` and `setStatus('success')`." },
      { label: "Re-render", detail: "The skeleton is replaced by the real cards." }
    ]},
    points: [
      "Start in a loading state so the **first** render already shows feedback.",
      "**Skeletons** match the final layout, so content doesn't jump (less layout shift). Spinners suit buttons and small areas.",
      "Prefer one `status` (`'loading' | 'success' | 'error'`) over several booleans that can contradict.",
      "Avoid flicker for fast responses: delay the spinner ~200ms or keep showing old data while refreshing.",
      "Real apps: **TanStack Query** gives `isPending` and caching. **Suspense** shows a fallback for `lazy` code or Suspense-ready data (`use`, `useSuspenseQuery`)."
    ],
    code: { file: "Forecast.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

function fakeFetchForecast() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { day: 'Mon', icon: '☀️', temp: 21 },
      { day: 'Tue', icon: '🌧️', temp: 16 },
    ]), 1500)
  );
}

function Skeleton() {
  return <div className="card skeleton" aria-hidden="true" />;
}

export default function Forecast() {
  const [days, setDays] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let ignore = false;
    fakeFetchForecast().then(data => {
      if (!ignore) { setDays(data); setStatus('success'); }
    });
    return () => { ignore = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div aria-busy="true">
        <p className="sr-only">Loading forecast…</p>
        <Skeleton /><Skeleton />
      </div>
    );
  }

  return (
    <div>
      {days.map(d => <div className="card" key={d.day}>{d.day} {d.icon} {d.temp}°C</div>)}
    </div>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9, 10], note: "A fake API with a 1.5s delay so you can see the loading state." },
      { lines: [18], note: "Start in `'loading'`, so the very first paint is the skeleton." },
      { lines: [20, 21, 22, 23, 24, 25, 26], note: "Fetch on mount; `ignore` stops a late response updating after unmount." },
      { lines: [28, 29, 30, 31, 32, 33, 34, 35], note: "Guard clause: same-shaped grey cards, plus text for screen readers." },
      { lines: [37, 38, 39, 40], note: "Success: real cards replace the skeletons in the same spots." }
    ]},
    output: "Two grey placeholder cards for 1.5s, then “Mon ☀️ 21°C” and “Tue 🌧️ 16°C”.",
    mistakes: [
      { bad: `const [isLoading, setIsLoading] = useState(false);\nuseEffect(() => { setIsLoading(true); fetch(...) }, []);`, good: `const [status, setStatus] = useState('loading');`, why: "Starting at `false` renders the empty or broken UI for one frame before loading kicks in. Start in the loading state." },
      { bad: `const [isLoading, setIsLoading] = useState(true);\nconst [isError, setIsError] = useState(false);\n// both can end up true`, good: `const [status, setStatus] = useState('loading');\n// 'loading' | 'success' | 'error'`, why: "Separate booleans allow impossible combinations. One status value can only be one thing." }
    ],
    practice: [
      { level: "B", q: "Disable a “Save recipe” button and show “Saving…” while a request runs.", a: "`<button disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>`" },
      { level: "I", q: "Render 5 skeleton rows for a chat list while loading.", a: "Map over a fixed-length array.", code: `{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} />)}` },
      { level: "I", q: "Why is `key={i}` fine for those skeletons?", a: "They're a static placeholder list with no state that never reorders, the safe case for index keys." },
      { level: "C", q: "A refresh button reloads data. Should the list vanish into skeletons each time?", a: "No. Keep showing the old data with a small “Refreshing…” indicator. TanStack Query separates `isPending` (no data yet) from `isFetching` (background refresh)." }
    ],
    quiz: [
      { q: "Skeleton vs spinner: why use a skeleton for a page of cards?", options: ["It loads data faster", "It matches the final layout, so less jumping", "Spinners are deprecated"], answer: 1, why: "Placeholders reserve space and show the shape of what's coming." },
      { q: "Best initial status for a component that fetches on mount?", options: ["`'idle'`", "`'loading'`", "`'success'`"], answer: 1, why: "The fetch starts right away, so the first render should already show loading." },
      { q: "What's the `ignore` flag in the effect for?", options: ["Speed", "To skip setting state from a stale or unmounted request", "Strict Mode only"], answer: 1, why: "If the component unmounts or the effect re-runs, the old response is ignored." }
    ],
    rev: {
      sec30: "Show loading feedback from the first render: start with `status = 'loading'`. Skeletons for content (no layout jump), spinners for small actions. One status beats several booleans. Avoid flashes for fast loads and keep old data visible on refresh. TanStack Query's `isPending`/`isFetching` handles most of this in real apps.",
      interview: [
        { level: "basic", q: "How do you show a loading state?", a: "Keep a status in state, set it to loading before the request, and render a spinner or skeleton until data arrives." },
        { level: "intermediate", q: "Skeleton or spinner?", a: "Skeletons for content areas: they match the final layout and feel faster. Spinners for short, small actions like a button." },
        { level: "intermediate", q: "Why a status string instead of `isLoading` + `isError`?", a: "Booleans can be true at the same time. A single status makes impossible states unrepresentable." },
        { level: "advanced", q: "How do you avoid a spinner flash on fast responses?", a: "Delay showing it (~200ms), keep previous data during refetch, or use `useTransition` / Suspense to keep old UI until new UI is ready." },
        { level: "tricky", q: "In dev, your fetch runs twice on mount. Is that a bug?", a: "Strict Mode mounts, unmounts and remounts in development to test cleanup. Production runs once. The `ignore` cleanup handles it." }
      ],
      cheat: [
        "Start with `status = 'loading'`",
        "Skeleton for content, spinner for small actions",
        "One status: `loading | success | error`",
        "`aria-busy` + screen-reader text",
        "Keep old data while refreshing",
        "Dev Strict Mode fetches twice; prod once",
        "Real apps: TanStack Query `isPending`"
      ]
    },
    related: ["API-013", "COND-017", "COND-015", "ADV-003"]
  },

  "COND-017": {
    tldr: "When something fails, show a **friendly message** and a **Try again** button instead of a blank or broken screen. Keep the error in state and re-run the request on retry.",
    analogy: { icon: "📶", text: "A music app with no signal: “Can't load your playlist. Check your connection.” and a **Retry** button, rather than freezing." },
    visual: { type: "cycle", title: "Error and retry loop", steps: [
      { label: "Loading", detail: "Request the playlist." },
      { label: "Error", detail: "Network fails or `res.ok` is false: `setStatus('error')`." },
      { label: "Show message", detail: "Plain-English message + **Try again** button." },
      { label: "Retry", detail: "Click sets `'loading'` and bumps `attempt`; the effect fetches again." }
    ]},
    points: [
      "`fetch` only rejects on **network** errors. Check `res.ok` and throw for 404/500 yourself.",
      "Say **what** failed and **what to do**, in plain words. Log technical details, don't show them.",
      "Make it **recoverable**: a retry button, or a link back. Keep the rest of the page working.",
      "Retry pattern: put an `attempt` counter in the effect's dependencies and increment it.",
      "Errors thrown **while rendering** need an **Error Boundary**; try/catch only covers async code and handlers."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

export default function Playlist() {
  const [songs, setSongs] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch('/api/playlist')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => { if (!ignore) { setSongs(data); setStatus('success'); } })
      .catch(err => {
        console.error(err);
        if (!ignore) setStatus('error');
      });
    return () => { ignore = true; };
  }, [attempt]);

  if (status === 'loading') return <p>Loading playlist…</p>;

  if (status === 'error') {
    return (
      <div role="alert">
        <p>😕 We couldn't load your playlist.</p>
        <button onClick={() => { setStatus('loading'); setAttempt(a => a + 1); }}>
          Try again
        </button>
      </div>
    );
  }

  return <ul>{songs.map(s => <li key={s.id}>{s.title}</li>)}</ul>;
}`, walk: [
      { lines: [6], note: "A retry counter. Changing it re-runs the effect." },
      { lines: [12], note: "Turn HTTP errors (404, 500) into thrown errors; `fetch` won't do it for you." },
      { lines: [16, 17, 18, 19], note: "Log details for developers, show a simple state to users." },
      { lines: [21], note: "`attempt` in the deps: each retry triggers a fresh fetch." },
      { lines: [27, 28, 29, 30], note: "`role=\"alert\"` announces it. The click sets `'loading'` in the handler (not the effect) and bumps `attempt`." }
    ]},
    output: "If `/api/playlist` fails: “😕 We couldn't load your playlist.” and a **Try again** button. Clicking it shows “Loading playlist…” and fetches again.",
    mistakes: [
      { bad: `fetch(url)\n  .then(res => res.json())\n  .then(setSongs)\n  .catch(() => setStatus('error'));`, good: `fetch(url)\n  .then(res => {\n    if (!res.ok) throw new Error('HTTP ' + res.status);\n    return res.json();\n  })\n  .then(setSongs)\n  .catch(() => setStatus('error'));`, why: "A 500 response doesn't reject. Without the `res.ok` check you'd try to parse an error page and never show the error state." },
      { bad: `<p>Error: TypeError: Cannot read properties of undefined (reading 'map')</p>`, good: `<p>We couldn't load your playlist.</p>\n<button onClick={retry}>Try again</button>`, why: "Raw technical errors confuse users and can leak internals. Show a friendly message with an action; log the details." }
    ],
    practice: [
      { level: "B", q: "Show “Recipe not found” for a 404 and a generic message for other errors.", a: "Store the status code: `setError(res.status)`, then `{error === 404 ? 'Recipe not found' : 'Something went wrong'}`." },
      { level: "I", q: "Implement retry without a counter.", a: "Move the fetch into a `load` function and call it from both the effect and the button. The counter version is simpler to keep race-safe." },
      { level: "I", q: "A form save fails. Where does the error go?", a: "Next to the form, with the user's input kept, and the Save button enabled again so they can retry." },
      { level: "C", q: "A component crashes while rendering (`undefined.map`). Will your `.catch` show the error state?", a: "No. Render errors aren't inside the promise. Wrap the area in an Error Boundary (e.g. `react-error-boundary`) with a fallback and reset button." }
    ],
    quiz: [
      { q: "`fetch` receives a 500 response. What happens?", options: ["The promise rejects", "It resolves; `res.ok` is false", "React throws"], answer: 1, why: "`fetch` only rejects on network failure. Check `res.ok`." },
      { q: "How does the `attempt` counter trigger a retry?", options: ["It reloads the page", "It's in the effect's deps, so changing it re-runs the effect", "React retries automatically"], answer: 1, why: "A dependency change re-runs the effect, starting a new request." },
      { q: "What catches errors thrown during rendering?", options: ["try/catch in the effect", "An Error Boundary", "`.catch()` on fetch"], answer: 1, why: "Error Boundaries catch errors in rendering and lifecycle of their children." }
    ],
    rev: {
      sec30: "Error states turn failures into a recoverable screen: friendly message, a Try again button, the rest of the app still working. `fetch` doesn't reject on 4xx/5xx, so check `res.ok`. Retry by re-running the effect (an `attempt` dep). Render-time crashes need an Error Boundary. Log details, show plain words.",
      interview: [
        { level: "basic", q: "What should an error state contain?", a: "A plain message about what failed, a way to recover (retry or go back), and no raw stack traces." },
        { level: "intermediate", q: "Why check `res.ok` with fetch?", a: "`fetch` resolves for any HTTP response, including 404 and 500. Only network failures reject." },
        { level: "intermediate", q: "How do you implement a retry button?", a: "Keep a counter in state as an effect dependency and increment it, or call the load function again. TanStack Query gives you `refetch()`." },
        { level: "advanced", q: "try/catch vs Error Boundary?", a: "try/catch handles async work and event handlers. Error Boundaries catch errors thrown while rendering children and show a fallback UI." },
        { level: "tricky", q: "Retry is clicked twice quickly. How do you avoid a stale response winning?", a: "Use the effect cleanup (`ignore` flag or `AbortController`) so only the latest request may set state." }
      ],
      scenario: [
        { q: "The weather widget fails, and the whole dashboard goes blank.", a: "Isolate it: catch its fetch error and show a local retry message, and wrap the widget in its own Error Boundary so one failure doesn't take down the page." }
      ],
      cheat: [
        "Friendly message + Try again",
        "`fetch` rejects only on network errors: check `res.ok`",
        "Retry: bump an `attempt` dep",
        "`role=\"alert\"` for screen readers",
        "Log details, show plain words",
        "Render crashes → Error Boundary",
        "Cleanup (`ignore`/abort) avoids stale responses"
      ]
    },
    related: ["API-014", "ADV-004", "COND-016", "API-028"]
  }
};
