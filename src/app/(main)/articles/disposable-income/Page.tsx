import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { DisposableIncomeRealVsNominalChart } from "./charts/DisposableIncomeRealVsNominal/DisposableIncomeRealVsNominalChart";
import { NonConsumptionBurdenRateChart } from "./charts/NonconsumptionBurdenRate/NonConsumptionBurdenRateChart";
import IncomeChart from "./charts/IncomeChart";
import styles from "./page.module.css";

const SOURCE_LABEL = "総務省統計局「家計調査（二人以上の世帯のうち勤労者世帯）」・「消費者物価指数」";
const SOURCE_URL = "https://www.stat.go.jp/data/kakei/longtime/index.html";

export default function DisposableIncomePage() {
  const article = articles.find((a) => a.href === "/articles/disposable-income");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="勤労者世帯の可処分所得と負担率（2024年平均・月額）">
        <KPIPrimary
          label="実質可処分所得（2020年基準）"
          value="48.2万円"
          caption="1989年（48.5万円）を下回る水準（-0.6%）"
        />
        <KPIGrid>
          <KPICard
            label="名目実収入（額面給与等）"
            value="63.6万円"
            caption="1989年（49.6万円）から約14万円増"
          />
          <KPICard
            label="名目可処分所得（手取り）"
            value="52.3万円"
            caption="1989年（44.2万円）から約8万円増"
          />
          <KPICard
            label="非消費支出（税・社会保険料）"
            value="11.4万円/月"
            caption="1989年（8.1万円）から約1.4倍"
          />
          <KPICard
            label="非消費支出 負担率"
            value="17.9%"
            caption="実収入に占める税・社保の割合"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          「給料の額面は増えたはずなのに、手取りは増えた気がしない」「買い物のたびに、物価高で家計が苦しいと感じる」。こうした実感は、データで確かめられるのでしょうか。
        </p>
        <p>
          この記事では、総務省「家計調査」の勤労者世帯のデータを使い、1989年から2024年までの35年間をたどります。見るのは、額面の収入から税金や社会保険料を引いた「手取り(可処分所得)」です。さらに、物価が上がった分を取り除き、実際に買えるものの量に直した「実質可処分所得」も、あわせて追います。        </p>
      </ArticleText>

      {/* チャート1: 実収入と手取りの推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="勤労者世帯の実収入・可処分所得・消費支出の推移"
          subtitle="1989〜2024年（1世帯当たり1か月平均・単位：円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <IncomeChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          名目の実収入（額面）は、1989年の月額49.6万円から2024年には63.6万円へと約14.0万円増加しました。
          しかし、手取りである可処分所得の伸びは42.1万円から52.3万円（約10.2万円増）にとどまります。
        </p>
        <p>
          その差額を生み出しているのが、給与から天引きされる「非消費支出（直接税＋社会保険料）」の拡大です。
        </p>
      </ArticleText>

      {/* チャート2: 名目 vs 実質可処分所得 */}
      <div className={styles.charts}>
        <ArticleChart
          title="可処分所得の名目・実質比較（物価上昇による購買力変化）"
          subtitle="1989〜2024年（2020年基準実質値・単位：円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <DisposableIncomeRealVsNominalChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          物価の上昇分を取り除いた「実質可処分所得」で見ると、状況はさらに厳しく見えます。
        </p>
        <p>
          バブル期の1989年は、2020年の物価に換算して月<strong>48.5万円</strong>でした。
          その後は1997年の50.9万円をピークに、長く下がり続けます。
          近年の物価高も重なり、2024年は<strong>48.2万円</strong>と、1989年より0.6%低い水準です。
          手取りで買えるものの量は、35年前に戻れていません。
        </p>
      </ArticleText>

      {/* チャート3: 非消費支出負担率 */}
      <div className={styles.charts}>
        <ArticleChart
          title="非消費支出（税・社会保険料）の実収入比率の推移"
          subtitle="1989〜2024年（単位：%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <NonConsumptionBurdenRateChart />
        </ArticleChart>
      </div>

      {/* まとめ解説 */}
      <ArticleText>
        <p>
          実収入に対して、税金や社会保険料(所得税・住民税・年金・健康保険料など)が占める割合は、1989年の<strong>15.0%から、2022〜2024年には約18%へと上がりました。月額にすると、約11.4〜11.7万円</strong>です。
        </p>
        <p>
          額面の収入は増えました。
          しかし、そこから天引きされる税金と社会保険料も増え、さらに物価の上昇で、お金で買える量が目減りしました。
          この3つが重なっていることが、手取りが増えた実感を持ちにくい理由です。
          家計の豊かさを考えるときは、まずここから出発することになります。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
