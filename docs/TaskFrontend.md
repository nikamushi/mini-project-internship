# TaskFrontend.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.0  
**Status:** Final  
**Scope:** Frontend Web  
**Reference:**

- `PRD.md`
- `Design.md`
- `DesignSystem.md`
- `Architecture.md`
- `Database.md`
- `API.md`
- `UserFlow.md`

---

# 1. Tujuan

Dokumen ini berisi task implementasi frontend untuk Sistem Manajemen Laporan Kehilangan Barang Kampus.

Frontend bertanggung jawab terhadap:

- UI/UX.
- Routing.
- Authentication state.
- Authorization UI.
- Form.
- Validation client-side.
- Report browsing.
- Report creation.
- Report management.
- Claim management.
- Notification.
- Admin interface.
- Loading state.
- Error state.
- Empty state.
- Responsive layout.
- API integration.

Frontend **tidak menjadi sumber utama business rule dan authorization**.

Backend tetap menjadi source of truth.

---

# 2. Prinsip Implementasi

## 2.1 Source of Truth

Implementasi frontend harus mengikuti urutan:

```text
PRD
 ↓
Design
 ↓
DesignSystem
 ↓
Architecture
 ↓
Database
 ↓
API
 ↓
UserFlow
 ↓
TaskFrontend
```

Jangan membuat fitur yang tidak didefinisikan dalam dokumen di atas tanpa memperbarui requirement terlebih dahulu.

---

# 3. Definition of Done

Task frontend dianggap selesai apabila:

- UI sesuai `Design.md`.
- Komponen mengikuti `DesignSystem.md`.
- Flow sesuai `UserFlow.md`.
- API mengikuti `API.md`.
- Responsive.
- Loading state tersedia.
- Empty state tersedia.
- Error state tersedia.
- Validation tersedia.
- Authorization UI diterapkan.
- Tidak terdapat hardcoded mock data pada production flow.
- Tidak terdapat TypeScript error.
- Tidak terdapat console error.
- Tidak terdapat broken navigation.
- Tidak terdapat duplicate component yang seharusnya reusable.
- Semua critical flow dapat digunakan dari awal sampai selesai.

---

# 4. Phase 0 — Project Setup

## FE-001 — Setup Frontend Project

**Priority:** P0  
**Status:** TODO

### Task

Siapkan struktur dasar aplikasi frontend sesuai `Architecture.md`.

### Checklist

- [ ] Inisialisasi project frontend.
- [ ] Setup framework.
- [ ] Setup TypeScript.
- [ ] Setup package manager.
- [ ] Setup environment variables.
- [ ] Setup linting.
- [ ] Setup formatting.
- [ ] Setup build.
- [ ] Setup development server.
- [ ] Setup folder structure.

### Acceptance Criteria

```text
npm run dev
```

dapat menjalankan aplikasi.

```text
npm run build
```

berhasil tanpa error.

---

# 5. Phase 1 — Design System

## FE-002 — Setup Design Tokens

**Priority:** P0  
**Status:** TODO

Implementasikan token dari `DesignSystem.md`.

### Checklist

- [ ] Color tokens.
- [ ] Typography.
- [ ] Spacing.
- [ ] Border radius.
- [ ] Shadows.
- [ ] Breakpoints.
- [ ] Component sizing.
- [ ] Transition.

---

## FE-003 — Setup Global Styles

**Priority:** P0  
**Status:** TODO

### Checklist

- [ ] CSS reset.
- [ ] Base typography.
- [ ] Body styles.
- [ ] Link styles.
- [ ] Form styles.
- [ ] Focus state.
- [ ] Disabled state.
- [ ] Selection state.

---

# 6. Phase 2 — Shared Components

## FE-004 — Layout Components

**Priority:** P0  
**Status:** TODO

Buat reusable layout:

```text
AppLayout
AuthLayout
DashboardLayout
AdminLayout
Header
Sidebar
MobileNavigation
Footer
```

### Acceptance Criteria

Layout dapat digunakan oleh lebih dari satu halaman.

---

## FE-005 — Button Components

**Priority:** P0  
**Status:** TODO

Implementasikan:

```text
Primary
Secondary
Outline
Ghost
Danger
Icon Button
Loading Button
```

States:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

---

## FE-006 — Form Components

**Priority:** P0  
**Status:** TODO

Implementasikan:

```text
Input
Textarea
Select
SearchInput
DateInput
FileUpload
Checkbox
Radio
FormField
FormError
```

---

## FE-007 — Feedback Components

**Priority:** P0  
**Status:** TODO

Implementasikan:

```text
Toast
Alert
Modal
ConfirmDialog
Loading
Skeleton
EmptyState
ErrorState
```

---

## FE-008 — Data Display Components

**Priority:** P0  
**Status:** TODO

Implementasikan:

```text
Card
Badge
StatusBadge
Avatar
Table
Pagination
Dropdown
Tabs
```

---

# 7. Phase 3 — API Foundation

## FE-009 — API Client

**Priority:** P0  
**Status:** TODO

Buat centralized API client.

### Requirements

- [ ] Base URL dari environment.
- [ ] Request interceptor jika diperlukan.
- [ ] Authentication handling.
- [ ] Response handling.
- [ ] Error normalization.
- [ ] Timeout handling.
- [ ] 401 handling.
- [ ] 403 handling.
- [ ] 422 handling.
- [ ] 500 handling.

---

## FE-010 — API Types

**Priority:** P0  
**Status:** TODO

Buat type/interface berdasarkan `API.md`.

Minimal:

```text
User
Category
Report
ReportImage
Claim
Notification
ActivityLog
Pagination
ApiResponse
ApiError
```

---

## FE-011 — API Service Layer

**Priority:** P0  
**Status:** TODO

Buat service:

```text
authService
reportService
claimService
categoryService
notificationService
adminService
userService
activityLogService
```

Frontend page/component tidak melakukan request API secara langsung jika architecture menggunakan service/data layer.

---

# 8. Phase 4 — Authentication

## FE-012 — Authentication State

**Priority:** P0  
**Status:** TODO

Implementasikan:

```text
isAuthenticated
currentUser
role
loading
session
```

---

## FE-013 — Login Page

**Priority:** P0  
**Status:** TODO

Route:

```text
/login
```

### Components

```text
Email Input
Password Input
Login Button
Validation Error
General Error
```

### Flow

```text
Login
 ↓
API
 ↓
Success
 ↓
Check Role
 ↓
Dashboard
```

---

## FE-014 — Register Page

**Priority:** P0  
**Status:** TODO

Route:

```text
/register
```

### Fields

```text
Name
Email
Password
Password Confirmation
```

### Flow

```text
Register
 ↓
Validate
 ↓
API
 ↓
Success
 ↓
Login
```

---

## FE-015 — Logout

**Priority:** P0  
**Status:** TODO

Implement:

```text
Logout Button
 ↓
Logout API
 ↓
Clear Auth State
 ↓
Redirect /login
```

---

## FE-016 — Route Guards

**Priority:** P0  
**Status:** TODO

Implement:

```text
ProtectedRoute
AdminRoute
GuestRoute
```

### Rules

```text
Unauthenticated
→ /login

Authenticated USER
→ User routes

Authenticated ADMIN
→ Admin routes

USER → Admin route
→ Forbidden
```

---

# 9. Phase 5 — Public/User Shell

## FE-017 — User Dashboard

**Priority:** P0  
**Status:** TODO

Route:

```text
/dashboard
```

Display:

```text
Welcome
Report Summary
Recent Reports
Recent Found Items
Notification Summary
Quick Actions
```

Quick actions:

```text
Laporkan Barang Hilang
Laporkan Barang Ditemukan
Lihat Barang Hilang
Lihat Barang Ditemukan
```

---

# 10. Phase 6 — Report Browsing

## FE-018 — Report List Page

**Priority:** P0  
**Status:** TODO

Route:

```text
/reports
```

### Features

- [ ] Report cards/list.
- [ ] Search.
- [ ] Filter.
- [ ] Sort.
- [ ] Pagination.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.

---

## FE-019 — Report Search

**Priority:** P0  
**Status:** TODO

Search:

```text
Nama barang
Deskripsi
Lokasi
```

Implement debounce jika diperlukan.

---

## FE-020 — Report Filter

**Priority:** P0  
**Status:** TODO

Filter:

```text
Type
Category
Status
Location
```

---

## FE-021 — Report Detail

**Priority:** P0  
**Status:** TODO

Route:

```text
/reports/:id
```

Display:

```text
Image
Name
Category
Type
Description
Location
Date/Time
Reporter
Status
```

Action berdasarkan permission:

```text
Owner
→ Edit
→ Delete

Non-owner
→ View

Found + Active
→ Claim
```

---

# 11. Phase 7 — Create Report

## FE-022 — Report Type Selection

**Priority:** P0  
**Status:** TODO

UI:

```text
Barang Hilang
Barang Ditemukan
```

---

## FE-023 — Lost Report Form

**Priority:** P0  
**Status:** TODO

Route:

```text
/reports/create?type=lost
```

Fields:

```text
Category
Item Name
Description
Location
Date/Time
Image
```

---

## FE-024 — Found Report Form

**Priority:** P0  
**Status:** TODO

Route:

```text
/reports/create?type=found
```

Fields:

```text
Category
Item Name
Description
Location
Date/Time
Image
```

---

## FE-025 — Report Validation

**Priority:** P0  
**Status:** TODO

Required:

```text
Type
Category
Name
Description
Location
Date/Time
```

Optional:

```text
Image
```

Validation error harus ditampilkan dekat field.

---

## FE-026 — Report Review Step

**Priority:** P1  
**Status:** TODO

Sebelum submit:

```text
Form
 ↓
Review
 ↓
Edit / Submit
```

User dapat kembali ke form tanpa kehilangan data.

---

## FE-027 — Report Submission

**Priority:** P0  
**Status:** TODO

Flow:

```text
Submit
 ↓
Loading
 ↓
Success
 ↓
Report Detail
```

Success message:

```text
Laporan berhasil dibuat dan sedang menunggu verifikasi admin.
```

---

# 12. Phase 8 — My Reports

## FE-028 — My Reports Page

**Priority:** P0  
**Status:** TODO

Route:

```text
/my-reports
```

Tabs/filter:

```text
Semua
Hilang
Ditemukan
```

Status:

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

## FE-029 — Edit Report

**Priority:** P0  
**Status:** TODO

Route:

```text
/reports/:id/edit
```

Rules:

```text
Owner only
```

Flow:

```text
Edit
 ↓
Validate
 ↓
Submit
 ↓
Success
 ↓
Detail
```

---

## FE-030 — Delete Report

**Priority:** P0  
**Status:** TODO

Flow:

```text
Delete
 ↓
Confirm Dialog
 ↓
Delete API
 ↓
Success
 ↓
My Reports
```

Tidak menggunakan destructive hard delete pada frontend assumption.

---

# 13. Phase 9 — Claim

## FE-031 — Claim Button

**Priority:** P0  
**Status:** TODO

Tampilkan hanya jika:

```text
Report Type = FOUND
AND
Report Status = ACTIVE
AND
Current User != Reporter
```

---

## FE-032 — Claim Form

**Priority:** P0  
**Status:** TODO

Route:

```text
/reports/:id/claim
```

Fields:

```text
Reason
Supporting Information
Evidence jika tersedia
```

---

## FE-033 — Claim Submission

**Priority:** P0  
**Status:** TODO

Flow:

```text
Submit
 ↓
Loading
 ↓
Success
 ↓
Claim Detail
```

---

## FE-034 — My Claims

**Priority:** P0  
**Status:** TODO

Route:

```text
/my-claims
```

Display:

```text
Pending
Approved
Rejected
Cancelled
```

---

## FE-035 — Claim Detail

**Priority:** P0  
**Status:** TODO

Display:

```text
Report
Claim Status
Claim Information
Admin Decision
Decision Reason
Created Date
Updated Date
```

---

## FE-036 — Cancel Claim

**Priority:** P1  
**Status:** TODO

Available:

```text
Claim status = PENDING
```

Flow:

```text
Cancel
 ↓
Confirm
 ↓
API
 ↓
CANCELLED
```

---

# 14. Phase 10 — Notifications

## FE-037 — Notification Center

**Priority:** P1  
**Status:** TODO

Route:

```text
/notifications
```

Display:

```text
Unread
Read
```

---

## FE-038 — Notification Badge

**Priority:** P1  
**Status:** TODO

Header menampilkan:

```text
Notification Icon
Unread Count
```

---

## FE-039 — Mark Notification Read

**Priority:** P1  
**Status:** TODO

Flow:

```text
Open Notification
 ↓
Mark Read
 ↓
Update UI
```

---

# 15. Phase 11 — Profile

## FE-040 — Profile Page

**Priority:** P1  
**Status:** TODO

Route:

```text
/profile
```

Display:

```text
Name
Email
Role
Account Status
```

Jika profile editing termasuk MVP sesuai `PRD.md`, implementasikan form edit.

Jika tidak, halaman bersifat read-only.

---

# 16. Phase 12 — Admin Shell

## FE-041 — Admin Layout

**Priority:** P0  
**Status:** TODO

Route prefix:

```text
/admin/*
```

Navigation:

```text
Dashboard
Laporan
Klaim
Kategori
Pengguna
Activity Log
```

---

## FE-042 — Admin Dashboard

**Priority:** P0  
**Status:** TODO

Route:

```text
/admin
```

Metrics:

```text
Total Laporan
Pending Verification
Active Reports
Completed Reports
Pending Claims
```

---

# 17. Phase 13 — Admin Reports

## FE-043 — Admin Report List

**Priority:** P0  
**Status:** TODO

Route:

```text
/admin/reports
```

Features:

```text
Search
Filter
Sort
Pagination
Status
```

---

## FE-044 — Admin Report Detail

**Priority:** P0  
**Status:** TODO

Route:

```text
/admin/reports/:id
```

Display seluruh informasi report.

Admin actions:

```text
Approve
Reject
Change Status
```

---

## FE-045 — Approve Report

**Priority:** P0  
**Status:** TODO

Flow:

```text
Approve
 ↓
Confirm
 ↓
API
 ↓
ACTIVE
 ↓
Refresh
```

---

## FE-046 — Reject Report

**Priority:** P0  
**Status:** TODO

Flow:

```text
Reject
 ↓
Reason Form
 ↓
Confirm
 ↓
API
 ↓
REJECTED
 ↓
Refresh
```

Reason wajib diisi jika API mewajibkannya.

---

# 18. Phase 14 — Admin Claims

## FE-047 — Admin Claim List

**Priority:** P0  
**Status:** TODO

Route:

```text
/admin/claims
```

Features:

```text
Search
Filter
Status
Pagination
```

---

## FE-048 — Admin Claim Detail

**Priority:** P0  
**Status:** TODO

Route:

```text
/admin/claims/:id
```

Display:

```text
Claim Information
Reporter
Claimant
Report
Evidence
Status
```

---

## FE-049 — Approve Claim

**Priority:** P0  
**Status:** TODO

Flow:

```text
Approve
 ↓
Confirmation
 ↓
API
 ↓
APPROVED
 ↓
Report → CLAIMED
```

---

## FE-050 — Reject Claim

**Priority:** P0  
**Status:** TODO

Flow:

```text
Reject
 ↓
Reason
 ↓
Confirm
 ↓
API
 ↓
REJECTED
```

---

# 19. Phase 15 — Category Management

## FE-051 — Category List

**Priority:** P0  
**Status:** TODO

Route:

```text
/admin/categories
```

Display:

```text
Name
Status
Created Date
Actions
```

---

## FE-052 — Add Category

**Priority:** P0  
**Status:** TODO

Flow:

```text
Add
 ↓
Form
 ↓
Submit
 ↓
Success
 ↓
List
```

---

## FE-053 — Edit Category

**Priority:** P1  
**Status:** TODO

Flow:

```text
Edit
 ↓
Form
 ↓
Submit
 ↓
Success
```

---

## FE-054 — Deactivate Category

**Priority:** P1  
**Status:** TODO

Flow:

```text
Deactivate
 ↓
Confirm
 ↓
API
 ↓
Inactive
```

---

# 20. Phase 16 — User Management

## FE-055 — User List

**Priority:** P1  
**Status:** TODO

Route:

```text
/admin/users
```

Features:

```text
Search
Filter Role
Filter Status
Pagination
```

---

## FE-056 — User Detail

**Priority:** P1  
**Status:** TODO

Display:

```text
Name
Email
Role
Status
Created Date
```

---

## FE-057 — Deactivate User

**Priority:** P1  
**Status:** TODO

Flow:

```text
Deactivate
 ↓
Confirm
 ↓
API
 ↓
Inactive
```

---

# 21. Phase 17 — Activity Log

## FE-058 — Activity Log

**Priority:** P1  
**Status:** TODO

Route:

```text
/admin/activity-logs
```

Display:

```text
Actor
Action
Entity
Entity ID
Timestamp
```

Features:

```text
Filter
Search
Pagination
```

Read-only.

---

# 22. Phase 18 — Loading State

## FE-059 — Page Loading

**Priority:** P0  
**Status:** TODO

Setiap page API-driven harus memiliki loading state.

Gunakan:

```text
Skeleton
```

atau:

```text
Loading Indicator
```

---

## FE-060 — Action Loading

**Priority:** P0  
**Status:** TODO

Button yang melakukan mutation harus memiliki:

```text
Loading indicator
Disabled state
```

Contoh:

```text
[ Approving... ]
```

---

# 23. Phase 19 — Empty State

## FE-061 — Empty States

**Priority:** P0  
**Status:** TODO

Implementasikan empty state untuk:

```text
No Reports
No Search Result
No My Reports
No Claims
No Notifications
No Users
No Categories
No Activity Logs
```

---

# 24. Phase 20 — Error Handling

## FE-062 — Global API Error

**Priority:** P0  
**Status:** TODO

Handle:

```text
400
401
403
404
409
422
500
Network Error
```

---

## FE-063 — Form Error

**Priority:** P0  
**Status:** TODO

API validation error harus dipetakan ke field terkait jika tersedia.

---

## FE-064 — Not Found Page

**Priority:** P1  
**Status:** TODO

Route:

```text
/*
```

Display:

```text
404
Halaman tidak ditemukan.
```

Action:

```text
Kembali ke Dashboard
```

---

## FE-065 — Forbidden Page

**Priority:** P1  
**Status:** TODO

Display:

```text
403
Anda tidak memiliki akses ke halaman ini.
```

---

# 25. Phase 21 — Responsive

## FE-066 — Desktop

**Priority:** P0  
**Status:** TODO

Pastikan seluruh halaman berjalan baik pada desktop.

---

## FE-067 — Tablet

**Priority:** P1  
**Status:** TODO

Pastikan:

```text
Navigation
Table
Cards
Forms
Modal
```

tetap usable.

---

## FE-068 — Mobile Web

**Priority:** P1  
**Status:** TODO

Implementasikan:

```text
Responsive Navigation
Mobile Sidebar/Drawer
Responsive Form
Responsive Card
Responsive Table
```

---

# 26. Phase 22 — Accessibility

## FE-069 — Keyboard Navigation

**Priority:** P1  
**Status:** TODO

Pastikan:

```text
Tab
Enter
Escape
Arrow keys jika diperlukan
```

berfungsi pada interactive elements.

---

## FE-070 — Form Accessibility

**Priority:** P1  
**Status:** TODO

Setiap field memiliki:

```text
Label
Error association
Focus state
```

---

## FE-071 — Image Accessibility

**Priority:** P1  
**Status:** TODO

Image memiliki:

```text
alt
```

yang relevan.

---

# 27. Phase 23 — Security UI

## FE-072 — Sensitive Data Handling

**Priority:** P0  
**Status:** TODO

Jangan menyimpan:

```text
Password
Sensitive token
```

di localStorage jika architecture menggunakan secure cookie/session.

Ikuti mekanisme authentication yang didefinisikan `Architecture.md`.

---

## FE-073 — Permission-based UI

**Priority:** P0  
**Status:** TODO

Hide/disable action berdasarkan permission.

Contoh:

```text
USER
→ Tidak melihat Admin Menu

Non-owner
→ Tidak melihat Edit/Delete

Inactive Report
→ Tidak melihat Claim

Approved Claim
→ Tidak melihat Cancel
```

Backend tetap melakukan authorization.

---

# 28. Phase 24 — Data Consistency

## FE-074 — Query Refresh

**Priority:** P0  
**Status:** TODO

Pastikan data di-refresh setelah mutation penting.

Contoh:

```text
Approve Report
→ Report List refresh

Reject Claim
→ Claim List refresh

Delete Report
→ My Reports refresh
```

---

## FE-075 — Stale State Protection

**Priority:** P1  
**Status:** TODO

Jika resource sudah berubah di server:

```text
API → 409 Conflict
```

Frontend menampilkan:

```text
Data telah berubah.
Silakan muat ulang halaman.
```

---

# 29. Phase 25 — Form UX

## FE-076 — Unsaved Changes

**Priority:** P1  
**Status:** TODO

Jika form memiliki perubahan:

```text
Navigate Away
 ↓
Confirmation
```

---

## FE-077 — Preserve Form State

**Priority:** P0  
**Status:** TODO

Ketika validation gagal:

```text
Preserve all entered fields.
```

Jangan reset form secara tidak sengaja.

---

# 30. Phase 26 — Image Upload UX

## FE-078 — Image Preview

**Priority:** P1  
**Status:** TODO

Setelah user memilih image:

```text
Select
 ↓
Preview
 ↓
Remove / Replace
```

---

## FE-079 — Image Validation

**Priority:** P0  
**Status:** TODO

Validasi:

```text
File type
File size
```

Sesuai rule backend.

Frontend validation hanya sebagai UX improvement.

---

# 31. Phase 27 — Performance

## FE-080 — Lazy Loading

**Priority:** P1  
**Status:** TODO

Lazy load halaman besar seperti:

```text
Admin
Activity Logs
Report Detail
```

jika architecture mendukung.

---

## FE-081 — Image Optimization

**Priority:** P1  
**Status:** TODO

Gunakan:

```text
Responsive image
Lazy loading
Proper dimensions
```

---

## FE-082 — Avoid Unnecessary Requests

**Priority:** P1  
**Status:** TODO

Pastikan:

```text
Search debounce
Pagination
Caching jika diperlukan
Request deduplication
```

---

# 32. Phase 28 — Frontend Testing Preparation

## FE-083 — Testable Components

**Priority:** P0  
**Status:** TODO

Komponen critical harus mudah dites.

Prioritas:

```text
LoginForm
RegisterForm
ReportForm
ClaimForm
ReportCard
StatusBadge
ConfirmDialog
```

---

# 33. Phase 29 — Critical Flow Verification

## FE-084 — Authentication Flow

**Priority:** P0  
**Status:** TODO

Verify:

```text
Register
Login
Logout
Session
Unauthorized
Forbidden
```

---

## FE-085 — Lost Report Flow

**Priority:** P0  
**Status:** TODO

Verify:

```text
Create Lost Report
 ↓
Pending Verification
 ↓
Admin Verification
 ↓
Active
 ↓
Found
 ↓
Completed
```

---

## FE-086 — Found Report Flow

**Priority:** P0  
**Status:** TODO

Verify:

```text
Create Found Report
 ↓
Verification
 ↓
Active
 ↓
Claim
 ↓
Admin Review
 ↓
Approved
 ↓
Claimed
 ↓
Completed
```

---

## FE-087 — Rejection Flow

**Priority:** P0  
**Status:** TODO

Verify:

```text
Report Rejected
Claim Rejected
```

User dapat melihat reason.

---

# 34. Phase 30 — Final Frontend QA Preparation

## FE-088 — Console Clean

**Priority:** P0  
**Status:** TODO

Pastikan tidak ada:

```text
console.error
Unhandled Promise Rejection
React warnings
Missing key warning
Hydration error
```

sesuai framework yang digunakan.

---

## FE-089 — Build Verification

**Priority:** P0  
**Status:** TODO

```text
Build
 ↓
Success
```

Tidak boleh terdapat TypeScript/build error.

---

## FE-090 — Route Verification

**Priority:** P0  
**Status:** TODO

Verify seluruh route:

```text
/login
/register
/dashboard
/reports
/reports/:id
/reports/create
/reports/:id/edit
/my-reports
/my-claims
/notifications
/profile

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

# 35. Frontend Task Dependency

```text
FE-001
  ↓
FE-002 → FE-003
  ↓
FE-004 → FE-008
  ↓
FE-009 → FE-011
  ↓
FE-012
  ↓
FE-013 → FE-016
  ↓
FE-017
  ↓
FE-018 → FE-021
  ↓
FE-022 → FE-027
  ↓
FE-028 → FE-030
  ↓
FE-031 → FE-036
  ↓
FE-037 → FE-039
  ↓
FE-040
  ↓
FE-041 → FE-050
  ↓
FE-051 → FE-057
  ↓
FE-058
  ↓
FE-059 → FE-082
  ↓
FE-083 → FE-087
  ↓
FE-088 → FE-090
```

---

# 36. Recommended Implementation Order

Antigravity sebaiknya mengerjakan task berdasarkan urutan berikut:

```text
1. Project Setup
2. Design System
3. Shared Components
4. API Foundation
5. Authentication
6. Route Guards
7. User Dashboard
8. Report List
9. Report Detail
10. Create Report
11. My Reports
12. Edit/Delete Report
13. Claim
14. Notifications
15. Profile
16. Admin Layout
17. Admin Dashboard
18. Admin Reports
19. Admin Claims
20. Categories
21. Users
22. Activity Logs
23. Error Handling
24. Responsive
25. Accessibility
26. Performance
27. Critical Flow Verification
28. Final Build Verification
```

---

# 37. MVP Priority

Jika waktu implementasi terbatas, prioritaskan:

```text
P0
```

P0 minimum:

```text
Authentication
Dashboard
Report List
Report Detail
Create Lost Report
Create Found Report
My Reports
Edit Report
Delete Report
Claim
My Claims
Admin Dashboard
Admin Report Verification
Admin Claim Review
Category Management
API Integration
Loading
Error
Empty State
Authorization
Responsive Basic
```

P1 dapat dikerjakan setelah core system stabil:

```text
Notifications
Profile
User Management
Activity Logs
Advanced Responsive
Accessibility
Performance Optimization
Advanced UX
```

---

# 38. Out of Scope Frontend

Frontend tidak mengimplementasikan:

```text
Mobile Android/iOS
AI Matching
Real-time Tracking
Payment
Delivery System
Academic System Integration
```

Frontend juga tidak boleh membuat:

```text
AI matching
Automatic location tracking
Automatic ownership verification
Payment workflow
```

tanpa perubahan requirement.

---

# 39. Final Frontend Checklist

## Foundation

- [ ] Project setup.
- [ ] TypeScript.
- [ ] Environment.
- [ ] Lint.
- [ ] Format.
- [ ] Build.

## Design

- [ ] Design tokens.
- [ ] Typography.
- [ ] Colors.
- [ ] Components.
- [ ] Responsive.

## Authentication

- [ ] Register.
- [ ] Login.
- [ ] Logout.
- [ ] Session.
- [ ] Route guard.
- [ ] Role guard.

## User

- [ ] Dashboard.
- [ ] Report list.
- [ ] Search.
- [ ] Filter.
- [ ] Report detail.
- [ ] Create lost report.
- [ ] Create found report.
- [ ] Edit report.
- [ ] Delete report.
- [ ] My reports.

## Claim

- [ ] Claim form.
- [ ] Claim submission.
- [ ] My claims.
- [ ] Claim detail.
- [ ] Cancel claim.

## Notification

- [ ] Notification list.
- [ ] Notification badge.
- [ ] Mark as read.

## Admin

- [ ] Admin dashboard.
- [ ] Report management.
- [ ] Report verification.
- [ ] Claim management.
- [ ] Claim verification.
- [ ] Category management.
- [ ] User management.
- [ ] Activity logs.

## UX States

- [ ] Loading.
- [ ] Empty.
- [ ] Error.
- [ ] Success.
- [ ] Confirmation.
- [ ] Disabled.
- [ ] Validation.

## Quality

- [ ] Responsive.
- [ ] Accessible.
- [ ] No console errors.
- [ ] No TypeScript errors.
- [ ] No broken routes.
- [ ] Build success.
- [ ] Critical flows verified.

---

# 40. Final Status

**TaskFrontend.md: FINAL**

Task frontend ini menjadi checklist implementasi untuk seluruh sisi frontend.

Urutan dokumentasi implementasi:

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

`TaskBackend.md` bertanggung jawab terhadap:

```text
Database
API
Authentication
Authorization
Business Logic
Report Workflow
Claim Workflow
File Storage
Notification
Activity Log
```

`TaskQA.md` bertanggung jawab terhadap:

```text
Functional Testing
API Testing
UI Testing
User Flow Testing
Role/Permission Testing
Validation Testing
State Transition Testing
Responsive Testing
Regression Testing
Acceptance Testing
```
