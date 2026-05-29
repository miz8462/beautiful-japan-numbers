"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/government-spending", label: "政府支出" },
  { href: "/population", label: "人口" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header"   >
      <nav className="site-nav container" aria-label="主要ナビゲーション">
        <Link className="site-brand" href="/" onClick={() => setIsOpen(false)}>
          美しい日本の数字
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
        <div className="site-nav-links" data-open={isOpen}>
          {links.map((link) => (
            <Link
              aria-current={pathname === link.href ? "page" : undefined}
              className="site-nav-link"
              href={link.href}
              key={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
