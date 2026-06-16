// ======================
// ① 設計レイヤー（固定）
// ======================

export type Domain =
  | "politics"
  | "society"
  | "information"
  | "system"
  | "economy"
  | "environment"
  | "time";

export type Theme =
  | "structure"
  | "future"
  | "participation"
  | "stability";

export type Tag = keyof typeof TAGS;


// ======================
// ② タグ定義（データ）
// ======================

export const TAGS = {
  population: {
    label: "人口",
    domain: ["society"] as Domain[],
    theme: ["future"] as Theme[],
  },

  governmentSpending: {
    label: "財政",
    domain: ["politics", "economy"] as Domain[],
    theme: ["structure"] as Theme[],
  },

  election: {
    label: "選挙",
    domain: ["politics"] as Domain[],
    theme: ["participation"] as Theme[],
  },
} as const;


// ======================
// ③ 記事型
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
// ④ 記事データ
// ======================

export const articles: Article[] = [
  {
    href: "/articles/voter-turnout",
    publishedAt: "2026-06-16",
    label: "Voter turnout",
    title: "選挙の投票率ってどれくらい？",
    description:
      "衆議院選挙の投票率を全体・年代別に整理し、どこで“投票が失われているのか”を可視化します。",
    tags: ["election"],
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
    tags: ["governmentSpending"],
    sourceUrl: "https://www.mof.go.jp/policy/budget/reference/statistics/data.htm",
    sourceLabel: "出典: 財務省「予算・決算 統計表一覧」",
  },

  {
    href: "/articles/population",
    label: "Population",
    publishedAt: "2026-06-13",
    title: "人口はどれだけ減ってるの？",
    description:
      "総人口・出生・死亡・国際移動の変化を並べ、人口減少の“中身”を分解して見ていきます。",
    tags: ["population"],
    sourceUrl: "https://www.stat.go.jp/data/jinsui/2.html",
    sourceLabel: "出典: 総務省統計局 人口推計",
  },
];


// ======================
// ⑤ ユーティリティ
// ======================

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.href === `/articles/${slug}`);
}

export function getAllSlugs() {
  return articles.map((a) => a.href.replace("/articles/", ""));
}