# DESIGN.md — Civic Data Media Design System

> ブランドカラー `#5bbee4`。
> 非党派的・信頼・データジャーナリズム UI。
> 「主張」ではなく「発見」を提示する。

---

# 1. Color Palette & Roles

## Brand

* **Civic Sky** (`#5bbee4`)

  * アクティブ状態・CTA・選択状態
  * ヘッダー上部のブランドバー

* **Civic Sky Dark** (`#1e7aa8`)

  * hover / active / focus 補助

---

## Neutral

| Role               | Color     |
| ------------------ | --------- |
| Text Primary       | `#222222` |
| Text Secondary     | `#555555` |
| Text Muted         | `#888888` |
| Border             | `#e0e0e0` |
| Background         | `#ffffff` |
| Background Section | `#f7f7f3` |

---

## Data Visualization

| Role      | Color     |
| --------- | --------- |
| Primary   | `#5bbee4` |
| Secondary | `#f06449` |
| Tertiary  | `#2e9e6e` |
| Reference | `#aaaaaa` |
| Positive  | `#2e7d4f` |
| Negative  | `#c0392b` |

---

# 2. Typography

## Font Family

### 本文・UI

```css
font-family:
  "Noto Sans JP",
  "ヒラギノ角ゴ ProN W3",
  "游ゴシック体",
  "メイリオ",
  "Helvetica Neue",
  Arial,
  sans-serif;
```

### 数値・チャートラベル

```css
font-family:
  "Roboto Mono",
  "SFMono-Regular",
  Consolas,
  monospace;
```

---

## Type Scale

| Role             | Size | Weight | Line Height |
| ---------------- | ---- | ------ | ----------- |
| Hero             | 40px | 700    | 1.3         |
| H1               | 32px | 700    | 1.4         |
| H2 Stat Headline | 22px | 700    | 1.5         |
| H2 Section       | 20px | 700    | 1.5         |
| Body             | 16px | 400    | 1.8         |
| Caption          | 14px | 400    | 1.8         |
| Label / Chip     | 13px | 500    | 1.4         |
| Source Citation  | 12px | 400    | 1.6         |
| KPI Value        | 72px | 700    | 1.2         |
| KPI Card Value   | 46px | 700    | 1.5         |

---

## Japanese Typography Rules

```css
body,
p,
li,
td {
  word-break: normal;
  line-break: strict;
  hanging-punctuation: first last;
}

h1,
h2,
h3 {
  font-feature-settings: "palt" 1, "kern" 1;
  letter-spacing: -0.01em;
}

.data,
table td,
.chart-label {
  font-feature-settings: "tnum" 1, "lnum" 1;
  font-variant-numeric: tabular-nums lining-nums;
}
```

---

# 3. Radius System

```css
--radius-sharp: 0px;
--radius-sm: 4px;
--radius-md: 10px;
--radius-pill: 9999px;
```

| Token  | Usage          |
| ------ | -------------- |
| Sharp  | table, divider |
| Small  | button, input, card variants |
| Medium | surface, modal |
| Pill   | chip, tag      |

---

# 4. Components

## Navigation

* 高さ 56px
* fixed header
* ヘッダー全体は 90px
* 上部に 8px のブランドカラーバー
* 背景は `rgba(255,255,255,0.96)`
* `backdrop-filter: blur(12px)`
* 下スクロールで隠れ、上スクロールで表示される

```css
font-size: 14px;
font-weight: 500;
color: #555555;
```

### Active

```css
color: #5bbee4;
::after {
  height: 2px;
  background: #5bbee4;
}
```

---

## Chips / Tags

### Current

```css
background: #5bbee4;
color: #ffffff;
border-radius: 9999px;
padding: 6px 16px;
font-size: 13px;
font-weight: 500;
line-height: 1.4;
letter-spacing: 0.06em;
```

タグはDomain/Themeを統合済みの4種（politics / economy / society / environment）のみを使用する。`TAGS.politics`のように、タグキーから表示ラベル文字列を直接返すフラット構造を用いる。

---

## Buttons

### Shared

```css
display: inline-flex;
min-height: 44px;
align-items: center;
justify-content: center;
border-radius: 4px;
padding: 10px 20px;
font-size: 14px;
font-weight: 500;
letter-spacing: 0.04em;
```

---

### Primary

```css
background: #5bbee4;
color: #ffffff;
border: 1.5px solid #5bbee4;
```

### Secondary

```css
background: transparent;
border: 1.5px solid #5bbee4;
color: #5bbee4;
```

### Interaction

```css
primary hover: #1e7aa8;
secondary hover: rgba(91,190,228,0.08);
focus: box-shadow 0 0 0 3px rgba(91,190,228,0.30);
```

---

## Cards

### Topic Card

```css
background: #ffffff;
border: 1px solid #e0e0e0;
border-radius: 4px;
padding: 16px;
min-height: 184px;
```

### Article Chart Card

```css
background: #ffffff;
border-radius: 4px;
padding: 16px;
overflow: hidden;
```

### Surface

```css
background: #f7f7f3;
border-radius: 10px;
```

### Hover

```css
box-shadow: 0 2px 12px rgba(0,0,0,0.08);
transform: translateY(-2px);
transition: box-shadow 200ms ease, transform 200ms ease;
```

---

## Tables

ランキング表・データ一覧表（品目別価格指数ランキングなど）に使用する。

```css
/* テーブル全体 */
width: 100%;
border-collapse: collapse;
font-size: 14px;

/* ヘッダー行 */
th {
  background: #f7f7f3;
  color: #555555;
  font-weight: 500;
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e0e0e0;
}

/* データ行 */
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e0e0e0;
  font-feature-settings: "tnum" 1, "lnum" 1;
  font-variant-numeric: tabular-nums lining-nums;
}

/* zebra stripingは使わず、border-bottomのみで行を区切る */
```

* 数値の正負はData Visualizationセクションの`Positive`(`#2e7d4f`) / `Negative`(`#c0392b`)を文字色として流用する。背景色や太字での強調は行わない。
* 順位・品目名・基準値・最新値・変化率のように列数が多い表は、モバイルでは`overflow-x: auto`でテーブルごと横スクロールさせる。列を間引いたり改行で縦積みにはしない。
* テーブル内では装飾（影、角丸の多用）を避け、Radius Systemの`--radius-sharp`（0px）を基本とする。

---

## Stat Headline

チャート直前に配置する。

順序：

1. 発見文
2. Source
3. Chart

### Example

```txt
2024年、成人の73%が「まあまあやれている」と回答
Source: 厚生労働省「国民生活基礎調査」(2024)
```

---

## Footer

```css
background: #222222;
color: rgba(255,255,255,0.6);
```

構成：

* SNS（X）
* 著作権

---

## Share Buttons

```css
width: 40px;
height: 40px;
border-radius: 50%;
border: 2px solid;
color: #ffffff;
```

| Service  | Background |
| -------- | ---------- |
| X        | `#000000`  |
| LINE     | `#06c755`  |
| Facebook | `#1877F2`  |
| Copy     | `#888780`  |

---

# 5. Layout

| Rule              | Value  |
| ----------------- | ------ |
| Max Width         | 1200px |
| Page Padding      | 5rem   |
| Mobile Padding    | 1.25rem |
| Article Width     | 720px  |
| Grid Gap          | 24px   |

Spacing Scale:

```txt
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px
```

---

# 6. Responsive

| Breakpoint | Width      |
| ---------- | ---------- |
| Mobile     | ≤ 767px    |
| Tablet     | 768–1023px |
| Desktop    | ≥ 1024px   |

---

## Mobile Rules

* Hero: 40 → 28px
* H1: 40 → 28px
* H2: 22 → 18px
* Body: 16px fixed
* Charts: `overflow: hidden`
* Chart canvas: `min-width: 0`
* Sankey SVG: `min-width: 480px`
* Table: `overflow-x: auto`（テーブルごと横スクロール、列の間引きはしない）
* Touch target: minimum 44×44px

```css
@media (hover: hover) and (pointer: fine) {
  /* hover styles */
}
```

---

# 7. Data Visualization Principles

* 装飾より比較可能性を優先
* 3D表現禁止
* グラデーション多用禁止
* 円グラフは最小限
* 軸は可能な限りゼロ起点
* 単位・出典を必須表示
* 色だけで情報を区別しない
* アニメーションは意味がある場合、または操作状態のフィードバックに限る
* 折れ線グラフのポイントは非表示（pointSize: 0）
* 折れ線グラフのシリーズラベルはチャート内の線の右端に直接表示し、凡例（legend）は使わない
* 利用ライブラリはNivoを基本とする
* Nivoで表現できない構造（政党系譜図、ネットワーク図など複雑なルーティングを要するもの）は、SVGカスタム実装を許容する。その場合も色・フォントはCSS変数（本ドキュメントのカラーパレット・タイポグラフィ）を流用し、独自の値を持ち込まない
* SVGカスタム実装では「動作する結果」を最優先する。実装方式（draw.io書き出し、React/TSX手書きなど）は手段であり、固定しない

---

# 8. Editorial Principles

* データと解釈を分離する
* 見出しで断定しすぎない
* 単一指標で社会を評価しない
* 比較時は定義差異を明示する
* 「主張」ではなく「発見」を提示する

## チャートタイトルの文体

過度な解釈を避け、データをそのまま示すシンプルな記述にする。

* OK: 「女性候補者・議員の割合の推移」
* NG: 「女性の社会進出は進んでいる」

タイトルは観測されたデータの内容を述べるに留め、解釈・評価・トレンドの是非はStat Headlineの発見文や本文側で扱う。

## 出典表記のルール

記事内で使用するデータソースの構成によって、表記位置を分岐する。

* **同一ソースのみで構成される記事**：ページ冒頭に一行でまとめて表記し、各チャート直下の個別表記は省略する。
* **複数ソースが混在する記事**：各チャート直下にのみ個別表記し、ページ冒頭のまとめは行わない。

---

# 9. Do's and Don'ts

## Do
* 新規記事は/src/app/(main)/articles/articles.tsの一番上に追記する
* Stat Headline → Source → Chart の順を守る
* Source がページヘッダー側にある場合は、チャート直前の Source を省略できる（「出典表記のルール」のうち同一ソース記事の場合）
* 数値に `"tnum"` を適用
* 見出しに `"palt"` を適用
* 本文 line-height は 1.8

---

## Don't

* `word-break: break-all` を使わない
* フォントスタックで欧文フォントを先頭に置かない
* 主要 UI の背景に純黒 `#000000` を使わない（X ブランドボタンを除く）

# 10. Naming Conventions

## Directories

### ディレクトリ名は小文字の kebab-case を使用する。

* components/
* components/kpi/
* components/article-header/
* app/population/

### 禁止:

* KPI/
* ArticleHeader/
* article_header/
* React Components

## React コンポーネント名は PascalCase を使用する。

* export function KPICard() {}
* export function KPISection() {}
* export function ArticleHeader() {}
* Component Files

## React コンポーネントファイル名はコンポーネント名と一致させる。

* KPICard.tsx
* KPIGrid.tsx
* KPIPrimary.tsx
* KPISection.tsx

## 禁止:

* kpi-card.tsx
* kpicard.tsx
* kpiCard.tsx
* CSS Modules

## Styling

* スタイルはCSS Modulesで記述し、グローバルスタイルは globals.css の :root 変数とベーススタイルのみに限定する

## CSS Module ファイル名は対応するコンポーネント名と一致させる。

* KPICard.module.css
* KPIGrid.module.css
* KPIPrimary.module.css
* KPISection.module.css
* Variables

## 変数名・関数名は camelCase を使用する。

* populationData
* articleList
* chartOptions
* Types

## TypeScript の型・インターフェースは PascalCase を使用する。

* type PopulationData = {}
* type KPIItem = {}

* interface ArticleMetadata {}

## Constants

### 共有定数は UPPER_SNAKE_CASE を使用する。

* MAX_ARTICLE_WIDTH
* DEFAULT_PAGE_SIZE
* CHART_ANIMATION_DURATION

## CSS Classes

### CSS Modules のクラス名は camelCase を使用する。

* .kpiCard {}
* .kpiGrid {}
* .articleHeader {}
* .chartContainer {}

## Color Values

### カラーコードは小文字で記述する。

* #5bbee4
* #ffffff
* #e0e0e0

## 記事・チャートのファイル構成

* 記事: `src/app/(main)/articles/<slug>/page.tsx`
* チャート（CSS不要）: `articles/<slug>/chart/ChartName.tsx`
* チャート（CSS必要）: `articles/<slug>/chart/chart-name/ChartName.tsx` + `ChartName.module.css`

チャートが複数ある記事では、`chart/`配下にコンポーネント単位でこの規則を個別に適用する（記事全体で1つのkebab-caseフォルダにまとめない）。