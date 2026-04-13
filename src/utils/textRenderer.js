import React from 'react';

// renderBold + renderTextAnswer were living inside ResultsDisplay.js
// but that file was already doing too much. Pulled them out here.

// converts **bold** markers to <strong>
export function renderBold(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-answer-bold">{part}</strong>
      : part
  );
}

// renders a markdown-lite text block (numbered lists, bullets, bold, paragraphs)
export function renderTextAnswer(text) {
  if (!text) return null;

  return text.split('\n').map((line, i) => {
    // numbered list line: "1. Something"
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      return (
        <div key={i} className="text-answer-list-item">
          <span className="text-answer-num">{numMatch[1]}.</span>
          <span>{renderBold(numMatch[2])}</span>
        </div>
      );
    }

    // bullet line: "• something" or "- something"
    const bulletMatch = line.match(/^[•\-]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div key={i} className="text-answer-list-item">
          <span className="text-answer-bullet">•</span>
          <span>{renderBold(bulletMatch[1])}</span>
        </div>
      );
    }

    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;

    return <p key={i} className="text-answer-para">{renderBold(line)}</p>;
  });
}
