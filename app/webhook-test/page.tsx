"use client";

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Signal } from 'lucide-react';

export default function WebhookTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState<any[]>([]);

  const testWebhook = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test 1: Check if webhook endpoint is online
      const checkResponse = await fetch('/api/webhooks/tradingview');
      const checkData = await checkResponse.json();
      
      setTestResult({
        step: 1,
        success: checkResponse.ok,
        message: 'Webhook endpoint is online',
        data: checkData,
      });

      // Test 2: Send a test signal
      const testSignal = {
        signal: 'BUY',
        symbol: 'EURUSD',
        price: '1.0850',
        tp: '1.0900',
        sl: '1.0800',
        timeframe: '15m',
        strategy: 'Test Signal',
      };

      const sendResponse = await fetch('/api/webhooks/tradingview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': process.env.NEXT_PUBLIC_WEBHOOK_SECRET || 'test-secret',
        },
        body: JSON.stringify(testSignal),
      });

      const sendData = await sendResponse.json();
      
      setTestResult({
        step: 2,
        success: sendResponse.ok,
        message: sendResponse.ok ? 'Test signal sent successfully' : 'Failed to send signal',
        data: sendData,
      });

      // Test 3: Fetch signals
      if (sendResponse.ok) {
        setTimeout(async () => {
          const fetchResponse = await fetch('/api/signals/tradingview?limit=5');
          if (fetchResponse.ok) {
            const fetchData = await fetchResponse.json();
            setSignals(fetchData.signals || []);
            setTestResult({
              step: 3,
              success: true,
              message: `Successfully fetched ${fetchData.signals?.length || 0} signals`,
              data: fetchData,
            });
          }
        }, 1000);
      }

    } catch (error: any) {
      setTestResult({
        success: false,
        message: 'Error during test',
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSignals = async () => {
    try {
      const response = await fetch('/api/signals/tradingview?limit=10&status=all');
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals || []);
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Navigation />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              TradingView Webhook Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test your TradingView webhook integration
            </p>
          </div>

          {/* Test Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Webhook Testing</CardTitle>
              <CardDescription>
                Run automated tests to verify your webhook is working correctly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={testWebhook}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Signal className="mr-2 h-4 w-4" />
                      Run Test
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchAllSignals}
                >
                  Fetch All Signals
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResult && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Test Results</CardTitle>
                  {testResult.success ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge
                      className={testResult.success ? 'bg-green-600' : 'bg-red-600'}
                    >
                      Step {testResult.step || 0}
                    </Badge>
                    <p className="mt-2 text-gray-900 dark:text-white">
                      {testResult.message}
                    </p>
                  </div>
                  {testResult.data && (
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  )}
                  {testResult.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-700 dark:text-red-400 text-sm">
                        {testResult.error}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Signals List */}
          {signals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Signals ({signals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {signals.map((signal) => (
                    <div
                      key={signal._id}
                      className={`p-4 rounded-lg border-2 ${
                        signal.signal === 'BUY'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                          : signal.signal === 'SELL'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={
                                signal.signal === 'BUY'
                                  ? 'bg-green-600'
                                  : signal.signal === 'SELL'
                                  ? 'bg-red-600'
                                  : 'bg-gray-600'
                              }
                            >
                              {signal.signal}
                            </Badge>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {signal.pair}
                            </span>
                            <Badge variant="outline">{signal.status}</Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-gray-900 dark:text-white">
                              <strong>Entry:</strong> {signal.entry}
                            </p>
                            {signal.tp && (
                              <p className="text-green-600 dark:text-green-400">
                                <strong>TP:</strong> {signal.tp}
                              </p>
                            )}
                            {signal.sl && (
                              <p className="text-red-600 dark:text-red-400">
                                <strong>SL:</strong> {signal.sl}
                              </p>
                            )}
                            {signal.timeframe && (
                              <p className="text-gray-600 dark:text-gray-400">
                                <strong>Timeframe:</strong> {signal.timeframe}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(signal.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Add Environment Variable</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                  TRADINGVIEW_WEBHOOK_SECRET=your-secret-key-here
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Your Webhook URL</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api/webhooks/tradingview
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. TradingView Alert Setup</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Create alert in TradingView</li>
                  <li>Choose Webhook URL</li>
                  <li>Add custom header: x-webhook-secret: your-secret-key</li>
                  <li>Use JSON message format</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
