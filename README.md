# beautiful-japan-numbers

## Excel to CSV watcher MVP

`data/raw` に `.xlsx` が来たら検知し、全シートを `data/csv` へ CSV に変換します。

出力形式:

- `元ファイル名__シート名.csv`
- 例: `budget.xlsx` -> `budget__Sheet1.csv`, `budget__歳入.csv`

ログ:

- `検知`
- `変換成功`
- `変換失敗`

ログファイル:

- `logs/xlsx_to_csv_watcher.log`

### セットアップ

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### 起動

手動で起動する場合:

```bash
source venv/bin/activate
python scripts/ingest/xlsx_to_csv_watcher.py
```

systemd user service として起動する場合:

```bash
mkdir -p ~/.config/systemd/user
cp systemd/user/*.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now download-to-raw-watcher.service xlsx-to-csv-watcher.service download-to-csv-watcher.service
```

### 動作

- 監視対象: `data/raw`
- 対象拡張子: `.xlsx`
- 出力先: `data/csv`

`scripts/ingest/download_to_raw_watcher.py` は Downloads から `data/raw` へ Excel をコピーする watcher です。`scripts/ingest/download_to_csv_watcher.py` は Downloads から `data/csv` へ CSV をコピーする watcher です。service テンプレートは `systemd/user/` に置いています。
