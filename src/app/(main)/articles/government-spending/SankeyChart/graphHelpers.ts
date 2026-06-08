import type { ConnectedItems, LayoutLink, LayoutNode, NodeSide, SegmentDatum } from "./types";

// d3-sankeyのsource/targetは、レイアウト前後で文字列とノード参照が混ざる。
export function getEndpointType(endpoint: string | number | LayoutNode): string {
  if (typeof endpoint === "object" && endpoint !== null && "type" in endpoint) {
    return endpoint.type;
  }
  return "";
}

export function getEndpointNode(endpoint: string | number | LayoutNode): LayoutNode | null {
  if (typeof endpoint === "object" && endpoint !== null && "id" in endpoint) {
    return endpoint;
  }
  return null;
}

export function getNodeSide(node: LayoutNode): NodeSide {
  return node.type.startsWith("revenue") ? "revenue" : "spending";
}

// 収入と支出は視覚上つながっているが、ホバー探索では完全に切り離す。
export function isCentralLink(link: LayoutLink): boolean {
  return (
    getEndpointType(link.source) === "revenue_total" &&
    getEndpointType(link.target) === "spending_total"
  );
}

function getNodeDepth(type: string): number {
  if (type.endsWith("_detail")) return 0;
  if (type.endsWith("_item")) return 1;
  return 2;
}

// リンクホバー時は、階層の深い方（detail/item）を起点にハイライトする。
export function getLinkHoverNode(link: LayoutLink): LayoutNode | null {
  const sourceNode = getEndpointNode(link.source);
  const targetNode = getEndpointNode(link.target);

  if (!sourceNode || !targetNode || isCentralLink(link)) {
    return null;
  }

  return getNodeDepth(sourceNode.type) < getNodeDepth(targetNode.type)
    ? sourceNode
    : targetNode;
}

export function getConnectedItems(hoveredNode: LayoutNode): ConnectedItems {
  const hoveredSide = getNodeSide(hoveredNode);
  const connectedNodes = new Set<LayoutNode>([hoveredNode]);
  const connectedLinks = new Set<LayoutLink>();
  const brightNodes = new Set<LayoutNode>([hoveredNode]);
  const ancestorSegmentLinks = new Set<LayoutLink>();

  // 収入側は「子 -> 親」、支出側は「親 -> 子」という向きでデータが流れる。
  const isSameSideLink = (link: LayoutLink) => {
    const sourceNode = getEndpointNode(link.source);
    const targetNode = getEndpointNode(link.target);

    return (
      !isCentralLink(link) &&
      sourceNode &&
      targetNode &&
      getNodeSide(sourceNode) === hoveredSide &&
      getNodeSide(targetNode) === hoveredSide
    );
  };

  const getParentLinks = (node: LayoutNode) =>
    (hoveredSide === "revenue" ? node.sourceLinks : node.targetLinks)?.filter(isSameSideLink) ?? [];

  const getChildLinks = (node: LayoutNode) =>
    (hoveredSide === "revenue" ? node.targetLinks : node.sourceLinks)?.filter(isSameSideLink) ?? [];

  const getParentNode = (link: LayoutLink) =>
    hoveredSide === "revenue" ? getEndpointNode(link.target) : getEndpointNode(link.source);

  const getChildNode = (link: LayoutLink) =>
    hoveredSide === "revenue" ? getEndpointNode(link.source) : getEndpointNode(link.target);

  // 親は薄い黄色にし、子に対応する親内の帯だけ濃い黄色で重ねる。
  const addAncestors = (node: LayoutNode) => {
    getParentLinks(node).forEach((link) => {
      connectedLinks.add(link);
      ancestorSegmentLinks.add(link);
      const parentNode = getParentNode(link);

      if (parentNode && !connectedNodes.has(parentNode)) {
        connectedNodes.add(parentNode);
        addAncestors(parentNode);
      }
    });
  };

  // 選択ノードとその子孫はすべて濃い黄色にする。
  const addDescendants = (node: LayoutNode) => {
    getChildLinks(node).forEach((link) => {
      connectedLinks.add(link);
      const childNode = getChildNode(link);

      if (childNode && !connectedNodes.has(childNode)) {
        connectedNodes.add(childNode);
        brightNodes.add(childNode);
        addDescendants(childNode);
      }
    });
  };

  addAncestors(hoveredNode);
  addDescendants(hoveredNode);

  return { ancestorSegmentLinks, brightNodes, connectedLinks, connectedNodes };
}

export function getAncestorSegmentData(
  ancestorSegmentLinks: Set<LayoutLink>,
  hoveredSide: NodeSide,
): SegmentDatum[] {
  // 親ノード上に重ねる濃い黄色の帯を、リンク端の y0/y1 と width から作る。
  return Array.from(ancestorSegmentLinks).flatMap((link) => {
    const parentNode =
      hoveredSide === "revenue" ? getEndpointNode(link.target) : getEndpointNode(link.source);
    if (!parentNode) return [];

    const linkCenterY = hoveredSide === "revenue" ? link.y1 : link.y0;
    const halfWidth = Math.max(0.5, (link.width ?? 0) / 2);
    const parentY0 = parentNode.y0 ?? 0;
    const parentY1 = parentNode.y1 ?? 0;

    const segmentTop = (linkCenterY ?? parentY0) - halfWidth;
    const segmentBottom = (linkCenterY ?? parentY0) + halfWidth;
    const y = Math.max(parentY0, segmentTop);
    const bottom = Math.min(parentY1, segmentBottom);
    const height = bottom - y;

    if (height <= 0) return [];

    return [{
      height,
      key: `${link.index ?? ""}-${parentNode.id}`,
      node: parentNode,
      y,
    }];
  });
}
