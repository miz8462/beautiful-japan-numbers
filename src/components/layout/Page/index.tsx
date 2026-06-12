import styles from "./PageLayout.module.css";

type Props = {
  children: React.ReactNode;
};

export function PageLayout({ children }: Props) {
  return <main className={styles.page}>{children}</main>;
}