"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import data from "@/data/consumption-tax-issues.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { AxisTickProps } from "@nivo/axes";
import type { BarCustomLayerProps } from "@nivo/bar";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./IssueBar.module.css";

type MemberData = {
  speakers: number;
  paragraphs: number;
  top_speaker: string;
  top_share: number;
  parties: Record<string, number>;
};

type GovData = {
  responses: number;
  paragraphs: number;
};

type Issue = {
  id: string;
  label: string;
  member: MemberData;
  gov: GovData;
};

type IssueBarDatum = {
  id: string;
  label: string;
  speakers: number;
  govResponses: number;
  memberParagraphs: number;
  govParagraphs: number;
  [key: string]: string | number;
};

// 並び順定義: id の配列で固定
const GROUP_1 = ["A", "B", "C", "D", "E"]; // 根本問題
const GROUP_2 = ["F", "G", "H", "I"];       // 影響
const GROUP_3 = ["J", "K", "L", "M", "N"]; // やりかた
const ORDERED_IDS = [...GROUP_1, ...GROUP_2, ...GROUP_3];

const rawIssues = (data.issues as Issue[]) || [];
const issueMap = new Map<string, Issue>(rawIssues.map((it) => [it.id, it]));

const ORDERED_ISSUES: Issue[] = ORDERED_IDS.map((id) => {
  const found = issueMap.get(id);
  if (!found) {
    throw new Error(`Issue id ${id} not found in consumption-tax-issues.json`);
  }
  return found;
});

// Nivoの横棒グラフでは先頭データが下から描画されるため、
// 上から A が先頭に見えるよう配列を逆順にして渡す
const CHART_DATA: IssueBarDatum[] = [...ORDERED_ISSUES].reverse().map((issue) => ({
  id: issue.id,
  label: issue.label,
  speakers: issue.member.speakers,
  govResponses: issue.gov.responses,
  memberParagraphs: issue.member.paragraphs,
  govParagraphs: issue.gov.paragraphs,
}));

function DividersLayer({
  bars,
  innerWidth,
}: BarCustomLayerProps<IssueBarDatum>) {
  if (bars.length === 0) return null;

  // 各論点ごとのバーをまとめる
  type BarItem = (typeof bars)[number];
  const barsByIssue = new Map<string, BarItem[]>();
  for (const bar of bars) {
    const issueId = bar.data.data.id;
    const list = barsByIssue.get(issueId) ?? [];
    list.push(bar);
    barsByIssue.set(issueId, list);
  }

  const getIssueBottom = (issueId: string) => {
    const list = barsByIssue.get(issueId);
    if (!list || list.length === 0) return null;
    return Math.max(...list.map((b) => b.y + b.height));
  };

  const getIssueTop = (issueId: string) => {
    const list = barsByIssue.get(issueId);
    if (!list || list.length === 0) return null;
    return Math.min(...list.map((b) => b.y));
  };

  const g1EndBottom = getIssueBottom(GROUP_1[GROUP_1.length - 1]);
  const g2StartTop = getIssueTop(GROUP_2[0]);
  const divider1Y =
    g1EndBottom !== null && g2StartTop !== null
      ? (g1EndBottom + g2StartTop) / 2
      : null;

  const g2EndBottom = getIssueBottom(GROUP_2[GROUP_2.length - 1]);
  const g3StartTop = getIssueTop(GROUP_3[0]);
  const divider2Y =
    g2EndBottom !== null && g3StartTop !== null
      ? (g2EndBottom + g3StartTop) / 2
      : null;

  return (
    <g>
      {divider1Y !== null && (
        <line
          x1={0}
          x2={innerWidth}
          y1={divider1Y}
          y2={divider1Y}
          stroke="var(--color-border, #e0e0e0)"
          strokeWidth={1}
        />
      )}
      {divider2Y !== null && (
        <line
          x1={0}
          x2={innerWidth}
          y1={divider2Y}
          y2={divider2Y}
          stroke="var(--color-border, #e0e0e0)"
          strokeWidth={1}
        />
      )}
    </g>
  );
}

function BarLabelsLayer({
  bars,
}: BarCustomLayerProps<IssueBarDatum>) {
  return (
    <g>
      {bars.map((bar) => {
        const isSpeaker = bar.data.id === "speakers";
        const unit = isSpeaker ? "人" : "回";
        const val = bar.data.value;
        const x = bar.x + bar.width + 6;
        const y = bar.y + bar.height / 2;

        return (
          <text
            key={`label-${bar.key}`}
            x={x}
            y={y}
            textAnchor="start"
            dominantBaseline="central"
            fill="var(--color-text-secondary, #555555)"
            fontFamily="var(--font-data, monospace)"
            fontSize={11}
            fontWeight={500}
          >
            {val}{unit}
          </text>
        );
      })}
    </g>
  );
}

export function IssueBar() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // 左軸の renderTick: PCは8文字、モバイルは7文字で折り返し、最大2行
  const renderTick = (tick: AxisTickProps<string | number>) => {
    const text = String(tick.value);
    const maxChars = isMobile ? 7 : 8;

    let line1 = text.slice(0, maxChars);
    let remainder = text.slice(maxChars);

    // 2行目の先頭の文字が閉じ括弧（) ） 」 』）のときは、その1文字を1行目の末尾に移す
    const closingBrackets = [")", "）", "」", "』"];
    if (remainder.length > 0 && closingBrackets.includes(remainder[0])) {
      line1 += remainder[0];
      remainder = remainder.slice(1);
    }

    const line2 = remainder.slice(0, maxChars);
    const isMultiLine = line2.length > 0;

    return (
      <g transform={`translate(${tick.x},${tick.y})`}>
        {isMultiLine ? (
          <>
            <text
              x={-10}
              y={-7}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--color-text-primary, #222222)"
              fontSize={isMobile ? 11 : 12}
            >
              {line1}
            </text>
            <text
              x={-10}
              y={7}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--color-text-primary, #222222)"
              fontSize={isMobile ? 11 : 12}
            >
              {line2}
            </text>
          </>
        ) : (
          <text
            x={-10}
            y={0}
            textAnchor="end"
            dominantBaseline="central"
            fill="var(--color-text-primary, #222222)"
            fontSize={isMobile ? 11 : 12}
          >
            {line1}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className={styles.wrapper}>
      {/* 凡例 */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendColorSpeakers} />
          議員の発言者数
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColorGov} />
          政府の応答回数
        </span>
      </div>

      <ArticleChartCanvas height={660} mobileHeight={620}>
        <ResponsiveBar<IssueBarDatum>
          animate={false}
          data={CHART_DATA}
          keys={["speakers", "govResponses"]}
          groupMode="grouped"
          indexBy="label"
          layout="horizontal"
          margin={{
            top: 12,
            right: isMobile ? 44 : 52,
            bottom: 36,
            left: isMobile ? 105 : 130,
          }}
          valueScale={{ type: "linear", min: 0, max: 32, nice: false }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => (id === "speakers" ? "#5bbee4" : "#1e7aa8")}
          padding={0.28}
          innerPadding={3}
          borderRadius={2}
          enableGridX={true}
          enableGridY={false}
          gridXValues={[0, 5, 10, 15, 20, 25, 30]}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: [0, 5, 10, 15, 20, 25, 30],
            format: (v) => `${v}`,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            renderTick,
          }}
          enableLabel={false}
          layers={[
            "grid",
            "axes",
            "bars",
            DividersLayer,
            BarLabelsLayer,
          ]}
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
                text: { fill: "var(--color-text-primary, #222222)", fontSize: 12 },
              },
            },
          }}
          tooltip={({ data: datum }) => (
            <div className={styles.tooltip}>
              <div className={styles.tooltipTitle}>{datum.label}</div>
              <div className={styles.tooltipBody}>
                <div className={styles.tooltipCol}>
                  <span className={styles.tooltipColLabel}>
                    <span className={styles.tooltipDot} />
                    議員の発言者
                  </span>
                  <span className={styles.tooltipValue}>
                    {datum.speakers}
                    <span className={styles.tooltipUnit}>人</span>
                  </span>
                  <span className={styles.tooltipSub}>{datum.memberParagraphs}段落</span>
                </div>
                <div className={styles.tooltipDivider} />
                <div className={styles.tooltipCol}>
                  <span className={styles.tooltipColLabel}>
                    <span className={`${styles.tooltipDot} ${styles.tooltipDotGov}`} />
                    政府の応答
                  </span>
                  <span className={styles.tooltipValue}>
                    {datum.govResponses}
                    <span className={styles.tooltipUnit}>回</span>
                  </span>
                  <span className={styles.tooltipSub}>{datum.govParagraphs}段落</span>
                </div>
              </div>
            </div>
          )}
        />
      </ArticleChartCanvas>
    </div>
  );
}
