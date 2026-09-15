# CampuSync

### Student Academic, Attendance & Fee Management System

> **Everything you need, in sync.**

CampuSync is a web-based college management platform designed to centralize and simplify the management of **student profiles, academic records, attendance, marks, fees, fines, admissions, digital ID cards, and QR-based student verification**.

The system provides separate role-based dashboards for **Students, Staff, Accounts, and Admission** while maintaining a centralized database of student information.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Objectives](#-objectives)
* [Key Features](#-key-features)
* [User Roles](#-user-roles)
* [Complete System Workflow](#-complete-system-workflow)
* [Student Registration & Account Activation](#-student-registration--account-activation)
* [Academic Structure](#-academic-structure)
* [Student Academic History](#-student-academic-history)
* [Student Module](#-student-module)
* [Staff Module](#-staff-module)
* [Accounts Module](#-accounts-module)
* [Admission Module](#-admission-module)
* [Digital Student ID & QR Code](#-digital-student-id--qr-code)
* [Authentication & Security](#-authentication--security)
* [Notification & Email System](#-notification--email-system)
* [Attendance Workflow](#-attendance-workflow)
* [Marks Workflow](#-marks-workflow)
* [Fee Workflow](#-fee-workflow)
* [Fine Workflow](#-fine-workflow)
* [Student Deactivation](#-student-deactivation)
* [System Architecture](#-system-architecture)
* [Database Structure](#-database-structure)
* [Role-Based Access Control](#-role-based-access-control)
* [Suggested Technology Stack](#-suggested-technology-stack)
* [Project Structure](#-project-structure)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Development Workflow](#-development-workflow)
* [Future Enhancements](#-future-enhancements)
* [Benefits](#-benefits)
* [Project Scope](#-project-scope)
* [Conclusion](#-conclusion)

---

# 📖 Overview

**CampuSync** is a centralized student management system developed to reduce the dependency on manual college records and provide students and staff with a convenient digital platform.

The system brings together multiple college operations into one platform:

* Student management
* Admission management
* Attendance management
* Marks management
* Fee management
* Fine management
* Digital student identification
* QR-based student verification
* Email notifications
* Academic class/section management

Students can access their information through their personal dashboard, while authorized college personnel can manage the information relevant to their responsibilities.

---

# ❗ Problem Statement

Many colleges maintain student information across different systems, spreadsheets, registers, and departments.

This can create several problems:

* Students may not have a convenient way to check attendance.
* Marks may be communicated manually.
* Fee information may require visiting the accounts section.
* Fine information may not be easily accessible.
* Admission records may be maintained separately.
* Staff may have difficulty managing large numbers of students.
* Student class/section assignments can change every academic year.
* Newly admitted students may not receive their USN immediately.
* Physical student IDs do not provide an easy way to verify student identity.
* Manual data entry can result in duplication and errors.

CampuSync addresses these problems by providing a **centralized, role-based digital platform**.

---

# 🎯 Objectives

The primary objectives of CampuSync are:

1. Provide students with a centralized platform to access their information.
2. Allow students to monitor attendance and academic performance.
3. Provide transparent access to fee and fine information.
4. Allow staff to efficiently manage attendance and marks.
5. Allow the accounts section to manage fees, payments, and fines.
6. Allow the admission section to register and manage students.
7. Support students who do not receive their USN immediately after admission.
8. Maintain student academic/class history across different years.
9. Support different numbers of sections for different batches.
10. Generate digital student ID cards with unique QR codes.
11. Provide QR-based student verification.
12. Automate important communication through email.
13. Reduce manual paperwork and improve data accuracy.
14. Implement secure role-based access to protect student information.

---

# ✨ Key Features

### Student Features

* Secure login
* Personal profile
* Attendance tracking
* Subject-wise attendance
* Marks and grades
* Academic performance
* Fee tracking
* Payment history
* Fine tracking
* Notifications
* Digital student ID
* QR code
* Password management

### Staff Features

* Student search
* Batch/class selection
* Attendance management
* Marks management
* Academic reports
* Student information access
* Notifications

### Accounts Features

* Fee management
* Payment recording
* Pending fee tracking
* Fine management
* Financial reports
* Payment history
* Fee notifications

### Admission Features

* New student registration
* Student account creation
* Academic information management
* Temporary admission number
* USN update
* Batch/class assignment
* Student search
* Student deactivation
* Academic assignment management

### System Features

* Role-based authentication
* Email integration
* Password reset
* Account activation
* Digital ID generation
* QR code generation
* QR verification
* Academic history
* Configurable courses, batches and sections

---

# 👥 User Roles

CampuSync contains four primary roles.

## 1. Student

Students can:

* View their profile
* View attendance
* View marks
* View fees
* View fines
* View notifications
* View digital ID
* Change password

Students **cannot modify academic or financial records**.

---

## 2. Staff

Staff members are responsible for academic information.

They can:

* View students
* Mark attendance
* Update attendance
* Enter marks
* Update marks
* Publish marks
* Generate academic reports

Staff cannot modify financial information.

---

## 3. Accounts

The Accounts section manages financial information.

They can:

* Manage student fees
* Record payments
* View pending fees
* Add fines
* Update fines
* View financial reports

Accounts users cannot modify attendance or marks.

---

## 4. Admission

The Admission section manages student enrollment and student records.

They can:

* Register new students
* Create student accounts
* Enter admission details
* Assign batches
* Assign classes/sections
* Update student information
* Add USN after it is issued
* Deactivate students
* View student records
* Manage academic assignments

---

# 🔐 Complete System Workflow

The complete student lifecycle is:

```text
Student Gets Admission
        ↓
Admission Section
        ↓
Enter Student Details
        ↓
Create Student
        ↓
Generate CampuSync Student ID
        ↓
Create Account
        ↓
Generate Digital ID + QR
        ↓
Send Activation Email
        ↓
Student Opens Email
        ↓
Activate Account
        ↓
Create Password
        ↓
Account Activated
        ↓
Student Login
        ↓
Student Dashboard
```

After that:

```text
                 STUDENT
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Attendance      Marks      Fees/Fines
       ↑            ↑            ↑
      Staff        Staff       Accounts
```

---

# 📧 Student Registration & Account Activation

Students **do not self-register**.

The Admission Section creates the account.

## Step 1 — Admission creates student

Admission enters:

### Personal Information

* Full Name
* Date of Birth
* Gender
* Email
* Phone
* Address
* Parent/Guardian Name
* Parent/Guardian Contact

### Academic Information

* CampuSync Student ID
* Temporary/Admission Number
* USN
* Course
* Department
* Semester
* Admission Year
* Batch
* Class/Section

The USN can initially be empty.

---

## Step 2 — CampuSync creates the account

The system automatically generates:

```text
CampuSync Student ID
Account
Digital ID
QR Code
Activation Token
```

Example:

```text
CampuSync ID: CS26-0045
USN: Not Assigned
Admission No: ADM-2026-0045
```

---

## Step 3 — Email is sent

CampuSync sends an activation email to the student's registered email address.

The email contains:

* Student name
* CampuSync Student ID
* Course
* Batch
* Account activation link

The system should preferably **not send a permanent password through email**.

Instead:

```text
Activation Email
       ↓
Secure Activation Link
       ↓
Create Password
```

---

## Step 4 — Student creates password

The student opens the activation link.

They enter:

```text
New Password
Confirm Password
```

After successful validation:

```text
Account Status:
PENDING → ACTIVE
```

The student can now log in.

---

# 🏫 Academic Structure

CampuSync must support real-world college structures where different batches may have different numbers of sections.

Sections must **not be hardcoded**.

The structure should be configurable:

```text
Course
   ↓
Department
   ↓
Batch
   ↓
Academic Year
   ↓
Year
   ↓
Class / Section
   ↓
Students
```

Example:

```text
CSE
│
├── Batch 2024-28
│   ├── Section A
│   ├── Section B
│   └── Section C
│
├── Batch 2025-29
│   ├── Section A
│   └── Section B
│
└── Batch 2026-30
    ├── Section A
    ├── Section B
    └── Section C
```

If another batch has four sections, the administrator can simply add Section D.

---

# 🎓 Student Academic History

A student's class may change when they move from first year to second year.

Therefore, CampuSync should not store only one permanent section.

Instead, maintain an **Academic Assignment History**.

Example:

```text
Student: CS26-0045

2026-27
1st Year
CSE-1B

2027-28
2nd Year
CSE-2C

2028-29
3rd Year
CSE-3C

2029-30
4th Year
CSE-4C
```

The student's **admission batch remains unchanged**:

```text
Batch: 2026-30
```

But their class assignment changes according to the academic year.

Once assigned for an academic year, that assignment should remain part of the student's official academic history.

---

# 👨‍🎓 Student Module

## Dashboard

The dashboard should display:

* Student name
* Profile photo
* Student ID
* USN, if available
* Course
* Current class
* Attendance percentage
* Marks/GPA
* Pending fees
* Outstanding fines
* Recent notifications

---

## Attendance

Students can view:

* Subject
* Classes conducted
* Classes attended
* Classes absent
* Attendance percentage
* Attendance status

Example:

```text
Subject             Attendance
--------------------------------
Data Structures       87%
Python                92%
DBMS                  78%
Computer Networks     68%
```

---

## Marks

Students can view:

* Subject
* Internal marks
* Assignment marks
* Examination marks
* Total
* Grade

Charts can be used to display performance trends.

---

## Fees

Students can view:

* Total fee
* Paid amount
* Pending amount
* Due date
* Payment history
* Payment status

---

## Fines

Students can view:

* Fine reason
* Amount
* Date
* Status

---

# 👨‍🏫 Staff Module

## Attendance Management

Staff selects:

```text
Course
↓
Batch
↓
Academic Year
↓
Year
↓
Class/Section
↓
Semester
↓
Subject
↓
Date
```

Only students belonging to that particular academic assignment are loaded.

Example:

```text
CSE
2026-30
1st Year
Section B
Python
13 September 2026
```

The system then loads only:

> CSE 2026-30 → 1st Year → Section B students.

Staff can mark:

* Present
* Absent

and save the attendance.

---

## Marks Management

Staff selects:

```text
Course
Batch
Year
Section
Semester
Subject
Exam
```

Then enters marks.

Marks can be saved as drafts and later **published**.

Students should only see marks after they are published.

---

# 💰 Accounts Module

The Accounts dashboard should display:

* Total students
* Total fees collected
* Pending fees
* Total fines
* Outstanding amount

## Fee Management

Accounts can:

* Create fee records
* Update fee records
* Record payments
* Track pending amounts
* View payment history

Example:

```text
Total Fee:      ₹80,000
Paid:           ₹60,000
Pending:        ₹20,000
```

---

## Payment Recording

Accounts can record:

* Student
* Amount
* Payment method
* Transaction/reference number
* Payment date

Payment methods may include:

* Cash
* UPI
* Bank Transfer
* Online Payment

---

# ⚠️ Fine Management

Accounts can create a fine:

```text
Student: CS26-0045
Reason: Library Late Return
Amount: ₹100
Date: 13/09/2026
Status: Pending
```

The student receives a notification.

---

# 📝 Admission Module

The Admission dashboard manages the complete student lifecycle.

## New Admission

Admission staff can enter:

### Personal Details

* Name
* DOB
* Gender
* Email
* Phone
* Address
* Parent/Guardian details

### Academic Details

* Course
* Department
* Batch
* Admission Year
* Semester
* Temporary/Admission Number
* USN, if available
* Initial Class/Section

---

## Student Records

Admission can:

* Search students
* Filter students
* Edit student details
* View student profile
* View academic history
* Update USN
* View account status
* View class assignment

---

# 🪪 Digital Student ID & QR Code

Every student receives a digital ID.

The ID contains:

* College logo
* College name
* Student photo
* Student name
* CampuSync Student ID
* USN, if available
* Course
* Department
* Current academic year
* Current class
* QR code
* ID status

---

## QR Code

The QR code should contain a secure verification URL.

Example:

```text
campusync.com/verify/CS26-0045
```

When scanned:

```text
Scan QR
   ↓
CampuSync
   ↓
Student Verification
   ↓
✓ Verified Student
```

The public verification page should show only non-sensitive information.

### Should NOT show:

* Password
* Phone number
* Email
* Marks
* Attendance
* Fees
* Fines
* Private information

---

# 🔒 Authentication & Security

CampuSync should use secure authentication.

### Passwords

Passwords should never be stored as plain text.

Instead:

```text
Password
   ↓
Hashing
   ↓
Database
```

Use a secure password hashing algorithm such as **bcrypt** or **Argon2**.

### Login

The system verifies:

1. User exists
2. Password is correct
3. Account is active
4. User role is valid

Then creates a secure authenticated session/token.

---

## Role-Based Access Control

Each user only receives access to the functionality appropriate for their role.

```text
Student
   ├── View Attendance
   ├── View Marks
   ├── View Fees
   ├── View Fines
   └── Digital ID

Staff
   ├── Manage Attendance
   ├── Manage Marks
   └── View Students

Accounts
   ├── Manage Fees
   ├── Manage Payments
   └── Manage Fines

Admission
   ├── Add Students
   ├── Edit Students
   ├── Assign Classes
   ├── Update USN
   └── Deactivate Students
```

---

# 📩 Notification & Email System

CampuSync can integrate with an email provider such as **Brevo**.

The backend sends transactional emails when important events occur.

### Account

* Account created
* Account activation
* Password reset

### Academic

* Marks published
* Attendance warning

### Financial

* Fee reminder
* Payment confirmation
* Fine notification

### Administrative

* USN updated
* Important announcements

---

## Example Email Flow

```text
Admission creates student
        ↓
CampuSync Backend
        ↓
Email Service
        ↓
Student Gmail
```

The email service should be handled by the **backend**, not the frontend.

API keys and SMTP credentials must be stored in environment variables.

---

# 📊 Attendance Workflow

```text
Staff Login
    ↓
Attendance
    ↓
Select Course
    ↓
Select Batch
    ↓
Select Academic Year
    ↓
Select Year
    ↓
Select Section
    ↓
Select Subject
    ↓
Select Date
    ↓
Load Students
    ↓
Mark Present/Absent
    ↓
Save
    ↓
Database
    ↓
Student Dashboard
```

---

# 📈 Marks Workflow

```text
Staff
 ↓
Select Class
 ↓
Select Subject
 ↓
Select Exam
 ↓
Enter Marks
 ↓
Save Draft
 ↓
Review
 ↓
Publish
 ↓
Student can view marks
```

---

# 💳 Fee Workflow

```text
Admission
    ↓
Student Created
    ↓
Accounts creates fee record
    ↓
Total Fee
    ↓
Student makes payment
    ↓
Accounts records payment
    ↓
Pending amount updated
    ↓
Student dashboard updated
```

---

# ⚠️ Fine Workflow

```text
Accounts
   ↓
Select Student
   ↓
Add Fine
   ↓
Reason + Amount
   ↓
Save
   ↓
Student Notification
   ↓
Student Dashboard
```

---

# 🚫 Student Deactivation

Students should **not be permanently deleted**.

Instead:

```text
ACTIVE
  ↓
DEACTIVATE
  ↓
INACTIVE
```

Possible reasons:

* Course completed
* Discontinued
* Transfer
* Other

Historical data should remain available to authorized users.

The student's QR verification page can display:

> **Student ID Inactive**

instead of:

> ✓ Verified Student

---

# 🏗️ System Architecture

A recommended architecture:

```text
                 ┌──────────────────┐
                 │     Frontend     │
                 │  Web Application │
                 └────────┬─────────┘
                          │
                         API
                          │
                 ┌────────▼─────────┐
                 │     Backend      │
                 │ Business Logic   │
                 │ Authentication   │
                 └───────┬───┬──────┘
                         │   │
              ┌──────────┘   └──────────┐
              ↓                         ↓
       ┌──────────────┐          ┌──────────────┐
       │   Database   │          │ Email Service│
       │ PostgreSQL   │          │ Brevo/SMTP   │
       └──────────────┘          └──────────────┘
```

---

# 🗄️ Database Structure

A possible database structure:

```text
users
├── id
├── email
├── password_hash
├── role
├── status
└── created_at

students
├── id
├── campusync_id
├── usn
├── admission_number
├── name
├── email
├── phone
├── course_id
├── admission_batch_id
├── status
└── created_at

courses
├── id
├── name
└── department

batches
├── id
├── name
├── course_id
├── start_year
└── end_year

sections
├── id
├── name
├── batch_id
└── status

academic_assignments
├── id
├── student_id
├── academic_year
├── year
├── semester
├── section_id
└── status

subjects
├── id
├── name
├── semester
└── course_id

attendance
├── id
├── student_id
├── subject_id
├── academic_assignment_id
├── date
└── status

marks
├── id
├── student_id
├── subject_id
├── exam_type
├── marks
├── status
└── published_at

fees
├── id
├── student_id
├── total_amount
├── pending_amount
└── status

payments
├── id
├── student_id
├── amount
├── payment_method
├── transaction_id
└── payment_date

fines
├── id
├── student_id
├── reason
├── amount
├── status
└── created_at

digital_ids
├── id
├── student_id
├── qr_token
├── status
└── created_at

notifications
├── id
├── user_id
├── title
├── message
├── type
├── read
└── created_at
```

---

# 🔑 Permanent Student Identifier

The **CampuSync Student ID** should be the permanent internal identifier.

Example:

```text
CS26-0045
```

The USN is separate.

Initially:

```text
CampuSync ID: CS26-0045
USN: Not Assigned
```

Later:

```text
CampuSync ID: CS26-0045
USN: 4SU26CS045
```

The CampuSync ID doesn't change.

This prevents existing attendance, marks, fees, fines, and digital ID records from breaking when the USN is assigned.

---

# 🛠️ Suggested Technology Stack

A suitable stack for CampuSync could be:

### Frontend

* Next.js / React
* TypeScript
* Tailwind CSS
* Shadcn/ui
* Recharts

### Backend

* Node.js
* Express.js / Next.js API routes

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT / secure session-based authentication
* bcrypt or Argon2

### Email

* Brevo API or SMTP

### QR Code

* QR generation library
* Secure verification token

### Deployment

* VPS / Vercel
* PostgreSQL/Supabase or self-hosted PostgreSQL

---

# 📁 Suggested Project Structure

```text
campusync/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   │   ├── email/
│   │   ├── qr/
│   │   └── auth/
│   ├── models/
│   ├── utils/
│   └── config/
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── public/
│
├── .env
├── .env.example
├── README.md
└── package.json
```

---

# 🔐 Environment Variables

Sensitive credentials should never be committed to GitHub.

Example:

```env
DATABASE_URL=

JWT_SECRET=

BREVO_API_KEY=

EMAIL_FROM=

APP_URL=

QR_SECRET=
```

Use:

```text
.env
```

for local development and add it to `.gitignore`.

Provide:

```text
.env.example
```

with placeholder values.

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd campusync
```

## 2. Install dependencies

```bash
npm install
```

If frontend and backend are separate:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## 3. Configure environment variables

Create:

```text
.env
```

and configure:

```env
DATABASE_URL=
JWT_SECRET=
BREVO_API_KEY=
EMAIL_FROM=
APP_URL=
QR_SECRET=
```

## 4. Configure database

Run the database migrations using the selected ORM.

For Prisma:

```bash
npx prisma migrate dev
```

## 5. Start development server

```bash
npm run dev
```

The application will then be available locally.

---

# 🔄 Development Workflow

The recommended development order is:

### Phase 1 — Foundation

* Project setup
* Database
* Authentication
* User roles
* Basic dashboard layout

### Phase 2 — Admission

* Student registration
* Student ID generation
* Account creation
* Email activation
* Student profile

### Phase 3 — Academic Structure

* Courses
* Departments
* Batches
* Sections
* Academic years
* Student assignments
* Academic history

### Phase 4 — Staff

* Student management
* Attendance
* Marks
* Publishing

### Phase 5 — Accounts

* Fees
* Payments
* Fines
* Financial reports

### Phase 6 — Student

* Dashboard
* Attendance
* Marks
* Fees
* Fines
* Notifications

### Phase 7 — Digital ID

* ID card
* QR generation
* Verification page
* Active/inactive status

### Phase 8 — Testing

Test:

* Login
* Registration
* Password reset
* Role permissions
* Attendance
* Marks
* Fees
* Fines
* QR verification
* Student promotion
* Student deactivation

---

# 🔮 Future Enhancements

CampuSync can later be expanded with:

* Online fee payment
* UPI integration
* Automatic fee receipts
* SMS notifications
* WhatsApp notifications
* Mobile application
* Progressive Web App
* Attendance shortage alerts
* Automated attendance notifications
* AI-based academic performance analysis
* Examination timetable
* Assignment management
* College announcements
* Event management
* Library management
* Hostel management
* Transport management
* Parent portal
* Faculty timetable
* Leave management
* Document management
* Digital certificates

---

# 💡 Benefits

### For Students

* Access information anytime.
* Track attendance.
* Monitor academic performance.
* Check pending fees.
* Check fines.
* Access digital ID.
* Receive important notifications.

### For Staff

* Faster attendance management.
* Easier marks entry.
* Less paperwork.
* Easy student search.
* Organized academic records.

### For Accounts

* Centralized fee records.
* Easy payment tracking.
* Better fine management.
* Reduced manual work.

### For Admission

* Faster student registration.
* Centralized student records.
* Easy USN updates.
* Easy class assignment.
* Student deactivation without losing history.

### For the Institution

* Centralized information.
* Better transparency.
* Reduced paperwork.
* Improved data organization.
* Better communication.
* Scalable digital infrastructure.

---

# 📌 Project Scope

The initial version of CampuSync focuses on four major college operations:

```text
┌─────────────────────────────────┐
│            CampuSync             │
├─────────────────────────────────┤
│                                 │
│  🎓 Student                     │
│  👨‍🏫 Staff                      │
│  💰 Accounts                    │
│  📝 Admission                   │
│                                 │
└─────────────────────────────────┘
```

The system is designed to be **configurable rather than hardcoded**.

In particular:

* Courses can be added.
* Departments can be added.
* Batches can be added.
* Different batches can have different numbers of sections.
* Students can be assigned to different classes each academic year.
* USNs can be added later.
* Academic history is preserved.
* Students can be deactivated instead of deleted.

---

# 🏁 Conclusion

**CampuSync** aims to provide a unified digital platform for managing student academic, financial, and admission-related information.

By separating responsibilities between **Students, Staff, Accounts, and Admission**, the system ensures that each user can access only the information and functions required for their role.

The use of a **permanent CampuSync Student ID**, configurable academic structures, yearly class assignments, email-based account activation, digital student IDs, and QR-based verification makes the system flexible enough to accommodate real-world college requirements.

The project can initially serve as a mini-project and can later be expanded into a complete **College Management System** with online payments, mobile applications, notifications, examination management, library management, and other institutional services.

---

## 🏷️ Project Information

**Project Name:** CampuSync
**Full Title:** Student Academic & Fee Management System
**Type:** Web-Based College Management System
**Primary Users:** Students, Staff, Accounts, Admission
**Core Modules:** Student, Staff, Accounts, Admission
**Core Functions:** Attendance, Marks, Fees, Fines, Admissions, Digital ID, QR Verification
**Email:** Brevo API/SMTP or equivalent transactional email service
**Database:** PostgreSQL
**Architecture:** Role-Based Web Application
