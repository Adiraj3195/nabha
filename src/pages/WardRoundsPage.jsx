import React, { useState } from "react";
import { Stethoscope } from "lucide-react";
import Card from "../components/ui/Card";
import Badge, { triageTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { WARDS } from "../data/mockDatabase";
import { patients } from "../data/mockDatabase";
import { useApp } from "../context/AppContext";

export default function WardRoundsPage() {
  const { openPatient } = useApp();
  const [activeWard, setActiveWard] = useState(WARDS[2].id); // default: Ward 3, respiratory

  const wardPatients = patients.filter((p) => p.wardId === activeWard);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[19px] font-extrabold text-slate-800 flex items-center gap-2">
          <Stethoscope size={18} className="text-primary-600" /> Ward Rounds
        </h1>
        <p className="text-[12.5px] text-slate-400 mt-0.5">Review patients ward by ward, in bed order.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {WARDS.map((w) => {
          const active = activeWard === w.id;
          const count = patients.filter((p) => p.wardId === w.id).length;
          return (
            <button
              key={w.id}
              onClick={() => setActiveWard(w.id)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                active ? "bg-primary-500 text-white border-primary-500" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {w.name.split("—")[0].trim()} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <Card>
        {wardPatients.length === 0 ? (
          <div className="py-10 text-center text-[12.5px] text-slate-400">No patients currently admitted to this ward.</div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {wardPatients.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {p.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-semibold text-slate-800">{p.name}</span>
                      <Badge tone={triageTone(p.triage)}>{p.triage[0].toUpperCase() + p.triage.slice(1)}</Badge>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {p.age} · {p.gender} · {p.bed} · {p.admissionDay}
                    </div>
                    <div className="text-[12px] text-slate-600 mt-1">{p.primaryCondition}</div>
                  </div>
                </div>
                <Button onClick={() => openPatient(p.id)}>Review</Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
