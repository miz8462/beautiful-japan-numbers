import * as d3 from "d3";
import { formatNodeValue } from "./formatters";
import type { LayoutNode } from "./types";

export function renderNodeLabel(
  text: d3.Selection<SVGTextElement, LayoutNode, null, undefined>,
  node: LayoutNode,
  labelPadding: number,
) {
  const textNode = text.node();
  if (!(textNode instanceof SVGTextElement)) return;

  const nodeWidth = (node.x1 ?? 0) - (node.x0 ?? 0);
  const nodeHeight = (node.y1 ?? 0) - (node.y0 ?? 0);
  const labelX = (node.x0 ?? 0) + labelPadding;
  const maxWidth = nodeWidth - labelPadding * 2;
  const valueText = formatNodeValue(node.value);

  if (nodeHeight < 30) {
    let label = `${valueText} ${node.label}`;
    text.attr("font-size", 14).text(label);

    while (textNode.getComputedTextLength() > maxWidth && label.length > 0) {
      label = label.slice(0, -1);
      text.text(label + "…");
    }
    return;
  }

  text
    .append("tspan")
    .attr("font-size", 20)
    .attr("x", labelX)
    .attr("dy", "-0.25em")
    .text(valueText);

  let label = node.label;
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
}
