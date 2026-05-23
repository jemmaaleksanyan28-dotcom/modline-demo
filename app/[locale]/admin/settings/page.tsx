"use client";

import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Store, CreditCard, Bell, Save } from "lucide-react";
import { useSettingsStore } from "@/lib/stores/settings-store";

export default function AdminSettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { settings, updateSettings } = useSettingsStore();

  const handleSave = () => {
    toast.success(locale === "fa" ? "تنظیمات ذخیره شد" : "Settings saved");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.settings")}</h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store size={20} />
              {locale === "fa" ? "تنظیمات فروشگاه" : "Store Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === "fa" ? "نام فروشگاه" : "Store Name"}</Label>
                <Input value={settings.storeName} onChange={(e) => updateSettings({ storeName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{locale === "fa" ? "ایمیل فروشگاه" : "Store Email"}</Label>
                <Input type="email" value={settings.storeEmail} onChange={(e) => updateSettings({ storeEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{locale === "fa" ? "تلفن فروشگاه" : "Store Phone"}</Label>
                <Input value={settings.storePhone} onChange={(e) => updateSettings({ storePhone: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              {locale === "fa" ? "تنظیمات پرداخت" : "Payment Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === "fa" ? "کد مرچنت زرین‌پال" : "ZarinPal Merchant ID"}</Label>
              <Input
                value={settings.zarinpalMerchantId}
                onChange={(e) => updateSettings({ zarinpalMerchantId: e.target.value })}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
              <p className="text-sm text-muted-foreground">
                {locale === "fa"
                  ? "برای پرداخت واقعی، مقدار ZARINPAL_MERCHANT_ID را در .env.production و این بخش را برای مشاهده ادمین نگه دارید."
                  : "For real payments, set ZARINPAL_MERCHANT_ID in .env.production and keep this field for admin visibility."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              {locale === "fa" ? "تنظیمات اعلان‌ها" : "Notification Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{locale === "fa" ? "اعلان ایمیل" : "Email Notifications"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "دریافت اعلان سفارش‌ها از طریق ایمیل" : "Receive order notifications by email"}
                </p>
              </div>
              <Switch checked={settings.enableNotifications} onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{locale === "fa" ? "اعلان پیامک" : "SMS Notifications"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "دریافت اعلان‌ها از طریق پیامک ایرانی" : "Receive notifications through an Iranian SMS provider"}
                </p>
              </div>
              <Switch checked={settings.enableSMS} onCheckedChange={(checked) => updateSettings({ enableSMS: checked })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              {locale === "fa" ? "حالت تعمیرات" : "Maintenance Mode"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{locale === "fa" ? "حالت تعمیرات" : "Maintenance Mode"}</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "وضعیت در همین مرورگر ذخیره می‌شود؛ برای production باید به دیتابیس تنظیمات وصل شود." : "This state is persisted in this browser; production should connect it to a settings table."}
                </p>
              </div>
              <Switch checked={settings.maintenanceMode} onCheckedChange={(checked) => updateSettings({ maintenanceMode: checked })} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="gap-2">
          <Save size={18} />
          {locale === "fa" ? "ذخیره تنظیمات" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
