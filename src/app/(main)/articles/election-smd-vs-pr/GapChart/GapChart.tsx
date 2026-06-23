"use client";

import { ResponsiveBar } from "@nivo/bar";
import electionData from "@/data/election-smd-vs-pr.json";
import styles from "./GapChart.module.css";

// ─── カラー定数 ────────────────────────────────────────────────
const LDP_COLOR = "#e05a2b";
const DEM_COLOR = "#5bbee4";

// ─── Nivo テーマ ──────────────────────────────────────────────
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

// ─── データ変換 ───────────────────────────────────────────────
type BarDatum = {
  year: string;
  jimin: number;
  minshu: number;
  [key: string]: string | number;
};

const CHART_DATA: BarDatum[] = electionData.elections.map((e) => ({
  year: String(e.year),
  jimin: parseFloat((e.jimin.smd_rate - e.jimin.pr_rate).toFixed(1)),
  minshu: parseFloat((e.minshu.smd_rate - e.minshu.pr_rate).toFixed(1)),
}));

// ─── ゼロ線 + ラベルレイヤー ──────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ZeroLineLayer({ innerWidth, yScale }: any) {
  if (!yScale) return null;
  const y = yScale(0);
  return (
    <g>
      <line
        x1={0}
        x2={innerWidth}
        y1={y}
        y2={y}
        stroke="#444444"
        strokeWidth={1.5}
      />
    </g>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────
export default function GapChart() {
  return (
    <div className={styles.wrapper}>
      {/* 凡例 */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: LDP_COLOR }}
          />
          自民党
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: DEM_COLOR }}
          />
          民主・立憲系
        </span>
      </div>

      {/* チャート */}
      <div className={styles.chartCanvas}>
        <ResponsiveBar
          data={CHART_DATA}
          keys={["jimin", "minshu"]}
          indexBy="year"
          groupMode="grouped"
          margin={{ top: 24, right: 16, bottom: 40, left: 52 }}
          padding={0.25}
          innerPadding={3}
          borderRadius={1}
          valueScale={{ type: "linear", min: -40, max: 60 }}
          indexScale={{ type: "band", round: true }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          colors={(d: any) => (d.id === "jimin" ? LDP_COLOR : DEM_COLOR)}
          enableGridY={true}
          enableGridX={false}
          gridYValues={[-40, -20, 0, 20, 40, 60]}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => String(v),
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: [-40, -20, 0, 20, 40, 60],
            format: (v) => (Number(v) > 0 ? `+${v}%` : `${v}%`),
          }}
          enableLabel={false}
          tooltip={({ id, value, indexValue }) => {
            const partyName = id === "jimin" ? "自民党" : "民主・立憲系";
            const formattedValue = value > 0 ? `+${value}%` : `${value}%`;

            return (
              <div style={{
                background: "#FFFFFF",
                border: "1px solid #E0E0E0",
                padding: "6px 10px",
                fontSize: 12,
                color: "#1A1A1A",
                lineHeight: 1.6,
                whiteSpace: "nowrap",

              }}>
                {indexValue}年<br />
                {partyName}：{formattedValue}
              </div>
            )
          }}
          theme={nivoTheme}
          layers={[
            "grid",
            "axes",
            "bars",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (props: any) => (
              <ZeroLineLayer
                innerWidth={props.innerWidth}
                yScale={props.yScale}
              />
            ),
          ]}
        />
      </div>

      {/* 注記 */}
      <p className={styles.note}>
        ＊2017年は希望の党＋立憲民主党の合算
      </p>
    </div>
  );
}
