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
import { BankruptcyCausesChart } from "./chart/BankruptcyCausesChart/BankruptcyCausesChart";
import { BankruptcyTrendChart } from "./chart/BankruptcyTrendChart/BankruptcyTrendChart";
import styles from "./page.module.css";

export default function BankruptcyTrendPage() {
  const article = articles.find(
    (a) => a.href === "/articles/bankruptcy-trend"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="企業倒産の現在地と動向（2025年）">
        <KPIPrimary
          label="2025年の企業倒産件数"
          value="10,300件"
          caption="2013年以来12年ぶりに1万件台へ到達"
        />
        <KPIGrid>
          <KPICard
            label="人手不足倒産（2025年）"
            value="397件"
            caption="過去最多を更新（前年比+26.8%）"
          />
          <KPICard
            label="人件費高騰による倒産"
            value="152件"
            caption="人手不足倒産の約38%を占める"
          />
          <KPICard
            label="コロナ禍の最少期（2021年）"
            value="6,030件"
            caption="ゼロゼロ融資等の公的支援期"
          />
          <KPICard
            label="過去最多記録（1984年）"
            value="20,841件"
            caption="オイルショック後・構造不況期"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            ここで集計する「倒産」とは、<strong>負債総額1,000万円以上</strong>の企業が、裁判所を通じた法的整理（破産・民事再生など）または債権者との合意による私的整理（銀行取引停止処分など）に至った件数です。東京商工リサーチ（TSR）の基準に基づき集計されており、小規模廃業や休業は含まれません。
          </p>
          <p>
            戦後から現在までの70年余りの推移をたどると、1964年東京五輪後の反動不況や1970年代のオイルショック、1990年代バブル崩壊後の金融危機など、経済構造の転換期ごとに倒産の波が押し寄せてきた歴史が分かります。
          </p>
        </ArticleText>

        <ArticleChart
          title="企業倒産件数の長期推移"
          subtitle="1952年〜2025年（負債1,000万円以上、単位: 件）"
          source="東京商工リサーチ"
          sourceUrl="https://www.tsr-net.co.jp/"
        >
          <BankruptcyTrendChart />
        </ArticleChart>

        <ArticleText>
          <p>
            2020年のコロナ禍においては、実質無利子・無担保の「ゼロゼロ融資」や各種給付金などの手厚い政策支援により、2021年には6,030件と統計開始以来の最少を記録しました。
          </p>
          <p>
            しかし、2022年以降は支援終了に伴う借入金返済の本格化、原材料・エネルギー価格の高騰、人手不足が重なり、4年連続で倒産が増加。2025年には10,300件と12年ぶりに1万件を突破しました。
          </p>
          <p>
            特に近年顕著なのが「人手不足倒産」の急増です。2025年には過去最多の397件に達し、その内訳では賃上げ競争による「人件費高騰」（152件）とキーパーソン離脱による「従業員退職」（110件）が全体の過半を占め、労働集約型の中小企業における事業継続の課題が浮き彫りとなっています。
          </p>
        </ArticleText>

        <ArticleChart
          title="「人手不足」倒産の要因別推移"
          subtitle="2019年・2021年〜2025年（単位: 件）"
          source="東京商工リサーチ"
          sourceUrl="https://www.tsr-net.co.jp/"
        >
          <BankruptcyCausesChart />
        </ArticleChart>

        <ArticleSource
          label="出典: 東京商工リサーチ「全国企業倒産状況」"
          href="https://www.tsr-net.co.jp/"
        />
      </div>
    </div>
  );
}
