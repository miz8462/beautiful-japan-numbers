"use client"; // ← Next.js(App Router)でクライアントコンポーネントとして実行

import * as d3 from "d3";
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyLink,
  type SankeyNode,
} from "d3-sankey";
import { useEffect, useRef } from "react";
import { ChartColors, Colors } from "@/styles/colors";

/*
=========================
型定義（データ構造）
========================= 
*/

type NodeType =
  | "revenue_item"
  | "revenue_total"
  | "spending_total"
  | "spending_item";

// ノード
export type GovernmentSpendingNode = {
  [key: string]: string;
  id: string;
  label: string;
  type: NodeType;
};

// リンク
export type GovernmentSpendingLink = {
  [key: string]: number | string;
  source: string;
  target: string;
  value: number;
};

// JSON全体
export type GovernmentSpendingData = {
  nodes: GovernmentSpendingNode[];
  links: GovernmentSpendingLink[];
};

// d3-sankey用の型
type LayoutNode = SankeyNode<GovernmentSpendingNode, GovernmentSpendingLink>;
type LayoutLink = SankeyLink<GovernmentSpendingNode, GovernmentSpendingLink>;

/*
=========================
見た目設定（色・配置）
=========================
*/

const GOVERNMENT_SPENDING_COLORS = ChartColors.governmentSpending;

const NODE_FILL_COLORS: Record<NodeType, string> = {
  revenue_item: GOVERNMENT_SPENDING_COLORS.revenue.item,
  revenue_total: GOVERNMENT_SPENDING_COLORS.revenue.total,
  spending_total: GOVERNMENT_SPENDING_COLORS.spending.total,
  spending_item: GOVERNMENT_SPENDING_COLORS.spending.item,
};

// ノードをどの列に置くか（左→右）
const NODE_COLUMNS: Record<NodeType, number> = {
  revenue_item: 0,
  revenue_total: 1,
  spending_total: 2,
  spending_item: 3,
};

/*
=========================
ユーティリティ関数
========================= 
*/

// ノードの色をtypeから決定
function getNodeFill(type: string): string {
  return NODE_FILL_COLORS[type as NodeType] ?? GOVERNMENT_SPENDING_COLORS.revenue.item;
}

// sankey内部では source/target が文字列→オブジェクトに変わるので安全にtype取得
function getEndpointType(endpoint: string | number | LayoutNode): string {
  if (typeof endpoint === "object" && endpoint !== null && "type" in endpoint) {
    return endpoint.type;
  }
  return "";
}

/*
=========================
メインコンポーネント
=========================
*/

export default function SankeyChart({ data }: { data: GovernmentSpendingData }) {
  const ref = useRef<SVGSVGElement | null>(null); // SVGを直接D3で操作するための参照

  useEffect(() => {
    if (!data) return; // データなければ何もしない

    const width = 800;
    const height = 500;

    // SVG取得＆初期化（再描画のため全削除）
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    /*
    =========================
    Sankeyレイアウト設定
    =========================
    */

    const sankeyGenerator = sankey<
      GovernmentSpendingData,
      GovernmentSpendingNode,
      GovernmentSpendingLink
    >()
      .nodeId((d) => d.id) // ノード識別キー
      .nodeWidth(20) // ノードの横幅
      .nodePadding(10) // ノード間の縦間隔
      .nodeSort(null) // 自動ソートしない（順序固定）
      .nodeAlign((node) => NODE_COLUMNS[node.type] ?? 0) // typeで列位置決定
      .extent([[1, 1], [width - 1, height - 5]]); // 描画範囲

    // レイアウト計算（ここで座標が付与される）
    const graph = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })), // 元データ破壊防止
      links: data.links.map((d) => ({ ...d })),
    });

    /*
    =========================
    リンク（流れ）描画
    =========================
    */

    svg.append("g")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal()) // 曲線生成
      .attr("stroke", (d: LayoutLink) => {
        const sourceType = getEndpointType(d.source);
        const targetType = getEndpointType(d.target);

        // 中央リンクは非表示（見た目調整）
        if (sourceType === "revenue_total" && targetType === "spending_total") {
          return Colors.transparent;
        }

        // 色分け
        if (sourceType.startsWith("revenue")) {
          return GOVERNMENT_SPENDING_COLORS.revenue.item;
        }
        return GOVERNMENT_SPENDING_COLORS.spending.item;
      })
      .attr("stroke-width", (d: LayoutLink) => Math.max(1, d.width ?? 0)) // 太さ＝量
      .attr("fill", "none")
      .attr("opacity", (d: LayoutLink) => {
        const sourceType = getEndpointType(d.source);
        const targetType = getEndpointType(d.target);

        if (sourceType === "revenue_total" && targetType === "spending_total") {
          return 0;
        }
        return 0.45;
      });

    /*
    =========================
    ノード（箱）描画
    =========================
    */

    svg.append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("x", (d: LayoutNode) => d.x0 ?? 0)
      .attr("y", (d: LayoutNode) => d.y0 ?? 0)
      .attr("height", (d: LayoutNode) => (d.y1 ?? 0) - (d.y0 ?? 0))
      .attr("width", (d: LayoutNode) => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr("fill", (d: LayoutNode) => getNodeFill(d.type));

    /*
    =========================
    ラベル描画
    =========================
    */

    svg.append("g")
      .selectAll("text")
      .data(graph.nodes)
      .join("text")
      .attr("x", (d: LayoutNode) => (d.x0 ?? 0) - 6) // 基本は左側
      .attr("y", (d: LayoutNode) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d: LayoutNode) => d.label)
      // 左半分のノードだけ右側にラベル出す（見やすさ調整）
      .filter((d: LayoutNode) => (d.x0 ?? 0) < width / 2)
      .attr("x", (d: LayoutNode) => (d.x1 ?? 0) + 6)
      .attr("text-anchor", "start");

  }, [data]); // dataが変わったら再描画

  // ReactはSVGの枠だけ持つ（中身はD3が直接操作）
  return <svg ref={ref} width={800} height={500} />;
}
