import type { Category } from "@/types";
import { serverApi } from "@/lib/api";

export async function getPublicCategories(): Promise<Category[]> {
  try {
    const res = await serverApi<{ data: Category[] }>("/public/categories");
    return res.data;
  } catch {
    return [];
  }
}
