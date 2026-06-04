// 入力データは百万円。Sankey上では万/億/兆で短く表示する。
export function formatNodeValue(value: number | undefined): string {
  const millionYen = value ?? 0;
  const absoluteValue = Math.abs(millionYen);
  const unit = absoluteValue >= 1_000_000 ? "兆" : absoluteValue >= 1_000 ? "億" : "万";
  const displayValue = unit === "兆"
    ? millionYen / 1_000_000
    : unit === "億"
      ? millionYen / 100
      : millionYen * 100;

  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: displayValue >= 100 ? 1 : 2,
  }).format(displayValue) + unit;
}

export function formatNodePercent(value: number | undefined, total: number | undefined): string {
  if (!value || !total) return "0%";

  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1,
  }).format((value / total) * 100) + "%";
}
