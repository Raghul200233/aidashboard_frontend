import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader,
  MessageSquare, BarChart2, Search, Zap, Database, Shield,
} from 'lucide-react';
import axios from 'axios';

// ── feature cards shown on the landing page ──────────────────────────────────
const FEATURES = [
  {
    icon: <MessageSquare size={18} />,
    title: 'Natural Language',
    desc: 'Ask questions in plain English — no SQL, no formulas, no learning curve.',
  },
  {
    icon: <BarChart2 size={18} />,
    title: 'Instant Charts',
    desc: 'Bar, line, pie, and dual-chart visualisations generated from your data automatically.',
  },
  {
    icon: <Search size={18} />,
    title: 'Smart Lookup',
    desc: 'Find records by name, phone, order ID, product code, or any value across all columns.',
  },
  {
    icon: <Zap size={18} />,
    title: 'Mistral-7B AI',
    desc: 'Powered by a 7-billion parameter instruction model hosted on HuggingFace Inference.',
  },
  {
    icon: <Database size={18} />,
    title: 'CSV Native',
    desc: 'Upload any CSV — sales, logistics, HR, finance. Zero config, works instantly.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Private by Default',
    desc: 'Your file is stored in-memory only. Nothing persists. No data leaves your session.',
  },
];

// ── example query pills ───────────────────────────────────────────────────────
const EXAMPLES = [
  'What is the status of order 10222?',
  'Top 5 customers by sales',
  'Show distribution of product lines',
  'Average sales by category',
  'Find customer with phone 6505555787',
  'How many orders are shipped?',
  'Sales trend over time',
  'Show all orders for Gift Depot Inc',
];

// ── tech stack pills ──────────────────────────────────────────────────────────
const STACK = [
  { label: 'React 18', color: '#61dafb' },
  { label: 'Node.js', color: '#8cc84b' },
  { label: 'Express', color: '#aaa' },
  { label: 'Mistral-7B', color: '#a78bfa' },
  { label: 'HuggingFace', color: '#fbbf24' },
  { label: 'Recharts', color: '#f97316' },
];

// ─────────────────────────────────────────────────────────────────────────────

const FileUploader = ({ onUploadSuccess }) => {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5002';
      const response = await axios.post(`${apiBase}/api/upload`, formData);
      setStatus('success');
      setTimeout(() => onUploadSuccess(response.data), 600);
    } catch (error) {
      setStatus('error');
      setErrorMsg(error.response?.data?.error || 'Upload failed. Please try again.');
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    disabled: status === 'uploading',
  });

  const dropClass = isDragReject ? 'dropzone dropzone-reject'
    : isDragActive              ? 'dropzone dropzone-active'
    : status === 'success'      ? 'dropzone dropzone-success'
    : status === 'error'        ? 'dropzone dropzone-error'
    : 'dropzone';

  return (
    <div className="landing-page">

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="landing-logo-ring">
          <div className="landing-logo-bg">
            <span className="landing-logo-text">&gt;_</span>
          </div>
          <div className="landing-logo-glow" />
        </div>

        <div className="landing-badge">
          <span className="landing-badge-dot" />
          Powered by Mistral-7B-Instruct · HuggingFace Inference
        </div>

        <h1 className="landing-title">DataTalk CLI</h1>
        <p className="landing-tagline">
          Talk to your CSV data in plain English.<br />
          Get instant charts, counts, lookups &amp; insights — no SQL required.
        </p>

        {/* ── DROPZONE ── */}
        <div {...getRootProps()} className={dropClass} id="dropzone-upload">
          <input {...getInputProps()} />

          {status === 'uploading' && (
            <div className="drop-state">
              <Loader size={28} className="spin-icon" />
              <p className="drop-label">Parsing your file…</p>
            </div>
          )}
          {status === 'success' && (
            <div className="drop-state">
              <CheckCircle size={28} color="var(--green)" />
              <p className="drop-label" style={{ color: 'var(--green)' }}>Upload successful!</p>
            </div>
          )}
          {status === 'error' && (
            <div className="drop-state">
              <AlertCircle size={28} color="var(--red)" />
              <p className="drop-label" style={{ color: 'var(--red)' }}>{errorMsg}</p>
              <button onClick={() => setStatus('idle')} className="retry-btn">Try again</button>
            </div>
          )}
          {status === 'idle' && (
            <div className="drop-state">
              {isDragActive ? (
                <>
                  <div className="drop-icon-wrap drop-icon-active"><FileText size={22} /></div>
                  <p className="drop-label">Drop it — we'll do the rest!</p>
                </>
              ) : (
                <>
                  <div className="drop-icon-wrap"><Upload size={22} /></div>
                  <p className="drop-label">Drag &amp; drop a CSV file here</p>
                  <p className="drop-sub">or <span className="drop-browse">click to browse</span></p>
                  <p className="drop-hint">CSV only · Max 10 MB · Instant analysis</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── EXAMPLE QUERIES ── */}
        <div className="landing-examples">
          <p className="landing-examples-label">&gt;_ try asking:</p>
          <div className="landing-examples-pills">
            {EXAMPLES.map(ex => (
              <span key={ex} className="example-pill">{ex}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need to analyse data fast</h2>
        <div className="landing-features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-how">
        <h2 className="landing-section-title">How it works</h2>
        <div className="landing-steps">
          {[
            { n: '01', title: 'Upload your CSV', desc: 'Drag and drop any CSV file. The data is parsed instantly and held in memory.' },
            { n: '02', title: 'Ask in plain English', desc: 'Type any question — "top 5 by sales", "status of order 10222", "show pie chart of categories".' },
            { n: '03', title: 'Mistral-7B parses your intent', desc: 'Our AI backend classifies your query into lookup, count, chart, trend, distribution and more.' },
            { n: '04', title: 'Get instant answers', desc: 'Results appear as formatted text, bar charts, line charts, pie charts — or exact row lookups.' },
          ].map(s => (
            <div key={s.n} className="landing-step">
              <div className="landing-step-num">{s.n}</div>
              <div className="landing-step-body">
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="landing-stack">
        <p className="landing-stack-label">Built with</p>
        <div className="landing-stack-pills">
          {STACK.map(s => (
            <span key={s.label} className="stack-pill" style={{ '--pill-color': s.color }}>
              <span className="stack-pill-dot" />
              {s.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <span className="landing-footer-logo">&gt;_</span>
        <span>DataTalk CLI · Open source · Built for fast data exploration</span>
      </footer>

    </div>
  );
};

export default FileUploader;