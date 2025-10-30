import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - Fetch candlestick data from Binance API
 * This endpoint proxies requests to Binance to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') || '15m';
    const limit = searchParams.get('limit') || '100';

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    console.log(`[Binance API] Fetching ${symbol} ${interval} data`);

    // Fetch from Binance API
    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(binanceUrl);

    if (!response.ok) {
      console.error('[Binance API] Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Binance API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform to our format
    const candles = data.map((d: any) => ({
      time: Math.floor(d[0] / 1000), // Convert to seconds
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));

    console.log(`[Binance API] Returned ${candles.length} candles`);

    return NextResponse.json({
      success: true,
      symbol,
      interval,
      candles,
    });

  } catch (error: any) {
    console.error('[Binance API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
