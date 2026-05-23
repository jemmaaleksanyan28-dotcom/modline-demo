"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const fillDemoLogin = (type: "admin" | "user") => {
    if (type === "admin") {
      setEmail("admin@modline.local");
      setPassword("admin123");
      return;
    }
    setEmail("user@modline.local");
    setPassword("user123456");
  };

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("redirect");
    setRedirectPath(value);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const authenticatedUser = await login(email.trim().toLowerCase(), password);
    if (authenticatedUser) {
      router.push(
        redirectPath ||
          `/${locale}/${authenticatedUser.role === "admin" ? "admin" : "profile"}`
      );
      router.refresh();
    }
  };

  const registerHref = redirectPath
    ? `/${locale}/auth/register?redirect=${encodeURIComponent(redirectPath)}`
    : `/${locale}/auth/register`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("auth.login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                t("auth.login")
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm">
            <p className="mb-3 font-medium text-foreground">
              {locale === "fa" ? "ورود سریع برای نمایش روی Vercel" : "Quick demo login for Vercel"}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={() => fillDemoLogin("admin")}>
                {locale === "fa" ? "پر کردن ادمین" : "Fill admin"}
              </Button>
              <Button type="button" variant="outline" onClick={() => fillDemoLogin("user")}>
                {locale === "fa" ? "پر کردن کاربر" : "Fill user"}
              </Button>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground ltr:text-left rtl:text-right">
              <p>Admin: admin@modline.local / admin123</p>
              <p>User: user@modline.local / user123456</p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link
              href={registerHref}
              className="text-foreground font-medium hover:underline"
            >
              {t("auth.register")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
