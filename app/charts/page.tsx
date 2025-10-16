"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/components/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Maximize2, 
  Minimize2,
  DollarSign,
  Activity,
  Clock,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import MarketInfoTimer from "@/components/market-info-timer";
import TradingViewWidget from "@/components/tradingview-widget";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
}



// Available symbols for selection
const availableSymbols = [
  { value: "XAUUSD", label: "Gold", category: "Commodities", tradingView: "OANDA:XAUUSD" },
  { value: "XAGUSD", label: "Silver", category: "Commodities", tradingView: "OANDA:XAGUSD" },
  { value: "EURUSD", label: "EUR/USD", category: "Forex", tradingView: "FX:EURUSD" },
  { value: "GBPUSD", label: "GBP/USD", category: "Forex", tradingView: "FX:GBPUSD" },
  { value: "USDJPY", label: "USD/JPY", category: "Forex", tradingView: "FX:USDJPY" },
  { value: "BTCUSD", label: "Bitcoin", category: "Crypto", tradingView: "BINANCE:BTCUSDT" },
  { value: "ETHUSD", label: "Ethereum", category: "Crypto", tradingView: "BINANCE:ETHUSDT" },
  { value: "AAPL", label: "Apple", category: "Stocks", tradingView: "NASDAQ:AAPL" },
  { value: "TSLA", label: "Tesla", category: "Stocks", tradingView: "NASDAQ:TSLA" },
  { value: "MSFT", label: "Microsoft", category: "Stocks", tradingView: "NASDAQ:MSFT" },
];

// Default symbol for display purposes - Gold
const defaultSymbol = availableSymbols[0];

export default function ChartsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSymbol, setCurrentSymbol] = useState(defaultSymbol.value);
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [showSymbolSelector, setShowSymbolSelector] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  // Fetch market data
  const fetchMarketData = async (symbol: string = currentSymbol) => {
    try {
      setLoading(true);
      setIsMockData(false);

      // Fetch real market data from our API
      const response = await fetch(`/api/market-data?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MarketData = await response.json();

      // Heuristic: if the response lacks an Alpha Vantage 'lastUpdated' or contains unusually small volume, mark as mock
      const looksLikeMock = (data as any).lastUpdated === undefined || (data.volume && data.volume < 1000);
      if (looksLikeMock) {
        console.warn('⚠️ Market data looks like mock/fallback data for', symbol, data);
        setIsMockData(true);
      } else {
        setIsMockData(false);
      }

      setMarketData(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      // Fallback to mock data if API fails
      const mockData: MarketData = {
        symbol: symbol,
        price: symbol === 'XAUUSD' ? 2000 + Math.random() * 100 : 150 + Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 2,
        volume: Math.random() * 1000000 + 100000,
        high: symbol === 'XAUUSD' ? 2100 + Math.random() * 50 : 160 + Math.random() * 20,
        low: symbol === 'XAUUSD' ? 1950 + Math.random() * 50 : 140 + Math.random() * 20,
        open: symbol === 'XAUUSD' ? 2000 + Math.random() * 30 : 145 + Math.random() * 15,
      };
      setMarketData(mockData);
      setIsMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and periodic updates
  useEffect(() => {
    if (user) {
      fetchMarketData(currentSymbol);
      const interval = setInterval(() => fetchMarketData(currentSymbol), 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, currentSymbol]);

  // Handle symbol selection
  const handleSymbolSelect = (symbol: typeof availableSymbols[0]) => {
    setSelectedSymbol(symbol);
    setCurrentSymbol(symbol.value);
    setShowSymbolSelector(false);
    fetchMarketData(symbol.value);
  };

  // Close symbol selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSymbolSelector) {
        const target = event.target as Element;
        if (!target.closest('.symbol-selector')) {
          setShowSymbolSelector(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSymbolSelector]);



  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Advanced Charts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Professional trading charts with real-time data. Select symbols to view market data.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Symbol Selector */}
            <div className="relative symbol-selector">
              <Button
                onClick={() => setShowSymbolSelector(!showSymbolSelector)}
                variant="outline"
                size="sm"
                className="border-gray-300 text-black dark:text-white dark:border-gray-600 min-w-[120px] justify-between"
              >
                {selectedSymbol.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              {showSymbolSelector && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
                      Select Symbol
                    </div>
                    {availableSymbols.map((symbol) => (
                      <button
                        key={symbol.value}
                        onClick={() => handleSymbolSelect(symbol)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                          selectedSymbol.value === symbol.value 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{symbol.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{symbol.category}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {symbol.value}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="border-gray-300 text-black dark:text-white dark:border-gray-600"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Market Info and Timer Row */}
        <div className="mb-6">
          <MarketInfoTimer
            marketData={marketData || undefined}
          />
        </div>

        {/* Chart Area - Full Width */}
        <div className="w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Trading Chart</h2>
                  {isMockData && (
                    <Badge className="ml-2 bg-red-600 text-white">Mock Data</Badge>
                  )}
                  {marketData && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        ${marketData.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(marketData.change)}
                        <span className={`text-sm font-medium ${getChangeColor(marketData.change)}`}>
                          {marketData.change >= 0 ? "+" : ""}
                          {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="ml-2"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className={`w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}>
                  <TradingViewWidget 
                    isFullscreen={isFullscreen} 
                    symbol={selectedSymbol.tradingView}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Live Market Data Widgets */}
        {marketData && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Market Data - {currentSymbol}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${marketData.price.toFixed(2)}
                    </div>
                    <div className={`text-xs ${getChangeColor(marketData.change)}`}>
                      {marketData.change >= 0 ? "+" : ""}
                      {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">24h High</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${marketData.high.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">24h Low</div>
                    <div className="text-2xl font-bold text-red-600">
                      ${marketData.low.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
                    <div className="text-2xl font-bold">
                      ${(marketData.volume / 1000000).toFixed(2)}M
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
