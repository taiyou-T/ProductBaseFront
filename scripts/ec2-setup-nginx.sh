#!/bin/bash
# EC2 初回: Nginx を Next.js プロキシに更新
set -euo pipefail

CONF_SRC="${1:-/home/ec2-user/productbase-back/scripts/nginx/productbase-root.conf}"
CONF_DST="/etc/nginx/conf.d/productbase-root.conf"

if [ ! -f "$CONF_SRC" ]; then
    echo "Missing $CONF_SRC — productbase-back を先に配置してください"
    exit 1
fi

# certbot が付与した SSL ブロックを維持するため、location / だけ proxy に差し替え
if grep -q 'proxy_pass http://127.0.0.1:3000' "$CONF_DST"; then
    echo "Nginx は既に Next.js プロキシ設定済み"
else
    sudo sed -i 's|return 200.*ProductBase.*html.;|proxy_pass http://127.0.0.1:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade \$http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host \$host;\n        proxy_set_header X-Real-IP \$remote_addr;\n        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto \$scheme;\n        proxy_cache_bypass \$http_upgrade;|' "$CONF_DST" || {
        echo "sed 失敗 — 手動で location / を proxy_pass に変更してください"
        exit 1
    }
fi

sudo nginx -t && sudo systemctl reload nginx
echo "Nginx 更新完了: https://productbase-jp.com → localhost:3000"
