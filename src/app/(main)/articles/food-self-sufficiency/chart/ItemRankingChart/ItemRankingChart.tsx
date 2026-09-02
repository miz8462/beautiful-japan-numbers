"use client";

import { useMemo } from "react";
import itemDataRaw from "@/data/food-self-sufficiency-items.json";
import styles from "./ItemRankingChart.module.css";

export function ItemRankingChart() {
  const { top5, bottom5 } = useMemo(() => {
    // 降順ソート（自給率が高い順）
    const descSorted = [...itemDataRaw.items].sort((a, b) => b.value - a.value);
    // 昇順ソート（自給率が低い順）品目別食料自給率の比較
    const ascSorted = [...itemDataRaw.items].sort((a, b) => a.value - b.value);
    return {
      top5: descSorted.slice(0, 5),
      bottom5: ascSorted.slice(0, 5),
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%（2025年度概算値）</span>
      <div className={styles.tables}>
        {/* ベスト5 */}
        <div className={styles.tableSection}>
          <h3 className={styles.tableTitle}>自給率が高い品目（ベスト5）</h3>
          <table className={styles.table}>
            <tbody>
              {top5.map((item, index) => (
                <tr key={item.name}>
                  <td className={styles.rank}>{index + 1}</td>
                  <td className={styles.name}>{item.name}</td>
                  <td className={styles.value}>{item.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ワースト5 */}
        <div className={styles.tableSection}>
          <h3 className={styles.tableTitle}>自給率が低い品目（ワースト5）</h3>
          <table className={styles.table}>
            <tbody>
              {bottom5.map((item, index) => (
                <tr key={item.name}>
                  <td className={styles.rank}>{index + 1}</td>
                  <td className={styles.name}>{item.name}</td>
                  <td className={styles.value}>{item.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
