# UserFlow.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0  
**Status:** Final  
**Reference:** `PRD.md` + `Design.md` + `DesignSystem.md` + `Architecture.md` + `Database.md` + `API.md`

---

# 1. Overview

Dokumen ini mendefinisikan alur interaksi pengguna dengan sistem berdasarkan role dan fitur.

User flow digunakan sebagai acuan untuk:

- Implementasi frontend.
- Routing halaman.
- Navigation.
- State transition.
- Authentication flow.
- Authorization flow.
- Report workflow.
- Claim workflow.
- Admin workflow.
- Error handling.
- Empty state.
- Success state.

---

# 2. User Roles

Sistem memiliki dua role utama:

```text
USER
ADMIN
```

## USER

Pengguna umum yang terdiri dari:

- Mahasiswa.
- Civitas kampus.

User dapat:

- Register.
- Login.
- Melihat laporan barang.
- Mencari barang.
- Filter barang.
- Membuat laporan kehilangan.
- Membuat laporan barang ditemukan.
- Mengelola laporan miliknya.
- Mengajukan claim.
- Melihat status claim.
- Melihat notifikasi.

---

## ADMIN

Admin merupakan pihak kampus yang bertanggung jawab mengelola sistem.

Admin dapat:

- Login.
- Melihat dashboard.
- Memverifikasi laporan.
- Mengelola laporan.
- Mengelola claim.
- Mengelola kategori.
- Mengelola user.
- Melihat activity log.

---

# 3. Global Navigation

## User Navigation

```text
Dashboard
│
├── Laporan
│   ├── Barang Hilang
│   └── Barang Ditemukan
│
├── Buat Laporan
│
├── Laporan Saya
│
├── Klaim Saya
│
├── Notifikasi
│
└── Profil
```

---

## Admin Navigation

```text
Dashboard
│
├── Laporan
│
├── Klaim
│
├── Kategori
│
├── Pengguna
│
└── Activity Log
```

---

# 4. Application Entry Flow

```text
Open Website
      │
      ▼
Check Session
      │
      ├── Session Valid
      │       │
      │       ▼
      │   Dashboard
      │
      └── No Session
              │
              ▼
          Landing/Login
```

---

# 5. Authentication Flow

## 5.1 Register Flow

```text
Register Page
      │
      ▼
Fill Form
      │
      ├── Invalid
      │     │
      │     ▼
      │  Show Validation Error
      │     │
      │     └──────┐
      │            │
      │            ▼
      │        Fill Form Again
      │
      └── Valid
            │
            ▼
       Submit Register
            │
            ▼
      Create Account
            │
            ├── Failed
            │     │
            │     ▼
            │  Show Error
            │
            └── Success
                  │
                  ▼
              Login / Dashboard
```

---

# 6. Login Flow

```text
Login Page
    │
    ▼
Input Email + Password
    │
    ▼
Submit
    │
    ├── Invalid Input
    │      │
    │      ▼
    │   Validation Error
    │
    └── Valid
           │
           ▼
       Authenticate
           │
           ├── Failed
           │     │
           │     ▼
           │ Invalid Credentials
           │
           └── Success
                 │
                 ▼
             Check Role
                 │
           ┌─────┴─────┐
           ▼           ▼
         USER        ADMIN
           │           │
           ▼           ▼
       Dashboard   Admin Dashboard
```

---

# 7. Logout Flow

```text
User Menu
   │
   ▼
Logout
   │
   ▼
Invalidate Session
   │
   ▼
Redirect Login
```

---

# 8. Unauthorized Flow

Jika user mengakses halaman protected tanpa authentication:

```text
Protected Page
      │
      ▼
Check Session
      │
      └── No Session
             │
             ▼
       Redirect Login
```

---

# 9. Forbidden Flow

Jika USER mengakses halaman ADMIN:

```text
Admin Page
    │
    ▼
Check Authentication
    │
    ▼
Check Role
    │
    └── USER
         │
         ▼
      403 Forbidden
         │
         ▼
    Redirect Dashboard
```

---

# 10. User Dashboard Flow

```text
Login
  │
  ▼
User Dashboard
  │
  ├── Lihat Barang Hilang
  │
  ├── Lihat Barang Ditemukan
  │
  ├── Buat Laporan
  │
  ├── Laporan Saya
  │
  ├── Klaim Saya
  │
  └── Notifikasi
```

Dashboard berfungsi sebagai entry point utama user setelah login.

---

# 11. Browse Report Flow

```text
Dashboard
    │
    ▼
Daftar Laporan
    │
    ├── Search
    │
    ├── Filter
    │
    ├── Sort
    │
    └── Pagination
    │
    ▼
Report Card
    │
    ▼
Report Detail
```

---

# 12. Report Type Flow

User dapat memilih:

```text
Buat Laporan
      │
      ├── Barang Hilang
      │
      └── Barang Ditemukan
```

Kedua jenis laporan menggunakan form dasar yang sama.

Perbedaan utama:

```text
LOST
→ Barang milik user hilang.

FOUND
→ User menemukan barang milik orang lain.
```

---

# 13. Create Lost Report Flow

```text
Dashboard
    │
    ▼
Buat Laporan
    │
    ▼
Pilih Barang Hilang
    │
    ▼
Report Form
    │
    ├── Kategori
    ├── Nama Barang
    ├── Deskripsi
    ├── Lokasi
    ├── Waktu
    └── Foto
    │
    ▼
Review
    │
    ├── Edit
    │    │
    │    └── Back to Form
    │
    └── Submit
         │
         ▼
    Validation
         │
         ├── Failed
         │     │
         │     ▼
         │  Show Error
         │
         └── Success
               │
               ▼
       PENDING_VERIFICATION
               │
               ▼
       Report Detail
```

---

# 14. Create Found Report Flow

```text
Dashboard
    │
    ▼
Buat Laporan
    │
    ▼
Pilih Barang Ditemukan
    │
    ▼
Report Form
    │
    ├── Kategori
    ├── Nama Barang
    ├── Deskripsi
    ├── Lokasi Ditemukan
    ├── Waktu Ditemukan
    └── Foto
    │
    ▼
Review
    │
    ├── Edit
    │
    └── Submit
         │
         ▼
    PENDING_VERIFICATION
         │
         ▼
    Admin Verification
```

---

# 15. Report Creation State

Setelah user membuat laporan:

```text
PENDING_VERIFICATION
```

User melihat:

```text
Status:
Menunggu Verifikasi

Message:
Laporan sedang diperiksa oleh admin.
```

User tidak dapat menganggap laporan sudah aktif sebelum diverifikasi.

---

# 16. Report Verification Flow

```text
User Submit Report
       │
       ▼
PENDING_VERIFICATION
       │
       ▼
Admin Review
       │
       ├── Reject
       │     │
       │     ▼
       │  REJECTED
       │
       └── Approve
             │
             ▼
           ACTIVE
```

---

# 17. Report Status Flow

## Lost Report

```text
PENDING_VERIFICATION
        │
        ▼
      ACTIVE
        │
        ├── Ditemukan
        │      │
        │      ▼
        │    FOUND
        │
        ├── Dibatalkan
        │      │
        │      ▼
        │   CANCELLED
        │
        └── Selesai
               │
               ▼
           COMPLETED
```

---

## Found Report

```text
PENDING_VERIFICATION
        │
        ▼
      ACTIVE
        │
        ▼
      CLAIMED
        │
        ▼
    COMPLETED
```

---

# 18. Report Detail Flow

```text
Report List
    │
    ▼
Click Report
    │
    ▼
Report Detail
    │
    ├── View Image
    ├── View Description
    ├── View Category
    ├── View Location
    ├── View Time
    └── View Status
```

Untuk laporan `FOUND` yang masih aktif:

```text
Report Detail
     │
     ▼
Claim Button
```

---

# 19. Report Ownership Flow

Jika report milik user:

```text
Report Detail
      │
      ▼
Check Owner
      │
      └── Current User = Reporter
              │
              ▼
        Show Owner Actions
              │
              ├── Edit
              └── Delete
```

Jika bukan milik user:

```text
Current User ≠ Reporter
        │
        ▼
Hide Edit/Delete
```

---

# 20. Edit Report Flow

```text
My Reports
    │
    ▼
Select Report
    │
    ▼
Edit
    │
    ▼
Edit Form
    │
    ▼
Submit
    │
    ├── Validation Error
    │       │
    │       ▼
    │    Show Error
    │
    └── Success
            │
            ▼
        Updated Report
```

---

# 21. Delete Report Flow

```text
My Reports
    │
    ▼
Select Report
    │
    ▼
Delete
    │
    ▼
Confirmation Dialog
    │
    ├── Cancel
    │     │
    │     ▼
    │   Close Dialog
    │
    └── Confirm
          │
          ▼
       Soft Delete
          │
          ▼
       Success
          │
          ▼
     My Reports
```

---

# 22. My Reports Flow

```text
Dashboard
    │
    ▼
Laporan Saya
    │
    ├── Semua
    ├── Hilang
    └── Ditemukan
    │
    ▼
Report List
    │
    ▼
Report Detail
```

Filter status:

```text
Menunggu Verifikasi
Aktif
Ditemukan
Diklaim
Selesai
Ditolak
Dibatalkan
```

---

# 23. Claim Flow

Claim hanya tersedia untuk:

```text
FOUND
+
ACTIVE
```

Flow:

```text
Found Report Detail
       │
       ▼
Claim Button
       │
       ▼
Claim Form
       │
       ├── Alasan
       └── Bukti / Informasi Pendukung
       │
       ▼
Submit
       │
       ├── Invalid
       │     │
       │     ▼
       │  Validation Error
       │
       └── Valid
             │
             ▼
          PENDING
             │
             ▼
        Admin Review
```

---

# 24. Claim Restriction Flow

User tidak dapat claim jika:

```text
Report type = LOST
```

atau:

```text
Report status ≠ ACTIVE
```

atau:

```text
Report milik user sendiri
```

atau:

```text
User sudah memiliki claim aktif
```

UI harus menyembunyikan atau disable claim action jika kondisi tidak terpenuhi.

---

# 25. Claim Review Flow

```text
Claim
 │
 ▼
PENDING
 │
 ▼
Admin Review
 │
 ├── Reject
 │     │
 │     ▼
 │  REJECTED
 │
 └── Approve
       │
       ▼
    APPROVED
       │
       ▼
    Report
       │
       ▼
    CLAIMED
```

---

# 26. Claim Rejected Flow

```text
PENDING
   │
   ▼
Admin Reject
   │
   ▼
REJECTED
   │
   ▼
Notification
   │
   ▼
User sees reason
```

Report tetap tersedia sesuai status report.

---

# 27. Claim Approved Flow

```text
PENDING
   │
   ▼
Admin Approve
   │
   ▼
APPROVED
   │
   ▼
Report → CLAIMED
   │
   ▼
Notification
   │
   ▼
User
```

---

# 28. My Claims Flow

```text
Dashboard
    │
    ▼
Klaim Saya
    │
    ▼
Claim List
    │
    ├── Pending
    ├── Approved
    ├── Rejected
    └── Cancelled
    │
    ▼
Claim Detail
```

---

# 29. Cancel Claim Flow

```text
Claim Detail
    │
    ▼
Cancel Claim
    │
    ▼
Confirmation
    │
    ├── Cancel
    │
    └── Confirm
          │
          ▼
       CANCELLED
```

Cancel hanya tersedia ketika:

```text
Claim status = PENDING
```

---

# 30. Notification Flow

Notification dibuat ketika terjadi event penting.

Contoh:

```text
Report Verified
Report Rejected
Claim Submitted
Claim Approved
Claim Rejected
Report Status Changed
```

Flow:

```text
System Event
    │
    ▼
Create Notification
    │
    ▼
Notification Bell
    │
    ▼
User Opens Notification
    │
    ▼
Notification Detail / Related Page
```

---

# 31. Notification Read Flow

```text
Notification
     │
     ▼
Unread
     │
     ▼
User Opens
     │
     ▼
Mark as Read
     │
     ▼
Read
```

---

# 32. Search Flow

```text
Report List
    │
    ▼
Search Input
    │
    ▼
Enter Keyword
    │
    ▼
API Request
    │
    ▼
Filtered Result
```

Search berdasarkan:

```text
Nama barang
Deskripsi
Lokasi
```

---

# 33. Filter Flow

```text
Report List
    │
    ▼
Filter
    │
    ├── Type
    ├── Category
    ├── Status
    └── Location
    │
    ▼
Apply
    │
    ▼
Filtered Reports
```

---

# 34. Empty Search Flow

```text
Search
  │
  ▼
No Result
  │
  ▼
Empty State
  │
  ├── Clear Search
  │
  └── Change Filter
```

Message:

```text
Barang tidak ditemukan.
Coba gunakan kata kunci atau filter lain.
```

---

# 35. Pagination Flow

```text
Report List
    │
    ▼
Page 1
    │
    ▼
Next
    │
    ▼
Page 2
```

Pagination hanya ditampilkan jika:

```text
totalPages > 1
```

---

# 36. Admin Entry Flow

```text
Admin Login
    │
    ▼
Check Role
    │
    ▼
ADMIN
    │
    ▼
Admin Dashboard
```

---

# 37. Admin Dashboard Flow

```text
Admin Dashboard
      │
      ├── Total Laporan
      ├── Laporan Menunggu Verifikasi
      ├── Laporan Aktif
      ├── Laporan Selesai
      └── Claim Menunggu Review
```

Admin dapat memilih metric untuk menuju data terkait.

---

# 38. Admin Report Management Flow

```text
Admin Dashboard
     │
     ▼
Laporan
     │
     ▼
Report Management
     │
     ├── Search
     ├── Filter
     ├── Sort
     └── Pagination
     │
     ▼
Select Report
     │
     ▼
Report Detail
```

---

# 39. Admin Verification Flow

```text
Admin Report List
       │
       ▼
Pending Verification
       │
       ▼
Report Detail
       │
       ├── Approve
       │
       └── Reject
```

Approve:

```text
Approve
  │
  ▼
Confirmation
  │
  ▼
ACTIVE
```

Reject:

```text
Reject
  │
  ▼
Input Reason
  │
  ▼
Confirmation
  │
  ▼
REJECTED
```

---

# 40. Admin Report Status Flow

Admin dapat mengubah status berdasarkan valid transition.

```text
PENDING_VERIFICATION
        │
        ├── ACTIVE
        └── REJECTED
```

```text
ACTIVE
   │
   ├── FOUND
   ├── CANCELLED
   └── COMPLETED
```

Admin tidak boleh membuat transition yang tidak valid.

---

# 41. Admin Claim Management

```text
Admin Dashboard
     │
     ▼
Claims
     │
     ▼
Claim List
     │
     ├── Search
     ├── Filter
     └── Status
     │
     ▼
Claim Detail
```

---

# 42. Admin Claim Review

```text
Claim Detail
     │
     ▼
Review Evidence
     │
     ├── Approve
     │
     └── Reject
```

Approve:

```text
APPROVED
 ↓
Report CLAIMED
```

Reject:

```text
REJECTED
 ↓
Report tetap tersedia
```

---

# 43. Admin Category Flow

```text
Admin Dashboard
      │
      ▼
Kategori
      │
      ├── List
      ├── Add
      ├── Edit
      └── Deactivate
```

---

# 44. Add Category Flow

```text
Category List
    │
    ▼
Tambah Kategori
    │
    ▼
Form
    │
    ▼
Submit
    │
    ├── Invalid
    │
    └── Success
          │
          ▼
      Category List
```

---

# 45. Edit Category Flow

```text
Category List
    │
    ▼
Edit
    │
    ▼
Form
    │
    ▼
Submit
    │
    ▼
Updated Category
```

---

# 46. Deactivate Category Flow

Category yang masih digunakan report tidak boleh langsung dihapus secara destructive.

```text
Category
   │
   ▼
Deactivate
   │
   ▼
Confirmation
   │
   ▼
isActive = false
```

Report lama tetap mempertahankan category tersebut.

---

# 47. Admin User Management Flow

```text
Admin Dashboard
      │
      ▼
Pengguna
      │
      ▼
User List
      │
      ├── Search
      ├── Filter Role
      └── Filter Status
      │
      ▼
User Detail
```

---

# 48. Deactivate User Flow

```text
User Detail
    │
    ▼
Deactivate
    │
    ▼
Confirmation
    │
    ▼
isActive = false
```

User yang inactive:

```text
Tidak dapat login
```

Existing session harus di-invalidasi sesuai implementation.

---

# 49. Activity Log Flow

```text
Admin Dashboard
     │
     ▼
Activity Log
     │
     ▼
Activity List
     │
     ├── Filter
     ├── Search
     └── Pagination
```

Activity log bersifat read-only.

---

# 50. Important Activity Events

Minimal log:

```text
USER_REGISTERED

REPORT_CREATED
REPORT_UPDATED
REPORT_DELETED
REPORT_VERIFIED
REPORT_REJECTED
REPORT_STATUS_CHANGED

CLAIM_CREATED
CLAIM_APPROVED
CLAIM_REJECTED
CLAIM_CANCELLED

CATEGORY_CREATED
CATEGORY_UPDATED
CATEGORY_DEACTIVATED

USER_DEACTIVATED
```

---

# 51. File Upload Flow

```text
Create/Edit Report
      │
      ▼
Select Image
      │
      ▼
Client Validation
      │
      ├── Invalid
      │     │
      │     ▼
      │  Show Error
      │
      └── Valid
            │
            ▼
        Upload API
            │
            ▼
       Server Validation
            │
            ├── Invalid
            │
            └── Valid
                  │
                  ▼
              Storage
                  │
                  ▼
              Image URL
                  │
                  ▼
             Report Image
```

---

# 52. File Upload Error Flow

Jika file terlalu besar:

```text
FILE_TOO_LARGE
```

Jika format tidak valid:

```text
INVALID_FILE_TYPE
```

UI menampilkan error tanpa menghapus data form lainnya.

---

# 53. Global Loading Flow

Setiap asynchronous action:

```text
Idle
 │
 ▼
Loading
 │
 ├── Success
 │     │
 │     ▼
 │   Success State
 │
 └── Error
       │
       ▼
     Error State
```

Button tidak boleh dapat ditekan berkali-kali ketika request sedang berlangsung.

---

# 54. Global Error Flow

```text
API Request
    │
    ▼
Error
    │
    ├── 401
    │    │
    │    ▼
    │ Redirect Login
    │
    ├── 403
    │    │
    │    ▼
    │ Forbidden Page
    │
    ├── 404
    │    │
    │    ▼
    │ Not Found
    │
    ├── 422
    │    │
    │    ▼
    │ Validation Error
    │
    └── 500
         │
         ▼
      Server Error
```

---

# 55. Network Error Flow

Jika server tidak dapat diakses:

```text
Request
  │
  ▼
Network Error
  │
  ▼
Error State
  │
  ├── Retry
  │
  └── Back
```

Message:

```text
Terjadi masalah saat menghubungi server.
Silakan coba lagi.
```

---

# 56. Session Expired Flow

```text
User sedang menggunakan sistem
          │
          ▼
Session Expired
          │
          ▼
API → 401
          │
          ▼
Clear User State
          │
          ▼
Redirect Login
```

---

# 57. Unsaved Changes Flow

Jika user sedang mengisi form lalu mencoba keluar:

```text
Form Dirty
   │
   ▼
Navigate Away
   │
   ▼
Confirmation
   │
   ├── Stay
   │
   └── Leave
```

Message:

```text
Perubahan belum disimpan.
Apakah Anda yakin ingin keluar?
```

---

# 58. Report Form Flow

Form dibagi secara logical:

```text
Report Form
    │
    ├── Jenis Laporan
    ├── Informasi Barang
    ├── Lokasi & Waktu
    ├── Deskripsi
    └── Foto
```

Submit:

```text
Fill Form
   │
   ▼
Validate
   │
   ▼
Review
   │
   ▼
Submit
```

---

# 59. Report Form Validation

Required:

```text
Jenis laporan
Kategori
Nama barang
Deskripsi
Lokasi
Waktu
```

Optional:

```text
Foto
```

Jika validation gagal:

```text
Stay on form
Show field error
Preserve entered data
```

---

# 60. Report Submission Success

```text
Submit
  │
  ▼
API Success
  │
  ▼
Report Created
  │
  ▼
Show Success Feedback
  │
  ▼
Redirect Report Detail
```

Message:

```text
Laporan berhasil dibuat dan sedang menunggu verifikasi admin.
```

---

# 61. Admin Review Success

Approve:

```text
Approve
  │
  ▼
API Success
  │
  ▼
Status → ACTIVE
  │
  ▼
Notification Created
  │
  ▼
Refresh Detail
```

Reject:

```text
Reject
  │
  ▼
Input Reason
  │
  ▼
API Success
  │
  ▼
Status → REJECTED
  │
  ▼
Notification Created
```

---

# 62. User Journey — Lost Item

```text
Login
  │
  ▼
Dashboard
  │
  ▼
Buat Laporan
  │
  ▼
Barang Hilang
  │
  ▼
Isi Informasi
  │
  ▼
Submit
  │
  ▼
Menunggu Verifikasi
  │
  ▼
Admin Verify
  │
  ▼
Aktif
  │
  ▼
Barang Ditemukan
  │
  ▼
Status Updated
  │
  ▼
Selesai
```

---

# 63. User Journey — Found Item

```text
Login
  │
  ▼
Buat Laporan
  │
  ▼
Barang Ditemukan
  │
  ▼
Isi Informasi
  │
  ▼
Submit
  │
  ▼
Admin Verify
  │
  ▼
ACTIVE
  │
  ▼
Pemilik Menemukan Laporan
  │
  ▼
Mengajukan Claim
  │
  ▼
Admin Review
  │
  ├── Reject
  │
  └── Approve
        │
        ▼
      CLAIMED
        │
        ▼
     COMPLETED
```

---

# 64. Admin Journey

```text
Login
  │
  ▼
Dashboard
  │
  ├── Review Reports
  │      │
  │      ├── Approve
  │      └── Reject
  │
  ├── Review Claims
  │      │
  │      ├── Approve
  │      └── Reject
  │
  ├── Manage Categories
  │
  ├── Manage Users
  │
  └── View Activity Logs
```

---

# 65. Navigation Rules

## User

User dapat mengakses:

```text
/dashboard
/reports
/reports/:id
/reports/create
/reports/:id/edit
/my-reports
/my-claims
/notifications
/profile
```

---

## Admin

Admin dapat mengakses:

```text
/admin
/admin/reports
/admin/reports/:id
/admin/claims
/admin/claims/:id
/admin/categories
/admin/users
/admin/activity-logs
```

---

# 66. Route Guard

Frontend route guard:

```text
Public Route
    │
    └── Login/Register
```

```text
Protected Route
    │
    ├── Authenticated → Continue
    │
    └── Unauthenticated → Login
```

```text
Admin Route
    │
    ├── ADMIN → Continue
    │
    └── USER → Forbidden
```

Backend tetap menjadi source of truth untuk authorization.

Frontend guard bukan security boundary.

---

# 67. Empty States

## No Reports

```text
Belum ada laporan barang.
```

Action:

```text
Buat Laporan
```

---

## No My Reports

```text
Anda belum membuat laporan.
```

Action:

```text
Buat Laporan
```

---

## No Claims

```text
Anda belum memiliki klaim.
```

---

## No Notifications

```text
Tidak ada notifikasi.
```

---

## No Activity Logs

```text
Belum ada aktivitas.
```

---

# 68. Confirmation Rules

Confirmation wajib untuk destructive/sensitive action:

```text
Delete Report
Cancel Claim
Reject Report
Reject Claim
Deactivate Category
Deactivate User
Logout jika ada unsaved changes
```

Tidak diperlukan untuk:

```text
Search
Filter
Open Detail
Mark Notification Read
```

---

# 69. Success Feedback

Gunakan toast/banner untuk action sederhana:

```text
Kategori berhasil diperbarui.
Notifikasi ditandai sudah dibaca.
```

Untuk action penting gunakan success state:

```text
Laporan berhasil dibuat.
Klaim berhasil diajukan.
Laporan berhasil diverifikasi.
```

---

# 70. Data Refresh Rules

Setelah mutation berhasil:

```text
Create Report
→ Refresh / Navigate to detail

Update Report
→ Refresh detail

Delete Report
→ Refresh list

Approve Report
→ Refresh admin detail/list

Create Claim
→ Refresh claim/report state

Approve Claim
→ Refresh claim/report state

Update Category
→ Refresh category list
```

---

# 71. Optimistic UI

MVP tidak mewajibkan optimistic update untuk mutation kritis.

Gunakan server-confirmed state untuk:

```text
Report status
Claim status
Report deletion
Claim approval
Claim rejection
User status
```

Hal ini menjaga UI tetap konsisten dengan database.

---

# 72. Concurrent Action Protection

Untuk action yang mengubah state:

```text
Approve
Reject
Delete
Cancel
```

UI harus:

```text
Disable button while request pending
```

Backend juga harus melakukan validasi current state sebelum mutation.

Contoh:

```text
Claim sudah APPROVED
→ Reject request berikutnya
→ 409 Conflict
```

---

# 73. Business Rule Priority

Jika terdapat konflik antara:

```text
Frontend
API
Database
```

maka business rule harus mengikuti:

```text
PRD
  ↓
API
  ↓
Backend Service
  ↓
Database Constraint
```

Frontend tidak boleh menjadi sumber utama business rule.

---

# 74. User Flow to API Mapping

| Flow              | API                                   |
| ----------------- | ------------------------------------- |
| Register          | `POST /api/auth/register`             |
| Login             | `POST /api/auth/login`                |
| Logout            | `POST /api/auth/logout`               |
| Current User      | `GET /api/auth/me`                    |
| View Reports      | `GET /api/reports`                    |
| Report Detail     | `GET /api/reports/:id`                |
| Create Report     | `POST /api/reports`                   |
| Update Report     | `PATCH /api/reports/:id`              |
| Delete Report     | `DELETE /api/reports/:id`             |
| Upload Image      | `POST /api/reports/:id/images`        |
| Create Claim      | `POST /api/reports/:reportId/claims`  |
| My Claims         | `GET /api/claims`                     |
| Cancel Claim      | `PATCH /api/claims/:id/cancel`        |
| Notifications     | `GET /api/notifications`              |
| Read Notification | `PATCH /api/notifications/:id/read`   |
| Admin Dashboard   | `GET /api/admin/dashboard`            |
| Verify Report     | `PATCH /api/admin/reports/:id/status` |
| Review Claim      | `PATCH /api/admin/claims/:id/status`  |
| Manage Category   | `/api/categories`                     |
| Manage User       | `/api/admin/users`                    |
| Activity Logs     | `GET /api/admin/activity-logs`        |

---

# 75. User Flow to Database Mapping

```text
Authentication
    ↓
users
sessions

Report
    ↓
reports
report_images

Claim
    ↓
claims

Notification
    ↓
notifications

Audit
    ↓
activity_logs

Category
    ↓
categories
```

---

# 76. Core State Machine

```text
REPORT

PENDING_VERIFICATION
        │
        ├───────────────┐
        ▼               ▼
     ACTIVE          REJECTED
        │
        ├──→ FOUND
        │
        ├──→ CANCELLED
        │
        ├──→ CLAIMED
        │
        └──→ COMPLETED
```

Claim:

```text
PENDING
   │
   ├──→ APPROVED
   │       │
   │       ▼
   │    CLAIMED
   │
   ├──→ REJECTED
   │
   └──→ CANCELLED
```

---

# 77. Critical UX Principles

Sistem harus selalu memberikan feedback terhadap:

```text
Loading
Success
Error
Empty
Confirmation
Status
```

User harus selalu mengetahui:

```text
Apa yang sedang terjadi?
Apa yang harus dilakukan?
Apa hasil dari action?
Apa status laporan?
```

---

# 78. Final User Flow

Core user flow:

```text
                    ┌─────────────┐
                    │    Login    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Dashboard  │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Lihat Report   Buat Report   Laporan Saya
             │             │
             ▼             ▼
        Detail Report   Lost / Found
                           │
                           ▼
                     Verification
                           │
                           ▼
                         ACTIVE
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
                 FOUND         CANCELLED
                    │
                    ▼
                  CLAIM
                    │
                    ▼
              Admin Review
                    │
             ┌──────┴──────┐
             ▼             ▼
          APPROVED       REJECTED
             │
             ▼
          CLAIMED
             │
             ▼
         COMPLETED
```

---

# 79. Final Status

**UserFlow Design: FINAL**

Dokumen ini menjadi acuan untuk:

- Frontend routing.
- Navigation.
- User interaction.
- Authentication flow.
- Authorization flow.
- Report workflow.
- Claim workflow.
- Admin workflow.
- State management.
- API integration.
- UX state handling.
- Frontend implementation.
