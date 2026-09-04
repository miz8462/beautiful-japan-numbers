import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { ArticleChart } from "@/components/article/article-chart";
import { articles } from "../articles";
import SmdGapVsPrGapChart from "./chart/SmdGapVsPrGapChart/SmdGapVsPrGapChart";
import GapChart from "./chart/SmdPrGapChart/SmdPrGapChart";
import SmdVsPrChart from "./chart/SmdPrGapChart/SmdVsPrChart/SmdVsPrChart";
import styles from "./page.module.css";

const SOURCE_LABEL = "総務省「衆議院議員総選挙結果調」";
const SOURCE_URL = "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html";

export default function ElectionSmdVsPrPage() {
  const article = articles.find(
    (a) => a.href === "/articles/election-smd-vs-pr"
  );
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="小選挙区と比例代表の乖離（2026年総選挙）">
        <KPIPrimary
          label="最大乖離幅（自民党 2026年）"
          value="+49.4 pt"
          caption="比例得票率36.7%に対し小選挙区議席率86.2%"
        />
        <KPIGrid>
          <KPICard
            label="自民党 比例得票率"
            value="36.7%"
            caption="有権者の約3分の1の支持"
          />
          <KPICard
            label="自民党 小選挙区議席率"
            value="86.2%"
            caption="小選挙区定数の8割以上を独占"
          />
          <KPICard
            label="民主・立憲系 比例得票率"
            value="18.2%"
            caption="野党第一党ブロック"
          />
          <KPICard
            label="民主・立憲系 小選挙区議席率"
            value="2.4%"
            caption="乖離幅 -15.8 pt"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          日本の衆議院議員選挙は、各選挙区の最多得票者1名を選ぶ「小選挙区制」と、政党の得票数に応じて議席を分ける「比例代表制」の並立制を採用しています。
        </p>
        <p>
          小選挙区制は「政権選択を明確にし、安定した過半数多数を形成しやすい」というメリットがある一方、「得票率の差以上に勝者が議席を総取りし、民意の分布と議席割合が大きくかけ離れる」という特性（増幅効果）を持ちます。
          1996年の制度導入から2026年までの11回の総選挙データから、この「制度による民意と議席の乖離」を検証します。
        </p>
      </ArticleText>

      {/* チャート1: 政党別 議席率 vs 得票率 */}
      <div className={styles.charts}>
        <ArticleChart
          title="政党別：小選挙区獲得議席割合と比例得票率の比較"
          subtitle="1996〜2026年衆院選の推移（%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SmdVsPrChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          自民党の推移を見ると、比例代表の得票率がおおむね25〜38%程度で推移しているのに対し、小選挙区の議席獲得率は圧勝時には70〜80%台半ばまで跳ね上がっています。
        </p>
        <p>
          2005年の郵政選挙（得票率38.2%で議席率73.0%）、2012年の政権奪還選挙（得票率27.6%で議席率79.0%）、そして直近2026年の総選挙（得票率36.7%で議席率86.2%）など、<strong>得票率が3割台であっても小選挙区の7〜8割以上を制する</strong>現象が繰り返されています。
          逆に2009年の民主党政権交代時にも、民主党は比例得票率42.4%で小選挙区の73.7%を獲得しました。
        </p>
      </ArticleText>

      {/* チャート2: 乖離幅（ギャップ）の推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="乖離幅の推移：（小選挙区獲得議席割合）−（比例得票率）"
          subtitle="プラスは得票率以上の議席獲得、マイナスは議席目減り（ポイント）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <GapChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          獲得議席割合から比例得票率を引いた「乖離幅（ギャップ）」を算出すると、第1党に対する強力な下駄（議席増幅）と、第2党以下の激しい目減りが一目瞭然です。
        </p>
        <p>
          勝者となった政党には<strong>+30〜+50ポイントもの巨大なプラスのゲイン</strong>が生じる一方、敗者となった側は得票率相応の議席を小選挙区で獲得できず、大きなマイナスとなります。
        </p>
      </ArticleText>

      {/* チャート3: 2大勢力間の格差比較 */}
      <div className={styles.charts}>
        <ArticleChart
          title="2大勢力間における「小選挙区議席率の差」と「比例得票率の差」"
          subtitle="各選挙における格差の拡大度合い（%ポイント）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SmdGapVsPrGapChart />
        </ArticleChart>
      </div>

      {/* まとめ解説 */}
      <ArticleText>
        <p>
          2大勢力間の差を比べると、比例得票率の差がわずか10〜20ポイント程度であっても、小選挙区の議席差は50〜80ポイント以上に拡大します。
        </p>
        <p>
          政権交代可能な強い内閣を生み出しやすいという小選挙区制の機能と、死票を生み少数意見や多様な民意を切り捨てやすいという副作用。
          数字が示すダイナミズムから、日本の民主主義を支える選挙制度のあり方を考える基礎データとなります。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
