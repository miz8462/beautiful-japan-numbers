"""
財務省Excel 自動取り込みウォッチャー
Downloads フォルダを監視 → data/raw/ へ移動 → Google Drive 同期
"""

import os
import shutil
import time
import logging
import subprocess
from pathlib import Path
from datetime import datetime

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# ──────────────────────────────────────────
# 設定
# ──────────────────────────────────────────
WATCH_DIR   = Path.home() / "downloads"          # 監視するフォルダ
DEST_DIR    = Path(__file__).parents[2] / "data/raw"         # scriptsから2つ上のルートを基準に
GDRIVE_DEST = "gdrive:beautiful-japan-numbers/raw"

# 財務省ファイルを識別するパターン（複数指定可）
FILE_PATTERNS = [
    "*.xlsx",
    "*.xls",
    # 例: "g_*_*.xlsx",  # 財務省特有のファイル名パターンがあれば追加
]

LOG_FILE = Path("logs/watcher.log")
# ──────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)


def matches_pattern(path: Path) -> bool:
    """ファイルが対象パターンに一致するか確認"""
    return any(path.match(pat) for pat in FILE_PATTERNS)


def wait_for_complete(path: Path, timeout: int = 30) -> bool:
    """ダウンロード完了を待つ（ファイルサイズが安定するまで）"""
    prev_size = -1
    for _ in range(timeout):
        try:
            size = path.stat().st_size
            if size == prev_size and size > 0:
                return True
            prev_size = size
        except FileNotFoundError:
            return False
        time.sleep(1)
    return False


def archive_name(src: Path) -> Path:
    """タイムスタンプ付きのファイル名を生成（上書き防止）"""
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    stem = src.stem
    suffix = src.suffix
    return DEST_DIR / f"{stem}_{ts}{suffix}"


def sync_to_gdrive(file_path: Path):
    """rclone で Google Drive に単一ファイルを同期"""
    try:
        result = subprocess.run(
            ["rclone", "copy", str(file_path), GDRIVE_DEST, "--progress"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            log.info(f"✓ Google Drive 同期完了: {GDRIVE_DEST}/{file_path.name}")
        else:
            log.error(f"✗ rclone エラー: {result.stderr}")
    except FileNotFoundError:
        log.warning("rclone がインストールされていません。Google Drive 同期をスキップします。")
    except subprocess.TimeoutExpired:
        log.error("rclone タイムアウト")


class ExcelHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        self._handle(Path(event.src_path))

    def on_moved(self, event):
        # ブラウザは .crdownload → .xlsx のようにリネームする
        if not event.is_directory:
            self._handle(Path(event.dest_path))

    def _handle(self, path: Path):
        if not matches_pattern(path):
            return

        log.info(f"新しいファイルを検出: {path.name}")

        if not wait_for_complete(path):
            log.warning(f"ダウンロード完了を確認できませんでした: {path.name}")
            return

        dest = archive_name(path)
        try:
            shutil.copy2(path, dest)
            log.info(f"✓ コピー完了: {dest}")
        except Exception as e:
            log.error(f"✗ コピー失敗: {e}")
            return

        sync_to_gdrive(dest)


def main():
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

    log.info(f"監視開始: {WATCH_DIR}")
    log.info(f"保存先:   {DEST_DIR}")
    log.info(f"Drive先: {GDRIVE_DEST}")

    observer = Observer()
    observer.schedule(ExcelHandler(), str(WATCH_DIR), recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        log.info("停止中...")
        observer.stop()
    observer.join()
    log.info("終了")


if __name__ == "__main__":
    main()
