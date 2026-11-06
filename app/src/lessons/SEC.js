export default {
  "SEC-001": {
    tldr: "Cross-site scripting (**XSS**) is when someone else's code runs in your page. React escapes everything inside `{}` so text stays text, but escape hatches like raw HTML and user-supplied links let it back in.",
    analogy: { icon: "📝", text: "A notice board in a café. React pins every note behind glass: people can read \"<script>\" but it can't do anything. Raw HTML is taking the glass off." },
    visual: { type: "flow", title: "A stored XSS attempt meets React", steps: [
      { label: "Attacker posts a review", detail: "Text: `<img src=x onerror=\"steal()\">` saved in the shop's database." },
      { label: "Your app fetches it", detail: "The review arrives as a plain string in your component's props." },
      { label: "`{review}` in JSX", detail: "React writes it as a **text node** (escaped). The browser shows the tags as characters." },
      { label: "Nothing runs ✅", detail: "No `<img>` element is created, so `onerror` never fires." },
      { label: "Unless you bypass React", detail: "`dangerouslySetInnerHTML`, `javascript:` links, `ref.innerHTML`, `eval` put it back into play." }
    ]},
    points: [
      "XSS lets an attacker act **as the user**: read the page, call your API with their cookies, steal tokens from `localStorage`.",
      "React escapes `{value}` in **text and attribute values** automatically (output escaping).",
      "Still risky: `dangerouslySetInnerHTML`, user URLs in `href`/`src`, writing to `ref.current.innerHTML`, `eval`/`new Function`, third-party scripts.",
      "Three flavours: **stored** (saved in DB), **reflected** (in the URL), **DOM-based** (client JS moves data into an unsafe sink).",
      "Defence in depth: escape output, sanitise HTML, allowlist URL protocols, add a CSP."
    ],
    code: { file: "App.jsx", lang: "jsx", src: `const review = '<img src=x onerror="alert(document.cookie)">';

function Review({ text }) {
  // Escaped: shows the characters, creates no <img>
  return <p className="review">{text}</p>;
}

function RiskyReview({ text }) {
  // Parsed as HTML: the onerror handler WOULD run
  return <p dangerouslySetInnerHTML={{ __html: text }} />;
}

export default function App() {
  return (
    <>
      <Review text={review} />
      {/* <RiskyReview text={review} />  never with untrusted data */}
    </>
  );
}`, walk: [
      { lines: [1], note: "Untrusted input, e.g. a product review from the database." },
      { lines: [3, 4, 5, 6], note: "`{text}` becomes a text node. React escapes `<`, `>` and quotes for you." },
      { lines: [8, 9, 10, 11], note: "Raw HTML is parsed by the browser, so the event handler inside it is live." },
      { lines: [17], note: "Keep the escape hatch for **sanitised** HTML only (see SEC-004)." }
    ]},
    output: "The page shows the literal text <img src=x onerror=\"alert(document.cookie)\"> and no alert fires.",
    mistakes: [
      { bad: `<div dangerouslySetInnerHTML={{ __html: comment }} />`, good: `<div>{comment}</div>`, why: "If you only need text, render text. Raw HTML from users is the classic React XSS hole." },
      { bad: `<a href={user.website}>Website</a>`, good: `<a href={safeUrl(user.website)}>Website</a>`, why: "Escaping doesn't stop a `javascript:` URL. Allowlist `http:`/`https:` before using a user URL." }
    ],
    practice: [
      { level: "B", q: "Render a chat message that may contain `<b>` tags so it's safe.", a: "Use `{message}`. The tags show as text; nothing is parsed." },
      { level: "I", q: "Name three ways XSS can still reach a React app.", a: "`dangerouslySetInnerHTML` with raw input, user-controlled `href`/`src`, direct DOM writes (`innerHTML`, `insertAdjacentHTML`) or `eval`." },
      { level: "I", q: "Search page shows `You searched for: <term from URL>`. Is `{term}` safe?", a: "Yes, as text. It becomes unsafe only if you inject it as HTML or into a URL/script context." },
      { level: "C", q: "Why is an XSS bug worse when tokens live in `localStorage`?", a: "Injected script can read `localStorage` and send the token to the attacker, who can use it from anywhere until it expires." }
    ],
    quiz: [
      { q: "What does React do with `<p>{'<script>x()</script>'}</p>`?", options: ["Runs the script", "Shows the tags as text", "Throws an error", "Strips the tags silently"], answer: 1, why: "Strings in `{}` become escaped text nodes." },
      { q: "Which is still an XSS risk in React?", options: ["`<p>{name}</p>`", "`<img alt={name} />`", "`<a href={userUrl}>`", "`<input value={name} />`"], answer: 2, why: "A user URL can be `javascript:...`; escaping doesn't change the protocol." },
      { q: "A malicious comment saved in the database and shown to every visitor is…", options: ["Reflected XSS", "Stored XSS", "CSRF", "DOM clobbering"], answer: 1, why: "Stored XSS persists on the server and hits everyone who views it." }
    ],
    rev: {
      sec30: "XSS = attacker's script running in your origin. React escapes text and attribute values in JSX, so `{userText}` is safe. Holes appear when you bypass React: `dangerouslySetInnerHTML`, user URLs (`javascript:`), direct DOM writes, `eval`, untrusted third-party scripts. Fix with sanitising (DOMPurify), URL allowlists and a CSP.",
      interview: [
        { level: "basic", q: "Does React protect against XSS?", a: "Partly. It escapes values rendered in JSX, so text injection is safe by default, but raw HTML, URLs and direct DOM access are still your responsibility." },
        { level: "intermediate", q: "Stored vs reflected vs DOM-based XSS?", a: "Stored is saved server-side and served to everyone; reflected bounces off the request (URL); DOM-based happens purely in client JS moving input into an unsafe sink." },
        { level: "advanced", q: "What can an attacker do after XSS?", a: "Anything the user can: call APIs with their cookies, read tokens in storage, change the page, log keystrokes. HttpOnly cookies limit theft but not misuse." },
        { level: "tricky", q: "If React escapes output, why do React apps still get XSS?", a: "Because devs use escape hatches: `dangerouslySetInnerHTML`, user-controlled `href`, `innerHTML` via refs, SSR state injected into `<script>`, or vulnerable libraries." }
      ],
      predict: [
        { code: `const name = '"><script>alert(1)</script>';\nreturn <input value={name} readOnly />;`, answer: "An input showing the whole string; no alert", why: "React sets the attribute value safely; quotes can't break out." }
      ],
      cheat: [
        "XSS = someone else's JS running on your origin",
        "`{value}` in JSX is escaped: safe for text and attributes",
        "Danger zones: `dangerouslySetInnerHTML`, `href`/`src`, `innerHTML`, `eval`",
        "Stored, reflected, DOM-based",
        "Sanitise HTML with DOMPurify; allowlist URL protocols",
        "CSP is the safety net, not the first line"
      ]
    },
    related: ["SEC-003", "SEC-004", "AUTH-014", "JSX-006"]
  },

  "SEC-002": {
    tldr: "Cross-site request forgery (**CSRF**) tricks a logged-in user's browser into sending a request to your site from another site. Cookies ride along automatically, so the server thinks it was the user. **SameSite** cookies and CSRF tokens stop it.",
    analogy: { icon: "✉️", text: "Someone slips a pre-filled order form into your shopping bag. At the till, your loyalty card is attached automatically, so the shop charges you. SameSite means: only accept cards handed over in our own shop." },
    visual: { type: "flow", title: "How a CSRF attack works", steps: [
      { label: "You log in to shop.com", detail: "Server sets `session=abc` cookie in your browser." },
      { label: "You visit evil.site", detail: "It has a hidden form: `POST shop.com/api/orders` that auto-submits." },
      { label: "Browser adds the cookie", detail: "Without SameSite protection, `session=abc` is attached to that cross-site request." },
      { label: "Server sees a valid session", detail: "It places the order as you. The attacker never saw your cookie." },
      { label: "Defence", detail: "`SameSite=Lax/Strict` drops the cookie cross-site; a CSRF token or `Origin` check rejects it." }
    ]},
    points: [
      "CSRF only matters when auth is sent **automatically** (cookies). A bearer token you add in JS isn't sent by other sites.",
      "**SameSite=Lax** (browser default in Chrome/Edge): cookie skipped on cross-site POST, sent on top-level link clicks. **Strict**: never cross-site.",
      "Add a **CSRF token**: server issues it, React sends it in a header like `X-CSRF-Token`; other sites can't read it.",
      "Never change data on **GET**. `Lax` still sends cookies on cross-site GET navigations.",
      "XSS defeats CSRF defences: injected script can read the token. Fix XSS first. (.NET: `[ValidateAntiForgeryToken]`.)"
    ],
    code: { file: "api.js", lang: "js", src: `// Server sets (example):
// Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/
// Set-Cookie: csrf=k9f2x; Secure; SameSite=Lax; Path=/   (readable by JS)

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(c => c.startsWith(name + '='))
    ?.split('=')[1];
}

export async function placeOrder(cart) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCookie('csrf') ?? '',
    },
    body: JSON.stringify(cart),
  });
  if (!res.ok) throw new Error('Order failed: ' + res.status);
  return res.json();
}`, walk: [
      { lines: [2], note: "Session cookie: `HttpOnly` (JS can't read), `Secure` (HTTPS only), `SameSite=Lax` (not on cross-site POST)." },
      { lines: [3], note: "A separate CSRF cookie that **our** JS can read but evil.site's JS cannot." },
      { lines: [5, 6, 7, 8, 9, 10], note: "Read the token from `document.cookie`." },
      { lines: [15], note: "Send cookies with the request (needed for cross-origin APIs)." },
      { lines: [18], note: "Server compares header vs cookie (double-submit). A forged form can't set this header." }
    ]},
    mistakes: [
      { bad: `app.get('/api/cart/clear', clearCart)\n<a href="/api/cart/clear">`, good: `app.post('/api/cart/clear', csrfCheck, clearCart)`, why: "GET must be safe. Any site can trigger a GET via an `<img>` or link, and `Lax` cookies go with top-level GETs." },
      { bad: `Set-Cookie: session=abc; SameSite=None`, good: `Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax`, why: "`SameSite=None` sends the cookie on every cross-site request: the exact thing CSRF needs." }
    ],
    practice: [
      { level: "B", q: "Which cookie attribute is the simplest CSRF defence?", a: "`SameSite=Lax` (or `Strict`)." },
      { level: "I", q: "Your API uses `Authorization: Bearer ...` from memory. Do you need CSRF tokens?", a: "Usually no: other sites can't make the browser add that header. You still need XSS protection." },
      { level: "I", q: "Your React app on `app.shop.com` calls `api.shop.com` with cookies. Is that \"cross-site\"?", a: "No. Same registrable domain (`shop.com`) = same-site, so `SameSite=Lax` cookies are sent. It is cross-**origin**, so CORS still applies." },
      { level: "C", q: "Why is checking the `Origin` header a good extra check?", a: "Browsers set it on cross-origin POSTs and pages can't forge it. Reject state-changing requests whose `Origin` isn't yours." }
    ],
    quiz: [
      { q: "Why does CSRF work at all?", options: ["The attacker steals the cookie", "The browser attaches cookies automatically", "CORS is misconfigured", "React re-renders twice"], answer: 1, why: "The attacker never reads the cookie; the browser just sends it." },
      { q: "What does `SameSite=Lax` do on a cross-site form POST?", options: ["Sends the cookie", "Doesn't send the cookie", "Deletes the cookie", "Encrypts the cookie"], answer: 1, why: "Lax only sends cookies cross-site on top-level GET navigations." },
      { q: "Does CORS stop CSRF?", options: ["Yes, always", "No: CORS controls reading responses, not sending simple requests", "Only on GET"], answer: 1, why: "A plain form POST is sent without a preflight; CORS just hides the response." }
    ],
    rev: {
      sec30: "CSRF makes the victim's browser send a forged request; cookies are attached automatically so the server trusts it. Defences: `SameSite=Lax/Strict` cookies, a CSRF token in a custom header, `Origin` checks, and no state changes on GET. Header-based bearer tokens aren't vulnerable to CSRF but are exposed to XSS.",
      interview: [
        { level: "basic", q: "What is CSRF in one sentence?", a: "A malicious site makes your browser send an authenticated request to another site, using the cookies the browser attaches automatically." },
        { level: "intermediate", q: "Lax vs Strict vs None?", a: "Strict never sends cross-site; Lax sends only on top-level GET navigations; None always sends (requires `Secure`). Lax is the usual default." },
        { level: "advanced", q: "How does the double-submit cookie pattern work?", a: "Server sets a random token in a JS-readable cookie; the client copies it into a header; the server checks they match. Another site can't read your cookie to copy it." },
        { level: "tricky", q: "Does CORS protect against CSRF?", a: "No. Simple requests (form POSTs) are sent without a preflight; CORS only blocks the attacker from reading the response. Custom headers do force a preflight, which helps." }
      ],
      compare: { cols: ["", "XSS", "CSRF"], rows: [
        ["Attacker gets", "Code running in your page", "One forged request"],
        ["Needs", "An injection bug", "Auto-sent credentials (cookies)"],
        ["Main fix", "Escape, sanitise, CSP", "SameSite, CSRF token"]
      ]},
      cheat: [
        "CSRF = forged request + auto-sent cookies",
        "`SameSite=Lax` is the baseline; `Strict` for sensitive cookies",
        "CSRF token in a custom header (`X-CSRF-Token`)",
        "Never mutate on GET",
        "CORS is not a CSRF defence",
        "Bearer header tokens: no CSRF, but XSS-exposed"
      ]
    },
    related: ["SEC-001", "SEC-007", "AUTH-014", "API-020"]
  },

  "SEC-003": {
    tldr: "An **unsafe sink** is any place where a string gets turned into code or HTML: `javascript:` URLs, `innerHTML`, `eval`. React's escaping can't help there, so check every place user data meets one.",
    analogy: { icon: "🍳", text: "In a kitchen, most notes are just read (safe). But a note dropped straight into the recipe machine gets cooked. Sinks are the machines: check what you feed them." },
    visual: { type: "compare", title: "Where user data is safe vs dangerous",
      left: { label: "Safe sinks (React escapes)", tone: "good", points: [
        "`<p>{text}</p>`: text node",
        "`<img alt={text} />`: attribute value",
        "`<input value={text} />`",
        "`element.textContent = text`"
      ]},
      right: { label: "Unsafe sinks (you must check)", tone: "bad", points: [
        "`href` / `src` / `formAction` with a user URL",
        "`dangerouslySetInnerHTML`, `ref.current.innerHTML`",
        "`eval`, `new Function`, `setTimeout('string')`",
        "`window.location = userUrl`, `window.open(userUrl)`",
        "`<iframe srcDoc={...}>`"
      ]}
    },
    points: [
      "A `javascript:` URL runs its text as code when clicked. **React 19 blocks** them in `href`/`src` (swaps in an error), but `data:`, `vbscript:` and `window.location` aren't covered.",
      "Validate URLs with `new URL()` and an **allowlist** of protocols (`http:`, `https:`, `mailto:`), not a blocklist.",
      "Refs give you the real DOM: `innerHTML`, `outerHTML`, `insertAdjacentHTML` skip React's escaping entirely.",
      "Never build code from strings: no `eval`, `new Function`, or string `setTimeout`.",
      "Add `rel=\"noopener noreferrer\"` on `target=\"_blank\"` links to untrusted sites."
    ],
    code: { file: "ShopLink.jsx", lang: "jsx", src: `function safeUrl(input) {
  try {
    const url = new URL(input, window.location.origin);
    const allowed = ['http:', 'https:', 'mailto:'];
    return allowed.includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}

function ShopLink({ shop }) {
  return (
    <a href={safeUrl(shop.website)} target="_blank" rel="noopener noreferrer">
      Visit {shop.name}
    </a>
  );
}

export default function App() {
  const shops = [
    { name: 'Corner Bakery', website: 'https://bakery.example' },
    { name: 'Sneaky Shop', website: '  JavaScript:alert(document.cookie)' },
  ];
  return shops.map(s => <p key={s.name}><ShopLink shop={s} /></p>);
}`, walk: [
      { lines: [3], note: "`new URL` normalises tricks like spaces and `JavaScript:` casing before we check." },
      { lines: [4, 5], note: "**Allowlist**: anything not http/https/mailto becomes a harmless `#`." },
      { lines: [6, 7], note: "Invalid URLs also fall back to `#`." },
      { lines: [13], note: "Always route user URLs through the check, and isolate new tabs with `rel`." },
      { lines: [22], note: "The sneaky link ends up as `href=\"#\"`." }
    ]},
    output: "Two links. \"Visit Corner Bakery\" opens the bakery; \"Visit Sneaky Shop\" points to # and does nothing.",
    mistakes: [
      { bad: `if (!url.startsWith('javascript:')) return url;`, good: `return ['http:', 'https:'].includes(new URL(url).protocol) ? url : '#';`, why: "Blocklists miss ` javascript:`, `JAVASCRIPT:`, `data:` and more. Parse, then allowlist." },
      { bad: `useEffect(() => { ref.current.innerHTML = note; }, [note]);`, good: `return <div>{note}</div>;`, why: "Writing `innerHTML` through a ref bypasses React's escaping. Let React render the text." },
      { bad: `window.location.href = params.get('next');`, good: `const next = params.get('next');\nif (next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\\\')) navigate(next);`, why: "An unchecked redirect can run `javascript:` or send users to a phishing site (open redirect)." }
    ],
    practice: [
      { level: "B", q: "List four unsafe sinks.", a: "`href`/`src` with user URLs, `dangerouslySetInnerHTML`, `innerHTML` via refs, `eval`/`new Function`." },
      { level: "I", q: "Make a `<Avatar src={user.photo} />` safe.", a: "Allow only `https:` (and maybe your CDN host) via `new URL(user.photo).protocol`; fall back to a default image." },
      { level: "I", q: "After login you redirect to `?next=`. How do you avoid an open redirect?", a: "Only accept same-site paths: starts with `/`, not `//`, no backslashes (`/\\evil.com`). Otherwise go to `/`." },
      { level: "C", q: "React 19 blocks `javascript:` in `href`. Why still write `safeUrl`?", a: "It doesn't cover `data:`/other schemes, `window.open`, `location`, older React versions or non-React code. Explicit allowlists are clear and portable." }
    ],
    quiz: [
      { q: "Best way to validate a user-supplied link?", options: ["Block strings starting with `javascript:`", "Parse with `new URL` and allowlist protocols", "Escape it with `encodeURIComponent`", "Trust React to handle it"], answer: 1, why: "Allowlists survive tricks that blocklists miss." },
      { q: "Which line bypasses React's escaping?", options: ["`<p>{bio}</p>`", "`ref.current.innerHTML = bio`", "`<p title={bio}>`", "`ref.current.textContent = bio`"], answer: 1, why: "`innerHTML` parses HTML; `textContent` doesn't." },
      { q: "Is `encodeURIComponent(userUrl)` enough for an `href`?", options: ["Yes", "No: it's for one query value, not a whole URL's protocol"], answer: 1, why: "Encoding a whole URL breaks it and doesn't validate the scheme." }
    ],
    rev: {
      sec30: "Sinks turn strings into HTML or code: user URLs in `href`/`src`, `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `location`, `window.open`, `srcDoc`. React escapes text and attributes but can't judge a URL's meaning. Parse URLs with `new URL` and allowlist protocols; never write HTML through refs; validate redirects.",
      interview: [
        { level: "basic", q: "What is a `javascript:` URL attack?", a: "A link like `javascript:steal()` runs code when clicked. If a user controls an `href`, they can plant one." },
        { level: "intermediate", q: "Why allowlist instead of blocklist?", a: "Attackers vary case, add whitespace or use other schemes like `data:`. An allowlist accepts only known-good protocols." },
        { level: "advanced", q: "What's an open redirect and why care in a SPA?", a: "Redirecting to an unchecked `?next=` URL lets attackers bounce users to phishing pages or `javascript:` URLs using your trusted domain. Only allow relative paths." },
        { level: "tricky", q: "Does React 19 make `href={userUrl}` safe?", a: "It blocks `javascript:` in `href`/`src`, which helps, but other schemes, `window.open`, `location` and non-React code aren't covered, so still allowlist." }
      ],
      debug: [
        { code: `<a href={post.link}>Read more</a>`, fix: `<a href={safeUrl(post.link)}>Read more</a>`, why: "`post.link` is user-controlled; check its protocol first." }
      ],
      cheat: [
        "Sink = place a string becomes HTML or code",
        "User URLs: `new URL()` + protocol allowlist",
        "React 19 blocks `javascript:` in href/src; still validate",
        "Never `innerHTML` via refs; use `textContent` or JSX",
        "No `eval`, `new Function`, string `setTimeout`",
        "Redirects: same-site paths only (`/x`, not `//x`)"
      ]
    },
    related: ["SEC-001", "SEC-004", "SEC-006", "HOOKS-007"]
  },

  "SEC-004": {
    tldr: "`dangerouslySetInnerHTML` inserts raw HTML, skipping React's escaping. If the HTML isn't 100% yours, clean it with **DOMPurify** first so scripts, event handlers and bad links are stripped.",
    analogy: { icon: "🥗", text: "A recipe site accepts recipes with bold text and lists. Before printing them, a kitchen helper (DOMPurify) picks out anything that isn't food: hidden scripts, sneaky links." },
    visual: { type: "flow", title: "From untrusted HTML to safe HTML", steps: [
      { label: "HTML arrives", detail: "From a CMS, rich-text editor or Markdown renderer: `<p>Mix</p><img onerror=…><script>…`" },
      { label: "DOMPurify.sanitize()", detail: "Parses it in an inert DOM and keeps only allowlisted tags and attributes." },
      { label: "Dangerous bits removed", detail: "`<script>`, `on*` handlers, `javascript:` hrefs are dropped." },
      { label: "Wrap in `{ __html }`", detail: "The ugly name and object shape are on purpose: a reminder you're bypassing React." },
      { label: "Rendered", detail: "`<p>Mix</p><img src=\"x\">`: formatting kept, attack gone." }
    ]},
    points: [
      "Syntax: `<div dangerouslySetInnerHTML={{ __html: clean }} />`. The element can't also have children.",
      "`DOMPurify.sanitize(html)` returns a safe string. Install: `npm i dompurify`.",
      "Sanitise **right before rendering**, on every render path. Don't trust \"it was cleaned when saved\".",
      "Restrict further with options, e.g. `{ ALLOWED_TAGS: ['b', 'i', 'p', 'ul', 'li', 'a'] }`.",
      "DOMPurify needs a DOM. For SSR use it with jsdom (e.g. `isomorphic-dompurify`).",
      "Prefer no raw HTML at all: render Markdown to React elements (e.g. `react-markdown`) when you can."
    ],
    code: { file: "RecipeBody.jsx", lang: "jsx", src: `import { useMemo } from 'react';
import DOMPurify from 'dompurify';

function RecipeBody({ html }) {
  const clean = useMemo(
    () => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
    [html]
  );
  return <div className="recipe" dangerouslySetInnerHTML={{ __html: clean }} />;
}

export default function App() {
  const fromCms =
    '<h2>Pancakes</h2><p>Mix <b>flour</b> and milk.</p>' +
    '<img src="x" onerror="alert(1)">' +
    '<a href="javascript:steal()">Tips</a><script>steal()</script>';
  return <RecipeBody html={fromCms} />;
}`, walk: [
      { lines: [2], note: "DOMPurify: the standard, battle-tested HTML sanitiser." },
      { lines: [5, 6, 7, 8], note: "Sanitise with the HTML profile (no SVG/MathML). `useMemo` avoids re-cleaning on unrelated renders." },
      { lines: [9], note: "Only the **cleaned** string ever reaches `__html`." },
      { lines: [13, 14, 15, 16], note: "Untrusted input: a script, an `onerror` handler and a `javascript:` link." }
    ]},
    output: "A \"Pancakes\" heading, the paragraph with bold \"flour\", an image with no onerror, and a \"Tips\" link with no href. No script runs.",
    mistakes: [
      { bad: `<div dangerouslySetInnerHTML={{ __html: post.body }} />`, good: `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }} />`, why: "Raw user HTML is stored XSS waiting to happen." },
      { bad: `const clean = html.replace(/<script.*?<\\/script>/g, '');`, good: `const clean = DOMPurify.sanitize(html);`, why: "Regex can't parse HTML: `onerror`, `javascript:` links, nested tricks all slip through." },
      { bad: `const clean = DOMPurify.sanitize(html);\nel.innerHTML = clean + userSuffix;`, good: `el.innerHTML = DOMPurify.sanitize(html + userSuffix);`, why: "Concatenating after sanitising re-opens the hole. Sanitise the final string." }
    ],
    practice: [
      { level: "B", q: "Render a product description (HTML from your CMS) safely.", a: "Sanitise then inject.", code: `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} />` },
      { level: "I", q: "Allow only bold, italic, lists and links in comments.", a: "Pass an allowlist.", code: `DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'ul', 'ol', 'li', 'a'], ALLOWED_ATTR: ['href'] })` },
      { level: "I", q: "Build a `<SafeHtml html={...} />` component so no one uses the raw prop directly.", a: "Wrap the sanitise + `dangerouslySetInnerHTML` in one component and lint against the raw prop elsewhere (`react/no-danger`)." },
      { level: "C", q: "Notes app stores Markdown. Avoid `dangerouslySetInnerHTML` entirely?", a: "Use `react-markdown`, which builds React elements (raw HTML off by default), so React's escaping still applies." }
    ],
    quiz: [
      { q: "Why is the prop called `dangerouslySetInnerHTML`?", options: ["It's slow", "It bypasses React's escaping", "It's deprecated", "It only works on the server"], answer: 1, why: "The name is a warning: you're responsible for safety." },
      { q: "What does `DOMPurify.sanitize` return?", options: ["A React element", "A cleaned HTML string", "A boolean", "A Promise"], answer: 1, why: "It returns a string you pass to `__html`." },
      { q: "HTML was sanitised when saved to the DB. Skip it when rendering?", options: ["Yes, it's clean", "No: sanitise at render too"], answer: 1, why: "Old rows, other writers, or sanitiser upgrades mean the stored data can't be fully trusted." }
    ],
    rev: {
      sec30: "`dangerouslySetInnerHTML={{ __html }}` injects raw HTML and skips escaping. Only pass HTML you control or have sanitised with DOMPurify (`DOMPurify.sanitize(html)`), as late as possible, with a tight allowlist. Regex is not a sanitiser. Prefer rendering Markdown to React elements when you can.",
      interview: [
        { level: "basic", q: "When would you use `dangerouslySetInnerHTML`?", a: "To render HTML from a CMS or rich-text editor. Always after sanitising unless the HTML is fully under your control." },
        { level: "intermediate", q: "How does DOMPurify work?", a: "It parses the HTML into an inert DOM, walks it, and removes anything not on its allowlist: scripts, event attributes, dangerous URLs, then serialises back to a string." },
        { level: "advanced", q: "Client-side or server-side sanitising?", a: "Sanitise at output on the client (DOMPurify) and optionally on input server-side. For SSR, run DOMPurify with jsdom so the server-rendered HTML is clean too." },
        { level: "tricky", q: "Why is `__html` an object instead of a string?", a: "So you can't pass a plain string by accident; it forces a deliberate, searchable opt-in." },
        { level: "intermediate", q: "How do you stop teammates using it unsafely?", a: "One `SafeHtml` wrapper, ESLint `react/no-danger` elsewhere, code review, and a CSP as backup." }
      ],
      cheat: [
        "`dangerouslySetInnerHTML={{ __html: clean }}`",
        "`clean = DOMPurify.sanitize(html)`",
        "Sanitise late, right before rendering",
        "Tighten with `ALLOWED_TAGS` / `ALLOWED_ATTR`",
        "Regex is not a sanitiser",
        "SSR: DOMPurify + jsdom",
        "Markdown? Render to React elements instead"
      ]
    },
    related: ["SEC-001", "SEC-003", "SEC-012", "JSX-008"]
  },

  "SEC-005": {
    tldr: "Validate twice. **Client-side** checks give instant, friendly feedback (UX). **Server-side** checks are the real lock (security), because anyone can skip your React code and call the API directly.",
    analogy: { icon: "🎟️", text: "A cinema's website greys out sold-out seats (client check). But the box office still checks your ticket at the door (server check), because people can print a fake one." },
    visual: { type: "compare", title: "Two jobs, two places",
      left: { label: "Client (React): for UX", tone: "neutral", points: [
        "Instant errors as you type or on submit",
        "Saves a pointless round trip",
        "Easily bypassed: DevTools, curl, Postman",
        "Tools: HTML attrs, React Hook Form, Zod"
      ]},
      right: { label: "Server (API): for security", tone: "good", points: [
        "Runs on every request, can't be skipped",
        "Checks type, length, range, format, ownership",
        "Rejects with **400** + field errors",
        "The only check you can trust"
      ]}
    },
    points: [
      "**Never trust the client.** Any request can be hand-crafted; React validation is a convenience.",
      "Validate with an **allowlist**: expected type, length, range, format. Reject the rest.",
      "Share one schema (e.g. **Zod**) between client and a Node server to keep rules in sync. (.NET: FluentValidation / DataAnnotations on the server.)",
      "Show server errors in the form too: map a **400** response back to fields.",
      "Validation is not escaping: valid input can still contain `<`. Escape on output (SEC-006)."
    ],
    code: { file: "ReviewForm.jsx", lang: "jsx", src: `import { useState } from 'react';

function validate({ email, rating }) {
  const errors = {};
  if (!/^\\S+@\\S+\\.\\S+$/.test(email)) errors.email = 'Enter a valid email';
  const n = Number(rating);
  if (!Number.isInteger(n) || n < 1 || n > 5) errors.rating = 'Pick 1 to 5 stars';
  return errors;
}

export default function ReviewForm() {
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) return; // instant feedback, no request

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.status === 400) setErrors(await res.json()); // server said no
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="email" type="email" placeholder="Email" />
      {errors.email && <p role="alert">{errors.email}</p>}
      <input name="rating" type="number" min="1" max="5" />
      {errors.rating && <p role="alert">{errors.rating}</p>}
      <button>Send review</button>
    </form>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9], note: "Client rules: quick format and range checks. The server repeats these (and more)." },
      { lines: [16, 17, 18, 19], note: "Read the form, validate, and stop early if there are errors." },
      { lines: [21, 22, 23, 24, 25], note: "Send to the API. A curl user could skip everything above." },
      { lines: [26], note: "The server is the authority: show its **400** field errors in the same UI." }
    ]},
    output: "Submitting \"bob\" and 9 shows \"Enter a valid email\" and \"Pick 1 to 5 stars\" without any network request.",
    mistakes: [
      { bad: `// API: trust it, React already validated\ndb.reviews.insert(req.body);`, good: `const result = ReviewSchema.safeParse(req.body);\nif (!result.success) return res.status(400).json(z.flattenError(result.error).fieldErrors);`, why: "Requests can come from anywhere. Unvalidated input leads to bad data, crashes and injection bugs." },
      { bad: `<input maxLength={500} />  // our only limit`, good: `// client: maxLength for UX\n// server: reject body.comment.length > 500`, why: "HTML attributes are removed in seconds with DevTools." }
    ],
    practice: [
      { level: "B", q: "Why validate on the client at all if the server checks?", a: "Speed and friendliness: instant messages, fewer wasted requests." },
      { level: "I", q: "Add a comment field: required, max 500 chars, client + server.", a: "Client: `if (!comment.trim() || comment.length > 500)`. Server: the same check, returning 400 with `{ comment: '...' }`." },
      { level: "I", q: "A user changes `rating` to `\"5; DROP TABLE\"` in DevTools. What stops it?", a: "Server validation (must be integer 1-5) plus parameterised queries on the server." },
      { level: "C", q: "Share rules between React and a Node API.", a: "Define a Zod schema in a shared file; use `safeParse` in the form and in the route handler.", code: `import { z } from 'zod';\nexport const Review = z.object({\n  email: z.email(),\n  rating: z.coerce.number().int().min(1).max(5),\n});` }
    ],
    quiz: [
      { q: "Which validation provides security?", options: ["Client", "Server", "Both equally"], answer: 1, why: "Client checks can be bypassed; only server checks are enforced." },
      { q: "Main benefit of client-side validation?", options: ["Prevents attacks", "Fast, friendly feedback", "Required by HTTP", "Replaces server checks"], answer: 1, why: "It's a UX feature." },
      { q: "Input passed validation. Is it safe to inject as HTML?", options: ["Yes", "No: still escape or sanitise on output"], answer: 1, why: "Validation checks shape; output encoding handles context." }
    ],
    rev: {
      sec30: "Client validation is UX: instant errors, fewer requests. Server validation is security: it runs on every request and can't be bypassed. Use allowlist rules (type, length, range, format), return 400 with field errors, show them in the form. A shared Zod schema keeps both sides in sync. Validation doesn't replace output encoding.",
      interview: [
        { level: "basic", q: "Client or server validation?", a: "Both. Client for UX, server for security, because the client can always be bypassed." },
        { level: "intermediate", q: "Allowlist vs blocklist validation?", a: "Allowlist defines what's valid (e.g. 1-5 integer) and rejects the rest; blocklists try to list bad input and always miss something." },
        { level: "advanced", q: "How do you keep client and server rules in sync?", a: "One schema (Zod) imported by both, or generate client rules from the server's OpenAPI spec. Server remains the source of truth." },
        { level: "tricky", q: "Does validating input prevent XSS?", a: "Not by itself. Plenty of valid text contains `<` or quotes. You still escape or sanitise for the output context." }
      ],
      scenario: [
        { q: "Checkout sends `{ itemId, qty, price }`. A tester sets price to 0.01 and it works. Fix?", a: "Never accept price from the client. Send only item IDs and quantities; the server looks up prices and validates qty." }
      ],
      cheat: [
        "Client = UX, server = security",
        "Never trust request data",
        "Allowlist: type, length, range, format",
        "400 + field errors, shown in the form",
        "Shared Zod schema keeps rules in sync",
        "Validation is not output encoding"
      ]
    },
    related: ["EVT-020", "EVT-022", "SEC-006", "SEC-011"]
  },

  "SEC-006": {
    tldr: "Output encoding means escaping data for **where it lands**: HTML text, an attribute, a URL, or a script. React handles HTML text and attributes; URLs and scripts are on you.",
    analogy: { icon: "📦", text: "Shipping the same cake to different places: a box for the post, a cooler for a picnic, a plate for the table. Same data, different wrapping per destination." },
    visual: { type: "tree", title: "One value, many contexts: `Tom & Jerry <3`", root: { label: "User value", note: "`Tom & Jerry <3`", children: [
      { label: "HTML text", note: "React escapes: `{name}`", children: [{ label: "`Tom &amp; Jerry &lt;3`" }] },
      { label: "Attribute", note: "React escapes: `title={name}`" },
      { label: "URL query value", note: "You: `URLSearchParams`", children: [{ label: "`q=Tom+%26+Jerry+%3C3`" }] },
      { label: "URL path segment", note: "You: `encodeURIComponent`" },
      { label: "Whole URL (href)", note: "You: protocol allowlist" },
      { label: "Inside <script>", note: "You: escape `<` in JSON (SSR)" }
    ]}},
    points: [
      "**Encoding depends on context.** HTML escaping doesn't make a value safe in a URL or a script.",
      "React escapes text children and attribute values. Don't double-encode (`&amp;amp;`): pass raw strings.",
      "Query strings: `new URLSearchParams({ q })` or `encodeURIComponent(q)`. Otherwise `&` and `#` break the URL.",
      "Path segments: `'/recipes/' + encodeURIComponent(slug)`, so `../` or `?` can't change the route.",
      "SSR: when embedding state in `<script>`, escape `<` as `\\u003c` so `</script>` can't close the tag.",
      "Avoid user values in CSS strings and inline event code; use React props and handlers."
    ],
    code: { file: "SearchLink.jsx", lang: "jsx", src: `function SearchLink({ term }) {
  const params = new URLSearchParams({ q: term, page: '1' });
  return (
    <a href={\`/search?\${params}\`} title={term}>
      Search for {term}
    </a>
  );
}

function RecipeLink({ slug, name }) {
  return <a href={\`/recipes/\${encodeURIComponent(slug)}\`}>{name}</a>;
}

export default function App() {
  return (
    <>
      <SearchLink term="Tom & Jerry <3" />
      <br />
      <RecipeLink slug="mac & cheese?" name="Mac & cheese" />
    </>
  );
}`, walk: [
      { lines: [2], note: "`URLSearchParams` encodes each value for the query string (`&` becomes `%26`)." },
      { lines: [4], note: "The `title` attribute is escaped by React; no manual encoding needed." },
      { lines: [5], note: "Text child: React escapes `&` and `<` for HTML." },
      { lines: [11], note: "`encodeURIComponent` keeps `?` and `&` inside the path segment." }
    ]},
    output: "Links to /search?q=Tom+%26+Jerry+%3C3&page=1 and /recipes/mac%20%26%20cheese%3F, each showing the original text.",
    mistakes: [
      { bad: `<a href={'/search?q=' + term}>`, good: `<a href={'/search?' + new URLSearchParams({ q: term })}>`, why: "A `&` or `#` in `term` would add params or cut the URL short." },
      { bad: `<p>{escapeHtml(name)}</p>`, good: `<p>{name}</p>`, why: "React already escapes. Doing it yourself shows `&amp;` to users (double-encoding)." },
      { bad: `<script dangerouslySetInnerHTML={{ __html: 'window.__STATE__ = ' + JSON.stringify(state) }} />`, good: `// escape < before embedding\nJSON.stringify(state).replace(/</g, '\\\\u003c')`, why: "A string containing `</script>` would close the tag and let HTML/JS after it run." }
    ],
    practice: [
      { level: "B", q: "Build `/weather?city=` for \"São Paulo & Rio\".", a: "`'/weather?' + new URLSearchParams({ city })` gives `city=S%C3%A3o+Paulo+%26+Rio`." },
      { level: "I", q: "Which contexts does React encode for you?", a: "HTML text children and attribute values. Not URL protocols, query strings, path segments, or script contents." },
      { level: "I", q: "`encodeURI` vs `encodeURIComponent`?", a: "`encodeURI` keeps `/ ? & #` (for whole URLs). `encodeURIComponent` encodes them (for one value). Use the component version for user input." },
      { level: "C", q: "A playlist name is used in `fetch('/api/playlists/' + name)`. What can go wrong?", a: "`../admin` or `x?delete=1` changes the request path. Wrap with `encodeURIComponent(name)`." }
    ],
    quiz: [
      { q: "Safe way to put a user's search term in a query string?", options: ["String concat", "`URLSearchParams` / `encodeURIComponent`", "HTML-escape it", "`encodeURI`"], answer: 1, why: "They encode `&`, `=`, `#` and other reserved characters in one value." },
      { q: "What happens if you HTML-escape a value and then render it in `{}`?", options: ["Extra safe", "Users see `&amp;` (double-encoded)", "React throws"], answer: 1, why: "React escapes again, so the entities show as text." },
      { q: "Does HTML escaping make a value safe in an `href`?", options: ["Yes", "No: you also need a protocol check"], answer: 1, why: "`javascript:alert(1)` has nothing to escape but is still dangerous." }
    ],
    rev: {
      sec30: "Encode for the destination context. React covers HTML text and attribute values. You handle URLs (`URLSearchParams`, `encodeURIComponent`, protocol allowlist), and scripts (escape `<` when embedding JSON in SSR HTML). Don't double-encode values React already escapes.",
      interview: [
        { level: "basic", q: "What is output encoding?", a: "Converting special characters so data is treated as data in a specific context: HTML entities in HTML, percent-encoding in URLs." },
        { level: "intermediate", q: "Why does context matter?", a: "Each context has different special characters. HTML-escaped text can still break a URL or a script block." },
        { level: "advanced", q: "How do you safely embed initial state in SSR HTML?", a: "Serialise with `JSON.stringify` and escape `<` (and `\\u2028`/`\\u2029`), or use a serialiser like `serialize-javascript`; frameworks do this for you." },
        { level: "tricky", q: "Input validation vs output encoding?", a: "Validation checks the data is acceptable when it arrives; encoding makes it safe for each place it's displayed. You need both." }
      ],
      cheat: [
        "Encode for where the data lands",
        "React: HTML text + attribute values",
        "Query values: `URLSearchParams`",
        "Path segments: `encodeURIComponent`",
        "Whole URLs: protocol allowlist",
        "JSON in `<script>`: escape `<`",
        "Don't double-encode"
      ]
    },
    related: ["SEC-001", "SEC-003", "SEC-005", "API-025"]
  },

  "SEC-007": {
    tldr: "A secure session keeps proof of login where scripts can't reach it (an **HttpOnly, Secure, SameSite cookie**), lives a short time, is re-checked by the server on every request, and is truly destroyed on logout.",
    analogy: { icon: "🏨", text: "A hotel key card. It's issued at check-in, only works for your room, expires at checkout, and the front desk can cancel it remotely. Losing it isn't forever." },
    visual: { type: "flow", title: "A secure cookie session", steps: [
      { label: "POST /login", detail: "Over HTTPS. Server checks password hash, rate-limits attempts, maybe asks for MFA." },
      { label: "New session ID", detail: "Server creates a **fresh** random ID (prevents session fixation) and stores it server-side." },
      { label: "Set-Cookie", detail: "`sid=…; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`. JS can't read it." },
      { label: "Every request", detail: "Browser sends the cookie; server looks up the session, checks expiry and permissions." },
      { label: "Logout / timeout", detail: "Server deletes the session and clears the cookie. Old copies stop working." }
    ]},
    points: [
      "**HttpOnly** stops XSS reading the cookie; **Secure** keeps it on HTTPS; **SameSite** limits CSRF.",
      "React learns who's logged in by calling `GET /api/me`, not by trusting a flag in `localStorage`.",
      "Use **generic** login errors (\"Email or password is wrong\") so attackers can't discover accounts.",
      "Short idle and absolute timeouts; regenerate the session ID on login and privilege changes.",
      "Logout must invalidate **server-side**; clearing React state alone leaves the session alive.",
      "A **BFF** (backend-for-frontend) keeps OAuth tokens on the server and gives React only a cookie. (.NET: cookie auth in ASP.NET Core.)"
    ],
    code: { file: "useSession.js", lang: "js", src: `import { useEffect, useState } from 'react';

const opts = { credentials: 'include' }; // send the HttpOnly cookie

export function useSession() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch('/api/me', opts)
      .then(r => (r.ok ? r.json() : null))
      .then(u => { setUser(u); setStatus(u ? 'in' : 'out'); });
  }, []);

  async function login(email, password) {
    const res = await fetch('/api/login', {
      ...opts,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Email or password is wrong');
    setUser(await res.json());
    setStatus('in');
  }

  async function logout() {
    await fetch('/api/logout', { ...opts, method: 'POST' });
    setUser(null);
    setStatus('out');
  }

  return { user, status, login, logout };
}`, walk: [
      { lines: [3], note: "The session lives in an HttpOnly cookie. React never sees or stores it." },
      { lines: [9, 10, 11, 12, 13], note: "Ask the server who we are on load. In dev, Strict Mode runs this effect twice (two requests); prod runs it once." },
      { lines: [22], note: "Same message for unknown email and wrong password (no account enumeration)." },
      { lines: [27, 28, 29, 30, 31], note: "Logout tells the server to destroy the session, then clears local state." }
    ]},
    mistakes: [
      { bad: `localStorage.setItem('isAdmin', 'true');\nif (localStorage.isAdmin) showAdmin();`, good: `const { user } = useSession(); // from /api/me\n// server checks role on every admin API call`, why: "Anyone can edit `localStorage`. The client may hide UI, but the server decides." },
      { bad: `async function logout() { setUser(null); }`, good: `async function logout() {\n  await fetch('/api/logout', { method: 'POST', credentials: 'include' });\n  setUser(null);\n}`, why: "The cookie still works until the server kills the session." }
    ],
    practice: [
      { level: "B", q: "Name the three cookie flags for a session cookie.", a: "`HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`)." },
      { level: "I", q: "Login shows \"No account with that email\". What's wrong?", a: "It leaks which emails exist. Use one generic message and rate-limit attempts." },
      { level: "I", q: "How does a React app know it's logged in after a page reload?", a: "Call `/api/me` with `credentials: 'include'`; the cookie survives reloads, React state doesn't." },
      { level: "C", q: "What is session fixation and how is it prevented?", a: "An attacker plants a known session ID before login, then reuses it after. Fix: issue a brand-new session ID on login." }
    ],
    quiz: [
      { q: "Which flag stops JavaScript reading a cookie?", options: ["Secure", "HttpOnly", "SameSite", "Path"], answer: 1, why: "`HttpOnly` hides the cookie from `document.cookie`." },
      { q: "Where should \"is this user an admin?\" be enforced?", options: ["In React state", "In localStorage", "On the server", "In the JWT payload read by React"], answer: 2, why: "Only server checks can't be tampered with." },
      { q: "Why regenerate the session ID on login?", options: ["Performance", "Prevent session fixation", "Required by React", "To shorten cookies"], answer: 1, why: "A pre-login ID an attacker knows becomes useless." }
    ],
    rev: {
      sec30: "Secure sessions: HTTPS only; session ID in an `HttpOnly; Secure; SameSite` cookie; fresh ID on login; short idle/absolute timeouts; server re-checks on every request; logout destroys the session server-side. React reads identity from `/api/me`, uses generic login errors and never treats client state as authority.",
      interview: [
        { level: "basic", q: "Why HttpOnly cookies for sessions?", a: "Injected scripts can't read them, so XSS can't steal the session ID outright." },
        { level: "intermediate", q: "Cookies vs tokens in localStorage for a SPA?", a: "HttpOnly cookies resist theft via XSS but need CSRF protection; localStorage tokens avoid CSRF but any XSS can steal them. Cookie sessions or a BFF are usually safer." },
        { level: "advanced", q: "What's the BFF pattern?", a: "A small server next to the SPA handles OAuth, keeps tokens server-side and gives the browser only a session cookie. Tokens never reach JavaScript." },
        { level: "tricky", q: "If cookies are HttpOnly, is XSS harmless?", a: "No. The attacker can't read the cookie, but their script can still make requests with it from the victim's browser." },
        { level: "intermediate", q: "What should logout do?", a: "Invalidate the session on the server, clear the cookie, clear client caches and state." }
      ],
      cheat: [
        "`HttpOnly; Secure; SameSite=Lax` session cookie",
        "New session ID at login (no fixation)",
        "Identity from `/api/me`, not localStorage",
        "Generic login errors + rate limiting + MFA",
        "Idle + absolute timeouts",
        "Logout = destroy server-side",
        "BFF keeps tokens off the browser"
      ]
    },
    related: ["AUTH-002", "AUTH-009", "SEC-008", "SEC-002"]
  },

  "SEC-008": {
    tldr: "If you must use tokens in the browser, keep them **short-lived**, **out of reach** (memory, not `localStorage`), and **narrow** in scope. Refresh tokens go in an HttpOnly cookie and are rotated on every use.",
    analogy: { icon: "🎫", text: "A day pass at a theme park: valid for a few hours, only for certain rides, kept in your pocket not taped to your back. Losing it costs little." },
    visual: { type: "timeline", title: "A token's life (access 15 min, refresh rotated)", frames: [
      { label: "Login", state: "access: in memory (15m) · refresh: HttpOnly cookie", note: "Access token never touches localStorage." },
      { label: "14 min later", state: "API → 401 expired", note: "Fetch wrapper calls `/refresh`; cookie is sent automatically." },
      { label: "Refresh", state: "new access + **new** refresh cookie", note: "Rotation: the old refresh token is now dead." },
      { label: "Page reload", state: "memory empty → silent refresh", note: "User stays logged in without storing the token." },
      { label: "Stolen refresh reused", state: "server sees reuse → revokes all", note: "Reuse detection logs out the whole token family." }
    ]},
    points: [
      "Access tokens: **short** life (5-15 min), minimal **scopes**, kept in a JS variable (memory).",
      "Refresh tokens: `HttpOnly; Secure; SameSite=Strict` cookie, `Path=/api/auth`, **rotated** each use.",
      "Never put tokens in **URLs** (logged by servers, history, `Referer`) or in logs/error reports.",
      "On logout: revoke on the server, clear memory, clear caches (e.g. `queryClient.clear()`).",
      "A JWT is signed, not encrypted: anyone can read its payload. Don't put secrets in it.",
      "Safest: no tokens in the browser at all (cookie session or BFF). See SEC-007."
    ],
    code: { file: "api.js", lang: "js", src: `let accessToken = null; // memory only: not in localStorage

export function setAccessToken(token) {
  accessToken = token;
}

async function refresh() {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include', // sends the HttpOnly refresh cookie
  });
  if (!res.ok) {
    accessToken = null;
    return false;
  }
  ({ accessToken } = await res.json());
  return true;
}

export async function api(path, options = {}) {
  const send = () =>
    fetch(path, {
      ...options,
      headers: { ...options.headers, Authorization: \`Bearer \${accessToken}\` },
    });
  let res = await send();
  if (res.status === 401 && (await refresh())) res = await send();
  return res;
}`, walk: [
      { lines: [1], note: "Module variable: XSS can still use it while the page is open, but can't grab it from storage later." },
      { lines: [8, 9, 10, 11], note: "The refresh token is a cookie JS can't read; the server rotates it on each call." },
      { lines: [12, 13, 14, 15], note: "Refresh failed (expired/revoked): drop the token so the app shows login." },
      { lines: [24], note: "Attach the short-lived token as a header. Never in the URL." },
      { lines: [27], note: "On 401, refresh once and retry. Concurrent calls should share one refresh promise." }
    ]},
    mistakes: [
      { bad: `localStorage.setItem('token', jwt);`, good: `setAccessToken(jwt); // memory\n// refresh token: HttpOnly cookie set by the server`, why: "Any XSS can read `localStorage` and replay the token from another machine." },
      { bad: `fetch(\`/api/export?token=\${token}\`)`, good: `fetch('/api/export', { headers: { Authorization: \`Bearer \${token}\` } })`, why: "URLs end up in server logs, browser history and Referer headers." },
      { bad: `// access token valid for 30 days`, good: `// access 15 min + rotating refresh token`, why: "A stolen long-lived token is a long-lived breach." }
    ],
    practice: [
      { level: "B", q: "Where should a SPA keep an access token?", a: "In memory (a variable or React state/context), not `localStorage`/`sessionStorage`." },
      { level: "I", q: "User reloads the page and the in-memory token is gone. Now what?", a: "Call the refresh endpoint on startup; the HttpOnly cookie gets a new access token." },
      { level: "I", q: "Three requests get 401 at once. How do you avoid three refreshes?", a: "Store the in-flight refresh promise and have all callers await the same one." },
      { level: "C", q: "What is refresh token rotation with reuse detection?", a: "Each refresh issues a new refresh token and invalidates the old. If an old one is used again, the server assumes theft and revokes the whole family." }
    ],
    quiz: [
      { q: "Best place for a refresh token in a browser app?", options: ["localStorage", "A JS variable", "HttpOnly Secure cookie", "The URL"], answer: 2, why: "JS can't read it, and it's sent only to the auth endpoint." },
      { q: "Why keep access tokens short-lived?", options: ["Smaller headers", "Limits damage if stolen", "Faster JWT parsing", "Browsers require it"], answer: 1, why: "A stolen token stops working soon." },
      { q: "Can anyone read a JWT's payload?", options: ["No, it's encrypted", "Yes, it's only base64url-encoded and signed"], answer: 1, why: "Signing proves integrity, not secrecy." }
    ],
    rev: {
      sec30: "Limit exposure and lifetime. Access token: minutes, minimal scope, in memory, sent as a Bearer header. Refresh token: HttpOnly Secure SameSite cookie, rotated, reuse-detected. No tokens in URLs, logs or localStorage. Revoke and clear on logout. Better still, keep tokens on a server (BFF) and give the browser a session cookie.",
      interview: [
        { level: "basic", q: "Why not store JWTs in localStorage?", a: "Any XSS can read and exfiltrate them; the attacker then uses them from anywhere until they expire." },
        { level: "intermediate", q: "How does a SPA stay logged in after reload with memory tokens?", a: "A silent refresh: on startup call `/refresh`, the HttpOnly cookie proves the session, and you get a fresh access token." },
        { level: "advanced", q: "Explain refresh token rotation.", a: "Every refresh returns a new refresh token and kills the old one. Reuse of an old token signals theft, so the server revokes the token family." },
        { level: "tricky", q: "Memory storage fully protects against XSS?", a: "No. Script running in the page can still call your API or hook `fetch`. It just can't steal a long-lived token for later. Fix XSS itself." }
      ],
      compare: { cols: ["", "Access token", "Refresh token"], rows: [
        ["Lifetime", "5-15 min", "Days, rotated"],
        ["Stored", "Memory", "HttpOnly cookie"],
        ["Sent to", "Every API call", "Only /auth/refresh"]
      ]},
      cheat: [
        "Access: short, narrow, in memory",
        "Refresh: HttpOnly cookie, rotated, reuse detection",
        "Never in URLs, logs, or localStorage",
        "Share one refresh promise across 401s",
        "JWT payload is readable",
        "Logout = revoke + clear memory + clear caches"
      ]
    },
    related: ["AUTH-005", "AUTH-010", "API-018", "SEC-007"]
  },

  "SEC-009": {
    tldr: "Most of your app's code is other people's packages (dependencies). Some have known holes. **Audit** them regularly, **update** on purpose, test, and commit the **lockfile** so everyone installs the same versions.",
    analogy: { icon: "🥫", text: "A kitchen pantry. Ingredients come from many suppliers. Now and then a supplier recalls a batch, so you check labels, swap the recalled jars, and taste before serving." },
    visual: { type: "cycle", title: "The dependency hygiene loop", steps: [
      { label: "Audit", detail: "`npm audit` checks your lockfile against the advisory database." },
      { label: "Triage", detail: "Is it in production code or dev-only? Is the vulnerable function reachable? How severe?" },
      { label: "Update", detail: "`npm audit fix` for safe bumps; upgrade majors on purpose; `overrides` for deep deps." },
      { label: "Test", detail: "Run tests and `npm run build`. Breaking changes hide in major versions." },
      { label: "Commit lockfile", detail: "Commit `package-lock.json`; CI installs with `npm ci`. Repeat weekly (Dependabot/Renovate)." }
    ]},
    points: [
      "`npm audit` lists known vulnerabilities; `--omit=dev` focuses on what ships to users.",
      "`npm audit fix` applies semver-compatible fixes. Avoid blind `--force`: it can jump major versions.",
      "**Commit the lockfile** and use `npm ci` in CI for exact, reproducible installs.",
      "Automate PRs with **Dependabot** or **Renovate**; let CI tests gate them.",
      "Before adding a package: is it maintained, widely used, spelled right (typosquatting)? Fewer deps = smaller attack surface.",
      "Stuck on a vulnerable sub-dependency? Pin a fixed version with `overrides` in `package.json`."
    ],
    code: { file: "terminal", lang: "bash", src: `# 1. What's vulnerable in code that ships?
npm audit --omit=dev

# 2. Apply safe (semver-compatible) fixes
npm audit fix

# 3. What's out of date?
npm outdated

# 4. Upgrade one package on purpose, then test
npm install react-markdown@latest
npm test && npm run build

# 5. In CI: install exactly what the lockfile says
npm ci

# 6. Fail CI on high-severity issues
npm audit --audit-level=high`, walk: [
      { lines: [2], note: "Skip devDependencies to see what users actually download." },
      { lines: [5], note: "Bumps within allowed ranges and updates the lockfile." },
      { lines: [8], note: "Shows current, wanted and latest versions side by side." },
      { lines: [11, 12], note: "Major upgrades are deliberate: read the changelog, then run tests and a build." },
      { lines: [15, 18], note: "`npm ci` is exact and clean; `--audit-level=high` turns serious advisories into a failing build." }
    ]},
    mistakes: [
      { bad: `npm audit fix --force`, good: `npm audit fix\n# then upgrade majors one by one and test`, why: "`--force` can install breaking major versions without you noticing." },
      { bad: `# .gitignore\npackage-lock.json`, good: `# commit package-lock.json\n# CI: npm ci`, why: "Without a lockfile, every install can pull different (possibly compromised) versions." },
      { bad: `npm i reacct-router`, good: `npm i react-router`, why: "Typosquatted names are a real attack. Check the package name, author and download count." }
    ],
    practice: [
      { level: "B", q: "Which command shows known vulnerabilities?", a: "`npm audit`." },
      { level: "I", q: "`npm audit` flags a high issue in a dev-only test tool. Panic?", a: "Lower priority: it doesn't ship to users. Still fix it, since dev tools run on your machine and CI." },
      { level: "I", q: "A deep dependency has a fix but your direct dep hasn't updated. What now?", a: "Use `overrides` to force the patched version, then test.", code: `{\n  \"overrides\": {\n    \"vulnerable-lib\": \"^2.4.1\"\n  }\n}` },
      { level: "C", q: "Set up automatic dependency updates.", a: "Enable Dependabot (`.github/dependabot.yml`, ecosystem `npm`, weekly) or Renovate; require CI to pass before merging." }
    ],
    quiz: [
      { q: "Why use `npm ci` in CI instead of `npm install`?", options: ["It's prettier", "Installs exactly the lockfile versions", "Skips tests", "Updates everything"], answer: 1, why: "Reproducible builds; it fails if lockfile and package.json disagree." },
      { q: "What does `npm audit fix --force` risk?", options: ["Nothing", "Breaking major upgrades", "Deleting the lockfile", "Uninstalling React"], answer: 1, why: "It allows semver-major changes." },
      { q: "Best first check before installing a new package?", options: ["Its logo", "Maintenance, popularity and the exact name", "Its file size only"], answer: 1, why: "Abandoned or typosquatted packages are common attack paths." }
    ],
    rev: {
      sec30: "Dependencies are most of your code. Run `npm audit` (focus with `--omit=dev`), `npm audit fix` for safe bumps, upgrade majors deliberately, test, and commit the lockfile. CI uses `npm ci` and can fail on `--audit-level=high`. Automate with Dependabot/Renovate, vet new packages, and use `overrides` for stuck transitive deps.",
      interview: [
        { level: "basic", q: "How do you check for vulnerable packages?", a: "`npm audit` locally and in CI, plus automated update PRs from Dependabot or Renovate." },
        { level: "intermediate", q: "Why commit `package-lock.json`?", a: "It pins exact versions of every transitive dep, so dev, CI and prod get the same, reviewed code." },
        { level: "advanced", q: "What's a supply-chain attack?", a: "Compromising a package you depend on (hijacked maintainer, typosquat, malicious install script) so its code runs in your build or users' browsers." },
        { level: "tricky", q: "`npm audit` shows 0 issues. Are you safe?", a: "Only from **known, reported** advisories. Unknown bugs, malicious new versions and abandoned packages won't show." }
      ],
      cheat: [
        "`npm audit --omit=dev`",
        "`npm audit fix` (not `--force` blindly)",
        "`npm outdated` to plan upgrades",
        "Commit the lockfile; CI uses `npm ci`",
        "Dependabot / Renovate + CI tests",
        "`overrides` for stuck sub-dependencies",
        "Vet new packages; watch for typosquats"
      ]
    },
    related: ["ENV-002", "ENV-006", "PROD-010", "PROD-018"]
  },

  "SEC-010": {
    tldr: "In Vite, any variable starting with `VITE_` is pasted into your JavaScript bundle at build time. Every visitor can read it. **Never put secrets in `VITE_` variables**: keep them on a server.",
    analogy: { icon: "🪧", text: "Writing on the shop window. `VITE_` means \"print this on the window\": fine for opening hours, terrible for the safe's combination." },
    visual: { type: "flow", title: "Where a VITE_ variable ends up", steps: [
      { label: "`.env.local`", detail: "`VITE_WEATHER_KEY=sk_live_123` (gitignored, but that's not the point)." },
      { label: "Your code", detail: "`import.meta.env.VITE_WEATHER_KEY`" },
      { label: "`vite build`", detail: "Vite replaces it with the **literal string** `\"sk_live_123\"`." },
      { label: "`dist/assets/index-abc.js`", detail: "The key now sits in a public file on your host or CDN." },
      { label: "Any visitor", detail: "DevTools → Sources or Network shows the key. It's leaked." }
    ]},
    points: [
      "Only `VITE_*` variables reach client code via `import.meta.env`. Others (e.g. `DB_PASSWORD`) stay out.",
      "**Public by design**: API base URLs, feature flags, publishable keys (e.g. Stripe `pk_…`).",
      "**Secret**: private API keys, DB passwords, signing secrets. Put them on a server/proxy that calls the API for you.",
      "Values are **baked in at build time**. Changing `.env` needs a rebuild.",
      "Built-ins: `import.meta.env.MODE`, `DEV`, `PROD`, `BASE_URL`. Changing `envPrefix` doesn't make anything secret.",
      "Keep real values in `.env.local` (gitignored by the Vite template); commit a `.env.example`."
    ],
    code: { file: "weather.js", lang: "js", src: `// .env.local
// VITE_API_URL=https://api.weather.example  -> public: fine
// VITE_WEATHER_KEY=sk_live_123              -> shipped to every visitor
// WEATHER_KEY=sk_live_123                   -> not in the bundle (server only)

const API = import.meta.env.VITE_API_URL;

// Bad: the key is inlined into dist/assets/*.js
export function getWeatherLeaky(city) {
  const key = import.meta.env.VITE_WEATHER_KEY;
  return fetch(\`\${API}/current?city=\${encodeURIComponent(city)}&key=\${key}\`);
}

// Good: call your own backend; it adds the secret key server-side
export async function getWeather(city) {
  const res = await fetch(\`/api/weather?city=\${encodeURIComponent(city)}\`);
  if (!res.ok) throw new Error('Weather unavailable');
  return res.json();
}

if (import.meta.env.DEV) console.log('mode:', import.meta.env.MODE);`, walk: [
      { lines: [2, 3, 4], note: "Prefix decides exposure: `VITE_` = public, no prefix = hidden from client code." },
      { lines: [6], note: "A public base URL is a fine `VITE_` value." },
      { lines: [9, 10, 11, 12], note: "This key becomes plain text in the bundle. Anyone can copy and abuse it." },
      { lines: [15, 16, 17, 18, 19], note: "Your server holds `WEATHER_KEY`, calls the weather API and returns only the data." },
      { lines: [21], note: "`DEV` is `true` only on the dev server; the line is dropped from production builds." }
    ]},
    mistakes: [
      { bad: `VITE_OPENAI_KEY=sk-...\nfetch(url, { headers: { Authorization: 'Bearer ' + import.meta.env.VITE_OPENAI_KEY } })`, good: `// server: process.env.OPENAI_KEY\nfetch('/api/chat', { method: 'POST', body })`, why: "Private keys in the bundle get scraped and billed to you. Proxy through your backend." },
      { bad: `// "it's in .env.local, which is gitignored, so it's safe"`, good: `// gitignore protects the repo, not the bundle`, why: "Ignoring the file keeps it out of Git; `vite build` still copies `VITE_` values into public JS." }
    ],
    practice: [
      { level: "B", q: "Which of these is OK as a `VITE_` variable: API base URL, DB password, Stripe publishable key?", a: "API base URL and Stripe publishable key. Never the DB password." },
      { level: "I", q: "You changed `VITE_API_URL` on the host but the site still calls the old URL. Why?", a: "It was baked in at build time. Rebuild and redeploy." },
      { level: "I", q: "How can you prove a value leaked?", a: "Run `npm run build`, then search `dist/` for the value (e.g. `grep -r sk_live dist`)." },
      { level: "C", q: "A key already shipped in a `VITE_` variable. What now?", a: "Rotate (revoke) the key at the provider immediately, move it server-side, redeploy. Removing it from code doesn't un-leak it." }
    ],
    quiz: [
      { q: "Who can read `import.meta.env.VITE_SECRET` in production?", options: ["Only the server", "Only logged-in users", "Anyone who loads the site", "No one: it's encrypted"], answer: 2, why: "It's a string in the public JS bundle." },
      { q: "Is `DB_PASSWORD` (no prefix) in `.env` exposed to client code?", options: ["Yes", "No"], answer: 1, why: "Vite only exposes variables matching `envPrefix` (default `VITE_`)." },
      { q: "When are `VITE_` values read?", options: ["Each page load", "At build time", "On every fetch"], answer: 1, why: "They're statically replaced during the build." }
    ],
    rev: {
      sec30: "Vite statically replaces `import.meta.env.VITE_*` with literal strings at build time, so every `VITE_` value ships in public JS. Use them for public config only (base URLs, flags, publishable keys). Secrets live on a server that calls third-party APIs for you. Leaked a key? Rotate it.",
      interview: [
        { level: "basic", q: "Can I hide an API key in a React env variable?", a: "No. Anything the browser needs to run is in the bundle. `VITE_` vars are inlined at build time and readable by anyone." },
        { level: "intermediate", q: "How do you call a paid API without exposing the key?", a: "Put a small backend or serverless function in front of it that holds the key, adds auth and rate limits, and returns only the needed data." },
        { level: "advanced", q: "How do you change config per environment without rebuilding?", a: "Load a runtime `config.json` from the host at startup, or have the server inject it. Still public data only." },
        { level: "tricky", q: "Does `.env.local` being gitignored keep the value secret?", a: "Only from the repo. If it's `VITE_`-prefixed, the build copies it into public JS." }
      ],
      cheat: [
        "`VITE_*` = public, in the bundle",
        "Inlined at build time; change = rebuild",
        "Secrets go on a server/proxy",
        "OK: base URLs, flags, publishable keys",
        "`MODE`, `DEV`, `PROD`, `BASE_URL` built-ins",
        "Leaked key → rotate it now"
      ]
    },
    related: ["ENV-011", "API-019", "PROD-002", "SEC-011"]
  },

  "SEC-011": {
    tldr: "Your React app is a suggestion; the API is the law. Every request must be **authorised on the server** (\"may *this* user touch *this* order?\") and **rate-limited**, because attackers skip your UI and call the API directly.",
    analogy: { icon: "🍽️", text: "A restaurant menu hides the kitchen door, but the kitchen still checks who walks in. Hiding the \"Edit\" button is the menu; server checks are the staff at the door." },
    visual: { type: "flow", title: "What the server checks on every request", steps: [
      { label: "Who are you?", detail: "Valid session or token? If not: **401**." },
      { label: "May you do this?", detail: "Role/permission for the action, e.g. `orders:read`. If not: **403**." },
      { label: "Is it yours?", detail: "Does order 42 belong to this user? Skipping this is **IDOR/BOLA**, the #1 API bug." },
      { label: "Too many?", detail: "Rate limit per user/IP. Over the limit: **429** + `Retry-After`." },
      { label: "Return only what's needed", detail: "Validate input, compute prices server-side, send minimal fields." }
    ]},
    points: [
      "Hiding buttons or routes in React is **UX only**. Anyone can call `/api/orders/43` with curl.",
      "Check **object ownership** on every read/write: change the ID in the URL, does it still work? It mustn't.",
      "Never trust client-sent `userId`, `role` or `price`. Use the session's user and look prices up server-side.",
      "Don't over-share: if React hides `email`, the JSON shouldn't contain it either.",
      "**CORS is not access control**: it only stops other sites' JS reading responses; curl ignores it.",
      "Handle **401/403/429** gracefully in React: re-login, \"no access\", \"try again in N s\"."
    ],
    code: { file: "orders.js", lang: "js", src: `export async function getOrder(id) {
  const res = await fetch(\`/api/orders/\${encodeURIComponent(id)}\`, {
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('Please log in again');
  if (res.status === 403 || res.status === 404) throw new Error('Order not found');
  if (res.status === 429) {
    const wait = res.headers.get('Retry-After') ?? '30';
    throw new Error(\`Too many requests. Try again in \${wait}s\`);
  }
  if (!res.ok) throw new Error('Something went wrong');
  return res.json();
}

// Checkout: send WHAT, never HOW MUCH
export function checkout(cart) {
  const items = cart.map(({ id, qty }) => ({ id, qty }));
  return fetch('/api/checkout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
}

// Server (any stack) must still, on EVERY request:
//   user = session.user          -> 401 if missing
//   order = db.find(id)
//   order.userId !== user.id     -> 403/404
//   rate limit by user + IP      -> 429`, walk: [
      { lines: [5], note: "401: session gone. Send the user to login." },
      { lines: [6], note: "Not yours: many APIs return 404 so they don't reveal the order exists." },
      { lines: [7, 8, 9, 10], note: "429: back off and tell the user when to retry." },
      { lines: [16, 17], note: "Strip prices and totals. The server computes them from its own data." },
      { lines: [26, 27, 28, 29, 30], note: "The real security lives here, whatever your backend (.NET: `[Authorize]` + resource checks)." }
    ]},
    mistakes: [
      { bad: `{user.role === 'admin' && <DeleteButton />}\n// API: DELETE /api/users/:id (no role check)`, good: `// API: if (session.user.role !== 'admin') return 403\n{user.role === 'admin' && <DeleteButton />}`, why: "The button hides UI; only the server check blocks a crafted request." },
      { bad: `fetch('/api/orders?userId=' + user.id)`, good: `fetch('/api/my/orders') // server uses session.user.id`, why: "A client-supplied `userId` lets anyone list other people's orders." }
    ],
    practice: [
      { level: "B", q: "Hiding the admin page with a protected route: is the admin API now safe?", a: "No. The route guard is UX. The API must check the role itself." },
      { level: "I", q: "How do you test for IDOR in your app?", a: "Log in as user A, copy a request for one of A's resources, change the ID to user B's. It must return 403/404." },
      { level: "I", q: "Show a friendly message on 429.", a: "Read `Retry-After` and show \"Too many requests, try again in N s\"; disable the button meanwhile." },
      { level: "C", q: "Why limit login and password-reset endpoints especially?", a: "They're targets for brute force, credential stuffing and email spam. Limit per account and per IP; add CAPTCHA after failures." }
    ],
    quiz: [
      { q: "Where must authorisation be enforced?", options: ["React route guards", "The API server", "CORS settings", "The JWT stored in localStorage"], answer: 1, why: "Only the server can't be bypassed." },
      { q: "User A fetches `/api/orders/99` (user B's) and gets it. This is…", options: ["XSS", "CSRF", "IDOR / broken object-level authorisation", "Rate limiting"], answer: 2, why: "The server didn't check ownership." },
      { q: "Status code for \"slow down\"?", options: ["401", "403", "429", "500"], answer: 2, why: "429 Too Many Requests, often with `Retry-After`." }
    ],
    rev: {
      sec30: "The client can't enforce security. The API must authenticate (401), authorise the action (403), check ownership of every object (IDOR/BOLA), validate input, compute prices itself, rate-limit (429) and return minimal data. CORS isn't auth. React's job: hide what users can't use and handle 401/403/429 well.",
      interview: [
        { level: "basic", q: "Is a protected route enough to secure an admin feature?", a: "No. It only hides UI. The API endpoints must check the user's role on every request." },
        { level: "intermediate", q: "What is IDOR / BOLA?", a: "Broken object-level authorisation: the API trusts an ID from the request without checking the resource belongs to the caller, so changing the ID exposes other users' data." },
        { level: "advanced", q: "How would you design rate limiting?", a: "Per user and per IP, stricter on login/reset, return 429 with `Retry-After`, usually at a gateway or middleware (ASP.NET Core has built-in rate limiting)." },
        { level: "tricky", q: "Does CORS stop people calling your API?", a: "No. It only controls whether browser JS on another origin can read the response. curl, Postman and servers ignore it." }
      ],
      scenario: [
        { q: "The user list JSON includes `passwordHash` but React doesn't show it. Problem?", a: "Yes: data exposure. Anyone can see it in the Network tab. Return a DTO with only needed fields." }
      ],
      cheat: [
        "UI hides; server decides",
        "401 = who? 403 = not allowed, 429 = slow down",
        "Check ownership of every object (IDOR)",
        "Never trust client `userId`, `role`, `price`",
        "Return minimal fields (DTOs)",
        "CORS is not access control"
      ]
    },
    related: ["AUTH-006", "AUTH-007", "AUTH-013", "API-004"]
  },

  "SEC-012": {
    tldr: "A **Content Security Policy** (CSP) is a response header listing where scripts, styles and requests may come from. If an attacker injects a script anyway, the browser refuses to run it. It's your XSS safety net.",
    analogy: { icon: "📋", text: "A guest list at the door of a party. Even if someone sneaks an invitation into the pile, the bouncer only lets in names on the list." },
    visual: { type: "flow", title: "CSP blocking an injected script", steps: [
      { label: "Server sends the header", detail: "`Content-Security-Policy: script-src 'self'; object-src 'none'`" },
      { label: "Page loads your bundle", detail: "`/assets/index-abc.js` is from `'self'`: allowed." },
      { label: "Injected script appears", detail: "XSS adds `<script>steal()</script>` or loads `evil.site/x.js`." },
      { label: "Browser checks the policy", detail: "Inline script and evil.site aren't listed: **blocked**." },
      { label: "Violation reported", detail: "Console error, plus a report to your endpoint if configured." }
    ]},
    points: [
      "Send it as an HTTP **header** (from your host or server). A `<meta>` tag works but can't set `frame-ancestors` or reporting.",
      "Core directives: `default-src`, `script-src`, `style-src`, `img-src`, `connect-src` (fetch targets), `object-src 'none'`, `base-uri`, `frame-ancestors`.",
      "Avoid `'unsafe-inline'` and `'unsafe-eval'` in `script-src`: they switch off most of the protection.",
      "Vite production builds load scripts from files, so `script-src 'self'` fits. Need inline? Use a **nonce** or **hash** (Vite: `html.cspNonce`).",
      "The dev server injects inline scripts (HMR, React Refresh), so apply the strict policy in **production**.",
      "Roll out with `Content-Security-Policy-Report-Only` first, fix violations, then enforce."
    ],
    code: { file: "Content-Security-Policy (header)", lang: "text", src: `Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data: https://images.shop.example;
  font-src 'self';
  connect-src 'self' https://api.shop.example;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests

(sent as one line; split here for reading)`, walk: [
      { lines: [2], note: "Fallback for any type not listed: only our own origin." },
      { lines: [3], note: "Scripts only from our files. No inline `<script>`, no `eval`, no other domains." },
      { lines: [5, 7], note: "Allow product images from the CDN and API calls to our API domain." },
      { lines: [8, 9, 10], note: "No plugins, no `<base>` hijacks, forms only post to us." },
      { lines: [11], note: "No one may frame our app (stops clickjacking). Header only." }
    ]},
    output: "Injected code is blocked. Console: Refused to execute inline script because it violates the following Content Security Policy directive: \"script-src 'self'\".",
    mistakes: [
      { bad: `script-src 'self' 'unsafe-inline' 'unsafe-eval' *`, good: `script-src 'self'`, why: "That policy allows inline scripts, eval and any domain: it blocks almost nothing." },
      { bad: `// ship enforce mode on day one, site breaks`, good: `Content-Security-Policy-Report-Only: ...; report-to csp`, why: "Report-only shows what would break (analytics, fonts, CDNs) without breaking it." }
    ],
    practice: [
      { level: "B", q: "Which directive controls where `fetch` can call?", a: "`connect-src`." },
      { level: "I", q: "You add Google Fonts. What changes?", a: "Allow the CSS and font hosts.", code: `style-src 'self' https://fonts.googleapis.com;\nfont-src 'self' https://fonts.gstatic.com;` },
      { level: "I", q: "Analytics needs one inline snippet. Options without `'unsafe-inline'`?", a: "Move it into a file, or use a per-request **nonce** (`script-src 'nonce-r4nd0m'` + `<script nonce=\"r4nd0m\">`) or a hash of the script." },
      { level: "C", q: "Does CSP replace sanitising HTML?", a: "No. It's defence in depth. Sanitise and escape first; CSP catches what slips through." }
    ],
    quiz: [
      { q: "What does `script-src 'self'` block?", options: ["Your bundled JS", "Inline scripts and scripts from other domains", "All images", "fetch calls"], answer: 1, why: "Only same-origin script files are allowed." },
      { q: "Which value most weakens a CSP?", options: ["`'self'`", "`'none'`", "`'unsafe-inline'` in script-src", "`data:` in img-src"], answer: 2, why: "Inline scripts are exactly what XSS injects." },
      { q: "Safest way to introduce a CSP on a live site?", options: ["Enforce immediately", "Report-Only first, then enforce", "Only in development"], answer: 1, why: "You see violations without breaking users." }
    ],
    rev: {
      sec30: "CSP is a header that allowlists sources for scripts, styles, images and connections. A strict `script-src 'self'` (no `unsafe-inline`/`unsafe-eval`) stops injected scripts. Add `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`. Use nonces/hashes for unavoidable inline code, start in Report-Only, enforce in production.",
      interview: [
        { level: "basic", q: "What is CSP?", a: "A response header that tells the browser which sources of scripts and other resources are allowed, so injected code is blocked." },
        { level: "intermediate", q: "Why is `'unsafe-inline'` bad?", a: "XSS usually injects inline script or handlers; allowing inline code lets those run, defeating the policy." },
        { level: "advanced", q: "Nonce vs hash?", a: "A nonce is a random value per response put on allowed `<script>` tags; a hash allowlists one exact script's content. Nonces need server rendering; hashes suit static pages." },
        { level: "tricky", q: "Does a CSP make `dangerouslySetInnerHTML` safe?", a: "No. It may block scripts, but injected HTML can still deface the page or phish users. Sanitise anyway." },
        { level: "intermediate", q: "How do you add CSP to a Vite SPA?", a: "Set the header on the host (Netlify/Vercel config, Nginx) or server. The production build has no inline scripts, so `script-src 'self'` usually works." }
      ],
      cheat: [
        "CSP = allowlist of sources, as a response header",
        "`script-src 'self'`, no `unsafe-inline`/`unsafe-eval`",
        "`object-src 'none'; base-uri 'self'`",
        "`frame-ancestors 'none'` stops clickjacking (header only)",
        "`connect-src` = where fetch may go",
        "Nonce or hash for necessary inline code",
        "Report-Only first, then enforce"
      ]
    },
    related: ["SEC-001", "SEC-004", "PROD-008", "PROD-005"]
  },

  "SEC-013": {
    tldr: "Most React security bugs are the same handful: raw HTML, unchecked links, secrets in the bundle, tokens in `localStorage`, client-only checks, spreading untrusted data, and stale packages. Learn to spot and fix each one.",
    analogy: { icon: "🔍", text: "A safety checklist before opening a café: gas off, doors locked, fridge cold. Same few checks every day catch most problems." },
    visual: { type: "tree", title: "The usual suspects", root: { label: "React app", children: [
      { label: "Rendering", children: [
        { label: "Raw `dangerouslySetInnerHTML`", note: "→ DOMPurify" },
        { label: "User URL in `href`", note: "→ protocol allowlist" },
        { label: "`{...apiData}` spread", note: "→ pick fields" }
      ]},
      { label: "Secrets", children: [
        { label: "Keys in `VITE_` vars", note: "→ server proxy" },
        { label: "Tokens in localStorage", note: "→ HttpOnly cookie / memory" }
      ]},
      { label: "Trust", children: [
        { label: "Client-only role checks", note: "→ server authorises" },
        { label: "Price sent by client", note: "→ server computes" }
      ]},
      { label: "Supply chain", children: [{ label: "Stale deps", note: "→ audit + update" }] }
    ]}},
    points: [
      "**Raw HTML** → sanitise with DOMPurify or render as text.",
      "**User links** → `new URL()` + `http:`/`https:` allowlist; validate redirects.",
      "**Spreading untrusted objects** onto elements can inject `href`, `style` or even `dangerouslySetInnerHTML`. Pick fields explicitly.",
      "**Secrets & tokens** → nothing secret in `VITE_`; no long-lived tokens in `localStorage`; nothing sensitive in logs.",
      "**Trust** → UI checks are cosmetic; the server authorises, validates and prices.",
      "**Hygiene** → `npm audit`, lockfile, a CSP, and ESLint (`react/no-danger`, `react/jsx-no-script-url`)."
    ],
    code: { file: "ProfileCard.jsx", lang: "jsx", src: `import DOMPurify from 'dompurify';

function safeUrl(u) {
  try {
    return ['http:', 'https:'].includes(new URL(u).protocol) ? u : '#';
  } catch {
    return '#';
  }
}

// Before: <div {...profile}>, raw bio HTML, user href, isAdmin from localStorage
export function ProfileCard({ profile, me }) {
  const { name, bio, website } = profile; // pick fields, don't spread
  const cleanBio = DOMPurify.sanitize(bio);

  return (
    <article className="profile">
      <h3>{name}</h3>
      <div dangerouslySetInnerHTML={{ __html: cleanBio }} />
      <a href={safeUrl(website)} target="_blank" rel="noopener noreferrer">
        Website
      </a>
      {me?.role === 'admin' && <button>Ban user</button>}
    </article>
  );
}`, walk: [
      { lines: [3, 4, 5, 6, 7, 8, 9], note: "Fix 1: links only allow http/https." },
      { lines: [13], note: "Fix 2: destructure the fields you need. A spread could inject unexpected props." },
      { lines: [14, 19], note: "Fix 3: bio HTML is sanitised before it reaches `__html`." },
      { lines: [20], note: "Fix 1 applied, plus `rel` to isolate the new tab." },
      { lines: [23], note: "Fix 4: `me` comes from `/api/me`, and the ban API checks the role again." }
    ]},
    mistakes: [
      { bad: `const props = await res.json();\nreturn <a {...props}>Open</a>;`, good: `const { label, url } = await res.json();\nreturn <a href={safeUrl(url)}>{label}</a>;`, why: "Untrusted JSON can set `href: 'javascript:…'` or `dangerouslySetInnerHTML`. Never spread it onto elements." },
      { bad: `console.log('login ok', { token, password });`, good: `console.log('login ok', { userId: user.id });`, why: "Logs end up in monitoring tools and browser consoles. Never log secrets or tokens." },
      { bad: `const STRIPE_SECRET = 'sk_live_...'; // in src/`, good: `// server only: process.env.STRIPE_SECRET\n// client: VITE_STRIPE_PK=pk_live_...`, why: "Anything in `src/` ships to the browser. Only publishable keys belong there." }
    ],
    practice: [
      { level: "B", q: "Spot the bug: `<a href={comment.link}>`.", a: "User-controlled URL. Wrap in `safeUrl()` to allow only http/https." },
      { level: "I", q: "Spot the bug: `<Widget {...JSON.parse(localStorage.settings)} />`.", a: "Untrusted (user-editable) data spread as props. Parse, validate and pick known fields." },
      { level: "I", q: "Which ESLint rules catch two of these bugs?", a: "`react/no-danger` (raw HTML) and `react/jsx-no-script-url` (`javascript:` links)." },
      { level: "C", q: "Write a 5-item security checklist for a React PR review.", a: "No unsanitised `dangerouslySetInnerHTML`; user URLs validated; no secrets in client code/`VITE_`; auth checks also server-side; new deps vetted and audited." }
    ],
    quiz: [
      { q: "Why is `<div {...apiData} />` risky?", options: ["It's slow", "Untrusted data can inject dangerous props", "React forbids spread", "It breaks keys"], answer: 1, why: "Props like `dangerouslySetInnerHTML` or `href` could come from the data." },
      { q: "Which belongs in client code?", options: ["Stripe secret key", "Stripe publishable key", "DB password", "JWT signing secret"], answer: 1, why: "Publishable keys are designed to be public." },
      { q: "Admin button hidden for non-admins. The ban API has no role check. Secure?", options: ["Yes", "No"], answer: 1, why: "Anyone can call the API directly." }
    ],
    rev: {
      sec30: "The frequent React security bugs: unsanitised `dangerouslySetInnerHTML`, user URLs in `href`, spreading untrusted objects into props, secrets in `VITE_`/source, tokens in `localStorage`, secrets in logs, client-only auth, client-sent prices, stale deps. Fixes: DOMPurify, URL allowlists, explicit props, server proxies, HttpOnly cookies, server authorisation, `npm audit`, CSP, lint rules.",
      interview: [
        { level: "basic", q: "Name three common React security mistakes.", a: "Rendering unsanitised HTML, putting secrets in client env vars, and relying on client-side checks for authorisation." },
        { level: "intermediate", q: "How would you review a PR for security?", a: "Search for `dangerouslySetInnerHTML`, `href={`, `innerHTML`, `localStorage`, `VITE_`, `eval`; check new deps; confirm the API enforces any new permissions." },
        { level: "advanced", q: "Why can prop spreading be a security issue?", a: "If the object is user- or API-controlled, it can add props you didn't intend, such as `dangerouslySetInnerHTML` or a `javascript:` `href`." },
        { level: "tricky", q: "The app is \"secure\" because it's all client-side with no server. True?", a: "Any API it calls is the server. Keys in the bundle are public, and every check in the browser can be bypassed." }
      ],
      debug: [
        { code: `function Note({ note }) {\n  return <div dangerouslySetInnerHTML={{ __html: note.html }} />;\n}`, fix: `function Note({ note }) {\n  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.html) }} />;\n}`, why: "User-written note HTML must be sanitised." },
        { code: `const isAdmin = localStorage.getItem('role') === 'admin';`, fix: `const { user } = useSession(); // from /api/me\nconst isAdmin = user?.role === 'admin'; // UI only`, why: "localStorage is user-editable; the server must still check." }
      ],
      cheat: [
        "Raw HTML → DOMPurify",
        "User URLs → protocol allowlist",
        "Never spread untrusted objects as props",
        "No secrets in `VITE_` or `src/`",
        "No long-lived tokens in localStorage; no secrets in logs",
        "Server authorises, validates, prices",
        "`npm audit` + CSP + `react/no-danger` lint"
      ]
    },
    related: ["SEC-001", "SEC-010", "SEC-011", "AUTH-015"]
  },
};
