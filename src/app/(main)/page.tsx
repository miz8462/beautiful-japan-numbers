import { PageLayout } from "@/components/layout/Page";
import { Surface } from "@/components/layout/Surface/index";
import { TopicCard } from "@/components/ui/TopicCard";
import { articles } from "./articles/articles";
import styles from "./page.module.css";

export default function Home() {
  return (
    <PageLayout>
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
            {articles.map((article) => (
              <TopicCard key={article.href} {...article} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
