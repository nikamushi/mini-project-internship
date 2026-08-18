# AGENTS.md

## Project Status

Pre-code. Only `docs/` exists — no source code, no `package.json`, no config. All specs are in `docs/`.

## What This Is

Campus lost-and-found management system (Indonesian UI). Web app with separate frontend and backend. Two roles: `USER` and `ADMIN`.

## How to Work

All implementation comes from `docs/`. Before writing any code:
1. Read the relevant `docs/Task*.md` for your task.
2. Cross-reference `docs/API.md` for endpoint contracts, `docs/Database.md` for schema, `docs/Architecture.md` for layer rules.
3. Follow the development order — don't skip ahead.

If two docs disagree, the hierarchy wins: `PRD → Design → DesignSystem → Architecture → Database → API → UserFlow → Task*`.

## Tech Stack (from `Architecture.md` / `TaskBackend.md`)

- **Backend:** Node.js, TypeScript, REST API, Prisma ORM, SQLite
- **Frontend:** TBD during project setup (see `TaskFrontend.md` FE-001)
- **Database file:** `backend/data/database.sqlite`
- **Prisma schema:** `backend/prisma/schema.prisma`
- **File storage:** Local `backend/uploads/reports/` for MVP

## Architecture Pattern

```
Controller → Service → Repository → Prisma → SQLite
```

Controllers must NOT contain business logic. All business rules live in the Service layer.

## Doc Hierarchy (source of truth order)

```
PRD → Design → DesignSystem → Architecture → Database → API → UserFlow → TaskFrontend/TaskBackend/TaskQA
```

If docs conflict, the higher doc wins. Always check this chain before inventing behavior.

## Critical Business Rules

- **Claim rules:** Only on `FOUND` + `ACTIVE` reports. Claimant must not be the reporter. No duplicate active claims per user per report. All enforced server-side.
- **Status transitions are guarded.** Invalid transitions (e.g. `COMPLETED → ACTIVE`) must be rejected by the backend.
- **Transactions required** for: approve/reject claim, approve/reject report, any multi-table mutation.
- **Soft delete** for reports (`deleted_at`), not hard delete.
- **Categories** are deactivated (`is_active = false`), not deleted, when in use.
- **Auth identity** comes from session/token, never from request body.

## Backend Development Order

Follow this sequence from `TaskBackend.md`:
1. Project setup → 2. DB setup → 3. Prisma schema → 4. Migration → 5. Seed → 6. Auth → 7. Authorization → 8. Categories → 9. Reports → 10. Image upload → 11. Claims → 12. Notifications → 13. Activity log → 14. Dashboard → 15. Error handling → 16. Security → 17. Testing → 18. API docs

## API Response Format

```json
// Success
{ "success": true, "data": {} }

// List
{ "success": true, "data": [], "meta": { "page", "limit", "total", "totalPages" } }

// Error
{ "success": false, "message": "...", "errors": [] }
```

## Known Doc Conflicts

- `API.md` line 10 says **PostgreSQL**; `Architecture.md` line 8 and `TaskBackend.md` say **SQLite**. Per hierarchy, **SQLite wins**. If you see PostgreSQL references in API examples, treat them as stale — the actual DB is SQLite.

## Key Conventions

- **SQLite booleans:** `INTEGER` (0/1), mapped by Prisma
- **Timestamps:** ISO 8601 UTC, stored as `TEXT`
- **IDs:** `INTEGER PRIMARY KEY AUTOINCREMENT` (follow Prisma schema)
- **Pagination:** `?page=1&limit=20` with max limit enforced server-side
- **Sorting default:** `createdAt DESC`
- **File upload validation:** MIME type + size + signature, not just extension
- **No secrets in code:** use `.env`, never hardcode

## Seed Data

- Admin: `admin@example.com`
- User: `user@example.com`
- Default categories: Elektronik, Dokumen, Pakaian, Aksesori, Buku, Lainnya
- Development passwords only for local use

## Before Implementing

1. Read the relevant `docs/Task*.md` file for your task
2. Check `docs/API.md` for the exact endpoint contract
3. Check `docs/Database.md` for the exact schema
4. Check `docs/Architecture.md` for the layer pattern
5. Follow the implementation order — don't skip ahead

**Remember:** The `docs/` folder is the single source of truth. When in doubt, check the docs before guessing.
