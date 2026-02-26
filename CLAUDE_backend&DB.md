# CLAUDE_backend&DB.md — Backend & Database Development Standards & Guidelines

## Always review this file before doing any backend or database task and review + Invoke the right skills for each task

This file governs how Claude writes, structures, and reviews backend and database code in this project.
Follow every rule here unless explicitly overridden in a specific prompt.

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