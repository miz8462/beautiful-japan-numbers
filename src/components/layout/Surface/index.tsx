import styles from "./Surface.module.css";

type Props = {
  children: React.ReactNode;
};

export function Surface({ children }: Props) {
  return <div className={styles.surface}>{children}</div>;
}