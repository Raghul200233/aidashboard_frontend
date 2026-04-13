import React from 'react';

const LoadingSkeleton = () => (
  <div className="skeleton-wrapper" aria-label="Loading AI analysis...">
    {/* User bubble placeholder */}
    <div className="skeleton-bubble user">
      <div className="skeleton-user-pill" />
      <div className="chat-avatar user-avatar" style={{ opacity: 0.4 }}>U</div>
    </div>

    {/* AI response placeholder */}
    <div className="skeleton-bubble ai">
      <div className="chat-avatar ai-avatar" style={{ opacity: 0.4 }}>AI</div>
      <div className="skeleton-ai-card">
        <div className="skeleton-insight">
          <div className="skeleton-icon" />
          <div className="skeleton-lines">
            <div className="skeleton-line w-full" />
            <div className="skeleton-line w-4\/5" />
            <div className="skeleton-line w-3\/5" />
          </div>
        </div>
        <div className="skeleton-chart">
          <div className="skeleton-bars">
            {[55, 80, 45, 90, 65, 50, 75].map((h, i) => (
              <div key={i} className="skeleton-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
