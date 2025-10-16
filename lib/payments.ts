import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  stripePriceId?: string;
  paystackPlanCode?: string;
  pesapalPlanCode?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "weekly",
    name: "Weekly",
    price: 13.00,
    currency: "USD",
    duration: 7,
    features: [
      "15 signals per day",
      "Basic market analysis",
      "Email notifications",
      "Mobile app access",
      "Basic technical indicators",
      "Market news updates",
    ],
    stripePriceId: "price_weekly",
    paystackPlanCode: "PLN_weekly",
    pesapalPlanCode: "PES_weekly",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 29.00,
    currency: "USD",
    duration: 30,
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
    stripePriceId: "price_monthly",
    paystackPlanCode: "PLN_monthly",
    pesapalPlanCode: "PES_monthly",
  },
  {
    id: "annually",
    name: "Annually",
    price: 129.00,
    currency: "USD",
    duration: 365,
    features: [
      "Unlimited signals",
      "AI-powered analysis",
      "WhatsApp notifications",
      "24/7 support",
      "Custom indicators",
      "API access",
      "Advanced risk management",
      "Multi-account support",
      "Dedicated account manager",
      "Custom strategies",
      "2 months free (save $58)",
    ],
    stripePriceId: "price_annually",
    paystackPlanCode: "PLN_annually",
    pesapalPlanCode: "PES_annually",
  },
];

export async function createStripeCheckoutSession(
  planId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const plan = subscriptionPlans.find((p) => p.id === planId);
  if (!plan) {
    throw new Error("Invalid plan ID");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: `${plan.name} Subscription`,
            description: plan.features.join(", "),
          },
          unit_amount: Math.round(plan.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
      planName: plan.name,
    },
  });

  return session.url!;
}

export async function initializePaystack(
  planId: string,
  userEmail: string,
  amount: number // amount in cents (KES)
): Promise<{ reference: string; authorization_url: string }> {
  const plan = subscriptionPlans.find((p) => p.id === planId);
  if (!plan) {
    throw new Error("Invalid plan ID");
  }

  // Check if Paystack secret key is available
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key not configured");
  }

  const reference = `ref_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;

  try {
    // Real Paystack API call
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          amount: amount, // in cents (smallest unit for KES)
          currency: "KES", // Kenyan Shilling
          reference: reference,
          callback_url: `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/subscription/success`,
          metadata: {
            planId: planId,
            planName: plan.name,
            custom_fields: [
              {
                display_name: "Plan",
                variable_name: "plan",
                value: plan.name,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Paystack API error: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (data.status && data.data) {
      return {
        reference: data.data.reference,
        authorization_url: data.data.authorization_url,
      };
    } else {
      throw new Error("Invalid response from Paystack API");
    }
  } catch (error) {
    console.error("Paystack API error:", error);
    throw error;
  }
}

export function validateStripeWebhook(payload: string, signature: string): any {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
}

export function validatePaystackWebhook(
  payload: any,
  signature: string
): boolean {
  // Real Paystack webhook validation
  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error("Paystack secret key not configured for webhook validation");
    return false;
  }

  try {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("Error validating Paystack webhook:", error);
    return false;
  }
}

// Helper function to verify Paystack transaction
export async function verifyPaystackTransaction(
  reference: string
): Promise<any> {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key not configured");
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Paystack verification error: ${
          errorData.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error);
    throw error;
  }
}

// Pesapal Integration Functions
export interface PesapalOrderRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  redirect_mode?: string;
  notification_id?: string; // Optional for testing
  branch?: string;
  billing_address: {
    phone_number?: string;
    email_address?: string;
    country_code?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: any;
  status: string;
  message?: string;
}

export async function initializePesapal(
  planId: string,
  userEmail: string,
  userPhone: string,
  userFirstName: string,
  userLastName: string,
  amount: number // amount in KES
): Promise<{ order_tracking_id: string; redirect_url: string }> {
  const plan = subscriptionPlans.find((p) => p.id === planId);
  if (!plan) {
    throw new Error("Invalid plan ID");
  }

  // Test mode: Use 10 KES for all packages during testing
  const isTestMode = process.env.NODE_ENV === 'development' || process.env.PESAPAL_TEST_MODE === 'true';
  const testAmount = 10.00; // 10 KES for testing
  
  if (isTestMode) {
    console.log(`🧪 [Pesapal Test Mode] Using ${testAmount} KES instead of ${amount} KES for ${plan.name} package`);
    amount = testAmount;
  }

  // Check if Pesapal credentials are available
  if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
    throw new Error("Pesapal credentials not configured");
  }

  // Mock mode for testing without valid credentials
  const isMockMode = process.env.PESAPAL_MOCK_MODE === 'true';
  if (isMockMode) {
    console.log("🧪 [Pesapal Mock Mode] Simulating successful payment creation");
    return {
      order_tracking_id: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      redirect_url: "https://cybqa.pesapal.com/pesapaliframe/PesapalIframe3/Index/?OrderTrackingId=mock_order_123",
    };
  }

  const merchantReference = `ref_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;

  try {
    // Step 1: Get Pesapal access token
    console.log("🔍 Requesting Pesapal access token...");
    console.log("🔍 Consumer Key:", process.env.PESAPAL_CONSUMER_KEY ? "Present" : "Missing");
    console.log("🔍 Consumer Secret:", process.env.PESAPAL_CONSUMER_SECRET ? "Present" : "Missing");
    
    const tokenRequest = {
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    };
    
    console.log("🔍 Token request payload:", tokenRequest);

    // Use production endpoints for real credentials
    const isProduction = process.env.PESAPAL_USE_PRODUCTION === 'true';
    const baseUrl = isProduction 
      ? "https://pay.pesapal.com/v3/api" 
      : "https://cybqa.pesapal.com/pesapalv3/api";
    
    console.log(`🔍 Using ${isProduction ? 'PRODUCTION' : 'SANDBOX'} endpoints: ${baseUrl}`);

    const tokenResponse = await fetch(`${baseUrl}/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "ReadyPips/1.0",
      },
      body: JSON.stringify(tokenRequest),
    });

    console.log("🔍 Token response status:", tokenResponse.status);
    console.log("🔍 Token response headers:", Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("❌ Token request failed:", errorText);
      throw new Error(`Failed to get Pesapal access token: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log("🔍 Token response data:", tokenData);
    
    // Check for API errors
    if (tokenData.error) {
      const errorCode = tokenData.error.code || 'unknown_error';
      const errorMessage = tokenData.error.message || 'No error message provided';
      
      if (errorCode === 'invalid_consumer_key_or_secret_provided') {
        throw new Error("Invalid Pesapal credentials. Please check your Consumer Key and Consumer Secret. Make sure you're using sandbox credentials for testing.");
      } else {
        throw new Error(`Pesapal API error: ${errorCode} - ${errorMessage}`);
      }
    }
    
    const accessToken = tokenData.token;

    if (!accessToken) {
      throw new Error("No access token received from Pesapal");
    }

    console.log("✅ Pesapal access token obtained");

    // Step 2: Create Pesapal order
    const orderRequest: PesapalOrderRequest = {
      id: merchantReference,
      currency: "KES",
      amount: amount,
      description: `Ready Pips ${plan.name} Subscription`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/signals/success`,
      redirect_mode: "TOP_WINDOW",
      branch: "Ready Pips - HQ",
      billing_address: {
        email_address: userEmail,
        phone_number: userPhone,
        country_code: "KE",
        first_name: userFirstName,
        last_name: userLastName,
      },
    };

    // Only add notification_id if it's a valid UUID (not a placeholder)
    const notificationId = process.env.PESAPAL_NOTIFICATION_ID;
    if (notificationId && 
        notificationId !== "your_pesapal_notification_id" && 
        notificationId !== "" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(notificationId)) {
      orderRequest.notification_id = notificationId;
      console.log("🔍 Using valid notification_id:", notificationId);
    } else {
      console.log("🔍 No notification_id configured - IPN notifications disabled");
    }

    console.log("🔍 Creating Pesapal order with data:", orderRequest);

    const orderResponse = await fetch(`${baseUrl}/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderRequest),
    });

    console.log("🔍 Order response status:", orderResponse.status);
    console.log("🔍 Order response headers:", Object.fromEntries(orderResponse.headers.entries()));

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("Order creation failed:", errorText);
      throw new Error(`Pesapal order creation failed: ${orderResponse.status} ${errorText}`);
    }

    const orderData: PesapalOrderResponse = await orderResponse.json();
    console.log("🔍 Order creation response:", orderData);

    if (orderData.status === "200" && orderData.redirect_url) {
      return {
        order_tracking_id: orderData.order_tracking_id,
        redirect_url: orderData.redirect_url,
      };
    } else {
      const errorMessage = orderData.error ? JSON.stringify(orderData.error) : orderData.message || "Unknown error";
      throw new Error(`Pesapal order failed: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Pesapal API error:", error);
    throw error;
  }
}

// Helper function to verify Pesapal transaction
export async function verifyPesapalTransaction(
  orderTrackingId: string
): Promise<any> {
  if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
    throw new Error("Pesapal credentials not configured");
  }

  try {
    // Use production endpoints for real credentials
    const isProduction = process.env.PESAPAL_USE_PRODUCTION === 'true';
    const baseUrl = isProduction 
      ? "https://pay.pesapal.com/v3/api" 
      : "https://cybqa.pesapal.com/pesapalv3/api";

    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get Pesapal access token for verification");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.token;

    // Get transaction status
    const response = await fetch(
      `${baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Pesapal verification error: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Pesapal transaction:", error);
    throw error;
  }
}

export function validatePesapalWebhook(
  payload: any,
  signature: string
): boolean {
  // Pesapal webhook validation
  if (!process.env.PESAPAL_WEBHOOK_SECRET) {
    console.error("Pesapal webhook secret not configured");
    return false;
  }

  try {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", process.env.PESAPAL_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("Error validating Pesapal webhook:", error);
    return false;
  }
}
