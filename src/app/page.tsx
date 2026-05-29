import { Page } from "@/components/layout/Page";
import { Surface } from "@/components/layout/Surface/index";
import { TopicCard } from "@/components/ui/TopicCard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <Page>
      <Surface>
        <section className={styles.hero}>
          <p className={styles.headline}>
            偏見やイメージではなく、信頼できるデータから、日本の今を見つめよう。
          </p>
        </section>
      </Surface>

      <section className={styles.section} id="topics">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>トピック</h2>
          </div>
          <div className={styles.grid}>
            <TopicCard
              href="/government-spending"
              label="Government spending"
              title="政府支出"
              description="歳入から歳出までの流れを、主要項目ごとの関係で確認します。"
            />
            <TopicCard
              href="/population"
              label="Population"
              title="人口変化"
              description="総人口、出生数、死亡数、国際移動の変化を並べて確認します。"
            />
          </div>
        </div>
      </section>
    </Page>
  );
}
