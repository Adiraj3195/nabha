import React from "react";
import { Users, AlertTriangle, LogOut, Clock } from "lucide-react";
import Card from "../ui/Card";
import {
  getActivePatientCount,
  getTriageBreakdown,
  getPendingDischargeCount,
  getAverageWaitTime,
} from "../../data/queries";

function Stat({ icon: Icon, label, value, sub, tone }) {
  const toneClass = {
    critical: "text-critical-text bg-critical-bg",
    warning: "text-warning-text bg-warning-bg",
    stable: "text-stable-text bg-stable-bg",
    info: "text-info-text bg-info-bg",
  }[tone];

  return (
    <Card className="flex-1">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1 tabular-nums">{value}</div>
          <div className="text-[11.5px] text-slate-500 mt-1">{sub}</div>
        </div>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${toneClass}`}>
          <Icon size={15} strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
}

export default function KpiCards() {
  const activeCount = getActivePatientCount();
  const triage = getTriageBreakdown();
  const critical = triage.find((t) => t.level === "critical")?.count ?? 0;
  const discharges = getPendingDischargeCount();
  const avgWait = getAverageWaitTime();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <Stat icon={Users} label="Active Patients" value={activeCount} sub="Across 5 wards" tone="info" />
      <Stat icon={AlertTriangle} label="Critical Triage" value={critical} sub="Requires immediate review" tone="critical" />
      <Stat icon={LogOut} label="Pending Discharges" value={discharges} sub="Cleared, awaiting approval" tone="stable" />
      <Stat icon={Clock} label="Avg. Wait Time" value={`${avgWait}m`} sub="Trailing 14-day average" tone="warning" />
    </div>
  );
}
