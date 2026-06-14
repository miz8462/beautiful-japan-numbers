"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < lastScrollY.current) {
        // 上スクロール → 必ず表示
        setHidden(false);
      } else if (currentY > 80) {
        // 下スクロール かつ 上部以外 → 隠す
        setHidden(true);
      }
      lastScrollY.current = currentY;
    };
  
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={styles.siteHeader} style={{
      transform: hidden ? "translateY(-100%)" : "translateY(0)",
      transition: "transform 300ms ease",
    }}  >
      <nav className={`${styles.siteNav} container`} aria-label="主要ナビゲーション">
        <Link className={styles.siteBrand} href="/" onClick={() => setIsOpen(false)}>
          <Image
            alt=""
            aria-hidden="true"
            height={20}
            src="/icons/icon.svg"
            width={20}
          />
          <span>美しい日本の数字</span>
        </Link>

        {/* TODO: ハンバーガー */}
        {/* <button
          aria-expanded={isOpen}
          aria-label="メニューを開閉"
          className="site-menu-button"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button> */}
      </nav>
    </header>
  );
}
