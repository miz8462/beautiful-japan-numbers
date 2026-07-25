"use client";

import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const NationalDebtBalanceChart = dynamic(
  () =>
    import("./chart/NationalDebtBalanceChart/NationalDebtBalanceChart").then(
      (mod) => mod.NationalDebtBalanceChart
    ),
  { ssr: false }
);

const NationalDebtInterestRateChart = dynamic(
  () =>
    import(
      "./chart/NationalDebtInterestRateChart/NationalDebtInterestRateChart"
    ).then((mod) => mod.NationalDebtInterestRateChart),
  { ssr: false }
);

const SOURCE_LABEL =
  "財務省「国債発行額の推移（実績ベース）」・「普通国債の利率加重平均の各年ごとの推移」";
const SOURCE_URL = "https://www.mof.go.jp/jgbs/reference/national_debt/index.htm";

export default function NationalDebtTrendPage() {
  const article = articles.find(
    (a) => a.href === "/articles/national-debt-trend"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <div className={styles.statHeadline}>
        <p className={styles.statFinding}>
          普通国債残高は1,140兆円超、対GDP比は165%に
        </p>
      </div>

      <ArticleText>
        <p>
          ここで扱う<strong>「普通国債」</strong>とは、国が発行する借入証券のうち、
          建設国債・特例国債・復興債などを合わせた残高です。
          政府全体の借入金（国債・借入金・政府関係機関債など）すべてを指すわけではなく、
          財務省が公表する普通国債残高に限定した指標です。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="普通国債残高の推移"
          yearRange="（1965〜2026年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※左軸は普通国債残高（兆円）、右軸は対GDP比（%）。2026年度は見込みを含む。"
        >
          <NationalDebtBalanceChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          1960年代後半までは普通国債残高はGDP比でも数パーセント台にとどまっていましたが、
          1973年度の第一次石油危機以降、景気対策と歳出拡大に伴い増加ペースが上がり始めます。
          1980年代のバブル期には対GDP比が一時的に横ばいから緩やかな低下に転じましたが、
          1991年度のバブル崩壊後は税収の伸び悩みと社会保障費の増加を背景に、残高と対GDP比の双方が再び急拡大しました。
        </p>
        <p>
          2008年度のリーマンショックでは景気対策国債の発行が増え、2010年代も高い水準が続きました。
          2020年度のコロナ対応でさらに一時的に対GDP比が170%台まで上昇。
          2026年度（見込み）の普通国債残高は約1,145兆円、対GDP比は165.5%と、
          いずれも過去最高水準の一角を占めています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="普通国債の利率加重平均の推移"
          yearRange="（1975〜2025年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <NationalDebtInterestRateChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          普通国債の利率加重平均は、1975年度の7.43%をピークに長期間で低下し続け、
          2022年度には0.76%まで下がりました。その後2年間で0.98%（2025年度）まで反転上昇しています。
        </p>
        <p>
          残高そのものは半世紀以上にわたって増え続けている一方で、
          借入コストを左右する金利が大幅に下がったことが、国債利払い費の伸びを抑える要因のひとつになってきました。
          直近の金利上昇が今後の財政運営にどう効いてくるかが、残高の推移とあわせて注目点です。
        </p>
      </ArticleText>
    </div>
  );
}
