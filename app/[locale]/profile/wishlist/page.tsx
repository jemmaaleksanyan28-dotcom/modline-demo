"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { products } from "@/lib/data/products";
import { formatPrice, getLocalizedString } from "@/lib/format";
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const isRTL = locale === "fa";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const wishlistProducts = items
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is (typeof products)[number] => Boolean(product));

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [isAuthenticated, isInitialized, router, locale]);

  const handleAddToCart = (product: (typeof products)[number]) => {
    addToCart(product, product.sizes[0] || "M", product.colors[0]?.name.en || "Default", 1);
    removeItem(product.id);
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
          <Heart size={24} />
          {t("profile.wishlist")}
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("wishlist.empty")}</h2>
          <p className="text-muted-foreground mb-6">{t("wishlist.emptyDescription")}</p>
          <Link href={`/${locale}/products`}>
            <Button>{t("nav.shop")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="group relative">
              <Link href={`/${locale}/products/${product.id}`}>
                <div className="aspect-[3/4] relative overflow-hidden bg-muted rounded-lg mb-3">
                  <img
                    src={product.images[0] || "/placeholder.png"}
                    alt={getLocalizedString(product.name, locale)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              <button
                onClick={() => removeItem(product.id)}
                className="absolute top-2 end-2 p-2 bg-white rounded-full shadow-md hover:bg-destructive hover:text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2">
                  {getLocalizedString(product.name, locale)}
                </h3>
                <p className="font-bold">{formatPrice(product.price, locale)}</p>
                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag size={16} />
                  {t("product.addToCart")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
