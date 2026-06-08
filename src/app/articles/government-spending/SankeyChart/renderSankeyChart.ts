import {
  Colors,
  getGovernmentSpendingChartColors,
} from "@/app/articles/government-spending/SankeyChart/colors";
import * as d3 from "d3";
import { sankeyLinkHorizontal } from "d3-sankey";
import {
  CHART_BACKGROUND_COLOR,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_LABEL_FILL,
  ITEM_NODE_LABEL_PADDING,
  PARENT_HIGHLIGHT_COLOR,
  SVG_HEIGHT,
  SVG_WIDTH,
  TOTAL_NODE_LABEL_PADDING,
} from "./constants";
import { formatNodePercent, formatNodeValue } from "./formatters";
import {
  getAncestorSegmentData,
  getConnectedItems,
  getEndpointType,
  getLinkHoverNode,
  getNodeSide,
  isCentralLink,
} from "./graphHelpers";
import { createTextMeasurer, getLabelHitExtension, renderNodeLabel } from "./labels";
import { createGovernmentSpendingLayout, getTotalValueBySide } from "./sankey-layout";
import { DEFAULT_SANKEY_INFO_PANEL, type SankeyInfoPanelState } from "./SankeyInfoPanel";
import type {
  GovernmentSpendingData,
  LayoutLink,
  LayoutNode,
  NodeType,
  SegmentDatum,
} from "./types";

const LINK_HIT_STROKE_WIDTH = 28;

function isLayoutNode(datum: unknown): datum is LayoutNode {
  return (
    typeof datum === "object" &&
    datum !== null &&
    "id" in datum &&
    "type" in datum &&
    "label" in datum
  );
}

function isLayoutLink(datum: unknown): datum is LayoutLink {
  return (
    typeof datum === "object" &&
    datum !== null &&
    "source" in datum &&
    "target" in datum &&
    "value" in datum
  );
}

function resolveNodeFromElement(
  element: Element | null,
  svgElement: SVGSVGElement,
): LayoutNode | null {
  let current = element;

  while (current && current !== svgElement) {
    const datum = d3.select(current).datum() as unknown;

    if (isLayoutNode(datum)) {
      return datum;
    }

    if (isLayoutLink(datum)) {
      return getLinkHoverNode(datum);
    }

    current = current.parentElement;
  }

  return null;
}

function findNodeAtPoint(
  x: number,
  y: number,
  nodes: LayoutNode[],
  getNodeLabelPadding: (type: NodeType) => number,
): LayoutNode | null {
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index];
    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;
    const hitRight = x1 + getLabelHitExtension(node.type) + getNodeLabelPadding(node.type);

    if (x >= x0 && x <= hitRight && y >= y0 && y <= y1) {
      return node;
    }
  }

  return null;
}

function resolveHoverFromClientPoint(
  clientX: number,
  clientY: number,
  svgElement: SVGSVGElement,
  nodes: LayoutNode[],
  getNodeLabelPadding: (type: NodeType) => number,
): LayoutNode | null {
  const elements = document.elementsFromPoint(clientX, clientY);

  for (const element of elements) {
    if (!svgElement.contains(element)) continue;

    const node = resolveNodeFromElement(element, svgElement);
    if (node) return node;
  }

  const ctm = svgElement.getScreenCTM();
  if (!ctm) return null;

  const point = svgElement.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const { x, y } = point.matrixTransform(ctm.inverse());

  return findNodeAtPoint(x, y, nodes, getNodeLabelPadding);
}

export function renderSankeyChart(
  svgElement: SVGSVGElement,
  data: GovernmentSpendingData,
  onPanelUpdate: (state: SankeyInfoPanelState) => void,
): () => void {
  const colors = getGovernmentSpendingChartColors();
  const nodeFillColors: Record<NodeType, string> = {
    revenue_detail: colors.revenue.detail,
    revenue_item: colors.revenue.item,
    revenue_total: colors.revenue.total,
    spending_total: colors.spending.total,
    spending_item: colors.spending.item,
    spending_detail: colors.spending.detail,
  };
  const nodeLabelFill = Colors.grey[50];
  const getNodeFill = (type: string): string => {
    return nodeFillColors[type as NodeType] ?? colors.revenue.item;
  };

  const getDefaultLinkStroke = (link: LayoutLink) => {
    if (isCentralLink(link)) {
      return Colors.transparent;
    }

    if (getEndpointType(link.source).startsWith("revenue")) {
      return colors.revenue.item;
    }
    return colors.spending.item;
  };

  const getDefaultLinkOpacity = (link: LayoutLink) => {
    if (isCentralLink(link)) {
      return 0;
    }
    return colors.linkOpacity;
  };

  const getNodeLabelPadding = (type: NodeType) =>
    type === "revenue_total" || type === "spending_total"
      ? TOTAL_NODE_LABEL_PADDING
      : ITEM_NODE_LABEL_PADDING;

  // 描画開始
  const svg = d3.select(svgElement);
  svg.selectAll("*").remove();
  // 背景
  svg
    .append("rect")
    .attr("class", "chart-background")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("fill", CHART_BACKGROUND_COLOR)
    .style("pointer-events", "none"); // ホバー判定しないように

  const graph = createGovernmentSpendingLayout(data);
  const totalValueBySide = getTotalValueBySide(graph.nodes);
  const textMeasurer = createTextMeasurer(svg);

  // 描画するレイヤー
  const linkLayer = svg.append("g").attr("class", "links"); // gタグはhtmlのdiv
  const nodeLayer = svg.append("g").attr("class", "nodes");
  const linkHitLayer = svg.append("g").attr("class", "link-hits");
  const segmentLayer = svg.append("g").attr("class", "segments").attr("pointer-events", "none");
  const labelLayer = svg.append("g").attr("class", "labels");

  // リンク
  const linkSelection = linkLayer
    .selectAll<SVGPathElement, LayoutLink>("path") // pathは線を描くsvgのタグ
    .data(graph.links)
    .join("path")
    .attr("d", sankeyLinkHorizontal()) // dはパスの属性。パスの形を計算
    .attr("stroke", getDefaultLinkStroke) // 線の色
    .attr("stroke-width", (d: LayoutLink) => Math.max(1, d.width ?? 0)) // 線の太さ
    .attr("fill", "none")
    .attr("opacity", getDefaultLinkOpacity)
    .style("pointer-events", "none");

  // ホバー判定
  linkHitLayer
    .selectAll<SVGPathElement, LayoutLink>("path")
    .data(graph.links.filter((link) => !isCentralLink(link))) // 歳入と歳出のリンクはホバー対象外
    .join("path")
    .attr("class", "link-hit")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", "transparent")
    .attr("stroke-width", LINK_HIT_STROKE_WIDTH) // 実際より太い当たり判定
    .attr("fill", "none")
    .attr("pointer-events", "stroke")
    .style("cursor", "pointer"); // ホバーするとポインタを矢印から指に

  // ノード
  const nodeGroupSelection = nodeLayer
    .selectAll<SVGGElement, LayoutNode>("g.node")
    .data(graph.nodes)
    .join("g") // ひとつのノード
    .attr("class", "node")
    .style("cursor", "pointer");

  const nodeRectSelection = nodeGroupSelection
    .append("rect") // 各<g>の中にrectを追加
    .attr("x", (d: LayoutNode) => d.x0 ?? 0)
    .attr("y", (d: LayoutNode) => d.y0 ?? 0)
    .attr("height", (d: LayoutNode) => (d.y1 ?? 0) - (d.y0 ?? 0))
    .attr("width", (d: LayoutNode) => (d.x1 ?? 0) - (d.x0 ?? 0))
    .attr("fill", (d: LayoutNode) => getNodeFill(d.type)); // 色

  // ラベル
  const labelSelection = labelLayer
    .selectAll<SVGTextElement, LayoutNode>("text")
    .data(graph.nodes)
    .join("text") // 各<g>の中にtextを追加(rectと同じ)
    .attr("fill", nodeLabelFill) // 文字色
    .attr("font-weight", 700)
    .style("cursor", "pointer")
    .style("pointer-events", "all") 
    .each(function (d: LayoutNode) {
      // thisはtext要素
      // dはノードのデータ
      if (!(this instanceof SVGTextElement)) return;

      renderNodeLabel(
        d3.select<SVGTextElement, LayoutNode>(this),
        d,
        getNodeLabelPadding(d.type),
        textMeasurer,
      );
    });

  // 右上の詳細パネル
  const showDefaultPanel = () => {
    onPanelUpdate(DEFAULT_SANKEY_INFO_PANEL);
  };

  // ホバーが外れたとき元に戻す
  const resetVisuals = () => {
    segmentLayer.selectAll("rect").remove();

    nodeRectSelection
      .attr("fill", (d: LayoutNode) => getNodeFill(d.type))
      .attr("opacity", 1);

    linkSelection
      .attr("stroke", getDefaultLinkStroke)
      .attr("opacity", getDefaultLinkOpacity);

    labelSelection.attr("fill", nodeLabelFill).attr("opacity", 1);
  };

  const resetHighlight = () => {
    resetVisuals();
    showDefaultPanel();
  };

  // ホバー時に色を変える
  const showHighlight = (hoveredNode: LayoutNode) => {
    const { ancestorSegmentLinks, brightNodes, connectedLinks, connectedNodes } =
      getConnectedItems(hoveredNode);
    const hoveredSide = getNodeSide(hoveredNode); // 歳入or歳出
    const segmentData = getAncestorSegmentData(ancestorSegmentLinks, hoveredSide);
    const segmentParentIds = new Set(segmentData.map((segment) => segment.node.id));
    const isRelated = (node: LayoutNode) =>
      brightNodes.has(node) || connectedNodes.has(node);

    // ノードの色を変える
    nodeRectSelection.attr("fill", (d: LayoutNode) => {
      if (brightNodes.has(d)) {
        return HIGHLIGHT_COLOR;
      }
      if (connectedNodes.has(d) && !segmentParentIds.has(d.id)) {
        return PARENT_HIGHLIGHT_COLOR;
      }
      return getNodeFill(d.type);
    });

    // リンクの色を変える
    linkSelection
      .attr("stroke", (d: LayoutLink) =>
        connectedLinks.has(d) ? HIGHLIGHT_COLOR : getDefaultLinkStroke(d),
      )
      .attr("opacity", (d: LayoutLink) =>
        connectedLinks.has(d) ? 0.95 : getDefaultLinkOpacity(d),
      );

    // 色を変えるセグメント
    segmentLayer
      .selectAll<SVGRectElement, SegmentDatum>("rect")
      .data(segmentData, (d) => d.key)
      .join("rect")
      .attr("x", (d) => d.node.x0 ?? 0)
      .attr("y", (d) => d.y)
      .attr("height", (d) => d.height)
      .attr("width", (d) => ((d.node.x1 ?? 0) - (d.node.x0 ?? 0)))
      .attr("fill", HIGHLIGHT_COLOR);

    // 右上の詳細パネルの更新
    onPanelUpdate({
      title: hoveredNode.label,
      subtitle: `${formatNodeValue(hoveredNode.value)}円・全体の${formatNodePercent(
        hoveredNode.value,
        totalValueBySide[hoveredSide],
      )}`,
    });
  };

  showDefaultPanel();

  let activeHoverId: string | null = null; // ホバーノードのID
  let pointerInsideChart = false; // ポインタがSVG領域内にあるかどうか
  let latestClientX = 0; 
  let latestClientY = 0;
  let hoverFrameId: number | null = null;

  const clearHover = () => {
    activeHoverId = null;
    resetHighlight();
  };

  // ホバー対象が変わったとき
  const applyHoverTarget = (node: LayoutNode | null) => {
    // ノードの上にいない場合
    if (!node) {
      if (activeHoverId !== null) {
        clearHover();
      }
      return;
    }

    // 同じノードにいる場合。なにもしない
    if (activeHoverId === node.id) {
      return;
    }

    // 別のノードに移動した場合
    if (activeHoverId !== null) {
      resetVisuals();
    }

    activeHoverId = node.id;
    showHighlight(node);
  };

  const isPointerOverSvg = () => {
    const { left, right, top, bottom } = svgElement.getBoundingClientRect();
    return (
      latestClientX >= left &&
      latestClientX <= right &&
      latestClientY >= top &&
      latestClientY <= bottom
    );
  };

  // 実際のホバー処理
  const syncHoverFromLatestPointer = () => {
    hoverFrameId = null;

    // ポインタがチャートの外
    if (!pointerInsideChart || !isPointerOverSvg()) {
      if (!isPointerOverSvg()) {
        pointerInsideChart = false;
      }

      if (activeHoverId !== null) {
        clearHover();
      }
      return;
    }

    // ポインタがチャートの内
    applyHoverTarget(
      resolveHoverFromClientPoint( // ノードを特定
        latestClientX,
        latestClientY,
        svgElement,
        graph.nodes,
        getNodeLabelPadding,
      ),
    );
  };

  // マウスを動かすと発火。座標の上書き、rFAの予約チェック
  const scheduleHoverSync = (event: PointerEvent) => {
    latestClientX = event.clientX;
    latestClientY = event.clientY;

    if (hoverFrameId !== null) {
      return;
    }

    // rFA(次の画面を描画するタイミングで引数の関数を実行)
    // scheduleHoverはマウスの移動に合わせて発火する関数なので画面更新より多く発火する
    // なので、重い処理は引数であるsyncHoverにまかせる
    hoverFrameId = requestAnimationFrame(syncHoverFromLatestPointer);
  };

  const onPointerEnter = (event: PointerEvent) => {
    pointerInsideChart = true;
    scheduleHoverSync(event);
  };

  const onPointerLeave = () => {
    pointerInsideChart = false;

    if (hoverFrameId !== null) {
      cancelAnimationFrame(hoverFrameId);
      hoverFrameId = null;
    }

    if (activeHoverId !== null) {
      clearHover();
    }
  };

  // イベントリスナー
  svgElement.addEventListener("pointerenter", onPointerEnter);
  svgElement.addEventListener("pointerleave", onPointerLeave);
  svgElement.addEventListener("pointermove", scheduleHoverSync);
  svgElement.addEventListener("pointercancel", onPointerLeave);
  const onWindowPointerMove = (event: PointerEvent) => {
    if (!pointerInsideChart) return;
    scheduleHoverSync(event);
  };

  // マウスが素早くSVG外にでた場合、イベントが途切れハイライトが残らないように
  window.addEventListener("pointermove", onWindowPointerMove);

  return () => {
    // クリーンナップ
    window.removeEventListener("pointermove", onWindowPointerMove);
    svgElement.removeEventListener("pointerenter", onPointerEnter);
    svgElement.removeEventListener("pointerleave", onPointerLeave);
    svgElement.removeEventListener("pointermove", scheduleHoverSync);
    svgElement.removeEventListener("pointercancel", onPointerLeave);
    onPointerLeave();
  };
}
