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

const FemaleManagerRatioChart = dynamic(
  () =>
    import(
      "./chart/FemaleManagerRatioChart/FemaleManagerRatioChart"
    ).then((mod) => mod.FemaleManagerRatioChart),
  { ssr: false }
);

const FemaleEmploymentMCurveChart = dynamic(
  () =>
    import(
      "./chart/FemaleEmploymentMCurveChart/FemaleEmploymentMCurveChart"
    ).then((mod) => mod.FemaleEmploymentMCurveChart),
  { ssr: false }
);

const FemaleMLCurveComparisonChart = dynamic(
  () =>
    import(
      "./chart/FemaleMLCurveComparisonChart/FemaleMLCurveComparisonChart"
    ).then((mod) => mod.FemaleMLCurveComparisonChart),
  { ssr: false }
);

const WAGE_GAP_SOURCE_LABEL = "賃金構造基本統計調査 結果の概況 付表1（厚生労働省）";
const WAGE_GAP_SOURCE_URL = "https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2024/index.html";

const MANAGER_RATIO_SOURCE_LABEL = "雇用均等基本調査（厚生労働省）";
const MANAGER_RATIO_SOURCE_URL = "https://www.mhlw.go.jp/toukei/list/71-r6.html";

const M_CURVE_SOURCE_LABEL = "労働力調査 基本集計（総務省統計局）";
const M_CURVE_SOURCE_URL = "https://www.e-stat.go.jp/dbview?sid=0002060049";

const L_CURVE_SOURCE_LABEL = "労働力調査 詳細集計（総務省統計局）";
const L_CURVE_SOURCE_URL = "https://www.e-stat.go.jp/dbview?sid=0003006608";

const ML_COMPARISON_SOURCE_LABEL = "労働力調査 基本集計・詳細集計（総務省統計局）";
const ML_COMPARISON_SOURCE_URL = "https://www.e-stat.go.jp/dbview?sid=0002060049";

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
          source={WAGE_GAP_SOURCE_LABEL}
          sourceUrl={WAGE_GAP_SOURCE_URL}
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

      <ArticleText>
        <h2>女性管理職比率の推移と構造的要因</h2>
        <p>
          男女間の賃金格差を生み出す主要な構造的要因の一つとして、企業内における「<strong>役職登用や昇進の男女差</strong>」が指摘されています。勤続年数の差や配置・キャリア形成の違いが役職者比率の差につながり、それが平均賃金全体の開きへと波及する相互関係が存在します。
        </p>
        <p>
          厚生労働省の「雇用均等基本調査」によると、2009年度から2024年度にかけて「課長相当職以上」および「係長相当職以上」の女性割合は緩やかな上昇傾向をたどっています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="役職別・女性管理職等割合の推移"
          yearRange="（2009〜2024年度）"
          source={MANAGER_RATIO_SOURCE_LABEL}
          sourceUrl={MANAGER_RATIO_SOURCE_URL}
          note="※企業規模30人以上の事業所を対象とした調査。一部年次（2010・2012・2014年度等）は調査が実施されていないか非公表のため、グラフ上では計測データ点を直線で接続しています。"
        >
          <FemaleManagerRatioChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          2024年度時点では、係長相当職以上の女性割合が20.2%に達する一方で、課長相当職以上は10.8%、部長相当職は7.1%にとどまっており、上位の役職ほど女性割合が低い傾向が見られます。
        </p>
        <p>
          管理職比率の向上は、将来的な賃金格差の縮小に向けた重要指標の一つとして位置づけられており、ワークライフバランスの推進やキャリア形成支援、評価・登用制度の見直しなど、多角的な取り組みが継続されています。
        </p>
      </ArticleText>

      <ArticleText>
        <h2>女性の年齢階級別就業率（M字カーブの経年変化）</h2>
        <p>
          2010年、2020年、2025年の年齢階級別就業率を比較すると、30代の就業率が大幅に上昇し、M字の「谷」が急速に浅くなっている（台形に近づいている）ことが確認できます。育児休業制度の定着や保育インフラの拡充、共働き世帯の増加などを背景に、ライフイベント期においても就業を継続する女性が増加しています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="女性の年齢階級別就業率の推移（M字カーブ）"
          yearRange="（2010・2020・2025年）"
          source={M_CURVE_SOURCE_LABEL}
          sourceUrl={M_CURVE_SOURCE_URL}
        >
          <FemaleEmploymentMCurveChart />
        </ArticleChart>
      </div>

        <ArticleText>
        <h2>就業率（M字）と正規雇用比率（L字）の構造的ギャップ</h2>
        <p>
          近年、女性の就業率におけるM字カーブの「谷」は浅くなり、30代を中心とする労働参加が進んでいます。しかし、同じ年齢階級で「正規雇用比率」のカーブを重ね合わせると、大きなギャップが見えてきます。
        </p>
        <p>
          就業率が高い30代以降の年代であっても、正規雇用比率は20代後半のピーク（74.1%）から年齢が上がるにつれて右肩下がりに低下していきます。つまり、就労している女性の割合自体は高まっているものの、その多くが非正規雇用での就業であることを示しており、「働く女性が増えているが、正規雇用としてのキャリア連続性は必ずしも保たれていない」という構造的な課題を浮き彫りにしています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="女性の年齢階級別 就業率と正規雇用比率の比較"
          yearRange="（2025年）"
          source={ML_COMPARISON_SOURCE_LABEL}
          sourceUrl={ML_COMPARISON_SOURCE_URL}
        >
          <FemaleMLCurveComparisonChart />
        </ArticleChart>
      </div>
    </div>
  );
}
