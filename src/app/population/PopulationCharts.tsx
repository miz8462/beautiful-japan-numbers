"use client";

import dynamic from "next/dynamic";

const CityBars = dynamic(() => import("./charts/CityBars"), { ssr: false });
const TotalPopChart = dynamic(() => import("./charts/TotalPopChart"), { ssr: false });
const BirthDeathChart = dynamic(() => import("./charts/BirthDeathChart"), { ssr: false });
const ComponentsChart = dynamic(() => import("./charts/ComponentsChart"), { ssr: false });

function ChartCard({ title, source, children }: {
  title: string;
  source: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-sm font-medium mb-1">{title}</h2>
      <p className="text-xs text-gray-400 mb-4">出典：{source}</p>
      <div className="bg-gray-50 rounded-xl p-6">
        {children}
      </div>
    </section>
  );
}

export default function PopulationCharts() {
  return (
    <>
      <section className="mb-16">
        <CityBars />
      </section>

      <ChartCard
        title="2008年をピークに、日本の総人口は減少し続けている"
        source="総務省統計局"
      >
        <TotalPopChart />
      </ChartCard>

      <ChartCard
        title="2007年以降、死亡数が出生数を上回り続けている"
        source="厚生労働省"
      >
        <BirthDeathChart />
      </ChartCard>

      <ChartCard
        title="年間人口変化：自然増減と社会増減の内訳"
        source="総務省統計局"
      >
        <ComponentsChart />
      </ChartCard>
    </>
  );
}