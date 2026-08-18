# Database.md

# Sistem Manajemen Laporan Kehilangan Barang Kampus

**Version:** 1.1  
**Status:** Final  
**Database:** SQLite  
**ORM:** Prisma

---

# 1. Database Overview

Sistem menggunakan SQLite sebagai database utama dan Prisma sebagai ORM.

```text
Application
    ↓
Prisma Client
    ↓
SQLite
    ↓
data/database.sqlite
```

Struktur database:

```text
backend/
├── data/
│   └── database.sqlite
│
└── prisma/
    ├── schema.prisma
    └── migrations/
```

SQLite dipilih karena:

- Tidak membutuhkan database server terpisah.
- Setup sederhana.
- Cocok untuk MVP.
- Mudah digunakan pada development.
- Mendukung transaction.
- Mudah dipindahkan bersama aplikasi.
- Dapat dimigrasikan ke database server jika sistem berkembang.

---

# 2. Database Scope

Database mencakup:

```text
User Management
Category Management
Lost & Found Reports
Report Images
Claims
Notifications
Activity Logs
```

Database tidak mencakup:

```text
Academic System
Payment
Real-time Tracking
AI Matching
Shipping
Mobile Application Data
```

---

# 3. Entity Overview

Entity utama:

```text
users
categories
reports
report_images
claims
notifications
activity_logs
```

Relasi utama:

```text
users
  │
  ├── reports
  ├── claims
  ├── notifications
  └── activity_logs
       │
       └── reports
              │
              ├── categories
              ├── report_images
              └── claims
```

---

# 4. Entity Relationship Diagram

```text
┌─────────────────────┐
│        users        │
├─────────────────────┤
│ id PK               │
│ name                │
│ email UNIQUE        │
│ password_hash       │
│ role                │
│ is_active           │
│ created_at          │
│ updated_at          │
└─────────┬───────────┘
          │
          │ 1:N
          ▼
┌─────────────────────┐
│       reports       │
├─────────────────────┤
│ id PK               │
│ reporter_id FK      │
│ category_id FK      │
│ type                │
│ item_name           │
│ description         │
│ location            │
│ occurred_at         │
│ status              │
│ deleted_at          │
│ created_at          │
│ updated_at          │
└───────┬─────────────┘
        │
        ├───────────────┐
        │               │
        │ 1:N           │ 1:N
        ▼               ▼
┌─────────────────┐ ┌─────────────────────┐
│  report_images  │ │       claims        │
├─────────────────┤ ├─────────────────────┤
│ id PK           │ │ id PK               │
│ report_id FK    │ │ report_id FK        │
│ url             │ │ claimant_id FK      │
│ created_at      │ │ reason              │
└─────────────────┘ │ evidence            │
                    │ status              │
                    │ review_reason       │
                    │ created_at          │
                    │ updated_at          │
                    └─────────────────────┘

┌─────────────────────┐
│     categories      │
├─────────────────────┤
│ id PK               │
│ name UNIQUE         │
│ is_active           │
│ created_at          │
│ updated_at          │
└─────────┬───────────┘
          │
          │ 1:N
          ▼
       reports


users
  │
  ├── 1:N ── claims
  │
  ├── 1:N ── notifications
  │
  └── 1:N ── activity_logs
```

---

# 5. SQLite Data Type Convention

SQLite memiliki dynamic typing, tetapi aplikasi menggunakan convention yang konsisten.

| Application Type | SQLite Type                |
| ---------------- | -------------------------- |
| Integer          | INTEGER                    |
| String           | TEXT                       |
| Boolean          | INTEGER                    |
| DateTime         | TEXT                       |
| JSON             | TEXT                       |
| Decimal          | REAL jika diperlukan       |
| Binary File      | Tidak disimpan di database |

---

# 6. Boolean Convention

SQLite tidak memiliki tipe Boolean khusus.

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
is_active = 1
is_read = 0
```

Prisma melakukan mapping ke:

```text
Boolean
```

pada application layer.

---

# 7. DateTime Convention

DateTime disimpan sebagai:

```text
TEXT
```

Gunakan format ISO 8601.

Contoh:

```text
2026-08-18T08:30:00.000Z
```

Database menggunakan UTC.

Frontend bertanggung jawab mengubah timestamp ke timezone pengguna untuk kebutuhan display.

---

# 8. ID Convention

Primary key menggunakan:

```text
INTEGER PRIMARY KEY
```

Prisma bertanggung jawab terhadap auto increment.

Contoh konsep:

```text
id INTEGER PRIMARY KEY AUTOINCREMENT
```

---

# 9. Users

Table:

```text
users
```

Digunakan untuk menyimpan akun pengguna sistem.

## Schema

| Field         | Type    | Null | Default | Constraint |
| ------------- | ------- | ---: | ------- | ---------- |
| id            | INTEGER |   No | Auto    | PK         |
| name          | TEXT    |   No | -       | -          |
| email         | TEXT    |   No | -       | UNIQUE     |
| password_hash | TEXT    |   No | -       | -          |
| role          | TEXT    |   No | USER    | ENUM       |
| is_active     | INTEGER |   No | 1       | Boolean    |
| created_at    | TEXT    |   No | Now     | -          |
| updated_at    | TEXT    |   No | Now     | -          |

---

# 10. User Role

Role yang digunakan:

```text
USER
ADMIN
```

Default:

```text
USER
```

## USER

User dapat:

```text
Melihat laporan
Membuat laporan
Mengubah laporan miliknya
Menghapus laporan miliknya
Membuat claim
Melihat claim miliknya
Melihat notification
```

## ADMIN

Admin dapat:

```text
Mengelola laporan
Memverifikasi laporan
Mengelola claim
Mengelola category
Mengelola user
Melihat activity log
Melihat dashboard
```

---

# 11. User Status

User menggunakan:

```text
is_active
```

Convention:

```text
1 = Active
0 = Inactive
```

User inactive:

```text
Tidak dapat login.
```

User tidak perlu dihapus secara destructive.

---

# 12. User Constraints

Email harus unique:

```text
UNIQUE(email)
```

Email harus dinormalisasi sebelum disimpan.

Contoh:

```text
user@example.com
```

---

# 13. User Indexes

Index:

```text
email
role
is_active
```

Email menjadi index utama untuk authentication.

---

# 14. Categories

Table:

```text
categories
```

Digunakan untuk kategori barang.

Contoh:

```text
Elektronik
Dokumen
Pakaian
Aksesori
Buku
Lainnya
```

---

# 15. Category Schema

| Field      | Type    | Null | Default | Constraint |
| ---------- | ------- | ---: | ------- | ---------- |
| id         | INTEGER |   No | Auto    | PK         |
| name       | TEXT    |   No | -       | UNIQUE     |
| is_active  | INTEGER |   No | 1       | Boolean    |
| created_at | TEXT    |   No | Now     | -          |
| updated_at | TEXT    |   No | Now     | -          |

---

# 16. Category Status

Category menggunakan:

```text
is_active
```

Jika category tidak digunakan lagi:

```text
is_active = 0
```

Category inactive:

```text
Tidak muncul pada form laporan baru.
```

Namun report lama tetap dapat menggunakan category tersebut.

---

# 17. Category Constraints

Nama category harus unique:

```text
UNIQUE(name)
```

---

# 18. Category Indexes

Index:

```text
name
is_active
```

---

# 19. Reports

Table:

```text
reports
```

Merupakan entity utama sistem.

Report memiliki dua tipe:

```text
LOST
FOUND
```

---

# 20. Report Schema

| Field       | Type    | Null | Default              | Constraint    |
| ----------- | ------- | ---: | -------------------- | ------------- |
| id          | INTEGER |   No | Auto                 | PK            |
| reporter_id | INTEGER |   No | -                    | FK users      |
| category_id | INTEGER |   No | -                    | FK categories |
| type        | TEXT    |   No | -                    | LOST / FOUND  |
| item_name   | TEXT    |   No | -                    | -             |
| description | TEXT    |   No | -                    | -             |
| location    | TEXT    |   No | -                    | -             |
| occurred_at | TEXT    |   No | -                    | ISO 8601      |
| status      | TEXT    |   No | PENDING_VERIFICATION | ENUM          |
| deleted_at  | TEXT    |  Yes | NULL                 | Soft Delete   |
| created_at  | TEXT    |   No | Now                  | -             |
| updated_at  | TEXT    |   No | Now                  | -             |

---

# 21. Report Type

Allowed value:

```text
LOST
FOUND
```

## LOST

Barang milik user yang hilang.

## FOUND

Barang yang ditemukan oleh user.

---

# 22. Report Status

Status utama:

```text
PENDING_VERIFICATION
ACTIVE
REJECTED
FOUND
CLAIMED
COMPLETED
CANCELLED
```

---

# 23. Report Status Transition

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
  ├──→ CLAIMED
  ├──→ COMPLETED
  └──→ CANCELLED
```

Backend wajib memvalidasi transition.

Tidak semua status dapat berpindah secara bebas.

---

# 24. Report Ownership

Relasi:

```text
reports.reporter_id
        ↓
users.id
```

User hanya dapat mengubah atau menghapus report miliknya.

Admin dapat mengakses report sesuai administrative permission.

---

# 25. Report Indexes

Index utama:

```text
reporter_id
category_id
type
status
location
created_at
```

Index digunakan untuk mempercepat:

```text
Filter
Search
Sorting
Pagination
Ownership Query
```

---

# 26. Report Search

Search dapat dilakukan terhadap:

```text
item_name
description
location
```

Search tidak menggunakan AI.

Implementasi awal menggunakan query SQLite/Prisma.

---

# 27. Report Pagination

Report list harus menggunakan pagination.

Contoh:

```text
page = 1
limit = 20
```

Backend menentukan maximum limit.

Contoh:

```text
maximum = 100
```

Nilai final dapat disesuaikan dengan API specification.

---

# 28. Report Images

Table:

```text
report_images
```

Digunakan untuk menyimpan reference foto barang.

Database tidak menyimpan binary image.

---

# 29. Report Image Schema

| Field      | Type    | Null | Default | Constraint |
| ---------- | ------- | ---: | ------- | ---------- |
| id         | INTEGER |   No | Auto    | PK         |
| report_id  | INTEGER |   No | -       | FK reports |
| url        | TEXT    |   No | -       | -          |
| created_at | TEXT    |   No | Now     | -          |

---

# 30. Report Image Relationship

```text
reports
   │
   │ 1:N
   ▼
report_images
```

Satu report dapat memiliki beberapa gambar.

Jumlah maksimum gambar ditentukan oleh application configuration.

---

# 31. File Storage

File tidak disimpan sebagai BLOB dalam SQLite.

File disimpan pada file storage.

Untuk MVP:

```text
uploads/
└── reports/
```

Database hanya menyimpan:

```text
url
```

atau:

```text
file_path
```

---

# 32. Claim

Table:

```text
claims
```

Claim digunakan ketika user merasa bahwa barang FOUND merupakan miliknya.

---

# 33. Claim Schema

| Field         | Type    | Null | Default | Constraint |
| ------------- | ------- | ---: | ------- | ---------- |
| id            | INTEGER |   No | Auto    | PK         |
| report_id     | INTEGER |   No | -       | FK reports |
| claimant_id   | INTEGER |   No | -       | FK users   |
| reason        | TEXT    |   No | -       | -          |
| evidence      | TEXT    |  Yes | NULL    | -          |
| status        | TEXT    |   No | PENDING | ENUM       |
| review_reason | TEXT    |  Yes | NULL    | -          |
| created_at    | TEXT    |   No | Now     | -          |
| updated_at    | TEXT    |   No | Now     | -          |

---

# 34. Claim Status

Allowed:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

---

# 35. Claim Status Transition

```text
PENDING
   │
   ├──→ APPROVED
   ├──→ REJECTED
   └──→ CANCELLED
```

Status transition wajib divalidasi oleh backend.

---

# 36. Claim Rules

Claim hanya dapat dibuat jika:

```text
report.type = FOUND
```

dan:

```text
report.status = ACTIVE
```

Selain itu claim harus ditolak.

---

# 37. Duplicate Claim Rule

User tidak boleh memiliki lebih dari satu active claim terhadap report yang sama.

Contoh:

```text
User A
   ↓
Report 10
   ↓
Claim PENDING
```

User A tidak dapat membuat claim kedua terhadap:

```text
Report 10
```

selama claim pertama masih aktif.

---

# 38. Self Claim Rule

Reporter tidak boleh claim report FOUND miliknya sendiri.

Rule:

```text
report.reporter_id != claim.claimant_id
```

Jika sama:

```text
Reject Request
```

---

# 39. Claim Indexes

Index:

```text
report_id
claimant_id
status
created_at
```

---

# 40. Notifications

Table:

```text
notifications
```

Digunakan untuk notification dalam aplikasi.

---

# 41. Notification Schema

| Field      | Type    | Null | Default | Constraint |
| ---------- | ------- | ---: | ------- | ---------- |
| id         | INTEGER |   No | Auto    | PK         |
| user_id    | INTEGER |   No | -       | FK users   |
| type       | TEXT    |   No | -       | ENUM       |
| title      | TEXT    |   No | -       | -          |
| message    | TEXT    |   No | -       | -          |
| is_read    | INTEGER |   No | 0       | Boolean    |
| created_at | TEXT    |   No | Now     | -          |

---

# 42. Notification Type

Contoh:

```text
REPORT_APPROVED
REPORT_REJECTED
REPORT_STATUS_CHANGED

CLAIM_CREATED
CLAIM_APPROVED
CLAIM_REJECTED
```

Notification type dapat ditambah jika terdapat kebutuhan baru.

---

# 43. Notification Status

```text
is_read = 0
```

berarti:

```text
Unread
```

```text
is_read = 1
```

berarti:

```text
Read
```

---

# 44. Notification Indexes

Index:

```text
user_id
is_read
created_at
```

Query umum:

```text
Get unread notifications
Get latest notifications
```

---

# 45. Activity Logs

Table:

```text
activity_logs
```

Digunakan untuk mencatat aktivitas penting dalam sistem.

---

# 46. Activity Log Schema

| Field      | Type    | Null | Default | Constraint |
| ---------- | ------- | ---: | ------- | ---------- |
| id         | INTEGER |   No | Auto    | PK         |
| actor_id   | INTEGER |  Yes | NULL    | FK users   |
| action     | TEXT    |   No | -       | -          |
| entity     | TEXT    |   No | -       | -          |
| entity_id  | INTEGER |  Yes | NULL    | -          |
| metadata   | TEXT    |  Yes | NULL    | JSON       |
| created_at | TEXT    |   No | Now     | -          |

---

# 47. Activity Log Action

Contoh:

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

# 48. Activity Log Entity

Contoh:

```text
USER
REPORT
CLAIM
CATEGORY
```

---

# 49. Activity Log Metadata

Metadata disimpan sebagai JSON string.

Contoh:

```json
{
  "oldStatus": "PENDING_VERIFICATION",
  "newStatus": "ACTIVE"
}
```

SQLite menyimpan:

```text
TEXT
```

Application layer melakukan serialization/deserialization JSON.

---

# 50. Activity Log Rules

Activity log bersifat:

```text
Append-only
```

User tidak dapat mengubah activity log.

Admin hanya dapat membaca log.

---

# 51. Activity Log Indexes

Index:

```text
actor_id
entity
entity_id
action
created_at
```

---

# 52. Foreign Key Relationships

Relasi:

```text
reports.reporter_id
    → users.id
```

```text
reports.category_id
    → categories.id
```

```text
report_images.report_id
    → reports.id
```

```text
claims.report_id
    → reports.id
```

```text
claims.claimant_id
    → users.id
```

```text
notifications.user_id
    → users.id
```

```text
activity_logs.actor_id
    → users.id
```

---

# 53. Foreign Key Enforcement

SQLite foreign key enforcement harus aktif.

Konsep:

```sql
PRAGMA foreign_keys = ON;
```

Prisma/database configuration harus memastikan relational integrity tetap ditegakkan.

---

# 54. Delete Strategy

Database menggunakan kombinasi:

```text
Soft Delete
Restrict
Cascade
```

berdasarkan entity.

---

# 55. User Delete Strategy

User tidak dihapus secara destructive sebagai default.

Gunakan:

```text
is_active = 0
```

Alasan:

```text
Historical report
Historical claim
Activity log
Data ownership
```

tetap membutuhkan referensi user.

---

# 56. Category Delete Strategy

Category menggunakan:

```text
is_active = 0
```

Category lama tetap dipertahankan karena masih dapat digunakan oleh historical reports.

---

# 57. Report Delete Strategy

Report menggunakan soft delete:

```text
deleted_at
```

Contoh:

```text
deleted_at = NULL
```

berarti aktif secara database.

```text
deleted_at = 2026-08-18T10:00:00.000Z
```

berarti telah dihapus secara logical.

---

# 58. Report Image Delete Strategy

Jika report dihapus secara soft delete:

```text
Report
   ↓
Soft Deleted
```

Report image dapat tetap disimpan selama retention policy belum menghapus file.

Jika report benar-benar dihapus:

```text
Report
   ↓
Report Images
   ↓
Delete / Cleanup
```

---

# 59. Claim Delete Strategy

Claim tidak perlu dihapus secara destructive.

Gunakan status:

```text
CANCELLED
REJECTED
APPROVED
```

Historical claim harus tetap tersedia untuk audit.

---

# 60. Notification Delete Strategy

Notification dapat dihapus secara destructive jika dibutuhkan.

Namun untuk MVP:

```text
Notification
   ↓
is_read
```

cukup untuk menandai status notification.

---

# 61. Activity Log Delete Strategy

Activity log tidak boleh dihapus melalui normal application flow.

```text
Append-only
```

---

# 62. Transaction Requirements

Transaction wajib digunakan untuk operasi yang memodifikasi beberapa entity yang saling bergantung.

Contoh:

```text
Approve Claim
```

melibatkan:

```text
claims
reports
notifications
activity_logs
```

---

# 63. Approve Claim Transaction

Flow:

```text
BEGIN TRANSACTION

1. Validate Claim
2. Update Claim → APPROVED
3. Update Report → CLAIMED
4. Create Notification
5. Create Activity Log

COMMIT
```

Jika gagal:

```text
ROLLBACK
```

---

# 64. Reject Claim Transaction

```text
BEGIN TRANSACTION

1. Validate Claim
2. Update Claim → REJECTED
3. Create Notification
4. Create Activity Log

COMMIT
```

---

# 65. Approve Report Transaction

```text
BEGIN TRANSACTION

1. Validate Report
2. Update Report → ACTIVE
3. Create Notification
4. Create Activity Log

COMMIT
```

---

# 66. Reject Report Transaction

```text
BEGIN TRANSACTION

1. Validate Report
2. Update Report → REJECTED
3. Create Notification
4. Create Activity Log

COMMIT
```

---

# 67. SQLite Concurrency

SQLite digunakan untuk MVP dengan traffic rendah sampai menengah.

Karena SQLite menggunakan file-based database:

```text
Concurrent Read
→ Baik

Concurrent Write
→ Lebih terbatas
```

Karena itu transaction harus dibuat:

```text
Singkat
Atomic
Terukur
```

Hindari operasi eksternal yang lama di dalam transaction.

---

# 68. SQLite WAL

Jika diperlukan, SQLite dapat menggunakan:

```text
WAL - Write Ahead Logging
```

untuk meningkatkan concurrency antara read dan write.

Konfigurasi WAL merupakan deployment/runtime concern dan dapat diaktifkan jika dibutuhkan.

---

# 69. Database Performance

Optimasi utama:

```text
Indexes
Pagination
Selective Query
Avoid N+1 Query
Short Transactions
```

Query list tidak boleh mengambil data yang tidak diperlukan.

---

# 70. N+1 Query Prevention

Ketika mengambil:

```text
Reports
```

jangan melakukan query category/user/image satu per satu.

Gunakan relation loading yang sesuai melalui Prisma.

Contoh konsep:

```text
Reports
 ├── Category
 ├── Reporter
 └── Images
```

dengan query yang efisien.

---

# 71. Data Validation

Database constraint bukan satu-satunya validation.

Validation dilakukan pada tiga layer:

```text
Frontend Validation
        ↓
Backend Validation
        ↓
Database Constraint
```

Backend tetap wajib melakukan validation walaupun frontend sudah melakukan validation.

---

# 72. Business Rules

Database harus mendukung business rule:

```text
User hanya mengubah report miliknya.
Admin dapat memverifikasi report.
Claim hanya untuk FOUND report.
Claim hanya untuk ACTIVE report.
User tidak dapat claim report sendiri.
User tidak dapat membuat duplicate active claim.
Status transition harus valid.
Inactive category tidak dapat digunakan untuk report baru.
Inactive user tidak dapat login.
```

Business rule tetap berada pada service layer.

Database digunakan untuk menjaga data integrity.

---

# 73. Prisma Schema Concept

Struktur Prisma mengikuti entity database.

Contoh:

```text
model User
model Category
model Report
model ReportImage
model Claim
model Notification
model ActivityLog
```

Nama model menggunakan PascalCase.

Nama field menggunakan camelCase pada Prisma model.

Nama tabel database dapat menggunakan snake_case jika dikonfigurasi dengan mapping.

---

# 74. Prisma Mapping Convention

Application:

```text
createdAt
updatedAt
passwordHash
reporterId
categoryId
```

Database:

```text
created_at
updated_at
password_hash
reporter_id
category_id
```

Gunakan Prisma `@map` dan `@@map` jika convention tersebut diterapkan.

---

# 75. Prisma Migration

Database schema dikelola melalui migration.

Flow development:

```text
Update Prisma Schema
        ↓
Generate Migration
        ↓
Apply Migration
        ↓
Generate Prisma Client
```

Migration harus disimpan dalam repository.

---

# 76. Migration Rules

Migration:

```text
Tidak boleh dihapus sembarangan
Tidak boleh diedit setelah digunakan pada environment bersama
Harus memiliki urutan
Harus dapat dijalankan kembali pada database baru
```

---

# 77. Database Reset

Untuk development dapat tersedia:

```text
Reset Database
```

Flow:

```text
Delete Development Database
        ↓
Run Migration
        ↓
Run Seed
        ↓
Database Ready
```

Jangan menggunakan reset database pada production.

---

# 78. Seed Data

Seed development minimal:

```text
1 Admin
1 User
5-10 Categories
Sample Reports
Sample Claims
```

Seed production harus dipisahkan dari seed development.

---

# 79. Development Credentials

Contoh development:

```text
Admin:
admin@example.com

User:
user@example.com
```

Password development tidak boleh digunakan pada production.

---

# 80. Database File

Development database:

```text
data/database.sqlite
```

Database file sebaiknya tidak dimasukkan ke source control.

`.gitignore`:

```text
data/*.sqlite
data/*.sqlite-journal
data/*.sqlite-wal
data/*.sqlite-shm
```

Migration tetap dimasukkan ke repository.

---

# 81. Database Backup

Karena SQLite berbentuk file, backup dapat dilakukan dengan:

```text
Copy Database File
```

Namun backup production sebaiknya menggunakan mekanisme SQLite backup yang aman ketika database sedang digunakan.

Minimal backup mencakup:

```text
database.sqlite
uploads/
```

Database dan uploaded files harus dianggap sebagai satu kesatuan data aplikasi.

---

# 82. File Storage dan Database

Database:

```text
report_images.url
```

File:

```text
uploads/reports/*
```

Relationship:

```text
Report
   ↓
ReportImage
   ↓
File Path
   ↓
Physical File
```

Jika file hilang tetapi record masih ada, backend harus menangani kondisi tersebut dengan aman.

---

# 83. Data Retention

Untuk MVP:

```text
Reports
Claims
Activity Logs
```

tidak memiliki automatic purge.

Data deletion/cleanup dapat menjadi future improvement.

---

# 84. Security Considerations

Database security:

```text
Password → Hash
Secrets → Environment Variable
Database → Server-side only
SQLite File → Tidak public
Uploads → Controlled access
```

Frontend tidak boleh mengakses file database secara langsung.

---

# 85. Database Access

Hanya backend yang boleh mengakses SQLite.

```text
Browser
   X
   │
   └── Tidak boleh mengakses database.sqlite

Browser
   ↓
Backend API
   ↓
Prisma
   ↓
SQLite
```

---

# 86. Production Consideration

SQLite tetap menjadi database untuk MVP.

Namun jika aplikasi berkembang menjadi:

```text
High Traffic
Multiple Backend Instances
Heavy Concurrent Writes
Large Dataset
```

database dapat dipindahkan ke:

```text
PostgreSQL
```

Architecture sudah memisahkan:

```text
API
Service
Repository
ORM
Database
```

sehingga migration dapat dilakukan tanpa mengubah API contract.

---

# 87. Database Backup Scope

Backup wajib mencakup:

```text
database.sqlite
uploads/
```

Karena database hanya menyimpan reference terhadap gambar.

Backup database tanpa upload files dapat menyebabkan:

```text
Report ada
Image reference ada
File image hilang
```

---

# 88. Data Integrity Matrix

| Entity        | Primary Key | Foreign Key              | Unique        | Soft Delete |
| ------------- | ----------- | ------------------------ | ------------- | ----------- |
| users         | id          | -                        | email         | No          |
| categories    | id          | -                        | name          | No          |
| reports       | id          | reporter_id, category_id | -             | Yes         |
| report_images | id          | report_id                | -             | No          |
| claims        | id          | report_id, claimant_id   | Business Rule | No          |
| notifications | id          | user_id                  | -             | No          |
| activity_logs | id          | actor_id                 | -             | No          |

---

# 89. Index Matrix

| Table         | Index       |
| ------------- | ----------- |
| users         | email       |
| users         | role        |
| users         | is_active   |
| categories    | name        |
| categories    | is_active   |
| reports       | reporter_id |
| reports       | category_id |
| reports       | type        |
| reports       | status      |
| reports       | location    |
| reports       | created_at  |
| report_images | report_id   |
| claims        | report_id   |
| claims        | claimant_id |
| claims        | status      |
| claims        | created_at  |
| notifications | user_id     |
| notifications | is_read     |
| notifications | created_at  |
| activity_logs | actor_id    |
| activity_logs | entity      |
| activity_logs | entity_id   |
| activity_logs | action      |
| activity_logs | created_at  |

---

# 90. Final Database Structure

```text
SQLite
│
└── database.sqlite
    │
    ├── users
    │
    ├── categories
    │
    ├── reports
    │   │
    │   └── report_images
    │
    ├── claims
    │
    ├── notifications
    │
    └── activity_logs
```

---

# 91. Final Data Flow

```text
Frontend
   ↓
REST API
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
SQLite
```

File:

```text
Frontend
   ↓
REST API
   ↓
File Service
   ↓
uploads/
```

Database hanya menyimpan reference:

```text
report_images.url
```

---

# 92. Final Technology Decision

```text
Database:
SQLite

ORM:
Prisma

Database File:
data/database.sqlite

Migration:
Prisma Migrate

Database Access:
Prisma Client

File Storage:
Local File Storage untuk MVP

Primary Key:
Integer Auto Increment

Timestamp:
ISO 8601 UTC

Boolean:
SQLite INTEGER mapped to Boolean

JSON:
TEXT

Soft Delete:
deleted_at

Authentication:
Backend managed

Authorization:
Backend managed
```

---

# 93. Final Status

**Database.md: FINAL**

Database architecture ini menjadi acuan untuk:

```text
Architecture.md
API.md
TaskBackend.md
TaskQA.md
```

Urutan implementasi:

```text
Architecture.md
       ↓
Database.md
       ↓
Prisma Schema
       ↓
Migration
       ↓
Seed
       ↓
Repository
       ↓
Service
       ↓
Controller
       ↓
API
       ↓
Frontend Integration
       ↓
QA
```
