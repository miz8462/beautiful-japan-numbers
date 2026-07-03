"use client";

import { ResponsiveLine } from "@nivo/line";
import savingsAgeData from "@/data/savings-by-age.json";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import styles from "./DebtByAgeTrendChart.module.css";

// ─── Nivo テーマ設定 ──────────────────────────────────────────
const nivoTheme = {
  background: "transparent",
  text: {
    fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 11,
    fill: "#888888",
  },
  grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
  axis: {
    domain: { line: { stroke: "transparent" } },
    ticks: {
      line: { stroke: "transparent" },
      text: { fill: "#888888", fontSize: 11 },
    },
  },
};

// ─── 年齢階級の定義とデータ抽出 ────────────────────────────────
const ageGroups = {
  under29: "29歳以下",
  "30s": "30～39歳",
  "40s": "40～49歳",
  "50s": "50～59歳",
  "60s": "60～69歳",
  "70plus": "70歳以上",
};

// type: "debt" のレコードのみを抽出して整形
const debtRecords = savingsAgeData.data.filter((d) => d.type === "debt");

const CHART_DATA = Object.entries(ageGroups).map(([key, label]) => {
  const k = key as keyof typeof ageGroups;
  return {
    id: label,
    data: debtRecords.map((d) => ({
      x: d.year,
      y: d[k] as number,
    })),
  };
});

export function DebtByAgeTrendChart() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：万円</span>
      <ArticleChartCanvas height={380} mobileHeight={300}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 20, right: 80, bottom: 40, left: 65 }}
          xScale={{ type: "linear", min: 2002, max: 2025 }}
          yScale={{ type: "linear", min: 0, max: 2100 }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [2002, 2005, 2010, 2015, 2020, 2025],
            format: (v) => `${v}年`,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 500, 1000, 1500, 2000],
            format: (v) => `${Number(v).toLocaleString()}`,
          }}
          // 系列のデフォルト色（カスタムレイヤーで上書きしますが、念のためフォールバックを設定）
          colors={(serie) => (serie.id === "29歳以下" ? "#c0392b" : "#d0d0d0")}
          lineWidth={1.5}
          enableGridX={false}
          gridYValues={[0, 500, 1000, 1500, 2000]}
          useMesh={true}
          pointSize={0}
          layers={[
            "grid",
            "markers",
            "axes",
            // 線描画のカスタムレイヤー：29歳以下のみ太く・赤色（警告色）にする
            ({ series, lineGenerator }: any) => (
              <g>
                {series.map((serie: any) => {
                  const isHighlighted =
                    serie.id === "29歳以下" || serie.id === "30～39歳";
                  const points = serie.data.map((d: any) => ({
                    x: d.position.x,
                    y: d.position.y,
                  }));
                  const color =
                    serie.id === "29歳以下"
                      ? "#c0392b"
                      : serie.id === "30～39歳"
                        ? "#e67e22"
                        : "#d0d0d0";
                  return (
                    <path
                      key={serie.id}
                      d={lineGenerator(points) || ""}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHighlighted ? 3 : 1.5}
                    />
                  );
                })}
              </g>
            ),
            "mesh",
            // ラベル描画のカスタムレイヤー：29歳以下、30代のみ右端にインライン表示
            ({ series }: any) => {
              const targets = series.filter(
                (s: any) => s.id === "29歳以下" || s.id === "30～39歳"
              );
              return (
                <g>
                  {targets.map((target: any) => {
                    const lastPoint = target.data[target.data.length - 1];
                    if (!lastPoint) return null;
                    const color = target.id === "29歳以下" ? "#c0392b" : "#e67e22";
                    return (
                      <text
                        key={target.id}
                        x={lastPoint.position.x + 8}
                        y={lastPoint.position.y + 4}
                        fontSize={12}
                        fontWeight={700}
                        fill={color}
                        fontFamily='"Noto Sans JP", sans-serif'
                      >
                        {target.id}
                      </text>
                    );
                  })}
                </g>
              );
            },
          ]}

          theme={nivoTheme as any}
          tooltip={({ point }) => (
            <div className={styles.tooltip}>
              <span className={styles.tooltipYear}>{point.data.x}年</span>
              <span className={styles.tooltipGroup}>{point.seriesId}</span>
              <span className={styles.tooltipVal}>
                負債額: <strong>{Number(point.data.y).toLocaleString()}万円</strong>
              </span>
            </div>
          )}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
