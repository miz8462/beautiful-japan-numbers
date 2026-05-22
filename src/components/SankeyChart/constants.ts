import type { NodeType } from "./types";

// SVG全体は右側の詳細パネル分だけチャート本体より広く取る。
export const CHART_WIDTH = 1200;
export const CHART_HEIGHT = 400;
export const CHART_TOP = 128;
export const SVG_WIDTH = 1520;
export const SVG_HEIGHT = 560;
export const CHART_BACKGROUND_COLOR = "#1b1b1b";

export const INFO_PANEL_WIDTH = 420;
export const INFO_PANEL_HEIGHT = 76;
export const INFO_PANEL_TOP = 16;
export const INFO_PANEL_RIGHT = 16;

// ホバー時は「選択中」と「選択中の親」を色の濃淡で分ける。
export const HIGHLIGHT_COLOR = "#facc15";
export const PARENT_HIGHLIGHT_COLOR = "#fde68a";
// 黄色ハイライト上でも読めるラベル色
export const HIGHLIGHT_LABEL_FILL = "#171717";

// d3-sankeyの自動配置後、見た目に合わせて中央付近だけ手動補正する。
// 歳入・歳出の金額＋項目名が収まる幅（layout.ts で総額ノード幅を上書き）
export const TOTAL_NODE_WIDTH = 72;
export const SPENDING_SHIFT_LEFT = 160;

export const TOTAL_NODE_LABEL_PADDING = 4;
export const ITEM_NODE_LABEL_PADDING = 20;

// ノードtypeごとに左から何列目へ置くかを固定する。
export const NODE_COLUMNS: Record<NodeType, number> = {
  revenue_detail: 0,
  revenue_item: 1,
  revenue_total: 2,
  spending_total: 3,
  spending_item: 4,
  spending_detail: 5,
};
