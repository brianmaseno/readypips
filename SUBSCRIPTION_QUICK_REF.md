# Quick Reference: Subscription System

## Free Trial System
- **Duration:** 3 days from registration
- **Access:** Full premium features
- **After Expiration:** Must subscribe to continue

## Protected Pages (Require Active Subscription)
1. `/charts` - Trading charts
2. `/harmonic-analysis` - Pattern analysis
3. `/insights` - AI market insights
4. `/copy-trading` - Copy professional traders

## Subscription Status Check

```typescript
import { useRequireSubscription } from '@/hooks/use-subscription-access';

const subscriptionAccess = useRequireSubscription('/subscription');

// Returns:
{
  hasAccess: boolean,              // Can user access?
  loading: boolean,                // Still checking?
  daysRemaining: number,           // Days left
  isFreeTrial: boolean,            // On free trial?
  isFreeTrialExpired: boolean,     // Trial expired?
  isPaidSubscriptionExpired: boolean, // Paid expired?
  message: string                  // User message
}
```

## Database Fields

```javascript
{
  subscriptionType: "free" | "basic" | "premium" | "pro",
  subscriptionStatus: "active" | "expired",
  freeTrialEndDate: Date,          // 3 days from signup
  subscriptionEndDate: Date,       // For paid plans
  subscriptionStartDate: Date      // When paid plan started
}
```

## TradingView Real-Time Widget

```tsx
// Standard Widget (auto real-time)
import TradingViewWidget from '@/components/tradingview-widget';

<TradingViewWidget 
  symbol="OANDA:XAUUSD"
  isFullscreen={false}
/>

// Advanced Widget (customizable)
import TradingViewAdvancedWidget from '@/components/tradingview-advanced-widget';

<TradingViewAdvancedWidget
  symbol="OANDA:XAUUSD"
  interval="5"
  timezone="Africa/Nairobi"
  theme="dark"
  allow_symbol_change={true}
/>
```

## User Flow

### New User (Free Trial)
1. Signs up → Gets 3-day trial
2. Days 1-3 → Full access ✅
3. Day 4+ → Blocked, must subscribe ❌

### Paid Subscriber
1. Subscribes → Immediate access ✅
2. During period → Full access ✅
3. After expiration → Blocked, must renew ❌

## Admin Panel Change
- ✅ Removed "Admin Panel" text from sidebar
- Now shows only logo for cleaner look

---

**Quick Test:**
1. Create new account → Check access to charts
2. Wait/simulate 4 days → Should be blocked
3. Subscribe → Access restored
4. Charts should show real-time data with auto-refresh
