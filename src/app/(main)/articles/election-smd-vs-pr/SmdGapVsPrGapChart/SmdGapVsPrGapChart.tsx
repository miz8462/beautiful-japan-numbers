"use client";

import { ResponsiveBar } from "@nivo/bar";
import electionData from "@/data/election-smd-vs-pr.json";
import styles from "./SmdGapVsPrGapChart.module.css";
import { formatYearShort } from "@/lib/chart-format";

// ─── カラー定数 ────────────────────────────────────────────────
const SMD_COLOR = "#e05a2b";
const PR_COLOR = "#5bbee4";

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
    smd_gap: number;
    pr_gap: number;
    [key: string]: string | number;
};

const CHART_DATA: BarDatum[] = electionData.elections.map((e) => ({
    year: String(e.year),
    smd_gap: parseFloat(Math.abs(e.jimin.smd_rate - e.minshu.smd_rate).toFixed(1)),
    pr_gap: parseFloat(Math.abs(e.jimin.pr_rate - e.minshu.pr_rate).toFixed(1)),
}));

// ─── 共通凡例 ─────────────────────────────────────────────────
export function SmdVsPrLegend() {
    return (
        <div className={styles.legend}>
            <span className={styles.legendItem}>
                <span
                    className={styles.legendSwatch}
                    style={{ background: SMD_COLOR, opacity: 1 }}
                />
                小選挙区議席獲得割合
            </span>
            <span className={styles.legendItem}>
                <span
                    className={styles.legendSwatch}
                    style={{
                        background: "transparent",
                        border: `2px solid ${SMD_COLOR}`,
                        opacity: 0.55,
                    }}
                />
                比例得票率
            </span>
        </div>
    );
}

// ─── メインコンポーネント ─────────────────────────────────────
export default function SmdGapVsPrGapChart() {
    const data = CHART_DATA;

    return (
        <div className={styles.wrapper}>
            {/* 凡例 */}
            <div className={styles.legend}>
                <span className={styles.legendItem}>
                    <span
                        className={styles.legendSwatch}
                        style={{ background: SMD_COLOR }}
                    />
                    小選挙区獲得議席割合の差
                </span>
                <span className={styles.legendItem}>
                    <span
                        className={styles.legendSwatch}
                        style={{ background: PR_COLOR }}
                    />
                    比例得票率の差
                </span>
            </div>
            <div className={styles.chartBlock}>
                <div className={styles.chartLabel}></div>
                <div className={styles.chartCanvas}>
                    <ResponsiveBar
                        data={data}
                        keys={["smd_gap", "pr_gap"]}
                        indexBy="year"
                        groupMode="grouped"
                        margin={{ top: 16, right: 16, bottom: 36, left: 44 }}
                        padding={0.25}
                        innerPadding={3}
                        valueScale={{ type: "linear", min: 0, max: 100 }}
                        indexScale={{ type: "band", round: true }}
                        colors={(d: any) => (d.id === "smd_gap" ? SMD_COLOR : PR_COLOR)}

                        borderWidth={0}
                        borderRadius={1}
                        axisBottom={{
                            tickSize: 0,
                            tickPadding: 8,
                            format: (v) => formatYearShort(v, v === '1996'),
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
                        tooltip={({ id, value, indexValue }) => {
                            const key = id == "smd_gap" ? "小選挙区" : "比例";

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
                                    {key}：{value}%
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
            <p className={styles.note}>
                ＊2017年は希望の党＋立憲民主党の合算値
            </p>
        </div>
    );
}
