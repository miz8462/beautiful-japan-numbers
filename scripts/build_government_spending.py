import pandas as pd
import json
from pathlib import Path

# パス設定
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "government-spending"
OUTPUT_DIR = BASE_DIR / "public" / "data"

# CSV読み込み
nodes_df = pd.read_csv(DATA_DIR / "nodes.csv")
links_df = pd.read_csv(DATA_DIR / "links.csv")

# ノード整形
nodes = []
node_ids = set()

for _, row in nodes_df.iterrows():
    if pd.isna(row["id"]) or pd.isna(row["label"]) or pd.isna(row["type"]):
        continue

    nodes.append({
        "id": row["id"],
        "label": row["label"],
        "type": row["type"]
    })
    node_ids.add(row["id"])


# リンク整形
links = []
for _, row in links_df.iterrows():
    # 空の行はスキップ
    if pd.isna(row["source"]) or pd.isna(row["target"]) or pd.isna(row["value"]):
        continue

    source = row["source"]
    target = row["target"]
    value = float(row["value"])

    # ノードが存在しない場合はスキップ
    if source not in node_ids or target not in node_ids:
        continue

    # 値が0以下の場合はスキップ
    if value <= 0:
        continue

    links.append({
        "source": source,
        "target": target,
        "value": value
    })

# JSON構造
output = {
    "nodes": nodes,
    "links": links
}

# 出力ディレクトリ作成
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# JSON書き込み
output_path = OUTPUT_DIR / "government-spending.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"JSONファイルを生成しました: {output_path}")