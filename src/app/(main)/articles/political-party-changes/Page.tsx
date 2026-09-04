import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import PoliticalPartyTimelineChart from "./charts/PoliticalPartyTimeline/PoliticalPartyTimelineChart";
import styles from "./page.module.css";

const SOURCE_LABEL = "各種報道および党史・公的記録をもとに作成";
const SOURCE_URL = "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html";

export default function PoliticalPartyChangesPage() {
  const article = articles.find((a) => a.href === "/articles/political-party-changes");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="近年の政党再編のダイナミクス（2008〜2026年）">
        <KPIPrimary
          label="主要な新党結党・再編イベント"
          value="20回以上"
          caption="2009年政権交代以降、合流と分裂が断続"
        />
        <KPIGrid>
          <KPICard
            label="2009年"
            value="民主党政権"
            caption="政権交代による2大政党制の模索"
          />
          <KPICard
            label="2012〜17年"
            value="第三極の台頭"
            caption="維新系・みんなの党・希望の党"
          />
          <KPICard
            label="2020年〜"
            value="新興勢力の誕生"
            caption="れいわ新選組・参政党などの台頭"
          />
          <KPICard
            label="2026年"
            value="中道改革連合"
            caption="野党第一党ブロックの新たな再編"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          2009年の民主党政権交代から現在に至る約18年間、日本の政党勢力図は激しい離合集散を繰り返してきました。
        </p>
        <p>
          かつて55年体制（自民党と社会党の対立）から小選挙区制の導入を経て「2大政党制」が目指されましたが、政権交代とその後の下野を契機に、野党勢力は分裂と再結集を重ね、さらに地域政党や新興勢力が次々と参入する複雑な多党化の時代へとシフトしました。
          2008年以降の主要政党の結党・分裂・合流・解散の変遷をタイムラインで俯瞰します。
        </p>
      </ArticleText>

      {/* チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="主要政党の結党・合流・分裂の歴史タイムライン"
          subtitle="2008年〜2026年の変遷図"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <div style={{ overflowX: "auto", width: "100%" }}>
            <PoliticalPartyTimelineChart />
          </div>
        </ArticleChart>
      </div>

      {/* 詳細解説 */}
      <ArticleText>
        <p>
          タイムラインを追うと、大きく3つの再編フェーズが浮かび上がります。
        </p>
        <p>
          第1フェーズは<strong>「2009〜2012年の民主党政権と第3極の勃興」</strong>です。小沢一郎氏らの「国民の生活が第一」離党や、橋下徹氏らによる「日本維新の会」、渡辺喜美氏らの「みんなの党」が誕生し、多党化が進みました。
        </p>
        <p>
          第2フェーズは<strong>「2016〜2020年の民進党解党と立憲・国民への分立」</strong>です。維新の党と合流した民進党が2017年総選挙直前に「希望の党」への合流を試みたものの、枝野幸男氏らによる「立憲民主党」の結党へと分裂。その後2020年に新・立憲民主党と国民民主党へと再編されました。
        </p>
        <p>
          第3フェーズは<strong>「2020年代以降の多様化と中道改革連合の結成」</strong>です。れいわ新選組や参政党など独自の支持層を持つ新党が国会へ議席を伸ばす一方、2026年には中道勢力の再結集として「中道改革連合」が発足するなど、政権対抗軸の模索が続いています。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
