import { Colors, type ColorMode } from "@/styles/colors";
import * as d3 from "d3";
import {
  INFO_PANEL_HEIGHT,
  INFO_PANEL_RIGHT,
  INFO_PANEL_TOP,
  INFO_PANEL_WIDTH,
  SVG_WIDTH,
} from "./constants";

export function renderInfoPanel(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  colorMode: ColorMode,
) {
  // パネルはSVG全体の右上に固定し、参考画像のように黒背景上へ載せる。
  const panelX = SVG_WIDTH - INFO_PANEL_WIDTH - INFO_PANEL_RIGHT;
  const panelY = INFO_PANEL_TOP;

  const hoverPanel = svg.append("g")
    .attr("opacity", 1)
    .attr("pointer-events", "none");

  hoverPanel.append("rect")
    .attr("x", panelX)
    .attr("y", panelY)
    .attr("width", INFO_PANEL_WIDTH)
    .attr("height", INFO_PANEL_HEIGHT)
    .attr("rx", 8)
    .attr("fill", Colors.grey[600])
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
