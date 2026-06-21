# TODO リスト

ProductBaseFront 開発タスク

**最終更新**: 2026-06-21

---

## 仕様書更新ルール

機能・ルート・インフラ変更時は **同じ作業内** で以下を更新する。

| ファイル | 更新タイミング |
|----------|----------------|
| [system-spec.md](./system-spec.md) | アーキテクチャ・ルート・デプロイ変更 |
| 本ファイル（todo.md） | タスク完了/追加時 |
| ProductBaseBack `docs/frontend-handoff.md` | API 連携・環境変数変更 |

---

## 進捗サマリー（2026-06-21）

### 完了

| 領域 | 内容 |
|------|------|
| **基盤** | Next.js 16 + TypeScript + Tailwind + API クライアント |
| **公開サイト** | ホーム・成果物・開発者・団体・カテゴリ・タグ・検索 |
| **SEO** | metadata・JSON-LD・ISR（60s）・`app/sitemap.ts` |
| **認証** | 登録・ログイン・Google OAuth（SDK + リダイレクト） |
| **掲載者** | プロフィール・成果物 CRUD・画像 UP・掲載申請・団体管理 |
| **閲覧者** | お気に入り・開発者お気に入り・通報 |
| **サポーター** | 閲覧履歴・チャット |
| **課金** | Stripe Checkout / Customer Portal UI |
| **その他** | 通知一覧・ダークモード切替 |
| **インフラ** | EC2 デプロイ・systemd・Nginx プロキシ |
| **ISR** | `/api/revalidate` Route Handler |

### 本番

| 項目 | 状態 |
|------|------|
| https://productbase-jp.com | ✅ 稼働中 |
| systemd `productbase-front` | ✅ |
| `.env.production` | ✅ |

---

## 完了 ✅

- [x] プロジェクト初期化
- [x] 公開ページ（ISR）
- [x] 認証（メール + Google OAuth）
- [x] 掲載者ダッシュボード（MVP + 団体管理）
- [x] お気に入り・開発者お気に入り
- [x] 通報 UI
- [x] 通知一覧
- [x] チャット・閲覧履歴（サポーター）
- [x] Stripe Checkout / Portal UI
- [x] `app/sitemap.ts` 動的生成
- [x] ダークモード切替
- [x] revalidate Route Handler
- [x] 本番 EC2 デプロイ
- [x] `docs/system-spec.md` 作成
- [x] openapi-typescript 型生成（`npm run generate:api-types`）
- [x] Vitest ユニットテスト
- [x] Playwright E2E（公開ページスモーク）
- [x] GitHub Actions CI
- [x] CloudFront 対応（`NEXT_PUBLIC_ASSET_PREFIX` + `docs/cloudfront.md`）

---

## 未着手・バックログ

（現時点で計画済みタスクはすべて完了）

### 将来の拡張候補

- [ ] 手書き型（`src/types/index.ts`）から OpenAPI 生成型への段階的移行
- [ ] E2E の認証フロー・ダッシュボード操作テスト
- [ ] CloudFront ディストリビューション本番構築（AWS 側作業）

---

## デプロイ

```bash
cd ~/productbase-front && bash scripts/deploy.sh
```

詳細: [README.md](../README.md)、ProductBaseBack `docs/DEPLOY_PROD.md`
