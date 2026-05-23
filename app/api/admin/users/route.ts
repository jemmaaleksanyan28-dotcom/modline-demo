import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listPublicDemoUsers } from "@/lib/demo-auth";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ users: listPublicDemoUsers() });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
