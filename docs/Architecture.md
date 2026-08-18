# Architecture.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.1  
**Status:** Final  
**Architecture Type:** Web Application  
**Database:** SQLite  
**ORM:** Prisma  
**Reference:**

- `PRD.md`
- `Design.md`
- `DesignSystem.md`
- `UserFlow.md`

---

# 1. Architecture Overview

Sistem Manajemen Laporan Kehilangan Barang Kampus menggunakan arsitektur web application dengan pemisahan antara:

```text
Frontend
Backend API
Database
File Storage
```

Arsitektur utama:

```text
┌──────────────────────────────┐
│          Browser             │
│                              │
│       Frontend Web           │
└──────────────┬───────────────┘
               │
               │ HTTP / HTTPS
               │ REST API
               ▼
┌──────────────────────────────┐
│          Backend             │
│                              │
│ ┌──────────────────────────┐ │
│ │ Routes / Controllers     │ │
│ ├──────────────────────────┤ │
│ │ Middleware               │ │
│ ├──────────────────────────┤ │
│ │ Validation               │ │
│ ├──────────────────────────┤ │
│ │ Service Layer            │ │
│ ├──────────────────────────┤ │
│ │ Repository / Prisma      │ │
│ └──────────────────────────┘ │
└──────────────┬───────────────┘
               │
               │ Prisma
               ▼
┌──────────────────────────────┐
│           SQLite             │
│                              │
│       database.sqlite        │
└──────────────────────────────┘

               │
               │ File Reference
               ▼
┌──────────────────────────────┐
│        File Storage          │
│                              │
│       Uploaded Images        │
└──────────────────────────────┘
```

---

# 2. Architecture Goals

Arsitektur dirancang dengan tujuan:

1. Sederhana untuk dikembangkan.
2. Mudah dipahami dan dipelihara.
3. Cocok untuk MVP.
4. Memiliki pemisahan frontend dan backend.
5. Memiliki pemisahan business logic dan database access.
6. Mendukung authentication dan authorization.
7. Menjaga integritas data.
8. Mudah dikembangkan ke database lain jika dibutuhkan di masa depan.
9. Meminimalkan dependency yang tidak diperlukan.
10. Mudah dijalankan pada lingkungan development.

---

# 3. Technology Stack

## 3.1 Frontend

Frontend merupakan aplikasi web yang berjalan pada browser.

Teknologi frontend mengikuti implementasi yang ditentukan pada project setup.

Frontend bertanggung jawab terhadap:

```text
UI
UX
Routing
Form
Client Validation
State Management
API Integration
Responsive Design
```

Frontend tidak bertanggung jawab sebagai source of truth untuk:

```text
Authorization
Business Rules
Data Integrity
Status Transition
```

---

# 4. Backend

Backend menyediakan REST API yang digunakan frontend.

Backend bertanggung jawab terhadap:

```text
Authentication
Authorization
Validation
Business Logic
Report Management
Claim Management
Category Management
User Management
Notification
Activity Log
File Upload
Database Access
```

Backend menjadi source of truth untuk seluruh business rule.

---

# 5. Database

Database menggunakan:

```text
SQLite
```

Database disimpan sebagai file:

```text
database.sqlite
```

Struktur development:

```text
backend/
├── data/
│   └── database.sqlite
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
```

SQLite dipilih karena:

- Tidak membutuhkan database server terpisah.
- Setup sederhana.
- Cocok untuk MVP.
- Mudah digunakan pada development.
- Mudah dipindahkan bersama project.
- Memiliki dukungan transaction.
- Cocok untuk skala aplikasi awal.

---

# 6. ORM

Backend menggunakan:

```text
Prisma
```

Prisma digunakan sebagai abstraction layer antara application service dan SQLite.

Arsitektur:

```text
Service
   ↓
Prisma Client
   ↓
SQLite
```

Application code tidak melakukan SQL query secara langsung kecuali terdapat kebutuhan khusus yang memang dibenarkan oleh architecture.

---

# 7. Database Access Architecture

Database access menggunakan pola:

```text
Controller
    ↓
Service
    ↓
Repository / Prisma
    ↓
SQLite
```

Controller tidak boleh menangani business logic yang kompleks.

Contoh yang salah:

```text
Controller
 ├── Validate claim
 ├── Check report status
 ├── Update claim
 ├── Update report
 └── Create notification
```

Contoh yang benar:

```text
Controller
    ↓
ClaimService.approveClaim()
    ↓
Prisma Transaction
    ├── Update Claim
    ├── Update Report
    ├── Create Notification
    └── Create Activity Log
```

---

# 8. Layer Architecture

Backend menggunakan beberapa layer.

```text
┌────────────────────────────┐
│ Routes                     │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Middleware                 │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Controller                 │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Service                    │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Repository / Prisma        │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ SQLite                     │
└────────────────────────────┘
```

---

# 9. Routes Layer

Routes menentukan endpoint API.

Contoh:

```text
/api/auth/*
/api/reports/*
/api/claims/*
/api/categories/*
/api/notifications/*
/api/admin/*
```

Routes bertanggung jawab terhadap:

- Mapping endpoint.
- HTTP method.
- Middleware.
- Controller.

Routes tidak menangani business logic.

---

# 10. Middleware Layer

Middleware digunakan untuk proses yang berlaku lintas endpoint.

Minimal:

```text
Authentication
Authorization
Request Validation
Error Handling
Request Logging
```

Contoh:

```text
Request
   ↓
Authentication Middleware
   ↓
Authorization Middleware
   ↓
Controller
```

---

# 11. Authentication Architecture

Sistem menggunakan authentication berbasis session/token sesuai implementasi backend.

Flow:

```text
Login
   ↓
Validate Credentials
   ↓
Verify Password
   ↓
Create Session / Token
   ↓
Authenticated User
```

Setiap protected request:

```text
Request
   ↓
Authentication Middleware
   ↓
Identify User
   ↓
Attach Current User
   ↓
Controller
```

---

# 12. Password Security

Password tidak boleh disimpan dalam plaintext.

Database hanya menyimpan:

```text
passwordHash
```

Flow:

```text
Password
   ↓
Hash
   ↓
passwordHash
   ↓
SQLite
```

Saat login:

```text
Password
   ↓
Verify Against Hash
   ↓
Authenticated / Rejected
```

---

# 13. Authorization Architecture

Authorization dilakukan di backend.

Role utama:

```text
USER
ADMIN
```

Flow:

```text
Request
   ↓
Authentication
   ↓
Identify User
   ↓
Check Role / Permission
   ↓
Allow / Reject
```

Jika user belum login:

```text
401 Unauthorized
```

Jika user tidak memiliki permission:

```text
403 Forbidden
```

---

# 14. Ownership Authorization

Selain role, sistem menggunakan ownership rule.

Contoh:

```text
User A
   ↓
Report milik User A
   ↓
User A dapat Edit/Delete
```

Sedangkan:

```text
User B
   ↓
Report milik User A
   ↓
Tidak dapat Edit/Delete
```

Ownership harus diverifikasi oleh backend.

Frontend hanya melakukan hide/show UI sebagai UX.

---

# 15. Report Architecture

Report merupakan core entity sistem.

Jenis report:

```text
LOST
FOUND
```

Report memiliki lifecycle:

```text
PENDING_VERIFICATION
        ↓
      ACTIVE
        ↓
   ┌────┼─────────┐
   ↓    ↓         ↓
 FOUND CANCELLED COMPLETED
   ↓
 CLAIMED
   ↓
 COMPLETED
```

Report juga dapat:

```text
REJECTED
```

jika ditolak oleh admin saat verifikasi.

---

# 16. Report Creation Flow

```text
Frontend
   ↓
POST /api/reports
   ↓
Authentication
   ↓
Validation
   ↓
Report Service
   ↓
Create Report
   ↓
PENDING_VERIFICATION
   ↓
SQLite
```

Setelah report dibuat:

```text
PENDING_VERIFICATION
```

Report belum dianggap aktif sebelum diverifikasi admin.

---

# 17. Report Verification

Admin melakukan verifikasi.

Flow:

```text
Admin
   ↓
Review Report
   ↓
Approve / Reject
```

Approve:

```text
PENDING_VERIFICATION
        ↓
      ACTIVE
```

Reject:

```text
PENDING_VERIFICATION
        ↓
      REJECTED
```

Reason rejection disimpan jika diperlukan oleh business rule.

---

# 18. Report Status Transition

Backend wajib melakukan validasi status transition.

Valid transition:

```text
PENDING_VERIFICATION
        │
        ├──→ ACTIVE
        └──→ REJECTED
```

```text
ACTIVE
   │
   ├──→ FOUND
   ├──→ CANCELLED
   ├──→ CLAIMED
   └──→ COMPLETED
```

Backend harus menolak transition yang tidak valid.

Contoh:

```text
REJECTED → ACTIVE
```

tidak boleh dilakukan melalui endpoint normal jika tidak didefinisikan oleh business rule.

---

# 19. Claim Architecture

Claim hanya dapat dibuat terhadap report:

```text
type = FOUND
status = ACTIVE
```

Flow:

```text
User
   ↓
Found Report
   ↓
Claim
   ↓
PENDING
   ↓
Admin Review
```

Admin dapat:

```text
APPROVE
REJECT
```

---

# 20. Claim Approval Transaction

Approval claim merupakan operasi kritis.

Operasi harus dilakukan dalam transaction.

```text
Approve Claim
      │
      ▼
BEGIN TRANSACTION
      │
      ├── Update Claim
      │      ↓
      │   APPROVED
      │
      ├── Update Report
      │      ↓
      │   CLAIMED
      │
      ├── Create Notification
      │
      └── Create Activity Log
      │
      ▼
COMMIT
```

Jika salah satu operasi gagal:

```text
ROLLBACK
```

---

# 21. Claim Status

Status claim:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

Transition:

```text
PENDING
   │
   ├──→ APPROVED
   ├──→ REJECTED
   └──→ CANCELLED
```

Claim yang sudah:

```text
APPROVED
REJECTED
CANCELLED
```

tidak boleh diproses ulang menggunakan transition normal.

---

# 22. Category Architecture

Category digunakan oleh report.

Admin dapat:

```text
Create
Update
Deactivate
```

Category tidak sebaiknya dihapus secara destructive jika masih digunakan oleh report.

Gunakan:

```text
isActive = false
```

untuk category yang tidak lagi tersedia.

Report lama tetap mempertahankan referensi category.

---

# 23. User Management Architecture

Admin dapat melihat user.

Data yang dapat dikelola:

```text
Name
Email
Role
Status
```

User dapat dinonaktifkan:

```text
isActive = false
```

User inactive tidak dapat melakukan login.

---

# 24. Notification Architecture

Notification dibuat berdasarkan system event.

Contoh:

```text
REPORT_APPROVED
REPORT_REJECTED
CLAIM_CREATED
CLAIM_APPROVED
CLAIM_REJECTED
REPORT_STATUS_CHANGED
```

Flow:

```text
Business Event
      ↓
Notification Service
      ↓
notifications
      ↓
User
```

Untuk MVP, notification dapat berupa:

```text
In-app notification
```

Tidak wajib menggunakan email/push notification.

---

# 25. Activity Log Architecture

Activity log digunakan untuk mencatat aktivitas penting.

Contoh:

```text
REPORT_CREATED
REPORT_UPDATED
REPORT_DELETED
REPORT_APPROVED
REPORT_REJECTED

CLAIM_CREATED
CLAIM_APPROVED
CLAIM_REJECTED
CLAIM_CANCELLED

CATEGORY_CREATED
CATEGORY_UPDATED
CATEGORY_DEACTIVATED

USER_DEACTIVATED
```

Activity log bersifat:

```text
Append-only
Read-only dari sisi admin
```

User tidak dapat mengubah activity log.

---

# 26. File Upload Architecture

Sistem mendukung upload foto barang.

Flow:

```text
Frontend
   ↓
Upload Image
   ↓
Backend Validation
   ↓
File Storage
   ↓
Store File Reference
   ↓
report_images
```

Database tidak digunakan untuk menyimpan binary image jika tidak diperlukan.

Database menyimpan:

```text
file URL / path
```

---

# 27. File Storage

Untuk MVP, file dapat disimpan pada local storage.

Contoh:

```text
backend/
└── uploads/
    └── reports/
        ├── image-001.jpg
        ├── image-002.jpg
        └── ...
```

Database:

```text
report_images
```

menyimpan reference terhadap file.

---

# 28. File Validation

Backend wajib memvalidasi file.

Minimal:

```text
File Type
File Size
File Name
```

Format yang diperbolehkan dapat ditentukan dalam konfigurasi.

Contoh:

```text
image/jpeg
image/png
image/webp
```

Frontend validation tidak menggantikan backend validation.

---

# 29. API Architecture

API menggunakan REST.

Base:

```text
/api
```

Endpoint utama:

```text
/api/auth
/api/reports
/api/claims
/api/categories
/api/notifications
/api/admin
```

---

# 30. Authentication API

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

# 31. Report API

```http
GET    /api/reports
POST   /api/reports
GET    /api/reports/:id
PATCH  /api/reports/:id
DELETE /api/reports/:id
```

---

# 32. Claim API

```http
GET   /api/claims
POST  /api/reports/:reportId/claims
GET   /api/claims/:id
PATCH /api/claims/:id/cancel
```

---

# 33. Category API

```http
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

Untuk delete category, implementasi aktual dapat menggunakan deactivate:

```text
isActive = false
```

---

# 34. Notification API

```http
GET   /api/notifications
PATCH /api/notifications/:id/read
```

---

# 35. Admin API

```http
GET   /api/admin/dashboard

GET   /api/admin/reports
GET   /api/admin/reports/:id
PATCH /api/admin/reports/:id/status

GET   /api/admin/claims
GET   /api/admin/claims/:id
PATCH /api/admin/claims/:id/status

GET   /api/admin/users
GET   /api/admin/users/:id
PATCH /api/admin/users/:id/status

GET   /api/admin/activity-logs
```

---

# 36. API Response Architecture

Response harus konsisten.

Success:

```json
{
  "success": true,
  "data": {}
}
```

List:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data tidak valid.",
    "details": {}
  }
}
```

Format final harus mengikuti kontrak pada `API.md`.

---

# 37. HTTP Status Codes

Gunakan HTTP status code secara konsisten.

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity

500 Internal Server Error
```

---

# 38. Validation Architecture

Validasi dilakukan pada backend.

Minimal:

```text
Request Validation
Business Validation
Database Constraint
```

Contoh:

```text
Create Claim
    ↓
Validate Request
    ↓
Find Report
    ↓
Check Report Type
    ↓
Check Report Status
    ↓
Check Existing Claim
    ↓
Create Claim
```

---

# 39. Business Rule Validation

Backend wajib memvalidasi:

```text
User authentication
User role
Resource ownership
Report status
Claim status
Category status
User status
Duplicate claim
Valid status transition
```

---

# 40. Duplicate Claim Rule

User tidak boleh membuat claim aktif berulang terhadap report yang sama.

Contoh:

```text
User A
   ↓
Claim Report 123
   ↓
PENDING
```

Jika User A mencoba claim lagi:

```text
409 Conflict
```

---

# 41. Self-Claim Rule

User tidak boleh melakukan claim terhadap report FOUND miliknya sendiri.

Contoh:

```text
Reporter = User A
Claimant = User A
```

Request harus ditolak.

---

# 42. Report Ownership Rule

User hanya dapat mengubah atau menghapus report miliknya.

```text
report.reporterId === currentUser.id
```

Jika tidak:

```text
403 Forbidden
```

---

# 43. Admin Override

Admin memiliki akses administratif terhadap report dan claim sesuai business rule.

Namun setiap perubahan administratif harus:

```text
Authorized
Validated
Logged
```

---

# 44. Transaction Strategy

Gunakan transaction untuk operasi multi-step yang harus atomic.

Contoh:

```text
Approve Claim
Reject Claim
Approve Report
Reject Report
Delete/Deactivate User jika melibatkan banyak entity
```

Contoh:

```text
BEGIN
 ↓
Update entity
 ↓
Create notification
 ↓
Create activity log
 ↓
COMMIT
```

Jika terjadi error:

```text
ROLLBACK
```

---

# 45. SQLite Transaction

SQLite mendukung transaction.

Backend harus memanfaatkan transaction untuk operasi yang memodifikasi beberapa tabel sekaligus.

Contoh:

```text
Claim Approval

claims
reports
notifications
activity_logs
```

semuanya harus konsisten.

---

# 46. SQLite Foreign Key

Foreign key enforcement harus diaktifkan.

Relasi utama:

```text
users
  │
  ├── reports
  ├── claims
  ├── notifications
  └── activity_logs

categories
  │
  └── reports

reports
  │
  ├── report_images
  └── claims
```

---

# 47. SQLite Boolean Convention

SQLite tidak memiliki boolean native seperti beberapa database lain.

Gunakan:

```text
INTEGER
```

Convention:

```text
0 = false
1 = true
```

Contoh:

```text
isActive INTEGER NOT NULL DEFAULT 1
isRead INTEGER NOT NULL DEFAULT 0
```

ORM bertanggung jawab melakukan mapping ke boolean application-level.

---

# 48. SQLite Date/Time Convention

SQLite menyimpan timestamp sebagai:

```text
TEXT
```

Gunakan format:

```text
ISO 8601
```

Contoh:

```text
2026-08-18T15:30:00.000Z
```

Semua timestamp harus konsisten menggunakan UTC pada storage layer.

Frontend dapat mengubah timestamp ke timezone pengguna untuk display.

---

# 49. SQLite ID Convention

Untuk MVP, entity ID dapat menggunakan:

```text
INTEGER PRIMARY KEY
```

Contoh:

```text
id INTEGER PRIMARY KEY AUTOINCREMENT
```

Namun implementasi final harus mengikuti schema Prisma yang telah ditetapkan di `Database.md`.

---

# 50. Soft Delete

Report menggunakan soft delete jika didefinisikan pada `Database.md`.

Contoh:

```text
deletedAt
```

Flow:

```text
Delete Report
    ↓
deletedAt = current timestamp
```

Data tidak langsung dihapus secara fisik.

Query normal harus mengabaikan record yang sudah soft deleted.

---

# 51. Query Filtering

Report list mendukung:

```text
Search
Filter Type
Filter Category
Filter Status
Filter Location
Pagination
```

Backend bertanggung jawab melakukan filtering.

Frontend tidak boleh mengambil seluruh database kemudian melakukan filtering sebagai mekanisme utama.

---

# 52. Pagination

List endpoint menggunakan pagination.

Contoh:

```http
GET /api/reports?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Backend harus memberikan limit maksimum untuk mencegah request berlebihan.

---

# 53. Search

Search minimal mendukung:

```text
Item Name
Description
Location
```

Implementasi awal dapat menggunakan SQLite query biasa.

AI matching tidak digunakan.

---

# 54. Sorting

Sorting default:

```text
createdAt DESC
```

Report terbaru ditampilkan terlebih dahulu.

Sorting tambahan dapat ditambahkan jika didefinisikan dalam `API.md`.

---

# 55. Error Handling Architecture

Semua error diproses melalui centralized error handler.

```text
Controller
   ↓
Error
   ↓
Error Handler
   ↓
Normalize Error
   ↓
HTTP Response
```

Jangan mengembalikan stack trace kepada client pada production.

---

# 56. Error Categories

Minimal:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
INVALID_STATUS_TRANSITION
FILE_UPLOAD_ERROR
DATABASE_ERROR
INTERNAL_SERVER_ERROR
```

---

# 57. Logging

Backend memiliki logging untuk:

```text
Server Error
Database Error
Authentication Error
Unexpected Exception
```

Sensitive information tidak boleh masuk log.

Jangan log:

```text
Password
Authentication Secret
Session Secret
Sensitive Token
```

---

# 58. Security

Backend wajib menerapkan:

```text
Password Hashing
Authentication
Authorization
Input Validation
File Validation
CORS
Rate Limiting jika diperlukan
Secure Headers
```

---

# 59. CORS

CORS hanya mengizinkan origin frontend yang telah dikonfigurasi.

Jangan menggunakan:

```text
Allow-Origin: *
```

untuk production jika authentication menggunakan credential/cookie.

---

# 60. Input Sanitization

Input user harus divalidasi.

Minimal:

```text
String length
Required fields
Enum
Date
ID
Email
File
```

Jangan mempercayai data dari frontend.

---

# 61. Rate Limiting

Rate limiting dapat diterapkan terutama untuk:

```text
Login
Register
File Upload
Report Creation
Claim Creation
```

Untuk MVP dapat menggunakan konfigurasi sederhana sesuai kebutuhan deployment.

---

# 62. Authentication Session Security

Jika menggunakan cookie/session:

```text
HttpOnly
Secure pada HTTPS
SameSite sesuai kebutuhan
```

Jika menggunakan token:

```text
Expiration
Revocation strategy
Secure storage
```

Detail final mengikuti implementasi authentication yang dipilih.

---

# 63. API Documentation

API harus didokumentasikan sesuai `API.md`.

Jika menggunakan OpenAPI/Swagger, dokumentasi dapat dibuat sebagai tambahan.

API documentation harus mencakup:

```text
Endpoint
Method
Authentication
Request
Response
Validation
Error
```

---

# 64. Seed Data

Buat seed data untuk development.

Minimal:

```text
1 Admin
1 User
Beberapa Category
Beberapa Report
```

Contoh:

```text
Admin
admin@example.com

User
user@example.com
```

Password development harus hanya digunakan untuk local development dan tidak digunakan pada production.

---

# 65. Development Database

Database development:

```text
data/database.sqlite
```

Database production tidak boleh menggunakan seed credentials development.

---

# 66. Database Reset

Sediakan command development untuk:

```text
Reset Database
Run Migration
Seed Database
```

Contoh flow:

```text
Reset
 ↓
Migration
 ↓
Seed
 ↓
Ready
```

Command aktual mengikuti tooling yang digunakan.

---

# 67. File Storage Development

Local development:

```text
uploads/
└── reports/
```

Pastikan folder tidak hilang saat server restart.

Jika upload directory tidak tersedia:

```text
Backend membuat directory secara otomatis.
```

---

# 68. API Authentication Matrix

| Endpoint          |            Public | USER |             ADMIN |
| ----------------- | ----------------: | ---: | ----------------: |
| Register          |                 ✓ |    - |                 - |
| Login             |                 ✓ |    - |                 - |
| Logout            |                 - |    ✓ |                 ✓ |
| Me                |                 - |    ✓ |                 ✓ |
| Report List       | ✓ / sesuai policy |    ✓ |                 ✓ |
| Report Detail     | ✓ / sesuai policy |    ✓ |                 ✓ |
| Create Report     |                 - |    ✓ | ✓ jika diperlukan |
| Edit Own Report   |                 - |    ✓ |                 ✓ |
| Delete Own Report |                 - |    ✓ |                 ✓ |
| Create Claim      |                 - |    ✓ |                 - |
| My Claims         |                 - |    ✓ |                 - |
| Notifications     |                 - |    ✓ |                 ✓ |
| Admin Dashboard   |                 - |    - |                 ✓ |
| Admin Reports     |                 - |    - |                 ✓ |
| Admin Claims      |                 - |    - |                 ✓ |
| Categories        | ✓ / sesuai policy |    ✓ |                 ✓ |
| Manage Categories |                 - |    - |                 ✓ |
| Users             |                 - |    - |                 ✓ |
| Activity Logs     |                 - |    - |                 ✓ |

Policy final mengikuti `API.md`.

---

# 69. Core Backend Services

Minimal service layer:

```text
AuthService
UserService
ReportService
ClaimService
CategoryService
NotificationService
ActivityLogService
FileService
```

---

# 70. AuthService

Tanggung jawab:

```text
Register
Login
Logout
Get Current User
Password Verification
Session Management
```

Tidak menangani UI.

---

# 71. ReportService

Tanggung jawab:

```text
Create Report
Get Reports
Get Report Detail
Update Report
Delete Report
Verify Report
Change Report Status
Validate Ownership
Validate Status Transition
```

---

# 72. ClaimService

Tanggung jawab:

```text
Create Claim
Get Claims
Get Claim Detail
Cancel Claim
Approve Claim
Reject Claim
Validate Claim Eligibility
```

---

# 73. CategoryService

Tanggung jawab:

```text
List Categories
Create Category
Update Category
Deactivate Category
```

---

# 74. NotificationService

Tanggung jawab:

```text
Create Notification
Get User Notifications
Mark as Read
```

---

# 75. ActivityLogService

Tanggung jawab:

```text
Create Log
Get Logs
Filter Logs
```

---

# 76. FileService

Tanggung jawab:

```text
Validate File
Generate File Name
Store File
Delete File
Get File URL
```

---

# 77. Repository Layer

Repository bertanggung jawab terhadap data access.

Contoh:

```text
UserRepository
ReportRepository
ClaimRepository
CategoryRepository
NotificationRepository
ActivityLogRepository
```

Repository tidak menentukan business rule.

Contoh:

```text
Repository:
Find report by ID
```

Sedangkan:

```text
Service:
Apakah report boleh di-claim?
```

adalah business logic.

---

# 78. Controller Responsibility

Controller hanya bertanggung jawab terhadap:

```text
Receive Request
Validate Input Schema
Call Service
Return Response
```

Controller tidak boleh memiliki business logic kompleks.

---

# 79. Request Flow

Contoh create report:

```text
HTTP Request
     ↓
Route
     ↓
Auth Middleware
     ↓
Request Validation
     ↓
Report Controller
     ↓
Report Service
     ↓
Report Repository
     ↓
Prisma
     ↓
SQLite
     ↓
Response
```

---

# 80. Claim Approval Flow

```text
HTTP Request
     ↓
Admin Auth
     ↓
Authorization
     ↓
Claim Controller
     ↓
Claim Service
     ↓
Validate Claim
     ↓
BEGIN TRANSACTION
     ├── Claim → APPROVED
     ├── Report → CLAIMED
     ├── Notification
     └── Activity Log
     ↓
COMMIT
     ↓
Response
```

---

# 81. Report Rejection Flow

```text
Admin
 ↓
Reject Report
 ↓
Validate Reason
 ↓
Check Status
 ↓
Transaction
 ├── Report → REJECTED
 ├── Notification
 └── Activity Log
 ↓
Commit
```

---

# 82. Report Approval Flow

```text
Admin
 ↓
Approve Report
 ↓
Check Status
 ↓
Transaction
 ├── Report → ACTIVE
 ├── Notification
 └── Activity Log
 ↓
Commit
```

---

# 83. Data Integrity Rules

Backend harus memastikan:

```text
Report memiliki reporter valid.
Report memiliki category valid.
Claim memiliki report valid.
Claim memiliki claimant valid.
Notification memiliki user valid.
Activity log memiliki actor valid jika actor diperlukan.
Report image memiliki report valid.
```

---

# 84. Referential Integrity

Jika entity memiliki foreign key:

```text
Foreign Key
+
Application Validation
```

digunakan bersama.

Jangan hanya mengandalkan application code.

---

# 85. SQLite Concurrency Consideration

SQLite cocok untuk MVP dan penggunaan dengan traffic rendah hingga menengah.

Namun SQLite memiliki keterbatasan concurrent write dibanding database server seperti PostgreSQL.

Karena itu:

```text
Write transaction
→ Singkat
→ Atomic
→ Tidak menahan transaction terlalu lama
```

Hindari melakukan operasi berat di dalam transaction.

Contoh yang tidak dianjurkan:

```text
BEGIN
 ↓
Upload file besar
 ↓
External API request
 ↓
Database update
 ↓
COMMIT
```

Lebih baik:

```text
Upload file
 ↓
Validate
 ↓
Database transaction
 ↓
Commit
```

---

# 86. SQLite Production Consideration

SQLite dapat digunakan untuk deployment sederhana.

Namun jika sistem berkembang menjadi:

```text
Banyak concurrent users
Banyak concurrent writes
Multiple backend instances
High traffic
```

database dapat dimigrasikan ke database server seperti PostgreSQL.

Architecture harus menjaga agar migration tersebut tidak memerlukan perubahan besar pada frontend/API.

---

# 87. Database Migration Strategy

SQLite → database server di masa depan harus dimungkinkan.

Karena itu:

```text
Frontend
   ↓
API
   ↓
Service
   ↓
Repository / ORM
   ↓
Database
```

harus dipertahankan.

Frontend tidak boleh bergantung pada SQLite-specific behavior.

---

# 88. Testing Architecture

Backend testing minimal terdiri dari:

```text
Unit Test
Integration Test
API Test
Database Test
Authorization Test
Business Rule Test
```

Prioritas test:

```text
Authentication
Report Creation
Report Verification
Claim Creation
Claim Approval
Claim Rejection
Ownership
Status Transition
```

---

# 89. Critical Backend Test Cases

Minimal:

```text
Register success
Register duplicate email
Login success
Login invalid credential
Inactive user login

Create report success
Create report invalid data
Update own report
Update other user's report
Delete own report
Delete other user's report

Approve report
Reject report
Invalid report status transition

Create valid claim
Create claim on LOST report
Create claim on inactive report
Duplicate claim
Self claim

Approve claim
Reject claim
Invalid claim transition

Unauthorized admin endpoint
Authorized admin endpoint
```

---

# 90. Health Check

Backend menyediakan endpoint:

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

Jika diperlukan, health check dapat melakukan pemeriksaan database connection.

---

# 91. Graceful Shutdown

Backend harus menangani shutdown dengan baik.

Flow:

```text
SIGTERM / SIGINT
      ↓
Stop accepting requests
      ↓
Finish active requests
      ↓
Close database connection
      ↓
Shutdown
```

---

# 92. Production Build

Production build harus:

```text
Compile
 ↓
Validate Environment
 ↓
Run Migration
 ↓
Start Server
```

Migration production harus dijalankan dengan mekanisme deployment yang aman.

---

# 93. Backend Environment

Contoh environment development:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL="file:./data/database.sqlite"

APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

AUTH_SECRET=development-secret
```

Nilai aktual dan nama variable dapat disesuaikan dengan implementasi.

Secret production wajib menggunakan secret yang berbeda.

---

# 94. Backend Folder Structure

Recommended:

```text
backend/
│
├── data/
│   └── database.sqlite
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── uploads/
│   └── reports/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   └── app/
│
├── tests/
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 95. Separation of Concerns

Setiap layer memiliki tanggung jawab:

| Layer                | Responsibility                   |
| -------------------- | -------------------------------- |
| Route                | Endpoint mapping                 |
| Middleware           | Cross-cutting request processing |
| Controller           | HTTP handling                    |
| Validator            | Input validation                 |
| Service              | Business logic                   |
| Repository           | Data access                      |
| Prisma               | ORM                              |
| SQLite               | Persistence                      |
| File Service         | File storage                     |
| Notification Service | Notification                     |
| Activity Log Service | Audit trail                      |

---

# 96. Things Backend Must Not Do

Backend tidak boleh:

```text
Mengandalkan frontend untuk authorization
Mengandalkan frontend untuk business validation
Menyimpan password plaintext
Menyimpan secret dalam source code
Mengembalikan stack trace production
Mengizinkan arbitrary file upload
Mengizinkan invalid status transition
Mengizinkan user mengubah report milik user lain
Mengizinkan duplicate active claim
```

---

# 97. Things Frontend Must Not Control

Frontend tidak menentukan:

```text
Apakah user admin
Apakah user memiliki report
Apakah claim valid
Apakah report dapat di-approve
Apakah status dapat berubah
Apakah user dapat mengakses endpoint
```

Backend harus selalu melakukan pemeriksaan ulang.

---

# 98. Final Architecture Flow

Architecture final:

```text
┌──────────────────────┐
│       Browser        │
│                      │
│   Frontend Web App   │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│       Backend        │
│                      │
│ Routes               │
│ Middleware           │
│ Controllers          │
│ Validators           │
│ Services             │
│ Repositories         │
└──────────┬───────────┘
           │
           │ Prisma
           ▼
┌──────────────────────┐
│        SQLite        │
│                      │
│ database.sqlite      │
└──────────────────────┘

           │
           │
           ▼
┌──────────────────────┐
│    File Storage      │
│                      │
│ Uploaded Images      │
└──────────────────────┘
```

---

# 99. Core Data Flow

## Create Report

```text
User
 ↓
Frontend
 ↓
POST /api/reports
 ↓
Auth Middleware
 ↓
Validation
 ↓
ReportService
 ↓
ReportRepository
 ↓
Prisma
 ↓
SQLite
 ↓
PENDING_VERIFICATION
```

---

## Verify Report

```text
Admin
 ↓
Frontend
 ↓
PATCH /api/admin/reports/:id/status
 ↓
Auth
 ↓
Admin Authorization
 ↓
ReportService
 ↓
Transaction
 ├── Report
 ├── Notification
 └── Activity Log
 ↓
SQLite
```

---

## Claim

```text
User
 ↓
Found Report
 ↓
POST /api/reports/:id/claims
 ↓
Validation
 ↓
ClaimService
 ↓
SQLite
 ↓
PENDING
```

---

## Approve Claim

```text
Admin
 ↓
PATCH /api/admin/claims/:id/status
 ↓
Authorization
 ↓
ClaimService
 ↓
Transaction
 ├── Claim → APPROVED
 ├── Report → CLAIMED
 ├── Notification
 └── Activity Log
 ↓
SQLite
```

---

# 100. Final Technology Decision

Technology architecture yang digunakan:

```text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
Prisma ORM
   ↓
SQLite
```

File:

```text
Local File Storage
```

Authentication:

```text
Session / Token
```

Authorization:

```text
Role + Ownership
```

Database:

```text
SQLite
```

ORM:

```text
Prisma
```

---

# 101. Final Status

**Architecture.md: FINAL**

Architecture ini menjadi baseline teknis untuk:

```text
Database.md
API.md
TaskBackend.md
TaskQA.md
```

Dokumen implementasi:

```text
PRD.md
      ↓
Design.md
      ↓
DesignSystem.md
      ↓
Architecture.md
      ↓
Database.md
      ↓
API.md
      ↓
UserFlow.md
      ↓
TaskFrontend.md
      ↓
TaskBackend.md
      ↓
TaskQA.md
```
