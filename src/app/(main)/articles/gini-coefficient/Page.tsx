import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { GiniTrendChart } from "./chart/gini-trend/GiniTrendChart";
import { GiniImprovementChart } from "./chart/gini-improvement/GiniImprovementChart";
import styles from "./page.module.css";

export default function GiniCoefficientPage() {
  const article = articles.find((a) => a.href === "/articles/gini-coefficient");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />
      <div className={styles.charts}>
        <ArticleChart
          title="当初所得と再分配所得のジニ係数推移"
          yearRange="（1962〜2023）"
          intro={
            <>
              <p> ジニ係数とは、社会の中で、所得(収入)がどれくらい均等に分かれているかを表す指標です。
                0〜1の数字で表され、全員の所得が同じなら0、一人が独占していれば1に近づきます。
                0に近いほど格差が小さく、1に近いほど格差が大きい、という数字です。</p>
              <p>
                当初所得とは、税金や社会保険料を払う前の、給料や事業の儲けなど「働いて得たお金」の合計です。
                年金や医療費補助といった社会保障からの給付は含まれていません。
              </p>
              <p>
                再分配所得とは、当初所得から税金・社会保険料を差し引き、そこに年金・医療・介護・保育などの給付を加えたものです。
              </p>
            </>
          }
        >
          <GiniTrendChart />
        </ArticleChart>

        <ArticleChart
          title="所得再分配による改善度の推移"
          yearRange="（1962〜2023）"
          intro={
            <p>
              改善度とは、税金と社会保障の仕組みが、格差をどれだけ縮めたかを表したものです。<br />
              改善度(%) = (当初所得のジニ係数 − 再分配所得のジニ係数) ÷ 当初所得のジニ係数 × 100 <br />
              たとえば当初所得のジニ係数が0.50、再分配所得のジニ係数が0.35なら、改善度は(0.50−0.35)÷0.50×100=30% <br />
              税金と社会保障によって、格差が30%縮小したことを意味します。
              数字が大きいほど、再分配の仕組みが強く効いていることになります。
            </p>
          }
        >
          <GiniImprovementChart />
        </ArticleChart>
      </div>
    </div>
  );
}
