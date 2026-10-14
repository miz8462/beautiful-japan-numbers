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

function GovernmentResponsesAndDividersLayer({
  bars,
  innerWidth,
  margin,
}: BarCustomLayerProps<IssueBarDatum>) {
  if (bars.length === 0) return null;

  // margin.right: PC 80 / モバイル 62
  const isMobile = margin.right < 75;
  const colX = innerWidth + (isMobile ? 54 : 70);
  const dividerRight = innerWidth + (isMobile ? 58 : 74);

  // 画面上で最上段のバー（yが最小のバー）
  const topBar = bars.reduce(
    (prev, curr) => (curr.y < prev.y ? curr : prev),
    bars[0]
  );

  // グループ境界（GROUP_1 | GROUP_2 | GROUP_3）
  const barMap = new Map(bars.map((b) => [b.data.data.id, b]));
  const barG1End = barMap.get(GROUP_1[GROUP_1.length - 1]);
  const barG2Start = barMap.get(GROUP_2[0]);
  const barG2End = barMap.get(GROUP_2[GROUP_2.length - 1]);
  const barG3Start = barMap.get(GROUP_3[0]);

  const divider1Y =
    barG1End && barG2Start
      ? (barG1End.y + barG1End.height + barG2Start.y) / 2
      : null;
  const divider2Y =
    barG2End && barG3Start
      ? (barG2End.y + barG2End.height + barG3Start.y) / 2
      : null;

  return (
    <g>
      {/* 列見出し: 最上段の上に配置 */}
      {topBar && (
        <text
          x={colX}
          y={topBar.y - 14}
          textAnchor="end"
          dominantBaseline="central"
          fill="var(--color-text-secondary, #555555)"
          fontFamily="var(--font-data, monospace)"
          fontSize={isMobile ? 10 : 11}
          fontWeight={600}
        >
          政府の応答(回)
        </text>
      )}

      {/* 各行の政府応答回数 */}
      {bars.map((bar) => {
        const datum = bar.data.data;
        const y = bar.y + bar.height / 2;
        return (
          <text
            key={`gov-${bar.key}`}
            x={colX}
            y={y}
            textAnchor="end"
            dominantBaseline="central"
            fill="var(--color-text-secondary, #555555)"
            fontFamily="var(--font-data, monospace)"
            fontSize={12}
          >
            {datum.govResponses}回
          </text>
        );
      })}

      {/* グループ1と2の間の区切り線 */}
      {divider1Y !== null && (
        <line
          x1={0}
          x2={dividerRight}
          y1={divider1Y}
          y2={divider1Y}
          stroke="var(--color-border, #e0e0e0)"
          strokeWidth={1}
        />
      )}

      {/* グループ2と3の間の区切り線 */}
      {divider2Y !== null && (
        <line
          x1={0}
          x2={dividerRight}
          y1={divider2Y}
          y2={divider2Y}
          stroke="var(--color-border, #e0e0e0)"
          strokeWidth={1}
        />
      )}
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
      <ArticleChartCanvas height={560} mobileHeight={520}>
        <ResponsiveBar<IssueBarDatum>
          animate={false}
          data={CHART_DATA}
          keys={["speakers"]}
          indexBy="label"
          layout="horizontal"
          margin={{
            top: 28,
            right: isMobile ? 62 : 80,
            bottom: 36,
            left: isMobile ? 105 : 130,
          }}
          valueScale={{ type: "linear", min: 0, max: 26, nice: false }}
          indexScale={{ type: "band", round: true }}
          colors="var(--color-brand, #5bbee4)"
          padding={0.3}
          borderRadius={3}
          enableGridX={true}
          enableGridY={false}
          gridXValues={[0, 5, 10, 15, 20, 25]}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: [0, 5, 10, 15, 20, 25],
            format: (v) => `${v}`,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            renderTick,
          }}
          enableLabel={true}
          label={(d) => `${d.value}人`}
          labelTextColor="var(--color-text-primary, #222222)"
          labelSkipWidth={0}
          layers={[
            "grid",
            "axes",
            "bars",
            GovernmentResponsesAndDividersLayer,
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
