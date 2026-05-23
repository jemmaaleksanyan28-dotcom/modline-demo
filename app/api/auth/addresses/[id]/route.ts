import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { demoAddresses } from "@/lib/demo-auth";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const list = demoAddresses[payload.userId] || [];
  let updated = null;

  demoAddresses[payload.userId] = list.map((address) => {
    if (body.isDefault) address = { ...address, isDefault: false };
    if (address.id !== id) return address;
    updated = { ...address, ...body, isDefault: Boolean(body.isDefault ?? address.isDefault) };
    return updated;
  });

  if (!updated) return NextResponse.json({ error: "Address not found" }, { status: 404 });
  return NextResponse.json({ address: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const list = demoAddresses[payload.userId] || [];
  demoAddresses[payload.userId] = list.filter((address) => address.id !== id);
  return NextResponse.json({ ok: true });
}
