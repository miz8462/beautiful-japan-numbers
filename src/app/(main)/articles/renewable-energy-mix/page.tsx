import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import RenewableEnergyMixCharts from "./RenewableEnergyMixCharts";

export default function RenewableEnergyMixPage() {
  const article = articles.find(
    (a) => a.href === "/articles/renewable-energy-mix"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="電源構成の現状（2024年度）">
        <KPIPrimary
          label="再エネ比率（水力含む）"
          value="23.1%"
          caption="震災後の再エネ拡大と原子力再稼働による回復"
        />
        <KPIGrid>
          <KPICard label={<>非化石電源比率<br />（原子力+再エネ）</>} value="32.5%" caption="震災後で最高" />
          <KPICard label={<>太陽光発電量<br />（2010年度比）</>} value="28倍" />
          <KPICard label={<>火力（バイオマスを除く）<br />比率</>} value="67.5%" />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          高度経済成長期は石油火力が中心でした。1970年度には総発電量の約6割を石油が占めていました。
          しかし、二度の石油危機（1973年、1979年）を経て、エネルギー安全保障の観点から原子力・LNG（液化天然ガス）への転換が進みました。
        </p>
        <p>
          2011年の東日本大震災と福島第一原子力発電所事故により、原子力発電が急落しました。
          これにより火力発電への依存度が急上昇し、一時は総発電量の9割近くを火力が占める状況となりました。
        </p>
      </ArticleText>

      <RenewableEnergyMixCharts />

      <ArticleText>
        <p>
          非化石電源比率（原子力と再生可能エネルギーの合計）は、2011年度に大きく落ち込みました。
          その後、再生可能エネルギーの拡大と原子力の再稼働が進み、徐々に回復してきました。
          2024年度には32.5%に達し、震災後で最高水準となっています。
        </p>
      </ArticleText>

      <ArticleText>
        <p>
          2012年度に固定価格買取制度（FIT制度）が導入されて以降、太陽光を中心に再生可能エネルギーが急拡大しました。
          太陽光発電量は2010年度比で28倍に増加しています。
          ただし、データの制約上、太陽光・風力・地熱・バイオマスの個別内訳は2010年度以降のみ利用可能です（それ以前は「新エネ等」として合算されています）。
        </p>
      </ArticleText>
    </div>
  );
}
