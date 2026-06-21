"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, ApiError } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/Button";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import type { Subscription, SubscriptionPlanType } from "@/types";

export default function BillingPage() {
  const { token, user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<SubscriptionPlanType | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api<{ subscriptions: Subscription[] }>("/subscriptions", {}, token)
      .then((res) => setSubscriptions(res.subscriptions))
      .finally(() => setLoading(false));
  }, [token]);

  const checkout = async (planType: SubscriptionPlanType) => {
    if (!token) return;
    setCheckoutLoading(planType);
    setError(null);
    try {
      const res = await api<{ checkout_url: string }>(
        "/subscriptions/checkout",
        { method: "POST", body: JSON.stringify({ plan_type: planType }) },
        token,
      );
      window.location.href = res.checkout_url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Checkout に失敗しました");
      setCheckoutLoading(null);
    }
  };

  const openPortal = async () => {
    if (!token) return;
    setPortalLoading(true);
    setError(null);
    try {
      const res = await api<{ portal_url: string }>(
        "/subscriptions/portal",
        { method: "POST" },
        token,
      );
      window.location.href = res.portal_url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "ポータルを開けませんでした");
    } finally {
      setPortalLoading(false);
    }
  };

  const activePlans = subscriptions.filter((s) => s.is_active);

  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">プラン・お支払い</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Stripe Checkout で安全にお支払いいただけます。
          </p>
        </div>

        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : (
          <>
            {activePlans.length > 0 && (
              <section className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                <h2 className="font-semibold">有効なプラン</h2>
                <ul className="mt-2 space-y-1 text-sm">
                  {activePlans.map((s) => (
                    <li key={s.id}>
                      {s.plan_type}（{s.status}）
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  onClick={openPortal}
                  disabled={portalLoading}
                >
                  {portalLoading ? "読み込み中..." : "お支払い方法・解約（Customer Portal）"}
                </Button>
              </section>
            )}

            <section className="grid gap-4 sm:grid-cols-1">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const disabled =
                  plan.requiresCreator && !user?.is_creator;
                return (
                  <div
                    key={plan.type}
                    className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {plan.description}
                        </p>
                        {disabled && (
                          <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                            掲載者登録が必要です
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-bold text-indigo-600">{plan.price}</p>
                    </div>
                    <Button
                      type="button"
                      className="mt-4"
                      disabled={disabled || checkoutLoading !== null}
                      onClick={() => checkout(plan.type)}
                    >
                      {checkoutLoading === plan.type ? "リダイレクト中..." : "申し込む"}
                    </Button>
                  </div>
                );
              })}
            </section>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </RequireAuth>
  );
}
