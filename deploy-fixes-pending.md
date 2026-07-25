# Deploy Fixes — Pending (Phase 1: CRITICAL deploy blockers)

> **Status: NOT APPLIED.** Saved on 2026-07-25 for later use, after the deployment
> lessons of the course are complete. Making these changes early may diverge from
> the course material — apply only when you're ready.
>
> Scope here is **Phase 1 only** (deploy blockers). Phases 2 (HIGH/security) and 3
> (MEDIUM) from the cross-audit are intentionally not included.

## Repos
- **Frontend**: `home-decor-react` (this repo)
- **Backend**: `../home-decors.myresourse/home-decor`

## Decisions already made
- **Production origins**: undecided → use the **cross-origin-safe** cookie config
  (works for both same-origin and cross-origin). It requires the production backend
  to be served over **HTTPS**, otherwise a `Secure` cookie is silently dropped.
- **Frontend host**: Nginx / other static → SPA fallback provided as a documented
  `deploy/nginx.conf.example` snippet (do NOT edit a live server from the repo).
- **`.env.production`**: real backend HTTPS URL still unknown → use a placeholder
  and fill it in manually before building for production.

## Open question to resolve before applying
- The backend currently sets `NODE_ENV` nowhere. The secure-cookie branch below is
  gated on `process.env.NODE_ENV === "production"`, so production **must** be started
  with `NODE_ENV=production`. Alternative: use a dedicated `COOKIE_SECURE=true` flag
  instead. Pick one before applying.

---

## Fix C1 — Auth cookie survives cross-origin production

### C1a. `home-decor/src/controllers/member.controller.ts`

Keep `httpOnly: false` — the frontend reads the cookie with `universal-cookie`
(`src/app/context/ContextProvider.tsx:8`). Flipping it to `true` silently breaks
auth detection.

**login (currently lines 45–48):**
```ts
res.cookie("accessToken", token, {
  maxAge: AUTH_TIMER * 3600 * 1000,
  httpOnly: false,
});
```
**→ replace with:**
```ts
const isProd = process.env.NODE_ENV === "production";
res.cookie("accessToken", token, {
  maxAge: AUTH_TIMER * 3600 * 1000,
  httpOnly: false,               // FE reads it with universal-cookie
  sameSite: isProd ? "none" : "lax",
  secure: isProd,                // "none" REQUIRES secure (HTTPS)
  path: "/",
});
```

**signup (currently lines 67–70):** apply the identical block as login.

**logout (currently line 84):**
```ts
res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
```
**→ replace with** (attributes MUST match login/signup exactly, or the clear fails
silently and the user can't log out):
```ts
const isProd = process.env.NODE_ENV === "production";
res.clearCookie("accessToken", {
  httpOnly: false,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  path: "/",
});
```

### C1b. `home-decor/src/app.ts`

Required when the production backend runs behind a TLS proxy (Nginx, Render, Heroku),
otherwise `secure` cookies are dropped. Add right after `const app = express();`:
```ts
app.set("trust proxy", 1);
```

**Dev behavior:** with `NODE_ENV` unset, cookies stay `sameSite:"lax"` + non-secure,
so `npm run start:dev` against localhost behaves exactly as today.

---

## Fix C2 — Frontend `.env.production` (no more baked-in localhost)

CRA inlines `REACT_APP_API_URL` at build time; today only `.env`
(`REACT_APP_API_URL=http://localhost:3005`) exists, so a production build ships
pointing at localhost. `src/lib/config.ts:1` already reads it correctly.

**Create `home-decor-react/.env.production`:**
```
REACT_APP_API_URL=https://REPLACE_WITH_YOUR_API_HOST
```
- Must be **HTTPS** (mixed content is blocked from an HTTPS page, and `Secure`
  cookies won't flow over HTTP).
- Do NOT ship the old `http://45.13.132.208:3003` fallback (HTTP + raw IP).

---

## Fix C3 — SPA deep-link rewrite (Nginx)

`BrowserRouter` (react-router v5) + no rewrite config means refreshing `/orders`,
`/products`, etc. returns 404 on a static host.

**Create `home-decor-react/deploy/nginx.conf.example`** (reference only — apply on the
server, do not run from the repo):
```nginx
server {
    listen 80;
    server_name your-frontend-domain;
    root /var/www/home-decor-react/build;   # CRA build output
    index index.html;

    # Hashed static assets: long-lived, immutable
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # index.html must NOT be cached (avoids stale bundle after deploys)
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # SPA fallback: every unknown path serves index.html
    location / {
        try_files $uri /index.html;
    }
}
```

---

## Verification to run AFTER applying (not now)
- Backend: `npx tsc --noEmit` (from `home-decor/`) must pass.
- Frontend: `npx tsc --noEmit` and `npm run build` (from `home-decor-react/`) must pass.

## Manual steps (host side, outside the code)
1. Fill the real HTTPS backend URL into `.env.production`.
2. Start the backend with `NODE_ENV=production` (or switch to the `COOKIE_SECURE` flag).
3. Ensure the production backend is served over HTTPS.
4. Apply the Nginx config on the server.

## Smoke test after deploy
- Login → devtools shows `accessToken` cookie with `SameSite=None; Secure`.
- An authed request (`GET /order/all`) succeeds cross-origin.
- Refresh on `/orders` does not 404.
- Logout clears the `accessToken` cookie + `localStorage.memberData` + Redux auth state.

---

## Still pending from the cross-audit (NOT in this file)
- **Phase 2 (HIGH):** CORS allowlist, axios 401 interceptor, strip password/member
  `console.log`s, helmet + rate limiting, multer `limits`/`fileFilter`.
- **Phase 3 (MEDIUM):** gate redux-logger to dev, `Cache-Control: no-store` on authed
  responses, backend `start` → `node dist/server.js`, session `resave`/
  `saveUninitialized:false` + store error handler, read `AUTH_TIMER` from env,
  `.env.example` updates.
- **Follow-up (architecture, propose first):** `httpOnly:true` + `/member/me`,
  uploads → S3/Cloudinary, remove `mongodb@3`, bump `jsonwebtoken` → v9, MUI v4→v5.
