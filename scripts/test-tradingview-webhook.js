#!/usr/bin/env node

/**
 * Test TradingView Webhook
 * This script sends a test signal to your webhook endpoint
 */

const signals = [
  {
    signal: 'BUY',
    symbol: 'EURUSD',
    price: 1.0850,
    tp: 1.0920,
    sl: 1.0800,
    timeframe: '15m',
    strategy: 'Test Strategy',
    time: new Date().toISOString(),
  },
  {
    signal: 'SELL',
    symbol: 'GBPUSD',
    price: 1.2550,
    tp: 1.2480,
    sl: 1.2600,
    timeframe: '15m',
    strategy: 'Test Strategy',
    time: new Date().toISOString(),
  },
  {
    signal: 'CLOSE_BUY',
    symbol: 'EURUSD',
    price: 1.0910,
    timeframe: '15m',
    time: new Date().toISOString(),
  },
];

async function testWebhook(webhookUrl, signalIndex = 0) {
  const signal = signals[signalIndex];
  
  console.log('\n📤 Sending test signal:');
  console.log(JSON.stringify(signal, null, 2));
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signal),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Success!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('\n❌ Error:');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Failed to send webhook:', error.message);
  }
}

// Main execution
const webhookUrl = process.argv[2] || 'http://localhost:3000/api/webhook/tradingview';
const signalType = process.argv[3] || '0'; // 0=BUY, 1=SELL, 2=CLOSE_BUY

console.log('🚀 TradingView Webhook Tester');
console.log('================================');
console.log('Webhook URL:', webhookUrl);
console.log('Signal Type:', ['BUY', 'SELL', 'CLOSE_BUY'][parseInt(signalType)]);

testWebhook(webhookUrl, parseInt(signalType));
