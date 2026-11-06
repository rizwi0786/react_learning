export default {
  "STORE-001": {
    tldr: "Not all state is the same. Sort it into **local**, **shared**, **server**, **URL** and **form** state, and each kind has an obvious home. Most \"state management\" pain comes from putting state in the wrong home.",
    analogy: { icon: "🗂️", text: "Sorting your kitchen. Milk goes in the fridge, cereal in the cupboard, the shopping list on the fridge door. Put milk in the cupboard and it goes bad. State is the same: each kind has its place." },
    visual: { type: "flow", title: "Where should this state live?", steps: [
      { label: "One component uses it?", detail: "**Local state**: `useState` / `useReducer`. A dropdown's `isOpen`." },
      { label: "Typed into an input?", detail: "**Form state**: controlled inputs, a form library, or `useActionState`." },
      { label: "Should a link restore it?", detail: "**URL state**: `useSearchParams`. Sort order, filters, page number." },
      { label: "Comes from the API?", detail: "**Server state**: TanStack Query. The server owns it; you hold a cached copy." },
      { label: "Many far-apart readers?", detail: "**Shared client state**: lift it, then Context, then Zustand / Redux Toolkit." }
    ]},
    points: [
      "**Local**: used by one component. Keep it there. This is the default and covers most state.",
      "**Server**: products, orders, weather. It can go stale, so it needs caching and refetching (TanStack Query), not a hand-made store.",
      "**URL**: anything a shared link or the Back button should restore (`?sort=price&page=2`).",
      "**Form**: in-progress input. Often local; promote it only when other parts need it.",
      "**Shared client**: cart, theme, logged-in user. Lift first; reach for a library only when lifting and Context hurt.",
      "Never copy server data into a global store \"just in case\". That creates two sources of truth."
    ],
    code: { file: "ShopPage.jsx", lang: "jsx", src: `import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useCart } from './CartContext';

export default function ShopPage() {
  // URL state: survives refresh, shareable link
  const [params, setParams] = useSearchParams();
  const sort = params.get('sort') ?? 'price';

  // Server state: cached copy of API data
  const { data: products = [], isPending } = useQuery({
    queryKey: ['products', sort],
    queryFn: () => fetch(\`/api/products?sort=\${sort}\`).then(r => r.json()),
  });

  // Shared client state: header, cart page, checkout all read it
  const { addItem } = useCart();

  // Local UI state: only this component cares
  const [showFilters, setShowFilters] = useState(false);

  // Form state: what the user is typing right now
  const [coupon, setCoupon] = useState('');

  if (isPending) return <p>Loading…</p>;

  return (
    <>
      <button onClick={() => setParams({ sort: 'name' })}>Sort by name</button>
      <button onClick={() => setShowFilters(s => !s)}>Filters</button>
      {showFilters && <p>Filter panel</p>}
      <input value={coupon} onChange={e => setCoupon(e.target.value)} />
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} <button onClick={() => addItem(p)}>Add</button>
          </li>
        ))}
      </ul>
    </>
  );
}`, walk: [
      { lines: [8, 9], note: "**URL state**: the sort lives in `?sort=`. Refresh or share the link and it comes back." },
      { lines: [12, 13, 14, 15], note: "**Server state**: TanStack Query fetches, caches and refetches. The key includes `sort`, so each sort is cached separately." },
      { lines: [18], note: "**Shared client state**: the cart is read by many distant components, so it lives in a provider or store." },
      { lines: [21, 24], note: "**Local** and **form** state: nobody else needs them, so plain `useState` is right." }
    ]},
    output: "A product list with Sort, Filters and a coupon box. Sorting changes the URL to `?sort=name`; refreshing keeps the sort.",
    mistakes: [
      { bad: `// Global store holds everything
const products = useStore(s => s.products);
useEffect(() => {
  fetch('/api/products').then(r => r.json())
    .then(setProducts);
}, []);`, good: `const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});`, why: "Server data in a client store means you hand-write loading, errors, caching and refetching. A server-state library does all of that." },
      { bad: `const [page, setPage] = useState(1);`, good: `const [params, setParams] = useSearchParams();
const page = Number(params.get('page') ?? 1);`, why: "Page number in local state is lost on refresh and can't be shared. If a link should restore it, put it in the URL." }
    ],
    practice: [
      { level: "B", q: "Classify: a modal's open/closed flag, the logged-in user, a list of orders from the API.", a: "Local, shared client, server." },
      { level: "B", q: "A recipe search box filters results. Users want to send the filtered page to a friend. Where does the query live?", a: "In the URL: `?q=pasta` via `useSearchParams`." },
      { level: "I", q: "Your Redux store has `products`, `isLoading` and `error` fields filled by `useEffect`. What would you change?", a: "Move it to TanStack Query (or RTK Query). It gives caching, dedupe, refetch and loading/error state for free." },
      { level: "C", q: "A chat app: list of messages, the draft you're typing, which room is open, unread count badge. Classify each.", a: "Messages: server state. Draft: form/local. Open room: URL (`/rooms/:id`). Unread badge: server state (or derived from it)." }
    ],
    quiz: [
      { q: "Weather data fetched from an API is which kind of state?", options: ["Local state", "Server state", "URL state", "Form state"], answer: 1, why: "The server owns it and it can go stale. You only hold a cached copy." },
      { q: "Which state should go in the URL?", options: ["A tooltip's hover flag", "The current filter users might bookmark", "The auth token", "A password field"], answer: 1, why: "URL state is for things a link, refresh or Back button should restore." },
      { q: "What's the first move when two siblings need the same state?", options: ["Add Redux", "Use Context", "Lift it to their common parent", "Store it in localStorage"], answer: 2, why: "Lifting is the simplest fix. Reach for Context or a library only when lifting becomes painful." }
    ],
    rev: {
      sec30: "Classify state before choosing a tool. Local (one component) → `useState`. Form → controlled inputs or a form library. URL (link should restore it) → search params. Server (API data, can go stale) → TanStack Query. Shared client state → lift it, then Context, then Zustand or Redux Toolkit.",
      interview: [
        { level: "basic", q: "What kinds of state does a React app have?", a: "Local UI state, form state, URL state, server state (cached API data) and shared client state like a cart or theme." },
        { level: "intermediate", q: "Why treat server state differently from client state?", a: "Server state is owned elsewhere, can go stale and is shared by many users. It needs caching, dedupe and refetching, which a server-state library handles." },
        { level: "intermediate", q: "When would you put state in the URL?", a: "When a refresh, shared link or Back button should restore it: filters, sort, page, selected tab." },
        { level: "advanced", q: "How do you decide whether you need Redux or Zustand at all?", a: "After moving server data to TanStack Query and filters to the URL, most apps have little shared client state left. Add a store only if lifting and Context become painful." },
        { level: "tricky", q: "Is a value computed from other state a sixth kind of state?", a: "No, it's derived data. Compute it during render (or with a selector) instead of storing it, so it can't get out of sync." }
      ],
      scenario: [
        { q: "A team keeps every API response in Redux and has bugs where pages show old data. What do you suggest?", a: "Move API data to TanStack Query or RTK Query with sensible `staleTime` and invalidation after mutations. Keep Redux for true client state only." }
      ],
      compare: { cols: ["Kind", "Example", "Home"], rows: [
        ["Local", "dropdown open", "`useState`"],
        ["Form", "coupon input", "controlled input / form lib"],
        ["URL", "`?sort=price`", "`useSearchParams`"],
        ["Server", "product list", "TanStack Query"],
        ["Shared client", "cart, theme", "lift → Context → Zustand / RTK"]
      ]},
      cheat: [
        "5 kinds: local, form, URL, server, shared client",
        "Default to local `useState`; move state only when needed",
        "Link or refresh should restore it → URL",
        "From an API → TanStack Query, not a hand-made store",
        "Shared client: lift → Context → Zustand / Redux Toolkit",
        "Derived values are computed, not stored"
      ]
    },
    related: ["COMM-005", "STATE-022", "ROUTE-012", "STORE-021"]
  },

  "STORE-002": {
    tldr: "Context is a **delivery system (dependency injection)**: it hands a value to any component below a provider. It is not a fast store. Every reader re-renders when the value changes, so use it for things that change rarely.",
    analogy: { icon: "📻", text: "A radio station. Anyone tuned in hears it: great for today's weather. Useless for a private chat, because every listener gets every message, every time." },
    visual: { type: "compare", title: "Context is a pipe, not a store",
      left: { label: "Good fits for Context", tone: "good", points: [
        "Theme, language, logged-in user",
        "A service: API client, analytics, feature flags",
        "Values that change rarely",
        "Swapping a fake service in tests"
      ]},
      right: { label: "Poor fits for Context", tone: "bad", points: [
        "A cart updated on every click by many readers",
        "Big objects where each reader needs one field",
        "Text typed on every keystroke",
        "Anything needing selectors or devtools"
      ]}
    },
    points: [
      "Context passes a value **down the tree**. It doesn't manage, cache or optimise it.",
      "When the provider's `value` changes, **every** component that reads that context re-renders. There are no selectors.",
      "Inject **dependencies** (services, config, the current user) so components don't import them directly. Tests can provide a fake.",
      "A stable value (module constant, or `useMemo`) means readers never re-render because of the provider.",
      "React 19: render `<ApiContext value={api}>` directly; `.Provider` still works but isn't needed."
    ],
    code: { file: "ApiContext.jsx", lang: "jsx", src: `import { createContext, useContext, useState } from 'react';

// 1. The dependency: a weather service
const weatherApi = {
  getTemp: city =>
    fetch(\`/api/weather?city=\${city}\`).then(r => r.json()),
};

// 2. Default value = the real service
const ApiContext = createContext(weatherApi);
export const useApi = () => useContext(ApiContext);

// 3. Any component asks for the service, not an import
function WeatherCard({ city }) {
  const api = useApi();
  const [temp, setTemp] = useState(null);

  async function refresh() {
    const data = await api.getTemp(city);
    setTemp(data.temp);
  }

  return (
    <button onClick={refresh}>
      {city}: {temp ?? '?'}°C
    </button>
  );
}

// 4. A test (or Storybook) injects a fake
const fakeApi = { getTemp: async () => ({ temp: 21 }) };

export function WeatherDemo() {
  return (
    <ApiContext value={fakeApi}>
      <WeatherCard city="Paris" />
    </ApiContext>
  );
}`, walk: [
      { lines: [4, 5, 6, 7], note: "The thing being shared is a **service**, not fast-changing data. It never changes, so readers never re-render because of it." },
      { lines: [10, 11], note: "Create the context with a sensible default and wrap `useContext` in a small custom hook." },
      { lines: [15], note: "`WeatherCard` asks for the API instead of importing it. That's dependency injection." },
      { lines: [31, 35, 36, 37], note: "Swap in a fake by wrapping with a different `value`. No mocking of modules needed." }
    ]},
    output: "A button “Paris: ?°C”. Click it and it shows “Paris: 21°C” from the fake service.",
    mistakes: [
      { bad: `<CartContext value={{ items, addItem }}>
  {/* new object every render */}`, good: `const value = useMemo(
  () => ({ items, addItem }), [items, addItem]);
<CartContext value={value}>`, why: "A new object literal each render makes every reader re-render, even when nothing in it changed. Memoise the value (unless React Compiler does it for you)." },
      { bad: `// One giant context for everything
<AppContext value={{ user, theme, cart, search }}>`, good: `<UserContext value={user}>
  <ThemeContext value={theme}>
    <CartProvider>...</CartProvider>
  </ThemeContext>
</UserContext>`, why: "Typing in `search` would re-render every theme and user reader. Split contexts by how often they change." }
    ],
    practice: [
      { level: "B", q: "Name three values that suit Context well.", a: "Theme, current user, locale. Also services such as an API client." },
      { level: "I", q: "A `CartContext` holds a cart updated on every click; the header badge and 40 product cards read it. What happens on each add?", a: "All 41 readers re-render. Consider splitting state from actions, or moving the cart to Zustand / Redux with selectors." },
      { level: "I", q: "Write a `ThemeProvider` whose value never causes extra renders.", a: "Memoise the value object.", code: `function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}` },
      { level: "C", q: "How would you test `WeatherCard` without a network?", a: "Render it inside `<ApiContext value={fakeApi}>` where `fakeApi.getTemp` resolves to a fixed temperature." }
    ],
    quiz: [
      { q: "What happens when a provider's `value` changes?", options: ["Only components using the changed field re-render", "Every component reading that context re-renders", "Nothing until you call `forceUpdate`", "The whole app remounts"], answer: 1, why: "Context has no selectors. All readers of that context re-render." },
      { q: "Which is the best use of Context?", options: ["A search box value updated per keystroke", "An analytics service shared by many components", "A list of 10,000 products from the API", "Mouse position"], answer: 1, why: "A rarely-changing dependency is exactly what Context is for." },
      { q: "In React 19, how do you provide a context?", options: ["`<Ctx value={v}>`", "`<Ctx.Consumer value={v}>`", "`Ctx.provide(v)`", "`useProvider(Ctx, v)`"], answer: 0, why: "React 19 lets you render the context itself as the provider. `<Ctx.Provider>` still works." }
    ],
    rev: {
      sec30: "Context is dependency injection for the component tree: it delivers a value to everything below a provider. It doesn't optimise updates. When the value changes, every reader re-renders. Use it for rarely-changing things (theme, user, locale, services). For frequently-changing shared state, use a store with selectors (Zustand, Redux Toolkit).",
      interview: [
        { level: "basic", q: "What problem does Context solve?", a: "Prop drilling: passing a value through many layers that don't use it." },
        { level: "intermediate", q: "Why is Context called dependency injection rather than state management?", a: "It only transports a value. The state itself still lives in `useState` or `useReducer`; Context just makes it reachable." },
        { level: "intermediate", q: "Why can Context be slow for frequently changing data?", a: "Every consumer of the context re-renders on each value change, even if it uses one unchanged field. Stores let components subscribe to a slice." },
        { level: "advanced", q: "How do you reduce Context re-renders?", a: "Memoise the value, split contexts by change rate, separate state and dispatch contexts, and wrap expensive children in `memo`." },
        { level: "tricky", q: "Can you have Context without a provider?", a: "Yes. `useContext` returns the default passed to `createContext`. Handy for a real service default with a fake provider in tests." }
      ],
      debug: [
        { code: `function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext value={{ user, setUser }}>
      {children}
    </UserContext>
  );
}`, fix: `function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext value={value}>{children}</UserContext>;
}`, why: "The inline object is new every render of the provider, so all readers re-render whenever the provider's parent re-renders." }
      ],
      cheat: [
        "Context = deliver a value down the tree (dependency injection)",
        "Every reader re-renders when `value` changes; no selectors",
        "Good for theme, user, locale, services, feature flags",
        "Memoise object values; split contexts by change rate",
        "React 19: `<Ctx value={v}>` instead of `<Ctx.Provider>`",
        "No provider → `useContext` returns the `createContext` default"
      ]
    },
    related: ["COMM-006", "COMM-008", "HOOKS-006", "PERF-018"]
  },

  "STORE-003": {
    tldr: "Redux keeps shared app state in **one central store** and changes it only through described events (actions). You gain predictable updates and great debugging; you pay with extra files, indirection and a learning curve.",
    analogy: { icon: "🏦", text: "A bank ledger. You can't change your balance directly; you hand in a slip (action) and the teller (reducer) writes a new line. Every change is recorded, so you can always see how you got here." },
    visual: { type: "compare", title: "What Redux gives, what it costs",
      left: { label: "Gains", tone: "good", points: [
        "One place for shared client state",
        "Every change is a logged, named event",
        "Time-travel debugging in Redux DevTools",
        "Components subscribe to just the slice they need",
        "Pure reducers are trivial to unit test"
      ]},
      right: { label: "Costs", tone: "bad", points: [
        "Extra concepts: store, actions, reducers, selectors",
        "Indirection: a click goes through several files",
        "One more dependency and setup step",
        "Overkill for small apps or server data"
      ]}
    },
    points: [
      "Problem it solves: many **far-apart** components reading and changing the **same** client state, where Context re-renders too much and props drill too deep.",
      "Three rules: **one store**, state is **read-only** (change it by dispatching actions), changes are made by **pure reducers**.",
      "Write it with **Redux Toolkit** today. Hand-written Redux boilerplate is the old style.",
      "Don't use Redux for server data by default; TanStack Query or RTK Query fit better.",
      "C#/.NET view: like an event log feeding a pure projection of state."
    ],
    code: { file: "tinyRedux.js", lang: "js", src: `// The whole idea of Redux in ~20 lines (no library)
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach(fn => fn());
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

const store = createStore(cartReducer, { items: [] });
store.subscribe(() => console.log('Cart:', store.getState().items));

store.dispatch({ type: 'cart/itemAdded', payload: 'Apples' });
store.dispatch({ type: 'cart/itemAdded', payload: 'Bread' });`, walk: [
      { lines: [3, 6], note: "The store keeps one state value. Anyone can read it with `getState()`." },
      { lines: [7, 8, 9], note: "The **only** way to change state: dispatch an action. The reducer computes the next state, then listeners are told." },
      { lines: [18, 19, 20, 21], note: "The reducer is a pure function: `(state, action) => newState`. It returns a copy, never edits in place." },
      { lines: [28, 30, 31], note: "Components subscribe (React-Redux does this for you). Each dispatch logs the new cart." }
    ]},
    output: "Cart: [ 'Apples' ]\nCart: [ 'Apples', 'Bread' ]",
    mistakes: [
      { bad: `// Small notes app, 3 components
// adds Redux "because big apps use it"`, good: `// Keep useState, lift when needed.
// Add a store when sharing becomes painful.`, why: "Redux adds files and indirection. In a small app it costs more than it saves." },
      { bad: `store.getState().items.push('Milk');`, good: `store.dispatch({ type: 'cart/itemAdded', payload: 'Milk' });`, why: "Editing state directly skips the reducer, so subscribers aren't notified and the UI doesn't update." }
    ],
    practice: [
      { level: "B", q: "Name Redux's three core principles.", a: "Single source of truth (one store), state is read-only (change it via actions), changes are made with pure reducers." },
      { level: "I", q: "Add a `cart/cleared` case to `cartReducer`.", a: "Return a fresh empty cart.", code: `case 'cart/cleared':
  return { ...state, items: [] };` },
      { level: "I", q: "A weather app with one page and one API call. Redux or not?", a: "Not. Local state plus TanStack Query is enough." },
      { level: "C", q: "Add an `unsubscribe` call to the tiny store example after the first dispatch. What logs?", a: "Only `Cart: ['Apples']`. The listener is removed before the second dispatch." }
    ],
    quiz: [
      { q: "What is the only way to change Redux state?", options: ["Assign to `store.state`", "Dispatch an action", "Call `setState` on the store", "Edit `getState()` result"], answer: 1, why: "State is read-only; reducers produce new state in response to dispatched actions." },
      { q: "Which problem is Redux best at?", options: ["Fetching and caching API data", "Many distant components sharing frequently-changing client state", "Styling components", "A single form's inputs"], answer: 1, why: "That's the case where Context re-renders too much and props drill too deep." },
      { q: "What's the recommended way to write Redux today?", options: ["Hand-written switch reducers and action constants", "Redux Toolkit", "MobX", "jQuery"], answer: 1, why: "The Redux team recommends Redux Toolkit for all Redux code." }
    ],
    rev: {
      sec30: "Redux is a predictable state container: one store, read-only state, changes only via dispatched actions handled by pure reducers. It shines when many distant components share frequently-changing client state and you want logged, testable, time-travel-debuggable updates. Costs: more concepts, files and indirection. Use Redux Toolkit; skip Redux for small apps and server data.",
      interview: [
        { level: "basic", q: "What is Redux?", a: "A library that keeps app state in one store and updates it only through actions processed by pure reducer functions." },
        { level: "intermediate", q: "What are Redux's trade-offs?", a: "Gains: predictability, DevTools, testable reducers, selective subscriptions. Costs: boilerplate (much less with RTK), indirection, learning curve." },
        { level: "intermediate", q: "Redux vs Context?", a: "Context only delivers a value and re-renders all readers. Redux is a store with selective subscriptions, middleware and DevTools." },
        { level: "advanced", q: "When would you not choose Redux?", a: "Small apps, mostly server data (use TanStack Query) or simple shared values (use Context). Zustand is a lighter option for modest shared state." },
        { level: "tricky", q: "Is Redux dead now that React has Context and `useReducer`?", a: "No. Those cover simple cases, but don't give selective subscriptions, middleware or DevTools. RTK remains common in large apps." }
      ],
      cheat: [
        "One store · read-only state · pure reducers",
        "Change state only with `dispatch(action)`",
        "Shines: many distant readers of changing client state",
        "Costs: concepts, files, indirection",
        "Write it with Redux Toolkit",
        "Not for server data by default: TanStack Query / RTK Query"
      ]
    },
    related: ["STORE-004", "STORE-010", "HOOKS-008", "STORE-017"]
  },

  "STORE-004": {
    tldr: "Redux data flows **one way**: the UI dispatches an **action** → the **reducer** computes new state → the **store** saves it and notifies subscribers → the **UI** re-renders with fresh data.",
    analogy: { icon: "🍔", text: "A burger counter. You place an order slip (action), the kitchen (reducer) makes the meal, the pass (store) holds it and calls your number, and you (UI) pick it up." },
    visual: { type: "cycle", title: "One-way Redux loop", steps: [
      { label: "UI", detail: "User clicks **Add to cart**. Component calls `dispatch(action)`." },
      { label: "Action", detail: "Plain object describing what happened: `{ type: 'cart/itemAdded', payload }`." },
      { label: "Reducer", detail: "`(state, action) => newState`. Pure; returns a new cart." },
      { label: "Store", detail: "Saves the new state and notifies every subscriber." },
      { label: "Re-render", detail: "`useSelector` compares its slice; only changed components re-render." }
    ]},
    points: [
      "Data flows in **one direction**. Components never write state directly.",
      "The **store** holds state, runs the reducer on each dispatch and notifies subscribers.",
      "**React-Redux** connects React: `<Provider store>` at the root, `useSelector` to read, `useDispatch` to send.",
      "A component re-renders only if **its selected value** changed (compared by `===`).",
      "**Middleware** (like thunks) sits between dispatch and reducer for async work and logging."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Reducer: how state changes
function cartReducer(state = { items: [] }, action) {
  if (action.type === 'cart/itemAdded') {
    return { items: [...state.items, action.payload] };
  }
  return state;
}

// Store: holds state, runs the reducer
const store = configureStore({ reducer: { cart: cartReducer } });

function AddButton() {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch({ type: 'cart/itemAdded', payload: '🍎' })}>
      Add apple
    </button>
  );
}

function CartBadge() {
  const count = useSelector(state => state.cart.items.length);
  return <p>Cart: {count}</p>;
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CartBadge />
    <AddButton />
  </Provider>
);`, walk: [
      { lines: [19], note: "**UI → action**: the click dispatches a plain object describing what happened." },
      { lines: [6, 7, 8], note: "**Reducer**: the store calls it with the current state and the action; it returns a new cart." },
      { lines: [14], note: "**Store**: `configureStore` creates it. The state shape is `{ cart: { items } }`." },
      { lines: [26], note: "**Store → UI**: `useSelector` subscribes. When the count changes, `CartBadge` re-renders." },
      { lines: [31], note: "`<Provider>` makes the store available to every component below." }
    ]},
    output: "“Cart: 0” and an **Add apple** button. Each click shows Cart: 1, 2, 3…",
    mistakes: [
      { bad: `function CartBadge() {
  const state = useSelector(s => s);
  return <p>{state.cart.items.length}</p>;
}`, good: `const count = useSelector(
  s => s.cart.items.length);`, why: "Selecting the whole state re-renders the badge on **any** change anywhere in the store. Select the smallest value you need." },
      { bad: `// In a component
store.getState().cart.items = [];`, good: `dispatch({ type: 'cart/cleared' });`, why: "Writing to state skips the reducer and subscribers. The UI won't update and DevTools won't see it." }
    ],
    practice: [
      { level: "B", q: "Put these in order: reducer, UI re-renders, dispatch, store notifies.", a: "dispatch → reducer → store notifies → UI re-renders." },
      { level: "I", q: "Add a **Clear** button that empties the cart.", a: "Dispatch `cart/cleared` and handle it in the reducer.", code: `// reducer
if (action.type === 'cart/cleared') return { items: [] };
// component
<button onClick={() => dispatch({ type: 'cart/cleared' })}>Clear</button>` },
      { level: "I", q: "Why doesn't `AddButton` re-render when the cart changes?", a: "It never calls `useSelector`, so it isn't subscribed to store changes." },
      { level: "C", q: "Where would an API call go in this flow?", a: "Not in the reducer. In middleware: a thunk (`createAsyncThunk`) that dispatches actions before and after the request, or RTK Query." }
    ],
    quiz: [
      { q: "What runs immediately after `dispatch(action)`?", options: ["The component re-renders", "The reducer", "A fetch request", "`useEffect`"], answer: 1, why: "The store passes the current state and the action to the reducer first." },
      { q: "Which component re-renders after an item is added?", options: ["Every component under `<Provider>`", "Only components whose selected value changed", "Only the one that dispatched", "None until refresh"], answer: 1, why: "`useSelector` compares its result with the previous one and skips re-render if equal." },
      { q: "Where should async logic like fetching go?", options: ["Inside the reducer", "In middleware such as thunks", "In the action object", "In `<Provider>`"], answer: 1, why: "Reducers must be pure; middleware handles side effects." }
    ],
    rev: {
      sec30: "Redux is one-way data flow: UI dispatches an action, the store runs the reducer with current state and the action, saves the returned state, then notifies subscribers. `useSelector` re-renders a component only if its selected value changed. Async work and logging go in middleware between dispatch and reducer.",
      interview: [
        { level: "basic", q: "Describe the Redux data flow.", a: "Component dispatches an action → reducer returns new state → store saves it and notifies subscribers → components using `useSelector` re-render if their slice changed." },
        { level: "intermediate", q: "What does `<Provider>` do?", a: "It puts the store in React context so `useSelector` and `useDispatch` can reach it anywhere below." },
        { level: "intermediate", q: "What is middleware in Redux?", a: "Functions that wrap `dispatch`, seeing each action before the reducer. Used for async (thunks), logging and analytics." },
        { level: "advanced", q: "Why is one-way data flow helpful for debugging?", a: "Every change is an action with a name and payload, so DevTools can log, replay and time-travel through state." },
        { level: "tricky", q: "The store uses Context via `<Provider>`. Why doesn't it re-render everything like Context does?", a: "The context holds the store object, which never changes. Components subscribe to the store and re-render only when their selected value changes." }
      ],
      cheat: [
        "UI → `dispatch(action)` → reducer → store → subscribers → UI",
        "Components never write state directly",
        "`<Provider store>` at the root",
        "`useSelector` reads + subscribes; `useDispatch` sends",
        "Re-render only if the selected value changed (`===`)",
        "Side effects live in middleware, never in reducers"
      ]
    },
    related: ["STORE-003", "STORE-008", "STORE-013", "STORE-007"]
  },

  "STORE-005": {
    tldr: "A Redux app has **one store** (single source of truth). It holds the whole state tree, runs reducers on each dispatch and tells subscribers. Create it once, at module level, and give it to `<Provider>`.",
    analogy: { icon: "🗄️", text: "One shared family calendar on the fridge. Everyone reads it and adds to it in the same place, so nobody's personal copy says something different." },
    visual: { type: "tree", title: "One store, one state tree", root: {
      label: "store", note: "configureStore({ reducer })", children: [
        { label: "state.cart", note: "cartReducer", children: [
          { label: "items: []" }, { label: "coupon: null" }
        ]},
        { label: "state.user", note: "userReducer", children: [
          { label: "name: null" }
        ]},
        { label: "state.ui", note: "uiReducer", children: [
          { label: "theme: 'light'" }
        ]}
      ]
    }},
    points: [
      "**One store per app.** Split the state into slices with a reducer each, not into many stores.",
      "The store's API: `getState()`, `dispatch(action)`, `subscribe(listener)`.",
      "Pass `reducer: { cart, user }` to `configureStore` and it combines them: `state.cart`, `state.user`.",
      "Create the store **once at module level**, not inside a component, or it resets on every render.",
      "Old `createStore` from `redux` is deprecated; use `configureStore` from Redux Toolkit."
    ],
    code: { file: "store.js", lang: "js", src: `import { configureStore } from '@reduxjs/toolkit';

function cartReducer(state = { items: [] }, action) {
  if (action.type === 'cart/itemAdded') {
    return { ...state, items: [...state.items, action.payload] };
  }
  return state;
}

function userReducer(state = { name: null }, action) {
  if (action.type === 'user/loggedIn') {
    return { ...state, name: action.payload };
  }
  return state;
}

// ONE store for the whole app, created once
export const store = configureStore({
  reducer: {
    cart: cartReducer, // → state.cart
    user: userReducer, // → state.user
  },
});

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log('user is now', store.getState().user.name)
);

store.dispatch({ type: 'user/loggedIn', payload: 'Sam' });
unsubscribe();`, walk: [
      { lines: [3, 10], note: "Each reducer owns one slice of the state and gives it a starting value." },
      { lines: [18, 19, 20, 21, 22], note: "`configureStore` combines the reducers into one state tree: `{ cart, user }`." },
      { lines: [25], note: "`getState()` returns the whole tree. On start each reducer has returned its default." },
      { lines: [27, 28, 29, 31], note: "`subscribe` runs after every dispatch. React-Redux uses this under the hood." }
    ]},
    output: "{ cart: { items: [] }, user: { name: null } }\nuser is now Sam",
    mistakes: [
      { bad: `function App() {
  const store = configureStore({ reducer });
  return <Provider store={store}>...</Provider>;
}`, good: `// store.js
export const store = configureStore({ reducer });
// main.jsx
<Provider store={store}><App /></Provider>`, why: "Creating the store in a component makes a brand-new, empty store on every render of `App`." },
      { bad: `const cartStore = configureStore({ reducer: cart });
const userStore = configureStore({ reducer: user });`, good: `const store = configureStore({
  reducer: { cart, user },
});`, why: "Multiple stores break the single source of truth; DevTools, middleware and selectors can't see the whole state." }
    ],
    practice: [
      { level: "B", q: "Which three methods does a store expose?", a: "`getState`, `dispatch`, `subscribe`." },
      { level: "B", q: "Wire the store into a React app.", a: "Wrap the root in `<Provider>`.", code: `import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

createRoot(document.getElementById('root')).render(
  <Provider store={store}><App /></Provider>
);` },
      { level: "I", q: "Add a `ui` slice with `theme: 'light'`. What does `getState()` return now?", a: "`{ cart: {...}, user: {...}, ui: { theme: 'light' } }`. Add `ui: uiReducer` to the `reducer` object." },
      { level: "C", q: "In Next.js (App Router) why do you create the store with a `makeStore()` function instead of a module constant?", a: "On the server a module constant is shared by every request and user. A per-request store keeps users' data apart." }
    ],
    quiz: [
      { q: "How many stores should a typical Redux app have?", options: ["One per component", "One per feature", "One", "None; use Context"], answer: 2, why: "Single source of truth: one store, split into slices by reducers." },
      { q: "What does `store.subscribe(fn)` return?", options: ["The new state", "An unsubscribe function", "The action", "Nothing"], answer: 1, why: "Call the returned function to stop listening." },
      { q: "With `reducer: { cart, user }`, where is the cart?", options: ["`state`", "`state.cart`", "`state.reducer.cart`", "`store.cart`"], answer: 1, why: "Each key in the reducer object becomes a key in the state tree." }
    ],
    rev: {
      sec30: "The Redux store is the single source of truth: one object holding the full state tree. It exposes `getState`, `dispatch` and `subscribe`. Build it once with `configureStore({ reducer: { cart, user } })`, which combines slice reducers, adds DevTools and middleware, and pass it to `<Provider>`. Legacy `createStore` is deprecated.",
      interview: [
        { level: "basic", q: "What is the Redux store?", a: "The object that holds the whole app state and exposes `getState`, `dispatch` and `subscribe`." },
        { level: "intermediate", q: "How do you organise state from many features in one store?", a: "Give each feature a slice reducer and combine them, e.g. `configureStore({ reducer: { cart, user } })`." },
        { level: "intermediate", q: "Why a single store rather than many?", a: "One place to inspect and debug, one middleware chain, and selectors can combine data from any slice." },
        { level: "advanced", q: "How does the store notify React?", a: "React-Redux subscribes to the store (via `useSyncExternalStore`). After each dispatch it reruns selectors and re-renders components whose result changed." },
        { level: "tricky", q: "Is a module-level store always safe?", a: "In a browser SPA yes. With server rendering (Next.js), a module store is shared across requests, so create one per request." }
      ],
      cheat: [
        "One store per app; slices inside it",
        "API: `getState()`, `dispatch()`, `subscribe()`",
        "`configureStore({ reducer: { cart, user } })` combines slices",
        "Create at module level, never in a component",
        "`<Provider store={store}>` around the app",
        "`createStore` is deprecated; use `configureStore`",
        "SSR: one store per request via `makeStore()`"
      ]
    },
    related: ["STORE-004", "STORE-012", "STORE-008"]
  },

  "STORE-006": {
    tldr: "An **action** is a plain object that describes **something that happened**: a `type` string plus optional `payload` data. Name it like an event (`cart/itemAdded`), not a command to set a field.",
    analogy: { icon: "🧾", text: "A till receipt. It doesn't change your bank balance itself; it just records \"2 bananas bought, £1\". The bank reads it and updates the balance." },
    visual: { type: "compare", title: "Name actions as events, not setters",
      left: { label: "Event style ✓", tone: "good", points: [
        "`cart/itemAdded`",
        "`checkout/orderPlaced`",
        "`todos/todoToggled`",
        "Several reducers can react to one event"
      ]},
      right: { label: "Setter style ✗", tone: "bad", points: [
        "`SET_CART_ITEMS`",
        "`SET_ORDER_STATUS` + `CLEAR_CART` + `SET_TOTAL`",
        "Logic leaks into components",
        "DevTools log reads like a list of assignments"
      ]}
    },
    points: [
      "Shape: `{ type: 'domain/eventName', payload }`. `type` is required; put data in `payload`.",
      "Actions must be **plain and serializable**: no functions, Promises, class instances or DOM events.",
      "An **action creator** is a function that returns an action: one place for the shape, no typos.",
      "Describe **what happened**; let reducers decide how state changes.",
      "RTK's `createAction` and `createSlice` generate creators for you, with `.type` and `.match()`."
    ],
    code: { file: "actions.js", lang: "js", src: `import { createAction } from '@reduxjs/toolkit';

// 1. An action is a plain object: what happened + data
const action = {
  type: 'cart/itemAdded',
  payload: { id: 7, name: 'Bananas', qty: 2 },
};

// 2. Action creator: builds the object in one place
function itemAdded(item) {
  return { type: 'cart/itemAdded', payload: item };
}

// 3. RTK does the same, plus .type and .match()
const couponApplied = createAction('cart/couponApplied');

console.log(action.type);
console.log(itemAdded({ id: 8, name: 'Milk', qty: 1 }));
console.log(couponApplied('SAVE10'));
console.log(couponApplied.type);
console.log(couponApplied.match({ type: 'cart/couponApplied' }));`, walk: [
      { lines: [4, 5, 6, 7], note: "`type` names the event as `domain/eventName`. `payload` carries the data the reducer needs." },
      { lines: [10, 11, 12], note: "An action creator keeps the shape in one place. Components call `itemAdded(item)` instead of typing objects." },
      { lines: [15], note: "`createAction` builds the creator for you; calling it puts the argument in `payload`." },
      { lines: [20, 21], note: "`.type` gives the string; `.match()` checks an action, handy in middleware and tests." }
    ]},
    output: "cart/itemAdded\n{ type: 'cart/itemAdded', payload: { id: 8, name: 'Milk', qty: 1 } }\n{ type: 'cart/couponApplied', payload: 'SAVE10' }\ncart/couponApplied\ntrue",
    mistakes: [
      { bad: `dispatch({ type: 'cart/itemAdded', payload: item, onDone: () => toast('Added') });`, good: `dispatch(itemAdded(item));
toast('Added');`, why: "Functions aren't serializable. DevTools can't record them and RTK warns in development." },
      { bad: `dispatch({ type: 'SET_TOTAL', payload: total + price });`, good: `dispatch({ type: 'cart/itemAdded', payload: { id, price } });`, why: "Setter actions push the logic into components. Send the event; let the reducer compute the total." }
    ],
    practice: [
      { level: "B", q: "Write an action for \"user marked the todo with id 3 as done\".", a: "`{ type: 'todos/todoToggled', payload: 3 }`" },
      { level: "B", q: "Which is not allowed in an action: a string, a number, a Date object, a nested plain object?", a: "The `Date` object. Store `date.toISOString()` or a timestamp number instead." },
      { level: "I", q: "Write an action creator `songAdded(title)` for a playlist.", a: "Return the object.", code: `const songAdded = title => ({ type: 'playlist/songAdded', payload: { title } });` },
      { level: "C", q: "Placing an order should empty the cart and add a row to order history. One action or two?", a: "One event, `checkout/orderPlaced`. The cart reducer and the orders reducer both respond to it." }
    ],
    quiz: [
      { q: "What field must every Redux action have?", options: ["`payload`", "`type`", "`id`", "`reducer`"], answer: 1, why: "`type` identifies the event. `payload` is optional." },
      { q: "Which action name follows the Redux style guide?", options: ["`SET_ITEMS`", "`cart/itemAdded`", "`addItemToCartNow`", "`UPDATE`"], answer: 1, why: "`domain/eventName` in past tense describes what happened." },
      { q: "Can an action include a callback function?", options: ["Yes, that's how you get results", "No, actions should be serializable plain objects", "Only in production"], answer: 1, why: "Non-serializable values break DevTools, persistence and replay." }
    ],
    rev: {
      sec30: "An action is a plain, serializable object `{ type, payload }` that describes something that happened. Use `domain/eventName` naming (`cart/itemAdded`). Action creators are functions that build actions; RTK's `createAction` and `createSlice` generate them. Model actions as events so several reducers can respond and logic stays out of components.",
      interview: [
        { level: "basic", q: "What is a Redux action?", a: "A plain object with a `type` string describing what happened, plus optional `payload` data." },
        { level: "intermediate", q: "What is an action creator and why use one?", a: "A function returning an action. It keeps the shape consistent, avoids typos, and can prepare the payload (e.g. generate an id)." },
        { level: "intermediate", q: "Why must actions be serializable?", a: "So DevTools can log and replay them, and state can be persisted or sent elsewhere. RTK's dev check warns otherwise." },
        { level: "advanced", q: "Why \"events, not setters\"?", a: "Events keep business logic in reducers, let multiple slices respond to one action, and make the action log read like a story of what users did." },
        { level: "tricky", q: "Where should you generate a random id for a new todo: the reducer or the action creator?", a: "The action creator (or RTK's `prepare` callback). Reducers must be pure, so randomness belongs before dispatch." }
      ],
      cheat: [
        "Action = `{ type, payload }` plain object",
        "Type format: `domain/eventName` (past tense)",
        "Serializable only: no functions, Promises, Dates, classes",
        "Action creator = function returning an action",
        "Events not setters: `orderPlaced`, not `SET_CART`",
        "`createAction('x/y')` → creator with `.type` and `.match()`"
      ]
    },
    related: ["STORE-007", "STORE-008", "STORE-011"]
  },

  "STORE-007": {
    tldr: "A **reducer** is a pure function `(state, action) => newState`. Same inputs, same output, no side effects, and it never edits the old state: it returns a fresh copy with the change.",
    analogy: { icon: "🧮", text: "A calculator. Type 2 + 3 and you always get 5. It doesn't phone anyone, doesn't change the 2, and doesn't care what time it is. A reducer is that predictable." },
    visual: { type: "timeline", title: "A todo reducer, action by action", frames: [
      { label: "start", state: "todos = []", note: "Reducer called with `undefined`, returns the initial state." },
      { label: "todos/added", state: "todos = [{1, 'Buy milk', done: false}]", note: "New array with the item appended." },
      { label: "todos/added", state: "todos = [milk, {2, 'Walk dog'}]", note: "Old array untouched; a new one is returned." },
      { label: "todos/toggled 1", state: "milk.done = true (new object)", note: "`map` copies the todo that changed; others are reused." },
      { label: "unknown action", state: "same state object", note: "Default case returns `state` unchanged, so nothing re-renders." }
    ]},
    points: [
      "**Pure**: output depends only on `state` and `action`. No `fetch`, `Date.now()`, `Math.random()` or logging to servers.",
      "**Immutable**: copy with spread, `map`, `filter`. Never `push`, `splice` or assign to fields of the old state.",
      "Always return state for unknown actions (the `default` case).",
      "Give state a default: `state = initialState` handles the first call.",
      "Why it matters: React-Redux spots changes by reference (`===`). Mutation keeps the same reference, so the UI doesn't update.",
      "With `createSlice` (Immer) you can write \"mutating\" code safely; the rule still holds underneath."
    ],
    code: { file: "todosReducer.js", lang: "js", src: `const initialState = { todos: [] };

export function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/added':
      return { ...state, todos: [...state.todos, action.payload] };

    case 'todos/toggled':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };

    case 'todos/removed':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// Pure = trivial to test: no store, no React needed
let s = todosReducer(undefined, { type: '@@init' });
s = todosReducer(s, {
  type: 'todos/added',
  payload: { id: 1, text: 'Buy milk', done: false },
});
s = todosReducer(s, { type: 'todos/toggled', payload: 1 });
console.log(s.todos);`, walk: [
      { lines: [3], note: "Default parameter gives the first state when the store starts." },
      { lines: [6], note: "Spread copies the outer object; `[...todos, item]` builds a new array." },
      { lines: [11, 12, 13], note: "`map` returns a new array. Only the matching todo is copied with `done` flipped." },
      { lines: [19], note: "`filter` removes without touching the original array." },
      { lines: [22, 23], note: "Unknown action: return the same state so nothing re-renders." },
      { lines: [28, 33, 34], note: "Test it by calling it like any function. No mocks, no DOM." }
    ]},
    output: "[ { id: 1, text: 'Buy milk', done: true } ]",
    mistakes: [
      { bad: `case 'todos/added':
  state.todos.push(action.payload);
  return state;`, good: `case 'todos/added':
  return { ...state, todos: [...state.todos, action.payload] };`, why: "Mutating keeps the same reference, so `useSelector` sees no change and the UI doesn't update. (Inside `createSlice`, Immer makes `push` safe.)" },
      { bad: `case 'todos/added':
  fetch('/api/todos', { method: 'POST' });
  return { ...state, todos: [...state.todos,
    { id: Date.now(), ...action.payload }] };`, good: `// id made before dispatch; save via a thunk
dispatch(todoAdded({ id: crypto.randomUUID(), text }));`, why: "Network calls and time/random values make a reducer impure: replays and tests give different results." }
    ],
    practice: [
      { level: "B", q: "Is this reducer pure? `return { ...state, updatedAt: Date.now() }`", a: "No. `Date.now()` gives a different result each call. Pass the time in the payload." },
      { level: "I", q: "Add a `todos/textEdited` case with payload `{ id, text }`.", a: "Map and copy the matching todo.", code: `case 'todos/textEdited':
  return {
    ...state,
    todos: state.todos.map(t =>
      t.id === action.payload.id ? { ...t, text: action.payload.text } : t),
  };` },
      { level: "I", q: "Write a `todos/clearedDone` case that removes finished todos.", a: "`return { ...state, todos: state.todos.filter(t => !t.done) };`" },
      { level: "C", q: "Write a test proving the reducer doesn't mutate its input.", a: "Freeze the input; mutation would throw in strict mode.", code: `const before = Object.freeze({ todos: Object.freeze([]) });
const after = todosReducer(before, { type: 'todos/added', payload: { id: 1 } });
expect(before.todos).toHaveLength(0);
expect(after).not.toBe(before);` }
    ],
    quiz: [
      { q: "Which line belongs in a reducer?", options: ["`fetch('/api/save')`", "`return { ...state, count: state.count + 1 }`", "`state.count++`", "`localStorage.setItem(...)`"], answer: 1, why: "A pure reducer just computes and returns new state." },
      { q: "What should a reducer return for an action it doesn't handle?", options: ["`undefined`", "`{}`", "The current `state`", "`null`"], answer: 2, why: "Returning the same object signals \"no change\"." },
      { q: "Why does mutating state break the UI?", options: ["It throws an error", "Reference stays the same, so change detection sees nothing", "Reducers run twice", "It clears the store"], answer: 1, why: "React-Redux compares references with `===`." }
    ],
    rev: {
      sec30: "A reducer is a pure function `(state, action) => newState`. It must not mutate state, call APIs, use random values or the clock. Copy with spread, `map` and `filter`; return the same state for unknown actions. Purity makes reducers predictable, testable and replayable, and keeps reference checks working.",
      interview: [
        { level: "basic", q: "What is a reducer?", a: "A pure function that takes current state and an action and returns the next state." },
        { level: "intermediate", q: "What makes a reducer pure?", a: "Its output depends only on its inputs, it has no side effects, and it doesn't modify its arguments." },
        { level: "intermediate", q: "Why can't reducers be async?", a: "The store needs the next state synchronously. Async work goes in thunks or RTK Query, which dispatch actions when done." },
        { level: "advanced", q: "Why does immutability matter for performance?", a: "Change detection becomes a cheap `===` check. Unchanged branches keep their reference, so `useSelector` and `memo` skip work." },
        { level: "tricky", q: "Should every reducer handle every action?", a: "No. Each slice reducer handles the actions it cares about and returns its state unchanged for the rest." }
      ],
      predict: [
        { code: `const s1 = { items: ['a'] };
const s2 = reducer(s1, { type: 'unknown' });
console.log(s1 === s2);`, answer: "true", why: "The default case returns the same state object." }
      ],
      cheat: [
        "`(state, action) => newState`",
        "Pure: no fetch, timers, random, Date, logging",
        "Never mutate: spread, `map`, `filter`, `slice`",
        "Default case: `return state`",
        "Default param gives initial state",
        "Immer in `createSlice` lets you write \"mutations\" safely"
      ]
    },
    related: ["HOOKS-008", "STATE-016", "STORE-011", "STORE-006"]
  },

  "STORE-008": {
    tldr: "`dispatch(action)` is the **only** way to change Redux state. It's synchronous: the reducer runs and subscribers are told before `dispatch` returns. In components you get it from `useDispatch()`.",
    analogy: { icon: "📮", text: "A post box. You drop a letter (action) in; you don't walk it to the office yourself. The postal system (store) takes it from there." },
    visual: { type: "flow", title: "What happens inside dispatch", steps: [
      { label: "dispatch(action)", detail: "Called from an event handler, effect or thunk." },
      { label: "Middleware", detail: "Thunks, logger, dev checks see the action first." },
      { label: "Reducer", detail: "Root reducer runs with current state; slice reducers return new slices." },
      { label: "Save + notify", detail: "Store saves the new state, then calls every subscriber." },
      { label: "UI updates", detail: "React-Redux reruns selectors and re-renders changed components." }
    ]},
    points: [
      "`store.dispatch(action)` sends an action; in React use `const dispatch = useDispatch()`.",
      "It's **synchronous**: `getState()` right after `dispatch` already shows the new state (unlike React's `setState`).",
      "It returns the action (or, for a thunk, whatever the thunk returns).",
      "Dispatch in **event handlers** or effects, never during render.",
      "Several dispatches in one click are batched by React into a single re-render."
    ],
    code: { file: "dispatch.js", lang: "js", src: `import { configureStore } from '@reduxjs/toolkit';

function playlistReducer(state = { songs: [] }, action) {
  switch (action.type) {
    case 'playlist/songAdded':
      return { songs: [...state.songs, action.payload] };
    default:
      return state;
  }
}

const store = configureStore({ reducer: playlistReducer });

store.subscribe(() =>
  console.log('listener: songs =', store.getState().songs.length)
);

const returned = store.dispatch({
  type: 'playlist/songAdded',
  payload: 'Yellow',
});

// dispatch is synchronous: state is already updated
console.log('after dispatch:', store.getState().songs);
console.log('returned:', returned.type);`, walk: [
      { lines: [12], note: "Create the store with the playlist reducer as the root." },
      { lines: [14, 15, 16], note: "A subscriber runs after every dispatch, once the state is saved." },
      { lines: [18, 19, 20, 21], note: "Send the action. Middleware, then the reducer, then the listener all run **before** this line finishes." },
      { lines: [24, 25], note: "State is already new, and `dispatch` handed the action back." }
    ]},
    output: "listener: songs = 1\nafter dispatch: [ 'Yellow' ]\nreturned: playlist/songAdded",
    mistakes: [
      { bad: `function Player() {
  const dispatch = useDispatch();
  dispatch(trackStarted()); // during render
  return <p>Playing</p>;
}`, good: `function Player() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(trackStarted()); }, [dispatch]);
  return <p>Playing</p>;
}`, why: "Dispatching during render changes the store mid-render, causing loops and warnings. Use handlers or effects (Strict Mode runs effects twice in dev only)." },
      { bad: `dispatch(songAdded);`, good: `dispatch(songAdded('Yellow'));`, why: "Passing the creator instead of calling it dispatches a function. RTK's thunk middleware runs it as a thunk, so no action reaches the reducer: a silent bug." }
    ],
    practice: [
      { level: "B", q: "Dispatch a `playlist/cleared` action from a button.", a: "Call `dispatch` in `onClick`.", code: `const dispatch = useDispatch();
<button onClick={() => dispatch({ type: 'playlist/cleared' })}>Clear</button>` },
      { level: "I", q: "After `dispatch(add)` in a click handler, does `store.getState()` show the new song?", a: "Yes. Reducers run synchronously inside dispatch. Only the React re-render happens a moment later." },
      { level: "I", q: "You dispatch 3 actions in one click. How many times does a subscribed component render?", a: "Once. React 18+ batches updates in the same event." },
      { level: "C", q: "Write a logger middleware that prints each action type.", a: "Middleware wraps `next`.", code: `const logger = store => next => action => {
  console.log('dispatching', action.type);
  return next(action);
};
configureStore({ reducer, middleware: gDM => gDM().concat(logger) });` }
    ],
    quiz: [
      { q: "Right after `store.dispatch(action)`, `store.getState()` returns…", options: ["The old state", "The new state", "A Promise", "`undefined`"], answer: 1, why: "Plain dispatch is synchronous; the reducer has already run." },
      { q: "Where is it safe to dispatch in a component?", options: ["In the render body", "In event handlers and effects", "Inside a reducer", "Inside `useSelector`"], answer: 1, why: "Render must stay pure, and reducers must never dispatch." },
      { q: "How do you get `dispatch` in a component?", options: ["`import { dispatch } from 'redux'`", "`useDispatch()`", "`useStore().state`", "`props.dispatch` always"], answer: 1, why: "`useDispatch()` returns the store's `dispatch`." }
    ],
    rev: {
      sec30: "`dispatch(action)` is the single entry point for state changes. It runs middleware, then the reducer, saves the state and notifies subscribers, all synchronously. It returns the action (or a thunk's return value). In React, call `useDispatch()` and dispatch from handlers or effects, never during render.",
      interview: [
        { level: "basic", q: "What does `dispatch` do?", a: "Sends an action to the store, which runs the reducer and notifies subscribers." },
        { level: "intermediate", q: "Is `dispatch` synchronous?", a: "Yes for plain actions. The new state is available via `getState()` immediately; React re-renders shortly after." },
        { level: "intermediate", q: "What does `dispatch` return?", a: "The dispatched action, or whatever a thunk returns, often a Promise you can `await`." },
        { level: "advanced", q: "How do thunks change dispatch?", a: "Thunk middleware intercepts functions: `dispatch(fn)` calls `fn(dispatch, getState)` instead of passing it to the reducer." },
        { level: "tricky", q: "Can a reducer dispatch another action?", a: "No. Reducers must be pure. Redux throws if you dispatch while a reducer is running. Use a thunk or listener middleware." }
      ],
      predict: [
        { code: `// fresh store: songs = []
store.dispatch({ type: 'playlist/songAdded', payload: 'A' });
store.dispatch({ type: 'playlist/songAdded', payload: 'B' });
console.log(store.getState().songs.length);`, answer: "2", why: "Each dispatch updates the state synchronously, one after the other." }
      ],
      cheat: [
        "Only way to change state: `dispatch(action)`",
        "Order: middleware → reducer → save → notify",
        "Synchronous: `getState()` is new right after",
        "Returns the action (or thunk's result)",
        "In React: `const dispatch = useDispatch()`",
        "Never dispatch during render or inside a reducer"
      ]
    },
    related: ["STORE-014", "STORE-004", "STORE-015", "STORE-006"]
  },

  "STORE-009": {
    tldr: "A **selector** is a function `state => value` that reads or derives data from the store. Keep the store minimal and compute the rest (totals, filtered lists) with selectors; memoise expensive ones with `createSelector`.",
    analogy: { icon: "🔍", text: "A saved search in your music app. The library holds every song; \"Liked rock songs\" is a view computed from it. If the library hasn't changed, the app reuses the last result." },
    visual: { type: "flow", title: "How a memoised selector decides", steps: [
      { label: "Store changes", detail: "Any action updates the store; every `useSelector` reruns." },
      { label: "Input selectors run", detail: "Cheap reads: `state.cart.items`, `state.settings.taxRate`." },
      { label: "Inputs the same?", detail: "Compared with `===` against last time." },
      { label: "Yes: return cache", detail: "Same result reference, so the component doesn't re-render." },
      { label: "No: recompute", detail: "Runs the output function and caches the new result." }
    ]},
    points: [
      "Store the **minimum**: items and tax rate. Derive the total, counts and filtered lists.",
      "Selectors put the state shape in **one place**; components just call `selectCartTotal`.",
      "`useSelector` re-renders when the result changes by `===`. Returning a **new array or object** every time causes needless re-renders.",
      "`createSelector` (Reselect, included in RTK) caches the last result and recomputes only when inputs change.",
      "Plain selectors returning a field or a primitive don't need memoising.",
      "Naming convention: `selectThing`."
    ],
    code: { file: "cartSelectors.js", lang: "js", src: `import { createSelector } from '@reduxjs/toolkit';

// Plain selectors: read one piece
export const selectItems = state => state.cart.items;
export const selectTaxRate = state => state.settings.taxRate;

// Memoised: recomputes only when inputs change
export const selectCartTotal = createSelector(
  [selectItems, selectTaxRate],
  (items, taxRate) => {
    console.log('computing total…');
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return Math.round(subtotal * (1 + taxRate) * 100) / 100;
  }
);

// Memoised list: same array back if items didn't change
export const selectExpensive = createSelector(
  [selectItems],
  items => items.filter(i => i.price > 2)
);

const state = {
  cart: { items: [{ id: 1, price: 2.5, qty: 2 }, { id: 2, price: 1, qty: 3 }] },
  settings: { taxRate: 0.2 },
};

console.log(selectCartTotal(state));
console.log(selectCartTotal(state));
console.log(selectExpensive(state) === selectExpensive(state));

// In a component:
// const total = useSelector(selectCartTotal);`, walk: [
      { lines: [4, 5], note: "Plain selectors hide the state shape. Change the shape later and only these lines change." },
      { lines: [8, 9, 10], note: "`createSelector(inputs, output)`: inputs pick the data, the output function derives the result." },
      { lines: [18, 19, 20, 21], note: "`filter` always makes a new array. Memoising returns the same one while `items` is unchanged." },
      { lines: [28, 29], note: "First call computes and logs. Second call sees identical inputs and returns the cached value." },
      { lines: [30], note: "Same reference both times, so `useSelector` won't re-render." }
    ]},
    output: "computing total…\n9.6\n9.6\ntrue",
    mistakes: [
      { bad: `const done = useSelector(
  s => s.todos.filter(t => t.done));`, good: `const selectDone = createSelector(
  [s => s.todos], todos => todos.filter(t => t.done));
const done = useSelector(selectDone);`, why: "`filter` returns a new array every time, so the component re-renders on **every** store change. React-Redux warns about this in development." },
      { bad: `// reducer keeps a copy of the total
state.cart.total = state.cart.items.reduce(...)`, good: `const total = useSelector(selectCartTotal);`, why: "Storing derived data means two sources of truth that can drift apart. Compute it with a selector instead." }
    ],
    practice: [
      { level: "B", q: "Write a selector for the number of items in the cart.", a: "Returns a number, so no memoising needed.", code: `export const selectItemCount = state => state.cart.items.length;` },
      { level: "I", q: "Write a memoised selector for todos still to do.", a: "Use `createSelector`.", code: `export const selectPending = createSelector(
  [state => state.todos],
  todos => todos.filter(t => !t.done)
);` },
      { level: "I", q: "Why doesn't `state => state.cart.items` need `createSelector`?", a: "It returns an existing reference from the store. It only changes when the reducer creates a new array." },
      { level: "C", q: "Write a selector that takes an argument: songs by artist.", a: "Pass the argument as an extra input selector.", code: `export const selectByArtist = createSelector(
  [state => state.playlist.songs, (state, artist) => artist],
  (songs, artist) => songs.filter(s => s.artist === artist)
);
// useSelector(state => selectByArtist(state, 'Adele'))` }
    ],
    quiz: [
      { q: "Why might `useSelector(s => s.items.map(i => i.name))` hurt performance?", options: ["`map` is slow", "It returns a new array each time, so the component re-renders on every store change", "Selectors can't use `map`", "It mutates state"], answer: 1, why: "A fresh array is never `===` the last one." },
      { q: "When does a `createSelector` selector recompute?", options: ["Every call", "When any of its input results change", "Only once ever", "When the component mounts"], answer: 1, why: "It compares input results with `===` and reuses the cache if all match." },
      { q: "Where should a cart total live?", options: ["In the store, updated on each action", "Computed by a selector from items", "In `localStorage`", "In a ref"], answer: 1, why: "Derived data is computed, not stored." }
    ],
    rev: {
      sec30: "Selectors are functions `state => value` that read or derive data. Keep the store minimal; compute totals and filtered lists with selectors. `useSelector` re-renders when its result changes by `===`, so returning new arrays or objects causes extra renders. `createSelector` memoises: it recomputes only when its input results change.",
      interview: [
        { level: "basic", q: "What is a selector?", a: "A function that takes the store state and returns a piece of it or a value derived from it." },
        { level: "intermediate", q: "Why use selectors instead of reading state inline?", a: "They centralise knowledge of the state shape, are reusable and testable, and can be memoised." },
        { level: "intermediate", q: "What does `createSelector` do?", a: "Builds a memoised selector: input selectors pick data, and the output function runs only when those inputs change." },
        { level: "advanced", q: "What's the cache size of a `createSelector` selector?", a: "Older Reselect cached only the last call (size 1), so different arguments kept busting it. Reselect 5 (in RTK 2) defaults to `weakMapMemoize`, which caches a result per distinct argument set." },
        { level: "tricky", q: "An input selector is `state => state.items.filter(...)`. Does memoisation work?", a: "No. The input returns a new array each time, so the output always recomputes. Inputs should just pick existing references." }
      ],
      debug: [
        { code: `const selectNames = createSelector(
  [state => state.users.map(u => u.name)],
  names => names
);`, fix: `const selectNames = createSelector(
  [state => state.users],
  users => users.map(u => u.name)
);`, why: "Transform in the output function, not the input selector, or the memoisation never hits." }
      ],
      cheat: [
        "Selector = `state => value`",
        "Store minimal state; derive the rest",
        "`useSelector` re-renders when result changes by `===`",
        "New arrays/objects every call → extra renders",
        "`createSelector([inputs], output)` memoises",
        "Inputs pick references; output transforms",
        "Name them `selectX`"
      ]
    },
    related: ["STORE-013", "STATE-022", "PERF-005", "STORE-011"]
  },

  "STORE-010": {
    tldr: "**Redux Toolkit (RTK)** is the official, recommended way to write Redux. It removes the boilerplate: `configureStore` sets up good defaults, `createSlice` writes actions and reducers for you, and Immer lets you update state with simple code.",
    analogy: { icon: "🧰", text: "A meal kit versus buying every ingredient separately. Same dinner, but the kit comes pre-measured with the recipe card, so you cook faster and make fewer mistakes." },
    visual: { type: "compare", title: "Hand-written Redux vs Redux Toolkit",
      left: { label: "Hand-written Redux (old)", tone: "bad", points: [
        "Action type constants + action creators + switch reducers",
        "Manual spread copies for every nested update",
        "Wire DevTools and thunk middleware yourself",
        "Accidental mutation bugs are easy"
      ]},
      right: { label: "Redux Toolkit (standard)", tone: "good", points: [
        "`createSlice` generates actions + reducer",
        "Immer: write `state.items.push(x)` safely",
        "`configureStore`: DevTools, thunk, dev checks built in",
        "`createAsyncThunk` and RTK Query for async and data"
      ]}
    },
    points: [
      "Install: `npm install @reduxjs/toolkit react-redux`.",
      "Core APIs: `configureStore`, `createSlice`, `createAsyncThunk`, `createSelector`, `createEntityAdapter`, plus **RTK Query** for data fetching.",
      "Development checks catch accidental mutation and non-serializable values.",
      "Same Redux underneath: one store, actions, pure reducers. RTK just writes the repetitive parts.",
      "The Redux team says: if you're writing Redux, use RTK. Hand-written `switch` reducers are legacy style."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// 1. Slice: state + reducers + generated actions
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload); // safe thanks to Immer
    },
    cleared(state) {
      state.items = [];
    },
  },
});
const { itemAdded, cleared } = cartSlice.actions;

// 2. Store: DevTools + thunk + dev checks by default
const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

// 3. Components: read with useSelector, send with useDispatch
function Shop() {
  const count = useSelector(s => s.cart.items.length);
  const dispatch = useDispatch();
  return (
    <>
      <p>🛒 {count} items</p>
      <button onClick={() => dispatch(itemAdded('🍌'))}>Add banana</button>
      <button onClick={() => dispatch(cleared())}>Clear</button>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Shop />
  </Provider>
);`, walk: [
      { lines: [6, 7, 8], note: "`createSlice` takes a name and starting state. The name prefixes action types: `cart/itemAdded`." },
      { lines: [10, 11, 12], note: "Write the update as if mutating. Immer turns it into a safe immutable copy." },
      { lines: [18], note: "Action creators are generated for you; no constants, no hand-written creators." },
      { lines: [21, 22, 23], note: "`configureStore` adds Redux DevTools, thunk middleware and dev-only mutation checks." },
      { lines: [32, 33], note: "Dispatch generated actions: `itemAdded('🍌')` becomes `{ type: 'cart/itemAdded', payload: '🍌' }`." }
    ]},
    output: "“🛒 0 items” with Add banana and Clear buttons. Each add increases the count; Clear resets it to 0.",
    mistakes: [
      { bad: `import { createStore } from 'redux';
const ADD = 'ADD';
function cart(state = [], a) {
  switch (a.type) { case ADD: return [...state, a.item]; default: return state; }
}`, good: `const cartSlice = createSlice({
  name: 'cart', initialState: [],
  reducers: { itemAdded: (state, a) => { state.push(a.payload); } },
});`, why: "Hand-written Redux is legacy style: more code and easier to get wrong. `createStore` is deprecated in favour of `configureStore`." },
      { bad: `// Fetch every API list into RTK slices
// with hand-written loading flags`, good: `// Use RTK Query (or TanStack Query)
// for server data`, why: "RTK includes RTK Query for caching server data. Don't rebuild loading, caching and refetching by hand in slices." }
    ],
    practice: [
      { level: "B", q: "Which two packages do you install for Redux in a React app?", a: "`@reduxjs/toolkit` and `react-redux`." },
      { level: "I", q: "Add an `itemRemoved(index)` reducer to the cart slice.", a: "Use `splice` on the draft.", code: `itemRemoved(state, action) {
  state.items.splice(action.payload, 1);
},` },
      { level: "I", q: "What does `configureStore` give you that `createStore` didn't?", a: "Combined slice reducers from an object, thunk middleware, DevTools, and dev checks for mutation and serializability." },
      { level: "C", q: "Migrate one old `switch` reducer to RTK without touching the rest of the app.", a: "Replace it with a `createSlice` whose action names match the old types (or handle old types in `extraReducers`), and plug `slice.reducer` into the same key." }
    ],
    quiz: [
      { q: "What is Redux Toolkit?", options: ["A different library that replaces Redux", "The official, recommended way to write Redux", "A Chrome extension", "A React hook"], answer: 1, why: "It's Redux with good defaults and less boilerplate." },
      { q: "Why is `state.items.push(x)` safe inside `createSlice`?", options: ["Redux allows mutation now", "Immer records the change and produces a new immutable state", "It isn't safe", "Arrays are copied automatically by JavaScript"], answer: 1, why: "Immer works on a draft and returns a new object." },
      { q: "Which is NOT built into `configureStore` by default?", options: ["Redux DevTools", "Thunk middleware", "Mutation checks in dev", "Persisting to localStorage"], answer: 3, why: "Persistence needs a separate library like redux-persist." }
    ],
    rev: {
      sec30: "Redux Toolkit is the official standard for Redux. `configureStore` sets up DevTools, thunk and dev checks. `createSlice` generates action creators and reducers, with Immer so you can write mutating-style updates. `createAsyncThunk` handles async; RTK Query handles server data. Same Redux principles, far less code.",
      interview: [
        { level: "basic", q: "What is Redux Toolkit?", a: "The official package for writing Redux, with helpers like `configureStore` and `createSlice` that remove boilerplate." },
        { level: "intermediate", q: "What problems does RTK solve?", a: "Boilerplate, store setup, accidental mutation and async patterns, via `createSlice`, Immer, `configureStore` and `createAsyncThunk`." },
        { level: "intermediate", q: "What does `configureStore` do by default?", a: "Combines slice reducers, adds thunk middleware, enables Redux DevTools, and adds dev-only immutability and serializability checks." },
        { level: "advanced", q: "When would you use RTK Query vs TanStack Query?", a: "RTK Query if the app already uses Redux and you want data in the same store and DevTools. TanStack Query if there's no Redux; both handle caching and invalidation." },
        { level: "tricky", q: "Does RTK mean reducers can now mutate state?", a: "Only inside `createSlice`/`createReducer`, where Immer turns mutations into immutable updates. Elsewhere state is still immutable." }
      ],
      compare: { cols: ["", "Hand-written", "RTK"], rows: [
        ["Action types", "constants by hand", "generated from slice name"],
        ["Reducers", "`switch` + spreads", "`createSlice` + Immer"],
        ["Store setup", "`createStore` + middleware + DevTools", "`configureStore()`"],
        ["Async", "custom thunks", "`createAsyncThunk`, RTK Query"]
      ]},
      cheat: [
        "RTK = official, standard way to write Redux",
        "`npm install @reduxjs/toolkit react-redux`",
        "`configureStore`: DevTools + thunk + dev checks",
        "`createSlice`: actions + reducer from one object",
        "Immer: mutating syntax, immutable result",
        "Async: `createAsyncThunk`; server data: RTK Query",
        "`createStore` is deprecated"
      ]
    },
    related: ["STORE-011", "STORE-012", "STORE-016", "STORE-003"]
  },

  "STORE-011": {
    tldr: "`createSlice` takes a **name**, an **initial state** and **reducer functions**, and generates the action creators and the slice reducer for you. Thanks to **Immer**, you write simple \"mutating\" code and get immutable updates.",
    analogy: { icon: "🍕", text: "Ordering from a menu. You list the dishes once (reducers); the restaurant prints the order slips (actions) with the right codes automatically, so nobody mistypes \"Margherita\"." },
    visual: { type: "tree", title: "What createSlice generates", root: {
      label: "createSlice({ name: 'todos' })", note: "you write name, initialState, reducers", children: [
        { label: ".actions", children: [
          { label: "todoAdded()", note: "type 'todos/todoAdded'" },
          { label: "todoToggled()", note: "type 'todos/todoToggled'" },
          { label: "todoRemoved()", note: "type 'todos/todoRemoved'" }
        ]},
        { label: ".reducer", note: "plug into configureStore" },
        { label: ".selectors", note: "read from state.todos" }
      ]
    }},
    points: [
      "Action type = `name/reducerKey`, e.g. `todos/todoAdded`. The creator puts its argument in `payload`.",
      "**Immer** gives each reducer a draft: `push`, assign, `splice` are safe and produce a new state.",
      "In a reducer, either **mutate the draft** or **return a new value**, never both.",
      "Replace the whole state by **returning** it (`return []`); `state = []` does nothing.",
      "Use a `prepare` callback to build the payload (ids, timestamps) so the reducer stays pure.",
      "React to other slices' actions with `extraReducers` (e.g. thunk results)."
    ],
    code: { file: "todosSlice.js", lang: "js", src: `import { createSlice, nanoid } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded: {
      reducer(state, action) {
        state.push(action.payload); // Immer: safe
      },
      prepare(text) {
        return { payload: { id: nanoid(), text, done: false } };
      },
    },
    todoToggled(state, action) {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    todoRemoved(state, action) {
      return state.filter(t => t.id !== action.payload);
    },
  },
  selectors: {
    selectRemaining: todos => todos.filter(t => !t.done).length,
  },
});

export const { todoAdded, todoToggled, todoRemoved } = todosSlice.actions;
export const { selectRemaining } = todosSlice.selectors;
export default todosSlice.reducer;

console.log(todoAdded.type);
console.log(todoAdded('Buy milk'));`, walk: [
      { lines: [4, 5], note: "`name` becomes the action type prefix; `initialState` is the slice's starting value." },
      { lines: [8, 9], note: "Immer hands you a draft. `push` here produces a new array behind the scenes." },
      { lines: [11, 12], note: "`prepare` shapes the payload before dispatch: random id here keeps the reducer pure." },
      { lines: [16, 17], note: "Find the todo and flip `done` directly. Only that todo gets a new object." },
      { lines: [20], note: "Or return a brand-new value. Do one or the other, not both." },
      { lines: [28, 29, 30], note: "Export generated creators, slice selectors (read `state.todos`) and the reducer for the store." }
    ]},
    output: "todos/todoAdded\n{ type: 'todos/todoAdded', payload: { id: 'V1StGXR8_Z5jdHi6B-myT', text: 'Buy milk', done: false } }  (id differs each run)",
    mistakes: [
      { bad: `todosCleared(state) {
  state = [];
}`, good: `todosCleared() {
  return [];
}`, why: "Reassigning `state` only changes a local variable; Immer never sees it. Return the new value instead." },
      { bad: `todoAdded(state, action) {
  state.push(action.payload);
  return state;
}`, good: `todoAdded(state, action) {
  state.push(action.payload);
}`, why: "Mutating the draft and returning a value makes Immer throw. Either mutate or return, not both (returning the draft itself is allowed but pointless)." },
      { bad: `todoAdded(state, action) {
  state.push({ id: Math.random(), text: action.payload });
}`, good: `todoAdded: {
  reducer: (state, action) => { state.push(action.payload); },
  prepare: text => ({ payload: { id: nanoid(), text } }),
}`, why: "Random values in the reducer make it impure. Generate them in `prepare`." }
    ],
    practice: [
      { level: "B", q: "What action type does `createSlice({ name: 'playlist', reducers: { songAdded } })` generate?", a: "`playlist/songAdded`." },
      { level: "B", q: "Write a `counterSlice` with `incremented` and `decremented`.", a: "Mutate `state.value` with Immer.", code: `const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: state => { state.value += 1; },
    decremented: state => { state.value -= 1; },
  },
});` },
      { level: "I", q: "Add `todoEdited` with payload `{ id, text }`.", a: "Find and assign.", code: `todoEdited(state, action) {
  const todo = state.find(t => t.id === action.payload.id);
  if (todo) todo.text = action.payload.text;
},` },
      { level: "C", q: "Clear the cart when `checkout/orderPlaced` (from another slice) is dispatched.", a: "Use `extraReducers` with the other slice's action creator.", code: `extraReducers: builder => {
  builder.addCase(orderPlaced, () => initialState);
},` }
    ],
    quiz: [
      { q: "Inside a `createSlice` reducer, `state.items.push(x)` is…", options: ["A bug: it mutates the store", "Safe: Immer turns it into an immutable update", "Only allowed in development", "Ignored"], answer: 1, why: "Immer tracks changes on a draft and produces new state." },
      { q: "How do you reset a slice to an empty array?", options: ["`state = []`", "`return []`", "`delete state`", "`state.length = 0; return []`"], answer: 1, why: "Returning replaces the state. Reassigning the parameter does nothing." },
      { q: "Where should a new todo's random id be generated?", options: ["Inside the reducer", "In a `prepare` callback", "In the selector", "In `configureStore`"], answer: 1, why: "`prepare` runs before dispatch, keeping the reducer pure." }
    ],
    rev: {
      sec30: "`createSlice({ name, initialState, reducers })` generates action creators (`slice.actions`, types `name/key`) and a reducer (`slice.reducer`). Immer lets reducers \"mutate\" a draft safely. Either mutate or return new state, never both; `state = x` does nothing. Use `prepare` for ids and timestamps, and `extraReducers` to respond to other slices' actions or thunks.",
      interview: [
        { level: "basic", q: "What does `createSlice` return?", a: "An object with `actions` (generated action creators), `reducer`, and optional `selectors`." },
        { level: "intermediate", q: "How can `createSlice` reducers \"mutate\" state?", a: "They run inside Immer's `produce`. Changes to the draft are recorded and a new immutable state is produced." },
        { level: "intermediate", q: "What is a `prepare` callback for?", a: "Customising the payload before it's dispatched, such as adding an id or timestamp, so the reducer stays pure." },
        { level: "advanced", q: "`reducers` vs `extraReducers`?", a: "`reducers` defines this slice's own actions and generates creators. `extraReducers` handles actions defined elsewhere, like `createAsyncThunk` results, and generates none." },
        { level: "tricky", q: "Why does `state = []` not reset the slice?", a: "It reassigns the local parameter; the draft Immer watches is unchanged. Return the new value instead." }
      ],
      predict: [
        { code: `const s = createSlice({ name: 'cart', initialState: [], reducers: { itemAdded(state, a) { state.push(a.payload); } } });
console.log(s.actions.itemAdded('🍎'));`, answer: "{ type: 'cart/itemAdded', payload: '🍎' }", why: "The type is `name/key` and the argument becomes `payload`." }
      ],
      debug: [
        { code: `reducers: {
  reset(state) {
    state = initialState;
  },
}`, fix: `reducers: {
  reset() {
    return initialState;
  },
}`, why: "Reassignment is invisible to Immer. Return the replacement state." }
      ],
      cheat: [
        "`createSlice({ name, initialState, reducers })`",
        "Action type = `name/reducerKey`",
        "`slice.actions`, `slice.reducer`, `slice.selectors`",
        "Immer: mutate the draft OR return new state, not both",
        "`state = x` does nothing; `return x` replaces",
        "`prepare` for ids/timestamps; keep reducers pure",
        "`extraReducers` for other slices' actions and thunks"
      ]
    },
    related: ["STORE-010", "STORE-007", "STORE-015", "STORE-012"]
  },
};
