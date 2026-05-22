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
DEDUP_WINDOW_SECONDS = 120
# ──────────────────────────────────────────

LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
log = logging.getLogger(__name__)
log.setLevel(logging.INFO)
log.propagate = False

if not log.handlers:
    handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    log.addHandler(handler)


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
    dest = DEST_DIR / src.name
    if not dest.exists():
        return dest
    stem = src.stem
    suffix = src.suffix
    counter = 1
    while True:
        dest = DEST_DIR / f"{stem}({counter}){suffix}"
        if not dest.exists():
            return dest
        counter += 1

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
    def __init__(self):
        self._processed_signatures: dict[tuple[str, int, int], float] = {}

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

        if not wait_for_complete(path):
            log.warning(f"ダウンロード完了を確認できませんでした: {path.name}")
            return

        try:
            stat = path.stat()
        except FileNotFoundError:
            log.warning(f"ファイルが見つかりません: {path.name}")
            return

        self._forget_old_signatures()
        signature = (str(path.resolve()), stat.st_mtime_ns, stat.st_size)
        if signature in self._processed_signatures:
            log.info(f"重複イベントをスキップ: {path.name}")
            return
        self._processed_signatures[signature] = time.monotonic()

        log.info(f"新しいファイルを検出: {path.name}")

        dest = archive_name(path)
        try:
            shutil.copy2(path, dest)
            log.info(f"✓ コピー完了: {dest}")
        except Exception as e:
            log.error(f"✗ コピー失敗: {e}")
            return

        sync_to_gdrive(dest)

    def _forget_old_signatures(self):
        now = time.monotonic()
        expired = [
            signature
            for signature, processed_at in self._processed_signatures.items()
            if now - processed_at > DEDUP_WINDOW_SECONDS
        ]
        for signature in expired:
            del self._processed_signatures[signature]


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
