import SankeyChart, { type GovernmentSpendingData } from "@/components/SankeyChart";
import governmentSpendingData from "../../../public/data/government-spending.json";

export default function Page() {
  const data = governmentSpendingData as GovernmentSpendingData;

  return (
    <div>
      <h1>政府支出</h1>
      <SankeyChart data={data} />
    </div>
  );
}
