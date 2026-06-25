# TODO リスト

ProductBaseFront 開発タスク

**最終更新**: 2026-06-25  
**ステータス**: 直近の計画タスク **すべて完了** ✅

---

## 仕様書更新ルール

機能・ルート・インフラ変更時は **同じ作業内** で以下を更新する。

| ファイル | 更新タイミング |
|----------|----------------|
| [system-spec.md](./system-spec.md) | アーキテクチャ・ルート・デプロイ変更 |
| 本ファイル（todo.md） | タスク完了/追加時 |
| ProductBaseBack `docs/frontend-handoff.md` | API 連携・環境変数変更 |
| ProductBaseBack `docs/DEPLOY_PROD.md` | 本番デプロイ手順変更 |

---

## 進捗サマリー（2026-06-25）

| 領域 | 内容 |
|------|------|
| **基盤** | Next.js 16 + TypeScript + Tailwind + API クライアント |
| **公開サイト** | ホーム・成果物・開発者・団体・カテゴリ・タグ・検索・お問い合わせ |
| **SEO** | metadata・keywords・JSON-LD（成果物）・sitemap・robots |
| **認証** | 登録・ログイン・Google OAuth |
| **掲載者** | プロフィール・成果物 CRUD・団体管理（slug 手入力なし） |
| **掲載者プラン** | 無料掲載（3件）+ Premium（5件）UI |
| **閲覧者** | お気に入り・通報・お問い合わせ |
| **サポーター** | 閲覧履歴・チャット |
| **課金** | Stripe Checkout / Customer Portal UI（サポーター + Premium） |

### 本番

| 項目 | 状態 |
|------|------|
| https://productbase-jp.com | ✅ 稼働中 |
| systemd `productbase-front` | ✅ |
| `.env.production` | ✅ |

---

## 完了 ✅

### 2026-06-25 リリース

- [x] 掲載プラン UI 更新（無料掲載 + Premium のみ）
- [x] トライアル・基本掲載（Standard）表示の削除
- [x] 掲載枠 3/5 件の表示・上限メッセージ
- [x] `docs/system-spec.md` 更新

### 2026-06-23 リリース

- [x] お問い合わせページ `/contact`（ゲスト/ログイン対応・成功モーダル）
- [x] SEO keywords メタタグ（`SITE_KEYWORDS` 17 語）
- [x] 公開 URL を `[identifier]` + canonical `{id}-{slug}` に統一
- [x] 成果物詳細に掲載開始日・掲載更新日表示
- [x] slug 入力欄削除（成果物・プロフィール・団体フォーム）
- [x] `docs/system-spec.md` 全面更新

### 基盤・公開サイト

- [x] プロジェクト初期化
- [x] 公開ページ（ISR）
- [x] 認証（メール + Google OAuth）
- [x] 掲載者ダッシュボード（プロフィール・成果物・団体）
- [x] お気に入り・開発者お気に入り
- [x] 通報 UI
- [x] 通知一覧
- [x] チャット・閲覧履歴（サポーター）
- [x] Stripe Checkout / Portal UI
- [x] `app/sitemap.ts` 動的生成（`/contact`, `/terms` 含む）
- [x] SEO（`robots.txt`、公開 metadata、非公開 noindex）
- [x] ダークモード切替
- [x] revalidate Route Handler
- [x] 本番 EC2 デプロイ
- [x] Vitest ユニットテスト（`seo.test.ts` 含む）
- [x] Playwright E2E（公開ページスモーク）
- [x] GitHub Actions CI
- [x] CloudFront 対応（`docs/cloudfront.md`）

---

## 未着手・バックログ

- [ ] 開発者・団体ページの JSON-LD（`Person` / `Organization`）
- [ ] sitemap に団体 URL を追加
- [ ] お問い合わせページの E2E テスト
- [ ] 手書き型から OpenAPI 生成型への完全移行

新機能や改善が発生したら、このセクションに追記する。

---

## デプロイ

### EC2 上で直接

```bash
cd ~/productbase-front && bash scripts/deploy.sh
```

### ローカルから SSH

```powershell
ssh -i "$env:USERPROFILE\Downloads\torooma-prod-key.pem" ec2-user@13.231.248.47 "cd /home/ec2-user/productbase-front && bash scripts/deploy.sh"
```

詳細: [README.md](../README.md)、ProductBaseBack [DEPLOY_PROD.md](../../ProductBaseBack/docs/DEPLOY_PROD.md)
