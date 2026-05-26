
import { notFound } from "next/navigation";
import PopulationCharts from "./PopulationCharts";

if (process.env.NODE_ENV === "production") {
  notFound();
}

export const metadata = {
  title: "日本はどれくらいのスピードで人口が減っているか？",
};

export default function PopulationPage() {
  return (
    <div className="max-w-2xl mx-auto px-12 py-16">
      <header className="border-b border-gray-200 pb-8 mb-12">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">人口</p>
        <h1 className="text-2xl font-medium leading-snug mb-3">
          日本はどれくらいのスピードで人口が減っているか？
        </h1>
        <p className="text-xs text-gray-400">
          毎年更新 ／ 出典：総務省統計局、厚生労働省
        </p>
      </header>

      <section className="mb-16">
        <div className="mb-10">
          <p className="text-sm text-gray-500 mb-3">年間人口減少数（2024年）</p>
          <p className="text-7xl font-medium leading-none tracking-tight">−58万人</p>
          <p className="text-sm text-gray-400 mt-4">
            1日あたり約1,600人 ／ 1時間あたり約67人
          </p>
        </div>
        <div className="flex gap-14">
          <div>
            <p className="text-xs text-gray-400 mb-2">出生数</p>
            <p className="text-xl font-medium">68万人</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">死亡数</p>
            <p className="text-xl font-medium">160万人</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">社会増（国際移動）</p>
            <p className="text-xl font-medium">+34万人</p>
          </div>
        </div>
      </section>

      <PopulationCharts />
    </div>
  );
}