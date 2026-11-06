export default {
  "WEB-001": {
    tldr: "You type a URL, the browser finds the server's address (DNS), opens a connection (TCP + TLS), asks for the page (HTTP), then turns the reply into pixels (rendering).",
    analogy: { icon: "🍕", text: "Ordering pizza: look up the shop's number (DNS), call and get connected (TCP), place the order (HTTP request), the pizza arrives (response), you plate it up (render)." },
    visual: { type: "flow", title: "From URL to page", steps: [
      { label: "Type URL", detail: "`https://shop.example.com/cart` = protocol + domain + path." },
      { label: "DNS lookup", detail: "Domain name → IP address (like a phone book). Cached by browser, OS and router." },
      { label: "TCP + TLS", detail: "Open a reliable connection, then agree on encryption keys (the HTTPS padlock)." },
      { label: "HTTP request", detail: "Browser sends `GET /cart` with headers (cookies, language, accepted formats)." },
      { label: "Response", detail: "Server replies `200 OK` with HTML. Browser then fetches CSS, JS and images it references." },
      { label: "Render", detail: "HTML → DOM, CSS → styles, then layout and paint. You see the page." }
    ]},
    points: [
      "**DNS** (Domain Name System) turns `shop.example.com` into an IP like `93.184.216.34`.",
      "**TCP** gives a reliable, ordered connection; **TLS** encrypts it. HTTP/3 uses QUIC (UDP) but the idea is the same.",
      "The first HTML reply is just the start: each `<link>`, `<script>` and `<img>` triggers more requests.",
      "Caching at every step (DNS, browser cache, CDN) is why the second visit is faster.",
      "**In React:** a Vite app's first HTML is almost empty; the JS bundle downloads, then React builds the page in the browser."
    ],
    code: { file: "console.js", lang: "js", src: `// Paste into the browser console on any page (e.g. your favourite shop)
const [nav] = performance.getEntriesByType('navigation');

const ms = (a, b) => Math.round(nav[b] - nav[a]);

console.table({
  'DNS lookup':      ms('domainLookupStart', 'domainLookupEnd'),
  'TCP + TLS':       ms('connectStart', 'connectEnd'),
  'Wait for server': ms('requestStart', 'responseStart'),
  'Download HTML':   ms('responseStart', 'responseEnd'),
  'Build DOM':       ms('responseEnd', 'domContentLoadedEventEnd'),
  'Fully loaded':    ms('startTime', 'loadEventEnd'),
});`, walk: [
      { lines: [2], note: "The Navigation Timing API records a timestamp for every stage of loading this page." },
      { lines: [4], note: "Small helper: milliseconds between two recorded moments." },
      { lines: [7, 8], note: "DNS and connection time. Often **0** on a repeat visit because of caching." },
      { lines: [9, 10], note: "Time to first byte (server thinking) and HTML download time." },
      { lines: [11, 12], note: "Browser-side work: parsing HTML into the DOM, then everything (images too) finished." }
    ]},
    output: "A table like: DNS lookup 0, TCP + TLS 24, Wait for server 110, Download HTML 8, Build DOM 230, Fully loaded 900 (numbers vary by site and network).",
    mistakes: [
      { bad: `"DNS downloads the website."`, good: `"DNS only returns the server's IP address.\nHTTP fetches the actual files."`, why: "DNS is a lookup, not a transfer. Mixing the two is a common interview slip." },
      { bad: `"After the HTML arrives, the page is done."`, good: `"HTML arrives, then CSS, JS, images and fonts\nare requested, then layout and paint happen."`, why: "Most load time is often spent after the first HTML response." }
    ],
    practice: [
      { level: "B", q: "Put in order: render, DNS, HTTP request, TCP/TLS.", a: "DNS → TCP/TLS → HTTP request → (response) → render." },
      { level: "B", q: "Open DevTools → Network on a shop site and reload. What is the first request?", a: "The HTML document. Everything else (CSS, JS, images) is requested after the browser reads it." },
      { level: "I", q: "Why is DNS time often 0 on a second visit?", a: "The IP is cached (browser, OS, router), so no lookup is needed until the cache entry expires (TTL)." },
      { level: "C", q: "Run the console snippet on a React SPA and a static blog. Which spends longer in 'Build DOM' and why?", a: "Usually the SPA: it must download and run a JS bundle before React can build the visible page." }
    ],
    quiz: [
      { q: "What does DNS return?", options: ["The page HTML", "An IP address", "An encryption key", "The CSS file"], answer: 1, why: "DNS maps a domain name to an IP address. Nothing else." },
      { q: "What does TLS add to the connection?", options: ["Speed", "Encryption and server identity checks", "Caching", "Compression of images"], answer: 1, why: "TLS encrypts traffic and proves the server owns the domain (certificate)." },
      { q: "After the HTML arrives, what happens next?", options: ["Nothing, the page is complete", "The browser parses it and requests the CSS/JS/images it references", "The server sends the DOM", "DNS runs again for every tag"], answer: 1, why: "The HTML is a recipe; the browser fetches the ingredients it lists, then renders." }
    ],
    rev: {
      sec30: "URL → DNS resolves the domain to an IP → TCP connection plus TLS handshake → HTTP request → server responds with HTML → browser parses HTML, fetches CSS/JS/images, builds DOM and CSSOM, lays out and paints. Caches at each step speed up repeat visits.",
      interview: [
        { level: "basic", q: "What happens when you type a URL and press Enter?", a: "DNS lookup for the IP, TCP + TLS handshake, HTTP GET, server returns HTML, then the browser parses it, loads sub-resources and renders (DOM, CSSOM, layout, paint)." },
        { level: "basic", q: "What is DNS?", a: "The internet's phone book: it maps a domain name to an IP address, with results cached by TTL." },
        { level: "intermediate", q: "Where can caching happen in this journey?", a: "DNS cache, browser HTTP cache, service worker, CDN edge, and server-side caches. Each skips some network work." },
        { level: "advanced", q: "How does a client-rendered React app change the picture?", a: "The HTML is a shell with a root div, so the user waits for the JS bundle to download and run before seeing content. SSR or static generation sends real HTML first." },
        { level: "tricky", q: "Does HTTPS always need TCP?", a: "Not with HTTP/3: it runs over QUIC on UDP, which builds encryption into the connection setup and saves round trips." }
      ],
      cheat: [
        "URL = protocol + domain + path (+ query)",
        "DNS: name → IP, cached by TTL",
        "TCP = reliable connection; TLS = encryption (HTTPS)",
        "HTTP request/response carries the actual content",
        "Render: DOM + CSSOM → layout → paint",
        "Vite React app: HTML shell, then JS builds the UI"
      ]
    },
    related: ["WEB-002", "WEB-003", "WEB-004", "INTRO-011"]
  },

  "WEB-002": {
    tldr: "A web app is a conversation: the browser (client) asks, the server answers, and the database remembers. React lives in the client; it never talks to the database directly.",
    analogy: { icon: "🍽️", text: "A restaurant: you (client) order from the waiter (server), who fetches it from the kitchen store room (database). You never walk into the store room yourself." },
    visual: { type: "layers", title: "Three roles in a web app", items: [
      { label: "Client (browser)", detail: "Shows the UI and handles clicks. React runs here. Untrusted: users can change anything." },
      { label: "Server (API)", detail: "Checks who you are, applies business rules, returns JSON. e.g. ASP.NET Core, Node." },
      { label: "Database", detail: "Stores data permanently: products, orders, users. e.g. PostgreSQL. Only the server can reach it." }
    ]},
    points: [
      "**Client** = presentation. **Server** = rules and security. **Database** = storage.",
      "The client only sees what the server sends. Secrets (DB passwords, API keys) stay on the server.",
      "Never trust the client: validate prices, permissions and input on the server again.",
      "Many clients (web, mobile app) can share one server API.",
      "**In React:** components `fetch('/api/...')` and render the JSON; your ASP.NET Core API is still the server."
    ],
    code: { file: "server.mjs", lang: "js", src: `// Run: node server.mjs   then open http://localhost:3000/api/products
import http from 'node:http';

// Pretend database (in real life: PostgreSQL)
const db = {
  products: [
    { id: 1, name: 'Coffee mug', price: 12 },
    { id: 2, name: 'Tea pot', price: 30 },
  ],
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/products') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // let a browser app on another port call us
    });
    res.end(JSON.stringify(db.products));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(3000, () => console.log('API on http://localhost:3000'));

// Client side (browser console or a React component):
// const products = await (await fetch('http://localhost:3000/api/products')).json();`, walk: [
      { lines: [5, 10], note: "The data store. Only the server touches it; the browser never sees this object directly." },
      { lines: [12, 13], note: "The server listens for requests and checks method + path (a route)." },
      { lines: [14, 19], note: "It answers with a status, headers and a JSON body." },
      { lines: [21, 22], note: "Unknown path? Reply 404." },
      { lines: [27, 28], note: "The client asks over HTTP and turns the JSON into data it can render." }
    ]},
    output: "Visiting /api/products shows: [{\"id\":1,\"name\":\"Coffee mug\",\"price\":12},{\"id\":2,\"name\":\"Tea pot\",\"price\":30}]",
    mistakes: [
      { bad: `// In a React component\nconst db = new pg.Client('postgres://admin:secret@...');`, good: `// In a React component\nconst res = await fetch('/api/products');`, why: "Browser code is public. Anyone could read the password. Only the server should talk to the database." },
      { bad: `// Server trusts the price the client sent\ncharge(req.body.price);`, good: `// Server looks up the real price\nconst { price } = await db.findProduct(req.body.id);\ncharge(price);`, why: "Users can edit any request in DevTools. Business rules belong on the server." }
    ],
    practice: [
      { level: "B", q: "In a notes app, which role saves notes permanently?", a: "The database. The server writes to it; the client only asks." },
      { level: "B", q: "Add a `/api/health` route that returns `{ ok: true }`.", a: "Another `if` on `req.url === '/api/health'` that writes 200 and the JSON.", code: `if (req.url === '/api/health') {\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ ok: true }));\n  return;\n}` },
      { level: "I", q: "Why should the 'Is this user an admin?' check live on the server?", a: "The client can be modified; hiding a button is only UX. The server must refuse the request itself." },
      { level: "C", q: "A mobile app and a React site need the same products. How do you avoid duplicating logic?", a: "Both call the same server API. Logic lives once on the server; each client only renders." }
    ],
    quiz: [
      { q: "Where should the database password live?", options: ["In the React code", "In localStorage", "On the server only", "In the HTML"], answer: 2, why: "Anything shipped to the browser is readable by users." },
      { q: "In a typical React app, React runs on…", options: ["The database", "The client (browser)", "The DNS server"], answer: 1, why: "Plain React SPA code runs in the browser. (Frameworks like Next.js can also run it on a server.)" },
      { q: "Hiding the Delete button for non-admins is enough security.", options: ["True", "False"], answer: 1, why: "Users can still send the request by hand. The server must check permissions." }
    ],
    rev: {
      sec30: "Client-server splits a web app into the browser (UI, untrusted), the server (business rules, auth, API) and the database (persistent storage, only reachable by the server). They talk over HTTP, usually with JSON. React is a client concern; the server stays the source of truth.",
      interview: [
        { level: "basic", q: "What are the roles of client, server and database?", a: "Client renders UI and collects input; server validates, applies rules and exposes an API; database stores data durably." },
        { level: "intermediate", q: "Why can't the browser connect straight to PostgreSQL?", a: "It would expose credentials and let anyone run any query. The server is the gatekeeper that enforces rules." },
        { level: "intermediate", q: "What does 'never trust the client' mean in practice?", a: "Re-validate input, recompute prices and check permissions on the server, because any request can be forged." },
        { level: "advanced", q: "How is a React SPA + API different from server-rendered MVC?", a: "In MVC the server builds HTML per request. In an SPA the server mostly returns JSON and the browser builds the HTML with React." }
      ],
      cheat: [
        "Client = UI, untrusted",
        "Server = rules, auth, secrets, API",
        "Database = permanent storage, server-only access",
        "They talk via HTTP + JSON",
        "React SPA = client; ASP.NET Core = server",
        "Validate on the server even if the client validates too"
      ]
    },
    related: ["WEB-001", "WEB-003", "API-001", "API-020"]
  },

  "WEB-003": {
    tldr: "HTTP is the language browser and server use: a request (method, path, headers, body) and a response (status, headers, body). HTTPS is the same thing wrapped in TLS encryption.",
    analogy: { icon: "✉️", text: "HTTP is a postcard: anyone handling it can read and change it. HTTPS is the same letter in a locked envelope that only the shop can open." },
    visual: { type: "compare", title: "HTTP vs HTTPS", left: { label: "HTTP", tone: "bad", points: [
      "Plain text on the wire",
      "Cafe Wi-Fi can read your password",
      "Attackers can inject ads or scripts",
      "Browsers mark it **Not secure**"
    ]}, right: { label: "HTTPS (HTTP + TLS)", tone: "good", points: [
      "Encrypted: only browser and server can read it",
      "Certificate proves it's really the shop",
      "Tamper-proof: changes are detected",
      "Required for service workers, geolocation, HTTP/2 in browsers"
    ]}},
    points: [
      "**Request** = method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) + path + headers + optional body.",
      "**Response** = status code (`200` OK, `201` Created, `404` Not Found, `500` Server Error) + headers + body.",
      "**Headers** are labels: `Content-Type`, `Authorization`, `Cookie`, `Cache-Control`.",
      "HTTP is **stateless**: each request stands alone; cookies or tokens carry 'who you are'.",
      "**TLS** encrypts the whole message (headers too). The domain name can still be seen; the path and body can't.",
      "**In React:** every `fetch` you write builds one of these messages."
    ],
    code: { file: "cart.js", lang: "js", src: `// Add an item to the cart over HTTPS (run in a module or the console)
const res = await fetch('https://shop.example.com/api/cart', {
  method: 'POST',                         // what to do
  headers: {
    'Content-Type': 'application/json',   // what the body is
    'Authorization': 'Bearer abc123',     // who I am
  },
  body: JSON.stringify({ productId: 7, qty: 2 }),
});

console.log(res.status);                        // 201
console.log(res.headers.get('content-type'));   // application/json
const cart = await res.json();                  // read the body

/* What really travels (inside the TLS envelope):

POST /api/cart HTTP/1.1
Host: shop.example.com
Content-Type: application/json
Authorization: Bearer abc123

{"productId":7,"qty":2}
*/`, walk: [
      { lines: [2, 3], note: "URL and method form the request line: `POST /api/cart`." },
      { lines: [4, 7], note: "Headers describe the message and carry credentials." },
      { lines: [8], note: "The body must be a string, so the object is turned into JSON." },
      { lines: [11, 13], note: "The response has a status, headers and a body you read with `res.json()`." },
      { lines: [17, 22], note: "The raw text message: request line, headers, a blank line, then the body." }
    ]},
    output: "201\napplication/json\n(cart now holds the server's updated cart object)",
    mistakes: [
      { bad: `fetch('/api/cart', {\n  method: 'POST',\n  body: { productId: 7 }\n});`, good: `fetch('/api/cart', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ productId: 7 })\n});`, why: "An object body becomes the string \"[object Object]\". Stringify it and say it's JSON in the header." },
      { bad: `// Login form posting to\nhttp://shop.example.com/login`, good: `// Always\nhttps://shop.example.com/login`, why: "Over plain HTTP the password crosses the network readable by anyone on the same Wi-Fi." }
    ],
    practice: [
      { level: "B", q: "Which status code means 'created'? Which means 'not logged in'?", a: "`201` Created. `401` Unauthorized (not authenticated); `403` means logged in but not allowed." },
      { level: "B", q: "In DevTools → Network, click a request. Find the method, status and `Content-Type`.", a: "Headers tab: General shows method + status; Response Headers shows `content-type`." },
      { level: "I", q: "Why does HTTP need cookies or tokens?", a: "HTTP is stateless. Each request must carry proof of identity, so the server sends a cookie or the client sends an `Authorization` header." },
      { level: "C", q: "On HTTPS, what can a network snooper still see?", a: "The server IP and usually the domain name (via DNS/SNI) and traffic size. Not the path, headers or body." }
    ],
    quiz: [
      { q: "Which part of an HTTP response tells you if it worked?", options: ["The method", "The status code", "The Host header", "The URL"], answer: 1, why: "2xx success, 3xx redirect, 4xx client error, 5xx server error." },
      { q: "With HTTPS, are request headers encrypted?", options: ["No, only the body", "Yes, headers and body", "Only cookies"], answer: 1, why: "TLS wraps the entire HTTP message." },
      { q: "'HTTP is stateless' means…", options: ["The server has no database", "Each request is independent; identity must be sent every time", "Responses can't be cached"], answer: 1, why: "Cookies and tokens exist precisely because the protocol forgets between requests." }
    ],
    rev: {
      sec30: "HTTP is a stateless text protocol: requests have a method, path, headers and optional body; responses have a status code, headers and body. HTTPS runs HTTP inside TLS, which encrypts everything, verifies the server's certificate and detects tampering.",
      interview: [
        { level: "basic", q: "Name the parts of an HTTP request.", a: "Method, URL/path, headers, and an optional body (e.g. JSON for POST)." },
        { level: "basic", q: "Difference between 401 and 403?", a: "401: you're not authenticated. 403: you're authenticated but not allowed." },
        { level: "intermediate", q: "What does TLS give you?", a: "Confidentiality (encryption), integrity (tamper detection) and authentication of the server through its certificate." },
        { level: "advanced", q: "GET vs POST beyond 'one reads, one writes'?", a: "GET should be safe and idempotent, is cacheable and has no body. POST isn't idempotent, so retrying may create duplicates." },
        { level: "tricky", q: "Is a GET with the password in the query string safe over HTTPS?", a: "It's encrypted in transit, but URLs land in browser history, server logs and analytics. Send secrets in the body or headers." }
      ],
      compare: { cols: ["", "HTTP", "HTTPS"], rows: [
        ["Encryption", "None", "TLS"],
        ["Default port", "80", "443"],
        ["Server identity", "Not verified", "Certificate checked"],
        ["Browser label", "Not secure", "Padlock"]
      ]},
      cheat: [
        "Request: method + path + headers + body",
        "Response: status + headers + body",
        "2xx ok · 3xx redirect · 4xx your fault · 5xx server's fault",
        "HTTP is stateless: cookies/tokens carry identity",
        "HTTPS = HTTP inside TLS, port 443",
        "TLS hides path, headers and body, not the domain"
      ]
    },
    related: ["WEB-004", "API-003", "API-004", "SEC-011"]
  },

  "WEB-004": {
    tldr: "One request goes out, one response comes back, and the browser then builds the page in stages: HTML into the DOM, CSS into styles, then layout and paint. Scripts can block that pipeline.",
    analogy: { icon: "🧁", text: "Baking from a recipe card: read it top to bottom (parse HTML), gather ingredients it lists (CSS, JS, images), mix (layout), then decorate (paint). Stop to read a side note and baking pauses (blocking script)." },
    visual: { type: "timeline", title: "One page load, start to finish", frames: [
      { label: "0 ms", state: "DNS + TCP + TLS", note: "Find the server and open a secure connection." },
      { label: "80 ms", state: "GET /recipes → waiting", note: "Server queries the database and builds the reply (time to first byte)." },
      { label: "200 ms", state: "HTML streaming in", note: "Browser parses as it arrives, building the DOM tree." },
      { label: "220 ms", state: "CSS + JS requested", note: "`<link>` blocks rendering; plain `<script>` blocks parsing." },
      { label: "400 ms", state: "DOM + CSSOM → render tree", note: "Browser combines structure and styles, works out sizes (layout)." },
      { label: "450 ms", state: "First paint 🎉", note: "Pixels on screen. Images may still load in afterwards." }
    ]},
    points: [
      "**Network half:** DNS → connection → request → server work → response.",
      "**Browser half (critical rendering path):** HTML → DOM, CSS → CSSOM, combine → layout → paint.",
      "CSS is **render-blocking**: nothing paints until stylesheets in `<head>` load.",
      "A plain `<script>` is **parser-blocking**. `defer` downloads in parallel and runs after parsing.",
      "**In React:** Vite adds `<script type=\"module\">`, which is deferred by default, so React starts after the HTML is parsed."
    ],
    code: { file: "index.html", lang: "html", src: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Recipe Box</title>

  <!-- Render-blocking: page won't paint until this loads -->
  <link rel="stylesheet" href="/styles.css" />

  <!-- Deferred: downloads now, runs after HTML is parsed -->
  <script src="/app.js" defer></script>

  <!-- Modules are deferred automatically (this is what Vite emits) -->
  <script type="module" src="/main.js"></script>
</head>
<body>
  <h1>Today's recipes</h1>
  <img src="/pancakes.jpg" alt="Pancakes" width="400" height="300" />
  <div id="root"></div>
</body>
</html>`, walk: [
      { lines: [9], note: "Stylesheet in the head: the browser waits for it before the first paint (avoids unstyled flash)." },
      { lines: [12], note: "`defer`: no parsing pause; runs in order once the DOM is ready." },
      { lines: [15], note: "`type=\"module\"` behaves like `defer`. React's entry file loads this way." },
      { lines: [19], note: "Images don't block paint. Width/height reserve space so the layout doesn't jump." },
      { lines: [20], note: "The empty root a React app fills in once its JS runs." }
    ]},
    output: "The heading paints as soon as styles.css arrives; the image fills in when downloaded; scripts run after parsing.",
    mistakes: [
      { bad: `<head>\n  <script src="/big-library.js"></script>\n</head>`, good: `<head>\n  <script src="/big-library.js" defer></script>\n</head>`, why: "A plain script in the head stops HTML parsing until it downloads and runs, so users stare at a blank page." },
      { bad: `<img src="/hero.jpg" alt="Shop banner" />`, good: `<img src="/hero.jpg" alt="Shop banner" width="1200" height="400" />`, why: "Without dimensions the page jumps when the image loads (layout shift)." }
    ],
    practice: [
      { level: "B", q: "Which is render-blocking by default: CSS, images, or `defer` scripts?", a: "CSS in the head. Images and deferred scripts are not." },
      { level: "I", q: "Difference between `async` and `defer`?", a: "Both download in parallel. `async` runs as soon as it arrives (any order); `defer` waits for parsing and keeps order." },
      { level: "I", q: "In DevTools → Performance, record a reload. Find 'Layout' and 'Paint'.", a: "They appear in the Main thread after 'Parse HTML' and 'Recalculate Style'." },
      { level: "C", q: "Why does a client-rendered React page show a blank screen on slow 3G?", a: "The HTML has only `<div id=\"root\">`. Nothing meaningful paints until the JS bundle downloads and React renders." }
    ],
    quiz: [
      { q: "What does a plain `<script>` in the `<head>` do?", options: ["Runs after the page loads", "Pauses HTML parsing until it loads and runs", "Nothing until clicked", "Runs on the server"], answer: 1, why: "Classic scripts are parser-blocking because they might change the document." },
      { q: "Which comes first?", options: ["Paint", "Layout", "Building the DOM"], answer: 2, why: "DOM (and CSSOM) → render tree → layout → paint." },
      { q: "`<script type=\"module\">` is…", options: ["Parser-blocking", "Deferred by default", "Ignored by browsers"], answer: 1, why: "Module scripts behave like `defer`, which is why Vite apps don't block parsing." }
    ],
    rev: {
      sec30: "A request goes through DNS, connection, server processing and response. The browser then runs the critical rendering path: parse HTML to DOM, CSS to CSSOM, combine into a render tree, compute layout, paint. CSS blocks rendering; classic scripts block parsing unless `defer`/`async`/`type=module`.",
      interview: [
        { level: "basic", q: "What is the critical rendering path?", a: "The steps from bytes to pixels: DOM, CSSOM, render tree, layout, paint (then compositing)." },
        { level: "intermediate", q: "async vs defer?", a: "Both fetch in parallel. async executes immediately when ready and unordered; defer executes in order after parsing finishes." },
        { level: "intermediate", q: "What is TTFB?", a: "Time to first byte: from sending the request to receiving the first byte of the response. Mostly network + server work." },
        { level: "advanced", q: "How would you speed up first paint of a React SPA?", a: "Smaller bundles via code splitting, preloading key assets, caching, or SSR/static HTML so content paints before JS runs." }
      ],
      predict: [
        { code: `<script>console.log(document.querySelector('h1'));</script>\n<h1>Menu</h1>`, answer: "null", why: "The script runs before the parser reaches the `<h1>`, so it doesn't exist yet. `defer` would fix it." }
      ],
      cheat: [
        "Network: DNS → TCP/TLS → request → TTFB → response",
        "Browser: DOM + CSSOM → render tree → layout → paint",
        "CSS in head = render-blocking",
        "Plain script = parser-blocking",
        "defer: parallel download, ordered, after parse",
        "type=module = deferred by default (Vite)"
      ]
    },
    related: ["WEB-001", "WEB-005", "PERF-020", "INTRO-011"]
  },

  "WEB-005": {
    tldr: "HTML describes what's on the page using elements (tags) with attributes (extra settings). Nest them to build a tree: headings, text, links, images and forms.",
    analogy: { icon: "🏷️", text: "Labels on a recipe card: this is the title, this is an ingredient list, this is a photo. HTML labels content; CSS decides how it looks." },
    visual: { type: "tree", title: "A page is a tree of elements", root: { label: "html", note: "lang=\"en\"", children: [
      { label: "head", children: [ { label: "title" }, { label: "meta charset" } ] },
      { label: "body", children: [
        { label: "h1", note: "page title" },
        { label: "img", note: "src + alt" },
        { label: "a", note: "href" },
        { label: "form", children: [ { label: "label" }, { label: "input" }, { label: "button" } ] }
      ]}
    ]}},
    points: [
      "**Element** = opening tag + content + closing tag: `<p>Hello</p>`. Some are empty (void): `<img>`, `<input>`, `<br>`.",
      "**Attributes** configure an element: `href` for links, `src` + `alt` for images, `type` and `name` for inputs.",
      "`<head>` holds info about the page (title, meta, CSS links); `<body>` holds what users see.",
      "Every input needs a `<label>` (click the label to focus the input; screen readers read it).",
      "**In React:** JSX looks like HTML, but `class` becomes `className` and `for` becomes `htmlFor`."
    ],
    code: { file: "index.html", lang: "html", src: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Bean There Coffee</title>
</head>
<body>
  <h1>Bean There Coffee</h1>
  <p>Fresh beans, roasted every <strong>Monday</strong>.</p>

  <img src="beans.jpg" alt="A bag of roasted coffee beans" width="300" />

  <p><a href="/menu.html">See the menu</a> or
     <a href="https://maps.example.com" target="_blank" rel="noopener">find us</a>.</p>

  <h2>Join our newsletter</h2>
  <form action="/subscribe" method="post">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />

    <label for="size">Favourite size</label>
    <select id="size" name="size">
      <option>Small</option>
      <option>Large</option>
    </select>

    <button type="submit">Subscribe</button>
  </form>
</body>
</html>`, walk: [
      { lines: [1, 2], note: "`<!doctype html>` turns on modern standards mode; `lang` helps screen readers and translation." },
      { lines: [11], note: "`<img>` is a void element. `alt` describes it for screen readers and when it fails to load." },
      { lines: [13, 14], note: "Links: relative path for your own pages, `target=\"_blank\"` + `rel=\"noopener\"` for a new tab." },
      { lines: [17], note: "`action` = where to send, `method` = how. Without JS the browser submits and reloads." },
      { lines: [18, 19], note: "`for` matches the input's `id`. `type=\"email\"` + `required` give free browser validation." },
      { lines: [27], note: "A submit button sends the form's `name=value` pairs." }
    ]},
    output: "A page with a heading, a paragraph with bold text, a coffee image, two links, and a newsletter form that refuses to submit without a valid email.",
    mistakes: [
      { bad: `<img src="mug.jpg">`, good: `<img src="mug.jpg" alt="White ceramic coffee mug">`, why: "Without `alt`, screen-reader users hear only the file name. Use `alt=\"\"` for purely decorative images." },
      { bad: `Email <input type="email">`, good: `<label for="email">Email</label>\n<input id="email" type="email">`, why: "Loose text isn't linked to the input; a `<label>` is clickable and announced by assistive tech." },
      { bad: `<p>Price: <b>£12</p></b>`, good: `<p>Price: <strong>£12</strong></p>`, why: "Tags must close in reverse order (properly nested). Browsers guess when you don't, often wrongly." }
    ],
    practice: [
      { level: "B", q: "Add a link to `/cart.html` labelled 'View cart'.", a: "`<a href=\"/cart.html\">View cart</a>`" },
      { level: "B", q: "Add a required name field to the form.", a: "Label + input with matching `for`/`id`.", code: `<label for="name">Name</label>\n<input id="name" name="name" required />` },
      { level: "I", q: "Add an unordered list of three drinks.", a: "Use `<ul>` with `<li>` children.", code: `<ul>\n  <li>Latte</li>\n  <li>Flat white</li>\n  <li>Mocha</li>\n</ul>` },
      { level: "C", q: "Rewrite the email label + input as JSX. What changes?", a: "`for` → `htmlFor`, void tags must self-close (`<input />`), and attributes like `class` → `className`." }
    ],
    quiz: [
      { q: "Which attribute gives an image a text description?", options: ["title", "alt", "src", "name"], answer: 1, why: "`alt` is read by screen readers and shown if the image fails." },
      { q: "How does a `<label>` connect to an `<input>`?", options: ["Same `name`", "Label's `for` = input's `id`", "Label must come after the input", "They can't be linked"], answer: 1, why: "`for`/`id` pairing (or wrapping the input inside the label)." },
      { q: "Which belongs in `<head>`?", options: ["`<title>`", "`<h1>`", "`<form>`"], answer: 0, why: "The head holds metadata; visible content goes in the body." }
    ],
    rev: {
      sec30: "HTML is the page's structure: nested elements with attributes form a tree (the DOM). The head holds metadata, the body holds content. Key elements: headings, paragraphs, links (`href`), images (`src`, `alt`) and forms (labelled inputs, a submit button, `action` and `method`).",
      interview: [
        { level: "basic", q: "Element vs attribute?", a: "An element is a tagged piece of content (`<a>…</a>`); an attribute is a name=value setting on it (`href=\"/menu\"`)." },
        { level: "basic", q: "What does `<!doctype html>` do?", a: "Tells the browser to use standards mode instead of quirks mode." },
        { level: "intermediate", q: "What happens when a form submits without JavaScript?", a: "The browser builds `name=value` pairs and navigates to `action` using `method`, causing a full page load." },
        { level: "tricky", q: "Why `rel=\"noopener\"` with `target=\"_blank\"`?", a: "It stops the new tab getting `window.opener` access to your page. Modern browsers imply it, but being explicit is safe." }
      ],
      cheat: [
        "Element = tag + content; void elements have no closing tag",
        "Attributes: href, src, alt, id, class, type, name",
        "head = metadata, body = content",
        "label for = input id",
        "form action + method; button type=\"submit\"",
        "JSX: className, htmlFor, self-close <img />"
      ]
    },
    related: ["WEB-006", "WEB-034", "JSX-003", "EVT-005"]
  },

  "WEB-006": {
    tldr: "Semantic HTML uses tags that say what content *is* (`header`, `nav`, `main`, `article`) instead of anonymous `div`s. Screen readers, search engines and your teammates all understand the page better.",
    analogy: { icon: "📚", text: "A cookbook with chapter titles, a contents page and an index versus a pile of loose pages. Same recipes; only one is easy to navigate." },
    visual: { type: "compare", title: "Div soup vs semantic", left: { label: "Div soup", tone: "bad", points: [
      "`<div class=\"top\">`, `<div class=\"menu\">`…",
      "Screen readers can't jump to the menu or main content",
      "Search engines guess what matters",
      "`<div onclick>` isn't keyboard-focusable"
    ]}, right: { label: "Semantic", tone: "good", points: [
      "`<header>`, `<nav>`, `<main>`, `<footer>` = landmarks",
      "Users can skip straight to `<main>`",
      "`<article>` + headings show the content outline",
      "`<button>` works with keyboard for free"
    ]}},
    points: [
      "`<header>` intro/branding · `<nav>` main links · `<main>` the one main content area per page · `<footer>` closing info.",
      "`<article>` = stands alone (a recipe, a blog post, a product card). `<section>` = a themed group with its own heading.",
      "Use headings in order (`h1` → `h2` → `h3`); they form the page outline.",
      "Use `<button>` for actions and `<a href>` for navigation. Never a clickable `<div>`.",
      "**In React:** components should return semantic tags too. `<Card>` can render an `<article>`."
    ],
    code: { file: "recipes.html", lang: "html", src: `<body>
  <header>
    <h1>Weeknight Recipes</h1>
    <nav aria-label="Main">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/favourites">Favourites</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h2>Quick dinners</h2>

      <article>
        <h3>Garlic butter pasta</h3>
        <p>Ready in 15 minutes.</p>
        <button type="button">Save to favourites</button>
      </article>

      <article>
        <h3>Veggie stir-fry</h3>
        <p>Ready in 20 minutes.</p>
        <button type="button">Save to favourites</button>
      </article>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Weeknight Recipes</p>
  </footer>
</body>`, walk: [
      { lines: [2, 3], note: "`<header>` holds the site title. One `h1` per page names it." },
      { lines: [4], note: "`<nav>` is a landmark. `aria-label` names it if you have several navs." },
      { lines: [12], note: "`<main>`: the unique content. Screen-reader users can jump straight here." },
      { lines: [13, 14], note: "`<section>` groups related content and always gets a heading." },
      { lines: [16, 20], note: "Each recipe is an `<article>`: it would make sense on its own." },
      { lines: [19], note: "A real `<button>`: focusable, works with Enter and Space." }
    ]},
    output: "Looks like plain text without CSS, but a screen reader announces: banner, navigation 'Main', main, two articles, contentinfo.",
    mistakes: [
      { bad: `<div class="btn" onclick="save()">Save</div>`, good: `<button type="button" onclick="save()">Save</button>`, why: "A div can't be reached with Tab or triggered with Enter. `<button>` gives keyboard and screen-reader support free." },
      { bad: `<h1>Recipes</h1>\n<h4>Quick dinners</h4>`, good: `<h1>Recipes</h1>\n<h2>Quick dinners</h2>`, why: "Skipping levels breaks the outline. Pick heading level by structure; size it with CSS." }
    ],
    practice: [
      { level: "B", q: "Which tag for a product card that could be shared on its own?", a: "`<article>`." },
      { level: "B", q: "Turn `<div class=\"footer\">` into semantic HTML.", a: "`<footer>…</footer>`" },
      { level: "I", q: "When is `<div>` still the right choice?", a: "For pure layout/styling wrappers with no meaning, e.g. a flex container." },
      { level: "C", q: "Write a React `RecipeCard` that returns semantic markup.", a: "Return an `<article>` with a heading and a button.", code: `function RecipeCard({ title, minutes }) {\n  return (\n    <article>\n      <h3>{title}</h3>\n      <p>Ready in {minutes} minutes.</p>\n      <button type="button">Save</button>\n    </article>\n  );\n}` }
    ],
    quiz: [
      { q: "How many `<main>` elements should a page show at once?", options: ["One", "One per section", "As many as you like"], answer: 0, why: "`<main>` marks the single primary content area." },
      { q: "Best tag for the site's top links?", options: ["`<div class=\"links\">`", "`<nav>`", "`<section>`", "`<aside>`"], answer: 1, why: "`<nav>` creates a navigation landmark." },
      { q: "Why prefer `<button>` over a clickable `<div>`?", options: ["It's shorter", "Keyboard focus, Enter/Space and screen-reader role come built in", "Divs can't have onclick"], answer: 1, why: "You'd need tabindex, role and key handlers to fake it with a div." }
    ],
    rev: {
      sec30: "Semantic HTML picks elements by meaning: header, nav, main, article, section, aside, footer, button, proper heading levels. It creates landmarks for assistive tech, a clear outline for SEO, and built-in keyboard behaviour. Use div/span only for styling hooks.",
      interview: [
        { level: "basic", q: "What is semantic HTML?", a: "Using elements that describe their meaning (nav, article, button) rather than generic divs, so browsers, assistive tech and crawlers understand the content." },
        { level: "intermediate", q: "article vs section?", a: "article is self-contained and reusable on its own (a post, a product); section is a themed part of a larger thing and should have a heading." },
        { level: "intermediate", q: "How does semantic HTML help accessibility?", a: "Landmarks and roles let screen-reader users jump around; native controls get focus and keyboard support for free." },
        { level: "advanced", q: "When would you use ARIA?", a: "Only when no native element fits (e.g. a custom tabs widget). First rule of ARIA: prefer the native element." }
      ],
      cheat: [
        "header · nav · main · footer = page landmarks",
        "article = standalone; section = themed group + heading",
        "One main per page; one h1 names the page",
        "Headings in order, styled with CSS",
        "button for actions, a href for navigation",
        "div/span only for layout or styling"
      ]
    },
    related: ["WEB-005", "WEB-007", "COMP-017", "JSX-003"]
  },

  "WEB-007": {
    tldr: "CSS picks elements (selectors) and styles them. Every element is a box (content, padding, border, margin). When rules clash, the cascade decides: importance, then specificity, then source order.",
    analogy: { icon: "🎁", text: "A gift box: the gift (content), bubble wrap (padding), the cardboard (border), and space left around it on the shelf (margin)." },
    visual: { type: "layers", title: "The box model (outside in)", items: [
      { label: "margin", detail: "Space outside the border. Pushes neighbours away; transparent." },
      { label: "border", detail: "The visible edge: `border: 1px solid #ddd`." },
      { label: "padding", detail: "Space between border and content. Takes the background colour." },
      { label: "content", detail: "Text or image. `width`/`height` size this part unless `box-sizing: border-box`." }
    ]},
    points: [
      "**Selectors:** `p` (type), `.card` (class), `#cart` (id), `.card h3` (descendant), `button:hover` (pseudo-class).",
      "**Specificity** score (id, class, type): `#cart` beats `.card.featured` beats `.card` beats `div`. Inline `style` beats all.",
      "**Cascade order:** `!important` → specificity → whichever rule comes **last** wins.",
      "Set `box-sizing: border-box` so `width` includes padding and border (much easier maths).",
      "Some properties **inherit** (color, font); others don't (margin, border).",
      "**In React:** you still write this CSS; you attach it with `className` or CSS Modules."
    ],
    code: { file: "styles.css", lang: "css", src: `/* Make width include padding + border everywhere */
*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: system-ui, sans-serif;
  color: #222;            /* inherited by all text */
}

/* Class selector: every product card */
.card {
  width: 240px;
  padding: 16px;          /* inside the border */
  border: 1px solid #ddd;
  margin: 12px;           /* outside the border */
  border-radius: 8px;
}

/* Descendant selector: headings inside cards */
.card h3 { color: #333; }

/* Two classes = higher specificity, so this wins */
.card.sale h3 { color: crimson; }

/* Pseudo-class: only while hovered */
.card:hover { border-color: #888; }

/* Same specificity as .card, but later: wins for border */
.highlight { border: 2px solid gold; }`, walk: [
      { lines: [2], note: "With border-box the card is exactly 240px wide, padding and border included." },
      { lines: [6], note: "`color` inherits, so every child gets it unless overridden." },
      { lines: [10, 16], note: "The four box layers in one rule: width (content+padding+border), padding, border, margin." },
      { lines: [19, 22], note: "Specificity (0,1,1) vs (0,2,1): the sale rule wins even if it came first." },
      { lines: [28], note: "Equal specificity? Source order decides: the later rule wins." }
    ]},
    output: "Cards 240px wide with a grey border; sale cards have red headings; hovered cards get a darker border; `.highlight` cards get a gold border.",
    mistakes: [
      { bad: `.title { color: red !important; }`, good: `.card .title { color: red; }`, why: "`!important` escalates a specificity war. Prefer a slightly more specific selector or fix the source order." },
      { bad: `.card { width: 240px; padding: 16px; }\n/* actual width: 272px (240 + 2×16) */`, good: `* { box-sizing: border-box; }\n.card { width: 240px; padding: 16px; }`, why: "Default `content-box` adds padding and border on top of width, breaking layouts." },
      { bad: `#product-42 { color: blue; }`, good: `.product { color: blue; }`, why: "IDs are hard to override and not reusable. Style with classes; keep IDs for links and labels." }
    ],
    practice: [
      { level: "B", q: "Give `.card` 24px space inside and 8px outside.", a: "`padding: 24px; margin: 8px;`" },
      { level: "B", q: "Which wins: `.btn` or `button.btn`?", a: "`button.btn` (one class + one type beats one class)." },
      { level: "I", q: "Style only links inside `nav` to have no underline.", a: "Descendant selector.", code: `nav a { text-decoration: none; }` },
      { level: "C", q: "A `.card` is 200px wide, padding 20px, border 2px, default box-sizing. Total width?", a: "244px (200 + 2×20 + 2×2). With border-box it's 200px." }
    ],
    quiz: [
      { q: "Which has the highest specificity?", options: ["`.cart .item`", "`#cart`", "`ul li a`", "`.item:hover`"], answer: 1, why: "One id (1,0,0) beats any number of classes/types." },
      { q: "Two rules with equal specificity set `color`. Which applies?", options: ["The first one", "The last one", "Neither", "The shorter one"], answer: 1, why: "Source order is the final tie-breaker in the cascade." },
      { q: "Padding vs margin?", options: ["Padding is outside the border", "Padding is inside the border, margin outside", "They're identical"], answer: 1, why: "Padding is inner space (gets background); margin is outer space." }
    ],
    rev: {
      sec30: "CSS = selectors + declarations. Each element is a box: content, padding, border, margin; use `box-sizing: border-box`. Conflicts resolve via the cascade: origin/`!important`, then specificity (inline > id > class/attribute/pseudo-class > type), then source order. Some properties inherit.",
      interview: [
        { level: "basic", q: "Explain the box model.", a: "Every element is content surrounded by padding, border and margin. box-sizing decides whether width includes padding and border." },
        { level: "intermediate", q: "How is specificity calculated?", a: "Count ids, then classes/attributes/pseudo-classes, then types/pseudo-elements; compare left to right. Inline styles beat all; !important overrides." },
        { level: "intermediate", q: "What is the cascade?", a: "The algorithm that picks the winning declaration: importance and origin, then specificity, then source order." },
        { level: "tricky", q: "Why might two vertical margins of 20px create only 20px of space?", a: "Margin collapsing: adjacent vertical margins of block elements merge into the larger one. It doesn't happen in flex or grid containers." }
      ],
      cheat: [
        "Box: content → padding → border → margin",
        "box-sizing: border-box everywhere",
        "Specificity: inline > #id > .class/:hover > tag",
        "Tie? Last rule wins",
        "Avoid !important and id selectors for styling",
        "color/font inherit; margin/border don't"
      ]
    },
    related: ["WEB-008", "WEB-010", "STYLE-001", "STYLE-003"]
  },

  "WEB-008": {
    tldr: "Flexbox lays items out in one direction, a row or a column. The parent controls direction, spacing along the line (`justify-content`), alignment across it (`align-items`) and wrapping.",
    analogy: { icon: "🎵", text: "Songs in a playlist bar: line them up left to right, spread them out or bunch them, centre them vertically, and wrap to a second row when the bar gets too narrow." },
    visual: { type: "compare", title: "Two axes", left: { label: "Main axis (justify-content)", tone: "neutral", points: [
      "Direction set by `flex-direction` (row = left→right)",
      "`flex-start` · `center` · `space-between`",
      "`gap` adds space between items",
      "`flex: 1` lets an item grow to fill space"
    ]}, right: { label: "Cross axis (align-items)", tone: "neutral", points: [
      "Perpendicular to the main axis (row → vertical)",
      "`stretch` (default) · `center` · `flex-start`",
      "`flex-wrap: wrap` creates new lines",
      "`align-self` overrides it for one item"
    ]}},
    points: [
      "Put `display: flex` on the **parent**; its direct children become flex items.",
      "`flex-direction: row` (default) or `column`. Swapping it swaps which axis `justify`/`align` control.",
      "Centre anything: `display: flex; justify-content: center; align-items: center;`",
      "`flex-wrap: wrap` + `gap` = a simple responsive row of cards.",
      "**In React:** a `Navbar` or `CartRow` component is usually just a flex container with a `className`."
    ],
    code: { file: "navbar.css", lang: "css", src: `/* <nav class="navbar">
     <span class="logo">Shop</span>
     <input class="search" placeholder="Search" />
     <a href="/cart">Cart (2)</a>
   </nav> */

.navbar {
  display: flex;
  align-items: center;            /* vertically centred */
  gap: 16px;                      /* space between items */
  padding: 12px 16px;
}

.search {
  flex: 1;                        /* grow to fill free space */
}

/* Product cards that wrap onto new rows */
.products {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.products > .card {
  flex: 1 1 200px;                /* grow, shrink, start at 200px */
  max-width: 300px;
}

/* Perfect centring of an empty-cart message */
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}`, walk: [
      { lines: [7, 9], note: "The navbar is a row; `align-items: center` lines up logo, input and link vertically." },
      { lines: [10], note: "`gap` spaces items without margin hacks." },
      { lines: [14, 16], note: "`flex: 1` makes the search box take all leftover width." },
      { lines: [19, 24], note: "Cards wrap onto new lines and the rows are centred." },
      { lines: [26, 29], note: "`flex: 1 1 200px`: ideal width 200px, may grow or shrink." },
      { lines: [32, 38], note: "Column direction: now `justify-content` is vertical and `align-items` horizontal." }
    ]},
    output: "A navbar with the search box stretching between logo and cart; a centred, wrapping grid-like row of product cards; an empty-cart message centred in the page.",
    mistakes: [
      { bad: `.card { display: flex; justify-content: center; }\n/* trying to centre the cards in .products */`, good: `.products { display: flex; justify-content: center; }`, why: "Flex properties go on the parent. Setting them on the card affects the card's own children." },
      { bad: `.list { display: flex; flex-direction: column;\n  justify-content: center; } /* expecting horizontal centring */`, good: `.list { display: flex; flex-direction: column;\n  align-items: center; }`, why: "In a column the main axis is vertical, so horizontal centring is `align-items`." }
    ],
    practice: [
      { level: "B", q: "Push the cart link to the far right of a navbar with only a logo and the link.", a: "`justify-content: space-between` on the nav (or `margin-left: auto` on the link)." },
      { level: "B", q: "Stack todo items vertically with 8px between them.", a: "Column flex with gap.", code: `.todos { display: flex; flex-direction: column; gap: 8px; }` },
      { level: "I", q: "Why does `align-items: center` seem to do nothing on a navbar?", a: "The container is only as tall as its tallest item. Give it a height, or the items already share one height." },
      { level: "C", q: "Make one chat bubble align right in a column of bubbles.", a: "`align-self: flex-end` on that bubble." }
    ],
    quiz: [
      { q: "In `flex-direction: row`, `justify-content` controls…", options: ["Vertical alignment", "Horizontal distribution", "Wrapping"], answer: 1, why: "It works along the main axis, horizontal in a row." },
      { q: "Where do you put `display: flex`?", options: ["On each child", "On the parent container", "On the body only"], answer: 1, why: "The parent becomes the flex container; its direct children are items." },
      { q: "What does `flex: 1` on the search input do?", options: ["Sets width to 1px", "Lets it grow to fill free space", "Hides it", "Puts it first"], answer: 1, why: "flex-grow 1 claims leftover space on the line." }
    ],
    rev: {
      sec30: "Flexbox is one-dimensional layout. `display: flex` on a parent; `flex-direction` sets the main axis; `justify-content` distributes along it, `align-items` aligns across it; `flex-wrap` allows new lines; `gap` spaces items; `flex: grow shrink basis` sizes children.",
      interview: [
        { level: "basic", q: "How do you centre a div horizontally and vertically?", a: "On the parent: `display: flex; justify-content: center; align-items: center;` (plus a height)." },
        { level: "intermediate", q: "justify-content vs align-items?", a: "justify-content works along the main axis, align-items along the cross axis. Which is horizontal depends on flex-direction." },
        { level: "intermediate", q: "What does `flex: 1` expand to?", a: "flex-grow 1, flex-shrink 1, flex-basis 0%, so items share free space equally." },
        { level: "advanced", q: "Flexbox vs Grid: when to use which?", a: "Flexbox for one direction driven by content (navbars, toolbars). Grid for two-dimensional layouts where rows and columns line up." }
      ],
      cheat: [
        "display: flex on the parent",
        "flex-direction: row | column",
        "justify-content = main axis",
        "align-items = cross axis",
        "flex-wrap: wrap + gap for card rows",
        "flex: 1 = grow into free space",
        "align-self overrides one item"
      ]
    },
    related: ["WEB-007", "WEB-009", "WEB-010", "STYLE-012"]
  },

  "WEB-009": {
    tldr: "CSS Grid lays out rows and columns at the same time. Define the tracks on the parent (`grid-template-columns`), optionally name areas, and items snap into the cells.",
    analogy: { icon: "🍫", text: "A chocolate box tray: fixed rows and columns of slots, and some treats can take up two slots at once. You design the tray first, then drop things in." },
    visual: { type: "compare", title: "Flexbox vs Grid", left: { label: "Flexbox", tone: "neutral", points: [
      "One direction at a time",
      "Content decides the sizes",
      "Great for navbars, button rows",
      "Rows don't line up with each other"
    ]}, right: { label: "Grid", tone: "good", points: [
      "Rows **and** columns together",
      "Layout decides the sizes",
      "Great for page layouts, galleries, dashboards",
      "`grid-template-areas` draws the layout in text"
    ]}},
    points: [
      "`display: grid` + `grid-template-columns: 200px 1fr` = a fixed sidebar and a flexible main area.",
      "`fr` = a share of free space. `repeat(3, 1fr)` = three equal columns.",
      "`repeat(auto-fill, minmax(180px, 1fr))` = as many columns as fit: responsive with no media query.",
      "`grid-template-areas` names regions; children pick one with `grid-area`.",
      "**In React:** a `Layout` component often renders `header`, `aside`, `main` placed by grid areas."
    ],
    code: { file: "layout.css", lang: "css", src: `/* <div class="page">
     <header>…</header> <aside>Filters</aside>
     <main>Products</main> <footer>…</footer>
   </div> */

.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "filters main"
    "footer footer";
  gap: 16px;
  min-height: 100vh;
}

header { grid-area: header; }
aside  { grid-area: filters; }
main   { grid-area: main; }
footer { grid-area: footer; }

/* Product gallery: fits as many 180px+ columns as possible */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

/* A featured product spans two columns */
.gallery .featured {
  grid-column: span 2;
}`, walk: [
      { lines: [8], note: "Two columns: a fixed 220px filter sidebar and a main area taking the rest (`1fr`)." },
      { lines: [9], note: "Three rows: header and footer size to content; the middle row stretches." },
      { lines: [10, 13], note: "An ASCII drawing of the layout. Each string is a row." },
      { lines: [18, 21], note: "Each child claims its named area. HTML order no longer dictates position." },
      { lines: [26], note: "`auto-fill` + `minmax`: 1-2 columns on a phone, many on a wide screen, no media queries." },
      { lines: [31, 33], note: "One item can span multiple tracks." }
    ]},
    output: "Header across the top, filters on the left, products on the right, footer at the bottom. The product gallery reflows its column count with the window width.",
    mistakes: [
      { bad: `grid-template-areas:\n  "header header"\n  "filters";`, good: `grid-template-areas:\n  "header header"\n  "filters main";`, why: "Every row string must have the same number of cells, or the whole declaration is ignored." },
      { bad: `.gallery { display: grid;\n  grid-template-columns: 180px 180px 180px 180px; }`, good: `.gallery { display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }`, why: "Fixed columns overflow on phones. `auto-fill` + `minmax` adapts automatically." }
    ],
    practice: [
      { level: "B", q: "Make a 3-column equal grid of recipe cards with 20px gaps.", a: "`repeat(3, 1fr)` plus gap.", code: `.recipes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }` },
      { level: "B", q: "What does `1fr 2fr` mean?", a: "Split free space into 3 parts: the first column gets 1, the second 2." },
      { level: "I", q: "Make the filters sidebar sit on the right instead.", a: "Swap the area names: `\"main filters\"` and adjust columns to `1fr 220px`. No HTML change." },
      { level: "C", q: "Build a phone layout with header, main, footer stacked in one column.", a: "One column and one area per row.", code: `.page {\n  grid-template-columns: 1fr;\n  grid-template-areas: "header" "main" "footer";\n}` }
    ],
    quiz: [
      { q: "What is `fr`?", options: ["Frame", "A fraction of the free space", "Font ratio", "Fixed rem"], answer: 1, why: "Fractional units divide leftover space between tracks." },
      { q: "Grid is best when…", options: ["Items flow in one line", "You need rows and columns to line up", "You only need to centre text"], answer: 1, why: "Grid is two-dimensional; flexbox is one-dimensional." },
      { q: "`repeat(auto-fill, minmax(180px, 1fr))` gives…", options: ["Always 180px columns", "As many columns of at least 180px as fit", "One column"], answer: 1, why: "Columns are at least 180px and stretch to fill the row." }
    ],
    rev: {
      sec30: "CSS Grid is two-dimensional. Define tracks on the container with `grid-template-columns`/`rows` (px, %, `fr`, `repeat`, `minmax`), name regions with `grid-template-areas`, place children with `grid-area` or `grid-column: span n`. `auto-fill` + `minmax` builds responsive galleries without media queries.",
      interview: [
        { level: "basic", q: "Grid vs Flexbox?", a: "Grid controls rows and columns together (layout-first); flexbox handles one axis (content-first). They combine well." },
        { level: "intermediate", q: "What does `grid-template-areas` do?", a: "Names cells with strings so you can place children by name, and change the layout in CSS alone." },
        { level: "intermediate", q: "auto-fill vs auto-fit?", a: "Both create as many tracks as fit. auto-fill keeps empty tracks; auto-fit collapses them so items stretch across the row." },
        { level: "tricky", q: "Can grid reorder items visually? Any downside?", a: "Yes, but keyboard and screen-reader order still follows the HTML. Keep source order logical." }
      ],
      cheat: [
        "display: grid on the parent",
        "grid-template-columns: 220px 1fr",
        "fr = share of free space",
        "repeat(auto-fill, minmax(180px, 1fr)) = responsive",
        "grid-template-areas + grid-area = named layout",
        "grid-column: span 2 to stretch an item",
        "gap works in grid and flex"
      ]
    },
    related: ["WEB-008", "WEB-010", "STYLE-012", "STYLE-008"]
  },

  "WEB-010": {
    tldr: "Responsive design makes one page fit every screen. Start with the phone layout (mobile-first), use flexible units (`%`, `rem`, `fr`), and add media queries (`@media`) as the screen gets wider.",
    analogy: { icon: "💧", text: "Water takes the shape of its glass. A responsive page is the same content poured into a phone, a tablet or a big monitor." },
    visual: { type: "timeline", title: "One shop page, growing screen", frames: [
      { label: "360px phone", state: "1 column, burger menu", note: "Base CSS, no media query. Big tap targets." },
      { label: "640px", state: "2 product columns", note: "`@media (min-width: 640px)` kicks in." },
      { label: "1024px laptop", state: "Sidebar + 3 columns", note: "Filters move beside the products; full nav shows." },
      { label: "1440px", state: "Content capped at 1200px", note: "`max-width` + `margin: auto` stops lines getting too long." }
    ]},
    points: [
      "Add `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` or phones pretend to be 980px wide.",
      "**Mobile-first:** base styles for small screens, then `@media (min-width: …)` to add for bigger ones.",
      "**Relative units:** `rem` (root font size) for text and spacing, `%`/`fr` for widths, `vh`/`vw` for viewport.",
      "Images: `max-width: 100%; height: auto;` so they never overflow.",
      "`clamp(min, preferred, max)` scales font size smoothly between limits.",
      "**In React:** prefer CSS media queries; use JS `matchMedia` only when the component tree itself must change."
    ],
    code: { file: "shop.css", lang: "css", src: `/* Base = phone (mobile-first) */
.products {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

img { max-width: 100%; height: auto; }

h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }

.filters { display: none; }      /* hidden on phones */

/* Tablets and up */
@media (min-width: 640px) {
  .products { grid-template-columns: repeat(2, 1fr); }
}

/* Laptops and up */
@media (min-width: 1024px) {
  .shop {
    display: grid;
    grid-template-columns: 240px 1fr;
  }
  .filters { display: block; }
  .products { grid-template-columns: repeat(3, 1fr); }
}

/* Keep lines readable on huge screens */
.shop { max-width: 1200px; margin-inline: auto; }`, walk: [
      { lines: [2, 7], note: "No media query: this is the phone layout, one column." },
      { lines: [9], note: "Images shrink with their container and never overflow." },
      { lines: [11], note: "Heading grows with the viewport but stays between 1.5rem and 2.5rem." },
      { lines: [16, 18], note: "`min-width` query: from 640px up, two columns." },
      { lines: [21, 28], note: "From 1024px: sidebar appears and products go to three columns." },
      { lines: [31], note: "Cap the width and centre it so wide monitors don't stretch everything." }
    ]},
    output: "Resize the window: 1 column on phones, 2 on tablets, filters sidebar + 3 columns on laptops, centred and capped on large screens.",
    mistakes: [
      { bad: `<!-- no viewport meta tag -->\n<head><title>Shop</title></head>`, good: `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>`, why: "Without it, mobile browsers render at desktop width and zoom out, so media queries never match." },
      { bad: `.card { width: 400px; }`, good: `.card { width: 100%; max-width: 400px; }`, why: "Fixed widths overflow small screens and cause horizontal scrolling." },
      { bad: `@media (max-width: 1023px) { … }\n@media (max-width: 639px) { … }`, good: `/* base = phone */\n@media (min-width: 640px) { … }\n@media (min-width: 1024px) { … }`, why: "Desktop-first stacks overrides to undo. Mobile-first only adds, so the CSS stays smaller and simpler." }
    ],
    practice: [
      { level: "B", q: "Make the cart table scroll sideways on phones instead of breaking the page.", a: "Wrap it: `.table-wrap { overflow-x: auto; }`." },
      { level: "B", q: "Why use `rem` rather than `px` for font sizes?", a: "`rem` follows the user's browser font setting, so text scales for people who need bigger type." },
      { level: "I", q: "Show the full nav from 768px up, burger below.", a: "Hide the nav by default; show it in a `min-width` query.", code: `.nav-links { display: none; }\n@media (min-width: 768px) {\n  .nav-links { display: flex; }\n  .burger { display: none; }\n}` },
      { level: "C", q: "Write a React hook that returns `true` on screens 1024px+.", a: "Use `matchMedia` with a change listener.", code: `import { useEffect, useState } from 'react';\n\nexport function useIsDesktop() {\n  const query = '(min-width: 1024px)';\n  const [match, setMatch] = useState(() => matchMedia(query).matches);\n  useEffect(() => {\n    const mql = matchMedia(query);\n    const onChange = e => setMatch(e.matches);\n    mql.addEventListener('change', onChange);\n    return () => mql.removeEventListener('change', onChange);\n  }, []);\n  return match;\n}` }
    ],
    quiz: [
      { q: "Mobile-first means…", options: ["Only support phones", "Base CSS for small screens, `min-width` queries add for larger", "Use `max-width` queries everywhere", "Build a separate mobile site"], answer: 1, why: "You start small and progressively enhance." },
      { q: "What breaks without the viewport meta tag?", options: ["Nothing", "Phones render at ~980px and zoom out", "CSS stops loading"], answer: 1, why: "The page looks tiny and your phone media queries never match." },
      { q: "`1rem` equals…", options: ["The parent's font size", "The root (`html`) font size, usually 16px", "1% of the viewport"], answer: 1, why: "`em` is relative to the parent; `rem` to the root." }
    ],
    rev: {
      sec30: "Responsive design = viewport meta tag + fluid layouts (%, fr, flex, grid) + relative units (rem, vw, clamp) + media queries. Mobile-first writes base styles for phones and adds `min-width` breakpoints. Images get `max-width: 100%`.",
      interview: [
        { level: "basic", q: "What is a media query?", a: "A CSS block that applies only when a condition is true, e.g. `@media (min-width: 768px)`." },
        { level: "intermediate", q: "Why mobile-first?", a: "Phones get the lightest CSS, larger screens only add rules, and you design for the hardest constraint first." },
        { level: "intermediate", q: "em vs rem?", a: "em is relative to the element's parent font size (compounds when nested); rem is relative to the root, so it's predictable." },
        { level: "advanced", q: "What are container queries?", a: "`@container` styles a component by its container's size rather than the viewport, ideal for reusable React components placed in different layouts." }
      ],
      cheat: [
        "Viewport meta tag is mandatory",
        "Mobile-first: base CSS + @media (min-width)",
        "rem for type/spacing, %/fr for widths",
        "img { max-width: 100%; height: auto }",
        "clamp(min, fluid, max) for fluid type",
        "max-width + margin-inline: auto to cap width",
        "@container for component-level responsiveness"
      ]
    },
    related: ["WEB-008", "WEB-009", "STYLE-012", "STYLE-008"]
  },

  "WEB-011": {
    tldr: "JavaScript runs in the browser (to make pages interactive) and in Node.js (for servers and tools like Vite). Code is made of statements (do something) and expressions (produce a value).",
    analogy: { icon: "🧾", text: "A recipe has instructions (statements: 'preheat the oven') and amounts (expressions: '2 × 100g'). Only amounts can fill the blank in 'add ___ of flour'." },
    visual: { type: "compare", title: "Statement vs expression", left: { label: "Statement (does)", tone: "neutral", points: [
      "`let total = 0;`",
      "`if (inStock) { … }`",
      "`for (const item of cart) { … }`",
      "Can't be used where a value is expected"
    ]}, right: { label: "Expression (is a value)", tone: "good", points: [
      "`price * qty` → 24",
      "`inStock ? 'Buy' : 'Sold out'`",
      "`items.length > 0` → true",
      "Allowed inside JSX `{ }`"
    ]}},
    points: [
      "**Browser:** `<script type=\"module\">` or the DevTools Console. Has `window`, `document`, `fetch`.",
      "**Node.js:** `node app.js` in a terminal. Has `process`, files, no `document`. Vite and npm run on Node.",
      "Same language (ECMAScript), different environments and built-in APIs.",
      "An **expression** produces a value; a **statement** performs an action. Expressions can sit inside statements.",
      "**In React:** JSX `{ }` takes expressions only, so use a ternary or `&&`, not `if`."
    ],
    code: { file: "cart.js", lang: "js", src: `// Works in Node (node cart.js) AND in the browser console
const cart = [
  { name: 'Latte', price: 3.5, qty: 2 },
  { name: 'Croissant', price: 2.25, qty: 1 },
];

let total = 0;                                   // statement
for (const item of cart) {                       // statement
  total += item.price * item.qty;                // price * qty is an expression
}

const label = total > 5 ? 'Free delivery' : 'Add more';  // expression on the right
console.log(\`Total: £\${total.toFixed(2)} (\${label})\`);

// Which environment am I in?
if (typeof window !== 'undefined') {
  document.title = \`Cart £\${total}\`;           // browser only
} else {
  console.log('Running in Node', process.version); // Node only
}`, walk: [
      { lines: [2, 5], note: "An array of objects: the shape of most real data." },
      { lines: [7, 10], note: "Statements: declare, loop, update. `item.price * item.qty` is an expression inside." },
      { lines: [12], note: "A ternary is an expression, so it can be assigned. An `if` cannot." },
      { lines: [13], note: "Template literal: `\${ }` embeds an expression in a string." },
      { lines: [16, 20], note: "`window`/`document` exist only in the browser; `process` only in Node." }
    ]},
    output: "Total: £9.25 (Free delivery)\nRunning in Node v22.x   (in Node)  or the tab title changes to \"Cart £9.25\" (in the browser)",
    mistakes: [
      { bad: `<p>{if (inStock) { 'Buy' }}</p>`, good: `<p>{inStock ? 'Buy' : 'Sold out'}</p>`, why: "JSX braces need an expression. `if` is a statement, so it's a syntax error." },
      { bad: `// server.js run with node\ndocument.getElementById('cart');`, good: `// Browser code only\ndocument.getElementById('cart');`, why: "Node has no DOM. `document is not defined` means browser code ran in Node." }
    ],
    practice: [
      { level: "B", q: "Is `qty > 0` a statement or an expression?", a: "Expression: it produces `true` or `false`." },
      { level: "B", q: "Run `cart.js` with Node, then paste it into the browser console. What differs?", a: "Same total; Node logs its version, the browser changes the tab title." },
      { level: "I", q: "Rewrite as an expression: `let msg; if (n === 0) msg = 'Empty'; else msg = n + ' items';`", a: "`const msg = n === 0 ? 'Empty' : n + ' items';`" },
      { level: "C", q: "Why can Vite (a Node program) build code that uses `document`?", a: "Vite only reads and bundles the code; it never executes the browser parts. They run later in the browser." }
    ],
    quiz: [
      { q: "Which one is an expression?", options: ["`if (a) {}`", "`for (;;) {}`", "`a ? 'x' : 'y'`", "`let x;`"], answer: 2, why: "The ternary produces a value; the others are statements." },
      { q: "`document` is available in…", options: ["Node only", "The browser only", "Both"], answer: 1, why: "The DOM is a browser API, not part of the JS language." },
      { q: "What runs Vite and npm?", options: ["The browser", "Node.js", "The React runtime"], answer: 1, why: "Build tools are Node programs; your app code runs in the browser." }
    ],
    rev: {
      sec30: "JavaScript (ECMAScript) runs in browsers (DOM, window, fetch) and in Node.js (files, process, servers, build tools). Programs are statements (declarations, if, loops) that perform actions, containing expressions that evaluate to values. JSX braces accept expressions only.",
      interview: [
        { level: "basic", q: "Where can JavaScript run?", a: "Browsers, Node.js (and Deno/Bun), plus embedded places like workers. Same language, different built-in APIs." },
        { level: "basic", q: "Statement vs expression?", a: "An expression evaluates to a value (`a + b`); a statement performs an action (`if`, `for`, `let x = …`)." },
        { level: "intermediate", q: "Why does JSX reject `if` inside braces?", a: "JSX compiles to function calls, and braces become arguments, which must be expressions. Use ternary, `&&`, or an `if` before the return." },
        { level: "tricky", q: "Is `x = 5` an expression?", a: "Yes. Assignment is an expression that evaluates to 5; as a line on its own it's an expression statement." }
      ],
      cheat: [
        "Browser: window, document, fetch, DOM",
        "Node: process, fs, servers, Vite, npm",
        "Expression = produces a value",
        "Statement = does something (if, for, let)",
        "JSX { } accepts expressions only",
        "Run JS: browser console, <script type=\"module\">, node file.js"
      ]
    },
    related: ["WEB-012", "WEB-015", "JSX-006", "ENV-001"]
  },

  "WEB-012": {
    tldr: "Use `const` by default, `let` when the value must change, and avoid `var`. `let`/`const` live inside the nearest `{ }` block; `var` leaks out to the whole function.",
    analogy: { icon: "📦", text: "`const` is a labelled box glued to its shelf: you can't swap the box, but you can change what's inside. `let` is a box you can replace. `var` is a box that wanders out of its room." },
    visual: { type: "compare", title: "var vs let / const", left: { label: "var (old)", tone: "bad", points: [
      "Function-scoped: ignores `{ }` blocks",
      "Hoisted as `undefined`",
      "Can be redeclared silently",
      "Loops share one variable"
    ]}, right: { label: "let / const (modern)", tone: "good", points: [
      "Block-scoped: lives inside `{ }`",
      "Error if used before declaration (TDZ)",
      "Redeclaring is an error",
      "Each loop iteration gets a fresh copy"
    ]}},
    points: [
      "`const` = can't **reassign** the name. It does **not** freeze objects or arrays.",
      "`let` = can reassign (counters, running totals).",
      "**Block scope:** a `let` inside `if { }` doesn't exist outside it. `var` does.",
      "Reading `let`/`const` before its line throws (temporal dead zone).",
      "**In React:** state is `const [count, setCount]`; you never reassign it, you call the setter."
    ],
    code: { file: "scope.js", lang: "js", src: `const shop = 'Bean There';     // never reassigned
let basketCount = 0;           // will change
basketCount += 2;

const cart = ['latte'];
cart.push('muffin');           // OK: contents change, binding doesn't
// cart = [];                  // TypeError: Assignment to constant variable

if (basketCount > 0) {
  var oldStyle = 'leaks out';
  let modern = 'stays inside';
}
console.log(oldStyle);         // 'leaks out'
// console.log(modern);        // ReferenceError: modern is not defined

// The classic loop puzzle
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j), 0);
}`, walk: [
      { lines: [1, 3], note: "`const` for fixed names, `let` for values that change." },
      { lines: [5, 7], note: "A `const` array can be mutated; only reassigning the name fails." },
      { lines: [9, 14], note: "`var` escapes the `if` block; `let` is gone after the closing brace." },
      { lines: [17, 19], note: "One shared `i`. By the time timers run, it's 3: logs `var 3` three times." },
      { lines: [20, 22], note: "`let` makes a new `j` per iteration: logs `let 0`, `let 1`, `let 2`." }
    ]},
    output: "leaks out\nvar 3\nvar 3\nvar 3\nlet 0\nlet 1\nlet 2",
    mistakes: [
      { bad: `const total = 0;\nfor (const p of prices) total += p;`, good: `let total = 0;\nfor (const p of prices) total += p;`, why: "`total` is reassigned, so it must be `let`. (`const p` in the loop is fine: a new binding each iteration.)" },
      { bad: `const settings = { theme: 'dark' };\n// "const means settings can't change"`, good: `const settings = Object.freeze({ theme: 'dark' });`, why: "`const` only protects the binding. Use `Object.freeze` (shallow) if you need the object itself read-only." }
    ],
    practice: [
      { level: "B", q: "Pick `const` or `let`: a username read once; a timer countdown.", a: "Username: `const`. Countdown: `let` (it's reassigned)." },
      { level: "B", q: "What happens? `const tax = 0.2; tax = 0.25;`", a: "TypeError: Assignment to constant variable." },
      { level: "I", q: "Fix the `var` loop without changing `var` to `let`.", a: "Pass `i` as an argument so each timer gets its own copy.", code: `for (var i = 0; i < 3; i++) {\n  setTimeout(n => console.log(n), 0, i);\n}` },
      { level: "C", q: "Why is `let count = 0; count++` inside a React component a bug?", a: "The component function re-runs every render, so `count` resets to 0, and changing it doesn't trigger a re-render. Use `useState`." }
    ],
    quiz: [
      { q: "`const items = []; items.push('tea');` result?", options: ["TypeError", "Works: items is ['tea']", "SyntaxError"], answer: 1, why: "`const` stops reassignment, not mutation." },
      { q: "Where can `let x` declared inside an `if` block be used?", options: ["Anywhere in the file", "Anywhere in the function", "Only inside that block"], answer: 2, why: "let and const are block-scoped." },
      { q: "Which is the safest default?", options: ["var", "let", "const"], answer: 2, why: "Start with const; switch to let only when you need to reassign." }
    ],
    rev: {
      sec30: "`var` is function-scoped, hoisted as undefined and redeclarable. `let` and `const` are block-scoped, in the temporal dead zone until declared, and not redeclarable. `const` forbids reassignment, not mutation. Default to `const`, use `let` when reassigning, avoid `var`.",
      interview: [
        { level: "basic", q: "Difference between var, let and const?", a: "var is function-scoped and redeclarable; let/const are block-scoped. const can't be reassigned; let can." },
        { level: "intermediate", q: "Does const make an object immutable?", a: "No. It freezes the binding. Properties can still change unless you use Object.freeze, which is shallow." },
        { level: "intermediate", q: "What is the temporal dead zone?", a: "The time between entering a block and the let/const line. The variable exists but accessing it throws a ReferenceError." },
        { level: "tricky", q: "Why does the var + setTimeout loop log 3,3,3?", a: "All callbacks close over one function-scoped i, which is 3 when they run. let creates a fresh binding per iteration." }
      ],
      predict: [
        { code: `let msg = 'outer';\n{\n  let msg = 'inner';\n}\nconsole.log(msg);`, answer: "outer", why: "The inner `msg` is a separate block-scoped variable that disappears at the closing brace." }
      ],
      compare: { cols: ["", "var", "let", "const"], rows: [
        ["Scope", "Function", "Block", "Block"],
        ["Reassign", "Yes", "Yes", "No"],
        ["Redeclare", "Yes", "No", "No"],
        ["Before declaration", "undefined", "ReferenceError (TDZ)", "ReferenceError (TDZ)"]
      ]},
      cheat: [
        "Default to const, use let to reassign, avoid var",
        "let/const: block scope; var: function scope",
        "const blocks reassignment, not mutation",
        "TDZ: let/const throw before their line",
        "var in loops shares one variable; let makes one per iteration",
        "React state: const [v, setV], change via the setter"
      ]
    },
    related: ["WEB-018", "WEB-019", "WEB-020", "STATE-007"]
  },

  "WEB-013": {
    tldr: "JS has 7 primitive types (simple values copied by value) and objects (arrays, functions, plain objects) shared by reference. `typeof` tells you which, with two famous quirks.",
    analogy: { icon: "📝", text: "A primitive is a sticky note: copying it gives you your own note. An object is a shared Google Doc: copying the link means both of you edit the same document." },
    visual: { type: "tree", title: "Every value in JavaScript", root: { label: "Value", children: [
      { label: "Primitives", note: "immutable, copied by value", children: [
        { label: "string" }, { label: "number" }, { label: "boolean" },
        { label: "undefined" }, { label: "null" }, { label: "bigint" }, { label: "symbol" }
      ]},
      { label: "Objects", note: "mutable, shared by reference", children: [
        { label: "{ } plain object" }, { label: "[ ] array" }, { label: "function" }
      ]}
    ]}},
    points: [
      "**Primitives:** `'latte'`, `3.5`, `true`, `undefined`, `null`, `10n`, `Symbol()`. Copying makes an independent value.",
      "**Objects** (incl. arrays, functions, dates): variables hold a **reference**; copies point to the same thing.",
      "`typeof null === 'object'` (old bug) and `typeof [] === 'object'`. Use `x === null` and `Array.isArray(x)`.",
      "`undefined` = not set yet; `null` = deliberately empty.",
      "**In React:** state updates must create a **new** object/array; React compares references to spot changes."
    ],
    code: { file: "types.js", lang: "js", src: `console.log(typeof 'latte');       // 'string'
console.log(typeof 3.5);           // 'number'
console.log(typeof true);          // 'boolean'
console.log(typeof undefined);     // 'undefined'
console.log(typeof 10n);           // 'bigint'
console.log(typeof (() => {}));    // 'function'
console.log(typeof null);          // 'object'  <- historic quirk
console.log(typeof []);            // 'object'  <- use Array.isArray

// Primitives copy the value
let a = 'tea';
let b = a;
b = 'coffee';
console.log(a);                    // 'tea'

// Objects copy the reference
const cart = { items: 1 };
const sameCart = cart;
sameCart.items = 5;
console.log(cart.items);           // 5  (same object!)

// Make a real copy instead
const newCart = { ...cart, items: 6 };
console.log(cart.items, newCart.items, cart === newCart); // 5 6 false`, walk: [
      { lines: [1, 6], note: "`typeof` returns a string naming the type." },
      { lines: [7, 8], note: "The two traps: `null` and arrays both say 'object'." },
      { lines: [11, 14], note: "Changing `b` doesn't touch `a`: primitives are copied." },
      { lines: [17, 20], note: "`sameCart` is the same object, so editing it edits `cart`." },
      { lines: [23, 24], note: "Spread creates a new object: a new reference, as React state needs." }
    ]},
    output: "string, number, boolean, undefined, bigint, function, object, object\ntea\n5\n5 6 false",
    mistakes: [
      { bad: `if (typeof items === 'object') {\n  items.map(...)\n}`, good: `if (Array.isArray(items)) {\n  items.map(...)\n}`, why: "`null` and plain objects also pass the typeof check, then `.map` crashes." },
      { bad: `todos.push(newTodo);\nsetTodos(todos);`, good: `setTodos([...todos, newTodo]);`, why: "Same array reference, so React sees no change and may skip the re-render." }
    ],
    practice: [
      { level: "B", q: "What is `typeof NaN`?", a: "`'number'`. NaN is a special number value meaning 'not a valid number'." },
      { level: "B", q: "Check safely that `user` is a real object (not null, not an array).", a: "Combine the checks.", code: `const isObj = user !== null && typeof user === 'object' && !Array.isArray(user);` },
      { level: "I", q: "`const x = [1,2]; const y = [1,2]; x === y`?", a: "`false`. Two different arrays, two references, even with equal contents." },
      { level: "C", q: "Why is `0.1 + 0.2 !== 0.3`, and how do you handle money?", a: "Numbers are binary floating point. Store money in whole pennies (integers) or round with `toFixed` for display." }
    ],
    quiz: [
      { q: "`typeof null` returns…", options: ["'null'", "'object'", "'undefined'"], answer: 1, why: "A historic bug kept for backwards compatibility." },
      { q: "How do you reliably detect an array?", options: ["`typeof x === 'array'`", "`Array.isArray(x)`", "`x.length > 0`"], answer: 1, why: "typeof gives 'object' for arrays; length exists on strings too." },
      { q: "`const a = {n:1}; const b = a; b.n = 2;` What is `a.n`?", options: ["1", "2", "Error"], answer: 1, why: "a and b reference the same object." }
    ],
    rev: {
      sec30: "Seven primitives (string, number, boolean, undefined, null, bigint, symbol) are immutable and copied by value. Everything else is an object (arrays, functions, dates) held by reference. `typeof` works except `null` → 'object' and arrays → 'object'. React relies on new references to detect changes.",
      interview: [
        { level: "basic", q: "List the primitive types.", a: "string, number, boolean, undefined, null, bigint, symbol." },
        { level: "intermediate", q: "Value vs reference: what's the difference?", a: "Primitives copy the value itself; objects copy a pointer, so two variables can mutate the same object." },
        { level: "intermediate", q: "null vs undefined?", a: "undefined means a value was never assigned; null is an intentional 'no value'. `null == undefined` is true, `===` is false." },
        { level: "advanced", q: "Why does React care about references?", a: "It uses Object.is to compare state, props and dependencies. Mutating keeps the same reference, so React thinks nothing changed." },
        { level: "tricky", q: "`typeof function(){}`?", a: "'function', even though functions are objects. It's the only object subtype typeof reports separately." }
      ],
      cheat: [
        "7 primitives: string number boolean undefined null bigint symbol",
        "Primitives copy by value; objects share by reference",
        "typeof null → 'object' (quirk)",
        "Arrays: Array.isArray(x)",
        "{} === {} is false: different references",
        "React: new object/array = change detected"
      ]
    },
    related: ["WEB-014", "WEB-021", "WEB-024", "STATE-016"]
  },

  "WEB-014": {
    tldr: "Operators combine values: maths (`+ - * / %`), comparison (always use `===`), logic (`&&`, `||`, `!`) and `??` for 'use this default only if the value is missing'.",
    analogy: { icon: "☕", text: "`||` is a barista who swaps your order for the house blend if it's 'nothing-ish' (even zero sugar). `??` only swaps it if you literally didn't order." },
    visual: { type: "compare", title: "== (loose) vs === (strict)", left: { label: "== converts types first", tone: "bad", points: [
      "`'5' == 5` → true",
      "`0 == ''` → true",
      "`null == undefined` → true",
      "Hidden conversions cause surprise bugs"
    ]}, right: { label: "=== no conversion", tone: "good", points: [
      "`'5' === 5` → false",
      "`0 === ''` → false",
      "`null === undefined` → false",
      "Same type **and** value, or false"
    ]}},
    points: [
      "**Arithmetic:** `+` also joins strings: `'2' + 1` is `'21'`, but `'2' * 1` is `2`.",
      "**Falsy values:** `false`, `0`, `''`, `null`, `undefined`, `NaN` (and `0n`). Everything else is truthy.",
      "`a && b` returns `a` if falsy, else `b`. `a || b` returns `a` if truthy, else `b`. They return values, not just booleans.",
      "`a ?? b` uses `b` only if `a` is `null` or `undefined`, so `0` and `''` are kept.",
      "`?.` (optional chaining) stops safely on `null`/`undefined`: `user?.address?.city`.",
      "**In React:** `{count && <Badge />}` renders a stray **0** when count is 0. Use `count > 0 &&`."
    ],
    code: { file: "operators.js", lang: "js", src: `// Arithmetic
const price = 4, qty = 3;
console.log(price * qty, 10 % 3);        // 12 1
console.log('2' + 1, '2' * 1);           // '21' 2

// Comparison: always ===
console.log('5' == 5, '5' === 5);        // true false

// Logical operators return one of their operands
const user = null;
console.log(user && user.name);          // null (stopped early)
console.log('' || 'Guest');              // 'Guest'

// || vs ?? for defaults
const settings = { volume: 0, nickname: '' };
console.log(settings.volume || 50);      // 50  (wrong: 0 was valid)
console.log(settings.volume ?? 50);      // 0   (kept)
console.log(settings.nickname ?? 'Anon');// ''  (kept)

// Optional chaining
const order = { customer: { name: 'Ana' } };
console.log(order.delivery?.address);    // undefined, no crash
console.log(order.customer?.name ?? 'Unknown'); // 'Ana'

// Ternary: inline if/else expression
const stock = 0;
console.log(stock > 0 ? 'In stock' : 'Sold out'); // 'Sold out'`, walk: [
      { lines: [3, 4], note: "`%` is remainder. `+` with a string concatenates; `*` converts to number." },
      { lines: [7], note: "`==` coerces '5' to 5 first. `===` compares type too." },
      { lines: [10, 12], note: "`&&` stops at the first falsy value; `||` stops at the first truthy one." },
      { lines: [15, 18], note: "`||` throws away valid 0 and ''. `??` only replaces null/undefined." },
      { lines: [21, 23], note: "`?.` returns undefined instead of throwing on a missing link; pairs well with `??`." },
      { lines: [27], note: "The ternary is the expression form of if/else, used all over JSX." }
    ]},
    output: "12 1\n21 2\ntrue false\nnull\nGuest\n50\n0\n(empty string)\nundefined\nAna\nSold out",
    mistakes: [
      { bad: `{cart.length && <CartBadge count={cart.length} />}`, good: `{cart.length > 0 && <CartBadge count={cart.length} />}`, why: "When the cart is empty, `0 && …` returns 0 and React renders the number 0 on screen." },
      { bad: `const volume = saved.volume || 50;`, good: `const volume = saved.volume ?? 50;`, why: "A saved volume of 0 is falsy, so `||` overwrites it. `??` keeps it." },
      { bad: `if (input == 0) { … }`, good: `if (Number(input) === 0) { … }`, why: "`'' == 0` is also true, so an empty field passes. Convert explicitly, then compare strictly." }
    ],
    practice: [
      { level: "B", q: "Predict: `'3' + 4 + 5` and `3 + 4 + '5'`.", a: "`'345'` (string from the start) and `'75'` (3+4 = 7 first, then joined)." },
      { level: "B", q: "Is an empty array `[]` truthy or falsy?", a: "Truthy. All objects are truthy; check `arr.length > 0` instead." },
      { level: "I", q: "Show 'No notes yet' when `notes` is undefined or empty, else the count.", a: "Optional chaining plus a ternary.", code: `const text = notes?.length ? \`\${notes.length} notes\` : 'No notes yet';` },
      { level: "C", q: "Why can't you mix `??` with `||` without brackets: `a || b ?? c`?", a: "It's a SyntaxError by design to avoid precedence confusion. Write `(a || b) ?? c`." }
    ],
    quiz: [
      { q: "`0 ?? 10` evaluates to…", options: ["10", "0", "null", "false"], answer: 1, why: "`??` only falls back for null or undefined; 0 is kept." },
      { q: "`null == undefined` and `null === undefined`?", options: ["true, true", "true, false", "false, false", "false, true"], answer: 1, why: "Loose equality treats them as equal; strict checks the type." },
      { q: "In JSX, `{0 && <Badge />}` renders…", options: ["Nothing", "The Badge", "The number 0"], answer: 2, why: "`&&` returns the falsy left side, and React renders numbers." }
    ],
    rev: {
      sec30: "Arithmetic `+ - * / % **` (`+` concatenates strings). Use `===`/`!==`, never `==`. `&&` and `||` short-circuit and return an operand. Falsy: false, 0, '', null, undefined, NaN. `??` defaults only on null/undefined; `?.` safely reads through missing values. Ternary is the expression if/else.",
      interview: [
        { level: "basic", q: "== vs ===?", a: "`==` converts types before comparing; `===` requires same type and value. Use `===` to avoid coercion surprises." },
        { level: "intermediate", q: "|| vs ???", a: "`||` falls back on any falsy value (0, '', false); `??` only on null or undefined, so valid zeros and empty strings survive." },
        { level: "intermediate", q: "What do && and || return?", a: "One of their operands, not necessarily a boolean: && the first falsy (or last), || the first truthy (or last)." },
        { level: "advanced", q: "Why does `{items.length && <List />}` show 0 in React?", a: "With an empty array, `0 && …` evaluates to 0, and React renders numbers. Use `items.length > 0 &&` or a ternary." },
        { level: "tricky", q: "`NaN === NaN`?", a: "false. NaN never equals anything, including itself. Use `Number.isNaN(x)`." }
      ],
      predict: [
        { code: `console.log([] == false, [] ? 'yes' : 'no');`, answer: "true yes", why: "`==` converts [] to '' then 0, matching false. But in a boolean check [] is an object, so truthy." }
      ],
      cheat: [
        "Always === and !==",
        "Falsy: false 0 '' null undefined NaN",
        "a && b → stops at first falsy",
        "a || b → stops at first truthy",
        "a ?? b → b only if a is null/undefined",
        "a?.b → undefined instead of a crash",
        "JSX: count > 0 && …, never count && …"
      ]
    },
    related: ["WEB-013", "WEB-015", "COND-003", "COND-004"]
  },
};
