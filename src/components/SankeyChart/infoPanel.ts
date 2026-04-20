import { Colors, type ColorMode } from "@/styles/colors";
import * as d3 from "d3";
import { CHART_WIDTH } from "./constants";

export function renderInfoPanel(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  colorMode: ColorMode,
) {
  const panelWidth = 260;
  const panelHeight = 76;
  const panelX = CHART_WIDTH + 24;
  const panelY = 16;

  const hoverPanel = svg.append("g")
    .attr("opacity", 1)
    .attr("pointer-events", "none");

  hoverPanel.append("rect")
    .attr("x", panelX)
    .attr("y", panelY)
    .attr("width", panelWidth)
    .attr("height", panelHeight)
    .attr("rx", 8)
    .attr("fill", colorMode === "dark" ? Colors.grey[800] : Colors.grey[900])
    .attr("opacity", 0.9);

  const panelLabel = hoverPanel.append("text")
    .attr("x", panelX + 18)
    .attr("y", panelY + 30)
    .attr("fill", Colors.grey[50])
    .attr("font-size", 16)
    .attr("font-weight", 700);

  const panelValue = hoverPanel.append("text")
    .attr("x", panelX + 18)
    .attr("y", panelY + 55)
    .attr("fill", Colors.grey[100])
    .attr("font-size", 14)
    .attr("font-weight", 500);

  return { panelLabel, panelValue };
}
