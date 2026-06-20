"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import dietData from "@/data/diet-menbers.json";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./AgeStructureChart.module.css";

const data = dietData.age.map((d) => {
  const u30Val = d.u30 ?? 0;
  const s30sVal = d["30s"] ?? 0;
  const s40sVal = d["40s"] ?? 0;
  const s50sVal = d["50s"] ?? 0;
  const s60sVal = d["60s"] ?? 0;
  const o70Val = d.o70 ?? 0;

  const total = u30Val + s30sVal + s40sVal + s50sVal + s60sVal + o70Val || 1;

  return {
    year: String(d.year),
    election: d.election,
    scope: d.scope,
    "29歳以下": parseFloat(((u30Val / total) * 100).toFixed(1)),
    "30代": parseFloat(((s30sVal / total) * 100).toFixed(1)),
    "40代": parseFloat(((s40sVal / total) * 100).toFixed(1)),
    "50代": parseFloat(((s50sVal / total) * 100).toFixed(1)),
    "60代": parseFloat(((s60sVal / total) * 100).toFixed(1)),
    "70歳以上": parseFloat(((o70Val / total) * 100).toFixed(1)),
    u30Count: u30Val,
    s30sCount: s30sVal,
    s40sCount: s40sVal,
    s50sCount: s50sVal,
    s60sCount: s60sVal,
    o70Count: o70Val,
    totalCount: total,
  };
});

const LEGENDS = [
  { id: "29歳以下", color: "#2e9e6e" },
  { id: "30代", color: "#68c094" },
  { id: "40代", color: "#8ecce6" },
  { id: "50代", color: "#5bbee4" },
  { id: "60代", color: "#f06449" },
  { id: "70歳以上", color: "#c0392b" },
];

const colorMap: Record<string, string> = {
  "29歳以下": "#2e9e6e",
  "30代": "#68c094",
  "40代": "#8ecce6",
  "50代": "#5bbee4",
  "60代": "#f06449",
  "70歳以上": "#c0392b",
};

// 軸のラベル表示用（重なりを避けるために3回おきに間引き）
const tickValues = data
  .filter((_, idx) => idx % 3 === 0 || idx === data.length - 1)
  .map((d) => d.year);

export default function AgeStructureChart() {
  return (
    <div>
      {/* 凡例 */}
      <div className={styles.legend}>
        {LEGENDS.map((leg) => (
          <div key={leg.id} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: leg.color }}
            />
            <span className={styles.legendLabel}>{leg.id}</span>
          </div>
        ))}
      </div>

      <ArticleChartCanvas height={360} mobileHeight={300}>
        <ResponsiveBar
          data={data}
          keys={["29歳以下", "30代", "40代", "50代", "60代", "70歳以上"]}
          indexBy="year"
          margin={{ top: 10, right: 20, bottom: 40, left: 48 }}
          padding={0.15}
          groupMode="stacked"
          valueScale={{ type: "linear", min: 0, max: 100 }}
          colors={(bar) => colorMap[bar.id]}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            tickValues: tickValues,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 20, 40, 60, 80, 100],
            format: (v) => `${v}%`,
          }}
          gridYValues={[0, 20, 40, 60, 80, 100]}
          enableLabel={false}
          enableGridX={false}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fill: "#555555",
            },
            grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: { line: { stroke: "transparent" }, text: { fill: "#888888" } },
            },
          }}
          tooltip={({ id, value, indexValue, data }) => {
            const d = data as any;
            const countKeyMap: Record<string, string> = {
              "29歳以下": `${d.u30Count}人`,
              "30代": `${d.s30sCount}人`,
              "40代": `${d.s40sCount}人`,
              "50代": `${d.s50sCount}人`,
              "60代": `${d.s60sCount}人`,
              "70歳以上": `${d.o70Count}人`,
            };
            const scopeLabel = d.scope === "smd_only" ? "（小選挙区のみ）" : "（小選挙区＋比例代表）";
            return (
              <div className={styles.tooltip}>
                <strong>
                  {indexValue}年（第{d.election}回）{scopeLabel}
                </strong>
                <br />
                {id}: {value}%（{countKeyMap[id]}）
                <br />
                <span className={styles.tooltipMuted}>
                  当選者総数: {d.totalCount}人
                </span>
              </div>
            );
          }}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
