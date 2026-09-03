# Beautiful Japan Numbers Project Rules for AI Agents

These rules are for AI agents working in this workspace. Follow them strictly to maintain codebase consistency.

## 1. Editorial Principles
* **Concept**: Data journalism site modeled after USAFacts, accessible to general readers (junior high school level context).
* **Stance**: "See Japan accurately through reliable data, not prejudice or images. Numbers don't lie." Present transparent facts and leave conclusions to the reader.

## 2. Article Registration Rules
* **[CRITICAL]** When adding a new article, always register it at the **very beginning (first element)** of the `articles` array in [articles.ts](file:///home/mizki/projects/beautiful-japan-numbers/src/app/%28main%29/articles/articles.ts). Never append it to the end.
* **[CRITICAL]** The `label` property in `articles.ts` MUST be written in **English** (e.g., `"Social Security"`, `"Demographics"`).

## 3. Directory & File Structures
* **Articles**: `src/app/(main)/articles/<slug>/page.tsx`
* **Data Files**: `/home/mizki/projects/beautiful-japan-numbers/src/data/<filename>.json`
* **Charts (without CSS)**: `src/app/(main)/articles/<slug>/charts/<ChartName>.tsx`
* **Charts (with CSS)**: `src/app/(main)/articles/<slug>/charts/<ChartName>/<ChartName>.tsx` + `<ChartName>.module.css`
* Do not group multiple charts into a single kebab-case folder; keep them organized individually under `charts/`.

## 4. Naming Conventions
* **Directories**: Use lowercase `kebab-case` (e.g., `components/kpi/`, `components/article-header/`).
* **React Components**: Use `PascalCase` (e.g., `export function KPICard() {}`).
* **React Component Files**: Match the component name exactly (e.g., `KPICard.tsx`).
* **CSS Modules**: Match the component name (e.g., `KPICard.module.css`).
* **CSS Class Names**: Use `camelCase` (e.g., `.kpiCard {}`, `.chartContainer {}`).
* **Variables & Functions**: Use `camelCase` (e.g., `socialSecurityData`).
* **TypeScript Types & Interfaces**: Use `PascalCase` (e.g., `type SocialSecurityData = {}`).
* **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_ARTICLE_WIDTH`).
* **Colors**: Write hex codes in lowercase (e.g., `#5bbee4`, `#ffffff`).

## 5. UI Component & Design System Guidelines
* **Component Architecture**:
  * Use `ArticleHeader`, `ArticleSource`, `ArticleShell`, `KPISection`, `KPIPrimary`, `KPIGrid`, `ArticleChart`, and `ArticleText`.
  * All body text, introductions, and conclusions must use `ArticleText`.
* **KPI Display**: Place key metric highlights at the top of the article using `KPISection`, `KPIPrimary`, and `KPIGrid`.
* **ArticleChart Subtitles**: Pass year ranges or unit details to the `subtitle` prop (e.g., `subtitle="1990〜2023年度の推移（兆円）"`), NOT in the `title` string.
* **Color Palette Rules**:
  * Primary Text: `var(--color-text-primary)` (`#222222`)
  * Secondary Text: `var(--color-text-secondary)` (`#555555`)
  * Muted Text: `var(--color-text-muted)` (`#888888`)
  * Warning / Accent: `var(--color-accent)` (`#c0392b`)
  * Primary Brand (Single Series): `var(--color-brand)` (`#5bbee4` / Civic Sky)
  * Secondary Brand: `var(--color-brand-second)` (`#f19db5`)
  * Contrast Pair / Secondary Series: Use `color-mix(in srgb, var(--color-brand) 70%, #1e7aa8)` or `var(--color-brand-second)` rather than creating arbitrary new colors.
  * Highlight Series: Orange (`#e67e22`).

## 6. Coding & Chart Patterns (Next.js & Nivo)
* **Hydration / SSR**: Pages must remain Server Components (no `"use client"`). Any chart component using client-side calculations (`ResizeObserver`, dynamic sizes, SVG measurements) must be dynamically imported in `page.tsx` using `next/dynamic` with `{ ssr: false }`.
* **Responsive Hook**: Call `useMediaQuery` inside the chart component.
* **Nivo Axis Ranges**: When setting explicit `min` or `max` numeric values on Nivo `xScale` or `yScale`, always set `nice: false`.
* **Nivo Line Points & Labels**:
  * Set `pointSize: 0` to hide markers on line charts.
  * Avoid standard legends (`legend`). Instead, place series labels directly near the chart elements (e.g., at the right end of lines) using custom SVG layers (e.g., `EndLabel`).
* **Year & Annotation Formatting**:
  * Use `formatYearShort(v, isFirst)` from `src/lib/chart-format.ts` for x-axis labels.
  * Use `createAnnotationLayer(isMobile)` from `src/lib/chart-format.ts` for annotations.