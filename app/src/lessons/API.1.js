export default {
  "API-001": {
    tldr: "An API (application programming interface) is a **contract** between two programs: \"send me this request, I promise this response\". Your React app asks; a server answers with data.",
    analogy: { icon: "🍽️", text: "A restaurant menu. You don't walk into the kitchen; you order from the menu (the contract) and the waiter brings exactly what was listed. The kitchen can change, the menu stays." },
    visual: { type: "flow", title: "One API call, end to end", steps: [
      { label: "React needs data", detail: "The contacts screen wants the list of contacts." },
      { label: "Request", detail: "It sends `GET /api/contacts`, the way the contract (API docs) says." },
      { label: "Server does the work", detail: "Reads the database, checks rules. React never sees how." },
      { label: "Response", detail: "Server replies `200 OK` with JSON: `[{ id: 1, name: \"Ana\" }]`." },
      { label: "UI updates", detail: "React stores the data in state and renders the list." }
    ]},
    points: [
      "An API defines **what you can ask for**, **how to ask** (URL, method, body) and **what comes back**.",
      "The caller doesn't care how the server is built: Node, .NET, Python. Only the contract matters.",
      "Web APIs speak **HTTP**; most send data as **JSON**.",
      "Browser features are APIs too: `fetch`, `localStorage`, `navigator.geolocation`.",
      "In .NET terms: your ASP.NET Core controllers *are* an API; React is just another client."
    ],
    code: { file: "contactsApi.js", lang: "js", src: `// The contract (from the API docs):
//   GET  /api/contacts      -> 200, [{ id, name, email }]
//   GET  /api/contacts/:id  -> 200, { id, name, email } | 404

// Our side of the contract: one function per endpoint
export async function getContacts() {
  const res = await fetch('/api/contacts');
  return res.json(); // [{ id: 1, name: 'Ana', email: 'ana@mail.com' }]
}

export async function getContact(id) {
  const res = await fetch(\`/api/contacts/\${id}\`);
  return res.json();
}`, walk: [
      { lines: [1, 2, 3], note: "The contract: the URL, the method and the shape of the reply. Both sides agree on it." },
      { lines: [6, 7, 8], note: "The client sends the request and reads the JSON answer." },
      { lines: [11, 12, 13], note: "A second endpoint. Components call these functions instead of raw URLs." }
    ]},
    mistakes: [
      { bad: `// component guesses the reply shape\nsetName(data.contact.fullName);`, good: `// follow the documented shape\nsetName(data.name);`, why: "The API docs are the contract. Guessing field names gives `undefined` errors the moment you're wrong." }
    ],
    practice: [
      { level: "B", q: "Name the three things an API contract tells you.", a: "How to ask (URL + method + body), what you can ask for, and what the response looks like." },
      { level: "B", q: "Is `localStorage` an API?", a: "Yes. It's a browser API: a contract of methods (`getItem`, `setItem`) you call without knowing how the browser stores data." },
      { level: "I", q: "Why wrap endpoints in functions like `getContacts()` instead of calling `fetch` in each component?", a: "One place to change if the URL or contract changes; components stay simple and easier to test." },
      { level: "C", q: "The backend team rewrites the server from PHP to .NET. What must change in React?", a: "Nothing, if the contract (URLs, methods, JSON shapes) stays the same. That's the point of an API." }
    ],
    quiz: [
      { q: "What is an API, in one phrase?", options: ["A database", "A contract between programs", "A React component", "A JavaScript library"], answer: 1, why: "It defines requests and responses; the implementation is hidden." },
      { q: "Does React need to know the server's language?", options: ["Yes, it must match", "No, only the contract matters"], answer: 1, why: "HTTP + JSON is language-neutral." },
      { q: "Which is NOT an API?", options: ["`fetch`", "`GET /api/contacts`", "A JSX `<div>`", "`localStorage`"], answer: 2, why: "A `<div>` is markup, not a contract you call." }
    ],
    rev: {
      sec30: "An API is a contract: send this request, get this response. Web APIs use HTTP and usually JSON. The client (React) only depends on the contract, not the server's code, so either side can change internally as long as the contract holds.",
      interview: [
        { level: "basic", q: "What is an API?", a: "A defined interface between programs: which requests you can make, how to format them, and what responses you get back." },
        { level: "basic", q: "Give an example of a non-web API.", a: "Browser APIs like `localStorage` or `fetch` itself, or a library's public functions." },
        { level: "intermediate", q: "Why put API calls in a separate module?", a: "Single source for URLs and response shapes, easy to mock in tests, and components stay focused on UI." },
        { level: "tricky", q: "Is React itself an API?", a: "Yes, in the broad sense: `useState`, `createRoot` and friends are its public API. In web talk, \"the API\" usually means the backend HTTP API." }
      ],
      cheat: [
        "API = contract between programs",
        "Defines: URL, method, request body, response shape",
        "Web APIs: HTTP + JSON",
        "Client depends on the contract, not the implementation",
        "Wrap endpoints in functions (`getContacts()`)",
        "Browser features (`fetch`, `localStorage`) are APIs too"
      ]
    },
    related: ["API-002", "WEB-002", "WEB-004"]
  },

  "API-002": {
    tldr: "REST is a style for web APIs: data lives at **URLs (resources)** like `/contacts/7`, and the **HTTP verb** says what to do with it: GET reads, POST creates, PUT/PATCH update, DELETE removes.",
    analogy: { icon: "📚", text: "A library shelf system. Every book has a fixed shelf address (URL). You don't invent new addresses for \"borrow\" or \"return\"; you do a different action at the same address." },
    visual: { type: "tree", title: "Resources as URLs", root: { label: "/api", children: [
      { label: "/contacts", note: "the collection", children: [
        { label: "GET", note: "list all" },
        { label: "POST", note: "create one" },
        { label: "/contacts/7", note: "one item", children: [
          { label: "GET", note: "read 7" },
          { label: "PATCH", note: "edit 7" },
          { label: "DELETE", note: "remove 7" }
        ]}
      ]},
      { label: "/contacts/7/notes", note: "nested resource" }
    ]}},
    points: [
      "**Resources are nouns**, in plural: `/contacts`, `/orders`. Not `/getContacts`.",
      "The **verb** (HTTP method) is the action. Same URL, different verb = different operation.",
      "**Collection** URL (`/contacts`) vs **item** URL (`/contacts/7`).",
      "**Stateless**: each request carries everything needed (auth token, params). The server doesn't remember the last call.",
      "Filters, sort and paging go in the **query string**: `/contacts?city=Pune&page=2`."
    ],
    code: { file: "contactsApi.js", lang: "js", src: `const BASE = '/api/contacts';

// READ the collection (with an optional filter)
export const listContacts = (city) =>
  fetch(city ? \`\${BASE}?city=\${encodeURIComponent(city)}\` : BASE)
    .then(r => r.json());

// READ one item
export const getContact = (id) =>
  fetch(\`\${BASE}/\${id}\`).then(r => r.json());

// CREATE in the collection
export const createContact = (contact) =>
  fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact),
  }).then(r => r.json());

// REMOVE one item
export const deleteContact = (id) =>
  fetch(\`\${BASE}/\${id}\`, { method: 'DELETE' });`, walk: [
      { lines: [1], note: "One resource, one base URL." },
      { lines: [4, 5, 6], note: "GET the collection. Filters go in the query string, encoded safely." },
      { lines: [9, 10], note: "GET one item by its id in the path." },
      { lines: [13, 14, 15, 16, 17, 18], note: "POST to the collection creates a new item; the body is JSON." },
      { lines: [21, 22], note: "DELETE on the item URL. Same URL as \"read one\", different verb." }
    ]},
    mistakes: [
      { bad: `fetch('/api/deleteContact?id=7')`, good: `fetch('/api/contacts/7', { method: 'DELETE' })`, why: "Verbs in URLs break REST conventions. A GET that deletes can be triggered by crawlers, prefetching or a cached link." }
    ],
    practice: [
      { level: "B", q: "Write the URL + verb to read contact 12.", a: "`GET /api/contacts/12`" },
      { level: "B", q: "Write the URL + verb to add a contact.", a: "`POST /api/contacts` with the contact as a JSON body." },
      { level: "I", q: "Design the URL for contact 12's notes, page 2.", a: "`GET /api/contacts/12/notes?page=2`" },
      { level: "C", q: "Why is \"stateless\" useful for scaling?", a: "Any server instance can handle any request, because nothing depends on memory of earlier calls. Load balancers can spread traffic freely." }
    ],
    quiz: [
      { q: "Which URL is RESTful?", options: ["`/api/getAllContacts`", "`/api/contacts`", "`/api/contact-list-fetch`"], answer: 1, why: "Plural noun for the resource; the verb comes from the HTTP method." },
      { q: "`PATCH /api/contacts/7` means…", options: ["Create contact 7", "Partially update contact 7", "Delete contact 7", "List contacts"], answer: 1, why: "PATCH = partial update of the item at that URL." },
      { q: "Where do filters like `city=Pune` usually go?", options: ["In the path", "In the query string", "In a cookie"], answer: 1, why: "Query strings refine a collection read: `/contacts?city=Pune`." }
    ],
    rev: {
      sec30: "REST models data as resources at URLs (plural nouns) and uses HTTP verbs as actions: GET read, POST create, PUT replace, PATCH partial update, DELETE remove. Collections vs items, query strings for filters, and stateless requests that carry their own auth.",
      interview: [
        { level: "basic", q: "What is a REST API?", a: "An HTTP API where resources have URLs and standard HTTP methods describe the operation, with stateless requests." },
        { level: "intermediate", q: "Collection vs item endpoint?", a: "`/contacts` represents the set (GET list, POST create); `/contacts/7` is one member (GET, PUT/PATCH, DELETE)." },
        { level: "intermediate", q: "What does stateless mean in REST?", a: "Each request is self-contained (auth, params). The server keeps no client session between calls." },
        { level: "advanced", q: "REST vs GraphQL in one line?", a: "REST has many endpoints with fixed shapes; GraphQL has one endpoint where the client asks for exactly the fields it needs." }
      ],
      compare: { cols: ["", "Collection `/contacts`", "Item `/contacts/7`"], rows: [
        ["GET", "List", "Read one"],
        ["POST", "Create", "Rarely used"],
        ["PUT / PATCH", "Rarely used", "Replace / edit"],
        ["DELETE", "Rarely used", "Remove"]
      ]},
      cheat: [
        "Resources = plural nouns: `/contacts`",
        "Verb = HTTP method, not part of the URL",
        "Collection `/contacts`, item `/contacts/:id`",
        "Filters, sort, paging in the query string",
        "Stateless: every request carries its own auth",
        "Nested: `/contacts/7/notes`"
      ]
    },
    related: ["API-003", "API-001", "API-008"]
  },

  "API-003": {
    tldr: "HTTP methods (verbs) tell the server what you want: **GET** read, **POST** create, **PUT** replace, **PATCH** change some fields, **DELETE** remove. Pick the one that matches the action.",
    analogy: { icon: "📝", text: "Editing a recipe card. GET = read it. POST = write a new card. PUT = rewrite the whole card. PATCH = cross out just the sugar amount. DELETE = throw the card away." },
    visual: { type: "compare", title: "Safe reads vs changing writes", left: { label: "Reads (safe)", tone: "good", points: [
      "`GET`: fetch data, no body",
      "Changes nothing on the server",
      "Can be cached and retried freely",
      "Params in the URL / query string"
    ]}, right: { label: "Writes (change data)", tone: "neutral", points: [
      "`POST`: create, not idempotent",
      "`PUT`: replace whole record, idempotent",
      "`PATCH`: update some fields",
      "`DELETE`: remove, idempotent",
      "Data goes in the JSON body"
    ]}},
    points: [
      "**GET** never changes data. Browsers, CDNs and prefetchers assume this.",
      "**POST** creates. Sending it twice can create **two** contacts (not idempotent).",
      "**PUT** sends the **full** record and replaces it. Sending it twice = same result (idempotent).",
      "**PATCH** sends **only the changed fields**: `{ phone: '555' }`.",
      "**DELETE** removes. Deleting twice still leaves it deleted (the 2nd call may return 404)."
    ],
    code: { file: "methods.js", lang: "js", src: `const url = '/api/contacts';
const json = { 'Content-Type': 'application/json' };

// GET: read (default method, no body)
await fetch(\`\${url}/7\`);

// POST: create a new contact
await fetch(url, { method: 'POST', headers: json,
  body: JSON.stringify({ name: 'Ana', email: 'ana@mail.com' }) });

// PUT: replace contact 7 with this full object
await fetch(\`\${url}/7\`, { method: 'PUT', headers: json,
  body: JSON.stringify({ id: 7, name: 'Ana', email: 'ana@new.com' }) });

// PATCH: change only the email
await fetch(\`\${url}/7\`, { method: 'PATCH', headers: json,
  body: JSON.stringify({ email: 'ana@new.com' }) });

// DELETE: remove contact 7
await fetch(\`\${url}/7\`, { method: 'DELETE' });`, walk: [
      { lines: [4, 5], note: "`fetch` uses GET when you pass no `method`." },
      { lines: [7, 8, 9], note: "POST to the collection with a JSON body. The server assigns the id." },
      { lines: [11, 12, 13], note: "PUT sends the whole record. Missing fields may be wiped." },
      { lines: [15, 16, 17], note: "PATCH sends just what changed." },
      { lines: [19, 20], note: "DELETE needs no body." }
    ]},
    mistakes: [
      { bad: `// change email only, with PUT\nbody: JSON.stringify({ email: 'new@mail.com' })`, good: `// PATCH for a partial change\nmethod: 'PATCH', body: JSON.stringify({ email: 'new@mail.com' })`, why: "PUT means \"replace everything\". Sending one field can wipe the name and phone on a strict server." },
      { bad: `fetch('/api/contacts?name=Ana', { method: 'GET', body: '...' })`, good: `fetch('/api/contacts?name=Ana')`, why: "GET requests can't have a body in `fetch` (it throws a TypeError). Put params in the query string." }
    ],
    practice: [
      { level: "B", q: "Mark a todo as done (only the `done` field changes). Which method?", a: "PATCH, with body `{ done: true }`." },
      { level: "B", q: "Which method does `fetch(url)` use by default?", a: "GET." },
      { level: "I", q: "A double-click on \"Save\" created two contacts. Why, and what helps?", a: "POST isn't idempotent, so two calls create two records. Disable the button while saving, or send an idempotency key the server checks." },
      { level: "C", q: "Which methods are idempotent?", a: "GET, PUT, DELETE (and HEAD, OPTIONS). POST is not; PATCH isn't guaranteed to be." }
    ],
    quiz: [
      { q: "You change only a contact's phone. Best method?", options: ["PUT", "PATCH", "POST", "GET"], answer: 1, why: "PATCH = partial update." },
      { q: "Which is NOT idempotent?", options: ["GET", "PUT", "DELETE", "POST"], answer: 3, why: "Each POST can create a new record." },
      { q: "Can a `fetch` GET request have a body?", options: ["Yes", "No, it throws"], answer: 1, why: "`fetch` rejects GET/HEAD with a body. Use query params." }
    ],
    rev: {
      sec30: "GET reads (safe, cacheable). POST creates (not idempotent). PUT replaces the whole resource (idempotent). PATCH updates some fields. DELETE removes (idempotent). Reads carry params in the URL; writes carry JSON in the body.",
      interview: [
        { level: "basic", q: "PUT vs PATCH?", a: "PUT replaces the entire resource with what you send; PATCH applies only the fields you send." },
        { level: "intermediate", q: "What does idempotent mean?", a: "Doing it once or many times leaves the server in the same state. PUT and DELETE are; POST isn't." },
        { level: "intermediate", q: "What is a \"safe\" method?", a: "One that doesn't change server state, like GET or HEAD. Tools may prefetch or retry them freely." },
        { level: "tricky", q: "Why is `GET /deleteContact?id=7` dangerous?", a: "Crawlers, link prefetchers or a cached URL can trigger it, deleting data without the user meaning to." }
      ],
      compare: { cols: ["Method", "Purpose", "Body", "Idempotent"], rows: [
        ["GET", "Read", "No", "Yes"],
        ["POST", "Create", "Yes", "No"],
        ["PUT", "Replace", "Yes (full)", "Yes"],
        ["PATCH", "Partial update", "Yes (some)", "Not guaranteed"],
        ["DELETE", "Remove", "Usually no", "Yes"]
      ]},
      cheat: [
        "GET read · POST create · PUT replace · PATCH edit · DELETE remove",
        "`fetch` defaults to GET",
        "GET has no body; use the query string",
        "POST is not idempotent: guard against double submits",
        "PUT = full object; PATCH = changed fields only",
        "Send JSON with `Content-Type: application/json`"
      ]
    },
    related: ["API-002", "API-009", "API-010", "API-011"]
  },

  "API-004": {
    tldr: "Every response has a **status code** (a 3-digit result). 2xx = it worked, 3xx = look elsewhere, 4xx = your request was wrong, 5xx = the server broke. Your UI should react differently to each.",
    analogy: { icon: "📦", text: "Parcel tracking. \"Delivered\" (2xx), \"moved to a new address\" (3xx), \"wrong address on label\" (4xx), \"warehouse closed\" (5xx). Each needs a different next step from you." },
    visual: { type: "layers", title: "Status code families", items: [
      { label: "5xx: server error", detail: "500 crash, 502/503 down. Not your fault: show \"try again later\", maybe retry." },
      { label: "4xx: client error", detail: "400 bad data, 401 log in, 403 not allowed, 404 not found, 409 conflict, 422 invalid." },
      { label: "3xx: redirect / cache", detail: "301/302 redirect, 304 use your cached copy. The browser handles these; rarely seen in React code." },
      { label: "2xx: success", detail: "200 OK, 201 Created, 204 No Content (no body to parse)." }
    ]},
    points: [
      "`fetch` only rejects on **network failure**. A 404 or 500 still resolves: check `res.ok` (true for 200-299).",
      "**401** = not logged in (send to login). **403** = logged in but not allowed (show \"no access\").",
      "**400 / 422** = validation problem: show the server's field errors in the form.",
      "**204** has **no body**: calling `res.json()` on it throws.",
      "**5xx**: show a friendly retry message; don't blame the user."
    ],
    code: { file: "useSaveContact.js", lang: "js", src: `export async function saveContact(contact) {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact),
  });

  if (res.status === 201) return res.json();          // created

  if (res.status === 401) {
    window.location.assign('/login');                 // not logged in
    return;
  }
  if (res.status === 403) throw new Error('You can\\'t add contacts.');
  if (res.status === 409) throw new Error('That email already exists.');
  if (res.status === 422) {
    const { errors } = await res.json();              // field errors
    throw Object.assign(new Error('Invalid data'), { errors });
  }
  if (res.status >= 500) throw new Error('Server problem, try again.');

  throw new Error(\`Unexpected status \${res.status}\`);
}`, walk: [
      { lines: [8], note: "201 Created: the happy path. Parse and return the new contact." },
      { lines: [10, 11, 12, 13], note: "401: the user isn't logged in, so send them to login." },
      { lines: [14, 15], note: "403 and 409: clear, specific messages the UI can show." },
      { lines: [16, 17, 18, 19], note: "422: the server sent field errors; pass them up for the form." },
      { lines: [20, 22], note: "5xx and anything else: a generic, honest message." }
    ]},
    mistakes: [
      { bad: `try {\n  const data = await (await fetch(url)).json();\n} catch { showError(); }`, good: `const res = await fetch(url);\nif (!res.ok) throw new Error(\`HTTP \${res.status}\`);\nconst data = await res.json();`, why: "`fetch` doesn't reject on 404/500. Without `res.ok` you parse an error page as data." },
      { bad: `const res = await fetch(url, { method: 'DELETE' });\nconst data = await res.json();`, good: `const res = await fetch(url, { method: 'DELETE' });\nif (res.status !== 204) await res.json();`, why: "204 No Content has an empty body; `res.json()` throws a SyntaxError." }
    ],
    practice: [
      { level: "B", q: "Which status means \"created\"?", a: "201 Created." },
      { level: "B", q: "What is `res.ok` for a 404?", a: "`false`. `ok` is true only for 200-299." },
      { level: "I", q: "401 vs 403: what does the UI do for each?", a: "401: redirect to login (or refresh the token). 403: stay put and show \"you don't have access\"." },
      { level: "C", q: "Which codes are worth auto-retrying?", a: "Network errors, 502/503/504 and 429 (after the `Retry-After` delay). Not 4xx like 400/404: retrying won't fix bad input." }
    ],
    quiz: [
      { q: "A `fetch` gets a 500. What happens?", options: ["The promise rejects", "It resolves with `res.ok === false`", "The page reloads"], answer: 1, why: "Only network failures reject; HTTP errors resolve." },
      { q: "Logged-in user opens an admin page and the API says…", options: ["401", "403", "404", "500"], answer: 1, why: "Known user, not allowed = 403 Forbidden." },
      { q: "Which code has no response body?", options: ["200", "201", "204", "422"], answer: 2, why: "204 No Content." }
    ],
    rev: {
      sec30: "2xx success (200, 201, 204), 3xx redirect, 4xx client error (400/422 bad input, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 429 rate limit), 5xx server error. `fetch` resolves on HTTP errors, so always check `res.ok` or `res.status`.",
      interview: [
        { level: "basic", q: "What do the status families mean?", a: "2xx success, 3xx redirect, 4xx the client sent something wrong, 5xx the server failed." },
        { level: "intermediate", q: "401 vs 403?", a: "401 means \"who are you?\" (missing or bad credentials). 403 means \"I know you, but you can't do this\"." },
        { level: "intermediate", q: "Does `fetch` throw on 404?", a: "No. It resolves with `ok: false`. It only rejects on network errors or aborts, so check `res.ok`." },
        { level: "tricky", q: "Why might `res.json()` throw after a successful DELETE?", a: "The server returned 204 No Content, so there's no JSON to parse." }
      ],
      predict: [
        { code: `const res = await fetch('/api/contacts/999'); // 404\nconsole.log(res.ok, res.status);`, answer: "`false 404`", why: "The promise resolves; `ok` reflects the 2xx range." }
      ],
      cheat: [
        "200 OK · 201 Created · 204 No Content",
        "400/422 bad input → show field errors",
        "401 → login · 403 → no access",
        "404 not found · 409 conflict · 429 slow down",
        "5xx → friendly retry message",
        "`fetch` doesn't reject on 4xx/5xx: check `res.ok`",
        "Don't call `res.json()` on 204"
      ]
    },
    related: ["API-014", "API-003", "API-006"]
  },

  "API-005": {
    tldr: "JSON is the text format APIs use for data. To **send**, turn your object into text with `JSON.stringify`. To **receive**, turn the text back into an object with `await res.json()`.",
    analogy: { icon: "✉️", text: "Mailing a recipe. You can't post the actual cake; you write the recipe as text (stringify), mail it, and the other side follows it to rebuild the cake (parse)." },
    visual: { type: "flow", title: "An object's round trip", steps: [
      { label: "JS object", detail: "`{ name: 'Ana', tags: ['work'] }` in your component." },
      { label: "JSON.stringify", detail: "Becomes the text `'{\"name\":\"Ana\",\"tags\":[\"work\"]}'`." },
      { label: "Over HTTP", detail: "Sent as the body with `Content-Type: application/json`." },
      { label: "Server replies", detail: "Sends JSON text back, e.g. the saved contact with its new `id`." },
      { label: "res.json()", detail: "Reads and parses the body into a JS object again." }
    ]},
    points: [
      "JSON keys need **double quotes**. No functions, `undefined`, comments or trailing commas.",
      "Set `Content-Type: application/json` when sending, or many servers ignore the body.",
      "`res.json()` returns a **promise**: always `await` it.",
      "**Dates** arrive as **strings** (`\"2026-01-05T10:00:00Z\"`). Convert with `new Date(s)` when needed.",
      "A body can be read **once**. Calling `res.json()` twice throws."
    ],
    code: { file: "AddNote.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function AddNote() {
  const [saved, setSaved] = useState(null);

  async function handleAdd() {
    const note = { title: 'Groceries', items: ['milk', 'eggs'], pinned: true };

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),             // object -> text
    });

    const data = await res.json();            // text -> object
    data.createdAt = new Date(data.createdAt); // string -> Date
    setSaved(data);
  }

  return (
    <div>
      <button onClick={handleAdd}>Add note</button>
      {saved && <p>Saved #{saved.id} at {saved.createdAt.toLocaleTimeString()}</p>}
    </div>
  );
}`, walk: [
      { lines: [7], note: "A normal JS object with an array and a boolean." },
      { lines: [11], note: "Tell the server the body is JSON." },
      { lines: [12], note: "`JSON.stringify` turns the object into text for the wire." },
      { lines: [15], note: "`res.json()` parses the reply back into an object (async)." },
      { lines: [16], note: "JSON has no Date type, so revive date strings yourself." }
    ]},
    output: "Click “Add note” → “Saved #42 at 10:15:03 AM”.",
    mistakes: [
      { bad: `fetch('/api/notes', { method: 'POST', body: note })`, good: `fetch('/api/notes', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(note),\n})`, why: "Passing an object sends the text `[object Object]`. Stringify it and set the header." },
      { bad: `const data = res.json();\nconsole.log(data.title);`, good: `const data = await res.json();\nconsole.log(data.title);`, why: "`res.json()` returns a Promise; without `await` you read `.title` of a Promise (undefined)." }
    ],
    practice: [
      { level: "B", q: "What does `JSON.stringify({ a: 1, b: undefined })` give?", a: "`'{\"a\":1}'`. Keys with `undefined` are dropped." },
      { level: "B", q: "Parse the string `'{\"done\":true}'` into an object.", a: "`JSON.parse('{\"done\":true}')` gives `{ done: true }`." },
      { level: "I", q: "Why does `saved.createdAt.getFullYear()` crash without conversion?", a: "It's a string after parsing. Call `new Date(saved.createdAt)` first." },
      { level: "C", q: "The server returns HTML (an error page) and `res.json()` throws. How do you guard?", a: "Check `res.ok` first, and/or check `res.headers.get('content-type')` includes `application/json` before parsing." }
    ],
    quiz: [
      { q: "How do you send an object as a JSON body?", options: ["`body: obj`", "`body: JSON.stringify(obj)`", "`body: obj.toString()`"], answer: 1, why: "The body must be a string; stringify turns the object into JSON text." },
      { q: "What does `res.json()` return?", options: ["An object", "A Promise of the parsed object", "A string"], answer: 1, why: "Reading the body is async." },
      { q: "A `Date` sent through JSON comes back as…", options: ["A Date", "A string", "A number"], answer: 1, why: "`JSON.stringify` calls `toISOString()`; parsing leaves it as a string." }
    ],
    rev: {
      sec30: "JSON is text. Send with `JSON.stringify(obj)` plus `Content-Type: application/json`; receive with `await res.json()`. JSON has no dates, functions or undefined: dates come back as ISO strings. A response body can only be read once.",
      interview: [
        { level: "basic", q: "`JSON.stringify` vs `JSON.parse`?", a: "`stringify` turns a value into JSON text; `parse` turns JSON text back into a value." },
        { level: "intermediate", q: "Why set `Content-Type: application/json`?", a: "It tells the server how to read the body. Without it, frameworks like ASP.NET Core may reject or ignore it (415 or empty model)." },
        { level: "intermediate", q: "How are dates handled in JSON?", a: "As ISO 8601 strings. The client must convert them with `new Date()` or a date library." },
        { level: "tricky", q: "Why does calling `res.json()` twice fail?", a: "The body is a stream that can be consumed once. Use `res.clone()` if you really need to read it twice." }
      ],
      predict: [
        { code: `console.log(JSON.stringify({ name: 'Ana', save() {}, age: undefined }));`, answer: "`{\"name\":\"Ana\"}`", why: "Functions and undefined values are skipped." }
      ],
      cheat: [
        "Send: `body: JSON.stringify(obj)`",
        "Header: `'Content-Type': 'application/json'`",
        "Receive: `const data = await res.json()`",
        "Double-quoted keys; no functions, undefined, comments",
        "Dates arrive as ISO strings",
        "A body can be read only once"
      ]
    },
    related: ["WEB-038", "API-006", "API-009"]
  },

  "API-006": {
    tldr: "`fetch` is the browser's built-in way to call an API. In React, load data in a `useEffect` (or an event handler), keep the result in state, and handle **loading** and **errors**.",
    analogy: { icon: "🌤️", text: "Checking the weather app on arrival. When you open the screen (mount), it asks the forecast service once, shows a spinner while waiting, then shows the result or \"couldn't load\"." },
    visual: { type: "timeline", title: "A fetch inside a component", frames: [
      { label: "1st render", state: "loading = true, contacts = []", note: "Screen shows a spinner." },
      { label: "Effect runs", state: "fetch('/api/contacts') sent", note: "After React paints, the effect starts the request." },
      { label: "Response", state: "res.ok → await res.json()", note: "Parse the body." },
      { label: "setState", state: "contacts = [3 items], loading = false", note: "React re-renders with data." },
      { label: "Or error", state: "error = 'HTTP 500', loading = false", note: "Show a message instead." }
    ]},
    points: [
      "Fetch on **load** in `useEffect`; fetch on a **user action** (save, delete) in the event handler.",
      "Effects can't be `async` directly: define an `async` function inside and call it.",
      "Use an **ignore flag** (or AbortController, see API-023) in cleanup so a late reply can't overwrite newer data.",
      "In dev, **Strict Mode** runs effects twice, so you'll see two requests. Production sends one.",
      "Real apps often use **TanStack Query** for caching, retries and dedup; learn raw `fetch` first."
    ],
    code: { file: "Contacts.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch('/api/contacts');
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        if (!ignore) setContacts(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, []);

  if (loading) return <p>Loading contacts…</p>;
  if (error) return <p role="alert">Couldn't load: {error}</p>;
  return (
    <ul>
      {contacts.map(c => <li key={c.id}>{c.name}</li>)}
    </ul>
  );
}`, walk: [
      { lines: [4, 5, 6], note: "Three pieces of state: the data, a loading flag, an error." },
      { lines: [11, 13, 14, 15], note: "An async function inside the effect: fetch, check `res.ok`, parse." },
      { lines: [9, 16, 25], note: "If the component unmounts first, `ignore` blocks stale state updates." },
      { lines: [17, 18, 19, 20, 21], note: "Errors and the end of loading are always handled." },
      { lines: [26], note: "`[]` = run once after the first render (twice in dev Strict Mode)." },
      { lines: [28, 29, 30], note: "Render loading, error, or the list." }
    ]},
    output: "“Loading contacts…”, then a list: Ana, Ben, Chen. On a 500: “Couldn't load: HTTP 500”.",
    mistakes: [
      { bad: `useEffect(async () => {\n  const res = await fetch(url);\n}, []);`, good: `useEffect(() => {\n  async function load() { const res = await fetch(url); }\n  load();\n}, []);`, why: "An async function returns a Promise, but an effect must return nothing or a cleanup function." },
      { bad: `function Contacts() {\n  fetch(url).then(r => r.json()).then(setContacts);\n  ...`, good: `useEffect(() => {\n  fetch(url).then(r => r.json()).then(setContacts);\n}, []);`, why: "Fetching in the render body runs on every render; `setContacts` re-renders, which fetches again: an infinite loop." }
    ],
    practice: [
      { level: "B", q: "Show “No contacts yet” when the list is empty.", a: "After the error check: `if (contacts.length === 0) return <p>No contacts yet</p>;`" },
      { level: "B", q: "Why do you see two requests in the Network tab in dev?", a: "Strict Mode mounts, unmounts and remounts to test cleanup. Production makes one request." },
      { level: "I", q: "Add a **Reload** button that fetches again.", a: "Keep a `reloadKey` state, add it to the effect deps, and `setReloadKey(k => k + 1)` on click." },
      { level: "C", q: "Turn this into a reusable `useFetch(url)` hook returning `{ data, loading, error }`.", a: "Move the state and effect into `function useFetch(url)`, put `url` in the deps, and return the three values." }
    ],
    quiz: [
      { q: "Where do you fetch data needed when a screen opens?", options: ["In the component body", "In `useEffect`", "In `useMemo`"], answer: 1, why: "Effects run after render, once per dependency change." },
      { q: "Why the `ignore` flag?", options: ["To skip the first render", "So a stale response can't set state after cleanup", "To cache the response"], answer: 1, why: "The cleanup flips it, so late replies are dropped." },
      { q: "Can you write `useEffect(async () => {...})`?", options: ["Yes", "No, the effect would return a Promise"], answer: 1, why: "Effects must return undefined or a cleanup function." }
    ],
    rev: {
      sec30: "Use `fetch` in `useEffect` for data the screen needs on load, and in handlers for user actions. Track data, loading and error state, check `res.ok`, and use a cleanup (ignore flag or AbortController) to drop stale responses. Strict Mode doubles the request in dev only.",
      interview: [
        { level: "basic", q: "How do you fetch data on mount in React?", a: "`useEffect` with `[]` deps, an async function inside that fetches and calls the state setter." },
        { level: "intermediate", q: "Why can't the effect callback be async?", a: "Async functions return a Promise; React expects nothing or a cleanup function from an effect." },
        { level: "intermediate", q: "What's the race-condition risk when fetching on prop change?", a: "An older, slower request can resolve after a newer one and overwrite fresh data. Fix with an ignore flag or abort in the cleanup." },
        { level: "advanced", q: "Why do teams use TanStack Query instead of raw fetch-in-effect?", a: "It adds caching, dedup, background refetch, retries and loading/error state, and avoids request waterfalls you'd otherwise hand-roll." },
        { level: "tricky", q: "Your effect fetches twice in dev. Bug?", a: "No. Strict Mode remounts once to check cleanup. If double requests cause harm, your cleanup is missing, not Strict Mode's fault." }
      ],
      debug: [
        { code: `useEffect(() => {\n  fetch('/api/contacts')\n    .then(r => r.json())\n    .then(setContacts);\n});`, fix: `useEffect(() => {\n  fetch('/api/contacts')\n    .then(r => r.json())\n    .then(setContacts);\n}, []);`, why: "No dependency array: the effect runs after every render, and each `setContacts` triggers another render and fetch." }
      ],
      cheat: [
        "Load data in `useEffect`; actions in handlers",
        "Async function inside the effect, then call it",
        "Check `res.ok` before `res.json()`",
        "Track `data`, `loading`, `error`",
        "Cleanup: ignore flag or `AbortController`",
        "Strict Mode: 2 requests in dev, 1 in prod"
      ]
    },
    related: ["HOOKS-005", "API-013", "API-023", "HOOKS-025"]
  },

  "API-007": {
    tldr: "Axios is a popular HTTP library. It parses JSON for you, **throws on 4xx/5xx**, and lets you create a configured **instance** (base URL, headers, timeout) that the whole app shares.",
    analogy: { icon: "☕", text: "A café loyalty card with your usual order saved. Instead of repeating \"oat milk, large, no sugar\" every time (fetch options), the barista (axios instance) already knows your defaults." },
    visual: { type: "compare", title: "fetch vs axios", left: { label: "fetch (built in)", tone: "neutral", points: [
      "No install, in every browser",
      "Call `res.json()` yourself",
      "Resolves on 404/500: check `res.ok`",
      "Stringify body + set header yourself",
      "Timeout via `AbortSignal.timeout()`"
    ]}, right: { label: "axios (library)", tone: "good", points: [
      "`npm install axios`",
      "JSON parsed into `res.data`",
      "Rejects on non-2xx status",
      "Objects sent as JSON automatically",
      "Instances, `timeout`, interceptors"
    ]}},
    points: [
      "Create one **instance** with `axios.create({ baseURL, timeout, headers })` and import it everywhere.",
      "The parsed body is in **`res.data`**, not `res.json()`.",
      "On failure check **`err.response`** (server answered with an error status), else **`err.request`** (no reply: network/timeout).",
      "`axios.isAxiosError(err)` tells axios errors from bugs in your own code.",
      "Interceptors (API-021/022) add tokens or handle 401s in one place."
    ],
    code: { file: "api.js", lang: "js", src: `import axios from 'axios';

// One shared, configured client
export const api = axios.create({
  baseURL: '/api',
  timeout: 8000,                       // ms; then the request fails
  headers: { Accept: 'application/json' },
});

export async function getContacts() {
  const res = await api.get('/contacts', { params: { sort: 'name' } });
  return res.data;                     // already parsed JSON
}

export async function addContact(contact) {
  const { data } = await api.post('/contacts', contact); // auto JSON
  return data;
}

export function describeError(err) {
  if (!axios.isAxiosError(err)) return 'Unexpected error';
  if (err.response) {                  // server replied 4xx/5xx
    return \`Server said \${err.response.status}\`;
  }
  if (err.code === 'ECONNABORTED') return 'Request timed out';
  return 'Network problem';            // no response at all
}`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "`axios.create` builds a client with shared defaults." },
      { lines: [11], note: "`params` builds the query string: `/api/contacts?sort=name`." },
      { lines: [12], note: "The JSON is already parsed into `res.data`." },
      { lines: [16], note: "Pass a plain object; axios stringifies it and sets `Content-Type`." },
      { lines: [21, 22, 23, 24], note: "`err.response` exists when the server answered with an error status." },
      { lines: [25, 26], note: "No response: timeout (`ECONNABORTED`) or network failure." }
    ]},
    mistakes: [
      { bad: `const res = await api.get('/contacts');\nconst data = await res.json();`, good: `const { data } = await api.get('/contacts');`, why: "Axios responses have no `.json()` method; the parsed body is already in `data`." },
      { bad: `catch (err) {\n  setError(err.response.data.message);\n}`, good: `catch (err) {\n  setError(err.response?.data?.message ?? 'Network problem');\n}`, why: "On network errors or timeouts there's no `err.response`, so this crashes inside your error handler." }
    ],
    practice: [
      { level: "B", q: "GET `/api/contacts/7` with the instance above.", a: "`const { data } = await api.get('/contacts/7');`" },
      { level: "B", q: "Where is the HTTP status on a successful axios response?", a: "`res.status` (e.g. 200)." },
      { level: "I", q: "PATCH contact 7's phone.", a: "`await api.patch('/contacts/7', { phone: '555-0101' });`" },
      { level: "C", q: "Make axios treat 404 as a success (not throw).", a: "Pass `validateStatus: s => s < 500` in the request config; then check `res.status` yourself." }
    ],
    quiz: [
      { q: "With axios, a 404 response…", options: ["Resolves with `ok: false`", "Rejects; status is in `err.response.status`", "Is silently ignored"], answer: 1, why: "By default axios rejects for any status outside 2xx." },
      { q: "Where's the parsed JSON body?", options: ["`res.json()`", "`res.body`", "`res.data`"], answer: 2, why: "Axios parses JSON into `data`." },
      { q: "`err.response` is undefined. What happened?", options: ["The server returned 500", "No response arrived (network or timeout)", "The JSON was invalid"], answer: 1, why: "`response` only exists if the server replied." }
    ],
    rev: {
      sec30: "Axios wraps HTTP with nicer defaults: auto JSON in and out (`res.data`), rejection on non-2xx, timeouts, and `axios.create` instances with a shared baseURL and headers. Errors: `err.response` = server replied with an error; `err.request` without response = network/timeout.",
      interview: [
        { level: "basic", q: "Why use axios over fetch?", a: "Automatic JSON handling, rejection on HTTP errors, built-in timeout, instances and interceptors. Fetch needs more boilerplate." },
        { level: "intermediate", q: "What is an axios instance?", a: "A client made with `axios.create(config)` that carries defaults like `baseURL`, `timeout` and headers for every request it makes." },
        { level: "intermediate", q: "How do you tell a 4xx from a network failure in axios?", a: "`err.response` exists for HTTP errors (read `err.response.status`). Without it, the request never got a reply." },
        { level: "advanced", q: "Can you cancel an axios request?", a: "Yes: pass `signal: controller.signal` from an `AbortController`; the old `CancelToken` is deprecated." },
        { level: "tricky", q: "Is axios required for interceptors-like behaviour?", a: "No. You can wrap `fetch` in your own `apiFetch()` function to add headers and handle 401s. Axios just provides the hooks." }
      ],
      cheat: [
        "`axios.create({ baseURL, timeout, headers })`",
        "Body is `res.data` (already parsed)",
        "Rejects on non-2xx by default",
        "`err.response.status` = server error status",
        "No `err.response` → network or timeout",
        "`params: {}` builds the query string",
        "Cancel with `signal: controller.signal`"
      ]
    },
    related: ["API-006", "API-021", "API-014"]
  },

  "API-008": {
    tldr: "GET requests read data. A **list** screen fetches the collection (`/contacts`); a **detail** screen fetches one record by id (`/contacts/7`) and refetches when the id changes.",
    analogy: { icon: "🎵", text: "A music app. The playlist screen loads all songs' titles; tapping one opens a song page that loads that song's lyrics and details." },
    visual: { type: "flow", title: "List → detail", steps: [
      { label: "List screen", detail: "`GET /api/contacts` returns light rows: id + name." },
      { label: "User clicks Ana", detail: "A `<Link>` goes to `/contacts/7`." },
      { label: "Read the id", detail: "`useParams()` returns `{ id: '7' }` (a string)." },
      { label: "Detail GET", detail: "`GET /api/contacts/7` returns the full record." },
      { label: "id changes?", detail: "Effect deps `[id]` refetch for the new contact." }
    ]},
    points: [
      "Lists usually return **summaries**; the detail endpoint returns the **full** record.",
      "Put the **id in the effect's dependencies**, or the detail page shows the old contact after navigation.",
      "Handle **404** on detail: show \"Contact not found\", not a crash.",
      "Route params are **strings**: `'7'`, not `7`.",
      "Search/filter/page values belong in the query string (see API-024, API-025)."
    ],
    code: { file: "ContactDetail.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

export default function ContactDetail() {
  const { id } = useParams();            // '7'
  const [contact, setContact] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let ignore = false;
    setStatus('loading');

    fetch(\`/api/contacts/\${id}\`)
      .then(res => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(data => {
        if (ignore) return;
        setContact(data);
        setStatus(data ? 'done' : 'notfound');
      })
      .catch(() => !ignore && setStatus('error'));

    return () => { ignore = true; };
  }, [id]);                               // refetch when id changes

  if (status === 'loading') return <p>Loading…</p>;
  if (status === 'notfound') return <p>Contact not found. <Link to="/contacts">Back</Link></p>;
  if (status === 'error') return <p role="alert">Something went wrong.</p>;
  return (
    <article>
      <h2>{contact.name}</h2>
      <p>{contact.email} · {contact.phone}</p>
    </article>
  );
}`, walk: [
      { lines: [5], note: "Read the id from the URL `/contacts/:id` (React Router 7)." },
      { lines: [13], note: "GET the single record." },
      { lines: [15, 16, 17], note: "404 is a normal outcome, not an exception. Other errors throw." },
      { lines: [10, 20, 26], note: "Ignore late replies if the user already moved to another contact." },
      { lines: [27], note: "`[id]`: a new id means a new fetch." },
      { lines: [29, 30, 31], note: "One status string drives loading, not-found and error screens." }
    ]},
    mistakes: [
      { bad: `useEffect(() => {\n  fetch(\`/api/contacts/\${id}\`)...\n}, []);`, good: `useEffect(() => {\n  fetch(\`/api/contacts/\${id}\`)...\n}, [id]);`, why: "With `[]` the effect runs once. Going from contact 7 to 8 keeps showing 7." },
      { bad: `const contact = contacts.find(c => c.id === id);`, good: `const contact = contacts.find(c => c.id === Number(id));`, why: "`useParams` gives strings; `7 === '7'` is false, so nothing is found." }
    ],
    practice: [
      { level: "B", q: "Write the list request for all contacts sorted by name.", a: "`GET /api/contacts?sort=name`" },
      { level: "B", q: "Render each contact as a link to its detail page.", a: "Map each row to a `<Link>` whose `to` is `/contacts/` plus the id.", code: `{contacts.map(c => (\n  <li key={c.id}>\n    <Link to={\`/contacts/\${c.id}\`}>{c.name}</Link>\n  </li>\n))}` },
      { level: "I", q: "Why reset status to `'loading'` at the start of the effect?", a: "Otherwise moving from contact 7 to 8 briefly shows 7's details under 8's URL." },
      { level: "C", q: "Show the name instantly from the list while details load.", a: "Pass the row in router state (`<Link state={{ preview: c }}>`) or keep a shared cache (TanStack Query `initialData`) and render it until the full record arrives." }
    ],
    quiz: [
      { q: "Detail page shows the old contact after clicking another. Most likely cause?", options: ["Missing `key` on the list", "`id` missing from effect deps", "Wrong HTTP method"], answer: 1, why: "The effect never re-runs for the new id." },
      { q: "What type is `id` from `useParams()`?", options: ["number", "string", "object"], answer: 1, why: "URL parts are always strings." },
      { q: "Detail GET returns 404. Best UI?", options: ["Crash to an error boundary", "\"Contact not found\" with a back link", "Retry forever"], answer: 1, why: "404 is an expected result; tell the user and offer a way back." }
    ],
    rev: {
      sec30: "GET the collection for list screens and one item by id for detail screens. Put the id (and any query values) in the effect deps so changes refetch, guard against stale replies, convert string params when comparing, and treat 404 as a normal \"not found\" state.",
      interview: [
        { level: "basic", q: "How do you load a detail record based on the URL?", a: "Read the id with `useParams()`, then GET `/api/contacts/:id` in an effect that depends on `id`." },
        { level: "intermediate", q: "Why might list and detail endpoints return different fields?", a: "Lists send light summaries to keep payloads small; the detail endpoint sends everything for one record." },
        { level: "intermediate", q: "How do you handle a 404 on a detail page?", a: "Treat it as a state (`notfound`) and render a friendly message, rather than throwing." },
        { level: "advanced", q: "How can you avoid a fetch waterfall between list and detail?", a: "Reuse cached list data as placeholder, prefetch on hover, or use TanStack Query / React Router loaders (data or framework mode only) so data loads in parallel with code." }
      ],
      cheat: [
        "List: `GET /contacts` · Detail: `GET /contacts/:id`",
        "Detail effect deps: `[id]`",
        "Params are strings: `Number(id)` to compare",
        "404 → \"not found\" state, not a crash",
        "Reset to loading when the id changes",
        "Ignore stale replies in cleanup"
      ]
    },
    related: ["ROUTE-010", "API-006", "API-024", "API-030"]
  },

  "API-009": {
    tldr: "POST creates a record. Send the form data as JSON to the collection URL, wait for **201 Created**, then add the record the server sends back (with its new `id`) to your list.",
    analogy: { icon: "🛍️", text: "Placing an order. You hand over the form, the shop answers \"Order #1042 created\". You use their order number, not one you made up." },
    visual: { type: "flow", title: "Creating a contact", steps: [
      { label: "User submits form", detail: "`onSubmit` fires; call `e.preventDefault()`." },
      { label: "Disable Save", detail: "`saving = true` so a double-click can't send two POSTs." },
      { label: "POST /api/contacts", detail: "Body: `{ name, email }` as JSON." },
      { label: "201 Created", detail: "Server replies with `{ id: 42, name, email }`." },
      { label: "Update the list", detail: "`setContacts(list => [...list, created])`, then clear the form." }
    ]},
    points: [
      "POST to the **collection** (`/contacts`). The **server** assigns the `id`.",
      "Use the record **returned by the server**: it has the real id and any defaults.",
      "**Disable the button** while saving: POST isn't idempotent, two clicks = two contacts.",
      "On **400/422**, show the server's field errors next to the inputs.",
      "React 19 alternative: a form `action` with `useActionState` (HOOKS-018) tracks pending state for you."
    ],
    code: { file: "AddContact.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function AddContact({ onCreated }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(\`Could not save (\${res.status})\`);
      const created = await res.json();       // { id: 42, ... }
      onCreated(created);
      setForm({ name: '', email: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={change} required />
      <input name="email" type="email" value={form.email} onChange={change} required />
      <button disabled={saving}>{saving ? 'Saving…' : 'Add contact'}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
// Parent: onCreated={c => setContacts(list => [...list, c])}`, walk: [
      { lines: [11, 12, 13], note: "Stop the page reload, mark as saving, clear old errors." },
      { lines: [15, 16, 17, 18, 19], note: "POST the form state as JSON to the collection." },
      { lines: [20, 21], note: "Check the status, then read the created record with its server id." },
      { lines: [22, 23], note: "Hand it to the parent and reset the form." },
      { lines: [27], note: "`finally` re-enables the button on success and failure." },
      { lines: [35, 40], note: "Disabled while saving; the parent appends with a functional update." }
    ]},
    output: "Type “Ana / ana@mail.com”, click “Add contact” → button shows “Saving…”, then Ana appears in the list and the form clears.",
    mistakes: [
      { bad: `onCreated({ id: Date.now(), ...form });\nawait fetch('/api/contacts', { method: 'POST', ... });`, good: `const created = await res.json();\nonCreated(created);`, why: "A made-up id won't match the database, so later edits or deletes hit the wrong (or no) record." },
      { bad: `<button onClick={handleSubmit}>Add</button>`, good: `<button disabled={saving}>{saving ? 'Saving…' : 'Add'}</button>`, why: "Without disabling, an impatient double-click sends two POSTs and creates duplicates." }
    ],
    practice: [
      { level: "B", q: "Which status should a successful create return?", a: "201 Created, usually with the new record in the body." },
      { level: "B", q: "Why `setContacts(list => [...list, c])` instead of `push`?", a: "State must be replaced, not mutated; a new array makes React re-render." },
      { level: "I", q: "The server returns `422 { errors: { email: 'Taken' } }`. Show it under the email input.", a: "On 422, `const { errors } = await res.json(); setFieldErrors(errors);` and render `{fieldErrors.email && <small>{fieldErrors.email}</small>}`." },
      { level: "C", q: "Rewrite with React 19's `useActionState`.", a: "`const [error, submit, pending] = useActionState(async (prev, fd) => { ...POST Object.fromEntries(fd)...; return null; }, null)` then `<form action={submit}>` and `disabled={pending}`." }
    ],
    quiz: [
      { q: "Where do you POST a new contact?", options: ["`/api/contacts/new`", "`/api/contacts`", "`/api/contacts/42`"], answer: 1, why: "POST to the collection; the server creates the id." },
      { q: "Which id should the UI use for the new contact?", options: ["`Date.now()`", "The array length", "The one in the server's response"], answer: 2, why: "Only the server's id matches the database." },
      { q: "Why disable the button while saving?", options: ["It looks nicer", "To prevent duplicate POSTs", "Fetch requires it"], answer: 1, why: "POST isn't idempotent." }
    ],
    rev: {
      sec30: "POST to the collection with a JSON body, expect 201 with the created record, and add that record (with its server id) to state immutably. Disable submit while pending to avoid duplicate creates, and surface 400/422 validation errors per field.",
      interview: [
        { level: "basic", q: "How do you create a record from a React form?", a: "On submit, prevent default, POST the form data as JSON, then add the returned record to state." },
        { level: "intermediate", q: "How do you prevent duplicate submissions?", a: "Disable the button while a request is pending; for stronger safety, send an idempotency key the server deduplicates." },
        { level: "intermediate", q: "Why use the server's response rather than the form data?", a: "It includes the real id, timestamps and server-side defaults or normalisation." },
        { level: "advanced", q: "What does `useActionState` add here?", a: "It runs the async action from a form `action`, gives you the returned state (like errors) and a `pending` flag, without manual loading state." }
      ],
      debug: [
        { code: `async function handleSubmit(e) {\n  await fetch('/api/contacts', { method: 'POST', body: JSON.stringify(form) });\n}`, fix: `async function handleSubmit(e) {\n  e.preventDefault();\n  await fetch('/api/contacts', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(form),\n  });\n}`, why: "Without `preventDefault` the page reloads mid-request; without the header many servers reject the body (415)." }
      ],
      cheat: [
        "`POST /collection` + JSON body",
        "Success = 201 + created record",
        "Use the server's id, never a fake one",
        "`e.preventDefault()` in `onSubmit`",
        "Disable submit while saving",
        "Append immutably: `[...list, created]`",
        "422 → show field errors"
      ]
    },
    related: ["API-003", "EVT-020", "HOOKS-018", "API-027"]
  },

  "API-010": {
    tldr: "Both update a record. **PUT** sends the **whole** record and replaces it. **PATCH** sends **only the fields that changed**. Then swap the updated record into your list.",
    analogy: { icon: "🗒️", text: "Fixing a shopping list. PUT = tear it up and write a fresh full list. PATCH = just change \"2 apples\" to \"3 apples\" on the existing one." },
    visual: { type: "compare", title: "Same edit, two methods", left: { label: "PUT /contacts/7", tone: "neutral", points: [
      "Body: `{ name, email, phone, favorite }`",
      "Replaces the entire record",
      "Missing field → may be cleared",
      "Idempotent: same result every time",
      "Good for \"Save\" on a full edit form"
    ]}, right: { label: "PATCH /contacts/7", tone: "good", points: [
      "Body: `{ favorite: true }`",
      "Changes only the fields sent",
      "Others stay as they are",
      "Smaller payload",
      "Good for toggles and inline edits"
    ]}},
    points: [
      "Use **PATCH** for a toggle (favourite, done) or one inline field.",
      "Use **PUT** when a form edits the **whole** record and you send all of it.",
      "Replace the item in state with `map`: `list.map(c => c.id === updated.id ? updated : c)`.",
      "Prefer the record the **server returns**; it may add `updatedAt` or normalise values.",
      "Check your backend: some APIs only support one of the two."
    ],
    code: { file: "ContactRow.jsx", lang: "jsx", src: `const json = { 'Content-Type': 'application/json' };

async function patchContact(id, changes) {
  const res = await fetch(\`/api/contacts/\${id}\`, {
    method: 'PATCH', headers: json, body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

async function putContact(contact) {
  const res = await fetch(\`/api/contacts/\${contact.id}\`, {
    method: 'PUT', headers: json, body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

export default function ContactRow({ contact, onUpdated }) {
  async function toggleFavorite() {
    const updated = await patchContact(contact.id, { favorite: !contact.favorite });
    onUpdated(updated);
  }

  async function saveAll(edited) {          // called by a full edit form
    const updated = await putContact({ ...contact, ...edited });
    onUpdated(updated);
  }

  return (
    <li>
      {contact.name}
      <button onClick={toggleFavorite}>{contact.favorite ? '★' : '☆'}</button>
    </li>
  );
}
// Parent: onUpdated={u => setContacts(list => list.map(c => c.id === u.id ? u : c))}`, walk: [
      { lines: [3, 4, 5, 6], note: "PATCH sends only the changed fields." },
      { lines: [11, 12, 13], note: "PUT sends the complete record to its item URL." },
      { lines: [20, 21, 22], note: "A star toggle: perfect PATCH, one field." },
      { lines: [25, 26], note: "Full form save: merge edits into the whole record and PUT it." },
      { lines: [37], note: "Swap the updated record into the list immutably with `map`." }
    ]},
    mistakes: [
      { bad: `fetch('/api/contacts/7', { method: 'PUT',\n  body: JSON.stringify({ phone: '555' }) })`, good: `fetch('/api/contacts/7', { method: 'PATCH',\n  headers: json, body: JSON.stringify({ phone: '555' }) })`, why: "PUT with one field can erase name and email on servers that replace the whole record." },
      { bad: `contact.favorite = true;\nsetContacts(contacts);`, good: `setContacts(list => list.map(c =>\n  c.id === u.id ? u : c));`, why: "Same array reference = React sees no change and skips the re-render. Build a new array instead." }
    ],
    practice: [
      { level: "B", q: "Mark todo 3 as done. Method and body?", a: "`PATCH /api/todos/3` with `{ \"done\": true }`." },
      { level: "B", q: "An edit form shows every field of the contact. Which method fits \"Save\"?", a: "PUT with the full record (PATCH with all fields also works)." },
      { level: "I", q: "Write the state update that replaces contact `u` in `contacts`.", a: "`setContacts(list => list.map(c => c.id === u.id ? u : c))`" },
      { level: "C", q: "Two people edit contact 7 at once. How can the API stop one overwriting the other?", a: "Optimistic concurrency: send a version or ETag (`If-Match`); the server returns 409/412 if the record changed meanwhile." }
    ],
    quiz: [
      { q: "PUT `{ phone: '555' }` to a strict server. What happens to `name`?", options: ["Kept", "May be cleared", "Doubled"], answer: 1, why: "PUT replaces the whole resource with what you send." },
      { q: "Best method for toggling a favourite star?", options: ["PUT", "PATCH", "POST"], answer: 1, why: "One field changes: partial update." },
      { q: "How do you put the updated record into the list?", options: ["`list.push(u)`", "`list.map(c => c.id === u.id ? u : c)`", "`list[u.id] = u`"], answer: 1, why: "`map` returns a new array with the one item replaced." }
    ],
    rev: {
      sec30: "PUT replaces the entire resource (send the full record, idempotent). PATCH applies a partial change (send only changed fields). After success, replace the item in state with `map` using the server's returned record.",
      interview: [
        { level: "basic", q: "PUT vs PATCH?", a: "PUT sends a full replacement; PATCH sends only the fields to change." },
        { level: "intermediate", q: "Is PATCH idempotent?", a: "Not guaranteed. `{ favorite: true }` is, but an operation like \"increment views\" isn't." },
        { level: "intermediate", q: "How do you update one item in a list in React state?", a: "Create a new array with `map`, replacing the matching id with the new object." },
        { level: "advanced", q: "How do you avoid lost updates with concurrent edits?", a: "Use a version/ETag: send `If-Match`; the server rejects stale writes with 412 or 409 and the UI asks the user to reload or merge." }
      ],
      cheat: [
        "PUT = replace all · PATCH = change some",
        "PUT body: full record · PATCH body: changed fields",
        "Both target the item URL: `/contacts/:id`",
        "Toggles and inline edits → PATCH",
        "Update state: `list.map(c => c.id === u.id ? u : c)`",
        "Use the server's returned record"
      ]
    },
    related: ["API-003", "STATE-013", "STATE-014", "API-027"]
  },

  "API-011": {
    tldr: "DELETE removes a record at its item URL. Ask the user to **confirm** first, send the request, and remove the item from state only when the server says it's gone (200 or 204).",
    analogy: { icon: "🗑️", text: "Deleting a photo on your phone: \"Delete this photo?\" Cancel / Delete. A quick check stops an accidental tap from losing something important." },
    visual: { type: "flow", title: "Delete with confirmation", steps: [
      { label: "Click Delete", detail: "The user taps the bin next to Ana." },
      { label: "Confirm?", detail: "\"Delete Ana?\" Cancel ends here; nothing is sent." },
      { label: "DELETE /contacts/7", detail: "Button disabled while the request runs." },
      { label: "204 No Content", detail: "Success, with no body to parse." },
      { label: "Remove from state", detail: "`list.filter(c => c.id !== 7)`. On error, keep the row and show why." }
    ]},
    points: [
      "Send to the **item URL**: `DELETE /api/contacts/7`. No body needed.",
      "**Confirm** destructive actions: `window.confirm` for a quick start, a custom dialog in real apps.",
      "Expect **204** (no body) or **200**. Don't call `res.json()` on 204.",
      "Remove from state with **`filter`** after success (or optimistically, see API-027).",
      "A **404** on delete usually means it's already gone: treat it as success."
    ],
    code: { file: "DeleteButton.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function DeleteButton({ contact, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    if (!window.confirm(\`Delete \${contact.name}?\`)) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(\`/api/contacts/\${contact.id}\`, { method: 'DELETE' });
      if (!res.ok && res.status !== 404) throw new Error(\`HTTP \${res.status}\`);
      onDeleted(contact.id);                 // 204, 200 or already gone
    } catch (err) {
      setError(\`Couldn't delete: \${err.message}\`);
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={handleDelete} disabled={busy} aria-label={\`Delete \${contact.name}\`}>
        {busy ? 'Deleting…' : '🗑️'}
      </button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}
// Parent: onDeleted={id => setContacts(list => list.filter(c => c.id !== id))}`, walk: [
      { lines: [8], note: "Ask first. If the user cancels, stop before any request." },
      { lines: [10, 11], note: "Disable the button and clear any old error." },
      { lines: [13], note: "DELETE on the item URL, no body." },
      { lines: [14, 15], note: "204/200 = deleted; 404 = already gone. Either way, remove it from the list." },
      { lines: [16, 17, 18], note: "On failure the row stays and the user sees why." },
      { lines: [31], note: "Parent removes the item immutably with `filter`." }
    ]},
    output: "Click 🗑️ → “Delete Ana?” → OK → button shows “Deleting…” → the row disappears.",
    mistakes: [
      { bad: `const res = await fetch(url, { method: 'DELETE' });\nconst data = await res.json();`, good: `const res = await fetch(url, { method: 'DELETE' });\nif (!res.ok) throw new Error(res.status);`, why: "A 204 response has an empty body; `res.json()` throws \"Unexpected end of JSON input\"." },
      { bad: `<button onClick={() => deleteContact(c.id)}>Delete</button>`, good: `<button onClick={() => {\n  if (confirm(\`Delete \${c.name}?\`)) deleteContact(c.id);\n}}>Delete</button>`, why: "One misclick wipes data with no way back. Confirm, or offer Undo." }
    ],
    practice: [
      { level: "B", q: "Write the request to delete note 12.", a: "`fetch('/api/notes/12', { method: 'DELETE' })`" },
      { level: "B", q: "Remove id 12 from `notes` state.", a: "`setNotes(list => list.filter(n => n.id !== 12))`" },
      { level: "I", q: "Replace `window.confirm` with an in-page dialog.", a: "Keep `pendingDelete` state; the bin sets it, a `<dialog>` shows \"Delete X?\" with Cancel (clear it) and Delete (send the request)." },
      { level: "C", q: "Implement \"Undo\" instead of confirm.", a: "Hide the row immediately and show an Undo toast for ~5 s; only send DELETE when the timer ends. Undo clears the timer and restores the row." }
    ],
    quiz: [
      { q: "Successful DELETE usually returns…", options: ["201", "204", "302", "400"], answer: 1, why: "204 No Content (or 200 with a body)." },
      { q: "When should you remove the row from state (non-optimistic)?", options: ["Before confirming", "After the server confirms success", "Never"], answer: 1, why: "Otherwise a failed delete leaves the UI lying." },
      { q: "DELETE returns 404. Sensible handling?", options: ["Crash", "Treat as already deleted", "Retry 10 times"], answer: 1, why: "The goal (record gone) is already true." }
    ],
    rev: {
      sec30: "Confirm, then `DELETE /resource/:id` with no body. Expect 204 or 200 (don't parse 204), treat 404 as already gone, and remove the item with `filter`. Disable the button while pending and keep the row with an error message if it fails.",
      interview: [
        { level: "basic", q: "How do you delete a record from React?", a: "Send `fetch(url, { method: 'DELETE' })` to the item URL, then `filter` it out of state on success." },
        { level: "intermediate", q: "Confirm dialog or Undo: which is better UX?", a: "Undo is smoother for frequent actions (Gmail style); confirm suits rare, high-impact deletes." },
        { level: "intermediate", q: "Why not call `res.json()` after a DELETE?", a: "Many APIs return 204 with no body, so parsing throws." },
        { level: "tricky", q: "Is DELETE idempotent if the second call returns 404?", a: "Yes. Idempotency is about server state (the record is gone), not the status code." }
      ],
      cheat: [
        "`DELETE /contacts/:id`, no body",
        "Confirm (or Undo) before destructive actions",
        "Success: 204 (no body) or 200",
        "404 on delete → already gone",
        "Remove: `list.filter(c => c.id !== id)`",
        "Disable the button while deleting"
      ]
    },
    related: ["API-003", "API-027", "STATE-013"]
  },

  "API-012": {
    tldr: "`async`/`await` lets you write API code top to bottom like normal steps. `await` pauses **only that function** (the UI keeps running). Wrap it in `try/catch/finally` for errors and cleanup.",
    analogy: { icon: "🍕", text: "Ordering pizza by phone. You place the order (await) and wait for the doorbell, but you don't freeze; you keep watching TV. When it arrives, you continue with \"eat\"." },
    visual: { type: "timeline", title: "What `await` does", frames: [
      { label: "Click Save", state: "handler starts, setSaving(true)", note: "Runs synchronously until the first await." },
      { label: "await fetch", state: "handler paused · UI free", note: "Spinner animates, user can scroll." },
      { label: "Reply arrives", state: "handler resumes with res", note: "Continues on the next line." },
      { label: "await res.json()", state: "paused again briefly", note: "Body is read." },
      { label: "finally", state: "setSaving(false)", note: "Runs on success and on error." }
    ]},
    points: [
      "`async` functions **always return a Promise**. `await` unwraps it.",
      "Use **`try/catch/finally`**: catch for errors, finally to reset loading.",
      "**Independent** requests: run in parallel with `await Promise.all([...])`, not one after another.",
      "In effects: define an inner `async` function and call it; the effect itself can't be `async`.",
      "`forEach` ignores `await`. Use `for...of` (one by one) or `Promise.all` (together)."
    ],
    code: { file: "ContactPage.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

export default function ContactPage({ id }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        // Both start at once: total time = the slower one
        const [contact, notes] = await Promise.all([
          getJson(\`/api/contacts/\${id}\`),
          getJson(\`/api/contacts/\${id}/notes\`),
        ]);
        if (!ignore) setData({ contact, notes });
      } catch (err) {
        if (!ignore) setError(err.message);
      }
    }

    load();
    return () => { ignore = true; };
  }, [id]);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p>Loading…</p>;
  return <h2>{data.contact.name} ({data.notes.length} notes)</h2>;
}`, walk: [
      { lines: [3, 4, 5, 6], note: "A small helper: await the response, check it, await the JSON." },
      { lines: [16], note: "The async function lives inside the effect." },
      { lines: [19, 20, 21, 22], note: "`Promise.all` runs both requests in parallel and waits for both." },
      { lines: [24, 25, 26], note: "If either fails, `catch` gets the first error." },
      { lines: [29, 30], note: "Call it, and clean up so stale results are ignored." }
    ]},
    mistakes: [
      { bad: `const contact = await getJson(a);\nconst notes = await getJson(b); // waits for a first`, good: `const [contact, notes] = await Promise.all([\n  getJson(a), getJson(b),\n]);`, why: "Sequential awaits on independent requests double the wait time. Start them together." },
      { bad: `ids.forEach(async id => {\n  await deleteContact(id);\n});\nsetDone(true);`, good: `await Promise.all(ids.map(id => deleteContact(id)));\nsetDone(true);`, why: "`forEach` doesn't wait for async callbacks, so `setDone` runs before any delete finishes." }
    ],
    practice: [
      { level: "B", q: "What does an `async` function return?", a: "Always a Promise, even if you `return 5` (it becomes `Promise<5>`)." },
      { level: "B", q: "Rewrite `fetch(u).then(r => r.json()).then(setData)` with await.", a: "`const r = await fetch(u); setData(await r.json());` inside an async function." },
      { level: "I", q: "Load contacts and tags in parallel, but show contacts even if tags fail.", a: "Use `Promise.allSettled` and check each result's `status` ('fulfilled' or 'rejected')." },
      { level: "C", q: "Delete 3 contacts strictly one after another, stopping at the first failure.", a: "`for (const id of ids) { await deleteContact(id); }` inside try/catch. A throw stops the loop." }
    ],
    quiz: [
      { q: "While a handler is `await`ing fetch, the UI…", options: ["Freezes", "Keeps responding", "Reloads"], answer: 1, why: "Only that function pauses; the main thread is free." },
      { q: "Two independent GETs: fastest way?", options: ["Two awaits in a row", "`await Promise.all([...])`", "`forEach` with async"], answer: 1, why: "Both start immediately; you wait for the slower one only." },
      { q: "`finally` runs…", options: ["Only on success", "Only on error", "On both"], answer: 2, why: "Perfect for `setLoading(false)`." }
    ],
    rev: {
      sec30: "`async` functions return Promises; `await` pauses just that function until a Promise settles. Use try/catch/finally for errors and loading reset, `Promise.all` for parallel independent calls, `for...of` for sequential ones, and an inner async function inside `useEffect`.",
      interview: [
        { level: "basic", q: "What does `await` do?", a: "Pauses the async function until the Promise settles, then gives the value (or throws the error). Other code keeps running." },
        { level: "intermediate", q: "`Promise.all` vs `Promise.allSettled`?", a: "`all` rejects as soon as one fails; `allSettled` waits for all and reports each result's status." },
        { level: "intermediate", q: "Why doesn't `await` work inside `forEach`?", a: "`forEach` ignores the returned Promises, so nothing waits. Use `for...of` or `Promise.all(arr.map(...))`." },
        { level: "advanced", q: "How do you write an async effect correctly?", a: "Declare an async function inside the effect, call it, and return a cleanup that ignores or aborts the request." },
        { level: "tricky", q: "Does code after `setX()` in an async handler see the new state?", a: "No. The handler's variables are a snapshot from its render; the new value shows on the next render." }
      ],
      predict: [
        { code: `async function f() {\n  console.log('A');\n  await null;\n  console.log('C');\n}\nf();\nconsole.log('B');`, answer: "A, B, C", why: "Code runs synchronously until the first `await`; the rest resumes as a microtask after `B`." }
      ],
      cheat: [
        "`async` fn → always returns a Promise",
        "`await` pauses the function, not the UI",
        "try / catch / finally",
        "Parallel: `await Promise.all([...])`",
        "Sequential: `for (const x of xs) await ...`",
        "Never `forEach(async ...)` when you need to wait",
        "Effects: inner async function + cleanup"
      ]
    },
    related: ["WEB-029", "WEB-028", "API-006", "API-014"]
  },

  "API-013": {
    tldr: "Track loading **per request**, not with one global flag. The first load shows a skeleton; a refresh keeps old data visible; deleting one row disables only that row's button.",
    analogy: { icon: "🛒", text: "A supermarket with several tills. If one till is busy, you don't close the whole shop; you show \"busy\" on that till only and the others keep serving." },
    visual: { type: "compare", title: "One flag vs per-request", left: { label: "One global `loading`", tone: "bad", points: [
      "Deleting one row blanks the whole list",
      "Two requests: the first to finish hides the spinner",
      "Can't tell first load from a refresh",
      "Every button disabled at once"
    ]}, right: { label: "Loading per request", tone: "good", points: [
      "`status`: idle / loading / success / error",
      "`refreshing` keeps old data on screen",
      "`busyIds` disables just that row",
      "Each action owns its own pending flag"
    ]}},
    points: [
      "Use a **status** value (`'loading' | 'success' | 'error'`) instead of several booleans that can contradict.",
      "**First load**: skeleton or spinner. **Refetch**: keep the data, show a small \"Refreshing…\" hint.",
      "**Per-item actions**: store pending ids in a `Set` and disable only those rows.",
      "Disable submit buttons while pending to stop duplicate requests.",
      "TanStack Query separates these for you: `isPending` (no data yet) vs `isFetching` (any request in flight)."
    ],
    code: { file: "ContactList.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';

async function getContacts() {
  const res = await fetch('/api/contacts');
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState('loading');   // first load
  const [refreshing, setRefreshing] = useState(false);
  const [busyIds, setBusyIds] = useState(new Set());   // per-row

  useEffect(() => {
    getContacts().then(setContacts)
      .then(() => setStatus('success'), () => setStatus('error'));
  }, []);

  async function refresh() {
    setRefreshing(true);
    try { setContacts(await getContacts()); } finally { setRefreshing(false); }
  }
  async function remove(id) {
    setBusyIds(s => new Set(s).add(id));
    const res = await fetch(\`/api/contacts/\${id}\`, { method: 'DELETE' });
    if (res.ok) setContacts(list => list.filter(c => c.id !== id));
    setBusyIds(s => { const n = new Set(s); n.delete(id); return n; });
  }

  if (status === 'loading') return <p aria-busy="true">Loading contacts…</p>;
  if (status === 'error') return <p role="alert">Couldn't load contacts.</p>;
  return (
    <>
      <button onClick={refresh} disabled={refreshing}>
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
      <ul>{contacts.map(c => (
        <li key={c.id}>{c.name}
          <button onClick={() => remove(c.id)} disabled={busyIds.has(c.id)}>Delete</button>
        </li>
      ))}</ul>
    </>
  );
}`, walk: [
      { lines: [11, 12, 13], note: "Three separate loading signals: first load, refresh, and per-row." },
      { lines: [15, 16, 17, 18], note: "Only the first load drives the full-screen status (runs twice in dev Strict Mode)." },
      { lines: [20, 21, 22, 23], note: "A refresh keeps the list visible; only the button changes." },
      { lines: [25, 26, 27, 28], note: "Mark the row busy (new Set, never mutate), DELETE, drop the row only if `res.ok`, then clear the id." },
      { lines: [31, 32], note: "Spinner only when there's nothing to show yet." },
      { lines: [40], note: "Only the row being deleted is disabled." }
    ]},
    output: "“Loading contacts…” once. After that, Refresh shows “Refreshing…” while the list stays; Delete greys out just that row.",
    mistakes: [
      { bad: `const [loading, setLoading] = useState(false);\n// every request toggles it\nif (loading) return <Spinner />;`, good: `if (status === 'loading') return <Spinner />;\n// row: disabled={busyIds.has(c.id)}`, why: "A single flag hides the whole screen for a tiny action, and parallel requests switch it off too early." },
      { bad: `const [isLoading, setIsLoading] = useState(true);\nconst [isError, setIsError] = useState(false);`, good: `const [status, setStatus] = useState('loading');`, why: "Two booleans allow impossible combos (loading AND error). One status value can only be one thing." }
    ],
    practice: [
      { level: "B", q: "Disable the Save button while a POST is pending.", a: "`<button disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>` with `saving` set true before and false in `finally`." },
      { level: "B", q: "Why show the old list during a refresh?", a: "It avoids a flash of empty screen and keeps the user's scroll position." },
      { level: "I", q: "Add `aria-busy` for screen readers.", a: "Put `aria-busy={refreshing}` on the list container so assistive tech knows content is updating." },
      { level: "C", q: "Only show the spinner if loading takes over 300 ms.", a: "Start a `setTimeout` that sets `showSpinner` after 300 ms; clear it when the data arrives. Fast loads never flash a spinner." }
    ],
    quiz: [
      { q: "Deleting one row should…", options: ["Show a full-page spinner", "Disable only that row", "Disable every button"], answer: 1, why: "Scope the pending state to the item." },
      { q: "Why prefer `status` over `isLoading` + `isError`?", options: ["It's shorter", "It can't hold impossible combinations", "React requires it"], answer: 1, why: "One value = one state at a time." },
      { q: "In TanStack Query, background refetch with data on screen is…", options: ["`isPending`", "`isFetching`", "`isError`"], answer: 1, why: "`isPending` means no data yet; `isFetching` means a request is running." }
    ],
    rev: {
      sec30: "Loading state belongs to a request, not the app. Use a status enum for the initial load, a separate flag for refetches that keep stale data visible, and per-item pending ids for row actions. Disable only what's busy. TanStack Query models this as `isPending` vs `isFetching`.",
      interview: [
        { level: "basic", q: "How do you show a loading state in React?", a: "Keep a status in state, set it before the request and after it settles, and render a spinner or skeleton while loading." },
        { level: "intermediate", q: "Why not one global loading flag?", a: "Unrelated actions block the whole UI, and concurrent requests clear the flag when the first one finishes." },
        { level: "intermediate", q: "Skeleton vs spinner?", a: "Skeletons mirror the final layout and feel faster for content; spinners suit short, unknown-shape waits like a button action." },
        { level: "advanced", q: "How do you track pending state for many rows?", a: "Store pending ids in a `Set` (or object map) in state, replacing it immutably on add/remove, and check `has(id)` per row." }
      ],
      cheat: [
        "Loading per request, not per app",
        "`status`: 'loading' | 'success' | 'error'",
        "Refetch: keep old data + small hint",
        "Row actions: `busyIds` Set",
        "Disable the busy control only",
        "TanStack: `isPending` vs `isFetching`"
      ]
    },
    related: ["COND-016", "API-006", "API-014", "STORE-020"]
  },

  "API-014": {
    tldr: "Three things can fail: the **network** (no reply, `fetch` rejects), **HTTP** (reply with 4xx/5xx, `res.ok` is false) and **parsing** (body isn't valid JSON). Catch all three in one helper and show a clear, friendly message.",
    analogy: { icon: "📞", text: "Calling a takeaway. No signal (network), they answer \"we're closed\" (HTTP error), or they answer in a language you can't understand (parsing). Each needs a different message." },
    visual: { type: "flow", title: "Where a request can fail", steps: [
      { label: "Send request", detail: "No internet, DNS or CORS failure → `fetch` rejects with `TypeError`." },
      { label: "Status arrives", detail: "`res.ok === false` (404, 422, 500) → throw your own `ApiError` with the status." },
      { label: "Read the body", detail: "HTML error page or empty body → `res.json()` throws `SyntaxError`." },
      { label: "Catch once", detail: "One `try/catch` turns each kind into a user-friendly message." },
      { label: "Show + recover", detail: "Message, Retry button; keep the user's form input." }
    ]},
    points: [
      "**Network**: `fetch` rejects (`TypeError: Failed to fetch`). Say \"Check your connection\" and offer Retry.",
      "**HTTP**: `fetch` does **not** reject. Check `res.ok` and throw an error that carries the status and body.",
      "**Parsing**: guard `res.json()`; an HTML 502 page isn't JSON.",
      "**Aborts** (`AbortError`) aren't real failures: ignore them silently.",
      "Error boundaries **don't** catch async errors from handlers or effects: put them in state, or rethrow during render."
    ],
    code: { file: "apiFetch.js", lang: "js", src: `export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? \`Request failed (\${status})\`);
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    if (err.name === 'AbortError') throw err;            // cancelled: not a failure
    throw new Error('Network problem. Check your connection.');
  }

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;                // 204 or empty → null
  } catch {
    if (res.ok) throw new Error('Server sent invalid data.');
  }

  if (!res.ok) throw new ApiError(res.status, body);
  return body;
}

// In a component:
// try { setContacts(await apiFetch('/api/contacts')); }
// catch (err) {
//   if (err.name === 'AbortError') return;
//   setError(err.status === 404 ? 'Not found' : err.message);
// }`, walk: [
      { lines: [1, 2, 3, 4, 5], note: "A custom error that remembers the status and the server's error body." },
      { lines: [11, 12, 13, 14, 15], note: "Network failure: `fetch` rejected. Aborts pass through untouched." },
      { lines: [18, 19, 20, 21], note: "Read as text first, so empty bodies (204) and bad JSON are handled safely." },
      { lines: [22, 23], note: "Invalid JSON on a success response is a real error." },
      { lines: [26, 27], note: "HTTP errors become `ApiError`; success returns the parsed body." },
      { lines: [30, 31, 32, 33, 34], note: "Components get one error type to show, with the status when there is one." }
    ]},
    mistakes: [
      { bad: `try {\n  const data = await (await fetch(url)).json();\n  setData(data);\n} catch {\n  setError('Network error');\n}`, good: `try {\n  setData(await apiFetch(url));\n} catch (err) {\n  setError(err.message);\n}`, why: "A 500 isn't caught as an HTTP error (fetch resolves), and the user always sees \"Network error\" whatever really happened." },
      { bad: `catch (err) {\n  console.log(err);\n}`, good: `catch (err) {\n  setError(err.message);\n  reportError(err);\n}`, why: "Swallowing errors leaves the user staring at a spinner or a blank screen." }
    ],
    practice: [
      { level: "B", q: "What does `fetch` do when the server returns 500?", a: "Resolves with `res.ok === false`, `res.status === 500`. It doesn't throw." },
      { level: "B", q: "Add a **Retry** button to the error message.", a: "`{error && <p role=\"alert\">{error} <button onClick={load}>Retry</button></p>}`" },
      { level: "I", q: "On 422, show the server's field errors from `err.body.errors`.", a: "`if (err instanceof ApiError && err.status === 422) setFieldErrors(err.body.errors);`" },
      { level: "C", q: "Let an error boundary show a failed load.", a: "Store the error in state, then `if (error) throw error;` during render; the nearest boundary catches render-time throws. (React Router's `errorElement` or TanStack Query's `throwOnError` do this for you.)" }
    ],
    quiz: [
      { q: "The Wi-Fi drops mid-request. What happens?", options: ["`res.ok` is false", "`fetch` rejects with a TypeError", "`res.status` is 0 and it resolves"], answer: 1, why: "No response at all = rejected promise." },
      { q: "A 502 returns an HTML page and you call `res.json()`. Result?", options: ["Empty object", "SyntaxError", "It parses the HTML"], answer: 1, why: "HTML isn't JSON." },
      { q: "Does an error boundary catch a rejected fetch in `useEffect`?", options: ["Yes", "No"], answer: 1, why: "Boundaries catch errors during rendering, not in async callbacks." }
    ],
    rev: {
      sec30: "Handle network errors (fetch rejects), HTTP errors (check `res.ok`, fetch resolves on 4xx/5xx) and parse errors (invalid or empty JSON) in one wrapper that throws a typed error with status and body. Ignore AbortError, show friendly messages with Retry, and remember error boundaries don't catch async errors.",
      interview: [
        { level: "basic", q: "Does `fetch` throw on a 404?", a: "No. It resolves; you must check `res.ok` or `res.status` and throw yourself." },
        { level: "intermediate", q: "What kinds of errors can an API call produce?", a: "Network/CORS failures (reject), HTTP error statuses (resolve with `ok: false`), JSON parse errors, timeouts and aborts." },
        { level: "intermediate", q: "Why create a custom `ApiError` class?", a: "It carries the status and server body, so components can branch (`404`, `422` field errors) with `instanceof` checks." },
        { level: "advanced", q: "How do error boundaries fit with data fetching?", a: "They catch render errors only. Put async errors in state and throw during render, or use a library option like TanStack Query `throwOnError` or a Router `errorElement`." },
        { level: "tricky", q: "A CORS block shows in the console. What does your code see?", a: "A generic `TypeError` (Chrome: \"Failed to fetch\"). The browser hides CORS details from JS, so it looks like a network error." }
      ],
      scenario: [
        { q: "Users report a blank screen when the API is down. Where do you look?", a: "Check that every request path catches errors and sets an error state, that `res.ok` is checked, and that loading ends in `finally`. Add a Retry button and error reporting." }
      ],
      cheat: [
        "Network fail → `fetch` rejects (TypeError)",
        "HTTP 4xx/5xx → resolves, `res.ok === false`",
        "Bad JSON → `res.json()` throws SyntaxError",
        "Wrap all three in one `apiFetch` helper",
        "Ignore `AbortError`",
        "Show message + Retry; keep the user's input",
        "Boundaries don't catch async errors"
      ]
    },
    related: ["API-004", "ADV-004", "WEB-039", "API-028"]
  },

  "API-015": {
    tldr: "Authentication tells the API **who is calling**. The browser sends proof with each request: a **session cookie** (sent automatically) or a **token** in the `Authorization` header (you add it). The server decides; the client only carries it.",
    analogy: { icon: "🎟️", text: "A festival wristband. You show your ticket once at the gate (login) and get a wristband (cookie or token). After that, every stall checks the wristband instead of asking for your ticket again." },
    visual: { type: "compare", title: "Two ways to send credentials", left: { label: "Session cookie", tone: "good", points: [
      "Server sets an `HttpOnly` cookie at login",
      "Browser attaches it automatically",
      "JS can't read it: safer from XSS",
      "Cross-origin: `credentials: 'include'`",
      "Needs CSRF care (`SameSite`, tokens)"
    ]}, right: { label: "Token in header", tone: "neutral", points: [
      "Login returns a token (often a JWT)",
      "You add `Authorization: Bearer …`",
      "Works for any origin and mobile apps",
      "Where you store it matters (XSS risk)",
      "Details in API-016 to API-018"
    ]}},
    points: [
      "**Login** = POST credentials once; the server returns proof (cookie or token).",
      "**Every later request** must carry that proof, or the API replies **401**.",
      "`fetch` sends cookies only to the **same origin** by default. For another origin use `credentials: 'include'` (axios: `withCredentials: true`).",
      "**Never** put secret API keys in React code: anything in the bundle is public. Call them from your backend.",
      "Always use **HTTPS**, so credentials can't be read on the way."
    ],
    code: { file: "auth.js", lang: "js", src: `const API = 'https://api.notes.dev';

// 1. Log in once: the server sets an HttpOnly session cookie
export async function login(email, password) {
  const res = await fetch(\`\${API}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',       // accept + store the cross-origin cookie
  });
  if (res.status === 401) throw new Error('Wrong email or password');
  if (!res.ok) throw new Error(\`Login failed (\${res.status})\`);
  return res.json();              // e.g. { id, name } (no secrets)
}

// 2. Every later request carries the cookie automatically
export async function getMyNotes() {
  const res = await fetch(\`\${API}/notes\`, { credentials: 'include' });
  if (res.status === 401) {
    window.location.assign('/login'); // session expired
    return [];
  }
  return res.json();
}

// Token-based APIs instead attach a header on each call:
// fetch(url, { headers: { Authorization: \`Bearer \${token}\` } })`, walk: [
      { lines: [4, 5, 6, 7, 8], note: "Log in once by POSTing the credentials (over HTTPS)." },
      { lines: [9], note: "Cross-origin cookies need `credentials: 'include'` (and server CORS allowing it)." },
      { lines: [11, 12, 13], note: "401 here means wrong details; the body has user info, not secrets." },
      { lines: [18], note: "Later calls just include credentials; the browser adds the cookie." },
      { lines: [19, 20, 21, 22], note: "401 later means the session ended: send the user to log in." },
      { lines: [26, 27], note: "Token APIs: you attach the proof yourself (next lesson)." }
    ]},
    mistakes: [
      { bad: `const res = await fetch('https://api.weather.dev/v1?key=sk_live_abc123');`, good: `// call your own backend; it adds the secret key\nconst res = await fetch('/api/weather?city=Pune');`, why: "Everything in the React bundle (including `VITE_` env vars) is visible to anyone. Secret keys must stay on a server." },
      { bad: `fetch('https://api.notes.dev/notes') // cookie never sent`, good: `fetch('https://api.notes.dev/notes', { credentials: 'include' })`, why: "By default `fetch` only sends cookies to the same origin, so a cross-origin API sees you as logged out (401)." }
    ],
    practice: [
      { level: "B", q: "Which status means \"you're not logged in\"?", a: "401 Unauthorized." },
      { level: "B", q: "Why can't JavaScript read an `HttpOnly` cookie?", a: "The browser hides it from `document.cookie` on purpose, so injected scripts (XSS) can't steal it." },
      { level: "I", q: "Send cookies with every axios request to `api.notes.dev`.", a: "`axios.create({ baseURL: 'https://api.notes.dev', withCredentials: true })`." },
      { level: "C", q: "With cookie auth, what must the server's CORS config include for credentialed requests?", a: "`Access-Control-Allow-Credentials: true` and a specific `Access-Control-Allow-Origin` (not `*`)." }
    ],
    quiz: [
      { q: "Where should a secret third-party API key live?", options: ["In a `VITE_` env var", "In your backend", "In localStorage"], answer: 1, why: "Anything shipped to the browser is public." },
      { q: "Does `fetch` send cookies to a different origin by default?", options: ["Yes", "No, you need `credentials: 'include'`"], answer: 1, why: "The default is `'same-origin'`." },
      { q: "Who decides if a request is allowed?", options: ["The React app", "The server", "The browser"], answer: 1, why: "Client checks are UX only; the API must verify every request." }
    ],
    rev: {
      sec30: "Authentication proves who's calling. After login, each request carries a session cookie (automatic, `HttpOnly`, needs `credentials: 'include'` cross-origin and CSRF protection) or a token in the `Authorization` header. Use HTTPS, keep secret keys on the server, and treat 401 as \"log in again\".",
      interview: [
        { level: "basic", q: "How does the API know who's calling after login?", a: "Each request carries a credential: a session cookie the browser sends automatically, or a token the app puts in the `Authorization` header." },
        { level: "intermediate", q: "Cookie vs token auth for a SPA?", a: "HttpOnly cookies hide the credential from JS (XSS-safer) but need CSRF protection; header tokens avoid CSRF but must be stored carefully." },
        { level: "intermediate", q: "What does `credentials: 'include'` do?", a: "Tells `fetch` to send and accept cookies on cross-origin requests; the server must allow credentials in CORS." },
        { level: "advanced", q: "Can a SPA keep an API key secret?", a: "No. The bundle is public. Proxy through a backend (or a BFF) that adds the key server-side." },
        { level: "tricky", q: "Is hiding a button for non-admins enough security?", a: "No. Anyone can call the API directly. The server must check auth and permissions on every request." }
      ],
      cheat: [
        "AuthN = who you are; server verifies every call",
        "Cookie: automatic, `HttpOnly`, CSRF care",
        "Token: `Authorization: Bearer <token>`",
        "Cross-origin cookies: `credentials: 'include'`",
        "axios: `withCredentials: true`",
        "No secret keys in React code",
        "401 → log in again"
      ]
    },
    related: ["API-016", "AUTH-001", "AUTH-005", "API-020"]
  },
};
