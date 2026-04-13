import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from './components/FileUploader';
import QuestionInput from './components/QuestionInput';
import ChatHistory from './components/ChatHistory';
import LoadingSkeleton from './components/LoadingSkeleton';
import DataTable from './components/DataTable';
import ColumnInfo from './components/ColumnInfo';
import { Database, RotateCcw, ChevronDown, ChevronUp, Table2, MessageSquare } from 'lucide-react';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5002';
axios.defaults.timeout = 60000;

function App() {
  const [fileId, setFileId]       = useState(null);
  const [fileName, setFileName]   = useState(null);
  const [fileInfo, setFileInfo]   = useState(null);      // { columns, rowCount }
  const [previewRows, setPreviewRows] = useState([]);    // raw CSV rows for DataTable
  const [structure, setStructure] = useState(null);      // { columns, dataTypes, rowCount }
  const [history, setHistory]     = useState([]);        // chat conversation entries
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [showTable, setShowTable] = useState(true);

  // Fetch preview rows when file is uploaded (non-critical — silent fail)
  useEffect(() => {
    if (!fileId) return;
    axios.get(`/api/data/preview/${fileId}`)
      .then(res => setPreviewRows(res.data.rows || []))
      .catch(err => console.warn('Preview fetch failed (non-critical):', err.message));
  }, [fileId]);

  const handleUploadSuccess = useCallback((data) => {
    setFileId(data.fileId);
    setFileName(data.filename);
    setFileInfo({ columns: data.columns, rowCount: data.rowCount });
    setHistory([]);
    setError(null);
    setPreviewRows([]);
  }, []);

  const handleQuestionSubmit = async (question) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/analysis/query', { fileId, question });

      if (response.data.success) {
        // Extract structure from first successful response
        if (!structure && response.data.structure) {
          setStructure(response.data.structure);
        }
        setHistory(prev => [...prev, {
          question,
          results: response.data,
          timestamp: Date.now(),
        }]);
      } else {
        setError(response.data.error || 'Failed to process question');
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.request) {
        setError('Cannot connect to backend. Please try again in a moment (the server may be waking up).');
      } else if (err.response) {
        setError(`Server error: ${err.response.data?.error || err.response.statusText}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFileId(null);
    setFileName(null);
    setFileInfo(null);
    setPreviewRows([]);
    setStructure(null);
    setHistory([]);
    setError(null);
  };

  // Derive structure from fileInfo if backend didn't return it yet
  const displayStructure = structure || (fileInfo ? {
    columns: fileInfo.columns,
    dataTypes: Object.fromEntries(fileInfo.columns.map(c => [c, 'categorical'])),
    rowCount: fileInfo.rowCount,
  } : null);

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">
            <span className="logo-cli-text">&gt;_</span>
          </div>
          <div className="header-title-group">
            <span className="header-title">DataTalk CLI</span>
            <span className="header-tagline">Natural language · CSV analytics</span>
          </div>
        </div>

        <div className="header-center">
          <div className="header-model-badge">
            <span className="model-dot" />
            Mistral-7B-Instruct
          </div>
          {fileName && (
            <div className="header-file-badge">
              <span className="badge-dot" />
              <Database size={11} />
              {fileName}
              {fileInfo && (
                <span style={{ opacity: 0.65 }}>
                  · {fileInfo.rowCount?.toLocaleString()} rows
                </span>
              )}
            </div>
          )}
        </div>

        <div className="header-actions">
          {fileId && (
            <button className="header-btn" onClick={handleReset} id="btn-reset">
              <RotateCcw size={12} /> New file
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {!fileId ? (
          <div className="upload-screen">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-section">
                <p className="sidebar-label">Dataset Overview</p>
                <ColumnInfo structure={displayStructure} />
              </div>
              <div className="sidebar-table-area">
                <button
                  className="sidebar-toggle"
                  onClick={() => setShowTable(t => !t)}
                  id="btn-toggle-table"
                >
                  <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Table2 size={12} /> Raw Data Preview
                  </span>
                  {showTable ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showTable && previewRows.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <DataTable rows={previewRows} columns={fileInfo?.columns || []} />
                  </div>
                )}
              </div>
            </aside>

            {/* Chat Panel */}
            <section className="chat-panel">
              <div className="chat-scroll-area">
                {history.length === 0 && !loading ? (
                  <div className="chat-empty">
                    <div className="chat-empty-icon">
                      <MessageSquare size={26} color="var(--indigo-light)" />
                    </div>
                    <p className="chat-empty-title">Ask about <strong style={{color:'var(--indigo-light)'}}>{fileName}</strong></p>
                    <p>Use the suggestion chips below or try one of these:</p>
                    <div className="chat-empty-hints">
                      {['📊 Top 5 by sales', '📈 Show trend over time', '🍕 Distribution by category'].map(h => (
                        <div key={h} className="chat-empty-hint">
                          <span className="hint-icon">&gt;_</span>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <ChatHistory history={history} />
                    {loading && <LoadingSkeleton />}
                  </>
                )}
              </div>

              {error && (
                <div className="error-bar">
                  <span>{error}</span>
                  <button onClick={() => setError(null)}>×</button>
                </div>
              )}

              <div className="chat-input-bar">
                <QuestionInput
                  onSubmit={handleQuestionSubmit}
                  loading={loading}
                  disabled={!fileId}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;