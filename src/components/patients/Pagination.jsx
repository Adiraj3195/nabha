import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <span className="text-[11.5px] text-slate-400">
        Showing <span className="font-semibold text-slate-600">{from}–{to}</span> of{" "}
        <span className="font-semibold text-slate-600">{total}</span> patients
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-[11.5px] text-slate-500 px-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
