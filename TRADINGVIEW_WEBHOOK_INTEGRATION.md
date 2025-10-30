# TradingView Webhook Integration Guide

This guide explains how to connect your TradingView Pine Script strategy to your ReadyPips application via webhooks.

## 🎯 Overview

When your Pine Script triggers a buy/sell signal, TradingView will automatically send the alert to your ReadyPips backend, which will:
1. Store the signal in the database
2. Display it on the live chart with markers (arrows, TP/SL lines)
3. Show it in the signals panel
4. Send notifications to users

## 📋 Step 1: Pine Script Alert Configuration

Use the following Pine Script template that includes webhook-ready alert messages:

```pinescript
//@version=5
strategy("Readypips Webhook Strategy", overlay=true)

// Your strategy logic here
emaFast = ta.ema(close, 9)
emaSlow = ta.ema(close, 21)

buySignal = ta.crossover(emaFast, emaSlow)
sellSignal = ta.crossunder(emaFast, emaSlow)

// Calculate TP and SL
atr = ta.atr(14)
buyTP = close + (atr * 2)
buySL = close - (atr * 1.5)
sellTP = close - (atr * 2)
sellSL = close + (atr * 1.5)

// Entry conditions
if (buySignal)
    strategy.entry("BUY", strategy.long)
    
if (sellSignal)
    strategy.close("BUY")
    strategy.entry("SELL", strategy.short)

// Exit conditions
if (strategy.position_size > 0 and (high >= buyTP or low <= buySL))
    strategy.close("BUY")
    
if (strategy.position_size < 0 and (low <= sellTP or high >= sellSL))
    strategy.close("SELL")

// Alert messages for webhook
buyMessage = '{"signal": "BUY", "symbol": "' + syminfo.ticker + '", "price": ' + str.tostring(close) + ', "tp": ' + str.tostring(buyTP) + ', "sl": ' + str.tostring(buySL) + ', "timeframe": "' + timeframe.period + '", "time": "' + str.tostring(time, "yyyy-MM-dd\'T\'HH:mm:ss\'Z\'") + '"}'

sellMessage = '{"signal": "SELL", "symbol": "' + syminfo.ticker + '", "price": ' + str.tostring(close) + ', "tp": ' + str.tostring(sellTP) + ', "sl": ' + str.tostring(sellSL) + ', "timeframe": "' + timeframe.period + '", "time": "' + str.tostring(time, "yyyy-MM-dd\'T\'HH:mm:ss\'Z\'") + '"}'

closeBuyMessage = '{"signal": "CLOSE_BUY", "symbol": "' + syminfo.ticker + '", "price": ' + str.tostring(close) + ', "timeframe": "' + timeframe.period + '", "time": "' + str.tostring(time, "yyyy-MM-dd\'T\'HH:mm:ss\'Z\'") + '"}'

closeSellMessage = '{"signal": "CLOSE_SELL", "symbol": "' + syminfo.ticker + '", "price": ' + str.tostring(close) + ', "timeframe": "' + timeframe.period + '", "time": "' + str.tostring(time, "yyyy-MM-dd\'T\'HH:mm:ss\'Z\'") + '"}'

// Create alerts
if (buySignal)
    alert(buyMessage, alert.freq_once_per_bar_close)
    
if (sellSignal)
    alert(sellMessage, alert.freq_once_per_bar_close)

if (strategy.position_size > 0 and (high >= buyTP or low <= buySL))
    alert(closeBuyMessage, alert.freq_once_per_bar_close)
    
if (strategy.position_size < 0 and (low <= sellTP or high >= sellSL))
    alert(closeSellMessage, alert.freq_once_per_bar_close)

// Plot signals on chart
plotshape(buySignal, title='Buy Signal', location=location.belowbar, color=color.new(color.green, 0), style=shape.triangleup, size=size.normal)
plotshape(sellSignal, title='Sell Signal', location=location.abovebar, color=color.new(color.red, 0), style=shape.triangledown, size=size.normal)
```

## 🔧 Step 2: Create TradingView Alert

1. **Add the strategy to your chart**
   - Open TradingView
   - Select your desired pair (e.g., EURUSD)
   - Click "Indicators" → "My Scripts" → Select your strategy

2. **Create Alert**
   - Click the "Alert" button (clock icon) at the top
   - **Condition**: Select "Any alert() function call"
   - **Alert name**: "ReadyPips - {{ticker}} - {{interval}}"
   - **Message**: Leave as default (it will use the JSON from the script)

3. **Webhook URL**
   - In the "Notifications" tab, check "Webhook URL"
   - Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhook/tradingview
   ```
   
   **For local development:**
   ```
   Use ngrok to expose your localhost:
   ngrok http 3000
   Then use: https://your-ngrok-url.ngrok.io/api/webhook/tradingview
   ```

4. **Webhook Structure**
   - The alert will automatically send the JSON message from your Pine Script
   - Make sure "Webhook URL" is the ONLY notification method selected if you want to avoid duplicate alerts

5. **Settings**
   - **Alert expiration**: Set to "Open-ended"
   - **Frequency**: "Once Per Bar Close" (recommended)
   - Click "Create"

## 📊 Step 3: Test Your Webhook

### Option 1: Use TradingView Chart
Just wait for a signal to trigger on the chart. The alert will automatically fire.

### Option 2: Manual Test with cURL

```bash
curl -X POST https://yourdomain.com/api/webhook/tradingview \
  -H "Content-Type: application/json" \
  -d '{
    "signal": "BUY",
    "symbol": "EURUSD",
    "price": 1.0850,
    "tp": 1.0920,
    "sl": 1.0800,
    "timeframe": "15m",
    "time": "2024-01-15T10:30:00Z"
  }'
```

### Option 3: Test in Node.js

```javascript
fetch('https://yourdomain.com/api/webhook/tradingview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    signal: 'BUY',
    symbol: 'EURUSD',
    price: 1.0850,
    tp: 1.0920,
    sl: 1.0800,
    timeframe: '15m',
    time: new Date().toISOString()
  })
});
```

## 🔍 Step 4: Verify Signal Reception

1. **Check the API response**
   - Visit: `https://yourdomain.com/api/webhook/tradingview`
   - You should see: `{"status":"active","message":"TradingView webhook endpoint is operational"}`

2. **View signals on your chart**
   - Navigate to: `http://localhost:3000/chart`
   - Select the pair you're monitoring
   - Signals will appear as:
     - 🟢 Green arrows (BUY)
     - 🔴 Red arrows (SELL)
     - 🟣 Purple circles (CLOSE)
     - Green/Red horizontal lines (TP/SL)

3. **Check the database**
   ```javascript
   // In MongoDB
   db.tradingview_signals.find().sort({createdAt: -1}).limit(10)
   ```

## 📱 Signal Display Features

Your chart now includes:

### Real-time Chart Updates
- ✅ Auto-refreshes every 5 seconds (no manual refresh needed)
- ✅ Buy/Sell arrows appear automatically
- ✅ TP and SL lines are drawn on the chart
- ✅ Active signal banner at the top

### Signal Panel (Below Chart)
- Shows recent signals with status
- Color-coded cards:
  - Green: Active BUY
  - Red: Active SELL
  - Gray: Closed signals
- Displays entry price, TP, SL, timeframe

### Active Signal Banner
- Shows currently active signal
- Quick close button
- Entry, TP, and SL at a glance

## 🔐 Security Best Practices

### Add API Key Authentication (Optional)

1. **Update your Pine Script alert message:**
```pinescript
buyMessage = '{"signal": "BUY", "symbol": "' + syminfo.ticker + '", "price": ' + str.tostring(close) + ', "apiKey": "YOUR_SECRET_KEY", ...}'
```

2. **Validate in your webhook endpoint:**
```typescript
// In app/api/webhook/tradingview/route.ts
const API_KEY = process.env.TRADINGVIEW_WEBHOOK_API_KEY;

if (payload.apiKey !== API_KEY) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

3. **Add to your `.env` file:**
```
TRADINGVIEW_WEBHOOK_API_KEY=your-secret-key-here
```

## 🐛 Troubleshooting

### Signals not appearing on chart?
1. Check webhook URL is correct (must be HTTPS in production)
2. Verify alert is active in TradingView (check the alert icon)
3. Check browser console for errors
4. Verify database connection

### Webhook receiving data but not displaying?
1. Check the pair name matches (EURUSD vs EUR/USD)
2. Clear browser cache
3. Check Network tab in DevTools for API calls

### Chart not updating in real-time?
1. Make sure you're not blocking the fetch requests
2. Check if the 5-second interval is running (see console)
3. Verify the signals API endpoint is working: `/api/signals/tradingview?pair=EURUSD`

## 📖 Additional Resources

- [TradingView Alerts Documentation](https://www.tradingview.com/support/solutions/43000529348-about-tradingview-alerts/)
- [Pine Script v5 Reference](https://www.tradingview.com/pine-script-reference/v5/)
- [Webhook Testing Tool](https://webhook.site/)

## 🎉 Success!

Once configured, your TradingView strategy will automatically send signals to your ReadyPips application, and they'll appear on the live chart in real-time with buy/sell markers, TP/SL lines, and signal notifications!
