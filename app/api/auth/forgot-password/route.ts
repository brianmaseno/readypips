import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // Check if email is verified before allowing password reset
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email address before resetting your password." },
        { status: 400 }
      );
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordReset.deleteMany({
      where: { email: user.email },
    });

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Store reset token in database
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send email using NodeMailer
    const emailSent = await sendEmail({
      to: user.email,
      ...emailTemplates.passwordReset(user.firstName || 'there', resetUrl)
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password reset link sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to send reset link" },
      { status: 500 }
    );
  }
}
