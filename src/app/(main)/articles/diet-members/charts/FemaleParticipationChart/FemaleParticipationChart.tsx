"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import dietData from "@/data/diet-menbers.json";
import { ResponsiveLine } from "@nivo/line";

const TOTAL_CANDIDATES: Record<number, number> = {
  22: 2770, 23: 1590, 24: 1364, 25: 1242, 26: 1027, 27: 1017, 28: 951, 29: 940, 30: 917,
  31: 917, 32: 945, 33: 895, 34: 899, 35: 891, 36: 835, 37: 848, 38: 838, 39: 953, 40: 955,
  41: 1503, 42: 1404, 43: 1159, 44: 1131, 45: 1374, 46: 1504, 47: 1191, 48: 1180, 49: 1051,
  50: 1344, 51: 1284,
};

const femaleRatioPoints = dietData.female.map((d) => ({
  x: d.year,
  y: parseFloat(((d.female_winners / d.total_winners) * 100).toFixed(1)),
  female_winners: d.female_winners,
  total_winners: d.total_winners,
  election: d.election,
}));

const femaleCandidateRatioPoints = dietData.female.map((d) => {
  const totalCand = TOTAL_CANDIDATES[d.election] || 1;
  return {
    x: d.year,
    y: parseFloat(((d.female_candidates / totalCand) * 100).toFixed(1)),
    female_candidates: d.female_candidates,
    total_candidates: totalCand,
    election: d.election,
  };
});

const SERIES = [
  { id: "女性議員の割合", color: "#5bbee4", data: femaleRatioPoints },
  { id: "女性候補者の割合", color: "#1e7aa8", data: femaleCandidateRatioPoints },
];

const THEME = {
  background: "transparent",
  text: { fontFamily: "var(--font-body)", fontSize: 12, fill: "#555555" },
  grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
  axis: {
    domain: { line: { stroke: "transparent" } },
    ticks: { line: { stroke: "transparent" }, text: { fill: "#888888" } },
  },
};

// 右端ラベルのカスタムレイヤー
const SeriesLabels = ({ series, xScale, yScale }: any) => {
  return (
    <>
      {series.map((serie: any) => {
        const lastPoint = serie.data[serie.data.length - 1];
        if (!lastPoint) return null;
        const x = xScale(lastPoint.data.x);
        const y = yScale(lastPoint.data.y);
        return (
          <text
            key={serie.id}
            x={x + 6}
            y={y}
            dominantBaseline="middle"
            style={{
              fontSize: 11,
              fontFamily: "var(--font-body)",
              fill: serie.color,
              fontWeight: 600,
            }}
          >
            {serie.id}
          </text>
        );
      })}
    </>
  );
};

export default function FemaleParticipationChart() {
  return (
    <ArticleChartCanvas height={300} mobileHeight={260}>
      <ResponsiveLine
        data={SERIES}
        margin={{ top: 10, right: 110, bottom: 40, left: 48 }}
        xScale={{ type: "linear", min: 1946, max: 2026 }}
        yScale={{ type: "linear", min: 0, max: 35 }}
        axisBottom={{
          tickSize: 0, tickPadding: 10,
          tickValues: [1946, 1960, 1980, 2000, 2020, 2026],
          format: (v) => `${v}`,
        }}
        axisLeft={{
          tickSize: 0, tickPadding: 10,
          tickValues: [0, 10, 20, 30],
          format: (v) => `${v}%`,
        }}
        pointSize={0}
        colors={(s) => String(s.color)}
        lineWidth={2.5}
        enableGridX={false}
        gridYValues={[0, 10, 20, 30]}
        useMesh={true}
        theme={THEME}
        layers={[
          "grid",
          "axes",
          "lines",
          "points",
          "crosshair",
          "mesh",
          "legends",
          SeriesLabels,
        ]}
        tooltip={({ point }) => {
          const d = point.data as any;
          return (
            <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.08)", color: "#222", fontSize: 12, lineHeight: 1.6, padding: "8px 10px", whiteSpace: "nowrap" }}>
              <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong><br />
              {d.x}年（第{d.election}回）<br />
              {point.data.yFormatted}%
              {point.seriesId === "女性議員の割合" && (
                <span style={{ fontSize: 11, color: "#555", marginLeft: 4 }}>（{d.female_winners}人 / {d.total_winners}人）</span>
              )}
              {point.seriesId === "女性候補者の割合" && (
                <span style={{ fontSize: 11, color: "#555", marginLeft: 4 }}>（{d.female_candidates}人 / {d.total_candidates}人）</span>
              )}
            </div>
          );
        }}
      />
    </ArticleChartCanvas>
  );
}