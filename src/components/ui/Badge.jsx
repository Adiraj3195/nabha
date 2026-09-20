import React from "react";

const TONES = {
  critical: "bg-critical-bg text-critical-text border-critical-border",
  warning: "bg-warning-bg text-warning-text border-warning-border",
  stable: "bg-stable-bg text-stable-text border-stable-border",
  info: "bg-info-bg text-info-text border-info-border",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function triageTone(triage) {
  if (triage === "critical") return "critical";
  if (triage === "urgent") return "warning";
  return "stable";
}
