"use client";

import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

// ResizeObserver を伴うチャートは SSR 無効で動的インポート
const BankruptcyTrendChart = dynamic(
  () =>
    import("./chart/BankruptcyTrendChart/BankruptcyTrendChart").then(
      (mod) => mod.BankruptcyTrendChart
    ),
  { ssr: false }
);

const BankruptcyCausesChart = dynamic(
  () =>
    import("./chart/BankruptcyCausesChart/BankruptcyCausesChart").then(
      (mod) => mod.BankruptcyCausesChart
    ),
  { ssr: false }
);

// ─── 出典情報 ────────────────────────────────────────────────────
const SOURCE_LABEL = "東京商工リサーチ";
const SOURCE_URL = "https://www.tsr-net.co.jp/";

export default function BankruptcyTrendPage() {
  const article = articles.find((a) => a.href === "/articles/bankruptcy-trend");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />


      {/* ①  Stat Headline */}
      <div className={styles.statHeadline}>
        <p className={styles.statFinding}>
          2025年の企業倒産件数は10,300件、2013年以来の水準に
        </p>
      </div>

      {/* ② ArticleIntro: 「倒産」の定義 */}
      <ArticleText>
        <p>
          ここで集計する「倒産」とは、<strong>負債総額1,000万円以上</strong>の企業が、
          裁判所を通じた破産・民事再生などの法的整理、または債権者との合意による私的整理（特定調停・銀行取引停止など）に
          至った件数です。東京商工リサーチ（TSR）の独自基準にもとづき集計されており、
          負債1,000万円未満の小規模廃業や休業は含まれません。
        </p>
      </ArticleText>

      {/* ③ メインチャート: 長期推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="企業倒産件数の推移"
          yearRange="（1952〜2025年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※負債1,000万円以上 / 法的・私的整理含む"
        >
          <BankruptcyTrendChart />
        </ArticleChart>
      </div>

      {/* ④ ArticleText: 長期推移の解説 */}
      <ArticleText>
        <p>
          高度成長期の1950年代〜60年代前半は年間1,000〜2,000件台と低水準でしたが、
          1964年の東京五輪後の景気後退・過剰投資の整理に伴い急増し、1965年には6,141件に達しました。
        </p>
        <p>
          1973年のオイルショック後は原材料コストの急騰・需要急減が直撃し、
          1977年にかけて1万5,000〜1万8,000件台で高止まりしました。
          バブル景気の1980年代後半には一時的に1万件を下回りましたが、
          1991年のバブル崩壊以降は金融機関の不良債権処理の遅れを背景に再び増加しました。
        </p>
        <p>
          その後は企業の過剰債務解消・中小企業向け支援策などを経て減少傾向が続き、
          新型コロナウイルス禍の2021年には<strong>6,030件と統計開始以来最少</strong>を更新。
          ゼロゼロ融資（無利子・無担保融資）などの政策支援が倒産を抑制しました。
          しかし2022年以降は支援の終了・借入返済の本格化・物価高騰が重なり
          <strong>4年連続で増加</strong>、2025年は10,300件と2013年以来の水準に達しています。
        </p>
      </ArticleText>

      {/* ⑤ サブチャート: 人手不足倒産の原因別推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title={<>「人手不足」倒産の<br />原因別推移</>}
          yearRange="（2019・2021〜2025年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note={
            <>
              <p>
                ※ 2021・2022年は内訳（求人難・従業員退職・人件費高騰）が非公表のため、合計のみ表示。
              </p>
              <p>
                ※ 2020年は集計方法の移行期にあたり公式な通年確定値がないため欠番。
              </p>
              <p>
                ※ 後継者難は人手不足倒産の定義から除外。
              </p>
            </>
          }
        >
          <BankruptcyCausesChart />
        </ArticleChart>
      </div>

      {/* ⑥ ArticleText: 人手不足倒産の解説 */}
      <ArticleText>
        <p>
          「人手不足」を直接の引き金とした倒産は、コロナ禍の2021年に一時的に56件まで落ち込みました。
          これは経済活動の縮小により採用需要そのものが低下したためです。
        </p>
        <p>
          しかし2022年以降は急速に増加し、2025年には<strong>397件と過去最多</strong>を更新しました。
          内訳では<strong>人件費高騰</strong>（152件）と<strong>従業員退職</strong>（110件）が全体をけん引しています。
          最低賃金の引き上げ・エネルギーコスト上昇に伴う人件費の増大が特に中小・零細企業の収益を圧迫し、
          従業員の確保・定着に苦しむ労働集約型産業（飲食・建設・介護など）で倒産が相次いでいます。
        </p>
      </ArticleText>
    </div>
  );
}
