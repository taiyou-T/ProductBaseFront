import { serverApi } from "@/lib/api";
import type { Advertisement } from "@/types";

export type AdvertisementPlacement = "home" | "products" | "search" | "favorites";

export async function getActiveAdvertisements(
  placement: AdvertisementPlacement,
): Promise<Advertisement[]> {
  try {
    const response = await serverApi<{ data: Advertisement[] }>(
      `/public/advertisements?placement=${placement}`,
      0,
    );
    return response.data;
  } catch {
    return [];
  }
}
