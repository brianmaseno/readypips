# Pine Script Webhook Code - Quick Reference

## 📋 Add This to Your Pine Script

Copy and paste this code at the **END** of your Pine Script strategy (after all the existing code):

```pinescript
// ==========================================
// WEBHOOK ALERTS FOR READY PIPS
// ==========================================

// Alert messages with JSON payloads for webhook
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

## 🔧 TradingView Alert Settings

### For Each Currency Pair:

1. **Open Chart** → Click Alert icon (🔔)

2. **Condition:** "Any alert() function call"

3. **Webhook URL:**
   ```
   https://yourdomain.com/api/webhooks/tradingview
   ```

4. **Message:**
   ```
   {{strategy.order.alert_message}}
   ```

5. **Add Custom Header** (Show More → Webhook):
   ```
   x-webhook-secret: your-super-secret-key-here
   ```
   *(Must match your .env file)*

6. **Settings:**
   - ✅ Webhook URL
   - Expiration: Open-ended
   - Trigger: Once Per Bar Close
   - ✅ Only once (per bar close)

7. Click **Create**

---

## 🧪 Quick Test

After setting up, test with curl:

```bash
curl -X POST https://yourdomain.com/api/webhooks/tradingview \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-here" \
  -d '{
    "signal": "BUY",
    "symbol": "EURUSD",
    "price": "1.0850",
    "tp": "1.0900",
    "sl": "1.0800"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Signal received and stored"
}
```

---

## ✅ Verification Checklist

- [ ] Pine Script updated with webhook code
- [ ] Alert created in TradingView
- [ ] Webhook URL is HTTPS
- [ ] Secret key matches .env file
- [ ] Tested with curl command
- [ ] Signal appears on website /chart page

---

## 📞 Troubleshooting

**Signals not appearing?**
1. Check TradingView alert is active (green dot)
2. Verify webhook URL is correct
3. Ensure secret key matches
4. Check server logs: `npm run dev`

**Need Help?**
See full documentation in `TRADINGVIEW_WEBHOOK_SETUP.md`
