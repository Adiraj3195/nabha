import React from "react";
import ClinicalAnalytics from "../components/dashboard/ClinicalAnalytics";
import KpiCards from "../components/dashboard/KpiCards";
import Card from "../components/ui/Card";
import { getWardOccupancy } from "../data/queries";

export default function AnalyticsPage() {
  const occupancy = getWardOccupancy();

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[19px] font-extrabold text-slate-800">Clinical Analytics</h1>
        <p className="text-[12.5px] text-slate-400 mt-0.5">
          Operational trends across admissions, wards, and triage load.
        </p>
      </div>

      <KpiCards />
      <ClinicalAnalytics />

      <Card className="mt-5">
        <h3 className="text-[13px] font-bold text-slate-800 mb-3">Ward Capacity Detail</h3>
        <div className="flex flex-col divide-y divide-slate-100">
          {occupancy.map((w) => (
            <div key={w.id} className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-[12.5px] font-semibold text-slate-800">{w.shortName}</div>
                <div className="text-[11px] text-slate-400">{w.name}</div>
              </div>
              <div className="flex items-center gap-3 w-48">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${w.occupancyRate >= 90 ? "bg-critical-text" : w.occupancyRate >= 70 ? "bg-warning-text" : "bg-primary-500"}`}
                    style={{ width: `${Math.min(100, w.occupancyRate)}%` }}
                  />
                </div>
                <span className="text-[11.5px] font-semibold text-slate-600 tabular-nums w-14 text-right">
                  {w.occupied}/{w.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
