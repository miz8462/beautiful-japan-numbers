import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import {
  KPICard,
  KPIGrid,
  KPIPrimary,
  KPISection,
} from "@/components/kpi";
import { NationalDebtBalanceChart } from "./chart/NationalDebtBalanceChart/NationalDebtBalanceChart";
import { NationalDebtInterestRateChart } from "./chart/NationalDebtInterestRateChart/NationalDebtInterestRateChart";
import styles from "./page.module.css";

const SOURCE_LABEL =
  "出典: 財務省「国債発行額の推移（実績ベース）」・「普通国債の利率加重平均の各年ごとの推移」";
const SOURCE_URL = "https://www.mof.go.jp/jgbs/reference/national_debt/index.htm";

export default function NationalDebtTrendPage() {
  const article = articles.find(
    (a) => a.href === "/articles/national-debt-trend"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="普通国債残高と金利環境（主要指標）">
        <KPIPrimary
          label="普通国債残高（2026年度見込）"
          value="1,145兆円"
          caption="1975年（15.0兆円）から約76倍に拡大"
        />
        <KPIGrid>
          <KPICard
            label="対GDP比（2026年度見込）"
            value="165.5%"
            caption="1975年（9.6%）から大幅上昇"
          />
          <KPICard
            label="コロナ禍の対GDP比ピーク"
            value="175.7%"
            caption="2020年度の緊急財政出動期"
          />
          <KPICard
            label="利率加重平均（2025年）"
            value="0.98%"
            caption="2022年の底（0.76%）から反転上昇"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            ここで扱う<strong>「普通国債」</strong>とは、国が発行する債券のうち、建設国債、特例国債（赤字国債）、復興債、借換債などを合わせたものです。国の債務には財投債や借入金、政府短期証券なども含まれますが、普通国債は一般会計の財源不足を支えてきた中心部分にあたり、「国の借金」を語るときに最もよく使われる指標です。
          </p>
          <p>
            戦後初の赤字国債が発行されたのは1965年度です。その後いったん途絶えたものの、1973年の石油危機で税収が落ち込み、1975年度から再び発行が始まりました。以降は1990年代初めの数年を除いて、ほぼ毎年発行が続いています。バブル崩壊後は、税収の低迷に加えて高齢化で社会保障関係費が膨らみ、残高は急速に増えました。2026年度末には、約1,145兆円（対名目GDP比165.5%）に達する見込みです。
          </p>
        </ArticleText>

        <ArticleChart
          title="普通国債残高と対GDP比の推移"
          subtitle="1965年度〜2026年度見込（左軸: 残高[兆円]、右軸: 対GDP比[%]）"
          source="財務省「国債発行額の推移（実績ベース）」"
          sourceUrl={SOURCE_URL}
        >
          <NationalDebtBalanceChart />
        </ArticleChart>

        <ArticleText>
          <p>
            国債残高が巨額に膨らむなかで、国が支払う利息の急増を抑えてきたのは、金利の歴史的な低下でした。
          </p>
          <p>
            「普通国債の利率加重平均」とは、すでに発行された国債全体の平均的な金利のことです。1975年度の7.43%から、日本銀行の大規模な金融緩和などを背景に下がり続け、2022年度には過去最低の0.76%となりました。          </p>
          <p>
            ところが近年は、金利の低い国債が満期を迎え、より金利の高い国債に置き換わるにつれて、平均が上向いています。2025年度は0.98%でした。残高が1,000兆円を超える今、わずかな金利の上昇でも負担は大きく膨らみます。国が借金のために毎年支払う「国債費」は、元本の返済に充てる「債務償還費」と、利息にあたる「利払い費」の合計です。2026年度予算の国債費は31.3兆円で、内訳は債務償還費が18.2兆円、利払い費が13.0兆円です。財務省の試算では、利払い費は2029年度に21.6兆円へ増え、国債費は41.3兆円に達します。しかも、金利が試算の前提より1%高く推移すれば、国債費は45.1兆円と、3.8兆円さらに膨らみます。金利の動向は、財政の持続可能性を左右する要因です。
          </p>
        </ArticleText>

        <ArticleChart
          title="普通国債の利率加重平均の推移"
          subtitle="1975年度〜2025年度（単位: %）"
          source="財務省「普通国債の利率加重平均の各年ごとの推移」"
          sourceUrl={SOURCE_URL}
        >
          <NationalDebtInterestRateChart />
        </ArticleChart>

      </div>
    </div>
  );
}