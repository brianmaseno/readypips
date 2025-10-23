# Production Subscription System Setup

## ✅ Features Implemented

### 1. **Database Updates on Payment Success**
   - Webhook automatically updates user subscription in database when payment is completed
   - Sets `subscriptionStatus` to `"active"`
   - Sets `subscriptionType` based on plan (weekly=basic, monthly=premium, 3months=pro)
   - Calculates and stores `subscriptionEndDate` based on plan duration

### 2. **Subscription Countdown & Expiry Tracking**
   - Real-time countdown shows days and hours remaining
   - Automatic expiry check when user accesses subscription status
   - Warning notifications when subscription is expiring soon (< 7 days)
   - Automatic status change from "active" to "expired" when time runs out

### 3. **Production-Ready APIs**

#### `/api/subscriptions/status` (GET)
Get current user's subscription status with countdown
```bash
Authorization: Bearer <token>
```

Response:
```json
{
  "subscription": {
    "status": "active",
    "type": "premium",
    "endDate": "2025-11-22T00:00:00.000Z",
    "daysRemaining": 30,
    "hoursRemaining": 720,
    "isExpiringSoon": false,
    "isExpired": false,
    "isActive": true
  }
}
```

#### `/api/subscriptions/check-expired` (POST)
**Cron job endpoint** - checks and expires all subscriptions past their end date
```bash
Authorization: Bearer <CRON_SECRET>
```

Response:
```json
{
  "success": true,
  "message": "Expired 5 subscriptions",
  "count": 5,
  "details": [...]
}
```

#### `/api/subscriptions/check-expired` (GET)
**Testing endpoint** - shows users with expiring/expired subscriptions without making changes

## 🚀 Deployment Steps for Production

### Step 1: Environment Variables
Update your `.env` file with production settings:

```env
# PRODUCTION MODE - Real payments
PESAPAL_TEST_MODE=false

# Add cron secret for automated expiry checks
CRON_SECRET=your-secure-random-string-here
```

### Step 2: Set Up Cron Job
You need to automatically check for expired subscriptions daily. Choose one method:

#### **Option A: Vercel Cron Jobs** (Recommended if using Vercel)
Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/subscriptions/check-expired",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Add this header to cron request:
```
Authorization: Bearer YOUR_CRON_SECRET
```

#### **Option B: External Cron Service** (cron-job.org, EasyCron, etc.)
1. Go to https://cron-job.org (or similar service)
2. Create new cron job:
   - URL: `https://your-domain.com/api/subscriptions/check-expired`
   - Method: POST
   - Schedule: Daily at midnight (0 0 * * *)
   - Headers:
     ```
     Authorization: Bearer YOUR_CRON_SECRET
     Content-Type: application/json
     ```

#### **Option C: Node-cron** (If self-hosting)
Install: `npm install node-cron`

Create `lib/cron.ts`:
```typescript
import cron from 'node-cron';

export function startCronJobs() {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const response = await fetch('https://www.readypips.com/api/subscriptions/check-expired', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('✅ Cron job completed:', data);
    } catch (error) {
      console.error('❌ Cron job failed:', error);
    }
  });
}
```

Call in your app initialization.

### Step 3: Add Subscription Countdown to Dashboard

Update your dashboard page to show the countdown:

```tsx
import { SubscriptionCountdown } from "@/components/subscription-countdown";

export default function DashboardPage() {
  const token = localStorage.getItem("token");
  
  return (
    <div>
      {/* Other dashboard content */}
      
      <SubscriptionCountdown token={token} />
      
      {/* Rest of dashboard */}
    </div>
  );
}
```

### Step 4: Test the System

1. **Test Subscription Creation**:
   ```bash
   # Make a test payment (it will use real amount since TEST_MODE=false)
   # Go to /subscription and complete checkout
   ```

2. **Verify Database Update**:
   ```bash
   # Check MongoDB that user has:
   # - subscriptionStatus: "active"
   # - subscriptionType: "basic" | "premium" | "pro"
   # - subscriptionEndDate: future date
   ```

3. **Test Countdown Display**:
   ```bash
   # Go to dashboard
   # Should show days/hours remaining
   ```

4. **Test Expiry Check** (Manual):
   ```bash
   curl https://your-domain.com/api/subscriptions/check-expired \\
     -X GET
   ```

5. **Test Auto-Expiry**:
   ```bash
   # Manually set a user's subscriptionEndDate to past date in MongoDB
   # Visit dashboard or call /api/subscriptions/status
   # Should auto-update to "expired" status
   ```

## 📊 Plan Mapping

| Plan ID | Duration | Subscription Type | Price (KES) |
|---------|----------|-------------------|-------------|
| weekly  | 7 days   | basic            | 1,690       |
| monthly | 30 days  | premium          | 3,770       |
| 3months | 90 days  | pro              | 10,270      |

## 🔔 User Notifications

The system provides automatic notifications:
- ✅ **Active**: Green badge, shows countdown
- ⚠️ **Expiring Soon** (< 7 days): Yellow badge, warning message
- ❌ **Expired**: Red badge, renew button

## 🛡️ Security Notes

1. **CRON_SECRET**: Use a strong random string (32+ characters)
2. **Webhook Validation**: PesaPal webhooks are processed without signature validation (PesaPal doesn't use signatures)
3. **Token Auth**: All subscription APIs require Bearer token authentication
4. **Auto-Expiry**: Users cannot access premium features after expiration

## 📝 Database Schema

Users collection should have:
```typescript
{
  subscriptionStatus: "active" | "inactive" | "expired",
  subscriptionType: "basic" | "premium" | "pro" | null,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  updatedAt: Date
}
```

## 🎯 Production Checklist

- [x] Turn off TEST_MODE
- [x] Update webhook to save subscription data
- [x] Create expiry check endpoint
- [x] Create countdown component
- [x] Set up cron job
- [ ] Add CRON_SECRET to .env
- [ ] Configure cron service
- [ ] Test full payment flow
- [ ] Monitor webhook logs
- [ ] Set up email notifications for expiring subscriptions (optional)

## 📞 Support

If you need to manually update a user's subscription:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      subscriptionStatus: "active",
      subscriptionType: "premium",
      subscriptionEndDate: new Date("2025-12-31"),
      updatedAt: new Date()
    }
  }
)
```
