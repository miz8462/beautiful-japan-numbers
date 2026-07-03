// FemaleWinRateChart.tsx — 「当選率」チャート
"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import dietData from "@/data/diet-menbers.json";
import { formatYearShort } from "@/lib/chart-format";
import { ResponsiveLine } from "@nivo/line";
import styles from "./FemaleWinRateChart.module.css";

const TOTAL_CANDIDATES: Record<number, number> = {
    22: 2770, 23: 1590, 24: 1364, 25: 1242, 26: 1027, 27: 1017, 28: 951, 29: 940, 30: 917,
    31: 917, 32: 945, 33: 895, 34: 899, 35: 891, 36: 835, 37: 848, 38: 838, 39: 953, 40: 955,
    41: 1503, 42: 1404, 43: 1159, 44: 1131, 45: 1374, 46: 1504, 47: 1191, 48: 1180, 49: 1051,
    50: 1344, 51: 1284,
};

const femaleWinRatePoints = dietData.female.map((d) => ({
    x: d.year,
    y: d.win_rate,
    female_winners: d.female_winners,
    female_candidates: d.female_candidates,
    election: d.election,
}));

const maleWinRatePoints = dietData.female.map((d) => {
    const totalCand = TOTAL_CANDIDATES[d.election] || 0;
    const maleCand = totalCand - d.female_candidates;
    const maleWinners = d.total_winners - d.female_winners;
    const winRate = maleCand > 0 ? parseFloat(((maleWinners / maleCand) * 100).toFixed(1)) : 0;
    return {
        x: d.year,
        y: winRate,
        male_winners: maleWinners,
        male_candidates: maleCand,
        election: d.election,
    };
});

const data = [
    { id: "男性候補者の当選率", color: "#2e9e6e", data: maleWinRatePoints },
    { id: "女性候補者の当選率", color: "#f06449", data: femaleWinRatePoints },
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

export default function FemaleWinRateChart() {
    return (
        <div>
            <ArticleChartCanvas height={300} mobileHeight={260}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 10, right: 110, bottom: 40, left: 48 }}
                    xScale={{ type: "linear", min: 1946, max: 2026 }}
                    yScale={{ type: "linear", min: 0, max: 70 }}
                    axisBottom={{
                        tickSize: 0, tickPadding: 10,
                        tickValues: [1946, 1960, 1980, 2000, 2020],
                        format: (v) => formatYearShort(v, v === 1946),
                    }}
                    axisLeft={{
                        tickSize: 0, tickPadding: 10,
                        tickValues: [0, 20, 40, 60],
                        format: (v) => `${v}%`,
                    }}
                    colors={(s) => String(s.color)}
                    lineWidth={2.5}
                    pointSize={0}
                    enableGridX={false}
                    gridYValues={[0, 20, 40, 60]}
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
                            <div className={styles.tooltip}>
                                <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong><br />
                                {d.x}年（第{d.election}回）<br />
                                {point.data.yFormatted}%
                                {point.seriesId === "女性候補者の当選率" && (
                                    <span className={styles.tooltipSub}>（{d.female_winners}人 / {d.female_candidates}人）</span>
                                )}
                                {point.seriesId === "男性候補者の当選率" && (
                                    <span className={styles.tooltipSub}>（{d.male_winners}人 / {d.male_candidates}人）</span>
                                )}
                            </div>
                        );
                    }}
                />
            </ArticleChartCanvas>
        </div>
    );
}