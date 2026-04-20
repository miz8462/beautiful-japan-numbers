"use client";

import { type ColorMode } from "@/styles/colors";
import { useEffect, useRef, useState } from "react";
import { SVG_HEIGHT, SVG_WIDTH } from "./constants";
import { renderSankeyChart } from "./renderSankeyChart";
import type { GovernmentSpendingData } from "./types";

export default function SankeyChart({ data }: { data: GovernmentSpendingData }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateColorMode = () => {
      setColorMode(mediaQuery.matches ? "dark" : "light");
    };

    updateColorMode();
    mediaQuery.addEventListener("change", updateColorMode);

    return () => {
      mediaQuery.removeEventListener("change", updateColorMode);
    };
  }, []);

  useEffect(() => {
    if (!data || !ref.current) return;

    renderSankeyChart(ref.current, data, colorMode);
  }, [data, colorMode]);

  return <svg ref={ref} width={SVG_WIDTH} height={SVG_HEIGHT} />;
}
