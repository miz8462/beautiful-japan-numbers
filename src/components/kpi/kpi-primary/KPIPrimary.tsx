import styles from "./KPIPrimary.module.css";

type Props = {
  value: string;
  caption?: string;
}

export function KPIPrimary({ value, caption }: Props) {
  return (
    <>
      <p className={styles.kpiValue}>{value}</p>
      {caption && <p className={styles.kpiCaption}>{caption}</p>}
    </>
  );
}