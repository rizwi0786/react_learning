export default {
  "EVT-001": {
    tldr: "An event handler is a function React runs when something happens (a click, a keypress). Pass the function itself: `onClick={handleClick}`. Writing `onClick={handleClick()}` runs it during render instead.",
    analogy: { icon: "🔔", text: "A shop doorbell. You give the shop the bell to ring when a customer arrives. You don't ring it yourself while installing it." },
    visual: { type: "flow", title: "From click to handler", steps: [
      { label: "Render", detail: "React reads `onClick={handleAdd}` and stores the function. Nothing runs yet." },
      { label: "User clicks", detail: "The browser fires a click on the button." },
      { label: "React calls it", detail: "React calls `handleAdd(event)` for you." },
      { label: "State update", detail: "The handler calls a setter; React re-renders with the new value." }
    ]},
    points: [
      "Event props are **camelCase**: `onClick`, `onChange`, `onSubmit` (not `onclick`).",
      "Pass a **function reference**: `onClick={handleAdd}`. `onClick={handleAdd()}` calls it on every render.",
      "Need arguments? Wrap it: `onClick={() => addToCart(id)}`.",
      "Name handlers `handleX` and handler props `onX`: `<Button onClick={handleSave} />`.",
      "Handlers are where **side effects** belong: updating state, logging, sending a request."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function App() {
  const [likes, setLikes] = useState(0);

  function handleLike() {
    setLikes(likes + 1);
  }

  return (
    <div>
      <p>❤️ {likes} likes</p>
      <button onClick={handleLike}>Like</button>
      <button onClick={() => setLikes(0)}>Reset</button>
    </div>
  );
}`, walk: [
      { lines: [6, 7, 8], note: "Define the handler inside the component so it can read and set state." },
      { lines: [13], note: "Pass the function itself. React will call it on each click." },
      { lines: [14], note: "Inline arrow: fine for one-liners or when you need to pass an argument." }
    ]},
    output: "“❤️ 0 likes” with Like and Reset buttons. Like adds 1, Reset goes back to 0.",
    mistakes: [
      { bad: `<button onClick={handleLike()}>Like</button>`, good: `<button onClick={handleLike}>Like</button>`, why: "The `()` calls the function during render. If it sets state you get an infinite render loop (\"Too many re-renders\")." },
      { bad: `<button onclick={handleLike}>Like</button>`, good: `<button onClick={handleLike}>Like</button>`, why: "React event props are camelCase. Lowercase `onclick` is not a React event and won't fire." }
    ],
    practice: [
      { level: "B", q: "Add a **Dislike** button that lowers `likes` by 1.", a: "Add a `handleDislike` that calls `setLikes(likes - 1)` and pass it to `onClick`.", code: `<button onClick={() => setLikes(likes - 1)}>Dislike</button>` },
      { level: "B", q: "Log “clicked” to the console on every Like click.", a: "Put `console.log('clicked')` inside `handleLike`, not in the JSX." },
      { level: "I", q: "Make a `<LikeButton onLike={...} />` component that receives the handler from its parent.", a: "The child renders `<button onClick={onLike}>`; the parent passes `onLike={handleLike}`.", code: `function LikeButton({ onLike }) {\n  return <button onClick={onLike}>Like</button>;\n}` },
      { level: "C", q: "Why does `onClick={setLikes(likes + 1)}` crash the app?", a: "It runs during render, sets state, triggers another render, which runs it again: an infinite loop React stops with \"Too many re-renders\"." }
    ],
    quiz: [
      { q: "Which line runs the handler only when clicked?", options: ["`onClick={save()}`", "`onClick={save}`", "`onClick=\"save()\"`"], answer: 1, why: "Passing the reference lets React call it later. `save()` runs immediately during render." },
      { q: "How do you pass an id to a handler?", options: ["`onClick={remove(id)}`", "`onClick={() => remove(id)}`", "`onClick={remove, id}`"], answer: 1, why: "The arrow creates a new function that calls `remove(id)` only when clicked." },
      { q: "Where should you put side effects like `setState` for a click?", options: ["In the event handler", "Directly in the JSX body", "In the component's return value"], answer: 0, why: "Handlers run on user action; rendering must stay pure." }
    ],
    rev: {
      sec30: "Handlers are functions passed as camelCase props (`onClick`, `onChange`). Pass a reference, not a call: `onClick={fn}`, not `onClick={fn()}`. Wrap in an arrow to pass arguments. Handlers are the right place for side effects like setting state.",
      interview: [
        { level: "basic", q: "What's the difference between `onClick={fn}` and `onClick={fn()}`?", a: "The first passes the function for React to call on click. The second calls it during render and passes its return value." },
        { level: "basic", q: "How do React events differ from HTML `onclick` attributes?", a: "React uses camelCase props and takes a function, not a string. React also wraps the native event (synthetic event)." },
        { level: "intermediate", q: "Is an inline arrow `onClick={() => f(id)}` bad for performance?", a: "Usually no. A new function per render is cheap. It only matters when passed to a memoized child; the React Compiler (opt-in) handles most of that." },
        { level: "tricky", q: "Why can `onClick={setOpen(true)}` cause \"Too many re-renders\"?", a: "It sets state during render, which schedules another render, which sets state again. React aborts the loop." }
      ],
      debug: [
        { code: `<button onClick={addItem(item)}>Add</button>`, fix: `<button onClick={() => addItem(item)}>Add</button>`, why: "`addItem(item)` ran during render. The arrow defers it until the click." }
      ],
      cheat: [
        "`onClick={fn}` passes; `onClick={fn()}` calls now",
        "Arguments: `onClick={() => fn(id)}`",
        "Event props are camelCase: `onClick`, `onChange`, `onSubmit`",
        "Name handlers `handleX`, handler props `onX`",
        "Side effects go in handlers, not in render",
        "React calls the handler with an event object"
      ]
    },
    related: ["EVT-003", "EVT-002", "STATE-004", "WEB-016"]
  },

  "EVT-002": {
    tldr: "React hands your handler a **synthetic event**: a thin wrapper around the browser's event that works the same in every browser. React doesn't put a listener on each button; it listens once at the **root** and dispatches to your handlers (delegation).",
    analogy: { icon: "📞", text: "A restaurant's single phone line. One receptionist takes every call and forwards it to the right table, instead of every table having its own phone." },
    visual: { type: "flow", title: "How a click reaches your handler", steps: [
      { label: "Native click", detail: "The browser fires a real `click` on the `<button>` and it bubbles up the DOM." },
      { label: "Root listener", detail: "React's single listener on the root container (`#root`) catches it." },
      { label: "Find the fiber", detail: "React maps the DOM node back to your component and its `onClick`." },
      { label: "Wrap it", detail: "React creates a `SyntheticEvent` with the same API in every browser." },
      { label: "Dispatch", detail: "React calls handlers from the target up to the root, like normal bubbling." }
    ]},
    points: [
      "A synthetic event has the familiar API: `target`, `currentTarget`, `preventDefault()`, `stopPropagation()`.",
      "The real browser event is still there: `e.nativeEvent`.",
      "Since React 17, listeners attach to the **root container**, not `document`. Two React apps on one page don't clash.",
      "**Event pooling is gone** (React 17+): you can read `e.target` inside a `setTimeout` or after `await`.",
      "React's `onChange` fires on every keystroke (it maps to the native `input` event), unlike HTML's `change`."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `export default function App() {
  function handleClick(e) {
    console.log(e.type);              // "click"
    console.log(e.target.textContent); // "Add to cart"
    console.log(e.nativeEvent instanceof MouseEvent); // true
  }

  return (
    <button onClick={handleClick}>Add to cart</button>
  );
}`, walk: [
      { lines: [2], note: "React passes a `SyntheticEvent` as the first argument." },
      { lines: [3, 4], note: "Same names as the DOM API, so your browser knowledge carries over." },
      { lines: [5], note: "`nativeEvent` is the raw browser event if you need something React doesn't expose." },
      { lines: [9], note: "No listener is added to this button. React's root listener handles it." }
    ]},
    output: "Console: click, Add to cart, true.",
    mistakes: [
      { bad: `button.addEventListener('click', ...)\n// inside render, on a DOM node you looked up`, good: `<button onClick={handleClick}>`, why: "Manual listeners bypass React and leak if never removed. Use React props; use `useEffect` + cleanup only for `window`/`document` events." },
      { bad: `e.persist(); // needed to read e later`, good: `setTimeout(() => console.log(e.target), 0);`, why: "`persist()` was for event pooling, removed in React 17. It does nothing now." }
    ],
    practice: [
      { level: "B", q: "Log the mouse position (`clientX`, `clientY`) when a picture is clicked.", a: "Read `e.clientX` and `e.clientY` from the synthetic event.", code: `<img onClick={e => console.log(e.clientX, e.clientY)} src="cake.jpg" />` },
      { level: "I", q: "Where does React attach its click listener in React 19?", a: "On the root DOM container passed to `createRoot` (e.g. `#root`), not on each element and not on `document`." },
      { level: "I", q: "You need the browser's raw `KeyboardEvent`. How?", a: "Use `e.nativeEvent`." },
      { level: "C", q: "Listen for the Escape key anywhere on the page to close a chat panel.", a: "React props only cover your tree. Add a `keydown` listener to `window` in `useEffect` and remove it in cleanup.", code: `useEffect(() => {\n  const onKey = e => e.key === 'Escape' && setOpen(false);\n  window.addEventListener('keydown', onKey);\n  return () => window.removeEventListener('keydown', onKey);\n}, []);` }
    ],
    quiz: [
      { q: "Where does React 17+ attach its event listeners?", options: ["On every element with a handler", "On `document`", "On the root container"], answer: 2, why: "React 17 moved delegation from `document` to the root container." },
      { q: "Can you read `e.target` inside a `setTimeout` in React 19?", options: ["Yes", "No, the event is pooled and cleared"], answer: 0, why: "Pooling was removed in React 17; event objects keep their values." },
      { q: "When does React's `onChange` fire on a text input?", options: ["When the input loses focus", "On every keystroke", "Only on Enter"], answer: 1, why: "React wires `onChange` to the native `input` event." }
    ],
    rev: {
      sec30: "React wraps native events in a `SyntheticEvent` with a consistent cross-browser API (`e.nativeEvent` gives the raw one). It uses delegation: one listener per event type on the root container (since React 17), then dispatches through the component tree. Pooling no longer exists.",
      interview: [
        { level: "basic", q: "What is a synthetic event?", a: "React's cross-browser wrapper around the native event. Same interface (`target`, `preventDefault`, etc.), consistent behavior everywhere." },
        { level: "intermediate", q: "What is event delegation in React?", a: "React registers one listener per event type at the root and finds the right handlers by walking the fiber tree, instead of adding a listener to every node." },
        { level: "intermediate", q: "What changed with events in React 17?", a: "Listeners moved from `document` to the root container, and event pooling was removed. `onScroll` stopped bubbling too." },
        { level: "advanced", q: "Why did React move delegation off `document`?", a: "So multiple React versions or roots on one page don't interfere, and `stopPropagation` in React behaves sensibly with non-React code." },
        { level: "tricky", q: "Is React's `onChange` the same as the DOM `change` event?", a: "No. React's `onChange` fires on every input, like the native `input` event. The DOM `change` fires on blur/commit." }
      ],
      cheat: [
        "`SyntheticEvent` = cross-browser wrapper over the native event",
        "`e.nativeEvent` = the raw browser event",
        "One listener per event type on the root container (React 17+)",
        "No event pooling since React 17; `e.persist()` is a no-op",
        "`onChange` fires per keystroke (native `input`)",
        "Use `useEffect` + cleanup for `window`/`document` listeners"
      ]
    },
    related: ["EVT-001", "EVT-008", "WEB-036", "WEB-035"]
  },

  "EVT-003": {
    tldr: "`onClick` runs a function when an element is clicked. To pass data, like which song or which product, wrap the call in an arrow: `onClick={() => play(song.id)}`.",
    analogy: { icon: "🎵", text: "A playlist where each row has its own Play button. Every button calls the same player, but tells it which song." },
    visual: { type: "timeline", title: "One handler, many rows", frames: [
      { label: "Render", state: "3 rows, 3 arrows", note: "Each row gets `() => play(song.id)` with its own id baked in (closure)." },
      { label: "Click row 2", state: "play(2)", note: "Only row 2's arrow runs." },
      { label: "Re-render", state: "nowPlaying = 2", note: "The setter updates state; row 2 shows ▶." },
      { label: "Click row 3", state: "play(3)", note: "Same function, different argument." }
    ]},
    points: [
      "No arguments needed? Pass the reference: `onClick={handlePlay}`.",
      "Need arguments? Arrow: `onClick={() => handlePlay(song.id)}`.",
      "Need the event too? `onClick={e => handlePlay(e, song.id)}`.",
      "Use `onClick` on real `<button>`s. A clickable `<div>` isn't keyboard-accessible.",
      "Inside a `<form>`, a `<button>` defaults to `type=\"submit\"`. Add `type=\"button\"` for plain actions."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { useState } from 'react';

const songs = [
  { id: 1, title: 'Morning Coffee' },
  { id: 2, title: 'Rainy Day' },
  { id: 3, title: 'Night Drive' },
];

export default function Playlist() {
  const [nowPlaying, setNowPlaying] = useState(null);

  function handlePlay(id) {
    setNowPlaying(id);
  }

  return (
    <ul>
      {songs.map(song => (
        <li key={song.id}>
          {nowPlaying === song.id ? '▶ ' : ''}{song.title}
          <button onClick={() => handlePlay(song.id)}>Play</button>
        </li>
      ))}
    </ul>
  );
}`, walk: [
      { lines: [12, 13, 14], note: "One handler that takes the id as a parameter." },
      { lines: [21], note: "The arrow remembers this row's `song.id` and calls the handler only on click." },
      { lines: [20], note: "The clicked row shows ▶ after the re-render." }
    ]},
    output: "Three songs with Play buttons. Clicking one puts ▶ in front of its title.",
    mistakes: [
      { bad: `<button onClick={handlePlay(song.id)}>Play</button>`, good: `<button onClick={() => handlePlay(song.id)}>Play</button>`, why: "Without the arrow, every row calls `handlePlay` during render, which sets state during render: React stops with \"Too many re-renders\"." },
      { bad: `<div onClick={addToCart}>Add</div>`, good: `<button type="button" onClick={addToCart}>Add</button>`, why: "Buttons get focus, Enter/Space and screen-reader support for free. Divs don't." }
    ],
    practice: [
      { level: "B", q: "Add a **Stop** button that sets `nowPlaying` back to `null`.", a: "`<button onClick={() => setNowPlaying(null)}>Stop</button>`" },
      { level: "I", q: "Clicking the playing song again should stop it (toggle).", a: "In the handler: `setNowPlaying(cur => cur === id ? null : id)`.", code: `function handlePlay(id) {\n  setNowPlaying(cur => (cur === id ? null : id));\n}` },
      { level: "I", q: "A product card has a **Remove** button inside a `<form>`. Clicking it submits the form. Fix it.", a: "Add `type=\"button\"`; buttons in forms default to submit." },
      { level: "C", q: "Pass both the event and the id, and log which mouse button was used.", a: "`onClick={e => handlePlay(e, song.id)}` then read `e.button` (0 = left)." }
    ],
    quiz: [
      { q: "You render 3 rows with `onClick={() => remove(item.id)}`. What happens on render?", options: ["`remove` runs 3 times", "Nothing runs until a click", "Only the last row works"], answer: 1, why: "Each arrow is just created; it runs only when its button is clicked." },
      { q: "Default `type` of a `<button>` inside a `<form>`?", options: ["button", "submit", "reset"], answer: 1, why: "That's why plain action buttons in forms need `type=\"button\"`." },
      { q: "Best element for a clickable \"Add to cart\"?", options: ["`<div onClick>`", "`<span onClick>`", "`<button onClick>`"], answer: 2, why: "A button is focusable and works with keyboard and screen readers." }
    ],
    rev: {
      sec30: "`onClick` takes a function. Pass a reference when no args are needed; use an arrow `() => fn(id)` to pass data. Use real `<button>`s for accessibility, and `type=\"button\"` inside forms so they don't submit.",
      interview: [
        { level: "basic", q: "How do you pass an argument to an `onClick` handler?", a: "Wrap it in an arrow: `onClick={() => handle(id)}`. The arrow closes over `id`." },
        { level: "intermediate", q: "Alternative to an arrow for passing data?", a: "Store it on the element (`data-id={id}`) and read `e.currentTarget.dataset.id`, or use `fn.bind(null, id)`. Arrows are the most readable." },
        { level: "intermediate", q: "Why does a button inside a form reload the page?", a: "Its default type is `submit`, so it triggers a native form submit. Use `type=\"button\"` or handle `onSubmit` with `preventDefault()`." },
        { level: "tricky", q: "Why prefer `<button>` over `<div onClick>`?", a: "Buttons are focusable and fire click on Enter/Space; divs need `role`, `tabIndex` and key handlers to match." }
      ],
      predict: [
        { code: `{[1, 2, 3].map(n => (\n  <button key={n} onClick={console.log(n)}>{n}</button>\n))}`, answer: "Logs 1, 2, 3 on render; clicks log nothing", why: "`console.log(n)` runs during render and returns `undefined`, so no handler is attached. (Dev Strict Mode renders twice, so you may see the logs twice.)" }
      ],
      cheat: [
        "No args: `onClick={handle}`",
        "With args: `onClick={() => handle(id)}`",
        "With event + args: `onClick={e => handle(e, id)}`",
        "Use `<button>`, not `<div>`, for clicks",
        "In forms, add `type=\"button\"` to non-submit buttons",
        "`data-*` + `e.currentTarget.dataset` is an alternative"
      ]
    },
    related: ["EVT-001", "EVT-007", "STATE-010", "WEB-020"]
  },

  "EVT-004": {
    tldr: "`onChange` fires on **every keystroke** in an input. Read what the user typed with `e.target.value` and save it in state so the screen can react instantly.",
    analogy: { icon: "🔍", text: "A recipe search box that filters as you type. Each letter you press updates the list right away, without pressing Search." },
    visual: { type: "cycle", title: "The typing loop", steps: [
      { label: "Keystroke", detail: "User types “p” in the search box." },
      { label: "onChange", detail: "React calls your handler with the event." },
      { label: "Read value", detail: "`e.target.value` is the whole text so far: \"p\"." },
      { label: "Set state", detail: "`setQuery(e.target.value)` stores it." },
      { label: "Re-render", detail: "The input shows \"p\" and the list filters to matches." }
    ]},
    points: [
      "React's `onChange` = the native `input` event: it fires per keystroke, paste or delete.",
      "`e.target.value` is always a **string**, the full current text (not just the new letter).",
      "Pair `value={query}` with `onChange` to make the input **controlled** (state is the source of truth).",
      "Checkboxes use `e.target.checked`, not `value`.",
      "Derive filtered lists during render; don't store them in a second state."
    ],
    code: { file: "RecipeSearch.jsx", lang: "jsx", src: `import { useState } from 'react';

const recipes = ['Pancakes', 'Pasta', 'Pizza', 'Salad', 'Soup'];

export default function RecipeSearch() {
  const [query, setQuery] = useState('');

  const matches = recipes.filter(r =>
    r.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search recipes"
      />
      <p>{matches.length} found</p>
      <ul>
        {matches.map(r => <li key={r}>{r}</li>)}
      </ul>
    </div>
  );
}`, walk: [
      { lines: [6], note: "State holds the text. Start with `''`, never `undefined`." },
      { lines: [8, 9, 10], note: "Filter during render from `query`. No extra state needed." },
      { lines: [15, 16], note: "`value` + `onChange` = controlled input. Each keystroke updates state." }
    ]},
    output: "Typing “p” shows 4 found (Pancakes, Pasta, Pizza, Soup). Typing “pa” narrows to Pancakes and Pasta. Clearing shows all 5.",
    mistakes: [
      { bad: `<input value={query} />`, good: `<input value={query} onChange={e => setQuery(e.target.value)} />`, why: "A `value` without `onChange` is read-only: typing does nothing and React warns." },
      { bad: `const [query, setQuery] = useState();\n<input value={query} onChange={...} />`, good: `const [query, setQuery] = useState('');`, why: "`undefined` makes the input uncontrolled at first, then controlled: React warns about switching." }
    ],
    practice: [
      { level: "B", q: "Show “You typed: …” under a name input.", a: "Store `e.target.value` in state and render `{name}`." },
      { level: "B", q: "Show a live character count for a chat message box.", a: "`{message.length} / 200` under the input." },
      { level: "I", q: "Force the input to uppercase as the user types.", a: "`onChange={e => setCode(e.target.value.toUpperCase())}`" },
      { level: "C", q: "Limit a post box to 140 characters without cutting pasted text silently.", a: "Don't use `maxLength` (it trims pastes silently). Keep the full text, show `140 - text.length` in red when negative, and disable Send while over." }
    ],
    quiz: [
      { q: "When does React's `onChange` fire on a text input?", options: ["On blur", "On every change to the text", "On Enter"], answer: 1, why: "React maps it to the native `input` event." },
      { q: "User has typed “Pas”. What is `e.target.value` on the next key “t”?", options: ["\"t\"", "\"Past\"", "\"Pas\""], answer: 1, why: "`value` is the whole current text, not the key pressed." },
      { q: "`<input value={text} />` with no `onChange`. What happens when you type?", options: ["Text updates normally", "Nothing changes, React warns", "The page reloads"], answer: 1, why: "React keeps the DOM matching `value`, so input is locked." }
    ],
    rev: {
      sec30: "`onChange` fires on every keystroke (native `input` event). Read `e.target.value` (a string) or `e.target.checked` for checkboxes, store it in state, and bind `value={state}` to make the input controlled. Compute filtered results during render.",
      interview: [
        { level: "basic", q: "How do you read what a user typed?", a: "In `onChange`, read `e.target.value` and save it with a state setter." },
        { level: "intermediate", q: "Why does React's `onChange` behave differently from HTML `onchange`?", a: "React fires it on every edit (like `input`) so state always mirrors the field. HTML `change` fires only when the field commits." },
        { level: "intermediate", q: "Typing feels slow in a big list filter. What can help?", a: "Keep the input state urgent and defer the expensive list with `useDeferredValue`, or debounce the work." },
        { level: "tricky", q: "Why do you get \"A component is changing an uncontrolled input to be controlled\"?", a: "`value` started as `undefined`/`null` and later became a string. Initialise with `''`." }
      ],
      debug: [
        { code: `const [name, setName] = useState('');\n<input value={name} onChange={setName} />`, fix: `<input value={name} onChange={e => setName(e.target.value)} />`, why: "Passing `setName` stores the whole event object, not the text." }
      ],
      cheat: [
        "`onChange` fires on every keystroke",
        "Text: `e.target.value` (always a string)",
        "Checkbox: `e.target.checked`",
        "`value` + `onChange` = controlled input",
        "Initialise text state with `''`, not `undefined`",
        "Derive filtered lists in render, don't store them"
      ]
    },
    related: ["EVT-010", "STATE-023", "EVT-012", "HOOKS-015"]
  },

  "EVT-005": {
    tldr: "Put `onSubmit` on the `<form>`, not `onClick` on the button. It fires for the button click **and** the Enter key. Call `e.preventDefault()` first so the browser doesn't reload the page.",
    analogy: { icon: "📝", text: "A shop's order slip. Whether you hand it over at the till or drop it in the box, it all goes to one order desk." },
    visual: { type: "flow", title: "What happens on submit", steps: [
      { label: "Enter or click", detail: "User presses Enter in a field or clicks the submit button." },
      { label: "submit event", detail: "The browser fires `submit` on the `<form>`." },
      { label: "onSubmit runs", detail: "Your handler receives the event." },
      { label: "preventDefault()", detail: "Stops the default full-page reload/navigation." },
      { label: "Your logic", detail: "Validate, add the todo, clear the field, call an API." }
    ]},
    points: [
      "**One place** for submit logic: `<form onSubmit={handleSubmit}>`.",
      "Enter in a text field submits the form for free; `onClick` on the button misses that path.",
      "Call `e.preventDefault()` or the browser reloads the page (classic HTML behavior).",
      "Any `<button>` inside a form submits by default; use `type=\"button\"` for others.",
      "React 19 also supports `<form action={fn}>` (no `preventDefault` needed). See useActionState and Form submission."
    ],
    code: { file: "AddTodo.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function AddTodo() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, { id: crypto.randomUUID(), text }]);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button>Add</button>
      <ul>
        {todos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
    </form>
  );
}`, walk: [
      { lines: [8], note: "First line: stop the page reload." },
      { lines: [9], note: "Simple guard: ignore empty todos." },
      { lines: [10, 11], note: "Add the todo immutably, then clear the input." },
      { lines: [15], note: "The handler lives on the form, so button click and Enter both work." },
      { lines: [17], note: "No `type` means `submit` inside a form." }
    ]},
    output: "Type “Buy milk”, press Enter: it appears in the list and the box clears. No page reload.",
    mistakes: [
      { bad: `<form>\n  <input ... />\n  <button onClick={save}>Save</button>\n</form>`, good: `<form onSubmit={save}>\n  <input ... />\n  <button>Save</button>\n</form>`, why: "`onClick` doesn't cover Enter, and without `preventDefault` the form still submits natively and reloads." },
      { bad: `function handleSubmit(e) {\n  setTodos([...todos, text]);\n}`, good: `function handleSubmit(e) {\n  e.preventDefault();\n  setTodos([...todos, text]);\n}`, why: "Without `preventDefault()` the page reloads and your new state is lost instantly." }
    ],
    practice: [
      { level: "B", q: "Make a newsletter form that alerts the email on submit.", a: "`onSubmit={e => { e.preventDefault(); alert(email); }}`" },
      { level: "B", q: "Add a **Clear** button to the todo form that doesn't submit.", a: "`<button type=\"button\" onClick={() => setText('')}>Clear</button>`" },
      { level: "I", q: "Disable the Add button while the text is empty.", a: "`<button disabled={!text.trim()}>Add</button>`" },
      { level: "C", q: "Rewrite the form with React 19 `<form action>` instead of `onSubmit`.", a: "Pass a function to `action`; it gets `FormData`. React resets the uncontrolled fields after it runs.", code: `function addTodo(formData) {\n  const text = formData.get('text');\n  setTodos(t => [...t, { id: crypto.randomUUID(), text }]);\n}\n\n<form action={addTodo}>\n  <input name="text" />\n  <button>Add</button>\n</form>` }
    ],
    quiz: [
      { q: "Where should submit logic live?", options: ["`onClick` on the submit button", "`onSubmit` on the form", "`onChange` on each input"], answer: 1, why: "`onSubmit` covers clicks and Enter in one place." },
      { q: "You forget `e.preventDefault()` in `onSubmit`. What happens?", options: ["Nothing different", "The page reloads", "React throws an error"], answer: 1, why: "The browser runs its default form submit, navigating/reloading." },
      { q: "Which button does NOT submit its form?", options: ["`<button>`", "`<button type=\"submit\">`", "`<button type=\"button\">`"], answer: 2, why: "Only `type=\"button\"` opts out of submitting." }
    ],
    rev: {
      sec30: "Handle forms with `onSubmit` on the `<form>`: it fires for submit-button clicks and Enter. Call `e.preventDefault()` to stop the reload, then validate and update state. Buttons default to `type=\"submit\"`. React 19 adds `<form action={fn}>` as an alternative.",
      interview: [
        { level: "basic", q: "Why use `onSubmit` instead of `onClick` on the button?", a: "It catches every way to submit (click, Enter) and keeps the logic in one place." },
        { level: "basic", q: "Why call `e.preventDefault()` in `onSubmit`?", a: "To stop the browser's default submit, which reloads or navigates the page." },
        { level: "intermediate", q: "How does React 19's `<form action={fn}>` differ?", a: "React calls `fn(formData)` for you, prevents the reload, tracks pending state (`useFormStatus`) and resets uncontrolled fields after success." },
        { level: "tricky", q: "A form has two buttons and both submit. Why?", a: "Buttons default to `type=\"submit\"` inside a form. Set `type=\"button\"` on the non-submit one." }
      ],
      debug: [
        { code: `<form onSubmit={handleSubmit()}>`, fix: `<form onSubmit={handleSubmit}>`, why: "The `()` ran the handler during render with no event." }
      ],
      cheat: [
        "`<form onSubmit={handleSubmit}>`",
        "First line: `e.preventDefault()`",
        "Enter in a field submits the form",
        "`<button>` in a form = `type=\"submit\"`",
        "`type=\"button\"` for non-submit buttons",
        "React 19: `<form action={fn}>` gets `FormData`"
      ]
    },
    related: ["EVT-009", "EVT-020", "HOOKS-018", "EVT-010"]
  },

  "EVT-006": {
    tldr: "`onMouseEnter` fires when the pointer moves onto an element, `onMouseLeave` when it moves off. They **don't bubble**, so moving over child elements doesn't re-fire them, unlike `onMouseOver`.",
    analogy: { icon: "🛍️", text: "A shop window that lights up when you walk up to it and dims when you walk away. Looking at different items inside doesn't switch it off and on again." },
    visual: { type: "compare", title: "onMouseEnter vs onMouseOver", left: { label: "onMouseEnter / Leave", tone: "good", points: [
      "Fires once when entering the element",
      "Moving onto children: no new event",
      "Doesn't bubble to parents",
      "Best for hover cards and tooltips"
    ]}, right: { label: "onMouseOver / Out", tone: "neutral", points: [
      "Fires again for every child you cross",
      "Bubbles up to parents",
      "Leaving the card for a child fires `out`",
      "Easy to cause flicker"
    ]}},
    points: [
      "Pair them: `onMouseEnter={() => setHover(true)}` and `onMouseLeave={() => setHover(false)}`.",
      "They don't bubble: React fires leave on the element you left and enter on the one you entered.",
      "Pure styling? Use CSS `:hover`, no state needed.",
      "Touch screens have no hover. Don't hide important actions behind it.",
      "For keyboard users, mirror it with `onFocus` / `onBlur`."
    ],
    code: { file: "ProductCard.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function ProductCard() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="card"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <h3>Blue Sneakers</h3>
      <img src="/sneakers.jpg" alt="Blue sneakers" width="120" />
      {showDetails && <p>Sizes 6-11 · Free returns</p>}
    </div>
  );
}`, walk: [
      { lines: [4], note: "Hover state: is the pointer over the card?" },
      { lines: [9, 10], note: "Enter shows, leave hides. Fires once each, even with children inside." },
      { lines: [14], note: "Conditionally render the extra details." }
    ]},
    output: "Pointing at the card shows “Sizes 6-11 · Free returns”. Moving between the title and image keeps it visible; leaving the card hides it.",
    mistakes: [
      { bad: `<div onMouseOver={() => setHover(true)}\n     onMouseOut={() => setHover(false)}>`, good: `<div onMouseEnter={() => setHover(true)}\n     onMouseLeave={() => setHover(false)}>`, why: "`over`/`out` fire again as the pointer crosses children, causing flicker." },
      { bad: `const [hover, setHover] = useState(false);\n<button style={{ color: hover ? 'red' : 'black' }} ...>`, good: `/* CSS */\nbutton:hover { color: red; }`, why: "If hover only changes style, CSS is simpler and costs no re-renders." }
    ],
    practice: [
      { level: "B", q: "Show a “Play preview” label when hovering a song row.", a: "Hover state + `onMouseEnter`/`onMouseLeave` on the row, render the label when true." },
      { level: "I", q: "Make the same preview appear for keyboard users.", a: "Add `onFocus` / `onBlur` (and make the row focusable, e.g. a button) that set the same state." },
      { level: "I", q: "Track which of 5 recipe cards is hovered with one state.", a: "`const [hoveredId, setHoveredId] = useState(null)`; enter sets the id, leave sets `null`." },
      { level: "C", q: "Delay a tooltip by 300 ms and cancel it if the pointer leaves first.", a: "Store the timer id in a ref; start a `setTimeout` on enter, `clearTimeout` on leave.", code: `const timer = useRef(null);\nonMouseEnter={() => { timer.current = setTimeout(() => setOpen(true), 300); }}\nonMouseLeave={() => { clearTimeout(timer.current); setOpen(false); }}` }
    ],
    quiz: [
      { q: "Pointer moves from the card onto an image inside it. What fires on the card?", options: ["`onMouseLeave`", "Nothing", "`onMouseEnter` again"], answer: 1, why: "Enter/leave don't fire for movement between descendants." },
      { q: "Do `onMouseEnter` events bubble in React?", options: ["Yes", "No"], answer: 1, why: "They fire only on the elements actually entered/left." },
      { q: "Best way to turn a button red on hover?", options: ["CSS `:hover`", "`onMouseEnter` + state", "`onMouseOver` + state"], answer: 0, why: "Pure styling needs no JavaScript." }
    ],
    rev: {
      sec30: "`onMouseEnter`/`onMouseLeave` fire once when the pointer enters/leaves an element and don't bubble, so children don't cause re-fires. `onMouseOver`/`Out` bubble and flicker. Use CSS `:hover` for pure style, add `onFocus`/`onBlur` for keyboard users, and don't rely on hover on touch.",
      interview: [
        { level: "basic", q: "How do you build a hover effect that shows extra content?", a: "Hover state set by `onMouseEnter` and cleared by `onMouseLeave`, then conditional render." },
        { level: "intermediate", q: "Difference between `onMouseEnter` and `onMouseOver`?", a: "Enter doesn't bubble and ignores moves between children. Over bubbles and fires for each child crossed." },
        { level: "intermediate", q: "When should you not use JS for hover?", a: "When it only changes style. CSS `:hover` is simpler and avoids re-renders." },
        { level: "advanced", q: "What accessibility issues does hover-only UI have?", a: "Keyboard and touch users can't trigger it. Mirror with focus events or a click, and keep key actions visible." }
      ],
      compare: { cols: ["", "onMouseEnter/Leave", "onMouseOver/Out"], rows: [
        ["Bubbles", "No", "Yes"],
        ["Re-fires on children", "No", "Yes"],
        ["Typical use", "Hover cards, tooltips", "Delegated hover tracking"]
      ]},
      cheat: [
        "`onMouseEnter` + `onMouseLeave` for hover UI",
        "They don't bubble; children don't re-fire them",
        "`onMouseOver`/`Out` bubble and can flicker",
        "Style-only hover: CSS `:hover`",
        "Mirror with `onFocus`/`onBlur` for keyboards",
        "Touch has no hover: keep key actions visible"
      ]
    },
    related: ["EVT-008", "COND-001", "HOOKS-007", "PROD-016"]
  },

  "EVT-007": {
    tldr: "The event object tells you what happened: `e.target` (what was actually clicked), `e.currentTarget` (the element your handler is on), `e.key` (which key) and `e.preventDefault()` (stop the browser's default action).",
    analogy: { icon: "📦", text: "A delivery note on a parcel: who it was sent to, which door it came through, and a box to tick for \"don't leave at the door\"." },
    visual: { type: "tree", title: "Click on the icon inside a button", root: { label: "<li onClick>", note: "currentTarget for the li handler", children: [
      { label: "<button onClick>", note: "currentTarget for the button handler", children: [
        { label: "<span>🗑️</span>", note: "target: what was actually clicked" },
        { label: "\"Delete\" text" }
      ]}
    ]}},
    points: [
      "`e.target` = the deepest element clicked (maybe a child icon).",
      "`e.currentTarget` = the element whose handler is running. Use it for reliable `dataset` and `value`.",
      "`e.key` = the key name: `\"Enter\"`, `\"Escape\"`, `\"ArrowDown\"`, `\"a\"`. Avoid the old `keyCode`.",
      "`e.preventDefault()` stops the default (submit, link follow, newline). `return false` does **nothing** in React.",
      "Modifier keys: `e.shiftKey`, `e.ctrlKey`, `e.metaKey`, `e.altKey`."
    ],
    code: { file: "ChatBox.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function ChatBox() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // no newline
      if (!draft.trim()) return;
      setMessages([...messages, draft]);
      setDraft('');
    }
  }

  return (
    <div>
      <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
      <textarea
        value={draft}
        onChange={e => setDraft(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter to send, Shift+Enter for new line"
      />
    </div>
  );
}`, walk: [
      { lines: [8], note: "`e.key` names the key; `e.shiftKey` says if Shift is held." },
      { lines: [9], note: "Stop the textarea's default action (adding a newline)." },
      { lines: [11, 12], note: "Send the message and clear the box." },
      { lines: [21], note: "`currentTarget` is always the textarea itself." },
      { lines: [22], note: "`onKeyDown` fires before the character is inserted, so we can cancel it." }
    ]},
    output: "Typing “hi” then Enter adds “hi” to the list and clears the box. Shift+Enter inserts a new line instead.",
    mistakes: [
      { bad: `<button data-id={id} onClick={e => remove(e.target.dataset.id)}>\n  <span>🗑️</span> Delete\n</button>`, good: `<button data-id={id} onClick={e => remove(e.currentTarget.dataset.id)}>\n  <span>🗑️</span> Delete\n</button>`, why: "Clicking the icon makes `target` the `<span>`, which has no `data-id`. `currentTarget` is always the button." },
      { bad: `function handleClick() {\n  return false; // stop link\n}`, good: `function handleClick(e) {\n  e.preventDefault();\n}`, why: "Returning `false` doesn't prevent default in React. Call `e.preventDefault()`." }
    ],
    practice: [
      { level: "B", q: "Close a modal when Escape is pressed inside its input.", a: "`onKeyDown={e => e.key === 'Escape' && setOpen(false)}`" },
      { level: "B", q: "Log whether the user clicked a card or the image inside it.", a: "Compare `e.target === e.currentTarget`: true means the card itself." },
      { level: "I", q: "Move a highlighted item in a dropdown with ArrowUp/ArrowDown.", a: "In `onKeyDown`, check `e.key`, `preventDefault()` to stop scrolling, then update the index state.", code: `if (e.key === 'ArrowDown') {\n  e.preventDefault();\n  setActive(i => Math.min(i + 1, items.length - 1));\n}` },
      { level: "C", q: "A Japanese user presses Enter to confirm a character and the message sends early. Fix it.", a: "Ignore Enter while composing: `if (e.nativeEvent.isComposing) return;`." }
    ],
    quiz: [
      { q: "You click the 🗑️ `<span>` inside a `<button onClick>`. In the button's handler, `e.target` is…", options: ["The button", "The span", "The document"], answer: 1, why: "`target` is where the click started; `currentTarget` is the button." },
      { q: "How do you detect the Enter key?", options: ["`e.keyCode === 13`", "`e.key === 'Enter'`", "`e.code === 'enter'`"], answer: 1, why: "`key` is the modern, readable API; `keyCode` is deprecated." },
      { q: "Does `return false` stop a link from navigating in React?", options: ["Yes", "No"], answer: 1, why: "Only `e.preventDefault()` works in React handlers." }
    ],
    rev: {
      sec30: "Handlers get an event object. `target` is the element where the event started; `currentTarget` is the element the handler is attached to. `key` and modifier flags describe keyboard input. `preventDefault()` cancels the browser default; returning `false` doesn't.",
      interview: [
        { level: "basic", q: "`target` vs `currentTarget`?", a: "`target` is the original element the event happened on; `currentTarget` is the element whose handler is running." },
        { level: "basic", q: "How do you check which key was pressed?", a: "Use `e.key` (e.g. `'Enter'`) in `onKeyDown`. Avoid deprecated `keyCode`." },
        { level: "intermediate", q: "Why use `onKeyDown` instead of `onKeyPress`?", a: "`keypress` is deprecated and doesn't fire for keys like Escape or arrows. `keydown` also lets you cancel the default." },
        { level: "tricky", q: "Why does `e.target.value` sometimes come back `undefined` in a click handler?", a: "The click landed on a child element (an icon or span) that has no `value`. Use `e.currentTarget`." }
      ],
      predict: [
        { code: `<div onClick={e => console.log(e.target.tagName, e.currentTarget.tagName)}>\n  <p>Hello</p>\n</div>\n// user clicks "Hello"`, answer: "P DIV", why: "The click started on the `<p>`; the handler is on the `<div>`." }
      ],
      cheat: [
        "`e.target` = where it started",
        "`e.currentTarget` = where the handler is",
        "`e.key === 'Enter'` (not `keyCode`)",
        "`e.shiftKey` / `ctrlKey` / `metaKey` / `altKey`",
        "`e.preventDefault()` cancels the default",
        "`return false` does nothing in React",
        "Use `onKeyDown`; `onKeyPress` is deprecated"
      ]
    },
    related: ["EVT-008", "EVT-009", "EVT-002", "EVT-013"]
  },

  "EVT-008": {
    tldr: "Events travel **up** from the clicked element through its parents (bubbling). If a button sits inside a clickable card, both handlers run. Call `e.stopPropagation()` in the inner handler to keep the click to itself.",
    analogy: { icon: "🫧", text: "A bubble rising through a fizzy drink: it passes every layer on its way to the top. `stopPropagation` pops it before it reaches the next layer." },
    visual: { type: "flow", title: "Click on ♡ inside a product card", steps: [
      { label: "Capture (down)", detail: "`onClickCapture` handlers run first, from the root down to the target." },
      { label: "Target: ♡ button", detail: "The button's `onClick` runs: add to wishlist." },
      { label: "stopPropagation()", detail: "Called here, the bubble stops. Without it, it keeps rising." },
      { label: "Bubble: card", detail: "Card's `onClick` would run next: open the product page." },
      { label: "Bubble: page", detail: "Then any ancestors, up to the root." }
    ]},
    points: [
      "All React events bubble **except `onScroll`** (since React 17).",
      "`e.stopPropagation()` stops parents' handlers. It doesn't stop the browser default.",
      "Capture phase: add `Capture` to the name, e.g. `onClickCapture`, to run on the way **down**.",
      "Prefer passing a handler or checking `e.target` over sprinkling `stopPropagation` everywhere.",
      "In portals, events bubble through the **React** tree, not the DOM tree."
    ],
    code: { file: "ProductCard.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function ProductCard() {
  const [log, setLog] = useState([]);
  const add = msg => setLog(l => [...l, msg]);

  return (
    <div>
      <div className="card" onClick={() => add('Open product page')}>
        <h3>Wireless Headphones</h3>
        <button
          onClick={e => {
            e.stopPropagation();
            add('Added to wishlist');
          }}
        >
          ♡ Save
        </button>
      </div>
      <ol>{log.map((m, i) => <li key={i}>{m}</li>)}</ol>
    </div>
  );
}`, walk: [
      { lines: [9], note: "Clicking anywhere on the card opens the product." },
      { lines: [13], note: "Stop the click here so the card's handler doesn't also run." },
      { lines: [14], note: "Only the wishlist action happens." },
      { lines: [5], note: "Functional update so several logs in a row don't overwrite each other." }
    ]},
    output: "Clicking the card logs “Open product page”. Clicking ♡ Save logs only “Added to wishlist”. Remove line 13 and it logs both.",
    mistakes: [
      { bad: `<a href="/cart" onClick={e => e.stopPropagation()}>Cart</a>\n// expecting no navigation`, good: `<a href="/cart" onClick={e => e.preventDefault()}>Cart</a>`, why: "`stopPropagation` stops parent handlers; `preventDefault` stops the browser's navigation. They're different jobs." },
      { bad: `<div onScroll={handleScroll}>\n  <div className="inner-scroll">...</div>\n</div>`, good: `<div className="inner-scroll" onScroll={handleScroll}>...</div>`, why: "`onScroll` doesn't bubble in React 17+. Attach it to the element that actually scrolls." }
    ],
    practice: [
      { level: "B", q: "A todo row toggles done on click. Its Delete button also toggles it. Fix it.", a: "Call `e.stopPropagation()` in the Delete button's handler before deleting." },
      { level: "I", q: "Close a modal when clicking the dark backdrop, but not when clicking inside the dialog.", a: "On the backdrop: `onClick={e => e.target === e.currentTarget && close()}`. No `stopPropagation` needed.", code: `<div className="backdrop" onClick={e => {\n  if (e.target === e.currentTarget) close();\n}}>\n  <div className="dialog">...</div>\n</div>` },
      { level: "I", q: "Log every click inside a chat panel before any child handler runs.", a: "Use `onClickCapture` on the panel." },
      { level: "C", q: "In which order do these run when clicking the button? `div onClickCapture`, `div onClick`, `button onClick`.", a: "div capture → button → div bubble." }
    ],
    quiz: [
      { q: "A button inside a clickable card is clicked, no `stopPropagation`. Which handlers run?", options: ["Only the button's", "Button's, then card's", "Card's, then button's"], answer: 1, why: "Events bubble from the target up through ancestors." },
      { q: "Which React event does NOT bubble?", options: ["onClick", "onScroll", "onKeyDown"], answer: 1, why: "React 17 stopped `onScroll` from bubbling to match the browser." },
      { q: "`e.stopPropagation()` on a link click…", options: ["Stops navigation", "Stops parent handlers only", "Stops both"], answer: 1, why: "Use `preventDefault()` to stop navigation." }
    ],
    rev: {
      sec30: "React events bubble from the target up the component tree (except `onScroll`), and run capture handlers (`onClickCapture`) first on the way down. `e.stopPropagation()` stops parents' handlers but not the default action. Portal events bubble through the React tree.",
      interview: [
        { level: "basic", q: "What is event bubbling?", a: "After the target's handler runs, the event moves up to each ancestor and runs their handlers too." },
        { level: "basic", q: "How do you stop a parent's `onClick` from running?", a: "Call `e.stopPropagation()` in the child's handler." },
        { level: "intermediate", q: "`stopPropagation` vs `preventDefault`?", a: "`stopPropagation` stops the event reaching other handlers; `preventDefault` stops the browser's built-in action. Often you need only one." },
        { level: "advanced", q: "How do events behave with portals?", a: "They bubble according to the React tree, so a modal rendered into `document.body` still reaches its React parent's handlers." },
        { level: "tricky", q: "Why can heavy use of `stopPropagation` be harmful?", a: "It hides events from analytics, outside-click detection and other listeners. Prefer checking `e.target` where possible." }
      ],
      predict: [
        { code: `<div onClick={() => console.log('div')}\n     onClickCapture={() => console.log('capture')}>\n  <button onClick={() => console.log('btn')}>Go</button>\n</div>`, answer: "capture, btn, div", why: "Capture runs down first, then target, then bubbling up." }
      ],
      cheat: [
        "Events bubble target → ancestors",
        "`onScroll` doesn't bubble (React 17+)",
        "`e.stopPropagation()` stops ancestors' handlers",
        "It doesn't stop the default action",
        "Capture phase: `onClickCapture`",
        "Backdrop click: `e.target === e.currentTarget`",
        "Portals bubble through the React tree"
      ]
    },
    related: ["WEB-035", "EVT-007", "EVT-009", "ADV-005"]
  },

  "EVT-009": {
    tldr: "Some elements have built-in browser behavior (default action): a form submit reloads the page, a link navigates away. `e.preventDefault()` cancels it so your React code decides what happens.",
    analogy: { icon: "✋", text: "A shop assistant stopping the automatic door so you can finish your call first. The door still works; you just paused its usual action." },
    visual: { type: "compare", title: "Default vs prevented", left: { label: "Without preventDefault", tone: "bad", points: [
      "Form submit: full page reload",
      "All React state is lost",
      "Link click: browser leaves the page",
      "Enter in a textarea adds a newline"
    ]}, right: { label: "With e.preventDefault()", tone: "good", points: [
      "Form stays; your handler runs",
      "State is kept, UI updates instantly",
      "Link stays put until you decide",
      "You control what Enter does"
    ]}},
    points: [
      "Call it on the **event**: `e.preventDefault()`. Returning `false` does nothing in React.",
      "Forms: always in `onSubmit` (unless using React 19 `<form action={fn}>`, which does it for you).",
      "Links inside your app: use React Router's `<Link>`; it prevents the reload for you.",
      "Prevent conditionally, e.g. only when there are unsaved notes.",
      "`preventDefault` doesn't stop bubbling; that's `stopPropagation`."
    ],
    code: { file: "NotesEditor.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function NotesEditor() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState('');

  function handleSubmit(e) {
    e.preventDefault();            // no page reload
    setSaved(note);
  }

  function handleLeave(e) {
    const unsaved = note !== saved;
    if (unsaved && !confirm('Discard unsaved changes?')) {
      e.preventDefault();          // stay on the page
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={note} onChange={e => setNote(e.target.value)} />
      <button>Save</button>
      <a href="https://example.com/help" onClick={handleLeave}>Help</a>
    </form>
  );
}`, walk: [
      { lines: [8], note: "Stop the browser's form submit so the page and state survive." },
      { lines: [13, 14, 15], note: "Only block the link if there are unsaved changes and the user cancels." },
      { lines: [23], note: "Normal links navigate by default; our handler can stop that." }
    ]},
    output: "Save keeps you on the page. Typing then clicking Help asks “Discard unsaved changes?”; Cancel keeps you here.",
    mistakes: [
      { bad: `<form onSubmit={() => { save(); return false; }}>`, good: `<form onSubmit={e => { e.preventDefault(); save(); }}>`, why: "`return false` is an old inline-HTML trick. React ignores it." },
      { bad: `<a href="/cart" onClick={e => { e.preventDefault(); navigate('/cart'); }}>Cart</a>`, good: `import { Link } from 'react-router';\n<Link to="/cart">Cart</Link>`, why: "`<Link>` already handles preventDefault, Ctrl+click for new tab and accessibility." }
    ],
    practice: [
      { level: "B", q: "A login form reloads the page on submit. Fix it.", a: "Add `e.preventDefault()` as the first line of `onSubmit`." },
      { level: "B", q: "Stop the browser's right-click menu on a photo gallery image.", a: "`onContextMenu={e => e.preventDefault()}`" },
      { level: "I", q: "Block typing digits into a name field.", a: "In `onKeyDown`, `if (/\\d/.test(e.key)) e.preventDefault();`. Still validate on submit (paste bypasses it)." },
      { level: "C", q: "Why might `e.preventDefault()` in `onWheel` not stop scrolling?", a: "React registers `wheel` and `touchstart/move` as passive listeners, so they can't be cancelled. Use a native listener with `{ passive: false }` in an effect." }
    ],
    quiz: [
      { q: "What does `e.preventDefault()` in `onSubmit` stop?", options: ["Your handler running", "The page reload", "Parent handlers"], answer: 1, why: "It cancels the browser's default submit action." },
      { q: "Best way to link between pages in a React Router 7 app?", options: ["`<a href>` with preventDefault", "`<Link to>` from `react-router`", "`window.location = ...`"], answer: 1, why: "`<Link>` does client-side navigation without a reload." },
      { q: "Does `e.preventDefault()` stop the click from bubbling to parents?", options: ["Yes", "No"], answer: 1, why: "Bubbling is controlled by `stopPropagation()`." }
    ],
    rev: {
      sec30: "`e.preventDefault()` cancels the browser's built-in action: form reloads, link navigation, newlines, context menus. Call it explicitly; `return false` doesn't work. Use React Router's `<Link>` for in-app links, and remember it doesn't stop bubbling.",
      interview: [
        { level: "basic", q: "Why does a React form reload the page?", a: "The browser's default submit action runs. Call `e.preventDefault()` in `onSubmit`." },
        { level: "intermediate", q: "Why not `<a href>` + `preventDefault` + `navigate()` for internal links?", a: "`<Link>` does that already, plus handles modifier-click/new tab and correct semantics." },
        { level: "advanced", q: "Why can't you prevent scrolling in React's `onWheel`?", a: "React attaches `wheel`/`touch` listeners as passive for performance. Use `addEventListener(..., { passive: false })` in `useEffect`." },
        { level: "tricky", q: "Does `return false` work in React handlers?", a: "No. It only worked for inline HTML/jQuery handlers. Use `e.preventDefault()`." }
      ],
      debug: [
        { code: `function handleSubmit() {\n  e.preventDefault();\n  save();\n}`, fix: `function handleSubmit(e) {\n  e.preventDefault();\n  save();\n}`, why: "The handler didn't take the event parameter, so `e` is undefined." }
      ],
      cheat: [
        "`e.preventDefault()` cancels the browser default",
        "Forms: call it first in `onSubmit`",
        "`return false` doesn't work in React",
        "In-app links: `<Link to>` from `react-router`",
        "Doesn't stop bubbling (`stopPropagation` does)",
        "React's `onWheel`/touch listeners are passive"
      ]
    },
    related: ["EVT-005", "EVT-008", "ROUTE-007", "EVT-007"]
  },

  "EVT-010": {
    tldr: "In a controlled form, **state holds every field's value**. Each input shows `value={state}` and updates it with `onChange`. React state is the single source of truth, so you can validate, reset or prefill at any time.",
    analogy: { icon: "🧾", text: "A cashier typing your order into the till. The screen always shows exactly what's in the till; to change the order, you change the till, not the screen." },
    visual: { type: "cycle", title: "State drives the form", steps: [
      { label: "State", detail: "`name = \"Ana\"`, `email = \"\"` live in React." },
      { label: "Render inputs", detail: "Each input shows `value={name}`, `value={email}`." },
      { label: "User types", detail: "`onChange` fires with the new text." },
      { label: "Update state", detail: "`setEmail(e.target.value)` stores it." },
      { label: "Re-render", detail: "Inputs, live preview and the Submit button all reflect the new state." }
    ]},
    points: [
      "Each field needs `value` **and** `onChange`. One without the other is a bug.",
      "State is always current: show live previews, disable Submit, validate as you type.",
      "Reset or prefill by **setting state**: `setName('')`.",
      "Initialise strings with `''` so inputs are controlled from the first render.",
      "Many fields? One object + one handler (see Multiple input handling)."
    ],
    code: { file: "SignupForm.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const canSubmit = name.trim() && email.includes('@');

  function handleSubmit(e) {
    e.preventDefault();
    alert(\`Welcome, \${name}! We'll email \${email}.\`);
    setName('');
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <p>Preview: {name || '…'} &lt;{email || '…'}&gt;</p>
      <button disabled={!canSubmit}>Join newsletter</button>
    </form>
  );
}`, walk: [
      { lines: [4, 5], note: "One piece of state per field, starting as empty strings." },
      { lines: [6], note: "Derived during render: no extra state for \"is valid\"." },
      { lines: [11, 12], note: "Reset the form simply by setting state." },
      { lines: [17, 18], note: "`value` + `onChange` on every input = controlled." },
      { lines: [19, 20], note: "Anything can read the live values: preview text, button state." }
    ]},
    output: "Typing shows a live preview like “Ana <ana@mail.com>”. The button enables once both fields look valid. Submitting greets you and clears both fields.",
    mistakes: [
      { bad: `<input value={email} />`, good: `<input value={email} onChange={e => setEmail(e.target.value)} />`, why: "`value` without `onChange` freezes the field. React warns that it's read-only." },
      { bad: `const [user, setUser] = useState(null);\n<input value={user?.name} ... />`, good: `const [user, setUser] = useState({ name: '' });\n<input value={user.name} ... />`, why: "`undefined` → string makes the input switch from uncontrolled to controlled, which React warns about." }
    ],
    practice: [
      { level: "B", q: "Add a **Clear** button that empties both fields.", a: "`<button type=\"button\" onClick={() => { setName(''); setEmail(''); }}>Clear</button>`" },
      { level: "I", q: "Prefill the form when editing an existing contact passed as a prop.", a: "Initialise state from props: `useState(contact.name)`. Add `key={contact.id}` on the form so switching contacts resets it." },
      { level: "I", q: "Trim spaces from the name as the user types, but not inside it.", a: "Use `e.target.value.trimStart()` in the handler so leading spaces never land." },
      { level: "C", q: "Show “3 characters left” for a 20-char username, and block typing past 20.", a: "Render `20 - name.length` left; in `onChange` only call the setter when `value.length <= 20` (or use `maxLength`)." }
    ],
    quiz: [
      { q: "In a controlled form, where is the source of truth?", options: ["The DOM input", "React state", "The submit event"], answer: 1, why: "The input just displays state." },
      { q: "How do you reset a controlled form after submit?", options: ["`form.reset()`", "Set each state back to `''`", "Reload the page"], answer: 1, why: "`form.reset()` only changes the DOM; state keeps the old values, so screen and state disagree." },
      { q: "`useState()` (no initial value) for an input's `value` causes…", options: ["Nothing", "An uncontrolled → controlled warning", "A syntax error"], answer: 1, why: "`undefined` means uncontrolled; later strings make it controlled." }
    ],
    rev: {
      sec30: "Controlled forms keep every field in state: `value={state}` plus `onChange` to update. State is the single source of truth, so validation, live previews, disabling Submit, prefill and reset are trivial. Initialise with `''`. Cost: a re-render per keystroke, usually negligible.",
      interview: [
        { level: "basic", q: "What makes a form input controlled?", a: "Its `value` (or `checked`) comes from React state and every change goes through `onChange` to a setter." },
        { level: "intermediate", q: "Pros and cons of controlled forms?", a: "Pros: instant validation, formatting, conditional UI, easy reset. Cons: more code and a re-render per keystroke for big forms." },
        { level: "intermediate", q: "Why does `form.reset()` not clear a controlled form?", a: "It resets the DOM only. State still holds the old values, so the screen and state drift apart. Reset the state instead." },
        { level: "advanced", q: "A huge controlled form feels laggy. Options?", a: "Split it into smaller components so only the edited field re-renders, use uncontrolled inputs/FormData, or a library like React Hook Form." }
      ],
      scenario: [
        { q: "The Edit Profile form shows the old user's data after switching to another user.", a: "State was initialised once from props. Add `key={user.id}` to remount the form for each user." }
      ],
      cheat: [
        "Controlled = `value={state}` + `onChange`",
        "State is the single source of truth",
        "Initialise text fields with `''`",
        "Reset/prefill by setting state",
        "Derive \"is valid\" during render",
        "`key={id}` to reset a form for a new record"
      ]
    },
    related: ["STATE-023", "EVT-011", "EVT-019", "COMM-010"]
  },

  "EVT-011": {
    tldr: "In an uncontrolled form, **the browser keeps the values** (the DOM). You give a starting value with `defaultValue` and read the values only when needed: with a ref, or all at once with `new FormData(form)`.",
    analogy: { icon: "📮", text: "A paper feedback card in a café. Nobody watches you write; they just read the card when you drop it in the box." },
    visual: { type: "compare", title: "Controlled vs uncontrolled", left: { label: "Controlled", tone: "neutral", points: [
      "Value lives in React state",
      "`value` + `onChange`",
      "Re-renders every keystroke",
      "Best for live validation/preview"
    ]}, right: { label: "Uncontrolled", tone: "good", points: [
      "Value lives in the DOM",
      "`defaultValue` + `name` (or a ref)",
      "No re-render while typing",
      "Read on submit with `FormData`"
    ]}},
    points: [
      "Use `defaultValue` (or `defaultChecked`), not `value`, for a starting value.",
      "Give every field a `name`; `FormData` uses it as the key.",
      "`Object.fromEntries(new FormData(e.currentTarget))` turns the form into a plain object.",
      "One field? A ref works: `inputRef.current.value`.",
      "`<input type=\"file\">` is **always** uncontrolled. React 19 `<form action>` passes `FormData` directly."
    ],
    code: { file: "FeedbackForm.jsx", lang: "jsx", src: `import { useRef, useState } from 'react';

export default function FeedbackForm() {
  const [result, setResult] = useState(null);
  const nameRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setResult(data);
    form.reset();
    nameRef.current.focus();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" ref={nameRef} placeholder="Your name" />
      <select name="rating" defaultValue="5">
        <option value="5">Loved it</option>
        <option value="3">It was OK</option>
        <option value="1">Not great</option>
      </select>
      <button>Send</button>
      {result && <p>Thanks {result.name}! Rating: {result.rating}</p>}
    </form>
  );
}`, walk: [
      { lines: [9], note: "`currentTarget` is the `<form>` (even if Enter was pressed in an input)." },
      { lines: [10], note: "Collect every named field at once: `{ name, rating }`, all strings." },
      { lines: [12], note: "`reset()` works here: the DOM owns the values." },
      { lines: [13], note: "A ref gives direct access to one DOM node, e.g. to focus it." },
      { lines: [19], note: "`defaultValue` sets the start value; the user changes it freely." }
    ]},
    output: "Fill in “Sam”, pick “It was OK”, click Send: “Thanks Sam! Rating: 3”. The form clears and the name box is focused.",
    mistakes: [
      { bad: `<input name="city" value="Paris" />`, good: `<input name="city" defaultValue="Paris" />`, why: "`value` without `onChange` locks the field. Uncontrolled fields use `defaultValue`." },
      { bad: `<input placeholder="Email" />\n// new FormData(form).get('email') → null`, good: `<input name="email" placeholder="Email" />`, why: "`FormData` only includes fields with a `name`." }
    ],
    practice: [
      { level: "B", q: "Read a single search box's value on button click using a ref.", a: "`const ref = useRef(null)`, `<input ref={ref} />`, then `ref.current.value` in the handler." },
      { level: "I", q: "A form has `<input type=\"checkbox\" name=\"terms\">`. What does `FormData` give when unchecked?", a: "Nothing: unchecked checkboxes are left out, so `get('terms')` is `null`. Checked gives `\"on\"` (or its `value`)." },
      { level: "I", q: "Read a multi-select or checkbox group with several values.", a: "Use `formData.getAll('toppings')`; `Object.fromEntries` would keep only the last one." },
      { level: "C", q: "Rewrite the form with React 19 `<form action>`.", a: "React calls the function with `FormData` and resets the form after it finishes.", code: `function send(formData) {\n  setResult({ name: formData.get('name'), rating: formData.get('rating') });\n}\n\n<form action={send}>...</form>` }
    ],
    quiz: [
      { q: "Where does an uncontrolled input keep its value?", options: ["React state", "The DOM", "localStorage"], answer: 1, why: "React only sets the initial value; the browser tracks changes." },
      { q: "Which prop sets an uncontrolled input's starting text?", options: ["`value`", "`defaultValue`", "`initialValue`"], answer: 1, why: "`value` would make it controlled (and read-only without `onChange`)." },
      { q: "`new FormData(form)` skips an input. Most likely why?", options: ["It has no `name`", "It has no `id`", "It has a placeholder"], answer: 0, why: "Fields are keyed by `name`." }
    ],
    rev: {
      sec30: "Uncontrolled inputs let the DOM own their values. Set a start with `defaultValue`/`defaultChecked`, then read on demand via a ref or `new FormData(form)` (fields need `name`). Fewer re-renders and less code; React 19 `<form action>` hands you `FormData` and resets the form. File inputs are always uncontrolled.",
      interview: [
        { level: "basic", q: "Controlled vs uncontrolled input?", a: "Controlled: React state owns the value via `value` + `onChange`. Uncontrolled: the DOM owns it; you read it with a ref or `FormData`." },
        { level: "intermediate", q: "When is uncontrolled the better choice?", a: "Simple forms read only on submit, file inputs, big forms where per-keystroke re-renders hurt, or integrating non-React widgets." },
        { level: "intermediate", q: "How do you read all form fields without state?", a: "`Object.fromEntries(new FormData(e.currentTarget))` in `onSubmit`, or the `formData` argument of a React 19 form action." },
        { level: "advanced", q: "What does React 19 do after a `<form action>` function finishes?", a: "It automatically resets uncontrolled fields in the form. Controlled fields keep their state values." },
        { level: "tricky", q: "Why is `<input type=\"file\">` always uncontrolled?", a: "Its value can only be set by the user for security, so React can't control it. Read `ref.current.files` or `FormData`." }
      ],
      compare: { cols: ["", "Controlled", "Uncontrolled"], rows: [
        ["Value lives in", "React state", "DOM"],
        ["Start value", "`useState('x')`", "`defaultValue=\"x\"`"],
        ["Read value", "Any time from state", "Ref or `FormData`"],
        ["Re-render per keystroke", "Yes", "No"]
      ]},
      cheat: [
        "Uncontrolled = DOM owns the value",
        "`defaultValue` / `defaultChecked` for start values",
        "Every field needs a `name` for `FormData`",
        "`Object.fromEntries(new FormData(form))`",
        "`formData.getAll(name)` for multiple values",
        "File inputs are always uncontrolled",
        "React 19 `<form action>` resets the form after"
      ]
    },
    related: ["EVT-010", "HOOKS-007", "COMM-010", "HOOKS-018"]
  },

  "EVT-012": {
    tldr: "Every input gives you a **string**, even `type=\"number\"` and `type=\"date\"`. Keep the string in state, convert when you use it (`Number(...)`), and remember dates arrive as `\"YYYY-MM-DD\"`.",
    analogy: { icon: "🍳", text: "A recipe card where you write servings and the cooking date by hand. It's all ink on paper; you work out the numbers when you actually cook." },
    visual: { type: "timeline", title: "What `e.target.value` gives you", frames: [
      { label: "Text: Pancakes", state: "\"Pancakes\"", note: "Plain string, as typed." },
      { label: "Number: 4", state: "\"4\"", note: "Still a string. `Number(\"4\")` or `e.target.valueAsNumber` gives 4." },
      { label: "Number: (cleared)", state: "\"\"", note: "Empty string. `Number(\"\")` is 0, `valueAsNumber` is NaN." },
      { label: "Date: 5 Nov 2026", state: "\"2026-11-05\"", note: "ISO date string, independent of the user's display format." }
    ]},
    points: [
      "`value` is always a string. `\"2\" + 1` is `\"21\"`: convert first.",
      "Number inputs: store the **string** so the user can clear the box; convert when calculating.",
      "Use `min`, `max`, `step` for hints, but still validate (users can type anything).",
      "Date inputs: `value` is `\"YYYY-MM-DD\"` (or `\"\"`). Set `min`/`max` in the same format.",
      "`new Date(\"2026-11-05\")` is **UTC** midnight and may show the day before. Compare strings or build a local date."
    ],
    code: { file: "MealPlanner.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function MealPlanner() {
  const [dish, setDish] = useState('Pancakes');
  const [servings, setServings] = useState('2');
  const [date, setDate] = useState('');

  const count = Number(servings) || 0;
  const eggs = count * 2;

  return (
    <div>
      <input value={dish} onChange={e => setDish(e.target.value)} />
      <input
        type="number"
        min="1"
        max="12"
        value={servings}
        onChange={e => setServings(e.target.value)}
      />
      <input
        type="date"
        min="2026-01-01"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <p>{dish} for {count}: {eggs} eggs{date && \` on \${date}\`}</p>
    </div>
  );
}`, walk: [
      { lines: [5], note: "Servings stored as a string so the field can be empty while editing." },
      { lines: [8, 9], note: "Convert only when calculating. `|| 0` covers the empty box." },
      { lines: [16, 17], note: "`min`/`max` give arrows and hints; they don't stop typed values." },
      { lines: [23, 24], note: "Date value and `min` both use `YYYY-MM-DD`." },
      { lines: [27], note: "Show the result; the date shows only once picked." }
    ]},
    output: "“Pancakes for 2: 4 eggs”. Change servings to 5 → “10 eggs”. Pick a date → “… on 2026-11-20”.",
    mistakes: [
      { bad: `const [qty, setQty] = useState(1);\nonChange={e => setQty(e.target.value)}\n// later: qty + 1 → "11"`, good: `const [qty, setQty] = useState('1');\nconst n = Number(qty);\n// later: n + 1 → 2`, why: "`e.target.value` is a string; `+` joins strings. Convert with `Number()` before maths." },
      { bad: `onChange={e => setQty(Number(e.target.value))}`, good: `onChange={e => setQty(e.target.value)}\nconst n = Number(qty) || 0;`, why: "Converting on every keystroke turns a cleared box into `0`, so the user can't delete the digit to retype." }
    ],
    practice: [
      { level: "B", q: "A cart quantity input shows “21” when you add 1 to 2. Fix it.", a: "Convert the string first: `Number(qty) + 1`." },
      { level: "B", q: "Stop users picking a delivery date before today.", a: "Set `min={new Date().toLocaleDateString('en-CA')}` (gives `YYYY-MM-DD` in local time)." },
      { level: "I", q: "Show how many days until the chosen date.", a: "Build local dates: `const [y, m, d] = date.split('-').map(Number); new Date(y, m - 1, d)`, subtract today's local midnight, divide by 86 400 000 and `Math.round` (DST)." },
      { level: "C", q: "Why might `new Date('2026-11-05').getDate()` return 4 in New York?", a: "Date-only ISO strings parse as UTC midnight, which is still Nov 4 in UTC-5. Parse into a local date instead." }
    ],
    quiz: [
      { q: "Type of `e.target.value` on `<input type=\"number\">`?", options: ["number", "string", "number or null"], answer: 1, why: "All input values are strings. Use `Number()` or `valueAsNumber`." },
      { q: "Format of a date input's `value`?", options: ["Whatever the user sees, e.g. 05/11/2026", "\"YYYY-MM-DD\"", "A Date object"], answer: 1, why: "The display is localised, but the value is always ISO." },
      { q: "Why keep a number input's state as a string?", options: ["Strings are faster", "So the user can clear the field while editing", "React requires it"], answer: 1, why: "Converting each keystroke forces `0` into an empty box." }
    ],
    rev: {
      sec30: "Input values are strings for every type. For numbers, keep the raw string in state and convert (`Number`, `valueAsNumber`) when you calculate. Date inputs use `\"YYYY-MM-DD\"` for `value`, `min` and `max`; parsing that with `new Date()` gives UTC midnight, so build local dates for display. `min`/`max`/`step` are hints, not validation.",
      interview: [
        { level: "basic", q: "What type is `e.target.value` for a number input?", a: "A string. Convert with `Number()` or read `e.target.valueAsNumber`." },
        { level: "intermediate", q: "Why not store `Number(e.target.value)` in state directly?", a: "An empty box becomes `0` (or `NaN`), so the user can't clear it while typing. Store the string, convert on use." },
        { level: "intermediate", q: "What format does `<input type=\"date\">` use?", a: "`YYYY-MM-DD` for `value`, `min` and `max`, regardless of how it's shown to the user. Empty is `''`." },
        { level: "tricky", q: "Why can a picked date show as the previous day?", a: "`new Date('YYYY-MM-DD')` parses as UTC. In negative time zones that's the day before locally. Use `new Date(y, m - 1, d)`." }
      ],
      predict: [
        { code: `// user types 3 into <input type="number">\nconst v = e.target.value;\nconsole.log(v + 1, Number(v) + 1);`, answer: "31 4 (the first is the string \"31\")", why: "`v` is the string \"3\", so `+` concatenates until converted." }
      ],
      cheat: [
        "All input values are strings",
        "Convert with `Number(v)` or `e.target.valueAsNumber`",
        "Keep number state as a string so it can be cleared",
        "Date value: `\"YYYY-MM-DD\"` or `\"\"`",
        "`new Date('YYYY-MM-DD')` = UTC midnight",
        "`min`/`max`/`step` are hints; still validate"
      ]
    },
    related: ["EVT-004", "EVT-010", "EVT-017", "WEB-013"]
  }
};
