import styles from "./PriceRankingTable.module.css";

export type PriceRankingItem = {
  name: string;
  base: number;
  latest: number;
  pct: number;
};

export type PriceRankingComparison = {
  baseYear: number;
  latestYear?: number;
  top20: PriceRankingItem[];
  bottom20: PriceRankingItem[];
  itemCount: number;
  negativeCount: number;
};

type Props = {
  data: PriceRankingComparison;
  title: string;
  latestYear?: number;
};

const numberFormatter = new Intl.NumberFormat("ja-JP", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("ja-JP");

const percentFormatter = new Intl.NumberFormat("ja-JP", {
  signDisplay: "always",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatIndex(value: number) {
  return numberFormatter.format(value);
}

function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`;
}

function RankingTable({
  items,
  label,
  baseYear,
  latestYear,
  showBaseColumn = true,
}: {
  items: PriceRankingItem[];
  label: string;
  baseYear: number;
  latestYear?: number;
  showBaseColumn?: boolean;
}) {
  return (
    <section className={styles.tableSection} aria-label={label}>
      <h3 className={styles.tableTitle}>{label}</h3>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">順位</th>
              <th scope="col">品目名</th>
              {showBaseColumn && <th scope="col">{baseYear}年指数</th>}
              <th scope="col">{latestYear ? `${latestYear}年指数` : "最新指数"}</th>
              <th scope="col">変化率（%）</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${label}-${item.name}`}>
                <td className={styles.rank}>{index + 1}</td>
                <th scope="row" className={styles.name}>{item.name}</th>
                {showBaseColumn && (
                  <td className={styles.value}>{formatIndex(item.base)}</td>
                )}
                <td className={styles.value}>{formatIndex(item.latest)}</td>
                <td className={`${styles.value} ${item.pct >= 0 ? styles.positive : styles.negative}`}>
                  {formatPercent(item.pct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export function PriceRankingTable({ data, title, latestYear }: Props) {
  const resolvedLatestYear = latestYear ?? data.latestYear;
  const allBaseAreHundred = data.top20.every((item) => item.base === 100) &&
    data.bottom20.every((item) => item.base === 100);

  return (
    <section className={styles.wrapper} aria-label={title}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.tables}>
        <RankingTable
          label="上昇トップ20"
          items={data.top20}
          baseYear={data.baseYear}
          latestYear={resolvedLatestYear}
          showBaseColumn={!allBaseAreHundred}
        />
        <RankingTable
          label="下降トップ20"
          items={data.bottom20}
          baseYear={data.baseYear}
          latestYear={resolvedLatestYear}
          showBaseColumn={!allBaseAreHundred}
        />
      </div>
      <p className={styles.note}>
        対象{integerFormatter.format(data.itemCount)}品目中、下降は
        {integerFormatter.format(data.negativeCount)}品目
      </p>
    </section>
  );
}