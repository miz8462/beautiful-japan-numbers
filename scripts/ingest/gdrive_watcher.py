import os
import time
import logging
import subprocess
from pathlib import Path

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

WATCH_DIR   = Path.home() / "downloads"
GDRIVE_DEST = "gdrive:beautiful-japan-numbers/raw"

FILE_PATTERNS = [
    "*.xlsx",
    "*.xls",
]

LOG_FILE = Path("logs/watcher.log")
DEDUP_WINDOW_SECONDS = 120

LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
log = logging.getLogger(__name__)
log.setLevel(logging.INFO)
log.propagate = False

if not log.handlers:
    handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    log.addHandler(handler)


def matches_pattern(path: Path) -> bool:
    return any(path.match(pat) for pat in FILE_PATTERNS)


def wait_for_complete(path: Path, timeout: int = 30) -> bool:
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


def sync_to_gdrive(file_path: Path):
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
        log.warning("rclone がインストールされていません。")
    except subprocess.TimeoutExpired:
        log.error("rclone タイムアウト")


class ExcelHandler(FileSystemEventHandler):
    def __init__(self):
        self._processed_signatures: dict[tuple[str, int, int], float] = {}

    def on_created(self, event):
        if not event.is_directory:
            self._handle(Path(event.src_path))

    def on_moved(self, event):
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
            return

        self._forget_old_signatures()
        signature = (str(path.resolve()), stat.st_mtime_ns, stat.st_size)
        if signature in self._processed_signatures:
            log.info(f"重複イベントをスキップ: {path.name}")
            return
        self._processed_signatures[signature] = time.monotonic()

        sync_to_gdrive(path)

    def _forget_old_signatures(self):
        now = time.monotonic()
        expired = [
            sig for sig, t in self._processed_signatures.items()
            if now - t > DEDUP_WINDOW_SECONDS
        ]
        for sig in expired:
            del self._processed_signatures[sig]


def main():
    log.info(f"監視開始: {WATCH_DIR}")
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