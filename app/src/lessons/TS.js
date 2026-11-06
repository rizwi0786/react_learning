export default {
  "TS-001": {
    tldr: "TypeScript is JavaScript with type labels. Vite's `react-ts` template gives you a React + TypeScript app in one command: `.tsx` files, a `tsconfig`, and a build that type-checks.",
    analogy: { icon: "🏷️", text: "Labels on kitchen jars. JavaScript lets you pour salt into the sugar jar. TypeScript puts a label on every jar and shouts before you pour the wrong thing." },
    visual: { type: "flow", title: "From command to typed app", steps: [
      { label: "Scaffold", detail: "`npm create vite@latest shop -- --template react-ts`" },
      { label: "Install", detail: "`npm install` pulls React, `typescript` and `@types/react`." },
      { label: "Write .tsx", detail: "Components live in `.tsx` files (TypeScript + JSX)." },
      { label: "Dev server", detail: "`npm run dev`: Vite **strips** types fast. It does not type-check." },
      { label: "Check + build", detail: "`npm run build` runs `tsc -b` first, so type errors fail the build." }
    ]},
    points: [
      "Use the **`react-ts`** template. Create React App is deprecated (Feb 2025); don't use it.",
      "`.ts` = plain logic, `.tsx` = files with JSX. Components go in `.tsx`.",
      "`tsconfig.app.json` holds your app's settings. Strict mode is on (set there, and the default from TS 6).",
      "Vite only **removes** types (with Oxc). Your editor and `tsc` do the actual checking.",
      "Types vanish at runtime: the browser still runs plain JavaScript (like C# generics, but erased)."
    ],
    code: { file: "src/main.tsx", lang: "tsx", src: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// getElementById returns HTMLElement | null.
// The ! says "I know it exists".
const rootEl = document.getElementById('root')!;

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);`, walk: [
      { lines: [1, 2], note: "Same imports as JavaScript. Types for React come from `@types/react`." },
      { lines: [7], note: "TS knows the element might be missing (`null`). `!` is a non-null assertion: use sparingly." },
      { lines: [9, 10, 11, 12, 13], note: "`createRoot` is typed: passing `null` here would be a compile error." }
    ]},
    output: "Terminal: `npm run dev` starts at http://localhost:5173. `npm run build` prints type errors (if any) before bundling.",
    mistakes: [
      { bad: `npx create-react-app shop --template typescript`, good: `npm create vite@latest shop -- --template react-ts`, why: "Create React App is deprecated. Vite is the standard starting point." },
      { bad: `// "npm run dev shows no errors, so my types are fine"`, good: `npx tsc -b   // or npm run build`, why: "The Vite dev server skips type-checking for speed. Run `tsc` (or rely on the editor) to see errors." }
    ],
    practice: [
      { level: "B", q: "Create a new TS React app called `notes`.", a: "`npm create vite@latest notes -- --template react-ts`, then `cd notes && npm install && npm run dev`." },
      { level: "B", q: "Rename a component file that contains JSX from `.ts` to the right extension.", a: "Use `.tsx`. JSX inside a `.ts` file is a syntax error." },
      { level: "I", q: "Add a script that only type-checks, without building.", a: "In package.json: `\"typecheck\": \"tsc -b\"` (or `tsc --noEmit -p tsconfig.app.json`).", code: `"scripts": {\n  "dev": "vite",\n  "build": "tsc -b && vite build",\n  "typecheck": "tsc -b"\n}` },
      { level: "C", q: "Why does a type error not stop `npm run dev`?", a: "Vite transpiles each file in isolation and just deletes types. Checking needs the whole project, so it's left to `tsc` and the editor." }
    ],
    quiz: [
      { q: "Which command creates a React + TypeScript project?", options: ["npx create-react-app app --typescript", "npm create vite@latest app -- --template react-ts", "npm install typescript react"], answer: 1, why: "Vite's `react-ts` template is the recommended setup." },
      { q: "Does the Vite dev server type-check your code?", options: ["Yes, on every save", "No, it only strips types", "Only in Strict Mode"], answer: 1, why: "Vite transpiles fast and leaves checking to `tsc` and your editor." },
      { q: "What reaches the browser?", options: ["TypeScript with types", "Plain JavaScript; types are erased", "WebAssembly"], answer: 1, why: "Types exist only at compile time." }
    ],
    rev: {
      sec30: "Start with `npm create vite@latest app -- --template react-ts`. Components go in `.tsx`. Strict mode is on. Vite strips types without checking; `tsc -b` (part of `npm run build`) and the editor catch errors. Types disappear at runtime.",
      interview: [
        { level: "basic", q: "How do you start a React + TypeScript project today?", a: "Vite's `react-ts` template. CRA is deprecated; frameworks like Next.js also ship TS support." },
        { level: "intermediate", q: "Why does `npm run build` run `tsc -b` before `vite build`?", a: "Vite only transpiles. `tsc -b` type-checks the whole project so a type error fails the build." },
        { level: "intermediate", q: "Difference between `.ts` and `.tsx`?", a: "`.tsx` allows JSX. In `.tsx`, the old `<T>value` cast syntax is not allowed; use `value as T`." },
        { level: "tricky", q: "Can TypeScript stop a bad API response at runtime?", a: "No. Types are erased. Use runtime validation (e.g. Zod) for data from outside." }
      ],
      cheat: [
        "`npm create vite@latest app -- --template react-ts`",
        "JSX files use `.tsx`",
        "Strict mode is on by default in the template",
        "Vite strips types; `tsc -b` checks them",
        "Types are erased at runtime",
        "`!` = non-null assertion; use rarely"
      ]
    },
    related: ["ENV-003", "TS-002", "TS-020"]
  },

  "TS-002": {
    tldr: "TypeScript finds bugs **while you type**: typos in property names, wrong argument types, forgotten `null` checks and missing props. You fix them in the editor instead of in the browser console.",
    analogy: { icon: "📝", text: "A spell-checker for code. It underlines `totl` in red before you send the email, instead of the customer replying “what's a totl?”." },
    visual: { type: "compare", title: "Same bug, two worlds", left: { label: "JavaScript", tone: "bad", points: [
      "`cart.totl` silently gives `undefined`", "Bug shows up when a user clicks", "Rename a prop: hunt with search", "Autocomplete guesses"
    ]}, right: { label: "TypeScript", tone: "good", points: [
      "Red squiggle: `totl` does not exist", "Bug caught before you save", "Rename symbol updates every usage", "Autocomplete knows every field"
    ]}},
    points: [
      "Catches **typos**: `user.nmae` is an error, not `undefined`.",
      "Catches **wrong types**: passing `\"5\"` where a number is expected.",
      "Catches **missing `null` checks**: `find()` may return `undefined`.",
      "Catches **missing or wrong props** on components.",
      "Bonus: safe refactors, autocomplete, and types as living documentation for the team."
    ],
    code: { file: "cart.ts", lang: "ts", src: `type Item = { name: string; price: number };

const cart: Item[] = [
  { name: 'Coffee', price: 3 },
  { name: 'Bagel', price: 2 },
];

// Bug 1: typo
cart[0].prise;            // ❌ Property 'prise' does not exist

// Bug 2: wrong type
const total = (a: number, b: number) => a + b;
total(cart[0].price, '2'); // ❌ string is not assignable to number

// Bug 3: forgot "not found"
const tea = cart.find(i => i.name === 'Tea');
tea.price;                // ❌ 'tea' is possibly 'undefined'
tea?.price ?? 0;          // ✅ handled`, walk: [
      { lines: [1], note: "Describe the shape once. Everything else is checked against it." },
      { lines: [9], note: "In JS this is `undefined`. In TS it's a compile error." },
      { lines: [12, 13], note: "In JS, `3 + '2'` gives `'32'`. TS blocks the call." },
      { lines: [16, 17, 18], note: "`find` returns `Item | undefined`; TS makes you handle the missing case." }
    ]},
    mistakes: [
      { bad: `const data: any = await res.json();\ndata.itmes.map(...)`, good: `const data: Item[] = parseItems(await res.json());\ndata.map(...)`, why: "`any` switches TypeScript off. The typo `itmes` sails through and crashes at runtime." }
    ],
    practice: [
      { level: "B", q: "What does TS say about `'5' * 2` vs `'5' + 2`?", a: "`*` on a string is an error; `+` is allowed (string concatenation), so you still need correct types on inputs." },
      { level: "I", q: "Give two bugs TS **can't** catch.", a: "Wrong logic (e.g. `price * 0`) and bad data from an API at runtime." },
      { level: "C", q: "Make a `Product` type and a function `discount(p: Product, pct: number)`. Call it wrongly three ways and read the errors.", a: "Try a missing field, a string for `pct`, and a misspelled property. Each one gives a clear compile error." }
    ],
    quiz: [
      { q: "When does TypeScript report `Property 'totl' does not exist`?", options: ["At runtime in the browser", "In the editor / at compile time", "Only in production builds"], answer: 1, why: "Type errors appear before the code runs." },
      { q: "Which bug can TypeScript NOT catch on its own?", options: ["Misspelled property", "Passing a string to a number param", "A server returning a different JSON shape"], answer: 2, why: "Types are erased; runtime data needs runtime validation." },
      { q: "What does annotating a value as `any` do?", options: ["Makes it safer", "Turns type checking off for it", "Converts it to unknown"], answer: 1, why: "`any` opts out of checking." }
    ],
    rev: {
      sec30: "TypeScript adds compile-time checks to JavaScript: typos, wrong argument types, unhandled `null`/`undefined`, and wrong component props. It also gives autocomplete and safe refactors. It can't validate runtime data or logic errors.",
      interview: [
        { level: "basic", q: "Why use TypeScript with React?", a: "It catches prop, state and null bugs in the editor, makes refactors safe and documents component APIs." },
        { level: "intermediate", q: "What's the cost of TypeScript?", a: "A build step, learning curve and some typing effort. Inference keeps most of it small." },
        { level: "advanced", q: "Is TypeScript a replacement for tests?", a: "No. Types prove shapes are consistent; tests prove behaviour is correct. They complement each other." },
        { level: "tricky", q: "Your app is fully typed but crashes on `user.name`. How?", a: "The data came from outside (API, localStorage) and didn't match the type, or someone used `any`/`as`." }
      ],
      cheat: [
        "Catches typos, wrong types, null misses, bad props",
        "Errors show while typing, not after deploy",
        "Safe rename and autocomplete",
        "Can't check runtime data: validate it",
        "`any` disables checking"
      ]
    },
    related: ["TS-001", "TS-003", "TS-012"]
  },

  "TS-003": {
    tldr: "An annotation (type label) is `: Type` after a name. Label function **parameters** always; let TypeScript **infer** most variables and return types.",
    analogy: { icon: "🍳", text: "A recipe card says “2 eggs, 200 g flour”. The ingredients (parameters) need labels; the cake (the result) is obvious from the recipe." },
    visual: { type: "compare", title: "Annotate or infer?", left: { label: "Annotate", tone: "neutral", points: [
      "Function parameters", "Empty values: `useState<Item[]>([])`", "Public return types (APIs, hooks)", "Variables declared without a value"
    ]}, right: { label: "Let TS infer", tone: "good", points: [
      "`const price = 3` → number", "`const names = ['a']` → string[]", "Most return types", "Callback params in `.map()`"
    ]}},
    points: [
      "Basic types: `string`, `number`, `boolean`, `null`, `undefined`, arrays `string[]`.",
      "Parameters: `function add(a: number, b: number)`. TS can't guess these.",
      "Return type: `(): number` after the parentheses. Optional; useful as a contract.",
      "Optional param: `name?: string` means `string | undefined`.",
      "`const` keeps literal types: `const size = 'L'` has type `'L'`, not `string`."
    ],
    code: { file: "pricing.ts", lang: "ts", src: `// Variables: inferred
const shop = 'Corner Cafe';      // string
let items = 3;                   // number

// Declared now, assigned later: annotate
let coupon: string | null = null;

// Parameters: always annotate
function lineTotal(price: number, qty: number): number {
  return price * qty;
}

// Optional parameter with a default
function greet(name: string, emoji = '👋') {
  return emoji + ' Hi ' + name;  // return type inferred: string
}

// Arrays
const tags: string[] = [];
tags.push('vegan');

lineTotal(2.5, items);           // ✅ 7.5
lineTotal('2.5', items);         // ❌ string not assignable to number`, walk: [
      { lines: [2, 3], note: "No labels needed: TS infers from the value." },
      { lines: [6], note: "Starts as `null`, will hold a string later: say both." },
      { lines: [9], note: "Parameter labels are the contract. `: number` after `)` locks the return type." },
      { lines: [14], note: "A default value also gives the type: `emoji` is `string`." },
      { lines: [19], note: "Label an empty array so TS (and readers) know what goes inside." }
    ]},
    mistakes: [
      { bad: `const total: number = 5;\nconst name: string = 'Ana';`, good: `const total = 5;\nconst name = 'Ana';`, why: "Redundant labels add noise. Inference already knows the type." },
      { bad: `function tax(amount) { return amount * 0.2; }`, good: `function tax(amount: number) { return amount * 0.2; }`, why: "Un-annotated params are implicitly `any`; strict mode flags it." }
    ],
    practice: [
      { level: "B", q: "Annotate `function fullName(first, last)`.", a: "`function fullName(first: string, last: string) { return first + ' ' + last; }`" },
      { level: "B", q: "What type does `const done = false` get? And `let done = false`?", a: "`const`: the literal `false`. `let`: `boolean` (it can change)." },
      { level: "I", q: "Write `formatPrice(cents: number, currency?: string)` that defaults to '€'.", a: "Use a default: `currency = '€'`.", code: `function formatPrice(cents: number, currency = '€') {\n  return currency + (cents / 100).toFixed(2);\n}` },
      { level: "C", q: "When is an explicit return type worth it?", a: "On exported functions and hooks: it locks the contract so a change inside can't silently change what callers get." }
    ],
    quiz: [
      { q: "What should you always annotate?", options: ["Every variable", "Function parameters", "Nothing; TS infers all"], answer: 1, why: "Parameters have no value to infer from." },
      { q: "An empty array that will hold strings. Clearest declaration?", options: ["`let tags: string[] = []`", "`let tags: any = []`", "`let tags = [] as never`"], answer: 0, why: "Label empty collections with what they'll hold." },
      { q: "`name?: string` is the same as…", options: ["`name: string`", "`name: string | undefined` (and can be left out)", "`name: string | null`"], answer: 1, why: "Optional means it may be missing, so it may be `undefined`." }
    ],
    rev: {
      sec30: "Annotate with `: Type`. Always label parameters and empty values; let TypeScript infer the rest. Return types are optional but good on exported APIs. `?` makes a param optional (`| undefined`). `const` keeps literal types.",
      interview: [
        { level: "basic", q: "What is type inference?", a: "TS works out a type from the value, e.g. `const n = 1` is `number`, so you don't write it." },
        { level: "intermediate", q: "Should you annotate return types?", a: "Optional. Useful on exported functions and hooks to lock the contract and get errors at the definition." },
        { level: "advanced", q: "Why is `const size = 'L'` typed `'L'` but `let size = 'L'` typed `string`?", a: "`const` can't change, so TS keeps the literal. `let` may be reassigned, so it widens." },
        { level: "tricky", q: "What's the type of an un-annotated parameter?", a: "Implicitly `any`. With `strict` (`noImplicitAny`) that's an error." }
      ],
      cheat: [
        "`name: Type` annotates",
        "Always: parameters, empty arrays/objects",
        "Infer: initialised variables, most returns",
        "`x?: T` = optional, `T | undefined`",
        "Default value gives the type: `qty = 1`",
        "`const` → literal type, `let` → widened"
      ]
    },
    related: ["TS-002", "TS-004", "TS-007"]
  },

  "TS-004": {
    tldr: "An `interface` names the shape of an object: which fields it has and their types. Use it for props, API data and anything with a fixed set of keys.",
    analogy: { icon: "📋", text: "An order form with fixed boxes: name, address, items. Every order must fill the required boxes; optional ones (gift note) can stay empty." },
    visual: { type: "tree", title: "interface Product", root: { label: "Product", note: "a named object shape", children: [
      { label: "id: number" },
      { label: "name: string" },
      { label: "price: number" },
      { label: "tags?: string[]", note: "optional" },
      { label: "readonly sku: string", note: "can't reassign" }
    ]}},
    points: [
      "Syntax: `interface Product { id: number; name: string }`.",
      "`?` marks an optional field; `readonly` stops reassignment.",
      "`extends` builds on another interface: `interface Coffee extends Product { size: 'S' | 'L' }`.",
      "Two `interface` declarations with the same name **merge** (declaration merging).",
      "Shapes are checked **structurally**: any object with the right fields fits (unlike C# nominal types)."
    ],
    code: { file: "ProductCard.tsx", lang: "tsx", src: `interface Product {
  id: number;
  name: string;
  price: number;
  tags?: string[];          // optional
  readonly sku: string;     // can't be reassigned
}

interface Coffee extends Product {
  size: 'S' | 'M' | 'L';
}

const latte: Coffee = {
  id: 1, name: 'Latte', price: 3.5, sku: 'LAT-01', size: 'M',
};

latte.sku = 'X';            // ❌ read-only

export function ProductCard({ product }: { product: Product }) {
  return (
    <li>
      {product.name}: €{product.price.toFixed(2)}
      {product.tags?.length ? ' 🏷️' : ''}
    </li>
  );
}`, walk: [
      { lines: [1, 2, 3, 4, 5, 6, 7], note: "One named shape. Every Product must have these fields." },
      { lines: [9, 10, 11], note: "`extends` reuses Product and adds `size`." },
      { lines: [13, 14, 15], note: "Missing a required field or adding an unknown one here is an error." },
      { lines: [19], note: "Use the interface to type a prop." },
      { lines: [23], note: "`tags` is optional, so use `?.` before reading it." }
    ]},
    output: "A list item: “Latte: €3.50”.",
    mistakes: [
      { bad: `interface Product { name: string }\nconst p: Product = { name: 'Tea', colour: 'green' };`, good: `interface Product { name: string; colour?: string }\nconst p: Product = { name: 'Tea', colour: 'green' };`, why: "Object literals get an **excess property check**: unknown keys are errors, which catches typos." }
    ],
    practice: [
      { level: "B", q: "Write an interface `Todo` with `id`, `text`, `done`.", a: "`interface Todo { id: number; text: string; done: boolean }`" },
      { level: "I", q: "Add an optional `dueDate` and make `id` read-only.", a: "`readonly id: number; dueDate?: string;`" },
      { level: "I", q: "Create `interface Song` and `interface PlaylistSong extends Song { addedBy: string }`.", a: "`extends` copies Song's fields and adds `addedBy`." },
      { level: "C", q: "An object `{ id: 1, text: 'x', done: false, extra: 1 }` stored in a variable first, then passed as `Todo`. Error?", a: "No. Excess property checks only apply to fresh object literals; a variable with extra fields still fits structurally." }
    ],
    quiz: [
      { q: "What does `tags?: string[]` mean?", options: ["tags can be null", "tags may be missing (undefined)", "tags is an empty array by default"], answer: 1, why: "`?` = optional, so the type includes `undefined`." },
      { q: "Two `interface Cart` declarations in one scope…", options: ["Error: duplicate", "Merge into one", "The last one wins"], answer: 1, why: "Interfaces support declaration merging." },
      { q: "TypeScript compares object types by…", options: ["Their name", "Their structure (fields)", "Their prototype"], answer: 1, why: "TS is structurally typed." }
    ],
    rev: {
      sec30: "`interface` names an object shape. Fields can be optional (`?`) or `readonly`. Use `extends` to build on another. Same-name interfaces merge. Checks are structural, and fresh object literals get excess-property checks that catch typos.",
      interview: [
        { level: "basic", q: "What's an interface for?", a: "Describing an object's shape so TS checks every object, prop or API result against it." },
        { level: "intermediate", q: "What's declaration merging?", a: "Two interfaces with the same name combine their fields. Used to extend library types (e.g. `Window`)." },
        { level: "advanced", q: "Structural vs nominal typing?", a: "TS checks fields, not names. Any object with the right shape fits, unlike C# where the class name matters." },
        { level: "tricky", q: "Does `readonly` freeze the object at runtime?", a: "No. It's compile-time only. Use `Object.freeze` for runtime." }
      ],
      cheat: [
        "`interface X { a: string; b?: number }`",
        "`?` optional, `readonly` no reassign",
        "`interface B extends A { ... }`",
        "Same-name interfaces merge",
        "Structural typing: shape matters, not name",
        "Excess property check on object literals"
      ]
    },
    related: ["TS-005", "TS-008", "PROPS-001"]
  },

  "TS-005": {
    tldr: "A `type` alias gives any type a name: objects, unions, tuples, functions. For plain object shapes, `interface` and `type` are nearly the same; pick one style and stay consistent.",
    analogy: { icon: "🔖", text: "A nickname. “Weekend” is a nickname for “Saturday or Sunday”. A type alias names anything, even a choice; an interface can only name an object form." },
    visual: { type: "compare", title: "interface vs type", left: { label: "interface", tone: "neutral", points: [
      "Object shapes only", "`extends` to inherit", "Same name merges (declaration merging)", "Good for public/library APIs"
    ]}, right: { label: "type", tone: "neutral", points: [
      "Anything: unions, tuples, functions", "`&` to combine (intersection)", "No merging: one name, one definition", "Needed for `'S' | 'M' | 'L'`"
    ]}},
    points: [
      "Syntax: `type Size = 'S' | 'M' | 'L'` or `type Song = { title: string; secs: number }`.",
      "Only `type` can name a **union** or **tuple** (`[number, string]`); it's also the short way to name a function type.",
      "Combine object types with `&` (intersection): `type CartItem = Product & { qty: number }`.",
      "Only `interface` merges. Handy for augmenting library types; surprising elsewhere.",
      "Common team rule: `type` by default, `interface` when you need `extends` or merging. Either is fine."
    ],
    code: { file: "music.ts", lang: "ts", src: `// Names for things interfaces can't express
type Mood = 'chill' | 'party' | 'focus';      // union
type Duration = [minutes: number, seconds: number]; // tuple
type OnPlay = (songId: number) => void;       // function

// Object shape: type or interface both work
type Song = {
  id: number;
  title: string;
  mood: Mood;
  length: Duration;
};

// Combine with & (intersection)
type QueuedSong = Song & { position: number };

const next: QueuedSong = {
  id: 7,
  title: 'Lo-fi Rain',
  mood: 'chill',
  length: [3, 12],
  position: 1,
};

const play: OnPlay = (id) => console.log('Playing', id);
play(next.id);`, walk: [
      { lines: [2, 3, 4], note: "A union, a labelled tuple and a function type. Unions and tuples need `type`." },
      { lines: [7, 8, 9, 10, 11, 12], note: "An object type. Swapping to `interface Song { ... }` works the same here." },
      { lines: [15], note: "`&` merges two shapes: a QueuedSong has every Song field plus `position`." },
      { lines: [25], note: "Typing the variable gives `id` its type: no annotation needed in the arrow." }
    ]},
    output: "Console: Playing 7",
    mistakes: [
      { bad: `interface Size = 'S' | 'M' | 'L';`, good: `type Size = 'S' | 'M' | 'L';`, why: "Interfaces only describe object shapes. Unions need a type alias." },
      { bad: `type Cart = { items: string[] };\ntype Cart = { total: number };`, good: `type Cart = { items: string[]; total: number };`, why: "Types can't be declared twice (no merging). Duplicate identifier error." }
    ],
    practice: [
      { level: "B", q: "Make a type `Weather` that is 'sunny', 'rainy' or 'cloudy'.", a: "`type Weather = 'sunny' | 'rainy' | 'cloudy';`" },
      { level: "I", q: "Rewrite `interface Recipe { name: string; mins: number }` as a type alias.", a: "`type Recipe = { name: string; mins: number };`" },
      { level: "I", q: "Make `type Point = [x: number, y: number]` and a function that adds two points.", a: "Return a new tuple.", code: `const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];` },
      { level: "C", q: "`interface A extends B` vs `type A = B & {...}`: any difference when fields clash?", a: "`extends` errors if a field type conflicts; `&` silently intersects it (often to `never`). `extends` gives clearer errors." }
    ],
    quiz: [
      { q: "Which can name `'S' | 'M' | 'L'`?", options: ["interface", "type", "both"], answer: 1, why: "Unions are only expressible with `type`." },
      { q: "Which supports declaration merging?", options: ["interface", "type", "both"], answer: 0, why: "Only interfaces merge." },
      { q: "`type A = B & C` means a value must…", options: ["Be B or C", "Have all fields of B and C", "Be neither"], answer: 1, why: "`&` = intersection: it satisfies both." }
    ],
    rev: {
      sec30: "`type` names any type: unions, tuples, functions, objects. `interface` names object shapes, can `extends` and merges. For object props they're interchangeable; teams pick one by convention. Combine types with `&`.",
      interview: [
        { level: "basic", q: "interface or type for component props?", a: "Either. Be consistent. Use `type` if you need unions; `interface` if you like `extends`." },
        { level: "intermediate", q: "What can type do that interface can't?", a: "Unions, tuples, function types, mapped and conditional types." },
        { level: "advanced", q: "What can interface do that type can't?", a: "Declaration merging, e.g. augmenting `Window` or a library's types." },
        { level: "tricky", q: "`type X = { a: string } & { a: number }`: what is `X['a']`?", a: "`never`. No value is both a string and a number." }
      ],
      compare: { cols: ["", "interface", "type"], rows: [
        ["Object shapes", "Yes", "Yes"], ["Unions / tuples", "No", "Yes"], ["Extend", "`extends`", "`&`"], ["Merging", "Yes", "No"]
      ]},
      cheat: [
        "`type Name = ...` names any type",
        "Unions, tuples, functions → `type`",
        "Merging / augmenting libs → `interface`",
        "`&` intersection combines shapes",
        "Object props: either works, be consistent"
      ]
    },
    related: ["TS-004", "TS-006", "TS-019"]
  },

  "TS-006": {
    tldr: "A union (`A | B`) says “one of these”. Before using it you **narrow** it: check with `typeof`, `in`, or a shared tag field, and TypeScript knows which variant you have inside each branch.",
    analogy: { icon: "📦", text: "A parcel that is either a pizza or a book. You check the label first (“kind: pizza”), then you know to eat it, not read it." },
    visual: { type: "flow", title: "Narrowing a union", steps: [
      { label: "Union", detail: "`state: Loading | Success | Failed`" },
      { label: "Check the tag", detail: "`if (state.status === 'success')`" },
      { label: "Narrowed", detail: "Inside, TS knows it's `Success`, so `state.data` is allowed." },
      { label: "Else branch", detail: "TS removes `Success`: only `Loading | Failed` remain." },
      { label: "Exhaustive", detail: "After all cases, the type is `never`: nothing forgotten." }
    ]},
    points: [
      "Union of literals: `type Status = 'idle' | 'loading' | 'error'`.",
      "Narrow primitives with `typeof x === 'string'`; objects with `'field' in x`.",
      "**Discriminated union**: every variant has the same tag (`status`, `kind`) with a different literal value.",
      "Model UI states as one union instead of several booleans: impossible combos (loading + error) can't exist.",
      "Optional chaining and `!== null` checks also narrow `T | null`."
    ],
    code: { file: "Weather.tsx", lang: "tsx", src: `type WeatherState =
  | { status: 'loading' }
  | { status: 'success'; tempC: number; city: string }
  | { status: 'error'; message: string };

function WeatherCard({ state }: { state: WeatherState }) {
  switch (state.status) {
    case 'loading':
      return <p>Loading forecast…</p>;
    case 'success':
      return <p>{state.city}: {state.tempC}°C</p>;
    case 'error':
      return <p role="alert">⚠️ {state.message}</p>;
  }
}

function formatTemp(t: number | string) {
  if (typeof t === 'number') return t.toFixed(1) + '°C';
  return t; // here t is string
}

export default function App() {
  return <WeatherCard state={{ status: 'success', tempC: 21, city: 'Lisbon' }} />;
}`, walk: [
      { lines: [1, 2, 3, 4], note: "Three variants share the tag `status`. Each has its own fields." },
      { lines: [7], note: "Switching on the tag narrows `state` in every `case`." },
      { lines: [11], note: "Only in the `success` case can you read `tempC` and `city`." },
      { lines: [18, 19], note: "`typeof` narrows primitive unions. After the `if`, `t` must be a string." }
    ]},
    output: "Lisbon: 21°C",
    mistakes: [
      { bad: `const [loading, setLoading] = useState(false);\nconst [error, setError] = useState('');\nconst [data, setData] = useState(null);`, good: `type State =\n  | { status: 'loading' }\n  | { status: 'error'; message: string }\n  | { status: 'success'; data: Forecast };`, why: "Separate booleans allow nonsense like loading **and** error at once. A union makes impossible states impossible." },
      { bad: `function show(s: WeatherState) {\n  return s.tempC; // ❌\n}`, good: `function show(s: WeatherState) {\n  return s.status === 'success' ? s.tempC : null;\n}`, why: "You can only read fields that exist on **every** variant until you narrow." }
    ],
    practice: [
      { level: "B", q: "Write `type Payment = 'card' | 'cash' | 'voucher'`. What does `const p: Payment = 'bitcoin'` give?", a: "An error: 'bitcoin' is not in the union." },
      { level: "I", q: "Narrow `id: string | number` so you can call `.toUpperCase()`.", a: "`if (typeof id === 'string') id.toUpperCase();`" },
      { level: "I", q: "Model a chat message that is `text` (body) or `image` (url, alt).", a: "A discriminated union on `kind`.", code: `type Msg =\n  | { kind: 'text'; body: string }\n  | { kind: 'image'; url: string; alt: string };` },
      { level: "C", q: "Add a `never` check so adding a new `status` breaks the build.", a: "In `default:` write `const _x: never = state; return _x;`. A new variant can't be assigned to `never`." }
    ],
    quiz: [
      { q: "`x: string | number`. What can you call without narrowing?", options: ["`x.toFixed()`", "`x.toUpperCase()`", "`x.toString()`"], answer: 2, why: "Only members shared by every variant are allowed." },
      { q: "What makes a union “discriminated”?", options: ["It has two members", "Every variant has a common literal tag field", "It uses `&`"], answer: 1, why: "The shared tag lets TS pick the variant." },
      { q: "In `if (s.status === 'error')`, the else branch type is…", options: ["The whole union", "The union minus the error variant", "never"], answer: 1, why: "TS removes the checked variant." }
    ],
    rev: {
      sec30: "A union `A | B` is one of several types. Narrow it before use: `typeof`, `in`, equality on a shared tag (discriminated union), or null checks. Model UI states as one tagged union so impossible combinations can't exist, and use a `never` check for exhaustiveness.",
      interview: [
        { level: "basic", q: "What is a union type?", a: "A value that can be one of several types, like `string | number` or `'S' | 'M' | 'L'`." },
        { level: "intermediate", q: "What's narrowing?", a: "Using a runtime check (`typeof`, `in`, tag equality) so TS refines the union to one member in that branch." },
        { level: "advanced", q: "Why prefer a discriminated union over `isLoading`, `error`, `data`?", a: "It removes impossible states and forces each state's fields to exist only where valid." },
        { level: "tricky", q: "How do you make TS error when a new union member isn't handled?", a: "Assign the value to `never` in the default branch; a new member isn't assignable to `never`." }
      ],
      predict: [
        { code: `type A = { kind: 'a'; n: number } | { kind: 'b'; s: string };\nfunction f(x: A) {\n  if (x.kind === 'a') return x.n;\n  return x.s.length;\n}\nf({ kind: 'b', s: 'hey' });`, answer: "3", why: "The else branch is narrowed to the `b` variant, so `x.s` is 'hey'." }
      ],
      cheat: [
        "`A | B` = one of these",
        "Narrow with `typeof`, `in`, `===` on a tag",
        "Tagged union: shared `kind`/`status` literal",
        "One union beats several booleans",
        "`const _: never = x` = exhaustive check"
      ]
    },
    related: ["TS-005", "TS-009", "TS-017"]
  },

  "TS-007": {
    tldr: "Generics are type **parameters**: `<T>` is a blank that's filled in when the function is used. One function works for many types and still keeps them exact.",
    analogy: { icon: "🥡", text: "A takeaway box. The box doesn't care if you put noodles or sushi in it, but once you do, the label says “sushi” and you get sushi back out." },
    visual: { type: "flow", title: "How <T> gets filled", steps: [
      { label: "Define", detail: "`function first<T>(list: T[]): T | undefined`" },
      { label: "Call", detail: "`first(['tea', 'coffee'])`" },
      { label: "Infer T", detail: "TS sees `string[]`, so `T = string`." },
      { label: "Result", detail: "Return type becomes `string | undefined`, not `any`." }
    ]},
    points: [
      "Write `<T>` after the function name; use `T` in params and return type.",
      "TS usually **infers** `T` from the arguments; you rarely write `first<string>(...)`.",
      "Constrain with `extends`: `<T extends { id: number }>` means T must have an `id`.",
      "`keyof T` + generics give type-safe keys: `getField<T, K extends keyof T>(obj: T, key: K): T[K]`.",
      "Same idea as C# `List<T>`; the difference is TS generics are erased at runtime."
    ],
    code: { file: "list-utils.ts", lang: "ts", src: `// One function, any element type
function first<T>(list: T[]): T | undefined {
  return list[0];
}

const drink = first(['tea', 'coffee']);  // string | undefined
const price = first([3, 4.5]);           // number | undefined

// Constraint: T must have an id
function findById<T extends { id: number }>(list: T[], id: number) {
  return list.find(item => item.id === id);
}

type Recipe = { id: number; name: string; mins: number };
const recipes: Recipe[] = [{ id: 1, name: 'Pancakes', mins: 20 }];

const r = findById(recipes, 1);  // Recipe | undefined
r?.mins;                         // ✅ autocomplete knows mins

// Type-safe key lookup
function pluck<T, K extends keyof T>(list: T[], key: K): T[K][] {
  return list.map(item => item[key]);
}
pluck(recipes, 'name');  // string[]
pluck(recipes, 'colour'); // ❌ not a key of Recipe`, walk: [
      { lines: [2, 3, 4], note: "`T` is a placeholder. Whatever goes in as `T[]` comes out as `T`." },
      { lines: [6, 7], note: "No `<string>` needed: TS infers T from the argument." },
      { lines: [10], note: "`extends { id: number }` lets the body safely read `item.id`." },
      { lines: [17, 18], note: "The result keeps the full Recipe type, unlike `any` or a base type." },
      { lines: [21, 22, 23, 24, 25], note: "`K extends keyof T` limits keys to real field names; `T[K]` is that field's type." }
    ]},
    mistakes: [
      { bad: `function first(list: any[]): any {\n  return list[0];\n}`, good: `function first<T>(list: T[]): T | undefined {\n  return list[0];\n}`, why: "`any` loses the type: callers get no autocomplete and no errors." },
      { bad: `function getId<T>(x: T) {\n  return x.id; // ❌\n}`, good: `function getId<T extends { id: number }>(x: T) {\n  return x.id;\n}`, why: "A bare `T` could be anything. Add a constraint to use its fields." }
    ],
    practice: [
      { level: "B", q: "Write `last<T>(list: T[])` returning the final item.", a: "`function last<T>(list: T[]): T | undefined { return list[list.length - 1]; }`" },
      { level: "I", q: "Write `wrap<T>(value: T)` returning `{ value: T; at: Date }`.", a: "Return the object; TS infers the generic return.", code: `function wrap<T>(value: T) {\n  return { value, at: new Date() };\n}` },
      { level: "I", q: "Write `groupBy<T, K extends keyof T>(list: T[], key: K)` that returns `Record<string, T[]>`.", a: "Loop and push into `acc[String(item[key])]`." },
      { level: "C", q: "In a `.tsx` file, why does `const id = <T>(x: T) => x;` fail?", a: "`<T>` looks like a JSX tag. Write `<T,>(x: T) => x` or use a function declaration." }
    ],
    quiz: [
      { q: "`first([true, false])` returns…", options: ["any", "boolean | undefined", "unknown"], answer: 1, why: "T is inferred as boolean." },
      { q: "What does `<T extends { id: number }>` do?", options: ["Makes T always a number", "Requires T to have a numeric id", "Copies id into T"], answer: 1, why: "It's a constraint on what T can be." },
      { q: "`K extends keyof Recipe` allows…", options: ["Any string", "Only 'id' | 'name' | 'mins'", "Only number keys"], answer: 1, why: "`keyof` gives the union of property names." }
    ],
    rev: {
      sec30: "Generics add type parameters (`<T>`) so one function or type works for many types without losing precision. TS infers T from arguments. Use `extends` to constrain T, and `K extends keyof T` with `T[K]` for safe key access. In `.tsx`, arrow generics need `<T,>`.",
      interview: [
        { level: "basic", q: "What problem do generics solve?", a: "Reusing code for many types while keeping the exact type, instead of falling back to `any`." },
        { level: "intermediate", q: "What's a generic constraint?", a: "`T extends X` limits T to types that have X's shape, so the body can use those fields." },
        { level: "advanced", q: "Explain `T[K]` with `K extends keyof T`.", a: "`keyof T` is the union of T's keys; `T[K]` is the type of the value at key K (indexed access type)." },
        { level: "tricky", q: "Arrow function generic in a .tsx file?", a: "Write `<T,>(x: T) => x`; plain `<T>` is parsed as JSX." }
      ],
      cheat: [
        "`function f<T>(x: T): T`",
        "T is usually inferred from args",
        "`<T extends { id: number }>` = constraint",
        "`keyof T` = union of keys",
        "`T[K]` = type at key K",
        "In .tsx arrows: `<T,>(x: T) => ...`"
      ]
    },
    related: ["TS-003", "TS-018", "TS-015"]
  },

  "TS-008": {
    tldr: "Type props with a `type` or `interface`, then annotate the destructured parameter: `function Card({ title }: CardProps)`. Missing, misspelled or wrong-typed props become errors at the call site.",
    analogy: { icon: "🍕", text: "An online pizza order form: size is required and must be S/M/L, extra toppings are optional, and you can't type “purple” into the size box." },
    visual: { type: "flow", title: "From props type to checked JSX", steps: [
      { label: "Describe", detail: "`type ButtonProps = { label: string; onClick: () => void; variant?: 'primary' | 'ghost' }`" },
      { label: "Annotate", detail: "`function Button({ label, onClick, variant = 'primary' }: ButtonProps)`" },
      { label: "Use", detail: "`<Button label=\"Buy\" onClick={buy} />`" },
      { label: "Checked", detail: "Missing `label`, a typo, or `variant=\"red\"` → compile error." }
    ]},
    points: [
      "Annotate the **whole props object** after destructuring: `({ a, b }: Props)`.",
      "Optional prop: `variant?: ...`; give the default in destructuring, `variant = 'primary'`.",
      "Function props: `onAdd: (id: number) => void`.",
      "Literal unions for fixed choices: `size: 'S' | 'M' | 'L'` gives autocomplete in JSX.",
      "Need `children`? Add `children: React.ReactNode` (see TS-014)."
    ],
    code: { file: "ProductRow.tsx", lang: "tsx", src: `type ProductRowProps = {
  name: string;
  price: number;
  inStock?: boolean;                 // optional
  badge?: 'new' | 'sale';            // fixed choices
  onAdd: (name: string) => void;     // callback prop
};

function ProductRow({ name, price, inStock = true, badge, onAdd }: ProductRowProps) {
  return (
    <li>
      {name} €{price.toFixed(2)} {badge && <mark>{badge}</mark>}
      <button disabled={!inStock} onClick={() => onAdd(name)}>
        Add to cart
      </button>
    </li>
  );
}

export default function App() {
  return (
    <ul>
      <ProductRow name="Oat milk" price={1.8} badge="new" onAdd={n => alert(n)} />
      <ProductRow name="Granola" price={4} inStock={false} onAdd={console.log} />
    </ul>
  );
}`, walk: [
      { lines: [1, 2, 3, 4, 5, 6, 7], note: "The props contract: two required values, two optional ones, one callback." },
      { lines: [9], note: "Destructure and annotate together. `inStock = true` is the default for a missing prop." },
      { lines: [13], note: "`onAdd` must be called with a string, as the type says." },
      { lines: [23, 24], note: "In JSX, TS checks every prop. `price=\"4\"` (a string) would be an error." }
    ]},
    output: "Two rows: “Oat milk €1.80 new [Add to cart]” and “Granola €4.00 [Add to cart]” (disabled).",
    mistakes: [
      { bad: `function ProductRow(name: string, price: number) { ... }`, good: `function ProductRow({ name, price }: { name: string; price: number }) { ... }`, why: "A component gets **one** props object, not separate arguments." },
      { bad: `function Row({ name }: any) { ... }`, good: `function Row({ name }: { name: string }) { ... }`, why: "`any` props mean no errors when callers pass the wrong thing." }
    ],
    practice: [
      { level: "B", q: "Type an `Avatar` with `src: string`, `alt: string`, optional `size: number` defaulting to 40.", a: "`function Avatar({ src, alt, size = 40 }: { src: string; alt: string; size?: number })`" },
      { level: "I", q: "Add a `onToggle: (id: number, done: boolean) => void` prop to a `TodoItem`.", a: "Add it to the props type and call `onToggle(todo.id, !todo.done)` in the checkbox handler." },
      { level: "I", q: "Restrict a `Tag` component's `colour` prop to 'green' | 'red' | 'grey'.", a: "`colour: 'green' | 'red' | 'grey'`. JSX now autocompletes the three values." },
      { level: "C", q: "Make a prop that's either `href` (renders `<a>`) or `onClick` (renders `<button>`), never both.", a: "Use a union of two prop types with `never` for the other key.", code: `type LinkOrButton =\n  | { label: string; href: string; onClick?: never }\n  | { label: string; onClick: () => void; href?: never };` }
    ],
    quiz: [
      { q: "Where do you put the props type?", options: ["After each destructured name", "After the destructured object: `({ a }: Props)`", "As a generic on the function"], answer: 1, why: "The parameter is one object; annotate it once." },
      { q: "How do you set a default for an optional prop?", options: ["`defaultProps`", "Destructuring default: `{ size = 40 }`", "In the type: `size: number = 40`"], answer: 1, why: "Destructuring defaults are the modern way; types can't hold values." },
      { q: "`<ProductRow name=\"Tea\" price={2} />` with `onAdd` required…", options: ["Works", "Error: onAdd missing", "Warning only at runtime"], answer: 1, why: "Required props must be passed." }
    ],
    rev: {
      sec30: "Declare a props `type`/`interface`, annotate the destructured parameter, and give optional props defaults in destructuring. Use literal unions for fixed choices and function types for callbacks. TS then checks every JSX usage.",
      interview: [
        { level: "basic", q: "How do you type props?", a: "A type or interface for the props object, annotated on the destructured parameter." },
        { level: "intermediate", q: "How do you handle default props in TS?", a: "Make the prop optional (`?`) and use a destructuring default. `defaultProps` is not supported for function components in React 19." },
        { level: "advanced", q: "How do you type a callback prop?", a: "As a function type: `onSelect: (id: string) => void`. Use `void` so callers can pass functions that return anything." },
        { level: "tricky", q: "How do you allow either prop A or prop B but not both?", a: "A union of prop types where the other key is `?: never` in each variant." }
      ],
      cheat: [
        "`function C({ a, b }: Props)`",
        "Optional: `b?: T`, default in destructuring",
        "Callback: `onX: (v: T) => void`",
        "Fixed choices: literal union",
        "`defaultProps` on function components: gone in React 19",
        "XOR props: union with `?: never`"
      ]
    },
    related: ["PROPS-002", "TS-013", "TS-014"]
  },

  "TS-009": {
    tldr: "`useState` infers its type from the starting value. When the start doesn't show the full picture (`null`, `[]`, one state of a union), pass the type yourself: `useState<User | null>(null)`.",
    analogy: { icon: "🧺", text: "An empty shopping basket. Looking at it, you can't tell what it will hold. A label (“fruit only”) tells everyone what may go in later." },
    visual: { type: "timeline", title: "useState<User | null>(null)", frames: [
      { label: "First render", state: "user = null", note: "Type is `User | null`, so the code must handle null." },
      { label: "Fetch done", state: "user = { name: 'Ana' }", note: "`setUser(data)` accepts a `User`." },
      { label: "Log out", state: "user = null", note: "`setUser(null)` is allowed by the union." },
      { label: "Wrong value", state: "setUser('Ana') ❌", note: "A string isn't `User | null`: compile error." }
    ]},
    points: [
      "Inference is enough for clear starts: `useState(0)` → number, `useState('')` → string.",
      "`useState(null)` alone infers `null` forever. Write `useState<User | null>(null)`.",
      "`useState([])` infers `never[]`. Write `useState<Todo[]>([])`.",
      "Union state: `useState<'idle' | 'saving' | 'saved'>('idle')` so only valid values fit.",
      "After a null check (`if (!user) return ...`), TS narrows `user` to `User` below it."
    ],
    code: { file: "Profile.tsx", lang: "tsx", src: `import { useState } from 'react';

type User = { id: number; name: string };
type Todo = { id: number; text: string; done: boolean };

export default function Profile() {
  const [count, setCount] = useState(0);                 // number (inferred)
  const [user, setUser] = useState<User | null>(null);    // starts empty
  const [todos, setTodos] = useState<Todo[]>([]);         // empty list
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  function login() {
    setUser({ id: 1, name: 'Ana' });
  }

  function addTodo(text: string) {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
    setCount(c => c + 1);
    setStatus('saving');
  }

  if (!user) return <button onClick={login}>Log in</button>;

  return (
    <section>
      <h2>Hi {user.name}</h2>
      <button onClick={() => addTodo('Buy milk')}>Add todo ({count})</button>
      <p>{status} · {todos.length} todos</p>
    </section>
  );
}`, walk: [
      { lines: [7], note: "Clear start value: let TS infer `number`." },
      { lines: [8], note: "Without `<User | null>`, the type would be just `null` and `setUser({...})` would fail." },
      { lines: [9], note: "Label empty arrays, otherwise they're `never[]`." },
      { lines: [10], note: "Only the three listed strings are valid for `setStatus`." },
      { lines: [22], note: "Early return narrows: below this line `user` is `User`, not `null`." }
    ]},
    output: "A “Log in” button. After clicking: “Hi Ana” and an “Add todo (0)” button.",
    mistakes: [
      { bad: `const [user, setUser] = useState(null);\nsetUser({ id: 1, name: 'Ana' }); // ❌`, good: `const [user, setUser] = useState<User | null>(null);\nsetUser({ id: 1, name: 'Ana' });`, why: "From `null` alone TS infers the type `null`. Tell it what else may come." },
      { bad: `const [user, setUser] = useState<User>({} as User);`, good: `const [user, setUser] = useState<User | null>(null);`, why: "`{} as User` lies: `user.name` is `undefined` at runtime but typed as string." }
    ],
    practice: [
      { level: "B", q: "Type state for a selected recipe id that starts as nothing.", a: "`useState<number | null>(null)`" },
      { level: "B", q: "Type state for a list of song titles that starts empty.", a: "`useState<string[]>([])`" },
      { level: "I", q: "Type a cart object state `{ items: CartItem[]; coupon?: string }` and add an item immutably.", a: "Use a functional update with spread.", code: `const [cart, setCart] = useState<Cart>({ items: [] });\nsetCart(c => ({ ...c, items: [...c.items, item] }));` },
      { level: "C", q: "Type a `useRef` for an input element and focus it.", a: "`const ref = useRef<HTMLInputElement>(null);` then `ref.current?.focus()`. React 19 types require the initial argument." }
    ],
    quiz: [
      { q: "Type of `useState([])` with no generic?", options: ["any[]", "never[]", "unknown[]"], answer: 1, why: "An empty array literal infers `never[]` in strict mode here." },
      { q: "Best type for user data that loads later?", options: ["useState<User>({} as User)", "useState<User | null>(null)", "useState<any>(null)"], answer: 1, why: "It's honest: the value really is null at first." },
      { q: "When can you skip the generic?", options: ["Never", "When the initial value shows the full type, like `useState(0)`", "Only for booleans"], answer: 1, why: "Inference covers it." }
    ],
    rev: {
      sec30: "`useState` infers from the initial value. Pass a generic when the start is `null`, an empty array, or one member of a union: `useState<User | null>(null)`, `useState<Todo[]>([])`. Narrow nullable state with early returns or `?.`. Avoid `{} as T` placeholders.",
      interview: [
        { level: "basic", q: "When do you need `useState<T>`?", a: "When the initial value doesn't describe all future values: null, empty arrays, union states." },
        { level: "intermediate", q: "How do you use state that can be null?", a: "`useState<T | null>(null)`, then narrow with `if (!x) return` or `x?.field`." },
        { level: "advanced", q: "Why not `useState<User>({} as User)`?", a: "It's a lie to the compiler: fields are undefined at runtime but typed as present, so crashes aren't caught." },
        { level: "tricky", q: "`const [s, setS] = useState('idle')`. Can you `setS('anything')`?", a: "Yes: it's inferred as `string`. Use a union generic to restrict it." }
      ],
      cheat: [
        "Clear start → infer: `useState(0)`",
        "`useState<T | null>(null)` for later data",
        "`useState<T[]>([])` for empty lists",
        "Union generic restricts values",
        "Narrow with early return or `?.`",
        "`useRef<HTMLInputElement>(null)`"
      ]
    },
    related: ["STATE-004", "TS-006", "TS-010"]
  },

  "TS-010": {
    tldr: "React passes typed event objects: `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, `React.SubmitEvent<HTMLFormElement>`. Inline handlers get them for free; separate functions need the label.",
    analogy: { icon: "📮", text: "A delivery note. It says what happened (clicked, typed, submitted) and which door it came from (input, button, form), so you know what's inside." },
    visual: { type: "compare", title: "Inline vs named handler", left: { label: "Inline (inferred)", tone: "good", points: [
      "`onChange={e => setQ(e.target.value)}`", "TS knows `e` from the JSX prop", "No import, no label"
    ]}, right: { label: "Named function (annotate)", tone: "neutral", points: [
      "`function onChange(e: React.ChangeEvent<HTMLInputElement>)`", "The generic = the element type", "Tip: hover the prop to copy the type"
    ]}},
    points: [
      "Typing in inputs: `React.ChangeEvent<HTMLInputElement>` (or `HTMLSelectElement`, `HTMLTextAreaElement`).",
      "Clicks: `React.MouseEvent<HTMLButtonElement>`. Keys: `React.KeyboardEvent<HTMLInputElement>`.",
      "Form submit: `React.SubmitEvent<HTMLFormElement>`, then `e.preventDefault()`. (`FormEvent` is deprecated in @types/react 19.2.)",
      "`e.currentTarget` is the element the handler is on (typed); `e.target` may be a child (typed loosely).",
      "Shortcut: type the whole function as `React.ChangeEventHandler<HTMLInputElement>`."
    ],
    code: { file: "Search.tsx", lang: "tsx", src: `import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [log, setLog] = useState<string[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleClear(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.shiftKey) setLog([]);
    setQuery('');
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLog(prev => [...prev, query]);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} placeholder="Find a recipe" />
      <button type="button" onClick={handleClear}>Clear</button>
      <button type="submit">Search</button>
      <ul>{log.map((q, i) => <li key={i}>{q}</li>)}</ul>
    </form>
  );
}`, walk: [
      { lines: [7, 8], note: "Change event on an input: `e.target.value` is a string." },
      { lines: [11, 12], note: "Mouse event: `shiftKey`, `clientX` etc. are typed." },
      { lines: [16, 17], note: "Submit event on the form. Stop the page reload with `preventDefault()`." },
      { lines: [22, 23, 24], note: "Passing a handler with the wrong event type to a prop is a compile error." }
    ]},
    output: "Type “soup”, press Enter: “soup” appears in the list. Clear empties the box; Shift+Clear also clears the list.",
    mistakes: [
      { bad: `function handleChange(e: any) {\n  setQuery(e.target.valu);\n}`, good: `function handleChange(e: React.ChangeEvent<HTMLInputElement>) {\n  setQuery(e.target.value);\n}`, why: "`any` hides the typo `valu`; the real type catches it." },
      { bad: `function onSubmit(e: Event) { e.preventDefault(); }`, good: `function onSubmit(e: React.SubmitEvent<HTMLFormElement>) { e.preventDefault(); }`, why: "React handlers receive React's synthetic events, not the DOM `Event` type." }
    ],
    practice: [
      { level: "B", q: "Type a `<select>` change handler for a size picker.", a: "`(e: React.ChangeEvent<HTMLSelectElement>) => setSize(e.target.value)`" },
      { level: "I", q: "Handle Enter in an input with a keyboard event.", a: "Check `e.key`.", code: `function onKey(e: React.KeyboardEvent<HTMLInputElement>) {\n  if (e.key === 'Enter') addTodo(e.currentTarget.value);\n}` },
      { level: "I", q: "Type a handler with the `...EventHandler` shortcut.", a: "`const onChange: React.ChangeEventHandler<HTMLInputElement> = e => setQ(e.target.value);`" },
      { level: "C", q: "Why use `e.currentTarget` in a click handler on a `<li>` containing a `<span>`?", a: "`currentTarget` is always the `<li>` (typed `HTMLLIElement`); `target` may be the span and is typed as a generic `EventTarget`." }
    ],
    quiz: [
      { q: "Type for an input's onChange event?", options: ["React.MouseEvent<HTMLInputElement>", "React.ChangeEvent<HTMLInputElement>", "InputEvent"], answer: 1, why: "Change events with the element as generic." },
      { q: "Do inline handlers need annotations?", options: ["Yes, always", "No, TS infers from the JSX prop", "Only in strict mode"], answer: 1, why: "Contextual typing gives `e` its type." },
      { q: "Which is typed as the element the handler is attached to?", options: ["e.target", "e.currentTarget", "Both equally"], answer: 1, why: "`currentTarget` uses the generic element type." }
    ],
    rev: {
      sec30: "React events are typed `React.XEvent<Element>`: ChangeEvent for inputs/selects, MouseEvent for clicks, KeyboardEvent for keys, SubmitEvent for submit (FormEvent is deprecated). Inline handlers infer them. Use `currentTarget` for the typed element. `React.ChangeEventHandler<El>` types a whole handler.",
      interview: [
        { level: "basic", q: "How do you type an input change handler?", a: "`(e: React.ChangeEvent<HTMLInputElement>) => ...`, or write it inline and let TS infer." },
        { level: "intermediate", q: "`e.target` vs `e.currentTarget` in TS?", a: "`currentTarget` is the element with the handler, typed by the generic. `target` is wherever the event started, typed loosely." },
        { level: "advanced", q: "How do you find the right event type quickly?", a: "Hover the JSX prop (e.g. `onChange`) in the editor; it shows the handler type to copy." },
        { level: "tricky", q: "Why can't you use the DOM `MouseEvent` type?", a: "React passes synthetic events (`React.MouseEvent`), which wrap the native one (`e.nativeEvent`)." }
      ],
      cheat: [
        "Input/select/textarea: `React.ChangeEvent<El>`",
        "Click: `React.MouseEvent<HTMLButtonElement>`",
        "Key: `React.KeyboardEvent<El>`",
        "Submit: `React.SubmitEvent<HTMLFormElement>` (not `FormEvent`)",
        "Inline handlers infer `e`",
        "`currentTarget` is the typed element"
      ]
    },
    related: ["EVT-007", "EVT-004", "TS-011"]
  },

  "TS-011": {
    tldr: "Describe the form once as a `FormValues` type. Derive the errors type from it (`Partial<Record<keyof FormValues, string>>`) and use `keyof` so field names can't be misspelled.",
    analogy: { icon: "🧾", text: "A sign-up card with a sticky note per box. The card lists the boxes; the sticky notes (errors) can only go on boxes that exist on the card." },
    visual: { type: "flow", title: "One type, everything derived", steps: [
      { label: "FormValues", detail: "`{ name: string; email: string; guests: number }`" },
      { label: "Errors", detail: "`Partial<Record<keyof FormValues, string>>`: same keys, all optional." },
      { label: "Change", detail: "`name as keyof FormValues` updates exactly one field." },
      { label: "Validate", detail: "`validate(values): Errors` returns only the broken fields." },
      { label: "Submit", detail: "No keys in errors → send typed `FormValues`." }
    ]},
    points: [
      "One `FormValues` type is the source of truth for state, validation and submit.",
      "`keyof FormValues` = `'name' | 'email' | 'guests'`: a typo in a field name is an error.",
      "`Partial<Record<K, string>>` builds the errors object without repeating keys.",
      "Input values are **strings**: convert numbers with `Number(...)` or `valueAsNumber`.",
      "With `<form action>` and `FormData`, `formData.get('x')` is `FormDataEntryValue | null`; check it before use."
    ],
    code: { file: "BookingForm.tsx", lang: "tsx", src: `import { useState } from 'react';

type FormValues = { name: string; email: string; guests: number };
type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(v: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!v.name.trim()) errors.name = 'Name is required';
  if (!v.email.includes('@')) errors.email = 'Enter a valid email';
  if (v.guests < 1) errors.guests = 'At least 1 guest';
  return errors;
}

export default function BookingForm() {
  const [values, setValues] = useState<FormValues>({ name: '', email: '', guests: 2 });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as keyof FormValues;
    const value = e.target.type === 'number' ? e.target.valueAsNumber : e.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) alert('Booked for ' + values.guests);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="name" value={values.name} onChange={handleChange} />
      {errors.name && <small>{errors.name}</small>}
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <small>{errors.email}</small>}
      <input name="guests" type="number" value={values.guests} onChange={handleChange} />
      {errors.guests && <small>{errors.guests}</small>}
      <button>Book table</button>
    </form>
  );
}`, walk: [
      { lines: [3, 4], note: "Errors reuse the same keys: add a field to FormValues and errors gets it too." },
      { lines: [6, 7, 8, 9, 10, 11, 12], note: "Validation returns only the fields that failed. `errors.phone = ...` would be an error." },
      { lines: [19, 20], note: "`as keyof FormValues` asserts `name` is a real key (unchecked). Numbers use `valueAsNumber`." },
      { lines: [21], note: "Computed key update keeps the rest of the values." },
      { lines: [28], note: "No error keys → the form is valid." }
    ]},
    output: "Submitting empty shows “Name is required” and “Enter a valid email”. A valid form alerts “Booked for 2”.",
    mistakes: [
      { bad: `type FormErrors = { name?: string; email?: string; guest?: string };`, good: `type FormErrors = Partial<Record<keyof FormValues, string>>;`, why: "Hand-copied keys drift (`guest` vs `guests`). Deriving keeps them in sync." },
      { bad: `const guests: number = e.target.value;`, good: `const guests = e.target.valueAsNumber; // or Number(e.target.value)`, why: "Input `value` is always a string, even for `type=\"number\"`." }
    ],
    practice: [
      { level: "B", q: "Write `FormValues` for a recipe form: title, minutes, vegan.", a: "`type RecipeForm = { title: string; minutes: number; vegan: boolean }`" },
      { level: "I", q: "Handle a checkbox for `vegan` in the same `handleChange`.", a: "Use `e.target.checked` when `e.target.type === 'checkbox'`." },
      { level: "I", q: "Read a field from `FormData` safely.", a: "Check it's a string.", code: `function action(formData: FormData) {\n  const email = formData.get('email');\n  if (typeof email !== 'string') return;\n  subscribe(email);\n}` },
      { level: "C", q: "Write a generic `setField<K extends keyof FormValues>(key: K, value: FormValues[K])`.", a: "`setValues(prev => ({ ...prev, [key]: value }))`. Now `setField('guests', 'two')` is an error." }
    ],
    quiz: [
      { q: "`keyof { name: string; email: string }` is…", options: ["string", "'name' | 'email'", "string[]"], answer: 1, why: "keyof gives a union of the keys." },
      { q: "Why `Partial<...>` for errors?", options: ["Errors are always all present", "Only broken fields have an error", "Partial makes values strings"], answer: 1, why: "Partial makes every key optional." },
      { q: "Type of `e.target.value` for `<input type=\"number\">`?", options: ["number", "string", "number | string"], answer: 1, why: "Use `valueAsNumber` for a number." }
    ],
    rev: {
      sec30: "Define `FormValues` once. Derive errors with `Partial<Record<keyof FormValues, string>>`. Use `keyof` for field names and computed-key updates. Input values are strings: convert numbers. `FormData.get` returns `FormDataEntryValue | null`; narrow before use.",
      interview: [
        { level: "basic", q: "How do you type form state?", a: "One object type for all fields, used as `useState<FormValues>(initial)`." },
        { level: "intermediate", q: "How do you type validation errors without repeating keys?", a: "`Partial<Record<keyof FormValues, string>>`." },
        { level: "advanced", q: "How do you type one shared change handler?", a: "Cast `e.target.name as keyof FormValues` and update with a computed key; or a generic `setField<K>`." },
        { level: "tricky", q: "What does `formData.get('qty')` return?", a: "`FormDataEntryValue | null` (string or File). Check `typeof === 'string'` and convert." }
      ],
      cheat: [
        "One `FormValues` type rules them all",
        "Errors: `Partial<Record<keyof FormValues, string>>`",
        "`keyof` stops field-name typos",
        "Input value is a string; use `valueAsNumber`",
        "`formData.get()` → `FormDataEntryValue | null`",
        "Libraries (React Hook Form) take `useForm<FormValues>()`"
      ]
    },
    related: ["EVT-017", "EVT-022", "TS-019"]
  },

  "TS-012": {
    tldr: "`res.json()` returns `any`: TypeScript can't know what the server sent. Treat it as `unknown`, validate it with a **Zod schema**, and derive the type from that schema with `z.infer`.",
    analogy: { icon: "📦", text: "A grocery delivery. The order list says what should arrive (the type); someone still has to open the bag and check it (Zod) before it goes in the fridge." },
    visual: { type: "flow", title: "Network to typed data", steps: [
      { label: "fetch", detail: "`const res = await fetch('/api/products')`" },
      { label: "json()", detail: "Gives `any`: no guarantees about the shape." },
      { label: "Schema check", detail: "`ProductList.safeParse(data)` checks every field at runtime." },
      { label: "Typed result", detail: "On success, `data` is `Product[]`; on failure you get a readable error." }
    ]},
    points: [
      "Typing `await res.json() as Product[]` is a **promise**, not a check: wrong data still crashes later.",
      "Zod: `const Product = z.object({ id: z.number(), name: z.string() })`.",
      "`type Product = z.infer<typeof Product>`: one source for runtime check **and** type.",
      "`.parse()` throws on bad data; `.safeParse()` returns `{ success, data | error }`.",
      "Check `res.ok` too: a 404/500 is not a thrown error for `fetch`."
    ],
    code: { file: "products.ts", lang: "ts", src: `import { z } from 'zod';

const Product = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().nonnegative(),
  tags: z.array(z.string()).optional(),
});
const ProductList = z.array(Product);

export type Product = z.infer<typeof Product>;
// { id: number; name: string; price: number; tags?: string[] }

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('HTTP ' + res.status);

  const data: unknown = await res.json();
  const result = ProductList.safeParse(data);

  if (!result.success) {
    console.error(result.error.issues);
    throw new Error('Unexpected product data');
  }
  return result.data;   // typed Product[]
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8], note: "The schema is a runtime value that describes the shape and rules." },
      { lines: [11], note: "Derive the TS type from the schema: no duplicate interface to keep in sync." },
      { lines: [16], note: "`fetch` only rejects on network failure. Check the status yourself." },
      { lines: [18, 19], note: "Treat JSON as `unknown`, then validate it." },
      { lines: [21, 22, 23, 24, 25], note: "`safeParse` narrows: after the check, `result.data` is `Product[]`." }
    ]},
    mistakes: [
      { bad: `const products = (await res.json()) as Product[];`, good: `const products = ProductList.parse(await res.json());`, why: "`as` only silences the compiler. If the API renames `price`, you find out when the UI crashes." },
      { bad: `interface Product { id: number; name: string }\nconst ProductSchema = z.object({ id: z.number(), title: z.string() });`, good: `const ProductSchema = z.object({ id: z.number(), name: z.string() });\ntype Product = z.infer<typeof ProductSchema>;`, why: "Two separate definitions drift apart. Infer the type from the schema." }
    ],
    practice: [
      { level: "B", q: "Install Zod.", a: "`npm install zod`" },
      { level: "I", q: "Write a schema for weather data: city, tempC, condition ('sun' | 'rain' | 'cloud').", a: "Use `z.enum` for the union.", code: `const Weather = z.object({\n  city: z.string(),\n  tempC: z.number(),\n  condition: z.enum(['sun', 'rain', 'cloud']),\n});\ntype Weather = z.infer<typeof Weather>;` },
      { level: "I", q: "Use `getProducts` with TanStack Query. What type is `data`?", a: "`useQuery({ queryKey: ['products'], queryFn: getProducts })` → `data` is `Product[] | undefined`." },
      { level: "C", q: "The API sends `price` as a string like \"3.50\". Accept it but give the app a number.", a: "Use `z.coerce.number()` for `price`." }
    ],
    quiz: [
      { q: "What type does `res.json()` return?", options: ["The server's real type", "Promise<any>", "Promise<object>"], answer: 1, why: "TS can't see the server." },
      { q: "What does `as Product[]` do at runtime?", options: ["Validates the data", "Nothing; it's compile-time only", "Converts the data"], answer: 1, why: "Assertions are erased." },
      { q: "`z.infer<typeof Schema>` gives…", options: ["A runtime validator", "The TS type that matches the schema", "A JSON example"], answer: 1, why: "It derives the static type." }
    ],
    rev: {
      sec30: "Types are erased, so API data is untrusted. Read JSON as `unknown`, validate with a Zod schema (`parse`/`safeParse`), and derive the type with `z.infer`. Check `res.ok` because fetch doesn't throw on HTTP errors. `as` assertions don't validate anything.",
      interview: [
        { level: "basic", q: "How do you type a fetch response?", a: "Validate it with a schema (Zod) and infer the type from the schema; at minimum, annotate the return of your fetch function." },
        { level: "intermediate", q: "`parse` vs `safeParse`?", a: "`parse` throws on invalid data; `safeParse` returns `{ success: true, data }` or `{ success: false, error }`." },
        { level: "advanced", q: "Why not just write an interface for the API?", a: "It's only a compile-time assumption. If the backend changes, nothing catches it until a crash. A schema checks at the boundary." },
        { level: "tricky", q: "`getProducts()` is typed `Promise<Product[]>` yet `p.price.toFixed` crashes. How?", a: "The data was cast with `as` (or was `any`), and the API sent `null` or a string. Types promised a shape nobody checked; validate at the boundary." }
      ],
      cheat: [
        "`res.json()` is `any`: don't trust it",
        "`const S = z.object({...})`",
        "`type T = z.infer<typeof S>`",
        "`parse` throws, `safeParse` returns a result",
        "Check `res.ok` before parsing",
        "`as T` is not validation"
      ]
    },
    related: ["API-006", "API-014", "STORE-020"]
  },

  "TS-013": {
    tldr: "You don't need `React.FC`. The recommended style is a plain function with typed props: `function Card({ title }: CardProps)`. TypeScript infers the return type.",
    analogy: { icon: "🏷️", text: "A name badge. “Chef” on the badge is optional; what matters is the recipe card (props) they follow. Label the inputs, not the person." },
    visual: { type: "compare", title: "Two ways to type a component", left: { label: "React.FC<Props>", tone: "neutral", points: [
      "`const Card: React.FC<Props> = ({ title }) => ...`", "Works, but arrow-only", "No implicit `children` since React 18 types", "Awkward with generic components"
    ]}, right: { label: "Typed props (preferred)", tone: "good", points: [
      "`function Card({ title }: Props) { ... }`", "Works with `function` and arrows", "Generics are easy: `function List<T>(...)`", "Return type inferred"
    ]}},
    points: [
      "`React.FC` is **optional**, not wrong. Most codebases and the React docs just type the props.",
      "Since `@types/react` 18, `FC` no longer adds `children` silently; you declare it either way.",
      "A component may return any `React.ReactNode`: JSX, a string, `null`, an array (TS 5.1+).",
      "If you want an explicit return type, use `React.ReactNode` or `React.JSX.Element` (the global `JSX` namespace is gone in React 19 types).",
      "`React.ComponentProps<typeof Card>` reads a component's props type back out."
    ],
    code: { file: "Badge.tsx", lang: "tsx", src: `type BadgeProps = {
  label: string;
  tone?: 'info' | 'warn';
};

// ✅ Preferred: plain function + typed props
export function Badge({ label, tone = 'info' }: BadgeProps) {
  return <span className={'badge ' + tone}>{label}</span>;
}

// Also valid: React.FC (arrow functions only)
export const BadgeFC: React.FC<BadgeProps> = ({ label, tone = 'info' }) => (
  <span className={'badge ' + tone}>{label}</span>
);

// Returning null or a string is fine
function StockNote({ left }: { left: number }) {
  if (left > 5) return null;
  return left === 0 ? 'Sold out' : 'Only ' + left + ' left';
}

// Reuse a component's props type
type BadgeLikeProps = React.ComponentProps<typeof Badge>;

export default function App() {
  return (
    <p>
      Oat latte <Badge label="new" /> <StockNote left={2} />
    </p>
  );
}`, walk: [
      { lines: [7, 8, 9], note: "The common style: annotate props, let TS infer the return." },
      { lines: [12, 13, 14], note: "`React.FC` types the variable instead. Same result, more ceremony." },
      { lines: [17, 18, 19, 20], note: "Components can return `null` or text; TS accepts any ReactNode." },
      { lines: [23], note: "Pull props off a component, handy for wrappers." }
    ]},
    output: "“Oat latte [new] Only 2 left”",
    mistakes: [
      { bad: `const Panel: React.FC = ({ children }) => <div>{children}</div>; // ❌ children not in props`, good: `function Panel({ children }: { children: React.ReactNode }) {\n  return <div>{children}</div>;\n}`, why: "Since React 18 types, `FC` doesn't include `children`. Declare it explicitly." },
      { bad: `function Card(): JSX.Element { ... }`, good: `function Card(): React.JSX.Element { ... } // or omit the return type`, why: "React 19 types removed the global `JSX` namespace. Use `React.JSX` or let TS infer." }
    ],
    practice: [
      { level: "B", q: "Convert `const Price: React.FC<{ value: number }> = ({ value }) => ...` to the preferred style.", a: "`function Price({ value }: { value: number }) { return <b>€{value}</b>; }`" },
      { level: "I", q: "Write a component that returns `null` when `items` is empty.", a: "`if (!items.length) return null;` TS is fine with it." },
      { level: "C", q: "Why is `React.FC` awkward for a generic `List<T>`?", a: "You can't put a type parameter on a `const` annotated with `FC<Props>`; a generic function declaration `function List<T>(p: ListProps<T>)` works directly." }
    ],
    quiz: [
      { q: "Is `React.FC` required to type a component?", options: ["Yes", "No, typing props is enough", "Only for exported components"], answer: 1, why: "It's optional." },
      { q: "Does `React.FC<Props>` add `children` automatically (React 18+ types)?", options: ["Yes", "No"], answer: 1, why: "That implicit children was removed in @types/react 18." },
      { q: "Which return is allowed from a component?", options: ["Only JSX", "JSX, string, number, null (any ReactNode)", "Only JSX or null"], answer: 1, why: "Since TS 5.1 + React types, any ReactNode works." }
    ],
    rev: {
      sec30: "Type components by typing their props: `function C(props: Props)`. `React.FC` is optional and no longer adds `children`. Return types are inferred; components may return any ReactNode. In React 19 types use `React.JSX.Element`, not global `JSX`. `React.ComponentProps<typeof C>` extracts props.",
      interview: [
        { level: "basic", q: "How do you type a function component?", a: "Annotate the props parameter. The return type is inferred." },
        { level: "intermediate", q: "Should you use `React.FC`?", a: "It's optional. Typing props directly is simpler, works with `function` declarations and generics." },
        { level: "advanced", q: "What changed about `FC` in React 18 types?", a: "Implicit `children` was removed, so `FC` and plain functions behave the same for children." },
        { level: "tricky", q: "`JSX.Element` stopped compiling after upgrading to React 19. Why?", a: "The global `JSX` namespace was removed from `@types/react` 19. Use `React.JSX.Element` or no annotation." }
      ],
      cheat: [
        "Preferred: `function C({ a }: Props)`",
        "`React.FC` is optional",
        "`FC` has no implicit children (React 18+ types)",
        "Return any `React.ReactNode`",
        "`React.JSX.Element`, not global `JSX`",
        "`React.ComponentProps<typeof C>`"
      ]
    },
    related: ["TS-008", "TS-014", "COMP-003"]
  },

  "TS-014": {
    tldr: "Type `children` as `React.ReactNode`: it accepts anything React can render (JSX, text, numbers, `null`, arrays). Use narrower types only when you really need one specific thing.",
    analogy: { icon: "🎁", text: "A gift box. It doesn't care what you put inside: a book, a mug, or several things. `ReactNode` is that “anything that fits in the box” label." },
    visual: { type: "tree", title: "What React.ReactNode accepts", root: { label: "React.ReactNode", children: [
      { label: "JSX element", note: "<p>Hi</p>" },
      { label: "string / number", note: "'Sold out', 3" },
      { label: "null / undefined / boolean", note: "renders nothing" },
      { label: "array of nodes", note: "items.map(...)" },
      { label: "Promise (React 19)", note: "suspends like use()" }
    ]}},
    points: [
      "`children: React.ReactNode` is the right default for wrappers: cards, modals, layouts.",
      "`React.PropsWithChildren<Props>` adds an optional `children?: ReactNode` for you.",
      "`React.ReactElement` = exactly one JSX element (no text, no null). Rarely needed.",
      "Function as children (render prop): `children: (item: T) => React.ReactNode`.",
      "Not `React.JSX.Element` for children: it rejects strings and `null`."
    ],
    code: { file: "Card.tsx", lang: "tsx", src: `type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

// Render-prop children: a function
type ListProps = {
  items: string[];
  children: (item: string) => React.ReactNode;
};

function List({ items, children }: ListProps) {
  return <ul>{items.map(i => <li key={i}>{children(i)}</li>)}</ul>;
}

export default function App() {
  return (
    <Card title="Today's specials">
      <List items={['Soup', 'Salad']}>
        {item => <strong>{item}</strong>}
      </List>
      Only until 3 pm
    </Card>
  );
}`, walk: [
      { lines: [3], note: "`ReactNode` accepts elements, text, numbers, null and arrays." },
      { lines: [10], note: "Render whatever the parent passed between the tags." },
      { lines: [18], note: "Children can also be a function; type its parameter and return." },
      { lines: [22], note: "Call the function for each item." },
      { lines: [28, 29, 30, 31], note: "Mixed children (a list and plain text) both fit `ReactNode`." }
    ]},
    output: "A card “Today's specials” with bold Soup and Salad, then “Only until 3 pm”.",
    mistakes: [
      { bad: `type Props = { children: React.JSX.Element };\n<Card>Hello</Card> // ❌`, good: `type Props = { children: React.ReactNode };\n<Card>Hello</Card>`, why: "A JSX element type rejects plain text, numbers and multiple children." },
      { bad: `function Modal(props: { title: string }) {\n  return <div>{props.children}</div>; // ❌\n}`, good: `function Modal(props: React.PropsWithChildren<{ title: string }>) {\n  return <div>{props.children}</div>;\n}`, why: "`children` isn't added automatically. Declare it." }
    ],
    practice: [
      { level: "B", q: "Type a `Layout` that wraps `children` in `<main>`.", a: "`function Layout({ children }: { children: React.ReactNode }) { return <main>{children}</main>; }`" },
      { level: "I", q: "Rewrite with `PropsWithChildren`.", a: "`function Layout({ children }: React.PropsWithChildren) { ... }`" },
      { level: "I", q: "A `Tabs` component accepting `header` and `footer` slots.", a: "Type both as `React.ReactNode`, like `children`." },
      { level: "C", q: "Make `children` optional but the component show “Empty” when nothing is passed.", a: "`children?: React.ReactNode`, then `{children ?? 'Empty'}`." }
    ],
    quiz: [
      { q: "Best default type for `children`?", options: ["React.JSX.Element", "React.ReactNode", "string"], answer: 1, why: "It covers everything React can render." },
      { q: "Which is NOT valid for `children: React.ReactElement`?", options: ["<p>Hi</p>", "'Hi'", "<Card />"], answer: 1, why: "ReactElement is one element only; text isn't one." },
      { q: "`React.PropsWithChildren<P>` adds…", options: ["A required children: ReactElement", "An optional children?: ReactNode", "Nothing at runtime and nothing in types"], answer: 1, why: "It merges an optional `children` into P." }
    ],
    rev: {
      sec30: "Use `children: React.ReactNode` for anything renderable. `PropsWithChildren<P>` adds it as optional. `ReactElement` means exactly one element. Render-prop children are typed as functions returning `ReactNode`. Children are never added automatically.",
      interview: [
        { level: "basic", q: "How do you type `children`?", a: "`children: React.ReactNode`." },
        { level: "intermediate", q: "ReactNode vs ReactElement?", a: "ReactNode is anything renderable (text, null, arrays). ReactElement is a single JSX element object." },
        { level: "advanced", q: "How do you type a render-prop child?", a: "`children: (value: T) => React.ReactNode`, then call `children(value)`." },
        { level: "tricky", q: "Can TS force children to be only `<Tab>` elements?", a: "Not reliably. JSX always types as a generic element; enforce structure at runtime or with a compound-component API." }
      ],
      cheat: [
        "`children: React.ReactNode`",
        "`React.PropsWithChildren<P>` = optional children",
        "`ReactElement` = exactly one element",
        "Render prop: `(x: T) => React.ReactNode`",
        "Children are never implicit",
        "Avoid `React.JSX.Element` for children"
      ]
    },
    related: ["PROPS-010", "ADV-009", "TS-013"]
  },

  "TS-015": {
    tldr: "Type a custom hook like any function: annotate the **inputs**, and make the **return** precise. Returning a tuple? Add `as const` (or a tuple type) so `[value, setValue]` keeps each position's type.",
    analogy: { icon: "🎧", text: "A pair of earbuds sold as a set: left is always left, right always right. Without `as const`, the box just says “two earbuds, either side”." },
    visual: { type: "compare", title: "Returning [value, toggle]", left: { label: "Without as const", tone: "bad", points: [
      "Inferred: `(boolean | (() => void))[]`", "`const [on, toggle] = useToggle()`", "`toggle()` ❌ might be a boolean"
    ]}, right: { label: "With as const", tone: "good", points: [
      "Inferred: `readonly [boolean, () => void]`", "Each position keeps its own type", "`toggle()` ✅"
    ]}},
    points: [
      "Hooks are functions: type parameters as usual, e.g. `useDebounce(value: string, ms = 300)`.",
      "Tuple return: `return [on, toggle] as const` or annotate `: [boolean, () => void]`.",
      "Object return (`{ data, error, loading }`) needs no trick and scales better past 2-3 values.",
      "Make data hooks **generic**: `useLocalStorage<T>(key, initial: T)` returns `[T, (v: T) => void]`.",
      "Prefer a union for status in returned objects so callers can narrow."
    ],
    code: { file: "hooks.ts", lang: "ts", src: `import { useCallback, useEffect, useState } from 'react';

// Tuple return: as const keeps positions
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(v => !v), []);
  return [on, toggle] as const;   // readonly [boolean, () => void]
}

// Generic hook with an explicit tuple type
export function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
// const [darkMode, toggleDark] = useToggle();
// const [notes, setNotes] = useLocalStorage<string[]>('notes', []);
// setNotes(['Buy milk']);   ✅
// setNotes('Buy milk');     ❌ string is not string[]`, walk: [
      { lines: [4], note: "`initial = false` gives the param its type: boolean." },
      { lines: [7], note: "`as const` turns the array into a fixed, typed tuple." },
      { lines: [11], note: "`T` comes from `initial` (or an explicit `<string[]>`); the return type is a precise tuple." },
      { lines: [14], note: "`JSON.parse` returns `any`; the `as T` is a trust boundary. Validate with Zod if it matters." },
      { lines: [25, 26, 27, 28], note: "Callers get exact types per position." }
    ]},
    mistakes: [
      { bad: `function useToggle() {\n  const [on, setOn] = useState(false);\n  return [on, () => setOn(v => !v)];\n}`, good: `function useToggle() {\n  const [on, setOn] = useState(false);\n  return [on, () => setOn(v => !v)] as const;\n}`, why: "Without `as const`, TS infers an array of mixed items, so `toggle()` isn't callable." }
    ],
    practice: [
      { level: "B", q: "Type `useCounter(start = 0)` returning `{ count, inc, dec }`.", a: "Return an object; TS infers `{ count: number; inc: () => void; dec: () => void }`." },
      { level: "I", q: "Write `useDebounce<T>(value: T, ms = 300): T`.", a: "State + effect with a timeout.", code: `export function useDebounce<T>(value: T, ms = 300): T {\n  const [v, setV] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setV(value), ms);\n    return () => clearTimeout(id);\n  }, [value, ms]);\n  return v;\n}` },
      { level: "I", q: "Type the return of `useFetch<T>(url)` as a union.", a: "`{ status: 'loading' } | { status: 'error'; error: Error } | { status: 'success'; data: T }`" },
      { level: "C", q: "Let `useLocalStorage` setters accept an updater function too.", a: "Return `React.Dispatch<React.SetStateAction<T>>`, the same type `useState` gives." }
    ],
    quiz: [
      { q: "`return [count, setCount]` without `as const` is inferred as…", options: ["A tuple", "An array of a union type", "any"], answer: 1, why: "Arrays widen; tuples need `as const` or an annotation." },
      { q: "When is an object return better than a tuple?", options: ["Never", "When returning more than 2-3 values", "Only for booleans"], answer: 1, why: "Named fields are clearer and order-free." },
      { q: "Setter type that accepts a value or an updater?", options: ["(v: T) => void", "React.Dispatch<React.SetStateAction<T>>", "React.SetState<T>"], answer: 1, why: "That's the exact `useState` setter type." }
    ],
    rev: {
      sec30: "Custom hooks are typed like functions. Annotate inputs; for tuple returns use `as const` or a tuple type, or return an object. Make data hooks generic (`useLocalStorage<T>`). `React.Dispatch<React.SetStateAction<T>>` is the `useState` setter type.",
      interview: [
        { level: "basic", q: "How do you type a custom hook's parameters?", a: "Same as any function: annotate them or give defaults." },
        { level: "intermediate", q: "Why `as const` on a returned tuple?", a: "Without it TS infers `(A | B)[]`; `as const` keeps a readonly tuple with each position typed." },
        { level: "advanced", q: "Tuple vs object return?", a: "Tuples are nice for 2 values that callers rename (like `useState`). Objects scale better and are self-describing." },
        { level: "tricky", q: "What's the type of a `useState` setter?", a: "`React.Dispatch<React.SetStateAction<T>>`: accepts `T` or `(prev: T) => T`." }
      ],
      cheat: [
        "Annotate inputs like normal functions",
        "Tuple: `return [a, b] as const`",
        "Or `: [T, (v: T) => void]`",
        "3+ values → return an object",
        "Generic hooks: `useX<T>(...)`",
        "Setter: `React.Dispatch<React.SetStateAction<T>>`"
      ]
    },
    related: ["HOOKS-022", "HOOKS-026", "TS-007"]
  },

  "TS-016": {
    tldr: "Create context as `createContext<CartContextValue | null>(null)`, then wrap `useContext` in a custom hook that throws if the provider is missing. Consumers get a non-null, fully typed value.",
    analogy: { icon: "📻", text: "A radio station. The custom hook is your radio: if no station (provider) is on air, it says “no signal” loudly instead of playing static." },
    visual: { type: "flow", title: "Safe typed context", steps: [
      { label: "Type", detail: "`type CartCtx = { items: Item[]; add: (i: Item) => void }`" },
      { label: "Create", detail: "`createContext<CartCtx | null>(null)`: no fake default." },
      { label: "Provide", detail: "`<CartContext value={...}>` (React 19 syntax)." },
      { label: "Hook", detail: "`useCart()` reads it and throws if it's `null`." },
      { label: "Consume", detail: "`const { items } = useCart()` is `CartCtx`, never null." }
    ]},
    points: [
      "`createContext<T>(default)` needs a default. A fake one (`{} as T`) hides missing-provider bugs.",
      "Use `null` as the default and a **custom hook** that narrows it away.",
      "The throw gives a clear message (“useCart must be used inside CartProvider”).",
      "React 19: render `<CartContext value={v}>` directly; `<CartContext.Provider>` still works.",
      "A real default is fine when there's a sensible one, e.g. theme `'light'`."
    ],
    code: { file: "CartContext.tsx", lang: "tsx", src: `import { createContext, use, useState } from 'react';

type Item = { id: number; name: string; price: number };
type CartContextValue = {
  items: Item[];
  add: (item: Item) => void;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const add = (item: Item) => setItems(prev => [...prev, item]);
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return <CartContext value={{ items, add, total }}>{children}</CartContext>;
}

export function useCart() {
  const ctx = use(CartContext);          // or useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;                            // CartContextValue (not null)
}

// Consumer
export function CartBadge() {
  const { items, total } = useCart();
  return <span>🛒 {items.length} · €{total.toFixed(2)}</span>;
}`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "Describe exactly what consumers get." },
      { lines: [10], note: "Default is `null`: no lying placeholder object." },
      { lines: [17], note: "React 19 lets you render the context itself as the provider." },
      { lines: [20, 21, 22, 23], note: "The guard narrows `ctx` from `T | null` to `T` and explains the mistake." },
      { lines: [28, 29], note: "Consumers destructure safely; no `?.` everywhere." }
    ]},
    output: "🛒 0 · €0.00 (updates as items are added)",
    mistakes: [
      { bad: `const CartContext = createContext<CartContextValue>({} as CartContextValue);`, good: `const CartContext = createContext<CartContextValue | null>(null);\n// + useCart() that throws on null`, why: "The fake default compiles, but forgetting the provider gives `items` = undefined at runtime." },
      { bad: `const ctx = useContext(CartContext);\nctx.items.length; // ❌ possibly null`, good: `const { items } = useCart();\nitems.length;`, why: "Centralise the null check in one hook instead of repeating it in every consumer." }
    ],
    practice: [
      { level: "B", q: "Type a theme context with a real default.", a: "`createContext<'light' | 'dark'>('light')`: a sensible default, no null needed." },
      { level: "I", q: "Add a `remove(id: number)` function to the cart context.", a: "Add it to `CartContextValue` and implement `setItems(prev => prev.filter(i => i.id !== id))`." },
      { level: "I", q: "Write `useAuth()` for `AuthContext` with `user: User | null` and `login()`.", a: "Same pattern: context of `AuthValue | null`, hook throws if missing. Note `user` itself can still be null (logged out)." },
      { level: "C", q: "Write a generic `createSafeContext<T>(name)` that returns `[Context, useHook]`.", a: "Create `createContext<T | null>(null)` and a hook that throws with `name`; return both `as const`." }
    ],
    quiz: [
      { q: "Why default to `null` instead of `{} as T`?", options: ["It's shorter", "So a missing provider is caught, not hidden", "React requires null"], answer: 1, why: "The hook can detect null and throw clearly." },
      { q: "Type of `ctx` after `if (!ctx) throw ...`?", options: ["T | null", "T", "unknown"], answer: 1, why: "The throw narrows null away." },
      { q: "React 19 provider syntax?", options: ["<Ctx.Consumer>", "<Ctx value={v}>", "provide(Ctx, v)"], answer: 1, why: "A context can be rendered directly as its provider." }
    ],
    rev: {
      sec30: "Type context with `createContext<T | null>(null)`, provide it (`<Ctx value>` in React 19), and expose a `useX()` hook that throws when the value is null. Consumers get `T`. Use a real default only when one makes sense (theme, locale).",
      interview: [
        { level: "basic", q: "How do you type `createContext`?", a: "Pass the value type as a generic: `createContext<T | null>(null)` or with a real default." },
        { level: "intermediate", q: "Why wrap `useContext` in a custom hook?", a: "One place to narrow out null, throw a clear error, and hide the context object." },
        { level: "advanced", q: "Downside of `createContext({} as T)`?", a: "It lies: consumers outside the provider get an empty object typed as full, so bugs reach runtime." },
        { level: "tricky", q: "Can you call `use(Context)` inside an `if`?", a: "Yes. Unlike `useContext`, React 19's `use` may be called conditionally (but still only in components or hooks)." }
      ],
      cheat: [
        "`createContext<T | null>(null)`",
        "`useX()` hook throws if null",
        "React 19: `<Ctx value={v}>` as provider",
        "`use(Ctx)` or `useContext(Ctx)`",
        "Real default OK for theme/locale",
        "Avoid `{} as T` defaults"
      ]
    },
    related: ["HOOKS-006", "STORE-002", "TS-015"]
  },

  "TS-017": {
    tldr: "Type reducer actions as a **discriminated union** on `type`. In each `case`, TypeScript knows that action's exact payload, and a `never` check makes sure no action is forgotten.",
    analogy: { icon: "🧑‍🍳", text: "Kitchen order tickets. Each ticket type (“add dish”, “remove dish”, “clear table”) has its own boxes. The chef reads the type first, then knows which boxes to look at." },
    visual: { type: "flow", title: "dispatch → narrowed case", steps: [
      { label: "Dispatch", detail: "`dispatch({ type: 'add', item })`" },
      { label: "Union check", detail: "TS checks the object matches one `Action` variant." },
      { label: "switch(type)", detail: "In `case 'add'`, `action.item` exists and is typed." },
      { label: "New state", detail: "Return type is `CartState`; a wrong shape is an error." },
      { label: "default: never", detail: "A new action type that isn't handled breaks the build." }
    ]},
    points: [
      "`type Action = { type: 'add'; item: Item } | { type: 'remove'; id: number } | { type: 'clear' }`.",
      "Type the reducer `(state: State, action: Action): State`; `useReducer` infers the rest.",
      "`dispatch({ type: 'remove' })` without `id`, or a typo in `type`, is a compile error.",
      "Exhaustive check: `default: { const _never: never = action; return _never; }`.",
      "Same pattern as Redux Toolkit actions and C# pattern matching on records."
    ],
    code: { file: "cartReducer.tsx", lang: "tsx", src: `import { useReducer } from 'react';

type Item = { id: number; name: string; qty: number };
type CartState = { items: Item[] };

type CartAction =
  | { type: 'add'; item: Item }
  | { type: 'remove'; id: number }
  | { type: 'setQty'; id: number; qty: number }
  | { type: 'clear' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      return { items: [...state.items, action.item] };
    case 'remove':
      return { items: state.items.filter(i => i.id !== action.id) };
    case 'setQty':
      return { items: state.items.map(i => (i.id === action.id ? { ...i, qty: action.qty } : i)) };
    case 'clear':
      return { items: [] };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export default function Cart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <>
      <button onClick={() => dispatch({ type: 'add', item: { id: 1, name: 'Bagel', qty: 1 } })}>Add bagel</button>
      <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      <p>{state.items.length} items</p>
    </>
  );
}`, walk: [
      { lines: [6, 7, 8, 9, 10], note: "Each action variant has a unique `type` and its own payload." },
      { lines: [12], note: "Typed state in, typed state out." },
      { lines: [15, 17], note: "Narrowed: `action.item` only in 'add', `action.id` only in 'remove'." },
      { lines: [22, 23, 24, 25], note: "If a new variant is added but not handled, `action` isn't `never` → error." },
      { lines: [30], note: "`useReducer` infers state and dispatch types from the reducer." }
    ]},
    output: "“0 items”; clicking Add bagel shows “1 items”, Clear resets to 0.",
    mistakes: [
      { bad: `type Action = { type: string; payload?: any };`, good: `type Action =\n  | { type: 'add'; item: Item }\n  | { type: 'remove'; id: number };`, why: "A loose `string` + `any` payload loses all checking: typos and missing data slip through." }
    ],
    practice: [
      { level: "B", q: "Add an action `{ type: 'increment'; by: number }` to a counter reducer.", a: "Add it to the union and a `case 'increment': return { count: state.count + action.by };`" },
      { level: "I", q: "Add `setQty` handling that removes the item when qty is 0.", a: "In `case 'setQty'`, filter out items when `action.qty === 0`, else map." },
      { level: "I", q: "Write a todo reducer with `add`, `toggle`, `delete`.", a: "Union on `type` with `text` for add and `id` for toggle/delete." },
      { level: "C", q: "Write an `assertNever(x: never): never` helper and use it in `default`.", a: "Throw inside it.", code: `function assertNever(x: never): never {\n  throw new Error('Unhandled action: ' + JSON.stringify(x));\n}\n// default: return assertNever(action);` }
    ],
    quiz: [
      { q: "In `case 'remove'`, what can you read?", options: ["action.item", "action.id", "Both"], answer: 1, why: "TS narrows to the 'remove' variant." },
      { q: "`dispatch({ type: 'ad', item })`…", options: ["Works", "Compile error: not a valid action", "Ignored at runtime silently, no error"], answer: 1, why: "'ad' isn't one of the literal types." },
      { q: "Purpose of `const _x: never = action` in default?", options: ["Performance", "Compile error if an action isn't handled", "Resets state"], answer: 1, why: "Only possible when every variant is handled." }
    ],
    rev: {
      sec30: "Model actions as a discriminated union on `type`; each variant carries its own payload. `switch (action.type)` narrows per case. Type the reducer `(State, Action) => State`; `useReducer` infers the rest. Add a `never` default for exhaustiveness.",
      interview: [
        { level: "basic", q: "How do you type reducer actions?", a: "A union of object types sharing a literal `type` field (discriminated union)." },
        { level: "intermediate", q: "Why not `{ type: string; payload: any }`?", a: "No checking: typos in `type` and wrong payloads compile. The union makes each action exact." },
        { level: "advanced", q: "How do you guarantee every action is handled?", a: "In `default`, assign `action` to `never` (or call `assertNever`). New variants then fail to compile." },
        { level: "tricky", q: "Do you need generics on `useReducer`?", a: "Usually not. React 19 types infer state and action from the reducer's signature." }
      ],
      cheat: [
        "Actions = union on `type`",
        "Reducer: `(s: State, a: Action): State`",
        "`switch (a.type)` narrows payload",
        "`default: const _n: never = a; return _n`",
        "`useReducer` infers from the reducer",
        "No `payload: any`"
      ]
    },
    related: ["HOOKS-008", "TS-006", "STORE-007"]
  },

  "TS-018": {
    tldr: "A generic component takes a type parameter, like `function Select<T>(props: SelectProps<T>)`. The type of `options` decides the type of `onChange`'s value, so one component works for songs, products or users.",
    analogy: { icon: "🍽️", text: "A menu board that works for any café. Whether it lists drinks or cakes, when you point at one, you get that drink or cake, not a vague “thing”." },
    visual: { type: "flow", title: "<Select<T>> in action", steps: [
      { label: "Define", detail: "`function Select<T>({ options, onChange }: SelectProps<T>)`" },
      { label: "Pass data", detail: "`options={songs}` where `songs: Song[]`" },
      { label: "Infer T", detail: "TS sets `T = Song` from the prop." },
      { label: "Typed callback", detail: "`onChange={s => play(s.id)}`: `s` is `Song`." }
    ]},
    points: [
      "Write the type parameter on the function: `function Table<T>(props: TableProps<T>)`.",
      "In `.tsx`, an arrow version needs `<T,>`: `const Table = <T,>(p: TableProps<T>) => ...`.",
      "Let callers tell you how to read items: `getLabel: (item: T) => string`, `getKey: (item: T) => string | number`.",
      "Use `keyof T` for column keys so only real fields can be shown.",
      "TS infers `T` from props; you can force it with `<Select<Song> ... />` if needed."
    ],
    code: { file: "Select.tsx", lang: "tsx", src: `import { useState } from 'react';

type SelectProps<T> = {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getKey: (item: T) => string | number;
};

function Select<T>({ options, value, onChange, getLabel, getKey }: SelectProps<T>) {
  return (
    <select
      value={value ? String(getKey(value)) : ''}
      onChange={e => {
        const picked = options.find(o => String(getKey(o)) === e.target.value);
        if (picked) onChange(picked);
      }}
    >
      <option value="" disabled>Choose…</option>
      {options.map(o => (
        <option key={getKey(o)} value={String(getKey(o))}>{getLabel(o)}</option>
      ))}
    </select>
  );
}

type Song = { id: number; title: string; artist: string };
const songs: Song[] = [
  { id: 1, title: 'Sunrise', artist: 'Mia' },
  { id: 2, title: 'Night Bus', artist: 'Leo' },
];

export default function Player() {
  const [song, setSong] = useState<Song | null>(null);
  return (
    <>
      <Select options={songs} value={song} onChange={setSong}
        getLabel={s => s.title + ' – ' + s.artist} getKey={s => s.id} />
      <p>{song ? 'Now playing: ' + song.title : 'Nothing playing'}</p>
    </>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9], note: "Every prop mentions `T`, so they all agree on the item type." },
      { lines: [11], note: "Type parameter on a function declaration: no `<T,>` trick needed." },
      { lines: [16, 17], note: "Map the chosen string back to a real `T` before calling `onChange`." },
      { lines: [38, 39], note: "T is inferred as `Song`; `s.title` autocompletes and `onChange={setSong}` fits." }
    ]},
    output: "A dropdown “Sunrise – Mia / Night Bus – Leo”. Picking one shows “Now playing: Night Bus”.",
    mistakes: [
      { bad: `type SelectProps = { options: any[]; onChange: (v: any) => void };`, good: `type SelectProps<T> = { options: T[]; onChange: (v: T) => void };`, why: "`any` gives up the link between `options` and `onChange`; consumers lose autocomplete and checks." },
      { bad: `const Select = <T>(props: SelectProps<T>) => ...  // in .tsx`, good: `const Select = <T,>(props: SelectProps<T>) => ...`, why: "In `.tsx`, `<T>` is parsed as a JSX tag. The trailing comma marks it as a type parameter." }
    ],
    practice: [
      { level: "B", q: "Write a generic `List<T>` with `items: T[]` and `render: (item: T) => React.ReactNode`.", a: "`function List<T>({ items, render }: { items: T[]; render: (i: T) => React.ReactNode })`" },
      { level: "I", q: "Build `Table<T>` with `columns: (keyof T)[]`.", a: "Render headers from columns and cells with `String(row[col])`.", code: `function Table<T>({ rows, columns }: { rows: T[]; columns: (keyof T)[] }) {\n  return (\n    <table><tbody>\n      {rows.map((r, i) => <tr key={i}>{columns.map(c => <td key={String(c)}>{String(r[c])}</td>)}</tr>)}\n    </tbody></table>\n  );\n}` },
      { level: "I", q: "Constrain `T` so items must have an `id` and drop `getKey`.", a: "`function Select<T extends { id: string | number }>(...)` and use `item.id` as the key." },
      { level: "C", q: "Pass `columns={['title', 'colour']}` to `Table<Song>`. What happens?", a: "Compile error: 'colour' isn't `keyof Song`." }
    ],
    quiz: [
      { q: "Where does T come from in `<Select options={songs} ... />`?", options: ["You must write <Select<Song>>", "Inferred from the `options` prop", "Defaults to any"], answer: 1, why: "TS infers type parameters from props." },
      { q: "Arrow generic in a .tsx file?", options: ["<T>(p) => ...", "<T,>(p) => ...", "Not possible"], answer: 1, why: "The comma avoids JSX parsing." },
      { q: "Why `getLabel: (item: T) => string`?", options: ["To let the component display any item type", "For performance", "React requires it"], answer: 0, why: "The component can't know T's fields, so the caller tells it." }
    ],
    rev: {
      sec30: "Generic components add `<T>` to the function and use T across props, so `options`, `value` and `onChange` agree. Callers pass accessors (`getLabel`, `getKey`) or `keyof T` column lists. T is inferred from props. In `.tsx`, arrow generics need `<T,>`.",
      interview: [
        { level: "basic", q: "What's a generic component?", a: "A component with a type parameter, so its props relate to each other for any item type." },
        { level: "intermediate", q: "How does a generic Select know how to show an item?", a: "The caller passes functions like `getLabel(item)` and `getKey(item)` typed with T." },
        { level: "advanced", q: "How do you restrict Table columns to real fields?", a: "`columns: (keyof T)[]`, and read cells with `row[col]` (type `T[keyof T]`)." },
        { level: "tricky", q: "Can you use `React.FC` for a generic component?", a: "Not cleanly: `const X: React.FC<Props<T>>` has no place to declare T. Use a generic function." }
      ],
      cheat: [
        "`function Comp<T>(p: Props<T>)`",
        "Arrow in .tsx: `<T,>`",
        "Accessors: `getLabel(item: T)`",
        "Columns: `(keyof T)[]`",
        "T inferred from props",
        "Constrain: `<T extends { id: number }>`"
      ]
    },
    related: ["TS-007", "ADV-010", "EVT-014"]
  },

  "TS-019": {
    tldr: "Utility types build new types from existing ones: `Partial` (all optional), `Pick` (keep some keys), `Omit` (drop some), `Record` (a key → value map), and `ComponentProps` (copy an element's or component's props).",
    analogy: { icon: "✂️", text: "Editing a recipe card instead of writing a new one: keep only the ingredients (Pick), cross out nuts (Omit), or mark every line “optional” (Partial)." },
    visual: { type: "tree", title: "From one Product type", root: { label: "Product", note: "{ id, name, price, stock }", children: [
      { label: "Partial<Product>", note: "every field optional (edit form)" },
      { label: "Pick<Product, 'id' | 'name'>", note: "only id + name (list row)" },
      { label: "Omit<Product, 'id'>", note: "everything but id (create form)" },
      { label: "Record<Product['id'], number>", note: "id → quantity (cart)" }
    ]}},
    points: [
      "`Partial<T>`: all keys optional. Great for updates/patches.",
      "`Pick<T, K>` / `Omit<T, K>`: keep or remove keys. `Omit<Product, 'id'>` = new product form.",
      "`Record<K, V>`: an object with keys K and values V, like `Dictionary<K, V>` in C#.",
      "`React.ComponentProps<'button'>` gives every native button prop; extend it for wrapper components.",
      "Others worth knowing: `Required`, `Readonly`, `ReturnType`, `Awaited`."
    ],
    code: { file: "types.tsx", lang: "tsx", src: `type Product = { id: number; name: string; price: number; stock: number };

type ProductUpdate = Partial<Product>;              // all optional
type ProductRow = Pick<Product, 'id' | 'name'>;     // id + name
type NewProduct = Omit<Product, 'id'>;              // server assigns id
type CartQty = Record<Product['id'], number>;       // { [id]: qty }

function updateProduct(id: number, changes: ProductUpdate) {
  console.log('PATCH', id, changes);
}
updateProduct(1, { price: 2.5 });                    // ✅ only price

const cart: CartQty = { 1: 2, 7: 1 };

const statusLabel: Record<'idle' | 'saving' | 'saved', string> = {
  idle: 'Save', saving: 'Saving…', saved: 'Saved ✓',
};

// Wrapper that accepts every native <button> prop
type ButtonProps = React.ComponentProps<'button'> & { variant?: 'primary' | 'ghost' };

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button className={'btn ' + variant + ' ' + (className ?? '')} {...rest} />;
}

// <Button type="submit" disabled onClick={save}>Save</Button>  ✅`, walk: [
      { lines: [3, 4, 5, 6], note: "Four new types from one source. Change Product and they all follow." },
      { lines: [8, 11], note: "`Partial` lets callers send only the fields that changed." },
      { lines: [15, 16, 17], note: "`Record` with a union key forces you to cover **every** status." },
      { lines: [20], note: "`ComponentProps<'button'>` brings `type`, `disabled`, `onClick`, `aria-*`…" },
      { lines: [22, 23], note: "Spread the rest onto the real button so every native prop works." }
    ]},
    mistakes: [
      { bad: `type NewProduct = { name: string; price: number; stock: number }; // copied by hand`, good: `type NewProduct = Omit<Product, 'id'>;`, why: "Hand copies drift when Product changes. Derive instead." },
      { bad: `type ButtonProps = { onClick: () => void; disabled?: boolean; type?: string };`, good: `type ButtonProps = React.ComponentProps<'button'>;`, why: "You'll keep missing native props (`aria-label`, `form`, `name`). Reuse React's types." }
    ],
    practice: [
      { level: "B", q: "Make a type for a todo's editable fields: everything except `id` and `createdAt`.", a: "`Omit<Todo, 'id' | 'createdAt'>`" },
      { level: "B", q: "Map weather condition → emoji with `Record`.", a: "`const icons: Record<'sun' | 'rain' | 'snow', string> = { sun: '☀️', rain: '🌧️', snow: '❄️' };`" },
      { level: "I", q: "Type an `Input` wrapper that takes every native input prop plus `label: string`.", a: "`type InputProps = React.ComponentProps<'input'> & { label: string };`" },
      { level: "C", q: "Get the props type of an existing `ProductCard` component without exporting its type.", a: "`type CardProps = React.ComponentProps<typeof ProductCard>;`" }
    ],
    quiz: [
      { q: "Best type for a PATCH body that changes some fields?", options: ["Product", "Partial<Product>", "Pick<Product, 'id'>"], answer: 1, why: "Partial makes every field optional." },
      { q: "`Omit<Product, 'id'>` contains…", options: ["Only id", "Every field except id", "id as optional"], answer: 1, why: "Omit removes the listed keys." },
      { q: "`Record<'a' | 'b', number>` requires…", options: ["Any string keys", "Both a and b with number values", "An array of numbers"], answer: 1, why: "Every key in the union must be present." }
    ],
    rev: {
      sec30: "Derive types instead of copying them: `Partial` (optional), `Pick`/`Omit` (subset), `Record<K, V>` (map; with union keys it forces full coverage), `React.ComponentProps<'button'>` or `<typeof Comp>` for wrapper props. Also `Required`, `Readonly`, `ReturnType`, `Awaited`.",
      interview: [
        { level: "basic", q: "What does `Partial<T>` do?", a: "Makes every property of T optional. Useful for updates and drafts." },
        { level: "intermediate", q: "Pick vs Omit?", a: "Pick keeps the listed keys; Omit keeps everything except them. Use whichever list is shorter." },
        { level: "advanced", q: "How do you type a Button wrapper that supports all native props?", a: "`React.ComponentProps<'button'> & { variant?: ... }` and spread `...rest` onto `<button>`." },
        { level: "tricky", q: "Why use `Record<Status, string>` instead of `{ [k: string]: string }`?", a: "With a union key it forces every status to have a value, and rejects unknown keys." }
      ],
      compare: { cols: ["", "What it does", "Typical React use"], rows: [
        ["Partial<T>", "All optional", "Edit form, patch"], ["Pick<T,K>", "Keep keys", "List row props"], ["Omit<T,K>", "Drop keys", "Create form, wrappers"], ["Record<K,V>", "Key → value map", "Label/icon lookups"], ["ComponentProps<X>", "Props of element/component", "Wrapper components"]
      ]},
      cheat: [
        "`Partial<T>` all optional",
        "`Pick<T, 'a' | 'b'>` keep keys",
        "`Omit<T, 'id'>` drop keys",
        "`Record<K, V>` key → value",
        "`React.ComponentProps<'button'>`",
        "`React.ComponentProps<typeof Comp>`",
        "Derive, don't copy"
      ]
    },
    related: ["TS-005", "TS-011", "TS-018"]
  },

  "TS-020": {
    tldr: "Keep `strict: true` on, treat `any` as a bug, and use `unknown` + narrowing for data you don't trust. Let inference work, validate at the edges, and avoid `as` unless you truly know better than the compiler.",
    analogy: { icon: "🔒", text: "A smoke alarm. Taking the battery out (`any`, `as`, `@ts-ignore`) stops the beeping, but the kitchen is still on fire." },
    visual: { type: "compare", title: "Habits that keep types honest", left: { label: "Avoid", tone: "bad", points: [
      "`any` (switches checking off)", "`as Product` on API data", "`// @ts-ignore`", "Non-null `!` everywhere", "Turning off `strict`"
    ]}, right: { label: "Prefer", tone: "good", points: [
      "`unknown` + narrowing / Zod", "Inference; annotate params and exports", "`satisfies` to check without widening", "`import type` for type-only imports", "`strict` + `noUncheckedIndexedAccess`"
    ]}},
    points: [
      "`strict` turns on `noImplicitAny`, `strictNullChecks` and more. The Vite template has it on.",
      "`unknown` is the safe `any`: you must narrow it before use.",
      "`satisfies` checks a value against a type but keeps its precise inferred type.",
      "`noUncheckedIndexedAccess`: `list[0]` becomes `T | undefined`, catching empty-array bugs.",
      "Lint for `no-explicit-any` (Oxlint or typescript-eslint), and run `tsc -b` in CI."
    ],
    code: { file: "safe.ts", lang: "ts", src: `import type { Product } from './types';   // type-only import

// ❌ any: no errors, crashes later
function badTotal(data: any) {
  return data.items.reduce((s: any, i: any) => s + i.prise, 0);
}

// ✅ unknown: must prove the shape first
function isProductList(x: unknown): x is Product[] {
  return Array.isArray(x) && x.every(p => typeof p?.price === 'number');
}

function total(data: unknown): number {
  if (!isProductList(data)) return 0;
  return data.reduce((s, p) => s + p.price, 0);
}

// ✅ satisfies: checked, but keys stay exact
const theme = {
  light: { bg: '#fff', text: '#222' },
  dark: { bg: '#111', text: '#eee' },
} satisfies Record<string, { bg: string; text: string }>;

theme.dark.bg;      // ✅ known key
theme.sepia;        // ❌ caught (would be allowed with ': Record<...>')

// ✅ noUncheckedIndexedAccess
const songs: string[] = [];
const firstSong = songs[0];   // string | undefined
firstSong?.toUpperCase();`, walk: [
      { lines: [1], note: "`import type` is erased completely; required with `verbatimModuleSyntax` (on in Vite templates)." },
      { lines: [4, 5], note: "`any` hides the typo `prise`. The function returns `NaN` at runtime." },
      { lines: [9, 10, 11], note: "A type guard (`x is Product[]`) turns `unknown` into a real type after a check." },
      { lines: [19, 20, 21, 22], note: "`satisfies` validates the shape but keeps the literal keys `light` and `dark`." },
      { lines: [28, 29, 30], note: "Index access may be undefined; the flag makes TS say so." }
    ]},
    mistakes: [
      { bad: `// @ts-ignore\nuser.adress.city;`, good: `user.address?.city;`, why: "`@ts-ignore` hides the real error (a typo here). Fix the code; if you must, use `@ts-expect-error` with a comment." },
      { bad: `const el = document.querySelector('#q') as HTMLInputElement;\nel.value;`, good: `const el = document.querySelector('#q');\nif (el instanceof HTMLInputElement) el.value;`, why: "An `as` cast skips the null and element-type check. Narrow with `instanceof` instead." }
    ],
    practice: [
      { level: "B", q: "Where is strict mode set in a Vite React project?", a: "`compilerOptions.strict` in `tsconfig.app.json`. It's on in the template (and the default from TS 6)." },
      { level: "I", q: "Turn on extra safety flags.", a: "Add them to compilerOptions.", code: `{\n  "compilerOptions": {\n    "strict": true,\n    "noUncheckedIndexedAccess": true,\n    "noFallthroughCasesInSwitch": true\n  }\n}` },
      { level: "I", q: "Replace `catch (e: any)` with something safe.", a: "Leave `e` as `unknown` and narrow: `if (e instanceof Error) setError(e.message);`" },
      { level: "C", q: "Why might `enum Size { S, M }` fail in a new Vite template?", a: "Templates enable `erasableSyntaxOnly`, which rejects enums (they emit runtime code). Use a union `'S' | 'M'` or an `as const` object." }
    ],
    quiz: [
      { q: "Safest type for data you haven't checked yet?", options: ["any", "unknown", "object"], answer: 1, why: "`unknown` forces narrowing before use." },
      { q: "What does `satisfies` do?", options: ["Casts the value", "Checks the value against a type but keeps its inferred type", "Runs validation at runtime"], answer: 1, why: "Checked, not widened." },
      { q: "With `noUncheckedIndexedAccess`, `items[0]` is…", options: ["T", "T | undefined", "unknown"], answer: 1, why: "Index access might miss." }
    ],
    rev: {
      sec30: "Keep `strict` on. Avoid `any`, `as`, `!` and `@ts-ignore`; use `unknown` with narrowing or Zod at boundaries. Use `satisfies` for checked config objects, `import type` for type imports, `noUncheckedIndexedAccess` for safer arrays, unions over enums, and lint + `tsc -b` in CI.",
      interview: [
        { level: "basic", q: "`any` vs `unknown`?", a: "`any` disables checking. `unknown` accepts anything but must be narrowed before use." },
        { level: "intermediate", q: "What does `strict: true` enable?", a: "A family of checks: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes` and others." },
        { level: "advanced", q: "When is `as` acceptable?", a: "When you have knowledge TS can't see and it's checked elsewhere, e.g. after Zod parsing or for `as const`. Not to silence errors." },
        { level: "tricky", q: "`satisfies` vs a type annotation?", a: "An annotation widens the value to the type; `satisfies` checks it and keeps the narrower inferred type (exact keys, literals)." },
        { level: "intermediate", q: "Why do new Vite templates reject `enum`?", a: "`erasableSyntaxOnly` allows only syntax that can be stripped. Enums generate JS; use unions or `as const` objects." }
      ],
      cheat: [
        "`strict: true`, always",
        "`unknown` > `any`",
        "Narrow or Zod-parse untrusted data",
        "`satisfies` = check without widening",
        "`import type` for types",
        "`noUncheckedIndexedAccess` for safer arrays",
        "Unions over enums",
        "`@ts-expect-error` > `@ts-ignore`"
      ]
    },
    related: ["TS-001", "TS-012", "TEST-018"]
  },
};
