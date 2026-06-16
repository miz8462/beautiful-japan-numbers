"use client";

import deadVoteData from "@/data/dead-votes-2026.json";
import { ResponsiveWaffle } from "@nivo/waffle";
import styles from "./DeadVoteChart.module.css";

const COLOR_DEAD = "#f06449"; // Data Visualization: Secondary
const COLOR_COUNTED = "#aaaaaa"; // Data Visualization: Reference

const nivoTheme = {
  text: {
    fontSize: 13,
    fill: "#555555",
    fontFamily:
      '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "游ゴシック体", sans-serif',
  },
  tooltip: {
    container: {
      background: "#ffffff",
      color: "#222222",
      fontSize: 13,
      borderRadius: 4,
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
      padding: "8px 12px",
    },
  },
};

type WaffleDatum = {
  id: string;
  label: string;
  value: number;
};

function buildData(deadRate: number): WaffleDatum[] {
  const deadCells = Math.round(deadRate * 100);
  return [
    { id: "dead", label: "死票", value: deadCells },
    { id: "counted", label: "議席に反映された票", value: 100 - deadCells },
  ];
}

function WaffleBlock({
  title,
  deadRate,
}: {
  title: string;
  deadRate: number;
}) {
  const data = buildData(deadRate);

  return (
    <div className={styles.block}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.waffle}>
        <ResponsiveWaffle
          data={data}
          total={100}
          rows={10}
          columns={10}
          padding={1}
          colors={[COLOR_DEAD, COLOR_COUNTED]}
          borderRadius={1}
          fillDirection="right"
          theme={nivoTheme}
          motionStagger={1}
          isInteractive={false}
        />
        <div className={styles.centerLabel}>
          {(deadRate * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

export default function DeadVoteChart() {
  const { singleMemberDistrict, proportional } = deadVoteData;

  const smdRate = singleMemberDistrict.deadVoteRate;
  const propRate = proportional.deadVoteRate;

  return (
    <div className={styles.container}>
      <div className={styles.charts}>
        <WaffleBlock
          title="小選挙区"
          deadRate={smdRate}
        />
        <WaffleBlock
          title="比例代表"
          deadRate={propRate}
        />
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: COLOR_DEAD }}
          />
          死票(議席に結びつかなかった票)
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: COLOR_COUNTED }}
          />
          議席に反映された票
        </span>
      </div>

    {/* TODO: 中選挙区制も比較する */}
    </div>
  );
}