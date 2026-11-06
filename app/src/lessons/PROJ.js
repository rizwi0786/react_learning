export default {
  "PROJ-001": {
    tldr: "Build a counter with +, -, reset and a step size. One piece of component memory (state) drives the number, and its colour changes with the value (conditional styling).",
    analogy: { icon: "☕", text: "A coffee shop loyalty card: each stamp adds one, the barista can wipe it clean, and the card turns gold when you reach 10." },
    visual: { type: "tree", title: "Counter component tree", root: { label: "App", children: [
      { label: "Counter", note: "owns count + step state", children: [
        { label: "Display", note: "number + colour class" },
        { label: "StepPicker", note: "select 1 / 5 / 10" },
        { label: "Controls", note: "- / reset / + buttons" }
      ]}
    ]}},
    points: [
      "Keep **one source of truth**: `count` and `step` live in `Counter`; children only get props.",
      "Use the **updater form** `setCount(c => c + step)` so rapid clicks never read a stale value.",
      "Colour is **derived** from `count` during render: no extra state for \"is negative\".",
      "Disable buttons instead of silently ignoring clicks (e.g. no going below a minimum).",
      "Select values arrive as strings: convert with `Number(e.target.value)`."
    ],
    code: { file: "Counter.jsx", lang: "jsx", src: `import { useState } from 'react';
import './counter.css';

const MIN = -10;
const MAX = 10;

export default function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const tone = count > 0 ? 'positive' : count < 0 ? 'negative' : 'zero';

  function change(delta) {
    setCount(c => Math.min(MAX, Math.max(MIN, c + delta)));
  }

  return (
    <section className="counter">
      <p className={\`display \${tone}\`}>{count}</p>

      <label>
        Step{' '}
        <select value={step} onChange={e => setStep(Number(e.target.value))}>
          {[1, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      <div className="controls">
        <button onClick={() => change(-step)} disabled={count <= MIN}>−</button>
        <button onClick={() => setCount(0)} disabled={count === 0}>Reset</button>
        <button onClick={() => change(step)} disabled={count >= MAX}>+</button>
      </div>
    </section>
  );
}`, walk: [
      { lines: [8, 9], note: "Two pieces of state: the number and how much each click changes it." },
      { lines: [11], note: "Derived value: the colour class is worked out every render, never stored." },
      { lines: [13, 14, 15], note: "Updater form plus clamping keeps the count inside MIN..MAX." },
      { lines: [19], note: "Conditional styling: the class name changes with the value." },
      { lines: [23], note: "`<select>` gives a string; `Number()` keeps maths correct (1 + '5' would be '15')." },
      { lines: [29, 30, 31], note: "Buttons disable themselves at the limits, which is clearer than doing nothing." }
    ]},
    output: "A big 0 in grey. Click + and it turns green (1, 2...), go below zero and it turns red. Reset greys out at 0.",
    mistakes: [
      { bad: `<button onClick={setCount(count + 1)}>+</button>`, good: `<button onClick={() => setCount(c => c + 1)}>+</button>`, why: "Without the arrow, `setCount` runs during render, causing an infinite re-render loop." },
      { bad: `const [isNegative, setIsNegative] = useState(false);`, good: `const tone = count < 0 ? 'negative' : 'positive';`, why: "Storing something you can calculate means two states that can drift out of sync." }
    ],
    practice: [
      { level: "B", q: "Add a \"x2\" button that doubles the count.", a: "`setCount(c => c * 2)` (clamp it if you keep MIN/MAX)." },
      { level: "B", q: "Show \"Goal reached!\" when count hits MAX.", a: "`{count === MAX && <p>Goal reached!</p>}`" },
      { level: "I", q: "Support keyboard: ArrowUp adds, ArrowDown subtracts.", a: "Add a `keydown` listener on `window` inside `useEffect`, call `change(±step)`, and remove it in the cleanup." },
      { level: "C", q: "Keep a history list and an Undo button.", a: "Store `history` as an array of past counts; on change push the old value; Undo pops the last item and sets it as `count`." }
    ],
    quiz: [
      { q: "Why use `setCount(c => c + step)`?", options: ["It is faster", "It always uses the latest value, even with rapid clicks", "It skips the re-render", "It is required for numbers"], answer: 1, why: "The updater receives the queued value instead of this render's snapshot." },
      { q: "Where should the colour class come from?", options: ["A second `useState`", "A `useEffect` that watches count", "A value calculated from `count` during render"], answer: 2, why: "Derive, don't duplicate: it can't get out of sync." },
      { q: "`<select>` value 5 plus count 1 without `Number()` gives...", options: ["6", "'15'", "NaN"], answer: 1, why: "Form values are strings, so `+` concatenates." }
    ],
    rev: {
      sec30: "A counter shows the core React loop: state holds the number, event handlers call the setter (updater form), and the UI is derived from state, including the colour class. Limits are handled by clamping and disabling buttons.",
      interview: [
        { level: "basic", q: "Why can't the count be a normal `let` variable?", a: "It resets every render and changing it doesn't trigger a re-render. State survives and schedules an update." },
        { level: "intermediate", q: "When do you need the updater function form?", a: "When the next value depends on the previous one, especially if several updates run in one event or are async." },
        { level: "intermediate", q: "How would you apply styles based on the value?", a: "Compute a class name (or a style object) from state during render, e.g. a ternary or a `clsx` helper." },
        { level: "tricky", q: "Clicking + calls `setCount(count + 1)` twice. Result?", a: "+1, because both calls read the same snapshot. With `c => c + 1` twice it's +2." }
      ],
      cheat: [
        "`useState(0)` for the count; updater `c => c + step` for changes",
        "Derive colour/class from state; don't store it",
        "`onClick={() => fn(x)}`, never `onClick={fn(x)}`",
        "Form values are strings: `Number(e.target.value)`",
        "Disable buttons at limits for clear UX"
      ]
    },
    related: ["STATE-010", "EVT-003", "STYLE-010", "STATE-022"],
    build: {
      features: ["Show the current count", "+ and - buttons by a chosen step", "Reset to 0", "Min/max limits with disabled buttons", "Green/red/grey colour by value"],
      folders: `src/\n  components/\n    Counter.jsx\n    counter.css\n  App.jsx\n  main.jsx`,
      steps: [
        { title: "Scaffold", detail: "Create the app with Vite and clear the starter.", code: `npm create vite@latest counter -- --template react\ncd counter && npm install && npm run dev` },
        { title: "State + buttons", detail: "Add `count` state and + / - buttons using the updater form." },
        { title: "Step size", detail: "Add `step` state and a `<select>`; convert the value with `Number()`." },
        { title: "Limits", detail: "Clamp with `Math.min/Math.max` and disable buttons at MIN/MAX." },
        { title: "Conditional styling", detail: "Derive `tone` and add `.positive`, `.negative`, `.zero` CSS classes.", code: `.positive { color: green; }\n.negative { color: crimson; }\n.zero { color: gray; }` }
      ],
      stretch: ["Undo/redo history", "Persist the count in localStorage", "Keyboard shortcuts with cleanup"]
    }
  },

  "PROJ-002": {
    tldr: "Build a todo list: add, tick, delete, filter (all / active / done) and keep it after refresh with localStorage. It practises array state, stable keys and derived lists.",
    analogy: { icon: "📝", text: "A shopping list on the fridge: you add items, tick them off in the shop, cross some out, and the list is still there tomorrow." },
    visual: { type: "tree", title: "Todo app component tree", root: { label: "App", note: "todos + filter state", children: [
      { label: "AddTodoForm", note: "controlled input, onAdd" },
      { label: "FilterBar", note: "All / Active / Done" },
      { label: "TodoList", note: "receives visible todos", children: [
        { label: "TodoItem", note: "key = todo.id; toggle, delete" }
      ]},
      { label: "Footer", note: "\"3 items left\" (derived)" }
    ]}},
    points: [
      "Update arrays **immutably**: add with `[...todos, t]`, toggle with `map`, delete with `filter`.",
      "Give each todo a **stable id** (`crypto.randomUUID()`) and use it as the `key`, never the index.",
      "Store only `todos` and `filter`; the **visible list** and **items left** are derived.",
      "Load from localStorage with **lazy initial state** `useState(() => ...)`, save with `useEffect`.",
      "Wrap `JSON.parse` in `try/catch`: stored data can be missing or broken."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

const FILTERS = {
  all: () => true,
  active: t => !t.done,
  done: t => t.done,
};

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem('todos')) ?? [];
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function add(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
    setText('');
  }
  const toggle = id => setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = id => setTodos(prev => prev.filter(t => t.id !== id));

  const visible = todos.filter(FILTERS[filter]);
  const left = todos.filter(t => !t.done).length;

  return (
    <main>
      <form onSubmit={add}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Buy milk" />
        <button>Add</button>
      </form>

      {Object.keys(FILTERS).map(f => (
        <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>{f}</button>
      ))}

      {visible.length === 0 ? <p>Nothing here 🎉</p> : (
        <ul>
          {visible.map(t => (
            <li key={t.id}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
              <button onClick={() => remove(t.id)} aria-label={\`Delete \${t.text}\`}>✕</button>
            </li>
          ))}
        </ul>
      )}
      <p>{left} item{left === 1 ? '' : 's'} left</p>
    </main>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7], note: "Filters as a lookup of predicate functions: easy to add more and to render buttons from." },
      { lines: [18], note: "Lazy initial state: `loadTodos` runs once, not on every render." },
      { lines: [22, 23, 24], note: "Save to localStorage whenever `todos` changes (a sync with an outside system)." },
      { lines: [29, 32, 33], note: "Add with spread, toggle with `map` + object spread, delete with `filter`: never mutate." },
      { lines: [35, 36], note: "Visible list and count are derived during render, not stored." },
      { lines: [52], note: "`key={t.id}` keeps checkbox state attached to the right todo when filtering." }
    ]},
    output: "An input with Add, three filter buttons, and the list. Ticked items get a line-through; refresh the page and they are still there.",
    mistakes: [
      { bad: `todos.push(newTodo);\nsetTodos(todos);`, good: `setTodos(prev => [...prev, newTodo]);`, why: "Mutating keeps the same array reference, so React may skip the re-render." },
      { bad: `{visible.map((t, i) => <li key={i}>...)}`, good: `{visible.map(t => <li key={t.id}>...)}`, why: "Index keys shift when you filter or delete, so the wrong item keeps the wrong DOM state." },
      { bad: `const [visible, setVisible] = useState([]);\nuseEffect(() => setVisible(todos.filter(...)), [todos, filter]);`, good: `const visible = todos.filter(FILTERS[filter]);`, why: "Derived data in state + effect means an extra render and a chance of being out of sync." }
    ],
    practice: [
      { level: "B", q: "Add a \"Clear completed\" button.", a: "`setTodos(prev => prev.filter(t => !t.done))`" },
      { level: "I", q: "Double-click a todo to edit its text.", a: "Keep `editingId` state; render an input for that item; on Enter, `map` to replace its `text`." },
      { level: "I", q: "Move the localStorage logic into a `useLocalStorage` hook.", a: "Return `[value, setValue]`; lazy-read in `useState`, write in `useEffect` on change.", code: `function useLocalStorage(key, initial) {\n  const [v, setV] = useState(() => {\n    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }\n  });\n  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);\n  return [v, setV];\n}` },
      { level: "C", q: "Write an RTL test: add \"Milk\", tick it, check \"0 items left\".", a: "`const user = userEvent.setup()`, `await user.type(input, 'Milk{enter}')`, `await user.click(checkbox)`, then `expect(screen.getByText('0 items left')).toBeInTheDocument()`." }
    ],
    quiz: [
      { q: "Best way to toggle one todo?", options: ["`todos[i].done = !todos[i].done`", "`prev.map(t => t.id === id ? { ...t, done: !t.done } : t)`", "`prev.filter(t => t.id === id)`"], answer: 1, why: "`map` returns a new array with a new object for the changed item." },
      { q: "Why `useState(loadTodos)` instead of `useState(loadTodos())`?", options: ["It reads localStorage only on the first render", "It is required syntax", "It makes it async"], answer: 0, why: "Passing the function makes it lazy initial state." },
      { q: "Should the filtered list be stored in state?", options: ["Yes, with useEffect", "No, calculate it from todos + filter", "Only in Strict Mode"], answer: 1, why: "It is derived data." }
    ],
    rev: {
      sec30: "A todo app proves you can handle array state immutably (spread, map, filter), use stable ids as keys, derive the visible list and counts instead of storing them, and persist with lazy initial state plus a `useEffect` that writes to localStorage.",
      interview: [
        { level: "basic", q: "Why not use the array index as key?", a: "Filtering or deleting shifts indices, so React reuses DOM nodes and local state for the wrong item." },
        { level: "intermediate", q: "How do you persist todos?", a: "Read localStorage once with lazy `useState`, write it in a `useEffect` on `[todos]`, and guard `JSON.parse` with try/catch." },
        { level: "intermediate", q: "What state do you actually store?", a: "Just `todos` and `filter` (plus input text). The visible list and \"items left\" are derived each render." },
        { level: "advanced", q: "When would you switch to `useReducer`?", a: "When there are many actions (add, toggle, edit, clear, reorder). A reducer centralises the logic and is easy to unit test." },
        { level: "tricky", q: "In Strict Mode dev, your save effect runs twice on mount. Problem?", a: "No. Writing the same value twice is harmless; that's why effects should be idempotent. Production runs it once." }
      ],
      debug: [
        { code: `const remove = id => {\n  const i = todos.findIndex(t => t.id === id);\n  todos.splice(i, 1);\n  setTodos(todos);\n};`, fix: `const remove = id => setTodos(prev => prev.filter(t => t.id !== id));`, why: "`splice` mutates the same array, so React sees no change and doesn't re-render." }
      ],
      cheat: [
        "Add `[...prev, x]`, update `map`, delete `filter`",
        "Key = stable id (`crypto.randomUUID()`), not index",
        "Derive visible list and counts",
        "`useState(() => load())` for lazy init",
        "`useEffect(() => save(todos), [todos])`",
        "Guard `JSON.parse` with try/catch"
      ]
    },
    related: ["STATE-013", "COND-011", "HOOKS-026", "STATE-018"],
    build: {
      features: ["Add a todo (ignore empty input)", "Tick / untick", "Delete", "Filter: all, active, done", "\"N items left\" counter", "Survives refresh (localStorage)"],
      folders: `src/\n  components/\n    AddTodoForm.jsx\n    FilterBar.jsx\n    TodoList.jsx\n    TodoItem.jsx\n  hooks/\n    useLocalStorage.js\n  App.jsx\n  main.jsx`,
      steps: [
        { title: "Static list", detail: "Render a hard-coded array with `map` and `key={t.id}`." },
        { title: "Add form", detail: "Controlled input; `onSubmit` with `preventDefault`; append with spread." },
        { title: "Toggle + delete", detail: "Pass `onToggle(id)` and `onDelete(id)` down; use `map` and `filter`." },
        { title: "Filters", detail: "Add `filter` state and derive `visible`; show an empty state." },
        { title: "Persist", detail: "Lazy-load from localStorage; save in `useEffect`; extract `useLocalStorage`." },
        { title: "Test", detail: "Vitest + RTL: add, toggle, filter, and the counter text." }
      ],
      stretch: ["Edit in place", "Drag to reorder", "Due dates with an \"overdue\" style", "Switch to `useReducer`"]
    }
  },

  "PROJ-003": {
    tldr: "Build a calculator that works with clicks and the keyboard. All logic lives in one reducer (a state machine), so every key press is just an action.",
    analogy: { icon: "🧾", text: "A till at a cafe: each button press is a small instruction, and the till always knows if it's waiting for a number, an operator or showing a total." },
    visual: { type: "timeline", title: "Reducer steps for 12 + 3 =", frames: [
      { label: "press 1, 2", state: "display '12', op null", note: "DIGIT actions append to the display." },
      { label: "press +", state: "prev 12, op '+', display '12'", note: "OPERATOR saves the first number and waits for the next." },
      { label: "press 3", state: "prev 12, op '+', display '3'", note: "First digit after an operator starts a fresh number." },
      { label: "press =", state: "display '15', op null", note: "EQUALS calculates and clears the pending operator." },
      { label: "press C", state: "display '0'", note: "CLEAR returns the initial state." }
    ]},
    points: [
      "Model the calculator as **state + actions**: `{ display, prev, op, overwrite }` and `DIGIT`, `OPERATOR`, `EQUALS`, `CLEAR`.",
      "The reducer is **pure**: no DOM, no side effects, so it's easy to unit test without React.",
      "Buttons and the keyboard both `dispatch` the **same actions**, so there's one code path.",
      "Add the `keydown` listener in `useEffect` and **remove it in the cleanup** (Strict Mode will expose a missing cleanup).",
      "Never use `eval()`: compute with a small `switch` on the operator."
    ],
    code: { file: "Calculator.jsx", lang: "jsx", src: `import { useReducer, useEffect } from 'react';

const initial = { display: '0', prev: null, op: null, overwrite: false };

function compute(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'DIGIT': {
      if (action.digit === '.' && state.display.includes('.') && !state.overwrite) return state;
      const base = state.overwrite || state.display === '0' ? '' : state.display;
      return { ...state, display: base === '' && action.digit === '.' ? '0.' : base + action.digit, overwrite: false };
    }
    case 'OPERATOR': {
      const current = Number(state.display);
      const value = state.op && !state.overwrite ? compute(state.prev, current, state.op) : current;
      return { display: String(value), prev: value, op: action.op, overwrite: true };
    }
    case 'EQUALS': {
      if (!state.op) return state;
      const result = compute(state.prev, Number(state.display), state.op);
      return { ...initial, display: Number.isNaN(result) ? 'Error' : String(result), overwrite: true };
    }
    case 'CLEAR':
      return initial;
    default:
      return state;
  }
}

const KEYS = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];

function toAction(key) {
  if (/^[0-9.]$/.test(key)) return { type: 'DIGIT', digit: key };
  if ('+-*/'.includes(key)) return { type: 'OPERATOR', op: key };
  if (key === '=' || key === 'Enter') return { type: 'EQUALS' };
  if (key === 'Escape' || key === 'c') return { type: 'CLEAR' };
  return null;
}

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    function onKey(e) {
      const action = toAction(e.key);
      if (action) {
        e.preventDefault();
        dispatch(action);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="calc">
      <output aria-live="polite">{state.display}</output>
      <div className="keys">
        {KEYS.map(k => (
          <button key={k} onClick={() => dispatch(toAction(k))}>{k}</button>
        ))}
        <button onClick={() => dispatch({ type: 'CLEAR' })}>C</button>
      </div>
    </div>
  );
}`, walk: [
      { lines: [3], note: "The whole machine state: what's shown, the first number, the pending operator, and whether the next digit starts fresh." },
      { lines: [16, 17, 18, 19, 20], note: "DIGIT: block a second '.', and start a new number after an operator." },
      { lines: [21, 22, 23, 24], note: "OPERATOR: chain sums (12 + 3 + ...) by computing the pending op first." },
      { lines: [40, 41, 42, 43, 44, 45, 46], note: "One mapper turns a key into an action, shared by the keyboard and the buttons." },
      { lines: [51, 59, 60], note: "Global keydown listener with cleanup; `dispatch` is stable so `[]` deps are fine." },
      { lines: [67, 68], note: "Buttons dispatch the same actions as keys: one code path to test." }
    ]},
    output: "A display and a 4x4 keypad. Typing `12+3` then Enter on the keyboard shows 15; Escape resets to 0; dividing by zero shows Error.",
    mistakes: [
      { bad: `useEffect(() => {\n  const onKey = e => dispatch(toAction(e.key));\n  window.addEventListener('keydown', onKey);\n}, []);`, good: `useEffect(() => {\n  const onKey = e => dispatch(toAction(e.key));\n  window.addEventListener('keydown', onKey);\n  return () => window.removeEventListener('keydown', onKey);\n}, []);`, why: "Without cleanup, Strict Mode (dev) runs the effect twice and leaves two listeners, so each key counts double. Unmounting also leaks it." },
      { bad: `const result = eval(display);`, good: `const result = compute(prev, Number(display), op);`, why: "`eval` runs any string as code (a security risk) and fails on partial input." }
    ],
    practice: [
      { level: "B", q: "Add a Backspace key that deletes the last digit.", a: "Add a `DELETE` action: `display.slice(0, -1) || '0'`; map `Backspace` to it." },
      { level: "I", q: "Add a % button.", a: "Action `PERCENT`: `display: String(Number(state.display) / 100)`." },
      { level: "I", q: "Unit test the reducer for 2 * 3 =.", a: "Fold actions through `reducer` and assert `display === '6'`.", code: `const s = [{type:'DIGIT',digit:'2'},{type:'OPERATOR',op:'*'},{type:'DIGIT',digit:'3'},{type:'EQUALS'}]\n  .reduce(reducer, initial);\nexpect(s.display).toBe('6');` },
      { level: "C", q: "Show a history tape of the last 5 results.", a: "Add `history: []` to state; in EQUALS prepend the expression and result and `slice(0, 5)`." }
    ],
    quiz: [
      { q: "Why is a reducer a good fit here?", options: ["It's faster than useState", "Many actions change several related fields together", "Reducers can call APIs"], answer: 1, why: "Display, prev, op and overwrite change together per action; a reducer keeps that logic in one place." },
      { q: "What happens with no cleanup for `keydown` in Strict Mode dev?", options: ["Nothing", "Each key fires twice", "React throws an error"], answer: 1, why: "Dev mounts, unmounts and remounts effects, so two listeners remain." },
      { q: "A reducer may...", options: ["Call `fetch`", "Mutate `state.display`", "Return a new object based on state and action"], answer: 2, why: "Reducers are pure functions." }
    ],
    rev: {
      sec30: "A calculator is a small state machine: one reducer handles DIGIT, OPERATOR, EQUALS and CLEAR, returning new state objects. Buttons and a global keydown listener (with cleanup) dispatch the same actions. No `eval`; the reducer is unit tested without rendering.",
      interview: [
        { level: "basic", q: "useState or useReducer for a calculator?", a: "useReducer: several fields change together and the transitions are easier to read and test in one pure function." },
        { level: "intermediate", q: "How do you support the keyboard?", a: "Add a `keydown` listener on `window` in `useEffect`, map keys to actions, and remove it in cleanup." },
        { level: "intermediate", q: "Why not `eval`?", a: "It executes arbitrary code (XSS risk) and doesn't handle invalid partial input. A small `switch` is safer and testable." },
        { level: "advanced", q: "How would you test this?", a: "Unit test the reducer with action sequences, then one RTL test that clicks buttons and one that fires `keyDown` events." },
        { level: "tricky", q: "Why can the effect use `[]` deps and still dispatch correctly?", a: "`dispatch` has a stable identity and the reducer reads current state itself, so no stale closure." }
      ],
      predict: [
        { code: `// keys pressed: 9 / 0 =\nstate.display`, answer: "'Error'", why: "`compute` returns NaN for divide by zero and EQUALS turns NaN into 'Error'." }
      ],
      cheat: [
        "State machine = state object + named actions",
        "Reducer is pure: `(state, action) => newState`",
        "Same actions for clicks and keys",
        "`addEventListener` in effect + remove in cleanup",
        "`dispatch` is stable: safe in `[]` deps",
        "Never `eval` user input"
      ]
    },
    related: ["HOOKS-008", "EVT-007", "HOOKS-005", "STORE-007"],
    build: {
      features: ["Digits, decimal point, + - * /", "Chained operations (2 + 3 + 4)", "Equals and Clear", "Full keyboard support", "Divide-by-zero shows Error"],
      folders: `src/\n  calculator/\n    reducer.js\n    reducer.test.js\n    Calculator.jsx\n    calculator.css\n  App.jsx`,
      steps: [
        { title: "Design the state", detail: "Write the initial object and list the actions before any UI." },
        { title: "Write the reducer", detail: "Implement DIGIT and CLEAR first, then OPERATOR and EQUALS." },
        { title: "Test the reducer", detail: "Vitest: feed action arrays through `reduce(reducer, initial)`." },
        { title: "Keypad UI", detail: "CSS grid of buttons that dispatch actions." },
        { title: "Keyboard", detail: "Global `keydown` in `useEffect` with cleanup; reuse `toAction`." }
      ],
      stretch: ["Backspace and %", "History tape", "Operator precedence (2 + 3 * 4 = 14)"]
    }
  },

  "PROJ-004": {
    tldr: "Build a weather search: type a city, wait for a pause (debounce), fetch the forecast, and show loading, error and success states. Cancel old requests so a slow reply never overwrites a newer one.",
    analogy: { icon: "🌦️", text: "Asking a friend for the weather: you wait until you've finished saying the city name, and if you change your mind mid-sentence they ignore the old question." },
    visual: { type: "flow", title: "From keystroke to forecast", steps: [
      { label: "Type", detail: "Input updates `query` on every key (controlled input)." },
      { label: "Debounce 500 ms", detail: "`useDebounce` only passes the value on once typing pauses." },
      { label: "Fetch", detail: "Effect runs on the debounced city; status becomes **loading**." },
      { label: "Abort old", detail: "Cleanup aborts the previous request with `AbortController`." },
      { label: "Render", detail: "Show **success** data or a friendly **error** message." }
    ]},
    points: [
      "Track a **status**: `idle | loading | success | error`, not three loose booleans.",
      "**Debounce** the input so you fetch once per pause, not once per keystroke.",
      "Use `AbortController` in the effect cleanup to stop **race conditions** (old reply landing last).",
      "`fetch` doesn't reject on 404/500: check `res.ok` and throw yourself.",
      "Open-Meteo needs no API key: geocode the city, then fetch the forecast by lat/lon.",
      "In real apps, TanStack Query handles caching, retries and cancelling for you."
    ],
    code: { file: "Weather.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

async function getWeather(city, signal) {
  const geo = await fetch(
    \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(city)}&count=1\`,
    { signal }
  ).then(r => r.json());
  const place = geo.results?.[0];
  if (!place) throw new Error(\`No city called "\${city}"\`);

  const res = await fetch(
    \`https://api.open-meteo.com/v1/forecast?latitude=\${place.latitude}&longitude=\${place.longitude}&current=temperature_2m,wind_speed_10m\`,
    { signal }
  );
  if (!res.ok) throw new Error(\`Weather service error \${res.status}\`);
  const data = await res.json();
  return { name: place.name, country: place.country, ...data.current };
}

export default function Weather() {
  const [query, setQuery] = useState('');
  const city = useDebounce(query.trim());
  const [state, setState] = useState({ status: 'idle' });

  useEffect(() => {
    if (!city) return;
    const controller = new AbortController();
    setState({ status: 'loading' });
    getWeather(city, controller.signal)
      .then(data => setState({ status: 'success', data }))
      .catch(err => {
        if (err.name !== 'AbortError') setState({ status: 'error', message: err.message });
      });
    return () => controller.abort();
  }, [city]);

  return (
    <main>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a city…" />
      {state.status === 'loading' && <p>Loading…</p>}
      {state.status === 'error' && <p role="alert">⚠️ {state.message}</p>}
      {state.status === 'success' && (
        <article>
          <h2>{state.data.name}, {state.data.country}</h2>
          <p>🌡️ {state.data.temperature_2m} °C · 💨 {state.data.wind_speed_10m} km/h</p>
        </article>
      )}
    </main>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9, 10], note: "Debounce hook: each new value cancels the previous timer, so only the last one survives the pause." },
      { lines: [17, 18], note: "Unknown city becomes a real error with a friendly message." },
      { lines: [24], note: "`fetch` resolves on HTTP errors, so check `res.ok` and throw." },
      { lines: [30, 31], note: "The input updates instantly; the fetch depends on the debounced `city`." },
      { lines: [37, 38, 39], note: "One status object: loading, then success or error." },
      { lines: [41, 43], note: "Ignore AbortError; cleanup aborts the old request when `city` changes." }
    ]},
    output: "Type \"Lon\"… pause… \"London, United Kingdom 🌡️ 12.3 °C · 💨 14 km/h\". Type \"zzzz\" and see a ⚠️ \"No city called...\" alert.",
    mistakes: [
      { bad: `useEffect(() => {\n  fetch(url).then(r => r.json()).then(setData);\n}, [city]);`, good: `useEffect(() => {\n  const c = new AbortController();\n  fetch(url, { signal: c.signal }).then(r => r.json()).then(setData).catch(() => {});\n  return () => c.abort();\n}, [city]);`, why: "Without abort, a slow reply for \"Lon\" can arrive after \"London\" and show the wrong city." },
      { bad: `const [loading, setLoading] = useState(false);\nconst [error, setError] = useState(null);\nconst [data, setData] = useState(null);`, good: `const [state, setState] = useState({ status: 'idle' });`, why: "Separate booleans allow impossible combos like loading + error at once." }
    ],
    practice: [
      { level: "B", q: "Show \"Type a city to start\" in the idle state.", a: "`{state.status === 'idle' && <p>Type a city to start</p>}`" },
      { level: "I", q: "Add a °C / °F toggle.", a: "Keep `unit` state; pass `&temperature_unit=fahrenheit` to the API, or convert `c * 9 / 5 + 32` when rendering." },
      { level: "I", q: "Remember the last 5 searched cities.", a: "On success, prepend `name` to a `recent` array (deduplicated, `slice(0, 5)`) stored with `useLocalStorage`." },
      { level: "C", q: "Rewrite the fetching with TanStack Query.", a: "`useQuery({ queryKey: ['weather', city], queryFn: ({ signal }) => getWeather(city, signal), enabled: !!city })`. Query passes the signal and cancels for you." }
    ],
    quiz: [
      { q: "What problem does debouncing solve here?", options: ["Slow rendering", "A request on every keystroke", "CORS errors"], answer: 1, why: "It waits for a pause so only the final value triggers a fetch." },
      { q: "`fetch` to a URL that returns 500...", options: ["Rejects the promise", "Resolves with `res.ok === false`", "Throws a SyntaxError"], answer: 1, why: "Only network failures reject; check `res.ok`." },
      { q: "What does the cleanup `controller.abort()` prevent?", options: ["Memory leaks only", "A stale reply overwriting newer results", "Double rendering"], answer: 1, why: "It cancels the old request when the city changes." }
    ],
    rev: {
      sec30: "Weather search = controlled input + debounce + fetch in an effect keyed on the debounced value. Use one status (idle/loading/success/error), check `res.ok`, and abort the previous request in cleanup to avoid race conditions. In production, TanStack Query adds caching and retries.",
      interview: [
        { level: "basic", q: "How do you show loading and errors?", a: "Keep a status in state, set it to loading before the fetch, then success with data or error with a message, and render each branch." },
        { level: "intermediate", q: "Debounce vs throttle for search?", a: "Debounce: wait until typing stops, then fire once. Throttle fires at most every N ms during typing. Search wants debounce." },
        { level: "intermediate", q: "What is a race condition in fetching?", a: "Two requests in flight; the older one finishes last and overwrites the newer result. Fix with AbortController or an `ignore` flag in cleanup." },
        { level: "advanced", q: "Why might you replace this with TanStack Query?", a: "It caches by key, deduplicates requests, retries, cancels via `signal`, and refetches on focus, which you'd otherwise hand-write." },
        { level: "tricky", q: "The page starts with a default city. In Strict Mode dev, one request shows as cancelled on mount. Bug?", a: "No. Dev runs effect, cleanup, effect again, so the first request is aborted. Production sends one." }
      ],
      scenario: [
        { q: "Users on slow 3G see the wrong city flash. What do you do?", a: "Abort previous requests in cleanup, keep the debounce, and show a loading state so the old data isn't mistaken for new." }
      ],
      cheat: [
        "Status: idle | loading | success | error",
        "Debounce input, fetch on the debounced value",
        "`AbortController` + cleanup = no race conditions",
        "Check `res.ok`; fetch only rejects on network errors",
        "Ignore `AbortError` in catch",
        "TanStack Query: caching, retries, cancellation built in"
      ]
    },
    related: ["API-026", "API-030", "HOOKS-027", "STORE-020"],
    build: {
      features: ["City search input", "Debounced requests (500 ms)", "Loading, error and empty states", "Current temperature and wind", "Cancels stale requests"],
      folders: `src/\n  api/\n    weather.js\n  hooks/\n    useDebounce.js\n  components/\n    SearchBox.jsx\n    WeatherCard.jsx\n  App.jsx`,
      steps: [
        { title: "API module", detail: "Write `getWeather(city, signal)` with Open-Meteo geocoding + forecast." },
        { title: "Search input", detail: "Controlled input for `query`." },
        { title: "Debounce", detail: "Write `useDebounce` and fetch only on its output." },
        { title: "Status UI", detail: "Render loading, error (role=\"alert\") and success branches." },
        { title: "Cancellation", detail: "AbortController in the effect; ignore AbortError." },
        { title: "Test", detail: "MSW mocks both endpoints; RTL waits for the city name with `findByText`." }
      ],
      stretch: ["5-day forecast list", "Use the browser's location", "°C / °F toggle", "Port to TanStack Query"]
    }
  },

  "PROJ-005": {
    tldr: "Build an expense tracker: a form adds expenses, totals and per-category sums are calculated from the list (derived data), and a simple bar chart shows where the money went.",
    analogy: { icon: "👛", text: "A purse with receipts: you only keep the receipts. The monthly total and \"how much on food\" are worked out by adding them up, not written down separately." },
    visual: { type: "tree", title: "Expense tracker component tree", root: { label: "App", note: "expenses state (source of truth)", children: [
      { label: "ExpenseForm", note: "title, amount, category" },
      { label: "Summary", note: "total (derived)" },
      { label: "CategoryChart", note: "sums per category (derived)", children: [ { label: "Bar", note: "width = share of total" } ] },
      { label: "ExpenseList", children: [ { label: "ExpenseRow", note: "delete button" } ] }
    ]}},
    points: [
      "Store **only the expenses**. Totals, per-category sums and chart data are **derived** with `reduce`.",
      "Store money as **integer pence** (`Math.round(amount * 100)`) to avoid `0.1 + 0.2` errors.",
      "Validate on submit: required title, amount > 0; show a clear error message.",
      "Use `useMemo` only if the list is large and the calculation is measurably slow.",
      "Format with `Intl.NumberFormat` for currency, not string concatenation.",
      "For richer charts use a library like Recharts; the data shape (array of `{ name, value }`) is the same."
    ],
    code: { file: "ExpenseTracker.jsx", lang: "jsx", src: `import { useState } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Fun', 'Bills'];
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

function ExpenseForm({ onAdd }) {
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get('title').trim();
    const cents = Math.round(Number(form.get('amount')) * 100);
    if (!title || !(cents > 0)) return setError('Enter a title and an amount above 0');
    onAdd({ id: crypto.randomUUID(), title, cents, category: form.get('category') });
    setError('');
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Lunch" />
      <input name="amount" type="number" step="0.01" placeholder="8.50" />
      <select name="category">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
      <button>Add</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

function CategoryChart({ expenses, total }) {
  const sums = CATEGORIES.map(name => ({
    name,
    value: expenses.filter(e => e.category === name).reduce((s, e) => s + e.cents, 0),
  }));
  return (
    <ul className="chart">
      {sums.map(({ name, value }) => (
        <li key={name}>
          {name}
          <span className="bar" style={{ width: \`\${total ? (value / total) * 100 : 0}%\` }} />
          {money.format(value / 100)}
        </li>
      ))}
    </ul>
  );
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const total = expenses.reduce((sum, e) => sum + e.cents, 0);

  return (
    <main>
      <ExpenseForm onAdd={exp => setExpenses(prev => [exp, ...prev])} />
      <h2>Total: {money.format(total / 100)}</h2>
      <CategoryChart expenses={expenses} total={total} />
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.title} · {e.category} · {money.format(e.cents / 100)}
            <button onClick={() => setExpenses(prev => prev.filter(x => x.id !== e.id))}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  );
}`, walk: [
      { lines: [4], note: "Create the currency formatter once; it handles symbols and decimals." },
      { lines: [11, 12, 13], note: "Read the uncontrolled form with `FormData`; convert pounds to integer pence." },
      { lines: [14], note: "Validate before adding; show one clear message." },
      { lines: [32, 33, 34, 35], note: "Chart data is derived: filter by category, then `reduce` to a sum." },
      { lines: [41], note: "Bar width is the category's share of the total, as a percentage." },
      { lines: [51], note: "The total is calculated every render from the source list." }
    ]},
    output: "Add \"Lunch 8.50 Food\" and \"Bus 2.40 Transport\": Total £10.90, the Food bar fills ~78%, Transport ~22%.",
    mistakes: [
      { bad: `const [total, setTotal] = useState(0);\n// ...and remember to update it on add AND delete`, good: `const total = expenses.reduce((s, e) => s + e.cents, 0);`, why: "A stored total gets out of sync the first time you forget to update it (e.g. on delete)." },
      { bad: `total + Number(amount) // 0.1 + 0.2 = 0.30000000000000004`, good: `const cents = Math.round(Number(amount) * 100);`, why: "Floating-point maths gives rounding errors; integer pence are exact." }
    ],
    practice: [
      { level: "B", q: "Show the biggest single expense.", a: "Derive it: `expenses.reduce((max, e) => (!max || e.cents > max.cents ? e : max), null)`." },
      { level: "I", q: "Add a month filter.", a: "Store `date` on each expense and a `month` state like `'2026-11'`; derive `visible = expenses.filter(e => e.date.startsWith(month))` and the total from that." },
      { level: "I", q: "Swap the CSS bars for a Recharts `BarChart`.", a: "Pass the same `sums` array: `<BarChart data={sums}><XAxis dataKey=\"name\" /><Bar dataKey=\"value\" /></BarChart>` inside a `ResponsiveContainer`." },
      { level: "C", q: "Add a monthly budget per category with a warning colour above 80%.", a: "Store `budgets` as `{ Food: 20000, ... }`; derive `ratio = sum / budget` and pick a class when `ratio > 0.8`." }
    ],
    quiz: [
      { q: "Where should the total come from?", options: ["Its own state, updated on add", "Calculated from expenses each render", "A useEffect that sets state"], answer: 1, why: "Derived data can't drift from the source list." },
      { q: "Why store amounts as pence?", options: ["Smaller numbers", "Integers avoid floating-point rounding errors", "Inputs only accept integers"], answer: 1, why: "`0.1 + 0.2 !== 0.3` in JavaScript." },
      { q: "When is `useMemo` worth adding for the totals?", options: ["Always", "When profiling shows the calculation is slow", "Never with arrays"], answer: 1, why: "Summing a few hundred items is trivial; memo has its own cost." }
    ],
    rev: {
      sec30: "Expense tracker: one array of expenses in state; totals, category sums and chart data are derived with `reduce`. Money is stored as integer pence and formatted with `Intl.NumberFormat`. Forms validate on submit. Charts just need an array of `{ name, value }`.",
      interview: [
        { level: "basic", q: "What is derived state?", a: "A value you can calculate from existing state or props. Compute it during render instead of storing it." },
        { level: "intermediate", q: "How do you handle money in JavaScript?", a: "Use integer minor units (pence/cents) for maths and `Intl.NumberFormat` for display; the server is the final authority." },
        { level: "intermediate", q: "Controlled or uncontrolled form here?", a: "Either. Uncontrolled + `FormData` is simple for submit-only forms; controlled is better for live validation or dependent fields." },
        { level: "advanced", q: "The list grows to 50,000 rows. What changes?", a: "Memoise the aggregates with `useMemo`, virtualise the list, and ideally let the server aggregate per month." },
        { level: "tricky", q: "`useEffect(() => setTotal(sum(expenses)), [expenses])`: what's wrong?", a: "It works but adds an extra render with a stale total first, and it's more code. Calculate it inline." }
      ],
      cheat: [
        "Store expenses only; derive total and sums",
        "Money in integer pence",
        "`Intl.NumberFormat` for currency",
        "`FormData` reads uncontrolled forms",
        "Chart data = `[{ name, value }]`",
        "`useMemo` only after measuring"
      ]
    },
    related: ["STATE-022", "EVT-017", "EVT-020", "PERF-017"],
    build: {
      features: ["Add expense: title, amount, category", "Validation with an error message", "Delete expense", "Total in currency format", "Per-category bar chart", "Persist to localStorage"],
      folders: `src/\n  components/\n    ExpenseForm.jsx\n    ExpenseList.jsx\n    CategoryChart.jsx\n  lib/\n    money.js\n  hooks/\n    useLocalStorage.js\n  App.jsx`,
      steps: [
        { title: "Data model", detail: "Decide `{ id, title, cents, category, date }`." },
        { title: "Form", detail: "Submit handler with `FormData`, validation, and reset." },
        { title: "List + delete", detail: "Render with `key={e.id}`; delete with `filter`." },
        { title: "Totals", detail: "Derive total and category sums with `reduce`; format with Intl." },
        { title: "Chart", detail: "CSS bars sized by percentage, or Recharts with the same data." },
        { title: "Persist + test", detail: "`useLocalStorage`; RTL test that adding two expenses shows the right total." }
      ],
      stretch: ["Month filter and comparison", "Budgets per category", "Export to CSV", "Recharts pie chart"]
    }
  },

  "PROJ-006": {
    tldr: "Build a multi-page notes app with React Router 7: a list page with search in the URL, a note page at `/notes/:id`, and notes saved in localStorage.",
    analogy: { icon: "📒", text: "A recipe notebook with a contents page: the contents page lists every note, each note has its own page number (URL), and the notebook stays in your bag (storage)." },
    visual: { type: "tree", title: "Notes app routes", root: { label: "Root layout", note: "notes state + <Outlet>", children: [
      { label: "/ (index)", note: "NotesList + search ?q=", children: [ { label: "NoteCard", note: "<Link to=/notes/:id>" } ] },
      { label: "/notes/:id", note: "NoteEditor (useParams)" },
      { label: "/new", note: "creates a note, navigates" },
      { label: "* (404)", note: "NotFound" }
    ]}},
    points: [
      "Use a **layout route** that owns the notes and shares them via `<Outlet context>` + `useOutletContext()`.",
      "Put the search text in the URL (`useSearchParams`) so it survives refresh and can be shared.",
      "Read the note id with `useParams()`; handle a missing note with a friendly message.",
      "After creating a note, move with `useNavigate()` to its page.",
      "Persist with a `useLocalStorage` hook. For a real backend, use loaders/actions or TanStack Query.",
      "Import everything from `react-router` (v7)."
    ],
    code: { file: "main.jsx", lang: "jsx", src: `import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import {
  createBrowserRouter, RouterProvider, Outlet, Link,
  useOutletContext, useParams, useSearchParams, useNavigate,
} from 'react-router';

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function Root() {
  const [notes, setNotes] = useLocalStorage('notes', []);
  return (
    <>
      <header><Link to="/">📒 Notes</Link> · <Link to="/new">+ New</Link></header>
      <Outlet context={{ notes, setNotes }} />
    </>
  );
}

function NotesList() {
  const { notes } = useOutletContext();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const visible = notes.filter(n => n.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <input value={q} placeholder="Search…"
        onChange={e => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} />
      {visible.length === 0 && <p>No notes found.</p>}
      <ul>{visible.map(n => <li key={n.id}><Link to={\`/notes/\${n.id}\`}>{n.title || 'Untitled'}</Link></li>)}</ul>
    </>
  );
}

function NewNote() {
  const { setNotes } = useOutletContext();
  const navigate = useNavigate();
  function create() {
    const id = crypto.randomUUID();
    setNotes(prev => [{ id, title: '', body: '' }, ...prev]);
    navigate(\`/notes/\${id}\`);
  }
  return <button onClick={create}>Create a blank note</button>;
}

function NoteEditor() {
  const { id } = useParams();
  const { notes, setNotes } = useOutletContext();
  const note = notes.find(n => n.id === id);
  if (!note) return <p>Note not found. <Link to="/">Back</Link></p>;

  const update = field => e =>
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, [field]: e.target.value } : n)));

  return (
    <article>
      <input value={note.title} onChange={update('title')} placeholder="Title" />
      <textarea value={note.body} onChange={update('body')} rows={10} />
      <button onClick={() => setNotes(prev => prev.filter(n => n.id !== id))}>Delete</button>
    </article>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <Root />, children: [
    { index: true, element: <NotesList /> },
    { path: 'new', element: <NewNote /> },
    { path: 'notes/:id', element: <NoteEditor /> },
    { path: '*', element: <p>404: page not found</p> },
  ]},
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);`, walk: [
      { lines: [3, 4, 5, 6], note: "React Router 7: everything comes from the `react-router` package." },
      { lines: [16, 17, 21], note: "Layout route owns the notes and passes them to child pages through the Outlet." },
      { lines: [28, 29, 30], note: "Search lives in the URL: `?q=soup`. The visible list is derived from it." },
      { lines: [35], note: "`replace: true` stops every keystroke adding a history entry." },
      { lines: [45, 46, 47, 48], note: "Create in an event handler, then navigate to the new note's page." },
      { lines: [54, 56, 57], note: "`useParams` gives the id; a missing note gets a friendly message instead of a crash." }
    ]},
    output: "Header with \"Notes\" and \"+ New\". Create opens /notes/<id> with an empty editor. Typing \"Soup\" in search shows /?q=Soup and only matching notes.",
    mistakes: [
      { bad: `<a href={\`/notes/\${n.id}\`}>{n.title}</a>`, good: `<Link to={\`/notes/\${n.id}\`}>{n.title}</Link>`, why: "A plain `<a>` reloads the whole page and throws away in-memory state." },
      { bad: `const [q, setQ] = useState('');`, good: `const [params, setParams] = useSearchParams();\nconst q = params.get('q') ?? '';`, why: "Search in local state is lost on refresh and can't be shared as a link." },
      { bad: `useEffect(() => {\n  setNotes(prev => [newNote, ...prev]);\n  navigate('/notes/' + newNote.id);\n}, []);`, good: `function create() {\n  setNotes(prev => [newNote, ...prev]);\n  navigate('/notes/' + newNote.id);\n}`, why: "Creating data in a mount effect runs twice in Strict Mode dev (two notes). User actions belong in event handlers." }
    ],
    practice: [
      { level: "B", q: "Show \"Last edited\" time on each note.", a: "Set `updatedAt: Date.now()` in `update`; render `new Date(n.updatedAt).toLocaleString()`." },
      { level: "I", q: "After deleting, go back to the list.", a: "Call `navigate('/')` after `setNotes` in the Delete handler." },
      { level: "I", q: "Search the body too, and sort newest first.", a: "Filter on `title + body`; `visible.toSorted((a, b) => b.updatedAt - a.updatedAt)`." },
      { level: "C", q: "Replace the context with route loaders and actions.", a: "Give `notes/:id` a `loader` that reads the note and an `action` that saves it; submit with `<Form method=\"post\">` and read data with `useLoaderData()`." }
    ],
    quiz: [
      { q: "Why store the search in `?q=`?", options: ["It's faster", "It survives refresh and can be shared", "React Router requires it"], answer: 1, why: "The URL is state the user can bookmark and share." },
      { q: "How does `NoteEditor` know which note to show?", options: ["`useParams()` reads `:id` from the URL", "A prop from `RouterProvider`", "`useLocation().state`"], answer: 0, why: "Dynamic segments become params." },
      { q: "Which import is correct for React Router 7?", options: ["`@reach/router`", "`react-router`", "`@react-router/web`"], answer: 1, why: "v7 merged everything into `react-router`." }
    ],
    rev: {
      sec30: "A notes app shows client routing with React Router 7: a layout route with `<Outlet>`, an index list, a dynamic `notes/:id` page via `useParams`, search in the URL via `useSearchParams`, navigation with `Link`/`useNavigate`, a 404 route, and persistence through a `useLocalStorage` hook.",
      interview: [
        { level: "basic", q: "Link vs `<a>`?", a: "`Link` changes the URL with the History API and renders the new route without a page reload; `<a>` reloads everything." },
        { level: "intermediate", q: "Where would you keep filter/search state?", a: "In the URL with `useSearchParams` when it should survive refresh or be shareable; otherwise local state." },
        { level: "intermediate", q: "How do child routes get shared data from a layout?", a: "Via `<Outlet context={...}>` and `useOutletContext()`, or a context provider, or each route's loader." },
        { level: "advanced", q: "How would this change with a real API?", a: "Use loaders to fetch notes per route and actions for create/update/delete, or TanStack Query with mutations and cache invalidation." },
        { level: "tricky", q: "Typing in the search box fills the Back button history. Fix?", a: "Pass `{ replace: true }` to `setSearchParams` so each keystroke replaces the entry." }
      ],
      debug: [
        { code: `{ path: '/notes/:id', element: <NoteEditor /> }\n// inside NoteEditor\nconst id = useParams();`, fix: `const { id } = useParams();`, why: "`useParams` returns an object of all params, not the value itself." }
      ],
      cheat: [
        "`createBrowserRouter` + `RouterProvider`, from `react-router`",
        "Layout route + `<Outlet context>`",
        "`useParams()` for `:id`",
        "`useSearchParams()` for `?q=`; `replace: true` while typing",
        "`useNavigate()` after create/delete",
        "`path: '*'` for 404"
      ]
    },
    related: ["ROUTE-012", "ROUTE-013", "ROUTE-015", "HOOKS-026"],
    build: {
      features: ["List of notes with search", "Search stored in the URL", "Create a note and open it", "Edit title and body", "Delete a note", "Saved in localStorage", "404 page"],
      folders: `src/\n  routes/\n    Root.jsx\n    NotesList.jsx\n    NoteEditor.jsx\n    NewNote.jsx\n    NotFound.jsx\n  hooks/\n    useLocalStorage.js\n  router.jsx\n  main.jsx`,
      steps: [
        { title: "Install", detail: "Add React Router 7.", code: `npm install react-router` },
        { title: "Routes", detail: "Define the router with a Root layout, index, `notes/:id`, `new` and `*`." },
        { title: "Shared data", detail: "Notes in Root via `useLocalStorage`, passed with `<Outlet context>`." },
        { title: "List + search", detail: "`useSearchParams` for `q`; derive the visible list." },
        { title: "Editor", detail: "`useParams`, controlled inputs, delete + navigate." },
        { title: "Test", detail: "Render with `createMemoryRouter` in tests and assert navigation." }
      ],
      stretch: ["Markdown preview", "Tags with a tag filter", "Loaders/actions instead of context", "Autosave indicator"]
    }
  },

  "PROJ-007": {
    tldr: "Build a product listing page where category, search, sort and page all live in the URL. The visible products are derived from the URL, so refresh, Back and shared links all just work.",
    analogy: { icon: "🛍️", text: "An online shop's filter sidebar: pick \"Shoes\", sort by price, go to page 2, then copy the link to a friend and they see exactly the same list." },
    visual: { type: "flow", title: "URL in, products out", steps: [
      { label: "Read URL", detail: "`?category=shoes&sort=price-asc&page=2` via `useSearchParams`." },
      { label: "Filter", detail: "Keep products matching category and search text." },
      { label: "Sort", detail: "Sort a copy with `toSorted` (never sort the original)." },
      { label: "Paginate", detail: "`slice((page - 1) * size, page * size)` and work out total pages." },
      { label: "Update URL", detail: "Changing a filter writes the URL and resets `page` to 1." }
    ]},
    points: [
      "The **URL is the state**: no `useState` for filters. Read with `useSearchParams`, write with `setSearchParams`.",
      "Pipeline: **filter → sort → paginate**, all derived during render.",
      "Changing a filter or sort should **reset page to 1**, or you can land on an empty page.",
      "`sort` mutates: always sort a **copy** (`toSorted` or `[...arr].sort`).",
      "For big catalogues, send the same params to the **server** (`?page=2&sort=price-asc`) instead of filtering in the browser."
    ],
    code: { file: "ProductList.jsx", lang: "jsx", src: `import { useSearchParams } from 'react-router';
import { products } from './products';

const PAGE_SIZE = 6;
const SORTS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const q = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'name';
  const page = Math.max(1, Number(params.get('page')) || 1);

  function update(changes) {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(changes)) {
        if (v === '' || v === 'all') next.delete(k);
        else next.set(k, String(v));
      }
      if (!('page' in changes)) next.delete('page');
      return next;
    });
  }

  const filtered = products
    .filter(p => category === 'all' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  const sorted = filtered.toSorted(SORTS[sort] ?? SORTS.name);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <main>
      <input value={q} placeholder="Search" onChange={e => update({ q: e.target.value })} />
      <select value={category} onChange={e => update({ category: e.target.value })}>
        {['all', 'shoes', 'bags', 'hats'].map(c => <option key={c}>{c}</option>)}
      </select>
      <select value={sort} onChange={e => update({ sort: e.target.value })}>
        <option value="name">Name</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
      </select>

      <p>{sorted.length} products</p>
      <ul className="grid">
        {visible.map(p => <li key={p.id}>{p.name} · £{p.price}</li>)}
      </ul>

      <nav aria-label="Pagination">
        <button disabled={current === 1} onClick={() => update({ page: current - 1 })}>Prev</button>
        <span> Page {current} of {totalPages} </span>
        <button disabled={current === totalPages} onClick={() => update({ page: current + 1 })}>Next</button>
      </nav>
    </main>
  );
}`, walk: [
      { lines: [12, 13, 14, 15, 16], note: "Every filter is read from the URL with a safe default; `page` is clamped to a number >= 1." },
      { lines: [18, 19, 20, 25, 26], note: "One `update` helper merges changes into the URL and resets `page` unless it's the page being changed." },
      { lines: [22], note: "Drop default values so URLs stay short and clean." },
      { lines: [30, 31, 32, 33], note: "Filter then sort a copy (`toSorted` never mutates the original array)." },
      { lines: [34, 35, 36], note: "Pagination maths: total pages, clamp the current page, then slice." },
      { lines: [56, 58], note: "Prev/Next disable at the ends." }
    ]},
    output: "Grid of 6 products. Choose \"shoes\" + \"Price ↑\": URL becomes `?category=shoes&sort=price-asc`. Next adds `&page=2`. Refresh keeps everything.",
    mistakes: [
      { bad: `const sorted = products.sort(byPrice);`, good: `const sorted = products.toSorted(byPrice); // or [...products].sort(byPrice)`, why: "`sort` mutates in place, changing shared data (an import, props or state) behind React's back." },
      { bad: `const [category, setCategory] = useState('all');\nconst [page, setPage] = useState(1);`, good: `const [params, setParams] = useSearchParams();\nconst category = params.get('category') ?? 'all';`, why: "Local state is lost on refresh, can't be shared, and Back doesn't undo a filter." },
      { bad: `update({ category: 'bags' }) // keeps page=5`, good: `if (!('page' in changes)) next.delete('page');`, why: "A narrower filter may have fewer pages, leaving the user on an empty page." }
    ],
    practice: [
      { level: "B", q: "Add a \"Clear filters\" button.", a: "`setParams({})` removes every param." },
      { level: "I", q: "Debounce the search so the URL doesn't change on every key.", a: "Keep a local `text` state for the input and push it to the URL from an effect on a `useDebounce`'d value." },
      { level: "I", q: "Add a price range (min/max).", a: "Read `min`/`max` params, add `.filter(p => p.price >= min && p.price <= max)` to the pipeline." },
      { level: "C", q: "Fetch from a server instead: `/api/products?category=shoes&page=2`.", a: "Build the query string from `params` and use TanStack Query with `queryKey: ['products', Object.fromEntries(params)]` and `placeholderData: keepPreviousData`." }
    ],
    quiz: [
      { q: "Why reset `page` when the category changes?", options: ["React Router requires it", "The old page may not exist for the new filter", "It improves SEO"], answer: 1, why: "Fewer results means fewer pages." },
      { q: "Which doesn't mutate the original array?", options: ["`arr.sort()`", "`arr.reverse()`", "`arr.toSorted()`"], answer: 2, why: "`toSorted` (ES2023) returns a new array." },
      { q: "Correct pipeline order?", options: ["Paginate → filter → sort", "Filter → sort → paginate", "Sort → paginate → filter"], answer: 1, why: "Paginating first would only filter/sort one page." }
    ],
    rev: {
      sec30: "Product listing: filters, search, sort and page live in the URL via `useSearchParams`. Render derives filter → sort (on a copy) → paginate. Changing filters resets the page. For large data, send the same params to the server and cache by them with TanStack Query.",
      interview: [
        { level: "basic", q: "Why put filters in the URL?", a: "Refresh, Back/Forward and shared links keep the same view, and you avoid duplicate state." },
        { level: "intermediate", q: "Client-side or server-side filtering?", a: "Client-side for a few hundred items; server-side for big or changing data, sending filters as query params." },
        { level: "intermediate", q: "Offset vs cursor pagination?", a: "Offset (`page=3`) is simple and allows jumping to pages; cursor (`after=abc`) is stable when items are added and suits infinite scroll." },
        { level: "advanced", q: "How do you avoid a flash of empty results when changing page with a server API?", a: "TanStack Query with `placeholderData: keepPreviousData` keeps showing the old page until the new one arrives." },
        { level: "tricky", q: "`setParams({ sort: 'name' })` wiped the category. Why?", a: "Passing an object replaces all params. Use the callback form and copy `prev` into a new `URLSearchParams`." }
      ],
      predict: [
        { code: `const a = [3, 1, 2];\nconst b = a.sort();\nconsole.log(a, a === b);`, answer: "[1, 2, 3] true", why: "`sort` mutates in place and returns the same array." }
      ],
      cheat: [
        "URL = filter state (`useSearchParams`)",
        "Filter → sort → paginate, derived each render",
        "Sort a copy: `toSorted` or `[...arr].sort`",
        "Reset page on filter change",
        "`setParams(prev => ...)` to merge, not replace",
        "Big data: server-side + `keepPreviousData`"
      ]
    },
    related: ["ROUTE-012", "API-024", "COND-010", "API-025"],
    build: {
      features: ["Product grid", "Category filter", "Text search", "Sort by name / price", "Pagination with Prev/Next", "All state in the URL"],
      folders: `src/\n  features/products/\n    ProductList.jsx\n    ProductCard.jsx\n    FilterBar.jsx\n    Pagination.jsx\n    products.js\n  router.jsx\n  main.jsx`,
      steps: [
        { title: "Data", detail: "A `products.js` array (or fetch from a fake API)." },
        { title: "Grid", detail: "Render cards with `key={p.id}`." },
        { title: "Read the URL", detail: "`useSearchParams` with defaults for every param." },
        { title: "Pipeline", detail: "Filter, sort a copy, slice for the page." },
        { title: "Write the URL", detail: "`update` helper that merges and resets page." },
        { title: "Test", detail: "Render inside `createMemoryRouter` with `initialEntries: ['/?category=shoes']` and assert the list." }
      ],
      stretch: ["Price range slider", "Server-side pagination with TanStack Query", "Infinite scroll variant", "Product detail route"]
    }
  },

  "PROJ-008": {
    tldr: "Build a shopping cart shared across the app with Context + useReducer. Components dispatch actions (add, remove, change quantity); totals are derived from the cart items.",
    analogy: { icon: "🛒", text: "One trolley for the whole shop: any aisle can drop things in, the checkout reads the same trolley, and the receipt total is added up at the till." },
    visual: { type: "tree", title: "Cart state shared through context", root: { label: "CartProvider", note: "useReducer(cartReducer)", children: [
      { label: "Header", children: [ { label: "CartBadge", note: "itemCount (derived)" } ] },
      { label: "ProductGrid", children: [ { label: "ProductCard", note: "dispatch ADD" } ] },
      { label: "CartDrawer", children: [
        { label: "CartLine", note: "SET_QTY / REMOVE" },
        { label: "CartTotals", note: "subtotal, shipping, total" }
      ]}
    ]}},
    points: [
      "**Context** shares the cart; **useReducer** keeps every change in one pure function.",
      "Store minimal data: `{ id, name, price, qty }` per line. Totals are **derived**.",
      "Adding an existing product **increments qty** instead of adding a duplicate line.",
      "Expose a `useCart()` hook that throws if used outside the provider.",
      "Prices in integer pence; the **server recalculates** the real total at checkout.",
      "Context re-renders every consumer on change; split contexts or use Zustand if that becomes slow."
    ],
    code: { file: "CartContext.jsx", lang: "jsx", src: `import { createContext, use, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(items, action) {
  switch (action.type) {
    case 'ADD': {
      const found = items.find(i => i.id === action.product.id);
      if (found) {
        return items.map(i => (i.id === found.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...items, { ...action.product, qty: 1 }];
    }
    case 'SET_QTY':
      if (action.qty <= 0) return items.filter(i => i.id !== action.id);
      return items.map(i => (i.id === action.id ? { ...i, qty: action.qty } : i));
    case 'REMOVE':
      return items.filter(i => i.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      throw new Error(\`Unknown action \${action.type}\`);
  }
}

function load() {
  try { return JSON.parse(localStorage.getItem('cart')) ?? []; } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, load);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 499;

  return (
    <CartContext value={{ items, dispatch, itemCount, subtotal, shipping, total: subtotal + shipping }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = use(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

// Usage
export function AddButton({ product }) {
  const { dispatch } = useCart();
  return <button onClick={() => dispatch({ type: 'ADD', product })}>Add to cart</button>;
}

export function CartTotals() {
  const { subtotal, shipping, total } = useCart();
  const gbp = p => (p / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
  return (
    <dl>
      <dt>Subtotal</dt><dd>{gbp(subtotal)}</dd>
      <dt>Shipping</dt><dd>{shipping ? gbp(shipping) : 'Free'}</dd>
      <dt>Total</dt><dd>{gbp(total)}</dd>
    </dl>
  );
}`, walk: [
      { lines: [7, 8, 9, 10, 11, 12], note: "ADD: bump qty if the product is already in the cart, otherwise add a new line." },
      { lines: [14, 15, 16], note: "SET_QTY to 0 or less removes the line: one rule, no special cases in the UI." },
      { lines: [31], note: "Third argument = lazy init: load the saved cart once." },
      { lines: [37, 38, 39], note: "Count, subtotal and shipping are derived from items (free shipping from £50)." },
      { lines: [42], note: "React 19: render `<CartContext value>` directly as the provider." },
      { lines: [48, 49, 50, 51, 52], note: "`useCart` reads context with `use` and fails loudly outside the provider." }
    ]},
    output: "Click \"Add to cart\" twice on a £12.00 item: badge shows 2, Subtotal £24.00, Shipping £4.99, Total £28.99.",
    mistakes: [
      { bad: `case 'ADD':\n  items.push({ ...action.product, qty: 1 });\n  return items;`, good: `case 'ADD':\n  return [...items, { ...action.product, qty: 1 }];`, why: "Reducers must return new arrays; mutating means React sees the same reference and skips updates." },
      { bad: `{ id, name, price, qty, lineTotal, cartTotal }`, good: `{ id, name, price, qty } // totals derived`, why: "Stored totals go stale when qty changes; calculate them from items." },
      { bad: `const { items } = useContext(CartContext); // outside provider: null crash`, good: `const { items } = useCart(); // clear error message`, why: "A custom hook with a guard gives a helpful error instead of \"cannot read properties of null\"." }
    ],
    practice: [
      { level: "B", q: "Show the badge only when the cart is not empty.", a: "`{itemCount > 0 && <span className=\"badge\">{itemCount}</span>}`" },
      { level: "I", q: "Add a discount code \"SAVE10\" for 10% off.", a: "Store the code in state; derive `discount = code === 'SAVE10' ? Math.round(subtotal * 0.1) : 0`. (Real codes are checked on the server.)" },
      { level: "I", q: "Unit test the reducer: ADD the same product twice.", a: "`cartReducer(cartReducer([], add), add)` should give one line with `qty: 2`." },
      { level: "C", q: "Stop the badge re-rendering when only the drawer opens.", a: "Split into `CartStateContext` and `CartDispatchContext`, or move to Zustand with selectors like `useCart(s => s.count)`." }
    ],
    quiz: [
      { q: "What does `useReducer(cartReducer, undefined, load)` do?", options: ["Calls `load` every render", "Uses `load()` once as the initial state", "Loads the reducer lazily"], answer: 1, why: "The third argument is an init function for lazy initial state." },
      { q: "Adding an item already in the cart should...", options: ["Add a duplicate line", "Increase that line's qty", "Throw an error"], answer: 1, why: "One line per product keeps totals and UI simple." },
      { q: "Why recalculate the total on the server?", options: ["Server maths is faster", "Client prices can be tampered with", "React can't multiply"], answer: 1, why: "Never trust totals sent from the browser." }
    ],
    rev: {
      sec30: "Cart = Context for sharing + useReducer for changes. Actions ADD (increment if present), SET_QTY (0 removes), REMOVE, CLEAR. Lines store `{ id, price, qty }`; count, subtotal, shipping and total are derived. A `useCart` hook guards against missing providers. The server is the source of truth for prices.",
      interview: [
        { level: "basic", q: "Why Context for a cart?", a: "Many distant components (header badge, product cards, drawer) need the same cart; Context avoids prop drilling." },
        { level: "intermediate", q: "Why useReducer instead of useState?", a: "Several actions update the same list with rules; a reducer groups them in one pure, testable function." },
        { level: "intermediate", q: "What do you store per cart line?", a: "Product id, price snapshot, name for display, and qty. Totals are derived." },
        { level: "advanced", q: "Context causes every consumer to re-render. How do you fix it?", a: "Split state and dispatch contexts, memoise the value, or use Zustand/Redux with selectors so components subscribe to slices." },
        { level: "tricky", q: "Should the cart total be sent to the payment API?", a: "No, send item ids and quantities. The server looks up prices and computes the total, or a user could edit the price." }
      ],
      compare: { cols: ["", "Context + useReducer", "Zustand / Redux Toolkit"], rows: [
        ["Setup", "Built in, no deps", "Small library"],
        ["Re-renders", "All consumers", "Only selected slices"],
        ["DevTools", "React DevTools only", "Time-travel (Redux)"],
        ["Good for", "Small/medium carts", "Large apps, frequent updates"]
      ]},
      cheat: [
        "Context shares; reducer changes",
        "ADD increments existing lines",
        "SET_QTY <= 0 removes",
        "Derive count, subtotal, total",
        "`useCart()` with a provider guard",
        "React 19: `<Ctx value>` and `use(Ctx)`",
        "Server recalculates prices"
      ]
    },
    related: ["STORE-002", "HOOKS-008", "COMM-008", "STORE-017"],
    build: {
      features: ["Add products to cart", "Change quantity / remove", "Header badge with item count", "Subtotal, shipping, total", "Free shipping threshold", "Cart saved in localStorage"],
      folders: `src/\n  features/cart/\n    CartContext.jsx\n    cartReducer.js\n    cartReducer.test.js\n    CartDrawer.jsx\n    CartLine.jsx\n    CartTotals.jsx\n  features/products/\n    ProductGrid.jsx\n  App.jsx`,
      steps: [
        { title: "Reducer first", detail: "Write and unit-test `cartReducer` for every action." },
        { title: "Provider", detail: "`CartProvider` with `useReducer` and lazy load from storage." },
        { title: "Hook", detail: "`useCart()` with the provider guard." },
        { title: "UI", detail: "Add buttons, badge, drawer with qty inputs." },
        { title: "Totals", detail: "Derive subtotal, shipping and total; format currency." },
        { title: "Test", detail: "RTL: add twice, change qty, assert the total text." }
      ],
      stretch: ["Split state/dispatch contexts", "Port to Zustand", "Discount codes (validated server side)", "Save-for-later list"]
    }
  },

  "PROJ-009": {
    tldr: "Build a small online shop: React Router pages, TanStack Query for products (server state), the cart in context (client state), and a checkout that posts an order with a mutation.",
    analogy: { icon: "🏪", text: "A real shop: the shelves (server data) are restocked by staff, your basket (client data) is yours alone, and the till (checkout) confirms what you actually pay." },
    visual: { type: "tree", title: "E-commerce app structure", root: { label: "QueryClientProvider", children: [
      { label: "CartProvider", children: [
        { label: "RouterProvider", children: [
          { label: "Layout", note: "header + cart badge + <Outlet>", children: [
            { label: "/ ProductsPage", note: "useQuery(['products'])" },
            { label: "/products/:id", note: "useQuery(['product', id])" },
            { label: "/cart CartPage", note: "useCart()" },
            { label: "/checkout", note: "useMutation(placeOrder)" }
          ]}
        ]}
      ]}
    ]}},
    points: [
      "Split **server state** (products, orders: TanStack Query) from **client state** (cart: context/Zustand).",
      "Query keys describe the data: `['products']`, `['product', id]`. Same key = shared cache.",
      "Handle `isPending` and `isError` on every query: skeletons and retry buttons.",
      "Checkout is a `useMutation`: disable the button while `isPending`, clear the cart `onSuccess`.",
      "Send **ids and quantities** to the server, never prices; the server calculates the total.",
      "Lazy-load heavy routes (checkout) with route `lazy` to shrink the first bundle."
    ],
    code: { file: "shop.jsx", lang: "jsx", src: `import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Outlet, Link, useParams, useNavigate } from 'react-router';
import { CartProvider, useCart } from './cart/CartContext';

const API = 'https://dummyjson.com';
const getJson = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
  return res.json();
};

function ProductsPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => getJson(\`\${API}/products?limit=12\`),
  });
  if (isPending) return <p>Loading products…</p>;
  if (isError) return <button onClick={() => refetch()}>Retry</button>;
  return (
    <ul className="grid">
      {data.products.map(p => (
        <li key={p.id}><Link to={\`/products/\${p.id}\`}>{p.title}</Link> · £{p.price}</li>
      ))}
    </ul>
  );
}

function ProductPage() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { data: p, isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getJson(\`\${API}/products/\${id}\`),
  });
  if (isPending || isError) return <p>{isPending ? 'Loading…' : 'Product not found.'}</p>;
  return (
    <article>
      <h1>{p.title}</h1>
      <p>{p.description}</p>
      <button onClick={() => dispatch({ type: 'ADD', product: { id: p.id, name: p.title, price: Math.round(p.price * 100) } })}>
        Add to cart
      </button>
    </article>
  );
}

function CheckoutPage() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const order = useMutation({
    mutationFn: lines => getJson(\`\${API}/carts/add\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, products: lines }),
    }),
    onSuccess: () => {
      dispatch({ type: 'CLEAR' });
      navigate('/', { replace: true });
    },
  });
  if (items.length === 0) return <p>Your cart is empty.</p>;
  return (
    <section>
      <p>To pay: £{(total / 100).toFixed(2)}</p>
      <button disabled={order.isPending}
        onClick={() => order.mutate(items.map(i => ({ id: i.id, quantity: i.qty })))}>
        {order.isPending ? 'Placing order…' : 'Place order'}
      </button>
      {order.isError && <p role="alert">{order.error.message}</p>}
    </section>
  );
}

const Layout = () => <><header><Link to="/">Shop</Link> · <Link to="/checkout">Checkout</Link></header><Outlet /></>;
const router = createBrowserRouter([{ element: <Layout />, children: [
  { path: '/', element: <ProductsPage /> },
  { path: '/products/:id', element: <ProductPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
]}]);
const queryClient = new QueryClient();

export default function App() {
  return <QueryClientProvider client={queryClient}><CartProvider><RouterProvider router={router} /></CartProvider></QueryClientProvider>;
}`, walk: [
      { lines: [6, 7, 8, 9, 10], note: "One fetch helper that throws on HTTP errors, so Query can mark the request as failed." },
      { lines: [13, 14, 15, 16], note: "Products are server state: cached under `['products']`, refetched when stale." },
      { lines: [17, 18], note: "Always handle loading and error before reading `data`." },
      { lines: [31, 32, 33], note: "The id is part of the key, so each product has its own cache entry." },
      { lines: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59], note: "Checkout mutation sends ids + quantities; on success clear the cart and go home." },
      { lines: [65, 66], note: "Disable while pending so a double click can't place two orders." }
    ]},
    output: "Grid of 12 product links. Open one, Add to cart, go to Checkout: \"To pay: £…\" and a \"Place order\" button that shows \"Placing order…\" then returns to the shop with an empty cart.",
    mistakes: [
      { bad: `const [products, setProducts] = useState([]);\nuseEffect(() => { fetch(url).then(r => r.json()).then(setProducts); }, []);`, good: `const { data } = useQuery({ queryKey: ['products'], queryFn: getProducts });`, why: "Hand-rolled fetching lacks caching, dedupe, retries and race handling; Query gives them for free." },
      { bad: `body: JSON.stringify({ total, items })`, good: `body: JSON.stringify({ products: items.map(i => ({ id: i.id, quantity: i.qty })) })`, why: "A client-sent total can be edited in DevTools. The server must price the order." },
      { bad: `useQuery({ queryKey: ['product'], queryFn: () => getProduct(id) })`, good: `useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) })`, why: "Without the id in the key, every product shares one cache entry and shows the wrong item." }
    ],
    practice: [
      { level: "B", q: "Show a cart badge in the header.", a: "In Layout read `itemCount` from `useCart()` and render it next to the Checkout link." },
      { level: "I", q: "Prefetch a product on hover.", a: "`queryClient.prefetchQuery({ queryKey: ['product', id], queryFn: ... })` in the link's `onMouseEnter`." },
      { level: "I", q: "Lazy-load the checkout route.", a: "`{ path: '/checkout', lazy: async () => ({ Component: (await import('./CheckoutPage')).default }) }`." },
      { level: "C", q: "Add search with `?q=` that queries `/products/search?q=`.", a: "Read `q` with `useSearchParams`; `queryKey: ['products', { q }]`; `placeholderData: keepPreviousData` to avoid flicker." }
    ],
    quiz: [
      { q: "Where should the product list live?", options: ["Cart context", "TanStack Query cache", "localStorage"], answer: 1, why: "It's server state: owned by the server, cached on the client." },
      { q: "Why is the product id in the query key?", options: ["Required syntax", "So each product has its own cache entry", "For TypeScript"], answer: 1, why: "Keys identify cached data; different data needs different keys." },
      { q: "How do you stop double orders?", options: ["Debounce the fetch", "Disable the button while `isPending`", "Use `useEffect`"], answer: 1, why: "The mutation's pending flag reflects the in-flight request (and the server should be idempotent too)." }
    ],
    rev: {
      sec30: "E-commerce SPA: React Router for pages, TanStack Query for server state (products by key, retry, cache), context/reducer or Zustand for the cart, and a `useMutation` checkout that sends ids and quantities, disables while pending, and clears the cart on success. The server prices the order.",
      interview: [
        { level: "basic", q: "Server state vs client state here?", a: "Products and orders are server state (Query). The cart before checkout and UI toggles are client state." },
        { level: "intermediate", q: "What does TanStack Query give you over useEffect + fetch?", a: "Caching by key, request dedupe, retries, background refetch, stale times, cancellation and devtools." },
        { level: "intermediate", q: "How do you structure the routes?", a: "A layout route with header and `<Outlet>`, then product list, product detail (`:id`), cart and a lazy-loaded checkout." },
        { level: "advanced", q: "How do you keep the order list fresh after checkout?", a: "In the mutation's `onSuccess`, call `queryClient.invalidateQueries({ queryKey: ['orders'] })`." },
        { level: "tricky", q: "User clicks Place order, the network drops, they click again. Risk?", a: "Two orders. Disable while pending and send an idempotency key so the server ignores the duplicate." }
      ],
      scenario: [
        { q: "The product page flashes \"Loading\" every time you go back to it. Fix?", a: "Set a sensible `staleTime` (e.g. 60s) so cached data is shown instantly, and prefetch on hover." }
      ],
      cheat: [
        "Server state: TanStack Query; client state: cart store",
        "Keys describe data: `['product', id]`",
        "Handle `isPending` / `isError` first",
        "`useMutation` + `onSuccess` for checkout",
        "Send ids + qty, never prices",
        "`invalidateQueries` after writes",
        "Lazy-load heavy routes"
      ]
    },
    related: ["STORE-020", "STORE-021", "ROUTE-020", "PROJ-008"],
    build: {
      features: ["Product grid from an API", "Product detail page", "Cart with quantities", "Checkout that posts an order", "Loading, error and empty states", "Lazy-loaded checkout route"],
      folders: `src/\n  api/\n    client.js\n    products.js\n  features/\n    cart/\n    products/\n      ProductsPage.jsx\n      ProductPage.jsx\n    checkout/\n      CheckoutPage.jsx\n  routes.jsx\n  App.jsx\n  main.jsx`,
      steps: [
        { title: "Install", detail: "Router and Query.", code: `npm install react-router @tanstack/react-query` },
        { title: "API layer", detail: "A fetch helper that throws on `!res.ok` plus one function per endpoint." },
        { title: "Routes + layout", detail: "Layout with header and Outlet; list, detail, checkout." },
        { title: "Queries", detail: "`useQuery` for list and detail with keys and loading/error UI." },
        { title: "Cart", detail: "Reuse the PROJ-008 cart provider." },
        { title: "Checkout", detail: "`useMutation`, disable while pending, clear cart on success." },
        { title: "Test", detail: "MSW handlers for products and orders; Playwright for the add-to-cart → checkout journey." }
      ],
      stretch: ["Search and category filters in the URL", "Prefetch on hover", "Optimistic \"added to cart\" toast", "Stripe test-mode payment"]
    }
  },

  "PROJ-010": {
    tldr: "Build a login-protected dashboard. A short-lived access token (JWT) is kept in memory, a refresh token lives in an httpOnly cookie, a fetch wrapper refreshes on 401, and protected routes redirect guests to /login.",
    analogy: { icon: "🎟️", text: "A festival wristband: the day pass (access token) expires quickly, but your booking at the box office (refresh cookie) gets you a new pass without buying again." },
    visual: { type: "flow", title: "Request with silent refresh", steps: [
      { label: "Call API", detail: "Send `Authorization: Bearer <access token>` (kept in memory)." },
      { label: "401 Unauthorized", detail: "The access token has expired." },
      { label: "Refresh once", detail: "POST `/auth/refresh` with the httpOnly cookie (`credentials: 'include'`)." },
      { label: "Retry", detail: "Store the new access token and repeat the original request." },
      { label: "Or log out", detail: "Refresh failed: clear the user and redirect to `/login`." }
    ]},
    points: [
      "**Access token**: short-lived (minutes), in memory, sent as a Bearer header.",
      "**Refresh token**: long-lived, in an **httpOnly, Secure, SameSite** cookie that JavaScript can't read.",
      "Don't put tokens in localStorage: any XSS script can steal them.",
      "Share **one in-flight refresh** so five parallel 401s trigger one refresh, not five.",
      "Protected route = check `user`; if missing, `<Navigate to=\"/login\" state={{ from }} replace />`.",
      "Client checks are for UX only: the **API must verify** every request."
    ],
    code: { file: "auth.jsx", lang: "jsx", src: `import { createContext, use, useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

let accessToken = null;
let refreshing = null;

async function refresh() {
  refreshing ??= fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
    .then(res => (res.ok ? res.json() : Promise.reject(new Error('Session expired'))))
    .then(data => { accessToken = data.accessToken; return data.user; })
    .finally(() => { refreshing = null; });
  return refreshing;
}

export async function api(url, options = {}, retried = false) {
  const res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: \`Bearer \${accessToken}\` },
  });
  if (res.status === 401 && !retried) {
    await refresh();
    return api(url, options, true);
  }
  if (!res.ok) throw new Error(\`API error \${res.status}\`);
  return res.json();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    refresh().then(setUser).catch(() => setUser(null)).finally(() => setChecking(false));
  }, []);

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Wrong email or password');
    const data = await res.json();
    accessToken = data.accessToken;
    setUser(data.user);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    accessToken = null;
    setUser(null);
  }

  return <AuthContext value={{ user, checking, login, logout }}>{children}</AuthContext>;
}

export const useAuth = () => use(AuthContext);

export function RequireAuth() {
  const { user, checking } = useAuth();
  const location = useLocation();
  if (checking) return <p>Checking session…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

// routes: { element: <RequireAuth />, children: [{ path: '/dashboard', element: <Dashboard /> }] }`, walk: [
      { lines: [4], note: "The access token lives in a module variable (memory), not localStorage." },
      { lines: [7, 8, 9, 10, 11, 12, 13], note: "`??=` reuses an in-flight refresh, so parallel 401s share one call. The cookie goes along via `credentials`." },
      { lines: [20, 21, 22, 23], note: "On 401 refresh once and retry; `retried` prevents an infinite loop." },
      { lines: [34, 35, 36], note: "On page load, try a silent refresh to restore the session from the cookie." },
      { lines: [62, 65, 66, 67], note: "Guard route: wait while checking, redirect guests (remembering where they were), else render children." }
    ]},
    output: "Visiting /dashboard logged out redirects to /login. After login you land on the dashboard; when the access token expires, the next API call refreshes silently and succeeds.",
    mistakes: [
      { bad: `localStorage.setItem('token', data.accessToken);`, good: `accessToken = data.accessToken; // memory\n// refresh token: httpOnly cookie set by the server`, why: "localStorage is readable by any injected script, so one XSS bug leaks the token." },
      { bad: `if (res.status === 401) { await refresh(); return api(url, options); }`, good: `if (res.status === 401 && !retried) { await refresh(); return api(url, options, true); }`, why: "Without a retry flag, a broken refresh loops forever." },
      { bad: `if (!user) return <Navigate to="/login" />; // while still checking`, good: `if (checking) return <p>Checking session…</p>;\nif (!user) return <Navigate to="/login" replace />;`, why: "Redirecting before the session check finishes kicks logged-in users to /login on refresh." }
    ],
    practice: [
      { level: "B", q: "After login, send users back to the page they wanted.", a: "`const from = location.state?.from?.pathname ?? '/dashboard'; navigate(from, { replace: true });`" },
      { level: "I", q: "Log the user out when refresh fails mid-session.", a: "Catch the error in `api`, call a registered `onSessionExpired` callback that sets `user` to null; RequireAuth then redirects." },
      { level: "I", q: "Log out in every open tab.", a: "Use a `BroadcastChannel('auth')`: post `logout` and listen for it to clear state in other tabs." },
      { level: "C", q: "Test the refresh flow with MSW.", a: "First `/api/me` returns 401, `/api/auth/refresh` returns a new token, second `/api/me` returns 200. Assert the dashboard renders the user's name." }
    ],
    quiz: [
      { q: "Best place for the refresh token in a browser app?", options: ["localStorage", "httpOnly Secure cookie", "A React state variable"], answer: 1, why: "JavaScript can't read httpOnly cookies, so XSS can't steal it." },
      { q: "Why share one in-flight refresh promise?", options: ["To avoid several parallel refresh calls racing", "Because fetch can't run twice", "For TypeScript"], answer: 0, why: "Parallel 401s should wait on the same refresh; rotating tokens may otherwise invalidate each other." },
      { q: "A protected route on the client means the data is secure.", options: ["True", "False"], answer: 1, why: "Anyone can call the API directly; the server must check the token on every request." }
    ],
    rev: {
      sec30: "Auth dashboard: login returns a short-lived JWT access token (kept in memory) and sets a refresh token in an httpOnly cookie. A fetch wrapper adds the Bearer header, refreshes once on 401 (one shared in-flight promise) and retries. On load, a silent refresh restores the session. `RequireAuth` waits for the check, then redirects guests with `<Navigate>`.",
      interview: [
        { level: "basic", q: "Authentication vs authorisation?", a: "Authentication: who are you (login). Authorisation: what are you allowed to do (roles/permissions)." },
        { level: "intermediate", q: "Where do you store tokens and why?", a: "Access token in memory, refresh token in an httpOnly, Secure, SameSite cookie. That limits what XSS can steal." },
        { level: "intermediate", q: "How does a protected route work in React Router 7?", a: "A layout route checks auth; if not logged in it returns `<Navigate to=\"/login\" replace state={{ from }}>`, otherwise `<Outlet />`." },
        { level: "advanced", q: "How do you handle many requests failing with 401 at once?", a: "Queue them behind one refresh promise, then retry each with the new token; if refresh fails, log out once." },
        { level: "tricky", q: "Cookie-based refresh: what new risk appears and how do you handle it?", a: "CSRF, since cookies are sent automatically. Use SameSite=Strict/Lax, a CSRF token on the refresh endpoint, and check the Origin header." }
      ],
      compare: { cols: ["", "Access token", "Refresh token"], rows: [
        ["Lifetime", "Minutes", "Days/weeks"],
        ["Stored", "Memory", "httpOnly cookie"],
        ["Sent", "Authorization header", "Only to /auth/refresh"],
        ["If stolen", "Short damage window", "Revoke server side / rotate"]
      ]},
      cheat: [
        "Access token: short, in memory, Bearer header",
        "Refresh token: httpOnly Secure SameSite cookie",
        "No tokens in localStorage",
        "401 → refresh once → retry",
        "One shared in-flight refresh",
        "Guard: wait for check, then `<Navigate replace>`",
        "Server verifies every request"
      ]
    },
    related: ["AUTH-010", "AUTH-006", "AUTH-005", "API-018"],
    build: {
      features: ["Login form with errors", "Protected /dashboard routes", "Silent session restore on reload", "Auto refresh on 401", "Logout (server clears cookie)", "Redirect back to the requested page"],
      folders: `src/\n  auth/\n    AuthProvider.jsx\n    RequireAuth.jsx\n    api.js\n  pages/\n    LoginPage.jsx\n    DashboardPage.jsx\n  mocks/\n    handlers.js\n  routes.jsx\n  main.jsx`,
      steps: [
        { title: "Mock backend", detail: "MSW handlers for login, refresh, logout and a protected `/api/me`." },
        { title: "API wrapper", detail: "`api()` adds the Bearer header and refreshes once on 401." },
        { title: "AuthProvider", detail: "`user`, `checking`, `login`, `logout`; silent refresh on mount." },
        { title: "Guard route", detail: "`RequireAuth` layout route with `<Navigate>` and `<Outlet>`." },
        { title: "Login page", detail: "Form with error message; redirect to `state.from` after success." },
        { title: "Test", detail: "RTL + MSW for redirect, login and the refresh-retry path." }
      ],
      stretch: ["Remember-me option", "Multi-tab logout with BroadcastChannel", "Idle timeout warning", "Roles on the dashboard (see PROJ-011)"]
    }
  },

  "PROJ-011": {
    tldr: "Build an employee admin: a table with create, read, update and delete (CRUD), a validated form, and buttons that appear only for roles allowed to use them. The server enforces the same rules.",
    analogy: { icon: "🗂️", text: "A cafe's staff rota binder: the manager can add, edit and remove people, shift leads can only edit, and baristas can just read it." },
    visual: { type: "tree", title: "Employee management screen", root: { label: "EmployeesPage", note: "useQuery(['employees'])", children: [
      { label: "Toolbar", children: [ { label: "SearchBox" }, { label: "AddButton", note: "can('employee:create')" } ] },
      { label: "EmployeeTable", children: [ { label: "Row", note: "Edit / Delete if allowed" } ] },
      { label: "EmployeeFormDialog", note: "create + edit, validation" },
      { label: "ConfirmDelete", note: "useMutation(delete)" }
    ]}},
    points: [
      "Reads with `useQuery`, writes with `useMutation` + `invalidateQueries(['employees'])`.",
      "One form component for **create and edit**: pass `initial` values and an `onSubmit`.",
      "Map roles to **permissions** (`admin: ['employee:create', ...]`) and check with `can(user, perm)`.",
      "Hide or disable what a role can't do, but **the API must also reject it** (client checks are UX).",
      "Validate on the client for fast feedback (required name, valid email) and on the server for safety.",
      "Confirm destructive actions; show errors from failed mutations."
    ],
    code: { file: "EmployeesPage.jsx", lang: "jsx", src: `import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthProvider';
import { api } from '../auth/api';

const PERMISSIONS = {
  admin: ['employee:read', 'employee:create', 'employee:update', 'employee:delete'],
  manager: ['employee:read', 'employee:update'],
  viewer: ['employee:read'],
};
const can = (user, perm) => PERMISSIONS[user?.role]?.includes(perm) ?? false;

function EmployeeForm({ initial = { name: '', email: '', role: 'viewer' }, onSubmit, saving }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!/^\\S+@\\S+\\.\\S+$/.test(values.email)) errs.email = 'Enter a valid email';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(values);
  }

  return (
    <form onSubmit={submit} noValidate>
      <input name="name" value={values.name} onChange={set} aria-invalid={!!errors.name} />
      {errors.name && <small>{errors.name}</small>}
      <input name="email" value={values.email} onChange={set} aria-invalid={!!errors.email} />
      {errors.email && <small>{errors.email}</small>}
      <select name="role" value={values.role} onChange={set}>
        {Object.keys(PERMISSIONS).map(r => <option key={r}>{r}</option>)}
      </select>
      <button disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export default function EmployeesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null | 'new' | employee
  const { data: employees = [], isPending, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api('/api/employees'),
  });
  const done = () => { qc.invalidateQueries({ queryKey: ['employees'] }); setEditing(null); };
  const save = useMutation({
    mutationFn: emp => api(emp.id ? \`/api/employees/\${emp.id}\` : '/api/employees', {
      method: emp.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp),
    }),
    onSuccess: done,
  });
  const remove = useMutation({
    mutationFn: id => api(\`/api/employees/\${id}\`, { method: 'DELETE' }),
    onSuccess: done,
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">Could not load employees.</p>;
  return (
    <section>
      {can(user, 'employee:create') && <button onClick={() => setEditing('new')}>+ Add employee</button>}
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th /></tr></thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td><td>{e.email}</td><td>{e.role}</td>
              <td>
                {can(user, 'employee:update') && <button onClick={() => setEditing(e)}>Edit</button>}
                {can(user, 'employee:delete') && (
                  <button onClick={() => confirm(\`Delete \${e.name}?\`) && remove.mutate(e.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <EmployeeForm key={editing.id ?? 'new'} initial={editing === 'new' ? undefined : editing}
          saving={save.isPending} onSubmit={values => save.mutate(editing === 'new' ? values : { ...editing, ...values })} />
      )}
    </section>
  );
}`, walk: [
      { lines: [6, 7, 8, 9, 10, 11], note: "Roles map to permissions; `can()` is the one place the UI checks access." },
      { lines: [18, 19, 20, 21, 22, 23, 24, 25], note: "Client validation gives instant feedback; the server still validates too." },
      { lines: [45, 46, 47, 48], note: "Read the list with `useQuery`; default to `[]` so the table renders safely." },
      { lines: [49, 50, 51, 52, 53, 54, 55, 56], note: "One save mutation: POST for new, PUT for edit. On success, refetch the list and close the form." },
      { lines: [67, 75, 76], note: "Buttons appear only when the role has the permission." },
      { lines: [85, 86], note: "`key` resets the form's state when switching between employees." }
    ]},
    output: "Admins see \"+ Add employee\", Edit and Delete. Managers see Edit only. Viewers see a read-only table. Saving shows \"Saving…\", then the table refreshes.",
    mistakes: [
      { bad: `{user.role === 'admin' && <DeleteButton />}\n// ...and the API deletes for anyone`, good: `{can(user, 'employee:delete') && <DeleteButton />}\n// API also checks the permission and returns 403`, why: "Hidden buttons don't stop someone calling the API directly. The server is the real gate." },
      { bad: `<EmployeeForm initial={editing} />`, good: `<EmployeeForm key={editing.id ?? 'new'} initial={editing} />`, why: "Without a key, React keeps the old form state when you open a different employee." },
      { bad: `onSuccess: () => setEditing(null) // list stays stale`, good: `onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); setEditing(null); }`, why: "After a write, invalidate so the table refetches." }
    ],
    practice: [
      { level: "B", q: "Add a search box that filters by name.", a: "Keep `q` state (or `?q=` in the URL); derive `employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()))`." },
      { level: "I", q: "Sort by clicking a column header.", a: "Store `{ key, dir }`; derive `employees.toSorted(...)`; toggle `dir` on repeat click." },
      { level: "I", q: "Rewrite the form with React Hook Form + Zod.", a: "`useForm({ resolver: zodResolver(schema), defaultValues: initial })`; `register('name')`; errors come from `formState.errors`." },
      { level: "C", q: "Make Delete optimistic.", a: "In `onMutate`, cancel queries, snapshot the list, `setQueryData` without the row; in `onError` restore the snapshot; in `onSettled` invalidate." }
    ],
    quiz: [
      { q: "After updating an employee, how do you refresh the table?", options: ["Reload the page", "`queryClient.invalidateQueries({ queryKey: ['employees'] })`", "Call `useQuery` again"], answer: 1, why: "Invalidation marks the cache stale and refetches active queries." },
      { q: "Hiding the Delete button for viewers is enough security.", options: ["True", "False"], answer: 1, why: "The API must check permissions; the UI check is only for a good experience." },
      { q: "Why `key={editing.id ?? 'new'}` on the form?", options: ["Required for forms", "Resets local form state when the edited employee changes", "Improves performance"], answer: 1, why: "A new key remounts the component with fresh state." }
    ],
    rev: {
      sec30: "Employee CRUD: `useQuery` for the list, `useMutation` for create/update/delete with `invalidateQueries`. One form for create and edit, reset with `key`. Roles map to permissions and a `can()` helper decides what the UI shows; the API enforces the same permissions and returns 403.",
      interview: [
        { level: "basic", q: "What is CRUD?", a: "Create, Read, Update, Delete: POST, GET, PUT/PATCH and DELETE on a resource." },
        { level: "intermediate", q: "RBAC vs permission-based checks?", a: "RBAC checks a role name; permission-based maps roles to fine-grained permissions like `employee:delete`, which scales better when roles change." },
        { level: "intermediate", q: "How do you reuse one form for create and edit?", a: "Pass initial values and an onSubmit; use a `key` so switching records remounts it with fresh state." },
        { level: "advanced", q: "Large table (10,000 rows): what changes?", a: "Server-side pagination, sorting and filtering via query params, plus virtualisation if you still render many rows." },
        { level: "tricky", q: "A manager edits their own role to admin in DevTools. What stops them?", a: "The server ignores or rejects role changes unless the caller has that permission. Never trust client-sent roles." }
      ],
      debug: [
        { code: `const { data } = useQuery({ queryKey: ['employees'], queryFn });\nreturn data.map(e => <Row key={e.id} {...e} />);`, fix: `const { data = [], isPending } = useQuery({ queryKey: ['employees'], queryFn });\nif (isPending) return <p>Loading…</p>;\nreturn data.map(e => <Row key={e.id} {...e} />);`, why: "`data` is undefined on the first render, so `.map` crashes." }
      ],
      cheat: [
        "Read: `useQuery`; write: `useMutation`",
        "After writes: `invalidateQueries`",
        "Roles → permissions → `can(user, perm)`",
        "UI hides; API enforces (403)",
        "One form for create + edit, reset with `key`",
        "Validate client side and server side",
        "Confirm before delete"
      ]
    },
    related: ["AUTH-007", "AUTH-008", "STORE-022", "EVT-017"],
    build: {
      features: ["Employee table", "Create / edit in one form", "Delete with confirmation", "Client-side validation", "Role-based buttons (admin / manager / viewer)", "Server returns 403 for forbidden actions", "Search and sort"],
      folders: `src/\n  auth/\n    permissions.js\n  features/employees/\n    EmployeesPage.jsx\n    EmployeeTable.jsx\n    EmployeeForm.jsx\n    api.js\n  mocks/\n    handlers.js\n  routes.jsx`,
      steps: [
        { title: "API + mocks", detail: "REST endpoints `/api/employees` (GET, POST, PUT, DELETE) mocked with MSW." },
        { title: "Permissions", detail: "`PERMISSIONS` map and `can()` helper, unit-tested." },
        { title: "Table", detail: "`useQuery` with loading and error states." },
        { title: "Form", detail: "Shared create/edit form with validation." },
        { title: "Mutations", detail: "Save and delete with invalidation and pending states." },
        { title: "Protect", detail: "Route guard for `employee:read`; mock API returns 403 for wrong roles." },
        { title: "Test", detail: "Render as each role and assert which buttons exist." }
      ],
      stretch: ["Server-side pagination", "Optimistic delete with rollback", "Audit log of changes", "CSV import"]
    }
  },

  "PROJ-012": {
    tldr: "Build an admin dashboard: stat cards and charts, a 10,000-row table that stays fast by only drawing visible rows (virtualisation), and a light/dark theme switch using CSS variables.",
    analogy: { icon: "📊", text: "A shop owner's back office screen: sales charts at the top, a long orders list you scroll through, and a night mode for late stock-takes." },
    visual: { type: "compare", title: "Rendering 10,000 orders", left: { label: "Render every row", tone: "bad", points: ["10,000 `<tr>` in the DOM", "Slow first paint, laggy scroll", "High memory use"] }, right: { label: "Virtualised list", tone: "good", points: ["Only ~10 visible rows + a few extra (overscan)", "A tall spacer keeps the scrollbar right", "Rows are reused while scrolling"] } },
    points: [
      "**Virtualise** long lists with `@tanstack/react-virtual`: render only rows in view.",
      "Charts (e.g. Recharts) just need arrays like `[{ day: 'Mon', sales: 120 }]`; derive them from data.",
      "Theme with **CSS variables** on `<html data-theme>`, so a toggle changes one attribute, not every component.",
      "Start from the user's OS preference (`prefers-color-scheme`) and remember their choice.",
      "Lazy-load heavy chart code so the dashboard shell paints fast.",
      "Profile with React DevTools Profiler before and after; measure, don't guess."
    ],
    code: { file: "Dashboard.jsx", lang: "jsx", src: `import { useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch {}
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))];
}

function OrdersTable({ orders }) {
  const scrollRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 8,
  });

  return (
    <div ref={scrollRef} style={{ height: 400, overflow: 'auto' }} role="table" aria-rowcount={orders.length}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(row => {
          const o = orders[row.index];
          return (
            <div key={row.key} role="row" className="row"
              style={{ position: 'absolute', top: 0, width: '100%', height: row.size, transform: \`translateY(\${row.start}px)\` }}>
              <span>#{o.id}</span><span>{o.customer}</span><span>£{o.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const orders = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  customer: \`Customer \${i + 1}\`,
  total: ((i * 37) % 200) + 9.99,
}));

export default function Dashboard() {
  const [theme, toggleTheme] = useTheme();
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main>
      <header>
        <h1>Admin</h1>
        <button onClick={toggleTheme}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
      </header>
      <section className="cards">
        <article><h2>Orders</h2><p>{orders.length.toLocaleString()}</p></article>
        <article><h2>Revenue</h2><p>£{revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></article>
      </section>
      <OrdersTable orders={orders} />
    </main>
  );
}

/* theme.css
:root { --bg: #fff; --text: #111; --card: #f4f4f5; }
[data-theme='dark'] { --bg: #0b0b0f; --text: #f4f4f5; --card: #1c1c22; }
body { background: var(--bg); color: var(--text); } */`, walk: [
      { lines: [4, 5, 6, 7, 8, 9, 10, 11], note: "Initial theme: saved choice first, else the OS preference. Storage access is wrapped in try/catch." },
      { lines: [12, 13, 14, 15], note: "Sync with the outside world: set `data-theme` on `<html>`; CSS variables do the rest." },
      { lines: [21, 22, 23, 24, 25, 26], note: "The virtualizer needs the row count, the scroll container and an estimated row height." },
      { lines: [30], note: "A spacer as tall as all rows keeps the scrollbar honest." },
      { lines: [31, 32, 35], note: "Only visible rows (plus overscan) are rendered and moved into place with `translateY`." },
      { lines: [71, 72, 73], note: "Dark mode is just different values for the same variables." }
    ]},
    output: "Two stat cards (Orders 10,000, Revenue £1,094,900) and a smooth-scrolling 10,000-row table with only ~26 rows in the DOM (10 visible + overscan). The toggle switches light/dark and is remembered.",
    mistakes: [
      { bad: `{orders.map(o => <OrderRow key={o.id} {...o} />)} // 10,000 rows`, good: `virtualizer.getVirtualItems().map(row => <OrderRow key={row.key} {...orders[row.index]} />)`, why: "Rendering every row makes first paint and scrolling slow; virtualise long lists." },
      { bad: `<Card style={{ background: theme === 'dark' ? '#111' : '#fff' }} />`, good: `.card { background: var(--card); }`, why: "Passing theme colours through every component is noisy; CSS variables switch everything with one attribute." }
    ],
    practice: [
      { level: "B", q: "Add a third stat card: average order value.", a: "`revenue / orders.length`, formatted to 2 decimals." },
      { level: "I", q: "Add a Recharts line chart of revenue per day.", a: "Group orders by day into `[{ day, revenue }]`, then `<ResponsiveContainer><LineChart data={byDay}><XAxis dataKey=\"day\" /><Line dataKey=\"revenue\" /></LineChart></ResponsiveContainer>`." },
      { level: "I", q: "Lazy-load the chart component.", a: "`const SalesChart = lazy(() => import('./SalesChart'))` inside `<Suspense fallback={<Skeleton />}>`." },
      { level: "C", q: "Add sticky column headers and click-to-sort to the virtual table.", a: "Render a header row outside the scroll area (or `position: sticky`), sort a copy of `orders` with `toSorted`, and pass the sorted array to the virtualizer." }
    ],
    quiz: [
      { q: "What does virtualisation do?", options: ["Moves rendering to a worker", "Renders only the rows currently visible", "Compresses the data"], answer: 1, why: "It keeps the DOM small regardless of list length." },
      { q: "Why theme with CSS variables?", options: ["React can't change colours", "One attribute change restyles everything without re-rendering every component", "They work only in dark mode"], answer: 1, why: "The browser applies the new variable values everywhere." },
      { q: "Best default theme for a first-time visitor?", options: ["Always light", "The OS `prefers-color-scheme` setting", "Random"], answer: 1, why: "Respect the user's system choice until they pick one." }
    ],
    rev: {
      sec30: "Admin dashboard: stat cards and charts are derived from data; long tables are virtualised with `@tanstack/react-virtual` (spacer + absolutely positioned visible rows); theming uses CSS variables switched by `data-theme` on `<html>`, defaulting to `prefers-color-scheme` and persisted. Charts are lazy-loaded; changes are measured with the Profiler.",
      interview: [
        { level: "basic", q: "How do you add dark mode?", a: "Define colours as CSS variables, override them under `[data-theme='dark']`, and toggle that attribute from React." },
        { level: "intermediate", q: "How does list virtualisation work?", a: "A container with the full height scrolls; only rows whose positions intersect the viewport (plus overscan) are rendered and positioned." },
        { level: "intermediate", q: "Virtualise or paginate?", a: "Paginate when users browse pages or data is huge on the server; virtualise when they scroll a long already-loaded list." },
        { level: "advanced", q: "Dashboard feels slow. How do you approach it?", a: "Profile first; then split heavy charts with `lazy`, virtualise big tables, memoise expensive aggregations, and move filtering to the server." },
        { level: "tricky", q: "Dark-mode users see a white flash on load. Why and fix?", a: "React sets the theme after JS loads. Add a tiny inline script in `index.html` that sets `data-theme` before first paint." }
      ],
      cheat: [
        "Virtualise long lists: `useVirtualizer`",
        "Spacer height = `getTotalSize()`",
        "Rows: `translateY(row.start)`",
        "Theme = CSS variables + `data-theme`",
        "Default to `prefers-color-scheme`",
        "Lazy-load charts",
        "Measure with the Profiler"
      ]
    },
    related: ["PERF-007", "STYLE-014", "PERF-002", "STYLE-013"],
    build: {
      features: ["Stat cards (orders, revenue, average)", "Sales line chart", "10,000-row virtualised orders table", "Light/dark theme with OS default", "Theme remembered", "Lazy-loaded charts"],
      folders: `src/\n  features/dashboard/\n    Dashboard.jsx\n    StatCard.jsx\n    SalesChart.jsx\n    OrdersTable.jsx\n  theme/\n    useTheme.js\n    theme.css\n  App.jsx`,
      steps: [
        { title: "Install", detail: "Virtualiser and charts.", code: `npm install @tanstack/react-virtual recharts` },
        { title: "Theme tokens", detail: "CSS variables for light and dark; `useTheme` hook." },
        { title: "Stat cards", detail: "Derive totals from the orders data." },
        { title: "Chart", detail: "Group by day and render a lazy-loaded Recharts chart." },
        { title: "Virtual table", detail: "`useVirtualizer` with a fixed-height scroll container." },
        { title: "Measure", detail: "Profile before/after virtualisation and note the numbers." }
      ],
      stretch: ["Inline script to prevent theme flash", "Date-range filter for the chart", "Sortable sticky headers", "Server-side aggregation endpoint"]
    }
  },

  "PROJ-013": {
    tldr: "Build a blog with Next.js 16 App Router (framework-only). Post pages are pre-built as static HTML, refreshed on a timer, get their own SEO metadata, and only the Like button ships JavaScript.",
    analogy: { icon: "📰", text: "A printed food magazine: the recipe pages are printed in advance (static), a reprint happens every hour if something changed, and only the reader poll card is interactive." },
    visual: { type: "tree", title: "Blog app folder = routes (framework-only)", root: { label: "app/", children: [
      { label: "layout.tsx", note: "root layout, default metadata" },
      { label: "page.tsx", note: "home: latest posts (static)" },
      { label: "blog/", children: [
        { label: "page.tsx", note: "all posts list" },
        { label: "[slug]/", children: [
          { label: "page.tsx", note: "generateStaticParams + generateMetadata" },
          { label: "LikeButton.tsx", note: "'use client'" }
        ]}
      ]},
      { label: "search/page.tsx", note: "reads searchParams: dynamic" },
      { label: "not-found.tsx" }
    ]}},
    points: [
      "**Framework-only**: App Router, Server Components and these APIs need Next.js, not plain Vite + React.",
      "Pages are **Server Components** by default: they can `await` data and send zero JS for themselves.",
      "**Static**: `generateStaticParams` pre-builds each post; `revalidate` refreshes them (ISR). With `cacheComponents` on, use `'use cache'` + `cacheLife` instead.",
      "**Dynamic**: reading `searchParams`, `cookies()` or `headers()` makes a route render per request.",
      "`generateMetadata` sets title, description and Open Graph per post for SEO and link previews.",
      "Add `'use client'` only to interactive parts like a Like button."
    ],
    code: { file: "app/blog/[slug]/page.tsx", lang: "tsx", src: `// Next.js 16 App Router (framework-only)
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '@/lib/posts';
import LikeButton from './LikeButton';

// Re-generate a cached page at most once per hour (ISR)
export const revalidate = 3600;

// Build every known post as static HTML at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.cover] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-GB')}</time>
      {post.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
      <LikeButton slug={slug} initialLikes={post.likes} />
    </article>
  );
}

// ---- app/blog/[slug]/LikeButton.tsx ----
// 'use client';
// import { useState } from 'react';
//
// export default function LikeButton({ slug, initialLikes }: { slug: string; initialLikes: number }) {
//   const [likes, setLikes] = useState(initialLikes);
//   async function like() {
//     setLikes(n => n + 1);
//     await fetch(\`/api/likes/\${slug}\`, { method: 'POST' });
//   }
//   return <button onClick={like}>❤️ {likes}</button>;
// }

// ---- app/search/page.tsx (dynamic: depends on the request) ----
// export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
//   const { q = '' } = await searchParams;
//   const results = await searchPosts(q);
//   return <ul>{results.map(p => <li key={p.slug}>{p.title}</li>)}</ul>;
// }`, walk: [
      { lines: [8], note: "Time-based revalidation: serve the cached HTML, rebuild in the background after an hour." },
      { lines: [11, 12, 13, 14], note: "List the slugs to pre-render at build time." },
      { lines: [16, 19], note: "In Next.js 15+ `params` is a Promise: `await` it." },
      { lines: [22, 23, 24, 25, 26], note: "Per-post SEO: title, description and an Open Graph image for link previews." },
      { lines: [29, 31, 32], note: "An async Server Component fetches data directly; `notFound()` shows the 404 page." },
      { lines: [39], note: "The only client JavaScript on the page is the Like button." }
    ]},
    output: "`next build` lists /blog/[slug] as pre-rendered (SSG) with a 1h revalidate and /search as dynamic. Each post's tab title and link preview show the post's own title and image.",
    mistakes: [
      { bad: `'use client';\nexport default function PostPage() {\n  const [post, setPost] = useState(null);\n  useEffect(() => { fetch('/api/post').then(...) }, []);\n}`, good: `export default async function PostPage({ params }) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n}`, why: "Fetching in the browser loses SEO and adds a loading spinner; a Server Component sends ready HTML." },
      { bad: `export default async function Page({ params }) {\n  const post = await getPost(params.slug);\n}`, good: `export default async function Page({ params }) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n}`, why: "Since Next.js 15, `params` and `searchParams` are Promises." },
      { bad: `<div dangerouslySetInnerHTML={{ __html: comment.body }} />`, good: `<p>{comment.body}</p> // or sanitise with DOMPurify`, why: "Rendering user HTML without sanitising is an XSS hole." }
    ],
    practice: [
      { level: "B", q: "Add a site-wide title template like \"Post title | My Blog\".", a: "In `app/layout.tsx`: `export const metadata = { title: { template: '%s | My Blog', default: 'My Blog' } }`." },
      { level: "I", q: "Publish a new post and update the page immediately, not after an hour.", a: "In the publish Server Action or route handler call `revalidatePath('/blog/' + slug)`, or tag the data and call `revalidateTag(tag, 'max')` (Next.js 16 wants the second argument)." },
      { level: "I", q: "Add a `loading.tsx` for the search page.", a: "Create `app/search/loading.tsx`; Next wraps the page in Suspense and streams the skeleton first." },
      { level: "C", q: "Generate an Open Graph image per post.", a: "Add `app/blog/[slug]/opengraph-image.tsx` that returns an `ImageResponse` with the post title." }
    ],
    quiz: [
      { q: "What makes a route dynamic in the App Router?", options: ["Using `async`", "Reading request data like `searchParams` or `cookies()`", "Having a `[slug]` folder"], answer: 1, why: "Request-specific data can't be known at build time." },
      { q: "Which component needs `'use client'`?", options: ["The post page", "The Like button with `useState` and `onClick`", "The root layout"], answer: 1, why: "Only components using state, effects or browser events must be Client Components." },
      { q: "What does `generateStaticParams` do?", options: ["Validates URL params", "Lists params to pre-render at build time", "Generates TypeScript types"], answer: 1, why: "Each returned `{ slug }` becomes a static page." }
    ],
    rev: {
      sec30: "Framework-only: a Next.js 16 App Router blog. Folders are routes; pages are Server Components that `await` data. `generateStaticParams` + `revalidate` give static pages that refresh (ISR); request data like `searchParams` makes a route dynamic. `generateMetadata` sets per-post SEO. Only interactive bits like a Like button use `'use client'`.",
      interview: [
        { level: "basic", q: "Why Next.js for a blog instead of a Vite SPA?", a: "Content needs SEO and fast first paint. Next pre-renders HTML and sets metadata per page; an SPA renders in the browser." },
        { level: "intermediate", q: "Static vs dynamic rendering?", a: "Static is built once (at build or revalidation) and served from cache; dynamic renders per request because it depends on cookies, headers or search params." },
        { level: "intermediate", q: "How do you update a static post after editing it?", a: "On-demand: `revalidatePath` or `revalidateTag` from the save action. Or time-based with `revalidate`." },
        { level: "advanced", q: "How do Server and Client Components work together here?", a: "The server page fetches and renders HTML, then passes serialisable props (`initialLikes`) to the client Like button, which hydrates alone." },
        { level: "tricky", q: "You read `cookies()` in the root layout for a theme. What happens to the blog?", a: "Every route under it becomes dynamic, losing static caching. Read cookies lower down or handle theme on the client." }
      ],
      compare: { cols: ["", "Static (SSG/ISR)", "Dynamic (SSR)"], rows: [
        ["When rendered", "Build time / on revalidate", "Every request"],
        ["Speed", "Served from cache/CDN", "Waits for the server"],
        ["Triggers", "`generateStaticParams`, `revalidate`", "`cookies()`, `headers()`, `searchParams`"],
        ["Blog use", "Posts, list pages", "Search, drafts preview"]
      ]},
      cheat: [
        "Framework-only: Next.js App Router",
        "Pages are Server Components by default",
        "`generateStaticParams` = pre-render",
        "`export const revalidate = 3600` = ISR",
        "`params` / `searchParams` are Promises: `await`",
        "`generateMetadata` for per-page SEO",
        "`'use client'` only for interactive leaves",
        "`notFound()` → not-found.tsx"
      ]
    },
    related: ["NEXT-008", "NEXT-009", "NEXT-013", "NEXT-005"],
    build: {
      features: ["Home and blog list pages (static)", "Post pages pre-rendered from Markdown or a CMS", "Hourly revalidation + on-demand revalidate", "Per-post title, description and Open Graph", "Client-side Like button", "Dynamic search page", "Custom 404"],
      folders: `app/\n  layout.tsx\n  page.tsx\n  not-found.tsx\n  blog/\n    page.tsx\n    [slug]/\n      page.tsx\n      LikeButton.tsx\n  search/\n    page.tsx\n  api/likes/[slug]/route.ts\nlib/\n  posts.ts\ncontent/\n  *.md`,
      steps: [
        { title: "Create the app", detail: "Use the official starter (TypeScript, App Router).", code: `npx create-next-app@latest my-blog` },
        { title: "Content layer", detail: "`lib/posts.ts` reads Markdown files or a CMS and returns typed posts." },
        { title: "List + post pages", detail: "Async Server Components; `generateStaticParams` for posts." },
        { title: "Metadata", detail: "Root metadata template + `generateMetadata` per post." },
        { title: "Interactivity", detail: "Client `LikeButton` + a route handler that stores likes." },
        { title: "Search", detail: "Dynamic page reading `searchParams`; add `loading.tsx`." },
        { title: "Deploy", detail: "Deploy to Vercel (or any Node host); check the build output for static vs dynamic routes." }
      ],
      stretch: ["RSS feed route handler", "Generated OG images", "Draft preview mode", "Comments with a Server Action"]
    }
  },

  "PROJ-014": {
    tldr: "Build a live chat: one WebSocket connection per room, messages appear instantly as \"sending\" (optimistic UI) and are confirmed by the server, and a sidebar shows who is online (presence).",
    analogy: { icon: "💬", text: "A group chat app: your message shows straight away with a little clock, gets a tick when the server has it, and green dots show which friends are online." },
    visual: { type: "timeline", title: "One message, start to finish", frames: [
      { label: "Type + send", state: "msg c1: 'Hi!' status=sending", note: "Added to the list immediately with a client id." },
      { label: "socket.send", state: "{ type: 'message', clientId: 'c1', text }", note: "Sent over the open WebSocket." },
      { label: "Server echo", state: "msg c1 → id 981, status=sent", note: "Server broadcasts; we swap the temp message by clientId." },
      { label: "Friend joins", state: "online = ['Sam', 'Ana', 'You']", note: "Presence event updates the sidebar." },
      { label: "No echo in 5s", state: "msg c2 status=failed (Retry)", note: "Mark as failed and offer a retry." }
    ]},
    points: [
      "Open the socket in `useEffect` and **close it in cleanup**; reconnect when the room changes.",
      "**Optimistic UI**: show the message now with a `clientId`; replace it when the server echoes it back.",
      "Handle failure: a timeout or error marks the message **failed** with a Retry button.",
      "**Presence**: the server sends `presence` events (join/leave/typing); keep an online list in state.",
      "Reconnect with **backoff** (1s, 2s, 4s…) and refetch missed messages after reconnecting.",
      "Strict Mode (dev) opens, closes and reopens the socket once; correct cleanup makes that harmless."
    ],
    code: { file: "useChat.js", lang: "jsx", src: `import { useEffect, useRef, useState } from 'react';

export function useChat(roomId, me) {
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [status, setStatus] = useState('connecting');
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(\`wss://chat.example.com/rooms/\${roomId}?user=\${encodeURIComponent(me)}\`);
    socketRef.current = ws;
    setStatus('connecting');

    ws.onopen = () => setStatus('online');
    ws.onclose = () => setStatus('offline');
    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') setMessages(data.messages.map(m => ({ ...m, status: 'sent' })));
      if (data.type === 'presence') setOnline(data.users);
      if (data.type === 'message') {
        setMessages(prev => {
          const mine = prev.some(m => m.clientId && m.clientId === data.clientId);
          return mine
            ? prev.map(m => (m.clientId === data.clientId ? { ...data, status: 'sent' } : m))
            : [...prev, { ...data, status: 'sent' }];
        });
      }
    };

    return () => ws.close();
  }, [roomId, me]);

  function send(text) {
    const clientId = crypto.randomUUID();
    const draft = { clientId, author: me, text, status: 'sending', at: Date.now() };
    setMessages(prev => [...prev, draft]);

    const ws = socketRef.current;
    if (ws?.readyState !== WebSocket.OPEN) {
      return setMessages(prev => prev.map(m => (m.clientId === clientId ? { ...m, status: 'failed' } : m)));
    }
    ws.send(JSON.stringify({ type: 'message', clientId, text }));
    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.clientId === clientId && m.status === 'sending' ? { ...m, status: 'failed' } : m));
    }, 5000);
  }

  return { messages, online, status, send };
}

// ChatRoom.jsx
export function ChatRoom({ roomId, me }) {
  const { messages, online, status, send } = useChat(roomId, me);
  const [text, setText] = useState('');
  return (
    <div className="chat">
      <aside>🟢 {online.join(', ')} · {status}</aside>
      <ul aria-live="polite">
        {messages.map(m => (
          <li key={m.id ?? m.clientId} className={m.status}>
            <b>{m.author}</b> {m.text} {m.status === 'sending' ? '🕓' : m.status === 'failed' ? '⚠️' : '✓'}
          </li>
        ))}
      </ul>
      <form onSubmit={e => { e.preventDefault(); if (text.trim()) { send(text.trim()); setText(''); } }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Message" />
      </form>
    </div>
  );
}`, walk: [
      { lines: [9, 10, 30], note: "One socket per room/user. Cleanup closes it when the room changes or the component unmounts." },
      { lines: [19], note: "Presence: the server pushes the current online list." },
      { lines: [20, 21, 22, 23, 24, 25, 26], note: "Server echo: if it matches our temp `clientId`, replace it; otherwise it's someone else's message." },
      { lines: [35, 36, 37], note: "Optimistic add: the message shows instantly with status `sending`." },
      { lines: [39, 40, 41], note: "Socket not open? Mark it failed straight away instead of pretending." },
      { lines: [43, 44, 45, 46], note: "No confirmation in 5s → failed, so the user can retry." }
    ]},
    output: "Typing \"Hi!\" shows it instantly with 🕓, then ✓ when the server echoes it. The sidebar lists who is online; pulling the network turns status to offline and new messages show ⚠️.",
    mistakes: [
      { bad: `useEffect(() => {\n  const ws = new WebSocket(url);\n  ws.onmessage = ...;\n}, [roomId]);`, good: `useEffect(() => {\n  const ws = new WebSocket(url);\n  ws.onmessage = ...;\n  return () => ws.close();\n}, [roomId]);`, why: "Without cleanup, changing rooms (or Strict Mode in dev) leaves old sockets open and duplicates every message." },
      { bad: `ws.onmessage = e => setMessages([...messages, JSON.parse(e.data)]);`, good: `ws.onmessage = e => setMessages(prev => [...prev, JSON.parse(e.data)]);`, why: "The handler was created on the first render, so `messages` is a stale snapshot. Use the updater form." },
      { bad: `<li key={index}>`, good: `<li key={m.id ?? m.clientId}>`, why: "Messages are inserted and replaced; index keys mix up rows." }
    ],
    practice: [
      { level: "B", q: "Auto-scroll to the newest message.", a: "Keep a ref on the last `<li>` and call `ref.current?.scrollIntoView({ behavior: 'smooth' })` in an effect on `[messages.length]`." },
      { level: "I", q: "Add a Retry button for failed messages.", a: "On click, set status back to `sending` and `ws.send` the same `clientId` and text again." },
      { level: "I", q: "Show \"Sam is typing…\".", a: "Send `{ type: 'typing' }` (throttled) on input; on receive, add the user to a `typing` set and remove after 3s." },
      { level: "C", q: "Reconnect with exponential backoff.", a: "In `onclose`, schedule a reconnect with `setTimeout(connect, Math.min(30000, 1000 * 2 ** attempt))`; reset `attempt` on open; clear the timer in cleanup." }
    ],
    quiz: [
      { q: "What makes the UI \"optimistic\"?", options: ["It retries forever", "It shows the message before the server confirms", "It hides errors"], answer: 1, why: "You assume success, then confirm or roll back." },
      { q: "Why give each draft a `clientId`?", options: ["For CSS", "To match the server's echo to the temporary message", "WebSockets require it"], answer: 1, why: "The server's real id doesn't exist yet when you send." },
      { q: "Why do you see two connections in dev?", options: ["A bug in WebSocket", "Strict Mode runs effect, cleanup, effect again", "Vite opens one"], answer: 1, why: "Dev-only check that your cleanup works; production opens one." }
    ],
    rev: {
      sec30: "Chat: one WebSocket per room in `useEffect` with `close()` in cleanup. Incoming events (history, message, presence) update state with updater functions. Sent messages are added optimistically with a `clientId`, replaced by the server echo, and marked failed on timeout. Presence is a server-pushed online list. Reconnect with backoff and refetch missed messages.",
      interview: [
        { level: "basic", q: "WebSocket vs polling?", a: "WebSocket keeps one two-way connection so the server pushes instantly; polling asks repeatedly and wastes requests or adds delay." },
        { level: "intermediate", q: "How do you implement optimistic messages?", a: "Insert a draft with a client id and `sending` status, send it, swap it for the server's version on echo, or mark failed on error/timeout." },
        { level: "intermediate", q: "How do you avoid stale state in socket handlers?", a: "Use functional updates (`setMessages(prev => ...)`) or `useEffectEvent` for handlers that read the latest props/state." },
        { level: "advanced", q: "The connection drops for 30 seconds. What should happen?", a: "Show offline status, reconnect with backoff, then request messages since the last known id so nothing is missed; resend failed drafts." },
        { level: "tricky", q: "Why might every message appear twice after switching rooms?", a: "The old socket wasn't closed in cleanup, so two sockets deliver messages into the same state." }
      ],
      compare: { cols: ["", "WebSocket", "Server-Sent Events", "Polling"], rows: [
        ["Direction", "Two-way", "Server → client", "Client asks"],
        ["Latency", "Instant", "Instant", "Up to the interval"],
        ["Good for", "Chat, games", "Notifications, feeds", "Simple, rare updates"]
      ]},
      cheat: [
        "Socket in `useEffect`; `ws.close()` in cleanup",
        "Updater form in handlers (no stale state)",
        "Optimistic draft with `clientId`",
        "Echo replaces draft; timeout marks failed",
        "Presence = server-pushed online list",
        "Reconnect with backoff, refetch missed",
        "Key by `id ?? clientId`"
      ]
    },
    related: ["API-027", "HOOKS-019", "HOOKS-020", "HOOKS-005"],
    build: {
      features: ["Join a room and load history", "Send messages with instant feedback", "Sent / sending / failed states with retry", "Online users list", "Typing indicator", "Auto-reconnect", "Auto-scroll"],
      folders: `src/\n  features/chat/\n    useChat.js\n    ChatRoom.jsx\n    MessageList.jsx\n    Composer.jsx\n    PresenceList.jsx\nserver/\n  index.js   // ws server (Node)\n`,
      steps: [
        { title: "Tiny server", detail: "A Node `ws` server that broadcasts messages and presence per room.", code: `npm install ws` },
        { title: "useChat hook", detail: "Connect in an effect, parse events, clean up." },
        { title: "Optimistic send", detail: "Draft with `clientId`, echo replacement, timeout to failed." },
        { title: "Presence", detail: "Server sends the online list on join/leave." },
        { title: "Resilience", detail: "Reconnect with backoff; fetch messages since last id." },
        { title: "Test", detail: "Mock WebSocket in Vitest (or MSW's WebSocket support) and assert the status icons." }
      ],
      stretch: ["Read receipts", "Image messages", "Multiple rooms in tabs", "Push notifications when the tab is hidden"]
    }
  },

  "PROJ-015": {
    tldr: "Build a Kanban board: drag task cards between To do, Doing and Done. A reducer owns the board, a MOVE action handles every drop, and the board is saved so it survives refresh.",
    analogy: { icon: "📌", text: "Sticky notes on a fridge in three columns for weekly chores: you peel a note off \"To do\" and stick it under \"Done\". The fridge is your saved board." },
    visual: { type: "flow", title: "What happens on a drop", steps: [
      { label: "Drag start", detail: "Card stores its id: `dataTransfer.setData('text/plain', id)`." },
      { label: "Drag over", detail: "Column calls `e.preventDefault()` to allow dropping and highlights itself." },
      { label: "Drop", detail: "Reads the id and dispatches `MOVE { id, to, beforeId }`." },
      { label: "Reducer", detail: "Removes the id from its old column, inserts it before `beforeId` (immutably)." },
      { label: "Persist", detail: "An effect saves the new board to localStorage." }
    ]},
    points: [
      "Normalise data: `cards: { [id]: card }` and `columns: { todo: [ids] }`. Moving = moving an id.",
      "**One MOVE action** covers reorder in a column and moving across columns.",
      "Native HTML drag-and-drop: `draggable`, `onDragStart`, `onDragOver` (**must** `preventDefault`), `onDrop`.",
      "Native DnD has no touch or keyboard support; use **dnd-kit** in production for accessibility.",
      "Persist with lazy init + effect; version the saved shape so old data doesn't break the app."
    ],
    code: { file: "Board.jsx", lang: "jsx", src: `import { useReducer, useEffect, useState } from 'react';

const COLUMNS = { todo: 'To do', doing: 'Doing', done: 'Done' };
const empty = { cards: {}, columns: { todo: [], doing: [], done: [] } };

function boardReducer(board, action) {
  switch (action.type) {
    case 'ADD': {
      const id = crypto.randomUUID();
      return {
        cards: { ...board.cards, [id]: { id, title: action.title } },
        columns: { ...board.columns, todo: [...board.columns.todo, id] },
      };
    }
    case 'MOVE': {
      const { id, to, beforeId } = action;
      if (id === beforeId) return board;
      const columns = Object.fromEntries(
        Object.entries(board.columns).map(([col, ids]) => [col, ids.filter(x => x !== id)])
      );
      const target = [...columns[to]];
      const at = beforeId ? target.indexOf(beforeId) : -1;
      target.splice(at === -1 ? target.length : at, 0, id);
      return { ...board, columns: { ...columns, [to]: target } };
    }
    default:
      return board;
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('kanban:v1'));
    return saved?.columns ? saved : empty;
  } catch {
    return empty;
  }
}

export default function Board() {
  const [board, dispatch] = useReducer(boardReducer, undefined, load);
  const [over, setOver] = useState(null);

  useEffect(() => {
    localStorage.setItem('kanban:v1', JSON.stringify(board));
  }, [board]);

  function drop(e, to, beforeId) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData('text/plain');
    if (id) dispatch({ type: 'MOVE', id, to, beforeId });
    setOver(null);
  }

  return (
    <div className="board">
      {Object.entries(COLUMNS).map(([col, label]) => (
        <section key={col} className={over === col ? 'column over' : 'column'}
          onDragOver={e => { e.preventDefault(); setOver(col); }}
          onDragLeave={() => setOver(null)}
          onDrop={e => drop(e, col)}>
          <h2>{label} ({board.columns[col].length})</h2>
          {board.columns[col].map(id => (
            <article key={id} draggable className="card"
              onDragStart={e => e.dataTransfer.setData('text/plain', id)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => drop(e, col, id)}>
              {board.cards[id].title}
            </article>
          ))}
        </section>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        const title = new FormData(e.currentTarget).get('title').trim();
        if (title) dispatch({ type: 'ADD', title });
        e.currentTarget.reset();
      }}>
        <input name="title" placeholder="New task" />
      </form>
    </div>
  );
}`, walk: [
      { lines: [4], note: "Normalised shape: cards by id, columns as ordered id lists." },
      { lines: [16, 17, 18, 19, 20, 21], note: "MOVE step 1: ignore a drop on itself, then remove the id from whichever column has it." },
      { lines: [22, 23, 24, 25], note: "MOVE step 2: insert before the card it was dropped on (or at the end). Using an id, not an index, avoids off-by-one bugs." },
      { lines: [41, 44, 45, 46], note: "Lazy-load the saved board once, save on every change. The `v1` key lets you migrate later." },
      { lines: [48, 50, 51, 52], note: "On drop, read the dragged id and dispatch one MOVE. `stopPropagation` stops the column handling a card's drop too." },
      { lines: [60, 67], note: "`preventDefault` in `onDragOver` is what makes an element a drop target." }
    ]},
    output: "Three columns with counts. Add \"Buy groceries\" (appears in To do), drag it onto a card in Doing to insert above it, or onto empty column space to add at the end. Refresh: the board is unchanged.",
    mistakes: [
      { bad: `<section onDrop={drop}>`, good: `<section onDragOver={e => e.preventDefault()} onDrop={drop}>`, why: "Browsers only allow a drop if `dragover` is cancelled; without it `onDrop` never fires." },
      { bad: `columns: { todo: [{ id, title }, ...] } // full objects duplicated across moves`, good: `cards: { [id]: card }, columns: { todo: [id] }`, why: "Normalised ids make moves cheap and avoid copies of the same card drifting apart." },
      { bad: `const target = columns[to];\ntarget.splice(index, 0, id);`, good: `const target = [...columns[to]];\ntarget.splice(index, 0, id);`, why: "`splice` mutates; copy first so the reducer stays pure." }
    ],
    practice: [
      { level: "B", q: "Add a Delete button on each card.", a: "A `DELETE` action that removes the id from every column and from `cards` (copy the object and `delete` from the copy)." },
      { level: "I", q: "Move cards with the keyboard.", a: "Make cards focusable buttons; on ArrowRight dispatch `MOVE` to the next column, ArrowUp/Down to `index ± 1`." },
      { level: "I", q: "Unit test MOVE within the same column.", a: "Board with todo `[a, b, c]`; `MOVE { id: 'c', to: 'todo', beforeId: 'a' }` gives `[c, a, b]`." },
      { level: "C", q: "Port to dnd-kit for touch and screen readers.", a: "Wrap in `DndContext` with sensors (pointer, keyboard), use `SortableContext` per column, `useSortable` per card, and dispatch MOVE in `onDragEnd`." }
    ],
    quiz: [
      { q: "Why must `onDragOver` call `preventDefault()`?", options: ["To stop scrolling", "It marks the element as a valid drop target", "To pass the data"], answer: 1, why: "By default most elements refuse drops." },
      { q: "Best state shape for a board?", options: ["Nested arrays of full card objects", "Cards by id + columns as id lists", "One flat array with a `column` string and no order"], answer: 1, why: "Normalised data makes moves and reorders simple." },
      { q: "Native HTML drag-and-drop works well on phones.", options: ["True", "False"], answer: 1, why: "It has no touch support; use a library like dnd-kit." }
    ],
    rev: {
      sec30: "Kanban: normalised board state (cards by id, columns as ordered id lists) in `useReducer`. One MOVE action removes an id and inserts it before a target card (or at the end). Native DnD needs `draggable`, `setData`, `preventDefault` on dragover and a drop handler; dnd-kit adds touch and keyboard. The board is lazy-loaded and saved with a versioned localStorage key.",
      interview: [
        { level: "basic", q: "How does HTML drag-and-drop work?", a: "Set `draggable`, store data in `onDragStart`, call `preventDefault` in `onDragOver` on targets, and read the data in `onDrop`." },
        { level: "intermediate", q: "Why a reducer for the board?", a: "Moves touch several columns at once; one pure MOVE function is easy to test and reuse from mouse, keyboard or server events." },
        { level: "intermediate", q: "How do you persist it?", a: "Lazy init from localStorage, save in an effect on change, and version the key so you can migrate the shape." },
        { level: "advanced", q: "Make it collaborative. What changes?", a: "Send MOVE actions to the server, apply them optimistically, broadcast to others over WebSocket, and use fractional ordering keys to avoid conflicts." },
        { level: "tricky", q: "Dropping on a card also fires the column's drop. Fix?", a: "Events bubble; call `e.stopPropagation()` in the card's drop handler (or handle drops only at one level)." }
      ],
      debug: [
        { code: `<section onDrop={e => drop(e, col)}>\n  ...\n</section>`, fix: `<section onDragOver={e => e.preventDefault()} onDrop={e => drop(e, col)}>\n  ...\n</section>`, why: "Without cancelling `dragover`, the browser never fires `drop`." }
      ],
      cheat: [
        "State: `cards` by id + `columns` id lists",
        "One MOVE: remove id, insert before `beforeId`",
        "`draggable` + `setData` on start",
        "`preventDefault()` on dragover = droppable",
        "`stopPropagation` on nested drops",
        "dnd-kit for touch + keyboard",
        "Versioned storage key (`kanban:v1`)"
      ]
    },
    related: ["HOOKS-008", "EVT-008", "STATE-013", "HOOKS-026"],
    build: {
      features: ["Three columns with counts", "Add task cards", "Drag between columns and reorder", "Drop highlight", "Saved in localStorage", "Keyboard moves (stretch for a11y)"],
      folders: `src/\n  features/board/\n    boardReducer.js\n    boardReducer.test.js\n    Board.jsx\n    Column.jsx\n    Card.jsx\n    storage.js\n  App.jsx`,
      steps: [
        { title: "State shape", detail: "Write `empty` and sample data; normalise cards and columns." },
        { title: "Reducer", detail: "ADD and MOVE with unit tests (same column and across columns)." },
        { title: "Render", detail: "Columns and cards from state." },
        { title: "Drag and drop", detail: "Native handlers; highlight the column under the pointer." },
        { title: "Persist", detail: "Lazy load + save effect with a versioned key." },
        { title: "Accessibility", detail: "Keyboard moves, or switch to dnd-kit." }
      ],
      stretch: ["dnd-kit with touch support", "Card details modal", "Due dates and labels", "Real-time sync over WebSocket"]
    }
  },

  "PROJ-016": {
    tldr: "Build a job board with two kinds of users: candidates search, filter and apply; employers post jobs and review applicants. Filters live in the URL, data comes from TanStack Query, and roles decide what each person sees.",
    analogy: { icon: "💼", text: "A cafe noticeboard for jobs: anyone can browse and filter the cards, a job seeker pins their CV to one, and only the cafe owner can put up a card or read the CVs." },
    visual: { type: "tree", title: "Job portal routes by role", root: { label: "Layout", note: "header shows role-specific links", children: [
      { label: "/jobs", note: "search + filters in URL (everyone)", children: [ { label: "JobCard" } ] },
      { label: "/jobs/:id", note: "details + ApplyButton (candidate)" },
      { label: "RequireRole candidate", children: [ { label: "/me/applications", note: "status of my applications" } ] },
      { label: "RequireRole employer", children: [
        { label: "/employer/jobs/new", note: "post a job form" },
        { label: "/employer/jobs/:id/applicants" }
      ]}
    ]}},
    points: [
      "Search and filters go in the URL; the **query key includes the filters**: `['jobs', filters]`.",
      "Use `placeholderData: keepPreviousData` so results don't flash empty while filters change.",
      "Debounce the text search; selects and checkboxes can update the URL immediately.",
      "Guard routes by role (`RequireRole`) and show role-specific actions; **the API checks too**.",
      "Applying is a mutation: disable while pending, show \"Applied\" after, and **invalidate** `['my-applications']`.",
      "Upload CVs with `FormData` (file + fields); never set `Content-Type` yourself for multipart."
    ],
    code: { file: "JobsPage.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, Outlet, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthProvider';
import { api } from '../auth/api';

export function RequireRole({ role }) {
  const { user, checking } = useAuth();
  if (!user) return checking ? <p>Checking session…</p> : <Navigate to="/login" replace />;
  if (user.role !== role) return <p>You don't have access to this page.</p>;
  return <Outlet />;
}

export default function JobsPage() {
  const [params, setParams] = useSearchParams();
  const filters = {
    q: params.get('q') ?? '',
    location: params.get('location') ?? '',
    remote: params.get('remote') === 'true',
  };
  const [text, setText] = useState(filters.q);

  useEffect(() => {
    if (text === filters.q) return;
    const id = setTimeout(() => {
      setParams(prev => {
        const next = new URLSearchParams(prev);
        text ? next.set('q', text) : next.delete('q');
        return next;
      }, { replace: true });
    }, 400);
    return () => clearTimeout(id);
  }, [text, filters.q, setParams]);

  const { data: jobs = [], isPending, isPlaceholderData } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => api(\`/api/jobs?\${new URLSearchParams(params)}\`),
    placeholderData: keepPreviousData,
  });

  const setFilter = (key, value) => setParams(prev => {
    const next = new URLSearchParams(prev);
    value ? next.set(key, value) : next.delete(key);
    return next;
  });

  return (
    <main style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Job title or skill" />
      <select value={filters.location} onChange={e => setFilter('location', e.target.value)}>
        <option value="">Any location</option><option>London</option><option>Manchester</option>
      </select>
      <label><input type="checkbox" checked={filters.remote}
        onChange={e => setFilter('remote', e.target.checked ? 'true' : '')} /> Remote</label>

      {isPending ? <p>Loading jobs…</p> : jobs.length === 0 ? <p>No jobs match.</p> : (
        <ul>{jobs.map(job => (
          <li key={job.id}><Link to={\`/jobs/\${job.id}\`}>{job.title}</Link> · {job.company} <ApplyButton job={job} /></li>
        ))}</ul>
      )}
    </main>
  );
}

function ApplyButton({ job }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const apply = useMutation({
    mutationFn: () => api(\`/api/jobs/\${job.id}/applications\`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-applications'] }),
  });
  if (user?.role !== 'candidate') return null;
  if (job.applied || apply.isSuccess) return <span>✓ Applied</span>;
  return (
    <button disabled={apply.isPending} onClick={() => apply.mutate()}>
      {apply.isPending ? 'Applying…' : 'Apply'}
    </button>
  );
}`, walk: [
      { lines: [7, 8, 9, 10, 11, 12], note: "Role guard as a layout route: wait for the session check, send guests to login, show wrong roles a message." },
      { lines: [16, 17, 18, 19, 20], note: "Filters are read from the URL, so links like `/jobs?remote=true` work." },
      { lines: [24, 25, 31, 32], note: "Debounce: the text box updates instantly, the URL (and fetch) after 400 ms of quiet. The guard skips no-op updates." },
      { lines: [35, 36, 37, 38], note: "Filters are in the query key, so each combination is cached; old results stay while new ones load." },
      { lines: [68, 69, 70, 71], note: "Apply mutation refreshes \"my applications\" on success." },
      { lines: [72, 73], note: "Only candidates see Apply; already-applied jobs show a tick." }
    ]},
    output: "A search box, location select and Remote checkbox. Typing \"react\" updates the URL to `?q=react` after a pause and the list fades while refreshing. Candidates see Apply → Applying… → ✓ Applied; employers see no Apply button.",
    mistakes: [
      { bad: `useQuery({ queryKey: ['jobs'], queryFn: () => fetchJobs(filters) })`, good: `useQuery({ queryKey: ['jobs', filters], queryFn: () => fetchJobs(filters) })`, why: "If filters aren't in the key, Query returns the cached unfiltered list and never refetches." },
      { bad: `fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'multipart/form-data' }, body: formData })`, good: `fetch('/api/apply', { method: 'POST', body: formData })`, why: "The browser must set the multipart boundary itself; a manual header breaks the upload." }
    ],
    practice: [
      { level: "B", q: "Show the number of results, e.g. \"12 jobs\".", a: "`<p>{jobs.length} job{jobs.length === 1 ? '' : 's'}</p>`" },
      { level: "I", q: "Add a CV upload to the apply flow.", a: "A form with `<input type=\"file\" name=\"cv\" accept=\".pdf\">`; `mutationFn: () => fetch(url, { method: 'POST', body: new FormData(form) })`." },
      { level: "I", q: "Build the employer's \"Post a job\" form.", a: "Under `RequireRole role=\"employer\"`; a validated form whose mutation POSTs `/api/jobs` and invalidates `['jobs']`, then navigates to the new job." },
      { level: "C", q: "Let employers move applicants between stages (Applied → Interview → Offer).", a: "A PATCH mutation per applicant with an optimistic `setQueryData` update and rollback on error." }
    ],
    quiz: [
      { q: "Why put filters in the query key?", options: ["For logging", "So each filter combination has its own cache entry and triggers a fetch", "Keys must be arrays"], answer: 1, why: "The key identifies the data; change the key, get the right data." },
      { q: "What does `keepPreviousData` do?", options: ["Stores data in localStorage", "Keeps showing old results while new ones load", "Disables refetching"], answer: 1, why: "It avoids a flash of empty or loading UI between filters." },
      { q: "Employers can't see Apply because of a role check in React. Is the API safe?", options: ["Yes", "Only if the API also checks the role"], answer: 1, why: "Client checks are UX; the server must enforce." }
    ],
    rev: {
      sec30: "Job portal: filters in the URL, debounced text search, `useQuery(['jobs', filters])` with `keepPreviousData`. Role-guard layout routes split candidate and employer areas. Applying is a mutation that disables while pending and invalidates the candidate's applications. File uploads use `FormData`. The API enforces roles.",
      interview: [
        { level: "basic", q: "How do you build the search and filters?", a: "Controlled inputs write to `useSearchParams`; the list reads from the URL; the text input is debounced." },
        { level: "intermediate", q: "How do you handle two user types in one app?", a: "Store the role on the user; guard routes with a `RequireRole` layout; show role-specific links and actions; the API checks the role on every endpoint." },
        { level: "intermediate", q: "How do you keep \"My applications\" fresh after applying?", a: "Invalidate its query key in the apply mutation's `onSuccess` (or update it with `setQueryData`)." },
        { level: "advanced", q: "Search hits the API too often. What can you do?", a: "Debounce input, cache by key with a `staleTime`, cancel stale requests via the `signal` Query passes, and paginate results." },
        { level: "tricky", q: "Typing fast, the list shows results for an older query. Why can't that happen with Query?", a: "Each key has its own cache entry and Query only shows data for the current key, so late responses for old keys don't overwrite it." }
      ],
      cheat: [
        "Filters in URL; text debounced",
        "`queryKey: ['jobs', filters]`",
        "`placeholderData: keepPreviousData`",
        "`RequireRole` layout routes",
        "Apply = mutation + invalidate",
        "`FormData` uploads; no manual Content-Type",
        "API enforces roles"
      ]
    },
    related: ["API-025", "API-026", "AUTH-007", "STORE-022"],
    build: {
      features: ["Job search with filters in the URL", "Job detail page", "Candidate: apply (with CV upload) and track applications", "Employer: post jobs and review applicants", "Role-guarded routes", "Loading, empty and error states"],
      folders: `src/\n  auth/\n  features/\n    jobs/\n      JobsPage.jsx\n      JobDetail.jsx\n      ApplyButton.jsx\n    candidate/\n      MyApplications.jsx\n    employer/\n      PostJobForm.jsx\n      Applicants.jsx\n  routes.jsx`,
      steps: [
        { title: "Mock API", detail: "MSW: jobs search, job detail, apply, my applications, post job, applicants." },
        { title: "Search page", detail: "URL filters, debounced text, `useQuery` with `keepPreviousData`." },
        { title: "Roles", detail: "`RequireRole` layout routes and role-aware header." },
        { title: "Apply", detail: "Mutation with pending/success states; CV upload with `FormData`." },
        { title: "Employer area", detail: "Post-job form and applicants list." },
        { title: "Test", detail: "RTL as each role; Playwright for search → apply." }
      ],
      stretch: ["Saved searches with email alerts", "Applicant pipeline board (reuse PROJ-015)", "Salary range filter", "Server-side pagination"]
    }
  },

  "PROJ-017": {
    tldr: "Build a social feed: posts load in pages as you scroll (infinite feed), you can post a photo with a live preview (uploads), and a bell shows new notifications.",
    analogy: { icon: "📸", text: "A photo-sharing app: the feed keeps loading as you scroll, you see your photo before posting it, and a red dot appears when a friend likes it." },
    visual: { type: "cycle", title: "Infinite scroll loop", steps: [
      { label: "Render page", detail: "Show the posts loaded so far plus an invisible sentinel at the bottom." },
      { label: "Sentinel visible", detail: "`IntersectionObserver` fires when the user nears the end." },
      { label: "fetchNextPage", detail: "Request `?cursor=<last id>` for the next page." },
      { label: "Append", detail: "`useInfiniteQuery` adds the page to `data.pages`; the sentinel moves down." }
    ]},
    points: [
      "`useInfiniteQuery` stores pages; `getNextPageParam` returns the **next cursor** (or `undefined` when done).",
      "Use **cursor pagination** for feeds: new posts don't shift pages like `?page=2` does.",
      "An `IntersectionObserver` on a sentinel element triggers `fetchNextPage` (no scroll maths).",
      "Preview images with `URL.createObjectURL(file)` and **revoke** it in cleanup to free memory.",
      "Notifications: poll with `refetchInterval` or push via SSE/WebSocket; show an unread count.",
      "Very long feeds: virtualise; images: `loading=\"lazy\"` with width/height to avoid layout shift."
    ],
    code: { file: "Feed.jsx", lang: "jsx", src: `import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const getJson = url => fetch(url).then(r => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))));

export function Feed() {
  const sentinel = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => getJson(\`/api/feed?limit=10\${pageParam ? \`&cursor=\${pageParam}\` : ''}\`),
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: '400px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p>Loading feed…</p>;
  return (
    <main>
      {data.pages.flatMap(page => page.posts).map(post => (
        <article key={post.id}>
          <b>{post.author}</b>
          <img src={post.imageUrl} alt={post.caption} width={600} height={600} loading="lazy" />
          <p>{post.caption}</p>
        </article>
      ))}
      <div ref={sentinel} />
      {isFetchingNextPage && <p>Loading more…</p>}
      {!hasNextPage && <p>You're all caught up ✨</p>}
    </main>
  );
}

export function NewPost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upload = useMutation({
    mutationFn: formData => fetch('/api/posts', { method: 'POST', body: formData }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feed'] }); setFile(null); setPreview(null); },
  });

  return (
    <form onSubmit={e => { e.preventDefault(); upload.mutate(new FormData(e.currentTarget)); }}>
      <input type="file" name="image" accept="image/*" required onChange={e => setFile(e.target.files[0] ?? null)} />
      {preview && <img src={preview} alt="Preview" width={200} />}
      <input name="caption" placeholder="Say something…" />
      <button disabled={upload.isPending}>{upload.isPending ? 'Posting…' : 'Post'}</button>
    </form>
  );
}

export function NotificationBell() {
  const { data } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => getJson('/api/notifications?unread=true'),
    refetchInterval: 30_000,
  });
  const count = data?.count ?? 0;
  return <button aria-label={\`\${count} unread notifications\`}>🔔{count > 0 && <span className="dot">{count}</span>}</button>;
}`, walk: [
      { lines: [8, 9, 10, 11, 12, 13], note: "Each page fetches with the previous page's cursor; `undefined` from `getNextPageParam` means no more pages." },
      { lines: [15, 16, 17, 18, 19, 20, 21, 22, 23], note: "Watch an empty div; when it comes within 400px of view, load the next page. Disconnect in cleanup." },
      { lines: [28], note: "Flatten pages into one list for rendering." },
      { lines: [31], note: "Lazy images with width/height so the layout doesn't jump." },
      { lines: [47, 48, 49, 50, 51, 52], note: "Object URL preview, revoked when the file changes or the form unmounts." },
      { lines: [72, 73, 74, 75, 76], note: "Notifications: poll every 30 s (swap for SSE/WebSocket for instant updates)." }
    ]},
    output: "A feed of 10 posts; scrolling near the bottom shows \"Loading more…\" and appends 10 more until \"You're all caught up ✨\". Choosing a photo shows a preview; Post shows \"Posting…\" then the feed refreshes. The bell shows an unread count.",
    mistakes: [
      { bad: `window.addEventListener('scroll', () => {\n  if (window.innerHeight + scrollY >= document.body.offsetHeight) fetchNextPage();\n});`, good: `new IntersectionObserver(([e]) => e.isIntersecting && fetchNextPage()).observe(sentinel.current);`, why: "Scroll listeners fire constantly and need throttling; IntersectionObserver is efficient and simpler (remember to disconnect)." },
      { bad: `setPreview(URL.createObjectURL(file)); // never revoked`, good: `const url = URL.createObjectURL(file);\nsetPreview(url);\nreturn () => URL.revokeObjectURL(url);`, why: "Each object URL holds the file in memory until revoked." },
      { bad: `getJson(\`/api/feed?page=\${page}\`) // offset pages`, good: `getJson(\`/api/feed?cursor=\${lastId}\`)`, why: "With offsets, new posts shift everything and users see duplicates; cursors are stable." }
    ],
    practice: [
      { level: "B", q: "Show a \"Load more\" button as a fallback.", a: "`{hasNextPage && <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>Load more</button>}`" },
      { level: "I", q: "Make Like optimistic.", a: "`useMutation` with `onMutate`: cancel `['feed']`, `setQueryData` to toggle `liked` and the count inside `pages`, return the snapshot; restore it in `onError`." },
      { level: "I", q: "Reject images over 5 MB before uploading.", a: "In `onChange`: `if (file.size > 5 * 1024 * 1024) { setError('Max 5 MB'); return; }`. The server must check too." },
      { level: "C", q: "Replace polling with Server-Sent Events.", a: "`const es = new EventSource('/api/notifications/stream')` in an effect; on message `qc.setQueryData(['notifications', 'unread'], d => ({ count: d.count + 1 }))`; `es.close()` in cleanup." }
    ],
    quiz: [
      { q: "What tells `useInfiniteQuery` there are no more pages?", options: ["Returning `null` from `queryFn`", "`getNextPageParam` returning `undefined`", "Setting `hasNextPage` yourself"], answer: 1, why: "`hasNextPage` is derived from `getNextPageParam`." },
      { q: "Why cursor pagination for a feed?", options: ["Shorter URLs", "New posts don't shift pages, so no duplicates or gaps", "Required by React"], answer: 1, why: "Offsets move as items are added at the top." },
      { q: "Why revoke object URLs?", options: ["Security", "They keep the file in memory until revoked", "They expire otherwise"], answer: 1, why: "Revoking frees the memory when the preview is no longer needed." }
    ],
    rev: {
      sec30: "Social app: `useInfiniteQuery` with cursor pagination (`initialPageParam`, `getNextPageParam`), an IntersectionObserver sentinel to call `fetchNextPage`, and flattened `data.pages`. Uploads use `FormData` with an object-URL preview revoked in cleanup, then invalidate the feed. Notifications poll with `refetchInterval` or arrive via SSE/WebSocket.",
      interview: [
        { level: "basic", q: "How do you implement infinite scroll?", a: "Load pages with `useInfiniteQuery`, put a sentinel after the list, and call `fetchNextPage` when an IntersectionObserver sees it." },
        { level: "intermediate", q: "Cursor vs offset pagination for a feed?", a: "Cursor: \"items after id X\", stable as new posts arrive. Offset: \"page 3\", simple but shifts and duplicates in live feeds." },
        { level: "intermediate", q: "How do you show an image preview before upload?", a: "`URL.createObjectURL(file)` in an effect, set it as `img src`, and revoke it in the cleanup." },
        { level: "advanced", q: "The feed has 5,000 posts loaded and scrolling lags. Fix?", a: "Virtualise the list, lazy-load images with fixed dimensions, and use `maxPages` in `useInfiniteQuery` to drop old pages." },
        { level: "tricky", q: "The observer calls `fetchNextPage` twice for the same page. Why?", a: "It fired again before the fetch started; guard with `!isFetchingNextPage` (Query also dedupes in-flight fetches)." }
      ],
      compare: { cols: ["", "Polling", "SSE", "WebSocket"], rows: [
        ["Setup", "`refetchInterval`", "`EventSource`", "`WebSocket` + server"],
        ["Latency", "Up to interval", "Instant", "Instant"],
        ["Direction", "Client asks", "Server → client", "Both ways"]
      ]},
      cheat: [
        "`useInfiniteQuery` + `initialPageParam` + `getNextPageParam`",
        "`undefined` next param = end of feed",
        "Cursor pagination for feeds",
        "IntersectionObserver sentinel; disconnect in cleanup",
        "`createObjectURL` preview; revoke in cleanup",
        "`FormData` upload, then invalidate feed",
        "Notifications: poll, SSE or WebSocket"
      ]
    },
    related: ["API-024", "STORE-020", "PERF-007", "API-027"],
    build: {
      features: ["Infinite feed with cursor pagination", "Create a post with photo preview", "Upload with progress/pending state", "Like with optimistic update", "Notification bell with unread count", "Lazy images without layout shift"],
      folders: `src/\n  features/\n    feed/\n      Feed.jsx\n      PostCard.jsx\n      useFeed.js\n    posts/\n      NewPost.jsx\n    notifications/\n      NotificationBell.jsx\n  mocks/\n    handlers.js\n  App.jsx`,
      steps: [
        { title: "Mock API", detail: "MSW: `/api/feed?cursor=` returning `{ posts, nextCursor }`, post upload, notifications." },
        { title: "Infinite feed", detail: "`useInfiniteQuery` and flattened pages." },
        { title: "Sentinel", detail: "IntersectionObserver with `rootMargin` to prefetch early." },
        { title: "Uploads", detail: "File input, preview with revoke, `FormData` mutation, invalidate feed." },
        { title: "Likes", detail: "Optimistic mutation that updates the cached pages." },
        { title: "Notifications", detail: "Polling bell; later SSE." },
        { title: "Test", detail: "RTL with a mocked IntersectionObserver; Playwright scrolls and asserts more posts." }
      ],
      stretch: ["Virtualised feed", "Comments thread", "Image compression before upload", "Real-time notifications over SSE"]
    }
  },

  "PROJ-018": {
    tldr: "Build a shop back-office in TypeScript with Next.js (framework-only): login, roles and permissions checked on the server, typed data, tests at every level, and a CI/CD pipeline that tests and deploys every change.",
    analogy: { icon: "🏬", text: "The back office of a chain of shops: staff badges (auth), keys that open only some doors (RBAC), stock checks before opening (tests) and a delivery schedule that runs itself (CI/CD)." },
    visual: { type: "layers", title: "Enterprise app layers", items: [
      { label: "UI (Client Components)", detail: "Tables, forms, dialogs; typed props; accessible components." },
      { label: "Routes (Server Components)", detail: "Next.js App Router pages fetch data and check permissions before rendering." },
      { label: "Server Actions / Route Handlers", detail: "Validate input with Zod, check permission, write, `revalidatePath`." },
      { label: "Domain + RBAC", detail: "Typed roles → permissions; `requirePermission()` used everywhere." },
      { label: "Data", detail: "Database via an ORM (e.g. Prisma/Drizzle), typed queries." },
      { label: "Quality + delivery", detail: "Vitest, RTL, MSW, Playwright; GitHub Actions; preview and production deploys." }
    ]},
    points: [
      "**Framework-only**: Server Components, Server Actions and `proxy.ts` (named `middleware.ts` before Next.js 16) need Next.js.",
      "Type everything that crosses a boundary: `Role`, `Permission`, Zod schemas → `z.infer` types.",
      "**Check permissions on the server** in every page and action; the UI only hides buttons.",
      "Validate every Server Action input with Zod: actions are public HTTP endpoints.",
      "Test pyramid: many unit tests (RBAC, schemas), some integration (RTL + MSW), a few E2E (Playwright).",
      "CI on every PR: typecheck, lint, test, build, E2E; deploy previews per PR and production on merge."
    ],
    code: { file: "app/(admin)/orders/actions.ts", lang: "ts", src: `// Next.js 16 App Router (framework-only)
// ---- lib/rbac.ts ----
export type Role = 'admin' | 'manager' | 'support';
export type Permission = 'orders:read' | 'orders:refund' | 'staff:manage';

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: ['orders:read', 'orders:refund', 'staff:manage'],
  manager: ['orders:read', 'orders:refund'],
  support: ['orders:read'],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

// ---- lib/session.ts ----
import { hasPermission, type Permission, type Role } from '@/lib/rbac';
import { auth } from '@/auth'; // e.g. Auth.js; any server-side session works
import { redirect } from 'next/navigation';

export async function requirePermission(permission: Permission) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = session.user.role as Role;
  if (!hasPermission(role, permission)) throw new Error('Forbidden');
  return session.user;
}

// ---- app/(admin)/orders/actions.ts ----
'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/session';

const RefundSchema = z.object({
  orderId: z.uuid(),
  amountPence: z.coerce.number().int().positive(),
  reason: z.string().min(3).max(200),
});
export type RefundInput = z.infer<typeof RefundSchema>;

export type ActionState = { ok: boolean; message: string };

export async function refundOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requirePermission('orders:refund');

  const parsed = RefundSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const order = await db.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return { ok: false, message: 'Order not found' };
  if (parsed.data.amountPence > order.totalPence) {
    return { ok: false, message: 'Refund is larger than the order' };
  }

  await db.refund.create({ data: { ...parsed.data, byUserId: user.id } });
  revalidatePath(\`/orders/\${order.id}\`);
  return { ok: true, message: 'Refund issued' };
}

// ---- app/(admin)/orders/[id]/RefundForm.tsx ----
// 'use client';
// const [state, formAction, pending] = useActionState(refundOrder, { ok: false, message: '' });
// <form action={formAction}> ... <button disabled={pending}>Refund</button> {state.message} </form>`, walk: [
      { lines: [3, 4, 6, 7, 8, 9, 10], note: "Union types make typos impossible; `Record<Role, ...>` forces every role to be listed." },
      { lines: [21, 22, 23, 24, 25, 26], note: "One server-side guard: no session → login, missing permission → Forbidden." },
      { lines: [36, 37, 38, 39, 40, 41], note: "Zod validates the form data and `z.infer` gives the matching TypeScript type for free." },
      { lines: [45, 46], note: "First line of every action: check permission. Server Actions are reachable by direct POST." },
      { lines: [48, 49, 53, 54], note: "Validate shape, then business rules (refund can't exceed the order)." },
      { lines: [57, 58], note: "Write with an audit field, then refresh the order page's cached data." }
    ]},
    output: "A manager submits a £5 refund: \"Refund issued\" and the order page updates. A support user posting the same form directly gets Forbidden. Invalid input returns the first Zod message.",
    mistakes: [
      { bad: `'use server';\nexport async function refundOrder(formData) {\n  await db.refund.create({ data: Object.fromEntries(formData) });\n}`, good: `'use server';\nexport async function refundOrder(prev, formData) {\n  await requirePermission('orders:refund');\n  const data = RefundSchema.parse(Object.fromEntries(formData));\n  await db.refund.create({ data });\n}`, why: "A Server Action is a public endpoint: anyone can call it. Always authorise and validate." },
      { bad: `{user.role === 'admin' && <RefundButton />} // only check`, good: `// UI: hide the button\n// Server: requirePermission('orders:refund') in the action`, why: "Hiding a button is UX; security lives on the server." },
      { bad: `type Role = string;`, good: `type Role = 'admin' | 'manager' | 'support';`, why: "A plain string accepts typos like 'admn'; a union is checked by the compiler." }
    ],
    practice: [
      { level: "B", q: "Write a Vitest unit test for `hasPermission`.", a: "`expect(hasPermission('support', 'orders:refund')).toBe(false)` and `expect(hasPermission('manager', 'orders:refund')).toBe(true)`." },
      { level: "I", q: "Redirect logged-out users before any admin page renders.", a: "In `proxy.ts` (Next.js 16; `middleware.ts` before) check the session cookie for `/(admin)` paths and redirect to `/login`. Still check permissions in each page and action." },
      { level: "I", q: "Write the GitHub Actions CI job.", a: "On pull_request: checkout, setup-node with cache, `npm ci`, then typecheck, lint, test, build, and Playwright.", code: `name: CI\non: [pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 22, cache: npm }\n      - run: npm ci\n      - run: npx tsc --noEmit\n      - run: npm run lint\n      - run: npm test -- --run\n      - run: npm run build\n      - run: npx playwright install --with-deps && npx playwright test` },
      { level: "C", q: "Add an audit log page only admins can see.", a: "Server Component calls `requirePermission('staff:manage')`, queries refunds with user and date, and renders a paginated table; add a Playwright test logging in as each role." }
    ],
    quiz: [
      { q: "Where must the refund permission be checked?", options: ["Only in the button", "Inside the Server Action on the server", "Only in proxy.ts"], answer: 1, why: "The action can be called directly; the check must live where the write happens." },
      { q: "What does `z.infer<typeof RefundSchema>` give you?", options: ["Runtime validation", "A TypeScript type matching the schema", "A database table"], answer: 1, why: "One schema gives both runtime checks and static types." },
      { q: "Which belongs in CI for every PR?", options: ["Deploy to production", "Typecheck, lint, tests and build", "Manual QA only"], answer: 1, why: "Fast automated checks stop broken code merging; production deploys happen on merge." }
    ],
    rev: {
      sec30: "Framework-only: a Next.js 16 + TypeScript back-office. Typed roles map to permissions; `requirePermission()` runs on the server in every page and Server Action. Inputs are validated with Zod (types via `z.infer`), writes call `revalidatePath`. Tests: unit (RBAC, schemas), integration (RTL + MSW), E2E (Playwright per role). GitHub Actions runs typecheck, lint, test, build and E2E on PRs, with preview and production deploys.",
      interview: [
        { level: "basic", q: "Why TypeScript for a large app?", a: "Types catch mistakes at compile time, document data shapes, and make refactors across many files safe." },
        { level: "intermediate", q: "How do you implement RBAC in Next.js?", a: "Typed role → permission map, a server `requirePermission()` used in pages, Server Actions and route handlers, and the UI hiding what the user can't do." },
        { level: "intermediate", q: "Why validate Server Action input if the form already validates?", a: "Actions are public POST endpoints; anyone can send any data. Zod on the server is the real check." },
        { level: "advanced", q: "Describe your CI/CD pipeline.", a: "On PR: install with cache, typecheck, lint, unit/integration tests, build, Playwright against a preview deploy. On merge to main: deploy production, run smoke tests, monitor errors." },
        { level: "advanced", q: "What do you test at each level?", a: "Unit: RBAC and schemas. Integration: forms with RTL + MSW. E2E: critical journeys (login, refund) per role with Playwright." },
        { level: "tricky", q: "Is `proxy.ts` (middleware) enough for authorisation?", a: "No. It's good for early redirects, but checks must also run where data is read or written, because actions and handlers can be called directly." }
      ],
      scenario: [
        { q: "A bug let support staff issue refunds. How do you stop it happening again?", a: "Move the check into the action with `requirePermission`, add a unit test for the permission map and a Playwright test that a support user gets Forbidden, and make CI block merges on failure." }
      ],
      cheat: [
        "Framework-only: Next.js App Router, Server Actions",
        "Typed `Role` / `Permission` unions",
        "`requirePermission()` in every page and action",
        "Zod validate + `z.infer` types",
        "`revalidatePath` after writes",
        "Test pyramid: unit > integration > E2E",
        "CI: tsc, lint, test, build, Playwright",
        "`proxy.ts` (was middleware.ts) for redirects only"
      ]
    },
    related: ["AUTH-007", "TS-020", "PROD-011", "NEXT-012"],
    build: {
      features: ["Login with server-side sessions", "Roles and permissions (admin, manager, support)", "Orders list and detail with refunds", "Staff management (admin only)", "Typed data with Zod validation", "Unit, integration and E2E tests", "CI on PRs, preview + production deploys", "Error monitoring"],
      folders: `app/\n  (auth)/login/page.tsx\n  (admin)/\n    layout.tsx\n    orders/\n      page.tsx\n      [id]/page.tsx\n      [id]/RefundForm.tsx\n      actions.ts\n    staff/page.tsx\nlib/\n  rbac.ts\n  session.ts\n  db.ts\n  schemas/\ntests/\n  unit/\n  e2e/\nproxy.ts\n.github/workflows/ci.yml`,
      steps: [
        { title: "Scaffold", detail: "Next.js with TypeScript, ESLint and the App Router.", code: `npx create-next-app@latest backoffice --ts --eslint --app` },
        { title: "Auth", detail: "Pick an auth library (e.g. Auth.js) and add `role` to the session." },
        { title: "RBAC", detail: "Typed permission map + `requirePermission()`; unit tests first." },
        { title: "Features", detail: "Orders pages as Server Components; refunds as validated Server Actions with `useActionState` forms." },
        { title: "Tests", detail: "Vitest + RTL + MSW for components; Playwright journeys per role." },
        { title: "CI/CD", detail: "GitHub Actions: tsc, lint, test, build, E2E; preview deploys per PR, production on merge." },
        { title: "Operate", detail: "Error monitoring, logging and an architecture decision record." }
      ],
      stretch: ["Multi-tenant shops", "Audit log with filters", "Feature flags", "Accessibility checks (axe) in CI"]
    }
  },
};
