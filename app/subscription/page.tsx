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

type PaymentProvider = "stripe" | "paystack" | "pesapal";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>("pesapal");
  const router = useRouter();

  useEffect(() => {
    // Check if user has an active subscription
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.subscriptionStatus === "active") {
            setCurrentPlan(data.user.subscriptionType);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, []);

  const handlePlanSelect = async (plan: string) => {
    if (currentPlan === "active") {
      alert(
        "You already have an active subscription. Please contact support to change your plan."
      );
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe");
        router.push("/login");
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
                        <span className="text-sm font-medium">Pesapal</span>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Pesapal Payment Options Image */}
                  <div className="mt-4">
                    <img 
                      src="/pesapal-payment-options.png" 
                      alt="Pesapal Payment Options - M-Pesa, Airtel Money, Visa, Mastercard, and more"
                      className="mx-auto max-w-sm w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Available payment methods: M-Pesa, Airtel Money, Visa, Mastercard, and more
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
                    Choose your plan, select your payment method, and you'll
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
