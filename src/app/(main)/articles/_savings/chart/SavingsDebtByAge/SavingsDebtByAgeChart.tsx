"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import savingsAgeData from "@/data/savings-by-age.json";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import styles from "./SavingsDebtByAgeChart.module.css";

// ─── カラー定義（DESIGN.mdに準拠） ─────────────────────────────
const SAVINGS_COLOR = "#5bbee4"; // Civic Sky
const DEBT_COLOR = "#c0392b";    // Civic Negative (警告・赤系)

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

export function SavingsDebtByAgeChart() {
  // 利用可能なすべての年を取得して一意にし、降順にソートする
  const availableYears = useMemo(() => {
    const years = savingsAgeData.data.map((d) => d.year);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, []);

  // 選択された年の状態（初期表示は直近の2025年とする）
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || 2025);

  // 選択された年のデータをチャート用に変換する
  const chartData = useMemo(() => {
    const yearData = savingsAgeData.data.filter((d) => d.year === selectedYear);
    const savingsEntry = yearData.find((d) => d.type === "savings");
    const debtEntry = yearData.find((d) => d.type === "debt");

    return Object.entries(savingsAgeData.age_groups).map(([key, label]) => {
      const k = key as keyof typeof savingsAgeData.age_groups;
      return {
        ageGroup: label,
        貯蓄: savingsEntry ? (savingsEntry[k] as number) : 0,
        負債: debtEntry ? (debtEntry[k] as number) : 0,
      };
    });
  }, [selectedYear]);

  // セレクトボックス変更時のハンドラ
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className={styles.wrapper}>
      {/* 操作パネル（年選択） */}
      <div className={styles.controls}>
        <label htmlFor="year-select" className={styles.label}>
          表示年を選択：
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className={styles.select}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </div>

      {/* カスタム凡例 */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: SAVINGS_COLOR }}
          />
          貯蓄
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: DEBT_COLOR }}
          />
          負債
        </span>
        <span className={styles.unitNote}>単位：万円</span>
      </div>

      {/* チャートキャンバス */}
      <div className={styles.chartWrapper}>
        <ArticleChartCanvas height={360} mobileHeight={280}>
          <ResponsiveBar
            data={chartData}
            keys={["貯蓄", "負債"]}
            indexBy="ageGroup"
            groupMode="grouped" // 積み上げではなくグループ化（横並び）
            margin={{ top: 20, right: 16, bottom: 40, left: 40 }}
            padding={0.3}
            innerPadding={2}
            borderRadius={2}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={(d) => (d.id === "貯蓄" ? SAVINGS_COLOR : DEBT_COLOR)}
            enableGridY={true}
            enableGridX={false}
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
              format: (v) => String(v),
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              format: (v) => `${Number(v).toLocaleString()}`,
            }}
            enableLabel={false}
            theme={nivoTheme}
            tooltip={({ id, value, indexValue }) => (
              <div className={styles.tooltip}>
                <span className={styles.tooltipAge}>{indexValue}</span>
                <span className={styles.tooltipVal}>
                  {id}: <strong>{Number(value).toLocaleString()}万円</strong>
                </span>
              </div>
            )}
            isInteractive={true}
          />
        </ArticleChartCanvas>
      </div>
    </div>
  );
}
