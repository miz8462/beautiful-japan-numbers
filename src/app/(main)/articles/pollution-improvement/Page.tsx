import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import PollutionImprovementCharts from "./chart/PollutionImprovementCharts";

export default function PollutionImprovementPage() {
  const article = articles.find((a) => a.href === "/articles/pollution-improvement");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      {/* 2. KPIセクション */}
      <KPISection title="大気・水質改善の到達点（1970年代〜2023年度）">
        <KPIPrimary
          label="SPM環境基準達成率（自排局）"
          value="25.8% → 100%"
          caption="1985年度の深刻な未達成状態から、排ガス規制等の進展により完全達成へ"
        />
        <KPIGrid>
          <KPICard
            label="SPM達成率（一般局）"
            value="100%"
            caption="1985年 52.1% → 2023年 100%"
          />
          <KPICard
            label="河川水質達成率（BOD）"
            value="93.8%"
            caption="1974年 51.3% から大幅改善"
          />
          <KPICard
            label="湖沼水質達成率（COD）"
            value="52.6%"
            caption="閉鎖性水域特有の改善難航（1974年 41.9%）"
          />
        </KPIGrid>
      </KPISection>

      {/* 3. 導入文 */}
      <ArticleText>
        <p>
          1960年代の高度経済成長期、日本は急速な重化学工業化と都市化の進展に伴い、四日市ぜんそくに代表される大気汚染や、
          水俣病・イタイイタイ病などの水銀・重金属汚染といった深刻な産業公害に直面しました。
          産業活動を最優先した結果として生じた健康被害と生活環境の悪化は、国民的な社会問題へと発展しました。
        </p>
        <p>
          これを受け、1970年のいわゆる「公害国会」において公害対策基本法が抜本改正され、大気汚染防止法や水質汚濁防止法などの関連法整備が進められました。
          行政による総量規制や工場排水・排出基準の厳格化、下水道インフラの普及、そして企業の環境対策技術の開発が連動し、
          日本の生活環境は半世紀をかけて劇的な改善を遂げました。
        </p>
        <p>
          環境省が毎年度公表する「環境統計集」の長期データから、浮遊粒子状物質（SPM）を中心とする大気汚染の改善推移と、
          河川・湖沼・海域における水質環境基準の達成動向を検証します。
        </p>
      </ArticleText>

      {/* チャートおよび各セクション */}
      <PollutionImprovementCharts />

      {/* まとめ */}
      <ArticleText>
        <p>
          大気環境におけるSPMの完全達成や河川水質の回復は、法規制、自治体の政策誘導、産業界の技術革新、
          そして社会インフラ整備が有機的に結実した日本の環境政策の確かな成果といえます。
        </p>
        <p>
          一方で、湖沼に代表される閉鎖性水域の水質浄化の難しさや、近年新たに注目される微小粒子状物質（PM2.5）や光化学オキシダント、
          有機フッ素化合物（PFAS）への対応など、環境課題は時代とともに質的な変化を遂げています。
          過去の公害克服の経験を礎としつつ、新たな環境リスクへの科学的かつ継続的なモニタリングが求められています。
        </p>
      </ArticleText>
    </div>
  );
}
