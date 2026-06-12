import { XIcon } from "@/components/ui/ShareButtons/ShareButtons";
import buttonStyles from "@/components/ui/ShareButtons/ShareButtons.module.css";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={`${styles.siteFooterInner} container`}>
        <button aria-label="Xでシェア" className={`${buttonStyles.roundBtn} ${buttonStyles.x}`}>
          <a
            href="https://x.com/@BJN_Japan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            <XIcon />
          </a>
        </button>
        <p className={styles.siteFooterCopy}>© 2026 Beautiful Japan Numbers</p>
      </div>
    </footer>
  );
}