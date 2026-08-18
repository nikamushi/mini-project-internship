# TaskBackend.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0  
**Status:** Final  
**Scope:** Backend Development

---

# 1. Backend Objective

Backend bertanggung jawab menyediakan API, business logic, authentication, authorization, database access, file handling, notification, dan activity logging.

Arsitektur backend:

```text
Frontend
   ↓
REST API
   ↓
Controller
   ↓
Service
   ↓
Repository / Prisma
   ↓
SQLite
```

Backend harus mengikuti prinsip:

```text
Controller
    ↓
Service
    ↓
Database
```

Controller tidak boleh mengandung business logic kompleks.

---

# 2. Backend Technology

Gunakan teknologi yang sudah ditentukan pada `Architecture.md`.

```text
Runtime       : Node.js
Language      : TypeScript
API           : REST API
ORM           : Prisma
Database      : SQLite
Authentication: Session/JWT sesuai Architecture.md
Validation    : Backend schema validation
File Storage  : Local Storage untuk MVP
```

---

# 3. Backend Project Structure

Struktur backend:

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── config/
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── report.controller.ts
│   │   ├── category.controller.ts
│   │   ├── claim.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── user.controller.ts
│   │   └── dashboard.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── report.service.ts
│   │   ├── category.service.ts
│   │   ├── claim.service.ts
│   │   ├── notification.service.ts
│   │   ├── user.service.ts
│   │   └── dashboard.service.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── report.repository.ts
│   │   ├── category.repository.ts
│   │   ├── claim.repository.ts
│   │   ├── notification.repository.ts
│   │   └── activity-log.repository.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── report.validator.ts
│   │   ├── category.validator.ts
│   │   └── claim.validator.ts
│   │
│   ├── utils/
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── report.routes.ts
│   │   ├── category.routes.ts
│   │   ├── claim.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── user.routes.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── uploads/
│   └── reports/
│
├── data/
│   └── database.sqlite
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

# 4. Task Priority

Priority:

```text
P0 = Required
P1 = Important
P2 = Future / Optional
```

---

# 5. Backend Development Order

Implementasi dilakukan dengan urutan:

```text
1. Project Setup
2. Database Setup
3. Prisma Schema
4. Migration
5. Seed
6. Authentication
7. Authorization
8. Category
9. Report
10. Image Upload
11. Claim
12. Notification
13. Activity Log
14. Dashboard
15. Error Handling
16. Security
17. Testing
18. API Documentation
```

---

# 6. BE-001 — Backend Project Setup

**Priority:** P0

## Objective

Mempersiapkan project backend TypeScript.

## Tasks

- [ ] Initialize backend project.
- [ ] Configure TypeScript.
- [ ] Configure development server.
- [ ] Configure environment variables.
- [ ] Configure linting.
- [ ] Configure formatting.
- [ ] Configure error handling.
- [ ] Configure project scripts.
- [ ] Configure `.gitignore`.
- [ ] Create `.env.example`.

## Acceptance Criteria

- Backend dapat dijalankan secara lokal.
- TypeScript dapat di-compile.
- Environment variable dapat dibaca.
- Tidak terdapat secret hardcoded.
- Project dapat digunakan untuk task berikutnya.

---

# 7. BE-002 — Environment Configuration

**Priority:** P0

## Required Environment

Contoh:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="file:./data/database.sqlite"

JWT_SECRET=
JWT_EXPIRES_IN=

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=
```

Nilai actual secret tidak boleh dimasukkan ke repository.

## Tasks

- [ ] Buat `.env.example`.
- [ ] Buat environment configuration module.
- [ ] Validasi environment variables.
- [ ] Pastikan application gagal start jika konfigurasi penting tidak tersedia.

---

# 8. BE-003 — Prisma Setup

**Priority:** P0

## Tasks

- [ ] Install Prisma.
- [ ] Initialize Prisma.
- [ ] Configure SQLite datasource.
- [ ] Configure Prisma Client.
- [ ] Buat `schema.prisma`.
- [ ] Buat Prisma singleton.
- [ ] Pastikan Prisma Client dapat digunakan dari service/repository.

## Acceptance Criteria

```text
Application
    ↓
Prisma Client
    ↓
SQLite
```

berhasil berjalan tanpa error.

---

# 9. BE-004 — Database Schema

**Priority:** P0

Implementasikan schema berdasarkan `Database.md`.

Models:

```text
User
Category
Report
ReportImage
Claim
Notification
ActivityLog
```

## Tasks

- [ ] Buat User model.
- [ ] Buat Category model.
- [ ] Buat Report model.
- [ ] Buat ReportImage model.
- [ ] Buat Claim model.
- [ ] Buat Notification model.
- [ ] Buat ActivityLog model.
- [ ] Buat foreign key.
- [ ] Buat indexes.
- [ ] Buat unique constraints.
- [ ] Buat default values.
- [ ] Implement soft delete report.
- [ ] Implement timestamp fields.

---

# 10. BE-005 — Database Migration

**Priority:** P0

## Tasks

- [ ] Generate initial migration.
- [ ] Jalankan migration.
- [ ] Pastikan database berhasil dibuat.
- [ ] Pastikan semua table tersedia.
- [ ] Pastikan foreign key aktif.
- [ ] Pastikan index tersedia.

## Acceptance Criteria

Fresh database:

```text
Empty SQLite
    ↓
Migration
    ↓
Complete Schema
```

harus berhasil tanpa manual database modification.

---

# 11. BE-006 — Database Seed

**Priority:** P0

## Tasks

- [ ] Buat `prisma/seed.ts`.
- [ ] Buat admin user.
- [ ] Buat sample user.
- [ ] Buat default categories.
- [ ] Buat optional sample reports.
- [ ] Buat optional sample claims.

## Default Categories

```text
Elektronik
Dokumen
Pakaian
Aksesori
Buku
Lainnya
```

## Acceptance Criteria

Seed dapat dijalankan berulang tanpa menghasilkan duplicate data.

---

# 12. BE-007 — Authentication

**Priority:** P0

Authentication mencakup:

```text
Register
Login
Logout
Current User
```

Jika registration tidak termasuk scope final, endpoint register tidak perlu dibuat.

## Tasks

- [ ] Implement password hashing.
- [ ] Implement login.
- [ ] Implement authentication token/session.
- [ ] Implement logout.
- [ ] Implement current-user endpoint.
- [ ] Handle invalid credentials.
- [ ] Handle inactive user.
- [ ] Jangan return `password_hash`.

---

# 13. BE-008 — Password Security

**Priority:** P0

Password tidak boleh disimpan plaintext.

```text
Plain Password
      ↓
Hash
      ↓
password_hash
```

Backend harus menggunakan password hashing algorithm yang aman.

Password tidak boleh:

```text
Returned by API
Logged
Stored in activity log
Stored in database plaintext
```

---

# 14. BE-009 — Authentication Middleware

**Priority:** P0

Buat middleware:

```text
requireAuth
```

Tugas:

- [ ] Validasi authentication token/session.
- [ ] Resolve current user.
- [ ] Reject unauthenticated request.
- [ ] Attach user context ke request.
- [ ] Handle expired authentication.

Response:

```text
401 Unauthorized
```

---

# 15. BE-010 — Authorization / Role Middleware

**Priority:** P0

Buat middleware:

```text
requireRole()
```

Role:

```text
USER
ADMIN
```

Contoh:

```text
requireAuth
    ↓
requireRole("ADMIN")
    ↓
Controller
```

Unauthorized:

```text
403 Forbidden
```

---

# 16. BE-011 — Category API

**Priority:** P0

Endpoint:

```text
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

## Tasks

- [ ] Get active categories.
- [ ] Get category detail jika diperlukan.
- [ ] Create category.
- [ ] Update category.
- [ ] Deactivate category.
- [ ] Validate duplicate name.
- [ ] Restrict management endpoint untuk admin.

---

# 17. BE-012 — Report Creation

**Priority:** P0

Endpoint:

```text
POST /api/reports
```

Input:

```text
type
itemName
categoryId
description
location
occurredAt
images
```

## Tasks

- [ ] Validate authenticated user.
- [ ] Validate category.
- [ ] Validate report type.
- [ ] Validate required fields.
- [ ] Create report.
- [ ] Set initial status.
- [ ] Save images.
- [ ] Create activity log.

Initial status:

```text
PENDING_VERIFICATION
```

---

# 18. BE-013 — Report List

**Priority:** P0

Endpoint:

```text
GET /api/reports
```

Support:

```text
Search
Filter
Sort
Pagination
```

Filter:

```text
type
category
status
location
```

Search:

```text
itemName
description
location
```

Pagination:

```text
page
limit
```

---

# 19. BE-014 — Report Detail

**Priority:** P0

Endpoint:

```text
GET /api/reports/:id
```

Response minimal:

```text
Report
Category
Reporter information
Images
Status
Created date
```

Jangan expose:

```text
password_hash
internal secrets
sensitive internal fields
```

---

# 20. BE-015 — Update Own Report

**Priority:** P0

Endpoint:

```text
PATCH /api/reports/:id
```

Rules:

```text
Authenticated
AND
reporter_id = current_user.id
```

atau:

```text
current_user.role = ADMIN
```

## Tasks

- [ ] Validate ownership.
- [ ] Validate input.
- [ ] Update allowed fields.
- [ ] Create activity log.
- [ ] Handle invalid status modification.

---

# 21. BE-016 — Delete Own Report

**Priority:** P0

Endpoint:

```text
DELETE /api/reports/:id
```

Gunakan soft delete:

```text
deleted_at = current timestamp
```

Jangan langsung:

```text
DELETE FROM reports
```

untuk normal user flow.

---

# 22. BE-017 — Admin Report Verification

**Priority:** P0

Endpoint:

```text
PATCH /api/admin/reports/:id/status
```

Admin dapat:

```text
Approve
Reject
Change Status
```

Status:

```text
PENDING_VERIFICATION
ACTIVE
REJECTED
```

## Tasks

- [ ] Validate admin role.
- [ ] Validate current status.
- [ ] Validate transition.
- [ ] Update report.
- [ ] Create notification.
- [ ] Create activity log.
- [ ] Use transaction.

---

# 23. BE-018 — Report Status Transition

**Priority:** P0

Implementasikan status transition guard.

Contoh:

```text
PENDING_VERIFICATION
    ↓
ACTIVE
```

atau:

```text
PENDING_VERIFICATION
    ↓
REJECTED
```

Invalid transition harus ditolak.

Contoh:

```text
COMPLETED
    ↓
ACTIVE
```

tidak diperbolehkan kecuali business rule secara eksplisit mengizinkan.

---

# 24. BE-019 — Image Upload

**Priority:** P0

Backend harus mendukung upload gambar report.

## Tasks

- [ ] Implement multipart/form-data.
- [ ] Validate file type.
- [ ] Validate file size.
- [ ] Generate safe filename.
- [ ] Store file.
- [ ] Save file reference ke `report_images`.
- [ ] Prevent executable file upload.
- [ ] Handle upload failure.
- [ ] Cleanup orphan file.

---

# 25. BE-020 — Image Security

**Priority:** P0

Allowed image types harus dibatasi.

Contoh:

```text
image/jpeg
image/png
image/webp
```

Jangan mempercayai extension saja.

Validasi:

```text
MIME Type
File Signature
File Size
Filename
```

---

# 26. BE-021 — Claim Creation

**Priority:** P0

Endpoint:

```text
POST /api/reports/:reportId/claims
```

Rules:

```text
Report type = FOUND
Report status = ACTIVE
Claimant != reporter
No active duplicate claim
```

Input:

```text
reason
evidence
```

Initial status:

```text
PENDING
```

---

# 27. BE-022 — Claim List

**Priority:** P0

Endpoint:

```text
GET /api/claims
```

User:

```text
Own claims
```

Admin:

```text
All claims
```

Support filter:

```text
status
report
createdAt
```

---

# 28. BE-023 — Claim Detail

**Priority:** P0

Endpoint:

```text
GET /api/claims/:id
```

Access:

```text
Claim owner
Admin
```

Response:

```text
Claim
Report
Claimant
Status
Reason
Evidence
Review reason
```

---

# 29. BE-024 — Admin Claim Review

**Priority:** P0

Endpoint:

```text
PATCH /api/admin/claims/:id/status
```

Admin dapat:

```text
APPROVED
REJECTED
```

## Approve Flow

```text
Admin
 ↓
Validate Claim
 ↓
Update Claim → APPROVED
 ↓
Update Report → CLAIMED
 ↓
Create Notification
 ↓
Create Activity Log
 ↓
COMMIT
```

Gunakan database transaction.

---

# 30. BE-025 — Claim Rejection

**Priority:** P0

Flow:

```text
Admin
 ↓
Validate Claim
 ↓
Update Claim → REJECTED
 ↓
Save review reason
 ↓
Create Notification
 ↓
Create Activity Log
 ↓
COMMIT
```

---

# 31. BE-026 — Notification Service

**Priority:** P0

Buat:

```text
NotificationService
```

Fungsi:

```text
createNotification()
getNotifications()
markAsRead()
markAllAsRead()
```

---

# 32. BE-027 — Notification API

**Priority:** P0

Endpoint:

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

User hanya dapat mengakses notification miliknya.

---

# 33. BE-028 — Notification Trigger

Notification dibuat ketika:

```text
Report Approved
Report Rejected
Report Status Changed

Claim Created
Claim Approved
Claim Rejected
```

Contoh:

```text
Report Approved
       ↓
Notification
       ↓
Reporter
```

---

# 34. BE-029 — Activity Log Service

**Priority:** P0

Buat:

```text
ActivityLogService
```

Fungsi:

```text
createLog()
```

Log harus dibuat untuk aktivitas penting.

---

# 35. BE-030 — Activity Logging

**Priority:** P0

Minimal log:

```text
USER_LOGIN

REPORT_CREATED
REPORT_UPDATED
REPORT_DELETED
REPORT_APPROVED
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

# 36. BE-031 — Dashboard API

**Priority:** P1

Admin dashboard membutuhkan summary.

Endpoint:

```text
GET /api/admin/dashboard
```

Data:

```text
Total Reports
Pending Reports
Active Reports
Found Reports
Completed Reports
Pending Claims
Total Users
```

Query harus menggunakan aggregate yang efisien.

---

# 37. BE-032 — Admin User Management

**Priority:** P1

Endpoint:

```text
GET   /api/admin/users
GET   /api/admin/users/:id
PATCH /api/admin/users/:id/status
```

Admin dapat:

```text
View User
Deactivate User
Activate User
```

User tidak dapat melakukan operasi ini.

---

# 38. BE-033 — Error Handling

**Priority:** P0

Gunakan centralized error handler.

Format response:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

HTTP status:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Jangan expose:

```text
Stack trace
Database credentials
Internal file path
SQL query
Secret
```

pada production response.

---

# 39. BE-034 — Validation

**Priority:** P0

Semua input API harus divalidasi backend.

Validation mencakup:

```text
Type
Required
Length
Format
Enum
Foreign Key
Business Rule
```

Frontend validation tidak dianggap cukup.

---

# 40. BE-035 — API Response Standard

Response sukses:

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
  "message": "Validation failed",
  "errors": []
}
```

---

# 41. BE-036 — Pagination Standard

Gunakan:

```text
page
limit
```

Contoh:

```text
GET /api/reports?page=1&limit=20
```

Backend harus:

- [ ] Validate page.
- [ ] Validate limit.
- [ ] Set default.
- [ ] Set maximum limit.
- [ ] Return metadata.

---

# 42. BE-037 — Search and Filter

Report endpoint mendukung:

```text
GET /api/reports
```

Query:

```text
?q=
&type=
&categoryId=
&status=
&location=
&page=
&limit=
```

Contoh:

```text
GET /api/reports?q=iphone&type=LOST&page=1&limit=20
```

---

# 43. BE-038 — Authorization Rules

Implementasikan matrix:

| Resource           | USER | ADMIN |
| ------------------ | ---- | ----- |
| View Reports       | Yes  | Yes   |
| Create Report      | Yes  | Yes   |
| Update Own Report  | Yes  | Yes   |
| Delete Own Report  | Yes  | Yes   |
| Verify Report      | No   | Yes   |
| View Own Claims    | Yes  | Yes   |
| Create Claim       | Yes  | Yes   |
| Review Claim       | No   | Yes   |
| Manage Categories  | No   | Yes   |
| Manage Users       | No   | Yes   |
| View Activity Logs | No   | Yes   |
| Dashboard          | No   | Yes   |

---

# 44. BE-039 — Ownership Validation

Backend tidak boleh hanya mempercayai:

```text
userId
```

dari request body.

User identity harus berasal dari:

```text
Authenticated Session / Token
```

Contoh:

```text
currentUser.id
```

Kemudian:

```text
report.reporterId === currentUser.id
```

---

# 45. BE-040 — Database Transaction

Transaction wajib digunakan untuk operasi multi-table.

Minimal:

```text
Approve Report
Reject Report
Approve Claim
Reject Claim
```

Contoh:

```text
Prisma Transaction
    ↓
Update entity
    ↓
Create notification
    ↓
Create activity log
    ↓
Commit
```

---

# 46. BE-041 — Prisma Repository

Database access sebaiknya dipisahkan ke repository.

Contoh:

```text
ReportRepository
CategoryRepository
ClaimRepository
UserRepository
NotificationRepository
ActivityLogRepository
```

Service tidak boleh bergantung pada raw SQL jika tidak diperlukan.

---

# 47. BE-042 — Service Layer

Business logic berada di service.

Contoh:

```text
ReportService
ClaimService
CategoryService
NotificationService
UserService
DashboardService
```

Contoh:

```text
Controller
    ↓
ClaimService.approveClaim()
    ↓
ClaimRepository
    ↓
Prisma
```

---

# 48. BE-043 — Controller Responsibility

Controller hanya menangani:

```text
Request
Authentication Context
Validation Result
Service Call
Response
```

Controller tidak boleh menangani:

```text
Complex Business Rule
Direct Database Logic
Transaction Logic
File Processing Logic
```

---

# 49. BE-044 — File Cleanup

Jika database creation gagal setelah file berhasil disimpan:

```text
Upload File
   ↓
Database Failed
   ↓
Delete Uploaded File
```

Jangan meninggalkan orphan file.

---

# 50. BE-045 — Logging

Backend logging minimal mencakup:

```text
Server Start
Server Error
Database Error
Authentication Failure
Upload Error
Unexpected Exception
```

Jangan log:

```text
Password
JWT Secret
Session Secret
Sensitive User Data
```

---

# 51. BE-046 — Health Check

Endpoint:

```text
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

Jika diperlukan, health check dapat melakukan lightweight database connectivity check.

---

# 52. BE-047 — Security Headers

Backend harus menggunakan security middleware yang sesuai.

Minimal:

```text
Security Headers
CORS
Request Size Limit
Rate Limiting
Input Validation
```

---

# 53. BE-048 — Rate Limiting

Rate limit minimal diterapkan untuk:

```text
Login
Authentication
Report Creation
Claim Creation
File Upload
```

Tujuan:

```text
Brute Force Prevention
Spam Prevention
Resource Protection
```

---

# 54. BE-049 — CORS

CORS harus dikonfigurasi berdasarkan frontend origin.

Development:

```text
localhost
```

Production:

```text
Configured Frontend Domain
```

Jangan menggunakan unrestricted:

```text
*
```

untuk production jika credentials digunakan.

---

# 55. BE-050 — Upload Limits

Tentukan:

```text
Maximum file size
Maximum number of images
Allowed MIME types
```

Contoh MVP:

```text
Max image size : 5 MB
Max images     : 5
Types          : JPEG, PNG, WebP
```

Nilai final mengikuti konfigurasi aplikasi.

---

# 56. BE-051 — API Documentation

API harus didokumentasikan berdasarkan `API.md`.

Dokumentasi minimal:

```text
Endpoint
Method
Authentication
Request
Response
Status Code
Validation
Authorization
```

---

# 57. BE-052 — Backend Unit Test

Test minimal untuk:

```text
AuthService
ReportService
ClaimService
CategoryService
NotificationService
```

Test business rule:

```text
User ownership
Claim validation
Status transition
Duplicate claim
Self claim
Admin authorization
```

---

# 58. BE-053 — Backend Integration Test

Test:

```text
API
 ↓
Service
 ↓
Prisma
 ↓
SQLite
```

Minimal:

```text
Login
Create Report
List Report
Create Claim
Approve Claim
Reject Claim
Notification
```

---

# 59. BE-054 — Authentication Test

Test:

```text
Valid Login
Invalid Password
Unknown User
Inactive User
Expired Session/Token
Missing Authentication
```

Expected:

```text
401
```

untuk authentication failure.

---

# 60. BE-055 — Authorization Test

Test:

```text
USER → Admin endpoint
USER → Other user's report
USER → Other user's claim
ADMIN → Admin endpoint
```

Expected unauthorized access:

```text
403 Forbidden
```

atau:

```text
404 Not Found
```

sesuai security strategy.

---

# 61. BE-056 — Report Test

Test:

```text
Create LOST report
Create FOUND report
Invalid category
Invalid type
Missing required field
Update own report
Update other user's report
Delete own report
Admin verification
```

---

# 62. BE-057 — Claim Test

Test:

```text
Create claim on FOUND report
Create claim on LOST report
Create claim on inactive report
Create duplicate claim
Claim own FOUND report
Approve claim
Reject claim
```

Business rule harus konsisten dengan `Database.md`.

---

# 63. BE-058 — Notification Test

Test:

```text
Report Approved → Notification
Report Rejected → Notification
Claim Approved → Notification
Claim Rejected → Notification
Mark Read
Mark All Read
```

---

# 64. BE-059 — Transaction Test

Simulasikan failure pada:

```text
Approve Claim
Approve Report
Reject Claim
Reject Report
```

Pastikan jika salah satu operasi gagal:

```text
Rollback
```

dan tidak ada partial update.

---

# 65. BE-060 — Database Test

Pastikan:

```text
Foreign Key
Unique Constraint
Indexes
Default Values
Soft Delete
Transaction
```

berjalan sesuai `Database.md`.

---

# 66. BE-061 — API Error Test

Test:

```text
400
401
403
404
409
422
500
```

Pastikan format response konsisten.

---

# 67. BE-062 — Performance Test

Test minimal:

```text
Report List
Report Search
Report Filter
Dashboard
Notification List
```

Pastikan:

```text
Pagination aktif
Tidak terjadi N+1 query
Query tidak mengambil data berlebihan
```

---

# 68. BE-063 — SQLite Test

Pastikan:

```text
Fresh Database
Migration
Seed
CRUD
Transaction
Foreign Key
Backup
```

berjalan dengan SQLite.

---

# 69. BE-064 — Production Configuration

Production harus:

```text
NODE_ENV=production
Secure authentication secret
Restricted CORS
Production upload directory
Production logging
Database backup
```

Tidak boleh:

```text
Development credentials
Debug stack trace
Test seed
Public database file
```

---

# 70. BE-065 — Final Backend Checklist

## Project

- [ ] Backend project selesai.
- [ ] TypeScript berjalan.
- [ ] Environment configuration selesai.
- [ ] Error handling selesai.

## Database

- [ ] SQLite aktif.
- [ ] Prisma aktif.
- [ ] Schema selesai.
- [ ] Migration selesai.
- [ ] Seed selesai.
- [ ] Foreign key aktif.
- [ ] Index selesai.

## Authentication

- [ ] Login selesai.
- [ ] Logout selesai.
- [ ] Current user selesai.
- [ ] Password hashing selesai.
- [ ] Authentication middleware selesai.

## Authorization

- [ ] USER role selesai.
- [ ] ADMIN role selesai.
- [ ] Ownership validation selesai.
- [ ] Admin authorization selesai.

## Reports

- [ ] Create report.
- [ ] List report.
- [ ] Detail report.
- [ ] Update report.
- [ ] Delete report.
- [ ] Search.
- [ ] Filter.
- [ ] Pagination.
- [ ] Verification.
- [ ] Status transition.

## Images

- [ ] Upload.
- [ ] Validation.
- [ ] Storage.
- [ ] Database reference.
- [ ] Cleanup.

## Claims

- [ ] Create claim.
- [ ] List claim.
- [ ] Detail claim.
- [ ] Approve claim.
- [ ] Reject claim.
- [ ] Duplicate prevention.
- [ ] Self-claim prevention.

## Notifications

- [ ] Create notification.
- [ ] List notification.
- [ ] Mark as read.
- [ ] Mark all as read.
- [ ] Trigger notification.

## Admin

- [ ] Dashboard.
- [ ] Category management.
- [ ] User management.
- [ ] Report verification.
- [ ] Claim review.
- [ ] Activity log.

## Security

- [ ] Password hashing.
- [ ] Input validation.
- [ ] Authentication.
- [ ] Authorization.
- [ ] CORS.
- [ ] Rate limiting.
- [ ] Security headers.
- [ ] Upload validation.
- [ ] Secret protection.

## Testing

- [ ] Unit test.
- [ ] Integration test.
- [ ] Authentication test.
- [ ] Authorization test.
- [ ] Report test.
- [ ] Claim test.
- [ ] Notification test.
- [ ] Transaction test.
- [ ] Database test.
- [ ] API error test.
- [ ] Performance test.

---

# 71. Definition of Done

Backend dianggap selesai apabila:

```text
PRD
 ↓
Architecture
 ↓
Database
 ↓
API
 ↓
Backend Implementation
```

sudah konsisten.

Semua P0 task harus selesai.

Semua endpoint utama dapat digunakan frontend.

Database menggunakan:

```text
SQLite + Prisma
```

Tidak ada business logic penting yang hanya berada di frontend.

Authentication dan authorization berjalan.

Report LOST dan FOUND dapat dibuat dan dikelola.

Admin dapat melakukan verification.

User dapat membuat claim.

Admin dapat approve/reject claim.

Notification dibuat berdasarkan event penting.

Activity log mencatat aktivitas penting.

Transaction digunakan pada operasi multi-table.

Automated test untuk business rule utama tersedia.

---

# 72. Final Backend Architecture

```text
                    ┌──────────────┐
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ REST API     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Middleware   │
                    │ Auth / Role  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Controller   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Service    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Repository   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Prisma ORM   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   SQLite     │
                    └──────────────┘


                    File Upload
                         │
                         ▼
                  ┌──────────────┐
                  │ File Service │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   uploads/   │
                  └──────────────┘
```

---

# 73. Final Task Status

```text
BE-001  Project Setup              P0
BE-002  Environment Config         P0
BE-003  Prisma Setup               P0
BE-004  Database Schema            P0
BE-005  Migration                  P0
BE-006  Seed                       P0
BE-007  Authentication             P0
BE-008  Password Security          P0
BE-009  Auth Middleware             P0
BE-010  Authorization              P0
BE-011  Category API               P0
BE-012  Report Creation             P0
BE-013  Report List                 P0
BE-014  Report Detail               P0
BE-015  Update Report               P0
BE-016  Delete Report               P0
BE-017  Report Verification        P0
BE-018  Status Transition           P0
BE-019  Image Upload                P0
BE-020  Image Security              P0
BE-021  Claim Creation              P0
BE-022  Claim List                  P0
BE-023  Claim Detail                P0
BE-024  Claim Review                P0
BE-025  Claim Rejection             P0
BE-026  Notification Service        P0
BE-027  Notification API            P0
BE-028  Notification Trigger        P0
BE-029  Activity Log Service        P0
BE-030  Activity Logging            P0
BE-031  Dashboard API               P1
BE-032  User Management             P1
BE-033  Error Handling              P0
BE-034  Validation                  P0
BE-035  Response Standard           P0
BE-036  Pagination                  P0
BE-037  Search & Filter             P0
BE-038  Authorization Rules         P0
BE-039  Ownership Validation        P0
BE-040  Database Transaction        P0
BE-041  Repository                  P0
BE-042  Service Layer               P0
BE-043  Controller Layer            P0
BE-044  File Cleanup                P0
BE-045  Logging                     P0
BE-046  Health Check                P0
BE-047  Security Headers            P0
BE-048  Rate Limiting               P0
BE-049  CORS                        P0
BE-050  Upload Limits               P0
BE-051  API Documentation           P0
BE-052  Unit Test                   P0
BE-053  Integration Test            P0
BE-054  Authentication Test         P0
BE-055  Authorization Test          P0
BE-056  Report Test                 P0
BE-057  Claim Test                  P0
BE-058  Notification Test           P0
BE-059  Transaction Test            P0
BE-060  Database Test               P0
BE-061  API Error Test              P0
BE-062  Performance Test            P0
BE-063  SQLite Test                 P0
BE-064  Production Config           P0
BE-065  Final Checklist             P0
```
