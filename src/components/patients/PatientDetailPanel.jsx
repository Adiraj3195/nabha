import React, { useState } from "react";
import { X, Phone, MapPin, Zap, Mic, Pill, FileText, Activity, CalendarDays, ClipboardList } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getPatient360 } from "../../data/queries";
import Badge, { triageTone } from "../ui/Badge";
import Button from "../ui/Button";
import VitalsGrid from "./VitalsGrid";
import WhatChangedPanel, { WhatChangedSummaryLine } from "./WhatChangedPanel";
import PatientSnapshot from "./PatientSnapshot";
import { ChronicConditionsWidget, FamilyHistoryWidget, DrugAllergiesWidget } from "./MedicalHistoryWidgets";
import PatientReportSection from "./PatientReportSection";

const TABS = [
  { key: "overview", label: "Overview", icon: Activity },
  { key: "medications", label: "Medications", icon: Pill },
  { key: "notes", label: "Clinical Notes", icon: FileText },
  { key: "encounters", label: "Encounters", icon: CalendarDays },
  { key: "report", label: "Patient Report", icon: ClipboardList },
];

export default function PatientDetailPanel() {
  const { selectedPatientId, closePatient, openScribe } = useApp();
  const [tab, setTab] = useState("overview");
  const [changedOpen, setChangedOpen] = useState(false);

  if (!selectedPatientId) return null;

  const data = getPatient360(selectedPatientId);
  if (!data) return null;
  const {
    patient, vitals, latestVitals, deltas, medications, notes, encounters,
    snapshot, chronicConditions, familyHistory, drugAllergies, insurance, imagingStudies,
  } = data;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/25" onClick={closePatient} />

      <div className="relative w-full max-w-[860px] h-full bg-white shadow-2xl overflow-y-auto scrollbar-thin flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                {patient.avatarInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-extrabold text-slate-800">{patient.name}</h2>
                  <Badge tone="info">{patient.mrn}</Badge>
                </div>
                <div className="text-[11.5px] text-slate-500 mt-0.5">
                  {patient.gender}, {patient.age} yrs · {patient.dob} · {patient.bloodGroup}
                </div>
              </div>
            </div>
            <button onClick={closePatient} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-[11.5px] text-slate-500">
            <span className="flex items-center gap-1"><Phone size={11} /> {patient.phone}</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> {patient.wardName.split("—")[0].trim()} · {patient.bed}</span>
            <Badge tone={triageTone(patient.triage)}>{patient.triage[0].toUpperCase() + patient.triage.slice(1)}</Badge>
          </div>

          <div className="flex gap-2 mt-3">
            <Button variant="ghost" icon={Zap} onClick={() => setChangedOpen((v) => !v)}>
              What Changed?
            </Button>
            <Button variant="primary" icon={Mic} onClick={() => openScribe(patient.id)}>
              Start AI Scribe
            </Button>
          </div>
        </div>

        {/* What Changed collapsible panel */}
        {changedOpen && (
          <div className="mx-5 mt-4 border border-primary-200 bg-primary-50/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[13px] font-bold text-slate-800">Changes Since Last Reading</h3>
              <WhatChangedSummaryLine />
            </div>
            <WhatChangedPanel deltas={deltas} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 border-b border-slate-200">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-2.5 pb-2.5 text-[12px] font-semibold border-b-2 -mb-px transition-colors ${
                  active ? "text-primary-600 border-primary-500" : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-5 flex-1">
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <PatientSnapshot patient={patient} snapshot={snapshot} />

              <div className="grid lg:grid-cols-3 gap-4 items-start">
                {/* Primary clinical timeline */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="text-[13px] font-bold text-slate-800 mb-2">Vitals (Latest)</h3>
                    <VitalsGrid vitals={vitals} latest={latestVitals} />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="text-[13px] font-bold text-slate-800 mb-3">Clinical Timeline</h3>
                    <div className="flex flex-col divide-y divide-slate-100">
                      <div className="pb-3">
                        <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide mb-1">Primary Diagnosis</div>
                        <div className="text-[12.5px] text-slate-700">{patient.primaryCondition}</div>
                      </div>
                      {encounters.map((e) => (
                        <div key={e.id} className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-slate-800">{e.date}</span>
                            <Badge tone="info">{e.type}</Badge>
                          </div>
                          <div className="text-[11.5px] text-slate-500 mt-1">{e.department} · {e.doctor}</div>
                          <div className="text-[12px] text-slate-600 mt-1">{e.diagnosis} — {e.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Medical history sidebar widgets */}
                <div className="flex flex-col gap-4">
                  <ChronicConditionsWidget conditions={chronicConditions} />
                  <FamilyHistoryWidget history={familyHistory} />
                  <DrugAllergiesWidget allergies={drugAllergies} />
                </div>
              </div>
            </div>
          )}

          {tab === "medications" && (
            <div className="flex flex-col divide-y divide-slate-100">
              {medications.length === 0 && <div className="text-[12.5px] text-slate-400 py-6 text-center">No active medications.</div>}
              {medications.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[12.5px] font-semibold text-slate-800">{m.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.route} · {m.frequency}</div>
                  </div>
                  <span className="text-[10.5px] text-slate-400">Since {m.startDate}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "notes" && (
            <div className="flex flex-col gap-3">
              {notes.map((n) => (
                <div key={n.id} className="border border-slate-200 rounded-md p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11.5px] font-bold text-slate-700">{n.type}</span>
                    <span className="text-[10.5px] text-slate-400">{n.date} · {n.author}</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-500">S:</span> {n.subjective}<br />
                    <span className="font-semibold text-slate-500">O:</span> {n.objective}<br />
                    <span className="font-semibold text-slate-500">A:</span> {n.assessment}<br />
                    <span className="font-semibold text-slate-500">P:</span> {n.plan}
                  </p>
                  <Badge tone={n.signed ? "stable" : "warning"} className="mt-2">
                    {n.signed ? "Signed" : "Awaiting signature"}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {tab === "encounters" && (
            <div className="flex flex-col divide-y divide-slate-100">
              {encounters.map((e) => (
                <div key={e.id} className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-slate-800">{e.date}</span>
                    <Badge tone="info">{e.type}</Badge>
                  </div>
                  <div className="text-[11.5px] text-slate-500 mt-1">{e.department} · {e.doctor}</div>
                  <div className="text-[12px] text-slate-600 mt-1">{e.diagnosis} — {e.summary}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "report" && (
            <PatientReportSection latestVitals={latestVitals} imagingStudies={imagingStudies} insurance={insurance} />
          )}
        </div>
      </div>
    </div>
  );
}
