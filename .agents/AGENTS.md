# Beautiful Japan Numbers Project Rules for AI Agents

These rules are for AI agents working in this workspace. Follow them strictly to maintain codebase consistency.

## 1. Article Registration
* **[CRITICAL]** When adding a new article, always register it at the **very beginning (first element)** of the `articles` array in [articles.ts](file:///home/mizki/projects/beautiful-japan-numbers/src/app/%28main%29/articles/articles.ts). Never append it to the end of the array.

## 2. Directory & File Structures
* **Articles**: `src/app/(main)/articles/<slug>/page.tsx`
* **Charts (no CSS)**: `src/app/(main)/articles/<slug>/chart/ChartName.tsx`
* **Charts (with CSS)**: `src/app/(main)/articles/<slug>/chart/ChartName/ChartName.tsx` + `ChartName.module.css`
* Do not group multiple charts into a single kebab-case folder; keep them organized individually in component folders under `chart/`.

## 3. Naming Conventions
* **Directories**: Use lowercase `kebab-case` (e.g., `components/kpi/`, `components/article-header/`).
* **React Components**: Use `PascalCase` (e.g., `export function KPICard() {}`).
* **React Component Files**: Match the component name exactly (e.g., `KPICard.tsx`).
* **CSS Modules**: Match the component name (e.g., `KPICard.module.css`).
* **CSS Class Names**: Use `camelCase` (e.g., `.kpiCard {}`, `.chartContainer {}`).
* **Variables & Functions**: Use `camelCase` (e.g., `populationData`).
* **TypeScript Types & Interfaces**: Use `PascalCase` (e.g., `type PopulationData = {}`).
* **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_ARTICLE_WIDTH`).
* **Colors**: Write hex codes in lowercase (e.g., `#5bbee4`, `#ffffff`).

## 4. Coding & Chart Patterns (Next.js & Nivo)
* **Hydration / SSR**: Any chart component using client-side calculations (`ResizeObserver`, dynamic sizes, SVG measurements) must be imported in the page/parent using `next/dynamic` with `{ ssr: false }` to avoid hydration mismatches.
* **Nivo Axis Ranges**: When setting explicit `min` or `max` numeric values on Nivo `xScale` or `yScale`, always set `nice: false`.
* **Nivo Line Points**: Hide markers/points on line charts by setting `pointSize: 0`.
* **Legends**: Avoid using standard legends (`legend`). Instead, place series labels directly near the chart elements (e.g., at the right-end of lines or inside bar elements) using custom SVG layers (like `EndLabel`).
* **Year Formatting**: For bottom axis labels, use `formatYearShort(v, isFirst)` from `src/lib/chart-format.ts` to show the full four-digit year for the first label and two-digit year (e.g., '02) for the rest. Use full years in tooltips.
