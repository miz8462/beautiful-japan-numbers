import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import governmentSpendingData from "@/data/government-spending.json";
import SankeyChart, { type GovernmentSpendingData } from "./SankeyChart";
import styles from "./page.module.css";

const SOURCE_LABEL = "財務省「予算・決算 統計表一覧（令和6年度一般会計予算）」";
const SOURCE_URL = "https://www.mof.go.jp/policy/budget/reference/statistics/data.htm";

export default function GovernmentSpendingPage() {
  const data = governmentSpendingData as GovernmentSpendingData;

  const article = articles.find((a) => a.href === "/articles/government-spending");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="国の一般会計予算の規模（2024年度）">
        <KPIPrimary
          label="一般会計 歳出総額"
          value="115.2兆円"
          caption="国家運営に必要な経費の全体像"
        />
        <KPIGrid>
          <KPICard
            label="社会保障関係費"
            value="38.3兆円"
            caption="歳出の33.2%（最大の支出項目）"
          />
          <KPICard
            label="国債費（元利払い）"
            value="28.2兆円"
            caption="歳出の24.5%（過去の借金返済）"
          />
          <KPICard
            label="税収（租税及び印紙）"
            value="77.8兆円"
            caption="歳入全体の67.6%"
          />
          <KPICard
            label="公債金（新規国債発行）"
            value="28.6兆円"
            caption="歳入全体の24.9%を借金で補填"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          私たちが納めている税金や社会保障の負担金は、国全体でどのように集められ、どこへ使われているのでしょうか。
          2024（令和6）年度の国の一般会計予算は<strong>115.2兆円</strong>にのぼります。
        </p>
        <p>
          歳入（収入）の柱は所得税・法人税・消費税などの「税収（77.8兆円）」ですが、それだけでは足りず、<strong>28.6兆円（全体の約4分の1）を国の借金である「公債金（国債発行）」で賄っている</strong>のが現状です。
          集まった資金がどのように各政策分野へと配分されていくのか、その資金の流れ（フロー）を可視化しました。
        </p>
      </ArticleText>

      {/* サンキーチャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="2024年度 一般会計の歳入と歳出の流れ"
          subtitle="一般会計予算ベースの構造（単位：兆円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          intro={
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
              <a
                href="/articles/government-spending/fullscreen"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: "var(--color-brand-dark, #1e7aa8)", textDecoration: "underline" }}
              >
                全画面でダイアグラムを表示 ↗
              </a>
            </div>
          }
        >
          <div className={styles.chartBand}>
            <SankeyChart data={data} />
          </div>
        </ArticleChart>
      </div>

      {/* 詳細解説 */}
      <ArticleText>
        <p>
          歳出（使い道）の内訳を見ると、高齢化に伴って増え続ける<strong>社会保障関係費（38.3兆円、33.2%）</strong>が最大の割合を占めています。
          年金・医療・介護などの給付を維持するために、国の予算の3分の1が充てられています。
        </p>
        <p>
          次いで大きいのが<strong>国債費（28.2兆円、24.5%）</strong>です。これは過去に発行した借金の元本返済と利息の支払いに充てられる費用であり、社会保障関係費と国債費の2項目だけで、国の総支出の<strong>半分以上（57.7%）</strong>が固定的に使われる構造となっています。
        </p>
        <p>
          残りの予算が、地方自治体の財政を支援する「地方交付税交付金（18.7兆円）」、国の防衛体制を整える「防衛関係費（8.7兆円）」、道路やインフラを整備する「公共事業関係費（6.1兆円）」、教育や研究を支える「文教及び科学振興費（5.7兆円）」などに配分されています。
        </p>
        <p>
          税収の伸びや新たな政策課題に対して、限られた国家財政をどのように配分し、将来世代への負担とどうバランスを取っていくのか、数字が示す構造的な現実を把握することが重要です。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
