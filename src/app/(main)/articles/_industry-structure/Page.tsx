import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import {
  KPICard,
  KPIGrid,
  KPIPrimary,
  KPISection,
} from "@/components/kpi";
import { IndustryStructureDetailChart } from "./charts/IndustryStructureDetailChart/IndustryStructureDetailChart";
import { IndustryStructureLongChart } from "./charts/IndustryStructureLongChart/IndustryStructureLongChart";
import styles from "./page.module.css";

export default function IndustryStructurePage() {
  const article = articles.find(
    (a) => a.href === "/articles/industry-structure"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="産業構造のサービス経済化（主要指標）">
        <KPIPrimary
          label="2023年の第3次産業（サービス等）比率"
          value="71.1%"
          caption="1970年（50.9%）から+20.2ポイント拡大"
        />
        <KPIGrid>
          <KPICard
            label="第2次産業（製造業・建設業等）"
            value="28.1%"
            caption="1970年（43.1%）から縮小"
          />
          <KPICard
            label="第1次産業（農林水産業）"
            value="0.9%"
            caption="1970年（6.0%）から減少"
          />
          <KPICard
            label="医療・福祉のシェア拡大"
            value="+3.9pt"
            caption="1994年 4.0% → 2023年 7.9%"
          />
          <KPICard
            label="製造業のシェア変化"
            value="-2.9pt"
            caption="1994年 23.6% → 2023年 20.7%"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            日本のGDP（国内総生産）のうち、モノを作る製造業などの「工業」と、サービスを提供する「サービス業」、どちらの規模が大きいでしょうか。
            戦後の高度経済成長期を経て、社会が成熟するにつれて経済の主役はモノづくりからサービスや情報の提供へとシフトしてきました。
          </p>
          <p>
            高度経済成長期の1970年時点では、製造業や建設業などの第2次産業が全体の43.1%を占めていましたが、2023年には28.1%まで低下しました。一方で、情報通信や医療・福祉・専門サービス等を含む第3次産業は50.9%から71.1%へと拡大し、日本経済の7割以上を占めるようになっています。
          </p>
        </ArticleText>

        <ArticleChart
          title="産業別構成比の推移（3大産業）"
          subtitle="1970年〜2023年（名目GDPに占める構成比、単位: %）"
          source="内閣府「国民経済計算年次推計」"
          sourceUrl="https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html"
        >
          <IndustryStructureLongChart />
        </ArticleChart>

        <ArticleText>
          <p>
            直近約30年間の16業種別データ（1994年〜2023年）を比較すると、「サービス経済化」の具体的な中身がより鮮明に見えてきます。
          </p>
          <p>
            最も大きくシェアを伸ばしたのは少子高齢化を背景とする<strong>保健衛生・社会事業（医療・福祉・介護など）</strong>で、4.0%から7.9%へと倍増（+3.9ポイント）しました。また、IT化に伴う<strong>情報通信業</strong>（+1.5ポイント）や、コンサルティング等の<strong>専門・科学技術、業務支援サービス業</strong>（+4.4ポイント）が成長を牽引しています。
          </p>
          <p>
            一方で、<strong>製造業</strong>は23.6%から20.7%へ（-2.9ポイント）、<strong>建設業</strong>は7.9%から5.3%へ（-2.6ポイント）それぞれシェアを縮小させています。
          </p>
        </ArticleText>

        <ArticleChart
          title="業種別構成比の変化（16業種）"
          subtitle="1994年 vs 2023年（名目GDPに占める構成比、単位: %）"
          source="内閣府「国民経済計算年次推計」"
          sourceUrl="https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html"
        >
          <IndustryStructureDetailChart />
        </ArticleChart>

        <ArticleSource
          label="出典: 内閣府「国民経済計算年次推計」"
          href="https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html"
        />
      </div>
    </div>
  );
}
