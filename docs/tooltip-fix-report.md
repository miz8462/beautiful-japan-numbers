# Nivoチャート ツールチップ表示崩れ修正レポート

## 1. 原因の特定

### 該当ファイルと行
- **対象ファイル**: [GenderWageGapChart.module.css](file:///home/mizki/projects/beautiful-japan-numbers/src/app/(main)/articles/gender-wage-gap/chart/GenderWageGapChart/GenderWageGapChart.module.css#L14-L56)
- **関連ファイル**: [ArticleChart.module.css](file:///home/mizki/projects/beautiful-japan-numbers/src/components/article/article-chart/ArticleChart.module.css#L82-L87) (Canvasラッパーに `line-height: 0` が指定されている)

### 原因の詳細
1. **`line-height` の未指定と親コンテナ（`ArticleChartCanvas`）からの `line-height: 0` 継承**:
   - `ArticleChartCanvas`（`.canvas`）にSVGの余白除去目的で `line-height: 0` が設定されていた。
   - ツールチップコンポーネントの `.tooltip`, `.tooltipYear`, `.tooltipRow` に明示的な `line-height` が定義されていなかったため、行の高さが実質 0 に潰れ、見出し（`tooltipYear`）と各行テキスト（`tooltipRow`）が縦方向に重なり合って潰れる原因となっていた。
2. **flex要素の縮小によるドット・テキストの干渉**:
   - `.tooltipDot` に `flex-shrink: 0` がなかったため、テキスト幅によってマーカーが縮小・干渉していた。
3. **数値の配置とフォント仕様**:
   - 数値（`.tooltipValue`）に `margin-left: auto` がなく、また等幅数字（`font-variant-numeric: tabular-nums`）が適用されていなかったため、右揃えや数値の揃いが不完全だった。

---

## 2. 変更したファイル一覧と変更の要点

### ① [GenderWageGapChart.module.css](file:///home/mizki/projects/beautiful-japan-numbers/src/app/(main)/articles/gender-wage-gap/chart/GenderWageGapChart/GenderWageGapChart.module.css)
- **修正内容**:
  - `.tooltip` に `line-height: 1.5`, `background: var(--color-background, #ffffff)`, `border: 1px solid var(--color-border, #e0e0e0)` を設定。
  - `.tooltipYear` に `line-height: 1.4`, `margin-bottom: 6px`, `padding-bottom: 4px`, `border-bottom: 1px solid var(--color-border, #e0e0e0)` を追加し、見出しとデータ行を明確に分離。
  - `.tooltipRow` に `line-height: 1.4`, `gap: 8px`, `white-space: nowrap` を設定し、テキスト重なりを解消。
  - `.tooltipDot` に `flex-shrink: 0` を追加して丸マーカーの潰れを防止。
  - `.tooltipValue` に `margin-left: auto`、`font-feature-settings: "tnum" 1, "lnum" 1`、`font-variant-numeric: tabular-nums lining-nums` を設定して右揃え＆等幅数字化。

### ② [NonRegularEmploymentChart.module.css](file:///home/mizki/projects/beautiful-japan-numbers/src/app/(main)/articles/non-regular-employment/chart/NonRegularEmploymentChart/NonRegularEmploymentChart.module.css)
- **修正内容**:
  - 同様に崩れていた非正規雇用比率チャートのツールチップについて、明示的な `line-height: 1.5` / `line-height: 1.4`、見出し下線区切り、`flex-shrink: 0`、数値の `margin-left: auto` + `tabular-nums` を統一適用。

---

## 3. 影響を受けるチャートの一覧

### `GenderWageGapChart.module.css` を共有しているチャート
1. **女性の年齢階級別 就業率と正規雇用比率の比較** (`FemaleMLCurveComparisonChart`)
2. **女性の年齢階級別就業率の推移（M字カーブ）** (`FemaleEmploymentMCurveChart`)
3. **役職別・女性管理職等割合の推移** (`FemaleManagerRatioChart`)
4. **男女間賃金格差の推移** (`GenderWageGapChart`)

※ 4つのチャートすべてにおいて、共通CSS Moduleの修正によりツールチップの文字重なりが解消され、統一されたデザインスタイルが適用されました。

### 個別修正したチャート
5. **非正規雇用比率の推移** (`NonRegularEmploymentChart`)

---

## 4. 動作確認

- **PC表示（幅 1200px / フルスクリーン）**:
  - 1行目の見出し（年齢階級・年）と2行目以降の系列行（ドット + 系列名 + 数値）が適切な行間（line-height: 1.4〜1.5）と余白で縦横に重ならず表示されることを確認。
  - 数値が右端に揃い、等幅数字（tabular-nums）で視認性が確保されていることを確認。
- **スマホ幅（幅 360px〜375px）**:
  - 画面端でも表示崩れやオーバーフローが生じず、読みやすいコントラストと余白を保って描画されることを確認。
- **型チェック**:
  - `npx tsc --noEmit` を実行し、エラー 0 件で通過することを確認。
