"use client";
import dynamic from "next/dynamic";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import disposableIncomeData from "@/data/disposable-income.json";
import { formatYearShort } from "@/lib/chart-format";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((mod) => mod.ResponsiveLine),
  { ssr: false }
);

const SERIES_ID = "実収入";
const COLOR = "#5bbee4";

const tickYears = [1989, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
const yTickValues = [50, 55, 60, 65];

const chartData = [
  {
    id: SERIES_ID,
    data: disposableIncomeData.series.map((point) => ({
      x: point.year,
      y: point.income / 10000,
    })),
  },
];

export default function IncomeChart() {
  return (
    <ArticleChartCanvas height={260} mobileHeight={220}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 10, right: 56, bottom: 40, left: 48 }}
        xScale={{ type: "linear", min: 1989, max: 2024, nice: false }}
        yScale={{ type: "linear", min: 48, max: 66 }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: tickYears,
          format: (v) => formatYearShort(v, v === tickYears[0]),
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: yTickValues,
          format: (v) => `${v}万`,
        }}
        layers={[
          "grid",
          "axes",
          "lines",
          "mesh",
          ({ series }) => (
            <>
              {series.map((serie) => {
                const lastPoint = serie.data.at(-1);
                if (!lastPoint) return null;

                return (
                  <text
                    key={serie.id}
                    x={lastPoint.position.x + 8}
                    y={lastPoint.position.y + 4}
                    fontSize={11}
                    fontWeight={600}
                    fill={COLOR}
                    dominantBaseline="middle"
                  >
                    {serie.id}
                  </text>
                );
              })}
            </>
          ),
        ]}
        colors={[COLOR]}
        lineWidth={2}
        pointSize={0}
        pointBorderWidth={0}
        enableGridX={false}
        gridYValues={yTickValues}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 11, fill: "#888888" } } },
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
            {point.data.xFormatted}年：{Number(point.data.y).toFixed(1)}万円
          </div>
        )}
        isInteractive={true}
      />
    </ArticleChartCanvas>
  );
}
