import React from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import Badge, { triageTone } from "../ui/Badge";
import { useApp } from "../../context/AppContext";

const COLUMNS = [
  { key: "name", label: "Patient" },
  { key: "age", label: "Age / Gender" },
  { key: "wardName", label: "Ward / Bed" },
  { key: "primaryCondition", label: "Condition" },
  { key: "triage", label: "Triage" },
  { key: "admissionDay", label: "Admission" },
];

function SortIcon({ active, direction }) {
  if (!active) return <ChevronsUpDown size={12} className="text-slate-300" />;
  return direction === "asc" ? <ArrowUp size={12} className="text-primary-600" /> : <ArrowDown size={12} className="text-primary-600" />;
}

export default function PatientTable({ rows, sortKey, sortDirection, onSort }) {
  const { openPatient } = useApp();

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-left border-collapse min-w-[720px]">
        <thead>
          <tr className="border-b border-slate-200">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide px-3 py-2.5 cursor-pointer select-none whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  <SortIcon active={sortKey === col.key} direction={sortDirection} />
                </span>
              </th>
            ))}
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr
              key={p.id}
              onClick={() => openPatient(p.id)}
              className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {p.avatarInitials}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold text-slate-800 whitespace-nowrap">{p.name}</div>
                    <div className="text-[10.5px] text-slate-400">{p.mrn}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-[12px] text-slate-600 whitespace-nowrap">{p.age} · {p.gender}</td>
              <td className="px-3 py-2.5 text-[12px] text-slate-600 whitespace-nowrap">
                {p.wardName.split("—")[0].trim()} · {p.bed}
              </td>
              <td className="px-3 py-2.5 text-[12px] text-slate-600 max-w-[220px] truncate">{p.primaryCondition}</td>
              <td className="px-3 py-2.5">
                <Badge tone={triageTone(p.triage)}>{p.triage[0].toUpperCase() + p.triage.slice(1)}</Badge>
              </td>
              <td className="px-3 py-2.5 text-[12px] text-slate-500 whitespace-nowrap">{p.admissionDay}</td>
              <td className="px-3 py-2.5 text-right">
                <span className="text-[11.5px] font-semibold text-primary-600 whitespace-nowrap">View →</span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-10 text-center text-[12.5px] text-slate-400">
                No patients match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
