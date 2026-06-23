"use client";

import { ResponsiveBar } from "@nivo/bar";
import electionData from "@/data/election-smd-vs-pr.json";
import styles from "./SmdVsPrChart.module.css";

// ─── カラー定数 ────────────────────────────────────────────────
const LDP_SOLID = "#e05a2b";
const LDP_LIGHT = "rgba(224, 90, 43, 0.30)";
const DEM_SOLID = "#5bbee4";
const DEM_LIGHT = "rgba(91, 190, 228, 0.30)";

// ─── Nivo テーマ ──────────────────────────────────────────────
const nivoTheme = {
  background: "transparent",
  text: {
    fontFamily:
      '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
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
  smd_rate: number;
  pr_rate: number;
  [key: string]: string | number;
};

function buildData(
  key: "jimin" | "minshu"
): BarDatum[] {
  return electionData.elections.map((e) => ({
    year: String(e.year),
    smd_rate: e[key].smd_rate,
    pr_rate: e[key].pr_rate,
  }));
}

// ─── 共通凡例 ─────────────────────────────────────────────────
export function SmdVsPrLegend() {
  return (
    <div className={styles.legend}>
      <span className={styles.legendItem}>
        <span
          className={styles.legendSwatch}
          style={{ background: LDP_SOLID, opacity: 1 }}
        />
        小選挙区議席獲得割合
      </span>
      <span className={styles.legendItem}>
        <span
          className={styles.legendSwatch}
          style={{
            background: "transparent",
            border: `2px solid ${LDP_SOLID}`,
            opacity: 0.55,
          }}
        />
        比例得票率
      </span>
    </div>
  );
}

// ─── 1チャートブロック ────────────────────────────────────────
type ChartBlockProps = {
  label: string;
  party: "jimin" | "minshu";
};

function ChartBlock({ label, party }: ChartBlockProps) {
  const solidColor = party === "jimin" ? LDP_SOLID : DEM_SOLID;
  const lightColor = party === "jimin" ? LDP_LIGHT : DEM_LIGHT;
  const data = buildData(party);

  return (
    <div className={styles.chartBlock}>
      <div className={styles.chartLabel}>{label}</div>
      <div className={styles.chartCanvas}>
        <ResponsiveBar
          data={data}
          keys={["smd_rate", "pr_rate"]}
          indexBy="year"
          groupMode="grouped"
          margin={{ top: 16, right: 16, bottom: 36, left: 44 }}
          padding={0.25}
          innerPadding={3}
          valueScale={{ type: "linear", min: 0, max: 100 }}
          indexScale={{ type: "band", round: true }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          colors={(d: any) =>
            d.id === "smd_rate" ? solidColor : lightColor
          }
          borderWidth={0}
          borderRadius={1}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => String(v),
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: [0, 25, 50, 75, 100],
            format: (v) => `${v}%`,
          }}
          gridYValues={[0, 25, 50, 75, 100]}
          enableLabel={false}
          isInteractive={true}
          tooltip={({value, indexValue }) => {
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
                {value}%
              </div>
            )
          }}

          theme={nivoTheme}
          layers={[
            "grid",
            "axes",
            "bars",
          ]}
        />
      </div>
    </div>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────
export default function SmdVsPrChart() {
  return (
    <div className={styles.wrapper}>
      <SmdVsPrLegend />
      <ChartBlock label="自民党" party="jimin" />
      <ChartBlock label="民主・立憲系" party="minshu" />
      <p className={styles.note}>
        ＊2017年は希望の党＋立憲民主党の合算値
      </p>
    </div>
  );
}
