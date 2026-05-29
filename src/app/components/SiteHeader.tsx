"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header"   >
      <nav className="site-nav container" aria-label="主要ナビゲーション">
        <Link className="site-brand" href="/" onClick={() => setIsOpen(false)}>
          <Image
            alt=""
            aria-hidden="true"
            height={20}
            src="/icons/icon.svg"
            width={20}
          />
          <span>美しい日本の数字</span>
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label="メニューを開閉"
          className="site-menu-button"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
