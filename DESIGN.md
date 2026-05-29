# DESIGN.md — Civic Data Media Design System

> ブランドカラー `#5BBEE4`。
> 非党派的・信頼・データジャーナリズム UI。
> 「主張」ではなく「発見」を提示する。

---

# 1. Color Palette & Roles

## Brand

* **Civic Sky** (`#5BBEE4`)

  * アクティブ状態・CTA・選択状態のみ
  * 広面積背景には使用しない

* **Civic Sky Dark** (`#3A9DC4`)

  * hover / active / focus 補助

---

## Neutral

| Role               | Color     |
| ------------------ | --------- |
| Text Primary       | `#1A1A1A` |
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
| Hero             | 40px | 00    | 1.3         |
| H1               | 32px | 700    | 1.4         |
| H2 Stat Headline | 22px | 700    | 1.5         |
| H2 Section       | 20px | 700    | 1.5         |
| Body             | 16px | 400    | 1.8         |
| Caption          | 14px | 400    | 1.8         |
| Label / Chip     | 13px | 500    | 1.4         |
| Source Citation  | 12px | 400    | 1.6         |
| KPI Value        | 36px | 700    | 1.2         |

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
--radius-sm: 6px;
--radius-md: 10px;
--radius-pill: 9999px;
```

| Token  | Usage          |
| ------ | -------------- |
| Sharp  | table, divider |
| Small  | button, input  |
| Medium | card, modal    |
| Pill   | chip, tag      |

---

# 4. Components

## Navigation

* 高さ 56px
* sticky
* `border-bottom: 1px solid #E0E0E0`

```css
font-size: 14px;
font-weight: 500;
color: #555555;
```

### Active

```css
color: #5BBEE4;
border-bottom: 2px solid #5BBEE4;
```

---

## Topic Chips

### Default

```css
background: #F7F7F7;
border: 1px solid #E0E0E0;
color: #1A1A1A;
border-radius: 9999px;
padding: 6px 16px;
```

### Selected

```css
background: #5BBEE4;
color: #FFFFFF;
```

---

## Buttons

### Primary

```css
background: #5BBEE4;
color: #FFFFFF;
border-radius: 6px;
padding: 10px 20px;
```

### Secondary

```css
background: transparent;
border: 1.5px solid #5BBEE4;
color: #5BBEE4;
```

### Interaction

```css
hover: #3A9DC4;
focus: box-shadow 0 0 0 3px rgba(91,190,228,0.30);
```

---

## Cards

```css
background: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 10px;
padding: 16px;
```

### Hover

```css
box-shadow: 0 2px 12px rgba(0,0,0,0.08);
transform: translateY(-2px);
transition: 200ms ease-out;
```

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

## Data Table

```css
thead th {
  background: #F7F7F3;
  border-bottom: 2px solid #5BBEE4;
  font-weight: 600;
  font-size: 13px;
}

tbody td {
  border-bottom: 1px solid #F0F0F0;
}

tr:hover {
  background: rgba(91,190,228,0.05);
}

td.numeric {
  text-align: right;
}
```

---

## Footer

```css
background: #1A1A1A;
color: rgba(255,255,255,0.6);
```

構成：

* トピック
* リソース
* SNS
* 著作権・利用規約

---

# 5. Layout

| Rule              | Value  |
| ----------------- | ------ |
| Max Width         | 1200px |
| Container Padding | 24px   |
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
* H1: 32 → 22px
* H2: 22 → 18px
* Body: 16px fixed
* Charts: `overflow-x: auto`
* Minimum chart width: 480px
* Touch target: minimum 44×44px

```css
@media (hover: hover) {
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
* アニメーションは意味がある場合のみ

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
* 数値に `"tnum"` を適用
* 見出しに `"palt"` を適用
* 本文 line-height は 1.8

---

## Don't

* `#5BBEE4` を広面積背景に使わない
* `word-break: break-all` を使わない
* フォントスタックで欧文フォントを先頭に置かない
* 純黒 `#000000` を使わない
