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
            この記事で「倒産」とは、負債総額1,000万円以上の企業が、事業を続けられなくなった件数を指します。裁判所を通じて債務を整理する「法的整理」（破産・民事再生など）と、債権者との話し合いで整理する「私的整理」（銀行取引停止処分など）の両方を含みます。集計は東京商工リサーチ（TSR）の基準によるもので、負債1,000万円未満の小規模なものや、経営者の判断による廃業・休業は含まれません。          </p>
          <p>
            戦後70年余りの推移を見ると、倒産は経済の大きな転換点で増えてきました。1964年東京五輪後の反動不況、1970年代のオイルショック、1990年代のバブル崩壊後の金融危機が代表的です。下のグラフに、その波が表れています。
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
            2020年に新型コロナウイルスが広がると、実質無利子・無担保の「ゼロゼロ融資」や各種給付金など、手厚い支援が行われました。その結果、2021年の倒産件数は6,030件にとどまり、1965年以降60年間で最少となりました。
          </p>
          <p>
            流れが変わったのは2022年以降です。支援の終了で借入金の返済が本格化し、原材料・エネルギー価格の高騰や人手不足も重なりました。倒産は4年連続で増え、2025年には10,300件と、12年ぶりに1万件を超えました。
          </p>
          <p>
            中でも急増しているのが「人手不足倒産」です。2025年は397件で、過去最多でした。要因別に見ると、賃上げ競争による「人件費高騰」が152件、キーパーソンの退職による「従業員退職」が110件で、2つを合わせると全体の約3分の2を占めます。人手に頼る中小企業ほど、事業を続けにくくなっている状況がうかがえます。
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
      </div>
    </div>
  );
}
