"use client";

import { useState } from "react";
import styles from "./ShareButtons.module.css";

type Props = {
  title: string;
};

export function ShareButtons({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => window.location.href;
  const getText = () => `${title} | 美しい日本の数字`;

  const handleXShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(getText())}`,
      "_blank", "noopener,noreferrer"
    );
  };

  const handleLineShare = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getUrl())}`,
      "_blank", "noopener,noreferrer"
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      "_blank", "noopener,noreferrer"
    );
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.footer}>
      <button onClick={handleXShare} aria-label="Xでシェア" className={`${styles.roundBtn} ${styles.x}`}>
        <XIcon />
      </button>
      <button onClick={handleLineShare} aria-label="LINEでシェア" className={`${styles.roundBtn} ${styles.line}`}>
        <LineIcon />
      </button>
      <button onClick={handleFacebookShare} aria-label="Facebookでシェア" className={`${styles.roundBtn} ${styles.facebook}`}>
        <FacebookIcon />
      </button>
      <button onClick={handleCopyLink} aria-label="リンクをコピー" className={`${styles.roundBtn} ${styles.copy}`}>
        {copied ? <CheckIcon /> : <LinkIcon />}
      </button>
    </div>
  );
}

export function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 3.16 1.67 5.95 4.23 7.7-.18.65-.67 2.35-.77 2.72-.12.46.17.45.36.33.15-.1 1.93-1.3 2.71-1.83.45.06.92.08 1.47.08 5.52 0 10-4.03 10-9 0-4.97-4.48-9-10-9zm-3.5 11.5h-1.5v-5h1.5v5zm3.25 0h-1.5v-3.25L8.5 13.5H7v-5h1.5v3.25L10.25 8.5h1.5v5zm4.25 0h-4v-5h1.5v3.5h2.5v1.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}