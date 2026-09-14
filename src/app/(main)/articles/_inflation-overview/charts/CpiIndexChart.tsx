"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import type { CpiDataPoint } from "@/types/cpi";
import type {
  ComputedSeries,
  LineCustomSvgLayerProps,
  LineSeries,
} from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";

type Props = {
  data: CpiDataPoint[];
};

type CpiSeriesId = "total" | "core" | "corecore";
type CpiLineSeries = LineSeries & {
  id: CpiSeriesId;
  data: { x: number; y: number }[];
};

const colors: Record<CpiSeriesId, string> = {
  total: "#5bbee4",
  core: "#f97316",
  corecore: "#a855f7",
};

const labels: Record<CpiSeriesId, string> = {
  total: "総合",
  core: "コア",
  corecore: "コアコア",
};

const annotations = [
  { year: 1997, label: "消費税 3→5%", color: "#9ca3af", labelY: 48, showOnMobile: false },
  { year: 2008, label: "リーマンショック", color: "#9ca3af", labelY: 48, showOnMobile: true },
  { year: 2014, label: "消費税 5→8%", color: "#9ca3af", labelY: 48, showOnMobile: false },
  { year: 2019, label: "消費税 8→10%", color: "#9ca3af", labelY: 48, showOnMobile: false },
  { year: 2020, label: "コロナ禍", color: "#f97316", labelY: 30, showOnMobile: true },
  { year: 2022, label: "ウクライナ侵攻", color: "#9ca3af", labelY: 12, showOnMobile: true },
];

const tickYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];

function EndLabels({ series, xScale, yScale }: LineCustomSvgLayerProps<CpiLineSeries>) {
  return (
    <>
      {series.map((s: ComputedSeries<CpiLineSeries>) => {
        const last = s.data.at(-1);
        if (!last) return null;

        return (
          <text
            key={s.id}
            x={xScale(last.data.x) + 6}
            y={yScale(last.data.y)}
            fontSize={11}
            fontWeight={600}
            fill={s.color}
            dominantBaseline="middle"
          >
            {labels[s.id]}
          </text>
        );
      })}
    </>
  );
}

function AnnotationLayer({ xScale, innerHeight }: LineCustomSvgLayerProps<CpiLineSeries>) {
  return (
    <>
      {annotations.map(({ year, label, color, labelY }) => {
        const x = xScale(year);

        return (
          <g key={year}>
            <line
              x1={x}
              x2={x}
              y1={0}
              y2={innerHeight}
              stroke={color}
              strokeDasharray="4 3"
              opacity={0.6}
            />
            <text
              x={x + 4}
              y={labelY}
              fontSize={10}
              fill={color}
              textAnchor="start"
            >
              {label}
            </text>
          </g>
        );
      })}
    </>
  );
}

function toSeries(data: CpiDataPoint[]): CpiLineSeries[] {
  return (["total", "core", "corecore"] as const).map((key) => ({
    id: key,
    data: data.map((point) => ({ x: point.year, y: point[key] })),
  }));
}

export function CpiIndexChart({ data }: Props) {
  return (
    <ArticleChartCanvas height={400} mobileHeight={360}>
      <ResponsiveLine
        data={toSeries(data)}
        margin={{ top: 34, right: 80, bottom: 50, left: 60 }}
        xScale={{ type: "linear", min: 1990, max: 2025 }}
        yScale={{ type: "linear", min: 82, max: 115 }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: tickYears,
          format: (v) => formatYearShort(v, v === tickYears[0]),
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [85, 90, 95, 100, 105, 110, 115],
          legend: "（2020年=100）",
          legendOffset: -48,
          legendPosition: "middle",
        }}
        layers={[
          "grid",
          AnnotationLayer,
          "axes",
          "lines",
          EndLabels,
          "mesh",
        ]}
        colors={({ id }) => colors[id as CpiSeriesId]}
        lineWidth={2}
        pointSize={0}
        pointBorderWidth={0}
        enableGridX={false}
        gridYValues={[85, 90, 95, 100, 105, 110, 115]}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: {
            legend: { text: { fontSize: 11, fill: "#666666" } },
            ticks: { text: { fontSize: 11, fill: "#888888" } },
          },
        }}
        useMesh={true}
        tooltip={({ point }) => (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E0E0E0",
              padding: "6px 10px",
              fontSize: 12,
              color: "#1A1A1A",
              lineHeight: 1.6,
              whiteSpace: "nowrap",
            }}
          >
            {point.data.xFormatted}年
            <br />
            {labels[point.seriesId as CpiSeriesId]}: {Number(point.data.y).toFixed(1)}
          </div>
        )}
        isInteractive={true}
      />
    </ArticleChartCanvas>
  );
}
