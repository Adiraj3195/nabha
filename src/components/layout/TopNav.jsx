import React, { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  directory: "Patient Directory",
  analytics: "Analytics",
  "ward-rounds": "Ward Rounds",
};

export default function TopNav() {
  const { activePage, globalSearch, setGlobalSearch, navigate } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-5 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-[14px] font-bold text-slate-800 whitespace-nowrap">
          {PAGE_TITLES[activePage] || "Nabha Health"}
        </h1>
        <div className="relative w-72 hidden sm:block">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (activePage !== "directory") navigate("directory");
            }}
            placeholder="Search patients by name or MRN..."
            className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 text-[12.5px] text-slate-700 outline-none focus:border-primary-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-1.5 rounded-md hover:bg-slate-50"
          >
            <Bell size={17} className="text-slate-500" strokeWidth={1.8} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-critical-text ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-9 w-72 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-40">
              <div className="text-[12px] font-bold text-slate-700 px-2 py-1.5">Notifications</div>
              {[
                { text: "Critical potassium — Rahul Kumar", time: "4 min ago", tone: "bg-critical-text" },
                { text: "New lab results — Sneha Reddy", time: "1 hr ago", tone: "bg-warning-text" },
                { text: "Discharge clearance pending — bed 108", time: "2 hr ago", tone: "bg-stable-text" },
              ].map((n, i) => (
                <div key={i} className="flex gap-2 px-2 py-2 border-t border-slate-100 first:border-t-0">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.tone}`} />
                  <div>
                    <div className="text-[12px] text-slate-700">{n.text}</div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200" />

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-[12.5px] font-bold text-slate-800">Dr. Arjun Sharma</div>
            <div className="text-[10.5px] text-slate-400">Cardiologist</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[12px] font-bold">
            AS
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
