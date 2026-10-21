import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { NominalRealWageChart } from "./chart/NominalRealWageChart/NominalRealWageChart";
import styles from "./page.module.css";

const SOURCE_LABEL = "出典: 厚生労働省「毎月勤労統計調査」";
const SOURCE_URL =
  "https://www.e-stat.go.jp/stat-search/files?toukei=00450071&tstat=000001011791";

export default function WageNominalRealPage() {
  const article = articles.find(
    (a) => a.href === "/articles/wage-nominal-real"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="実質賃金指数の変化（令和2年平均=100）">
        <KPIPrimary
          label="実質賃金指数の変化（1996→2025）"
          value="-18.5"
          caption="1996年（116.5。過去最大）から2025年（98.0）への下落率"
        />

        <KPIGrid>
          <KPICard
            label="実質賃金指数 (1996)"
            value="116.5"
            caption="過去最大"
          />
          <KPICard
            label="実質賃金指数 (2025)"
            value="98.0"
            caption="止まらない下落傾向"
          />
        </KPIGrid>

      </KPISection>

      <KPISection title="名目賃金指数の変化（令和2年平均=100）">
        <KPICard
          label="名目賃金指数の変化 (1997→2025)"
          value="-1.2"
          caption="1997年（112.9。過去最大）から2025年（111.7）への下落率"
        />
        <KPIGrid>
          <KPICard
            label="名目賃金指数 (1997)"
            value="112.9"
            caption="過去最大"
          />
          <KPICard
            label="名目賃金指数 (2025)"
            value="111.7"
            caption="近年は上昇傾向ながら、過去の水準には及ばず"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          賃金には、受け取る金額そのままの「名目賃金」と、物価の変動を差し引いて買えるモノの量で測る「実質賃金」があります。
        </p>
        <p>
          実質賃金指数のピークは1996年の116.5です。2025年は98.0で、ピークから15.9低い水準にあります。名目賃金指数も1997年の112.9をピークに、2025年は111.7と1.1下回りました。額面はピークとほぼ同じなのに、買えるモノの量は16近く少ない計算です。
        </p>
        <p>
          名目賃金がほぼ横ばいだった間に物価が上がり続け、その分だけ実質賃金が目減りしました。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="名目賃金と実質賃金の推移"
          subtitle="1990年〜2025年（令和2年=100）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <NominalRealWageChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          名目賃金は近年、物価高を受けた賃上げで伸びが目立ちます。2025年は111.7と、2020年(100)から11.7上昇しました。ただ、水準はピークの1997年(112.9)にまだ届いていません。
        </p>
        <p>
          しかも、名目賃金が上がっている間も、実質賃金は下がり続けています。2025年は98.0で、2020年(100)を2.0下回りました。物価が賃上げを上回るペースで上昇したためで、額面が増えても買えるモノの量は減っています。ピークの1996年(116.5)と比べると18.5の下落です。        </p>
        <p>
          2020年から2025年にかけて、名目賃金は11.7上がりましたが、実質賃金は2.0下がっています。
        </p>
        <p>
          額面（名目賃金）の数字は大きく上がってるのに、それ以上に物価は高騰していて、実質的な賃金は低下傾向が続いています。
        </p>
      </ArticleText>
    </div>
  );
}
