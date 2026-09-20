# Nabha Health

A front-end prototype for a clinical operations platform — a patient directory, a 360° patient record view, ward-level analytics, and an interactive AI clinical scribe. Built as a technical showcase: a normalized mock data layer, a modular component architecture, and a compact, clinical design system.

![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-4C5FD1)

## Highlights

- **Normalized mock database** (`src/data/mockDatabase.js`) — five relational "tables" (`patients`, `encounters`, `vitals_history`, `medications`, `clinical_notes`) plus a `ward_inflow` trend table, generated deterministically with a seeded PRNG so the dataset (and every chart) is identical on every run.
- **A real query layer** (`src/data/queries.js`) — filtering, sorting, pagination, joins, and aggregations written the way you'd write a repository/DAO over SQL, so components never touch the raw tables directly.
- **"What Changed?"** — a delta engine that diffs a patient's two most recent vitals readings and classifies each change as an improvement, a stable reading, or a worsening trend with a severity tier.
- **Clinical Analytics dashboard** — Recharts-powered admissions/discharge trend, triage breakdown donut, and ward occupancy bars.
- **AI Clinical Scribe** — a slide-over/modal flow that simulates recording (animated waveform, timer), then produces a structured SOAP note the physician must review and sign before it's considered complete.
- **Design system** — ultra-minimal, light theme: `slate-50` background, white cards, thin borders, small radii, a single muted-blue accent, no gradients or heavy shadows.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  data/
    mockDatabase.js     # the "tables" + seeded generator
    queries.js           # filtering / sorting / joins / aggregates
  context/
    AppContext.jsx        # navigation, selected patient, modal state
  components/
    layout/                # Sidebar, TopNav, AppShell
    ui/                     # Card, Badge, Button, Sparkline
    dashboard/              # KpiCards, ClinicalAnalytics (Recharts)
    patients/               # FilterBar, PatientTable, Pagination,
                             # VitalsGrid, WhatChangedPanel, PatientDetailPanel
    scribe/                 # AIScribeModal
  pages/
    DashboardPage.jsx
    PatientDirectoryPage.jsx
    AnalyticsPage.jsx
    WardRoundsPage.jsx
```

## Notes

This is a front-end prototype: all data lives in memory and resets on reload. The query layer is deliberately written so that swapping it for real API calls (REST or GraphQL) would not require any changes in the component layer — every component reads through `src/data/queries.js`, never the raw tables.
