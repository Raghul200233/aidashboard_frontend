import axios from 'axios';

// Pulled this out of App.js when it got messy having axios config inline next to JSX.
// The base URL lives in .env as REACT_APP_API_URL — defaults to localhost for dev.

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s — HuggingFace inference can take a while on free tier
});

// could add request/response interceptors here later if we need auth or retry

export default apiClient;
