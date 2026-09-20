/**
 * mockDatabase.js
 * -----------------------------------------------------------------------
 * Simulates a normalized relational schema (as you'd find in Postgres/MySQL)
 * entirely in memory. Each exported array is a "table". Rows reference
 * each other by id the way foreign keys would (e.g. `vitals_history.patientId`
 * points at `patients.id`), so the query layer in `queries.js` can join,
 * filter, and aggregate them the same way SQL would.
 *
 * A small seeded PRNG is used instead of Math.random() so the dataset is
 * deterministic across reloads — useful for a portfolio/demo where you
 * want the same charts and numbers every time the app boots.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) — deterministic "randomness" for repeatable data.
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260907); // fixed seed = deterministic dataset
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const float = (min, max, decimals = 1) =>
  Number((rand() * (max - min) + min).toFixed(decimals));
const bool = (p = 0.5) => rand() < p;

// ---------------------------------------------------------------------------
// Reference / lookup data
// ---------------------------------------------------------------------------
export const WARDS = [
  { id: "W1", name: "Ward 1 — General Medicine", capacity: 12 },
  { id: "W2", name: "Ward 2 — Post-Surgical", capacity: 10 },
  { id: "W3", name: "Ward 3 — Respiratory & ICU Step-down", capacity: 8 },
  { id: "W4", name: "Ward 4 — Cardiology", capacity: 10 },
  { id: "W5", name: "Ward 5 — Orthopedics", capacity: 8 },
];

export const TRIAGE_LEVELS = ["critical", "urgent", "stable"];

export const DOCTORS = [
  "Dr. Arjun Sharma",
  "Dr. Neha Verma",
  "Dr. Kabir Mehta",
  "Dr. Ritu Chawla",
  "Dr. Sameer Khan",
];

const FIRST_NAMES = [
  "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Kavita",
  "Arjun", "Meera", "Sanjay", "Divya", "Karan", "Pooja", "Rajesh", "Nisha",
  "Suresh", "Deepika", "Manoj", "Ritika",
];
const LAST_NAMES = [
  "Kumar", "Verma", "Singh", "Sharma", "Gupta", "Reddy", "Nair", "Iyer",
  "Chopra", "Malhotra", "Joshi", "Rao", "Bose", "Kapoor", "Desai",
];

const CONDITIONS = [
  "Community-acquired pneumonia",
  "Type 2 diabetes mellitus, uncontrolled",
  "Acute myocardial infarction (post-PCI)",
  "Chronic kidney disease, stage 3",
  "Post-operative recovery — laparoscopic cholecystectomy",
  "Hypertensive urgency",
  "Acute exacerbation of COPD",
  "Femur fracture, post-ORIF",
  "Atrial fibrillation with RVR",
  "Sepsis, resolving",
  "Cerebrovascular accident (ischemic), rehab phase",
  "Deep vein thrombosis, lower limb",
  "Acute pancreatitis",
  "Congestive heart failure, decompensated",
  "Urinary tract infection with fever",
];

const ALLERGY_POOL = [
  { allergen: "Penicillin", severity: "Severe", notes: "Anaphylaxis on prior exposure — avoid all beta-lactams." },
  { allergen: "Sulfa drugs", severity: "Moderate", notes: "Rash and hives reported. Use alternative antibiotic class." },
  { allergen: "NSAIDs", severity: "Mild", notes: "Mild GI upset. Tolerated with food if unavoidable." },
  { allergen: "Latex", severity: "Moderate", notes: "Contact dermatitis. Use latex-free gloves and equipment." },
  { allergen: "Shellfish", severity: "Severe", notes: "Swelling and difficulty breathing reported previously." },
];
const CHRONIC_POOL = [
  "Type 2 Diabetes", "Hypertension", "Hyperlipidemia", "Asthma",
  "Hypothyroidism", "Osteoarthritis",
];
const CHRONIC_MANAGEMENT = [
  "Managed with daily oral medication, reviewed quarterly.",
  "Diet-controlled, monitored via routine bloodwork.",
  "Managed with combination therapy, stable on current regimen.",
  "Monitored with home readings, adjusted at each follow-up.",
];
const FAMILY_CONDITIONS = [
  "Heart Disease", "Type 2 Diabetes", "Hypertension", "Breast Cancer",
  "Stroke", "Alzheimer's Disease", "Asthma",
];
const FAMILY_RELATIONS = ["Father", "Mother", "Paternal Uncle", "Maternal Aunt", "Sibling", "Grandfather"];

const INSURANCE_PROVIDERS = [
  "BlueShield Premium Plus", "StarHealth Comprehensive", "CareEdge Family Floater",
  "NationalHealth Secure", "TrustLife Wellness Plan",
];
const INSIGHT_TEMPLATES = [
  {
    type: "Savings Opportunity",
    title: "Switch to generic equivalents",
    description: "Generic substitutes for 2 active prescriptions could reduce out-of-pocket cost by up to 30%.",
  },
  {
    type: "Unused Benefits",
    title: "Annual wellness check-up unused",
    description: "Your plan includes a fully covered annual wellness screening that hasn't been claimed this year.",
  },
  {
    type: "Wellness Bonus",
    title: "Preventive care reward pending",
    description: "Completing this quarter's preventive screening unlocks a premium discount at renewal.",
  },
];
const MED_NAMES = [
  { name: "Piperacillin-Tazobactam", route: "IV", freq: "Every 8 hours" },
  { name: "Ceftriaxone", route: "IV", freq: "Once daily" },
  { name: "Metformin 500mg", route: "PO", freq: "Twice daily" },
  { name: "Telmisartan 40mg", route: "PO", freq: "Once daily" },
  { name: "Atorvastatin 20mg", route: "PO", freq: "Once daily, at night" },
  { name: "Insulin (sliding scale)", route: "SC", freq: "With meals" },
  { name: "Paracetamol 650mg", route: "PO", freq: "As needed" },
  { name: "Enoxaparin 40mg", route: "SC", freq: "Once daily" },
  { name: "Salbutamol nebulization", route: "Inhaled", freq: "Every 6 hours" },
  { name: "Furosemide 20mg", route: "IV", freq: "Twice daily" },
  { name: "Amlodipine 5mg", route: "PO", freq: "Once daily" },
  { name: "Pantoprazole 40mg", route: "PO", freq: "Once daily" },
];

// ---------------------------------------------------------------------------
// TABLE: patients
// ---------------------------------------------------------------------------
export const patients = Array.from({ length: 15 }).map((_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
  const gender = i % 2 === 0 ? "Male" : "Female";
  const age = int(24, 82);
  const ward = pick(WARDS);
  const triage = i < 3 ? "critical" : i < 8 ? "urgent" : "stable";
  const admissionDaysAgo = int(0, 6);

  return {
    id: `p${i + 1}`,
    mrn: `MV${100000 + int(1000, 99999)}`,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    gender,
    age,
    dob: `${int(1, 28)} ${pick(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])} ${2026 - age}`,
    bloodGroup: pick(["A+", "A-", "B+", "B-", "O+", "O-", "AB+"]),
    phone: `+91 9${int(1000, 9999)} ${int(10000, 99999)}`,
    address: `${int(1, 99)}, ${pick(["Green Park","Model Town","Sector 12","Lajpat Nagar","Saket","Vasant Vihar"])}, New Delhi`,
    occupation: pick([
      "Software Engineer", "Retired Bank Officer", "Teacher", "Business Owner",
      "Homemaker", "Civil Engineer", "Accountant", "Retired Army Officer",
    ]),
    emergencyContact: {
      name: `${pick(FIRST_NAMES)} ${last}`,
      relation: pick(["Spouse", "Son", "Daughter", "Sibling"]),
      phone: `+91 9${int(1000, 9999)} ${int(10000, 99999)}`,
    },
    wardId: ward.id,
    wardName: ward.name,
    bed: `Bed ${int(101, 312)}`,
    triage,
    primaryCondition: pick(CONDITIONS),

    // Drug allergies — allergen, reaction severity, and a clinical note/warning.
    drugAllergies: bool(0.4)
      ? [pick(ALLERGY_POOL)]
      : [{ allergen: "None known", severity: "N/A", notes: "No known drug allergies on file." }],

    // Chronic conditions — title, year diagnosed, and how it's being managed.
    chronicConditions: [...new Set([pick(CHRONIC_POOL), pick(CHRONIC_POOL)])].map((title) => ({
      title,
      diagnosedYear: 2026 - int(1, 12),
      management: pick(CHRONIC_MANAGEMENT),
    })),

    // Family history — condition + the relative it was observed in.
    familyHistory: [...new Set([pick(FAMILY_CONDITIONS), pick(FAMILY_CONDITIONS)])].map((condition) => ({
      condition,
      relation: pick(FAMILY_RELATIONS),
    })),

    assignedDoctor: pick(DOCTORS),
    primaryDoctor: null, // set below, mirrors assignedDoctor (the treating physician)
    lastVisit: `${int(1, 28)} ${pick(["Jan","Feb","Mar","Apr","May","Jun","Jul"])} 2026`,
    admissionDate: `2026-09-${String(7 - admissionDaysAgo).padStart(2, "0")}`,
    admissionDay: `Day ${admissionDaysAgo + 1}`,
    readyForDischarge: triage === "stable" && bool(0.4),
    avatarInitials: `${first[0]}${last[0]}`,

    // Insurance & coverage — policy summary shown in the Insurance & Benefits module.
    insurance: (() => {
      const total = pick([2000, 2500, 3000]);
      const met = int(Math.round(total * 0.2), Math.round(total * 0.85));
      return {
        providerName: pick(INSURANCE_PROVIDERS),
        policyId: `#${pick(["BSP", "SHC", "CEF", "NHS", "TLW"])}-${int(1000, 9999)}-${int(1000, 9999)}-X`,
        policyStatus: bool(0.9) ? "Active Policy" : "Renewal Due",
        nextRenewal: `${pick(["Jan", "Feb", "Mar"])} 01, 2027`,
        coverageBreakdown: [
          { label: "Chronic Medication", copay: `Rs ${int(50, 200)}`, coveragePercent: int(70, 95) },
          { label: "Specialist Visits", copay: `Rs ${int(200, 500)}`, coveragePercent: int(60, 90) },
          { label: "ER Admissions", copay: `Rs ${int(500, 1500)}`, coveragePercent: int(80, 100) },
        ],
        deductibleProgress: { met, total },
        insuranceInsights: INSIGHT_TEMPLATES,
      };
    })(),
  };
});

// Mirror assignedDoctor onto primaryDoctor now that both fields exist on the row.
patients.forEach((p) => { p.primaryDoctor = p.assignedDoctor; });

// ---------------------------------------------------------------------------
// TABLE: encounters (one-to-many with patients)
// ---------------------------------------------------------------------------
export const encounters = patients.flatMap((p, pi) => {
  const count = int(1, 3);
  return Array.from({ length: count }).map((_, i) => ({
    id: `e${pi}_${i}`,
    patientId: p.id,
    type: i === 0 ? "IPD" : pick(["OPD", "IPD", "Emergency"]),
    date: `2026-${String(int(6, 9)).padStart(2, "0")}-${String(int(1, 27)).padStart(2, "0")}`,
    doctor: p.assignedDoctor,
    department: pick(["Cardiology", "General Medicine", "Pulmonology", "Orthopedics", "Nephrology"]),
    diagnosis: i === 0 ? p.primaryCondition : pick(CONDITIONS),
    summary: i === 0 ? "Admission encounter" : pick([
      "Routine follow-up", "Post-operative review", "Medication adjustment", "Lab review",
    ]),
  }));
});

// ---------------------------------------------------------------------------
// TABLE: vitals_history (many readings per patient, most recent last)
// Used to compute sparklines and "What Changed?" deltas.
// ---------------------------------------------------------------------------
export const vitals_history = patients.flatMap((p, pi) => {
  const readings = 8; // last 8 readings, ~ every few hours
  const baseTemp = p.triage === "critical" ? 100.5 : p.triage === "urgent" ? 99.2 : 98.4;
  const baseSpo2 = p.triage === "critical" ? 91 : p.triage === "urgent" ? 95 : 98;
  const baseSys = p.triage === "critical" ? 150 : p.triage === "urgent" ? 138 : 122;
  const baseDia = p.triage === "critical" ? 96 : p.triage === "urgent" ? 88 : 78;
  const basePulse = p.triage === "critical" ? 104 : p.triage === "urgent" ? 92 : 76;
  const baseGlucose = p.triage === "critical" ? 160 : p.triage === "urgent" ? 130 : 98;

  return Array.from({ length: readings }).map((_, i) => {
    const drift = (i - readings / 2) * float(-0.4, 0.4);
    const hoursAgo = (readings - i) * 4;
    return {
      id: `v${pi}_${i}`,
      patientId: p.id,
      timestamp: `2026-09-07T${String(Math.max(0, 20 - hoursAgo)).padStart(2, "0")}:00:00`,
      hoursAgoLabel: hoursAgo === 0 ? "Now" : `${hoursAgo}h ago`,
      temp: Number((baseTemp + drift + float(-0.3, 0.3)).toFixed(1)),
      spo2: Math.min(100, Math.max(84, Math.round(baseSpo2 + drift))),
      bpSystolic: Math.round(baseSys + drift * 2),
      bpDiastolic: Math.round(baseDia + drift),
      pulse: Math.round(basePulse + drift * 2),
      respRate: int(14, p.triage === "critical" ? 26 : 20),
      painScore: p.triage === "stable" ? int(0, 2) : int(1, 6),
      glucose: Math.round(baseGlucose + drift * 3),
    };
  });
});

// ---------------------------------------------------------------------------
// TABLE: medications
// ---------------------------------------------------------------------------
export const medications = patients.flatMap((p, pi) => {
  const count = int(2, 4);
  const chosen = Array.from({ length: count }).map(() => pick(MED_NAMES));
  return chosen.map((m, i) => ({
    id: `m${pi}_${i}`,
    patientId: p.id,
    name: m.name,
    route: m.route,
    frequency: m.freq,
    status: bool(0.85) ? "active" : "discontinued",
    startDate: `2026-09-0${int(3, 7)}`,
    prescribedBy: p.assignedDoctor,
  }));
});

// ---------------------------------------------------------------------------
// TABLE: clinical_notes
// ---------------------------------------------------------------------------
export const clinical_notes = patients.flatMap((p, pi) => {
  const relatedEncounter = encounters.find((e) => e.patientId === p.id);
  const count = int(1, 2);
  return Array.from({ length: count }).map((_, i) => ({
    id: `n${pi}_${i}`,
    patientId: p.id,
    encounterId: relatedEncounter?.id,
    type: i === 0 ? "SOAP" : "Progress Note",
    author: p.assignedDoctor,
    date: `2026-09-0${int(5, 7)}`,
    subjective: `Patient reports ${pick(["improving symptoms", "persistent discomfort", "fatigue", "mild breathlessness"])} since last review.`,
    objective: `Temp ${float(97.8, 101.5)}°F, SpO2 ${int(90, 99)}%, alert and oriented.`,
    assessment: p.primaryCondition,
    plan: pick([
      "Continue current management, reassess in 24 hours.",
      "Escalate antibiotics pending culture sensitivity.",
      "Discharge planning initiated, pending final labs.",
      "Increase monitoring frequency, repeat vitals in 4 hours.",
    ]),
    signed: bool(0.7),
  }));
});

// ---------------------------------------------------------------------------
// TABLE: imaging_studies — scans shown in the Medical Imaging section of the
// patient report (chest X-rays, MRIs, CTs, etc.)
// ---------------------------------------------------------------------------
const IMAGING_TEMPLATES = [
  { title: "Chest X-Ray (Post-Op)", modality: "xray", facility: "St. Mary's Radiology" },
  { title: "Lumbar Spine MRI", modality: "mri", facility: "Advanced Diagnostics" },
  { title: "Abdominal Ultrasound", modality: "ultrasound", facility: "Nabha Imaging Center" },
  { title: "Cranial CT Scan", modality: "ct", facility: "Advanced Diagnostics" },
  { title: "Echocardiogram", modality: "echo", facility: "St. Mary's Radiology" },
];

export const imaging_studies = patients.flatMap((p, pi) => {
  const count = int(2, 3);
  return Array.from({ length: count }).map((_, i) => {
    const tmpl = pick(IMAGING_TEMPLATES);
    return {
      id: `img${pi}_${i}`,
      patientId: p.id,
      title: tmpl.title,
      modality: tmpl.modality,
      facility: tmpl.facility,
      date: `${pick(["Aug", "Sep", "Oct"])} ${int(1, 28)}, 2026`,
      status: bool(0.65) ? "ready" : "pending",
    };
  });
});

// ---------------------------------------------------------------------------
// TABLE: ward_inflow — synthetic 14-day admission/discharge trend for BI charts
// ---------------------------------------------------------------------------
export const ward_inflow = Array.from({ length: 14 }).map((_, i) => {
  const day = new Date(2026, 7, 25 + i); // starts 25 Aug 2026
  return {
    date: day.toISOString().slice(0, 10),
    label: day.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
    admissions: int(6, 22),
    discharges: int(4, 18),
    avgWaitMinutes: int(18, 65),
  };
});
