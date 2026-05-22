import SankeyChart, { type GovernmentSpendingData } from "@/components/SankeyChart";
import governmentSpendingData from "../../../public/data/government-spending.json";

export default function Page() {
  const data = governmentSpendingData as GovernmentSpendingData;

  return (
    <div>
      <h1>政府支出</h1>
      <SankeyChart data={data} />
      <a
        href="https://www.mof.go.jp/policy/budget/reference/statistics/data.htm"
        target="_blank"
        rel="noopener noreferrer"
      >
        出典：財務省「予算・決算 統計表一覧」↗
      </a>
    </div>
  );
}
