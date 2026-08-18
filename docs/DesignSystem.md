# DesignSystem.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0  
**Status:** Final  
**Platform:** Web Application  
**Reference:** `PRD.md` + `Design.md`

---

## 1. Design System Overview

Design System digunakan sebagai standar visual dan komponen untuk seluruh aplikasi Sistem Manajemen Laporan Kehilangan Barang Kampus.

Tujuan utama:

- Menjaga konsistensi UI.
- Mempercepat proses desain dan development.
- Memastikan seluruh halaman memiliki pola interaksi yang sama.
- Memudahkan implementasi menggunakan reusable components.
- Menjaga pengalaman user dan admin tetap konsisten.

Design system menggunakan pendekatan:

> **Clean + Trustworthy + Institutional + Functional**

---

## 2. Design Principles

### 2.1 Clarity First

Informasi laporan harus mudah dipahami dalam sekali lihat.

### 2.2 Consistency

Komponen yang memiliki fungsi sama harus memiliki tampilan dan perilaku yang sama.

### 2.3 Functional Minimalism

Hindari dekorasi yang tidak membantu pengguna menyelesaikan task.

### 2.4 Trust

Status, verifikasi, dan informasi penting harus terlihat jelas.

### 2.5 Progressive Disclosure

Informasi kompleks ditampilkan secara bertahap.

```text
List
 ↓
Detail
 ↓
Claim
 ↓
Verification
```

### 2.6 Accessibility

Komponen harus dapat digunakan oleh sebanyak mungkin pengguna.

---

# 3. Visual Direction

Karakter visual:

```text
Clean
   +
Modern
   +
Institutional
   +
Friendly
   +
Functional
```

Hindari:

- Gradient berlebihan.
- Glassmorphism berat.
- Shadow berlebihan.
- Animasi dekoratif.
- Layout terlalu padat.
- Tampilan seperti marketplace.
- Tampilan seperti social media.
- Tampilan dashboard enterprise yang terlalu kompleks.

Produk harus terasa seperti **layanan digital resmi kampus**.

---

# 4. Color System

Gunakan semantic color system.

## 4.1 Primary

Primary digunakan untuk:

- Action utama.
- CTA.
- Active navigation.
- Link.
- Focus indicator.
- Interactive element penting.

Color scale:

```text
Primary 50
Primary 100
Primary 200
Primary 300
Primary 400
Primary 500
Primary 600
Primary 700
Primary 800
Primary 900
```

Default:

```text
Primary 500
```

---

## 4.2 Neutral

Neutral digunakan untuk struktur interface.

```text
Neutral 0
Neutral 50
Neutral 100
Neutral 200
Neutral 300
Neutral 400
Neutral 500
Neutral 600
Neutral 700
Neutral 800
Neutral 900
Neutral 950
```

Usage:

| Token       | Usage             |
| ----------- | ----------------- |
| Neutral 0   | Surface utama     |
| Neutral 50  | Background ringan |
| Neutral 100 | Secondary surface |
| Neutral 200 | Border            |
| Neutral 300 | Divider           |
| Neutral 500 | Placeholder       |
| Neutral 600 | Secondary text    |
| Neutral 700 | Body text         |
| Neutral 900 | Heading           |
| Neutral 950 | High emphasis     |

---

## 4.3 Success

Digunakan untuk:

- Ditemukan.
- Disetujui.
- Selesai.
- Pemilik ditemukan.
- Successful action.

```text
Success 50
Success 100
Success 500
Success 600
Success 700
```

---

## 4.4 Warning

Digunakan untuk:

- Menunggu verifikasi.
- Pending.
- Klaim membutuhkan review.
- Perhatian.

```text
Warning 50
Warning 100
Warning 500
Warning 600
Warning 700
```

---

## 4.5 Danger

Digunakan untuk:

- Ditolak.
- Error.
- Hapus.
- Destructive action.

```text
Danger 50
Danger 100
Danger 500
Danger 600
Danger 700
```

---

## 4.6 Info

Digunakan untuk:

- Informasi.
- Status aktif.
- Diverifikasi.
- Informasi sistem.

```text
Info 50
Info 100
Info 500
Info 600
Info 700
```

---

## 4.7 Semantic Color Mapping

Gunakan semantic token, bukan warna langsung.

```text
Primary
Success
Warning
Danger
Info
Neutral
```

Contoh:

```text
Button             → Primary
Completed          → Success
Pending            → Warning
Rejected           → Danger
Verified           → Info
Inactive           → Neutral
```

Jangan menggunakan:

```text
blue
green
red
yellow
```

secara langsung pada component.

---

# 5. Typography

Font utama:

> **Inter**

Fallback:

```text
Inter, system-ui, sans-serif
```

Typography harus mengutamakan readability.

---

## 5.1 Typography Scale

| Token       | Size | Weight | Usage              |
| ----------- | ---: | -----: | ------------------ |
| Display     | 40px |    700 | Hero               |
| H1          | 32px |    700 | Page heading       |
| H2          | 24px |    700 | Section heading    |
| H3          | 20px |    600 | Card/section title |
| H4          | 18px |    600 | Subsection         |
| Body Large  | 16px |    400 | Important body     |
| Body        | 14px |    400 | Default body       |
| Body Medium | 14px |    500 | Emphasis           |
| Small       | 12px |    400 | Supporting text    |
| Caption     | 11px |    500 | Metadata           |

---

## 5.2 Font Weight

Gunakan:

```text
400 — Regular
500 — Medium
600 — Semibold
700 — Bold
```

Hindari terlalu banyak variasi weight.

---

## 5.3 Line Height

```text
Heading:
1.2–1.3

Body:
1.5–1.6

Caption:
1.4
```

---

# 6. Spacing System

Base unit:

> **4px**

Scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Usage:

| Spacing | Usage                   |
| ------: | ----------------------- |
|     4px | Icon ↔ text             |
|     8px | Related elements        |
|    12px | Form internals          |
|    16px | Component padding       |
|    20px | Card padding            |
|    24px | Section spacing         |
|    32px | Large section           |
|    48px | Page section            |
|    64px | Hero / major separation |
|   80px+ | Large page spacing      |

---

# 7. Layout System

Gunakan responsive container.

```text
Desktop max-width:
1200px

Large desktop:
1280px+

Tablet:
Fluid

Mobile:
100%
```

Container padding:

```text
Mobile:
16px

Tablet:
24px

Desktop:
32px
```

---

# 8. Grid System

## Desktop

Gunakan 12-column grid.

```text
┌────────────────────────────────────────────┐
│ 1  2  3  4  5  6  7  8  9  10  11  12 │
└────────────────────────────────────────────┘
```

## Tablet

Gunakan 8-column grid.

## Mobile

Gunakan 4-column grid atau single-column layout.

---

# 9. Border Radius

```text
Radius XS   = 4px
Radius SM   = 6px
Radius MD   = 8px
Radius LG   = 12px
Radius XL   = 16px
Radius Full = 9999px
```

Usage:

| Component | Radius |
| --------- | -----: |
| Input     |    8px |
| Button    |    8px |
| Card      |   12px |
| Modal     |   12px |
| Image     | 8–12px |
| Badge     |   Full |
| Avatar    |   Full |

---

# 10. Border

Default:

```text
1px solid Neutral 200
```

Strong:

```text
1px solid Neutral 300
```

Focus:

```text
2px solid Primary
```

Divider:

```text
1px solid Neutral 200
```

---

# 11. Shadow

Gunakan shadow secara minimal.

```text
Shadow SM
Shadow MD
Shadow LG
```

Usage:

### Shadow SM

- Card.
- Dropdown.

### Shadow MD

- Popover.
- Modal ringan.

### Shadow LG

- Modal.
- Floating panel.

Jangan menggunakan shadow sebagai satu-satunya pembeda antar section.

---

# 12. Iconography

Gunakan satu icon library secara konsisten.

Recommended:

> **Lucide Icons**

Style:

- Outline.
- Simple.
- Consistent stroke.
- Functional.
- Tidak dekoratif.

---

## 12.1 Icon Sizes

```text
12px — Inline metadata
16px — Default
20px — Button/navigation
24px — Section
32px — Empty state
48px+ — Illustration
```

Default:

> **20px**

---

## 12.2 Icon Rules

Icon tidak boleh menggantikan label untuk action penting.

Buruk:

```text
[ 🗑 ]
```

Lebih baik:

```text
[ 🗑 Hapus ]
```

Icon-only button diperbolehkan untuk:

- Close.
- Back.
- More.
- Search.
- Menu.

Semua icon-only button harus memiliki accessible label.

---

# 13. Button System

Hierarchy:

```text
Primary
Secondary
Ghost
Danger
```

---

## 13.1 Primary Button

Digunakan untuk action utama.

Contoh:

```text
[ Laporkan Barang ]
[ Ajukan Klaim ]
[ Simpan ]
```

Characteristics:

- Solid primary background.
- High contrast.
- Medium/semibold text.
- Radius 8px.

---

## 13.2 Secondary Button

Digunakan untuk action alternatif.

Contoh:

```text
[ Lihat Detail ]
[ Kembali ]
```

Characteristics:

- Neutral surface.
- Border.
- Primary/neutral text.

---

## 13.3 Ghost Button

Untuk action low emphasis.

Contoh:

```text
[ Batal ]
[ Lihat Semua ]
```

---

## 13.4 Danger Button

Untuk destructive action.

Contoh:

```text
[ Hapus ]
[ Tolak Laporan ]
```

Gunakan hanya untuk action destructive.

---

## 13.5 Button Size

| Size   | Height | Usage        |
| ------ | -----: | ------------ |
| Small  |   32px | Table/action |
| Medium |   40px | Default      |
| Large  |   48px | Primary CTA  |

Default:

> **40px**

Mobile primary CTA:

> **48px**

---

## 13.6 Button States

Semua button harus mendukung:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Loading example:

```text
[ ◌ Mengirim... ]
```

Button tidak dapat digunakan selama loading.

---

# 14. Input System

Components:

- Text Input.
- Textarea.
- Select.
- Search.
- Date Picker.
- Time Picker.
- Combobox.
- Checkbox.
- Radio.
- File Upload.

Default height:

> **40px**

Mobile:

> **48px**

---

## 14.1 Input Structure

```text
Label *

[ Input ]

Helper text

Error message
```

Example:

```text
Lokasi Kehilangan *

[ Perpustakaan Kampus ]

Contoh: Perpustakaan lantai 2
```

---

## 14.2 Input States

```text
Default
Hover
Focus
Filled
Disabled
Error
Success
Readonly
```

Focus harus terlihat jelas.

---

# 15. Search

Search merupakan component penting.

```text
┌──────────────────────────────────────────┐
│ 🔍  Cari barang, kategori, atau lokasi  │
└──────────────────────────────────────────┘
```

Search dapat memiliki:

- Search icon.
- Placeholder.
- Clear button.
- Loading indicator.

---

# 16. Select / Combobox

Digunakan untuk:

- Category.
- Location.
- Status.
- Type.
- Filter.

Jika jumlah opsi besar, gunakan combobox dengan search.

---

# 17. File Upload

Gunakan dropzone pada desktop dan standard file picker pada mobile.

```text
┌──────────────────────────────────────────┐
│                                          │
│                 ↑ Upload                 │
│                                          │
│          Upload foto barang              │
│          JPG/PNG                         │
│                                          │
└──────────────────────────────────────────┘
```

Setelah upload:

```text
┌─────────────┐
│             │
│    IMAGE    │
│             │
└─────────────┘
    Hapus
```

---

# 18. Form Layout

## Desktop

```text
┌──────────────────────────────────────────────┐
│ Form                                         │
│                                              │
│ [Field]              [Field]                 │
│                                              │
│ [Field]              [Field]                 │
│                                              │
│ [Textarea.................................]  │
│                                              │
│ [Upload...................................]  │
│                                              │
│                    [ Batal ] [ Submit ]      │
└──────────────────────────────────────────────┘
```

## Mobile

```text
[Field]

[Field]

[Field]

[Textarea]

[Upload]

[ Submit ]
```

---

# 19. Card System

Card digunakan untuk:

- Report.
- Claim.
- Matching.
- Dashboard summary.

Default:

```text
Background: Neutral 0
Border: Neutral 200
Radius: 12px
Padding: 20px
```

---

# 20. Report Card

Structure:

```text
Image
 ↓
Type Badge
 ↓
Title
 ↓
Category
 ↓
Location + Date
 ↓
Status
```

Card tidak menampilkan informasi pribadi.

---

# 21. Status Badge

Badge digunakan untuk status, bukan action.

Examples:

```text
[ ✓ Selesai ]
[ ! Menunggu ]
[ • Aktif ]
[ × Ditolak ]
```

Recommended:

```text
Height: 24–28px
Radius: Full
```

---

## 21.1 Status Mapping

| Status              | Color Token |
| ------------------- | ----------- |
| Menunggu Verifikasi | Warning     |
| Diverifikasi        | Info        |
| Aktif               | Info        |
| Belum Ditemukan     | Neutral     |
| Ditemukan           | Success     |
| Klaim               | Warning     |
| Pemilik Ditemukan   | Success     |
| Selesai             | Success     |
| Ditolak             | Danger      |
| Dibatalkan          | Neutral     |

---

# 22. Type Badge

Report type berbeda dengan status.

Contoh:

```text
[ BARANG HILANG ]
[ BARANG DITEMUKAN ]
```

Type badge tidak boleh lebih dominan daripada judul laporan.

---

# 23. Table System

Table digunakan terutama untuk admin.

Features:

- Header.
- Sorting.
- Filter.
- Pagination.
- Row hover.
- Row action.

Example:

```text
┌────────┬────────────┬────────┬──────────────┬────────┐
│ ID     │ Item       │ Type   │ Status       │ Action │
├────────┼────────────┼────────┼──────────────┼────────┤
│ LR-001 │ Laptop     │ Lost   │ Pending      │ View   │
│ FR-002 │ Wallet     │ Found  │ Active       │ View   │
└────────┴────────────┴────────┴──────────────┴────────┘
```

---

## 23.1 Responsive Table

Desktop:

> Table.

Mobile:

> Card/List.

Jangan memaksakan table horizontal jika data dapat disederhanakan menjadi card.

---

# 24. Modal

Modal digunakan untuk:

- Confirmation.
- Short form.
- Important warning.
- Admin review.

Structure:

```text
┌──────────────────────────────────────┐
│ Title                            ×   │
├──────────────────────────────────────┤
│                                      │
│ Content                              │
│                                      │
├──────────────────────────────────────┤
│              [Cancel] [Confirm]      │
└──────────────────────────────────────┘
```

---

# 25. Drawer

Drawer digunakan untuk:

- Mobile filter.
- Mobile navigation.
- Secondary controls.

Drawer tidak digunakan untuk form kompleks jika halaman penuh lebih sesuai.

---

# 26. Toast

Toast digunakan untuk feedback singkat.

Success:

```text
✓ Laporan berhasil disimpan.
```

Error:

```text
× Gagal menyimpan laporan.
```

Toast tidak boleh menjadi satu-satunya tempat untuk informasi penting.

---

# 27. Alert

Alert digunakan untuk informasi yang membutuhkan perhatian.

Example:

```text
┌────────────────────────────────────────────┐
│ ! Laporan sedang menunggu verifikasi admin │
└────────────────────────────────────────────┘
```

---

# 28. Empty State

Structure:

```text
Icon / Illustration
Heading
Description
CTA
```

Example:

```text
        [ ICON ]

     Belum Ada Laporan

Anda belum membuat laporan kehilangan
atau penemuan barang.

     [ Buat Laporan ]
```

---

# 29. Loading

Gunakan:

- Skeleton untuk content.
- Spinner untuk action.

Skeleton:

```text
┌────────────────────────────┐
│ █████████████              │
│ ██████████                 │
│ █████████████████          │
└────────────────────────────┘
```

Jangan menampilkan full-page spinner jika hanya sebagian data yang sedang dimuat.

---

# 30. Error State

Example:

```text
        [ ICON ]

    Gagal Memuat Data

Data tidak dapat dimuat saat ini.

       [ Coba Lagi ]
```

Error harus actionable.

---

# 31. Pagination

Default:

```text
[ Previous ]  1  2  3  ...  10  [ Next ]
```

Mobile:

```text
[ Previous ]  Page 2 of 10  [ Next ]
```

---

# 32. Filter

Filter dapat menggunakan:

- Select.
- Checkbox.
- Date range.
- Search.

Desktop:

```text
[Type] [Status] [Category] [Location] [Date]
```

Mobile:

```text
[ Filter (3) ]
```

---

# 33. Navigation

## User

Gunakan top navigation/navbar.

## Admin

Gunakan sidebar navigation.

## Breadcrumb

Digunakan pada halaman detail/admin.

Example:

```text
Reports / Lost Items / LR-2026-001
```

---

# 34. Dashboard Metric Card

Admin dashboard menggunakan metric card.

```text
┌──────────────────────┐
│ Total Reports        │
│                      │
│ 245                  │
│ ↑ 12%                │
└──────────────────────┘
```

Metric card harus sederhana dan informatif.

---

# 35. Timeline

Digunakan untuk:

- Report activity.
- Claim activity.
- Status changes.

Example:

```text
● Report created
│
● Report verified
│
● Possible match found
│
● Claim submitted
│
● Claim approved
```

---

# 36. Image Gallery

Detail report menggunakan gallery.

Desktop:

```text
┌───────────────────────────────┐
│                               │
│          MAIN IMAGE           │
│                               │
└───────────────────────────────┘

[IMG] [IMG] [IMG]
```

Mobile:

```text
┌────────────────────┐
│                    │
│    MAIN IMAGE      │
│                    │
└────────────────────┘

   ● ○ ○
```

---

# 37. Avatar

Avatar hanya digunakan jika diperlukan.

Default:

- Initials.
- Generic user icon.

Jangan menggunakan avatar sebagai elemen dekoratif utama.

---

# 38. Tooltip

Tooltip digunakan untuk menjelaskan icon-only action.

Example:

```text
[ ⋮ ]
```

Tooltip:

> Opsi lainnya

Tooltip tidak boleh menjadi satu-satunya tempat informasi penting.

---

# 39. Accessibility

## 39.1 Color Contrast

Text utama harus memiliki contrast yang memadai terhadap background.

## 39.2 Focus

Semua interactive element harus memiliki visible focus state.

## 39.3 Keyboard

User harus dapat menggunakan:

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow keys
```

## 39.4 Forms

Setiap input harus memiliki label.

## 39.5 Images

Semua image harus memiliki alt text yang relevan.

---

# 40. Touch Target

Minimum interactive target:

> **44 × 44px**

Untuk mobile.

Icon visual dapat berukuran lebih kecil, tetapi clickable area harus tetap cukup besar.

---

# 41. Motion

Animation harus minimal dan fungsional.

Gunakan untuk:

- Modal.
- Drawer.
- Dropdown.
- Toast.
- Loading.
- State transition.

Hindari:

- Animasi dekoratif.
- Parallax.
- Auto-playing animation.
- Excessive bouncing.

---

## 41.1 Motion Timing

```text
Micro interaction:
100–150ms

Component transition:
150–250ms

Modal / Drawer:
200–300ms
```

---

# 42. Responsive Tokens

## Mobile

```text
Container: 16px
Card padding: 16px
Button height: 48px
Grid: 1 column
```

## Tablet

```text
Container: 24px
Card padding: 20px
Grid: 2 columns
```

## Desktop

```text
Container: 32px
Card padding: 20–24px
Grid: 3–4 columns
```

---

# 43. Z-Index

Gunakan z-index token.

```text
Base        0
Dropdown    100
Sticky      200
Overlay     300
Modal       400
Toast       500
```

Jangan menggunakan angka z-index random.

---

# 44. Layer System

```text
Page
 ↓
Sticky Navigation
 ↓
Dropdown / Popover
 ↓
Overlay
 ↓
Modal
 ↓
Toast
```

---

# 45. Form Validation

Validation message harus:

- Singkat.
- Spesifik.
- Berorientasi solusi.

Buruk:

```text
Invalid input.
```

Lebih baik:

```text
Lokasi kehilangan harus diisi.
```

Buruk:

```text
Error.
```

Lebih baik:

```text
Format file tidak didukung. Gunakan JPG atau PNG.
```

---

# 46. Destructive Action

Destructive action harus:

1. Menggunakan danger styling.
2. Memiliki confirmation jika irreversible.
3. Menjelaskan dampak.
4. Menggunakan wording yang jelas.

Example:

```text
Tolak Laporan
```

bukan:

```text
Process
```

---

# 47. Privacy

Informasi sensitif harus dilindungi.

Contoh:

```text
Nomor kontak
08••••••••
```

Informasi kontak user tidak ditampilkan pada public report secara default.

---

# 48. Report Status Component

Report status harus menampilkan:

```text
Status
+
Context
```

Example:

```text
[ ! Menunggu Verifikasi ]

Laporan sedang diperiksa oleh admin.
```

---

# 49. Claim Status

Flow:

```text
Menunggu Review
      ↓
Disetujui
      ↓
Selesai
```

atau:

```text
Menunggu Review
      ↓
Ditolak
```

Status harus ditampilkan pada:

- Claim card.
- Claim detail.
- My Claims.
- Admin Claims.

---

# 50. Matching Component

Matching component menggunakan dua report card berdampingan.

```text
┌──────────────────┐      ┌──────────────────┐
│ BARANG HILANG    │      │ BARANG DITEMUKAN │
│                  │      │                  │
│ Laptop ASUS      │ ↔    │ Laptop ASUS      │
│ Gedung A         │      │ Gedung A         │
└──────────────────┘      └──────────────────┘
```

Di bawahnya:

```text
Matched:

✓ Category
✓ Location
✓ Date proximity
△ Description
```

Matching pada MVP tetap berbasis data yang dimasukkan pengguna dan rule sederhana, bukan AI.

---

# 51. Component Naming Convention

Gunakan nama berdasarkan fungsi.

Contoh:

```text
Button
Input
Select
ReportCard
ReportStatusBadge
ReportTypeBadge
ReportTable
ReportDetail
ClaimCard
ClaimStatusBadge
ClaimReview
MatchingCard
MatchingDetail
EmptyState
ErrorState
```

Hindari:

```text
BlueButton
BigCard
Box1
CustomThing
```

Nama harus menjelaskan purpose, bukan visual.

---

# 52. Component Variants

Komponen menggunakan variant.

Example:

```text
Button
├── primary
├── secondary
├── ghost
└── danger
```

Status:

```text
StatusBadge
├── pending
├── active
├── found
├── completed
├── rejected
└── cancelled
```

---

# 53. Component Composition

Komponen harus reusable.

Example:

```text
ReportCard
├── ReportImage
├── ReportTypeBadge
├── ReportTitle
├── ReportMeta
└── ReportStatusBadge
```

Hindari membuat satu component besar yang menangani seluruh halaman.

---

# 54. Component States

Setiap interactive component harus memiliki state yang jelas.

Input:

```text
Default
Focused
Filled
Error
Disabled
Readonly
```

Button:

```text
Default
Hover
Active
Focus
Disabled
Loading
```

---

# 55. Token Architecture

Design token dibagi menjadi tiga layer:

```text
Primitive Tokens
       ↓
Semantic Tokens
       ↓
Component Tokens
```

Contoh:

```text
Primitive:
blue-500

↓

Semantic:
primary

↓

Component:
button-primary-background
```

---

# 56. Primitive Tokens

Primitive token menyimpan nilai dasar.

Contoh:

```text
color.blue.500
color.gray.700
spacing.4
spacing.8
radius.md
font.size.14
```

Primitive token tidak digunakan langsung pada business component jika semantic token tersedia.

---

# 57. Semantic Tokens

Semantic token mendefinisikan maksud.

Contoh:

```text
color.background
color.surface
color.text.primary
color.text.secondary
color.border
color.primary
color.success
color.warning
color.danger
color.info
```

---

# 58. Component Tokens

Component token digunakan untuk detail component.

Contoh:

```text
button.primary.background
button.primary.text
button.primary.border

input.background
input.border
input.focus

card.background
card.border
card.radius
```

---

# 59. Theme Strategy

Minimum theme:

```text
Light Theme
```

Dark mode tidak termasuk MVP.

Namun struktur token harus memungkinkan penambahan dark mode di masa depan.

---

# 60. Design Token Example

```text
color.primary
color.background
color.surface
color.text.primary
color.text.secondary
color.border

spacing.xs
spacing.sm
spacing.md
spacing.lg
spacing.xl

radius.sm
radius.md
radius.lg

shadow.sm
shadow.md
shadow.lg
```

---

# 61. Page-Level Composition

Page tidak boleh mendefinisikan visual token baru secara sembarangan.

Example:

```text
Page
 ├── Header
 ├── Search
 ├── Filter
 ├── Content
 │    └── ReportCard
 └── Pagination
```

Semua visual harus berasal dari Design System.

---

# 62. Admin Design Language

Admin menggunakan component yang sama dengan user tetapi memiliki density lebih tinggi.

### User

- Lebih visual.
- Card oriented.
- Discovery oriented.
- Larger CTA.

### Admin

- Data oriented.
- Table oriented.
- Dense.
- Operational actions.

Tetap gunakan token dan component yang sama.

---

# 63. User vs Admin Density

| Area       | User     | Admin    |
| ---------- | -------- | -------- |
| Card       | Spacious | Compact  |
| Table      | Minimal  | Primary  |
| CTA        | Large    | Medium   |
| Metadata   | Limited  | Detailed |
| Filters    | Simple   | Advanced |
| Navigation | Top      | Sidebar  |

---

# 64. Content Density

User-facing page harus menjaga cognitive load rendah.

Admin dapat memiliki informasi lebih banyak karena workflow bersifat operational.

Informasi tetap harus dikelompokkan berdasarkan konteks.

---

# 65. Loading / Empty / Error / Success

Semua feature harus mengikuti pola:

```text
Loading
   ↓
Success
   ↓
Empty
```

Jika gagal:

```text
Loading
   ↓
Error
   ↓
Retry
```

Semua halaman harus memiliki feedback yang konsisten.

---

# 66. UX Copy Standard

Gunakan istilah konsisten.

| Concept      | Standard Term            |
| ------------ | ------------------------ |
| Lost report  | Laporan Barang Hilang    |
| Found report | Laporan Barang Ditemukan |
| Claim        | Klaim                    |
| Matching     | Pencocokan               |
| Verification | Verifikasi               |
| Report       | Laporan                  |
| Status       | Status                   |
| Admin        | Admin                    |
| User         | Pengguna                 |

---

# 67. Status Copy Standard

Gunakan:

```text
Menunggu Verifikasi
Diverifikasi
Aktif
Belum Ditemukan
Ditemukan
Klaim Menunggu Review
Disetujui
Ditolak
Selesai
Dibatalkan
```

Jangan mencampurkan istilah untuk status yang sama.

Contoh yang harus dihindari:

```text
Pending
Menunggu
In Progress
Dalam Proses
```

jika semuanya memiliki arti yang sama.

---

# 68. Date & Time Format

Gunakan format Indonesia.

Full:

```text
18 Agustus 2026
18 Agustus 2026, 14.30
```

Compact:

```text
18 Agu 2026
```

---

# 69. Location Display

Gunakan hierarchy:

```text
Gedung
→ Area
→ Detail lokasi
```

Example:

```text
Gedung A · Perpustakaan · Lantai 2
```

Hindari lokasi terlalu panjang pada card.

---

# 70. Accessibility Labels

Icon-only control harus memiliki accessible name.

Example:

```text
[ X ]
```

Accessible label:

```text
Tutup
```

Example:

```text
[ ⋮ ]
```

Accessible label:

```text
Opsi lainnya
```

---

# 71. Focus Management

Modal:

```text
Open modal
 ↓
Focus first meaningful element
 ↓
Trap focus
 ↓
Close
 ↓
Return focus to trigger
```

Drawer memiliki pola yang sama.

---

# 72. Keyboard Support

Minimum keyboard support:

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow keys
```

Shortcut kompleks tidak diperlukan pada MVP.

---

# 73. Responsive Behavior

## Report Card

```text
Desktop:
3–4 column grid

Tablet:
2 column grid

Mobile:
1 column
```

## Admin Table

```text
Desktop:
Table

Tablet:
Compressed table

Mobile:
Card/List
```

---

# 74. Design QA Checklist

## Visual

- [ ] Typography sesuai token.
- [ ] Spacing sesuai scale.
- [ ] Color menggunakan semantic token.
- [ ] Radius konsisten.
- [ ] Icon konsisten.
- [ ] Button hierarchy benar.

## UX

- [ ] Primary action jelas.
- [ ] Status terlihat.
- [ ] Error mudah dipahami.
- [ ] Empty state tersedia.
- [ ] Loading state tersedia.
- [ ] Success feedback tersedia.

## Accessibility

- [ ] Label form tersedia.
- [ ] Focus state tersedia.
- [ ] Contrast cukup.
- [ ] Keyboard navigation.
- [ ] Touch target cukup.
- [ ] Icon memiliki accessible label.

## Responsive

- [ ] Mobile.
- [ ] Tablet.
- [ ] Desktop.
- [ ] No overflow.
- [ ] Form usable.
- [ ] Table usable.

---

# 75. Development Handoff

Recommended component structure:

```text
components/
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Badge
│   ├── Card
│   ├── Modal
│   ├── Drawer
│   ├── Toast
│   └── Table
│
├── report/
│   ├── ReportCard
│   ├── ReportStatus
│   ├── ReportType
│   ├── ReportTable
│   └── ReportDetail
│
├── claim/
│   ├── ClaimCard
│   ├── ClaimStatus
│   └── ClaimReview
│
└── matching/
    ├── MatchingCard
    └── MatchingDetail
```

---

# 76. Design-to-Code Rules

Developer harus:

1. Menggunakan existing component sebelum membuat component baru.
2. Menggunakan design token.
3. Tidak membuat warna arbitrary.
4. Tidak membuat spacing arbitrary.
5. Tidak membuat radius arbitrary.
6. Mengikuti component variants.
7. Menjaga responsive behavior.
8. Menjaga accessibility.
9. Menambahkan state yang telah ditentukan.
10. Menghindari duplicate component.

---

# 77. When to Create a New Component

Buat component baru jika:

- Digunakan minimal pada dua tempat.
- Memiliki behavior khusus.
- Memiliki visual structure yang jelas.
- Tidak dapat direpresentasikan dengan existing component.

Jangan membuat component baru hanya karena:

- Ukuran berbeda.
- Text berbeda.
- Data berbeda.

Gunakan props atau variants.

---

# 78. Final Component Inventory

## Foundations

- Color.
- Typography.
- Spacing.
- Radius.
- Shadow.
- Icon.
- Breakpoint.
- Z-index.

## Core UI

- Button.
- Input.
- Textarea.
- Select.
- Combobox.
- Checkbox.
- Radio.
- Date Picker.
- Time Picker.
- File Upload.
- Badge.
- Card.
- Avatar.
- Tooltip.
- Divider.

## Navigation

- Navbar.
- Sidebar.
- Breadcrumb.
- Tabs.
- Pagination.

## Feedback

- Alert.
- Toast.
- Modal.
- Drawer.
- Skeleton.
- Empty State.
- Error State.

## Product Components

- Report Card.
- Report Status.
- Report Type.
- Report Table.
- Report Detail.
- Claim Card.
- Claim Status.
- Claim Review.
- Matching Card.
- Matching Detail.
- Activity Timeline.
- Dashboard Metric.

---

# 79. Final Design System Rules

Semua UI pada aplikasi harus mengikuti aturan berikut:

```text
1. Use semantic tokens
2. Reuse components
3. Keep hierarchy clear
4. Keep primary actions obvious
5. Keep status visible
6. Protect sensitive information
7. Design mobile-first behavior
8. Support loading / empty / error / success
9. Maintain accessibility
10. Avoid unnecessary visual decoration
```

---

# 80. Final Design Direction

Design System menggunakan visual language:

> **Clean, trustworthy, institutional, accessible, and functional.**

Product experience:

```text
SEARCH
  ↓
REPORT
  ↓
VERIFY
  ↓
MATCH
  ↓
CLAIM
  ↓
RESOLVE
```

Design workflow:

```text
PRD.md
   ↓
Design.md
   ↓
DesignSystem.md
   ↓
UI Components
   ↓
Screens
   ↓
Prototype
   ↓
Development
```

`DesignSystem.md` menjadi **single source of truth** untuk:

- Visual language.
- Design tokens.
- Typography.
- Color.
- Spacing.
- Components.
- Component states.
- Responsive behavior.
- Accessibility.
- UX copy.
- Design-to-code rules.

Semua halaman dan component baru harus mengikuti aturan dalam dokumen ini.
