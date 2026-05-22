import csv
import json
from pathlib import Path

import pandas as pd

# パス設定
BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_DIR = BASE_DIR / "data" / "csv" / "sankey_government_spending"
DATA_DIR = BASE_DIR / "data" / "government_spending"
OUTPUT_DIR = BASE_DIR / "public" / "data"

REVENUE_PATH = SOURCE_DIR / "major_revenue" / "歳入主要科目別予算__3表.csv"
EXPENSE_PATH = SOURCE_DIR / "major_expense" / "主要経費別分類__R7.csv"

# Sankeyのvalueは百万円。表示側で万/億/兆へ短縮する。
THOUSAND_YEN_TO_MILLION_YEN = 1_000
GROUP_THRESHOLD_RATIO = 0.01

REVENUE_TOTAL_ID = "revenue_total"
SPENDING_TOTAL_ID = "spending_total"
OTHER_REVENUE_ID = "other_revenue"
OTHER_SPENDING_ID = "other_spending_group"

Item = dict[str, object]
NodeRow = dict[str, str]
LinkRow = dict[str, str]

REVENUE_ITEMS = [
    ("tax_stamp", "租税及び印紙収入", 6),
    ("monopoly_payment", "専売納付金", 9),
    ("government_business", "官業益金及び官業収入", 10),
    ("government_assets", "政府資産整理収入", 11),
    ("misc_revenue", "雑収入", 12),
    ("bonds", "公債金", 13),
    ("previous_surplus", "前年度剰余金受入", 14),
]

EXPENSE_ITEMS = [
    ("social_security", "社会保障関係費"),
    ("education_science", "文教及び科学振興費"),
    ("debt_service", "国債費"),
    ("pension", "恩給関係費"),
    ("local_allocation", "地方交付税交付金"),
    ("local_special_grants", "地方特例交付金"),
    ("defense", "防衛関係費"),
    ("public_works", "公共事業関係費"),
    ("economic_cooperation", "経済協力費"),
    ("sme_measures", "中小企業対策費"),
    ("energy_measures", "エネルギー対策費"),
    ("food_stability", "食料安定供給関係費"),
    ("other_matters", "その他の事項経費"),
    ("reserve_fund", "予備費"),
]

# 将来、税収や社会保障などにも詳細Sankeyを伸ばすための入口。
# 収入側は「詳細 -> 親」、支出側は「親 -> 詳細」の向きでリンクを作る。
# 例: REVENUE_DETAILS_BY_PARENT["tax_stamp"] = [{"id": "income_tax", "label": "所得税", "value": 123}]
# 例: EXPENSE_DETAILS_BY_PARENT["social_security"] = [{"id": "pension_benefits", "label": "年金給付費", "value": 123}]
REVENUE_DETAILS_BY_PARENT: dict[str, list[Item]] = {}
EXPENSE_DETAILS_BY_PARENT: dict[str, list[Item]] = {}


def parse_number(value: object) -> float:
    if pd.isna(value):
        return 0

    text = str(value).strip().replace(",", "")
    if text in {"", "-", "ー", "−"}:
        return 0

    return float(text)


def format_value(value: float) -> str:
    rounded = round(value, 3)
    return f"{rounded:.3f}".rstrip("0").rstrip(".")


def get_item_id(item: Item) -> str:
    return str(item["id"])


def get_item_label(item: Item) -> str:
    return str(item["label"])


def get_item_value(item: Item) -> float:
    return float(item["value"])


def make_node(node_id: str, label: str, node_type: str) -> NodeRow:
    return {"id": node_id, "label": label, "type": node_type}


def make_link(source: str, target: str, value: float) -> LinkRow:
    return {"source": source, "target": target, "value": format_value(value)}


def get_reiwa_7_revenue_row() -> pd.Series:
    revenue_df = pd.read_csv(REVENUE_PATH, header=None)
    rows = revenue_df[revenue_df[1].astype(str).str.strip() == "7"]
    if rows.empty:
        raise ValueError("令和7年度の歳入行が見つかりませんでした。")

    return rows.iloc[-1]


def get_revenue_items() -> tuple[list[Item], float]:
    row = get_reiwa_7_revenue_row()
    items = []

    for item_id, label, column_index in REVENUE_ITEMS:
        value = parse_number(row[column_index])
        if value <= 0:
            continue

        items.append({"id": item_id, "label": label, "value": value})

    total = parse_number(row[15])
    return items, total


def get_expense_initial_budget(label: str, expense_df: pd.DataFrame) -> float:
    label_series = expense_df[1].astype(str).str.replace("　", "", regex=False).str.strip()
    normalized_label = label.replace("　", "").strip()
    rows = expense_df[label_series == normalized_label]
    if rows.empty:
        raise ValueError(f"{label} の歳出行が見つかりませんでした。")

    first_row = rows.iloc[0]
    value = parse_number(first_row[4])
    if value > 0:
        return value / THOUSAND_YEN_TO_MILLION_YEN

    # 社会保障関係費などの大分類は、見出し行の後ろにある最初の「計」行を使う。
    following_rows = expense_df.loc[first_row.name + 1:]
    following_labels = following_rows[1].astype(str).str.replace("　", "", regex=False).str.strip()
    total_rows = following_rows[following_labels == "計"]
    if total_rows.empty:
        return 0

    return parse_number(total_rows.iloc[0][4]) / THOUSAND_YEN_TO_MILLION_YEN


def get_expense_items() -> tuple[list[Item], float]:
    expense_df = pd.read_csv(EXPENSE_PATH, header=None)
    items = []

    for item_id, label in EXPENSE_ITEMS:
        value = get_expense_initial_budget(label, expense_df)
        if value <= 0:
            continue

        items.append({"id": item_id, "label": label, "value": value})

    total = get_expense_initial_budget("合計", expense_df)
    return items, total


def split_items_by_threshold(items: list[Item], total: float) -> tuple[list[Item], list[Item]]:
    threshold = total * GROUP_THRESHOLD_RATIO
    major_items = [item for item in items if get_item_value(item) >= threshold]
    minor_items = [item for item in items if get_item_value(item) < threshold]
    return major_items, minor_items


def add_revenue_item_with_details(
    nodes: list[NodeRow],
    links: list[LinkRow],
    item: Item,
    parent_id: str,
    node_type: str = "revenue_item",
) -> None:
    item_id = get_item_id(item)
    nodes.append(make_node(item_id, get_item_label(item), node_type))
    links.append(make_link(item_id, parent_id, get_item_value(item)))

    for detail in REVENUE_DETAILS_BY_PARENT.get(item_id, []):
        detail_id = get_item_id(detail)
        nodes.append(make_node(detail_id, get_item_label(detail), "revenue_detail"))
        links.append(make_link(detail_id, item_id, get_item_value(detail)))


def add_spending_item_with_details(
    nodes: list[NodeRow],
    links: list[LinkRow],
    item: Item,
    parent_id: str,
    node_type: str = "spending_item",
) -> None:
    item_id = get_item_id(item)
    nodes.append(make_node(item_id, get_item_label(item), node_type))
    links.append(make_link(parent_id, item_id, get_item_value(item)))

    for detail in EXPENSE_DETAILS_BY_PARENT.get(item_id, []):
        detail_id = get_item_id(detail)
        nodes.append(make_node(detail_id, get_item_label(detail), "spending_detail"))
        links.append(make_link(item_id, detail_id, get_item_value(detail)))


def build_minor_revenue_group(minor_items: list[Item]) -> Item | None:
    if not minor_items:
        return None

    REVENUE_DETAILS_BY_PARENT[OTHER_REVENUE_ID] = minor_items
    return {
        "id": OTHER_REVENUE_ID,
        "label": "その他歳入",
        "value": sum(get_item_value(item) for item in minor_items),
    }


def build_minor_spending_group(minor_items: list[Item]) -> Item | None:
    if not minor_items:
        return None

    EXPENSE_DETAILS_BY_PARENT[OTHER_SPENDING_ID] = minor_items
    return {
        "id": OTHER_SPENDING_ID,
        "label": "その他歳出",
        "value": sum(get_item_value(item) for item in minor_items),
    }


def build_graph_rows() -> tuple[list[NodeRow], list[LinkRow]]:
    revenue_items, revenue_total = get_revenue_items()
    expense_items, expense_total = get_expense_items()
    revenue_major_items, revenue_minor_items = split_items_by_threshold(revenue_items, revenue_total)
    expense_major_items, expense_minor_items = split_items_by_threshold(expense_items, expense_total)

    nodes = []
    links = []

    for item in revenue_major_items:
        add_revenue_item_with_details(nodes, links, item, REVENUE_TOTAL_ID)

    other_revenue = build_minor_revenue_group(revenue_minor_items)
    if other_revenue:
        add_revenue_item_with_details(nodes, links, other_revenue, REVENUE_TOTAL_ID)

    nodes.append(make_node(REVENUE_TOTAL_ID, "歳入", "revenue_total"))
    nodes.append(make_node(SPENDING_TOTAL_ID, "歳出", "spending_total"))
    links.append(make_link(REVENUE_TOTAL_ID, SPENDING_TOTAL_ID, min(revenue_total, expense_total)))

    for item in expense_major_items:
        add_spending_item_with_details(nodes, links, item, SPENDING_TOTAL_ID)

    other_spending = build_minor_spending_group(expense_minor_items)
    if other_spending:
        add_spending_item_with_details(nodes, links, other_spending, SPENDING_TOTAL_ID)

    return nodes, links


def write_csv(path: Path, rows: list[dict[str, str]], fieldnames: list[str]) -> None:
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_source_csvs() -> tuple[list[NodeRow], list[LinkRow]]:
    nodes, links = build_graph_rows()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    write_csv(DATA_DIR / "nodes.csv", nodes, ["id", "label", "type"])
    write_csv(DATA_DIR / "links.csv", links, ["source", "target", "value"])

    return nodes, links


def write_json(nodes: list[NodeRow], links: list[LinkRow]) -> Path:
    node_ids = {node["id"] for node in nodes}
    json_links = []

    for row in links:
        source = row["source"]
        target = row["target"]
        value = parse_number(row["value"])

        if source not in node_ids or target not in node_ids or value <= 0:
            continue

        json_links.append({"source": source, "target": target, "value": value})

    output = {"nodes": nodes, "links": json_links}

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / "government-spending.json"
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    return output_path


def main() -> None:
    nodes, links = write_source_csvs()
    output_path = write_json(nodes, links)
    print(f"CSVファイルを生成しました: {DATA_DIR / 'nodes.csv'}, {DATA_DIR / 'links.csv'}")
    print(f"JSONファイルを生成しました: {output_path}")


if __name__ == "__main__":
    main()
