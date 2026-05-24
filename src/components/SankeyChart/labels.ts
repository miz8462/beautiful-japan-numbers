import * as d3 from "d3";
import { formatNodeValue } from "./formatters";
import type { LayoutNode, NodeType } from "./types";

const TOTAL_NODE_TYPES: NodeType[] = ["revenue_total", "spending_total"];
const NARROW_NODE_MAX_WIDTH = 52;
const LABEL_HIT_EXTENSION = 220;

export type TextMeasurer = {
  fitsWidth: (
    content: string,
    maxWidth: number,
    fontSize: number,
    fontWeight?: number | string,
  ) => boolean;
};

export function getLabelHitExtension(type: NodeType): number {
  return TOTAL_NODE_TYPES.includes(type) ? 0 : LABEL_HIT_EXTENSION;
}

export function createTextMeasurer(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
): TextMeasurer {
  const measureText = svg
    .append("text")
    .attr("visibility", "hidden")
    .attr("aria-hidden", "true")
    .attr("pointer-events", "none");

  const measureWidth = (
    content: string,
    fontSize: number,
    fontWeight: number | string = 700,
  ) => {
    const node = measureText
      .attr("font-size", fontSize)
      .attr("font-weight", fontWeight)
      .text(content)
      .node();
    return node instanceof SVGTextElement ? node.getComputedTextLength() : 0;
  };

  return {
    fitsWidth: (content, maxWidth, fontSize, fontWeight = 700) =>
      measureWidth(content, fontSize, fontWeight) <= maxWidth,
  };
}

function truncateToWidth(
  selection: d3.Selection<SVGTextElement | SVGTSpanElement, LayoutNode, null, undefined>,
  textValue: string,
  maxWidth: number,
) {
  let label = textValue;
  selection.text(label);

  while (selection.node()!.getComputedTextLength() > maxWidth && label.length > 0) {
    label = label.slice(0, -1);
    selection.text(label + "…");
  }
}

function renderTotalNodeLabel(
  text: d3.Selection<SVGTextElement, LayoutNode, null, undefined>,
  node: LayoutNode,
  valueText: string,
) {
  const centerX = ((node.x0 ?? 0) + (node.x1 ?? 0)) / 2;
  const centerY = ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2;

  text
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", centerX)
    .attr("y", centerY)
    .text(null)
    .selectAll("tspan")
    .remove();

  text
    .append("tspan")
    .attr("x", centerX)
    .attr("dy", "-0.6em")
    .attr("font-size", 16)
    .attr("font-weight", 700)
    .text(valueText);

  text
    .append("tspan")
    .attr("x", centerX)
    .attr("dy", "1.15em")
    .attr("font-size", 14)
    .attr("font-weight", 500)
    .text(node.label);
}

function renderTwoLineLabel(
  text: d3.Selection<SVGTextElement, LayoutNode, null, undefined>,
  node: LayoutNode,
  labelX: number,
  maxWidth: number,
  valueText: string,
) {
  const centerY = ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2;

  text
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "central")
    .attr("x", labelX)
    .attr("y", centerY)
    .text(null)
    .selectAll("tspan")
    .remove();

  text
    .append("tspan")
    .attr("x", labelX)
    .attr("dy", "-0.55em")
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .text(valueText);

  const labelTspan = text
    .append("tspan")
    .attr("x", labelX)
    .attr("dy", "1.1em")
    .attr("font-size", 14)
    .attr("font-weight", 500)
    .text(node.label);

  truncateToWidth(labelTspan, node.label, maxWidth);
}

export function renderNodeLabel(
  text: d3.Selection<SVGTextElement, LayoutNode, null, undefined>,
  node: LayoutNode,
  labelPadding: number,
  measurer: TextMeasurer,
) {
  const textNode = text.node();
  if (!(textNode instanceof SVGTextElement)) return;

  const nodeWidth = (node.x1 ?? 0) - (node.x0 ?? 0);
  const nodeHeight = (node.y1 ?? 0) - (node.y0 ?? 0);
  const labelX = (node.x0 ?? 0) + labelPadding;
  const maxWidth = Math.max(0, nodeWidth - labelPadding * 2);
  const valueText = formatNodeValue(node.value);

  text.text(null);
  text.selectAll("tspan").remove();

  if (TOTAL_NODE_TYPES.includes(node.type)) {
    renderTotalNodeLabel(text, node, valueText);
    return;
  }

  const valueFits = measurer.fitsWidth(valueText, maxWidth, 20);
  const labelFits = measurer.fitsWidth(node.label, maxWidth, 14, 500);
  const preferLabelOnly =
    maxWidth < NARROW_NODE_MAX_WIDTH && valueFits && !labelFits;

  if (nodeHeight < 30) {
    text
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .attr("x", labelX)
      .attr("y", ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2)
      .attr("font-size", 14)
      .attr("font-weight", 700);

    // Special case for nodes that should always show value only
    if (node.id === "misc_revenue" || node.id === "reserve_fund") {
      console.log("Special case triggered for node:", node.id, node.label);
      truncateToWidth(text, valueText, maxWidth);
      return;
    }

    if (preferLabelOnly || labelFits) {
      truncateToWidth(text, node.label, maxWidth);
      return;
    }

    truncateToWidth(text, valueText, maxWidth);
    return;
  }

  if (preferLabelOnly) {
    text
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .attr("x", labelX)
      .attr("y", ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2)
      .attr("font-size", 14)
      .attr("font-weight", 500);
    truncateToWidth(text, node.label, maxWidth);
    return;
  }

  // Special case for nodes that should always show value only due to narrow space
  if (node.id === "misc_revenue" || node.id === "reserve_fund") {
    text
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .attr("x", labelX)
      .attr("y", ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2)
      .attr("font-size", 14)
      .attr("font-weight", 700);
    truncateToWidth(text, valueText, maxWidth);
    return;
  }

  renderTwoLineLabel(text, node, labelX, maxWidth, valueText);
}
