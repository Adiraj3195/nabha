import React from "react";

/**
 * Sparkline — a minimal inline trend line, used in the vitals grid to show
 * the recent trajectory of a metric without the weight of a full chart.
 * Pure SVG, no dependency, so it stays cheap to render inside a table/grid.
 */
export default function Sparkline({ data, width = 80, height = 26, stroke = "#4C5FD1" }) {
  if (!data || data.length < 2) return <div style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const lastX = width;
  const lastY = height - ((data[data.length - 1] - min) / range) * height;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.2} fill={stroke} />
    </svg>
  );
}
