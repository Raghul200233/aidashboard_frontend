import React from 'react';
import { Hash, Type, Calendar, BarChart2, Rows } from 'lucide-react';

const ColumnInfo = ({ structure }) => {
  if (!structure) return null;
  const { columns, dataTypes, rowCount } = structure;

  const numericCount     = columns?.filter(c => dataTypes?.[c] === 'numeric').length || 0;
  const categoricalCount = columns?.filter(c => dataTypes?.[c] === 'categorical').length || 0;

  const typeIcon = (type) => {
    if (type === 'numeric')     return <Hash size={10} />;
    if (type === 'date')        return <Calendar size={10} />;
    return <Type size={10} />;
  };

  const typeLabel = (type) => {
    if (type === 'numeric')     return 'num';
    if (type === 'date')        return 'date';
    return 'cat';
  };

  return (
    <div className="column-info">
      <div className="column-stats-row">
        <div className="column-stat-card">
          <Rows size={13} className="stat-icon" />
          <span className="stat-value">{rowCount?.toLocaleString() ?? '—'}</span>
          <span className="stat-label">rows</span>
        </div>
        <div className="column-stat-card">
          <BarChart2 size={13} className="stat-icon" />
          <span className="stat-value">{columns?.length ?? '—'}</span>
          <span className="stat-label">cols</span>
        </div>
        <div className="column-stat-card">
          <Hash size={13} className="stat-icon" style={{color:'var(--indigo-light)'}} />
          <span className="stat-value">{numericCount}</span>
          <span className="stat-label">numeric</span>
        </div>
        <div className="column-stat-card">
          <Type size={13} className="stat-icon" style={{color:'var(--purple-light)'}} />
          <span className="stat-value">{categoricalCount}</span>
          <span className="stat-label">categ.</span>
        </div>
      </div>

      <div className="column-info-divider" />

      <div className="column-pills">
        {columns?.map(col => (
          <span key={col} className={`column-pill ${dataTypes?.[col] || 'categorical'}`}>
            {typeIcon(dataTypes?.[col])}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{col}</span>
            <span className="pill-type-tag">{typeLabel(dataTypes?.[col])}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ColumnInfo;
