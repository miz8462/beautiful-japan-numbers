import { XIcon } from "@/components/ui/ShareButtons/ShareButtons";
import styles from "@/components/ui/ShareButtons/ShareButtons.module.css";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <button aria-label="Xでシェア" className={`${styles.roundBtn} ${styles.x}`}>
          <a
            href="https://x.com/@BJN_Japan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            <XIcon />
          </a>
        </button>
        <p className="site-footer-copy">© 2026 Beautiful Japan Numbers</p>
      </div>
    </footer>
  );
}