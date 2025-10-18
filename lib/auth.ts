import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "./mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface User {
  _id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  subscriptionStatus: "active" | "inactive" | "expired";
  subscriptionType: "basic" | "premium" | "pro" | null;
  subscriptionEndDate?: Date;
  emailVerified?: boolean;
  emailVerifiedAt?: Date;
  provider?: "credentials" | "google";
  googleId?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(
  userData: Omit<User, "_id" | "createdAt" | "updatedAt">
): Promise<User> {
  const db = await getDatabase();
  const hashedPassword = await hashPassword(userData.password!);

  const user = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("users").insertOne(user);
  return { ...user, _id: result.insertedId.toString() };
}

export async function findUser(email: string): Promise<User | null> {
  const db = await getDatabase();
  const user = await db.collection("users").findOne({ email });
  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    subscriptionStatus: user.subscriptionStatus || "inactive",
    subscriptionType: user.subscriptionType || null,
    subscriptionEndDate: user.subscriptionEndDate,
    emailVerified: user.emailVerified || false,
    emailVerifiedAt: user.emailVerifiedAt,
    provider: user.provider || "credentials",
    googleId: user.googleId,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  const { ObjectId } = require("mongodb");
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    subscriptionStatus: user.subscriptionStatus || "inactive",
    subscriptionType: user.subscriptionType || null,
    subscriptionEndDate: user.subscriptionEndDate,
    emailVerified: user.emailVerified || false,
    emailVerifiedAt: user.emailVerifiedAt,
    provider: user.provider || "credentials",
    googleId: user.googleId,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    subscriptionStatus: "active" | "inactive" | "expired";
    subscriptionType: "basic" | "premium" | "pro";
    subscriptionEndDate: Date;
  }
): Promise<void> {
  const db = await getDatabase();
  const { ObjectId } = require("mongodb");

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...subscriptionData,
        updatedAt: new Date(),
      },
    }
  );
}
