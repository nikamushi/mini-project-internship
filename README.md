# Sistem Manajemen Laporan Kehilangan Barang Kampus

Aplikasi web terpusat untuk melaporkan, mencari, memantau, dan mengelola barang hilang maupun barang ditemukan di lingkungan kampus.

Dua jenis laporan utama:

- **Barang Hilang (Lost Item)** — laporan dari pengguna yang kehilangan barang.
- **Barang Ditemukan (Found Item)** — laporan dari pengguna yang menemukan barang.

Sistem mempertemukan kedua jenis laporan melalui informasi barang, kategori, lokasi, waktu, dan ciri-ciri barang. Proses verifikasi dan penyelesaian klaim melibatkan admin kampus.

## Fitur

- **Laporan** — buat, edit, dan pantau laporan barang hilang/ditemukan dengan foto (maks. 5 gambar).
- **Klaim** — klaim barang yang ditemukan; status klaim (pending, disetujui, ditolak, dibatalkan) diawasi admin.
- **Admin Dashboard** — verifikasi laporan, approve/reject klaim, kelola kategori, kelola pengguna, dan lihat activity logs.
- **Pencarian & Filter** — cari laporan berdasarkan kata kunci, kategori, status, dan lokasi; urutkan berdasarkan waktu kejadian.
- **Notifikasi** — notifikasi real-time perubahan status laporan dan klaim milik pengguna.
- **Autentikasi** — login/register dengan JWT dalam httpOnly cookies; dua peran: `USER` dan `ADMIN`.
- **Keamanan** — validasi input (Zod), rate limiting, helmet, soft delete laporan, transaksi untuk operasi sensitif.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Monorepo | pnpm workspaces |
| Frontend | React 19, Vite 8, TypeScript, React Router, TanStack Query |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | SQLite |
| Testing | Vitest (54 integration tests) |

## Struktur Project

```
mini-project-internship/
├── apps/
│   ├── api/                 # Backend (@laf/api)
│   │   ├── prisma/          # schema.prisma, seed.ts, migrations/
│   │   ├── src/
│   │   │   ├── controllers/ # Request/response only (NO business logic)
│   │   │   ├── services/    # ALL business rules
│   │   │   ├── repositories/# Data access (Prisma)
│   │   │   ├── middlewares/ # auth, role, error, upload
│   │   │   ├── validators/  # Zod schemas
│   │   │   └── routes/      # 6 route files
│   │   ├── tests/           # Vitest integration tests
│   │   └── uploads/reports/ # Uploaded images
│   └── web/                 # Frontend (@laf/web)
│       └── src/
│           ├── components/  # Reusable UI components
│           ├── pages/       # Page components (admin/, auth/, user/, shared/)
│           ├── services/    # API service modules
│           ├── api/         # API client + types
│           └── styles/      # Design tokens + global styles
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
└── package.json             # Root workspace scripts
```

## Prasyarat

- **Node.js** ≥ 18
- **pnpm** ≥ 9 (install: `npm install -g pnpm`)

## Menjalankan Secara Lokal

```bash
# 1. Install semua dependencies workspace
pnpm install

# 2. Setup environment
# Salin lalu isi sesuai kebutuhan:
cp apps/api/.env.example apps/api/.env

# 3. Setup database (migrate + seed)
pnpm db:migrate
pnpm db:seed

# 4. Jalankan api + web secara paralel
pnpm dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/api/health

### Akun Demo (hasil seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `password123` |
| User | `user@example.com` | `password123` |

## Perintah

| Perintah | Deskripsi |
|----------|-----------|
| `pnpm dev` | Jalankan api + web sekaligus (parallel) |
| `pnpm dev:api` | Backend saja (port 3000) |
| `pnpm dev:web` | Frontend saja (port 5173) |
| `pnpm build` | Build semua workspace |
| `pnpm test` | Test semua workspace |
| `pnpm lint` | Lint semua workspace |
| `pnpm typecheck` | Typecheck semua workspace |
| `pnpm db:migrate` | Prisma migrate dev |
| `pnpm db:seed` | Seed database |
| `pnpm db:reset` | Reset database + seed |

Untuk per-package:

```bash
pnpm --filter @laf/api run <script>
pnpm --filter @laf/web run <script>
```

## API Endpoints (Ringkasan)

| Area | Endpoint |
|------|----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Categories | `GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/:id` |
| Reports | `GET /api/reports`, `POST /api/reports`, `GET /api/reports/:id`, `PATCH /api/reports/:id`, `DELETE /api/reports/:id`, upload/hapus foto |
| Claims | `POST /api/reports/:reportId/claims`, `GET /api/claims/my`, `GET /api/claims/:id`, `PATCH /api/claims/:id/cancel` |
| Notifications | `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all` |
| Admin | `GET /api/admin/dashboard`, kelola users/reports/claims, `GET /api/admin/activity-logs` |

Format respons konsisten: `{ success, data, meta? }` untuk sukses, `{ success: false, message, errors }` untuk error.

## Deployment

> **Status: belum di-deploy.** Aplikasi saat ini berjalan lokal dengan SQLite (`apps/api/data/database.sqlite`).

Catatan untuk deployment production:

- **SQLite tidak cocok** untuk platform serverless (Vercel/Cloudflare Workers) karena filesystem tidak persisten. Pertimbangkan PostgreSQL (Railway/Render/Supabase/Neon) atau Cloudflare D1.
- **Upload file** tersimpan di disk lokal (`uploads/`). Untuk production gunakan object storage (S3/R2/Cloudinary).
- **Frontend** (`@laf/web`) dapat di-deploy ke Vercel/Cloudflare Pages/Netlify sebagai static site; set `VITE_API_URL` ke URL backend production.
- **Backend Express** paling natural di-hosting di platform dengan Node.js runtime berkelanjutan (Railway, Render, Fly.io) — bukan serverless, tanpa rewrite.

## Arsitektur

Lapisan backend mengikuti pola ketat:

```text
Routes → Controllers → Services → Repositories → Prisma
```

- **Controllers** — hanya menangani request/response, tanpa business logic.
- **Services** — semua aturan bisnis (verifikasi status, validasi klaim, transaksi).
- **Repositories** — akses data murni via Prisma.
- **Transaksi** wajib untuk approve/reject claim dan approve/reject report.
- **Soft delete** untuk laporan (`deleted_at`), deaktivasi untuk kategori (`is_active`).
- **Identitas user** selalu dari session/token, tidak pernah dari request body.

## Dokumentasi

Dokumentasi lengkap (PRD, arsitektur, skema database, kontrak API, desain, user flow, dan breakdown task) tersedia di [`docs/`](./docs/). Dokumentasi adalah **source of truth** — ubah dokumen terlebih dahulu sebelum mengubah kode.

## Lisensi

Proprietary — proyek mini-project internship. Tidak untuk redistribusi tanpa izin.