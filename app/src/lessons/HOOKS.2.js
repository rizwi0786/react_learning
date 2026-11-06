export default {
  "HOOKS-016": {
    tldr: "`useSyncExternalStore` lets a component read data that lives **outside React** (a store, the browser) and re-render when it changes, without different parts of the screen showing different values (tearing).",
    analogy: { icon: "📻", text: "A shop's price board listening to head office radio. When head office announces a new price, every board in the shop updates at once, never half old and half new." },
    visual: { type: "flow", title: "How a component stays in sync with a store", steps: [
      { label: "subscribe", detail: "React calls `subscribe(callback)` once; the store remembers the callback." },
      { label: "getSnapshot", detail: "During render React calls `getSnapshot()` to read the current value." },
      { label: "Store changes", detail: "Something outside React updates the store and calls the callback." },
      { label: "Compare", detail: "React calls `getSnapshot()` again; if the value differs (`Object.is`), it re-renders." },
      { label: "Unsubscribe", detail: "On unmount React calls the function `subscribe` returned." }
    ]},
    points: [
      "Signature: `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`.",
      "**External store** = data React doesn't own: a hand-made store, `navigator.onLine`, `matchMedia`, a 3rd-party library.",
      "`getSnapshot` must return the **same value** if nothing changed. A new object each call means an infinite re-render loop.",
      "Define `subscribe` **outside** the component (or memoise it); a new function each render makes React resubscribe.",
      "**Tearing** = during concurrent rendering, two components read different versions of the same store. This hook prevents it.",
      "Usually used inside libraries (Redux, Zustand) or small custom hooks, not directly in app components."
    ],
    code: { file: "useOnline.js", lang: "jsx", src: `import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine; // a boolean: same value until it changes
}

function getServerSnapshot() {
  return true; // assume online when rendering on the server
}

export function useOnline() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function ChatStatus() {
  const online = useOnline();
  return <p>{online ? '✅ Online: messages send now' : '⏸️ Offline: messages queued'}</p>;
}`, walk: [
      { lines: [3, 4, 5], note: "`subscribe` gets a callback from React and calls it whenever the browser fires `online`/`offline`." },
      { lines: [6, 7, 8, 9], note: "Return a cleanup function so React can unsubscribe on unmount." },
      { lines: [12, 13], note: "`getSnapshot` reads the current value. A boolean is a stable primitive, so no loop." },
      { lines: [16, 17], note: "Optional server value, used for SSR and hydration." },
      { lines: [21], note: "All three functions live outside the component, so their identity never changes." }
    ]},
    output: "“✅ Online: messages send now”. Turn off Wi-Fi and it flips to “⏸️ Offline: messages queued” instantly.",
    mistakes: [
      { bad: `function getSnapshot() {\n  return { items: store.items }; // new object every call\n}`, good: `function getSnapshot() {\n  return store.items; // same reference until it changes\n}`, why: "React compares snapshots with `Object.is`. A fresh object is always ‘different’, so React re-renders forever (and warns about it)." },
      { bad: `function Cart() {\n  const items = useSyncExternalStore(\n    (cb) => store.subscribe(cb), store.get);\n}`, good: `const subscribe = (cb) => store.subscribe(cb);\nfunction Cart() {\n  const items = useSyncExternalStore(subscribe, store.get);\n}`, why: "An inline `subscribe` is a new function every render, so React unsubscribes and resubscribes on each render." }
    ],
    practice: [
      { level: "B", q: "Which three arguments does the hook take, and which is optional?", a: "`subscribe`, `getSnapshot`, and the optional `getServerSnapshot` for SSR." },
      { level: "I", q: "Write a tiny cart store with `getItems`, `addItem` and `subscribe`, and read it with the hook.", a: "Keep a listeners `Set`; `addItem` replaces the array immutably and calls every listener.", code: `let items = [];\nconst listeners = new Set();\nexport const cartStore = {\n  getItems: () => items,\n  addItem(item) {\n    items = [...items, item];\n    listeners.forEach((l) => l());\n  },\n  subscribe(l) {\n    listeners.add(l);\n    return () => listeners.delete(l);\n  },\n};\n// in a component:\nconst cart = useSyncExternalStore(cartStore.subscribe, cartStore.getItems);` },
      { level: "I", q: "Build `useIsDarkMode()` using `matchMedia('(prefers-color-scheme: dark)')`.", a: "Subscribe with `mql.addEventListener('change', cb)`, snapshot `mql.matches`." },
      { level: "C", q: "Why does `addItem` replace the array instead of calling `items.push()`?", a: "`push` keeps the same reference, so `getSnapshot` returns the ‘same’ value and React never re-renders." }
    ],
    quiz: [
      { q: "What happens if `getSnapshot` returns `{ ...store }` every call?", options: ["Nothing, React deep-compares", "An infinite re-render loop", "The store is copied safely", "React ignores the result"], answer: 1, why: "Snapshots are compared with `Object.is`; a new object never matches the previous one." },
      { q: "What problem is this hook specifically designed to solve?", options: ["Slow network requests", "Tearing between components reading an external store", "Prop drilling", "Memory leaks in timers"], answer: 1, why: "It guarantees every component sees the same store version in one render, even with concurrent features." },
      { q: "Where is `useSyncExternalStore` most often used?", options: ["Inside state libraries and small custom hooks", "For all local component state", "Only in class components", "To fetch data from APIs"], answer: 0, why: "Redux, Zustand and similar libraries use it under the hood. App code usually calls a wrapper hook." }
    ],
    rev: {
      sec30: "`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` subscribes a component to data React doesn't own. React reads a snapshot during render and re-renders when it changes. It prevents tearing in concurrent rendering. Snapshots must be stable (same value if unchanged), and `subscribe` should be defined outside the component.",
      interview: [
        { level: "basic", q: "What is an external store?", a: "Any data source outside React state: a global store module, browser APIs like `navigator.onLine`, or a third-party library's state." },
        { level: "intermediate", q: "Why not just use `useEffect` + `useState` to subscribe?", a: "That works but can tear under concurrent rendering and shows a stale value on first render. `useSyncExternalStore` reads synchronously and keeps all readers consistent." },
        { level: "advanced", q: "What is tearing?", a: "When a concurrent render is paused and the store changes in between, some components show the old value and others the new one. This hook forces a consistent snapshot." },
        { level: "tricky", q: "Why might this hook cause an infinite loop?", a: "`getSnapshot` returns a new object or array each call. Return a cached, immutable value that only changes when the data does." },
        { level: "intermediate", q: "What is `getServerSnapshot` for?", a: "It supplies the value during server rendering and hydration, where browser APIs aren't available. It must match on server and client." }
      ],
      predict: [
        { code: `let n = 0;\nconst subscribe = () => () => {};\nconst getSnapshot = () => ({ n });\nfunction App() {\n  const s = useSyncExternalStore(subscribe, getSnapshot);\n  return s.n;\n}`, answer: "React warns that getSnapshot should be cached, then errors with too many re-renders.", why: "Each call returns a new object, so React thinks the store keeps changing." }
      ],
      cheat: [
        "`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`",
        "`subscribe(cb)` must return an unsubscribe function",
        "`getSnapshot` returns the same value until data changes (`Object.is`)",
        "Define `subscribe` outside the component to avoid resubscribing",
        "Prevents tearing in concurrent rendering",
        "Mostly used by libraries (Redux, Zustand) and wrapper hooks"
      ]
    },
    related: ["HOOKS-005", "STORE-017", "RENDER-013", "HOOKS-028"]
  },

  "HOOKS-017": {
    tldr: "`useInsertionEffect` runs **before** layout effects so CSS-in-JS libraries can inject `<style>` tags first. App developers almost never need it: use `useEffect` or `useLayoutEffect` instead.",
    analogy: { icon: "🏷️", text: "A shop putting price tags on shelves before opening. Staff (layout effects) then measure the shelf with the tags already there, so nothing shifts after customers arrive." },
    visual: { type: "flow", title: "Effect order in one commit", steps: [
      { label: "Render", detail: "React calls your components and works out the changes." },
      { label: "useInsertionEffect", detail: "Library injects `<style>` rules. Refs aren't attached yet; no state updates allowed." },
      { label: "DOM + layout effects", detail: "`useLayoutEffect` runs and can measure elements with the styles already applied." },
      { label: "Paint", detail: "The browser draws the screen." },
      { label: "useEffect", detail: "Normal effects run after paint." }
    ]},
    points: [
      "Same shape as other effects: `useInsertionEffect(setup, deps?)`.",
      "Built for **CSS-in-JS library authors** (styled-components, Emotion) to insert styles at runtime.",
      "Runs before any `useLayoutEffect`, so measurements see the final styles.",
      "Can't update state, and refs aren't attached yet. Client only: it doesn't run on the server.",
      "In app code: prefer CSS files, CSS Modules or Tailwind. If unsure, you don't need this hook."
    ],
    code: { file: "useStyle.js", lang: "jsx", src: `import { useInsertionEffect } from 'react';

const inserted = new Set();

// What a tiny CSS-in-JS library might do internally
export function useStyle(className, rule) {
  useInsertionEffect(() => {
    if (inserted.has(className)) return;
    inserted.add(className);
    const tag = document.createElement('style');
    tag.textContent = \`.\${className} { \${rule} }\`;
    document.head.appendChild(tag);
  }, [className, rule]);
  return className;
}

export default function SaleBadge() {
  const cls = useStyle('sale-badge', 'background: crimson; color: white; padding: 4px;');
  return <span className={cls}>-20% today</span>;
}`, walk: [
      { lines: [3], note: "Remember which rules were already added so each one is injected once." },
      { lines: [7], note: "Runs before layout effects, so any component measuring this badge sees the styles." },
      { lines: [10, 11, 12], note: "Create a `<style>` tag and add it to `<head>`. Only DOM work: no state updates." },
      { lines: [18], note: "Components just call the library hook; they never touch `useInsertionEffect` directly." }
    ]},
    output: "A red “-20% today” badge. The style rule is injected once into `<head>`.",
    mistakes: [
      { bad: `useInsertionEffect(() => {\n  setWidth(ref.current.offsetWidth);\n});`, good: `useLayoutEffect(() => {\n  setWidth(ref.current.offsetWidth);\n}, []);`, why: "Insertion effects can't schedule updates and refs aren't attached yet. Measuring belongs in `useLayoutEffect`." },
      { bad: `// app code: fetch the cart\nuseInsertionEffect(() => { loadCart(); }, []);`, good: `useEffect(() => { loadCart(); }, []);`, why: "It's a special-purpose hook for style injection. Everything else goes in `useEffect`." }
    ],
    practice: [
      { level: "B", q: "Who is `useInsertionEffect` designed for?", a: "Authors of CSS-in-JS libraries that inject `<style>` tags at runtime." },
      { level: "B", q: "Order these: `useEffect`, `useLayoutEffect`, `useInsertionEffect`.", a: "`useInsertionEffect` → `useLayoutEffect` → paint → `useEffect`." },
      { level: "I", q: "Why inject styles before layout effects instead of in `useLayoutEffect`?", a: "So any layout effect that measures elements reads the final sizes. Injecting later forces extra style recalculation and can measure wrong sizes." },
      { level: "C", q: "Your team wants runtime CSS-in-JS in a Server Components app (framework-only, e.g. Next.js). What should you consider?", a: "Runtime CSS-in-JS doesn't work in Server Components. Prefer zero-runtime options (CSS Modules, Tailwind, compiled CSS-in-JS)." }
    ],
    quiz: [
      { q: "When does `useInsertionEffect` run?", options: ["After paint", "Before layout effects", "During render", "Only on the server"], answer: 1, why: "It fires before `useLayoutEffect`, so styles exist before anything measures layout." },
      { q: "Can you call `setState` inside it?", options: ["Yes, like any effect", "No, it can't schedule updates", "Only with a functional update"], answer: 1, why: "It's limited to inserting things like `<style>` tags." },
      { q: "You're building a normal shop app. Should you use it?", options: ["Yes, for every style", "Almost never; use CSS files, Modules or Tailwind", "Yes, instead of useEffect"], answer: 1, why: "It exists for library authors. App code rarely needs it." }
    ],
    rev: {
      sec30: "`useInsertionEffect` is a niche hook for CSS-in-JS libraries. It runs before layout effects so injected `<style>` rules exist before anything measures the DOM. It can't update state, refs aren't ready, and it doesn't run on the server. In app code, use `useEffect` or `useLayoutEffect`.",
      interview: [
        { level: "basic", q: "What is `useInsertionEffect` for?", a: "Letting CSS-in-JS libraries inject styles before layout effects run." },
        { level: "intermediate", q: "Order of effect hooks in a commit?", a: "Insertion effects, then layout effects (before paint), then normal effects (after paint)." },
        { level: "advanced", q: "Why did React add it instead of telling libraries to use `useLayoutEffect`?", a: "Injecting styles inside layout effects can make other layout effects measure stale styles and causes repeated style recalculation. A separate earlier phase fixes the order." },
        { level: "tricky", q: "Can you read `ref.current` in it?", a: "Not reliably. Refs aren't attached yet when insertion effects run." }
      ],
      compare: { cols: ["", "useInsertionEffect", "useLayoutEffect", "useEffect"], rows: [
        ["Runs", "Before layout effects", "Before paint", "After paint"],
        ["Typical use", "Inject `<style>`", "Measure DOM", "Sync with outside systems"],
        ["State updates", "Not allowed", "Allowed (sync)", "Allowed"]
      ]},
      cheat: [
        "For CSS-in-JS library authors only",
        "Runs before `useLayoutEffect`",
        "No state updates; refs not attached yet",
        "Client only: doesn't run during SSR",
        "App code: use `useEffect` / `useLayoutEffect`"
      ]
    },
    related: ["HOOKS-011", "HOOKS-005", "STYLE-005"]
  },

  "HOOKS-018": {
    tldr: "`useActionState` connects a form to an async function (Action). It gives you the last result, a `formAction` to pass to `<form action>`, and an `isPending` flag, with no manual loading state.",
    analogy: { icon: "🧾", text: "A café order slip. You hand it over (submit), the screen shows “preparing…” (pending), then you get your receipt or a “sold out” note (state)." },
    visual: { type: "cycle", title: "The useActionState loop", steps: [
      { label: "Submit", detail: "User submits `<form action={formAction}>`; React runs your action in a transition." },
      { label: "Pending", detail: "`isPending` becomes `true`; disable the button or show a spinner." },
      { label: "Action runs", detail: "`action(prevState, formData)` awaits the server and returns the next state." },
      { label: "New state", detail: "React re-renders with the returned value: a success message or an error." }
    ]},
    points: [
      "`const [state, formAction, isPending] = useActionState(action, initialState)`, imported from `react` (React 19+).",
      "Your action receives **`(previousState, formData)`** and returns the next state. It can be `async`.",
      "Pass `formAction` to `<form action={...}>` or a button's `formAction`. React wraps it in a transition for you.",
      "Return errors as state (`{ error: 'Out of stock' }`) instead of throwing, so you can show them in the form.",
      "Calling `formAction` manually (outside a form)? Wrap it in `startTransition`.",
      "Works in plain React (client). With frameworks it can also call a **Server Function** (framework-only)."
    ],
    code: { file: "Newsletter.jsx", lang: "jsx", src: `import { useActionState } from 'react';

async function subscribe(prevState, formData) {
  const email = formData.get('email');
  await new Promise((r) => setTimeout(r, 1000)); // fake API call
  if (!email.includes('@')) {
    return { ok: false, message: 'Please enter a valid email.' };
  }
  return { ok: true, message: \`Thanks! Recipes will go to \${email}.\` };
}

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribe, {
    ok: null,
    message: '',
  });

  return (
    <form action={formAction}>
      <input name="email" placeholder="you@example.com" />
      <button disabled={isPending}>
        {isPending ? 'Subscribing…' : 'Get weekly recipes'}
      </button>
      {state.message && (
        <p style={{ color: state.ok ? 'green' : 'crimson' }}>{state.message}</p>
      )}
    </form>
  );
}`, walk: [
      { lines: [3, 4], note: "The action gets the previous state and the submitted `FormData`." },
      { lines: [6, 7, 8], note: "Validation errors are **returned** as state, not thrown." },
      { lines: [13, 14, 15, 16], note: "The hook returns the current state, an action for the form and a pending flag." },
      { lines: [19], note: "`action={formAction}`: React handles submit, `preventDefault` and the transition." },
      { lines: [21, 22], note: "`isPending` disables the button while the request runs." },
      { lines: [24, 25, 26], note: "Show whatever the action returned last." }
    ]},
    output: "Typing “bob” and submitting shows “Subscribing…” for 1s, then a red “Please enter a valid email.” A valid email shows a green thank-you.",
    mistakes: [
      { bad: `async function subscribe(formData) {\n  const email = formData.get('email');\n}`, good: `async function subscribe(prevState, formData) {\n  const email = formData.get('email');\n}`, why: "With `useActionState` the **first** argument is the previous state. `formData` comes second." },
      { bad: `<button onClick={() => formAction(data)}>Save</button>`, good: `<button onClick={() => startTransition(() => formAction(data))}>\n  Save\n</button>`, why: "Outside `<form action>`, React can't wrap the call for you. Without a transition `isPending` won't update and React logs a dev error." }
    ],
    practice: [
      { level: "B", q: "What are the three values returned by `useActionState`?", a: "The current state, a `formAction` to pass to the form, and `isPending`." },
      { level: "I", q: "Keep a running count of successful sign-ups using `prevState`.", a: "Return `{ ...prevState, count: prevState.count + 1 }` on success.", code: `async function addToList(prev, formData) {\n  await save(formData.get('item'));\n  return { count: prev.count + 1 };\n}` },
      { level: "I", q: "Keep the typed email in the input after an error.", a: "Return the email in state and use it as `defaultValue`. React resets uncontrolled fields when a `<form action>` finishes, even if it returned an error." },
      { level: "C", q: "Compare this with handling the same form using `onSubmit` + `useState`.", a: "Manual: `preventDefault`, `setLoading(true)`, try/catch, `setLoading(false)`, `setError`. `useActionState` replaces all that with returned state and `isPending`." }
    ],
    quiz: [
      { q: "What arguments does the action receive?", options: ["(formData)", "(prevState, formData)", "(event)", "(state, dispatch)"], answer: 1, why: "React passes the previous state first, then the submitted `FormData`." },
      { q: "How should you show a validation error?", options: ["Throw an error", "Return it as part of the new state", "Call alert()", "Use a separate useEffect"], answer: 1, why: "Returning it makes it the next `state`, which you render." },
      { q: "Which package do you import `useActionState` from?", options: ["react-dom", "react", "react-router", "react-dom/client"], answer: 1, why: "It's in `react`. (Canary builds called it `useFormState` in `react-dom`; that name is deprecated.)" }
    ],
    rev: {
      sec30: "`useActionState(action, initialState)` returns `[state, formAction, isPending]`. The action gets `(prevState, formData)` and returns the next state, so results and errors become state. Pass `formAction` to `<form action>`. React runs it in a transition, giving a pending flag for free. React 19+.",
      interview: [
        { level: "basic", q: "What problem does `useActionState` solve?", a: "It removes the loading/error/result boilerplate around form submissions by turning the action's return value into state and tracking pending automatically." },
        { level: "intermediate", q: "Why does the action receive the previous state?", a: "So each submission can build on the last result, like a reducer: counters, lists or error history." },
        { level: "advanced", q: "How does it relate to `useFormStatus`?", a: "`useActionState` lives in the form's component and owns the result. `useFormStatus` (from `react-dom`) is read in a child, like a submit button, to know if the parent form is pending." },
        { level: "tricky", q: "Is `useActionState` only for Server Actions?", a: "No. It works with any client async function. With a framework it can also call Server Functions (framework-only) and supports progressive enhancement." },
        { level: "intermediate", q: "Two quick submissions: what happens?", a: "Actions are queued and run in order, each receiving the state the previous one returned." }
      ],
      debug: [
        { code: `const [state, formAction] = useActionState(save, null);\nreturn <form onSubmit={formAction}>...</form>;`, fix: `const [state, formAction] = useActionState(save, null);\nreturn <form action={formAction}>...</form>;`, why: "`onSubmit` passes an event, not `FormData`, and skips React's form Action handling. Use the `action` prop." }
      ],
      cheat: [
        "`const [state, formAction, isPending] = useActionState(fn, init)`",
        "`fn(prevState, formData)` returns the next state",
        "`<form action={formAction}>` (React 19 form Actions)",
        "Return errors as state; don't throw for validation",
        "Manual call outside a form → wrap in `startTransition`",
        "Import from `react`; old `useFormState` (react-dom) is deprecated"
      ]
    },
    related: ["HOOKS-019", "EVT-020", "HOOKS-014", "ADV-017"]
  },

  "HOOKS-019": {
    tldr: "`useOptimistic` shows the result **before** the server confirms it (a liked heart, a sent chat message). When the Action finishes, React swaps in the real state, or rolls back if it failed.",
    analogy: { icon: "💬", text: "A chat app shows your message instantly with a faint “sending…” tick. If the network fails, it disappears or shows “retry”." },
    visual: { type: "timeline", title: "A chat message sent optimistically", frames: [
      { label: "Before", state: "messages = [Hi]", note: "Real state from the server." },
      { label: "Send click", state: "optimistic = [Hi, See you (sending…)]", note: "`addOptimistic` inside the Action shows it instantly." },
      { label: "Waiting", state: "optimistic = [Hi, See you (sending…)]", note: "The Action awaits the server; UI stays responsive." },
      { label: "Success", state: "messages = [Hi, See you]", note: "Real state updated; optimistic copy replaced." },
      { label: "If it failed", state: "messages = [Hi]", note: "Real state unchanged, so the optimistic item vanishes." }
    ]},
    points: [
      "`const [optimistic, addOptimistic] = useOptimistic(state, (current, value) => next)` (React 19+).",
      "`state` is the **real** value (from props or `useState`). The hook returns a temporary copy while an Action runs.",
      "Call `addOptimistic` **inside an Action** (form `action` or `startTransition`); otherwise React warns.",
      "When the Action ends, the optimistic value is thrown away and React shows the real `state` again.",
      "You must still update the real state on success. If you don't, the optimistic item disappears."
    ],
    code: { file: "Chat.jsx", lang: "jsx", src: `import { useOptimistic, useState } from 'react';

async function sendToServer(text) {
  await new Promise((r) => setTimeout(r, 1500));
  return { id: crypto.randomUUID(), text };
}

export default function Chat() {
  const [messages, setMessages] = useState([{ id: '1', text: 'Hi!' }]);
  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (current, text) => [...current, { id: 'temp-' + current.length, text, sending: true }]
  );

  async function sendAction(formData) {
    const text = formData.get('message');
    addOptimistic(text);                  // show it now
    const saved = await sendToServer(text);
    setMessages((m) => [...m, saved]);    // commit the real one
  }

  return (
    <>
      <ul>
        {optimistic.map((m) => (
          <li key={m.id} style={{ opacity: m.sending ? 0.5 : 1 }}>
            {m.text} {m.sending && <small>(sending…)</small>}
          </li>
        ))}
      </ul>
      <form action={sendAction}>
        <input name="message" />
        <button>Send</button>
      </form>
    </>
  );
}`, walk: [
      { lines: [9], note: "The real list of messages lives in normal state." },
      { lines: [10, 11, 12, 13], note: "The update function says how to merge an optimistic value into the current list." },
      { lines: [17], note: "Inside the form Action: show the message instantly, marked `sending`." },
      { lines: [18, 19], note: "Await the server, then update real state. The temp copy is replaced." },
      { lines: [25, 26, 27], note: "Render the **optimistic** list and fade pending items." }
    ]},
    output: "Typing “See you” and pressing Send shows it immediately at 50% opacity with “(sending…)”. After 1.5s it turns solid.",
    mistakes: [
      { bad: `function onClick() {\n  addOptimistic(text); // plain event handler\n  save(text);\n}`, good: `function onClick() {\n  startTransition(async () => {\n    addOptimistic(text);\n    await save(text);\n  });\n}`, why: "Optimistic updates only live for the duration of an Action. Outside one, React warns and the value flashes away." },
      { bad: `addOptimistic(text);\nawait sendToServer(text);\n// forgot setMessages`, good: `addOptimistic(text);\nconst saved = await sendToServer(text);\nsetMessages((m) => [...m, saved]);`, why: "When the Action ends React shows the real state again. If you never update it, the message disappears." }
    ],
    practice: [
      { level: "B", q: "What do you render: `messages` or `optimistic`?", a: "`optimistic`. It equals `messages` when nothing is pending, plus temp items during an Action." },
      { level: "I", q: "Make an optimistic ❤️ like button showing the count +1 instantly.", a: "`useOptimistic(likes, (n) => n + 1)`, call `addOptimistic()` inside `startTransition`, then set real likes from the server.", code: `const [shownLikes, addLike] = useOptimistic(likes, (n) => n + 1);\nfunction like() {\n  startTransition(async () => {\n    addLike();\n    setLikes(await api.like(postId));\n  });\n}` },
      { level: "I", q: "What happens if `sendToServer` throws?", a: "The optimistic item disappears, but an uncaught error also shows the nearest Error Boundary. Wrap the await in try/catch to show “Failed, retry” instead." },
      { level: "C", q: "When should you **not** use optimistic UI?", a: "When failure is common or costly to undo visually: payments, placing an order, deleting important data. Show a pending state instead." }
    ],
    quiz: [
      { q: "Where must `addOptimistic` be called?", options: ["Anywhere", "Inside an Action or startTransition", "Only in useEffect", "Only during render"], answer: 1, why: "The optimistic value only lasts while an Action is running." },
      { q: "The server call fails; you catch the error and don't update state. What shows?", options: ["The optimistic item stays forever", "The real state without the item", "An error boundary", "A blank list"], answer: 1, why: "After the Action ends React shows the real `state` again." },
      { q: "What is the second argument to `useOptimistic`?", options: ["A reducer-like function (current, value) => next", "The initial loading flag", "A dependency array", "The server URL"], answer: 0, why: "It merges the optimistic value into the current state." }
    ],
    rev: {
      sec30: "`useOptimistic(state, updateFn)` returns a temporary version of `state` that's shown only while an Action runs. Call `addOptimistic(value)` inside an Action; the UI updates instantly. When the Action finishes, React shows the real state again, so on success update real state, and on failure it rolls back automatically. React 19+.",
      interview: [
        { level: "basic", q: "What is optimistic UI?", a: "Showing the expected result immediately, before the server confirms, and correcting it if the request fails." },
        { level: "intermediate", q: "How does rollback work with `useOptimistic`?", a: "The optimistic value only exists during the Action. When it ends, React renders the real state; if you didn't update it (because of an error), the change disappears." },
        { level: "advanced", q: "How is this different from TanStack Query's optimistic updates?", a: "TanStack Query edits the query cache in `onMutate` and restores a snapshot in `onError`. `useOptimistic` is built into React and ties the temp state to an Action's lifetime." },
        { level: "tricky", q: "Why does React warn ‘optimistic state update occurred outside a transition’?", a: "`addOptimistic` was called from a plain handler. Wrap it in `startTransition` or use a form `action`." }
      ],
      scenario: [
        { q: "A user likes a recipe; the server is slow. How do you keep it snappy?", a: "Render a like count from `useOptimistic`, add 1 inside an Action, then set the real count from the response. On error, show a toast; the count rolls back on its own." }
      ],
      cheat: [
        "`const [opt, addOpt] = useOptimistic(state, (cur, v) => next)`",
        "Call `addOpt` inside a form `action` or `startTransition`",
        "Render `opt`, not `state`",
        "Update the real state on success",
        "Failure → optimistic value disappears automatically",
        "React 19+, import from `react`"
      ]
    },
    related: ["HOOKS-018", "API-027", "HOOKS-014"]
  },

  "HOOKS-020": {
    tldr: "`useEffectEvent` wraps code that an effect calls but that **shouldn't restart** the effect. Inside it you always read the latest props and state, yet it isn't a dependency.",
    analogy: { icon: "🎧", text: "A music app stays connected to one radio station. Changing the volume shouldn't reconnect the stream; the next announcement just plays at the new volume." },
    visual: { type: "compare", title: "Same chat room, theme changes", left: { label: "theme in the effect deps", tone: "bad", points: [
      "Effect depends on `[roomId, theme]`",
      "Switching dark mode **disconnects and reconnects** the chat",
      "Removing `theme` from deps = stale value + lint error"
    ]}, right: { label: "theme read in an Effect Event", tone: "good", points: [
      "Effect depends on `[roomId]` only",
      "`onConnected` reads the **latest** `theme` every time",
      "Theme change = no reconnect"
    ]}},
    points: [
      "Stable in **React 19.2**: `import { useEffectEvent } from 'react'`.",
      "Split an effect into **reactive** code (reconnect when `roomId` changes) and **non-reactive** code (read `theme` when something happens).",
      "Call Effect Events **only from inside effects**. Not during render, not in event handlers.",
      "**Don't** add them to the dependency array; the latest `eslint-plugin-react-hooks` knows this.",
      "Don't pass them to other components or hooks. Not a way to silence the linter for values that really should re-sync."
    ],
    code: { file: "ChatRoom.jsx", lang: "jsx", src: `import { useEffect, useEffectEvent } from 'react';

function createConnection(roomId) {
  let onOpen = () => {};
  let timer;
  return {
    on(_, cb) { onOpen = cb; },
    connect() { timer = setTimeout(() => onOpen(), 500); },
    disconnect() { clearTimeout(timer); console.log('❌ left', roomId); },
  };
}

export default function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    console.log(\`✅ Joined #\${roomId} (theme: \${theme})\`);
  });

  useEffect(() => {
    const conn = createConnection(roomId);
    conn.on('connected', () => onConnected());
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]); // theme is NOT here, and that's correct

  return <h2 className={theme}>Welcome to #{roomId}</h2>;
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9, 10, 11], note: "A fake chat connection that fires ‘connected’ after half a second; `disconnect` cancels it." },
      { lines: [14, 15, 16], note: "The Effect Event reads `roomId` and `theme`. It always sees the latest values." },
      { lines: [20], note: "Called from inside the effect, when the connection opens." },
      { lines: [23], note: "Only `roomId` re-runs the effect. Switching theme never reconnects." }
    ]},
    output: "Mount: “✅ Joined #music (theme: light)” (Strict Mode dev logs one extra “❌ left music” first). Toggle dark mode: nothing logs (no reconnect). Change room to #recipes: “❌ left music”, then “✅ Joined #recipes (theme: dark)”.",
    mistakes: [
      { bad: `useEffect(() => {\n  const c = connect(roomId);\n  c.on('connected', () => notify(theme));\n  return () => c.disconnect();\n  // eslint-disable-next-line\n}, [roomId]);`, good: `const onConnected = useEffectEvent(() => notify(theme));\nuseEffect(() => {\n  const c = connect(roomId);\n  c.on('connected', () => onConnected());\n  return () => c.disconnect();\n}, [roomId]);`, why: "Silencing the linter keeps a stale `theme` forever. An Effect Event reads the fresh value without re-running the effect." },
      { bad: `const onSave = useEffectEvent(() => save(note));\n<button onClick={onSave}>Save</button>`, good: `<button onClick={() => save(note)}>Save</button>`, why: "Event handlers already see the latest values. Effect Events are only for code called from effects." }
    ],
    practice: [
      { level: "B", q: "Which values in the code are reactive and which are not?", a: "`roomId` is reactive: a new room needs a new connection. `theme` is only read when connected, so it goes in the Effect Event." },
      { level: "I", q: "Log a page visit with the current cart count, but only re-log when `url` changes.", a: "Wrap the log in an Effect Event that reads `cartCount`; the effect depends on `[url]`.", code: `const onVisit = useEffectEvent((visitedUrl) => {\n  logVisit(visitedUrl, cartCount);\n});\nuseEffect(() => {\n  onVisit(url);\n}, [url]);` },
      { level: "I", q: "Why pass `url` as an argument to `onVisit` instead of reading it inside?", a: "It makes clear that each visit is tied to that url, and keeps `url` as the reactive dependency of the effect." },
      { level: "C", q: "A `setInterval` timer should use the latest `step` value without restarting. Write it.", a: "Effect Event `onTick` calls `setCount(c => c + step)`; the effect with `[]` deps sets the interval and calls `onTick()`." }
    ],
    quiz: [
      { q: "Should an Effect Event go in the dependency array?", options: ["Yes, always", "No, never", "Only if it reads state"], answer: 1, why: "Effect Events are intentionally non-reactive; the linter knows to leave them out." },
      { q: "Where can you call an Effect Event?", options: ["During render", "In a button onClick", "Inside an effect", "In another component"], answer: 2, why: "They're designed to be called only from effects." },
      { q: "In which React version is `useEffectEvent` stable?", options: ["18.0", "19.0", "19.2", "It's still experimental"], answer: 2, why: "It shipped as stable in React 19.2." }
    ],
    rev: {
      sec30: "`useEffectEvent` (stable in React 19.2) creates a function you call from inside an effect that always reads the latest props/state, but doesn't count as a dependency. Use it to split non-reactive logic (logging, notifications using the current theme) out of reactive logic (connecting to a room). Don't call it during render or pass it around.",
      interview: [
        { level: "basic", q: "What problem does `useEffectEvent` solve?", a: "An effect needs the latest value of something, but that value changing shouldn't re-run the effect." },
        { level: "intermediate", q: "Why not just remove the value from the deps array?", a: "The effect's closure would keep the old value (stale closure) and the linter would flag it. An Effect Event reads the fresh value safely." },
        { level: "advanced", q: "How did people solve this before `useEffectEvent`?", a: "With a ref: store the latest callback in `ref.current` on each render and call `ref.current()` inside the effect. `useEffectEvent` is the official version of that pattern." },
        { level: "tricky", q: "Can you use `useEffectEvent` to avoid listing a dependency you find annoying?", a: "No. If a value change should re-sync the effect (like `roomId`), it must stay a dependency. Effect Events are only for logic that is really event-like." }
      ],
      cheat: [
        "`const onX = useEffectEvent(() => { ... })`, React 19.2",
        "Reads latest props/state; never stale",
        "Call only from inside effects",
        "Never put it in deps",
        "Don't pass to children or other hooks",
        "Replaces the old ‘latest ref’ pattern"
      ]
    },
    related: ["HOOKS-005", "HOOKS-007", "HOOKS-016"]
  },

  "HOOKS-021": {
    tldr: "A custom hook is **your own function** whose name starts with `use` and that calls other hooks. It packages stateful logic (toggle, fetch, timer) so many components can reuse it.",
    analogy: { icon: "📋", text: "A recipe card. Many cooks follow the same card, but each cooks their own dish in their own pan. The recipe is shared; the food isn't." },
    visual: { type: "tree", title: "One hook, reused in many places", root: { label: "useToggle()", note: "useState + toggle function", children: [
      { label: "RecipeCard", note: "show / hide ingredients", children: [{ label: "own `open` state" }] },
      { label: "ThemeSwitch", note: "light / dark", children: [{ label: "own `on` state" }] },
      { label: "Playlist", note: "shuffle on / off", children: [{ label: "own `on` state" }] }
    ]}},
    points: [
      "It's just a JavaScript function: name starts with `use`, calls hooks inside.",
      "It can take any arguments and return anything (a value, an array, an object).",
      "Each component that calls it gets its **own** state; only the logic is shared.",
      "It follows the **rules of hooks**: call it at the top level of a component or another hook.",
      "Like extracting a helper method in C#, but the helper can hold React state and effects."
    ],
    code: { file: "useToggle.jsx", lang: "jsx", src: `import { useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle];
}

function RecipeCard() {
  const [open, toggleOpen] = useToggle();
  return (
    <section>
      <button onClick={toggleOpen}>{open ? 'Hide' : 'Show'} ingredients</button>
      {open && <ul><li>2 eggs</li><li>100g flour</li></ul>}
    </section>
  );
}

function ShuffleButton() {
  const [shuffle, toggleShuffle] = useToggle(true);
  return <button onClick={toggleShuffle}>🔀 Shuffle: {shuffle ? 'on' : 'off'}</button>;
}

export default function App() {
  return <><RecipeCard /><ShuffleButton /></>;
}`, walk: [
      { lines: [3], note: "A normal function whose name starts with `use`." },
      { lines: [4, 5], note: "Inside, it uses built-in hooks like any component would." },
      { lines: [6], note: "Return whatever is handy; here an array like `useState`." },
      { lines: [10], note: "`RecipeCard` gets its own `open` state from the hook." },
      { lines: [20], note: "`ShuffleButton` reuses the logic with a different start value and separate state." }
    ]},
    output: "A “Show ingredients” button and a “🔀 Shuffle: on” button. Clicking one doesn't affect the other.",
    mistakes: [
      { bad: `function toggleHelper(initial) {\n  const [on, setOn] = useState(initial);\n  return [on, () => setOn(v => !v)];\n}`, good: `function useToggle(initial) {\n  const [on, setOn] = useState(initial);\n  return [on, () => setOn(v => !v)];\n}`, why: "Without the `use` prefix the linter can't check the rules of hooks, and readers can't tell it holds state." },
      { bad: `if (isMobile) {\n  const [open, toggle] = useToggle();\n}`, good: `const [open, toggle] = useToggle();\n// use isMobile in the JSX instead`, why: "Custom hooks are hooks: call them unconditionally at the top level." }
    ],
    practice: [
      { level: "B", q: "Is `useToggle` a React feature or your own code?", a: "Your own code. React only provides the built-in hooks it uses." },
      { level: "B", q: "Two components call `useToggle()`. Do they share `on`?", a: "No. Each call has its own state." },
      { level: "I", q: "Write `useCounter(start)` returning `{ count, add, reset }`.", a: "Wrap `useState(start)` and return helper functions.", code: `function useCounter(start = 0) {\n  const [count, setCount] = useState(start);\n  return {\n    count,\n    add: () => setCount((c) => c + 1),\n    reset: () => setCount(start),\n  };\n}` },
      { level: "C", q: "When should a helper NOT be a custom hook?", a: "When it uses no hooks, like `formatPrice(n)`. Make it a plain function so it can be called anywhere." }
    ],
    quiz: [
      { q: "What makes a function a custom hook?", options: ["It's exported from react", "Its name starts with `use` and it calls hooks", "It returns JSX", "It's a class"], answer: 1, why: "Name + calling hooks. React has no special registration." },
      { q: "Two components use the same custom hook. Their state is…", options: ["Shared", "Independent", "Merged", "Global"], answer: 1, why: "Hooks share logic, not state." },
      { q: "Can a custom hook call another custom hook?", options: ["Yes", "No", "Only in class components"], answer: 0, why: "Hooks compose: `useFetch` might call `useState`, `useEffect` and your `useDebounce`." }
    ],
    rev: {
      sec30: "A custom hook is a function starting with `use` that calls other hooks to package reusable stateful logic. It can take arguments and return anything. Each component calling it gets its own independent state. It follows the rules of hooks, and hooks can compose other hooks.",
      interview: [
        { level: "basic", q: "What is a custom hook?", a: "A function named `useSomething` that calls React hooks, used to reuse stateful logic between components." },
        { level: "intermediate", q: "Custom hook vs utility function?", a: "A utility function has no hooks and can be called anywhere. A custom hook uses hooks, so it must follow the rules of hooks." },
        { level: "intermediate", q: "Custom hook vs component?", a: "A component returns UI (JSX). A custom hook returns data and functions; the component decides what to render." },
        { level: "advanced", q: "What did people use before hooks for logic reuse?", a: "Higher-order components and render props. Both add wrapper layers; custom hooks reuse logic with no extra components in the tree." }
      ],
      cheat: [
        "Custom hook = function named `use...` that calls hooks",
        "Shares **logic**, not state",
        "Can return anything: value, array, object",
        "Must follow the rules of hooks",
        "Hooks can call other hooks",
        "No hooks inside? Make it a plain function"
      ]
    },
    related: ["HOOKS-022", "HOOKS-023", "HOOKS-002", "HOOKS-001"]
  },

  "HOOKS-022": {
    tldr: "To create a custom hook, move the `useState`/`useEffect` code out of a component into a `useX` function, pass in what it needs as arguments, and return what the component uses.",
    analogy: { icon: "⏲️", text: "A kitchen timer you keep rebuilding for every recipe. Build it once, then each recipe just says “start 10 minutes” and reads the time left." },
    visual: { type: "flow", title: "Extracting a hook in 5 moves", steps: [
      { label: "Spot the logic", detail: "Find state + effects that do one job, like a countdown." },
      { label: "Cut into useX", detail: "Move that code into `function useCountdown()`." },
      { label: "Inputs → args", detail: "Values it needs from the component become parameters: `useCountdown(seconds)`." },
      { label: "Outputs → return", detail: "Return only what the component uses: `{ left, start }`." },
      { label: "Call it", detail: "The component shrinks to one line of logic plus its JSX." }
    ]},
    points: [
      "Extract when logic is **repeated**, or when it hides what the component is about.",
      "Name it after **what** it does (`useCountdown`), not how (`useIntervalEffect`).",
      "Return a small, clear API. Object for many values, array for 2 (like `useState`).",
      "Keep effects' cleanup **inside** the hook so callers can't forget it.",
      "Don't extract too early: a one-line `useState` isn't worth a hook."
    ],
    code: { file: "useCountdown.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

export function useCountdown(seconds) {
  const [left, setLeft] = useState(0);
  const running = left > 0; // derived, not extra state

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left]);

  const start = () => setLeft(seconds);
  const stop = () => setLeft(0);
  return { left, running, start, stop };
}

export default function EggTimer() {
  const { left, running, start } = useCountdown(5);
  return (
    <div>
      <p>🥚 {running ? left + 's left' : 'Ready'}</p>
      <button onClick={start} disabled={running}>Boil eggs</button>
    </div>
  );
}`, walk: [
      { lines: [3], note: "The component's input (`seconds`) becomes the hook's argument." },
      { lines: [4, 5], note: "The state that used to sit in the component now lives here. `running` is derived." },
      { lines: [7, 8, 9, 10, 11], note: "The tick effect and its cleanup are owned by the hook. Each tick schedules the next." },
      { lines: [13, 14, 15], note: "Return just what the UI needs." },
      { lines: [19], note: "The component reads like a sentence: “use a 5-second countdown”." }
    ]},
    output: "“🥚 Ready”. Click “Boil eggs”: 5s left, 4s left… then back to “Ready” and the button re-enables.",
    mistakes: [
      { bad: `function useCountdown(seconds) {\n  ...\n  return <p>{left}s left</p>;\n}`, good: `function useCountdown(seconds) {\n  ...\n  return { left, start };\n}`, why: "A hook should return data and functions. Returning JSX locks callers into one look; that's a component's job." },
      { bad: `function useCountdown(seconds) {\n  useEffect(() => {\n    setInterval(tick, 1000);\n  }, []);\n}`, good: `useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);`, why: "Without cleanup, every unmount leaves a running timer. Bake cleanup into the hook." }
    ],
    practice: [
      { level: "B", q: "What becomes the hook's arguments and what becomes its return value?", a: "Inputs the logic needs from the component are arguments; values and functions the UI uses are returned." },
      { level: "I", q: "Add a **Cancel** button to `EggTimer`.", a: "The hook already returns `stop`; destructure it and call it: `<button onClick={stop}>Cancel</button>`." },
      { level: "I", q: "Extract `useDocumentTitle(title)` that sets `document.title`.", a: "An effect that sets the title whenever `title` changes.", code: `function useDocumentTitle(title) {\n  useEffect(() => {\n    document.title = title;\n  }, [title]);\n}` },
      { level: "C", q: "Two components each have the same 15 lines for a shopping cart total with discount. Extract a hook and list its args and return.", a: "`useCartTotal(items, coupon)` returns `{ subtotal, discount, total }`. If it uses no hooks, a plain `calcCartTotal` function is better." }
    ],
    quiz: [
      { q: "What should a custom hook usually return?", options: ["JSX", "Data and functions", "Nothing", "A class instance"], answer: 1, why: "The component decides how to render; the hook supplies the logic." },
      { q: "Where should a timer's `clearInterval` live?", options: ["In every component using the hook", "Inside the hook's effect cleanup", "In a global file"], answer: 1, why: "Then callers can't forget it." },
      { q: "Good name for a hook that tracks time left on a timer?", options: ["useEffectInterval", "useCountdown", "countdownHook", "UseTimer"], answer: 1, why: "Names say what it does and start with lowercase `use`." }
    ],
    rev: {
      sec30: "Create a hook by moving related state and effects from a component into `useX`. Component inputs become arguments; what the UI needs becomes the return value. Keep cleanup inside the hook, return data not JSX, and name it by purpose. Extract when logic repeats or clutters the component.",
      interview: [
        { level: "basic", q: "How do you turn component logic into a custom hook?", a: "Move the hook calls into a `useX` function, turn the inputs into parameters, and return the values the component used." },
        { level: "intermediate", q: "Should custom hooks return arrays or objects?", a: "Arrays for 1-2 values the caller will rename (like `useState`); objects when there are more values, so order doesn't matter." },
        { level: "advanced", q: "How do you test a custom hook?", a: "Test it through a small component using React Testing Library, or with `renderHook` from `@testing-library/react`, using fake timers for intervals." },
        { level: "tricky", q: "Does extracting a hook change how often the component re-renders?", a: "No. Hook state updates still re-render the calling component exactly as before; extraction is purely organisational." }
      ],
      cheat: [
        "Inputs → arguments, outputs → return value",
        "Return data and functions, not JSX",
        "Keep effect cleanup inside the hook",
        "Name by purpose: `useCountdown`, not `useIntervalEffect`",
        "Extract when logic repeats or clutters a component",
        "Test with `renderHook` or a tiny test component"
      ]
    },
    related: ["HOOKS-021", "HOOKS-023", "HOOKS-024", "TS-015"]
  },

  "HOOKS-023": {
    tldr: "Custom hooks share **logic, not state**. Every call creates fresh state for that component. If two components must see the **same** data, lift the state up, use context, or use a store.",
    analogy: { icon: "📒", text: "Two people buy the same notebook brand. Same layout, but what you write in yours doesn't appear in your friend's. To share notes, you need one shared notebook." },
    visual: { type: "compare", title: "Same hook vs shared data", left: { label: "Call the same hook twice", tone: "neutral", points: [
      "`useCart()` in Header and in CartPage",
      "Each call has its **own** `useState`",
      "Add to cart in CartPage → Header badge still says 0"
    ]}, right: { label: "Share one source of truth", tone: "good", points: [
      "Keep cart state in a parent, context or store",
      "The hook just **reads** that shared source",
      "Both components show the same count"
    ]}},
    points: [
      "Each hook call = new hook slots in **that** component. Nothing is shared between calls.",
      "That's a feature: one `useFormInput` can safely power many inputs.",
      "Need shared data? **Lift state up** to a common parent, or put it in **context** (HOOKS-006) or a store.",
      "A hook can still wrap shared data: `useCart()` that calls `useContext(CartContext)` returns the same cart everywhere.",
      "Pass changing data **into** hooks as arguments; hooks re-run every render with the latest values."
    ],
    code: { file: "Checkout.jsx", lang: "jsx", src: `import { useState } from 'react';

function useFormInput(initial) {
  const [value, setValue] = useState(initial);
  return { value, onChange: (e) => setValue(e.target.value) };
}

export default function Checkout() {
  const name = useFormInput('');
  const city = useFormInput('');

  return (
    <form>
      <input placeholder="Name" {...name} />
      <input placeholder="City" {...city} />
      <p>Deliver to {name.value || '…'} in {city.value || '…'}</p>
    </form>
  );
}`, walk: [
      { lines: [3, 4, 5], note: "One piece of logic: a value plus an `onChange` that updates it." },
      { lines: [9, 10], note: "Called twice → two **separate** states. Typing a name doesn't touch the city." },
      { lines: [14, 15], note: "Spread `{ value, onChange }` straight onto each input." },
      { lines: [16], note: "Both values live in the same component, so it can combine them." }
    ]},
    output: "Typing “Ana” and “Lisbon” shows “Deliver to Ana in Lisbon”. Each input keeps its own value.",
    mistakes: [
      { bad: `// Header.jsx\nconst { count } = useCart(); // own useState\n// CartPage.jsx\nconst { add } = useCart();   // own useState`, good: `// useCart reads shared context\nfunction useCart() {\n  return useContext(CartContext);\n}`, why: "If `useCart` holds its own `useState`, each component gets a separate cart. Put the state in one place and let the hook read it." },
      { bad: `let shared = 0; // module variable\nfunction useCounter() {\n  return [shared, () => shared++];\n}`, good: `function useCounter() {\n  const [n, setN] = useState(0);\n  return [n, () => setN((x) => x + 1)];\n}`, why: "A module variable doesn't trigger re-renders. For truly global state use a store with `useSyncExternalStore` (Zustand, Redux)." }
    ],
    practice: [
      { level: "B", q: "Add a third `phone` input using the same hook.", a: "`const phone = useFormInput('');` then `<input {...phone} />`." },
      { level: "I", q: "A `CartBadge` and `CartList` both call `useCart()` (with `useState` inside) and show different counts. Why, and how do you fix it?", a: "Each call owns separate state. Move the cart into a `CartProvider` and make `useCart` read the context." },
      { level: "I", q: "Make `useFormInput` reset when the form is submitted.", a: "Also return `reset: () => setValue(initial)` and call it on submit. Spread only `value` and `onChange` onto the input." },
      { level: "C", q: "When would you choose a store (Zustand) over context for shared hook data?", a: "When many components read different slices and update often; stores let components subscribe to just their slice, avoiding context re-rendering every consumer." }
    ],
    quiz: [
      { q: "`useFormInput` is called twice in one component. How many state values exist?", options: ["1, shared", "2, independent", "0 until typed"], answer: 1, why: "Each call creates its own state slot." },
      { q: "Two sibling components need the same cart. Best fix?", options: ["Call useCart in both with useState inside", "Lift the state up or use context/store", "Use a global let variable", "Copy the data with useEffect"], answer: 1, why: "Shared data needs one owner; hooks can then read it." },
      { q: "Custom hooks share…", options: ["State", "Logic", "DOM nodes", "Refs between components"], answer: 1, why: "Logic is reused; state is per call." }
    ],
    rev: {
      sec30: "Custom hooks reuse logic, not state: each call gets independent state in the calling component. To share data, keep one source of truth (lifted state, context or a store) and let the hook read it, e.g. `useCart()` wrapping `useContext(CartContext)`.",
      interview: [
        { level: "basic", q: "Do two components using the same custom hook share state?", a: "No. Each call has its own state; only the code is shared." },
        { level: "intermediate", q: "How do you make a custom hook return shared data?", a: "Have it read a shared source: context via `useContext`, or an external store via `useSyncExternalStore` or a library." },
        { level: "advanced", q: "Why do hooks re-run on every render?", a: "They're called as part of the component function. That's why they always see the latest props and state passed in." },
        { level: "tricky", q: "Can a module-level variable inside a hook's file share state?", a: "It shares the value, but changing it doesn't re-render anyone, and it leaks across tests and SSR requests. Use a proper store." }
      ],
      scenario: [
        { q: "Your playlist sidebar and player both call `usePlaylist()` and drift out of sync. What do you change?", a: "Move playlist state into a provider (or Zustand store) at the app level; `usePlaylist()` becomes a thin reader of that shared state." }
      ],
      cheat: [
        "Hooks share logic, never state",
        "Each call = new, independent state",
        "Shared data → lift state, context or store",
        "A hook can wrap `useContext` to read shared data",
        "Module variables don't trigger re-renders",
        "Hooks re-run every render with fresh inputs"
      ]
    },
    related: ["HOOKS-021", "HOOKS-006", "STATE-021", "STORE-017"]
  },

  "HOOKS-024": {
    tldr: "Name custom hooks `useSomething` (lowercase `use` + capital letter). The name is how React's lint rules and the React Compiler know the function calls hooks and must follow the rules of hooks.",
    analogy: { icon: "🏷️", text: "A “contains nuts” label on food. The label itself does nothing, but everyone (and every checker) knows to treat that item with special rules." },
    visual: { type: "compare", title: "What the name tells tools and teammates", left: { label: "getCartTotal / cartHook", tone: "bad", points: [
      "Linter treats it as a normal function",
      "Hook calls inside aren't checked (conditional calls slip through)",
      "Readers can't tell it holds state"
    ]}, right: { label: "useCartTotal", tone: "good", points: [
      "`eslint-plugin-react-hooks` checks the rules of hooks",
      "React Compiler treats it as a hook",
      "Readers know: top level only, may hold state"
    ]}},
    points: [
      "Pattern: `use` + **Capital letter**: `useCart`, `useOnlineStatus`. Not `usecart`, not `UseCart`.",
      "Components are `PascalCase` (`CartBadge`); hooks are `camelCase` starting with `use`.",
      "Only name it `use...` if it **calls hooks**. A pure helper (`formatPrice`) stays a normal function.",
      "Name by **purpose**: `useChatRoom(roomId)` beats `useWebSocketEffect`.",
      "Install `eslint-plugin-react-hooks` (included in the Vite React template) to get the checks."
    ],
    code: { file: "hooks.jsx", lang: "jsx", src: `import { useState } from 'react';

// ✅ Calls a hook, so it is a hook
export function useRecipeSearch(recipes) {
  const [query, setQuery] = useState('');
  const results = recipes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );
  return { query, setQuery, results };
}

// ✅ No hooks inside, so a plain function (no "use")
export function formatMinutes(min) {
  return min >= 60 ? \`\${Math.floor(min / 60)}h \${min % 60}m\` : \`\${min}m\`;
}

// ❌ Calls a hook but the name hides it: linter can't help
export function recipeSearch(recipes) {
  const [query, setQuery] = useState(''); // error: hook in a non-hook function
  return { query, setQuery };
}

export default function RecipeList({ recipes }) {
  const { query, setQuery, results } = useRecipeSearch(recipes);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results.map((r) => <p key={r.id}>{r.title} · {formatMinutes(r.minutes)}</p>)}
    </>
  );
}`, walk: [
      { lines: [4, 5], note: "Starts with `use` and calls `useState`: a real custom hook." },
      { lines: [13, 14, 15], note: "No hooks inside, so it's a plain function anyone can call, even in a loop." },
      { lines: [18, 19], note: "Hook inside a non-`use` function: the linter reports “React Hook useState is called in function recipeSearch…”." },
      { lines: [24], note: "Components call hooks at the top level; the name makes that rule visible." }
    ]},
    output: "A search box over recipes, each shown like “Pasta · 25m” or “Roast · 1h 30m”. The linter flags `recipeSearch`.",
    mistakes: [
      { bad: `function useFormatPrice(n) {\n  return '£' + n.toFixed(2); // no hooks\n}`, good: `function formatPrice(n) {\n  return '£' + n.toFixed(2);\n}`, why: "A `use` name forces callers to follow hook rules (no loops, no conditions) for no reason." },
      { bad: `function UseCart() { ... }  // or usecart`, good: `function useCart() { ... }`, why: "`UseCart` looks like a component; `usecart` doesn't match the `use` + capital pattern the linter looks for." }
    ],
    practice: [
      { level: "B", q: "Fix the names: `UseTheme`, `cartHook`, `usePrice` (no hooks inside).", a: "`useTheme`, `useCart` (if it calls hooks), `formatPrice` / `getPrice`." },
      { level: "B", q: "Why can `formatMinutes` be called inside `results.map`, but a hook can't?", a: "It's a plain function with no hook slots. Hooks must run in the same order every render, so never in loops." },
      { level: "I", q: "Rename `useWebSocketEffect(roomId)` to describe its purpose.", a: "`useChatRoom(roomId)`: callers care that they're in a room, not how the connection works." },
      { level: "C", q: "A hook doesn't call hooks today but you plan to add state later. Name it `use...`?", a: "React docs allow it to keep the API stable, but it's rare; usually start as a plain function and rename when it really uses hooks." }
    ],
    quiz: [
      { q: "Which is a correctly named custom hook?", options: ["UseCart", "usecart", "useCart", "cartUse"], answer: 2, why: "`use` followed by a capital letter." },
      { q: "Why does the name matter?", options: ["React refuses to run functions without it", "Lint rules and the React Compiler rely on it", "It makes the hook faster", "It registers the hook globally"], answer: 1, why: "React itself doesn't check names at runtime; tools do." },
      { q: "A function only formats a date. Name it…", options: ["useFormatDate", "formatDate", "UseDate"], answer: 1, why: "No hooks inside means it's a plain function." }
    ],
    rev: {
      sec30: "Custom hooks must be named `use` + capital letter (`useCart`). React doesn't check this at runtime, but `eslint-plugin-react-hooks` and the React Compiler use the name to enforce the rules of hooks. Only use the prefix for functions that call hooks; plain helpers keep normal names. Name hooks by purpose.",
      interview: [
        { level: "basic", q: "What's the naming rule for custom hooks?", a: "Start with `use` followed by a capital letter, like `useOnlineStatus`." },
        { level: "intermediate", q: "Does React break if you don't follow it?", a: "Not at runtime. But the linter won't check the rules of hooks inside, so bugs like conditional hook calls slip through, and the Compiler may treat it wrongly." },
        { level: "advanced", q: "Why shouldn't a function without hooks start with `use`?", a: "It wrongly forces callers to obey hook rules, so it can't be used in loops or conditions." },
        { level: "tricky", q: "Is `use` (React 19's `use(promise)`) a hook that breaks the rules?", a: "`use` is a React API that can be called in conditions and loops, unlike other hooks. It must still be called inside a component or hook." }
      ],
      cheat: [
        "Hooks: `useSomething` (camelCase, capital after `use`)",
        "Components: `PascalCase`",
        "`use` prefix only if it calls hooks",
        "Name by purpose: `useChatRoom`, not `useSocketEffect`",
        "`eslint-plugin-react-hooks` relies on the name",
        "React Compiler also relies on the name"
      ]
    },
    related: ["HOOKS-002", "HOOKS-021", "HOOKS-022", "PERF-019"]
  },

  "HOOKS-025": {
    tldr: "A `useFetch(url)` hook wraps `fetch` in an effect and returns `{ data, error, loading }`. It aborts the old request when the URL changes or the component unmounts, so stale answers never win.",
    analogy: { icon: "🍕", text: "Ordering pizza, then changing your mind. You cancel the first order, so the wrong pizza never shows up at your door after the right one." },
    visual: { type: "flow", title: "One useFetch request", steps: [
      { label: "url changes", detail: "The effect runs with the new `url`; `loading` is true because the result is for an older URL." },
      { label: "fetch + signal", detail: "Start `fetch(url, { signal })` with a fresh `AbortController`." },
      { label: "Response", detail: "Check `res.ok` (fetch doesn't reject on 404/500), then parse JSON." },
      { label: "Save result", detail: "Store `{ url, data }` or `{ url, error }`; the screen updates." },
      { label: "Cleanup", detail: "URL changed or unmount → `controller.abort()`; ignore the `AbortError`." }
    ]},
    points: [
      "State: data, error and which URL they belong to. `loading` is **derived**: result's url ≠ current url.",
      "`fetch` only rejects on network failure. **Check `res.ok`** to treat 404/500 as errors.",
      "Cleanup with `controller.abort()` cancels the request and prevents race conditions.",
      "Ignore `AbortError` in `catch`: it's expected, not a real error.",
      "In Strict Mode (dev) the effect runs, cleans up and runs again, so you'll see one aborted request. Normal.",
      "For real apps prefer **TanStack Query**: caching, retries, dedupe. This hook teaches the mechanics."
    ],
    code: { file: "useFetch.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then((data) => setResult({ url, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ url, data: null, error });
      });
    return () => controller.abort();
  }, [url]);

  const loading = result.url !== url;
  return { data: result.data, error: loading ? null : result.error, loading };
}

export default function Recipes({ query }) {
  const { data, error, loading } = useFetch(
    \`https://dummyjson.com/recipes/search?q=\${encodeURIComponent(query)}\`
  );

  if (error) return <p>😕 {error.message}</p>;
  if (loading && !data) return <p>Loading recipes…</p>;
  return (
    <ul style={{ opacity: loading ? 0.5 : 1 }}>
      {data.recipes.map((r) => <li key={r.id}>{r.name}</li>)}
    </ul>
  );
}`, walk: [
      { lines: [4], note: "One state object remembers which URL the data or error belongs to." },
      { lines: [7, 8], note: "A fresh `AbortController` per request; its `signal` goes into `fetch`." },
      { lines: [10], note: "Turn HTTP errors (404, 500) into real errors." },
      { lines: [14, 15], note: "Aborts are expected; only real failures become `error`." },
      { lines: [17], note: "Cleanup cancels the in-flight request when `url` changes or on unmount." },
      { lines: [20], note: "Derived loading: no extra `setLoading` calls to keep in sync. Old data stays visible (faded) until new data arrives." }
    ]},
    output: "“Loading recipes…”, then a list like “Classic Margherita Pizza”. Typing a new query fades the old list while the new one loads.",
    mistakes: [
      { bad: `useEffect(async () => {\n  const res = await fetch(url);\n  setData(await res.json());\n}, [url]);`, good: `useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal })\n    .then((r) => r.json()).then(setData)\n    .catch((e) => { if (e.name !== 'AbortError') setError(e); });\n  return () => controller.abort();\n}, [url]);`, why: "An async effect returns a Promise, not a cleanup, so you can't cancel. Old responses can overwrite newer ones." },
      { bad: `fetch(url).then((res) => res.json())`, good: `fetch(url).then((res) => {\n  if (!res.ok) throw new Error('HTTP ' + res.status);\n  return res.json();\n})`, why: "`fetch` resolves on 404/500. Without `res.ok` you'd show the error page body as data." }
    ],
    practice: [
      { level: "B", q: "Why is `url` the dependency of the effect?", a: "A new URL needs a new request; the effect re-runs only when it changes." },
      { level: "I", q: "Add a `refetch()` function.", a: "Keep a `version` state, add it to the deps, and return `refetch: () => setVersion((v) => v + 1)`." },
      { level: "I", q: "Skip fetching when `url` is `null` (e.g. no search yet).", a: "`if (!url) return;` at the top of the effect, and treat `loading` as false when there's no url." },
      { level: "C", q: "A user types “pas”, then “pasta”. The “pas” response arrives last. What protects you?", a: "The cleanup aborted the “pas” request when the URL changed, so it never calls `setResult`." }
    ],
    quiz: [
      { q: "Does `fetch` reject on a 404?", options: ["Yes", "No, you must check `res.ok`", "Only in Strict Mode"], answer: 1, why: "It only rejects for network failures or aborts." },
      { q: "What does `controller.abort()` in the cleanup prevent?", options: ["Memory being freed", "Old responses overwriting newer ones", "The component re-rendering", "CORS errors"], answer: 1, why: "It cancels outdated requests: the race-condition fix." },
      { q: "In dev you see one cancelled request on mount. Why?", options: ["A bug in useFetch", "Strict Mode runs effects twice (mount, cleanup, mount)", "The browser cache"], answer: 1, why: "Development-only check that cleanup works; production runs once." }
    ],
    rev: {
      sec30: "`useFetch(url)` runs `fetch` in an effect keyed on `url`, returns `{ data, error, loading }`, checks `res.ok`, and aborts the previous request in cleanup with `AbortController` (ignoring `AbortError`). This handles loading, errors and race conditions. Strict Mode shows an extra aborted request in dev. Production apps usually use TanStack Query.",
      interview: [
        { level: "basic", q: "What should a fetch hook return?", a: "The data, an error, and a loading flag, so components can render each state." },
        { level: "intermediate", q: "How do you avoid race conditions in a fetch effect?", a: "Abort the old request in cleanup with `AbortController`, or set an `ignore` flag in cleanup and skip `setState` when it's true." },
        { level: "advanced", q: "Why not write `useEffect(async () => ...)`?", a: "The effect must return a cleanup function or nothing. An async function returns a Promise, so React can't clean up, and you lose cancellation." },
        { level: "advanced", q: "Why use TanStack Query instead of `useFetch` in production?", a: "It adds caching, deduplication, background refetch, retries and invalidation, which a hand-made hook would need hundreds of lines for." },
        { level: "tricky", q: "Why does the request fire twice in development?", a: "Strict Mode mounts, unmounts and remounts to test cleanup. The first request is aborted; production fires once." }
      ],
      cheat: [
        "Return `{ data, error, loading }`",
        "`new AbortController()` per request, `signal` into fetch",
        "Cleanup: `controller.abort()`",
        "Ignore `AbortError` in catch",
        "Always check `res.ok`",
        "No `async` effect callback",
        "Production: TanStack Query"
      ]
    },
    related: ["HOOKS-005", "API-023", "API-030", "STORE-020"]
  },

  "HOOKS-026": {
    tldr: "`useLocalStorage(key, initial)` works like `useState` but saves the value in the browser, so notes or a theme survive a page refresh. Read it once lazily, write it in an effect, and guard every access with `try/catch`.",
    analogy: { icon: "🗒️", text: "A sticky note on your fridge. You write your shopping list once; tomorrow it's still there when you open the kitchen." },
    visual: { type: "flow", title: "Life of a stored value", steps: [
      { label: "First render", detail: "Lazy `useState(() => read(key))` parses saved JSON once, or uses the default." },
      { label: "User edits", detail: "`setValue` updates React state; the screen updates right away." },
      { label: "Effect saves", detail: "After render, `localStorage.setItem(key, JSON.stringify(value))`." },
      { label: "Refresh", detail: "Next visit, the first render reads the saved value back." },
      { label: "Other tab", detail: "The `storage` event tells this tab another tab changed the key." }
    ]},
    points: [
      "localStorage stores **strings** only: `JSON.stringify` on write, `JSON.parse` on read.",
      "Use **lazy init** `useState(() => ...)` so you read storage once, not every render.",
      "Wrap reads and writes in `try/catch`: bad JSON, private mode, full storage, or SSR (no `window`).",
      "Listen to the `storage` event to sync **other tabs** (it doesn't fire in the tab that wrote).",
      "Never store tokens or secrets: any script on the page can read localStorage."
    ],
    code: { file: "useLocalStorage.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback; // bad JSON, blocked storage, or no window (SSR)
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked: keep working in memory
    }
  }, [key, value]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key !== key || e.newValue === null) return;
      try { setValue(JSON.parse(e.newValue)); } catch { /* bad JSON */ }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue];
}

export default function Notes() {
  const [note, setNote] = useLocalStorage('quick-note', '');
  return (
    <textarea value={note} onChange={(e) => setNote(e.target.value)}
      placeholder="Shopping list…" />
  );
}`, walk: [
      { lines: [3, 4, 5, 6], note: "Read the string and parse it; `null` means nothing saved yet." },
      { lines: [7, 8], note: "Any failure falls back to the default instead of crashing the app." },
      { lines: [13], note: "Lazy init: the read runs only on the first render." },
      { lines: [15, 16, 17], note: "Save after every change; JSON keeps numbers, arrays and objects intact." },
      { lines: [23, 24, 25, 26, 28, 29], note: "Sync with other tabs and remove the listener on cleanup." },
      { lines: [32, 36], note: "Same API as `useState`, so swapping it in is a one-word change." }
    ]},
    output: "Type “eggs, milk” in the textarea, refresh the page: the text is still there. Open a second tab and edit: the first tab updates.",
    mistakes: [
      { bad: `const [v, setV] = useState(\n  JSON.parse(localStorage.getItem('cart'))\n);`, good: `const [v, setV] = useState(() => read('cart', []));`, why: "Not lazy, so it reads every render, and it crashes on bad JSON or during SSR. A missing key also gives `null`, not your default." },
      { bad: `localStorage.setItem('cart', items);`, good: `localStorage.setItem('cart', JSON.stringify(items));`, why: "Storage keeps strings. An array becomes `\"a,b\"` and an object becomes `\"[object Object]\"`." }
    ],
    practice: [
      { level: "B", q: "Save a `theme` ('light' / 'dark') with the hook.", a: "`const [theme, setTheme] = useLocalStorage('theme', 'light');`" },
      { level: "I", q: "Store a cart array and add an item.", a: "Update immutably; the effect saves it.", code: `const [cart, setCart] = useLocalStorage('cart', []);\nsetCart((c) => [...c, { id: 7, name: 'Coffee' }]);` },
      { level: "I", q: "Add a `remove()` function that deletes the key.", a: "Call `localStorage.removeItem(key)` in try/catch and `setValue(initialValue)`. Note the save effect will then write the default back." },
      { level: "C", q: "With SSR (Next.js), the server renders the default but the client reads a saved value. What goes wrong and how do you fix it?", a: "Hydration mismatch. Render the default first and read storage after mount, or use `useSyncExternalStore` with a `getServerSnapshot`." }
    ],
    quiz: [
      { q: "Why use `useState(() => read(key))` instead of `useState(read(key))`?", options: ["It's required by React", "The read runs only on the first render", "It makes the value reactive", "It encrypts the value"], answer: 1, why: "Lazy initialisers run once; the other form runs every render." },
      { q: "Does the `storage` event fire in the tab that called `setItem`?", options: ["Yes", "No, only in other tabs", "Only on reload"], answer: 1, why: "It notifies other documents of the same origin." },
      { q: "Is localStorage a good place for a login token?", options: ["Yes, it's private", "No, any script on the page (XSS) can read it", "Only if JSON-encoded"], answer: 1, why: "Prefer httpOnly cookies for tokens." }
    ],
    rev: {
      sec30: "`useLocalStorage(key, initial)` mirrors `useState` and persists the value. Read once with a lazy initialiser (`JSON.parse` in `try/catch`), save in an effect with `JSON.stringify`, and optionally listen to `storage` events to sync other tabs. Guard for SSR and blocked storage. Never store secrets there.",
      interview: [
        { level: "basic", q: "Why `JSON.stringify` before saving?", a: "localStorage only stores strings; JSON keeps arrays, numbers and objects round-trippable." },
        { level: "intermediate", q: "Why save in `useEffect` instead of inside `setValue`?", a: "It keeps the setter identical to `useState` (works with updater functions) and runs after render, keeping render pure." },
        { level: "advanced", q: "How do you keep two tabs in sync?", a: "Listen to `window`'s `storage` event and update state when `e.key` matches. Remove the listener in cleanup." },
        { level: "tricky", q: "What happens if the `key` prop changes?", a: "The lazy initialiser doesn't re-run, so state keeps the old key's value and then overwrites the new key. Re-read on key change or remount with `key={storageKey}`." }
      ],
      cheat: [
        "Strings only: stringify on write, parse on read",
        "Lazy init: `useState(() => read(key, init))`",
        "`try/catch` around every access",
        "SSR has no `window`: guard or read after mount",
        "`storage` event syncs other tabs",
        "Never store tokens or secrets"
      ]
    },
    related: ["WEB-037", "STATE-018", "AUTH-005", "HOOKS-016"]
  },

  "HOOKS-027": {
    tldr: "`useDebounce(value, delay)` returns a copy of a fast-changing value that only updates after the user **stops** changing it for `delay` ms. Perfect for search boxes: one request instead of one per key.",
    analogy: { icon: "🍽️", text: "A waiter waits until you stop adding “oh, and…” to your order before sending it to the kitchen. Each new item resets the wait." },
    visual: { type: "timeline", title: "Typing “pasta” with a 500 ms debounce", frames: [
      { label: "0 ms", state: "value = 'p'  ·  debounced = ''", note: "Timer starts (500 ms)." },
      { label: "120 ms", state: "value = 'pa'  ·  debounced = ''", note: "Cleanup clears the old timer; a new one starts." },
      { label: "250 ms", state: "value = 'pas'  ·  debounced = ''", note: "Reset again." },
      { label: "400 ms", state: "value = 'pasta'  ·  debounced = ''", note: "Last key press; timer starts." },
      { label: "900 ms", state: "value = 'pasta'  ·  debounced = 'pasta'", note: "Quiet for 500 ms: debounced updates once → one search." }
    ]},
    points: [
      "**Debounce** = wait until changes stop. (**Throttle** = at most once per interval.)",
      "Built from `useState` + `useEffect` + `setTimeout`; the **cleanup** clears the previous timer.",
      "The input stays instant (`value`); only the expensive work uses `debounced`.",
      "Typical delays: 250-500 ms for search, longer for autosave.",
      "For slow **rendering** (not network), `useDeferredValue` is often a better fit: no fixed delay."
    ],
    code: { file: "RecipeSearch.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // new key press → cancel old timer
  }, [value, delay]);

  return debounced;
}

const RECIPES = ['Pasta bake', 'Pancakes', 'Pad thai', 'Pizza', 'Paella'];

export default function RecipeSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) console.log('🔎 search API for', debouncedQuery);
  }, [debouncedQuery]);

  const results = RECIPES.filter((r) =>
    r.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>
    </>
  );
}`, walk: [
      { lines: [4], note: "The delayed copy starts equal to the input." },
      { lines: [7], note: "Schedule the update for `delay` ms from now." },
      { lines: [8], note: "Every change runs cleanup first, cancelling the pending timer. Only the last one survives." },
      { lines: [17, 18], note: "`query` updates on every key; `debouncedQuery` only after a pause." },
      { lines: [20, 21, 22], note: "The ‘expensive’ work keys off the debounced value: one log per pause." },
      { lines: [30], note: "The input uses `query`, so typing never feels laggy." }
    ]},
    output: "Typing “pad” quickly logs once: “🔎 search API for pad”, and the list narrows to “Pad thai” half a second after you stop.",
    mistakes: [
      { bad: `<input value={debounced}\n  onChange={(e) => setQuery(e.target.value)} />`, good: `<input value={query}\n  onChange={(e) => setQuery(e.target.value)} />`, why: "Binding the input to the debounced value makes typing lag and drop letters. The input must use the live value." },
      { bad: `useEffect(() => {\n  setTimeout(() => setDebounced(value), delay);\n}, [value]);`, good: `useEffect(() => {\n  const id = setTimeout(() => setDebounced(value), delay);\n  return () => clearTimeout(id);\n}, [value, delay]);`, why: "Without cleanup every key press still fires later: that's a delay, not a debounce." }
    ],
    practice: [
      { level: "B", q: "Change the delay to 300 ms.", a: "`useDebounce(query, 300)`." },
      { level: "I", q: "Show “Searching…” while the user is still typing.", a: "`const typing = query !== debouncedQuery;` and render it when true." },
      { level: "I", q: "Combine with `useFetch` to call a recipes API.", a: "Build the URL from `debouncedQuery`; pass `null` when empty (needs the `if (!url) return;` guard from HOOKS-025).", code: `const q = useDebounce(query, 400);\nconst { data } = useFetch(\n  q ? 'https://dummyjson.com/recipes/search?q=' + q : null\n);` },
      { level: "C", q: "Explain debounce vs throttle with a scroll example.", a: "Throttle runs at most every N ms while scrolling (good for scroll position). Debounce runs once after scrolling stops (good for ‘save position’)." }
    ],
    quiz: [
      { q: "What makes the timer reset on every key press?", options: ["`setInterval`", "The effect cleanup `clearTimeout`", "React batching", "The delay argument"], answer: 1, why: "Changing `value` runs cleanup first, cancelling the old timer." },
      { q: "Which value should the `<input>` display?", options: ["The debounced value", "The live state value", "Neither"], answer: 1, why: "The live value keeps typing instant." },
      { q: "Debounce means…", options: ["Run at most once per interval", "Run after changes stop for N ms", "Run immediately and cache"], answer: 1, why: "That's throttle vs debounce." }
    ],
    rev: {
      sec30: "`useDebounce(value, delay)` keeps a delayed copy of a value: an effect sets a timeout to copy it, and the cleanup clears the timeout whenever `value` changes, so only the last change after a quiet period wins. Bind inputs to the live value and run expensive work (API search) off the debounced one.",
      interview: [
        { level: "basic", q: "Why debounce a search input?", a: "To avoid sending a request on every key press; you send one after the user pauses." },
        { level: "intermediate", q: "How does the hook cancel earlier timers?", a: "The effect depends on `value`; when it changes React runs the previous cleanup, which calls `clearTimeout`." },
        { level: "advanced", q: "Debouncing a value vs debouncing a function?", a: "A value hook delays state used in render/effects. A debounced callback (e.g. lodash `debounce` in `useMemo`/ref) delays a call in an event handler. Both need cleanup on unmount." },
        { level: "tricky", q: "`useDebounce` vs `useDeferredValue`?", a: "`useDebounce` waits a fixed time and cuts network calls. `useDeferredValue` has no delay; it lets React render the slow part later, useful for heavy rendering, not for reducing requests." }
      ],
      cheat: [
        "`const d = useDebounce(value, 500)`",
        "`setTimeout` in effect, `clearTimeout` in cleanup",
        "Deps: `[value, delay]`",
        "Input shows the live value",
        "API calls / heavy work use the debounced value",
        "Debounce = after it stops; throttle = at most every N ms"
      ]
    },
    related: ["API-026", "PERF-013", "HOOKS-015", "HOOKS-025"]
  },

  "HOOKS-028": {
    tldr: "`useWindowSize()` returns the current `{ width, height }` and re-renders when the window resizes. Add the `resize` listener in an effect and **remove it in cleanup** so it doesn't leak.",
    analogy: { icon: "🪟", text: "A shop window display that rearranges itself when the window is made smaller: four products in a row on a big pane, one on a narrow one." },
    visual: { type: "cycle", title: "Resize → re-render loop", steps: [
      { label: "Mount", detail: "Effect adds `resize` listener; state starts at the current size." },
      { label: "User resizes", detail: "The browser fires `resize` many times while dragging." },
      { label: "setSize", detail: "Handler stores the new `{ width, height }`; the component re-renders." },
      { label: "Unmount", detail: "Cleanup calls `removeEventListener` with the **same** function." }
    ]},
    points: [
      "Lazy init `useState(getSize)` reads the size once on the first render.",
      "Empty deps `[]`: subscribe on mount, unsubscribe on unmount.",
      "`removeEventListener` needs the **same function reference** you added.",
      "`window` doesn't exist during SSR; guard with `typeof window !== 'undefined'` or use `useSyncExternalStore` with a server snapshot.",
      "Only layout? Prefer **CSS media queries** (no JS). Use the hook when logic needs the size, like choosing how many items to load."
    ],
    code: { file: "useWindowSize.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

function getSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useWindowSize() {
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    function onResize() {
      setSize(getSize());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}

export default function ProductGrid() {
  const { width } = useWindowSize();
  const columns = width < 600 ? 1 : width < 1000 ? 2 : 4;

  return (
    <>
      <p>{width}px wide → {columns} column(s)</p>
      <div style={{ display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: 8 }}>
        {['☕ Coffee', '🍫 Chocolate', '🧃 Juice', '🍪 Cookies'].map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>
    </>
  );
}`, walk: [
      { lines: [3, 4, 5], note: "One helper reads the size, used for the first value and every update." },
      { lines: [8], note: "Pass the function itself (lazy init), not `getSize()`." },
      { lines: [11, 12, 13, 14], note: "Each `resize` stores a new size object, so React re-renders." },
      { lines: [15], note: "Cleanup removes the exact same `onResize` function." },
      { lines: [22, 23], note: "The component turns width into a decision: how many columns." }
    ]},
    output: "On a laptop: “1280px wide → 4 column(s)”. Drag the window narrow and it switches to 2, then 1 column.",
    mistakes: [
      { bad: `useEffect(() => {\n  window.addEventListener('resize', () => setSize(getSize()));\n}, []);`, good: `useEffect(() => {\n  const onResize = () => setSize(getSize());\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []);`, why: "No cleanup: listeners pile up (twice in Strict Mode dev) and call `setSize` on unmounted components." },
      { bad: `return () => window.removeEventListener(\n  'resize', () => setSize(getSize()));`, good: `return () => window.removeEventListener('resize', onResize);`, why: "A new arrow function is a different reference, so nothing is removed." }
    ],
    practice: [
      { level: "B", q: "Return a boolean `isMobile` (width < 600) from the component.", a: "`const isMobile = useWindowSize().width < 600;`" },
      { level: "I", q: "Make the hook SSR-safe.", a: "Start with a default and read after mount.", code: `const [size, setSize] = useState({ width: 0, height: 0 });\nuseEffect(() => {\n  const onResize = () => setSize(getSize());\n  onResize(); // read real size after mount\n  window.addEventListener('resize', onResize);\n  return () => window.removeEventListener('resize', onResize);\n}, []);` },
      { level: "I", q: "Resizing fires dozens of renders per second. How do you calm it?", a: "Throttle the handler (e.g. with `requestAnimationFrame`), or debounce the returned width with `useDebounce`." },
      { level: "C", q: "Rewrite it with `useSyncExternalStore` returning only `width`.", a: "Subscribe to `resize`, snapshot `window.innerWidth` (a number, so it's stable), server snapshot `0`." }
    ],
    quiz: [
      { q: "Why must cleanup pass the same function to `removeEventListener`?", options: ["It's faster", "Removal matches by reference", "React requires it"], answer: 1, why: "A different function, even with the same code, won't match." },
      { q: "Why `useState(getSize)` and not `useState(getSize())`?", options: ["Lazy init runs once", "getSize is async", "No difference at all"], answer: 0, why: "Passing the function lets React call it only on the first render." },
      { q: "You only need to stack products on small screens. Best tool?", options: ["useWindowSize", "CSS media query / grid", "useLayoutEffect"], answer: 1, why: "Pure layout belongs in CSS: no JS, no re-renders." }
    ],
    rev: {
      sec30: "`useWindowSize` keeps `{ width, height }` in state, adds a `resize` listener in an effect with `[]` deps, and removes the same handler in cleanup. Use lazy init for the first read, guard for SSR, and throttle if resizing is heavy. For pure layout, CSS media queries are better.",
      interview: [
        { level: "basic", q: "Why does this hook need cleanup?", a: "Without removing the listener it keeps running after unmount, leaking memory and calling `setState` on a gone component." },
        { level: "intermediate", q: "What happens in Strict Mode development?", a: "React mounts, cleans up and mounts again. With correct cleanup there's still one listener; without it you'd have two." },
        { level: "advanced", q: "How would you make it SSR-safe?", a: "Start with a default (or `null`) and read `window` after mount, or use `useSyncExternalStore` with a `getServerSnapshot`." },
        { level: "tricky", q: "Why might `useSyncExternalStore` be better here?", a: "The window is an external store. It reads the size during render with no stale first value and handles concurrent rendering and hydration cleanly." }
      ],
      compare: { cols: ["", "useEffect version", "useSyncExternalStore version"], rows: [
        ["First value", "Read in lazy init", "Read via getSnapshot"],
        ["SSR", "Needs a manual guard", "getServerSnapshot"],
        ["Snapshot", "Any object", "Must be stable (primitive best)"]
      ]},
      cheat: [
        "`useState(getSize)` lazy first read",
        "`addEventListener('resize', fn)` in effect, deps `[]`",
        "Cleanup with the **same** `fn`",
        "SSR: no `window`, so guard or use a server snapshot",
        "Throttle or debounce heavy handlers",
        "Pure layout → CSS media queries"
      ]
    },
    related: ["HOOKS-005", "HOOKS-016", "HOOKS-027", "PERF-014"]
  },

  "HOOKS-029": {
    tldr: "`useAuth()` hides an auth context behind one hook. Components call `const { user, login, logout } = useAuth()` and never touch the context directly; the hook throws a clear error if the provider is missing.",
    analogy: { icon: "🎟️", text: "A festival wristband desk. Every stall just asks “show me your wristband” (useAuth); only the entrance desk (provider) hands them out." },
    visual: { type: "tree", title: "Where auth lives", root: { label: "AuthProvider", note: "holds user, login, logout", children: [
      { label: "Header", note: "useAuth() → name + Log out" },
      { label: "Shop", children: [
        { label: "ProductList", note: "no auth needed" },
        { label: "CheckoutButton", note: "useAuth() → user?" }
      ]},
      { label: "Orders", note: "useAuth() → redirect if no user" }
    ]}},
    points: [
      "Three parts: `createContext`, an `AuthProvider` component with the state, and the `useAuth` hook.",
      "React 19: render `<AuthContext value={...}>` directly as the provider (`.Provider` still works).",
      "Default the context to `null` and **throw** in `useAuth` if it's missing: fails fast with a clear message.",
      "Components only import `useAuth`; you can swap the auth library later without touching them.",
      "UI checks are for UX only. The **server** must check permissions on every request."
    ],
    code: { file: "auth.jsx", lang: "jsx", src: `import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email) {
    await new Promise((r) => setTimeout(r, 500)); // fake API call
    setUser({ name: email.split('@')[0], email });
  }
  const logout = () => setUser(null);

  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

function Header() {
  const { user, login, logout } = useAuth();
  return user ? (
    <p>Hi {user.name} 👋 <button onClick={logout}>Log out</button></p>
  ) : (
    <button onClick={() => login('ana@shop.com')}>Log in</button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}`, walk: [
      { lines: [3], note: "Default `null` means “no provider above me”." },
      { lines: [5, 6], note: "The provider owns the auth state, once, for the whole app." },
      { lines: [15, 16, 17], note: "React 19 lets the context itself be the provider." },
      { lines: [21, 22, 23, 24], note: "The hook reads the context and fails loudly if the provider is missing." },
      { lines: [28], note: "Components get a tiny, clear API." }
    ]},
    output: "A “Log in” button. After clicking (0.5s), it shows “Hi ana 👋” with a “Log out” button.",
    mistakes: [
      { bad: `export function useAuth() {\n  const [user, setUser] = useState(null);\n  return { user, setUser };\n}`, good: `export function useAuth() {\n  const ctx = useContext(AuthContext);\n  if (!ctx) throw new Error('No AuthProvider');\n  return ctx;\n}`, why: "State inside the hook gives every component its **own** user. Auth must come from one shared provider." },
      { bad: `const AuthContext = createContext({ user: null });\n// forgot <AuthProvider>: silently logged out forever`, good: `const AuthContext = createContext(null);\n// useAuth throws: "useAuth must be used inside <AuthProvider>"`, why: "A fake default hides a missing provider. Failing fast saves debugging time." }
    ],
    practice: [
      { level: "B", q: "Show “Checkout” only to logged-in users.", a: "`const { user } = useAuth(); return user ? <button>Checkout</button> : <p>Log in to buy</p>;`" },
      { level: "I", q: "Add an `isLoading` flag while `login` runs.", a: "Add `const [isLoading, setIsLoading] = useState(false)` in the provider, set it around the await, and include it in the value." },
      { level: "I", q: "Build a `RequireAuth` wrapper with React Router 7.", a: "Redirect with `<Navigate>` when there's no user.", code: `import { Navigate } from 'react-router';\nfunction RequireAuth({ children }) {\n  const { user } = useAuth();\n  return user ? children : <Navigate to=\"/login\" replace />;\n}` },
      { level: "C", q: "Every consumer re-renders whenever the provider re-renders. Why, and how do you reduce it?", a: "The value object is new each render. Wrap it in `useMemo` (and functions in `useCallback`), or let the React Compiler memoise it; split rarely-changing parts into separate contexts." }
    ],
    quiz: [
      { q: "Why does `useAuth` throw when the context is `null`?", options: ["To log users out", "To flag a missing provider early", "React requires it", "To refresh tokens"], answer: 1, why: "A clear error beats silent wrong behaviour." },
      { q: "In React 19, how can you provide a context?", options: ["`<AuthContext value={v}>`", "`AuthContext.set(v)`", "`useProvider(AuthContext)`"], answer: 0, why: "The context object can be rendered directly as the provider; `.Provider` also still works." },
      { q: "Hiding a button when `!user` makes the API secure.", options: ["True", "False"], answer: 1, why: "Client checks are UX only; the server must verify every request." }
    ],
    rev: {
      sec30: "`useAuth` wraps `useContext(AuthContext)` so components get `{ user, login, logout }` from one shared `AuthProvider`. Default the context to `null` and throw a clear error when missing. In React 19 render `<AuthContext value>` as the provider. Memoise the value for performance; enforce security on the server.",
      interview: [
        { level: "basic", q: "Why wrap `useContext(AuthContext)` in a `useAuth` hook?", a: "One import, a clean API, a helpful error when the provider is missing, and freedom to change the implementation later." },
        { level: "intermediate", q: "Why default the context to `null` instead of a fake object?", a: "So the hook can detect a missing provider and throw instead of silently acting logged-out." },
        { level: "advanced", q: "How do you stop all consumers re-rendering on every provider render?", a: "Memoise the value (`useMemo`/`useCallback` or React Compiler) and split state and actions into separate contexts if needed." },
        { level: "tricky", q: "Where should the auth token live?", a: "Ideally in an httpOnly cookie set by the server, not in context or localStorage, so scripts can't steal it. Context just holds the user info for UI." }
      ],
      cheat: [
        "`createContext(null)` + `AuthProvider` + `useAuth`",
        "React 19: `<AuthContext value={...}>` is the provider",
        "`useAuth` throws if no provider",
        "Components import only `useAuth`",
        "Memoise the value object for performance",
        "UI checks are UX; the server enforces security"
      ]
    },
    related: ["HOOKS-006", "AUTH-011", "AUTH-012", "ROUTE-017"]
  },

  "HOOKS-030": {
    tldr: "A small `useForm(initialValues, validate)` hook keeps all field values in one object, gives you one `handleChange` for every input, and runs validation on submit. Less repeated code in every form.",
    analogy: { icon: "📝", text: "A clipboard at a café counter: one sheet holds every answer (name, email, newsletter), and the barista checks it before taking the order." },
    visual: { type: "flow", title: "What happens in useForm", steps: [
      { label: "Type", detail: "Input fires `onChange`; `handleChange` reads `name` and `value` from the event." },
      { label: "Update values", detail: "`setValues(v => ({ ...v, [name]: value }))`: one object for all fields." },
      { label: "Submit", detail: "`handleSubmit(onValid)` stops the reload and runs `validate(values)`." },
      { label: "Errors?", detail: "Found errors → store them and show them under the inputs." },
      { label: "Valid", detail: "No errors → call `onValid(values)`, e.g. send to the API." }
    ]},
    points: [
      "Each input needs a `name` matching a key in `values`; that's how one handler serves all fields.",
      "Use a **functional update** and spread: `{ ...v, [name]: value }` (never mutate `values`).",
      "Checkboxes use `checked`, not `value`; handle `type === 'checkbox'`.",
      "Validation is a plain function `values → errors`, easy to unit test.",
      "For big forms use **React Hook Form**; for submit-to-server forms consider `useActionState`."
    ],
    code: { file: "useForm.jsx", lang: "jsx", src: `import { useState } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  }

  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onValid(values);
  };

  const reset = () => { setValues(initialValues); setErrors({}); };
  return { values, errors, handleChange, handleSubmit, reset };
}

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Name is required';
  if (!v.email.includes('@')) e.email = 'Enter a valid email';
  return e;
}

export default function SignupForm() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    { name: '', email: '', newsletter: false }, validate);

  return (
    <form onSubmit={handleSubmit((data) => alert('Welcome, ' + data.name))}>
      <input name="name" value={values.name} onChange={handleChange} />
      {errors.name && <small>{errors.name}</small>}
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <small>{errors.email}</small>}
      <label><input type="checkbox" name="newsletter"
        checked={values.newsletter} onChange={handleChange} /> Weekly recipes</label>
      <button>Sign up</button>
    </form>
  );
}`, walk: [
      { lines: [4, 5], note: "One object for all values, one for all errors." },
      { lines: [7, 8, 9], note: "One handler for every input: the `name` attribute picks the key. Checkboxes use `checked`." },
      { lines: [12, 13, 14, 15, 16], note: "`handleSubmit` stops the page reload, validates, and only calls `onValid` when clean." },
      { lines: [23, 24, 25, 26, 27, 28], note: "Validation is a plain function: easy to test and reuse." },
      { lines: [36, 37], note: "Inputs are controlled: `value` from the hook, `onChange` back to it. Errors show right under each field." }
    ]},
    output: "Clicking “Sign up” empty shows “Name is required” and “Enter a valid email”. Filling both shows an alert “Welcome, Ana”.",
    mistakes: [
      { bad: `function handleChange(e) {\n  values[e.target.name] = e.target.value;\n  setValues(values);\n}`, good: `function handleChange(e) {\n  const { name, value } = e.target;\n  setValues((v) => ({ ...v, [name]: value }));\n}`, why: "Mutating and passing the same object means React sees no change and skips the re-render." },
      { bad: `<input onChange={handleChange} value={values.email} />`, good: `<input name="email" onChange={handleChange} value={values.email} />`, why: "Without `name`, `handleChange` doesn't know which key to update." }
    ],
    practice: [
      { level: "B", q: "Add a `city` field.", a: "Add `city: ''` to the initial values and `<input name=\"city\" value={values.city} onChange={handleChange} />`." },
      { level: "I", q: "Clear the form after a successful submit.", a: "Return `reset` and call it inside `onValid`: `handleSubmit((d) => { save(d); reset(); })`." },
      { level: "I", q: "Validate a field when the user leaves it.", a: "Add `handleBlur(e)` that runs `validate(values)` and stores just `errors[e.target.name]`; add `onBlur={handleBlur}` to inputs." },
      { level: "C", q: "Add `isSubmitting` for an async `onValid`.", a: "Make the submit handler `async`, set `isSubmitting` true before `await onValid(values)` and false in `finally`; disable the button while true." }
    ],
    quiz: [
      { q: "How does one `handleChange` update the right field?", options: ["It reads the input's `name`", "It uses the input's id", "React tracks it automatically", "It uses the input order"], answer: 0, why: "`[name]: value` uses a computed key from the `name` attribute." },
      { q: "For a checkbox, which property holds the state?", options: ["value", "checked", "selected", "defaultValue"], answer: 1, why: "A checkbox's `value` is a constant; `checked` is the boolean." },
      { q: "Why use `setValues(v => ({ ...v, [name]: value }))`?", options: ["It's shorter", "It copies the object and uses the latest state", "It skips validation", "It's required for inputs"], answer: 1, why: "A new object tells React something changed; the updater avoids stale values." }
    ],
    rev: {
      sec30: "`useForm(initial, validate)` stores all field values in one object, updates them with a single `handleChange` keyed on each input's `name` (with `checked` for checkboxes), and `handleSubmit(onValid)` prevents reload, runs validation and calls `onValid` only when there are no errors. Big forms: React Hook Form.",
      interview: [
        { level: "basic", q: "How do you handle many inputs with one change handler?", a: "Give each input a `name` and update `{ ...values, [name]: value }`." },
        { level: "intermediate", q: "Why is `handleSubmit` a function that returns a function?", a: "So you can pass your own success callback (`onValid`) while the hook handles `preventDefault` and validation." },
        { level: "advanced", q: "When would you choose React Hook Form over a home-made hook?", a: "Large or dynamic forms, schema validation (Zod), field arrays, and performance: it uses uncontrolled inputs so typing doesn't re-render the whole form." },
        { level: "tricky", q: "Typing in one field re-renders every field. Problem?", a: "Usually fine for small forms. For large ones, split fields into memoised components or use React Hook Form's uncontrolled approach." }
      ],
      predict: [
        { code: `const [values, setValues] = useState({ name: '' });\nfunction onChange(e) {\n  values.name = e.target.value;\n  setValues(values);\n}`, answer: "The input appears frozen: typing doesn't show.", why: "Same object reference → React bails out of the re-render, so the controlled input keeps its old value." }
      ],
      cheat: [
        "One `values` object, one `errors` object",
        "Inputs need `name`; update with `[name]: value`",
        "Checkboxes: use `checked`",
        "`handleSubmit(onValid)` → preventDefault + validate",
        "Never mutate `values`; spread a new object",
        "Big forms → React Hook Form; server submits → `useActionState`"
      ]
    },
    related: ["EVT-019", "EVT-017", "EVT-022", "HOOKS-018"]
  }
};
