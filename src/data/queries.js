/**
 * queries.js
 * -----------------------------------------------------------------------
 * A thin "data access layer" over the mock tables in mockDatabase.js.
 * Every function here is written the way you'd write a repository method
 * backed by real SQL — the comment above each function shows roughly the
 * query it stands in for. Centralizing all reads here means the UI layer
 * never touches the raw tables directly, so swapping this file for a real
 * API client later requires no changes to components.
 * -----------------------------------------------------------------------
 */

import {
  patients,
  encounters,
  vitals_history,
  medications,
  clinical_notes,
  imaging_studies,
  ward_inflow,
  WARDS,
} from "./mockDatabase";

// ---------------------------------------------------------------------------
// SELECT * FROM patients WHERE id = :id
// ---------------------------------------------------------------------------
export function getPatientById(id) {
  return patients.find((p) => p.id === id) || null;
}

// ---------------------------------------------------------------------------
// SELECT * FROM vitals_history WHERE patientId = :id ORDER BY timestamp ASC
// ---------------------------------------------------------------------------
export function getVitalsForPatient(patientId) {
  return vitals_history
    .filter((v) => v.patientId === patientId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// ---------------------------------------------------------------------------
// Equivalent to: SELECT * FROM vitals_history WHERE patientId = :id
//                ORDER BY timestamp DESC LIMIT 1
// ---------------------------------------------------------------------------
export function getLatestVitals(patientId) {
  const rows = getVitalsForPatient(patientId);
  return rows[rows.length - 1] || null;
}

// Second-most-recent reading — the baseline "What Changed?" compares against.
export function getPreviousVitals(patientId) {
  const rows = getVitalsForPatient(patientId);
  return rows[rows.length - 2] || rows[0] || null;
}

/**
 * computeVitalDeltas
 * Joins the latest and previous vitals rows for a patient and returns the
 * signed delta + direction for each metric — this is the calculation that
 * powers the "What Changed?" panel.
 */
export function computeVitalDeltas(patientId) {
  const latest = getLatestVitals(patientId);
  const prev = getPreviousVitals(patientId);
  if (!latest || !prev) return [];

  const metrics = [
    { key: "temp", label: "Temperature", unit: "°F", improvedWhen: "down", criticalDelta: 1.5 },
    { key: "spo2", label: "Oxygen Saturation", unit: "%", improvedWhen: "up", criticalDelta: 4 },
    { key: "bpSystolic", label: "BP Systolic", unit: "mmHg", improvedWhen: "down", criticalDelta: 15 },
    { key: "bpDiastolic", label: "BP Diastolic", unit: "mmHg", improvedWhen: "down", criticalDelta: 10 },
    { key: "pulse", label: "Pulse", unit: "bpm", improvedWhen: "down", criticalDelta: 15 },
    { key: "painScore", label: "Pain Score", unit: "/10", improvedWhen: "down", criticalDelta: 3 },
  ];

  return metrics.map((m) => {
    const from = prev[m.key];
    const to = latest[m.key];
    const delta = Number((to - from).toFixed(1));
    const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
    const improved =
      direction === "flat" ? true : direction === m.improvedWhen ? false : true;
    // improvedWhen describes the direction that WORSENS the metric (e.g. temp
    // "down" = improvement happens when temp goes down, so moving "up" is bad).
    const isImprovement = direction === "flat" ? true : direction !== m.improvedWhen;
    const severity =
      Math.abs(delta) >= m.criticalDelta ? "critical" : Math.abs(delta) > 0 ? "warning" : "stable";
    return {
      key: m.key,
      label: m.label,
      unit: m.unit,
      from,
      to,
      delta,
      direction,
      isImprovement,
      severity: isImprovement ? "stable" : severity,
    };
  });
}

// ---------------------------------------------------------------------------
// SELECT * FROM medications WHERE patientId = :id AND status = 'active'
// ---------------------------------------------------------------------------
export function getActiveMedications(patientId) {
  return medications.filter((m) => m.patientId === patientId && m.status === "active");
}

// ---------------------------------------------------------------------------
// The four fields below live directly on the `patients` row (a 1:1 relationship,
// the way a patient's snapshot/insurance details would sit in a joined view
// rather than a separate normalized table). These wrappers keep the component
// layer reading through the query layer consistently, the same as every
// other lookup in this file.
// ---------------------------------------------------------------------------

// SELECT bloodGroup, lastVisit, primaryDoctor, emergencyContact FROM patients WHERE id = :id
export function getPatientSnapshot(patientId) {
  const p = getPatientById(patientId);
  if (!p) return null;
  return {
    bloodGroup: p.bloodGroup,
    lastVisit: p.lastVisit,
    primaryDoctor: p.primaryDoctor,
    emergencyContact: p.emergencyContact,
  };
}

// SELECT * FROM chronic_conditions WHERE patientId = :id
export function getChronicConditions(patientId) {
  return getPatientById(patientId)?.chronicConditions || [];
}

// SELECT * FROM family_history WHERE patientId = :id
export function getFamilyHistory(patientId) {
  return getPatientById(patientId)?.familyHistory || [];
}

// SELECT * FROM drug_allergies WHERE patientId = :id
export function getDrugAllergies(patientId) {
  return getPatientById(patientId)?.drugAllergies || [];
}

// SELECT * FROM insurance_policies WHERE patientId = :id
export function getInsuranceDetails(patientId) {
  return getPatientById(patientId)?.insurance || null;
}

// SELECT * FROM imaging_studies WHERE patientId = :id ORDER BY date DESC
export function getImagingStudies(patientId) {
  return imaging_studies.filter((s) => s.patientId === patientId);
}

// ---------------------------------------------------------------------------
// SELECT * FROM clinical_notes WHERE patientId = :id ORDER BY date DESC
// ---------------------------------------------------------------------------
export function getNotesForPatient(patientId) {
  return clinical_notes
    .filter((n) => n.patientId === patientId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// SELECT * FROM encounters WHERE patientId = :id ORDER BY date DESC
// ---------------------------------------------------------------------------
export function getEncountersForPatient(patientId) {
  return encounters
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * getPatient360
 * A single call that joins everything a patient detail view needs —
 * analogous to a stored procedure or a GraphQL resolver composing several
 * underlying tables into one payload.
 */
export function getPatient360(patientId) {
  const patient = getPatientById(patientId);
  if (!patient) return null;
  return {
    patient,
    vitals: getVitalsForPatient(patientId),
    latestVitals: getLatestVitals(patientId),
    deltas: computeVitalDeltas(patientId),
    medications: getActiveMedications(patientId),
    notes: getNotesForPatient(patientId),
    encounters: getEncountersForPatient(patientId),
    snapshot: getPatientSnapshot(patientId),
    chronicConditions: getChronicConditions(patientId),
    familyHistory: getFamilyHistory(patientId),
    drugAllergies: getDrugAllergies(patientId),
    insurance: getInsuranceDetails(patientId),
    imagingStudies: getImagingStudies(patientId),
  };
}

/**
 * filterPatients
 * Equivalent to a dynamic WHERE clause built from active filters:
 *   WHERE (:search IS NULL OR name ILIKE :search OR mrn ILIKE :search)
 *     AND (:wards IS EMPTY OR wardId IN (:wards))
 *     AND (:triage IS EMPTY OR triage IN (:triage))
 *     AND (:conditions IS EMPTY OR primaryCondition IN (:conditions))
 */
export function filterPatients({ search = "", wards = [], triage = [], conditions = [] } = {}) {
  const q = search.trim().toLowerCase();
  return patients.filter((p) => {
    const matchesSearch =
      !q || p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q);
    const matchesWard = wards.length === 0 || wards.includes(p.wardId);
    const matchesTriage = triage.length === 0 || triage.includes(p.triage);
    const matchesCondition = conditions.length === 0 || conditions.includes(p.primaryCondition);
    return matchesSearch && matchesWard && matchesTriage && matchesCondition;
  });
}

// ---------------------------------------------------------------------------
// ORDER BY :key :direction
// ---------------------------------------------------------------------------
export function sortPatients(list, key, direction = "asc") {
  const sorted = [...list].sort((a, b) => {
    let av = a[key];
    let bv = b[key];
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return direction === "asc" ? -1 : 1;
    if (av > bv) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

// ---------------------------------------------------------------------------
// LIMIT :pageSize OFFSET (:page - 1) * :pageSize
// ---------------------------------------------------------------------------
export function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize;
  return {
    rows: list.slice(start, start + pageSize),
    total: list.length,
    totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
    page,
  };
}

// ---------------------------------------------------------------------------
// Aggregate helpers for the analytics dashboard
// ---------------------------------------------------------------------------

// SELECT COUNT(*) FROM patients
export function getActivePatientCount() {
  return patients.length;
}

// SELECT triage, COUNT(*) FROM patients GROUP BY triage
export function getTriageBreakdown() {
  return ["critical", "urgent", "stable"].map((level) => ({
    level,
    count: patients.filter((p) => p.triage === level).length,
  }));
}

// SELECT COUNT(*) FROM patients WHERE readyForDischarge = true
export function getPendingDischargeCount() {
  return patients.filter((p) => p.readyForDischarge).length;
}

/**
 * getWardOccupancy
 * SELECT wardId, COUNT(*) AS occupied, capacity
 * FROM patients JOIN wards ON patients.wardId = wards.id
 * GROUP BY wardId
 */
export function getWardOccupancy() {
  return WARDS.map((w) => {
    const occupied = patients.filter((p) => p.wardId === w.id).length;
    return {
      id: w.id,
      name: w.name.replace(/^Ward \d+ — /, ""),
      shortName: w.name.split("—")[0].trim(),
      occupied,
      capacity: w.capacity,
      occupancyRate: Math.round((occupied / w.capacity) * 100),
    };
  });
}

// AVG(avgWaitMinutes) across the trailing 14-day window
export function getAverageWaitTime() {
  const total = ward_inflow.reduce((sum, d) => sum + d.avgWaitMinutes, 0);
  return Math.round(total / ward_inflow.length);
}

// Raw trend rows for the inflow/discharge chart (already date-ordered)
export function getPatientInflowTrend() {
  return ward_inflow;
}

// Distinct primary conditions, used to populate the directory's filter list
export function getDistinctConditions() {
  return [...new Set(patients.map((p) => p.primaryCondition))].sort();
}
