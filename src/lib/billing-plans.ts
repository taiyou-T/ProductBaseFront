export const FREE_PLANS = [
  {
    id: "viewer",
    audience: "閲覧者向け",
    name: "無料プラン",
    price: "¥0",
    summary: "アカウント登録だけで、成果物の検索・閲覧ができます。",
    features: [
      "成果物の検索・一覧・詳細閲覧",
      "お気に入り登録（最大50件）",
      "通報",
    ],
  },
  {
    id: "creator_trial",
    audience: "掲載者向け",
    name: "無料トライアル",
    price: "¥0（6ヶ月）",
    summary: "掲載者プロフィール作成後、6ヶ月間は掲載機能を無料でお試しできます。",
    features: [
      "成果物の登録・編集・掲載申請（最大3件）",
      "公開ページでの発信",
      "サポーターからのチャット閲覧・返信",
      "トライアル終了後は基本掲載または Premium の契約が必要",
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
      "お気に入り上限 500件",
      "閲覧履歴の保存・確認",
      "掲載者へのチャット開始",
      "無料プランの機能はすべて利用可能",
    ],
    requiresCreator: false,
  },
  {
    type: "standard" as const,
    audience: "掲載者向け",
    name: "基本掲載",
    description: "個人開発の成果物を継続的に掲載・発信するための標準プランです。",
    price: "¥500/月",
    features: [
      "成果物の掲載・管理（掲載申請 最大3件）",
      "掲載申請・公開ページの維持",
      "サポーターからのチャット閲覧・返信",
      "無料トライアル終了後の本掲載に利用",
    ],
    requiresCreator: true,
  },
  {
    type: "premium" as const,
    audience: "掲載者向け",
    name: "Premium 掲載",
    description: "より本格的に掲載・ブランディングしたい掲載者向けの上位プランです。",
    price: "¥1,500/月",
    features: [
      "基本掲載プランのすべての機能",
      "掲載申請 最大10件",
      "Premium 掲載者としての契約・表示",
      "継続的な掲載・発信を重視する方向け",
    ],
    requiresCreator: true,
  },
] as const;
