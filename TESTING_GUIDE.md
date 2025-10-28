# 🧪 Ready Pips - Testing Guide

Quick reference for testing all implemented features.

---

## 🔐 Google Login Phone Number Enforcement

### Test Flow:
1. **Create test Google account** (or use existing without phone in DB)
2. **Login** via "Sign in with Google" button
3. **Expected:** Phone number modal appears immediately
4. **Cannot close** modal without adding phone
5. **Enter phone:** +254 712 345 678 (or any valid format)
6. **Submit** - should see success toast
7. **Page auto-reloads** with updated user data
8. **Login again** - modal should NOT appear
9. **Try to change phone** (via API) - should get 403 error

### API Test:
```bash
# First time (should work)
curl -X POST http://localhost:3000/api/auth/update-phone \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+254712345678"}'

# Second time (should fail with 403)
curl -X POST http://localhost:3000/api/auth/update-phone \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+254999999999"}'
```

**Expected Response:**
```json
{
  "error": "Phone number has already been set and cannot be changed"
}
```

---

## 💰 Pricing Display

### Check Pages:
- `/subscription`
- `/signals` (if pricing shown)

### Verify Values:
| Plan | USD | KES | Duration |
|------|-----|-----|----------|
| Weekly | $13 | KES 1,690 | 7 days |
| Monthly | $29 | KES 3,770 | 30 days |
| 3 Months | $79 | KES 10,270 | 90 days |

### Visual Checks:
- ✅ "Most Recommended" badge on Monthly
- ✅ "Save $8 vs monthly!" on 3 Months
- ✅ Both USD and KES shown together

---

## 🦶 Footer Presence

### Test Each Page:
```
✅ /signals
✅ /charts
✅ /copy-trading
✅ /subscription
```

### What to Check:
- Footer appears at bottom of page
- Contains company links/info
- Matches site styling (dark mode support)
- No layout breaks

---

## 👨‍💼 Admin Dashboard - Revenue

### Login as Admin:
```
Email: admin@readypips.com
Password: [admin password]
```

### Navigate to Dashboard:
`/admin/dashboard`

### Check Metrics Card:
**OLD (wrong):**
```
Revenue (Monthly): $199.94
Weekly: $0.00
```

**NEW (correct):**
```
Revenue (Monthly): $[REAL TOTAL FROM PAYMENTS]
Weekly: $[LAST 7 DAYS TOTAL]
```

### Verify Data Source:
Open browser DevTools → Network tab → Look for:
```
GET /api/admin/dashboard/stats
```

**Response should show:**
```json
{
  "stats": {
    "totalRevenue": 150.00,  // Real sum from payments
    "weeklyRevenue": 45.00,  // Last 7 days
    "dailyRevenue": 13.00    // Last 24 hours
  }
}
```

### Database Check (MongoDB):
```javascript
// Should match payments collection totals
db.payments.aggregate([
  { $match: { status: "completed" } },
  { $group: { 
    _id: null, 
    total: { $sum: { $toDouble: "$amount" } }
  }}
])
```

---

## 👥 Recent Users - Correct Plan Names

### Location:
`/admin/dashboard` → Scroll to "Recent Users" table

### Verify Mapping:
| Database Value | Display Value |
|----------------|---------------|
| `free` | Free Trial |
| `basic` | Weekly |
| `premium` | Monthly |
| `pro` | 3 Months |

### Check 5 Users:
- Each should show correct plan name in "Plan" column
- No "undefined" or raw database values

---

## 💳 Paid Users Sorted by Payment Date

### API Test:
```bash
curl http://localhost:3000/api/admin/dashboard/paid-users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "users": [
    {
      "userId": "...",
      "userName": "John Doe",
      "email": "john@example.com",
      "currentPlan": "Monthly",
      "latestPaymentDate": "2025-01-15T10:30:00Z",  // Most recent
      "latestPaymentAmount": "$29",
      "totalPaid": "87.00",  // Sum of all payments
      "paymentCount": 3
    },
    {
      "latestPaymentDate": "2025-01-14T08:20:00Z"  // Older
    }
    // ... more users sorted DESC by payment date
  ]
}
```

### Verification:
1. Only users with `status: "completed"` payments
2. Sorted by `latestPaymentDate` descending
3. Shows total revenue per user
4. Counts number of payments

---

## ✏️ Admin User Editing

### Test Flow:
1. **Login as admin** → `/admin/dashboard`
2. **Navigate to User Management** tab/section
3. **Find a user** in the table
4. **Click "Edit"** button
5. **Modal opens** with fields:
   - First Name
   - Last Name
   - Email
   - Phone Number
6. **Change values** (e.g., change firstName to "Updated")
7. **Click "Save"**
8. **Check toast** - should show success message
9. **Refresh page** - changes should persist
10. **Verify in database:**

```javascript
db.users.findOne({ email: "test@example.com" })
// Should show updated firstName
```

### API Test:
```bash
# Update user
curl -X PUT http://localhost:3000/api/admin/users/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "NewFirstName",
    "lastName": "NewLastName",
    "email": "newemail@example.com",
    "phoneNumber": "+254700000000"
  }'
```

---

## 🏠 Admin Homepage Button

### Test:
1. **Login as admin**
2. **Look at sidebar** - should see "Homepage" (not "Profile")
3. **Click "Homepage"**
4. **Should redirect to:** `/` (main website)
5. **Not:** `/admin/dashboard/profile`

---

## 🚪 Logout Redirect

### Test:
1. **Login as admin**
2. **Click "Logout"** button
3. **Should redirect to:** `/` (homepage)
4. **Not:** `/login`
5. **localStorage cleared:** Check DevTools → Application → Local Storage
6. **sessionStorage cleared:** Should be empty

---

## 📧 Email Sender Configuration

### Check Password Reset Email:
1. **Go to:** `/forgot-password`
2. **Enter email**
3. **Submit**
4. **Check inbox:**
   - From: **noreply@readypips.com**
   - Not: "test@gmail.com" or other addresses

### Verify in Code:
File: `/lib/email.ts` or similar

```typescript
const mailOptions = {
  from: 'noreply@readypips.com',  // ✅ Correct
  to: userEmail,
  subject: 'Password Reset',
  // ...
}
```

---

## 📊 Chart Integration (Verification)

### Test:
1. **Navigate to:** `/charts`
2. **Should see:** TradingView chart embed
3. **Check features:**
   - Real-time data loading
   - Timeframe selector (1m, 5m, 1h, 1d)
   - Technical indicators
   - Drawing tools
4. **No errors in console**

### Expected Components:
- TradingView widget loaded
- Chart renders properly
- Data updates in real-time

---

## 📡 Signals API (Verification)

### Test Endpoints:

#### GET Signals:
```bash
curl http://localhost:3000/api/signals \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected:**
```json
{
  "signals": [
    {
      "_id": "...",
      "pair": "EUR/USD",
      "type": "BUY",
      "entry": 1.0850,
      "stopLoss": 1.0820,
      "takeProfit": 1.0900,
      "status": "active",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### Create Signal (Admin Only):
```bash
curl -X POST http://localhost:3000/api/signals \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "GBP/USD",
    "type": "SELL",
    "entry": 1.2650,
    "stopLoss": 1.2680,
    "takeProfit": 1.2600
  }'
```

---

## 🎯 Complete Test Checklist

### Before Going Live:

- [ ] **Google Phone Enforcement**
  - [ ] Modal appears for Google users without phone
  - [ ] Cannot close modal without submitting
  - [ ] Phone saves to database
  - [ ] Cannot change phone after set (403 error)
  
- [ ] **Pricing Display**
  - [ ] Weekly: $13 / KES 1,690
  - [ ] Monthly: $29 / KES 3,770
  - [ ] 3 Months: $79 / KES 10,270
  
- [ ] **Footer Presence**
  - [ ] /signals
  - [ ] /charts
  - [ ] /copy-trading
  - [ ] /subscription
  
- [ ] **Admin Dashboard**
  - [ ] Revenue shows real data (not $199.94)
  - [ ] Weekly/Daily revenue calculated correctly
  - [ ] Recent Users show correct plan names
  - [ ] Paid users API works and sorts by date
  
- [ ] **Admin Features**
  - [ ] Can edit user firstName, lastName, email, phone
  - [ ] "Homepage" button redirects to /
  - [ ] Logout redirects to / (not /login)
  
- [ ] **Email Configuration**
  - [ ] Password reset from noreply@readypips.com
  
- [ ] **Integrations**
  - [ ] Charts load and display TradingView
  - [ ] Signals API returns data
  - [ ] Real-time updates work

---

## 🐛 Common Issues & Solutions

### Issue: Phone modal not appearing
**Solution:** Check browser console for errors, verify user has `googleId` in database

### Issue: Revenue still shows $199.94
**Solution:** Clear browser cache, check MongoDB has payments with `status: "completed"`

### Issue: Plan names show "undefined"
**Solution:** Verify users have `subscriptionType` field in database

### Issue: Footer not visible
**Solution:** Check page styling, ensure Footer component imported correctly

### Issue: Admin can't edit users
**Solution:** Verify admin token is valid, check network tab for API errors

---

## 📞 Support

If any test fails, check:
1. **Browser Console** - JavaScript errors
2. **Network Tab** - API response errors
3. **MongoDB** - Data structure matches expected format
4. **Server Logs** - Backend error messages

**All tests should PASS before production deployment!** ✅

---

**Last Updated:** January 2025  
**Status:** Ready for Testing
