import React from "react";
import { ArrowUp, ArrowDown, Minus, Zap } from "lucide-react";
import Badge from "../ui/Badge";

const SEVERITY_TONE = { critical: "critical", warning: "warning", stable: "stable" };

export default function WhatChangedPanel({ deltas }) {
  if (!deltas || deltas.length === 0) {
    return (
      <div className="text-[12.5px] text-slate-400 py-4 text-center">
        Not enough historical readings to compute a change yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {deltas.map((d) => {
        const Icon = d.direction === "up" ? ArrowUp : d.direction === "down" ? ArrowDown : Minus;
        const arrowColor =
          d.severity === "critical" ? "text-critical-text" : d.severity === "warning" ? "text-warning-text" : "text-stable-text";
        return (
          <div key={d.key} className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{d.label}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[12.5px] text-slate-400 line-through">{d.from}</span>
                <Icon size={13} className={arrowColor} />
                <span className={`text-[14px] font-extrabold ${arrowColor}`}>
                  {d.to} <span className="text-[10.5px] font-medium text-slate-400">{d.unit}</span>
                </span>
              </div>
            </div>
            <Badge tone={SEVERITY_TONE[d.severity]}>
              {d.isImprovement ? "Improved" : d.direction === "flat" ? "Unchanged" : "Worsened"}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

export function WhatChangedSummaryLine() {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-primary-600 font-semibold">
      <Zap size={11} /> Calculated from the two most recent vitals readings
    </div>
  );
}
