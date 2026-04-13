import React, { useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import ResultsDisplay from './ResultsDisplay';

const ChatHistory = ({ history }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!history || history.length === 0) return null;

  return (
    <div className="chat-history">
      {history.map((entry, idx) => (
        <div key={idx} className="chat-entry">
          {/* User bubble */}
          <div className="chat-row user-row">
            <div className="chat-bubble user-bubble">
              <p>{entry.question}</p>
            </div>
            <div className="chat-avatar user-avatar">U</div>
          </div>

          {/* AI response bubble */}
          <div className="chat-row ai-row">
            <div className="chat-avatar ai-avatar" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',letterSpacing:'-1px'}}>&gt;_</div>
            <div className="chat-bubble ai-bubble">
              {entry.error ? (
                <p className="chat-error">{entry.error}</p>
              ) : (
                <ResultsDisplay results={entry.results} />
              )}
              <div className="chat-timestamp">
                <Clock className="w-3 h-3" />
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatHistory;
