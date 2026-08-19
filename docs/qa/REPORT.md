# Laporan QA — Core QA (Opsi 1)

- **Tanggal:** 19 Agustus 2026
- **Scope:** TaskQA.md opsi 1 (Core QA): setup, migrasi/seed, test suite yang ada, static checks, smoke test live, contract review API/Database/Architecture/PRD. Tanpa infrastruktur E2E baru.
- **Status keseluruhan:** ✅ **LULUS (Core)** — 3 bug CRITICAL kontrak FE↔BE (BUG-003/004/005) + search admin (BUG-006) sudah diperbaiki dan diverifikasi live (regression gate QA-110: P0 = 100% PASS). Sisa open hanya MINOR/TRIVIAL/doc-fix + GAP PRD yang butuh keputusan stakeholder.

## Ringkasan Eksekutif

| Area | Hasil |
|---|---|
| Setup & tooling (QA-001) | ✅ PASS — npm install api+frontend, .env dibuat, dev server jalan |
| Database (QA-002/003, QA-104) | ✅ PASS — 7 tabel, FK, 24 index, seed 2 user/6 kategori/3 report, idempotent |
| Test suite backend (BE-054..BE-058) | ✅ PASS — 54/54 vitest |
| Static checks (QA-006..) | ✅ PASS — typecheck + lint api & frontend, build frontend OK |
| Smoke test live API (QA-100/101/102 core) | ✅ PASS — health, login, me, kategori, list report, register, create→approve→notif, claim→approve→CLAIMED, notif, activity log, dashboard, FE proxy |
| Contract API vs implementasi (QA-103) | ✅ **PASS (setelah fix)** — BUG-003..006 diperbaiki & diverifikasi live (awalnya FAIL) |
| Contract Database (QA-104) | ✅ PASS — sangat faithful; deviasi kecil hanya teknis SQLite/Prisma (BUG-017) |
| Architecture compliance (QA-105) | ✅ PASS — Controller→Service→Repository konsisten, business logic di service, transaksi dipakai |
| PRD compliance (QA-106) | ⚠️ GAP — Matching tidak ada, field `characteristics`/`condition` tidak ada, status flow disederhanakan (lihat bagian GAP) |

## 1. Hasil per Area

### 1.1 Setup & Database
- `npm install` api (328 pkg) & frontend (194 pkg) OK; `api/.env` (JWT_SECRET random) & `frontend/.env` (VITE_API_URL=/api) dibuat; `api/data/` dibuat.
- `npm run db:reset` OK setelah fix BUG-001 (seed.ts kurang import dotenv). Migrasi `20260818093741_init` diterapkan. Re-seed tidak membuat duplikat.
- Verifikasi schema (via prisma script): 7 tabel, FK di 5 tabel, 24 index, kolom & constraint sesuai Database.md. Tidak ada kolom hilang/lebih.

### 1.2 Test Suite & Static Checks
- `npm test` (api): **54/54 PASS** — mencakup auth, kategori, report, claim, notifikasi, dashboard, validasi, aturan bisnis (self-claim, duplikat claim, transisi status, visibilitas).
- Typecheck: api ✅ frontend ✅. Lint: api ✅ frontend ✅. Build frontend ✅ (warning chunk > 500 kB — BUG-018).
- Catatan: tes backend mengetes kode backend — kontrak FE↔BE tidak ter-cover karena FE tidak punya tes (ekspektasi opsi 1, tercatat sebagai gap QA).

### 1.3 Smoke Test Live (API E2E mini)
Backend (port 3000) + frontend (port 5173) dijalankan; hasil:
- `GET /api/health` → `{"success":true,"data":{"status":"ok"}}`
- Login admin/user → 200; `GET /api/auth/me` → `data.user{id,name,email,role}` (password_hash tidak bocor)
- `GET /api/categories` → 6 kategori; `GET /api/reports` → meta total 2 (3 seed; 1 PENDING tersembunyi — sesuai aturan visibilitas, PASS)
- Register user → login → create report (format waktu harus `Z` UTC, sesuai validator zod & contract ISO 8601) → `PENDING_VERIFICATION` → approve admin → `ACTIVE` → notifikasi `REPORT_APPROVED` diterima reporter
- Create FOUND report → approve → claim oleh user lain → `PENDING` → approve admin → claim `APPROVED` → report `CLAIMED` → notifikasi `CLAIM_APPROVED` ke claimant
- Activity logs: USER_LOGIN, CLAIM_CREATED, CLAIM_APPROVED tercatat
- Dashboard admin: total 3 report (2 aktif), pendingVerification 1, lost 2/found 1, pendingClaims 0, totalUsers 3
- Frontend: index 200, `#root` ada, proxy Vite `/api` → backend berfungsi

### 1.4 Contract Review — API.md vs Implementasi (QA-103) — PASS (setelah fix BUG-003..006)
Poin yang MATCH (diuji & diverifikasi kode):
- Envelope sukses/error/list+meta; default & cap pagination (20, max 100)
- Status code: register 201, login 200, logout 204, me 200, login gagal 401 `INVALID_CREDENTIALS`
- Aturan claim (FOUND+ACTIVE, bukan reporter, tanpa duplikat) → 409; guard transisi status → 409 `INVALID_STATUS_TRANSITION`; soft delete user; visibilitas list publik; upload (MIME jpeg/png/webp, 5 MB, max 5); rate limit login/register + mutasi; CORS whitelist; X-Request-ID
- Semua endpoint admin di belakang `requireAuth + requireRole("ADMIN")`

Mismatch yang ditemukan → lihat **BUGS.md** (BUG-003..016). Ringkasan:

| # | Area | Masalah | Status |
|---|---|---|---|
| BUG-003 | Report contract | FE kirim/read `title`/`eventAt`, BE require/return `itemName`/`occurredAt` → **create report 422, list/detail judul kosong** | **FIXED** (source of truth = Database.md + BE; FE disamakan) |
| BUG-004 | Claim contract | FE kirim `description`, BE require `reason` → **submit klaim 422** | **FIXED** |
| BUG-005 | Notification contract | FE expect `referenceType`/`referenceId`/`readAt`, BE return `isRead` tanpa reference → **pusat notifikasi rusak** | **FIXED** (FE adaptasi ke `isRead`, tanpa navigasi) |
| BUG-006 | Admin search | FE kirim `search`, BE baca `q` → **search admin diam-diam tidak berfungsi** | **FIXED** |
| BUG-007..016 | Detail | lihat BUGS.md | 007..014 open, 015/016 open (doc/keputusan), 017 info, 020 FIXED |

Catatan API.md line 10 "PostgreSQL" adalah referensi stale (SQLite yang dipakai) — sesuai hierarki doc, tidak berdampak HTTP contract.

### 1.5 Contract Review — Database (QA-104) — PASS
Schema sangat faithful ke Database.md: semua tabel, kolom, nullable, default, unique, 26 index, 7 FK, soft delete `deleted_at`, konvensi camelCase+@map. Deviasi minor (BUG-017): kolom DATETIME vs TEXT, enum didokumentasikan tapi String (keterbatasan Prisma/SQLite), default `CURRENT_TIMESTAMP`. Semua kompatibel fungsional.

### 1.6 Architecture Compliance (QA-105) — PASS
- Pola Controller→Service→Repository→Prisma konsisten; controller tanpa business logic; transaksi `$transaction` untuk approve/reject, hard delete, dll.
- Auth: JWT stateless dalam httpOnly cookie (juga menerima Bearer) — disahkan Architecture.md line 345 ("session/token sesuai implementasi backend") & TaskBackend.md (JWT_SECRET/JWT_EXPIRES_IN). Deskripsi tabel `sessions` di API.md stale (BUG-013, info saja).
- Keamanan spot-check: bcrypt hash, rate limit, CORS whitelist tanpa `*`, X-Request-ID, validasi MIME+size upload, tidak ada secret di kode.

### 1.7 PRD Compliance (QA-106) — GAP (keputusan scope diperlukan)
- **GAP-001 (MAJOR):** Fitur Matching tidak ada sama sekali (PRD FR-12/AC-06/MVP#12; admin tidak bisa monitor matching). Juga tidak ada di TaskBackend.md → implementasi konsisten dengan task, tapi melanggar PRD (PRD menang di hierarki). Perlu keputusan: tambah atau hapus dari scope PRD.
- **GAP-002 (MAJOR):** Field `characteristics` (ciri-ciri, FR-03) & `condition` (kondisi, FR-04) tidak ada di schema, form, maupun search.
- **GAP-003 (MINOR):** Filter periode waktu (FR-08) tidak ada (`dateFrom`/`dateTo` di docs, tidak diimplementasikan, tidak ada UI).
- **GAP-004 (MINOR):** Status report disederhanakan vs PRD §29 — state "Diverifikasi" dilewati (langsung ACTIVE); state per-tipe (Belum Ditemukan/Disimpan) dicollapse jadi ACTIVE. Implementasi MATCH API.md §46.
- **GAP-005 (MINOR):** Status klaim disederhanakan vs PRD §30 — "Dalam Review"/"Selesai" tidak ada (PENDING→APPROVED/REJECTED/CANCELLED saja). Match API.md.
- **GAP-006 (MINOR):** Dashboard tidak ada metrik rejected, progress klaim, dan section Matching (FR-17). Ada tambahan `totalUsers` (additif, tidak apa).
- **GAP-007 (TRIVIAL):** Peringatan duplikat report (PRD §40, bahasa "dapat") tidak diimplementasikan.
- Out of Scope: ✅ tidak ada fitur out-of-scope yang masuk (tidak ada AI/CV/GPS/CCTV/payment/academic integration).
- Tambahan di luar PRD (additif, tidak melanggar): admin user management, ProfilePage, pembatalan klaim oleh claimant.

## 2. Verdict & Rekomendasi

**Release block** BUG-003/004/005/006 **sudah ditutup** dan diverifikasi live (smoke test FE↔BE melalui proxy Vite: create report → detail unwrap → approve → search `q` → claim → CLAIMED → notifikasi mark-read → filter `reporterId` → guard 403). Regression gate QA-110 **PASS**.

Status akhir:
1. **P0 — Kontrak FE↔BE (BUG-003/004/005): FIXED** — keputusan source of truth: **Database.md + backend** (`itemName`/`occurredAt`/`reason`/`isRead`); FE diubah mengikuti. API.md masih memuat nama lama (`title`/`eventAt`/`description`/`readAt`/`referenceType`/`sessions`/`search`) → **wajib disinkronkan** (follow-up doc).
2. **P1 — Search admin (BUG-006): FIXED** — FE mengirim `q`.
3. **P1/P2 — Gap kecil + PRD GAP-001 (Matching):** masih butuh keputusan stakeholder (tambah fitur atau keluarkan dari scope PRD).

Rekomendasi lanjutan: sinkronkan `docs/API.md` dengan implementasi, tambahkan integration test FE↔BE agar kontrak tidak pecah lagi, dan jalankan smoke test UI manual penuh (QA-102) untuk alur visual dari browser.
