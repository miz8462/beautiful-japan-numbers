import type { NodeType } from "./types";

export const CHART_WIDTH = 800;
export const CHART_HEIGHT = 400;
export const SVG_WIDTH = 1120;
export const SVG_HEIGHT = 500;

export const HIGHLIGHT_COLOR = "#facc15";
export const PARENT_HIGHLIGHT_COLOR = "#fde68a";

export const TOTAL_NODE_WIDTH = 60;
export const SPENDING_SHIFT_LEFT = 200;

export const TOTAL_NODE_LABEL_PADDING = 4;
export const ITEM_NODE_LABEL_PADDING = 20;

export const NODE_COLUMNS: Record<NodeType, number> = {
  revenue_item: 0,
  revenue_total: 1,
  spending_total: 2,
  spending_item: 3,
};
