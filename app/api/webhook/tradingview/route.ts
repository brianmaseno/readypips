import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * POST - Receive TradingView webhook alerts
 * This endpoint receives real-time signals from TradingView Pine Script alerts
 * 
 * Expected JSON payload from TradingView:
 * {
 *   "signal": "BUY" | "SELL" | "CLOSE_BUY" | "CLOSE_SELL",
 *   "symbol": "EURUSD",
 *   "price": 1.0850,
 *   "time": "2024-01-15T10:30:00Z",
 *   "tp": 1.0920,
 *   "sl": 1.0800,
 *   "timeframe": "15m",
 *   "strategy": "Readypips Strategy"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook data
    const payload = await request.json();
    
    console.log('📩 Received TradingView webhook:', payload);

    // Validate required fields
    if (!payload.signal || !payload.symbol || !payload.price) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: signal, symbol, price' 
        },
        { status: 400 }
      );
    }

    // Normalize the symbol
    const normalizedSymbol = payload.symbol.replace('/', '').toUpperCase();

    // Connect to database
    const db = await getDatabase();

    // Prepare signal document
    const signalDocument = {
      pair: normalizedSymbol,
      signal: payload.signal.toUpperCase(),
      entry: parseFloat(payload.price),
      tp: payload.tp ? parseFloat(payload.tp) : null,
      sl: payload.sl ? parseFloat(payload.sl) : null,
      timeframe: payload.timeframe || '15m',
      strategy: payload.strategy || 'Readypips Strategy',
      status: payload.signal.includes('CLOSE') ? 'closed' : 'active',
      createdAt: payload.time ? new Date(payload.time) : new Date(),
      updatedAt: new Date(),
      source: 'tradingview_webhook',
    };

    // If this is a CLOSE signal, update the corresponding open signal
    if (payload.signal.includes('CLOSE')) {
      const signalType = payload.signal.includes('BUY') ? 'BUY' : 'SELL';
      
      // Find and close the most recent active signal
      await db.collection('tradingview_signals').updateOne(
        { 
          pair: normalizedSymbol,
          signal: signalType,
          status: 'active'
        },
        { 
          $set: { 
            status: 'closed',
            closePrice: parseFloat(payload.price),
            closedAt: new Date(),
            updatedAt: new Date()
          }
        },
        { sort: { createdAt: -1 } }
      );

      console.log(`✅ Closed ${signalType} signal for ${normalizedSymbol} at ${payload.price}`);
    }

    // Insert the new signal
    const result = await db.collection('tradingview_signals').insertOne(signalDocument);

    console.log('✅ Signal stored successfully:', result.insertedId);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Signal received and stored',
      signalId: result.insertedId.toString(),
      data: signalDocument,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error processing TradingView webhook:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process webhook',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'TradingView webhook endpoint is operational',
    endpoint: '/api/webhook/tradingview',
    timestamp: new Date().toISOString(),
  });
}
