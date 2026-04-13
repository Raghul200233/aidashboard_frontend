import { useState, useCallback } from 'react';
import apiClient from '../api/client';

// Extracted from App.js — it was getting long and this chunk felt self-contained.
// NOTE: fileId still lives in App.js state (passed in as a param here).
//       Debated moving it in here too but then the upload logic gets tangled.
//       Good enough for now.

function useQueryHistory() {
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [queryError, setQueryError] = useState(null);

  const submitQuestion = useCallback(async (fileId, question, onStructure) => {
    if (!fileId || !question?.trim()) return;

    setLoading(true);
    setQueryError(null);

    try {
      const res = await apiClient.post('/api/analysis/query', { fileId, question });

      if (res.data.success) {
        // first successful query usually includes structure — bubble it up
        if (res.data.structure && typeof onStructure === 'function') {
          onStructure(res.data.structure);
        }

        console.log('[useQueryHistory] got result, type:', res.data.responseType);

        setHistory(prev => [
          ...prev,
          {
            question,
            results:   res.data,
            timestamp: Date.now(),
          },
        ]);
      } else {
        setQueryError(res.data.error || 'Something went wrong');
      }

    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.request) {
        setQueryError('Cannot reach the server. It may be starting up — try again in a moment.');
      } else if (err.response) {
        setQueryError(`Server error: ${err.response.data?.error || err.response.statusText}`);
      } else {
        setQueryError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setQueryError(null);
  }, []);

  return {
    history,
    loading,
    queryError,
    setQueryError,
    submitQuestion,
    clearHistory,
  };
}

export default useQueryHistory;
