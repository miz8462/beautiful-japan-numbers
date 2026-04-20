import type { ConnectedItems, LayoutLink, LayoutNode, NodeSide, SegmentDatum } from "./types";

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

export function isCentralLink(link: LayoutLink): boolean {
  return (
    getEndpointType(link.source) === "revenue_total" &&
    getEndpointType(link.target) === "spending_total"
  );
}

export function getConnectedItems(hoveredNode: LayoutNode): ConnectedItems {
  const hoveredSide = getNodeSide(hoveredNode);
  const connectedNodes = new Set<LayoutNode>([hoveredNode]);
  const connectedLinks = new Set<LayoutLink>();
  const brightNodes = new Set<LayoutNode>([hoveredNode]);
  const ancestorSegmentLinks = new Set<LayoutLink>();

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
  return Array.from(ancestorSegmentLinks).flatMap((link) => {
    const parentNode =
      hoveredSide === "revenue" ? getEndpointNode(link.target) : getEndpointNode(link.source);
    if (!parentNode) return [];

    const segmentCenterY = hoveredSide === "revenue" ? link.y1 : link.y0;
    const segmentHeight = Math.max(1, link.width ?? 0);
    const parentY0 = parentNode.y0 ?? 0;
    const parentY1 = parentNode.y1 ?? 0;
    const y = Math.max(parentY0, (segmentCenterY ?? parentY0) - segmentHeight / 2);
    const height = Math.min(segmentHeight, parentY1 - y);
    if (height <= 0) return [];

    return [{
      height,
      key: `${link.index ?? ""}-${parentNode.id}`,
      node: parentNode,
      y,
    }];
  });
}
