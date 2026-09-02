"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import ghgDataRaw from "@/data/ghg-emissions.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./GasTypeShareChart.module.css";

const COLOR_CO2 = "var(--color-brand, #5bbee4)";
const COLOR_CH4 = "var(--color-brand-second, #f19db5)";
const COLOR_N2O = "var(--color-brand-third, #7f1084)";
const COLOR_FGAS = "#e67e22";

const KEYS = ["co2", "ch4", "n2o", "fgas"] as const;

const LABEL_MAP: Record<string, string> = {
  co2: "二酸化炭素（CO2）",
  ch4: "メタン（CH4）",
  n2o: "一酸化二窒素（N2O）",
  fgas: "代替フロン等4ガス",
};

const COLOR_MAP: Record<string, string> = {
  co2: COLOR_CO2,
  ch4: COLOR_CH4,
  n2o: COLOR_N2O,
  fgas: COLOR_FGAS,
};

// 5年刻み＋最新年（2024）を抽出
const SELECTED_YEARS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];

const rawData = ghgDataRaw.gas_breakdown;

const CHART_DATA = SELECTED_YEARS.map((year) => {
  const idx = rawData.years.indexOf(year);
  const total = rawData.total[idx];
  const co2 = rawData.co2_total[idx];
  const ch4 = rawData.ch4[idx];
  const n2o = rawData.n2o[idx];
  const fgas = rawData.fgas[idx];

  return {
    year: `${year}年度`,
    yearNum: year,
    total,
    co2: Number(((co2 / total) * 100).toFixed(1)),
    ch4: Number(((ch4 / total) * 100).toFixed(1)),
    n2o: Number(((n2o / total) * 100).toFixed(1)),
    fgas: Number(((fgas / total) * 100).toFixed(1)),
    rawCo2: co2,
    rawCh4: ch4,
    rawN2o: n2o,
    rawFgas: fgas,
  };
});

function barLabel(d: { id: string | number; value?: number | null }) {
  if (!d.value || d.value < 4) return "";
  return `${d.value}%`;
}

export function GasTypeShareChart() {
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
      <span className={styles.unitNote}>単位：構成比（%）</span>
      <ArticleChartCanvas height={360} mobileHeight={300}>
        <ResponsiveBar
          data={CHART_DATA}
          keys={[...KEYS]}
          indexBy="year"
          layout="vertical"
          groupMode="stacked"
          margin={{
            top: 10,
            right: isMobile ? 8 : 16,
            bottom: 44,
            left: 48,
          }}
          valueScale={{ type: "linear", min: 0, max: 100, nice: false }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => COLOR_MAP[id as string]}
          padding={0.45}
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
          labelSkipHeight={16}
          labelTextColor="#ffffff"
          tooltip={({ indexValue }) => {
            const row = CHART_DATA.find((d) => d.year === indexValue);
            if (!row) return null;
            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{row.year}（総量: {row.total.toFixed(1)} Mt）</span>
                <div className={styles.tooltipRows}>
                  {KEYS.map((key) => {
                    const rawVal =
                      key === "co2"
                        ? row.rawCo2
                        : key === "ch4"
                        ? row.rawCh4
                        : key === "n2o"
                        ? row.rawN2o
                        : row.rawFgas;
                    return (
                      <div key={key} className={styles.tooltipRow}>
                        <span
                          className={styles.tooltipDot}
                          style={{ background: COLOR_MAP[key] }}
                        />
                        <span className={styles.tooltipLabel}>{LABEL_MAP[key]}</span>
                        <span className={styles.tooltipValue}>
                          {row[key]}% ({rawVal.toFixed(1)} Mt)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: isMobile ? 10 : 12,
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
    </div>
  );
}
