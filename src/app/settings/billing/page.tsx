"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS_LABELS,
  planLabel,
} from "@/lib/constants";
import type { Subscription, SubscriptionPlanType } from "@/types";

function normalizeSubscriptions(raw: unknown): Subscription[] {
  if (Array.isArray(raw)) {
    return raw as Subscription[];
  }
  if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: Subscription[] }).data;
  }
  return [];
}

export default function BillingPage() {
  const { token, user, refreshUser } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<SubscriptionPlanType | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api<{ subscriptions: unknown }>("/subscriptions", {}, token);
      setSubscriptions(normalizeSubscriptions(res.subscriptions));
      await refreshUser();
    } catch (e) {
      setError(getApiErrorMessage(e, "プラン情報の取得に失敗しました"));
    } finally {
      setLoading(false);
    }
  }, [token, refreshUser]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

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
      setError(getApiErrorMessage(e, "Checkout に失敗しました"));
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
      setError(getApiErrorMessage(e, "ポータルを開けませんでした"));
    } finally {
      setPortalLoading(false);
    }
  };

  const activePlans = subscriptions.filter((s) => s.is_active);
  const activePlanTypes = new Set(activePlans.map((s) => s.plan_type));

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
                <h2 className="font-semibold text-green-900 dark:text-green-100">加入中のプラン</h2>
                <ul className="mt-3 space-y-2">
                  {activePlans.map((s) => (
                    <li
                      key={s.id}
                      className="flex flex-wrap items-center gap-2 text-sm text-green-900 dark:text-green-100"
                    >
                      <span className="font-medium">{planLabel(s.plan_type)}</span>
                      <Badge variant="success">
                        {SUBSCRIPTION_STATUS_LABELS[s.status] ?? s.status}
                      </Badge>
                      {s.ended_at && (
                        <span className="text-green-800 dark:text-green-200">
                          次回更新: {new Date(s.ended_at).toLocaleDateString("ja-JP")}
                        </span>
                      )}
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
                  {portalLoading ? "読み込み中..." : "プラン変更・解約（Customer Portal）"}
                </Button>
              </section>
            )}

            <section className="grid gap-4 sm:grid-cols-1">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isActive = activePlanTypes.has(plan.type);
                const requiresCreator = plan.requiresCreator && !user?.is_creator;
                const disabled =
                  requiresCreator || isActive || checkoutLoading !== null;

                return (
                  <div
                    key={plan.type}
                    className={`rounded-xl border p-5 ${
                      isActive
                        ? "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{plan.name}</h3>
                          {isActive && <Badge variant="success">加入中</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {plan.description}
                        </p>
                        {requiresCreator && (
                          <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                            掲載者登録が必要です
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-bold text-indigo-600">{plan.price}</p>
                    </div>
                    {isActive ? (
                      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                        このプランに加入済みです。変更・解約は Customer Portal から行えます。
                      </p>
                    ) : (
                      <Button
                        type="button"
                        className="mt-4"
                        disabled={disabled}
                        onClick={() => checkout(plan.type)}
                      >
                        {checkoutLoading === plan.type ? "リダイレクト中..." : "申し込む"}
                      </Button>
                    )}
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
