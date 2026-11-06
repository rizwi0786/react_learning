// WEB-015 to WEB-028: core JavaScript for React (control flow, functions, scope, closures, data, modules, promises)
export default {
  "WEB-015": {
    tldr: "Conditions (if/else, switch) pick which code runs. Loops (for, while, for...of) repeat code. Together they are control flow: the path your program takes.",
    analogy: { icon: "🚦", text: "A recipe: **if** the oven is hot, put the cake in; **else** wait. Then **repeat** \"stir\" until the batter is smooth." },
    visual: { type: "flow", title: "Checking out a cart", steps: [
      { label: "for...of each item", detail: "Visit every item in `cart` one at a time." },
      { label: "if out of stock", detail: "`continue` skips this item and moves to the next." },
      { label: "else add to total", detail: "`total += item.price * item.qty`." },
      { label: "switch on coupon", detail: "`case 'SAVE10'` takes 10% off; `default` does nothing." },
      { label: "Show total", detail: "The loop ended, so the total is complete." }
    ]},
    points: [
      "`if / else if / else` checks conditions top to bottom and runs the **first** match only.",
      "`switch` compares one value with `===` against many `case`s. Forgetting `break` makes it **fall through** to the next case.",
      "`for (let i = 0; i < n; i++)` when you need the index; `for...of` when you just need each **value** of an array or string.",
      "`while` repeats while a condition is true; make sure something changes, or it loops forever.",
      "`break` exits a loop; `continue` skips to the next round.",
      "**In React:** JSX can't hold statements, so you use `if` **before** `return`, and `array.map()` instead of `for` inside JSX."
    ],
    code: { file: "cart.js", lang: "js", src: `const cart = [
  { name: 'Apples', price: 2, qty: 3, inStock: true },
  { name: 'Bread', price: 3, qty: 1, inStock: false },
  { name: 'Milk', price: 1.5, qty: 2, inStock: true },
];

let total = 0;
for (const item of cart) {
  if (!item.inStock) {
    console.log(\`Skipping \${item.name}\`);
    continue;
  }
  total += item.price * item.qty;
}

const coupon = 'SAVE10';
switch (coupon) {
  case 'SAVE10':
    total *= 0.9;
    break;
  case 'HALF':
    total *= 0.5;
    break;
  default:
    console.log('No coupon');
}

console.log('Total:', total.toFixed(2));`, walk: [
      { lines: [8], note: "`for...of` hands you each item object, no index bookkeeping." },
      { lines: [9, 10, 11, 12], note: "Out of stock? Log it and `continue` straight to the next item." },
      { lines: [13], note: "Only in-stock items reach this line." },
      { lines: [17, 18, 19, 20], note: "`switch` matches `'SAVE10'` with `===`; `break` stops it running the `HALF` case too." },
      { lines: [24, 25], note: "`default` runs when no case matches, like a final `else`." }
    ]},
    output: "Skipping Bread\nTotal: 8.10",
    mistakes: [
      { bad: `switch (size) {\n  case 'S': price = 2;\n  case 'M': price = 3;\n}`, good: `switch (size) {\n  case 'S': price = 2; break;\n  case 'M': price = 3; break;\n}`, why: "Without `break`, a match on `'S'` falls through and also runs the `'M'` line, so price ends up 3." },
      { bad: `for (const i in ['a', 'b']) console.log(i);`, good: `for (const x of ['a', 'b']) console.log(x);`, why: "`for...in` loops over **keys** (here the strings '0', '1'). Use `for...of` for array values." }
    ],
    practice: [
      { level: "B", q: "Print \"Free delivery\" if `total >= 50`, otherwise \"Add £X more\".", a: "Use `if (total >= 50) ... else ...` and compute `50 - total` in the else.", code: `if (total >= 50) console.log('Free delivery');\nelse console.log(\`Add £\${50 - total} more\`);` },
      { level: "B", q: "Count how many todos in an array are done using `for...of`.", a: "Start `let done = 0`, loop, and `if (todo.done) done++`." },
      { level: "I", q: "Use `while` to keep removing the first song from a playlist until its total length is under 60 minutes.", a: "`while (sum(playlist) > 60) playlist.shift();` The condition changes every round, so it ends." },
      { level: "C", q: "Rewrite a `switch` on weather (`'sun'`, `'rain'`, `'snow'`) as an object lookup.", a: "`const icon = { sun: '☀️', rain: '🌧️', snow: '❄️' }[weather] ?? '❓';` Shorter and easy to extend.", code: `const icons = { sun: '☀️', rain: '🌧️', snow: '❄️' };\nconst icon = icons[weather] ?? '❓';` }
    ],
    quiz: [
      { q: "Which loop gives you each **value** of an array directly?", options: ["for...in", "for...of", "while", "do...while"], answer: 1, why: "`for...of` iterates values; `for...in` iterates keys (indexes as strings)." },
      { q: "What happens when a `switch` case has no `break`?", options: ["Syntax error", "It falls through and runs the next case too", "It jumps to `default`", "It stops the program"], answer: 1, why: "Execution continues into the following case until a `break` or the end." },
      { q: "Why can't you write an `if` statement directly inside JSX braces?", options: ["JSX only accepts expressions, and `if` is a statement", "React bans conditions", "`if` is slow", "You can, it works fine"], answer: 0, why: "`{}` in JSX takes an expression. Use a ternary, `&&`, or an `if` before `return`." }
    ],
    rev: {
      sec30: "`if/else` and `switch` choose a path; `for`, `while` and `for...of` repeat. `switch` uses `===` and falls through without `break`. `for...of` gives values, `for...in` gives keys. `break` exits, `continue` skips. In React you keep statements outside JSX and use `map()` for lists.",
      interview: [
        { level: "basic", q: "`for...of` vs `for...in`?", a: "`for...of` iterates values of iterables (arrays, strings, Maps). `for...in` iterates enumerable keys of an object, including inherited ones, so avoid it for arrays." },
        { level: "intermediate", q: "When would you pick `switch` over `if/else`?", a: "When one value is compared against many fixed options. It reads cleaner; an object lookup is often cleaner still." },
        { level: "intermediate", q: "Difference between `break` and `continue`?", a: "`break` leaves the loop entirely; `continue` ends the current round and starts the next one." },
        { level: "tricky", q: "Why doesn't `for` work inside JSX?", a: "JSX braces accept expressions only. A `for` loop is a statement and returns nothing, so you use `array.map()` which returns an array of elements." }
      ],
      predict: [
        { code: `let n = 0;\nswitch (2) {\n  case 1: n += 1;\n  case 2: n += 2;\n  case 3: n += 3;\n}\nconsole.log(n);`, answer: "5", why: "It matches case 2, then falls through into case 3 because there is no `break`." }
      ],
      cheat: [
        "`if / else if / else`: first true branch wins",
        "`switch` compares with `===`; add `break` or it falls through",
        "`for...of` = values, `for...in` = keys",
        "`break` exits loop, `continue` skips one round",
        "`while` needs something that eventually makes the condition false",
        "In JSX use ternary / `&&` / `map()`, not `if` / `for`"
      ]
    },
    related: ["WEB-014", "WEB-022", "COND-002", "JSX-014"]
  },

  "WEB-016": {
    tldr: "A function is a named, reusable block of code. You give it inputs (parameters), it does work, and it hands back a result with `return`.",
    analogy: { icon: "☕", text: "A coffee machine: put in beans and a size (parameters), press the button (call), get a coffee back (return value). Same machine, any order." },
    visual: { type: "flow", title: "Calling `price(10, 2)`", steps: [
      { label: "Call", detail: "`price(10, 2)` jumps into the function." },
      { label: "Bind parameters", detail: "`unit = 10`, `qty = 2`; `tax` is missing so its default `0.25` is used." },
      { label: "Run the body", detail: "Computes `10 * 2 * 1.25`." },
      { label: "return", detail: "Hands `25` back and stops the function right there." },
      { label: "Use the result", detail: "`const total = 25` at the call site." }
    ]},
    points: [
      "**Declaration** `function add(a, b) {}` is hoisted; **expression** `const add = function (a, b) {}` is not.",
      "Parameters are the names in the definition; **arguments** are the values you pass in.",
      "Missing arguments are `undefined`; a **default parameter** `qty = 1` fills the gap.",
      "`return` sends a value back and exits. No `return` means the function returns `undefined`.",
      "Functions are values: store them in variables, pass them to other functions (**callbacks**), return them.",
      "**In React:** a component is just a function that takes `props` and returns JSX."
    ],
    code: { file: "price.js", lang: "js", src: `function price(unit, qty = 1, tax = 0.25) {
  if (qty <= 0) return 0;
  return unit * qty * (1 + tax);
}

console.log(price(10, 2));     // 25
console.log(price(10));        // 12.5
console.log(price(10, 0));     // 0

// Functions are values: pass one in as a callback
function applyToCart(cart, fn) {
  const results = [];
  for (const item of cart) results.push(fn(item.unit, item.qty));
  return results;
}

const cart = [{ unit: 5, qty: 2 }, { unit: 3, qty: 1 }];
console.log(applyToCart(cart, price)); // [12.5, 3.75]

// A React component is the same idea
function Greeting({ name = 'friend' }) {
  return \`Hello, \${name}!\`;
}
console.log(Greeting({ name: 'Sam' }));`, walk: [
      { lines: [1], note: "Three parameters; `qty` and `tax` have defaults used when the argument is missing." },
      { lines: [2], note: "An early `return` exits immediately: an easy guard clause." },
      { lines: [7], note: "`price(10)` uses `qty = 1` and `tax = 0.25`." },
      { lines: [11, 12, 13], note: "`fn` is a function passed in as an argument (a callback)." },
      { lines: [21, 22, 23], note: "Components are functions with one argument, `props`, often destructured with defaults." }
    ]},
    output: "25\n12.5\n0\n[ 12.5, 3.75 ]\nHello, Sam!",
    mistakes: [
      { bad: `function total(a, b) {\n  a + b;\n}\ntotal(2, 3); // undefined`, good: `function total(a, b) {\n  return a + b;\n}`, why: "Without `return` a function gives back `undefined`, even if it computed a value." },
      { bad: `<button onClick={addToCart(item)}>Add</button>`, good: `<button onClick={() => addToCart(item)}>Add</button>`, why: "`addToCart(item)` **calls** it during render. Pass a function so it runs on click." }
    ],
    practice: [
      { level: "B", q: "Write `greet(name)` that returns \"Hi, NAME\" and defaults to \"guest\".", a: "Use a default parameter.", code: `function greet(name = 'guest') {\n  return 'Hi, ' + name;\n}` },
      { level: "B", q: "What does `function f() {}` return when called?", a: "`undefined`, because there is no `return`." },
      { level: "I", q: "Write `isCheap(price, limit = 5)` returning a boolean, then use it as a callback in `filter`.", a: "`products.filter(p => isCheap(p.price))`." },
      { level: "C", q: "Write `makeLabel(fn)` that takes a formatting function and returns a new function that wraps the result in brackets.", a: "Return a function: `const makeLabel = fn => x => '[' + fn(x) + ']';` Functions can return functions." }
    ],
    quiz: [
      { q: "`price(10)` where `function price(u, q = 3)`: what is `q`?", options: ["undefined", "3", "10", "0"], answer: 1, why: "A missing argument is `undefined`, so the default `3` kicks in." },
      { q: "What does a function with no `return` statement return?", options: ["null", "0", "undefined", "The last expression"], answer: 2, why: "JS functions return `undefined` unless told otherwise (arrow shorthand is the exception)." },
      { q: "What is a React function component?", options: ["A class", "A function that takes props and returns JSX", "An HTML file", "A special React-only syntax"], answer: 1, why: "Components are plain JavaScript functions." }
    ],
    rev: {
      sec30: "Functions package reusable logic. Parameters receive arguments; defaults fill missing ones; `return` sends a value back and exits (otherwise `undefined`). Functions are first-class values, so you can pass them as callbacks. Declarations are hoisted, expressions are not. React components are functions of props.",
      interview: [
        { level: "basic", q: "Parameter vs argument?", a: "A parameter is the name in the function definition; an argument is the actual value passed when calling it." },
        { level: "intermediate", q: "Function declaration vs function expression?", a: "Declarations are hoisted with their body, so you can call them before the line. Expressions assigned to `const` exist only after that line runs." },
        { level: "intermediate", q: "What does \"functions are first-class\" mean?", a: "Functions are values: you can assign them, pass them as arguments, and return them. That's what makes callbacks and hooks possible." },
        { level: "tricky", q: "Does a default parameter apply when you pass `null`?", a: "No. Defaults apply only for `undefined`. `f(null)` keeps `null`." }
      ],
      predict: [
        { code: `function f(x = 5) { return x; }\nconsole.log(f(undefined), f(null));`, answer: "5 null", why: "Only `undefined` triggers the default." }
      ],
      cheat: [
        "`function name(a, b = 1) { return a + b; }`",
        "Missing argument = `undefined`; defaults fill only `undefined`",
        "No `return` -> returns `undefined`",
        "Declarations are hoisted; `const fn = function(){}` is not",
        "Functions are values: pass as callbacks, return from functions",
        "`onClick={fn}` passes; `onClick={fn()}` calls during render"
      ]
    },
    related: ["WEB-017", "WEB-019", "COMP-003", "EVT-001"]
  },

  "WEB-017": {
    tldr: "Arrow functions are a short way to write functions: `(a, b) => a + b`. They also don't have their own `this`; they use the `this` of the code around them (lexical this).",
    analogy: { icon: "📝", text: "A sticky note instead of a full letter: same message, fewer words. And it has no return address of its own, it uses the address of the desk it's stuck on (lexical `this`)." },
    visual: { type: "compare", title: "Regular vs arrow function", left: { label: "function () {}", tone: "neutral", points: [
      "Own `this`, set by **how** it's called",
      "Has `arguments` object",
      "Can be used with `new`",
      "Declarations are hoisted"
    ]}, right: { label: "() => {}", tone: "good", points: [
      "No own `this`: uses the surrounding one",
      "No `arguments`: use `...rest`",
      "Can't be used with `new`",
      "Implicit return for one expression"
    ]}},
    points: [
      "One expression? Skip braces and `return`: `x => x * 2`. With braces you must write `return`.",
      "One parameter needs no parentheses; zero or several do: `() => 1`, `(a, b) => a + b`.",
      "Returning an object literal needs parentheses: `() => ({ id: 1 })`.",
      "**Lexical this**: an arrow inside a method keeps the method's `this`, great for callbacks like `setTimeout`.",
      "Don't use arrows as object **methods** that need `this`: `this` won't be the object.",
      "**In React:** arrows are everywhere: `onClick={() => add(item)}`, `items.map(i => <li key={i.id}>...)`."
    ],
    code: { file: "arrows.js", lang: "js", src: `// Short forms
const double = n => n * 2;
const add = (a, b) => a + b;
const makeTodo = text => ({ text, done: false });
console.log(double(4), add(2, 3), makeTodo('Buy milk'));

// Lexical this
const timer = {
  seconds: 0,
  start() {
    setTimeout(() => {
      this.seconds++;            // 'this' is timer
      console.log('arrow:', this.seconds);
    }, 100);
    setTimeout(function () {
      console.log('regular:', this?.seconds); // 'this' is not timer
    }, 100);
  },
};
timer.start();

// Arrow as a method: 'this' is NOT the object
const cart = {
  items: 3,
  count: () => this?.items,
};
console.log('count:', cart.count());`, walk: [
      { lines: [2, 3], note: "One expression body returns automatically (implicit return)." },
      { lines: [4], note: "Wrap an object literal in `()` or the braces are read as a function body." },
      { lines: [11, 12], note: "The arrow has no own `this`, so it uses `start()`'s `this`: the `timer` object." },
      { lines: [15, 16], note: "A regular callback gets its own `this` (not `timer`), so `seconds` is lost." },
      { lines: [25], note: "As an object method, the arrow takes `this` from the module scope, not `cart`." }
    ]},
    output: "8 5 { text: 'Buy milk', done: false }\ncount: undefined\narrow: 1\nregular: undefined",
    mistakes: [
      { bad: `const makeItem = name => { name, qty: 1 };`, good: `const makeItem = name => ({ name, qty: 1 });`, why: "Braces after `=>` start a function body, not an object. Wrap the object in parentheses." },
      { bad: `const sum = (a, b) => { a + b };`, good: `const sum = (a, b) => a + b;`, why: "With braces there is no implicit return; this returns `undefined`. Drop the braces or add `return`." }
    ],
    practice: [
      { level: "B", q: "Rewrite `function square(n) { return n * n; }` as an arrow.", a: "`const square = n => n * n;`" },
      { level: "B", q: "Write an arrow that returns `{ city, temp: 20 }` for a city.", a: "`const weather = city => ({ city, temp: 20 });`" },
      { level: "I", q: "Use an arrow in `map` to turn `['a','b']` into `['A','B']`.", a: "`letters.map(l => l.toUpperCase())`" },
      { level: "C", q: "Why does `this` work inside `setTimeout(() => this.x)` in a method, but not with `function () {}`?", a: "The arrow takes `this` from the enclosing method. The regular function's `this` is set by how `setTimeout` calls it (not your object)." }
    ],
    quiz: [
      { q: "`const f = () => { value: 1 };` What does `f()` return?", options: ["{ value: 1 }", "1", "undefined", "SyntaxError"], answer: 2, why: "The braces are a function body with a label `value:`. No return, so `undefined`." },
      { q: "Where does an arrow function get `this` from?", options: ["The object it's called on", "The surrounding scope where it was written", "Always `window`", "The first argument"], answer: 1, why: "Arrows have lexical `this`: whatever `this` is in the enclosing code." },
      { q: "Which is a good use of an arrow function?", options: ["An object method using `this`", "A constructor with `new`", "A callback to `map` or `onClick`", "Anywhere you need `arguments`"], answer: 2, why: "Short callbacks are the sweet spot; arrows can't be constructors and have no own `this` or `arguments`." }
    ],
    rev: {
      sec30: "Arrow functions are concise function expressions: `x => x * 2`. One-expression bodies return implicitly; wrap object literals in `()`. They have no own `this`, `arguments` or `new`; `this` comes from the surrounding scope. Perfect for callbacks and React handlers; avoid for object methods that need `this`.",
      interview: [
        { level: "basic", q: "What's an implicit return?", a: "If the arrow body is a single expression without braces, its value is returned automatically: `n => n * 2`." },
        { level: "intermediate", q: "What is lexical `this`?", a: "An arrow doesn't bind its own `this`; it uses the `this` of the scope where it was defined. That's why it works inside callbacks in methods." },
        { level: "advanced", q: "Why were arrows so useful in React class components, and do they matter now?", a: "They avoided `this.handleClick.bind(this)`. With function components there's no `this`, so arrows are now just concise inline callbacks." },
        { level: "tricky", q: "Can you call `call`/`bind` to change an arrow's `this`?", a: "No. `bind`, `call` and `apply` can't change an arrow's `this`; it's fixed by where the arrow was written." }
      ],
      predict: [
        { code: `// inside an ES module (type="module" / Vite)\nconst user = {\n  name: 'Ana',\n  hi: () => 'Hi ' + this?.name,\n};\nconsole.log(user.hi());`, answer: "Hi undefined", why: "The arrow's `this` comes from the outer scope (module top level, where `this` is `undefined`), not `user`." }
      ],
      cheat: [
        "`x => x * 2` (one param, implicit return)",
        "`(a, b) => { return a + b; }` (braces need `return`)",
        "Object literal: `() => ({ id: 1 })`",
        "No own `this`, `arguments`, or `new`",
        "Great for callbacks: `map`, `filter`, `onClick`",
        "Avoid as object methods that use `this`"
      ]
    },
    related: ["WEB-016", "WEB-022", "EVT-001", "JSX-014"]
  },

  "WEB-018": {
    tldr: "Scope decides where a variable can be seen. JS looks for a name in the current block, then the enclosing function, then outward to global: that path is the scope chain.",
    analogy: { icon: "🏠", text: "Looking for the TV remote: first your room, then the flat, then the whole building. You can look **outward**, never into a neighbour's room." },
    visual: { type: "tree", title: "Scope chain in a chat app", root: { label: "Global", note: "appName", children: [
      { label: "function sendMessage()", note: "user, text", children: [
        { label: "if (text) { }", note: "block: let trimmed", children: [
          { label: "lookup `appName`", note: "not here -> function -> global ✓" }
        ]}
      ]},
      { label: "function logout()", note: "can't see `user` or `trimmed`" }
    ]}},
    points: [
      "**Global scope**: declared outside everything; visible everywhere. Keep it small.",
      "**Function scope**: `var`, `let`, `const` and parameters inside a function stay inside it.",
      "**Block scope**: `let` and `const` inside `{ }` (if, for) live only in that block. `var` ignores blocks.",
      "Lookups go **inward to outward** along the scope chain; inner code can read outer names, never the reverse.",
      "An inner variable with the same name **shadows** the outer one.",
      "**In React:** each render's handlers can read that render's props and state because they're in the component's scope."
    ],
    code: { file: "scope.js", lang: "js", src: `const appName = 'ChatNow';          // global

function sendMessage(user, text) {   // function scope
  const time = '10:30';

  if (text) {
    const trimmed = text.trim();     // block scope
    var legacy = 'var leaks out';    // function-scoped!
    console.log(\`[\${appName}] \${user} @ \${time}: \${trimmed}\`);
  }

  console.log(legacy);               // works (var)
  // console.log(trimmed);           // ReferenceError
}

function logout() {
  // console.log(user);              // ReferenceError: not in scope
  const appName = 'Shadowed';        // shadows the global
  console.log(appName);
}

sendMessage('Sam', '  hello  ');
logout();
console.log(appName);`, walk: [
      { lines: [1], note: "Global: every function below can read `appName`." },
      { lines: [7], note: "`trimmed` exists only inside the `if` block." },
      { lines: [8, 12], note: "`var` ignores blocks, so `legacy` is visible in the whole function." },
      { lines: [9], note: "Lookup climbs the chain: `trimmed` (block), `user`/`time` (function), `appName` (global)." },
      { lines: [18, 19], note: "A local `appName` shadows the global inside `logout` only." }
    ]},
    output: "[ChatNow] Sam @ 10:30: hello\nvar leaks out\nShadowed\nChatNow",
    mistakes: [
      { bad: `if (loggedIn) {\n  const name = 'Ana';\n}\nconsole.log(name);`, good: `let name = 'guest';\nif (loggedIn) {\n  name = 'Ana';\n}\nconsole.log(name);`, why: "`const`/`let` inside a block disappear after the `}`. Declare it in the scope where you need it." },
      { bad: `function save() {\n  total = 10; // forgot const\n}`, good: `function save() {\n  const total = 10;\n}`, why: "Assigning an undeclared name creates an accidental global in sloppy mode (and throws in strict mode / modules)." }
    ],
    practice: [
      { level: "B", q: "Can a function read a variable declared in a function that calls it?", a: "No. Scope depends on where code is **written** (lexical), not who calls it." },
      { level: "B", q: "Declare `let count` inside a `for` loop. Can you log it after the loop?", a: "No, it's block-scoped to the loop body; you get a ReferenceError." },
      { level: "I", q: "Rewrite so `discount` is visible after the `if`: `if (vip) { const discount = 0.2; }`.", a: "`let discount = 0; if (vip) discount = 0.2;`" },
      { level: "C", q: "Two nested functions both declare `name`. Which one does the innermost `console.log(name)` print?", a: "The nearest one (innermost); the outer one is shadowed." }
    ],
    quiz: [
      { q: "Where is a `let` declared inside an `if` block visible?", options: ["Whole file", "Whole function", "Only inside that block", "Only after the function returns"], answer: 2, why: "`let` and `const` are block-scoped." },
      { q: "Which keyword ignores block scope?", options: ["let", "const", "var", "function parameters"], answer: 2, why: "`var` is function-scoped, so it leaks out of `if` and `for` blocks." },
      { q: "How does JS find a variable name?", options: ["Searches global first", "Searches the current scope, then outward", "Searches the caller's scope", "Randomly"], answer: 1, why: "The scope chain goes from innermost to outermost, based on where code is written." }
    ],
    rev: {
      sec30: "Scope is where a name is visible. Global > function > block. `let`/`const` are block-scoped, `var` is function-scoped. Lookups walk outward along the scope chain, based on where code is written (lexical scope), not where it's called. Inner names shadow outer ones. This chain is what makes closures work.",
      interview: [
        { level: "basic", q: "What are the three kinds of scope in JS?", a: "Global, function, and block. Modules add a module scope that's like a private top level per file." },
        { level: "intermediate", q: "What is lexical scope?", a: "Scope is decided by where code is written in the source, not where it's called from. A function sees the variables around its definition." },
        { level: "intermediate", q: "What is shadowing?", a: "Declaring an inner variable with the same name as an outer one. Inside the inner scope, the outer one is hidden." },
        { level: "tricky", q: "What does `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` print, and why?", a: "3, 3, 3. `var` makes one function-wide `i`; all callbacks share it. With `let` each iteration gets its own `i`: 0, 1, 2." }
      ],
      predict: [
        { code: `let x = 'outer';\nfunction show() {\n  let x = 'inner';\n  { let x = 'block'; }\n  console.log(x);\n}\nshow();`, answer: "inner", why: "The block's `x` is gone after `}`; the nearest `x` is the function's." }
      ],
      cheat: [
        "Global -> function -> block",
        "`let`/`const` = block scope; `var` = function scope",
        "Lookup goes inner -> outer (scope chain)",
        "Lexical: decided by where code is written",
        "Inner names shadow outer ones",
        "ES modules have their own scope: top-level names aren't global"
      ]
    },
    related: ["WEB-012", "WEB-019", "WEB-020", "WEB-026"]
  },

  "WEB-019": {
    tldr: "Before running your code, JS sets up every declaration in its scope (hoisting). `var` starts as `undefined`, function declarations are ready to call, and `let`/`const` exist but can't be touched until their line (temporal dead zone).",
    analogy: { icon: "📋", text: "A restaurant reads the whole booking list before opening. Every guest has a table reserved, but `let`/`const` guests aren't seated until they actually arrive: go to their table early and you get an error." },
    visual: { type: "timeline", title: "One scope, two passes", frames: [
      { label: "Setup pass", state: "greet = fn, total = undefined, tax = <TDZ>", note: "JS registers all declarations before running any line." },
      { label: "line 1: greet()", state: "works ✓", note: "Function declarations are hoisted with their body." },
      { label: "line 2: total", state: "undefined", note: "`var` is hoisted and set to `undefined`." },
      { label: "line 3: tax", state: "ReferenceError ✗", note: "`let`/`const` are in the temporal dead zone until their declaration." },
      { label: "after `let tax = 0.2`", state: "tax = 0.2", note: "The TDZ ends at the declaration line; now it's usable." }
    ]},
    points: [
      "**Function declarations** are hoisted fully: you can call them above where they're written.",
      "**`var`** is hoisted and initialised to `undefined`: reading early gives `undefined`, not an error.",
      "**`let` / `const` / `class`** are hoisted but uninitialised: reading before the line throws a ReferenceError (the **temporal dead zone**, TDZ).",
      "Function **expressions** and arrows follow their variable: `const fn = () => {}` is in the TDZ until that line.",
      "Hoisting happens per scope: each function and block sets up its own declarations.",
      "**In React:** you can call a helper function declared below your component, but not a `const` helper used at module top level before its line."
    ],
    code: { file: "hoisting.js", lang: "js", src: `console.log(greet('Ana'));   // works: declaration hoisted
console.log(total);          // undefined: var hoisted
try {
  console.log(tax);          // TDZ
} catch (e) {
  console.log(e.name);       // ReferenceError
}
try {
  shout('hi');               // const fn is in TDZ too
} catch (e) {
  console.log(e.name);
}

function greet(name) {
  return 'Hello ' + name;
}
var total = 50;
let tax = 0.2;
const shout = text => text.toUpperCase();

console.log(total, tax, shout('done'));`, walk: [
      { lines: [1, 14, 15, 16], note: "`greet` is a function declaration, so it's fully ready before line 1 runs." },
      { lines: [2, 17], note: "`var total` exists from the start, but its value `50` is assigned only on line 17." },
      { lines: [4, 18], note: "`tax` is hoisted but in the TDZ; touching it early throws." },
      { lines: [9, 19], note: "An arrow stored in `const` behaves like any `const`: not callable before its line." },
      { lines: [21], note: "After all declarations ran, everything is available." }
    ]},
    output: "Hello Ana\nundefined\nReferenceError\nReferenceError\n50 0.2 DONE",
    mistakes: [
      { bad: `handleSave();\nconst handleSave = () => save(cart);`, good: `const handleSave = () => save(cart);\nhandleSave();`, why: "Arrow functions in `const` aren't hoisted like declarations. Define them before you call them." },
      { bad: `console.log(count); // undefined, no error\nvar count = 5;`, good: `const count = 5;\nconsole.log(count);`, why: "`var` hides the bug by giving `undefined`. `let`/`const` fail loudly so you notice the order problem." }
    ],
    practice: [
      { level: "B", q: "Will `sayHi()` work if `function sayHi() {}` is written below the call?", a: "Yes. Function declarations are hoisted with their body." },
      { level: "B", q: "What does `console.log(x); var x = 3;` print?", a: "`undefined`." },
      { level: "I", q: "What does `console.log(y); let y = 3;` do?", a: "Throws `ReferenceError: Cannot access 'y' before initialization` (TDZ)." },
      { level: "C", q: "Predict: `let a = 1; { console.log(a); let a = 2; }`", a: "ReferenceError. The inner `let a` is hoisted to the top of the block, so `a` in that block is in its TDZ (it doesn't fall back to the outer `a`)." }
    ],
    quiz: [
      { q: "`console.log(n); var n = 7;` prints?", options: ["7", "undefined", "ReferenceError", "null"], answer: 1, why: "`var` is hoisted and initialised to `undefined`; the `= 7` runs later." },
      { q: "What is the temporal dead zone?", options: ["Time when the event loop is idle", "The period before a `let`/`const` declaration line where the name can't be used", "Code after `return`", "A `var` bug"], answer: 1, why: "The binding exists but is uninitialised until its declaration runs." },
      { q: "Which can you safely call before its line?", options: ["`function add() {}`", "`const add = () => {}`", "`let add = function () {}`", "`class Add {}`"], answer: 0, why: "Only function declarations are hoisted with their value." }
    ],
    rev: {
      sec30: "Hoisting: JS registers declarations before running a scope. Function declarations are hoisted with their body. `var` is hoisted as `undefined`. `let`, `const` and `class` are hoisted but stay in the temporal dead zone until their line, so early access throws. Arrows/expressions follow their variable's rules.",
      interview: [
        { level: "basic", q: "What is hoisting?", a: "JS processes declarations before executing code in a scope, so names exist from the top of that scope. How usable they are depends on the declaration type." },
        { level: "intermediate", q: "Are `let` and `const` hoisted?", a: "Yes, but they're not initialised. Accessing them before the declaration throws a ReferenceError; that window is the temporal dead zone." },
        { level: "intermediate", q: "Why can you call a function declaration before it's defined but not an arrow function?", a: "Declarations are hoisted with their body. An arrow is a value assigned to a variable, so it follows `const`/`let` TDZ rules." },
        { level: "tricky", q: "`let x = 1; function f() { console.log(x); let x = 2; } f();` Output?", a: "ReferenceError. The inner `let x` shadows the outer one from the top of `f`, so `x` is in its TDZ at the log." }
      ],
      predict: [
        { code: `console.log(typeof hello, typeof bye);\nfunction hello() {}\nvar bye = () => {};`, answer: "function undefined", why: "`hello` is hoisted as a function; `bye` is a `var` set to `undefined` until its line runs." }
      ],
      cheat: [
        "Function declarations: hoisted with body (callable early)",
        "`var`: hoisted as `undefined`",
        "`let`/`const`/`class`: hoisted, but TDZ until their line",
        "TDZ access = ReferenceError",
        "Arrows/expressions follow their variable's rules",
        "Prefer `const`/`let`: order bugs fail loudly"
      ]
    },
    related: ["WEB-012", "WEB-018", "WEB-016", "WEB-032"]
  },

  "WEB-020": {
    tldr: "A closure is a function that remembers the variables around where it was created, even after that outer function has finished. It's how JS gives you private state, and how every React hook and handler sees its render's values.",
    analogy: { icon: "🎒", text: "A kid leaving home with a backpack. Home (the outer function) is gone for the day, but the backpack still holds the snacks packed there (the variables)." },
    visual: { type: "timeline", title: "makeCounter() and its backpack", frames: [
      { label: "call makeCounter()", state: "count = 0", note: "A new scope is created with its own `count`." },
      { label: "return add", state: "outer finished, count kept", note: "The inner function holds a reference to `count`, so it isn't garbage collected." },
      { label: "add()", state: "count = 1", note: "The closure reads and updates the remembered `count`." },
      { label: "add()", state: "count = 2", note: "Same backpack each time: state persists between calls." },
      { label: "makeCounter() again", state: "new count = 0", note: "Each call makes a fresh, separate closure." }
    ]},
    points: [
      "A function keeps access to its **outer scope** (lexical scope) for as long as the function exists.",
      "Use closures for **private state**: the variable can't be reached except through the returned functions.",
      "Each call of the outer function creates a **new** set of variables, so closures don't share by accident.",
      "Closures capture **variables**, not frozen values; if the variable changes, the closure sees the change.",
      "**In React:** handlers and effects close over the props/state of the render that created them. A stale closure reads old values; fix with functional updates (`setCount(c => c + 1)`) or correct dependencies."
    ],
    code: { file: "closures.js", lang: "js", src: `function makeCart() {
  let items = [];                 // private

  return {
    add(name) {
      items = [...items, name];
      return items.length;
    },
    list() {
      return items.join(', ');
    },
  };
}

const myCart = makeCart();
myCart.add('Apples');
myCart.add('Bread');
console.log(myCart.list());       // Apples, Bread
console.log(myCart.items);        // undefined: private

const otherCart = makeCart();      // fresh closure
console.log(otherCart.list() || '(empty)');

// The React connection: a stale closure
let count = 0;
const snapshot = count;            // like state in one render
const logLater = () => console.log('saw', snapshot);
count = 5;
logLater();                        // saw 0`, walk: [
      { lines: [2], note: "`items` lives in `makeCart`'s scope; nothing outside can touch it directly." },
      { lines: [5, 6, 9, 10], note: "Both methods close over the same `items` variable." },
      { lines: [15, 16, 17, 18], note: "`makeCart` has returned, yet `add` and `list` still remember `items`." },
      { lines: [19], note: "There's no `items` property: the data is truly private." },
      { lines: [21, 22], note: "A second call creates a separate `items`: no shared state." },
      { lines: [26, 27, 28, 29], note: "Like a handler from an old render: it closed over a value that was fixed then." }
    ]},
    output: "Apples, Bread\nundefined\n(empty)\nsaw 0",
    mistakes: [
      { bad: `useEffect(() => {\n  const id = setInterval(() => setCount(count + 1), 1000);\n  return () => clearInterval(id);\n}, []);`, good: `useEffect(() => {\n  const id = setInterval(() => setCount(c => c + 1), 1000);\n  return () => clearInterval(id);\n}, []);`, why: "The interval's closure captured `count` from the first render (0), so it keeps setting 1. A functional update always gets the latest value." },
      { bad: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n} // 3 3 3`, good: `for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n} // 0 1 2`, why: "All closures share the single function-scoped `var i`. `let` creates a new `i` per iteration." }
    ],
    practice: [
      { level: "B", q: "Write `makeGreeter(greeting)` that returns `name => greeting + ', ' + name`.", a: "The returned arrow closes over `greeting`.", code: `const makeGreeter = greeting => name => greeting + ', ' + name;\nconst hi = makeGreeter('Hi');\nhi('Sam'); // 'Hi, Sam'` },
      { level: "B", q: "Is the `items` variable inside `makeCart` reachable from outside?", a: "No, only through the functions that close over it." },
      { level: "I", q: "Build `once(fn)` that runs `fn` only the first time it's called.", a: "Close over a `done` flag.", code: `function once(fn) {\n  let done = false;\n  return (...args) => {\n    if (done) return;\n    done = true;\n    return fn(...args);\n  };\n}` },
      { level: "C", q: "In a React chat, a `setTimeout` in a click handler logs the old message text after you've typed more. Why, and how do you get the latest?", a: "The handler closed over that render's `text`. Read a ref (`textRef.current`) for the latest value, or use the value at click time on purpose." }
    ],
    quiz: [
      { q: "What does a closure capture?", options: ["A copy of values at creation time", "References to variables in its outer scope", "Only global variables", "Nothing after the outer function returns"], answer: 1, why: "Closures hold the variables themselves, so they see later changes to them." },
      { q: "Two calls to `makeCounter()` give two counters. Do they share `count`?", options: ["Yes", "No, each call creates its own scope"], answer: 1, why: "Every call runs the outer function again, creating new variables." },
      { q: "`setInterval(() => setCount(count + 1), 1000)` inside `useEffect(..., [])` stops at 1. Why?", options: ["setInterval is broken in React", "The closure saw `count` from the first render only", "React batches it away", "Strict Mode"], answer: 1, why: "Stale closure. Use `setCount(c => c + 1)`." }
    ],
    rev: {
      sec30: "A closure is a function plus the variables of the scope it was created in. It keeps them alive after the outer function returns. Use it for private state, factories and memoised helpers. In React every render creates new closures over that render's props and state; a callback that outlives its render sees stale values unless you use functional updates, refs or correct dependencies.",
      interview: [
        { level: "basic", q: "What is a closure?", a: "A function that keeps access to variables from the scope where it was defined, even after that scope has finished running." },
        { level: "intermediate", q: "Give a practical use of closures.", a: "Private state (counter or cart factory), function factories like `makeGreeter`, `once`, debounce, and memoisation caches." },
        { level: "advanced", q: "What is a stale closure in React?", a: "A callback (effect, interval, async handler) that captured props/state from an older render and keeps using those old values. Fix with functional updates, a ref, or correct dependency arrays." },
        { level: "tricky", q: "Why does `var` in a loop with `setTimeout` print the same number three times?", a: "There's one `i` for the whole function; all callbacks close over it and run after the loop ends. `let` makes a new binding per iteration." },
        { level: "advanced", q: "Can closures cause memory leaks?", a: "They keep referenced variables alive. A long-lived listener or interval that closes over big data keeps it in memory until removed, which is why effects return cleanup functions." }
      ],
      predict: [
        { code: `function make() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = make(), b = make();\na(); a();\nconsole.log(a(), b());`, answer: "3 1", why: "`a` and `b` each have their own `n`." }
      ],
      cheat: [
        "Closure = function + its remembered outer variables",
        "Keeps variables alive after the outer function returns",
        "Captures variables (live), not copies",
        "Each outer call = a new, separate closure",
        "Use for private state, factories, `once`, debounce",
        "React: handlers/effects close over that render's state",
        "Stale closure fix: `setX(prev => ...)`, refs, correct deps"
      ]
    },
    related: ["WEB-018", "HOOKS-005", "STATE-010", "RENDER-011"]
  },

  "WEB-021": {
    tldr: "Arrays are ordered lists, objects are labelled bags of values. Both are passed by reference: copying the variable copies the address, not the data, so a change through one name shows up in the other.",
    analogy: { icon: "📒", text: "A shared notes link. Sending the link (reference) to a friend doesn't copy the notes. If they edit, you see the edit. To keep your own version, you need to duplicate the doc (a copy)." },
    visual: { type: "compare", title: "Value vs reference", left: { label: "Primitives (by value)", tone: "neutral", points: [
      "`let a = 5; let b = a;` copies the number",
      "`b = 6` leaves `a` as 5",
      "`===` compares the values",
      "string, number, boolean, null, undefined..."
    ]}, right: { label: "Objects & arrays (by reference)", tone: "bad", points: [
      "`const b = a` copies the **address** only",
      "`b.qty = 2` changes `a.qty` too",
      "`===` checks it's the **same** object",
      "Copy with `{ ...a }` or `[...a]`"
    ]}},
    points: [
      "Array: `const todos = ['Buy milk']`; read with `todos[0]`, size with `todos.length`, add with `push` (mutates).",
      "Object: `const item = { name: 'Tea', price: 3 }`; read with `item.name` or `item['name']` (use brackets for dynamic keys).",
      "`const` stops **reassigning** the variable, not changing the contents: `item.price = 4` still works.",
      "Two objects with the same contents are **not** `===`; only the same reference is.",
      "**In React:** React compares state by reference. Mutating then calling `setCart(cart)` passes the same reference, so React may skip the re-render. Always create a **new** array/object."
    ],
    code: { file: "reference.js", lang: "js", src: `// Primitives copy the value
let a = 5;
let b = a;
b = 6;
console.log(a, b);               // 5 6

// Objects copy the reference
const tea = { name: 'Tea', price: 3 };
const alias = tea;
alias.price = 4;
console.log(tea.price);          // 4 (same object!)

// Arrays too
const todos = ['Buy milk'];
const sameList = todos;
sameList.push('Walk dog');
console.log(todos.length);       // 2

// Make a real copy instead
const copy = { ...tea, price: 5 };
console.log(tea.price, copy.price);   // 4 5

// Equality checks the reference
console.log({ x: 1 } === { x: 1 });  // false
console.log(tea === alias);          // true

// Dynamic keys
const field = 'name';
console.log(tea[field]);            // Tea`, walk: [
      { lines: [2, 3, 4, 5], note: "Numbers are copied: changing `b` can't affect `a`." },
      { lines: [8, 9, 10, 11], note: "`alias` points at the same object, so editing it edits `tea`." },
      { lines: [14, 15, 16, 17], note: "Arrays behave the same: `push` through one name shows in both." },
      { lines: [20, 21], note: "Spread builds a **new** object: now changes are independent." },
      { lines: [24, 25], note: "`===` on objects asks \"same object?\", not \"same contents?\"." },
      { lines: [28, 29], note: "Bracket notation reads a key held in a variable." }
    ]},
    output: "5 6\n4\n2\n4 5\nfalse\ntrue\nTea",
    mistakes: [
      { bad: `cart.push(item);\nsetCart(cart);`, good: `setCart([...cart, item]);`, why: "Same array reference: React's `Object.is` check sees no change and may skip the update. Pass a new array." },
      { bad: `const copy = original;\ncopy.done = true;`, good: `const copy = { ...original, done: true };`, why: "Assignment copies the reference, so you just changed `original` as well." }
    ],
    practice: [
      { level: "B", q: "Create a `recipe` object with `title`, `minutes` and an `ingredients` array; log the second ingredient.", a: "`recipe.ingredients[1]`", code: `const recipe = { title: 'Pancakes', minutes: 15, ingredients: ['flour', 'milk', 'eggs'] };\nconsole.log(recipe.ingredients[1]); // milk` },
      { level: "B", q: "`const song = { title: 'A' }; song.title = 'B';` Is this allowed?", a: "Yes. `const` blocks reassigning `song`, not changing its properties." },
      { level: "I", q: "Read a property whose name is in `const key = 'price'`.", a: "`product[key]`. Dot notation would look for a property literally called `key`." },
      { level: "C", q: "`const copy = { ...user }; copy.address.city = 'Paris';` Does `user.address.city` change?", a: "Yes. Spread is a **shallow** copy; `address` is still shared. Copy it too: `{ ...user, address: { ...user.address, city: 'Paris' } }`." }
    ],
    quiz: [
      { q: "`const a = [1]; const b = a; b.push(2);` What is `a`?", options: ["[1]", "[1, 2]", "Error: a is const", "[2]"], answer: 1, why: "`a` and `b` reference the same array." },
      { q: "`{ id: 1 } === { id: 1 }` is?", options: ["true", "false"], answer: 1, why: "They are two different objects in memory; `===` compares references." },
      { q: "Why does `cart.push(x); setCart(cart)` often fail to update the UI?", options: ["push is async", "React sees the same reference and assumes nothing changed", "setCart needs a string", "Arrays can't be state"], answer: 1, why: "React compares with `Object.is`. Same reference means bail out." }
    ],
    rev: {
      sec30: "Arrays are ordered lists, objects are key/value bags. Primitives are copied by value; objects and arrays by reference, so two variables can point at one object. `const` prevents reassignment, not mutation. `===` compares references. React relies on this: update state with new arrays/objects so the reference changes.",
      interview: [
        { level: "basic", q: "Difference between dot and bracket notation?", a: "Dot needs a fixed, valid identifier (`item.name`). Brackets take any expression, so they work for dynamic keys or keys with spaces (`item[key]`)." },
        { level: "intermediate", q: "Explain pass by value vs by reference in JS.", a: "Primitives are copied. Objects are passed as a reference (a copy of the address), so mutations through any variable affect the same object." },
        { level: "intermediate", q: "Does `const` make an object immutable?", a: "No. It only stops reassigning the variable. Use `Object.freeze` for shallow immutability, or just treat data as immutable." },
        { level: "advanced", q: "Why does React care about references?", a: "React compares old and new state/props with `Object.is`. A new reference signals a change; mutating in place keeps the same reference and can skip renders or break memoisation." }
      ],
      predict: [
        { code: `const user = { name: 'Ana' };\nfunction rename(u) { u.name = 'Bo'; }\nrename(user);\nconsole.log(user.name);`, answer: "Bo", why: "The function received a reference to the same object and mutated it." }
      ],
      cheat: [
        "Array: `list[0]`, `list.length`; Object: `obj.key`, `obj[key]`",
        "Primitives by value, objects/arrays by reference",
        "`const` = can't reassign; contents can still change",
        "`===` on objects = same reference?",
        "Copy: `[...arr]`, `{ ...obj }` (shallow)",
        "React: new reference = change detected"
      ]
    },
    related: ["WEB-013", "WEB-024", "STATE-013", "STATE-016"]
  },

  "WEB-022": {
    tldr: "Array methods take a callback and do the loop for you: `map` transforms each item, `filter` keeps some, `find` gets the first match, `some`/`every` answer yes/no, `reduce` boils the list down to one value.",
    analogy: { icon: "🧺", text: "A fruit stall conveyor belt: `map` peels each fruit, `filter` drops the bruised ones, `find` grabs the first mango, `reduce` weighs the whole basket." },
    visual: { type: "flow", title: "Cart pipeline", steps: [
      { label: "cart (4 items)", detail: "`[{name, price, qty, inStock}, ...]`" },
      { label: "filter(inStock)", detail: "Keeps 3 items. Returns a **new** array." },
      { label: "map(lineTotal)", detail: "Turns each item into `price * qty`: `[6, 3, 8]`." },
      { label: "reduce(sum, 0)", detail: "Adds them into one number: `17`." },
      { label: "some / every / find", detail: "`some(i => i.price > 5)` -> true; `find(i => i.name === 'Tea')` -> item or `undefined`." }
    ]},
    points: [
      "`map(fn)`: same length, each item transformed. **The** way to render lists in React: `items.map(i => <li key={i.id}>{i.name}</li>)`.",
      "`filter(fn)`: keeps items where `fn` returns truthy. Used for search boxes and deleting from state.",
      "`find(fn)` returns the **first** matching item (or `undefined`); `findIndex` returns its index (or -1).",
      "`some(fn)` = at least one match; `every(fn)` = all match. Both return booleans and stop early.",
      "`reduce((acc, item) => ..., start)` builds one value (total, count, grouped object). Always pass the start value.",
      "None of these change the original array: perfect for immutable React state. (`sort` and `reverse` **do** mutate; use `toSorted()`.)"
    ],
    code: { file: "cart.js", lang: "js", src: `const cart = [
  { id: 1, name: 'Apples', price: 2, qty: 3, inStock: true },
  { id: 2, name: 'Tea', price: 3, qty: 1, inStock: true },
  { id: 3, name: 'Cheese', price: 4, qty: 2, inStock: true },
  { id: 4, name: 'Bread', price: 3, qty: 1, inStock: false },
];

const available = cart.filter(item => item.inStock);
const lineTotals = available.map(item => item.price * item.qty);
const total = lineTotals.reduce((sum, n) => sum + n, 0);
console.log(lineTotals, total);        // [6, 3, 8] 17

const tea = cart.find(item => item.name === 'Tea');
console.log(tea.id);                    // 2
console.log(cart.some(i => !i.inStock));   // true
console.log(cart.every(i => i.price > 1)); // true

// Chain it in one go
const names = cart
  .filter(i => i.inStock)
  .map(i => i.name.toUpperCase());
console.log(names);

// In React: map -> list of elements, filter -> remove
// <ul>{cart.map(i => <li key={i.id}>{i.name}</li>)}</ul>
// setCart(cart.filter(i => i.id !== idToRemove));`, walk: [
      { lines: [8], note: "`filter` keeps items where the callback returns `true`." },
      { lines: [9], note: "`map` returns a new array of the same length, one result per item." },
      { lines: [10], note: "`reduce` carries `sum` along; `0` is the starting value." },
      { lines: [13, 14], note: "`find` stops at the first match and returns the item itself." },
      { lines: [15, 16], note: "`some` / `every` return booleans." },
      { lines: [25, 26], note: "The two React idioms: render with `map` (plus `key`), delete with `filter`." }
    ]},
    output: "[ 6, 3, 8 ] 17\n2\ntrue\ntrue\n[ 'APPLES', 'TEA', 'CHEESE' ]",
    mistakes: [
      { bad: `items.map(item => {\n  <li>{item.name}</li>;\n})`, good: `items.map(item => (\n  <li key={item.id}>{item.name}</li>\n))`, why: "Braces without `return` give `undefined` for every item. Use `()` for an implicit return, and add a `key`." },
      { bad: `const total = cart.reduce((sum, i) => sum + i.price);`, good: `const total = cart.reduce((sum, i) => sum + i.price, 0);`, why: "Without a start value, the first **item object** becomes `sum`, giving `'[object Object]3...'`; on an empty array it throws." },
      { bad: `const sorted = todos.sort(byDate); // mutates state!`, good: `const sorted = todos.toSorted(byDate); // or [...todos].sort(byDate)`, why: "`sort` changes the original array in place, which mutates React state." }
    ],
    practice: [
      { level: "B", q: "Turn `[1, 2, 3]` prices into strings like `'£1.00'`.", a: "`prices.map(p => '£' + p.toFixed(2))`" },
      { level: "B", q: "Keep only todos that aren't done.", a: "`todos.filter(t => !t.done)`" },
      { level: "I", q: "Count how many songs in a playlist are longer than 4 minutes, using `reduce`.", a: "Add 1 when the condition holds.", code: `const longCount = songs.reduce((n, s) => s.minutes > 4 ? n + 1 : n, 0);` },
      { level: "I", q: "Is there **any** message in a chat that's unread?", a: "`messages.some(m => !m.read)`" },
      { level: "C", q: "Group recipes by `category` into an object `{ dessert: [...], main: [...] }`.", a: "Use `reduce` with `{}` as the start value (or `Object.groupBy` in modern runtimes).", code: `const byCat = recipes.reduce((acc, r) => {\n  (acc[r.category] ??= []).push(r);\n  return acc;\n}, {});` }
    ],
    quiz: [
      { q: "What does `find` return when nothing matches?", options: ["-1", "null", "undefined", "An empty array"], answer: 2, why: "`find` returns `undefined`; `findIndex` returns -1; `filter` returns `[]`." },
      { q: "Which method do you use to render a list of items in React?", options: ["forEach", "map", "reduce", "some"], answer: 1, why: "`map` returns a new array of JSX elements; `forEach` returns `undefined`." },
      { q: "Which of these mutates the original array?", options: ["map", "filter", "sort", "toSorted"], answer: 2, why: "`sort` (and `reverse`, `push`, `splice`) mutate in place." }
    ],
    rev: {
      sec30: "`map` transforms (same length), `filter` selects (shorter or equal), `find` returns the first match or `undefined`, `some`/`every` return booleans, `reduce` folds to one value with an accumulator and start value. They return new values and don't mutate, which is exactly what React state needs. `map` + `key` renders lists; `filter` removes items.",
      interview: [
        { level: "basic", q: "`map` vs `forEach`?", a: "`map` returns a new array of results; `forEach` returns `undefined` and is for side effects. In JSX you need `map`." },
        { level: "intermediate", q: "`find` vs `filter`?", a: "`find` returns the first matching item (or `undefined`) and stops early; `filter` returns an array of all matches." },
        { level: "intermediate", q: "Why always pass an initial value to `reduce`?", a: "Without it the first element is the accumulator, which breaks when items are objects and throws on an empty array." },
        { level: "advanced", q: "Why are these methods a good fit for React?", a: "They're non-mutating and return new arrays, so state updates create new references React can detect, and they're expressions usable inside JSX." },
        { level: "tricky", q: "What does `[1, 2, 3].map(parseInt)` return?", a: "`[1, NaN, NaN]`. `map` passes `(value, index)`, so `parseInt('2', 1)` and `parseInt('3', 2)` are invalid. Use `map(Number)` or an arrow." }
      ],
      predict: [
        { code: `const r = [5, 10, 15]\n  .filter(n => n > 5)\n  .map(n => n / 5)\n  .reduce((a, b) => a + b, 0);\nconsole.log(r);`, answer: "5", why: "filter -> [10, 15], map -> [2, 3], reduce -> 5." }
      ],
      cheat: [
        "`map`: transform, same length",
        "`filter`: keep matches, new array",
        "`find`: first match or `undefined`",
        "`some` / `every`: boolean, stop early",
        "`reduce((acc, x) => ..., start)`: one value; always give `start`",
        "Non-mutating; `sort`/`reverse` mutate -> use `toSorted()`",
        "React: `list.map(x => <li key={x.id}>...)`"
      ]
    },
    related: ["WEB-021", "WEB-017", "COND-008", "COND-009"]
  },

  "WEB-023": {
    tldr: "Destructuring unpacks values from arrays and objects into variables in one line: `const { name, price } = item` or `const [first, second] = list`. You can rename, set defaults and reach into nested data.",
    analogy: { icon: "📦", text: "Unpacking a grocery delivery: instead of saying \"the bag's milk, the bag's eggs\", you take out milk and eggs and put each straight on its own shelf." },
    visual: { type: "flow", title: "Unpacking a weather reply", steps: [
      { label: "The object", detail: "`{ city: 'Leeds', temp: 14, wind: { speed: 20 } }`" },
      { label: "Pick by name", detail: "`const { city, temp } = data` -> two variables." },
      { label: "Rename", detail: "`{ temp: celsius }` stores `temp` as `celsius`." },
      { label: "Default", detail: "`{ rain = 0 }` uses 0 when `rain` is `undefined`." },
      { label: "Nested", detail: "`{ wind: { speed } }` reaches inside `wind`." }
    ]},
    points: [
      "**Objects** match by **name**: `const { title, done } = todo`. Order doesn't matter.",
      "**Arrays** match by **position**: `const [first, , third] = songs`. Skip with an empty slot.",
      "Rename with a colon `{ price: cost }`; default with `=` `{ qty = 1 }` (only for `undefined`).",
      "Collect the leftovers with rest: `const { id, ...rest } = item`.",
      "Works in **function parameters**: `function Card({ title, price = 0 })`.",
      "**In React:** `const [count, setCount] = useState(0)` is array destructuring; `function Item({ name })` is object destructuring of props."
    ],
    code: { file: "destructuring.js", lang: "js", src: `const weather = {
  city: 'Leeds',
  temp: 14,
  wind: { speed: 20, dir: 'NW' },
};

// Object: by name, with rename, default and nested
const { city, temp: celsius, rain = 0, wind: { speed } } = weather;
console.log(city, celsius, rain, speed);   // Leeds 14 0 20

// Array: by position, with a skip
const playlist = ['Intro', 'Hit Song', 'Outro'];
const [opener, , closer] = playlist;
console.log(opener, closer);               // Intro Outro

// Swap two values
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);                         // 2 1

// Parameters (just like React props)
function ProductCard({ name, price = 0, tags: [mainTag] = [] }) {
  return \`\${name} £\${price} #\${mainTag ?? 'none'}\`;
}
console.log(ProductCard({ name: 'Tea', price: 3, tags: ['hot'] }));
console.log(ProductCard({ name: 'Water' }));

// Same shape as useState
const fakeUseState = init => [init, () => {}];
const [count, setCount] = fakeUseState(0);
console.log(count, typeof setCount);`, walk: [
      { lines: [8], note: "One line: pick `city`, rename `temp` to `celsius`, default `rain`, reach into `wind`." },
      { lines: [13], note: "Arrays go by position; the empty slot skips `'Hit Song'`." },
      { lines: [18], note: "Destructuring a fresh array swaps values without a temp variable." },
      { lines: [22, 23], note: "Destructure right in the parameter list, with defaults: exactly how components read props." },
      { lines: [29, 30], note: "`useState` returns a 2-item array; you name the parts whatever you like." }
    ]},
    output: "Leeds 14 0 20\nIntro Outro\n2 1\nTea £3 #hot\nWater £0 #none\n0 function",
    mistakes: [
      { bad: `function Card(name, price) {\n  return <p>{name}</p>;\n}`, good: `function Card({ name, price }) {\n  return <p>{name}</p>;\n}`, why: "React passes **one** props object. Without braces, `name` is the whole props object." },
      { bad: `const { address: { city } } = user; // user.address is undefined`, good: `const { address: { city } = {} } = user;\n// or: const city = user.address?.city;`, why: "Destructuring a nested `undefined` throws a TypeError. Add a default `{}` or use optional chaining." }
    ],
    practice: [
      { level: "B", q: "Pull `title` and `minutes` out of a `recipe` object.", a: "`const { title, minutes } = recipe;`" },
      { level: "B", q: "Get the first two items of `todos` into `first` and `second`.", a: "`const [first, second] = todos;`" },
      { level: "I", q: "Rename `id` to `todoId` and default `done` to `false`.", a: "`const { id: todoId, done = false } = todo;`" },
      { level: "C", q: "Write a component `Message({ user: { name }, text, time = 'now' })` and call it as a function with a sample object.", a: "Nested destructuring in the parameter.", code: `function Message({ user: { name }, text, time = 'now' }) {\n  return \`\${name} (\${time}): \${text}\`;\n}\nMessage({ user: { name: 'Sam' }, text: 'Hi' }); // 'Sam (now): Hi'` }
    ],
    quiz: [
      { q: "Object destructuring matches by...", options: ["Position", "Property name", "Type", "Alphabetical order"], answer: 1, why: "Objects match by key; arrays match by position." },
      { q: "`const { qty = 1 } = { qty: null };` What is `qty`?", options: ["1", "null", "undefined", "Error"], answer: 1, why: "Defaults apply only when the value is `undefined`, not `null`." },
      { q: "Why can you name `useState`'s results anything you like?", options: ["React reads variable names", "It returns an array, which destructures by position", "It returns an object with any keys", "It's special syntax"], answer: 1, why: "Array destructuring ignores names and goes by order." }
    ],
    rev: {
      sec30: "Destructuring unpacks arrays (by position) and objects (by name) into variables. Rename with `:`, default with `=` (only for `undefined`), nest with patterns, collect leftovers with `...rest`. It works in parameters, which is how components read props, and `useState` returns an array you destructure as `[value, setValue]`.",
      interview: [
        { level: "basic", q: "Array vs object destructuring?", a: "Arrays unpack by position, objects by property name. That's why `useState` returns an array: you choose the names." },
        { level: "intermediate", q: "How do you rename and default at once?", a: "`const { price: cost = 0 } = item;` reads `price`, stores it as `cost`, uses 0 if it's `undefined`." },
        { level: "intermediate", q: "When does a destructuring default apply?", a: "Only when the value is `undefined`. `null`, `0` or `''` are kept." },
        { level: "tricky", q: "What happens with `const { a: { b } } = {}`?", a: "TypeError: it tries to read `b` from `undefined`. Give the nested pattern a default: `{ a: { b } = {} }`." }
      ],
      predict: [
        { code: `const [x = 1, y = 2] = [undefined, null];\nconsole.log(x, y);`, answer: "1 null", why: "Default kicks in for `undefined` only." }
      ],
      cheat: [
        "`const { a, b } = obj` (by name)",
        "`const [x, y] = arr` (by position); skip with `[, y]`",
        "Rename: `{ a: alias }`; default: `{ a = 1 }`",
        "Nested: `{ wind: { speed } }`",
        "Rest: `const { id, ...rest } = obj`",
        "Props: `function Card({ title, price = 0 })`",
        "`const [v, setV] = useState()` is array destructuring"
      ]
    },
    related: ["WEB-024", "PROPS-005", "HOOKS-004", "WEB-021"]
  },

  "WEB-024": {
    tldr: "The same `...` does two jobs. **Spread** expands an array or object into a new one (copy and merge without mutating). **Rest** collects the remaining items into an array or object.",
    analogy: { icon: "🃏", text: "Spread is tipping a deck of cards onto a new table (copying them out). Rest is sweeping whatever's left on the table into one pile." },
    visual: { type: "compare", title: "One `...`, two jobs", left: { label: "Spread: expand", tone: "good", points: [
      "On the **right** of `=` or in a call",
      "`[...cart, newItem]` new array",
      "`{ ...todo, done: true }` copy + override",
      "`Math.max(...prices)` array -> arguments"
    ]}, right: { label: "Rest: collect", tone: "neutral", points: [
      "On the **left** of `=` or in parameters",
      "`const [first, ...others] = songs`",
      "`const { id, ...data } = item`",
      "`function sum(...nums)` any number of args"
    ]}},
    points: [
      "**Spread makes new arrays/objects**: the original stays untouched. This is the backbone of immutable updates.",
      "Later keys win: `{ ...item, qty: 2 }` copies `item` then overrides `qty`. Order matters.",
      "Spread is **shallow**: nested objects are still shared. Spread each level you change.",
      "**Rest** must be last: `(a, ...rest)` works, `(...rest, a)` doesn't.",
      "Rest parameters replace the old `arguments` object and give a real array.",
      "**In React:** `setTodos([...todos, newTodo])`, `setForm({ ...form, [name]: value })`, and `{...props}` to forward props."
    ],
    code: { file: "spread-rest.js", lang: "js", src: `const todos = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mum', done: false },
];

// Spread: add without mutating
const added = [...todos, { id: 3, text: 'Gym', done: false }];

// Spread: update one item immutably
const toggled = todos.map(t =>
  t.id === 2 ? { ...t, done: true } : t
);
console.log(todos[1].done, toggled[1].done);   // false true
console.log(added.length, todos.length);       // 3 2

// Merge objects: later keys win
const defaults = { theme: 'light', font: 14 };
const prefs = { ...defaults, theme: 'dark' };
console.log(prefs);

// Rest: collect what's left
const [current, ...upNext] = ['Song A', 'Song B', 'Song C'];
console.log(current, upNext);

const { id, ...fields } = todos[0];
console.log(id, fields);

// Rest parameters + spread arguments
function total(...prices) {
  return prices.reduce((sum, p) => sum + p, 0);
}
const basket = [3, 4, 5];
console.log(total(...basket), Math.max(...basket));`, walk: [
      { lines: [7], note: "Spread the old items into a new array, then add one: `todos` is unchanged." },
      { lines: [10, 11, 12], note: "The classic React update: copy the matching item with one field changed, keep others." },
      { lines: [18], note: "Copy `defaults`, then `theme: 'dark'` overrides because it comes later." },
      { lines: [22, 25], note: "Rest on the left side gathers the remaining items/properties." },
      { lines: [29, 33], note: "`...prices` collects arguments; `...basket` spreads an array into arguments." }
    ]},
    output: "false true\n3 2\n{ theme: 'dark', font: 14 }\nSong A [ 'Song B', 'Song C' ]\n1 { text: 'Buy milk', done: false }\n12 5",
    mistakes: [
      { bad: `const next = { theme: 'dark', ...prefs };`, good: `const next = { ...prefs, theme: 'dark' };`, why: "Later keys win. Putting the spread last overwrites your new `theme` with the old one." },
      { bad: `const copy = { ...user };\ncopy.address.city = 'Paris'; // changes user too`, good: `const copy = { ...user, address: { ...user.address, city: 'Paris' } };`, why: "Spread is shallow. Nested objects are still shared, so spread every level you change." }
    ],
    practice: [
      { level: "B", q: "Remove the first song from a playlist **without** mutating it.", a: "`const [, ...rest] = playlist;` or `playlist.slice(1)`." },
      { level: "B", q: "Merge `{ name: 'Tea' }` and `{ price: 3 }` into one new object.", a: "`const item = { ...a, ...b };`" },
      { level: "I", q: "Update a form state object when an input with `name=\"email\"` changes.", a: "Computed key with spread.", code: `setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));` },
      { level: "C", q: "Write `logChat(user, ...messages)` that prints `user: msg` for each message.", a: "Rest collects all messages after the first argument.", code: `function logChat(user, ...messages) {\n  messages.forEach(m => console.log(\`\${user}: \${m}\`));\n}\nlogChat('Sam', 'Hi', 'You there?');` }
    ],
    quiz: [
      { q: "`{ ...{ a: 1, b: 2 }, b: 3 }` gives?", options: ["{ a: 1, b: 2 }", "{ a: 1, b: 3 }", "{ b: 3 }", "Error"], answer: 1, why: "Spread copies, then the later `b: 3` overrides." },
      { q: "Where is `...` acting as **rest**?", options: ["`[...a, 4]`", "`fn(...args)`", "`function f(...args) {}`", "`{ ...obj }`"], answer: 2, why: "In a parameter list (or the left side of destructuring) it collects; elsewhere it spreads." },
      { q: "`const b = { ...a }; b.inner.x = 9;` Does `a.inner.x` change?", options: ["Yes, spread is shallow", "No, spread is deep"], answer: 0, why: "Only the top level is copied; `inner` is the same object in both." }
    ],
    rev: {
      sec30: "`...` spreads (expands) on the right side or in calls, and collects (rest) on the left side or in parameters. Spread creates new arrays/objects, so it's how you update React state immutably; later keys override earlier ones. It's shallow, so copy each nested level you change. Rest must be last and gives a real array.",
      interview: [
        { level: "basic", q: "Spread vs rest?", a: "Same syntax, opposite jobs. Spread expands an iterable/object into a new one or into arguments; rest gathers remaining items into an array or object." },
        { level: "intermediate", q: "How do you update one item in an array of objects in React state?", a: "`setItems(items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i))` creates a new array and a new object only for the changed item." },
        { level: "advanced", q: "Is spread a deep copy?", a: "No, shallow. Nested objects stay shared. For deep copies use `structuredClone`, or better, spread only the path you change." },
        { level: "tricky", q: "What does `[...'hi']` produce?", a: "`['h', 'i']`. Strings are iterable, so spread splits them into characters." }
      ],
      predict: [
        { code: `const a = [1, 2];\nconst b = [...a, ...a];\nb[0] = 9;\nconsole.log(a, b.length);`, answer: "[1, 2] 4", why: "`b` is a new array; changing it doesn't affect `a`." }
      ],
      cheat: [
        "Spread (expand): `[...arr, x]`, `{ ...obj, k: v }`, `fn(...args)`",
        "Rest (collect): `const [a, ...r] = arr`, `function f(...args)`",
        "Later keys win: put overrides after the spread",
        "Shallow copy only: spread each nested level",
        "Rest must be the last element",
        "React: `setList([...list, item])`, `setObj({ ...obj, key: v })`"
      ]
    },
    related: ["WEB-023", "WEB-021", "STATE-013", "STATE-014"]
  },

  "WEB-025": {
    tldr: "Template literals are strings in backticks. Drop any expression in with `\${...}` and write across several lines without `\\n` or `+`.",
    analogy: { icon: "✉️", text: "A greeting-card template: \"Happy birthday, ___!\". You fill in the blank with any name (or a calculation) and the card keeps its line breaks." },
    visual: { type: "compare", title: "Building a receipt line", left: { label: "Concatenation", tone: "bad", points: [
      "`'Total: £' + (price * qty) + ' for ' + qty`",
      "Easy to miss a space or a `+`",
      "Multi-line needs `'\\n' +` everywhere"
    ]}, right: { label: "Template literal", tone: "good", points: [
      "`Total: £${price * qty} for ${qty}` (inside backticks)",
      "Reads like the final text",
      "Line breaks are kept as written",
      "Any expression inside `\${}`"
    ]}},
    points: [
      "Wrap the string in **backticks** (the key left of 1), not quotes. `${expr}` inserts the result of any expression.",
      "Calls and ternaries work too: `${n} item${n === 1 ? '' : 's'}` gives \"1 item\" or \"3 items\".",
      "Newlines and indentation inside the backticks are part of the string.",
      "Objects interpolate as `[object Object]`; pick fields or use `JSON.stringify`.",
      "**In React:** JSX text uses `{}`, but template literals build class names and URLs: a `className` like `btn ${active ? 'on' : ''}`, or a fetch path `/api/items/${id}`."
    ],
    code: { file: "receipt.js", lang: "js", src: `const order = {
  id: 'A42',
  customer: 'Sam',
  items: [
    { name: 'Latte', price: 3.2, qty: 2 },
    { name: 'Muffin', price: 2.5, qty: 1 },
  ],
};

const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);
const count = order.items.length;

const receipt = \`Order \${order.id} for \${order.customer}
\${order.items.map(i => \`- \${i.qty} x \${i.name}\`).join('\\n')}
\${count} item\${count === 1 ? '' : 's'}, total £\${total.toFixed(2)}\`;

console.log(receipt);

// Everyday React-style uses
const active = true;
const className = \`tab \${active ? 'tab--active' : ''}\`.trim();
const url = \`/api/orders/\${encodeURIComponent(order.id)}\`;
console.log(className, url);

// Objects don't print nicely on their own
console.log(\`\${order.items[0]}\`, \`\${JSON.stringify(order.items[0])}\`);`, walk: [
      { lines: [13], note: "Backticks start the string; `\${...}` drops in values." },
      { lines: [14], note: "A nested template inside `map` builds each line; `join` glues them with newlines." },
      { lines: [15], note: "A ternary inside `\${}` handles \"item\" vs \"items\"; `toFixed(2)` formats money." },
      { lines: [21, 22], note: "Typical React uses: a dynamic class name and an API URL built from an id." },
      { lines: [26], note: "An object becomes `[object Object]`; stringify it if you need to show it." }
    ]},
    output: "Order A42 for Sam\n- 2 x Latte\n- 1 x Muffin\n2 items, total £8.90\ntab tab--active /api/orders/A42\n[object Object] {\"name\":\"Latte\",\"price\":3.2,\"qty\":2}",
    mistakes: [
      { bad: `const msg = 'Hello \${name}';`, good: `const msg = \`Hello \${name}\`;`, why: "`\${}` only works inside backticks. In normal quotes it's just literal text." },
      { bad: `const label = \`Cart: \${cart}\`; // 'Cart: [object Object]'`, good: `const label = \`Cart: \${cart.length} items\`;`, why: "Objects and arrays of objects don't turn into useful text. Interpolate the field you mean." }
    ],
    practice: [
      { level: "B", q: "Build `\"It's 18°C in Paris\"` from `temp` and `city`.", a: "Backticks with two placeholders.", code: `const line = \`It's \${temp}°C in \${city}\`;` },
      { level: "B", q: "Print a two-line note without `\\n`.", a: "Press Enter inside the backticks; the line break is kept." },
      { level: "I", q: "Show `\"1 song\"` or `\"3 songs\"` depending on `n`.", a: "Inside backticks: `${n} song${n === 1 ? '' : 's'}`", code: `const label = \`\${n} song\${n === 1 ? '' : 's'}\`;` },
      { level: "C", q: "In React, build a className that always has `card`, adds `card--sold-out` if `stock === 0`.", a: "Template literal with a ternary (or a helper like `clsx`).", code: `<div className={\`card \${stock === 0 ? 'card--sold-out' : ''}\`}>` }
    ],
    quiz: [
      { q: "Which one inserts `name` correctly?", options: ["'Hi ${name}' in single quotes", "\"Hi ${name}\" in double quotes", "Hi ${name} wrapped in backticks", "Hi {name} wrapped in backticks"], answer: 2, why: "Interpolation needs both: backticks **and** `${}`. Quotes treat `${}` as plain text; `{}` alone is JSX syntax." },
      { q: "What can go inside `\${}`?", options: ["Only variables", "Any expression", "Only strings", "Statements like `if`"], answer: 1, why: "Any expression: calls, maths, ternaries. Not statements." },
      { q: "A template literal containing `${{ a: 1 }}` produces?", options: ["{ a: 1 }", "[object Object]", "a: 1", "Error"], answer: 1, why: "Objects use their default `toString()`." }
    ],
    rev: {
      sec30: "Template literals use backticks. `\${expr}` interpolates any expression, and line breaks are kept. They replace messy `+` concatenation. Objects interpolate as `[object Object]`. In React you use them for dynamic class names, URLs and keys; text inside JSX uses `{}` instead.",
      interview: [
        { level: "basic", q: "What are template literals?", a: "Backtick strings that support `\${}` interpolation of any expression and real multi-line text." },
        { level: "intermediate", q: "Where do you use them in React code?", a: "Dynamic `className`s, fetch URLs like `/api/items/${id}`, composite keys, and CSS-in-JS. Plain JSX text uses `{}`." },
        { level: "intermediate", q: "What happens when you interpolate an array?", a: "It's converted with `toString()`, joining items with commas: `${[1, 2]}` becomes `1,2`." },
        { level: "advanced", q: "What is a tagged template?", a: "A function name placed right before the opening backtick, like styled-components' `styled.button`. The function receives the string parts and the values separately." }
      ],
      predict: [
        { code: `const n = 2;\nconsole.log(\`\${n} + \${n} = \${n + n}\`);`, answer: "2 + 2 = 4", why: "Each `\${}` is evaluated separately; the `+` outside them is plain text." }
      ],
      cheat: [
        "Backticks + `${}`: Hi ${name} -> Hi Sam",
        "`\${}` takes any expression (not statements)",
        "Multi-line strings keep their line breaks",
        "Objects -> `[object Object]`; arrays -> `'a,b'`",
        "React: dynamic `className` and fetch URLs (`/api/items/${id}`)",
        "Tagged templates: a function before the backtick (styled-components)"
      ]
    },
    related: ["WEB-013", "STYLE-011", "JSX-006", "WEB-022"]
  },

  "WEB-026": {
    tldr: "An ES module is a JS file with its own private scope. Nothing leaks out unless you `export` it, and nothing comes in unless you `import` it. Because imports are fixed and declared up front, tools like Vite can see your whole app's dependency graph.",
    analogy: { icon: "🍱", text: "Each module is a sealed lunchbox. What's inside stays inside, except the items you put on the label (exports) for others to take." },
    visual: { type: "tree", title: "The graph Vite reads from your imports", root: { label: "main.jsx", note: "entry point", children: [
      { label: "react-dom/client", note: "from node_modules" },
      { label: "App.jsx", children: [
        { label: "Cart.jsx", children: [
          { label: "cart.js", note: "addItem, total" },
          { label: "format.js", note: "money()" }
        ]},
        { label: "Header.jsx", children: [ { label: "format.js", note: "same module, loaded once" } ] }
      ]}
    ]}},
    points: [
      "**Module scope**: top-level variables in a module are private to that file, not globals.",
      "Imports and exports are **static** (top level, fixed names), so tools know the dependency graph **before** running anything.",
      "That's what lets bundlers do **tree shaking** (drop unused exports) and **code splitting**.",
      "A module runs **once**, the first time it's imported; every importer shares the same instance.",
      "Modules run in **strict mode** automatically, and top-level `this` is `undefined`.",
      "In the browser: `<script type=\"module\">`. In Vite every file in `src` is an ES module; **in React** each component file is one."
    ],
    code: { file: "cart.js + main.js", lang: "js", src: `// ---- cart.js ----
let items = [];                     // private to this module
const TAX = 0.2;                    // not visible elsewhere

export function addItem(name, price) {
  items = [...items, { name, price }];
}

export function total() {
  const sum = items.reduce((s, i) => s + i.price, 0);
  return sum * (1 + TAX);
}

console.log('cart.js ran');          // logs once, however many imports

// ---- main.js ----
import { addItem, total } from './cart.js';

addItem('Tea', 3);
addItem('Cake', 2);
console.log(total());                // 6
console.log(typeof items);           // 'undefined': private
console.log(typeof TAX);             // 'undefined'

// ---- index.html ----
// <script type="module" src="/main.js"></script>`, walk: [
      { lines: [2, 3], note: "Top-level names in a module are private: no `window.items`, no clashes with other files." },
      { lines: [5, 9], note: "`export` puts a name on the label; only these are reachable from outside." },
      { lines: [14], note: "Module code runs once on first import; later imports reuse the same instance." },
      { lines: [17], note: "A static import at the top: the bundler sees this edge without running code." },
      { lines: [22, 23], note: "Unexported names simply don't exist in other modules." },
      { lines: [26], note: "`type=\"module\"` opts a browser script into module rules (Vite's `index.html` does this)." }
    ]},
    output: "cart.js ran\n6\nundefined\nundefined",
    mistakes: [
      { bad: `<script src="main.js"></script>\n<!-- main.js uses import -->`, good: `<script type="module" src="main.js"></script>`, why: "A classic script can't use `import`; you get \"Cannot use import statement outside a module\"." },
      { bad: `if (isAdmin) {\n  import { report } from './admin.js';\n}`, good: `import { report } from './admin.js';\n// or load on demand:\nconst { report } = await import('./admin.js');`, why: "Static `import` must be at the top level. For conditional loading use dynamic `import()`, which returns a promise." }
    ],
    practice: [
      { level: "B", q: "Two modules both declare `const count = 0` at the top. Is that a conflict?", a: "No. Each module has its own scope." },
      { level: "B", q: "How do you make a browser script an ES module?", a: "`<script type=\"module\" src=\"app.js\"></script>`." },
      { level: "I", q: "`format.js` is imported by three components. How many times does its top-level code run?", a: "Once. Modules are evaluated a single time and cached." },
      { level: "C", q: "Why can't a bundler tree-shake code that uses `require(someVariable)`?", a: "The dependency is computed at runtime, so the tool can't know which module or exports are used. Static `import` names are known ahead of time." }
    ],
    quiz: [
      { q: "A top-level `let x` in a module is...", options: ["A global on `window`", "Private to that module", "Shared with every module", "Undefined until exported"], answer: 1, why: "Modules have their own scope; only exports are visible outside." },
      { q: "Why do bundlers rely on ES modules?", options: ["They're faster to type", "Imports/exports are static, so the dependency graph is known before running", "They run in parallel threads", "They avoid JSON"], answer: 1, why: "Static structure enables graph building, tree shaking and code splitting." },
      { q: "A module is imported by 5 files. Its top-level code runs...", options: ["5 times", "Once", "Never", "Once per render"], answer: 1, why: "ES modules are singletons: evaluated once, then cached." }
    ],
    rev: {
      sec30: "ES modules give each file its own scope; only `export`ed names are shared, via `import`. Imports are static and top-level, so tools know the dependency graph ahead of time: that's how Vite serves modules in dev and, in v8, bundles with Rolldown to tree-shake and code-split for production. Modules run once, are strict by default, and load in browsers with `type=\"module\"`.",
      interview: [
        { level: "basic", q: "What is module scope?", a: "Each ES module file has its own top-level scope. Its variables aren't global; other files only see what it exports." },
        { level: "intermediate", q: "ES modules vs CommonJS?", a: "ESM uses static `import`/`export`, is async-loadable and standard in browsers. CommonJS (`require`, `module.exports`) is dynamic and synchronous, Node's original format." },
        { level: "advanced", q: "What is tree shaking and why does it need ESM?", a: "Removing unused exports from the production bundle. It needs static imports so the bundler can prove which exports are never used." },
        { level: "tricky", q: "Two components import the same module that keeps a `let count`. Do they share it?", a: "Yes. A module is evaluated once, so module-level variables are shared app-wide (a simple singleton), unlike React state which is per component." }
      ],
      compare: { cols: ["", "ES modules", "CommonJS"], rows: [
        ["Syntax", "`import` / `export`", "`require` / `module.exports`"],
        ["Structure", "Static (top level)", "Dynamic (anywhere)"],
        ["Tree shaking", "Yes", "Hard / limited"],
        ["Browser native", "Yes (`type=\"module\"`)", "No"]
      ]},
      cheat: [
        "Each module = its own scope; nothing is global",
        "Only `export`ed names leave the file",
        "Static imports -> known dependency graph",
        "Enables tree shaking and code splitting",
        "Runs once, cached, shared by all importers",
        "Strict mode by default; top-level `this` is `undefined`",
        "Browser: `<script type=\"module\">`"
      ]
    },
    related: ["WEB-027", "WEB-018", "ENV-004", "PERF-011"]
  },

  "WEB-027": {
    tldr: "Named exports share several things by name (`export function total`), a default export is the file's one main thing (`export default App`), and a namespace import grabs everything as one object (`import * as api`).",
    analogy: { icon: "🏪", text: "A bakery: the shop sign is the default export (the bakery itself); the menu items are named exports you ask for by exact name. A namespace import is taking the whole menu." },
    visual: { type: "compare", title: "Named vs default", left: { label: "Named export", tone: "neutral", points: [
      "`export function money() {}`",
      "Import with **braces** and the **exact name**",
      "`import { money } from './format.js'`",
      "Many per file; rename with `as`"
    ]}, right: { label: "Default export", tone: "neutral", points: [
      "`export default function App() {}`",
      "Import **without braces**, any name",
      "`import App from './App.jsx'`",
      "At most one per file"
    ]}},
    points: [
      "Named: `import { a, b } from './x.js'`. The names must match; rename with `{ a as b }`.",
      "Default: `import Anything from './x.js'`. You choose the local name.",
      "Mix them: `import Cart, { money } from './Cart.jsx'` (default first, then braces).",
      "Namespace: `import * as cart from './cart.js'` gives `cart.add`, `cart.total`.",
      "Re-export from an index: `export { Button } from './Button.jsx'` makes clean import paths.",
      "**In React:** hooks are named (`import { useState } from 'react'`); components are often default; React Router 7: `import { Link } from 'react-router'`."
    ],
    code: { file: "imports.jsx", lang: "jsx", src: `// ---- format.js : named exports ----
export function money(n) {
  return '£' + n.toFixed(2);
}
export const CURRENCY = 'GBP';

// ---- ProductCard.jsx : one default export ----
import { money } from './format.js';

export default function ProductCard({ name, price }) {
  return <p>{name}: {money(price)}</p>;
}

// ---- api.js : functions to group ----
export const getProducts = () => fetch('/api/products');
export const getProduct = id => fetch('/api/products/' + id);

// ---- App.jsx : all three import styles ----
import { useState } from 'react';            // named
import Card from './ProductCard.jsx';        // default, any name
import * as api from './api.js';             // namespace
import { money as fmt, CURRENCY } from './format.js'; // rename

export default function App() {
  const [price] = useState(3.5);
  return (
    <>
      <Card name="Tea" price={price} />
      <small>{fmt(10)} ({CURRENCY})</small>
      <button onClick={() => api.getProducts()}>Reload</button>
    </>
  );
}`, walk: [
      { lines: [2, 5], note: "Named exports: any number per file, each with a fixed name." },
      { lines: [10], note: "One default export: the main thing this file provides." },
      { lines: [19], note: "Named import from a package: braces, exact name." },
      { lines: [20], note: "Default import: no braces; `Card` is our own name for it." },
      { lines: [21, 30], note: "Namespace import: everything exported by `api.js` on one object." },
      { lines: [22], note: "`as` renames a named import locally to avoid clashes." }
    ]},
    output: "Renders \"Tea: £3.50\", \"£10.00 (GBP)\" and a Reload button that calls `api.getProducts()`.",
    mistakes: [
      { bad: `// Cart.jsx: export default function Cart() {}\nimport { Cart } from './Cart.jsx';`, good: `import Cart from './Cart.jsx';`, why: "Braces ask for a **named** export called `Cart`. A default export is imported without braces." },
      { bad: `// format.js: export function money() {}\nimport money from './format.js';`, good: `import { money } from './format.js';`, why: "There's no default export, so the default import fails (\"does not provide an export named 'default'\")." },
      { bad: `import Cart from 'Cart.jsx';`, good: `import Cart from './Cart.jsx';`, why: "Without `./` the path is treated as a **package** name in `node_modules`. Your own files need a relative path." }
    ],
    practice: [
      { level: "B", q: "Import `useState` and `useEffect` from React.", a: "`import { useState, useEffect } from 'react';`" },
      { level: "B", q: "`TodoList.jsx` has `export default function TodoList`. Import it as `List`.", a: "`import List from './TodoList.jsx';`" },
      { level: "I", q: "Create `components/index.js` that re-exports `Button` (default export of `Button.jsx`) as a named export.", a: "Re-export the default under a name.", code: `export { default as Button } from './Button.jsx';\n// usage: import { Button } from './components';` },
      { level: "C", q: "Two files both export a named `format`. Import both into one file.", a: "Rename one or both with `as`.", code: `import { format as formatDate } from './date.js';\nimport { format as formatMoney } from './money.js';` }
    ],
    quiz: [
      { q: "`export default function Header() {}`. Which import works?", options: ["import { Header } from './Header.jsx'", "import Header from './Header.jsx'", "import * from './Header.jsx'", "import default Header from './Header.jsx'"], answer: 1, why: "Default exports are imported without braces." },
      { q: "How many default exports can a module have?", options: ["Unlimited", "One at most", "Exactly two", "One per function"], answer: 1, why: "A module has at most one `default`; it can have many named exports." },
      { q: "`import * as cart from './cart.js'` gives you...", options: ["Only the default export", "An object with every export as a property", "A copy of the file text", "A promise"], answer: 1, why: "A namespace object: `cart.addItem`, `cart.total` (and `cart.default` if there is one)." }
    ],
    rev: {
      sec30: "Named exports: many per file, imported with braces and exact names (rename with `as`). Default export: one per file, imported without braces under any name. Namespace import `* as x` collects all exports into an object. Re-export from index files for tidy paths. React hooks are named imports from `react`; React Router 7 imports come from `react-router`.",
      interview: [
        { level: "basic", q: "Named vs default exports?", a: "Named: many per module, imported by exact name in braces. Default: one per module, imported without braces with any local name." },
        { level: "intermediate", q: "Why do some teams prefer named exports only?", a: "Names stay consistent across the codebase, auto-imports and renames work better, and typos fail at build time instead of silently importing under a wrong name." },
        { level: "intermediate", q: "What does `export { default as Button } from './Button.jsx'` do?", a: "Re-exports another module's default export as a named export, typical in a barrel `index.js`." },
        { level: "tricky", q: "Can you change an imported variable: `import { count } from './a.js'; count++`?", a: "No. Imports are read-only live bindings: you see updates the exporting module makes, but you can't reassign them." }
      ],
      debug: [
        { code: `// Button.jsx\nexport default function Button() {}\n\n// App.jsx\nimport { Button } from './Button.jsx';`, fix: `import Button from './Button.jsx';`, why: "Braces ask for a named export that doesn't exist; Vite reports \"does not provide an export named 'Button'\"." }
      ],
      cheat: [
        "Named: `export const a` -> `import { a } from`",
        "Default: `export default X` -> `import Anything from`",
        "Mix: `import Def, { named } from './x.js'`",
        "Rename: `import { a as b }`",
        "Namespace: `import * as api from './api.js'`",
        "Re-export: `export { default as Btn } from './Btn.jsx'`",
        "Imports are read-only live bindings"
      ]
    },
    related: ["WEB-026", "COMP-012", "COMP-013", "COMP-014"]
  },

  "WEB-028": {
    tldr: "A promise is a placeholder for a value that arrives later. It starts **pending**, then becomes **fulfilled** (with a value) or **rejected** (with an error). Chain `.then` for the next step and `.catch` for failures.",
    analogy: { icon: "🍔", text: "A buzzer at a burger counter. You get it now (the promise); later it buzzes \"ready\" (fulfilled) or \"sold out\" (rejected). Meanwhile you're free to grab a seat." },
    visual: { type: "timeline", title: "Life of a weather promise", frames: [
      { label: "getWeather('Rome')", state: "pending", note: "The promise is returned immediately; the data isn't here yet." },
      { label: "data arrives", state: "fulfilled: { temp: 24 }", note: "`resolve(value)` settles it. It can never change again." },
      { label: ".then(w => w.temp)", state: "new promise -> 24", note: "Each `.then` returns a new promise with the callback's return value." },
      { label: "or: network fails", state: "rejected: Error", note: "`reject(err)` or a thrown error skips the `.then`s until a `.catch`." },
      { label: ".finally()", state: "settled", note: "Runs either way: hide the spinner here." }
    ]},
    points: [
      "Create one with `new Promise((resolve, reject) => { ... })`. Most of the time you **consume** promises (`fetch` returns one).",
      "`.then(fn)` returns a **new** promise; **return** from it to pass a value (or another promise) down the chain.",
      "`.catch(fn)` handles any rejection or thrown error **above** it; `.finally(fn)` runs on both outcomes.",
      "`Promise.all([...])` waits for all and **rejects on the first failure**. `Promise.allSettled` waits for all and reports each result.",
      "Promise callbacks always run **later** (as microtasks), even if the promise is already settled.",
      "**In React:** you start promises in effects or event handlers (or let TanStack Query manage them) and store the result in state; React 19's `use()` reads a cached promise inside Suspense (don't create it during render)."
    ],
    code: { file: "weather.js", lang: "js", src: `function getWeather(city) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (city === 'Atlantis') reject(new Error('City not found'));
      else resolve({ city, temp: city.length * 4 });
    }, 300);
  });
}

getWeather('Rome')
  .then(w => w.temp)                  // pass a value on
  .then(temp => console.log('Rome:', temp))
  .catch(err => console.log('Oops:', err.message))
  .finally(() => console.log('spinner off'));

getWeather('Atlantis')
  .then(w => console.log('never runs', w))
  .catch(err => console.log('Oops:', err.message));

// All or nothing
Promise.all([getWeather('Oslo'), getWeather('Lima')])
  .then(list => console.log('all:', list.map(w => w.temp)));

// Every result, success or failure
Promise.allSettled([getWeather('Paris'), getWeather('Atlantis')])
  .then(results => console.log(results.map(r => r.status)));

console.log('this logs first');`, walk: [
      { lines: [2, 4, 5], note: "Wrap async work in a promise; call `resolve` on success, `reject` on failure." },
      { lines: [11, 12], note: "Each `.then` returns a new promise; returning `w.temp` passes it to the next step." },
      { lines: [13, 14], note: "One `.catch` covers the whole chain above; `finally` runs either way." },
      { lines: [16, 17, 18], note: "Rejected: the `.then` is skipped and the `.catch` runs." },
      { lines: [21, 25], note: "`all` gives values in input order or fails fast; `allSettled` reports each `fulfilled` / `rejected`." },
      { lines: [28], note: "Synchronous code finishes before any promise callback runs." }
    ]},
    output: "this logs first\nRome: 16\nspinner off\nOops: City not found\nall: [ 16, 16 ]\n[ 'fulfilled', 'rejected' ]",
    mistakes: [
      { bad: `getUser()\n  .then(user => {\n    getOrders(user.id); // not returned\n  })\n  .then(orders => show(orders)); // undefined`, good: `getUser()\n  .then(user => getOrders(user.id))\n  .then(orders => show(orders));`, why: "If you don't **return** the inner promise, the next `.then` gets `undefined` and doesn't wait for it." },
      { bad: `fetchCart().then(show); // no catch`, good: `fetchCart().then(show).catch(showError);`, why: "A rejection with no handler becomes an \"unhandled promise rejection\" and the user sees nothing." },
      { bad: `Promise.all([loadA(), loadB()]) // one fails, you lose both`, good: `Promise.allSettled([loadA(), loadB()]) // show what loaded`, why: "Use `all` when you need everything; `allSettled` when partial results are still useful (e.g. dashboard widgets)." }
    ],
    practice: [
      { level: "B", q: "Write `wait(ms)` that resolves after `ms` milliseconds.", a: "Wrap `setTimeout` in a promise.", code: `const wait = ms => new Promise(resolve => setTimeout(resolve, ms));\nwait(500).then(() => console.log('half a second later'));` },
      { level: "B", q: "What state is a promise in right after it's created by `fetch`?", a: "Pending." },
      { level: "I", q: "Load a playlist, then its first song, in a chain.", a: "Return the second promise from the first `.then`.", code: `getPlaylist(id)\n  .then(list => getSong(list.songs[0]))\n  .then(song => console.log(song.title))\n  .catch(err => console.error(err));` },
      { level: "I", q: "Load menu, specials and reviews in parallel, failing if any fails.", a: "`Promise.all([getMenu(), getSpecials(), getReviews()]).then(([menu, specials, reviews]) => ...)`." },
      { level: "C", q: "Write `timeout(promise, ms)` that rejects if the promise takes longer than `ms`.", a: "Race it against a rejecting timer.", code: `const timeout = (p, ms) => Promise.race([\n  p,\n  new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out')), ms)),\n]);` }
    ],
    quiz: [
      { q: "What does `.then()` return?", options: ["The value", "undefined", "A new promise", "The same promise"], answer: 2, why: "That's what makes chaining work: each step's return value feeds the next promise." },
      { q: "`Promise.all([a, b, c])` where `b` rejects. Result?", options: ["Resolves with [a, c]", "Rejects with b's error", "Waits forever", "Resolves with three statuses"], answer: 1, why: "`all` fails fast on the first rejection. `allSettled` would report all three." },
      { q: "`Promise.resolve(1).then(console.log); console.log(2);` Output order?", options: ["1, 2", "2, 1", "Only 1", "Random"], answer: 1, why: "`.then` callbacks run later as microtasks, after the current synchronous code." }
    ],
    rev: {
      sec30: "A promise represents a future value: pending, then fulfilled or rejected, once. `.then` returns a new promise (return values or promises to chain), `.catch` handles errors from anything above it, `.finally` runs either way. `Promise.all` fails fast; `allSettled` reports every result; `race`/`any` take the first. Callbacks run as microtasks after current code. `async/await` is syntax over the same thing.",
      interview: [
        { level: "basic", q: "What are the states of a promise?", a: "Pending, then settled as either fulfilled (with a value) or rejected (with a reason). Once settled it never changes." },
        { level: "intermediate", q: "`Promise.all` vs `Promise.allSettled`?", a: "`all` resolves with all values or rejects on the first failure. `allSettled` always resolves with `{ status, value | reason }` for each input." },
        { level: "intermediate", q: "Why must you return inside `.then`?", a: "The next `.then` receives whatever you return. Returning a promise makes the chain wait for it; forgetting gives `undefined` and breaks ordering." },
        { level: "advanced", q: "Where does an error thrown inside `.then` go?", a: "It rejects the promise returned by that `.then`, skipping later `.then`s until the next `.catch`." },
        { level: "tricky", q: "Does `new Promise(executor)` run the executor later?", a: "No, the executor runs synchronously right away. Only the `.then`/`.catch` callbacks are deferred." }
      ],
      predict: [
        { code: `console.log('A');\nnew Promise(res => {\n  console.log('B');\n  res();\n}).then(() => console.log('C'));\nconsole.log('D');`, answer: "A B D C", why: "The executor runs immediately (B); the `.then` callback waits until synchronous code finishes." }
      ],
      cheat: [
        "States: pending -> fulfilled | rejected (once)",
        "`new Promise((resolve, reject) => ...)`",
        "`.then` returns a new promise: always `return`",
        "`.catch` handles anything above; `.finally` runs both ways",
        "`all`: fail fast; `allSettled`: every result",
        "`race`: first settled; `any`: first fulfilled",
        "Callbacks run as microtasks, after sync code"
      ]
    },
    related: ["WEB-029", "WEB-030", "WEB-033", "API-013"]
  }
};
