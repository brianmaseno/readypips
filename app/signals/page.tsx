"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  Target,
  CreditCard,
  CreditCardIcon,
  MessageCircle,
  Crown,
  TrendingUp,
  Bell,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/components/auth-context";
import PricingPlans from "@/components/pricing-plans";
import { toast } from "sonner";
import { 
  ShimmerSubscriptionStatus, 
  ShimmerPricingCard, 
  ShimmerCard,
  ShimmerButton,
  Shimmer
} from "@/components/ui/shimmer";

type PaymentProvider = "stripe" | "paystack" | "pesapal";

// FAQ Data
const faqData = [
  {
    question: "How do I get started?",
    answer: "Choose your plan, select your payment method, and you'll have immediate access to our trading signals and analysis tools."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through Stripe and local payment methods through Paystack for our African users."
  },
  {
    question: "How accurate are your trading signals?",
    answer: "Our signals are generated using advanced algorithms with high accuracy rates. We continuously monitor and improve our performance."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, contact our support team."
  }
];

export default function SignalsPage() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("pesapal");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Check if user has an active subscription
    const token = localStorage.getItem("token");
    if (token) {
      setSubscriptionLoading(true);
      fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.subscriptionStatus === "active") {
            setCurrentPlan(data.user.subscriptionType);
            setSubscriptionStatus("active");
          } else {
            setSubscriptionStatus(data.user?.subscriptionStatus || "inactive");
          }
        })
        .catch((err) => console.error("Error fetching user data:", err))
        .finally(() => {
          setSubscriptionLoading(false);
        });
    } else {
      setSubscriptionLoading(false);
    }
  }, []);

  const handlePlanSelect = async (plan: string) => {
    if (subscriptionStatus === "active") {
      toast.error("You already have an active subscription. Please contact support to change your plan.");
      return;
    }

    setLoading(true);
    toast.loading("Setting up payment...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to subscribe");
        router.push("/login");
        return;
      }

      // Map plan names to API-expected values
      let planId = plan.toLowerCase();
      if (plan === "Weekly") planId = "weekly";
      if (plan === "Monthly") planId = "monthly";
      if (plan === "Annually") planId = "annually";

      console.log("🔍 [Plan Selection] Debug Info:");
      console.log("  - Original plan:", plan);
      console.log("  - Mapped planId:", planId);
      console.log("  - Selected provider:", selectedProvider);

      // Use different endpoints based on payment provider
      const endpoint =
        selectedProvider === "stripe"
          ? "/api/payments/create-checkout"
          : selectedProvider === "paystack"
          ? "/api/payments/create-paystack"
          : "/api/payments/create-pesapal";

      toast.loading(`Creating ${selectedProvider} checkout session...`);

      const requestBody = {
        plan: planId,
        provider: selectedProvider,
        successUrl: `${window.location.origin}/signals/success`,
        cancelUrl: `${window.location.origin}/signals`,
      };

      console.log("🔍 [Plan Selection] Request body:", requestBody);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log("🔍 [Plan Selection] API Response:", {
        status: response.status,
        data: data
      });

      if (response.ok && data.url) {
        toast.success(`Redirecting to ${selectedProvider} checkout...`);
        // Small delay to show success message
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      } else {
        if (data.hasActiveSubscription) {
          toast.error("You already have an active subscription. Please contact support to change your plan.");
          setSubscriptionStatus("active");
        } else {
          // Handle Pesapal-specific errors
          if (selectedProvider === "pesapal" && data.error?.includes("temporarily unavailable")) {
            toast.error("Pesapal is temporarily unavailable. Please try Paystack or Stripe instead.");
            return;
          }
          throw new Error(data.error || "No checkout URL received");
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Error creating checkout session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramAccess = () => {
    toast.success("Opening Telegram channel...");
    // This would typically open a Telegram bot or channel link
    window.open("https://t.me/readypips_signals", "_blank");
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trading Signals Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access powerful trading signals, market analysis, and exclusive Telegram channel
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="max-w-4xl mx-auto mb-12">
          {subscriptionLoading ? (
            <ShimmerSubscriptionStatus />
          ) : (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
                             <CardHeader className="text-center">
                 <CardTitle className="text-2xl text-gray-900 dark:text-white flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                   <Crown className="w-8 h-8 text-yellow-500" />
                   <span>Your Subscription Status</span>
                 </CardTitle>
               </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Badge className="text-lg font-bold">
                        {subscriptionStatus === "active" ? currentPlan?.toUpperCase() || "PREMIUM" : "BASIC"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Current Plan</h3>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Signal Access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subscriptionStatus === "active" ? "Full Access" : "Basic Access"}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Telegram Channel</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subscriptionStatus === "active" ? "Access Granted" : "Upgrade to Access"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Telegram Access for Subscribers */}
        {subscriptionStatus === "active" && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="text-center">
                                 <CardTitle className="text-xl text-gray-900 dark:text-white flex flex-col sm:flex-row items-center justify-center gap-2">
                   <MessageCircle className="w-6 h-6 text-blue-600" />
                   <span>Exclusive Telegram Channel Access</span>
                 </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Join our private Telegram channel for real-time signals and market updates
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={handleTelegramAccess}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Join Telegram Channel
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Get instant notifications for new signals and market opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Method Selection - Only show if no active subscription */}
        {subscriptionStatus !== "active" && (
          <div className="max-w-4xl mx-auto mb-12">
            {subscriptionLoading ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
                <div className="space-y-6">
                  <Shimmer className="h-8 w-64 rounded mx-auto" />
                  <Shimmer className="h-6 w-96 rounded mx-auto" />
                  <div className="flex justify-center">
                    <Shimmer className="h-12 w-48 rounded-lg" />
                  </div>
                  <Shimmer className="h-6 w-80 rounded mx-auto" />
                </div>
              </div>
            ) : (
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-black dark:text-white">
                    Choose Payment Method
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                    Select your preferred payment provider to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Payment Method - Pesapal Only */}
                  <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <button
                        onClick={() => setSelectedProvider("pesapal")}
                        className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-5 h-5" />
                          <span>Pesapal</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Payment Method Info */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Secure Kenyan payments with Pesapal
                      </span>
                    </div>
                    
                    {/* Pesapal Payment Options Image */}
                    <div className="mt-4">
                      <img 
                        src="/pesapal-payment-options.png" 
                        alt="Pesapal Payment Options - M-Pesa, Airtel Money, Visa, Mastercard, and more"
                        className="mx-auto max-w-md w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Available payment methods: M-Pesa, Airtel Money, Visa, Mastercard, and more
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Pricing Cards - Only show if no active subscription */}
        {subscriptionStatus !== "active" && (
          <div className="mb-16">
            {subscriptionLoading ? (
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ShimmerPricingCard key={i} />
                ))}
              </div>
            ) : (
              <PricingPlans 
                showGetStarted={false}
                onPlanSelect={handlePlanSelect}
                loading={loading}
                currentPlan={currentPlan}
                selectedProvider={selectedProvider}
              />
            )}
          </div>
        )}

        {/* Features for Subscribers */}
        {subscriptionStatus === "active" && (
          <div className="mb-16">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-black dark:text-white text-2xl">
                  Your Premium Features
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Unlock the full potential of Ready Pips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      Real-Time Signals
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Get instant trading signals with high accuracy rates
                    </p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      Advanced Analysis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Access to premium market analysis and insights
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      Community Access
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Join our exclusive Telegram community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Comparison */}
        <div className="mt-16">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
                             <CardTitle className="text-center text-black dark:text-white text-2xl">
                 Why Choose Ready Pips?
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Real-Time Signals
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get instant trading signals with high accuracy rates
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Risk Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced risk management tools to protect your capital
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Global Markets
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Access to forex, crypto, and stock markets worldwide
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section with Accordions */}
        <div className="mt-16">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-black dark:text-white text-2xl">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Everything you need to know about Ready Pips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="font-semibold text-black dark:text-white text-lg">
                        {faq.question}
                      </span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
