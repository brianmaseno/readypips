# 🚀 ReadyPips - Getting Started Guide

## Quick Start (5 minutes)

### Step 1: Start the Development Server
```bash
cd ready-pips-main-main
pnpm dev
# or
npm run dev
```

**Output should show:**
```
✓ Starting...
✓ Ready in 4.7s
Local: http://localhost:3001
```

### Step 2: Open in Browser
```
http://localhost:3001
```

You should see the ReadyPips homepage with:
- Navigation bar with Signals Tool, Copy Trading, Charts, and **More**
- Hero section
- Features overview
- Call-to-action buttons

---

## 🎯 First-Time User Journey

### 1. Create Account
1. Click **"Sign Up"** button in navbar
2. Enter:
   - First Name
   - Last Name
   - Email
   - Password (6+ characters)
3. Click **"Create Account"**
4. Check your email for verification link
5. Click verification link in email
6. ✅ Email verified!

### 2. Login
1. Go to `http://localhost:3001/login`
2. Enter email and password
3. Click **"Login"**
4. ✅ You're logged in!
5. Automatically redirected to dashboard

### 3. Choose Subscription
1. Click **"Subscription"** in navbar
2. View 4 subscription options:
   - Weekly: $13
   - Monthly: $29 (Popular)
   - 3 Months: $79
   - 6 Months: $149
3. Click **"Get Started"** on desired plan
4. Follow payment process (Stripe, Paystack, or PesaPal)
5. ✅ Subscription active!

### 4. Explore Features
- **Signals Tool**: View trading signals
- **Copy Trading**: Copy expert traders
- **Charts**: Interactive market charts
- **Insights**: AI-powered analysis
- **Dashboard**: Overview of everything

---

## 🔑 Key Features to Explore

### 📊 Trading Signals (`/signals`)
```
1. Go to http://localhost:3001/signals
2. View real-time trading signals
3. Each signal shows:
   - Symbol (EURUSD, XAUUSD, etc.)
   - Entry price
   - Stop Loss
   - Take Profit
   - Confidence level
   - Risk level
```

### 📈 Charts (`/charts`)
```
1. Go to http://localhost:3001/charts
2. Select symbol from dropdown
3. View TradingView interactive chart
4. See real-time price data
5. Use technical analysis tools
6. Zoom and pan on chart
```

### 💡 AI Insights (`/insights`)
```
1. Go to http://localhost:3001/insights
2. Select a symbol
3. Click "Generate AI Insight"
4. Wait for Gemini API to process
5. View:
   - Market sentiment
   - Technical analysis
   - Trading recommendation
   - Risk assessment
   - Entry/SL/TP levels
```

### 📰 Market News
```
1. Go to http://localhost:3001/news
2. View latest financial news
3. Filter by symbol
4. Read headlines and summaries
5. Click to read full articles
```

---

## ✨ NEW Features

### 1️⃣ More Dropdown Menu
**Location**: Navigation bar (after Charts)
```
Click "More" dropdown to see:
- FAQs
- Testimonials
- Privacy Policy
- Terms & Conditions
```

### 2️⃣ FAQs Page (`/faqs`)
```
10 common questions answered:
- What are trading signals?
- How accurate are they?
- How do I receive signals?
- Can I cancel anytime?
- And more...

Each section is expandable
```

### 3️⃣ Testimonials Page (`/testimonials`)
```
8 user testimonials with:
- 5-star ratings
- User testimonial text
- User names and roles
- Professional card layout

Shows real user experiences
```

### 4️⃣ Privacy Policy Page (`/privacy-policy`)
```
Comprehensive privacy information:
- Data collection practices
- How we use your data
- Data security measures
- Policy updates
- Contact information
```

### 5️⃣ Terms & Conditions Page (`/terms-conditions`)
```
Complete terms of service:
- User agreement
- License terms
- Risk disclaimers
- Subscription terms
- Investment warnings
- Contact information
```

### 6️⃣ Floating WhatsApp Button
```
Available on all pages:
- Fixed at bottom-right corner
- Green button with WhatsApp icon
- Click to open WhatsApp Web
- Phone: +254 728 747 441
- Pre-filled message

Always available for support
```

### 7️⃣ Updated Pricing
```
4 subscription tiers:
✅ Weekly ($13/week)
✅ Monthly ($29/month) - Popular
✅ 3 Months ($79)
✅ 6 Months ($149)

✅ NO Annual plan (removed)
```

---

## 📱 Testing on Mobile

### Access Mobile Version
1. Open browser DevTools (F12 or Cmd+Shift+I)
2. Click responsive design mode
3. Select mobile device
4. View should adapt automatically

### Mobile Features
✅ Navigation hamburger menu
✅ "More" items in mobile menu
✅ All pages responsive
✅ WhatsApp button visible
✅ Charts work on mobile
✅ Signals readable on small screens

---

## 🔐 Testing Authentication

### Create Test Account
```
Email: testuser@example.com
Password: Test123456
First Name: Test
Last Name: User
```

### Test Session Persistence
```
1. Login with test account
2. Go to any page
3. Refresh page (Ctrl+R)
4. You should stay logged in!
5. ✅ Token persisted in localStorage
```

### Test Auto-Redirect
```
1. Login at /login
2. System redirects to /signals (or previous page)
3. ✅ Redirect working correctly
```

---

## 🎮 Interactive Testing

### Test Navigation
```
1. Click "More" dropdown
2. Select each option
3. Verify pages load
4. Check footer appears
5. Try mobile menu
```

### Test WhatsApp
```
1. Scroll to bottom of page
2. Click green WhatsApp button
3. Browser opens new tab
4. WhatsApp Web loads
5. Message pre-filled
6. Can send message directly
```

### Test Market Data
```
1. Go to /charts
2. Select different symbols:
   - EURUSD (Forex)
   - XAUUSD (Gold)
   - BTCUSD (Bitcoin)
   - AAPL (Stock)
3. View real-time price data
4. Check technical indicators update
```

### Test AI Analysis
```
1. Go to /insights
2. Enter symbol: EURUSD
3. Click "Generate AI Insight"
4. Wait for Gemini API response
5. View sentiment analysis
6. See trading recommendation
```

---

## 🐛 Troubleshooting

### Issue: Can't access localhost:3001
**Solution**: 
- Make sure `npm run dev` is still running
- Check terminal for errors
- Try `npm run dev` again

### Issue: "Please verify your email" error
**Solution**:
- Check email inbox for verification link
- Click verification link
- If link expired, go to login and click "Resend verification"

### Issue: Charts not loading
**Solution**:
- Check browser console for errors (F12)
- Verify symbol format is correct
- Check API rate limits
- Try different symbol

### Issue: WhatsApp button not visible
**Solution**:
- Scroll down to bottom of page
- Check if using mobile browser
- Clear browser cache
- Refresh page

### Issue: Server won't start
**Solution**:
- Check if port 3001 is in use
- Check Node.js is installed: `node --version`
- Check npm is installed: `npm --version`
- Delete node_modules: `rm -r node_modules`
- Reinstall: `npm install`

---

## 📊 Dashboard Breakdown

Once logged in, the dashboard shows:

### Top Section
- Welcome message
- User credit balance
- Subscription status
- Quick actions

### Trading Signals Section
- Latest signals
- Symbol and direction
- Entry/SL/TP levels
- Confidence score
- Time created

### Market Overview
- Top movers
- Market sentiment
- Economic calendar
- Trending symbols

### Activity History
- Recent trades
- Signal performance
- Historical data
- Analytics

---

## 🔑 Important URLs

| Page | URL | Status |
|------|-----|--------|
| Home | / | ✅ |
| Login | /login | ✅ |
| Register | /register | ✅ |
| Dashboard | /dashboard | ✅ (Login required) |
| Signals | /signals | ✅ (Login required) |
| Charts | /charts | ✅ (Login required) |
| Insights | /insights | ✅ (Login required) |
| FAQs | /faqs | ✅ NEW |
| Testimonials | /testimonials | ✅ NEW |
| Privacy | /privacy-policy | ✅ NEW |
| Terms | /terms-conditions | ✅ NEW |

---

## ⚙️ Settings & Profile

### Update Profile
1. Click profile icon (top-right)
2. Select "Settings"
3. Update:
   - Name
   - Email
   - Password
   - Preferences
4. Click "Save"

### Subscription Management
1. Click profile icon
2. Select "Subscription"
3. View current plan
4. Upgrade/downgrade plan
5. Cancel subscription
6. View usage

### Account Security
1. Click profile icon
2. Select "Security"
3. Change password
4. Enable 2FA (if available)
5. View login history
6. Manage sessions

---

## 💬 Get Support

### Using WhatsApp
1. Click floating WhatsApp button
2. Opens WhatsApp Web
3. Send message to +254 728 747 441
4. Get support directly

### Using Email
- briancreatives@gmail.com
- Support team responds within 24 hours

### Using FAQs
- Go to /faqs
- Find common questions
- Most issues addressed

---

## 🎯 Next Steps

1. **Create Account**: Sign up and verify email
2. **Choose Plan**: Select subscription tier
3. **Explore Features**: Check out signals, charts, insights
4. **Read Documentation**: Visit FAQs and tutorials
5. **Contact Support**: Use WhatsApp for help
6. **Start Trading**: Execute trades based on signals

---

## 📚 Learning Resources

### In-App Documentation
- FAQs page: `/faqs`
- Testimonials: `/testimonials`
- Privacy: `/privacy-policy`
- Terms: `/terms-conditions`

### External Resources
- Alpha Vantage Docs: https://www.alphavantage.co
- News API: https://newsapi.org
- TradingView: https://tradingview.com

---

## ✅ Verification Checklist

Before you start trading:
- [ ] Account created and email verified
- [ ] Logged in successfully
- [ ] Subscription plan chosen
- [ ] Payment completed
- [ ] Dashboard accessible
- [ ] Trading signals visible
- [ ] Charts displaying correctly
- [ ] AI insights working
- [ ] Email notifications received
- [ ] Support accessible

---

## 🎉 You're All Set!

You now have access to:
✅ Real-time trading signals
✅ AI-powered market analysis
✅ Interactive charts
✅ Market news and sentiment
✅ Professional support
✅ Multiple subscription options
✅ Mobile-friendly platform
✅ Comprehensive documentation

**Enjoy exploring ReadyPips! Happy Trading! 📈🚀**

---

**Last Updated**: October 16, 2025
**Version**: 1.0.0
**Support**: +254 728 747 441 (WhatsApp)
