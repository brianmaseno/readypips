import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { validatePesapalWebhook, verifyPesapalTransaction } from "@/lib/payments";
import { updateUserSubscription } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [Pesapal Webhook] Received webhook notification');
    
    const body = await request.json();
    const signature = request.headers.get("x-pesapal-signature") || "";
    
    console.log('🔍 [Pesapal Webhook] Body:', body);
    console.log('🔍 [Pesapal Webhook] Signature:', signature);

    // Pesapal doesn't use webhook signatures - proceed without validation
    console.log('✅ [Pesapal Webhook] Processing webhook (no signature validation needed)');
    
    // Optional: Check if webhook is enabled in production
    if (process.env.NODE_ENV === 'production' && !process.env.PESAPAL_WEBHOOK_ENABLED) {
      console.log('⚠️ [Pesapal Webhook] Webhook disabled in production');
      return NextResponse.json({ error: "Webhook disabled" }, { status: 503 });
    }

    const { 
      OrderTrackingId, 
      OrderNotificationType, 
      OrderMerchantReference 
    } = body;
    
    // Map Pesapal fields to our expected format
    const order_tracking_id = OrderTrackingId;
    const payment_status = "COMPLETED"; // Assume completed if webhook is sent
    const merchant_reference = OrderMerchantReference;

    if (!order_tracking_id || !payment_status) {
      console.error('❌ [Pesapal Webhook] Missing required fields');
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log('🔍 [Pesapal Webhook] Processing payment:', {
      order_tracking_id,
      payment_status,
      merchant_reference,
      OrderNotificationType
    });

    const db = await getDatabase();
    const paymentsCollection = db.collection("payments");

    // Find the payment record
    const paymentRecord = await paymentsCollection.findOne({
      sessionId: order_tracking_id,
      provider: "pesapal"
    });

    if (!paymentRecord) {
      console.error('❌ [Pesapal Webhook] Payment record not found:', order_tracking_id);
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    console.log('✅ [Pesapal Webhook] Payment record found:', paymentRecord._id);

    // Verify the transaction with Pesapal API
    try {
      const verificationData = await verifyPesapalTransaction(order_tracking_id);
      console.log('🔍 [Pesapal Webhook] Verification data:', verificationData);

      // Update payment record
      const updateData = {
        status: payment_status === "COMPLETED" ? "completed" : "pending",
        paymentData: verificationData,
        updatedAt: new Date(),
      };

      await paymentsCollection.updateOne(
        { sessionId: order_tracking_id },
        { $set: updateData }
      );

      console.log('✅ [Pesapal Webhook] Payment record updated');

      // If payment is completed, update user subscription
      if (payment_status === "COMPLETED") {
        const planId = paymentRecord.planId;
        const userId = paymentRecord.userId;

        if (planId && userId) {
          // Calculate subscription end date based on plan
          const subscriptionEndDate = new Date();
          const planDuration = planId === "weekly" ? 7 : planId === "monthly" ? 30 : 365;
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + planDuration);

          await updateUserSubscription(userId, {
            subscriptionStatus: "active",
            subscriptionType: planId as "basic" | "premium" | "pro",
            subscriptionEndDate,
          });

          console.log('✅ [Pesapal Webhook] User subscription updated:', {
            userId,
            planId,
            subscriptionEndDate
          });
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: "Webhook processed successfully" 
      });

    } catch (verificationError) {
      console.error('❌ [Pesapal Webhook] Verification failed:', verificationError);
      
      // Still update the payment record with the webhook data
      await paymentsCollection.updateOne(
        { sessionId: order_tracking_id },
        { 
          $set: {
            status: payment_status === "COMPLETED" ? "completed" : "pending",
            paymentData: body,
            updatedAt: new Date(),
          }
        }
      );

      return NextResponse.json({ 
        success: true, 
        message: "Webhook processed with verification error" 
      });
    }

  } catch (error) {
    console.error("❌ [Pesapal Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification (if needed)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: "Pesapal webhook endpoint is active",
    timestamp: new Date().toISOString()
  });
}
