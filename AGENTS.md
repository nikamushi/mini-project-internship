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

---

# Engineering & Design Workflow (ECC + Impeccable)

This project runs ECC (Everything Claude Code) + Impeccable integrated with OpenCode.
ECC handles the engineering system; Impeccable is the design/UX specialist.
Never use both systems redundantly on the same concern.

## Tool Responsibilities

**ECC** — planning, architecture, implementation, testing, debugging, code review,
verification, security, maintainability. Entry points: `/plan`, `/tdd`, `/code-review`,
`/security`, `/build-fix`, `/e2e`, `/verify`, `/refactor-clean`, `/orchestrate`.

**Impeccable** — visual design, UX critique, typography, spacing, color, responsive
design, interaction, animation, accessibility, visual polish. Entry point:
`/impeccable <command> <target>` (e.g. `/impeccable audit`, `/impeccable critique`,
`/impeccable polish`, `/impeccable typeset`, `/impeccable layout`, `/impeccable init`).

## Engineering Workflow (complex tasks)

1. Understand — read the relevant `docs/Task*.md`, `docs/API.md`, `docs/Database.md`,
   `docs/Architecture.md` before writing any code. Never code before understanding
   architecture and requirements.
2. Plan — for large changes, write an implementation plan first (use `/plan`).
3. Implement
4. Test
5. Review — self-review from a fresh context (use `/code-review`, `/security`)
6. Verify — run typecheck/lint/tests/build (`/verify`); fix errors before declaring done.

## Frontend Workflow (UI tasks)

1. Inspect existing UI
2. Understand the design system (tokens, `DESIGN.md` / `PRODUCT.md` if present)
3. Identify reusable components
4. Implement
5. Run the application
6. Inspect the result
7. Use Impeccable for visual/UX audit (`/impeccable audit <target>`, `/impeccable critique`)
8. Polish (`/impeccable polish`)
9. Test responsive behavior (`/impeccable adapt`)
10. Verify accessibility (semantic HTML, contrast, keyboard, focus)
11. Final code review (ECC)

## Default Frontend Task Workflow

```text
Requirement
    ↓
ECC Planning
    ↓
Architecture / component plan
    ↓
Implementation
    ↓
Run + Test
    ↓
Impeccable UI audit
    ↓
Visual / UX improvements
    ↓
Responsive verification
    ↓
Accessibility verification
    ↓
ECC code review
    ↓
Final verification
```

## Before Any Frontend Task (inspect first)

- project structure
- framework
- styling system
- component library
- existing design tokens
- existing patterns
- relevant reusable components

Do NOT switch the framework or component library already in use without a strong reason.

## Design Principles

- Use Impeccable as the design/UX specialist.
- Do NOT produce generic AI-generated dashboard UI.
- Prioritize: visual hierarchy, typography, spacing, color system, contrast,
  responsive layout, interaction states, accessibility, consistency,
  loading/error/empty states, appropriate animation, component reuse.
- Do NOT add gradients, glassmorphism, excessive rounded cards, excessive shadows,
  or decorative elements just because they look "AI-like".
- Use design tokens and reusable components.

## Engineering Principles

- TypeScript
- component reuse
- maintainability
- accessibility
- responsive design
- performance
- semantic HTML
- clean architecture
- minimal duplication

Do not create oversized components when they can be reasonably split.
Do not create abstraction for abstraction's sake.

## Verification Checklist (after implementation)

- run typecheck
- run lint
- run tests
- run build if available
- verify responsive behavior
- verify accessibility
- inspect visual result when browser tooling is available

Fix any errors before declaring the task done.
