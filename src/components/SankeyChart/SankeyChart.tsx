"use client";

import { useEffect, useRef, useState } from "react";
import { INFO_PANEL_RIGHT, INFO_PANEL_TOP, SVG_HEIGHT, SVG_WIDTH } from "./constants";
import { renderSankeyChart } from "./renderSankeyChart";
import {
  DEFAULT_SANKEY_INFO_PANEL,
  SankeyInfoPanel,
  type SankeyInfoPanelState,
} from "./SankeyInfoPanel";
import { usePreferredColorMode } from "./usePreferredColorMode";
import type { GovernmentSpendingData } from "./types";

export default function SankeyChart({ data }: { data: GovernmentSpendingData }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const colorMode = usePreferredColorMode();
  const [panelState, setPanelState] = useState<SankeyInfoPanelState>(DEFAULT_SANKEY_INFO_PANEL);

  useEffect(() => {
    if (!data || !ref.current) return;

    const cleanup = renderSankeyChart(ref.current, data, colorMode, setPanelState);
    return cleanup;
  }, [data, colorMode]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: INFO_PANEL_TOP,
          right: INFO_PANEL_RIGHT,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <SankeyInfoPanel state={panelState} />
      </div>
      <div
        style={{
          overflowX: "auto",
          width: "100%",
        }}
      >
        <svg
          ref={ref}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          style={{ display: "block", maxWidth: "none" }}
        />
      </div>
    </>
  );
}
