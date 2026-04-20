import { sankey } from "d3-sankey";
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  NODE_COLUMNS,
  SPENDING_SHIFT_LEFT,
  TOTAL_NODE_WIDTH,
} from "./constants";
import type { GovernmentSpendingData, GovernmentSpendingLink, GovernmentSpendingNode, LayoutNode, NodeSide } from "./types";

export function createGovernmentSpendingLayout(data: GovernmentSpendingData) {
  const sankeyGenerator = sankey<
    GovernmentSpendingData,
    GovernmentSpendingNode,
    GovernmentSpendingLink
  >()
    .nodeId((d) => d.id)
    .nodeWidth(100)
    .nodePadding(10)
    .nodeSort(null)
    .nodeAlign((node) => NODE_COLUMNS[node.type] ?? 0)
    .extent([[1, 1], [CHART_WIDTH - 1, CHART_HEIGHT - 5]]);

  const graph = sankeyGenerator({
    nodes: data.nodes.map((d) => ({ ...d })),
    links: data.links.map((d) => ({ ...d })),
  });

  graph.nodes.forEach((node) => {
    if (node.type === "revenue_total") {
      node.x1 = (node.x0 ?? 0) + TOTAL_NODE_WIDTH;
    }
    if (node.type === "spending_total") {
      node.x0 = (node.x1 ?? 0) - TOTAL_NODE_WIDTH;
    }
    if (node.type === "spending_total" || node.type === "spending_item") {
      node.x0 = (node.x0 ?? 0) - SPENDING_SHIFT_LEFT;
      node.x1 = (node.x1 ?? 0) - SPENDING_SHIFT_LEFT;
    }
  });

  return graph;
}

export function getTotalValueBySide(nodes: LayoutNode[]): Record<NodeSide, number> {
  return {
    revenue: nodes.find((node) => node.type === "revenue_total")?.value ?? 0,
    spending: nodes.find((node) => node.type === "spending_total")?.value ?? 0,
  };
}
