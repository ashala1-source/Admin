import React from 'react';
import './FeedbackButton.css';

export default function FeedbackButton() {
  const handleFeedbackClick = () => {
    const FEEDBACK_URL = 'https://forms.office.com/e/ysTHxSsYgW';
    window.open(FEEDBACK_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleFeedbackClick}
      className="feedback-button"
      aria-label="Provide Feedback"
      title="Provide Feedback"
    >
      📝 Provide Feedback
    </button>
  );
}