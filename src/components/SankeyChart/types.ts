import type { SankeyLink, SankeyNode } from "d3-sankey";

export type NodeType =
  | "revenue_item"
  | "revenue_total"
  | "spending_total"
  | "spending_item";

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

export type LayoutNode = SankeyNode<GovernmentSpendingNode, GovernmentSpendingLink>;
export type LayoutLink = SankeyLink<GovernmentSpendingNode, GovernmentSpendingLink>;
export type NodeSide = "revenue" | "spending";

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
