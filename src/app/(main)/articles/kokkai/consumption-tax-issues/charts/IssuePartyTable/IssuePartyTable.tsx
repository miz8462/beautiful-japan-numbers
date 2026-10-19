"use client";

import data from "@/data/consumption-tax-issues.json";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./IssuePartyTable.module.css";

type Issue = {
    id: string;
    label: string;
    member: {
        parties: Record<string, number>;
        party_speakers?: Record<string, string[]>;
    };
};

// 並び順定義(IssueBar と同じ)
const GROUP_1 = ["A", "B", "C", "D", "E"]; // 根本問題
const GROUP_2 = ["F", "G", "H", "I"]; // 影響
const GROUP_3 = ["J", "K", "L", "M", "N"]; // やりかた
const ORDERED_IDS = [...GROUP_1, ...GROUP_2, ...GROUP_3];
const GROUP_END_IDS = new Set([
    GROUP_1[GROUP_1.length - 1],
    GROUP_2[GROUP_2.length - 1],
]);

// 列の並び: kokkai-lab の party_mapping.py の登録順
const PARTY_ORDER = [
    "自由民主党",
    "公明党",
    "立憲民主党",
    "国民民主党",
    "日本維新の会",
    "日本共産党",
    "れいわ新選組",
    "参政党",
    "チームみらい",
    "中道改革連合",
];

const rawIssues = (data.issues as Issue[]) || [];
const issueMap = new Map<string, Issue>(rawIssues.map((it) => [it.id, it]));

const ORDERED_ISSUES: Issue[] = ORDERED_IDS.map((id) => {
    const found = issueMap.get(id);
    if (!found) {
        throw new Error(`Issue id ${id} not found in consumption-tax-issues.json`);
    }
    return found;
});

// データに出てくる政党のうち、PARTY_ORDER にないものは末尾に足す
const partiesInData = new Set<string>(
    ORDERED_ISSUES.flatMap((it) => Object.keys(it.member.parties))
);
const PARTIES = [
    ...PARTY_ORDER.filter((p) => partiesInData.has(p)),
    ...[...partiesInData].filter((p) => !PARTY_ORDER.includes(p)),
];

type ActiveTooltip = {
    issueLabel: string;
    party: string;
    speakers: string[];
    rect: DOMRect;
};

export function IssuePartyTable() {
    const [active, setActive] = useState<ActiveTooltip | null>(null);
    const [pos, setPos] = useState<{
        left: number;
        top: number;
        arrowLeft: number;
        isBelow: boolean;
    } | null>(null);
    const [mounted, setMounted] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // ツールチップの位置計算
    useLayoutEffect(() => {
        if (!active) {
            setPos(null);
            return;
        }

        const tooltipEl = tooltipRef.current;
        const tooltipWidth = tooltipEl ? tooltipEl.offsetWidth : 180;
        const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 70;

        const cellCenterX = active.rect.left + active.rect.width / 2;
        const padding = 12;

        const left = Math.max(
            padding,
            Math.min(window.innerWidth - tooltipWidth - padding, cellCenterX - tooltipWidth / 2)
        );
        const arrowLeft = Math.max(
            12,
            Math.min(tooltipWidth - 16, cellCenterX - left - 4)
        );

        // ツールチップを上に出すスペースがあるか判定
        const spaceAbove = active.rect.top;
        const isBelow = spaceAbove < tooltipHeight + 12;

        const top = isBelow
            ? active.rect.bottom + 8
            : active.rect.top - tooltipHeight - 8;

        setPos({ left, top, arrowLeft, isBelow });
    }, [active]);

    // 外側クリック・スクロール・リサイズ時に閉じる
    useEffect(() => {
        if (!active) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
                return;
            }
            setActive(null);
        };

        const handleDismiss = () => {
            setActive(null);
        };

        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("scroll", handleDismiss, true);
        window.addEventListener("resize", handleDismiss);

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("scroll", handleDismiss, true);
            window.removeEventListener("resize", handleDismiss);
        };
    }, [active]);

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <caption className={styles.caption}>
                    論点ごとの政党別の議員の発言者数(人)
                </caption>
                <thead>
                    <tr>
                        <th className={styles.corner} scope="col" />
                        {PARTIES.map((party) => (
                            <th key={party} className={styles.partyHead} scope="col">
                                {party}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ORDERED_ISSUES.map((issue) => (
                        <Fragment key={issue.id}>
                            <tr>
                                <th className={styles.rowHead} scope="row">
                                    {issue.label}
                                </th>
                                {PARTIES.map((party) => {
                                    const n = issue.member.parties[party] ?? 0;
                                    const speakers = issue.member.party_speakers?.[party] ?? [];
                                    const isFilled = n > 0;
                                    const isSelected =
                                        active?.issueLabel === issue.label && active?.party === party;

                                    return (
                                        <td
                                            key={party}
                                            className={isFilled ? styles.filled : styles.empty}
                                        >
                                            {isFilled ? (
                                                <button
                                                    type="button"
                                                    className={`${styles.cellButton} ${
                                                        isSelected ? styles.cellButtonActive : ""
                                                    }`}
                                                    aria-label={`${issue.label}、${party}：${n}人（${speakers.join("、")}）`}
                                                    onMouseEnter={(e) => {
                                                        setActive({
                                                            issueLabel: issue.label,
                                                            party,
                                                            speakers,
                                                            rect: e.currentTarget.getBoundingClientRect(),
                                                        });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setActive(null);
                                                    }}
                                                    onFocus={(e) => {
                                                        setActive({
                                                            issueLabel: issue.label,
                                                            party,
                                                            speakers,
                                                            rect: e.currentTarget.getBoundingClientRect(),
                                                        });
                                                    }}
                                                    onBlur={() => {
                                                        setActive(null);
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setActive((prev) =>
                                                            prev?.issueLabel === issue.label &&
                                                            prev?.party === party
                                                                ? null
                                                                : {
                                                                      issueLabel: issue.label,
                                                                      party,
                                                                      speakers,
                                                                      rect,
                                                                  }
                                                        );
                                                    }}
                                                >
                                                    {n}
                                                </button>
                                            ) : (
                                                "–"
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                            {GROUP_END_IDS.has(issue.id) && (
                                <tr key={`${issue.id}-divider`} aria-hidden="true">
                                    <td className={styles.divider} colSpan={PARTIES.length + 1} />
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>

            {mounted &&
                active &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        role="tooltip"
                        className={`${styles.tooltip} ${
                            pos?.isBelow ? styles.tooltipBelow : styles.tooltipAbove
                        }`}
                        style={{
                            left: pos ? `${pos.left}px` : "-9999px",
                            top: pos ? `${pos.top}px` : "-9999px",
                            opacity: pos ? 1 : 0,
                        }}
                    >
                        <div className={styles.tooltipHeader}>
                            <span className={styles.tooltipParty}>{active.party}</span>
                            <span className={styles.tooltipCount}>{active.speakers.length}人</span>
                        </div>
                        <div className={styles.tooltipIssue}>{active.issueLabel}</div>
                        <div className={styles.tooltipSpeakers}>
                            {active.speakers.map((name) => (
                                <span key={name} className={styles.speakerTag}>
                                    {name}
                                </span>
                            ))}
                        </div>
                        {pos && (
                            <span
                                className={styles.tooltipArrow}
                                style={{ left: `${pos.arrowLeft}px` }}
                            />
                        )}
                    </div>,
                    document.body
                )}
        </div>
    );
}