"use client";

import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const IndustryStructureLongChart = dynamic(
  () => import("./charts/IndustryStructureLongChart/IndustryStructureLongChart").then(
    (mod) => mod.IndustryStructureLongChart
  ),
  { ssr: false }
);

const IndustryStructureDetailChart = dynamic(
  () => import("./charts/IndustryStructureDetailChart/IndustryStructureDetailChart").then(
    (mod) => mod.IndustryStructureDetailChart
  ),
  { ssr: false }
);

export default function IndustryStructurePage() {
  const article = articles.find((a) => a.href === "/articles/industry-structure");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <ArticleText>
        日本のGDP（国内総生産）のうち、モノを作る製造業などの「工業」と、サービスを提供する「サービス業」、どちらの規模が大きいと思いますか？
        戦後の高度経済成長期を経て、私たちの生活や社会が豊かになるにつれ、経済の主役はモノづくりからサービスや情報の提供へとシフトしてきました。
        この「サービス経済化」と呼ばれる産業構造の歴史的な変化を、半世紀にわたるデータからひも解いてみましょう。
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="産業別構成比の推移"
          yearRange="（1970〜2023）"
          intro="1970年から2023年までの名目GDP構成比の推移を見ると、日本経済全体に占める「モノづくり」の比率が低下し、「サービス・情報」の比率が拡大してきた歴史的な流れが分かります。"
          unitNote="単位：名目GDPに占める構成比（%）"
          note="※1994年を境に、内閣府国民経済計算の算出基準が「1990年基準・68SNA（1970〜1993年）」から「2015年基準・2008SNA（1994〜2023年）」へと移行しています。1994年前後の境界では、産業分類改定の影響により、第2次産業の比率が見かけ上約2%前後変化する段差が含まれます。"
        >
          <IndustryStructureLongChart />
        </ArticleChart>
      </div>
      <ArticleText>
        <p>
          1970年代から直近の2023年までを俯瞰すると、日本経済が「モノづくり（第2次産業）」中心から、「サービスや情報（第3次産業）」中心のサービス経済化へと大きく移行してきたことが分かります。
        </p>
        <p>
          高度経済成長の勢いを引き継ぐ1970年時点では、製造業や建設業などを含む第2次産業が全体の43.1%を占めていましたが、2023年には20%台後半まで減少。一方で、情報通信、小売、不動産、医療福祉などを含む第3次産業は、50.9%から71.1%へと拡大しました。農業・林業・水産業などの第1次産業は1.0%未満となっています。
        </p>
      </ArticleText>
      <div className={styles.charts}>

        <ArticleChart
          title="業種別構成比の変化"
          yearRange="（1994→2023）"
          unitNote="単位：GDPに占める構成比（%）"
        >
          <IndustryStructureDetailChart />
        </ArticleChart>
      </div>
      <ArticleText>
        <p>
          直近の約30年間における16業種ごとのGDPシェア変化を見ると、単なる「サービス経済化」の中身がより鮮明になります。
        </p>
        <p>
          最もシェアを縮小させたのは<strong>製造業</strong>で、1994年の23.6%から2023年には20.7%へと2.9ポイント低下しました。また、公共事業の縮小などに伴い<strong>建設業</strong>も7.9%から5.3%へ低下しています。
        </p>
        <p>
          一方で大きくシェアを伸ばしたのが、少子高齢化を背景に急拡大した<strong>保健衛生・社会事業（医療・福祉・介護など）</strong>で、4.0%から7.9%へとほぼ倍増（+3.9ポイント）しました。その他、IT化の進展を反映した<strong>情報通信業</strong>（+1.5ポイント）や、研究開発・コンサルティングなどを含む<strong>専門・科学技術、業務支援サービス業</strong>（+4.4ポイント）が成長を牽引しています。
        </p>
      </ArticleText>
    </div>
  );
}
