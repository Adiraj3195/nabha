import React from "react";
import { Droplet, CalendarClock, Stethoscope, PhoneCall } from "lucide-react";
import Card from "../ui/Card";

function SnapshotItem({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
        <Icon size={15} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</div>
        <div className="text-[12.5px] font-semibold text-slate-800 truncate">{value}</div>
        {sub && <div className="text-[11px] text-slate-400 truncate">{sub}</div>}
      </div>
    </div>
  );
}

/**
 * PatientSnapshot — the at-a-glance identity/contact card shown at the top
 * of the 360° view: blood group, last visit, primary doctor, and who to
 * call in an emergency.
 */
export default function PatientSnapshot({ patient, snapshot }) {
  if (!snapshot) return null;
  const { emergencyContact } = snapshot;

  return (
    <Card>
      <h3 className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-3">Patient Snapshot</h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <SnapshotItem icon={Droplet} label="Blood Group" value={snapshot.bloodGroup || patient.bloodGroup} />
        <SnapshotItem icon={CalendarClock} label="Last Visit" value={snapshot.lastVisit} />
        <SnapshotItem icon={Stethoscope} label="Primary Doctor" value={snapshot.primaryDoctor} />
        <SnapshotItem
          icon={PhoneCall}
          label="Emergency Contact"
          value={emergencyContact?.name}
          sub={emergencyContact ? `${emergencyContact.relation} · ${emergencyContact.phone}` : undefined}
        />
      </div>
    </Card>
  );
}
