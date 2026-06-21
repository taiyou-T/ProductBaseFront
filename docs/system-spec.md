# システム仕様書

ProductBaseFront（公開サイト + 掲載者ダッシュボード）

- **最終更新**: 2026-06-21
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

### 公開（ISR / SSR）

| パス | 説明 |
|------|------|
| `/` | ホーム（新着・ランキング・お知らせ） |
| `/products` | 成果物一覧（ソート） |
| `/products/[slug]` | 成果物詳細（JSON-LD・OGP） |
| `/developers/[slug]` | 開発者プロフィール |
| `/categories/[slug]` | カテゴリ別一覧 |
| `/tags/[slug]` | タグ別一覧 |
| `/search` | 全文検索 |

### 認証

| パス | 説明 |
|------|------|
| `/login` | メールログイン |
| `/register` | 登録（掲載者選択可） |
| `/auth/callback` | OAuth token 受け取り |

### 閲覧者（要ログイン）

| パス | 説明 |
|------|------|
| `/favorites` | お気に入り一覧 |

### 掲載者ダッシュボード（要ログイン）

| パス | 説明 |
|------|------|
| `/dashboard` | 概要 |
| `/dashboard/onboarding` | プロフィール初回作成 |
| `/dashboard/profile` | プロフィール編集 |
| `/dashboard/products` | 成果物一覧 |
| `/dashboard/products/new` | 成果物作成 |
| `/dashboard/products/[id]/edit` | 編集・掲載申請 |

### API Route

| パス | 説明 |
|------|------|
| `POST /api/revalidate` | On-demand ISR（`X-Revalidate-Secret`） |

---

## 4. 本番インフラ

| 項目 | 値 |
|------|-----|
| EC2 | torooma-back と共有（`13.231.248.47`） |
| 配置先 | `/home/ec2-user/productbase-front` |
| プロセス | `systemd` `productbase-front.service` |
| ポート | 3000（Nginx プロキシ） |
| Nginx | `productbase-root-prod.conf` |

EC2 内から API へ SSR するため `/etc/hosts` に `127.0.0.1 api.productbase-jp.com` を設定（VPC DNS 未解決対策）。

---

## 5. 環境変数

開発: `.env.local`（`.env.example` 参照）  
本番ビルド: `.env.production` のみ使用

バックエンド連携（ProductBaseBack `.env`）:

```env
CORS_ALLOWED_ORIGINS=https://productbase-jp.com,https://www.productbase-jp.com
GOOGLE_FRONTEND_CALLBACK_URL=https://productbase-jp.com/auth/callback
FRONTEND_REVALIDATE_URL=https://productbase-jp.com/api/revalidate
REVALIDATE_SECRET=<フロントと同一>
```

---

## 6. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-06-21 | 初版・本番デプロイ（productbase-jp.com） |
| 2026-06-21 | MVP 公開ページ・認証・掲載者ダッシュボード基盤 |
