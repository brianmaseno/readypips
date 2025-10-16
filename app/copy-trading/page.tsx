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
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto text-center">
          <Badge
            className="mb-4 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
            variant="outline"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Trading
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            Copy Our Professional Traders
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Automatically copy trades from our expert traders directly to your
            broker account through HFM. Start earning passive income today.
          </p>
        </div>
      </section>

      {/* Info Alert */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>How it works:</strong> We primarily use HFM for copy trading. Create an
              account with HFM using our affiliate link, then connect to our copy
              trading service. Your account will automatically mirror our
              professional traders&apos; positions.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+127%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Avg. Annual Return
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">2.5K+</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Copy Traders
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$5.2M</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Total Copied Volume
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Profitable Months
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brokers Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">
              Choose Your Broker
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              We primarily recommend HFM for copy trading. Select from our partner brokers below. Don&apos;t
              have an account? Create one using our referral links for exclusive
              benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {brokers.map((broker) => (
              <Card
                key={broker.id}
                className={`bg-white dark:bg-black border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 flex flex-col ${
                  broker.recommended ? "border-2 border-green-600 relative" : ""
                }`}
              >
                {broker.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white">
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img
                      src={broker.logo}
                      alt={`${broker.name} logo`}
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl text-black dark:text-white">
                    {broker.name}
                  </CardTitle>
                  <CardDescription className="text-gray-700 dark:text-gray-300">
                    {broker.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Min. Deposit:
                      </span>
                      <span className="font-semibold text-black dark:text-white">
                        {broker.minDeposit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Leverage:
                      </span>
                      <span className="font-semibold text-black dark:text-white">
                        {broker.leverage}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1 flex-1">
                    {broker.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
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
                      className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white"
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
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black dark:text-white">
            How to Start Copy Trading
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                  Choose a Broker
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We primarily recommend HFM for copy trading. Select one of our partner brokers above based on reliability, features, and copy trading capabilities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                  Create an Account
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  If you don&apos;t have an account, click &quot;Create
                  Account&quot; to sign up using our referral link. This ensures
                  you get access to our copy trading service.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                  Connect to Copy Trading
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Click &quot;Start Copy Trading&quot; to connect your broker
                  account to our master trading account. Follow the
                  broker&apos;s instructions to complete the setup.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                  Start Earning
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Once connected, your account will automatically copy all
                  trades from our professional traders. Monitor your profits and
                  adjust settings as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Affiliate Disclosure:</strong> We may receive compensation when you use our referral links to create accounts with our partner brokers. This helps support our platform and services. Note: Some affiliate links are being updated as we get approval from brokers.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <strong>Risk Disclaimer:</strong> Trading involves substantial
              risk of loss. Past performance does not guarantee future results.
              Only trade with money you can afford to lose. Copy trading carries
              the same risks as manual trading.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  );
}
