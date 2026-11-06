export default {
  "STORE-012": {
    tldr: "`configureStore` creates your Redux store in one call. It combines your slice reducers, adds the thunk middleware and dev-only safety checks, and switches on Redux DevTools for you.",
    analogy: { icon: "🏪", text: "Opening a shop from a franchise kit: the till, the alarm and the CCTV come pre-installed. You just stock the shelves (your reducers)." },
    visual: { type: "layers", title: "What configureStore builds for you", items: [
      { label: "Redux DevTools", detail: "Connected automatically: time-travel through every action in the browser extension." },
      { label: "Dev-only checks", detail: "Warns if you **mutate** state outside Immer or put non-serializable values (Dates, class instances) in it." },
      { label: "Thunk middleware", detail: "Lets you `dispatch` functions, so async logic (`createAsyncThunk`) works out of the box." },
      { label: "Root reducer", detail: "`reducer: { cart, user }` is combined for you (no manual `combineReducers`)." },
      { label: "Your slices", detail: "`cartSlice.reducer`, `userSlice.reducer`: the actual state logic." }
    ]},
    points: [
      "One store per app. Pass a `reducer` object; each key becomes a top-level state field (`state.cart`).",
      "Defaults: **thunk** + **immutability** and **serializability** checks (dev only) + **DevTools**.",
      "Add middleware with `middleware: (getDefault) => getDefault().concat(myMiddleware)`; don't replace the array or you lose the defaults.",
      "Make it available to React with `<Provider store={store}>` from `react-redux`, usually in `main.jsx`.",
      "TypeScript: `type RootState = ReturnType<typeof store.getState>` and `type AppDispatch = typeof store.dispatch`."
    ],
    code: { file: "store.js", lang: "js", src: `import { configureStore, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    added: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

const logger = (store) => (next) => (action) => {
  console.log('dispatching', action.type);
  return next(action);
};

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export const { added } = cartSlice.actions;

store.dispatch(added({ id: 1, name: 'Mug' }));
console.log(store.getState());`, walk: [
      { lines: [1], note: "Both helpers come from `@reduxjs/toolkit` (install it with `react-redux`)." },
      { lines: [18, 19, 20, 21], note: "The `reducer` object is combined for you: state will look like `{ cart: {...} }`." },
      { lines: [13, 14, 15, 16], note: "A tiny custom middleware: it sees every action before the reducer does." },
      { lines: [22, 23], note: "Keep the defaults (thunk, dev checks) and **append** yours with `.concat`." },
      { lines: [28, 29], note: "Dispatch an action and read the new state straight from the store." }
    ]},
    output: "dispatching cart/added\n{ cart: { items: [ { id: 1, name: 'Mug' } ] } }",
    mistakes: [
      { bad: `configureStore({\n  reducer,\n  middleware: () => [logger],\n});`, good: `configureStore({\n  reducer,\n  middleware: (getDefault) => getDefault().concat(logger),\n});`, why: "Returning your own array replaces the defaults: thunks stop working and the dev safety checks disappear." },
      { bad: `// legacy\nconst store = createStore(rootReducer,\n  applyMiddleware(thunk));`, good: `const store = configureStore({ reducer: rootReducer });`, why: "`createStore` is marked deprecated (still works, but legacy). `configureStore` does the same with good defaults in one line." },
      { bad: `// inside a component\nconst store = configureStore({ reducer });`, good: `// store.js (module level)\nexport const store = configureStore({ reducer });`, why: "Creating the store inside a component makes a brand-new, empty store on every render." }
    ],
    practice: [
      { level: "B", q: "Wrap your app so components can use the store.", a: "Import `Provider` from `react-redux` and wrap `<App />` in `main.jsx`.", code: `createRoot(document.getElementById('root')).render(\n  <Provider store={store}>\n    <App />\n  </Provider>\n);` },
      { level: "B", q: "Add a `user` slice next to `cart`. What does the state shape become?", a: "`reducer: { cart: cartSlice.reducer, user: userSlice.reducer }` gives `{ cart: {...}, user: {...} }`." },
      { level: "I", q: "Export TypeScript types for state and dispatch.", a: "Derive them from the store so they stay in sync.", code: `export type RootState = ReturnType<typeof store.getState>;\nexport type AppDispatch = typeof store.dispatch;` },
      { level: "C", q: "You store a `Date` object in state and see a console warning. Why, and what's the fix?", a: "The serializability check flags non-plain values (they break DevTools and persistence). Store `date.toISOString()` instead." }
    ],
    quiz: [
      { q: "Which is NOT added by `configureStore` by default?", options: ["Thunk middleware", "Redux DevTools", "A logger that prints every action", "Immutability check in dev"], answer: 2, why: "There's no logger by default. Thunk, DevTools and the dev checks are included." },
      { q: "`middleware: () => [logger]` does what?", options: ["Adds logger after the defaults", "Replaces all default middleware with just logger", "Throws an error"], answer: 1, why: "Returning a new array replaces the defaults. Use `getDefault().concat(logger)`." },
      { q: "With `reducer: { cart: cartReducer }`, where is the cart data?", options: ["`state`", "`state.cart`", "`state.reducer.cart`"], answer: 1, why: "Each key in the reducer object becomes a top-level state field." }
    ],
    rev: {
      sec30: "`configureStore({ reducer })` is the RTK way to create the single Redux store. It combines slice reducers, adds thunk, adds dev-only immutability/serializability checks, and enables DevTools. Extend middleware with `getDefaultMiddleware().concat(...)`. Provide it to React with `<Provider store={store}>`.",
      interview: [
        { level: "basic", q: "What does `configureStore` give you over `createStore`?", a: "Good defaults in one call: automatic reducer combining, thunk middleware, dev-time mutation and serializability checks, and DevTools. `createStore` is deprecated." },
        { level: "intermediate", q: "How do you add custom middleware without losing the defaults?", a: "Pass a callback: `middleware: (getDefault) => getDefault().concat(myMw)`. Returning your own array replaces the defaults." },
        { level: "intermediate", q: "Do the immutability and serializability checks run in production?", a: "No. They're dev-only, so they cost nothing in the production build." },
        { level: "advanced", q: "How do you type `RootState` and `AppDispatch` in TypeScript?", a: "Infer them from the store: `ReturnType<typeof store.getState>` and `typeof store.dispatch`. Then build typed hooks with `useSelector.withTypes<RootState>()`." },
        { level: "tricky", q: "Why might you create the store in a function instead of a module constant?", a: "For tests and SSR: each test or request needs a fresh store, so export `makeStore()` instead of one shared instance." }
      ],
      debug: [
        { code: `const store = configureStore({\n  reducer: { cart: cartSlice.reducer },\n  middleware: () => [api.middleware],\n});\n// dispatch(fetchTodos()) -> error: actions must be plain objects`, fix: `const store = configureStore({\n  reducer: { cart: cartSlice.reducer },\n  middleware: (getDefault) => getDefault().concat(api.middleware),\n});`, why: "Replacing the middleware array dropped thunk, so dispatching a function fails." }
      ],
      cheat: [
        "`configureStore({ reducer: { a, b } })` -> state `{ a, b }`",
        "Defaults: thunk + immutability check + serializability check + DevTools",
        "Checks are dev-only",
        "`middleware: (gDM) => gDM().concat(x)` to extend",
        "`<Provider store={store}>` from `react-redux`",
        "`createStore` is deprecated; use `configureStore`",
        "`RootState = ReturnType<typeof store.getState>`"
      ]
    },
    related: ["STORE-005", "STORE-011", "STORE-013"]
  },

  "STORE-013": {
    tldr: "`useSelector` reads a piece of the Redux store and subscribes the component to it. After every action, React-Redux re-runs your selector and re-renders only if the result changed (`===`).",
    analogy: { icon: "🔔", text: "Following just one team on a sports app. Thousands of scores change, but your phone only buzzes when **your** team's score is different." },
    visual: { type: "flow", title: "What happens after a dispatch", steps: [
      { label: "Action dispatched", detail: "`dispatch(added(mug))`: the reducer returns new state." },
      { label: "Store notifies", detail: "Every component using `useSelector` is told: state changed." },
      { label: "Selector re-runs", detail: "`state => state.cart.items.length` runs again with the new state." },
      { label: "Compare with ===", detail: "Old result vs new result. Same reference -> nothing happens." },
      { label: "Re-render if changed", detail: "Only components whose selected value changed draw again." }
    ]},
    points: [
      "`const count = useSelector(state => state.cart.items.length)`: pass a function of the **whole** state.",
      "Select the **smallest** value you need. Selecting `state` re-renders on every single action.",
      "Comparison is by reference (`===`). Returning a new object or array each time = re-render on **every** dispatch.",
      "Fixes: call `useSelector` several times, use `shallowEqual` as the 2nd argument, or a memoized `createSelector`.",
      "Must be inside `<Provider>`. Under the hood it uses `useSyncExternalStore`, so it's safe with concurrent rendering."
    ],
    code: { file: "Cart.jsx", lang: "jsx", src: `import { useSelector } from 'react-redux';

// Selectors: plain functions of the whole state
const selectItems = (state) => state.cart.items;
const selectCount = (state) => state.cart.items.length;

function CartBadge() {
  const count = useSelector(selectCount);
  return <span>🛒 {count}</span>;
}

function CartList() {
  const items = useSelector(selectItems);
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

function Total() {
  // ❌ new array every time -> re-renders on every dispatch
  // const prices = useSelector((s) => s.cart.items.map((i) => i.price));
  const total = useSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.price, 0)
  );
  return <p>Total: £{total}</p>;
}

export default function Cart() {
  return (
    <>
      <CartBadge />
      <CartList />
      <Total />
    </>
  );
}`, walk: [
      { lines: [4, 5], note: "Name selectors and keep them outside components so they're reusable and testable." },
      { lines: [8], note: "`CartBadge` only re-renders when the **number** of items changes." },
      { lines: [13], note: "Returns the existing array reference: stable until the reducer replaces it." },
      { lines: [24, 25], note: "`map` builds a new array each run, so `===` always fails: a needless re-render per action." },
      { lines: [26, 27, 28], note: "Returning a number (a primitive) compares cleanly with `===`." }
    ]},
    output: "🛒 2\n• Mug\n• Tea\nTotal: £14\n(rendered inside <Provider store={store}>)",
    mistakes: [
      { bad: `const { items, user } = useSelector((s) => ({\n  items: s.cart.items,\n  user: s.user,\n}));`, good: `const items = useSelector((s) => s.cart.items);\nconst user = useSelector((s) => s.user);`, why: "A new object literal fails `===` every time, so the component re-renders on every action (React-Redux also warns in dev)." },
      { bad: `const state = useSelector((s) => s);\nreturn <p>{state.cart.items.length}</p>;`, good: `const count = useSelector((s) => s.cart.items.length);`, why: "Selecting the whole state subscribes to everything; any action anywhere re-renders this component." }
    ],
    practice: [
      { level: "B", q: "Show the logged-in user's name from `state.user.name`.", a: "Select just the string.", code: `const name = useSelector((s) => s.user.name);` },
      { level: "I", q: "You need `items` and `discount` together. Write it without extra re-renders.", a: "Two separate `useSelector` calls, or one with `shallowEqual`.", code: `import { useSelector, shallowEqual } from 'react-redux';\nconst { items, discount } = useSelector(\n  (s) => ({ items: s.cart.items, discount: s.cart.discount }),\n  shallowEqual\n);` },
      { level: "I", q: "Select only the done todos without creating a new array every time.", a: "Use a memoized selector from RTK.", code: `import { createSelector } from '@reduxjs/toolkit';\nconst selectDone = createSelector(\n  [(s) => s.todos],\n  (todos) => todos.filter((t) => t.done)\n);` },
      { level: "C", q: "Why is Redux better than Context here: 50 components each read a different field of a big object?", a: "Each `useSelector` subscribes to its own slice and bails out if unchanged. A Context value change re-renders **every** consumer." }
    ],
    quiz: [
      { q: "When does a component with `useSelector` re-render?", options: ["After every dispatched action", "When its selected value changes by `===`", "Only when its props change"], answer: 1, why: "The selector runs on every action, but the component re-renders only if the result is a different reference." },
      { q: "`useSelector(s => s.todos.filter(t => t.done))` problem?", options: ["None", "`filter` returns a new array, so it re-renders on every action", "It mutates state"], answer: 1, why: "New array = new reference each time. Memoize with `createSelector`." },
      { q: "Which hook does React-Redux use internally to subscribe safely?", options: ["useEffect", "useSyncExternalStore", "useContext only"], answer: 1, why: "`useSyncExternalStore` keeps external stores consistent with concurrent rendering." }
    ],
    rev: {
      sec30: "`useSelector(selector)` reads from the Redux store and subscribes. After each action the selector re-runs; if the result is `!==` the previous one, the component re-renders. Select small values, avoid returning new objects/arrays, and use `shallowEqual` or `createSelector` when you must derive.",
      interview: [
        { level: "basic", q: "What does `useSelector` do?", a: "It reads a value from the Redux store and re-renders the component when that value changes." },
        { level: "intermediate", q: "How does it decide whether to re-render?", a: "It runs the selector after every dispatch and compares the new result to the old one with strict `===`. Different reference means re-render." },
        { level: "intermediate", q: "Why is returning an object from a selector a problem?", a: "A new object literal is a new reference every time, so it re-renders on every action. Split into several calls or pass `shallowEqual`." },
        { level: "advanced", q: "When do you need `createSelector`?", a: "When the selector derives a new array/object (filter, map, sort). It memoizes on its inputs and returns the same reference until they change." },
        { level: "tricky", q: "Is `useSelector` faster than `useContext` for a big shared object?", a: "Usually yes. Each component bails out unless **its** slice changed; with Context every consumer re-renders when the value changes." }
      ],
      predict: [
        { code: `const items = useSelector((s) => s.cart.items);\n// another component dispatches user/renamed\n// (cart is untouched)`, answer: "No re-render", why: "The reducer didn't touch `cart`, so `s.cart.items` is the same reference." }
      ],
      cheat: [
        "`useSelector(state => state.x.y)`",
        "Re-runs after every action; re-renders only if result `!==` old",
        "Select the smallest value you need",
        "New object/array each run = re-render each action",
        "Fix with multiple calls, `shallowEqual`, or `createSelector`",
        "Needs `<Provider store>` above it",
        "TS: `useSelector.withTypes<RootState>()`"
      ]
    },
    related: ["STORE-009", "STORE-014", "HOOKS-016", "COMM-008"]
  },

  "STORE-014": {
    tldr: "`useDispatch` gives a component the store's `dispatch` function. Call it with an action (usually from a slice's action creator) in an event handler to ask the store to change.",
    analogy: { icon: "📮", text: "A post box in every room. Any room can drop in a request slip (\"add mug to cart\"); the shop's office (reducer) reads it and updates the records." },
    visual: { type: "flow", title: "From click to new state", steps: [
      { label: "User clicks", detail: "**Add to cart** button on a product card." },
      { label: "dispatch(added(mug))", detail: "The action creator builds `{ type: 'cart/added', payload: mug }`." },
      { label: "Reducer runs", detail: "`cartSlice` reducer adds the mug and returns new state." },
      { label: "Subscribers update", detail: "Components whose `useSelector` result changed re-render (badge shows 1)." }
    ]},
    points: [
      "`const dispatch = useDispatch()` at the top level; then `dispatch(someAction(payload))` in handlers.",
      "The `dispatch` reference is **stable**: safe to put in effect deps; it never causes a re-render by itself.",
      "Dispatch in **event handlers** (clicks, submits) or effects, never during render.",
      "Dispatching a thunk returns a promise; `await dispatch(fetchX()).unwrap()` gives the result or throws.",
      "TS: create `useAppDispatch = useDispatch.withTypes<AppDispatch>()` so thunks are typed."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useDispatch, useSelector } from 'react-redux';
import { added, removed } from './cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <article>
      <h3>{product.name}</h3>
      <button onClick={() => dispatch(added(product))}>
        Add to cart
      </button>
    </article>
  );
}

function CartRow({ item }) {
  const dispatch = useDispatch();
  return (
    <li>
      {item.name}
      <button onClick={() => dispatch(removed(item.id))}>✕</button>
    </li>
  );
}

export default function Shop({ products }) {
  const items = useSelector((s) => s.cart.items);
  return (
    <>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
      <ul>{items.map((i) => <CartRow key={i.id} item={i} />)}</ul>
    </>
  );
}`, walk: [
      { lines: [2], note: "Action creators generated by `createSlice`; no hand-written `{ type }` strings." },
      { lines: [5], note: "Grab `dispatch` once per component. No props needed: any component can dispatch." },
      { lines: [10], note: "On click, build the action and send it. The arrow function delays the call until the click." },
      { lines: [22], note: "The payload can be anything serializable: here just the item id." },
      { lines: [28], note: "The list reads the store; it re-renders when the reducer returns a new `items` array." }
    ]},
    output: "Clicking “Add to cart” on Mug adds “Mug ✕” to the list. Clicking ✕ removes it.",
    mistakes: [
      { bad: `<button onClick={dispatch(added(product))}>`, good: `<button onClick={() => dispatch(added(product))}>`, why: "Without the arrow, `dispatch` runs during render (every render!), not on click." },
      { bad: `dispatch(added);`, good: `dispatch(added(product));`, why: "`added` is the action **creator**. Call it to get the action object." },
      { bad: `const { items } = useSelector((s) => s.cart);\nitems.push(product); // "update"`, good: `dispatch(added(product));`, why: "Never mutate store data in a component. Only reducers change state, via dispatched actions." }
    ],
    practice: [
      { level: "B", q: "Add a **Clear cart** button.", a: "Add a `cleared` reducer in the slice, then dispatch it.", code: `<button onClick={() => dispatch(cleared())}>Clear cart</button>` },
      { level: "I", q: "Load todos on mount with a thunk.", a: "Dispatch inside an effect; `dispatch` is stable so it's a safe dependency.", code: `useEffect(() => {\n  dispatch(fetchTodos());\n}, [dispatch]);` },
      { level: "I", q: "Show an alert if saving fails.", a: "`unwrap()` turns the thunk result into a normal promise that throws on rejection.", code: `try {\n  await dispatch(saveNote(note)).unwrap();\n} catch (err) {\n  alert('Save failed: ' + err);\n}` },
      { level: "C", q: "Why is passing `dispatch` down as a prop usually unnecessary?", a: "Any component under `<Provider>` can call `useDispatch()` itself, so there's no prop drilling." }
    ],
    quiz: [
      { q: "What does `dispatch(added(mug))` send?", options: ["The function `added`", "A plain action object `{ type, payload }`", "The new state"], answer: 1, why: "The action creator returns an action object; `dispatch` sends it to the reducers." },
      { q: "Does the `dispatch` function change between renders?", options: ["Yes, every render", "No, it's stable", "Only when state changes"], answer: 1, why: "It's the store's dispatch, which never changes." },
      { q: "What does `dispatch(fetchTodos())` return for a `createAsyncThunk`?", options: ["undefined", "A promise with `.unwrap()` and `.abort()`", "The todos array"], answer: 1, why: "Thunk dispatches return a promise of the final action, with `unwrap` and `abort` helpers." }
    ],
    rev: {
      sec30: "`useDispatch()` returns the store's stable `dispatch`. Call `dispatch(actionCreator(payload))` in handlers or effects, never during render. For thunks it returns a promise; `.unwrap()` gives the value or throws. In TS use `useDispatch.withTypes<AppDispatch>()`.",
      interview: [
        { level: "basic", q: "How do you update Redux state from a component?", a: "Get `dispatch` with `useDispatch()` and dispatch an action, usually from a slice action creator, in an event handler." },
        { level: "intermediate", q: "Should `dispatch` be in a `useEffect` dependency array?", a: "Yes, it's harmless: it's stable so it never re-triggers the effect, and it keeps the lint rule happy." },
        { level: "intermediate", q: "What's `unwrap()` for?", a: "A thunk dispatch always resolves with an action. `unwrap()` returns the fulfilled payload or throws the error, so you can use try/catch." },
        { level: "advanced", q: "Why use a typed `useAppDispatch` in TypeScript?", a: "The plain `Dispatch` type doesn't know about thunks, so dispatching one is a type error. `useDispatch.withTypes<AppDispatch>()` fixes that." },
        { level: "tricky", q: "Does calling `dispatch` re-render the component that called it?", a: "Not by itself. Only components whose selected values changed re-render, which may or may not include the caller." }
      ],
      debug: [
        { code: `function Note({ note }) {\n  const dispatch = useDispatch();\n  dispatch(viewed(note.id));\n  return <p>{note.text}</p>;\n}`, fix: `function Note({ note }) {\n  const dispatch = useDispatch();\n  useEffect(() => {\n    dispatch(viewed(note.id));\n  }, [dispatch, note.id]);\n  return <p>{note.text}</p>;\n}`, why: "Dispatching during render updates the store mid-render, which can loop. Move it to an effect or handler (in dev Strict Mode the effect runs twice)." }
      ],
      cheat: [
        "`const dispatch = useDispatch()`",
        "`dispatch(added(item))` in handlers or effects",
        "Never dispatch during render",
        "`dispatch` is stable: safe in deps",
        "Thunk: `await dispatch(x()).unwrap()`",
        "TS: `useDispatch.withTypes<AppDispatch>()`"
      ]
    },
    related: ["STORE-008", "STORE-013", "STORE-015"]
  },

  "STORE-015": {
    tldr: "`createAsyncThunk` wraps an async function (like a fetch) and dispatches **pending**, **fulfilled** or **rejected** actions for you. Your slice handles them in `extraReducers` to track loading and errors.",
    analogy: { icon: "🍕", text: "Ordering pizza: the app shows **Order placed** (pending), then **Delivered** (fulfilled) or **Cancelled** (rejected). You only wrote the order; the status updates come automatically." },
    visual: { type: "timeline", title: "Lifecycle of dispatch(fetchRecipes('pasta'))", frames: [
      { label: "before", state: "status: 'idle', list: []", note: "Nothing requested yet." },
      { label: "pending", state: "status: 'loading'", note: "`recipes/fetch/pending` dispatched instantly; show a spinner." },
      { label: "await fetch", state: "status: 'loading'", note: "Your payload creator awaits the API." },
      { label: "fulfilled", state: "status: 'succeeded', list: [12 recipes]", note: "Return value becomes `action.payload`." },
      { label: "or rejected", state: "status: 'failed', error: 'HTTP 500'", note: "Thrown error or `rejectWithValue(...)`." }
    ]},
    points: [
      "`createAsyncThunk('recipes/fetch', async (arg, thunkAPI) => {...})`: the string is the action type prefix.",
      "It auto-dispatches `pending`, then `fulfilled` (return value) or `rejected` (thrown error).",
      "Handle them in the slice's `extraReducers` with `builder.addCase(thunk.fulfilled, ...)`.",
      "`thunkAPI` gives `rejectWithValue`, `getState`, `dispatch` and an AbortController `signal`.",
      "For plain server caching, prefer **RTK Query** or **TanStack Query**; use thunks for custom async workflows."
    ],
    code: { file: "recipesSlice.js", lang: "js", src: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetch',
  async (query, { rejectWithValue, signal }) => {
    const res = await fetch(\`/api/recipes?q=\${query}\`, { signal });
    if (!res.ok) return rejectWithValue(\`HTTP \${res.status}\`);
    return res.json(); // becomes action.payload
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default recipesSlice.reducer;

// In a component:
// const dispatch = useDispatch();
// useEffect(() => {
//   const promise = dispatch(fetchRecipes('pasta'));
//   return () => promise.abort();
// }, [dispatch]);`, walk: [
      { lines: [3, 4], note: "The type prefix: RTK creates `recipes/fetch/pending`, `/fulfilled` and `/rejected`." },
      { lines: [5, 6], note: "The payload creator gets your argument plus `thunkAPI`. Pass `signal` to fetch so it can be cancelled." },
      { lines: [7, 8], note: "`fetch` doesn't throw on 404/500, so reject explicitly. The return value becomes the fulfilled payload." },
      { lines: [16, 17, 18, 19, 20, 21], note: "`extraReducers` listens to actions defined **outside** this slice, like the thunk's." },
      { lines: [26, 27, 28], note: "`action.payload` holds your `rejectWithValue` value; `action.error` holds a thrown error." },
      { lines: [37, 38, 39], note: "The dispatch returns a promise with `.abort()`: cancel when the component unmounts." }
    ]},
    output: "Spinner while loading, then a list of pasta recipes. On a server error the UI shows “HTTP 500”.",
    mistakes: [
      { bad: `extraReducers: {\n  [fetchRecipes.fulfilled]: (state, a) => {...}\n}`, good: `extraReducers: (builder) => {\n  builder.addCase(fetchRecipes.fulfilled, (state, a) => {...});\n}`, why: "RTK 2 removed the object form of `extraReducers` (it throws). Use the builder callback." },
      { bad: `async () => {\n  const res = await fetch(url);\n  return res.json(); // 500 becomes 'fulfilled'\n}`, good: `async (_, { rejectWithValue }) => {\n  const res = await fetch(url);\n  if (!res.ok) return rejectWithValue(res.status);\n  return res.json();\n}`, why: "`fetch` only rejects on network failure. Check `res.ok` or HTTP errors land in `fulfilled`." }
    ],
    practice: [
      { level: "B", q: "Show a spinner while recipes load.", a: "Select `status` and render conditionally.", code: `const status = useSelector((s) => s.recipes.status);\nif (status === 'loading') return <p>Loading…</p>;` },
      { level: "I", q: "Write `addNote` that POSTs a note and pushes the saved note into state.", a: "Create the thunk and handle `fulfilled`.", code: `export const addNote = createAsyncThunk('notes/add', async (text) => {\n  const res = await fetch('/api/notes', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ text }),\n  });\n  if (!res.ok) throw new Error('Save failed');\n  return res.json();\n});\n// builder.addCase(addNote.fulfilled, (s, a) => { s.items.push(a.payload); });` },
      { level: "I", q: "Skip fetching if recipes are already loaded.", a: "Use the `condition` option; returning `false` cancels before `pending`.", code: `createAsyncThunk('recipes/fetch', fetcher, {\n  condition: (_, { getState }) => getState().recipes.status !== 'succeeded',\n});` },
      { level: "C", q: "In dev Strict Mode you see a `rejected` with `AbortError` on first load. Why?", a: "Strict Mode mounts, unmounts (cleanup calls `abort()`), and mounts again in dev only. The first request is aborted; the second succeeds." }
    ],
    quiz: [
      { q: "Which actions does `createAsyncThunk('todos/load', fn)` dispatch?", options: ["`todos/load` only", "`todos/load/pending`, then `/fulfilled` or `/rejected`", "`todos/loading` and `todos/done`"], answer: 1, why: "It dispatches pending first, then one of fulfilled or rejected." },
      { q: "Where do you handle those actions in a slice?", options: ["`reducers`", "`extraReducers`", "`middleware`"], answer: 1, why: "`extraReducers` responds to actions created outside the slice." },
      { q: "The API returns 500 and you just `return res.json()`. Which action fires?", options: ["rejected", "fulfilled", "none"], answer: 1, why: "`fetch` resolves on HTTP errors. You must check `res.ok` and reject." }
    ],
    rev: {
      sec30: "`createAsyncThunk(type, payloadCreator)` runs async logic and dispatches `pending`, then `fulfilled` with the return value or `rejected` with the error. Handle them in `extraReducers` via `builder.addCase`. Use `rejectWithValue` for custom errors, `signal` + `.abort()` for cancellation, `condition` to skip.",
      interview: [
        { level: "basic", q: "Why can't a reducer fetch data?", a: "Reducers must be pure and synchronous. Async work goes in thunks (or RTK Query), which dispatch actions when results arrive." },
        { level: "intermediate", q: "What three actions does `createAsyncThunk` produce?", a: "`pending` when it starts, then `fulfilled` with the returned value or `rejected` with the error." },
        { level: "intermediate", q: "Difference between `action.payload` and `action.error` in `rejected`?", a: "`payload` is what you passed to `rejectWithValue`; `error` is a serialized thrown error. Use `rejectWithValue` for API error bodies." },
        { level: "advanced", q: "How do you cancel a thunk?", a: "Keep the promise from `dispatch(thunk())` and call `.abort()`. Pass `thunkAPI.signal` to `fetch` so the request itself stops." },
        { level: "tricky", q: "When would you NOT use `createAsyncThunk` for data fetching?", a: "For standard fetch-and-cache, RTK Query or TanStack Query give caching, dedupe and refetching for free. Thunks fit custom multi-step workflows." }
      ],
      predict: [
        { code: `const r = await dispatch(fetchRecipes('x'));\nconsole.log(r.type);\n// the API returned 404 and the thunk used rejectWithValue`, answer: "recipes/fetch/rejected", why: "Without `unwrap()`, the promise always resolves with the final action, even on failure." }
      ],
      cheat: [
        "`createAsyncThunk('slice/name', async (arg, thunkAPI) => ...)`",
        "Dispatches pending -> fulfilled | rejected",
        "Handle in `extraReducers: b => b.addCase(t.fulfilled, ...)`",
        "`rejectWithValue(x)` -> `action.payload` on rejected",
        "Check `res.ok`: fetch doesn't throw on 500",
        "`dispatch(t()).abort()` + `thunkAPI.signal` to cancel",
        "`.unwrap()` to get value or throw"
      ]
    },
    related: ["STORE-014", "STORE-016", "API-014", "API-023"]
  },

  "STORE-016": {
    tldr: "RTK Query is Redux Toolkit's built-in data fetching and caching tool. You describe endpoints once; it generates hooks like `useGetNotesQuery` that handle loading, caching, dedupe and refetching.",
    analogy: { icon: "📚", text: "A library desk. Ask for a book and they fetch it once; the next reader gets the same copy instantly. When a new edition arrives (a mutation), the old copy is marked out of date and swapped." },
    visual: { type: "flow", title: "Query, mutate, refetch with tags", steps: [
      { label: "useGetNotesQuery()", detail: "Fetches `/api/notes` once; other components using it share the cached result." },
      { label: "providesTags: ['Note']", detail: "The cached data is labelled **Note**." },
      { label: "addNote('Buy milk')", detail: "A mutation POSTs the new note." },
      { label: "invalidatesTags: ['Note']", detail: "Every cache entry labelled **Note** is now stale." },
      { label: "Auto refetch", detail: "Mounted queries with that tag refetch; the list shows the new note." }
    ]},
    points: [
      "`createApi({ reducerPath, baseQuery, endpoints })` defines your API; import from `@reduxjs/toolkit/query/react` for hooks.",
      "`build.query` for reads, `build.mutation` for writes. Hooks are auto-named: `useGetNotesQuery`, `useAddNoteMutation`.",
      "Add `api.reducer` and `api.middleware` to `configureStore`; the middleware runs the caching.",
      "**Tags** link them: queries `providesTags`, mutations `invalidatesTags` -> matching queries refetch.",
      "`isLoading` = first load with no data; `isFetching` = any request in flight (including background refetch).",
      "Unused data is removed after 60s by default (`keepUnusedDataFor`). Same idea as TanStack Query, but lives in Redux."
    ],
    code: { file: "notesApi.jsx", lang: "jsx", src: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Note'],
  endpoints: (build) => ({
    getNotes: build.query({
      query: () => 'notes',
      providesTags: ['Note'],
    }),
    addNote: build.mutation({
      query: (text) => ({ url: 'notes', method: 'POST', body: { text } }),
      invalidatesTags: ['Note'],
    }),
  }),
});

export const { useGetNotesQuery, useAddNoteMutation } = notesApi;

// store.js
// reducer: { [notesApi.reducerPath]: notesApi.reducer },
// middleware: (gDM) => gDM().concat(notesApi.middleware),

export function Notes() {
  const { data: notes = [], isLoading, error } = useGetNotesQuery();
  const [addNote, { isLoading: saving }] = useAddNoteMutation();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Could not load notes</p>;

  return (
    <>
      <button disabled={saving} onClick={() => addNote('Buy milk')}>
        Add note
      </button>
      <ul>
        {notes.map((n) => <li key={n.id}>{n.text}</li>)}
      </ul>
    </>
  );
}`, walk: [
      { lines: [3, 4, 5], note: "One API slice per backend. `fetchBaseQuery` is a small `fetch` wrapper with a base URL." },
      { lines: [8, 9, 10], note: "A read endpoint. Its cached result is tagged `Note`." },
      { lines: [12, 13, 14], note: "A write endpoint. On success it invalidates `Note`, so `getNotes` refetches." },
      { lines: [19], note: "Hooks are generated from the endpoint names." },
      { lines: [22, 23], note: "Register the cache reducer and middleware, or nothing gets cached or refetched." },
      { lines: [26, 27], note: "Query hook gives `{ data, isLoading, error }`; mutation hook gives `[trigger, result]`." }
    ]},
    output: "“Loading…”, then the notes list. Clicking “Add note” disables the button while saving, then the list refetches and shows “Buy milk”.",
    mistakes: [
      { bad: `configureStore({\n  reducer: { [notesApi.reducerPath]: notesApi.reducer },\n});`, good: `configureStore({\n  reducer: { [notesApi.reducerPath]: notesApi.reducer },\n  middleware: (gDM) => gDM().concat(notesApi.middleware),\n});`, why: "Without the middleware, caching lifetimes, invalidation and refetching don't work (RTK warns in dev)." },
      { bad: `const { data } = useGetNotesQuery();\nuseEffect(() => {\n  dispatch(setNotes(data)); // copy into a slice\n}, [data]);`, good: `const { data } = useGetNotesQuery();\n// use data directly`, why: "Copying server data into another slice creates two sources of truth that drift apart. The RTKQ cache already is the store." }
    ],
    practice: [
      { level: "B", q: "Add a `getNote(id)` endpoint and use it.", a: "The hook argument is passed to `query`.", code: `getNote: build.query({ query: (id) => \`notes/\${id}\` }),\n// const { data } = useGetNoteQuery(noteId);` },
      { level: "I", q: "Don't fetch until the user picks a note.", a: "Pass `skip` (or `skipToken`).", code: `const { data } = useGetNoteQuery(id, { skip: !id });` },
      { level: "I", q: "Await a mutation and show an error message if it fails.", a: "Call `.unwrap()` on the trigger result.", code: `try {\n  await addNote(text).unwrap();\n} catch (e) {\n  setError('Save failed');\n}` },
      { level: "C", q: "Deleting note 7 refetches **every** note query. Make it more precise.", a: "Use id tags: `providesTags: (r, e, id) => [{ type: 'Note', id }]` and `invalidatesTags: (r, e, id) => [{ type: 'Note', id }]`." }
    ],
    quiz: [
      { q: "How does RTK Query know to refetch `getNotes` after `addNote`?", options: ["It refetches everything after any mutation", "`addNote` invalidates a tag that `getNotes` provides", "You must call `refetch()` manually"], answer: 1, why: "Tags connect mutations to the queries they make stale." },
      { q: "Two components call `useGetNotesQuery()` at the same time. How many requests?", options: ["Two", "One, shared", "Zero until a button is clicked"], answer: 1, why: "Identical queries are deduplicated and share one cache entry." },
      { q: "Data is on screen and a background refetch starts. Which flag is true?", options: ["`isLoading`", "`isFetching`", "`isError`"], answer: 1, why: "`isLoading` is only the first load without data; `isFetching` covers any in-flight request." }
    ],
    rev: {
      sec30: "RTK Query (`createApi`) is RTK's server-state cache. Define query and mutation endpoints; it generates hooks, dedupes requests, caches results (60s after last use by default) and refetches via tags: queries `providesTags`, mutations `invalidatesTags`. Add its reducer and middleware to the store.",
      interview: [
        { level: "basic", q: "What problem does RTK Query solve?", a: "It removes hand-written fetch thunks and loading/error reducers. You get caching, dedupe, refetching and generated hooks from endpoint definitions." },
        { level: "intermediate", q: "How does cache invalidation work in RTK Query?", a: "Queries declare `providesTags`, mutations declare `invalidatesTags`. When a mutation succeeds, any query with a matching tag is marked stale and refetched if it's in use." },
        { level: "intermediate", q: "`isLoading` vs `isFetching`?", a: "`isLoading` is true only for the first fetch with no data yet. `isFetching` is true for any request, including background refetches." },
        { level: "advanced", q: "RTK Query or TanStack Query?", a: "Both solve server state. RTK Query fits if the app already uses Redux (one store, DevTools). TanStack Query is standalone, with no Redux dependency." },
        { level: "tricky", q: "Why is dispatching query results into a normal slice an anti-pattern?", a: "It duplicates server data. The copy won't update on refetch or invalidation, so the UI can show stale data." }
      ],
      compare: { cols: ["", "createAsyncThunk", "RTK Query"], rows: [
        ["Loading/error state", "You write it", "Built in"],
        ["Caching & dedupe", "No", "Yes"],
        ["Refetch after mutation", "Manual", "Tags"],
        ["Best for", "Custom async workflows", "Fetching server data"]
      ]},
      cheat: [
        "`createApi({ reducerPath, baseQuery, tagTypes, endpoints })`",
        "Import from `@reduxjs/toolkit/query/react` for hooks",
        "`build.query` -> `useXQuery`, `build.mutation` -> `useXMutation`",
        "Add `api.reducer` + `api.middleware` to the store",
        "`providesTags` / `invalidatesTags` drive refetching",
        "`isLoading` first load; `isFetching` any load",
        "`keepUnusedDataFor` defaults to 60 seconds"
      ]
    },
    related: ["STORE-015", "STORE-020", "STORE-022", "API-029"]
  },

  "STORE-017": {
    tldr: "Zustand is a tiny store library: `create()` returns a hook. Components read just the slice they need with a selector, and actions are plain functions in the store. No Provider, no boilerplate.",
    analogy: { icon: "🎵", text: "A shared playlist on the party speaker. Anyone's phone can add a song or press play; each phone's screen only refreshes the part it is showing." },
    visual: { type: "compare", title: "Zustand vs Redux Toolkit", left: { label: "Redux Toolkit", tone: "neutral", points: [
        "Slices + `configureStore` + `<Provider>`",
        "Changes via dispatched actions",
        "Strong conventions, great DevTools, RTK Query",
        "Good for big teams and large apps"
      ]}, right: { label: "Zustand", tone: "good", points: [
        "`create()` returns a hook; no Provider",
        "Actions are plain functions calling `set`",
        "~1 KB, very little code",
        "Good for small to medium shared client state"
      ]}
    },
    points: [
      "`const useStore = create((set, get) => ({ ...state, ...actions }))`.",
      "Read with a **selector**: `useStore(s => s.songs)`. The component re-renders only when that value changes.",
      "`set({ x })` **merges** at the top level; use `set(s => ({ ... }))` when you need the old state.",
      "Zustand v5: a selector returning a new object/array can loop forever. Wrap it in `useShallow`.",
      "Works outside React too: `useStore.getState()`, `useStore.setState()`. Middleware: `persist`, `devtools`."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const usePlaylist = create((set) => ({
  songs: [],
  playing: null,
  addSong: (song) =>
    set((state) => ({ songs: [...state.songs, song] })),
  play: (title) => set({ playing: title }),
  clear: () => set({ songs: [], playing: null }),
}));

function NowPlaying() {
  const playing = usePlaylist((s) => s.playing);
  return <p>▶ {playing ?? 'Nothing'}</p>;
}

function SongList() {
  const { songs, play } = usePlaylist(
    useShallow((s) => ({ songs: s.songs, play: s.play }))
  );
  return (
    <ul>
      {songs.map((s) => (
        <li key={s.id} onClick={() => play(s.title)}>{s.title}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const addSong = usePlaylist((s) => s.addSong);
  return (
    <>
      <button onClick={() => addSong({ id: Date.now(), title: 'Lo-fi beat' })}>
        Add song
      </button>
      <SongList />
      <NowPlaying />
    </>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "`create` takes a function receiving `set` and returns a hook. State and actions live together." },
      { lines: [7, 8], note: "Functional `set` reads the previous state; return a **new** array (no mutation)." },
      { lines: [9], note: "Object `set` merges: only `playing` changes, `songs` is kept." },
      { lines: [14], note: "Selector: `NowPlaying` re-renders only when `playing` changes, not when songs are added." },
      { lines: [19, 20, 21], note: "Picking several fields returns a new object; `useShallow` compares its fields instead of the reference." },
      { lines: [32], note: "Actions are stable functions, so selecting them never causes re-renders." }
    ]},
    output: "Click “Add song” to append “Lo-fi beat” to the list. Click a song and “▶ Lo-fi beat” appears.",
    mistakes: [
      { bad: `const { songs, play } = usePlaylist((s) => ({\n  songs: s.songs, play: s.play,\n}));`, good: `const { songs, play } = usePlaylist(\n  useShallow((s) => ({ songs: s.songs, play: s.play }))\n);`, why: "In v5 a new object on every call fails the equality check and can cause \"Maximum update depth exceeded\". `useShallow` fixes it." },
      { bad: `addSong: (song) => set((s) => {\n  s.songs.push(song);\n  return s;\n}),`, good: `addSong: (song) =>\n  set((s) => ({ songs: [...s.songs, song] })),`, why: "Zustand compares by reference. Mutating and returning the same object means no subscriber sees a change." },
      { bad: `const store = usePlaylist(); // whole store`, good: `const songs = usePlaylist((s) => s.songs);`, why: "No selector subscribes to everything, so the component re-renders on any change." }
    ],
    practice: [
      { level: "B", q: "Build a `useCart` store with `items` and `addItem`.", a: "Same shape as the playlist.", code: `const useCart = create((set) => ({\n  items: [],\n  addItem: (item) => set((s) => ({ items: [...s.items, item] })),\n}));` },
      { level: "I", q: "Keep the cart after a page refresh.", a: "Wrap the creator in `persist` (saves to localStorage).", code: `import { persist } from 'zustand/middleware';\nconst useCart = create(persist(\n  (set) => ({ items: [], addItem: (i) => set((s) => ({ items: [...s.items, i] })) }),\n  { name: 'cart' }\n));` },
      { level: "I", q: "Add a `removeSong(id)` action.", a: "Filter into a new array.", code: `removeSong: (id) => set((s) => ({ songs: s.songs.filter((x) => x.id !== id) })),` },
      { level: "C", q: "Read the current playlist inside a plain JS function (not a component).", a: "`usePlaylist.getState().songs`. It doesn't subscribe, so use it outside render." }
    ],
    quiz: [
      { q: "Does Zustand need a `<Provider>`?", options: ["Yes, always", "No, the hook reads a module-level store", "Only in production"], answer: 1, why: "The store lives in the module; any component can call the hook." },
      { q: "`set({ playing: 'x' })` on `{ songs: [...], playing: null }` gives?", options: ["`{ playing: 'x' }` only", "`{ songs: [...], playing: 'x' }`", "An error"], answer: 1, why: "`set` shallow-merges into the existing state." },
      { q: "A component uses `usePlaylist(s => s.playing)`. A song is added. Does it re-render?", options: ["Yes", "No"], answer: 1, why: "Its selected value (`playing`) didn't change." }
    ],
    rev: {
      sec30: "Zustand: `create((set, get) => ({ state, actions }))` returns a hook. Read with selectors so components re-render only for their slice. `set` shallow-merges; pass a function to use previous state; never mutate. No Provider. In v5 wrap object/array selectors in `useShallow`. Has `persist` and `devtools` middleware.",
      interview: [
        { level: "basic", q: "Why pick Zustand over Context for shared state?", a: "Context re-renders every consumer when its value changes. Zustand subscribers re-render only when their selected value changes, with no Provider." },
        { level: "intermediate", q: "Zustand vs Redux Toolkit?", a: "Zustand is minimal: a hook with state and functions. RTK adds conventions, actions, middleware and RTK Query, which helps large teams. Both are fine; pick by app size and team." },
        { level: "intermediate", q: "Why does `set` need a new array instead of `push`?", a: "Zustand detects change by reference. A mutated array is the same reference, so components don't update." },
        { level: "advanced", q: "What changed with selectors in Zustand v5?", a: "Selectors returning new objects/arrays each call can cause infinite re-render loops. Use `useShallow` or select fields separately." },
        { level: "tricky", q: "How do you use a Zustand store per component tree, e.g. per test?", a: "Create a vanilla store with `createStore` and pass it through Context, reading it with `useStore(store, selector)`." }
      ],
      predict: [
        { code: `const useN = create((set) => ({ n: 0, label: 'hi',\n  inc: () => set((s) => ({ n: s.n + 1 })) }));\nuseN.getState().inc();\nconsole.log(useN.getState());`, answer: "{ n: 1, label: 'hi', inc: [Function] }", why: "`set` merges, so `label` and `inc` are kept." }
      ],
      cheat: [
        "`const useX = create((set, get) => ({ ... }))`",
        "Read: `useX(s => s.field)`",
        "`set({ a })` merges; `set(s => ({ ... }))` for previous state",
        "Never mutate: return new arrays/objects",
        "v5: `useShallow` for object/array selectors",
        "No Provider; `useX.getState()` outside React",
        "Middleware: `persist`, `devtools`"
      ]
    },
    related: ["STORE-010", "STORE-018", "STORE-002", "HOOKS-016"]
  },

  "STORE-018": {
    tldr: "Jotai stores state as tiny independent pieces called **atoms**. Components subscribe to individual atoms, and derived atoms recompute from others, so only the components that use a changed atom re-render.",
    analogy: { icon: "🌦️", text: "A weather dashboard made of separate tiles. Change the temperature and only the °C and °F tiles redraw; the city tile stays untouched." },
    visual: { type: "tree", title: "Atoms flow down to the components that use them", root: { label: "Atom graph", children: [
      { label: "tempAtom (20)", children: [
        { label: "<TempControl />", note: "reads + writes" },
        { label: "fahrenheitAtom", note: "derived: get(temp) * 9/5 + 32", children: [
          { label: "<Fahrenheit />", note: "re-renders when temp changes" }
        ]}
      ]},
      { label: "cityAtom ('London')", children: [
        { label: "<CityName />", note: "reads" },
        { label: "<CityPicker />", note: "writes only: never re-renders" }
      ]}
    ]}},
    points: [
      "`atom(initial)` makes a **primitive atom**; it's a config object, the value lives in a store.",
      "`useAtom(a)` is like `useState`: returns `[value, setValue]`, but shared across components.",
      "`useAtomValue(a)` reads only; `useSetAtom(a)` writes only (and doesn't re-render on changes).",
      "**Derived atom**: `atom(get => get(a) * 2)` recalculates only when its dependencies change.",
      "No Provider needed (uses a default store); add `<Provider>` to scope state, e.g. per test.",
      "Good for many small, independent pieces of UI state; choose Zustand/Redux for one central store."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// Primitive atoms: tiny independent pieces of state
const tempAtom = atom(20); // °C
const cityAtom = atom('London');

// Derived atom: recomputed only when tempAtom changes
const fahrenheitAtom = atom((get) => (get(tempAtom) * 9) / 5 + 32);

function TempControl() {
  const [temp, setTemp] = useAtom(tempAtom);
  return (
    <button onClick={() => setTemp(temp + 1)}>
      {temp}°C +1
    </button>
  );
}

function Fahrenheit() {
  const f = useAtomValue(fahrenheitAtom);
  return <p>{f}°F</p>;
}

function CityPicker() {
  const setCity = useSetAtom(cityAtom); // write-only
  return <button onClick={() => setCity('Paris')}>Go to Paris</button>;
}

function CityName() {
  const city = useAtomValue(cityAtom);
  return <h2>{city}</h2>;
}

export default function Weather() {
  return (
    <>
      <CityName />
      <CityPicker />
      <TempControl />
      <Fahrenheit />
    </>
  );
}`, walk: [
      { lines: [4, 5], note: "Define atoms at module level. They hold no value themselves; the store does." },
      { lines: [8], note: "A read-only derived atom. Jotai tracks that it depends on `tempAtom`." },
      { lines: [11], note: "Works like `useState`, but every component using `tempAtom` sees the same value." },
      { lines: [20], note: "Read-only hook: re-renders when the derived °F value changes." },
      { lines: [25], note: "Write-only hook: clicking changes the city, but `CityPicker` itself doesn't re-render." }
    ]},
    output: "London, “Go to Paris”, “20°C +1”, “68°F”. Clicking +1 shows 21°C and 69.8°F; the city heading doesn't re-render.",
    mistakes: [
      { bad: `function Counter() {\n  const countAtom = atom(0); // new atom each render\n  const [n, setN] = useAtom(countAtom);\n}`, good: `const countAtom = atom(0); // module level\nfunction Counter() {\n  const [n, setN] = useAtom(countAtom);\n}`, why: "Atoms are identified by reference. A new atom each render means fresh state each render. Create atoms outside components (or in `useMemo`)." },
      { bad: `const [, setCity] = useAtom(cityAtom); // only writes`, good: `const setCity = useSetAtom(cityAtom);`, why: "`useAtom` subscribes to the value, so this component re-renders on every city change even though it never shows it." }
    ],
    practice: [
      { level: "B", q: "Create a `darkModeAtom` and a toggle button.", a: "A boolean atom plus `useAtom`.", code: `const darkModeAtom = atom(false);\nconst [dark, setDark] = useAtom(darkModeAtom);\n<button onClick={() => setDark((d) => !d)}>Toggle</button>` },
      { level: "I", q: "Derive the number of unfinished todos from `todosAtom`.", a: "A read-only derived atom.", code: `const leftAtom = atom((get) => get(todosAtom).filter((t) => !t.done).length);` },
      { level: "I", q: "Remember the theme across refreshes.", a: "Use `atomWithStorage` from `jotai/utils`.", code: `import { atomWithStorage } from 'jotai/utils';\nconst themeAtom = atomWithStorage('theme', 'light');` },
      { level: "C", q: "Write an action atom `addTodoAtom` that appends a todo.", a: "A write-only atom: first argument `null`, second is the write function.", code: `const addTodoAtom = atom(null, (get, set, text) => {\n  set(todosAtom, [...get(todosAtom), { id: Date.now(), text, done: false }]);\n});\n// const addTodo = useSetAtom(addTodoAtom);` }
    ],
    quiz: [
      { q: "What is an atom in Jotai?", options: ["A component", "A small unit of state that components subscribe to", "A Redux action"], answer: 1, why: "Atoms are independent pieces of state; components subscribe to the ones they use." },
      { q: "Which hook writes without subscribing to the value?", options: ["`useAtom`", "`useAtomValue`", "`useSetAtom`"], answer: 2, why: "`useSetAtom` returns only the setter, so the component doesn't re-render on changes." },
      { q: "Does Jotai require a `<Provider>`?", options: ["Yes", "No, it falls back to a default store"], answer: 1, why: "Provider is optional; use it to scope or reset state." }
    ],
    rev: {
      sec30: "Jotai is atomic state: `atom(init)` for primitive state, `atom(get => ...)` for derived, `atom(null, (get, set, arg) => ...)` for actions. `useAtom` = shared `useState`; `useAtomValue` reads; `useSetAtom` writes without subscribing. Only components using a changed atom re-render. Provider optional.",
      interview: [
        { level: "basic", q: "What is atomic state?", a: "State split into many small atoms instead of one big store. Components subscribe to the specific atoms they read." },
        { level: "intermediate", q: "How do derived atoms work?", a: "`atom(get => ...)` reads other atoms with `get`. Jotai tracks those dependencies and recomputes only when they change." },
        { level: "intermediate", q: "Why use `useSetAtom` instead of `useAtom` for a button that only writes?", a: "`useAtom` subscribes to the value, so the button re-renders on every change. `useSetAtom` doesn't subscribe." },
        { level: "advanced", q: "Jotai vs Zustand?", a: "Same author group (pmndrs). Zustand is one top-down store with selectors; Jotai is bottom-up atoms with automatic dependency tracking. Jotai suits many independent bits of state." },
        { level: "tricky", q: "Why must atoms be created outside components?", a: "Atoms are keys by reference. Creating one inside render makes a new key every render, so the state resets." }
      ],
      cheat: [
        "`atom(0)` primitive; `atom(get => ...)` derived",
        "`atom(null, (get, set, arg) => ...)` action atom",
        "`useAtom` = shared useState",
        "`useAtomValue` read; `useSetAtom` write (no subscribe)",
        "Create atoms at module level",
        "Provider optional; scopes state",
        "`atomWithStorage` in `jotai/utils` for persistence"
      ]
    },
    related: ["STORE-017", "STORE-019", "STATE-022"]
  },

  "STORE-019": {
    tldr: "Recoil was Meta's experimental atom-based state library (`atom`, `selector`, `RecoilRoot`). Its repository was archived in Jan 2025, so you'll only meet it in older code. Recognise it, then migrate, usually to Jotai.",
    analogy: { icon: "📼", text: "A video cassette in a box of old family recordings. You should know how to play it, but you'd copy it to a modern format rather than record anything new on it." },
    visual: { type: "compare", title: "Recoil (legacy) -> Jotai (modern equivalent)", left: { label: "Recoil (archived)", tone: "bad", points: [
        "`<RecoilRoot>` required at the top",
        "`atom({ key: 'todos', default: [] })`",
        "`selector({ key, get: ({ get }) => ... })`",
        "`useRecoilState` / `useRecoilValue`",
        "Unmaintained; known to break on React 19"
      ]}, right: { label: "Jotai (maintained)", tone: "good", points: [
        "Provider optional",
        "`atom([])`: no string key needed",
        "`atom((get) => ...)` for derived values",
        "`useAtom` / `useAtomValue`",
        "Actively maintained, small API"
      ]}
    },
    points: [
      "Spot it by imports from `'recoil'` and a `<RecoilRoot>` near the app root.",
      "**Atom** = shared state with a unique string `key`. **Selector** = derived (or async) state from atoms.",
      "Hooks: `useRecoilState` (read + write), `useRecoilValue` (read), `useSetRecoilState` (write).",
      "Archived Jan 2025 and relies on React internals that changed in React 19: no new code; plan a migration.",
      "Migration: Jotai maps almost 1:1 (atom -> atom, selector -> derived atom). Zustand also works."
    ],
    code: { file: "Todos.legacy.jsx", lang: "jsx", src: `// LEGACY: Recoil is archived. Read it, don't write new code with it.
import {
  RecoilRoot, atom, selector, useRecoilState, useRecoilValue,
} from 'recoil';

const todosState = atom({
  key: 'todosState', // must be unique across the app
  default: [],
});

const remainingState = selector({
  key: 'remainingState',
  get: ({ get }) => get(todosState).filter((t) => !t.done).length,
});

function AddTodo() {
  const [todos, setTodos] = useRecoilState(todosState);
  const add = () => setTodos([...todos, { id: Date.now(), done: false }]);
  return <button onClick={add}>Add todo</button>;
}

function Remaining() {
  const n = useRecoilValue(remainingState);
  return <p>{n} left</p>;
}

export default function App() {
  return (
    <RecoilRoot>
      <AddTodo />
      <Remaining />
    </RecoilRoot>
  );
}`, walk: [
      { lines: [2, 3, 4], note: "The giveaway: imports from `recoil`." },
      { lines: [6, 7, 8, 9], note: "Recoil atoms need a globally unique string `key`. In Jotai: `atom([])`." },
      { lines: [11, 12, 13, 14], note: "A selector derives data. In Jotai: `atom((get) => get(todosAtom).filter(...).length)`." },
      { lines: [17], note: "`useRecoilState` works like a shared `useState`. Jotai's `useAtom` is the same idea." },
      { lines: [29, 30, 31, 32], note: "Every Recoil hook must sit under `<RecoilRoot>`." }
    ]},
    output: "“0 left” and an “Add todo” button; each click increases the count by 1.",
    mistakes: [
      { bad: `npm install recoil  # new project in 2026`, good: `npm install jotai   # or zustand`, why: "Recoil is archived and unmaintained. New projects should use a maintained library." },
      { bad: `const a = atom({ key: 'item', default: 0 });\nconst b = atom({ key: 'item', default: '' });`, good: `const a = atom({ key: 'itemCount', default: 0 });\nconst b = atom({ key: 'itemName', default: '' });`, why: "Recoil keys must be unique across the whole app; duplicates trigger warnings and confusing bugs." }
    ],
    practice: [
      { level: "B", q: "Which Recoil hook only reads a value?", a: "`useRecoilValue(state)`." },
      { level: "I", q: "Rewrite `todosState` and `remainingState` in Jotai.", a: "Drop the keys; selectors become derived atoms.", code: `const todosAtom = atom([]);\nconst remainingAtom = atom((get) => get(todosAtom).filter((t) => !t.done).length);` },
      { level: "I", q: "Map the Recoil hooks to Jotai.", a: "`useRecoilState` -> `useAtom`, `useRecoilValue` -> `useAtomValue`, `useSetRecoilState` -> `useSetAtom`, `<RecoilRoot>` -> optional `<Provider>`." },
      { level: "C", q: "Plan a safe migration for a large app on Recoil.", a: "Migrate one feature at a time (both libraries can coexist), add tests around each feature first, then remove `RecoilRoot` when no imports remain." }
    ],
    quiz: [
      { q: "What is Recoil's status?", options: ["The official React state library", "Archived; legacy code only", "Merged into React 19"], answer: 1, why: "Meta archived the repo in 2025; it receives no updates." },
      { q: "Recoil `selector` in Jotai is…", options: ["`useSelector`", "A derived atom `atom(get => ...)`", "`createSelector`"], answer: 1, why: "Both compute values from other atoms." },
      { q: "What must wrap components that use Recoil hooks?", options: ["`<Provider>`", "`<RecoilRoot>`", "Nothing"], answer: 1, why: "Recoil hooks throw outside a `RecoilRoot`." }
    ],
    rev: {
      sec30: "Recoil: Meta's atom/selector library. Atoms need unique string keys, selectors derive state, hooks are `useRecoilState`/`useRecoilValue`, everything sits under `<RecoilRoot>`. Archived in 2025, so treat it as legacy: recognise it and migrate, most easily to Jotai, which has the same mental model.",
      interview: [
        { level: "basic", q: "What were atoms and selectors in Recoil?", a: "Atoms are shared pieces of state with a unique key; selectors are pure functions that derive state from atoms (and could be async)." },
        { level: "intermediate", q: "Would you choose Recoil for a new app today?", a: "No. It's archived and unmaintained. I'd pick Jotai for atomic state or Zustand/RTK for a central store." },
        { level: "advanced", q: "How would you migrate Recoil to Jotai?", a: "Map atom -> `atom(default)`, selector -> derived atom, hooks 1:1, `RecoilRoot` -> optional Provider. Do it feature by feature with tests." },
        { level: "tricky", q: "Why did Recoil need string keys but Jotai doesn't?", a: "Recoil used keys for persistence and debugging across the app. Jotai identifies atoms by object reference, so no key is needed." }
      ],
      compare: { cols: ["", "Recoil", "Jotai"], rows: [
        ["Root", "`<RecoilRoot>` required", "`<Provider>` optional"],
        ["State unit", "`atom({ key, default })`", "`atom(value)`"],
        ["Derived", "`selector({ key, get })`", "`atom(get => ...)`"],
        ["Read + write", "`useRecoilState`", "`useAtom`"],
        ["Status", "Archived (2025)", "Maintained"]
      ]},
      cheat: [
        "Recoil = Meta's atom state library, archived 2025",
        "Imports from `'recoil'`; needs `<RecoilRoot>`",
        "`atom({ key, default })` needs a unique key",
        "`selector({ key, get })` for derived state",
        "`useRecoilState` / `useRecoilValue` / `useSetRecoilState`",
        "Don't use it in new code; migrate to Jotai"
      ]
    },
    related: ["STORE-018", "STORE-017", "STORE-001"]
  },

  "STORE-020": {
    tldr: "TanStack Query fetches server data for you and keeps it in a shared cache keyed by `queryKey`. It handles loading and error states, dedupes requests and quietly refetches stale data in the background.",
    analogy: { icon: "☀️", text: "A weather app that remembers the last forecast per city. It shows the saved one instantly and refreshes it in the background when it's getting old or you come back to the app." },
    visual: { type: "cycle", title: "Life of a cached query", steps: [
      { label: "Fetch", detail: "First `useQuery(['weather', 'London'])` calls `queryFn`; `isPending` is true." },
      { label: "Fresh", detail: "Data cached. Within `staleTime` (default 0) it's served with no request." },
      { label: "Stale", detail: "Still shown instantly, but marked as needing a refresh." },
      { label: "Trigger", detail: "New mount, window refocus or reconnect starts a refetch." },
      { label: "Background refetch", detail: "`isFetching` is true; the old data stays on screen until new data arrives." }
    ]},
    points: [
      "Wrap the app in `<QueryClientProvider client={queryClient}>` once.",
      "`useQuery({ queryKey, queryFn })`: the **key** identifies the data; put every variable the fetch uses in it.",
      "Same key in many components = **one** request and one shared cache entry.",
      "v5 flags: `isPending` (no data yet), `isError`, `isSuccess`, and `isFetching` (any request in flight).",
      "Defaults: `staleTime: 0`, `gcTime: 5 min` (unused cache), 3 retries, refetch on window focus.",
      "`queryFn` must **throw** on failure; `fetch` doesn't throw on 404/500, so check `res.ok`."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import {
  QueryClient, QueryClientProvider, useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

async function fetchWeather(city) {
  const res = await fetch(\`/api/weather?city=\${city}\`);
  if (!res.ok) throw new Error('Weather unavailable');
  return res.json();
}

function Weather({ city }) {
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeather(city),
    staleTime: 60_000, // fresh for 1 minute
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p>⚠ {error.message}</p>;

  return (
    <p>
      {city}: {data.temp}°C {isFetching && '↻'}
    </p>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Weather city="London" />
      <Weather city="London" />
      <Weather city="Paris" />
    </QueryClientProvider>
  );
}`, walk: [
      { lines: [5], note: "One `QueryClient` holds the cache. Create it outside components so it isn't recreated." },
      { lines: [8, 9], note: "Throw on HTTP errors so TanStack Query marks the query as failed (and retries)." },
      { lines: [15, 16], note: "The key includes `city`: London and Paris are cached separately; changing city fetches again." },
      { lines: [17], note: "For 60 s the data counts as fresh: remounts and refocus won't refetch." },
      { lines: [20, 21], note: "Handle the first load and errors; after that `data` is defined." },
      { lines: [33, 34, 35], note: "Two London widgets share one request. Paris makes a second one." }
    ]},
    output: "“Loading…” ×3, then “London: 14°C” twice and “Paris: 17°C”. The network tab shows 2 requests, not 3.",
    mistakes: [
      { bad: `useQuery({\n  queryKey: ['weather'],\n  queryFn: () => fetchWeather(city),\n});`, good: `useQuery({\n  queryKey: ['weather', city],\n  queryFn: () => fetchWeather(city),\n});`, why: "If `city` isn't in the key, every city shares one cache entry and changing city won't refetch." },
      { bad: `const [data, setData] = useState();\nconst q = useQuery({ queryKey, queryFn });\nuseEffect(() => setData(q.data), [q.data]);`, good: `const { data } = useQuery({ queryKey, queryFn });`, why: "Copying query data into state duplicates it and adds an extra render. Use `data` directly." },
      { bad: `function App() {\n  const queryClient = new QueryClient();\n  ...\n}`, good: `const queryClient = new QueryClient();\nfunction App() { ... }`, why: "A new client on every render throws away the whole cache." }
    ],
    practice: [
      { level: "B", q: "Show “Updating…” during a background refetch.", a: "Use `isFetching`, which is true even when data is already shown.", code: `{isFetching && <small>Updating…</small>}` },
      { level: "I", q: "Only fetch once the user has typed a city.", a: "Use `enabled`.", code: `useQuery({\n  queryKey: ['weather', city],\n  queryFn: () => fetchWeather(city),\n  enabled: city.length > 0,\n});` },
      { level: "I", q: "Cancel the request if the component unmounts or the key changes.", a: "Pass the provided `signal` to fetch.", code: `queryFn: ({ signal }) =>\n  fetch(\`/api/weather?city=\${city}\`, { signal }).then((r) => r.json()),` },
      { level: "C", q: "A recipe list refetches every time you switch tabs. Why, and how do you calm it down?", a: "`staleTime` is 0, so data is instantly stale and refetches on mount and window focus. Raise `staleTime` (e.g. `5 * 60_000`) or set `refetchOnWindowFocus: false`." }
    ],
    quiz: [
      { q: "What does `queryKey` do?", options: ["Sets the URL", "Identifies the cache entry and its dependencies", "Authenticates the request"], answer: 1, why: "Same key = same cached data. Different variables belong in the key." },
      { q: "Default `staleTime` in TanStack Query v5?", options: ["0 (stale immediately)", "5 minutes", "Infinity"], answer: 0, why: "Data is stale right away by default; `gcTime` (5 min) is the separate cache-removal timer." },
      { q: "Data is shown and a refocus refetch runs. Which is true?", options: ["`isPending`", "`isFetching`", "Both"], answer: 1, why: "`isPending` means no data yet. Background refetches only set `isFetching`." }
    ],
    rev: {
      sec30: "TanStack Query v5 manages server state: `useQuery({ queryKey, queryFn })` caches by key, dedupes identical requests, retries failures and refetches stale data on mount, focus and reconnect. `staleTime` (default 0) controls freshness; `gcTime` (default 5 min) removes unused data. `isPending` = no data yet, `isFetching` = request in flight.",
      interview: [
        { level: "basic", q: "Why use TanStack Query instead of `useEffect` + `fetch`?", a: "It gives caching, dedupe, retries, background refetch, loading/error states and race-condition safety, all of which you'd otherwise hand-write." },
        { level: "intermediate", q: "`staleTime` vs `gcTime`?", a: "`staleTime` is how long data counts as fresh (no refetch). `gcTime` is how long **unused** data stays in memory before it's deleted." },
        { level: "intermediate", q: "Why must all variables go in the `queryKey`?", a: "The key is the cache identity. Leave a variable out and different inputs share one entry, and changes won't refetch." },
        { level: "advanced", q: "`isPending` vs `isLoading` vs `isFetching` in v5?", a: "`isPending`: no data yet. `isFetching`: any request running. `isLoading` = `isPending && isFetching` (first load actually in progress)." },
        { level: "tricky", q: "Your API returns 500 but the query shows success with an error body. Why?", a: "`fetch` doesn't reject on HTTP errors. The `queryFn` must check `res.ok` and throw." }
      ],
      predict: [
        { code: `// staleTime: 0 (default)\n<Recipes />   // mounts, fetches\n// user navigates away and back 10 s later`, answer: "Cached recipes show instantly, and a background refetch runs", why: "Data is in the cache (gcTime 5 min) but stale, so a new mount triggers a refetch." }
      ],
      cheat: [
        "`<QueryClientProvider client={qc}>` once at the root",
        "`useQuery({ queryKey: ['todos', id], queryFn })`",
        "All fetch variables go in the key",
        "`staleTime` default 0; `gcTime` default 5 min",
        "`isPending` no data; `isFetching` any request",
        "Throw in `queryFn` on `!res.ok`",
        "Pass `signal` for cancellation; `enabled` to wait"
      ]
    },
    related: ["STORE-021", "STORE-022", "STORE-016", "API-029"]
  },

  "STORE-021": {
    tldr: "**Server state** is data the API owns (products, orders); you only hold a cached copy that can go stale. **Client state** is data the browser owns (open modal, cart draft, theme). Manage them with different tools.",
    analogy: { icon: "🛍️", text: "The shop's price list vs your shopping basket. Prices belong to the shop and can change any time, so you re-check them. Your basket is yours; nobody else changes it." },
    visual: { type: "compare", title: "Two kinds of state", left: { label: "Server state", tone: "neutral", points: [
        "Owned by the backend: products, orders, users",
        "Shared with other users; can change without you",
        "Async: loading, errors, retries",
        "Can be stale: needs caching + refetching",
        "Tool: TanStack Query or RTK Query"
      ]}, right: { label: "Client state", tone: "neutral", points: [
        "Owned by the browser: theme, open modal, form draft",
        "Changes only when this user acts",
        "Synchronous and always up to date",
        "Tool: `useState`, Context, Zustand, Redux",
        "URL state (filters, page) goes in the URL"
      ]}
    },
    points: [
      "Ask: **who owns the truth?** The API -> server state. This browser tab -> client state.",
      "Server state needs a **cache** (dedupe, refetch, invalidate). Don't hand-roll it in Redux or Context.",
      "Once server data moves to TanStack/RTK Query, the remaining client state is usually small: `useState` or Zustand is enough.",
      "Never copy query data into a store or `useState`; you get two sources of truth that drift apart.",
      "Values you can calculate (totals, filtered lists) are **derived**: compute them, don't store them."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { fetchProducts } from './api'; // throws if !res.ok

// Client state: owned by the browser, shared across pages
const useCart = create((set) => ({
  ids: [],
  add: (id) => set((s) => ({ ids: [...s.ids, id] })),
}));

export default function Shop() {
  // Server state: owned by the API, cached by TanStack Query
  const { data: products = [], isPending } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Local UI state: only this component cares
  const [saleOnly, setSaleOnly] = useState(false);

  const cartIds = useCart((s) => s.ids);
  const add = useCart((s) => s.add);

  // Derived: computed each render, never stored
  const visible = saleOnly ? products.filter((p) => p.onSale) : products;

  if (isPending) return <p>Loading…</p>;
  return (
    <>
      <label>
        <input type="checkbox" checked={saleOnly}
          onChange={(e) => setSaleOnly(e.target.checked)} /> Sale only
      </label>
      <p>🛒 {cartIds.length}</p>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            {p.name} <button onClick={() => add(p.id)}>Add</button>
          </li>
        ))}
      </ul>
    </>
  );
}`, walk: [
      { lines: [7, 8, 9, 10], note: "The cart is client state shared across pages: a small Zustand store." },
      { lines: [14, 15, 16, 17], note: "Products come from the API: TanStack Query caches and refetches them." },
      { lines: [20], note: "A checkbox only this component needs: plain `useState`." },
      { lines: [26], note: "The filtered list is derived from the other two. No extra state, so nothing can go out of sync." },
      { lines: [39], note: "The cart stores **ids** only; product details stay in the server cache." }
    ]},
    output: "A product list with a “Sale only” checkbox and a 🛒 count. Ticking the box filters the list; clicking Add bumps the count.",
    mistakes: [
      { bad: `const { data } = useQuery({ queryKey: ['products'], queryFn });\nuseEffect(() => {\n  dispatch(setProducts(data));\n}, [data]);`, good: `const { data } = useQuery({ queryKey: ['products'], queryFn });\n// read products from the query wherever needed`, why: "The Redux copy won't refetch or invalidate, so screens disagree. Keep server data in the query cache only." },
      { bad: `const [filtered, setFiltered] = useState([]);\nuseEffect(() => {\n  setFiltered(products.filter((p) => p.onSale));\n}, [products]);`, good: `const filtered = products.filter((p) => p.onSale);`, why: "Derived data stored in state costs an extra render and can lag behind. Compute it during render." }
    ],
    practice: [
      { level: "B", q: "Classify: product list, dark mode, search text in the URL, logged-in user's profile.", a: "Product list: server. Dark mode: client. Search text: URL state. Profile: server (cached), though the auth token itself is client state." },
      { level: "I", q: "Where should the “selected product id” for a details page live?", a: "In the URL (`/products/:id`), so it survives refresh and can be shared. Then fetch details with `useQuery({ queryKey: ['product', id], queryFn })`." },
      { level: "I", q: "An app keeps products, orders and a modal flag in Redux. How would you slim it down?", a: "Move products and orders to TanStack Query (or RTK Query). The modal flag becomes local `useState`. Redux may no longer be needed." },
      { level: "C", q: "Why store cart **ids** instead of full product objects?", a: "Product details (price, stock) are server state and can change. Keeping ids lets you read fresh details from the query cache." }
    ],
    quiz: [
      { q: "Which is server state?", options: ["Whether the sidebar is open", "The list of orders from `/api/orders`", "The text in an unsent chat message"], answer: 1, why: "The backend owns orders; the browser only caches a copy." },
      { q: "Best home for a list of products from the API?", options: ["`useState` + `useEffect` in every page", "A Redux slice filled by hand", "TanStack Query (or RTK Query)"], answer: 2, why: "Server state needs caching, dedupe and refetching, which these libraries provide." },
      { q: "Why avoid copying query data into Zustand?", options: ["Zustand can't hold arrays", "Two sources of truth drift apart", "It's slower to read"], answer: 1, why: "The copy won't update when the query refetches or is invalidated." }
    ],
    rev: {
      sec30: "Server state is owned by the backend: async, shared, can go stale, so it needs a cache with refetch and invalidation (TanStack Query, RTK Query). Client state is owned by the browser: sync, always current (`useState`, Context, Zustand, Redux). URL state belongs in the URL. Derived values are computed, never stored.",
      interview: [
        { level: "basic", q: "What's the difference between server and client state?", a: "Server state lives on the backend and you hold a possibly stale cached copy. Client state lives only in the browser and is always current." },
        { level: "intermediate", q: "Why not keep server data in Redux?", a: "You'd hand-write caching, loading flags, dedupe and refetching. A server-state library does it, and Redux stays for genuine client state (or RTK Query handles both)." },
        { level: "intermediate", q: "Where does filter/sort/page state go?", a: "Usually the URL search params: shareable, survives refresh, and works with back/forward. Include it in the query key." },
        { level: "advanced", q: "After adopting TanStack Query, what's left for a global store?", a: "Often very little: auth session, theme, cart draft, multi-step wizard data. Many apps drop Redux and use Zustand or Context." },
        { level: "tricky", q: "Is the logged-in user's profile server or client state?", a: "The profile is server state (fetch and cache it). The auth token or session flag is client state." }
      ],
      scenario: [
        { q: "A notes app shows an old title on the list page after editing on the details page. Both pages copied API data into `useState`. Fix?", a: "Read notes from the query cache (keys `['notes']` and `['notes', id]`) and invalidate `['notes']` after the edit, so both pages update." }
      ],
      cheat: [
        "Who owns the truth? API = server state; browser = client state",
        "Server state: TanStack Query / RTK Query",
        "Client state: useState -> Context -> Zustand/Redux",
        "Filters, page, selected id -> URL",
        "Don't copy query data into stores or useState",
        "Derived values: compute, don't store"
      ]
    },
    related: ["STORE-001", "STORE-020", "STORE-022", "STATE-022"]
  },

  "STORE-022": {
    tldr: "After a mutation changes data on the server, your cached copy is out of date. Call `queryClient.invalidateQueries({ queryKey })` to mark matching queries stale and refetch the ones on screen.",
    analogy: { icon: "📝", text: "A printed menu on each café table. When the chef adds a dish, staff stamp every menu \"out of date\" and reprint the ones customers are holding now; the rest get reprinted when someone picks them up." },
    visual: { type: "flow", title: "Mutate -> invalidate -> refetch", steps: [
      { label: "mutate('Buy milk')", detail: "`useMutation` POSTs the new todo; `isPending` is true." },
      { label: "Server saves", detail: "The API's todo list now differs from the cached `['todos']`." },
      { label: "invalidateQueries", detail: "`{ queryKey: ['todos'] }` marks `['todos']`, `['todos', 2]`… stale (prefix match)." },
      { label: "Active refetch", detail: "Queries on screen refetch now; inactive ones refetch on next use." },
      { label: "UI updated", detail: "The list shows “Buy milk” from fresh server data." }
    ]},
    points: [
      "`useMutation({ mutationFn, onSuccess })` for writes. Run it with `mutate(vars)` or `await mutateAsync(vars)`.",
      "In `onSuccess`, call `queryClient.invalidateQueries({ queryKey: ['todos'] })` (get the client with `useQueryClient()`).",
      "Keys match by **prefix**: `['todos']` also hits `['todos', 5]`. Add `exact: true` for one entry only.",
      "**Return** the invalidate promise from `onSuccess` and the mutation stays pending until the refetch finishes.",
      "Already have the new data in the response? `setQueryData(key, updater)` updates the cache without a refetch.",
      "Optimistic updates (show before the server answers) build on this: see API-027."
    ],
    code: { file: "AddTodo.jsx", lang: "jsx", src: `import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function addTodo(text) {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Could not save');
  return res.json();
}

export function AddTodo() {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      setText('');
      // every ['todos', ...] query: mark stale, refetch the ones on screen
      return queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutate(text); }}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button disabled={isPending}>{isPending ? 'Saving…' : 'Add'}</button>
      {error && <p>⚠ {error.message}</p>}
    </form>
  );
}

// Alternative: write the server's response straight into the cache
// onSuccess: (newTodo) =>
//   queryClient.setQueryData(['todos'], (old = []) => [...old, newTodo]),`, walk: [
      { lines: [4, 10, 11], note: "The mutation function: throw on HTTP errors so `onError` and `error` work." },
      { lines: [16], note: "`useQueryClient()` gives the same client you passed to the Provider." },
      { lines: [18, 19], note: "`useMutation` doesn't run on render; it waits for `mutate(...)`." },
      { lines: [22, 23], note: "Prefix match: refetches the visible todo list. Returning the promise keeps `isPending` until it's done." },
      { lines: [28, 30], note: "Submit calls `mutate`; the button shows “Saving…” and is disabled meanwhile." },
      { lines: [36, 37, 38], note: "If the response already contains the new todo, patch the cache and skip the refetch." }
    ]},
    output: "Type “Buy milk”, click Add: the button shows “Saving…”, then the input clears and every todo list on screen refetches and shows the new item.",
    mistakes: [
      { bad: `queryClient.invalidateQueries(['todos']);`, good: `queryClient.invalidateQueries({ queryKey: ['todos'] });`, why: "TanStack Query v5 only accepts the object form. The v4 array-first signature was removed." },
      { bad: `onSuccess: (newTodo) => {\n  const todos = queryClient.getQueryData(['todos']);\n  todos.push(newTodo);\n}`, good: `onSuccess: (newTodo) => {\n  queryClient.setQueryData(['todos'], (old = []) => [...old, newTodo]);\n}`, why: "Mutating cached data doesn't notify subscribers, so nothing re-renders. Always return a new array via `setQueryData`." },
      { bad: `const { mutate } = useMutation({ mutationFn: addTodo });\n// list never updates until refresh`, good: `useMutation({\n  mutationFn: addTodo,\n  onSuccess: () => qc.invalidateQueries({ queryKey: ['todos'] }),\n});`, why: "Mutations don't touch the query cache by themselves. You must invalidate or update it." }
    ],
    practice: [
      { level: "B", q: "After deleting a note, refresh the notes list.", a: "Invalidate `['notes']` in `onSuccess`.", code: `useMutation({\n  mutationFn: (id) => fetch(\`/api/notes/\${id}\`, { method: 'DELETE' }),\n  onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),\n});` },
      { level: "I", q: "Editing note 7 should refetch its details but not every note query. How?", a: "Invalidate the exact key.", code: `qc.invalidateQueries({ queryKey: ['notes', 7], exact: true });` },
      { level: "I", q: "Navigate to the new recipe page only after saving succeeds.", a: "Use `mutateAsync` and await it.", code: `const recipe = await mutateAsync(form);\nnavigate(\`/recipes/\${recipe.id}\`);` },
      { level: "C", q: "Rename a playlist instantly, then roll back if the server fails.", a: "Optimistic update: in `onMutate` cancel queries, snapshot with `getQueryData`, `setQueryData` the new name and return the snapshot; restore it in `onError`; invalidate in `onSettled`." }
    ],
    quiz: [
      { q: "`invalidateQueries({ queryKey: ['todos'] })` affects which keys?", options: ["Only `['todos']`", "`['todos']` and every key starting with it, like `['todos', 5]`", "All queries in the app"], answer: 1, why: "Matching is by prefix unless you pass `exact: true`." },
      { q: "What happens to an invalidated query that's not on screen?", options: ["Deleted immediately", "Marked stale; refetches when next used", "Refetches every second"], answer: 1, why: "Only active queries refetch right away; inactive ones refetch on their next mount." },
      { q: "When is `setQueryData` better than invalidating?", options: ["When the mutation response already has the full new data", "Never", "When the server is offline"], answer: 0, why: "You can update the cache directly and save a network round trip." }
    ],
    rev: {
      sec30: "Mutations change server data, so cached queries go stale. In `useMutation`'s `onSuccess`, call `queryClient.invalidateQueries({ queryKey })`: matching keys (prefix by default) are marked stale and active ones refetch. Return the promise to keep `isPending` until done. Or use `setQueryData` when the response has the new data. v5 requires the object syntax.",
      interview: [
        { level: "basic", q: "Why invalidate after a mutation?", a: "The server data changed, but the cache still holds the old copy. Invalidating marks it stale so it refetches." },
        { level: "intermediate", q: "Invalidate vs `setQueryData`?", a: "Invalidate refetches from the server: simple and always correct. `setQueryData` writes the response into the cache: no extra request, but you must update every affected key yourself." },
        { level: "intermediate", q: "How do query key hierarchies help invalidation?", a: "Structure keys like `['todos', 'list', filters]` and `['todos', 'detail', id]`. Then `['todos']` invalidates everything todo-related and longer keys target less." },
        { level: "advanced", q: "Why return the promise from `onSuccess`?", a: "The mutation stays `isPending` until the refetch completes, so the UI doesn't briefly show old data after “Saved”." },
        { level: "tricky", q: "You invalidate `['todos']` but a page using `['todo-list']` doesn't update. Why?", a: "Matching is by key prefix, and `'todo-list'` is a different first element. Keep consistent key factories." }
      ],
      debug: [
        { code: `const qc = new QueryClient();\nfunction Save() {\n  const m = useMutation({ mutationFn: save,\n    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }) });\n}`, fix: `function Save() {\n  const qc = useQueryClient();\n  const m = useMutation({ mutationFn: save,\n    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }) });\n}`, why: "A separate `new QueryClient()` has its own empty cache. Use `useQueryClient()` to get the one the Provider uses." }
      ],
      cheat: [
        "`const qc = useQueryClient()`",
        "`useMutation({ mutationFn, onSuccess })`, run with `mutate(vars)`",
        "`qc.invalidateQueries({ queryKey: ['todos'] })` (object form only in v5)",
        "Prefix match by default; `exact: true` for one key",
        "Active queries refetch now; inactive on next use",
        "Return the promise from `onSuccess` to wait for refetch",
        "`setQueryData(key, old => new)` to skip a refetch"
      ]
    },
    related: ["STORE-020", "STORE-016", "API-027", "STORE-021"]
  },
};
