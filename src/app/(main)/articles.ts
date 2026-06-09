export type Tag = "population" | "governmentSpending";

export const TAG_LABELS: Record<Tag, string> = {
  population: "人口",
  governmentSpending: "財政",
};

export const articles = [
  {
    href: "/articles/government-spending",
    label: "Government spending",
    title: "政府支出",
    description: "歳入から歳出までの流れを、主要項目ごとの関係で確認します。",
    tags: ["governmentSpending"] as Tag[],
  },
  {
    href: "/articles/population",
    label: "Population",
    title: "人口変化",
    description: "総人口、出生数、死亡数、国際移動の変化を並べて確認します。",
    tags: ["population"] as Tag[],
  },
];