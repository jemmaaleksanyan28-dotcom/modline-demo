import { NextRequest, NextResponse } from "next/server";
import { createToken, setAuthCookie } from "@/lib/auth";
import { findDemoUserByEmail, publicDemoUser } from "@/lib/demo-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limited = checkRateLimit(`login:${ip}`, 20, 60_000);
    if (!limited.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = findDemoUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken(user);
    await setAuthCookie(token);

    return NextResponse.json({
      user: publicDemoUser(user),
      message: "Demo login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
