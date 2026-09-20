import React from "react";
import KpiCards from "../components/dashboard/KpiCards";
import ClinicalAnalytics from "../components/dashboard/ClinicalAnalytics";
import Card from "../components/ui/Card";
import Badge, { triageTone } from "../components/ui/Badge";
import { useApp } from "../context/AppContext";
import { patients } from "../data/mockDatabase";

export default function DashboardPage() {
  const { openPatient } = useApp();
  const criticalPatients = patients.filter((p) => p.triage === "critical" || p.triage === "urgent").slice(0, 5);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold text-slate-800">Good morning, Dr. Sharma</h1>
        <p className="text-[12.5px] text-slate-400 mt-0.5">Monday, September 7, 2026 · Here's today's clinical overview.</p>
      </div>

      <KpiCards />
      <ClinicalAnalytics />

      <Card className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-slate-800">Patients Needing Attention</h3>
          <span className="text-[11px] text-slate-400">Sorted by triage priority</span>
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          {criticalPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => openPatient(p.id)}
              className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-bold">
                  {p.avatarInitials}
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-slate-800">{p.name}</div>
                  <div className="text-[11px] text-slate-400">{p.primaryCondition}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">{p.wardName.split("—")[0].trim()} · {p.bed}</span>
                <Badge tone={triageTone(p.triage)}>{p.triage[0].toUpperCase() + p.triage.slice(1)}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
