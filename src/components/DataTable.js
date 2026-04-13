import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const PAGE_SIZE = 10;

const DataTable = ({ rows, columns }) => {
  const [page, setPage] = useState(0);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  const filtered = search
    ? rows.filter(row =>
        Object.values(row).some(v =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      )
    : rows;

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortCol];
        const bVal = b[sortCol];
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        const cmp = !isNaN(aNum) && !isNaN(bNum)
          ? aNum - bNum
          : String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(0);
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-indigo-400" />
      : <ArrowDown className="w-3 h-3 text-indigo-400" />;
  };

  return (
    <div className="data-table-wrapper">
      <div className="data-table-header">
        <span className="data-table-count">{sorted.length} rows</span>
        <input
          type="text"
          placeholder="Search data..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="data-table-search"
        />
      </div>

      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th className="data-table-th row-num">#</th>
              {columns.map(col => (
                <th key={col} className="data-table-th" onClick={() => handleSort(col)}>
                  <span className="th-inner">
                    {col}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={i} className="data-table-row">
                <td className="data-table-td row-num">{page * PAGE_SIZE + i + 1}</td>
                {columns.map(col => (
                  <td key={col} className="data-table-td">{row[col] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="data-table-pagination">
          <button onClick={() => setPage(0)} disabled={page === 0} className="page-btn"><ChevronsLeft className="w-4 h-4" /></button>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="page-btn"><ChevronLeft className="w-4 h-4" /></button>
          <span className="page-info">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="page-btn"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="page-btn"><ChevronsRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
