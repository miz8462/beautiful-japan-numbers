"use client";

import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import { useMediaQuery } from "@/hooks/use-media-query";
import threeSectorData from "@/data/industry-structure-3sector.json";
import styles from "./IndustryStructureLongChart.module.css";

// ─── 定数定義 ────────────────────────────────────────────────────────
const COLOR_PRIMARY = "var(--color-brand-third)";
const COLOR_SECONDARY = "var(--color-brand)";
const COLOR_TERTIARY = "var(--color-brand-dark)";

const colors = {
  primary: COLOR_PRIMARY,
  secondary: COLOR_SECONDARY,
  tertiary: COLOR_TERTIARY,
};

const labels = {
  primary: "第1次産業",
  secondary: "第2次産業",
  tertiary: "第3次産業",
};

// データの型定義
interface DataRow {
  year: number;
  primary_pct: number;
  secondary_pct: number;
  tertiary_pct: number;
  primary_billion_yen: number;
  secondary_billion_yen: number;
  tertiary_billion_yen: number;
  sna_basis: string;
}

export function IndustryStructureLongChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [hoveredData, setHoveredData] = useState<DataRow | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 1. サイズの監視
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({
          width: width || 600,
          height: height || 400,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. マージンの設定（インラインラベル表示のため右側広め）
  const margin = {
    top: 24,
    right: isMobile ? 70 : 90,
    bottom: 36,
    left: 40,
  };

  const chartWidth = dimensions.width - margin.left - margin.right;
  const chartHeight = dimensions.height - margin.top - margin.bottom;

  // 3. スケールの作成
  const years = threeSectorData.map((d) => d.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const xScale = d3.scaleLinear().domain([minYear, maxYear]).range([0, chartWidth]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

  // 4. 積み上げ用データの作成（D3 stackと同等の計算を手動で行い安全性を確保）
  const processedData = threeSectorData.map((d) => {
    const p = d.primary_pct;
    const s = d.secondary_pct;
    const t = d.tertiary_pct;
    const total = p + s + t;

    // 丸め誤差を考慮して正規化
    const pNorm = (p / total) * 100;
    const sNorm = (s / total) * 100;
    const tNorm = (t / total) * 100;

    return {
      ...d,
      y0_primary: 0,
      y1_primary: pNorm,
      y0_secondary: pNorm,
      y1_secondary: pNorm + sNorm,
      y0_tertiary: pNorm + sNorm,
      y1_tertiary: 100,
    };
  });

  // 5. エリアジェネレータ
  const areaPrimary = d3
    .area<typeof processedData[0]>()
    .x((d) => xScale(d.year))
    .y0((d) => yScale(d.y0_primary))
    .y1((d) => yScale(d.y1_primary))
    .curve(d3.curveMonotoneX);

  const areaSecondary = d3
    .area<typeof processedData[0]>()
    .x((d) => xScale(d.year))
    .y0((d) => yScale(d.y0_secondary))
    .y1((d) => yScale(d.y1_secondary))
    .curve(d3.curveMonotoneX);

  const areaTertiary = d3
    .area<typeof processedData[0]>()
    .x((d) => xScale(d.year))
    .y0((d) => yScale(d.y0_tertiary))
    .y1((d) => yScale(d.y1_tertiary))
    .curve(d3.curveMonotoneX);

  // 6. X軸・Y軸のラベル・目盛り
  const yTicks = [0, 20, 40, 60, 80, 100];
  const xTicks = [1970, 1980, 1990, 2000, 2010, 2020, 2023];

  // 7. ホバー時の処理
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - margin.left;
    const mouseY = e.clientY - rect.top - margin.top;

    // マウス位置から最も近い年を逆算
    const yearVal = Math.round(xScale.invert(mouseX));
    const closest = threeSectorData.find((d) => d.year === yearVal);

    if (closest) {
      setHoveredData(closest);
      setTooltipPos({
        x: xScale(closest.year) + margin.left,
        y: Math.max(20, mouseY + margin.top),
      });
    } else {
      setHoveredData(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  // 金額フォーマッタ（10億円単位を兆円単位に分かりやすく変換）
  const formatAmount = (billionYen: number) => {
    if (billionYen >= 1000) {
      return `${(billionYen / 1000).toFixed(1)}兆円`;
    }
    return `${billionYen.toFixed(0)}億円`;
  };

  // 最新年（2023年）のラベル位置の計算
  const latestData = processedData[processedData.length - 1];
  const labelPositions = {
    primary: yScale((latestData.y0_primary + latestData.y1_primary) / 2),
    secondary: yScale((latestData.y0_secondary + latestData.y1_secondary) / 2),
    tertiary: yScale((latestData.y0_tertiary + latestData.y1_tertiary) / 2),
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <ArticleChartCanvas height={430} mobileHeight={390}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ overflow: "visible" }}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y軸グリッド線 */}
            {yTicks.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={chartWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
            ))}

            {/* 積み上げ面グラフの描画 */}
            <path d={areaTertiary(processedData) || ""} fill={COLOR_TERTIARY} opacity={0.9} />
            <path d={areaSecondary(processedData) || ""} fill={COLOR_SECONDARY} opacity={0.9} />
            <path d={areaPrimary(processedData) || ""} fill={COLOR_PRIMARY} opacity={0.9} />

            {/* X軸の描画 */}
            {xTicks.map((tick) => (
              <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
                <text
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#888888"
                  fontFamily='"Roboto Mono", monospace'
                >
                  {formatYearShort(tick, tick === minYear)}
                </text>
              </g>
            ))}

            {/* Y軸の描画 */}
            {yTicks.map((tick) => (
              <text
                key={tick}
                x={-10}
                y={yScale(tick) + 4}
                textAnchor="end"
                fontSize={11}
                fill="#888888"
                fontFamily='"Roboto Mono", monospace'
              >
                {tick}%
              </text>
            ))}

            {/* インラインラベル（右端） */}
            <text
              x={chartWidth + 8}
              y={labelPositions.tertiary}
              fill={COLOR_TERTIARY}
              fontSize={isMobile ? 10 : 11}
              fontWeight={600}
              dominantBaseline="middle"
            >
              {labels.tertiary}
            </text>
            <text
              x={chartWidth + 8}
              y={labelPositions.secondary}
              fill={COLOR_SECONDARY}
              fontSize={isMobile ? 10 : 11}
              fontWeight={600}
              dominantBaseline="middle"
            >
              {labels.secondary}
            </text>
            <text
              x={chartWidth + 8}
              y={labelPositions.primary}
              fill={COLOR_PRIMARY}
              fontSize={isMobile ? 10 : 11}
              fontWeight={600}
              dominantBaseline="middle"
            >
              {labels.primary}
            </text>

            {/* ホバー時のガイドラインとインジケータ */}
            {hoveredData && (
              <>
                <line
                  x1={xScale(hoveredData.year)}
                  x2={xScale(hoveredData.year)}
                  y1={0}
                  y2={chartHeight}
                  stroke="#666"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle
                  cx={xScale(hoveredData.year)}
                  cy={yScale(hoveredData.primary_pct)}
                  r={4}
                  fill="#fff"
                  stroke={COLOR_PRIMARY}
                  strokeWidth={2}
                />
                <circle
                  cx={xScale(hoveredData.year)}
                  cy={yScale(hoveredData.primary_pct + hoveredData.secondary_pct)}
                  r={4}
                  fill="#fff"
                  stroke={COLOR_SECONDARY}
                  strokeWidth={2}
                />
              </>
            )}
          </g>
        </svg>

        {/* ツールチップ */}
        {hoveredData && (
          <div
            className={styles.tooltip}
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
            }}
          >
            <span className={styles.tooltipYear}>{hoveredData.year}年</span>
            <div className={styles.tooltipRows}>
              <div className={styles.tooltipRow}>
                <div className={styles.tooltipLabelGroup}>
                  <span className={styles.tooltipDot} style={{ background: COLOR_TERTIARY }} />
                  <span>{labels.tertiary}</span>
                </div>
                <span className={styles.tooltipValue}>
                  {hoveredData.tertiary_pct.toFixed(1)}% ({formatAmount(hoveredData.tertiary_billion_yen)})
                </span>
              </div>
              <div className={styles.tooltipRow}>
                <div className={styles.tooltipLabelGroup}>
                  <span className={styles.tooltipDot} style={{ background: COLOR_SECONDARY }} />
                  <span>{labels.secondary}</span>
                </div>
                <span className={styles.tooltipValue}>
                  {hoveredData.secondary_pct.toFixed(1)}% ({formatAmount(hoveredData.secondary_billion_yen)})
                </span>
              </div>
              <div className={styles.tooltipRow}>
                <div className={styles.tooltipLabelGroup}>
                  <span className={styles.tooltipDot} style={{ background: COLOR_PRIMARY }} />
                  <span>{labels.primary}</span>
                </div>
                <span className={styles.tooltipValue}>
                  {hoveredData.primary_pct.toFixed(1)}% ({formatAmount(hoveredData.primary_billion_yen)})
                </span>
              </div>
            </div>
          </div>
        )}
      </ArticleChartCanvas>
    </div>
  );
}
