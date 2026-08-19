# Everything Claude Code (ECC) — Agent Instructions

This is a **production-ready AI coding plugin** providing 67 specialized agents, 281 skills, 94 commands, and automated hook workflows for software development.

**Version:** 2.1.0

## Core Principles

1. **Agent-First** — Delegate to specialized agents for domain tasks
2. **Test-Driven** — Write tests before implementation, 80%+ coverage required
3. **Security-First** — Never compromise on security; validate all inputs
4. **Immutability** — Always create new objects, never mutate existing ones
5. **Plan Before Execute** — Plan complex features before writing code

## Available Agents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design and scalability | Architectural decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code quality and maintainability | After writing/modifying code |
| security-reviewer | Vulnerability detection | Before commits, sensitive code |
| spec-miner | Brownfield spec extraction | Onboarding brownfield projects to spec-driven development |
| build-error-resolver | Fix build/type errors | When build fails |
| e2e-runner | End-to-end Playwright testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| doc-updater | Documentation and codemaps | Updating docs |
| cpp-reviewer | C/C++ code review | C and C++ projects |
| cpp-build-resolver | C/C++ build errors | C and C++ build failures |
| fsharp-reviewer | F# functional code review | F# projects |
| docs-lookup | Documentation lookup via Context7 | API/docs questions |
| go-reviewer | Go code review | Go projects |
| go-build-resolver | Go build errors | Go build failures |
| kotlin-reviewer | Kotlin code review | Kotlin/Android/KMP projects |
| kotlin-build-resolver | Kotlin/Gradle build errors | Kotlin build failures |
| database-reviewer | PostgreSQL/Supabase specialist | Schema design, query optimization |
| python-reviewer | Python code review | Python projects |
| django-reviewer | Django code review | Django apps, DRF APIs, ORM, migrations |
| django-build-resolver | Django build, migration, and setup errors | Django startup, dependency, migration, collectstatic failures |
| java-reviewer | Java and Spring Boot code review | Java/Spring Boot projects |
| java-build-resolver | Java/Maven/Gradle build errors | Java build failures |
| loop-operator | Autonomous loop execution | Run loops safely, monitor stalls, intervene |
| harness-optimizer | Harness config tuning | Reliability, cost, throughput |
| rust-reviewer | Rust code review | Rust projects |
| rust-build-resolver | Rust build errors | Rust build failures |
| pytorch-build-resolver | PyTorch runtime/CUDA/training errors | PyTorch build/training failures |
| mle-reviewer | Production ML pipeline review | ML pipelines, evals, serving, monitoring, rollback |
| typescript-reviewer | TypeScript/JavaScript code review | TypeScript/JavaScript projects |

## Agent Orchestration

Use agents proactively without user prompt:
- Complex feature requests → **planner**
- Code just written/modified → **code-reviewer**
- Bug fix or new feature → **tdd-guide**
- Architectural decision → **architect**
- Security-sensitive code → **security-reviewer**
- Brownfield project onboarding → **spec-miner**
- Autonomous loops / loop monitoring → **loop-operator**
- Harness config reliability and cost → **harness-optimizer**

Use parallel execution for independent operations — launch multiple agents simultaneously.

## Security Guidelines

**Before ANY commit:**
- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints
- Error messages don't leak sensitive data

**Secret management:** NEVER hardcode secrets. Use environment variables or a secret manager. Validate required secrets at startup. Rotate any exposed secrets immediately.

**If security issue found:** STOP → use security-reviewer agent → fix CRITICAL issues → rotate exposed secrets → review codebase for similar issues.

## Coding Style

**Immutability (CRITICAL):** Always create new objects, never mutate. Return new copies with changes applied.

**File organization:** Many small files over few large ones. 200-400 lines typical, 800 max. Organize by feature/domain, not by type. High cohesion, low coupling.

**Error handling:** Handle errors at every level. Provide user-friendly messages in UI code. Log detailed context server-side. Never silently swallow errors.

**Input validation:** Validate all user input at system boundaries. Use schema-based validation. Fail fast with clear messages. Never trust external data.

**Code quality checklist:**
- Functions small (<50 lines), files focused (<800 lines)
- No deep nesting (>4 levels)
- Proper error handling, no hardcoded values
- Readable, well-named identifiers

## Testing Requirements

**Minimum coverage: 80%**

Test types (all required):
1. **Unit tests** — Individual functions, utilities, components
2. **Integration tests** — API endpoints, database operations
3. **E2E tests** — Critical user flows

**TDD workflow (mandatory):**
1. Write test first (RED) — test should FAIL
2. Write minimal implementation (GREEN) — test should PASS
3. Refactor (IMPROVE) — verify coverage 80%+

Troubleshoot failures: check test isolation → verify mocks → fix implementation (not tests, unless tests are wrong).

## Development Workflow

1. **Plan** — Use planner agent, identify dependencies and risks, break into phases
2. **TDD** — Use tdd-guide agent, write tests first, implement, refactor
3. **Review** — Use code-reviewer agent immediately, address CRITICAL/HIGH issues
4. **Capture knowledge in the right place**
   - Personal debugging notes, preferences, and temporary context → auto memory
   - Team/project knowledge (architecture decisions, API changes, runbooks) → the project's existing docs structure
   - If the current task already produces the relevant docs or code comments, do not duplicate the same information elsewhere
   - If there is no obvious project doc location, ask before creating a new top-level file
5. **Session logging (MANDATORY)** — Di akhir setiap sesi, jalankan `/session-log` atau pastikan hook menulis stub ke `90-System/Session-Logs/` di vault Obsidian (lihat skill `session-logging`). Jangan pernah menimpa session log yang ada.
6. **Commit** — Conventional commits format, comprehensive PR summaries

## Workflow Surface Policy

- `skills/` is the canonical workflow surface.
- New workflow contributions should land in `skills/` first.
- `commands/` is a legacy slash-entry compatibility surface and should only be added or updated when a shim is still required for migration or cross-harness parity.

## Git Workflow

**Commit format:** `<type>: <description>` — Types: feat, fix, refactor, docs, test, chore, perf, ci

**PR workflow:** Analyze full commit history → draft comprehensive summary → include test plan → push with `-u` flag.

## Architecture Patterns

**API response format:** Consistent envelope with success indicator, data payload, error message, and pagination metadata.

**Repository pattern:** Encapsulate data access behind standard interface (findAll, findById, create, update, delete). Business logic depends on abstract interface, not storage mechanism.

**Skeleton projects:** Search for battle-tested templates, evaluate with parallel agents (security, extensibility, relevance), clone best match, iterate within proven structure.

## Performance

**Context management:** Avoid last 20% of context window for large refactoring and multi-file features. Lower-sensitivity tasks (single edits, docs, simple fixes) tolerate higher utilization.

**Build troubleshooting:** Use build-error-resolver agent → analyze errors → fix incrementally → verify after each fix.

## Project Structure

```
agents/          — 67 specialized subagents
skills/          — 281 workflow skills and domain knowledge
commands/        — 94 slash commands
hooks/           — Trigger-based automations
rules/           — Always-follow guidelines (common + per-language)
scripts/         — Cross-platform Node.js utilities
mcp-configs/     — 14 MCP server configurations
tests/           — Test suite
```

`commands/` remains in the repo for compatibility, but the long-term direction is skills-first.

## Success Metrics

- All tests pass with 80%+ coverage
- No security vulnerabilities
- Code is readable and maintainable
- Performance is acceptable
- User requirements are met

---

# Project Context

## Stack

- **Monorepo:** pnpm workspaces (`apps/*`), package manager pnpm
- **Backend:** Node.js, TypeScript, Express, Prisma ORM, SQLite
- **Frontend:** React 19, Vite, TypeScript, React Router, React Query
- **Auth:** JWT in httpOnly cookies (+ Bearer fallback)
- **Testing:** Vitest (54 backend tests)
- **Docs:** 10 spec documents in `docs/` (PRD, Architecture, Database, API, Design, DesignSystem, UserFlow, TaskFrontend, TaskBackend, TaskQA)

## Commands

```bash
# Semua perintah dijalankan dari root (monorepo)
pnpm install          # install semua workspace dependencies
pnpm dev              # jalankan api + web sekaligus (parallel)
pnpm dev:api          # backend aja (apps/api, port 3000)
pnpm dev:web          # frontend aja (apps/web, port 5173)
pnpm build            # build semua workspace
pnpm test             # test semua workspace
pnpm lint             # lint semua workspace
pnpm typecheck        # typecheck semua workspace

# Per-command untuk package tertentu
pnpm --filter @laf/api run <script>   # contoh: pnpm --filter @laf/api build
pnpm --filter @laf/web run <script>

# Database (dijalankan dari root)
pnpm db:migrate       # prisma migrate dev
pnpm db:seed          # prisma db seed
pnpm db:reset         # reset database + seed

# Script yang tersedia di @laf/api:
# dev, build, start, typecheck, lint, format, prisma:generate, prisma:migrate, prisma:deploy, db:seed, db:reset, test
# Script yang tersedia di @laf/web:
# dev, build, lint, format, typecheck, preview
```

## Structure

```
mini-project-internship/
├── apps/                    # Aplikasi deployable (monorepo)
│   ├── api/                 # Backend (@laf/api)
│   │   ├── prisma/          # schema.prisma, seed.ts, migrations/
│   │   ├── src/
│   │   │   ├── controllers/ # 7 controllers (NO business logic)
│   │   │   ├── services/    # 8 services (ALL business rules here)
│   │   │   ├── repositories/# 6 repositories (data access)
│   │   │   ├── middlewares/ # auth, role, error, upload
│   │   │   ├── validators/  # auth, report, category, claim
│   │   │   ├── routes/      # 6 route files
│   │   │   ├── utils/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── tests/           # Vitest integration tests (54)
│   │   ├── uploads/reports/ # Uploaded images
│   │   └── data/database.sqlite
│   └── web/                 # Frontend (@laf/web, React + Vite)
│       ├── src/
│       │   ├── components/  # 20+ reusable UI components
│       │   ├── pages/       # 20+ page components
│       │   ├── services/    # 8 API service modules
│       │   ├── api/         # API client + types (types.ts)
│       │   ├── hooks/
│       │   ├── auth/
│       │   ├── app/
│       │   └── utils/
│       └── index.html
├── packages/                # (kosong) reserved untuk shared libs
├── docs/                    # 10 spec documents (SOURCE OF TRUTH)
│   ├── PRD.md               # Product requirements
│   ├── Architecture.md      # Layer patterns, tech decisions
│   ├── Database.md          # Schema, models, relations
│   ├── API.md               # Endpoint contracts
│   ├── Design.md            # UI/UX design
│   ├── DesignSystem.md      # Tokens, colors, typography
│   ├── UserFlow.md          # User journeys
│   ├── TaskFrontend.md      # Frontend task breakdown
│   ├── TaskBackend.md       # Backend task breakdown
│   └── TaskQA.md            # QA test plan
├── pnpm-workspace.yaml      # Workspace definition
├── package.json             # Root workspace scripts
└── AGENTS.md                # This file
```

## Konvensi Penting

- **docs/ is source of truth.** Doc hierarchy: `PRD → Design → DesignSystem → Architecture → Database → API → UserFlow → Task*`
- **Controller → Service → Repository.** Controllers handle request/response only. All business logic in Service layer.
- **Claim rules:** Only on `FOUND` + `ACTIVE` reports. Claimant != reporter. No duplicate active claims.
- **Status transitions are guarded.** Backend rejects invalid transitions.
- **Transactions required** for: approve/reject claim, approve/reject report.
- **Soft delete** for reports (`deleted_at`), **deactivate** for categories (`is_active = false`).
- **Auth identity** from session/token, never from request body.
- **API response format:** `{ success, data, meta? }` / `{ success: false, message, errors }`
- **SQLite:** booleans as INTEGER (0/1), timestamps as ISO 8601 TEXT, autoincrement IDs.
- **Known doc conflict:** `API.md` says PostgreSQL; actual is SQLite (Architecture.md wins).
- **No hardcoded secrets.** Use `.env` for all sensitive config.
