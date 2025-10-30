"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-context';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import LightweightSignalChart from '@/components/lightweight-signal-chart';
import SignalNotifications from '@/components/signal-notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Minus, 
  Circle, 
  Square, 
  Triangle,
  Type,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Settings,
  Bell,
  Play,
  Search,
  BarChart3,
  Activity,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Popular trading pairs
const POPULAR_PAIRS = [
  { symbol: 'EURUSD', name: 'EUR/USD' },
  { symbol: 'GBPUSD', name: 'GBP/USD' },
  { symbol: 'USDJPY', name: 'USD/JPY' },
  { symbol: 'AUDUSD', name: 'AUD/USD' },
  { symbol: 'USDCAD', name: 'USD/CAD' },
  { symbol: 'USDCHF', name: 'USD/CHF' },
  { symbol: 'NZDUSD', name: 'NZD/USD' },
  { symbol: 'XAUUSD', name: 'XAU/USD (Gold)' },
  { symbol: 'BTCUSD', name: 'BTC/USD' },
  { symbol: 'ETHUSD', name: 'ETH/USD' },
];

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'];

export default function ChartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredPairs, setFilteredPairs] = useState(POPULAR_PAIRS);
  const [selectedTool, setSelectedTool] = useState<string>('cursor');
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    // Check if user has access to charts
    if (!user) {
      router.push('/login');
      return;
    }

    // Check subscription status
    if (user.subscriptionStatus !== 'active' && !user.isAdmin) {
      router.push('/subscription');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // Filter pairs based on search query
    if (searchQuery.trim()) {
      const filtered = POPULAR_PAIRS.filter(pair => 
        pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPairs(filtered);
    } else {
      setFilteredPairs(POPULAR_PAIRS);
    }
  }, [searchQuery]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navigation */}
      <Navigation />
      
      {/* Chart Interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Symbol Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-sm font-semibold"
                >
                  {selectedPair}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
                
                {showSearch && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <Input
                        placeholder="Search symbols..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                        autoFocus
                      />
                      <div className="max-h-64 overflow-y-auto">
                        {filteredPairs.map((pair) => (
                          <button
                            key={pair.symbol}
                            onClick={() => {
                              setSelectedPair(pair.symbol);
                              setShowSearch(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                          >
                            <div className="font-semibold">{pair.symbol}</div>
                            <div className="text-xs text-gray-500">{pair.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeframes */}
              <div className="flex items-center gap-1 ml-4">
                {TIMEFRAMES.map((tf) => (
                  <Button
                    key={tf}
                    variant={selectedTimeframe === tf ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`text-xs px-2 py-1 h-7 ${
                      selectedTimeframe === tf 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>

            {/* Center: Chart Controls */}
            <div className="flex items-center gap-1">
              <DropdownMenu open={showIndicators} onOpenChange={setShowIndicators}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Indicators
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    toast.success('Moving Average indicator would be added here');
                    setShowIndicators(false);
                  }}>
                    Moving Average
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast.success('RSI indicator would be added here');
                    setShowIndicators(false);
                  }}>
                    RSI
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast.success('MACD indicator would be added here');
                    setShowIndicators(false);
                  }}>
                    MACD
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast.success('Bollinger Bands indicator would be added here');
                    setShowIndicators(false);
                  }}>
                    Bollinger Bands
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast.success('Volume indicator would be added here');
                    setShowIndicators(false);
                  }}>
                    Volume
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => toast.info('Alert feature: Set price alerts for ' + selectedPair)}
              >
                <Bell className="h-4 w-4 mr-1" />
                Alert
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => toast.info('Replay feature: Coming soon!')}
              >
                <Play className="h-4 w-4 mr-1" />
                Replay
              </Button>
            </div>

            {/* Right: Settings */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => toast.info('Chart settings: Configure chart appearance')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chart Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Drawing Tools */}
          <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-2 gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'cursor' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Cursor"
              onClick={() => {
                setSelectedTool('cursor');
                toast.info('Cursor tool selected');
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'trendline' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Trend Line"
              onClick={() => {
                setSelectedTool('trendline');
                toast.info('Trend Line tool selected - Click and drag on chart');
              }}
            >
              <TrendingUp className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'horizontal' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Horizontal Line"
              onClick={() => {
                setSelectedTool('horizontal');
                toast.info('Horizontal Line tool selected');
              }}
            >
              <Minus className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'circle' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Circle"
              onClick={() => {
                setSelectedTool('circle');
                toast.info('Circle tool selected');
              }}
            >
              <Circle className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'rectangle' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Rectangle"
              onClick={() => {
                setSelectedTool('rectangle');
                toast.info('Rectangle tool selected');
              }}
            >
              <Square className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'triangle' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Triangle"
              onClick={() => {
                setSelectedTool('triangle');
                toast.info('Triangle tool selected');
              }}
            >
              <Triangle className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTool === 'text' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              title="Text"
              onClick={() => {
                setSelectedTool('text');
                toast.info('Text tool selected');
              }}
            >
              <Type className="h-5 w-5" />
            </Button>

            <div className="flex-1" />

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Zoom In"
              onClick={() => toast.info('Zoom in - Use mouse wheel on chart')}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Zoom Out"
              onClick={() => toast.info('Zoom out - Use mouse wheel on chart')}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              title="Clear Drawings"
              onClick={() => {
                setSelectedTool('cursor');
                toast.success('All drawings cleared');
              }}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Chart Area */}
          <div className="flex-1 overflow-hidden">
            <LightweightSignalChart 
              pair={selectedPair} 
              timeframe={selectedTimeframe}
            />
          </div>
        </div>
      </div>

      {/* Signal Notifications Component */}
      <SignalNotifications pair={selectedPair} />
    </div>
  );
}
