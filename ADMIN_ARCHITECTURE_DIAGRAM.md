# 🎨 ADMIN DASHBOARD - SYSTEM ARCHITECTURE DIAGRAM

## Complete System Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                     READYPIPS ADMIN DASHBOARD                      │
│                        Complete System v1.0                         │
└────────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │   ADMIN      │
                          │   LOGIN      │
                          │   PAGE       │
                          └──────┬───────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Email: password      │
                    │   (Credentials)        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │  POST /api/admin/login         │
                    │  - Verify credentials         │
                    │  - Hash password check        │
                    │  - Generate JWT token         │
                    │  - Set HttpOnly cookie        │
                    │  - Log action                 │
                    └────────────┬───────────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │  ADMIN DASHBOARD               │
                    │  (Dashboard Router)            │
                    │  - Check token                 │
                    │  - Load admin profile          │
                    │  - Show sections based on role │
                    └────────────┬───────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────┐          ┌─────────────┐          ┌──────────────┐
   │SIDEBAR  │          │DASHBOARD    │          │ COMPONENTS  │
   ├─────────┤          │OVERVIEW     │          ├──────────────┤
   │• Admin  │          ├─────────────┤          │• Overview    │
   │  Profile│          │• Metrics    │          │• Users       │
   │• Menu   │          │• Charts     │          │• Subscriptions
   │• Logout │          │• Stats      │          │• Tools       │
   │         │          │• Alerts     │          │• Analytics   │
   └────┬────┘          └─────────────┘          │• Settings    │
        │                                        └──────────────┘
        └──────────┬──────────────┬───────────────────────┘
                   │              │
        ┌──────────▼──┐  ┌────────▼─────────┐
        │Navigate     │  │Fetch Data from   │
        │Sections     │  │API Endpoints     │
        └──────┬──────┘  └────────┬─────────┘
               │                  │
               └──────────┬───────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   API ENDPOINTS                    │
        │   (Authentication Required)        │
        ├────────────────────────────────────┤
        │ GET /admin/dashboard/stats         │
        │ GET /admin/users                   │
        │ GET /admin/subscriptions           │
        │ GET /admin/tools                   │
        │ GET /admin/announcements           │
        │ POST /admin/email-campaigns        │
        │ PUT /admin/subscriptions           │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   MIDDLEWARE CHAIN                 │
        ├────────────────────────────────────┤
        │ 1. Extract token from header       │
        │ 2. Verify JWT signature            │
        │ 3. Fetch admin from database       │
        │ 4. Check if admin is active        │
        │ 5. Verify permission for action    │
        │ 6. Execute endpoint                │
        │ 7. Log action to audit trail       │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   DATABASE OPERATIONS              │
        │   (MongoDB Collections)            │
        ├────────────────────────────────────┤
        │ → admins                           │
        │ → users                            │
        │ → subscriptions                    │
        │ → tools                            │
        │ → announcements                    │
        │ → email_campaigns                  │
        │ → admin_audit_logs                 │
        │ → password_reset_tokens            │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   RESPONSE SENT BACK               │
        │   (JSON Format)                    │
        ├────────────────────────────────────┤
        │ • Status code (200, 400, 401, etc) │
        │ • Data payload                     │
        │ • Error messages                   │
        │ • Pagination info                  │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   UI UPDATES                       │
        │   (React Components)               │
        ├────────────────────────────────────┤
        │ • Display data                     │
        │ • Show charts                      │
        │ • Update tables                    │
        │ • Show loading states              │
        │ • Display errors                   │
        └────────────────────────────────────┘
```

---

## Authentication & Authorization Flow

```
LOGIN ATTEMPT
     │
     ▼
┌─────────────────────────┐
│ Extract Email/Password  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Query: Find admin by email          │
│ Database: admins collection         │
└────────────┬────────────────────────┘
             │
    ┌────────▼────────┐
    │ Admin Found?    │
    └────┬────────┬───┘
         │No      │Yes
         │        │
         ▼        ▼
      ❌        ┌──────────────────┐
      Error     │ Verify Password  │
                │ bcrypt.compare() │
                └────┬─────────┬───┘
                     │No       │Yes
                     │         │
                     ▼         ▼
                  ❌           ┌──────────────────────┐
                  Error        │ Generate JWT Token   │
                               │ (7-day expiry)       │
                               └──────┬───────────────┘
                                      │
                               ┌──────▼────────────┐
                               │ Set HttpOnly      │
                               │ Secure Cookie    │
                               └──────┬────────────┘
                                      │
                               ┌──────▼──────────────┐
                               │ Update lastLogin    │
                               │ Record audit log    │
                               └──────┬───────────────┘
                                      │
                               ┌──────▼──────────────┐
                               │ Return JWT token    │
                               │ Redirect to         │
                               │ Dashboard          │
                               └─────────────────────┘
                                      ✅ SUCCESS

TOKEN VERIFICATION (On Protected Routes)
     │
     ▼
┌──────────────────────┐
│ Extract JWT from:    │
│ • Header (Bearer)    │
│ • Cookie (HttpOnly)  │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────┐
│ Verify JWT Signature    │
│ Using: JWT_SECRET env   │
└──────┬──────────┬───────┘
       │Invalid   │Valid
       │          │
       ▼          ▼
    ❌        ┌──────────────┐
    401       │Decode JWT    │
    Unauth    │Extract admin │
             │ID from token │
             └──────┬───────┘
                    │
             ┌──────▼──────────┐
             │ Find admin by   │
             │ _id in DB       │
             └──────┬──────┬───┘
                    │Not   │Found
                    │found │
                    │      │
                    ▼      ▼
                 ❌    ┌──────────────────┐
                 404   │ Check: is active?│
                       └──────┬───────┬───┘
                              │No     │Yes
                              │       │
                              ▼       ▼
                           ❌    ┌──────────────────┐
                           403   │ Check Permission │
                           Forbid│ For this action  │
                                 └──────┬───────┬───┘
                                        │No     │Yes
                                        │       │
                                        ▼       ▼
                                     ❌    ✅
                                     403   PROCEED
                                    Forbid
```

---

## Email Notification System

```
EVENT TRIGGERED
     │
     ├──────────────────────────────────────────┐
     │                                          │
     ▼                                          ▼
PASSWORD RESET REQUEST              SUBSCRIPTION CHANGED
     │                                    │
     ├─────────────────┐                 ├─────┬─────┬──────┐
     │                 │                 │     │     │      │
     ▼                 ▼                 ▼     ▼     ▼      ▼
 NEW ADMIN      PASSWORD               RENEWED EXPIRING FAILED
 WELCOME        RESET                             SOON     PAY
     │             │                       │       │       │
     │             │                       └───┬───┴───┬───┘
     │             │                           │       │
     ▼             ▼                           ▼       ▼
  ┌─────┐      ┌──────┐                  ┌────────┐ ┌────┐
  │HTML │      │HTML  │                  │HTML    │ │HTML│
  │TEMP │      │TEMP  │                  │TEMP    │ │TMP │
  └──┬──┘      └───┬──┘                  └────┬───┘ └─┬──┘
     │             │                          │      │
     │             │                          │      │
     └─────────────┼──────────────────────────┼──────┘
                   │                          │
                   └──────────────┬───────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Get Email Config:        │
                    │ SMTP_HOST                │
                    │ SMTP_PORT                │
                    │ SMTP_USER                │
                    │ SMTP_PASS                │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Create Nodemailer        │
                    │ Transport:               │
                    │ host: mail.smtp2go.com   │
                    │ port: 465                │
                    │ secure: true             │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Format Email:            │
                    │ • from: ReadyPips        │
                    │ • to: recipient         │
                    │ • subject: title        │
                    │ • html: template        │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Send via Gmail SMTP      │
                    │ briancreatives@gmail.com │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Log Result:              │
                    │ Success: ✅              │
                    │ Failed: ❌               │
                    │ Time: recorded           │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Record in Database:      │
                    │ • email_campaigns        │
                    │ • admin_audit_logs       │
                    └──────────────────────────┘
```

---

## Role-Based Access Control (RBAC)

```
                        REQUEST ARRIVES
                             │
                             ▼
                    ┌────────────────────┐
                    │ Verify JWT Token   │
                    │ Extract admin ID   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Load Admin from DB │
                    │ Get role & perms   │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────▼──────────────────────┐
        │                                            │
        ▼                                            ▼
    SUPER_ADMIN                                  ADMIN
   (ALL 17 PERMS)                           (15 PERMS)
        │                                       │
        ├─ view_users ✅                        ├─ view_users ✅
        ├─ create_user ✅                       ├─ create_user ✅
        ├─ edit_user ✅                         ├─ edit_user ✅
        ├─ delete_user ✅                       ├─ delete_user ✅
        ├─ view_admins ✅                       ├─ view_admins ✅
        ├─ create_admin ✅                      ├─ create_admin ✅
        ├─ edit_admin ✅                        ├─ edit_admin ✅
        ├─ delete_admin ✅                      ├─ delete_admin ✅
        ├─ view_subscriptions ✅                ├─ view_subscriptions ✅
        ├─ manage_subscriptions ✅              ├─ manage_subscriptions ✅
        ├─ manage_payments ✅                   ├─ manage_payments ✅
        ├─ view_tools ✅                        ├─ view_tools ✅
        ├─ manage_tools ✅                      ├─ manage_tools ✅
        ├─ view_analytics ✅                    ├─ view_analytics ✅
        ├─ manage_settings ✅                   ├─ manage_settings ✅
        ├─ view_logs ✅                         ├─ view_logs ✅
        └─ manage_roles ✅                      └─ manage_roles ❌
        
        MODERATOR
        (6 PERMS)
        │
        ├─ view_users ✅
        ├─ edit_user ✅ (limited)
        ├─ view_admins ✅
        ├─ view_subscriptions ✅
        ├─ view_tools ✅
        └─ view_analytics ✅

                    ┌──────────────────┐
                    │ Check Permission │
                    │ For action?      │
                    └────┬────────┬────┘
                         │        │
                    NO ◀─┘        └─▶ YES
                         │        │
                         ▼        ▼
                    ❌ 403       ✅ ALLOW
                    FORBIDDEN   ACTION
```

---

## Data Flow - User Management Example

```
ADMIN EDITS USER
       │
       ▼
┌────────────────────────┐
│ Click Edit Button      │
│ on User Row            │
└─────────┬──────────────┘
          │
┌─────────▼────────────────────┐
│ Modal Opens with User Data   │
│ • name                       │
│ • email                      │
│ • subscription               │
│ • last login                 │
└─────────┬────────────────────┘
          │
┌─────────▼────────────────────┐
│ Admin modifies fields        │
│ • Update name                │
│ • Change subscription        │
│ • Add notes                  │
└─────────┬────────────────────┘
          │
┌─────────▼────────────────────┐
│ Click Save Button            │
└─────────┬────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│ PUT /api/admin/users                   │
│ ├─ userId: ObjectId                    │
│ ├─ updates: {name, subscription, ...}  │
│ └─ token: JWT from cookies             │
└─────────┬──────────────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│ Middleware verifyAdmin()                │
│ ├─ Extract token                       │
│ ├─ Verify JWT signature                │
│ ├─ Find admin in DB                    │
│ ├─ Check isActive                      │
│ └─ Verify edit_user permission         │
└─────────┬──────────────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│ Update Logic:                          │
│ ├─ Find user in DB                     │
│ ├─ Verify user exists                  │
│ ├─ Prevent email change (security)     │
│ ├─ Add updatedAt timestamp             │
│ ├─ Add updatedBy admin ID              │
│ └─ Execute update query                │
└─────────┬──────────────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│ Audit Logging:                         │
│ ├─ Record admin action                 │
│ ├─ Log what changed                    │
│ ├─ Capture timestamp                   │
│ ├─ Record IP address                   │
│ └─ Store in audit_logs collection      │
└─────────┬──────────────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│ Return Response:                       │
│ ├─ Status: 200 OK                      │
│ ├─ Message: "User updated"             │
│ └─ Additional data                     │
└─────────┬──────────────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│ UI Updates:                            │
│ ├─ Show success toast                  │
│ ├─ Reload user data                    │
│ ├─ Update table row                    │
│ ├─ Close modal                         │
│ └─ Display updated info                │
└─────────────────────────────────────────┘
       SUCCESS ✅
```

---

## Database Collections Structure

```
MongoDB Database: readypips
│
├─ admins
│  ├─ _id: ObjectId
│  ├─ email: String (unique)
│  ├─ password: String (bcrypt)
│  ├─ firstName: String
│  ├─ lastName: String
│  ├─ role: Enum
│  ├─ permissions: Array
│  ├─ isActive: Boolean
│  ├─ lastLogin: Date
│  ├─ createdAt: Date
│  ├─ updatedAt: Date
│  └─ createdBy: ObjectId
│
├─ users
│  ├─ _id: ObjectId
│  ├─ email: String (unique)
│  ├─ firstName: String
│  ├─ lastName: String
│  ├─ subscription: Object
│  ├─ lastLogin: Date
│  ├─ isActive: Boolean
│  ├─ createdAt: Date
│  ├─ updatedAt: Date
│  └─ (more fields)
│
├─ subscriptions
│  ├─ _id: ObjectId
│  ├─ userId: ObjectId
│  ├─ planName: String
│  ├─ status: Enum
│  ├─ startDate: Date
│  ├─ expiryDate: Date
│  ├─ paymentMethod: String
│  ├─ amount: Number
│  ├─ createdAt: Date
│  └─ (more fields)
│
├─ tools
│  ├─ _id: ObjectId
│  ├─ name: String
│  ├─ description: String
│  ├─ category: String
│  ├─ version: String
│  ├─ enabled: Boolean
│  ├─ userCount: Number
│  ├─ popularity: Number
│  ├─ createdAt: Date
│  └─ (more fields)
│
├─ announcements
│  ├─ _id: ObjectId
│  ├─ title: String
│  ├─ content: String
│  ├─ type: String
│  ├─ status: String
│  ├─ createdAt: Date
│  └─ (more fields)
│
├─ email_campaigns
│  ├─ _id: ObjectId
│  ├─ subject: String
│  ├─ content: String
│  ├─ sentCount: Number
│  ├─ failedCount: Number
│  ├─ status: String
│  └─ (more fields)
│
├─ admin_audit_logs
│  ├─ _id: ObjectId
│  ├─ adminId: ObjectId
│  ├─ action: String
│  ├─ details: Object
│  ├─ ipAddress: String
│  ├─ userAgent: String
│  └─ createdAt: Date
│
└─ password_reset_tokens
   ├─ _id: ObjectId
   ├─ email: String
   ├─ token: String (JWT)
   ├─ type: Enum
   ├─ expiresAt: Date
   └─ createdAt: Date
```

---

**Architecture Diagram Complete** ✅

Generated: October 17, 2025  
System: ReadyPips Admin Dashboard v1.0
Status: 🟢 PRODUCTION READY
