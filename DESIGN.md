# DESIGN.md — USAFacts インスパイア 市民データメディア（日本語版）

> ブランドカラー `#5BBEE4`。非党派的・信頼・データジャーナリズム UI。

---

## 1. Color Palette & Roles

### Brand
- **Civic Sky** (`#5BBEE4`): アクティブ状態・CTA・チップ選択のみ。広面積に使わない
- **Civic Sky Dark** (`#3A9DC4`): ホバー・押下

### Neutral
- **Text Primary** (`#1A1A1A`): 見出し・本文
- **Text Secondary** (`#555555`): キャプション・出典
- **Text Muted** (`#888888`): 更新日・バイライン
- **Border** (`#E0E0E0`): カード枠・区切り線
- **Background** (`#FFFFFF`): ページ背景
- **Background Section** (`#F7F7F3`): セクション帯・テーブルヘッダー

### Data Visualization
- Primary `#5BBEE4` / Secondary `#F06449` / Tertiary `#2E9E6E` / Reference `#AAAAAA`
- Positive `#2E7D4F` / Negative `#C0392B`

---

## 2. Typography

### font-family

```css
/* 本文・UI（和文を必ず先頭に） */
font-family:
  "Noto Sans JP", "ヒラギノ角ゴ ProN W3", "游ゴシック体", "メイリオ",
  "Helvetica Neue", Arial, sans-serif;

/* 数値・チャートラベル */
font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
```

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Hero | 40px | 700 | 1.3 | −0.01em + `palt` |
| H1 | 32px | 700 | 1.4 | −0.01em + `palt` |
| H2 Stat Headline | 22px | 700 | 1.5 | 0 |
| H2 Section | 20px | 700 | 1.5 | 0 |
| Body | 16px | 400 | 1.8 | 0.04em |
| Caption / Body Small | 14px | 400 | 1.8 | 0.04em |
| Label / Chip | 13px | 500 | 1.4 | 0.06em |
| Source Citation | 12px | 400 | 1.6 | 0.04em |
| Data Value (KPI) | 36px | 700 | 1.2 | −0.02em |

### 日本語ルール

```css
body, p, li, td {
  word-break: normal;
  line-break: strict;
  hanging-punctuation: first last;
}
h1, h2, h3 {
  font-feature-settings: "palt" 1, "kern" 1;
}
.data, table td, .chart-label {
  font-feature-settings: "tnum" 1, "lnum" 1;
  font-variant-numeric: tabular-nums lining-nums;
}
```

---

## 3. Components

### Navigation
- 高さ 56px、sticky、`border-bottom: 1px solid #E0E0E0`
- リンク: 14px / 500 / `#555555`、アクティブ: `#5BBEE4` + `border-bottom: 2px solid #5BBEE4`

### Topic Chips
```
通常: bg #F7F7F7, border 1px solid #E0E0E0, color #1A1A1A
選択: bg #5BBEE4, color #FFFFFF
radius 9999px, padding 6px 16px, font 500 13px / 0.06em
```

### Buttons
```
Primary:   bg #5BBEE4, color #FFFFFF, radius 4px, padding 10px 20px
Secondary: bg transparent, border 1.5px solid #5BBEE4, color #5BBEE4
Hover:     #3A9DC4 / rgba(91,190,228,0.08)
Focus:     box-shadow 0 0 0 3px rgba(91,190,228,0.30)
```

### Cards
```
bg #FFFFFF, border 1px solid #E0E0E0, radius 4px, padding 16px
Hover: box-shadow 0 2px 12px rgba(0,0,0,0.08), translateY(-2px), 200ms
```

### Stat Headline（最重要パターン）
チャート直前に発見文 → Source → チャートの順を必ず守る。
```
.stat-headline: font 700 22px, color #1A1A1A, line-height 1.5
.source-label:  font 400 12px, color #888888, margin-top 4px
例) "2024年、成人の73%が「まあまあやれている」と回答"
例) "Source: 厚生労働省"
```

### Data Table
```css
thead th { background: #F7F7F7; font: 600 13px; border-bottom: 2px solid #5BBEE4; }
tbody td  { border-bottom: 1px solid #F0F0F0; font-feature-settings: "tnum" 1, "lnum" 1; }
tr:hover  { background: rgba(91,190,228,0.05); }
td.numeric { text-align: right; }
```

### Footer
```
bg #1A1A1A, text #FFFFFF / rgba(255,255,255,0.6)
列構成: トピック | リソース | SNSアイコン | 著作権・利用規約
```

---

## 4. Layout

- Spacing: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`
- Container: max-width 1200px、padding 24px
- 記事本文: max-width 720px（1行40〜60字）
- カードグリッド: 3列、gap 24px

---

## 5. Responsive

| Breakpoint | Width | 変化 |
|------------|-------|------|
| Mobile | ≤ 767px | 1列・ハンバーガーナビ・Hero 28px・padding 16px |
| Tablet | 768–1023px | 2列カード |
| Desktop | ≥ 1024px | 3列・max-width 1200px |

- 本文 16px 固定（iOS Safari ズーム防止）
- Hero 40→28px / H1 32→22px / H2 22→18px
- チャート: `overflow-x: auto`、最小幅 480px
- タッチターゲット 44×44px 以上（`::after { inset: -8px }` で拡張）
- Hover スタイルは `@media (hover: hover)` で囲む

---

## 6. Do's and Don'ts

### Do
- Stat Headline → Source → チャートの順を守る
- 数値に `"tnum" 1, "lnum" 1`、見出しに `"palt" 1` を設定
- 本文: `line-height 1.8`、`word-break: normal`、`line-break: strict`

### Don't
- `#5BBEE4` を背景として広面積に使わない
- `word-break: break-all`（禁則処理が壊れる）
- `border-radius` に中途半端な値（カード 4px・チップ 9999px のみ）
- フォントスタックで和文フォントの前に欧文フォントを置かない
- テキストに純黒 `#000000` を使わない