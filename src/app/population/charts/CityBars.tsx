"use client";

const ANNUAL_DECREASE = 59;

const cities = [
  { name: "仙台市",   pop: 110, color: "#C45A30" },
  { name: "広島市",   pop: 120, color: "#BA7517" },
  { name: "福岡市",   pop: 162, color: "#378ADD" },
  { name: "札幌市",   pop: 197, color: "#378ADD" },
  { name: "名古屋市", pop: 233, color: "#0F6E56" },
  { name: "大阪市",   pop: 275, color: "#534AB7" },
  { name: "東京23区", pop: 973, color: "#A32D2D" },
];

const maxPop = Math.max(...cities.map((c) => c.pop));

export default function CityBars() {
  return (
    <div>
      <h2 className="text-sm font-medium mb-1">
        この減少ペースが続くと、各都市の人口規模が消えるまで何年か
      </h2>
      <p className="text-xs text-gray-400 mb-4">年間純減59万人をもとに算出</p>
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex flex-col gap-4">
          {cities.map((c) => {
            const years = (c.pop / ANNUAL_DECREASE).toFixed(1);
            const pct = (c.pop / maxPop) * 100;
            return (
              <div
                key={c.name}
                className="grid items-center gap-4"
                style={{ gridTemplateColumns: "72px 1fr 64px" }}
              >
                <span className="text-xs text-gray-500 text-right">{c.name}</span>
                <div className="relative h-7 bg-white rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: `${c.color}33` }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {c.pop}万人
                  </span>
                </div>
                <span className="text-lg font-medium" style={{ color: c.color }}>
                  {years}
                  <span className="text-xs font-normal text-gray-400"> 年</span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-5">出典：各市人口は2024年推計値</p>
      </div>
    </div>
  );
}