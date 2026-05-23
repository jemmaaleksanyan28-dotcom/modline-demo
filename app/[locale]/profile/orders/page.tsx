"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useOrdersStore } from "@/lib/stores/orders-store";
import { formatPrice } from "@/lib/format";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";

export default function OrdersPage() {
  const t = useTranslations();
  const locale = useLocale() as "fa" | "en";
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const { orders, setOrders } = useOrdersStore();
  const isRTL = locale === "fa";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    let alive = true;
    fetch("/api/orders")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (alive && data?.orders) setOrders(data.orders);
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [isAuthenticated, isInitialized, router, locale, setOrders]);

  const userOrders = orders.filter((o) => o.userId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${locale}/profile`}>
          <Button variant="ghost" size="icon">
            <ArrowIcon size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package size={24} />
          {t("profile.orders")}
        </h1>
      </div>

      {userOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("profile.noOrders")}</h2>
          <p className="text-muted-foreground mb-6">
            {locale === "fa" ? "هنوز سفارشی ثبت نکرده‌اید" : "You haven't placed any orders yet"}
          </p>
          <Link href={`/${locale}/products`}>
            <Button>{t("nav.shop")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold">
                      {locale === "fa" ? "شماره سفارش:" : "Order #"} {order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {t(`order.status.${order.status}`)}
                    </span>
                    <span className="font-bold text-lg">
                      {formatPrice(order.total, locale)}
                    </span>
                  </div>
                </div>

                {order.trackingCode && (
                  <div className="border-t pt-4 mb-4 text-sm">
                    <span className="text-muted-foreground">{locale === "fa" ? "کد رهگیری:" : "Tracking:"}</span>{" "}
                    <span className="font-medium">{order.trackingCode}</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-16 h-20 bg-muted rounded overflow-hidden">
                          <img
                            src={item.product.images[0] || "/placeholder.jpg"}
                            alt={item.product.name[locale]}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">
                            {item.product.name[locale]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} | {item.color} | x{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
