#!/bin/bash
# ProductBaseFront 本番デプロイ（EC2 上で実行）
# 配置先: /home/ec2-user/productbase-front
# 公開 URL: https://productbase-jp.com

set -euo pipefail

PROJECT_DIR="${PRODUCTBASE_FRONT_DIR:-/home/ec2-user/productbase-front}"
DEPLOY_USER="${PRODUCTBASE_DEPLOY_USER:-ec2-user}"
PORT="${PRODUCTBASE_FRONT_PORT:-3000}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "$(whoami)" != "$DEPLOY_USER" ]; then
    log_error "ec2-user として実行してください"
    exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
    log_error "ディレクトリがありません: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"
log_info "フロントデプロイ開始: $PROJECT_DIR"

if [ -d .git ]; then
    log_info "git pull..."
    git pull origin main || git pull origin master || true
fi

log_info "npm ci..."
rm -f .env.local
npm ci

log_info "ビルド（本番 URL: https://productbase-jp.com）..."
npm run build

log_info "systemd サービスを更新..."
sudo cp scripts/productbase-front.service /etc/systemd/system/productbase-front.service
sudo systemctl daemon-reload
sudo systemctl enable productbase-front
sudo systemctl restart productbase-front

sleep 2
if curl -sf "http://127.0.0.1:${PORT}/" > /dev/null; then
    log_info "ローカル起動 OK (port ${PORT})"
else
    log_warn "ローカルヘルスチェック失敗。journalctl -u productbase-front を確認"
fi

log_info "完了: https://productbase-jp.com"
