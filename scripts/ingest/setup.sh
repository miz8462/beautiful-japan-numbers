#!/usr/bin/env bash
# セットアップスクリプト
# 使い方: bash setup.sh

set -e
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV="$PROJECT_DIR/.venv"

echo "=== 依存パッケージのインストール ==="
python3 -m venv "$VENV"
"$VENV/bin/pip" install --upgrade pip -q
"$VENV/bin/pip" install watchdog -q
echo "✓ watchdog インストール完了"

echo ""
echo "=== rclone のチェック ==="
if ! command -v rclone &>/dev/null; then
  echo "rclone が見つかりません。インストールします..."
  curl -fsSL https://rclone.org/install.sh | sudo bash
  echo "✓ rclone インストール完了"
  echo ""
  echo ">>> Google Drive の認証が必要です。以下を実行してください:"
  echo "    rclone config"
  echo "    （'gdrive' という名前でGoogle Driveを追加）"
else
  echo "✓ rclone は既にインストール済み"
fi

echo ""
echo "=== ディレクトリの作成 ==="
mkdir -p "$PROJECT_DIR/data/raw"
mkdir -p "$PROJECT_DIR/logs"
echo "✓ data/raw, logs を作成"

echo ""
echo "=== systemd サービスの登録 ==="
SERVICE_DIR="$HOME/.config/systemd/user"
mkdir -p "$SERVICE_DIR"
sed "s|%i|$(whoami)|g" "$PROJECT_DIR/mof-watcher@.service" \
    | sed "s|/home/$(whoami)/mof_project|$PROJECT_DIR|g" \
    > "$SERVICE_DIR/mof-watcher.service"

systemctl --user daemon-reload
systemctl --user enable mof-watcher.service
systemctl --user start  mof-watcher.service
echo "✓ サービス登録・起動完了"

echo ""
echo "============================================"
echo "セットアップ完了！"
echo ""
echo "状態確認:  systemctl --user status mof-watcher"
echo "ログ確認:  tail -f $PROJECT_DIR/logs/watcher.log"
echo "停止:      systemctl --user stop mof-watcher"
echo "============================================"
