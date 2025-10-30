"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TradingViewLiveChartProps {
  pair: string;
}

interface TVSignal {
  _id: string;
  pair: string;
  signal: 'BUY' | 'SELL' | 'CLOSE';
  entry: number;
  tp: number | null;
  sl: number | null;
  timeframe?: string;
  strategy?: string;
  createdAt: string;
  status: string;
  closePrice?: number;
}

declare global {
  var TradingView: any;
}

export default function TradingViewLiveChart({ pair }: TradingViewLiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [signals, setSignals] = useState<TVSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSignal, setActiveSignal] = useState<TVSignal | null>(null);

  const fetchSignals = useCallback(async () => {
    try {
      const response = await fetch(`/api/signals/tradingview?pair=${pair}&limit=5&status=active`);
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals || []);
        
        // Set the most recent active signal
        if (data.signals && data.signals.length > 0) {
          setActiveSignal(data.signals[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching TradingView signals:', error);
    }
  }, [pair]);

  const initializeChart = useCallback(() => {
    if (!containerRef.current || !globalThis.TradingView) return;

    if (widgetRef.current) {
      containerRef.current.innerHTML = '';
    }

    setLoading(true);

    widgetRef.current = new globalThis.TradingView.widget({
      container_id: containerRef.current.id,
      autosize: true,
      symbol: pair === 'XAUUSD' ? 'OANDA:XAUUSD' : `FX:${pair}`,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      hide_top_toolbar: false,
      allow_symbol_change: false,
      save_image: false,
      toolbar_bg: '#0f172a',
      loading_screen: { backgroundColor: '#0f172a', foregroundColor: '#3b82f6' },
      disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
      enabled_features: ['study_templates'],
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#10b981',
        'mainSeriesProperties.candleStyle.downColor': '#ef4444',
        'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
        'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
      },
    });

    setTimeout(() => setLoading(false), 2000);
  }, [pair]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      initializeChart();
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initializeChart]);

  useEffect(() => {
    if (globalThis.TradingView) {
      initializeChart();
    }
  }, [pair, initializeChart]);

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [fetchSignals]);

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Chart Container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-white">Loading Live Chart...</p>
            </div>
          </div>
        )}
        <div
          id="tv_live_chart_container"
          ref={containerRef}
          style={{ height: '600px', width: '100%' }}
        />
      </div>

      {/* Active Signal Display */}
      {activeSignal && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge 
                className={`text-lg px-4 py-2 ${
                  activeSignal.signal === 'BUY' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : activeSignal.signal === 'SELL'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {activeSignal.signal}
              </Badge>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Entry: {activeSignal.entry}
                </p>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {activeSignal.tp && <span>TP: {activeSignal.tp}</span>}
                  {activeSignal.sl && <span>SL: {activeSignal.sl}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(activeSignal.createdAt).toLocaleString()}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCloseSignal(activeSignal._id)}
                className="ml-4"
              >
                Close Signal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Control Panel */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Recent Signals - {pair}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {signals.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No active signals. Waiting for TradingView alerts...
              </p>
            </div>
          ) : (
            signals.map((signal) => (
              <div
                key={signal._id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  signal.signal === 'BUY'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : signal.signal === 'SELL'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge className={
                    signal.signal === 'BUY' 
                      ? 'bg-green-500' 
                      : signal.signal === 'SELL'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }>
                    {signal.signal}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {signal.timeframe || '15m'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Entry: {signal.entry}
                  </p>
                  {signal.tp && (
                    <p className="text-green-600 dark:text-green-400">
                      TP: {signal.tp}
                    </p>
                  )}
                  {signal.sl && (
                    <p className="text-red-600 dark:text-red-400">
                      SL: {signal.sl}
                    </p>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(signal.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
