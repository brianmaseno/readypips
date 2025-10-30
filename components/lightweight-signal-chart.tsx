"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, X, Volume2 } from 'lucide-react';

interface LightweightSignalChartProps {
  pair: string;
}

interface TVSignal {
  _id: string;
  pair: string;
  signal: 'BUY' | 'SELL' | 'CLOSE_BUY' | 'CLOSE_SELL' | 'CLOSE';
  entry: number;
  tp: number | null;
  sl: number | null;
  timeframe?: string;
  strategy?: string;
  createdAt: string;
  status: string;
  closePrice?: number;
}

interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function LightweightSignalChart({ pair }: LightweightSignalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<any>(null);
  const tpLineRef = useRef<any>(null);
  const slLineRef = useRef<any>(null);
  
  const [signals, setSignals] = useState<TVSignal[]>([]);
  const [activeSignal, setActiveSignal] = useState<TVSignal | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Map pair to Binance symbol
  const getBinanceSymbol = (pair: string): string => {
    const mapping: { [key: string]: string } = {
      'EURUSD': 'EURUSDT',
      'GBPUSD': 'GBPUSDT',
      'USDJPY': 'USDTJPY',
      'AUDUSD': 'AUDUSDT',
      'USDCAD': 'USDTCAD',
      'XAUUSD': 'BTCUSDT', // Using BTC as example, you can use gold futures
    };
    return mapping[pair] || 'BTCUSDT';
  };

  // Fetch candlestick data from Binance
  const fetchCandleData = useCallback(async () => {
    try {
      const symbol = getBinanceSymbol(pair);
      console.log('Fetching candle data for:', symbol);
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=100`
      );
      
      if (!response.ok) {
        console.error('Binance API error:', response.status, response.statusText);
        throw new Error('Failed to fetch candle data');
      }
      
      const data = await response.json();
      console.log('Received candle data:', data.length, 'candles');
      const candles: CandleData[] = data.map((d: any) => ({
        time: Math.floor(d[0] / 1000) as Time,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));
      
      console.log('Processed candles:', candles.length);
      return candles;
    } catch (error) {
      console.error('Error fetching candle data:', error);
      return [];
    }
  }, [pair]);

  // Fetch signals from API
  const fetchSignals = useCallback(async () => {
    try {
      const response = await fetch(`/api/signals/tradingview?pair=${pair}&limit=20&status=all`);
      if (response.ok) {
        const data = await response.json();
        const newSignals = data.signals || [];
        
        // Check if there are new signals
        if (JSON.stringify(newSignals) !== JSON.stringify(signals)) {
          // Play alert sound if new signal arrived
          if (newSignals.length > signals.length && signals.length > 0) {
            playAlert();
          }
          
          setSignals(newSignals);
          
          // Set active signal
          const activeSignals = newSignals.filter((s: TVSignal) => s.status === 'active');
          if (activeSignals && activeSignals.length > 0) {
            setActiveSignal(activeSignals[0]);
          } else {
            setActiveSignal(null);
          }
        }
        
        setIsLive(true);
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
      setIsLive(false);
    }
  }, [pair, signals]);

  // Play alert sound
  const playAlert = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  // Update markers on the chart
  const updateMarkers = useCallback(() => {
    if (!candleSeriesRef.current || signals.length === 0) return;

    console.log('Updating markers for', signals.length, 'signals');

    const markers = signals.map((signal) => {
      // Use the signal creation time
      const timestamp = Math.floor(new Date(signal.createdAt).getTime() / 1000) as Time;
      
      if (signal.signal === 'BUY') {
        return {
          time: timestamp,
          position: 'belowBar' as const,
          color: '#10b981',
          shape: 'arrowUp' as const,
          text: `BUY @ ${signal.entry}`,
          size: 1,
        };
      } else if (signal.signal === 'SELL') {
        return {
          time: timestamp,
          position: 'aboveBar' as const,
          color: '#ef4444',
          shape: 'arrowDown' as const,
          text: `SELL @ ${signal.entry}`,
          size: 1,
        };
      } else if (signal.signal.includes('CLOSE')) {
        return {
          time: timestamp,
          position: 'inBar' as const,
          color: '#8b5cf6',
          shape: 'circle' as const,
          text: `CLOSE @ ${signal.closePrice || signal.entry}`,
          size: 1,
        };
      }
      return null;
    }).filter(Boolean) as any[];

    console.log('Setting', markers.length, 'markers on chart');
    if (markers.length > 0) {
      candleSeriesRef.current.setMarkers(markers);
      console.log('Markers set successfully');
    }
  }, [signals]);

  // Initialize chart
  const initChart = useCallback(async () => {
    if (!chartContainerRef.current) {
      console.error('Chart container ref is null');
      return;
    }

    console.log('Initializing chart...');

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2d2d2d' },
        horzLines: { color: '#2d2d2d' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    console.log('Chart created:', chart);

    // Add candlestick series using v4.x API
    console.log('Adding candlestick series...');
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    console.log('Candlestick series added:', candleSeries);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Fetch and set initial data
    const candles = await fetchCandleData();
    console.log('Fetched candles:', candles.length);
    if (candles.length > 0) {
      console.log('Setting data to chart...');
      candleSeries.setData(candles);
      console.log('Data set successfully');
    } else {
      console.warn('No candle data to display');
    }

    // Fit content to chart
    chart.timeScale().fitContent();

    setLoading(false);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [fetchCandleData]);

  // Initialize chart on mount
  useEffect(() => {
    initChart();
  }, []);

  // Update chart when pair changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.remove();
      setLoading(true);
      initChart();
    }
  }, [pair]);

  // Fetch signals periodically
  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 3000);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  // Update markers when signals change
  useEffect(() => {
    updateMarkers();
    
    // Update TP/SL lines for active signal
    if (activeSignal && candleSeriesRef.current) {
      // Remove old lines
      if (tpLineRef.current) {
        candleSeriesRef.current.removePriceLine(tpLineRef.current);
      }
      if (slLineRef.current) {
        candleSeriesRef.current.removePriceLine(slLineRef.current);
      }

      // Add TP line
      if (activeSignal.tp) {
        tpLineRef.current = candleSeriesRef.current.createPriceLine({
          price: activeSignal.tp,
          color: '#10b981',
          lineWidth: 2,
          lineStyle: 2, // Dashed
          axisLabelVisible: true,
          title: 'TP',
        });
      }

      // Add SL line
      if (activeSignal.sl) {
        slLineRef.current = candleSeriesRef.current.createPriceLine({
          price: activeSignal.sl,
          color: '#ef4444',
          lineWidth: 2,
          lineStyle: 2, // Dashed
          axisLabelVisible: true,
          title: 'SL',
        });
      }
    } else {
      // Remove lines if no active signal
      if (tpLineRef.current && candleSeriesRef.current) {
        candleSeriesRef.current.removePriceLine(tpLineRef.current);
        tpLineRef.current = null;
      }
      if (slLineRef.current && candleSeriesRef.current) {
        candleSeriesRef.current.removePriceLine(slLineRef.current);
        slLineRef.current = null;
      }
    }
  }, [signals, activeSignal, updateMarkers]);

  // Update candles periodically
  useEffect(() => {
    const updateCandles = async () => {
      const candles = await fetchCandleData();
      if (candles.length > 0 && candleSeriesRef.current) {
        candleSeriesRef.current.setData(candles);
      }
    };

    const interval = setInterval(updateCandles, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchCandleData]);

  const handleCloseSignal = async (signalId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/signals/tradingview', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          signalId,
          status: 'closed',
        }),
      });

      if (response.ok) {
        fetchSignals();
      }
    } catch (error) {
      console.error('Error closing signal:', error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Hidden audio element for alerts */}
      <audio ref={audioRef} src="/sounds/alert.mp3" preload="auto" />

      {/* Chart Container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-white">Loading Chart...</p>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="absolute top-2 left-2 right-2 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-blue-400/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center">
              <span className="mr-2">📊</span>
              <span>Live Chart with Signals - {pair}</span>
            </p>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 text-xs ${isLive ? 'text-green-300' : 'text-red-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                {isLive ? 'Live' : 'Disconnected'}
              </span>
              <Volume2 className="h-4 w-4 text-green-400" />
            </div>
          </div>
        </div>

        <div ref={chartContainerRef} className="w-full" />
      </div>

      {/* Active Signal Banner */}
      {activeSignal && (
        <div className={`p-4 ${
          activeSignal.signal === 'BUY' 
            ? 'bg-gradient-to-r from-green-600 to-green-700' 
            : 'bg-gradient-to-r from-red-600 to-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {activeSignal.signal === 'BUY' ? (
                <TrendingUp className="h-8 w-8 text-white" />
              ) : (
                <TrendingDown className="h-8 w-8 text-white" />
              )}
              <div>
                <p className="text-white text-lg font-bold">
                  {activeSignal.signal} Signal Active
                </p>
                <div className="flex gap-4 text-sm text-white/90">
                  <span>Entry: {activeSignal.entry}</span>
                  {activeSignal.tp && <span>TP: {activeSignal.tp}</span>}
                  {activeSignal.sl && <span>SL: {activeSignal.sl}</span>}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCloseSignal(activeSignal._id)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <X className="h-4 w-4 mr-2" />
              Close Signal
            </Button>
          </div>
        </div>
      )}

      {/* Signal Panel */}
      <div className="p-6 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="mr-2">📊</span>
            Recent Signals - {pair}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              isLive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              {isLive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {signals.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No signals yet</p>
                <p className="text-sm mt-1">Waiting for TradingView alerts...</p>
              </div>
            </div>
          ) : (
            signals.slice(0, 8).map((signal) => (
              <div
                key={signal._id}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  signal.status === 'active'
                    ? signal.signal === 'BUY'
                      ? 'bg-green-900/30 border-green-500'
                      : 'bg-red-900/30 border-red-500'
                    : 'bg-gray-700/50 border-gray-600 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${
                    signal.signal === 'BUY' 
                      ? 'bg-green-500' 
                      : signal.signal === 'SELL'
                      ? 'bg-red-500'
                      : 'bg-purple-500'
                  } text-white`}>
                    {signal.signal}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {signal.timeframe || '15m'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-white">
                    Entry: {signal.entry}
                  </p>
                  {signal.tp && (
                    <p className="text-green-400">
                      TP: {signal.tp}
                    </p>
                  )}
                  {signal.sl && (
                    <p className="text-red-400">
                      SL: {signal.sl}
                    </p>
                  )}
                  {signal.closePrice && (
                    <p className="text-purple-400">
                      Close: {signal.closePrice}
                    </p>
                  )}
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    signal.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-600 text-gray-400'
                  }`}>
                    {signal.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(signal.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
