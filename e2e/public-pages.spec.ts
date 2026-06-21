import { expect, test } from "@playwright/test";

const siteConfig = {
  maintenance_mode: false,
  maintenance_message: "",
  terms_version: 1,
  terms_content: "",
  terms_required: false,
};

test.beforeEach(async ({ page }) => {
  await page.route("**/public/site-config", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(siteConfig),
    });
  });
});

test.describe("public pages", () => {
  test("home page renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /作った成果物を/ })).toBeVisible();
  });

  test("login page renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ログイン", exact: true })).toBeVisible();
  });

  test("terms page renders", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "利用規約" })).toBeVisible();
  });

  test("register page renders form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "新規登録" })).toBeVisible();
  });
});
