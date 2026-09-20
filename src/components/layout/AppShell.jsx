import React from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { useApp } from "../../context/AppContext";

import DashboardPage from "../../pages/DashboardPage";
import PatientDirectoryPage from "../../pages/PatientDirectoryPage";
import WardRoundsPage from "../../pages/WardRoundsPage";
import PatientDetailPanel from "../patients/PatientDetailPanel";
import AIScribeModal from "../scribe/AIScribeModal";

const PAGES = {
  dashboard: DashboardPage,
  directory: PatientDirectoryPage,
  "ward-rounds": WardRoundsPage,
};

export default function AppShell() {
  const { activePage } = useApp();
  const PageComponent = PAGES[activePage] || DashboardPage;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-5 max-w-[1400px] w-full mx-auto">
          <PageComponent />
        </main>
      </div>

      {/* Global overlays — mounted once, driven entirely by context state */}
      <PatientDetailPanel />
      <AIScribeModal />
    </div>
  );
}
