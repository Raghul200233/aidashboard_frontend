import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const FileUploader = ({ onUploadSuccess }) => {
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
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

  const getDropzoneClass = () => {
    if (isDragReject) return 'dropzone dropzone-reject';
    if (isDragActive) return 'dropzone dropzone-active';
    if (status === 'success') return 'dropzone dropzone-success';
    if (status === 'error') return 'dropzone dropzone-error';
    return 'dropzone';
  };

  return (
    <div className="uploader-wrapper">
      <div className="uploader-hero">
        <div className="uploader-logo-ring">
          <div className="uploader-logo-bg">
            <span className="uploader-logo-text">&gt;_</span>
          </div>
          <div className="uploader-logo-glow" />
        </div>
        <div className="uploader-ai-badge">
          <div className="ai-badge-icon cli-badge-icon">&gt;_</div>
          Mistral-7B-Instruct · CSV Analytics Engine
        </div>
        <h2 className="uploader-title">DataTalk CLI</h2>
        <p className="uploader-subtitle">Drop a CSV and query it in plain English — get instant charts, counts and insights.</p>
      </div>

      <div {...getRootProps()} className={getDropzoneClass()}>
        <input {...getInputProps()} />

        {status === 'uploading' && (
          <div className="drop-state">
            <Loader className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
            <p className="drop-label">Parsing your file…</p>
          </div>
        )}
        {status === 'success' && (
          <div className="drop-state">
            <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
            <p className="drop-label text-emerald-400">Upload successful!</p>
          </div>
        )}
        {status === 'error' && (
          <div className="drop-state">
            <AlertCircle className="w-10 h-10 text-rose-400 mb-4" />
            <p className="drop-label text-rose-400">{errorMsg}</p>
            <button onClick={() => setStatus('idle')} className="retry-btn">Try again</button>
          </div>
        )}
        {(status === 'idle') && (
          <div className="drop-state">
            {isDragActive ? (
              <>
                <div className="drop-icon-wrap" style={{background:'rgba(99,102,241,0.2)', borderColor:'var(--indigo)'}}>
                  <FileText size={24} />
                </div>
                <p className="drop-label" style={{color:'var(--indigo-light)'}}>Drop it here!</p>
              </>
            ) : (
              <>
                <div className="drop-icon-wrap">
                  <Upload size={24} />
                </div>
                <p className="drop-label">Drag &amp; drop a CSV file here</p>
                <p className="drop-sub">or <span className="drop-browse">click to browse</span></p>
                <p className="drop-hint">Max 10 MB · CSV only</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="uploader-features">
        {['$ ask in plain english', '> instant chart output', '~ csv · no sql needed'].map(f => (
          <div key={f} className="feature-chip cli-chip">
            <span className="feature-dot" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;