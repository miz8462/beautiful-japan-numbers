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
            label="利率加重平均（2025年）"
            value="0.98%"
            caption="2022年の底（0.76%）から反転上昇"
          />
          <KPICard
            label="1975年の利率加重平均"
            value="7.43%"
            caption="過去最高水準の金利環境"
          />
          <KPICard
            label="コロナ禍の対GDP比ピーク"
            value="175.7%"
            caption="2020年度の緊急財政出動期"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            ここで扱う<strong>「普通国債」</strong>とは、国が発行する借入証券のうち、建設国債・特例国債（赤字国債）・復興債などを合わせた残高です。政府全体の借入金（借入金や政府保証債など）すべてを指すわけではなく、一般会計の歳入不足を補うために発行されてきた借金の中核をなす指標です。
          </p>
          <p>
            1965年度に戦後初めて赤字国債が発行されて以降、1973年の石油危機を契機に特例国債の定常的な発行が始まりました。1990年代初頭のバブル崩壊後は税収の低迷と高齢化に伴う社会保障関係費の増大により残高が急拡大し、2026年度末には約1,145兆円（対GDP比165.5%）に達する見込みです。
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
            国債残高が巨額に膨張する一方で、国が支払う「利払い費」の急増を抑えてきたのが長期金利の歴史的な低下です。
          </p>
          <p>
            既発国債全体の利率の重み付け平均である「普通国債の利率加重平均」は、1975年の7.43%から日本銀行の大規模金融緩和などを背景に低下し続け、2022年には過去最低の0.76%まで低下しました。
          </p>
          <p>
            しかし、2023年以降の金融政策正常化に伴い、2025年には0.98%へと反転上昇しています。残高が1,000兆円を超える規模に達している現在、わずかな金利上昇であっても利払い費に大きな影響を及ぼすため、今後の金利動向と財政運営の持続可能性が注目されています。
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

        <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
      </div>
    </div>
  );
}