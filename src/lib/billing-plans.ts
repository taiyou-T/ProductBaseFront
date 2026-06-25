export const FREE_PLANS = [
  {
    id: "viewer",
    audience: "閲覧者向け",
    name: "無料プラン",
    price: "¥0",
    summary: "アカウント登録だけで、成果物の検索・閲覧ができます。",
    features: [
      "成果物の検索・一覧・詳細閲覧",
      "お気に入り登録（最大10件）",
      "通報",
    ],
  },
  {
    id: "creator_free",
    audience: "掲載者向け",
    name: "無料掲載",
    price: "¥0",
    summary: "掲載者プロフィール作成後、成果物を無料で掲載できます。",
    features: [
      "成果物の登録・編集・掲載申請（最大3件）",
      "公開ページでの発信",
      "サポーターからのチャット閲覧・返信",
    ],
  },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    type: "supporter" as const,
    audience: "閲覧者向け",
    name: "サポーター",
    description: "気になる成果物をもっと追いかけたい方向けのプランです。",
    price: "¥500/月",
    features: [
      "お気に入り上限 100件",
      "閲覧履歴の保存・確認",
      "掲載者へのチャット開始",
      "無料プランの機能はすべて利用可能",
    ],
    requiresCreator: false,
  },
  {
    type: "premium" as const,
    audience: "掲載者向け",
    name: "Premium 掲載",
    description: "より多くの成果物を掲載したい方向けのプランです。",
    price: "¥2,980/月",
    features: [
      "無料掲載のすべての機能",
      "掲載申請 最大5件",
      "Premium 掲載者としての契約・表示",
    ],
    requiresCreator: true,
  },
] as const;

/** 過去の Standard 契約など、表示用のレガシーラベル */
export const LEGACY_SUBSCRIPTION_PLAN_LABELS: Record<string, string> = {
  standard: "基本掲載（終了）",
};
