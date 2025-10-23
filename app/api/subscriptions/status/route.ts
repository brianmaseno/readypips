import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

/**
 * API endpoint to get user's current subscription status and countdown
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const db = await getDatabase();
    const userId = new ObjectId(decoded.userId);

    // Get user subscription data
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentDate = new Date();
    const subscriptionEndDate = user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
    
    let daysRemaining = 0;
    let hoursRemaining = 0;
    let isExpiringSoon = false;
    let isExpired = false;

    // Check if user is on free plan
    const isFreePlan = !user.subscriptionType || user.subscriptionType === "free";

    if (subscriptionEndDate && !isFreePlan) {
      const timeDiff = subscriptionEndDate.getTime() - currentDate.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      hoursRemaining = Math.ceil(timeDiff / (1000 * 60 * 60));
      
      isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
      isExpired = daysRemaining <= 0;

      // Auto-expire if subscription is past end date - revert to free plan
      if (isExpired && user.subscriptionStatus === "active") {
        await db.collection("users").updateOne(
          { _id: userId },
          {
            $set: {
              subscriptionStatus: "active",
              subscriptionType: "free",
              subscriptionEndDate: null,
              updatedAt: new Date()
            }
          }
        );
        user.subscriptionStatus = "active";
        user.subscriptionType = "free";
        user.subscriptionEndDate = null;
      }
    }

    // If no subscription type set, default to free plan
    if (!user.subscriptionType) {
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            subscriptionStatus: "active",
            subscriptionType: "free",
            subscriptionEndDate: null,
            updatedAt: new Date()
          }
        }
      );
      user.subscriptionStatus = "active";
      user.subscriptionType = "free";
    }

    return NextResponse.json({
      success: true,
      subscription: {
        status: user.subscriptionStatus || "active",
        type: user.subscriptionType || "free",
        startDate: user.subscriptionStartDate || null,
        endDate: subscriptionEndDate?.toISOString() || null,
        daysRemaining: isFreePlan ? Infinity : daysRemaining,
        hoursRemaining: isFreePlan ? Infinity : hoursRemaining,
        isExpiringSoon: isFreePlan ? false : isExpiringSoon,
        isExpired: isFreePlan ? false : isExpired,
        isActive: user.subscriptionStatus === "active",
        isFreePlan,
        pendingSubscription: user.pendingSubscription || null
      },
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error("❌ [Subscription Status] Error:", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
