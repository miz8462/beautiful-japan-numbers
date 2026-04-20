// 入力データの値を、Sankey上で使う短い日本語表記に寄せる。
export function formatNodeValue(value: number | undefined): string {
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1,
  }).format(value ?? 0);
}

export function formatNodePercent(value: number | undefined, total: number | undefined): string {
  if (!value || !total) return "0%";

  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1,
  }).format((value / total) * 100) + "%";
}
