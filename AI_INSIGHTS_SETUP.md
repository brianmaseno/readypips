# AI Insights / Gemini Integration Setup Guide

## Overview

The AI Insights system uses Google's Gemini API to provide professional trading analysis. It analyzes market data, technical indicators, and trading strategies to generate comprehensive trading recommendations.

## Current Status

### ✅ What's Working
- **API Route**: `/api/ai-insights` - Fully implemented
- **Frontend Component**: `components/ai-insights.tsx` - Fully implemented  
- **Database Integration**: MongoDB storage of analyses - Configured
- **Strategy Selection**: 7 trading strategies available (Harmonic, Scalping, Day Trading, Swing, Trend, Mean Reversion, Breakout, Momentum)
- **Timeframe Selection**: Multiple timeframes supported (1m, 5m, 15m, 30m, 1H, 4H, 1D, 1W)
- **Technical Indicators**: RSI, MACD, Moving Averages, Bollinger Bands
- **Error Handling**: Enhanced logging and error messages

### ❌ Current Issue

The Gemini API key in `.env` is **INVALID** or **EXPIRED**.

**Error Message:**
```
"API key not valid. Please pass a valid API key."
```

Current key in `.env`:
```
GEMINI_API_KEY=AIzaSyAV3lbT9wJuEQ6NvyyhJvUhAEo_ISSgcPA
```

## How to Fix: Get a Valid Gemini API Key

### Step 1: Visit Google AI Studio
Go to: **https://aistudio.google.com/app/apikey**

### Step 2: Create or Select a Project
- Click on the project dropdown
- Select your project or create a new one
- **Project Name**: "ReadyPips Trading Platform"

### Step 3: Create API Key
- Click **"Create API Key"**
- Select the project dropdown
- Click **"Create API key in new project"**
- A new API key will be generated

### Step 4: Copy the API Key
- Copy the newly generated API key
- It should look like: `AIza...` (a long string starting with "AIza")

### Step 5: Update Environment Variable

1. Open `.env` file in the project root:
```bash
nano .env
# or
code .env
```

2. Find the line:
```
GEMINI_API_KEY=AIzaSyAV3lbT9wJuEQ6NvyyhJvUhAEo_ISSgcPA
```

3. Replace it with your new key:
```
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

4. Save the file

### Step 6: Verify API Key has Access

Make sure the API key has access to:
- ✅ Generative AI / Gemini API
- ✅ API is enabled for the project

In Google Cloud Console:
1. Go to **https://console.cloud.google.com**
2. Select your project
3. Go to **APIs & Services > Enabled APIs and services**
4. Search for **"Generative Language API"**
5. Make sure it's **ENABLED** (shows a checkmark)

## Testing the AI Insights

After updating the API key, run:

```bash
# From the project root
npm run test:ai-insights
# or manually:
node scripts/test-ai-insights.js
```

### Expected Output:
```
✅ Server is ready

📊 ========================================
   AI INSIGHTS API TEST
   ========================================

📤 Sending analysis request...

✅ Analysis received successfully!

Response Structure:
  - MongoDB ID: [ID]
  - Public ID: [ID]
  ✓ Meta information present
    - Confidence Score: 65%
  ✓ Technical analysis present
  ✓ Simulation strategy present
  ✓ Implementation steps present
  ✓ Technical rationale present
  ✓ Contingency scenarios present

✅ AI INSIGHTS TEST COMPLETED SUCCESSFULLY
```

## AI Insights Features

### What the AI Does

The AI analyzes:
1. **Market Overview** - Current price, volatility, volume
2. **Technical Indicators** - RSI, MACD, Moving Averages, Bollinger Bands
3. **Multi-Timeframe Analysis** - Short-term, mid-term, long-term trends
4. **Strategy-Specific Analysis** - Customized to selected trading strategy
5. **Entry/Exit Points** - Specific price levels with rationale
6. **Risk Management** - Stop loss, take profit levels, position sizing
7. **Contingency Scenarios** - Alternative strategies if price reverses

### Output Structure

The AI generates comprehensive JSON with:

```json
{
  "meta": {
    "strategy_version": "1.5.4",
    "analysis_confidence_score": "75"
  },
  "analysis": {
    "categories": {
      "short_term": {...},
      "mid_term": {...},
      "long_term": {...}
    },
    "key_indicators": [...],
    "psychological_levels": {...}
  },
  "simulation_strategy": {
    "direction": "Long|Short|Neutral",
    "theoretical_entry": {...},
    "invalidation_point": {...},
    "target_levels": [...]
  },
  "implementation": {
    "simulation_steps": [...]
  },
  "technical_rationale": {...},
  "contingency_scenarios": [...]
}
```

## Frontend Integration

### Using AI Insights in Charts Page

The AI Insights component is used in `/app/charts/page.tsx`:

```tsx
import AIInsights from "@/components/ai-insights";

// In your component:
<AIInsights 
  symbol={selectedSymbol} 
  marketData={marketData}
  onAnalysisCreated={(analysis) => {
    // Handle the new analysis
  }}
/>
```

### Triggering Analysis

Users can:
1. **Select Trading Strategy** - Choose from 7 strategies
2. **Select Timeframes** - Choose multiple timeframes for analysis
3. **Click "Analyze"** - Trigger AI analysis
4. **View Results** - See detailed analysis in modal

## Database Schema

### Analyses Collection

```mongodb
{
  "_id": ObjectId,
  "publicId": "STRING",
  "symbol": "STRING",
  "timeframe": "STRING",
  "analysis": "STRING (JSON)",
  "createdAt": Date,
  "updatedAt": Date,
  "isArchived": Boolean,
  "metadata": {
    "creditType": "free_analysis",
    "tokensUsed": Number,
    "strategy": "STRING",
    "timeframes": ["STRING"],
    "primaryTimeframe": "STRING"
  }
}
```

## Troubleshooting

### Issue: "API key not valid"
**Solution:** Regenerate API key following steps above

### Issue: "Gemini API error: 403"
**Solution:** Enable Generative Language API in Google Cloud Console

### Issue: "Failed to parse AI response"
**Cause:** Gemini returned non-JSON response
**Solution:** Check Gemini API quota and rate limits

### Issue: Long response time
**Cause:** Large market data or complex analysis
**Solution:** Reduce timeframe selections or increase API timeout

### Issue: "MongoDB connection failed"
**Cause:** Database not running or connection string invalid
**Solution:** Check `MONGODB_URI` in `.env` file

## Production Deployment

When deploying to Vercel:

1. Add environment variable in Vercel dashboard:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your valid API key

2. Redeploy the application

3. Test with:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### POST `/api/ai-insights`

**Request:**
```json
{
  "symbol": "EURUSD",
  "marketData": {...},
  "primaryIndicators": {...},
  "allBarsData": {...},
  "allIndicators": {...},
  "timeframes": ["1H", "4H"],
  "primaryTimeframe": "1H",
  "analysisContext": {...}
}
```

**Response:**
```json
{
  "_id": "MongoDB ID",
  "publicId": "Public ID",
  "symbol": "EURUSD",
  "timeframe": "Strategy Name",
  "analysis": "JSON String",
  "createdAt": "ISO Date",
  "metadata": {...}
}
```

## Next Steps

1. ✅ Get valid Gemini API key from Google AI Studio
2. ✅ Update `.env` file with new key
3. ✅ Test with: `node scripts/test-ai-insights.js`
4. ✅ Verify working in browser at https://www.readypips.com/charts
5. ✅ Deploy to Vercel with updated environment variables

## Support

For issues with Gemini API:
- **Documentation**: https://ai.google.dev/
- **API Status**: https://status.cloud.google.com/
- **Rate Limits**: Check your project's usage in Google Cloud Console
