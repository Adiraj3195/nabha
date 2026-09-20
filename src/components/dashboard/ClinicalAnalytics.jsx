import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import Card from "../ui/Card";
import { getPatientInflowTrend, getWardOccupancy, getTriageBreakdown } from "../../data/queries";

const TRIAGE_COLORS = { critical: "#DC2626", urgent: "#C98A0A", stable: "#159862" };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-lg px-3 py-2 text-[11.5px]">
      <div className="font-semibold text-slate-700 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-semibold text-slate-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ClinicalAnalytics({ compact = false }) {
  const inflow = getPatientInflowTrend();
  const occupancy = getWardOccupancy();
  const triage = getTriageBreakdown();

  return (
    <div className={`grid ${compact ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-3"} gap-4`}>
      {/* Patient inflow / discharge trend */}
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-slate-800">Patient Inflow — 14 Day Trend</h3>
          <span className="text-[11px] text-slate-400">Admissions vs. discharges</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={inflow} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="admissionsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C5FD1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4C5FD1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dischargesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#159862" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#159862" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} interval={1} />
            <YAxis tick={{ fontSize: 10.5, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#4C5FD1" strokeWidth={2} fill="url(#admissionsFill)" />
            <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#159862" strokeWidth={2} fill="url(#dischargesFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Triage breakdown donut */}
      <Card>
        <h3 className="text-[13px] font-bold text-slate-800 mb-3">Triage Breakdown</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={triage}
              dataKey="count"
              nameKey="level"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              stroke="none"
            >
              {triage.map((t) => (
                <Cell key={t.level} fill={TRIAGE_COLORS[t.level]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-1">
          {triage.map((t) => (
            <div key={t.level} className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full" style={{ background: TRIAGE_COLORS[t.level] }} />
              <span className="capitalize">{t.level}</span>
              <span className="font-semibold text-slate-700">{t.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Ward occupancy */}
      <Card className="lg:col-span-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-slate-800">Ward Occupancy</h3>
          <span className="text-[11px] text-slate-400">Occupied beds vs. capacity</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={occupancy} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
            <XAxis dataKey="shortName" tick={{ fontSize: 10.5, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 10.5, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="occupied" name="Occupied" fill="#4C5FD1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="capacity" name="Capacity" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
