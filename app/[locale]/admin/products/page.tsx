"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStore } from "@/lib/stores/product-store";
import { formatPrice } from "@/lib/format";
import { Search, Plus, Edit, Trash2, Save, X, RotateCcw, Upload } from "lucide-react";
import type { Product } from "@/lib/types";

type ProductForm = {
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  descriptionEn: string;
  price: string;
  originalPrice: string;
  brand: string;
  category: string;
  subcategory: string;
  stockCount: string;
  gender: Product["gender"];
  sizes: string;
  tags: string;
  image: string;
};

const emptyForm: ProductForm = {
  nameFa: "",
  nameEn: "",
  descriptionFa: "",
  descriptionEn: "",
  price: "",
  originalPrice: "",
  brand: "Modline Studio",
  category: "tops",
  subcategory: "general",
  stockCount: "10",
  gender: "unisex",
  sizes: "S, M, L, XL",
  tags: "fashion, modline",
  image: "/images/fashion/product-1.webp",
};

function toForm(product: Product): ProductForm {
  return {
    nameFa: product.name.fa,
    nameEn: product.name.en,
    descriptionFa: product.description.fa,
    descriptionEn: product.description.en,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    stockCount: String(product.stockCount),
    gender: product.gender,
    sizes: product.sizes.join(", "),
    tags: product.tags.join(", "),
    image: product.images[0] || "/images/fashion/product-1.webp",
  };
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminProductsPage() {
  const t = useTranslations();
  const locale = useLocale() as "fa" | "en";
  const { products, addProduct, updateProduct, deleteProduct, setProducts } = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/products")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (alive && data?.products) setProducts(data.products);
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [setProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      return (
        product.name.fa.toLowerCase().includes(query) ||
        product.name.en.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  const openAddForm = () => {
    setEditingProductId(null);
    setForm({ ...emptyForm, image: `/images/fashion/product-${(products.length % 20) + 1}.webp` });
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProductId(product.id);
    setForm(toForm(product));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProductId(null);
    setForm(emptyForm);
  };


  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(locale === "fa" ? "فقط فایل عکس قابل قبول است" : "Only image files are allowed");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast.error(locale === "fa" ? "حجم عکس باید کمتر از ۶ مگابایت باشد" : "Image must be under 6MB");
      return;
    }

    setIsUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.url) throw new Error(data?.error || "upload_failed");
      setForm((current) => ({ ...current, image: data.url }));
      toast.success(locale === "fa" ? "عکس آپلود شد" : "Image uploaded");
    } catch {
      toast.error(locale === "fa" ? "آپلود عکس ناموفق بود" : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const price = Number(form.price);
    const stockCount = Number(form.stockCount || 0);
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : undefined;

    if (!form.nameFa.trim() || !form.nameEn.trim() || !price || price <= 0) {
      toast.error(locale === "fa" ? "نام فارسی، نام انگلیسی و قیمت معتبر الزامی است" : "Valid names and price are required");
      return;
    }

    const payload = {
      name: { fa: form.nameFa.trim(), en: form.nameEn.trim() },
      description: {
        fa: form.descriptionFa.trim() || form.nameFa.trim(),
        en: form.descriptionEn.trim() || form.nameEn.trim(),
      },
      price,
      originalPrice,
      images: [form.image.trim() || "/images/fashion/product-1.webp"],
      category: form.category.trim() || "tops",
      subcategory: form.subcategory.trim() || "general",
      brand: form.brand.trim() || "Modline Studio",
      sizes: splitList(form.sizes).length ? splitList(form.sizes) : ["M"],
      colors: [{ name: { fa: "مشکی", en: "Black" }, hex: "#000000" }],
      inStock: stockCount > 0,
      stockCount,
      tags: splitList(form.tags),
      gender: form.gender,
      isNew: !editingProductId,
      isSale: Boolean(originalPrice && originalPrice > price),
    };

    try {
      const response = await fetch(editingProductId ? `/api/admin/products/${editingProductId}` : "/api/admin/products", {
        method: editingProductId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.product) throw new Error(data?.error || "save_failed");

      if (editingProductId) {
        updateProduct(editingProductId, data.product);
        toast.success(locale === "fa" ? "محصول ویرایش شد" : "Product updated");
      } else {
        addProduct(data.product);
        toast.success(locale === "fa" ? "محصول اضافه شد" : "Product added");
      }
      closeForm();
    } catch {
      toast.error(locale === "fa" ? "ذخیره محصول ناموفق بود" : "Product save failed");
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      locale === "fa"
        ? `محصول «${product.name.fa}» حذف شود؟`
        : `Delete “${product.name.en}”?`
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
      deleteProduct(product.id);
      toast.success(locale === "fa" ? "محصول حذف شد" : "Product deleted");
    } catch {
      toast.error(locale === "fa" ? "حذف محصول ناموفق بود" : "Product delete failed");
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("/api/admin/products/reset", { method: "POST" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.products) throw new Error("reset_failed");
      setProducts(data.products);
      toast.success(locale === "fa" ? "کاتالوگ بازنشانی شد" : "Catalog reset");
    } catch {
      toast.error(locale === "fa" ? "بازنشانی ناموفق بود" : "Reset failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">{t("admin.products")}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleReset}>
            <RotateCcw size={18} />
            {locale === "fa" ? "بازنشانی" : "Reset"}
          </Button>
          <Button className="gap-2" onClick={openAddForm}>
            <Plus size={18} />
            {t("admin.addProduct")}
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <CardTitle>{editingProductId ? t("admin.editProduct") : t("admin.addProduct")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام فارسی</Label>
                <Input value={form.nameFa} onChange={(e) => setForm({ ...form, nameFa: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>English name</Label>
                <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>توضیح فارسی</Label>
                <Textarea value={form.descriptionFa} onChange={(e) => setForm({ ...form, descriptionFa: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>English description</Label>
                <Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>قیمت تومان</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>قیمت قبل از تخفیف</Label>
                <Input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>برند</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>زیر دسته</Label>
                <Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>موجودی</Label>
                <Input type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>جنسیت</Label>
                <select
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as Product["gender"] })}
                >
                  <option value="women">زنانه</option>
                  <option value="men">مردانه</option>
                  <option value="kids">بچگانه</option>
                  <option value="unisex">عمومی</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>سایزها با کاما</Label>
                <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label>عکس محصول</Label>
                <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-start">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg border bg-muted">
                    {form.image ? (
                      <img src={form.image} alt="Product preview" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isUploading}
                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      />
                      <Button type="button" variant="outline" disabled={isUploading} className="gap-2">
                        <Upload size={16} />
                        {isUploading ? (locale === "fa" ? "در حال آپلود..." : "Uploading...") : (locale === "fa" ? "آپلود سریع" : "Upload")}
                      </Button>
                    </div>
                    <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                    <p className="text-xs text-muted-foreground">
                      {locale === "fa"
                        ? "عکس آپلودشده داخل /public/uploads/products ذخیره می‌شود. برای سرعت داخل ایران، عکس خارجی نگذار؛ عکس WebP یا JPG سبک بهتر است."
                        : "Uploaded images are stored in /public/uploads/products. For speed, avoid external images in production."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>برچسب‌ها با کاما</Label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeForm} className="gap-2">
                <X size={16} />
                {locale === "fa" ? "انصراف" : "Cancel"}
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Save size={16} />
                {locale === "fa" ? "ذخیره محصول" : "Save Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={locale === "fa" ? "جستجوی محصولات..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} {locale === "fa" ? "محصول" : "Products"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-start font-medium">{t("admin.image")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.productName")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.category")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.price")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.stock")}</th>
                  <th className="pb-3 text-start font-medium">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3">
                      <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                        <img src={product.images[0]} alt={product.name[locale]} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-medium line-clamp-1">{product.name[locale]}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{product.category}</td>
                    <td className="py-3">
                      <p className="font-medium">{formatPrice(product.price, locale)}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice, locale)}
                        </p>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {product.inStock ? `${locale === "fa" ? "موجود" : "In Stock"} (${product.stockCount})` : locale === "fa" ? "ناموجود" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(product)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
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
