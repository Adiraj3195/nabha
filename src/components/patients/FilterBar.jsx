import React from "react";
import { Search, X } from "lucide-react";
import { WARDS, TRIAGE_LEVELS } from "../../data/mockDatabase";
import { getDistinctConditions } from "../../data/queries";

const CONDITIONS = getDistinctConditions();

function MultiSelectChips({ options, selected, onToggle, renderLabel }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const value = typeof opt === "string" ? opt : opt.id;
        const label = renderLabel ? renderLabel(opt) : opt;
        const active = selected.includes(value);
        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`text-[11.5px] px-2.5 py-1 rounded-full border transition-colors ${
              active
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterBar({ filters, setFilters }) {
  const toggle = (key, value) => {
    setFilters((f) => {
      const current = f[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...f, [key]: next };
    });
  };

  const hasActiveFilters =
    filters.search || filters.wards.length || filters.triage.length || filters.conditions.length;

  const clearAll = () => setFilters({ search: "", wards: [], triage: [], conditions: [] });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 mb-4">
      <div className="relative mb-3">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search by patient name or MRN..."
          className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 text-[12.5px] outline-none focus:border-primary-400 focus:bg-white"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Ward</div>
          <MultiSelectChips
            options={WARDS}
            selected={filters.wards}
            onToggle={(v) => toggle("wards", v)}
            renderLabel={(w) => w.name.split("—")[0].trim()}
          />
        </div>
        <div>
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Triage</div>
          <MultiSelectChips
            options={TRIAGE_LEVELS}
            selected={filters.triage}
            onToggle={(v) => toggle("triage", v)}
            renderLabel={(t) => t[0].toUpperCase() + t.slice(1)}
          />
        </div>
        <div>
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Condition</div>
          <select
            multiple={false}
            onChange={(e) => e.target.value && toggle("conditions", e.target.value)}
            value=""
            className="w-full h-[26px] bg-white border border-slate-200 rounded-md text-[11.5px] px-2 text-slate-600 outline-none focus:border-primary-400"
          >
            <option value="">Add condition filter...</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {filters.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {filters.conditions.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle("conditions", c)}
                  className="text-[10.5px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200 flex items-center gap-1"
                >
                  {c.length > 28 ? c.slice(0, 28) + "…" : c} <X size={10} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="mt-3 text-[11.5px] text-primary-600 font-semibold hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
