# ReadyPips - Quick Reference Guide

## 🚀 Getting Started

### 1. Start the Development Server
```bash
cd ready-pips-main-main
pnpm dev
```
Server runs on: `http://localhost:3001`

### 2. Access the Application
- **Homepage**: `http://localhost:3001`
- **Login**: `http://localhost:3001/login`
- **Register**: `http://localhost:3001/register`
- **Dashboard**: `http://localhost:3001/dashboard` (requires login)

## 🧪 Testing Authentication

### Test Login
```bash
# Navigate to http://localhost:3001/login
Email: test@example.com
Password: password123
```

### Test Registration
```bash
# Navigate to http://localhost:3001/register
Fill in the form and submit
Check email for verification link
```

## 📊 Testing Features

### Test Charts
1. Go to `http://localhost:3001/charts`
2. Select a symbol from the dropdown (EURUSD, XAUUSD, etc.)
3. View live TradingView chart

### Test Signals
1. Go to `http://localhost:3001/signals`
2. View real-time trading signals
3. Check signal details (entry, stop loss, take profit)

### Test AI Insights
1. Go to `http://localhost:3001/insights`
2. Select a symbol
3. Click "Generate AI Insight"
4. Wait for Gemini API to process

### Test News
1. Go to `http://localhost:3001/news`
2. View latest market news
3. Filter by symbol

## 📝 API Testing

### Test Health Check
```bash
curl http://localhost:3001/api/health
```

### Test Market Data
```bash
curl "http://localhost:3001/api/market-data?symbol=EURUSD"
```

### Test News
```bash
curl "http://localhost:3001/api/news?symbol=EURUSD"
```

### Test Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response will include JWT token
```

## 🔑 Key Files

### Configuration
- `.env` - Environment variables and API keys
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Core Components
- `components/auth-context.tsx` - Authentication context
- `components/navigation.tsx` - Main navigation bar
- `components/floating-whatsapp.tsx` - WhatsApp button
- `app/layout.tsx` - Root layout

### Pages
- `app/dashboard/page.tsx` - Dashboard
- `app/charts/page.tsx` - Charts page
- `app/signals/page.tsx` - Signals page
- `app/insights/page.tsx` - AI insights
- `app/faqs/page.tsx` - FAQs
- `app/testimonials/page.tsx` - Testimonials
- `app/privacy-policy/page.tsx` - Privacy policy
- `app/terms-conditions/page.tsx` - Terms & conditions

### API Routes
- `app/api/auth/` - Authentication endpoints
- `app/api/market-data/` - Market data endpoints
- `app/api/signals/` - Trading signals endpoints
- `app/api/news/` - News endpoints
- `app/api/ai-insights/` - AI insights endpoints
- `app/api/payments/` - Payment endpoints

### Utilities
- `lib/auth.ts` - Authentication utilities
- `lib/mongodb.ts` - MongoDB connection
- `lib/prisma.ts` - Prisma ODM interface
- `lib/alpha-vantage-service.ts` - Alpha Vantage API service
- `lib/email-service.ts` - Email service (SMTP)
- `lib/signal-service.ts` - Trading signal service

## 🐛 Common Issues & Solutions

### Issue: "Port 3000 already in use"
**Solution**: App automatically uses port 3001 instead

### Issue: "Cannot connect to MongoDB"
**Solution**: 
1. Check MONGODB_URI in .env is correct
2. Verify IP address is whitelisted in MongoDB Atlas
3. Check internet connection

### Issue: "Email not sending"
**Solution**:
1. Verify SMTP credentials in .env
2. Check if Gmail app password is correct
3. Allow "Less secure apps" in Gmail settings (if needed)

### Issue: "API returning 401 Unauthorized"
**Solution**:
1. Ensure you're logged in
2. Include Authorization header: `Bearer <token>`
3. Check if token is expired

### Issue: "Charts not loading"
**Solution**:
1. Check TradingView widget script loads correctly
2. Verify symbol format is correct
3. Check browser console for errors

## 💾 Database Commands

### Connect to MongoDB Atlas
```
Connection String: mongodb+srv://brianmayoga_db_user:zQAeEN1P4xeCsZk0@readypips.wzegbim.mongodb.net/?retryWrites=true&w=majority&appName=readypips
```

### View Collections
1. Go to MongoDB Atlas dashboard
2. Navigate to readypips database
3. View collections: users, signals, passwordResets, emailVerifications

### Reset Database
```javascript
// In MongoDB shell
db.users.deleteMany({})
db.signals.deleteMany({})
db.passwordResets.deleteMany({})
db.emailVerifications.deleteMany({})
```

## 🔄 Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Environment for Production
Update `.env` variables:
- `NEXTAUTH_URL=https://yourdomain.com`
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Use production payment gateway keys

## 📱 Features Checklist

- [x] User Authentication (Login/Signup)
- [x] Email Verification
- [x] Password Reset
- [x] Dashboard
- [x] Trading Signals
- [x] Market Charts
- [x] Real-time Data
- [x] AI Insights
- [x] Market News
- [x] Subscription Management
- [x] Payment Integration
- [x] WhatsApp Support
- [x] Responsive Design
- [x] Navigation with Dropdowns
- [x] FAQs, Testimonials, Privacy, Terms pages

## 🎯 Next Steps

1. **Test All Features**: Go through each page and test functionality
2. **Verify APIs**: Ensure all API calls return correct data
3. **Test Payments**: Create test transactions
4. **Mobile Testing**: Test on mobile devices
5. **Performance**: Check page load times
6. **Security**: Review security headers and CORS settings

## 📞 Support Contacts

- **WhatsApp**: +254 728 747 441
- **Email**: briancreatives@gmail.com
- **Timezone**: UTC+3 (East Africa)

## 🔗 Useful Links

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Alpha Vantage**: https://www.alphavantage.co
- **News API**: https://newsapi.org
- **Google Gemini**: https://gemini.google.com
- **Stripe**: https://stripe.com
- **Paystack**: https://paystack.com
- **PesaPal**: https://pesapal.com
- **TradingView**: https://www.tradingview.com

---

**Last Updated**: October 16, 2025
**Keep this guide handy for quick reference!** 📚
