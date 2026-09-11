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
          caption="1990年（49.2万円）を下回る水準（-2.0%）"
        />
        <KPIGrid>
          <KPICard
            label="名目実収入（額面給与等）"
            value="63.6万円"
            caption="1990年（52.2万円）から約11.4万円増"
          />
          <KPICard
            label="名目可処分所得（手取り）"
            value="52.3万円"
            caption="1990年（44.1万円）から約8.2万円増"
          />
          <KPICard
            label="非消費支出（税・社会保険料）"
            value="11.4万円/月"
            caption="1990年の8.1万円から約1.4倍"
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
          「給料の額面は増えているのに、手取りが増えた実感が湧かない」「買い物をすると物価高で家計が苦しい」――この実感はデータとしてどのように裏付けられるのでしょうか。
        </p>
        <p>
          総務省「家計調査」の勤労者世帯データを1990年から2024年まで追跡し、額面収入から税金や社会保険料を差し引いた「手取り（可処分所得）」の名目値と、物価変動の影響を取り除いた「実質可処分所得」の35年間の変遷を検証します。
        </p>
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
          名目の実収入（額面）は、1990年の月額52.2万円から2024年には63.6万円へと約11.4万円増加しました。
          しかし、手取りである可処分所得の伸びは44.1万円から52.3万円（約8.2万円増）にとどまります。
        </p>
        <p>
          その差額を生み出しているのが、給与から天引きされる「非消費支出（直接税＋社会保険料）」の拡大です。
        </p>
      </ArticleText>

      {/* チャート2: 名目 vs 実質可処分所得 */}
      <div className={styles.charts}>
        <ArticleChart
          title="可処分所得の名目・実質比較（物価上昇による購買力変化）"
          subtitle="1990〜2024年（2020年基準実質値・単位：円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <DisposableIncomeRealVsNominalChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          物価変動（総合消費者物価指数）を加味した「実質可処分所得」を比較すると、さらに厳しい現実が浮き彫りになります。
        </p>
        <p>
          バブル期の1990年における実質手取り（2020年価格換算）は月額<strong>49.2万円</strong>でした。
          その後、1997年（50.9万円）をピークに長期下落し、近年の物価高も重なって2024年は<strong>48.2万円（1990年比で -2.0%）</strong>と、30年以上前の水準を下回ったままです。
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
          実収入に占める非消費支出（所得税・住民税・年金・健康保険料など）の負担率は、1990年の<strong>15.6%から2022〜2024年には18%前後（月額約11.4〜11.7万円）</strong>へと上昇しました。
        </p>
        <p>
          額面給与の上昇、税・社会保険料の天引き増、そして急速なインフレによる実質購買力の目減り。
          この「三重の力学」を直視することが、家計の実質的な豊かさを議論する上での出発点となります。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
