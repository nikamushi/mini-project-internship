# TaskQA.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0  
**Status:** Final  
**Scope:** Quality Assurance & Testing

---

# 1. QA Objective

QA bertujuan memastikan sistem:

- Berfungsi sesuai PRD.
- Sesuai dengan UserFlow.
- Sesuai dengan Design.
- Sesuai dengan DesignSystem.
- Sesuai dengan API contract.
- Sesuai dengan Database schema.
- Aman digunakan.
- Tidak memiliki bug kritis.
- Memiliki behavior yang konsisten antara frontend dan backend.

QA harus memvalidasi:

```text
Functional
UI/UX
API
Database
Authentication
Authorization
Security
Validation
Error Handling
Responsive
Performance
Regression
```

---

# 2. QA Scope

## In Scope

```text
Authentication
User Management
Category Management
Lost Report
Found Report
Report Search
Report Filter
Report Detail
Report Status
Report Image Upload
Claim
Notification
Activity Log
Admin Dashboard
Authorization
SQLite Database
API
Frontend UI
Responsive Layout
Error Handling
```

## Out of Scope

Sesuai `PRD.md`:

```text
Android/iOS Application
Academic System Integration
AI Matching
Payment
Real-time Tracking
Shipping
```

---

# 3. QA Strategy

Testing dilakukan secara bertahap:

```text
Requirement Validation
        ↓
Unit Testing
        ↓
API Testing
        ↓
Database Testing
        ↓
Integration Testing
        ↓
Frontend Testing
        ↓
End-to-End Testing
        ↓
Security Testing
        ↓
Responsive Testing
        ↓
Performance Testing
        ↓
Regression Testing
        ↓
UAT
```

---

# 4. Test Priority

```text
P0 = Critical
P1 = High
P2 = Medium
P3 = Low
```

## P0

Jika gagal:

```text
Core system tidak dapat digunakan
Data corruption
Authentication failure
Authorization bypass
Critical security issue
Major workflow tidak berjalan
```

## P1

Jika gagal:

```text
Feature penting terganggu
Namun workaround masih tersedia
```

## P2

```text
Minor functionality issue
```

## P3

```text
Visual issue
Minor UX issue
Non-critical improvement
```

---

# 5. Test Environment

Minimum environment:

```text
OS:
Windows / macOS / Linux

Browser:
Chrome
Firefox
Edge

Backend:
Node.js
TypeScript

Database:
SQLite

ORM:
Prisma
```

Frontend harus diuji minimal pada:

```text
Desktop
Tablet
Mobile
```

---

# 6. Test Data

Gunakan data test yang terkontrol.

## Users

```text
Admin
User A
User B
Inactive User
```

## Categories

```text
Elektronik
Dokumen
Pakaian
Buku
Aksesori
Lainnya
```

## Reports

Minimal:

```text
LOST - Active
LOST - Pending
LOST - Rejected

FOUND - Active
FOUND - Claimed
FOUND - Completed
```

## Claims

```text
Pending
Approved
Rejected
Cancelled
```

---

# 7. QA-001 — Environment Setup

**Priority:** P0

## Tasks

- [ ] Install dependencies.
- [ ] Configure environment variables.
- [ ] Setup SQLite.
- [ ] Run Prisma migration.
- [ ] Run seed.
- [ ] Start backend.
- [ ] Start frontend.
- [ ] Verify application can access API.

## Expected

Application dapat berjalan tanpa:

```text
Build Error
Runtime Error
Database Error
Missing Environment Error
```

---

# 8. QA-002 — Database Migration

**Priority:** P0

## Test

Start dari SQLite database kosong.

```text
Empty Database
      ↓
Prisma Migration
      ↓
Complete Schema
```

## Verify

- [ ] users table exists.
- [ ] categories table exists.
- [ ] reports table exists.
- [ ] report_images table exists.
- [ ] claims table exists.
- [ ] notifications table exists.
- [ ] activity_logs table exists.
- [ ] Foreign keys exist.
- [ ] Indexes exist.

---

# 9. QA-003 — Database Seed

**Priority:** P0

## Test

Run:

```text
Seed
```

## Expected

Data berhasil dibuat:

```text
Admin
User
Categories
Sample Data
```

Run seed kembali.

## Expected

Tidak menghasilkan duplicate data.

---

# 10. QA-004 — Authentication: Login

**Priority:** P0

## Test Case

### Valid Login

Input:

```text
Valid Email
Valid Password
```

Expected:

```text
Login Success
User authenticated
Redirect to application
```

### Invalid Password

Expected:

```text
401 Unauthorized
```

### Unknown Email

Expected:

```text
401 Unauthorized
```

### Empty Email

Expected:

```text
Validation Error
```

### Empty Password

Expected:

```text
Validation Error
```

---

# 11. QA-005 — Inactive User Login

**Priority:** P0

User:

```text
is_active = false
```

Attempt login.

Expected:

```text
Login rejected
```

User tidak boleh mendapatkan authenticated session/token.

---

# 12. QA-006 — Logout

**Priority:** P0

## Test

```text
Login
   ↓
Logout
   ↓
Access Protected Page
```

Expected:

```text
Access Denied
```

Authentication harus invalid setelah logout sesuai mekanisme authentication yang digunakan.

---

# 13. QA-007 — Current User

**Priority:** P0

Endpoint:

```text
GET /api/auth/me
```

Expected:

```text
Authenticated user information
```

Tidak boleh return:

```text
password_hash
secret
internal credential
```

---

# 14. QA-008 — Authentication Protection

**Priority:** P0

Request protected endpoint tanpa authentication.

Contoh:

```text
GET /api/notifications
POST /api/reports
POST /api/reports/:id/claims
```

Expected:

```text
401 Unauthorized
```

---

# 15. QA-009 — Role Authorization

**Priority:** P0

Login sebagai:

```text
USER
```

Access:

```text
Admin Dashboard
User Management
Category Management
Report Verification
Claim Review
Activity Logs
```

Expected:

```text
403 Forbidden
```

---

# 16. QA-010 — Admin Authorization

**Priority:** P0

Login sebagai:

```text
ADMIN
```

Verify admin dapat mengakses:

```text
Dashboard
Reports Management
Claim Review
Category Management
User Management
Activity Logs
```

Expected:

```text
Access Granted
```

---

# 17. QA-011 — Category List

**Priority:** P0

User membuka category list.

Expected:

```text
Active categories displayed
```

Inactive categories:

```text
Tidak muncul pada form report baru
```

---

# 18. QA-012 — Create Category

**Priority:** P1

Admin membuat:

```text
Elektronik
```

Expected:

```text
Category Created
```

Duplicate:

```text
Elektronik
```

Expected:

```text
409 Conflict
```

atau validation error sesuai API contract.

---

# 19. QA-013 — Update Category

**Priority:** P1

Admin mengubah nama category.

Expected:

```text
Category Updated
```

User mencoba:

```text
PATCH /api/categories/:id
```

Expected:

```text
403 Forbidden
```

---

# 20. QA-014 — Deactivate Category

**Priority:** P1

Admin deactivate category.

Expected:

```text
is_active = false
```

Category:

```text
Tidak tersedia pada form report baru
```

Existing report dengan category tersebut:

```text
Tetap valid
```

---

# 21. QA-015 — Create Lost Report

**Priority:** P0

User membuat report:

```text
Type:
LOST

Item:
iPhone

Category:
Elektronik

Location:
Perpustakaan

Description:
iPhone warna hitam dengan casing transparan.

Occurred At:
Valid datetime
```

Expected:

```text
Report Created
Status = PENDING_VERIFICATION
```

---

# 22. QA-016 — Create Found Report

**Priority:** P0

User membuat:

```text
Type:
FOUND
```

Expected:

```text
Report Created
Status = PENDING_VERIFICATION
```

---

# 23. QA-017 — Required Report Fields

**Priority:** P0

Submit report tanpa:

```text
Item Name
Category
Description
Location
Occurred At
Type
```

Expected:

```text
Validation Error
```

Report tidak dibuat.

---

# 24. QA-018 — Invalid Report Type

**Priority:** P0

Send:

```text
type = SOMETHING
```

Expected:

```text
Validation Error
```

Allowed:

```text
LOST
FOUND
```

---

# 25. QA-019 — Invalid Category

**Priority:** P0

Submit report menggunakan:

```text
Invalid category ID
```

Expected:

```text
Report rejected
```

Tidak boleh membuat report dengan foreign key invalid.

---

# 26. QA-020 — Report Ownership

**Priority:** P0

User A membuat:

```text
Report A
```

User B mencoba:

```text
Update Report A
Delete Report A
```

Expected:

```text
Access Denied
```

User B tidak boleh memodifikasi Report A.

---

# 27. QA-021 — Admin Report Access

**Priority:** P0

Admin membuka report milik User A.

Expected:

```text
Access Granted
```

Admin dapat melakukan administrative operation sesuai permission.

---

# 28. QA-022 — Report List

**Priority:** P0

Open:

```text
Reports
```

Verify:

```text
Report list displayed
Pagination displayed
Status displayed
Category displayed
Type displayed
```

---

# 29. QA-023 — Report Pagination

**Priority:** P1

Test:

```text
page=1
page=2
page=3
```

Expected:

```text
Different data
No duplicate records
Correct metadata
```

---

# 30. QA-024 — Report Search

**Priority:** P0

Search:

```text
iPhone
```

Expected report yang relevan muncul.

Search harus dapat bekerja terhadap:

```text
itemName
description
location
```

---

# 31. QA-025 — Report Filter

**Priority:** P0

Test filter:

```text
Type = LOST
Type = FOUND

Category = Elektronik

Status = ACTIVE

Location = Perpustakaan
```

Expected:

```text
Only matching reports displayed
```

---

# 32. QA-026 — Combined Filter

**Priority:** P1

Test:

```text
Type = LOST
Category = Elektronik
Status = ACTIVE
```

Expected:

```text
All conditions applied
```

---

# 33. QA-027 — Report Detail

**Priority:** P0

Open report detail.

Expected:

```text
Item Name
Category
Type
Description
Location
Occurred At
Status
Images
Reporter
Created At
```

Tidak boleh menampilkan:

```text
password_hash
private credential
internal database information
```

---

# 34. QA-028 — Update Report

**Priority:** P0

Owner update:

```text
Description
Location
```

Expected:

```text
Update Success
```

Activity log dibuat.

---

# 35. QA-029 — Delete Report

**Priority:** P0

Owner delete report.

Expected:

```text
Report no longer appears in normal report list
```

Database:

```text
deleted_at != NULL
```

Data tidak langsung dihapus secara physical delete.

---

# 36. QA-030 — Deleted Report Access

**Priority:** P1

User mencoba membuka deleted report.

Expected sesuai business rule:

```text
Not Found
```

atau:

```text
Access Restricted
```

---

# 37. QA-031 — Report Verification

**Priority:** P0

Admin approve report.

Flow:

```text
PENDING_VERIFICATION
        ↓
ACTIVE
```

Expected:

```text
Status updated
Notification created
Activity log created
```

---

# 38. QA-032 — Report Rejection

**Priority:** P0

Admin reject report.

Flow:

```text
PENDING_VERIFICATION
        ↓
REJECTED
```

Expected:

```text
Status updated
Notification created
Activity log created
```

---

# 39. QA-033 — Invalid Status Transition

**Priority:** P0

Attempt:

```text
COMPLETED
   ↓
PENDING_VERIFICATION
```

Expected:

```text
Request rejected
```

Tidak boleh terjadi invalid state.

---

# 40. QA-034 — Image Upload

**Priority:** P0

Upload:

```text
JPEG
PNG
WebP
```

Expected:

```text
Upload Success
Image reference saved
Image displayed
```

---

# 41. QA-035 — Invalid Image Upload

**Priority:** P0

Upload:

```text
.exe
.sh
.php
.js
```

Expected:

```text
Upload Rejected
```

---

# 42. QA-036 — Image Size Limit

**Priority:** P1

Upload image melebihi configured limit.

Expected:

```text
413 Payload Too Large
```

atau response sesuai API contract.

---

# 43. QA-037 — Multiple Images

**Priority:** P1

Upload beberapa image dalam satu report.

Expected:

```text
All valid images uploaded
```

Jumlah tidak boleh melebihi configured maximum.

---

# 44. QA-038 — Failed Upload Cleanup

**Priority:** P1

Simulasikan:

```text
File Upload Success
Database Insert Failed
```

Expected:

```text
Uploaded file cleaned up
```

Tidak ada orphan file.

---

# 45. QA-039 — Create Claim

**Priority:** P0

User membuka:

```text
FOUND
ACTIVE
```

report.

Create claim.

Expected:

```text
Claim Created
Status = PENDING
```

---

# 46. QA-040 — Claim Lost Report

**Priority:** P0

Attempt claim terhadap:

```text
LOST
```

report.

Expected:

```text
Rejected
```

---

# 47. QA-041 — Claim Inactive Report

**Priority:** P0

Attempt claim terhadap report:

```text
REJECTED
COMPLETED
CANCELLED
```

Expected:

```text
Rejected
```

---

# 48. QA-042 — Self Claim

**Priority:** P0

User A membuat:

```text
FOUND Report
```

User A mencoba claim report tersebut.

Expected:

```text
Claim Rejected
```

---

# 49. QA-043 — Duplicate Claim

**Priority:** P0

User A:

```text
Create Claim
```

Kemudian membuat claim kedua pada report yang sama.

Expected:

```text
Second claim rejected
```

Tidak boleh ada duplicate active claim.

---

# 50. QA-044 — Claim Ownership

**Priority:** P0

User A memiliki Claim A.

User B mencoba mengubah atau melihat data private Claim A.

Expected:

```text
Access Denied
```

sesuai authorization rule.

---

# 51. QA-045 — Claim List

**Priority:** P0

User:

```text
GET /api/claims
```

Expected:

```text
Own claims only
```

Admin:

```text
GET /api/claims
```

Expected:

```text
All claims
```

sesuai API contract.

---

# 52. QA-046 — Approve Claim

**Priority:** P0

Admin approve pending claim.

Expected transaction:

```text
Claim
    ↓
APPROVED

Report
    ↓
CLAIMED

Notification
    ↓
Created

Activity Log
    ↓
Created
```

Semua operasi berhasil atau semuanya rollback.

---

# 53. QA-047 — Reject Claim

**Priority:** P0

Admin reject claim.

Expected:

```text
Claim = REJECTED
Review reason = saved
Notification = created
Activity log = created
```

---

# 54. QA-048 — Claim Transaction Rollback

**Priority:** P0

Simulasikan error saat:

```text
Approve Claim
```

setelah claim update tetapi sebelum notification/activity log.

Expected:

```text
Claim rollback
Report rollback
Notification rollback
Activity log rollback
```

Tidak boleh ada partial state.

---

# 55. QA-049 — Notification Creation

**Priority:** P0

Trigger:

```text
Report Approved
Report Rejected
Claim Approved
Claim Rejected
```

Expected:

```text
Notification created
```

---

# 56. QA-050 — Notification Ownership

**Priority:** P0

User A memiliki Notification A.

User B mencoba:

```text
Read Notification A
```

Expected:

```text
Access Denied
```

---

# 57. QA-051 — Mark Notification Read

**Priority:** P1

User membuka notification.

Expected:

```text
is_read = true
```

UI:

```text
Unread indicator disappears
```

---

# 58. QA-052 — Mark All Notification Read

**Priority:** P1

User memiliki beberapa unread notifications.

Execute:

```text
Mark All as Read
```

Expected:

```text
All notifications = read
```

---

# 59. QA-053 — Activity Log

**Priority:** P0

Perform:

```text
Create Report
Update Report
Delete Report
Approve Report
Create Claim
Approve Claim
Reject Claim
```

Expected:

```text
Activity log created
```

---

# 60. QA-054 — Activity Log Immutability

**Priority:** P1

User mencoba modify activity log.

Expected:

```text
Access Denied
```

Admin hanya dapat membaca log.

---

# 61. QA-055 — Dashboard

**Priority:** P1

Admin membuka dashboard.

Expected summary:

```text
Total Reports
Pending Reports
Active Reports
Found Reports
Completed Reports
Pending Claims
Total Users
```

Data harus konsisten dengan database.

---

# 62. QA-056 — Dashboard Data Accuracy

Bandingkan:

```text
Dashboard Count
```

dengan:

```text
SQLite Database
```

Expected:

```text
Counts Match
```

---

# 63. QA-057 — User Management

**Priority:** P1

Admin:

```text
View Users
Activate User
Deactivate User
```

Expected:

```text
User status updated
```

---

# 64. QA-058 — Deactivate User

**Priority:** P0

Admin deactivate User A.

Expected:

```text
User cannot login
```

Existing historical data:

```text
Reports
Claims
Activity Logs
```

tetap memiliki referensi user.

---

# 65. QA-059 — API Validation

**Priority:** P0

Test invalid:

```text
Missing field
Wrong data type
Invalid enum
Invalid ID
Invalid date
Too long text
Empty string
Malformed request
```

Expected:

```text
Consistent validation response
```

---

# 66. QA-060 — API Error Handling

**Priority:** P0

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

Expected response mengikuti standard:

```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

---

# 67. QA-061 — SQL Injection

**Priority:** P0

Test search/filter input:

```text
' OR 1=1 --
```

Expected:

```text
No SQL injection
```

Prisma query harus tetap parameterized.

---

# 68. QA-062 — XSS

**Priority:** P0

Input:

```html
<script>
  alert("xss");
</script>
```

pada:

```text
Item Name
Description
Location
Claim Reason
```

Expected:

```text
Script tidak dieksekusi
```

Frontend harus melakukan safe rendering.

---

# 69. QA-063 — Authentication Brute Force

**Priority:** P1

Kirim login request berulang.

Expected:

```text
Rate limit
```

atau mekanisme protection sesuai konfigurasi.

---

# 70. QA-064 — Unauthorized API Access

**Priority:** P0

Manipulate:

```text
userId
reportId
claimId
```

dari request.

Expected:

```text
Server tetap menggunakan authenticated identity
```

User tidak dapat mengakses resource milik user lain.

---

# 71. QA-065 — Sensitive Data Exposure

**Priority:** P0

Inspect:

```text
API response
Browser Network
Logs
```

Pastikan tidak ada:

```text
password_hash
JWT secret
database credentials
environment variables
internal secrets
```

---

# 72. QA-066 — File Access Security

**Priority:** P1

Attempt access terhadap:

```text
database.sqlite
.env
package files
server source
```

Expected:

```text
Not publicly accessible
```

---

# 73. QA-067 — SQLite Foreign Key

**Priority:** P0

Attempt create:

```text
Report with invalid user_id
Report with invalid category_id
Claim with invalid report_id
Claim with invalid claimant_id
```

Expected:

```text
Operation rejected
```

---

# 74. QA-068 — SQLite Unique Constraint

**Priority:** P0

Test duplicate:

```text
User email
Category name
```

Expected:

```text
Duplicate rejected
```

---

# 75. QA-069 — SQLite Transaction

**Priority:** P0

Test transaction failure.

Expected:

```text
Atomic rollback
```

No partial records.

---

# 76. QA-070 — Soft Delete

**Priority:** P0

Delete report.

Verify SQLite:

```text
reports.deleted_at IS NOT NULL
```

Expected:

```text
Record still exists
```

Normal queries harus mengabaikan deleted records.

---

# 77. QA-071 — Prisma Migration Reproducibility

**Priority:** P0

Delete local database.

Run:

```text
Prisma Migration
```

Expected:

```text
Database reconstructed successfully
```

Tidak boleh membutuhkan manual SQL.

---

# 78. QA-072 — Frontend Form Validation

**Priority:** P0

Test report form.

Verify:

```text
Required fields
Error message
Input length
Category
Type
Image
Date
```

Frontend validation harus memberikan feedback sebelum request dikirim.

---

# 79. QA-073 — Frontend API Error State

**Priority:** P0

Simulate:

```text
400
401
403
404
500
```

Frontend harus:

```text
Show understandable error
Not crash
Not display raw server error
```

---

# 80. QA-074 — Loading State

**Priority:** P1

Test:

```text
Report List
Report Detail
Create Report
Claim
Dashboard
Notifications
```

Expected:

```text
Loading indicator
```

Tidak boleh terlihat seperti aplikasi freeze.

---

# 81. QA-075 — Empty State

**Priority:** P1

Test:

```text
No reports
No claims
No notifications
No search result
No activity logs
```

Expected:

```text
Informative empty state
```

---

# 82. QA-076 — Responsive Testing

**Priority:** P0

Test viewport:

```text
Mobile
Tablet
Desktop
```

Minimal:

```text
320px
375px
768px
1024px
1440px
```

Verify:

```text
No horizontal overflow
No clipped content
Navigation usable
Forms usable
Buttons accessible
Tables usable
Cards responsive
```

---

# 83. QA-077 — Mobile Report Form

**Priority:** P0

Test create report pada mobile.

Verify:

```text
Input readable
Keyboard tidak menutupi input penting
Upload image usable
Submit button accessible
Error message visible
```

---

# 84. QA-078 — Desktop Admin Dashboard

**Priority:** P1

Verify:

```text
Sidebar
Dashboard cards
Tables
Filters
Actions
Modal
Pagination
```

Tidak ada overlap atau clipping.

---

# 85. QA-079 — Design Consistency

**Priority:** P1

Compare implementation dengan:

```text
Design.md
DesignSystem.md
```

Verify:

```text
Typography
Spacing
Buttons
Inputs
Cards
Tables
Colors
States
Navigation
Modal
Toast
```

---

# 86. QA-080 — Design System Compliance

**Priority:** P1

Verify tidak ada komponen yang menggunakan style arbitrary tanpa alasan.

Contoh:

```text
Random colors
Random font sizes
Random spacing
Random button styles
```

Implementasi harus menggunakan DesignSystem.

---

# 87. QA-081 — Accessibility

**Priority:** P1

Test:

```text
Keyboard Navigation
Focus State
Form Label
Button Label
Image Alt
Contrast
Modal Focus
```

Minimum:

```text
Tab
Shift + Tab
Enter
Escape
```

harus bekerja pada interactive element penting.

---

# 88. QA-082 — Keyboard Navigation

**Priority:** P1

User dapat menggunakan:

```text
Tab
Shift + Tab
Enter
Escape
```

untuk:

```text
Navigation
Forms
Buttons
Modal
Dropdown
```

---

# 89. QA-083 — Form Accessibility

Semua input harus memiliki:

```text
Label
Error State
Accessible Name
```

Error harus jelas.

Contoh:

```text
Deskripsi wajib diisi.
```

bukan hanya:

```text
Invalid
```

---

# 90. QA-084 — Network Failure

Simulasikan:

```text
Backend Offline
Slow Network
Request Timeout
```

Expected:

```text
Frontend tidak crash
Error state muncul
User dapat retry
```

---

# 91. QA-085 — Duplicate Request

User klik:

```text
Submit
```

berulang kali.

Expected:

```text
Tidak membuat duplicate report
```

atau frontend melakukan submit protection.

Test juga:

```text
Duplicate claim
```

Backend tetap menjadi protection utama.

---

# 92. QA-086 — Double Claim Approval

Admin membuka claim yang sama pada dua tab.

Admin approve secara bersamaan.

Expected:

```text
Only one valid approval
No inconsistent report status
```

---

# 93. QA-087 — Concurrent Update

Simulasikan:

```text
User update report
Admin update report
```

secara bersamaan.

Expected:

```text
No database corruption
```

Business rule harus menentukan final state.

---

# 94. QA-088 — Performance: Report List

Dataset test:

```text
1,000 reports
```

Test:

```text
Search
Filter
Pagination
Sorting
```

Expected:

```text
Response remains acceptable
```

Tidak boleh melakukan full dataset rendering pada frontend.

---

# 95. QA-089 — Performance: Dashboard

Dashboard query harus:

```text
Use aggregate query
Avoid fetching all reports
```

Verify melalui query profiling/logging jika diperlukan.

---

# 96. QA-090 — Performance: Notification

User dengan banyak notification.

Test:

```text
100
1,000
```

notifications.

Expected:

```text
Pagination
No browser freeze
```

---

# 97. QA-091 — API Response Performance

Test endpoint utama:

```text
GET /api/reports
GET /api/reports/:id
GET /api/notifications
GET /api/claims
GET /api/admin/dashboard
```

Verify:

```text
No unnecessary payload
Pagination applied
Relations loaded efficiently
```

---

# 98. QA-092 — Regression Test

Setiap perubahan backend/frontend harus menjalankan regression terhadap:

```text
Authentication
Reports
Claims
Notifications
Admin
Authorization
```

Minimal semua P0 test case harus dijalankan kembali.

---

# 99. QA-093 — Cross Browser Test

Minimal:

```text
Chrome
Firefox
Edge
```

Test:

```text
Login
Report
Claim
Dashboard
Upload
Responsive
```

---

# 100. QA-094 — Browser Refresh

Test refresh pada:

```text
Dashboard
Report List
Report Detail
Claim
Notifications
```

Expected:

```text
State restored correctly
No application crash
Authentication remains consistent
```

---

# 101. QA-095 — Browser Back/Forward

Test:

```text
List
 ↓
Detail
 ↓
Back
```

Expected:

```text
User returns to previous state
```

Tidak boleh terjadi unexpected logout atau broken state.

---

# 102. QA-096 — Session Expiration

Simulasikan session/token expired.

Expected:

```text
Protected API → 401
Frontend → redirect/re-authentication
```

Tidak boleh menampilkan protected data setelah authentication expired.

---

# 103. QA-097 — Error Recovery

Jika request gagal:

```text
Retry
```

harus dapat dilakukan tanpa reload penuh jika memungkinkan.

Contoh:

```text
Report list failed
      ↓
Retry
      ↓
Report loaded
```

---

# 104. QA-098 — Data Consistency

Setelah setiap workflow utama:

```text
Create Report
Approve Report
Create Claim
Approve Claim
Reject Claim
Delete Report
```

periksa:

```text
Database
API
Frontend
Notification
Activity Log
```

Semua harus konsisten.

---

# 105. QA-099 — End-to-End Lost Item Flow

**Priority:** P0

Flow:

```text
User Login
    ↓
Create LOST Report
    ↓
Report Pending Verification
    ↓
Admin Login
    ↓
Review Report
    ↓
Approve
    ↓
Report ACTIVE
    ↓
User sees updated status
    ↓
Notification received
```

Expected:

```text
Complete Success
```

---

# 106. QA-100 — End-to-End Found Item Flow

**Priority:** P0

Flow:

```text
User A Login
    ↓
Create FOUND Report
    ↓
Admin Approve
    ↓
Report ACTIVE
    ↓
User B Login
    ↓
View FOUND Report
    ↓
Create Claim
    ↓
Admin Review
    ↓
Approve Claim
    ↓
Claim APPROVED
    ↓
Report CLAIMED
    ↓
Notification
```

Expected:

```text
Complete Success
```

---

# 107. QA-101 — End-to-End Rejection Flow

## Report

```text
Create Report
    ↓
Admin Reject
    ↓
Report REJECTED
    ↓
Notification
```

## Claim

```text
Create Claim
    ↓
Admin Reject
    ↓
Claim REJECTED
    ↓
Review Reason
    ↓
Notification
```

Expected:

```text
All states consistent
```

---

# 108. QA-102 — End-to-End User Flow

Validasi berdasarkan `UserFlow.md`.

## User

```text
Login
 ↓
Dashboard/Home
 ↓
View Reports
 ↓
Search
 ↓
Filter
 ↓
View Detail
 ↓
Create Report
 ↓
View My Reports
 ↓
View Notifications
 ↓
Create Claim
```

## Admin

```text
Login
 ↓
Dashboard
 ↓
Reports
 ↓
Verify Report
 ↓
Claims
 ↓
Review Claim
 ↓
Users
 ↓
Categories
 ↓
Activity Logs
```

---

# 109. QA-103 — API Contract Testing

Semua endpoint harus dibandingkan dengan `API.md`.

Verify:

```text
Method
URL
Authentication
Request Body
Query Parameter
Response
HTTP Status
Error Response
```

Tidak boleh ada mismatch antara:

```text
API.md
Backend
Frontend
```

---

# 110. QA-104 — Database Contract Testing

Bandingkan implementation dengan `Database.md`.

Verify:

```text
Table
Column
Type
Relation
Index
Constraint
Status
Default
Soft Delete
```

Tidak boleh ada mismatch.

---

# 111. QA-105 — Architecture Compliance

Bandingkan implementasi dengan `Architecture.md`.

Verify:

```text
Controller
Service
Repository
Prisma
SQLite
Middleware
Storage
```

Business logic tidak boleh berpindah ke frontend tanpa alasan.

---

# 112. QA-106 — PRD Compliance

Bandingkan implementation dengan `PRD.md`.

Verify semua:

```text
Problem
Solution
Core Feature
Future Improvement
Out of Scope
```

Tidak ada feature out-of-scope yang dibuat sebagai core requirement tanpa approval.

---

# 113. QA-107 — Bug Classification

Setiap bug dikategorikan:

```text
BLOCKER
CRITICAL
MAJOR
MINOR
TRIVIAL
```

## BLOCKER

Tidak dapat melanjutkan testing.

Contoh:

```text
Application tidak dapat start.
Database tidak dapat connect.
Login tidak bekerja sama sekali.
```

## CRITICAL

Core feature rusak.

Contoh:

```text
User dapat mengakses report milik user lain.
Claim approval merusak database.
```

## MAJOR

Feature penting tidak bekerja.

## MINOR

Masalah kecil.

## TRIVIAL

Visual atau typo.

---

# 114. QA-108 — Bug Report Format

Setiap bug harus memiliki:

```text
Bug ID
Title
Severity
Priority
Environment
Precondition
Steps to Reproduce
Expected Result
Actual Result
Evidence
Status
```

Contoh:

```text
BUG-001

Title:
User dapat mengubah report milik user lain.

Severity:
CRITICAL

Priority:
P0

Environment:
Development

Precondition:
User A memiliki Report A.
User B sudah login.

Steps:
1. Login sebagai User B.
2. Request PATCH Report A.
3. Observe response.

Expected:
403 Forbidden.

Actual:
200 OK.

Status:
Open
```

---

# 115. QA-109 — Bug Lifecycle

Lifecycle:

```text
Open
  ↓
Assigned
  ↓
In Progress
  ↓
Fixed
  ↓
Ready for QA
  ↓
Verified
  ↓
Closed
```

Jika masih terjadi:

```text
Ready for QA
      ↓
Reopened
```

---

# 116. QA-110 — Regression Gate

Sebelum merge/release:

```text
P0 Test = 100% PASS
```

Tidak boleh ada:

```text
Open Blocker
Open Critical
```

Untuk P1:

```text
Target ≥ 95% PASS
```

Pengecualian harus disetujui sebelum release.

---

# 117. QA-111 — Release Checklist

## Functional

- [ ] Authentication works.
- [ ] Authorization works.
- [ ] Report works.
- [ ] Search works.
- [ ] Filter works.
- [ ] Image upload works.
- [ ] Claim works.
- [ ] Notification works.
- [ ] Admin works.

## Database

- [ ] SQLite migration works.
- [ ] Prisma works.
- [ ] Foreign keys work.
- [ ] Unique constraints work.
- [ ] Transaction works.
- [ ] Soft delete works.

## Security

- [ ] Password hashing.
- [ ] Auth protection.
- [ ] Role protection.
- [ ] Ownership protection.
- [ ] XSS protection.
- [ ] SQL injection protection.
- [ ] Upload validation.
- [ ] Rate limiting.
- [ ] CORS.
- [ ] Sensitive data protection.

## UI

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Success state.
- [ ] Accessibility.

## Documentation

- [ ] API.md matches implementation.
- [ ] Database.md matches implementation.
- [ ] Architecture.md matches implementation.
- [ ] UserFlow.md matches implementation.

---

# 118. QA-112 — Final Acceptance Criteria

Sistem dapat dianggap QA PASS apabila:

```text
All P0 tests PASS
```

dan:

```text
No Blocker
No Critical
```

serta seluruh core workflow berjalan:

```text
Login
 ↓
Create Report
 ↓
Admin Verification
 ↓
Report Active
 ↓
Search / Filter
 ↓
View Detail
 ↓
Create Claim
 ↓
Admin Review
 ↓
Claim Approved / Rejected
 ↓
Notification
 ↓
Activity Log
```

---

# 119. Final QA Matrix

| Area                | Priority | Required |
| ------------------- | -------: | -------: |
| Authentication      |       P0 |      Yes |
| Authorization       |       P0 |      Yes |
| User Management     |       P1 |      Yes |
| Category            |       P0 |      Yes |
| Lost Report         |       P0 |      Yes |
| Found Report        |       P0 |      Yes |
| Search              |       P0 |      Yes |
| Filter              |       P0 |      Yes |
| Pagination          |       P1 |      Yes |
| Image Upload        |       P0 |      Yes |
| Report Verification |       P0 |      Yes |
| Claim               |       P0 |      Yes |
| Notification        |       P0 |      Yes |
| Activity Log        |       P0 |      Yes |
| Dashboard           |       P1 |      Yes |
| SQLite              |       P0 |      Yes |
| Prisma              |       P0 |      Yes |
| API                 |       P0 |      Yes |
| Security            |       P0 |      Yes |
| Responsive          |       P0 |      Yes |
| Accessibility       |       P1 |      Yes |
| Performance         |       P1 |      Yes |
| Regression          |       P0 |      Yes |
| UAT                 |       P0 |      Yes |

---

# 120. Final QA Task Summary

```text
QA-001   Environment Setup
QA-002   Database Migration
QA-003   Database Seed
QA-004   Authentication Login
QA-005   Inactive User
QA-006   Logout
QA-007   Current User
QA-008   Authentication Protection
QA-009   Role Authorization
QA-010   Admin Authorization
QA-011   Category List
QA-012   Create Category
QA-013   Update Category
QA-014   Deactivate Category
QA-015   Create Lost Report
QA-016   Create Found Report
QA-017   Required Report Fields
QA-018   Invalid Report Type
QA-019   Invalid Category
QA-020   Report Ownership
QA-021   Admin Report Access
QA-022   Report List
QA-023   Pagination
QA-024   Search
QA-025   Filter
QA-026   Combined Filter
QA-027   Report Detail
QA-028   Update Report
QA-029   Delete Report
QA-030   Deleted Report
QA-031   Report Verification
QA-032   Report Rejection
QA-033   Status Transition
QA-034   Image Upload
QA-035   Invalid Image
QA-036   Image Size
QA-037   Multiple Images
QA-038   Upload Cleanup
QA-039   Create Claim
QA-040   Claim Lost Report
QA-041   Claim Inactive Report
QA-042   Self Claim
QA-043   Duplicate Claim
QA-044   Claim Ownership
QA-045   Claim List
QA-046   Approve Claim
QA-047   Reject Claim
QA-048   Claim Transaction
QA-049   Notification Creation
QA-050   Notification Ownership
QA-051   Mark Notification Read
QA-052   Mark All Read
QA-053   Activity Log
QA-054   Activity Log Immutability
QA-055   Dashboard
QA-056   Dashboard Accuracy
QA-057   User Management
QA-058   Deactivate User
QA-059   API Validation
QA-060   API Error Handling
QA-061   SQL Injection
QA-062   XSS
QA-063   Brute Force
QA-064   Unauthorized API
QA-065   Sensitive Data
QA-066   File Access Security
QA-067   Foreign Key
QA-068   Unique Constraint
QA-069   Transaction
QA-070   Soft Delete
QA-071   Migration Reproducibility
QA-072   Frontend Validation
QA-073   API Error State
QA-074   Loading State
QA-075   Empty State
QA-076   Responsive
QA-077   Mobile Form
QA-078   Admin Dashboard UI
QA-079   Design Consistency
QA-080   Design System
QA-081   Accessibility
QA-082   Keyboard Navigation
QA-083   Form Accessibility
QA-084   Network Failure
QA-085   Duplicate Request
QA-086   Double Claim Approval
QA-087   Concurrent Update
QA-088   Report Performance
QA-089   Dashboard Performance
QA-090   Notification Performance
QA-091   API Performance
QA-092   Regression
QA-093   Cross Browser
QA-094   Browser Refresh
QA-095   Browser Back/Forward
QA-096   Session Expiration
QA-097   Error Recovery
QA-098   Data Consistency
QA-099   Lost Item E2E
QA-100   Found Item E2E
QA-101   Rejection E2E
QA-102   User Flow E2E
QA-103   API Contract
QA-104   Database Contract
QA-105   Architecture Compliance
QA-106   PRD Compliance
QA-107   Bug Classification
QA-108   Bug Report
QA-109   Bug Lifecycle
QA-110   Regression Gate
QA-111   Release Checklist
QA-112   Final Acceptance
```

---

# 121. Definition of Done

QA dianggap selesai apabila:

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

sudah konsisten.

Dan:

```text
P0 Test Cases = 100% PASS
Blocker = 0
Critical = 0
```

Core workflow:

```text
Authentication
      ↓
Report
      ↓
Verification
      ↓
Search / Filter
      ↓
Claim
      ↓
Review
      ↓
Notification
      ↓
Activity Log
```

harus berhasil end-to-end.

---

# 122. Final QA Status

```text
TaskQA.md
    ↓
FINAL
    ↓
READY FOR TEST EXECUTION
```
