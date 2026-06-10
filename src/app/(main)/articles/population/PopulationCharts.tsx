"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import styles from "./page.module.css";

const CityBars = dynamic(() => import("./charts/CityBars"), { ssr: false });
const TotalPopChart = dynamic(() => import("./charts/TotalPopChart"), { ssr: false });
const BirthDeathChart = dynamic(() => import("./charts/BirthDeathChart"), { ssr: false });
const NaturalSocialChart = dynamic(() => import("./charts/NaturalSocialChart"), { ssr: false });

function ChartSection({ title, source, sourceUrl, children }: {
  title: string;
  source?: string;
  sourceUrl?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.chartSection}>
      <h2 className={styles.statHeadline}>{title}</h2>
      {source && (
        <p className={styles.sourceLabel}>出典:{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {source}
          </a>
        </p>
      )}
      <div className={styles.chartCard}>
        <div className={styles.chartScroll}>{children}</div>
      </div>
    </section>
  );
}

export default function PopulationCharts() {
  return (
    <div className={styles.charts}>
      <ChartSection
        title="年間58万人の減少は、仙台市の人口規模なら約1.9年分に相当"
        source="総務省 住民基本台帳"
        sourceUrl="https://www.soumu.go.jp/main_sosiki/jichi_gyousei/daityo/jinkou_jinkoudoutai-setaisuu.html"
      >
        <CityBars />
      </ChartSection>

      <ChartSection
        title="2008年をピークに、日本の総人口は減少し続けている"
      >
        <TotalPopChart />
      </ChartSection>

      <ChartSection
        title="2007年以降、死亡数が出生数を上回り続けている"
      >
        <BirthDeathChart />
      </ChartSection>

      <ChartSection
        title="人口変化は、自然減を社会増が一部補う構図が続く"
      >
        <NaturalSocialChart />
      </ChartSection>
    </div>
  );
}
