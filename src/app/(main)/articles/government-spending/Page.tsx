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
      <KPISection title="国の一般会計予算（2024年度）">
        <KPIPrimary
          label="公債金（新規国債発行）"
          value="28.6兆円"
          caption="歳入全体の24.9%を借金で補填"
          valueColor="var(--color-data-negative)"
        />
        <KPIGrid>
          <KPICard
            label="一般会計 歳出総額"
            value="115.2兆円"
            caption="国家運営に必要な経費の全体像"
          />
          <KPICard
            label="国債費（借金返済）"
            value="28.2兆円"
            caption="歳出の24.5%"
            valueColor="var(--color-data-negative)"
          />
          <KPICard
            label="社会保障関係費（最大支出）"
            value="38.3兆円"
            caption="歳出の33.2%"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          日本の一般会計予算(2024年度)は<strong>115.2兆円</strong>にのぼります。
        </p>
        <p>
          歳入の柱は所得税・法人税・消費税などの税収で全体の4分の3を賄っていますが、それだけでは足りず<strong>4分の1を国の借金である「公債金」</strong>で賄っているのが現状です。 それではその115.2兆円は何に使われているのでしょう。
        </p>
      </ArticleText>

      {/* サンキーチャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="2024年度 一般会計の歳入と歳出の流れ"
          subtitle="（単位：兆円）"
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
          歳出は、高齢化に伴って増え続ける社会保障関係費が最大の割合を占めています。 年金・医療・介護などの給付に、全体の3分の1が充てられています。
        </p>
        <p>
          次いで大きいのが国債費です。これは過去に発行した借金の元本返済と利息の支払いに充てられる費用であり、借入れの「公債金」とほぼ同額の4分の1が、返済に当てられています。社会保障関係費と国債費そして防衛費を加えた3項目だけで、<strong>国の総支出の3分の2が事実上変更が難しい</strong>構造となっています。</p>
        <p>
          残りの予算が、地方自治体の財政を支援する「地方交付税交付金」、道路やインフラを整備する「公共事業関係費」、教育や研究を支える「文教及び科学振興費」などに配分されています。柔軟な政策を行えるのは実質予算の3分の1にすぎません。
        </p>
      </ArticleText>
    </div>
  );
}
