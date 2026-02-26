# CLAUDE.md — Development Standards & Guidelines

## Always review this file before doing any task and review + Invoke the right skills for each task

This file governs how Claude writes, structures, and reviews code in this project.
Follow every rule here unless explicitly overridden in a specific prompt.

---

## 🔐 SECURITY — NON-NEGOTIABLE RULES

### Secrets & Credentials
- **NEVER hard-code API keys, secrets, tokens, passwords, or connection strings** in any file.
- All secrets must come from environment variables: `process.env.VARIABLE_NAME` (Node) or `os.environ.get("VAR")` (Python).
- Always provide a `.env.example` file with placeholder values (e.g., `DATABASE_URL=your_database_url_here`).
- Always add `.env` and `.env.local` to `.gitignore` — never commit real env files.
- When referencing secrets in code comments or docs, use `<REDACTED>` or placeholder names only.

### Authentication & Authorization
- Never roll your own auth — use established libraries (NextAuth, Clerk, Supabase Auth, Passport.js).
- Always validate and verify JWTs server-side. Never trust client-supplied user IDs.
- Apply the principle of least privilege: users only access what they own.
- Protect all sensitive routes with middleware-level auth checks, not just UI guards.

### Input Validation
- Validate and sanitize **all** user input on the **server side**, regardless of client-side validation.
- Use schema validation libraries: `zod` (TypeScript), `joi`, or `pydantic` (Python).
- Never interpolate user input directly into SQL queries — always use parameterized queries or an ORM.
- Sanitize HTML output to prevent XSS. Use libraries like `DOMPurify` for any rendered HTML.

---

## 🖥️ FRONTEND (React / Next.js)

### Stack Defaults
- **UI components**: shadcn/ui
- **Icons**: Lucide Icons
- **Styling**: Tailwind CSS (utility classes only, no inline styles unless necessary)
- **State**: React hooks (`useState`, `useReducer`) for local; Zustand or React Context for shared state.
- **Forms**: React Hook Form + Zod for validation.

### Code Standards
- Use TypeScript. Every component, function, and API call must be typed — no `any`.
- Keep components small and single-responsibility. Split if a component exceeds ~150 lines.
- Use named exports for components, default exports only for pages.
- No sensitive logic or secrets in client-side code — ever. Assume all frontend code is public.
- Avoid `useEffect` for data fetching — prefer server components or React Query / SWR.
- Always handle loading, error, and empty states in UI components.

### Performance
- Lazy load routes and heavy components with `React.lazy` / `next/dynamic`.
- Optimize images using `next/image` or equivalent.
- Avoid unnecessary re-renders: memoize with `useMemo` / `useCallback` where it makes a measurable difference.

---

## ⚙️ BACKEND (Node.js / Next.js API Routes / Express)

### API Design
- Follow RESTful conventions: proper HTTP methods (GET, POST, PUT, PATCH, DELETE) and status codes.
- Always return consistent JSON response shapes:
  ```json
  { "data": {}, "error": null }
  { "data": null, "error": "Descriptive message" }
  ```
- Version APIs if breaking changes are possible: `/api/v1/...`
- Rate-limit public endpoints to prevent abuse (use `upstash/ratelimit` or similar).

### Security Practices
- Set security HTTP headers using `helmet` (Express) or middleware in Next.js.
- Enable CORS only for allowed origins — never use wildcard `*` in production.
- Validate request body, query params, and headers with Zod before processing.
- Log errors server-side but never expose stack traces or internal details to the client.
- Use HTTPS everywhere. Never serve sensitive data over HTTP.

### Error Handling
- Wrap all async route handlers in try/catch or use a global error handler.
- Distinguish between operational errors (400/404) and programmer errors (500).
- Never swallow errors silently — always log them.

---

## 🗄️ DATABASE

### General Rules
- **Never write raw SQL with string interpolation.** Use an ORM (Prisma, Drizzle) or parameterized queries.
- Always use migrations for schema changes — never modify the DB schema manually in production.
- Add indexes on columns used in WHERE clauses and foreign keys.
- Use UUIDs or cuid2 for primary keys instead of sequential integers where applicable.

### Connection & Config
- Database connection strings live in environment variables only.
- Use connection pooling (PgBouncer, Prisma's connection pool) for production workloads.
- Set query timeouts to prevent runaway queries from blocking the app.
- Never connect to the production database from local dev — use a separate dev/staging DB.

### Data Hygiene
- Use `soft deletes` (e.g., `deleted_at` timestamp) for user-facing data unless hard delete is explicitly required.
- Store timestamps in UTC always.
- Encrypt sensitive PII fields at rest (e.g., using column-level encryption or a secrets vault).
- Never log sensitive data (passwords, tokens, full credit card numbers, etc.).

---

## 📁 PROJECT STRUCTURE

```
/
├── .env.example          # Template — committed to git
├── .env.local            # Real secrets — NEVER committed
├── .gitignore            # Must include .env, .env.local, node_modules
├── src/
│   ├── app/              # Next.js app router pages & layouts
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions, helpers, config
│   ├── hooks/            # Custom React hooks
│   ├── server/           # Server-only logic (DB queries, services)
│   ├── types/            # Shared TypeScript types & interfaces
│   └── validations/      # Zod schemas
├── prisma/               # DB schema & migrations (if using Prisma)
└── public/               # Static assets
```

- Keep `server/` strictly server-side — never import from it in client components.
- Co-locate tests with the files they test (`Component.test.tsx` next to `Component.tsx`).

---

## ✅ CODE QUALITY

### General
- Write self-documenting code. Add comments only to explain *why*, not *what*.
- Follow DRY (Don't Repeat Yourself) — extract repeated logic into reusable functions.
- Prefer explicit over implicit: clear variable names, no magic numbers/strings (use constants).
- Every function should do one thing. If it needs a long comment to explain it, refactor it.

### TypeScript
- Enable strict mode in `tsconfig.json`.
- No `@ts-ignore` unless absolutely unavoidable — add a comment explaining why.
- Define interfaces/types for all API request/response shapes.

### Git
- Never commit directly to `main`. Use feature branches.
- Write meaningful commit messages: `feat:`, `fix:`, `chore:`, `refactor:` prefixes.
- Never commit commented-out code, console.logs, or debug artifacts.

---

## 🚫 THINGS CLAUDE MUST NEVER DO

| Rule | Reason |
|------|--------|
| Hard-code any secret, key, or credential | Security breach risk |
| Use `any` type in TypeScript | Defeats type safety |
| Interpolate user input into SQL | SQL injection |
| Expose error stack traces to client | Information disclosure |
| Commit `.env` files | Credential leak |
| Skip input validation on server | Untrusted client data |
| Use `eval()` or `new Function()` | Code injection |
| Store passwords in plain text | Critical security failure |
| Wildcard CORS in production | Unauthorized cross-origin access |
| Disable SSL/TLS verification | Man-in-the-middle attacks |

---

## 📋 CHECKLIST BEFORE MARKING A TASK COMPLETE

- [ ] No secrets or keys hard-coded anywhere
- [ ] All inputs validated with Zod (or equivalent) on the server
- [ ] TypeScript types defined for all new data shapes
- [ ] Loading, error, and empty states handled in UI
- [ ] No `console.log` left in production code
- [ ] `.env.example` updated if new env vars were added
- [ ] No `any` types introduced
- [ ] Database queries use ORM or parameterized queries
- [ ] Auth checks in place for all protected routes
