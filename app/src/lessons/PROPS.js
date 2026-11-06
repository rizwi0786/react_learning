export default {
  "PROPS-001": {
    tldr: "Props (properties) are the inputs a parent hands to a component, like arguments to a function. The component reads them to decide what to show, but never changes them.",
    analogy: { icon: "🏷️", text: "A blank price tag template. The shop fills in the product name and price; the tag just displays what it was given. Same template, different tags." },
    visual: { type: "flow", title: "Props go in, UI comes out", steps: [
      { label: "Parent writes JSX", detail: "`<Product name=\"Mug\" price={9} />`" },
      { label: "React bundles props", detail: "React builds one object: `{ name: 'Mug', price: 9 }`." },
      { label: "Component is called", detail: "React calls `Product(props)` with that object as the first argument." },
      { label: "UI returned", detail: "The component reads `props.name` and `props.price` and returns JSX." }
    ]},
    points: [
      "A component is a function; props are its **arguments**, passed as JSX attributes.",
      "Props are **read-only**: the child displays them, it doesn't change them.",
      "Same component + different props = different output. That's what makes components **reusable**.",
      "Any JS value can be a prop: strings, numbers, arrays, objects, functions, even JSX.",
      "C# view: like constructor parameters on an immutable record."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function Product(props) {
  return (
    <div className="product">
      <h3>{props.name}</h3>
      <p>\${props.price}</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Product name="Coffee mug" price={9} />
      <Product name="Tea pot" price={24} />
    </>
  );
}`, walk: [
      { lines: [1], note: "The component receives one object: `props`." },
      { lines: [4, 5], note: "It only **reads** the values to build its UI." },
      { lines: [13, 14], note: "The parent reuses `Product` twice with different inputs." }
    ]},
    output: "Two product cards: “Coffee mug $9” and “Tea pot $24”.",
    mistakes: [
      { bad: `function Product(props) {\n  props.price = props.price * 0.9;\n  return <p>{props.price}</p>;\n}`, good: `function Product({ price }) {\n  const sale = price * 0.9;\n  return <p>{sale}</p>;\n}`, why: "Props are read-only (frozen in dev, so this throws). Compute a new local value instead." }
    ],
    practice: [
      { level: "B", q: "Create a `Greeting` component that shows “Hello, {name}!” using a `name` prop.", a: "Read `props.name` inside the JSX.", code: `function Greeting(props) {\n  return <h2>Hello, {props.name}!</h2>;\n}\n// <Greeting name="Sara" />` },
      { level: "B", q: "Render `Greeting` three times with three different names.", a: "Write three `<Greeting name=\"...\" />` elements inside a fragment." },
      { level: "I", q: "What does React pass to `Product` for `<Product />` with no attributes?", a: "An empty object `{}`. `props.name` is `undefined`, so nothing renders for it." },
      { level: "C", q: "Explain why props make a component reusable, in one sentence.", a: "The component's logic stays the same while the data it shows comes from outside, so one definition can show any product." }
    ],
    quiz: [
      { q: "What are props?", options: ["A component's private memory", "Inputs passed from a parent to a component", "Global variables shared by all components", "CSS classes for a component"], answer: 1, why: "Props are inputs from the parent. Private memory is state." },
      { q: "Can a child component change its own props?", options: ["Yes, assign to `props.x`", "Yes, with `setProps`", "No, props are read-only"], answer: 2, why: "Props belong to the parent. The child treats them as read-only." },
      { q: "What does React pass as the first argument to a function component?", options: ["The DOM node", "A single props object", "Each attribute as a separate argument"], answer: 1, why: "All attributes are gathered into one object." }
    ],
    rev: {
      sec30: "Props are a component's inputs, written as JSX attributes by the parent and received as one object. They make components reusable: same function, different data. Props are read-only; the child must not modify them. Any JS value can be passed.",
      interview: [
        { level: "basic", q: "What are props in React?", a: "Read-only inputs passed from a parent to a child component, received as a single object argument." },
        { level: "basic", q: "Why are props useful?", a: "They let one component render different data, so you write it once and reuse it." },
        { level: "intermediate", q: "How are props different from HTML attributes?", a: "They look similar, but props can carry any JS value (objects, functions, JSX), and custom components decide what to do with them." },
        { level: "tricky", q: "Is `props` a special React type?", a: "No. It's a plain JS object (frozen in development). React builds it from the JSX attributes and passes it to your function." }
      ],
      cheat: [
        "Props = inputs to a component (like function arguments)",
        "Passed as JSX attributes, received as one object",
        "Read-only: never modify them in the child",
        "Same component + different props = different UI",
        "Any value works: string, number, array, object, function, JSX"
      ]
    },
    related: ["PROPS-002", "PROPS-012", "COMP-006"]
  },

  "PROPS-002": {
    tldr: "You pass props by writing attributes on a component tag in the parent's JSX: `<Button label=\"Buy\" />`. Data travels one way: from parent down to child.",
    analogy: { icon: "🍽️", text: "Ordering at a café. You (the parent) write the order slip: “latte, large, oat milk”. The barista (child) makes exactly what's on the slip." },
    visual: { type: "tree", title: "Props flow down the tree", root: { label: "App", note: "owns the data", children: [
      { label: "Header", note: "title=\"My Shop\"" },
      { label: "ProductList", note: "products={items}", children: [
        { label: "Product", note: "name=\"Mug\" price={9}" },
        { label: "Product", note: "name=\"Pot\" price={24}" }
      ]}
    ]}},
    points: [
      "Write props like HTML attributes: `<Child name=\"value\" />`.",
      "Strings can use quotes; everything else uses braces: `count={3}`.",
      "Props go **parent → child** only. A child can't push props up.",
      "You can pass a variable from the parent: `<Header title={shopName} />`.",
      "When the parent re-renders with new values, the child gets the new props."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function Button(props) {
  return <button className={props.variant}>{props.label}</button>;
}

function Header(props) {
  return <h1>{props.title}</h1>;
}

export default function App() {
  const shopName = 'Corner Bakery';
  return (
    <main>
      <Header title={shopName} />
      <Button label="Add to cart" variant="primary" />
      <Button label="Save for later" variant="ghost" />
    </main>
  );
}`, walk: [
      { lines: [10], note: "The parent owns a normal value." },
      { lines: [13], note: "Pass a variable with braces: `title={shopName}`." },
      { lines: [14, 15], note: "Pass string literals with quotes. Same `Button`, two looks." },
      { lines: [1, 2], note: "The child receives them on `props`." }
    ]},
    output: "A heading “Corner Bakery” and two buttons: “Add to cart” and “Save for later”.",
    mistakes: [
      { bad: `<Header title="shopName" />`, good: `<Header title={shopName} />`, why: "Quotes pass the literal text \"shopName\". Use braces to pass the variable's value." },
      { bad: `<Button label=Buy />`, good: `<Button label="Buy" />`, why: "Unquoted attribute values aren't valid JSX. Use quotes for strings or braces for expressions." }
    ],
    practice: [
      { level: "B", q: "Pass a `city` prop to a `Weather` component and display it.", a: "`<Weather city=\"Paris\" />` and `{props.city}` inside.", code: `function Weather(props) {\n  return <p>Weather in {props.city}</p>;\n}` },
      { level: "B", q: "Pass a parent variable `const user = 'Ali'` to `<Avatar />`.", a: "`<Avatar name={user} />`" },
      { level: "I", q: "Can a child pass a prop back up to its parent?", a: "No. Data flows down. To send info up, the parent passes a function the child calls (see PROPS-008)." }
    ],
    quiz: [
      { q: "How do you pass the number 5 as a prop?", options: ["`qty=\"5\"`", "`qty={5}`", "`qty=5`", "`{qty: 5}`"], answer: 1, why: "Braces pass a JS number. Quotes would pass the string \"5\"." },
      { q: "Which direction do props travel?", options: ["Child to parent", "Parent to child", "Between siblings directly", "Both ways"], answer: 1, why: "React data flow is one-way: down the tree." },
      { q: "`<Header title=\"name\" />` where `const name = 'Shop'` shows…", options: ["Shop", "name", "Nothing"], answer: 1, why: "Quoted values are literal strings; the variable isn't read." }
    ],
    rev: {
      sec30: "Pass props as attributes on the component tag in JSX. Quotes for string literals, braces for any JS expression. Props only flow from parent to child; when the parent re-renders with new values, the child receives them.",
      interview: [
        { level: "basic", q: "How do you pass data to a child component?", a: "As JSX attributes on the child's tag: `<Child value={x} />`." },
        { level: "intermediate", q: "When do you use quotes vs braces?", a: "Quotes only for string literals. Braces for everything else: numbers, booleans, variables, objects, functions." },
        { level: "intermediate", q: "What happens to the child when the parent passes a new prop value?", a: "The parent re-renders, React calls the child again with the new props, and the UI updates." },
        { level: "tricky", q: "Can siblings pass props to each other?", a: "Not directly. Lift the shared data to their common parent and pass it down to both." }
      ],
      cheat: [
        "`<Child name=\"text\" count={3} />`",
        "Quotes = string literal; braces = JS expression",
        "Props flow parent → child only",
        "New parent values → child re-renders with new props",
        "Siblings share data via a common parent"
      ]
    },
    related: ["PROPS-001", "PROPS-003", "PROPS-007", "COMM-001"]
  },

  "PROPS-003": {
    tldr: "Inside the child, all passed props arrive as one object, usually called `props`. Read a value with `props.name`; a prop that wasn't passed is `undefined`.",
    analogy: { icon: "📦", text: "A delivery box. Everything the sender packed is inside one box. You open it and take out `box.mug` or `box.card`. If they didn't pack it, it's not there." },
    visual: { type: "flow", title: "From attributes to `props.x`", steps: [
      { label: "JSX attributes", detail: "`<UserProfile name=\"Lina\" city=\"Rome\" />`" },
      { label: "One props object", detail: "`{ name: 'Lina', city: 'Rome' }` is the first argument." },
      { label: "Dot access", detail: "`props.name` → 'Lina', `props.city` → 'Rome'." },
      { label: "Missing prop", detail: "`props.age` → `undefined`; renders nothing in JSX." }
    ]},
    points: [
      "A function component receives **one** argument: the props object.",
      "Read values with dot notation: `props.name`.",
      "A prop that wasn't passed is `undefined` (no error).",
      "`undefined`, `null`, `true` and `false` render **nothing** in JSX.",
      "`console.log(props)` is a quick way to see exactly what arrived."
    ],
    code: { file: "UserProfile.jsx", lang: "jsx", src: `function UserProfile(props) {
  console.log(props);
  return (
    <section className="profile">
      <h2>{props.name}</h2>
      <p>📍 {props.city}</p>
      <p>Age: {props.age}</p>
    </section>
  );
}

export default function App() {
  return <UserProfile name="Lina" city="Rome" />;
}`, walk: [
      { lines: [1], note: "The single parameter holds every prop." },
      { lines: [2], note: "Logs `{ name: 'Lina', city: 'Rome' }`." },
      { lines: [5, 6], note: "Dot access reads each value." },
      { lines: [7], note: "`age` wasn't passed, so it's `undefined` and shows nothing after “Age:”." }
    ]},
    output: "Console: { name: 'Lina', city: 'Rome' } (twice in dev: Strict Mode renders twice). Screen: “Lina”, “📍 Rome”, “Age:”.",
    mistakes: [
      { bad: `function UserProfile(name, city) {\n  return <h2>{name}</h2>;\n}`, good: `function UserProfile(props) {\n  return <h2>{props.name}</h2>;\n}`, why: "Props are not separate arguments. `name` here is the whole props object, so React throws “Objects are not valid as a React child”." }
    ],
    practice: [
      { level: "B", q: "Show a recipe's `title` and `minutes` from props.", a: "`<h3>{props.title}</h3><p>{props.minutes} min</p>`" },
      { level: "B", q: "Log the props of a `Song` component. What do you see for `<Song title=\"Hey\" />`?", a: "`{ title: 'Hey' }`" },
      { level: "I", q: "Only show “Age: …” when `age` is provided.", a: "`{props.age !== undefined && <p>Age: {props.age}</p>}`" }
    ],
    quiz: [
      { q: "How does a child read a `price` prop?", options: ["`this.price`", "`props.price`", "`price()`", "`useProps('price')`"], answer: 1, why: "Props arrive as an object; use dot access." },
      { q: "What is `props.color` if the parent didn't pass `color`?", options: ["`null`", "An error is thrown", "`undefined`", "An empty string"], answer: 2, why: "Missing object keys are `undefined` in JS." },
      { q: "How many arguments does React pass to a function component for its props?", options: ["One object", "One per prop", "None, use a hook"], answer: 0, why: "All props come in a single object." }
    ],
    rev: {
      sec30: "A function component gets one argument, the props object. Read values with `props.x`. Missing props are `undefined` and render nothing. Log `props` to debug what the parent actually passed.",
      interview: [
        { level: "basic", q: "How do you access props in a function component?", a: "Through the first parameter, `props`, using `props.name` (or destructuring)." },
        { level: "intermediate", q: "What happens when you read a prop that wasn't passed?", a: "You get `undefined`. It renders nothing, but calling methods on it (like `.map`) will crash." },
        { level: "tricky", q: "Why does `function Card(title) { return <h3>{title}</h3> }` crash?", a: "`title` is actually the whole props object, and objects can't be rendered as children." },
        { level: "intermediate", q: "Is `key` readable via `props.key`?", a: "No. `key` is used by React for list identity and isn't passed to the component. Pass the value under another name if you need it." }
      ],
      cheat: [
        "`function C(props)` → read `props.x`",
        "One object argument holds all props",
        "Missing prop = `undefined`",
        "`undefined`/`null`/booleans render nothing",
        "`key` is not readable as a prop",
        "`console.log(props)` to debug"
      ]
    },
    related: ["PROPS-002", "PROPS-005", "PROPS-006"]
  },

  "PROPS-004": {
    tldr: "A component can take as many props as it needs. Each attribute becomes one key on the props object, and you combine them to build richer UI.",
    analogy: { icon: "🎵", text: "A playlist track row. It needs a title, an artist, a length and whether it's liked. Four inputs, one row." },
    visual: { type: "tree", title: "One component, several inputs", root: { label: "<Track />", note: "props object", children: [
      { label: "title", note: "\"Blue Sky\"" },
      { label: "artist", note: "\"Nova\"" },
      { label: "seconds", note: "{215}" },
      { label: "liked", note: "{true}" }
    ]}},
    points: [
      "Add more attributes to pass more props; order doesn't matter.",
      "Props can work **together**: format `seconds` into `3:35`, show ❤️ if `liked`.",
      "A boolean prop written alone is `true`: `<Track liked />` = `liked={true}`.",
      "Many related values? Consider passing one object (`track={track}`) instead.",
      "Keep the list small and focused; 10+ props hints the component does too much."
    ],
    code: { file: "Playlist.jsx", lang: "jsx", src: `function Track(props) {
  const mins = Math.floor(props.seconds / 60);
  const secs = String(props.seconds % 60).padStart(2, '0');
  return (
    <li>
      {props.liked ? '❤️' : '🤍'} {props.title} by {props.artist}
      <span> {mins}:{secs}</span>
    </li>
  );
}

export default function Playlist() {
  return (
    <ul>
      <Track title="Blue Sky" artist="Nova" seconds={215} liked />
      <Track title="Rainy Day" artist="Ola" seconds={187} liked={false} />
    </ul>
  );
}`, walk: [
      { lines: [2, 3], note: "Derive display values from a prop; don't change the prop itself." },
      { lines: [6], note: "Combine several props in one line of UI." },
      { lines: [15], note: "A bare `liked` means `liked={true}`." },
      { lines: [16], note: "Pass `false` explicitly with braces." }
    ]},
    output: "❤️ Blue Sky by Nova 3:35\n🤍 Rainy Day by Ola 3:07",
    mistakes: [
      { bad: `<Track liked="false" />`, good: `<Track liked={false} />`, why: "\"false\" is a non-empty string, which is truthy. The heart would show as liked." }
    ],
    practice: [
      { level: "B", q: "Build `Recipe` with `title`, `minutes` and `servings` props.", a: "Render all three; pass numbers with braces.", code: `<Recipe title="Pancakes" minutes={20} servings={4} />` },
      { level: "I", q: "Add a `vegan` boolean prop that shows a 🌱 badge.", a: "`{props.vegan && <span>🌱</span>}` and pass `<Recipe vegan />`." },
      { level: "C", q: "A `Track` has 8 props from the same song object. How could you simplify?", a: "Pass `song={song}` (one object) or spread `{...song}` if the keys match the prop names." }
    ],
    quiz: [
      { q: "`<Track liked />` gives `props.liked` equal to…", options: ["`undefined`", "`\"liked\"`", "`true`", "`\"\"`"], answer: 2, why: "A bare attribute is shorthand for `={true}`." },
      { q: "Does attribute order change the props object?", options: ["Yes, order matters", "No, keys are read by name"], answer: 1, why: "Props are read by name, not position." },
      { q: "What does `liked=\"false\"` evaluate to in `props.liked ? 'yes' : 'no'`?", options: ["'yes'", "'no'", "An error"], answer: 0, why: "Any non-empty string is truthy." }
    ],
    rev: {
      sec30: "Pass several props by adding attributes; each becomes a key on `props`. Combine them to build UI and derive display values. A bare attribute means `true`. If the list grows long, group into an object or split the component.",
      interview: [
        { level: "basic", q: "How do you pass several values to a component?", a: "Add one attribute per value; they all land on the same props object." },
        { level: "intermediate", q: "What does `<Modal open />` pass?", a: "`open: true`. A valueless attribute is boolean true." },
        { level: "advanced", q: "When is a long props list a smell?", a: "When it means the component has several jobs. Split it, group related values into an object, or use composition with `children`." },
        { level: "tricky", q: "`<Toggle on=\"false\" />`: is it on?", a: "Yes, if the code checks truthiness. The string \"false\" is truthy. Use `on={false}`." }
      ],
      cheat: [
        "One attribute = one key on `props`",
        "Order doesn't matter; names do",
        "`<C flag />` means `flag={true}`",
        "`\"false\"` is truthy; use `{false}`",
        "Derive values (format, totals) from props, don't change them",
        "Too many props → split or group"
      ]
    },
    related: ["PROPS-003", "PROPS-005", "PROPS-007"]
  },

  "PROPS-005": {
    tldr: "Instead of writing `props.name` everywhere, unpack the props right in the parameter list: `function Card({ title, price })`. Same data, less noise, and the inputs are listed up front.",
    analogy: { icon: "🛍️", text: "Unpacking shopping bags straight onto the shelf. Instead of reaching into the bag each time, you take out milk, bread and eggs once and put them where you can see them." },
    visual: { type: "compare", title: "`props.x` vs destructuring", left: { label: "props object", tone: "neutral", points: [
      "`function Card(props)`", "`props.title`, `props.price` everywhere", "Inputs hidden in the body"
    ]}, right: { label: "Destructured", tone: "good", points: [
      "`function Card({ title, price })`", "Use `title`, `price` directly", "Inputs listed in the signature", "Easy to add defaults"
    ]}},
    points: [
      "`function Card({ title, price })` pulls those keys out of the props object.",
      "It's plain JS **object destructuring**, nothing React-specific.",
      "The signature now documents which props the component expects.",
      "Rename while unpacking: `{ title: heading }`.",
      "Collect the leftovers with `{ title, ...rest }` and pass them on with `{...rest}`."
    ],
    code: { file: "Card.jsx", lang: "jsx", src: `function Card({ title, price, image }) {
  return (
    <article className="card">
      <img src={image} alt={title} width={120} />
      <h3>{title}</h3>
      <p>\${price.toFixed(2)}</p>
    </article>
  );
}

export default function App() {
  return (
    <Card
      title="Lemon cake"
      price={4.5}
      image="/cake.jpg"
    />
  );
}`, walk: [
      { lines: [1], note: "Curly braces in the parameter unpack three props by name." },
      { lines: [4, 5, 6], note: "Use them as normal variables: no `props.` prefix." },
      { lines: [13, 14, 15, 16], note: "The parent passes props exactly as before. Nothing changes on its side." }
    ]},
    output: "A card with the cake image, “Lemon cake” and “$4.50”.",
    mistakes: [
      { bad: `function Card(title, price) {\n  return <h3>{title}</h3>;\n}`, good: `function Card({ title, price }) {\n  return <h3>{title}</h3>;\n}`, why: "Without braces, `title` is the whole props object and `price` is `undefined`. The braces do the unpacking." }
    ],
    practice: [
      { level: "B", q: "Rewrite `function Note(props) { return <p>{props.text}</p> }` with destructuring.", a: "`function Note({ text }) { return <p>{text}</p>; }`" },
      { level: "I", q: "Destructure `name` but call it `label` inside the component.", a: "`function Tag({ name: label }) { return <span>{label}</span>; }`" },
      { level: "C", q: "Destructure `title` and pass every other prop to a `<div>`.", a: "Use rest and spread.", code: `function Panel({ title, ...rest }) {\n  return <div {...rest}><h3>{title}</h3></div>;\n}` }
    ],
    quiz: [
      { q: "`function Card({ title })` is…", options: ["A special React syntax", "Plain JS object destructuring of the props argument", "A way to make `title` state"], answer: 1, why: "It's standard JS destructuring." },
      { q: "With `function Card(title)` and `<Card title=\"Hi\" />`, what is `title`?", options: ["\"Hi\"", "`{ title: 'Hi' }`", "`undefined`"], answer: 1, why: "No braces means the parameter is the whole props object." },
      { q: "How do you rename `name` to `label` while destructuring?", options: ["`{ name as label }`", "`{ name: label }`", "`{ label = name }`"], answer: 1, why: "`key: newName` is JS rename syntax. `=` sets a default." }
    ],
    rev: {
      sec30: "Destructure props in the parameter list: `function Card({ title, price })`. It's plain JS, removes `props.` noise and documents the component's inputs. You can rename (`{ a: b }`), set defaults (`{ a = 1 }`) and collect the rest (`{ a, ...rest }`).",
      interview: [
        { level: "basic", q: "Why destructure props?", a: "Shorter code and the signature shows exactly which props the component uses." },
        { level: "intermediate", q: "How do you forward unknown props to a DOM element?", a: "`function Btn({ variant, ...rest }) { return <button {...rest} /> }`: rest collects the others, spread passes them on." },
        { level: "tricky", q: "Bug: `function Card(title, price)`. What's wrong?", a: "React passes one object. `title` is the props object and `price` is `undefined`. Wrap in braces." },
        { level: "intermediate", q: "Does destructuring copy the props?", a: "It copies the top-level values into variables. Objects and arrays are still the same references, so don't mutate them." }
      ],
      cheat: [
        "`function C({ a, b })` = read `props.a`, `props.b`",
        "Plain JS destructuring",
        "Rename: `{ name: label }`",
        "Default: `{ size = 'md' }`",
        "Rest: `{ title, ...rest }` then `<div {...rest} />`",
        "Forgetting braces = whole props object"
      ]
    },
    related: ["PROPS-003", "PROPS-006", "TS-008"]
  },

  "PROPS-006": {
    tldr: "Give a prop a fallback with a destructuring default: `function Button({ size = 'md' })`. It's used only when the prop is `undefined`. React 19 removed `defaultProps` for function components.",
    analogy: { icon: "☕", text: "A coffee order. If you don't say a size, the barista makes a medium. If you say “small”, you get small. The default fills the gap only when you say nothing." },
    visual: { type: "flow", title: "When does the default kick in?", steps: [
      { label: "`<Button />`", detail: "`size` is `undefined` → default `'md'` is used." },
      { label: "`<Button size=\"lg\" />`", detail: "Value passed → `'lg'` wins, default ignored." },
      { label: "`size={undefined}`", detail: "Still `undefined` → default `'md'` is used." },
      { label: "`size={null}`", detail: "`null` is a real value → default is **not** used." }
    ]},
    points: [
      "Syntax: `function Button({ label = 'OK', size = 'md' })`.",
      "Defaults apply only for `undefined` (missing), **not** for `null`, `0` or `''`.",
      "`Component.defaultProps` was **removed for function components in React 19**; it's ignored. Use destructuring defaults.",
      "Defaults can be any expression: `items = []`, `onClick = () => {}`.",
      "Prefer constants for object/array defaults if a child memoizes on them (a new `[]` is created each render)."
    ],
    code: { file: "Button.jsx", lang: "jsx", src: `function Button({ label = 'Click me', size = 'md', variant = 'primary' }) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      {label}
    </button>
  );
}

export default function App() {
  return (
    <>
      <Button />
      <Button label="Checkout" size="lg" />
      <Button label="Cancel" variant="ghost" />
    </>
  );
}`, walk: [
      { lines: [1], note: "Each `= value` is a fallback for a missing prop." },
      { lines: [3], note: "Use the final values to build the class name." },
      { lines: [12], note: "Nothing passed: all three defaults are used." },
      { lines: [13, 14], note: "Passed values override only the props you set." }
    ]},
    output: "“Click me” (primary, md), “Checkout” (primary, lg), “Cancel” (ghost, md).",
    mistakes: [
      { bad: `function Button({ size }) { ... }\nButton.defaultProps = { size: 'md' };`, good: `function Button({ size = 'md' }) { ... }`, why: "React 19 ignores `defaultProps` on function components. Destructuring defaults are the supported way." },
      { bad: `<Avatar src={null} />  // expects default image`, good: `function Avatar({ src }) {\n  const url = src ?? '/default.png';\n  return <img src={url} alt="" />;\n}`, why: "Defaults only replace `undefined`. `null` is passed through as-is." }
    ],
    practice: [
      { level: "B", q: "Give `Weather` a default `unit` of `'°C'`.", a: "`function Weather({ temp, unit = '°C' })`" },
      { level: "I", q: "`<Rating stars={0} />` with `stars = 5` default: what renders?", a: "0. Zero is a real value, so the default isn't used." },
      { level: "C", q: "Make `null` also fall back to a default avatar image.", a: "Use `??` in the body.", code: `function Avatar({ src }) {\n  const url = src ?? '/default-avatar.png';\n  return <img src={url} alt="" />;\n}` }
    ],
    quiz: [
      { q: "In React 19, how do you set a default prop on a function component?", options: ["`Component.defaultProps = {...}`", "Destructuring default: `{ size = 'md' }`", "`useDefaultProps()`", "`props.size ||= 'md'`"], answer: 1, why: "`defaultProps` is removed for function components in React 19." },
      { q: "With `{ count = 1 }`, what is `count` for `<Item count={null} />`?", options: ["1", "`null`", "0"], answer: 1, why: "Defaults only apply to `undefined`." },
      { q: "With `{ label = 'OK' }`, what is `label` for `<Btn label=\"\" />`?", options: ["'OK'", "'' (empty string)"], answer: 1, why: "An empty string is a passed value, not `undefined`." }
    ],
    rev: {
      sec30: "Set prop defaults with destructuring: `function C({ size = 'md' })`. They apply only when the value is `undefined`, not `null`, `0` or `''`. React 19 removed `defaultProps` for function components (still works for classes). For `null` fallbacks, use `??` in the body.",
      interview: [
        { level: "basic", q: "How do you give a prop a default value?", a: "With a destructuring default in the parameter list: `{ size = 'md' }`." },
        { level: "intermediate", q: "What happened to `defaultProps` in React 19?", a: "It was removed for function components and is ignored; destructuring defaults replace it. Class components still support it." },
        { level: "tricky", q: "Does a default apply when the parent passes `null`?", a: "No. JS defaults only replace `undefined`. Use `value ?? fallback` if you need `null` covered." },
        { level: "advanced", q: "Any gotcha with `items = []` as a default?", a: "A new array is created on every render, which can break `memo` or effect dependencies. Hoist a constant like `const EMPTY = []`." }
      ],
      cheat: [
        "`function C({ size = 'md' })`",
        "Default used only for `undefined`",
        "`null`, `0`, `''` are real values: no default",
        "`defaultProps` removed for function components (React 19)",
        "Use `??` for null fallbacks",
        "Hoist `[]`/`{}` defaults if memoization matters"
      ]
    },
    related: ["PROPS-005", "PROPS-015", "TS-008"]
  },

  "PROPS-007": {
    tldr: "Strings go in quotes; everything else (numbers, booleans, arrays, objects, variables) goes in braces. `{{ }}` is just an object literal inside JSX braces.",
    analogy: { icon: "🧾", text: "Filling a recipe card. Plain words can be written straight in (“Pancakes”). Amounts, lists of ingredients and settings go in a box marked “calculate this” (the braces)." },
    visual: { type: "compare", title: "Quotes vs braces", left: { label: "Quotes \"…\"", tone: "neutral", points: [
      "String literals only", "`title=\"Pancakes\"`", "`\"4\"` is the text 4, not a number"
    ]}, right: { label: "Braces {…}", tone: "good", points: [
      "Any JS expression", "`servings={4}`  `vegan={true}`", "`tags={['quick', 'sweet']}`", "`chef={{ name: 'Mo', stars: 5 }}`", "`title={recipeName}` or template strings"
    ]}},
    points: [
      "**String**: `name=\"Mug\"`. Dynamic text needs braces: `label={greeting}`.",
      "**Number / boolean**: `price={9}`, `inStock={false}`. Quotes would make them strings.",
      "**Array**: `tags={['tea', 'gift']}`. **Object**: `user={{ name: 'Ali' }}`: outer braces = JSX, inner = object.",
      "Pass an existing variable: `items={cart}`.",
      "Spread an object as props: `<Product {...item} />` passes each key as its own prop."
    ],
    code: { file: "RecipeCard.jsx", lang: "jsx", src: `function RecipeCard({ title, servings, vegan, tags, chef }) {
  return (
    <article>
      <h3>{title} {vegan && '🌱'}</h3>
      <p>Serves {servings + 1} with seconds</p>
      <p>{tags.join(' · ')}</p>
      <small>by {chef.name} ({chef.stars}★)</small>
    </article>
  );
}

const chef = { name: 'Mo', stars: 5 };

export default function App() {
  return (
    <RecipeCard
      title="Pancakes"
      servings={4}
      vegan={true}
      tags={['quick', 'sweet']}
      chef={chef}
    />
  );
}`, walk: [
      { lines: [17], note: "String literal: quotes." },
      { lines: [18, 19], note: "Number and boolean: braces, so `servings + 1` is 5, not \"41\"." },
      { lines: [20], note: "Array literal inside braces." },
      { lines: [12, 21], note: "An object from a variable. Inline would be `chef={{ name: 'Mo', stars: 5 }}`." },
      { lines: [4, 5, 6, 7], note: "The child uses them as normal JS values." }
    ]},
    output: "“Pancakes 🌱”, “Serves 5 with seconds”, “quick · sweet”, “by Mo (5★)”.",
    mistakes: [
      { bad: `<RecipeCard servings="4" />\n// servings + 1 → "41"`, good: `<RecipeCard servings={4} />\n// servings + 1 → 5`, why: "Quotes always pass a string. String + number concatenates." },
      { bad: `<RecipeCard chef={ name: 'Mo' } />`, good: `<RecipeCard chef={{ name: 'Mo' }} />`, why: "One pair of braces opens JS; the second pair is the object literal. With one pair it's a syntax error." }
    ],
    practice: [
      { level: "B", q: "Pass `price` 12.5 and `onSale` true to `<Product />`.", a: "`<Product price={12.5} onSale={true} />` (or just `onSale`)." },
      { level: "I", q: "Pass a list of three todo strings and render them in a `<ul>`.", a: "`<TodoList todos={['Shop', 'Cook', 'Read']} />` then `todos.map(t => <li key={t}>{t}</li>)`." },
      { level: "C", q: "You have `const item = { name: 'Mug', price: 9 }`. Pass both as separate props in one go.", a: "`<Product {...item} />` gives `name` and `price` props." }
    ],
    quiz: [
      { q: "Which passes the number 3?", options: ["`qty=\"3\"`", "`qty={3}`", "`qty={\"3\"}`"], answer: 1, why: "Only braces with a numeric literal give a number." },
      { q: "In `style={{ color: 'red' }}`, what are the outer braces?", options: ["An object", "The JSX “JS expression” slot", "A CSS block"], answer: 1, why: "Outer braces open JS; the inner pair is the object." },
      { q: "`<Product {...item} />` with `item = { name: 'Mug', price: 9 }` gives…", options: ["One prop called `item`", "Two props: `name` and `price`", "An error"], answer: 1, why: "Spread turns each key into its own prop." }
    ],
    rev: {
      sec30: "Quotes pass string literals only. Braces pass any JS value: numbers, booleans, arrays, objects, variables, expressions. `{{ }}` is an object literal inside the JSX expression slot. `{...obj}` spreads an object's keys as separate props.",
      interview: [
        { level: "basic", q: "How do you pass a number vs a string prop?", a: "String: `name=\"Mug\"`. Number: `price={9}`. Quotes would make it the string \"9\"." },
        { level: "basic", q: "What do double braces `{{ }}` mean?", a: "Nothing special: the outer braces embed JS, the inner braces are an object literal." },
        { level: "intermediate", q: "What does `<Card {...product} />` do?", a: "Spreads each key of `product` as an individual prop. Later attributes override earlier ones." },
        { level: "tricky", q: "`<Cart count=\"0\" />`, and the child does `{count && <Badge />}`. What shows?", a: "The badge, because \"0\" is a truthy string. With `count={0}` it would render the text `0` instead: use `count > 0 &&`." }
      ],
      predict: [
        { code: `function Total({ qty }) {\n  return <p>{qty + 1}</p>;\n}\n<Total qty="2" />`, answer: "21", why: "\"2\" is a string, so `+` concatenates." }
      ],
      cheat: [
        "Quotes: string literals only",
        "Braces: numbers, booleans, arrays, objects, variables",
        "`obj={{ a: 1 }}` = JSX braces + object literal",
        "`{...item}` spreads keys as props",
        "Later attributes override spread values",
        "`\"false\"` and `\"0\"` are truthy strings"
      ]
    },
    related: ["PROPS-004", "JSX-008", "JSX-006"]
  },

  "PROPS-008": {
    tldr: "Pass a function as a prop so the child can tell the parent something happened: `<AddButton onAdd={handleAdd} />`. The child calls `onAdd()`; the parent decides what to do.",
    analogy: { icon: "🔔", text: "A waiter's call bell on your café table. The table (child) just rings it; the kitchen (parent) decides what to do. The bell is the function you handed over." },
    visual: { type: "flow", title: "Callback round trip", steps: [
      { label: "Parent defines handler", detail: "`function handleAdd(item) { setCart(...) }`" },
      { label: "Pass it down", detail: "`<ProductRow item={tea} onAdd={handleAdd} />`" },
      { label: "User clicks child", detail: "Child runs `onAdd(item)` in its `onClick`." },
      { label: "Parent updates state", detail: "Parent's state changes and it re-renders." },
      { label: "New props flow down", detail: "Children re-render with the new cart count." }
    ]},
    points: [
      "Data flows down, **events flow up** through callback props.",
      "Name them `onSomething` (prop) and `handleSomething` (parent function).",
      "Pass the function, don't call it: `onAdd={handleAdd}`, not `onAdd={handleAdd()}`.",
      "The child can send data back as arguments: `onAdd(item.id)`.",
      "C# view: like passing a delegate/`Action<T>` into a component."
    ],
    code: { file: "Shop.jsx", lang: "jsx", src: `import { useState } from 'react';

function ProductRow({ name, onAdd }) {
  return (
    <li>
      {name} <button onClick={() => onAdd(name)}>Add</button>
    </li>
  );
}

export default function Shop() {
  const [cart, setCart] = useState([]);

  function handleAdd(name) {
    setCart([...cart, name]);
  }

  return (
    <>
      <p>🛒 {cart.length} items</p>
      <ul>
        <ProductRow name="Green tea" onAdd={handleAdd} />
        <ProductRow name="Honey" onAdd={handleAdd} />
      </ul>
    </>
  );
}`, walk: [
      { lines: [12, 14, 15], note: "The parent owns the cart and the logic to change it." },
      { lines: [22, 23], note: "Pass the function itself (no parentheses)." },
      { lines: [3, 6], note: "The child calls the prop and passes data back up." },
      { lines: [20], note: "The parent re-renders and shows the new count." }
    ]},
    output: "“🛒 0 items”; clicking Add on either row increases the count.",
    mistakes: [
      { bad: `<ProductRow onAdd={handleAdd()} />`, good: `<ProductRow onAdd={handleAdd} />`, why: "`handleAdd()` runs during render and passes its return value (`undefined`). Setting state there can cause an infinite loop." },
      { bad: `<button onClick={onAdd(name)}>Add</button>`, good: `<button onClick={() => onAdd(name)}>Add</button>`, why: "To pass an argument, wrap it in an arrow function so it runs on click, not on render." }
    ],
    practice: [
      { level: "B", q: "Give a `LikeButton` an `onLike` prop and log “liked” in the parent.", a: "`<LikeButton onLike={() => console.log('liked')} />` and `<button onClick={onLike}>`." },
      { level: "I", q: "Build a `Todo` row with a Delete button that tells the parent which id to remove.", a: "Child: `onClick={() => onDelete(todo.id)}`. Parent: `setTodos(todos.filter(t => t.id !== id))`." },
      { level: "C", q: "Make `onAdd` optional so the button doesn't crash when it's not passed.", a: "Default to a no-op or use optional call.", code: `function ProductRow({ name, onAdd = () => {} }) { ... }\n// or: onClick={() => onAdd?.(name)}` }
    ],
    quiz: [
      { q: "How does a child send information to its parent?", options: ["By changing its props", "By calling a function the parent passed as a prop", "By returning a value from render", "With `this.parent`"], answer: 1, why: "Callback props are the standard way events go up." },
      { q: "What's wrong with `onSave={save()}`?", options: ["Nothing", "It calls `save` during render instead of passing it", "Functions can't be props"], answer: 1, why: "The parentheses call it immediately." },
      { q: "Where should the state live in the shop example?", options: ["In each ProductRow", "In the parent that shows the count", "In a global variable"], answer: 1, why: "The component that needs to show and change the data owns it." }
    ],
    rev: {
      sec30: "Functions are props too. The parent passes a callback (`onAdd={handleAdd}`), the child calls it on an event, optionally with data (`onAdd(id)`). This is how events flow up while data flows down. Pass the function, don't call it; wrap in an arrow to pass arguments.",
      interview: [
        { level: "basic", q: "How does a child communicate with its parent?", a: "The parent passes a function prop; the child calls it, optionally with arguments." },
        { level: "intermediate", q: "`onClick={handle}` vs `onClick={() => handle(id)}`?", a: "The first passes the function directly (gets the event). The second creates a function that calls `handle` with a custom argument on click." },
        { level: "advanced", q: "Do inline arrow callbacks hurt performance?", a: "Usually not. They only matter if the child is memoized and you care about stable identity; then use `useCallback` or rely on React Compiler." },
        { level: "tricky", q: "Why can `onAdd={handleAdd()}` cause “Too many re-renders”?", a: "It runs during render; if it sets state, that triggers another render, which calls it again, forever." }
      ],
      debug: [
        { code: `<Todo onDelete={deleteTodo(todo.id)} />`, fix: `<Todo onDelete={() => deleteTodo(todo.id)} />`, why: "The original deletes during render. Wrap it so it runs only when the child calls it." }
      ],
      cheat: [
        "Data down, events up (via callbacks)",
        "Prop: `onX`; parent function: `handleX`",
        "Pass `onX={handleX}`, never `onX={handleX()}`",
        "Arguments: `() => onX(id)`",
        "Optional callback: `onX?.()` or default `() => {}`"
      ]
    },
    related: ["COMM-002", "PROPS-013", "EVT-003", "STATE-021"]
  },

  "PROPS-009": {
    tldr: "JSX is just a value, so you can pass it as a prop: `<Layout sidebar={<Filters />} />`. The component decides **where** each piece goes (slots); the parent decides **what** goes in.",
    analogy: { icon: "🍱", text: "A bento box. The box has fixed compartments (rice, main, side). You choose what food goes in each one; the box just holds them in place." },
    visual: { type: "tree", title: "Named slots in a layout", root: { label: "<PageLayout>", note: "decides positions", children: [
      { label: "header={…}", note: "<SearchBar />" },
      { label: "sidebar={…}", note: "<CategoryFilters />" },
      { label: "children", note: "<ProductGrid />" },
      { label: "footer={…}", note: "<CartSummary />" }
    ]}},
    points: [
      "A JSX element is an ordinary JS value; any prop can hold one.",
      "Render it with braces where it belongs: `<aside>{sidebar}</aside>`.",
      "Use named props for **several** slots; `children` for the main one.",
      "The layout stays generic; parents plug in shop, chat or notes content.",
      "Pass an element (`icon={<Star />}`), not a component call (`icon={Star()}`)."
    ],
    code: { file: "PageLayout.jsx", lang: "jsx", src: `function PageLayout({ header, sidebar, children }) {
  return (
    <div className="page">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

function Button({ icon, label }) {
  return <button>{icon} {label}</button>;
}

export default function ShopPage() {
  return (
    <PageLayout
      header={<h1>Fresh Market</h1>}
      sidebar={<p>🍎 Fruit · 🥖 Bakery · 🧀 Dairy</p>}
    >
      <Button icon={<span>🛒</span>} label="View cart" />
    </PageLayout>
  );
}`, walk: [
      { lines: [1], note: "`header` and `sidebar` are slot props; `children` is the main content." },
      { lines: [4, 5, 6], note: "The layout places each slot. It doesn't care what's inside." },
      { lines: [18, 19], note: "The parent passes JSX directly as prop values." },
      { lines: [21], note: "Small slots work too: an icon element passed to a button." }
    ]},
    output: "Header “Fresh Market”, a sidebar with categories, and a “🛒 View cart” button in the main area.",
    mistakes: [
      { bad: `<Button icon={StarIcon} />\n// inside: {icon}`, good: `<Button icon={<StarIcon />} />\n// inside: {icon}`, why: "`StarIcon` is the component function; rendering a function as a child shows nothing and warns. Pass an element `<StarIcon />`." }
    ],
    practice: [
      { level: "B", q: "Give a `Card` a `footer` slot and pass a Buy button into it.", a: "`function Card({ footer, children }) { ... <div>{footer}</div> }` and `<Card footer={<button>Buy</button>}>…</Card>`." },
      { level: "I", q: "Build a `ChatWindow` with `header`, `messages` and `composer` slots.", a: "Three props rendered in three regions; the parent passes `<ChatHeader />`, `<MessageList />`, `<MessageInput />`." },
      { level: "C", q: "Make the `sidebar` slot optional: hide the `<aside>` when nothing is passed.", a: "`{sidebar && <aside>{sidebar}</aside>}`" }
    ],
    quiz: [
      { q: "Can a prop other than `children` hold JSX?", options: ["No, only `children`", "Yes, any prop can hold JSX", "Only with `React.cloneElement`"], answer: 1, why: "JSX elements are normal values." },
      { q: "When are named slot props better than `children`?", options: ["When there are several separate regions to fill", "Never", "When content is text only"], answer: 0, why: "One `children`, many named slots." },
      { q: "`<Btn icon={Star} />` then `{icon}` inside renders…", options: ["The star", "Nothing (with a warning)", "The text \"Star\""], answer: 1, why: "A function isn't a valid child; pass `<Star />`." }
    ],
    rev: {
      sec30: "JSX elements are values, so any prop can carry them. Named “slot” props (`header`, `sidebar`, `icon`) let a component control layout while the parent supplies content. Use `children` for the main area and named props for extra regions. Pass elements, not component functions.",
      interview: [
        { level: "basic", q: "Can you pass JSX as a prop?", a: "Yes. `<Card footer={<Button />} />`; the child renders `{footer}` wherever it wants." },
        { level: "intermediate", q: "What is the slot pattern?", a: "A layout component accepts several JSX props for different regions, so it's reusable across pages with different content." },
        { level: "advanced", q: "Element prop vs component prop (`icon={<Star />}` vs `icon={Star}`)?", a: "An element is ready to render. A component prop lets the child render it itself, e.g. `<Icon size={16} />`, with its own props. Choose based on who controls the props." },
        { level: "tricky", q: "Does passing JSX as a prop cause it to render twice?", a: "No. It's only rendered where the child places `{slot}`. If the child never uses it, it never mounts." }
      ],
      cheat: [
        "JSX is a value: any prop can hold it",
        "`<Layout sidebar={<Filters />}>`",
        "Child places it: `<aside>{sidebar}</aside>`",
        "`children` = main slot; named props = extra slots",
        "Pass `<Icon />`, not `Icon` (unless the child renders it)",
        "Unused slot = never rendered"
      ]
    },
    related: ["PROPS-010", "COMP-005", "COMM-013"]
  },

  "PROPS-010": {
    tldr: "Whatever you put between a component's opening and closing tags arrives as the `children` prop. Render `{children}` to wrap any content in a reusable frame.",
    analogy: { icon: "🎁", text: "Gift wrap. The wrapping paper (component) looks the same every time; whatever you put inside (children) changes: a book, a mug, a scarf." },
    visual: { type: "flow", title: "How `children` gets filled", steps: [
      { label: "Parent nests content", detail: "`<Card><h3>Mug</h3><p>$9</p></Card>`" },
      { label: "React collects it", detail: "The nested JSX becomes `props.children`." },
      { label: "Wrapper renders frame", detail: "`<div className=\"card\">{children}</div>`" },
      { label: "Content appears inside", detail: "The title and price show inside the card's border." }
    ]},
    points: [
      "Nested JSX between tags becomes `children`: no attribute needed.",
      "Render it with `{children}` wherever the content should go.",
      "Great for **wrappers**: Card, Modal, Panel, Button, Layout.",
      "`children` can be text, one element, many elements, or nothing.",
      "Treat it as opaque: just render it. Avoid `Children.map` tricks in new code."
    ],
    code: { file: "Card.jsx", lang: "jsx", src: `function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Card title="Today's weather">
        <p>☀️ 24°C, light breeze</p>
      </Card>
      <Card title="Shopping list">
        <ul>
          <li>Milk</li>
          <li>Bread</li>
        </ul>
      </Card>
    </>
  );
}`, walk: [
      { lines: [1], note: "`children` is destructured like any other prop." },
      { lines: [5], note: "The wrapper decides where the nested content goes." },
      { lines: [13, 14, 15], note: "Content between the tags becomes `children`." },
      { lines: [16, 17, 18, 19, 20, 21], note: "Same Card, totally different inside." }
    ]},
    output: "Two bordered cards: “Today's weather” with the forecast, and “Shopping list” with Milk and Bread.",
    mistakes: [
      { bad: `function Card({ title }) {\n  return <section><h3>{title}</h3></section>;\n}\n<Card title="Hi"><p>Body</p></Card>`, good: `function Card({ title, children }) {\n  return <section><h3>{title}</h3>{children}</section>;\n}`, why: "If the wrapper never renders `{children}`, the nested content silently disappears." }
    ],
    practice: [
      { level: "B", q: "Write a `Box` that wraps children in a `<div className=\"box\">`.", a: "Destructure `children` and render it inside the div.", code: `function Box({ children }) {\n  return <div className="box">{children}</div>;\n}` },
      { level: "I", q: "Build a `Button` that accepts its label as children: `<Button>Pay now</Button>`.", a: "`function Button({ children, ...rest }) { return <button {...rest}>{children}</button>; }`" },
      { level: "C", q: "Show “Nothing here yet” when a `List` wrapper has no children.", a: "`{children ?? <p>Nothing here yet</p>}` (an empty wrapper gives `undefined`)." }
    ],
    quiz: [
      { q: "`<Modal><p>Saved!</p></Modal>`: how does `Modal` get the paragraph?", options: ["`props.content`", "`props.children`", "`useChildren()`"], answer: 1, why: "Nested JSX is passed as `children`." },
      { q: "What happens if a wrapper doesn't render `{children}`?", options: ["React throws an error", "The nested content isn't shown", "It's added at the end automatically"], answer: 1, why: "React only renders what you return." },
      { q: "Can `children` be plain text?", options: ["Yes", "No, only elements"], answer: 0, why: "`<Button>Pay</Button>` gives `children === 'Pay'`." }
    ],
    rev: {
      sec30: "`children` is the prop holding whatever JSX sits between a component's tags. Render `{children}` where the content belongs to build reusable wrappers like Card, Modal and Layout. It can be text, elements, arrays or nothing. Treat it as opaque and just render it.",
      interview: [
        { level: "basic", q: "What is the `children` prop?", a: "The content nested between a component's opening and closing tags, passed automatically as `props.children`." },
        { level: "intermediate", q: "When would you use `children` vs a named prop?", a: "`children` for the main content of a wrapper; named props when there are multiple distinct regions." },
        { level: "advanced", q: "Why does React discourage `Children.map` / `cloneElement`?", a: "They're fragile: they depend on the exact structure passed in. Prefer explicit props, context or composition." },
        { level: "tricky", q: "Can you pass `children` as an attribute?", a: "Yes, `<Card children={<p>Hi</p>} />` works, but nesting between tags is clearer and lints flag the attribute form." }
      ],
      cheat: [
        "Content between tags → `children`",
        "Render with `{children}`",
        "Text, element(s) or nothing",
        "Use for wrappers: Card, Modal, Layout, Button",
        "Forget `{children}` = content vanishes",
        "Avoid `Children.map`/`cloneElement` in new code"
      ]
    },
    related: ["PROPS-009", "COMP-005", "TS-014"]
  },

  "PROPS-011": {
    tldr: "Props drilling is passing a prop through layers of components that don't use it, just to reach a deep child. It works, but every middle layer gets noisier and harder to change.",
    analogy: { icon: "📬", text: "Passing a note across a classroom. Every student in the row must hand it on, even though only the last one reads it. Add a student, and they must join the chain too." },
    visual: { type: "tree", title: "`user` drilled 3 levels deep", root: { label: "App", note: "owns `user`", children: [
      { label: "ShopLayout", note: "passes user (doesn't use it)", children: [
        { label: "Header", note: "passes user (doesn't use it)", children: [
          { label: "AccountMenu", note: "finally uses user.name" }
        ]}
      ]},
      { label: "Footer", note: "not involved" }
    ]}},
    points: [
      "**Drilling** = middle components accept and forward props they never use.",
      "2-3 levels is normal and fine: it's explicit and easy to trace.",
      "Pain grows with depth: renames touch many files, middle components get bloated.",
      "Fix #1: **composition**: pass the finished `<AccountMenu user={user} />` as `children` or a slot.",
      "Fix #2: **Context** for truly app-wide data (theme, current user, language)."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `function AccountMenu({ user }) {
  return <span>👤 {user.name}</span>;
}

function Header({ user }) {
  return <header>My Shop <AccountMenu user={user} /></header>;
}

function ShopLayout({ user }) {
  return <Header user={user} />;
}

// Fix with composition: no middle layer touches user
function Header2({ right }) {
  return <header>My Shop {right}</header>;
}

export default function App() {
  const user = { name: 'Sara' };
  return (
    <>
      <ShopLayout user={user} />
      <Header2 right={<AccountMenu user={user} />} />
    </>
  );
}`, walk: [
      { lines: [9, 10], note: "`ShopLayout` only forwards `user`: drilling." },
      { lines: [5, 6], note: "`Header` also forwards it without using it." },
      { lines: [14, 15], note: "Composition: `Header2` accepts a slot and stays unaware of `user`." },
      { lines: [23], note: "The parent builds the deep piece itself and plugs it in." }
    ]},
    output: "Two headers both showing “My Shop 👤 Sara”.",
    mistakes: [
      { bad: `// Reaching for Context for a prop used 2 levels down\nconst UserCtx = createContext();`, good: `// Pass it down, or compose with children/slots\n<Header right={<AccountMenu user={user} />} />`, why: "Context makes data flow implicit and couples components to a provider. Try plain props or composition first." }
    ],
    practice: [
      { level: "B", q: "In the tree above, which components “drill” `user`?", a: "`ShopLayout` and `Header`: they receive it only to pass it on." },
      { level: "I", q: "Remove drilling of `theme` through `Page → Sidebar → ThemeToggle` using composition.", a: "Let `Page` accept `sidebar` as a slot and have the top level pass `<Sidebar><ThemeToggle theme={theme} /></Sidebar>`." },
      { level: "C", q: "When would you switch from composition to Context?", a: "When many components at different depths need the same data (current user, theme, locale), so slots alone would get awkward." }
    ],
    quiz: [
      { q: "What is props drilling?", options: ["Passing props through components that don't need them to reach a deep child", "Mutating props deep in the tree", "Passing too many props to one component"], answer: 0, why: "It's about forwarding through uninvolved layers." },
      { q: "Is drilling a prop two levels always bad?", options: ["Yes, always use Context", "No, shallow drilling is fine and explicit"], answer: 1, why: "Explicit props are easy to trace; only deep chains hurt." },
      { q: "What's often the simplest fix before Context?", options: ["Global variables", "Component composition (children/slots)", "Redux"], answer: 1, why: "Composition lets the top level build the deep piece directly." }
    ],
    rev: {
      sec30: "Props drilling means forwarding props through components that don't use them. Shallow drilling is fine. Deep drilling makes changes ripple through many files. Fix with composition (pass the built child via `children`/slots) first, and Context for truly global data. State libraries are for complex shared state, not just drilling.",
      interview: [
        { level: "basic", q: "What is props drilling?", a: "Passing data through intermediate components that only forward it so a deeply nested child can use it." },
        { level: "intermediate", q: "Why is it a problem?", a: "Middle components get coupled to data they don't care about; renaming or adding a prop touches every layer." },
        { level: "advanced", q: "How do you solve it?", a: "First composition: lift the JSX up and pass it as children or slots. Then Context for widely shared values. A store (Zustand/Redux) only when shared state is also complex." },
        { level: "tricky", q: "Is drilling always an anti-pattern?", a: "No. React docs say passing props explicitly is often the clearest approach; it becomes a smell only when it's deep and widespread." }
      ],
      scenario: [
        { q: "Theme is passed through 6 components to reach buttons everywhere. What do you do?", a: "Put theme in a `ThemeContext` with a provider at the top, and read it with `use(ThemeContext)` or `useContext` where needed." }
      ],
      cheat: [
        "Drilling = forwarding props through uninvolved layers",
        "Shallow drilling is fine and explicit",
        "Deep drilling → brittle, noisy middle components",
        "Fix 1: composition (children / slot props)",
        "Fix 2: Context for app-wide data",
        "Stores are for complex shared state"
      ]
    },
    related: ["COMM-004", "COMM-006", "PROPS-009", "PROPS-013"]
  },

  "PROPS-012": {
    tldr: "Props are inputs a component **receives** from its parent; state is memory a component **owns** and can change. If it comes from outside, it's a prop. If it changes from user actions here, it's state.",
    analogy: { icon: "🎧", text: "A music player. The song list someone gave you is a prop (you didn't choose it). The volume knob and “now playing” are state (you change them yourself)." },
    visual: { type: "compare", title: "Props vs state", left: { label: "Props", tone: "neutral", points: [
      "Passed in by the parent", "Read-only for the child", "Like function arguments", "Change only when the parent re-renders with new values"
    ]}, right: { label: "State", tone: "good", points: [
      "Owned by this component", "Changed with its setter", "Like private memory", "Survives re-renders; change triggers a re-render"
    ]}},
    points: [
      "Ask: **who owns it?** Parent → prop. This component → state.",
      "Ask: **does it change over time here?** No → prop or a constant. Yes → state.",
      "Ask: **can it be calculated** from props or other state? → neither; compute it during render.",
      "One component's state is often the next component's prop.",
      "Both trigger a re-render when they change."
    ],
    code: { file: "Player.jsx", lang: "jsx", src: `import { useState } from 'react';

function Player({ songs }) {
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(5);
  const current = songs[index];

  return (
    <div>
      <p>▶ {current} ({index + 1}/{songs.length})</p>
      <button onClick={() => setIndex((index + 1) % songs.length)}>Next</button>
      <button onClick={() => setVolume(volume + 1)}>🔊 {volume}</button>
    </div>
  );
}

export default function App() {
  return <Player songs={['Sunrise', 'Ocean', 'Night Drive']} />;
}`, walk: [
      { lines: [3, 18], note: "`songs` comes from the parent: a **prop**." },
      { lines: [4, 5], note: "`index` and `volume` change from clicks here: **state**." },
      { lines: [6], note: "`current` is **derived**: calculated from both, not stored." },
      { lines: [11, 12], note: "Only state setters change values; `songs` is never modified." }
    ]},
    output: "“▶ Sunrise (1/3)”; Next cycles songs, 🔊 increases volume.",
    mistakes: [
      { bad: `function Price({ amount }) {\n  const [value, setValue] = useState(amount);\n  return <p>{value}</p>;\n}`, good: `function Price({ amount }) {\n  return <p>{amount}</p>;\n}`, why: "Copying a prop into state freezes it: if the parent passes a new `amount`, `value` won't update. Use the prop directly." },
      { bad: `const [total, setTotal] = useState(0);\n// updated whenever items change`, good: `const total = items.reduce((s, i) => s + i.price, 0);`, why: "Values you can compute from props/state shouldn't be state; they'd get out of sync." }
    ],
    practice: [
      { level: "B", q: "Todo app: is the todo `text` passed to `TodoItem` a prop or state?", a: "A prop. `TodoItem` receives it from the list." },
      { level: "B", q: "A search box's typed text: prop or state?", a: "State in the component that owns the input (or its parent, if others need it)." },
      { level: "I", q: "A cart total: prop, state or neither?", a: "Neither. Compute it from the cart items during render." },
      { level: "C", q: "Two siblings need the same `selectedCity`. Where does it live?", a: "As state in their common parent, passed down to both as props." }
    ],
    quiz: [
      { q: "Data a component receives from its parent is…", options: ["State", "A prop", "A ref"], answer: 1, why: "Props are inputs from outside." },
      { q: "A modal's “is open” flag toggled by its own close button is best as…", options: ["State in whoever controls it", "A hard-coded prop", "A global variable"], answer: 0, why: "It changes over time from user actions, so it's state (often in the parent if others open it)." },
      { q: "Why avoid `useState(props.amount)`?", options: ["It throws an error", "State ignores later prop changes", "Props can't be numbers"], answer: 1, why: "The initial value is only read on the first render." }
    ],
    rev: {
      sec30: "Props are read-only inputs from a parent; state is private, changeable memory owned by the component. Use state for values that change from interactions here; props for values handed down; and neither for values you can compute. One component's state commonly becomes its children's props.",
      interview: [
        { level: "basic", q: "Difference between props and state?", a: "Props are passed in and read-only; state is owned by the component and updated with its setter. Both cause re-renders when they change." },
        { level: "intermediate", q: "How do you decide if something should be state?", a: "If it comes from a parent, it's a prop. If it never changes, it's a constant. If it can be computed, compute it. Otherwise it's state." },
        { level: "advanced", q: "What's wrong with mirroring a prop into state?", a: "`useState(prop)` only uses the prop on the first render, so later changes are ignored. Use the prop directly, or reset with a `key` if you need a fresh copy." },
        { level: "tricky", q: "Can a child's prop change without the child doing anything?", a: "Yes. When the parent's state changes and it re-renders, the child receives new props automatically." }
      ],
      compare: { cols: ["", "Props", "State"], rows: [
        ["Owner", "Parent", "The component itself"],
        ["Mutable by the component?", "No", "Yes, via setter"],
        ["Causes re-render on change?", "Yes", "Yes"],
        ["Typical use", "Configure / display", "Interactive values"]
      ]},
      cheat: [
        "Props: passed in, read-only",
        "State: owned, changed with setter",
        "Computable? Don't store it, derive it",
        "Parent's state → child's props",
        "`useState(prop)` ignores later prop changes",
        "Shared by siblings → state in common parent"
      ]
    },
    related: ["STATE-001", "STATE-022", "STATE-021", "PROPS-013"]
  },

  "PROPS-013": {
    tldr: "In React, data flows **down** as props and events flow **up** as callback calls. The parent owns the state, the child asks for changes, and the new data flows back down.",
    analogy: { icon: "📝", text: "The family shopping list on the fridge. Only Mum (the owner) writes on it; everyone reads it. Need something? Ask Mum (callback), she updates the list, and everyone sees the new version." },
    visual: { type: "cycle", title: "Down, up, and down again", steps: [
      { label: "State in parent", detail: "`TodoApp` owns `todos` in state." },
      { label: "Props flow down", detail: "`<TodoItem todo={t} onToggle={toggle} />`" },
      { label: "User acts in child", detail: "Click on a checkbox inside `TodoItem`." },
      { label: "Event flows up", detail: "Child calls `onToggle(todo.id)`." },
      { label: "Parent updates", detail: "`setTodos(...)` → parent re-renders, new props go down." }
    ]},
    points: [
      "**One-way data flow** (unidirectional): props only travel parent → child.",
      "Children never change parent data directly; they **call a callback**.",
      "Each piece of state has **one owner**: the single source of truth.",
      "Easier debugging: to find why the UI changed, look up to the state owner.",
      "Unlike two-way binding (Angular `ngModel`, WPF): changes are always explicit."
    ],
    code: { file: "TodoApp.jsx", lang: "jsx", src: `import { useState } from 'react';

function TodoItem({ todo, onToggle }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        {todo.text}
      </label>
    </li>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Call mum', done: true },
  ]);

  function toggle(id) {
    setTodos(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const left = todos.filter(t => !t.done).length;
  return (
    <>
      <p>{left} left</p>
      <ul>
        {todos.map(t => <TodoItem key={t.id} todo={t} onToggle={toggle} />)}
      </ul>
    </>
  );
}`, walk: [
      { lines: [19, 20, 21, 22], note: "The parent is the single owner of `todos`." },
      { lines: [33], note: "**Down**: each item gets its data and a callback." },
      { lines: [9, 10], note: "**Up**: the child reports the click; it never edits `todo` itself." },
      { lines: [24, 25], note: "The parent makes a new array; React re-renders and new props flow down." },
      { lines: [28, 31], note: "Everything derived (the “left” count) stays in sync automatically." }
    ]},
    output: "“1 left” with two checkboxes. Ticking “Buy milk” changes it to “0 left”.",
    mistakes: [
      { bad: `function TodoItem({ todo }) {\n  return <input type="checkbox" checked={todo.done}\n    onChange={() => { todo.done = !todo.done; }} />;\n}`, good: `function TodoItem({ todo, onToggle }) {\n  return <input type="checkbox" checked={todo.done}\n    onChange={() => onToggle(todo.id)} />;\n}`, why: "Mutating the prop doesn't re-render anything and breaks the single source of truth. Ask the owner to change it." }
    ],
    practice: [
      { level: "B", q: "In the todo example, draw which way `todos` and `onToggle` travel.", a: "Both are passed down as props. Calls to `onToggle` travel up to `TodoApp`." },
      { level: "I", q: "Add a Delete button to `TodoItem` following one-way flow.", a: "Pass `onDelete`; child calls `onDelete(todo.id)`; parent does `setTodos(todos.filter(t => t.id !== id))`." },
      { level: "C", q: "A `SearchBox` and a `ResultsList` are siblings. How does typing filter the results?", a: "Lift `query` state to their parent. Pass `query` + `onQueryChange` to `SearchBox`, and `query` (or filtered items) to `ResultsList`." }
    ],
    quiz: [
      { q: "In one-way data flow, how does a child change parent data?", options: ["By assigning to its props", "By calling a callback prop the parent provided", "By using two-way binding"], answer: 1, why: "Events go up through callbacks; data comes back down." },
      { q: "What does “single source of truth” mean here?", options: ["Each piece of state is owned by exactly one component", "All state is in one global file", "Props and state are the same thing"], answer: 0, why: "One owner; everyone else gets it as props." },
      { q: "Siblings need the same data. Where does it live?", options: ["Duplicated in both", "In their closest common parent", "In whichever renders first"], answer: 1, why: "Lift state up so both read from one owner." }
    ],
    rev: {
      sec30: "React uses one-way (unidirectional) data flow: state lives in an owner component and flows down as props. Children request changes by calling callback props; the owner updates state, re-renders, and new props flow down. This keeps a single source of truth and makes changes easy to trace.",
      interview: [
        { level: "basic", q: "What is one-way data flow?", a: "Data moves only from parent to child via props. Children notify parents of changes through callbacks." },
        { level: "intermediate", q: "Why is it preferred over two-way binding?", a: "Every change goes through an explicit setter in one owner, so it's predictable and you can trace any UI change to one place." },
        { level: "intermediate", q: "How do controlled inputs fit this model?", a: "The parent passes `value` down and `onChange` up; the input shows exactly the state, and typing calls the setter." },
        { level: "advanced", q: "Does Context break one-way flow?", a: "No. Context still flows down from a provider; consumers change it only through functions the provider exposes." }
      ],
      cheat: [
        "Data flows down (props)",
        "Events flow up (callback props)",
        "One owner per piece of state",
        "Child never edits parent data directly",
        "Siblings share via common parent (lift state up)",
        "Controlled input = `value` down, `onChange` up"
      ]
    },
    related: ["PROPS-008", "STATE-021", "COMM-005", "STATE-023"]
  },

  "PROPS-014": {
    tldr: "A component must never change its props. Props belong to the parent; React expects your component to be a pure function of its inputs. To show something different, compute a new value or ask the parent to change it.",
    analogy: { icon: "📖", text: "A library book. You can read it and take notes on your own paper, but you don't scribble in it. If it needs changing, the library (parent) issues a new edition." },
    visual: { type: "compare", title: "Changing props vs respecting them", left: { label: "Mutate props", tone: "bad", points: [
      "`props.items.sort()` changes the parent's array", "No re-render: screen goes stale", "Parent and siblings see weird data", "Breaks Strict Mode and memoization"
    ]}, right: { label: "Treat as read-only", tone: "good", points: [
      "Copy: `[...items].sort()` or `items.toSorted()`", "Derive local values during render", "Need a change? Call a callback prop", "Same props → same output (pure)"
    ]}},
    points: [
      "Props are **read-only**. React freezes the props object in dev, so `props.x = 1` throws.",
      "Nested objects/arrays aren't frozen; mutating them still corrupts the **parent's** data.",
      "Watch for hidden mutators: `sort`, `reverse`, `push`, `splice`. Use `toSorted`, `toReversed`, spread.",
      "Components must be **pure**: same props in → same JSX out, no side effects on inputs.",
      "Strict Mode renders twice in **development** to help expose impure code; production renders once."
    ],
    code: { file: "Leaderboard.jsx", lang: "jsx", src: `function Leaderboard({ players }) {
  // ❌ players.sort(...) would reorder the parent's array
  const ranked = players.toSorted((a, b) => b.score - a.score);

  return (
    <ol>
      {ranked.map(p => (
        <li key={p.name}>{p.name}: {p.score}</li>
      ))}
    </ol>
  );
}

const players = [
  { name: 'Ana', score: 40 },
  { name: 'Ben', score: 75 },
  { name: 'Cleo', score: 60 },
];

export default function App() {
  return (
    <>
      <Leaderboard players={players} />
      <p>Signup order: {players.map(p => p.name).join(', ')}</p>
    </>
  );
}`, walk: [
      { lines: [2, 3], note: "`toSorted` returns a **new** array; the prop stays untouched." },
      { lines: [7, 8], note: "Render from the local copy." },
      { lines: [24], note: "The parent still sees the original order. With `.sort()` this line would be wrong too." }
    ]},
    output: "1. Ben: 75  2. Cleo: 60  3. Ana: 40\nSignup order: Ana, Ben, Cleo",
    mistakes: [
      { bad: `function Cart({ items }) {\n  items.push({ name: 'Free gift' });\n  return <List items={items} />;\n}`, good: `function Cart({ items }) {\n  const withGift = [...items, { name: 'Free gift' }];\n  return <List items={withGift} />;\n}`, why: "`push` changes the parent's array; each render (twice in Strict Mode) adds another gift. Build a new array instead." },
      { bad: `function Badge(props) {\n  props.label = props.label.toUpperCase();\n  return <span>{props.label}</span>;\n}`, good: `function Badge({ label }) {\n  const text = label.toUpperCase();\n  return <span>{text}</span>;\n}`, why: "The props object is frozen in dev, so this throws. Use a local variable." }
    ],
    practice: [
      { level: "B", q: "Show a `notes` prop in reverse order without changing it.", a: "`notes.toReversed()` or `[...notes].reverse()`." },
      { level: "I", q: "A `Profile` should show the name in capitals. Where do you do that?", a: "During render: `const display = name.toUpperCase();`. Never assign back to the prop." },
      { level: "C", q: "A child must mark a recipe as favourite. How, without mutating props?", a: "Parent passes `onFavourite`; child calls `onFavourite(recipe.id)`; parent updates its state with a new object." }
    ],
    quiz: [
      { q: "What happens on `props.title = 'New'` in development?", options: ["Title updates on screen", "It throws: props object is frozen", "React re-renders the parent"], answer: 1, why: "React freezes props in dev to catch this." },
      { q: "`items.sort()` on a prop array…", options: ["Is safe, it's a copy", "Mutates the parent's array", "Throws an error"], answer: 1, why: "Only the top-level props object is frozen; the array is the parent's own reference." },
      { q: "Why must components not change props?", options: ["Performance only", "Components must be pure; props belong to the parent", "It's just a style preference"], answer: 1, why: "Purity keeps rendering predictable and safe to repeat." }
    ],
    rev: {
      sec30: "Props are read-only: a component must be a pure function of them. The props object is frozen in dev, but nested arrays/objects aren't, so mutating them silently corrupts the parent's data. Derive new values (`toSorted`, spread) or ask the parent via a callback. Strict Mode's dev-only double render helps expose this.",
      interview: [
        { level: "basic", q: "Can a component modify its props?", a: "No. Props are read-only and owned by the parent. Compute local values or call a parent callback instead." },
        { level: "intermediate", q: "Why does React require it?", a: "Components must be pure so React can render them any number of times, in any order, and memoize safely." },
        { level: "tricky", q: "`props.list.push(x)` doesn't throw. Is it fine?", a: "No. Only the props object is frozen; the array is shared with the parent, so you mutate its state without a re-render." },
        { level: "advanced", q: "How does Strict Mode help here?", a: "In development it renders components twice, so a mutation like `push` shows up as duplicated data. Production renders once." }
      ],
      predict: [
        { code: `function Tags({ tags }) {\n  tags.push('new');\n  return <p>{tags.length}</p>;\n}\n// parent passes tags={['a']}; first render`, answer: "3 in dev with Strict Mode, 2 in production", why: "In dev, Strict Mode calls `Tags` twice with the same array, so `push` runs twice; React keeps the second result." }
      ],
      cheat: [
        "Never assign to props or their nested values",
        "Props object is frozen in dev; nested data isn't",
        "Avoid `sort`/`reverse`/`push`/`splice` on props",
        "Use `toSorted`, `toReversed`, `[...arr, x]`, `{...obj}`",
        "Need a change? Call a parent callback",
        "Pure: same props → same output"
      ]
    },
    related: ["PROPS-001", "COMP-017", "STATE-016", "RENDER-015"]
  },

  "PROPS-015": {
    tldr: "Most props bugs are a handful of repeat offenders: wrong quotes, forgotten braces in the parameter, calling a callback too early, mutating props and copying props into state. Learn to spot them fast.",
    analogy: { icon: "🔍", text: "A recipe checklist before serving: salt not sugar, oven on, timer set. A quick scan for the usual slips saves the whole dinner." },
    visual: { type: "flow", title: "Props bug checklist", steps: [
      { label: "Quotes or braces?", detail: "`price=\"9\"` is a string. Use `price={9}`." },
      { label: "Destructured?", detail: "`function C(title)` gets the whole object. Use `{ title }`." },
      { label: "Callback called early?", detail: "`onClick={save()}` runs on render. Use `() => save()`." },
      { label: "Prop mutated?", detail: "`items.push()` changes parent data. Copy instead." },
      { label: "Prop copied to state?", detail: "`useState(prop)` ignores later changes. Use the prop." },
      { label: "Name matches?", detail: "Parent passes `onAdd`, child reads `onAddItem` → `undefined`." }
    ]},
    points: [
      "**Typos and casing**: `onclick` vs `onClick`, `userName` vs `username` silently give `undefined`.",
      "**`key` isn't a prop**: the child can't read it; pass `id` separately.",
      "**`0 && <Badge />`** renders `0`. Use `count > 0 &&`.",
      "**Spreading everything** (`{...props}`) onto DOM elements leaks unknown attributes and warnings.",
      "**`defaultProps`** on function components is ignored in React 19: use destructuring defaults."
    ],
    code: { file: "CartBadge.jsx", lang: "jsx", src: `// Fixed version: each comment names the bug it avoids
function CartBadge({ count = 0, onOpen, label = 'Cart' }) { // destructure + defaults
  return (
    // not onClick={onOpen('cart')}: that runs during render
    <button onClick={() => onOpen?.('cart')}>
      {label}{' '}
      {/* not count && ...: a 0 would show up */}
      {count > 0 && <span className="badge">{count}</span>}
    </button>
  );
}

export default function App() {
  const items = ['Tea', 'Honey'];
  return (
    <CartBadge
      count={items.length} // braces, not "2"
      onOpen={(panel) => console.log('open', panel)}
    />
  );
}`, walk: [
      { lines: [2], note: "Destructuring with defaults: no `defaultProps`, no whole-object bug." },
      { lines: [4, 5], note: "Callback wrapped in an arrow, and `?.` so a missing `onOpen` doesn't crash." },
      { lines: [7, 8], note: "`count > 0 &&` avoids rendering a stray `0`." },
      { lines: [17], note: "Number passed with braces." }
    ]},
    output: "A “Cart 2” button. Clicking logs: open cart",
    mistakes: [
      { bad: `{todos.map(t => <Todo key={t.id} />)}\n// inside Todo: props.key`, good: `{todos.map(t => <Todo key={t.id} id={t.id} />)}\n// inside Todo: props.id`, why: "`key` is reserved for React's list tracking and isn't passed to the component." },
      { bad: `function Badge({ count }) {\n  return <p>{count && <span>{count}</span>}</p>;\n}`, good: `function Badge({ count }) {\n  return <p>{count > 0 && <span>{count}</span>}</p>;\n}`, why: "With `0`, `count && …` evaluates to `0`, which React renders as text." },
      { bad: `function Price({ amount }) {\n  const [value] = useState(amount);\n  return <p>{value}</p>;\n}`, good: `function Price({ amount }) {\n  return <p>{amount}</p>;\n}`, why: "State only reads the initial prop. New `amount` values from the parent are ignored." }
    ],
    practice: [
      { level: "B", q: "Find the bug: `<Rating stars=\"4\" />`, child does `stars + 1`.", a: "\"4\" is a string, so it shows 41. Use `stars={4}`." },
      { level: "I", q: "Find the bug: parent `<Item onRemove={remove} />`, child `onClick={() => props.onDelete(id)}`.", a: "Name mismatch. `onDelete` is `undefined`; use `onRemove`." },
      { level: "I", q: "Find the bug: `<Modal onClose={setOpen(false)} />`.", a: "It calls `setOpen(false)` during render (loop risk). Use `onClose={() => setOpen(false)}`." },
      { level: "C", q: "A `Button` spreads `{...props}` onto `<button>` and you pass `variant=\"ghost\"`. What goes wrong and how do you fix it?", a: "`variant` lands on the DOM as an unknown attribute. Destructure it out first.", code: `function Button({ variant = 'primary', ...rest }) {\n  return <button className={variant} {...rest} />;\n}` }
    ],
    quiz: [
      { q: "Child reads `props.key` and gets `undefined`. Why?", options: ["The parent forgot to pass it", "`key` is reserved by React and not passed as a prop", "Keys must be numbers"], answer: 1, why: "React consumes `key` itself." },
      { q: "`{count && <Badge />}` with `count = 0` shows…", options: ["Nothing", "0", "The badge"], answer: 1, why: "`0 && x` is `0`, and React renders numbers." },
      { q: "Best fix for `onSave={save(id)}`?", options: ["`onSave={save}(id)`", "`onSave={() => save(id)}`", "`onSave=\"save(id)\"`"], answer: 1, why: "Wrap it so it runs when called, not during render." }
    ],
    rev: {
      sec30: "Common props bugs: strings instead of numbers (`\"9\"`), missing braces when destructuring, calling callbacks during render, mutating props, mirroring props into state, name mismatches, reading `key`, `0 &&` rendering 0, leaking props via spread, and `defaultProps` (ignored for functions in React 19).",
      interview: [
        { level: "basic", q: "Why might a prop be `undefined` in the child?", a: "It wasn't passed, the name or casing differs, or it's `key`, which React keeps for itself. Log `props` to check." },
        { level: "intermediate", q: "Why does `{items.length && <List />}` sometimes show 0?", a: "When length is 0, the expression returns 0, which React renders. Use `items.length > 0 &&`." },
        { level: "advanced", q: "What's the risk of `<input {...props} />` in a design-system component?", a: "Custom props like `variant` leak to the DOM as invalid attributes, and callers can override things you meant to control. Destructure custom props out first." },
        { level: "tricky", q: "Why can `onClose={setOpen(false)}` crash the app?", a: "It sets state during render, which triggers another render that sets state again: “Too many re-renders”." }
      ],
      debug: [
        { code: `function Weather(city, unit) {\n  return <p>{city} {unit}</p>;\n}`, fix: `function Weather({ city, unit = '°C' }) {\n  return <p>{city} {unit}</p>;\n}`, why: "Props arrive as one object; destructure it (and add a default if useful)." },
        { code: `function Song({ title }) {\n  const [name, setName] = useState(title);\n  return <p>{name}</p>;\n}`, fix: `function Song({ title }) {\n  return <p>{title}</p>;\n}`, why: "Mirrored state goes stale when the parent passes a new title." }
      ],
      cheat: [
        "Numbers/booleans need braces, not quotes",
        "Destructure with `{ }` in the parameter",
        "Pass callbacks, don't call them: `() => fn(id)`",
        "Never mutate props (or their arrays/objects)",
        "Don't mirror props into state",
        "`key` isn't readable; `0 &&` renders 0",
        "`defaultProps` ignored on functions in React 19"
      ]
    },
    related: ["PROPS-006", "PROPS-014", "JSX-016", "COND-004"]
  }
};
