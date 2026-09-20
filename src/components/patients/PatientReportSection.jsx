import React from "react";
import {
  HeartPulse, Activity, Droplet, Wind, FolderOpen, Download, Bone, Brain,
  Waves, ScanLine, ShieldCheck, Pill, Stethoscope, Siren, TrendingUp, Gift,
  Sparkles, Clock3,
} from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

/* ---------------------------------- Vitals row --------------------------------- */

function VitalStat({ icon: Icon, label, value, unit }) {
  return (
    <Card className="flex-1">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">{label}</div>
          <div className="mt-1.5">
            <span className="text-[22px] font-extrabold text-slate-800 tabular-nums">{value}</span>
            {unit && <span className="text-[11px] font-semibold text-slate-400 ml-1">{unit}</span>}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
          <Icon size={15} strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
}

function VitalsRow({ latestVitals }) {
  if (!latestVitals) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <VitalStat icon={HeartPulse} label="Heart Rate" value={latestVitals.pulse} unit="bpm" />
      <VitalStat
        icon={Activity}
        label="Blood Pressure"
        value={`${latestVitals.bpSystolic}/${latestVitals.bpDiastolic}`}
        unit="mmHg"
      />
      <VitalStat icon={Droplet} label="Blood Glucose" value={latestVitals.glucose} unit="mg/dL" />
      <VitalStat icon={Wind} label="SpO2" value={latestVitals.spo2} unit="%" />
    </div>
  );
}

/* -------------------------------- Medical Imaging ------------------------------- */

const MODALITY_ICON = { xray: Bone, mri: Brain, ct: ScanLine, ultrasound: Waves, echo: HeartPulse };

function ScanCard({ scan }) {
  const Icon = MODALITY_ICON[scan.modality] || ScanLine;
  const ready = scan.status === "ready";
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="relative h-[130px] bg-slate-800 flex items-center justify-center">
        <Icon size={44} className="text-slate-600" strokeWidth={1.3} />
        <span
          className={`absolute top-2.5 right-2.5 text-[9.5px] font-bold tracking-wide px-2 py-1 rounded-full ${
            ready ? "bg-stable-text text-white" : "bg-warning-text text-white"
          }`}
        >
          {ready ? "VIEW RESULTS" : "PENDING"}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[12.5px] font-bold text-slate-800 leading-snug">{scan.title}</span>
          {ready ? <FolderOpen size={13} className="text-slate-300 flex-shrink-0 mt-0.5" /> : <Clock3 size={13} className="text-slate-300 flex-shrink-0 mt-0.5" />}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">{scan.date} · {scan.facility}</div>
      </div>
    </div>
  );
}

function ImagingArchiveCard() {
  return (
    <div className="bg-primary-600 rounded-lg p-4 flex flex-col justify-between text-white h-full">
      <div>
        <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center mb-3">
          <FolderOpen size={15} />
        </div>
        <div className="text-[13.5px] font-bold">Imaging Archive</div>
        <p className="text-[11.5px] text-white/80 mt-1.5 leading-relaxed">
          12 historical scans are available in the secure digital archive, dating back to 2018.
        </p>
      </div>
      <button className="mt-4 bg-white text-primary-700 text-[11.5px] font-bold rounded-full px-3.5 py-2 inline-flex items-center gap-1.5 self-start hover:bg-white/90 transition-colors">
        Download DICOM Files <Download size={12} />
      </button>
    </div>
  );
}

function MedicalImaging({ studies }) {
  const [a, b] = studies || [];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-slate-800">Medical Imaging</h3>
        <button className="text-[11.5px] font-semibold text-primary-600 hover:underline">View All Scans</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {a && <ScanCard scan={a} />}
        {b && <ScanCard scan={b} />}
        <ImagingArchiveCard />
      </div>
    </div>
  );
}

/* ----------------------------- Insurance & Benefits ------------------------------ */

const COVERAGE_ICON = { "Chronic Medication": Pill, "Specialist Visits": Stethoscope, "ER Admissions": Siren };
const INSIGHT_ICON = { "Savings Opportunity": TrendingUp, "Unused Benefits": Gift, "Wellness Bonus": Sparkles };
const INSIGHT_STYLE = {
  "Savings Opportunity": "bg-stable-bg border-stable-border",
  "Unused Benefits": "bg-info-bg border-info-border",
  "Wellness Bonus": "bg-white border-slate-200",
};

function InsuranceReportBlock({ insurance }) {
  if (!insurance) return null;
  const { met, total } = insurance.deductibleProgress;
  const pct = Math.min(100, Math.round((met / total) * 100));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-slate-800">Insurance & Benefits</h3>
        <Badge tone="stable">Active Policy</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        {/* Policy card */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={16} className="text-primary-600" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-800">{insurance.providerName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ID: {insurance.policyId}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Next Renewal</div>
              <div className="text-[12.5px] font-bold text-slate-800 mt-0.5">{insurance.nextRenewal}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Coverage Breakdown</div>
              <div className="flex flex-col gap-2">
                {insurance.coverageBreakdown.map((c, i) => {
                  const Icon = COVERAGE_ICON[c.label] || ShieldCheck;
                  return (
                    <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-2.5 py-2">
                      <span className="flex items-center gap-1.5 text-[11.5px] text-slate-600">
                        <Icon size={12} className="text-primary-500" /> {c.label}
                      </span>
                      <span className="text-[11.5px] font-bold text-primary-600">
                        {c.coveragePercent >= 95 ? `${c.coveragePercent}% Covered` : `${c.copay} Co-pay`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Deductible Progress</div>
              <div className="bg-white border border-slate-200 rounded-md p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-extrabold text-slate-800">Rs {met.toLocaleString()} met</span>
                  <span className="text-[10.5px] text-slate-400">Rs {total.toLocaleString()} total</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-stable-text rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10.5px] text-slate-400 mt-2 leading-snug">
                  Estimated Rs {(total - met).toLocaleString()} remaining before 100% coinsurance kicks in.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance insights */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Insurance Insights</div>
          <div className="flex flex-col gap-2.5">
            {insurance.insuranceInsights.map((ins, i) => {
              const Icon = INSIGHT_ICON[ins.type] || Sparkles;
              return (
                <div key={i} className={`border rounded-lg p-3 ${INSIGHT_STYLE[ins.type] || "bg-white border-slate-200"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={13} className="text-slate-500" />
                    <span className="text-[11.5px] font-bold text-slate-700">{ins.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{ins.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------- Export --------------------------------- */

/**
 * PatientReportSection — combines the vitals snapshot, medical imaging
 * gallery, and a report-styled insurance summary into the single scrollable
 * "Patient Report" layout shown in the reference wireframe.
 */
export default function PatientReportSection({ latestVitals, imagingStudies, insurance }) {
  return (
    <div className="flex flex-col gap-6">
      <VitalsRow latestVitals={latestVitals} />
      <MedicalImaging studies={imagingStudies} />
      <InsuranceReportBlock insurance={insurance} />
    </div>
  );
}
