# TradingView Webhook Integration Guide

## 🎯 Overview
This system allows you to receive real-time trading signals from your TradingView Pine Script strategy and display them live on your Ready Pips website.

---

## 📋 Setup Instructions

### 1. Add Environment Variable
Add this to your `.env` file:

```env
TRADINGVIEW_WEBHOOK_SECRET=your-super-secret-key-here-change-this
```

**Important:** Change `your-super-secret-key-here-change-this` to a strong random string.

---

### 2. Update Your Pine Script

Add this to the **bottom** of your Pine Script (the one you shared):

```pine
// Webhook Alert Messages
if buy_signal
    alert('{"signal": "BUY", "symbol": "' + syminfo.ticker + '", "price": "' + str.tostring(close) + '", "tp": "' + str.tostring(f_last_fib(tp_rate)) + '", "sl": "' + str.tostring(f_last_fib(sl_rate)) + '", "timeframe": "' + timeframe.period + '", "strategy": "Readypips v1.0"}', alert.freq_once_per_bar_close)

if sell_signal
    alert('{"signal": "SELL", "symbol": "' + syminfo.ticker + '", "price": "' + str.tostring(close) + '", "tp": "' + str.tostring(f_last_fib(tp_rate)) + '", "sl": "' + str.tostring(f_last_fib(sl_rate)) + '", "timeframe": "' + timeframe.period + '", "strategy": "Readypips v1.0"}', alert.freq_once_per_bar_close)

if buy_close_signal
    alert('{"signal": "CLOSE", "symbol": "' + syminfo.ticker + '", "price": "' + str.tostring(close) + '", "timeframe": "' + timeframe.period + '", "strategy": "Readypips v1.0"}', alert.freq_once_per_bar_close)

if sell_close_signal
    alert('{"signal": "CLOSE", "symbol": "' + syminfo.ticker + '", "price": "' + str.tostring(close) + '", "timeframe": "' + timeframe.period + '", "strategy": "Readypips v1.0"}', alert.freq_once_per_bar_close)
```

---

### 3. Configure TradingView Alerts

For **each currency pair** you want to track (e.g., EURUSD, GBPUSD, etc.):

1. **Open the chart** in TradingView
2. **Click the Alert button** (clock icon) in the top toolbar
3. **Configure the alert:**
   - **Condition:** "Any alert() function call"
   - **Alert name:** "ReadyPips - [SYMBOL]" (e.g., "ReadyPips - EURUSD")
   - **Webhook URL:** `https://yourdomain.com/api/webhooks/tradingview`
   
4. **In the "Message" section**, paste this:
   ```
   {{strategy.order.alert_message}}
   ```

5. **In Notifications:**
   - ✅ Check "Webhook URL"
   - Add this custom header (click "Show More"):
     ```
     x-webhook-secret: your-super-secret-key-here-change-this
     ```
     *(Use the same secret from your .env file)*

6. **Alert Settings:**
   - Expiration: Open-ended
   - Trigger: Once Per Bar Close
   
7. Click **Create**

---

## 🧪 Testing Your Webhook

### Test if webhook is online:
```bash
curl https://yourdomain.com/api/webhooks/tradingview
```

Should return:
```json
{
  "status": "online",
  "endpoint": "TradingView Webhook Receiver"
}
```

### Send a test signal:
```bash
curl -X POST https://yourdomain.com/api/webhooks/tradingview \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-super-secret-key-here-change-this" \
  -d '{
    "signal": "BUY",
    "symbol": "EURUSD",
    "price": "1.0850",
    "tp": "1.0900",
    "sl": "1.0800",
    "timeframe": "15m"
  }'
```

---

## 📊 How It Works

### Signal Flow:
```
TradingView Pine Script
       ↓
   (Signal triggers)
       ↓
   Webhook Alert → https://yourdomain.com/api/webhooks/tradingview
       ↓
   Stored in MongoDB (tradingview_signals collection)
       ↓
   Frontend fetches every 10 seconds
       ↓
   Displays on Live Chart page
```

---

## 🔐 Security Features

1. **Webhook Secret Verification**: Only requests with the correct `x-webhook-secret` header are accepted
2. **Data Validation**: All incoming signals are validated before storage
3. **User Authentication**: Signal viewing can be restricted to logged-in users

---

## 📁 Database Schema

Signals are stored in the `tradingview_signals` collection:

```javascript
{
  _id: ObjectId,
  pair: "EURUSD",           // Currency pair
  signal: "BUY",            // BUY, SELL, or CLOSE
  entry: 1.0850,            // Entry price
  tp: 1.0900,               // Take Profit (optional)
  sl: 1.0800,               // Stop Loss (optional)
  timeframe: "15m",         // Chart timeframe
  strategy: "Readypips v1.0", // Strategy name
  message: "",              // Additional info
  status: "active",         // active, closed
  source: "tradingview",
  receivedAt: Date,
  createdAt: Date,
  closePrice: 1.0875,       // When closed (optional)
  closedAt: Date            // When closed (optional)
}
```

---

## 🎨 Frontend Display

The live chart page (`/chart`) now shows:

1. **Live TradingView Chart** with real-time data
2. **Active Signal Banner** showing the most recent signal
3. **Recent Signals Grid** showing last 5 signals for the selected pair
4. **Trade Control**: Close signal button

---

## 🚀 Advanced Features (Optional)

### Real-time Updates with WebSockets
To push signals instantly to all connected clients without polling:

1. Install Socket.io: `npm install socket.io socket.io-client`
2. Create a WebSocket server
3. Emit signals when received via webhook
4. Update frontend to listen for real-time events

### Telegram/Discord Notifications
Send alerts to your team:

```typescript
// In webhook route after storing signal
await sendTelegramAlert({
  message: `🚀 ${signal.signal} ${signal.pair} @ ${signal.entry}`,
  tp: signal.tp,
  sl: signal.sl
});
```

---

## 🐛 Troubleshooting

### Webhook not receiving signals?
1. Check TradingView alert is active (green dot)
2. Verify webhook URL is HTTPS (TradingView requires SSL)
3. Check secret key matches in both `.env` and TradingView alert
4. View logs: `npm run dev` and watch console

### Signals not showing on frontend?
1. Check database: signals should appear in `tradingview_signals` collection
2. Verify API endpoint: `https://yourdomain.com/api/signals/tradingview?pair=EURUSD`
3. Check browser console for fetch errors

### Authentication errors?
1. Verify user is logged in
2. Check subscription is active
3. Ensure token is valid

---

## 📞 Support

For issues or questions:
- Email: support@readypips.com
- Check logs in your terminal
- Review MongoDB for stored signals

---

## ✅ Checklist

Before going live:

- [ ] Changed `TRADINGVIEW_WEBHOOK_SECRET` in `.env`
- [ ] Updated Pine Script with webhook alerts
- [ ] Created TradingView alerts for each pair
- [ ] Tested webhook with curl command
- [ ] Verified signals appear in database
- [ ] Confirmed signals display on `/chart` page
- [ ] Set alerts to "Open-ended" expiration
- [ ] SSL certificate is active (HTTPS required)

---

**🎉 You're all set!** Your TradingView signals will now appear live on your Ready Pips dashboard.
