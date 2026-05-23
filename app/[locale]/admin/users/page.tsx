"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/lib/stores/orders-store";
import { Users, Trash2, RefreshCw } from "lucide-react";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { orders } = useOrdersStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const orderCountByUser = useMemo(() => {
    return orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.userId] = (acc[order.userId] || 0) + 1;
      return acc;
    }, {});
  }, [orders]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data.users || []);
    } catch (error) {
      toast.error(locale === "fa" ? "خطا در دریافت کاربران" : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (user: User) => {
    const confirmed = window.confirm(
      locale === "fa"
        ? `کاربر «${user.firstName} ${user.lastName}» حذف شود؟`
        : `Delete “${user.firstName} ${user.lastName}”?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Delete failed");
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success(locale === "fa" ? "کاربر حذف شد" : "User deleted");
    } catch (error) {
      toast.error(locale === "fa" ? "حذف کاربر انجام نشد" : "Could not delete user");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">{t("admin.users")}</h2>
        <Button variant="outline" onClick={fetchUsers} className="gap-2">
          <RefreshCw size={16} />
          {locale === "fa" ? "به‌روزرسانی" : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            {isLoading ? (locale === "fa" ? "در حال بارگذاری..." : "Loading...") : `${users.length} ${locale === "fa" ? "کاربر" : "Users"}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-start font-medium">{t("admin.userName")}</th>
                  <th className="pb-3 text-start font-medium">{t("auth.email")}</th>
                  <th className="pb-3 text-start font-medium">{locale === "fa" ? "نقش" : "Role"}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.registrationDate")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.totalOrders")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-muted rounded-full text-sm">
                        {user.role === "admin" ? (locale === "fa" ? "ادمین" : "Admin") : (locale === "fa" ? "کاربر" : "User")}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString(locale)}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-muted rounded-full text-sm">
                        {orderCountByUser[user.id] || 0}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteUser(user)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
