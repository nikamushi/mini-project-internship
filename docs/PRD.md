# Product Requirements Document (PRD)

## Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0
**Status:** Final
**Platform:** Web Application
**Document:** `PRD.md`

---

# 1. Product Overview

Sistem Manajemen Laporan Kehilangan Barang Kampus adalah aplikasi berbasis web yang menyediakan tempat terpusat untuk melaporkan, mencari, memantau, dan mengelola barang hilang maupun barang ditemukan di lingkungan kampus.

Sistem memiliki dua jenis laporan utama:

1. **Barang Hilang (Lost Item)** — laporan dari pengguna yang kehilangan barang.
2. **Barang Ditemukan (Found Item)** — laporan dari pengguna yang menemukan barang.

Sistem membantu mempertemukan kedua jenis laporan tersebut melalui informasi barang, kategori, lokasi, waktu, dan ciri-ciri barang. Proses verifikasi dan penyelesaian klaim dilakukan dengan melibatkan admin kampus.

---

# 2. Background

Proses pelaporan kehilangan barang di lingkungan kampus masih sering dilakukan secara manual melalui:

- Penyampaian langsung kepada pihak kampus.
- Chat pribadi.
- Grup mahasiswa.
- Grup komunikasi kampus.
- Pengumuman secara informal.

Cara tersebut menyebabkan informasi barang hilang dan ditemukan tersebar di berbagai tempat.

Ketika sebuah barang ditemukan, informasi tersebut belum tentu sampai kepada pemiliknya. Sebaliknya, ketika seseorang kehilangan barang, pemilik harus mencari informasi melalui berbagai sumber.

Pihak kampus juga mengalami kesulitan ketika jumlah laporan semakin banyak karena proses pencatatan, pencarian, verifikasi, dan pemantauan masih dilakukan secara manual.

Oleh karena itu, dibutuhkan sistem terpusat yang dapat mengelola seluruh proses tersebut secara terstruktur.

---

# 3. Problem Statement

Mahasiswa dan civitas kampus membutuhkan cara yang mudah dan terstruktur untuk:

- Melaporkan barang hilang.
- Melaporkan barang ditemukan.
- Mencari informasi barang.
- Mengetahui perkembangan laporan.
- Mengklaim barang yang ditemukan.

Pihak kampus membutuhkan sistem yang dapat membantu:

- Mengumpulkan laporan.
- Memverifikasi laporan.
- Mengelola status.
- Mencocokkan barang hilang dengan barang ditemukan.
- Memproses klaim.
- Memantau laporan secara keseluruhan.

---

# 4. Product Goals

## 4.1 Primary Goal

Menyediakan platform terpusat untuk mengelola proses kehilangan dan penemuan barang di lingkungan kampus.

## 4.2 Secondary Goals

1. Mengurangi ketergantungan terhadap pelaporan manual.
2. Memusatkan data barang hilang dan ditemukan.
3. Mempermudah pencarian informasi barang.
4. Membantu proses pencocokan barang.
5. Meningkatkan kemungkinan barang kembali kepada pemilik.
6. Mempermudah admin mengelola laporan.
7. Memberikan transparansi status laporan kepada pengguna.

---

# 5. Target Users

## 5.1 Mahasiswa / Civitas Kampus

Pengguna yang dapat:

- Melaporkan barang hilang.
- Melaporkan barang ditemukan.
- Mencari barang.
- Melihat detail laporan.
- Mengajukan klaim.
- Memantau laporan miliknya.

## 5.2 Admin Kampus

Pengelola sistem yang bertanggung jawab terhadap:

- Verifikasi laporan.
- Pengelolaan laporan.
- Monitoring laporan.
- Proses matching.
- Verifikasi klaim.
- Penyelesaian laporan.

---

# 6. User Roles & Permissions

| Fitur                        | User | Admin |
| ---------------------------- | :--: | :---: |
| Melihat laporan publik       |  ✓   |   ✓   |
| Mencari laporan              |  ✓   |   ✓   |
| Filter laporan               |  ✓   |   ✓   |
| Membuat laporan hilang       |  ✓   |   ✓   |
| Membuat laporan ditemukan    |  ✓   |   ✓   |
| Melihat laporan sendiri      |  ✓   |   ✓   |
| Mengubah laporan sendiri     | ✓\*  |   ✓   |
| Mengajukan klaim             |  ✓   |   ✓   |
| Melihat status klaim sendiri |  ✓   |   ✓   |
| Melihat seluruh laporan      |  -   |   ✓   |
| Verifikasi laporan           |  -   |   ✓   |
| Mengubah status laporan      |  -   |   ✓   |
| Mengelola laporan            |  -   |   ✓   |
| Memproses klaim              |  -   |   ✓   |
| Monitoring matching          |  -   |   ✓   |
| Dashboard administrasi       |  -   |   ✓   |

`*` Perubahan hanya diperbolehkan selama laporan belum masuk tahap tertentu yang dikunci oleh sistem.

---

# 7. Product Scope

## 7.1 In Scope

### User

- Authentication.
- Dashboard/beranda.
- Membuat laporan barang hilang.
- Membuat laporan barang ditemukan.
- Upload foto.
- Melihat daftar laporan.
- Search.
- Filter.
- Detail laporan.
- Riwayat laporan.
- Monitoring status.
- Pengajuan klaim.

### Admin

- Authentication admin.
- Dashboard.
- Manajemen laporan.
- Verifikasi laporan.
- Manajemen status.
- Matching laporan.
- Manajemen klaim.
- Verifikasi klaim.
- Penyelesaian laporan.

### System

- Penyimpanan data laporan.
- Penyimpanan foto.
- Search dan filter.
- Matching berdasarkan data.
- Role-based access control.
- Status management.

---

# 8. Out of Scope

Fitur berikut tidak termasuk dalam MVP:

1. Native Android application.
2. Native iOS application.
3. Integrasi dengan sistem akademik kampus.
4. Integrasi dengan database mahasiswa kampus.
5. AI-based matching.
6. Computer vision untuk mengenali barang.
7. Real-time GPS tracking.
8. CCTV integration.
9. Sistem pembayaran.
10. Sistem pengiriman barang.
11. Marketplace.
12. Validasi kepemilikan secara hukum.
13. Integrasi dengan pihak eksternal.

---

# 9. Core Concept

Sistem menggunakan dua entitas laporan utama.

## 9.1 Lost Item

Laporan yang dibuat ketika pengguna kehilangan barang.

Informasi:

- Nama barang.
- Kategori.
- Deskripsi.
- Ciri-ciri.
- Lokasi kehilangan.
- Waktu kehilangan.
- Foto.
- Informasi tambahan.

## 9.2 Found Item

Laporan yang dibuat ketika pengguna menemukan barang.

Informasi:

- Nama/deskripsi barang.
- Kategori.
- Kondisi barang.
- Lokasi ditemukan.
- Waktu ditemukan.
- Foto.
- Informasi tambahan.

---

# 10. Core User Journey

```text
User
 │
 ├── Lost Item
 │      │
 │      ▼
 │   Submit Report
 │      │
 │      ▼
 │   Admin Verification
 │      │
 │      ▼
 │   Published
 │      │
 │      ▼
 │   Matching
 │      │
 │      ▼
 │   Claim
 │      │
 │      ▼
 │   Verification
 │      │
 │      ▼
 │   Returned
 │      │
 │      ▼
 │   Completed
 │
 └── Found Item
        │
        ▼
     Submit Report
        │
        ▼
     Admin Verification
        │
        ▼
     Published
        │
        ▼
     Matching
        │
        ▼
     Claim
        │
        ▼
     Verification
        │
        ▼
     Returned
        │
        ▼
     Completed
```

---

# 11. Functional Requirements

## FR-01 Authentication

Sistem harus menyediakan mekanisme autentikasi untuk pengguna dan admin.

### User

User dapat:

- Login.
- Logout.
- Mengakses fitur sesuai hak akses.

### Admin

Admin memiliki akses khusus ke area administrasi.

---

# 12. FR-02 Dashboard / Beranda User

Sistem menyediakan halaman utama yang memungkinkan pengguna:

- Melihat ringkasan laporan.
- Mengakses laporan barang hilang.
- Mengakses laporan barang ditemukan.
- Mencari barang.
- Membuat laporan baru.
- Melihat laporan miliknya.

---

# 13. FR-03 Membuat Laporan Barang Hilang

User dapat membuat laporan kehilangan.

### Required Data

- Nama barang.
- Kategori.
- Deskripsi.
- Ciri-ciri.
- Lokasi kehilangan.
- Waktu kehilangan.

### Optional Data

- Foto.
- Informasi tambahan.

Setelah submit, sistem membuat laporan dengan status:

**Menunggu Verifikasi**

---

# 14. FR-04 Membuat Laporan Barang Ditemukan

User dapat membuat laporan barang ditemukan.

### Required Data

- Nama/deskripsi barang.
- Kategori.
- Lokasi ditemukan.
- Waktu ditemukan.
- Kondisi barang.

### Optional Data

- Foto.
- Informasi tambahan.

Setelah submit, sistem membuat laporan dengan status:

**Menunggu Verifikasi**

---

# 15. FR-05 Upload Foto

User dapat mengunggah foto barang pada laporan.

Foto digunakan untuk membantu identifikasi barang.

Sistem harus melakukan validasi terhadap:

- Format file.
- Ukuran file.
- Jumlah file sesuai batas yang ditentukan.

---

# 16. FR-06 Daftar Laporan

Sistem menyediakan daftar laporan barang.

Setiap item minimal menampilkan:

- Foto.
- Nama/deskripsi barang.
- Kategori.
- Jenis laporan.
- Lokasi.
- Waktu.
- Status.

---

# 17. FR-07 Search

User dapat melakukan pencarian laporan menggunakan kata kunci.

Pencarian dapat mencakup:

- Nama barang.
- Deskripsi.
- Ciri-ciri.
- Kategori.

---

# 18. FR-08 Filter

Sistem menyediakan filter berdasarkan:

- Jenis laporan.
- Kategori.
- Lokasi.
- Status.
- Periode waktu.

Filter dapat dikombinasikan.

---

# 19. FR-09 Detail Laporan

Sistem menyediakan halaman detail laporan.

Informasi yang ditampilkan meliputi:

- ID laporan.
- Jenis laporan.
- Nama barang.
- Foto.
- Kategori.
- Deskripsi.
- Ciri-ciri.
- Lokasi.
- Waktu.
- Status.
- Tanggal laporan.

Informasi sensitif yang dapat digunakan untuk validasi kepemilikan tidak boleh ditampilkan secara publik.

---

# 20. FR-10 Riwayat Laporan

User dapat melihat seluruh laporan yang pernah dibuat.

Informasi:

- ID laporan.
- Jenis laporan.
- Barang.
- Tanggal.
- Status.
- Status akhir.

---

# 21. FR-11 Monitoring Status

User dapat melihat perkembangan laporan miliknya.

Status utama:

```text
Menunggu Verifikasi
        ↓
Diverifikasi
        ↓
Aktif
        ↓
Ditemukan / Pemilik Ditemukan
        ↓
Klaim
        ↓
Selesai
```

Status dapat berbeda berdasarkan jenis laporan.

---

# 22. FR-12 Matching

Sistem membantu menemukan kemungkinan kecocokan antara:

**Lost Item ↔ Found Item**

Matching MVP dilakukan berdasarkan data terstruktur.

### Parameter

- Kategori.
- Nama barang.
- Deskripsi.
- Ciri-ciri.
- Lokasi.
- Waktu.

Sistem dapat memberikan daftar kemungkinan kecocokan kepada admin.

Matching tidak dianggap sebagai bukti kepemilikan.

Keputusan akhir tetap melalui proses verifikasi.

---

# 23. FR-13 Pengajuan Klaim

User dapat mengajukan klaim terhadap barang yang ditemukan.

User harus memberikan informasi yang dapat digunakan untuk membuktikan kepemilikan.

Contoh:

- Ciri khusus barang.
- Detail barang yang tidak ditampilkan publik.
- Bukti kepemilikan jika tersedia.
- Informasi tambahan.

Setelah pengajuan, status klaim menjadi:

**Menunggu Verifikasi**

---

# 24. FR-14 Verifikasi Klaim

Admin dapat:

- Melihat detail klaim.
- Melihat informasi pendukung.
- Membandingkan informasi klaim dengan laporan.
- Menyetujui klaim.
- Menolak klaim.
- Memberikan catatan.

---

# 25. FR-15 Verifikasi Laporan

Admin melakukan pemeriksaan terhadap laporan.

Admin dapat:

- Menyetujui laporan.
- Menolak laporan.
- Meminta perbaikan informasi.
- Menonaktifkan laporan.

Laporan yang telah diverifikasi dapat ditampilkan pada daftar laporan aktif.

---

# 26. FR-16 Manajemen Laporan Admin

Admin dapat:

- Melihat seluruh laporan.
- Search laporan.
- Filter laporan.
- Membuka detail laporan.
- Mengubah status.
- Menonaktifkan laporan.
- Melihat riwayat laporan.
- Melihat kemungkinan matching.

---

# 27. FR-17 Dashboard Admin

Dashboard menyediakan informasi:

### Report Summary

- Total laporan.
- Laporan barang hilang.
- Laporan barang ditemukan.
- Laporan aktif.
- Laporan selesai.

### Verification

- Menunggu verifikasi.
- Ditolak.

### Claim

- Klaim baru.
- Klaim diproses.
- Klaim selesai.

### Matching

- Kandidat matching.
- Matching yang membutuhkan review.

---

# 28. FR-18 Audit / Activity History

Sistem menyimpan aktivitas penting terhadap laporan.

Contoh aktivitas:

- Laporan dibuat.
- Laporan diverifikasi.
- Status diubah.
- Klaim dibuat.
- Klaim diverifikasi.
- Laporan diselesaikan.
- Laporan dinonaktifkan.

Riwayat aktivitas dapat digunakan admin untuk mengetahui perubahan yang terjadi pada laporan.

---

# 29. Status Management

## 29.1 Lost Item

```text
Menunggu Verifikasi
        ↓
Diverifikasi
        ↓
Belum Ditemukan
        ↓
Ditemukan
        ↓
Klaim
        ↓
Selesai
```

Alternative terminal state:

```text
Ditolak
Dibatalkan
```

## 29.2 Found Item

```text
Menunggu Verifikasi
        ↓
Diverifikasi
        ↓
Disimpan
        ↓
Pemilik Ditemukan
        ↓
Klaim
        ↓
Selesai
```

Alternative terminal state:

```text
Ditolak
Dibatalkan
```

---

# 30. Claim Status

Status klaim:

```text
Menunggu Verifikasi
        ↓
Dalam Review
        ↓
Disetujui
        ↓
Selesai
```

Alternative:

```text
Ditolak
Dibatalkan
```

---

# 31. Admin Workflow

```text
Admin Login
    ↓
Dashboard
    ↓
Review Laporan Baru
    ↓
Verifikasi
    │
    ├── Tolak
    │
    └── Setujui
           ↓
        Laporan Aktif
           ↓
      Monitor Matching
           ↓
      Review Klaim
           ↓
      Verifikasi Klaim
           │
           ├── Tolak
           │
           └── Setujui
                  ↓
             Barang Dikembalikan
                  ↓
                Selesai
```

---

# 32. Data Requirements

## 32.1 User

| Field      | Description            |
| ---------- | ---------------------- |
| user_id    | Unique user identifier |
| name       | Nama pengguna          |
| email      | Email pengguna         |
| role       | User/Admin             |
| status     | Status akun            |
| created_at | Waktu dibuat           |
| updated_at | Waktu diperbarui       |

---

## 32.2 Report

| Field           | Description               |
| --------------- | ------------------------- |
| report_id       | Unique report identifier  |
| user_id         | Pembuat laporan           |
| type            | Lost / Found              |
| item_name       | Nama barang               |
| category_id     | Kategori                  |
| description     | Deskripsi                 |
| characteristics | Ciri-ciri                 |
| location        | Lokasi                    |
| incident_time   | Waktu kehilangan/penemuan |
| condition       | Kondisi barang            |
| status          | Status laporan            |
| created_at      | Waktu dibuat              |
| updated_at      | Waktu diperbarui          |

---

## 32.3 Report Image

| Field      | Description  |
| ---------- | ------------ |
| image_id   | ID gambar    |
| report_id  | ID laporan   |
| file_path  | Lokasi file  |
| created_at | Waktu upload |

---

## 32.4 Category

| Field       | Description     |
| ----------- | --------------- |
| category_id | ID kategori     |
| name        | Nama kategori   |
| status      | Status kategori |

Contoh kategori:

- Elektronik.
- Dokumen.
- Aksesori.
- Pakaian.
- Tas.
- Buku.
- Kunci.
- Lainnya.

---

## 32.5 Claim

| Field       | Description            |
| ----------- | ---------------------- |
| claim_id    | ID klaim               |
| report_id   | ID laporan             |
| user_id     | Pengaju klaim          |
| description | Alasan/informasi klaim |
| evidence    | Bukti pendukung        |
| status      | Status klaim           |
| admin_note  | Catatan admin          |
| created_at  | Waktu dibuat           |
| updated_at  | Waktu diperbarui       |

---

## 32.6 Matching

| Field              | Description                    |
| ------------------ | ------------------------------ |
| matching_id        | ID matching                    |
| lost_report_id     | Laporan kehilangan             |
| found_report_id    | Laporan penemuan               |
| matched_parameters | Parameter yang cocok           |
| score              | Nilai kecocokan jika digunakan |
| status             | Status matching                |
| admin_note         | Catatan admin                  |

---

## 32.7 Activity

| Field       | Description      |
| ----------- | ---------------- |
| activity_id | ID aktivitas     |
| report_id   | ID laporan       |
| user_id     | Aktor            |
| action      | Aktivitas        |
| description | Detail aktivitas |
| created_at  | Waktu aktivitas  |

---

# 33. Business Rules

### BR-01

Setiap laporan harus memiliki tipe:

- Lost.
- Found.

### BR-02

Laporan baru harus melalui proses verifikasi sebelum menjadi laporan aktif.

### BR-03

Hanya admin yang dapat memverifikasi laporan.

### BR-04

Hanya laporan aktif yang dapat digunakan dalam proses matching.

### BR-05

Matching tidak menentukan kepemilikan secara otomatis.

### BR-06

Klaim harus melalui verifikasi admin.

### BR-07

Satu laporan dapat memiliki beberapa kandidat matching.

### BR-08

Satu barang hanya dapat diselesaikan melalui satu proses pengembalian yang valid.

### BR-09

Informasi sensitif tidak boleh ditampilkan secara publik.

### BR-10

Admin dapat menonaktifkan laporan yang tidak valid atau sudah tidak relevan.

### BR-11

Perubahan penting pada laporan harus dicatat dalam activity history.

### BR-12

Laporan yang telah selesai tidak dapat kembali menjadi laporan aktif tanpa tindakan administratif.

---

# 34. Privacy & Security Requirements

Sistem harus membatasi akses terhadap informasi pribadi dan informasi sensitif.

### Public User

Dapat melihat:

- Informasi umum barang.
- Foto jika tersedia.
- Lokasi umum.
- Waktu secara terbatas.
- Status.

### Owner / Reporter

Dapat melihat informasi lengkap laporan miliknya.

### Admin

Dapat melihat informasi lengkap yang diperlukan untuk proses verifikasi.

### Sensitive Information

Informasi berikut tidak boleh dipublikasikan tanpa alasan:

- Data kontak pribadi.
- Bukti kepemilikan.
- Informasi sensitif barang.
- Informasi internal verifikasi.

---

# 35. Non-Functional Requirements

## NFR-01 Performance

Sistem harus memberikan respons yang cepat dan wajar untuk operasi umum seperti:

- Membuka halaman.
- Search.
- Filter.
- Membuka detail.
- Submit laporan.

## NFR-02 Security

Sistem harus menerapkan:

- Authentication.
- Authorization.
- Role-based access control.
- Validasi input.
- Proteksi file upload.

## NFR-03 Responsive

Sistem harus dapat digunakan pada:

- Desktop.
- Tablet.
- Mobile browser.

## NFR-04 Usability

Form laporan harus sederhana dan menggunakan bahasa yang mudah dipahami.

## NFR-05 Reliability

Data laporan tidak boleh hilang akibat kesalahan aplikasi.

## NFR-06 Maintainability

Struktur sistem harus memungkinkan pengembangan fitur berikutnya seperti notifikasi dan AI matching.

---

# 36. MVP Definition

MVP harus mencakup seluruh alur utama:

```text
Create Report
      ↓
Verification
      ↓
Published
      ↓
Search / Filter
      ↓
Matching
      ↓
Claim
      ↓
Claim Verification
      ↓
Return
      ↓
Completed
```

### MVP Features

1. Authentication.
2. User dashboard.
3. Lost item report.
4. Found item report.
5. Upload photo.
6. Report list.
7. Search.
8. Filter.
9. Report detail.
10. Report history.
11. Report status.
12. Matching berbasis data.
13. Claim.
14. Claim verification.
15. Admin dashboard.
16. Report verification.
17. Report management.
18. Activity history.

---

# 37. Future Improvements

Fitur berikut berada di luar MVP dan dapat dikembangkan setelah sistem inti stabil.

## 37.1 Notification

Notifikasi ketika:

- Laporan diverifikasi.
- Status berubah.
- Kandidat matching ditemukan.
- Klaim diajukan.
- Klaim disetujui/ditolak.

## 37.2 AI Matching

AI dapat membantu matching berdasarkan:

- Foto.
- Deskripsi.
- Ciri-ciri.
- Kategori.
- Lokasi.
- Waktu.

## 37.3 Mobile Application

Pengembangan aplikasi Android dan iOS.

## 37.4 Campus SSO

Integrasi login menggunakan akun kampus.

## 37.5 Academic System Integration

Integrasi dengan sistem akademik untuk validasi identitas pengguna.

## 37.6 QR Identification

QR Code dapat digunakan untuk barang tertentu agar proses identifikasi lebih mudah.

---

# 38. Success Metrics

Keberhasilan produk dapat diukur melalui:

### Adoption

- Jumlah pengguna.
- Jumlah laporan per periode.
- Jumlah pengguna aktif.

### Operational

- Waktu rata-rata verifikasi laporan.
- Jumlah laporan yang berhasil diverifikasi.
- Jumlah laporan aktif.

### Recovery

- Jumlah kandidat matching.
- Jumlah klaim.
- Jumlah barang berhasil dikembalikan.
- Persentase laporan yang selesai.

### Quality

- Jumlah laporan palsu.
- Jumlah klaim ditolak.
- Jumlah laporan yang tidak lengkap.

---

# 39. Acceptance Criteria

## AC-01 — Create Lost Report

**Given** user telah login
**When** user mengisi form laporan kehilangan dengan data yang valid
**Then** sistem menyimpan laporan sebagai `Menunggu Verifikasi`.

## AC-02 — Create Found Report

**Given** user telah login
**When** user mengisi form barang ditemukan dengan data yang valid
**Then** sistem menyimpan laporan sebagai `Menunggu Verifikasi`.

## AC-03 — Report Verification

**Given** terdapat laporan dengan status `Menunggu Verifikasi`
**When** admin menyetujui laporan
**Then** status laporan berubah menjadi `Diverifikasi`.

## AC-04 — Search

**Given** terdapat laporan aktif
**When** user melakukan pencarian
**Then** sistem menampilkan laporan yang relevan.

## AC-05 — Filter

**Given** terdapat laporan aktif
**When** user menerapkan filter
**Then** sistem menampilkan laporan sesuai filter.

## AC-06 — Matching

**Given** terdapat laporan Lost dan Found yang aktif
**When** parameter barang memiliki kemungkinan kecocokan
**Then** sistem menampilkan kandidat matching kepada admin.

## AC-07 — Claim

**Given** terdapat barang ditemukan yang aktif
**When** user mengajukan klaim
**Then** sistem membuat claim dengan status `Menunggu Verifikasi`.

## AC-08 — Claim Approval

**Given** terdapat claim yang menunggu verifikasi
**When** admin menyetujui claim
**Then** status claim menjadi `Disetujui`.

## AC-09 — Complete Report

**Given** claim telah disetujui dan barang telah dikembalikan
**When** admin menyelesaikan proses
**Then** laporan berubah menjadi `Selesai`.

## AC-10 — Activity History

**Given** terdapat perubahan penting pada laporan
**When** perubahan dilakukan
**Then** sistem mencatat aktivitas tersebut.

---

# 40. Error & Edge Cases

Sistem harus menangani kondisi berikut:

### Duplicate Report

Jika user membuat laporan yang sangat mirip dengan laporan sebelumnya, sistem dapat memberikan peringatan agar user memeriksa laporan yang sudah ada.

### Invalid Upload

Jika foto tidak memenuhi persyaratan, sistem menolak upload dan memberikan informasi kesalahan.

### Incomplete Report

Sistem tidak mengizinkan submit apabila field wajib belum lengkap.

### Invalid Claim

Admin dapat menolak klaim apabila informasi tidak cukup untuk memverifikasi kepemilikan.

### Multiple Claim

Jika terdapat beberapa pengguna yang mengklaim barang yang sama, seluruh klaim harus masuk proses review dan admin menentukan klaim yang valid.

### Report Already Completed

Laporan yang sudah selesai tidak dapat diklaim kembali melalui proses normal.

### Report Rejected

Laporan yang ditolak tidak ditampilkan sebagai laporan aktif.

---

# 41. Product Constraints

Pengembangan MVP memiliki batasan:

1. Platform hanya website.
2. Matching tidak menggunakan AI.
3. Tidak ada real-time tracking.
4. Tidak ada integrasi sistem akademik.
5. Proses pengembalian barang dilakukan secara offline oleh pihak terkait.
6. Sistem hanya mendukung pengelolaan informasi dan proses administrasi.
7. Keputusan akhir mengenai validitas klaim berada pada admin.

---

# 42. Assumptions

1. Pengguna merupakan mahasiswa atau civitas kampus.
2. Admin kampus bertanggung jawab terhadap validasi laporan.
3. Barang yang ditemukan berada dalam lingkungan atau pengelolaan kampus.
4. Pengembalian barang dilakukan secara offline.
5. Pengguna memiliki akses internet.
6. Informasi yang diberikan pengguna dianggap sebagai sumber utama dalam proses matching.
7. Admin memiliki kewenangan untuk menentukan validitas laporan dan klaim.

---

# 43. Product Flow Summary

```text
                    ┌─────────────────┐
                    │      USER       │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌───────────────┐
        │  LOST ITEM    │         │  FOUND ITEM   │
        └───────┬───────┘         └───────┬───────┘
                │                         │
                └────────────┬────────────┘
                             ▼
                    ┌─────────────────┐
                    │   VERIFICATION  │
                    │      ADMIN      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ ACTIVE REPORT   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    MATCHING     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      CLAIM      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ CLAIM REVIEW    │
                    │     ADMIN       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     RETURN      │
                    │     ITEM        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    COMPLETED    │
                    └─────────────────┘
```

---

# 44. Development Priority

| Priority | Area                 | Status |
| -------- | -------------------- | ------ |
| P0       | Authentication       | MVP    |
| P0       | Lost Report          | MVP    |
| P0       | Found Report         | MVP    |
| P0       | Report Verification  | MVP    |
| P0       | Report List          | MVP    |
| P0       | Report Detail        | MVP    |
| P0       | Status Management    | MVP    |
| P1       | Search & Filter      | MVP    |
| P1       | Photo Upload         | MVP    |
| P1       | Claim                | MVP    |
| P1       | Matching             | MVP    |
| P1       | Admin Dashboard      | MVP    |
| P1       | Activity History     | MVP    |
| P2       | Notification         | Future |
| P2       | AI Matching          | Future |
| P2       | Mobile App           | Future |
| P2       | Campus SSO           | Future |
| P2       | Academic Integration | Future |

---

# 45. Final Product Definition

Sistem Manajemen Laporan Kehilangan Barang Kampus adalah **platform terpusat untuk mengelola siklus hidup barang hilang dan barang ditemukan**, mulai dari pembuatan laporan, verifikasi, pencarian, matching, klaim, hingga penyelesaian.

Fokus MVP bukan sekadar menjadi katalog barang hilang, tetapi menyediakan **end-to-end workflow**:

```text
LAPOR
  ↓
VERIFIKASI
  ↓
CARI
  ↓
MATCHING
  ↓
KLAIM
  ↓
VERIFIKASI
  ↓
PENGEMBALIAN
  ↓
SELESAI
```

Sistem tidak menentukan kepemilikan barang secara otomatis. Matching hanya membantu menemukan kemungkinan kecocokan, sedangkan validasi laporan, klaim, dan keputusan pengembalian tetap berada pada pihak yang berwenang, yaitu admin kampus.

Dokumen ini menjadi baseline untuk tahap berikutnya: **requirement breakdown, user flow, workflow detail, sitemap/information architecture, data model, architecture, UI/UX design, dan task breakdown development.**
