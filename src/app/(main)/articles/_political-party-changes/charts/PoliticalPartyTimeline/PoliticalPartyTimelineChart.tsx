'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './PoliticalPartyTimelineChart.module.css';

interface PartyBox {
  id: string;
  name: string;
  col: number;
  row: number;
  color: string;
  label?: string;
}

interface VerticalLine {
  col: number;
  rowStart: number;
  rowEnd: number;
}

interface Connection {
  fromCol: number;
  toCol: number;
  row: number;
  targetBoxId?: string; // If specified, routes arrow exactly to the top of this box
  label?: string;
  horizontal?: boolean; // If true, force horizontal arrow (merge into target vertical line)
}

interface DissolutionMark {
  col: number;
  rowEnd: number; // row where the party dissolved (end of its vertical line)
  label?: string;
}

// Visual color palette
const COLORS = {
  jcp: '#666465',           // 共産党 (Red)
  democratic: '#E54D60',    // 民主系 (Reddish)
  seikatsu: '#E5A519',      // 生活系 (Yellow)
  dpfp: '#EC9A29',          // 希望/国民民主 (Orange-Yellow)
  komeito: '#4BA3E3',       // 公明党 (Light Blue)
  chudo: '#8E44AD',         // 中道改革連合 (Purple)
  genki: '#666465',         // 元気にする会 (Teal)
  reiwa: '#E40080',
  kaikaku: '#F58F35',        // 新党改革 (Orange)
  sansei: '#F58F35',        // 参政党 (Orange)
  minna: '#22A398',         // みんなの党 (Teal)
  ishin: '#509E2E',         // 維新系 (Green)
  jisedai: '#666465',       // 次世代 (Cyan)
  ldp: '#666465',           // 自民党 (Dark Blue)
};

// 1. Define explicit party boxes (positioned on the grid)
// Columns sequence:
// 0: 共産党
// 1: 公明党 -> 中道改革連合
// 2: 民主党 -> 民進党 -> 立憲民主党 -> 中道改革連合
// 3: 生活の党系
// 4: 希望の党 / 国民民主党
// 5: 元気にする会
// 5: れいわ新選組
// 6: 改革クラブ / 新党改革
// 6: 参政党
// 7: みんなの党 / 結いの党 / 維新の党 / おおさか維新 / 新日本維新
// 8: 次世代の党 / 日本のこころ
// 9: 自民党
const PARTY_BOXES: PartyBox[] = [
  // === Row 0: Top Headers ===
  { id: 'jcp_top', name: '共産党', col: 0, row: 0, color: COLORS.jcp },
  { id: 'komeito_top', name: '公明党', col: 1, row: 0, color: COLORS.komeito },
  { id: 'dpj_top', name: '民主党', col: 2, row: 0, color: COLORS.democratic },
  { id: 'ldp_top', name: '自民党', col: 9, row: 0, color: COLORS.ldp },

  // === Intermediate Rows ===
  { id: 'kaikaku_club', name: '改革クラブ', col: 6, row: 1, color: COLORS.seikatsu, label: '08.8' },
  { id: 'minna_top', name: 'みんなの党', col: 7, row: 2, color: COLORS.minna, label: '09.8' },
  { id: 'shintou_kaikaku', name: '新党改革', col: 6, row: 3, color: COLORS.kaikaku, label: '10.4' },
  { id: 'seikatsu_first', name: '生活が第一', col: 3, row: 4, color: COLORS.seikatsu, label: '12.7' },
  { id: 'jip_old', name: '日本維新の会', col: 8, row: 5, color: COLORS.ishin, label: '12.9' },
  { id: 'mirai', name: '未来の党', col: 3, row: 6, color: COLORS.seikatsu, label: '12.11' },
  { id: 'seikatsu_party', name: '生活の党', col: 3, row: 7, color: COLORS.seikatsu, label: '12.12' },
  { id: 'yui', name: '結いの党', col: 7, row: 8, color: COLORS.minna, label: '13.12' },
  { id: 'jisedai', name: '次世代の党', col: 8, row: 9, color: COLORS.jisedai, label: '14.8' },
  { id: 'ishin_party', name: '維新の党', col: 7, row: 10, color: COLORS.ishin, label: '14.9' },
  { id: 'genki', name: '元気にする会', col: 5, row: 11, color: COLORS.genki, label: '15.1~17.5' },
  { id: 'osaka_ishin', name: 'おおさか維新', col: 7, row: 12, color: COLORS.ishin, label: '15.11' },
  { id: 'kokoro', name: '日本のこころ', col: 8, row: 12, color: COLORS.jisedai, label: '15.12' },
  { id: 'minshin', name: '民進党', col: 2, row: 13, color: COLORS.democratic, label: '16.3' },
  { id: 'jip_new', name: '日本維新の会', col: 7, row: 14, color: COLORS.ishin, label: '16.7' },
  { id: 'cdp_old', name: '立憲民主党', col: 2, row: 15, color: COLORS.democratic, label: '17.10' },
  { id: 'kibou', name: '希望の党', col: 4, row: 15, color: COLORS.dpfp, label: '17.10' },
  { id: 'dpfp_old', name: '国民民主党', col: 4, row: 16, color: COLORS.dpfp, label: '18.5' },
  { id: 'reiwa', name: 'れいわ新選組', col: 5, row: 17, color: COLORS.reiwa, label: '19.4' },
  { id: 'sansei', name: '参政党', col: 6, row: 17, color: COLORS.sansei, label: '20.4' },
  { id: 'cdp_new', name: '立憲民主党', col: 2, row: 18, color: COLORS.democratic, label: '20.9' },
  { id: 'chudo_kaikaku', name: '中道改革連合', col: 1, row: 19, color: COLORS.chudo, label: '26.1 合併' },

  // === Row 19: Bottom Headers (Existing / Final status) ===
  { id: 'jcp_bot', name: '共産党', col: 0, row: 20, color: COLORS.jcp },
  { id: 'chudo_bot', name: '中道改革連合', col: 1, row: 20, color: COLORS.chudo },
  { id: 'dpfp_bot', name: '国民民主党', col: 4, row: 20, color: COLORS.dpfp },
  { id: 'reiwa', name: 'れいわ新選組', col: 5, row: 20, color: COLORS.reiwa},
  { id: 'sansei', name: '参政党', col: 6, row: 20, color: COLORS.sansei },
  { id: 'jip_bot', name: '日本維新の会', col: 7, row: 20, color: COLORS.ishin },
  { id: 'ldp_bot', name: '自民党', col: 9, row: 20, color: COLORS.ldp },
];

// 2. Define the main vertical lines representing each lane's lifespan
const VERTICAL_LINES: VerticalLine[] = [
  { col: 0, rowStart: 0, rowEnd: 20 }, // 共産党
  { col: 1, rowStart: 0, rowEnd: 18 }, // 公明党 (Ends at Row 18 merger)
  { col: 1, rowStart: 18, rowEnd: 20 }, // 中道改革連合 (Starts at Row 18 merger)
  { col: 2, rowStart: 0, rowEnd: 19 }, // 民主党/民進党/立憲民主党 (Ends at Row 18 merger)
  { col: 3, rowStart: 4, rowEnd: 16 }, // 生活系 (19.4に国民民主党へ合流)
  { col: 4, rowStart: 15, rowEnd: 20 }, // 希望/国民民主党
  { col: 5, rowStart: 11, rowEnd: 15 }, // 元気にする会 (15.1〜17.10に希望の党へ合流)
  { col: 5, rowStart: 17, rowEnd: 20 }, // れいわ新選組
  { col: 6, rowStart: 1, rowEnd: 14 }, // 改革クラブ/新党改革 (16.7解散)
  { col: 6, rowStart: 17, rowEnd: 20 }, // 参政党
  { col: 7, rowStart: 2, rowEnd: 20 }, // みんなの党/維新系
  { col: 8, rowStart: 5, rowEnd: 16 }, // 日本維新の会(旧)/次世代/日本のこころ (18.11に自民党へ)
  { col: 9, rowStart: 0, rowEnd: 20 }, // 自民党
];

// 3. Define the connections (splits/merges) with row index of occurrence
const CONNECTIONS: Connection[] = [
  // 民主党 -> 改革クラブ (Row 1)
  { fromCol: 2, toCol: 6, row: 1, targetBoxId: 'kaikaku_club', label: '08.8' },
  // 民主党 -> みんなの党 (Row 2)
  { fromCol: 2, toCol: 7, row: 2, targetBoxId: 'minna_top', label: '09.8' },
  // 自民党 -> みんなの党 (Row 2)
  { fromCol: 9, toCol: 7, row: 2, targetBoxId: 'minna_top' },
  // 自民党 -> 新党改革 (Row 3)
  { fromCol: 9, toCol: 6, row: 3, targetBoxId: 'shintou_kaikaku', label: '10.4' },
  // 民主党 -> 生活が第一 (Row 4)
  { fromCol: 2, toCol: 3, row: 4, targetBoxId: 'seikatsu_first', label: '12.7' },
  // 自民党 -> 日本維新の会 (Row 5)
  { fromCol: 9, toCol: 8, row: 5, targetBoxId: 'jip_old', label: '12.9' },
  // 民主党 -> 日本維新の会 (Row 5)
  { fromCol: 2, toCol: 8, row: 5, targetBoxId: 'jip_old' },
  // 結いの党 + 日本維新の会(旧) -> 維新の党 (Row 10)
  { fromCol: 8, toCol: 7, row: 10, targetBoxId: 'ishin_party', label: '14.9' },
  // みんなの党 -> 元気にする会 (Row 11)
  { fromCol: 7, toCol: 5, row: 11, targetBoxId: 'genki', label: '15.1' },
  // 維新の党 -> 民進党 (Row 13)
  { fromCol: 7, toCol: 2, row: 13, targetBoxId: 'minshin', label: '16.3' },
  // 元気にする会 -> 希望の党 (Row 15)
  { fromCol: 5, toCol: 4, row: 15, targetBoxId: 'kibou', label: '17.10' },
  // 民進党 -> 希望の党 (Row 15)
  { fromCol: 2, toCol: 4, row: 15, targetBoxId: 'kibou', label: '17.10' },
  // 日本のこころ -> 自民党 (Row 16, 自民党縦線に横向き合流)
  { fromCol: 8, toCol: 9, row: 16, horizontal: true, label: '18.11' },
  // 生活の党 -> 国民民主党 (Row 16)
  { fromCol: 3, toCol: 4, row: 16, targetBoxId: 'dpfp_old', label: '19.4' },
   // 国民民主党 -> れいわ新選組 (Row 17)
  { fromCol: 4, toCol: 5, row: 17, targetBoxId: 'reiwa'},
  // 立憲民主党 + 国民民主党 -> 立憲民主党/国民民主党 (Row 17)
  { fromCol: 4, toCol: 2, row: 18, targetBoxId: 'cdp_new', label: '20.9' },
  // 立憲民主党 -> 中道改革連合 (Row 18)
  { fromCol: 2, toCol: 1, row: 19, targetBoxId: 'chudo_kaikaku', label: '合流' },
];

// 4. Dissolution marks for parties that dissolved without merging
const DISSOLUTION_MARKS: DissolutionMark[] = [
  { col: 6, rowEnd: 14, label: '16.7 解散' }, // 新党改革
];

const TOTAL_COLS = 10;
const MARGIN = { top: 60, right: 30, bottom: 60, left: 30 };
const ROW_HEIGHT = 135;
const BOX_WIDTH = 36;
const BOX_HEIGHT = 90;

const PoliticalPartyTimelineChartBase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(850);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(Math.max(800, entries[0].contentRect.width));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const totalHeight = MARGIN.top + 20 * ROW_HEIGHT + MARGIN.bottom;

  const getY = (row: number) => {
    return MARGIN.top + row * ROW_HEIGHT;
  };

  const getX = (col: number) => {
    const usableWidth = width - MARGIN.left - MARGIN.right;
    const colSpacing = usableWidth / (TOTAL_COLS - 1);
    return MARGIN.left + col * colSpacing;
  };

  const isColActiveAtRow = (col: number, row: number) => {
    return VERTICAL_LINES.some(
      (vl) => vl.col === col && vl.rowStart <= row && vl.rowEnd >= row
    );
  };



  const renderConnectionPath = (conn: Connection, index: number) => {
    const x1 = getX(conn.fromCol);
    const x2 = getX(conn.toCol);
    const y1 = getY(conn.row);

    const targetBox = conn.targetBoxId ? PARTY_BOXES.find((b) => b.id === conn.targetBoxId) : null;

    const step = conn.fromCol < conn.toCol ? 1 : -1; // +1: 右向き, -1: 左向き
    const R = 6;
    const arrowSize = 8;
    // 共通: 途中のアクティブ列を避けながら横方向に進むパスを構築
    // sweep=0(反時計回り): 左進行で上に膨らむ / sweep=1(時計回り): 右進行で上に膨らむ
    const sweepFlag = step < 0 ? 0 : 1;
    const buildHorizontalPath = (endX: number) => {
      let path = `M ${x1} ${y1}`;
      const startCol = conn.fromCol + step;
      const endCol = conn.toCol;
      for (let c = startCol; c !== endCol; c += step) {
        if (isColActiveAtRow(c, conn.row)) {
          const xc = getX(c);
          path += ` L ${xc - step * R} ${y1}`;
          path += ` A ${R} ${R} 0 0 ${sweepFlag} ${xc + step * R} ${y1}`;
        }
      }
      path += ` L ${endX} ${y1}`;
      return path;
    };

    // 横向き矢印: 同行ターゲット OR horizontal フラグ
    const isHorizontal = (targetBox && targetBox.row === conn.row) || conn.horizontal;
    if (isHorizontal) {
      // ボックスの側面エッジ(同行ターゲット) or 縦線の中心(horizontalフラグ)
      const boxEdgeX = (targetBox && targetBox.row === conn.row)
        ? x2 - step * (BOX_WIDTH / 2)
        : x2;
      const path = buildHorizontalPath(boxEdgeX - step * arrowSize);
      const tipX = boxEdgeX;
      const baseX = boxEdgeX - step * arrowSize;
      return (
        <g key={`conn-${index}`}>
          <path d={path} stroke="#333" strokeWidth={2.5} fill="none" />
          <polygon
            points={`${baseX},${y1 - 5} ${baseX},${y1 + 5} ${tipX},${y1}`}
            fill="#333"
          />
        </g>
      );
    }

    // 下向き矢印
    let y2 = getY(conn.row + 0.6);
    if (targetBox) {
      y2 = getY(targetBox.row) - BOX_HEIGHT / 2;
    }
    const path = buildHorizontalPath(x2);
    const vertPath = path + ` L ${x2} ${y2 - arrowSize}`;
    return (
      <g key={`conn-${index}`}>
        <path d={vertPath} stroke="#333" strokeWidth={2.5} fill="none" />
        <polygon
          points={`${x2 - 5},${y2 - arrowSize} ${x2 + 5},${y2 - arrowSize} ${x2},${y2}`}
          fill="#333"
        />
      </g>
    );
  };

  const renderDissolutionMark = (mark: DissolutionMark, index: number) => {
    const x = getX(mark.col);
    const y = getY(mark.rowEnd);
    const size = 9;
    return (
      <g key={`diss-${index}`}>
        {/* × マーク */}
        <line x1={x - size} y1={y - size} x2={x + size} y2={y + size} stroke="#c00" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={x + size} y1={y - size} x2={x - size} y2={y + size} stroke="#c00" strokeWidth={2.5} strokeLinecap="round" />
        {/* 解散ラベル */}
        {mark.label && (
          <text x={x + size + 5} y={y + 4} fill="#c00" fontSize={11} fontWeight="bold">
            {mark.label}
          </text>
        )}
      </g>
    );
  };
  return (
    <div ref={containerRef} className={styles.container}>
      <svg width={width} height={totalHeight} style={{ display: 'block', background: '#fafafa' }}>
        <defs>
          <marker
            id="arrow-down"
            viewBox="0 0 10 10"
            refX="5"
            refY="10"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 0 L 5 10 z" fill="#333" />
          </marker>
        </defs>

        {/* Vertical lanes/guidelines */}
        {VERTICAL_LINES.map((vl, index) => {
          const x = getX(vl.col);
          const y1 = getY(vl.rowStart);
          const y2 = getY(vl.rowEnd);
          return (
            <line
              key={`v-line-${index}`}
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              stroke="#555"
              strokeWidth={2.5}
              strokeDasharray="none"
            />
          );
        })}

        {/* Render connections (Horizontal lines with jump arcs & downward arrows) */}
        {CONNECTIONS.map((conn, idx) => renderConnectionPath(conn, idx))}

        {/* Render dissolution marks (× for dissolved parties) */}
        {DISSOLUTION_MARKS.map((mark, idx) => renderDissolutionMark(mark, idx))}

        {/* Render party boxes (Rectangles containing vertical labels) */}
        {PARTY_BOXES.map((box) => {
          const x = getX(box.col);
          const y = getY(box.row);

          return (
            <g key={box.id}>
              Outer Glow / Shadow
              <rect
                x={x - BOX_WIDTH / 2}
                y={y - BOX_HEIGHT / 2}
                width={BOX_WIDTH}
                height={BOX_HEIGHT}
                rx={6}
                fill={box.color}
                stroke="#ffffff"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))' }}
              />
              {/* Text Label */}
              <text
                x={x}
                y={y}
                fill="#ffffff"
                fontSize={13}
                fontWeight={800}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.verticalText}
              >
                {box.name}
              </text>
              {/* Side date labels */}
              {box.label && (
                <text
                  x={x + BOX_WIDTH / 2 + 6}
                  y={y - BOX_HEIGHT / 2 + 12}
                  fill="#444"
                  fontSize={11}
                  fontWeight="bold"
                  className={styles.chartLabel}
                >
                  {box.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default dynamic(() => Promise.resolve(PoliticalPartyTimelineChartBase), { ssr: false });

