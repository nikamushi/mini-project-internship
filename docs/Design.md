# Design.md

## Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0
**Status:** Final
**Platform:** Web Application
**Reference:** `PRD.md`

---

# 1. Design Overview

Sistem Manajemen Laporan Kehilangan Barang Kampus dirancang sebagai platform web terpusat untuk membantu pengguna melaporkan, menemukan, mencocokkan, dan menyelesaikan kasus barang hilang dan barang ditemukan.

Desain berfokus pada dua pengalaman utama:

1. **User Experience**
   - Menemukan barang.
   - Melaporkan barang hilang.
   - Melaporkan barang ditemukan.
   - Memantau laporan.
   - Mengajukan klaim.
   - Menyelesaikan proses pengembalian.

2. **Admin Experience**
   - Memverifikasi laporan.
   - Mengelola laporan.
   - Meninjau kandidat matching.
   - Memverifikasi klaim.
   - Mengelola status.
   - Memantau proses penyelesaian.

Prinsip utama produk:

> **Report → Verify → Discover → Match → Claim → Resolve**

---

# 2. Design Goals

## DG-01 — Simple

Pengguna dapat membuat laporan tanpa memahami proses administrasi internal.

## DG-02 — Discoverable

Pengguna dapat dengan cepat menemukan barang yang mungkin berkaitan dengan laporan mereka.

## DG-03 — Trustworthy

Setiap laporan memiliki status dan proses verifikasi yang jelas.

## DG-04 — Transparent

Pengguna dapat mengetahui perkembangan laporan dan klaimnya.

## DG-05 — Operationally Efficient

Admin dapat mengelola banyak laporan melalui interface yang terstruktur.

## DG-06 — Responsive

Aplikasi nyaman digunakan pada desktop, tablet, dan mobile browser.

## DG-07 — Secure

Informasi pribadi dan informasi yang dapat digunakan sebagai bukti kepemilikan tidak ditampilkan secara berlebihan.

---

# 3. Design Principles

## DP-01 — Search Before Report

Pengguna yang kehilangan barang diarahkan untuk mencari barang ditemukan terlebih dahulu.

Namun pengguna tetap dapat langsung membuat laporan kehilangan.

## DP-02 — Two Clear Report Types

Sistem selalu membedakan:

- Barang Hilang.
- Barang Ditemukan.

## DP-03 — Status Is Visible

Status laporan harus selalu mudah ditemukan pada:

- Card.
- List.
- Detail.
- My Reports.
- Admin dashboard.

## DP-04 — Public Information vs Verification Information

Informasi umum dapat ditampilkan pada laporan publik.

Informasi khusus untuk validasi kepemilikan disimpan untuk proses klaim.

## DP-05 — Matching Is Assistance

Matching hanya memberikan kemungkinan kecocokan.

Sistem tidak menentukan kepemilikan secara otomatis.

## DP-06 — Admin Owns the Resolution

Admin memiliki kontrol terhadap:

- Verifikasi laporan.
- Verifikasi klaim.
- Penyelesaian laporan.

## DP-07 — Progressive Disclosure

Informasi ditampilkan secara bertahap:

```text
List
 ↓
Detail
 ↓
Claim
 ↓
Verification
```

Jangan menampilkan seluruh informasi internal pada halaman publik.

---

# 4. Information Architecture

## 4.1 User Sitemap

```text
Home
│
├── Search
│   └── Search Results
│
├── Report Item
│   ├── Report Lost Item
│   └── Report Found Item
│
├── My Reports
│   ├── All
│   ├── Lost
│   ├── Found
│   └── Report Detail
│
├── My Claims
│   ├── All
│   └── Claim Detail
│
└── Profile
```

---

# 5. Admin Sitemap

```text
Admin
│
├── Dashboard
│
├── Reports
│   ├── All Reports
│   ├── Pending Verification
│   ├── Lost Items
│   ├── Found Items
│   └── Report Detail
│
├── Matching
│   ├── Candidates
│   └── Matching Detail
│
├── Claims
│   ├── Pending
│   ├── Approved
│   ├── Rejected
│   └── Claim Detail
│
├── Categories
│
├── Users
│
└── Activity History
```

---

# 6. Navigation

## 6.1 User Navigation

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ LOGO │ Home │ Lost & Found │ My Reports │ My Claims │ Profile │
│                                                   [Report]   │
└──────────────────────────────────────────────────────────────┘
```

Primary action:

**Report Item**

Dropdown:

- Report Lost Item.
- Report Found Item.

## 6.2 Mobile Navigation

```text
┌────────────────────────────────────┐
│ LOGO                         ☰     │
└────────────────────────────────────┘
```

Mobile menu:

```text
Home
Search
Report Lost Item
Report Found Item
My Reports
My Claims
Profile
```

## 6.3 Admin Navigation

Desktop menggunakan sidebar:

```text
ADMIN
────────────────────
Dashboard

Reports
  All Reports
  Pending Verification
  Lost Items
  Found Items

Matching

Claims

Categories

Users

Activity History
────────────────────
Profile
Logout
```

---

# 7. Page Inventory

## User

| Page           | Priority | Purpose              |
| -------------- | -------- | -------------------- |
| Home           | P0       | Entry point          |
| Search Results | P0       | Discovery            |
| Report Item    | P0       | Memilih tipe laporan |
| Report Lost    | P0       | Laporan kehilangan   |
| Report Found   | P0       | Laporan penemuan     |
| Report Detail  | P0       | Detail laporan       |
| My Reports     | P0       | Monitoring laporan   |
| Claim Form     | P1       | Pengajuan klaim      |
| My Claims      | P1       | Monitoring klaim     |
| Claim Detail   | P1       | Detail klaim         |
| Profile        | P1       | Pengaturan akun      |

## Admin

| Page             | Priority | Purpose            |
| ---------------- | -------- | ------------------ |
| Dashboard        | P0       | Monitoring         |
| Reports          | P0       | Manajemen laporan  |
| Report Detail    | P0       | Verifikasi         |
| Matching         | P1       | Review matching    |
| Claims           | P1       | Review klaim       |
| Claim Detail     | P1       | Verifikasi klaim   |
| Categories       | P1       | Manajemen kategori |
| Users            | P1       | Manajemen user     |
| Activity History | P1       | Audit trail        |

---

# 8. Home Page

Home merupakan entry point utama dan harus langsung menjawab dua kebutuhan:

> "Saya kehilangan barang, apa yang harus saya lakukan?"

> "Saya menemukan barang, bagaimana cara melaporkannya?"

Struktur:

```text
┌───────────────────────────────────────────────────┐
│ NAVIGATION                                        │
├───────────────────────────────────────────────────┤
│                                                   │
│        Kehilangan atau Menemukan Barang?          │
│                                                   │
│    Cari barang atau buat laporan baru.            │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ 🔍 Cari barang...                           │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│       [ Cari Barang ]   [ Laporkan Barang ]       │
│                                                   │
├───────────────────────────────────────────────────┤
│ Barang Ditemukan Terbaru                          │
│                                                   │
│ [Card] [Card] [Card] [Card]                       │
│                                                   │
├───────────────────────────────────────────────────┤
│ Barang Hilang Terbaru                             │
│                                                   │
│ [Card] [Card] [Card] [Card]                       │
└───────────────────────────────────────────────────┘
```

Prioritas visual:

1. Search.
2. Report CTA.
3. Found items.
4. Lost items.

---

# 9. Report Entry

Ketika user memilih **Laporkan Barang**, tampilkan dua pilihan.

```text
┌────────────────────────┐  ┌────────────────────────┐
│                        │  │                        │
│     BARANG HILANG      │  │    BARANG DITEMUKAN    │
│                        │  │                        │
│ Saya kehilangan       │  │ Saya menemukan         │
│ sebuah barang.        │  │ sebuah barang.         │
│                        │  │                        │
│ [ Pilih ]              │  │ [ Pilih ]              │
└────────────────────────┘  └────────────────────────┘
```

Keduanya memiliki visual yang setara.

---

# 10. Lost Item Form

Form menggunakan beberapa section.

## Section A — Item Information

Required:

- Nama barang.
- Kategori.
- Deskripsi.
- Ciri-ciri.

## Section B — Lost Information

Required:

- Lokasi kehilangan.
- Tanggal kehilangan.
- Perkiraan waktu.

## Section C — Photo

Optional:

- Upload foto.
- Preview.
- Remove.

## Section D — Additional Information

Optional:

- Informasi tambahan.

CTA:

**Laporkan Barang Hilang**

---

# 11. Found Item Form

## Section A — Item Information

Required:

- Nama/deskripsi barang.
- Kategori.
- Kondisi.

## Section B — Found Information

Required:

- Lokasi ditemukan.
- Tanggal ditemukan.
- Perkiraan waktu.

## Section C — Photo

Optional:

- Upload foto.
- Preview.
- Remove.

## Section D — Additional Information

Optional:

- Catatan tambahan.

CTA:

**Laporkan Barang Ditemukan**

---

# 12. Form UX

## Required Field

Gunakan `*`.

## Validation

Validasi dilakukan:

1. Saat field kehilangan fokus jika diperlukan.
2. Saat submit.

Error ditempatkan sedekat mungkin dengan field.

```text
Lokasi Kehilangan *

[________________________]

Lokasi kehilangan harus diisi.
```

## Submit State

Saat submit:

```text
[ Mengirim Laporan... ]
```

Button tidak dapat diklik dua kali.

## Success State

```text
✓ Laporan Berhasil Dibuat

Laporan Anda telah dikirim dan sedang menunggu
verifikasi admin.

Report ID
LR-2026-0001

[ Lihat Laporan ]
[ Kembali ke Beranda ]
```

---

# 13. Search Experience

Search merupakan fungsi utama.

Search dapat dilakukan dari:

- Home.
- Search page.
- Report listing.

Search placeholder:

> Cari nama barang, kategori, atau lokasi...

Search harus mendukung kata kunci sederhana dan toleran terhadap perbedaan kapitalisasi.

---

# 14. Search Results

```text
┌─────────────────────────────────────────────────────┐
│ Search                                               │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🔍 laptop                                       │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [ Semua ] [ Lost ] [ Found ]                        │
│                                                     │
│ Filter: [Kategori] [Lokasi] [Status] [Tanggal]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 12 laporan ditemukan                                │
│                                                     │
│ [Card]                                              │
│ [Card]                                              │
│ [Card]                                              │
└─────────────────────────────────────────────────────┘
```

Pada mobile, filter menggunakan **filter drawer/sheet**.

---

# 15. Report Card

Card harus memungkinkan pengguna memahami laporan tanpa membuka detail.

```text
┌──────────────────────────────┐
│                              │
│          IMAGE               │
│                              │
├──────────────────────────────┤
│ FOUND                        │
│ Laptop Lenovo                │
│ Elektronik                   │
│                              │
│ 📍 Perpustakaan              │
│ 🕒 15 Agustus 2026           │
│                              │
│ [ Ditemukan ]                │
└──────────────────────────────┘
```

Informasi minimum:

- Image.
- Type.
- Item name.
- Category.
- Location.
- Date.
- Status.

---

# 16. Report Detail

Struktur:

```text
┌─────────────────────────────────────────────────────┐
│ ← Kembali                                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [              IMAGE GALLERY                    ]   │
│                                                     │
│ FOUND                                               │
│ Laptop Lenovo                                       │
│                                                     │
│ [ Ditemukan ]                                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Informasi Barang                                    │
│                                                     │
│ Kategori       Elektronik                           │
│ Kondisi        Baik                                 │
│                                                     │
│ Deskripsi                                           │
│ Laptop warna hitam...                               │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Lokasi & Waktu                                      │
│                                                     │
│ 📍 Perpustakaan                                     │
│ 🕒 15 Agustus 2026                                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [ Saya Mengenali Barang Ini ]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# 17. Public vs Private Information

Informasi pada detail laporan harus dibagi menjadi dua kategori.

## Public

- Nama umum barang.
- Kategori.
- Foto.
- Lokasi umum.
- Waktu umum.
- Deskripsi umum.
- Status.

## Verification Only

- Ciri khusus.
- Nomor seri.
- Detail kerusakan.
- Isi barang.
- Bukti kepemilikan.
- Informasi kontak pribadi.

Verification-only information tidak ditampilkan pada halaman publik.

---

# 18. Claim Flow

```text
Report Detail
      ↓
Saya Mengenali Barang Ini
      ↓
Claim Form
      ↓
Ownership Information
      ↓
Evidence
      ↓
Submit
      ↓
Menunggu Verifikasi
      ↓
Admin Review
      ↓
Approved / Rejected
```

---

# 19. Claim Form

Section:

## Ownership

> Mengapa Anda yakin barang ini milik Anda?

## Specific Characteristics

> Jelaskan ciri khusus yang tidak terlihat pada informasi publik.

## Evidence

- Bukti kepemilikan jika tersedia.
- Foto pendukung jika diperlukan.

## Additional Information

Catatan tambahan.

CTA:

**Ajukan Klaim**

---

# 20. Claim Success

```text
✓ Klaim Berhasil Diajukan

Klaim Anda sedang diperiksa oleh admin.

Claim ID:
CL-2026-0001

[ Lihat Klaim ]
```

---

# 21. My Reports

Struktur:

```text
My Reports

[ Semua ] [ Hilang ] [ Ditemukan ] [ Selesai ]

[ Search ]

┌────────────────────────────────────────┐
│ Laptop ASUS                            │
│ Lost • 15 Aug 2026                     │
│                                        │
│ Status: Belum Ditemukan                │
│                                        │
│ [ Lihat Detail ]                       │
└────────────────────────────────────────┘
```

User hanya melihat laporan yang dibuat oleh dirinya pada area **My Reports**.

---

# 22. My Claims

Tabs:

```text
[ Semua ] [ Menunggu ] [ Disetujui ] [ Ditolak ]
```

Card:

- Claim ID.
- Item.
- Report ID.
- Date.
- Status.
- Last update.

---

# 23. Admin Dashboard

Dashboard admin harus fokus pada pekerjaan yang membutuhkan tindakan.

Prioritas:

1. Pending verification.
2. Pending claims.
3. Matching candidates.
4. Report summary.

Struktur:

```text
┌──────────────────────────────────────────────────────┐
│ Admin Dashboard                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Total     Lost     Found     Pending     Completed   │
│  245       130      115        18          92        │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Menunggu Verifikasi                                  │
│                                                      │
│ [Report] [Report] [Report]                            │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Klaim Menunggu Review                                 │
│                                                      │
│ [Claim] [Claim]                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Kandidat Matching                                    │
│                                                      │
│ [Match] [Match]                                      │
└──────────────────────────────────────────────────────┘
```

---

# 24. Admin Reports

Admin menggunakan table sebagai primary data view.

```text
Reports

[ Search... ]

[Type] [Status] [Category] [Location] [Date]

┌─────────┬────────────┬────────┬─────────────┬─────────┐
│ ID      │ Item       │ Type   │ Status      │ Date    │
├─────────┼────────────┼────────┼─────────────┼─────────┤
│ LR-001  │ Laptop     │ Lost   │ Verification│ 15 Aug  │
│ FR-002  │ Wallet     │ Found  │ Active      │ 15 Aug  │
│ LR-003  │ Keys       │ Lost   │ Active      │ 14 Aug  │
└─────────┴────────────┴────────┴─────────────┴─────────┘
```

Table harus mendukung:

- Search.
- Filter.
- Sorting.
- Pagination.
- Row action.

---

# 25. Admin Report Detail

Gunakan layout dua kolom pada desktop.

```text
┌────────────────────────────────────────────────────────┐
│ Report Detail                                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│ MAIN CONTENT                     SIDEBAR               │
│                                                        │
│ Item Information                  Status               │
│                                                        │
│ Image                             [Pending]             │
│ Description                                            │
│ Location                          Actions              │
│ Time                              [Verify]             │
│                                                        │
│ Reporter Information              [Reject]             │
│                                                        │
│ Matching Candidates                                    │
│                                                        │
│ Activity History                                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Mobile menjadi satu kolom.

---

# 26. Admin Verification

Verification screen harus menjawab:

1. Apakah laporan valid?
2. Apakah informasi cukup?
3. Apakah laporan layak dipublikasikan?

Actions:

- Verify.
- Reject.
- Request revision jika workflow tersebut diterapkan.

Untuk reject, wajib meminta alasan.

---

# 27. Matching

Matching adalah alat bantu admin.

Struktur:

```text
Matching Candidates

┌──────────────────────────────────────────────────────┐
│ LOST ITEM                                             │
│ Laptop ASUS                                          │
│ Gedung A • 14 Aug                                    │
│                                                      │
│                     POSSIBLE MATCH                   │
│                                                      │
│ FOUND ITEM                                            │
│ Laptop ASUS                                          │
│ Gedung A • 15 Aug                                    │
│                                                      │
│ Matched Parameters                                    │
│ ✓ Category                                            │
│ ✓ Location                                            │
│ ✓ Description                                         │
│                                                      │
│ [ Review Match ] [ Not a Match ]                     │
└──────────────────────────────────────────────────────┘
```

Jangan menggunakan bahasa:

> "Barang ini pasti milik pengguna."

Gunakan:

> "Kemungkinan cocok."

---

# 28. Matching Detail

Admin dapat melihat:

- Lost report.
- Found report.
- Parameter yang cocok.
- Parameter yang berbeda.
- Foto.
- Timeline.
- Riwayat.
- Klaim terkait.

Actions:

- Confirm Match.
- Not a Match.
- Open Report.
- Review Claim.

---

# 29. Claim Management

Admin melihat:

```text
Claims

[ Search ]

[Pending] [Approved] [Rejected]

┌──────────┬───────────┬────────────┬───────────┐
│ Claim ID │ Item      │ Claimant   │ Status    │
├──────────┼───────────┼────────────┼───────────┤
│ CL-001   │ Laptop    │ User A     │ Pending   │
│ CL-002   │ Wallet    │ User B     │ Approved  │
└──────────┴───────────┴────────────┴───────────┘
```

---

# 30. Claim Review

Admin dapat melihat:

### Item

Informasi barang ditemukan.

### Claimant

Informasi pengguna yang mengajukan klaim.

### Ownership Information

Informasi yang diberikan claimant.

### Evidence

Bukti pendukung.

### Matching Context

Kandidat matching yang berkaitan.

Actions:

**Approve Claim**

**Reject Claim**

Reject harus memiliki alasan.

---

# 31. Activity History

Activity history menggunakan timeline.

```text
15 Aug 14:32
● Admin verified report LR-001

15 Aug 13:21
● User submitted claim CL-008

15 Aug 10:42
● Status changed
  Pending → Active

14 Aug 17:32
● Report created
```

Activity penting tidak boleh dihapus melalui UI normal.

---

# 32. Category Management

Admin dapat:

- Melihat kategori.
- Membuat kategori.
- Mengubah kategori.
- Menonaktifkan kategori.

Kategori default:

- Elektronik.
- Dokumen.
- Tas.
- Dompet.
- Kunci.
- Pakaian.
- Buku.
- Aksesori.
- Lainnya.

Kategori yang sudah digunakan oleh laporan tidak boleh dihapus secara hard delete.

Gunakan status **Active/Inactive**.

---

# 33. User Management

Admin dapat:

- Melihat pengguna.
- Search pengguna.
- Filter berdasarkan status.
- Melihat detail pengguna.
- Menonaktifkan akun jika diperlukan.

Admin tidak dapat mengakses informasi pribadi yang tidak diperlukan untuk operasional sistem.

---

# 34. Status Design

Status harus menggunakan semantic badge.

| Status              | Semantic |
| ------------------- | -------- |
| Menunggu Verifikasi | Warning  |
| Diverifikasi        | Info     |
| Belum Ditemukan     | Neutral  |
| Aktif               | Info     |
| Ditemukan           | Success  |
| Disimpan            | Info     |
| Pemilik Ditemukan   | Success  |
| Klaim               | Warning  |
| Selesai             | Success  |
| Ditolak             | Danger   |
| Dibatalkan          | Neutral  |

Status tidak boleh hanya dibedakan berdasarkan warna.

Gunakan:

- Label.
- Icon jika diperlukan.
- Warna semantic.

---

# 35. Component Architecture

## Navigation

- Navbar.
- Sidebar.
- Mobile menu.
- Breadcrumb.

## Form

- Input.
- Textarea.
- Select.
- Combobox.
- Date picker.
- Time picker.
- File upload.
- Radio.
- Checkbox.

## Content

- Report card.
- Report table.
- Detail section.
- Status badge.
- Category badge.
- Timeline.
- Image gallery.

## Feedback

- Toast.
- Alert.
- Modal.
- Empty state.
- Error state.
- Loading state.
- Skeleton.

## Actions

- Primary button.
- Secondary button.
- Ghost button.
- Danger button.
- Icon button.

---

# 36. Design System Direction

Visual character:

- Clean.
- Modern.
- Institutional.
- Trustworthy.
- Friendly.
- Functional.

Produk tidak boleh terlihat seperti:

- Marketplace.
- Social media.
- Classified ads.
- E-commerce.

Fokus visual adalah **service platform** untuk kebutuhan kampus.

Detail visual token seperti:

- Color palette.
- Typography scale.
- Border radius.
- Shadows.
- Component tokens.
- Iconography.

didefinisikan pada:

`DesignSystem.md`

---

# 37. Typography

Typography harus memprioritaskan keterbacaan.

Hierarchy:

```text
Display
 ↓
Page Heading
 ↓
Section Heading
 ↓
Card Heading
 ↓
Body
 ↓
Caption
```

Gunakan maksimal dua font family.

Body text harus memiliki line-height yang cukup agar informasi laporan mudah dibaca.

---

# 38. Spacing

Gunakan spacing scale konsisten:

```text
4
8
12
16
24
32
48
64
```

Komponen tidak boleh menggunakan spacing arbitrary tanpa alasan desain.

---

# 39. Image Design

Foto barang merupakan bagian penting dari sistem.

## Card

Gunakan aspect ratio konsisten.

## Detail

Gunakan image gallery dengan:

- Main image.
- Thumbnail.
- Zoom jika diperlukan.

## Upload

Setelah upload:

```text
[ Preview ] [ Remove ]
```

Foto harus memiliki fallback jika gagal dimuat.

---

# 40. Empty State

Setiap halaman data memiliki empty state.

Contoh:

```text
┌────────────────────────────────┐
│                                │
│             [ICON]             │
│                                │
│       Belum Ada Laporan        │
│                                │
│ Anda belum membuat laporan.    │
│                                │
│      [ Buat Laporan ]          │
│                                │
└────────────────────────────────┘
```

Empty state harus memiliki:

- Illustration/icon.
- Heading.
- Short explanation.
- Relevant CTA jika ada.

---

# 41. Loading State

Gunakan skeleton untuk:

- Report cards.
- Tables.
- Dashboard metrics.
- Detail page.
- Image gallery.

Untuk action:

```text
[ Mengirim... ]
```

Button dinonaktifkan selama request berlangsung.

---

# 42. Error State

Error message harus menjelaskan:

1. Apa yang gagal.
2. Apa yang dapat dilakukan user.

Contoh:

```text
Gagal Memuat Data

Laporan tidak dapat dimuat saat ini.

[ Coba Lagi ]
```

---

# 43. Confirmation Modal

Gunakan confirmation untuk destructive atau irreversible action.

Contoh reject:

```text
Tolak Laporan?

Laporan ini tidak akan ditampilkan sebagai
laporan aktif.

Alasan penolakan

[________________________]

[ Batal ] [ Tolak Laporan ]
```

---

# 44. Responsive Design

## Desktop

- Max-width content container.
- Multi-column layout.
- Sidebar untuk admin.
- Grid untuk report cards.
- Table untuk admin.

## Tablet

- Grid menjadi 2 kolom.
- Sidebar dapat collapse.
- Detail dapat berubah menjadi single-column.

## Mobile

- Single-column.
- Full-width cards.
- Filter menggunakan drawer.
- Table berubah menjadi card/list jika diperlukan.
- Form menggunakan full-width field.
- CTA utama dapat sticky di bawah layar.

---

# 45. Breakpoint Strategy

Gunakan breakpoint berdasarkan kebutuhan layout, bukan berdasarkan device tertentu.

Minimal:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Komponen harus tetap usable di antara breakpoint.

---

# 46. Accessibility

Sistem harus memenuhi prinsip accessibility dasar.

## Requirements

- Semantic HTML.
- Keyboard navigation.
- Visible focus state.
- Proper form labels.
- Error association.
- Alt text.
- Sufficient contrast.
- Touch target yang cukup.
- Status tidak hanya dibedakan dengan warna.

Contoh:

```text
✓ Selesai
! Menunggu Verifikasi
× Ditolak
```

bukan hanya warna.

---

# 47. Content Guidelines

Gunakan bahasa yang:

- Singkat.
- Jelas.
- Konsisten.
- Tidak teknis.
- Berorientasi tindakan.

Gunakan:

> **Laporkan Barang Hilang**

Hindari:

> Submit Data Laporan Kehilangan

Gunakan:

> **Ajukan Klaim**

Hindari:

> Create Ownership Claim Request

---

# 48. CTA Hierarchy

## Primary

- Cari Barang.
- Laporkan Barang.
- Laporkan Barang Hilang.
- Laporkan Barang Ditemukan.
- Ajukan Klaim.
- Verifikasi.
- Setujui Klaim.

## Secondary

- Lihat Detail.
- Kembali.
- Batal.
- Edit.

## Destructive

- Tolak.
- Nonaktifkan.
- Hapus.

Satu halaman tidak boleh memiliki terlalu banyak primary CTA dengan bobot visual yang sama.

---

# 49. Privacy UX

Public report tidak menampilkan:

- Nomor telepon.
- Email.
- NIM.
- Alamat pribadi.
- Bukti kepemilikan.
- Ciri khusus yang bersifat rahasia.

Gunakan informasi umum:

```text
Reporter:
Civitas Kampus
```

bukan:

```text
Reporter:
Nama Lengkap
08xxxxxxxxxx
email@example.com
```

Kontak atau informasi tambahan hanya ditampilkan sesuai kebutuhan workflow dan authorization.

---

# 50. State Matrix

Setiap screen utama minimal memiliki:

| State    | Required |
| -------- | -------- |
| Default  | ✓        |
| Loading  | ✓        |
| Empty    | ✓        |
| Error    | ✓        |
| Success  | ✓        |
| Disabled | ✓        |

Workflow admin juga membutuhkan:

| State     | Required |
| --------- | -------- |
| Pending   | ✓        |
| Verified  | ✓        |
| Rejected  | ✓        |
| Completed | ✓        |

---

# 51. Key User Flow

## Flow A — Search Found Item

```text
Home
 ↓
Search
 ↓
Search Results
 ↓
Filter
 ↓
Found Item Detail
 ↓
Recognize Item
 ↓
Claim Form
 ↓
Submit Claim
 ↓
Claim Status
```

---

# 52. Key User Flow

## Flow B — Report Lost Item

```text
Home
 ↓
Report Item
 ↓
Lost Item
 ↓
Form
 ↓
Submit
 ↓
Success
 ↓
Report Detail
 ↓
My Reports
```

---

# 53. Key User Flow

## Flow C — Report Found Item

```text
Home
 ↓
Report Item
 ↓
Found Item
 ↓
Form
 ↓
Submit
 ↓
Success
 ↓
Report Detail
 ↓
Matching / Claim
```

---

# 54. Key Admin Flow

```text
Admin Login
 ↓
Dashboard
 ↓
Pending Reports
 ↓
Report Detail
 ↓
Verify
 ↓
Active Report
 ↓
Matching Candidates
 ↓
Review Match
 ↓
Claim
 ↓
Review Claim
 ↓
Approve
 ↓
Return Item
 ↓
Complete
```

---

# 55. Design Priority

## P0 — Core Experience

1. Home.
2. Search.
3. Search results.
4. Report item.
5. Lost item form.
6. Found item form.
7. Report detail.
8. My reports.
9. Admin dashboard.
10. Admin reports.
11. Admin report detail.

## P1 — Resolution

12. Claim form.
13. My claims.
14. Claim detail.
15. Matching.
16. Matching detail.
17. Categories.
18. Activity history.

## P2 — Supporting Administration

19. User management.
20. Advanced settings.
21. Notification center.

---

# 56. Prototype Validation

Prototype pertama harus memvalidasi tiga workflow.

## User Discovery

```text
Home
 ↓
Search
 ↓
Found Item
 ↓
Claim
```

## User Reporting

```text
Home
 ↓
Report Item
 ↓
Lost / Found
 ↓
Form
 ↓
Submit
 ↓
Report Detail
```

## Admin Resolution

```text
Dashboard
 ↓
Pending Report
 ↓
Verify
 ↓
Matching
 ↓
Claim Review
 ↓
Approve
 ↓
Complete
```

Ketiga workflow tersebut harus dapat dilakukan tanpa user membutuhkan penjelasan tambahan dari operator.

---

# 57. Design Handoff Specification

Setiap screen yang masuk development harus memiliki informasi berikut:

```text
Screen Name
Route
Role
Purpose
Components
Data Required
Interactions
Validation
Permissions
States
Responsive Behavior
```

Contoh:

```text
Screen:
Report Detail

Route:
/reports/:id

Role:
User / Admin

Purpose:
Menampilkan informasi laporan.

Components:
- Image Gallery
- Report Header
- Status Badge
- Information Section
- Location
- Timeline
- Claim CTA

States:
- Loading
- Loaded
- Not Found
- Error

Permission:
Public:
Basic information

Authenticated User:
Additional permitted information

Owner:
Full report information

Admin:
Full operational information
```

---

# 58. Design Deliverables

Dokumen desain terdiri dari:

```text
PRD.md
   ↓
Design.md
   ↓
DesignSystem.md
   ↓
Wireframe / UI
   ↓
Prototype
   ↓
Development
```

`Design.md` mendefinisikan:

- Information architecture.
- Sitemap.
- Navigation.
- User flow.
- Admin flow.
- Screen inventory.
- Layout direction.
- Component architecture.
- UX rules.
- Responsive behavior.
- Accessibility.
- Handoff requirements.

`DesignSystem.md` akan mendefinisikan detail visual dan reusable UI system.

---

# 59. Final Design Direction

Produk harus diposisikan sebagai **layanan kampus yang terpercaya untuk proses lost & found**, bukan sebagai marketplace atau media sosial.

Pengalaman utama harus mengikuti prinsip:

```text
EASY TO REPORT
      ↓
EASY TO DISCOVER
      ↓
EASY TO MATCH
      ↓
SAFE TO CLAIM
      ↓
EASY TO RESOLVE
```

Setiap keputusan desain harus mendukung lima tujuan tersebut.

---

# 60. Final Design Definition

Design MVP dianggap siap masuk tahap UI implementation apabila:

- Sitemap telah konsisten dengan PRD.
- User dan Admin memiliki navigation yang jelas.
- Lost dan Found memiliki workflow terpisah.
- Search dan discovery menjadi bagian utama experience.
- Report memiliki status yang jelas.
- Matching diposisikan sebagai alat bantu.
- Claim memiliki workflow verifikasi.
- Informasi sensitif terlindungi.
- Admin memiliki operational dashboard.
- Seluruh core screen memiliki loading, empty, error, success, dan disabled state.
- Responsive behavior telah ditentukan.
- Accessibility dasar telah diperhatikan.
- Component architecture telah didefinisikan.
- Detail visual dapat dilanjutkan ke `DesignSystem.md`.

Dokumen ini menjadi baseline desain sebelum masuk ke tahap **DesignSystem → Wireframe/UI → Prototype → Development**.
