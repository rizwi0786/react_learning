export default {
  "WEB-029": {
    tldr: "`async`/`await` is a nicer way to write promise code. `await` pauses the function until the promise settles, so async code reads top to bottom, and `try/catch` handles failures.",
    analogy: { icon: "☕", text: "Ordering at a coffee shop: you order, wait at the counter for your name (await), then pick up the drink. Meanwhile the barista keeps serving other people." },
    visual: { type: "flow", title: "What happens at an await", steps: [
      { label: "Call loadCart()", detail: "An `async` function always returns a **promise** straight away." },
      { label: "Hit await", detail: "`await fetch(...)` pauses **only this function**. The rest of the page keeps running." },
      { label: "Promise settles", detail: "When the fetch finishes, the function resumes on the next line with the value." },
      { label: "Error? → catch", detail: "If the promise rejects, `await` throws, and the nearest `catch` block runs." },
      { label: "Return", detail: "`return cart` resolves the function's promise with `cart`." }
    ]},
    points: [
      "`async function` always returns a **promise**; `return x` resolves it, `throw` rejects it.",
      "`await` unwraps a promise's value and pauses only the current function, never the browser.",
      "Wrap awaits in `try/catch/finally`: catch handles rejection, finally is perfect for `setLoading(false)`.",
      "Awaiting one by one is **sequential**. For independent work use `await Promise.all([a(), b()])`.",
      "In React: `useEffect` can't be `async` itself; define an async function inside it and call it."
    ],
    code: { file: "cart.js", lang: "js", src: `async function loadCart(userId) {
  try {
    const res = await fetch(\`/api/carts/\${userId}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const cart = await res.json();
    return cart.items;
  } catch (err) {
    console.error('Could not load cart:', err.message);
    return [];
  } finally {
    console.log('done loading');
  }
}

// Parallel: both requests start at once
async function loadPage(userId) {
  const [items, deals] = await Promise.all([
    loadCart(userId),
    fetch('/api/deals').then(r => r.json()),
  ]);
  console.log(items.length, 'items,', deals.length, 'deals');
}

loadPage(42);`, walk: [
      { lines: [1], note: "`async` makes the function return a promise automatically." },
      { lines: [3, 5], note: "Each `await` waits for a promise and gives back its value. Reads like normal code." },
      { lines: [4], note: "fetch doesn't reject on 404/500, so throw yourself to jump into `catch`." },
      { lines: [7, 8, 9], note: "Any rejection or throw above lands here. Return a safe fallback." },
      { lines: [10, 11, 12], note: "`finally` runs on success and failure: ideal for turning a spinner off." },
      { lines: [17, 18, 19, 20], note: "`Promise.all` runs both at the same time and waits for both." }
    ]},
    output: "Console: “done loading”, then e.g. “3 items, 5 deals”. On a failed cart: an error message, then “0 items, …”.",
    mistakes: [
      { bad: `useEffect(async () => {\n  const res = await fetch('/api/todos');\n}, []);`, good: `useEffect(() => {\n  async function load() {\n    const res = await fetch('/api/todos');\n  }\n  load();\n}, []);`, why: "An async function returns a promise, but useEffect expects nothing or a cleanup function. Put the async function inside." },
      { bad: `const a = await getUser();\nconst b = await getWeather();`, good: `const [a, b] = await Promise.all([\n  getUser(), getWeather()\n]);`, why: "Independent requests awaited one after another wait for each other. `Promise.all` runs them in parallel." },
      { bad: `function save() {\n  const res = await fetch('/api/notes');\n}`, good: `async function save() {\n  const res = await fetch('/api/notes');\n}`, why: "`await` is only allowed inside an `async` function (or at the top level of a module)." }
    ],
    practice: [
      { level: "B", q: "Rewrite `getTodos().then(t => console.log(t))` with async/await.", a: "Make an async function and await the call.", code: `async function show() {\n  const t = await getTodos();\n  console.log(t);\n}` },
      { level: "B", q: "What does `async function f() { return 5; }` return when called?", a: "A promise that resolves to 5, not the number 5." },
      { level: "I", q: "Load a weather forecast; on error show 'Offline' and always hide the spinner.", a: "try: await + set data; catch: set 'Offline'; finally: hide spinner.", code: `async function load() {\n  try {\n    const w = await getWeather();\n    show(w);\n  } catch {\n    show('Offline');\n  } finally {\n    spinner.hidden = true;\n  }\n}` },
      { level: "C", q: "Fetch 3 recipes in parallel but don't fail if one fails.", a: "Use `Promise.allSettled` and keep the fulfilled ones.", code: `const results = await Promise.allSettled(ids.map(getRecipe));\nconst ok = results.filter(r => r.status === 'fulfilled').map(r => r.value);` }
    ],
    quiz: [
      { q: "What does `await` pause?", options: ["The whole browser tab", "Only the current async function", "All JavaScript on the page", "Nothing; it just returns the promise"], answer: 1, why: "The function is suspended; the event loop keeps running other code." },
      { q: "An awaited promise rejects. What happens?", options: ["`await` returns undefined", "`await` throws, so `catch` runs", "The function silently stops", "The page reloads"], answer: 1, why: "A rejection becomes a thrown error at the `await` line." },
      { q: "Two independent requests: fastest way?", options: ["await one, then await the other", "`await Promise.all([a(), b()])`", "Wrap both in setTimeout"], answer: 1, why: "Promise.all starts both at once and waits for the slower one, not the sum." }
    ],
    rev: {
      sec30: "`async`/`await` is syntax over promises. An async function always returns a promise. `await` pauses just that function until a promise settles: fulfil gives a value, reject throws. Use try/catch/finally for errors and cleanup. Await sequentially only when steps depend on each other; otherwise `Promise.all`.",
      interview: [
        { level: "basic", q: "What does an async function return?", a: "Always a promise. Returned values resolve it; thrown errors reject it." },
        { level: "intermediate", q: "Does `await` block the main thread?", a: "No. It suspends the current function and schedules the rest as a microtask when the promise settles. Other code and rendering keep going." },
        { level: "intermediate", q: "Why can't the `useEffect` callback be async?", a: "useEffect expects undefined or a cleanup function. An async function returns a promise, which React can't use as cleanup. Define and call an async function inside." },
        { level: "advanced", q: "How do you run awaits in parallel?", a: "Start the promises first, then await them together: `await Promise.all([...])`, or `allSettled` if partial failure is fine." },
        { level: "tricky", q: "`try { return fetchX(); } catch {}`: is the rejection caught?", a: "No. Returning the promise without `await` exits the try before it rejects. Use `return await fetchX()` inside try/catch." }
      ],
      predict: [
        { code: `async function f() {\n  console.log('A');\n  await null;\n  console.log('B');\n}\nf();\nconsole.log('C');`, answer: "A, C, B", why: "Code before the first await runs synchronously; the rest resumes as a microtask after the current script." }
      ],
      cheat: [
        "`async fn` → always returns a promise",
        "`await p` → value of p, or throws if p rejects",
        "try/catch for errors, finally for cleanup (spinners)",
        "Sequential awaits add up; `Promise.all` runs in parallel",
        "`return await` inside try so the catch sees the rejection",
        "useEffect: async function inside, not an async callback"
      ]
    },
    related: ["WEB-028", "WEB-030", "WEB-039", "API-012"]
  },

  "WEB-030": {
    tldr: "`fetch()` asks a server for data and gives you a promise of a `Response`. You check `res.ok`, then read the body with `res.json()`. It only rejects on network failure, not on 404 or 500.",
    analogy: { icon: "📦", text: "Ordering a parcel: the courier always hands you a box (Response). You must check the label says 'delivered OK' before opening it (res.ok), then unpack it (res.json())." },
    visual: { type: "flow", title: "One fetch, start to finish", steps: [
      { label: "fetch(url, options)", detail: "Sends the HTTP request. Returns a promise right away." },
      { label: "Headers arrive", detail: "Promise resolves with a `Response`: `status`, `ok`, `headers`. Body not read yet." },
      { label: "Check res.ok", detail: "`ok` is true for 200-299. A 404 or 500 still **resolves**; you must check." },
      { label: "Read body", detail: "`await res.json()` (or `.text()`) streams and parses the body. Read it once." },
      { label: "Use the data", detail: "Show products, save to state, etc. Network errors land in `catch`." }
    ]},
    points: [
      "Default is **GET**. For POST pass `{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }`.",
      "fetch rejects **only** on network errors (offline, CORS, DNS). HTTP errors resolve with `ok: false`.",
      "Two awaits: one for the response headers, one for `res.json()`.",
      "The body can be read **once**. A second `res.json()` fails (“body already used”).",
      "In React: fetch inside `useEffect` (or a library like TanStack Query), store results in state, show loading/error UI."
    ],
    code: { file: "products.js", lang: "js", src: `async function getProducts() {
  const res = await fetch('https://dummyjson.com/products?limit=3');

  if (!res.ok) {
    throw new Error(\`Request failed: \${res.status}\`);
  }

  const data = await res.json();
  return data.products;
}

async function addToCart(productId) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty: 1 }),
  });
  if (!res.ok) throw new Error('Could not add to cart');
  return res.json();
}

getProducts()
  .then(list => list.forEach(p => console.log(p.title, p.price)))
  .catch(err => console.error(err.message));`, walk: [
      { lines: [2], note: "First await: wait for the response status and headers." },
      { lines: [4, 5, 6], note: "Turn HTTP errors (404, 500) into a real error. fetch won't do it for you." },
      { lines: [8], note: "Second await: read and parse the JSON body." },
      { lines: [13, 14, 15, 16, 17], note: "POST: set method, a JSON content-type header, and a stringified body." },
      { lines: [22, 23, 24], note: "The caller handles both network errors and the thrown HTTP error in one `catch`." }
    ]},
    output: "Console: three product titles with prices, e.g. “Essence Mascara Lash Princess 9.99”.",
    mistakes: [
      { bad: `try {\n  const res = await fetch(url);\n  const data = await res.json();\n} catch (e) { /* 404 lands here? */ }`, good: `const res = await fetch(url);\nif (!res.ok) throw new Error(\`HTTP \${res.status}\`);\nconst data = await res.json();`, why: "A 404/500 does not reject. Without the `ok` check you parse an error page as if it were data." },
      { bad: `fetch('/api/notes', {\n  method: 'POST',\n  body: { title: 'Hi' }\n});`, good: `fetch('/api/notes', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ title: 'Hi' })\n});`, why: "The body must be a string (or FormData/Blob). An object is sent as “[object Object]”." },
      { bad: `const data = fetch(url).json();`, good: `const res = await fetch(url);\nconst data = await res.json();`, why: "fetch returns a promise, not a Response. Await it (or `.then`) first." }
    ],
    practice: [
      { level: "B", q: "Fetch `https://dummyjson.com/todos/1` and log its `todo` field.", a: "Await fetch, check ok, await json, log.", code: `const res = await fetch('https://dummyjson.com/todos/1');\nif (!res.ok) throw new Error(res.status);\nconst todo = await res.json();\nconsole.log(todo.todo);` },
      { level: "B", q: "What is `res.ok` for a 201 Created? For a 404?", a: "true for 201 (200-299 range); false for 404." },
      { level: "I", q: "Send a new chat message `{ text }` with POST.", a: "method POST, JSON header, JSON.stringify body.", code: `await fetch('/api/messages', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ text })\n});` },
      { level: "C", q: "Write `getJSON(url)` that throws with status and message for non-ok responses.", a: "Check ok, read `res.text()` for details, throw an Error including `res.status`.", code: `async function getJSON(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(\`\${res.status}: \${await res.text()}\`);\n  return res.json();\n}` }
    ],
    quiz: [
      { q: "The server returns 500. What does `fetch` do?", options: ["Rejects the promise", "Resolves with `res.ok === false`", "Retries automatically", "Returns null"], answer: 1, why: "Only network-level failures reject. HTTP error statuses resolve." },
      { q: "Why are there usually two awaits?", options: ["One for headers, one to read the body", "One for the request, one for CORS", "Because fetch is called twice"], answer: 0, why: "fetch resolves when headers arrive; the body streams and is parsed by `res.json()`." },
      { q: "Correct way to send JSON?", options: ["`body: data`", "`body: JSON.stringify(data)` plus a JSON content-type", "`json: data`"], answer: 1, why: "fetch sends strings; the header tells the server how to read it." }
    ],
    rev: {
      sec30: "`fetch(url, options)` returns a promise of a Response. It rejects only on network failure, so always check `res.ok` (status 200-299) and throw otherwise. Read the body once with `await res.json()`. For POST/PUT send `JSON.stringify(data)` with a `Content-Type: application/json` header. In React, fetch in an effect or use TanStack Query.",
      interview: [
        { level: "basic", q: "Does fetch throw on a 404?", a: "No. It resolves with `ok: false` and `status: 404`. You check `res.ok` and throw yourself." },
        { level: "intermediate", q: "Why is `res.json()` async?", a: "The body arrives as a stream after the headers. `json()` reads the whole stream and parses it, which takes time." },
        { level: "intermediate", q: "How do you cancel a fetch?", a: "Pass `signal` from an `AbortController` and call `controller.abort()`. The fetch rejects with an AbortError. Common in effect cleanups." },
        { level: "advanced", q: "fetch vs Axios?", a: "fetch is built in and minimal. Axios adds automatic JSON, throws on HTTP errors, interceptors and timeouts. Both work fine in React." },
        { level: "tricky", q: "You get a CORS error. Is that `res.ok === false`?", a: "No. The browser blocks the response, so fetch rejects with a TypeError and you never see a status." }
      ],
      debug: [
        { code: `const res = await fetch('/api/user');\nconsole.log(await res.json());\nconst user = await res.json();`, fix: `const res = await fetch('/api/user');\nconst user = await res.json();\nconsole.log(user);`, why: "The body stream can only be consumed once. The second `json()` throws “body already used”." }
      ],
      cheat: [
        "`fetch(url)` → Promise<Response>; default method GET",
        "Rejects only on network/CORS errors",
        "`res.ok` is true for 200-299: check it",
        "`await res.json()` reads the body (once)",
        "POST: method, JSON header, `JSON.stringify(body)`",
        "Cancel with `AbortController` + `signal`"
      ]
    },
    related: ["WEB-029", "WEB-038", "API-006", "API-023"]
  },

  "WEB-031": {
    tldr: "JavaScript runs on **one thread**: one thing at a time. The event loop lets it do async work anyway: slow jobs (timers, network) happen outside, and their callbacks queue up and run when the call stack is empty.",
    analogy: { icon: "🍳", text: "A single chef. They put the pasta on to boil (timer), take the next order, and only plate the pasta when the timer rings and their hands are free." },
    visual: { type: "cycle", title: "The event loop", steps: [
      { label: "Run the stack", detail: "Execute synchronous code until the **call stack** is empty." },
      { label: "Drain microtasks", detail: "Run **every** queued promise callback (`.then`, code after `await`)." },
      { label: "Render (maybe)", detail: "Browser may update the screen: style, layout, paint." },
      { label: "One macrotask", detail: "Take the next task from the queue (timer, click, network event) and run it." }
    ]},
    points: [
      "**One thread**: a long loop blocks clicks, scrolling and rendering until it finishes.",
      "Timers, fetch and events are handled by the browser (**Web APIs**); JS only runs their callbacks later.",
      "Callbacks wait in queues and run **only when the call stack is empty**.",
      "`setTimeout(fn, 0)` means “as soon as possible after current work”, not “now”.",
      "In React: state updates in one event are batched, and heavy work in render freezes the UI the same way."
    ],
    code: { file: "loop.js", lang: "js", src: `console.log('1. Take order');

setTimeout(() => {
  console.log('4. Pasta timer rang');
}, 0);

fetch('https://dummyjson.com/recipes/1')
  .then(r => r.json())
  .then(recipe => console.log('5. Recipe:', recipe.name));

Promise.resolve().then(() => {
  console.log('3. Quick promise callback');
});

console.log('2. Take next order');

// Blocking: nothing else can run for ~2s
const end = Date.now() + 2000;
while (Date.now() < end) {}`, walk: [
      { lines: [1, 15], note: "Synchronous code runs first, top to bottom, on the call stack." },
      { lines: [3, 4, 5], note: "The browser holds the timer. Its callback queues as a **macrotask** after 0 ms." },
      { lines: [7, 8, 9], note: "The network request happens off-thread. `.then` runs later when data arrives." },
      { lines: [11, 12, 13], note: "An already-resolved promise: its callback is a **microtask**, run before timers." },
      { lines: [18, 19], note: "A busy loop hogs the only thread: the timer and clicks wait until it ends." }
    ]},
    output: "1. Take order → 2. Take next order → (2 s freeze) → 3. Quick promise callback → 4. Pasta timer rang → 5. Recipe: …",
    mistakes: [
      { bad: `for (let i = 0; i < 1e9; i++) total += i;\n// UI frozen`, good: `// Split work, or move it off the main thread\nconst worker = new Worker('sum.js');`, why: "A long synchronous job blocks the single thread: no clicks, no paint. Chunk it or use a Web Worker." },
      { bad: `setTimeout(save, 0);\n// assume save ran already\nshowSaved();`, good: `setTimeout(() => {\n  save();\n  showSaved();\n}, 0);`, why: "A 0 ms timer still waits for the current code (and all microtasks) to finish." }
    ],
    practice: [
      { level: "B", q: "Why does a page freeze during a huge `for` loop?", a: "JS has one thread; while the loop runs, the event loop can't handle clicks or render." },
      { level: "B", q: "Who counts down a `setTimeout`: JavaScript or the browser?", a: "The browser (Web API). JS only runs the callback once it is queued and the stack is empty." },
      { level: "I", q: "Order these: `setTimeout(log A)`, `Promise.resolve().then(log B)`, `log C`.", a: "C, B, A. Sync first, then microtasks, then the timer task." },
      { level: "C", q: "Process 100 000 todos without freezing the UI.", a: "Do batches and yield between them with `setTimeout`, or use a Web Worker.", code: `function processInChunks(items, i = 0) {\n  const end = Math.min(i + 1000, items.length);\n  for (; i < end; i++) handle(items[i]);\n  if (i < items.length) setTimeout(() => processInChunks(items, i));\n}` }
    ],
    quiz: [
      { q: "How many things can the JS main thread execute at once?", options: ["One", "One per CPU core", "Unlimited with async"], answer: 0, why: "One call stack, one thread. Concurrency comes from the event loop and browser APIs." },
      { q: "When does a queued callback run?", options: ["Immediately when queued", "When the call stack is empty", "After the page reloads", "Only after 4 ms"], answer: 1, why: "The loop only picks the next task once current code has finished." },
      { q: "`setTimeout(fn, 0)` means:", options: ["Run fn now", "Run fn after current code and microtasks", "Run fn before promises"], answer: 1, why: "It is a macrotask: it waits for the stack and the microtask queue to drain." }
    ],
    rev: {
      sec30: "JS has one call stack. Async work (timers, network, events) is handled by the browser; when done, callbacks are queued. The event loop: run the stack until empty, drain all microtasks (promises), maybe render, then take one macrotask (timer/event) and repeat. Long sync code blocks everything, including rendering.",
      interview: [
        { level: "basic", q: "What is the event loop?", a: "The mechanism that waits for the call stack to empty, then runs queued callbacks (microtasks first, then the next task), letting one thread handle async work." },
        { level: "intermediate", q: "If JS is single-threaded, how does fetch run in parallel?", a: "The browser does the network work on its own threads. JS only runs the `.then` callback when the response is ready." },
        { level: "intermediate", q: "Why can a long render make a React app feel frozen?", a: "Rendering runs on the main thread too. While it runs, input and paint wait. React's transitions let it pause rendering to stay responsive." },
        { level: "advanced", q: "Where does browser rendering fit in the loop?", a: "Between tasks, after microtasks drain, the browser may run rAF callbacks, style, layout and paint (roughly every 16 ms at 60 fps)." },
        { level: "tricky", q: "Can an endless chain of microtasks freeze the page?", a: "Yes. The microtask queue is fully drained before rendering or the next task, so a self-scheduling promise loop starves everything." }
      ],
      predict: [
        { code: `setTimeout(() => console.log('timer'), 0);\nconsole.log('sync');`, answer: "sync, timer", why: "The timer callback waits in the task queue until the synchronous script finishes." }
      ],
      cheat: [
        "One thread, one call stack",
        "Web APIs (timers, fetch, DOM events) work outside JS",
        "Loop: stack empty → all microtasks → render? → one task",
        "Long sync code blocks clicks and painting",
        "`setTimeout(fn, 0)` = later, not now",
        "Heavy CPU work → chunk it or use a Web Worker"
      ]
    },
    related: ["WEB-032", "WEB-033", "WEB-029", "RENDER-013"]
  },

  "WEB-032": {
    tldr: "The call stack is JavaScript's to-do pile of running functions. Calling a function pushes it on top; returning pops it off. A stack trace is a snapshot of that pile when an error happened.",
    analogy: { icon: "🍽️", text: "A stack of plates: you can only add or remove the top one. The last function called is the first one to finish (last in, first out)." },
    visual: { type: "timeline", title: "Checkout() on the call stack", frames: [
      { label: "start", state: "[ main ]", note: "The script itself is the bottom frame." },
      { label: "call checkout", state: "[ main, checkout ]", note: "checkout() is pushed on top." },
      { label: "call getTotal", state: "[ main, checkout, getTotal ]", note: "checkout waits while getTotal runs." },
      { label: "call applyTax", state: "[ main, checkout, getTotal, applyTax ]", note: "The deepest frame runs now." },
      { label: "returns", state: "[ main, checkout ]", note: "applyTax and getTotal return and pop off." },
      { label: "done", state: "[ ]", note: "Stack empty: the event loop can run queued callbacks." }
    ]},
    points: [
      "**LIFO** (last in, first out): the most recent call finishes first.",
      "Each frame holds that call's local variables and where to return to.",
      "A stack trace lists frames **top = where it broke**, below = who called it. Read top-down to find your code.",
      "Infinite recursion keeps pushing frames → `RangeError: Maximum call stack size exceeded`.",
      "In React: traces mix React internals with your components. Look for your own file names (e.g. `Cart.jsx`)."
    ],
    code: { file: "checkout.js", lang: "js", src: `function applyTax(amount) {
  if (amount < 0) {
    throw new Error('Negative total');
  }
  return amount * 1.2;
}

function getTotal(cart) {
  const sum = cart.reduce((s, item) => s + item.price, 0);
  return applyTax(sum);
}

function checkout(cart) {
  const total = getTotal(cart);
  console.log('Pay', total.toFixed(2));
}

checkout([{ price: 10 }, { price: 5 }]);
checkout([{ price: -50 }]);

/* Uncaught Error: Negative total
    at applyTax (checkout.js:3)
    at getTotal (checkout.js:10)
    at checkout (checkout.js:14)
    at checkout.js:19              */`, walk: [
      { lines: [18], note: "checkout is pushed; it calls getTotal, which calls applyTax. Stack is 3 deep." },
      { lines: [5, 10], note: "Each `return` pops a frame and hands the value back to the caller below." },
      { lines: [19], note: "Second call: applyTax throws, unwinding the whole stack (no catch)." },
      { lines: [21, 22, 23, 24, 25], note: "The trace: top line is where it threw, each line below is the caller." }
    ]},
    output: "“Pay 18.00”, then an Uncaught Error: Negative total with the 4-line stack trace shown in the comment.",
    mistakes: [
      { bad: `function countdown(n) {\n  console.log(n);\n  countdown(n - 1);\n}`, good: `function countdown(n) {\n  if (n < 0) return;\n  console.log(n);\n  countdown(n - 1);\n}`, why: "Recursion without a base case never pops: the stack overflows with “Maximum call stack size exceeded”." },
      { bad: `// Read only the bottom line of the trace\nat main.jsx:8`, good: `// Read from the top: first line in YOUR file\nat applyTax (checkout.js:3)`, why: "The top frame is where the error happened. Skip library frames until you hit your own file." }
    ],
    practice: [
      { level: "B", q: "`a()` calls `b()`, which calls `c()`. Which finishes first?", a: "`c()`. Last in, first out." },
      { level: "B", q: "What is in the top line of a stack trace?", a: "The function and line where the error was thrown." },
      { level: "I", q: "Why does `function f() { return f(); } f();` crash?", a: "Each call pushes a frame and none return, so the stack hits its limit: RangeError." },
      { level: "C", q: "In DevTools, how do you see the live call stack at a line?", a: "Add a breakpoint (or `debugger;`). The Sources panel shows the Call Stack pane; click frames to inspect their variables." }
    ],
    quiz: [
      { q: "The call stack works as:", options: ["First in, first out", "Last in, first out", "Random order", "Sorted by name"], answer: 1, why: "New calls go on top and must return before the caller continues." },
      { q: "“Maximum call stack size exceeded” usually means:", options: ["Too many variables", "Runaway recursion", "A slow network", "A missing import"], answer: 1, why: "Frames keep being pushed with no base case to stop." },
      { q: "When can a `setTimeout` callback run?", options: ["Any time", "Only when the call stack is empty", "Only during recursion"], answer: 1, why: "The event loop only takes queued work once the stack has emptied." }
    ],
    rev: {
      sec30: "The call stack tracks running functions, LIFO. A call pushes a frame (locals + return address); a return pops it. Errors unwind the stack until a catch. A stack trace shows frames from where it broke (top) to the original caller (bottom). Endless recursion overflows it. Async callbacks only run once it is empty.",
      interview: [
        { level: "basic", q: "What is the call stack?", a: "A LIFO structure of active function calls. The top frame is what's running now." },
        { level: "intermediate", q: "How do you read a stack trace?", a: "Top-down: the first line is where it was thrown; lines below are callers. Find the first frame in your own code." },
        { level: "intermediate", q: "What causes a stack overflow in JS?", a: "Recursion with no or wrong base case (or mutual recursion), pushing frames until the engine's limit." },
        { level: "advanced", q: "Why do async stack traces look broken?", a: "The original caller has returned before the callback runs, so its frames are gone. DevTools stitches “async” frames for you." },
        { level: "tricky", q: "What does `throw` do to frames without a try/catch?", a: "It pops them one by one (unwinds) until a catch is found; if none, it becomes an uncaught error." }
      ],
      predict: [
        { code: `function a() { console.log('a start'); b(); console.log('a end'); }\nfunction b() { console.log('b'); }\na();`, answer: "a start, b, a end", why: "a pauses while b runs on top of it, then resumes after b pops." }
      ],
      cheat: [
        "LIFO: last called, first finished",
        "Frame = locals + where to return",
        "Trace top line = where it threw",
        "No base case → Maximum call stack size exceeded",
        "throw unwinds frames until a catch",
        "Event loop waits for an empty stack"
      ]
    },
    related: ["WEB-031", "WEB-039", "ENV-013", "ENV-015"]
  },

  "WEB-033": {
    tldr: "Queued callbacks come in two queues. **Microtasks** (promise `.then`, code after `await`) all run as soon as the stack empties. **Macrotasks** (setTimeout, clicks, network events) run one per loop turn, after the microtasks.",
    analogy: { icon: "🎟️", text: "A café queue with a VIP lane. Every VIP (microtask) is served before the next regular customer (macrotask), even VIPs who arrive while others are served." },
    visual: { type: "flow", title: "Who runs first?", steps: [
      { label: "1. Sync code", detail: "Everything on the call stack runs to the end first." },
      { label: "2. All microtasks", detail: "`.then`, `catch`, `finally`, after-`await`, `queueMicrotask`. Drained completely." },
      { label: "3. New microtasks too", detail: "A microtask that queues another microtask: that one also runs now." },
      { label: "4. Render (maybe)", detail: "The browser can paint the screen here." },
      { label: "5. One macrotask", detail: "`setTimeout`, `setInterval`, events, MessageChannel. Then back to step 2." }
    ]},
    points: [
      "Rule of thumb: **sync → microtasks → macrotasks**.",
      "Microtasks: `Promise.then/catch/finally`, code after `await`, `queueMicrotask()`.",
      "Macrotasks: `setTimeout`, `setInterval`, UI events, network/message events.",
      "`await` splits a function: the part after it is a microtask, even if the value isn't a promise.",
      "In React: updates from one event are **batched** into one render, and code right after `setState` still sees the old snapshot."
    ],
    code: { file: "order.js", lang: "js", src: `console.log('1 sync start');

setTimeout(() => console.log('6 timeout'), 0);

Promise.resolve()
  .then(() => console.log('3 then A'))
  .then(() => console.log('5 then B'));

queueMicrotask(() => console.log('4 microtask'));

(async () => {
  console.log('2 async body');
  await null;
  console.log('4b after await');
})();

console.log('2b sync end');

/* Output:
1 sync start
2 async body
2b sync end
3 then A
4 microtask
4b after await
5 then B
6 timeout */`, walk: [
      { lines: [1, 12, 17], note: "Sync lines first, including the async function body up to its first `await`." },
      { lines: [5, 6], note: "`then A` is queued as a microtask immediately (the promise is already resolved)." },
      { lines: [9, 14], note: "queueMicrotask and the after-await part join the microtask queue in order." },
      { lines: [7], note: "`then B` is queued only after `then A` runs, so it lands at the back of the microtask queue." },
      { lines: [3], note: "The timer is a macrotask: it waits until every microtask is done." }
    ]},
    output: "1 sync start, 2 async body, 2b sync end, 3 then A, 4 microtask, 4b after await, 5 then B, 6 timeout",
    mistakes: [
      { bad: `setTimeout(() => console.log('first?'), 0);\nPromise.resolve().then(() => console.log('second?'));`, good: `// Prints: second?, first?\n// microtasks beat macrotasks`, why: "A 0 ms timer still loses to any promise callback queued in the same turn." },
      { bad: `function loop() {\n  Promise.resolve().then(loop);\n}\nloop(); // page freezes`, good: `function loop() {\n  setTimeout(loop, 0);\n}\nloop(); // page still renders`, why: "Microtasks are drained before rendering, so an endless microtask chain starves the page. Timers yield." }
    ],
    practice: [
      { level: "B", q: "Predict: `setTimeout(()=>log('T'))`, `Promise.resolve().then(()=>log('P'))`, `log('S')`.", a: "S, P, T." },
      { level: "I", q: "Is code after `await 5` sync or a microtask?", a: "A microtask. `await` always yields, even for a non-promise value." },
      { level: "I", q: "A `.then` inside a `setTimeout` callback: when does it run?", a: "Right after that timeout callback finishes, before the next macrotask." },
      { level: "C", q: "Predict the order.", a: "A, D, C, B. Sync A and D; microtask C; then the timer B.", code: `console.log('A');\nsetTimeout(() => console.log('B'));\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');` }
    ],
    quiz: [
      { q: "Which is a microtask?", options: ["setTimeout callback", "Promise `.then` callback", "click handler", "setInterval callback"], answer: 1, why: "Promise reactions go in the microtask queue." },
      { q: "Between two macrotasks, how many microtasks run?", options: ["One", "All of them, including newly added ones", "None", "At most ten"], answer: 1, why: "The microtask queue is drained completely each time." },
      { q: "`async f(){ log(1); await 0; log(3) } f(); log(2)` prints:", options: ["1 2 3", "1 3 2", "2 1 3"], answer: 0, why: "1 runs sync, f pauses at await, 2 runs, then the microtask logs 3." }
    ],
    rev: {
      sec30: "After the stack empties, the event loop drains the microtask queue (promise reactions, after-await code, queueMicrotask) completely, may render, then runs one macrotask (timer, event). So: sync, then microtasks, then timers. Endless microtasks block rendering; timers don't.",
      interview: [
        { level: "basic", q: "Promise.then vs setTimeout 0: which first?", a: "The promise callback. Microtasks run before the next macrotask." },
        { level: "intermediate", q: "List microtask and macrotask sources.", a: "Micro: promise then/catch/finally, await continuations, queueMicrotask, MutationObserver. Macro: setTimeout/setInterval, UI events, network and message events." },
        { level: "advanced", q: "Why can microtasks starve rendering?", a: "The browser only renders after the microtask queue is empty. A microtask that keeps scheduling another never lets it empty." },
        { level: "tricky", q: "`Promise.resolve().then(A).then(B)` plus `queueMicrotask(C)` queued after: order?", a: "A, C, B. B is only queued once A runs, so C (already queued) goes before it." },
        { level: "intermediate", q: "How does this relate to React batching?", a: "React collects updates from one event and renders once afterward, so reading state right after `setState` gives the old snapshot." }
      ],
      predict: [
        { code: `setTimeout(() => console.log('T1'));\nsetTimeout(() => {\n  console.log('T2');\n  Promise.resolve().then(() => console.log('P'));\n});\nsetTimeout(() => console.log('T3'));`, answer: "T1, T2, P, T3", why: "After the T2 macrotask, its microtask P runs before the next timer." },
        { code: `async function a() {\n  console.log('a1');\n  await b();\n  console.log('a2');\n}\nasync function b() { console.log('b'); }\na();\nconsole.log('end');`, answer: "a1, b, end, a2", why: "b runs sync inside a; the rest of a after await is a microtask after `end`." }
      ],
      cheat: [
        "Order: sync → all microtasks → (render) → one macrotask",
        "Micro: then/catch/finally, after-await, queueMicrotask",
        "Macro: setTimeout, setInterval, events, messages",
        "Microtasks added during draining also run now",
        "`await` always yields, even `await 0`",
        "Endless microtasks freeze painting"
      ]
    },
    related: ["WEB-031", "WEB-028", "WEB-029", "RENDER-012"]
  },

  "WEB-034": {
    tldr: "The DOM is the browser's live tree of your page. With plain JS you **select** nodes (`querySelector`), **create** them (`createElement`), and **change** them (`textContent`, `classList`, `append`). React does this for you.",
    analogy: { icon: "📝", text: "A sticky-note board. You find a note (select), write a new one (create), stick it on (append), or rewrite its text (update). The board is what people see." },
    visual: { type: "tree", title: "A todo page as a DOM tree", root: { label: "document", children: [
      { label: "html", children: [
        { label: "body", children: [
          { label: "h1", note: "“My todos”" },
          { label: "form#add", children: [ { label: "input" }, { label: "button", note: "Add" } ] },
          { label: "ul#list", note: "querySelector('#list')", children: [
            { label: "li", note: "“Buy milk”" },
            { label: "li (new)", note: "createElement + append" }
          ]}
        ]}
      ]}
    ]}},
    points: [
      "Select: `document.querySelector('.cart')` (first match), `querySelectorAll('li')` (all, a NodeList).",
      "Create & insert: `document.createElement('li')`, then `parent.append(el)`; remove with `el.remove()`.",
      "Update text with `textContent` (safe). `innerHTML` parses HTML and opens the door to XSS with user data.",
      "Style via `el.classList.add/remove/toggle`; read/set attributes with `el.dataset`, `setAttribute`.",
      "In React you **don't** touch the DOM directly; you change state and React updates it. `useRef` is the escape hatch."
    ],
    code: { file: "index.html", lang: "html", src: `<h1>My todos</h1>
<form id="add">
  <input name="todo" placeholder="New todo" required />
  <button>Add</button>
</form>
<ul id="list"></ul>
<p id="count">0 left</p>

<script>
  const form = document.querySelector('#add');
  const list = document.querySelector('#list');
  const count = document.querySelector('#count');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const li = document.createElement('li');
    li.textContent = form.todo.value;
    li.classList.add('todo');
    list.append(li);

    count.textContent = list.children.length + ' left';
    form.reset();
  });
</script>`, walk: [
      { lines: [10, 11, 12], note: "Grab the nodes once with CSS-style selectors." },
      { lines: [14, 15], note: "Listen for submit and stop the page reloading." },
      { lines: [16, 17, 18], note: "Build a new `<li>`; `textContent` treats user text as plain text (safe)." },
      { lines: [19], note: "Insert it into the live tree: the browser shows it immediately." },
      { lines: [21], note: "You must update the counter by hand. Forget it and the UI drifts out of sync; React avoids that." }
    ]},
    output: "Typing “Buy milk” and pressing Add shows a new list item and “1 left”.",
    mistakes: [
      { bad: `li.innerHTML = userInput;`, good: `li.textContent = userInput;`, why: "innerHTML runs any HTML in the string, so `<img onerror=...>` from a user executes script (XSS)." },
      { bad: `for (const t of items) {\n  list.innerHTML += '<li>' + t + '</li>';\n}`, good: `const frag = document.createDocumentFragment();\nitems.forEach(t => {\n  const li = document.createElement('li');\n  li.textContent = t;\n  frag.append(li);\n});\nlist.append(frag);`, why: "`innerHTML +=` rebuilds the whole list each time (and drops listeners). Build once, append once." },
      { bad: `const btn = document.querySelector('#buy');\nbtn.addEventListener('click', buy); // script in <head>`, good: `<script src="app.js" defer></script>`, why: "If the script runs before the HTML is parsed, `querySelector` returns null. Use `defer` or put scripts at the end." }
    ],
    practice: [
      { level: "B", q: "Change the text of `<h1 id='title'>` to “Shop”.", a: "Select it and set textContent.", code: `document.querySelector('#title').textContent = 'Shop';` },
      { level: "B", q: "Toggle a `done` class on a todo when clicked.", a: "`li.classList.toggle('done')` in a click listener." },
      { level: "I", q: "Render an array of products as `<li>`s.", a: "Loop, create li, set text, append.", code: `for (const p of products) {\n  const li = document.createElement('li');\n  li.textContent = p.name + ' – £' + p.price;\n  list.append(li);\n}` },
      { level: "C", q: "Why does React keep a virtual description instead of letting you edit the DOM?", a: "So the UI is always a function of state: React computes the minimal DOM changes, and nothing drifts out of sync." }
    ],
    quiz: [
      { q: "`querySelector('.item')` returns:", options: ["All matches", "The first match or null", "An array", "A string"], answer: 1, why: "querySelectorAll returns all; querySelector returns the first element or null." },
      { q: "Safest way to show user-typed text?", options: ["innerHTML", "textContent", "document.write", "outerHTML"], answer: 1, why: "textContent never parses HTML, so it can't run injected scripts." },
      { q: "In React, how should a list item get added?", options: ["`list.append(li)` in a handler", "Update state; React renders the new item", "Use innerHTML in useEffect"], answer: 1, why: "React owns the DOM it renders; you describe UI from state." }
    ],
    rev: {
      sec30: "The DOM is a live tree of nodes. Select with querySelector/All, create with createElement, insert with append/prepend, remove with remove(), update with textContent, classList, dataset and attributes. Prefer textContent over innerHTML for user data. Manual updates must keep every dependent piece in sync by hand, which is the problem React solves.",
      interview: [
        { level: "basic", q: "What is the DOM?", a: "The browser's object tree representing the page. JS can read and change it, and the screen updates." },
        { level: "intermediate", q: "textContent vs innerHTML vs innerText?", a: "textContent sets raw text (fast, safe). innerHTML parses HTML (XSS risk). innerText is text as rendered, respecting CSS, and triggers layout." },
        { level: "intermediate", q: "NodeList vs HTMLCollection?", a: "`querySelectorAll` gives a static NodeList with forEach. `children`/`getElementsByClassName` give live HTMLCollections that update automatically." },
        { level: "advanced", q: "Why are many small DOM writes slow?", a: "Interleaving writes with reads (like offsetHeight) forces repeated layout. Batch writes, use fragments, or let React batch commits." },
        { level: "tricky", q: "You change a React-rendered `<p>` with `textContent`. What happens?", a: "It shows until React re-renders that node, then React overwrites it (or gets confused). Change state instead; use refs only for non-React-managed things like focus." }
      ],
      compare: { cols: ["", "Vanilla DOM", "React"], rows: [
        ["Add a todo", "createElement + append", "setTodos([...todos, t])"],
        ["Keep counter in sync", "Update by hand", "Derived from state automatically"],
        ["Direct access", "Always", "useRef escape hatch"]
      ]},
      cheat: [
        "`querySelector` = first match; `querySelectorAll` = all",
        "`createElement` → set props → `append`",
        "`el.remove()` deletes a node",
        "`textContent` for text; avoid `innerHTML` with user input",
        "`classList.add/remove/toggle` for styling",
        "Scripts with `defer` run after HTML is parsed",
        "React: change state, not the DOM"
      ]
    },
    related: ["WEB-035", "WEB-036", "INTRO-003", "HOOKS-007"]
  },

  "WEB-035": {
    tldr: "A click doesn't hit just one element. The event travels **down** from `window` to the target (capturing), fires on the target, then travels back **up** (bubbling). Listeners run on the way, and `stopPropagation()` ends the trip.",
    analogy: { icon: "🔔", text: "A letter for a child: it passes Grandma, then Mum on the way in (capture), the child opens it (target), then the news travels back up to Mum and Grandma (bubble)." },
    visual: { type: "flow", title: "Clicking the Buy button inside a product card", steps: [
      { label: "Capture: window → body", detail: "Event travels down. Only listeners with `{ capture: true }` run here." },
      { label: "Capture: .card", detail: "Still going down toward the clicked element." },
      { label: "Target: button", detail: "The clicked element's own listeners run. `e.target` is the button." },
      { label: "Bubble: .card", detail: "Going back up. Normal listeners (default) run here." },
      { label: "Bubble: body → window", detail: "Keeps rising unless someone calls `e.stopPropagation()`." }
    ]},
    points: [
      "Three phases: **capture** (down), **target**, **bubble** (up). `addEventListener` listens on bubble by default.",
      "`e.target` = what was actually clicked. `e.currentTarget` = the element whose listener is running.",
      "`e.stopPropagation()` stops travel to other elements. `e.preventDefault()` stops the browser default (link, submit). Different jobs.",
      "A few events don't bubble (`focus`, `blur`, `mouseenter`); use `focusin`/`focusout` if you need bubbling.",
      "In React: `onClick` bubbles through the **component tree**; `onClickCapture` is the capture version."
    ],
    code: { file: "index.html", lang: "html", src: `<div class="card" id="card">
  <h3>Headphones</h3>
  <button id="buy">Buy</button>
</div>

<script>
  const card = document.querySelector('#card');
  const buy = document.querySelector('#buy');

  card.addEventListener('click', () => {
    console.log('capture: card');
  }, { capture: true });

  card.addEventListener('click', (e) => {
    console.log('bubble: card – open details');
    console.log('target:', e.target.id, 'current:', e.currentTarget.id);
  });

  buy.addEventListener('click', (e) => {
    console.log('target: buy – add to cart');
    e.stopPropagation(); // don't also open details
  });
</script>`, walk: [
      { lines: [10, 11, 12], note: "`capture: true` runs on the way **down**, before the button's listener." },
      { lines: [14, 15, 16, 17], note: "Default listener runs on the way **up** (bubble)." },
      { lines: [16], note: "`target` is what was clicked; `currentTarget` is the card owning this listener." },
      { lines: [19, 20, 21, 22], note: "Stop the bubble so clicking Buy doesn't also open the details panel." }
    ]},
    output: "Click Buy: “capture: card”, “target: buy – add to cart”. Click the title: “capture: card”, “bubble: card – open details”, “target:  current: card” (the h3 has no id, so it logs an empty string).",
    mistakes: [
      { bad: `link.addEventListener('click', e => {\n  e.stopPropagation(); // still navigates!\n});`, good: `link.addEventListener('click', e => {\n  e.preventDefault();\n});`, why: "stopPropagation stops other listeners; preventDefault stops the browser's default action. Pick the one you mean." },
      { bad: `card.addEventListener('click', e => {\n  e.target.classList.add('selected');\n});`, good: `card.addEventListener('click', e => {\n  e.currentTarget.classList.add('selected');\n});`, why: "`target` may be a child (the h3 or an icon). `currentTarget` is always the element you attached to." }
    ],
    practice: [
      { level: "B", q: "You click a button inside a div; both have click listeners. Which runs first by default?", a: "The button (target), then the div (bubble)." },
      { level: "B", q: "Make the div's listener run before the button's.", a: "Register it with `{ capture: true }`." },
      { level: "I", q: "Close a modal when clicking the dark backdrop but not the dialog inside it.", a: "Check the target is the backdrop itself.", code: `backdrop.addEventListener('click', e => {\n  if (e.target === e.currentTarget) closeModal();\n});` },
      { level: "C", q: "React: a Delete button inside a clickable todo row opens the row too. Fix it.", a: "Call `e.stopPropagation()` in the button's `onClick`.", code: `<li onClick={openTodo}>\n  {todo.text}\n  <button onClick={e => { e.stopPropagation(); remove(todo.id); }}>x</button>\n</li>` }
    ],
    quiz: [
      { q: "Default phase for `addEventListener`?", options: ["Capture", "Bubble", "Both"], answer: 1, why: "Without `{ capture: true }` it listens during bubbling (and at the target)." },
      { q: "`e.target` vs `e.currentTarget`:", options: ["Always the same", "target = clicked element; currentTarget = element with the listener", "target = parent; currentTarget = child"], answer: 1, why: "They differ when you click a child of the listening element." },
      { q: "To stop a form submitting, call:", options: ["e.stopPropagation()", "e.preventDefault()", "return true"], answer: 1, why: "Submitting is a browser default action." }
    ],
    rev: {
      sec30: "DOM events go capture (window down to target), target, then bubble (back up). Listeners are bubble by default; `{capture:true}` for the down phase. `target` is the origin, `currentTarget` the listener's element. `stopPropagation` halts the journey; `preventDefault` cancels default behaviour. React mirrors this with onClick and onClickCapture on the component tree.",
      interview: [
        { level: "basic", q: "What is event bubbling?", a: "After firing on the target, the event fires on each ancestor up to window, so parents can react to children's events." },
        { level: "intermediate", q: "stopPropagation vs preventDefault?", a: "stopPropagation stops the event reaching other elements. preventDefault cancels the browser's built-in action. They are independent." },
        { level: "intermediate", q: "When would you use the capture phase?", a: "To act before any child sees the event, e.g. analytics or closing a dropdown on any outside click before inner handlers run." },
        { level: "advanced", q: "How do React events relate to DOM bubbling?", a: "React 17+ attaches listeners at the root container and simulates capture/bubble through the React tree, so portals bubble to their React parent, not DOM parent." },
        { level: "tricky", q: "Does `stopPropagation` in a bubble listener stop other listeners on the same element?", a: "No. Use `stopImmediatePropagation()` for that." }
      ],
      predict: [
        { code: `outer.addEventListener('click', () => log('outer'));\ninner.addEventListener('click', () => log('inner'));\nouter.addEventListener('click', () => log('outer-cap'), true);\n// user clicks inner`, answer: "outer-cap, inner, outer", why: "Capture runs first on the way down, then target, then bubble." }
      ],
      cheat: [
        "Phases: capture ↓ → target → bubble ↑",
        "Default listener = bubble; `{ capture: true }` for capture",
        "`target` = clicked; `currentTarget` = listener owner",
        "`stopPropagation` stops travel; `preventDefault` stops default",
        "`stopImmediatePropagation` also blocks same-element listeners",
        "focus/blur don't bubble; use focusin/focusout",
        "React: `onClick` bubbles, `onClickCapture` captures"
      ]
    },
    related: ["WEB-034", "WEB-036", "EVT-008", "EVT-009"]
  },

  "WEB-036": {
    tldr: "Event delegation means one listener on a parent handles events for all its children. Because events bubble, the parent checks `e.target.closest(...)` to see which child was clicked. It also works for children added later.",
    analogy: { icon: "📞", text: "A restaurant with one phone at the front desk instead of one per table. The host answers every call and asks “which table?”." },
    visual: { type: "compare", title: "500 todos: listeners", left: { label: "A listener per item", tone: "bad", points: [
      "500 listeners in memory",
      "New items need their own listener",
      "Removed items must be cleaned up",
      "More setup code"
    ]}, right: { label: "One delegated listener", tone: "good", points: [
      "1 listener on the `<ul>`",
      "Items added later just work",
      "Nothing to clean up per item",
      "Use `e.target.closest('li')` to find the item"
    ]}},
    points: [
      "Works because events **bubble** from the clicked child up to the parent.",
      "Use `e.target.closest('selector')` to find the relevant child, since the click may land on an icon inside it.",
      "Store the item's id in `data-id` and read it with `el.dataset.id`.",
      "Guard with `if (!el || !list.contains(el)) return;` so clicks on the gaps do nothing.",
      "In React: you write `onClick` on each item; React itself delegates to the root, so per-item handlers are fine."
    ],
    code: { file: "index.html", lang: "html", src: `<ul id="todos">
  <li data-id="1">Buy milk <button class="del">x</button></li>
  <li data-id="2">Walk dog <button class="del">x</button></li>
</ul>
<button id="add">Add todo</button>

<script>
  const list = document.querySelector('#todos');

  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li || !list.contains(li)) return;

    if (e.target.closest('.del')) {
      li.remove();
      console.log('deleted', li.dataset.id);
    } else {
      li.classList.toggle('done');
    }
  });

  document.querySelector('#add').addEventListener('click', () => {
    const li = document.createElement('li');
    li.dataset.id = Date.now();
    li.innerHTML = 'New todo <button class="del">x</button>';
    list.append(li);
  });
</script>`, walk: [
      { lines: [10], note: "One listener on the parent `<ul>` for every item, now and later." },
      { lines: [11, 12], note: "Find the `<li>` the click came from; ignore clicks outside any item." },
      { lines: [14, 15, 16], note: "Was the click on (or inside) the delete button? Remove that item." },
      { lines: [17, 18, 19], note: "Clicked anywhere else on the item: toggle its done style." },
      { lines: [22, 23, 24, 25, 26, 27], note: "New items need no listener of their own: the parent catches their clicks." }
    ]},
    output: "Clicking a todo toggles “done”; clicking x removes it and logs “deleted 1”. Newly added todos behave the same.",
    mistakes: [
      { bad: `list.addEventListener('click', e => {\n  if (e.target.tagName === 'LI') e.target.remove();\n});`, good: `list.addEventListener('click', e => {\n  const li = e.target.closest('li');\n  if (li) li.remove();\n});`, why: "Clicks often land on a child (a span, an icon). `closest` walks up to the item you actually want." },
      { bad: `document.querySelectorAll('li').forEach(li =>\n  li.addEventListener('click', toggle));\nlist.append(newLi); // no listener!`, good: `list.addEventListener('click', e => {\n  e.target.closest('li')?.classList.toggle('done');\n});`, why: "Listeners attached in a loop miss elements added later. Delegation covers future children." }
    ],
    practice: [
      { level: "B", q: "Which event behaviour makes delegation possible?", a: "Bubbling: the child's click travels up to the parent's listener." },
      { level: "I", q: "A playlist `<ol>` of songs with `data-song`. Log the song name on click with one listener.", a: "Delegate on the `<ol>`, use closest('li') and dataset.", code: `playlist.addEventListener('click', e => {\n  const li = e.target.closest('li');\n  if (li) console.log(li.dataset.song);\n});` },
      { level: "I", q: "Why `closest` instead of checking `e.target` directly?", a: "The target may be a nested element (icon, strong, img). closest finds the nearest matching ancestor (or itself)." },
      { level: "C", q: "Which events can't you delegate directly and what's the workaround?", a: "Non-bubbling ones like `focus`/`blur`/`mouseenter`. Use `focusin`/`focusout`/`mouseover`, or a capture-phase listener." }
    ],
    quiz: [
      { q: "Main benefit of delegation?", options: ["Events stop bubbling", "One listener handles current and future children", "It makes events synchronous"], answer: 1, why: "The parent catches bubbled events from any child, including ones added later." },
      { q: "Best way to find the clicked list item?", options: ["`e.currentTarget`", "`e.target.closest('li')`", "`document.querySelector('li')`"], answer: 1, why: "currentTarget is the parent; closest climbs from the actual click to the item." },
      { q: "Do you need manual delegation in React lists?", options: ["Yes, always", "No, React already delegates at the root", "Only for more than 10 items"], answer: 1, why: "React attaches its listeners at the root; per-item onClick is fine." }
    ],
    rev: {
      sec30: "Delegation: attach one listener to a common parent, rely on bubbling, and use `e.target.closest(selector)` plus `data-*` to find which child was hit. Fewer listeners, works for dynamically added items, nothing to clean up. React already delegates internally at the root.",
      interview: [
        { level: "basic", q: "What is event delegation?", a: "Handling child events with a single listener on a parent, using bubbling and the event target to know which child." },
        { level: "intermediate", q: "Why use `closest()` in delegation?", a: "The actual target can be a descendant of the item. `closest` returns the nearest ancestor matching the selector." },
        { level: "intermediate", q: "When is delegation a bad fit?", a: "For events that don't bubble, or when an inner handler calls stopPropagation, or for very high-frequency events where per-target logic is simpler." },
        { level: "advanced", q: "How does React use delegation?", a: "Since React 17 it attaches one listener per event type to the root container and dispatches through the fiber tree to your handlers." },
        { level: "tricky", q: "Child calls `e.stopPropagation()`. Does the delegated parent see it?", a: "No. The event never bubbles up, so the parent's listener won't run." }
      ],
      cheat: [
        "One parent listener, many children",
        "Relies on bubbling",
        "`e.target.closest('li')` finds the item",
        "`data-id` + `dataset.id` identify it",
        "Covers items added later",
        "stopPropagation in a child breaks it",
        "React delegates at the root for you"
      ]
    },
    related: ["WEB-035", "WEB-034", "EVT-002", "EVT-008"]
  },

  "WEB-037": {
    tldr: "`localStorage` and `sessionStorage` save small bits of text in the browser. localStorage stays after closing the browser; sessionStorage is wiped when the tab closes. Both store **strings only**, about 5 MB per site.",
    analogy: { icon: "🗒️", text: "localStorage is a notebook you leave at the café: it's there next visit. sessionStorage is a napkin note: thrown away when you leave the table (close the tab)." },
    visual: { type: "compare", title: "Two kinds of browser storage", left: { label: "localStorage", tone: "neutral", points: [
      "Survives closing tab and browser",
      "Shared by all tabs of the same site",
      "Good for theme, cart draft, settings",
      "Fires `storage` event in other tabs"
    ]}, right: { label: "sessionStorage", tone: "neutral", points: [
      "Gone when the tab closes",
      "Separate per tab",
      "Good for a half-filled form, wizard step",
      "Survives a page reload in that tab"
    ]}},
    points: [
      "API: `setItem(key, value)`, `getItem(key)` (null if missing), `removeItem(key)`, `clear()`.",
      "Values are **strings**: save objects with `JSON.stringify`, read with `JSON.parse`.",
      "Synchronous and ~5 MB per origin (scheme + host + port). Not for big data; use IndexedDB.",
      "Any script on the page can read it, so **never** store passwords or secrets; tokens there are exposed to XSS.",
      "In React: read it in a lazy `useState(() => ...)` initial value and save in a `useEffect`."
    ],
    code: { file: "cart.js", lang: "js", src: `const KEY = 'cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return []; // corrupted or blocked storage
  }
}

function saveCart(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

const cart = loadCart();
cart.push({ id: 7, name: 'Coffee beans', qty: 1 });
saveCart(cart);

// Per-tab: which checkout step the user is on
sessionStorage.setItem('checkoutStep', '2');
console.log(sessionStorage.getItem('checkoutStep')); // "2" (a string)

// Other tabs hear about changes
window.addEventListener('storage', (e) => {
  if (e.key === KEY) console.log('Cart changed in another tab');
});`, walk: [
      { lines: [5], note: "`getItem` returns a string or null. `JSON.parse(null)` is null, so `?? []` gives a default." },
      { lines: [6, 7, 8], note: "Parsing can throw on bad data, and storage can be blocked: always have a fallback." },
      { lines: [12], note: "Stringify before saving. Saving an object directly stores “[object Object]”." },
      { lines: [20, 21], note: "sessionStorage has the same API. Numbers come back as strings." },
      { lines: [24, 25, 26], note: "The `storage` event fires in **other** tabs of the same site, not this one." }
    ]},
    output: "Console: “2”. Reloading the page keeps the cart; closing the tab clears checkoutStep.",
    mistakes: [
      { bad: `localStorage.setItem('cart', cart);\n// stored "[object Object]"`, good: `localStorage.setItem('cart', JSON.stringify(cart));`, why: "Storage only keeps strings, so objects are converted with toString(). Serialise to JSON first." },
      { bad: `localStorage.setItem('password', pwd);`, good: `// Keep secrets on the server; use httpOnly cookies for sessions`, why: "Any script on the page (including injected ones) can read storage. It is not secure." },
      { bad: `const [notes, setNotes] = useState(\n  JSON.parse(localStorage.getItem('notes'))\n);`, good: `const [notes, setNotes] = useState(\n  () => JSON.parse(localStorage.getItem('notes')) ?? []\n);`, why: "Pass a function so it reads storage once, not on every render, and default to [] when empty." }
    ],
    practice: [
      { level: "B", q: "Save the user's theme 'dark' and read it back.", a: "setItem then getItem.", code: `localStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme') ?? 'light';` },
      { level: "B", q: "What does `getItem('nope')` return for a missing key?", a: "`null`." },
      { level: "I", q: "Persist a notes array in React.", a: "Lazy-initialise from storage; save in an effect when notes change.", code: `const [notes, setNotes] = useState(\n  () => JSON.parse(localStorage.getItem('notes')) ?? []\n);\nuseEffect(() => {\n  localStorage.setItem('notes', JSON.stringify(notes));\n}, [notes]);` },
      { level: "C", q: "Why might `localStorage` throw, and how do you guard?", a: "Quota exceeded, private mode or blocked cookies. Wrap reads and writes in try/catch and fall back to memory." }
    ],
    quiz: [
      { q: "Which survives closing the browser?", options: ["sessionStorage", "localStorage", "Both", "Neither"], answer: 1, why: "sessionStorage is cleared when the tab closes." },
      { q: "`localStorage.setItem('n', 5); localStorage.getItem('n')` returns:", options: ["5 (number)", "\"5\" (string)", "null"], answer: 1, why: "Everything is stored as a string." },
      { q: "Good thing to keep in localStorage?", options: ["A user's password", "Dark-mode preference", "Credit card number", "A 200 MB video"], answer: 1, why: "Small, non-sensitive preferences fit. Secrets and big data don't." }
    ],
    rev: {
      sec30: "Web Storage holds string key/value pairs per origin, around 5 MB, synchronously. localStorage persists and is shared across tabs; sessionStorage lives per tab until it closes. JSON.stringify/parse for objects. Readable by any script, so no secrets. In React, lazy-init state from it and sync back in an effect.",
      interview: [
        { level: "basic", q: "localStorage vs sessionStorage?", a: "Same API. localStorage persists across sessions and tabs; sessionStorage is scoped to one tab and cleared when it closes." },
        { level: "intermediate", q: "localStorage vs cookies?", a: "Cookies are sent to the server on every request and can be httpOnly; storage stays in the browser, is bigger (~5 MB) and JS-only." },
        { level: "advanced", q: "Is it safe to store a JWT in localStorage?", a: "It works, but any XSS can read it. Many teams prefer short-lived tokens in memory plus a refresh token in an httpOnly cookie." },
        { level: "intermediate", q: "How do you sync storage between tabs?", a: "Listen for the `storage` event on window; it fires in other same-origin tabs when a key changes." },
        { level: "tricky", q: "Why can reading localStorage during render break SSR?", a: "On the server there is no window or localStorage. Read it in an effect or guard with `typeof window !== 'undefined'`." }
      ],
      compare: { cols: ["", "localStorage", "sessionStorage", "Cookie"], rows: [
        ["Lifetime", "Until cleared", "Until tab closes", "Set by expiry"],
        ["Sent to server", "No", "No", "Yes, every request"],
        ["Size", "~5 MB", "~5 MB", "~4 KB"]
      ]},
      cheat: [
        "`setItem`, `getItem` (null if missing), `removeItem`, `clear`",
        "Strings only: JSON.stringify / JSON.parse",
        "localStorage: persists, shared across tabs",
        "sessionStorage: per tab, gone on close",
        "~5 MB per origin, synchronous",
        "Never store secrets; XSS can read it",
        "React: `useState(() => read())` + save in useEffect"
      ]
    },
    related: ["WEB-038", "HOOKS-026", "AUTH-005", "STATE-018"]
  },

  "WEB-038": {
    tldr: "JSON is a text format for data that every language understands. `JSON.stringify(obj)` turns data into a string to send or save; `JSON.parse(str)` turns it back into objects.",
    analogy: { icon: "✉️", text: "Packing a recipe into a letter: stringify writes it out as text so it can travel; parse reads the letter and rebuilds the recipe on the other side." },
    visual: { type: "flow", title: "A todo's round trip", steps: [
      { label: "JS object", detail: "`{ id: 1, text: 'Buy milk', done: false }` lives in memory." },
      { label: "JSON.stringify", detail: "Becomes text: `{\"id\":1,\"text\":\"Buy milk\",\"done\":false}`." },
      { label: "Travel / store", detail: "Sent as a fetch body or saved in localStorage." },
      { label: "JSON.parse", detail: "Text is read back into a **new** object (a fresh copy)." }
    ]},
    points: [
      "JSON allows: objects, arrays, strings, numbers, `true/false`, `null`. Keys and strings need **double quotes**.",
      "Lost by stringify: functions, `undefined`, Symbols. `Date` becomes a string; `NaN`/`Infinity` become null.",
      "`JSON.parse` **throws** on invalid text: wrap untrusted input in try/catch.",
      "Pretty print with `JSON.stringify(data, null, 2)`.",
      "In React: API data arrives as JSON (`res.json()`), and `<pre>{JSON.stringify(state, null, 2)}</pre>` is a quick debug view."
    ],
    code: { file: "json.js", lang: "js", src: `const order = {
  id: 101,
  items: [{ name: 'Pizza', qty: 2 }],
  paid: false,
  placedAt: new Date('2026-01-05T12:00:00Z'),
  notify() {},          // function: dropped
  coupon: undefined,    // undefined: dropped
};

const text = JSON.stringify(order);
console.log(text);
// {"id":101,"items":[{"name":"Pizza","qty":2}],"paid":false,"placedAt":"2026-01-05T12:00:00.000Z"}

const back = JSON.parse(text);
console.log(typeof back.placedAt);   // "string", not a Date
console.log(back === order);         // false: a new object

console.log(JSON.stringify(order.items, null, 2));

try {
  JSON.parse("{ name: 'Pizza' }");  // invalid JSON
} catch (err) {
  console.log('Bad JSON:', err.name);  // SyntaxError
}`, walk: [
      { lines: [5, 6, 7], note: "Dates, functions and undefined don't survive as-is." },
      { lines: [10, 11, 12], note: "stringify produces compact text; the function and coupon are gone." },
      { lines: [14, 15, 16], note: "parse builds a brand-new object. The date is now just a string." },
      { lines: [18], note: "Third argument 2 indents the output for readability." },
      { lines: [20, 21, 22, 23, 24], note: "Single quotes and unquoted keys are not JSON: parse throws a SyntaxError." }
    ]},
    output: "The JSON string, then “string”, “false”, the indented items array, and “Bad JSON: SyntaxError”.",
    mistakes: [
      { bad: `const data = JSON.parse(localStorage.getItem('todos'));\ndata.map(...); // crashes when empty`, good: `let data = [];\ntry {\n  data = JSON.parse(localStorage.getItem('todos')) ?? [];\n} catch {}`, why: "Missing keys give null, and corrupt text throws. Default and guard." },
      { bad: `const copy = JSON.parse(JSON.stringify(event));\ncopy.date.getFullYear(); // TypeError`, good: `const copy = structuredClone(event);\ncopy.date.getFullYear();`, why: "A JSON round trip turns Dates into strings and drops functions. `structuredClone` keeps Dates, Maps and Sets." }
    ],
    practice: [
      { level: "B", q: "Turn `{ city: 'Paris', temp: 21 }` into a string and back.", a: "stringify, then parse.", code: `const s = JSON.stringify({ city: 'Paris', temp: 21 });\nconst w = JSON.parse(s);` },
      { level: "B", q: "Is `{'name': 'Ana'}` valid JSON?", a: "No. JSON needs double quotes: `{\"name\": \"Ana\"}`." },
      { level: "I", q: "Parse an order and turn `placedAt` back into a Date.", a: "Use a reviver function (second argument to parse).", code: `const o = JSON.parse(text, (k, v) =>\n  k === 'placedAt' ? new Date(v) : v\n);` },
      { level: "C", q: "What does `JSON.stringify({ a: undefined, b: [undefined] })` give?", a: "`{\"b\":[null]}`. Undefined properties are dropped; undefined in arrays becomes null." }
    ],
    quiz: [
      { q: "Which is valid JSON?", options: ["{name: \"Tea\"}", "{\"name\": \"Tea\"}", "{'name': 'Tea'}", "{\"name\": \"Tea\",}"], answer: 1, why: "Keys must be double-quoted and trailing commas aren't allowed." },
      { q: "What happens to a function property in `JSON.stringify`?", options: ["Saved as code", "Dropped", "Converted to null", "Throws"], answer: 1, why: "Functions aren't data; stringify skips them in objects." },
      { q: "`JSON.parse('oops')` does what?", options: ["Returns null", "Returns 'oops'", "Throws a SyntaxError"], answer: 2, why: "Invalid JSON throws, so guard user-supplied text." }
    ],
    rev: {
      sec30: "JSON is a language-neutral text format: objects, arrays, strings, numbers, booleans, null, with double-quoted keys. `JSON.stringify` serialises (drops functions/undefined, Dates become ISO strings); `JSON.parse` deserialises into new objects and throws on bad input. Used for fetch bodies, API responses and localStorage.",
      interview: [
        { level: "basic", q: "What do JSON.stringify and JSON.parse do?", a: "stringify converts a JS value to a JSON string; parse converts a JSON string back to a JS value." },
        { level: "intermediate", q: "What doesn't survive JSON?", a: "Functions, undefined and Symbols are dropped; Dates become strings; Map/Set become `{}`; NaN/Infinity become null." },
        { level: "intermediate", q: "Is a JSON round trip a good deep clone?", a: "Only for plain data. It loses Dates, Maps, undefined and fails on cycles. Prefer `structuredClone`." },
        { level: "advanced", q: "What are the 2nd and 3rd arguments of stringify?", a: "A replacer (function or allow-list of keys) and indentation (number or string) for pretty printing." },
        { level: "tricky", q: "JSON vs a JS object literal?", a: "JSON is text with stricter rules: double quotes only, no trailing commas, no comments, no functions or undefined." }
      ],
      predict: [
        { code: `console.log(JSON.stringify({ n: NaN, d: new Date(0), f() {} }));`, answer: "{\"n\":null,\"d\":\"1970-01-01T00:00:00.000Z\"}", why: "NaN becomes null, Date uses toJSON (ISO string), the function is dropped." }
      ],
      cheat: [
        "`JSON.stringify(v)` → string; `JSON.parse(s)` → value",
        "Double quotes only, no trailing commas, no comments",
        "Functions/undefined dropped; Date → ISO string",
        "`JSON.parse` throws SyntaxError on bad text",
        "`stringify(v, null, 2)` pretty prints",
        "Deep copy with `structuredClone`, not JSON, if Dates matter"
      ]
    },
    related: ["WEB-030", "WEB-037", "API-005", "WEB-013"]
  },

  "WEB-039": {
    tldr: "Errors are values you can throw and catch. `try` runs risky code, `catch` handles a failure, `finally` always runs. Custom error classes say *what* went wrong, and async errors are caught with `await` inside try or with `.catch()`.",
    analogy: { icon: "🧯", text: "Cooking with a fire blanket nearby: try the recipe, if something catches fire grab the blanket (catch), and always turn the hob off afterwards (finally)." },
    visual: { type: "flow", title: "try / catch / finally paths", steps: [
      { label: "try", detail: "Run code that might fail (parse input, call an API)." },
      { label: "throw?", detail: "Any `throw` or rejected `await` jumps straight out of try." },
      { label: "catch (err)", detail: "Handle it: show a message, use a fallback, or re-throw if you can't." },
      { label: "finally", detail: "Always runs, success or failure: stop the spinner, close the dialog." },
      { label: "Uncaught?", detail: "No catch anywhere → console error. Promises: `unhandledrejection`." }
    ]},
    points: [
      "Throw `Error` objects (`throw new Error('msg')`), not strings: you get `message`, `name` and a stack trace.",
      "Custom errors: `class NotFoundError extends Error {}` and check with `instanceof`.",
      "Only catch what you can handle. Unknown errors: re-throw with `throw err`.",
      "Async: `try { await x() } catch {}` or `promise.catch(fn)`. Errors inside a `setTimeout` callback escape an outer try.",
      "In React: render errors need an **Error Boundary**; event handler and async errors need normal try/catch."
    ],
    code: { file: "order.js", lang: "js", src: `class OutOfStockError extends Error {
  constructor(product) {
    super(\`\${product} is out of stock\`);
    this.name = 'OutOfStockError';
    this.product = product;
  }
}

async function placeOrder(product, qty) {
  const res = await fetch(\`/api/stock/\${product}\`);
  if (!res.ok) throw new Error(\`Stock check failed (\${res.status})\`);
  const { available } = await res.json();
  if (available < qty) throw new OutOfStockError(product);
  return { product, qty };
}

async function onBuyClick() {
  showSpinner(true);
  try {
    const order = await placeOrder('Pizza', 2);
    showMessage(\`Ordered \${order.qty} \${order.product}\`);
  } catch (err) {
    if (err instanceof OutOfStockError) {
      showMessage(\`Sorry, \${err.product} is sold out\`);
    } else {
      showMessage('Something went wrong, try again');
      console.error(err);
    }
  } finally {
    showSpinner(false);
  }
}`, walk: [
      { lines: [1, 2, 3, 4, 5, 6, 7], note: "A custom error class: a clear `name` plus extra data (`product`)." },
      { lines: [11, 12, 13], note: "Throw for HTTP failures and business rules. Each stops the function." },
      { lines: [19, 20, 21], note: "`await` inside try: a rejection becomes a catchable error." },
      { lines: [22, 23, 24, 25, 26, 27, 28], note: "Branch on the error type: friendly message for known cases, log the rest." },
      { lines: [29, 30, 31], note: "`finally` hides the spinner whatever happened." }
    ]},
    output: "Success: “Ordered 2 Pizza”. Low stock: “Sorry, Pizza is sold out”. Server down: “Something went wrong, try again” (and the error in the console). Spinner always hides.",
    mistakes: [
      { bad: `try {\n  setTimeout(() => { throw new Error('x'); }, 0);\n} catch (e) {\n  // never runs\n}`, good: `setTimeout(() => {\n  try { risky(); }\n  catch (e) { handle(e); }\n}, 0);`, why: "The callback runs later, after the try has already finished. Catch inside the callback." },
      { bad: `try {\n  saveNote();\n} catch (e) {}\n// error silently swallowed`, good: `try {\n  saveNote();\n} catch (e) {\n  showToast('Could not save');\n  console.error(e);\n}`, why: "An empty catch hides bugs. At least log it and tell the user." },
      { bad: `throw 'Payment failed';`, good: `throw new Error('Payment failed');`, why: "A string has no stack trace or name; Error objects make debugging and `instanceof` checks possible." }
    ],
    practice: [
      { level: "B", q: "Safely parse user JSON and fall back to `{}`.", a: "Wrap JSON.parse in try/catch.", code: `let settings;\ntry { settings = JSON.parse(input); }\ncatch { settings = {}; }` },
      { level: "B", q: "Does `finally` run if `try` returns early?", a: "Yes. finally runs on return, throw, or normal completion." },
      { level: "I", q: "Create a `ValidationError` with a `field` property for a signup form.", a: "Extend Error, set name and field.", code: `class ValidationError extends Error {\n  constructor(field, msg) {\n    super(msg);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}` },
      { level: "C", q: "In React, which errors does an Error Boundary catch, and which not?", a: "It catches errors thrown while rendering children (and in lifecycle). Not errors in event handlers, async code or setTimeout: use try/catch there and set error state." }
    ],
    quiz: [
      { q: "When does `finally` run?", options: ["Only on success", "Only on error", "Always", "Only if catch re-throws"], answer: 2, why: "It's for cleanup that must happen either way." },
      { q: "Catch a rejected promise in an async function by:", options: ["try/catch around `await p`", "try/catch around `p` without await", "Nothing; it can't be caught"], answer: 0, why: "Awaiting turns rejection into a throw at that line, inside the try." },
      { q: "React Error Boundaries catch errors thrown in:", options: ["onClick handlers", "Rendering a child component", "setTimeout callbacks", "fetch .then callbacks"], answer: 1, why: "Boundaries only cover render/lifecycle errors in their subtree." }
    ],
    rev: {
      sec30: "try runs risky code, catch handles thrown errors, finally always runs for cleanup. Throw Error objects; extend Error for domain-specific types and check with instanceof. Async: await inside try, or .catch on the promise; callbacks that run later need their own try. In React, Error Boundaries cover render errors only; handlers and async need try/catch plus error state.",
      interview: [
        { level: "basic", q: "Why throw `new Error()` rather than a string?", a: "Error objects carry name, message and a stack trace, and support instanceof checks." },
        { level: "intermediate", q: "How do you handle errors with async/await?", a: "Wrap awaits in try/catch (finally for cleanup), or attach `.catch()` to the returned promise. Unhandled ones fire `unhandledrejection`." },
        { level: "intermediate", q: "Why create custom error classes?", a: "To tell failure types apart (not found, validation, out of stock) and react differently, carrying extra fields." },
        { level: "advanced", q: "What does an Error Boundary not catch?", a: "Event handler errors, async code, setTimeout, SSR errors and errors in the boundary itself." },
        { level: "tricky", q: "`try { return 1 } finally { return 2 }` returns?", a: "2. A return in finally overrides the try's return, so avoid returning from finally." }
      ],
      debug: [
        { code: `async function load() {\n  try {\n    return fetchJSON('/api/notes');\n  } catch {\n    return [];\n  }\n}`, fix: `async function load() {\n  try {\n    return await fetchJSON('/api/notes');\n  } catch {\n    return [];\n  }\n}`, why: "Without await the promise is returned before it rejects, so catch never sees the error." }
      ],
      cheat: [
        "try → catch(err) → finally (always)",
        "Throw `new Error('msg')`, never a string",
        "`class XError extends Error` + `instanceof`",
        "Async: `await` inside try, or `.catch()`",
        "Callbacks run later: catch inside them",
        "Don't swallow: log and inform the user",
        "React Error Boundary = render errors only"
      ]
    },
    related: ["WEB-029", "WEB-032", "ADV-004", "API-014"]
  },

  "WEB-040": {
    tldr: "npm is the app store for JavaScript code. `npm install` adds packages, `npm update` moves them within allowed versions, and `npm audit` checks for known security holes. Versions follow **MAJOR.MINOR.PATCH** (semantic versioning).",
    analogy: { icon: "🧺", text: "A recipe's shopping list: package.json lists the ingredients and acceptable brands (version ranges); the lock file is the exact receipt so everyone cooks with the same items." },
    visual: { type: "layers", title: "Reading a version: ^19.2.0", items: [
      { label: "MAJOR  19", detail: "Breaking changes. Upgrading may need code changes. `^` never jumps this." },
      { label: "MINOR  .2", detail: "New features, backwards compatible. `^` allows 19.3, 19.4…" },
      { label: "PATCH  .0", detail: "Bug fixes only. Both `^` and `~` allow 19.2.1, 19.2.2…" },
      { label: "Range ^ vs ~", detail: "`^19.2.0` = >=19.2.0 <20. `~19.2.0` = >=19.2.0 <19.3. Exact `19.2.0` = only that." }
    ]},
    points: [
      "`npm install react` adds to **dependencies**; `npm install -D vitest` adds to **devDependencies** (build/test only).",
      "`npm install` (no name) installs everything in package.json, using **package-lock.json** for exact versions. `npm ci` for clean CI installs.",
      "`npm outdated` shows what's behind; `npm update` upgrades within your ranges; `npm install pkg@latest` crosses a major.",
      "`npm audit` lists known vulnerabilities; `npm audit fix` applies safe (non-breaking) upgrades.",
      "React apps are npm projects: `react`, `react-dom`, `vite` all come from the registry."
    ],
    code: { file: "terminal", lang: "bash", src: `# Start a project and add packages
npm init -y
npm install react react-dom          # dependencies
npm install -D vite vitest           # devDependencies

# Exact install from the lock file (CI, fresh clone)
npm ci

# What's out of date?
npm outdated
# Package  Current  Wanted   Latest
# vitest   3.2.0    3.2.4    4.0.1

npm update                 # moves to "Wanted" (inside your ^ range)
npm install vitest@latest  # crosses a major: read the changelog first

# Security
npm audit
npm audit fix              # safe, non-breaking fixes

# Remove and run
npm uninstall lodash
npx vite --version         # run a package binary without a global install`, walk: [
      { lines: [3, 4], note: "Runtime libraries go in dependencies; tools only needed to build or test go in devDependencies (`-D`)." },
      { lines: [7], note: "`npm ci` deletes node_modules and installs exactly what the lock file says. Fast and reproducible." },
      { lines: [10, 11, 12], note: "**Wanted** = newest allowed by your range. **Latest** = newest published, maybe a breaking major." },
      { lines: [14, 15], note: "update stays safe inside the range; `@latest` is a deliberate major upgrade." },
      { lines: [18, 19], note: "audit checks against a vulnerability database; `fix` won't make breaking jumps unless you add `--force`." }
    ]},
    output: "package.json gains dependencies/devDependencies entries, node_modules/ fills up, and package-lock.json records exact versions.",
    mistakes: [
      { bad: `npm install vitest   # test tool in dependencies`, good: `npm install -D vitest`, why: "Dev tools belong in devDependencies so production installs and bundles stay lean and clear." },
      { bad: `git add node_modules package.json\n# lock file ignored`, good: `# .gitignore: node_modules\ngit add package.json package-lock.json`, why: "Commit the lock file for reproducible installs; never commit node_modules (rebuild it with npm ci)." },
      { bad: `npm audit fix --force   # blindly`, good: `npm audit\n# read the report, upgrade deliberately, run tests`, why: "`--force` can install breaking major versions. Review and test instead." }
    ],
    practice: [
      { level: "B", q: "Add the `zustand` state library to a React app.", a: "`npm install zustand` (a runtime dependency)." },
      { level: "B", q: "Which versions does `~5.1.3` allow?", a: ">=5.1.3 and <5.2.0, so patch updates only." },
      { level: "I", q: "A teammate's app works but yours breaks after `npm install`. What do you check?", a: "That package-lock.json is committed and you use `npm ci`, so both get identical versions." },
      { level: "C", q: "`npm audit` reports a high-severity issue in a nested dependency. Steps?", a: "Run `npm audit` for the path, try `npm audit fix`, else upgrade the parent package, or use `overrides` in package.json; then test." }
    ],
    quiz: [
      { q: "In semver, a breaking change bumps:", options: ["PATCH", "MINOR", "MAJOR"], answer: 2, why: "MAJOR signals incompatible API changes." },
      { q: "`^2.4.1` allows:", options: ["Only 2.4.1", "2.4.x only", ">=2.4.1 <3.0.0", "Any version"], answer: 2, why: "Caret allows minor and patch updates within the same major." },
      { q: "Best install command in CI:", options: ["npm install", "npm ci", "npm update", "npm audit fix"], answer: 1, why: "npm ci installs exactly from the lock file and fails if it's out of sync." }
    ],
    rev: {
      sec30: "npm installs packages from the registry into node_modules and records them in package.json (ranges) and package-lock.json (exact tree). Semver: MAJOR breaking, MINOR features, PATCH fixes; `^` allows minor+patch, `~` patch only. `npm ci` for reproducible installs, `outdated`/`update` for upgrades, `audit` for vulnerabilities. Dev tools go in devDependencies.",
      interview: [
        { level: "basic", q: "dependencies vs devDependencies?", a: "dependencies are needed to run the app (react); devDependencies only to build, lint or test (vite, vitest)." },
        { level: "intermediate", q: "What's the difference between ^ and ~?", a: "`^1.2.3` allows <2.0.0 (minor and patch). `~1.2.3` allows <1.3.0 (patch only)." },
        { level: "intermediate", q: "Why commit package-lock.json?", a: "It pins the exact version of every package, including nested ones, so all machines and CI get the same install." },
        { level: "advanced", q: "npm install vs npm ci?", a: "install resolves ranges and may update the lock file. ci deletes node_modules, installs exactly from the lock, and errors if package.json and the lock disagree." },
        { level: "tricky", q: "Is `0.x` treated the same by caret?", a: "No. `^0.3.1` allows only <0.4.0, because in 0.x the minor number is treated as breaking." }
      ],
      scenario: [
        { q: "You need to upgrade React Router from v6 to v7. How?", a: "It's a major: read the upgrade guide, `npm install react-router@latest`, change imports to the single `react-router` package (v7 merged the old DOM package into it), run tests." }
      ],
      cheat: [
        "`npm i pkg` → dependencies; `npm i -D pkg` → devDependencies",
        "Semver MAJOR.MINOR.PATCH = breaking.feature.fix",
        "`^1.2.3` < 2.0.0; `~1.2.3` < 1.3.0",
        "Commit package-lock.json, never node_modules",
        "`npm ci` = exact, clean install for CI",
        "`npm outdated` / `npm update` / `pkg@latest`",
        "`npm audit` then fix deliberately; avoid blind --force"
      ]
    },
    related: ["ENV-002", "ENV-005", "ENV-006", "SEC-009"]
  },

  "WEB-041": {
    tldr: "Git saves snapshots of your code (commits) so you can go back in time and work on features in parallel (branches). GitHub hosts your repo online so a team can review changes through **pull requests** before merging.",
    analogy: { icon: "📸", text: "A photo album of your recipe book. Each commit is a photo of every page; a branch is trying a new version of a dish without touching the original until it tastes right." },
    visual: { type: "flow", title: "Feature branch to merged PR", steps: [
      { label: "Branch", detail: "`git switch -c feature/cart` makes a safe copy line off main." },
      { label: "Commit", detail: "`git add` picks changes, `git commit -m` saves a snapshot. Repeat." },
      { label: "Push", detail: "`git push -u origin feature/cart` uploads the branch to GitHub." },
      { label: "Pull request", detail: "Open a PR on GitHub: teammates review, CI runs tests." },
      { label: "Merge", detail: "Approved PR merges into main; delete the branch and `git pull` main." }
    ]},
    points: [
      "Three areas: **working tree** (your edits) → **staging** (`git add`) → **history** (`git commit`).",
      "A **branch** is a movable pointer to a commit. Make one per feature or fix; keep `main` deployable.",
      "`git pull` = fetch + merge remote changes; `git push` uploads your commits.",
      "Merge conflicts happen when two branches edit the same lines: edit the file, remove the markers, `add`, `commit`.",
      "React projects: commit `package.json` + lock file, ignore `node_modules` and `dist` in `.gitignore`."
    ],
    code: { file: "terminal", lang: "bash", src: `# One-time setup
git config --global user.name "Ana Silva"
git config --global user.email "ana@example.com"

# Start tracking a project
git init
git add .
git commit -m "Initial shop app"

# Work on a feature in its own branch
git switch -c feature/cart
# ...edit Cart.jsx...
git status                 # what changed?
git add src/Cart.jsx
git commit -m "Add cart total"

# Share it and open a pull request
git remote add origin https://github.com/ana/shop.git
git push -u origin feature/cart
# GitHub: "Compare & pull request" → review → Merge

# Back on main, get the merged result
git switch main
git pull
git branch -d feature/cart

git log --oneline --graph  # see history`, walk: [
      { lines: [6, 7, 8], note: "init creates the repo; add stages files; commit saves the first snapshot." },
      { lines: [11], note: "`switch -c` creates and moves to a new branch (older form: `checkout -b`)." },
      { lines: [13, 14, 15], note: "Check what changed, stage just the file you mean, commit with a clear message." },
      { lines: [18, 19, 20], note: "Link GitHub, push the branch, then open a pull request in the browser." },
      { lines: [23, 24, 25], note: "After merging, update local main and delete the finished branch." }
    ]},
    output: "On GitHub: a feature/cart branch with an open pull request. After merging, `git log --oneline --graph` shows the cart commit on main.",
    mistakes: [
      { bad: `git commit -m "stuff"\ngit commit -m "fix"`, good: `git commit -m "Add cart total to checkout"\ngit commit -m "Fix rounding in cart total"`, why: "Messages are for future you and reviewers. Say what changed and why, in the imperative." },
      { bad: `git add .\n# node_modules and .env committed`, good: `# .gitignore\nnode_modules\ndist\n.env`, why: "Add a .gitignore first. node_modules is huge and rebuildable; .env may hold secrets." },
      { bad: `git push --force   # on main`, good: `git push --force-with-lease   # only on your own branch`, why: "Force-pushing a shared branch erases teammates' commits. If you must, use --force-with-lease on your own branch." }
    ],
    practice: [
      { level: "B", q: "Save your current changes with a message.", a: "Stage then commit.", code: `git add .\ngit commit -m "Add todo filter"` },
      { level: "B", q: "Create and switch to a branch `fix/login`.", a: "`git switch -c fix/login`." },
      { level: "I", q: "You get a merge conflict in `App.jsx`. Resolve it.", a: "Open the file, choose the right code between `<<<<<<<`, `=======`, `>>>>>>>`, delete the markers, then `git add App.jsx` and `git commit`." },
      { level: "C", q: "You committed to main by mistake (not pushed). Move it to a branch.", a: "Create a branch at the current commit, then reset main back one.", code: `git branch feature/notes\ngit reset --hard HEAD~1\ngit switch feature/notes` }
    ],
    quiz: [
      { q: "`git add` does what?", options: ["Saves a commit", "Stages changes for the next commit", "Uploads to GitHub", "Creates a branch"], answer: 1, why: "Staging chooses what goes into the next commit." },
      { q: "A pull request is:", options: ["A git command", "A GitHub request to review and merge a branch", "Downloading code with git pull"], answer: 1, why: "PRs are a hosting-platform feature for review; `git pull` is unrelated." },
      { q: "What should go in a React project's .gitignore?", options: ["package.json", "src/", "node_modules", "package-lock.json"], answer: 2, why: "node_modules is rebuilt from package.json + the lock file." }
    ],
    rev: {
      sec30: "Git tracks snapshots: edit, `add` to stage, `commit` to save. Branches are cheap pointers for isolated work; `switch -c` makes one. `push` uploads to a remote like GitHub, `pull` brings changes down. A pull request is GitHub's review-and-merge workflow with CI checks. Resolve conflicts by editing the marked lines, then add and commit.",
      interview: [
        { level: "basic", q: "What's the difference between Git and GitHub?", a: "Git is the version-control tool on your machine; GitHub is a hosting service for Git repos with PRs, reviews and CI." },
        { level: "intermediate", q: "git fetch vs git pull?", a: "fetch downloads remote commits without changing your branch; pull is fetch plus merge (or rebase) into the current branch." },
        { level: "intermediate", q: "Merge vs rebase?", a: "Merge joins histories with a merge commit; rebase replays your commits on top of the target for a linear history. Don't rebase shared branches." },
        { level: "advanced", q: "How do you undo a commit that's already pushed?", a: "Use `git revert <sha>`: it adds a new commit that reverses it, without rewriting shared history." },
        { level: "tricky", q: "What exactly is a branch in Git?", a: "Just a named pointer to a commit. Committing moves the pointer forward; creating one is almost free." }
      ],
      compare: { cols: ["", "merge", "rebase"], rows: [
        ["History", "Keeps branch shape + merge commit", "Linear, rewritten commits"],
        ["Safe on shared branches", "Yes", "No"],
        ["Typical use", "Merging a PR", "Tidying your own branch"]
      ]},
      cheat: [
        "edit → `git add` (stage) → `git commit -m` (snapshot)",
        "`git switch -c name` creates a branch",
        "`git push -u origin name` first push of a branch",
        "`git pull` = fetch + merge",
        "PR = review + CI before merging to main",
        "Conflict: fix markers → add → commit",
        "Undo pushed work with `git revert`, not force-push",
        ".gitignore: node_modules, dist, .env"
      ]
    },
    related: ["WEB-040", "PROD-010", "PROD-011", "ENV-007"]
  },
};
