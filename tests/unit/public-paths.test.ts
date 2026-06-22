import { describe, expect, it } from "vitest";
import {
  developerPublicPath,
  isCanonicalProductPath,
  productPublicPath,
} from "@/lib/public-paths";

describe("public-paths", () => {
  it("builds product paths with id and slug", () => {
    expect(productPublicPath({ id: 42, slug: "my-app" })).toBe("/products/42-my-app");
  });

  it("builds developer paths with user id and slug", () => {
    expect(developerPublicPath({ user_id: 7, slug: "taro" })).toBe("/developers/7-taro");
  });

  it("detects canonical product paths", () => {
    const product = { id: 10, slug: "demo" };
    expect(isCanonicalProductPath("10-demo", product)).toBe(true);
    expect(isCanonicalProductPath("demo", product)).toBe(false);
  });
});
