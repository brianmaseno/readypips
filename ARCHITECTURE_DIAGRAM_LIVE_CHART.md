# Live Trading Chart - System Architecture

## 📊 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER VISITS /chart                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Authentication      │
                  │  Check (JWT Token)   │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
         ┌─────────────┐          ┌─────────────┐
         │ Not Logged  │          │  Logged In  │
         │   In        │          │             │
         └──────┬──────┘          └──────┬──────┘
                │                        │
                │                        ▼
                │              ┌──────────────────────┐
                │              │ Subscription Check   │
                │              └──────────┬───────────┘
                │                         │
                │            ┌────────────┴────────────┐
                │            ▼                         ▼
                │    ┌──────────────┐         ┌──────────────┐
                │    │ Not Active   │         │   Active     │
                │    │ Subscription │         │ Subscription │
                │    └──────┬───────┘         └──────┬───────┘
                │           │                        │
                ▼           ▼                        ▼
        ┌────────────┐ ┌────────────┐      ┌──────────────────┐
        │ Redirect   │ │ Redirect   │      │  LOAD CHART PAGE │
        │ to /login  │ │ to /sub    │      └────────┬─────────┘
        └────────────┘ └────────────┘               │
                                                     ▼
                                        ┌───────────────────────┐
                                        │  TradingView Chart    │
                                        │  Loads & Renders      │
                                        └───────────┬───────────┘
                                                    │
                                                    ▼
                                        ┌───────────────────────┐
                                        │  Start Auto-Polling   │
                                        └───────────┬───────────┘
                                                    │
                        ┌───────────────────────────┴────────────────────────┐
                        │                                                     │
                        ▼                                                     ▼
            ┌──────────────────────┐                          ┌──────────────────────┐
            │  Fetch Signals       │                          │  Fetch Analysis      │
            │  Every 5 seconds     │                          │  Every 10 seconds    │
            │                      │                          │                      │
            │  GET /api/signals    │                          │  GET /api/analysis   │
            │  ?pair=EURUSD        │                          │  ?pair=EURUSD        │
            └──────────┬───────────┘                          └──────────┬───────────┘
                       │                                                  │
                       ▼                                                  ▼
            ┌──────────────────────┐                          ┌──────────────────────┐
            │  Compare with Last   │                          │  Update Analysis     │
            │  Signal ID           │                          │  Panel Display       │
            └──────────┬───────────┘                          │                      │
                       │                                      │  • Trend             │
                       │                                      │  • Momentum          │
        ┌──────────────┴──────────────┐                      │  • Volatility        │
        │                             │                       │  • Support/Resist    │
        ▼                             ▼                       │  • Prediction        │
┌───────────────┐            ┌───────────────┐              └──────────────────────┘
│  Same Signal  │            │  New Signal!  │
│  (No Action)  │            │               │
└───────────────┘            └───────┬───────┘
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │  TRIGGER NOTIFICATION  │
                        └────────────┬───────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │ Play Sound   │    │ Show Pop-up  │    │   Browser    │
        │              │    │              │    │ Notification │
        │ alert.mp3    │    │  Animated    │    │              │
        │ 🔊           │    │  8 seconds   │    │  (Desktop)   │
        └──────────────┘    │  🚀 BUY      │    └──────────────┘
                            │  EURUSD      │
                            │  Entry: xxx  │
                            │  TP: xxx     │
                            └──────────────┘
```

## 🏗️ Component Architecture

```
/chart (Page)
│
├── LiveChart Component
│   │
│   ├── TradingView Widget
│   │   ├── Load external script (tv.js)
│   │   ├── Initialize chart with config
│   │   └── Display live candlesticks
│   │
│   ├── Signal Fetching (5s interval)
│   │   └── GET /api/signals?pair=EURUSD&limit=10
│   │
│   └── Recent Signals Display
│       ├── BUY signals (green)
│       └── SELL signals (red)
│
├── SignalNotifications Component
│   │
│   ├── Audio Element (alert.mp3)
│   │
│   ├── Polling Loop (5s interval)
│   │   ├── Fetch latest signal
│   │   ├── Compare with last ID
│   │   └── Trigger if new
│   │
│   └── Notification Stack
│       ├── Animated pop-ups
│       ├── Auto-dismiss (8s)
│       └── Progress bar
│
└── AnalysisPanel Component
    │
    ├── Polling Loop (10s interval)
    │   └── GET /api/analysis?pair=EURUSD
    │
    └── Display Sections
        ├── Trend indicator
        ├── Momentum badge
        ├── Volatility status
        ├── Support/Resistance levels
        └── Market prediction
```

## 🗄️ Database Schema

```
MongoDB Collections:

┌─────────────────────────────────────┐
│  signals                            │
├─────────────────────────────────────┤
│  _id: ObjectId                      │
│  pair: String (EURUSD, GBPUSD, ...) │
│  signal: String (BUY/SELL)          │
│  entry: Number                      │
│  tp: Number (Take Profit)           │
│  sl: Number (Stop Loss)             │
│  status: String                     │
│  createdAt: Date                    │
│  updatedAt: Date                    │
└─────────────────────────────────────┘
          │
          │ (Aggregated by)
          ▼
┌─────────────────────────────────────┐
│  Analysis Data (calculated)         │
├─────────────────────────────────────┤
│  trend: Bullish/Bearish/Neutral     │
│  momentum: Strong/Moderate/Weak     │
│  support: Number (min entry)        │
│  resistance: Number (max entry)     │
│  buySignals: Count                  │
│  sellSignals: Count                 │
│  volatility: High/Medium/Low        │
└─────────────────────────────────────┘
```

## 🔄 API Endpoints

```
GET /api/signals
├── Query Params:
│   ├── pair: String (e.g., EURUSD)
│   └── limit: Number (default: 10)
├── Returns:
│   └── { signals: Signal[] }
└── Used by: LiveChart + SignalNotifications

GET /api/analysis
├── Query Params:
│   └── pair: String (e.g., EURUSD)
├── Logic:
│   ├── Fetch recent 10 signals for pair
│   ├── Calculate trend (more buys = bullish)
│   ├── Calculate momentum (signal frequency)
│   ├── Calculate support (min entry)
│   ├── Calculate resistance (max entry)
│   └── Calculate volatility (price range)
├── Returns:
│   └── { analysis: AnalysisData }
└── Used by: AnalysisPanel
```

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Navigation Bar                                                  │
│ [Logo] [Live Chart] [Signals] [Copy Trading] [Profile] [Theme] │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│ Header                                                          │
│ 📈 Live Trading Chart    [Select Pair ▼]    [Hide Analysis]    │
└─────────────────────────────────────────────────────────────────┘
┌───────────────────────────────────────┬─────────────────────────┐
│                                       │                         │
│   TradingView Chart (75%)             │  Analysis Panel (25%)   │
│                                       │                         │
│   [Live Candlestick Chart]            │  📊 Market Analysis     │
│                                       │                         │
│   ┌─────────────────────────────┐    │  Trend: 🟢 Bullish     │
│   │                             │    │  Momentum: Strong       │
│   │     [Price Action]          │    │  Volatility: Medium     │
│   │                             │    │                         │
│   │  ▲ BUY markers              │    │  Key Levels:            │
│   │  ▼ SELL markers             │    │  Resistance: 1.0920     │
│   │                             │    │  Support: 1.0840        │
│   └─────────────────────────────┘    │                         │
│                                       │  📈 Next Move:          │
│   Recent Signals:                     │  "Expect upward..."     │
│   ┌─────────────────────────────┐    │                         │
│   │ 🟢 BUY | Entry: 1.0862      │    │  🕐 Updated: 10:23:45   │
│   │    TP: 1.0895 | SL: 1.0840  │    │  🟢 Auto-refresh        │
│   │    10:23:15 AM              │    │                         │
│   └─────────────────────────────┘    └─────────────────────────┘
│   ┌─────────────────────────────┐
│   │ 🔴 SELL | Entry: 1.0870     │
│   │    TP: 1.0835 | SL: 1.0890  │
│   │    10:20:30 AM              │
│   └─────────────────────────────┘
└───────────────────────────────────────┘

                                    ┌──────────────────────────┐
                                    │ 🚀 New BUY Signal!       │ ← Pop-up
                                    │ EURUSD                   │   (animated)
                                    │                          │
                                    │ 📍 Entry: 1.0862         │
                                    │ 🎯 TP: 1.0895            │
                                    │ 🛡️ SL: 1.0840            │
                                    │                          │
                                    │ ▓▓▓▓▓▓▓▓▓░░░             │
                                    └──────────────────────────┘
```

## 🔔 Notification Flow

```
New Signal Created in Database
              │
              ▼
┌─────────────────────────────┐
│ SignalNotifications         │
│ Component Polling (5s)      │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│ Compare signal._id with     │
│ lastSignalId state          │
└─────────────┬───────────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
    ┌────────┐  ┌────────┐
    │ Same   │  │  New   │
    │ Signal │  │ Signal │
    └────────┘  └────┬───┘
                     │
                     ▼
            ┌────────────────┐
            │ Update state:  │
            │ lastSignalId   │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │ showNotification()│
            └────────┬───────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Play     │  │ Create   │  │ Browser  │
│ Audio    │  │ Toast    │  │ Notif    │
└──────────┘  └──────────┘  └──────────┘
                     │
                     ▼
            ┌────────────────┐
            │ Auto-remove    │
            │ after 8s       │
            └────────────────┘
```

## 🎯 Key Features Summary

### 1. Real-Time Updates
- ✅ Signals: 5-second polling
- ✅ Analysis: 10-second polling
- ✅ Chart: Live TradingView data

### 2. Multi-Channel Notifications
- 🔊 Sound (alert.mp3)
- 🚀 Pop-up toast (animated)
- 📱 Browser notification (desktop)
- 📊 Visual list update

### 3. Market Intelligence
- 📈 Trend analysis
- 💪 Momentum tracking
- 📊 Volatility monitoring
- 🎯 Support/Resistance levels
- 🔮 Predictions

### 4. User Experience
- 🎨 Clean, modern UI
- 📱 Mobile responsive
- 🌙 Dark theme optimized
- ⚡ Fast loading
- 🔄 Auto-refresh (no manual reload)

---

**This architecture ensures a smooth, real-time trading experience with instant notifications and comprehensive market insights!**
