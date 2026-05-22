import {
  Colors,
  getGovernmentSpendingChartColors,
  type ColorMode,
} from "@/styles/colors";
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
import { DEFAULT_SANKEY_INFO_PANEL, type SankeyInfoPanelState } from "./SankeyInfoPanel";
import { createGovernmentSpendingLayout, getTotalValueBySide } from "./layout";
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
  colorMode: ColorMode,
  onPanelUpdate: (state: SankeyInfoPanelState) => void,
): () => void {
  const colors = getGovernmentSpendingChartColors(colorMode);
  const nodeFillColors: Record<NodeType, string> = {
    revenue_detail: colors.revenue.detail,
    revenue_item: colors.revenue.item,
    revenue_total: colors.revenue.total,
    spending_total: colors.spending.total,
    spending_item: colors.spending.item,
    spending_detail: colors.spending.detail,
  };
  const nodeLabelFill = colorMode === "dark" ? Colors.grey[900] : Colors.grey[50];

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

  const svg = d3.select(svgElement);
  svg.selectAll("*").remove();
  svg
    .append("rect")
    .attr("class", "chart-background")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("fill", CHART_BACKGROUND_COLOR)
    .style("pointer-events", "none");

  const graph = createGovernmentSpendingLayout(data);
  const totalValueBySide = getTotalValueBySide(graph.nodes);
  const textMeasurer = createTextMeasurer(svg);

  const linkLayer = svg.append("g").attr("class", "links");
  const nodeLayer = svg.append("g").attr("class", "nodes");
  const linkHitLayer = svg.append("g").attr("class", "link-hits");
  const segmentLayer = svg.append("g").attr("class", "segments").attr("pointer-events", "none");
  const labelLayer = svg.append("g").attr("class", "labels");

  const linkSelection = linkLayer
    .selectAll<SVGPathElement, LayoutLink>("path")
    .data(graph.links)
    .join("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", getDefaultLinkStroke)
    .attr("stroke-width", (d: LayoutLink) => Math.max(1, d.width ?? 0))
    .attr("fill", "none")
    .attr("opacity", getDefaultLinkOpacity)
    .style("pointer-events", "none");

  linkHitLayer
    .selectAll<SVGPathElement, LayoutLink>("path")
    .data(graph.links.filter((link) => !isCentralLink(link)))
    .join("path")
    .attr("class", "link-hit")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", "transparent")
    .attr("stroke-width", LINK_HIT_STROKE_WIDTH)
    .attr("fill", "none")
    .attr("pointer-events", "stroke")
    .style("cursor", "pointer");

  const nodeGroupSelection = nodeLayer
    .selectAll<SVGGElement, LayoutNode>("g.node")
    .data(graph.nodes)
    .join("g")
    .attr("class", "node")
    .style("cursor", "pointer");

  const nodeRectSelection = nodeGroupSelection
    .append("rect")
    .attr("x", (d: LayoutNode) => d.x0 ?? 0)
    .attr("y", (d: LayoutNode) => d.y0 ?? 0)
    .attr("height", (d: LayoutNode) => (d.y1 ?? 0) - (d.y0 ?? 0))
    .attr("width", (d: LayoutNode) => (d.x1 ?? 0) - (d.x0 ?? 0))
    .attr("fill", (d: LayoutNode) => getNodeFill(d.type));

  const labelSelection = labelLayer
    .selectAll<SVGTextElement, LayoutNode>("text")
    .data(graph.nodes)
    .join("text")
    .attr("fill", nodeLabelFill)
    .attr("font-weight", 700)
    .style("cursor", "pointer")
    .style("pointer-events", "all")
    .each(function (d: LayoutNode) {
      if (!(this instanceof SVGTextElement)) return;

      renderNodeLabel(
        d3.select<SVGTextElement, LayoutNode>(this),
        d,
        getNodeLabelPadding(d.type),
        textMeasurer,
      );
    });

  const showDefaultPanel = () => {
    onPanelUpdate(DEFAULT_SANKEY_INFO_PANEL);
  };

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

  const showHighlight = (hoveredNode: LayoutNode) => {
    const { ancestorSegmentLinks, brightNodes, connectedLinks, connectedNodes } =
      getConnectedItems(hoveredNode);
    const hoveredSide = getNodeSide(hoveredNode);
    const segmentData = getAncestorSegmentData(ancestorSegmentLinks, hoveredSide);
    const segmentParentIds = new Set(segmentData.map((segment) => segment.node.id));
    const isRelated = (node: LayoutNode) =>
      brightNodes.has(node) || connectedNodes.has(node);

    nodeRectSelection.attr("fill", (d: LayoutNode) => {
      if (brightNodes.has(d)) {
        return HIGHLIGHT_COLOR;
      }
      if (connectedNodes.has(d) && !segmentParentIds.has(d.id)) {
        return PARENT_HIGHLIGHT_COLOR;
      }
      return getNodeFill(d.type);
    });

    linkSelection
      .attr("stroke", (d: LayoutLink) =>
        connectedLinks.has(d) ? HIGHLIGHT_COLOR : getDefaultLinkStroke(d),
      )
      .attr("opacity", (d: LayoutLink) =>
        connectedLinks.has(d) ? 0.95 : getDefaultLinkOpacity(d),
      );

    segmentLayer
      .selectAll<SVGRectElement, SegmentDatum>("rect")
      .data(segmentData, (d) => d.key)
      .join("rect")
      .attr("x", (d) => d.node.x0 ?? 0)
      .attr("y", (d) => d.y)
      .attr("height", (d) => d.height)
      .attr("width", (d) => ((d.node.x1 ?? 0) - (d.node.x0 ?? 0)))
      .attr("fill", HIGHLIGHT_COLOR);

    labelSelection.attr("fill", (d: LayoutNode) =>
      isRelated(d) ? HIGHLIGHT_LABEL_FILL : nodeLabelFill,
    );

    onPanelUpdate({
      title: hoveredNode.label,
      subtitle: `${formatNodeValue(hoveredNode.value)}円・全体の${formatNodePercent(
        hoveredNode.value,
        totalValueBySide[hoveredSide],
      )}`,
    });
  };

  showDefaultPanel();

  let activeHoverId: string | null = null;
  let pointerInsideChart = false;
  let latestClientX = 0;
  let latestClientY = 0;
  let hoverFrameId: number | null = null;

  const clearHover = () => {
    activeHoverId = null;
    resetHighlight();
  };

  const applyHoverTarget = (node: LayoutNode | null) => {
    if (!node) {
      if (activeHoverId !== null) {
        clearHover();
      }
      return;
    }

    if (activeHoverId === node.id) {
      return;
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

  const syncHoverFromLatestPointer = () => {
    hoverFrameId = null;

    if (!pointerInsideChart || !isPointerOverSvg()) {
      if (!isPointerOverSvg()) {
        pointerInsideChart = false;
      }

      if (activeHoverId !== null) {
        clearHover();
      }
      return;
    }

    applyHoverTarget(
      resolveHoverFromClientPoint(
        latestClientX,
        latestClientY,
        svgElement,
        graph.nodes,
        getNodeLabelPadding,
      ),
    );
  };

  const scheduleHoverSync = (event: PointerEvent) => {
    latestClientX = event.clientX;
    latestClientY = event.clientY;

    if (hoverFrameId !== null) {
      return;
    }

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

    clearHover();
  };

  svgElement.addEventListener("pointerenter", onPointerEnter);
  svgElement.addEventListener("pointerleave", onPointerLeave);
  svgElement.addEventListener("pointermove", scheduleHoverSync);
  svgElement.addEventListener("pointercancel", onPointerLeave);
  const onWindowPointerMove = (event: PointerEvent) => {
    if (!pointerInsideChart) return;
    scheduleHoverSync(event);
  };

  window.addEventListener("pointermove", onWindowPointerMove);

  return () => {
    window.removeEventListener("pointermove", onWindowPointerMove);
    svgElement.removeEventListener("pointerenter", onPointerEnter);
    svgElement.removeEventListener("pointerleave", onPointerLeave);
    svgElement.removeEventListener("pointermove", scheduleHoverSync);
    svgElement.removeEventListener("pointercancel", onPointerLeave);
    onPointerLeave();
  };
}
