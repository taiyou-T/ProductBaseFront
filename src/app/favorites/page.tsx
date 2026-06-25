"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ClientAdvertisementBanner } from "@/components/advertisements/ClientAdvertisementBanner";
import type { PaginatedResponse, Product } from "@/types";

export default function FavoritesPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api<PaginatedResponse<Product>>("/favorites", {}, token)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">お気に入り</h1>
        <ClientAdvertisementBanner placement="favorites" />
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </RequireAuth>
  );
}
