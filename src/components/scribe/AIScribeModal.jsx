import React, { useEffect, useRef, useState } from "react";
import { X, Mic, Pause, Square, PlayCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getPatientById } from "../../data/queries";
import Button from "../ui/Button";

function Waveform({ active }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-9">
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-primary-500 ${active ? "animate-waveform" : "opacity-30"}`}
          style={{
            height: active ? `${10 + Math.abs(Math.sin(i * 1.2)) * 18}px` : 5,
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AIScribeModal() {
  const { scribeOpen, scribePatientId, closeScribe } = useApp();
  const [state, setState] = useState("idle"); // idle | recording | generated
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const patient = scribePatientId ? getPatientById(scribePatientId) : null;

  useEffect(() => {
    if (state === "recording") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  useEffect(() => {
    if (scribeOpen) {
      setState("idle");
      setSeconds(0);
    }
  }, [scribeOpen]);

  if (!scribeOpen) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/30" onClick={closeScribe} />
      <div className="relative w-full max-w-[480px] max-h-[86vh] overflow-y-auto scrollbar-thin bg-white rounded-xl border border-slate-200 shadow-2xl p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <Mic size={15} className="text-primary-600" />
              <h2 className="text-[14.5px] font-extrabold text-slate-800">AI Clinical Documentation</h2>
            </div>
            {patient ? (
              <p className="text-[11.5px] text-slate-400 mt-1 ml-[22px]">{patient.name} · ID: {patient.mrn}</p>
            ) : (
              <p className="text-[11.5px] text-slate-400 mt-1 ml-[22px]">No patient selected — general dictation</p>
            )}
          </div>
          <button onClick={closeScribe} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
            <X size={15} />
          </button>
        </div>

        {state === "idle" && (
          <div className="text-center py-9 px-2">
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Mic size={24} className="text-primary-600" />
            </div>
            <p className="text-[12.5px] text-slate-500 mb-5">
              Start recording to generate a structured clinical note automatically.
            </p>
            <Button variant="primary" size="md" icon={PlayCircle} onClick={() => setState("recording")}>
              Start Recording
            </Button>
          </div>
        )}

        {state === "recording" && (
          <div className="py-6">
            <div className="text-center mb-2">
              <div className="w-14 h-14 rounded-full bg-critical-bg flex items-center justify-center mx-auto mb-3">
                <Mic size={24} className="text-critical-text" />
              </div>
              <div className="text-[12.5px] font-bold text-critical-text">Listening...</div>
              <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums">{mm}:{ss}</div>
            </div>
            <Waveform active />
            <div className="flex justify-center gap-2 mt-6">
              <Button icon={Pause}>Pause</Button>
              <Button variant="danger" icon={Square} onClick={() => setState("generated")}>Stop</Button>
              <Button onClick={closeScribe}>Cancel</Button>
            </div>
          </div>
        )}

        {state === "generated" && (
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={13} className="text-primary-600" />
              <span className="text-[12.5px] font-bold text-slate-800">AI Generated SOAP Note</span>
            </div>

            {[
              { t: "SUBJECTIVE", b: "Patient reports fever for three days with productive cough and weakness." },
              { t: "OBJECTIVE", b: "Temperature: 101.8°F. Alert and oriented, mild respiratory distress on exertion." },
              { t: "ASSESSMENT", b: "Possible lower respiratory tract infection." },
            ].map((s, i) => (
              <div key={i} className="mb-2.5">
                <div className="text-[10px] font-bold text-primary-600 tracking-wide">{s.t}</div>
                <p className="text-[12px] text-slate-700 mt-0.5 leading-relaxed">{s.b}</p>
              </div>
            ))}

            <div className="mb-3">
              <div className="text-[10px] font-bold text-primary-600 tracking-wide">PLAN</div>
              <ul className="list-disc pl-4 text-[12px] text-slate-700 mt-1 space-y-0.5">
                <li>CBC</li>
                <li>Chest X-ray</li>
                <li>Continue monitoring</li>
                <li>Follow-up after results</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-4">
              <div className="text-[11.5px] font-bold text-slate-700 mb-1.5">AI Suggestions</div>
              <ul className="list-disc pl-4 text-[11.5px] text-slate-500 space-y-0.5">
                <li>Suggested ICD-10 code: J18.9 (Pneumonia, unspecified organism)</li>
                <li>Missing documentation: allergy history not recorded</li>
                <li>Suggested follow-up: 48-hour reassessment</li>
              </ul>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button>Save Draft</Button>
              <Button>Edit</Button>
              <Button variant="primary" icon={CheckCircle2} onClick={closeScribe}>Sign & Complete</Button>
            </div>
            <p className="text-[10.5px] text-slate-400 mt-3">
              AI-generated documentation always requires physician review before it is signed and added to the record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
