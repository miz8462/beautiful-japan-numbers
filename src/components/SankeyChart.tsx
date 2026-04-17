"use client"; // ← Next.js(App Router)でクライアントコンポーネントとして実行

import {
  Colors,
  getGovernmentSpendingChartColors,
  type ColorMode,
} from "@/styles/colors";
import * as d3 from "d3";
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyLink,
  type SankeyNode,
} from "d3-sankey";
import { useEffect, useRef, useState } from "react";

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

// sankey内部では source/target が文字列→オブジェクトに変わるので安全にtype取得
function getEndpointType(endpoint: string | number | LayoutNode): string {
  if (typeof endpoint === "object" && endpoint !== null && "type" in endpoint) {
    return endpoint.type;
  }
  return "";
}

function formatNodeValue(value: number | undefined): string {
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1, // 小数点1桁まで
  }).format(value ?? 0);
}

/*
=========================
メインコンポーネント
=========================
*/

export default function SankeyChart({ data }: { data: GovernmentSpendingData }) {
  const ref = useRef<SVGSVGElement | null>(null); // SVGを直接D3で操作するための参照

  /*
  =========================
  Color Mode
  =========================
  */
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateColorMode = () => {
      setColorMode(mediaQuery.matches ? "dark" : "light");
    };

    updateColorMode();
    mediaQuery.addEventListener("change", updateColorMode);

    return () => {
      mediaQuery.removeEventListener("change", updateColorMode);
    };
  }, []);

  /*
  =========================
  Sankeyレイアウト設定
  =========================
  */
  useEffect(() => {
    if (!data) return;

    // 色を取得
    const colors = getGovernmentSpendingChartColors(colorMode);
    const nodeFillColors: Record<NodeType, string> = {
      revenue_item: colors.revenue.item,
      revenue_total: colors.revenue.total,
      spending_total: colors.spending.total,
      spending_item: colors.spending.item,
    };
    const nodeLabelFill =
      colorMode === "dark" ? Colors.grey[900] : Colors.grey[50];

    // ノードの色をtypeから決定
    const getNodeFill = (type: string): string => {
      return nodeFillColors[type as NodeType] ?? colors.revenue.item;
    };

    const width = 800;
    const height = 400;

    //ノードの文字表示
    const getNodeLabelPadding = (type: NodeType) =>
      type === "revenue_total" || type === "spending_total" ? 8 : 20;

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
      .nodeWidth(100) // ノードの横幅
      .nodePadding(10) // ノード間の縦間隔
      .nodeSort(null) // 自動ソートしない（順序固定）
      .nodeAlign((node) => NODE_COLUMNS[node.type] ?? 0) // typeで列位置決定
      .extent([[1, 1], [width - 1, height - 5]]); // 描画範囲

    // レイアウト計算（ここで座標が付与される）
    const graph = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })), // 元データ破壊防止
      links: data.links.map((d) => ({ ...d })),
    });

    const WIDE = 60; // 個別にノードの幅を修正する
    const SHIFT = 200; // 支出を左に寄せる

    graph.nodes.forEach((node) => {
      // 収入と支出のノード幅狭める
      if (node.type === "revenue_total") {
        node.x1 = (node.x0 ?? 0) + WIDE;
      }
      if (node.type === "spending_total") {
        node.x0 = (node.x1 ?? 0) - WIDE;
      }
      // 右半分を左にずらす（収入・支出の間を狭める）
      if (node.type === "spending_total" || node.type === "spending_item") {
        node.x0 = (node.x0 ?? 0) - SHIFT;
        node.x1 = (node.x1 ?? 0) - SHIFT;
      }
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
          return colors.revenue.item;
        }
        return colors.spending.item;
      })
      .attr("stroke-width", (d: LayoutLink) => Math.max(1, d.width ?? 0)) // 太さ＝量
      .attr("fill", "none")
      .attr("opacity", (d: LayoutLink) => {
        const sourceType = getEndpointType(d.source);
        const targetType = getEndpointType(d.target);

        if (sourceType === "revenue_total" && targetType === "spending_total") {
          return 0;
        }
        return colors.linkOpacity;
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
      // ノード内の左端に少し余白を取って配置
      .attr("x", (d: LayoutNode) => (d.x0 ?? 0) + getNodeLabelPadding(d.type))
      .attr("y", (d: LayoutNode) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
      .attr("text-anchor", "start") // 横方向の左揃え
      .attr("dominant-baseline", "middle") // 縦方向の中央揃え
      .attr("fill", nodeLabelFill) // 文字色
      .attr("font-weight", 700)
      .attr("pointer-events", "none")
      // ノードごとの処理
      .each(function (d: LayoutNode) {
        const text = d3.select(this);
        const textNode = text.node();
        if (!(textNode instanceof SVGTextElement)) return;

        const nodeWidth = (d.x1 ?? 0) - (d.x0 ?? 0);
        const nodeHeight = (d.y1 ?? 0) - (d.y0 ?? 0);
        const labelPadding = getNodeLabelPadding(d.type);
        const labelX = (d.x0 ?? 0) + labelPadding;
        const maxWidth = nodeWidth - labelPadding * 2; // 左右余白

        const valueText = formatNodeValue(d.value);

        // 小さいノード(1行)
        if (nodeHeight < 30) {
          let label = `${valueText} ${d.label}`;

          text
            .attr("font-size", 14)
            .text(label);
          // 幅に収まるまで削る
          while (textNode.getComputedTextLength() > maxWidth && label.length > 0) {
            label = label.slice(0, -1);
            text.text(label + "…");
          }
          return;
        }

        // 大きいノード(2行)
        // 値
        text
          .append("tspan")
          .attr("font-size", 20)
          .attr("x", labelX)
          .attr("dy", "-0.25em")
          .text(valueText);

        // 下段：label（幅フィット）
        let label = d.label;
        const labelTspan = text.append("tspan")
          .attr("font-size", 14)
          .attr("x", labelX)
          .attr("dy", "1.2em")
          .attr("font-weight", 500)
          .text(label);

        while (labelTspan.node()!.getComputedTextLength() > maxWidth && label.length > 0) {
          label = label.slice(0, -1);
          labelTspan.text(label + "…");
        }
      });

  }, [data, colorMode]); // dataまたは配色が変わったら再描画

  // ReactはSVGの枠だけ持つ（中身はD3が直接操作）
  return <svg ref={ref} width={800} height={500} />;
}
