"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

interface TradingViewAdvancedChartProps {
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

declare global {
  var TradingView: any;
}

export default function TradingViewAdvancedChart({ pair }: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [signals, setSignals] = useState<TVSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSignal, setActiveSignal] = useState<TVSignal | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  const fetchSignals = useCallback(async () => {
    try {
      const response = await fetch(`/api/signals/tradingview?pair=${pair}&limit=10&status=all`);
      if (response.ok) {
        const data = await response.json();
        const newSignals = data.signals || [];
        
        // Only update if signals actually changed
        if (JSON.stringify(newSignals) !== JSON.stringify(signals)) {
          setSignals(newSignals);
          
          // Set the most recent active signal
          const activeSignals = newSignals.filter((s: TVSignal) => s.status === 'active');
          if (activeSignals && activeSignals.length > 0) {
            setActiveSignal(activeSignals[0]);
          } else {
            setActiveSignal(null);
          }
          
          setLastUpdate(new Date());
        }
        
        setIsLive(true);
      }
    } catch (error) {
      console.error('Error fetching TradingView signals:', error);
      setIsLive(false);
    }
  }, [pair, signals]);

  const initializeChart = useCallback(() => {
    if (!containerRef.current || !globalThis.TradingView) return;

    if (widgetRef.current) {
      containerRef.current.innerHTML = '';
    }

    setLoading(true);

    const widget = new globalThis.TradingView.widget({
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
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
      ],
      enabled_features: [
        'study_templates',
        'create_volume_indicator_by_default',
      ],
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#10b981',
        'mainSeriesProperties.candleStyle.downColor': '#ef4444',
        'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
        'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
      },
      studies_overrides: {},
    });

    widgetRef.current = widget;

    // Wait for widget to be ready and then set loading to false
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [pair]);

  // Note: TradingView widget doesn't support programmatic shape creation in the free version
  // Signals are displayed in the panel below the chart instead
  const addSignalMarkers = useCallback(() => {
    // This function is kept for future enhancement when using TradingView advanced charts API
    // For now, signals are shown in the signal panel below
    if (!widgetRef.current) return;
    
    // Signal markers would be added here if using TradingView Advanced Charts
    // Currently, signals are displayed in the signal cards panel
  }, []);

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
    // Poll for new signals every 3 seconds for near real-time updates
    const interval = setInterval(fetchSignals, 3000);

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
    <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Chart Container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-white">Loading Live Chart...</p>
            </div>
          </div>
        )}
        
        {/* Info Banner */}
        <div className="absolute top-2 left-2 right-2 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-blue-400/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center">
              <span className="mr-2">📊</span>
              <span>Live TradingView Chart - {pair}</span>
            </p>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-xs ${isLive ? 'text-green-300' : 'text-red-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                {isLive ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        
        <div
          id="tv_advanced_chart_container"
          ref={containerRef}
          style={{ height: '700px', width: '100%' }}
        />
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

      {/* Trade Control Panel */}
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
