"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
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

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">お気に入り</h1>
      <ProductGrid products={products} />
    </div>
  );
}
