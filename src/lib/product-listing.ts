import type { Product } from "@/types";

export function mergePrProducts(products: Product[], prProducts: Product[] = []): Product[] {
  if (prProducts.length === 0) {
    return products;
  }

  const prIds = new Set(prProducts.map((product) => product.id));

  return [...prProducts, ...products.filter((product) => !prIds.has(product.id))];
}
