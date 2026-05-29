import styles from "./Page.module.css";

type Props = {
  children: React.ReactNode;
};

export function Page({ children }: Props) {
  return <main className={styles.page}>{children}</main>;
}