import type { LineCustomSvgLayerProps } from "@nivo/line";
import React from "react";

/**
 * 西暦を下二桁の省略表記に変換する（例: 2002 → 02）
 * isFirst が true の場合はフル表記（例: 2002）を返す。
 * 軸の一番左（最初のtick）だけ基準として4桁表示する用途を想定。
 */
export function formatYearShort(year: number | string, isFirst = false): string {
  const str = String(year);
  return isFirst ? str : `${str.slice(-2)}`;
}

export type AnnotationItem = {
  year: number;
  label: string;
  labelYOffset?: number;
};

/**
 * チャート上に年単位の注釈ラインとテキストを表示するカスタムレイヤーを生成する
 */
export function createAnnotationLayer(
  annotations: AnnotationItem[],
  isMobile = false
) {
  const AnnotationLayer = ({
    xScale,
    innerHeight,
  }: LineCustomSvgLayerProps<any>) => {
    return React.createElement(
      "g",
      null,
      annotations.map(({ year, label, labelYOffset = -8 }) => {
        const x = (xScale as (x: number) => number)(year);
        if (x === undefined || isNaN(x)) return null;

        return React.createElement(
          "g",
          { key: year },
          React.createElement("line", {
            x1: x,
            x2: x,
            y1: 0,
            y2: innerHeight,
            stroke: "#9ca3af",
            strokeDasharray: "4 3",
            strokeWidth: 1,
            opacity: 0.6,
          }),
          React.createElement(
            "text",
            {
              x: x,
              y: labelYOffset,
              fontSize: isMobile ? 9 : 11,
              fill: "#9ca3af",
              textAnchor: "middle",
              fontFamily: '"Noto Sans JP", "游ゴシック体", sans-serif',
            },
            label
          )
        );
      })
    );
  };
  AnnotationLayer.displayName = "AnnotationLayer";
  return AnnotationLayer;
}