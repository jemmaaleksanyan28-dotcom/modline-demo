import { NextRequest, NextResponse } from "next/server";
import { createToken, setAuthCookie } from "@/lib/auth";
import type { DemoUserRecord } from "@/lib/demo-auth";
import { demoAddresses, findDemoUserByEmail, publicDemoUser } from "@/lib/demo-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limited = checkRateLimit(`register:${ip}`, 10, 60_000);
    if (!limited.allowed) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (findDemoUserByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user: DemoUserRecord = {
      id: `demo-registered-${Date.now()}`,
      email,
      password,
      firstName,
      lastName,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoAddresses[user.id] = [];

    const token = await createToken(user);
    await setAuthCookie(token);

    return NextResponse.json({ user: publicDemoUser(user), message: "Demo registration successful" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
