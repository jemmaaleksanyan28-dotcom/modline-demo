"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const isRTL = locale === "fa";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        router.push(`/${locale}/auth/login`);
      } else if (user?.role !== "admin") {
        router.push(`/${locale}`);
      }
    }
  }, [isAuthenticated, isInitialized, user, router, locale]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {locale === "fa" ? "در حال بارگذاری..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: t("admin.dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/products`,
      label: t("admin.products"),
      icon: Package,
    },
    {
      href: `/${locale}/admin/orders`,
      label: t("admin.orders"),
      icon: ShoppingCart,
    },
    {
      href: `/${locale}/admin/users`,
      label: t("admin.users"),
      icon: Users,
    },
    {
      href: `/${locale}/admin/settings`,
      label: t("admin.settings"),
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`}>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <ArrowIcon size={20} />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">{t("admin.panel")}</h1>
          </div>
          <div className="text-sm">
            {locale === "fa" ? "خوش آمدید" : "Welcome"}, {user?.firstName}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="bg-background rounded-lg p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-background rounded-lg p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
