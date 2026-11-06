export default {
  "TEST-001": {
    tldr: "Tests (automated checks) are small programs that use your app and shout when something breaks. A bug caught by a test costs seconds; the same bug found by a customer costs money and trust.",
    analogy: { icon: "🧁", text: "A baker tastes each batch before it goes on the shelf. Tasting takes a minute; a tray of salty cupcakes sold to customers costs the shop its reputation." },
    visual: { type: "layers", title: "The testing trophy (most value in the middle)", items: [
      { label: "End-to-end (few)", detail: "A real browser clicks through checkout. Slow, but proves the whole app works." },
      { label: "Integration (most)", detail: "Several components + real state together. Best confidence for the cost." },
      { label: "Unit (some)", detail: "One function or small component on its own. Fast and precise." },
      { label: "Static (always on)", detail: "TypeScript + ESLint catch typos and wrong types before any test runs." }
    ]},
    points: [
      "**The later a bug is found, the more it costs**: in your editor (seconds) < in CI (minutes) < in production (customers, hotfixes, refunds).",
      "Tests are a **safety net for change**: refactor or upgrade React and know in seconds if anything broke.",
      "The **testing trophy** (Kent C. Dodds): static at the base, a little unit, **lots of integration**, a few end-to-end.",
      "Test what users **do and see**, not how the code is written inside.",
      "Our stack: **Vitest + React Testing Library + MSW** for unit/integration, **Playwright** for end-to-end."
    ],
    code: { file: "cart.test.js", lang: "js", src: `import { describe, it, expect } from 'vitest';

function cartTotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

describe('cartTotal', () => {
  it('adds price × qty for every item', () => {
    const items = [
      { name: 'Tea', price: 3, qty: 2 },
      { name: 'Cake', price: 5, qty: 1 },
    ];
    expect(cartTotal(items)).toBe(11);
  });

  it('is 0 for an empty cart', () => {
    expect(cartTotal([])).toBe(0);
  });
});`, walk: [
      { lines: [1], note: "Test helpers from Vitest: `describe` groups tests, `it` is one test, `expect` checks a result." },
      { lines: [3, 4], note: "The code under test. Normally imported from `cart.js`; inlined here so it runs as-is." },
      { lines: [8, 9, 10, 11, 12, 13], note: "One behaviour per test, named in plain English. `toBe(11)` fails loudly if the maths changes." },
      { lines: [16, 17], note: "Edge cases (empty cart) are where real bugs hide. Cheap to add, expensive to forget." }
    ]},
    output: "✓ cartTotal > adds price × qty for every item\n✓ cartTotal > is 0 for an empty cart\nTest Files 1 passed · Tests 2 passed",
    mistakes: [
      { bad: `// "I'll click through the app before each release"`, good: `// npm test runs in CI on every pull request\nexpect(cartTotal(items)).toBe(11);`, why: "Manual checking is slow, gets skipped under pressure and misses old features. Automated tests run every time, for free." },
      { bad: `// 300 tiny unit tests, zero tests of components working together`, good: `// a few unit tests for tricky logic\n// most tests render real components together\n// a handful of e2e tests for key journeys`, why: "Units can all pass while the app is broken. Integration tests give the most confidence per test (the trophy shape)." }
    ],
    practice: [
      { level: "B", q: "Name the four layers of the testing trophy, bottom to top.", a: "Static, unit, integration, end-to-end. Integration is the widest." },
      { level: "B", q: "Add a test: one item with `qty: 0` should total 0.", a: "`expect(cartTotal([{ price: 9, qty: 0 }])).toBe(0);`" },
      { level: "I", q: "Your team says “we have no time to write tests”. Give one argument.", a: "Every manual regression check and every production bug costs more time than the test. Tests make changes faster, not slower." },
      { level: "C", q: "Which layer would catch: (a) a typo in a prop name, (b) wrong discount maths, (c) checkout button hidden behind a cookie banner?", a: "(a) Static (TypeScript), (b) unit, (c) end-to-end in a real browser." }
    ],
    quiz: [
      { q: "Which layer of the testing trophy should hold the most tests?", options: ["Unit", "Integration", "End-to-end", "Manual QA"], answer: 1, why: "Integration tests exercise real components together, giving the best confidence for the cost." },
      { q: "When is a bug cheapest to fix?", options: ["In production", "During QA", "While you're writing the code"], answer: 2, why: "The context is fresh and no users are affected. Cost grows at every later stage." },
      { q: "A good test mainly checks…", options: ["Which internal functions were called", "What the user sees and can do", "That every line ran"], answer: 1, why: "Testing behaviour means tests survive refactors and catch real breakages." }
    ],
    rev: {
      sec30: "Tests catch bugs early, when they're cheapest, and let you refactor without fear. The testing trophy: static analysis at the base, some unit tests, most effort on integration tests, a few end-to-end. Test user-visible behaviour. Stack: Vitest + RTL + MSW, Playwright for e2e.",
      interview: [
        { level: "basic", q: "Why write automated tests?", a: "They catch regressions early when fixes are cheap, document expected behaviour, and let the team refactor and upgrade with confidence." },
        { level: "intermediate", q: "Testing pyramid vs testing trophy?", a: "The pyramid puts most weight on unit tests. The trophy puts most on integration tests and adds static analysis as the base, because integration tests better reflect how users use the app." },
        { level: "intermediate", q: "What makes a test valuable?", a: "It fails when the user-visible behaviour breaks and passes when you only refactor internals. Fast, deterministic, and readable." },
        { level: "advanced", q: "How do you decide what to test with limited time?", a: "Start with the money paths: login, checkout, core forms. Integration tests for those, unit tests for tricky pure logic, a few e2e smoke tests. Add a test with every bug fix." },
        { level: "tricky", q: "100% passing tests: is the app bug-free?", a: "No. Tests only prove the cases you wrote. They reduce risk; they don't prove absence of bugs." }
      ],
      cheat: [
        "Bug cost grows: editor < CI < QA < production",
        "Trophy: static → unit → **integration (most)** → e2e (few)",
        "Test behaviour users see, not implementation",
        "Vitest + React Testing Library + MSW for unit/integration",
        "Playwright for end-to-end in real browsers",
        "Every bug fix gets a test that would have caught it"
      ]
    },
    related: ["TEST-002", "TEST-003", "TEST-004", "TEST-018"]
  },

  "TEST-002": {
    tldr: "A unit test checks one small piece (a function or a tiny component) on its own. It's fast, precise, and tells you exactly which piece broke.",
    analogy: { icon: "🍳", text: "Testing a recipe ingredient by ingredient: is the milk fresh, are the eggs good? Before you judge the whole cake." },
    visual: { type: "flow", title: "Every test: Arrange → Act → Assert", steps: [
      { label: "Arrange", detail: "Set up inputs: `const cents = 1999` or `render(<PriceTag cents={450} />)`." },
      { label: "Act", detail: "Run the thing: call the function, or click the button." },
      { label: "Assert", detail: "Check the result: `expect(formatPrice(1999)).toBe('£19.99')`." },
      { label: "Pass / fail", detail: "Green tick, or a red diff showing **expected** vs **received**." }
    ]},
    points: [
      "**Unit** = smallest testable piece: a pure function, a custom hook, or a small presentational component.",
      "Pure functions (same input → same output) are the easiest things in the world to test. Move logic out of components into them.",
      "Follow **Arrange-Act-Assert** (AAA); keep one behaviour per test.",
      "For components, unit tests still go through the DOM: `render()` then `screen.getBy…()`.",
      "C# view: like an xUnit `[Fact]` with `Assert.Equal`; `expect(x).toBe(y)` is the same idea."
    ],
    code: { file: "PriceTag.test.jsx", lang: "jsx", src: `import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

export function formatPrice(cents) {
  return '£' + (cents / 100).toFixed(2);
}

function PriceTag({ cents }) {
  return <span>{formatPrice(cents)}</span>;
}

test('formatPrice turns cents into pounds', () => {
  expect(formatPrice(1999)).toBe('£19.99');
  expect(formatPrice(0)).toBe('£0.00');
});

test('PriceTag shows the formatted price', () => {
  // Arrange + Act
  render(<PriceTag cents={450} />);
  // Assert
  expect(screen.getByText('£4.50')).toBeInTheDocument();
});`, walk: [
      { lines: [4, 5], note: "A pure function: no state, no network. Perfect unit-test target. (In a real app it lives in `price.js`.)" },
      { lines: [12, 13, 14], note: "Unit test of the function: input in, `expect` the output. Includes an edge case (0)." },
      { lines: [19], note: "`render()` mounts the component into a fake DOM (jsdom)." },
      { lines: [21], note: "`screen.getByText` finds what the user sees. `toBeInTheDocument` comes from jest-dom (set up in TEST-006)." }
    ]},
    output: "✓ formatPrice turns cents into pounds\n✓ PriceTag shows the formatted price",
    mistakes: [
      { bad: `test('works', () => {\n  expect(formatPrice(1999)).toBe('£19.99');\n  expect(cartTotal([])).toBe(0);\n  render(<Checkout />);\n});`, good: `test('formatPrice turns cents into pounds', () => {\n  expect(formatPrice(1999)).toBe('£19.99');\n});`, why: "One behaviour per test with a descriptive name. When it fails, the name tells you what broke." },
      { bad: `function PriceTag({ cents }) {\n  // maths buried in JSX: hard to test alone\n  return <span>£{(cents / 100).toFixed(2)}</span>;\n}`, good: `export function formatPrice(cents) { ... }\nfunction PriceTag({ cents }) {\n  return <span>{formatPrice(cents)}</span>;\n}`, why: "Extract logic into pure functions so you can unit-test it without rendering anything." }
    ],
    practice: [
      { level: "B", q: "Write a unit test for `isFreeDelivery(total)` that returns true when `total >= 50`.", a: "Test both sides of the boundary: 49.99 → false, 50 → true.", code: `test('free delivery from £50', () => {\n  expect(isFreeDelivery(49.99)).toBe(false);\n  expect(isFreeDelivery(50)).toBe(true);\n});` },
      { level: "B", q: "Label the AAA parts in the `PriceTag` test.", a: "Arrange + Act: `render(...)`. Assert: `expect(screen.getByText(...))`." },
      { level: "I", q: "`expect([1, 2]).toBe([1, 2])` fails. Why, and what do you use?", a: "`toBe` checks identity (`Object.is`); two arrays are different objects. Use `toEqual` for deep equality." },
      { level: "C", q: "Refactor a `Recipe` component that calculates calories inline so the maths can be unit-tested.", a: "Move the calculation into `export function totalCalories(ingredients)` in its own file, test it directly, and call it from the component." }
    ],
    quiz: [
      { q: "What's the best candidate for a unit test?", options: ["The full checkout flow", "A pure `formatPrice(cents)` function", "The login page talking to the real API"], answer: 1, why: "Small, pure, no dependencies: fast and precise." },
      { q: "Which matcher compares two objects by their contents?", options: ["`toBe`", "`toEqual`", "`toBeTruthy`"], answer: 1, why: "`toBe` is identity (`===`-like); `toEqual` recursively compares values." },
      { q: "AAA stands for…", options: ["Arrange, Act, Assert", "Assert, Act, Arrange", "Async, Await, Assert"], answer: 0, why: "Set up, do the thing, check the result." }
    ],
    rev: {
      sec30: "A unit test checks one small piece in isolation: a pure function, a hook, or a small component. Structure: Arrange-Act-Assert, one behaviour per test. Extract logic into pure functions to make it trivially testable. Use `toBe` for primitives and `toEqual` for objects/arrays.",
      interview: [
        { level: "basic", q: "What is a unit test?", a: "A fast test of one small piece of code in isolation, checking its output for given inputs." },
        { level: "intermediate", q: "`toBe` vs `toEqual`?", a: "`toBe` uses `Object.is` (same reference or same primitive). `toEqual` deep-compares contents, so use it for objects and arrays." },
        { level: "intermediate", q: "How do you make component logic easier to unit test?", a: "Pull calculations and formatting into pure functions or custom hooks, keep the component thin, and test the pure parts directly." },
        { level: "advanced", q: "When are unit tests not enough?", a: "When bugs live in the wiring between pieces: props passed wrongly, context missing, state lifted incorrectly. That's what integration tests catch." },
        { level: "tricky", q: "Should you mock every child component in a unit test of a parent?", a: "Usually not. Heavy mocking tests your mocks, not your app, and breaks on refactors. Mock only slow or external things like the network." }
      ],
      predict: [
        { code: `expect({ qty: 1 }).toBe({ qty: 1 });`, answer: "Fails", why: "Two different object references. `toEqual` would pass." }
      ],
      cheat: [
        "Unit = one function / hook / small component, in isolation",
        "Arrange → Act → Assert",
        "One behaviour per test, named in plain English",
        "`toBe` = identity; `toEqual` = deep contents",
        "Extract logic into pure functions to test it easily",
        "Test boundaries: 0, empty, max, just below / above"
      ]
    },
    related: ["TEST-001", "TEST-003", "TEST-006", "TEST-009"]
  },

  "TEST-003": {
    tldr: "An integration test renders several real components together and checks they cooperate: click a product, and the cart badge updates. It catches bugs in the wiring that unit tests miss.",
    analogy: { icon: "🍰", text: "Each ingredient tasted fine, but did the cake rise? Integration tests bake the whole cake and taste a slice." },
    visual: { type: "tree", title: "One test renders the whole Shop", root: { label: "Shop (real state)", note: "render(<Shop />)", children: [
      { label: "ProductCard: Tea", note: "user clicks Add" },
      { label: "ProductCard: Cake", note: "user clicks Add" },
      { label: "CartBadge", note: "assert: Cart: 2" }
    ]}},
    points: [
      "Render a **real slice** of the app: parent + children + real state + real context. Don't mock your own components.",
      "Mock only the **edges**: the network (MSW, TEST-013), time, or browser APIs jsdom lacks.",
      "Drive it like a user with **user-event**, assert on what's visible.",
      "This is the **widest layer of the testing trophy**: best confidence per test.",
      "C# view: like `WebApplicationFactory` tests: the real pipeline, fake outside services."
    ],
    code: { file: "Shop.test.jsx", lang: "jsx", src: `import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';

function ProductCard({ name, onAdd }) {
  return <button onClick={() => onAdd(name)}>Add {name}</button>;
}

function CartBadge({ items }) {
  return <p>Cart: {items.length}</p>;
}

function Shop() {
  const [items, setItems] = useState([]);
  const add = (name) => setItems((prev) => [...prev, name]);
  return (
    <>
      <ProductCard name="Tea" onAdd={add} />
      <ProductCard name="Cake" onAdd={add} />
      <CartBadge items={items} />
    </>
  );
}

test('adding products updates the cart badge', async () => {
  const user = userEvent.setup();
  render(<Shop />);

  await user.click(screen.getByRole('button', { name: 'Add Tea' }));
  await user.click(screen.getByRole('button', { name: 'Add Cake' }));

  expect(screen.getByText('Cart: 2')).toBeInTheDocument();
});`, walk: [
      { lines: [14, 15, 16], note: "The parent owns real state and passes a callback down: exactly the wiring we want to prove works." },
      { lines: [28], note: "Render the **parent**, so children, props and state all run for real." },
      { lines: [30, 31], note: "Click like a user: `ProductCard` calls `onAdd`, `Shop` updates state, `CartBadge` re-renders." },
      { lines: [33], note: "One assertion on the visible result proves all three components cooperate." }
    ]},
    output: "✓ adding products updates the cart badge",
    mistakes: [
      { bad: `vi.mock('./CartBadge', () => ({ CartBadge: () => null }));\nrender(<Shop />);\nexpect(addSpy).toHaveBeenCalled();`, good: `render(<Shop />);\nawait user.click(screen.getByRole('button', { name: 'Add Tea' }));\nexpect(screen.getByText('Cart: 1')).toBeInTheDocument();`, why: "Mocking your own children hides wiring bugs. Render them for real and check the visible outcome." },
      { bad: `// integration test that calls the real production API`, good: `// MSW returns fake JSON at the network layer (TEST-013)`, why: "Real network calls make tests slow, flaky and dependent on someone else's server. Fake the edge, keep the inside real." }
    ],
    practice: [
      { level: "B", q: "Extend the test: click **Add Tea** three times and expect “Cart: 3”.", a: "Three `await user.click(...)` calls, then `getByText('Cart: 3')`." },
      { level: "I", q: "Add a **Clear cart** button to `Shop`. Write the integration test.", a: "Add two items, click Clear, assert “Cart: 0”.", code: `await user.click(screen.getByRole('button', { name: 'Add Tea' }));\nawait user.click(screen.getByRole('button', { name: 'Clear cart' }));\nexpect(screen.getByText('Cart: 0')).toBeInTheDocument();` },
      { level: "I", q: "`Shop` reads a `CartContext`. What must the test do?", a: "Render inside the real `CartProvider` (ideally via a custom render helper, TEST-008)." },
      { level: "C", q: "Products now load from `/api/products`. Keep this an integration test without a real server.", a: "Use MSW to return fake products, then `await screen.findByRole('button', { name: 'Add Tea' })` before clicking." }
    ],
    quiz: [
      { q: "In an integration test of `Shop`, what should you mock?", options: ["`ProductCard` and `CartBadge`", "`useState`", "Only the network / outside services"], answer: 2, why: "Keep your components real; replace only slow or external edges." },
      { q: "What does an integration test catch that unit tests miss?", options: ["Typos in variable names", "Wrong props or callbacks between components", "Slow CSS"], answer: 1, why: "Each piece can work alone but be wired together wrongly." },
      { q: "Where do integration tests sit in the testing trophy?", options: ["The thin tip", "The widest middle", "The base"], answer: 1, why: "They're the best confidence-to-cost trade-off." }
    ],
    rev: {
      sec30: "Integration tests render several real components together (parent, children, state, context) and drive them like a user. Only external edges like the network are mocked (MSW). They catch wiring bugs, give the most confidence per test, and form the widest part of the testing trophy.",
      interview: [
        { level: "basic", q: "Unit vs integration test?", a: "A unit test checks one piece alone; an integration test checks several pieces working together, like a form plus its list plus shared state." },
        { level: "intermediate", q: "What do you mock in an integration test?", a: "Only things outside your app or that jsdom can't do: HTTP via MSW, timers, maybe `matchMedia`. Your own components and hooks stay real." },
        { level: "advanced", q: "Why does the testing trophy favour integration tests?", a: "They resemble real usage, survive refactors because they ignore internals, and run nearly as fast as unit tests in jsdom." },
        { level: "tricky", q: "Is a test that renders `<App />` always an integration test?", a: "It's integration if outside services are faked. If it hits a real backend in a real browser, it's end-to-end." }
      ],
      compare: { cols: ["", "Unit", "Integration"], rows: [
        ["Scope", "One function/component", "Several components + state"],
        ["Mocks", "Collaborators maybe", "Only network/time"],
        ["Catches", "Logic bugs", "Wiring bugs"],
        ["Speed", "Fastest", "Fast (jsdom)"]
      ]},
      cheat: [
        "Integration = several real components together",
        "Render the parent; keep children, state, context real",
        "Mock only the edges: network (MSW), time",
        "Drive with user-event, assert visible text",
        "Widest layer of the testing trophy",
        "Catches wrong props, callbacks, lifted state"
      ]
    },
    related: ["TEST-002", "TEST-011", "TEST-013", "COMM-005"]
  },

  "TEST-004": {
    tldr: "An end-to-end (e2e) test starts your real app, opens a real browser and clicks through a full journey like a customer would: browse, add to cart, check out.",
    analogy: { icon: "🕵️", text: "A mystery shopper. They walk into the real shop, pick items, pay at the till and report whether the whole experience worked." },
    visual: { type: "flow", title: "What an e2e test does", steps: [
      { label: "Start the app", detail: "Test runner boots `npm run dev` (or a build) on a real port." },
      { label: "Open a real browser", detail: "Chromium, Firefox or WebKit, driven by Playwright." },
      { label: "Act like a user", detail: "Goto `/`, click **Add Tea**, fill **Email**, press **Place order**." },
      { label: "Real everything", detail: "Real routing, CSS, network and (often) a test backend + database." },
      { label: "Assert the outcome", detail: "“Thanks for your order!” is visible. Screenshot + trace if it fails." }
    ]},
    points: [
      "E2E proves the **whole system** works: frontend, routing, API, auth, CSS that hides a button.",
      "They're **slow and costlier** to maintain, so keep a few for **critical journeys** (sign-up, login, checkout).",
      "Tool: **Playwright** (TEST-015). Cypress is common in existing codebases (TEST-016).",
      "Use the same user-facing locators as RTL: `getByRole`, `getByLabel`, `getByText`.",
      "Run them in **CI** against a fresh environment; flaky e2e tests are worse than none."
    ],
    code: { file: "e2e/checkout.spec.js", lang: "js", src: `import { test, expect } from '@playwright/test';

test('shopper can add tea and check out', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Add Tea' }).click();
  await page.getByRole('link', { name: 'Cart (1)' }).click();
  await expect(page).toHaveURL(/\\/cart$/);

  await page.getByLabel('Email').fill('sam@example.com');
  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByRole('heading', { name: 'Thanks for your order!' })).toBeVisible();
});`, walk: [
      { lines: [3], note: "Playwright gives each test a fresh browser `page` (clean cookies and storage)." },
      { lines: [4], note: "Opens the real app. `/` resolves against `baseURL` from the config." },
      { lines: [6, 7, 8], note: "Real clicks, real React Router navigation; `toHaveURL` checks the address bar." },
      { lines: [13], note: "Web-first assertion: retries automatically until the heading appears or times out." }
    ]},
    output: "Running 1 test using 1 worker\n✓ [chromium] › checkout.spec.js › shopper can add tea and check out (2.1s)",
    mistakes: [
      { bad: `// 400 e2e tests covering every validation message`, good: `// 5-15 e2e tests for money paths\n// validation details tested with RTL (fast)`, why: "E2E tests are slow and brittle. Cover edge cases in integration tests; keep e2e for the journeys that must never break." },
      { bad: `await page.waitForTimeout(3000);\nexpect(await page.textContent('h1')).toBe('Thanks');`, good: `await expect(page.getByRole('heading', { name: 'Thanks for your order!' })).toBeVisible();`, why: "Fixed sleeps are slow and still flaky. Web-first assertions wait exactly as long as needed." }
    ],
    practice: [
      { level: "B", q: "List three journeys in a notes app that deserve an e2e test.", a: "Sign up/log in, create and save a note, search and open an existing note." },
      { level: "I", q: "Write an e2e step that checks the cart link shows “Cart (2)” after two adds.", a: "Use a web-first assertion.", code: `await expect(page.getByRole('link', { name: 'Cart (2)' })).toBeVisible();` },
      { level: "I", q: "Why not test every form validation rule end-to-end?", a: "Slow, and each extra test is maintenance. RTL integration tests check validation in milliseconds." },
      { level: "C", q: "Your e2e test passes locally but fails 1 in 10 runs in CI. Name two likely causes.", a: "Shared test data between runs, fixed sleeps/timing assumptions, or depending on an unstable third-party service." }
    ],
    quiz: [
      { q: "What makes a test end-to-end?", options: ["It uses `render()`", "It runs the real app in a real browser through a full journey", "It has more than 10 assertions"], answer: 1, why: "E2E = whole system, real browser, user's point of view." },
      { q: "How many e2e tests should a typical app have compared to integration tests?", options: ["Far more", "About the same", "Far fewer"], answer: 2, why: "They're the narrow top of the trophy: high confidence, high cost." },
      { q: "Best way to wait for the success heading?", options: ["`page.waitForTimeout(5000)`", "`await expect(locator).toBeVisible()`", "A `while` loop"], answer: 1, why: "Web-first assertions retry until the condition is true." }
    ],
    rev: {
      sec30: "E2E tests run the real app in a real browser and walk a full user journey (login, checkout). They give the highest confidence but are slowest and most fragile, so keep a small set for critical paths and run them in CI. Use Playwright with role/label locators and web-first assertions, never fixed sleeps.",
      interview: [
        { level: "basic", q: "What is an end-to-end test?", a: "A test that drives the real, running application in a browser through a complete user flow, checking the result as a user would." },
        { level: "intermediate", q: "Why not write everything as e2e tests?", a: "They're slow, need a running environment and break more often. Integration tests cover most cases far cheaper." },
        { level: "intermediate", q: "Which flows would you cover with e2e?", a: "Revenue- and access-critical ones: sign-up, login, checkout/payment, plus a smoke test that the app loads." },
        { level: "advanced", q: "How do you keep e2e tests reliable?", a: "Isolated test data per run, auto-waiting locators and assertions instead of sleeps, retries with traces in CI, and stubbing truly external services like payment providers." },
        { level: "tricky", q: "E2E tests are green but users report a broken checkout on Safari. How?", a: "Tests probably only ran on Chromium. Add WebKit (and mobile) projects to the Playwright config." }
      ],
      compare: { cols: ["", "Integration (RTL)", "E2E (Playwright)"], rows: [
        ["Runs in", "jsdom in Node", "Real browser"],
        ["Backend", "Mocked (MSW)", "Real or test server"],
        ["Speed", "Milliseconds", "Seconds"],
        ["Count", "Many", "Few, critical paths"]
      ]},
      cheat: [
        "E2E = real app + real browser + full journey",
        "Few tests, critical paths only (login, checkout)",
        "Playwright: `page.getByRole(...)`, `await expect(...).toBeVisible()`",
        "Never `waitForTimeout`; use auto-waiting assertions",
        "Run in CI on Chromium, Firefox and WebKit",
        "Fresh, isolated test data for every run"
      ]
    },
    related: ["TEST-015", "TEST-016", "TEST-003", "PROD-010"]
  },

  "TEST-005": {
    tldr: "Jest is the test runner most older React projects use (often from Create React App, now deprecated). Vitest copied its API, so if you can read Jest you can read Vitest: swap `jest.` for `vi.`.",
    analogy: { icon: "📖", text: "An old family cookbook. New cookbooks use the same measurements and steps, so once you can read one, you can cook from both." },
    visual: { type: "compare", title: "Same test, two runners", left: { label: "Jest", tone: "neutral", points: [
      "`describe`, `test`, `expect` are globals",
      "`jest.fn()`, `jest.mock()`, `jest.spyOn()`",
      "Needs Babel/ts-jest to transform JSX",
      "`testEnvironment: 'jsdom'` + `jest-environment-jsdom`",
      "Common in existing codebases"
    ]}, right: { label: "Vitest", tone: "good", points: [
      "Same API; globals optional (`globals: true`)",
      "`vi.fn()`, `vi.mock()`, `vi.spyOn()`",
      "Reuses your Vite config: JSX/TS just work",
      "`environment: 'jsdom'` in `vite.config.js`",
      "Default choice for new Vite projects"
    ]}},
    points: [
      "**Maintain, don't rewrite**: an existing Jest suite still works; migrate only when the tooling pain is real.",
      "Mocks: `jest.fn()` creates a fake function; `jest.mock('./module')` replaces a whole module (calls are **hoisted** to the top).",
      "Async: `mockResolvedValue(x)`, `await expect(promise).resolves.toBe(x)`.",
      "Reset between tests: `jest.clearAllMocks()` (calls) / `jest.resetAllMocks()` (calls + implementations).",
      "React Testing Library and jest-dom work the same under Jest and Vitest."
    ],
    code: { file: "weatherMessage.test.js", lang: "js", src: `// Jest: describe/test/expect/jest are globals, no import needed
import { getForecast } from './weatherApi';
import { weatherMessage } from './weatherMessage';

jest.mock('./weatherApi'); // every export becomes a jest.fn()

describe('weatherMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('suggests an umbrella when rain is coming', async () => {
    getForecast.mockResolvedValue({ rainChance: 80 });

    await expect(weatherMessage('London')).resolves.toBe('Take an umbrella ☔');
    expect(getForecast).toHaveBeenCalledWith('London');
  });

  test('says sunny otherwise', async () => {
    getForecast.mockResolvedValue({ rainChance: 5 });
    expect(await weatherMessage('Rome')).toBe('Enjoy the sun ☀️');
  });
});`, walk: [
      { lines: [5], note: "Auto-mock the API module. Jest hoists this above the imports, so `getForecast` is already fake." },
      { lines: [8, 9], note: "Wipe recorded calls before each test so tests don't leak into each other." },
      { lines: [13], note: "Tell the fake what to return: a promise resolving to `{ rainChance: 80 }`." },
      { lines: [15, 16], note: "Check the result **and** that the dependency was called with the right city." },
      { lines: [21], note: "Plain `await` works too; `.resolves` is just another style you'll see." }
    ]},
    output: "PASS  src/weatherMessage.test.js\n  weatherMessage\n    ✓ suggests an umbrella when rain is coming\n    ✓ says sunny otherwise",
    mistakes: [
      { bad: `test('loads', () => {\n  expect(weatherMessage('Oslo')).resolves.toBe('Enjoy the sun ☀️');\n});`, good: `test('loads', async () => {\n  await expect(weatherMessage('Oslo')).resolves.toBe('Enjoy the sun ☀️');\n});`, why: "Without `await` (or `return`) the test finishes before the promise settles and passes even when it's wrong." },
      { bad: `// jest.config.js\nexport default { testEnvironment: 'jsdom' };\n// Error: jest-environment-jsdom cannot be found`, good: `// npm i -D jest-environment-jsdom\nexport default { testEnvironment: 'jsdom' };`, why: "Since Jest 28 the jsdom environment is a separate package you must install." }
    ],
    practice: [
      { level: "B", q: "Translate to Vitest: `const onSave = jest.fn();`", a: "`import { vi } from 'vitest'; const onSave = vi.fn();`" },
      { level: "I", q: "Make `getForecast` reject with an error in one test.", a: "`getForecast.mockRejectedValue(new Error('offline'));` then assert the fallback message." },
      { level: "I", q: "Spy on `console.error` without silencing other tests.", a: "Create the spy in the test and restore it.", code: `const spy = jest.spyOn(console, 'error').mockImplementation(() => {});\n// ...\nspy.mockRestore();` },
      { level: "C", q: "Outline migrating a small Jest suite to Vitest.", a: "Install vitest + jsdom, add `test: { environment: 'jsdom', globals: true }`, replace `jest.` with `vi.`, fix any `jest.requireActual` → `await vi.importActual`, delete Babel config if unused." }
    ],
    quiz: [
      { q: "What does `jest.mock('./weatherApi')` do?", options: ["Deletes the file", "Replaces every export with a mock function", "Runs the real module twice"], answer: 1, why: "Automock: each export becomes a `jest.fn()` you can configure." },
      { q: "Vitest equivalent of `jest.fn()`?", options: ["`vi.fn()`", "`vitest.mock()`", "`test.fn()`"], answer: 0, why: "Vitest mirrors Jest's API under the `vi` object." },
      { q: "An async test without `await` or `return`…", options: ["Always fails", "Can pass even when the assertion is wrong", "Waits automatically"], answer: 1, why: "The test ends before the promise settles." }
    ],
    rev: {
      sec30: "Jest is the classic React test runner with globals `describe/test/expect` and mocks via `jest.fn`, `jest.mock` (hoisted) and `jest.spyOn`. Vitest copied the API (`vi.*`) and reuses Vite config, so it's the default for new Vite apps, but Jest suites in existing codebases are fine to maintain. RTL works with both.",
      interview: [
        { level: "basic", q: "`jest.fn()` vs `jest.spyOn()`?", a: "`jest.fn()` creates a brand-new fake function. `jest.spyOn(obj, 'method')` wraps an existing method so you can watch or replace it and later restore the original." },
        { level: "intermediate", q: "Why is `jest.mock` placed at the top even if written lower?", a: "Babel's jest-hoist plugin moves it above imports so the module is mocked before anything imports it. `vi.mock` is hoisted the same way." },
        { level: "intermediate", q: "Jest vs Vitest for a new Vite project?", a: "Vitest: it shares Vite's transform pipeline (JSX, TS, ESM, aliases) with no Babel setup, and it's fast. The API is nearly identical." },
        { level: "advanced", q: "`clearAllMocks` vs `resetAllMocks` vs `restoreAllMocks`?", a: "Clear wipes recorded calls. Reset also removes fake implementations. Restore additionally puts back original methods replaced by `spyOn`." },
        { level: "tricky", q: "Would you migrate a large, green Jest suite to Vitest?", a: "Only with a reason (slow runs, ESM/config pain). Otherwise maintain it; rewriting working tests adds risk without user value." }
      ],
      compare: { cols: ["", "Jest", "Vitest"], rows: [
        ["Mock fn", "`jest.fn()`", "`vi.fn()`"],
        ["Mock module", "`jest.mock()`", "`vi.mock()`"],
        ["Real module", "`jest.requireActual()`", "`await vi.importActual()`"],
        ["Fake timers", "`jest.useFakeTimers()`", "`vi.useFakeTimers()`"]
      ]},
      cheat: [
        "Jest globals: `describe`, `test`/`it`, `expect`, `jest`",
        "`jest.fn()` new fake · `jest.spyOn()` wrap existing",
        "`jest.mock()` is hoisted above imports",
        "`mockResolvedValue` / `mockRejectedValue` for async",
        "jsdom needs `jest-environment-jsdom` (Jest 28+)",
        "Vitest = same API with `vi.` instead of `jest.`"
      ]
    },
    related: ["TEST-006", "TEST-002", "TEST-013"]
  },

  "TEST-006": {
    tldr: "Vitest is a test runner built on Vite: it reuses your `vite.config.js`, so JSX and imports just work. Add `jsdom` for a fake browser DOM and jest-dom for handy matchers.",
    analogy: { icon: "🧪", text: "A test kitchen next to the real kitchen. Same ovens and ingredients (your Vite config), but nobody's eating, so you can try everything safely." },
    visual: { type: "flow", title: "From zero to `npm test`", steps: [
      { label: "Install", detail: "`npm i -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event`" },
      { label: "Configure", detail: "Add a `test` block to `vite.config.js`: `environment: 'jsdom'`, `setupFiles`." },
      { label: "Setup file", detail: "`src/setupTests.js`: `import '@testing-library/jest-dom/vitest'`." },
      { label: "Script", detail: "`\"test\": \"vitest\"` in package.json (watch mode); `vitest run` for CI." },
      { label: "Write *.test.jsx", detail: "Vitest finds `*.test.*` / `*.spec.*` files and re-runs them on save." }
    ]},
    points: [
      "**jsdom** = a fake browser DOM in Node. Without it, `document` is undefined and `render()` fails.",
      "`globals: true` lets you skip `import { test } from 'vitest'` **and** enables RTL's auto-cleanup between tests.",
      "`setupFiles` runs before every test file: perfect for jest-dom matchers and MSW server setup.",
      "`vitest` = watch mode (dev). `vitest run` = run once and exit (CI).",
      "**Create React App + Jest is deprecated**; Vite + Vitest is the modern default."
    ],
    code: { file: "vite.config.js", lang: "js", src: `// npm i -D vitest jsdom @testing-library/react @testing-library/dom
//          @testing-library/jest-dom @testing-library/user-event
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',              // fake browser DOM
    globals: true,                     // test/expect without imports + auto cleanup
    setupFiles: './src/setupTests.js', // runs before each test file
  },
});

// src/setupTests.js
//   import '@testing-library/jest-dom/vitest';
// package.json
//   "test": "vitest", "test:run": "vitest run"`, walk: [
      { lines: [1, 2], note: "Dev dependencies only: tests never ship to users." },
      { lines: [3], note: "`defineConfig` from `vitest/config` adds types for the `test` block. Same file as your Vite config." },
      { lines: [9], note: "Run tests in jsdom so components have a `document` to render into." },
      { lines: [10, 11], note: "Globals + a setup file. The setup file loads jest-dom matchers like `toBeInTheDocument`." },
      { lines: [15, 16, 17, 18], note: "The two tiny extra pieces: one setup import, two npm scripts." }
    ]},
    output: " DEV  v4.x  /my-shop\n ✓ src/PriceTag.test.jsx (2 tests) 12ms\n Test Files  1 passed (1)\n      Tests  2 passed (2)\n Watching for file changes...",
    mistakes: [
      { bad: `test: { globals: false }\n// no afterEach(cleanup)\n// Error: Found multiple elements with the text: Add`, good: `test: { globals: true }\n// or: import { cleanup } from '@testing-library/react';\n//     afterEach(cleanup);`, why: "RTL auto-cleans only when a global `afterEach` exists. Otherwise earlier tests' DOM stays and queries find duplicates." },
      { bad: `expect(screen.getByText('Tea')).toBeInTheDocument();\n// TypeError: toBeInTheDocument is not a function`, good: `// src/setupTests.js\nimport '@testing-library/jest-dom/vitest';`, why: "jest-dom matchers must be registered in the setup file referenced by `setupFiles`." }
    ],
    practice: [
      { level: "B", q: "Which npm script would you run in CI, `vitest` or `vitest run`?", a: "`vitest run`: it runs once and exits with a pass/fail code. Plain `vitest` watches forever." },
      { level: "B", q: "Run only tests whose name contains “cart”.", a: "`npx vitest -t cart` (or press `t` in watch mode and type a pattern)." },
      { level: "I", q: "Your component imports `./Shop.module.css`. Does the test crash?", a: "No. Vitest uses Vite's pipeline, so CSS and CSS modules are handled; class names resolve." },
      { level: "C", q: "Add the MSW server to the setup file so every test file gets it.", a: "Start, reset and close it in global hooks.", code: `import '@testing-library/jest-dom/vitest';\nimport { server } from './mocks/server';\nbeforeAll(() => server.listen({ onUnhandledRequest: 'error' }));\nafterEach(() => server.resetHandlers());\nafterAll(() => server.close());` }
    ],
    quiz: [
      { q: "Why add `environment: 'jsdom'`?", options: ["To make tests faster", "So `document` and the DOM exist in Node", "To run in Chrome"], answer: 1, why: "jsdom simulates a browser DOM in Node so components can render." },
      { q: "Where do you register jest-dom matchers?", options: ["In every test file", "In the `setupFiles` file", "In `main.jsx`"], answer: 1, why: "The setup file runs before each test file, so matchers are always available." },
      { q: "Biggest reason to choose Vitest for a Vite app?", options: ["It reuses the same Vite config and transforms", "It runs tests in a real browser by default", "It has no `expect`"], answer: 0, why: "JSX, aliases and CSS behave in tests exactly as in the app." }
    ],
    rev: {
      sec30: "Vitest is Vite-native: tests reuse `vite.config.js`. Install vitest, jsdom and the Testing Library packages; set `test.environment: 'jsdom'`, `globals: true` and a `setupFiles` that imports `@testing-library/jest-dom/vitest`. `vitest` watches; `vitest run` is for CI. Its API mirrors Jest (`vi.fn`, `vi.mock`).",
      interview: [
        { level: "basic", q: "What is jsdom and why do React tests need it?", a: "A JavaScript implementation of the browser DOM that runs in Node. Component tests render into it, so it must be the test environment." },
        { level: "intermediate", q: "What goes in a Vitest setup file?", a: "Global test setup: jest-dom matchers, MSW server lifecycle, polyfills like `matchMedia`, and any global cleanup." },
        { level: "intermediate", q: "What does `globals: true` change?", a: "`describe`, `test`, `expect`, `vi` become globals, and RTL can auto-register `afterEach(cleanup)`." },
        { level: "advanced", q: "jsdom vs happy-dom vs Vitest browser mode?", a: "jsdom is the most complete fake DOM; happy-dom is faster but less complete; browser mode runs tests in a real browser via Playwright for layout-accurate results." },
        { level: "tricky", q: "Tests pass locally in watch mode but CI hangs. Why?", a: "CI is running `vitest` (watch mode) instead of `vitest run`. Most CIs set `CI=true`, which Vitest detects, but use `vitest run` explicitly." }
      ],
      cheat: [
        "`npm i -D vitest jsdom @testing-library/react @testing-library/dom`",
        "`test: { environment: 'jsdom', globals: true, setupFiles }`",
        "Setup: `import '@testing-library/jest-dom/vitest'`",
        "`vitest` = watch · `vitest run` = once (CI)",
        "Files: `*.test.jsx` / `*.spec.jsx`",
        "API mirrors Jest: `vi.fn`, `vi.mock`, `vi.spyOn`"
      ]
    },
    related: ["ENV-003", "ENV-008", "TEST-005", "TEST-007"]
  },

  "TEST-007": {
    tldr: "React Testing Library (RTL) renders a component and lets you find things the way a user does: by role, label and visible text. If a test can't find a button by its name, a screen reader user can't either.",
    analogy: { icon: "🙋", text: "Asking a friend to try your shop app: “click the **Add to cart** button”. They don't know your CSS class names, they just look for the button that says it." },
    visual: { type: "layers", title: "Query priority (use the top one that works)", items: [
      { label: "getByRole", detail: "Buttons, links, headings, textboxes by accessible name. Your default." },
      { label: "getByLabelText", detail: "Form fields by their `<label>`." },
      { label: "getByPlaceholderText", detail: "Only if there's no label (there should be)." },
      { label: "getByText", detail: "Non-interactive text: paragraphs, messages." },
      { label: "getByAltText / getByTitle", detail: "Images by `alt`, elements by `title`." },
      { label: "getByTestId", detail: "Last resort: `data-testid`. Users can't see it." }
    ]},
    points: [
      "Three prefixes: **getBy** (must exist now, throws), **queryBy** (returns `null`, for “not there”), **findBy** (async, waits).",
      "`getAllBy…` / `queryAllBy…` / `findAllBy…` return arrays for lists.",
      "Use `screen.getBy…` instead of destructuring from `render()`; it's always the whole document.",
      "Role + name: `getByRole('button', { name: /save/i })`. Regex = case-insensitive, partial match.",
      "Testing by role nudges you to write **accessible** HTML: real `<button>`s and `<label>`s."
    ],
    code: { file: "NoteEditor.test.jsx", lang: "jsx", src: `import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';

function NoteEditor() {
  return (
    <form>
      <h2>New note</h2>
      <label htmlFor="title">Title</label>
      <input id="title" />
      <button type="submit">Save note</button>
      <img src="/pin.png" alt="Pinned" />
    </form>
  );
}

test('finds things the way a user would', () => {
  render(<NoteEditor />);

  expect(screen.getByRole('heading', { name: 'New note' })).toBeInTheDocument();
  expect(screen.getByLabelText('Title')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
  expect(screen.getByAltText('Pinned')).toBeInTheDocument();
  expect(screen.queryByText('Delete')).not.toBeInTheDocument();
});`, walk: [
      { lines: [8, 9], note: "A real `<label>` linked by `htmlFor` gives the input its accessible name “Title”." },
      { lines: [19], note: "`<h2>` has role `heading`. Find it by role + its visible name." },
      { lines: [20, 21], note: "Two ways to the same input: by label text, or by role `textbox` + name." },
      { lines: [22], note: "Regex `/save/i` matches “Save note” ignoring case. `toBeEnabled` is a jest-dom matcher." },
      { lines: [24], note: "`queryBy` returns `null` instead of throwing: the right tool to assert something is **absent**." }
    ]},
    output: "✓ finds things the way a user would",
    mistakes: [
      { bad: `const { container } = render(<NoteEditor />);\ncontainer.querySelector('.btn-primary').click();`, good: `render(<NoteEditor />);\nawait user.click(screen.getByRole('button', { name: 'Save note' }));`, why: "CSS classes are implementation details that change in refactors. Users find buttons by their text." },
      { bad: `expect(screen.getByText('Delete')).not.toBeInTheDocument();`, good: `expect(screen.queryByText('Delete')).not.toBeInTheDocument();`, why: "`getBy` throws when nothing matches, so the test errors before `not` runs. Use `queryBy` for absence." }
    ],
    practice: [
      { level: "B", q: "Find a link that says “View recipe”.", a: "`screen.getByRole('link', { name: 'View recipe' })`" },
      { level: "B", q: "Get all `<li>` items in a playlist.", a: "`screen.getAllByRole('listitem')` returns an array." },
      { level: "I", q: "An icon-only button `<button><TrashIcon /></button>` can't be found by role + name. Fix the component.", a: "Give it an accessible name: `<button aria-label=\"Delete note\">`. Then `getByRole('button', { name: 'Delete note' })`." },
      { level: "C", q: "Two “Add” buttons (Tea and Cake cards). Click the one inside the Cake card.", a: "Scope with `within`.", code: `import { within } from '@testing-library/react';\nconst card = screen.getByRole('article', { name: 'Cake' });\nawait user.click(within(card).getByRole('button', { name: 'Add' }));` }
    ],
    quiz: [
      { q: "Which query should you reach for first?", options: ["`getByTestId`", "`getByRole`", "`container.querySelector`"], answer: 1, why: "Role queries reflect how users and assistive tech see the page." },
      { q: "To assert a “Sold out” label is NOT shown, use…", options: ["`getByText`", "`queryByText`", "`findByText`"], answer: 1, why: "`queryBy` returns `null` when missing; `getBy` throws." },
      { q: "`findByText` is different because it…", options: ["Returns a promise and retries until found", "Searches hidden elements", "Returns an array"], answer: 0, why: "`findBy` = `getBy` + waiting, for things that appear asynchronously." }
    ],
    rev: {
      sec30: "RTL renders components into jsdom and queries them like a user: `getByRole` first (with `name`), then label, placeholder, text, alt/title, and `getByTestId` last. `getBy` throws if missing, `queryBy` returns null (assert absence), `findBy` is async and waits. Use `screen` and `within` for scoping.",
      interview: [
        { level: "basic", q: "What's RTL's guiding principle?", a: "“The more your tests resemble the way your software is used, the more confidence they give you.” Query and interact like a user, not via internals." },
        { level: "intermediate", q: "`getBy` vs `queryBy` vs `findBy`?", a: "`getBy` returns the element or throws. `queryBy` returns null if missing, for absence checks. `findBy` returns a promise that retries until the element appears or times out." },
        { level: "intermediate", q: "Why prefer `getByRole` over `getByTestId`?", a: "Role queries test what users perceive and enforce accessibility; test IDs are invisible to users and pass even when the button text or role is broken." },
        { level: "advanced", q: "How does RTL compute a button's “name”?", a: "The accessible name: from its text content, `aria-label`, `aria-labelledby`, or for inputs the associated `<label>`. Same algorithm screen readers use." },
        { level: "tricky", q: "`getByRole('button', { name: 'Save' })` fails for “Save note”. Why?", a: "A string name must match the full accessible name exactly. Use `'Save note'` or a regex like `/save/i`." }
      ],
      compare: { cols: ["", "Missing", "Many matches", "Async"], rows: [
        ["`getBy`", "Throws", "Throws", "No"],
        ["`queryBy`", "`null`", "Throws", "No"],
        ["`findBy`", "Rejects", "Rejects", "Yes, retries"],
        ["`getAllBy`", "Throws", "Array", "No"]
      ]},
      cheat: [
        "Priority: Role > LabelText > Placeholder > Text > Alt/Title > TestId",
        "`getByRole('button', { name: /save/i })`",
        "`getBy` throws · `queryBy` null · `findBy` async",
        "Absence: `expect(queryBy…()).not.toBeInTheDocument()`",
        "Use `screen`; scope with `within(el)`",
        "Can't find it by role? The UI is probably not accessible"
      ]
    },
    related: ["TEST-011", "TEST-014", "PROD-016", "TEST-008"]
  },

  "TEST-008": {
    tldr: "Components that use context, routing or TanStack Query crash if rendered alone. Write one `renderWithProviders()` helper that wraps them in the same providers as the real app.",
    analogy: { icon: "🎁", text: "A gift that needs batteries. Test it out of the box and nothing happens. Your helper always pops the batteries in (providers) before you press the button." },
    visual: { type: "tree", title: "What `renderWithProviders` builds", root: { label: "QueryClientProvider", note: "fresh client, retry: false", children: [
      { label: "CartProvider", note: "real context", children: [
        { label: "MemoryRouter", note: "initialEntries: ['/products/42']", children: [
          { label: "Routes", children: [
            { label: "<ProductPage />", note: "the component under test" }
          ]}
        ]}
      ]}
    ]}},
    points: [
      "Missing provider = error like “useNavigate() may be used only in the context of a <Router>”.",
      "Use **MemoryRouter** (from `react-router`) in tests: the URL lives in memory, set with `initialEntries`.",
      "Need `useParams`? Render a `<Routes><Route path=\"/products/:id\" …/></Routes>` inside the router.",
      "Create a **new QueryClient per test** with `retry: false`, so cache and retries never leak between tests.",
      "Pass the wrapper via `render(ui, { wrapper })`; it also applies on `rerender`."
    ],
    code: { file: "src/test-utils.jsx", lang: "jsx", src: `import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './cart/CartContext';

export function renderWithProviders(ui, { route = '/', path = '*' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}

// In a test:
// renderWithProviders(<ProductPage />, {
//   route: '/products/42',
//   path: '/products/:id',
// });`, walk: [
      { lines: [2], note: "React Router 7: everything, including `MemoryRouter`, comes from `react-router`." },
      { lines: [7, 8, 9], note: "A fresh QueryClient **per call**: no shared cache; `retry: false` makes error tests fail fast." },
      { lines: [15], note: "In-memory URL. `initialEntries` sets the page the test starts on." },
      { lines: [16, 17, 18], note: "A matching route so `useParams()` returns `{ id: '42' }` inside the component." },
      { lines: [25], note: "RTL wraps `ui` with `Wrapper`, so tests stay one-liners." }
    ]},
    mistakes: [
      { bad: `render(<ProductPage />);\n// Error: useNavigate() may be used only in the context of a <Router> component.`, good: `renderWithProviders(<ProductPage />, {\n  route: '/products/42', path: '/products/:id',\n});`, why: "`useNavigate`/`useLocation` need a router (`useParams` just returns `{}`); `useQuery` needs a QueryClientProvider; context hooks need their provider." },
      { bad: `const queryClient = new QueryClient(); // module level, shared\n// test 2 sees test 1's cached data`, good: `function renderWithProviders(ui) {\n  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });\n  ...\n}`, why: "A shared client leaks cached data between tests; default retries make failing requests take seconds." },
      { bad: `<BrowserRouter>\n  <ProductPage />\n</BrowserRouter>\n// can't choose the starting URL; jsdom URL leaks between tests`, good: `<MemoryRouter initialEntries={['/products/42']}>\n  <Routes>\n    <Route path="/products/:id" element={<ProductPage />} />\n  </Routes>\n</MemoryRouter>`, why: "`MemoryRouter` keeps history in memory and starts where you say. Without a matching `<Route>`, `useParams()` returns `{}`." }
    ],
    practice: [
      { level: "B", q: "Render `<CartPage />` starting at `/cart`.", a: "`renderWithProviders(<CartPage />, { route: '/cart' });`" },
      { level: "I", q: "Test that clicking **Back to shop** navigates to `/`.", a: "Add a second route that renders a marker, then assert it appears.", code: `<MemoryRouter initialEntries={['/cart']}>\n  <Routes>\n    <Route path="/cart" element={<CartPage />} />\n    <Route path="/" element={<h1>Shop home</h1>} />\n  </Routes>\n</MemoryRouter>\n// click, then: await screen.findByRole('heading', { name: 'Shop home' })` },
      { level: "I", q: "Let tests pre-fill the cart. How would you extend the helper?", a: "Accept an option like `{ initialCart }` and pass it to `<CartProvider initial={initialCart}>`." },
      { level: "C", q: "Your app uses `createBrowserRouter` with loaders. How do you test a route with its loader?", a: "Build `createMemoryRouter(routes, { initialEntries: ['/products/42'] })` from the same route config and render `<RouterProvider router={router} />`; mock the loader's fetch with MSW." }
    ],
    quiz: [
      { q: "Which router do you use in component tests?", options: ["`BrowserRouter`", "`MemoryRouter`", "No router"], answer: 1, why: "It keeps history in memory and lets you set the starting URL." },
      { q: "Why create a new `QueryClient` per test?", options: ["It's required by React", "To avoid cache leaking between tests", "To make queries retry more"], answer: 1, why: "Isolation: each test starts with an empty cache." },
      { q: "Where does `MemoryRouter` come from in React Router 7?", options: ["`react-router`", "`@testing-library/react`", "`react-dom/test-utils`"], answer: 0, why: "v7 merged the DOM bindings into the single `react-router` package." }
    ],
    rev: {
      sec30: "Components that use context, routing or TanStack Query need their providers in tests. Write a `renderWithProviders` helper that wraps `ui` in a fresh `QueryClient` (retry off), your context providers and a `MemoryRouter` (from `react-router`) with `initialEntries`; add a `<Route path>` so `useParams` works. Pass it as `render`'s `wrapper`.",
      interview: [
        { level: "basic", q: "Why does `render(<Profile />)` throw “must be used within a Router”?", a: "The component calls a router hook (like `useNavigate`) but the test didn't render it inside a router. Wrap it in `MemoryRouter`." },
        { level: "intermediate", q: "What's a custom render function?", a: "A helper around RTL's `render` that adds the app's providers via the `wrapper` option, so every test renders components in a realistic environment with one line." },
        { level: "intermediate", q: "How do you test a component that reads `useParams`?", a: "Render it inside `MemoryRouter initialEntries={['/products/42']}` with a `<Route path=\"/products/:id\">`, so the param is matched." },
        { level: "advanced", q: "TanStack Query test setup tips?", a: "New `QueryClient` per test, `retry: false`, mock HTTP with MSW, and use `findBy` for data that arrives later." },
        { level: "tricky", q: "Should the test wrapper use your real providers or mocks?", a: "Real ones where possible, so tests catch provider bugs. Mock only what talks to the outside (APIs, auth SDKs)." }
      ],
      cheat: [
        "`render(ui, { wrapper: Wrapper })`",
        "Tests use `MemoryRouter initialEntries={['/path']}` (from `react-router`)",
        "Add `<Route path=\"/x/:id\">` so `useParams` works",
        "New `QueryClient` per test, `retry: false`",
        "Wrap with your real context providers",
        "Loaders/data router: `createMemoryRouter` + `RouterProvider`"
      ]
    },
    related: ["TEST-007", "ROUTE-005", "COMM-006", "STORE-020"]
  },

  "TEST-009": {
    tldr: "Testing props means rendering a component with different inputs and checking the output changes correctly. For function props (callbacks), pass a fake `vi.fn()` and check it was called.",
    analogy: { icon: "🏷️", text: "A label printer. Feed it “10 in stock” and it prints **In stock**; feed it “3” and it prints **Only 3 left**. You test it by feeding different values and reading the label." },
    visual: { type: "flow", title: "Props in → output out", steps: [
      { label: "stock = 10", detail: "Render `<StockBadge stock={10} />` → text “In stock”." },
      { label: "stock = 3", detail: "Render with 3 → “Only 3 left” (low-stock branch)." },
      { label: "stock = 0", detail: "Render with 0 → a **Notify me** button appears." },
      { label: "Callback prop", detail: "Pass `onNotify={vi.fn()}`, click the button, assert it was called once." },
      { label: "Props change", detail: "`rerender(<StockBadge stock={2} />)` → UI updates to “Only 2 left”." }
    ]},
    points: [
      "One test per **meaningful branch** of the props: normal, edge (0, empty), and boundary (exactly 5).",
      "`test.each` runs the same test with a table of inputs: less copy-paste.",
      "Callback props: `const onNotify = vi.fn()` → interact → `expect(onNotify).toHaveBeenCalledWith(...)`.",
      "`rerender(<C newProps />)` from `render()` checks the component reacts to **new** props.",
      "Assert the **output**, never read `props` back from the component."
    ],
    code: { file: "StockBadge.test.jsx", lang: "jsx", src: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';

function StockBadge({ stock, onNotify }) {
  if (stock === 0) return <button onClick={onNotify}>Notify me</button>;
  return <span>{stock < 5 ? \`Only \${stock} left\` : 'In stock'}</span>;
}

test.each([
  [10, 'In stock'],
  [3, 'Only 3 left'],
])('stock=%i shows "%s"', (stock, text) => {
  render(<StockBadge stock={stock} />);
  expect(screen.getByText(text)).toBeInTheDocument();
});

test('sold out: clicking calls onNotify', async () => {
  const onNotify = vi.fn();
  render(<StockBadge stock={0} onNotify={onNotify} />);

  await userEvent.click(screen.getByRole('button', { name: 'Notify me' }));
  expect(onNotify).toHaveBeenCalledTimes(1);
});

test('updates when props change', () => {
  const { rerender } = render(<StockBadge stock={10} />);
  rerender(<StockBadge stock={2} />);
  expect(screen.getByText('Only 2 left')).toBeInTheDocument();
});`, walk: [
      { lines: [5, 6, 7], note: "Three branches driven by one prop: sold out, low stock, in stock." },
      { lines: [10, 11, 12, 13], note: "`test.each`: one test body, a table of `[input, expected]` rows. `%i` / `%s` fill the test name." },
      { lines: [19, 20], note: "A spy (`vi.fn()`) stands in for the parent's handler." },
      { lines: [22, 23], note: "Click like a user, then check the callback fired exactly once." },
      { lines: [27, 28, 29], note: "`rerender` keeps the same component instance and gives it new props." }
    ]},
    output: "✓ stock=10 shows \"In stock\"\n✓ stock=3 shows \"Only 3 left\"\n✓ sold out: clicking calls onNotify\n✓ updates when props change",
    mistakes: [
      { bad: `render(<StockBadge stock={3} />);\nrender(<StockBadge stock={10} />);\nexpect(screen.getByText('In stock')).toBeInTheDocument();`, good: `const { rerender } = render(<StockBadge stock={3} />);\nrerender(<StockBadge stock={10} />);`, why: "Calling `render` twice mounts **two** components side by side; `rerender` updates the existing one." },
      { bad: `expect(onNotify).toHaveBeenCalled;`, good: `expect(onNotify).toHaveBeenCalled();`, why: "Without `()` the matcher is never run, so the test passes no matter what." }
    ],
    practice: [
      { level: "B", q: "Add a `test.each` row for the boundary `stock = 5`.", a: "`[5, 'In stock']`, since the rule is `stock < 5`." },
      { level: "I", q: "A `<RecipeCard title onSave />` calls `onSave(title)`. Test it.", a: "Spy, click, check the argument.", code: `const onSave = vi.fn();\nrender(<RecipeCard title="Pancakes" onSave={onSave} />);\nawait userEvent.click(screen.getByRole('button', { name: 'Save' }));\nexpect(onSave).toHaveBeenCalledWith('Pancakes');` },
      { level: "I", q: "Test that `<Avatar name=\"Sam\" />` without an image shows the initial “S”.", a: "`render(<Avatar name=\"Sam\" />); expect(screen.getByText('S')).toBeInTheDocument();`" },
      { level: "C", q: "`StockBadge` should not crash for `stock={undefined}`. Write the test and the fix.", a: "Test `render(<StockBadge />)` shows a fallback like “Unavailable”; in the component handle `stock == null` first." }
    ],
    quiz: [
      { q: "How do you test that a callback prop was called with the right value?", options: ["Read `props.onSave` from the component", "Pass `vi.fn()` and use `toHaveBeenCalledWith`", "Check the console"], answer: 1, why: "A mock function records every call and its arguments." },
      { q: "What does `rerender` do?", options: ["Mounts a second copy", "Updates the same component with new props", "Clears the DOM"], answer: 1, why: "It re-renders the existing tree, like a parent passing new props." },
      { q: "Best use of `test.each`?", options: ["Same check over several input/output pairs", "Running tests in parallel", "Retrying flaky tests"], answer: 0, why: "It turns a table of cases into separate, named tests." }
    ],
    rev: {
      sec30: "Test props by rendering with different values and asserting the visible output for each branch (use `test.each` for tables). For callback props pass `vi.fn()`, interact, and assert `toHaveBeenCalledWith`. Use `rerender` to check updates to new props. Never inspect props directly; check what the user sees.",
      interview: [
        { level: "basic", q: "How do you test a component with different props?", a: "Render it once per case with those props and assert the output text, roles or attributes for each." },
        { level: "intermediate", q: "How do you test a callback prop like `onSubmit`?", a: "Pass a mock (`vi.fn()`), perform the user action, then assert it was called, how many times and with what arguments." },
        { level: "intermediate", q: "`render` twice vs `rerender`?", a: "`render` mounts a new tree each time; `rerender` updates the existing one, preserving state, like a real prop change." },
        { level: "advanced", q: "Which prop values deserve tests?", a: "Each branch the component takes: typical, empty/zero, boundary values, missing optional props, and long/unusual strings if layout or truncation matters." },
        { level: "tricky", q: "A test asserts `expect(onNotify).not.toHaveBeenCalled()` without clicking anything. Useful?", a: "Only if “not called” is the behaviour (e.g. after clicking a disabled button). Otherwise it proves nothing." }
      ],
      cheat: [
        "One render per meaningful prop branch",
        "`test.each([[in, out], ...])('name %s', fn)`",
        "Callbacks: `vi.fn()` + `toHaveBeenCalledWith(...)`",
        "`const { rerender } = render(...)` for new props",
        "Don't forget `()` on matchers",
        "Assert output, never inspect props"
      ]
    },
    related: ["PROPS-001", "PROPS-008", "TEST-011", "TEST-002"]
  },

  "TEST-010": {
    tldr: "You never read a component's state in a test. Do what the user does (click, type), then check what the screen shows. If the UI is right, the state is right.",
    analogy: { icon: "🔢", text: "A shop's quantity picker. You don't open the till to check the number; you press **+** and look at the counter on the screen." },
    visual: { type: "timeline", title: "Quantity picker under test", frames: [
      { label: "render", state: "Qty: 1 · [−] disabled", note: "Start state: assert text 1 and the minus button is disabled." },
      { label: "click +", state: "Qty: 2 · [−] enabled", note: "State changed → React re-rendered → we assert the new text." },
      { label: "click −", state: "Qty: 1 · [−] disabled", note: "Back to the minimum. The rule “never below 1” is visible." },
      { label: "click − (again)", state: "Qty: 1", note: "Disabled button: nothing happens. That's the behaviour we want." }
    ]},
    points: [
      "**Act like a user, assert the UI**: text, values, enabled/disabled, visible/hidden.",
      "No access to `useState` from outside, and you don't need it. Internals can be swapped (`useReducer`, Zustand) without breaking tests.",
      "user-event wraps updates in `act()` for you; just `await` each interaction.",
      "Check **before and after** an action, so you know the change really happened.",
      "Use jest-dom matchers: `toHaveTextContent`, `toHaveValue`, `toBeDisabled`, `toBeChecked`."
    ],
    code: { file: "QuantityPicker.test.jsx", lang: "jsx", src: `import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';

function QuantityPicker() {
  const [qty, setQty] = useState(1);
  return (
    <div>
      <button aria-label="Decrease" onClick={() => setQty(qty - 1)} disabled={qty === 1}>−</button>
      <output aria-label="Quantity">{qty}</output>
      <button aria-label="Increase" onClick={() => setQty(qty + 1)}>+</button>
    </div>
  );
}

test('quantity goes up and never below 1', async () => {
  const user = userEvent.setup();
  render(<QuantityPicker />);
  const qty = screen.getByLabelText('Quantity');
  const minus = screen.getByRole('button', { name: 'Decrease' });

  expect(qty).toHaveTextContent('1');
  expect(minus).toBeDisabled();

  await user.click(screen.getByRole('button', { name: 'Increase' }));
  expect(qty).toHaveTextContent('2');
  expect(minus).toBeEnabled();

  await user.click(minus);
  expect(qty).toHaveTextContent('1');
});`, walk: [
      { lines: [7], note: "Internal state. The test never touches it directly." },
      { lines: [20, 21], note: "Grab elements once; RTL elements stay live as React re-renders." },
      { lines: [23, 24], note: "Assert the **before** picture: 1 and minus disabled." },
      { lines: [26, 27, 28], note: "User clicks **+**; state changes; assert the **after** picture." },
      { lines: [30, 31], note: "Back down to the minimum: the business rule is proven through the UI." }
    ]},
    output: "✓ quantity goes up and never below 1",
    mistakes: [
      { bad: `// Enzyme era\nexpect(wrapper.state('qty')).toBe(2);`, good: `expect(screen.getByLabelText('Quantity')).toHaveTextContent('2');`, why: "Reading internal state couples tests to implementation. Rename the variable or switch to `useReducer` and the test breaks for nothing." },
      { bad: `user.click(plus); // missing await\nexpect(qty).toHaveTextContent('2'); // fails`, good: `await user.click(plus);\nexpect(qty).toHaveTextContent('2');`, why: "user-event v14 methods return promises. Without `await` the assertion runs before React updates." }
    ],
    practice: [
      { level: "B", q: "Add a check that clicking **+** three times shows 4.", a: "Three `await user.click(plus)` calls, then `toHaveTextContent('4')`." },
      { level: "I", q: "A `<Toggle>` shows “Dark mode: off/on”. Test it.", a: "Assert “off”, click the switch, assert “on”.", code: `expect(screen.getByText('Dark mode: off')).toBeInTheDocument();\nawait user.click(screen.getByRole('switch', { name: 'Dark mode' }));\nexpect(screen.getByText('Dark mode: on')).toBeInTheDocument();` },
      { level: "I", q: "Add a max of 10 to the picker. What do you assert?", a: "After reaching 10, the Increase button `toBeDisabled()` and the quantity stays 10." },
      { level: "C", q: "Refactor `QuantityPicker` to `useReducer`. What happens to the test?", a: "Nothing; it still passes. That's the proof it tests behaviour, not implementation." }
    ],
    quiz: [
      { q: "How should a test verify a state change?", options: ["Read the state variable", "Check the rendered UI after the interaction", "Spy on `useState`"], answer: 1, why: "State only matters through what it shows the user." },
      { q: "You forgot `await` before `user.click`. Likely result?", options: ["Test still passes", "Assertion runs before the update and fails (or warns about act)", "Infinite loop"], answer: 1, why: "user-event is async in v14." },
      { q: "Which matcher checks a button can't be clicked?", options: ["`toBeDisabled()`", "`toBeFalsy()`", "`not.toBeInTheDocument()`"], answer: 0, why: "jest-dom's `toBeDisabled` checks the `disabled` state." }
    ],
    rev: {
      sec30: "Never inspect component state in tests. Render, assert the initial UI, perform the user action with `await user.…`, then assert the new UI (text, values, disabled, checked). This keeps tests valid when you swap `useState` for `useReducer` or a store. user-event wraps updates in `act()`.",
      interview: [
        { level: "basic", q: "How do you test state in React Testing Library?", a: "Indirectly: trigger the action that changes it and assert what the UI now shows." },
        { level: "intermediate", q: "Why not test state directly?", a: "It's an implementation detail. Tests that read state break on harmless refactors and can pass while the UI is wrong." },
        { level: "intermediate", q: "What is `act()` and do you call it yourself?", a: "It flushes React updates and effects before assertions. RTL's `render` and user-event already wrap it, so you rarely call it directly." },
        { level: "advanced", q: "Testing a component whose state lives in Zustand or Redux?", a: "Render it with a real (fresh) store, interact, assert the UI. Reset the store between tests so state doesn't leak." },
        { level: "tricky", q: "“Warning: an update was not wrapped in act(...)” appears. Cause?", a: "Usually an async update finished after the test stopped waiting: a missing `await` or not waiting with `findBy`/`waitFor` for data to arrive." }
      ],
      predict: [
        { code: `const plus = screen.getByRole('button', { name: 'Increase' });\nuser.click(plus);\nexpect(screen.getByLabelText('Quantity')).toHaveTextContent('2');`, answer: "Fails: still shows 1", why: "`user.click` returns a promise; without `await` the assertion runs first." }
      ],
      cheat: [
        "Never read state; assert the UI",
        "Before → `await user.click()` → after",
        "`toHaveTextContent`, `toHaveValue`, `toBeDisabled`, `toBeChecked`",
        "Elements stay live across re-renders",
        "Refactor-proof: works with useState, useReducer or a store",
        "act() warnings usually mean a missing await"
      ]
    },
    related: ["STATE-004", "TEST-011", "TEST-018", "STATE-001"]
  },

  "TEST-011": {
    tldr: "user-event simulates a real person: typing fires key presses one by one, clicking fires hover, focus and click. It catches bugs that a single fake `fireEvent` misses.",
    analogy: { icon: "⌨️", text: "Testing a chat box. `fireEvent` teleports the message into the input; user-event actually types it letter by letter and presses Enter, like a person." },
    visual: { type: "compare", title: "fireEvent vs user-event", left: { label: "fireEvent.change", tone: "bad", points: [
      "Dispatches ONE synthetic event",
      "Sets the value instantly; no keys, no focus",
      "Skips focus and `pointer-events: none` checks",
      "Synchronous"
    ]}, right: { label: "user.type / user.click", tone: "good", points: [
      "Fires the full sequence: pointer, focus, keydown, input, keyup",
      "Respects disabled, readonly and maxLength",
      "`{Enter}` submits forms, `{Tab}` moves focus",
      "Async: always `await` it"
    ]}},
    points: [
      "Start each test with `const user = userEvent.setup()`, then `await user.click()`, `user.type()`, `user.keyboard()`.",
      "Common moves: `click`, `dblClick`, `type`, `clear`, `selectOptions`, `tab`, `hover`, `upload`.",
      "Special keys in braces: `'Buy milk{Enter}'`, `'{Backspace}'`, `'{Shift>}A{/Shift}'`.",
      "`fireEvent` is still fine for events users can't easily do (e.g. `scroll`, custom events).",
      "Package: `@testing-library/user-event` v14 (async API)."
    ],
    code: { file: "TodoInput.test.jsx", lang: "jsx", src: `import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';

function TodoInput() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  function handleSubmit(e) {
    e.preventDefault();
    setTodos([...todos, text]);
    setText('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>New todo <input value={text} onChange={(e) => setText(e.target.value)} /></label>
      <button>Add</button>
      <ul>{todos.map((t) => <li key={t}>{t}</li>)}</ul>
    </form>
  );
}

test('typing and pressing Enter adds a todo', async () => {
  const user = userEvent.setup();
  render(<TodoInput />);
  const input = screen.getByRole('textbox', { name: 'New todo' });

  await user.type(input, 'Buy milk{Enter}');

  expect(screen.getByRole('listitem')).toHaveTextContent('Buy milk');
  expect(input).toHaveValue('');
});`, walk: [
      { lines: [16], note: "Wrapping the input in a `<label>` gives it the accessible name “New todo”." },
      { lines: [24], note: "`setup()` creates a user session (keyboard + pointer state) for this test." },
      { lines: [28], note: "Clicks into the input, types 8 characters (8 `onChange`s), then **Enter** submits the form." },
      { lines: [30, 31], note: "Assert the visible result: a new list item, and the input cleared." }
    ]},
    output: "✓ typing and pressing Enter adds a todo",
    mistakes: [
      { bad: `fireEvent.change(input, { target: { value: 'Buy milk' } });\nfireEvent.click(addButton);`, good: `await user.type(input, 'Buy milk');\nawait user.click(addButton);`, why: "`fireEvent` skips focus, key events and `pointer-events` checks, so it can pass where a real user would be stuck." },
      { bad: `test('adds', () => {\n  user.type(input, 'Tea');\n  expect(input).toHaveValue('Tea');\n});`, good: `test('adds', async () => {\n  await user.type(input, 'Tea');\n  expect(input).toHaveValue('Tea');\n});`, why: "All user-event v14 methods are async. Make the test `async` and `await` each call." }
    ],
    practice: [
      { level: "B", q: "Pick “Large” in a `<select>` labelled “Size”.", a: "`await user.selectOptions(screen.getByLabelText('Size'), 'Large');`" },
      { level: "B", q: "Tick a checkbox labelled “Gift wrap”.", a: "`await user.click(screen.getByRole('checkbox', { name: 'Gift wrap' }));` then `toBeChecked()`." },
      { level: "I", q: "Replace the text in an input that already says “Tea”.", a: "Clear first, then type.", code: `await user.clear(input);\nawait user.type(input, 'Coffee');\nexpect(input).toHaveValue('Coffee');` },
      { level: "C", q: "Test keyboard accessibility: Tab to the Add button and press Enter.", a: "`await user.tab(); await user.tab(); expect(addButton).toHaveFocus(); await user.keyboard('{Enter}');` then assert the result." }
    ],
    quiz: [
      { q: "Why prefer `user.type` over `fireEvent.change`?", options: ["It's synchronous", "It fires the real sequence of events a user would trigger", "It skips validation"], answer: 1, why: "Closer to real usage, so it catches more bugs." },
      { q: "How do you press Enter after typing?", options: ["`user.type(input, 'Tea\\n')`", "`user.type(input, 'Tea{Enter}')`", "`user.enter()`"], answer: 1, why: "Special keys go in curly braces." },
      { q: "`user.click` on a disabled button…", options: ["Calls `onClick` anyway", "Does nothing, like a real user", "Throws a syntax error"], answer: 1, why: "Like a real user, user-event can't interact with disabled elements." }
    ],
    rev: {
      sec30: "Use `@testing-library/user-event` v14: `const user = userEvent.setup()`, then `await user.click/type/keyboard/selectOptions/tab`. It fires realistic event sequences (focus, keys, input), respects disabled elements and supports `{Enter}`-style keys. `fireEvent` dispatches a single event; keep it for edge cases.",
      interview: [
        { level: "basic", q: "user-event vs fireEvent?", a: "fireEvent dispatches one DOM event. user-event simulates full interactions (pointer, focus, keyboard, input) the way a browser would for a real user." },
        { level: "intermediate", q: "Why call `userEvent.setup()` first?", a: "It creates a session that tracks keyboard and pointer state across calls and applies options, so sequences like Shift-held typing behave correctly." },
        { level: "intermediate", q: "How do you test a form submit?", a: "Fill fields with `user.type`, click the submit button or type `{Enter}`, then assert the result or that the `onSubmit` mock was called with the data." },
        { level: "advanced", q: "Using fake timers with user-event?", a: "Pass the timer advance to setup: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, otherwise its internal delays wait forever." },
        { level: "tricky", q: "`user.type(input, 'abc')` and `onChange` fires how many times?", a: "Three: once per character, just like real typing." }
      ],
      cheat: [
        "`const user = userEvent.setup()` per test",
        "Always `await user.click(...)` / `user.type(...)`",
        "Keys: `{Enter}` `{Tab}` `{Backspace}` `{Escape}`",
        "`user.selectOptions(select, 'Large')`, `user.clear(input)`",
        "Respects disabled and `pointer-events: none`",
        "Fake timers: `setup({ advanceTimers: vi.advanceTimersByTime })`"
      ]
    },
    related: ["EVT-001", "EVT-010", "TEST-007", "TEST-010"]
  },

  "TEST-012": {
    tldr: "`renderHook` runs a custom hook inside a tiny test component so you can call its functions and read what it returns. Wrap updates in `act()`.",
    analogy: { icon: "🎵", text: "Testing a playlist remote without the stereo. Press **add** and **remove**, then read the song list on the remote's little screen." },
    visual: { type: "timeline", title: "`result.current` after each step", frames: [
      { label: "renderHook", state: "songs = ['Intro'] · count 1", note: "The hook runs inside a hidden test component." },
      { label: "act(add 'Encore')", state: "songs = ['Intro', 'Encore'] · count 2", note: "`act` flushes the state update; `result.current` is refreshed." },
      { label: "act(remove 'Intro')", state: "songs = ['Encore'] · count 1", note: "Always read `result.current` again; old destructured values are stale." },
      { label: "rerender(new props)", state: "songs = ['Encore']", note: "New initial value is ignored: `useState` only uses it on the first render." }
    ]},
    points: [
      "`import { renderHook, act } from '@testing-library/react'` (the old `@testing-library/react-hooks` package is obsolete).",
      "`result.current` = the hook's latest return value. Re-read it after every update.",
      "Wrap calls that set state in `act(() => …)` so React applies them before you assert.",
      "Hook needs context? `renderHook(() => useCart(), { wrapper: CartProvider })`.",
      "If the hook is only used by one component, testing the **component** is often better."
    ],
    code: { file: "usePlaylist.test.jsx", lang: "jsx", src: `import { useState } from 'react';
import { renderHook, act } from '@testing-library/react';
import { test, expect } from 'vitest';

function usePlaylist(initial = []) {
  const [songs, setSongs] = useState(initial);
  const add = (song) => setSongs((s) => [...s, song]);
  const remove = (song) => setSongs((s) => s.filter((x) => x !== song));
  return { songs, add, remove, count: songs.length };
}

test('adds and removes songs', () => {
  const { result } = renderHook(() => usePlaylist(['Intro']));
  expect(result.current.count).toBe(1);

  act(() => result.current.add('Encore'));
  expect(result.current.songs).toEqual(['Intro', 'Encore']);

  act(() => result.current.remove('Intro'));
  expect(result.current.songs).toEqual(['Encore']);
});

test('new props do not reset useState', () => {
  const { result, rerender } = renderHook(
    ({ start }) => usePlaylist(start),
    { initialProps: { start: ['A'] } }
  );
  rerender({ start: ['B'] });
  expect(result.current.songs).toEqual(['A']);
});`, walk: [
      { lines: [5, 6, 7, 8, 9], note: "A custom hook: state + actions + a derived `count`. Normally imported from `usePlaylist.js`." },
      { lines: [13], note: "`renderHook` mounts a test component that calls the hook. `result.current` holds its return value." },
      { lines: [16, 17], note: "`act` applies the update; then read `result.current` fresh." },
      { lines: [24, 25, 26], note: "`initialProps` feeds the hook arguments; `rerender` passes new ones." },
      { lines: [28, 29], note: "Proves a real React rule: the initial state is only read on mount." }
    ]},
    output: "✓ adds and removes songs\n✓ new props do not reset useState",
    mistakes: [
      { bad: `const { songs, add } = result.current;\nact(() => add('Encore'));\nexpect(songs).toHaveLength(2); // still 1`, good: `act(() => result.current.add('Encore'));\nexpect(result.current.songs).toHaveLength(2);`, why: "Destructuring captures one render's snapshot. Always read through `result.current`." },
      { bad: `usePlaylist(); // called directly in a test\n// Error: Invalid hook call`, good: `renderHook(() => usePlaylist());`, why: "Hooks only work inside a component render. `renderHook` provides that component." }
    ],
    practice: [
      { level: "B", q: "Test that `usePlaylist()` with no arguments starts empty.", a: "`expect(renderHook(() => usePlaylist()).result.current.count).toBe(0);`" },
      { level: "I", q: "Test a `useCart` hook that reads `CartContext`.", a: "Pass the provider as a wrapper.", code: `const { result } = renderHook(() => useCart(), {\n  wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,\n});\nact(() => result.current.addItem({ id: 1, name: 'Tea' }));\nexpect(result.current.items).toHaveLength(1);` },
      { level: "I", q: "Test `useDebounce(value, 300)` with fake timers.", a: "`vi.useFakeTimers()`, rerender with a new value, `act(() => vi.advanceTimersByTime(300))`, then assert `result.current`." },
      { level: "C", q: "A `useWeather(city)` hook fetches data. How do you wait for the result?", a: "Mock the API with MSW, then `await waitFor(() => expect(result.current.data).toEqual({...}))`." }
    ],
    quiz: [
      { q: "Where does `renderHook` come from today?", options: ["`@testing-library/react-hooks`", "`@testing-library/react`", "`react`"], answer: 1, why: "It moved into RTL; the separate package is deprecated." },
      { q: "Why wrap `result.current.add()` in `act`?", options: ["To make it async", "So React processes the state update before assertions", "To mock it"], answer: 1, why: "`act` flushes updates and effects." },
      { q: "After an update, which value is current?", options: ["A variable destructured before the update", "`result.current`", "The hook's initial argument"], answer: 1, why: "`result.current` is refreshed on every render." }
    ],
    rev: {
      sec30: "Test custom hooks with `renderHook(() => useX(args), { wrapper, initialProps })` from `@testing-library/react`. Read `result.current` (never a stale destructured copy), wrap state changes in `act()`, use `rerender(newProps)` for argument changes and `waitFor` for async results. Prefer testing via a component when the hook has one consumer.",
      interview: [
        { level: "basic", q: "Why can't you call a hook directly in a test?", a: "Hooks must run during a component render. `renderHook` renders a tiny component that calls it for you." },
        { level: "intermediate", q: "What is `result.current`?", a: "A ref-like object updated after every render with the hook's latest return value." },
        { level: "intermediate", q: "How do you test a hook that needs context?", a: "Pass `wrapper` to `renderHook` with the provider, e.g. `{ wrapper: CartProvider }`." },
        { level: "advanced", q: "When should you test the hook vs the component?", a: "Test the hook directly when it's reusable logic shared across components or has complex branches. If one component uses it, testing that component covers it with less coupling." },
        { level: "tricky", q: "You `rerender` with a new initial list and the hook ignores it. Bug?", a: "No, that's `useState` semantics: the initial value is only used on the first render. Use a `key` or a reset function if you need it." }
      ],
      cheat: [
        "`renderHook(() => useX(), { wrapper, initialProps })`",
        "Read `result.current` after every update",
        "State changes inside `act(() => ...)`",
        "`rerender(newProps)` for new arguments",
        "Async hooks: `await waitFor(() => expect(result.current...))`",
        "Import from `@testing-library/react` (not react-hooks)"
      ]
    },
    related: ["HOOKS-022", "HOOKS-021", "TEST-014", "TEST-010"]
  },

  "TEST-013": {
    tldr: "MSW (Mock Service Worker) catches your app's real `fetch` calls at the network level and answers with fake data. Components stay untouched, and the same mocks work in tests and the browser.",
    analogy: { icon: "📞", text: "A friendly receptionist who answers every call to the weather service during practice. Your app dials the real number; the receptionist reads out a pretend forecast." },
    visual: { type: "flow", title: "A request in a test with MSW", steps: [
      { label: "Component fetches", detail: "`fetch('https://api.shop.test/products')`: real code, no changes." },
      { label: "MSW intercepts", detail: "`setupServer` patches Node's network layer and matches the URL + method." },
      { label: "Handler answers", detail: "`http.get(url, () => HttpResponse.json([...]))` returns fake JSON." },
      { label: "UI updates", detail: "The component renders products as if the API were real." },
      { label: "Test asserts", detail: "`await screen.findByText('Green tea')`." }
    ]},
    points: [
      "MSW v2 API: `import { http, HttpResponse } from 'msw'` and `setupServer` from `'msw/node'`.",
      "Lifecycle: `listen` before all, `resetHandlers` after each, `close` after all.",
      "Override per test with `server.use(...)` to simulate errors (500), empty lists or slow responses.",
      "`onUnhandledRequest: 'error'` makes a forgotten mock fail loudly instead of hitting the internet.",
      "Works with fetch, axios and TanStack Query, because it mocks the **network**, not the library."
    ],
    code: { file: "Products.test.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';

const API = 'https://api.shop.test/products';

function Products() {
  const [state, setState] = useState({ status: 'loading', items: [] });
  useEffect(() => {
    fetch(API)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((items) => setState({ status: 'done', items }))
      .catch(() => setState({ status: 'error', items: [] }));
  }, []);
  if (state.status === 'loading') return <p>Loading…</p>;
  if (state.status === 'error') return <p role="alert">Could not load products</p>;
  return <ul>{state.items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

const server = setupServer(
  http.get(API, () => HttpResponse.json([{ id: 1, name: 'Green tea' }]))
);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('shows products from the API', async () => {
  render(<Products />);
  expect(await screen.findByText('Green tea')).toBeInTheDocument();
});

test('shows an error when the API fails', async () => {
  server.use(http.get(API, () => new HttpResponse(null, { status: 500 })));
  render(<Products />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load');
});`, walk: [
      { lines: [12], note: "The component calls real `fetch`. Nothing in it knows about tests." },
      { lines: [22, 23, 24], note: "Default handlers: the “happy path” answer for every test." },
      { lines: [25, 26, 27], note: "Start once, reset per-test overrides after each test, shut down at the end." },
      { lines: [31], note: "Data arrives asynchronously, so use `findBy`, which waits for it." },
      { lines: [35], note: "`server.use` overrides the handler for **this test only**: simulate a 500." }
    ]},
    output: "✓ shows products from the API\n✓ shows an error when the API fails",
    mistakes: [
      { bad: `globalThis.fetch = vi.fn(() =>\n  Promise.resolve({ json: () => Promise.resolve([...]) })\n);`, good: `server.use(\n  http.get(API, () => HttpResponse.json([...]))\n);`, why: "Hand-mocking `fetch` is fragile (forgets `ok`, status, headers) and breaks if you switch to axios. MSW mocks the network itself." },
      { bad: `afterEach(() => {}); // no resetHandlers\n// test 2 still gets test 1's 500 error`, good: `afterEach(() => server.resetHandlers());`, why: "`server.use` overrides persist until reset; without it, tests depend on order." }
    ],
    practice: [
      { level: "B", q: "Write a handler for `POST https://api.shop.test/cart` that returns `{ ok: true }` with status 201.", a: "Use `http.post`.", code: `http.post('https://api.shop.test/cart', () =>\n  HttpResponse.json({ ok: true }, { status: 201 })\n)` },
      { level: "I", q: "Test the empty state: API returns `[]`, UI shows “No products yet”.", a: "`server.use(http.get(API, () => HttpResponse.json([])))`, render, then `await screen.findByText('No products yet')`." },
      { level: "I", q: "Read the request body in a handler to check what the form sent.", a: "Handlers get the request.", code: `http.post(url, async ({ request }) => {\n  const body = await request.json();\n  return HttpResponse.json({ id: 1, ...body });\n})` },
      { level: "C", q: "Share handlers between tests and local development.", a: "Put them in `src/mocks/handlers.js`; use `setupServer(...handlers)` in the test setup file and `setupWorker(...handlers)` from `msw/browser` in dev." }
    ],
    quiz: [
      { q: "What does MSW mock?", options: ["React components", "The network layer (requests and responses)", "The fetch function's source code"], answer: 1, why: "It intercepts requests, so any HTTP client works unchanged." },
      { q: "How do you make one test get a 500 error?", options: ["Edit the default handler", "`server.use(...)` inside that test", "Turn off Wi-Fi"], answer: 1, why: "Runtime overrides apply until `resetHandlers()`." },
      { q: "Why `onUnhandledRequest: 'error'`?", options: ["To speed up tests", "To fail loudly when a request has no mock", "To retry requests"], answer: 1, why: "Forgotten mocks show up immediately instead of hitting real servers." }
    ],
    rev: {
      sec30: "MSW intercepts HTTP at the network level. Define handlers with `http.get/post(url, () => HttpResponse.json(data))`, run `setupServer` (from `msw/node`) with listen/resetHandlers/close hooks, and override per test with `server.use` for errors or empty states. Components and HTTP clients stay unchanged; the same handlers can run in the browser via `setupWorker`.",
      interview: [
        { level: "basic", q: "Why mock APIs in component tests?", a: "Real APIs are slow, flaky and change data. Mocks make tests fast, deterministic and able to simulate errors." },
        { level: "intermediate", q: "Why MSW instead of mocking fetch or axios?", a: "MSW mocks at the network boundary, so the component and its HTTP client run for real. You can switch fetch to axios or TanStack Query without touching tests." },
        { level: "intermediate", q: "How do you test an error state with MSW?", a: "In that test, `server.use(http.get(url, () => new HttpResponse(null, { status: 500 })))`, render, and `findBy` the error message." },
        { level: "advanced", q: "How do you keep MSW tests isolated?", a: "`resetHandlers()` after each test, a fresh QueryClient per test, `onUnhandledRequest: 'error'`, and no shared mutable data in handlers." },
        { level: "tricky", q: "MSW handler is defined but the component still shows Loading forever. Why?", a: "Usually the URL or method doesn't match (relative vs absolute URL, wrong host), or the test asserted with `getBy` instead of awaiting `findBy`." }
      ],
      debug: [
        { code: `afterEach(() => {});\ntest('error', () => {\n  server.use(http.get(API, () => new HttpResponse(null, { status: 500 })));\n  ...\n});\ntest('success', async () => { /* fails randomly */ });`, fix: `afterEach(() => server.resetHandlers());`, why: "The 500 override leaks into later tests until handlers are reset." }
      ],
      cheat: [
        "`import { http, HttpResponse } from 'msw'`",
        "`setupServer(...handlers)` from `'msw/node'`",
        "listen → resetHandlers (afterEach) → close",
        "`HttpResponse.json(data, { status })`",
        "Per-test override: `server.use(http.get(...))`",
        "`onUnhandledRequest: 'error'` catches forgotten mocks"
      ]
    },
    related: ["API-006", "API-014", "TEST-014", "STORE-020"]
  },

  "TEST-014": {
    tldr: "Async UI (data loading, timers) isn't ready straight away. `findBy…` waits for an element to appear; `waitFor` retries any assertion until it passes. Both give up after 1 second by default.",
    analogy: { icon: "☕", text: "Waiting for your coffee order. You don't check once and leave; you glance at the counter every few seconds until your name is called (or you give up)." },
    visual: { type: "timeline", title: "`await findByRole('heading', { name: '21°C' })`", frames: [
      { label: "0 ms", state: "Loading…", note: "`getBy` would throw right here. `findBy` starts polling instead." },
      { label: "50 ms", state: "Loading…", note: "Retry: still not there. RTL also re-checks whenever the DOM changes." },
      { label: "≈80 ms", state: "<h2>21°C</h2>", note: "Promise resolved, React re-rendered. `findBy` resolves with the element." },
      { label: "1000 ms", state: "(if never shown)", note: "Timeout: the test fails and prints the current DOM to help debug." }
    ]},
    points: [
      "**Element will appear** → `await screen.findByText(...)` (= `getBy` + `waitFor`).",
      "**Something else will become true** (a mock called, text changed) → `await waitFor(() => expect(...))`.",
      "**Element will disappear** → `await waitForElementToBeRemoved(() => screen.queryByText('Loading…'))`.",
      "Inside `waitFor`: one assertion, **no side effects** (no clicks); it may run many times.",
      "Never fixed sleeps (`setTimeout` in tests). Fake timers (`vi.useFakeTimers()`) for debounce and delays."
    ],
    code: { file: "Weather.test.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';

function Weather({ loadWeather, onLoaded }) {
  const [temp, setTemp] = useState(null);
  useEffect(() => {
    loadWeather().then((t) => {
      setTemp(t);
      onLoaded(t);
    });
  }, [loadWeather, onLoaded]);
  return temp === null ? <p>Loading…</p> : <h2>{temp}°C</h2>;
}

test('shows the temperature once loaded', async () => {
  const loadWeather = vi.fn(() => Promise.resolve(21));
  const onLoaded = vi.fn();
  render(<Weather loadWeather={loadWeather} onLoaded={onLoaded} />);

  // findBy = getBy + retry until it appears (default 1000 ms)
  expect(await screen.findByRole('heading', { name: '21°C' })).toBeInTheDocument();

  // waitFor = retry an assertion that isn't "an element appeared"
  await waitFor(() => expect(onLoaded).toHaveBeenCalledWith(21));

  expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
});`, walk: [
      { lines: [8, 9, 10], note: "The UI changes **later**, after a promise resolves: classic async behaviour." },
      { lines: [17], note: "A fake loader that resolves to 21. In app tests this would be MSW." },
      { lines: [22], note: "`await findByRole` keeps retrying until the heading exists. No sleeps." },
      { lines: [25], note: "`waitFor` retries a non-element assertion. Keep it to one `expect`." },
      { lines: [27], note: "Once data is shown, the loading text is gone: `queryBy` + `not`." }
    ]},
    output: "✓ shows the temperature once loaded (84ms)",
    mistakes: [
      { bad: `render(<Weather ... />);\nexpect(screen.getByText('21°C')).toBeInTheDocument();\n// Unable to find an element with the text: 21°C`, good: `render(<Weather ... />);\nexpect(await screen.findByText('21°C')).toBeInTheDocument();`, why: "`getBy` checks once, immediately, while the UI still says Loading. `findBy` waits." },
      { bad: `await waitFor(async () => {\n  await user.click(refresh);\n  expect(screen.getByText('22°C')).toBeInTheDocument();\n});`, good: `await user.click(refresh);\nexpect(await screen.findByText('22°C')).toBeInTheDocument();`, why: "The `waitFor` callback can run many times; side effects inside it click again and again. Act first, then wait." },
      { bad: `await waitFor(() => screen.getByText('21°C'));\nexpect(screen.getByText('21°C')).toBeInTheDocument();`, good: `expect(await screen.findByText('21°C')).toBeInTheDocument();`, why: "`findBy` already is `waitFor` + `getBy`. Shorter and clearer." }
    ],
    practice: [
      { level: "B", q: "A list of recipes loads from MSW. Wait for all three items.", a: "`const items = await screen.findAllByRole('listitem'); expect(items).toHaveLength(3);`" },
      { level: "I", q: "Wait for a spinner to disappear.", a: "Use `waitForElementToBeRemoved`.", code: `await waitForElementToBeRemoved(() => screen.queryByText('Loading…'));` },
      { level: "I", q: "Your API is slow in one test (2 s). How do you raise the wait?", a: "`await screen.findByText('Done', {}, { timeout: 3000 })` (or `waitFor(cb, { timeout: 3000 })`). Better: make the mock respond faster." },
      { level: "C", q: "Test a search box debounced by 300 ms without real waiting.", a: "Fake timers + user-event that advances them.", code: `vi.useFakeTimers();\nconst user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });\nawait user.type(screen.getByRole('searchbox'), 'tea');\nact(() => vi.advanceTimersByTime(300));\nexpect(screen.getByText('Green tea')).toBeInTheDocument(); // getBy: fake timers stall findBy polling\nvi.useRealTimers();` }
    ],
    quiz: [
      { q: "Data loads after a fetch. Which query?", options: ["`getByText`", "`queryByText`", "`await findByText`"], answer: 2, why: "Only `findBy` waits for the element to appear." },
      { q: "What should NOT go inside a `waitFor` callback?", options: ["A single `expect`", "A `user.click`", "A query"], answer: 1, why: "The callback is retried; side effects would run repeatedly." },
      { q: "Default timeout for `findBy` / `waitFor`?", options: ["100 ms", "1000 ms", "No timeout"], answer: 1, why: "RTL polls every 50 ms for up to 1000 ms by default." }
    ],
    rev: {
      sec30: "For async UI: `await findBy…` when an element will appear, `await waitFor(() => expect(...))` for other eventual conditions, `waitForElementToBeRemoved` for disappearing loaders. Defaults: poll every 50 ms, 1000 ms timeout. Keep `waitFor` to one assertion with no side effects, never use fixed sleeps, and use fake timers for debounce/delays.",
      interview: [
        { level: "basic", q: "How do you test something that appears after a fetch?", a: "Mock the request (MSW) and `await screen.findByText(...)`, which retries until it appears or times out." },
        { level: "intermediate", q: "`findBy` vs `waitFor`?", a: "`findBy` is shorthand for waiting until a query finds an element. `waitFor` retries any callback, e.g. checking a mock was called or text changed." },
        { level: "intermediate", q: "What are `waitFor` best practices?", a: "One assertion per `waitFor`, no side effects inside, don't wrap `findBy` in it, and prefer `findBy` when waiting for an element." },
        { level: "advanced", q: "Testing a 300 ms debounce without slowing the suite?", a: "`vi.useFakeTimers()`, set up user-event with `advanceTimers: vi.advanceTimersByTime`, advance 300 ms inside `act`, assert, then restore real timers." },
        { level: "tricky", q: "A test passes but logs an act() warning about an update after it finished. What's wrong?", a: "An async update landed after the test's last await, so the final state was never asserted. Await the final UI with `findBy`/`waitFor`." }
      ],
      compare: { cols: ["", "Use when", "Returns"], rows: [
        ["`findBy…`", "Element will appear", "Promise<element>"],
        ["`waitFor(cb)`", "Any condition will become true", "Promise<cb result>"],
        ["`waitForElementToBeRemoved`", "Element will disappear", "Promise<void>"],
        ["`queryBy…`", "Element is absent now", "element | null"]
      ]},
      cheat: [
        "Appears later → `await findBy…`",
        "Other condition → `await waitFor(() => expect(...))`",
        "Disappears → `waitForElementToBeRemoved(() => queryBy…())`",
        "Defaults: poll 50 ms, timeout 1000 ms",
        "`waitFor`: one assertion, no side effects",
        "No sleeps; fake timers for debounce/setTimeout"
      ]
    },
    related: ["TEST-013", "TEST-007", "API-013", "HOOKS-027"]
  },

  "TEST-015": {
    tldr: "Playwright drives real Chromium, Firefox and WebKit (Safari's engine) to test full user journeys. It waits automatically, runs tests in parallel and records traces when something fails.",
    analogy: { icon: "🧑‍🤝‍🧑", text: "Three mystery shoppers using three different phones at once. Same shopping list, same checks; if one of them can't pay, you know which phone has the problem." },
    visual: { type: "tree", title: "One spec, every browser", root: { label: "npx playwright test", note: "reads playwright.config.js", children: [
      { label: "chromium", children: [{ label: "notes.spec.js" }] },
      { label: "firefox", children: [{ label: "notes.spec.js" }] },
      { label: "webkit", children: [{ label: "notes.spec.js" }] },
      { label: "mobile (Pixel 7)", children: [{ label: "notes.spec.js" }] }
    ]}},
    points: [
      "Setup: `npm init playwright@latest` installs `@playwright/test`, browsers and a config.",
      "**Locators** like RTL: `page.getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`. They auto-wait.",
      "**Web-first assertions** retry: `await expect(locator).toBeVisible()`, `toHaveText`, `toHaveCount`, `toHaveURL`.",
      "Config `projects` = which browsers/devices; `webServer` starts your Vite app before tests.",
      "Debug: `npx playwright test --ui`, `npx playwright codegen` (records clicks), `show-report`, traces."
    ],
    code: { file: "e2e/notes.spec.js", lang: "js", src: `// run: npx playwright test   (add --ui to watch it live)
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/notes');
});

test('create and search a note', async ({ page }) => {
  await page.getByRole('button', { name: 'New note' }).click();
  await page.getByLabel('Title').fill('Shopping list');
  await page.getByLabel('Body').fill('Eggs, bread, coffee');
  await page.getByRole('button', { name: 'Save' }).click();

  // web-first assertion: retries until true or times out
  await expect(page.getByRole('listitem')).toHaveCount(1);

  await page.getByPlaceholder('Search notes').fill('coffee');
  await expect(page.getByText('Shopping list')).toBeVisible();
});

test('shows an error when saving fails', async ({ page }) => {
  await page.route('**/api/notes', (route) => route.fulfill({ status: 500 }));
  await page.getByRole('button', { name: 'New note' }).click();
  await page.getByLabel('Title').fill('Oops');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText('Could not save');
});`, walk: [
      { lines: [4, 5], note: "Each test gets a fresh, isolated browser context; start on the notes page (relative to `baseURL`)." },
      { lines: [9, 10, 11, 12], note: "Locators find elements like a user and **auto-wait** until they're visible and enabled before acting." },
      { lines: [15], note: "`await expect(...)` retries until one list item exists (default 5 s)." },
      { lines: [22], note: "`page.route` intercepts the real browser request and fakes a 500, to test the error UI." },
      { lines: [26], note: "Assert the user sees the error message." }
    ]},
    output: "Running 8 tests using 4 workers\n  8 passed (6.2s)\n(2 tests × chromium, firefox, webkit, mobile)",
    mistakes: [
      { bad: `expect(await page.getByText('Saved').isVisible()).toBe(true);`, good: `await expect(page.getByText('Saved')).toBeVisible();`, why: "`isVisible()` checks once, right now. The web-first assertion retries until it's true, so no flakiness." },
      { bad: `await page.locator('#root > div:nth-child(2) > button.btn').click();`, good: `await page.getByRole('button', { name: 'Save' }).click();`, why: "Long CSS selectors break whenever the layout changes. Role locators survive redesigns." },
      { bad: `// playwright.config.js with only chromium\nprojects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]`, good: `projects: [\n  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n  { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n]`, why: "Cross-browser bugs (date inputs, CSS, Safari quirks) only show if you run more than one engine." }
    ],
    practice: [
      { level: "B", q: "Check the page title after `goto('/')` is “Recipe Box”.", a: "`await expect(page).toHaveTitle('Recipe Box');`" },
      { level: "I", q: "Write the config so Playwright starts Vite and runs on 3 browsers.", a: "Use `webServer` + `projects`.", code: `import { defineConfig, devices } from '@playwright/test';\nexport default defineConfig({\n  testDir: './e2e',\n  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n  ],\n  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI },\n});` },
      { level: "I", q: "Generate a first draft of a test by clicking through the app.", a: "`npx playwright codegen http://localhost:5173` records your actions as locator code." },
      { level: "C", q: "Many tests need a logged-in user. How do you avoid logging in through the UI every time?", a: "Log in once in a setup project, save `page.context().storageState({ path })`, and set `use: { storageState }` in dependent projects." }
    ],
    quiz: [
      { q: "Which engine represents Safari in Playwright?", options: ["chromium", "webkit", "gecko"], answer: 1, why: "WebKit is Safari's rendering engine." },
      { q: "Why don't Playwright tests need manual waits before clicks?", options: ["They run slowly on purpose", "Locators auto-wait for elements to be actionable", "Clicks are instant in tests"], answer: 1, why: "Actions wait for visible, stable, enabled elements." },
      { q: "What does `webServer` in the config do?", options: ["Deploys the app", "Starts your dev server before tests run", "Mocks all APIs"], answer: 1, why: "It runs the command and waits for the URL to respond." }
    ],
    rev: {
      sec30: "Playwright (`@playwright/test`) runs e2e tests in Chromium, Firefox and WebKit, configured via `projects`, with `webServer` to boot the app and `baseURL` for short `goto`s. Use role/label locators (auto-waiting) and web-first assertions (`await expect(loc).toBeVisible()`). `page.route` fakes network responses; UI mode, codegen and traces make debugging easy.",
      interview: [
        { level: "basic", q: "What is Playwright?", a: "Microsoft's end-to-end testing framework that drives real Chromium, Firefox and WebKit browsers with one API, plus a test runner, assertions and tooling." },
        { level: "intermediate", q: "What are web-first assertions?", a: "Async assertions like `await expect(locator).toHaveText('…')` that retry until the condition holds or time out, removing the need for manual waits." },
        { level: "intermediate", q: "How does Playwright avoid flaky clicks?", a: "Actionability checks: before clicking it waits until the element is attached, visible, stable, enabled and receives events." },
        { level: "advanced", q: "How do you speed up a large Playwright suite?", a: "Parallel workers and `fullyParallel`, sharding across CI machines, reusing auth via `storageState`, and mocking slow third-party calls with `page.route`." },
        { level: "tricky", q: "A test fails only in CI. How do you investigate?", a: "Enable `trace: 'on-first-retry'`, download the trace and open it with `npx playwright show-trace` to see each step's DOM, network and console." }
      ],
      compare: { cols: ["", "Playwright", "Cypress"], rows: [
        ["Browsers", "Chromium, Firefox, WebKit", "Chromium-family, Firefox (WebKit experimental)"],
        ["Style", "async/await", "Chained, queued commands"],
        ["Multi-tab / origin", "Yes", "Limited"],
        ["Parallel", "Built in, free", "Via Cypress Cloud or plugins"]
      ]},
      cheat: [
        "`npm init playwright@latest`",
        "`page.getByRole('button', { name: 'Save' }).click()`",
        "`await expect(locator).toBeVisible()` retries",
        "`projects`: chromium, firefox, webkit, devices",
        "`webServer` boots Vite; `baseURL` for `goto('/')`",
        "`page.route(url, r => r.fulfill(...))` to fake APIs",
        "`--ui`, `codegen`, `show-report`, traces"
      ]
    },
    related: ["TEST-004", "TEST-016", "PROD-011"]
  },

  "TEST-016": {
    tldr: "Cypress is a popular e2e tool you'll meet in existing codebases. Commands like `cy.get().click()` are queued and retried automatically; you don't `await` them.",
    analogy: { icon: "📝", text: "A shopping list handed to an assistant. You write all the steps first; the assistant does them in order and keeps retrying each one until the shelf has the item." },
    visual: { type: "flow", title: "How a Cypress test runs", steps: [
      { label: "Queue commands", detail: "`cy.visit`, `cy.get`, `.click`, `.should` are added to a queue, not run immediately." },
      { label: "Run in browser", detail: "The test runs inside the browser, next to your app." },
      { label: "Retry queries", detail: "`cy.get('[data-cy=cart-count]')` retries until found (4 s default)." },
      { label: "Retry assertions", detail: "`.should('have.text', '1')` re-queries and re-checks until it passes." },
      { label: "Time-travel", detail: "The runner shows a DOM snapshot per command to debug failures." }
    ]},
    points: [
      "**Commands are not promises**: no `async/await`. Use `.then()` to read a value.",
      "Find: `cy.get(selector)`, `cy.contains('button', 'Add')`. Assert: `.should('be.visible')`, `.should('have.text', '1')`.",
      "Network: `cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('products')` + `cy.wait('@products')`.",
      "Stable selectors: `data-cy` attributes, or add `@testing-library/cypress` for `cy.findByRole`.",
      "`npx cypress open` = interactive runner; `npx cypress run` = headless for CI. `baseUrl` lives in `cypress.config.js`."
    ],
    code: { file: "cypress/e2e/cart.cy.js", lang: "js", src: `// run: npx cypress open   (CI: npx cypress run)
describe('shopping cart', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('/');
    cy.wait('@getProducts');
  });

  it('adds a product to the cart', () => {
    cy.contains('button', 'Add Green tea').click();
    cy.get('[data-cy=cart-count]').should('have.text', '1');
  });

  it('removes it again', () => {
    cy.contains('button', 'Add Green tea').click();
    cy.get('[data-cy=cart-count]').should('have.text', '1');
    cy.contains('button', 'Remove').click();
    cy.get('[data-cy=cart-count]').should('have.text', '0');
  });

  it('reads a value with .then, not await', () => {
    cy.get('[data-cy=cart-count]').invoke('text').then((text) => {
      expect(text).to.equal('0');
    });
  });
});`, walk: [
      { lines: [4], note: "Stub the API with a JSON file from `cypress/fixtures/` and give the route an alias." },
      { lines: [5, 6], note: "Visit the app (relative to `baseUrl`) and wait until the stubbed request happened." },
      { lines: [10, 11], note: "Find a button by its text, click, then a retrying assertion on the badge." },
      { lines: [17, 18], note: "Each `.should` keeps retrying, so no manual waits after clicks." },
      { lines: [22, 23], note: "Need the actual value? Chain `.then()`. `const t = await cy.get(...)` doesn't work." }
    ]},
    output: "shopping cart\n  ✓ adds a product to the cart (412ms)\n  ✓ removes it again (530ms)\n  ✓ reads a value with .then, not await (98ms)",
    mistakes: [
      { bad: `const count = cy.get('[data-cy=cart-count]').invoke('text');\nif (count === '0') { /* never true */ }`, good: `cy.get('[data-cy=cart-count]').invoke('text').then((count) => {\n  // use count here\n});`, why: "Cypress commands return chainers, not values. They run later, from the queue." },
      { bad: `cy.contains('Add Green tea').click();\ncy.wait(3000);\ncy.get('[data-cy=cart-count]').should('have.text', '1');`, good: `cy.contains('Add Green tea').click();\ncy.get('[data-cy=cart-count]').should('have.text', '1');`, why: "Assertions already retry. Fixed `cy.wait(ms)` only makes tests slow; wait on aliases (`@route`) when needed." }
    ],
    practice: [
      { level: "B", q: "Assert the heading “Our teas” is visible.", a: "`cy.contains('h1', 'Our teas').should('be.visible');`" },
      { level: "I", q: "Simulate a 500 from `/api/products` and check the error message.", a: "Intercept with a status code.", code: `cy.intercept('GET', '/api/products', { statusCode: 500 }).as('fail');\ncy.visit('/');\ncy.wait('@fail');\ncy.contains('Could not load products').should('be.visible');` },
      { level: "I", q: "Translate to Playwright: `cy.get('[data-cy=cart-count]').should('have.text', '1')`.", a: "`await expect(page.getByTestId('cart-count')).toHaveText('1');` (with `testIdAttribute: 'data-cy'` in config)." },
      { level: "C", q: "Create a reusable `cy.login()` command.", a: "Add it in `cypress/support/commands.js`; use `cy.session` to cache the login between tests.", code: `Cypress.Commands.add('login', (email) => {\n  cy.session(email, () => {\n    cy.visit('/login');\n    cy.get('input[name=email]').type(email);\n    cy.contains('button', 'Log in').click();\n    cy.contains('Welcome').should('be.visible');\n  });\n});` }
    ],
    quiz: [
      { q: "How do you get the text of an element in Cypress?", options: ["`const t = await cy.get(el).invoke('text')`", "`cy.get(el).invoke('text').then(t => ...)`", "`cy.get(el).textContent`"], answer: 1, why: "Commands are queued; values arrive in `.then()`." },
      { q: "What does `cy.intercept(...).as('products')` let you do?", options: ["`cy.wait('@products')` until the request happens", "Skip the test", "Run it in Firefox"], answer: 0, why: "Aliases let you wait for and inspect specific requests." },
      { q: "Biggest difference from Playwright's style?", options: ["Cypress uses chained, queued commands instead of async/await", "Cypress has no assertions", "Cypress can't click"], answer: 0, why: "Playwright code awaits each step; Cypress builds a command queue." }
    ],
    rev: {
      sec30: "Cypress runs tests inside the browser with a queue of chainable commands (`cy.visit`, `cy.get`, `cy.contains`, `.click`, `.should`) that retry automatically; no async/await, read values in `.then()`. Stub network with `cy.intercept(...).as()` + `cy.wait('@alias')`, prefer `data-cy` or Testing Library selectors, and avoid fixed `cy.wait(ms)`. Common in existing codebases; Playwright is our default for new work.",
      interview: [
        { level: "basic", q: "How does Cypress handle waiting?", a: "Queries and assertions retry automatically until they pass or time out (4 s default), so you rarely need explicit waits." },
        { level: "intermediate", q: "Why can't you `await` Cypress commands?", a: "They're enqueued and run later by Cypress, returning chainers rather than promises. Use `.then()` or aliases to access values." },
        { level: "intermediate", q: "How do you mock an API in Cypress?", a: "`cy.intercept(method, url, response or { fixture })`, give it `.as('name')`, and `cy.wait('@name')` to sync with it." },
        { level: "advanced", q: "Cypress vs Playwright for a new project?", a: "Playwright: true multi-browser incl. WebKit, async/await, free parallelism, multi-tab support. Cypress has a great interactive runner and is fine to keep where it's already used." },
        { level: "tricky", q: "`cy.get('.item').should('have.length', 3)` passes, then you click and it fails with “detached from the DOM”. Why?", a: "React re-rendered and replaced the element between query and action. Re-query right before acting (chain from `cy.get`) instead of storing elements." }
      ],
      cheat: [
        "`cy.visit('/')`, `cy.get(sel)`, `cy.contains('button', 'Add')`",
        "`.click()`, `.type('tea{enter}')`, `.should('have.text', '1')`",
        "Commands queue + retry; no `await`, use `.then()`",
        "`cy.intercept(...).as('x')` + `cy.wait('@x')`",
        "Selectors: `data-cy` or `@testing-library/cypress`",
        "`cypress open` (interactive) · `cypress run` (CI)"
      ]
    },
    related: ["TEST-015", "TEST-004", "TEST-005"]
  },

  "TEST-017": {
    tldr: "Coverage shows which lines and branches your tests actually ran. Great for spotting untested code; a terrible goal on its own. 100% coverage can still miss bugs.",
    analogy: { icon: "🗺️", text: "A map of a supermarket with the aisles you walked highlighted. It shows where you **haven't** been, not whether you checked the milk's expiry date." },
    visual: { type: "compare", title: "What coverage can and can't tell you", left: { label: "Coverage tells you", tone: "good", points: [
      "Which files, lines and functions never ran",
      "Which `if/else` branches were skipped",
      "Where to add the next useful test",
      "Trends: is coverage slipping over time?"
    ]}, right: { label: "Coverage can't tell you", tone: "bad", points: [
      "Whether you asserted anything",
      "Whether the behaviour is correct",
      "Which user journeys are missing",
      "Whether tests survive refactors"
    ]}},
    points: [
      "Run `vitest run --coverage` with `@vitest/coverage-v8` installed. HTML report lands in `coverage/index.html`.",
      "Four numbers: **statements, branches, functions, lines**. Branches are the most telling.",
      "Set **thresholds** (e.g. 80%) in CI to stop big drops, not to chase 100%.",
      "Use `include` so files with no tests at all show up as 0% instead of being invisible.",
      "Spend effort on risky, valuable code (checkout, auth), not on trivial getters to bump the number."
    ],
    code: { file: "vite.config.js", lang: "js", src: `// npm i -D @vitest/coverage-v8     run: npx vitest run --coverage
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],      // terminal table + coverage/index.html
      include: ['src/**/*.{js,jsx}'],  // show untested files too
      exclude: ['src/main.jsx'],       // entry file, nothing to test
      thresholds: {
        lines: 80,
        branches: 75,
      },
    },
  },
});`, walk: [
      { lines: [1], note: "Coverage is a separate package. v8 uses the engine's built-in coverage: fast, no instrumentation step." },
      { lines: [11], note: "`text` prints a table in the terminal; `html` makes a clickable report with red/green lines." },
      { lines: [12, 13], note: "Measure all source files (untested ones show 0%), skip the entry point." },
      { lines: [14, 15, 16, 17], note: "CI fails if coverage drops below these numbers. A floor, not a target." }
    ]},
    output: "File            | % Stmts | % Branch | % Funcs | % Lines\ncart.js         |   100   |   100    |   100   |   100\nCheckout.jsx    |   86.4  |   66.7   |   80    |   86.4\nAll files       |   91.2  |   78.3   |   88.9  |   91.2",
    mistakes: [
      { bad: `test('covers Checkout', () => {\n  render(<Checkout />);\n  // no expect: 90% coverage, 0 checks\n});`, good: `test('shows total and enables Pay', async () => {\n  render(<Checkout />);\n  expect(await screen.findByText('Total: £11.00')).toBeInTheDocument();\n});`, why: "Running code isn't testing it. Coverage counts executed lines, not assertions." },
      { bad: `thresholds: { lines: 100, branches: 100, functions: 100 }`, good: `thresholds: { lines: 80, branches: 75 }`, why: "100% targets push people to test trivial code and write brittle tests. Pick a realistic floor and review what's uncovered." }
    ],
    practice: [
      { level: "B", q: "Which number shows you skipped the `else` path of an `if`?", a: "**Branches** coverage." },
      { level: "B", q: "Add an npm script for coverage.", a: "`\"coverage\": \"vitest run --coverage\"`" },
      { level: "I", q: "The report shows `applyDiscount` has 50% branch coverage. What do you do?", a: "Open the HTML report, find the red branch (e.g. expired coupon) and add a test for that case." },
      { level: "C", q: "Argue for or against “PRs must keep 100% coverage”.", a: "Against: it rewards quantity over quality and slows the team. Prefer a floor (e.g. 80%), review uncovered risky code, and require tests with bug fixes." }
    ],
    quiz: [
      { q: "A file has 100% line coverage. What do you know?", options: ["It has no bugs", "Every line ran during tests", "Every behaviour is asserted"], answer: 1, why: "Coverage measures execution, not correctness." },
      { q: "Which provider is the default fast option for Vitest?", options: ["`v8`", "`jest`", "`nyc-only`"], answer: 0, why: "`@vitest/coverage-v8` uses V8's built-in coverage." },
      { q: "Healthy use of thresholds?", options: ["Require 100%", "A floor that stops big drops in CI", "Never set any"], answer: 1, why: "Guard against regressions without chasing a vanity number." }
    ],
    rev: {
      sec30: "Coverage reports which statements, branches, functions and lines your tests executed. In Vitest: install `@vitest/coverage-v8`, run `vitest run --coverage`, set `include` so untested files appear, and use `thresholds` as a CI floor (≈80%). It finds gaps but doesn't prove correctness; 100% is not the goal.",
      interview: [
        { level: "basic", q: "What does code coverage measure?", a: "The percentage of statements, branches, functions and lines executed while the tests ran." },
        { level: "intermediate", q: "Line vs branch coverage?", a: "Line coverage counts lines that ran. Branch coverage checks each path of every decision (`if/else`, `&&`, ternaries) was taken, so it reveals untested cases." },
        { level: "intermediate", q: "What coverage target would you set?", a: "A pragmatic floor around 70-85% enforced in CI, plus judgement: high coverage on critical logic, less on trivial UI glue." },
        { level: "advanced", q: "How can you have 100% coverage and still have bugs?", a: "Tests may run code without asserting outcomes, miss input combinations, or mock away the real integration. Coverage shows execution, not verification." },
        { level: "tricky", q: "Coverage went up when you deleted untested code. Is that good?", a: "If the code was dead, yes. It shows coverage is a ratio, so it can be gamed; look at what's tested, not just the number." }
      ],
      cheat: [
        "`npm i -D @vitest/coverage-v8` → `vitest run --coverage`",
        "Metrics: statements, branches, functions, lines",
        "Branch coverage finds skipped `if/else` paths",
        "`include` shows untested files as 0%",
        "`thresholds` = CI floor (~80%), not a target",
        "Coverage ≠ correctness: run ≠ asserted"
      ]
    },
    related: ["TEST-006", "TEST-018", "PROD-010"]
  },

  "TEST-018": {
    tldr: "Good tests check what users see and do, never how the code works inside. Then you can rename, split or rewrite components and the tests stay green, until the actual behaviour breaks.",
    analogy: { icon: "🍕", text: "Judging a pizza by tasting it, not by watching which hand the chef used. Change the chef's technique and the taste test still works." },
    visual: { type: "compare", title: "Brittle vs refactor-proof", left: { label: "Tests implementation", tone: "bad", points: [
      "Reads state, props or hook internals",
      "Queries by CSS class or DOM structure",
      "Mocks your own child components",
      "Checks “`setQuery` was called”",
      "Breaks on every refactor"
    ]}, right: { label: "Tests behaviour", tone: "good", points: [
      "Queries by role, label, visible text",
      "Drives the UI with user-event",
      "Mocks only the network (MSW)",
      "Asserts what the user sees",
      "Breaks only when the feature breaks"
    ]}},
    points: [
      "Ask: **“would a user notice?”** If not, don't assert it.",
      "Each test is **independent**: own render, fresh QueryClient/store, `resetHandlers`. Order must not matter.",
      "Clear names: `'filters recipes as the user types'` beats `'test 3'`. Use Arrange-Act-Assert.",
      "**No sleeps, no random data, no real network**: deterministic tests or nobody trusts them.",
      "Bug fixed? Write the failing test **first**, then fix. It stays forever as a guard.",
      "Fewer, meaningful tests > many shallow ones. Delete tests that only re-check the code itself."
    ],
    code: { file: "RecipeSearch.test.jsx", lang: "jsx", src: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { RecipeSearch } from './RecipeSearch';

// Tests WHAT the user sees, not HOW it's built.
// Swap useState for useReducer, rename handlers, split components:
// this test still passes.
test('filters recipes as the user types', async () => {
  // Arrange
  const user = userEvent.setup();
  render(<RecipeSearch recipes={['Pancakes', 'Pasta', 'Soup']} />);

  // Act
  await user.type(screen.getByRole('searchbox', { name: 'Search recipes' }), 'pa');

  // Assert
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.queryByText('Soup')).not.toBeInTheDocument();
});

// ❌ Brittle: breaks on refactors even when the UI is fine
// expect(container.querySelector('.recipe-list__item--active')).toBeTruthy();
// expect(setQuery).toHaveBeenCalledWith('pa');
// expect(useRecipeStore.getState().query).toBe('pa');`, walk: [
      { lines: [4], note: "Import the real component; its internals are free to change." },
      { lines: [10, 11, 12], note: "Arrange: a user session and a render with plain props." },
      { lines: [15], note: "Act: find the `<input type=\"search\">` by role + label and type like a person." },
      { lines: [18, 19], note: "Assert only what's visible: two matches, Soup is hidden." },
      { lines: [22, 23, 24, 25], note: "Each of these would break on a rename or refactor while users notice nothing." }
    ]},
    output: "✓ filters recipes as the user types",
    mistakes: [
      { bad: `expect(container.firstChild).toMatchSnapshot();\n// 400-line snapshot nobody reads`, good: `expect(screen.getByRole('heading', { name: 'Pancakes' })).toBeInTheDocument();`, why: "Big snapshots fail on any markup change and get blindly updated. Assert the specific things that matter." },
      { bad: `let cart = [];\ntest('add', () => { cart.push('Tea'); ... });\ntest('count', () => { expect(cart).toHaveLength(1); });`, good: `test('count', () => {\n  const cart = ['Tea'];\n  expect(cart).toHaveLength(1);\n});`, why: "Shared mutable state makes tests depend on order. Each test sets up what it needs." },
      { bad: `test('shows a random greeting', () => {\n  render(<Greeting />); // uses Math.random / new Date()\n});`, good: `vi.useFakeTimers();\nvi.setSystemTime(new Date('2026-01-01T09:00:00'));\nrender(<Greeting />);\nexpect(screen.getByText('Good morning')).toBeInTheDocument();`, why: "Control time and randomness so the test gives the same answer every run." }
    ],
    practice: [
      { level: "B", q: "Rename this test: `test('works', ...)` for a cart badge.", a: "Describe the behaviour: `test('cart badge shows the number of items added', ...)`." },
      { level: "I", q: "Rewrite `expect(wrapper.find('.btn-danger').length).toBe(1)` the RTL way.", a: "`expect(screen.getByRole('button', { name: 'Delete note' })).toBeInTheDocument();`" },
      { level: "I", q: "A bug: discount applied twice. What's your first step?", a: "Write a test that reproduces it (fails), then fix the code until it passes. Keep the test." },
      { level: "C", q: "Review: a suite mocks `useState`, every child component and `fetch`. What would you change?", a: "Stop mocking React and own components; render real trees; replace fetch mocks with MSW; assert visible behaviour with role queries." }
    ],
    quiz: [
      { q: "A refactor changed no behaviour but 30 tests fail. What does that tell you?", options: ["The refactor is wrong", "The tests check implementation details", "Tests should be deleted"], answer: 1, why: "Behaviour tests only fail when user-visible behaviour changes." },
      { q: "Which assertion is most refactor-proof?", options: ["`expect(setQuery).toHaveBeenCalled()`", "`expect(container.querySelector('.active'))...`", "`expect(screen.getByRole('listitem')).toHaveTextContent('Pasta')`"], answer: 2, why: "It checks what the user sees, through accessible roles." },
      { q: "Tests pass alone but fail when run together. Likely cause?", options: ["Shared state leaking between tests", "Too many assertions", "Using `getByRole`"], answer: 0, why: "Tests must be isolated: reset mocks, handlers, stores and caches." }
    ],
    rev: {
      sec30: "Write tests that resemble real use: query by role/label/text, act with user-event, mock only the network with MSW, and assert visible outcomes. Keep tests isolated and deterministic (no shared state, sleeps, real network, random dates), name them by behaviour, follow AAA, avoid giant snapshots, and add a failing test for every bug before fixing it.",
      interview: [
        { level: "basic", q: "What's an implementation detail in testing?", a: "Anything users can't observe: state variable names, internal functions, CSS classes, component structure. Tests shouldn't depend on them." },
        { level: "intermediate", q: "How do you make tests survive refactors?", a: "Test through the public surface: rendered output and user interactions. Use accessible queries and keep mocks at the network boundary." },
        { level: "intermediate", q: "What makes a test flaky, and how do you fix it?", a: "Timing assumptions, shared state, real network, randomness. Fix with `findBy`/`waitFor`, isolation and resets, MSW, and fake timers or fixed seeds." },
        { level: "advanced", q: "Are snapshot tests good practice?", a: "Small, focused inline snapshots of stable output can help. Large component snapshots are brittle, rarely reviewed, and get updated blindly." },
        { level: "tricky", q: "Should you test that `useEffect` ran?", a: "No. Test the effect's visible result (data shown, title changed, request sent via MSW), not that React called your effect." }
      ],
      scenario: [
        { q: "Your team's tests break on every UI redesign. What do you propose?", a: "Replace class/structure selectors with role/label queries, stop mocking own components, assert visible text/state, and add MSW instead of fetch mocks. Migrate the flakiest files first." }
      ],
      cheat: [
        "Would a user notice? If not, don't assert it",
        "Query by role/label/text; act with user-event",
        "Mock only the network (MSW), never your own components",
        "Isolated + deterministic: no shared state, sleeps, randomness",
        "Name tests by behaviour; Arrange-Act-Assert",
        "Small targeted assertions over giant snapshots",
        "Bug → failing test first → fix"
      ]
    },
    related: ["TEST-007", "TEST-001", "TEST-013", "TEST-011"]
  }
};
