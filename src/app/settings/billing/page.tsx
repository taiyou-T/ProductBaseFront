"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { BillingPlanCard } from "@/components/billing/BillingPlanCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FREE_PLANS, SUBSCRIPTION_PLANS } from "@/lib/billing-plans";
import {
  SUBSCRIPTION_STATUS_LABELS,
  planLabel,
} from "@/lib/constants";
import {
  CREATOR_PLAN_LABELS,
  formatTrialEndDate,
  trialDaysRemaining,
} from "@/lib/creator-plan";
import { formatJapanDatetime } from "@/lib/datetime";
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

  const profile = user?.creator_profile;
  const isOnTrial = profile?.plan_type === "free_trial" && profile.can_list !== false;

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
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">プラン・お支払い</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            ProductBase では、閲覧者向けと掲載者向けのプランがあります。まずは無料プランから始められ、必要に応じて有料プランへアップグレードできます。
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            お支払いは Stripe Checkout で安全に処理されます。
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
                          次回更新: {formatJapanDatetime(s.ended_at)}
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

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">無料プラン</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  登録直後から利用できるプランです。掲載者は無料トライアル期間中も掲載機能をお試しできます。
                </p>
              </div>
              <div className="grid gap-4">
                {FREE_PLANS.map((plan) => {
                  const isViewerPlan = plan.id === "viewer";
                  const isCurrentFree =
                    (isViewerPlan && !user?.is_supporter) ||
                    (plan.id === "creator_trial" && isOnTrial);

                  let note: string | undefined;
                  if (plan.id === "creator_trial") {
                    if (!user?.is_creator) {
                      note = "利用には掲載者プロフィールの作成が必要です。";
                    } else if (isOnTrial && profile?.trial_ends_at) {
                      note = `現在トライアル中です。終了日: ${formatTrialEndDate(profile.trial_ends_at)}（残り ${trialDaysRemaining(profile.trial_ends_at)} 日）`;
                    } else if (user.is_creator && profile?.can_list === false) {
                      note = "無料トライアル期間は終了しています。基本掲載または Premium の契約が必要です。";
                    } else if (user.is_creator && profile && profile.plan_type !== "free_trial") {
                      note = `現在の掲載プラン: ${CREATOR_PLAN_LABELS[profile.plan_type]}`;
                    }
                  } else if (user?.is_supporter) {
                    note = "サポータープラン加入中のため、無料プランの上限は拡張されています。";
                  }

                  return (
                    <BillingPlanCard
                      key={plan.id}
                      audience={plan.audience}
                      name={plan.name}
                      price={plan.price}
                      summary={plan.summary}
                      features={plan.features}
                      isActive={isCurrentFree}
                      activeBadge={isCurrentFree ? "利用中" : undefined}
                      note={note}
                    />
                  );
                })}
              </div>
              {!user?.is_creator && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  成果物を掲載したい方は
                  <Link href="/dashboard/onboarding" className="mx-1 text-indigo-600 hover:underline dark:text-indigo-400">
                    掲載者プロフィールを作成
                  </Link>
                  して、無料トライアルを開始できます。
                </p>
              )}
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">有料プラン</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  閲覧者はサポーター、掲載者は基本掲載または Premium を選べます。1つのアカウントで複数の役割を持つこともできます。
                </p>
              </div>
              <div className="grid gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isActive = activePlanTypes.has(plan.type);
                  const requiresCreator = plan.requiresCreator && !user?.is_creator;
                  const disabled =
                    requiresCreator || isActive || checkoutLoading !== null;

                  return (
                    <BillingPlanCard
                      key={plan.type}
                      audience={plan.audience}
                      name={plan.name}
                      price={plan.price}
                      summary={plan.description}
                      features={plan.features}
                      isActive={isActive}
                      activeBadge="加入中"
                      note={
                        requiresCreator
                          ? "掲載者プロフィールの作成後に申し込めます。"
                          : undefined
                      }
                      footer={
                        isActive
                          ? "このプランに加入済みです。変更・解約は Customer Portal から行えます。"
                          : undefined
                      }
                      action={
                        isActive
                          ? undefined
                          : {
                              label: "申し込む",
                              disabled,
                              loading: checkoutLoading === plan.type,
                              onClick: () => checkout(plan.type),
                            }
                      }
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </RequireAuth>
  );
}
