"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import dataRaw from "@/data/farm-decline.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./AgeCompositionChart.module.css";

const COLOR_UNDER30 = "var(--color-brand, #5bbee4)";
const COLOR_30TO59 = "var(--color-brand-second, #4a8fa8)";
const COLOR_60PLUS = "var(--color-brand-third, #2d5a72)";

const CHART_DATA = dataRaw.ageComposition.map((d) => ({
  year: String(d.year),
  under30: d.under30,
  age30to59: d.age30to59,
  age60plus: d.age60plus,
}));

const KEYS = ["under30", "age30to59", "age60plus"] as const;

const LABEL_MAP: Record<string, string> = {
  under30: "30歳未満",
  age30to59: "30〜59歳",
  age60plus: "60歳以上",
};

const COLOR_MAP: Record<string, string> = {
  under30: COLOR_UNDER30,
  age30to59: COLOR_30TO59,
  age60plus: COLOR_60PLUS,
};

// 棒グラフ内のパーセントラベル（小さい場合は非表示）
function barLabel(d: { value?: number | null }) {
  if (!d.value || d.value < 5) return "";
  return `${d.value}%`;
}

export function AgeCompositionChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        {KEYS.map((key) => (
          <div key={key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: COLOR_MAP[key] }} />
            <span>{LABEL_MAP[key]}</span>
          </div>
        ))}
      </div>
      <ArticleChartCanvas height={360} mobileHeight={280}>
        <ResponsiveBar
          data={CHART_DATA}
          keys={[...KEYS]}
          indexBy="year"
          layout="vertical"
          groupMode="stacked"
          margin={{
            top: 20,
            right: isMobile ? 8 : 24,
            bottom: 48,
            left: isMobile ? 40 : 52,
          }}
          valueScale={{ type: "linear", min: 0, max: 100, nice: false }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => COLOR_MAP[id as string]}
          padding={0.55}
          borderRadius={2}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 20, 40, 60, 80, 100],
            format: (v) => `${v}%`,
          }}
          gridYValues={[0, 20, 40, 60, 80, 100]}
          enableLabel={true}
          label={barLabel}
          labelSkipHeight={18}
          labelTextColor="#fff"
          tooltip={({ indexValue }) => {
            const row = dataRaw.ageComposition.find(
              (d) => String(d.year) === String(indexValue)
            );
            if (!row) return null;
            const values: { key: typeof KEYS[number]; value: number }[] = [
              { key: "under30", value: row.under30 },
              { key: "age30to59", value: row.age30to59 },
              { key: "age60plus", value: row.age60plus },
            ];
            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{indexValue}年</span>
                {values.map(({ key, value }) => (
                  <div key={key} className={styles.tooltipRow}>
                    <span
                      className={styles.tooltipDot}
                      style={{ background: COLOR_MAP[key] }}
                    />
                    {LABEL_MAP[key]}：
                    <strong className={styles.tooltipValue}>{value}%</strong>
                  </div>
                ))}
              </div>
            );
          }}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: isMobile ? 10 : 13,
              fill: "var(--color-text-secondary)",
            },
            grid: {
              line: {
                stroke: "var(--color-border)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              },
            },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-secondary)", fontSize: 12 },
              },
            },
          }}
        />
      </ArticleChartCanvas>
      <p className={styles.basisNote}>
        ※1995・2005年は販売農家ベース、2015・2025年は個人経営体ベース。
        両ベースは2015年時点でほぼ一致するため、系列の接続は統計的に妥当。
      </p>
    </div>
  );
}
