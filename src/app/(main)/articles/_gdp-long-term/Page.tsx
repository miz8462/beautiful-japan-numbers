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
import { GdpCompositionChart } from "./charts/GdpCompositionChart/GdpCompositionChart";
import { GdpTrendChart } from "./charts/GdpTrendChart/GdpTrendChart";
import styles from "./page.module.css";

export default function GdpLongTermPage() {
  const article = articles.find((a) => a.href === "/articles/gdp-long-term");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="日本のGDP規模と支出構造（2024年度）">
        <KPIPrimary
          label="2024年度の名目GDP"
          value="642.4兆円"
          caption="1980年度（261.7兆円）から約2.5倍"
        />
        <KPIGrid>
          <KPICard
            label="2024年度の実質GDP"
            value="586.9兆円"
            caption="2020年連鎖価格基準"
          />
          <KPICard
            label="民間最終消費のシェア"
            value="53.0%"
            caption="国内総需要の過半を占める"
          />
          <KPICard
            label="政府最終消費のシェア"
            value="20.1%"
            caption="1980年（14.3%）から高齢化等で拡大"
          />
          <KPICard
            label="総資本形成（投資）シェア"
            value="27.8%"
            caption="1980年（35.1%）から低下傾向"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            GDP（国内総生産）は、一国の経済活動の規模を測る最も基礎的な指標です。物価変動の影響を含む「名目GDP」と、物価変動の影響を除いて数量ベースでの生産規模を表す「実質GDP」の2つの系列があります。
          </p>
          <p>
            1980年代の高度成長の余韻とバブル期を通じて日本経済は急速に拡大しましたが、1990年代初頭のバブル崩壊以降は名目GDPが長期間にわたり500兆円前後で横ばいとなる「失われた30年」が続きました。近年の物価上昇局面を経て、2024年度の名目GDPは642.4兆円に達しています。
          </p>
        </ArticleText>

        <ArticleChart
          title="名目GDP・実質GDPの推移"
          subtitle="1980年度〜2024年度（単位: 兆円）"
          source="内閣府「国民経済計算年次推計」"
          sourceUrl="https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html"
        >
          <GdpTrendChart />
        </ArticleChart>

        <ArticleText>
          <p>
            GDPを支出項目別に分解すると、家計の消費支出を中心とする「民間最終消費支出」が一貫して全体の50%以上を占め、日本経済を牽引する最大のエンジンとなっています。
          </p>
          <p>
            40年余りの構造変化を見ると、急速な少子高齢化を背景に社会保障給付等を反映した「政府最終消費支出」の割合が14.3%（1980年）から20.1%（2024年）へと上昇しました。一方、企業の設備投資や公共投資を含む「総資本形成」は35.1%から27.8%へと縮小しています。
          </p>
        </ArticleText>

        <ArticleChart
          title="支出項目別構成比の推移"
          subtitle="1980年度〜2024年度（名目GDPに占める構成比、単位: %）"
          source="内閣府「国民経済計算年次推計」"
          sourceUrl="https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html"
        >
          <GdpCompositionChart />
        </ArticleChart>

        <ArticleSource
          label="出典: 内閣府「国民経済計算年次推計」"
          href="https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html"
        />
      </div>
    </div>
  );
}
