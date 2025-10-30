# ReadyPips Chart - Quick Start Script
# This script helps you test the webhook integration quickly

Write-Host "🚀 ReadyPips TradingView Webhook - Quick Start" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Check .env file
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ .env file created. Please update with your values." -ForegroundColor Green
    } else {
        Write-Host "❌ env.example not found." -ForegroundColor Red
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Quick Test Menu" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Test Webhook (BUY signal)" -ForegroundColor White
Write-Host "2. Test Webhook (SELL signal)" -ForegroundColor White
Write-Host "3. Test Webhook (CLOSE signal)" -ForegroundColor White
Write-Host "4. Start Dev Server" -ForegroundColor White
Write-Host "5. Open Chart Page" -ForegroundColor White
Write-Host "6. Open Webhook Test Page" -ForegroundColor White
Write-Host "7. View Documentation" -ForegroundColor White
Write-Host "0. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select option (0-7)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📤 Sending BUY signal test..." -ForegroundColor Yellow
        node scripts/test-tradingview-webhook.js http://localhost:3000/api/webhook/tradingview 0
    }
    "2" {
        Write-Host ""
        Write-Host "📤 Sending SELL signal test..." -ForegroundColor Yellow
        node scripts/test-tradingview-webhook.js http://localhost:3000/api/webhook/tradingview 1
    }
    "3" {
        Write-Host ""
        Write-Host "📤 Sending CLOSE signal test..." -ForegroundColor Yellow
        node scripts/test-tradingview-webhook.js http://localhost:3000/api/webhook/tradingview 2
    }
    "4" {
        Write-Host ""
        Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
        Write-Host ""
        npm run dev
    }
    "5" {
        Write-Host ""
        Write-Host "🌐 Opening chart page..." -ForegroundColor Yellow
        Start-Process "http://localhost:3000/chart"
    }
    "6" {
        Write-Host ""
        Write-Host "🌐 Opening webhook test page..." -ForegroundColor Yellow
        Start-Process "http://localhost:3000/webhook-test"
    }
    "7" {
        Write-Host ""
        Write-Host "📖 Documentation Files:" -ForegroundColor Cyan
        Write-Host "  - QUICK_START_CHART.md" -ForegroundColor White
        Write-Host "  - TRADINGVIEW_WEBHOOK_INTEGRATION.md" -ForegroundColor White
        Write-Host "  - CHART_UPDATE_SUMMARY.md" -ForegroundColor White
        Write-Host "  - SIGNAL_FLOW_DIAGRAM.md" -ForegroundColor White
        Write-Host ""
        $openDocs = Read-Host "Open QUICK_START_CHART.md? (y/n)"
        if ($openDocs -eq "y") {
            Start-Process "QUICK_START_CHART.md"
        }
    }
    "0" {
        Write-Host ""
        Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid option" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start the dev server (option 4)" -ForegroundColor White
Write-Host "  2. Test the webhook (options 1-3)" -ForegroundColor White
Write-Host "  3. View the chart (option 5)" -ForegroundColor White
Write-Host "  4. Connect TradingView (see docs)" -ForegroundColor White
Write-Host ""
