export default {
  "API-016": {
    tldr: "A bearer token is a pass string the server gave you at login. You send it on every protected request in the header `Authorization: Bearer <token>`, and the server lets you in.",
    analogy: { icon: "🎟️", text: "A concert wristband. Whoever wears (bears) it gets in; the guard doesn't ask your name again. Lose it and anyone can use it, so keep it safe and short-lived." },
    visual: { type: "flow", title: "Token in, data out", steps: [
      { label: "Log in", detail: "`POST /api/login` with email + password." },
      { label: "Get a token", detail: "Server replies `{ accessToken: \"eyJ...\" }`." },
      { label: "Keep it", detail: "Store it in memory (state, context or a module variable)." },
      { label: "Attach header", detail: "Every call sends `Authorization: Bearer eyJ...`." },
      { label: "Server checks", detail: "Valid → `200` with contacts. Missing or expired → `401`." }
    ]},
    points: [
      "Format is exact: the word `Bearer`, **one space**, then the token. No quotes, no colon after Bearer.",
      "Bearer means **whoever holds it** is trusted. Treat it like a password: never log it or put it in the URL.",
      "Send it only to **your own API**, not to third-party URLs.",
      "Put the header in **one helper** (or an interceptor), not copy-pasted into every `fetch`.",
      "`401 Unauthorized` = token missing/expired/invalid. `403 Forbidden` = token fine, but no permission.",
      "Same as `[Authorize]` + `JwtBearer` in ASP.NET Core: the server reads this exact header."
    ],
    code: { file: "api.js", lang: "js", src: `let accessToken = null; // kept in memory, not localStorage

export function setToken(token) {
  accessToken = token;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) {
    headers.set('Authorization', \`Bearer \${accessToken}\`);
  }

  const res = await fetch(\`/api\${path}\`, { ...options, headers });
  if (res.status === 401) throw new Error('Please log in again');
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Usage after login:
// setToken(data.accessToken);
// const contacts = await apiFetch('/contacts');`, walk: [
      { lines: [1], note: "One place holds the token. Memory is safest against XSS but is lost on reload (refresh tokens fix that)." },
      { lines: [8, 9], note: "`new Headers()` merges any headers the caller already passed." },
      { lines: [10, 11, 12], note: "Attach `Bearer <token>` only when we have one. Note the single space." },
      { lines: [15, 16], note: "Handle `401` separately: it means log in again, not a generic error." },
      { lines: [21, 22], note: "Components just call `apiFetch('/contacts')`. No header code in components." }
    ]},
    mistakes: [
      { bad: `headers: { Authorization: token }`, good: `headers: { Authorization: \`Bearer \${token}\` }`, why: "Most servers reject a header without the `Bearer ` prefix and return `401`." },
      { bad: `fetch(\`/api/contacts?token=\${token}\`)`, good: `fetch('/api/contacts', {\n  headers: { Authorization: \`Bearer \${token}\` }\n})`, why: "URLs end up in browser history, server logs and analytics. Tokens belong in the header." }
    ],
    practice: [
      { level: "B", q: "Write the header for token `abc123`.", a: "`Authorization: Bearer abc123`" },
      { level: "B", q: "The API returns `403`. Is the token missing?", a: "No. `403` means the server knows who you are but you lack permission. Missing/expired is `401`." },
      { level: "I", q: "Make `apiFetch` skip the header for `/login`.", a: "Only set the header when a token exists, or pass an option like `{ auth: false }` and check it before `headers.set`." },
      { level: "C", q: "Why might you not want the token in React state?", a: "Every component that needs it would need the state passed down, and changing it re-renders. A module variable or context for the auth user, with the token in the API layer, is cleaner." }
    ],
    quiz: [
      { q: "Which header is correct?", options: ["`Authorization: Bearer abc`", "`Bearer: abc`", "`Authorization: \"Bearer: abc\"`", "`Token: Bearer abc`"], answer: 0, why: "The header name is `Authorization` and the value is `Bearer` + space + token." },
      { q: "What does \"bearer\" mean for security?", options: ["The token is tied to your device", "Anyone holding the token is trusted", "The token is encrypted so it's safe to share"], answer: 1, why: "Bearer tokens aren't bound to who sends them. If one leaks, the thief can use it until it expires." },
      { q: "A valid user hits an admin-only endpoint. Expected status?", options: ["401", "403", "404", "500"], answer: 1, why: "Authenticated but not allowed is `403 Forbidden`." }
    ],
    rev: {
      sec30: "After login the server issues an access token. The client sends it on every protected call as `Authorization: Bearer <token>`. Whoever holds it is trusted, so keep it out of URLs and logs, keep it short-lived, and attach it from one central helper or interceptor. `401` = bad/missing token, `403` = no permission.",
      interview: [
        { level: "basic", q: "How do you send a bearer token with fetch?", a: "Pass `headers: { Authorization: 'Bearer ' + token }` in the fetch options, ideally in one shared API helper." },
        { level: "intermediate", q: "401 vs 403?", a: "`401`: not authenticated (no token, expired, invalid), so re-login or refresh. `403`: authenticated but not allowed, so show an access-denied message." },
        { level: "intermediate", q: "Why not put the token in a query string?", a: "URLs are stored in history, proxies and server logs, so the token leaks. Headers aren't logged by default." },
        { level: "advanced", q: "Where should the SPA keep the access token?", a: "Ideally in memory with a short lifetime, paired with an httpOnly refresh cookie. localStorage survives reloads but is readable by any XSS script." },
        { level: "tricky", q: "Does HTTPS make bearer tokens safe?", a: "HTTPS stops sniffing in transit, but not theft from the page itself (XSS) or leaks through logs. Short expiry limits the damage." }
      ],
      debug: [
        { code: `fetch('/api/contacts', {\n  Authorization: \`Bearer \${token}\`\n});`, fix: `fetch('/api/contacts', {\n  headers: { Authorization: \`Bearer \${token}\` }\n});`, why: "Headers must go inside the `headers` option. A top-level `Authorization` key is ignored, so the server returns `401`." }
      ],
      cheat: [
        "`Authorization: Bearer <token>`: one space, no colon after Bearer",
        "Bearer = whoever holds it is trusted",
        "Never in URLs, logs or third-party requests",
        "Attach from one helper or interceptor",
        "`401` → token problem; `403` → permission problem",
        "Short-lived access token + refresh token = good default"
      ]
    },
    related: ["API-015", "API-017", "API-021", "AUTH-005"]
  },
  "API-017": {
    tldr: "A JWT (JSON Web Token) is three Base64URL parts: header, payload, signature. Anyone can **read** the payload; only the server can **verify** the signature. So the client may read it for display, never trust it for security.",
    analogy: { icon: "🎫", text: "A festival ticket with a hologram. Anyone can read the name and date printed on it, but only the gate scanner can check the hologram is real. Scribbling a new date on it doesn't fool the scanner." },
    visual: { type: "layers", title: "header.payload.signature", items: [
      { label: "Header", detail: "`{ \"alg\": \"HS256\", \"typ\": \"JWT\" }`: how it was signed." },
      { label: "Payload (claims)", detail: "`{ \"sub\": \"42\", \"name\": \"Ana\", \"role\": \"user\", \"exp\": 1767225600 }`. Readable by anyone." },
      { label: "Signature", detail: "Made from header + payload with the server's key. Proves nobody changed them." },
      { label: "Server verifies", detail: "Recomputes the signature and checks `exp`. Tampered or expired → `401`." }
    ]},
    points: [
      "Parts are separated by dots: `xxxxx.yyyyy.zzzzz`. Base64URL is **encoding, not encryption**.",
      "Common claims: `sub` (user id), `exp` (expiry, seconds since 1970), `iat` (issued at), plus custom ones like `role`.",
      "The client **cannot verify** the signature (it doesn't have the secret). Only the server can.",
      "OK on the client: show the name, guess when to refresh from `exp`, hide a menu item.",
      "Not OK: using `role` in the client as real security. A user can edit it; the **server** must check every request.",
      "Never put secrets (passwords, card numbers) in the payload."
    ],
    code: { file: "jwt.js", lang: "js", src: `// Read (NOT verify) a JWT payload in the browser
export function readJwt(token) {
  const payload = token.split('.')[1];
  // Base64URL -> Base64
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  return JSON.parse(json);
}

export function isExpired(token) {
  const { exp } = readJwt(token);
  return Date.now() >= exp * 1000; // exp is in seconds
}

// Usage: show the user's name in the header
// const { name } = readJwt(accessToken);  -> "Ana"`, walk: [
      { lines: [3], note: "Take the middle part: the payload." },
      { lines: [5], note: "JWTs use Base64URL (`-` and `_`). Convert back to plain Base64 for `atob`." },
      { lines: [6, 7, 8, 9, 10, 11], note: "Decode bytes as UTF-8 so names like \"José\" survive. Libraries like `jwt-decode` do this for you." },
      { lines: [15, 16, 17], note: "`exp` is in **seconds**; `Date.now()` is milliseconds. Multiply by 1000." },
      { lines: [20, 21], note: "Fine for display. Nothing here proves the token is genuine." }
    ]},
    output: "`readJwt(token)` → `{ sub: \"42\", name: \"Ana\", role: \"user\", exp: 1767225600 }`",
    mistakes: [
      { bad: `if (readJwt(token).role === 'admin') {\n  deleteAllContacts(); // trusts the client\n}`, good: `// client: just hides the button\n{isAdmin && <DeleteAllButton />}\n// server: checks role on DELETE /contacts`, why: "Anyone can craft a payload saying `admin`. Client checks are UX only; the server must enforce permissions." },
      { bad: `Date.now() >= exp`, good: `Date.now() >= exp * 1000`, why: "`exp` is seconds; comparing it to milliseconds makes every token look expired." }
    ],
    practice: [
      { level: "B", q: "How many dots does a JWT have?", a: "Two. They split header, payload and signature." },
      { level: "B", q: "Can you read a JWT payload without the secret key?", a: "Yes. It's only Base64URL encoded. Paste one into jwt.io to see." },
      { level: "I", q: "Show \"Session expires in X min\" from the token.", a: "`Math.round((exp * 1000 - Date.now()) / 60000)` minutes." },
      { level: "C", q: "A user changes `role` to `admin` in the payload and re-encodes it. What happens on the server?", a: "The signature no longer matches the changed header + payload, so verification fails and the server returns `401`." }
    ],
    quiz: [
      { q: "Is a JWT payload encrypted?", options: ["Yes, that's what the signature does", "No, it's Base64URL encoded and readable", "Only the `exp` claim is encrypted"], answer: 1, why: "Signing proves integrity, not secrecy. Anyone can decode the payload." },
      { q: "What may the client safely use a JWT payload for?", options: ["Deciding if a DELETE is allowed", "Displaying the user's name", "Verifying the token is genuine"], answer: 1, why: "Display and UX hints only. Verification and permission checks happen on the server." },
      { q: "What unit is `exp` in?", options: ["Milliseconds", "Seconds since 1970", "Minutes from now"], answer: 1, why: "JWT times are NumericDate: seconds since the Unix epoch." }
    ],
    rev: {
      sec30: "A JWT is `header.payload.signature`, each Base64URL. The payload holds claims like `sub`, `exp`, `role`, readable by anyone. The signature is made with the server's key and only the server can verify it. Clients may decode the payload for display or to schedule a refresh, but never treat it as proof of anything.",
      interview: [
        { level: "basic", q: "What are the three parts of a JWT?", a: "Header (algorithm), payload (claims) and signature, joined with dots and Base64URL encoded." },
        { level: "intermediate", q: "Is it safe to put the user's email in a JWT?", a: "It's readable by anyone with the token, so only include data you're happy to expose. Never secrets." },
        { level: "intermediate", q: "What should the client never trust in a JWT?", a: "Anything for security: roles, permissions, even that it's genuine. The client can't verify the signature; the server checks it on every request." },
        { level: "advanced", q: "Why can't a JWT be revoked easily?", a: "It's self-contained: the server accepts it until `exp` without a lookup. Hence short access-token lifetimes plus revocable refresh tokens, or a deny-list." },
        { level: "tricky", q: "jwt.io decoded my token without my secret. Is my app broken?", a: "No. Decoding needs no key. Only verifying the signature needs the key." }
      ],
      predict: [
        { code: `const t = 'aaa.eyJzdWIiOiI0MiJ9.zzz';\nconsole.log(JSON.parse(atob(t.split('.')[1])));`, answer: "`{ sub: \"42\" }`", why: "The middle part is just Base64 JSON; no key needed to read it." }
      ],
      cheat: [
        "`header.payload.signature`, Base64URL each",
        "Encoded, not encrypted: anyone can read it",
        "Only the server can verify the signature",
        "`exp`/`iat` are seconds: multiply by 1000 for JS dates",
        "Client: display + refresh timing only",
        "Server: enforce every permission",
        "No secrets in the payload"
      ]
    },
    related: ["API-016", "API-018", "AUTH-004", "SEC-008"]
  },
  "API-018": {
    tldr: "Access tokens expire fast (minutes). A long-lived refresh token lets the app quietly get a new access token when the old one dies, so the user stays logged in without retyping a password.",
    analogy: { icon: "🏊", text: "A day pass at the pool plus a membership card. The day pass gets you in today; when it runs out, you show the membership card at the desk and get a fresh day pass. Lose the card and you sign up again." },
    visual: { type: "flow", title: "Silent refresh", steps: [
      { label: "Call with old token", detail: "`GET /api/contacts` with an expired access token." },
      { label: "401", detail: "Server says the access token expired." },
      { label: "POST /auth/refresh", detail: "Browser sends the httpOnly refresh cookie automatically." },
      { label: "New access token", detail: "Server rotates: new access token, new refresh cookie, old one invalidated." },
      { label: "Retry once", detail: "Repeat the original request with the new token. User notices nothing." }
    ]},
    points: [
      "**Access token**: short (5-15 min), sent on every call. **Refresh token**: long (days), used only at `/auth/refresh`.",
      "Best storage for refresh tokens: an **httpOnly, Secure, SameSite** cookie. JavaScript can't read it, so XSS can't steal it.",
      "**Rotation**: each refresh returns a new refresh token and kills the old one; reuse of an old one signals theft.",
      "If 3 requests fail at once, run **one** refresh and let the others wait for it (share the promise).",
      "Retry the original request **once**. If refresh itself fails, log the user out.",
      "Use `credentials: 'include'` (fetch) or `withCredentials: true` (axios) so the cookie is sent."
    ],
    code: { file: "api.js", lang: "js", src: `let accessToken = null;
let refreshing = null; // shared promise while a refresh runs

async function refresh() {
  const res = await fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include', // sends the httpOnly cookie
  });
  if (!res.ok) throw new Error('Session ended');
  accessToken = (await res.json()).accessToken;
}

function send(path, options) {
  return fetch(\`/api\${path}\`, {
    ...options,
    headers: { ...options.headers, Authorization: \`Bearer \${accessToken}\` },
  });
}

export async function apiFetch(path, options = {}) {
  let res = await send(path, options);
  if (res.status !== 401) return res;

  refreshing ??= refresh().finally(() => { refreshing = null; });
  try {
    await refreshing;
  } catch {
    window.location.assign('/login'); // refresh failed: log out
    throw new Error('Logged out');
  }
  return send(path, options); // retry once
}`, walk: [
      { lines: [2], note: "One shared promise so parallel `401`s trigger a **single** refresh." },
      { lines: [5, 6, 7, 8], note: "The refresh token lives in an httpOnly cookie; `credentials: 'include'` sends it." },
      { lines: [21, 22], note: "Not a `401`? Return the response as-is." },
      { lines: [24], note: "`??=` starts a refresh only if none is running; later callers reuse it." },
      { lines: [25, 26, 27, 28, 29, 30], note: "Refresh failed (expired/revoked): send the user to log in." },
      { lines: [31], note: "Retry the original request exactly once with the new token." }
    ]},
    mistakes: [
      { bad: `if (res.status === 401) {\n  await refresh();\n  return apiFetch(path, options); // loops forever\n}`, good: `await refresh();\nreturn send(path, options); // retry once, no recursion`, why: "If the new token is also rejected, recursion refreshes forever. Retry exactly once." },
      { bad: `localStorage.setItem('refreshToken', rt);`, good: `// server sets it:\n// Set-Cookie: rt=...; HttpOnly; Secure; SameSite=Strict`, why: "A refresh token in localStorage can be stolen by any XSS script and used for days." }
    ],
    practice: [
      { level: "B", q: "Why have two tokens instead of one long-lived access token?", a: "A leaked access token only works for minutes. The refresh token is sent rarely, to one endpoint, from a cookie JS can't read." },
      { level: "I", q: "Three requests get `401` at the same moment. How many refresh calls should happen?", a: "One. Store the refresh promise and have every caller `await` the same one." },
      { level: "I", q: "What should happen when `/auth/refresh` returns `401`?", a: "The session is over: clear in-memory state and caches, then redirect to the login page." },
      { level: "C", q: "Refresh before expiry instead of after the `401`.", a: "Read `exp` from the access token and set a timer for ~30s earlier, or check `isExpired()` before each call. Keep the 401 fallback anyway." }
    ],
    quiz: [
      { q: "Where should a refresh token live in a SPA?", options: ["localStorage", "An httpOnly Secure cookie", "A React state variable", "The URL"], answer: 1, why: "httpOnly cookies are unreadable by JavaScript, so XSS can't steal them." },
      { q: "What is refresh token rotation?", options: ["Using the same refresh token forever", "Each refresh issues a new refresh token and invalidates the old one", "Switching between two access tokens"], answer: 1, why: "Rotation makes a stolen refresh token single-use and lets the server detect reuse." },
      { q: "Why share one refresh promise?", options: ["To avoid several parallel refresh calls racing", "Promises are faster than fetch", "React requires it"], answer: 0, why: "With rotation, parallel refreshes can invalidate each other and log the user out." }
    ],
    rev: {
      sec30: "Short-lived access tokens limit damage; a long-lived refresh token (httpOnly cookie) renews them. On `401`, call `/auth/refresh` once (shared promise for parallel calls), store the new access token, retry the original request once. If refresh fails, log out. Rotate refresh tokens on every use.",
      interview: [
        { level: "basic", q: "What problem do refresh tokens solve?", a: "They let access tokens be short-lived for security while users stay logged in, by silently getting new ones." },
        { level: "intermediate", q: "Walk through a silent refresh.", a: "Request gets `401`, the client posts to `/auth/refresh` with the cookie, gets a new access token, retries the original request once. Refresh failure means logout." },
        { level: "advanced", q: "How do you stop several refreshes when many calls fail together?", a: "Keep a module-level promise for the in-flight refresh. The first `401` creates it; the rest `await` it, then all retry." },
        { level: "advanced", q: "What is reuse detection?", a: "With rotation, an old refresh token should never come back. If it does, it was stolen, so the server revokes the whole token family." },
        { level: "tricky", q: "Is an httpOnly cookie immune to every attack?", a: "No. XSS can't read it, but the browser still sends it, so you need CSRF defences: `SameSite`, CSRF tokens, or a custom header check." }
      ],
      scenario: [
        { q: "Users get logged out randomly when opening the app in two tabs.", a: "Both tabs refresh at once with rotation; the second uses an already-rotated token. Coordinate tabs (BroadcastChannel/lock) or allow a short grace window on the server." }
      ],
      cheat: [
        "Access: minutes, every request. Refresh: days, only `/auth/refresh`",
        "Refresh token in httpOnly + Secure + SameSite cookie",
        "On `401`: refresh once, retry once",
        "Share one in-flight refresh promise",
        "Refresh fails → clear state, go to login",
        "Rotate refresh tokens; reused old one = theft",
        "`credentials: 'include'` / `withCredentials: true`"
      ]
    },
    related: ["API-022", "AUTH-010", "AUTH-005", "API-017"]
  },
  "API-019": {
    tldr: "The API's address changes per environment: localhost in dev, a staging URL, the real one in production. Put it in a Vite env variable (`VITE_API_URL`) so the same code calls the right server everywhere.",
    analogy: { icon: "🍕", text: "One pizza order form, different shop addresses. You test against the shop round the corner, then send real orders to the main branch. The form stays the same; only the address on top changes." },
    visual: { type: "tree", title: "One codebase, three API addresses", root: { label: "apiClient.js", note: "reads import.meta.env.VITE_API_URL", children: [
      { label: ".env.development", note: "npm run dev", children: [{ label: "http://localhost:5000" }] },
      { label: ".env.staging", note: "vite build --mode staging", children: [{ label: "https://staging.shop.com" }] },
      { label: ".env.production", note: "npm run build", children: [{ label: "https://api.shop.com" }] }
    ]}},
    points: [
      "Only variables prefixed **`VITE_`** reach browser code, via `import.meta.env.VITE_API_URL`.",
      "Values are **baked in at build time**. Changing `.env` after `npm run build` changes nothing until you rebuild.",
      "**Everything in `VITE_*` is public**: anyone can read it in the JS bundle. Never put API secrets there.",
      "Read the URL in **one file** (an API client), not scattered across components.",
      "In dev, a Vite `server.proxy` can forward `/api` to the backend and also avoid CORS.",
      "Commit `.env.example`; keep `.env.local` (personal overrides) out of git."
    ],
    code: { file: "apiClient.js", lang: "js", src: `// .env.development
//   VITE_API_URL=http://localhost:5000
// .env.production
//   VITE_API_URL=https://api.shop.com

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error('VITE_API_URL is not set. Check your .env file.');
}

export async function api(path, options) {
  const res = await fetch(\`\${BASE_URL}\${path}\`, options);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// Anywhere in the app:
// const products = await api('/products');

console.log(import.meta.env.MODE); // "development" or "production"`, walk: [
      { lines: [1, 2, 3, 4], note: "One value per environment file. Vite picks the file from the mode." },
      { lines: [6], note: "Read once. Vite replaces this with the literal string at build time." },
      { lines: [8, 9, 10], note: "Fail loudly if it's missing instead of calling `undefined/products`." },
      { lines: [13], note: "All requests share the base URL: change environments without touching components." },
      { lines: [21], note: "`MODE`, `DEV`, `PROD` are built-in; no prefix needed." }
    ]},
    output: "`npm run dev` calls `http://localhost:5000/products`; the production build calls `https://api.shop.com/products`.",
    mistakes: [
      { bad: `API_URL=http://localhost:5000\n// import.meta.env.API_URL -> undefined`, good: `VITE_API_URL=http://localhost:5000\n// import.meta.env.VITE_API_URL -> "http://localhost:5000"`, why: "Vite only exposes variables that start with `VITE_`." },
      { bad: `VITE_PAYMENT_SECRET=sk_live_123`, good: `// keep secrets on the server;\n// the browser calls your API, the API uses the secret`, why: "`VITE_*` values are pasted into the public bundle. Anyone can open DevTools and read them." }
    ],
    practice: [
      { level: "B", q: "Read `VITE_API_URL` in a component.", a: "`import.meta.env.VITE_API_URL` (not `process.env`)." },
      { level: "B", q: "You changed `.env.production` on the server but the site still calls the old URL. Why?", a: "Values are baked in during `vite build`. Rebuild and redeploy." },
      { level: "I", q: "Add a staging build.", a: "Create `.env.staging` and run `vite build --mode staging`." },
      { level: "C", q: "Proxy `/api` to `localhost:5000` in dev.", a: "Add `server.proxy` in `vite.config.js`; then use relative `/api/...` URLs.", code: `// vite.config.js\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: { '/api': 'http://localhost:5000' },\n  },\n});` }
    ],
    quiz: [
      { q: "How do you read an env var in Vite app code?", options: ["`process.env.VITE_API_URL`", "`import.meta.env.VITE_API_URL`", "`window.env.API_URL`"], answer: 1, why: "Vite exposes variables on `import.meta.env`; `process.env` is a Node/CRA habit." },
      { q: "Is `VITE_API_KEY` hidden from users?", options: ["Yes, env vars are private", "No, it's embedded in the JS bundle", "Only in production"], answer: 1, why: "Anything the browser can use, the user can read." },
      { q: "When are `VITE_*` values applied?", options: ["Every page load", "At build time", "When the server restarts"], answer: 1, why: "Vite statically replaces them while building." }
    ],
    rev: {
      sec30: "Keep the API base URL in `VITE_API_URL` inside `.env.development` / `.env.production` and read it once in an API client via `import.meta.env`. Only `VITE_` variables reach the browser, they're replaced at build time, and they are public, so never store secrets there.",
      interview: [
        { level: "basic", q: "How do you configure different API URLs for dev and prod in Vite?", a: "Put `VITE_API_URL` in `.env.development` and `.env.production` and read `import.meta.env.VITE_API_URL` in the API client." },
        { level: "intermediate", q: "Why the `VITE_` prefix?", a: "It's an allow-list so server-only variables in the same `.env` don't leak into the browser bundle by accident." },
        { level: "intermediate", q: "Can I put an API key in a `VITE_` variable?", a: "Only if it's meant to be public (like a maps key restricted by domain). Real secrets stay on a server." },
        { level: "advanced", q: "How do you change the API URL without rebuilding?", a: "Load runtime config: serve a `/config.json` (or inject `window.__CONFIG__`) per environment and fetch it before rendering." },
        { level: "tricky", q: "Why does `import.meta.env.VITE_API_URL` work but `import.meta.env[key]` with a dynamic key may not?", a: "Vite replaces static references at build time. Dynamic lookups can't be replaced reliably." }
      ],
      compare: { cols: ["", "Build-time env", "Runtime config"], rows: [
        ["Where", "`.env.*` → bundle", "`/config.json` loaded at start"],
        ["Change URL", "Rebuild", "Edit file, reload"],
        ["Complexity", "Simple", "Extra fetch before render"]
      ]},
      cheat: [
        "`VITE_API_URL` in `.env.development` / `.env.production`",
        "Read with `import.meta.env.VITE_API_URL`",
        "Only `VITE_*` reach the browser",
        "Replaced at build time: rebuild after changes",
        "Everything in the bundle is public: no secrets",
        "`--mode staging` loads `.env.staging`",
        "Dev `server.proxy` forwards `/api` and avoids CORS"
      ]
    },
    related: ["ENV-011", "SEC-010", "PROD-002", "API-020"]
  },
  "API-020": {
    tldr: "CORS (Cross-Origin Resource Sharing) is the browser asking the server: \"may this other website read your reply?\" The **server** answers with `Access-Control-Allow-*` headers. You fix CORS on the server, not in React.",
    analogy: { icon: "🏨", text: "A hotel receptionist calls your room before letting a visitor up: \"Ana from shop.com is here, allow her?\" Your room (the server) says yes or no. The visitor can't vouch for herself." },
    visual: { type: "flow", title: "Preflight, then the real request", steps: [
      { label: "Cross-origin call", detail: "`shop.com` calls `api.shop.com` with `PUT` + JSON + `Authorization` header." },
      { label: "Preflight OPTIONS", detail: "Browser first sends `OPTIONS` with `Origin` and `Access-Control-Request-Method: PUT`." },
      { label: "Server allows", detail: "Replies `Access-Control-Allow-Origin: https://shop.com`, allowed methods and headers." },
      { label: "Real request", detail: "Browser now sends the `PUT`. Response also carries `Allow-Origin`." },
      { label: "JS reads it", detail: "Headers match → your code gets the data. No match → \"blocked by CORS policy\"." }
    ]},
    points: [
      "Origin = **scheme + host + port**. `localhost:5173` → `localhost:5000` is cross-origin (different port).",
      "CORS is enforced **by the browser only**. Postman and curl ignore it, which is why \"it works in Postman\".",
      "**Preflight** (`OPTIONS`) happens for non-simple requests: `PUT`/`PATCH`/`DELETE`, JSON `Content-Type`, `Authorization` header.",
      "Fix at the **server**: allow your exact origin, methods and headers. Adding headers to the React request does nothing.",
      "Cookies across origins need `credentials: 'include'` **and** the server's `Allow-Credentials: true` with a specific origin (not `*`).",
      "In dev, Vite's `server.proxy` makes the call same-origin, so CORS never applies."
    ],
    code: { file: "server.js", lang: "js", src: `// Node + Express API (npm i express cors)
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://shop.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies
}));
app.use(express.json());

app.get('/api/contacts', (req, res) => {
  res.json([{ id: 1, name: 'Ana' }]);
});

app.listen(5000);

// ASP.NET Core equivalent:
// builder.Services.AddCors(o => o.AddPolicy("spa", p => p
//   .WithOrigins("http://localhost:5173").AllowAnyHeader()
//   .AllowAnyMethod().AllowCredentials()));
// app.UseCors("spa");`, walk: [
      { lines: [7, 8], note: "List exact origins. The Vite dev server is `http://localhost:5173`." },
      { lines: [9, 10], note: "Allowed methods and headers answer the preflight's questions." },
      { lines: [11], note: "Needed for cookies; then `origin` must be specific, never `*`." },
      { lines: [21, 22, 23, 24, 25], note: "Same fix in .NET: a CORS policy plus `UseCors`." }
    ]},
    output: "Console before the fix: \"Access to fetch at 'http://localhost:5000/api/contacts' from origin 'http://localhost:5173' has been blocked by CORS policy\".",
    mistakes: [
      { bad: `fetch(url, {\n  headers: { 'Access-Control-Allow-Origin': '*' }\n});`, good: `// server response must include\n// Access-Control-Allow-Origin: http://localhost:5173`, why: "`Allow-*` are **response** headers from the server. Sending them in the request does nothing useful and adds an extra preflight." },
      { bad: `fetch(url, { mode: 'no-cors' })`, good: `// enable CORS on the API, or use a dev proxy`, why: "`no-cors` gives an opaque response: no error, but you can't read the body. The data is still blocked." }
    ],
    practice: [
      { level: "B", q: "Is `http://localhost:5173` → `http://localhost:5000` cross-origin?", a: "Yes. Different port means different origin." },
      { level: "B", q: "It works in Postman but fails in the browser. Why?", a: "Postman isn't a browser and doesn't enforce CORS. The server is missing CORS headers." },
      { level: "I", q: "Which of these triggers a preflight: `GET` with no custom headers, or `POST` with `Content-Type: application/json`?", a: "The JSON `POST`. JSON content type is not a \"simple\" type." },
      { level: "C", q: "Avoid CORS completely in dev.", a: "Use Vite's proxy: `server: { proxy: { '/api': 'http://localhost:5000' } }` and call `/api/...` with relative URLs." }
    ],
    quiz: [
      { q: "Who enforces CORS?", options: ["The server", "The browser", "React", "The database"], answer: 1, why: "The server only sends headers; the browser decides whether your JS may read the response." },
      { q: "Where do you fix a CORS error?", options: ["Add headers in the `fetch` call", "Configure the server's CORS policy", "Use `mode: 'no-cors'`"], answer: 1, why: "Only the server can grant permission to its responses." },
      { q: "What is a preflight request?", options: ["An `OPTIONS` request asking permission before the real one", "A cached copy of the response", "A retry after a failure"], answer: 0, why: "The browser checks method and headers are allowed before sending a non-simple request." }
    ],
    rev: {
      sec30: "CORS lets a server tell the browser which other origins may read its responses. For non-simple requests (JSON body, `Authorization`, `PUT`/`DELETE`) the browser sends an `OPTIONS` preflight first. Fix errors on the server with `Access-Control-Allow-Origin/Methods/Headers` (and `Allow-Credentials` for cookies), or avoid them in dev with a Vite proxy.",
      interview: [
        { level: "basic", q: "What is CORS?", a: "A browser security rule: JS on one origin can only read responses from another origin if that server sends `Access-Control-Allow-Origin` allowing it." },
        { level: "intermediate", q: "When does the browser send a preflight?", a: "For non-simple requests: methods other than GET/HEAD/POST, custom headers like `Authorization`, or a content type like `application/json`." },
        { level: "intermediate", q: "Why does it work in Postman but not in the browser?", a: "CORS is a browser rule. Postman and curl don't apply it, so the server's missing headers only matter in a browser." },
        { level: "advanced", q: "Why can't you use `Allow-Origin: *` with cookies?", a: "Browsers reject credentialed responses with a wildcard. You must echo a specific allowed origin and send `Allow-Credentials: true`." },
        { level: "tricky", q: "Does CORS protect your API from attackers?", a: "No. It protects users' browsers from other sites reading responses. Scripts and servers can still call your API, so you still need auth." }
      ],
      cheat: [
        "Origin = scheme + host + port",
        "Browser enforces; server grants with `Access-Control-Allow-*`",
        "Preflight = `OPTIONS` for PUT/PATCH/DELETE, JSON, `Authorization`",
        "Fix on the server, never with request headers",
        "Cookies: `credentials: 'include'` + `Allow-Credentials` + exact origin",
        "`no-cors` hides the data; it is not a fix",
        "Dev: Vite `server.proxy` sidesteps CORS"
      ]
    },
    related: ["API-019", "API-015", "WEB-001", "PROD-008"]
  },
  "API-021": {
    tldr: "A request interceptor is a function axios runs **before every request** leaves. Use it to add the token, a language header or a request ID in one place instead of in every call.",
    analogy: { icon: "📮", text: "The post office counter. Every letter you drop off gets a stamp and a postmark automatically. You just write the letter; the counter adds the same extras to all of them." },
    visual: { type: "flow", title: "Every request passes the interceptor", steps: [
      { label: "Component calls", detail: "`api.get('/contacts')`: no headers written here." },
      { label: "Interceptor runs", detail: "Gets the request `config`. Adds `Authorization`, `Accept-Language`." },
      { label: "Return config", detail: "Must `return config` (or a promise of it), or the request never goes." },
      { label: "Request sent", detail: "Goes out with all the shared headers attached." }
    ]},
    points: [
      "Register on an **instance**: `api.interceptors.request.use(fn)`. Every call through `api` passes through `fn`.",
      "`fn(config)` must **return the config**. It can be `async` (e.g. read a fresh token).",
      "Read the token **inside** the interceptor, so each request gets the current one, not the one from startup.",
      "Several request interceptors run in **reverse order** of registration (last added runs first).",
      "`use` returns an id; `api.interceptors.request.eject(id)` removes it (handy in tests or effect cleanup).",
      "With plain `fetch` there are no interceptors: write a wrapper function (`apiFetch`) instead."
    ],
    code: { file: "api.js", lang: "js", src: `import axios from 'axios';
import { getToken } from './auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken(); // read fresh on every request
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  config.headers['Accept-Language'] = navigator.language;
  config.headers['X-Request-Id'] = crypto.randomUUID();
  return config; // never forget this
});

// ContactList.jsx
// const { data } = await api.get('/contacts');
// -> sent with Authorization, Accept-Language, X-Request-Id`, walk: [
      { lines: [4, 5, 6, 7], note: "One shared instance with the base URL. Interceptors attach to it." },
      { lines: [9, 10], note: "Runs before each request. Getting the token here means it's always current." },
      { lines: [11, 12, 13], note: "Add the bearer header only when logged in." },
      { lines: [14, 15], note: "Any other global headers: language for translated errors, an ID to trace logs." },
      { lines: [16], note: "Return the (changed) config so axios can send it." }
    ]},
    mistakes: [
      { bad: `api.interceptors.request.use((config) => {\n  config.headers.Authorization = \`Bearer \${token}\`;\n});`, good: `api.interceptors.request.use((config) => {\n  config.headers.Authorization = \`Bearer \${token}\`;\n  return config;\n});`, why: "Without `return config`, axios gets `undefined` and the request fails." },
      { bad: `const token = getToken(); // read once at startup\napi.interceptors.request.use((c) => {\n  c.headers.Authorization = \`Bearer \${token}\`;\n  return c;\n});`, good: `api.interceptors.request.use((c) => {\n  c.headers.Authorization = \`Bearer \${getToken()}\`;\n  return c;\n});`, why: "The outer `token` is frozen at startup. After login or refresh, requests keep sending the old one." }
    ],
    practice: [
      { level: "B", q: "Add `X-App-Version: 1.4.0` to every request.", a: "Inside the interceptor: `config.headers['X-App-Version'] = '1.4.0'; return config;`" },
      { level: "I", q: "Skip the token for `/auth/login`.", a: "Check `config.url`: `if (!config.url.startsWith('/auth')) config.headers.Authorization = ...`." },
      { level: "I", q: "Log every request's method and URL in dev only.", a: "`if (import.meta.env.DEV) console.log(config.method, config.url);` then `return config`." },
      { level: "C", q: "Remove an interceptor when a component unmounts.", a: "Save the id and eject in the cleanup.", code: `useEffect(() => {\n  const id = api.interceptors.request.use(addHeader);\n  return () => api.interceptors.request.eject(id);\n}, []);` }
    ],
    quiz: [
      { q: "What must a request interceptor return?", options: ["Nothing", "The config (or a promise of it)", "The response", "`true` to continue"], answer: 1, why: "Axios sends whatever config the interceptor returns." },
      { q: "Two request interceptors A then B are registered. Which runs first?", options: ["A", "B", "Both at the same time"], answer: 1, why: "Axios runs request interceptors in reverse registration order (response ones run in order)." },
      { q: "Why read the token inside the interceptor?", options: ["It's faster", "So each request uses the current token after login/refresh", "Axios requires it"], answer: 1, why: "A value read once outside goes stale." }
    ],
    rev: {
      sec30: "Request interceptors run before every request on an axios instance. They receive the config, can add headers (token, language, request ID) or change the URL, and must return the config. Read the token inside so it's always current. Request interceptors run last-added-first; `eject(id)` removes one. With fetch, use a wrapper function instead.",
      interview: [
        { level: "basic", q: "What is a request interceptor for?", a: "Cross-cutting logic for every outgoing request: auth headers, common headers, logging, without repeating code in components." },
        { level: "intermediate", q: "Why put interceptors on an instance instead of the global `axios`?", a: "So they only affect calls to your API, not third-party requests that shouldn't get your token." },
        { level: "intermediate", q: "How would you do this with fetch?", a: "Wrap fetch in your own `apiFetch(path, options)` that merges headers, then call it everywhere." },
        { level: "advanced", q: "Can an interceptor be async?", a: "Yes. Return a promise of the config, e.g. `await` a token refresh first. Axios waits before sending." },
        { level: "tricky", q: "In what order do multiple request interceptors run?", a: "Reverse order of registration. Response interceptors run in registration order." }
      ],
      cheat: [
        "`api.interceptors.request.use(config => { ...; return config })`",
        "Always return the config",
        "Read token inside, not once at startup",
        "Attach to an instance, not global axios",
        "Request interceptors: last registered runs first",
        "`eject(id)` removes one",
        "fetch has no interceptors: write a wrapper"
      ]
    },
    related: ["API-007", "API-016", "API-022", "AUTH-010"]
  },
  "API-022": {
    tldr: "A response interceptor runs on **every reply** before your component sees it. Use it to handle `401` (refresh or log out) and turn messy errors into one clean shape, all in one place.",
    analogy: { icon: "📬", text: "An office mailroom. Every parcel passes through it first: normal parcels go straight up, damaged ones get a standard note attached, and letters saying \"your access card expired\" trigger a new card." },
    visual: { type: "flow", title: "What happens to each response", steps: [
      { label: "Response arrives", detail: "Axios gets a reply (or a network failure)." },
      { label: "2xx → success fn", detail: "Pass it through, or unwrap `response.data`." },
      { label: "401 → refresh", detail: "Get a new token once, retry the original request with `api(config)`." },
      { label: "Other errors", detail: "Map to `{ status, message }`; reject so the caller can show it." },
      { label: "Component", detail: "Just uses `try/catch` with one predictable error shape." }
    ]},
    points: [
      "`api.interceptors.response.use(onSuccess, onError)`: `onSuccess` gets 2xx responses, `onError` gets everything else.",
      "In `onError`, **re-throw** (`return Promise.reject(err)`) unless you recovered. Swallowing errors hides failures.",
      "For `401`: mark the request (`config._retry = true`) so you refresh and retry **only once**.",
      "`error.response` missing = network/timeout error (no reply). Check before reading `.status`.",
      "Normalise errors once: components get `{ status, message }` instead of axios internals.",
      "Global UI (toasts, redirect to `/login`) goes here; field validation errors (`422`) stay with the form."
    ],
    code: { file: "api.js", lang: "js", src: `import axios from 'axios';
import { refreshToken, logout } from './auth';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        await refreshToken(); // stores the new access token
        return api(original); // retry once
      } catch {
        logout(); // clear state, go to /login
      }
    }

    return Promise.reject({
      status: status ?? 0, // 0 = network error / timeout
      message: error.response?.data?.message ?? error.message,
    });
  }
);`, walk: [
      { lines: [7], note: "Success: pass the response through untouched." },
      { lines: [9, 10], note: "`error.config` is the original request. `response` is missing on network errors, hence `?.`." },
      { lines: [12, 13], note: "`_retry` flag: never refresh twice for the same request (no infinite loop)." },
      { lines: [15, 16], note: "Get a new token, then replay the request through the same instance (request interceptor adds the new token)." },
      { lines: [17, 18], note: "Refresh failed: the session is over." },
      { lines: [22, 23, 24, 25], note: "Reject with one clean shape every component can rely on." }
    ]},
    mistakes: [
      { bad: `api.interceptors.response.use(null, (err) => {\n  toast(err.message);\n  // nothing returned\n});`, good: `api.interceptors.response.use(null, (err) => {\n  toast(err.message);\n  return Promise.reject(err);\n});`, why: "Returning nothing **resolves** the promise with `undefined`. The caller thinks it succeeded and crashes on `data`." },
      { bad: `if (error.response.status === 401) {`, good: `if (error.response?.status === 401) {`, why: "On a network error or timeout there is no `response`, so `.status` throws inside your error handler." }
    ],
    practice: [
      { level: "B", q: "Show a toast for every `500` and still let the caller handle it.", a: "In `onError`: `if (status >= 500) toast('Server error');` then `return Promise.reject(error)`." },
      { level: "I", q: "Unwrap `response.data` globally so callers get data directly.", a: "`api.interceptors.response.use(res => res.data, onError)`. Then `const contacts = await api.get('/contacts')`." },
      { level: "I", q: "How do you tell a timeout from a 404?", a: "Timeout: `error.response` is undefined (`error.code === 'ECONNABORTED'`). 404: `error.response.status === 404`." },
      { level: "C", q: "Several calls fail with 401 together. How do you avoid several refreshes?", a: "Keep one shared refresh promise; every failed request awaits it, then retries (same idea as API-018)." }
    ],
    quiz: [
      { q: "Your `onError` shows a toast but returns nothing. What does `await api.get()` give the caller?", options: ["It throws the error", "It resolves with `undefined`", "It retries automatically"], answer: 1, why: "Returning a value from a rejection handler turns it into a success." },
      { q: "Why set `original._retry = true`?", options: ["Axios needs it to retry", "To stop refresh-and-retry looping forever", "To cache the response"], answer: 1, why: "If the retried request also returns 401, the flag stops a second refresh." },
      { q: "`error.response` is `undefined`. What happened?", options: ["The server returned 404", "No reply arrived: network error, CORS block or timeout", "The JSON was invalid"], answer: 1, why: "Axios only sets `response` when the server actually answered." }
    ],
    rev: {
      sec30: "Response interceptors see every reply. Success handler passes or unwraps data; error handler deals with global cases: on `401` refresh once (guarded by a `_retry` flag) and replay with `api(config)`, log out if refresh fails, and reject everything else with a normalised `{ status, message }`. Always re-reject; check `error.response?` for network errors.",
      interview: [
        { level: "basic", q: "What would you put in a response interceptor?", a: "Global handling: 401 refresh/logout, error normalisation, generic server-error toasts, maybe unwrapping `data`." },
        { level: "intermediate", q: "How do you retry the original request after a refresh?", a: "Use `error.config` and call `api(error.config)`; the request interceptor attaches the new token." },
        { level: "intermediate", q: "Why must the error handler return `Promise.reject`?", a: "Otherwise the error is swallowed and the caller's `await` resolves with whatever you returned, usually `undefined`." },
        { level: "advanced", q: "What shouldn't go in a global interceptor?", a: "Screen-specific logic like form validation errors or a custom 404 page for one resource. Let callers handle those." },
        { level: "tricky", q: "The refresh endpoint itself returns 401. What prevents a loop?", a: "The `_retry` flag, and excluding the refresh URL from the 401 handling (or using a separate axios instance for refresh)." }
      ],
      debug: [
        { code: `async (error) => {\n  if (error.response.status === 401) {\n    await refreshToken();\n    return api(error.config);\n  }\n}`, fix: `async (error) => {\n  const cfg = error.config;\n  if (error.response?.status === 401 && !cfg._retry) {\n    cfg._retry = true;\n    await refreshToken();\n    return api(cfg);\n  }\n  return Promise.reject(error);\n}`, why: "Three bugs: crashes on network errors, can loop forever, and swallows every non-401 error." }
      ],
      cheat: [
        "`api.interceptors.response.use(onSuccess, onError)`",
        "Always `return Promise.reject(err)` if not recovered",
        "`error.response?.status`: no response = network/timeout",
        "401 → refresh once (`_retry`), retry with `api(error.config)`",
        "Refresh fails → logout",
        "Normalise to `{ status, message }`",
        "Form/field errors stay with the caller"
      ]
    },
    related: ["API-021", "API-018", "API-014", "AUTH-010"]
  },
  "API-023": {
    tldr: "`AbortController` lets you **cancel** a fetch you no longer need: when the component unmounts or the user types a new search. Pass its `signal` to fetch and call `abort()` in the effect cleanup.",
    analogy: { icon: "🍔", text: "Changing your drive-through order. You asked for a burger, then shout \"cancel that, make it a wrap\". The kitchen stops the burger, so you never get handed the wrong meal." },
    visual: { type: "timeline", title: "Typing \"pizza\" with cancellation", frames: [
      { label: "type \"pi\"", state: "request A (q=pi) sent", note: "Effect runs, creates controller A." },
      { label: "type \"piz\"", state: "A aborted, B (q=piz) sent", note: "Cleanup calls `controllerA.abort()` before the new effect." },
      { label: "type \"pizza\"", state: "B aborted, C (q=pizza) sent", note: "Only the latest request is still alive." },
      { label: "C returns", state: "results = pizza recipes", note: "No stale results flash on screen." },
      { label: "leave page", state: "C aborted (if still running)", note: "No setState on an unmounted component." }
    ]},
    points: [
      "`const controller = new AbortController()` → pass `controller.signal` to `fetch(url, { signal })`.",
      "`controller.abort()` makes that fetch reject with an **`AbortError`**. Ignore it; it's not a real error.",
      "Create a **new controller per effect run** and abort it in the **cleanup**: runs on unmount and before the next run.",
      "In dev, Strict Mode mounts → cleans up → mounts again, so you'll see one cancelled request in the Network tab. That's expected.",
      "Axios accepts the same `signal`; check `axios.isCancel(err)` to ignore it.",
      "One controller can cancel several fetches at once; once aborted, it can't be reused."
    ],
    code: { file: "RecipeSearch.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

export default function RecipeSearch() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();

    fetch(\`/api/recipes?q=\${encodeURIComponent(query)}\`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setRecipes)
      .catch((err) => {
        if (err.name === 'AbortError') return; // we cancelled it
        console.error(err);
      });

    return () => controller.abort(); // new query or unmount
  }, [query]);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {recipes.map((r) => <li key={r.id}>{r.title}</li>)}
      </ul>
    </>
  );
}`, walk: [
      { lines: [9], note: "A fresh controller for this run of the effect (this query)." },
      { lines: [11, 12, 13], note: "Hand the `signal` to fetch so the controller can stop it." },
      { lines: [16, 17], note: "Aborting rejects with `AbortError`. Skip it silently." },
      { lines: [21], note: "Cleanup: React calls this before the next query's effect and on unmount." },
      { lines: [22], note: "Every `query` change cancels the previous request, then starts a new one." }
    ]},
    output: "Network tab while typing \"pizza\": earlier requests show as **(canceled)**; only `q=pizza` completes and its recipes render.",
    mistakes: [
      { bad: `const controller = new AbortController(); // once, outside the component\nuseEffect(() => {\n  fetch(url, { signal: controller.signal });\n  return () => controller.abort();\n}, [query]);`, good: `useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n  return () => controller.abort();\n}, [query]);`, why: "After the first abort the shared signal stays aborted, so every later fetch fails at once. Create one controller per effect run." },
      { bad: `.catch((err) => setError(err.message))`, good: `.catch((err) => {\n  if (err.name !== 'AbortError') setError(err.message);\n})`, why: "Otherwise every cancelled request shows \"The user aborted a request\" as an error." }
    ],
    practice: [
      { level: "B", q: "Cancel a fetch after 5 seconds.", a: "Use `AbortSignal.timeout(5000)`: `fetch(url, { signal: AbortSignal.timeout(5000) })`. It rejects with a `TimeoutError`." },
      { level: "B", q: "Why does the Network tab show a cancelled request on first load in dev?", a: "Strict Mode runs effect → cleanup → effect, so the first request is aborted. Production runs it once." },
      { level: "I", q: "Cancel a request with axios.", a: "Pass the same signal and ignore cancels.", code: `const controller = new AbortController();\napi.get('/recipes', { params: { q }, signal: controller.signal })\n  .catch((err) => { if (!axios.isCancel(err)) setError(err); });\nreturn () => controller.abort();` },
      { level: "C", q: "Add a **Stop** button that cancels a slow export download.", a: "Keep the controller in a ref (`useRef`), call `ref.current.abort()` in the button's click handler, and create a new one for each download." }
    ],
    quiz: [
      { q: "Where do you call `controller.abort()` in an effect?", options: ["At the start of the effect", "In the cleanup function", "In the `.then`"], answer: 1, why: "The cleanup runs on unmount and before the next run, exactly when the old request is stale." },
      { q: "What does an aborted fetch do?", options: ["Resolves with `null`", "Rejects with an `AbortError`", "Hangs forever"], answer: 1, why: "It rejects, so filter `err.name === 'AbortError'` out of your error handling." },
      { q: "Does aborting stop the server from processing the request?", options: ["Yes, always", "Not necessarily: it stops the browser waiting for and using the reply", "Only for GET requests"], answer: 1, why: "The server may still finish the work. Abort is a client-side \"I don't care any more\"." }
    ],
    rev: {
      sec30: "Create an `AbortController` inside the effect, pass `controller.signal` to fetch (or axios), and return `() => controller.abort()` as cleanup. Unmounts and new inputs cancel stale requests. Aborted requests reject with `AbortError`: ignore it. Strict Mode in dev shows one extra cancelled request; that's normal.",
      interview: [
        { level: "basic", q: "How do you cancel a fetch in React?", a: "Create an `AbortController` in the effect, pass its `signal` to fetch and call `abort()` in the cleanup." },
        { level: "intermediate", q: "Why cancel requests at all?", a: "To stop stale responses overwriting newer data, avoid wasted bandwidth, and avoid updating state after unmount." },
        { level: "intermediate", q: "How do you handle the error an abort causes?", a: "Check `err.name === 'AbortError'` (or `axios.isCancel`) and return early so it isn't shown as a failure." },
        { level: "advanced", q: "How does abort help with race conditions?", a: "Each new query aborts the previous request, so an older, slower response can never land after a newer one." },
        { level: "tricky", q: "You see two requests on mount, one cancelled. Bug?", a: "No. In development Strict Mode runs the effect, its cleanup and the effect again to surface missing cleanups. Production sends one." }
      ],
      predict: [
        { code: `const c = new AbortController();\nc.abort();\nfetch('/api/notes', { signal: c.signal })\n  .catch(e => console.log(e.name));`, answer: "Logs `AbortError`", why: "An already-aborted signal makes fetch reject immediately." }
      ],
      cheat: [
        "`const c = new AbortController(); fetch(url, { signal: c.signal })`",
        "Cleanup: `return () => c.abort()`",
        "New controller per effect run; aborted ones can't be reused",
        "Ignore `err.name === 'AbortError'`",
        "Axios: same `signal`, check `axios.isCancel(err)`",
        "`AbortSignal.timeout(ms)` for timeouts",
        "Strict Mode dev: one cancelled request on mount is normal"
      ]
    },
    related: ["HOOKS-005", "API-030", "API-026", "HOOKS-025"]
  },
  "API-024": {
    tldr: "Pagination loads a big list in small chunks. **Page-based** asks for \"page 3 of 20 items\"; **cursor-based** asks for \"the next 20 after this item\". Pick by whether users jump to pages or just scroll on.",
    analogy: { icon: "📖", text: "A recipe book vs a playlist. In the book you flip straight to page 42 (page-based). In a playlist you just hit \"next\" from the song you're on (cursor-based)." },
    visual: { type: "compare", title: "Two ways to page through products",
      left: { label: "Page-based (offset)", tone: "neutral", points: [
        "`GET /products?page=3&limit=20`",
        "Reply: `{ items, total: 412 }` → show \"Page 3 of 21\"",
        "Jump to any page; easy page numbers",
        "New items shift pages: duplicates or gaps",
        "Slow on huge tables (`OFFSET 100000`)"
      ]},
      right: { label: "Cursor-based (keyset)", tone: "good", points: [
        "`GET /products?after=p_981&limit=20`",
        "Reply: `{ items, nextCursor: \"p_1001\" }`",
        "Stable while new items are added",
        "Fast at any depth (`WHERE id > ...`)",
        "No \"jump to page 9\"; best for feeds and infinite scroll"
      ]}
    },
    points: [
      "Keep the current **page in state** (or in the URL as `?page=3` so refresh and back work).",
      "Put `page` in the effect's **dependency array** so changing it refetches.",
      "Disable **Prev** on page 1 and **Next** on the last page (`page * limit >= total`, or `nextCursor === null`).",
      "Cursor lists **append**: `setItems(prev => [...prev, ...data.items])`.",
      "Abort the previous page request when the page changes fast (API-023).",
      "TanStack Query has `placeholderData: keepPreviousData` and `useInfiniteQuery` for exactly this."
    ],
    code: { file: "ProductList.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

const LIMIT = 20;

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(\`/api/products?page=\${page}&limit=\${LIMIT}\`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => { if (err.name !== 'AbortError') console.error(err); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page]);

  const lastPage = Math.max(1, Math.ceil(data.total / LIMIT));

  return (
    <section aria-busy={loading}>
      <ul>
        {data.items.map((p) => <li key={p.id}>{p.name}: £{p.price}</li>)}
      </ul>
      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
      <span> Page {page} of {lastPage} </span>
      <button disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>Next</button>
    </section>
  );
}`, walk: [
      { lines: [6], note: "The current page is state. Starts at 1." },
      { lines: [13], note: "Ask the API for one page: `page` and `limit` in the query string." },
      { lines: [19], note: "`page` in the deps: clicking Next refetches." },
      { lines: [21], note: "Work out the last page from `total` returned by the API." },
      { lines: [28, 30], note: "Guard both ends so users can't go to page 0 or past the end." }
    ]},
    output: "A list of 20 products with \"Prev  Page 1 of 21  Next\". Prev is disabled on page 1.",
    mistakes: [
      { bad: `// load ALL 5,000 products, slice in the browser\nfetch('/api/products').then(r => r.json())\n  .then(all => setItems(all.slice(0, 20)));`, good: `fetch(\`/api/products?page=\${page}&limit=20\`)`, why: "Client-side slicing still downloads everything. Let the server send one page." },
      { bad: `// cursor list\n.then(d => setItems(d.items));`, good: `.then(d => {\n  setItems(prev => [...prev, ...d.items]);\n  setCursor(d.nextCursor);\n});`, why: "\"Load more\" should append to what's shown, not replace it." }
    ],
    practice: [
      { level: "B", q: "100 items, `limit` 20. How many pages?", a: "`Math.ceil(100 / 20)` = 5." },
      { level: "I", q: "Build a cursor-based \"Load more\" for chat messages.", a: "Keep `items` and `cursor`; append each page; hide the button when `nextCursor` is null.", code: `async function loadMore() {\n  const url = cursor ? \`/api/messages?after=\${cursor}\` : '/api/messages';\n  const d = await fetch(url).then(r => r.json());\n  setItems(prev => [...prev, ...d.items]);\n  setCursor(d.nextCursor); // null = no more\n}` },
      { level: "I", q: "Keep the page in the URL so refresh keeps it.", a: "Use `useSearchParams` from `react-router`: `const page = Number(params.get('page') ?? 1)` and `setParams({ page: page + 1 })`." },
      { level: "C", q: "Users see the same product on page 2 and 3 when new products are added. Why, and the fix?", a: "Offset paging shifts when rows are inserted. Switch to cursor (keyset) pagination, e.g. `?after=<lastId>`." }
    ],
    quiz: [
      { q: "Best fit for an infinite-scroll chat feed?", options: ["Page-based", "Cursor-based", "Load everything"], answer: 1, why: "Cursors stay correct while new messages arrive and are fast at any depth." },
      { q: "Why put `page` in the effect dependency array?", options: ["So the effect re-runs and fetches the new page", "React requires every state in deps", "To cache pages"], answer: 0, why: "The effect must re-sync with the server whenever the page changes." },
      { q: "What does a cursor API return to fetch the next chunk?", options: ["`total` pages", "A `nextCursor` token", "An offset number"], answer: 1, why: "The client sends the cursor back as `after=...`; `null` means no more." }
    ],
    rev: {
      sec30: "Never load every row. Page-based uses `?page&limit` plus a `total`, great for numbered pages but shifts when data changes and gets slow deep in. Cursor-based uses `?after=<cursor>` and returns `nextCursor`, stable and fast, ideal for feeds/infinite scroll. Keep page or cursor in state (or the URL), refetch on change, guard the ends.",
      interview: [
        { level: "basic", q: "Why paginate?", a: "Smaller responses, faster first render, less memory and less work for the database." },
        { level: "intermediate", q: "Offset vs cursor pagination?", a: "Offset: `page/limit`, can jump to pages, but rows shift on inserts and big offsets are slow. Cursor: `after=<id>`, stable and fast, but only next/previous." },
        { level: "intermediate", q: "How do you build infinite scroll?", a: "Cursor API + append results + an `IntersectionObserver` on a sentinel element at the end of the list to call `loadMore`." },
        { level: "advanced", q: "How do you avoid a flash of empty list while the next page loads?", a: "Keep showing the old page until the new one arrives (TanStack Query's `placeholderData: keepPreviousData`), and show a small loading indicator." },
        { level: "tricky", q: "Should the total count always be returned?", a: "Not necessarily. `COUNT(*)` on huge tables is expensive; cursor feeds often skip it and just return `nextCursor`." }
      ],
      cheat: [
        "Page: `?page=3&limit=20` + `total`",
        "Cursor: `?after=abc&limit=20` + `nextCursor`",
        "Last page: `Math.ceil(total / limit)`",
        "Cursor lists append: `[...prev, ...new]`",
        "Page in deps or in URL (`useSearchParams`)",
        "Offset shifts on inserts; cursor doesn't",
        "TanStack: `keepPreviousData`, `useInfiniteQuery`"
      ]
    },
    related: ["API-008", "PERF-008", "ROUTE-012", "API-025"]
  },
  "API-025": {
    tldr: "Store search and filters in the **URL query string** (`?q=pasta&diet=vegan`). The URL becomes the source of truth: it drives the API request, survives refresh, and can be shared or bookmarked.",
    analogy: { icon: "🔖", text: "Saving a shop search as a link. Send your friend `?q=trainers&size=9` and they see exactly your filtered results, no need to tick the same boxes again." },
    visual: { type: "cycle", title: "URL drives everything", steps: [
      { label: "User picks filter", detail: "Selects **Vegan** in the diet dropdown." },
      { label: "Update URL", detail: "`setSearchParams` → `/recipes?q=pasta&diet=vegan`." },
      { label: "Read params", detail: "Component re-renders; reads `q` and `diet` from `searchParams`." },
      { label: "Fetch", detail: "Effect calls `/api/recipes?q=pasta&diet=vegan`." },
      { label: "Show results", detail: "List renders. Back button restores the previous filters." }
    ]},
    points: [
      "Read with `useSearchParams()` from **`react-router`** (v7): `searchParams.get('diet')` returns a string or `null`.",
      "Don't copy params into `useState`: **derive** from the URL each render (one source of truth).",
      "Write with `setSearchParams(prev => { prev.set('diet', v); return prev; })` so other params stay.",
      "**Delete** empty filters, and **reset page to 1** when a filter changes.",
      "Build the API URL with `URLSearchParams`; it encodes spaces and `&` safely.",
      "Use `{ replace: true }` for every keystroke so Back doesn't step through each letter."
    ],
    code: { file: "Recipes.jsx", lang: "jsx", src: `import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const diet = searchParams.get('diet') ?? '';
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q, diet });
    fetch(\`/api/recipes?\${params}\`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setRecipes)
      .catch(() => {});
    return () => controller.abort();
  }, [q, diet]);

  function update(key, value) {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      prev.delete('page'); // new filter → back to page 1
      return prev;
    }, { replace: key === 'q' });
  }

  return (
    <>
      <input value={q} onChange={(e) => update('q', e.target.value)} placeholder="Search" />
      <select value={diet} onChange={(e) => update('diet', e.target.value)}>
        <option value="">Any diet</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-free</option>
      </select>
      <ul>{recipes.map((r) => <li key={r.id}>{r.title}</li>)}</ul>
    </>
  );
}`, walk: [
      { lines: [5, 6, 7], note: "The URL is the state. `?? ''` turns a missing param into an empty string." },
      { lines: [12, 13], note: "`URLSearchParams` builds `q=pasta&diet=vegan`, encoding it safely." },
      { lines: [18], note: "Refetch whenever a filter in the URL changes, including Back/Forward." },
      { lines: [21, 22, 23, 24], note: "Change one key, keep the others, drop empty ones, reset the page." },
      { lines: [26], note: "Typing replaces the history entry; dropdown changes push a new one." }
    ]},
    output: "Choosing Vegan changes the address bar to `/recipes?q=pasta&diet=vegan` and the list refetches. Refresh keeps the same results.",
    mistakes: [
      { bad: `const [diet, setDiet] = useState(searchParams.get('diet'));`, good: `const diet = searchParams.get('diet') ?? '';`, why: "Copying into state only reads the URL once. Back/Forward then changes the URL but not your filter." },
      { bad: `setSearchParams({ diet: 'vegan' });`, good: `setSearchParams(prev => { prev.set('diet', 'vegan'); return prev; });`, why: "Passing a new object replaces the whole query string, wiping `q` and other filters." }
    ],
    practice: [
      { level: "B", q: "Read `?sort=price` with a default of `newest`.", a: "`const sort = searchParams.get('sort') ?? 'newest';`" },
      { level: "I", q: "Support several tags: `?tag=quick&tag=cheap`.", a: "Read with `searchParams.getAll('tag')`; write with `prev.append('tag', t)`." },
      { level: "I", q: "Add a **Clear filters** button.", a: "`setSearchParams({})` resets to no params." },
      { level: "C", q: "Typing fires a request per letter. Fix it without losing URL sync.", a: "Keep the URL updated immediately but debounce the value used for fetching (API-026), or keep the input local and debounce writing to the URL." }
    ],
    quiz: [
      { q: "Why keep filters in the URL rather than state?", options: ["It's faster", "Refresh, Back and shared links keep the same results", "React Router requires it"], answer: 1, why: "The URL is shareable, bookmarkable and works with browser history." },
      { q: "`setSearchParams({ diet: 'vegan' })` when the URL is `?q=pasta`. Result?", options: ["`?q=pasta&diet=vegan`", "`?diet=vegan`", "`?q=pasta`"], answer: 1, why: "An object replaces all params. Use the updater form to keep others." },
      { q: "What should happen to `page` when a filter changes?", options: ["Keep it", "Reset to 1", "Increase by 1"], answer: 1, why: "Page 7 of the old results may not exist for the new filter." }
    ],
    rev: {
      sec30: "Make the URL the source of truth for search and filters: read with `useSearchParams` (from `react-router`), derive values each render, update with the functional `setSearchParams(prev => ...)`, delete empty params, reset page on change. The effect depends on those values and builds the API query with `URLSearchParams`.",
      interview: [
        { level: "basic", q: "How do you read query params in React Router 7?", a: "`const [searchParams, setSearchParams] = useSearchParams()` from `react-router`, then `searchParams.get('q')`." },
        { level: "intermediate", q: "Why not mirror the params in `useState`?", a: "Two sources of truth drift apart: Back/Forward changes the URL but not your state. Derive from the URL instead." },
        { level: "intermediate", q: "Filtering on the client or the server?", a: "Client is fine for small lists already loaded. For large or paginated data, send filters to the API so the server returns only matches." },
        { level: "advanced", q: "How do you avoid flooding history while typing?", a: "Pass `{ replace: true }` for text input changes so Back goes to the previous search, not the previous letter." },
        { level: "tricky", q: "`searchParams.get('page')` returns `\"2\"`. What's the catch?", a: "It's a string. Convert with `Number(...)` before maths or comparisons, and validate it." }
      ],
      cheat: [
        "`useSearchParams()` from `react-router`",
        "`get` → string or `null`; `getAll` for repeated keys",
        "Derive values, don't copy into state",
        "Updater form keeps other params",
        "Delete empty filters; reset `page`",
        "`new URLSearchParams(obj).toString()` for the API",
        "`{ replace: true }` while typing"
      ]
    },
    related: ["ROUTE-012", "API-024", "API-026", "PROJ-007"]
  },
  "API-026": {
    tldr: "Debouncing waits until the user **stops typing** (say 300 ms) before calling the API. Typing \"weather\" sends 1 request instead of 7, and the server stops getting hammered.",
    analogy: { icon: "🛗", text: "A lift (elevator) door. It waits a moment after the last person steps in before closing. Each new person resets the wait, so it leaves once, not once per person." },
    visual: { type: "timeline", title: "Typing \"rome\" with a 300 ms debounce", frames: [
      { label: "0 ms: \"r\"", state: "timer starts (300 ms)", note: "No request yet." },
      { label: "120 ms: \"ro\"", state: "old timer cleared, new timer", note: "Every keystroke restarts the wait." },
      { label: "230 ms: \"rom\"", state: "old timer cleared, new timer", note: "Still typing. Still no request." },
      { label: "340 ms: \"rome\"", state: "old timer cleared, new timer", note: "Last key." },
      { label: "640 ms", state: "debounced = \"rome\" → 1 request", note: "300 ms of quiet: fetch weather for Rome." }
    ]},
    points: [
      "Keep **two values**: `text` (updates every key, shown in the input) and `debounced` (updates after a pause, used to fetch).",
      "Implement with `setTimeout` in an effect, and **clear the timer in the cleanup**. That clearing is the debounce.",
      "300-500 ms is typical for search boxes.",
      "Debounce reduces requests; it does **not** fix out-of-order responses. Still abort or ignore stale ones (API-023/API-030).",
      "**Throttle** is different: at most once per interval (scroll, resize). Debounce: once after it goes quiet.",
      "`useDeferredValue` keeps rendering smooth but doesn't reduce network requests; use a debounce for that."
    ],
    code: { file: "WeatherSearch.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // key pressed again: restart
  }, [value, delay]);
  return debounced;
}

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const debouncedCity = useDebounce(city, 300);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!debouncedCity) return;
    const controller = new AbortController();
    fetch(\`/api/weather?city=\${encodeURIComponent(debouncedCity)}\`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setResult)
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedCity]);

  return (
    <>
      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
      {result && <p>{result.city}: {result.tempC}°C</p>}
    </>
  );
}`, walk: [
      { lines: [3, 4], note: "A tiny custom hook: it returns a slow copy of `value`." },
      { lines: [6], note: "Schedule the update for `delay` ms from now." },
      { lines: [7], note: "If `value` changes first, the cleanup cancels the pending timer. Only a pause lets it fire." },
      { lines: [14], note: "Input uses `city` (instant); the fetch uses `debouncedCity` (after the pause)." },
      { lines: [17, 27], note: "The effect only depends on the debounced value, so it runs once per pause." },
      { lines: [19, 26], note: "Abort as well, in case an older request is still in flight." }
    ]},
    output: "Typing \"rome\" quickly sends one request: `/api/weather?city=rome`. The input itself stays instant.",
    mistakes: [
      { bad: `onChange={(e) => {\n  setCity(e.target.value);\n  setTimeout(() => search(e.target.value), 300);\n}}`, good: `const debouncedCity = useDebounce(city, 300);\nuseEffect(() => { search(debouncedCity); }, [debouncedCity]);`, why: "That only delays each request; it never cancels the earlier timers. Typing 7 letters still sends 7 requests." },
      { bad: `const [city, setCity] = useState('');\n// input shows the debounced value\n<input value={debouncedCity} ... />`, good: `<input value={city} onChange={e => setCity(e.target.value)} />`, why: "The input must show the instant value, or typing feels laggy and characters get lost." }
    ],
    practice: [
      { level: "B", q: "User types 10 letters, 50 ms apart, then stops. How many requests with a 300 ms debounce?", a: "One, about 300 ms after the last letter." },
      { level: "B", q: "Don't search until there are at least 2 characters.", a: "`if (debouncedCity.length < 2) return;` at the top of the fetch effect." },
      { level: "I", q: "Show \"Searching…\" while waiting.", a: "`const waiting = city !== debouncedCity;` plus a loading flag for the request itself." },
      { level: "C", q: "Debounce a callback (not a value) for an autosave notes editor.", a: "Store the timer id in a ref and clear it on each call and on unmount.", code: `const timer = useRef();\nfunction scheduleSave(text) {\n  clearTimeout(timer.current);\n  timer.current = setTimeout(() => saveNote(text), 800);\n}\nuseEffect(() => () => clearTimeout(timer.current), []);` }
    ],
    quiz: [
      { q: "What makes a debounce work in the `useDebounce` hook?", options: ["`setInterval`", "Clearing the previous timer in the effect cleanup", "`useMemo`", "Calling fetch twice"], answer: 1, why: "Each new value cancels the pending timer, so only a pause lets it fire." },
      { q: "Debounce vs throttle: which fits a search box?", options: ["Debounce: run once after typing stops", "Throttle: run every 300 ms while typing", "Neither"], answer: 0, why: "You want results for the final text, not snapshots mid-word." },
      { q: "With a debounce, do you still need AbortController?", options: ["No, debounce prevents all races", "Yes, a slow older request can still finish after a newer one"], answer: 1, why: "Debounce cuts the number of requests; it doesn't control the order replies arrive in." }
    ],
    rev: {
      sec30: "Debounce delays a request until input has been quiet for N ms. In React: keep the instant value for the input and a debounced copy (via `setTimeout` in an effect, cleared in cleanup) for fetching. It slashes requests but doesn't stop out-of-order replies, so still abort stale requests. Throttle = at most once per interval.",
      interview: [
        { level: "basic", q: "What is debouncing?", a: "Waiting until an event stops firing for a set time before acting, e.g. searching 300 ms after the last keystroke." },
        { level: "intermediate", q: "Implement `useDebounce`.", a: "State for the debounced value; an effect on `[value, delay]` sets a timeout to update it and returns `clearTimeout` as cleanup." },
        { level: "intermediate", q: "Debounce vs throttle?", a: "Debounce fires once after activity stops (search). Throttle fires at most once per interval during activity (scroll, resize)." },
        { level: "advanced", q: "Why does `debounce(fn)` from lodash inside a component often fail?", a: "It's recreated every render, so each render gets a new timer. Wrap it in `useMemo`/`useRef`, or use a value-based hook." },
        { level: "tricky", q: "Does `useDeferredValue` replace debouncing for API calls?", a: "No. It has no fixed delay; on a fast device it updates almost every keystroke, so requests still fire. Debounce for network work." }
      ],
      compare: { cols: ["", "Debounce", "Throttle"], rows: [
        ["Fires", "Once, after a pause", "Regularly, at most every N ms"],
        ["Use for", "Search, autosave, validation", "Scroll, resize, drag"],
        ["Typing 'rome'", "1 call", "Several calls"]
      ]},
      cheat: [
        "Input shows instant value; fetch uses debounced value",
        "`setTimeout` + `clearTimeout` in cleanup = debounce",
        "300-500 ms for search",
        "Still abort stale requests",
        "Throttle: at most once per interval",
        "`useDeferredValue` doesn't cut requests",
        "Callback debounce: timer id in a `useRef`"
      ]
    },
    related: ["HOOKS-027", "PERF-013", "API-023", "PROJ-004"]
  },
  "API-027": {
    tldr: "Optimistic update: change the UI **immediately** as if the server said yes, send the request in the background, and **roll back** if it fails. The app feels instant.",
    analogy: { icon: "❤️", text: "Liking a friend's photo. The heart turns red the moment you tap, before the server confirms. If the network fails, it quietly turns grey again with a small \"couldn't like\" message." },
    visual: { type: "timeline", title: "Ticking a todo, then the server fails", frames: [
      { label: "before", state: "\"Buy milk\" done = false", note: "Save a copy: `previous = todos`." },
      { label: "tap", state: "\"Buy milk\" done = true ✓", note: "UI updates instantly, no spinner." },
      { label: "request", state: "PATCH /todos/7 { done: true }", note: "Sent in the background." },
      { label: "server 500", state: "done = false (rolled back)", note: "Restore `previous` and show a toast." },
      { label: "or 200", state: "done = true (kept)", note: "Optionally replace with the server's copy." }
    ]},
    points: [
      "Steps: **save previous** → **update UI** → **send request** → on error **restore** and tell the user.",
      "Use it for actions that **almost always succeed** and are easy to undo: likes, toggles, reorder, rename.",
      "Avoid it for payments, orders, or anything where a fake \"success\" would mislead.",
      "Use **functional updates** (`setTodos(prev => ...)`) so fast clicks don't overwrite each other.",
      "React 19's `useOptimistic` does this inside an Action; TanStack Query does it with `onMutate` / `onError` rollback.",
      "Always show an error on rollback; silent reverts confuse users."
    ],
    code: { file: "TodoList.jsx", lang: "jsx", src: `import { useState } from 'react';

export default function TodoList({ initialTodos }) {
  const [todos, setTodos] = useState(initialTodos);
  const [error, setError] = useState('');

  async function toggle(id) {
    const previous = todos; // 1. snapshot for rollback
    setTodos((list) => // 2. update UI now
      list.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    setError('');

    try {
      const todo = todos.find((t) => t.id === id);
      const res = await fetch(\`/api/todos/\${id}\`, { // 3. tell the server
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    } catch {
      setTodos(previous); // 4. roll back
      setError('Could not save. Please try again.');
    }
  }

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              {t.title}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}`, walk: [
      { lines: [8], note: "Keep the current list so we can put it back if the server says no." },
      { lines: [9, 10, 11], note: "Flip the checkbox straight away. No spinner, no wait." },
      { lines: [15, 16, 17, 18, 19, 20], note: "Send the change. `todos` is still this render's snapshot, so `!todo.done` is the new value." },
      { lines: [21], note: "`fetch` doesn't throw on 4xx/5xx; do it yourself so the catch runs." },
      { lines: [22, 23, 24], note: "Failure: restore the snapshot and show a message." }
    ]},
    output: "Checking a todo ticks it instantly. If the API returns 500, the tick disappears and \"Could not save. Please try again.\" appears.",
    mistakes: [
      { bad: `todos.find(t => t.id === id).done = true;\nsetTodos(todos);`, good: `setTodos(list => list.map(t =>\n  t.id === id ? { ...t, done: true } : t\n));`, why: "Mutating the same array means React sees no change, and your rollback snapshot gets mutated too." },
      { bad: `catch {\n  setTodos(previous);\n}`, good: `catch {\n  setTodos(previous);\n  setError('Could not save.');\n}`, why: "A silent rollback looks like the app ignored the click. Tell the user what happened." }
    ],
    practice: [
      { level: "B", q: "Name the four steps of an optimistic update.", a: "Snapshot, update UI, send request, roll back + notify on failure." },
      { level: "I", q: "Make delete optimistic.", a: "`const previous = todos; setTodos(l => l.filter(t => t.id !== id));` then `DELETE`, and `setTodos(previous)` in `catch`." },
      { level: "I", q: "Same with `useOptimistic` (React 19).", a: "Show the optimistic list while the Action runs; it reverts automatically when the Action finishes.", code: `const [optimistic, addOptimistic] = useOptimistic(\n  todos,\n  (list, id) => list.map(t => t.id === id ? { ...t, done: !t.done } : t)\n);\nfunction toggle(id) {\n  startTransition(async () => {\n    addOptimistic(id);\n    try {\n      const saved = await saveToggle(id);\n      startTransition(() => setTodos(l => l.map(t => t.id === id ? saved : t)));\n    } catch {\n      setError('Could not save.'); // optimistic value reverts by itself\n    }\n  });\n}` },
      { level: "C", q: "User toggles A, then B, then A's request fails. Rolling back to the snapshot also undoes B. Fix?", a: "Roll back only the failed item: `setTodos(l => l.map(t => t.id === id ? { ...t, done: !t.done } : t))` instead of restoring the whole list." }
    ],
    quiz: [
      { q: "When is an optimistic update a bad idea?", options: ["Liking a post", "Placing a paid order", "Renaming a playlist"], answer: 1, why: "Showing \"Order placed\" before the payment succeeds would mislead the user." },
      { q: "What do you need before changing the UI?", options: ["A snapshot of the previous state", "A loading spinner", "The server's response"], answer: 0, why: "Without the old value you can't roll back." },
      { q: "`fetch` gets a 500. Does your `catch` run?", options: ["Yes, always", "Only if you check `res.ok` and throw"], answer: 1, why: "fetch only rejects on network errors; HTTP errors resolve normally." }
    ],
    rev: {
      sec30: "Optimistic UI updates state before the server confirms: snapshot, update, request, roll back and notify on failure. Great for likes, toggles, reorders; wrong for payments. Use immutable/functional updates; roll back just the failed change when several are in flight. React 19 has `useOptimistic`; TanStack Query uses `onMutate`/`onError`/`onSettled`.",
      interview: [
        { level: "basic", q: "What is an optimistic update?", a: "Updating the UI as if a request succeeded, before the response, and undoing it if it fails." },
        { level: "intermediate", q: "How do you roll back?", a: "Keep a snapshot of the previous state (or the item's old value) and restore it in the error handler, then show a message." },
        { level: "advanced", q: "How does TanStack Query do it?", a: "In `onMutate` cancel queries, snapshot with `getQueryData`, set the optimistic data; in `onError` restore the snapshot; in `onSettled` invalidate to refetch the truth." },
        { level: "advanced", q: "What does `useOptimistic` add?", a: "An optimistic copy of state that shows only while an Action/transition is pending and falls back to the real state automatically when it ends." },
        { level: "tricky", q: "Two quick toggles on the same todo, first request fails. Risk?", a: "Restoring the old whole-list snapshot can wipe the second change. Roll back per item, or queue/serialise requests per item." }
      ],
      cheat: [
        "Snapshot → update UI → request → rollback + toast",
        "For likely-to-succeed, reversible actions",
        "Never for payments or irreversible actions",
        "Immutable updates; functional setters",
        "Check `res.ok`: fetch doesn't throw on 500",
        "React 19: `useOptimistic` inside a transition/Action",
        "TanStack: `onMutate` / `onError` / `onSettled`"
      ]
    },
    related: ["HOOKS-019", "STORE-022", "API-010", "PROJ-014"]
  },
  "API-028": {
    tldr: "Some failures are temporary (a blip, a busy server). Retry them a few times with **growing waits** (exponential backoff, 1s, 2s, 4s...), but only for errors that might pass and requests that are **safe to repeat**.",
    analogy: { icon: "📞", text: "Calling a busy takeaway. You redial after 1 minute, then 2, then 4, not 50 times a second. And if they said \"we're closed\" (a real no), you stop calling." },
    visual: { type: "timeline", title: "GET /api/weather with backoff", frames: [
      { label: "attempt 1", state: "503 Service Unavailable", note: "Temporary. Wait ~1 s (+ random jitter)." },
      { label: "attempt 2", state: "network error", note: "Still temporary. Wait ~2 s." },
      { label: "attempt 3", state: "503", note: "Wait ~4 s." },
      { label: "attempt 4", state: "200 OK ✓", note: "Success: show the forecast." },
      { label: "if 404 instead", state: "stop at once, no retry", note: "A 4xx won't fix itself by asking again." }
    ]},
    points: [
      "**Retry**: network errors, timeouts, `408`, `429`, `502`, `503`, `504`. **Don't retry**: `400`, `401`, `403`, `404`, `422`.",
      "Only retry **idempotent** requests (same result if repeated): `GET`, `PUT`, `DELETE`. A retried `POST` can create two orders.",
      "Wait `base * 2^attempt`, cap it (e.g. 10 s), and add **jitter** (randomness) so thousands of clients don't retry in sync.",
      "Respect the server's `Retry-After` header on `429`/`503`.",
      "Limit attempts (3-4 total), then show an error with a **Retry** button.",
      "Don't retry aborted requests. TanStack Query retries queries 3 times by default (mutations 0)."
    ],
    code: { file: "fetchWithRetry.js", lang: "js", src: `const RETRYABLE = new Set([408, 429, 502, 503, 504]);
const IDEMPOTENT = new Set(['GET', 'HEAD', 'PUT', 'DELETE']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry(url, options = {}, retries = 3) {
  const method = (options.method ?? 'GET').toUpperCase();
  const canRetry = IDEMPOTENT.has(method);

  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || !RETRYABLE.has(res.status) || !canRetry || attempt >= retries) {
        return res; // success, a "real" error, or out of attempts
      }
      const retryAfter = Number(res.headers.get('Retry-After')) * 1000;
      await sleep(retryAfter || backoff(attempt));
    } catch (err) {
      if (err.name === 'AbortError' || !canRetry || attempt >= retries) throw err;
      await sleep(backoff(attempt)); // network error: try again
    }
  }
}

function backoff(attempt) {
  const exp = Math.min(1000 * 2 ** attempt, 10000); // 1s, 2s, 4s... max 10s
  return exp / 2 + Math.random() * (exp / 2); // jitter
}

// const res = await fetchWithRetry('/api/weather?city=Rome');`, walk: [
      { lines: [1, 2], note: "Two allow-lists: which statuses might pass, which methods are safe to repeat." },
      { lines: [12, 13], note: "Return straight away on success, on a non-retryable error, for unsafe methods, or when out of tries." },
      { lines: [15, 16], note: "Use the server's `Retry-After` (seconds) if it sent one, else our backoff." },
      { lines: [18, 19], note: "Network failures throw. Never retry an abort: the user cancelled on purpose." },
      { lines: [24, 25, 26], note: "Exponential growth with a cap, then random jitter in the upper half." }
    ]},
    output: "A flaky 503 then 200 resolves after ~1 s. A 404 returns immediately with no extra requests.",
    mistakes: [
      { bad: `// retry every failure, instantly, forever\nwhile (true) {\n  try { return await fetch(url); } catch {}\n}`, good: `// limited attempts + backoff + retryable errors only\nreturn fetchWithRetry(url, {}, 3);`, why: "Instant endless retries hammer a struggling server (a self-made traffic storm) and freeze the UI." },
      { bad: `fetchWithRetry('/api/orders', { method: 'POST', body });`, good: `// POST: no auto-retry, or send an idempotency key\nfetch('/api/orders', {\n  method: 'POST', body,\n  headers: { 'Idempotency-Key': crypto.randomUUID() }\n});`, why: "If the first POST succeeded but the reply was lost, a retry places a second order." }
    ],
    practice: [
      { level: "B", q: "Should you retry a `404`?", a: "No. The resource isn't there; asking again gives the same answer." },
      { level: "B", q: "Backoff waits for attempts 0, 1, 2, 3 with base 1 s?", a: "1 s, 2 s, 4 s, 8 s (before jitter)." },
      { level: "I", q: "Configure retries in TanStack Query.", a: "Retry only server/network errors, 3 times.", code: `useQuery({\n  queryKey: ['weather', city],\n  queryFn: () => getWeather(city),\n  retry: (count, err) => count < 3 && (err.status ?? 500) >= 500,\n});` },
      { level: "C", q: "Why add jitter?", a: "If a server restarts, every client fails at the same moment. Without jitter they all retry at exactly 1 s, 2 s... and knock it over again." }
    ],
    quiz: [
      { q: "Which is safe to auto-retry?", options: ["`POST /orders`", "`GET /products`", "`POST /payments`"], answer: 1, why: "GET is idempotent: repeating it doesn't change anything." },
      { q: "Which status is worth retrying?", options: ["`400`", "`403`", "`503`", "`422`"], answer: 2, why: "503 means temporarily unavailable. The others are client errors that won't change." },
      { q: "What does exponential backoff mean?", options: ["Retry every 1 s", "Each wait roughly doubles", "Retry faster each time"], answer: 1, why: "Growing waits give the server room to recover." }
    ],
    rev: {
      sec30: "Retry only transient failures (network, timeout, 408, 429, 5xx gateway errors) and only idempotent requests. Wait with exponential backoff plus jitter, cap the delay and the attempts, honour `Retry-After`, never retry aborts or 4xx. For POST, skip retries or use an idempotency key. TanStack Query retries queries 3× by default.",
      interview: [
        { level: "basic", q: "What is exponential backoff?", a: "Waiting longer after each failed attempt, usually doubling (1 s, 2 s, 4 s), so a struggling server gets time to recover." },
        { level: "intermediate", q: "Which errors should you retry?", a: "Transient ones: network errors, timeouts, 408, 429, 502/503/504. Not 400/401/403/404/422, which won't change." },
        { level: "intermediate", q: "Why not retry POST?", a: "It isn't idempotent. If the server processed it but the response was lost, a retry creates a duplicate." },
        { level: "advanced", q: "What is jitter and why?", a: "Random variation in the wait. It spreads retries out so many clients failing together don't all hit the server at the same instant." },
        { level: "advanced", q: "How can you safely retry a payment request?", a: "Send an `Idempotency-Key` header; the server stores the result per key and returns the same response for repeats." },
        { level: "tricky", q: "A 401 comes back. Retry with backoff?", a: "No. Refresh the token once (API-018/API-022) or log out. Waiting won't make the token valid." }
      ],
      cheat: [
        "Retry: network, timeout, 408, 429, 502, 503, 504",
        "Never: 400, 401, 403, 404, 422, aborts",
        "Idempotent only: GET, PUT, DELETE",
        "Delay = min(base × 2^n, cap) + jitter",
        "Honour `Retry-After`",
        "3-4 attempts, then show a Retry button",
        "POST: idempotency key or no retry",
        "TanStack: queries retry 3×, mutations 0×"
      ]
    },
    related: ["API-014", "COND-017", "STORE-020", "API-022"]
  },
  "API-029": {
    tldr: "Caching keeps a copy of a response so you don't ask the server again for data that hasn't changed. Serve the copy while it's **fresh**, refetch when it's **stale**, and clear it when you change the data.",
    analogy: { icon: "🥫", text: "Your kitchen cupboard. You don't drive to the shop every time you need pasta; you check the cupboard first. If the milk's past its date, then you go buy more." },
    visual: { type: "flow", title: "Ask the cache first", steps: [
      { label: "Need products", detail: "Product page mounts and calls `getProducts()`." },
      { label: "Check cache", detail: "Key `\"/api/products?cat=shoes\"`. Found, saved 20 s ago." },
      { label: "Fresh? Return it", detail: "Younger than 60 s (TTL): instant render, **0 requests**." },
      { label: "Stale? Refetch", detail: "Too old or missing: fetch, store with a timestamp, return." },
      { label: "Changed data?", detail: "After `POST /products`, **invalidate** the key so the next read refetches." }
    ]},
    points: [
      "Cache **key** = everything that changes the result: URL + query params (+ user).",
      "**TTL** (time to live, a.k.a. stale time): how long a copy counts as fresh.",
      "**Stale-while-revalidate**: show the old copy instantly, refetch in the background, swap when ready.",
      "**Invalidate** after writes (create/update/delete), or users see old data.",
      "Also cache the **in-flight promise** so two components asking at once share one request (dedupe).",
      "HTTP caching (`Cache-Control`, `ETag` → `304 Not Modified`) is set by the server. In apps, use **TanStack Query** (`staleTime`) instead of hand-rolling."
    ],
    code: { file: "cache.js", lang: "js", src: `const cache = new Map(); // key -> { data, time } or { promise }
const TTL = 60_000; // 60 s

export async function cachedGet(url) {
  const hit = cache.get(url);
  if (hit?.promise) return hit.promise; // same request already running
  if (hit && Date.now() - hit.time < TTL) return hit.data; // fresh

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res.json();
    })
    .then((data) => {
      cache.set(url, { data, time: Date.now() });
      return data;
    })
    .catch((err) => {
      cache.delete(url); // don't cache failures
      throw err;
    });

  cache.set(url, { promise });
  return promise;
}

export function invalidate(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

// cachedGet('/api/products?cat=shoes') -> network
// cachedGet('/api/products?cat=shoes') -> instant (cache)
// await createProduct(p); invalidate('/api/products');`, walk: [
      { lines: [1, 2], note: "A Map keyed by URL. Each entry has the data and when it was saved." },
      { lines: [6], note: "Two components asking at once get the same promise: one network call." },
      { lines: [7], note: "Fresh copy? Return it with no request." },
      { lines: [18, 19, 20], note: "Never keep a failed response, or the error sticks for 60 s." },
      { lines: [27, 28, 29, 30, 31], note: "After a write, drop every key that starts with the resource path." }
    ]},
    output: "First visit: 1 request. Coming back within 60 s: 0 requests, instant list. After adding a product: the next visit refetches.",
    mistakes: [
      { bad: `cache.set('/api/products', data);\n// key ignores filters`, good: `cache.set(\`/api/products?cat=\${cat}&page=\${page}\`, data);`, why: "If the key misses a param, shoes and hats share one entry and users see the wrong list." },
      { bad: `await fetch('/api/products', { method: 'POST', body });\n// cache left as is`, good: `await fetch('/api/products', { method: 'POST', body });\ninvalidate('/api/products');`, why: "Without invalidation, the new product doesn't appear until the TTL runs out." }
    ],
    practice: [
      { level: "B", q: "Which should be part of the cache key for `/api/products?cat=shoes&page=2`?", a: "All of it: path, `cat` and `page`. Change any one and the result changes." },
      { level: "I", q: "Same cache with TanStack Query.", a: "Use `staleTime` for freshness and `invalidateQueries` after writes.", code: `useQuery({\n  queryKey: ['products', { cat, page }],\n  queryFn: () => getProducts(cat, page),\n  staleTime: 60_000,\n});\n// after a mutation:\nqueryClient.invalidateQueries({ queryKey: ['products'] });` },
      { level: "I", q: "What should happen to the cache on logout?", a: "Clear it all (`cache.clear()` / `queryClient.clear()`) so the next user doesn't see the previous user's data." },
      { level: "C", q: "Add stale-while-revalidate to `cachedGet`.", a: "If the entry is stale, return `hit.data` immediately and start a background fetch that updates the cache (and notifies subscribers) when done." }
    ],
    quiz: [
      { q: "What does TTL / stale time control?", options: ["How long a cached copy counts as fresh", "Request timeout", "How many retries"], answer: 0, why: "Within the TTL the cache answers; after it, you refetch." },
      { q: "You add a product but the list doesn't show it. Likely cause?", options: ["The cache wasn't invalidated after the POST", "The TTL is too short", "JSON parsing failed"], answer: 0, why: "Writes must invalidate related cached reads." },
      { q: "Why store the in-flight promise?", options: ["To retry it", "So simultaneous requests for the same key share one network call", "To cancel it"], answer: 1, why: "Request deduplication: three components, one fetch." }
    ],
    rev: {
      sec30: "API caching stores responses by a key (URL + params), serves them while fresh (TTL/stale time), refetches when stale (often stale-while-revalidate), dedupes in-flight requests, and invalidates after writes and on logout. HTTP caching (`Cache-Control`, `ETag`/304) is server-driven. In React apps, TanStack Query does all of this: `queryKey`, `staleTime`, `invalidateQueries`.",
      interview: [
        { level: "basic", q: "Why cache API responses?", a: "Faster screens, fewer requests, less server load, and the app keeps working briefly offline or on slow networks." },
        { level: "intermediate", q: "What is stale-while-revalidate?", a: "Return the cached (possibly stale) data instantly, refetch in the background, then update the UI with fresh data." },
        { level: "intermediate", q: "When do you invalidate?", a: "After any mutation that affects cached reads (create/update/delete), on logout, and when the user explicitly refreshes." },
        { level: "advanced", q: "`staleTime` vs `gcTime` in TanStack Query?", a: "`staleTime`: how long data is fresh (no refetch). `gcTime`: how long unused data stays in memory before being garbage-collected (default 5 min)." },
        { level: "tricky", q: "How does an `ETag` save bandwidth if the browser still makes a request?", a: "The browser sends `If-None-Match`; if unchanged the server replies `304` with no body, so the cached copy is reused." }
      ],
      compare: { cols: ["", "HTTP cache", "App cache (TanStack Query)"], rows: [
        ["Controlled by", "Server headers", "Your code (`staleTime`)"],
        ["Lives in", "Browser disk/memory", "JS memory"],
        ["Invalidate after write", "Hard", "`invalidateQueries`"],
        ["Shared state + loading flags", "No", "Yes"]
      ]},
      cheat: [
        "Key = URL + every param (+ user)",
        "TTL / `staleTime` = how long it's fresh",
        "Stale-while-revalidate: show old, refetch quietly",
        "Dedupe: share the in-flight promise",
        "Invalidate after writes; clear on logout",
        "Don't cache errors",
        "HTTP: `Cache-Control`, `ETag` → `304`",
        "Prefer TanStack Query over hand-rolled caches"
      ]
    },
    related: ["STORE-020", "STORE-022", "PERF-016", "PERF-015"]
  },
  "API-030": {
    tldr: "A race condition is when an **older, slower** response arrives after a newer one and overwrites it. Fix: when the input changes, mark the old request as stale (an `ignore` flag or `abort()`) so only the latest response is used.",
    analogy: { icon: "🚕", text: "Ordering two taxis, then cancelling the first. If the first one turns up anyway and you hop in, you end up at the wrong address. You must ignore it and wait for the one you actually want." },
    visual: { type: "timeline", title: "Switching chat rooms fast (no fix)", frames: [
      { label: "0 ms", state: "open #general → request A", note: "A is slow (800 ms)." },
      { label: "100 ms", state: "open #music → request B", note: "B is fast (200 ms)." },
      { label: "300 ms", state: "B arrives → shows #music ✓", note: "Correct so far." },
      { label: "800 ms", state: "A arrives → shows #general ✗", note: "Header says #music, messages are #general. Bug!" },
      { label: "with ignore flag", state: "A arrives → ignored ✓", note: "Cleanup set `ignore = true` when the room changed." }
    ]},
    points: [
      "Networks don't keep order: request 2 can finish **before** request 1.",
      "Classic places: search-as-you-type, switching tabs/IDs, fast pagination, filters.",
      "**Ignore flag** (react.dev pattern): `let ignore = false` in the effect, `ignore = true` in cleanup, check before `setState`.",
      "**AbortController** does the same and also frees the network. Combine either with debouncing.",
      "In event handlers (no effect cleanup), use a **request counter** in a `useRef` and only accept the latest id.",
      "TanStack Query avoids this by keying results by `queryKey`: an old key's data never lands in the new key."
    ],
    code: { file: "ChatRoom.jsx", lang: "jsx", src: `import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let ignore = false;
    setMessages([]);

    fetch(\`/api/rooms/\${roomId}/messages\`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setMessages(data); // only the current room wins
      });

    return () => {
      ignore = true; // roomId changed or we left: this request is stale
    };
  }, [roomId]);

  return (
    <section>
      <h2>#{roomId}</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id}><b>{m.author}:</b> {m.text}</li>
        ))}
      </ul>
    </section>
  );
}`, walk: [
      { lines: [7], note: "Each effect run gets its **own** `ignore` variable (a closure per request)." },
      { lines: [8], note: "Clear old messages so the previous room isn't shown under the new title." },
      { lines: [12, 13], note: "Before saving, check this request is still the current one." },
      { lines: [16, 17, 18], note: "When `roomId` changes, React runs this cleanup for the old run, marking its request stale." },
      { lines: [19], note: "New `roomId` → new effect run → new request with a fresh `ignore = false`." }
    ]},
    output: "Switching quickly from #general to #music always ends showing #music messages, however slow the #general request is.",
    mistakes: [
      { bad: `useEffect(() => {\n  fetch(\`/api/rooms/\${roomId}/messages\`)\n    .then(r => r.json())\n    .then(setMessages);\n}, [roomId]);`, good: `useEffect(() => {\n  let ignore = false;\n  fetch(\`/api/rooms/\${roomId}/messages\`)\n    .then(r => r.json())\n    .then(d => { if (!ignore) setMessages(d); });\n  return () => { ignore = true; };\n}, [roomId]);`, why: "With no cleanup, whichever response arrives **last** wins, not whichever was asked for last." },
      { bad: `const ignore = useRef(false);\n// shared by every request`, good: `let ignore = false; // inside the effect, one per run`, why: "A single shared flag gets reset by the next run, so the old request is no longer ignored." }
    ],
    practice: [
      { level: "B", q: "Why can request 2 finish before request 1?", a: "Each request takes its own path and time: server load, caching, payload size. Order isn't guaranteed." },
      { level: "I", q: "Rewrite the chat effect with `AbortController`.", a: "Create a controller per run, pass `signal`, abort in cleanup, ignore `AbortError`.", code: `useEffect(() => {\n  const c = new AbortController();\n  fetch(url, { signal: c.signal })\n    .then(r => r.json())\n    .then(setMessages)\n    .catch(e => { if (e.name !== 'AbortError') setError(e); });\n  return () => c.abort();\n}, [roomId]);` },
      { level: "I", q: "Fix a race in a click handler (no effect).", a: "Use a counter ref: only the latest request may set state.", code: `const latest = useRef(0);\nasync function loadPlaylist(id) {\n  const reqId = ++latest.current;\n  const data = await getPlaylist(id);\n  if (reqId === latest.current) setPlaylist(data);\n}` },
      { level: "C", q: "Does debouncing alone fix race conditions?", a: "No. It reduces how many requests fire, but two that do fire can still return out of order. Pair it with ignore/abort." }
    ],
    quiz: [
      { q: "What causes this race condition?", options: ["React renders twice", "Responses arriving in a different order from requests", "Too many `useState` calls"], answer: 1, why: "A stale, slower response lands after the newer one." },
      { q: "Where is `ignore = true` set?", options: ["Before the fetch", "In the effect's cleanup", "In the `.then`"], answer: 1, why: "Cleanup runs when the dependency changes or on unmount: exactly when the old request becomes stale." },
      { q: "Which library approach prevents it by design?", options: ["Storing results keyed by `queryKey` (TanStack Query)", "Using axios instead of fetch", "Using `async/await` instead of `.then`"], answer: 0, why: "Results are tied to their key, so old data can't overwrite the new key's data." }
    ],
    rev: {
      sec30: "Responses can come back out of order, so a stale one can overwrite fresh data. In effects, use a per-run `ignore` flag set in cleanup, or `AbortController` to cancel. In handlers, track the latest request id in a ref. Debounce reduces requests but doesn't fix order. TanStack Query keys results by `queryKey`, so it handles this for you.",
      interview: [
        { level: "basic", q: "What is a race condition in data fetching?", a: "Two requests are in flight and the older one finishes last, so the UI shows data for the wrong input." },
        { level: "intermediate", q: "How do you fix it in `useEffect`?", a: "Declare `let ignore = false`, set it to `true` in the cleanup, and only call `setState` when `!ignore`. Or abort the request in cleanup." },
        { level: "intermediate", q: "Ignore flag vs AbortController?", a: "Both stop stale updates. Abort also cancels the network request, saving bandwidth; the flag works with any promise, even non-fetch APIs." },
        { level: "advanced", q: "How do you handle it outside effects, e.g. in a click handler?", a: "Keep a counter in `useRef`; each call takes `++ref.current` and only applies its result if it still equals `ref.current`." },
        { level: "tricky", q: "Does `async/await` remove race conditions?", a: "No. It's just nicer syntax over promises; the replies can still arrive in any order." }
      ],
      predict: [
        { code: `// roomId: 'general' (800 ms) then 'music' (200 ms)\nuseEffect(() => {\n  fetch(\`/api/rooms/\${roomId}\`)\n    .then(r => r.json()).then(setRoom);\n}, [roomId]);`, answer: "Shows **general** at the end", why: "No cleanup, so the slower general response arrives last and overwrites music." }
      ],
      cheat: [
        "Responses can arrive out of order",
        "Effect: `let ignore = false` → cleanup sets `true`",
        "Check `if (!ignore)` before `setState`",
        "Or `AbortController` + `abort()` in cleanup",
        "Handlers: latest-request id in `useRef`",
        "Debounce ≠ race fix",
        "TanStack Query keys results by `queryKey`"
      ]
    },
    related: ["API-023", "HOOKS-005", "API-026", "STORE-020"]
  },
};
