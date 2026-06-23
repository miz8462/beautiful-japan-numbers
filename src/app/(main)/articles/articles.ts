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
  sourceUrl: string;
  sourceLabel: string;
};

// ======================
// 記事データ
// ======================

export const articles: Article[] = [
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