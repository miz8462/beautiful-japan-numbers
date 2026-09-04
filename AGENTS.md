# Beautiful Japan Numbers Project Rules for AI Agents

これらのルールは、本ワークスペースで作業するAIエージェントのためのものです。コードベースの一貫性を維持するため、厳格に遵守してください。

---

## 1. Editorial Principles（編集方針）
* **Concept**: USAFactsをモデルにした、一般読者（中高生レベルの事前知識で理解できる）向けのデータジャーナリズムサイト。
* **Stance**: 「偏見やイメージではなく、信頼できるデータで、日本を正しく見る。数字は、嘘をつかない。」結論は読者に委ね、データによる透明性を提示する。

---

## 2. Article Registration Rules（記事登録ルール）
* **[CRITICAL]** 新規記事を追加する際は、必ず `/src/app/(main)/articles/articles.ts` 内の `articles` 配列の**先頭（最初の要素）**に追加・登録すること（末尾追加は厳禁）。
* **[CRITICAL]** `articles.ts` 内の `label` プロパティは、必ず**英語表記**（例: `"Social Security"`, `"Demographics"`）とする。

---

## 3. Directory & File Structures（ディレクトリ・ファイル構造）
* **Articles**: `src/app/(main)/articles/<slug>/Page.tsx`（※システム仕様に基づき、ファイル名は大文字始まりの `Page.tsx`）
* **Page CSS Module**: `src/app/(main)/articles/<slug>/page.module.css`
* **Data Files**: `/home/mizki/projects/beautiful-japan-numbers/src/data/<filename>.json`
* **Charts**: 
  * `src/app/(main)/articles/<slug>/charts/<ChartName>/<ChartName>.tsx`
  * `src/app/(main)/articles/<slug>/charts/<ChartName>/index.ts`
  * `src/app/(main)/articles/<slug>/charts/<ChartName>/<ChartName>.module.css` (CSSが必要な場合)

---

## 4. Naming Conventions & Code Style（命名規則）
* **Directories**: lowercase `kebab-case`（例: `components/kpi/`）
* **React Components**: `PascalCase`（例: `export function KPICard() {}`）
* **React Component Files**: コンポーネント名と完全一致（例: `KPICard.tsx`, `Page.tsx`）
* **CSS Modules**: コンポーネント名と一致（例: `page.module.css`）
* **CSS Class Names**: `camelCase`（例: `.kpiCard {}`, `.chartContainer {}`）
* **Variables & Functions**: `camelCase`（例: `socialSecurityData`）
* **TypeScript Types & Interfaces**: `PascalCase`（例: `type SocialSecurityData = {}`）
* **Constants**: `UPPER_SNAKE_CASE`（例: `MAX_ARTICLE_WIDTH`）
* **Colors**: 小文字の16進数（例: `#5bbee4`, `#ffffff`）

---

## 5. UI Component & Design System Guidelines
* **Component Architecture**:
  * 構成要素: `ArticleHeader`, `ArticleSource`, `ArticleShell`, `KPISection`, `KPIPrimary`, `KPIGrid`, `ArticleChart`, `ArticleText`
  * `ArticleIntro` は廃止。冒頭・本文・結論の全テキストブロックは `ArticleText` を使用する。
  * `ArticleShell` はシェアボタンを自動インジェクトする構造とする。
* **KPI Section Structure**:
  * 記事上部（ヘッダー直下）に配置し、主要数字を強調する。
  * 使用例:
    ```tsx
    <KPISection>
      <KPIPrimary label="2023年度の社会保障給付費" value="134.3兆円"/>
      <KPIGrid>
        {/* サブKPIアイテム */}
      </KPIGrid>
    </KPISection>
    ```
* **ArticleChart Subtitles**:
  * 対象期間や単位表記（例: `subtitle="1960年〜2023年（単位: 兆円）"`）は、`title` 文字列に含めず、必ず `subtitle` prop に渡す。
  * 出典表記は `ArticleChart` の `source` および `sourceUrl` prop を使用して必ず提示する。
* **Color Palette Rules**:
  * Primary Text: `var(--color-text-primary)` (`#222222`)
  * Secondary Text: `var(--color-text-secondary)` (`#555555`)
  * Muted Text: `var(--color-text-muted)` (`#888888`)
  * Warning / Accent: `var(--color-accent)` (`#c0392b`)
  * Border: `var(--color-border)` (`#e0e0e0`)
  * Section BG: `var(--color-background-section)` (`#f7f7f3`)
  * Primary Brand (Single Series / メイン): `var(--color-brand)` (`#5bbee4` / Civic Sky)
  * Secondary Brand (サブ2): `var(--color-brand-second)` (`#f19db5`)
  * Third Brand (サブ3): `var(--color-brand-third)` (`#7f1084`)
  * Contrast Pair / Secondary Series: `color-mix(in srgb, var(--color-brand) 70%, #1e7aa8)` または `var(--color-brand-second)`
  * Highlight Series: Orange (`#e67e22`)

---

## 6. Coding & Chart Patterns (Next.js & Nivo)
* **Hydration / SSR**: `Page.tsx` は Server Component（`"use client"` なし）を維持する。クライアント側の計算を含むチャートコンポーネントのみ `next/dynamic` で `{ ssr: false }` を指定して動的インポートする。
* **Responsive Hook**: `useMediaQuery` はチャートコンポーネント内部で呼び出す。
* **Nivo Axis Ranges**: `xScale` や `yScale` で明示的に `min` または `max` を指定する場合は、必ず `nice: false` を設定する。
* **Nivo Line Labels**: 折れ線グラフでは標準の凡例（`legend`）を使用せず、ラインの右端等にカスタムSVGレイヤー（`EndLabel` 等）で直接ラベルを配置する。
* **Formatting Utilities**:
  * X軸年表記: `src/lib/chart-format.ts` の `formatYearShort(year, isFirst)` を使用。
  * アノテーション: 同ファイルの `createAnnotationLayer(isMobile)` を使用。

---

## 7. IDE Prompt Generation Protocol（プロンプト生成プロトコル）
ユーザーから生の数値データやテーマが提示された際、AIアシスタントは以下の2要素を一括出力する。

1. **データ保存先の明示**: `/home/mizki/projects/beautiful-japan-numbers/src/data/<filename>.json`
2. **ターゲットパスの指定**: `src/app/(main)/articles/<slug>/Page.tsx`, `page.module.css`, `charts/<ChartName>/<ChartName>.tsx` 等を具体的に直指定する（小文字の page.tsx ではなく大文字始まりの `Page.tsx` を使用）。
3. **スタイル・デザイン指定**: `--color-text-primary` や `--color-brand` 等のCSS変数を直接指示する。
4. **禁止事項**: `DESIGN.md` への参照命令、記事番号（#13等）の記述、手動データ配置手順の冗長な説明は含めない。
5. **記事登録**: `src/app/(main)/articles/articles.ts` の `articles` 配列**先頭**への追加登録指示（`label` は英語表記）を必須で含める。