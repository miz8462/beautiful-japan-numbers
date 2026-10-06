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
            GDP(国内総生産)とは、1年間に国内で新しく生み出されたモノやサービスの価値を合計したもので、その国の経済の大きさを表す代表的な指標です。
          </p>
          <p>
            GDPには2つの種類があります。「名目GDP」はその年の価格でそのまま計算した金額で、「実質GDP」は物価の変動の影響を取り除き、モノやサービスの量の増減だけを見た金額です。物価が上がれば名目GDPは増えますが、実際に生産が増えたとは限りません。そのため、経済の実力を見るときは実質GDPもあわせて確認します。
          </p>
          <p>
            日本経済は1980年代後半のバブル期にかけて大きく拡大しました。しかし1990年代初めにバブルが崩壊すると、名目GDPは約30年にわたって500兆円前後で横ばいが続き、この時期は「失われた30年」と呼ばれます。その後、近年の物価上昇もあって、2024年度の名目GDPは642.4兆円に達しています。
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
            GDPを「何にお金が使われたか」という支出の面から分けると、家計の買い物やサービスへの支出である「民間最終消費支出」が、1980年度以降一貫して全体の過半を占めています。2024年度は53.0%で、日本経済を支える最大の柱です。
          </p>
          <p>
            40年余りの間には、構造にも変化がありました。「政府最終消費支出」の割合は、1980年度の14.3%から2024年度の20.1%へ上昇しました。高齢化が進み、医療や介護など、公的な負担で提供されるサービスが増えたことが背景にあります。一方、企業の設備投資や道路・橋などの公共投資、在庫の増減を合わせた「総資本形成」は、35.1%から27.8%へと低下しました。
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
