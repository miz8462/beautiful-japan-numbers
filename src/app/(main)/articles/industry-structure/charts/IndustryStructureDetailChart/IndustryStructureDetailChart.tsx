"use client";

import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
;import { useMediaQuery } from "@/hooks/use-media-query";
import detailData from "@/data/industry-structure-detail.json";
import industryLabels from "@/data/industry-structure-labels.json";
import styles from "./IndustryStructureDetailChart.module.css";

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_INCREASE = "var(--color-brand)";
const COLOR_DECREASE = "var(--color-accent)";
const COLOR_BASE = "#cccccc";       // 1994年基準点

export function IndustryStructureDetailChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // サイズの監視
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width || 600);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 1994年と2023年のデータを抽出
  const data1994 = detailData.find((d) => d.year === 1994);
  const data2023 = detailData.find((d) => d.year === 2023);

  if (!data1994 || !data2023) return null;

  // 16業種のデータ配列を作成
  const rows = Object.entries(industryLabels).map(([key, label]) => {
    const val1994 = data1994[`${key}_pct` as keyof typeof data1994] as number;
    const val2023 = data2023[`${key}_pct` as keyof typeof data2023] as number;
    const diff = val2023 - val1994;
    return {
      key,
      label,
      val1994,
      val2023,
      diff,
    };
  });

  // 2023年の構成比が大きい順にソート
  const sortedRows = [...rows].sort((a, b) => b.val2023 - a.val2023);

  // マージンと描画サイズの設定
  const margin = {
    top: 10,
    right: isMobile ? 120 : 180,
    left: isMobile ? 110 : 170,
    bottom: 20,
  };

  const chartWidth = width - margin.left - margin.right;
  const rowHeight = 26;
  const chartHeight = sortedRows.length * rowHeight;
  const svgHeight = chartHeight + margin.top + margin.bottom;

  // 最大構成比に基づきスケールを設定（製造業が約20%〜23%で最大のため、上限を25%に設定）
  const maxVal = 25;
  const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, chartWidth]);

  return (
    <div className={styles.wrapper} ref={containerRef}>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: COLOR_BASE }} />
          <span>1994年（基準点）</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: COLOR_INCREASE }} />
          <span>増加した業種（2023年）</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: COLOR_DECREASE }} />
          <span>減少した業種（2023年）</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <svg width={width} height={svgHeight} style={{ overflow: "visible" }}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* グリッド線の描画（5%ごと） */}
            {[0, 5, 10, 15, 20, 25].map((val) => (
              <g key={val} transform={`translate(${xScale(val)}, 0)`}>
                <line
                  y1={0}
                  y2={chartHeight}
                  stroke="#e8e8e8"
                  strokeWidth={1}
                />
                <text
                  y={chartHeight + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#888888"
                  fontFamily='"Roboto Mono", monospace'
                >
                  {val}%
                </text>
              </g>
            ))}

            {/* 各業種の行を描画 */}
            {sortedRows.map((row, i) => {
              const y = i * rowHeight + rowHeight / 2;
              const x1994 = xScale(row.val1994);
              const x2023 = xScale(row.val2023);
              const isIncrease = row.diff >= 0;
              const color = isIncrease ? COLOR_INCREASE : COLOR_DECREASE;

              return (
                <g key={row.key}>
                  {/* 背景の薄い横線 */}
                  <line
                    x1={0}
                    x2={chartWidth}
                    y1={y}
                    y2={y}
                    stroke="#f5f5f5"
                    strokeWidth={1}
                  />

                  {/* 業種ラベル（左側） */}
                  <text
                    x={-10}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={isMobile ? 10 : 11}
                    fontWeight={500}
                    fill="#333333"
                  >
                    {isMobile && row.label.length > 10
                      ? `${row.label.slice(0, 9)}…`
                      : row.label}
                  </text>

                  {/* 変化を示す線（ダンベルの柄） */}
                  <line
                    x1={x1994}
                    x2={x2023}
                    y1={y}
                    y2={y}
                    stroke={color}
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={0.8}
                  />

                  {/* 1994年のドット */}
                  <circle cx={x1994} cy={y} r={4.5} fill={COLOR_BASE} />

                  {/* 2023年のドット */}
                  <circle cx={x2023} cy={y} r={5} fill={color} />

                  {/* 数値と差分のテキスト（右側） */}
                  <text
                    x={chartWidth + 10}
                    y={y}
                    dominantBaseline="middle"
                    fontSize={11}
                    fill="#4a4a4a"
                  >
                    <tspan fontFamily='"Roboto Mono", monospace'>
                      {row.val1994.toFixed(1)}% → {row.val2023.toFixed(1)}%
                    </tspan>
                    <tspan
                      dx={6}
                      fontWeight={600}
                      fill={color}
                      fontFamily='"Roboto Mono", monospace'
                    >
                      {isIncrease ? "+" : ""}
                      {row.diff.toFixed(1)} pt
                    </tspan>
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
