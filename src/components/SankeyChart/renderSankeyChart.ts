import {
  Colors,
  getGovernmentSpendingChartColors,
  type ColorMode,
} from "@/styles/colors";
import * as d3 from "d3";
import { sankeyLinkHorizontal } from "d3-sankey";
import {
  HIGHLIGHT_COLOR,
  ITEM_NODE_LABEL_PADDING,
  PARENT_HIGHLIGHT_COLOR,
  TOTAL_NODE_LABEL_PADDING,
} from "./constants";
import { formatNodePercent, formatNodeValue } from "./formatters";
import {
  getAncestorSegmentData,
  getConnectedItems,
  getEndpointType,
  getNodeSide,
  isCentralLink,
} from "./graphHelpers";
import { renderInfoPanel } from "./infoPanel";
import { renderNodeLabel } from "./labels";
import { createGovernmentSpendingLayout, getTotalValueBySide } from "./layout";
import type {
  GovernmentSpendingData,
  LayoutLink,
  LayoutNode,
  NodeType,
  SegmentDatum,
} from "./types";

export function renderSankeyChart(
  svgElement: SVGSVGElement,
  data: GovernmentSpendingData,
  colorMode: ColorMode,
) {
  const colors = getGovernmentSpendingChartColors(colorMode);
  const nodeFillColors: Record<NodeType, string> = {
    revenue_item: colors.revenue.item,
    revenue_total: colors.revenue.total,
    spending_total: colors.spending.total,
    spending_item: colors.spending.item,
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

  const graph = createGovernmentSpendingLayout(data);
  const totalValueBySide = getTotalValueBySide(graph.nodes);

  const linkSelection = svg.append("g")
    .selectAll("path")
    .data(graph.links)
    .join("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", getDefaultLinkStroke)
    .attr("stroke-width", (d: LayoutLink) => Math.max(1, d.width ?? 0))
    .attr("fill", "none")
    .attr("opacity", getDefaultLinkOpacity);

  const nodeSelection = svg.append("g")
    .selectAll("rect")
    .data(graph.nodes)
    .join("rect")
    .attr("x", (d: LayoutNode) => d.x0 ?? 0)
    .attr("y", (d: LayoutNode) => d.y0 ?? 0)
    .attr("height", (d: LayoutNode) => (d.y1 ?? 0) - (d.y0 ?? 0))
    .attr("width", (d: LayoutNode) => (d.x1 ?? 0) - (d.x0 ?? 0))
    .attr("fill", (d: LayoutNode) => getNodeFill(d.type))
    .attr("cursor", "pointer");

  const segmentLayer = svg.append("g")
    .attr("pointer-events", "none");

  const labelSelection = svg.append("g")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .attr("x", (d: LayoutNode) => (d.x0 ?? 0) + getNodeLabelPadding(d.type))
    .attr("y", (d: LayoutNode) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "middle")
    .attr("fill", nodeLabelFill)
    .attr("font-weight", 700)
    .attr("pointer-events", "none")
    .each(function (d: LayoutNode) {
      if (!(this instanceof SVGTextElement)) return;

      renderNodeLabel(d3.select<SVGTextElement, LayoutNode>(this), d, getNodeLabelPadding(d.type));
    });

  const { panelLabel, panelValue } = renderInfoPanel(svg, colorMode);

  const showDefaultPanel = () => {
    panelLabel.text("詳細");
    panelValue.text("ノードにカーソルを合わせてください");
  };

  const resetHighlight = () => {
    segmentLayer.selectAll("rect").remove();

    nodeSelection
      .attr("fill", (d: LayoutNode) => getNodeFill(d.type))
      .attr("opacity", 1);

    linkSelection
      .attr("stroke", getDefaultLinkStroke)
      .attr("opacity", getDefaultLinkOpacity);

    labelSelection.attr("fill", nodeLabelFill);
    showDefaultPanel();
  };

  const showHighlight = (hoveredNode: LayoutNode) => {
    const { ancestorSegmentLinks, brightNodes, connectedLinks, connectedNodes } =
      getConnectedItems(hoveredNode);
    const hoveredSide = getNodeSide(hoveredNode);
    const segmentData = getAncestorSegmentData(ancestorSegmentLinks, hoveredSide);

    nodeSelection
      .attr("fill", (d: LayoutNode) => {
        if (brightNodes.has(d)) {
          return HIGHLIGHT_COLOR;
        }
        if (connectedNodes.has(d)) {
          return PARENT_HIGHLIGHT_COLOR;
        }
        return getNodeFill(d.type);
      })
      .attr("opacity", 1);

    linkSelection
      .attr("stroke", (d: LayoutLink) =>
        connectedLinks.has(d) ? HIGHLIGHT_COLOR : getDefaultLinkStroke(d),
      )
      .attr("opacity", (d: LayoutLink) => {
        return connectedLinks.has(d) ? 0.95 : getDefaultLinkOpacity(d);
      });

    segmentLayer
      .selectAll<SVGRectElement, SegmentDatum>("rect")
      .data(segmentData, (d) => d.key)
      .join("rect")
      .attr("x", (d) => d.node.x0 ?? 0)
      .attr("y", (d) => d.y)
      .attr("height", (d) => d.height)
      .attr("width", (d) => ((d.node.x1 ?? 0) - (d.node.x0 ?? 0)))
      .attr("fill", HIGHLIGHT_COLOR);

    labelSelection
      .attr("fill", (d: LayoutNode) =>
        connectedNodes.has(d) ? Colors.grey[900] : nodeLabelFill,
      );

    panelLabel.text(hoveredNode.label);
    panelValue.text(
      `${formatNodeValue(hoveredNode.value)}・全体の${formatNodePercent(
        hoveredNode.value,
        totalValueBySide[hoveredSide],
      )}`,
    );
  };

  showDefaultPanel();

  nodeSelection
    .on("mouseenter", (_event: MouseEvent, hoveredNode: LayoutNode) => {
      showHighlight(hoveredNode);
    })
    .on("mouseleave", resetHighlight);
}
