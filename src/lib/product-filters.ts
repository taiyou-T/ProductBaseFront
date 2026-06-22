type ProductListParams = {
  sort?: string;
  category?: string;
  tag?: string;
};

type SearchParams = {
  q?: string;
  sort?: string;
  category?: string;
};

function appendParam(query: URLSearchParams, key: string, value?: string) {
  if (value) {
    query.set(key, value);
  }
}

export function buildProductsUrl(params: ProductListParams = {}): string {
  const query = new URLSearchParams();
  appendParam(query, "sort", params.sort && params.sort !== "newest" ? params.sort : undefined);
  appendParam(query, "category", params.category);
  appendParam(query, "tag", params.tag);
  const serialized = query.toString();
  return serialized ? `/products?${serialized}` : "/products";
}

export function buildSearchUrl(params: SearchParams = {}): string {
  const query = new URLSearchParams();
  appendParam(query, "q", params.q?.trim() || undefined);
  appendParam(query, "sort", params.sort && params.sort !== "newest" ? params.sort : undefined);
  appendParam(query, "category", params.category);
  const serialized = query.toString();
  return serialized ? `/search?${serialized}` : "/search";
}
