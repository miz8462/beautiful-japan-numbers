"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import styles from "./page.module.css";

const CityBars = dynamic(() => import("./charts/CityBars"), { ssr: false });
const TotalPopChart = dynamic(() => import("./charts/TotalPopChart"), { ssr: false });
const BirthDeathChart = dynamic(() => import("./charts/BirthDeathChart"), { ssr: false });
const ComponentsChart = dynamic(() => import("./charts/ComponentsChart"), { ssr: false });

function ChartCard({ title, source, children }: {
  title: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.chartSection}>
      <h2 className={styles.statHeadline}>{title}</h2>
      <p className={styles.sourceLabel}>Source: {source}</p>
      <div className={styles.chartCard}>
        <div className={styles.chartScroll}>{children}</div>
      </div>
    </section>
  );
}

export default function PopulationCharts() {
  return (
    <div className={styles.charts}>
      <ChartCard
        title="年間59万人の減少は、仙台市の人口規模なら約1.9年分に相当"
        source="各市人口は2024年推計値"
      >
        <CityBars />
      </ChartCard>

      <ChartCard
        title="2008年をピークに、日本の総人口は減少し続けている"
        source="総務省統計局"
      >
        <TotalPopChart />
      </ChartCard>

      <ChartCard
        title="2007年以降、死亡数が出生数を上回り続けている"
        source="厚生労働省"
      >
        <BirthDeathChart />
      </ChartCard>

      <ChartCard
        title="人口変化は、自然減を社会増が一部補う構図が続く"
        source="総務省統計局"
      >
        <ComponentsChart />
      </ChartCard>
    </div>
  );
}
