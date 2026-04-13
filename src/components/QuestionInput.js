import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Show top 5 by sales',
  'Monthly trend analysis',
  'Highest revenue region',
  'Compare categories',
  'Show distribution',
];

const QuestionInput = ({ onSubmit, loading, disabled }) => {
  const [question, setQuestion] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !loading && !disabled) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  const handleSuggestion = (s) => {
    setQuestion(s);
    inputRef.current?.focus();
  };

  return (
    <div className="question-input-wrapper">
      <div className="suggestions-row">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            disabled={loading || disabled}
            className="suggestion-chip"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your data…"
          className="question-input"
          disabled={loading || disabled}
          id="question-input"
        />
        <button
          type="submit"
          id="question-submit"
          disabled={loading || !question.trim() || disabled}
          className="question-submit"
        >
          {loading
            ? <Loader className="w-5 h-5 animate-spin" />
            : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default QuestionInput;