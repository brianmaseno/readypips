"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/navigation";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Shield,
  TrendingUp,
  Users,
  ArrowRight,
  Info,
} from "lucide-react";

// Define your broker configurations here
const brokers = [
  {
    id: "hfm",
    name: "HFM (HotForex)",
    logo: "/hfm-icon.png",
    description: "Award-winning broker with HFcopy social trading service - Our Primary Copy Trading Platform",
    features: [
      "HFcopy platform",
      "Over 1000+ strategy providers",
      "Performance fee only",
      "Risk management tools",
      "Professional copy trading service",
    ],
    minDeposit: "$100",
    leverage: "Up to 1:1000",
    copyTradingLink: "https://my.hfm.com/en/copy-trading/provider-details.html?provider=69185730",
    signupLink: "https://register.hfm.com/ke/en/new-live-account/?refid=30374049",
    recommended: true,
  },
  {
    id: "justmarkets",
    name: "Just Markets",
    logo: "/justmarkets-logo.webp",
    description: "Fast-growing broker with competitive spreads and copy trading",
    features: [
      "Copy trading platform",
      "Competitive spreads",
      "Fast execution",
      "Multiple account types",
    ],
    minDeposit: "$100",
    leverage: "Up to 1:1000",
    copyTradingLink: "https://justmarkets.com/spa/copytrading/leaderboard/52812",
    signupLink: "https://one.justmarkets.link/a/f2fxc0kmhk",
    recommended: false,
  },
  {
    id: "exness",
    name: "Exness",
    logo: "/exness-icon.jpeg",
    description: "Global leader in online trading with Social Trading platform (Coming Soon)",
    features: [
      "Social Trading platform",
      "Instant withdrawals",
      "Tight spreads from 0.0",
      "No commissions on Standard accounts",
    ],
    minDeposit: "$10",
    leverage: "Up to 1:2000",
    copyTradingLink: "https://social.exness.com/copy-trading?ref=readypips",
    signupLink: "https://www.exness.com/accounts/register/?ref=readypips",
    recommended: false,
  },
];

export default function CopyTradingPage() {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="h-1 w-16 bg-green-600 rounded-full mx-auto"></div>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Copy Trading
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Automatically copy trades from our professional traders directly to your broker account. 
            Start earning passive income with minimal effort.
          </p>
        </div>
      </section>

      {/* Info Alert */}
      <section className="py-8 px-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 text-blue-600 dark:text-blue-400 mt-1">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How It Works</h3>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  We primarily use HFM for copy trading. Create an account with HFM using our referral link, 
                  then connect to our copy trading service. Your account will automatically mirror our professional traders' positions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white dark:bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-green-600 mb-2">127%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Avg. Annual Return
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-green-600 mb-2">2.5K+</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Copy Traders
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-green-600 mb-2">$5.2M</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Total Copied Volume
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Profitable Months
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brokers Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="h-1 w-16 bg-green-600 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose Your Broker
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              We primarily recommend HFM for copy trading. Select from our partner brokers below. 
              Don't have an account? Create one using our referral links for exclusive benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {brokers.map((broker) => (
              <Card
                key={broker.id}
                className={`bg-white dark:bg-black border shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col ${
                  broker.recommended ? "border-2 border-green-600 relative" : "border-gray-200 dark:border-gray-800"
                }`}
              >
                {broker.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </div>
                  </div>
                )}
                <CardHeader className="text-center border-b border-gray-200 dark:border-gray-800 pb-6">
                  <div className="h-16 flex items-center justify-center mb-6">
                    <img
                      src={broker.logo}
                      alt={`${broker.name} logo`}
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white mb-3">
                    {broker.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                    {broker.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Minimum Deposit</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {broker.minDeposit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Maximum Leverage</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {broker.leverage}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Features</p>
                    {broker.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                      onClick={() => {
                        if (broker.id === "exness") {
                          toast.info("Exness copy trading coming soon! We'll notify you when it's available.", {
                            description: "We're working on getting the Exness affiliate link approved. Stay tuned!"
                          });
                        } else {
                          toast.success(`Opening ${broker.name} copy trading platform...`);
                          window.open(broker.copyTradingLink, "_blank");
                        }
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Start Copy Trading
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 font-semibold"
                      onClick={() => {
                        if (broker.id === "exness") {
                          toast.info("Exness registration coming soon! We'll notify you when it's available.", {
                            description: "We're working on getting the Exness affiliate link approved. Stay tuned!"
                          });
                        } else {
                          toast.success(`Opening ${broker.name} registration page...`);
                          window.open(broker.signupLink, "_blank");
                        }
                      }}
                    >
                      Create Account
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Start Section */}
      <section className="py-16 px-4 bg-white dark:bg-black">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="h-1 w-16 bg-green-600 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How to Start Copy Trading
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-lg font-bold text-green-600">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Choose Your Broker
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We primarily recommend HFM for copy trading. Select one of our partner brokers based on 
                  reliability, features, and copy trading capabilities that best suit your needs.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-lg font-bold text-green-600">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Create an Account
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you don't already have an account, click "Create Account" to sign up using our referral link. 
                  This ensures you get direct access to our copy trading service with exclusive benefits.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-lg font-bold text-green-600">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Connect to Copy Trading
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Click "Start Copy Trading" to connect your broker account to our master trading account. 
                  Follow the broker's instructions to complete the setup process.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-lg font-bold text-green-600">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Start Earning
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Once connected, your account will automatically copy all trades from our professional traders. 
                  Monitor your progress and adjust settings as needed to optimize your returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 text-blue-600 dark:text-blue-400 mt-1">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Affiliate Disclosure</h3>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  We may receive compensation when you use our referral links to create accounts with our partner brokers. 
                  This helps support our platform and services. Note: Some affiliate links are being updated as we receive approval from brokers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-12 px-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Risk Disclaimer</h3>
                <p className="text-yellow-800 dark:text-yellow-300 text-sm leading-relaxed">
                  Trading involves substantial risk of loss. Past performance does not guarantee future results. 
                  Only trade with money you can afford to lose. Copy trading carries the same risks as manual trading. 
                  Please ensure you understand the risks before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
