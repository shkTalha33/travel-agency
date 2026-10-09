'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PointsGrowthChart({ transactions = [], pointsSummary = {} }) {
  const { isEn } = useLanguage();
  const [timeframe, setTimeframe] = useState('6m');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalEarned = pointsSummary.totalEarnedPoints || 0;
  const l1Total = pointsSummary.level1Points || 0;
  const l2Total = pointsSummary.level2Points || 0;

  // Compute genuine monthly data by aggregating real user transactions
  const data = useMemo(() => {
    const numMonths = timeframe === '3m' ? 3 : timeframe === '1y' ? 12 : 6;
    const now = new Date();
    const result = [];

    const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNamesEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthNames = isEn ? monthNamesEn : monthNamesEs;

    // Generate buckets for the last N months in chronological order
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthLabel = monthNames[monthIndex];
      const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

      result.push({
        key,
        year,
        monthIndex,
        month: monthLabel,
        earned: 0,
        l1: 0,
        l2: 0,
        count: 0,
      });
    }

    // Populate buckets with real transactions from the API
    if (Array.isArray(transactions) && transactions.length > 0) {
      transactions.forEach((tx) => {
        const txDate = tx.createdAt ? new Date(tx.createdAt) : tx.iso ? new Date(tx.iso) : null;
        if (!txDate || isNaN(txDate.getTime())) return;

        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth();
        const txKey = `${txYear}-${String(txMonth + 1).padStart(2, '0')}`;

        const bucket = result.find((b) => b.key === txKey);
        if (bucket) {
          const pts = Number(tx.points) || 0;
          if (pts > 0) {
            bucket.earned += pts;
            bucket.count += 1;
            if (tx.level === 1 || tx.type === 'referral_l1') {
              bucket.l1 += pts;
            } else if (tx.level === 2 || tx.type === 'referral_l2') {
              bucket.l2 += pts;
            }
          }
        }
      });
    }

    return result;
  }, [transactions, timeframe, isEn]);

  // Max value for chart scale calculation
  const maxVal = Math.max(...data.map((d) => d.earned), 10);

  // Growth rate calculation between last 2 periods
  const growthRate = useMemo(() => {
    if (data.length < 2) return 0;
    const currentMonthEarned = data[data.length - 1].earned;
    const prevMonthEarned = data[data.length - 2].earned;

    if (prevMonthEarned === 0) {
      return currentMonthEarned > 0 ? 100 : 0;
    }
    return Math.round(((currentMonthEarned - prevMonthEarned) / prevMonthEarned) * 100);
  }, [data]);

  // Chart dimensions
  const width = 500;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Calculate coordinates for points
  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = paddingX + (i / Math.max(data.length - 1, 1)) * graphWidth;
      const y = height - paddingY - (d.earned / maxVal) * graphHeight;
      return { x, y, ...d };
    });
  }, [data, maxVal, graphWidth, graphHeight]);

  // Create smooth bezier curve path
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX1 = current.x + (next.x - current.x) / 2;
      const controlY1 = current.y;
      const controlX2 = current.x + (next.x - current.x) / 2;
      const controlY2 = next.y;
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }
    return path;
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    return `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }, [linePath, points, height, paddingY]);

  const activeIndex = hoveredIndex !== null && hoveredIndex < points.length ? hoveredIndex : points.length - 1;
  const activePoint = points[activeIndex] || points[points.length - 1];

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      {/* Header & Timeframe Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-ocean-50 text-ocean-600">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-xl font-bold text-navy-950">
              {isEn ? 'Points Growth & Earnings' : 'Crecimiento de Puntos'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isEn ? 'Live monthly points generated from real network transactions.' : 'Puntos mensuales acumulados de transacciones reales en tu red.'}
          </p>
        </div>

        {/* Timeframe tab selector: Active tab uses exact brand red (bg-ocean-600 text-white) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-sand-50 self-start sm:self-auto">
          {[
            { id: '3m', label: '3M' },
            { id: '6m', label: '6M' },
            { id: '1y', label: '1Y' },
          ].map((tab) => {
            const isActive = timeframe === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setTimeframe(tab.id);
                  setHoveredIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-ocean-600 text-white shadow-soft'
                    : 'text-slate-500 hover:text-navy-900 hover:bg-sand-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Period Metric Banner */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isEn ? 'Selected Month Earnings' : 'Ganancia del Periodo'} ({activePoint?.month})
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-serif text-3xl font-bold text-navy-950">
              +{activePoint?.earned?.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-ocean-600 font-mono">PTS</span>
          </div>
        </div>

        {growthRate > 0 ? (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+{growthRate}% {isEn ? 'vs previous' : 'vs anterior'}</span>
          </div>
        ) : growthRate < 0 ? (
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold">
            <ArrowDownRight className="w-4 h-4" />
            <span>{growthRate}% {isEn ? 'vs previous' : 'vs anterior'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-sand-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium">
            <Minus className="w-3.5 h-3.5" />
            <span>0% {isEn ? 'change' : 'variación'}</span>
          </div>
        )}
      </div>

      {/* Responsive SVG Curved Area Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="pointsGrowthRedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#AA303E" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#AA303E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = paddingY + ratio * graphHeight;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#pointsGrowthRedGradient)" />

          {/* Smooth curved line in brand red */}
          <path
            d={linePath}
            fill="none"
            stroke="#AA303E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive points & hover hotspots */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i || (hoveredIndex === null && i === points.length - 1);
            return (
              <g key={i}>
                {/* Vertical guide line on hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={height - paddingY}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point circle dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#AA303E' : '#ffffff'}
                  stroke="#AA303E"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Hover trigger zone */}
                <rect
                  x={pt.x - (graphWidth / Math.max(points.length - 1, 1)) / 2}
                  y={0}
                  width={graphWidth / Math.max(points.length - 1, 1)}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Month labels at bottom */}
                <text
                  x={pt.x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isHovered ? 'fill-navy-950 font-extrabold' : 'fill-slate-400'
                  }`}
                >
                  {pt.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Breakdown from Live Summary API */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-sand-100">
        <div className="p-3.5 rounded-2xl bg-sand-50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isEn ? 'Level 1 Total (100% Rate)' : 'Total Nivel 1 (Tasa 100%)'}
          </span>
          <p className="font-serif text-lg font-bold text-navy-950 mt-0.5">
            {l1Total.toLocaleString()} <span className="text-xs font-sans text-slate-500">PTS</span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-sand-50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isEn ? 'Level 2 Total (50% Rate)' : 'Total Nivel 2 (Tasa 50%)'}
          </span>
          <p className="font-serif text-lg font-bold text-navy-950 mt-0.5">
            {l2Total.toLocaleString()} <span className="text-xs font-sans text-slate-500">PTS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
