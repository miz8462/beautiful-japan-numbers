// ======================
// タグ定義（データ）
// ======================

export const TAGS = {
  politics: "政治",
  economy: "経済",
  society: "社会",
  environment: "環境",
} as const;

export type Tag = keyof typeof TAGS;

// ======================
// 記事型
// ======================

export type Article = {
  href: string;
  publishedAt: string;
  label: string;
  title: string;
  description: string;
  tags: Tag[];
  sourceUrl?: string;
  sourceLabel?: string;
};

// ======================
// 記事データ
// ======================

export const articles: Article[] = [  
    {
    href: "/articles/interest-rate-history",
    publishedAt: "2026-08-07",
    label: "Interest Rate",
    title: "金利の歴史と推移",
    description:
      "1970年代から現代に至るまでの日本の政策金利、長期金利、国債利率、住宅ローンおよび預金金利の長期推移をたどり、「金利のある世界」への回帰とそのインパクトを可視化します。",
    tags: ["economy"],
    sourceUrl: "https://www.boj.or.jp/",
    sourceLabel: "出典: 日本銀行 / 財務省 / 住宅金融支援機構 / ゆうちょ銀行",
  },
  {
    href: "/articles/expenditure-breakdown",
    publishedAt: "2026-07-31",
    label: "Expenditure",
    title: "歳出の内訳変化の推移",
    description:
      "1967年度から2024年度までの主要経費別歳出の長期推移と、高齢化に伴う社会保障関係費の割合の推移を可視化します。",
    tags: ["economy", "politics"],
    sourceUrl: "https://www.mof.go.jp/policy/budget/reference/statistics/data.htm",
    sourceLabel: "出典: 財務省「財政統計」第20表",
  },
  {
    href: "/articles/tax-revenue-structure",
    publishedAt: "2026-07-29",
    label: "Tax Revenue",
    title: "税収構造の推移",
    description:
      "1979年度から2024年度までの日本の税収構造の推移を可視化します。かつては所得税や法人税が主要な税収源でしたが、累次の税制改正や税率引き上げを経て、近年は消費税が税目別で最大となっています。",
    tags: ["economy", "politics"],
    sourceUrl: "https://www.mof.go.jp/tax_policy/summary/condition/a03.htm",
    sourceLabel: "出典: 財務省「税収に関する資料」",
  },
  {
    href: "/articles/national-debt-trend",
    publishedAt: "2026-07-25",
    label: "National Debt",
    title: "国債残高の推移",
    description:
      "1965年度以降の普通国債残高と対GDP比の長期推移、および普通国債の利率加重平均の変化から、日本の国債残高の拡大と金利環境を可視化します。",
    tags: ["economy", "politics"],
    sourceUrl: "https://www.mof.go.jp/jgbs/reference/national_debt/index.htm",
    sourceLabel:
      "出典: 財務省「国債発行額の推移（実績ベース）」・「普通国債の利率加重平均の各年ごとの推移」",
  },
  {
    href: "/articles/bankruptcy-trend",
    publishedAt: "2026-07-24",
    label: "Bankruptcy",
    title: "企業の倒産件数の推移",
    description:
      "1952年以降の企業倒産件数（負債1,000万円以上）の長期推移と、近年急増する「人手不足」倒産の原因別内訳を可視化します。",
    tags: ["economy"],
  },
  {
    href: "/articles/industry-structure",
    publishedAt: "2026-07-22",
    label: "Industrial Structure",
    title: "日本の産業構造はどう変わったか？",
    description: "1970年以降の第1次・第2次・第3次産業の構成比推移や、直近30年における16業種の内訳比較から、日本のサービス経済化と製造業などの変化を可視化します。",
    tags: ["economy"],
    sourceUrl: "https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html",
    sourceLabel: "出典: 内閣府「国民経済計算年次推計」",
  },
  {
    href: "/articles/gini-coefficient",
    publishedAt: "2026-07-10",
    label: "Gini Coefficient",
    title: "日本の所得格差はどうなっているのか？",
    description:
      "当初所得と再分配所得のジニ係数の推移から、日本の所得格差の現状と、社会保障や税による再分配機能の改善度を可視化します。",
    tags: ["economy", "society"],
    sourceUrl: "https://www.e-stat.go.jp/statistics/00450422",
    sourceLabel: "出典: 厚生労働省「所得再分配調査」",
  },
  {
    href: "/articles/gdp-long-term",
    publishedAt: "2026-07-06",
    label: "GDP",
    title: "GDPの長期推移",
    description: "1980年度以降の名目GDPと実質GDPの長期推移を可視化し、バブル崩壊後の変化を分析します。",
    tags: ["economy"],
    sourceUrl: "https://www.esri.cao.go.jp/jp/sna/kakuhou/kakuhou_top.html",
    sourceLabel: "出典: 内閣府「国民経済計算年次推計」",
  },
  {
    href: "/articles/consumption-structure",
    publishedAt: "2026-07-06",
    label: "Consumption",
    title: "消費支出の構造はどう変わったか？",
    description:
      "二人以上の世帯の消費支出について、費目別シェアとエンゲル係数の推移を可視化し、家計の使い道の変化を見ます。",
    tags: ["economy"],
    sourceUrl: "https://www.stat.go.jp/data/kakei/longtime/index.html",
    sourceLabel:
      "出典: 総務省統計局「家計調査」家計収支編 二人以上の世帯 用途分類",
  },
  {
    href: "/articles/disposable-income",
    publishedAt: "2026-07-04",
    label: "Disposable Income",
    title: "実質可処分所得は30年でどう変わったか？",
    description:
      "勤労者世帯の可処分所得について、名目値と実質値（2020年基準）の推移を比較し、物価上昇によって家計の実質的な購買力がどれほど目減りしてきたかを可視化します。",
    tags: ["economy"],
    sourceUrl:
      "https://www.stat.go.jp/data/kakei/longtime/index.html",
    sourceLabel: "総務省統計局「家計調査」",
  },
  {
    href: "/articles/savings",
    publishedAt: "2026-07-03",
    label: "Savings",
    title: "日本人はどれだけ貯金しているのか？",
    description:
      "家計の貯蓄率の年度推移と、年齢階級別の貯蓄・負債残高を可視化します。",
    tags: ["economy"],
    sourceUrl: "",
    sourceLabel: "",
  },
  {
    href: "/articles/inflation-overview",
    publishedAt: "2026-06-29",
    label: "Inflation",
    title: "物価はどれくらい上がっているのか？",
    description:
      "消費者物価指数の水準と前年比を、総合・コア・コアコアの3系列で可視化します。",
    tags: ["economy"],
    sourceUrl:
      "https://www.e-stat.go.jp/stat-search/files?toukei=00200573&tstat=000001150147",
    sourceLabel: "出典: 総務省統計局「消費者物価指数」2020年基準",
  },
  {
    href: "/articles/political-party-changes",
    publishedAt: "2026-06-27",
    label: "Political Parties",
    title: "近年の政党再編はどのように進んできたか？",
    description:
      "主要政党の結党・解散・合流・分裂の歴史を可視化し、政治勢力の変遷を俯瞰します。",
    tags: ["politics"],
    sourceUrl: "",
    sourceLabel: "出典: 各種報道および党史をもとに作成",
  },
  {
    href: "/articles/election-smd-vs-pr",
    publishedAt: "2026-06-23",
    label: "Election system",
    title: "比例での政党への投票率は小選挙区での結果にどれほど反映されているか？",
    description:
      "衆議院選挙において小選挙区の獲得議席割合と比例代表の得票率がどれほど乖離しているかを、自民党と民主・立憲系それぞれの推移を通じて可視化します。",
    tags: ["politics"],
    sourceUrl: "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html",
    sourceLabel: "出典: 総務省「衆議院議員総選挙結果調」",
  },

  {
    href: "/articles/diet-members",
    publishedAt: "2026-06-19",
    label: "Diet members",
    title: "国会議員の女性比率と年齢はどう変わった？",
    description:
      "衆議院議員選挙の当選者の年齢構成と女性議員比率・男女別の当選率の推移を整理し、国会の“姿”がどのように変化してきたのかを可視化します。",
    tags: ["politics"],
    sourceUrl: "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html",
    sourceLabel: "出典: 総務省「衆議院議員総選挙結果調」",
  },

  {
    href: "/articles/voter-turnout",
    publishedAt: "2026-06-16",
    label: "Voter turnout",
    title: "選挙の投票率ってどれくらい？",
    description:
      "衆議院選挙の投票率を全体・年代別に整理し、どこで“投票が失われているのか”を可視化します。",
    tags: ["politics"],
    sourceUrl: "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html",
    sourceLabel: "出典: 総務省 選挙関連資料",
  },
  {
    href: "/articles/population",
    label: "Population",
    publishedAt: "2026-06-13",
    title: "人口はどれだけ減ってるの？",
    description:
      "総人口・出生・死亡・国際移動の変化を並べ、人口減少の“中身”を分解して見ていきます。",
    tags: ["society"],
    sourceUrl: "https://www.stat.go.jp/data/jinsui/2.html",
    sourceLabel: "出典: 総務省統計局 人口推計",
  },
  {
    href: "/articles/government-spending",
    publishedAt: "2026-06-13",
    label: "Government spending",
    title: "税金はどこへ消えているのか？",
    description:
      "歳入から歳出までの流れを追い、社会保障・防衛・公共事業など主要項目の構造をひも解きます。",
    tags: ["politics", "economy"],
    sourceUrl:
      "https://www.mof.go.jp/policy/budget/reference/statistics/data.htm",
    sourceLabel: "出典: 財務省「予算・決算 統計表一覧」",
  },

];


// ======================
// ユーティリティ
// ======================

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.href === `/articles/${slug}`);
}

export function getAllSlugs() {
  return articles.map((a) => a.href.replace("/articles/", ""));
}
