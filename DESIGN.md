# DESIGN.md — Civic Data Media Design System

> ブランドカラー `#5bbee4`。
> 非党派的・信頼・データジャーナリズム UI。
> 「主張」ではなく「発見」を提示する。

---

# 1. Color Palette & Roles

## Brand

* **Civic Sky** (`#5bbee4` / CSS変数: `--color-brand`)

  * アクティブ状態・CTA・選択状態
  * ヘッダー上部のブランドバー

* **Civic Sky Dark** (`#1e7aa8` / CSS変数: `--color-brand-dark`)

  * hover / active / focus 補助

* **Civic Sky Pink** (`#f19db5` / CSS変数: `--color-brand-second`)

  * 複数系列チャートの第2系列などの配色補助

* **Civic Sky Purple** (`#7f1084` / CSS変数: `--color-brand-third`)

  * 複数系列チャートの第1系列などの配色補助

---

## Neutral

| Role               | Color     | CSS Variable |
| ------------------ | --------- | ------------ |
| Text Primary       | `#222222` | `--color-text-primary` |
| Text Secondary     | `#555555` | `--color-text-secondary` |
| Text Muted         | `#888888` | `--color-text-muted` |
| Border             | `#e0e0e0` | `--color-border` |
| Background         | `#ffffff` | `--color-background` |
| Background Section | `#f7f7f3` | `--color-background-section` |

---

## Data Visualization

| Role      | Color     | CSS Variable |
| --------- | --------- | ------------ |
| Primary   | `#5bbee4` | `--color-brand` |
| Secondary | `#f06449` | `--color-brand-second` |
| Tertiary  | `#2e9e6e` | `--color-brand-third` |
| Reference | `#aaaaaa` | `--color-data-reference` |
| Positive  | `#2e7d4f` | `--color-data-positive` |
| Negative  | `#c0392b` | `--color-accent` |

### 10系列カテゴリカルパレット

費目別シェアなど、順序よりも分類の識別を優先する10系列チャートでは以下を使用する。
Civic Sky系だけに寄せると判別性が落ちるため、ブランド色を主系列に残しつつ、暖色・緑・紫・中立色を混ぜる。

| Category | Color |
| -------- | ----- |
| Civic Sky | `#5bbee4` |
| Civic Sky Dark | `#1e7aa8` |
| Coral | `#f06449` |
| Green | `#2e9e6e` |
| Gold | `#f2b134` |
| Purple | `#7b6fd6` |
| Rose | `#c06c84` |
| Olive | `#8fbf67` |
| Brown Gray | `#7a5c58` |
| Neutral | `#aaaaaa` |

### 系列カラーの使い分け

* 単一系列のチャート：Primary（`#5bbee4` / `--color-brand`）
* 2系列の対比（名目 vs 実質、貯蓄 vs 負債など）：Primary（`#5bbee4` / `--color-brand`）＋ Purple（`#7f1084` / `--color-brand-third`）
* 3系列の構成比（第1次・第2次・第3次産業など）：第1系列に `--color-brand-third` (`#7f1084`)、第2系列に `--color-brand` (`#5bbee4`)、第3系列に `--color-brand-dark` (`#1e7aa8`) を割り当てる
* 変化を示すチャート（ダンベルチャート等）：基準点（過去）は Neutral Muted（`--color-text-muted` / `#888888`）、増加系列は `--color-brand`（`#5bbee4`）、減少系列は `--color-accent`（`#c0392b`）
* 負債・マイナス要素・負担率など「望ましくない」方向を示す単一系列：Negative（`#c0392b` / `--color-accent`）
* 目立たせる必要のない/補助的な系列：新しい色相を導入せず、`--color-brand`と`--color-brand-dark`の間を`color-mix(in srgb, var(--color-brand) X%, white)`で埋めたグラデーションを使う
* データが欠落・非公表の年/カテゴリ：`--color-text-muted`（#888888）の単色で表現し、他の系列と混同しないようにする

---

# 2. Typography

## Font Family

CSS設計におけるフォントの指定には、直接記述するほかにグローバル定義された変数（`var(--font-body)` および `var(--font-data)`）の使用を推奨する。

### 本文・UI (`--font-body`)

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

### 数値・チャートラベル (`--font-data`)

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
font-size: 16px;
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
font-size: 16px;
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
font-size: 16px;
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
font-size: 16px;

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

## ArticleChart

チャートを包む共通コンポーネント `ArticleChart` のプロパティは以下の役割で使い分ける。

* **`intro` (導入・解説)**
  * 一般の読者にとって馴染みが薄い、または理解しづらい専門用語・概念の解説を記述する（例：「名目GDPとは」「SNA基準とは」など）。
* **`note` (注記・補足)**
  * データに関する技術的な注釈や但し書きを記述する（例：統計基準の移行に伴う段差の説明、欠損値の扱い、出典以外の技術的な補足など）。

### チャート解説文（本文）の配置ルール

* チャートが示すデータ推移の詳細や、そこから読み取れる背景の分析・解説は、`ArticleChart` 内のプロパティではなく、チャートコンポーネントの直下に配置した **`ArticleText` コンポーネント**を用いて記述する。
* 複数のチャートがある場合は、各 `ArticleChart`（`styles.charts` クラスでラップしたコンテナ内）の直後に `ArticleText` を配置し、「チャートを見せる」→「そのチャートの解説を読ませる」の流れを交互に繰り返すレイアウトにする。

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
| Page Padding      | 8.5rem   |
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
* Body: 20px fixed
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
* チャート内のシリーズラベルは要素（線の右端・棒の内側など）に直接表示し、凡例（legend）は使わない
* 積み上げ棒グラフでは、セグメントの高さがラベルを収められる場合のみ内部にラベルを表示する。全期間分は必要なく、直近期間など代表的な1本にラベルがあれば凡例の代替として十分機能する* 利用ライブラリはNivoを基本とする
* Nivoの`xScale`/`yScale`で`min`/`max`を数値で明示指定する場合は、必ず`nice: false`もセットで指定する
  （`nice`が有効だとキリのいい数値までドメインが自動拡張され、指定範囲の外側に余白ができることがある）
* 軸ラベル（年表記）は、一番左の数値のみ四桁フル表記（例：1995）、それ以外は西暦下二桁（例：02, 25）。`src/lib/chart-format.ts`の`formatYearShort()`を使用する。ツールチップなど詳細情報の文脈ではフル表記（2002年）を用いる
* Nivoで表現できない構造（政党系譜図、ネットワーク図など複雑なルーティングを要するもの、あるいはインラインでの右端シリーズラベル配置、ダンベルチャート等の変則表現）は、SVG/D3カスタム実装を許容する。その場合も色・フォントはCSS変数（本ドキュメントのカラーパレット・タイポグラフィ）を流用し、独自の値を持ち込まない
* SVGカスタム実装では「動作する結果」を最優先する。実装方式（draw.io書き出し、React/TSX手書きなど）は手段であり、固定しない
* SVGカスタム実装におけるレイアウトとレスポンシブ対応方針：
  * **サイズ監視**: 親コンテナ（`.wrapper`等）に `position: relative; width: 100%` を適用し、React の `ResizeObserver` を用いて動的に横幅（および高さ）を取得する。
  * **マージンとインラインラベル**: チャート右端などにシリーズ名等をインライン表示する場合、マージン幅を画面サイズ（`useMediaQuery` 等）に応じて動的調整する（例：PC版 `right: 90px`、モバイル版 `right: 70px`）。インラインのフォントサイズもPC版 `18px` からモバイル版 `10px` に縮小させるなどの対応を行う。
  * **Y軸業種ラベルの折り返し**: Y軸の項目名が長い場合は、改行コード（`\n`）でスプリットし、SVG `<tspan>` を用いて2行で表示（例：1行目 `dy={-7}`, 2行目 `dy={16}`）する。項目名フォントサイズはPC版 `15px` からモバイル版 `11px` に縮小させるなどの対応を行う。
  * **カスタムツールチップ**: チャートエリアにホバーした際は、ラッパー内に絶対配置（`position: absolute`）する HTML 要素のツールチップを構築する。数値の縦位置アライメントには `tabular-nums` を指定し、ドットなどの凡例色には CSS 変数を使用する。
  * **横スクロールの適用**: 画面幅に対してチャートの最小幅が規定される場合は、コンテナ（`.chartContainer`）に `overflow-x: auto; -webkit-overflow-scrolling: touch;` を設定してモバイル端末でスクロール可能にする。
  * チャートの軸ラベル、ツールチップなどのフォントは16px。
  * アノテーションはチャートの上に。基本はoffset：-8 重なる場合は後者を -24にする。またフォントサイズは12px。
  * タイトルが17文字以上のときは読みやすい位置で改行をする。
  * タイトル横のyearRangeに「年」や「年度」は付けない

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

* 各チャート直下に必ず表記する

---

# 9. Do's and Don'ts

## Do
* 新規記事は/src/app/(main)/articles/articles.tsの一番上に追記する
* Stat Headline → Source → Chart の順を守る
* Source がページヘッダー側にある場合は、チャート直前の Source を省略できる（「出典表記のルール」のうち同一ソース記事の場合）
* 数値に `"tnum"` を適用
* 見出しに `"palt"` を適用
* 本文 line-height は 1.8
* クライアント側の寸法計算や `ResizeObserver` / SVGの動的サイズ描画を伴うチャートコンポーネントは、ハイドレーションエラー（SSR時の描画差分）を避けるため、必ず `next/dynamic` を使用して `{ ssr: false }` でインポート・マウントする。
* インパクトのある単一指標（残高・人口減少数など、記事の核となる数値）は、記事冒頭でKPISection / KPIPrimary / KPIGrid を用いてKPI表示する。ArticleTextの本文中に埋め込むだけでなく、数値そのものを大きく見せる

---

## Don't

* `word-break: break-all` を使わない
* フォントスタックで欧文フォントを先頭に置かない
* 主要 UI の背景に純黒 `#000000` を使わない（X ブランドボタンを除く）
* 「年度」は使わず「年」にする

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
* チャート（CSS必要）: `articles/<slug>/chart/ChartName/ChartName.tsx` + `ChartName.module.css`

チャートが複数ある記事では、`chart/`配下にコンポーネント単位でこの規則を個別に適用する（記事全体で1つのkebab-caseフォルダにまとめない）。