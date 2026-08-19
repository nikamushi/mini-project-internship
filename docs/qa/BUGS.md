# Daftar Bug — QA Core (Opsi 1)

Format per QA-108. Lifecycle per QA-109. Severity per QA-107 (BLOCKER/CRITICAL/MAJOR/MINOR/TRIVIAL).

Ringkasan status: 7 Fixed · 0 CRITICAL open · 0 MAJOR open · 8 MINOR open (termasuk 3 doc fix) · 4 TRIVIAL open · 1 info · 7 GAP PRD.

---

## BUG-001 — `db:seed` gagal: seed.ts tidak load dotenv

- **Severity:** MAJOR · **Priority:** P1
- **Environment:** Development, Windows, Node 24
- **Precondition:** repo fresh setelah `npm install`, belum ada DB
- **Steps:** jalankan `npm run db:seed`
- **Expected:** seed berjalan (admin, user, 6 kategori, 3 report)
- **Actual:** `Environment variable not found: DATABASE_URL` — `prisma/seed.ts` tidak meng-import `dotenv/config` sehingga tsx tidak memuat `.env`
- **Status:** **FIXED** — ditambahkan `import "dotenv/config";` di `api/prisma/seed.ts`; re-seed berhasil & idempotent (terverifikasi)

---

## BUG-002 — `.gitignore` berisi marker conflict yang ter-commit

- **Severity:** MINOR · **Priority:** P2
- **Environment:** Repo
- **Precondition:** — 
- **Steps:** `git diff .gitignore` / build tooling memproses file
- **Expected:** `.gitignore` bersih
- **Actual:** baris `<<<<<<< HEAD` / `>>>>>>> alil` ter-commit di `.gitignore`
- **Status:** **FIXED** — marker dihapus; `.opencode/node_modules/` di-ignore

---

## BUG-003 — Kontrak report pecah: FE `title`/`eventAt` vs BE `itemName`/`occurredAt`

- **Severity:** CRITICAL · **Priority:** P0
- **Environment:** Development (smoke test + code review)
- **Precondition:** user login
- **Steps:**
  1. Buka form create report di UI, isi lengkap, submit.
  2. Cek `POST /api/reports` (FE kirim `{title, eventAt, ...}`).
  3. Buka list/detail report.
- **Expected:** report tersimpan; list & detail menampilkan judul & tanggal.
- **Actual:** `POST /api/reports` → **422** (validator backend butuh `itemName`, FE kirim `title`). List/detail render `report.title` yang selalu `undefined` (backend return `itemName`), tanggal `eventAt` juga `undefined` (backend return `occurredAt`). Edit report ikut rusak.
- **Bukti:** `frontend/src/pages/ReportFormPage.tsx:41,79,102,105` (kirim `title`/`eventAt`); `frontend/src/api/types.ts:61,65` (type `title`/`eventAt`); `api/src/validators/report.validator.ts:8` (`itemName` required); `api/src/services/report.service.ts:39,42` (return `itemName`/`occurredAt`). API.md §29/§31 mendokumentasikan `title`/`eventAt` (sejalan FE); Database.md mendokumentasikan `item_name`/`occurred_at` (sejalan BE) — **API.md dan Database.md juga tidak sinkron**.
- **Rekomendasi:** tentukan satu sumber kebenaran, selaraskan FE/BE/API.md (atau Database.md), tambahkan integration test FE↔BE.
- **Status:** **FIXED** — keputusan: **source of truth = Database.md + backend** (`itemName`/`occurredAt`); FE diubah agar sesuai (`frontend/src/api/types.ts`, `ReportFormPage.tsx`, `ReportListPage.tsx`, `ReportDetailPage.tsx`, `MyReportsPage.tsx`, `AdminReportListPage.tsx`, `AdminReportDetailPage.tsx`, `ReportCard.tsx`, `MyClaimsPage.tsx`, `AdminClaimListPage.tsx`, `AdminClaimDetailPage.tsx`). API.md masih stale (`title`/`eventAt`) → **butuh doc fix terpisah**. Terverifikasi: 54/54 vitest, typecheck/lint/build PASS, smoke test live: create→detail unwrap→approve→search `q`→claim→CLAIMED.

---

## BUG-004 — Kontrak klaim pecah: FE `description` vs BE `reason`

- **Severity:** CRITICAL · **Priority:** P0
- **Environment:** Development
- **Precondition:** report FOUND + ACTIVE, user bukan reporter
- **Steps:** buka form klaim (`ClaimFormPage`), isi alasan, submit.
- **Expected:** klaim `PENDING` tersimpan.
- **Actual:** `POST /api/reports/:id/claims` → **422** — FE kirim `description`, validator backend butuh `reason`. Halaman detail klaim merender `claim.description` (backend hanya return `reason`) → kosong.
- **Bukti:** `frontend/src/pages/ClaimFormPage.tsx:58`; `frontend/src/api/types.ts:84-88`; `api/src/validators/claim.validator.ts:4`; `api/src/services/claim.service.ts:47`.
- **Status:** **FIXED** — FE diubah ke `reason`/`reviewReason`/`updatedAt` (`ClaimFormPage.tsx`, `ClaimDetailPage.tsx`, `AdminClaimDetailPage.tsx`; `types.ts` `ClaimDetail`). `claim.create` mengembalikan `{id, reportId, status, createdAt}` (minimal) — bukan bug. Terverifikasi live: klaim sukses, detail unwrap menampilkan reason/occurredAt/location, approve → CLAIMED, notif CLAIM_APPROVED.

---

## BUG-005 — Pusat notifikasi rusak: FE `referenceType`/`referenceId`/`readAt` vs BE `isRead`

- **Severity:** CRITICAL · **Priority:** P0
- **Environment:** Development
- **Precondition:** user punya minimal 1 notifikasi (sudah di-mark-read)
- **Steps:** buka Notification Center; klik notifikasi; mark read; reload.
- **Expected:** notifikasi bisa diklik menuju entity terkait; unread menandai setelah dibaca.
- **Actual:** backend return `{type,title,message,isRead,createdAt}` tanpa `referenceType`/`referenceId` dan memakai `isRead` (bukan `readAt`). FE meng-render `referenceType`/`referenceId`/`readAt` yang selalu `undefined` → **link tidak pernah muncul** dan `!notification.readAt` selalu `true` → **semua notifikasi tampil unread selamanya**, mark-read tidak pernah mengubah tampilan.
- **Bukti:** `frontend/src/pages/NotificationCenterPage.tsx:24-26,81,145-146`; `frontend/src/api/types.ts:95-104`; `api/src/services/notification.service.ts:28`; `api/src/controllers/notification.controller.ts:32` (mark-read return `{id, isRead:true}`).
- **Status:** **FIXED** — DB tidak punya kolom reference → FE diadaptasi ke `isRead` (tanpa navigasi klik, ikon diturunkan dari `type`). `notificationService.markRead` terima `id: number`. Terverifikasi live: notif tampil, mark-read `{id, isRead:true}`.

---

## BUG-006 — Search admin diam-diam tidak berfungsi (param `search` vs `q`)

- **Severity:** MAJOR · **Priority:** P1
- **Environment:** Development
- **Precondition:** login admin, ada >1 report
- **Steps:** buka Admin Reports, ketik kata kunci di search box.
- **Expected:** list difilter.
- **Actual:** FE mengirim `?search=...` (AdminReportListPage:66), backend membaca `q` (report.controller:19) → query tidak terfilter, **tanpa error**. Search publik (`q`) berfungsi.
- **Bukti:** `frontend/src/pages/admin/AdminReportListPage.tsx:66`; `frontend/src/services/adminService.ts:14-16`; `api/src/validators/report.validator.ts:39`; `api/src/controllers/report.controller.ts:19`. API.md §44 mendokumentasikan `search`.
- **Status:** **FIXED** — FE mengirim `q` (bukan `search`) di AdminReportListPage; `AdminReportListParams` dihapus dari types. Terverifikasi live: `?q=Laptop` mengembalikan report yang cocok.

---

## BUG-007 — Description kategori diam-diam dibuang

- **Severity:** MINOR · **Priority:** P2
- **Environment:** Development
- **Precondition:** login admin
- **Steps:** buat/edit kategori dengan description.
- **Expected:** description tersimpan & tampil.
- **Actual:** FE mengirim `description`, zod `z.object` di backend men-strip field tak dikenal → description hilang tanpa error; `countInUse` tidak pernah dipanggil.
- **Bukti:** `frontend/src/pages/admin/AdminCategoriesPage.tsx:60,114`; `api/src/validators/category.validator.ts` (hanya `name`); `api/src/services/category.service.ts`. Database.md juga tidak punya kolom `description` → field ini hasil inventing FE.
- **Status:** **Open**

---

## BUG-008 — `GET /api/categories/:id` tidak diimplementasikan

- **Severity:** MINOR · **Priority:** P2
- **Environment:** Development
- **Steps:** `GET /api/categories/1`
- **Expected:** 200 detail kategori (API.md §21)
- **Actual:** 404 — route tidak ada di `category.routes.ts`/`admin.routes.ts`
- **Status:** **Open**

---

## BUG-009 — `GET /api/reports/:reportId/claims` tidak diimplementasikan

- **Severity:** MINOR · **Priority:** P2
- **Environment:** Development
- **Steps:** `GET /api/reports/1/claims`
- **Expected:** 200 list klaim report (API.md §48)
- **Actual:** 404 — tidak ada di `claim.routes.ts` (hanya POST). FE punya service `listByReport` yang tidak pernah dipanggil → jika dipakai, 404.
- **Status:** **Open**

---

## BUG-010 — Nama tipe notifikasi berbeda dari API.md

- **Severity:** MINOR · **Priority:** P2
- **Environment:** Development
- **Steps:** bandingkan `API.md §52/§101` dengan payload yang diterima.
- **Expected:** `CLAIM_SUBMITTED`, `REPORT_VERIFIED`
- **Actual:** `CLAIM_CREATED`, `REPORT_APPROVED`/`REPORT_REJECTED`/`REPORT_STATUS_CHANGED`
- **Status:** **Open**

---

## BUG-011 — Upload image: response tidak memuat `sortOrder`

- **Severity:** MINOR · **Priority:** P2
- **Environment:** Development
- **Steps:** POST report dengan gambar; cek response `images[]`.
- **Expected:** `{id, url, sortOrder}` (API.md §36)
- **Actual:** `{id, url}` — kolom `sort_order` tidak ada di schema `ReportImage`.
- **Status:** **Open**

---

## BUG-012 — Deaktivasi kategori tidak pernah 409 saat dipakai

- **Severity:** MINOR · **Priority:** P3
- **Environment:** Development
- **Steps:** deactivate kategori yang terpakai laporan.
- **Expected:** 409 `CATEGORY_IN_USE` (API.md §25)
- **Actual:** selalu 200; kategori lama tetap bisa dipakai laporan lama (aman secara data, hanya status code berbeda contract). `categoryRepository.countInUse` dead code. Error code `CATEGORY_IN_USE` terdaftar di API.md §11 tapi tak pernah dipakai.
- **Status:** **Open**

---

## BUG-013 — Auth: JWT stateless vs deskripsi tabel `sessions` di API.md

- **Severity:** MINOR · **Priority:** P3 · **Tipe:** info/konsistensi doc
- **Environment:** Development
- **Steps:** — 
- **Expected:** sesuai API.md §5/§76/§102 (session server-side, tabel `sessions`)
- **Actual:** JWT stateless di httpOnly cookie (+ support Bearer yang tidak terdokumentasi). **Bukan pelanggaran** — Architecture.md:345 & TaskBackend.md:55,226-227 mengizinkan "Session/JWT" dan mendokumentasikan `JWT_SECRET`/`JWT_EXPIRES_IN`. Deskripsi sessions di API.md stale → perbaiki doc.
- **Status:** **Open (doc fix)**

---

## BUG-014 — Filter admin tidak lengkap vs API.md

- **Severity:** MINOR · **Priority:** P3
- **Environment:** Development
- **Steps:** — 
- **Expected (API.md):** admin reports: `reporterId, dateFrom, dateTo, search`; admin claims: `claimantId, dateFrom, dateTo`; activity logs: `entityType, action, actorId, dateFrom, dateTo`
- **Actual:** tidak diimplementasikan (dan tidak ada UI-nya). Search admin juga rusak terpisah (BUG-006).
- **Status:** **Open**

---

## BUG-015 — `GET /api/categories` & `GET /api/reports` publik vs "Authenticated users" di API.md

- **Severity:** TRIVIAL · **Priority:** P3 · **Tipe:** ambiguitas doc
- **Environment:** Development
- **Steps:** — 
- **Expected:** ambigu — API.md §22/§27 bilang authenticated, §28 mengimplikasikan public listing
- **Actual:** route publik (tanpa requireAuth). Visibilitas status diatur service (PENDING/REJECTED/CANCELLED tersembunyi). Konsisten dengan §28 & PRD; klarifikasi doc.
- **Status:** **Open (doc fix)**

---

## BUG-016 — Hard delete admin vs aturan soft delete (konflik aturan doc)

- **Severity:** TRIVIAL · **Priority:** P3 · **Tipe:** keputusan
- **Environment:** Development
- **Steps:** `DELETE /api/admin/reports/:id`
- **Expected:** AGENTS.md: "Soft delete untuk reports, bukan hard delete".
- **Actual:** hard delete permanen (dengan `reportImage.deleteMany` dulu di dalam `$transaction` — tidak crash karena FK RESTRICT; `hardDelete` log `{hardDelete:true}`). Database.md §58 & API.md §43 mendokumentasikan hard delete admin → konflik antar-doc. Keputusan: biarkan (mengikuti Database.md/API.md) atau ubah jadi soft delete (mengikuti aturan AGENTS.md).
- **Status:** **Open (keputusan)**

---

## BUG-017 — Deviasi teknis DB vs Database.md (semua kompatibel)

- **Severity:** TRIVIAL · **Priority:** P3 · **Tipe:** info
- **Environment:** Development
- **Steps:** — 
- **Actual:**
  - Timestamp: doc bilang TEXT, schema DATETIME (SQLite dynamic typing + Prisma ISO-8601 string → fungsional sama)
  - Enum (role/type/status) didokumentasikan tapi diimplementasikan `String` + validasi service (Prisma SQLite tidak mendukung enum)
  - DDL default `CURRENT_TIMESTAMP` vs ISO-8601 (Prisma selalu supply nilai — jarang terpakai)
  - `report_images.report_id` FK `ON DELETE RESTRICT` vs deskripsi doc cleanup (tertangani service hardDelete)
- **Status:** **Info — no action**

---

## BUG-018 — Warning build frontend: chunk > 500 kB

- **Severity:** TRIVIAL · **Priority:** P3 · **Tipe:** performa
- **Environment:** Build
- **Steps:** `npm run build` (frontend)
- **Expected:** tanpa warning size
- **Actual:** warning chunk > 500 kB (bundle size). Optimasi kode-splitting/lazy di masa depan.
- **Status:** **Open (backlog)**

---

## BUG-019 — Endpoint undocumented yang diekspos

- **Severity:** TRIVIAL · **Priority:** P3 · **Tipe:** info
- **Environment:** Development
- **Steps:** — 
- **Actual:** `GET /api/health` dan static `/uploads` tidak ada di API.md (ekspektasi untuk MVP; sebaiknya didokumentasikan).
- **Status:** **Open (doc fix)**

---

## BUG-020 — Copy UI "dihapus permanen" vs soft delete user

- **Severity:** TRIVIAL · **Priority:** P3 · **Tipe:** UX copy
- **Environment:** Development
- **Steps:** buka ReportDetailPage, hapus report.
- **Expected:** keterangan sesuai perilaku (soft delete, bisa dipulihkan admin)
- **Actual:** konfirmasi bertuliskan "akan dihapus permanen" padahal endpoint user melakukan soft delete (`deleted_at`).
- **Status:** **FIXED** — copy konfirmasi diganti "akan dihapus" (soft delete user), konsisten dengan `deleted_at` backend.

---

# GAP Scope (PRD) — bukan bug, butuh keputusan stakeholder

| ID | Severity | Deskripsi |
|---|---|---|
| GAP-001 | MAJOR | Fitur **Matching** tidak ada (PRD FR-12, AC-06, MVP#12; dashboard "matching" juga tidak ada). Tidak ada di TaskBackend.md. Keputusan: implement atau keluarkan dari scope PRD. |
| GAP-002 | MAJOR | Field **`characteristics`** (FR-03) & **`condition`** (FR-04) tidak ada di schema/form/search. |
| GAP-003 | MINOR | Filter periode waktu (FR-08) tidak ada. |
| GAP-004 | MINOR | Status flow report disederhanakan: state "Diverifikasi" & state per-tipe tidak ada (match API.md §46, beda PRD §29). |
| GAP-005 | MINOR | Status flow klaim disederhanakan: "Dalam Review"/"Selesai" tidak ada (match API.md, beda PRD §30). |
| GAP-006 | MINOR | Dashboard kurang metrik rejected/progress klaim/section matching (ada tambahan `totalUsers`). |
| GAP-007 | TRIVIAL | Peringatan duplicate report (bahasa PRD "dapat") tidak ada. |

# Catatan QA-110 (Regression Gate)

- P0 test (backend 54/54) ✅ PASS
- Open Critical: **0** — BUG-003/004/005 **FIXED** dan diverifikasi live (smoke test FE↔BE melalui proxy Vite) → **gate PASS**
- Sisa open: 8 MINOR (BUG-007..014, termasuk 3 doc fix) + 4 TRIVIAL + 1 info + 7 GAP PRD (butuh keputusan stakeholder)
- **Follow-up wajib:** sinkronkan `docs/API.md` dengan implementasi nyata (title/eventAt/search/readAt/sessions/referenceType → itemName/occurredAt/q/isRead/JWT + endpoints yang belum ada).
