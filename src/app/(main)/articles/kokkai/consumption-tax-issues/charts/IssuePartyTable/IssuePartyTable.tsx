import data from "@/data/consumption-tax-issues.json";
import styles from "./IssuePartyTable.module.css";

type Issue = {
    id: string;
    label: string;
    member: { parties: Record<string, number> };
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

export function IssuePartyTable() {
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
                        <>
                            <tr key={issue.id}>
                                <th className={styles.rowHead} scope="row">
                                    {issue.label}
                                </th>
                                {PARTIES.map((party) => {
                                    const n = issue.member.parties[party] ?? 0;
                                    return (
                                        <td
                                            key={party}
                                            className={n > 0 ? styles.filled : styles.empty}
                                        >
                                            {n > 0 ? n : "–"}
                                        </td>
                                    );
                                })}
                            </tr>
                            {GROUP_END_IDS.has(issue.id) && (
                                <tr key={`${issue.id}-divider`} aria-hidden="true">
                                    <td className={styles.divider} colSpan={PARTIES.length + 1} />
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}