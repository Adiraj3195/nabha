import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

/**
 * AppContext
 * -----------------------------------------------------------------------
 * Single source of truth for cross-cutting UI state: which page is active,
 * whether the sidebar is collapsed, which patient is open in the 360° view,
 * and whether the AI Scribe modal is showing. Keeping this in one context
 * (rather than prop-drilling through the shell) is what lets navigation,
 * the patient directory's filters, and modal interactions all stay in sync
 * without extra plumbing.
 * -----------------------------------------------------------------------
 */

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState("dashboard"); // dashboard | directory | ward-rounds
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [scribeOpen, setScribeOpen] = useState(false);
  const [scribePatientId, setScribePatientId] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");

  const navigate = useCallback((page) => {
    setActivePage(page);
    setSelectedPatientId(null);
  }, []);

  const openPatient = useCallback((patientId) => {
    setSelectedPatientId(patientId);
  }, []);

  const closePatient = useCallback(() => setSelectedPatientId(null), []);

  const openScribe = useCallback((patientId = null) => {
    setScribePatientId(patientId);
    setScribeOpen(true);
  }, []);

  const closeScribe = useCallback(() => setScribeOpen(false), []);

  const value = useMemo(
    () => ({
      activePage,
      navigate,
      sidebarCollapsed,
      setSidebarCollapsed,
      selectedPatientId,
      openPatient,
      closePatient,
      scribeOpen,
      scribePatientId,
      openScribe,
      closeScribe,
      globalSearch,
      setGlobalSearch,
    }),
    [
      activePage,
      navigate,
      sidebarCollapsed,
      selectedPatientId,
      openPatient,
      closePatient,
      scribeOpen,
      scribePatientId,
      openScribe,
      closeScribe,
      globalSearch,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
