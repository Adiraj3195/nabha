# Nabha Health

A front-end prototype for a clinical operations platform — a patient directory, a 360° patient record view, ward-level analytics, and an interactive AI clinical scribe. Built as a technical showcase: a normalized mock data layer, a modular component architecture, and a compact, clinical design system.

![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-4C5FD1)

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
