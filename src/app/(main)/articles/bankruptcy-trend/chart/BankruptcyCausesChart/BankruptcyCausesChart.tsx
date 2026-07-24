"use client";

import { useRef, useState, useEffect } from "react";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import bankruptcyCauses from "@/data/bankruptcy-causes.json";
import styles from "./BankruptcyCausesChart.module.css";

// ─── 型定義 ──────────────────────────────────────────────────────
type CausesRow = {
  year: number;
  total: number;
  jobApplicantShortage: number | null;
  employeeTurnover: number | null;
  laborCostIncrease: number | null;
};

type TooltipData = {
  year: number;
  total: number;
  jobApplicantShortage: number | null;
  employeeTurnover: number | null;
  laborCostIncrease: number | null;
  x: number;
  y: number;
};

// ─── 定数 ────────────────────────────────────────────────────────
// 3系列の構成比の配色ルール（DESIGN.md §1）
// 求人難=--color-brand-third、従業員退職=--color-brand、人件費高騰=--color-brand-dark
const COLOR_JOB_APPLICANT = "color-mix(in srgb, var(--color-brand) 40%, white)"; // 求人難（最も薄い）
const COLOR_EMPLOYEE_TURN = "var(--color-brand)";          // 従業員退職
const COLOR_LABOR_COST = "var(--color-brand-dark)";     // 人件費高騰
const COLOR_UNKNOWN = "var(--color-text-muted)";     // 内訳非公表（グレー）

const data = bankruptcyCauses as CausesRow[];

// ─── スケール計算 ─────────────────────────────────────────────────
const MAX_Y = 420; // 最大値を少し余裕をもたせる

// ─── 最終年のみ: セグメント内インラインラベル（複数行対応）─────────
const SEGMENT_LABELS = {
  jobApplicantShortage: { lines: ["求人難"], textColor: "var(--color-text-primary)" },
  employeeTurnover: { lines: ["従業員", "退職"], textColor: "#ffffff" },
  laborCostIncrease: { lines: ["人件費", "高騰"], textColor: "#ffffff" },
} as const;

const MIN_LABEL_SEGMENT_HEIGHT = 22;

function SegmentLabel({
  cx,
  cy,
  lines,
  fill,
  fontSize,
}: {
  cx: number;
  cy: number;
  lines: readonly string[];
  fill: string;
  fontSize: number;
}) {
  // 複数行は中央基準で上下に配置（1行ならdy=0）
  const lineHeight = fontSize * 1.2;
  const startOffset = -((lines.length - 1) * lineHeight) / 2;

  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      fontSize={fontSize}
      fill={fill}
      fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
      fontWeight={400}
    >
      {lines.map((line, i) => (
        <tspan
          key={i}
          x={cx}
          dy={i === 0 ? startOffset + fontSize * 0.35 : lineHeight}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────
export function BankruptcyCausesChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(480);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // ResizeObserver でコンテナ幅を監視
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width || 480);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const chartHeight = isMobile ? 260 : 320;
  const margin = { top: 16, right: 16, bottom: 40, left: isMobile ? 36 : 46 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const years = data.map((d) => d.year);
  const barCount = years.length;
  const totalBarWidth = innerWidth / barCount;
  const barWidth = Math.max(totalBarWidth * 0.6, 12);

  // Y スケール（0起点）
  const yScale = (v: number) => innerHeight - (v / MAX_Y) * innerHeight;
  const yTicks = [0, 100, 200, 300, 400];

  const handleBarHover = (
    e: React.MouseEvent<SVGRectElement>,
    row: CausesRow,
    barX: number
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      ...row,
      x: barX + margin.left + barWidth / 2,
      y: yScale(row.total) + margin.top,
    });
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <span className={styles.unitNote}>単位：件</span>

      <ArticleChartCanvas height={isMobile ? 300 : 360} mobileHeight={300}>
        <div className={styles.svgContainer}>
          <svg
            width={width}
            height={chartHeight}
            onMouseLeave={() => setTooltip(null)}
            style={{ overflow: "visible" }}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>

              {/* Y軸グリッド */}
              {yTicks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={0}
                    x2={innerWidth}
                    y1={yScale(tick)}
                    y2={yScale(tick)}
                    stroke="var(--color-border)"
                    strokeWidth={1}
                  />
                  <text
                    x={-8}
                    y={yScale(tick) + 4}
                    textAnchor="end"
                    fontSize={isMobile ? 9 : 16}
                    fill="var(--color-text-muted)"
                    fontFamily='"Roboto Mono", "SFMono-Regular", Consolas, monospace'
                    className={styles.numericText}
                  >
                    {tick}
                  </text>
                </g>
              ))}

              {/* バー */}
              {data.map((row, i) => {
                const cx = (i + 0.5) * totalBarWidth;
                const barX = cx - barWidth / 2;
                const hasBreakdown =
                  row.jobApplicantShortage !== null &&
                  row.employeeTurnover !== null &&
                  row.laborCostIncrease !== null;

                // 積み上げ計算（下から: 求人難→従業員退職→人件費高騰）
                const job = row.jobApplicantShortage ?? 0;
                const turn = row.employeeTurnover ?? 0;
                const labor = row.laborCostIncrease ?? 0;

                const y0_job = yScale(job);
                const y0_turn = yScale(job + turn);
                const y0_labor = yScale(job + turn + labor);
                const barBottom = yScale(0);

                // ホバー可能領域（バー全体）
                const hitAreaY = yScale(row.total);
                const hitAreaH = barBottom - hitAreaY;

                return (
                  <g key={row.year}>
                    {hasBreakdown ? (
                      <>
                        {/* 求人難 */}
                        <rect x={barX} y={y0_job} width={barWidth} height={barBottom - y0_job} fill={COLOR_JOB_APPLICANT} />
                        {/* 従業員退職 */}
                        <rect x={barX} y={y0_turn} width={barWidth} height={y0_job - y0_turn} fill={COLOR_EMPLOYEE_TURN} />
                        {/* 人件費高騰 */}
                        <rect x={barX} y={y0_labor} width={barWidth} height={y0_turn - y0_labor} fill={COLOR_LABOR_COST} />

                        {/* 最終年のみ: セグメント内ラベル */}
                        {i === data.length - 1 && (
                          <>
                            {(barBottom - y0_job) >= MIN_LABEL_SEGMENT_HEIGHT && (
                              <SegmentLabel
                                cx={cx}
                                cy={(barBottom + y0_job) / 2}
                                lines={SEGMENT_LABELS.jobApplicantShortage.lines}
                                fill={SEGMENT_LABELS.jobApplicantShortage.textColor}
                                fontSize={isMobile ? 11 : 13}
                              />
                            )}
                            {(y0_job - y0_turn) >= MIN_LABEL_SEGMENT_HEIGHT && (
                              <SegmentLabel
                                cx={cx}
                                cy={(y0_job + y0_turn) / 2}
                                lines={SEGMENT_LABELS.employeeTurnover.lines}
                                fill={SEGMENT_LABELS.employeeTurnover.textColor}
                                fontSize={isMobile ? 11 : 13}
                              />
                            )}
                            {(y0_turn - y0_labor) >= MIN_LABEL_SEGMENT_HEIGHT && (
                              <SegmentLabel
                                cx={cx}
                                cy={(y0_turn + y0_labor) / 2}
                                lines={SEGMENT_LABELS.laborCostIncrease.lines}
                                fill={SEGMENT_LABELS.laborCostIncrease.textColor}
                                fontSize={isMobile ? 11 : 13}
                              />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      /* 内訳非公表: グレー単色バー */
                      <rect
                        x={barX}
                        y={yScale(row.total)}
                        width={barWidth}
                        height={barBottom - yScale(row.total)}
                        fill={COLOR_UNKNOWN}
                      />
                    )}

                    {/* ホバー用透明な当たり判定エリア */}
                    <rect
                      x={barX - 4}
                      y={hitAreaY}
                      width={barWidth + 8}
                      height={hitAreaH}
                      fill="transparent"
                      onMouseEnter={(e) => handleBarHover(e, row, barX)}
                      onMouseMove={(e) => handleBarHover(e, row, barX)}
                      style={{ cursor: "default" }}
                    />

                    {/* X軸ラベル */}
                    <text
                      x={cx}
                      y={innerHeight + (isMobile ? 14 : 18)}
                      textAnchor="middle"
                      fontSize={isMobile ? 9 : 16}
                      fill="var(--color-text-muted)"
                      fontFamily='"Roboto Mono", "SFMono-Regular", Consolas, monospace'
                      className={styles.numericText}
                    >
                      {row.year}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* ツールチップ */}
          {tooltip && (
            <div
              className={styles.tooltip}
              style={{
                left: tooltip.x,
                top: tooltip.y,
              }}
            >
              <span className={styles.tooltipYear}>{tooltip.year}年</span>
              <div className={styles.tooltipRows}>
                {tooltip.jobApplicantShortage !== null ? (
                  <>
                    <div className={styles.tooltipRow}>
                      <div className={styles.tooltipLabelGroup}>
                        <span className={styles.tooltipDot} style={{ background: COLOR_LABOR_COST }} />
                        <span>人件費高騰</span>
                      </div>
                      <span className={styles.tooltipValue}>
                        {tooltip.laborCostIncrease}件
                      </span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <div className={styles.tooltipLabelGroup}>
                        <span className={styles.tooltipDot} style={{ background: COLOR_EMPLOYEE_TURN }} />
                        <span>従業員退職</span>
                      </div>
                      <span className={styles.tooltipValue}>
                        {tooltip.employeeTurnover}件
                      </span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <div className={styles.tooltipLabelGroup}>
                        <span className={styles.tooltipDot} style={{ background: COLOR_JOB_APPLICANT }} />
                        <span>求人難</span>
                      </div>
                      <span className={styles.tooltipValue}>
                        {tooltip.jobApplicantShortage}件
                      </span>
                    </div>
                    <div className={styles.tooltipTotal}>
                      合計: {tooltip.total}件
                    </div>
                  </>
                ) : (
                  <div className={styles.tooltipRow}>
                    <div className={styles.tooltipLabelGroup}>
                      <span className={styles.tooltipDot} style={{ background: COLOR_UNKNOWN }} />
                      <span>合計（内訳非公表）</span>
                    </div>
                    <span className={styles.tooltipValue}>{tooltip.total}件</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ArticleChartCanvas>
    </div>
  );
}
