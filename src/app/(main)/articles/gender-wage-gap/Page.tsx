import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { FemaleEmploymentMCurveChart } from "./chart/FemaleEmploymentMCurveChart/FemaleEmploymentMCurveChart";
import { FemaleManagerRatioChart } from "./chart/FemaleManagerRatioChart/FemaleManagerRatioChart";
import { FemaleMLCurveComparisonChart } from "./chart/FemaleMLCurveComparisonChart/FemaleMLCurveComparisonChart";
import { GenderWageGapChart } from "./chart/GenderWageGapChart/GenderWageGapChart";
import styles from "./page.module.css";

const WAGE_GAP_SOURCE_LABEL = "厚生労働省「賃金構造基本統計調査」";
const WAGE_GAP_SOURCE_URL = "https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2024/index.html";

const MANAGER_RATIO_SOURCE_LABEL = "厚生労働省「雇用均等基本調査」";
const MANAGER_RATIO_SOURCE_URL = "https://www.mhlw.go.jp/toukei/list/71-r6.html";

const M_CURVE_SOURCE_LABEL = "総務省統計局「労働力調査 基本集計」";
const M_CURVE_SOURCE_URL = "https://www.e-stat.go.jp/dbview?sid=0002060049";

const ML_COMPARISON_SOURCE_LABEL = "総務省統計局「労働力調査 基本集計・詳細集計」";
const ML_COMPARISON_SOURCE_URL = "https://www.e-stat.go.jp/dbview?sid=0002060049";

export default function GenderWageGapPage() {
  const article = articles.find(
    (a) => a.href === "/articles/gender-wage-gap"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="男女間賃金格差の変化（1976〜2024年）">
        <KPIPrimary
          label="賃金格差の改善（男性=100）"
          value="+16.2 pt"
          caption="1976年の58.8から2024年の75.0へと格差が縮小"
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
          日本の女性は働きやすくなったのか
        </p>
        <p>
          答えは「入口は広がった。でも、奥は狭いまま」。
        </p>
        <p>
          男性を100とすると、女性の賃金は1976年の58.8から2024年の75.0へ。48年で16.2ポイント縮まりました。
          しかし、いまだ25％もの差があります。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="男女間賃金格差の推移"
          subtitle="1976年〜2024年（男性一般労働者=100とした女性の比率）"
          source={WAGE_GAP_SOURCE_LABEL}
          sourceUrl={WAGE_GAP_SOURCE_URL}
          note="※2020年（令和2年）調査より、調査対象や推計方法の改定が行われています（令和元年データにおいて新旧基準比較の接続処理が実施されています）。"
        >
          <GenderWageGapChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          男性が100円稼ぐとき、女性は58.8円。1976年の数字です。2024年には75.0円まで来ました。
        </p>
        <p>
          48年かけて、16.2ポイントの前進。着実に縮まってはいるものの、4分の1の差はなお残ります。
        </p>
        <p>
          背景にあるのは、勤続年数の伸びと女性の役職者の増加、雇用機会均等法の改正、育児・介護休業制度の整備。複数の変化が、少しずつ差を削ってきました。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="役職別・女性管理職等割合の推移"
          subtitle="2009年度〜2024年度（単位: %）"
          source={MANAGER_RATIO_SOURCE_LABEL}
          sourceUrl={MANAGER_RATIO_SOURCE_URL}
          note="※企業規模30人以上の事業所を対象とした調査。一部年次は調査が実施されていないか非公表のため直線接続しています。"
        >
          <FemaleManagerRatioChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          賃金の差は、どこから生まれるのか。有力な答えのひとつが「役職」です。
        </p>
        <p>
          2024年度、係長相当職以上の女性割合は20.2%。課長相当職以上は10.8%。部長相当職は7.1%。階段を上るほど、女性は少なくなります。
        </p>
        <p>
          2009年度から2024年度にかけて、どの階層も上昇基調。ただし、上へ行くほど壁は厚いままです。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="女性の年齢階級別就業率の推移（M字カーブ）"
          subtitle="2010年・2020年・2025年（単位: %）"
          source={M_CURVE_SOURCE_LABEL}
          sourceUrl={M_CURVE_SOURCE_URL}
        >
          <FemaleEmploymentMCurveChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          かつて、30代で谷を作っていた女性の就業率。2010年、2020年、2025年と並べると、その谷が年々浅くなり、グラフは台形に近づいています。
        </p>
        <p>
          育児休業の定着、保育の拡充、共働き世帯の増加。「結婚・出産で仕事を離れる」が当たり前だった時代は、確実に遠のいています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="女性の年齢階級別 就業率と正規雇用比率の比較"
          subtitle="2025年（単位: %）"
          source={ML_COMPARISON_SOURCE_LABEL}
          sourceUrl={ML_COMPARISON_SOURCE_URL}
        >
          <FemaleMLCurveComparisonChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          ここで、もう1本の線を重ねてみます。正規雇用比率です。
        </p>
        <p>
          就業率が高いはずの30代以降で、正規雇用比率は20代後半のピーク74.1%から、右肩下がりに低下していきます。M字の谷は埋まった。けれど、その裏でL字が現れています。
        </p>
        <p>
          「働く女性が増えた」と「キャリアが続く女性が増えた」は、同じではありません。
        </p>
      </ArticleText>

    </div>
  );
}
