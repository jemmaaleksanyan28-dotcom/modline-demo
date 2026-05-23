"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ArrowLeft, ArrowRight, MapPin, Plus, Trash2, Star } from "lucide-react";
import type { Address } from "@/lib/types";

type AddressForm = Omit<Address, "id">;

const emptyAddress: AddressForm = {
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "ایران",
  isDefault: false,
};

export default function AddressesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "fa";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const {
    user,
    isAuthenticated,
    isInitialized,
    addAddress,
    removeAddress,
    setDefaultAddress,
    fetchUser,
  } = useAuthStore();
  const [form, setForm] = useState<AddressForm>(emptyAddress);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, isInitialized, router, locale]);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        firstName: current.firstName || user.firstName,
        lastName: current.lastName || user.lastName,
      }));
    }
  }, [user]);

  if (!isInitialized || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        {locale === "fa" ? "در حال بارگذاری..." : "Loading..."}
      </div>
    );
  }

  const saveAddress = async () => {
    if (!form.firstName || !form.lastName || !form.addressLine1 || !form.city || !form.state || !form.postalCode) {
      toast.error(locale === "fa" ? "فیلدهای اصلی آدرس الزامی است" : "Main address fields are required");
      return;
    }

    setIsSaving(true);
    const ok = await addAddress({ ...form, isDefault: (user.addresses || []).length === 0 || form.isDefault });
    setIsSaving(false);

    if (ok) {
      toast.success(locale === "fa" ? "آدرس ذخیره شد" : "Address saved");
      setForm({ ...emptyAddress, firstName: user.firstName, lastName: user.lastName });
      await fetchUser();
    } else {
      toast.error(locale === "fa" ? "ذخیره آدرس انجام نشد" : "Could not save address");
    }
  };

  const deleteAddress = async (address: Address) => {
    const confirmed = window.confirm(locale === "fa" ? "این آدرس حذف شود؟" : "Delete this address?");
    if (!confirmed) return;
    const ok = await removeAddress(address.id);
    if (ok) {
      toast.success(locale === "fa" ? "آدرس حذف شد" : "Address deleted");
      await fetchUser();
    }
  };

  const makeDefault = async (address: Address) => {
    const ok = await setDefaultAddress(address.id);
    if (ok) {
      toast.success(locale === "fa" ? "آدرس پیش‌فرض شد" : "Default address updated");
      await fetchUser();
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
          <MapPin size={24} />
          {t("profile.addresses")}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={18} />
              {locale === "fa" ? "افزودن آدرس" : "Add Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{t("auth.firstName")}</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{t("auth.lastName")}</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>{locale === "fa" ? "موبایل" : "Phone"}</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{locale === "fa" ? "آدرس" : "Address"}</Label>
              <Input value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{locale === "fa" ? "آدرس خط ۲" : "Address line 2"}</Label>
              <Input value={form.addressLine2 || ""} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{locale === "fa" ? "شهر" : "City"}</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{locale === "fa" ? "استان" : "Province"}</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{locale === "fa" ? "کد پستی" : "Postal code"}</Label>
                <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{locale === "fa" ? "کشور" : "Country"}</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <Button onClick={saveAddress} disabled={isSaving} className="w-full gap-2">
              <Plus size={16} />
              {isSaving ? (locale === "fa" ? "در حال ذخیره..." : "Saving...") : locale === "fa" ? "ثبت آدرس" : "Save Address"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {(user.addresses || []).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {locale === "fa" ? "هنوز آدرسی ثبت نشده است." : "No addresses saved yet."}
              </CardContent>
            </Card>
          ) : (
            (user.addresses || []).map((address) => (
              <Card key={address.id}>
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{address.firstName} {address.lastName}</p>
                      {address.isDefault && (
                        <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          {locale === "fa" ? "پیش‌فرض" : "Default"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                    {address.addressLine2 && <p className="text-sm text-muted-foreground">{address.addressLine2}</p>}
                    <p className="text-sm text-muted-foreground">{address.city}، {address.state}، {address.postalCode}</p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => makeDefault(address)} className="gap-2">
                        <Star size={14} />
                        {locale === "fa" ? "پیش‌فرض" : "Default"}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-destructive gap-2" onClick={() => deleteAddress(address)}>
                      <Trash2 size={14} />
                      {locale === "fa" ? "حذف" : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
