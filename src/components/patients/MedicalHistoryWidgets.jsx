import React from "react";
import { HeartPulse, Users, AlertOctagon } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

/**
 * These three widgets sit alongside the primary clinical timeline in the
 * Overview tab. Each reads a pre-joined list off the patient's 360° payload
 * (see queries.js: getChronicConditions / getFamilyHistory / getDrugAllergies).
 */

export function ChronicConditionsWidget({ conditions }) {
  return (
    <Card>
      <div className="flex items-center gap-1.5 mb-2.5">
        <HeartPulse size={13} className="text-primary-600" />
        <h3 className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide">Chronic Conditions</h3>
      </div>
      {(!conditions || conditions.length === 0) && (
        <div className="text-[12px] text-slate-400">No chronic conditions on record.</div>
      )}
      <div className="flex flex-col divide-y divide-slate-100">
        {conditions?.map((c, i) => (
          <div key={i} className="py-2 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-slate-800">{c.title}</span>
              <span className="text-[10.5px] text-slate-400">Since {c.diagnosedYear}</span>
            </div>
            <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">{c.management}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function FamilyHistoryWidget({ history }) {
  return (
    <Card>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Users size={13} className="text-primary-600" />
        <h3 className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide">Family History</h3>
      </div>
      {(!history || history.length === 0) && (
        <div className="text-[12px] text-slate-400">No family history on record.</div>
      )}
      <div className="flex flex-col gap-2">
        {history?.map((h, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[12.5px] text-slate-700">{h.condition}</span>
            <span className="text-[11px] text-slate-400">{h.relation}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const SEVERITY_TONE = { Severe: "critical", Moderate: "warning", Mild: "info", "N/A": "neutral" };

export function DrugAllergiesWidget({ allergies }) {
  return (
    <Card>
      <div className="flex items-center gap-1.5 mb-2.5">
        <AlertOctagon size={13} className="text-critical-text" />
        <h3 className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide">Drug Allergies</h3>
      </div>
      <div className="flex flex-col divide-y divide-slate-100">
        {allergies?.map((a, i) => (
          <div key={i} className="py-2 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-slate-800">{a.allergen}</span>
              <Badge tone={SEVERITY_TONE[a.severity] || "neutral"}>{a.severity}</Badge>
            </div>
            <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">{a.notes}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
