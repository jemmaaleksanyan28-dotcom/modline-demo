"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrdersStore } from "@/lib/stores/orders-store";
import { useProductStore } from "@/lib/stores/product-store";
import { formatPrice } from "@/lib/format";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const t = useTranslations();
  const locale = useLocale() as "fa" | "en";
  const { orders, setOrders } = useOrdersStore();
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.orders) setOrders(data.orders); })
      .catch(() => undefined);
    fetch("/api/admin/products")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.products) setProducts(data.products); })
      .catch(() => undefined);
  }, [setOrders, setProducts]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  const stats = [
    {
      title: t("admin.totalProducts"),
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: t("admin.totalOrders"),
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: t("admin.pendingOrders"),
      value: pendingOrders.toString(),
      icon: TrendingUp,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: t("admin.revenue"),
      value: formatPrice(totalRevenue, locale),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.dashboard")}</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.recentOrders")}</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {locale === "fa" ? "سفارشی وجود ندارد" : "No orders yet"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-start">
                    <th className="pb-3 text-start font-medium">{t("admin.orderId")}</th>
                    <th className="pb-3 text-start font-medium">{t("admin.customer")}</th>
                    <th className="pb-3 text-start font-medium">{t("admin.date")}</th>
                    <th className="pb-3 text-start font-medium">{t("admin.total")}</th>
                    <th className="pb-3 text-start font-medium">{t("admin.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                      <td className="py-3">{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(locale)}
                      </td>
                      <td className="py-3 font-medium">{formatPrice(order.total, locale)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t(`order.status.${order.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
