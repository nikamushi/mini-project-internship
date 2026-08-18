# API.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0  
**Status:** Final  
**API Style:** REST API  
**Base URL:** `/api`  
**Authentication:** Session-based Authentication  
**Database:** PostgreSQL  
**ORM:** Prisma  
**Reference:** `PRD.md` + `Design.md` + `DesignSystem.md` + `Architecture.md` + `Database.md`

---

# 1. API Overview

API merupakan communication layer antara frontend dengan backend.

```text
Frontend
   │
   ▼
REST API
   │
   ├── Authentication
   ├── Reports
   ├── Claims
   ├── Categories
   ├── Notifications
   └── Admin
   │
   ▼
Service Layer
   │
   ▼
Repository
   │
   ▼
PostgreSQL
```

API bertanggung jawab terhadap:

- Authentication.
- Authorization.
- Input validation.
- Business logic orchestration.
- Data retrieval.
- Data mutation.
- File upload coordination.
- Notification creation.
- Activity logging.

---

# 2. API Principles

API harus mengikuti prinsip:

- RESTful.
- JSON-based.
- Stateless request handling kecuali authentication session.
- Server-side authorization.
- Request validation.
- Consistent response format.
- Consistent error format.
- Pagination untuk list.
- Transaction untuk multi-step mutation.
- Tidak mengembalikan sensitive data.
- Tidak mengekspos database structure secara langsung.

---

# 3. Base URL

Development:

```text
/api
```

Production:

```text
/api
```

Endpoint contoh:

```text
GET /api/reports
```

---

# 4. Content Type

Request JSON:

```http
Content-Type: application/json
```

Response:

```http
Content-Type: application/json
```

File upload menggunakan:

```http
multipart/form-data
```

---

# 5. Authentication

Authentication menggunakan session-based authentication.

Flow:

```text
Login
  ↓
Create Session
  ↓
Set Secure Cookie
  ↓
Authenticated Request
  ↓
Read Session
  ↓
Identify User
```

Session cookie harus:

```text
HttpOnly
Secure
SameSite
```

Production menggunakan HTTPS.

---

# 6. Authentication Context

Setiap authenticated request memiliki:

```text
user.id
user.role
```

Contoh:

```json
{
  "id": "user_uuid",
  "role": "USER"
}
```

Authentication context tidak boleh berasal dari request body.

---

# 7. Roles

Role tersedia:

```text
USER
ADMIN
```

Permission ditentukan berdasarkan role.

---

# 8. Permission Matrix

| Resource            | USER | ADMIN |
| ------------------- | ---: | ----: |
| Register            |   ✅ |    ✅ |
| Login               |   ✅ |    ✅ |
| View Public Reports |   ✅ |    ✅ |
| Create Report       |   ✅ |    ✅ |
| Edit Own Report     |   ✅ |    ✅ |
| Delete Own Report   |   ✅ |    ✅ |
| Create Claim        |   ✅ |    ✅ |
| View Own Claims     |   ✅ |    ✅ |
| View Categories     |   ✅ |    ✅ |
| Manage Categories   |   ❌ |    ✅ |
| Verify Report       |   ❌ |    ✅ |
| Manage All Reports  |   ❌ |    ✅ |
| Review Claim        |   ❌ |    ✅ |
| View All Claims     |   ❌ |    ✅ |
| View Notifications  |   ✅ |    ✅ |
| View Activity Logs  |   ❌ |    ✅ |
| Manage Users        |   ❌ |    ✅ |

---

# 9. Response Format

Success response:

```json
{
  "success": true,
  "data": {}
}
```

List response:

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

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data.",
    "details": {}
  }
}
```

---

# 10. HTTP Status Codes

Gunakan status code berikut:

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 401    | Unauthenticated       |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 422    | Validation Error      |
| 429    | Too Many Requests     |
| 500    | Internal Server Error |

---

# 11. Error Codes

Standard error codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
INVALID_CREDENTIALS
EMAIL_ALREADY_EXISTS
REPORT_NOT_FOUND
REPORT_NOT_EDITABLE
REPORT_NOT_CLAIMABLE
CLAIM_NOT_FOUND
CLAIM_ALREADY_EXISTS
CLAIM_NOT_REVIEWABLE
CATEGORY_NOT_FOUND
CATEGORY_IN_USE
SESSION_EXPIRED
FILE_TOO_LARGE
INVALID_FILE_TYPE
INTERNAL_ERROR
```

---

# 12. Validation

Validation harus dilakukan pada API boundary.

Gunakan schema validation.

Contoh:

```text
Request
 ↓
Schema Validation
 ↓
Authentication
 ↓
Authorization
 ↓
Service
```

Jangan langsung meneruskan request body ke database.

---

# 13. Pagination

List endpoint menggunakan pagination.

Query:

```text
?page=1&limit=20
```

Default:

```text
page = 1
limit = 20
```

Maximum:

```text
limit = 100
```

---

# 14. Sorting

List endpoint dapat mendukung:

```text
?sortBy=createdAt
&sortOrder=desc
```

Default report:

```text
sortBy=createdAt
sortOrder=desc
```

---

# 15. Authentication API

Endpoint:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

# 16. Register

```http
POST /api/auth/register
```

Public endpoint.

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
}
```

Validation:

```text
name:
Required
2-100 characters

email:
Required
Valid email
Unique

password:
Required
Minimum 8 characters
```

Success:

```http
201 Created
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

Password tidak pernah dikembalikan.

---

# 17. Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password"
}
```

Success:

```http
200 OK
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

Server membuat session dan mengirim secure cookie.

---

# 18. Login Failure

Jika credentials salah:

```http
401 Unauthorized
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email atau password tidak valid."
  }
}
```

Jangan membedakan apakah email terdaftar atau tidak pada error authentication.

---

# 19. Logout

```http
POST /api/auth/logout
```

Authentication required.

Server:

```text
Invalidate current session
Clear cookie
```

Response:

```http
204 No Content
```

---

# 20. Current User

```http
GET /api/auth/me
```

Authentication required.

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

---

# 21. Category API

Endpoint:

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

---

# 22. Get Categories

```http
GET /api/categories
```

Authenticated users dapat melihat kategori aktif.

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Elektronik",
      "description": "Perangkat elektronik"
    }
  ]
}
```

---

# 23. Create Category

```http
POST /api/categories
```

Role:

```text
ADMIN
```

Request:

```json
{
  "name": "Elektronik",
  "description": "Perangkat elektronik"
}
```

Success:

```http
201 Created
```

---

# 24. Update Category

```http
PATCH /api/categories/:id
```

Role:

```text
ADMIN
```

Request:

```json
{
  "name": "Elektronik",
  "description": "Perangkat elektronik dan aksesoris"
}
```

---

# 25. Delete Category

```http
DELETE /api/categories/:id
```

Role:

```text
ADMIN
```

Jika category masih digunakan:

```http
409 Conflict
```

Recommended behavior:

```text
Deactivate category
```

daripada physical delete.

---

# 26. Report API

Core endpoints:

```text
GET    /api/reports
POST   /api/reports
GET    /api/reports/:id
PATCH  /api/reports/:id
DELETE /api/reports/:id
```

Admin:

```text
PATCH /api/admin/reports/:id/status
```

---

# 27. Get Reports

```http
GET /api/reports
```

Authenticated user.

Query:

```text
?page=1
&limit=20
&type=LOST
&categoryId=uuid
&status=ACTIVE
&search=dompet
&location=perpustakaan
&sortBy=createdAt
&sortOrder=desc
```

---

# 28. Report Filters

Supported:

```text
type
categoryId
status
search
location
```

Type:

```text
LOST
FOUND
```

Status:

```text
ACTIVE
FOUND
CLAIMED
COMPLETED
```

Public listing tidak menampilkan:

```text
PENDING_VERIFICATION
REJECTED
CANCELLED
```

kecuali endpoint/admin permission mengizinkan.

---

# 29. Report List Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "LOST",
      "title": "Dompet kulit hitam",
      "description": "Dompet kulit warna hitam",
      "category": {
        "id": "uuid",
        "name": "Dompet"
      },
      "location": "Perpustakaan",
      "eventAt": "2026-08-18T07:00:00Z",
      "status": "ACTIVE",
      "image": {
        "url": "https://storage.example/image.jpg"
      },
      "createdAt": "2026-08-18T08:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

# 30. Search Reports

Search:

```http
GET /api/reports?search=dompet
```

Search target:

```text
title
description
location
```

Search tidak boleh melakukan raw SQL concatenation.

---

# 31. Create Report

```http
POST /api/reports
```

Authentication required.

Request:

```json
{
  "type": "LOST",
  "categoryId": "uuid",
  "title": "Dompet kulit hitam",
  "description": "Dompet kulit warna hitam dengan logo kecil.",
  "location": "Perpustakaan Kampus",
  "eventAt": "2026-08-18T07:00:00Z"
}
```

---

# 32. Create Report Validation

Required:

```text
type
categoryId
title
description
location
eventAt
```

Rules:

```text
title:
2-150 characters

description:
Minimum 10 characters

location:
2-255 characters

eventAt:
Valid datetime
```

---

# 33. Create Report Result

Status awal:

```text
PENDING_VERIFICATION
```

Response:

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "LOST",
    "status": "PENDING_VERIFICATION"
  }
}
```

System membuat activity log:

```text
REPORT_CREATED
```

---

# 34. Report Image Upload

Image upload dapat dilakukan melalui endpoint:

```http
POST /api/reports/:id/images
```

Authentication required.

Content type:

```text
multipart/form-data
```

Field:

```text
file
```

---

# 35. Image Validation

Allowed:

```text
image/jpeg
image/png
image/webp
```

Maximum:

```text
5 MB / image
```

Recommended maximum:

```text
5 images / report
```

File harus:

```text
validated
renamed
stored securely
```

---

# 36. Image Upload Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://storage.example/report-image.webp",
    "sortOrder": 0
  }
}
```

Database menyimpan:

```text
storage_key
url
sort_order
```

---

# 37. Delete Report Image

```http
DELETE /api/reports/:reportId/images/:imageId
```

Permission:

```text
Report Owner
ADMIN
```

Image tidak boleh dihapus jika report sudah:

```text
COMPLETED
```

kecuali admin.

---

# 38. Get Report Detail

```http
GET /api/reports/:id
```

Authenticated user.

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "LOST",
    "title": "Dompet kulit hitam",
    "description": "Dompet kulit warna hitam.",
    "category": {
      "id": "uuid",
      "name": "Dompet"
    },
    "location": "Perpustakaan",
    "eventAt": "2026-08-18T07:00:00Z",
    "status": "ACTIVE",
    "images": [],
    "reporter": {
      "id": "uuid",
      "name": "John Doe"
    },
    "createdAt": "2026-08-18T08:00:00Z"
  }
}
```

---

# 39. Edit Report

```http
PATCH /api/reports/:id
```

Permission:

```text
Report Owner
ADMIN
```

User hanya dapat mengedit report miliknya sendiri.

---

# 40. Editable Report Status

User dapat mengedit report ketika:

```text
PENDING_VERIFICATION
ACTIVE
```

Tidak dapat mengedit ketika:

```text
COMPLETED
```

Admin memiliki permission lebih tinggi sesuai workflow.

---

# 41. Update Report Request

Partial update:

```json
{
  "title": "Dompet kulit hitam",
  "description": "Deskripsi diperbarui",
  "location": "Gedung A",
  "eventAt": "2026-08-18T08:00:00Z"
}
```

---

# 42. Delete Report

```http
DELETE /api/reports/:id
```

Permission:

```text
Report Owner
ADMIN
```

User hanya dapat menghapus report miliknya.

Delete menggunakan:

```text
Soft Delete
```

---

# 43. Admin Report API

Admin endpoint:

```text
GET   /api/admin/reports
GET   /api/admin/reports/:id
PATCH /api/admin/reports/:id/status
DELETE /api/admin/reports/:id
```

---

# 44. Admin Get Reports

```http
GET /api/admin/reports
```

Filter:

```text
type
status
categoryId
reporterId
search
dateFrom
dateTo
```

Admin dapat melihat seluruh report termasuk:

```text
PENDING_VERIFICATION
REJECTED
CANCELLED
```

---

# 45. Admin Update Report Status

```http
PATCH /api/admin/reports/:id/status
```

Request:

```json
{
  "status": "ACTIVE",
  "adminNote": "Laporan telah diverifikasi."
}
```

---

# 46. Report Status Transition

Valid transition:

```text
PENDING_VERIFICATION
        │
        ├──→ ACTIVE
        │
        └──→ REJECTED
```

```text
ACTIVE
  │
  ├──→ FOUND
  ├──→ CANCELLED
  └──→ COMPLETED
```

```text
FOUND
  │
  ├──→ CLAIMED
  └──→ COMPLETED
```

```text
CLAIMED
  │
  └──→ COMPLETED
```

---

# 47. Invalid Status Transition

Contoh:

```text
COMPLETED → ACTIVE
```

Tidak diperbolehkan.

Response:

```http
409 Conflict
```

---

# 48. Claim API

Endpoint:

```text
GET  /api/reports/:reportId/claims
POST /api/reports/:reportId/claims

GET  /api/claims
GET  /api/claims/:id
PATCH /api/claims/:id/cancel
```

Admin:

```text
GET   /api/admin/claims
GET   /api/admin/claims/:id
PATCH /api/admin/claims/:id/status
```

---

# 49. Claim Eligibility

User dapat membuat claim jika:

```text
Report type = FOUND
```

dan status:

```text
ACTIVE
```

User tidak boleh claim report miliknya sendiri.

---

# 50. Create Claim

```http
POST /api/reports/:reportId/claims
```

Request:

```json
{
  "description": "Saya kehilangan dompet ini dan ada kartu identitas saya di dalamnya.",
  "evidence": "Terdapat tanda khusus di bagian dalam dompet."
}
```

---

# 51. Claim Validation

Required:

```text
description
```

Optional:

```text
evidence
```

Rules:

```text
description:
Minimum 10 characters
```

---

# 52. Claim Response

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reportId": "uuid",
    "status": "PENDING",
    "createdAt": "2026-08-18T08:00:00Z"
  }
}
```

System:

```text
Create Claim
Create Activity Log
Create Notification
```

Notification:

```text
CLAIM_SUBMITTED
```

---

# 53. Get My Claims

```http
GET /api/claims
```

User hanya melihat claim miliknya.

Query:

```text
?page=1
&limit=20
&status=PENDING
```

---

# 54. Get Claim Detail

```http
GET /api/claims/:id
```

User hanya dapat melihat:

```text
claim miliknya
```

Admin dapat melihat seluruh claim.

---

# 55. Cancel Claim

```http
PATCH /api/claims/:id/cancel
```

User dapat membatalkan claim:

```text
PENDING
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CANCELLED"
  }
}
```

---

# 56. Admin Get Claims

```http
GET /api/admin/claims
```

Filter:

```text
status
reportId
claimantId
dateFrom
dateTo
```

---

# 57. Admin Review Claim

```http
PATCH /api/admin/claims/:id/status
```

Request approve:

```json
{
  "status": "APPROVED"
}
```

Request reject:

```json
{
  "status": "REJECTED",
  "reason": "Bukti kepemilikan tidak mencukupi."
}
```

---

# 58. Claim Approval Transaction

Ketika admin approve:

```text
BEGIN

1. Validate claim
2. Validate report
3. Update claim → APPROVED
4. Set reviewed_by
5. Set reviewed_at
6. Update report → CLAIMED
7. Create activity log
8. Create notification

COMMIT
```

---

# 59. Claim Rejection Transaction

```text
BEGIN

1. Update claim → REJECTED
2. Set reviewed_by
3. Set reviewed_at
4. Create activity log
5. Create notification

COMMIT
```

Report tetap:

```text
ACTIVE
```

atau status yang sesuai workflow.

---

# 60. Notification API

Endpoint:

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

---

# 61. Get Notifications

```http
GET /api/notifications
```

Query:

```text
?page=1
&limit=20
&unread=true
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "CLAIM_APPROVED",
      "title": "Klaim disetujui",
      "message": "Klaim Anda telah disetujui.",
      "referenceType": "CLAIM",
      "referenceId": "uuid",
      "readAt": null,
      "createdAt": "2026-08-18T08:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

# 62. Mark Notification Read

```http
PATCH /api/notifications/:id/read
```

User hanya dapat mengubah notification miliknya.

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "readAt": "2026-08-18T08:10:00Z"
  }
}
```

---

# 63. Mark All Notifications Read

```http
PATCH /api/notifications/read-all
```

Response:

```http
204 No Content
```

---

# 64. Admin Dashboard API

```http
GET /api/admin/dashboard
```

Role:

```text
ADMIN
```

Response:

```json
{
  "success": true,
  "data": {
    "reports": {
      "total": 100,
      "pendingVerification": 10,
      "active": 70,
      "completed": 20
    },
    "lostReports": 60,
    "foundReports": 40,
    "pendingClaims": 5
  }
}
```

---

# 65. Dashboard Data Source

Dashboard metrics dihitung dari:

```text
reports
claims
```

Tidak menggunakan analytics table pada MVP.

---

# 66. Admin User API

Endpoint:

```text
GET   /api/admin/users
GET   /api/admin/users/:id
PATCH /api/admin/users/:id/status
```

---

# 67. Get Users

```http
GET /api/admin/users
```

Filter:

```text
search
role
isActive
```

Response tidak boleh mengembalikan:

```text
password_hash
session token
```

---

# 68. Update User Status

```http
PATCH /api/admin/users/:id/status
```

Request:

```json
{
  "isActive": false
}
```

Admin tidak boleh menonaktifkan dirinya sendiri melalui endpoint ini.

---

# 69. Activity Log API

Activity logs hanya dapat diakses admin.

```http
GET /api/admin/activity-logs
```

Query:

```text
?page=1
&limit=20
&entityType=REPORT
&action=REPORT_VERIFIED
&actorId=uuid
&dateFrom=2026-08-01
&dateTo=2026-08-18
```

---

# 70. Activity Log Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "actor": {
        "id": "uuid",
        "name": "Admin"
      },
      "entityType": "REPORT",
      "entityId": "uuid",
      "action": "REPORT_VERIFIED",
      "metadata": {
        "oldStatus": "PENDING_VERIFICATION",
        "newStatus": "ACTIVE"
      },
      "createdAt": "2026-08-18T08:00:00Z"
    }
  ]
}
```

---

# 71. API Route Structure

Recommended:

```text
/api
│
├── auth
│   ├── register
│   ├── login
│   ├── logout
│   └── me
│
├── categories
│   └── ...
│
├── reports
│   ├── ...
│   └── :id
│       └── images
│
├── claims
│   └── ...
│
├── notifications
│   └── ...
│
└── admin
    ├── dashboard
    ├── users
    ├── reports
    ├── claims
    ├── categories
    └── activity-logs
```

---

# 72. API Layer Architecture

```text
Route / Controller
        │
        ▼
Request Validation
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
Prisma
        │
        ▼
PostgreSQL
```

---

# 73. Controller Responsibility

Controller hanya menangani:

```text
Request
Response
Status Code
Validation Binding
```

Controller tidak boleh berisi business logic kompleks.

---

# 74. Service Responsibility

Service menangani:

```text
Business Logic
Validation Business Rule
Transaction
Workflow
Notification Trigger
Activity Log Trigger
```

Contoh:

```text
ReportService
ClaimService
AuthService
CategoryService
NotificationService
```

---

# 75. Repository Responsibility

Repository menangani:

```text
Database Query
Create
Read
Update
Delete
Filtering
Pagination
```

Repository tidak menentukan business workflow.

---

# 76. Authentication Middleware

Protected endpoint:

```text
RequireAuth
```

Flow:

```text
Request
 ↓
Read Session Cookie
 ↓
Find Session
 ↓
Validate Expiration
 ↓
Load User
 ↓
Attach User Context
```

Jika gagal:

```text
401 Unauthorized
```

---

# 77. Authorization Middleware

Role check:

```text
RequireRole("ADMIN")
```

Jika user:

```text
USER
```

mencoba admin endpoint:

```text
403 Forbidden
```

---

# 78. Ownership Authorization

Untuk resource user-owned:

```text
requireOwnership(report.userId, currentUser.id)
```

Admin bypass ownership check.

---

# 79. Rate Limiting

Rate limiting minimal diterapkan pada:

```text
POST /api/auth/login
POST /api/auth/register
POST /api/reports
POST /api/reports/:id/claims
```

Tujuan:

- Prevent brute force.
- Prevent spam.
- Protect API.

---

# 80. File Upload Security

Upload harus:

```text
Validate MIME type
Validate file size
Generate safe filename
Prevent executable upload
Store outside application server
```

File name dari user tidak boleh digunakan langsung sebagai storage path.

---

# 81. API Security

API wajib:

- Validate all input.
- Authenticate protected endpoints.
- Authorize resource access.
- Prevent SQL injection.
- Prevent mass assignment.
- Sanitize user-generated content where rendered.
- Never expose password hash.
- Never expose session token.
- Never expose private admin notes to normal users.

---

# 82. Mass Assignment Protection

Jangan:

```text
updateReport(req.body)
```

secara langsung.

Gunakan whitelist:

```text
title
description
location
eventAt
```

Field berikut tidak boleh diubah user:

```text
status
reporterId
adminNote
createdAt
```

---

# 83. Report API DTO

Create:

```text
CreateReportInput
```

Fields:

```text
type
categoryId
title
description
location
eventAt
```

Update:

```text
UpdateReportInput
```

Fields:

```text
title?
description?
location?
eventAt?
```

Admin:

```text
UpdateReportStatusInput
```

Fields:

```text
status
adminNote?
```

---

# 84. Claim API DTO

Create:

```text
CreateClaimInput
```

Fields:

```text
description
evidence?
```

Admin review:

```text
ReviewClaimInput
```

Fields:

```text
status
reason?
```

---

# 85. Category API DTO

Create:

```text
CreateCategoryInput
```

Fields:

```text
name
description?
```

Update:

```text
UpdateCategoryInput
```

Fields:

```text
name?
description?
isActive?
```

---

# 86. Date Format

API menggunakan ISO 8601.

Example:

```text
2026-08-18T07:00:00Z
```

Frontend tidak boleh mengirim format lokal yang ambigu.

---

# 87. ID Format

Semua entity ID menggunakan UUID.

Contoh:

```text
550e8400-e29b-41d4-a716-446655440000
```

API tidak menggunakan auto-increment integer sebagai public identifier.

---

# 88. API Error Example

Validation:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid.",
    "details": {
      "title": "Judul wajib diisi.",
      "eventAt": "Waktu tidak valid."
    }
  }
}
```

---

# 89. Not Found Example

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Data tidak ditemukan."
  }
}
```

Jangan mengungkapkan informasi sensitif tentang keberadaan resource yang tidak boleh diakses user.

---

# 90. Forbidden Example

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Anda tidak memiliki akses untuk melakukan tindakan ini."
  }
}
```

---

# 91. Conflict Example

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Data bertentangan dengan kondisi saat ini."
  }
}
```

Contoh:

```text
User sudah memiliki claim aktif
untuk report tersebut.
```

---

# 92. API Logging

Server harus mencatat minimal:

```text
Request ID
HTTP method
Endpoint
Status code
Response time
Authenticated user ID
Error code
```

Jangan mencatat:

```text
Password
Session token
Sensitive claim evidence
```

---

# 93. Request ID

Setiap request sebaiknya memiliki:

```text
X-Request-ID
```

Contoh:

```text
X-Request-ID: 8f4b1e2a...
```

Digunakan untuk debugging dan tracing.

---

# 94. API Versioning

MVP:

```text
/api
```

Versioning belum wajib.

Jika breaking changes diperlukan, gunakan:

```text
/api/v2
```

Jangan mengubah contract existing secara breaking tanpa versioning atau migration strategy.

---

# 95. CORS

Jika frontend dan backend berada pada origin berbeda, hanya origin yang dipercaya yang boleh diizinkan.

Production:

```text
Allow specific frontend origin
```

Jangan menggunakan:

```text
Access-Control-Allow-Origin: *
```

untuk authenticated API.

---

# 96. Cache

Public/read-heavy data yang relatif stabil dapat di-cache.

Contoh:

```text
Categories
```

Namun untuk MVP, caching belum wajib.

Jangan cache response yang berisi:

```text
Private user data
Admin data
Claim evidence
```

tanpa strategy yang aman.

---

# 97. API Testing

Setiap endpoint minimal memiliki:

```text
Happy path
Validation failure
Unauthorized
Forbidden
Not found
Conflict
```

Endpoint critical juga harus memiliki test transaction.

---

# 98. Critical API Test Cases

## Authentication

```text
Register success
Register duplicate email
Login success
Login invalid credential
Logout
Expired session
```

## Reports

```text
Create report
Create invalid report
Get reports
Search report
Filter report
Update own report
Update other user's report
Delete own report
Admin verify report
Admin reject report
```

## Claims

```text
Create claim
Claim own found report
Duplicate claim
Cancel claim
Admin approve claim
Admin reject claim
```

## Authorization

```text
User access admin endpoint
User access another user's claim
User access another user's report modification
```

---

# 99. API Workflow

## Lost Report

```text
POST /api/reports
        │
        ▼
PENDING_VERIFICATION
        │
        ▼
Admin Verification
        │
        ▼
ACTIVE
```

---

# 100. Found Report

```text
POST /api/reports
        │
        ▼
PENDING_VERIFICATION
        │
        ▼
Admin Verification
        │
        ▼
ACTIVE
        │
        ▼
User Creates Claim
        │
        ▼
PENDING
        │
        ▼
Admin Review
        │
        ├── REJECTED
        │
        └── APPROVED
                │
                ▼
             CLAIMED
                │
                ▼
            COMPLETED
```

---

# 101. Notification Workflow

Example:

```text
Admin verifies report
        │
        ├── Update Report
        ├── Activity Log
        └── Notification
                │
                ▼
        REPORT_VERIFIED
```

Claim:

```text
User creates claim
        │
        ├── Create Claim
        ├── Activity Log
        └── Notification
                │
                ▼
        CLAIM_SUBMITTED
```

---

# 102. API to Database Mapping

| API Domain      | Database               |
| --------------- | ---------------------- |
| Authentication  | users, sessions        |
| Categories      | categories             |
| Reports         | reports, report_images |
| Claims          | claims                 |
| Notifications   | notifications          |
| Audit           | activity_logs          |
| Admin Dashboard | reports, claims        |
| User Management | users                  |

---

# 103. API to Frontend Mapping

## Public/User

```text
Login
Register
Dashboard
Report List
Report Detail
Create Report
Edit Report
My Reports
Claim
My Claims
Notifications
Profile
```

---

## Admin

```text
Dashboard
Report Management
Report Verification
Claim Management
Category Management
User Management
Activity Logs
```

---

# 104. API Contract Rules for Frontend

Frontend harus:

- Menggunakan response DTO.
- Tidak bergantung pada database schema.
- Tidak mengasumsikan field yang tidak ada pada API contract.
- Menangani loading state.
- Menangani empty state.
- Menangani error state.
- Menangani pagination.
- Menangani unauthorized response.
- Menangani forbidden response.

---

# 105. API Contract Rules for Backend

Backend harus:

- Mengikuti endpoint yang didefinisikan.
- Mengikuti HTTP status code.
- Mengikuti request schema.
- Mengikuti response schema.
- Melakukan validation.
- Melakukan authorization.
- Menjalankan business logic di service layer.
- Menggunakan transaction ketika diperlukan.
- Membuat activity log untuk perubahan penting.
- Membuat notification untuk event yang relevan.

---

# 106. MVP Endpoint Summary

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Categories

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

## Reports

```text
GET    /api/reports
POST   /api/reports
GET    /api/reports/:id
PATCH  /api/reports/:id
DELETE /api/reports/:id

POST   /api/reports/:id/images
DELETE /api/reports/:reportId/images/:imageId
```

## Claims

```text
GET   /api/claims
GET   /api/claims/:id
POST  /api/reports/:reportId/claims
PATCH /api/claims/:id/cancel
```

## Notifications

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

## Admin

```text
GET   /api/admin/dashboard

GET   /api/admin/users
GET   /api/admin/users/:id
PATCH /api/admin/users/:id/status

GET   /api/admin/reports
GET   /api/admin/reports/:id
PATCH /api/admin/reports/:id/status
DELETE /api/admin/reports/:id

GET   /api/admin/claims
GET   /api/admin/claims/:id
PATCH /api/admin/claims/:id/status

GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id

GET /api/admin/activity-logs
```

---

# 107. Out of Scope API

MVP tidak menyediakan endpoint untuk:

```text
AI Matching API
Payment API
Delivery API
Real-time Location Tracking
Mobile Push Notification
Campus Academic System Integration
Campus SSO
External Marketplace
```

---

# 108. Future API

Future dapat menambahkan:

```text
POST /api/matching/search
GET  /api/reports/:id/matches

POST /api/push-tokens
DELETE /api/push-tokens/:id

GET /api/analytics
```

Endpoint tersebut tidak boleh diimplementasikan sebagai bagian dari MVP kecuali requirement berubah.

---

# 109. Final API Contract

Core API:

```text
Authentication
      ↓
Reports
      ↓
Claims
      ↓
Notifications
      ↓
Admin Management
```

Technical flow:

```text
Request
   ↓
Middleware
   ↓
Validation
   ↓
Authorization
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

---

# 110. Final Status

**API Design: FINAL**

API ini menjadi sumber referensi utama untuk:

- Frontend integration.
- Backend implementation.
- Controller.
- Service.
- Repository.
- API validation.
- Authentication.
- Authorization.
- API testing.
- Antigravity coding.
