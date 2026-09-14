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
import { EngelCoefficientChart } from "./charts/EngelCoefficient/EngelCoefficientChart";
import { ExpenditureShareChart } from "./charts/ExpenditureShare/ExpenditureShareChart";
import styles from "./page.module.css";

export default function ConsumptionStructurePage() {
  const article = articles.find(
    (a) => a.href === "/articles/consumption-structure"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="家計消費支出とエンゲル係数の現在地">
        <KPIPrimary
          label="2025年のエンゲル係数（食料費割合）"
          value="28.6%"
          caption="2000年（23.3%）から+5.3ポイント上昇"
        />
        <KPIGrid>
          <KPICard
            label="月間消費支出合計"
            value="31.4万円"
            caption="2人以上世帯の1か月平均"
          />
          <KPICard
            label="食料費の月額支出"
            value="8.98万円"
            caption="支出全体の28.6%を占める"
          />
          <KPICard
            label="交通・通信費の月額支出"
            value="4.56万円"
            caption="支出全体の14.5%（第2位）"
          />
          <KPICard
            label="被服・履物のシェア変化"
            value="3.1%"
            caption="2000年（5.1%）から縮小"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            家計の消費支出に占める食料費の割合を示す「エンゲル係数」は、生活のゆとり度合いを測る代表的な経済指標の一つです。一般に所得が高くなるほど必需品である食費の比率は下がり、娯楽や文化など選択的支出の比率が高まるとされています。
          </p>
          <p>
            総務省統計局の「家計調査」（二人以上の世帯）によると、日本のエンゲル係数は2000年代を通じて23%台前後で安定して推移していました。しかし、2015年頃から明確な上昇トレンドへ転じ、2025年には28.6%に達しました。
          </p>
        </ArticleText>

        <ArticleChart
          title="エンゲル係数（食料費割合）の推移"
          subtitle="2000年〜2025年（二人以上の世帯、単位: %）"
          source="総務省統計局「家計調査」家計収支編"
          sourceUrl="https://www.stat.go.jp/data/kakei/longtime/index.html"
        >
          <EngelCoefficientChart />
        </ArticleChart>

        <ArticleText>
          <p>
            家計支出の内訳（費目別シェア）の変化をみると、食料費（28.6%）とスマートフォン普及等に伴う交通・通信費（14.5%）の2大費目で全体の4割以上を占めるようになっています。
          </p>
          <p>
            一方で、被服及び履物（5.1%→3.1%）や教養娯楽・その他の支出は長期的に抑制傾向にあり、生活必需品価格の上昇に伴い選択的支出を切り詰める家計の防衛的な消費行動が数字から読み取れます。
          </p>
        </ArticleText>

        <ArticleChart
          title="消費支出の費目別シェアの推移"
          subtitle="2000年〜2025年（二人以上の世帯、用途分類ベース）"
          source="総務省統計局「家計調査」家計収支編"
          sourceUrl="https://www.stat.go.jp/data/kakei/longtime/index.html"
        >
          <ExpenditureShareChart />
        </ArticleChart>

        <ArticleSource
          label="出典: 総務省統計局「家計調査」家計収支編 二人以上の世帯 用途分類"
          href="https://www.stat.go.jp/data/kakei/longtime/index.html"
        />
      </div>
    </div>
  );
}
