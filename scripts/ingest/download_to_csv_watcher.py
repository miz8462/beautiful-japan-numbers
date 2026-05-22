"""
Downloads フォルダを監視し、CSV ファイルを data/csv へコピーする watcher。
"""

from __future__ import annotations

import logging
import shutil
import time
from pathlib import Path

from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer

PROJECT_ROOT = Path(__file__).resolve().parents[2]
WATCH_DIR = Path.home() / "downloads"
DEST_DIR = PROJECT_ROOT / "data" / "csv"
LOG_FILE = PROJECT_ROOT / "logs" / "download_to_csv_watcher.log"
FILE_SUFFIX = ".csv"
DEDUP_WINDOW_SECONDS = 120


def configure_logger() -> logging.Logger:
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    if not logger.handlers:
        handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
        handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
        logger.addHandler(handler)

    return logger


log = configure_logger()


def is_target_csv(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() == FILE_SUFFIX


def wait_for_complete(path: Path, timeout: int = 30, stable_checks: int = 2) -> bool:
    previous_size = -1
    stable_count = 0

    for _ in range(timeout):
        try:
            current_size = path.stat().st_size
        except FileNotFoundError:
            return False

        if current_size > 0 and current_size == previous_size:
            stable_count += 1
            if stable_count >= stable_checks:
                return True
        else:
            stable_count = 0

        previous_size = current_size
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

class DownloadToCsvHandler(FileSystemEventHandler):
    def __init__(self) -> None:
        self._processed_signatures: dict[tuple[str, int, int], float] = {}

    def on_created(self, event: FileSystemEvent) -> None:
        self._handle(Path(event.src_path), event.is_directory)

    def on_moved(self, event: FileSystemEvent) -> None:
        self._handle(Path(event.dest_path), event.is_directory)

    def _handle(self, path: Path, is_directory: bool) -> None:
        if is_directory or not is_target_csv(path):
            return

        if not wait_for_complete(path):
            log.warning(f"コピー失敗: ダウンロード完了を確認できませんでした: {path.name}")
            return

        try:
            stat = path.stat()
        except FileNotFoundError:
            log.warning(f"コピー失敗: ファイルが見つかりません: {path.name}")
            return

        self._forget_old_signatures()
        signature = (str(path.resolve()), stat.st_mtime_ns, stat.st_size)
        if signature in self._processed_signatures:
            log.info(f"重複イベントをスキップ: {path.name}")
            return
        self._processed_signatures[signature] = time.monotonic()

        DEST_DIR.mkdir(parents=True, exist_ok=True)
        dest = archive_name(path)

        try:
            shutil.copy2(path, dest)
        except Exception as exc:
            log.exception(f"コピー失敗: {path.name}: {exc}")
            return

        log.info(f"コピー成功: {path.name} -> {dest}")

    def _forget_old_signatures(self) -> None:
        now = time.monotonic()
        expired = [
            signature
            for signature, processed_at in self._processed_signatures.items()
            if now - processed_at > DEDUP_WINDOW_SECONDS
        ]
        for signature in expired:
            del self._processed_signatures[signature]


def main() -> None:
    DEST_DIR.mkdir(parents=True, exist_ok=True)

    log.info(f"監視開始: {WATCH_DIR}")
    log.info(f"保存先: {DEST_DIR}")

    observer = Observer()
    observer.schedule(DownloadToCsvHandler(), str(WATCH_DIR), recursive=False)
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
