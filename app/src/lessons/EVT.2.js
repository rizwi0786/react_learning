export default {
  "EVT-013": {
    tldr: "In React a `<textarea>` works like a text input: give it `value` from state and update it in `onChange`. Don't put the text between the tags.",
    analogy: { icon: "📝", text: "A sticky-notes app. The note box is just a window; the real note text is saved in state, and the box always shows what's saved." },
    visual: { type: "compare", title: "HTML textarea vs React textarea",
      left: { label: "Plain HTML", tone: "neutral", points: ["Text goes between the tags", "`<textarea>Hi</textarea>`", "Browser owns the text"] },
      right: { label: "React", tone: "good", points: ["Text goes in the `value` prop", "`<textarea value={note} onChange={...} />`", "State owns the text (controlled)", "`defaultValue` for uncontrolled"] }
    },
    points: [
      "Controlled: `value={note}` + `onChange={e => setNote(e.target.value)}`.",
      "Self-closing in JSX: `<textarea />`. Children text triggers a React warning; use `value` or `defaultValue`.",
      "Line breaks are kept in the string as `\\n`. Show them with CSS `white-space: pre-wrap`.",
      "Size it with `rows` / `cols` (the defaults look tiny). `maxLength` limits characters.",
      "Because state holds the text, a live **character counter** is just `note.length`."
    ],
    code: { file: "NoteBox.jsx", lang: "jsx", src: `import { useState } from 'react';

const LIMIT = 140;

export default function NoteBox() {
  const [note, setNote] = useState('');
  const left = LIMIT - note.length;

  return (
    <div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={4}
        maxLength={LIMIT}
        placeholder="Write a note..."
      />
      <p style={{ color: left < 20 ? 'crimson' : 'gray' }}>
        {left} characters left
      </p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{note}</p>
    </div>
  );
}`, walk: [
      { lines: [6], note: "State holds the whole note, including line breaks." },
      { lines: [12, 13], note: "Controlled pair: show state, update state on every keystroke." },
      { lines: [14, 15], note: "`rows` sets visible height; `maxLength` stops typing past 140." },
      { lines: [7, 18, 19], note: "Derived value: the counter is computed from state each render, not stored." },
      { lines: [21], note: "`pre-wrap` keeps the user's line breaks when you display the note." }
    ]},
    output: "A 4-row box. Typing updates “140 characters left” live; the preview below keeps line breaks.",
    mistakes: [
      { bad: `<textarea>{note}</textarea>`, good: `<textarea value={note} onChange={e => setNote(e.target.value)} />`, why: "React wants the text in `value` (or `defaultValue`), not as children." },
      { bad: `<textarea value={note} />`, good: `<textarea value={note} onChange={e => setNote(e.target.value)} />`, why: "`value` without `onChange` makes it read-only and React warns. Add `onChange`, or use `defaultValue`." }
    ],
    practice: [
      { level: "B", q: "Make an uncontrolled textarea that starts with “Buy milk”.", a: "Use `defaultValue`.", code: `<textarea name="note" defaultValue="Buy milk" />` },
      { level: "B", q: "Add a **Clear** button.", a: "Set state back to an empty string.", code: `<button onClick={() => setNote('')}>Clear</button>` },
      { level: "I", q: "Show a word count instead of characters.", a: "`note.trim() ? note.trim().split(/\\s+/).length : 0`" },
      { level: "C", q: "Disable **Post** when the note is only spaces.", a: "`disabled={note.trim() === ''}` on the button." }
    ],
    quiz: [
      { q: "How do you set the text of a controlled textarea in React?", options: ["Put it between the tags", "`value` prop + `onChange`", "`text` prop", "`innerHTML`"], answer: 1, why: "Textarea uses `value` like an input." },
      { q: "A user types two lines. How are they stored in state?", options: ["As an array of lines", "As one string with `\\n`", "Only the last line is kept"], answer: 1, why: "The value is one string; line breaks are `\\n` characters." },
      { q: "`<textarea value={note} />` with no `onChange`. What happens?", options: ["It works normally", "It's read-only and React warns", "React throws an error and crashes"], answer: 1, why: "A controlled value with no way to change it is frozen." }
    ],
    rev: {
      sec30: "React treats `<textarea>` like `<input>`: controlled with `value` + `onChange`, or uncontrolled with `defaultValue`. Never put text as children. The value is one string with `\\n` line breaks; display it with `white-space: pre-wrap`. Counters and limits are derived from state.",
      interview: [
        { level: "basic", q: "How is a React textarea different from HTML?", a: "In HTML the text is the children; in React you use the `value` or `defaultValue` prop, so it behaves just like an input." },
        { level: "intermediate", q: "How would you build a live character counter?", a: "Control the textarea with state and derive `limit - text.length` during render. No extra state needed." },
        { level: "intermediate", q: "Why do line breaks disappear when I render the note in a `<p>`?", a: "HTML collapses whitespace. Use `white-space: pre-wrap` (or split on `\\n`). The `\\n`s are still in the string." },
        { level: "tricky", q: "Should you store the character count in its own state?", a: "No. It's derived from the text; extra state can go out of sync. Compute it each render." }
      ],
      debug: [
        { code: `<textarea value={bio}>{bio}</textarea>`, fix: `<textarea value={bio} onChange={e => setBio(e.target.value)} />`, why: "Remove children and add `onChange`; otherwise React warns and the box is read-only." }
      ],
      cheat: [
        "`<textarea value={v} onChange={e => setV(e.target.value)} />`",
        "Uncontrolled: `<textarea defaultValue=\"...\" />`",
        "No children text in JSX",
        "Line breaks are `\\n`; display with `white-space: pre-wrap`",
        "`rows`, `cols`, `maxLength`, `placeholder` work as in HTML",
        "Counters are derived: `limit - v.length`"
      ]
    },
    related: ["EVT-010", "EVT-004", "EVT-012"]
  },

  "EVT-014": {
    tldr: "Control a `<select>` by putting `value` on the **select itself**, not `selected` on an option. For `multiple`, the value is an array of strings.",
    analogy: { icon: "🍕", text: "A pizza order form. The size dropdown shows whatever size is written on your order slip (state). Change the dropdown and the slip is rewritten." },
    visual: { type: "flow", title: "Picking an option", steps: [
      { label: "Render", detail: "`<select value={size}>` shows the option whose `value` matches state (`'M'`)." },
      { label: "User picks Large", detail: "Browser fires `change` on the select." },
      { label: "onChange", detail: "`setSize(e.target.value)` → `'L'` (always a string)." },
      { label: "Re-render", detail: "Select now shows **Large**. State and screen agree." }
    ]},
    points: [
      "Single: `<select value={size} onChange={e => setSize(e.target.value)}>`.",
      "Don't use `selected` on `<option>`; React warns. Use `value` (controlled) or `defaultValue` (uncontrolled) on `<select>`.",
      "Option values are **strings**. Convert with `Number(...)` if you need a number.",
      "Multiple: `multiple={true}` + `value={arrayOfStrings}`; read with `Array.from(e.target.selectedOptions, o => o.value)`.",
      "Add a placeholder option `<option value=\"\">Choose...</option>` and start state as `''`."
    ],
    code: { file: "PizzaOrder.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function PizzaOrder() {
  const [size, setSize] = useState('');
  const [toppings, setToppings] = useState(['cheese']);

  function pickToppings(e) {
    const chosen = Array.from(e.target.selectedOptions, o => o.value);
    setToppings(chosen);
  }

  return (
    <form>
      <select value={size} onChange={e => setSize(e.target.value)}>
        <option value="">Choose a size...</option>
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
      </select>

      <select multiple value={toppings} onChange={pickToppings}>
        <option value="cheese">Cheese</option>
        <option value="olives">Olives</option>
        <option value="mushroom">Mushroom</option>
      </select>

      <p>Size: {size || 'none'} · Toppings: {toppings.join(', ')}</p>
    </form>
  );
}`, walk: [
      { lines: [4, 5], note: "Single select = one string. Multiple select = an array of strings." },
      { lines: [14], note: "`value` lives on `<select>`; React highlights the matching option." },
      { lines: [15], note: "Empty-value placeholder pairs with the `''` start state." },
      { lines: [7, 8, 9], note: "`selectedOptions` lists every chosen option; map it to their values." },
      { lines: [21], note: "`multiple` + array `value` keeps several options selected." }
    ]},
    output: "Size dropdown starts on “Choose a size...”. Toppings list starts with Cheese selected (Ctrl/Cmd-click for more). The line below updates live.",
    mistakes: [
      { bad: `<option value="M" selected>Medium</option>`, good: `<select value={size} onChange={...}>\n  <option value="M">Medium</option>`, why: "React controls selection from the select's `value`; `selected` on options triggers a warning." },
      { bad: `setQty(e.target.value); // "2"\n// later: qty + 1 → "21"`, good: `setQty(Number(e.target.value)); // 2\n// later: qty + 1 → 3`, why: "Option values are always strings. Convert before doing maths." }
    ],
    practice: [
      { level: "B", q: "Make an uncontrolled select that starts on Medium.", a: "Use `defaultValue` on the select.", code: `<select name="size" defaultValue="M">...</select>` },
      { level: "I", q: "Render options from an array `['S','M','L']`.", a: "Map with a key.", code: `{sizes.map(s => <option key={s} value={s}>{s}</option>)}` },
      { level: "I", q: "Read a multiple select inside a form `onSubmit` with FormData.", a: "`new FormData(e.currentTarget).getAll('toppings')` returns an array." },
      { level: "C", q: "Make a quantity select (1-5) that stores a number.", a: "`onChange={e => setQty(Number(e.target.value))}` and `value={qty}` (React compares as strings, so a number works)." }
    ],
    quiz: [
      { q: "Where does `value` go for a controlled select?", options: ["On the chosen `<option>`", "On the `<select>`", "On the `<form>`"], answer: 1, why: "React picks the option matching the select's `value`." },
      { q: "With `multiple`, what type should `value` be?", options: ["A comma-separated string", "An array", "A Set", "A number"], answer: 1, why: "A multiple select takes an array of option values." },
      { q: "`<option value={3}>` is picked. What is `e.target.value`?", options: ["3 (number)", "\"3\" (string)", "undefined"], answer: 1, why: "DOM values are always strings." }
    ],
    rev: {
      sec30: "React moves selection onto the `<select>`: `value` + `onChange` for controlled, `defaultValue` for uncontrolled. No `selected` on options. `e.target.value` is a string. For `multiple`, value is an array and you read `e.target.selectedOptions` (or `FormData.getAll`).",
      interview: [
        { level: "basic", q: "How do you control a select in React?", a: "Put `value={state}` on the `<select>` and update state in `onChange` with `e.target.value`." },
        { level: "intermediate", q: "How do you read a multi-select's values?", a: "`Array.from(e.target.selectedOptions, o => o.value)` in `onChange`, or `formData.getAll(name)` on submit." },
        { level: "intermediate", q: "Why does my quantity concatenate instead of add?", a: "Select values are strings. Convert with `Number()` when you store or use it." },
        { level: "tricky", q: "What if `value` doesn't match any option?", a: "The browser shows the first option, but state still holds the unmatched value, so screen and state disagree. Add a matching placeholder option." }
      ],
      predict: [
        { code: `const [s, setS] = useState('L');\n<select value={s} onChange={e => setS(e.target.value)}>\n  <option value="S">Small</option>\n  <option value="L">Large</option>\n</select>`, answer: "Shows “Large” on first render", why: "The option whose value equals state is selected." }
      ],
      cheat: [
        "`<select value={v} onChange={e => setV(e.target.value)}>`",
        "No `selected` on `<option>`; use `value` / `defaultValue` on select",
        "Values are strings: `Number(e.target.value)`",
        "`multiple` → `value={[...]}`",
        "`Array.from(e.target.selectedOptions, o => o.value)`",
        "Placeholder: `<option value=\"\">Choose...</option>`"
      ]
    },
    related: ["EVT-010", "EVT-016", "JSX-014"]
  },

  "EVT-015": {
    tldr: "A checkbox is controlled with `checked` (a boolean), not `value`, and you read `e.target.checked`. For a group, keep an **array** of the ticked values.",
    analogy: { icon: "✅", text: "A shopping list. Each item has a tick box; the list of ticked items lives on your notepad (state). Tick or untick and you add or cross it off the notepad." },
    visual: { type: "timeline", title: "A checkbox group in state", frames: [
      { label: "start", state: "extras = []", note: "Nothing ticked." },
      { label: "tick Gift wrap", state: "extras = ['wrap']", note: "Add it: `[...extras, value]`." },
      { label: "tick Card", state: "extras = ['wrap', 'card']", note: "Add another." },
      { label: "untick Gift wrap", state: "extras = ['card']", note: "Remove it: `extras.filter(x => x !== value)`." }
    ]},
    points: [
      "Single box: `checked={agree}` + `onChange={e => setAgree(e.target.checked)}`.",
      "Use `e.target.checked` (true/false). `e.target.value` is the box's `value` attribute (default `'on'`).",
      "Uncontrolled: `defaultChecked`. A controlled box without `onChange` is frozen (React warns).",
      "Group: one array in state. Ticked = `extras.includes(v)`. Toggle by adding with spread or removing with `filter`.",
      "Wrap the box in a `<label>` so clicking the text toggles it too."
    ],
    code: { file: "Checkout.jsx", lang: "jsx", src: `import { useState } from 'react';

const EXTRAS = [
  { id: 'wrap', label: 'Gift wrap' },
  { id: 'card', label: 'Greeting card' },
  { id: 'fast', label: 'Express delivery' },
];

export default function Checkout() {
  const [agree, setAgree] = useState(false);
  const [extras, setExtras] = useState([]);

  function toggle(id, isOn) {
    setExtras(prev => isOn ? [...prev, id] : prev.filter(x => x !== id));
  }

  return (
    <form>
      {EXTRAS.map(x => (
        <label key={x.id}>
          <input
            type="checkbox"
            checked={extras.includes(x.id)}
            onChange={e => toggle(x.id, e.target.checked)}
          />
          {x.label}
        </label>
      ))}
      <label>
        <input type="checkbox" checked={agree}
          onChange={e => setAgree(e.target.checked)} />
        I agree to the terms
      </label>
      <button disabled={!agree}>Pay</button>
    </form>
  );
}`, walk: [
      { lines: [10, 11], note: "One boolean for a single box, one array for the group." },
      { lines: [13, 14], note: "Toggle without mutating: spread to add, `filter` to remove." },
      { lines: [23], note: "A box in the group is ticked if its id is in the array." },
      { lines: [24], note: "`e.target.checked` is the new true/false after the click." },
      { lines: [30, 31, 34], note: "Single box drives a boolean; the Pay button is disabled until it's ticked." }
    ]},
    output: "Three extras you can tick in any combination, plus a terms box. **Pay** stays disabled until “I agree” is ticked.",
    mistakes: [
      { bad: `<input type="checkbox" value={agree}\n  onChange={e => setAgree(e.target.value)} />`, good: `<input type="checkbox" checked={agree}\n  onChange={e => setAgree(e.target.checked)} />`, why: "`value` is the label sent with a form ('on' by default). The ticked state is `checked`." },
      { bad: `extras.push(id);\nsetExtras(extras);`, good: `setExtras([...extras, id]);`, why: "Mutating the same array means React sees no change and may skip the re-render." }
    ],
    practice: [
      { level: "B", q: "Make a “Remember me” box that starts ticked, uncontrolled.", a: "Use `defaultChecked`.", code: `<input type="checkbox" name="remember" defaultChecked />` },
      { level: "I", q: "Add a **Select all** box for the extras.", a: "`checked={extras.length === EXTRAS.length}`; on change set `EXTRAS.map(x => x.id)` or `[]`." },
      { level: "I", q: "Read ticked extras on submit with FormData.", a: "Give each box `name=\"extras\" value={x.id}`, then `formData.getAll('extras')`." },
      { level: "C", q: "Show the Select-all box as half-ticked when only some are chosen.", a: "`indeterminate` is a DOM property only. Set it with a ref: `ref.current.indeterminate = some && !all` (in an effect or ref callback)." }
    ],
    quiz: [
      { q: "Which property holds whether a checkbox is ticked?", options: ["`e.target.value`", "`e.target.checked`", "`e.target.selected`"], answer: 1, why: "`checked` is the boolean; `value` is a fixed string." },
      { q: "Best state shape for “pick any of these 5 toppings”?", options: ["5 separate booleans", "An array of chosen values", "A single string"], answer: 1, why: "One array scales to any number of boxes and is easy to submit." },
      { q: "How do you untick 'card' in `extras`?", options: ["`extras.splice(i, 1)`", "`setExtras(extras.filter(x => x !== 'card'))`", "`delete extras['card']`"], answer: 1, why: "`filter` returns a new array, so React sees the change." }
    ],
    rev: {
      sec30: "Checkboxes use `checked` + `onChange` reading `e.target.checked`; `defaultChecked` for uncontrolled. A group is one array in state: ticked = `includes`, add with spread, remove with `filter`. `indeterminate` can only be set through a ref.",
      interview: [
        { level: "basic", q: "How do you control a checkbox?", a: "`checked={bool}` and `onChange={e => setBool(e.target.checked)}`." },
        { level: "intermediate", q: "How would you model a group of checkboxes?", a: "One array of selected ids. Each box's `checked` is `arr.includes(id)`; toggling adds via spread or removes via `filter`." },
        { level: "advanced", q: "How do you make a tri-state 'select all' box?", a: "There's no `indeterminate` attribute in HTML; set `el.indeterminate` on the DOM node via a ref when some but not all are chosen." },
        { level: "tricky", q: "Why does my checkbox state become the string 'on'?", a: "You read `e.target.value`. Unless you set a value, it defaults to 'on'. Read `e.target.checked`." }
      ],
      debug: [
        { code: `<input type="checkbox" checked={done} />`, fix: `<input type="checkbox" checked={done}\n  onChange={e => setDone(e.target.checked)} />`, why: "Without `onChange` the box can't be toggled and React warns about a read-only field." }
      ],
      cheat: [
        "`checked={b}` + `e.target.checked`",
        "Uncontrolled: `defaultChecked`",
        "`value` defaults to 'on'; it's what the form sends",
        "Group = array; ticked = `arr.includes(id)`",
        "Add `[...arr, id]`, remove `arr.filter(x => x !== id)`",
        "`indeterminate` only via a ref",
        "FormData: `getAll('name')` for groups"
      ]
    },
    related: ["EVT-016", "EVT-010", "STATE-013"]
  },

  "EVT-016": {
    tldr: "A radio group is **one** state value. Give every radio the same `name`, set `checked={choice === thisValue}`, and update the value in `onChange`.",
    analogy: { icon: "🚚", text: "Choosing delivery at checkout: Standard, Express or Pickup. You can only pick one, so the order holds a single word, and the dot follows that word." },
    visual: { type: "flow", title: "One value drives the whole group", steps: [
      { label: "State", detail: "`delivery = 'standard'`." },
      { label: "Each radio asks", detail: "`checked={delivery === 'express'}`: am I the chosen one?" },
      { label: "User clicks Pickup", detail: "That radio's `onChange` fires with `e.target.value = 'pickup'`." },
      { label: "Re-render", detail: "Only Pickup matches now; the dot moves. Exactly one is checked." }
    ]},
    points: [
      "Same `name` on every radio groups them (keyboard arrows, form submit, only one checked).",
      "Each radio: `value=\"express\"` + `checked={delivery === 'express'}`.",
      "One shared handler: `onChange={e => setDelivery(e.target.value)}`.",
      "`onChange` fires only on the radio that becomes checked, never when one is unchecked.",
      "Uncontrolled: `defaultChecked` on one radio and read `formData.get('delivery')` on submit."
    ],
    code: { file: "Delivery.jsx", lang: "jsx", src: `import { useState } from 'react';

const OPTIONS = [
  { value: 'standard', label: 'Standard (free)' },
  { value: 'express', label: 'Express (£4.99)' },
  { value: 'pickup', label: 'Pick up in store' },
];

export default function Delivery() {
  const [delivery, setDelivery] = useState('standard');

  return (
    <fieldset>
      <legend>Delivery</legend>
      {OPTIONS.map(o => (
        <label key={o.value}>
          <input
            type="radio"
            name="delivery"
            value={o.value}
            checked={delivery === o.value}
            onChange={e => setDelivery(e.target.value)}
          />
          {o.label}
        </label>
      ))}
      <p>You chose: {delivery}</p>
    </fieldset>
  );
}`, walk: [
      { lines: [10], note: "The whole group is one string in state." },
      { lines: [13, 14], note: "`fieldset` + `legend` give the group an accessible name." },
      { lines: [19], note: "Shared `name` makes them one group." },
      { lines: [21], note: "Checked only when it matches state." },
      { lines: [22], note: "Clicking a radio stores its `value`." }
    ]},
    output: "Three radios, Standard selected. Clicking another moves the dot and updates “You chose: ...”.",
    mistakes: [
      { bad: `const [std, setStd] = useState(true);\nconst [exp, setExp] = useState(false);\nconst [pick, setPick] = useState(false);`, good: `const [delivery, setDelivery] = useState('standard');`, why: "Separate booleans can end up with two 'on' at once. One value makes that impossible." },
      { bad: `<input type="radio" name="a" ... />\n<input type="radio" name="b" ... />`, good: `<input type="radio" name="delivery" ... />\n<input type="radio" name="delivery" ... />`, why: "Different names make separate groups, so arrow keys and form submit don't treat them as one choice." }
    ],
    practice: [
      { level: "B", q: "Add a fourth option, “Drone (£9)”.", a: "Add `{ value: 'drone', label: 'Drone (£9)' }` to `OPTIONS`; the map does the rest." },
      { level: "I", q: "Show the delivery cost based on the choice.", a: "Keep a lookup: `const COST = { standard: 0, express: 4.99, pickup: 0 }` and render `COST[delivery]`." },
      { level: "I", q: "Start with nothing selected and require a choice.", a: "`useState('')`; no radio matches; disable submit while `delivery === ''`." },
      { level: "C", q: "Turn it into a reusable `<RadioGroup name options value onChange />`.", a: "Move the map into the component; the parent owns the state and passes `value` and `onChange` down." }
    ],
    quiz: [
      { q: "How many state values does a controlled radio group need?", options: ["One per radio", "One for the group", "None"], answer: 1, why: "Only one can be picked, so one value is enough." },
      { q: "What makes radios behave as one group?", options: ["Same `value`", "Same `name`", "Same `id`"], answer: 1, why: "The browser groups radios by `name`." },
      { q: "When does a radio's `onChange` fire?", options: ["When it becomes checked", "When it becomes unchecked", "Both"], answer: 0, why: "Only the newly checked radio fires `change`." }
    ],
    rev: {
      sec30: "A radio group is a single state value. Every radio shares a `name`, has its own `value`, sets `checked={state === value}`, and calls `setState(e.target.value)` on change. Wrap in `fieldset`/`legend` for accessibility.",
      interview: [
        { level: "basic", q: "How do you control a radio group?", a: "Keep one value in state; each radio sets `checked={value === itsValue}` and updates the value in `onChange`." },
        { level: "intermediate", q: "Radio vs checkbox group: how does state differ?", a: "Radios: one string. Checkboxes: an array (or booleans), because many can be on." },
        { level: "intermediate", q: "Why is `name` still needed when React controls `checked`?", a: "It groups radios for keyboard navigation, screen readers and native form submission." },
        { level: "tricky", q: "Does unchecking a radio fire `onChange`?", a: "No. Only the radio that becomes checked fires, which is why one shared setter is enough." }
      ],
      compare: { cols: ["", "Radio group", "Checkbox group"], rows: [
        ["Picks", "Exactly one", "Zero or more"],
        ["State", "One string", "Array of values"],
        ["checked", "`v === opt`", "`arr.includes(opt)`"],
        ["FormData", "`get(name)`", "`getAll(name)`"]
      ]},
      cheat: [
        "Same `name` = one group",
        "`checked={choice === 'x'}`",
        "`onChange={e => setChoice(e.target.value)}`",
        "One string in state, never one boolean per radio",
        "Wrap in `<fieldset><legend>`",
        "Uncontrolled: `defaultChecked` + `formData.get(name)`"
      ]
    },
    related: ["EVT-015", "EVT-014", "EVT-010"]
  },

  "EVT-017": {
    tldr: "Validation checks the form before sending. Write one `validate(values)` function, run it as the user types, when they leave a field (blur) and on submit, and only **show** an error once the field has been touched.",
    analogy: { icon: "🧾", text: "A cashier checking your sign-up card: they glance as you write, point out a mistake when you move to the next line, and refuse the card only if something is still wrong when you hand it over." },
    visual: { type: "flow", title: "When to check, when to show", steps: [
      { label: "Type (change)", detail: "Re-run `validate`. Errors update silently; fixing a shown error clears it at once." },
      { label: "Leave field (blur)", detail: "Mark it **touched**. Now its error may appear." },
      { label: "Submit", detail: "`preventDefault`, mark all touched, run `validate` on everything." },
      { label: "Errors?", detail: "Yes: show them, focus the first bad field. No: send the data." }
    ]},
    points: [
      "Keep rules in one **pure** function: `validate(values) → { email: 'Enter a valid email' }`.",
      "Errors are **derived**: `const errors = validate(values)`, computed each render, no extra state.",
      "Track `touched` per field so you don't shout at users before they've finished typing.",
      "Messages should say how to fix it: “Password needs 8+ characters”, not “Invalid”.",
      "Accessibility: `aria-invalid` on the input and `aria-describedby` pointing at the message.",
      "Client checks are for UX. **The server must validate again** (users can bypass the browser)."
    ],
    code: { file: "SignUp.jsx", lang: "jsx", src: `import { useState } from 'react';

function validate(v) {
  const e = {};
  if (!v.email.includes('@')) e.email = 'Enter a valid email, like sam@shop.com';
  if (v.password.length < 8) e.password = 'Password needs at least 8 characters';
  return e;
}

export default function SignUp() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const errors = validate(values);
  const show = name => touched[name] && errors[name];

  const change = e => setValues({ ...values, [e.target.name]: e.target.value });
  const blur = e => setTouched({ ...touched, [e.target.name]: true });

  function submit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length === 0) alert('Account created!');
  }

  return (
    <form onSubmit={submit} noValidate>
      <input name="email" value={values.email} onChange={change} onBlur={blur}
        aria-invalid={!!show('email')} aria-describedby="email-err" />
      {show('email') && <p id="email-err" role="alert">{errors.email}</p>}

      <input name="password" type="password" value={values.password}
        onChange={change} onBlur={blur}
        aria-invalid={!!show('password')} aria-describedby="pw-err" />
      {show('password') && <p id="pw-err" role="alert">{errors.password}</p>}

      <button>Sign up</button>
    </form>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8], note: "All rules in one pure function: values in, error messages out." },
      { lines: [13, 14], note: "Errors are derived every render. Only show a field's error once it's touched." },
      { lines: [17], note: "On blur, mark that field touched, so its error can now appear." },
      { lines: [19, 20, 21, 22], note: "Submit marks everything touched (all errors show) and only proceeds if none." },
      { lines: [26], note: "`noValidate` turns off browser bubbles so your messages are the only ones." },
      { lines: [28, 29], note: "`aria-invalid` + `aria-describedby` let screen readers announce the error." }
    ]},
    output: "No errors on load. Leave the email box empty → “Enter a valid email...” appears. Click **Sign up** with a short password → both errors show. Fix them → they disappear as you type.",
    mistakes: [
      { bad: `const [errors, setErrors] = useState({});\n// ...must remember to update it everywhere`, good: `const errors = validate(values);`, why: "Errors computed from values can never be out of date. Separate error state easily goes stale." },
      { bad: `{errors.email && <p>{errors.email}</p>}`, good: `{touched.email && errors.email && <p>{errors.email}</p>}`, why: "Without `touched`, every field is red before the user has typed anything." }
    ],
    practice: [
      { level: "B", q: "Add a rule: name is required.", a: "In `validate`: `if (!v.name.trim()) e.name = 'Please enter your name';`" },
      { level: "I", q: "Add “confirm password” that must match.", a: "`if (v.confirm !== v.password) e.confirm = 'Passwords do not match';`, a rule that reads two fields." },
      { level: "I", q: "Disable the button while there are errors.", a: "`<button disabled={Object.keys(errors).length > 0}>`, but many teams keep it enabled so submit can reveal all errors." },
      { level: "C", q: "Focus the first invalid field on submit.", a: "Give inputs refs (or query the form), then `form.querySelector('[aria-invalid=\"true\"]')?.focus()` after the re-render, or focus by name from the errors object." }
    ],
    quiz: [
      { q: "Why track `touched`?", options: ["React requires it", "To avoid showing errors before the user has interacted", "To speed up rendering"], answer: 1, why: "Showing errors on untouched fields is noisy and unfriendly." },
      { q: "Best place to keep the error messages?", options: ["Separate state updated in every handler", "Derived from values with a pure `validate()`", "In a global variable"], answer: 1, why: "Derived errors stay in sync automatically." },
      { q: "If the client validates, can the server skip validation?", options: ["Yes", "No, users can bypass client checks"], answer: 1, why: "Requests can be sent without your UI. Server validation is the real guard." }
    ],
    rev: {
      sec30: "Put rules in a pure `validate(values)` and derive `errors` each render. Run it on change, mark fields `touched` on blur, mark all touched on submit. Show an error only if touched. Use clear fix-it messages, `aria-invalid`/`aria-describedby`, and always re-validate on the server.",
      interview: [
        { level: "basic", q: "Change, blur or submit: when should you validate?", a: "All three: compute on change, reveal on blur, and enforce on submit by marking every field touched and blocking if errors exist." },
        { level: "intermediate", q: "Why derive errors instead of storing them?", a: "They're a function of the values. Deriving avoids stale or contradicting state and extra setState calls." },
        { level: "intermediate", q: "Native `required`/`pattern` or custom JS?", a: "Native is free and accessible but its messages are hard to style. Many apps use `noValidate` + custom messages, or combine both." },
        { level: "advanced", q: "How do you make errors accessible?", a: "`aria-invalid` on the field, `aria-describedby` linking to the message, `role=\"alert\"` or a live region, and focus the first invalid field on submit." },
        { level: "tricky", q: "Is client-side validation a security feature?", a: "No. It's UX. Anyone can call your API directly, so the server must validate too." }
      ],
      scenario: [
        { q: "Users complain the form is “red before I even type”. Fix?", a: "Only render errors when `touched[field]` (set on blur) or after a submit attempt." }
      ],
      cheat: [
        "`validate(values) → errors` (pure)",
        "`const errors = validate(values)`: derived, not state",
        "`touched` on blur; show `touched[f] && errors[f]`",
        "Submit: preventDefault, touch all, block if errors",
        "`noValidate` to use your own messages",
        "`aria-invalid` + `aria-describedby`",
        "Server must validate too"
      ]
    },
    related: ["EVT-010", "SEC-005", "EVT-022", "TS-011"]
  },

  "EVT-018": {
    tldr: "A dynamic form keeps its fields in an **array in state**. Adding a field pushes a new item, removing filters it out, and each row gets a stable `id` for its `key`.",
    analogy: { icon: "🥕", text: "A recipe card's ingredient list. Tap “+ ingredient” for a new blank line, tap ✕ to cross one out. The card is just a list you grow and shrink." },
    visual: { type: "timeline", title: "Ingredients array over time", frames: [
      { label: "start", state: "[{id:a, name:'Flour'}]", note: "One row." },
      { label: "+ ingredient", state: "[{a,'Flour'}, {b,''}]", note: "`[...rows, { id: crypto.randomUUID(), name: '' }]`" },
      { label: "type 'Eggs'", state: "[{a,'Flour'}, {b,'Eggs'}]", note: "`map`: replace only the row with id b." },
      { label: "✕ Flour", state: "[{b,'Eggs'}]", note: "`filter(r => r.id !== 'a')`. Eggs keeps its input and focus." }
    ]},
    points: [
      "State shape: `[{ id, name, qty }]`. The UI is `rows.map(row => <Row key={row.id} />)`.",
      "Add: `setRows([...rows, newRow])`. Remove: `setRows(rows.filter(r => r.id !== id))`.",
      "Edit one row: `rows.map(r => r.id === id ? { ...r, [field]: value } : r)`.",
      "Give each row an id when it's **created** (`crypto.randomUUID()`), never `key={index}`.",
      "With index keys, removing row 1 makes React reuse inputs for the wrong rows (typed text and focus jump)."
    ],
    code: { file: "Ingredients.jsx", lang: "jsx", src: `import { useState } from 'react';

const newRow = () => ({ id: crypto.randomUUID(), name: '', qty: '' });

export default function Ingredients() {
  const [rows, setRows] = useState([newRow()]);

  const add = () => setRows([...rows, newRow()]);
  const remove = id => setRows(rows.filter(r => r.id !== id));
  const update = (id, field, value) =>
    setRows(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)));

  return (
    <form onSubmit={e => { e.preventDefault(); console.log(rows); }}>
      {rows.map((r, i) => (
        <div key={r.id}>
          <input aria-label={\`Ingredient \${i + 1}\`} value={r.name}
            onChange={e => update(r.id, 'name', e.target.value)} />
          <input aria-label="Quantity" value={r.qty} placeholder="200g"
            onChange={e => update(r.id, 'qty', e.target.value)} />
          <button type="button" onClick={() => remove(r.id)}
            disabled={rows.length === 1}>✕</button>
        </div>
      ))}
      <button type="button" onClick={add}>+ ingredient</button>
      <button>Save recipe</button>
    </form>
  );
}`, walk: [
      { lines: [3], note: "Each new row gets its id once, at creation time." },
      { lines: [8, 9], note: "Add with spread, remove with `filter`: new arrays, no mutation." },
      { lines: [10, 11], note: "Update one field of one row with `map` + object spread." },
      { lines: [16], note: "Stable `key={r.id}` keeps each input tied to its own row." },
      { lines: [21, 25], note: "`type=\"button\"` stops these buttons from submitting the form." }
    ]},
    output: "One ingredient row. “+ ingredient” adds blank rows; ✕ removes that row (disabled when only one is left). Save logs the array.",
    mistakes: [
      { bad: `{rows.map((r, i) => <Row key={i} ... />)}`, good: `{rows.map(r => <Row key={r.id} ... />)}`, why: "Index keys shift when a row is removed, so React reuses the wrong DOM inputs and component state." },
      { bad: `<button onClick={add}>+ ingredient</button>`, good: `<button type="button" onClick={add}>+ ingredient</button>`, why: "Buttons inside a form default to `type=\"submit\"`, so clicking “add” also submits the form." }
    ],
    practice: [
      { level: "B", q: "Show “3 ingredients” under the list.", a: "`<p>{rows.length} ingredients</p>`, derived from the array." },
      { level: "I", q: "Add a **Move up** button for each row.", a: "Copy the array, swap index `i` and `i - 1`, then `setRows(copy)`." },
      { level: "I", q: "Ignore empty rows when saving.", a: "`rows.filter(r => r.name.trim())` before sending." },
      { level: "C", q: "Focus the new input after clicking “+ ingredient”.", a: "Use a ref callback on the last row's input, or `autoFocus` on rows created by the add button (track the new id)." }
    ],
    quiz: [
      { q: "Best key for dynamic form rows?", options: ["The array index", "An id created with the row", "`Math.random()` in render"], answer: 1, why: "It must be stable across renders. Random in render changes every time." },
      { q: "How do you remove the row with id `x`?", options: ["`rows.splice(i, 1)`", "`setRows(rows.filter(r => r.id !== x))`", "`delete rows[x]`"], answer: 1, why: "`filter` returns a new array React can detect." },
      { q: "Clicking “+ ingredient” submits the form. Why?", options: ["The button has no `type`, so it's a submit button", "onClick is wrong", "React bug"], answer: 0, why: "Buttons in a form default to submit." }
    ],
    rev: {
      sec30: "Dynamic forms = an array of row objects in state. Add with spread, remove with `filter`, edit with `map` + spread. Give each row an id on creation and use it as the `key`; index keys break inputs when rows are removed. Non-submit buttons need `type=\"button\"`.",
      interview: [
        { level: "basic", q: "How do you add a field at runtime?", a: "Keep fields in an array in state and set a new array with the extra item: `setRows([...rows, newRow()])`." },
        { level: "intermediate", q: "Why not use the index as key here?", a: "Removing or reordering shifts indexes, so React matches the wrong DOM nodes: typed text, focus or child state jump rows." },
        { level: "intermediate", q: "Where should the id be generated?", a: "When the row is created (in the add handler or initial state), with `crypto.randomUUID()` or a counter, never during render." },
        { level: "tricky", q: "Why does my “add” button submit the form?", a: "Inside a form, `<button>` defaults to `type=\"submit\"`. Set `type=\"button\"`." }
      ],
      debug: [
        { code: `const update = (i, value) => {\n  rows[i].name = value;\n  setRows(rows);\n};`, fix: `const update = (id, value) =>\n  setRows(rows.map(r => r.id === id ? { ...r, name: value } : r));`, why: "Mutating and passing the same array means React may skip the update. Create new array and object." }
      ],
      cheat: [
        "Rows = `[{ id, ...fields }]` in state",
        "Add `[...rows, newRow()]`",
        "Remove `rows.filter(r => r.id !== id)`",
        "Edit `rows.map(r => r.id === id ? { ...r, [f]: v } : r)`",
        "`key={row.id}`, never index",
        "Ids made at creation: `crypto.randomUUID()`",
        "Extra buttons: `type=\"button\"`"
      ]
    },
    related: ["STATE-013", "RENDER-009", "EVT-019"]
  },

  "EVT-019": {
    tldr: "Give each input a `name` that matches a key in one state object. One handler then updates any field with `[e.target.name]: value`.",
    analogy: { icon: "📦", text: "A delivery address form. Each box has a label (name, street, city) matching a slot on the parcel label. Whatever box you write in, the same helper copies it to the right slot." },
    visual: { type: "flow", title: "One handler, many inputs", steps: [
      { label: "Input fires", detail: "User types in `<input name=\"city\">`." },
      { label: "Read the event", detail: "`const { name, value, type, checked } = e.target`." },
      { label: "Pick the value", detail: "Checkbox? use `checked`. Otherwise `value`." },
      { label: "Merge", detail: "`setForm(f => ({ ...f, [name]: v }))`: only `city` changes." },
      { label: "Re-render", detail: "Every input reads its own key: `value={form.city}`." }
    ]},
    points: [
      "One object in state: `{ name: '', city: '', newsletter: false }`.",
      "The input's `name` **must equal** the key in state (typos silently create a new key).",
      "Computed property name `[name]` uses the variable's value as the key.",
      "Spread first (`...f`) so other fields are kept; state updates replace, they don't merge.",
      "Handle checkboxes with `type === 'checkbox' ? checked : value`."
    ],
    code: { file: "AddressForm.jsx", lang: "jsx", src: `import { useState } from 'react';

const EMPTY = { fullName: '', street: '', city: '', newsletter: false };

export default function AddressForm() {
  const [form, setForm] = useState(EMPTY);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  return (
    <form onSubmit={e => { e.preventDefault(); console.log(form); }}>
      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" />
      <input name="street" value={form.street} onChange={handleChange} placeholder="Street" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <label>
        <input type="checkbox" name="newsletter"
          checked={form.newsletter} onChange={handleChange} />
        Email me deals
      </label>
      <button>Save address</button>
      <button type="button" onClick={() => setForm(EMPTY)}>Reset</button>
    </form>
  );
}`, walk: [
      { lines: [3, 6], note: "One object holds every field; `EMPTY` doubles as the reset value." },
      { lines: [9], note: "Destructure what you need from the input that fired." },
      { lines: [10], note: "Copy the old form, then overwrite just the key named by the input." },
      { lines: [15, 16, 17], note: "Each `name` matches a state key; all share `handleChange`." },
      { lines: [19, 20], note: "The same handler works for the checkbox thanks to the `type` check." }
    ]},
    output: "Typing in any box updates only that field. Save logs `{ fullName, street, city, newsletter }`; Reset clears everything.",
    mistakes: [
      { bad: `setForm({ [name]: value });`, good: `setForm(f => ({ ...f, [name]: value }));`, why: "useState replaces the whole object. Without the spread, every other field is wiped." },
      { bad: `<input name="fullname" value={form.fullName} ... />`, good: `<input name="fullName" value={form.fullName} ... />`, why: "A mismatched `name` writes to `form.fullname`, so the visible input never changes." },
      { bad: `setForm({ ...form, name: value });`, good: `setForm({ ...form, [name]: value });`, why: "Without brackets the key is literally the string \"name\", not the input's name." }
    ],
    practice: [
      { level: "B", q: "Add a postcode field.", a: "Add `postcode: ''` to `EMPTY` and `<input name=\"postcode\" value={form.postcode} onChange={handleChange} />`." },
      { level: "I", q: "Make an `age` field store a number.", a: "`type === 'number' ? e.target.valueAsNumber : value` (watch for `NaN` when empty)." },
      { level: "I", q: "Generate the inputs from a config array.", a: "`FIELDS.map(f => <input key={f} name={f} value={form[f]} onChange={handleChange} />)`" },
      { level: "C", q: "Support nested keys like `address.city`.", a: "Split the name on '.', then spread each level: `{ ...f, address: { ...f.address, city: value } }`." }
    ],
    quiz: [
      { q: "What does `{ ...f, [name]: value }` do when name is 'city'?", options: ["Adds a key literally called 'name'", "Copies f and sets `city` to value", "Replaces f with only city"], answer: 1, why: "Brackets make a computed key; the spread keeps the rest." },
      { q: "Why `checked` for checkboxes in a shared handler?", options: ["`value` is always 'on' (or its fixed value)", "`checked` is faster", "React requires it for all inputs"], answer: 0, why: "A checkbox's on/off state is `checked`." },
      { q: "You forget `...f`. What happens when you type in City?", options: ["Only City updates", "All other fields become undefined", "React merges automatically"], answer: 1, why: "State setters replace the value; they don't merge like class `setState` did." }
    ],
    rev: {
      sec30: "Keep the form in one object, give each input a `name` equal to its key, and use one handler: `setForm(f => ({ ...f, [e.target.name]: value }))`. Spread to keep the other fields, use `checked` for checkboxes, and keep names and keys spelled identically.",
      interview: [
        { level: "basic", q: "How do you handle many inputs with one function?", a: "Match each input's `name` to a state key and update with a computed key: `{ ...form, [e.target.name]: e.target.value }`." },
        { level: "intermediate", q: "Why do you need the spread?", a: "The `useState` setter replaces the object; without spreading, other fields are lost. (Class `setState` merged; hooks don't.)" },
        { level: "intermediate", q: "One object or many `useState`s?", a: "For related fields that are submitted together, one object is simpler. Independent values can stay separate." },
        { level: "tricky", q: "Why use the updater `f => ...` here?", a: "It always spreads the latest state, so fast or batched updates don't overwrite each other." }
      ],
      predict: [
        { code: `const [f, setF] = useState({ a: 1, b: 2 });\n// handler with name = 'a', value = 9\nsetF({ [name]: value });\nconsole.log(/* next render */ f);`, answer: "`{ a: 9 }` (b is gone)", why: "No spread, so the new object only has the computed key." }
      ],
      cheat: [
        "Input `name` === state key",
        "`setForm(f => ({ ...f, [name]: value }))`",
        "`[name]` = computed key",
        "Spread or lose the other fields",
        "Checkbox: `type === 'checkbox' ? checked : value`",
        "Reset: `setForm(EMPTY)`"
      ]
    },
    related: ["STATE-014", "EVT-010", "EVT-018"]
  },

  "EVT-020": {
    tldr: "Submitting to an API is a little state machine: **idle → sending → sent** or **error**. Track the status, disable the button while sending, check `res.ok`, and show a clear result.",
    analogy: { icon: "💬", text: "Sending a chat message: it shows “sending...”, then a tick when delivered, or a red “failed, tap to retry”. Your form should give the same feedback." },
    visual: { type: "cycle", title: "Submit status loop", steps: [
      { label: "idle", detail: "Form ready. Button says **Send**." },
      { label: "sending", detail: "`preventDefault`, `setStatus('sending')`, button disabled: no double submits." },
      { label: "await fetch", detail: "POST JSON. `fetch` only rejects on network failure, so check `res.ok` too." },
      { label: "sent / error", detail: "Success: thank-you + reset. Error: keep the values, show a message, allow retry." }
    ]},
    points: [
      "One `status` string (`'idle' | 'sending' | 'sent' | 'error'`) beats several booleans that can contradict.",
      "Grab `e.currentTarget` **before** `await`; after it, the event's `currentTarget` is `null`.",
      "`fetch` does **not** throw on 400/500. `if (!res.ok) throw new Error(...)`.",
      "Disable the button and change its label while sending, so users can't submit twice.",
      "On error keep what they typed. On success reset or show a confirmation.",
      "React 19 alternative: `<form action={fn}>` + `useActionState` gives you `isPending` for free (see HOOKS-018)."
    ],
    code: { file: "ContactForm.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(\`Server error \${res.status}\`);
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  const sending = status === 'sending';
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required placeholder="Your email" />
      <textarea name="message" required placeholder="How can we help?" />
      <button disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
      {status === 'sent' && <p role="status">Thanks! We'll reply soon.</p>}
      {status === 'error' && <p role="alert">Couldn't send ({error}). Try again.</p>}
    </form>
  );
}`, walk: [
      { lines: [4], note: "One status value describes exactly where the submit is." },
      { lines: [8, 9, 10], note: "Stop the reload, keep the form element, read all named fields at once." },
      { lines: [11], note: "Enter **sending**: the button disables on the next render." },
      { lines: [13, 14, 15, 16, 17, 18], note: "POST JSON, then treat non-2xx responses as errors." },
      { lines: [19, 20, 22, 23], note: "Success clears the form; failure keeps it and stores the message." },
      { lines: [32, 33, 34], note: "The UI is a function of status: label, disabled, success and error." }
    ]},
    output: "Click **Send** → button reads “Sending...” and is disabled. Then either “Thanks! We'll reply soon.” (form cleared) or “Couldn't send (Server error 500). Try again.” (values kept).",
    mistakes: [
      { bad: `const res = await fetch(url, opts);\nsetStatus('sent');`, good: `const res = await fetch(url, opts);\nif (!res.ok) throw new Error(\`Server error \${res.status}\`);\nsetStatus('sent');`, why: "A 500 response still resolves. Without the `res.ok` check you'd show “sent” for a failure." },
      { bad: `await fetch(...);\ne.currentTarget.reset();`, good: `const form = e.currentTarget;\nawait fetch(...);\nform.reset();`, why: "`currentTarget` is only set while the event is being dispatched; after `await` it's `null`." },
      { bad: `const [loading, setLoading] = useState(false);\nconst [done, setDone] = useState(false);\nconst [failed, setFailed] = useState(false);`, good: `const [status, setStatus] = useState('idle');`, why: "Three booleans allow impossible combos (loading and failed). One status can't contradict itself." }
    ],
    practice: [
      { level: "B", q: "Show a spinner emoji while sending.", a: "`{sending && <span aria-hidden>⏳</span>}` next to the button." },
      { level: "I", q: "Show field errors returned by the server (`{ errors: { email: '...' } }`).", a: "On `!res.ok`, `const body = await res.json()` and store `body.errors` in state; render each under its field." },
      { level: "I", q: "Hide the success message after 3 seconds.", a: "In an effect watching `status === 'sent'`, set a timeout back to `'idle'` and clear it in the cleanup." },
      { level: "C", q: "Rewrite with React 19 `useActionState`.", a: "Move the fetch into `async (prev, formData) => {...}` that returns `{ ok }` or `{ error }`, pass `formAction` to `<form action>`, and use `isPending` for the button." }
    ],
    quiz: [
      { q: "The API returns 500. What does `await fetch()` do?", options: ["Throws an error", "Resolves with `res.ok === false`", "Returns undefined"], answer: 1, why: "fetch only rejects on network errors; you must check `res.ok`." },
      { q: "Why disable the submit button while sending?", options: ["It looks nicer", "To stop duplicate submissions", "React requires it"], answer: 1, why: "Double clicks would send the order or message twice." },
      { q: "After `await`, `e.currentTarget` is...", options: ["Still the form", "`null`", "The button"], answer: 1, why: "It's reset once dispatch finishes. Save it to a variable first." }
    ],
    rev: {
      sec30: "Model submission with one status: idle, sending, sent, error. `preventDefault`, save `e.currentTarget`, read `FormData`, set sending, `await fetch`, check `res.ok`, then set sent (reset) or error (keep values, show message). Disable the button while pending. React 19 `useActionState` packages the same pattern.",
      interview: [
        { level: "basic", q: "What states should a submitting form show?", a: "Idle, pending (button disabled, “Sending...”), success and error, with the error message and a way to retry." },
        { level: "intermediate", q: "Why check `res.ok`?", a: "fetch resolves for any HTTP response, including 4xx/5xx. Only network failures reject." },
        { level: "intermediate", q: "Why one status string instead of booleans?", a: "It makes impossible states unrepresentable, like loading and error at the same time." },
        { level: "advanced", q: "How does React 19 change this?", a: "`<form action={fn}>` with `useActionState` tracks pending and the returned result inside a transition; `useFormStatus` gives child buttons the pending flag. It works client-side; Server Functions are framework-only." },
        { level: "tricky", q: "Why does `e.currentTarget.reset()` crash after await?", a: "React's event `currentTarget` is only valid during dispatch; after the await it's `null`. Store the form first." }
      ],
      scenario: [
        { q: "Users report duplicate orders when the network is slow.", a: "Disable the button while status is 'sending' (and ideally send an idempotency key so the server ignores repeats)." }
      ],
      cheat: [
        "`status`: idle → sending → sent | error",
        "`e.preventDefault()`; save `e.currentTarget` before await",
        "`Object.fromEntries(new FormData(form))`",
        "`if (!res.ok) throw ...`: fetch doesn't throw on 500",
        "Disable + relabel the button while sending",
        "Error: keep values. Success: reset/confirm",
        "React 19: `useActionState` → `[state, action, isPending]`"
      ]
    },
    related: ["API-009", "HOOKS-018", "EVT-009", "EVT-011"]
  },

  "EVT-021": {
    tldr: "Four ways to build forms: plain **useState**, **React 19 form Actions**, **React Hook Form** (fast, schema-friendly) and **Formik** (older, mostly in existing code). Pick by form size and where the data goes.",
    analogy: { icon: "🧳", text: "Packing for a trip: a carry-on (plain state) for a weekend, the hotel's luggage service (React Actions) for check-in, a full suitcase with organisers (React Hook Form) for a long trip. Formik is the old suitcase you still own." },
    visual: { type: "flow", title: "Which form approach?", steps: [
      { label: "1-3 fields, simple", detail: "**Manual** `useState` or `FormData`. No dependency needed." },
      { label: "Submit + pending state", detail: "**React 19 Actions**: `<form action>` + `useActionState` + `useFormStatus`." },
      { label: "Big form, many rules", detail: "**React Hook Form** + Zod: few re-renders, schema validation, field arrays." },
      { label: "Existing Formik app", detail: "**Formik**: keep and maintain it; few new projects choose it today." }
    ]},
    points: [
      "**Manual**: full control, zero deps, but you hand-write touched, errors and submit state.",
      "**React 19 Actions** (built in, client-side too): pending + result state; uncontrolled fields auto-reset after the Action. Validation is still yours.",
      "**React Hook Form**: uncontrolled inputs via `register`, so typing doesn't re-render the whole form. Pairs with Zod.",
      "**Formik**: controlled values in its own state, `<Field>` + Yup. Updates have slowed; mostly maintained in older apps.",
      "Libraries can **combine** with Actions; validation on the server is still required either way."
    ],
    code: { file: "Newsletter.jsx", lang: "jsx", src: `// The built-in option: a React 19 form Action (no library)
import { useActionState } from 'react';

async function subscribe(prevState, formData) {
  const email = formData.get('email');
  if (!email.includes('@')) return { error: 'Enter a valid email' };
  await new Promise(r => setTimeout(r, 800)); // pretend API call
  return { ok: \`Subscribed \${email}\` };
}

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribe, {});

  return (
    <form action={formAction}>
      <input name="email" placeholder="you@mail.com" />
      <button disabled={isPending}>{isPending ? 'Joining...' : 'Join'}</button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.ok && <p role="status">{state.ok}</p>}
    </form>
  );
}`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "The Action gets the previous state and the `FormData`, and returns the next state." },
      { lines: [12], note: "`useActionState` returns the latest result, a form action and a pending flag." },
      { lines: [15], note: "Pass it to `action`, not `onSubmit`. No `preventDefault` needed." },
      { lines: [17], note: "`isPending` is true while the async Action runs." },
      { lines: [18, 19], note: "Render whatever the Action returned." }
    ]},
    output: "Type an email and click **Join** → “Joining...” for ~1s, then “Subscribed you@mail.com”. An address without @ shows “Enter a valid email” and the box clears (Actions reset the form).",
    mistakes: [
      { bad: `// 3-field contact form\nnpm i formik yup`, good: `// 3-field contact form\n// useState / FormData, or a React 19 Action`, why: "A library adds weight and concepts. Reach for one when forms get big or rule-heavy." },
      { bad: `// "React Actions validate my fields for me"`, good: `// Actions give pending + result state;\n// you still write (or plug in) validation`, why: "Actions handle submission plumbing, not validation rules." }
    ],
    practice: [
      { level: "B", q: "Which approach for a single search box?", a: "Manual: `useState` or read `FormData` on submit. No library." },
      { level: "I", q: "A 30-field job application form with nested rules. Which approach and why?", a: "React Hook Form + Zod: one schema, field arrays, and few re-renders as users type." },
      { level: "I", q: "What does `useFormStatus` add?", a: "A child component (like a submit button) can read `pending` of its parent `<form>` without prop drilling." },
      { level: "C", q: "How would you combine React Hook Form with an Action?", a: "Validate with RHF in `handleSubmit`, then call the Action (e.g. in `startTransition`) with the validated data; or keep RHF client-side and validate again on the server." }
    ],
    quiz: [
      { q: "Why is React Hook Form usually faster than Formik on big forms?", options: ["It uses uncontrolled inputs, so typing doesn't re-render the whole form", "It uses Web Workers", "It skips validation"], answer: 0, why: "RHF reads values from the DOM via refs; Formik stores every keystroke in state." },
      { q: "React 19 form Actions are...", options: ["Next.js-only", "Built into React and work client-side too", "A third-party package"], answer: 1, why: "`<form action={fn}>` and `useActionState` ship with React 19. Server Functions are the framework-only part." },
      { q: "Best default for a new large form today?", options: ["Formik", "React Hook Form + a schema", "jQuery validation"], answer: 1, why: "It's actively maintained, fast and schema-friendly." }
    ],
    rev: {
      sec30: "Manual state is fine for small forms. React 19 Actions (`<form action>`, `useActionState`, `useFormStatus`) handle pending and results without a library. React Hook Form is the go-to for large, validated forms (uncontrolled, Zod resolver). Formik is controlled, slower on big forms and mainly met in existing code.",
      interview: [
        { level: "basic", q: "When would you not use a form library?", a: "Small forms with simple rules: useState or FormData (or a React 19 Action) is clearer and has no dependency." },
        { level: "intermediate", q: "React Hook Form vs Formik?", a: "RHF registers uncontrolled inputs, so fewer re-renders and a smaller API; Formik keeps controlled values in state. New projects mostly pick RHF." },
        { level: "intermediate", q: "What do React 19 Actions give you?", a: "Async submit handled in a transition: `isPending`, the returned state via `useActionState`, `useFormStatus` for children, and automatic form reset." },
        { level: "advanced", q: "Where do schema libraries like Zod fit?", a: "One schema describes the shape and rules; reuse it in RHF's resolver on the client and to parse input on the server." },
        { level: "tricky", q: "Do Actions require Next.js?", a: "No. Client form Actions are plain React 19. Only Server Functions (`'use server'`) need a framework." }
      ],
      compare: { cols: ["", "Manual", "React 19 Actions", "React Hook Form", "Formik"], rows: [
        ["Dependency", "None", "None", "react-hook-form", "formik (+ yup)"],
        ["Inputs", "Controlled", "Uncontrolled", "Uncontrolled", "Controlled"],
        ["Validation", "Hand-written", "Hand-written", "Built in / Zod", "Built in / Yup"],
        ["Pending state", "Manual", "`isPending`", "`isSubmitting`", "`isSubmitting`"],
        ["Use for", "Small forms", "Submit plumbing", "Large forms", "Legacy code"]
      ]},
      cheat: [
        "Small form → useState / FormData",
        "React 19: `<form action>` + `useActionState` + `useFormStatus`",
        "Actions = pending + result, not validation",
        "Large form → React Hook Form + Zod",
        "RHF: uncontrolled → fewer re-renders",
        "Formik: controlled, Yup, mostly legacy",
        "Always validate on the server too"
      ]
    },
    related: ["EVT-022", "EVT-023", "HOOKS-018", "HOOKS-030"]
  },

  "EVT-022": {
    tldr: "React Hook Form's `useForm` wires inputs with `register`, validates with a **Zod schema** through `zodResolver`, and only calls your submit function when the data is valid.",
    analogy: { icon: "🍽️", text: "A restaurant booking desk with a rule sheet (the schema). The host checks every booking against the sheet and only passes valid ones to the kitchen (your `onSubmit`)." },
    visual: { type: "flow", title: "From typing to valid data", steps: [
      { label: "register('email')", detail: "Spread onto the input: gives `name`, `ref`, `onChange`, `onBlur`." },
      { label: "Submit", detail: "`handleSubmit(onSubmit)` prevents the reload and collects values." },
      { label: "zodResolver", detail: "Runs `schema` on the values; failures become `formState.errors`." },
      { label: "Invalid?", detail: "Show `errors.email.message`; focus the first bad field. `onSubmit` is not called." },
      { label: "Valid", detail: "`onSubmit(data)` gets typed, parsed data." }
    ]},
    points: [
      "Install: `npm i react-hook-form zod @hookform/resolvers`.",
      "`const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema), defaultValues })`.",
      "`<input {...register('name')} />`: inputs stay uncontrolled, so typing doesn't re-render the form.",
      "Default: validate on submit, then re-validate on change. Use `mode: 'onBlur'` or `'onTouched'` to check earlier.",
      "Number inputs give strings: `register('guests', { valueAsNumber: true })` (or `z.coerce.number()`).",
      "Zod 4 uses `z.email()`; older Zod 3 code uses `z.string().email()`."
    ],
    code: { file: "BookTable.jsx", lang: "jsx", src: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name needs at least 2 letters'),
  email: z.email('Enter a valid email'),
  guests: z.number().min(1, 'At least 1 guest').max(8, 'Max 8 guests'),
});

export default function BookTable() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', guests: 2 },
  });

  async function onSubmit(data) {
    await new Promise(r => setTimeout(r, 800)); // pretend API call
    alert(\`Table for \${data.guests} booked, \${data.name}!\`);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <p role="alert">{errors.name.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input type="number" {...register('guests', { valueAsNumber: true })} />
      {errors.guests && <p role="alert">{errors.guests.message}</p>}

      <button disabled={isSubmitting}>{isSubmitting ? 'Booking...' : 'Book'}</button>
    </form>
  );
}`, walk: [
      { lines: [5, 6, 7, 8, 9], note: "The schema is the single source of rules and messages." },
      { lines: [12, 13, 14, 15], note: "`useForm` with the Zod resolver and starting values." },
      { lines: [17, 18, 19, 20, 21], note: "Only runs with valid data; while it awaits, `isSubmitting` is true." },
      { lines: [24], note: "`handleSubmit` stops the reload, validates, then calls `onSubmit`." },
      { lines: [25, 26], note: "`register` connects the input; errors come back with your message." },
      { lines: [31], note: "`valueAsNumber` turns the input's string into a number for `z.number()`." }
    ]},
    output: "Click **Book** empty → “Name needs at least 2 letters”, “Enter a valid email”. Fix them; errors clear as you type. Valid → “Booking...” then an alert, and the form resets.",
    mistakes: [
      { bad: `<form onSubmit={onSubmit}>`, good: `<form onSubmit={handleSubmit(onSubmit)}>`, why: "Without `handleSubmit` there's no validation, no `preventDefault`, and `onSubmit` gets the raw event instead of data." },
      { bad: `<input type="number" {...register('guests')} />\n// z.number() fails: it receives a string`, good: `<input type="number" {...register('guests', { valueAsNumber: true })} />`, why: "DOM inputs always give strings. Convert with `valueAsNumber` or use `z.coerce.number()`." },
      { bad: `<input value={name} onChange={...} {...register('name')} />`, good: `<input {...register('name')} />`, why: "Mixing your own controlled state with `register` fights RHF. For controlled UI kits, use `<Controller>`." }
    ],
    practice: [
      { level: "B", q: "Show errors when leaving a field, not only on submit.", a: "`useForm({ mode: 'onBlur', ... })` (or `'onTouched'`)." },
      { level: "I", q: "Add a “date” field that must be in the future.", a: "`date: z.coerce.date().min(new Date(), 'Pick a future date')` and `<input type=\"date\" {...register('date')} />`." },
      { level: "I", q: "Show a live preview of the name.", a: "`const name = watch('name')`; this re-renders when that field changes." },
      { level: "C", q: "Let users add several dietary notes.", a: "`useFieldArray({ control, name: 'notes' })` gives `fields`, `append`, `remove`; use `field.id` as the key and `register(\`notes.\${i}.text\`)`." }
    ],
    quiz: [
      { q: "What does `{...register('email')}` spread onto the input?", options: ["`value` and `onChange` only", "`name`, `ref`, `onChange`, `onBlur`", "The validation schema"], answer: 1, why: "RHF tracks the input through its ref and events." },
      { q: "When does `onSubmit(data)` run with `handleSubmit`?", options: ["On every submit", "Only when validation passes", "On every keystroke"], answer: 1, why: "Invalid submits fill `errors` instead." },
      { q: "By default, when does RHF first validate?", options: ["On change", "On blur", "On submit"], answer: 2, why: "`mode` defaults to `'onSubmit'`; after that it re-validates on change." }
    ],
    rev: {
      sec30: "`useForm({ resolver: zodResolver(schema), defaultValues })` returns `register`, `handleSubmit` and `formState`. Spread `register('field')` on inputs (uncontrolled, few re-renders). `handleSubmit(onSubmit)` validates against the Zod schema and only calls you with valid data. Errors live in `formState.errors`; `isSubmitting` tracks async submits.",
      interview: [
        { level: "basic", q: "What does `register` do?", a: "Returns `name`, `ref`, `onChange` and `onBlur` for an input so RHF can read and validate it without you holding its value in state." },
        { level: "intermediate", q: "Why use Zod with RHF?", a: "One schema defines rules and messages, gives parsed/typed output, and can be reused on the server." },
        { level: "intermediate", q: "Why is RHF fast?", a: "Inputs are uncontrolled and `formState` is a proxy, so only components reading a changed piece re-render." },
        { level: "advanced", q: "How do you use RHF with a controlled component like a date picker library?", a: "Wrap it in `<Controller control={control} name=\"date\" render={({ field }) => <Picker {...field} />} />`." },
        { level: "tricky", q: "Why does `z.number()` fail on a number input?", a: "Inputs give strings. Use `valueAsNumber: true` in `register` or `z.coerce.number()`." }
      ],
      debug: [
        { code: `const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });\n<form onSubmit={onSubmit}>`, fix: `<form onSubmit={handleSubmit(onSubmit)}>`, why: "`handleSubmit` runs the resolver and prevents the page reload." }
      ],
      cheat: [
        "`npm i react-hook-form zod @hookform/resolvers`",
        "`useForm({ resolver: zodResolver(schema), defaultValues })`",
        "`<input {...register('name')} />`",
        "`<form onSubmit={handleSubmit(onSubmit)}>`",
        "`formState.errors.name?.message`, `isSubmitting`",
        "`mode: 'onBlur' | 'onTouched' | 'onChange'`",
        "Numbers: `{ valueAsNumber: true }`",
        "Lists: `useFieldArray`; UI kits: `<Controller>`"
      ]
    },
    related: ["EVT-021", "EVT-017", "TS-011", "EVT-018"]
  },

  "EVT-023": {
    tldr: "Formik is an older form library you'll meet in existing apps. Know its pieces: `<Formik>` holds values, `<Form>`/`<Field>` wire inputs, Yup validates, and `onSubmit` gets clean values.",
    analogy: { icon: "📻", text: "An older but working kitchen radio in a café you've taken over. You don't need to replace it today; you just need to know which knob does what." },
    visual: { type: "tree", title: "Anatomy of a Formik form", root: { label: "<Formik>", note: "initialValues, validationSchema, onSubmit", children: [
      { label: "render function", note: "({ isSubmitting, errors, touched })", children: [
        { label: "<Form>", note: "a <form> with submit + reset wired", children: [
          { label: "<Field name=\"email\" />", note: "input bound to values.email" },
          { label: "<ErrorMessage name=\"email\" />", note: "shows error if touched" },
          { label: "<Field as=\"select\" name=\"plan\" />", note: "same API for selects" },
          { label: "<button type=\"submit\">", note: "disabled={isSubmitting}" }
        ]}
      ]},
      { label: "Yup schema", note: "rules + messages" }
    ]}},
    points: [
      "`initialValues` sets every field; `<Field name>` must match a key in it.",
      "`validationSchema` takes a **Yup** schema (or use a `validate(values)` function returning errors).",
      "Errors show after a field is **touched** (blur) or after a submit attempt, much like the manual pattern.",
      "If `onSubmit` returns a Promise, Formik resets `isSubmitting` when it settles.",
      "Formik keeps values in React state (controlled), so big forms re-render on every keystroke.",
      "Releases have slowed; maintain it where it exists, choose React Hook Form for new forms."
    ],
    code: { file: "Subscribe.jsx", lang: "jsx", src: `import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  plan: Yup.string().oneOf(['free', 'pro'], 'Pick a plan'),
});

const save = values => new Promise(r => setTimeout(() => r(values), 800));

export default function Subscribe() {
  return (
    <Formik
      initialValues={{ email: '', plan: 'free' }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        await save(values);
        alert(\`Subscribed to \${values.plan}\`);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="p" />
          <Field as="select" name="plan">
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </Field>
          <button type="submit" disabled={isSubmitting}>Subscribe</button>
        </Form>
      )}
    </Formik>
  );
}`, walk: [
      { lines: [4, 5, 6, 7], note: "Yup schema: the rules and their messages." },
      { lines: [14, 15], note: "Every field starts in `initialValues`; Formik validates with the schema." },
      { lines: [16, 17, 18, 19, 20], note: "Runs only when valid. Helpers like `resetForm` come in the second argument." },
      { lines: [22], note: "Render function: read `isSubmitting`, `errors`, `touched`, `values`." },
      { lines: [24, 25], note: "`<Field>` binds to `values.email`; `<ErrorMessage>` renders the error once touched." },
      { lines: [26], note: "`as=\"select\"` renders a select with the same binding." }
    ]},
    output: "Leave Email empty and tab away → “Email is required”. Enter a valid email, click **Subscribe** → disabled for ~1s, an alert, then the form resets.",
    mistakes: [
      { bad: `initialValues={{ email: '' }}\n<Field name="phone" />`, good: `initialValues={{ email: '', phone: '' }}\n<Field name="phone" />`, why: "Fields missing from `initialValues` start `undefined` (uncontrolled → controlled warning) and aren't marked touched on submit." },
      { bad: `onSubmit={(values, { setSubmitting }) => {\n  fetch(url, ...); // never calls setSubmitting(false)\n}}`, good: `onSubmit={async values => {\n  await fetch(url, ...);\n}}`, why: "With a sync handler you must call `setSubmitting(false)` yourself. Return a Promise and Formik does it." }
    ],
    practice: [
      { level: "B", q: "Add a required “name” field.", a: "Add `name: ''` to `initialValues`, `name: Yup.string().required('Name is required')` to the schema, and `<Field name=\"name\" />` + `<ErrorMessage name=\"name\" />`." },
      { level: "I", q: "Rewrite with the `useFormik` hook.", a: "`const f = useFormik({ initialValues, validationSchema, onSubmit })`; then `<form onSubmit={f.handleSubmit}>` and `<input {...f.getFieldProps('email')} />`." },
      { level: "I", q: "Map this to React Hook Form.", a: "`initialValues` → `defaultValues`, `validationSchema` → `resolver: yupResolver(schema)`, `<Field>` → `register`, `<ErrorMessage>` → `errors.email?.message`." },
      { level: "C", q: "A Formik form with 60 fields lags while typing. Options?", a: "Use `<FastField>` for independent fields, split into smaller forms, or migrate that form to React Hook Form." }
    ],
    quiz: [
      { q: "What does `<Field name=\"email\" />` bind to?", options: ["A local useState", "`values.email` in Formik's state", "The DOM only"], answer: 1, why: "Formik owns values; `Field` reads and writes `values[name]`." },
      { q: "Which library does `validationSchema` usually expect?", options: ["Zod", "Yup", "Joi"], answer: 1, why: "Formik has built-in Yup support for `validationSchema`." },
      { q: "Your `onSubmit` is async. Who resets `isSubmitting`?", options: ["You, always", "Formik, when the Promise settles", "Nobody, it stays true"], answer: 1, why: "Formik 2 handles it for Promise-returning handlers." }
    ],
    rev: {
      sec30: "Formik: `<Formik initialValues validationSchema onSubmit>` wraps a render function; `<Form>`, `<Field name>`, `<ErrorMessage>` do the wiring; Yup does the rules. Values are controlled in Formik state, errors show when touched, async `onSubmit` auto-clears `isSubmitting`. It's legacy-leaning: maintain it, choose RHF for new work.",
      interview: [
        { level: "basic", q: "What are Formik's main pieces?", a: "`<Formik>` (or `useFormik`) for state, `<Form>`, `<Field>`, `<ErrorMessage>` for wiring, and a Yup schema or `validate` function for rules." },
        { level: "intermediate", q: "How does Formik differ from React Hook Form?", a: "Formik stores values in React state (controlled), so every keystroke re-renders; RHF uses uncontrolled inputs and re-renders less." },
        { level: "intermediate", q: "When does `<ErrorMessage>` show?", a: "When the field has an error **and** is touched; submit marks all `initialValues` fields touched." },
        { level: "advanced", q: "Would you migrate a Formik codebase?", a: "Not just for its own sake. Keep stable forms, build new ones with RHF, and migrate slow or frequently changed forms one at a time." },
        { level: "tricky", q: "Why does my new field never show its error on submit?", a: "It isn't in `initialValues`, so Formik doesn't mark it touched (and it starts undefined)." }
      ],
      compare: { cols: ["", "Formik", "React Hook Form"], rows: [
        ["Start values", "`initialValues`", "`defaultValues`"],
        ["Validation", "`validationSchema` (Yup)", "`resolver` (Zod/Yup)"],
        ["Wire input", "`<Field name>`", "`{...register(name)}`"],
        ["Errors", "`<ErrorMessage>`", "`errors[name]?.message`"],
        ["Inputs", "Controlled", "Uncontrolled"]
      ]},
      cheat: [
        "`<Formik initialValues validationSchema onSubmit>`",
        "`<Form>`, `<Field name>`, `<ErrorMessage name>`",
        "`<Field as=\"select\">` for selects/textarea",
        "Every field in `initialValues`",
        "Async `onSubmit` auto-resets `isSubmitting`",
        "Hook version: `useFormik` + `getFieldProps`",
        "Controlled → slower on big forms; new work: RHF"
      ]
    },
    related: ["EVT-021", "EVT-022", "EVT-017"]
  }
};
