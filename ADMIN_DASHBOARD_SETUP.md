# ReadyPips Admin Dashboard System 🎯

A comprehensive, professional admin dashboard system with role-based access control, complete user/admin management, and analytics.

## 📋 Features

### ✅ Core Admin Features
- **🔐 Super Admin Role**: Full system access and permissions
- **👨‍💼 Admin Role**: User management, subscriptions, analytics
- **👮 Moderator Role**: Limited user management and viewing
- **📊 Audit Logging**: Track all admin actions
- **🔑 Password Reset**: For both users and admins
- **🛡️ Secure Authentication**: JWT-based token system

### 📊 Dashboard Sections

#### 1. **Dashboard Overview** (`dashboard-overview.tsx`)
- Total subscribers (active, expired, trials)
- Revenue metrics (daily, weekly, monthly)
- Tool access statistics
- System uptime monitoring
- Support tickets count
- Recent subscriptions table
- Quick status cards

#### 2. **User Management** (`user-management.tsx`)
- User directory with search/filter
- Subscription status tracking
- TradingView username linking
- Grant/revoke indicator access
- Extend subscriptions
- Login/usage logs
- KYC verification status

#### 3. **Subscription Management** (`subscription-management.tsx`)
- Active subscriptions overview
- Payment transaction history
- Revenue analytics
- Plan manager (add/edit/delete)
- Refunds and failed payments
- Coupon & discount manager
- Renewal automation

#### 4. **Tools Management** (`tools-management.tsx`)
- Tool library with descriptions
- Version control
- Access mapping to plans
- Usage statistics
- Most popular indicators ranking
- Tool category organization

#### 5. **Admin Management** (`admin-management.tsx`)
- Create/Edit/Delete admins
- Role assignment (Super Admin, Admin, Moderator)
- Activity tracking (last login)
- Permission management
- Status toggling (active/inactive)

#### 6. **Analytics** (`analytics.tsx`)
- Subscription growth charts
- Revenue trends
- Churn rate monitoring
- Retention cohorts
- Conversion funnel
- Active users per day
- Most used tools

#### 7. **System Settings** (`system-settings.tsx`)
- **General Settings**: Platform name, colors, logo
- **Payment Gateway**: M-Pesa, Stripe, PayPal configuration
- **Email Templates**: SMTP settings, template editor
- **Security & Logs**: 2FA, session timeout, audit trails
- **API Keys**: TradingView, Alpha Vantage, Mailchimp integration

## 🚀 Getting Started

### Step 1: Create Default Super Admin

Run the seeder script to create a default super admin:

```bash
# Using Node.js directly
node scripts/seed-admin.js

# Or using npm
npm run seed:admin
```

**Output will contain:**
- Email: `admin@readypips.com`
- Temporary Password: (generated randomly)
- Instructions to reset password on first login

### Step 2: Update package.json

Add the seed script to `package.json`:

```json
{
  "scripts": {
    "seed:admin": "node scripts/seed-admin.js"
  }
}
```

### Step 3: Login to Admin Dashboard

1. Navigate to `/admin/login`
2. Enter credentials from seeder output
3. Change password on first login
4. Access full dashboard at `/admin/dashboard`

## 🗂️ File Structure

```
app/
├── admin/
│   ├── dashboard/
│   │   ├── page.tsx                    # Main dashboard
│   │   └── components/
│   │       ├── admin-sidebar.tsx       # Navigation sidebar
│   │       ├── dashboard-overview.tsx  # Stats & overview
│   │       ├── user-management.tsx     # User CRUD
│   │       ├── subscription-management.tsx
│   │       ├── tools-management.tsx
│   │       ├── admin-management.tsx    # Admin CRUD
│   │       ├── analytics.tsx           # Charts & analytics
│   │       └── system-settings.tsx     # Configuration
│   ├── login/
│   │   └── page.tsx                    # Admin login
│   ├── forgot-password/
│   │   └── page.tsx                    # Forgot password
│   └── reset-password/
│       └── page.tsx                    # Reset password form
│
├── api/admin/
│   ├── login/
│   │   └── route.ts                    # Admin authentication
│   ├── profile/
│   │   └── route.ts                    # Get admin profile
│   ├── request-password-reset/
│   │   └── route.ts                    # Request reset token
│   ├── reset-password/
│   │   └── route.ts                    # Confirm password reset
│   ├── admins/
│   │   ├── route.ts                    # List & create admins
│   │   └── [id]/
│   │       └── route.ts                # Get, update, delete admin
│   └── dashboard/
│       ├── stats/
│       │   └── route.ts                # Dashboard statistics
│       └── recent-subscriptions/
│           └── route.ts                # Recent subscriptions
│
lib/
├── admin.ts                            # Admin auth functions
├── auth.ts                             # User auth (existing)
├── mongodb.ts                          # DB connection (existing)
└── email-service.ts                    # Email (existing)

scripts/
└── seed-admin.js                       # Create default admin
```

## 🔐 Role-Based Permissions

### Super Admin
- Full system access
- All permissions enabled
- Can create/delete other super admins
- View all audit logs

### Admin
- User management (view, create, edit, delete)
- Subscription management
- Tools viewing
- Analytics access
- Viewing other admins

### Moderator
- View users
- Edit user details (limited)
- View subscriptions
- View analytics

## 📱 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/request-password-reset` - Request reset token
- `POST /api/admin/reset-password` - Confirm password reset
- `GET /api/admin/profile` - Get current admin profile

### Admin Management
- `GET /api/admin/admins` - List all admins
- `POST /api/admin/admins` - Create admin
- `GET /api/admin/admins/[id]` - Get admin details
- `PUT /api/admin/admins/[id]` - Update admin
- `DELETE /api/admin/admins/[id]` - Delete admin

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/recent-subscriptions` - Recent subs

## 🔑 Key Technologies

- **Next.js 14** - Framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## 🛡️ Security Features

✅ **Password Security**
- Bcrypt hashing (12 rounds)
- Minimum 8 characters
- Password reset tokens (1-hour expiry)

✅ **Authentication**
- JWT tokens (7-day expiry)
- HttpOnly cookies
- Token verification on every request

✅ **Authorization**
- Role-based access control
- Permission checking
- Action audit logging

✅ **Data Protection**
- Passwords never returned in responses
- Sensitive fields excluded from queries
- HTTPS ready (secure cookies)

## 📊 Database Collections

### `admins`
```json
{
  "_id": ObjectId,
  "email": "string",
  "password": "hashed_string",
  "firstName": "string",
  "lastName": "string",
  "role": "super_admin|admin|moderator",
  "permissions": ["string"],
  "isActive": boolean,
  "lastLogin": Date,
  "createdAt": Date,
  "updatedAt": Date,
  "createdBy": ObjectId
}
```

### `password_reset_tokens`
```json
{
  "_id": ObjectId,
  "email": "string",
  "token": "string",
  "type": "user|admin",
  "expiresAt": Date,
  "createdAt": Date
}
```

### `admin_audit_logs`
```json
{
  "_id": ObjectId,
  "adminId": ObjectId,
  "action": "string",
  "details": {},
  "ipAddress": "string",
  "userAgent": "string",
  "createdAt": Date
}
```

## 🎨 UI Components

All components use **Tailwind CSS** with consistent styling:
- Responsive grids and layouts
- Gradient backgrounds
- Hover states and transitions
- Icons and emojis for quick identification
- Professional color scheme (blue/purple gradients)

## 💡 Usage Examples

### Login Admin
```typescript
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@readypips.com',
    password: 'password123'
  })
});
```

### Create New Admin
```typescript
const response = await fetch('/api/admin/admins', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email: 'newadmin@readypips.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    password: 'SecurePass123!'
  })
});
```

### Request Password Reset
```typescript
const response = await fetch('/api/admin/request-password-reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@readypips.com'
  })
});
```

## ⚡ Performance Optimizations

- Client-side token caching (localStorage)
- Lazy loading of components
- Efficient API calls with proper error handling
- Responsive design for all screen sizes
- Loading states and spinners
- Toast notifications for user feedback

## 🐛 Troubleshooting

### Admin can't login
- Ensure seeder script has been run
- Check email and password are correct
- Verify admin is active in database
- Check JWT_SECRET is set in environment

### Password reset not working
- Verify email service is configured
- Check NEXT_PUBLIC_APP_URL is set
- Ensure reset tokens are stored in MongoDB
- Check email templates exist

### Permissions not working
- Verify admin role in database
- Check permission list matches AdminPermission enum
- Clear browser cache and re-login
- Review audit logs for failed actions

## 📞 Support

For issues or questions about the admin system:
- Check audit logs for error details
- Review browser console for client errors
- Check server logs for API errors
- Verify all environment variables are set

## 🔄 Next Steps

1. **User Management API**: Connect to real user database
2. **Subscription APIs**: Fetch actual subscription data
3. **Email Templates**: Customize welcome, reset, confirmation emails
4. **2FA**: Implement two-factor authentication
5. **Backup/Restore**: Add database backup functionality
6. **Advanced Analytics**: Real-time data with WebSockets
7. **Mobile App**: Admin dashboard mobile version

---

**Last Updated**: October 2025
**Version**: 1.0.0
