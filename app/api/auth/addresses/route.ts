import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { demoAddresses, findDemoUserById } from "@/lib/demo-auth";
import type { Address } from "@/lib/types";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ addresses: demoAddresses[payload.userId] || [] });
}

export async function POST(request: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = findDemoUserById(payload.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const existing = demoAddresses[payload.userId] || [];
  const shouldBeDefault = body.isDefault || existing.length === 0;
  const address: Address = {
    id: `demo-address-${Date.now()}`,
    firstName: body.firstName || user.firstName,
    lastName: body.lastName || user.lastName,
    phone: body.phone || "",
    addressLine1: body.addressLine1 || "آدرس نمونه",
    addressLine2: body.addressLine2 || "",
    city: body.city || "تهران",
    state: body.state || "تهران",
    postalCode: body.postalCode || "0000000000",
    country: body.country || "ایران",
    isDefault: Boolean(shouldBeDefault),
  };

  demoAddresses[payload.userId] = shouldBeDefault
    ? [address, ...existing.map((item) => ({ ...item, isDefault: false }))]
    : [address, ...existing];

  return NextResponse.json({ address }, { status: 201 });
}
