# DESIGN.md — Civic Data Media Design System

> ブランドカラー `#5BBEE4`。
> 非党派的・信頼・データジャーナリズム UI。
> 「主張」ではなく「発見」を提示する。

---

# 1. Color Palette & Roles

## Brand

* **Civic Sky** (`#5BBEE4`)

  * アクティブ状態・CTA・選択状態
  * ヘッダー上部のブランドバー

* **Civic Sky Dark** (`#3A9DC4`)

  * hover / active / focus 補助

---

## Neutral

| Role               | Color     |
| ------------------ | --------- |
| Text Primary       | `#222222` |
| Text Secondary     | `#555555` |
| Text Muted         | `#888888` |
| Border             | `#E0E0E0` |
| Background         | `#FFFFFF` |
| Background Section | `#F7F7F3` |

---

## Data Visualization

| Role      | Color     |
| --------- | --------- |
| Primary   | `#5BBEE4` |
| Secondary | `#F06449` |
| Tertiary  | `#2E9E6E` |
| Reference | `#AAAAAA` |
| Positive  | `#2E7D4F` |
| Negative  | `#C0392B` |

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
color: #5BBEE4;
::after {
  height: 2px;
  background: #5BBEE4;
}
```

---

## Chips / Tags

### Current

```css
background: #5BBEE4;
color: #FFFFFF;
border-radius: 9999px;
padding: 6px 16px;
font-size: 13px;
font-weight: 500;
line-height: 1.4;
letter-spacing: 0.06em;
```

Default / unselected chip state is not currently implemented.

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
background: #5BBEE4;
color: #FFFFFF;
border: 1.5px solid #5BBEE4;
```

### Secondary

```css
background: transparent;
border: 1.5px solid #5BBEE4;
color: #5BBEE4;
```

### Interaction

```css
primary hover: #3A9DC4;
secondary hover: rgba(91,190,228,0.08);
focus: box-shadow 0 0 0 3px rgba(91,190,228,0.30);
```

---

## Cards

### Topic Card

```css
background: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 4px;
padding: 16px;
min-height: 184px;
```

### Article Chart Card

```css
background: #FFFFFF;
border-radius: 4px;
padding: 16px;
overflow: hidden;
```

### Surface

```css
background: #F7F7F3;
border-radius: 10px;
```

### Hover

```css
box-shadow: 0 2px 12px rgba(0,0,0,0.08);
transform: translateY(-2px);
transition: box-shadow 200ms ease, transform 200ms ease;
```

---

## Stat Headline

チャート直前に配置する。

順序：

1. 発見文
2. Source
3. Chart

Source がページヘッダー側にある場合、チャート直前の Source は省略されることがある。

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
color: #FFFFFF;
```

| Service  | Background |
| -------- | ---------- |
| X        | `#000000`  |
| LINE     | `#06C755`  |
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

---

# 8. Editorial Principles

* データと解釈を分離する
* 見出しで断定しすぎない
* 単一指標で社会を評価しない
* 比較時は定義差異を明示する
* 「主張」ではなく「発見」を提示する

---

# 9. Do's and Don'ts

## Do

* Stat Headline → Source → Chart の順を守る
* Source がページヘッダー側にある場合は、チャート直前の Source を省略できる
* 数値に `"tnum"` を適用
* 見出しに `"palt"` を適用
* 本文 line-height は 1.8

---

## Don't

* `word-break: break-all` を使わない
* フォントスタックで欧文フォントを先頭に置かない
* 主要 UI の背景に純黒 `#000000` を使わない（X ブランドボタンを除く）
