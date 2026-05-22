import type { SankeyLink, SankeyNode } from "d3-sankey";

// typeは配置列と配色の両方に使うため、文字列をここで固定する。
export type NodeType =
  | "revenue_detail"
  | "revenue_item"
  | "revenue_total"
  | "spending_total"
  | "spending_item"
  | "spending_detail";

export type GovernmentSpendingNode = {
  [key: string]: string;
  id: string;
  label: string;
  type: NodeType;
};

export type GovernmentSpendingLink = {
  [key: string]: number | string;
  source: string;
  target: string;
  value: number;
};

export type GovernmentSpendingData = {
  nodes: GovernmentSpendingNode[];
  links: GovernmentSpendingLink[];
};

// d3-sankeyのレイアウト後はsource/targetが文字列からノード参照に変わる。
export type LayoutNode = SankeyNode<GovernmentSpendingNode, GovernmentSpendingLink>;
export type LayoutLink = SankeyLink<GovernmentSpendingNode, GovernmentSpendingLink>;
export type NodeSide = "revenue" | "spending";

// ホバー中に黄色へ変える対象を、用途別に分けて返す。
export type ConnectedItems = {
  ancestorSegmentLinks: Set<LayoutLink>;
  brightNodes: Set<LayoutNode>;
  connectedLinks: Set<LayoutLink>;
  connectedNodes: Set<LayoutNode>;
};

export type SegmentDatum = {
  height: number;
  key: string;
  node: LayoutNode;
  y: number;
};
