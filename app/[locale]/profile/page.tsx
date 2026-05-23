"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useOrdersStore } from "@/lib/stores/orders-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { formatPrice } from "@/lib/format";
import { User, Package, Heart, MapPin, LogOut, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, logout, updateProfile } = useAuthStore();
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", email: "" });
  const { orders } = useOrdersStore();
  const { items: wishlistItems } = useWishlistStore();
  const isRTL = locale === "fa";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, isInitialized, router, locale]);

  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    }
  }, [user]);

  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">
          {locale === "fa" ? "در حال بارگذاری..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  const handleSaveProfile = async () => {
    const ok = await updateProfile(profileForm);
    if (ok) {
      toast.success(locale === "fa" ? "پروفایل ذخیره شد" : "Profile saved");
    } else {
      toast.error(locale === "fa" ? "ذخیره پروفایل انجام نشد" : "Could not save profile");
    }
  };

  const userOrders = orders.filter((o) => o.userId === user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("profile.myAccount")}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              {t("profile.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("auth.firstName")}</Label>
              <Input value={profileForm.firstName} onChange={(event) => setProfileForm({ ...profileForm, firstName: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.lastName")}</Label>
              <Input value={profileForm.lastName} onChange={(event) => setProfileForm({ ...profileForm, lastName: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input type="email" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} />
            </div>
            <Button onClick={handleSaveProfile} className="w-full gap-2">
              <Save size={16} />
              {t("profile.saveChanges")}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.quickLinks")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={`/${locale}/profile/orders`}>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Package size={18} />
                  {t("profile.orders")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground">{userOrders.length}</span>
                  <ChevronIcon size={16} />
                </span>
              </Button>
            </Link>
            <Link href={`/${locale}/profile/wishlist`}>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Heart size={18} />
                  {t("profile.wishlist")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground">{wishlistItems.length}</span>
                  <ChevronIcon size={16} />
                </span>
              </Button>
            </Link>
            <Link href={`/${locale}/profile/addresses`}>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <MapPin size={18} />
                  {t("profile.addresses")}
                </span>
                <ChevronIcon size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              {t("profile.recentOrders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("profile.noOrders")}</p>
            ) : (
              <div className="space-y-3">
                {userOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center text-sm border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">#{order.id.slice(0, 8)}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="font-medium">{formatPrice(order.total, locale)}</p>
                      <p className={`text-xs ${
                        order.status === "delivered" ? "text-green-600" :
                        order.status === "processing" ? "text-yellow-600" :
                        "text-muted-foreground"
                      }`}>
                        {t(`order.status.${order.status}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut size={18} />
          {t("auth.logout")}
        </Button>
      </div>
    </div>
  );
}
