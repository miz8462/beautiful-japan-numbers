"""
data/raw 配下の .xlsx を監視し、全シートを data/csv へ CSV 変換する watcher。
"""

from __future__ import annotations

import logging
import re
import time
from pathlib import Path

import pandas as pd
from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer

PROJECT_ROOT = Path(__file__).resolve().parents[2]
WATCH_DIR = PROJECT_ROOT / "data" / "raw"
CSV_DIR = PROJECT_ROOT / "data" / "csv"
LOG_FILE = PROJECT_ROOT / "logs" / "xlsx_to_csv_watcher.log"
FILE_SUFFIX = ".xlsx"
CSV_ENCODING = "utf-8-sig"


def configure_logger() -> logging.Logger:
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.FileHandler(LOG_FILE, encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )
    return logging.getLogger(__name__)


log = configure_logger()


def sanitize_filename_part(value: str) -> str:
    sanitized = re.sub(r'[\\/:*?"<>|\r\n]+', "_", value).strip()
    return sanitized or "Sheet"


def is_target_excel(path: Path) -> bool:
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


def convert_workbook(path: Path) -> list[Path]:
    created_files: list[Path] = []
    workbook = pd.ExcelFile(path, engine="openpyxl")

    for sheet_name in workbook.sheet_names:
        dataframe = workbook.parse(sheet_name=sheet_name, header=None, keep_default_na=False)
        dataframe = dataframe.dropna(axis=0, how="all").dropna(axis=1, how="all")
        safe_sheet_name = sanitize_filename_part(sheet_name)
        CSV_DIR.mkdir(parents=True, exist_ok=True)
        output_path = CSV_DIR / f"{path.stem}__{safe_sheet_name}.csv"
        dataframe.to_csv(output_path, index=False, header=False, encoding=CSV_ENCODING)
        created_files.append(output_path)

    return created_files


class XlsxToCsvHandler(FileSystemEventHandler):
    def __init__(self) -> None:
        self._processed_signatures: set[tuple[str, int, int]] = set()

    def on_created(self, event: FileSystemEvent) -> None:
        self._handle(Path(event.src_path), event.is_directory)

    def on_moved(self, event: FileSystemEvent) -> None:
        self._handle(Path(event.dest_path), event.is_directory)

    def _handle(self, path: Path, is_directory: bool) -> None:
        if is_directory or not is_target_excel(path):
            return

        if not wait_for_complete(path):
            log.error(f"変換失敗: ファイルの書き込み完了を確認できませんでした: {path.name}")
            return

        try:
            stat = path.stat()
        except FileNotFoundError:
            log.error(f"変換失敗: ファイルが見つかりません: {path.name}")
            return

        signature = (str(path.resolve()), stat.st_mtime_ns, stat.st_size)
        if signature in self._processed_signatures:
            return

        log.info(f"検知: {path.name}")

        try:
            created_files = convert_workbook(path)
        except Exception as exc:
            log.exception(f"変換失敗: {path.name}: {exc}")
            return

        self._processed_signatures.add(signature)
        log.info(
            "変換成功: %s -> %s",
            path.name,
            ", ".join(output_path.name for output_path in created_files),
        )


def process_existing_files(handler: XlsxToCsvHandler) -> None:
    for path in sorted(WATCH_DIR.glob(f"*{FILE_SUFFIX}")):
        handler._handle(path, is_directory=False)


def main() -> None:
    WATCH_DIR.mkdir(parents=True, exist_ok=True)
    CSV_DIR.mkdir(parents=True, exist_ok=True)

    log.info(f"監視開始: {WATCH_DIR}")
    log.info(f"CSV保存先: {CSV_DIR}")

    handler = XlsxToCsvHandler()
    process_existing_files(handler)

    observer = Observer()
    observer.schedule(handler, str(WATCH_DIR), recursive=False)
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
