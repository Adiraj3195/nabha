import React from "react";
import {
  LayoutGrid, Users, Stethoscope, ChevronsLeft, ChevronsRight, Plus,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "directory", label: "Patient Directory", icon: Users },
  { key: "ward-rounds", label: "Ward Rounds", icon: Stethoscope },
];

export default function Sidebar() {
  const { activePage, navigate, sidebarCollapsed, setSidebarCollapsed, openScribe } = useApp();
  const collapsed = sidebarCollapsed;

  return (
    <aside
      className={`h-screen sticky top-0 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ${
        collapsed ? "w-[64px]" : "w-[228px]"
      }`}
    >
      <div className="h-14 flex items-center px-3 border-b border-slate-200 gap-2">
        <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">+</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-[15px] text-slate-800 truncate">Nabha Health</span>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                active
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.3 : 1.9} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        <button
          onClick={() => openScribe(null)}
          title={collapsed ? "Start AI Scribe" : undefined}
          className="mt-2 flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} strokeWidth={2.3} className="flex-shrink-0" />
          {!collapsed && <span>AI Scribe</span>}
        </button>
      </nav>

      <div className="p-2 border-t border-slate-200">
        <button
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 text-xs"
        >
          {collapsed ? <ChevronsRight size={15} /> : (
            <>
              <ChevronsLeft size={15} /> <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
