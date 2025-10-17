import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, findAdminById, hasPermission, AdminPermission } from "@/lib/admin";
import { getDatabase } from "@/lib/mongodb";

async function verifyAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return { valid: false, error: "No token provided" };
  }

  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return { valid: false, error: "Invalid token" };
  }

  const admin = await findAdminById(decoded.adminId);
  if (!admin || !admin.isActive) {
    return { valid: false, error: "Admin not found or inactive" };
  }

  return { valid: true, admin };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const admin = auth.admin!;
    const db = await getDatabase();

    // Fetch real data from database
    const totalSubscribers = await db.collection("users").countDocuments();
    
    const activeSubscriptions = await db.collection("subscriptions").countDocuments({
      status: { $in: ["active", "trial"] }
    });
    
    const expiredSubscriptions = await db.collection("subscriptions").countDocuments({
      status: "expired"
    });
    
    const trialSubscriptions = await db.collection("subscriptions").countDocuments({
      status: "trial"
    });

    // Calculate revenue
    const subscriptionData = await db.collection("subscriptions").find({
      status: "active"
    }).toArray();
    
    const totalRevenue = subscriptionData.reduce((sum: number, sub: any) => sum + (sub.price || 0), 0);
    
    // Calculate weekly revenue (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyData = await db.collection("subscriptions").find({
      status: "active",
      startDate: { $gte: weekAgo }
    }).toArray();
    const weeklyRevenue = weeklyData.reduce((sum: number, sub: any) => sum + (sub.price || 0), 0);
    
    // Calculate daily revenue (last 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyData = await db.collection("subscriptions").find({
      status: "active",
      startDate: { $gte: dayAgo }
    }).toArray();
    const dailyRevenue = dailyData.reduce((sum: number, sub: any) => sum + (sub.price || 0), 0);

    // Tool access metrics
    const toolAccessMetrics = await db.collection("tools").countDocuments({ isActive: true });

    const stats = {
      totalSubscribers,
      activeSubscribers: activeSubscriptions,
      expiredSubscribers: expiredSubscriptions,
      trialSubscribers: trialSubscriptions,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      weeklyRevenue: parseFloat(weeklyRevenue.toFixed(2)),
      dailyRevenue: parseFloat(dailyRevenue.toFixed(2)),
      toolAccessMetrics,
      systemUptime: "99.8%",
      supportTickets: 0,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
