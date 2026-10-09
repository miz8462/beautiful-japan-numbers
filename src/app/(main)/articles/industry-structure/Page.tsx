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
            日本の経済(GDP=国内で1年間に生み出された価値の合計)のうち、モノをつくる「製造業」と、サービスを提供する「サービス業」では、どちらの割合が大きいでしょうか。
            戦後の高度経済成長期を経て、日本経済の中心は、モノづくりからサービスや情報の提供へと移ってきました。
          </p>
          <p>
            高度経済成長期の1970年には、製造業や建設業などの<strong>第2次産業</strong>が経済全体の43.1%を占めていました。それが2023年には28.1%まで下がっています。一方、教育、医療・福祉、情報通信、専門サービスなどを含む<strong>第3次産業</strong>は、50.9%から71.1%へと増え、いまでは日本経済の7割以上を占めています。          </p>
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
            直近約30年間(1994〜2023年)について16業種別に比べると、サービス経済化の中身がより具体的に見えてきます。
          </p>
          <p>
            構成比が最も大きく上昇したのは、<strong>専門・科学技術、業務支援サービス業</strong>です。4.5%から8.9%へと、+4.4ポイント上がりました。研究開発、法務・会計、広告、人材派遣などが含まれる分野です。次いで、<strong>保健衛生・社会事業</strong>(医療・福祉・介護など)が4.0%から7.9%へと+3.9ポイント上昇しました。少子高齢化によって、医療・介護の需要が高まったことが背景にあります。<strong>情報通信業</strong>も、+1.5ポイントの上昇です。          </p>
          <p>
            一方、<strong>製造業</strong>は23.6%から20.7%へ(-2.9ポイント)、<strong>建設業</strong>は7.9%から5.3%へ(-2.6ポイント)低下しました。ただし、製造業は低下後も、16業種の中で最大の構成比を保っています。          </p>
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
