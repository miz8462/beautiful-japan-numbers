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
            「エンゲル係数」とは、家計の支出全体のうち、食費が占める割合のことです。たとえば、1か月に30万円使って、そのうち9万円が食費なら、エンゲル係数は30%になります。
          </p>
          <p>
            一般に、収入が増えると食費以外(旅行や趣味、教育など)に使えるお金が増えるため、エンゲル係数は下がるといわれています。そのため、暮らしのゆとりを見る目安として使われてきました。
          </p>
          <p>
            総務省統計局の「家計調査」(二人以上の世帯)によると、日本のエンゲル係数は2000年に23.3%で、2000年代を通じておおむね23%台で安定していました。ところが2015年ごろから上がりはじめ、2025年には28.6%になりました。1か月に30万円使う家庭なら、食費は2000年の水準で約7万円、いまの水準では約8万6千円にあたります。
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
            家計の支出を費目(使いみち)ごとに分けて、それぞれの割合を見てみましょう。2025年は、食料費が28.6%、交通・通信費が14.5%で、この2つだけで全体の4割以上(43.1%)を占めています。
          </p>
          <p>
            一方で、被服及び履物（5.1%→3.1%一方、被服及び履物(衣服や靴など)は、2000年の5.1%から3.1%に下がりました。1か月30万円使う家庭なら、約1万5千円から約9千円になった計算です。教養娯楽やその他の支出も、長い目で見ると割合が小さくなっています。
          </p>
          <p>
            食費の割合が上がるなかで、衣服や娯楽のように「なくても暮らしていける」支出の割合は小さくなってきました。食料品の値上がりなどを受けて、こうした支出をおさえる家庭が増えている可能性があります。
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
      </div>
    </div>
  );
}
