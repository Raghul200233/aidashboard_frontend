import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Pulled the chart rendering out of ResultsDisplay — that component was ~220 lines
// and the switch statement alone was half of it.
//
// TODO: the colors array is duplicated from ResultsDisplay — should deduplicate at some point
const chartColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#a78bfa'];

// Custom tooltip — kept the same shape as before
const ChartTooltip = ({ active, payload, label }) => {
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

const axisStyle = { fill: '#94a3b8', fontSize: 11 };
const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.06)' };

// ChartView renders the right chart type based on analysisPlan.chartType
// Expected props: { data: [], analysisPlan: { chartType, groupByColumn, metricColumn } }
function ChartView({ data, analysisPlan }) {
  if (!data || data.length === 0) return null;

  const chartType = analysisPlan?.chartType || 'bar';
  const keys      = Object.keys(data[0]);

  const nameKey = analysisPlan?.groupByColumn && keys.includes(analysisPlan.groupByColumn)
    ? analysisPlan.groupByColumn
    : keys[0];

  const dataKey = analysisPlan?.metricColumn && keys.includes(analysisPlan.metricColumn)
    ? analysisPlan.metricColumn
    : (keys.find(k => k !== nameKey) || keys[1] || keys[0]);

  const commonMargin = { top: 10, right: 20, left: 0, bottom: 40 };

  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={commonMargin}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={nameKey} tick={axisStyle} angle={-35} textAnchor="end" />
          <YAxis tick={axisStyle} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%" cy="50%"
            outerRadius={120}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          >
            {data.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // dual chart — render pie on top, bar underneath
  if (chartType === 'pie_and_bar') {
    return (
      <>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data} dataKey={dataKey} nameKey={nameKey}
              cx="50%" cy="50%" outerRadius={110}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            >
              {data.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '8px 0' }} />

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 6, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey={nameKey} tick={axisStyle} angle={-35} textAnchor="end" />
            <YAxis tick={axisStyle} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </>
    );
  }

  // default: bar chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={commonMargin}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={nameKey} tick={axisStyle} angle={-35} textAnchor="end" />
        <YAxis tick={axisStyle} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChartView;
