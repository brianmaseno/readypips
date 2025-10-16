"use client";

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
import { CheckCircle, ArrowRight } from "lucide-react";

interface PricingPlansProps {
  showGetStarted?: boolean;
  onPlanSelect?: (plan: string) => void;
  className?: string;
  loading?: boolean;
  currentPlan?: string | null;
  selectedProvider?: string;
}

const plans = [
  {
    name: "Weekly",
    price: "$13",
    period: "/week",
    features: [
      "15 signals per day",
      "Basic market analysis",
      "Email notifications",
      "Mobile app access",
      "Basic technical indicators",
      "Market news updates",
    ],
    popular: false,
  },
  {
    name: "Monthly",
    price: "$29",
    period: "/month",
    features: [
      "35 signals per day",
      "Advanced market analysis",
      "Real-time notifications",
      "Priority support",
      "Advanced technical indicators",
      "AI-powered insights",
      "Risk management tools",
      "Portfolio tracking",
    ],
    popular: true,
  },
  {
    name: "3 Months",
    price: "$79",
    period: "/3 months",
    features: [
      "Unlimited signals",
      "Advanced market analysis",
      "Real-time notifications",
      "Priority support",
      "Advanced technical indicators",
      "AI-powered insights",
      "Risk management tools",
      "Portfolio tracking",
      "Extended analysis",
    ],
    popular: false,
  },
  {
    name: "6 Months",
    price: "$149",
    period: "/6 months",
    features: [
      "Unlimited signals",
      "AI-powered analysis",
      "WhatsApp notifications",
      "24/7 support",
      "Custom indicators",
      "API access",
      "Advanced risk management",
      "Multi-account support",
      "Dedicated support",
      "Save $25 vs monthly",
    ],
    popular: false,
  },
];

export default function PricingPlans({
  showGetStarted = true,
  onPlanSelect,
  className = "",
  loading = false,
  currentPlan = null,
  selectedProvider = "stripe",
}: PricingPlansProps) {
  const handlePlanAction = (planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planName);
    }
  };

  return (
    <div className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ${className}`}>
      {plans.map((plan, index) => (
        <Card
          key={index}
          className={`relative hover:shadow-lg transition-all duration-200 bg-white dark:bg-black flex flex-col ${
            plan.popular
              ? "border-2 border-green-600"
              : "border-gray-200 dark:border-gray-800"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-600 text-white px-3 py-1">
                Most Popular
              </Badge>
            </div>
          )}

          <CardHeader className="text-center flex-shrink-0">
            <CardTitle className="text-2xl text-black dark:text-white">
              {plan.name}
            </CardTitle>
            <div className="text-4xl font-bold text-green-600">
              {plan.price}
              <span className="text-lg text-gray-600 dark:text-gray-400">
                {plan.period}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-end space-y-4">
            {/* Features are hidden for now */}
            {/* <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {feature}
                </li>
              ))}
            </ul> */}

            {showGetStarted ? (
              <Link href="/register">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white font-semibold`}
                onClick={() => handlePlanAction(plan.name)}
                disabled={loading || currentPlan === "active"}
              >
                {loading
                  ? "Processing..."
                  : currentPlan === "active"
                  ? "Active Subscription"
                  : `Subscribe Now`}
                {!loading && currentPlan !== "active" && (
                  <ArrowRight className="ml-2 w-4 h-4" />
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
