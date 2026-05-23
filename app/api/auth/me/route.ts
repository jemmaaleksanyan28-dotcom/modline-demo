import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { findDemoUserById, publicDemoUser } from "@/lib/demo-auth";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ user: null }, { status: 200 });

    const user = findDemoUserById(payload.userId);
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({ user: publicDemoUser(user) });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const current = findDemoUserById(payload.userId);
    if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const user = publicDemoUser({
      ...current,
      firstName: body.firstName || current.firstName,
      lastName: body.lastName || current.lastName,
      email: body.email || current.email,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
