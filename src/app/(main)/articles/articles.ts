export const TAG_LABELS = {
  population: "人口",
  governmentSpending: "財政",
  election: "選挙",
};

export type Tag = keyof typeof TAG_LABELS;

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

export const articles: Article[] = [
  {
    href: "/articles/voter-turnout",
    publishedAt: "2026-06-15",
    label: "Voter turnout",
    title: "投票率",
    description: "衆議院議員総選挙の投票率を、全体と年代別の推移で確認します。",
    tags: ["election"] as Tag[],
    sourceUrl: "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html",
    sourceLabel: "出典: 総務省 選挙関連資料",
  },
  {
    href: "/articles/government-spending",
    publishedAt: "2026-06-13",
    label: "Government spending",
    title: "政府支出",
    description: "歳入から歳出までの流れを、主要項目ごとの関係で確認します。",
    tags: ["governmentSpending"] as Tag[],
    sourceUrl: "https://www.mof.go.jp/policy/budget/reference/statistics/data.htm",
    sourceLabel: "出典: 財務省「予算・決算 統計表一覧」",
  },
  {
    href: "/articles/population",
    label: "Population",
    publishedAt: "2026-06-13",
    title: "人口変化",
    description: "総人口、出生数、死亡数、国際移動の変化を並べて確認します。",
    tags: ["population"] as Tag[],
    sourceUrl: "https://www.stat.go.jp/data/jinsui/2.html",
    sourceLabel: "出典: 総務省統計局 人口推計",
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.href === `/articles/${slug}`)
}

export function getAllSlugs() {
  return articles.map((a) => a.href.replace('/articles/', ''))
}
