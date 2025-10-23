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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import PricingPlans from "@/components/pricing-plans";
import { toast } from "sonner";

type PaymentProvider = "stripe" | "paystack" | "pesapal";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<string | null>(null);
  const [hasPendingSubscription, setHasPendingSubscription] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>("pesapal");
  const router = useRouter();

  useEffect(() => {
    // Check if user has an active subscription
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch subscription status
      fetch("/api/subscriptions/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subscription) {
            setCurrentPlan(data.subscription.type);
            setCurrentEndDate(data.subscription.endDate);
            setHasPendingSubscription(!!data.subscription.pendingSubscription);
          }
        })
        .catch((err) => console.error("Error fetching subscription status:", err));
    }
  }, []);

  const handlePlanSelect = async (plan: string) => {
    // Check if user is on a paid plan (not free)
    const isOnPaidPlan = currentPlan && currentPlan !== "free" && currentEndDate;
    
    if (isOnPaidPlan) {
      // Show confirmation dialog for paid plan users
      const expiryDate = new Date(currentEndDate!).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      const planNames: Record<string, string> = {
        basic: "Weekly Plan",
        premium: "Monthly Plan",
        pro: "3 Months Plan"
      };
      
      const currentPlanName = planNames[currentPlan] || currentPlan;
      
      const confirmed = confirm(
        `You are currently on the ${currentPlanName} which expires on ${expiryDate}.\n\n` +
        `Your new subscription will be scheduled to start after your current plan expires.\n\n` +
        `Do you want to continue?`
      );
      
      if (!confirmed) {
        return;
      }

      toast.info(`Your new plan will activate on ${expiryDate}`, {
        duration: 5000
      });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to subscribe to a plan");
        // Save current page to redirect back after login
        router.push("/login?redirect=/subscription");
        return;
      }

      // Use Pesapal endpoint
      const endpoint = "/api/payments/create-pesapal";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: plan,
          provider: "pesapal",
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        if (data.hasActiveSubscription) {
          alert(
            "You already have an active subscription. Please contact support to change your plan."
          );
          setCurrentPlan("active");
        } else {
          throw new Error(data.error || "No checkout URL received");
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Error creating checkout session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Access Signal Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock powerful trading signals and advanced market analysis with
            our premium plans
          </p>

          {/* Current Subscription Badge */}
          {currentPlan && currentPlan !== "free" && (
            <div className="mt-6 flex justify-center">
              <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
                Current Plan: {currentPlan === "basic" ? "Weekly" : currentPlan === "premium" ? "Monthly" : "3 Months"}
                {currentEndDate && ` • Expires ${new Date(currentEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </Badge>
            </div>
          )}

          {/* Pending Subscription Alert */}
          {hasPendingSubscription && (
            <div className="mt-4 max-w-xl mx-auto p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ️ You have a pending subscription that will activate when your current plan expires.
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        {!currentPlan && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-black dark:text-white">
                  Choose Payment Method
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Secure Kenyan payments with Pesapal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="h-16 bg-orange-600 hover:bg-orange-700 text-white px-8"
                      onClick={() => setSelectedProvider("pesapal")}
                    >
                      <div className="flex flex-col items-center">
                        <CreditCard className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Pay with Pesapal</span>
                        <span className="text-xs opacity-90">M-Pesa, Cards & More</span>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Payment methods info */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-3">
                      <strong>Available Payment Methods:</strong>
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>M-Pesa</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Airtel Money</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Visa Card</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Mastercard</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                      💳 Secure payments powered by PesaPal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mb-16">
          <PricingPlans 
            showGetStarted={false}
            onPlanSelect={handlePlanSelect}
            loading={loading}
            currentPlan={currentPlan}
            selectedProvider={selectedProvider}
          />
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-black dark:text-white">
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

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-black dark:text-white">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    How do I get started?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose your plan, select your payment method, and you&apos;ll
                    have immediate access to our trading signals and analysis
                    tools.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    Can I cancel my subscription?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, you can cancel your subscription at any time. Your
                    access will continue until the end of your current billing
                    period.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    We accept all major credit cards through Stripe and local
                    payment methods through Paystack for our African users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
