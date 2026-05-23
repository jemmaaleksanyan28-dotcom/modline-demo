import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { findDemoUserById, publicDemoUser } from "@/lib/demo-auth";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const user = findDemoUserById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user: publicDemoUser(user) });
}

export async function DELETE() {
  return NextResponse.json({ message: "Demo mode: users are not deleted on Vercel demo." });
}
