"use client";

import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const NonRegularEmploymentChart = dynamic(
  () =>
    import(
      "./chart/NonRegularEmploymentChart/NonRegularEmploymentChart"
    ).then((mod) => mod.NonRegularEmploymentChart),
  { ssr: false }
);

const SOURCE_LABEL = "労働力調査 詳細集計（総務省統計局）";
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
          日本の労働市場における雇用の構造変化を把握する指標として、役員を除く雇用者全体に占める「<strong>非正規雇用比率</strong>」が注目されます。
        </p>
        <p>
          2002年から2025年にかけた推移をたどると、2000年代を通じて非正規雇用の割合は上昇傾向を辿り、2002年の29.4%から2019年には過去最高となる38.3%まで拡大しました。その後、2020年代に入るとやや上昇が一服し、直近の2025年には36.5%とピーク時よりわずかに低下した水準で推移しています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="非正規雇用比率の推移"
          yearRange="（2002〜2025年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※2011年は東日本大震災の影響により、岩手県、宮城県及び福島県において調査が一部未実施となったため、全国結果の補完推計・欠測扱いとなっています。"
        >
          <NonRegularEmploymentChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          2000年代から2010年代半ばにかけての比率上昇の背景には、産業構造のサービス化や高齢者の再雇用拡大、女性の労働参加進展など多様な構造変化が存在します。
        </p>
        <p>
          一方、2019年以降の推移においては、労働需給の逼迫に伴う正規雇用の採用拡大や感染症拡大期における雇用調整の影響など複眼的な要因が指摘されており、雇用形態の多様化と安定性のバランスをめぐる議論が続いています。
        </p>
        <p>
          <small style={{ color: "var(--color-text-muted, #888888)" }}>
            ※注: 2011年の数値は東日本大震災の影響で補完推計対象または調査未実施のため公表データ上の欠測となっており、グラフでは2010年と2012年の間を直接補完して表示しています。
          </small>
        </p>
      </ArticleText>
    </div>
  );
}
