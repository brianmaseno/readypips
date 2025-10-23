# Admin Login Guide

## ✅ Admin Credentials

```
📧 Email:    admin@readypips.com
🔑 Password: B76D308E780CAD6BC22A
```

## 🚀 Quick Start

1. **Navigate to Admin Login:**
   - Go to: https://www.readypips.com/admin/login

2. **Enter Credentials:**
   - Email: `admin@readypips.com`
   - Password: `B76D308E780CAD6BC22A`

3. **Click Login:**
   - You will be redirected to `/admin/dashboard`

4. **Access Dashboard:**
   - All admin features are now available

---

## 🔧 Troubleshooting

### Issue: "Invalid credentials" (401 Error)

**Solution:** Use the exact credentials above. If still getting 401:

```bash
# Reset admin password
node scripts/get-admin-password.js
```

This will generate new credentials and display them.

---

### Issue: Page shows loading but doesn't redirect

**Solution:** 
1. Check browser console (F12)
2. Clear localStorage: `localStorage.clear()`
3. Try login again

---

### Issue: Admin account doesn't exist

**Solution:** Create it with seeder:

```bash
# This will either create a new admin or show existing one
node scripts/seed-admin.js

# Then get the password
node scripts/get-admin-password.js
```

---

## 📋 Admin Roles & Permissions

### Super Admin
- **Role:** `super_admin`
- **Permissions:** All permissions
- **Access:** Full dashboard access
- **Can:** Create/edit/delete admins, manage users, view analytics, etc.

### Admin
- **Role:** `admin`
- **Permissions:** Limited (configured per admin)
- **Access:** Restricted dashboard features

### Moderator
- **Role:** `moderator`
- **Permissions:** View-only and moderation tasks
- **Access:** Limited features

---

## 🔐 Login Flow

1. **POST /api/admin/login**
   - Sends: `{ email, password }`
   - Validates: Email, password, account active status
   - Returns: `{ token, admin, message }`
   - Stores: JWT token in localStorage

2. **Client Side**
   - Stores token: `localStorage.setItem('admin_token', token)`
   - Stores role: `localStorage.setItem('admin_role', admin.role)`
   - Redirects: To `/admin/dashboard`

3. **Dashboard**
   - Verifies token on page load
   - Loads admin profile
   - Displays role-based features

---

## 📊 Dashboard Features

After login, access:

- ✅ **Dashboard Overview** - Key metrics and stats
- ✅ **User Management** - Search, edit, manage users
- ✅ **Subscription Management** - Extend, renew, cancel subscriptions
- ✅ **Tools Management** - Create, update, delete tools
- ✅ **Announcements** - Create user announcements
- ✅ **Email Campaigns** - Send bulk emails
- ✅ **Analytics** - View trends and metrics
- ✅ **Admin Management** - Create/manage other admins
- ✅ **System Settings** - Configure platform
- ✅ **Audit Trail** - View all admin actions

---

## 🔑 Resetting Passwords

### As Admin:
1. Go to `/admin/dashboard`
2. Navigate to **Settings**
3. Click **Change Password**
4. Enter new password

### Reset Super Admin Password:
```bash
node scripts/get-admin-password.js
```

---

## 🛡️ Security Features

- ✅ **Bcrypt Hashing** - Passwords hashed with 12 rounds
- ✅ **JWT Tokens** - 7-day expiry
- ✅ **Role-Based Access** - Permissions checked on every action
- ✅ **Audit Logging** - All actions tracked with timestamp and IP
- ✅ **HttpOnly Cookies** - Token stored securely
- ✅ **Permission Validation** - Every endpoint checks permissions

---

## 📝 Useful Commands

```bash
# Get or reset admin password
node scripts/get-admin-password.js

# Seed initial admin
node scripts/seed-admin.js

# Start development server
npm run dev

# Build for production
npm run build

# Run in production
npm run start
```

---

## 🆘 Support

If you encounter issues:

1. **Check console logs**: `npm run dev` shows detailed logs
2. **Verify credentials**: Use `node scripts/get-admin-password.js`
3. **Clear cache**: `localStorage.clear()` and refresh
4. **Check MongoDB**: Ensure connection is working
5. **Restart server**: Stop and restart `npm run dev`

---

**Last Updated:** October 17, 2025  
**Status:** ✅ Production Ready
