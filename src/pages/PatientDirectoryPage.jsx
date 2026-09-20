import React, { useMemo, useState, useEffect } from "react";
import FilterBar from "../components/patients/FilterBar";
import PatientTable from "../components/patients/PatientTable";
import Pagination from "../components/patients/Pagination";
import Card from "../components/ui/Card";
import { filterPatients, sortPatients, paginate } from "../data/queries";
import { useApp } from "../context/AppContext";

const PAGE_SIZE = 8;

export default function PatientDirectoryPage() {
  const { globalSearch, setGlobalSearch } = useApp();
  const [filters, setFilters] = useState({ search: "", wards: [], triage: [], conditions: [] });
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  // Sync the top-nav global search into the directory's own search filter.
  useEffect(() => {
    if (globalSearch) {
      setFilters((f) => ({ ...f, search: globalSearch }));
      setGlobalSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalSearch]);

  useEffect(() => setPage(1), [filters]);

  const filtered = useMemo(() => filterPatients(filters), [filters]);
  const sorted = useMemo(() => sortPatients(filtered, sortKey, sortDirection), [filtered, sortKey, sortDirection]);
  const { rows, total, totalPages } = useMemo(() => paginate(sorted, page, PAGE_SIZE), [sorted, page]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[19px] font-extrabold text-slate-800">Patient Directory</h1>
        <p className="text-[12.5px] text-slate-400 mt-0.5">
          {total} patient{total !== 1 ? "s" : ""} match the current filters.
        </p>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <Card padded={false} className="p-2">
        <PatientTable rows={rows} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
        <div className="px-2 pb-1">
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
