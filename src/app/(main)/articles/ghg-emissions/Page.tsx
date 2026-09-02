import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import GHGEmissionsCharts from "./GHGEmissionsCharts";

export default function GHGEmissionsPage() {
  const article = articles.find((a) => a.href === "/articles/ghg-emissions");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      {/* 1. KPIセクション */}
      <KPISection title="2024年度 温室効果ガス排出状況（速報値）">
        <KPIPrimary
          label="温室効果ガス総排出量"
          value="10億4,641万トン"
          caption="CO2換算 / 算定開始（1990年度）以降の過去最低値を更新"
        />
        <KPIGrid>
          <KPICard
            label="ピーク（2013年度）比"
            value="▲24.9%"
            caption="11年連続で減少傾向"
          />
        </KPIGrid>
      </KPISection>

      {/* 2. 導入文 */}
      <ArticleText>
        <p>
          日本の温室効果ガス（GHG）総排出量は、2024年度において<strong>10億4,641万トン</strong>（CO2換算）となり、
          排出量の算定を開始した1990年度以降で過去最低水準を記録しました。
          東日本大震災後の火力発電稼働増などに伴い過去最大となった2013年度（13億9,355万トン）と比較すると、
          <strong>24.9%（約3.5億トン）の削減</strong>が進んだことになります。
        </p>
        <p>
          国立環境研究所（温室効果ガスインベントリオフィス）が取りまとめるデータに基づき、
          長期的な総排出量の推移、ガス種別の内訳、経済部門別の排出変化、
          そして一人当たり排出量の推移から日本の排出構造の変化を整理します。
        </p>
      </ArticleText>

      {/* チャートおよび各セクション */}
      <GHGEmissionsCharts />

      {/* 10. まとめ */}
      <ArticleText>
        <p>
          1990年度から2024年度に至る35年間の推移を俯瞰すると、日本の温室効果ガス排出量は
          2010年代前半の震災後の高水準期を経て、産業・運輸・民生の各部門における省エネルギー投資や
          再エネ導入、低炭素電力の拡大などによって継続的な減少基調に入っています。
        </p>
        <p>
          総排出量・一人当たり排出量ともに長期的な低減が進む一方で、2030年度の温室効果ガス46%削減目標（2013年度比）や
          2050年カーボンニュートラルの達成に向けては、産業構造のさらなる脱炭素化や電源構成の転換が引き続き重要な焦点となっています。
        </p>
      </ArticleText>
    </div>
  );
}
