"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdvertisementBanner } from "@/components/advertisements/AdvertisementBanner";
import type { Advertisement } from "@/types";

export function ClientAdvertisementBanner({ placement }: { placement: "favorites" }) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    api<{ data: Advertisement[] }>(`/public/advertisements?placement=${placement}`, {}, null)
      .then((res) => setAdvertisements(res.data))
      .catch(() => setAdvertisements([]));
  }, [placement]);

  return <AdvertisementBanner advertisements={advertisements} />;
}
