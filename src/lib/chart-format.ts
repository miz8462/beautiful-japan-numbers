/**
 * 西暦を下二桁の省略表記に変換する（例: 2002 → 02）
 * isFirst が true の場合はフル表記（例: 2002）を返す。
 * 軸の一番左（最初のtick）だけ基準として4桁表示する用途を想定。
 */
export function formatYearShort(year: number | string, isFirst = false): string {
  const str = String(year);
  return isFirst ? str : `${str.slice(-2)}`;
}