export default {
  "STATE-013": {
    tldr: "Never change a state array in place. Build a **new array** (with spread, `filter` or `map`) and pass it to the setter, so React sees a new value and re-renders.",
    analogy: { icon: "📝", text: "A shopping list on a whiteboard photo. You don't scribble on the old photo; you write a fresh list and take a new photo, so everyone can tell it changed." },
    visual: { type: "compare", title: "Array updates: mutate vs copy",
      left: { label: "Mutates (avoid)", tone: "bad", points: [
        "`todos.push(item)` to add",
        "`todos.splice(i, 1)` to remove",
        "`todos[i].done = true` to edit",
        "`todos.sort()` / `todos.reverse()`"
      ]},
      right: { label: "Copies (use)", tone: "good", points: [
        "Add: `[...todos, item]` or `[item, ...todos]`",
        "Remove: `todos.filter(t => t.id !== id)`",
        "Edit: `todos.map(t => t.id === id ? { ...t, done: true } : t)`",
        "Sort: `todos.toSorted(...)` or `[...todos].sort(...)`"
      ]}
    },
    points: [
      "Treat state arrays as **read-only**: always pass the setter a new array.",
      "**Add** with spread, **remove** with `filter`, **update** with `map`.",
      "Insert in the middle: `[...a.slice(0, i), item, ...a.slice(i)]`.",
      "`map` returns a new array, but changed items must be **new objects** too: `{ ...t, done: !t.done }`.",
      "Give each item a stable `id` and use it as the `key`, not the array index."
    ],
    code: { file: "Todos.jsx", lang: "jsx", src: `import { useState } from 'react';

let nextId = 3;

export default function Todos() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Call mum', done: true },
  ]);

  function add() {
    setTodos([...todos, { id: nextId++, text: 'New todo', done: false }]);
  }

  function remove(id) {
    setTodos(todos.filter(t => t.id !== id));
  }

  function toggle(id) {
    setTodos(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <>
      <button onClick={add}>Add</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              {t.text}
            </label>
            <button onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </>
  );
}`, walk: [
      { lines: [6, 7, 8, 9], note: "State is an array of todo objects, each with a stable `id`." },
      { lines: [12], note: "**Add**: spread the old items into a new array and put the new one at the end." },
      { lines: [16], note: "**Remove**: `filter` returns a new array without the clicked todo." },
      { lines: [20], note: "**Update**: `map` copies the list; only the matching todo becomes a new object." },
      { lines: [27, 28], note: "Render with `key={t.id}` so React tracks each row correctly." }
    ]},
    output: "Two todos with checkboxes. **Add** appends “New todo”, ✕ removes a row, ticking a box toggles `done`.",
    mistakes: [
      { bad: `todos.push(newTodo);\nsetTodos(todos);`, good: `setTodos([...todos, newTodo]);`, why: "`push` changes the same array. React compares by reference (`Object.is`), sees the same array and may skip the re-render." },
      { bad: `setTodos(todos.map(t => {\n  if (t.id === id) t.done = true;\n  return t;\n}));`, good: `setTodos(todos.map(t =>\n  t.id === id ? { ...t, done: true } : t\n));`, why: "The outer array is new, but you still mutated the old todo object. Copy the item you change." }
    ],
    practice: [
      { level: "B", q: "Add new todos to the **top** of the list instead of the bottom.", a: "Put the new item first in the spread.", code: `setTodos([newTodo, ...todos]);` },
      { level: "B", q: "Add a **Clear completed** button.", a: "Keep only unfinished todos with `filter`.", code: `setTodos(todos.filter(t => !t.done));` },
      { level: "I", q: "Rename a todo by id without touching the others.", a: "`map` and copy only the match.", code: `setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t));` },
      { level: "C", q: "Show the list sorted A to Z without changing the stored order.", a: "Sort a copy during render: `todos.toSorted((a, b) => a.text.localeCompare(b.text))`. The state stays untouched." }
    ],
    quiz: [
      { q: "Which line correctly removes the todo with `id` 2?", options: ["`todos.splice(1, 1)`", "`setTodos(todos.filter(t => t.id !== 2))`", "`delete todos[1]`", "`setTodos(todos.pop())`"], answer: 1, why: "`filter` returns a new array without the item. The others mutate the original (and `pop` returns an item, not an array)." },
      { q: "`setTodos(todos.map(t => t))` after `todos[0].done = true`. Is this safe?", options: ["Yes, `map` makes everything new", "No, the first todo object was still mutated", "Yes, React deep-compares arrays"], answer: 1, why: "`map` makes a new outer array but reuses the same item objects. Mutating an item breaks memoized children and history." },
      { q: "Which is a non-mutating way to sort?", options: ["`todos.sort()`", "`todos.reverse()`", "`todos.toSorted()`"], answer: 2, why: "`toSorted` (and `toReversed`, `toSpliced`) return new arrays. `sort` and `reverse` change the original." }
    ],
    rev: {
      sec30: "State arrays are read-only. Add with `[...a, x]`, remove with `filter`, update with `map` + object spread, insert with `slice`. Avoid `push`, `splice`, `sort`, `reverse` and index assignment on state. React compares by reference, so a mutated array looks unchanged.",
      interview: [
        { level: "basic", q: "How do you add an item to an array in state?", a: "Create a new array: `setItems([...items, newItem])`. Never `push` into the existing one." },
        { level: "intermediate", q: "How do you update one item in a list?", a: "`map` over the list and return a copied object for the match: `items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)`." },
        { level: "intermediate", q: "Why is `push` then `setItems(items)` a bug?", a: "It's the same array reference. React uses `Object.is` to compare, sees no change and may bail out of the render." },
        { level: "tricky", q: "`[...items]` then edit `copy[0].name`. Is state still immutable?", a: "No. Spread is a shallow copy; `copy[0]` is the same object as `items[0]`, so you mutated state. Copy the item too." },
        { level: "advanced", q: "Which array methods are safe on state?", a: "Ones that return new arrays: `map`, `filter`, `slice`, `concat`, spread, `toSorted`, `toReversed`, `toSpliced`, `with`. Mutating ones: `push`, `pop`, `shift`, `splice`, `sort`, `reverse`." }
      ],
      predict: [
        { code: `const [list, setList] = useState(['a']);\nfunction add() {\n  list.push('b');\n  setList(list);\n}\n// click add, what renders?`, answer: "Still shows only `a` (usually no re-render)", why: "Same array reference, so React skips the update. The data changed silently, which is why mutation bugs are confusing." }
      ],
      debug: [
        { code: `function removeFirst() {\n  items.shift();\n  setItems(items);\n}`, fix: `function removeFirst() {\n  setItems(items.slice(1));\n}`, why: "`shift` mutates. `slice(1)` returns a new array without the first item." }
      ],
      cheat: [
        "Add: `[...a, x]` · prepend: `[x, ...a]`",
        "Remove: `a.filter(i => i.id !== id)`",
        "Update: `a.map(i => i.id === id ? { ...i, ...changes } : i)`",
        "Insert at i: `[...a.slice(0, i), x, ...a.slice(i)]`",
        "Sort/reverse a copy: `toSorted()`, `toReversed()`",
        "Spread is shallow: copy the item you change too",
        "Key by stable `id`, not index"
      ]
    },
    related: ["STATE-014", "STATE-016", "COND-011", "HOOKS-008"]
  },

  "STATE-014": {
    tldr: "To change one field of a state object, make a **new object**: copy the old fields with spread (`...`) and overwrite the one you changed.",
    analogy: { icon: "🍕", text: "Changing a pizza order: you don't erase the ticket. You hand the kitchen a new ticket with everything copied and just the size changed." },
    visual: { type: "timeline", title: "Updating one field with spread", frames: [
      { label: "start", state: "{ name: 'Ana', email: 'ana@shop.io' }", note: "The current state object (snapshot)." },
      { label: "copy", state: "{ ...user }", note: "Spread copies every field into a brand-new object." },
      { label: "override", state: "{ ...user, email: 'ana@mail.com' }", note: "Fields after the spread win, so only `email` changes." },
      { label: "re-render", state: "user !== old user", note: "New reference, so React re-renders with the new object." }
    ]},
    points: [
      "Write `setUser({ ...user, email: value })`: spread first, then the field you change.",
      "Order matters: `{ email: value, ...user }` lets the old email **overwrite** your new one.",
      "Unlike class `setState`, the `useState` setter **replaces** the object; it does not merge. Forgotten fields disappear.",
      "One handler for many inputs: `{ ...form, [e.target.name]: e.target.value }` (computed key).",
      "Use `setUser(u => ({ ...u, age: u.age + 1 }))` when the new value depends on the old one."
    ],
    code: { file: "Profile.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'Ana',
    email: 'ana@shop.io',
    newsletter: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  }

  return (
    <form>
      <input name="name" value={user.name} onChange={handleChange} />
      <input name="email" value={user.email} onChange={handleChange} />
      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={user.newsletter}
          onChange={handleChange}
        />
        Send me deals
      </label>
      <p>{user.name} · {user.email} · {user.newsletter ? '📬' : '—'}</p>
    </form>
  );
}`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "One object holds related form fields." },
      { lines: [11], note: "Read which input changed (`name`) and its new value." },
      { lines: [12], note: "Copy all fields, then overwrite just `[name]` (a computed key)." },
      { lines: [17, 18], note: "Each input's `name` matches a key in the state object." },
      { lines: [28], note: "The preview reads the latest snapshot after each re-render." }
    ]},
    output: "Typing in either box updates the preview line; ticking the box shows 📬.",
    mistakes: [
      { bad: `user.email = e.target.value;\nsetUser(user);`, good: `setUser({ ...user, email: e.target.value });`, why: "Mutating keeps the same object reference, so React may skip the render and memoized children won't update." },
      { bad: `setUser({ email: e.target.value });`, good: `setUser({ ...user, email: e.target.value });`, why: "The hook setter replaces the whole object. Without the spread, `name` and `newsletter` are lost." },
      { bad: `setUser({ email: value, ...user });`, good: `setUser({ ...user, email: value });`, why: "Later keys win. Spreading after your change puts the old email back." }
    ],
    practice: [
      { level: "B", q: "Add a `city` field to the profile.", a: "Add `city: ''` to the initial object and an input with `name=\"city\"`; `handleChange` already works." },
      { level: "B", q: "Write a **Reset email** button that clears only the email.", a: "Spread and override one field.", code: `setUser({ ...user, email: '' });` },
      { level: "I", q: "Add a **Birthday** button that increases `age` by 1, safe even if clicked twice fast.", a: "Use the updater form.", code: `setUser(u => ({ ...u, age: u.age + 1 }));` },
      { level: "C", q: "Change two fields at once (name and email) in one update.", a: "List both after the spread.", code: `setUser({ ...user, name: 'Bo', email: 'bo@shop.io' });` }
    ],
    quiz: [
      { q: "`user` is `{ name: 'Ana', age: 30 }`. What is the state after `setUser({ age: 31 })`?", options: ["`{ name: 'Ana', age: 31 }`", "`{ age: 31 }`", "An error"], answer: 1, why: "The `useState` setter replaces the value; it doesn't merge like class `this.setState` did." },
      { q: "Which keeps the new email?", options: ["`{ email: v, ...user }`", "`{ ...user, email: v }`", "Both"], answer: 1, why: "Properties are applied left to right; the last one wins." },
      { q: "What does `[name]: value` inside an object literal do?", options: ["Creates an array", "Uses the variable `name` as the key", "Creates a key literally called \"name\""], answer: 1, why: "It's a computed property name: the key is whatever string `name` holds." }
    ],
    rev: {
      sec30: "State objects are read-only. Update with `setObj({ ...obj, field: value })`. The hook setter replaces, it doesn't merge, so always spread. Put the spread first so your change wins. Use a computed key `[e.target.name]` for one handler across many inputs, and the updater form when based on the previous value.",
      interview: [
        { level: "basic", q: "How do you update one property of an object in state?", a: "Spread the old object and override the field: `setUser({ ...user, email })`." },
        { level: "intermediate", q: "Does the `useState` setter merge objects like class `setState`?", a: "No. It replaces the whole value. Class `this.setState` shallow-merged; hooks don't, so you spread yourself." },
        { level: "intermediate", q: "How do you handle many inputs with one change handler?", a: "Give each input a `name` and use a computed key: `setForm({ ...form, [e.target.name]: e.target.value })`." },
        { level: "tricky", q: "What's wrong with `setUser({ email: v, ...user })`?", a: "The spread comes last, so the old `email` overwrites `v`. Nothing appears to change." },
        { level: "advanced", q: "When should an object be split into separate state variables?", a: "When fields change independently and aren't read together. Group fields that always change together, like a form or x/y coordinates." }
      ],
      predict: [
        { code: `const [p, setP] = useState({ x: 0, y: 0 });\nsetP({ ...p, x: 5 });\n// next render: p = ?`, answer: "`{ x: 5, y: 0 }`", why: "All fields are copied, then `x` is overridden." }
      ],
      cheat: [
        "`setObj({ ...obj, key: value })`",
        "Spread first, changes after: last key wins",
        "Hook setter replaces; it does not merge",
        "Computed key: `{ ...form, [e.target.name]: e.target.value }`",
        "Based on old value: `setObj(o => ({ ...o, n: o.n + 1 }))`",
        "Spread is shallow: nested objects need their own copy"
      ]
    },
    related: ["STATE-013", "STATE-015", "WEB-023", "EVT-010"]
  },

  "STATE-015": {
    tldr: "For nested state, copy **every level on the path** to the value you change. Untouched branches can be reused as they are. Deep paths get noisy, so flatten state or use Immer.",
    analogy: { icon: "🎵", text: "Renaming one song in a playlist inside a library: you print a new song card, a new playlist page that points to it, and a new library index. Other playlists stay as they are." },
    visual: { type: "tree", title: "Copy the path, reuse the rest", root: {
      label: "order (new copy)", note: "{ ...order }", children: [
        { label: "customer (reused)", note: "untouched: same reference" },
        { label: "shipping (new copy)", note: "{ ...order.shipping }", children: [
          { label: "city: 'Leeds' (changed)" },
          { label: "postcode (reused)" }
        ]},
        { label: "items (new array)", note: "items.map(...)", children: [
          { label: "item 1 (reused)" },
          { label: "item 2 (new copy)", note: "{ ...item, qty: 3 }" }
        ]}
      ]
    }},
    points: [
      "Spread is **shallow**: `{ ...order }` still shares `order.shipping` with the old state.",
      "Rule: every object or array **on the path** to the change gets a fresh copy; siblings off the path are reused.",
      "Nested field: `{ ...order, shipping: { ...order.shipping, city } }`.",
      "Item in a nested list: `{ ...order, items: order.items.map(i => i.id === id ? { ...i, qty } : i) }`.",
      "Too deep? **Flatten** (store items by id) or use **Immer** (`useImmer` / `produce`), which lets you write mutations on a draft safely."
    ],
    code: { file: "Order.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Order() {
  const [order, setOrder] = useState({
    customer: { name: 'Sam' },
    shipping: { city: 'York', postcode: 'YO1' },
    items: [
      { id: 1, name: 'Tea', qty: 1 },
      { id: 2, name: 'Mug', qty: 2 },
    ],
  });

  function setCity(city) {
    setOrder({ ...order, shipping: { ...order.shipping, city } });
  }

  function addOne(id) {
    setOrder({
      ...order,
      items: order.items.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    });
  }

  return (
    <div>
      <input value={order.shipping.city} onChange={e => setCity(e.target.value)} />
      {order.items.map(i => (
        <p key={i.id}>
          {i.name} × {i.qty} <button onClick={() => addOne(i.id)}>+</button>
        </p>
      ))}
    </div>
  );
}`, walk: [
      { lines: [4, 5, 6, 7, 8, 9, 10, 11], note: "Two levels deep: an object with nested objects and an array of objects." },
      { lines: [14], note: "Copy `order`, then copy `shipping` and override `city`. `customer` and `items` are reused." },
      { lines: [18, 19, 20, 21], note: "Copy `order`, make a new `items` array, and a new object only for the matching item." },
      { lines: [26], note: "The input reads the nested value; each keystroke builds a new path." }
    ]},
    output: "Editing the city updates the box; clicking + raises that item's quantity only.",
    mistakes: [
      { bad: `const copy = { ...order };\ncopy.shipping.city = city;\nsetOrder(copy);`, good: `setOrder({\n  ...order,\n  shipping: { ...order.shipping, city }\n});`, why: "`copy.shipping` is the same object as `order.shipping`. You mutated the old state through the shallow copy." },
      { bad: `const copy = structuredClone(order);\ncopy.shipping.city = city;\nsetOrder(copy);`, good: `setOrder({ ...order, shipping: { ...order.shipping, city } });`, why: "Deep cloning works but copies everything, so every memoized child sees new props. Copy only the path." }
    ],
    practice: [
      { level: "B", q: "Change `order.customer.name` to 'Alex'.", a: "Copy two levels.", code: `setOrder({ ...order, customer: { ...order.customer, name: 'Alex' } });` },
      { level: "I", q: "Remove an item from `order.items` by id.", a: "Copy `order` and `filter` the array.", code: `setOrder({ ...order, items: order.items.filter(i => i.id !== id) });` },
      { level: "I", q: "Rewrite `setCity` with Immer's `useImmer`.", a: "Mutate the draft; Immer produces the new object.", code: `import { useImmer } from 'use-immer';\nconst [order, updateOrder] = useImmer(initialOrder);\nupdateOrder(draft => { draft.shipping.city = city; });` },
      { level: "C", q: "A playlist library is `{ lists: [{ id, songs: [{ id, title }] }] }`. Rename one song.", a: "Map lists, then map songs inside the matching list.", code: `setLib({ ...lib, lists: lib.lists.map(l => l.id !== listId ? l : {\n  ...l,\n  songs: l.songs.map(s => s.id === songId ? { ...s, title } : s)\n}) });` }
    ],
    quiz: [
      { q: "After `const c = { ...order }`, is `c.shipping === order.shipping`?", options: ["Yes", "No"], answer: 0, why: "Spread copies one level. Nested objects are shared by reference." },
      { q: "You change `order.shipping.city`. Which objects need new copies?", options: ["Only `shipping`", "`order` and `shipping`", "Everything in `order`"], answer: 1, why: "Copy every object on the path from the root to the change. Siblings can be reused." },
      { q: "What does Immer let you do?", options: ["Mutate state directly with no copies", "Write mutating code on a draft and get an immutable copy back", "Skip re-renders"], answer: 1, why: "Immer records changes to a draft proxy and produces a new structurally-shared object. The real state is never mutated." }
    ],
    rev: {
      sec30: "Spread is shallow, so nested updates must copy each level on the path: `{ ...order, shipping: { ...order.shipping, city } }`, and `map` + spread for nested list items. Off-path branches are reused (structural sharing). For deep data, flatten it (normalize by id) or use Immer (`useImmer`/`produce`).",
      interview: [
        { level: "basic", q: "Why doesn't `{ ...state }` protect nested objects?", a: "Spread is a shallow copy. Nested objects keep the same reference, so changing them mutates the original state." },
        { level: "intermediate", q: "How do you update `user.address.city` immutably?", a: "`setUser({ ...user, address: { ...user.address, city } })`: copy each object on the path." },
        { level: "intermediate", q: "Why not just `structuredClone` the whole state?", a: "It works but copies everything, breaking reference equality for unchanged parts, so `memo` children re-render needlessly. It's also slower on large data." },
        { level: "advanced", q: "When would you reach for Immer?", a: "When updates go 3+ levels deep or touch many places. It lets you write `draft.a.b.c = x` and returns a new object with structural sharing. Redux Toolkit uses it internally." },
        { level: "tricky", q: "How else can you avoid deep nesting?", a: "Normalize: store entities flat, keyed by id (`itemsById`), and reference them by id. Updates become one level deep." }
      ],
      debug: [
        { code: `const next = { ...order };\nnext.items[0].qty++;\nsetOrder(next);`, fix: `setOrder({\n  ...order,\n  items: order.items.map((i, idx) =>\n    idx === 0 ? { ...i, qty: i.qty + 1 } : i)\n});`, why: "`next.items` and its objects are shared with old state, so this mutates it." }
      ],
      cheat: [
        "Spread is shallow: one level only",
        "Copy every object/array on the path to the change",
        "Reuse untouched branches (structural sharing)",
        "Nested list item: `map` + `{ ...item, field }`",
        "Deep paths: flatten state or use Immer (`useImmer`)",
        "Avoid deep-cloning whole state on each change"
      ]
    },
    related: ["STATE-014", "STATE-016", "STATE-013", "STORE-007"]
  },

  "STATE-016": {
    tldr: "React decides whether state changed by comparing references (`Object.is`). If you mutate the old object, the reference is the same, so React may skip the re-render and other tools see stale data.",
    analogy: { icon: "📦", text: "A parcel tracker checks the parcel's barcode, not what's inside. Swap the contents but keep the same box and barcode, and the tracker says “nothing new”." },
    visual: { type: "flow", title: "Why mutation is ignored", steps: [
      { label: "Mutate", detail: "`cart.items.push(tea)` changes the existing object in place." },
      { label: "Call setter", detail: "`setCart(cart)` passes the **same** reference back to React." },
      { label: "Compare", detail: "React checks `Object.is(old, next)`: it's `true`, nothing looks different." },
      { label: "Bail out", detail: "React skips the re-render. The screen still shows the old cart." },
      { label: "Fix: new object", detail: "`setCart({ ...cart, items: [...cart.items, tea] })` gives a new reference, so it renders." }
    ]},
    points: [
      "React compares state with `Object.is` (reference check), not a deep compare.",
      "Same reference = “no change”: the render may be skipped.",
      "Even if something else re-renders, mutation breaks `memo`, `useMemo`, `useEffect` deps and undo/history.",
      "New objects make change detection cheap: `prev !== next` is instant.",
      "Mutating a **fresh local** object you just created (before setting it) is fine; mutating existing state is not."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Cart() {
  const [items, setItems] = useState(['Apples']);

  function addBroken() {
    items.push('Bread');       // mutates existing state
    setItems(items);           // same reference: React bails out
  }

  function addFixed() {
    setItems([...items, 'Bread']); // new array: React re-renders
  }

  return (
    <div>
      <p>{items.join(', ')}</p>
      <button onClick={addBroken}>Add (broken)</button>
      <button onClick={addFixed}>Add (fixed)</button>
    </div>
  );
}`, walk: [
      { lines: [7, 8], note: "`push` changes the old array, then hands React the very same array." },
      { lines: [12], note: "Spread builds a new array, so `Object.is(old, next)` is false." },
      { lines: [17], note: "After **broken**, nothing changes on screen. After **fixed**, the list updates and shows the hidden mutations too." }
    ]},
    output: "Clicking **Add (broken)** shows no change. Clicking **Add (fixed)** suddenly shows several “Bread” entries: the earlier mutations were there all along.",
    mistakes: [
      { bad: `settings.theme = 'dark';\nsetSettings(settings);`, good: `setSettings({ ...settings, theme: 'dark' });`, why: "Same reference, so React treats it as unchanged." },
      { bad: `const sorted = items.sort();\nsetItems(sorted);`, good: `setItems(items.toSorted());`, why: "`sort` mutates and returns the same array. Use a copying method." }
    ],
    practice: [
      { level: "B", q: "Spot the mutation: `setScore(scores.reverse())`.", a: "`reverse` mutates. Use `scores.toReversed()` or `[...scores].reverse()`." },
      { level: "I", q: "`items.push(x); setItems([...items]);` re-renders fine. What is still wrong?", a: "The old array was changed too. Anything holding the previous snapshot (undo history, a previous render's closure) now sees the new item." },
      { level: "C", q: "Build a tiny undo: keep `history` of past todo arrays. Why does this only work without mutation?", a: "Each history entry must be a separate snapshot. If you mutate, every entry points to the same changed array, so undo restores nothing." }
    ],
    quiz: [
      { q: "How does React compare old and new state?", options: ["Deep equality", "`Object.is` (reference/primitive)", "JSON string compare"], answer: 1, why: "It's a cheap identity check; that's why you must create new objects." },
      { q: "`obj.count++; setObj(obj);` What happens?", options: ["Re-renders with new count", "Probably no re-render", "React throws an error"], answer: 1, why: "Same reference, so React bails out. No error is thrown, which makes it a silent bug." },
      { q: "Which is fine?", options: ["`const next = { ...cart }; next.total = 5; setCart(next);`", "`cart.total = 5; setCart({ ...cart });`"], answer: 0, why: "Changing a fresh copy you just made is safe. The second mutates the current state first." }
    ],
    rev: {
      sec30: "React checks for change with `Object.is`. Mutating state keeps the same reference, so React may skip the render, and memoization, effect deps and undo history break. Always produce new objects/arrays. Immutability makes change detection a cheap reference check.",
      interview: [
        { level: "basic", q: "Why must you not mutate state?", a: "React compares references with `Object.is`. A mutated object is the same reference, so React thinks nothing changed and can skip the render." },
        { level: "intermediate", q: "Besides missed renders, what else breaks with mutation?", a: "`React.memo`, `useMemo`/`useEffect` dependencies and undo history, because they all rely on reference changes and old snapshots staying intact." },
        { level: "advanced", q: "Isn't copying objects slow?", a: "Copies are shallow and unchanged branches are reused, so it's cheap. In return, change detection is an O(1) reference check instead of a deep compare." },
        { level: "tricky", q: "Mutation 'worked' in my app. Why?", a: "Something else triggered a render (another state update, a parent render), so the mutated data showed up by luck. It still breaks memoized children and history." }
      ],
      predict: [
        { code: `const [user, setUser] = useState({ n: 1 });\nfunction click() {\n  user.n = 2;\n  setUser(user);\n}\n// UI shows?`, answer: "Still `1`", why: "Same reference, so React bails out of the render." }
      ],
      compare: { cols: ["", "Mutate", "Replace"], rows: [
        ["Reference", "Same", "New"],
        ["Re-render", "Maybe skipped", "Yes"],
        ["memo / deps", "Broken", "Work"],
        ["Undo history", "Corrupted", "Safe"]
      ]},
      cheat: [
        "React compares state with `Object.is`",
        "Mutation = same reference = possible bail-out",
        "Breaks `memo`, deps arrays, undo history",
        "Always pass a new object/array to the setter",
        "Mutating a fresh copy you just created is OK",
        "Mutating methods: `push`, `splice`, `sort`, `reverse`, `obj.x =`"
      ]
    },
    related: ["STATE-013", "STATE-015", "PROPS-014", "PERF-004"]
  },

  "STATE-017": {
    tldr: "Use several `useState` calls for values that change on their own; group values into one object when they **always change together**. Avoid state that can contradict itself or duplicates other state.",
    analogy: { icon: "🎧", text: "A music app keeps volume and the current song in separate knobs, but a song's title and artist travel together on one card." },
    visual: { type: "compare", title: "Split or group?",
      left: { label: "Separate variables", tone: "neutral", points: [
        "Values change independently: `query`, `page`, `isOpen`",
        "Simple setters: `setPage(2)`",
        "No spread needed to update one value"
      ]},
      right: { label: "One object", tone: "neutral", points: [
        "Values always change together: `{ x, y }`, a form",
        "One update sets all fields at once",
        "Must spread to change one field"
      ]}
    },
    points: [
      "**Group** related values that update together (`position: { x, y }`).",
      "**Avoid contradictions**: `isSending` + `isSent` can both be true; use one `status: 'idle' | 'sending' | 'sent'`.",
      "**Avoid redundancy**: don't store `fullName` if you have `first` + `last`; calculate it.",
      "**Avoid duplication**: store `selectedId`, not a copy of the selected object.",
      "Many fields with linked rules? Consider `useReducer`."
    ],
    code: { file: "ChatBox.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function ChatBox() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing'); // 'typing' | 'sending' | 'sent'

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1000)); // fake network
    setStatus('sent');
  }

  if (status === 'sent') return <p>✅ Message sent!</p>;

  const isSending = status === 'sending'; // derived, not stored

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button disabled={isSending || text === ''}>
        {isSending ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}`, walk: [
      { lines: [4], note: "`text` changes on every keystroke, independently of status: its own variable." },
      { lines: [5], note: "One `status` string replaces two booleans that could contradict each other." },
      { lines: [9, 10, 11], note: "Moving between states is a single, clear update each time." },
      { lines: [16], note: "`isSending` is calculated from `status`, so it can never be out of sync." }
    ]},
    output: "Type a message, click **Send**: the button shows “Sending…” for a second, then “✅ Message sent!”.",
    mistakes: [
      { bad: `const [isSending, setIsSending] = useState(false);\nconst [isSent, setIsSent] = useState(false);`, good: `const [status, setStatus] = useState('typing');`, why: "Two booleans allow an impossible combo (both true). One status value can only be one thing at a time." },
      { bad: `const [items, setItems] = useState(list);\nconst [selected, setSelected] = useState(list[0]);`, good: `const [selectedId, setSelectedId] = useState(list[0].id);\nconst selected = items.find(i => i.id === selectedId);`, why: "A copied object goes stale when the item is edited. Store the id and look it up." }
    ],
    practice: [
      { level: "B", q: "A recipe page has `title`, `servings` and `isFavourite`. Split or group?", a: "Split: they change independently. Three `useState` calls are simplest." },
      { level: "I", q: "Replace `isLoading`, `isError`, `isDone` with one variable.", a: "One status string.", code: `const [status, setStatus] = useState('idle'); // 'loading' | 'error' | 'done'` },
      { level: "I", q: "You store `first`, `last` and `fullName`. What should you remove?", a: "`fullName`. Calculate `const fullName = first + ' ' + last` during render." },
      { level: "C", q: "A mouse tracker sets `x` and `y` on every move. Refactor.", a: "Group them: they always change together.", code: `const [pos, setPos] = useState({ x: 0, y: 0 });\nsetPos({ x: e.clientX, y: e.clientY });` }
    ],
    quiz: [
      { q: "Which pair is the best candidate to group into one object?", options: ["`searchText` and `isMenuOpen`", "`x` and `y` of a dragged item", "`page` and `theme`"], answer: 1, why: "Coordinates always update together. The others change independently." },
      { q: "Why is `isSending` + `isSent` risky?", options: ["Booleans are slow", "Both can be `true`, an impossible state", "React can't store booleans"], answer: 1, why: "Separate flags allow contradictory combos. A single `status` makes impossible states impossible." },
      { q: "You have `items` in state. Where should `selectedItem` live?", options: ["Copy of the object in its own state", "Store `selectedId` and find it during render", "In a global variable"], answer: 1, why: "Storing the id avoids two copies of the same data getting out of sync." }
    ],
    rev: {
      sec30: "Split state into separate `useState` calls when values change independently; group into one object when they always change together. Rules: no contradictory flags (use a `status`), no redundant values you can calculate, no duplicated objects (store ids), avoid deep nesting. Complex linked updates point to `useReducer`.",
      interview: [
        { level: "basic", q: "One object or several `useState` calls?", a: "Several when values change independently; one object when they always update together, like `{ x, y }` or a small form." },
        { level: "intermediate", q: "How do you avoid 'impossible states'?", a: "Replace related booleans with one status/enum value, e.g. `'idle' | 'loading' | 'error' | 'success'`." },
        { level: "intermediate", q: "Why store `selectedId` instead of the selected object?", a: "The object would be a duplicate. If the list item is edited, the copy goes stale. An id plus a lookup stays correct." },
        { level: "advanced", q: "When would you move from several `useState`s to `useReducer`?", a: "When updates touch several values at once or follow rules (status transitions). A reducer keeps that logic in one tested function." },
        { level: "tricky", q: "Is there a cost to many `useState` calls?", a: "Not really. Updates in the same event are batched into one render, so splitting state doesn't add renders." }
      ],
      scenario: [
        { q: "A checkout has `isPaying`, `isPaid`, `hasError`. Bugs show 'Paid' and 'Error' together. Fix?", a: "Use one `status` state (`'idle' | 'paying' | 'paid' | 'error'`) so only one can be true." }
      ],
      cheat: [
        "Independent values: separate `useState`s",
        "Always-together values: one object",
        "No contradictions: one `status` instead of many booleans",
        "No redundancy: calculate, don't store",
        "No duplication: store ids, not object copies",
        "Avoid deep nesting; flatten by id",
        "Complex rules: `useReducer`"
      ]
    },
    related: ["STATE-022", "STATE-014", "HOOKS-008", "STATE-019"]
  },

  "STATE-018": {
    tldr: "If the starting value is expensive to build, pass a **function** to `useState`: `useState(loadNotes)`. React calls it only on the first render instead of on every render.",
    analogy: { icon: "☕", text: "A coffee machine that only grinds beans the first time you switch it on, not every time you look at it." },
    visual: { type: "compare", title: "Value vs initializer function",
      left: { label: "useState(loadNotes())", tone: "bad", points: [
        "`loadNotes()` runs on **every** render",
        "Result is ignored after the first render",
        "Wasted work: parsing, filtering, storage reads"
      ]},
      right: { label: "useState(loadNotes)", tone: "good", points: [
        "React calls `loadNotes` **once**, on mount",
        "Later renders skip it entirely",
        "Must be pure and take no arguments"
      ]}
    },
    points: [
      "`useState(fn())` **calls** fn every render; `useState(fn)` **passes** it so React calls it once.",
      "Inline form: `useState(() => JSON.parse(localStorage.getItem('notes')) ?? [])`.",
      "The initializer takes **no arguments** and should be **pure**.",
      "In dev **Strict Mode**, React calls the initializer **twice** to catch impurity; production calls it once.",
      "Cheap values (`0`, `''`, `[]`) don't need it."
    ],
    code: { file: "Notes.jsx", lang: "jsx", src: `import { useState } from 'react';

function loadNotes() {
  console.log('loading notes…');
  const saved = localStorage.getItem('notes');
  return saved ? JSON.parse(saved) : [];
}

export default function Notes() {
  const [notes, setNotes] = useState(loadNotes); // no ()
  const [draft, setDraft] = useState('');

  function save() {
    const next = [...notes, { id: crypto.randomUUID(), text: draft }];
    setNotes(next);
    localStorage.setItem('notes', JSON.stringify(next));
    setDraft('');
  }

  return (
    <div>
      <input value={draft} onChange={e => setDraft(e.target.value)} />
      <button onClick={save}>Save</button>
      <ul>{notes.map(n => <li key={n.id}>{n.text}</li>)}</ul>
    </div>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7], note: "Reading and parsing storage is real work we only need once." },
      { lines: [10], note: "Pass the function itself. React runs it on the first render only." },
      { lines: [14, 15, 16], note: "Saving builds a new array and writes it back to storage." },
      { lines: [22], note: "Typing re-renders on every key, but `loadNotes` no longer runs." }
    ]},
    output: "Console shows “loading notes…” once (twice in dev Strict Mode), not on each keystroke. Notes survive a page refresh.",
    mistakes: [
      { bad: `useState(loadNotes())`, good: `useState(loadNotes)\n// or\nuseState(() => loadNotes())`, why: "With `()` you call it during every render and throw the result away." },
      { bad: `useState(() => loadNotes(userId))\n// expecting it to rerun when userId changes`, good: `<Notes key={userId} userId={userId} />`, why: "The initializer runs only on mount. To start fresh for a new user, reset with a `key`." }
    ],
    practice: [
      { level: "B", q: "Make a lazy initializer for a todo list saved under `'todos'`.", a: "Pass an arrow function.", code: `const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) ?? []);` },
      { level: "I", q: "Does `useState(createGrid)` receive any arguments from React?", a: "No. The initializer is called with no arguments. Use a closure (`() => createGrid(size)`) to pass values." },
      { level: "I", q: "Why do you see the console log twice in development?", a: "Strict Mode calls initializers twice to surface side effects. Production builds call it once." },
      { level: "C", q: "You want to store a function in state. What goes wrong with `useState(myFn)`?", a: "React treats it as an initializer and stores its return value. Wrap it: `useState(() => myFn)`." }
    ],
    quiz: [
      { q: "How often does `useState(buildList())` run `buildList`?", options: ["Once", "Every render", "Never"], answer: 1, why: "The call happens before `useState` even sees it, on every render. Only the first result is used." },
      { q: "Which is a lazy initializer?", options: ["`useState(load())`", "`useState(load)`", "`useState([load])`"], answer: 1, why: "Passing the function reference lets React call it once." },
      { q: "In dev Strict Mode the initializer runs twice. In production?", options: ["Twice", "Once", "Every render"], answer: 1, why: "The double call is a dev-only purity check." }
    ],
    rev: {
      sec30: "`useState(fn)` is a lazy initializer: React calls `fn` once on mount and ignores it afterwards. `useState(fn())` runs fn every render. Use it for expensive setup like parsing localStorage. It takes no args, must be pure, runs twice in dev Strict Mode, and never reruns when props change (use a `key` for that).",
      interview: [
        { level: "basic", q: "What is lazy initialization in `useState`?", a: "Passing a function instead of a value. React calls it only on the first render to get the initial state." },
        { level: "intermediate", q: "Difference between `useState(fn)` and `useState(fn())`?", a: "`fn` is called once by React; `fn()` is called by you on every render, with the result discarded after the first." },
        { level: "intermediate", q: "Why does my initializer log twice?", a: "Strict Mode in development calls it twice to catch side effects. Production calls it once." },
        { level: "tricky", q: "How do you store a function as state?", a: "Wrap it: `useState(() => handler)` and `setFn(() => handler)`, otherwise React calls it as an initializer/updater." },
        { level: "advanced", q: "Will the initializer rerun if its inputs (props) change?", a: "No, initial state is used only on mount. Reset the component with a `key`, or derive the value during render instead." }
      ],
      predict: [
        { code: `function init() { console.log('init'); return 0; }\nfunction C() {\n  const [n, setN] = useState(init());\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}\n// click 3 times (production)`, answer: "`init` logged 4 times", why: "`init()` is called on the first render and on each of 3 re-renders." }
      ],
      cheat: [
        "`useState(fn)` = lazy, runs once on mount",
        "`useState(fn())` = runs every render",
        "Inline: `useState(() => expensive(x))`",
        "Initializer: no args, pure",
        "Dev Strict Mode: called twice; prod: once",
        "Never reruns on prop change: use `key` to reset",
        "Store a function: `useState(() => myFn)`"
      ]
    },
    related: ["STATE-005", "STATE-020", "HOOKS-004", "STATE-004"]
  },

  "STATE-019": {
    tldr: "React waits until your event handler finishes, then applies **all** state updates in **one** re-render. Since React 18 this automatic batching also works in timeouts, promises and `await` code.",
    analogy: { icon: "🍽️", text: "A waiter takes the whole table's order before going to the kitchen, instead of running back after each dish." },
    visual: { type: "timeline", title: "Three updates, one render", frames: [
      { label: "click", state: "count = 0, total = 0, msg = ''", note: "The handler starts; the screen shows the current snapshot." },
      { label: "setCount(1)", state: "queue: [count→1]", note: "Queued, not rendered yet." },
      { label: "setTotal(9.99)", state: "queue: [count→1, total→9.99]", note: "Still queued." },
      { label: "setMsg('Added')", state: "queue: 3 updates", note: "Handler ends." },
      { label: "render", state: "count = 1, total = 9.99, msg = 'Added'", note: "One re-render applies all three. No half-updated UI." }
    ]},
    points: [
      "Updates inside one event are **queued**, then processed together in a **single render**.",
      "React 18+ batches **everywhere** (automatic batching): click handlers, `setTimeout`, promises, after `await`.",
      "Before React 18, only React event handlers were batched.",
      "Three `setN(n + 1)` calls add 1, not 3: each reads the same snapshot. Use `setN(p => p + 1)` to add 3.",
      "Need the DOM updated right now? `flushSync(() => setX(...))` from `react-dom` (rare, hurts performance)."
    ],
    code: { file: "AddToCart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function AddToCart() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState('');

  console.log('render', { count, total, msg });

  function add() {
    setCount(c => c + 1);
    setTotal(t => t + 9.99);
    setMsg('Added!');
    // still one render for all three
  }

  async function addLater() {
    await new Promise(r => setTimeout(r, 500));
    setCount(c => c + 1);
    setMsg('Added after a wait');
    // React 18+: also batched into one render
  }

  return (
    <div>
      <p>🛒 {count} items · £{total.toFixed(2)} {msg}</p>
      <button onClick={add}>Add tea</button>
      <button onClick={addLater}>Add later</button>
    </div>
  );
}`, walk: [
      { lines: [8], note: "Watch the console: one render per click, not three. (Dev Strict Mode renders twice, so you see a second, dimmed log.)" },
      { lines: [11, 12, 13], note: "Three setters in one handler are queued and flushed together." },
      { lines: [18, 19, 20], note: "After `await`, React 18+ still batches. React 17 would render twice here." },
      { lines: [26], note: "The UI never shows a half-updated cart (count changed but total not)." }
    ]},
    output: "Each click causes one render with all three values updated together. Production logs `render` once; dev Strict Mode logs it twice (second one dimmed).",
    mistakes: [
      { bad: `setCount(count + 1);\nsetCount(count + 1);\nsetCount(count + 1);`, good: `setCount(c => c + 1);\nsetCount(c => c + 1);\nsetCount(c => c + 1);`, why: "All three read the same snapshot (0), so the result is 1. Updater functions chain on the queued value: result 3." },
      { bad: `setItems([...items, x]);\nlistRef.current.lastChild.scrollIntoView();`, good: `flushSync(() => setItems([...items, x]));\nlistRef.current.lastChild.scrollIntoView();`, why: "The DOM isn't updated until after the handler. `flushSync` forces it when you truly need the new DOM immediately." }
    ],
    practice: [
      { level: "B", q: "How many renders does a click with 4 setter calls cause?", a: "One. React batches updates from the same event." },
      { level: "I", q: "`setTimeout(() => { setA(1); setB(2); })`: how many renders in React 19?", a: "One. Automatic batching (React 18+) covers timeouts and promises too." },
      { level: "I", q: "Make a **+3** button that really adds 3.", a: "Use updater functions.", code: `function addThree() {\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n  setCount(c => c + 1);\n}` },
      { level: "C", q: "In a chat, scroll to the newest message right after adding it. How?", a: "Wrap the update in `flushSync` from `react-dom`, then scroll; the DOM is updated synchronously.", code: `import { flushSync } from 'react-dom';\nflushSync(() => setMessages([...messages, msg]));\nbottomRef.current.scrollIntoView();` }
    ],
    quiz: [
      { q: "Since React 18, are updates inside `setTimeout` batched?", options: ["Yes, automatic batching", "No, only in event handlers", "Only in Strict Mode"], answer: 0, why: "With `createRoot`, all updates are batched regardless of where they come from." },
      { q: "`setN(n + 1)` three times in one click, starting at 0. Result?", options: ["3", "1", "0"], answer: 1, why: "Each call uses the snapshot `n = 0`, so they all ask for 1." },
      { q: "What opts out of batching for one update?", options: ["`useEffect`", "`flushSync` from `react-dom`", "`await`"], answer: 1, why: "`flushSync` forces React to render and update the DOM synchronously." }
    ],
    rev: {
      sec30: "Batching: React queues state updates and applies them in one render after the handler finishes. Since React 18 (`createRoot`) it's automatic everywhere: events, timeouts, promises, after `await`. That prevents half-updated UI and extra renders. Use updater functions to chain on queued values, and `flushSync` (rare) to force an immediate DOM update.",
      interview: [
        { level: "basic", q: "What is batching?", a: "React groups multiple state updates into one re-render instead of rendering after each setter." },
        { level: "intermediate", q: "What changed with automatic batching in React 18?", a: "Before, only React event handlers batched. Now updates in timeouts, promises, native handlers and after `await` are batched too." },
        { level: "intermediate", q: "Why does calling `setCount(count + 1)` three times add only 1?", a: "Batching plus snapshots: all three read the same `count`. Use `setCount(c => c + 1)` so each step uses the queued value." },
        { level: "advanced", q: "How do you opt out of batching?", a: "`flushSync(() => setState(...))` from `react-dom` renders synchronously. Use it rarely, e.g. measuring or scrolling to new DOM right away." },
        { level: "tricky", q: "Does batching mean `setState` is asynchronous?", a: "Not exactly. The setter is synchronous, but it schedules a render; the state variable in the current render never changes." }
      ],
      predict: [
        { code: `const [n, setN] = useState(0);\nfunction click() {\n  setN(n + 5);\n  setN(p => p + 1);\n}\n// after one click?`, answer: "`6`", why: "The queue is: replace with 5, then add 1 to the queued value." }
      ],
      cheat: [
        "Many updates in one event = one render",
        "React 18+: automatic batching everywhere",
        "Updates are queued; current snapshot doesn't change",
        "Chain on queued values: `setX(p => ...)`",
        "Opt out: `flushSync` from `react-dom` (rare)",
        "Prevents half-updated UI"
      ]
    },
    related: ["STATE-008", "STATE-010", "RENDER-016", "RENDER-012"]
  },

  "STATE-020": {
    tldr: "React keeps a component's state as long as the **same component type** renders at the **same spot** in the tree. Change the type or the position and state is lost. Change the `key` to reset it on purpose.",
    analogy: { icon: "💬", text: "A chat app's message box is a seat at a table. Same seat, same person: they keep their notes. Give the seat a new name card (`key`) and a new person sits down with a blank pad." },
    visual: { type: "tree", title: "Where React keeps state", root: {
      label: "App", children: [
        { label: "ContactList" },
        { label: "Chat (slot 2)", note: "state lives here, tied to position", children: [
          { label: "same type, same slot", note: "state kept (props change)" },
          { label: "different type here", note: "state destroyed" },
          { label: "new key", note: "state reset to initial" }
        ]}
      ]
    }},
    points: [
      "State belongs to a **position in the tree**, not to the JSX variable or the function.",
      "Same type at the same position = **preserved**, even if props change.",
      "Different type at that position (`<p>` instead of `<Counter>`) = **reset** for it and its whole subtree.",
      "`key` gives identity: a **new key** means a new component, so state starts fresh.",
      "Don't define components inside other components: each render makes a new type, so state resets every time."
    ],
    code: { file: "Messenger.jsx", lang: "jsx", src: `import { useState } from 'react';

const contacts = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bo' },
];

function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <div>
      <textarea
        value={text}
        placeholder={'Message ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <>
      {contacts.map(c => (
        <button key={c.id} onClick={() => setTo(c)}>{c.name}</button>
      ))}
      <Chat key={to.id} contact={to} />
    </>
  );
}`, walk: [
      { lines: [9], note: "Each `Chat` instance has its own draft text." },
      { lines: [22], note: "Choosing a contact changes `to`." },
      { lines: [28], note: "`key={to.id}` makes each contact a different `Chat`, so switching resets the draft. Without it, Ana's draft would follow you to Bo." }
    ]},
    output: "Type a message to Ana, click Bo: the box is empty. Remove the `key` and the half-typed text follows you to Bo.",
    mistakes: [
      { bad: `function Shop() {\n  function Search() {\n    const [q, setQ] = useState('');\n    ...\n  }\n  return <Search />;\n}`, good: `function Search() {\n  const [q, setQ] = useState('');\n  ...\n}\nfunction Shop() {\n  return <Search />;\n}`, why: "A nested definition creates a new component type each render, so React resets its state every time." },
      { bad: `{isLoggedIn ? <Cart items={a} /> : <Cart items={b} />}\n// expecting state to reset`, good: `{isLoggedIn\n  ? <Cart key="user" items={a} />\n  : <Cart key="guest" items={b} />}`, why: "Same type at the same position keeps state. Different keys make them separate." }
    ],
    practice: [
      { level: "B", q: "A recipe editor keeps old input when you open another recipe. Fix it in one line.", a: "Key it by the recipe id.", code: `<RecipeEditor key={recipe.id} recipe={recipe} />` },
      { level: "I", q: "`{show && <Timer />}`: does the timer keep its count after hiding and showing?", a: "No. Removing it from the tree destroys its state; showing it again mounts a fresh one." },
      { level: "I", q: "`{isFancy ? <Counter fancy /> : <Counter />}`: is state kept when `isFancy` flips?", a: "Yes. Same type at the same position; only props differ." },
      { level: "C", q: "Keep each contact's draft even after switching. How?", a: "Lift drafts into the parent: `drafts` object keyed by contact id, passed down with a setter. Or render all chats and hide inactive ones with CSS." }
    ],
    quiz: [
      { q: "What decides whether React keeps a component's state?", options: ["The variable name in JSX", "Same type at the same position (and same key)", "Whether props changed"], answer: 1, why: "State is tied to a position in the UI tree plus the type and key." },
      { q: "How do you force a form to reset when `userId` changes?", options: ["`useEffect` that clears every field", "`<Form key={userId} />`", "Re-import the component"], answer: 1, why: "A new key tells React it's a different component, so it mounts fresh with initial state." },
      { q: "`<div><Counter/></div>` switches to `<section><Counter/></section>`. Counter state?", options: ["Kept", "Reset"], answer: 1, why: "The parent type changed, so React destroys the whole subtree, including `Counter`." }
    ],
    rev: {
      sec30: "React stores state by position in the tree. Same component type in the same position keeps its state across renders, even with new props. Different type (or a different parent type) destroys the subtree's state. A `key` gives identity: change it to reset a component on purpose (e.g. `key={contact.id}`). Never define components inside components.",
      interview: [
        { level: "basic", q: "When does React reset a component's state?", a: "When it's removed from the tree, replaced by a different type at the same position, or its `key` changes." },
        { level: "intermediate", q: "How do you reset a child form when the selected item changes?", a: "Give it `key={item.id}`. React treats each id as a new instance and mounts it fresh. Cleaner than an effect that clears fields." },
        { level: "intermediate", q: "Why is defining a component inside another one a bug?", a: "Each render creates a new function, so React sees a new type at that position and resets state (and DOM, so inputs lose focus)." },
        { level: "tricky", q: "Ternary renders `<Counter />` in both branches. Is state preserved?", a: "Yes, same type at the same position. Add different `key`s or render them at different positions to separate them." },
        { level: "advanced", q: "Is state stored inside the component function?", a: "No. React holds it in the fiber tree for that position. The function just reads it via hooks each render." }
      ],
      predict: [
        { code: `{show ? <Counter /> : <p>hidden</p>}\n// count to 5, toggle show off, then on`, answer: "Counter starts at 0", why: "A `<p>` replaced `Counter` at that position, so its state was destroyed." }
      ],
      cheat: [
        "State is tied to position in the tree",
        "Same type + same position = kept",
        "Different type = subtree reset",
        "New `key` = new instance, fresh state",
        "Reset a form: `<Form key={id} />`",
        "Never define components inside components",
        "Unmounted (`{x && <C/>}` false) = state gone"
      ]
    },
    related: ["RENDER-009", "COND-012", "STATE-021", "RENDER-005"]
  },

  "STATE-021": {
    tldr: "When two components need the same data, move that state up to their **closest common parent**. The parent passes the value down as props, plus a function so children can ask for changes.",
    analogy: { icon: "🛍️", text: "A shop's search box and product shelf both need the search word. Instead of each keeping its own note, the shop manager holds it and tells both." },
    visual: { type: "tree", title: "State moves to the common parent", root: {
      label: "Shop", note: "owns query state", children: [
        { label: "SearchBar", note: "gets query + onQueryChange" },
        { label: "ProductList", note: "gets query, filters products", children: [
          { label: "ProductCard" },
          { label: "ProductCard" }
        ]}
      ]
    }},
    points: [
      "Find every component that needs the data, then their **closest common parent**: state goes there.",
      "Pass the **value** down as a prop and a **callback** (`onQueryChange`) to change it.",
      "Children become **controlled** by props: one source of truth, no out-of-sync copies.",
      "Data flows **down**, events flow **up**.",
      "Don't lift higher than needed: every update re-renders the owner's subtree. Deep passing everywhere? Consider context."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useState } from 'react';

const products = ['Apple', 'Banana', 'Cherry', 'Avocado'];

function SearchBar({ query, onQueryChange }) {
  return (
    <input
      value={query}
      placeholder="Search fruit"
      onChange={e => onQueryChange(e.target.value)}
    />
  );
}

function ProductList({ query }) {
  const shown = products.filter(p =>
    p.toLowerCase().includes(query.toLowerCase())
  );
  return <ul>{shown.map(p => <li key={p}>{p}</li>)}</ul>;
}

export default function Shop() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBar query={query} onQueryChange={setQuery} />
      <ProductList query={query} />
    </>
  );
}`, walk: [
      { lines: [23], note: "The state lives in `Shop`, the closest parent of both children." },
      { lines: [26], note: "`SearchBar` gets the value and a callback to request changes." },
      { lines: [10], note: "Typing calls the parent's setter: the event flows up." },
      { lines: [27], note: "`ProductList` receives the same `query`, so the two never disagree." },
      { lines: [16, 17, 18], note: "The filtered list is calculated during render, not stored." }
    ]},
    output: "Typing “a” in the box shows Apple, Banana, Avocado; the list updates on every key.",
    mistakes: [
      { bad: `function SearchBar() {\n  const [query, setQuery] = useState('');\n  ...\n}\nfunction ProductList() {\n  const [query, setQuery] = useState('');\n  ...\n}`, good: `function Shop() {\n  const [query, setQuery] = useState('');\n  return <>\n    <SearchBar query={query} onQueryChange={setQuery} />\n    <ProductList query={query} />\n  </>;\n}`, why: "Two separate states can't sync. One owner is the single source of truth." },
      { bad: `function SearchBar({ query }) {\n  const [q, setQ] = useState(query);\n  ...\n}`, good: `function SearchBar({ query, onQueryChange }) {\n  return <input value={query} onChange={e => onQueryChange(e.target.value)} />;\n}`, why: "Copying a prop into state freezes it at the first value; later parent updates are ignored." }
    ],
    practice: [
      { level: "B", q: "Add a **Clear** button inside `SearchBar`.", a: "Call the callback with an empty string.", code: `<button onClick={() => onQueryChange('')}>Clear</button>` },
      { level: "I", q: "Show “3 results” in `Shop` above both children.", a: "`Shop` owns `query`, so calculate the count there (or lift the filtered list up and pass it down)." },
      { level: "I", q: "Two accordion panels: only one may be open. Where does state go?", a: "In the parent: `activeIndex`. Each panel gets `isActive` and `onShow={() => setActiveIndex(i)}`." },
      { level: "C", q: "A weather page has a °C/°F toggle in the header and temps in three cards. Design the state.", a: "Lift `unit` to the page component, pass `unit` to cards and `onUnitChange` to the header toggle. Cards convert during render." }
    ],
    quiz: [
      { q: "Two sibling components need the same value. Where should the state live?", options: ["In both, kept in sync with effects", "In their closest common parent", "In a global variable"], answer: 1, why: "Lifting gives one source of truth and avoids sync effects." },
      { q: "How does a child change lifted state?", options: ["Edits the prop directly", "Calls a callback prop from the parent", "Imports the parent's setter"], answer: 1, why: "Props are read-only. The parent passes a function that calls its setter." },
      { q: "What's the cost of lifting state too high?", options: ["None", "More of the tree re-renders on each change", "State is lost"], answer: 1, why: "When the owner updates, it and its children re-render. Keep state as low as possible but as high as needed." }
    ],
    rev: {
      sec30: "Lifting state up: when siblings share data, move the state to their closest common parent and pass the value plus a change callback down. That gives one source of truth; data flows down, events flow up. Don't copy props into child state. Lift only as high as needed; for very deep sharing, use context.",
      interview: [
        { level: "basic", q: "What does 'lifting state up' mean?", a: "Moving state from children to their closest common parent so they share one value via props." },
        { level: "intermediate", q: "How does the child update the parent's state?", a: "The parent passes a callback like `onChange`; the child calls it and the parent runs its setter." },
        { level: "intermediate", q: "What's 'single source of truth'?", a: "Each piece of data has exactly one owner component. Everyone else reads it via props, so values can't drift apart." },
        { level: "advanced", q: "When is lifting the wrong choice?", a: "When it forces state far up and through many layers (prop drilling) or makes huge subtrees re-render. Then use context, composition, or a store like Zustand." },
        { level: "tricky", q: "Why not sync two child states with `useEffect`?", a: "It renders twice, can loop, and briefly shows inconsistent values. Lifting removes the duplication." }
      ],
      scenario: [
        { q: "A cart icon in the header and a product page both need the cart count. They're far apart.", a: "Lift the cart to the nearest shared parent (often `App`). If that means passing it through many layers, put it in context or a store." }
      ],
      cheat: [
        "Shared data: state goes to the closest common parent",
        "Pass value down + callback (`onX`) down",
        "Data down, events up",
        "One source of truth; no syncing effects",
        "Don't copy props into state",
        "Lift as high as needed, no higher",
        "Too deep? Context or a store"
      ]
    },
    related: ["COMM-005", "STATE-022", "COMM-006", "STATE-023"]
  },

  "STATE-022": {
    tldr: "If a value can be **calculated** from props or state, calculate it during render. Don't store it in its own state and don't sync it with `useEffect`.",
    analogy: { icon: "🧾", text: "A receipt's total. Nobody writes the total separately and updates it by hand; the till adds up the items every time it prints." },
    visual: { type: "compare", title: "Store it or calculate it?",
      left: { label: "Stored + synced", tone: "bad", points: [
        "`const [total, setTotal] = useState(0)`",
        "`useEffect(() => setTotal(sum(items)), [items])`",
        "Extra render; briefly stale total",
        "Easy to forget an update path"
      ]},
      right: { label: "Derived in render", tone: "good", points: [
        "`const total = sum(items)`",
        "Always matches `items`",
        "No extra state, no effect",
        "Expensive? wrap in `useMemo`"
      ]}
    },
    points: [
      "Ask: can I compute this from existing props/state? If yes, it is **not** state.",
      "Examples: cart total, filtered list, `fullName`, `isValid`, item count.",
      "Syncing with `useEffect` causes an **extra render** and a moment of wrong data.",
      "Don't copy a prop into state (`useState(props.price)`): it ignores later prop changes.",
      "Slow calculation? `useMemo(() => calc(items), [items])`. React Compiler (an opt-in build plugin) can memoize automatically."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Tea', price: 3.5, qty: 2 },
    { id: 2, name: 'Biscuits', price: 2, qty: 1 },
  ]);
  const [onlyMultiples, setOnlyMultiples] = useState(false);

  // derived values: calculated every render
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const shown = onlyMultiples ? items.filter(i => i.qty > 1) : items;

  function addOne(id) {
    setItems(items.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={onlyMultiples}
          onChange={e => setOnlyMultiples(e.target.checked)} />
        Only qty &gt; 1
      </label>
      {shown.map(i => (
        <p key={i.id}>{i.name} × {i.qty} <button onClick={() => addOne(i.id)}>+</button></p>
      ))}
      <strong>{count} items · £{total.toFixed(2)}</strong>
    </div>
  );
}`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "Only the real source data is state: the items and a filter switch." },
      { lines: [11, 12], note: "`total` and `count` are plain constants calculated from `items`." },
      { lines: [13], note: "The visible list is derived too, from `items` + `onlyMultiples`." },
      { lines: [16], note: "Change the source; every derived value updates on the next render automatically." }
    ]},
    output: "Shows the items and “3 items · £9.00”. Clicking + updates the line and the total together.",
    mistakes: [
      { bad: `const [total, setTotal] = useState(0);\nuseEffect(() => {\n  setTotal(items.reduce((s, i) => s + i.price, 0));\n}, [items]);`, good: `const total = items.reduce((s, i) => s + i.price, 0);`, why: "The effect adds a second render and a moment where `total` is wrong. Calculating is simpler and always right." },
      { bad: `function Price({ amount }) {\n  const [value] = useState(amount * 1.2);\n  return <p>{value}</p>;\n}`, good: `function Price({ amount }) {\n  const value = amount * 1.2;\n  return <p>{value}</p>;\n}`, why: "State is initialised once. When `amount` changes, the copied value stays stale." }
    ],
    practice: [
      { level: "B", q: "A todo list stores `todos`. Show “2 left” without new state.", a: "Count during render.", code: `const left = todos.filter(t => !t.done).length;` },
      { level: "I", q: "A signup form stores `email` and `password`. Disable Submit until valid.", a: "Derive `isValid`.", code: `const isValid = email.includes('@') && password.length >= 8;\n<button disabled={!isValid}>Sign up</button>` },
      { level: "I", q: "When is `useMemo` worth adding to a derived value?", a: "When the calculation is measurably slow (large lists, heavy maths) and its inputs rarely change. Most derived values need no memo." },
      { level: "C", q: "A playlist stores `songs` and `selectedSong` (an object). Editing a song's title doesn't update the selected panel. Fix.", a: "Store `selectedId` and derive the object.", code: `const [selectedId, setSelectedId] = useState(null);\nconst selected = songs.find(s => s.id === selectedId);` }
    ],
    quiz: [
      { q: "Which should NOT be state?", options: ["The text a user types", "The cart total computed from items", "Whether a modal is open"], answer: 1, why: "The total is fully determined by `items`, so calculate it." },
      { q: "What's wrong with syncing derived values via `useEffect`?", options: ["Effects can't call setters", "Extra render and a frame of stale data", "Nothing"], answer: 1, why: "React renders with the old value, runs the effect, then renders again." },
      { q: "`useState(props.initialQty)` then the parent changes `initialQty`. The child shows?", options: ["The new value", "The first value"], answer: 1, why: "The initial value is only read on mount. Derive from the prop, or reset with a `key` if it's meant as a starting point." }
    ],
    rev: {
      sec30: "Derived state: anything you can compute from props or other state (totals, filtered lists, validity, counts) should be a plain variable calculated during render. Storing it plus a sync `useEffect` adds renders and stale moments. Don't mirror props into state. Use `useMemo` only for genuinely expensive calculations.",
      interview: [
        { level: "basic", q: "What is derived state?", a: "A value calculated from existing props or state during render, instead of stored separately." },
        { level: "intermediate", q: "Why avoid `useEffect` to update derived values?", a: "It causes an extra render, shows stale data for a frame, and adds bug-prone sync code. A calculation in render is always consistent." },
        { level: "intermediate", q: "Is calculating on every render slow?", a: "Usually not; most calculations are tiny. If one is slow, `useMemo` caches it by dependencies, and React Compiler can do this automatically." },
        { level: "tricky", q: "When is copying a prop into state OK?", a: "When it's explicitly an initial value the user then edits (name it `initialX`). To restart from a new prop, reset with a `key`." },
        { level: "advanced", q: "How do you decide what belongs in state?", a: "Keep the minimal set: it changes over time, can't be computed from other data, and isn't passed in from a parent. Everything else is derived." }
      ],
      debug: [
        { code: `const [items, setItems] = useState([]);\nconst [count, setCount] = useState(0);\nfunction add(x) {\n  setItems([...items, x]);\n}`, fix: `const [items, setItems] = useState([]);\nconst count = items.length;\nfunction add(x) {\n  setItems([...items, x]);\n}`, why: "`count` was never updated with the items. Deriving it makes it impossible to forget." }
      ],
      cheat: [
        "Can it be calculated? Then it's not state",
        "`const total = items.reduce(...)` in render",
        "No `useEffect` to sync derived values",
        "Don't mirror props into state",
        "Store ids, derive the selected object",
        "Slow calc only: `useMemo`",
        "Keep state minimal"
      ]
    },
    related: ["STATE-017", "HOOKS-009", "STATE-021", "PERF-005"]
  },

  "STATE-023": {
    tldr: "A controlled input gets its value **from state** (`value={text}`) and reports every change through `onChange`. React state is the single source of truth for what the box shows.",
    analogy: { icon: "🎚️", text: "A smart thermostat app: the dial on screen only moves when the app's saved temperature changes. You turn it, the app saves it, the dial shows the saved number." },
    visual: { type: "cycle", title: "The controlled input loop", steps: [
      { label: "Render", detail: "The input shows `value={city}` from state." },
      { label: "User types", detail: "The browser fires `onChange` with `e.target.value`." },
      { label: "Set state", detail: "The handler calls `setCity(e.target.value)` (it can transform or reject it)." },
      { label: "Re-render", detail: "React renders again and the input shows the new state value." }
    ]},
    points: [
      "Text, textarea, select: `value` + `onChange`. Checkbox/radio: `checked` + `onChange`.",
      "`value` without `onChange` makes the box **read-only** (React warns).",
      "Because you set the value, you can **transform** it (uppercase, max length) or **block** bad input.",
      "Never pass `undefined`/`null` as `value`: React warns about switching controlled ↔ uncontrolled. Start with `''`.",
      "The same idea applies to your own components: a child driven by props (`isOpen`, `onToggle`) is controlled by its parent."
    ],
    code: { file: "WeatherSearch.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('C');
  const [alerts, setAlerts] = useState(false);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        value={city}
        maxLength={20}
        onChange={e => setCity(e.target.value.replace(/[0-9]/g, ''))}
        placeholder="City"
      />
      <select value={unit} onChange={e => setUnit(e.target.value)}>
        <option value="C">°C</option>
        <option value="F">°F</option>
      </select>
      <label>
        <input type="checkbox" checked={alerts}
          onChange={e => setAlerts(e.target.checked)} />
        Rain alerts
      </label>
      <p>Weather for {city || '…'} in °{unit} {alerts && '🔔'}</p>
    </form>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "Each input's value lives in state, starting with a defined value ('' / 'C' / false)." },
      { lines: [11, 13], note: "`value` comes from state; `onChange` writes back. Digits are stripped before saving." },
      { lines: [16], note: "A `<select>` is controlled the same way with `value` + `onChange`." },
      { lines: [21, 22], note: "Checkboxes use `checked` and `e.target.checked`, not `value`." },
      { lines: [25], note: "Any part of the UI can read the current values instantly." }
    ]},
    output: "Typing “Paris9” shows “Paris” (digits are blocked). The line below updates live with city, unit and 🔔.",
    mistakes: [
      { bad: `<input value={name} />`, good: `<input value={name} onChange={e => setName(e.target.value)} />`, why: "Without `onChange` React keeps resetting the box to `name`, so typing does nothing (and React warns)." },
      { bad: `const [name, setName] = useState();\n<input value={name} onChange={...} />`, good: `const [name, setName] = useState('');\n<input value={name} onChange={...} />`, why: "`undefined` makes it uncontrolled first, then controlled once typed: React warns. Start with an empty string." },
      { bad: `<input type="checkbox" value={agree}\n  onChange={e => setAgree(e.target.value)} />`, good: `<input type="checkbox" checked={agree}\n  onChange={e => setAgree(e.target.checked)} />`, why: "For checkboxes the on/off state is `checked`; `value` is just the string sent with the form." }
    ],
    practice: [
      { level: "B", q: "Make a controlled note title input.", a: "Pair `value` with `onChange`.", code: `const [title, setTitle] = useState('');\n<input value={title} onChange={e => setTitle(e.target.value)} />` },
      { level: "B", q: "Show “12/50 characters” under a textarea.", a: "Derive from state: `{text.length}/50`, and add `maxLength={50}`." },
      { level: "I", q: "Force a coupon code input to uppercase.", a: "Transform in the handler.", code: `<input value={code} onChange={e => setCode(e.target.value.toUpperCase())} />` },
      { level: "C", q: "Build a controlled `<Toggle>` component whose on/off is owned by its parent.", a: "Take `on` and `onChange` props; keep no state inside.", code: `function Toggle({ on, onChange }) {\n  return <button onClick={() => onChange(!on)}>{on ? 'ON' : 'OFF'}</button>;\n}` }
    ],
    quiz: [
      { q: "`<input value={text} />` with no `onChange`. What happens when you type?", options: ["Text updates normally", "Nothing changes; it's read-only", "React throws"], answer: 1, why: "React keeps the DOM value equal to `text`. You also get a console warning suggesting `onChange` or `readOnly`." },
      { q: "Which prop controls a checkbox?", options: ["`value`", "`checked`", "`selected`"], answer: 1, why: "Checkboxes and radios use `checked` and read `e.target.checked`." },
      { q: "Why start a controlled text input's state at `''` not `undefined`?", options: ["Performance", "To avoid switching from uncontrolled to controlled", "`undefined` isn't allowed in state"], answer: 1, why: "`value={undefined}` means uncontrolled; when it later gets a string React warns about the switch." }
    ],
    rev: {
      sec30: "A controlled component's value comes from React state (`value`/`checked`) and changes only through `onChange` → setter. State is the single source of truth, so you can validate, transform or block input and read values anywhere. `value` without `onChange` is read-only; never pass `undefined` as `value`. The pattern also applies to custom components driven by props.",
      interview: [
        { level: "basic", q: "What is a controlled input?", a: "An input whose value is set from state via `value` (or `checked`) and updated via `onChange`, so React owns the value." },
        { level: "intermediate", q: "Controlled vs uncontrolled?", a: "Controlled: React state holds the value. Uncontrolled: the DOM holds it and you read it with a ref or `FormData`, often with `defaultValue`." },
        { level: "intermediate", q: "Why do I get 'changing an uncontrolled input to be controlled'?", a: "The `value` started as `undefined`/`null`, then became a string. Initialise state with `''` (or `false` for checkboxes)." },
        { level: "advanced", q: "What are the trade-offs of controlled inputs?", a: "Pros: instant validation, formatting, conditional UI. Cons: a re-render per keystroke; for large forms, libraries like React Hook Form use uncontrolled inputs for speed." },
        { level: "tricky", q: "Can a custom component be 'controlled'?", a: "Yes. If its important state comes from props (`value`, `onChange`) instead of its own `useState`, its parent controls it." }
      ],
      predict: [
        { code: `const [v, setV] = useState('hi');\n<input value={v}\n  onChange={e => setV(e.target.value.slice(0, 3))} />\n// user types 'hello'`, answer: "Box shows `hel`", why: "The handler keeps only 3 characters, and the input always shows state." }
      ],
      compare: { cols: ["", "Controlled", "Uncontrolled"], rows: [
        ["Value lives in", "React state", "The DOM"],
        ["Set with", "`value` / `checked`", "`defaultValue`"],
        ["Read with", "The state variable", "Ref or `FormData`"],
        ["Live validation", "Easy", "Harder"]
      ]},
      cheat: [
        "Text/select/textarea: `value` + `onChange`",
        "Checkbox/radio: `checked` + `e.target.checked`",
        "`value` without `onChange` = read-only + warning",
        "Start with `''`/`false`, never `undefined`",
        "Transform/block input in the handler",
        "Custom components can be controlled via props"
      ]
    },
    related: ["EVT-010", "COMM-010", "STATE-012", "EVT-011"]
  }
};
