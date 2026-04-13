import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Lightbulb, TrendingUp, MessageCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#a78bfa'];

/* ── Custom chart tooltip ─────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="tooltip-value" style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Render bold + lists from markdown-lite text ─────────────────────────── */
const renderTextAnswer = (text) => {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, i) => {
    // Numbered list line  "1. Something"
    const listMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (listMatch) {
      return (
        <div key={i} className="text-answer-list-item">
          <span className="text-answer-num">{listMatch[1]}.</span>
          <span>{renderBold(listMatch[2])}</span>
        </div>
      );
    }

    // Bullet line "• Something" or "- Something"
    const bulletMatch = line.match(/^[•-]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div key={i} className="text-answer-list-item">
          <span className="text-answer-bullet">•</span>
          <span>{renderBold(bulletMatch[1])}</span>
        </div>
      );
    }

    // Blank line → spacer
    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;

    // Regular paragraph
    return <p key={i} className="text-answer-para">{renderBold(line)}</p>;
  });
};

/* Convert **bold** markers to <strong> */
const renderBold = (text) => {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-answer-bold">{part}</strong> : part
  );
};

/* ── Main component ───────────────────────────────────────────────────────── */
const ResultsDisplay = ({ results }) => {
  const {
    responseType = 'chart',
    textAnswer,
    results: data,
    summary,
    analysisPlan
  } = results;

  /* ── TEXT-ONLY response ─────────────────────────────────────────────────── */
  if (responseType === 'text') {
    return (
      <div className="results-wrapper">
        <div className="text-answer-card">
          <div className="text-answer-header">
            <div className="text-answer-icon">
              <MessageCircle size={15} />
            </div>
            <span className="text-answer-label">{analysisPlan?.title || 'Answer'}</span>
          </div>
          <div className="text-answer-body">
            {renderTextAnswer(textAnswer)}
          </div>
        </div>
      </div>
    );
  }

  /* ── CHART response ─────────────────────────────────────────────────────── */
  const renderChart = () => {
    if (!data || data.length === 0) return null;
    const chartType = analysisPlan?.chartType || 'bar';
    const keys = Object.keys(data[0]);
    const nameKey = analysisPlan?.groupByColumn && keys.includes(analysisPlan.groupByColumn)
      ? analysisPlan.groupByColumn : keys[0];
    const dataKey = analysisPlan?.metricColumn && keys.includes(analysisPlan.metricColumn)
      ? analysisPlan.metricColumn
      : (keys.find(k => k !== nameKey) || keys[1] || keys[0]);

    const commonProps = { margin: { top: 10, right: 20, left: 0, bottom: 40 } };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey={nameKey} tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Line type="monotone" dataKey={dataKey} stroke="#6366f1" strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey={dataKey} nameKey={nameKey}
                cx="50%" cy="50%" outerRadius={120}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'pie_and_bar':
        return (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data} dataKey={dataKey} nameKey={nameKey}
                  cx="50%" cy="50%" outerRadius={110}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '8px 0' }} />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data} margin={{ top: 6, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey={nameKey} tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey={nameKey} tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="results-wrapper">
      {/* Insight summary */}
      {summary && (
        <div className="insight-card">
          <div className="insight-icon"><Lightbulb size={14} /></div>
          <p className="insight-text">{summary}</p>
        </div>
      )}

      {/* Chart */}
      {data && data.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <TrendingUp size={13} color="var(--indigo-light)" />
            <span className="chart-card-title">
              {analysisPlan?.title || (
                analysisPlan?.chartType === 'line' ? 'Trend' :
                analysisPlan?.chartType === 'pie_and_bar' ? 'Distribution' :
                analysisPlan?.chartType === 'pie' ? 'Distribution' : 'Comparison'
              )}
            </span>
          </div>
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;