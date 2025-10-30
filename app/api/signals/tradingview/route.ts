import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

/**
 * GET - Fetch TradingView signals
 * Query params:
 * - pair: currency pair (optional)
 * - limit: number of signals to return (default: 20)
 * - status: filter by status (active, closed, all)
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify user authentication
    const authHeader = request.headers.get('authorization');
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'active';

    const db = await getDatabase();

    // Build query
    const query: any = {};
    
    if (pair) {
      query.pair = pair.toUpperCase();
    }
    
    if (status !== 'all') {
      query.status = status;
    }

    // Fetch signals
    const signals = await db
      .collection('tradingview_signals')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Transform _id to string
    const formattedSignals = signals.map(signal => ({
      ...signal,
      _id: signal._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      count: formattedSignals.length,
      signals: formattedSignals,
    });

  } catch (error: any) {
    console.error('❌ Error fetching TradingView signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update signal status (e.g., close a signal)
 */
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { signalId, status, closePrice } = await request.json();

    if (!signalId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: signalId, status' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (closePrice) {
      updateData.closePrice = parseFloat(closePrice);
      updateData.closedAt = new Date();
    }

    const result = await db.collection('tradingview_signals').updateOne(
      { _id: new ObjectId(signalId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Signal updated successfully',
    });

  } catch (error: any) {
    console.error('❌ Error updating signal:', error);
    return NextResponse.json(
      { error: 'Failed to update signal', details: error.message },
      { status: 500 }
    );
  }
}
