import styles from "./SankeyInfoPanel.module.css";

export type SankeyInfoPanelState = {
  title: string;
  subtitle: string;
};

export const DEFAULT_SANKEY_INFO_PANEL: SankeyInfoPanelState = {
  title: "詳細",
  subtitle: "",
};

export function SankeyInfoPanel({ state }: { state: SankeyInfoPanelState }) {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>{state.title}</div>
      <div className={styles.subtitle}>{state.subtitle}</div>
    </div>
  );
}
