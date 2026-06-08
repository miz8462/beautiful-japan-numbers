import SankeyChart, { type GovernmentSpendingData } from "@/app/(main)/articles/government-spending/SankeyChart";
import governmentSpendingData from "@/data/government-spending.json";

export const metadata = {
  title: "美しい日本の数字",
  description: "この国のデータをわかりやすく",

  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-icon.png",
  },

  manifest: "/manifest.json",

  appleWebApp: {
    title: "BJN",
  },
};

export default function FullScreenGovernmentSpendingPage() {
  const data = governmentSpendingData as GovernmentSpendingData;

  return (
    <div>
      <SankeyChart data={data} />
    </div>
  );
}
