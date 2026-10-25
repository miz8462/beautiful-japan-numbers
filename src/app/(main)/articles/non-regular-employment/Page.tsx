import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { NonRegularEmploymentChart } from "./chart/NonRegularEmploymentChart/NonRegularEmploymentChart";
import styles from "./page.module.css";

const SOURCE_LABEL = "出典: 総務省統計局「労働力調査 詳細集計」";
const SOURCE_URL = "https://www.e-stat.go.jp/dbview?sid=0003006608";

export default function NonRegularEmploymentPage() {
  const article = articles.find(
    (a) => a.href === "/articles/non-regular-employment"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="非正規雇用比率の変化（2002〜2025年）">
        <KPIPrimary
          label="2002年比の上昇幅"
          value="+7.1 pt"
          caption="2002年の29.4%から2025年の36.5%へと拡大"
        />
        <KPIGrid>
          <KPICard
            label="2002年の比率"
            value="29.4%"
            caption="役員を除く雇用者数 4,940万人"
          />
          <KPICard
            label="過去最高ピーク (2019年)"
            value="38.3%"
            caption="非正規雇用者数 2,165万人"
          />
          <KPICard
            label="直近比率 (2025年)"
            value="36.5%"
            caption="ピークから -1.8ポイント"
          />
          <KPICard
            label="2002→2025 増加ポイント"
            value="+7.1pt"
            caption="2000年代を中心に上昇拡大"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の雇用者の約3人に1人は、パート・アルバイト・派遣社員・契約社員などの非正規雇用です。役員を除く雇用者に占める割合は、2002年の29.4%から2019年に38.3%と過去最高に達しました。2025年は36.5%で、ピークからは1.8ポイント低い水準です。        </p>
        <p>
          非正規雇用比率は、2002年から2019年までの17年間でおよそ9ポイント上昇しました。2002年の雇用者4,940万人のうち、非正規は約3割でした。ピークの2019年には非正規雇用者が2,165万人に達し、雇用者の4割弱を占めています。
        </p>
        <p>
          2020年代に入ると上昇は止まり、2025年は36.5%と、2019年から1.8ポイント下がりました。ただし、2002年と比べると7.1ポイント高く、水準そのものは20年以上前より高いままです。
        </p>
        <p>
          2002〜2025年の非正規雇用比率の推移です。リーマンショック期とコロナ拡大期に注目すると、景気の変動と雇用形態の関係が見えてきます。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="非正規雇用比率の推移"
          subtitle="2002年〜2025年（役員を除く雇用者全体に占める割合、単位: %）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <NonRegularEmploymentChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          比率が上昇した背景には、サービス業の拡大、高齢者の再雇用の広がり、女性の就業の増加があります。パートやアルバイトなど、短時間で働く形態が必要とされる職場が増え、働く側にもその形態を選ぶ人が増えました。        </p>
        <p>
          一方で、希望しながら正規の仕事に就けない人がいる点も、この数字の読み方として欠かせません。
        </p>
        <p>
          2019年以降に比率が下がった要因として、人手不足による正規雇用の採用拡大が指摘されています。2020年のコロナ拡大期には、飲食・宿泊などで非正規の雇い止めが相次ぎました。それでも2025年の比率は36.5%で、2002年の29.4%を7.1ポイント上回っています。
        </p>
      </ArticleText>
    </div>
  );
}
