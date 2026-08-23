"use client";

import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const GenderWageGapChart = dynamic(
  () =>
    import(
      "./chart/GenderWageGapChart/GenderWageGapChart"
    ).then((mod) => mod.GenderWageGapChart),
  { ssr: false }
);

const SOURCE_LABEL = "賃金構造基本統計調査 結果の概況 付表1（厚生労働省）";
const SOURCE_URL = "https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2024/index.html";

export default function Page() {
  const article = articles.find(
    (a) => a.href === "/articles/gender-wage-gap"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="男女間賃金格差の変化（1976〜2024年）">
        <KPIPrimary
          value="1976年比 +16.2ポイント改善"
          caption="1976年の58.8から2024年の75.0へと格差が縮小（男性=100）"
        />
        <KPIGrid>
          <KPICard
            label="1976年（昭和51年）"
            value="58.8"
            caption="男性100に対する女性賃金比率"
          />
          <KPICard
            label="2000年（平成12年）"
            value="65.5"
            caption="2000年代初頭にかけて緩やかに上昇"
          />
          <KPICard
            label="2024年（令和6年）"
            value="75.0"
            caption="直近では75.0%水準を維持"
          />
          <KPICard
            label="1976→2024 改善幅"
            value="+16.2pt"
            caption="長期的には縮小傾向（比率が上昇）"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の労働市場における性別による賃金水準の開きを示す指標として、「<strong>男女間賃金格差</strong>（男性一般労働者の所定内給与額を100とした場合の女性の比率）」の推移が挙げられます。
        </p>
        <p>
          1976年（昭和51年）から2024年（令和6年）にかけての約半世紀のデータをたどると、1976年時点の58.8から2024年の75.0へと、長期的には格差が縮小傾向（比率が上昇）にあります。特に1990年代以降、勤続年数の伸長や女性の役職者比率の上昇、雇用機会均等法の改正や育児・介護休業制度の整備など、就労環境の変化が複合的に影響していると分析されています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="男女間賃金格差の推移"
          yearRange="（1976〜2024年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※2020年（令和2年）調査より、調査対象や推計方法の改定が行われています（令和元年データにおいて新旧基準比較の接続処理が実施されています）。"
        >
          <GenderWageGapChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          なお、2020年（令和2年）調査からは統計の精度向上や国際基準への整合等を目的に推計方法が改定されています。このため、令和元年（2019年）データには新旧比較用の参考数値（接続処理）が存在し、前後の数値を連続的に比較する際には推計方法変更の影響を考慮する必要があります。
        </p>
        <p>
          直近の傾向を見ると、2020年代に入ってからも75ポイント前後の水準を維持・緩やかに上昇しており、職種構成や役職階位の違い、短時間労働者の比率など多様な要因を背景に、格差縮小のペースや要因をめぐり多角的な議論が続けられています。
        </p>
        <p>
          <small style={{ color: "var(--color-text-muted, #888888)" }}>
            ※注: 男性一般労働者の所定内給与額を100とした女性の所定内給与額の比率。厚生労働省「賃金構造基本統計調査」の各年結果より作成。
          </small>
        </p>
      </ArticleText>
    </div>
  );
}
