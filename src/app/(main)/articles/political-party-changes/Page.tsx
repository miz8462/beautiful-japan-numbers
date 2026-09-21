import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
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

      {/* 導入解説 */}
      <ArticleText>
        <p>
          2009年に民主党が政権を握ってから、およそ17年。この間、日本の政党は結成・分裂・合流をくり返し、勢力図は何度も塗り替えられてきました。
        </p>
        <p>
          かつては、自民党と社会党が対立する「55年体制」が長く続きました。
          1990年代に衆議院の選挙制度が小選挙区制を中心としたものに変わると、政権を争う二つの大きな政党が向き合う「2大政党制」が目指されるようになります。しかし2012年に民主党が政権を失うと、野党は分裂と再結集をくり返しました。
          そこへ地域政党や新しい政党が加わり、多くの政党が並び立つ時代になっています。
          2008年以降の主な政党の結成・分裂・合流・解散を、タイムラインで見てみましょう。
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
          第1フェーズは「2009〜2012年の民主党政権と第3極の勃興」です。
          民主党は政権を失う前後から党内の対立が深まり、小沢一郎氏らが離党して「国民の生活が第一」を結成しました。
          ほかにも橋下徹氏らの「日本維新の会」、渡辺喜美氏らの「みんなの党」が加わり、多党化が進みました。
        </p>
        <p>
          第2フェーズは「2016〜2020年の民進党の解党と、立憲・国民への分立」です。
          2016年に民主党と維新の党が合流して民進党が発足しましたが、2017年の総選挙直前に「希望の党」への合流をめぐって分裂し、枝野幸男氏らが「立憲民主党」を結成しました。
          2020年には、新・立憲民主党と新・国民民主党にあらためて再編されました。
        </p>
        <p>
          第3フェーズは「2020年代以降の多様化と、中道改革連合の結成・分裂」です。
          れいわ新選組や参政党など、独自の支持層を持つ新しい政党が国会で議席を伸ばしました。
          2026年1月には、立憲民主党と公明党の衆議院議員が中道勢力の結集を掲げて「中道改革連合」を結成しました。
          しかしわずか8か月後の9月、参議院議員や地方議員の合流が見送られたことをきっかけに事実上解体し、立民系は新党「民主改革の会」を、公明系は公明党への復帰を選びました。
          野党の勢力図は、いまも流動的です。        </p>
      </ArticleText>
    </div>
  );
}
