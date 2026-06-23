# システム仕様書

ProductBaseFront（公開サイト + 掲載者ダッシュボード）

- **最終更新**: 2026-06-23
- **リポジトリ**: https://github.com/taiyou-T/ProductBaseFront
- **本番 URL**: https://productbase-jp.com

> API・DB の詳細は ProductBaseBack の `docs/` を参照。

---

## 1. 責務

| 担当 | 技術 | URL |
|------|------|-----|
| 公開サイト | Next.js 16（ISR） | `productbase-jp.com` |
| 掲載者ダッシュボード | Next.js（Client） | `/dashboard/*` |
| 認証 UI | Sanctum Bearer Token | `/login`, `/register` |

**運営管理画面**（審査・ユーザー管理）は ProductBaseBack の Vue SPA（`api.productbase-jp.com/admin`）。本リポジトリでは実装しない。

---

## 2. アーキテクチャ

```
ブラウザ
   │
   ├─ https://productbase-jp.com ──▶ Nginx ──▶ Next.js (port 3000, systemd)
   │                                      │
   │                                      └── serverApi / api() ──▶ api.productbase-jp.com/api
   │
   └─ https://api.productbase-jp.com/admin ──▶ Laravel + Vue（ProductBaseBack）
```

### 技術スタック

| 項目 | 選定 |
|------|------|
| フレームワーク | Next.js 16（App Router, Turbopack） |
| 言語 | TypeScript |
| スタイル | Tailwind CSS 4 |
| フォーム | React Hook Form + Zod |
| 状態管理 | Zustand（認証トークン） |

---

## 3. ルート一覧

### 公開（ISR / SSR・インデックス対象）

| パス | 説明 |
|------|------|
| `/` | ホーム（新着・ランキング・お知らせ） |
| `/products` | 成果物一覧（ソート・カテゴリ・タグ・開発ステータス） |
| `/products/[identifier]` | 成果物詳細（JSON-LD・OGP・掲載日時表示） |
| `/developers/[identifier]` | 開発者プロフィール |
| `/organizations/[slug]` | 団体プロフィール |
| `/categories/[slug]` | カテゴリ別一覧 |
| `/tags/[slug]` | タグ別一覧 |
| `/search` | 全文検索 |
| `/terms` | 利用規約 |
| `/contact` | お問い合わせフォーム |

### 認証（noindex）

| パス | 説明 |
|------|------|
| `/login` | メール・Google ログイン |
| `/register` | 登録（掲載者選択可） |
| `/auth/callback` | OAuth token 受け取り |

### 閲覧者（要ログイン・noindex）

| パス | 説明 |
|------|------|
| `/favorites` | お気に入り成果物一覧 |
| `/creator-favorites` | お気に入り開発者一覧 |
| `/notifications` | 通知一覧 |
| `/view-history` | 閲覧履歴（サポーター） |
| `/conversations` | チャット一覧（サポーター） |
| `/conversations/[id]` | チャット詳細 |
| `/settings/billing` | Stripe Checkout / Portal |
| `/billing/success` | 決済成功 |
| `/billing/cancel` | 決済キャンセル |

### 掲載者ダッシュボード（要ログイン・noindex）

| パス | 説明 |
|------|------|
| `/dashboard` | 概要 |
| `/dashboard/onboarding` | プロフィール初回作成（slug 入力なし） |
| `/dashboard/profile` | プロフィール編集 |
| `/dashboard/products` | 成果物一覧 |
| `/dashboard/products/new` | 成果物作成（slug 入力なし） |
| `/dashboard/products/[id]/edit` | 編集・掲載申請 |
| `/dashboard/organizations` | 団体一覧 |
| `/dashboard/organizations/new` | 団体作成 |
| `/dashboard/organizations/[id]/edit` | 団体編集 |

### SEO

| パス | 説明 |
|------|------|
| `/sitemap.xml` | 動的 sitemap（`app/sitemap.ts`） |
| `/robots.txt` | クロール制御（`app/robots.ts`） |

### API Route

| パス | 説明 |
|------|------|
| `POST /api/revalidate` | On-demand ISR（`X-Revalidate-Secret`） |

---

## 4. 公開 URL 設計

`src/lib/public-paths.ts` で canonical パスを生成:

| 種別 | 形式 | 例 |
|------|------|-----|
| 成果物 | `/products/{id}-{slug}` | `/products/6-miru` |
| 開発者 | `/developers/{user_id}-{slug}` | `/developers/6-furukawa` |
| 団体 | `/organizations/{slug}` | `/organizations/my-team` |

API の `{identifier}` は数値 ID・`{id}-{slug}`・slug のいずれかで受付。非 canonical URL はリダイレクト。

**slug ポリシー**: 成果物・プロフィール・団体の slug はサーバー自動生成。ダッシュボードフォームに slug 入力欄はない。

---

## 5. SEO 実装

### `src/lib/seo.ts`

| 関数 / 定数 | 用途 |
|-------------|------|
| `SITE_KEYWORDS` | 14 語の meta keywords（トップ・一覧ページのみ） |
| `publicPageMetadata()` | title・description・canonical・OGP・Twitter・robots |
| `seo-jsonld.ts` | WebSite / SoftwareApplication / Person / Organization / BreadcrumbList |
| `JsonLd` コンポーネント | 各公開ページに構造化データを出力 |

### JSON-LD

| ページ | schema.org | 状態 |
|--------|------------|------|
| `/products/[identifier]` | `SoftwareApplication` | ✅ |
| `/developers/[identifier]` | `Person` | ✅ |
| `/organizations/[slug]` | `Organization` | ✅ |

### Sitemap（`app/sitemap.ts`）

静的: `/`, `/products`, `/search`, `/terms`, `/contact`  
動的: 成果物・開発者・カテゴリ・タグ（**団体は未含**）

### キャッシュ

`serverApi()` デフォルト `revalidate: 60` + バックエンド承認時の on-demand revalidate。

---

## 6. お問い合わせ（`/contact`）

- ゲスト: カテゴリ・メール・本文（10–500 文字）→ `POST /public/inquiries`
- ログイン中: メールはアカウントのものを使用（入力欄なし）
- カテゴリ: `account` / `listing` / `feedback` / `other`
- 送信成功時にモーダル表示（返信を約束しない文言）
- フッターからリンク

---

## 7. 成果物詳細 UI

PV・お気に入り数の下に掲載日時を表示:

- **掲載開始**: `published_at`
- **掲載更新**: `updated_at`

カード一覧・ダッシュボードには未表示。

---

## 8. 本番インフラ

| 項目 | 値 |
|------|-----|
| EC2 | torooma-back と共有（`13.231.248.47`） |
| 配置先 | `/home/ec2-user/productbase-front` |
| プロセス | `systemd` `productbase-front.service` |
| ポート | 3000（Nginx プロキシ） |
| Nginx | `productbase-root-prod.conf` |

EC2 内から API へ SSR するため `/etc/hosts` に `127.0.0.1 api.productbase-jp.com` を設定（VPC DNS 未解決対策）。

---

## 9. 環境変数

開発: `.env.local`（`.env.example` 参照）  
本番ビルド: `.env.production` のみ使用（**`.env.local` は本番に置かない**）

バックエンド連携（ProductBaseBack `.env`）:

```env
CORS_ALLOWED_ORIGINS=https://productbase-jp.com,https://www.productbase-jp.com
GOOGLE_FRONTEND_CALLBACK_URL=https://productbase-jp.com/auth/callback
FRONTEND_REVALIDATE_URL=https://productbase-jp.com/api/revalidate
REVALIDATE_SECRET=<フロントと同一>
```

---

## 10. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-06-23 | SEO 最適化（構造化データ・OGP・タイトル/説明文・パンくず・ページ別 keywords） |
| 2026-06-23 | SEO keywords・`/contact`・`[identifier]` URL・掲載日表示・slug フォーム削除 |
| 2026-06-21 | 初版・本番デプロイ（productbase-jp.com） |
| 2026-06-21 | MVP 公開ページ・認証・掲載者ダッシュボード基盤 |
| 2026-06-21 | OAuth・Stripe・通知・チャット・団体・通報・sitemap・ダークモード |
