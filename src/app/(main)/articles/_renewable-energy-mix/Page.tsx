import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import RenewableEnergyMixCharts from "./RenewableEnergyMixCharts";

const SOURCE_LABEL = "出典: 資源エネルギー庁「エネルギー白書」「エネルギー需給実績」";
const SOURCE_URL = "https://www.enecho.meti.go.jp/about/whitepaper/";

export default function RenewableEnergyMixPage() {
  const article = articles.find(
    (a) => a.href === "/articles/renewable-energy-mix"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="電源構成の現状（2024年度・主要指標）">
        <KPIPrimary
          label="再エネ比率（水力含む）"
          value="23.1%"
          caption="震災後の再エネ拡大と原子力再稼働による回復"
        />
        <KPIGrid>
          <KPICard
            label={<>非化石電源比率<br />（原子力+再エネ）</>}
            value="32.5%"
            caption="震災後で最高水準を更新"
          />
          <KPICard
            label={<>太陽光発電量<br />（2010年度比）</>}
            value="28倍"
            caption="FIT制度等による急拡大"
          />
          <KPICard
            label={<>火力発電比率<br />（化石燃料依存）</>}
            value="67.5%"
            caption="依然として全体の約7割を占める"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の電力供給構造は、国際情勢や大規模災害を契機として大きく変化してきました。高度経済成長期は石油火力が中心であり、1970年度には総発電量の約6割を石油が占めていました。
          しかし、二度の石油危機（1973年、1979年）を経て、エネルギー安全保障の観点から原子力やLNG（液化天然ガス）、石炭への多角化が進められました。
        </p>
        <p>
          2011年の東日本大震災と福島第一原発事故により原発が全停止したことで、一時は火力依存度が約9割近くまで急上昇しました。
          その後、2012年に導入された固定価格買取制度（FIT制度）を契機に太陽光発電を中心とする再生可能エネルギーが急成長を遂げ、原子力の安全審査を経た再稼働も一部進んだことで、非化石電源比率は2024年度に32.5%まで回復しています。
        </p>
      </ArticleText>

      <RenewableEnergyMixCharts />

      <ArticleText>
        <p>
          2050年カーボンニュートラルおよび2030年度の温室効果ガス削減目標（2013年度比46%減）に向け、日本政府は第6次エネルギー基本計画において2030年度の再エネ比率目標を36〜38%と定めています。
        </p>
        <p>
          太陽光の適地制約や送電網の容量確保、出力変動に対応する調整力（蓄電池や揚水発電）の確保、さらには洋上風力発電の大規模導入など、脱炭素と電力の安定供給を両立させるための課題解決が求められています。
        </p>
      </ArticleText>

      <ArticleSource href={article.sourceUrl || SOURCE_URL} label={article.sourceLabel || SOURCE_LABEL} />
    </div>
  );
}
