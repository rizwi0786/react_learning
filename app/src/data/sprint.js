// 2-day / 15-hour interview sprint.
// items: [lessonId, 'r' | 'd']  ('r' = Interview & Revision tab, ~6 min; 'd' = Learn tab, ~12 min)
// Minutes are study time only; breaks are added by the page.

export const SPRINT_MIN = { r: 6, d: 12 };

export const DAYS = [
  { n: 1, title: 'Foundations → Hooks', goal: 'Explain how React thinks: components, props, state, effects.' },
  { n: 2, title: 'Internals → Ecosystem → Mock', goal: 'Answer the "why" questions and survive a live coding round.' },
];

export const BLOCKS = [
  // ---------- DAY 1 ----------
  {
    id: 'd1-js', day: 1, icon: '🟨', title: 'JavaScript they always ask', mins: 60,
    goal: 'React questions are often JS questions in disguise.',
    items: [['WEB-020', 'r'], ['WEB-022', 'r'], ['WEB-023', 'r'], ['WEB-024', 'r'], ['WEB-012', 'r'], ['WEB-019', 'r'], ['WEB-028', 'r'], ['WEB-029', 'r'], ['WEB-031', 'r'], ['WEB-035', 'r']],
    say: ['What a closure is, with a counter example', 'Event loop order: sync → microtasks → macrotasks', 'map vs forEach, and why React uses map'],
  },
  {
    id: 'd1-core', day: 1, icon: '⚛', title: 'What React is + JSX', mins: 60,
    goal: 'The opening questions of almost every interview.',
    items: [['INTRO-001', 'r'], ['INTRO-008', 'r'], ['INTRO-009', 'r'], ['INTRO-011', 'r'], ['JSX-001', 'r'], ['JSX-003', 'r'], ['JSX-004', 'r'], ['JSX-012', 'r'], ['COMP-005', 'r'], ['PROPS-010', 'r']],
    say: ['Declarative vs imperative in one sentence', 'What JSX compiles to (jsx() calls → objects)', 'Why fragments exist'],
  },
  {
    id: 'd1-props', day: 1, icon: '📦', title: 'Props & data flow', mins: 45,
    goal: 'How data moves between components.',
    items: [['PROPS-012', 'r'], ['PROPS-013', 'r'], ['PROPS-011', 'r'], ['PROPS-008', 'r'], ['COMM-002', 'r'], ['COMM-003', 'r'], ['COMM-005', 'r']],
    say: ['Props vs state table from memory', 'Child → parent via a callback prop', 'Three fixes for prop drilling'],
  },
  {
    id: 'd1-state', day: 1, icon: '🔁', title: 'State, deeply', mins: 90,
    goal: 'The #1 topic. Snapshots, batching, immutability.',
    items: [['STATE-004', 'd'], ['STATE-010', 'd'], ['STATE-016', 'd'], ['STATE-007', 'r'], ['STATE-008', 'r'], ['STATE-009', 'r'], ['STATE-013', 'r'], ['STATE-014', 'r'], ['STATE-019', 'r'], ['STATE-020', 'r'], ['STATE-022', 'r']],
    say: ['Why setCount(count + 1) ×3 gives +1', 'Add / remove / update an item in an array without mutating', 'How a key resets a component’s state'],
  },
  {
    id: 'd1-lists', day: 1, icon: '📋', title: 'Lists, keys & forms', mins: 60,
    goal: 'Keys and controlled inputs come up in every round.',
    items: [['COND-004', 'r'], ['COND-011', 'r'], ['COND-012', 'r'], ['COND-013', 'r'], ['EVT-002', 'r'], ['EVT-009', 'r'], ['STATE-023', 'r'], ['EVT-010', 'r'], ['EVT-011', 'r'], ['EVT-017', 'r']],
    say: ['Why index as key breaks a list with inputs', 'Why {count && <X/>} can print 0', 'Controlled vs uncontrolled input'],
  },
  {
    id: 'd1-hooks', day: 1, icon: '🪝', title: 'Core hooks', mins: 90,
    goal: 'useEffect, useRef, useReducer, useMemo, useCallback: what and when.',
    items: [['HOOKS-005', 'd'], ['HOOKS-007', 'd'], ['HOOKS-008', 'd'], ['HOOKS-009', 'd'], ['HOOKS-010', 'd'], ['HOOKS-002', 'r'], ['HOOKS-003', 'r'], ['HOOKS-006', 'r'], ['HOOKS-011', 'r'], ['HOOKS-014', 'r']],
    say: ['Effect dependency array: none vs [] vs [x]', 'Why cleanup runs, and when', 'useRef vs useState'],
  },
  {
    id: 'd1-custom', day: 1, icon: '🧩', title: 'Custom hooks & async effects', mins: 45,
    goal: 'The bridge to live coding: fetching safely.',
    items: [['HOOKS-022', 'd'], ['HOOKS-021', 'r'], ['HOOKS-025', 'r'], ['HOOKS-027', 'r'], ['API-023', 'r'], ['API-030', 'r']],
    say: ['Write useDebounce from memory', 'Cancel a fetch with AbortController in cleanup', 'Why a stale response can overwrite a newer one'],
  },

  // ---------- DAY 2 ----------
  {
    id: 'd2-render', day: 2, icon: '⚙', title: 'Rendering internals', mins: 75,
    goal: 'The "how does React actually work" round.',
    items: [['RENDER-001', 'd'], ['RENDER-005', 'd'], ['RENDER-002', 'r'], ['RENDER-003', 'r'], ['RENDER-004', 'r'], ['RENDER-006', 'r'], ['RENDER-007', 'r'], ['RENDER-008', 'r'], ['RENDER-011', 'r'], ['RENDER-015', 'r'], ['RENDER-019', 'r']],
    say: ['Trigger → render → commit, in order', 'What reconciliation compares', 'Why Strict Mode runs effects twice in dev'],
  },
  {
    id: 'd2-perf', day: 2, icon: '🚀', title: 'Performance', mins: 60,
    goal: 'When memoisation helps, and when it is noise.',
    items: [['PERF-003', 'd'], ['ADV-001', 'r'], ['PERF-005', 'r'], ['COMM-008', 'r'], ['PERF-018', 'r'], ['PERF-007', 'r'], ['PERF-010', 'r'], ['PERF-002', 'r'], ['ADV-021', 'r']],
    say: ['React.memo + useCallback: why you need both', 'How to find a slow render (Profiler)', 'What React Compiler changes'],
  },
  {
    id: 'd2-adv', day: 2, icon: '🧠', title: 'Advanced & React 19', mins: 60,
    goal: 'Suspense, error boundaries, server components.',
    items: [['ADV-002', 'r'], ['ADV-003', 'r'], ['ADV-004', 'r'], ['ADV-007', 'r'], ['RENDER-013', 'r'], ['RENDER-017', 'r'], ['ADV-015', 'r'], ['ADV-016', 'r'], ['NEXT-002', 'r'], ['NEXT-012', 'r']],
    say: ['What an error boundary cannot catch', 'Server vs Client Components', 'ref as a prop in React 19 (no forwardRef needed)'],
  },
  {
    id: 'd2-store', day: 2, icon: '🗄', title: 'State libraries', mins: 60,
    goal: 'Context vs Redux Toolkit vs Zustand vs TanStack Query.',
    items: [['STORE-001', 'r'], ['COMM-006', 'r'], ['STORE-004', 'r'], ['STORE-010', 'r'], ['STORE-011', 'r'], ['STORE-013', 'r'], ['STORE-017', 'r'], ['STORE-021', 'r'], ['STORE-020', 'r'], ['STORE-022', 'r']],
    say: ['Server state vs client state', 'When Context is enough, and when it is not', 'createSlice: what it generates'],
  },
  {
    id: 'd2-web', day: 2, icon: '🔐', title: 'Routing, APIs, auth, security', mins: 75,
    goal: 'Full-stack questions. Your ASP.NET Core experience helps here.',
    items: [['ROUTE-003', 'r'], ['ROUTE-014', 'r'], ['ROUTE-016', 'r'], ['API-014', 'r'], ['API-020', 'r'], ['AUTH-001', 'r'], ['AUTH-004', 'r'], ['AUTH-005', 'r'], ['AUTH-010', 'r'], ['SEC-001', 'r'], ['SEC-002', 'r'], ['SEC-004', 'r']],
    say: ['Protected route with <Navigate>', 'Where to store tokens and why', 'How React escapes XSS by default'],
  },
  {
    id: 'd2-ts', day: 2, icon: '🧪', title: 'TypeScript & testing', mins: 45,
    goal: 'Typed props and one good test.',
    items: [['TS-008', 'r'], ['TS-009', 'r'], ['TS-007', 'r'], ['TS-019', 'r'], ['TEST-007', 'r'], ['TEST-011', 'r'], ['TEST-013', 'r']],
    say: ['Type props with children', 'getBy vs queryBy vs findBy', 'Mock an API with MSW'],
  },
  {
    id: 'd2-mock', day: 2, icon: '🎤', title: 'Mock interview', mins: 75,
    goal: 'Pick 2 drills (~45 min), then answer the rapid-fire list out loud (~30 min).',
    items: [],
    drills: true,
    say: ['Finish two drills inside the time box', 'Answer all rapid-fire questions without peeking', 'Re-open any lesson you hesitated on'],
  },
];

// Live-coding drills for the mock block.
export const DRILLS = [
  { mins: 20, title: 'Todo list', spec: 'Add, toggle done, delete, filter All / Active / Done. Show "3 left".', tests: 'Stable keys (id, not index) · immutable updates · derived count (no extra state)', link: 'PROJ-002' },
  { mins: 25, title: 'Debounced search', spec: 'Input → wait 400 ms → fetch results. Show loading, error, empty.', tests: 'Custom useDebounce · AbortController in cleanup · no stale results', link: 'HOOKS-027' },
  { mins: 25, title: 'Products + cart', spec: 'List products, filter by category, sort by price, add to cart, show total.', tests: 'Lifted state · useMemo for filtered list · reduce for total', link: 'PROJ-008' },
];

// How to structure every answer.
export const ANSWER_FRAME = [
  ['What', 'One-line definition in plain words.'],
  ['Why', 'The problem it solves.'],
  ['Example', 'A tiny code snippet or a real case from your work.'],
  ['Trade-off', 'When not to use it, or the gotcha.'],
];

// Rapid-fire: the questions most likely to come up, with the short answer to say out loud.
export const RAPID = [
  ['What is the virtual DOM?', 'A lightweight JS description of the UI. On each render React builds a new one, compares it with the last (reconciliation) and updates only the real DOM nodes that changed.', 'RENDER-006'],
  ['Why does setCount(count + 1) three times only add 1?', 'Each render sees a fixed snapshot of state. All three calls read the same `count`. Use the updater form `setCount(c => c + 1)` to queue on the latest value.', 'STATE-010'],
  ['What is batching?', 'React groups several state updates into one re-render. Since React 18 this happens everywhere, including timeouts, promises and native events.', 'STATE-019'],
  ['Why are keys needed in lists?', 'Keys tell React which item is which between renders, so it can keep the right state and DOM node. Use a stable id; index breaks when items reorder or are removed.', 'COND-012'],
  ['Props vs state?', 'Props come from the parent and are read-only. State is owned by the component and changes trigger a re-render.', 'PROPS-012'],
  ['What does the useEffect dependency array do?', 'No array: runs after every render. `[]`: after the first render only. `[a, b]`: when a or b change. The cleanup runs before the next effect and on unmount.', 'HOOKS-005'],
  ['useMemo vs useCallback?', '`useMemo` caches a computed value; `useCallback` caches a function. Both only help when something compares by reference, like `React.memo` or an effect dependency.', 'HOOKS-010'],
  ['useRef vs useState?', 'Both persist across renders. Changing state re-renders; changing `ref.current` does not. Use refs for DOM nodes, timers and previous values.', 'HOOKS-007'],
  ['When would you use useReducer?', 'When the next state depends on the previous in several ways, or many fields change together. All update logic sits in one pure reducer function.', 'HOOKS-008'],
  ['Rules of hooks?', 'Only call hooks at the top level of a component or custom hook, never inside conditions, loops or nested functions. React relies on call order to match state.', 'HOOKS-002'],
  ['What is a custom hook?', 'A function starting with `use` that calls other hooks to reuse stateful logic. Each component that calls it gets its own state.', 'HOOKS-021'],
  ['Controlled vs uncontrolled input?', 'Controlled: React state holds the value (`value` + `onChange`). Uncontrolled: the DOM holds it and you read it with a ref or FormData.', 'EVT-010'],
  ['What is lifting state up?', 'Moving shared state to the closest common parent and passing it down as props, so siblings stay in sync.', 'STATE-021'],
  ['What is prop drilling and how do you avoid it?', 'Passing props through layers that do not use them. Fix with composition (children), Context, or a store like Zustand or Redux Toolkit.', 'PROPS-011'],
  ['When does a component re-render?', 'When its state changes, its parent re-renders, or a context it reads changes. Props changing is a result of the parent re-rendering.', 'RENDER-019'],
  ['What is reconciliation?', 'The diff step: React compares the new element tree with the old. Different type → replace the subtree; same type → update props; keys match list items.', 'RENDER-005'],
  ['Render phase vs commit phase?', 'Render: React calls your components and works out changes. It must be pure and can be paused. Commit: React applies changes to the DOM and runs effects.', 'RENDER-004'],
  ['What is Fiber?', 'React’s internal unit of work, one per component. It lets React split rendering into chunks, pause, and prioritise urgent updates (concurrent rendering).', 'RENDER-007'],
  ['Why does Strict Mode run effects twice?', 'In development only, React mounts, unmounts and remounts to expose missing cleanup. Production runs effects once.', 'RENDER-015'],
  ['What does React.memo do?', 'Skips re-rendering a component when its props are shallowly equal. Pair it with stable callbacks (`useCallback`) or it rarely helps.', 'ADV-001'],
  ['What is the React Compiler?', 'A build-time tool that auto-memoises components and values, so most manual `useMemo` / `useCallback` / `memo` becomes unnecessary.', 'ADV-021'],
  ['What is an error boundary?', 'A class component (or library wrapper) that catches render errors in its children and shows a fallback. It does not catch errors in event handlers or async code.', 'ADV-004'],
  ['What is Suspense?', 'A boundary that shows a fallback while a child is waiting, for lazy-loaded code or data read with `use()`.', 'ADV-003'],
  ['Server vs Client Components?', 'Server Components run only on the server, can read data directly and ship no JS. Client Components (`\'use client\'`) run in the browser and can use state, effects and events.', 'ADV-015'],
  ['Context vs Redux?', 'Context passes a value down the tree; every consumer re-renders when it changes. Redux Toolkit / Zustand add a store with selectors, devtools and fine-grained updates.', 'STORE-002'],
  ['Server state vs client state?', 'Server state is remote data you cache (use TanStack Query). Client state is UI-only, like a modal being open (use useState or a store).', 'STORE-021'],
  ['How do you protect a route?', 'Wrap it in a component that checks auth and returns `<Navigate to="/login" replace />` if not signed in. Real protection is always on the server.', 'ROUTE-016'],
  ['Where do you store a JWT?', 'Best: an httpOnly, Secure, SameSite cookie (JS cannot read it). localStorage is readable by any injected script (XSS risk).', 'AUTH-005'],
  ['How does React prevent XSS?', 'It escapes values in JSX by default. Danger points: `dangerouslySetInnerHTML` (sanitise with DOMPurify) and `javascript:` URLs.', 'SEC-004'],
  ['How do you stop a race condition in fetching?', 'Abort the old request in the effect cleanup with AbortController, or ignore results with a flag. TanStack Query handles it for you.', 'API-030'],
  ['What is hydration?', 'The browser attaches React event handlers to HTML that was rendered on the server. Mismatched markup causes hydration errors.', 'RENDER-017'],
  ['What is new in React 19?', 'Actions + `useActionState`, `useOptimistic`, `use()`, `ref` as a normal prop, `<title>`/`<meta>` in components, and stable Server Components.', 'HOOKS-018'],
];

export const LAST_NIGHT = [
  'Stop new topics 1 hour before sleep: only rapid-fire.',
  'Prepare 2 stories from your ASP.NET Core work: a bug you fixed and a feature you designed.',
  'Morning: 20 minutes of rapid-fire, then the cheat sheets of any block you marked weak.',
  'In the room: think out loud, ask clarifying questions, then code.',
];
