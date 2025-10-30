import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * TradingView Webhook Endpoint
 * Receives signals from TradingView alerts and stores them in the database
 */
export async function POST(request: NextRequest) {
  try {
    // Security: Verify webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.TRADINGVIEW_WEBHOOK_SECRET || 'your-secret-key';

    if (webhookSecret !== expectedSecret) {
      console.error('❌ Invalid webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the incoming signal data
    const data = await request.json();
    console.log('📩 Received TradingView Signal:', data);

    // Validate required fields
    if (!data.signal || !data.symbol || !data.price) {
      return NextResponse.json(
        { error: 'Missing required fields: signal, symbol, price' },
        { status: 400 }
      );
    }

    // Normalize the signal data
    const signal = {
      pair: data.symbol.replace('FX:', '').replace('OANDA:', '').toUpperCase(),
      signal: data.signal.toUpperCase(), // BUY, SELL, CLOSE
      entry: parseFloat(data.price),
      tp: data.tp ? parseFloat(data.tp) : null,
      sl: data.sl ? parseFloat(data.sl) : null,
      timeframe: data.timeframe || '15m',
      strategy: data.strategy || 'Readypips v1.0',
      message: data.message || '',
      receivedAt: new Date(),
      createdAt: new Date(),
      status: 'active',
      source: 'tradingview',
    };

    // Store signal in database
    const db = await getDatabase();
    const result = await db.collection('tradingview_signals').insertOne(signal);

    console.log('✅ Signal stored successfully:', result.insertedId);

    // Broadcast to connected clients (optional - for real-time updates)
    // You can implement WebSocket or Server-Sent Events here

    return NextResponse.json({
      success: true,
      message: 'Signal received and stored',
      signalId: result.insertedId.toString(),
      signal: {
        pair: signal.pair,
        signal: signal.signal,
        entry: signal.entry,
        tp: signal.tp,
        sl: signal.sl,
      },
    });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to test webhook is working
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'online',
    endpoint: 'TradingView Webhook Receiver',
    message: 'Use POST method to send signals',
    requiredFields: ['signal', 'symbol', 'price'],
    optionalFields: ['tp', 'sl', 'timeframe', 'strategy', 'message'],
    example: {
      signal: 'BUY',
      symbol: 'EURUSD',
      price: '1.0850',
      tp: '1.0900',
      sl: '1.0800',
      timeframe: '15m',
    },
  });
}
