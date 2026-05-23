"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrdersStore } from "@/lib/stores/orders-store";
import { formatPrice } from "@/lib/format";

export default function AdminOrdersPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { orders, updateOrderStatus, updateTracking, setOrders, upsertOrder } = useOrdersStore();

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/orders")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (alive && data?.orders) setOrders(data.orders);
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [setOrders]);

  const patchOrder = async (orderId: string, payload: { status?: string; trackingCode?: string; adminNote?: string }) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.order) upsertOrder(data.order);
  };

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status as any);
    patchOrder(orderId, { status }).catch(() => undefined);
  };

  const handleTrackingChange = (orderId: string, trackingCode: string, adminNote?: string) => {
    updateTracking(orderId, trackingCode, adminNote);
    patchOrder(orderId, { trackingCode, adminNote }).catch(() => undefined);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.orders")}</h2>

      <Card>
        <CardHeader>
          <CardTitle>
            {orders.length} {locale === "fa" ? "سفارش" : "Orders"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {locale === "fa" ? "سفارشی وجود ندارد" : "No orders yet"}
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{t("order.status.pending")}</SelectItem>
                          <SelectItem value="paid">{t("order.status.paid")}</SelectItem>
                          <SelectItem value="processing">{t("order.status.processing")}</SelectItem>
                          <SelectItem value="shipped">{t("order.status.shipped")}</SelectItem>
                          <SelectItem value="delivered">{t("order.status.delivered")}</SelectItem>
                          <SelectItem value="cancelled">{t("order.status.cancelled")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="font-bold text-lg">
                        {formatPrice(order.total, locale)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">{t("checkout.shippingInfo")}</p>
                      <p>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p>{order.shippingAddress.postalCode}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t("admin.orderItems")}</p>
                      <div className="space-y-1 mb-4">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {item.product.name[locale]} x{item.quantity} -{" "}
                            {formatPrice(item.product.price * item.quantity, locale)}
                          </p>
                        ))}
                      </div>
                      <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                        <Input
                          defaultValue={order.trackingCode || ""}
                          placeholder={locale === "fa" ? "کد رهگیری ارسال" : "Shipment tracking code"}
                          onBlur={(event) => handleTrackingChange(order.id, event.target.value, order.adminNote)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, "shipped")}
                        >
                          {locale === "fa" ? "ارسال شد" : "Mark shipped"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
