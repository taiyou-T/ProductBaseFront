# CloudFront 静的アセット配信

Next.js の `/_next/static/*` を CloudFront 経由で配信する手順。

## 概要

| 項目 | 説明 |
|------|------|
| 環境変数 | `NEXT_PUBLIC_ASSET_PREFIX` |
| 設定箇所 | `next.config.ts` の `assetPrefix` |
| 対象 | JS / CSS バンドル（`/_next/static/`） |

HTML は引き続き EC2（Nginx → Next.js）から配信し、静的チャンクのみ CDN に載せる構成。

## 手順（AWS）

1. **S3 バケット**（任意）または **Origin** に EC2 / ALB を指定
2. **CloudFront ディストリビューション**を作成
   - Origin: `productbase-jp.com` または ALB
   - Behavior: `/\_next/static/*` をキャッシュ（TTL 長め）
3. デプロイ後に生成される `/_next/static/` パスが CDN URL になるよう、本番 `.env.production` に設定:

```env
NEXT_PUBLIC_ASSET_PREFIX=https://dxxxxxxxx.cloudfront.net
```

4. 再ビルド・再起動:

```bash
cd ~/productbase-front && bash scripts/deploy.sh
```

## 注意

- `assetPrefix` は **ビルド時** に埋め込まれるため、値を変えたら必ず `npm run build` し直す
- ローカル開発では未設定（空）のまま
- `next/image` のリモート画像は `next.config.ts` の `images.remotePatterns` で別途許可（CloudFront ドメインは `*.cloudfront.net` 済み）

## 関連

- ProductBaseBack S3 画像: `docs/DEPLOY_PROD.md`（アップロード画像用、フロント静的アセットとは別）
