import React from "react";
import Sparkline from "../ui/Sparkline";

const METRICS = [
  { key: "temp", label: "Temperature", unit: "°F", normal: [97, 99] },
  { key: "spo2", label: "SpO2", unit: "%", normal: [95, 100] },
  { key: "bpSystolic", label: "BP Systolic", unit: "mmHg", normal: [90, 130] },
  { key: "bpDiastolic", label: "BP Diastolic", unit: "mmHg", normal: [60, 85] },
  { key: "pulse", label: "Pulse", unit: "bpm", normal: [60, 100] },
  { key: "respRate", label: "Resp. Rate", unit: "/min", normal: [12, 20] },
];

export default function VitalsGrid({ vitals, latest }) {
  if (!latest) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {METRICS.map((m) => {
        const value = latest[m.key];
        const series = vitals.map((v) => v[m.key]);
        const isAbnormal = value < m.normal[0] || value > m.normal[1];
        return (
          <div key={m.key} className="bg-slate-50 border border-slate-200 rounded-md p-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{m.label}</div>
            <div className="flex items-end justify-between mt-1">
              <div>
                <span className={`text-[15px] font-extrabold tabular-nums ${isAbnormal ? "text-warning-text" : "text-slate-800"}`}>
                  {value}
                </span>
                <span className="text-[10.5px] font-medium text-slate-400 ml-1">{m.unit}</span>
              </div>
              <Sparkline data={series} stroke={isAbnormal ? "#C98A0A" : "#4C5FD1"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
