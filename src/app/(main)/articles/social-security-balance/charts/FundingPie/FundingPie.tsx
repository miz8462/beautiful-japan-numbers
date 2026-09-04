"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import balanceData from "@/data/social-security-balance.json";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./FundingPie.module.css";

const fundingList = balanceData.fundingStructure;
const totalFunding = fundingList.reduce((sum, item) => sum + item.value, 0);

const KEYS = ["insurance", "national", "local"] as const;

const KEY_MAP: Record<string, { label: string; value: number; share: number; color: string }> = {
  insurance: {
    label: "社会保険料",
    value: fundingList[0].value,
    share: Number(((fundingList[0].value / totalFunding) * 100).toFixed(1)),
    color: "var(--color-brand, #5bbee4)",
  },
  national: {
    label: "国庫負担（公費）",
    value: fundingList[1].value,
    share: Number(((fundingList[1].value / totalFunding) * 100).toFixed(1)),
    color: "var(--color-brand-dark, #1e7aa8)",
  },
  local: {
    label: "地方負担（公費）",
    value: fundingList[2].value,
    share: Number(((fundingList[2].value / totalFunding) * 100).toFixed(1)),
    color: "color-mix(in srgb, var(--color-brand) 40%, var(--color-brand-dark) 60%)",
  },
};

const CHART_DATA = [
  {
    category: "財源構成",
    insurance: KEY_MAP.insurance.share,
    national: KEY_MAP.national.share,
    local: KEY_MAP.local.share,
  },
];

export function FundingPie() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      {/* 凡例 */}
      <div className={styles.legend}>
        {KEYS.map((key) => (
          <div key={key} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: KEY_MAP[key].color }}
            />
            <span>
              {KEY_MAP[key].label}（{KEY_MAP[key].share}% / {KEY_MAP[key].value}兆円）
            </span>
          </div>
        ))}
      </div>

      <span className={styles.unitNote}>単位：構成比（%）</span>

      {/* 100%比率の横帯バーチャート */}
      <ArticleChartCanvas height={130} mobileHeight={120}>
        <ResponsiveBar
          data={CHART_DATA}
          keys={[...KEYS]}
          indexBy="category"
          layout="horizontal"
          groupMode="stacked"
          margin={{
            top: 10,
            right: isMobile ? 12 : 20,
            bottom: 40,
            left: isMobile ? 10 : 20,
          }}
          valueScale={{ type: "linear", min: 0, max: 100, nice: false }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => KEY_MAP[id as string].color}
          padding={0.25}
          borderRadius={3}
          enableGridX={true}
          enableGridY={false}
          gridXValues={[0, 25, 50, 75, 100]}
          axisTop={null}
          axisRight={null}
          axisLeft={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: [0, 25, 50, 75, 100],
            format: (v) => `${v}%`,
          }}
          enableLabel={true}
          label={(d) => `${d.value}%`}
          labelTextColor="#ffffff"
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data, monospace)",
              fontSize: 12,
              fill: "var(--color-text-muted, #888888)",
            },
            grid: {
              line: {
                stroke: "var(--color-border, #e0e0e0)",
                strokeWidth: 1,
              },
            },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-muted, #888888)", fontSize: 11 },
              },
            },
          }}
          tooltip={({ id }) => {
            const item = KEY_MAP[id as string];
            if (!item) return null;
            return (
              <div className={styles.tooltip}>
                <strong>{item.label}</strong>: {item.value}兆円（{item.share}%）
              </div>
            );
          }}
        />
      </ArticleChartCanvas>

      {/* サマリーカード表示 */}
      <div className={styles.cardGrid}>
        {KEYS.map((key) => {
          const item = KEY_MAP[key];
          return (
            <div
              key={key}
              className={styles.card}
              style={{ borderLeftColor: item.color }}
            >
              <span className={styles.cardLabel}>{item.label}</span>
              <span className={styles.cardValue}>{item.value}兆円</span>
              <span className={styles.cardMeta}>全体の {item.share}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
